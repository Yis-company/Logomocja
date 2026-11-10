// Maszyna wykonująca program: żółw, odcinki, limity, praca krokowa.
import { LogoError, type Tok } from "./lexer";
import {
  parse as parseRaw, repeatProblem, widthProblem, fmt,
  type Arg, type Cond, type Expr, type Mode, type Node, type Program,
} from "./parser";

export type Vec = [number, number, number];
export interface Segment { from: Vec; to: Vec; color: string; width: number }
export interface RunError { message: string; line: number; column: number }
export interface RunResult { segments: Segment[]; error: RunError | null }

export const MAX_OPS = 10000;
export const MAX_SEGMENTS = 10000;
export const MAX_FRAMES = 32;
export const MAX_COORD = 100000;
export const DEFAULT_COLOR = "#16866a";
export const DEFAULT_WIDTH = 3;

const TOO_COMPLEX = "Wyrażenie jest zbyt złożone (za dużo zagnieżdżonych nawiasów lub znaków).";

export function parse(source: string, mode: Mode): Program {
  try {
    return parseRaw(source, mode);
  } catch (e) {
    if (e instanceof RangeError) throw new LogoError(TOO_COMPLEX, { line: 1, col: 1, off: 0, len: 1 });
    throw e;
  }
}

/** Dokładne sin/cos dla wielokrotności 90°. */
function trig(deg: number): [number, number] {
  const a = ((deg % 360) + 360) % 360;
  if (a === 0) return [1, 0];
  if (a === 90) return [0, 1];
  if (a === 180) return [-1, 0];
  if (a === 270) return [0, -1];
  const rad = (deg * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad)];
}

interface Env { locals: Map<string, number> | null }

export class Machine {
  segments: Segment[] = [];
  pos: Vec = [0, 0, 0];
  h: Vec = [0, 1, 0];
  r: Vec = [1, 0, 0];
  u: Vec = [0, 0, 1];
  pen = true;
  color = DEFAULT_COLOR;
  width = DEFAULT_WIDTH;
  error: LogoError | null = null;
  done = false;
  /** Token polecenia, które wykona się jako następne. */
  next: Tok | null = null;
  ops = 0;
  /** Rośnie przy każdym „czyść” — widok wie, że trzeba przerysować od zera. */
  clears = 0;
  private frames = 0;
  private globals = new Map<string, number>();
  private gen: Generator<Tok, boolean, void>;

  constructor(public program: Program) {
    this.gen = this.body(program.body, { locals: null }, 0);
    this.advance();
  }

  /** Wykonuje jedno polecenie. Zwraca false, gdy program się skończył. */
  step(): boolean {
    if (!this.done) this.advance();
    return !this.done;
  }

  runToEnd(): void {
    while (this.step());
  }

  private advance(): void {
    try {
      const res = this.gen.next();
      if (res.done) { this.done = true; this.next = null; }
      else this.next = res.value;
    } catch (e) {
      this.done = true;
      if (e instanceof LogoError) this.error = e;
      else if (e instanceof RangeError) this.error = new LogoError(TOO_COMPLEX, this.next ?? { line: 1, col: 1 });
      else throw e;
    }
  }

  private tick(tok: Tok): void {
    if (++this.ops > MAX_OPS)
      throw new LogoError("Przekroczono limit 10 000 wykonanych operacji. Może program się zapętlił?", tok);
  }

  private enter(tok: Tok): void {
    if (this.frames >= MAX_FRAMES)
      throw new LogoError(`Za głęboko: limit to ${MAX_FRAMES} aktywne wywołania procedur i pętle naraz. Może rekurencja nie ma warunku „stop”?`, tok);
    this.frames++;
  }

  private ev(e: Expr, env: Env, rep: number, at: Tok): number {
    switch (e.k) {
      case "num": return e.v;
      case "rep": return rep;
      case "neg": return -this.ev(e.e, env, rep, at);
      case "var": {
        const v = env.locals?.get(e.name) ?? this.globals.get(e.name);
        if (v === undefined) throw new LogoError(`Zmienna „${e.name}” nie ma jeszcze wartości — najpierw nadaj ją poleceniem „niech”.`, at);
        return v;
      }
      case "bin": {
        const l = this.ev(e.l, env, rep, at);
        const r = this.ev(e.r, env, rep, at);
        let v: number;
        switch (e.op) {
          case "+": v = l + r; break;
          case "-": v = l - r; break;
          case "*": v = l * r; break;
          default:
            if (r === 0) throw new LogoError("Dzielenie przez zero.", at);
            v = l / r;
        }
        if (!Number.isFinite(v)) throw new LogoError("Wynik działania jest za duży (nieskończony).", at);
        return v;
      }
    }
  }

  private arg(a: Arg, env: Env, rep: number): number {
    return this.ev(a.e, env, rep, a.at);
  }

  private cond(c: Cond, env: Env, rep: number): boolean {
    const l = this.ev(c.l, env, rep, c.at);
    const r = this.ev(c.r, env, rep, c.at);
    switch (c.op) {
      case "<": return l < r;
      case ">": return l > r;
      case "=": return l === r;
      case "<=": return l <= r;
      case ">=": return l >= r;
      default: return l !== r;
    }
  }

  private moveTo(np: Vec, tok: Tok): void {
    for (const c of np) {
      if (!Number.isFinite(c) || Math.abs(c) > MAX_COORD)
        throw new LogoError("Żółw uciekł za daleko: współrzędne muszą mieścić się w zakresie ±100 000.", tok);
    }
    const p = this.pos;
    const to: Vec = [np[0] + 0, np[1] + 0, np[2] + 0];
    if (to[0] === p[0] && to[1] === p[1] && to[2] === p[2]) return;
    if (this.pen) {
      if (this.segments.length >= MAX_SEGMENTS)
        throw new LogoError("Rysunek ma już 10 000 odcinków — to limit.", tok);
      this.segments.push({ from: [p[0], p[1], p[2]], to: [to[0], to[1], to[2]], color: this.color, width: this.width });
    }
    this.pos = to;
  }

  private rotate(a: Vec, b: Vec, deg: number): void {
    const [c, s] = trig(deg);
    for (let i = 0; i < 3; i++) {
      const x = a[i], y = b[i];
      a[i] = x * c + y * s + 0;
      b[i] = y * c - x * s + 0;
    }
  }

  private *body(nodes: Node[], env: Env, rep: number): Generator<Tok, boolean, void> {
    for (const nd of nodes) {
      yield nd.tok;
      this.tick(nd.tok);
      switch (nd.k) {
        case "move": {
          const d = this.arg(nd.arg, env, rep) * nd.sign;
          if (d !== 0) {
            const p = this.pos, h = this.h;
            this.moveTo([p[0] + h[0] * d, p[1] + h[1] * d, p[2] + h[2] * d], nd.tok);
          }
          break;
        }
        case "turn": {
          const a = this.arg(nd.arg, env, rep) * nd.sign;
          if (nd.axis === "yaw") this.rotate(this.h, this.r, a);
          else if (nd.axis === "pitch") this.rotate(this.h, this.u, a);
          else this.rotate(this.u, this.r, a);
          break;
        }
        case "pen": this.pen = nd.down; break;
        case "color": this.color = nd.color; break;
        case "width": {
          const v = this.arg(nd.arg, env, rep);
          const prob = widthProblem(v);
          if (prob) throw new LogoError(prob, nd.arg.at);
          this.width = v;
          break;
        }
        case "home":
          this.moveTo([0, 0, 0], nd.tok);
          this.h = [0, 1, 0]; this.r = [1, 0, 0]; this.u = [0, 0, 1];
          break;
        case "clear":
          this.segments = [];
          this.clears++;
          break;
        case "let": {
          const v = this.arg(nd.arg, env, rep);
          (env.locals ?? this.globals).set(nd.name, v);
          break;
        }
        case "stop": return true;
        case "if": {
          const b = this.cond(nd.cond, env, rep) ? nd.then : nd.else;
          if (b) {
            if (yield* this.body(b, env, rep)) return true;
            this.tick(nd.tok);
          }
          break;
        }
        case "repeat": {
          const n = this.arg(nd.arg, env, rep);
          const prob = repeatProblem(n);
          if (prob) throw new LogoError(prob, nd.arg.at);
          this.enter(nd.tok);
          for (let i = 1; i <= n; i++) {
            if (yield* this.body(nd.body, env, i)) { this.frames--; return true; }
            this.tick(nd.tok);
          }
          this.frames--;
          break;
        }
        case "call": {
          const locals = new Map<string, number>();
          const params = nd.proc.params;
          for (let i = 0; i < params.length; i++) locals.set(params[i], this.arg(nd.args[i], env, rep));
          this.enter(nd.tok);
          yield* this.body(nd.proc.body, { locals }, 0);
          this.frames--;
          this.tick(nd.tok);
          break;
        }
      }
    }
    return false;
  }
}

function toRunError(e: LogoError): RunError {
  return { message: e.message, line: e.line, column: e.column };
}

export function copySegments(segs: Segment[]): Segment[] {
  return segs.map((s) => ({ from: [...s.from] as Vec, to: [...s.to] as Vec, color: s.color, width: s.width }));
}

/** Interpretuje program w całości. Nie dotyka interfejsu. */
export function run(source: string, mode: Mode = "2d"): RunResult {
  const src = typeof source === "string" ? source : String(source ?? "");
  const md: Mode = mode === "3d" ? "3d" : "2d";
  let program: Program;
  try {
    program = parse(src, md);
  } catch (e) {
    if (e instanceof LogoError) return { segments: [], error: toRunError(e) };
    throw e;
  }
  const m = new Machine(program);
  m.runToEnd();
  return { segments: copySegments(m.segments), error: m.error ? toRunError(m.error) : null };
}

export { LogoError, fmt };
export type { Mode, Program, Tok };
