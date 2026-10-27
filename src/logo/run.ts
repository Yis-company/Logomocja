import { errorInfoOf } from './errors';
import { type Token } from './lexer';
import { Machine } from './machine';
import { parseProgram, type Program } from './parser';
import type { LogoErrorInfo, Mode, RunResult } from './types';

/** A program being executed. Call `step` to advance it by commands, or `runToEnd` to finish it. */
export class Execution {
  readonly machine: Machine;
  readonly program: Program;
  /** Set when the program has finished or failed. */
  done = false;
  error: LogoErrorInfo | null = null;
  /** The last command that ran, for display. */
  current: Token | null = null;
  private readonly generator: Generator<Token, void, void>;

  /** Throws a LogoError if the source does not parse or validate for this mode. */
  constructor(source: string, mode: Mode) {
    assertMode(mode);
    this.program = parseProgram(source, mode);
    this.machine = new Machine(this.program);
    this.generator = this.machine.execute();
  }

  /** Runs up to `count` commands. Returns true once the program has finished or failed. */
  step(count = 1): boolean {
    for (let i = 0; i < count && !this.done; i++) {
      try {
        const result = this.generator.next();
        if (result.done) {
          this.done = true;
        } else {
          this.current = result.value;
        }
      } catch (error) {
        this.done = true;
        this.error = errorInfoOf(error);
      }
    }
    return this.done;
  }

  runToEnd(): void {
    this.step(Infinity);
  }
}

/** Validates a program without drawing it. Returns the first problem, or null. */
export function validateLogo(source: string, mode: Mode): LogoErrorInfo | null {
  assertMode(mode);
  try {
    parseProgram(source, mode);
    return null;
  } catch (error) {
    return errorInfoOf(error);
  }
}

/** Interprets a whole program. Parse errors draw nothing; run-time errors keep what was drawn. */
export function runLogo(source: string, mode: Mode): RunResult {
  assertMode(mode);
  let execution: Execution;
  try {
    execution = new Execution(source, mode);
  } catch (error) {
    return { segments: [], error: errorInfoOf(error) };
  }
  execution.runToEnd();
  return { segments: execution.machine.segments, error: execution.error };
}

function assertMode(mode: string): asserts mode is Mode {
  if (mode !== '2d' && mode !== '3d') {
    throw new TypeError(`Nieznany tryb: ${String(mode)}`);
  }
}
