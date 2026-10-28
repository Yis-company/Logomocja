import { parseProgram } from './parser';
import { type Program } from './ast';
import { type LogoError, LogoFailure, positionAt } from './errors';
import { Interpreter, type Segment } from './interpreter';
import { LIMITS, type Mode } from './limits';

export { Interpreter, type Highlight, type Segment } from './interpreter';
export { type LogoError, type Position } from './errors';
export { type Mode, LIMITS } from './limits';
export { type Program } from './ast';
export { DEFAULT_COLOUR, DEFAULT_WIDTH, initialTurtle, type Turtle, type Vec3 } from './turtle';
export { COMMANDS } from './commands';
export { highlightSource, type HighlightSpan } from './highlight';

export type CompileResult = { ok: true; program: Program } | { ok: false; error: LogoError };

/** Checks a program without running it. Nothing is drawn by a program that fails here. */
export function compile(source: string, mode: Mode): CompileResult {
  if (source.length > LIMITS.sourceChars) {
    return {
      ok: false,
      error: {
        message: `Program jest za długi (limit ${LIMITS.sourceChars} znaków).`,
        ...positionAt(source, LIMITS.sourceChars),
      },
    };
  }
  try {
    return { ok: true, program: parseProgram(source, mode) };
  } catch (e) {
    if (e instanceof LogoFailure) return { ok: false, error: e.toError() };
    throw e;
  }
}

export interface RunResult {
  segments: Segment[];
  error: LogoError | null;
}

/** Runs a whole program without any UI. A parse-time error draws nothing. */
export function runSource(source: string, mode: Mode): RunResult {
  const compiled = compile(source, mode);
  if (!compiled.ok) return { segments: [], error: compiled.error };
  const interpreter = new Interpreter(compiled.program);
  interpreter.runToEnd();
  return { segments: interpreter.segments.map(copySegment), error: interpreter.error };
}

export function copySegment(s: Segment): Segment {
  return { from: [...s.from], to: [...s.to], color: s.color, width: s.width };
}
