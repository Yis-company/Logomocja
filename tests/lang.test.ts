import { describe, expect, test } from 'bun:test';
import { runProgram } from '../src/lang';

const run = (s: string, m: '2d' | '3d' = '2d') => runProgram(s, m);
const ends = (s: string, m: '2d' | '3d' = '2d') => run(s, m).segments.map((x) => x.to.map((v) => Math.round(v * 1e6) / 1e6));
const err = (s: string, m: '2d' | '3d' = '2d') => {
  const r = run(s, m);
  return r.error ? [r.error.line, r.error.column] : null;
};

describe('lexical rules', () => {
  test('case and aliases', () => {
    expect(ends('NP 10')).toEqual([[0, 10, 0]]);
    expect(ends('Naprzód 10 FORWARD 5')).toEqual([[0, 10, 0], [0, 15, 0]]);
    expect(ends('CZYŚĆ np 3')).toEqual([[0, 3, 0]]);
  });
  test('comments and numbers', () => {
    expect(ends('np .5 ; comment\nnp 12.5')).toEqual([[0, 0.5, 0], [0, 13, 0]]);
    expect(err('np 1e3')).toEqual([1, 4]);
    expect(err('np 0x10')).toEqual([1, 4]);
    expect(err('np NaN')).toEqual([1, 4]);
    expect(err('np Infinity')).toEqual([1, 4]);
  });
  test('colour literal', () => {
    expect(run('kolor "#ABCDEF" np 1').segments[0].color).toBe('#abcdef');
    expect(err('kolor "#abc"')).toEqual([1, 7]);
    expect(err('kolor 5')).toEqual([1, 7]);
    expect(err('kolor')).toEqual([1, 1]);
  });
});

describe('expressions', () => {
  test('precedence and associativity', () => {
    expect(ends('np 20 - 5 - 3')).toEqual([[0, 12, 0]]);
    expect(ends('np 2 + 3 * 4')).toEqual([[0, 14, 0]]);
    expect(ends('np 100 / 10 / 2')).toEqual([[0, 5, 0]]);
  });
  test('whitespace rule', () => {
    expect(ends('np 10 - 5')).toEqual([[0, 5, 0]]);
    expect(ends('np 10-5')).toEqual([[0, 5, 0]]);
    expect(err('np 10 -5')).toEqual([1, 7]);
    expect(err('np 10- 5')).toEqual([1, 6]);
    expect(err('np 10 *5')).toEqual([1, 7]);
  });
  test('unary', () => {
    expect(ends('np -(3 - 5)')).toEqual([[0, 2, 0]]);
    expect(ends('np - -2')).toEqual([[0, 2, 0]]);
    expect(ends('niech bok 4 np -bok')).toEqual([[0, -4, 0]]);
    expect(ends('np +-+3')).toEqual([[0, -3, 0]]);
  });
  test('division by zero reported at the argument start', () => {
    const r = run('np 5\nnp 3 + 1 / 0');
    expect(r.error?.line).toBe(2);
    expect(r.error?.column).toBe(4);
    expect(r.segments.length).toBe(1);
  });
  test('exact comparison', () => {
    expect(ends('jeśli 0.1 + 0.2 = 0.3 [np 5]')).toEqual([]);
    expect(ends('jeśli 0.1 + 0.2 <> 0.3 [np 5]')).toEqual([[0, 5, 0]]);
  });
  test('legacy colon names', () => {
    expect(ends('oto k :a\n np :a\nuż\nk 4'.replace('uż', 'już'))).toEqual([[0, 4, 0]]);
  });
});

describe('turtle', () => {
  test('rotations 2d', () => {
    expect(ends('pw 90 np 10')).toEqual([[10, 0, 0]]);
    expect(ends('lw 90 np 10')).toEqual([[-10, 0, 0]]);
    expect(ends('ws 10')).toEqual([[0, -10, 0]]);
    expect(ends('pw -90 np 10')).toEqual([[-10, 0, 0]]);
  });
  test('3d rotations', () => {
    expect(ends('gora 90 np 10', '3d')).toEqual([[0, 0, 10]]);
    expect(ends('dol 90 np 10', '3d')).toEqual([[0, 0, -10]]);
    // pp 90: up becomes former right, so gora 90 heads to +X
    expect(ends('pp 90 gora 90 np 10', '3d')).toEqual([[10, 0, 0]]);
    // after pp 90 the right vector is the former down: pw 90 then goes -Z
    expect(ends('pp 90 pw 90 np 10', '3d')).toEqual([[0, 0, -10]]);
    expect(ends('pl 90 gora 90 np 10', '3d')).toEqual([[-10, 0, 0]]);
  });
  test('3d commands rejected in 2d', () => {
    for (const c of ['gora 5', 'dol 5', 'pp 5', 'pl 5']) {
      const r = run(`np 5\n  ${c}`);
      expect(r.error?.line).toBe(2);
      expect(r.error?.column).toBe(3);
      expect(r.segments).toEqual([]);
    }
  });
  test('pen and zero moves', () => {
    expect(run('pod np 10 opu np 5').segments.length).toBe(1);
    expect(run('np 0').segments.length).toBe(0);
  });
  test('dom', () => {
    const r = run('np 10 pw 90 np 10 dom np 5');
    expect(r.segments.length).toBe(4);
    expect(r.segments[2].to).toEqual([0, 0, 0]);
    expect(r.segments[3].to).toEqual([0, 5, 0]);
    expect(run('dom').segments.length).toBe(0);
    expect(run('pod np 10 dom opu np 1').segments.length).toBe(1);
  });
  test('czyść', () => {
    const r = run('np 10 czyść np 5');
    expect(r.segments.length).toBe(1);
    expect(r.segments[0].from).toEqual([0, 10, 0]);
  });
  test('width', () => {
    expect(run('grubosc 12 np 1').segments[0].width).toBe(12);
    expect(err('grubosc 13')).toEqual([1, 9]);
    expect(err('grubosc 0')).toEqual([1, 9]);
    expect(err('grubosc 2.5')).toEqual([1, 9]);
    // literal -> parse time: nothing drawn
    expect(run('np 5 grubosc 13').segments).toEqual([]);
    // from a name -> run time: keeps drawing
    const r = run('niech w 13 np 5 grubosc w');
    expect(r.segments.length).toBe(1);
    expect(r.error?.column).toBe(25);
  });
});

describe('repeat, variables, conditionals', () => {
  test('nrpowt', () => {
    expect(ends('powtorz 3 [np nrpowt]')).toEqual([[0, 1, 0], [0, 3, 0], [0, 6, 0]]);
    expect(ends('powtorz 2 [powtorz 2 [np nrpowt] np nrpowt * 10]').map((p) => p[1])).toEqual([1, 3, 13, 14, 16, 36]);
    expect(err('np nrpowt')).toEqual([1, 4]);
    expect(err('oto a\n np nrpowt\njuż\npowtorz 2 [a]')).toEqual([2, 5]);
  });
  test('repeat count validation', () => {
    expect(err('powtorz 10001 [np 1]')).toEqual([1, 9]);
    expect(err('powtorz -1 [np 1]')).toEqual([1, 9]);
    expect(err('powtorz 1.5 [np 1]')).toEqual([1, 9]);
    expect(run('powtorz 0 [np 1]').error).toBeNull();
  });
  test('variables', () => {
    expect(ends('niech x 5 niech x x * 2 np x')).toEqual([[0, 10, 0]]);
    expect(err('np y')).toEqual([1, 4]);
    expect(ends('np g niech g 3')).toBeDefined();
    expect(err('np g niech g 3')).toEqual([1, 4]); // declared but unassigned: run-time
    expect(err('niech np 3')).toEqual([1, 7]);
    expect(err('oto f\n np 1\nju\n')).not.toBeNull();
  });
  test('procedure locals shadow globals', () => {
    const src = 'niech x 5\noto f\n niech x 1\n np x\nuż\nf np x';
    expect(err(src)).not.toBeNull(); // "uż" typo
    const ok = 'niech x 5\noto f\n niech x 1\n np x\nj' + 'uż\nf np x';
    expect(ends(ok.replace('już', 'już'))).toEqual([[0, 1, 0], [0, 6, 0]]);
  });
  test('if/ifelse', () => {
    expect(ends('jeśli 1 < 2 [np 1] np 2')).toEqual([[0, 1, 0], [0, 3, 0]]);
    expect(ends('jeżeli 1 > 2 [np 1] [np 2]')).toEqual([[0, 2, 0]]);
  });
});

describe('procedures', () => {
  test('definition forms', () => {
    const a = 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\nju' + 'ż\nkwadrat 40 * 2 90';
    expect(ends(a.replace('już', 'już')).length).toBe(4);
    expect(ends(a.replace('już', 'już'))[0]).toEqual([0, 80, 0]);
    const b = 'to k :a :b\n np :a pw b\nend\nk 3 90 K 4 90';
    expect(ends(b)).toEqual([[0, 3, 0], [4, 3, 0]]);
  });
  test('calls before definitions and recursion', () => {
    const src = 'f 3\noto f ma: n\n jeśli n = 0 [stop]\n np n\n f n - 1\nju' + 'ż';
    expect(ends(src.replace('już', 'już')).map((p) => p[1])).toEqual([3, 5, 6]);
  });
  test('stop inside repeat ends the call', () => {
    const src = 'oto f\n powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\n np 100\nju' + 'ż\nf np 7';
    expect(ends(src.replace('już', 'już')).map((p) => p[1])).toEqual([1, 2, 9]);
    expect(ends('np 1 stop np 2')).toEqual([[0, 1, 0]]);
  });
  test('parameter may share a procedure name', () => {
    const src = 'oto a ma: b\n np b\nju' + 'ż\noto b ma: a\n a a\nju' + 'ż\nb 4';
    expect(ends(src.replace(/już/g, 'już'))).toEqual([[0, 4, 0]]);
  });
  test('errors', () => {
    expect(err('oto f\n np 1')).toEqual([1, 1]); // missing już
    expect(err('powtorz 2 [\noto f\nju' + 'ż\n]')).toEqual([2, 1]);
    expect(err('oto f ma: a\n np a\njuż\nf')).toEqual([4, 1]);
    expect(err('oto f ma: a\n np a\njuż\nf 1 2')).toEqual([4, 5]);
    expect(err('oto f\njuż\noto f\njuż')).toEqual([3, 5]);
    expect(err('foo 3')).toEqual([1, 1]);
    expect(err('np 5 5')).toEqual([1, 6]);
  });
});

describe('errors and limits', () => {
  test('brackets', () => {
    expect(err('powtorz 2 [np 1')).toEqual([1, 11]);
    expect(err('np 1 ]')).toEqual([1, 6]);
    expect(err('np (1 + 2')).toEqual([1, 4]);
    expect(err('np 1 + 2)')).toEqual([1, 9]);
    expect(err('np')).toEqual([1, 1]);
    expect(err('np ]')).toEqual([1, 4]);
  });
  test('parse error draws nothing, run error keeps drawing', () => {
    expect(run('np 5 foo').segments).toEqual([]);
    const r = run('np 5 np 1 / 0');
    expect(r.segments.length).toBe(1);
    expect(r.error?.message).toContain('zero');
  });
  test('operation limit', () => {
    expect(run('powtorz 4999 [np 1]').error).toBeNull();
    expect(run('powtorz 5000 [np 1]').error).not.toBeNull();
  });
  test('segment limit', () => {
    expect(run('powtorz 3000 [np 1]\nczyść powtorz 3000 [np 1]').error).not.toBeNull();
  });
  test('frame limit', () => {
    expect(run('oto f ma: n\n f n + 1\nju' + 'ż\nf 0'.replace('', '')).error).not.toBeNull();
    let nested = 'np 1';
    for (let i = 0; i < 32; i++) nested = `powtorz 1 [${nested}]`;
    expect(run(nested).error).toBeNull();
    expect(run(`powtorz 1 [${nested}]`).error).not.toBeNull();
    expect(run('powtorz 1 [' .repeat(32) + 'np 1' + ']'.repeat(32)).error).toBeNull();
    expect(run('powtorz 1 ['.repeat(33) + 'np 1' + ']'.repeat(33)).error).not.toBeNull();
  });
  test('coordinate limit', () => {
    expect(run('np 100000').error).toBeNull();
    expect(run('np 100001').error).not.toBeNull();
  });
  test('source and token limits', () => {
    expect(run('np 1 ;' + 'x'.repeat(50000)).error).not.toBeNull();
    expect(run('np 1 '.repeat(5001)).error).not.toBeNull();
    expect(run('pod '.repeat(2500)).error).toBeNull();
  });
});
