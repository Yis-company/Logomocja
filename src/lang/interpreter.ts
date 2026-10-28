import type { Cond, Expr, Mode, Program, Stmt } from './ast';
import { EvalFail, evalOps, repeatProblem, widthProblem, type EvalEnv } from './eval';
import { LogoError } from './errors';
import { LIMITS } from './limits';
import { Turtle, type Segment, type Vec3 } from './turtle';

export type StepKind = 'move' | 'turn' | 'pen' | 'style' | 'var' | 'repeat' | 'if' | 'call' | 'home' | 'clear' | 'stop';

/** Jedna wykonana operacja — to, co widać przy wykonywaniu krok po kroku. */
export interface Step {
  kind: StepKind;
  line: number;
  col: number;
  len: number;
  /** Odcinek dodany tym krokiem. */
  seg?: Segment;
  cleared?: boolean;
  move?: { from: Vec3; to: Vec3 };
  rot?: { axis: 'yaw' | 'pitch' | 'roll'; deg: number };
  /** Czy `dom` zresetował orientację. */
  resetOrientation?: boolean;
  /** Względny „koszt czasowy” kroku przy animacji (0 = bez czekania). */
  cost: number;
}

class Frame implements EvalEnv {
  reps: number[] = [];
  constructor(
    private globals: Map<string, number>,
    readonly locals: Map<string, number> | null,
  ) {}

  lookup(name: string): number | undefined {
    if (this.locals) {
      const v = this.locals.get(name);
      if (v !== undefined) return v;
    }
    return this.globals.get(name);
  }

  rep(): number {
    return this.reps[this.reps.length - 1]!;
  }
}

function runError(message: string, tok: { line: number; col: number; start: number; end: number }): LogoError {
  return new LogoError(message, tok.line, tok.col, tok.end - tok.start, 'run');
}

/** Maszyna wykonująca zweryfikowany program; krok po kroku (generator) albo w całości. */
export class Machine {
  readonly turtle = new Turtle();
  readonly segments: Segment[] = [];
  /** Zwiększane, gdy lista odcinków została wyczyszczona. */
  version = 0;
  ops = 0;
  error: LogoError | null = null;
  done = false;

  private frames = 0;
  private globals = new Map<string, number>();

  constructor(readonly program: Program) {}

  get mode(): Mode {
    return this.program.mode;
  }

  /** Wykonuje program krok po kroku. Błąd wykonania trafia do `error`. */
  *steps(): Generator<Step, void, void> {
    try {
      const top = new Frame(this.globals, null);
      yield* this.block(this.program.body, top);
    } catch (e) {
      if (e instanceof LogoError) this.error = e;
      else if (e instanceof RangeError) this.error = new LogoError('Przekroczono limit głębokości wykonania.', 1, 1, 1, 'run');
      else throw e;
    }
    this.done = true;
  }

  /** Wykonuje do końca (bez animacji). */
  runToEnd(): void {
    for (const _ of this.steps()) void _;
  }

  // ----- pomocnicze -----------------------------------------------------

  private tick(tok: { line: number; col: number; start: number; end: number }): void {
    if (++this.ops > LIMITS.maxOps) {
      throw runError(`Przekroczono limit ${LIMITS.maxOps.toLocaleString('pl-PL')} wykonanych operacji (program działa zbyt długo).`, tok);
    }
  }

  private value(e: Expr, f: Frame): number {
    if (e.const !== undefined) return e.const;
    try {
      return evalOps(e.ops, f);
    } catch (err) {
      if (err instanceof EvalFail) throw runError(err.message(), e.tok);
      throw err;
    }
  }

  private holds(c: Cond, f: Frame): boolean {
    const a = this.value(c.left, f);
    const b = this.value(c.right, f);
    switch (c.op) {
      case '<': return a < b;
      case '>': return a > b;
      case '=': return a === b;
      case '<=': return a <= b;
      case '>=': return a >= b;
      default: return a !== b;
    }
  }

  private addSegment(from: Vec3, to: Vec3, tok: { line: number; col: number; start: number; end: number }): Segment {
    if (this.segments.length >= LIMITS.maxSegments) {
      throw runError(`Przekroczono limit ${LIMITS.maxSegments.toLocaleString('pl-PL')} odcinków w rysunku.`, tok);
    }
    const seg: Segment = { from, to, color: this.turtle.color, width: this.turtle.width };
    this.segments.push(seg);
    return seg;
  }

  private checkCoord(x: number, y: number, z: number, tok: { line: number; col: number; start: number; end: number }): void {
    const m = LIMITS.maxCoord;
    if (!(Math.abs(x) <= m && Math.abs(y) <= m && Math.abs(z) <= m)) {
      throw runError(`Żółw wyszedłby poza dozwolony obszar (współrzędne muszą mieścić się w zakresie ±${m.toLocaleString('pl-PL')}).`, tok);
    }
  }

  private move(d: number, tok: Stmt['tok']): Step {
    const t = this.turtle;
    const nx = t.x + t.hx * d + 0;
    const ny = t.y + t.hy * d + 0;
    const nz = t.z + t.hz * d + 0;
    this.checkCoord(nx, ny, nz, tok);
    const from: Vec3 = [t.x, t.y, t.z];
    const to: Vec3 = [nx, ny, nz];
    let seg: Segment | undefined;
    const moved = nx !== t.x || ny !== t.y || nz !== t.z;
    if (moved && t.penDown) seg = this.addSegment(from, to, tok);
    t.x = nx; t.y = ny; t.z = nz;
    return step('move', tok, 1, { seg, move: { from, to } });
  }

  // ----- wykonanie ------------------------------------------------------

  private *block(stmts: Stmt[], f: Frame): Generator<Step, boolean, void> {
    for (let i = 0; i < stmts.length; i++) {
      if (yield* this.stmt(stmts[i]!, f)) return true;
    }
    return false;
  }

  /** Zwraca `true`, jeśli wykonano `stop` (wyjście z procedury lub z programu). */
  private *stmt(s: Stmt, f: Frame): Generator<Step, boolean, void> {
    const t = this.turtle;
    switch (s.t) {
      case 'cmd': {
        this.tick(s.tok);
        switch (s.id) {
          case 'forward': yield this.move(this.value(s.arg!, f), s.tok); break;
          case 'back': yield this.move(-this.value(s.arg!, f), s.tok); break;
          case 'right': { const d = this.value(s.arg!, f); t.yaw(d); yield step('turn', s.tok, 1, { rot: { axis: 'yaw', deg: d } }); break; }
          case 'left': { const d = -this.value(s.arg!, f); t.yaw(d); yield step('turn', s.tok, 1, { rot: { axis: 'yaw', deg: d } }); break; }
          case 'pitchup': { const d = this.value(s.arg!, f); t.pitch(d); yield step('turn', s.tok, 1, { rot: { axis: 'pitch', deg: d } }); break; }
          case 'pitchdown': { const d = -this.value(s.arg!, f); t.pitch(d); yield step('turn', s.tok, 1, { rot: { axis: 'pitch', deg: d } }); break; }
          case 'rollright': { const d = this.value(s.arg!, f); t.roll(d); yield step('turn', s.tok, 1, { rot: { axis: 'roll', deg: d } }); break; }
          case 'rollleft': { const d = -this.value(s.arg!, f); t.roll(d); yield step('turn', s.tok, 1, { rot: { axis: 'roll', deg: d } }); break; }
          case 'penup': t.penDown = false; yield step('pen', s.tok, 0.3); break;
          case 'pendown': t.penDown = true; yield step('pen', s.tok, 0.3); break;
          case 'width': {
            const w = this.value(s.arg!, f);
            const p = widthProblem(w);
            if (p) throw runError(p, s.arg!.tok);
            t.width = w;
            yield step('style', s.tok, 0.3);
            break;
          }
          case 'home': {
            const from: Vec3 = [t.x, t.y, t.z];
            const to: Vec3 = [0, 0, 0];
            let seg: Segment | undefined;
            if (t.penDown && (t.x !== 0 || t.y !== 0 || t.z !== 0)) seg = this.addSegment(from, to, s.tok);
            t.resetOrientation();
            yield step('home', s.tok, 1, { seg, move: { from, to }, resetOrientation: true });
            break;
          }
          case 'clear':
            this.segments.length = 0;
            this.version++;
            yield step('clear', s.tok, 0.3, { cleared: true });
            break;
          case 'stop':
            yield step('stop', s.tok, 0.3);
            return true;
        }
        return false;
      }
      case 'color':
        this.tick(s.tok);
        t.color = s.hex;
        yield step('style', s.tok, 0.3);
        return false;
      case 'let': {
        this.tick(s.tok);
        const v = this.value(s.expr, f);
        if (f.locals) f.locals.set(s.name, v);
        else this.globals.set(s.name, v);
        yield step('var', s.tok, 0.2);
        return false;
      }
      case 'repeat': {
        this.tick(s.tok);
        const n = this.value(s.count, f);
        const p = repeatProblem(n);
        if (p) throw runError(p, s.count.tok);
        yield step('repeat', s.tok, 0.2);
        if (n === 0) return false;
        if (this.frames >= LIMITS.maxFrames) {
          throw runError(`Przekroczono limit ${LIMITS.maxFrames} jednocześnie aktywnych wywołań procedur i powtórzeń.`, s.tok);
        }
        this.frames++;
        f.reps.push(0);
        for (let i = 1; i <= n; i++) {
          f.reps[f.reps.length - 1] = i;
          if (yield* this.block(s.body, f)) {
            f.reps.pop();
            this.frames--;
            return true;
          }
          this.tick(s.tok);
        }
        f.reps.pop();
        this.frames--;
        return false;
      }
      case 'if': {
        this.tick(s.tok);
        const yes = this.holds(s.cond, f);
        yield step('if', s.tok, 0.2);
        const body = yes ? s.then : s.else;
        if (!body) return false;
        if (yield* this.block(body, f)) return true;
        this.tick(s.tok);
        return false;
      }
      case 'call': {
        this.tick(s.tok);
        const locals = new Map<string, number>();
        const params = s.proc.params;
        for (let i = 0; i < params.length; i++) locals.set(params[i]!, this.value(s.args[i]!, f));
        if (this.frames >= LIMITS.maxFrames) {
          throw runError(
            `Przekroczono limit ${LIMITS.maxFrames} jednocześnie aktywnych wywołań procedur i powtórzeń (zbyt głęboka rekurencja?).`,
            s.tok,
          );
        }
        this.frames++;
        yield step('call', s.tok, 0.2);
        yield* this.block(s.proc.body, new Frame(this.globals, locals));
        this.frames--;
        this.tick(s.tok);
        return false;
      }
    }
  }
}

function step(kind: StepKind, tok: { line: number; col: number; start: number; end: number }, cost: number, extra: Partial<Step> = {}): Step {
  return { kind, line: tok.line, col: tok.col, len: tok.end - tok.start, cost, ...extra };
}
