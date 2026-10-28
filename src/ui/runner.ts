import { compile, Machine } from '../lang/interpreter';
import type { Token } from '../lang/lexer';
import type { LogoError, Mode } from '../lang/types';
import type { Scene } from './geom';

export type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error';

export const SPEEDS = [2, 6, 20, 60, 200, 600, 2500, Infinity];
export const SPEED_LABELS = ['bardzo wolno', 'wolno', 'umiarkowanie', 'szybko', 'bardzo szybko', 'ekspresowo', 'turbo', 'natychmiast'];

const INITIAL_POSE = {
  pos: [0, 0, 0] as [number, number, number], h: [0, 1, 0] as [number, number, number],
  r: [1, 0, 0] as [number, number, number], u: [0, 0, 1] as [number, number, number],
  pen: true, color: '#16866a', width: 3,
};

export class Runner {
  state: RunState = 'idle';
  machine: Machine | null = null;
  error: LogoError | null = null;
  /** Line of the last executed command while running / stepping. */
  line: number | null = null;
  speed = 5;
  onChange: () => void = () => {};
  /** Called whenever the picture changed. */
  onDraw: () => void = () => {};
  private gen: Generator<Token, void, void> | null = null;
  private raf = 0;
  private last = 0;
  private acc = 0;
  steps = 0;

  scene(): Scene {
    return this.machine
      ? { segments: this.machine.segments, pose: this.machine.pose() }
      : { segments: [], pose: { ...INITIAL_POSE } };
  }

  get active(): boolean {
    return this.state === 'running' || this.state === 'paused';
  }

  private emit(): void {
    this.onChange();
    this.onDraw();
  }

  private begin(src: string, mode: Mode): boolean {
    this.halt();
    this.error = null;
    this.line = null;
    this.steps = 0;
    const c = compile(src, mode);
    if (c.error) {
      this.machine = null;
      this.gen = null;
      this.error = c.error;
      this.state = 'error';
      this.emit();
      return false;
    }
    this.machine = new Machine(c.program, mode);
    this.gen = this.machine.steps();
    return true;
  }

  /** Starts a run; returns the parse-time error, if any. */
  start(src: string, mode: Mode, opts: { instant?: boolean } = {}): LogoError | null {
    if (!this.begin(src, mode)) return this.error;
    if (opts.instant || SPEEDS[this.speed - 1] === Infinity) {
      this.drain();
      return null;
    }
    this.state = 'running';
    this.last = 0;
    this.acc = 0;
    this.emit();
    this.raf = requestAnimationFrame((t) => this.frame(t));
    return null;
  }

  private drain(): void {
    while (this.gen && !this.gen.next().done) this.steps++;
    this.finish();
  }

  private finish(): void {
    this.gen = null;
    this.line = null;
    if (this.machine?.error) {
      this.error = this.machine.error;
      this.state = 'error';
    } else {
      this.state = 'done';
    }
    this.emit();
  }

  private advance(): void {
    if (!this.gen) return;
    const r = this.gen.next();
    if (r.done) this.finish();
    else {
      this.steps++;
      this.line = r.value.line;
    }
  }

  private frame(t: number): void {
    this.raf = 0;
    if (this.state !== 'running') return;
    const dt = this.last ? Math.min(t - this.last, 100) : 16;
    this.last = t;
    const rate = SPEEDS[this.speed - 1];
    this.acc += (dt / 1000) * rate;
    let n = Math.floor(this.acc);
    this.acc -= n;
    n = Math.min(n, 50000);
    while (n-- > 0 && this.state === 'running' && this.gen) this.advance();
    if (this.state === 'running') {
      this.emit();
      this.raf = requestAnimationFrame((tt) => this.frame(tt));
    }
  }

  step(src: string, mode: Mode): LogoError | null {
    if (this.state === 'running') {
      this.pause();
      return null;
    }
    if (this.state !== 'paused') {
      if (!this.begin(src, mode)) return this.error;
      this.state = 'paused';
    }
    this.advance();
    this.emit();
    return null;
  }

  pause(): void {
    if (this.state !== 'running') return;
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.state = 'paused';
    this.emit();
  }

  resume(): void {
    if (this.state !== 'paused') return;
    if (SPEEDS[this.speed - 1] === Infinity) {
      this.drain();
      return;
    }
    this.state = 'running';
    this.last = 0;
    this.acc = 0;
    this.emit();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  dismissError(): void {
    this.error = null;
    if (this.state === 'error') this.state = 'idle';
    this.emit();
  }

  /** Stops execution but keeps the drawing (used when the source is edited). */
  cancel(): void {
    if (!this.active) return;
    this.halt();
    this.gen = null;
    this.line = null;
    this.state = 'idle';
    this.emit();
  }

  reset(): void {
    this.halt();
    this.gen = null;
    this.machine = null;
    this.error = null;
    this.line = null;
    this.steps = 0;
    this.state = 'idle';
    this.emit();
  }

  private halt(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }
}
