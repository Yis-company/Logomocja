import type { Arg, Cond, Mode, Program, Stmt } from './ast';
import { LogoError } from './errors';
import { evaluate, EvalFailure, evalFailureMessage, type Scope } from './evaluate';
import type { Token } from './lexer';
import { checkRepeat, checkWidth } from './parser';

export const MAX_OPS = 10_000;
export const MAX_FRAMES = 32;
export const MAX_SEGMENTS = 10_000;
export const MAX_COORD = 100_000;

export type V3 = [number, number, number];

export interface Segment {
  from: V3;
  to: V3;
  color: string;
  width: number;
}

export interface TurtleState {
  pos: V3;
  heading: V3;
  right: V3;
  up: V3;
  pen: boolean;
  color: string;
  width: number;
}

/** Emitted after each executed command, for stepping, animation and the line highlight. */
export interface StepEvent {
  line: number;
  col: number;
  length: number;
  segment?: Segment;
  cleared?: boolean;
  turtle: TurtleState;
}

export interface RunResult {
  segments: Segment[];
  error: { message: string; line: number; column: number } | null;
}

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): TurtleState {
  return {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
}

const STOP = 1;
const NORMAL = 0;
type Signal = typeof STOP | typeof NORMAL;

interface Frame {
  locals: Map<string, number>;
  reps: number[];
}

/** Exact sine and cosine for multiples of 90°, so squares close exactly. */
function sinCos(deg: number): [number, number] {
  const m = deg % 360;
  if (m % 90 === 0) {
    const k = ((Math.round(m / 90) % 4) + 4) % 4;
    return [[0, 1, 0, -1][k], [1, 0, -1, 0][k]];
  }
  const r = (m * Math.PI) / 180;
  return [Math.sin(r), Math.cos(r)];
}

/** Rotates a towards b by deg degrees in the plane they span; returns [a', b']. */
function rotatePair(a: V3, b: V3, deg: number): [V3, V3] {
  const [s, c] = sinCos(deg);
  return [
    [a[0] * c + b[0] * s, a[1] * c + b[1] * s, a[2] * c + b[2] * s],
    [b[0] * c - a[0] * s, b[1] * c - a[1] * s, b[2] * c - a[2] * s],
  ];
}

const clean = (v: number) => v + 0; // turns -0 into 0

function snapshot(t: TurtleState): TurtleState {
  return {
    pos: [...t.pos] as V3,
    heading: [...t.heading] as V3,
    right: [...t.right] as V3,
    up: [...t.up] as V3,
    pen: t.pen,
    color: t.color,
    width: t.width,
  };
}

/**
 * Runs a parsed program. Use `steps()` to drive it command by command
 * (each yield follows one executed command), or `runToEnd()` for a result.
 */
export class Execution {
  readonly turtle = initialTurtle();
  segments: Segment[] = [];
  ops = 0;
  private frames = 0;
  private readonly globals = new Map<string, number>();
  private readonly top: Frame;
  done = false;
  error: LogoError | null = null;

  constructor(readonly program: Program) {
    this.top = { locals: this.globals, reps: [] };
  }

  *steps(): Generator<StepEvent, void, void> {
    try {
      yield* this.block(this.program.body, this.top);
    } catch (err) {
      if (err instanceof LogoError) this.error = err;
      else throw err;
    } finally {
      this.done = true;
    }
  }

  runToEnd(): RunResult {
    const gen = this.steps();
    while (!gen.next().done) {
      /* drain */
    }
    return this.result();
  }

  result(): RunResult {
    return {
      segments: this.segments.map((s) => ({ from: [...s.from] as V3, to: [...s.to] as V3, color: s.color, width: s.width })),
      error: this.error ? this.error.toJSON() : null,
    };
  }

  // ----------------------------------------------------------- bookkeeping

  private tick(tok: Token) {
    this.ops++;
    if (this.ops > MAX_OPS) {
      throw new LogoError('Przekroczono limit 10 000 wykonanych operacji. Czy program nie powtarza się bez końca?', tok, 'runtime');
    }
  }

  private enter(tok: Token) {
    this.frames++;
    if (this.frames > MAX_FRAMES) {
      throw new LogoError(
        `Przekroczono limit ${MAX_FRAMES} zagnieżdżonych wywołań procedur i powtórzeń. Czy rekurencja ma warunek zakończenia (stop)?`,
        tok,
        'runtime',
      );
    }
  }

  private event(tok: Token, extra: Partial<StepEvent> = {}): StepEvent {
    return { line: tok.line, col: tok.col, length: tok.length, turtle: snapshot(this.turtle), ...extra };
  }

  private scope(frame: Frame): Scope {
    const globals = this.globals;
    return {
      lookup: (name) => frame.locals.get(name) ?? globals.get(name),
      repcount: () => frame.reps[frame.reps.length - 1],
    };
  }

  private value(arg: Arg, frame: Frame): number {
    try {
      return evaluate(arg.e, this.scope(frame));
    } catch (err) {
      if (err instanceof EvalFailure) throw new LogoError(evalFailureMessage(err), arg.first, 'runtime');
      throw err;
    }
  }

  private test(cond: Cond, frame: Frame): boolean {
    const a = this.value(cond.a, frame);
    const b = this.value(cond.b, frame);
    switch (cond.op) {
      case '<': return a < b;
      case '>': return a > b;
      case '=': return a === b;
      case '<=': return a <= b;
      case '>=': return a >= b;
      case '<>': return a !== b;
    }
  }

  // ----------------------------------------------------------- execution

  private *block(stmts: Stmt[], frame: Frame): Generator<StepEvent, Signal, void> {
    for (const s of stmts) {
      if ((yield* this.stmt(s, frame)) === STOP) return STOP;
    }
    return NORMAL;
  }

  private *stmt(s: Stmt, frame: Frame): Generator<StepEvent, Signal, void> {
    const t = this.turtle;
    this.tick(s.tok);
    switch (s.k) {
      case 'move': {
        const d = s.sign * this.value(s.arg, frame);
        const from = t.pos;
        const to: V3 = [
          clean(from[0] + t.heading[0] * d),
          clean(from[1] + t.heading[1] * d),
          clean(from[2] + t.heading[2] * d),
        ];
        yield this.moveTo(to, s.tok);
        return NORMAL;
      }
      case 'turn': {
        const a = s.sign * this.value(s.arg, frame);
        if (s.axis === 'yaw') [t.heading, t.right] = rotatePair(t.heading, t.right, a);
        else if (s.axis === 'pitch') [t.heading, t.up] = rotatePair(t.heading, t.up, a);
        else [t.up, t.right] = rotatePair(t.up, t.right, a);
        yield this.event(s.tok);
        return NORMAL;
      }
      case 'pen':
        t.pen = s.down;
        yield this.event(s.tok);
        return NORMAL;
      case 'color':
        t.color = s.color;
        yield this.event(s.tok);
        return NORMAL;
      case 'width': {
        const w = this.value(s.arg, frame);
        checkWidth(w, s.arg, 'runtime');
        t.width = w;
        yield this.event(s.tok);
        return NORMAL;
      }
      case 'let': {
        frame.locals.set(s.name, this.value(s.arg, frame));
        yield this.event(s.tok);
        return NORMAL;
      }
      case 'stop':
        yield this.event(s.tok);
        return STOP;
      case 'home': {
        const ev = this.moveTo([0, 0, 0], s.tok);
        t.heading = [0, 1, 0];
        t.right = [1, 0, 0];
        t.up = [0, 0, 1];
        ev.turtle = snapshot(t);
        yield ev;
        return NORMAL;
      }
      case 'clear':
        this.segments = [];
        yield this.event(s.tok, { cleared: true });
        return NORMAL;
      case 'repeat': {
        const n = this.value(s.count, frame);
        checkRepeat(n, s.count, 'runtime');
        this.enter(s.tok);
        yield this.event(s.tok);
        frame.reps.push(0);
        try {
          for (let k = 1; k <= n; k++) {
            frame.reps[frame.reps.length - 1] = k;
            if ((yield* this.block(s.body, frame)) === STOP) return STOP;
            this.tick(s.tok);
          }
        } finally {
          frame.reps.pop();
          this.frames--;
        }
        return NORMAL;
      }
      case 'if':
      case 'ifelse': {
        const ok = this.test(s.cond, frame);
        yield this.event(s.tok);
        const body = ok ? s.body : s.k === 'ifelse' ? s.elseBody : null;
        if (!body) return NORMAL;
        if ((yield* this.block(body, frame)) === STOP) return STOP;
        this.tick(s.tok);
        return NORMAL;
      }
      case 'call': {
        const proc = this.program.procs.get(s.name)!;
        const values = s.args.map((a) => this.value(a, frame));
        this.enter(s.tok);
        const callee: Frame = { locals: new Map(), reps: [] };
        proc.params.forEach((p, k) => callee.locals.set(p, values[k]));
        try {
          yield this.event(s.tok);
          yield* this.block(proc.body, callee);
          this.tick(s.tok);
        } finally {
          this.frames--;
        }
        return NORMAL;
      }
    }
  }

  private moveTo(to: V3, tok: Token): StepEvent {
    const t = this.turtle;
    if (to.some((v) => Math.abs(v) > MAX_COORD)) {
      throw new LogoError('Żółw wyszedłby poza obszar rysowania: każda współrzędna musi mieścić się w zakresie ±100 000.', tok, 'runtime');
    }
    const from = t.pos;
    const moved = to[0] !== from[0] || to[1] !== from[1] || to[2] !== from[2];
    let segment: Segment | undefined;
    if (moved && t.pen) {
      if (this.segments.length >= MAX_SEGMENTS) {
        throw new LogoError('Przekroczono limit 10 000 narysowanych odcinków.', tok, 'runtime');
      }
      segment = { from: [...from] as V3, to: [...to] as V3, color: t.color, width: t.width };
      this.segments.push(segment);
    }
    t.pos = to;
    return this.event(tok, segment ? { segment } : {});
  }
}

export type { Mode };
