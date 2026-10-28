import type { Expr } from './ast';

/** Błąd obliczania wyrażenia; wykonawca dołącza do niego położenie argumentu. */
export class EvalError extends Error {}

export interface EvalContext {
  /** Wartość zmiennej; rzuca EvalError, gdy zmienna nie ma wartości. */
  getVar(name: string): number;
  /** Numer bieżącej iteracji najbliższego powtórz (1, 2, …). */
  rep: number;
}

function finite(x: number): number {
  if (!Number.isFinite(x)) throw new EvalError('Wynik działania nie jest skończoną liczbą');
  return x;
}

export function evaluate(e: Expr, ctx: EvalContext): number {
  switch (e.k) {
    case 'num':
      return finite(e.v);
    case 'var':
      return ctx.getVar(e.name);
    case 'rep':
      return ctx.rep;
    case 'paren':
      return evaluate(e.e, ctx);
    case 'neg':
      return -evaluate(e.e, ctx);
    case 'sum': {
      let acc = evaluate(e.first, ctx);
      for (const r of e.rest) {
        const v = evaluate(r.e, ctx);
        acc = finite(r.op === '+' ? acc + v : acc - v);
      }
      return acc;
    }
    case 'prod': {
      let acc = evaluate(e.first, ctx);
      for (const r of e.rest) {
        const v = evaluate(r.e, ctx);
        if (r.op === '*') acc = finite(acc * v);
        else {
          if (v === 0) throw new EvalError('Dzielenie przez zero');
          acc = finite(acc / v);
        }
      }
      return acc;
    }
  }
}

/** Czy wyrażenie jest zapisane samymi liczbami (bez nazw i nrpowt)? */
export function isConstant(e: Expr): boolean {
  switch (e.k) {
    case 'num':
      return true;
    case 'var':
    case 'rep':
      return false;
    case 'paren':
    case 'neg':
      return isConstant(e.e);
    case 'sum':
    case 'prod':
      return isConstant(e.first) && e.rest.every((r) => isConstant(r.e));
  }
}

const NO_VARS: EvalContext = {
  getVar() {
    throw new EvalError('Nazwa w wyrażeniu stałym');
  },
  rep: 1,
};

/** Wartość wyrażenia stałego albo `undefined`, gdy nie da się jej obliczyć. */
export function constantValue(e: Expr): number | undefined {
  if (!isConstant(e)) return undefined;
  try {
    return evaluate(e, NO_VARS);
  } catch (err) {
    if (err instanceof EvalError) return undefined;
    throw err;
  }
}
