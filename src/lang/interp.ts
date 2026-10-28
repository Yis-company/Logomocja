import { Token } from './lexer';
import { applyOp, Arg, CmdName, Cond, Expr, LogoError, Mode, parse, Program, Stmt } from './parser';

export type Vec3 = [number, number, number];

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface RunError { message: string; line: number; column: number }
export interface RunResult { segments: Segment[]; error: RunError | null }

export const LIMITS = {
  frames: 32,
  ops: 10000,
  segments: 10000,
  coord: 100000,
} as const;

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

interface Frame {
  locals: Map<string, number>;
  reps: number[];
}

class EvalError extends Error {}

function sincos(deg: number): [number, number] {
  const m = ((deg % 360) + 360) % 360;
  if (m === 0) return [0, 1];
  if (m === 90) return [1, 0];
  if (m === 180) return [0, -1];
  if (m === 270) return [-1, 0];
  const r = (deg * Math.PI) / 180;
  return [Math.sin(r), Math.cos(r)];
}

export class Machine {
  segments: Segment[] = [];
  pos: Vec3 = [0, 0, 0];
  h: Vec3 = [0, 1, 0];
  r: Vec3 = [1, 0, 0];
  u: Vec3 = [0, 0, 1];
  pen = true;
  color = DEFAULT_COLOR;
  width = DEFAULT_WIDTH;
  ops = 0;
  /** Zwiększany przy każdej zmianie listy odcinków (także czyszczeniu). */
  version = 0;
  private depth = 0;
  private globals = new Map<string, number>();

  constructor(public program: Program) {}

  private limit(msg: string, tok: Token): never {
    throw new LogoError(msg, tok);
  }

  private tick(tok: Token) {
    if (++this.ops > LIMITS.ops) this.limit(`Przekroczono limit ${LIMITS.ops} wykonanych operacji`, tok);
  }
  private enter(tok: Token) {
    if (++this.depth > LIMITS.frames) {
      this.limit(`Przekroczono limit ${LIMITS.frames} zagnieżdżonych wywołań i powtórzeń`, tok);
    }
  }

  /** Wykonuje program; po każdym wykonanym poleceniu oddaje jego token. */
  *steps(): Generator<Token, void, void> {
    const top: Frame = { locals: this.globals, reps: [] };
    yield* this.block(this.program.body, top);
  }

  private *block(stmts: Stmt[], f: Frame): Generator<Token, boolean, void> {
    for (const s of stmts) {
      if (yield* this.stmt(s, f)) return true;
    }
    return false;
  }

  private *stmt(s: Stmt, f: Frame): Generator<Token, boolean, void> {
    switch (s.k) {
      case 'cmd':
        this.tick(s.tok);
        this.command(s.name, s.tok, s.arg, f);
        yield s.tok;
        return s.name === 'stop';
      case 'color':
        this.tick(s.tok);
        this.color = s.color;
        yield s.tok;
        return false;
      case 'let': {
        this.tick(s.tok);
        const v = this.evalArg(s.value, f);
        f.locals.set(s.name, v);
        yield s.tok;
        return false;
      }
      case 'repeat': {
        this.tick(s.tok);
        const n = this.evalArg(s.count, f);
        if (!Number.isInteger(n) || n < 0 || n > 10000) {
          throw new LogoError('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000', s.count.tok);
        }
        this.enter(s.tok);
        for (let i = 1; i <= n; i++) {
          f.reps.push(i);
          const stopped = yield* this.block(s.body, f);
          f.reps.pop();
          if (stopped) { this.depth--; return true; }
          this.tick(s.tok);
        }
        this.depth--;
        return false;
      }
      case 'if': {
        this.tick(s.tok);
        const holds = this.evalCond(s.cond, f);
        const body = holds ? s.then : s.else;
        if (!body) return false;
        if (yield* this.block(body, f)) return true;
        this.tick(s.tok);
        return false;
      }
      case 'call': {
        this.tick(s.tok);
        const proc = this.program.procs.get(s.proc)!;
        const locals = new Map<string, number>();
        proc.params.forEach((p, i) => locals.set(p, this.evalArg(s.args[i], f)));
        this.enter(s.tok);
        yield* this.block(proc.body, { locals, reps: [] });
        this.depth--;
        this.tick(s.tok);
        return false;
      }
    }
  }

  // ---------- wyrażenia ----------
  private evalArg(a: Arg, f: Frame): number {
    try {
      return this.ev(a.e, f);
    } catch (e) {
      if (e instanceof EvalError) throw new LogoError(e.message, a.tok);
      if (e instanceof RangeError) throw new LogoError('Wyrażenie jest zbyt głęboko zagnieżdżone', a.tok);
      throw e;
    }
  }

  private evalCond(c: Cond, f: Frame): boolean {
    let l: number, r: number;
    try {
      l = this.ev(c.l, f);
      r = this.ev(c.r, f);
    } catch (e) {
      if (e instanceof EvalError) throw new LogoError(e.message, c.tok);
      if (e instanceof RangeError) throw new LogoError('Wyrażenie jest zbyt głęboko zagnieżdżone', c.tok);
      throw e;
    }
    switch (c.op) {
      case '<': return l < r;
      case '>': return l > r;
      case '=': return l === r;
      case '<=': return l <= r;
      case '>=': return l >= r;
      default: return l !== r;
    }
  }

  private ev(e: Expr, f: Frame): number {
    switch (e.t) {
      case 'num': return e.v;
      case 'var': {
        let v = f.locals.get(e.name);
        if (v === undefined && f.locals !== this.globals) v = this.globals.get(e.name);
        if (v === undefined) throw new EvalError(`Zmienna „${e.name}” nie ma jeszcze przypisanej wartości`);
        return v;
      }
      case 'rep': return f.reps[f.reps.length - 1];
      case 'neg': return 0 - this.ev(e.e, f) + 0;
      case 'bin': {
        const a = this.ev(e.l, f);
        const b = this.ev(e.r, f);
        try { return applyOp(e.op, a, b); } catch (err) { throw new EvalError((err as Error).message); }
      }
    }
  }

  // ---------- żółw ----------
  private command(name: CmdName, tok: Token, arg: Arg | undefined, f: Frame) {
    switch (name) {
      case 'fd': this.move(this.evalArg(arg!, f), tok); break;
      case 'bk': this.move(-this.evalArg(arg!, f), tok); break;
      case 'rt': this.turn(this.evalArg(arg!, f), 'yaw'); break;
      case 'lt': this.turn(-this.evalArg(arg!, f), 'yaw'); break;
      case 'pitchup': this.turn(this.evalArg(arg!, f), 'pitch'); break;
      case 'pitchdown': this.turn(-this.evalArg(arg!, f), 'pitch'); break;
      case 'rollright': this.turn(this.evalArg(arg!, f), 'roll'); break;
      case 'rollleft': this.turn(-this.evalArg(arg!, f), 'roll'); break;
      case 'pu': this.pen = false; break;
      case 'pd': this.pen = true; break;
      case 'width': {
        const w = this.evalArg(arg!, f);
        if (!Number.isInteger(w) || w < 1 || w > 12) {
          throw new LogoError('Grubość musi być liczbą całkowitą od 1 do 12', arg!.tok);
        }
        this.width = w;
        break;
      }
      case 'home': this.goto([0, 0, 0], tok); this.h = [0, 1, 0]; this.r = [1, 0, 0]; this.u = [0, 0, 1]; break;
      case 'cs': this.segments.length = 0; this.version++; break;
      case 'stop': break;
    }
  }

  private goto(to: Vec3, tok: Token) {
    const from = this.pos;
    if (to[0] === from[0] && to[1] === from[1] && to[2] === from[2]) return;
    for (const c of to) {
      if (Math.abs(c) > LIMITS.coord) this.limit(`Współrzędna wykracza poza dozwolony zakres ±${LIMITS.coord}`, tok);
    }
    if (this.pen) {
      if (this.segments.length >= LIMITS.segments) this.limit(`Przekroczono limit ${LIMITS.segments} odcinków`, tok);
      this.segments.push({ from: [...from], to: [...to], color: this.color, width: this.width });
      this.version++;
    }
    this.pos = to;
  }

  private move(d: number, tok: Token) {
    if (d === 0) return;
    const p = this.pos;
    const h = this.h;
    this.goto([p[0] + h[0] * d + 0, p[1] + h[1] * d + 0, p[2] + h[2] * d + 0], tok);
  }

  private turn(deg: number, kind: 'yaw' | 'pitch' | 'roll') {
    const [s, c] = sincos(deg);
    // yaw: (h, r) wokół u; pitch: (h, u) wokół r; roll: (u, r) wokół h
    const [a, b] = kind === 'yaw' ? [this.h, this.r] : kind === 'pitch' ? [this.h, this.u] : [this.u, this.r];
    const na: Vec3 = [0, 0, 0];
    const nb: Vec3 = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      na[i] = a[i] * c + b[i] * s + 0;
      nb[i] = b[i] * c - a[i] * s + 0;
    }
    if (kind === 'yaw') { this.h = na; this.r = nb; }
    else if (kind === 'pitch') { this.h = na; this.u = nb; }
    else { this.u = na; this.r = nb; }
  }
}

function toError(e: unknown): RunError {
  if (e instanceof LogoError) return { message: e.message, line: e.line, column: e.column };
  throw e;
}

/** Interpretuje program bez udziału interfejsu. */
export function run(source: string, mode: Mode): RunResult {
  const m: Mode = mode === '3d' ? '3d' : '2d';
  let program: Program;
  try {
    program = parse(String(source), m);
  } catch (e) {
    return { segments: [], error: toError(e) };
  }
  const machine = new Machine(program);
  let error: RunError | null = null;
  try {
    for (const _ of machine.steps()) { /* do końca */ }
  } catch (e) {
    error = toError(e);
  }
  return {
    segments: machine.segments.map(s => ({ from: [...s.from] as Vec3, to: [...s.to] as Vec3, color: s.color, width: s.width })),
    error,
  };
}
