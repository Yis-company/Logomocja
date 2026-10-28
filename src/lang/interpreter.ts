import {
  OP_ADD, OP_MUL, OP_NEG, OP_NUM, OP_REP, OP_SUB, OP_VAR,
  type Axis, type Condition, type Expr, type Mode, type Program, type Stmt,
} from './ast';
import { LIMITS, LogoError, thousands, type SourceSpan } from './errors';
import { normDeg, sinCosDeg, type Vec3 } from './geometry';
import { parse, repeatMessage, widthMessage } from './parser';

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface TurtleState {
  pos: Vec3;
  /** Heading, right and up unit vectors. */
  h: Vec3;
  r: Vec3;
  u: Vec3;
  pen: boolean;
  color: string;
  width: number;
}

/** One executed operation, recorded for animated playback and stepping. */
export interface Step {
  at: SourceSpan;
  state: TurtleState;
  /** Length of the segment log after this step. */
  segEnd: number;
  /** Index in the log of the first segment still kept (after `czyść`). */
  clearStart: number;
  /** The rotation this step applied, for smooth animation of turns. */
  turn: { axis: Axis; deg: number } | null;
  /** True when this step drew a new segment (the last one in the log). */
  drew: boolean;
}

export interface Outcome {
  /** Segments kept at the end, in drawing order. */
  segments: Segment[];
  error: LogoError | null;
  /** Recorded steps (only when tracing). */
  steps: Step[];
  /** Every segment drawn, including those later removed by `czyść`. */
  log: Segment[];
  turtle: TurtleState;
  operations: number;
}

export const DEFAULT_COLOR = '#16866a';
export const DEFAULT_WIDTH = 3;

export function initialTurtle(): TurtleState {
  return {
    pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1],
    pen: true, color: DEFAULT_COLOR, width: DEFAULT_WIDTH,
  };
}

interface Frame {
  top: boolean;
  locals: Map<string, number>;
  reps: number[];
}

const STOP = 1;

function cmp(a: number, op: string, b: number): boolean {
  switch (op) {
    case '<': return a < b;
    case '>': return a > b;
    case '=': return a === b;
    case '<=': return a <= b;
    case '>=': return a >= b;
    default: return a !== b;
  }
}

/** Executes a parsed program. */
export class Machine {
  private ops = 0;
  private depth = 0;
  readonly log: Segment[] = [];
  private clearStart = 0;
  private readonly globals = new Map<string, number>();
  readonly steps: Step[] = [];

  // Turtle state, kept in plain fields for speed.
  private x = 0; private y = 0; private z = 0;
  private hx = 0; private hy = 1; private hz = 0;
  private rx = 1; private ry = 0; private rz = 0;
  private ux = 0; private uy = 0; private uz = 1;
  /** While the turtle has only turned in the plane, its heading is kept as an exact angle. */
  private flat = true;
  private angle = 0;
  private pen = true;
  private color = DEFAULT_COLOR;
  private width = DEFAULT_WIDTH;

  constructor(private readonly program: Program, private readonly trace: boolean) {}

  run(): Outcome {
    let error: LogoError | null = null;
    try {
      this.block(this.program.body, { top: true, locals: this.globals, reps: [] });
    } catch (e) {
      if (e instanceof LogoError) {
        e.phase = 'run';
        error = e;
      } else if (e instanceof RangeError) {
        // Defensive: should never happen thanks to the frame limit.
        error = new LogoError('Program jest zbyt złożony do wykonania.', { line: 1, col: 1, offset: 0, end: 0 }, 'run');
      } else {
        throw e;
      }
    }
    return {
      segments: this.log.slice(this.clearStart),
      error,
      steps: this.steps,
      log: this.log,
      turtle: this.snapshot(),
      operations: this.ops,
    };
  }

  snapshot(): TurtleState {
    return {
      pos: [this.x, this.y, this.z],
      h: [this.hx, this.hy, this.hz],
      r: [this.rx, this.ry, this.rz],
      u: [this.ux, this.uy, this.uz],
      pen: this.pen,
      color: this.color,
      width: this.width,
    };
  }

  private fail(message: string, at: SourceSpan): never {
    throw new LogoError(message, at, 'run');
  }

  private count(at: SourceSpan): void {
    if (++this.ops > LIMITS.operations) {
      this.fail(`Przekroczono limit ${thousands(LIMITS.operations)} wykonanych operacji. Czy program nie wykonuje się w nieskończoność?`, at);
    }
  }

  private record(at: SourceSpan, turn: Step['turn'] = null, drew = false): void {
    if (!this.trace) return;
    this.steps.push({
      at,
      state: this.snapshot(),
      segEnd: this.log.length,
      clearStart: this.clearStart,
      turn,
      drew,
    });
  }

  private block(stmts: Stmt[], frame: Frame): number | undefined {
    for (let i = 0; i < stmts.length; i++) {
      if (this.exec(stmts[i], frame) === STOP) return STOP;
    }
    return undefined;
  }

  private enter(at: SourceSpan): void {
    if (this.depth >= LIMITS.frames) {
      this.fail(`Za dużo zagnieżdżonych wywołań procedur i powtórzeń naraz (limit to ${LIMITS.frames}). Czy rekurencja ma warunek stopu?`, at);
    }
    this.depth++;
  }

  private exec(s: Stmt, frame: Frame): number | undefined {
    this.count(s.tok);
    switch (s.kind) {
      case 'move': {
        const d = this.value(s.arg, frame) * s.dir;
        const drew = this.moveTo(this.x + this.hx * d, this.y + this.hy * d, this.z + this.hz * d, s.tok);
        this.record(s.tok, null, drew);
        return undefined;
      }
      case 'turn': {
        const deg = this.value(s.arg, frame) * s.sign;
        this.rotate(s.axis, deg);
        this.record(s.tok, { axis: s.axis, deg });
        return undefined;
      }
      case 'pen':
        this.pen = s.down;
        this.record(s.tok);
        return undefined;
      case 'color':
        this.color = s.color;
        this.record(s.tok);
        return undefined;
      case 'width': {
        const v = this.value(s.arg, frame);
        if (!(Number.isInteger(v) && v >= 1 && v <= 12)) this.fail(widthMessage(v), s.arg.first);
        this.width = v;
        this.record(s.tok);
        return undefined;
      }
      case 'let': {
        const v = this.value(s.arg, frame);
        frame.locals.set(s.key, v);
        this.record(s.tok);
        return undefined;
      }
      case 'stop':
        this.record(s.tok);
        return STOP;
      case 'home': {
        const drew = this.moveTo(0, 0, 0, s.tok);
        this.flat = true;
        this.angle = 0;
        this.setFlatHeading();
        this.record(s.tok, null, drew);
        return undefined;
      }
      case 'clear':
        this.clearStart = this.log.length;
        this.record(s.tok);
        return undefined;
      case 'repeat': {
        const n = this.value(s.count, frame);
        if (!(Number.isInteger(n) && n >= 0 && n <= 10000)) this.fail(repeatMessage(n), s.count.first);
        this.record(s.tok);
        this.enter(s.tok);
        const slot = frame.reps.length;
        frame.reps.push(0);
        for (let i = 1; i <= n; i++) {
          frame.reps[slot] = i;
          if (this.block(s.body, frame) === STOP) {
            frame.reps.pop();
            this.depth--;
            return STOP;
          }
          this.count(s.close);
        }
        frame.reps.pop();
        this.depth--;
        return undefined;
      }
      case 'if': {
        const holds = this.condition(s.cond, frame);
        this.record(s.tok);
        const body = holds ? s.then : s.else;
        if (body) {
          if (this.block(body, frame) === STOP) return STOP;
          this.count(holds ? s.thenClose : s.elseClose!);
        }
        return undefined;
      }
      case 'call': {
        const proc = this.program.procs.get(s.key)!;
        const locals = new Map<string, number>();
        for (let i = 0; i < s.args.length; i++) locals.set(proc.params[i], this.value(s.args[i], frame));
        this.record(s.tok);
        this.enter(s.tok);
        this.block(proc.body, { top: false, locals, reps: [] });
        this.depth--;
        this.count(proc.endTok);
        return undefined;
      }
    }
  }

  private condition(c: Condition, frame: Frame): boolean {
    const a = this.value(c.left, frame);
    const b = this.value(c.right, frame);
    return cmp(a, c.op, b);
  }

  /** Evaluates an expression; every run-time problem is reported at its first token. */
  private value(e: Expr, frame: Frame): number {
    const code = e.code;
    if (code.length === 1 && code[0].op === OP_NUM) return code[0].v!;
    const st: number[] = [];
    for (let i = 0; i < code.length; i++) {
      const ins = code[i];
      switch (ins.op) {
        case OP_NUM:
          st.push(ins.v!);
          break;
        case OP_VAR: {
          let v = frame.locals.get(ins.key!);
          if (v === undefined && !frame.top) v = this.globals.get(ins.key!);
          if (v === undefined) this.fail(`Zmienna „${ins.name}” nie ma jeszcze wartości. Nadaj ją wcześniej poleceniem niech.`, e.first);
          st.push(v);
          break;
        }
        case OP_REP:
          st.push(frame.reps[frame.reps.length - 1]);
          break;
        case OP_NEG:
          st[st.length - 1] = -st[st.length - 1];
          break;
        default: {
          const b = st.pop()!;
          const a = st.pop()!;
          let r: number;
          if (ins.op === OP_ADD) r = a + b;
          else if (ins.op === OP_SUB) r = a - b;
          else if (ins.op === OP_MUL) r = a * b;
          else {
            if (b === 0) this.fail('Dzielenie przez zero.', e.first);
            r = a / b;
          }
          if (!Number.isFinite(r)) this.fail('Wynik działania jest zbyt duży (nieskończony).', e.first);
          st.push(r);
        }
      }
    }
    return st[0];
  }

  private moveTo(nx: number, ny: number, nz: number, at: SourceSpan): boolean {
    const lim = LIMITS.coordinate;
    if (Math.abs(nx) > lim || Math.abs(ny) > lim || Math.abs(nz) > lim) {
      this.fail(`Żółw wyszedłby poza obszar rysowania: każda współrzędna musi mieścić się w zakresie od −${thousands(lim)} do ${thousands(lim)}.`, at);
    }
    let drew = false;
    if (this.pen && (nx !== this.x || ny !== this.y || nz !== this.z)) {
      if (this.log.length - this.clearStart >= LIMITS.segments) {
        this.fail(`Przekroczono limit ${thousands(LIMITS.segments)} odcinków na rysunku.`, at);
      }
      this.log.push({
        from: [this.x + 0, this.y + 0, this.z + 0],
        to: [nx + 0, ny + 0, nz + 0],
        color: this.color,
        width: this.width,
      });
      drew = true;
    }
    this.x = nx;
    this.y = ny;
    this.z = nz;
    return drew;
  }

  private setFlatHeading(): void {
    const [s, c] = sinCosDeg(this.angle);
    this.hx = s; this.hy = c; this.hz = 0;
    this.rx = c; this.ry = -s; this.rz = 0;
    this.ux = 0; this.uy = 0; this.uz = 1;
  }

  private rotate(axis: Axis, deg: number): void {
    if (axis === 'yaw' && this.flat) {
      this.angle = normDeg(this.angle + deg);
      this.setFlatHeading();
      return;
    }
    this.flat = false;
    const [s, c] = sinCosDeg(deg);
    if (axis === 'yaw') {
      // Heading turns towards the right vector, around up.
      const hx = this.hx * c + this.rx * s, hy = this.hy * c + this.ry * s, hz = this.hz * c + this.rz * s;
      const rx = this.rx * c - this.hx * s, ry = this.ry * c - this.hy * s, rz = this.rz * c - this.hz * s;
      this.hx = hx; this.hy = hy; this.hz = hz;
      this.rx = rx; this.ry = ry; this.rz = rz;
    } else if (axis === 'pitch') {
      // Heading turns towards the up vector, around right.
      const hx = this.hx * c + this.ux * s, hy = this.hy * c + this.uy * s, hz = this.hz * c + this.uz * s;
      const ux = this.ux * c - this.hx * s, uy = this.uy * c - this.hy * s, uz = this.uz * c - this.hz * s;
      this.hx = hx; this.hy = hy; this.hz = hz;
      this.ux = ux; this.uy = uy; this.uz = uz;
    } else {
      // Up turns towards the right vector, around the heading.
      const ux = this.ux * c + this.rx * s, uy = this.uy * c + this.ry * s, uz = this.uz * c + this.rz * s;
      const rx = this.rx * c - this.ux * s, ry = this.ry * c - this.uy * s, rz = this.rz * c - this.uz * s;
      this.ux = ux; this.uy = uy; this.uz = uz;
      this.rx = rx; this.ry = ry; this.rz = rz;
    }
  }
}

/** Applies one rotation to a turtle orientation (used to animate turns). */
export function rotateState(st: TurtleState, axis: Axis, deg: number): TurtleState {
  const [s, c] = sinCosDeg(deg);
  const { h, r, u } = st;
  const mix = (a: Vec3, b: Vec3, ca: number, sb: number): Vec3 => [a[0] * ca + b[0] * sb, a[1] * ca + b[1] * sb, a[2] * ca + b[2] * sb];
  if (axis === 'yaw') return { ...st, h: mix(h, r, c, s), r: mix(r, h, c, -s) };
  if (axis === 'pitch') return { ...st, h: mix(h, u, c, s), u: mix(u, h, c, -s) };
  return { ...st, u: mix(u, r, c, s), r: mix(r, u, c, -s) };
}

export interface ExecuteOptions {
  trace?: boolean;
}

/** Parses and runs a program. Parse-time errors draw nothing. */
export function execute(source: string, mode: Mode, options: ExecuteOptions = {}): Outcome {
  let program: Program;
  try {
    program = parse(source, mode);
  } catch (e) {
    if (e instanceof LogoError) {
      return { segments: [], error: e, steps: [], log: [], turtle: initialTurtle(), operations: 0 };
    }
    throw e;
  }
  return new Machine(program, options.trace ?? false).run();
}
