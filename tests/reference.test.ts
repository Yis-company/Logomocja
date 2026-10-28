import { describe, expect, test } from 'bun:test';
import { REFERENCE } from '../src/data/reference';
import { runProgram } from '../src/lang';

describe('command reference examples', () => {
  for (const s of REFERENCE) {
    const all = [...(s.commands ?? []).map((c) => c.example), ...(s.examples ?? [])];
    all.forEach((ex, i) => {
      test(`${s.id} #${i + 1}`, () => {
        const r = runProgram(ex.code, ex.mode);
        if (ex.error) expect(r.error).not.toBeNull();
        else expect(r.error).toBeNull();
      });
    });
  }
  test('reference covers every command alias', async () => {
    const { COMMANDS } = await import('../src/lang/keywords');
    const text = JSON.stringify(REFERENCE).toLowerCase();
    for (const name of COMMANDS.keys()) expect(text).toContain(name);
  });
});
