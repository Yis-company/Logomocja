import { describe, expect, test } from 'bun:test';
import { runProgram } from '../src/lang/interpreter';
import { EXAMPLES } from '../src/examples';
import type { Mode, RunResult } from '../src/lang/types';

const run = (src: string, mode: Mode = '2d'): RunResult => runProgram(src, mode);

function end(r: RunResult): number[] {
  const s = r.segments[r.segments.length - 1];
  if (!s) throw new Error('no segments');
  return s.to;
}

function close(a: number[], b: number[], eps = 1e-9) {
  expect(a.length).toBe(b.length);
  a.forEach((v, i) => expect(Math.abs(v - b[i]!)).toBeLessThan(eps));
}

function ok(r: RunResult) {
  if (r.error) throw new Error(`unexpected error ${r.error.line}:${r.error.column} ${r.error.message}`);
}

function errAt(r: RunResult, line: number, column: number) {
  expect(r.error).not.toBeNull();
  expect({ line: r.error!.line, column: r.error!.column }).toEqual({ line, column });
  expect(r.error!.message.length).toBeGreaterThan(10);
}

describe('standard programs', () => {
  const counts: Record<string, number> = {
    kwadrat: 4,
    gwiazda: 5,
    rozeta: 48,
    spirala: 90,
    wielokaty: 42,
    drzewo: 255,
    sniezynka: 768,
    schody: 12,
    szescian: 17,
    pierscien: 36,
    kula: 432,
    helisa: 240,
    drzewo3d: 121,
  };
  test('there are thirteen, with unique names', () => {
    expect(EXAMPLES.length).toBe(13);
    expect(new Set(EXAMPLES.map((e) => e.id)).size).toBe(13);
  });
  for (const ex of EXAMPLES) {
    test(`${ex.id} runs in ${ex.mode}`, () => {
      const r = run(ex.source, ex.mode);
      ok(r);
      expect(r.segments.length).toBe(counts[ex.id]!);
    });
  }
  test('flat programs draw identical coordinates in 2D and 3D', () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === '2d')) {
      expect(run(ex.source, '3d')).toEqual(run(ex.source, '2d'));
    }
  });
  test('kwadrat closes exactly', () => {
    const r = run(EXAMPLES[0]!.source);
    expect(r.segments.map((s) => s.to)).toEqual([
      [0, 120, 0],
      [120, 120, 0],
      [120, 0, 0],
      [0, 0, 0],
    ]);
    expect(r.segments[0]).toEqual({ from: [0, 0, 0], to: [0, 120, 0], color: '#16866a', width: 3 });
  });
  test('spirala alternates colours and grows', () => {
    const r = run(EXAMPLES.find((e) => e.id === 'spirala')!.source);
    expect(r.segments[0]!.color).toBe('#16866a');
    expect(r.segments[1]!.color).toBe('#c1763d');
    expect(r.segments[0]!.to[1]).toBeCloseTo(2.5, 12);
  });
});

describe('result shape', () => {
  test('segments carry numbers and lowercase colours', () => {
    const r = run('kolor "#ABCDEF" grubosc 5 np 10');
    ok(r);
    expect(r.segments).toEqual([{ from: [0, 0, 0], to: [0, 10, 0], color: '#abcdef', width: 5 }]);
  });
  test('defaults: pen down, #16866a, width 3', () => {
    expect(run('np 1').segments[0]).toEqual({ from: [0, 0, 0], to: [0, 1, 0], color: '#16866a', width: 3 });
  });
  test('empty program and comments only', () => {
    expect(run('')).toEqual({ segments: [], error: null });
    expect(run('; nic\n   ; tu też nic')).toEqual({ segments: [], error: null });
  });
});

describe('lexical rules', () => {
  test('case-insensitive keywords and names', () => {
    const r = run('NP 10 Pw 90 nP 10\noto Kwadrat ma: BOK\n np bok\njuż\nKWADRAT 5');
    ok(r);
    close(end(r), [15, 10, 0]);
  });
  test('accented and unaccented aliases', () => {
    ok(run('naprzód 1 naprzod 1 powtórz 1 [prawo 1] podnieś opuść grubość 2 czyść czysc jeśli 1 = 1 [ ] jesli 1 = 1 [ ]'));
    ok(run('jeżeli 1 = 1 [ ] [ ] jezeli 1 = 1 [ ] [ ]\noto a\njuz\noto b\nend\noto c\njuż\na b c'));
    ok(run('góra 1 gora 1 dół 1 dol 1 przechylprawo 1 przechyllewo 1', '3d'));
  });
  test('english aliases', () => {
    const r = run('fd 10 rt 90 forward 10 right 90 bk 5 back 5 lt 90 left 90 pu pd penup pendown color "#000000" width 2 repeat 2 [ ] let x 1 if x = 1 [ ] ifelse x = 1 [ ] [ ] home cs clearscreen\nto f\nend\nf');
    ok(r);
  });
  test('english 3D aliases', () => {
    ok(run('pitchup 10 pitchdown 10 rr 10 rl 10 rollright 1 rollleft 1', '3d'));
  });
  test('comments run to the end of the line', () => {
    const r = run('np 10 ; pw 90 np 1000\nnp 5');
    ok(r);
    close(end(r), [0, 15, 0]);
  });
  test('number forms', () => {
    close(end(run('np 80')), [0, 80, 0]);
    close(end(run('np 12.5')), [0, 12.5, 0]);
    close(end(run('np .5')), [0, 0.5, 0]);
  });
  test('not numbers', () => {
    errAt(run('np 1e3'), 1, 4);
    errAt(run('np 0x10'), 1, 4);
    errAt(run('np NaN'), 1, 4);
    errAt(run('np Infinity'), 1, 4);
    errAt(run('np 12.'), 1, 4);
  });
  test('colour literal is case-insensitive hex', () => {
    expect(run('kolor "#16866A" np 1').segments[0]!.color).toBe('#16866a');
    errAt(run('kolor "#16866"'), 1, 7);
    errAt(run('kolor "#GG0000"'), 1, 7);
    errAt(run('kolor 16866a'), 1, 7);
    errAt(run('kolor'), 1, 1);
    errAt(run('np 10\nkolor "#16866a'), 2, 7);
  });
  test('unknown characters', () => {
    errAt(run('np 10 @'), 1, 7);
  });
});

describe('expressions', () => {
  test('precedence and left associativity', () => {
    close(end(run('np 20 - 5 - 3')), [0, 12, 0]);
    close(end(run('np 2 + 3 * 4')), [0, 14, 0]);
    close(end(run('np 8 / 2 / 2')), [0, 2, 0]);
    close(end(run('np (2 + 3) * 4')), [0, 20, 0]);
    close(end(run('np 2*3+4')), [0, 10, 0]);
  });
  test('operator whitespace rule', () => {
    close(end(run('np 10 - 5')), [0, 5, 0]);
    close(end(run('np 10-5')), [0, 5, 0]);
    errAt(run('np 10 -5'), 1, 7);
    errAt(run('np 10- 5'), 1, 6);
    errAt(run('np 10 +5'), 1, 7);
    errAt(run('np 10 *5'), 1, 7);
    errAt(run('np 10 /5'), 1, 7);
    close(end(run('np 10*5')), [0, 50, 0]);
    close(end(run('np 10 * 5')), [0, 50, 0]);
  });
  test('stray value is reported where it stands and nothing is drawn', () => {
    const r = run('np 10\nnp 10 -5');
    errAt(r, 2, 7);
    expect(r.segments).toEqual([]);
  });
  test('comparisons ignore the whitespace rule', () => {
    close(end(run('jeśli 2 >1 [np 3]')), [0, 3, 0]);
    close(end(run('jeśli 2>1 [np 3]')), [0, 3, 0]);
  });
  test('unary signs', () => {
    close(end(run('np -(3 - 5)')), [0, 2, 0]);
    close(end(run('np - -2')), [0, 2, 0]);
    close(end(run('niech bok 5 np -bok')), [0, -5, 0]);
    close(end(run('np +5')), [0, 5, 0]);
    close(end(run('np -2 * -3')), [0, 6, 0]);
    close(end(run('np 2 * -3 + 10')), [0, 4, 0]);
    close(end(run('np --3')), [0, 3, 0]);
  });
  test('procedure arguments split on the whitespace rule', () => {
    const src = 'oto f ma: a, b\n np a\n np b\njuż\n';
    const r = run(src + 'f 80 -30');
    ok(r);
    close(end(r), [0, 50, 0]);
    errAt(run(src + 'f 80 - 30'), 5, 1);
    close(end(run(src + 'kwadrat 1 1'.replace('kwadrat', 'f') + '\nf 40 * 2 10')), [0, 92, 0]);
  });
  test('exact comparisons', () => {
    expect(run('jeśli 0.1 + 0.2 = 0.3 [np 10]').segments).toEqual([]);
    for (const [cond, yes] of [
      ['1 < 2', true],
      ['2 < 1', false],
      ['2 > 1', true],
      ['1 = 1', true],
      ['1 <= 1', true],
      ['2 <= 1', false],
      ['1 >= 1', true],
      ['0 >= 1', false],
      ['1 <> 2', true],
      ['1 <> 1', false],
    ] as const) {
      expect(run(`jeśli ${cond} [np 1]`).segments.length).toBe(yes ? 1 : 0);
    }
  });
  test('division by zero is a run-time error at the argument', () => {
    const r = run('np 10\nnp 5 / (2 - 2)');
    errAt(r, 2, 4);
    expect(r.segments.length).toBe(1);
  });
  test('non-finite results', () => {
    let big = '10';
    for (let i = 0; i < 320; i++) big += ' * 10';
    const r = run(`np 1\npw ${big}`);
    errAt(r, 2, 4);
    expect(r.segments.length).toBe(1);
  });
  test('deeply nested parentheses and signs do not overflow', () => {
    ok(run('np ' + '('.repeat(3000) + '1' + ')'.repeat(3000)));
    ok(run('np ' + '- '.repeat(4000) + '1'));
  });
  test('missing operands and parentheses', () => {
    errAt(run('np 10 -'), 1, 7);
    errAt(run('np (10'), 1, 4);
    errAt(run('np 10)'), 1, 6);
    errAt(run('np (5 + )'), 1, 9);
    errAt(run('np ()'), 1, 5);
    errAt(run('np (1 2)'), 1, 7);
  });
});

describe('missing arguments', () => {
  test('reported at the found token', () => {
    errAt(run('powtorz 4 [np]'), 1, 14);
    errAt(run('np pw 90'), 1, 4);
    errAt(run('np )'), 1, 4);
  });
  test('reported at the command when the program ends', () => {
    errAt(run('np'), 1, 1);
    errAt(run('pw 90\nlw'), 2, 1);
    errAt(run('powtorz 4'), 1, 1);
    errAt(run('niech'), 1, 1);
    errAt(run('niech x'), 1, 1);
    errAt(run('jeżeli 1 = 1 [np 1]'), 1, 1);
    errAt(run('oto f ma: a\njuż\nf'), 3, 1);
  });
  test('repeat without a body', () => {
    errAt(run('powtorz 4 np 10'), 1, 11);
  });
  test('condition without a comparison', () => {
    errAt(run('jeśli 1 [np 1]'), 1, 9);
  });
});

describe('turtle geometry', () => {
  test('turns', () => {
    close(end(run('pw 90 np 10')), [10, 0, 0]);
    close(end(run('lw 90 np 10')), [-10, 0, 0]);
    close(end(run('pw -90 np 10')), [-10, 0, 0]);
    close(end(run('pw 45 np 10')), [Math.SQRT1_2 * 10, Math.SQRT1_2 * 10, 0]);
    close(end(run('pw 30 np 10')), [5, 10 * Math.cos(Math.PI / 6), 0]);
    close(end(run('ws 10')), [0, -10, 0]);
  });
  test('pitch', () => {
    close(end(run('gora 90 np 10', '3d')), [0, 0, 10]);
    close(end(run('dol 90 np 10', '3d')), [0, 0, -10]);
    close(end(run('gora 90 gora 90 np 10', '3d')), [0, -10, 0]);
  });
  test('roll keeps the heading and turns the up vector towards the right', () => {
    close(end(run('pp 90 np 10', '3d')), [0, 10, 0]);
    // after pp 90 up = former right (+X), right = former down (-Z)
    close(end(run('pp 90 gora 90 np 10', '3d')), [10, 0, 0]);
    close(end(run('pp 90 pw 90 np 10', '3d')), [0, 0, -10]);
    close(end(run('pl 90 pw 90 np 10', '3d')), [0, 0, 10]);
    close(end(run('pl 90 gora 90 np 10', '3d')), [-10, 0, 0]);
  });
  test('right turn after a pitch rotates around the new up', () => {
    // gora 90: heading +Z, up -Y, right stays +X
    close(end(run('gora 90 pw 90 np 10', '3d')), [10, 0, 0]);
  });
  test('pitch and roll are errors in 2D', () => {
    for (const c of ['gora 10', 'dol 10', 'pp 10', 'pl 10', 'góra 1', 'dół 1', 'pitchup 1', 'rollleft 1']) {
      const r = run(`np 10\n${c}`);
      errAt(r, 2, 1);
      expect(r.segments).toEqual([]);
    }
  });
  test('dom returns, draws and resets orientation but not pen', () => {
    const r = run('pw 90 np 10 dom np 5');
    ok(r);
    expect(r.segments.map((s) => s.to)).toEqual([
      [10, 0, 0],
      [0, 0, 0],
      [0, 5, 0],
    ]);
    const r3 = run('gora 45 pp 30 np 10 dom np 5', '3d');
    ok(r3);
    close(end(r3), [0, 5, 0]);
    expect(run('dom').segments).toEqual([]);
    expect(run('pod np 10 dom').segments).toEqual([]);
    const c = run('kolor "#123456" grubosc 7 np 10 dom');
    expect(c.segments[1]).toEqual({ from: [0, 10, 0], to: [0, 0, 0], color: '#123456', width: 7 });
  });
  test('pen up moves without drawing', () => {
    const r = run('pod np 10 opu np 10');
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [0, 20, 0], color: '#16866a', width: 3 }]);
  });
  test('a zero move draws nothing', () => {
    expect(run('np 0 ws 0').segments).toEqual([]);
  });
  test('czyść forgets segments only', () => {
    const r = run('kolor "#ff0000" np 10 czyść pw 90 np 10');
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [10, 10, 0], color: '#ff0000', width: 3 }]);
  });
  test('width bounds', () => {
    ok(run('grubosc 1 grubosc 12'));
    errAt(run('grubosc 0'), 1, 9);
    errAt(run('grubosc 13'), 1, 9);
    errAt(run('grubosc 1.5'), 1, 9);
    errAt(run('np 5\ngrubosc 2 + 11'), 2, 9);
    expect(run('np 5\ngrubosc 2 + 11').segments).toEqual([]);
    const r = run('np 5\nniech w 13\ngrubosc w');
    errAt(r, 3, 9);
    expect(r.segments.length).toBe(1);
  });
});

describe('repeat and nrpowt', () => {
  test('counts', () => {
    expect(run('powtorz 0 [np 1]').segments).toEqual([]);
    expect(run('powtorz 3 [np 1]').segments.length).toBe(3);
    errAt(run('powtorz 10001 [np 1]'), 1, 9);
    errAt(run('powtorz 2.5 [np 1]'), 1, 9);
    errAt(run('powtorz -1 [np 1]'), 1, 9);
    errAt(run('powtorz 10 / 4 [np 1]'), 1, 9);
    const r = run('np 1\nniech n 2.5\npowtorz n [np 1]');
    errAt(r, 3, 9);
    expect(r.segments.length).toBe(1);
  });
  test('nrpowt reads the innermost repeat', () => {
    close(end(run('powtorz 2 [powtorz 3 [np nrpowt]]')), [0, 12, 0]);
    close(end(run('powtorz 3 [np nrpowt powtorz 2 [ ] np nrpowt]')), [0, 12, 0]);
    close(end(run('repeat 4 [fd repcount]')), [0, 10, 0]);
  });
  test('nrpowt outside a repeat is a parse error', () => {
    errAt(run('np 10\nnp nrpowt'), 2, 4);
    errAt(run('oto f\n  np nrpowt\njuż\npowtorz 3 [f]'), 2, 6);
    ok(run('oto f\n  powtorz 2 [np nrpowt]\njuż\nf'));
    errAt(run('jeśli 1 = 1 [np nrpowt]'), 1, 17);
  });
  test('nrpowt as a command is a stray value', () => {
    errAt(run('powtorz 2 [nrpowt]'), 1, 12);
  });
});

describe('variables', () => {
  test('assignment and reassignment', () => {
    close(end(run('niech x 5 niech x x * 2 np x')), [0, 10, 0]);
    close(end(run('niech x 1\nniech X 7\nnp x')), [0, 7, 0]);
  });
  test('legacy :name form', () => {
    close(end(run('niech x 5 np :x')), [0, 5, 0]);
  });
  test('globals may be declared after use', () => {
    const r = run('oto f\n np rozmiar\njuż\nniech rozmiar 10\nf');
    ok(r);
    close(end(r), [0, 10, 0]);
  });
  test('reading before assignment is a run-time error at the argument', () => {
    const r = run('np 10 np y niech y 2');
    errAt(r, 1, 10);
    expect(r.segments.length).toBe(1);
    errAt(run('np 1 np 2 + (3 * y)\nniech y 1'), 1, 9);
  });
  test('locals shadow globals for the rest of the call', () => {
    const r = run('niech x 1\noto f\n  np x\n  niech x 5\n  np x\njuż\nf\nnp x');
    ok(r);
    expect(r.segments.map((s) => s.to[1])).toEqual([1, 6, 7]);
  });
  test('a procedure local is not visible to callees', () => {
    errAt(run('oto a\n niech t 5\n b\njuż\noto b\n np t\njuż\na'), 6, 5);
  });
  test('an unassigned local is a run-time error', () => {
    const r = run('oto f\n np 1\n jeśli 1 = 2 [niech q 3]\n np q\njuż\nf');
    errAt(r, 4, 5);
    expect(r.segments.length).toBe(1);
  });
  test('parameters can be reassigned', () => {
    close(end(run('oto f ma: a\n niech a a + 1\n np a\njuż\nf 4')), [0, 5, 0]);
  });
  test('unknown names are parse errors', () => {
    const r = run('np 10\nnp bok');
    errAt(r, 2, 4);
    expect(r.segments).toEqual([]);
  });
  test('variables cannot take command or procedure names', () => {
    errAt(run('niech np 5'), 1, 7);
    errAt(run('niech kwadrat 5\noto kwadrat\njuż'), 1, 7);
    errAt(run('niech nrpowt 5'), 1, 7);
  });
});

describe('conditionals', () => {
  test('jeśli and jeżeli', () => {
    close(end(run('jeżeli 1 < 2 [np 1] [np 2]')), [0, 1, 0]);
    close(end(run('jeżeli 1 > 2 [np 1] [np 2]')), [0, 2, 0]);
    expect(run('jeśli 1 > 2 [np 1]').segments).toEqual([]);
  });
  test('bodies may hold anything a repeat body may hold', () => {
    const r = run('oto f\n np 1\njuż\njeśli 1 = 1 [powtorz 2 [f] jeżeli 2 = 2 [niech x 4] [ ] np x]');
    ok(r);
    close(end(r), [0, 6, 0]);
  });
});

describe('procedures', () => {
  const sq = 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\n';
  test('the documented example', () => {
    const r = run(sq + 'kwadrat 80 90');
    ok(r);
    expect(r.segments.length).toBe(4);
    close(end(r), [0, 0, 0]);
  });
  test('arguments are expressions', () => {
    const r = run(sq + 'kwadrat 40 * 2 90');
    ok(r);
    close(r.segments[0]!.to, [0, 80, 0]);
  });
  test('legacy header and :name references', () => {
    const r = run('oto kwadrat :bok :kąt\n  powtorz 4 [np :bok pw kąt]\njuż\nkwadrat 30 90');
    ok(r);
    close(r.segments[0]!.to, [0, 30, 0]);
  });
  test('definitions may follow calls', () => {
    ok(run('kwadrat 50 90\n' + sq));
  });
  test('a parameter may share its name with a procedure', () => {
    const r = run('oto bok ma: bok\n  jeśli bok > 1 [np bok bok bok / 2]\njuż\nbok 8');
    ok(r);
    expect(r.segments.map((s) => s.to[1])).toEqual([8, 12, 14]);
  });
  test('recursion and stop', () => {
    const r = run('oto f ma: n\n  jeśli n = 0 [stop]\n  np n\n  f n - 1\njuż\nf 4');
    ok(r);
    close(end(r), [0, 10, 0]);
  });
  test('stop inside a repeat ends the call, not just the body', () => {
    const r = run('oto f\n  powtorz 10 [np 1 jeśli nrpowt = 3 [stop]]\n  np 100\njuż\nf\nnp 5');
    ok(r);
    expect(r.segments.length).toBe(4);
    close(end(r), [0, 8, 0]);
  });
  test('stop at top level ends the program', () => {
    expect(run('np 1 stop np 2').segments.length).toBe(1);
    expect(run('powtorz 5 [np 1 stop]').segments.length).toBe(1);
  });
  test('wrong argument counts', () => {
    errAt(run('oto f ma: x, y\n np x\njuż\nf 10'), 4, 1);
    errAt(run('oto f ma: x, y\n np x\njuż\nf 10 pw 90'), 4, 6);
    errAt(run('oto f ma: x\n np x\njuż\nf 10 20'), 4, 6);
    errAt(run('oto f\n np 1\njuż\nf 10'), 4, 3);
  });
  test('definition rules', () => {
    errAt(run('powtorz 2 [\noto f\njuż\n]'), 2, 1);
    errAt(run('oto f\n np 10'), 1, 1);
    errAt(run('oto f\njuż\noto f\njuż'), 3, 5);
    errAt(run('oto f\n oto g\n już\njuż'), 2, 2);
    errAt(run('np 10 oto f\njuż'), 1, 7);
    errAt(run('oto f np 10\njuż'), 1, 7);
    errAt(run('oto np\njuż'), 1, 5);
    errAt(run('oto f\n np 10 już'), 2, 8);
    errAt(run('już'), 1, 1);
    errAt(run('oto f ma: a b\njuż'), 1, 13);
    errAt(run('oto f ma: a, a\njuż'), 1, 14);
    errAt(run('oto f\n powtorz 2 [np 1\njuż'), 2, 12);
    ok(run('oto f ; komentarz\n np 1 ; tu też\njuż ; koniec\nf'));
  });
  test('unknown command', () => {
    errAt(run('np 10\nskok 5'), 2, 1);
  });
  test('stray brackets', () => {
    errAt(run('np 10 ]'), 1, 7);
    errAt(run('[np 10]'), 1, 1);
    errAt(run('powtorz 2 [np 10'), 1, 11);
  });
});

describe('limits', () => {
  test('source characters', () => {
    const r = run('np 1\n' + ' '.repeat(50_000));
    expect(r.error).not.toBeNull();
    expect(r.segments).toEqual([]);
    ok(run('np 1' + ' '.repeat(49_996)));
  });
  test('tokens', () => {
    errAt(run('pw 1 '.repeat(5000) + 'np'), 1, 25001);
    ok(run('pw 1 '.repeat(5000)));
  });
  test('bracket nesting depth', () => {
    ok(run('powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32)));
    const r = run('powtorz 1 ['.repeat(33) + 'np 1' + ']'.repeat(33));
    errAt(r, 1, 32 * 11 + 11);
  });
  test('active frames', () => {
    ok(run('oto f ma: n\n jeśli n > 0 [f n - 1]\njuż\nf 31'));
    const r = run('oto f ma: n\n np 1\n jeśli n > 0 [f n - 1]\njuż\nf 32');
    errAt(r, 3, 15);
    expect(r.segments.length).toBe(32);
    ok(run('oto f ma: n\n powtorz 1 [jeśli n > 0 [f n - 1]]\njuż\nf 15'));
    errAt(run('oto f ma: n\n powtorz 1 [jeśli n > 0 [f n - 1]]\njuż\nf 16'), 2, 26);
  });
  test('executed operations: commands, iterations', () => {
    // 1 (powtorz) + 4999 * (np + iteration) = 9999; one more command reaches 10 000
    ok(run('pw 0 powtorz 4999 [np 0]'));
    errAt(run('pw 0 pw 0 powtorz 4999 [np 0]'), 1, 11);
  });
  test('executed operations: conditionals and their bodies', () => {
    ok(run('powtorz 3333 [jeśli 1 = 1 [ ]]'));
    expect(run('pw 0 powtorz 3333 [jeśli 1 = 1 [ ]]').error).not.toBeNull();
    // a false condition has no body to finish: 1 + 4999 * 2 + 1 = 10 000
    ok(run('pw 0 powtorz 4999 [jeśli 1 = 2 [ ]]'));
    expect(run('pw 0 pw 0 powtorz 4999 [jeśli 1 = 2 [ ]]').error).not.toBeNull();
  });
  test('executed operations: calls and niech', () => {
    ok(run('oto f\njuż\npowtorz 3333 [f]'));
    expect(run('oto f\njuż\npw 0 powtorz 3333 [f]').error).not.toBeNull();
    ok(run('pw 0 powtorz 4999 [niech a 1]'));
    expect(run('pw 0 pw 0 powtorz 4999 [niech a 1]').error).not.toBeNull();
  });
  test('reaching the end of the program is not counted', () => {
    // exactly 10 000 operations: 1 + 3333 * (condition + finished body + finished iteration)
    ok(run('powtorz 3333 [jeśli 1 = 1 [ ]]'));
  });
  test('the limit error keeps what was drawn', () => {
    const r = run('powtorz 10000 [np 1]');
    expect(r.error!.message).toContain('10 000');
    // iteration 5000 draws its segment (operation 10 000); finishing it is operation 10 001
    expect(r.segments.length).toBe(5000);
  });
  test('coordinates stay within ±100 000', () => {
    ok(run('np 100000'));
    errAt(run('np 50\nnp 99950.5'), 2, 1);
    errAt(run('pod np 200000'), 1, 5);
    const r = run('np 10\npw 90 np 200000');
    expect(r.segments.length).toBe(1);
  });
});

describe('error positions with lines and columns', () => {
  test('multi-line positions are 1-based', () => {
    errAt(run('np 10\n\n   pw 90\n   xyz'), 4, 4);
  });
  test('parse errors draw nothing even after valid lines', () => {
    const r = run('powtorz 4 [np 100 pw 90]\nnp (');
    expect(r.segments).toEqual([]);
    errAt(r, 2, 4);
  });
  test('run-time errors keep segments drawn after czyść', () => {
    const r = run('np 10 czyść np 5 np 1 / 0');
    expect(r.segments.length).toBe(1);
    errAt(r, 1, 21);
  });
});
