import type { BinaryOp, CompareOp, Expr } from './ast';

/** Błąd obliczenia; zamieniany na LogoError z pozycją argumentu. */
export class EvalFault extends Error {}

export function applyBinary(op: BinaryOp, a: number, b: number): number {
  let r: number;
  switch (op) {
    case '+':
      r = a + b;
      break;
    case '-':
      r = a - b;
      break;
    case '*':
      r = a * b;
      break;
    case '/':
      if (b === 0) throw new EvalFault('Dzielenie przez zero.');
      r = a / b;
      break;
  }
  if (!Number.isFinite(r)) throw new EvalFault('Wynik działania jest za duży — nie jest skończoną liczbą.');
  return r;
}

export function compare(op: CompareOp, a: number, b: number): boolean {
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
  }
}

/** Oblicza wyrażenie; `lookup` dostarcza wartości nazw i nrpowt. */
export function evaluate(e: Expr, lookup: (e: Expr & { k: 'var' | 'rep' }) => number): number {
  switch (e.k) {
    case 'num':
      return e.value;
    case 'var':
    case 'rep':
      return lookup(e);
    case 'neg':
      return -evaluate(e.e, lookup);
    case 'bin':
      return applyBinary(e.op, evaluate(e.a, lookup), evaluate(e.b, lookup));
  }
}

export function evalConstant(e: Expr): number {
  return evaluate(e, () => {
    throw new EvalFault('To wyrażenie zależy od nazw i nie można go policzyć przed uruchomieniem.');
  });
}
