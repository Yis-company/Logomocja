/** Position of a token in the source, 1-based line and column. */
export interface Pos {
  line: number;
  column: number;
  /** Length of the token text in UTF-16 units (for highlighting). */
  length: number;
}

/** A Logo error as exposed to the UI and to `window.logomocja.run`. */
export interface LogoErrorInfo {
  message: string;
  line: number;
  column: number;
}

export class LogoError extends Error {
  readonly line: number;
  readonly column: number;
  readonly length: number;

  constructor(message: string, pos: Pos) {
    super(message);
    this.name = 'LogoError';
    this.line = pos.line;
    this.column = pos.column;
    this.length = pos.length;
  }

  toInfo(): LogoErrorInfo {
    return { message: this.message, line: this.line, column: this.column };
  }
}

export const LIMITS = {
  sourceChars: 50_000,
  tokens: 10_000,
  depth: 32,
  operations: 10_000,
  segments: 10_000,
  coordinate: 100_000,
  repeatMax: 10_000,
  widthMin: 1,
  widthMax: 12,
} as const;

/** Formats a number for Polish messages (dot kept as decimal separator, as in source). */
export function fmtNum(n: number): string {
  return Number.isInteger(n) ? String(n) : String(n);
}

/** Formats an integer with thin-space thousands separators, Polish style. */
export function fmtInt(n: number): string {
  return n.toLocaleString('pl-PL').replace(/ /g, ' ');
}
