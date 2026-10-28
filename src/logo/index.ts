import { LogoError, type Pos } from './errors';
import { Machine, type Segment } from './machine';
import { parseTokens, type Program } from './parser';
import { tokenize } from './lexer';
import type { Mode } from './vocab';

export type { Mode } from './vocab';
export type { Segment, TurtleState, Vec } from './machine';
export { Machine, LIMITS } from './machine';
export type { Program } from './parser';
export { LogoError, type Pos } from './errors';
export { constValue } from './parser';

export const SOURCE_LIMIT = 50000;

export interface ErrorInfo {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: ErrorInfo | null;
}

/** Line and column (1-based) of a character offset. */
export function posOf(src: string, index: number): Pos {
  const before = src.slice(0, index);
  const line = before.split('\n').length;
  const column = index - (before.lastIndexOf('\n') + 1) + 1;
  return { line, column };
}

/** Parses the source; throws a LogoError on the first parse-time problem. */
export function compile(source: string, mode: Mode): Program {
  if (source.length > SOURCE_LIMIT) {
    const at = posOf(source, SOURCE_LIMIT);
    throw new LogoError(`Program jest za długi (limit ${SOURCE_LIMIT} znaków).`, at.line, at.column);
  }
  return parseTokens(tokenize(source), mode);
}

function toInfo(e: LogoError): ErrorInfo {
  return { message: e.message, line: e.line, column: e.column };
}

/** Runs the whole program at once. A parse-time error draws nothing; a run-time error keeps the drawing so far. */
export function runProgram(source: string, mode: Mode): RunResult {
  let program: Program;
  try {
    program = compile(source, mode);
  } catch (e) {
    if (e instanceof LogoError) return { segments: [], error: toInfo(e) };
    throw e;
  }
  const machine = new Machine(program);
  const steps = machine.execute();
  try {
    while (!steps.next().done) {
      // keep stepping until the program ends
    }
  } catch (e) {
    if (e instanceof LogoError) return { segments: [...machine.segments], error: toInfo(e) };
    throw e;
  }
  return { segments: [...machine.segments], error: null };
}
