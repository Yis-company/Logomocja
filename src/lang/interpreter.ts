import { LogoError, fmtInt, type LogoErrorInfo } from "./errors";
import type { Token } from "./lexer";
import { DEFAULT_COLOR, DEFAULT_WIDTH, LIMITS } from "./names";
import { checkRepeat, checkWidth, parse, type Arg, type Mode, type Program, type Stmt } from "./parser";

export type Vec3 = [number, number, number];

export interface Pose {
  pos: Vec3;
  heading: Vec3;
  right: Vec3;
  up: Vec3;
  penDown: boolean;
  color: string;
  width: number;
}

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export type StepKind = "move" | "turn" | "pitch" | "pen" | "style";

/** One executed primitive command, used by the UI for stepping and animation. */
export interface StepEvent {
  kind: StepKind;
  tok: Token;
  before: Pose;
  after: Pose;
  segment: Segment | null;
  /** Signed distance (move) or angle (turn/pitch). */
  amount: number;
}

export function initialPose(): Pose {
  return {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    penDown: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
}

export function clonePose(p: Pose): Pose {
  return { ...p, pos: [...p.pos], heading: [...p.heading], right: [...p.right], up: [...p.up] };
}

/** sin/cos of an angle in degrees, exact for multiples of 90°. */
function sinCos(deg: number): [number, number] {
  let r = deg % 360;
  if (r < 0) r += 360;
  if (r === 0) return [0, 1];
  if (r === 90) return [1, 0];
  if (r === 180) return [0, -1];
  if (r === 270) return [-1, 0];
  const rad = (r * Math.PI) / 180;
  return [Math.sin(rad), Math.cos(rad)];
}

function z(v: number): number {
  return v === 0 ? 0 : v; // drop negative zero
}

/** Rotate `a` towards `b` by `deg` (a, b orthonormal): returns [a', b']. */
function rotatePair(a: Vec3, b: Vec3, deg: number): [Vec3, Vec3] {
  const [s, c] = sinCos(deg);
  return [
    [z(a[0] * c + b[0] * s), z(a[1] * c + b[1] * s), z(a[2] * c + b[2] * s)],
    [z(b[0] * c - a[0] * s), z(b[1] * c - a[1] * s), z(b[2] * c - a[2] * s)],
  ];
}

/** Round away floating-point noise for reporting (e.g. 79.99999999999999 → 80). */
export function tidy(v: number): number {
  return z(Math.round(v * 1e9) / 1e9);
}

function tidyVec(v: Vec3): Vec3 {
  return [tidy(v[0]), tidy(v[1]), tidy(v[2])];
}

/** Pose part-way (t in 0..1) through a step, for smooth animation. */
export function interpolatePose(ev: StepEvent, t: number): Pose {
  if (t >= 1) return ev.after;
  const b = ev.before;
  const p = clonePose(t <= 0 ? b : ev.after);
  if (t <= 0) return p;
  if (ev.kind === "move") {
    const d = ev.amount * t;
    p.pos = [b.pos[0] + b.heading[0] * d, b.pos[1] + b.heading[1] * d, b.pos[2] + b.heading[2] * d];
  } else if (ev.kind === "turn") {
    [p.heading, p.right] = rotatePair(b.heading, b.right, ev.amount * t);
  } else if (ev.kind === "pitch") {
    [p.heading, p.up] = rotatePair(b.heading, b.up, ev.amount * t);
  }
  return p;
}

class Machine {
  pose = initialPose();
  segments: Segment[] = [];
  ops = 0;
  depth = 0;

  constructor(readonly program: Program) {}

  private tick(tok: Token): void {
    if (++this.ops > LIMITS.ops) {
      throw new LogoError(
        `Przekroczono limit ${fmtInt(LIMITS.ops)} operacji. Zmniejsz liczbę powtórzeń lub wywołań procedur.`,
        tok,
        "run",
      );
    }
  }

  private value(arg: Arg, env: number[]): number {
    return arg.kind === "num" ? arg.value : env[arg.index]!;
  }

  private enter(tok: Token): void {
    if (++this.depth > LIMITS.depth) {
      throw new LogoError(
        `Za głębokie zagnieżdżenie: najwyżej ${LIMITS.depth} poziomy powtórz i wywołań procedur naraz.`,
        tok,
        "run",
      );
    }
  }

  *run(stmts: Stmt[], env: number[]): Generator<StepEvent, void, void> {
    for (const s of stmts) {
      this.tick(s.tok);
      if (s.kind === "repeat") {
        const n = this.value(s.count, env);
        checkRepeat(n, s.count.tok, "run");
        this.enter(s.tok);
        for (let i = 0; i < n; i++) yield* this.run(s.body, env);
        this.depth--;
      } else if (s.kind === "call") {
        const args = s.args.map((a) => this.value(a, env));
        this.enter(s.tok);
        yield* this.run(s.proc.body, args);
        this.depth--;
      } else {
        yield this.prim(s, env);
      }
    }
  }

  private prim(s: Extract<Stmt, { kind: "prim" }>, env: number[]): StepEvent {
    const before = clonePose(this.pose);
    const p = this.pose;
    let kind: StepKind = "turn";
    let segment: Segment | null = null;
    let amount = 0;
    switch (s.info.op) {
      case "fd":
      case "bk": {
        kind = "move";
        const d = this.value(s.arg!, env) * (s.info.op === "fd" ? 1 : -1);
        amount = d;
        const to: Vec3 = [p.pos[0] + p.heading[0] * d, p.pos[1] + p.heading[1] * d, p.pos[2] + p.heading[2] * d];
        if (to.some((c) => !(Math.abs(c) <= LIMITS.coord + 1e-9))) {
          throw new LogoError(
            `Żółw wyszedłby poza obszar rysowania: każda współrzędna musi mieścić się w zakresie ±${fmtInt(LIMITS.coord)}.`,
            s.tok,
            "run",
          );
        }
        if (p.penDown && d !== 0) {
          if (this.segments.length >= LIMITS.segments) {
            throw new LogoError(`Przekroczono limit ${fmtInt(LIMITS.segments)} narysowanych odcinków.`, s.tok, "run");
          }
          segment = { from: tidyVec(p.pos), to: tidyVec(to), color: p.color, width: p.width };
          this.segments.push(segment);
        }
        p.pos = [z(to[0]), z(to[1]), z(to[2])];
        break;
      }
      case "rt":
      case "lt": {
        const a = this.value(s.arg!, env) * (s.info.op === "rt" ? 1 : -1);
        amount = a;
        [p.heading, p.right] = rotatePair(p.heading, p.right, a);
        break;
      }
      case "up":
      case "down": {
        kind = "pitch";
        const a = this.value(s.arg!, env) * (s.info.op === "up" ? 1 : -1);
        amount = a;
        [p.heading, p.up] = rotatePair(p.heading, p.up, a);
        break;
      }
      case "pu":
      case "pd":
        kind = "pen";
        p.penDown = s.info.op === "pd";
        break;
      case "color":
        kind = "style";
        p.color = s.color!;
        break;
      case "width": {
        kind = "style";
        const w = this.value(s.arg!, env);
        checkWidth(w, s.arg!.tok, "run");
        p.width = w;
        break;
      }
    }
    return { kind, tok: s.tok, before, after: clonePose(p), segment, amount };
  }
}

/** Live execution of a parsed program, one primitive command at a time. */
export class Execution {
  private readonly machine: Machine;
  private readonly gen: Generator<StepEvent, void, void>;
  done = false;
  error: LogoError | null = null;

  constructor(program: Program) {
    this.machine = new Machine(program);
    this.gen = this.machine.run(program.main, []);
  }

  get segments(): Segment[] {
    return this.machine.segments;
  }

  get pose(): Pose {
    return this.machine.pose;
  }

  /** Execute up to the next primitive command. Returns null when finished or failed. */
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
        this.error = e;
        return null;
      }
      throw e;
    }
  }

  runToEnd(): void {
    while (this.step());
  }
}

export interface RunResult {
  segments: Segment[];
  error: LogoErrorInfo | null;
}

/** Parse and run a whole program without any UI. */
export function runProgram(source: string, mode: Mode): RunResult {
  if (typeof source !== "string") {
    return { segments: [], error: { message: "Program musi być tekstem.", line: 1, column: 1 } };
  }
  let program: Program;
  try {
    program = parse(source, mode);
  } catch (e) {
    if (e instanceof LogoError) return { segments: [], error: e.toInfo() };
    throw e;
  }
  const exec = new Execution(program);
  exec.runToEnd();
  return {
    segments: exec.segments.map((s) => ({ from: [...s.from], to: [...s.to], color: s.color, width: s.width })),
    error: exec.error ? exec.error.toInfo() : null,
  };
}
