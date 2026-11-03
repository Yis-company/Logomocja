import { LogoSyntaxError, fmtInt, type Token } from './lexer';
import {
  parse,
  applyBin,
  EvalProblem,
  widthProblem,
  repeatProblem,
  type Expr,
  type Program,
  type Stmt,
  type CmpOp,
} from './parser';
import { DEFAULT_COLOR, DEFAULT_WIDTH, LIMITS, type Mode, type RunResult, type Segment, type Vec3, type LogoError } from './types';

export class LogoRuntimeError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
  ) {
    super(message);
  }
}

export interface StepEvent {
  stmt: Stmt;
  /** Evaluated values: the argument(s); for conditions [left, right, 1|0]. */
  values: number[];
  segment: Segment | null;
  cleared: boolean;
  ops: number;
}

interface Frame {
  vars: Map<string, number>;
  reps: number[];
  top: boolean;
}

const DEG = Math.PI / 180;

/** Sine and cosine of an angle in degrees, exact at multiples of 30 and 45 degrees. */
export function sinDeg(a: number): number {
  const r = ((a % 360) + 360) % 360;
  switch (r) {
    case 0:
    case 180:
      return 0;
    case 90:
      return 1;
    case 270:
      return -1;
    case 30:
    case 150:
      return 0.5;
    case 210:
    case 330:
      return -0.5;
    case 45:
    case 135:
      return Math.SQRT1_2;
    case 225:
    case 315:
      return -Math.SQRT1_2;
  }
  return Math.sin(r * DEG);
}

export function cosDeg(a: number): number {
  return sinDeg(a + 90);
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function combine(a: Vec3, ca: number, b: Vec3, cb: number): Vec3 {
  return [a[0] * ca + b[0] * cb, a[1] * ca + b[1] * cb, a[2] * ca + b[2] * cb];
}

function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(v[0], v[1], v[2]);
  return l === 0 ? v : [v[0] / l, v[1] / l, v[2] / l];
}

function clean(n: number): number {
  return n === 0 ? 0 : n;
}

export interface TurtleState {
  pos: Vec3;
  heading: Vec3;
  up: Vec3;
  right: Vec3;
  penDown: boolean;
  color: string;
  width: number;
}

/**
 * Executes a parsed program. `run()` is a generator that yields after every executed
 * statement; iterate it to the end for a full run, or pull events one at a time to
 * animate or step. Errors are thrown as LogoRuntimeError and leave `segments` intact.
 */
export class Machine {
  segments: Segment[] = [];
  ops = 0;
  frames = 0;
  pos: Vec3 = [0, 0, 0];
  penDown = true;
  color = DEFAULT_COLOR;
  width = DEFAULT_WIDTH;
  globals = new Map<string, number>();
  // Orientation: while flat, a yaw angle (clockwise from +Y) is exact; after the first
  // pitch or roll the turtle carries a full frame of vectors.
  private flat = true;
  private yaw = 0;
  private H: Vec3 = [0, 1, 0];
  private R: Vec3 = [1, 0, 0];
  private U: Vec3 = [0, 0, 1];

  constructor(public program: Program) {}

  turtle(): TurtleState {
    const heading = this.heading();
    const up: Vec3 = this.flat ? [0, 0, 1] : [...this.U];
    const right: Vec3 = this.flat ? [cosDeg(this.yaw), -sinDeg(this.yaw), 0] : [...this.R];
    return { pos: [...this.pos], heading, up, right, penDown: this.penDown, color: this.color, width: this.width };
  }

  *run(): Generator<StepEvent, void, void> {
    const top: Frame = { vars: this.globals, reps: [], top: true };
    yield* this.block(this.program.main, top);
  }

  private heading(): Vec3 {
    return this.flat ? [sinDeg(this.yaw), cosDeg(this.yaw), 0] : [...this.H];
  }

  private toVectors(): void {
    if (!this.flat) return;
    this.H = [sinDeg(this.yaw), cosDeg(this.yaw), 0];
    this.R = [cosDeg(this.yaw), -sinDeg(this.yaw), 0];
    this.U = [0, 0, 1];
    this.flat = false;
  }

  private orthonormalize(): void {
    this.H = normalize(this.H);
    this.R = normalize(cross(this.H, this.U));
    this.U = normalize(cross(this.R, this.H));
  }

  private turnRight(a: number): void {
    if (this.flat) {
      const y = (this.yaw + a) % 360;
      this.yaw = y < 0 ? y + 360 : y;
      return;
    }
    const c = cosDeg(a);
    const s = sinDeg(a);
    const H = combine(this.H, c, this.R, s);
    const R = combine(this.R, c, this.H, -s);
    this.H = H;
    this.R = R;
    this.orthonormalize();
  }

  private pitchUp(a: number): void {
    this.toVectors();
    const c = cosDeg(a);
    const s = sinDeg(a);
    const H = combine(this.H, c, this.U, s);
    const U = combine(this.U, c, this.H, -s);
    this.H = H;
    this.U = U;
    this.orthonormalize();
  }

  private rollRight(a: number): void {
    this.toVectors();
    const c = cosDeg(a);
    const s = sinDeg(a);
    const U = combine(this.U, c, this.R, s);
    const R = combine(this.R, c, this.U, -s);
    this.U = U;
    this.R = R;
    this.orthonormalize();
  }

  private fail(tok: Token, message: string): never {
    throw new LogoRuntimeError(message, tok.line, tok.col);
  }

  private tick(tok: Token): void {
    if (++this.ops > LIMITS.operations) {
      this.fail(
        tok,
        `Przekroczono limit ${fmtInt(LIMITS.operations)} wykonanych operacji. Program robi za dużo kroków: może pętla albo rekurencja nie ma końca?`,
      );
    }
  }

  private enterFrame(tok: Token): void {
    if (this.frames + 1 > LIMITS.frames) {
      this.fail(
        tok,
        `Przekroczono limit ${LIMITS.frames} zagnieżdżonych wywołań procedur i powtórzeń. Czy rekurencja ma warunek końca, np. „jeśli … [stop]”?`,
      );
    }
    this.frames++;
  }

  private eval(e: Expr, frame: Frame): number {
    const st: number[] = [];
    try {
      for (const op of e.rpn) {
        switch (op.k) {
          case 'num':
            st.push(op.v);
            break;
          case 'var': {
            let v = frame.vars.get(op.name);
            if (v === undefined && !frame.top) v = this.globals.get(op.name);
            if (v === undefined) {
              this.fail(
                e.tok,
                `Zmienna „${op.display}” nie ma jeszcze wartości. Nadaj ją wcześniej poleceniem „niech ${op.display} …”.`,
              );
            }
            st.push(v);
            break;
          }
          case 'rep':
            st.push(frame.reps[frame.reps.length - 1]!);
            break;
          case 'neg':
            st.push(-st.pop()!);
            break;
          case 'bin': {
            const b = st.pop()!;
            const a = st.pop()!;
            st.push(applyBin(op.op, a, b));
            break;
          }
        }
      }
    } catch (ex) {
      if (ex instanceof EvalProblem) this.fail(e.tok, ex.message);
      throw ex;
    }
    const v = st[0]!;
    if (!Number.isFinite(v)) this.fail(e.tok, 'Wynik obliczenia nie jest skończoną liczbą.');
    return v;
  }

  private addSegment(tok: Token, from: Vec3, to: Vec3): Segment {
    if (this.segments.length >= LIMITS.segments) {
      this.fail(
        tok,
        `Przekroczono limit ${fmtInt(LIMITS.segments)} narysowanych odcinków. Użyj „czyść”, żeby zacząć rysunek od nowa, albo narysuj mniej linii.`,
      );
    }
    const seg: Segment = {
      from: [clean(from[0]), clean(from[1]), clean(from[2])],
      to: [clean(to[0]), clean(to[1]), clean(to[2])],
      color: this.color,
      width: this.width,
    };
    this.segments.push(seg);
    return seg;
  }

  private moveTo(tok: Token, to: Vec3): Segment | null {
    const lim = LIMITS.coordinate;
    if (!(Math.abs(to[0]) <= lim && Math.abs(to[1]) <= lim && Math.abs(to[2]) <= lim)) {
      this.fail(
        tok,
        `Żółw wyszedłby poza obszar rysowania. Każda współrzędna musi mieścić się w zakresie od -100 000 do 100 000.`,
      );
    }
    const from = this.pos;
    const moved = to[0] !== from[0] || to[1] !== from[1] || to[2] !== from[2];
    let seg: Segment | null = null;
    if (moved && this.penDown) seg = this.addSegment(tok, from, to);
    this.pos = to;
    return seg;
  }

  private *block(stmts: Stmt[], frame: Frame): Generator<StepEvent, boolean, void> {
    for (const s of stmts) {
      if (yield* this.exec(s, frame)) return true;
    }
    return false;
  }

  private ev(stmt: Stmt, values: number[], segment: Segment | null = null, cleared = false): StepEvent {
    return { stmt, values, segment, cleared, ops: this.ops };
  }

  /** Executes one statement; returns true when `stop` ended the current call or program. */
  private *exec(s: Stmt, frame: Frame): Generator<StepEvent, boolean, void> {
    switch (s.k) {
      case 'move': {
        this.tick(s.tok);
        const d = this.eval(s.arg, frame);
        const h = this.heading();
        const dist = d * s.sign;
        const to: Vec3 = [this.pos[0] + dist * h[0], this.pos[1] + dist * h[1], this.pos[2] + dist * h[2]];
        const seg = dist === 0 ? null : this.moveTo(s.tok, to);
        yield this.ev(s, [d], seg);
        return false;
      }
      case 'turn': {
        this.tick(s.tok);
        const a = this.eval(s.arg, frame);
        this.turnRight(a * s.sign);
        yield this.ev(s, [a]);
        return false;
      }
      case 'pitch': {
        this.tick(s.tok);
        const a = this.eval(s.arg, frame);
        this.pitchUp(a * s.sign);
        yield this.ev(s, [a]);
        return false;
      }
      case 'roll': {
        this.tick(s.tok);
        const a = this.eval(s.arg, frame);
        this.rollRight(a * s.sign);
        yield this.ev(s, [a]);
        return false;
      }
      case 'pen':
        this.tick(s.tok);
        this.penDown = s.down;
        yield this.ev(s, []);
        return false;
      case 'color':
        this.tick(s.tok);
        this.color = s.color;
        yield this.ev(s, []);
        return false;
      case 'width': {
        this.tick(s.tok);
        const w = this.eval(s.arg, frame);
        const p = widthProblem(w);
        if (p) this.fail(s.arg.tok, p);
        this.width = w;
        yield this.ev(s, [w]);
        return false;
      }
      case 'home': {
        this.tick(s.tok);
        const p = this.pos;
        const there = Math.hypot(p[0], p[1], p[2]) <= 1e-9;
        let seg: Segment | null = null;
        if (!there && this.penDown) seg = this.addSegment(s.tok, p, [0, 0, 0]);
        this.pos = [0, 0, 0];
        this.flat = true;
        this.yaw = 0;
        yield this.ev(s, [], seg);
        return false;
      }
      case 'clear':
        this.tick(s.tok);
        this.segments = [];
        yield this.ev(s, [], null, true);
        return false;
      case 'stop':
        this.tick(s.tok);
        yield this.ev(s, []);
        return true;
      case 'let': {
        this.tick(s.tok);
        const v = this.eval(s.arg, frame);
        frame.vars.set(s.name, v);
        yield this.ev(s, [v]);
        return false;
      }
      case 'if': {
        this.tick(s.tok);
        const l = this.eval(s.left, frame);
        const r = this.eval(s.right, frame);
        const ok = compare(s.cmp, l, r);
        yield this.ev(s, [l, r, ok ? 1 : 0]);
        const body = ok ? s.then : s.else;
        if (body) {
          if (yield* this.block(body, frame)) return true;
          this.tick(s.tok);
        }
        return false;
      }
      case 'repeat': {
        this.tick(s.tok);
        const n = this.eval(s.count, frame);
        const p = repeatProblem(n);
        if (p) this.fail(s.count.tok, p);
        this.enterFrame(s.tok);
        frame.reps.push(0);
        try {
          yield this.ev(s, [n]);
          for (let i = 1; i <= n; i++) {
            frame.reps[frame.reps.length - 1] = i;
            if (yield* this.block(s.body, frame)) return true;
            this.tick(s.tok);
          }
        } finally {
          frame.reps.pop();
          this.frames--;
        }
        return false;
      }
      case 'call': {
        this.tick(s.tok);
        const def = this.program.procs.get(s.name)!;
        const args = s.args.map((a) => this.eval(a, frame));
        this.enterFrame(s.tok);
        const vars = new Map<string, number>();
        def.params.forEach((p, i) => vars.set(p, args[i]!));
        const callee: Frame = { vars, reps: [], top: false };
        try {
          yield this.ev(s, args);
          yield* this.block(def.body, callee);
          this.tick(s.tok);
        } finally {
          this.frames--;
        }
        return false;
      }
    }
  }
}

function compare(op: CmpOp, a: number, b: number): boolean {
  switch (op) {
    case '<':
      return a < b;
    case '>':
      return a > b;
    case '=':
      return a === b;
    case '<=':
      return a <= b;
    case '>=':
      return a >= b;
    case '<>':
      return a !== b;
  }
}

export type Compiled = { program: Program; error: null } | { program: null; error: LogoError };

export function compile(source: string, mode: Mode): Compiled {
  try {
    return { program: parse(source, mode), error: null };
  } catch (ex) {
    if (ex instanceof LogoSyntaxError) {
      return { program: null, error: { message: ex.message, line: ex.line, column: ex.column } };
    }
    throw ex;
  }
}

function copySegments(list: Segment[]): Segment[] {
  return list.map((s) => ({ from: [...s.from] as Vec3, to: [...s.to] as Vec3, color: s.color, width: s.width }));
}

/** Runs a whole program without any UI. */
export function runProgram(source: string, mode: Mode): RunResult {
  const c = compile(String(source ?? ''), mode);
  if (!c.program) return { segments: [], error: c.error };
  const m = new Machine(c.program);
  const it = m.run();
  try {
    while (!it.next().done) {
      /* run to the end */
    }
  } catch (ex) {
    if (ex instanceof LogoRuntimeError) {
      return { segments: copySegments(m.segments), error: { message: ex.message, line: ex.line, column: ex.column } };
    }
    throw ex;
  }
  return { segments: copySegments(m.segments), error: null };
}
