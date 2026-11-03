import { compile, Machine, LogoRuntimeError, type StepEvent, type TurtleState } from '../lang/interpreter';
import { fmtNum, type Stmt } from '../lang/parser';
import { fmtInt } from '../lang/lexer';
import type { LogoError, Mode, RunResult, Segment, Vec3 } from '../lang/types';
import type { DrawingSurface } from './surface';
import type { LogoEditor } from './editor';

export type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error' | 'stopped';

export interface TraceRow {
  n: number;
  line: number;
  col: number;
  label: string;
  color?: string;
  pos: Vec3;
  heading: number | null;
  error?: string;
  depth: number;
}

export interface RunInfo {
  ops: number;
  segments: number;
  error: LogoError | null;
  errorKind: 'parse' | 'runtime' | null;
  message: string;
}

export interface RunnerHost {
  surface(): DrawingSurface | null;
  editor: LogoEditor;
  source(): string;
  mode(): Mode;
  onState(state: RunState, info: RunInfo): void;
  onRows(rows: TraceRow[], reset: boolean): void;
  onTurtle(t: TurtleState): void;
}

/** Steps per second for each position of the speed control; the last one is instant. */
export const RATES = [0, 1, 2.5, 5, 10, 20, 50, 150, 500, 2000, Infinity];
export const SPEED_NAMES = ['', 'bardzo wolno', 'wolno', 'wolno', 'spokojnie', 'spokojnie', 'średnio', 'szybko', 'szybko', 'bardzo szybko', 'natychmiast'];
const TWEEN_MAX = 20;

export const INITIAL_TURTLE: TurtleState = {
  pos: [0, 0, 0],
  heading: [0, 1, 0],
  up: [0, 0, 1],
  right: [1, 0, 0],
  penDown: true,
  color: '#16866a',
  width: 3,
};

function headingDeg(t: TurtleState): number | null {
  if (Math.abs(t.heading[2]) > 1e-9 || Math.abs(t.up[2] - 1) > 1e-9) return null;
  const a = (Math.atan2(t.heading[0], t.heading[1]) * 180) / Math.PI;
  const r = Math.round(((a % 360) + 360) % 360 * 100) / 100;
  return r === 360 ? 0 : r;
}

function labelFor(ev: StepEvent): { label: string; color?: string } {
  const s: Stmt = ev.stmt;
  const word = s.tok.text;
  const v = ev.values.map(fmtNum);
  switch (s.k) {
    case 'move':
    case 'turn':
    case 'pitch':
    case 'roll':
    case 'width':
      return { label: `${word} ${v[0]}` };
    case 'color':
      return { label: `${word} ${s.color}`, color: s.color };
    case 'let':
      return { label: `${word} ${s.display} ${v[0]}` };
    case 'if':
      return { label: `${word} ${v[0]} ${s.cmp} ${v[1]} → ${ev.values[2] ? 'tak' : 'nie'}` };
    case 'repeat':
      return { label: `${word} ${v[0]}` };
    case 'call':
      return { label: [word, ...v].join(' ') };
    default:
      return { label: word };
  }
}

function lerpTurtle(a: TurtleState, b: TurtleState, t: number): TurtleState {
  const mix = (p: Vec3, q: Vec3): Vec3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  const norm = (p: Vec3): Vec3 => {
    const l = Math.hypot(p[0], p[1], p[2]) || 1;
    return [p[0] / l, p[1] / l, p[2] / l];
  };
  // Rotations interpolate by angle in the plane of motion when flat, otherwise by vectors.
  let heading = norm(mix(a.heading, b.heading));
  const flat = Math.abs(a.heading[2]) < 1e-9 && Math.abs(b.heading[2]) < 1e-9 && a.up[2] > 0.999999 && b.up[2] > 0.999999;
  if (flat) {
    const aa = Math.atan2(a.heading[0], a.heading[1]);
    let bb = Math.atan2(b.heading[0], b.heading[1]);
    let d = bb - aa;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    bb = aa + d * t;
    heading = [Math.sin(bb), Math.cos(bb), 0];
  }
  return { ...b, pos: mix(a.pos, b.pos), heading, up: norm(mix(a.up, b.up)), right: norm(mix(a.right, b.right)) };
}

interface Session {
  machine: Machine;
  gen: Generator<StepEvent, void, void>;
  rows: TraceRow[];
  done: boolean;
  pending: { ev: StepEvent; from: TurtleState; to: TurtleState } | null;
  pose: TurtleState;
}

export class Runner {
  state: RunState = 'idle';
  speed = 7;
  private session: Session | null = null;
  private raf = 0;
  private lastTime = 0;
  private progress = 0;
  private budget = 0;
  private newRows: TraceRow[] = [];
  private lastEvent: StepEvent | null = null;

  constructor(private host: RunnerHost) {}

  get busy(): boolean {
    return this.state === 'running' || this.state === 'paused';
  }

  private info(extra: Partial<RunInfo> = {}): RunInfo {
    const m = this.session?.machine;
    return { ops: m?.ops ?? 0, segments: m?.segments.length ?? 0, error: null, errorKind: null, message: '', ...extra };
  }

  private setState(state: RunState, extra: Partial<RunInfo> = {}): void {
    this.state = state;
    this.host.onState(state, this.info(extra));
  }

  private cancelLoop(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  /** Clears the drawing and the trace, puts the turtle home. */
  reset(): void {
    this.cancelLoop();
    this.session?.gen.return();
    this.session = null;
    const surface = this.host.surface();
    surface?.setPartial(null);
    surface?.setSegments([]);
    surface?.setTurtle(INITIAL_TURTLE);
    this.host.onTurtle(INITIAL_TURTLE);
    this.host.editor.setExec(null);
    if (this.host.editor.error?.kind === 'runtime') this.host.editor.setError(null);
    this.host.onRows([], true);
    this.setState('idle', { message: 'Żółw czeka w punkcie startu.' });
  }

  private start(prefit = false): boolean {
    this.cancelLoop();
    this.session?.gen.return();
    this.session = null;
    const surface = this.host.surface();
    const c = compile(this.host.source(), this.host.mode());
    surface?.setPartial(null);
    surface?.setSegments([]);
    surface?.setTurtle(INITIAL_TURTLE);
    this.host.onTurtle(INITIAL_TURTLE);
    this.host.onRows([], true);
    this.host.editor.setExec(null);
    if (!c.program) {
      this.host.editor.setError({ ...c.error, kind: 'parse' });
      this.setState('error', {
        error: c.error,
        errorKind: 'parse',
        message: `Błąd w wierszu ${c.error.line}, kolumna ${c.error.column}. Nic nie zostało narysowane.`,
      });
      return false;
    }
    this.host.editor.setError(null);
    if (prefit && surface) {
      // frame the finished drawing before it starts growing, so it never runs off the plate
      const preview = new Machine(c.program);
      try {
        for (const it = preview.run(); !it.next().done; ) {
          /* dry run */
        }
      } catch {
        /* a run-time error still has a partial drawing to frame */
      }
      surface.setSegments(preview.segments);
      if (!surface.contentVisible()) surface.fit(false);
      surface.setSegments([]);
    }
    const machine = new Machine(c.program);
    this.session = { machine, gen: machine.run(), rows: [], done: false, pending: null, pose: INITIAL_TURTLE };
    this.lastEvent = null;
    this.newRows = [];
    surface && (surface.userMoved = false);
    return true;
  }

  run(): void {
    if (!this.start(RATES[this.speed] !== Infinity)) return;
    if (RATES[this.speed] === Infinity) {
      this.drain();
      return;
    }
    this.setState('running', { message: 'Żółw rysuje…' });
    this.progress = 0;
    this.budget = 1;
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  /** Runs to the end synchronously without animation. */
  runInstant(): RunResult {
    if (!this.start()) {
      return { segments: [], error: this.host.editor.error ? { message: this.host.editor.error.message, line: this.host.editor.error.line, column: this.host.editor.error.column } : null };
    }
    return this.drain();
  }

  private drain(): RunResult {
    const s = this.session!;
    let error: LogoError | null = null;
    for (;;) {
      const r = this.pull();
      if (r === 'error') {
        error = this.errorOf;
        break;
      }
      if (r === 'done') break;
    }
    this.flush(true);
    if (!error) this.finish(false);
    const surface = this.host.surface();
    if (surface && !surface.contentVisible()) surface.fit(false);
    return { segments: s.machine.segments.map((g) => ({ ...g, from: [...g.from] as Vec3, to: [...g.to] as Vec3 })), error };
  }

  step(): void {
    if (this.state === 'running') this.pause();
    if (!this.session || this.session.done) {
      if (!this.start(true)) return;
    }
    this.commitPending();
    const r = this.pull();
    this.flush(true);
    if (r === 'done') this.finish();
    else if (r === 'event') this.setState('paused', { message: 'Krok wykonany. Następny: Krok, albo Wznów, by rysować dalej.' });
  }

  pause(): void {
    if (this.state !== 'running') return;
    this.cancelLoop();
    this.commitPending();
    this.flush(true);
    this.setState('paused', { message: 'Wstrzymano. Wznów, wykonaj krok albo zacznij od nowa.' });
  }

  resume(): void {
    if (this.state !== 'paused' || !this.session) return;
    if (RATES[this.speed] === Infinity) {
      this.state = 'running';
      this.drain();
      return;
    }
    this.setState('running', { message: 'Żółw rysuje…' });
    this.lastTime = performance.now();
    this.progress = 0;
    this.budget = 1;
    this.raf = requestAnimationFrame(this.loop);
  }

  togglePause(): void {
    if (this.state === 'running') this.pause();
    else if (this.state === 'paused') this.resume();
  }

  /** The program text changed under a live session: stop, keep the drawing. */
  stopForEdit(): void {
    if (!this.busy) return;
    this.cancelLoop();
    this.commitPending();
    this.flush(false);
    this.session?.gen.return();
    if (this.session) this.session.done = true;
    this.host.editor.setExec(null);
    this.setState('stopped', { message: 'Zatrzymano, bo program się zmienił. Uruchom go ponownie, by zobaczyć nowy rysunek.' });
  }

  setSpeed(speed: number): void {
    this.speed = Math.min(Math.max(Math.round(speed), 1), RATES.length - 1);
    if (this.state === 'running' && RATES[this.speed] === Infinity) {
      this.cancelLoop();
      this.commitPending();
      this.drain();
    }
  }

  private errorOf: LogoError | null = null;

  /** Pulls one event from the machine. Tweened events stay pending until committed. */
  private pull(tween = false): 'event' | 'done' | 'error' {
    const s = this.session!;
    let r: IteratorResult<StepEvent, void>;
    try {
      r = s.gen.next();
    } catch (ex) {
      if (ex instanceof LogoRuntimeError) {
        const err = { message: ex.message, line: ex.line, column: ex.column };
        this.errorOf = err;
        s.done = true;
        const surface = this.host.surface();
        surface?.setPartial(null);
        surface?.setSegments(s.machine.segments);
        const pose = s.machine.turtle();
        s.pose = pose;
        surface?.setTurtle(pose);
        this.host.onTurtle(pose);
        const row: TraceRow = { n: s.rows.length + 1, line: ex.line, col: ex.column, label: 'błąd', pos: pose.pos, heading: headingDeg(pose), error: ex.message, depth: 0 };
        s.rows.push(row);
        this.newRows.push(row);
        this.flush(false);
        this.host.editor.setExec(null);
        this.host.editor.setError({ ...err, kind: 'runtime' });
        this.cancelLoop();
        this.setState('error', {
          error: err,
          errorKind: 'runtime',
          message: `Błąd wykonania w wierszu ${ex.line}, kolumna ${ex.column}. Rysunek zatrzymał się w tym miejscu.`,
        });
        return 'error';
      }
      throw ex;
    }
    if (r.done) {
      s.done = true;
      return 'done';
    }
    const ev = r.value;
    const pose = s.machine.turtle();
    const { label, color } = labelFor(ev);
    const row: TraceRow = { n: s.rows.length + 1, line: ev.stmt.tok.line, col: ev.stmt.tok.col, label, color, pos: pose.pos, heading: headingDeg(pose), depth: s.machine.frames };
    s.rows.push(row);
    this.newRows.push(row);
    this.lastEvent = ev;
    const surface = this.host.surface();
    if (tween) {
      s.pending = { ev, from: s.pose, to: pose };
    } else {
      if (ev.cleared) surface?.setSegments(s.machine.segments);
      else if (ev.segment) surface?.addSegment(ev.segment);
      s.pose = pose;
    }
    return 'event';
  }

  private commitPending(): void {
    const s = this.session;
    if (!s?.pending) return;
    const { ev, to } = s.pending;
    const surface = this.host.surface();
    surface?.setPartial(null);
    if (ev.cleared) surface?.setSegments(s.machine.segments);
    else if (ev.segment) surface?.addSegment(ev.segment);
    s.pose = to;
    s.pending = null;
  }

  private flush(reveal: boolean): void {
    const s = this.session;
    if (!s) return;
    if (this.newRows.length) {
      this.host.onRows(this.newRows, false);
      this.newRows = [];
    }
    const surface = this.host.surface();
    let pose = s.pose;
    if (s.pending) {
      const t = Math.min(Math.max(this.progress, 0), 1);
      pose = lerpTurtle(s.pending.from, s.pending.to, t);
      if (s.pending.ev.segment) surface?.setPartial({ seg: s.pending.ev.segment, t });
    }
    surface?.setTurtle(pose);
    this.host.onTurtle(pose);
    const ev = s.pending?.ev ?? this.lastEvent;
    if (ev && !s.done) {
      this.host.editor.setExec({ line: ev.stmt.tok.line, column: ev.stmt.tok.col, length: ev.stmt.tok.text.length }, reveal);
    }
    this.host.onState(this.state, this.info({ message: this.state === 'running' ? 'Żółw rysuje…' : undefined }));
  }

  private finish(autoFit = true): void {
    const s = this.session!;
    s.done = true;
    this.cancelLoop();
    const surface = this.host.surface();
    surface?.setPartial(null);
    surface?.setSegments(s.machine.segments);
    const pose = s.machine.turtle();
    s.pose = pose;
    surface?.setTurtle(pose);
    this.host.onTurtle(pose);
    this.host.editor.setExec(null);
    const n = s.machine.segments.length;
    this.setState('done', {
      message: `Gotowe: ${fmtInt(n)} ${n === 1 ? 'odcinek' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'odcinki' : 'odcinków'}, ${fmtInt(s.machine.ops)} operacji.`,
    });
    if (autoFit && surface && !surface.userMoved && !surface.contentVisible()) surface.fit(true);
  }

  private loop = (now: number): void => {
    if (this.state !== 'running' || !this.session) return;
    const dt = Math.min(now - this.lastTime, 100) / 1000;
    this.lastTime = now;
    const rate = RATES[this.speed]!;
    const s = this.session;
    if (rate <= TWEEN_MAX) {
      if (!s.pending) {
        const r = this.pull(true);
        if (r === 'done') return this.finishFromLoop();
        if (r === 'error') return;
        this.progress = 0;
      } else {
        this.progress += dt * rate;
      }
      while (this.progress >= 1) {
        const carry = this.progress - 1;
        this.commitPending();
        const r = this.pull(true);
        if (r === 'done') return this.finishFromLoop();
        if (r === 'error') return;
        this.progress = carry;
      }
      this.flush(true);
    } else {
      this.budget += dt * rate;
      let n = Math.floor(this.budget);
      this.budget -= n;
      const t0 = performance.now();
      while (n-- > 0) {
        const r = this.pull(false);
        if (r === 'done') return this.finishFromLoop();
        if (r === 'error') return;
        if (performance.now() - t0 > 12) {
          this.budget = 0;
          break;
        }
      }
      this.flush(rate <= 60);
    }
    this.raf = requestAnimationFrame(this.loop);
  };

  private finishFromLoop(): void {
    this.flush(false);
    this.finish();
  }

  segments(): Segment[] {
    return this.session?.machine.segments ?? [];
  }
}
