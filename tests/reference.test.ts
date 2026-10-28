import { describe, expect, test } from 'bun:test';
import { REFERENCE, type RefExample } from '../src/data/reference';
import { runSource } from '../src/lang';

function examples(): Array<{ where: string; ex: RefExample }> {
  const out: Array<{ where: string; ex: RefExample }> = [];
  for (const s of REFERENCE) {
    for (const b of s.blocks) {
      if (b.t === 'example') out.push({ where: s.id, ex: b.example });
      if (b.t === 'commands') for (const c of b.items) out.push({ where: `${s.id}/${c.id}`, ex: c.example });
    }
  }
  return out;
}

describe('strona poleceń', () => {
  test('każde polecenie ma przykład, który działa we wskazanym trybie', () => {
    const list = examples();
    expect(list.length).toBeGreaterThan(20);
    for (const { where, ex } of list) {
      const r = runSource(ex.code, ex.mode);
      if (ex.fails) {
        expect({ where, failed: r.error !== null }).toEqual({ where, failed: true });
        expect(r.segments.length).toBeGreaterThan(0);
      } else {
        expect({ where, error: r.error }).toEqual({ where, error: null });
        expect(r.segments.length).toBeGreaterThan(0);
      }
    }
  });

  test('opisano wszystkie polecenia języka', () => {
    const documented = new Set<string>();
    for (const s of REFERENCE) for (const b of s.blocks) if (b.t === 'commands') for (const c of b.items) for (const n of c.names) documented.add(n);
    for (const w of ['np', 'ws', 'pw', 'lw', 'pod', 'opu', 'kolor', 'grubosc', 'powtorz', 'niech', 'jeśli', 'jeżeli', 'stop', 'dom', 'czyść', 'gora', 'dol', 'pp', 'pl', 'nrpowt']) {
      expect(documented.has(w)).toBe(true);
    }
  });
});
