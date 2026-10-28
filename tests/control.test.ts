import { describe, expect, test } from 'bun:test';
import { ok, fails, failsAt, parseFails, parseFailsAt, dy } from './helpers';

const len = (src: string) => dy(ok(src));

describe('repeat', () => {
  test('basic', () => {
    expect(len('powtorz 3 [np 1]')).toEqual([1, 1, 1]);
  });
  test('zero runs nothing', () => {
    expect(ok('powtorz 0 [np 1]')).toEqual([]);
  });
  test('empty body', () => {
    expect(ok('powtorz 5 []')).toEqual([]);
  });
  test('count from expressions', () => {
    expect(len('powtorz 9 / 3 [np 1]').length).toBe(3);
    expect(len('powtorz 1 + 1 [np 1]').length).toBe(2);
    expect(len('powtorz 4.0 [np 1]').length).toBe(4);
  });
  test('nested repeats', () => {
    expect(ok('powtorz 3 [powtorz 4 [np 1]]').length).toBe(12);
  });
  for (const bad of ['10001', '-1', '2.5', '20000 / 2 + 1', '7 / 2', '- 1'])
    test(`literal count ${bad} is a parse-time error at the argument`, () => {
      parseFailsAt(`np 1 powtorz ${bad} [np 1]`, 1, 14);
    });
  test('literal count 10000 passes parsing (fails later only on the op limit)', () => {
    const r = fails('np 1 powtorz 10000 []');
    expect(r.segments.length).toBe(1);
  });
  test('count from a name checked at run time', () => {
    const r = failsAt('niech n 10001\nnp 1\npowtorz n [np 1]', 3, 9);
    expect(r.segments.length).toBe(1);
    const r2 = failsAt('niech n 2\nnp 1\npowtorz n / 4 [np 1]', 3, 9);
    expect(r2.segments.length).toBe(1);
    const r3 = failsAt('niech n 0 - 1\nnp 1\npowtorz n [np 1]', 3, 9);
    expect(r3.segments.length).toBe(1);
  });
  test('missing body', () => {
    parseFailsAt('powtorz 3 np 1', 1, 11);
    parseFailsAt('np 1\npowtorz 3', 2, 1);
  });
  test('missing count', () => {
    parseFailsAt('powtorz [np 1]', 1, 9);
  });
  test('unbalanced brackets', () => {
    parseFails('powtorz 2 [np 1');
    parseFailsAt('np 1 ]', 1, 6);
    parseFailsAt(']', 1, 1);
    parseFails('powtorz 2 [np 1 [np 2]');
  });
  test('missing argument at ] inside body', () => {
    parseFailsAt('powtorz 2 [np]', 1, 14);
  });
});

describe('nrpowt', () => {
  test('iteration number starting at 1', () => {
    expect(len('powtorz 3 [np nrpowt]')).toEqual([1, 2, 3]);
    expect(len('repeat 3 [fd repcount * 2]')).toEqual([2, 4, 6]);
  });
  test('innermost enclosing repeat', () => {
    expect(len('powtorz 2 [powtorz 3 [np nrpowt]]')).toEqual([1, 2, 3, 1, 2, 3]);
  });
  test('after an inner repeat finishes it refers to the outer one', () => {
    expect(len('powtorz 2 [powtorz 1 [np 1] np nrpowt * 10]')).toEqual([1, 10, 1, 20]);
  });
  test('inside a conditional inside a repeat', () => {
    expect(len('powtorz 4 [jeśli nrpowt > 2 [np nrpowt]]')).toEqual([3, 4]);
  });
  test('count of a nested repeat refers to the outer repeat', () => {
    expect(ok('powtorz 3 [powtorz nrpowt [np 1]]').length).toBe(6);
  });
  test('outside any repeat at top level is a parse-time error', () => {
    parseFailsAt('np 1 np nrpowt', 1, 9);
    parseFailsAt('np 1 jeśli 1 = 1 [np nrpowt]', 1, 22);
    parseFailsAt('np 1 powtorz nrpowt [np 1]', 1, 14);
  });
  test('in a procedure body not inside a repeat is a parse-time error, even if called from a repeat', () => {
    parseFailsAt('oto p\nnp nrpowt\njuż\npowtorz 2 [p]', 2, 4);
    parseFailsAt('oto p\njeśli 1 = 1 [np repcount]\njuż\npowtorz 2 [p]', 2, 17);
  });
  test('in a procedure body inside a repeat is fine', () => {
    expect(len('oto p\npowtorz 2 [np nrpowt]\njuż\npowtorz 3 [p]')).toEqual([1, 2, 1, 2, 1, 2]);
  });
});

describe('variables', () => {
  test('assign and reassign', () => {
    expect(len('niech x 5 np x niech x x + 1 np x')).toEqual([5, 6]);
  });
  test('assigned from expressions with other variables', () => {
    expect(len('niech a 2 niech b a * 3 np b + a')).toEqual([8]);
  });
  test('global assigned inside a top-level repeat', () => {
    expect(len('powtorz 3 [niech x nrpowt] np x')).toEqual([3]);
  });
  test('top-level assignment after use is declared but unassigned at run time', () => {
    const r = failsAt('np 10 np x niech x 5', 1, 10);
    expect(dy(r.segments)).toEqual([10]);
  });
  test('unassigned on the current path', () => {
    const src = 'jeśli 1 = 2 [niech x 5]\nnp 10\nnp x';
    const r = failsAt(src, 3, 4);
    expect(r.segments.length).toBe(1);
    expect(len('jeśli 1 = 1 [niech x 5]\nnp 10\nnp x')).toEqual([10, 5]);
  });
  test('unassigned reported at the first token of the argument', () => {
    const r = failsAt('np 1 np 2 * x niech x 1', 1, 9);
    expect(r.segments.length).toBe(1);
    const r2 = failsAt('np 1 np (2 + x) niech x 1', 1, 9);
    expect(r2.segments.length).toBe(1);
    const r3 = failsAt('np 1 powtorz y [np 1] niech y 2', 1, 14);
    expect(r3.segments.length).toBe(1);
    const r4 = failsAt('np 1 jeśli x = 1 [np 1] niech x 2', 1, 12);
    expect(r4.segments.length).toBe(1);
  });
  test('undeclared name is a parse-time error', () => {
    parseFailsAt('np 10 np y', 1, 10);
    parseFailsAt('np 10 np :y', 1, 10);
    parseFailsAt('np 10\npowtorz 2 [np 1 + q]', 2, 19);
  });
  test('command words cannot be variable names', () => {
    parseFailsAt('np 1 niech np 5', 1, 12);
    parseFailsAt('np 1 niech powtorz 5', 1, 12);
    parseFailsAt('np 1 niech dom 5', 1, 12);
  });
  test('procedure names cannot be variable names', () => {
    parseFails('oto p\nnp 1\njuż\nniech p 5');
    parseFails('niech p 5\noto p\nnp 1\njuż');
  });
  test('niech without value at end of program is reported at the command', () => {
    parseFailsAt('np 1 niech x', 1, 6);
  });
  test('niech without value before ] is reported at ]', () => {
    parseFailsAt('powtorz 2 [niech x]', 1, 19);
  });
  test('missing or malformed niech arguments', () => {
    parseFailsAt('np 1 niech', 1, 6);
    parseFailsAt('np 1 niech 5 5', 1, 12);
  });
});

describe('conditionals', () => {
  test('jeśli runs body only when condition holds', () => {
    expect(len('jeśli 1 < 2 [np 1 np 2] jeśli 2 < 1 [np 3]')).toEqual([1, 2]);
  });
  test('jeżeli picks a branch', () => {
    expect(len('jeżeli 1 > 2 [np 10] [np 20]')).toEqual([20]);
    expect(len('jeżeli 1 < 2 [np 10] [np 20]')).toEqual([10]);
  });
  test('bodies may contain repeats, conditionals, calls and nrpowt (in repeat)', () => {
    const src = 'oto p\nnp 7\njuż\npowtorz 2 [jeżeli nrpowt = 1 [powtorz 2 [np 1]] [jeśli 1 = 1 [p]]]';
    expect(len(src)).toEqual([1, 1, 7]);
  });
  test('conditions with variables', () => {
    expect(len('niech a 3 jeśli a * 2 = 6 [np a]')).toEqual([3]);
  });
  test('missing body before a command', () => {
    parseFailsAt('jeśli 1 < 2 np 1', 1, 13);
  });
  test('missing second body at end of program reported at the command', () => {
    parseFailsAt('np 1\njeżeli 1 < 2 [np 1]', 2, 1);
  });
  test('missing body at end reported at the command', () => {
    parseFailsAt('np 1\njeśli 1 < 2', 2, 1);
    parseFailsAt('np 1\njeśli', 2, 1);
  });
  test('missing second body before a command', () => {
    parseFailsAt('jeżeli 1 < 2 [np 1] np 2', 1, 21);
  });
});
