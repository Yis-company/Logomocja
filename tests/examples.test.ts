import { describe, expect, test } from 'bun:test';
import { EXAMPLES } from '../src/data/examples';
import { runProgram } from '../src/lang';

describe('standard programs', () => {
  for (const ex of EXAMPLES) {
    test(`${ex.id} runs without error`, () => {
      const r = runProgram(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }

  test('2d examples draw the same in 3d mode', () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === '2d')) {
      expect(runProgram(ex.source, '3d').segments).toEqual(runProgram(ex.source, '2d').segments);
    }
  });

  test('kwadrat geometry', () => {
    const r = runProgram(EXAMPLES[0].source, '2d');
    expect(r.segments.map((s) => s.to)).toEqual([[0, 120, 0], [120, 120, 0], [120, 0, 0], [0, 0, 0]]);
    expect(r.segments[0]).toEqual({ from: [0, 0, 0], to: [0, 120, 0], color: '#16866a', width: 3 });
  });
});
