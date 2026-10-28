import { describe, expect, test } from 'bun:test';
import { REFERENCE } from '../src/content/reference';
import { COMMAND_ALIASES } from '../src/lang/keywords';
import { run } from '../src/lang/interpreter';

describe('dokumentacja', () => {
  const docs = REFERENCE.flatMap((s) => (s.commands ?? []).map((c) => ({ ...c, section: s.id })));

  test('każde polecenie i każdy alias jest opisany', () => {
    const documented = new Set(docs.flatMap((c) => [...c.names, ...c.english]));
    for (const aliases of Object.values(COMMAND_ALIASES)) for (const a of aliases) expect(documented.has(a)).toBe(true);
  });

  for (const c of docs) {
    test(`przykład polecenia ${c.names[0]} działa`, () => {
      const mode = c.mode ?? (c.section === 'przestrzen' ? '3d' : '2d');
      const r = run(c.example, mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }

  test('przykłady w tekście działają', () => {
    for (const s of REFERENCE) {
      for (const b of s.blocks ?? []) {
        if ('code' in b) expect(run(b.code, b.mode ?? (s.id === 'przestrzen' ? '3d' : '2d')).error).toBeNull();
      }
    }
  });
});
