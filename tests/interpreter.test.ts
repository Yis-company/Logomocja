import { describe, expect, test } from 'bun:test';
import { runSource, checkSource, type Segment } from '../src/logo';

const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 1e-6);
const end = (segs: Segment[]) => segs[segs.length - 1]?.to;
const ok = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = runSource(src, mode);
  expect(r.error).toBeNull();
  return r.segments;
};
const fails = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = runSource(src, mode);
  expect(r.error).not.toBeNull();
  return r;
};

describe('movement and turning', () => {
  test('np moves along +Y and draws with defaults', () => {
    const s = ok('np 10');
    expect(s).toEqual([{ from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 }]);
  });

  test('ws moves backwards', () => {
    expect(end(ok('ws 10'))).toEqual([0, -10, 0]);
  });

  test('pw turns clockwise seen from above; lw turns the other way', () => {
    expect(near(end(ok('pw 90 np 10'))!, [10, 0, 0])).toBe(true);
    expect(near(end(ok('lw 90 np 10'))!, [-10, 0, 0])).toBe(true);
  });

  test('a move of zero draws nothing', () => {
    expect(ok('np 0 ws 0')).toEqual([]);
  });

  test('pen up moves without drawing', () => {
    expect(ok('pod np 10 opu np 0')).toEqual([]);
    expect(ok('pod np 10').length).toBe(0);
  });

  test('gora 90 heads along the former up vector; pitch is 3D only', () => {
    const s = ok('gora 90 np 10', '3d');
    expect(near(end(s)!, [0, 0, 10])).toBe(true);
    const down = ok('dol 90 np 10', '3d');
    expect(near(end(down)!, [0, 0, -10])).toBe(true);
    fails('gora 90 np 10', '2d');
  });

  test('pp rolls the up vector towards the right: after pp 90 the right vector points down', () => {
    // pp 90 leaves the heading alone but turns the up vector to +X; a right turn about that up heads to -Z.
    const s = ok('pp 90 pw 90 np 10', '3d');
    expect(near(end(s)!, [0, 0, -10])).toBe(true);
  });

  test('pl rolls the other way', () => {
    const s = ok('pl 90 pw 90 np 10', '3d');
    expect(near(end(s)!, [0, 0, 10])).toBe(true);
  });

  test('a flat program gives identical drawings in 2D and 3D', () => {
    const src = 'powtorz 7 [np 13 pw 51 niech x nrpowt * 2 np x lw 17]';
    expect(ok(src, '2d')).toEqual(ok(src, '3d'));
  });

  test('dom returns to the origin and draws the way back when pen is down', () => {
    const s = ok('np 10 pw 90 np 10 dom');
    expect(near(end(s)!, [0, 0, 0])).toBe(true);
    expect(s.length).toBe(3);
  });

  test('dom resets the heading to +Y', () => {
    const s = ok('pw 90 dom np 5');
    expect(near(end(s)!, [0, 5, 0])).toBe(true);
  });

  test('czyść forgets earlier segments only', () => {
    const s = ok('np 10 kolor "#c1763d" cs np 5');
    expect(s.length).toBe(1);
    expect(s[0].color).toBe('#c1763d');
    expect(near(s[0].from, [0, 10, 0])).toBe(true);
  });

  test('pen state, colour and width persist', () => {
    const s = ok('kolor "#AABBCC" grubosc 7 np 1 pod np 1 opu np 1');
    expect(s.length).toBe(2);
    expect(s.every((x) => x.color === '#aabbcc' && x.width === 7)).toBe(true);
  });
});

describe('expressions', () => {
  test('precedence and left association', () => {
    expect(end(ok('np 20 - 5 - 3'))![1]).toBe(12);
    expect(end(ok('np 2 + 3 * 4'))![1]).toBe(14);
  });

  test('binary operators need whitespace on both sides or on neither', () => {
    expect(end(ok('np 10 - 5'))![1]).toBe(5);
    expect(end(ok('np 10-5'))![1]).toBe(5);
    const r = fails('np 10 -5');
    expect(r.error!.column).toBe(7);
  });

  test('unary signs stack anywhere an operand is expected', () => {
    expect(end(ok('np -(3 - 5)'))![1]).toBe(2);
    expect(end(ok('np - -2'))![1]).toBe(2);
    expect(end(ok('niech b 4 np -b'))![1]).toBe(-4);
  });

  test('comparisons are exact', () => {
    expect(ok('jeśli 0.1 + 0.2 = 0.3 [np 5]')).toEqual([]);
    expect(ok('jeśli 0.5 = 0.25 * 2 [np 5]').length).toBe(1);
  });

  test('division by zero is a run-time error that keeps the drawing', () => {
    const r = fails('np 10 np 1 / 0');
    expect(r.segments.length).toBe(1);
    expect(r.error!.message).toContain('zero');
    expect(r.error!.column).toBe(10);
  });

  test('an unassigned variable is a run-time error at the first token of its argument', () => {
    const r = fails('np 3\njeśli 1 > 2 [niech z 1]\nnp 5 + z');
    expect(r.error!.line).toBe(3);
    expect(r.error!.column).toBe(4);
    expect(r.segments.length).toBe(1);
  });

  test('an undeclared name is a parse-time error', () => {
    expect(fails('np 1 + y').segments).toEqual([]);
  });
});

describe('variables and procedures', () => {
  test('niech at top level is global', () => {
    expect(end(ok('niech x 5 np x'))![1]).toBe(5);
  });

  test('niech inside a procedure is local and shadows the global', () => {
    const s = ok('niech x 1\noto g\n niech x 7\n np x\njuz\ng\nnp x');
    expect(s.map((x) => x.to[1])).toEqual([7, 8]);
  });

  test('parameters, legacy :name form and calls with expression arguments', () => {
    const s = ok('oto kw :bok\n powtorz 4 [np :bok pw 90]\njuz\nkw 40 * 2');
    expect(end(s)!.map((v) => Math.round(v))).toEqual([0, 0, 0]);
    expect(s.length).toBe(4);
    expect(s[0].to[1]).toBe(80);
  });

  test('procedures may be called before they are defined', () => {
    expect(ok('f 5\noto f ma: a\n np a\njuz').length).toBe(1);
  });

  test('a call with the wrong number of arguments is an error at the extra argument', () => {
    const r = fails('oto f ma: a\n np a\njuz\nf 1 2');
    expect(r.error!.line).toBe(4);
    expect(r.error!.column).toBe(5);
  });

  test('a name that is neither parameter nor variable is a parse-time error', () => {
    const r = fails('np 1\noto f\n np q\njuz\nf');
    expect(r.segments).toEqual([]);
  });

  test('stop ends the procedure, and at top level ends the program', () => {
    expect(ok('oto f\n np 1\n stop\n np 5\njuz\nf np 2').length).toBe(2);
    expect(ok('np 1 stop np 2').length).toBe(1);
  });

  test('a stop inside a repeat ends the enclosing procedure', () => {
    const s = ok('oto f\n powtorz 5 [np 1 stop]\njuz\nf np 10');
    expect(s.length).toBe(2);
  });

  test('procedures may call themselves', () => {
    const s = ok('oto r ma: n\n jeśli n > 0 [np 1 r n - 1]\njuz\nr 4');
    expect(s.length).toBe(4);
  });

  test('a definition inside a body is an error', () => {
    fails('powtorz 2 [oto f\n np 1\njuz]');
  });

  test('a missing już is an error', () => {
    fails('oto f\n np 1');
  });

  test('a name cannot be a command word', () => {
    fails('niech np 5');
  });
});

describe('repeat and conditionals', () => {
  test('nrpowt counts iterations from 1', () => {
    const s = ok('powtorz 3 [np nrpowt * 10]');
    expect(s.map((x) => x.to[1])).toEqual([10, 30, 60]);
  });

  test('nrpowt in a procedure body that is not inside a repeat is a parse error', () => {
    const r = fails('oto f\n np nrpowt\njuz\npowtorz 2 [f]');
    expect(r.segments).toEqual([]);
    expect(r.error!.line).toBe(2);
  });

  test('nrpowt outside any repeat is a parse error', () => {
    fails('np nrpowt');
  });

  test('a repeat count must be an integer from 0 to 10000', () => {
    expect(ok('powtorz 0 [np 1]')).toEqual([]);
    fails('powtorz 10001 [np 1]');
    fails('powtorz 2.5 [np 1]');
  });

  test('ifelse runs one of two bodies', () => {
    expect(ok('jeżeli 1 > 2 [np 1] [np 2]')[0].to[1]).toBe(2);
  });
});

describe('parse-time and run-time errors', () => {
  test('a parse-time error draws nothing', () => {
    const r = fails('np 10 np 10 kolor "#zzz"');
    expect(r.segments).toEqual([]);
    expect(r.error!.column).toBe(19);
  });

  test('a run-time error keeps the drawing so far', () => {
    const r = fails('np 5 niech x 1 / 0 np 5');
    expect(r.segments.length).toBe(1);
  });

  test('grubosc outside 1-12 is a parse-time error at the argument', () => {
    const r = fails('np 1 grubosc 13');
    expect(r.error!.column).toBe(14);
  });

  test('unknown commands and unbalanced brackets are reported with positions', () => {
    expect(fails('np 1 blabla').error!.column).toBe(6);
    expect(fails('powtorz 2 [np 1').error!.column).toBe(11);
  });

  test('colour literals must be quoted six-digit hex', () => {
    fails('kolor #16866a');
    fails('kolor "#1686"');
  });

  test('numbers in other notations are errors', () => {
    fails('np 1e3');
    fails('np NaN');
    fails('np 0x10');
  });

  test('checkSource reports parse errors only', () => {
    expect(checkSource('np 5', '2d')).toBeNull();
    expect(checkSource('np', '2d')).not.toBeNull();
  });
});

describe('limits', () => {
  test('the operation limit stops execution and keeps the drawing', () => {
    const r = fails('powtorz 10000 [np 1 pw 1]');
    expect(r.error!.message).toContain('operacji');
    expect(r.segments.length).toBeGreaterThan(0);
  });

  test('the segment limit is enforced', () => {
    const r = runSource('powtorz 10000 [np 1 pw 1 np 0 pod pw 1 np 1 pw 0 opu]', '2d');
    expect(r.segments.length).toBeLessThanOrEqual(10_000);
  });

  test('coordinates are limited to plus or minus 100000', () => {
    const r = fails('np 99999 np 99999');
    expect(r.segments.length).toBe(1);
  });

  test('recursion depth is limited to 32 frames', () => {
    const r = fails('oto f ma: n\n f n + 1\njuz\nf 1');
    expect(r.error!.message).toContain('32');
  });

  test('source length is limited', () => {
    const r = fails('np 1 '.repeat(12_000));
    expect(r.error!.message).toContain('długi');
  });

  test('bracket nesting is limited to 32', () => {
    const deep = 'powtorz 1 ['.repeat(33) + 'np 1' + ']'.repeat(33);
    fails(deep);
  });
});
