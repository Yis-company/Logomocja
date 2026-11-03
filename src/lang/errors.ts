export type ErrorKind = 'parse' | 'runtime';

export interface Located {
  line: number;
  col: number;
}

/** A problem in a Logo program, positioned at a 1-based line and column. */
export class LogoError extends Error {
  readonly line: number;
  readonly column: number;
  readonly kind: ErrorKind;
  readonly length: number;

  constructor(message: string, at: Located & { length?: number }, kind: ErrorKind = 'parse') {
    super(message);
    this.line = at.line;
    this.column = at.col;
    this.kind = kind;
    this.length = Math.max(1, at.length ?? 1);
  }

  toJSON() {
    return { message: this.message, line: this.line, column: this.column };
  }
}

/** Polish plural for counts: 1 odcinek, 2 odcinki, 5 odcinków. */
export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  const d = abs % 10;
  const dd = abs % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return few;
  return many;
}

export function fmtNum(n: number): string {
  return n.toLocaleString('pl-PL', { maximumFractionDigits: 4 }).replace(/ /g, ' ');
}
