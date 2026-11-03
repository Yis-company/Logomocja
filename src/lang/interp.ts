// Interpreter: walks the validated tree as a generator, so the UI can step and animate.
import { LogoError, LIMITS, Token, tokenize, fmtInt } from './lexer';
import { Arg, Expr, Mode, Program, Stmt, binop, checkRepeat, checkWidth, parse } from './parser';

export type Vec = [number, number, number];

export interface Segment {
  from: Vec;
  to: Vec;
  color: string;
  width: number;
}

export interface RunResult {
  segments: Segment[];
  error: { message: string; line: number; column: number } | null;
}

interface Frame {
  locals: Map<string, number>;
  reps: number[];
  isProc: boolean;
}

const STOP = Symbol('stop');

const q = (s: string) => `„${s}”`;

/** Sine and cosine in degrees, exact at multiples of 90° so right angles stay clean. */
function sinCos(deg: number): [number, number] {
  const r = ((deg % 360) + 360) % 360;
  if (r === 0) return [0, 1];
  if (r === 90) return [1, 0];
  if (r === 180) return [0, -1];
  if (r === 270) return [-1, 0];
  const a = (deg * Math.PI) / 180;
  return [Math.sin(a), Math.cos(a)];
}

const clean = (v: number) => (v === 0 ? 0 : v);

export class Machine {
  pos: Vec = [0, 0, 0];
  h: Vec = [0, 1, 0];
  r: Vec = [1, 0, 0];
  u: Vec = [0, 0, 1];
  pen = true;
  color = '#16866a';
  width = 3;
  segments: Segment[] = [];
  ops = 0;
  frames = 0;
  globals = new Map<string, number>();
  /** Bumped whenever segments are cleared so views can rebuild. */
  clears = 0;

  constructor(public prog: Program) {}

  *run(): Generator<Token, void, void> {
    const top: Frame = { locals: this.globals, reps: [], isProc: false };
    try {
      yield* this.body(this.prog.body, top);
    } catch (e) {
      if (e !== STOP) throw e;
    }
  }

  private tick(t: Token) {
    this.ops++;
    if (this.ops > LIMITS.ops) {
      throw new LogoError(`Przekroczono limit ${fmtInt(LIMITS.ops)} wykonanych operacji. Czy program nie jest za długi albo nie zapętla się?`, t.line, t.col);
    }
  }

  private enter(t: Token) {
    this.frames++;
    if (this.frames > LIMITS.frames) {
      throw new LogoError(`Przekroczono limit ${LIMITS.frames} jednocześnie aktywnych wywołań procedur i powtórzeń. Czy rekurencja ma warunek końca?`, t.line, t.col);
    }
  }

  private *body(list: Stmt[], fr: Frame): Generator<Token, void, void> {
    for (const s of list) yield* this.stmt(s, fr);
  }

  private *stmt(s: Stmt, fr: Frame): Generator<Token, void, void> {
    this.tick(s.tok);
    switch (s.k) {
      case 'move':
        this.move(s.sign * this.arg(s.arg, fr), s.tok);
        yield s.tok;
        return;
      case 'turn':
        this.turn(s.axis, s.sign * this.arg(s.arg, fr));
        yield s.tok;
        return;
      case 'pen':
        this.pen = s.down;
        yield s.tok;
        return;
      case 'color':
        this.color = s.value;
        yield s.tok;
        return;
      case 'width': {
        const w = this.arg(s.arg, fr);
        if (!s.arg.literal) checkWidth(w, s.arg.tok);
        this.width = w;
        yield s.tok;
        return;
      }
      case 'let': {
        const v = this.arg(s.arg, fr);
        fr.locals.set(s.name, v);
        yield s.tok;
        return;
      }
      case 'stop':
        yield s.tok;
        throw STOP;
      case 'home': {
        const from = this.pos;
        if (this.pen && (from[0] !== 0 || from[1] !== 0 || from[2] !== 0)) this.addSegment(from, [0, 0, 0], s.tok);
        this.pos = [0, 0, 0];
        this.h = [0, 1, 0];
        this.r = [1, 0, 0];
        this.u = [0, 0, 1];
        yield s.tok;
        return;
      }
      case 'cs':
        this.segments = [];
        this.clears++;
        yield s.tok;
        return;
      case 'repeat': {
        const n = this.arg(s.count, fr);
        if (!s.count.literal) checkRepeat(n, s.count.tok);
        this.enter(s.tok);
        yield s.tok;
        fr.reps.push(0);
        try {
          for (let i = 1; i <= n; i++) {
            fr.reps[fr.reps.length - 1] = i;
            yield* this.body(s.body, fr);
            this.tick(s.close);
          }
        } finally {
          fr.reps.pop();
          this.frames--;
        }
        return;
      }
      case 'if': {
        const a = this.arg(s.a, fr);
        const b = this.arg(s.b, fr);
        const ok = compare(s.cmp, a, b);
        yield s.tok;
        if (ok) {
          yield* this.body(s.then, fr);
          this.tick(s.thenClose);
        } else if (s.else) {
          yield* this.body(s.else, fr);
          this.tick(s.elseClose!);
        }
        return;
      }
      case 'call': {
        const proc = this.prog.procs.get(s.name)!;
        const locals = new Map<string, number>();
        s.args.forEach((a, i) => locals.set(proc.params[i], this.arg(a, fr)));
        this.enter(s.tok);
        yield s.tok;
        try {
          yield* this.body(proc.body, { locals, reps: [], isProc: true });
        } catch (e) {
          if (e !== STOP) throw e;
        } finally {
          this.frames--;
        }
        this.tick(s.tok);
        return;
      }
    }
  }

  private arg(a: Arg, fr: Frame): number {
    let v: number;
    try {
      v = this.eval(a.e, fr);
    } catch (e) {
      if (e instanceof RangeError) {
        throw new LogoError(e.message === 'div0' ? 'Dzielenie przez zero.' : 'Wynik obliczenia nie jest skończoną liczbą.', a.tok.line, a.tok.col);
      }
      if (e instanceof Unassigned) {
        throw new LogoError(`Zmienna ${q(e.name)} nie ma jeszcze wartości. Ustaw ją wcześniej poleceniem niech.`, a.tok.line, a.tok.col);
      }
      throw e;
    }
    if (!Number.isFinite(v)) throw new LogoError('Wynik obliczenia nie jest skończoną liczbą.', a.tok.line, a.tok.col);
    return v;
  }

  private eval(e: Expr, fr: Frame): number {
    switch (e.k) {
      case 'num': return e.v;
      case 'rep': return fr.reps[fr.reps.length - 1];
      case 'neg': return -this.eval(e.e, fr);
      case 'var': {
        if (fr.isProc && fr.locals.has(e.name)) return fr.locals.get(e.name)!;
        const g = this.globals.get(e.name);
        if (g === undefined) throw new Unassigned(e.tok.text.replace(/^:/, ''));
        return g;
      }
      case 'bin': {
        const v = binop(e.op, this.eval(e.a, fr), this.eval(e.b, fr));
        if (!Number.isFinite(v)) throw new RangeError('inf');
        return v;
      }
    }
  }

  private move(d: number, t: Token) {
    const p = this.pos;
    const to: Vec = [clean(p[0] + this.h[0] * d), clean(p[1] + this.h[1] * d), clean(p[2] + this.h[2] * d)];
    if (to.some((c) => Math.abs(c) > LIMITS.coord || !Number.isFinite(c))) {
      throw new LogoError(`Żółw wyszedłby poza obszar rysunku: każda współrzędna musi mieścić się w ±${fmtInt(LIMITS.coord)}.`, t.line, t.col);
    }
    if (this.pen && (to[0] !== p[0] || to[1] !== p[1] || to[2] !== p[2])) this.addSegment(p, to, t);
    this.pos = to;
  }

  private addSegment(from: Vec, to: Vec, t: Token) {
    if (this.segments.length >= LIMITS.segments) {
      throw new LogoError(`Przekroczono limit ${fmtInt(LIMITS.segments)} narysowanych odcinków.`, t.line, t.col);
    }
    this.segments.push({ from: [...from], to: [...to], color: this.color, width: this.width });
  }

  private turn(axis: 'yaw' | 'pitch' | 'roll', deg: number) {
    const [s, c] = sinCos(deg);
    const { h, r, u } = this;
    const mix = (a: Vec, b: Vec, ca: number, cb: number): Vec => [
      clean(a[0] * ca + b[0] * cb), clean(a[1] * ca + b[1] * cb), clean(a[2] * ca + b[2] * cb),
    ];
    if (axis === 'yaw') {
      this.h = mix(h, r, c, s);
      this.r = mix(r, h, c, -s);
    } else if (axis === 'pitch') {
      this.h = mix(h, u, c, s);
      this.u = mix(u, h, c, -s);
    } else {
      this.u = mix(u, r, c, s);
      this.r = mix(r, u, c, -s);
    }
  }
}

class Unassigned extends Error {
  constructor(public name: string) { super(name); }
}

function compare(op: string, a: number, b: number) {
  switch (op) {
    case '<': return a < b;
    case '>': return a > b;
    case '=': return a === b;
    case '<=': return a <= b;
    case '>=': return a >= b;
    default: return a !== b;
  }
}

export function compile(source: string, mode: Mode): Program {
  return parse(tokenize(source), mode);
}

export function toError(e: unknown) {
  if (e instanceof LogoError) return { message: e.message, line: e.line, column: e.column };
  throw e;
}

/** Interpret a whole program without any UI. */
export function run(source: string, mode: Mode): RunResult {
  let prog: Program;
  try {
    prog = compile(String(source), mode === '3d' ? '3d' : '2d');
  } catch (e) {
    return { segments: [], error: toError(e) };
  }
  const m = new Machine(prog);
  try {
    const it = m.run();
    while (!it.next().done);
  } catch (e) {
    return { segments: m.segments, error: toError(e) };
  }
  return { segments: m.segments, error: null };
}
