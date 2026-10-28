import type { Mode, Program } from './ast';
import { LogoFailure, type LogoError } from './errors';
import { execute, type Execution, type Segment } from './interpreter';
import { parse } from './parser';

export type { Mode, Program } from './ast';
export type { LogoError } from './errors';
export type { Execution, Segment, Step, TurtleState, Pose } from './interpreter';
export { LIMITS } from './errors';
export { initialState, INITIAL_COLOR, INITIAL_WIDTH } from './interpreter';

export interface RunResult {
  segments: Segment[];
  error: { message: string; line: number; column: number } | null;
}

export type Compiled =
  | { ok: true; program: Program }
  | { ok: false; error: LogoError };

/** Analizuje program; błąd składni zwraca zamiast rzucać. */
export function compile(source: string, mode: Mode): Compiled {
  try {
    return { ok: true, program: parse(source, mode) };
  } catch (e) {
    if (e instanceof LogoFailure) return { ok: false, error: e.toError('parse') };
    throw e;
  }
}

/** Analizuje i wykonuje program. Przy błędzie składni nic nie jest rysowane. */
export function runProgram(source: string, mode: Mode, trace = false): Execution {
  const c = compile(source, mode);
  if (!c.ok) {
    return {
      segments: [], drawn: [], steps: [], error: c.error,
      final: { pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], pen: true, color: '#16866a', width: 3 },
      operations: 0,
    };
  }
  return execute(c.program, { trace });
}

/** Wynik w formacie publicznego interfejsu window.logomocja.run. */
export function run(source: string, mode: Mode): RunResult {
  if (typeof source !== 'string') source = String(source ?? '');
  if (mode !== '2d' && mode !== '3d') mode = '2d';
  const ex = runProgram(source, mode);
  return {
    segments: ex.segments.map((s) => ({
      from: [...s.from], to: [...s.to], color: s.color, width: s.width,
    })),
    error: ex.error ? { message: ex.error.message, line: ex.error.line, column: ex.error.column } : null,
  };
}
