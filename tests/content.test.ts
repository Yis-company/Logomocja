import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang/index';
import { REFERENCE } from '../src/content/reference';
import { CHALLENGES } from '../src/content/challenges';
import { checkChallenge, compareDrawings, expectedDrawing } from '../src/content/checker';
import { decodeProgram, encodeProgram } from '../src/ui/share';
import type { Segment } from '../src/lang/index';

describe('dokumentacja', () => {
  const examples = REFERENCE.flatMap((s) => [
    ...(s.examples ?? []).map((e, i) => ({ name: `${s.id}#${i}`, ex: e })),
    ...s.entries.filter((e) => e.example).map((e) => ({ name: e.id, ex: e.example! })),
  ]);

  test('ma przykłady', () => {
    expect(examples.length).toBeGreaterThan(20);
  });

  for (const { name, ex } of examples) {
    test(`przykład „${name}” działa bez błędu i coś rysuje`, () => {
      const r = run(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }

  test('identyfikatory są unikalne', () => {
    const ids = REFERENCE.flatMap((s) => [s.id, ...s.entries.map((e) => e.id)]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('wyzwania', () => {
  test('jest co najmniej pięć wyzwań', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
  });

  for (const ch of CHALLENGES) {
    test(`„${ch.id}”: wzorcowe rozwiązanie przechodzi, szkic startowy nie`, () => {
      expect(expectedDrawing(ch).length).toBeGreaterThan(0);
      expect(checkChallenge(ch, ch.solution).pass).toBe(true);
      expect(checkChallenge(ch, ch.starter).pass).toBe(false);
    });
  }

  const tri = CHALLENGES.find((c) => c.id === 'trojkat')!;

  test('położenie startu nie ma znaczenia', () => {
    expect(checkChallenge(tri, 'pod np 37 pw 90 np 12 lw 90 opu\npowtorz 3 [np 100 pw 120]').pass).toBe(true);
  });

  test('kolejność i podział odcinków nie mają znaczenia', () => {
    expect(checkChallenge(tri, 'pw 60 np 100 lw 120 np 100 lw 120 np 50 np 50').pass).toBe(true);
  });

  test('zły rozmiar, lustrzane odbicie i błąd są odrzucane z powodem', () => {
    const small = checkChallenge(tri, 'powtorz 3 [np 90 pw 120]');
    expect(small.pass).toBe(false);
    expect(small.reason).toContain('Rozmiar');
    const mirror = checkChallenge(tri, 'powtorz 3 [np 100 lw 120]');
    expect(mirror.pass).toBe(false);
    expect(mirror.reason).toContain('lustrzanym');
    const broken = checkChallenge(tri, 'powtorz 3 [np 100 pw 120');
    expect(broken.pass).toBe(false);
    expect(broken.reason).toContain('wiersz 1');
  });

  test('brakujący fragment jest wykrywany', () => {
    const r = checkChallenge(tri, 'np 100 pw 120 np 100 pw 120 np 60');
    expect(r.pass).toBe(false);
  });

  test('wymagania: powtórz i procedura', () => {
    const hex = CHALLENGES.find((c) => c.id === 'szesciokat')!;
    const flat = Array.from({ length: 6 }, () => 'np 60 pw 60').join(' ');
    expect(checkChallenge(hex, flat).pass).toBe(false);
    const wind = CHALLENGES.find((c) => c.id === 'wiatraczek')!;
    const noProc = 'powtorz 8 [powtorz 4 [np 70 pw 90] pw 45]';
    expect(checkChallenge(wind, noProc).pass).toBe(false);
  });

  test('porównanie działa w 3D', () => {
    const seg = (a: number[], b: number[]): Segment => ({ from: a as Segment['from'], to: b as Segment['to'], color: '#000000', width: 1 });
    const cube = [seg([0, 0, 0], [0, 0, 50])];
    expect(compareDrawings([seg([5, 5, 50], [5, 5, 0])], cube, '3d').pass).toBe(true);
    expect(compareDrawings([seg([0, 0, 0], [0, 50, 0])], cube, '3d').pass).toBe(false);
  });
});

describe('odnośniki', () => {
  test('program przechodzi przez kodowanie bez zmian', async () => {
    const src = '; zażółć gęślą jaźń\noto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\nkwadrat 80\n';
    const payload = await encodeProgram(src);
    expect(payload).toMatch(/^[tz][A-Za-z0-9_-]*$/);
    expect(await decodeProgram(payload)).toBe(src);
  });

  test('uszkodzony odnośnik daje null', async () => {
    expect(await decodeProgram('z@@@')).toBeNull();
    expect(await decodeProgram('x123')).toBeNull();
  });
});
