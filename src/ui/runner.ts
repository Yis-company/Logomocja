import { Machine, parse, rotatePose, initialPose, type LogoError, type Mode, type Pose, type Program, type Segment, type Step } from '../lang';
import type { Scene } from './view/common';
import { prefersReducedMotion } from './dom';

export type RunState = 'idle' | 'running' | 'paused' | 'finished';

/** Poziomy szybkości animacji: operacje na sekundę (Infinity = bez animacji). */
export const SPEEDS: Array<{ label: string; ops: number; maxSeconds: number }> = [
  { label: 'Bardzo wolno', ops: 2.5, maxSeconds: Infinity },
  { label: 'Wolno', ops: 7, maxSeconds: 60 },
  { label: 'Normalnie', ops: 22, maxSeconds: 20 },
  { label: 'Szybko', ops: 90, maxSeconds: 5 },
  { label: 'Bardzo szybko', ops: 600, maxSeconds: 1.5 },
  { label: 'Natychmiast', ops: Infinity, maxSeconds: 0 },
];

export interface RunnerSink {
  scene(scene: Scene): void;
  line(line: number | null): void;
  state(state: RunState): void;
  /** Błąd analizy (przed rysowaniem) albo wykonania. */
  error(err: LogoError | null): void;
  /** Wykonanie zakończone (także błędem wykonania). */
  finished(info: { segments: Segment[]; error: LogoError | null; ops: number; animated: boolean }): void;
  /** Wiadomość dla paska stanu. */
  message(text: string): void;
}

interface Anim {
  step: Step;
  before: Pose;
  after: Pose;
  elapsed: number;
  dur: number;
}

const TWEEN_MIN_DUR = 1 / 40;

/** Steruje wykonaniem programu: uruchamianie, kroki, pauza, animacja. */
export class Runner {
  state: RunState = 'idle';
  machine: Machine | null = null;
  private gen: Generator<Step, void, void> | null = null;
  private anim: Anim | null = null;
  private shown: Pose = initialPose();
  private raf = 0;
  private last = 0;
  speed = 3;
  private stepCount = 0;
  private program: Program | null = null;
  private totalCost: number | null = null;
  ghost: Segment[] | null = null;

  constructor(private sink: RunnerSink) {}

  /** Wysyła do widoku bieżącą scenę (np. po zbudowaniu interfejsu). */
  refresh(): void {
    this.pushScene();
  }

  get segments(): Segment[] {
    return this.machine ? this.machine.segments : [];
  }

  // ----- polecenia ------------------------------------------------------

  /** Uruchamia program od początku. `animate=false` wykonuje wszystko od razu. */
  run(source: string, mode: Mode, animate = true): { segments: Segment[]; error: LogoError | null } {
    this.stop();
    const m = this.begin(source, mode);
    if (!m) return { segments: [], error: this.parseError };
    const rate = animate ? SPEEDS[this.speed]!.ops : Infinity;
    if (rate === Infinity) {
      this.drain();
      return { segments: m.segments, error: m.error };
    }
    this.setState('running');
    this.sink.message('Wykonywanie programu…');
    this.startLoop();
    return { segments: m.segments, error: null };
  }

  /** Jeden krok; w razie potrzeby rozpoczyna program w stanie wstrzymanym. */
  step(source: string, mode: Mode): void {
    if (this.state === 'idle' || this.state === 'finished') {
      this.stop();
      if (!this.begin(source, mode)) return;
      this.setState('paused');
    } else if (this.state === 'running') {
      this.setState('paused');
    }
    this.advanceOneStep();
  }

  pause(): void {
    if (this.state === 'running') {
      this.setState('paused');
      this.sink.message('Wstrzymano — użyj „Wznów” albo „Krok”.');
    }
  }

  resume(): void {
    if (this.state === 'paused') {
      this.setState('running');
      this.sink.message('Wykonywanie programu…');
      this.startLoop();
    }
  }

  togglePause(): void {
    if (this.state === 'running') this.pause();
    else if (this.state === 'paused') this.resume();
  }

  /** Zatrzymuje wykonanie, zostawiając rysunek (np. po edycji kodu). */
  halt(): void {
    if (this.state === 'running' || this.state === 'paused') {
      this.cancelLoop();
      this.gen = null;
      this.commit(); // dokończ rysowanie bieżącego kroku, żeby nie zostawić odcinka w połowie
      this.sink.line(null);
      this.setState('idle');
    }
  }

  /** Czyści rysunek i przywraca żółwia na miejsce. */
  reset(): void {
    this.stop();
    this.machine = null;
    this.shown = initialPose();
    this.sink.line(null);
    this.sink.error(null);
    this.sink.message('Gotowe do uruchomienia.');
    this.pushScene();
    this.setState('idle');
  }

  setSpeed(i: number): void {
    this.speed = Math.max(0, Math.min(SPEEDS.length - 1, i));
    if (this.state === 'running' && SPEEDS[this.speed]!.ops === Infinity) this.drain();
  }

  setGhost(ghost: Segment[] | null): void {
    this.ghost = ghost;
    this.pushScene();
  }

  dispose(): void {
    this.cancelLoop();
  }

  // ----- wnętrze --------------------------------------------------------

  private parseError: LogoError | null = null;

  private stop(): void {
    this.cancelLoop();
    this.gen = null;
    this.anim = null;
  }

  private begin(source: string, mode: Mode): Machine | null {
    const parsed = parse(source, mode);
    this.parseError = null;
    this.stepCount = 0;
    this.shown = initialPose();
    if (parsed.error) {
      this.machine = null;
      this.parseError = parsed.error;
      this.sink.error(parsed.error);
      this.sink.line(null);
      this.sink.message('Błąd w programie — nic nie narysowano.');
      this.pushScene();
      this.setState('finished');
      this.sink.finished({ segments: [], error: parsed.error, ops: 0, animated: false });
      return null;
    }
    this.sink.error(null);
    const m = new Machine(parsed.program);
    this.program = parsed.program;
    this.totalCost = null;
    this.machine = m;
    this.gen = m.steps();
    this.pushScene();
    return m;
  }

  /** Wykonuje wszystko natychmiast. */
  private drain(): void {
    const m = this.machine;
    const g = this.gen;
    if (!m || !g) return;
    this.cancelLoop();
    this.anim = null;
    for (;;) {
      const r = g.next();
      if (r.done) break;
    }
    this.finish(false);
  }

  private advanceOneStep(): void {
    if (!this.machine || !this.gen) return;
    // dokończ trwającą animację
    if (this.anim) this.commit();
    if (!this.fetch(prefersReducedMotion() ? 0 : 0.22)) return;
    if (this.anim && this.anim.dur === 0) this.commit();
    else if (this.anim) this.startLoop();
  }

  /**
   * Szybkość efektywna (jednostki kosztu na sekundę): wybrany poziom, ale tak, aby nawet długi
   * program zmieścił się w czasie przypisanym do poziomu.
   */
  private effectiveRate(): number {
    const lvl = SPEEDS[this.speed]!;
    if (lvl.ops === Infinity || !Number.isFinite(lvl.maxSeconds)) return lvl.ops;
    if (this.totalCost === null) {
      let total = 0;
      if (this.program) {
        for (const st of new Machine(this.program).steps()) total += st.cost;
      }
      this.totalCost = total;
    }
    return Math.max(lvl.ops, this.totalCost / lvl.maxSeconds);
  }

  /** Pobiera następny krok i ustawia animację. Zwraca false, gdy program się skończył. */
  private fetch(forceDur?: number): boolean {
    const m = this.machine!;
    const g = this.gen!;
    const before = this.shown;
    const r = g.next();
    if (r.done) {
      this.finish(true);
      return false;
    }
    const step = r.value;
    this.sink.line(step.line);
    this.stepCount++;
    if (this.state === 'paused') this.sink.message(`Krok ${this.stepCount}: wiersz ${step.line}.`);
    const after = m.turtle.pose();
    const rate = forceDur === undefined ? this.effectiveRate() : 1;
    const dur = forceDur ?? (rate === Infinity ? 0 : step.cost / rate);
    this.anim = { step, before, after, elapsed: 0, dur };
    return true;
  }

  private commit(): void {
    const a = this.anim;
    if (!a) return;
    this.anim = null;
    this.shown = a.after;
    this.pushScene();
  }

  private finish(animated: boolean): void {
    const m = this.machine!;
    this.gen = null;
    this.anim = null;
    this.cancelLoop();
    this.shown = m.turtle.pose();
    this.sink.line(null);
    this.sink.error(m.error);
    this.pushScene();
    this.setState('finished');
    const n = m.segments.length;
    if (m.error) this.sink.message(`Błąd wykonania w wierszu ${m.error.line}: zachowano ${n} ${odcinkow(n)}.`);
    else this.sink.message(`Gotowe: ${n} ${odcinkow(n)}, ${m.ops} ${operacji(m.ops)}.`);
    this.sink.finished({ segments: m.segments, error: m.error, ops: m.ops, animated });
  }

  private setState(s: RunState): void {
    this.state = s;
    this.sink.state(s);
  }

  // ----- pętla animacji -------------------------------------------------

  private startLoop(): void {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private cancelLoop(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private tick = (now: number): void => {
    this.raf = 0;
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    if (!this.machine || !this.gen) {
      if (this.state === 'running') this.setState('idle');
      return;
    }
    // Pauza: dokończ tylko trwającą animację kroku.
    const paused = this.state !== 'running';
    let budget = dt;
    const t0 = performance.now();
    for (;;) {
      if (!this.anim) {
        if (paused) break;
        if (!this.fetch()) return;
      }
      const a = this.anim!;
      const need = a.dur - a.elapsed;
      if (budget >= need) {
        budget -= need;
        this.commit();
        if (paused) break;
        if (performance.now() - t0 > 14) break; // oddaj sterowanie przeglądarce
      } else {
        a.elapsed += budget;
        budget = 0;
        if (a.dur >= TWEEN_MIN_DUR) this.pushPartial();
        break;
      }
    }
    if (this.state === 'running' || this.anim) this.raf = requestAnimationFrame(this.tick);
  };

  // ----- scena ----------------------------------------------------------

  private pushScene(): void {
    const m = this.machine;
    const segs = m ? m.segments : [];
    this.sink.scene({
      segments: segs,
      count: segs.length,
      partial: null,
      pose: this.shown,
      showTurtle: true,
      ghost: this.ghost,
    });
  }

  /** Pokazuje stan pośredni trwającego kroku (żółw w ruchu, odcinek rośnie). */
  private pushPartial(): void {
    const a = this.anim;
    const m = this.machine;
    if (!a || !m) return;
    const t = a.dur > 0 ? Math.min(1, a.elapsed / a.dur) : 1;
    const st = a.step;
    let pose = a.after;
    let partial: Segment | null = null;
    let count = m.segments.length;
    if (st.move) {
      const [fx, fy, fz] = st.move.from;
      const [tx, ty, tz] = st.move.to;
      const pos: [number, number, number] = [fx + (tx - fx) * t, fy + (ty - fy) * t, fz + (tz - fz) * t];
      pose = { ...(st.resetOrientation ? (t < 1 ? a.before : a.after) : a.after), pos };
      if (st.seg) {
        count -= 1;
        partial = { from: st.seg.from, to: pos, color: st.seg.color, width: st.seg.width };
      }
    } else if (st.rot) {
      pose = rotatePose(a.before, st.rot.axis, st.rot.deg * t);
    }
    this.sink.scene({ segments: m.segments, count, partial, pose, showTurtle: true, ghost: this.ghost });
  }
}

function odcinkow(n: number): string {
  if (n === 1) return 'odcinek';
  const m10 = n % 10;
  const m100 = n % 100;
  return m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14) ? 'odcinki' : 'odcinków';
}

function operacji(n: number): string {
  if (n === 1) return 'operacja';
  const m10 = n % 10;
  const m100 = n % 100;
  return m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14) ? 'operacje' : 'operacji';
}

export { odcinkow, operacji };
