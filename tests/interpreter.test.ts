import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang/index';
import type { Segment } from '../src/lang/interpreter';

const ok = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = run(src, mode);
  if (r.error) throw new Error(`unexpected error: ${JSON.stringify(r.error)}`);
  return r.segments;
};
const err = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = run(src, mode);
  if (!r.error) throw new Error(`expected an error for ${JSON.stringify(src)}`);
  return r;
};
const close = (a: number[], b: number[], eps = 1e-9) => a.every((v, i) => Math.abs(v - b[i]) < eps);
const endOf = (segs: Segment[]) => segs[segs.length - 1].to;

describe('lexical rules', () => {
  test('keywords and names ignore case; accented and unaccented aliases agree', () => {
    const a = ok('POWTÓRZ 4 [NAPRZÓD 10 PRAWO 90]');
    const b = ok('powtorz 4 [naprzod 10 prawo 90]');
    const c = ok('repeat 4 [fd 10 rt 90]');
    expect(a).toEqual(b);
    expect(b).toEqual(c);
    expect(ok('niech Bok 5 np BOK')[0].to).toEqual([0, 5, 0]);
  });

  test('every alias of every command is accepted', () => {
    for (const w of ['np', 'naprzod', 'naprzód', 'fd', 'forward']) expect(ok(`${w} 5`)[0].to).toEqual([0, 5, 0]);
    for (const w of ['ws', 'wstecz', 'bk', 'back']) expect(ok(`${w} 5`)[0].to).toEqual([0, -5, 0]);
    for (const w of ['pw', 'prawo', 'rt', 'right']) expect(ok(`${w} 90 np 5`)[0].to).toEqual([5, 0, 0]);
    for (const w of ['lw', 'lewo', 'lt', 'left']) expect(ok(`${w} 90 np 5`)[0].to).toEqual([-5, 0, 0]);
    for (const w of ['pod', 'podnies', 'podnieś', 'pu', 'penup']) expect(ok(`${w} np 5`)).toEqual([]);
    for (const w of ['opu', 'opusc', 'opuść', 'pd', 'pendown']) expect(ok(`pod ${w} np 5`)).toHaveLength(1);
    for (const w of ['kolor', 'color']) expect(ok(`${w} "#AbCdEf" np 1`)[0].color).toBe('#abcdef');
    for (const w of ['grubosc', 'grubość', 'width']) expect(ok(`${w} 7 np 1`)[0].width).toBe(7);
    for (const w of ['powtorz', 'powtórz', 'repeat']) expect(ok(`${w} 3 [np 1]`)).toHaveLength(3);
    for (const w of ['niech', 'let']) expect(ok(`${w} a 4 np a`)[0].to).toEqual([0, 4, 0]);
    for (const w of ['jeśli', 'jesli', 'if']) expect(ok(`${w} 1 < 2 [np 1]`)).toHaveLength(1);
    for (const w of ['jeżeli', 'jezeli', 'ifelse']) expect(ok(`${w} 1 > 2 [np 1] [np 2]`)[0].to).toEqual([0, 2, 0]);
    for (const w of ['dom', 'home']) expect(ok(`np 5 ${w}`)).toHaveLength(2);
    for (const w of ['czyść', 'czysc', 'cs', 'clearscreen']) expect(ok(`np 5 ${w} np 1`)).toHaveLength(1);
    for (const w of ['gora', 'góra', 'pitchup']) expect(ok(`${w} 90 np 5`, '3d')[0].to).toEqual([0, 0, 5]);
    for (const w of ['dol', 'dół', 'pitchdown']) expect(ok(`${w} 90 np 5`, '3d')[0].to).toEqual([0, 0, -5]);
    for (const w of ['pp', 'przechylprawo', 'rr', 'rollright']) expect(ok(`${w} 90 gora 90 np 5`, '3d')[0].to).toEqual([5, 0, 0]);
    for (const w of ['pl', 'przechyllewo', 'rl', 'rollleft']) expect(ok(`${w} 90 gora 90 np 5`, '3d')[0].to).toEqual([-5, 0, 0]);
    for (const w of ['nrpowt', 'repcount']) expect(ok(`powtorz 2 [np ${w}]`).map((s) => s.to[1])).toEqual([1, 3]);
  });

  test('comments run to the end of the line', () => {
    expect(ok('np 10 ; pw 90 np 10\nnp 5')).toHaveLength(2);
  });

  test('numbers: integers, decimals, leading dot', () => {
    expect(ok('np 12.5')[0].to).toEqual([0, 12.5, 0]);
    expect(ok('np .5')[0].to).toEqual([0, 0.5, 0]);
  });

  test('1e3, 0x10, NaN and Infinity are not numbers', () => {
    for (const s of ['np 1e3', 'np 0x10', 'np NaN', 'np Infinity']) {
      const r = err(s);
      expect(r.segments).toEqual([]);
      expect(r.error!.line).toBe(1);
      expect(r.error!.column).toBe(4);
    }
  });

  test('colour literals are case-insensitive six-digit hex; output is lowercase', () => {
    expect(ok('kolor "#16866A" np 1')[0].color).toBe('#16866a');
    for (const bad of ['"#12345"', '"#1234567"', '"16866a"', '"#gggggg"']) {
      const r = err(`np 1 kolor ${bad} np 1`);
      expect(r.segments).toEqual([]);
      expect(r.error!.column).toBe(12);
    }
  });
});

describe('expressions', () => {
  test('precedence and left associativity', () => {
    expect(ok('np 20 - 5 - 3')[0].to[1]).toBe(12);
    expect(ok('np 2 + 3 * 4')[0].to[1]).toBe(14);
    expect(ok('np 100 / 10 / 2')[0].to[1]).toBe(5);
    expect(ok('np (2 + 3) * 4')[0].to[1]).toBe(20);
  });

  test('a binary operator needs spaces on both sides or neither', () => {
    expect(ok('np 10 - 5')[0].to[1]).toBe(5);
    expect(ok('np 10-5')[0].to[1]).toBe(5);
    expect(ok('np 2*3')[0].to[1]).toBe(6);
    const r = err('np 10 -5');
    expect(r.error).toMatchObject({ line: 1, column: 7 });
    expect(r.segments).toEqual([]);
    expect(err('np 10 +5').error!.column).toBe(7);
    expect(err('np 10 *5').error!.column).toBe(7);
    expect(err('np 10 /5').error!.column).toBe(7);
    expect(err('np 10- 5').error!.column).toBe(6);
  });

  test('the spacing rule does not apply to comparisons', () => {
    expect(ok('jeśli 1<2 [np 1]')).toHaveLength(1);
    expect(ok('jeśli 1 <2 [np 1]')).toHaveLength(1);
    expect(ok('jeśli 2>= 2 [np 1]')).toHaveLength(1);
  });

  test('stacked unary signs anywhere an operand is expected', () => {
    expect(ok('np -(3 - 5)')[0].to[1]).toBe(2);
    expect(ok('np - -2')[0].to[1]).toBe(2);
    expect(ok('niech bok 7 np -bok')[0].to[1]).toBe(-7);
    expect(ok('np 2 * -3')[0].to[1]).toBe(-6);
    expect(ok('np +5')[0].to[1]).toBe(5);
    expect(ok('np - - - 4')[0].to[1]).toBe(-4);
  });

  test('legacy :name references', () => {
    expect(ok('niech a 3 np :a')[0].to[1]).toBe(3);
  });

  test('division by zero is a run-time error at the argument and keeps the drawing', () => {
    const r = err('np 10\nnp 5 + 1 / 0');
    expect(r.error).toMatchObject({ line: 2, column: 4 });
    expect(r.segments).toHaveLength(1);
  });

  test('non-finite results are run-time errors', () => {
    const big = '9'.repeat(300);
    const r = err(`np 1\nnp ${big} * ${big}`);
    expect(r.error).toMatchObject({ line: 2, column: 4 });
    expect(r.segments).toHaveLength(1);
  });

  test('comparisons are exact', () => {
    expect(ok('jeśli 0.1 + 0.2 = 0.3 [np 10]')).toEqual([]);
    expect(ok('jeśli 0.1 + 0.2 <> 0.3 [np 10]')).toHaveLength(1);
    for (const [op, expected] of [['<', 1], ['>', 0], ['=', 0], ['<=', 1], ['>=', 0], ['<>', 1]] as const) {
      expect(ok(`jeśli 1 ${op} 2 [np 1]`)).toHaveLength(expected);
    }
  });
});

describe('turtle geometry', () => {
  test('initial state: origin, heading +Y, pen down, colour #16866a, width 3', () => {
    expect(ok('np 10')).toEqual([{ from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 }]);
  });

  test('pw turns clockwise seen from above, lw counter-clockwise', () => {
    expect(ok('pw 90 np 10')[0].to).toEqual([10, 0, 0]);
    expect(ok('lw 90 np 10')[0].to).toEqual([-10, 0, 0]);
    expect(ok('pw -90 np 10')[0].to).toEqual([-10, 0, 0]);
    const s = ok('pw 45 np 10')[0].to;
    expect(close(s, [Math.SQRT1_2 * 10, Math.SQRT1_2 * 10, 0])).toBe(true);
  });

  test('a move of zero draws nothing; pen up draws nothing', () => {
    expect(ok('np 0')).toEqual([]);
    expect(ok('pod np 10 opu np 5')).toEqual([{ from: [0, 10, 0], to: [0, 15, 0], color: '#16866a', width: 3 }]);
  });

  test('a square closes exactly', () => {
    const segs = ok('powtorz 4 [np 100 pw 90]');
    expect(endOf(segs)).toEqual([0, 0, 0]);
    expect(segs.map((s) => s.to)).toEqual([[0, 100, 0], [100, 100, 0], [100, 0, 0], [0, 0, 0]]);
  });

  test('gora: heading turns towards up; after gora 90 the turtle heads along its former up', () => {
    expect(ok('gora 90 np 10', '3d')[0].to).toEqual([0, 0, 10]);
    // up now points backwards (-Y): another gora 90 heads along -Y
    expect(ok('gora 90 gora 90 np 10', '3d')[0].to).toEqual([0, -10, 0]);
    expect(ok('dol 90 np 10', '3d')[0].to).toEqual([0, 0, -10]);
  });

  test('pp: up turns towards right around the heading; heading unchanged', () => {
    // after pp 90, up is the former right (+X) and right is the former down (-Z)
    expect(ok('pp 90 np 10', '3d')[0].to).toEqual([0, 10, 0]);
    expect(ok('pp 90 gora 90 np 10', '3d')[0].to).toEqual([10, 0, 0]);
    expect(ok('pp 90 pw 90 np 10', '3d')[0].to).toEqual([0, 0, -10]);
    expect(ok('pl 90 pw 90 np 10', '3d')[0].to).toEqual([0, 0, 10]);
  });

  test('pitch and roll are errors in 2D mode', () => {
    for (const c of ['gora 10', 'góra 10', 'dol 10', 'dół 10', 'pp 10', 'pl 10', 'pitchup 1', 'rollleft 1']) {
      const r = err(`np 10\n${c}`);
      expect(r.error).toMatchObject({ line: 2, column: 1 });
      expect(r.segments).toEqual([]);
    }
  });

  test('dom draws back to the origin and resets orientation, not pen, colour or width', () => {
    const segs = ok('kolor "#c1763d" grubosc 5 pw 90 np 30 dom np 10');
    expect(segs[1]).toEqual({ from: [30, 0, 0], to: [0, 0, 0], color: '#c1763d', width: 5 });
    expect(segs[2].to).toEqual([0, 10, 0]);
    expect(ok('dom')).toEqual([]);
    expect(ok('pod np 10 dom opu np 1')).toEqual([{ from: [0, 0, 0], to: [0, 1, 0], color: '#16866a', width: 3 }]);
    expect(ok('gora 90 np 10 dom np 5', '3d')[2].to).toEqual([0, 5, 0]);
  });

  test('czyść forgets segments and nothing else', () => {
    const segs = ok('kolor "#2b6fb3" np 10 czyść pw 90 np 5');
    expect(segs).toEqual([{ from: [0, 10, 0], to: [5, 10, 0], color: '#2b6fb3', width: 3 }]);
  });

  test('flat programs produce identical coordinates in 2D and 3D', () => {
    const src = 'powtorz 7 [np 33.3 pw 51.4 ws 7 lw 13]';
    expect(run(src, '2d')).toEqual(run(src, '3d'));
  });

  test('pen state, colour and width persist', () => {
    const segs = ok('grubosc 2 kolor "#a478c0" np 1 pw 90 np 1');
    expect(segs.every((s) => s.width === 2 && s.color === '#a478c0')).toBe(true);
  });
});

describe('repeat and nrpowt', () => {
  test('repeat 0 runs nothing; nested repeats; nrpowt is the innermost iteration', () => {
    expect(ok('powtorz 0 [np 10]')).toEqual([]);
    const segs = ok('powtorz 2 [powtorz 3 [np nrpowt]]');
    expect(segs.map((s) => s.to[1] - s.from[1])).toEqual([1, 2, 3, 1, 2, 3]);
    expect(ok('powtorz 3 [jeśli nrpowt = 2 [np 7]]')).toHaveLength(1);
  });

  test('repeat count must be an integer from 0 to 10000', () => {
    expect(err('powtorz 10001 [np 1]').error).toMatchObject({ line: 1, column: 9 });
    expect(err('powtorz 2.5 [np 1]').error).toMatchObject({ line: 1, column: 9 });
    expect(err('powtorz -1 [np 1]').error).toMatchObject({ line: 1, column: 9 });
    expect(err('np 1 powtorz 2 * 1.25 [np 1]').segments).toEqual([]);
  });

  test('a repeat count computed from a name is checked when executed', () => {
    const r = err('np 5\nniech n 2.5\npowtorz n [np 1]');
    expect(r.error).toMatchObject({ line: 3, column: 9 });
    expect(r.segments).toHaveLength(1);
  });

  test('nrpowt outside a repeat is a parse error, also in procedures called from a repeat', () => {
    expect(err('np 10 np nrpowt').error).toMatchObject({ line: 1, column: 10 });
    const r = err('oto f\n  np nrpowt\njuż\npowtorz 3 [f]');
    expect(r.error).toMatchObject({ line: 2, column: 6 });
    expect(r.segments).toEqual([]);
    expect(ok('oto f\n  powtorz 2 [np nrpowt]\njuż\nf')).toHaveLength(2);
  });
});

describe('variables', () => {
  test('assignment and reassignment', () => {
    expect(ok('niech a 5 niech a a * 2 np a')[0].to[1]).toBe(10);
  });

  test('top-level names may be used before their niech, but must be assigned at run time', () => {
    const r = err('np 3\nnp x + 1\nniech x 5');
    expect(r.error).toMatchObject({ line: 2, column: 4 });
    expect(r.segments).toHaveLength(1);
    expect(ok('powtorz 2 [jeśli nrpowt = 2 [np x] niech x 4]')[0].to[1]).toBe(4);
  });

  test('undeclared names are parse errors', () => {
    const r = err('np 10\nnp y');
    expect(r.error).toMatchObject({ line: 2, column: 4 });
    expect(r.segments).toEqual([]);
  });

  test('variable names may not be command words or procedure names', () => {
    expect(err('niech np 5').error).toMatchObject({ line: 1, column: 7 });
    expect(err('oto f\n np 1\njuż\nniech f 2').error).toMatchObject({ line: 4, column: 7 });
  });

  test('niech in a procedure is local and shadows the global for the rest of the call', () => {
    const src = `niech a 10
oto p
  np a
  niech a 3
  np a
już
p
np a`;
    expect(ok(src).map((s) => s.to[1] - s.from[1])).toEqual([10, 3, 10]);
  });

  test('a procedure cannot see names that belong to another procedure', () => {
    const r = err('oto p\n  niech q 1\njuż\noto r\n  np q\njuż\np r');
    expect(r.error).toMatchObject({ line: 5, column: 6 });
  });

  test('a local declared later in the procedure but unassigned on this path is a run-time error', () => {
    const r = err('oto p\n  np 1\n  np b\n  niech b 2\njuż\np');
    expect(r.error).toMatchObject({ line: 3, column: 6 });
    expect(r.segments).toHaveLength(1);
  });

  test('parameters can be reassigned and used as repeat counts and call arguments', () => {
    const src = `oto w ma: n, d
  niech d d * 2
  powtorz n [np d pw 360 / n]
już
oto v ma: k
  w k 5
już
v 4`;
    const segs = ok(src);
    expect(segs).toHaveLength(4);
    expect(segs[0].to[1]).toBe(10);
  });
});

describe('conditionals', () => {
  test('jeśli and jeżeli', () => {
    expect(ok('jeśli 1 > 2 [np 1]')).toEqual([]);
    expect(ok('jeżeli 2 > 1 [np 1] [np 2]')[0].to[1]).toBe(1);
  });

  test('jeżeli needs two bodies', () => {
    expect(err('jeżeli 1 > 0 [np 1]').error).toMatchObject({ line: 1, column: 1 });
    expect(err('jeżeli 1 > 0 [np 1] np 5').error).toMatchObject({ line: 1, column: 21 });
  });

  test('missing comparison', () => {
    expect(err('jeśli 1 [np 1]').error).toMatchObject({ line: 1, column: 9 });
  });
});

describe('procedures', () => {
  test('the brief example', () => {
    const segs = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90');
    expect(segs).toHaveLength(4);
    expect(endOf(segs)).toEqual([0, 0, 0]);
  });

  test('arguments are expressions: kwadrat 40 * 2 90 passes 80 and 90', () => {
    const segs = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 40 * 2 90');
    expect(segs[0].to).toEqual([0, 80, 0]);
    expect(segs[1].to).toEqual([80, 80, 0]);
  });

  test('a call argument may start with a sign when the previous argument ends', () => {
    expect(ok('oto f ma: a, b\n np a pw 90 np b\njuż\nf 10 -5')[1].to).toEqual([-5, 10, 0]);
  });

  test('legacy header and :param references', () => {
    expect(ok('oto kw :bok :kąt\n  powtorz 4 [np :bok pw kąt]\njuż\nkw 10 90')).toHaveLength(4);
  });

  test('definitions may come after the calls; names ignore case', () => {
    expect(ok('Kreska 5\noto kreska ma: d\n np d\njuż')).toHaveLength(1);
  });

  test('a parameter may share its name with a procedure', () => {
    const src = 'oto bok ma: bok\n  np bok\njuż\noto kw ma: bok\n  bok bok\n  pw 90\njuż\nkw 7';
    expect(ok(src)[0].to).toEqual([0, 7, 0]);
  });

  test('wrong number of arguments', () => {
    expect(err('oto f ma: a, b\n np a\njuż\nf 1').error).toMatchObject({ line: 4, column: 1 });
    expect(err('oto f ma: a, b\n np a\njuż\npowtorz 2 [f 1]').error).toMatchObject({ line: 4, column: 15 });
    expect(err('oto f ma: a\n np a\njuż\nf 1 2').error).toMatchObject({ line: 4, column: 5 });
  });

  test('definitions only at top level, once per name, ended by już alone on a line', () => {
    expect(err('powtorz 2 [\noto f\n np 1\njuż\n]').error).toMatchObject({ line: 2, column: 1 });
    expect(err('jeśli 1 = 1 [\noto f\n np 1\njuż\n]').error).toMatchObject({ line: 2, column: 1 });
    expect(err('oto f\n oto g\n np 1\n już\njuż').error).toMatchObject({ line: 2, column: 2 });
    expect(err('oto f\n np 1\njuż\noto F\n np 2\njuż').error).toMatchObject({ line: 4, column: 5 });
    expect(err('oto f\n np 1').error).toMatchObject({ line: 1, column: 1 });
    expect(err('oto f\n np 1 już').error).toMatchObject({ line: 2, column: 7 });
    expect(ok('to f\n fd 3\nend\nf')).toHaveLength(1);
    expect(ok('oto f\n np 3\njuz\nf')).toHaveLength(1);
  });

  test('recursion and stop', () => {
    const segs = ok('oto s ma: n\n  jeśli n > 3 [stop]\n  np n\n  s n + 1\njuż\ns 1');
    expect(segs.map((s) => s.to[1] - s.from[1])).toEqual([1, 2, 3]);
  });

  test('stop inside a repeat ends the enclosing call, not just the body', () => {
    const segs = ok('oto p\n  powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\n  np 100\njuż\np\nnp 7');
    expect(segs.map((s) => s.to[1] - s.from[1])).toEqual([1, 1, 7]);
  });

  test('stop at top level ends the program', () => {
    expect(ok('np 1 powtorz 3 [np 2 stop] np 3')).toHaveLength(2);
  });
});

describe('errors', () => {
  test('unknown command', () => {
    const r = err('np 10\nfoo 5');
    expect(r.error).toMatchObject({ line: 2, column: 1 });
    expect(r.error!.message).toContain('foo');
  });

  test('a missing argument is reported at the token found there, or at the command at the end', () => {
    expect(err('np').error).toMatchObject({ line: 1, column: 1 });
    expect(err('np 5\n  pw').error).toMatchObject({ line: 2, column: 3 });
    expect(err('powtorz 2 [np]').error).toMatchObject({ line: 1, column: 14 });
    expect(err('np (pw 90)').error).toMatchObject({ line: 1, column: 5 });
    expect(err('np np 10').error).toMatchObject({ line: 1, column: 4 });
    expect(err('kolor').error).toMatchObject({ line: 1, column: 1 });
    expect(err('kolor np 1').error).toMatchObject({ line: 1, column: 7 });
  });

  test('a stray value where a command is expected is reported at the value', () => {
    expect(err('np 10 20').error).toMatchObject({ line: 1, column: 7 });
    expect(err('[np 1]').error).toMatchObject({ line: 1, column: 1 });
  });

  test('unbalanced brackets and parentheses', () => {
    expect(err('powtorz 2 [np 1').error).toMatchObject({ line: 1, column: 11 });
    expect(err('np 1 ]').error).toMatchObject({ line: 1, column: 6 });
    expect(err('np (1 + 2').error).toMatchObject({ line: 1, column: 4 });
    expect(err('np 1 + 2)').error).toMatchObject({ line: 1, column: 9 });
  });

  test('width must be an integer 1–12: literal at parse time, computed at run time', () => {
    for (const w of ['0', '13', '2.5', '-1']) {
      const r = err(`np 1 grubosc ${w}`);
      expect(r.segments).toEqual([]);
      expect(r.error!.column).toBe(14);
    }
    const r = err('np 1\nniech g 20\ngrubosc g - 1\nnp 1');
    expect(r.error).toMatchObject({ line: 3, column: 9 });
    expect(r.segments).toHaveLength(1);
  });

  test('a parse error anywhere draws nothing', () => {
    const r = err('powtorz 4 [np 100 pw 90]\nnp 1 ]');
    expect(r.segments).toEqual([]);
  });

  test('messages are Polish', () => {
    expect(err('np').error!.message).toMatch(/potrzebuje/);
    expect(err('np 1/0').error!.message).toMatch(/zero/i);
  });
});

describe('limits', () => {
  test('source length', () => {
    const r = err('np 1 ' + ' '.repeat(50_000));
    expect(r.segments).toEqual([]);
  });

  test('token count', () => {
    expect(run('np 1\n'.repeat(5000), '2d').error).toBeNull();
    const r = err('pw 1\n'.repeat(5000) + 'pw');
    expect(r.error!.line).toBe(5001);
  });

  test('bracket nesting depth 32', () => {
    const deep = (n: number) => 'powtorz 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    expect(run(deep(31), '2d').error).toBeNull();
    expect(err(deep(33)).error).toMatchObject({ line: 1, column: 1 + 11 * 32 + 10 });
  });

  test('32 active frames', () => {
    const rec = (n: number) => `oto f ma: n\n  jeśli n = 0 [stop]\n  f n - 1\njuż\nf ${n}`;
    expect(run(rec(31), '2d').error).toBeNull();
    expect(run(rec(32), '2d').error).toMatchObject({ line: 3, column: 3 });
    // repeats count as frames too
    const nested = (n: number) => 'powtorz 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    expect(run(nested(32), '2d').error).toBeNull();
  });

  test('executed operations: each command plus one per finished iteration', () => {
    // 1 (repeat) + 4999 × (1 command + 1 finished iteration) = 9999
    expect(run('powtorz 4999 [pw 1]', '2d').error).toBeNull();
    expect(run('np 1 powtorz 4999 [pw 1]', '2d').error).toBeNull();
    const r = err('np 1 powtorz 4999 [pw 1] np 1 np 1');
    expect(r.error!.message).toMatch(/10 000/);
    expect(r.segments).toHaveLength(1);
    // a call costs 1 plus 1 when it finishes; a conditional costs 1 plus 1 for a finished body
    expect(run('oto f\njuż\n' + 'f\n'.repeat(5000), '2d').error).toBeNull();
    expect(run('oto f\njuż\n' + 'f\n'.repeat(5000) + 'np 1', '2d').error).not.toBeNull();
    expect(run('powtorz 3333 [jeśli 1 = 1 []]', '2d').error).toBeNull();
    expect(run('powtorz 3334 [jeśli 1 = 1 []]', '2d').error).not.toBeNull();
    expect(run('powtorz 4999 [jeśli 1 = 2 []]', '2d').error).toBeNull();
    expect(run('powtorz 5000 [jeśli 1 = 2 []]', '2d').error).not.toBeNull();
  });

  test('kept segments are counted after czyść (the operation limit is reached first in practice)', () => {
    const r = run('powtorz 4999 [np 1]', '2d');
    expect(r.error).toBeNull();
    expect(r.segments).toHaveLength(4999);
    const c = run('powtorz 3000 [np 1]\nczyść\npowtorz 1000 [np 1]', '2d');
    expect(c.error).toBeNull();
    expect(c.segments).toHaveLength(1000);
  });

  test('coordinates stay within ±100000', () => {
    expect(run('np 100000', '2d').error).toBeNull();
    const r = err('np 50\nnp 100000');
    expect(r.error).toMatchObject({ line: 2, column: 1 });
    expect(r.segments).toHaveLength(1);
  });

  test('a run-time error after czyść keeps only what was drawn after it', () => {
    const r = err('np 5 czyść np 7 np 1/0');
    expect(r.segments).toEqual([{ from: [0, 5, 0], to: [0, 12, 0], color: '#16866a', width: 3 }]);
  });
});
