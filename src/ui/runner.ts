import { Execution, startTurtle, type StepInfo } from '../lang/interp';
import type { ErrorInfo } from '../lang/errors';
import type { Program } from '../lang/parser';
import type { Scene } from './scene';

export type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error' | 'stopped';

/** Tempo animacji: poleceń na sekundę; ostatni poziom rysuje od razu. */
export const SPEEDS = [
  { label: 'Bardzo wolno', ops: 2 },
  { label: 'Wolno', ops: 6 },
  { label: 'Spokojnie', ops: 18 },
  { label: 'Szybko', ops: 70 },
  { label: 'Bardzo szybko', ops: 400 },
  { label: 'Od razu', ops: Infinity },
];

export interface RunnerEvents {
  scene(scene: Scene): void;
  state(state: RunState, info: { line: number | null; error: ErrorInfo | null }): void;
}

/**
 * Steruje wykonaniem programu w czasie: animacja z wybranym tempem, praca krokowa, pauza.
 */
export class Runner {
  ex: Execution | null = null;
  state: RunState = 'idle';
  speed = 4;
  /** Polecenie, które zostanie wykonane jako następne. */
  private pending: StepInfo | null = null;
  /** Ostatnio wykonane polecenie (podświetlany wiersz). */
  private executed: StepInfo | null = null;
  private raf = 0;
  private last = 0;
  private acc = 0;
  private anim: { index: number; start: number; dur: number } | null = null;
  ghost: Scene['ghost'] = null;
  private version = 0;

  constructor(private ev: RunnerEvents) {}

  scene(): Scene {
    const ex = this.ex;
    let partial: Scene['partial'] = null;
    if (this.anim && ex) {
      const t = Math.min(1, (performance.now() - this.anim.start) / this.anim.dur);
      partial = { index: this.anim.index, t };
    }
    return {
      segments: ex ? ex.segments : [],
      turtle: ex ? ex.turtle : startTurtle(),
      partial,
      ghost: this.ghost,
      version: this.version + (ex ? ex.clears : 0),
    };
  }

  private emitScene() {
    this.ev.scene(this.scene());
  }

  private emitState() {
    const line = this.state === 'running' || this.state === 'paused' ? this.executed?.tok.line ?? null : null;
    this.ev.state(this.state, { line, error: this.ex?.error ?? null });
  }

  private begin(program: Program) {
    this.cancel();
    this.version += 1000;
    this.ex = new Execution(program);
    this.executed = null;
    this.anim = null;
    this.acc = 0;
    this.pending = this.ex.advance();
  }

  /** Uruchamia program od początku z animacją (albo od razu przy najwyższym tempie). */
  start(program: Program, instant = false) {
    this.begin(program);
    if (instant || SPEEDS[this.speed - 1].ops === Infinity) {
      this.finishNow();
      return;
    }
    this.state = 'running';
    this.emitState();
    this.loop();
  }

  /** Wykonuje jedno polecenie. Bez trwającego programu zaczyna nowy. */
  step(program: () => Program | null) {
    if (!this.ex || this.state === 'done' || this.state === 'error' || this.state === 'stopped' || this.state === 'idle') {
      const p = program();
      if (!p) return;
      this.begin(p);
    }
    this.cancel();
    this.anim = null;
    this.state = 'paused';
    this.one();
    if (this.ex!.done) this.finishState();
    else this.emitState();
    this.emitScene();
  }

  pause() {
    if (this.state !== 'running') return;
    this.cancel();
    this.anim = null;
    this.state = 'paused';
    this.emitState();
    this.emitScene();
  }

  resume() {
    if (this.state !== 'paused') return;
    if (SPEEDS[this.speed - 1].ops === Infinity) {
      this.finishNow();
      return;
    }
    this.state = 'running';
    this.emitState();
    this.loop();
  }

  /** Zatrzymuje program, zostawiając rysunek (np. gdy kod został zmieniony). */
  halt() {
    if (this.state !== 'running' && this.state !== 'paused') return;
    this.cancel();
    this.anim = null;
    this.state = 'stopped';
    this.emitState();
    this.emitScene();
  }

  reset() {
    this.cancel();
    this.ex = null;
    this.pending = null;
    this.executed = null;
    this.anim = null;
    this.version += 1000;
    this.state = 'idle';
    this.emitState();
    this.emitScene();
  }

  setSpeed(level: number) {
    this.speed = Math.min(SPEEDS.length, Math.max(1, Math.round(level)));
    if (this.state === 'running' && SPEEDS[this.speed - 1].ops === Infinity) this.finishNow();
  }

  private cancel() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private one() {
    const ex = this.ex!;
    this.executed = this.pending;
    this.pending = ex.advance();
    return ex.lastSegment;
  }

  private finishNow() {
    this.cancel();
    this.anim = null;
    const ex = this.ex!;
    while (!ex.done) this.one();
    this.finishState();
    this.emitScene();
  }

  private finishState() {
    this.state = this.ex!.error ? 'error' : 'done';
    this.executed = null;
    this.emitState();
  }

  private loop() {
    this.last = performance.now();
    const tick = (now: number) => {
      this.raf = 0;
      if (this.state !== 'running' || !this.ex) return;
      const ops = SPEEDS[this.speed - 1].ops;
      const animate = ops <= 20;
      if (this.anim) {
        if (now - this.anim.start < this.anim.dur) {
          this.emitScene();
          this.raf = requestAnimationFrame(tick);
          return;
        }
        this.anim = null;
        this.last = now;
      }
      this.acc += ((now - this.last) / 1000) * ops;
      this.last = now;
      if (this.acc > 2000) this.acc = 2000;
      let changedLine = false;
      while (this.acc >= 1 && !this.ex.done) {
        this.acc -= 1;
        const seg = this.one();
        changedLine = true;
        if (animate && seg >= 0) {
          this.anim = { index: seg, start: now, dur: (1000 / ops) * 0.9 };
          break;
        }
      }
      if (this.ex.done) {
        this.anim = null;
        this.finishState();
        this.emitScene();
        return;
      }
      if (changedLine) this.emitState();
      this.emitScene();
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }
}
