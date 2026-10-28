/** Błąd programu w Logo: komunikat po polsku i pozycja (numerowana od 1). */
export interface ErrorInfo {
  message: string;
  line: number;
  column: number;
}

export class LogoError extends Error implements ErrorInfo {
  readonly line: number;
  readonly column: number;
  /** Długość oznaczanego fragmentu (do podkreślenia w edytorze). */
  readonly length: number;
  /** `parse` — wykryty przed rysowaniem; `run` — wykryty w trakcie wykonania. */
  readonly phase: 'parse' | 'run';

  constructor(message: string, line: number, column: number, length = 1, phase: 'parse' | 'run' = 'parse') {
    super(message);
    this.name = 'LogoError';
    this.line = line;
    this.column = column;
    this.length = Math.max(1, length);
    this.phase = phase;
  }

  toInfo(): ErrorInfo {
    return { message: this.message, line: this.line, column: this.column };
  }
}
