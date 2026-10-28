import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang';
import { EXAMPLES } from '../src/data/examples';

describe('standardowe programy', () => {
  test('jest trzynaście', () => expect(EXAMPLES.length).toBe(13));
  for (const ex of EXAMPLES) {
    test(`${ex.id} działa w trybie ${ex.mode}`, () => {
      const r = run(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(3);
    });
  }
  test('programy płaskie są takie same w 2D i 3D', () => {
    for (const ex of EXAMPLES.filter(e => e.mode === '2d')) {
      expect(run(ex.source, '3d')).toEqual(run(ex.source, '2d'));
    }
  });
  test('kwadrat ma współrzędne', () => {
    const r = run(EXAMPLES[0].source, '2d');
    expect(r.segments.map(s => s.to)).toEqual([[0, 120, 0], [120, 120, 0], [120, 0, 0], [0, 0, 0]]);
  });
  test('sześcian ma 17 odcinków w obrębie 100', () => {
    const r = run(EXAMPLES[8].source, '3d');
    expect(r.segments.length).toBe(17);
    for (const s of r.segments) for (const c of [...s.from, ...s.to]) {
      expect(c).toBeGreaterThan(-1e-9); expect(c).toBeLessThan(100 + 1e-9);
    }
  });
});
