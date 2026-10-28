import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang';
import { CHALLENGES } from '../src/data/challenges';
import { compareDrawings } from '../src/lib/check';
import { decodeSource, encodeSource, parseHash } from '../src/lib/share';

describe('wyzwania', () => {
  test('jest co najmniej pięć', () => expect(CHALLENGES.length).toBeGreaterThanOrEqual(5));
  for (const c of CHALLENGES) {
    test(`${c.id}: wzorzec przechodzi, pusty rysunek nie`, () => {
      const exp = run(c.solution, c.mode);
      expect(exp.error).toBeNull();
      expect(compareDrawings(exp.segments, exp.segments).ok).toBe(true);
      expect(compareDrawings([], exp.segments).ok).toBe(false);
    });
  }
  test('inny kształt nie przechodzi, równoważny tak', () => {
    const sq = run('powtorz 4 [np 100 pw 90]', '2d').segments;
    const alt = run('np 100 pw 90 np 100 pw 90 np 100 pw 90 np 100', '2d').segments;
    expect(compareDrawings(alt, sq).ok).toBe(true);
    const small = run('powtorz 4 [np 90 pw 90]', '2d').segments;
    expect(compareDrawings(small, sq).ok).toBe(false);
    const extra = run('powtorz 4 [np 100 pw 90] lw 90 np 50', '2d').segments;
    const r = compareDrawings(extra, sq);
    expect(r.ok).toBe(false);
    expect(r.reason.length).toBeGreaterThan(5);
    const circ = run('powtorz 360 [np 1 pw 1]', '2d').segments;
    const ch = CHALLENGES.find(c => c.id === 'okrag')!;
    const ref = run(ch.solution, '2d').segments;
    expect(compareDrawings(circ, ref, { tolerance: ch.tolerance }).ok).toBe(true);
  });
});

describe('udostępnianie', () => {
  test('kodowanie w obie strony', () => {
    const src = 'np 10 ; zażółć gęślą jaźń\n';
    expect(decodeSource(encodeSource(src))).toBe(src);
    expect(decodeSource('%%%')).toBeNull();
  });
  test('trasa', () => {
    const r = parseHash('#/?tryb=3d&kod=abc');
    expect(r.path).toBe('/');
    expect(r.params.get('tryb')).toBe('3d');
    expect(parseHash('#/instrukcja').path).toBe('/instrukcja');
  });
});

import { COMMAND_DOCS, SECTIONS } from '../src/data/reference';
import { COMMANDS } from '../src/lang';

describe('instrukcja', () => {
  test('każdy przykład działa', () => {
    for (const d of COMMAND_DOCS) {
      const r = run(d.example, d.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    }
    for (const s of SECTIONS) for (const e of s.examples ?? []) {
      expect(run(e.code, e.mode).error).toBeNull();
    }
  });
  test('wszystkie aliasy są udokumentowane', () => {
    const docs = new Set(COMMAND_DOCS.flatMap(d => [...d.polish, ...d.english]));
    for (const a of COMMANDS.keys()) expect(docs.has(a)).toBe(true);
  });
});
