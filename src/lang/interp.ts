import { LogoError, EvalError, type ErrorInfo } from './errors';
import { fmtInt, type Tok } from './lexer';
import { parse, arith, widthProblem, repeatProblem, type Arg, type Cond, type Expr, type Mode, type Program, type Stmt } from './parser';

export const MAX_OPS = 10_000;
export const MAX_FRAMES = 32;
export const MAX_SEGMENTS = 10_000;
export const MAX_COORD = 100_000;

export type Vec = [number, number, number];

export interface Segment {
  from: Vec;
  to: Vec;
  color: string;
  width: number;
}

export interface Turtle {
  pos: Vec;
  heading: Vec;
  right: Vec;
  up: Vec;
  pen: boolean;
  color: string;
  width: number;
}

export interface RunResult {
  segments: Segment[];
  error: ErrorInfo | null;
}

export const START_COLOR = '#16866a';
export const START_WIDTH = 3;

export function startTurtle(): Turtle {
  return { pos: [0, 0, 0], heading: [0, 1, 0], right: [1, 0, 0], up: [0, 0, 1], pen: true, color: START_COLOR, width: START_WIDTH };
}

/** sin i cos kąta w stopniach, dokładne dla wielokrotności 90°. */
function sinCos(deg: number): [number, number] {
  let m = deg % 360;
  if (m < 0) m += 360;
  if (m === 0) return [0, 1];
  if (m === 90) return [1, 0];
  if (m === 180) return [0, -1];
  if (m === 270) return [-1, 0];
  const r = (m * Math.PI) / 180;
  return [Math.sin(r), Math.cos(r)];
}

/** Obrót pary wektorów: `a` obraca się w stronę `b` o kąt. */
function rotatePair(a: Vec, b: Vec, deg: number): [Vec, Vec] {
  const [s, c] = sinCos(deg);
  const na: Vec = [a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s];
  const nb: Vec = [b[0] * c - a[0] * s, b[1] * c - a[1] * s, b[2] * c - a[2] * s];
  return [clean(na), clean(nb)];
}

const clean = (v: Vec): Vec => [v[0] || 0, v[1] || 0, v[2] || 0];

interface Frame {
  locals: Map<string, number> | null;
  reps: number[];
}

type Signal = 'stop' | undefined;

export interface StepInfo {
  tok: Tok;
  kind: Stmt['k'];
}

/**
 * Wykonanie programu krok po kroku. Generator zatrzymuje się przed każdym poleceniem,
 * więc interfejs może animować rysowanie i pracę krokową; `run` przechodzi go do końca.
 */
export class Execution {
  turtle: Turtle = startTurtle();
  segments: Segment[] = [];
  /** Rośnie przy każdym `czyść`, żeby widok wiedział, że trzeba narysować od nowa. */
  clears = 0;
  ops = 0;
  frames = 0;
  error: ErrorInfo | null = null;
  done = false;
  /** Ostatnie polecenie, które przesunęło żółwia z opuszczonym piórem: indeks odcinka. */
  lastSegment = -1;
  private globals = new Map<string, number>();
  private gen: Generator<StepInfo, void, void>;

  constructor(public program: Program) {
    this.gen = this.main();
  }

  /** Wykonuje kod do następnego polecenia. Zwraca polecenie, które zostanie wykonane jako następne. */
  advance(): StepInfo | null {
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
        this.error = { message: e.message, line: e.line, column: e.column };
        return null;
      }
      throw e;
    }
  }

  runToEnd(): RunResult {
    while (this.advance()) { /* dalej */ }
    return { segments: this.segments, error: this.error };
  }

  private *main(): Generator<StepInfo, void, void> {
    const frame: Frame = { locals: null, reps: [] };
    yield* this.block(this.program.body, frame);
  }

  private count(tok: Tok) {
    if (++this.ops > MAX_OPS) {
      throw new LogoError(`Przekroczono limit ${fmtInt(MAX_OPS)} wykonanych operacji. Program może się zapętlać.`, tok.line, tok.col);
    }
  }

  private enter(tok: Tok) {
    if (this.frames + 1 > MAX_FRAMES) {
      throw new LogoError(`Za głębokie zagnieżdżenie: najwyżej ${MAX_FRAMES} wywołań procedur i powtórzeń naraz. Czy rekurencja ma warunek zakończenia?`, tok.line, tok.col);
    }
    this.frames++;
  }

  private value(e: Expr, f: Frame): number {
    switch (e.k) {
      case 'num': return e.v;
      case 'rep': return f.reps[f.reps.length - 1];
      case 'neg': return -this.value(e.e, f) || 0;
      case 'pos': return this.value(e.e, f);
      case 'bin': return arith(e.op, this.value(e.a, f), this.value(e.b, f));
      case 'var': {
        const v = f.locals?.get(e.name) ?? this.globals.get(e.name);
        if (v === undefined) throw new EvalError(`Zmienna „${e.tok.text.replace(/^:/, '')}” nie ma jeszcze wartości. Nadaj ją wcześniej poleceniem „niech”.`);
        return v;
      }
    }
  }

  private arg(a: Arg, f: Frame): number {
    try {
      return this.value(a.e, f);
    } catch (e) {
      if (e instanceof EvalError) throw new LogoError(e.message, a.start.line, a.start.col);
      throw e;
    }
  }

  private cond(c: Cond, f: Frame): boolean {
    let a: number, b: number;
    try {
      a = this.value(c.a, f);
      b = this.value(c.b, f);
    } catch (e) {
      if (e instanceof EvalError) throw new LogoError(e.message, c.start.line, c.start.col);
      throw e;
    }
    switch (c.op) {
      case '<': return a < b;
      case '>': return a > b;
      case '=': return a === b;
      case '<=': return a <= b;
      case '>=': return a >= b;
      case '<>': return a !== b;
    }
  }

  private moveTo(p: Vec, tok: Tok) {
    for (const c of p) {
      if (Math.abs(c) > MAX_COORD) {
        throw new LogoError('Żółw wyszedłby poza obszar rysowania: każda współrzędna musi mieścić się w zakresie od -100 000 do 100 000.', tok.line, tok.col);
      }
    }
    const t = this.turtle;
    const moved = p[0] !== t.pos[0] || p[1] !== t.pos[1] || p[2] !== t.pos[2];
    if (t.pen && moved) {
      if (this.segments.length >= MAX_SEGMENTS) {
        throw new LogoError('Przekroczono limit 10 000 odcinków na rysunku. Użyj „czyść”, żeby zacząć od nowa.', tok.line, tok.col);
      }
      this.segments.push({ from: [...t.pos] as Vec, to: [...p] as Vec, color: t.color, width: t.width });
      this.lastSegment = this.segments.length - 1;
    }
    t.pos = clean(p);
  }

  private *block(stmts: Stmt[], f: Frame): Generator<StepInfo, Signal, void> {
    for (const s of stmts) {
      const sig = yield* this.stmt(s, f);
      if (sig) return sig;
    }
    return undefined;
  }

  private *stmt(s: Stmt, f: Frame): Generator<StepInfo, Signal, void> {
    yield { tok: s.tok, kind: s.k };
    this.lastSegment = -1;
    this.count(s.tok);
    const t = this.turtle;
    switch (s.k) {
      case 'move': {
        const d = this.arg(s.arg, f) * s.sign;
        const h = t.heading;
        const p: Vec = [t.pos[0] + h[0] * d, t.pos[1] + h[1] * d, t.pos[2] + h[2] * d];
        this.moveTo(p, s.tok);
        return;
      }
      case 'turn': {
        const a = this.arg(s.arg, f) * s.sign;
        if (s.axis === 'yaw') [t.heading, t.right] = rotatePair(t.heading, t.right, a);
        else if (s.axis === 'pitch') [t.heading, t.up] = rotatePair(t.heading, t.up, a);
        else [t.up, t.right] = rotatePair(t.up, t.right, a);
        return;
      }
      case 'pen': t.pen = s.down; return;
      case 'color': t.color = s.color; return;
      case 'width': {
        const w = this.arg(s.arg, f);
        const msg = widthProblem(w);
        if (msg) throw new LogoError(msg, s.arg.start.line, s.arg.start.col);
        t.width = w;
        return;
      }
      case 'stop': return 'stop';
      case 'home': {
        this.moveTo([0, 0, 0], s.tok);
        t.heading = [0, 1, 0];
        t.right = [1, 0, 0];
        t.up = [0, 0, 1];
        return;
      }
      case 'clear':
        this.segments = [];
        this.clears++;
        return;
      case 'let': {
        const v = this.arg(s.arg, f);
        (f.locals ?? this.globals).set(s.name, v);
        return;
      }
      case 'if': {
        const ok = this.cond(s.cond, f);
        const body = ok ? s.then : s.else;
        if (!body) return;
        const sig = yield* this.block(body, f);
        if (sig) return sig;
        this.count(ok ? s.closeThen : s.closeElse!);
        return;
      }
      case 'repeat': {
        const n = this.arg(s.count, f);
        const msg = repeatProblem(n);
        if (msg) throw new LogoError(msg, s.count.start.line, s.count.start.col);
        this.enter(s.tok);
        f.reps.push(0);
        try {
          for (let i = 1; i <= n; i++) {
            f.reps[f.reps.length - 1] = i;
            const sig = yield* this.block(s.body, f);
            if (sig) return sig;
            this.count(s.close);
          }
        } finally {
          f.reps.pop();
          this.frames--;
        }
        return;
      }
      case 'call': {
        const proc = this.program.procs.get(s.name)!;
        const values = s.args.map((a) => this.arg(a, f));
        this.enter(s.tok);
        const locals = new Map<string, number>();
        proc.params.forEach((p, i) => locals.set(p, values[i]));
        try {
          yield* this.block(proc.body, { locals, reps: [] });
          this.count(s.tok);
        } finally {
          this.frames--;
        }
        return;
      }
    }
  }
}

export type Prepared = { program: Program; error: null } | { program: null; error: ErrorInfo };

export function prepare(source: string, mode: Mode): Prepared {
  try {
    return { program: parse(source, mode), error: null };
  } catch (e) {
    if (e instanceof LogoError) return { program: null, error: { message: e.message, line: e.line, column: e.column } };
    throw e;
  }
}

/** Interpretuje program w całości, bez interfejsu. */
export function run(source: string, mode: Mode): RunResult {
  const p = prepare(String(source ?? ''), mode === '3d' ? '3d' : '2d');
  if (!p.program) return { segments: [], error: p.error };
  const ex = new Execution(p.program);
  return ex.runToEnd();
}

export type { Mode };
