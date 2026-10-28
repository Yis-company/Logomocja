import { describe, expect, test } from 'bun:test';
import { CHALLENGES, checkChallenge, findChallenge } from '../src/content/challenges';
import { compareDrawings } from '../src/lang/compare';
import { run } from '../src/lang/interpreter';

describe('wyzwania', () => {
  test('jest co najmniej pięć wyzwań, z unikalnymi identyfikatorami', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
  });

  for (const c of CHALLENGES) {
    test(`${c.id}: wzorzec przechodzi, szkielet nie`, () => {
      expect(checkChallenge(c, c.solution).ok).toBe(true);
      expect(checkChallenge(c, c.starter).ok).toBe(false);
    });
  }

  test('kolejność i podział odcinków nie mają znaczenia', () => {
    const tri = findChallenge('trojkat')!;
    expect(checkChallenge(tri, 'powtorz 3 [np 50 np 50 pw 120]').ok).toBe(true);
    expect(checkChallenge(tri, 'pw 60 np 100 lw 120 np 100 lw 120 np 100').ok).toBe(true);
  });

  test('lustrzane odbicie nie przechodzi, z powodem', () => {
    const r = checkChallenge(findChallenge('trojkat')!, 'powtorz 3 [np 100 lw 120]');
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/brakuje|linia/);
  });

  test('wymagania i kolory', () => {
    expect(checkChallenge(findChallenge('schodki')!, 'np 30 pw 90 np 30 lw 90 np 30 pw 90 np 30 lw 90 np 30 pw 90 np 30 lw 90 np 30 pw 90 np 30').message).toMatch(/powtórz/);
    const kk = findChallenge('kolorowy-kwadrat')!;
    expect(checkChallenge(kk, 'powtorz 4 [np 80 pw 90]').message).toMatch(/kolor/);
    expect(checkChallenge(findChallenge('szesciokat')!, 'powtorz 6 [np 50 pw 60]').message).toMatch(/procedur/);
  });

  test('błąd programu jest powodem porażki', () => {
    const r = checkChallenge(findChallenge('trojkat')!, 'np 100 xyz');
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/wierszu 1/);
  });

  test('dodatkowa linia jest wykrywana', () => {
    const r = checkChallenge(findChallenge('trojkat')!, 'powtorz 3 [np 100 pw 120] ws 40');
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/linia/);
  });

  test('porównanie w 3D', () => {
    const a = run('gora 90 np 50', '3d').segments;
    const b = run('gora 90 np 50 ws 50', '3d').segments;
    expect(compareDrawings(a, b).ok).toBe(true);
    expect(compareDrawings(a, run('np 50', '3d').segments).ok).toBe(false);
  });
});
