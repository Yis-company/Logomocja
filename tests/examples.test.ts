import { expect, test } from 'bun:test';
import { EXAMPLES } from '../src/content/examples';
import { exec } from './helpers';

test('every standard example runs without error and draws something', () => {
  expect(EXAMPLES.length).toBeGreaterThan(0);
  for (const ex of EXAMPLES) {
    const r = exec(ex.source, ex.mode);
    expect({ id: ex.id, error: r.error }).toEqual({ id: ex.id, error: null });
    expect(r.segments.length).toBeGreaterThan(0);
  }
});
