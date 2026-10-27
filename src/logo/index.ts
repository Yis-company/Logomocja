import type { Mode, Program, Segment } from './ast';
import { LogoError, type LogoErrorInfo } from './errors';
import { parse } from './parser';
import { Runner } from './runner';

export type { Mode, Program, Segment, Stmt, NumArg, ProcDef } from './ast';
export { LogoError, LIMITS, type LogoErrorInfo, type Pos } from './errors';
export { parse } from './parser';
export { Runner, type StepEvent } from './runner';
export { tokenize, type Token } from './lexer';
export type { TurtleState, Vec3 } from './turtle';
export { headingDegrees, DEFAULT_COLOR, DEFAULT_WIDTH } from './turtle';

export interface RunResult {
  segments: Segment[];
  error: LogoErrorInfo | null;
}

export function normalizeMode(mode: unknown): Mode {
  const m = typeof mode === 'string' ? mode.trim().toLowerCase() : mode;
  if (m === '2d' || m === '3d') return m;
  throw new TypeError(`Nieznany tryb „${String(mode)}”: oczekiwano "2d" albo "3d".`);
}

/** Compiles a program; returns either the program or the first error. */
export function compile(source: string, mode: Mode): { program: Program; error: null } | { program: null; error: LogoError } {
  try {
    return { program: parse(source, mode), error: null };
  } catch (e) {
    if (e instanceof LogoError) return { program: null, error: e };
    throw e;
  }
}

/**
 * Interprets `source` in the given mode and returns the drawn segments and the
 * first error, if any. Pure: no UI, no state.
 */
export function run(source: string, mode: Mode | string): RunResult {
  if (typeof source !== 'string') {
    throw new TypeError('Program musi być tekstem (string).');
  }
  const m = normalizeMode(mode);
  const compiled = compile(source, m);
  if (compiled.error) {
    return { segments: [], error: compiled.error.toInfo() };
  }
  const runner = new Runner(compiled.program);
  runner.runAll();
  return { segments: runner.segments, error: runner.error ? runner.error.toInfo() : null };
}
