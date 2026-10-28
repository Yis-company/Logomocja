import type { SourceSpan } from '../lang/errors';
import { initialTurtle, rotateState, type Outcome, type Segment, type Step, type TurtleState } from '../lang/interpreter';
import type { Scene } from '../render/scene';

export const SPEED_MIN = 1;
export const SPEED_MAX = 10;
/** Speed factors for levels 1–9; level 10 draws instantly. */
const FACTORS = [0.3, 0.55, 1, 1.8, 3.2, 6, 12, 28, 80];

export function speedLabel(level: number): string {
  if (level >= SPEED_MAX) return 'natychmiast';
  if (level <= 2) return 'bardzo wolno';
  if (level <= 4) return 'wolno';
  if (level <= 6) return 'średnio';
  if (level <= 8) return 'szybko';
  return 'bardzo szybko';
}

export interface PlayerView {
  scene: Scene;
  /** Source position of the operation shown (in progress or just finished). */
  at: SourceSpan | null;
  /** Number of completed steps and the total. */
  done: number;
  total: number;
}

function lerp(a: readonly number[], b: readonly number[], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/**
 * Plays back a recorded run: steps are animated with durations that depend on
 * the distance moved or the angle turned, scaled by the speed level.
 */
export class Player {
  outcome: Outcome | null = null;
  /** Number of fully completed steps. */
  index = 0;
  /** Seconds spent in the current (index-th) step. */
  progress = 0;
  playing = false;
  speed = 6;
  ghost: readonly Segment[] | null = null;
  private stepUntil = -1;
  private raf = 0;
  private last = 0;

  constructor(
    private readonly onFrame: (view: PlayerView) => void,
    private readonly onEnd: () => void,
  ) {}

  get steps(): Step[] {
    return this.outcome?.steps ?? [];
  }

  get finished(): boolean {
    return !!this.outcome && this.index >= this.steps.length;
  }

  get started(): boolean {
    return this.index > 0 || this.progress > 0;
  }

  load(outcome: Outcome): void {
    this.halt();
    this.outcome = outcome;
    this.index = 0;
    this.progress = 0;
    this.stepUntil = -1;
  }

  clear(): void {
    this.halt();
    this.outcome = null;
    this.index = 0;
    this.progress = 0;
  }

  play(): void {
    if (!this.outcome) return;
    this.stepUntil = -1;
    if (this.speed >= SPEED_MAX) {
      this.toEnd();
      return;
    }
    this.start();
  }

  /** Advances by one operation (finishing the current one if it is half-drawn). */
  step(): void {
    if (!this.outcome || this.finished) return;
    if (this.progress > 0) {
      this.halt();
      this.index++;
      this.progress = 0;
      this.emit();
      if (this.finished) this.onEnd();
      return;
    }
    this.stepUntil = this.index + 1;
    this.start();
  }

  pause(): void {
    this.halt();
    this.emit();
  }

  toEnd(): void {
    this.halt();
    if (!this.outcome) return;
    this.index = this.steps.length;
    this.progress = 0;
    this.emit();
    this.onEnd();
  }

  /** Stops the animation loop and leaves the current frame as it is. */
  halt(): void {
    this.playing = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private start(): void {
    this.halt();
    this.playing = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  private duration(i: number): number {
    const steps = this.steps;
    const s = steps[i];
    const prev = i > 0 ? steps[i - 1].state : initialTurtle();
    let base: number;
    if (s.turn) {
      base = 0.1 + Math.min(Math.abs(s.turn.deg), 720) / 540;
    } else {
      const d = Math.hypot(s.state.pos[0] - prev.pos[0], s.state.pos[1] - prev.pos[1], s.state.pos[2] - prev.pos[2]);
      base = d > 0 ? 0.12 + Math.min(d, 800) / 220 : 0.12;
    }
    const level = Math.max(SPEED_MIN, Math.min(SPEED_MAX - 1, Math.round(this.speed)));
    let dur = base / FACTORS[level - 1];
    if (this.stepUntil >= 0) dur = Math.min(dur, 0.35);
    return dur;
  }

  private tick(now: number): void {
    this.raf = 0;
    if (!this.playing || !this.outcome) return;
    let budget = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const steps = this.steps;
    while (budget > 0 && this.index < steps.length) {
      if (this.stepUntil >= 0 && this.index >= this.stepUntil) break;
      const remain = this.duration(this.index) - this.progress;
      if (budget >= remain) {
        budget -= remain;
        this.index++;
        this.progress = 0;
      } else {
        this.progress += budget;
        budget = 0;
      }
    }
    this.emit();
    if (this.index >= steps.length) {
      this.halt();
      this.onEnd();
      return;
    }
    if (this.stepUntil >= 0 && this.index >= this.stepUntil) {
      this.stepUntil = -1;
      this.halt();
      this.onFrame(this.view());
      return;
    }
    this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  emit(): void {
    this.onFrame(this.view());
  }

  view(): PlayerView {
    const out = this.outcome;
    if (!out) {
      return { scene: { log: [], start: 0, end: 0, partial: null, turtle: initialTurtle(), ghost: this.ghost }, at: null, done: 0, total: 0 };
    }
    const steps = out.steps;
    const i = this.index;
    const base = i > 0 ? steps[i - 1] : null;
    const baseState: TurtleState = base ? base.state : initialTurtle();
    let turtle = baseState;
    let partial: Segment | null = null;
    let at: SourceSpan | null = base ? base.at : null;
    if (i < steps.length && this.progress > 0) {
      const cur = steps[i];
      const t = Math.min(1, this.progress / this.duration(i));
      at = cur.at;
      turtle = { ...cur.state, pos: lerp(baseState.pos, cur.state.pos, t), h: baseState.h, r: baseState.r, u: baseState.u };
      if (cur.turn) {
        const turned = rotateState(baseState, cur.turn.axis, cur.turn.deg * t);
        turtle = { ...turtle, h: turned.h, r: turned.r, u: turned.u };
      }
      if (cur.drew) {
        const seg = out.log[cur.segEnd - 1];
        partial = { ...seg, to: lerp(seg.from, seg.to, t) };
      }
    } else if (i >= steps.length && steps.length === 0) {
      turtle = out.turtle;
    }
    return {
      scene: {
        log: out.log,
        start: base ? base.clearStart : 0,
        end: base ? base.segEnd : 0,
        partial,
        turtle,
        ghost: this.ghost,
      },
      at,
      done: i,
      total: steps.length,
    };
  }
}
