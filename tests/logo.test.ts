import { describe, expect, test } from 'bun:test';
import { runLogo, validateLogo } from '../src/logo/run';
import { MAX_OPERATIONS } from '../src/logo/limits';
import { EXAMPLES } from '../src/logo/examples';
import type { Mode, RunResult, Segment } from '../src/logo/types';

const run = (source: string, mode: Mode = '2d'): RunResult => runLogo(source, mode);

const ends = (segments: Segment[]) => segments.map((s) => s.to);

function expectError(result: RunResult, message: RegExp, line: number, column: number) {
  expect(result.error).not.toBeNull();
  expect(result.error!.message).toMatch(message);
  expect(result.error!.line).toBe(line);
  expect(result.error!.column).toBe(column);
}

describe('flat drawing', () => {
  test('square turns right and closes', () => {
    const r = run('powtorz 4 [np 80 pw 90]');
    expect(r.error).toBeNull();
    expect(r.segments.map((s) => s.to)).toEqual([
      [0, 80, 0],
      [80, 80, 0],
      [80, 0, 0],
      [0, 0, 0],
    ]);
    expect(r.segments[0].from).toEqual([0, 0, 0]);
    expect(r.segments[0].color).toBe('#16866a');
    expect(r.segments[0].width).toBe(3);
  });

  test('left turns and backward moves', () => {
    const r = run('lw 90 np 10 ws 4');
    expect(ends(r.segments)).toEqual([
      [-10, 0, 0],
      [-6, 0, 0],
    ]);
  });

  test('zero moves and pen up draw nothing', () => {
    const r = run('np 0 pod np 10 opu np 5');
    expect(r.segments).toHaveLength(1);
    expect(r.segments[0].to).toEqual([0, 15, 0]);
  });

  test('pen state, colour and width persist and apply to segments', () => {
    const r = run('kolor "#ABCDEF" grubosc 7 np 1 pod np 1 opuść np 1');
    expect(r.segments.map((s) => [s.color, s.width])).toEqual([
      ['#abcdef', 7],
      ['#abcdef', 7],
    ]);
  });

  test('aliases and accented spellings are equivalent, keywords ignore case', () => {
    const a = run('NAPRZÓD 10 Prawo 90 naprzod 10 PW 90 fd 10 rt 90 forward 10');
    const b = run('np 10 pw 90 np 10 pw 90 np 10 pw 90 np 10');
    expect(a.error).toBeNull();
    expect(a.segments).toEqual(b.segments);
  });

  test('numbers: signs, decimals and leading dot', () => {
    const r = run('np .5 np +3 np -12.5 np 2.');
    expect(ends(r.segments)).toEqual([
      [0, 0.5, 0],
      [0, 3.5, 0],
      [0, -9, 0],
      [0, -7, 0],
    ]);
  });

  test('comments run to the end of the line', () => {
    const r = run('np 10 ; to jest komentarz np 99\nnp 1');
    expect(ends(r.segments)).toEqual([
      [0, 10, 0],
      [0, 11, 0],
    ]);
  });

  test('empty program draws nothing', () => {
    expect(run('   \n ; tylko komentarz\n')).toEqual({ segments: [], error: null });
  });

  test('negative angles turn the other way', () => {
    const r = run('pw -90 np 5');
    expect(ends(r.segments)).toEqual([[-5, 0, 0]]);
  });

  test('colour literals are validated', () => {
    expectError(run('kolor "#16866"'), /Nieprawidłowy kolor/, 1, 7);
    expectError(run('kolor 16866a'), /Oczekiwano koloru/, 1, 7);
  });
});

describe('repeat', () => {
  test('zero runs nothing and nesting works', () => {
    expect(run('powtorz 0 [np 10]').segments).toEqual([]);
    const r = run('powtorz 2 [powtorz 3 [np 1] pw 90]');
    expect(r.segments).toHaveLength(6);
  });

  test('count must be an integer in range', () => {
    expectError(run('powtorz 10001 [np 1]'), /0–10000/, 1, 9);
    expectError(run('powtorz 2.5 [np 1]'), /całkowitą/, 1, 9);
    expectError(run('powtorz 2 np 1'), /Oczekiwano „\[”/, 1, 11);
  });

  test('unbalanced brackets are reported at the opening bracket', () => {
    expectError(run('powtorz 2 [np 1'), /Brakujący znak „\]”/, 1, 11);
    expectError(run('np 1 ]'), /Nieoczekiwany znak „\]”/, 1, 6);
  });
});

describe('parameters and procedures', () => {
  test('definition after the call and parameters in repeat counts', () => {
    const r = run('ciag 3\noto ciag ma: n\n  powtorz n [np 1]\njuz');
    expect(r.error).toBeNull();
    expect(r.segments).toHaveLength(3);
  });

  test('legacy header with colon-prefixed parameters', () => {
    const r = run('oto kwadrat :bok :kat\n  powtorz 4 [np :bok pw :kat]\njuz\nkwadrat 80 90');
    expect(r.error).toBeNull();
    expect(ends(r.segments)).toEqual([
      [0, 80, 0],
      [80, 80, 0],
      [80, 0, 0],
      [0, 0, 0],
    ]);
  });

  test('parameters pass through to other procedure calls', () => {
    const r = run(
      'oto a ma: x\n  np x\njuz\noto b ma: y\n  a y\n  a y\njuz\nb 4',
    );
    expect(ends(r.segments)).toEqual([
      [0, 4, 0],
      [0, 8, 0],
    ]);
  });

  test('parameters are local and procedures can be called many times', () => {
    const r = run('oto p ma: a\n  np a\njuz\np 1\np 2\np 3');
    expect(ends(r.segments)).toEqual([
      [0, 1, 0],
      [0, 3, 0],
      [0, 6, 0],
    ]);
  });

  test('wrong argument count is reported at the call', () => {
    expectError(run('oto k ma: a, b\n  np a\njuz\nk 1'), /przyjmuje 2 argumenty, a podano 1/, 4, 1);
    expectError(run('oto k ma: a\n  np a\njuz\nk 1 2'), /Nieznane polecenie|oczekiwano polecenia|Oczekiwano polecenia/i, 4, 5);
  });

  test('a name may be defined once', () => {
    expectError(run('oto a\njuz\noto a\njuz'), /już zdefiniowana/, 3, 5);
  });

  test('recursion is an error even if never run', () => {
    expectError(run('oto a\n  a\njuz'), /samej siebie/, 2, 3);
    expectError(run('oto a\n  b\njuz\noto b\n  a\njuz'), /samej siebie/, 5, 3);
  });

  test('definitions inside bodies and missing już are errors', () => {
    expectError(run('oto a\n  oto b\n  juz\njuz'), /wewnątrz/, 2, 3);
    expectError(run('oto a\n  powtorz 2 [oto b\njuz]\njuz'), /wewnątrz/, 2, 14);
    expectError(run('oto a\n  np 1\n'), /Brakujące słowo „już”/, 1, 1);
  });

  test('już must stand on its own line', () => {
    expectError(run('oto a\n  np 1 juz\njuz'), /osamym|samo w swoim wierszu/, 2, 8);
  });

  test('unknown parameters and parameters used as commands', () => {
    expectError(run('oto a ma: x\n  np y\njuz'), /Oczekiwano liczby po „np”/, 2, 6);
    expectError(run('oto a ma: x\n  np :y\njuz'), /Nieznany parametr „y”/, 2, 7);
    expectError(run('oto a ma: x\n  x\njuz'), /jest parametrem/, 2, 3);
  });

  test('reserved words cannot name procedures or parameters', () => {
    expectError(run('oto np\njuz'), /zarezerwowanym/, 1, 5);
    expectError(run('oto a ma: pw\njuz'), /zarezerwowanym/, 1, 11);
  });

  test('definitions must start a line and headers must be well formed', () => {
    expectError(run('np 1 oto a\njuz'), /nowego wiersza/, 1, 6);
    expectError(run('oto a ma: x y\n np x\njuz'), /Nieoczekiwany element/, 1, 13);
    expectError(run('oto a ma: x,\n np x\njuz'), /po przecinku/, 1, 12);
    expectError(run('oto a ma: x, x\njuz'), /więcej niż raz/, 1, 14);
  });

  test('stray już is an error', () => {
    expectError(run('np 1\njuz'), /bez pasującego „oto”/, 2, 1);
  });
});

describe('numeric arguments', () => {
  test('missing and non-numeric arguments', () => {
    expectError(run('np'), /wymaga argumentu liczbowego/, 1, 1);
    expectError(run('np pw 90'), /Oczekiwano liczby po „np”, a znaleziono „pw”/, 1, 4);
    expectError(run('np 1e3'), /Oczekiwano liczby po „np”, a znaleziono „1e3”/, 1, 4);
  });

  test('numbers are not expressions', () => {
    expectError(run('np 2+2'), /Nieznane polecenie|Oczekiwano/, 1, 4);
  });

  test('width is an integer 1–12', () => {
    expect(run('grubosc 12').error).toBeNull();
    expectError(run('grubosc 13'), /1–12/, 1, 9);
    expectError(run('grubosc 2.5'), /1–12/, 1, 9);
    expectError(run('grubosc 0'), /1–12/, 1, 9);
  });

  test('unknown commands report line and column', () => {
    expectError(run('np 1\n  xyz 2'), /Nieznane polecenie „xyz”/, 2, 3);
  });
});

describe('2D and 3D', () => {
  test('pitch commands are errors in 2D', () => {
    expectError(run('gora 90', '2d'), /tylko w trybie 3D/, 1, 1);
    expectError(run('oto a\n  dol 10\njuz', '2d'), /tylko w trybie 3D/, 2, 3);
  });

  test('flat programs give identical segments in 2D and 3D', () => {
    const source = `oto kw ma: b, k
  powtorz 4 [np b pw k lw 30 np b/1 ws 0]
juz
kw 40 90
pod np 5 opu kolor "#123456" grubosc 9 kw 10 -20 lw 45 np 33.3`.replace('b/1 ', '');
    expect(run(source, '2d')).toEqual(run(source, '3d'));
  });

  test('pitch up turns the nose towards the up vector', () => {
    const r = run('gora 90 np 5 dol 90 np 3', '3d');
    expect(ends(r.segments)).toEqual([
      [0, 0, 5],
      [0, 3, 5],
    ]);
  });

  test('pitch down and back restores the plane', () => {
    const r = run('dol 90 np 5', '3d');
    expect(ends(r.segments)).toEqual([[0, 0, -5]]);
    const back = run('gora 30 dol 30 np 5', '3d');
    expect(ends(back.segments)).toEqual([[0, 5, 0]]);
  });

  test('right turn after pitch keeps the right vector', () => {
    // gora 90: heading +Z, up -Y, right +X. pw 90 then turns the heading around the up vector onto +X.
    const r = run('gora 90 pw 90 np 5', '3d');
    expect(r.error).toBeNull();
    expect(ends(r.segments)).toEqual([[5, 0, 0]]);
  });
});

describe('run-time limits', () => {
  test('operations limit keeps what was drawn', () => {
    const r = run('powtorz 10000 [np 1]');
    expect(r.error).not.toBeNull();
    expect(r.error!.message).toMatch(/operacji/);
    expect(r.segments.length).toBeGreaterThan(0);
    expect(r.segments.length).toBeLessThan(10000);
  });

  test('operations count repeat and call bookkeeping', () => {
    const body = 'oto p\n  np 1\njuz\n';
    expectError(run(body + `powtorz ${MAX_OPERATIONS} [p]`), /operacji/, 4, 1);
  });

  test('coordinates are limited to ±100 000', () => {
    const r = run('np 99999 np 2');
    expectError(
      { segments: r.segments, error: r.error },
      /zakres/,
      1,
      10,
    );
    expect(r.segments).toHaveLength(1);
  });

  test('run-time width and repeat values from parameters are checked when used', () => {
    const r = run('oto g ma: w\n  grubosc w\njuz\nnp 1 g 13 np 1');
    expectError(r, /1–12/, 2, 3);
    expect(r.segments).toHaveLength(1);
    const q = run('oto r ma: n\n  powtorz n [np 1]\njuz\nr 2.5');
    expectError(q, /całkowitą/, 2, 3);
  });

  test('nesting depth is limited to 32', () => {
    const deep = (n: number) => 'powtorz 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    expect(validateLogo(deep(32), '2d')).toBeNull();
    expect(validateLogo(deep(33), '2d')?.message).toMatch(/głębokość/);
  });

  test('source length is limited', () => {
    const r = run(' '.repeat(50_001));
    expect(r.error?.message).toMatch(/za długi/);
  });
});

describe('examples', () => {
  for (const example of EXAMPLES) {
    test(`${example.name} runs without error`, () => {
      const r = runLogo(example.source, example.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }
});
