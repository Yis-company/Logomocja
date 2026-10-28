import { describe, expect, test } from 'bun:test';
import { CHALLENGES } from '../src/data/challenges';
import { compareDrawings } from '../src/lang/check';
import { runProgram } from '../src/lang';

describe('challenge checker', () => {
  for (const c of CHALLENGES) {
    test(`${c.id}: reference solves itself`, () => {
      const ref = runProgram(c.reference, c.mode);
      expect(ref.error).toBeNull();
      expect(compareDrawings(ref.segments, ref.segments).ok).toBe(true);
    });
  }
  test('different drawing fails with a reason', () => {
    const ref = runProgram('powtorz 4 [np 100 pw 90]', '2d').segments;
    const wrong = runProgram('powtorz 4 [np 90 pw 90]', '2d').segments;
    const r = compareDrawings(ref, wrong);
    expect(r.ok).toBe(false);
    expect(r.reason.length).toBeGreaterThan(10);
    expect(compareDrawings(ref, []).ok).toBe(false);
  });
  test('equivalent drawings pass regardless of colour, order and splitting', () => {
    const ref = runProgram('powtorz 4 [np 100 pw 90]', '2d').segments;
    const alt = runProgram('kolor "#ff0000" grubosc 5 np 50 np 50 pw 90 powtorz 3 [np 100 pw 90]', '2d').segments;
    expect(compareDrawings(ref, alt).ok).toBe(true);
  });
  test('small numeric noise is tolerated', () => {
    const ref = runProgram('powtorz 36 [np 10 pw 10]', '2d').segments;
    const alt = runProgram('powtorz 36 [np 10.01 pw 10]', '2d').segments;
    expect(compareDrawings(ref, alt).ok).toBe(true);
  });
});
