import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang/index';
import { EXAMPLES, isDisposable } from '../src/examples';
import { CHALLENGES, checkChallenge } from '../src/challenges';

const EXPECTED: Record<string, { mode: '2d' | '3d'; segments: number }> = {
  kwadrat: { mode: '2d', segments: 4 },
  gwiazda: { mode: '2d', segments: 5 },
  rozeta: { mode: '2d', segments: 48 },
  spirala: { mode: '2d', segments: 90 },
  wielokaty: { mode: '2d', segments: 42 },
  drzewo: { mode: '2d', segments: 255 },
  sniezynka: { mode: '2d', segments: 768 },
  schody: { mode: '3d', segments: 12 },
  szescian: { mode: '3d', segments: 17 },
  pierscien: { mode: '3d', segments: 36 },
  kula: { mode: '3d', segments: 432 },
  helisa: { mode: '3d', segments: 240 },
  drzewo3d: { mode: '3d', segments: 121 },
};

describe('standard programs', () => {
  test('all thirteen ship under their names and modes', () => {
    expect(EXAMPLES.map((e) => e.id)).toEqual(Object.keys(EXPECTED));
    for (const e of EXAMPLES) expect(e.mode).toBe(EXPECTED[e.id].mode);
  });

  for (const e of EXAMPLES) {
    test(`${e.id} runs without errors`, () => {
      const r = run(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments).toHaveLength(EXPECTED[e.id].segments);
    });
  }

  test('flat examples draw the same in 2D and 3D', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '2d')) expect(run(e.source, '3d')).toEqual(run(e.source, '2d'));
  });

  test('3D examples use pitch or roll and fail in 2D', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '3d')) expect(run(e.source, '2d').error).not.toBeNull();
  });

  test('kwadrat closes, schody climbs, szescian is a cube', () => {
    const k = run(EXAMPLES[0].source, '2d').segments;
    expect(k[3].to).toEqual([0, 0, 0]);
    const s = run(EXAMPLES.find((e) => e.id === 'schody')!.source, '3d').segments;
    expect(s[s.length - 1].to).toEqual([0, 210, 120]);
    const c = run(EXAMPLES.find((e) => e.id === 'szescian')!.source, '3d').segments;
    const pts = c.flatMap((x) => [x.from, x.to]).map((p) => p.map((v) => Math.round(v)).join(','));
    expect(new Set(pts).size).toBe(8);
  });

  test('unedited examples are disposable drafts; edited ones are not', () => {
    expect(isDisposable(EXAMPLES[2].source)).toBe(true);
    expect(isDisposable('')).toBe(true);
    expect(isDisposable(EXAMPLES[2].source + '\nnp 1')).toBe(false);
  });
});

describe('challenges', () => {
  test('at least five', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  });

  for (const c of CHALLENGES) {
    test(`${c.id}: the reference solution passes and the starter does not`, () => {
      expect(checkChallenge(c, c.solution).pass).toBe(true);
      expect(checkChallenge(c, c.starter).pass).toBe(false);
    });
  }

  const tri = CHALLENGES.find((c) => c.id === 'trojkat')!;
  test('position and mirror image do not matter; size and shape do', () => {
    expect(checkChallenge(tri, 'pod np 40 pw 90 np 25 lw 90 opu\npowtorz 3 [np 100 pw 120]').pass).toBe(true);
    expect(checkChallenge(tri, 'powtorz 3 [np 100 lw 120]').pass).toBe(true);
    expect(checkChallenge(tri, 'powtorz 3 [np 50 np 50 pw 120]').pass).toBe(true);
    const bigger = checkChallenge(tri, 'powtorz 3 [np 110 pw 120]');
    expect(bigger.pass).toBe(false);
    expect(bigger.title).toBe('Inny rozmiar');
    expect(checkChallenge(tri, 'powtorz 4 [np 100 pw 90]').pass).toBe(false);
    expect(checkChallenge(tri, 'powtorz 3 [np 100 pw 120] pw 30 np 40').title).toBe('Kształt się różni');
  });

  test('errors and empty drawings fail with a reason', () => {
    const e = checkChallenge(tri, 'np');
    expect(e.pass).toBe(false);
    expect(e.reason).toMatch(/Wiersz 1/);
    expect(checkChallenge(tri, 'pod np 10').title).toBe('Nic nie narysowano');
  });

  test('requirements and colours are checked', () => {
    const stairs = CHALLENGES.find((c) => c.id === 'schodki')!;
    const unrolled = 'np 30 pw 90 np 30 lw 90 '.repeat(5);
    const r = checkChallenge(stairs, unrolled);
    expect(r.pass).toBe(false);
    expect(r.reason).toMatch(/powtórz/);
    const hex = CHALLENGES.find((c) => c.id === 'szesciokat')!;
    expect(checkChallenge(hex, 'powtorz 6 [np 60 pw 60]').pass).toBe(false);
    const star = CHALLENGES.find((c) => c.id === 'gwiazda8')!;
    expect(checkChallenge(star, 'powtorz 8 [np 120 pw 135]').title).toBe('Kolory się nie zgadzają');
  });
});
