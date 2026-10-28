/** Position of a token in the source, 1-based. */
export interface Pos {
  line: number;
  column: number;
}

/** A parse-time or run-time error of a Logo program. */
export class LogoError extends Error {
  constructor(
    message: string,
    readonly line: number,
    readonly column: number,
  ) {
    super(message);
    this.name = 'LogoError';
  }
}

export function errorAt(message: string, at: Pos): LogoError {
  return new LogoError(message, at.line, at.column);
}
