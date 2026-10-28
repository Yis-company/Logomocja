import { runSource, type RunResult } from '../src/lang';

export const run2 = (src: string): RunResult => runSource(src, '2d');
export const run3 = (src: string): RunResult => runSource(src, '3d');

export function close(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

/** Porównuje punkty z tolerancją. */
export function expectPoint(actual: number[], expected: number[], eps = 1e-9): void {
  if (actual.length !== expected.length || actual.some((v, i) => !close(v, expected[i]!, eps))) {
    throw new Error(`oczekiwano punktu ${JSON.stringify(expected)}, otrzymano ${JSON.stringify(actual)}`);
  }
}

export function pos(res: RunResult, error = false): string {
  if (error) return res.error ? `${res.error.line}:${res.error.column}` : 'brak błędu';
  return '';
}

/** Lista końców odcinków, zaokrąglona do 6 miejsc — wygodna do porównań. */
export function path(res: RunResult): number[][] {
  const out: number[][] = [];
  for (const s of res.segments) {
    if (out.length === 0) out.push(s.from.map(round));
    out.push(s.to.map(round));
  }
  return out;
}

function round(v: number): number {
  return Math.round(v * 1e6) / 1e6 + 0;
}
