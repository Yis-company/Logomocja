export interface SourcePos {
  line: number;
  column: number;
}

export interface LogoErrorInfo extends SourcePos {
  message: string;
}

/** An error in a Logo program, located at a 1-based line and column. */
export class LogoError extends Error {
  readonly line: number;
  readonly column: number;
  /** Length of the offending token (for highlighting); at least 1. */
  readonly length: number;
  /** "parse" errors are found before running; "run" errors while running. */
  readonly phase: "parse" | "run";

  constructor(message: string, pos: SourcePos & { length?: number }, phase: "parse" | "run" = "parse") {
    super(message);
    this.name = "LogoError";
    this.line = pos.line;
    this.column = pos.column;
    this.length = Math.max(1, pos.length ?? 1);
    this.phase = phase;
  }

  toInfo(): LogoErrorInfo {
    return { message: this.message, line: this.line, column: this.column };
  }
}

/** Polish plural helper: forms for 1, 2–4, 5+ (e.g. "argument", "argumenty", "argumentów"). */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const dd = n % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return few;
  return many;
}

/** Format an integer with Polish thousands separators ("10 000"). */
export function fmtInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
