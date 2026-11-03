export class LogoError extends Error {
  constructor(message: string, public line: number, public column: number) {
    super(message);
  }
}

/** Błąd obliczenia wyrażenia; miejsce nadaje mu argument, w którym wystąpił. */
export class EvalError extends Error {}

export interface ErrorInfo {
  message: string;
  line: number;
  column: number;
}
