import { describe, expect, test } from 'bun:test';
import { CHALLENGES, checkChallenge, expectedDrawing } from '../src/data/challenges';
import { checkDrawing } from '../src/data/check';
import { runSource } from '../src/lang';

const get = (id: string) => CHALLENGES.find((c) => c.id === id)!;
const solve = (id: string, src: string) => {
  const c = get(id);
  const r = runSource(src, c.mode);
  expect(r.error).toBeNull();
  return checkChallenge(c, r.segments);
};

describe('wyzwania', () => {
  test('jest co najmniej pięć, z unikalnymi identyfikatorami, w obu trybach', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
    expect(CHALLENGES.some((c) => c.mode === '2d')).toBe(true);
    expect(CHALLENGES.some((c) => c.mode === '3d')).toBe(true);
  });

  test('rozwiązanie wzorcowe przechodzi, a szablon startowy nie', () => {
    for (const c of CHALLENGES) {
      const sol = runSource(c.solution, c.mode);
      expect({ id: c.id, err: sol.error }).toEqual({ id: c.id, err: null });
      expect(expectedDrawing(c).length).toBeGreaterThan(0);
      const ok = checkChallenge(c, sol.segments);
      expect({ id: c.id, ok: ok.ok }).toEqual({ id: c.id, ok: true });
      const start = runSource(c.starter, c.mode);
      expect(start.error).toBeNull();
      const bad = checkChallenge(c, start.segments);
      expect(bad.ok).toBe(false);
      expect(bad.reason.length).toBeGreaterThan(5);
    }
  });

  test('inne poprawne rozwiązania są akceptowane (kolejność, kierunek, podział odcinków)', () => {
    expect(solve('kwadrat-100', 'np 100 pw 90 np 100 pw 90 np 50 np 50 pw 90 np 100 pw 90').ok).toBe(true);
    expect(solve('kwadrat-100', 'pw 90 np 100 lw 90 np 100 lw 90 np 100 lw 90 np 100').ok).toBe(true); // ten sam kwadrat, przeciwny kierunek obiegu
    expect(solve('kwadrat-100', 'powtorz 4 [np 100 lw 90]').ok).toBe(false); // lustrzane odbicie: kwadrat po lewej stronie
    expect(solve('kwadrat-100', 'powtorz 4 [np 100 pw 90] kolor "#ff0000" grubosc 8').ok).toBe(true); // kolor i grubość nie mają znaczenia
    expect(solve('okrag', 'powtorz 72 [np 5 pw 5]').ok).toBe(true);
    expect(solve('okrag', 'powtorz 36 [np 10 pw 10]').ok).toBe(true);
    expect(solve('trzy-kwadraty', 'oto k ma: x\n powtorz 4 [np x pw 90]\njuż\nk 50 pod pw 90 np 70 lw 90 opu k 50 pod pw 90 np 70 lw 90 opu k 50').ok).toBe(true);
    expect(solve('osie-3d', 'pod opu gora 90 np 100 ws 100 dol 90 pw 90 np 100 ws 100 lw 90 np 100 ws 100').ok).toBe(true);
  });

  test('błędne rysunki są odrzucane z powodem', () => {
    const wrongSize = solve('kwadrat-100', 'powtorz 4 [np 90 pw 90]');
    expect(wrongSize.ok).toBe(false);
    expect(wrongSize.reason).toMatch(/Brakuje|poza wzorem|inaczej/);
    expect(solve('trojkat', 'powtorz 4 [np 120 pw 90]').ok).toBe(false);
    expect(solve('szesciokat', 'powtorz 5 [np 80 pw 72]').ok).toBe(false);
    expect(solve('gwiazda-5', 'powtorz 5 [np 150 pw 72]').ok).toBe(false);
    const extra = solve('kwadrat-100', 'powtorz 4 [np 100 pw 90] pw 45 np 60');
    expect(extra.ok).toBe(false);
    expect(extra.reason).toContain('poza wzorem');
    expect(solve('trzy-kwadraty', 'powtorz 3 [powtorz 4 [np 50 pw 90] pw 90 np 70 lw 90]').ok).toBe(false); // linie łączące
    expect(solve('okrag-pion', 'powtorz 36 [np 10 pw 10]').ok).toBe(false); // okrąg poziomy
    expect(solve('szescian-80', 'powtorz 4 [np 80 pw 90]').ok).toBe(false);
  });

  test('poprawny kształt w złym ułożeniu dostaje wskazówkę, co jest nie tak', () => {
    const mirrored = solve('kwadrat-100', 'powtorz 4 [np 100 lw 90]');
    expect(mirrored.ok).toBe(false);
    expect(mirrored.reason).toContain('odbity');
    const rotated = solve('gwiazda-5', 'pw 90 powtorz 5 [np 150 pw 144]');
    expect(rotated.ok).toBe(false);
    expect(rotated.reason).toMatch(/obrócony o \d+°/);
    const moved = solve('szesciokat', 'pod np 40 opu powtorz 6 [np 80 pw 60]');
    expect(moved.ok).toBe(false);
    expect(moved.reason).toContain('innym miejscu');
    expect(solve('szesciokat', 'powtorz 5 [np 80 pw 72]').reason).not.toContain('odbity');
  });

  test('kolor ma znaczenie tylko tam, gdzie go wymagamy', () => {
    const exp = runSource('kolor "#ff0000" np 100', '2d').segments;
    const green = runSource('kolor "#00ff00" np 100', '2d').segments;
    expect(checkDrawing(green, exp).ok).toBe(true);
    const r = checkDrawing(green, exp, { colorMatters: true });
    expect(r.ok).toBe(false);
    expect(r.reason).toContain('kolor');
  });

  test('wydajność: duże rysunki sprawdzają się szybko', () => {
    const big = runSource('powtorz 4000 [np 5 pw 3]', '2d');
    const t0 = performance.now();
    checkDrawing(big.segments, big.segments);
    expect(performance.now() - t0).toBeLessThan(2000);
  });
});
