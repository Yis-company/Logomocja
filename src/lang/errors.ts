import type { Token } from './lexer';

export interface LogoError {
  message: string;
  line: number;
  column: number;
  /** Przesunięcia w źródle (UTF-16) – do zaznaczenia w edytorze. */
  start: number;
  end: number;
  /** 'parse' – wykryty przed uruchomieniem, 'run' – w trakcie działania. */
  phase: 'parse' | 'run';
}

export class LogoFailure extends Error {
  constructor(
    message: string,
    readonly line: number,
    readonly column: number,
    readonly start: number,
    readonly end: number,
  ) {
    super(message);
  }

  static at(tok: Token, message: string): LogoFailure {
    return new LogoFailure(message, tok.line, tok.col, tok.start, tok.end);
  }

  toError(phase: 'parse' | 'run'): LogoError {
    return {
      message: this.message, line: this.line, column: this.column,
      start: this.start, end: this.end, phase,
    };
  }
}

export const LIMITS = {
  sourceChars: 50_000,
  tokens: 10_000,
  nesting: 32,
  parens: 32,
  frames: 32,
  operations: 10_000,
  segments: 10_000,
  coordinate: 100_000,
  repeat: 10_000,
  widthMin: 1,
  widthMax: 12,
} as const;

/** Formatuje liczbę do komunikatu po polsku (przecinek dziesiętny nie jest używany w kodzie, więc zostaje kropka). */
export function fmt(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const s = String(Number(n.toPrecision(12)));
  return s;
}

/** Odmiana rzeczownika po liczebniku: 1 argument, 2 argumenty, 5 argumentów. */
export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10, h = n % 100;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
}

/** Duża liczba całkowita z odstępami: 10 000. */
export function big(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
}
