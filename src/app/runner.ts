import {
  Machine,
  type Mode,
  type Segment,
  type Step,
  type TurtleState,
  compile,
  initialTurtle,
  runProgram,
  toRunError,
  type RunError,
} from '../lang';

export type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error';

/** Szybkości animacji w operacjach na sekundę; ostatnia = bez animacji. */
export const SPEEDS: { label: string; opsPerSecond: number; auto?: boolean }[] = [
  { label: 'automatycznie', opsPerSecond: 0, auto: true },
  { label: 'bardzo wolno', opsPerSecond: 2 },
  { label: 'wolno', opsPerSecond: 8 },
  { label: 'spokojnie', opsPerSecond: 30 },
  { label: 'szybko', opsPerSecond: 120 },
  { label: 'bardzo szybko', opsPerSecond: 600 },
  { label: 'błyskawicznie', opsPerSecond: 2500 },
  { label: 'natychmiast', opsPerSecond: Infinity },
];

export interface RunnerSnapshot {
  state: RunState;
  segments: Segment[];
  turtle: TurtleState;
  step: Step | null;
  error: RunError | null;
  ops: number;
  /** Dodatkowa informacja dla paska stanu (np. „przerwano, bo zmieniono kod”). */
  note: string | null;
}

/** Steruje wykonaniem programu: ciągłym (z animacją), krokowym i natychmiastowym. */
export class Runner {
  state: RunState = 'idle';
  private machine: Machine | null = null;
  private gen: Generator<Step, void, undefined> | null = null;
  private step: Step | null = null;
  private error: RunError | null = null;
  private note: string | null = null;
  private raf = 0;
  private last = 0;
  private budget = 0;
  speedIndex = 0;
  /** Tempo dla trybu automatycznego: cały rysunek w około 1,5 sekundy. */
  private autoRate = 60;
  mode: Mode = '2d';

  onChange: (() => void) | null = null;

  constructor(private emit: (snap: RunnerSnapshot) => void) {}

  get opsPerSecond(): number {
    const s = SPEEDS[this.speedIndex];
    return s.auto ? this.autoRate : s.opsPerSecond;
  }

  private estimateRate(source: string, mode: Mode): number {
    const c = compile(source, mode);
    if (c.error) return 60;
    const m = new Machine(c.program, mode);
    let n = 0;
    try {
      for (const _ of m.execute()) void _;
      n = m.ops;
    } catch {
      n = m.ops;
    }
    return Math.min(4000, Math.max(15, n / 3));
  }

  snapshot(): RunnerSnapshot {
    return {
      state: this.state,
      segments: this.machine?.segments ?? [],
      turtle: this.machine?.turtle ?? initialTurtle(),
      step: this.step,
      error: this.error,
      ops: this.machine?.ops ?? 0,
      note: this.note,
    };
  }

  private publish(): void {
    this.emit(this.snapshot());
    this.onChange?.();
  }

  private cancelFrame(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** Kompiluje; przy błędzie składni nic nie rysuje. Zwraca false, gdy nie można uruchomić. */
  private prepare(source: string, mode: Mode): boolean {
    this.cancelFrame();
    this.mode = mode;
    this.step = null;
    this.error = null;
    this.note = null;
    this.gen = null;
    this.machine = null;
    const c = compile(source, mode);
    if (c.error) {
      this.error = c.error;
      this.state = 'error';
      this.publish();
      return false;
    }
    this.machine = new Machine(c.program, mode);
    this.gen = this.machine.execute();
    return true;
  }

  /** Czysty wynik programu (do dopasowania widoku przed animacją). */
  dryRun(source: string, mode: Mode): Segment[] {
    return runProgram(source, mode).segments;
  }

  /** Uruchamia od początku z animacją (lub natychmiast przy najwyższej szybkości). */
  start(source: string, mode: Mode): void {
    if (!this.prepare(source, mode)) return;
    if (SPEEDS[this.speedIndex].auto) this.autoRate = this.estimateRate(source, mode);
    if (!isFinite(this.opsPerSecond)) {
      this.runToEnd();
      return;
    }
    this.state = 'running';
    this.budget = 0;
    this.last = performance.now();
    this.publish();
    this.raf = requestAnimationFrame(this.tick);
  }

  /** Natychmiast do końca, bez animacji. */
  runInstant(source: string, mode: Mode): void {
    if (!this.prepare(source, mode)) return;
    this.runToEnd();
  }

  private runToEnd(): void {
    this.cancelFrame();
    try {
      while (this.gen) {
        const r = this.gen.next();
        if (r.done) break;
        this.step = r.value;
      }
      this.finish(null);
    } catch (e) {
      this.finish(toRunError(e));
    }
  }

  private finish(error: RunError | null): void {
    this.gen = null;
    this.error = error;
    this.state = error ? 'error' : 'done';
    if (!error) this.step = null;
    this.publish();
  }

  private tick = (now: number): void => {
    this.raf = 0;
    if (this.state !== 'running' || !this.gen) return;
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.budget += dt * this.opsPerSecond;
    let n = Math.floor(this.budget);
    this.budget -= n;
    // przy ogromnej szybkości nie blokujemy klatki dłużej niż kilkanaście ms
    const deadline = performance.now() + 12;
    try {
      while (n > 0) {
        const r = this.gen.next();
        if (r.done) {
          this.finish(null);
          return;
        }
        this.step = r.value;
        n--;
        if ((n & 63) === 0 && performance.now() > deadline) {
          this.budget += n;
          break;
        }
      }
    } catch (e) {
      this.finish(toRunError(e));
      return;
    }
    this.publish();
    this.raf = requestAnimationFrame(this.tick);
  };

  /** Jeden krok: zaczyna wykonanie krokowe, jeśli program jeszcze nie działa. */
  stepOnce(source: string, mode: Mode): void {
    if (this.state === 'running') {
      this.pause();
      return;
    }
    if (this.state !== 'paused') {
      if (!this.prepare(source, mode)) return;
      this.state = 'paused';
    }
    this.cancelFrame();
    if (!this.gen) return;
    try {
      const r = this.gen.next();
      if (r.done) {
        this.finish(null);
        return;
      }
      this.step = r.value;
    } catch (e) {
      this.finish(toRunError(e));
      return;
    }
    this.state = 'paused';
    this.publish();
  }

  pause(): void {
    if (this.state !== 'running') return;
    this.cancelFrame();
    this.state = 'paused';
    this.publish();
  }

  resume(): void {
    if (this.state !== 'paused' || !this.gen) return;
    if (!isFinite(this.opsPerSecond)) {
      this.state = 'running';
      this.runToEnd();
      return;
    }
    this.state = 'running';
    this.budget = 0;
    this.last = performance.now();
    this.publish();
    this.raf = requestAnimationFrame(this.tick);
  }

  /** Zmieniono kod w trakcie działania: przerywamy, zostawiając to, co już narysowano. */
  interrupt(note: string): void {
    if (this.state !== 'running' && this.state !== 'paused') return;
    this.cancelFrame();
    this.gen = null;
    this.step = null;
    this.state = 'idle';
    this.note = note;
    this.publish();
  }

  reset(): void {
    this.cancelFrame();
    this.gen = null;
    this.machine = null;
    this.step = null;
    this.error = null;
    this.note = null;
    this.state = 'idle';
    this.publish();
  }

  setSpeed(index: number): void {
    this.speedIndex = Math.max(0, Math.min(SPEEDS.length - 1, index));
    this.budget = 0;
  }

  get active(): boolean {
    return this.state === 'running' || this.state === 'paused';
  }
}
