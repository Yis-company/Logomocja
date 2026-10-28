import { describe, expect, test } from 'bun:test';
import { runProgram, type Segment } from '../src/logo/index';
import type { Mode } from '../src/logo/vocab';

const run = (src: string, mode: Mode = '2d') => runProgram(src, mode);
const ends = (segs: Segment[]) => segs.map((s) => s.to);
const near = (a: number[], b: number[]) => a.every((v, i) => Math.abs(v - b[i]) < 1e-9);

describe('expressions', () => {
  test('precedence and left association', () => {
    expect(ends(run('np 20 - 5 - 3').segments)).toEqual([[0, 12, 0]]);
    expect(ends(run('np 2 + 3 * 4').segments)).toEqual([[0, 14, 0]]);
  });
  test('binary operators need spaces on both sides or neither', () => {
    expect(ends(run('np 10 - 5').segments)).toEqual([[0, 5, 0]]);
    expect(ends(run('np 10-5').segments)).toEqual([[0, 5, 0]]);
    const bad = run('np 10 -5');
    expect(bad.error).toMatchObject({ line: 1, column: 7 });
    expect(bad.segments).toEqual([]);
  });
  test('stacked unary signs', () => {
    expect(ends(run('np - -2').segments)).toEqual([[0, 2, 0]]);
    expect(ends(run('np -(3 - 5)').segments)).toEqual([[0, 2, 0]]);
  });
  test('division by zero is a run-time error at the argument', () => {
    const r = run('np 5\nnp 1/0');
    expect(r.error).toEqual({ message: 'Dzielenie przez zero.', line: 2, column: 4 });
    expect(r.segments.length).toBe(1);
  });
  test('comparisons are exact', () => {
    expect(run('jeśli 0.1 + 0.2 = 0.3 [np 1]').segments).toEqual([]);
  });
});

describe('turtle geometry', () => {
  test('flat commands are exact at right angles', () => {
    expect(ends(run('powtorz 4 [np 100 pw 90]').segments)).toEqual([
      [0, 100, 0], [100, 100, 0], [100, 0, 0], [0, 0, 0],
    ]);
  });
  test('left turn and backward move', () => {
    expect(ends(run('lw 90 np 10').segments)).toEqual([[-10, 0, 0]]);
    expect(ends(run('ws 10').segments)).toEqual([[0, -10, 0]]);
  });
  test('pitch up after 90 degrees heads up', () => {
    const r = run('gora 90 np 10', '3d');
    expect(near(r.segments[0].to, [0, 0, 10])).toBe(true);
  });
  test('roll right after 90 degrees makes up the former right', () => {
    const r = run('pp 90 gora 90 np 5', '3d');
    expect(near(r.segments[0].to, [5, 0, 0])).toBe(true);
  });
  test('pitch and roll are errors in 2D', () => {
    expect(run('gora 90').error?.message).toContain('3D');
    expect(run('pp 10').error?.message).toContain('3D');
  });
  test('dom returns home with a segment and keeps the pen state', () => {
    const r = run('np 10 pw 90 np 10 dom');
    expect(ends(r.segments)).toEqual([[0, 10, 0], [10, 10, 0], [0, 0, 0]]);
  });
  test('cs forgets earlier segments only', () => {
    const r = run('np 5 cs np 3');
    expect(r.segments.length).toBe(1);
    expect(r.segments[0].from).toEqual([0, 5, 0]);
  });
  test('pen up and zero moves draw nothing; colour and width are applied', () => {
    const r = run('kolor "#C1763D" grubosc 7 pu np 5 opu np 0 np 1');
    expect(r.segments).toEqual([
      { from: [0, 5, 0], to: [0, 6, 0], color: '#c1763d', width: 7 },
    ]);
  });
});

describe('repeat, nrpowt and variables', () => {
  test('repeat count 0 runs nothing and nrpowt counts from 1', () => {
    expect(run('powtorz 0 [np 1]').segments).toEqual([]);
    expect(ends(run('powtorz 3 [np nrpowt]').segments)).toEqual([[0, 1, 0], [0, 3, 0], [0, 6, 0]]);
  });
  test('nrpowt outside a repeat is a parse error', () => {
    expect(run('np nrpowt').error?.message).toContain('nrpowt');
    expect(run('oto f\nnp nrpowt\njuz\nf').error?.message).toContain('nrpowt');
  });
  test('repeat count range is checked when literal', () => {
    expect(run('powtorz 10001 [np 1]').error?.column).toBe(9);
    expect(run('powtorz 1.5 [np 1]').error).not.toBeNull();
  });
  test('width range is checked', () => {
    expect(run('grubosc 13').error).not.toBeNull();
    expect(run('grubosc 0').error).not.toBeNull();
    expect(run('grubosc 12').error).toBeNull();
  });
  test('variables assigned at top level are visible in procedures', () => {
    expect(ends(run('niech x 4\noto f\nnp x\njuz\nf').segments)).toEqual([[0, 4, 0]]);
  });
  test('an unassigned variable is a run-time error at the argument', () => {
    const r = run('niech y 1\nnp y\nniech z y\nnp z - 1');
    expect(r.error).toBeNull();
    const bad = run('oto f\nniech a 1\njuz\nf\nnp a');
    expect(bad.error?.message).toContain('Nieznana nazwa');
  });
  test('locals shadow globals only inside the call', () => {
    const src = 'niech v 1\noto f\nniech v 5\nnp v\njuz\nf\nnp v';
    expect(ends(run(src).segments)).toEqual([[0, 5, 0], [0, 6, 0]]);
  });
  test('legacy colon references', () => {
    expect(ends(run('oto f :d\nnp :d\njuz\nf 7').segments)).toEqual([[0, 7, 0]]);
  });
});

describe('conditionals, procedures and stop', () => {
  test('ifelse picks the right body', () => {
    expect(ends(run('jeżeli 2 > 1 [np 1] [np 2]').segments)).toEqual([[0, 1, 0]]);
    expect(ends(run('jeżeli 2 < 1 [np 1] [np 2]').segments)).toEqual([[0, 2, 0]]);
  });
  test('stop inside a repeat ends the procedure', () => {
    const src = 'oto f\npowtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\njuz\nf\nnp 10';
    expect(ends(run(src).segments).length).toBe(2 + 1);
  });
  test('stop at top level ends the program quietly', () => {
    expect(run('np 1 stop np 5').segments.length).toBe(1);
  });
  test('recursion works and calls may precede definitions', () => {
    const r = run('f 3\noto f ma: n\njeśli n = 0 [stop]\nnp 1\nf n - 1\njuz');
    expect(r.error).toBeNull();
    expect(r.segments.length).toBe(3);
  });
  test('definitions inside a body are errors', () => {
    expect(run('powtorz 2 [\noto f\njuz\n]').error?.message).toContain('wewnątrz');
  });
  test('a missing już is an error at the header', () => {
    const r = run('oto f\nnp 1');
    expect(r.error).toMatchObject({ line: 1, column: 1 });
  });
  test('wrong argument count is reported at the call', () => {
    expect(run('oto f ma: a, b\njuz\nf 1').error).toMatchObject({ line: 3, column: 1 });
  });
  test('the parameter may share the name of a procedure', () => {
    const r = run('oto bok ma: bok\nnp bok\njuz\nbok 4');
    expect(ends(r.segments)).toEqual([[0, 4, 0]]);
  });
  test('infinite recursion hits the frame limit', () => {
    const r = run('oto f\nf\njuz\nf');
    expect(r.error?.message).toContain('32');
  });
  test('the operations limit stops a long loop and keeps what was drawn', () => {
    const r = run('powtorz 10000 [powtorz 10000 [np 0]]');
    expect(r.error?.message).toContain('10000 operacji');
    const half = run('powtorz 5000 [np 1]');
    expect(half.error?.message).toContain('10000 operacji');
    expect(half.segments.length).toBe(5000);
    expect(run('powtorz 3000 [np 1]').error).toBeNull();
  });
});

describe('syntax and errors', () => {
  test('names and commands ignore case, accents are optional', () => {
    expect(ends(run('NP 5 PW 90 Np 5').segments)).toEqual([[0, 5, 0], [5, 5, 0]]);
    expect(run('jesli 1 < 2 [naprzod 1]').segments.length).toBe(1);
  });
  test('comments run to the end of the line', () => {
    expect(run('; np 100\nnp 2 ; np 5').segments.length).toBe(1);
  });
  test('numbers are unsigned literals', () => {
    expect(run('np 1e3').error).not.toBeNull();
    expect(run('np .5').error).toBeNull();
  });
  test('unknown commands and unbalanced brackets are reported in place', () => {
    expect(run('np 1\nfoo').error).toMatchObject({ line: 2, column: 1 });
    expect(run('powtorz 2 [np 1').error?.message).toContain('[');
    expect(run('np 1 ]').error?.message).toContain(']');
  });
  test('colour literal must be quoted six digits', () => {
    expect(run('kolor "#fff"').error).not.toBeNull();
    expect(run('kolor 5').error).not.toBeNull();
  });
  test('parse errors draw nothing', () => {
    const r = run('np 10\nnp');
    expect(r.segments).toEqual([]);
    expect(r.error).toMatchObject({ line: 2 });
  });
  test('source length limit', () => {
    expect(run('; ' + 'x'.repeat(50000)).error?.message).toContain('50000');
  });
});
