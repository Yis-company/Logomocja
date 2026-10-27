import type { LogoErrorInfo } from './types';

export interface Position {
  line: number;
  column: number;
}

/** An error in the user's program, located at a 1-based line and column. */
export class LogoError extends Error {
  readonly line: number;
  readonly column: number;

  constructor(message: string, at: Position) {
    super(message);
    this.name = 'LogoError';
    this.line = at.line;
    this.column = at.column;
  }

  toInfo(): LogoErrorInfo {
    return { message: this.message, line: this.line, column: this.column };
  }
}

/** Converts a caught exception to error info. Anything that is not a LogoError is a bug and is rethrown. */
export function errorInfoOf(error: unknown): LogoErrorInfo {
  if (error instanceof LogoError) return error.toInfo();
  throw error;
}
