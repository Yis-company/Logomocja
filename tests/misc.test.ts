import { describe, expect, test } from 'bun:test';
import { ok, fails, failsAt, parseFails, parseFailsAt, closeSeg, closeVec, dy, last } from './helpers';

const len = (src: string) => dy(ok(src));

describe('error positions', () => {
  test('unknown command', () => {
    parseFailsAt('foo 10', 1, 1);
    parseFailsAt('np 10 xyz', 1, 7);
    parseFailsAt('np 10\n  pw 90\n  foo', 3, 3);
    parseFailsAt('powtorz 2 [np 1 foo]', 1, 17);
  });
  test('stray values where a command is expected', () => {
    parseFailsAt('10', 1, 1);
    parseFailsAt('np 10 20', 1, 7);
    parseFailsAt('np 10 (5)', 1, 7);
    parseFailsAt('np 1\n  7', 2, 3);
  });
  test('columns count characters, accented letters included', () => {
    parseFailsAt('naprzód 10 foo', 1, 12);
    parseFailsAt('powtórz 2 [np 1] źle', 1, 18);
  });
  test('parse-time error anywhere means nothing is drawn', () => {
    parseFailsAt('np 10\nnp 20\npowtorz 3 [np 1]\nfoo', 4, 1);
  });
});

describe('run-time argument checks through parameters', () => {
  test('repeat count from a parameter', () => {
    const r = failsAt('oto p ma: n\npowtorz n [np 1]\njuż\nnp 1\np 2.5', 2, 9);
    expect(r.segments.length).toBe(1);
  });
  test('width from a parameter', () => {
    const r = failsAt('oto p ma: n\ngrubosc n + 1\nnp 1\njuż\np 4\np 12', 2, 9);
    expect(r.segments.map((s) => s.width)).toEqual([5]);
  });
  test('unassigned variable in a call argument is reported at the argument', () => {
    const r = failsAt('oto p ma: a, b\nnp a\njuż\nnp 1\np 1 3 * y\nniech y 2', 5, 5);
    expect(r.segments.length).toBe(1);
  });
  test('nrpowt passed as an argument', () => {
    expect(len('oto p ma: k\nnp k\njuż\npowtorz 3 [p nrpowt]')).toEqual([1, 2, 3]);
  });
});

describe('miscellaneous semantics', () => {
  test('ws with a negative distance moves forward', () => {
    expect(len('ws -5')).toEqual([5]);
  });
  test('turn by an expression', () => {
    closeVec(last(ok('pw 45 * 2 np 3')), [3, 0, 0]);
  });
  test('dom in 3D draws back to the origin', () => {
    const s = ok('gora 90 np 10 dom', '3d');
    expect(s.length).toBe(2);
    closeSeg(s[1], [0, 0, 10], [0, 0, 0]);
  });
  test('accented variable names', () => {
    expect(len('niech kąt 5 np kąt')).toEqual([5]);
  });
  test('name declared inside nested bodies of a procedure', () => {
    expect(len('oto p\npowtorz 1 [jeśli 1 = 1 [niech q 2]]\nnp q\njuż\np')).toEqual([2]);
  });
  test('sequential (non-nested) frames do not accumulate', () => {
    const src = 'oto p\nnp 1\njuż\n' + 'powtorz 1 [p] '.repeat(40);
    expect(ok(src).length).toBe(40);
  });
  test('33 nested repeats is a parse-time error', () => {
    parseFails('np 1 ' + 'powtorz 1 ['.repeat(33) + 'np 1' + ']'.repeat(33));
  });
  test('procedure body may use a procedure defined later', () => {
    expect(len('oto a\nb\njuż\na\noto b\nnp 4\njuż')).toEqual([4]);
  });
  test('3D mode reports the same whitespace-rule error', () => {
    parseFailsAt('np 10 -5', 1, 7, '3d');
  });
  test('run-time error in 3D keeps segments', () => {
    const r = fails('gora 30 np 10 np 1 / 0', '3d');
    expect(r.segments.length).toBe(1);
  });
});
