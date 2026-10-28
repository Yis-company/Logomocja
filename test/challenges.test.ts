import { describe, expect, test } from 'bun:test';
import { CHALLENGES, checkChallenge, targetSegments } from '../src/data/challenges';
import { runProgram } from '../src/lang';

describe('wyzwania', () => {
  test('jest co najmniej pięć wyzwań o unikalnych identyfikatorach', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
  });
  for (const c of CHALLENGES) {
    test(`${c.id}: wzorcowe rozwiązanie przechodzi, szablon nie`, () => {
      const target = runProgram(c.solution, c.mode);
      expect(target.error).toBeNull();
      expect(target.segments.length).toBeGreaterThan(0);
      const ok = checkChallenge(c, c.solution);
      expect(ok.reason).toBe('Rysunek zgadza się ze wzorem.');
      expect(ok.pass).toBe(true);
      const empty = checkChallenge(c, c.starter);
      expect(empty.pass).toBe(false);
    });
  }
  test('rysunek z błędnymi proporcjami nie przechodzi', () => {
    const c = CHALLENGES.find((x) => x.id === 'kwadrat-100')!;
    expect(checkChallenge(c, 'powtorz 4 [np 90 pw 90]').pass).toBe(false);
    expect(checkChallenge(c, 'powtorz 4 [np 100 lw 90]').pass).toBe(false);
    expect(checkChallenge(c, 'powtorz 4 [np 100 pw 90] lw 90 np 50').pass).toBe(false);
    expect(checkChallenge(c, 'powtorz 3 [np 100 pw 90]').pass).toBe(false);
    // inna kolejność i podział na odcinki są w porządku
    expect(checkChallenge(c, 'np 50 np 50 pw 90 np 100 pw 90 np 100 pw 90 np 100').pass).toBe(true);
  });
  test('wymagania: powtórz i procedura, błędy programu', () => {
    const tri = CHALLENGES.find((x) => x.id === 'trojkat')!;
    const r = checkChallenge(tri, 'np 120 pw 120 np 120 pw 120 np 120 pw 120');
    expect(r.pass).toBe(false);
    expect(r.reason).toContain('powtórz');
    const house = CHALLENGES.find((x) => x.id === 'domek')!;
    const noProc = checkChallenge(house, 'powtorz 4 [np 100 pw 90] np 100 pw 90 lw 60 powtorz 3 [np 100 pw 120]');
    expect(noProc.pass).toBe(false);
    expect(noProc.reason).toContain('procedur');
    const bad = checkChallenge(tri, 'np');
    expect(bad.programError).toBe(true);
  });
  test('kolory są sprawdzane', () => {
    const c = CHALLENGES.find((x) => x.id === 'dwa-kolory')!;
    const wrong = checkChallenge(c, 'kolor "#c1763d" powtorz 4 [np 100 pw 90]');
    expect(wrong.pass).toBe(false);
    expect(wrong.reason).toContain('kolor');
  });
  test('cel jest dostępny', () => {
    for (const c of CHALLENGES) expect(targetSegments(c).length).toBeGreaterThan(0);
  });
});
