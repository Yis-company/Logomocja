import { describe, expect, test } from 'bun:test';
import { EXAMPLES } from '../src/data/examples';
import { COMMAND_DOCS, SECTIONS } from '../src/data/reference';
import { COMMANDS } from '../src/lang/keywords';
import { runProgram } from '../src/lang';
import { readFileSync } from 'node:fs';

describe('dokumentacja', () => {
  test('każdy przykład z opisu poleceń działa w swoim trybie', () => {
    for (const d of COMMAND_DOCS) {
      const r = runProgram(d.example.code, d.example.mode);
      expect({ id: d.id, error: r.error }).toEqual({ id: d.id, error: null });
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });
  test('przykłady w sekcjach działają', () => {
    for (const s of SECTIONS) {
      for (const b of s.blocks) {
        if (b.t !== 'code') continue;
        const r = runProgram(b.code, b.mode);
        expect({ section: s.id, error: r.error }).toEqual({ section: s.id, error: null });
      }
    }
  });
  test('opisano wszystkie polecenia i ich aliasy', () => {
    const documented = new Set(COMMAND_DOCS.flatMap((d) => [...d.polish, ...d.english]));
    for (const c of COMMANDS) {
      for (const w of [...c.polish, ...c.english]) expect(documented.has(w)).toBe(true);
    }
  });
});

describe('standardowe programy', () => {
  test('jest trzynaście i zgadzają się z plikami', () => {
    expect(EXAMPLES.length).toBe(13);
    for (const e of EXAMPLES) {
      const file = readFileSync(new URL(`../examples/${e.id}.logo`, import.meta.url), 'utf8');
      expect(e.source).toBe(file);
      const r = runProgram(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });
  test('tryby', () => {
    const modes = Object.fromEntries(EXAMPLES.map((e) => [e.id, e.mode]));
    expect(modes).toEqual({
      kwadrat: '2d', gwiazda: '2d', rozeta: '2d', spirala: '2d', wielokaty: '2d', drzewo: '2d', sniezynka: '2d',
      schody: '3d', szescian: '3d', pierscien: '3d', kula: '3d', helisa: '3d', drzewo3d: '3d',
    });
  });
  test('programy z 2D działają identycznie w 3D', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '2d')) {
      expect(runProgram(e.source, '3d').segments).toEqual(runProgram(e.source, '2d').segments);
    }
  });
});
