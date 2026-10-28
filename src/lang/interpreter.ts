import { DEFAULT_COLOR, DEFAULT_WIDTH, LIMITS, LogoErr, type LogoError, type Mode, type RunResult, type Segment, type Vec3 } from './types';
import { parse, REPEAT_MSG, WIDTH_MSG, type Arg, type Cond, type Expr, type Program, type Proc, type Stmt } from './parser';
import type { Token } from './lexer';

interface Env {
  locals: Map<string, number> | null;
  rep: number[];
}

/** cos/sin of an angle in degrees, exact for multiples of 90. */
function trig(deg: number): [number, number] {
  let m = deg % 360;
  if (m < 0) m += 360;
  if (m === 0) return [1, 0];
  if (m === 90) return [0, 1];
  if (m === 180) return [-1, 0];
  if (m === 270) return [0, -1];
  const r = (m * Math.PI) / 180;
  return [Math.cos(r), Math.sin(r)];
}

const clean = (v: number) => v + 0; // turns -0 into 0

export interface Pose {
  pos: Vec3;
  h: Vec3;
  r: Vec3;
  u: Vec3;
  pen: boolean;
  color: string;
  width: number;
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
  frames = 0;
  error: LogoError | null = null;
  finished = false;
  private globals = new Map<string, number>();

  constructor(
    private program: Program,
    readonly mode: Mode,
  ) {}

  pose(): Pose {
    return {
      pos: [...this.pos], h: [...this.h], r: [...this.r], u: [...this.u],
      pen: this.pen, color: this.color, width: this.width,
    };
  }

  /** Runs the whole program; yields the token of each visible command after it executed. */
  *steps(): Generator<Token, void, void> {
    try {
      yield* this.block(this.program.main, { locals: null, rep: [] });
    } catch (e) {
      if (e instanceof LogoErr) this.error = e.toJSON();
      else throw e;
    }
    this.finished = true;
  }

  private tick(t: Token): void {
    if (++this.ops > LIMITS.ops) {
      throw new LogoErr(`Przekroczono limit ${LIMITS.ops} wykonanych operacji.`, t.line, t.col);
    }
  }

  private enterFrame(t: Token): void {
    if (this.frames >= LIMITS.frames) {
      throw new LogoErr(`Przekroczono limit ${LIMITS.frames} jednocześnie aktywnych wywołań i powtórzeń.`, t.line, t.col);
    }
    this.frames++;
  }

  // ---------- expressions ----------

  private eval(e: Expr, env: Env, at: Token): number {
    switch (e.k) {
      case 'num': return e.v;
      case 'rep': return env.rep[env.rep.length - 1];
      case 'var': {
        const v = env.locals?.get(e.name) ?? this.globals.get(e.name);
        if (v === undefined) throw new LogoErr(`Zmienna „${e.name}” nie ma jeszcze wartości.`, at.line, at.col);
        return v;
      }
      case 'neg': return -this.eval(e.a, env, at);
      case 'bin': {
        const a = this.eval(e.a, env, at);
        const b = this.eval(e.b, env, at);
        let r: number;
        switch (e.op) {
          case '+': r = a + b; break;
          case '-': r = a - b; break;
          case '*': r = a * b; break;
          default:
            if (b === 0) throw new LogoErr('Dzielenie przez zero.', at.line, at.col);
            r = a / b;
        }
        if (!Number.isFinite(r)) throw new LogoErr('Wynik działania nie jest liczbą skończoną.', at.line, at.col);
        return r;
      }
    }
  }

  private arg(a: Arg, env: Env): number {
    return this.eval(a.e, env, a.tok);
  }

  private cond(c: Cond, env: Env): boolean {
    const l = this.eval(c.left, env, c.tok);
    const r = this.eval(c.right, env, c.tok);
    switch (c.op) {
      case '<': return l < r;
      case '>': return l > r;
      case '=': return l === r;
      case '<=': return l <= r;
      case '>=': return l >= r;
      default: return l !== r;
    }
  }

  // ---------- turtle ----------

  private addSegment(from: Vec3, to: Vec3, t: Token): void {
    if (this.segments.length >= LIMITS.segments) {
      throw new LogoErr(`Przekroczono limit ${LIMITS.segments} odcinków.`, t.line, t.col);
    }
    this.segments.push({ from: [clean(from[0]), clean(from[1]), clean(from[2])], to: [clean(to[0]), clean(to[1]), clean(to[2])], color: this.color, width: this.width });
  }

  private move(d: number, t: Token): void {
    if (d === 0) return;
    const np: Vec3 = [this.pos[0] + this.h[0] * d, this.pos[1] + this.h[1] * d, this.pos[2] + this.h[2] * d];
    for (const c of np) {
      if (!Number.isFinite(c) || Math.abs(c) > LIMITS.coord) {
        throw new LogoErr(`Żółw wyszedł poza dozwolony zakres współrzędnych ±${LIMITS.coord}.`, t.line, t.col);
      }
    }
    if (this.pen) this.addSegment(this.pos, np, t);
    this.pos = [clean(np[0]), clean(np[1]), clean(np[2])];
  }

  /** a' = a cos + b sin ; b' = b cos - a sin */
  private rotate(a: 'h' | 'r' | 'u', b: 'h' | 'r' | 'u', deg: number): void {
    const [c, s] = trig(deg);
    const A = this[a];
    const B = this[b];
    const na: Vec3 = [A[0] * c + B[0] * s, A[1] * c + B[1] * s, A[2] * c + B[2] * s];
    const nb: Vec3 = [B[0] * c - A[0] * s, B[1] * c - A[1] * s, B[2] * c - A[2] * s];
    this[a] = [clean(na[0]), clean(na[1]), clean(na[2])];
    this[b] = [clean(nb[0]), clean(nb[1]), clean(nb[2])];
  }

  private home(t: Token): void {
    const there = this.pos[0] === 0 && this.pos[1] === 0 && this.pos[2] === 0;
    if (this.pen && !there) this.addSegment(this.pos, [0, 0, 0], t);
    this.pos = [0, 0, 0];
    this.h = [0, 1, 0];
    this.r = [1, 0, 0];
    this.u = [0, 0, 1];
  }

  // ---------- statements ----------

  private *block(stmts: Stmt[], env: Env): Generator<Token, 'stop' | undefined, void> {
    for (const s of stmts) {
      switch (s.k) {
        case 'cmd': {
          this.tick(s.tok);
          const a = s.arg;
          switch (s.cmd) {
            case 'fd': this.move(this.arg(a!, env), s.tok); break;
            case 'bk': this.move(-this.arg(a!, env), s.tok); break;
            case 'rt': this.rotate('h', 'r', this.arg(a!, env)); break;
            case 'lt': this.rotate('h', 'r', -this.arg(a!, env)); break;
            case 'pitchup': this.rotate('h', 'u', this.arg(a!, env)); break;
            case 'pitchdown': this.rotate('h', 'u', -this.arg(a!, env)); break;
            case 'rollright': this.rotate('u', 'r', this.arg(a!, env)); break;
            case 'rollleft': this.rotate('u', 'r', -this.arg(a!, env)); break;
            case 'pu': this.pen = false; break;
            case 'pd': this.pen = true; break;
            case 'color': this.color = s.colorHex!; break;
            case 'width': {
              const w = this.arg(a!, env);
              if (!Number.isInteger(w) || w < LIMITS.widthMin || w > LIMITS.widthMax) {
                throw new LogoErr(WIDTH_MSG, a!.tok.line, a!.tok.col);
              }
              this.width = w;
              break;
            }
            case 'home': this.home(s.tok); break;
            case 'cs': this.segments = []; break;
            case 'stop':
              yield s.tok;
              return 'stop';
          }
          yield s.tok;
          break;
        }
        case 'let': {
          this.tick(s.tok);
          const v = this.arg(s.value, env);
          (env.locals ?? this.globals).set(s.name, v);
          yield s.tok;
          break;
        }
        case 'repeat': {
          this.tick(s.tok);
          const n = this.arg(s.count, env);
          if (!Number.isInteger(n) || n < 0 || n > LIMITS.repeatMax) {
            throw new LogoErr(REPEAT_MSG, s.count.tok.line, s.count.tok.col);
          }
          if (n === 0) break;
          this.enterFrame(s.tok);
          for (let i = 1; i <= n; i++) {
            env.rep.push(i);
            const res = yield* this.block(s.body, env);
            env.rep.pop();
            if (res === 'stop') {
              this.frames--;
              return 'stop';
            }
            this.tick(s.tok);
          }
          this.frames--;
          break;
        }
        case 'if': {
          this.tick(s.tok);
          const body = this.cond(s.cond, env) ? s.then : s.else;
          if (body) {
            const res = yield* this.block(body, env);
            if (res === 'stop') return 'stop';
            this.tick(s.tok);
          }
          break;
        }
        case 'call': {
          this.tick(s.tok);
          const proc = this.program.procs.get(s.proc) as Proc;
          const locals = new Map<string, number>();
          proc.params.forEach((p, i) => locals.set(p, this.arg(s.args[i], env)));
          this.enterFrame(s.tok);
          yield* this.block(proc.body, { locals, rep: [] });
          this.frames--;
          this.tick(s.tok);
          break;
        }
      }
    }
    return undefined;
  }
}

export function toError(e: unknown): LogoError {
  if (e instanceof LogoErr) return e.toJSON();
  throw e;
}

/** Parses source, returning either a program or the parse-time error. */
export function compile(source: string, mode: Mode): { program: Program; error: null } | { program: null; error: LogoError } {
  try {
    return { program: parse(source, mode), error: null };
  } catch (e) {
    return { program: null, error: toError(e) };
  }
}

/** Interprets `source` to completion (no animation). */
export function runProgram(source: string, mode: Mode): RunResult {
  const c = compile(source, mode);
  if (c.error) return { segments: [], error: c.error };
  const m = new Machine(c.program, mode);
  const it = m.steps();
  while (!it.next().done) { /* drain */ }
  return { segments: m.segments, error: m.error };
}
