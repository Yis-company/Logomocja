import { describe, expect, test } from 'bun:test';
import { EXAMPLES } from '../src/content/examples';
import { CHALLENGES, checkDrawing } from '../src/content/challenges';
import { REF_COMMANDS } from '../src/content/reference';
import { highlightSource } from '../src/lang/highlight';
import { runSource, COMMANDS } from '../src/lang/index';
import { decodeProgram, encodeProgram } from '../src/ui/share';

describe('standard programs', () => {
  test('there are exactly the thirteen programs with their names and modes', () => {
    expect(EXAMPLES.map((e) => [e.name, e.mode])).toEqual([
      ['kwadrat', '2d'],
      ['gwiazda', '2d'],
      ['rozeta', '2d'],
      ['spirala', '2d'],
      ['wielokaty', '2d'],
      ['drzewo', '2d'],
      ['sniezynka', '2d'],
      ['schody', '3d'],
      ['szescian', '3d'],
      ['pierscien', '3d'],
      ['kula', '3d'],
      ['helisa', '3d'],
      ['drzewo3d', '3d'],
    ]);
  });

  test('every standard program runs without error in its mode', () => {
    for (const ex of EXAMPLES) {
      const r = runSource(ex.source, ex.mode);
      expect({ name: ex.name, error: r.error }).toEqual({ name: ex.name, error: null });
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });

  test('kwadrat draws a closed square of side 120', () => {
    const { segments } = runSource(EXAMPLES[0]!.source, '2d');
    expect(segments).toHaveLength(4);
    expect(segments.map((s) => Math.round(Math.hypot(s.to[0] - s.from[0], s.to[1] - s.from[1])))).toEqual([120, 120, 120, 120]);
    expect(segments[3]!.to).toEqual([0, 0, 0]);
  });

  test('the drzewo example ends with the tail calls of the specification', () => {
    expect(EXAMPLES[5]!.source.endsWith('już\n\npod ws 120 opu\ngałąź 90\n')).toBe(true);
  });
});

describe('reference examples', () => {
  test('each documented command example runs in its mode', () => {
    for (const c of REF_COMMANDS) {
      const r = runSource(c.example, c.mode);
      expect({ names: c.names, error: r.error }).toEqual({ names: c.names, error: null });
    }
  });

  test('every language command is documented', () => {
    const documented = REF_COMMANDS.map((c) => c.names).join(',');
    for (const def of COMMANDS) {
      expect(documented).toContain(def.names[0]!);
    }
  });
});

describe('challenges', () => {
  test('each reference solution passes its own check', () => {
    for (const c of CHALLENGES) {
      const r = runSource(c.solution, c.mode);
      expect({ id: c.id, result: checkDrawing(c, r.segments).ok }).toEqual({ id: c.id, result: true });
    }
  });

  test('a wrong drawing fails with a reason', () => {
    const c = CHALLENGES[0]!;
    const r = checkDrawing(c, runSource('powtorz 4 [np 100 pw 80]', '2d').segments);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain('Brakuje');
  });

  test('an empty drawing and a wrong colour fail', () => {
    const c = CHALLENGES.find((x) => x.id === 'przerywana')!;
    expect(checkDrawing(c, []).ok).toBe(false);
    const wrong = runSource(c.solution.replace('#c1763d', '#16866a'), '2d').segments;
    expect(checkDrawing(c, wrong).ok).toBe(false);
  });

  test('a different order or split of the same lines still passes', () => {
    const c = CHALLENGES[0]!;
    const split = runSource('powtorz 8 [np 50 pw 45 pw -45]', '2d');
    expect(split.error).toBeNull();
    const direct = runSource('np 100 pw 90 np 100 pw 90 np 100 pw 90 np 100 pw 90', '2d');
    expect(checkDrawing(c, direct.segments).ok).toBe(true);
  });
});

describe('highlighting and sharing', () => {
  test('highlight spans cover the whole text in order', () => {
    const src = 'oto k ma: a\n  np a ; komentarz\n  jeśli a > 1 [kolor "#16866a"]\njuż\n"#zle\n@';
    const spans = highlightSource(src);
    expect(spans.map((s) => src.slice(s.start, s.end)).join('')).toBe(src);
  });

  test('permalinks round-trip UTF-8 programs', () => {
    const src = EXAMPLES[5]!.source;
    expect(decodeProgram(encodeProgram(src))).toBe(src);
    expect(encodeProgram('np 1')).not.toMatch(/[+/=]/);
  });
});
