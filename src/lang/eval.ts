import type { ExprOp } from './ast';
import { LIMITS } from './limits';

/** Środowisko obliczania wyrażeń. */
export interface EvalEnv {
  lookup(name: string): number | undefined;
  rep(): number;
}

export type EvalFailKind = 'div0' | 'nonfinite' | 'unassigned';

export class EvalFail {
  constructor(public kind: EvalFailKind, public name = '') {}

  message(): string {
    switch (this.kind) {
      case 'div0':
        return 'Dzielenie przez zero.';
      case 'nonfinite':
        return 'Wynik obliczenia nie jest skończoną liczbą (przekroczono zakres liczb).';
      default:
        return `Zmienna „${this.name}” nie ma jeszcze wartości — użyj najpierw „niech ${this.name} …”.`;
    }
  }
}

/** Oblicza wyrażenie zapisane w odwrotnej notacji polskiej. Zgłasza `EvalFail`. */
export function evalOps(ops: ExprOp[], env: EvalEnv | null): number {
  const st: number[] = [];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i]!;
    switch (op.o) {
      case 'num':
        st.push(op.v);
        break;
      case 'var': {
        const v = env ? env.lookup(op.name) : undefined;
        if (v === undefined) throw new EvalFail('unassigned', op.name);
        st.push(v);
        break;
      }
      case 'rep':
        st.push(env ? env.rep() : 0);
        break;
      case 'neg':
        st.push(-st.pop()!);
        break;
      default: {
        const b = st.pop()!;
        const a = st.pop()!;
        let r: number;
        if (op.o === 'add') r = a + b;
        else if (op.o === 'sub') r = a - b;
        else if (op.o === 'mul') r = a * b;
        else {
          if (b === 0) throw new EvalFail('div0');
          r = a / b;
        }
        if (!Number.isFinite(r)) throw new EvalFail('nonfinite');
        st.push(r);
      }
    }
  }
  return st[st.length - 1]!;
}

/** Komunikat o niepoprawnej grubości albo `null`. */
export function widthProblem(v: number): string | null {
  if (Number.isInteger(v) && v >= LIMITS.minWidth && v <= LIMITS.maxWidth) return null;
  return `Grubość musi być liczbą całkowitą od ${LIMITS.minWidth} do ${LIMITS.maxWidth} (otrzymano ${fmt(v)}).`;
}

/** Komunikat o niepoprawnej liczbie powtórzeń albo `null`. */
export function repeatProblem(v: number): string | null {
  if (Number.isInteger(v) && v >= 0 && v <= LIMITS.maxRepeat) return null;
  return `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${LIMITS.maxRepeat.toLocaleString('pl-PL')} (otrzymano ${fmt(v)}).`;
}

export function fmt(v: number): string {
  if (Number.isInteger(v)) return Math.abs(v) >= 10000 ? v.toLocaleString('pl-PL') : String(v);
  const s = Number(v.toPrecision(10)).toString();
  return s.replace('.', ',');
}
