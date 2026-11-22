// The same complexity and defect findings as the TypeScript fixture, without types.
export function grade(n) {
  return n > 2 ? "high" : n > 1 ? "mid" : "low";
}

export function deep(rows) {
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
