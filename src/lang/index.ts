import { LogoError, type Program } from './ast';
import { Machine, type Segment } from './interp';
import type { Mode } from './keywords';
import { parse } from './parser';

export { LogoError } from './ast';
export type { Program, Stmt, Expr } from './ast';
export { Machine, initialTurtle } from './interp';
export type { Segment, Step, TurtleState, Vec3 } from './interp';
export type { Mode } from './keywords';
export { parse } from './parser';
export { tokenize, normalizeName } from './lexer';
export type { Token, TokenKind } from './lexer';

export interface RunError {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: RunError | null;
}

function toRunError(e: unknown): RunError {
  if (e instanceof LogoError) return { message: e.message, line: e.line, column: e.column };
  const msg = e instanceof Error ? e.message : String(e);
  return { message: `Błąd wewnętrzny interpretera: ${msg}`, line: 1, column: 1 };
}

/** Przetwarza program; błąd składni zwraca jako wynik (nic nie zostaje narysowane). */
export function compile(
  source: string,
  mode: Mode,
): { program: Program; error: null } | { program: null; error: RunError } {
  try {
    return { program: parse(source, mode), error: null };
  } catch (e) {
    return { program: null, error: toRunError(e) };
  }
}

/** Uruchamia program do końca, bez animacji. */
export function runProgram(source: string, mode: Mode): RunResult {
  const c = compile(source, mode);
  if (c.error) return { segments: [], error: c.error };
  const machine = new Machine(c.program, mode);
  try {
    for (const _ of machine.execute()) void _;
  } catch (e) {
    return { segments: machine.segments, error: toRunError(e) };
  }
  return { segments: machine.segments, error: null };
}

export { toRunError };
