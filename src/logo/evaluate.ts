import { LogoError, type Token } from './lexer';
import type { Expr } from './ast';

export interface Scope {
  /** Value of a variable or parameter visible here, if assigned. */
  get(name: string): number | undefined;
  /** Index of the innermost enclosing repeat, if any. */
  rep: number | undefined;
}

export const fail = (where: Token, message: string): LogoError =>
  new LogoError(message, where.line, where.col);

/**
 * Evaluates an expression. Errors are reported at `where`, the first token of
 * the argument that contains the expression.
 */
export function evaluate(e: Expr, sc: Scope, where: Token): number {
  switch (e.k) {
    case 'num':
      return e.v;
    case 'var': {
      const v = sc.get(e.tok.key);
      if (v === undefined) throw fail(where, `Zmienna '${e.tok.text}' nie ma jeszcze wartości.`);
      return v;
    }
    case 'rep':
      if (sc.rep === undefined) throw fail(e.tok, `'nrpowt' działa tylko wewnątrz powtórzenia.`);
      return sc.rep;
    case 'neg':
      return -evaluate(e.e, sc, where);
    case 'bin': {
      const a = evaluate(e.l, sc, where);
      const b = evaluate(e.r, sc, where);
      if (e.op === '/' && b === 0) throw fail(where, 'Dzielenie przez zero.');
      const v = e.op === '+' ? a + b : e.op === '-' ? a - b : e.op === '*' ? a * b : a / b;
      if (!Number.isFinite(v)) throw fail(where, 'Wynik obliczenia nie jest liczbą skończoną.');
      return v;
    }
  }
}

export function compare(op: string, a: number, b: number): boolean {
  switch (op) {
    case '<':
      return a < b;
    case '>':
      return a > b;
    case '=':
      return a === b;
    case '<=':
      return a <= b;
    case '>=':
      return a >= b;
    case '<>':
      return a !== b;
    default:
      return false;
  }
}

/** True when the expression refers to no names and no repeat counter. */
export function isConstant(e: Expr): boolean {
  switch (e.k) {
    case 'num':
      return true;
    case 'var':
    case 'rep':
      return false;
    case 'neg':
      return isConstant(e.e);
    case 'bin':
      return isConstant(e.l) && isConstant(e.r);
  }
}
