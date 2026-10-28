import { Machine, type Segment, type Step, type Turtle } from './machine';
import { parseProgram } from './parser';
import { LogoError } from './lexer';
import type { Mode } from './spec';

export { COMMAND_TABLE, LIMITS, PITCH_AND_ROLL, RESERVED, type CommandKind, type Mode } from './spec';
export { LogoError, tokenize, type Token } from './lexer';
export { parseProgram } from './parser';
export type { Segment, Step, Turtle } from './machine';

/** A problem to show the user: a Polish message and a 1-based position. */
export interface Diagnostic {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: Diagnostic | null;
}

function toDiagnostic(error: LogoError): Diagnostic {
  return { message: error.message, line: error.line, column: error.column };
}

function copySegments(segments: readonly Segment[]): Segment[] {
  return segments.map((s) => ({
    from: [s.from[0] + 0, s.from[1] + 0, s.from[2] + 0],
    to: [s.to[0] + 0, s.to[1] + 0, s.to[2] + 0],
    color: s.color,
    width: s.width,
  }));
}

/** Checks a program without running it. Returns the first problem, if any. */
export function diagnose(source: string, mode: Mode): Diagnostic | null {
  try {
    parseProgram(source, mode);
    return null;
  } catch (error) {
    if (error instanceof LogoError) return toDiagnostic(error);
    throw error;
  }
}

/**
 * Runs a program to the end. A parse-time error draws nothing; a run-time
 * error keeps the segments drawn before it.
 */
export function run(source: string, mode: Mode): RunResult {
  let machine: Machine;
  try {
    machine = new Machine(parseProgram(source, mode));
  } catch (error) {
    if (error instanceof LogoError) return { segments: [], error: toDiagnostic(error) };
    throw error;
  }
  const steps = machine.execute();
  try {
    while (!steps.next().done);
  } catch (error) {
    if (error instanceof LogoError) {
      return { segments: copySegments(machine.segments), error: toDiagnostic(error) };
    }
    throw error;
  }
  return { segments: copySegments(machine.segments), error: null };
}

export type SessionState = 'ready' | 'finished' | 'failed';

/**
 * A program being executed step by step. `position` is the statement that
 * will run next; `advance` runs statements. Parse errors are thrown by the
 * constructor, so a session always has a valid program.
 */
export class Session {
  readonly machine: Machine;
  private readonly iterator: Generator<Step, void, undefined>;
  private next: Step | null = null;
  private state: SessionState = 'ready';
  private failure: Diagnostic | null = null;
  private executed = 0;

  constructor(source: string, mode: Mode) {
    this.machine = new Machine(parseProgram(source, mode));
    this.iterator = this.machine.execute();
    // Announce the first statement without running it.
    const first = this.iterator.next();
    if (first.done) this.state = 'finished';
    else this.next = first.value;
  }

  get status(): SessionState {
    return this.state;
  }

  get position(): Step | null {
    return this.next;
  }

  get error(): Diagnostic | null {
    return this.failure;
  }

  /** Number of statements executed so far. */
  get count(): number {
    return this.executed;
  }

  get done(): boolean {
    return this.state !== 'ready';
  }

  get segments(): readonly Segment[] {
    return this.machine.segments;
  }

  get revision(): number {
    return this.machine.revision;
  }

  get turtle(): Turtle {
    return this.machine.turtle;
  }

  /**
   * Runs up to `maxStatements` statements. Returns the state afterwards.
   * Stops early at the end of the program or at a run-time error.
   */
  advance(maxStatements: number): SessionState {
    let remaining = maxStatements;
    while (remaining > 0 && this.state === 'ready') {
      remaining--;
      this.executed++;
      try {
        const result = this.iterator.next();
        if (result.done) {
          this.state = 'finished';
          this.next = null;
        } else {
          this.next = result.value;
        }
      } catch (error) {
        if (error instanceof LogoError) {
          this.failure = toDiagnostic(error);
          this.state = 'failed';
          this.next = null;
        } else {
          throw error;
        }
      }
    }
    return this.state;
  }
}
