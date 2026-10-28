import { describe, expect, test } from 'bun:test';
import { runSource } from '../src/logo';
import { EXAMPLES } from '../src/logo/examples';

describe('standard programs', () => {
  test('there are thirteen of them, with unique names', () => {
    expect(EXAMPLES.length).toBe(13);
    expect(new Set(EXAMPLES.map((e) => e.name)).size).toBe(13);
  });

  for (const ex of EXAMPLES) {
    test(`${ex.name} (${ex.mode}) runs without error and draws`, () => {
      const r = runSource(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }
});
