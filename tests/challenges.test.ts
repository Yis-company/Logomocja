import { describe, expect, test } from 'bun:test';
import { CHALLENGES, checkChallenge, targetOf, findChallenge } from '../src/challenges';

describe('challenges', () => {
  test('at least five, unique ids, every target draws', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
    for (const c of CHALLENGES) expect(targetOf(c).length).toBeGreaterThan(0);
  });

  for (const c of CHALLENGES) {
    test(`${c.id}: the reference solution passes`, () => {
      const r = checkChallenge(c, c.solution);
      expect(r.reason).toBeString();
      expect(r.passed).toBe(true);
    });
  }

  test('a different way to draw the same square passes', () => {
    const c = findChallenge('kwadrat-100')!;
    expect(checkChallenge(c, 'np 100 pw 90 np 100 pw 90 np 100 pw 90 np 100').passed).toBe(true);
    expect(checkChallenge(c, 'np 50 np 50 pw 90 np 100 pw 90 np 100 pw 90 np 100').passed).toBe(true);
  });

  test('turning left (a mirror image) and starting elsewhere pass', () => {
    const c = findChallenge('kwadrat-100')!;
    const left = checkChallenge(c, 'powtorz 4 [np 100 lw 90]');
    expect(left.passed).toBe(true);
    const moved = checkChallenge(c, 'pod np 40 pw 90 np 25 lw 90 opu powtorz 4 [np 100 pw 90]');
    expect(moved.passed).toBe(true);
    expect(moved.reason).toContain('innym miejscu');
  });

  test('a wrong size fails with a reason and the mismatched parts', () => {
    const c = findChallenge('kwadrat-100')!;
    const r = checkChallenge(c, 'powtorz 4 [np 90 pw 90]');
    expect(r.passed).toBe(false);
    expect(r.reason).toContain('Sprawdź');
    expect(r.missing.length + r.extra.length).toBeGreaterThan(0);
  });

  test('a missing side fails', () => {
    const c = findChallenge('kwadrat-100')!;
    const r = checkChallenge(c, 'powtorz 3 [np 100 pw 90]');
    expect(r.passed).toBe(false);
    expect(r.missing.length).toBeGreaterThan(0);
  });

  test('errors and empty drawings fail with a message', () => {
    const c = findChallenge('kwadrat-100')!;
    const e = checkChallenge(c, 'np');
    expect(e.passed).toBe(false);
    expect(e.error).not.toBeNull();
    expect(checkChallenge(c, 'pw 90').passed).toBe(false);
  });

  test('colour and width are checked when the task asks', () => {
    const c = findChallenge('szesciokat')!;
    const r = checkChallenge(c, 'grubosc 4 powtorz 6 [np 60 pw 60]');
    expect(r.passed).toBe(false);
    expect(r.reason).toContain('kolor');
    const w = checkChallenge(c, 'kolor "#2b6fb3" powtorz 6 [np 60 pw 60]');
    expect(w.passed).toBe(false);
    expect(w.reason).toContain('grubość');
  });

  test('requirements are enforced', () => {
    const tri = findChallenge('trojkat')!;
    const r = checkChallenge(tri, 'np 120 pw 120 np 120 pw 120 np 120');
    expect(r.passed).toBe(false);
    expect(r.reason).toContain('powtórz');
    const proc = findChallenge('prostokaty')!;
    expect(checkChallenge(proc, 'powtorz 2 [np 80 pw 90 np 40 pw 90]\npowtorz 2 [np 40 pw 90 np 80 pw 90]').passed).toBe(false);
    const spiral = findChallenge('spirala-kwadratowa')!;
    expect(checkChallenge(spiral, 'niech d 5\npowtorz 20 [np d pw 90 niech d d + 5]').passed).toBe(true);
  });

  test('3D tasks', () => {
    const sq = findChallenge('pionowy-kwadrat')!;
    expect(checkChallenge(sq, 'powtorz 4 [np 80 pw 90]').passed).toBe(false);
    expect(checkChallenge(sq, 'gora 90 powtorz 4 [np 80 lw 90]').passed).toBe(true);
  });
});
