export type { Mode, Program } from './ast';
export { LIMITS, LogoError } from './errors';
export { execute, initialTurtle, rotateState, DEFAULT_COLOR, DEFAULT_WIDTH } from './interpreter';
export type { Outcome, Segment, Step, TurtleState } from './interpreter';
export { parse } from './parser';
export { tokenize } from './lexer';
export type { Token } from './lexer';

import type { Mode } from './ast';
import { execute } from './interpreter';

export interface PublicSegment {
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  width: number;
}

export interface PublicResult {
  segments: PublicSegment[];
  error: { message: string; line: number; column: number } | null;
}

/** The result format of the `window.logomocja.run` testing hook. */
export function runPublic(source: string, mode: Mode): PublicResult {
  const out = execute(String(source ?? ''), mode === '3d' ? '3d' : '2d');
  return {
    segments: out.segments.map((s) => ({
      from: [s.from[0], s.from[1], s.from[2]],
      to: [s.to[0], s.to[1], s.to[2]],
      color: s.color,
      width: s.width,
    })),
    error: out.error ? out.error.toJSON() : null,
  };
}
