export interface Position {
  line: number;
  column: number;
}

/** A user-facing error with a 1-based position in the source. */
export interface LogoError extends Position {
  message: string;
}

export class LogoFailure extends Error {
  readonly line: number;
  readonly column: number;

  constructor(message: string, at: Position) {
    super(message);
    this.name = 'LogoFailure';
    this.line = at.line;
    this.column = at.column;
  }

  toError(): LogoError {
    return { message: this.message, line: this.line, column: this.column };
  }
}

/** Converts a 0-based character offset into a 1-based line and column. */
export function positionAt(source: string, offset: number): Position {
  let line = 1;
  let column = 1;
  const end = Math.min(offset, source.length);
  for (let i = 0; i < end; i++) {
    if (source.charCodeAt(i) === 10) {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}
