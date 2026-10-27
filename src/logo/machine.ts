import { LogoError } from './errors';
import type { Token } from './lexer';
import type { Arg, CommandStatement, Program, RepeatStatement, Statement, CallStatement } from './parser';
import {
  DEFAULT_COLOR,
  DEFAULT_WIDTH,
  MAX_COORDINATE,
  MAX_DEPTH,
  MAX_OPERATIONS,
  MAX_REPEAT,
  MAX_SEGMENTS,
  MAX_WIDTH,
  MIN_WIDTH,
} from './limits';
import type { Segment, Vec3 } from './types';

type Env = ReadonlyMap<string, number>;

export interface Turtle {
  position: Vec3;
  /** Direction of travel. */
  heading: Vec3;
  /** Points to the turtle's right; always heading × up. */
  right: Vec3;
  up: Vec3;
  pen: boolean;
  color: string;
  width: number;
}

type Vector = readonly [number, number, number];

/**
 * Executes a validated program. Every primitive command is a yield point, so a caller can
 * step through a program one command at a time. Both modes share this code path: 2D programs
 * never change the up vector, so their coordinates are the same in 2D and 3D.
 */
export class Machine {
  readonly segments: Segment[] = [];
  readonly turtle: Turtle = {
    position: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: DEFAULT_COLOR,
    width: DEFAULT_WIDTH,
  };
  operations = 0;

  constructor(private readonly program: Program) {}

  *execute(): Generator<Token, void, void> {
    yield* this.runBlock(this.program.main, new Map(), 0);
  }

  private *runBlock(statements: readonly Statement[], env: Env, depth: number): Generator<Token, void, void> {
    for (const statement of statements) {
      yield* this.runStatement(statement, env, depth);
    }
  }

  private *runStatement(statement: Statement, env: Env, depth: number): Generator<Token, void, void> {
    this.countOperation(statement.token);

    if (statement.kind === 'command') {
      this.runCommand(statement, env);
      yield statement.token;
      return;
    }

    if (statement.kind === 'repeat') {
      yield* this.runRepeat(statement, env, depth);
      return;
    }

    yield* this.runCall(statement, env, depth);
  }

  private *runRepeat(statement: RepeatStatement, env: Env, depth: number): Generator<Token, void, void> {
    const count = this.valueOf(statement.count, env);
    if (!Number.isInteger(count) || count < 0 || count > MAX_REPEAT) {
      throw new LogoError(`Liczba powtórzeń musi być liczbą całkowitą z zakresu 0–${MAX_REPEAT}`, statement.token);
    }
    this.enter(statement.token, depth);
    for (let i = 0; i < count; i++) {
      this.countOperation(statement.token);
      yield* this.runBlock(statement.body, env, depth + 1);
    }
  }

  private *runCall(statement: CallStatement, env: Env, depth: number): Generator<Token, void, void> {
    const callEnv = new Map<string, number>();
    statement.procedure.params.forEach((name, i) => {
      callEnv.set(name, this.valueOf(statement.args[i], env));
    });
    this.enter(statement.token, depth);
    yield* this.runBlock(statement.procedure.body, callEnv, depth + 1);
  }

  private runCommand(statement: CommandStatement, env: Env): void {
    const turtle = this.turtle;
    const token = statement.token;
    const amount = (): number => this.valueOf(statement.arg as Arg, env);

    switch (statement.op) {
      case 'forward':
        this.move(amount(), token);
        break;
      case 'back':
        this.move(-amount(), token);
        break;
      case 'right':
        this.turn(amount());
        break;
      case 'left':
        this.turn(-amount());
        break;
      case 'pitchUp':
        this.pitch(amount());
        break;
      case 'pitchDown':
        this.pitch(-amount());
        break;
      case 'penUp':
        turtle.pen = false;
        break;
      case 'penDown':
        turtle.pen = true;
        break;
      case 'setColor':
        turtle.color = statement.color as string;
        break;
      case 'setWidth': {
        const width = amount();
        if (!Number.isInteger(width) || width < MIN_WIDTH || width > MAX_WIDTH) {
          throw new LogoError(`Grubość musi być liczbą całkowitą z zakresu ${MIN_WIDTH}–${MAX_WIDTH}`, token);
        }
        turtle.width = width;
        break;
      }
    }
  }

  /** Rotates the heading to the right around the up vector: H' = H·cos + R·sin, R' = R·cos − H·sin. */
  private turn(degrees: number): void {
    const t = this.turtle;
    const c = cosDeg(degrees);
    const s = sinDeg(degrees);
    const heading = add(scale(t.heading, c), scale(t.right, s));
    const right = sub(scale(t.right, c), scale(t.heading, s));
    t.heading = clean(heading);
    t.right = clean(right);
  }

  /** Rotates the heading towards the up vector around the right vector: H' = H·cos + U·sin, U' = U·cos − H·sin. */
  private pitch(degrees: number): void {
    const t = this.turtle;
    const c = cosDeg(degrees);
    const s = sinDeg(degrees);
    const heading = add(scale(t.heading, c), scale(t.up, s));
    const up = sub(scale(t.up, c), scale(t.heading, s));
    t.heading = clean(heading);
    t.up = clean(up);
  }

  private move(distance: number, token: Token): void {
    if (distance === 0) return;
    const t = this.turtle;
    const target = clean(add(t.position, scale(t.heading, distance)));
    if (target.some((c) => Math.abs(c) > MAX_COORDINATE)) {
      throw new LogoError(`Współrzędne wykraczają poza zakres ±${MAX_COORDINATE.toLocaleString('pl-PL').replace(/,/g, ' ')}`, token);
    }
    if (t.pen) {
      if (this.segments.length >= MAX_SEGMENTS) {
        throw new LogoError(`Przekroczono limit ${MAX_SEGMENTS} narysowanych odcinków`, token);
      }
      this.segments.push({
        from: t.position,
        to: target,
        color: t.color,
        width: t.width,
      });
    }
    t.position = target;
  }

  private valueOf(arg: Arg, env: Env): number {
    return arg.kind === 'number' ? arg.value : (env.get(arg.name) as number);
  }

  private countOperation(token: Token): void {
    this.operations++;
    if (this.operations > MAX_OPERATIONS) {
      throw new LogoError(`Przekroczono limit ${MAX_OPERATIONS} operacji`, token);
    }
  }

  private enter(token: Token, depth: number): void {
    if (depth + 1 > MAX_DEPTH) {
      throw new LogoError(`Przekroczono maksymalną głębokość zagnieżdżenia (${MAX_DEPTH})`, token);
    }
  }
}

function add(a: Vector, b: Vector): Vector {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function sub(a: Vector, b: Vector): Vector {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(a: Vector, k: number): Vector {
  return [a[0] * k, a[1] * k, a[2] * k];
}

/** Turns -0 into 0 and drops floating-point dust, so axis-aligned moves stay exact. */
function snap(value: number): number {
  return Math.abs(value) < 1e-12 ? 0 : value;
}

function clean(v: Vector): Vec3 {
  return [snap(v[0]), snap(v[1]), snap(v[2])];
}

function cosDeg(degrees: number): number {
  return snap(Math.cos((degrees * Math.PI) / 180));
}

function sinDeg(degrees: number): number {
  return snap(Math.sin((degrees * Math.PI) / 180));
}
