export interface LogoErrorInfo {
  message: string;
  line: number;
  column: number;
}

export interface Pos {
  line: number;
  col: number;
}

/** Błąd programu z pozycją (wiersz i kolumna liczone od 1). */
export class LogoError extends Error {
  readonly line: number;
  readonly column: number;
  readonly phase: 'parse' | 'run';

  constructor(message: string, pos: Pos, phase: 'parse' | 'run' = 'parse') {
    super(message);
    this.line = pos.line;
    this.column = pos.col;
    this.phase = phase;
  }

  toInfo(): LogoErrorInfo {
    return { message: this.message, line: this.line, column: this.column };
  }
}

/** Wartość tokenu w polskich cudzysłowach do komunikatów. */
export function q(text: string): string {
  const t = text.length > 24 ? text.slice(0, 23) + '…' : text;
  return `„${t}”`;
}

export function formatNumber(n: number): string {
  if (Number.isInteger(n)) return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return String(Math.round(n * 1e6) / 1e6).replace('.', ',');
}
