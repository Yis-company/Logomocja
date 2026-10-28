import type { Condition, Expr, Program, Stmt } from './ast';
import { errorAt, type Token } from './lexer';
import { add, initialFrame, ORIGIN, pitch, roll, scale, yaw, type Frame, type Vec3 } from './geometry';
import { formatCount, LIMITS } from './spec';

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface Turtle extends Frame {
  position: Vec3;
  pen: boolean;
  color: string;
  width: number;
}

/** Position of the statement that is about to run. */
export interface Step {
  line: number;
  column: number;
}

/** Locals of one procedure call; the top level has none and writes globals. */
interface Scope {
  locals: Map<string, number> | null;
}

const NORMAL = 0;
const STOP = 1;
type Signal = typeof NORMAL | typeof STOP;

const DEFAULT_COLOR = '#16866a';
const DEFAULT_WIDTH = 3;

/**
 * Executes a parsed program one statement at a time. Each `next()` on
 * `execute()` runs the statement that was announced by the previous yield,
 * so a caller can run to the end, step, pause or animate.
 */
export class Machine {
  readonly segments: Segment[] = [];
  readonly turtle: Turtle;
  /** Bumped whenever the segment list changes, so views know when to rebuild. */
  revision = 0;
  private readonly globals = new Map<string, number>();
  private ops = 0;
  private frames = 0;
  /** Current iteration of every active repeat, innermost last. */
  private readonly counters: number[] = [];

  constructor(private readonly program: Program) {
    this.turtle = {
      ...initialFrame(),
      position: [...ORIGIN] as Vec3,
      pen: true,
      color: DEFAULT_COLOR,
      width: DEFAULT_WIDTH,
    };
  }

  *execute(): Generator<Step, void, undefined> {
    yield* this.block(this.program.body, { locals: null });
  }

  private *block(stmts: Stmt[], scope: Scope): Generator<Step, Signal, undefined> {
    for (const stmt of stmts) {
      yield { line: stmt.tok.line, column: stmt.tok.col };
      if ((yield* this.statement(stmt, scope)) === STOP) return STOP;
    }
    return NORMAL;
  }

  private *statement(stmt: Stmt, scope: Scope): Generator<Step, Signal, undefined> {
    switch (stmt.kind) {
      case 'cmd':
        return this.command(stmt, scope);

      case 'let': {
        this.tick(stmt.tok);
        const value = this.evaluate(stmt.value, scope);
        if (scope.locals) scope.locals.set(stmt.name, value);
        else this.globals.set(stmt.name, value);
        return NORMAL;
      }

      case 'if': {
        this.tick(stmt.tok);
        if (!this.holds(stmt.cond, scope)) return NORMAL;
        const signal = yield* this.block(stmt.body, scope);
        this.tick(stmt.tok);
        return signal;
      }

      case 'ifelse': {
        this.tick(stmt.tok);
        const body = this.holds(stmt.cond, scope) ? stmt.then : stmt.otherwise;
        const signal = yield* this.block(body, scope);
        this.tick(stmt.tok);
        return signal;
      }

      case 'repeat':
        return yield* this.repeat(stmt, scope);

      case 'call':
        return yield* this.call(stmt, scope);
    }
  }

  private *repeat(stmt: Extract<Stmt, { kind: 'repeat' }>, scope: Scope): Generator<Step, Signal, undefined> {
    this.tick(stmt.tok);
    const count = this.evaluate(stmt.count, scope);
    if (!Number.isInteger(count) || count < 0 || count > LIMITS.maxRepeat) {
      throw errorAt(stmt.count.tok, `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${formatCount(LIMITS.maxRepeat)}.`);
    }
    if (count === 0) return NORMAL;

    this.enterFrame(stmt.tok);
    this.counters.push(0);
    let signal: Signal = NORMAL;
    for (let i = 1; i <= count; i++) {
      this.counters[this.counters.length - 1] = i;
      signal = yield* this.block(stmt.body, scope);
      this.tick(stmt.tok);
      if (signal === STOP) break;
    }
    this.counters.pop();
    this.frames--;
    return signal;
  }

  private *call(stmt: Extract<Stmt, { kind: 'call' }>, scope: Scope): Generator<Step, Signal, undefined> {
    this.tick(stmt.tok);
    const values = stmt.args.map((arg) => this.evaluate(arg, scope));
    this.enterFrame(stmt.tok);
    const locals = new Map<string, number>();
    stmt.proc.params.forEach((name, i) => locals.set(name, values[i]));
    yield* this.block(stmt.proc.body, { locals });
    this.tick(stmt.tok);
    this.frames--;
    return NORMAL;
  }

  private command(stmt: Extract<Stmt, { kind: 'cmd' }>, scope: Scope): Signal {
    this.tick(stmt.tok);
    const turtle = this.turtle;
    switch (stmt.cmd) {
      case 'fd':
        this.move(this.evaluate(stmt.arg!, scope), stmt);
        return NORMAL;
      case 'bk':
        this.move(-this.evaluate(stmt.arg!, scope), stmt);
        return NORMAL;
      case 'rt':
        this.setFrame(yaw(turtle, this.evaluate(stmt.arg!, scope)));
        return NORMAL;
      case 'lt':
        this.setFrame(yaw(turtle, -this.evaluate(stmt.arg!, scope)));
        return NORMAL;
      case 'pitchup':
        this.setFrame(pitch(turtle, this.evaluate(stmt.arg!, scope)));
        return NORMAL;
      case 'pitchdown':
        this.setFrame(pitch(turtle, -this.evaluate(stmt.arg!, scope)));
        return NORMAL;
      case 'rollright':
        this.setFrame(roll(turtle, this.evaluate(stmt.arg!, scope)));
        return NORMAL;
      case 'rollleft':
        this.setFrame(roll(turtle, -this.evaluate(stmt.arg!, scope)));
        return NORMAL;
      case 'pu':
        turtle.pen = false;
        return NORMAL;
      case 'pd':
        turtle.pen = true;
        return NORMAL;
      case 'color':
        turtle.color = stmt.color!;
        return NORMAL;
      case 'width': {
        const width = this.evaluate(stmt.arg!, scope);
        if (!Number.isInteger(width) || width < LIMITS.minWidth || width > LIMITS.maxWidth) {
          throw errorAt(stmt.arg!.tok, `Grubość musi być liczbą całkowitą od ${LIMITS.minWidth} do ${LIMITS.maxWidth}.`);
        }
        turtle.width = width;
        return NORMAL;
      }
      case 'home':
        this.goHome(stmt);
        return NORMAL;
      case 'cs':
        this.segments.length = 0;
        this.revision++;
        return NORMAL;
      case 'stop':
        return STOP;
      default:
        // Structural words are statements and never reach this method.
        return NORMAL;
    }
  }

  private setFrame(frame: Frame): void {
    this.turtle.heading = frame.heading;
    this.turtle.right = frame.right;
    this.turtle.up = frame.up;
  }

  private move(distance: number, stmt: Extract<Stmt, { kind: 'cmd' }>): void {
    if (distance === 0) return;
    const turtle = this.turtle;
    const target = add(turtle.position, scale(turtle.heading, distance));
    for (const v of target) {
      if (Math.abs(v) > LIMITS.maxCoord) {
        throw errorAt(stmt.arg!.tok, `Współrzędna poza zakresem ±${formatCount(LIMITS.maxCoord)}.`);
      }
    }
    if (turtle.pen) this.draw(turtle.position, target, stmt.tok);
    turtle.position = target;
  }

  private goHome(stmt: Extract<Stmt, { kind: 'cmd' }>): void {
    const turtle = this.turtle;
    const atOrigin = turtle.position.every((v) => v === 0);
    if (turtle.pen && !atOrigin) this.draw(turtle.position, [...ORIGIN] as Vec3, stmt.tok);
    turtle.position = [...ORIGIN] as Vec3;
    this.setFrame(initialFrame());
  }

  private draw(from: Vec3, to: Vec3, at: Token): void {
    if (this.segments.length >= LIMITS.maxSegments) {
      throw errorAt(at, `Przekroczono limit ${formatCount(LIMITS.maxSegments)} odcinków rysunku.`);
    }
    this.segments.push({
      from: [...from] as Vec3,
      to: [...to] as Vec3,
      color: this.turtle.color,
      width: this.turtle.width,
    });
    this.revision++;
  }

  private tick(at: Token): void {
    this.ops++;
    if (this.ops > LIMITS.maxOps) {
      throw errorAt(at, `Przekroczono limit ${formatCount(LIMITS.maxOps)} wykonanych operacji.`);
    }
  }

  private enterFrame(at: Token): void {
    if (this.frames + 1 > LIMITS.maxFrames) {
      throw errorAt(
        at,
        `Przekroczono limit ${LIMITS.maxFrames} jednocześnie działających wywołań procedur i powtórzeń.`,
      );
    }
    this.frames++;
  }

  private holds(cond: Condition, scope: Scope): boolean {
    const l = this.evaluate(cond.left, scope);
    const r = this.evaluate(cond.right, scope);
    switch (cond.op) {
      case '=':
        return l === r;
      case '<>':
        return l !== r;
      case '<':
        return l < r;
      case '>':
        return l > r;
      case '<=':
        return l <= r;
      default:
        return l >= r;
    }
  }

  /** Evaluates an argument. Errors are reported at the argument's first token. */
  private evaluate(expr: Expr, scope: Scope): number {
    return this.compute(expr, scope, expr.tok);
  }

  private compute(expr: Expr, scope: Scope, at: Token): number {
    switch (expr.kind) {
      case 'num':
        return this.finite(expr.value, at);
      case 'var': {
        if (scope.locals?.has(expr.name)) return scope.locals.get(expr.name)!;
        if (this.globals.has(expr.name)) return this.globals.get(expr.name)!;
        throw errorAt(at, `Zmienna „${expr.name}” nie ma jeszcze wartości.`);
      }
      case 'nrpowt':
        return this.counters[this.counters.length - 1];
      case 'neg':
        return -this.compute(expr.operand, scope, at);
      case 'bin': {
        const l = this.compute(expr.left, scope, at);
        const r = this.compute(expr.right, scope, at);
        let result: number;
        switch (expr.op) {
          case '+':
            result = l + r;
            break;
          case '-':
            result = l - r;
            break;
          case '*':
            result = l * r;
            break;
          default:
            if (r === 0) throw errorAt(at, 'Dzielenie przez zero.');
            result = l / r;
        }
        return this.finite(result, at);
      }
    }
  }

  private finite(value: number, at: Token): number {
    if (!Number.isFinite(value)) {
      throw errorAt(at, 'Wynik obliczenia nie jest liczbą skończoną.');
    }
    return value;
  }
}

