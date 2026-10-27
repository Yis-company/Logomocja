import type { NumArg, Program, Segment, Stmt } from './ast';
import { fmtInt, LIMITS, LogoError } from './errors';
import { repeatMessage, validRepeatCount, validWidth, widthMessage } from './parser';
import { advance, initialTurtle, pitch, yaw, type TurtleState } from './turtle';

interface Frame {
  stmts: Stmt[];
  index: number;
  env: number[];
  /** Remaining repetitions after the current one (repeat frames only). */
  remaining: number;
  isRepeat: boolean;
}

export type StepEvent =
  | { type: 'draw'; stmt: Stmt; segment: Segment }
  | { type: 'move'; stmt: Stmt }
  | { type: 'turn'; stmt: Stmt }
  | { type: 'pen'; stmt: Stmt }
  | { type: 'style'; stmt: Stmt }
  | { type: 'done' }
  | { type: 'error'; error: LogoError };

/**
 * Executes a parsed program one primitive command at a time, so the UI can
 * animate, step, pause and resume. Enforces all run-time limits.
 */
export class Runner {
  readonly segments: Segment[] = [];
  readonly turtle: TurtleState = initialTurtle();
  operations = 0;
  error: LogoError | null = null;
  finished = false;
  private readonly stack: Frame[];

  constructor(private readonly program: Program) {
    this.stack = [{ stmts: program.main, index: 0, env: [], remaining: 0, isRepeat: false }];
  }

  /** Executes until the next primitive command has run, or the program ends. */
  step(): StepEvent {
    if (this.finished) {
      return this.error ? { type: 'error', error: this.error } : { type: 'done' };
    }
    try {
      return this.stepInner();
    } catch (e) {
      if (e instanceof LogoError) {
        this.error = e;
        this.finished = true;
        return { type: 'error', error: e };
      }
      throw e;
    }
  }

  /** Runs to completion (or to the first run-time error). */
  runAll(): void {
    while (!this.finished) this.step();
  }

  private stepInner(): StepEvent {
    for (;;) {
      const frame = this.stack[this.stack.length - 1];
      if (!frame) {
        this.finished = true;
        return { type: 'done' };
      }
      if (frame.index >= frame.stmts.length) {
        if (frame.isRepeat && frame.remaining > 0) {
          frame.remaining--;
          frame.index = 0;
          continue;
        }
        this.stack.pop();
        if (this.stack.length === 0) {
          this.finished = true;
          return { type: 'done' };
        }
        continue;
      }
      const stmt = frame.stmts[frame.index++]!;
      this.countOperation(stmt);
      switch (stmt.kind) {
        case 'move': {
          const d = this.evalArg(stmt.arg, frame.env) * stmt.sign;
          return this.move(stmt, d);
        }
        case 'yaw':
          yaw(this.turtle, this.evalArg(stmt.arg, frame.env) * stmt.sign);
          return { type: 'turn', stmt };
        case 'pitch':
          pitch(this.turtle, this.evalArg(stmt.arg, frame.env) * stmt.sign);
          return { type: 'turn', stmt };
        case 'pen':
          this.turtle.penDown = stmt.down;
          return { type: 'pen', stmt };
        case 'color':
          this.turtle.color = stmt.value;
          return { type: 'style', stmt };
        case 'width': {
          const w = this.evalArg(stmt.arg, frame.env);
          if (!validWidth(w)) {
            throw new LogoError(widthMessage(w, stmt.arg.kind === 'param' ? stmt.arg.name : undefined), stmt.arg.pos);
          }
          this.turtle.width = w;
          return { type: 'style', stmt };
        }
        case 'repeat': {
          const n = this.evalArg(stmt.count, frame.env);
          if (!validRepeatCount(n)) {
            throw new LogoError(repeatMessage(n, stmt.count.kind === 'param' ? stmt.count.name : undefined), stmt.count.pos);
          }
          if (n === 0 || stmt.body.length === 0) continue;
          this.push({ stmts: stmt.body, index: 0, env: frame.env, remaining: n - 1, isRepeat: true }, stmt);
          continue;
        }
        case 'call': {
          const proc = this.program.procs.get(stmt.name)!;
          const env = stmt.args.map((a) => this.evalArg(a, frame.env));
          this.push({ stmts: proc.body, index: 0, env, remaining: 0, isRepeat: false }, stmt);
          continue;
        }
      }
    }
  }

  private push(frame: Frame, stmt: Stmt): void {
    // The main program frame does not count towards the depth limit.
    if (this.stack.length > LIMITS.depth) {
      throw new LogoError(
        `Za głębokie zagnieżdżenie: wywołania procedur i powtórzeń mogą mieć najwyżej ${LIMITS.depth} poziomy.`,
        stmt.pos,
      );
    }
    this.stack.push(frame);
  }

  private countOperation(stmt: Stmt): void {
    this.operations++;
    if (this.operations > LIMITS.operations) {
      throw new LogoError(
        `Przekroczono limit ${fmtInt(LIMITS.operations)} operacji. Program wykonuje za dużo poleceń – zmniejsz liczbę powtórzeń.`,
        stmt.pos,
      );
    }
  }

  private evalArg(arg: NumArg, env: number[]): number {
    return arg.kind === 'num' ? arg.value : env[arg.index]!;
  }

  private move(stmt: Stmt, distance: number): StepEvent {
    const t = this.turtle;
    const from = t.position;
    const to = advance(from, t.heading, distance);
    for (const c of to) {
      if (!(Math.abs(c) <= LIMITS.coordinate)) {
        throw new LogoError(
          `Żółw wyszedł poza dozwolony obszar: współrzędne muszą mieścić się w zakresie ±${fmtInt(LIMITS.coordinate)}.`,
          stmt.pos,
        );
      }
    }
    if (t.penDown && distance !== 0) {
      if (this.segments.length >= LIMITS.segments) {
        throw new LogoError(`Przekroczono limit ${fmtInt(LIMITS.segments)} narysowanych odcinków.`, stmt.pos);
      }
      const segment: Segment = { from: [from[0], from[1], from[2]], to: [to[0], to[1], to[2]], color: t.color, width: t.width };
      this.segments.push(segment);
      t.position = to;
      return { type: 'draw', stmt, segment };
    }
    t.position = to;
    return { type: 'move', stmt };
  }
}
