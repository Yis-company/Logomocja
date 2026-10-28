// Interpreter: executes a parsed Program as a generator so the UI can animate and step.
import { LIMITS, LogoError, type Tok } from "./lexer";
import { binop, checkCount, checkWidth, parse, type Arg, type Cond, type Expr, type Mode, type Program, type Stmt } from "./parser";

export type Vec = [number, number, number];

export interface Segment {
  from: Vec;
  to: Vec;
  color: string;
  width: number;
}

export interface Turtle {
  pos: Vec;
  h: Vec; // heading
  r: Vec; // right
  u: Vec; // up
  pen: boolean;
  color: string;
  width: number;
}

export interface ErrorInfo {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: ErrorInfo | null;
}

/** Yielded before each executed command so the UI can highlight / pause. */
export interface StepEvent {
  line: number;
  col: number;
}

export const DEFAULT_COLOR = "#16866a";
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): Turtle {
  return { pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], pen: true, color: DEFAULT_COLOR, width: DEFAULT_WIDTH };
}

const z = (x: number) => (x === 0 ? 0 : x); // drop -0

/** Exact sin/cos for multiples of 90°. */
function sincos(deg: number): [number, number] {
  const m = ((deg % 360) + 360) % 360;
  if (m === 0) return [0, 1];
  if (m === 90) return [1, 0];
  if (m === 180) return [0, -1];
  if (m === 270) return [-1, 0];
  const rad = (deg * Math.PI) / 180;
  return [Math.sin(rad), Math.cos(rad)];
}

/** Rotate a toward b by deg (a, b orthonormal). Returns [a', b']. */
function rot(a: Vec, b: Vec, deg: number): [Vec, Vec] {
  const [s, c] = sincos(deg);
  return [
    [z(a[0] * c + b[0] * s), z(a[1] * c + b[1] * s), z(a[2] * c + b[2] * s)],
    [z(b[0] * c - a[0] * s), z(b[1] * c - a[1] * s), z(b[2] * c - a[2] * s)],
  ];
}

interface Frame {
  vars: Map<string, number> | null; // null at top level
  reps: number[];
}

class Stop {}
const STOP = new Stop();

export class Execution {
  turtle: Turtle = initialTurtle();
  segments: Segment[] = [];
  ops = 0;
  /** number of active call + repeat frames */
  frames = 0;
  globals = new Map<string, number>();
  done = false;
  error: LogoError | null = null;
  private gen: Generator<StepEvent, void, void>;

  constructor(public program: Program) {
    this.gen = this.main();
  }

  /** Advance to the next command. Returns the event, or null when finished. */
  step(): StepEvent | null {
    if (this.done) return null;
    try {
      const r = this.gen.next();
      if (r.done) {
        this.done = true;
        return null;
      }
      return r.value;
    } catch (e) {
      this.done = true;
      if (e instanceof LogoError) {
        e.runtime = true;
        this.error = e;
        return null;
      }
      throw e;
    }
  }

  runToEnd(): void {
    while (this.step()) {}
  }

  private *main(): Generator<StepEvent, void, void> {
    const top: Frame = { vars: null, reps: [] };
    try {
      yield* this.block(this.program.body, top);
    } catch (e) {
      if (e !== STOP) throw e;
    }
  }

  private count(t: Tok) {
    this.ops++;
    if (this.ops > LIMITS.ops) {
      throw new LogoError(`Przekroczono limit ${LIMITS.ops.toLocaleString("pl-PL")} wykonanych operacji. Czy program się nie zapętlił?`, t.line, t.col);
    }
  }

  private enter(t: Tok) {
    if (this.frames + 1 > LIMITS.frames) {
      throw new LogoError(`Za głęboko: najwyżej ${LIMITS.frames} aktywnych wywołań procedur i powtórzeń naraz. Czy rekurencja ma warunek zakończenia?`, t.line, t.col);
    }
    this.frames++;
  }

  private *block(stmts: Stmt[], f: Frame): Generator<StepEvent, void, void> {
    for (const s of stmts) {
      yield { line: s.tok.line, col: s.tok.col };
      this.count(s.tok);
      yield* this.exec(s, f);
    }
  }

  private *exec(s: Stmt, f: Frame): Generator<StepEvent, void, void> {
    const t = this.turtle;
    switch (s.k) {
      case "move": {
        const v = this.value(s.arg, f);
        switch (s.cmd) {
          case "fd":
            this.move(v, s.tok);
            break;
          case "bk":
            this.move(-v, s.tok);
            break;
          case "rt":
            [t.h, t.r] = rot(t.h, t.r, v);
            break;
          case "lt":
            [t.h, t.r] = rot(t.h, t.r, -v);
            break;
          case "up":
            [t.h, t.u] = rot(t.h, t.u, v);
            break;
          case "down":
            [t.h, t.u] = rot(t.h, t.u, -v);
            break;
          case "rr":
            [t.u, t.r] = rot(t.u, t.r, v);
            break;
          case "rl":
            [t.u, t.r] = rot(t.u, t.r, -v);
            break;
        }
        return;
      }
      case "pen":
        t.pen = s.down;
        return;
      case "color":
        t.color = s.value;
        return;
      case "width": {
        const v = this.value(s.arg, f);
        const m = checkWidth(v);
        if (m) throw new LogoError(m, s.arg.tok.line, s.arg.tok.col);
        t.width = v;
        return;
      }
      case "stop":
        throw STOP;
      case "home": {
        this.goto([0, 0, 0], s.tok);
        t.h = [0, 1, 0];
        t.r = [1, 0, 0];
        t.u = [0, 0, 1];
        return;
      }
      case "cs":
        this.segments = [];
        return;
      case "let": {
        const v = this.value(s.arg, f);
        (f.vars ?? this.globals).set(s.name, v);
        return;
      }
      case "if":
        if (this.test(s.cond, f)) {
          yield* this.block(s.body, f);
          this.count(s.tok);
        }
        return;
      case "ifelse": {
        yield* this.block(this.test(s.cond, f) ? s.a : s.b, f);
        this.count(s.tok);
        return;
      }
      case "repeat": {
        const n = this.value(s.arg, f);
        const m = checkCount(n);
        if (m) throw new LogoError(m, s.arg.tok.line, s.arg.tok.col);
        this.enter(s.tok);
        f.reps.push(0);
        try {
          for (let i = 1; i <= n; i++) {
            f.reps[f.reps.length - 1] = i;
            yield* this.block(s.body, f);
            this.count(s.tok);
          }
        } finally {
          f.reps.pop();
          this.frames--;
        }
        return;
      }
      case "call": {
        const vals = s.args.map((a) => this.value(a, f));
        this.enter(s.tok);
        const vars = new Map<string, number>();
        s.proc.params.forEach((p, i) => vars.set(p, vals[i]!));
        const callee: Frame = { vars, reps: [] };
        try {
          yield* this.block(s.proc.body, callee);
        } catch (e) {
          if (e !== STOP) throw e;
        }
        this.frames--;
        this.count(s.tok);
        return;
      }
    }
  }

  private test(c: Cond, f: Frame): boolean {
    const l = this.eval(c.l, f, c.tok);
    const r = this.eval(c.r, f, c.tok);
    switch (c.op) {
      case "<": return l < r;
      case ">": return l > r;
      case "=": return l === r;
      case "<=": return l <= r;
      case ">=": return l >= r;
      default: return l !== r;
    }
  }

  private value(a: Arg, f: Frame): number {
    return this.eval(a.e, f, a.tok);
  }

  private eval(e: Expr, f: Frame, at: Tok): number {
    let v: number;
    switch (e.k) {
      case "num":
        v = e.v;
        break;
      case "rep":
        v = f.reps[f.reps.length - 1]!;
        break;
      case "var": {
        const local = f.vars?.get(e.name);
        if (local !== undefined) v = local;
        else {
          const g = this.globals.get(e.name);
          if (g === undefined) throw new LogoError(`Zmienna „${e.tok.raw.replace(/^:/, "")}” nie ma jeszcze wartości — najpierw użyj „niech”.`, at.line, at.col);
          v = g;
        }
        break;
      }
      case "neg":
        v = -this.eval(e.e, f, at);
        break;
      case "bin": {
        const l = this.eval(e.l, f, at);
        const r = this.eval(e.r, f, at);
        if (e.op === "/" && r === 0) throw new LogoError(`Dzielenie przez zero.`, at.line, at.col);
        v = binop(e.op, l, r);
        break;
      }
    }
    if (!Number.isFinite(v)) throw new LogoError(`Wynik obliczenia jest za duży lub nie jest liczbą.`, at.line, at.col);
    return v;
  }

  private move(d: number, at: Tok) {
    const t = this.turtle;
    if (d === 0) return;
    this.goto([z(t.pos[0] + t.h[0] * d), z(t.pos[1] + t.h[1] * d), z(t.pos[2] + t.h[2] * d)], at);
  }

  private goto(to: Vec, at: Tok) {
    const t = this.turtle;
    if (to.some((c) => Math.abs(c) > LIMITS.coord)) {
      throw new LogoError(`Żółw wyszedłby poza obszar rysowania (współrzędne do ±${LIMITS.coord.toLocaleString("pl-PL")}).`, at.line, at.col);
    }
    const same = to[0] === t.pos[0] && to[1] === t.pos[1] && to[2] === t.pos[2];
    if (t.pen && !same) {
      if (this.segments.length >= LIMITS.segments) {
        throw new LogoError(`Przekroczono limit ${LIMITS.segments.toLocaleString("pl-PL")} odcinków na rysunku.`, at.line, at.col);
      }
      this.segments.push({ from: [...t.pos], to: [...to], color: t.color, width: t.width });
    }
    t.pos = to;
  }
}

export function toInfo(e: LogoError): ErrorInfo {
  return { message: e.message, line: e.line, column: e.column };
}

/** Compile; returns the Execution or a parse error. */
export function compile(source: string, mode: Mode): { exec: Execution | null; error: ErrorInfo | null } {
  try {
    return { exec: new Execution(parse(source, mode)), error: null };
  } catch (e) {
    if (e instanceof LogoError) return { exec: null, error: toInfo(e) };
    throw e;
  }
}

export function run(source: string, mode: Mode): RunResult {
  const { exec, error } = compile(source, mode);
  if (!exec) return { segments: [], error };
  exec.runToEnd();
  return { segments: exec.segments, error: exec.error ? toInfo(exec.error) : null };
}
