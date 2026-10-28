import { expect } from 'bun:test';
import { run } from '../src/lang/index';

export type Mode = '2d' | '3d';
export type Vec = [number, number, number];
export interface Seg {
  from: Vec;
  to: Vec;
  color: string;
  width: number;
}

export function exec(src: string, mode: Mode = '2d') {
  return run(src, mode) as unknown as {
    segments: Seg[];
    error: null | { message: string; line: number; column: number };
  };
}

/** Runs the program, asserts no error, returns segments. */
export function ok(src: string, mode: Mode = '2d'): Seg[] {
  const r = exec(src, mode);
  if (r.error !== null) {
    throw new Error(`unexpected error ${JSON.stringify(r.error)} for program:\n${src.slice(0, 300)}`);
  }
  return r.segments;
}

/** Runs the program, asserts an error with a non-empty message. */
export function fails(src: string, mode: Mode = '2d') {
  const r = exec(src, mode);
  expect(r.error).not.toBeNull();
  expect(typeof r.error!.message).toBe('string');
  expect(r.error!.message.length).toBeGreaterThan(0);
  return r;
}

/** Asserts error at line/column. */
export function failsAt(src: string, line: number, column: number, mode: Mode = '2d') {
  const r = fails(src, mode);
  expect({ line: r.error!.line, column: r.error!.column }).toEqual({ line, column });
  return r;
}

/** Asserts a parse-time error at line/column (nothing drawn). */
export function parseFailsAt(src: string, line: number, column: number, mode: Mode = '2d') {
  const r = failsAt(src, line, column, mode);
  expect(r.segments).toEqual([]);
  return r;
}

/** Asserts a parse-time error (nothing drawn), position not checked. */
export function parseFails(src: string, mode: Mode = '2d') {
  const r = fails(src, mode);
  expect(r.segments).toEqual([]);
  return r;
}

/** 1-based line/column of the n-th (1-based) occurrence of needle in src. */
export function at(src: string, needle: string, occurrence = 1): { line: number; column: number } {
  let idx = -1;
  for (let i = 0; i < occurrence; i++) {
    idx = src.indexOf(needle, idx + 1);
    if (idx < 0) throw new Error(`needle ${needle} not found`);
  }
  const before = src.slice(0, idx);
  const line = before.split('\n').length;
  const column = idx - before.lastIndexOf('\n');
  return { line, column };
}

export function failsAtNeedle(src: string, needle: string, occurrence = 1, mode: Mode = '2d') {
  const p = at(src, needle, occurrence);
  return failsAt(src, p.line, p.column, mode);
}

export function closeVec(actual: number[], expected: number[], digits = 6) {
  expect(actual.length).toBe(3);
  for (let i = 0; i < 3; i++) expect(actual[i]).toBeCloseTo(expected[i], digits);
}

export function closeSeg(s: Seg, from: number[], to: number[]) {
  closeVec(s.from, from);
  closeVec(s.to, to);
}

/** Signed Y-extent of each segment (for programs that only move along Y). */
export function dy(segs: Seg[]): number[] {
  return segs.map((s) => +(s.to[1] - s.from[1]).toFixed(9) + 0);
}

/** End point of the last segment. */
export function last(segs: Seg[]): Vec {
  expect(segs.length).toBeGreaterThan(0);
  return segs[segs.length - 1].to;
}
