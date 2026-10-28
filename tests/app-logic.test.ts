import { describe, expect, test } from 'bun:test';
import { execute, runPublic } from '../src/lang/index';
import { EXAMPLES, findExample } from '../src/content/examples';
import { CHALLENGES } from '../src/content/challenges';
import { checkChallenge, compareDrawings, mergeLines } from '../src/content/check';
import { highlight } from '../src/editor/highlight';
import { decodeProgram, encodeProgram } from '../src/state/permalink';

const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps;

describe('standard programs', () => {
  const expected: Record<string, { mode: string; segments: number }> = {
    kwadrat: { mode: '2d', segments: 4 },
    gwiazda: { mode: '2d', segments: 5 },
    rozeta: { mode: '2d', segments: 48 },
    spirala: { mode: '2d', segments: 90 },
    wielokaty: { mode: '2d', segments: 42 },
    drzewo: { mode: '2d', segments: 255 },
    sniezynka: { mode: '2d', segments: 768 },
    schody: { mode: '3d', segments: 12 },
    szescian: { mode: '3d', segments: 17 },
    pierscien: { mode: '3d', segments: 36 },
    kula: { mode: '3d', segments: 432 },
    helisa: { mode: '3d', segments: 240 },
    drzewo3d: { mode: '3d', segments: 121 },
  };

  test('there are exactly the thirteen standard programs', () => {
    expect(EXAMPLES.map((e) => e.id)).toEqual(Object.keys(expected));
  });

  for (const ex of EXAMPLES) {
    test(`${ex.id} runs without errors in its mode`, () => {
      expect(ex.mode).toBe(expected[ex.id].mode as typeof ex.mode);
      const r = runPublic(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBe(expected[ex.id].segments);
      for (const s of r.segments) {
        expect(s.color).toMatch(/^#[0-9a-f]{6}$/);
        expect([...s.from, ...s.to].every(Number.isFinite)).toBe(true);
      }
    });
  }

  test('2D programs draw identical coordinates in 3D mode', () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === '2d')) {
      expect(runPublic(ex.source, '3d')).toEqual(runPublic(ex.source, '2d'));
    }
  });

  test('3D programs are rejected in 2D mode with a parse error', () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === '3d')) {
      const r = runPublic(ex.source, '2d');
      expect(r.error).not.toBeNull();
      expect(r.segments).toEqual([]);
    }
  });

  test('the square closes exactly', () => {
    const r = runPublic(findExample('kwadrat')!.source, '2d');
    expect(r.segments.map((s) => s.to)).toEqual([[0, 120, 0], [120, 120, 0], [120, 0, 0], [0, 0, 0]]);
  });

  test('the star returns to the start', () => {
    const r = runPublic(findExample('gwiazda')!.source, '2d');
    const last = r.segments[4].to;
    expect(close(last[0], 0, 1e-9) && close(last[1], 0, 1e-9)).toBe(true);
    expect(r.segments.every((s) => s.color === '#c1763d' && s.width === 3)).toBe(true);
  });

  test('stairs climb 20 per step in 3D', () => {
    const r = runPublic(findExample('schody')!.source, '3d');
    const end = r.segments[r.segments.length - 1].to;
    expect(end[0]).toBeCloseTo(0, 9);
    expect(end[1]).toBeCloseTo(210, 9);
    expect(end[2]).toBeCloseTo(120, 9);
  });

  test('the cube spans 100 in every direction', () => {
    const r = runPublic(findExample('szescian')!.source, '3d');
    const pts = r.segments.flatMap((s) => [s.from, s.to]);
    for (let k = 0; k < 3; k++) {
      const vals = pts.map((p) => p[k]);
      expect(Math.min(...vals)).toBeCloseTo(0, 9);
      expect(Math.max(...vals)).toBeCloseTo(100, 9);
    }
  });

  test('examples can be found by name', () => {
    expect(findExample('Drzewo 3D')?.id).toBe('drzewo3d');
    expect(findExample('sniezynka')?.title).toBe('Śnieżynka');
    expect(findExample('nie-ma')).toBeUndefined();
  });
});

describe('trace used for animation and stepping', () => {
  test('the last recorded step matches the final result', () => {
    for (const ex of EXAMPLES) {
      const out = execute(ex.source, ex.mode, { trace: true });
      const last = out.steps[out.steps.length - 1];
      expect(last.state).toEqual(out.turtle);
      expect(out.log.slice(last.clearStart, last.segEnd)).toEqual(out.segments);
    }
  });

  test('steps that draw add exactly one segment', () => {
    const out = execute('np 10 pod np 10 opu pw 90 np 5 dom', '2d', { trace: true });
    const drew = out.steps.map((s) => s.drew);
    expect(drew).toEqual([true, false, false, false, false, true, true]);
    expect(out.steps[4].turn).toEqual({ axis: 'yaw', deg: 90 });
  });

  test('czyść moves the start of the kept segments', () => {
    const out = execute('np 10 czyść np 20', '2d', { trace: true });
    expect(out.log.length).toBe(2);
    expect(out.steps[1].clearStart).toBe(1);
    expect(out.segments).toEqual([out.log[1]]);
  });

  test('a run-time error keeps the steps drawn before it', () => {
    const out = execute('np 10\nnp 1 / 0', '2d', { trace: true });
    expect(out.error?.phase).toBe('run');
    expect(out.steps.length).toBe(1);
    expect(out.segments.length).toBe(1);
  });
});

describe('challenge checker', () => {
  test('every reference solution passes its own challenge', () => {
    for (const ch of CHALLENGES) {
      const res = checkChallenge(ch, ch.solution);
      expect({ id: ch.id, pass: res.pass, reasons: res.reasons }).toEqual({ id: ch.id, pass: true, reasons: ['Rysunek zgadza się ze wzorem.'] });
    }
  });

  test('there are at least five challenges with unique ids', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
  });

  test('starter programs do not pass', () => {
    for (const ch of CHALLENGES) expect(checkChallenge(ch, ch.starter).pass).toBe(false);
  });

  test('a square drawn turning left, or side by side in pieces, still matches', () => {
    const sq = CHALLENGES.find((c) => c.id === 'kwadrat')!;
    expect(checkChallenge(sq, 'powtorz 4 [np 100 lw 90]').pass).toBe(true);
    expect(checkChallenge(sq, 'powtorz 4 [np 50 np 50 pw 90]').pass).toBe(true);
    expect(checkChallenge(sq, 'pw 90 powtorz 4 [np 100 lw 90]').pass).toBe(true);
  });

  test('wrong sizes and missing sides are explained', () => {
    const sq = CHALLENGES.find((c) => c.id === 'kwadrat')!;
    const big = checkChallenge(sq, 'powtorz 4 [np 120 pw 90]');
    expect(big.pass).toBe(false);
    expect(big.reasons[0]).toContain('120 × 120');
    const open = checkChallenge(sq, 'powtorz 3 [np 100 pw 90]');
    expect(open.pass).toBe(false);
    expect(open.reasons.join(' ')).toContain('Brakuje 1 odcinka');
    expect(open.missing.length).toBe(1);
    const err = checkChallenge(sq, 'np 100 pw');
    expect(err.title).toBe('Program zawiera błąd');
    expect(checkChallenge(sq, '').reasons).toContain('Nic nie zostało narysowane.');
  });

  test('extra requirements are checked', () => {
    const hex = CHALLENGES.find((c) => c.id === 'szesciokat')!;
    const unrolled = 'np 60 pw 60 np 60 pw 60 np 60 pw 60 np 60 pw 60 np 60 pw 60 np 60 pw 60';
    const res = checkChallenge(hex, unrolled);
    expect(res.pass).toBe(false);
    expect(res.reasons).toContain('Użyj polecenia powtorz.');
    const tri = CHALLENGES.find((c) => c.id === 'trojkat')!;
    expect(checkChallenge(tri, 'powtorz 3 [np 120 pw 120]').reasons.join(' ')).toContain('#2b6fb3');
    const flower = CHALLENGES.find((c) => c.id === 'kwiat')!;
    const noProc = 'powtorz 8 [powtorz 4 [np 60 pw 90] pw 45]';
    expect(checkChallenge(flower, noProc).reasons.join(' ')).toContain('procedur');
  });

  test('3D challenges compare all three dimensions', () => {
    const wall = CHALLENGES.find((c) => c.id === 'sciana')!;
    expect(checkChallenge(wall, 'powtorz 4 [np 80 pw 90]').pass).toBe(false);
    expect(checkChallenge(wall, 'powtorz 4 [gora 90 np 80]').pass).toBe(true);
  });

  test('collinear pieces are merged', () => {
    const seg = (a: number[], b: number[]) => ({ from: a as [number, number, number], to: b as [number, number, number], color: '#000000', width: 1 });
    expect(mergeLines([seg([0, 0, 0], [0, 50, 0]), seg([0, 100, 0], [0, 40, 0])]).length).toBe(1);
    expect(compareDrawings([seg([0, 0, 0], [0, 100, 0])], [seg([5, 5, 0], [5, 105, 0])], '2d').equal).toBe(true);
  });
});

describe('syntax highlighting', () => {
  test('marks every kind of token and escapes HTML', () => {
    const html = highlight('; <b>\noto f ma: a\n  np a * 2 kolor "#16866a"\njuż\nf 1 [ ]', null);
    expect(html).toContain('<span class="tk-comment" data-o="0">; &lt;b&gt;</span>');
    expect(html).toContain('tk-kw tk-control');
    expect(html).toContain('tk-proc tk-proc-def');
    expect(html).toContain('tk-kw tk-move');
    expect(html).toContain('tk-num');
    expect(html).toContain('tk-op');
    expect(html).toContain('tk-str tk-color');
    expect(html).toContain('--swatch:#16866a');
    expect(html).toContain('tk-br tk-br0');
    expect(html.endsWith('\n')).toBe(true);
  });

  test('highlighting preserves the text exactly', () => {
    for (const ex of EXAMPLES) {
      const html = highlight(ex.source, null);
      const text = html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      expect(text).toBe(ex.source + '\n');
    }
  });

  test('the error token gets a marker', () => {
    const html = highlight('np 10\nfoo', 6);
    expect(html).toContain('tk-err-at" data-o="6"');
  });
});

describe('permalinks', () => {
  test('programs survive encoding, including Polish letters', async () => {
    for (const ex of EXAMPLES) {
      const enc = await encodeProgram(ex.source);
      expect(enc).toMatch(/^[uz][A-Za-z0-9_-]*$/);
      expect(await decodeProgram(enc)).toBe(ex.source);
    }
  });

  test('long programs are compressed', async () => {
    const src = 'powtorz 4 [np 100 pw 90]\n'.repeat(200);
    const enc = await encodeProgram(src);
    expect(enc[0]).toBe('z');
    expect(enc.length).toBeLessThan(src.length / 4);
    expect(await decodeProgram(enc)).toBe(src);
  });

  test('a damaged link is rejected', async () => {
    await expect(decodeProgram('x123')).rejects.toThrow();
  });
});
