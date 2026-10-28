export type Vec = [number, number, number];
export type Segment = { from: Vec; to: Vec; color: string; width: number };
export type Case = {
  name: string;
  mode: "2d" | "3d";
  source: string;
  /** An error, segments, or both: with both, the segments are what must be drawn before the error. */
  expect: { segments?: Segment[]; error?: { line: number; column?: number } };
  /** Time budget for `run` on this case, milliseconds; over budget fails the case. */
  budgetMs?: number;
};
export type Outcome = {
  segments: Segment[];
  error: null | { message: string; line: number; column: number };
};

const isVec = (v: unknown): v is Vec =>
  Array.isArray(v) && v.length === 3 && v.every((n) => typeof n === "number" && Number.isFinite(n));
const isSegment = (s: unknown): s is Segment => {
  const r = s as Record<string, unknown>;
  return !!r && isVec(r.from) && isVec(r.to) && typeof r.color === "string" && typeof r.width === "number";
};

/** Validates a suite file and returns its cases; throws with the first problem found. */
export function parseSuite(json: unknown): Case[] {
  const suite = json as { cases?: unknown[] };
  if (!suite || !Array.isArray(suite.cases)) throw new Error("suite has no cases array");
  return suite.cases.map((raw, i) => {
    const c = raw as Record<string, unknown>;
    const where = `case ${i} (${String(c?.name ?? "unnamed")})`;
    if (typeof c?.name !== "string" || typeof c.source !== "string") throw new Error(`${where}: name and source must be strings`);
    if (c.mode !== "2d" && c.mode !== "3d") throw new Error(`${where}: mode must be 2d or 3d`);
    const expect = c.expect as Record<string, unknown>;
    const error = expect?.error as Record<string, unknown> | undefined;
    const result: Case = { name: c.name, mode: c.mode, source: c.source, expect: {} };
    if (typeof c.budgetMs === "number" && c.budgetMs > 0) result.budgetMs = c.budgetMs;
    if (Array.isArray(expect?.segments)) {
      if (!expect.segments.every(isSegment)) throw new Error(`${where}: malformed expected segment`);
      result.expect.segments = expect.segments;
    }
    // An explicit `error: null` means the same as leaving it out.
    if (error !== undefined && error !== null) {
      if (typeof error?.line !== "number") throw new Error(`${where}: error.line must be a number`);
      result.expect.error = { line: error.line, ...(typeof error.column === "number" ? { column: error.column } : {}) };
    }
    if (!result.expect.segments && !result.expect.error)
      throw new Error(`${where}: expect must have segments or error.line`);
    return result;
  });
}

const close = (a: number, b: number, tolerance: number) => Math.abs(a - b) <= tolerance;
const vecClose = (a: Vec, b: Vec, tolerance: number) => a.every((n, i) => close(n, b[i], tolerance));
const fmt = (v: Vec) => `(${v.map((n) => +n.toFixed(4)).join(", ")})`;

/** Returns null when the outcome satisfies the case, otherwise the first mismatch. */
export function compareCase(c: Case, actual: Outcome, tolerance = 1e-4): string | null {
  if (c.expect.error) {
    if (!actual.error) return "expected an error, got none";
    if (actual.error.line !== c.expect.error.line)
      return `expected error on line ${c.expect.error.line}, got line ${actual.error.line}`;
    if (c.expect.error.column !== undefined && actual.error.column !== c.expect.error.column)
      return `expected error at column ${c.expect.error.column}, got ${actual.error.column}`;
  } else if (actual.error) return `unexpected error: line ${actual.error.line}: ${actual.error.message}`;
  const expected = c.expect.segments;
  if (!expected) return null;
  if (!Array.isArray(actual.segments)) return "no segments array";
  if (actual.segments.length !== expected.length)
    return `expected ${expected.length} segments, got ${actual.segments.length}`;
  for (const [i, want] of expected.entries()) {
    const got = actual.segments[i];
    if (!isSegment(got)) return `segment ${i} is malformed`;
    if (!vecClose(got.from, want.from, tolerance) || !vecClose(got.to, want.to, tolerance))
      return `segment ${i}: expected ${fmt(want.from)}→${fmt(want.to)}, got ${fmt(got.from)}→${fmt(got.to)}`;
    if (got.color.toLowerCase() !== want.color.toLowerCase())
      return `segment ${i}: expected colour ${want.color}, got ${got.color}`;
    if (!close(got.width, want.width, tolerance))
      return `segment ${i}: expected width ${want.width}, got ${got.width}`;
  }
  return null;
}
