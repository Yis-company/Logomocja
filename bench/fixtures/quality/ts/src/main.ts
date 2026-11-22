// Known q1 findings: complexity 2 (nested ternary, depth 4), defects 1 (debugger), types 2 (any, unexplained `as`).
export function grade(n: number) {
  return n > 2 ? "high" : n > 1 ? "mid" : "low";
}

export function deep(rows: number[][]) {
  for (const row of rows) {
    if (row.length) {
      for (const cell of row) {
        if (cell) {
          debugger;
        }
      }
    }
  }
}

export const loose = (value: any) => value as string;
