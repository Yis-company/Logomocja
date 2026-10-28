import { LogoError, type Token } from './lexer';
import type { Arg, Expr, Program, Stmt } from './ast';
import { MAX_REPEAT, MAX_WIDTH } from './parser';
import { compare, evaluate, fail } from './evaluate';

export const MAX_OPERATIONS = 10_000;
export const MAX_SEGMENTS = 10_000;
export const MAX_COORD = 100_000;
export const MAX_FRAMES = 32;
export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;
const EPS = 1e-9;

export type Vec3 = [number, number, number];

export interface Pos {
  line: number;
  col: number;
}

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface Turtle {
  pos: Vec3;
  /** Heading (the direction of forward movement). */
  h: Vec3;
  /** Right vector. */
  r: Vec3;
  /** Up vector. */
  u: Vec3;
  pen: boolean;
  color: string;
  width: number;
}

export interface RunError {
  message: string;
  line: number;
  column: number;
}

type Frame = { locals: Map<string, number>; top: boolean };
interface Env {
  frame: Frame;
  rep: number | undefined;
}

class StopSignal {}

const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const scale = (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const norm = (a: Vec3): Vec3 => scale(a, 1 / Math.hypot(a[0], a[1], a[2]));
const clean = (v: number) => (Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1e9) / 1e9);
const cleanVec = (a: Vec3): Vec3 => [clean(a[0]), clean(a[1]), clean(a[2])];
const dist = (a: Vec3, b: Vec3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

export function freshTurtle(): Turtle {
  return {
    pos: [0, 0, 0],
    h: [0, 1, 0],
    r: [1, 0, 0],
    u: [0, 0, 1],
    pen: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
}

/**
 * Executes a validated program. Each statement is a step: the generator yields
 * the token of the statement about to run and runs it when resumed.
 */
export class Machine {
  segments: Segment[] = [];
  turtle: Turtle = freshTurtle();
  private readonly globals = new Map<string, number>();
  private readonly topFrame: Frame = { locals: this.globals, top: true };
  private ops = 0;
  private frames = 0;

  constructor(private readonly prog: Program) {}

  *execute(): Generator<Token, void, void> {
    try {
      yield* this.block(this.prog.top, { frame: this.topFrame, rep: undefined });
    } catch (e) {
      if (!(e instanceof StopSignal)) throw e;
    }
  }

  private *block(stmts: Stmt[], env: Env): Generator<Token, void, void> {
    for (const s of stmts) {
      yield s.tok;
      yield* this.statement(s, env);
    }
  }

  private tick(tok: Token) {
    if (++this.ops > MAX_OPERATIONS) {
      throw fail(tok, `Przekroczono limit ${MAX_OPERATIONS} wykonanych operacji.`);
    }
  }

  private enterFrame(tok: Token) {
    if (this.frames >= MAX_FRAMES) {
      throw fail(tok, `Przekroczono limit ${MAX_FRAMES} zagnieżdżonych wywołań i powtórzeń.`);
    }
    this.frames++;
  }

  private lookup(name: string, env: Env): number | undefined {
    const v = env.frame.locals.get(name);
    if (v !== undefined || env.frame.top) return v;
    return this.globals.get(name);
  }

  private value(a: Arg, env: Env): number {
    return evaluate(a.e, { get: (n) => this.lookup(n, env), rep: env.rep }, a.tok);
  }

  private *statement(s: Stmt, env: Env): Generator<Token, void, void> {
    this.tick(s.tok);
    switch (s.op) {
      case 'fd':
        return this.moveBy(this.value(s.args[0], env), s);
      case 'bk':
        return this.moveBy(-this.value(s.args[0], env), s);
      case 'rt':
        return this.rotate(this.value(s.args[0], env), s, 'turnRight');
      case 'lt':
        return this.rotate(-this.value(s.args[0], env), s, 'turnRight');
      case 'pitchup':
        return this.rotate(this.value(s.args[0], env), s, 'pitch');
      case 'pitchdown':
        return this.rotate(-this.value(s.args[0], env), s, 'pitch');
      case 'rollright':
        return this.rotate(this.value(s.args[0], env), s, 'roll');
      case 'rollleft':
        return this.rotate(-this.value(s.args[0], env), s, 'roll');
      case 'pu':
        this.turtle.pen = false;
        return;
      case 'pd':
        this.turtle.pen = true;
        return;
      case 'color':
        this.turtle.color = s.value;
        return;
      case 'width': {
        const w = this.value(s.args[0], env);
        if (!Number.isInteger(w) || w < 1 || w > MAX_WIDTH) {
          throw fail(s.args[0].tok, `Grubość linii musi być liczbą całkowitą od 1 do ${MAX_WIDTH}.`);
        }
        this.turtle.width = w;
        return;
      }
      case 'home':
        return this.home(s.tok);
      case 'cs':
        this.segments = [];
        return;
      case 'stop':
        throw new StopSignal();
      case 'let': {
        const v = this.value(s.value, env);
        env.frame.locals.set(s.name, v);
        return;
      }
      case 'repeat': {
        const n = this.value(s.count, env);
        if (!Number.isInteger(n) || n < 0 || n > MAX_REPEAT) {
          throw fail(s.count.tok, `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${MAX_REPEAT}.`);
        }
        this.enterFrame(s.tok);
        try {
          for (let k = 1; k <= n; k++) {
            yield* this.block(s.body, { frame: env.frame, rep: k });
            this.tick(s.tok);
          }
        } finally {
          this.frames--;
        }
        return;
      }
      case 'if': {
        if (this.condition(s.cond, env)) {
          yield* this.block(s.body, env);
          this.tick(s.tok);
        }
        return;
      }
      case 'ifelse': {
        const body = this.condition(s.cond, env) ? s.body : s.elseBody;
        yield* this.block(body, env);
        this.tick(s.tok);
        return;
      }
      case 'call': {
        const proc = this.prog.procs.get(s.name)!;
        const values = s.args.map((a) => this.value(a, env));
        const locals = new Map<string, number>();
        proc.params.forEach((p, k) => locals.set(p.key, values[k]));
        this.enterFrame(s.tok);
        try {
          yield* this.block(proc.body, { frame: { locals, top: false }, rep: undefined });
        } catch (e) {
          if (!(e instanceof StopSignal)) throw e;
        } finally {
          this.frames--;
        }
        this.tick(s.tok);
        return;
      }
    }
  }

  private condition(c: { l: Expr; op: string; r: Expr; tok: Token }, env: Env): boolean {
    const sc = { get: (n: string) => this.lookup(n, env), rep: env.rep };
    return compare(c.op, evaluate(c.l, sc, c.tok), evaluate(c.r, sc, c.tok));
  }

  private segment(from: Vec3, to: Vec3, tok: Token) {
    if (this.segments.length >= MAX_SEGMENTS) {
      throw fail(tok, `Przekroczono limit ${MAX_SEGMENTS} odcinków.`);
    }
    const t = this.turtle;
    this.segments.push({ from, to, color: t.color, width: t.width });
  }

  private moveBy(d: number, s: Stmt) {
    const t = this.turtle;
    const from = t.pos;
    const to = cleanVec(add(from, scale(t.h, d)));
    if (to.some((v) => Math.abs(v) > MAX_COORD)) {
      throw fail(s.tok, `Żółw wyszedł poza zakres współrzędnych ±${MAX_COORD}.`);
    }
    if (t.pen && dist(from, to) > EPS) this.segment(from, to, s.tok);
    t.pos = to;
  }

  private home(tok: Token) {
    const t = this.turtle;
    if (t.pen && dist(t.pos, [0, 0, 0]) > EPS) this.segment(t.pos, [0, 0, 0], tok);
    t.pos = [0, 0, 0];
    t.h = [0, 1, 0];
    t.r = [1, 0, 0];
    t.u = [0, 0, 1];
  }

  /** Rotates the turtle frame; `a` is in degrees. */
  private rotate(a: number, s: Stmt, kind: 'turnRight' | 'pitch' | 'roll') {
    const t = this.turtle;
    const rad = (a * Math.PI) / 180;
    const c = Math.cos(rad);
    const sn = Math.sin(rad);
    if (kind === 'turnRight') {
      // Right turn about the up vector: heading moves towards the right vector.
      const h = add(scale(t.h, c), scale(t.r, sn));
      t.r = add(scale(t.r, c), scale(t.h, -sn));
      t.h = h;
    } else if (kind === 'pitch') {
      // Nose up: heading moves towards the up vector.
      const h = add(scale(t.h, c), scale(t.u, sn));
      t.u = add(scale(t.u, c), scale(t.h, -sn));
      t.h = h;
    } else {
      // Roll right: up vector moves towards the right vector.
      const u = add(scale(t.u, c), scale(t.r, sn));
      t.r = add(scale(t.r, c), scale(t.u, -sn));
      t.u = u;
    }
    this.orthonormalise();
  }

  private orthonormalise() {
    const t = this.turtle;
    t.h = norm(t.h);
    t.r = norm(add(t.r, scale(t.h, -dot(t.r, t.h))));
    t.u = cross(t.r, t.h);
  }
}

/** Steps through a program one statement at a time. */
export class Execution {
  readonly machine: Machine;
  private readonly gen: Generator<Token, void, void>;
  /** Position of the statement that runs next, or null when finished. */
  current: Pos | null = null;
  done = false;
  error: RunError | null = null;

  constructor(prog: Program) {
    this.machine = new Machine(prog);
    this.gen = this.machine.execute();
    this.advance(() => this.gen.next());
  }

  /** Runs the pending statement and moves to the next one. */
  step(): void {
    if (this.done) return;
    this.advance(() => this.gen.next());
  }

  /** Runs the rest of the program without stopping. */
  runToEnd(): void {
    while (!this.done) this.step();
  }

  private advance(resume: () => IteratorResult<Token, void>) {
    try {
      const r = resume();
      if (r.done) {
        this.done = true;
        this.current = null;
      } else {
        this.current = r.value;
      }
    } catch (e) {
      this.done = true;
      if (e instanceof LogoError) {
        this.error = { message: e.message, line: e.line, column: e.column };
        this.current = { line: e.line, col: e.column };
      } else {
        throw e;
      }
    }
  }
}
