import { describe, expect, test } from 'bun:test';
import { ok, fails, failsAt, parseFails, parseFailsAt, dy } from './helpers';

const len = (src: string) => dy(ok(src));

describe('precedence and associativity', () => {
  test('spec examples', () => {
    expect(len('np 20 - 5 - 3')).toEqual([12]);
    expect(len('np 2 + 3 * 4')).toEqual([14]);
  });
  test('more cases', () => {
    expect(len('np 100 / 10 / 2')).toEqual([5]);
    expect(len('np 8 / 2 * 2')).toEqual([8]);
    expect(len('np 2 * 3 + 4')).toEqual([10]);
    expect(len('np 10 - 2 * 3')).toEqual([4]);
    expect(len('np (2 + 3) * 4')).toEqual([20]);
    expect(len('np 2 * (3 + 4)')).toEqual([14]);
    expect(len('np ((1 + 1) * (2 + 2))')).toEqual([8]);
    expect(len('np 1 - 2 + 3')).toEqual([2]);
    expect(len('np 24 / 4 / 3 * 2')).toEqual([4]);
  });
  test('intermediate values may exceed coordinate range', () => {
    expect(len('np 200000 - 150000')).toEqual([50000]);
  });
});

describe('binary-operator whitespace rule', () => {
  test('both sides or neither', () => {
    expect(len('np 10 - 5')).toEqual([5]);
    expect(len('np 10-5')).toEqual([5]);
    expect(len('np 1+2')).toEqual([3]);
    expect(len('np 2*3')).toEqual([6]);
    expect(len('np 6/2')).toEqual([3]);
    expect(len('np 1 + 2')).toEqual([3]);
    expect(len('np 2 * 3')).toEqual([6]);
    expect(len('np 6 / 2')).toEqual([3]);
  });
  test('np 10 -5 is an error at the -, nothing drawn', () => {
    parseFailsAt('np 10 -5', 1, 7);
    parseFailsAt('np 1\nnp 10 -5', 2, 7);
  });
  for (const op of ['+', '*', '/'])
    test(`whitespace only on the left of ${op} is an error at the operator`, () => {
      parseFailsAt(`np 10 ${op}5`, 1, 7);
    });
  for (const op of ['-', '+', '*', '/'])
    test(`whitespace only on the right of ${op} is an error at the operator`, () => {
      parseFailsAt(`np 10${op} 5`, 1, 6);
    });
  test('stray -5 inside parentheses is a parse-time error', () => {
    // may be reported at the unclosed ( or at the stray -
    const r = parseFails('np (10 -5)');
    expect([4, 8]).toContain(r.error!.column);
  });
  test('stray -(5)', () => {
    parseFailsAt('np 10 -(5)', 1, 7);
  });
  test('rule does not apply to comparisons', () => {
    expect(len('jeśli 1 <2 [np 1]')).toEqual([1]);
    expect(len('jeśli 1< 2 [np 1]')).toEqual([1]);
    expect(len('jeśli 1<2 [np 1]')).toEqual([1]);
    expect(len('jeśli 2 >=2 [np 1]')).toEqual([1]);
    expect(len('jeśli 2<> 3 [np 1]')).toEqual([1]);
    expect(len('jeśli 2= 2 [np 1]')).toEqual([1]);
  });
  test('rule applies inside conditions', () => {
    parseFailsAt('jeśli 1 -1 = 0 [np 1]', 1, 9);
  });
});

describe('unary signs', () => {
  test('spec examples', () => {
    expect(len('np -(3 - 5)')).toEqual([2]);
    expect(len('np - -2')).toEqual([2]);
    expect(len('niech bok 4 np -bok')).toEqual([-4]);
  });
  test('unary after binary operators', () => {
    expect(len('np 2 * -3')).toEqual([-6]);
    expect(len('np 3 - -2')).toEqual([5]);
    expect(len('np 3 + -2')).toEqual([1]);
    expect(len('np 6 / -2')).toEqual([-3]);
    expect(len('np 2*-3')).toEqual([-6]);
  });
  test('stacked and mixed', () => {
    expect(len('np - - -2')).toEqual([-2]);
    expect(len('np +-2')).toEqual([-2]);
    expect(len('np -+2')).toEqual([-2]);
    expect(len('np + + 2')).toEqual([2]);
    expect(len('np - 5')).toEqual([-5]);
  });
  test('unary binds to operand, tighter than *', () => {
    expect(len('np -2 * 3')).toEqual([-6]);
    expect(len('np -2 + 5')).toEqual([3]);
  });
  test('unary on nrpowt and legacy names', () => {
    expect(len('powtorz 2 [np -nrpowt]')).toEqual([-1, -2]);
    expect(len('niech a 3 np -:a')).toEqual([-3]);
  });
});

describe('names in expressions', () => {
  test('variable and legacy :name', () => {
    expect(len('niech x 5 np x np :x np x * x')).toEqual([5, 5, 25]);
  });
});

describe('division by zero and non-finite values', () => {
  test('division by zero is a run-time error at the argument', () => {
    const r = failsAt('np 10\nnp 5 / 0', 2, 4);
    expect(dy(r.segments)).toEqual([10]);
  });
  test('reported at first token of the argument expression', () => {
    const r = failsAt('np 10 np 2 + 5 / (3 - 3)', 1, 10);
    expect(r.segments.length).toBe(1);
  });
  test('reported at a leading unary sign', () => {
    const r = failsAt('np 1 np -(1 / 0)', 1, 9);
    expect(r.segments.length).toBe(1);
  });
  test('division by zero in a turn', () => {
    const r = failsAt('np 1 pw 1 / 0', 1, 9);
    expect(r.segments.length).toBe(1);
  });
  test('not raised when the code is not executed', () => {
    expect(len('jeśli 1 = 2 [np 1 / 0] np 1')).toEqual([1]);
  });
  test('non-finite result is a run-time error at the argument', () => {
    const big = '9'.repeat(200);
    const r = failsAt(`np 1\nnp ${big} * ${big}`, 2, 4);
    expect(r.segments.length).toBe(1);
  });
  test('0 / 0 is a run-time error', () => {
    const r = failsAt('np 3 np 0 / 0', 1, 9);
    expect(r.segments.length).toBe(1);
  });
});

describe('comparisons', () => {
  const cases: [string, boolean][] = [
    ['1 < 2', true], ['2 < 1', false], ['1 < 1', false],
    ['2 > 1', true], ['1 > 2', false], ['1 > 1', false],
    ['1 = 1', true], ['1 = 2', false],
    ['1 <= 1', true], ['1 <= 2', true], ['2 <= 1', false],
    ['1 >= 1', true], ['2 >= 1', true], ['1 >= 2', false],
    ['1 <> 2', true], ['1 <> 1', false],
    ['2 + 3 = 5', true], ['2 * 3 > 5 + 0.5', true], ['-3 = 0 - 3', true],
    ['3 = -3', false],
  ];
  for (const [cond, holds] of cases)
    test(`${cond} is ${holds}`, () => {
      expect(ok(`jeśli ${cond} [np 1]`).length).toBe(holds ? 1 : 0);
    });
  test('comparisons are exact', () => {
    expect(ok('jeśli 0.1 + 0.2 = 0.3 [np 1]')).toEqual([]);
    expect(ok('jeśli 0.1 + 0.2 <> 0.3 [np 1]').length).toBe(1);
    expect(ok('jeśli 0.5 + 0.25 = 0.75 [np 1]').length).toBe(1);
  });
  test('comparison outside a condition is an error', () => {
    fails('np 1 < 2');
  });
  test('condition without comparison is an error', () => {
    parseFailsAt('np 1\njeśli 1 [np 1]', 2, 9);
  });
});

describe('expression errors', () => {
  test('missing operand at )', () => {
    parseFailsAt('np (2 * )', 1, 9);
    parseFailsAt('np ()', 1, 5);
  });
  test('missing argument before a command reported at that command', () => {
    parseFailsAt('np pw 90', 1, 4);
  });
  test('missing argument at end of program reported at command', () => {
    parseFailsAt('np 10\npw', 2, 1);
  });
  test('missing operand after operator at end', () => {
    fails('np 2 +');
  });
  test('unbalanced parenthesis', () => {
    parseFails('np 1 np (1 + 2');
  });
  test('stray closing parenthesis', () => {
    parseFailsAt('np 1 + 2)', 1, 9);
  });
});
