import type { Mode } from './ast';
import type { ErrorInfo } from './errors';
import { Machine } from './interpreter';
import { parse } from './parser';
import type { Segment } from './turtle';

export type { Mode, Program } from './ast';
export { LogoError, type ErrorInfo } from './errors';
export { LIMITS } from './limits';
export { Machine, type Step } from './interpreter';
export { parse } from './parser';
export { lex, type Token } from './lexer';
export { Turtle, type Pose, type Segment, type Vec3, initialPose, rotatePose } from './turtle';
export * from './keywords';

export interface RunResult {
  segments: Segment[];
  error: ErrorInfo | null;
}

export function normalizeMode(mode: unknown): Mode {
  return String(mode).toLowerCase() === '3d' ? '3d' : '2d';
}

/** Interpretuje program w całości, bez animacji i bez interfejsu. */
export function runSource(source: string, mode: unknown): RunResult {
  const m = normalizeMode(mode);
  const parsed = parse(String(source ?? ''), m);
  if (parsed.error) return { segments: [], error: parsed.error.toInfo() };
  const machine = new Machine(parsed.program);
  machine.runToEnd();
  return { segments: machine.segments, error: machine.error ? machine.error.toInfo() : null };
}
