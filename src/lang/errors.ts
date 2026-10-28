export const LIMITS = {
  sourceChars: 50_000,
  tokens: 10_000,
  nesting: 32,
  frames: 32,
  operations: 10_000,
  segments: 10_000,
  coordinate: 100_000,
} as const;

/** A position in the source: 1-based line and column plus raw offsets for the editor. */
export interface SourceSpan {
  line: number;
  col: number;
  offset: number;
  end: number;
}

export type ErrorPhase = 'parse' | 'run';

/** An error of a Logo program, with a Polish message and the offending position. */
export class LogoError extends Error {
  readonly line: number;
  readonly column: number;
  readonly offset: number;
  readonly end: number;
  phase: ErrorPhase;

  constructor(message: string, at: SourceSpan, phase: ErrorPhase = 'parse') {
    super(message);
    this.name = 'LogoError';
    this.line = at.line;
    this.column = at.col;
    this.offset = at.offset;
    this.end = at.end;
    this.phase = phase;
  }

  toJSON(): { message: string; line: number; column: number } {
    return { message: this.message, line: this.line, column: this.column };
  }
}

/** Formats a number the way it could be written in a program. */
export function fmtNum(v: number): string {
  if (Object.is(v, -0)) return '0';
  if (Number.isInteger(v)) return String(v);
  const s = String(Number(v.toPrecision(12)));
  return s;
}

/** Polish plural form: 1 argument, 2 argumenty, 5 argumentów. */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const dd = n % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return few;
  return many;
}

export function thousands(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
