import type { Mode, Program } from './ast';
import { LogoError } from './errors';
import { Execution, type RunResult } from './interpreter';
import { parse } from './parser';

export * from './ast';
export * from './interpreter';
export { LogoError } from './errors';
export { parse } from './parser';

export function normalizeMode(mode: unknown): Mode {
  return String(mode).toLowerCase() === '3d' ? '3d' : '2d';
}

/** Parses a program, returning either the program or a parse-time error. */
export function compile(source: string, mode: Mode): { program: Program; error: null } | { program: null; error: LogoError } {
  try {
    return { program: parse(String(source ?? ''), mode), error: null };
  } catch (err) {
    if (err instanceof LogoError) return { program: null, error: err };
    if (err instanceof RangeError) {
      return { program: null, error: new LogoError('Program jest zbyt głęboko zagnieżdżony, żeby go przeczytać.', { line: 1, col: 1 }) };
    }
    throw err;
  }
}

/** Interprets source with the dialect's semantics, without touching any UI. */
export function run(source: string, mode: Mode | string): RunResult {
  const m = normalizeMode(mode);
  const c = compile(source, m);
  if (!c.program) return { segments: [], error: c.error.toJSON() };
  return new Execution(c.program).runToEnd();
}
