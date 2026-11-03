import type { Expr } from './ast';

export type FailureKind = 'div0' | 'nonfinite' | 'unassigned';

/** An expression could not be evaluated; the caller positions it at the argument. */
export class EvalFailure extends Error {
  constructor(readonly kind: FailureKind, readonly name = '') {
    super(kind);
  }
}

export function evalFailureMessage(f: EvalFailure): string {
  switch (f.kind) {
    case 'div0':
      return 'Dzielenie przez zero. Sprawdź, czy dzielnik nie wynosi 0.';
    case 'nonfinite':
      return 'Wynik działania jest za duży, żeby go policzyć.';
    case 'unassigned':
      return `Zmienna „${f.name}” nie ma jeszcze wartości. Nadaj ją wcześniej poleceniem niech ${f.name} …`;
  }
}

export interface Scope {
  lookup(name: string): number | undefined;
  repcount(): number;
}

function check(v: number): number {
  if (!Number.isFinite(v)) throw new EvalFailure('nonfinite');
  return v;
}

export function evaluate(e: Expr, scope: Scope): number {
  switch (e.k) {
    case 'num':
      return e.v;
    case 'var': {
      const v = scope.lookup(e.name);
      if (v === undefined) throw new EvalFailure('unassigned', e.tok.text.replace(/^:/, ''));
      return v;
    }
    case 'rep':
      return scope.repcount();
    case 'neg':
      return -evaluate(e.e, scope);
    case 'bin': {
      const a = evaluate(e.a, scope);
      const b = evaluate(e.b, scope);
      switch (e.op) {
        case '+':
          return check(a + b);
        case '-':
          return check(a - b);
        case '*':
          return check(a * b);
        case '/':
          if (b === 0) throw new EvalFailure('div0');
          return check(a / b);
      }
    }
  }
}

const NO_NAMES: Scope = {
  lookup: () => undefined,
  repcount: () => NaN,
};

/** Evaluates an expression that mentions no names (checked at parse time). */
export function evalConst(e: Expr): number {
  return evaluate(e, NO_NAMES);
}
