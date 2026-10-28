import { LogoError } from './lexer';
import { parse } from './parser';
import { Execution, type RunError, type Segment } from './machine';
import type { Mode } from './ast';

export { parse } from './parser';
export { Execution, Machine, freshTurtle, DEFAULT_COLOR, DEFAULT_WIDTH } from './machine';
export type { Segment, Turtle, Vec3, RunError, Pos } from './machine';
export { LogoError, tokenize, normKey, MAX_CHARS, MAX_TOKENS } from './lexer';
export type { Token } from './lexer';
export type { Mode, Program } from './ast';

export interface RunResult {
  segments: Segment[];
  error: RunError | null;
}

/** Interprets a whole program at once. A parse-time error draws nothing. */
export function runSource(source: string, mode: Mode): RunResult {
  let prog;
  try {
    prog = parse(source, mode);
  } catch (e) {
    if (e instanceof LogoError) {
      return { segments: [], error: { message: e.message, line: e.line, column: e.column } };
    }
    throw e;
  }
  const exec = new Execution(prog);
  exec.runToEnd();
  return { segments: exec.machine.segments, error: exec.error };
}

/** Parse-time error only, for live diagnostics while editing. */
export function checkSource(source: string, mode: Mode): RunError | null {
  try {
    parse(source, mode);
    return null;
  } catch (e) {
    if (e instanceof LogoError) return { message: e.message, line: e.line, column: e.column };
    throw e;
  }
}
