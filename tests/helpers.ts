import { expect } from 'bun:test';
import { run, type RunResult } from '../src/logo';

export function ok(source: string, mode: '2d' | '3d' = '2d'): RunResult {
  const r = run(source, mode);
  expect(r.error).toBeNull();
  return r;
}

export function err(source: string, mode: '2d' | '3d' = '2d'): { message: string; line: number; column: number; segments: RunResult['segments'] } {
  const r = run(source, mode);
  expect(r.error).not.toBeNull();
  return { ...r.error!, segments: r.segments };
}

export function close(actual: number[], expected: number[], digits = 9): void {
  expect(actual.length).toBe(expected.length);
  for (let i = 0; i < actual.length; i++) {
    expect(actual[i]).toBeCloseTo(expected[i]!, digits);
  }
}
