import { describe, expect, test } from 'bun:test';
import { ok, fails, failsAt, failsAtNeedle, parseFails, parseFailsAt, at, dy } from './helpers';

describe('source character limit (50,000)', () => {
  const base = 'np 1 ;';
  const exact = base + 'x'.repeat(50000 - base.length);
  test('exactly 50,000 characters is fine', () => {
    expect(exact.length).toBe(50000);
    expect(dy(ok(exact))).toEqual([1]);
  });
  test('50,001 characters is an error, nothing drawn', () => {
    parseFails(exact + 'x');
  });
});

describe('token limit (10,000)', () => {
  const plain = Array(5000).fill('np 1').join(' '); // 10,000 tokens
  test('exactly 10,000 tokens is fine', () => {
    expect(ok(plain).length).toBe(5000);
  });
  test('10,001 tokens is an error, nothing drawn', () => {
    parseFails('pod ' + plain);
  });
  test('comments are not tokens', () => {
    expect(ok(plain + ' ; a b c d e f').length).toBe(5000);
  });
  const ops = 'np 1' + ' + 1'.repeat(4999); // 2 + 9998 = 10,000 tokens
  test('operators are tokens (10,000 ok)', () => {
    expect(dy(ok(ops))).toEqual([5000]);
  });
  test('operators are tokens (10,001 fails)', () => {
    parseFails('pod ' + ops);
  });
  const parens = Array(2500).fill('np (1)').join(' '); // 4 tokens each
  test('parentheses are tokens (10,000 ok)', () => {
    expect(ok(parens).length).toBe(2500);
  });
  test('parentheses are tokens (10,001 fails)', () => {
    parseFails(parens + ' pod');
  });
  const brackets = Array(2500).fill('powtorz 1 [ ]').join(' '); // 4 tokens each, 5000 ops
  test('brackets are tokens (10,000 ok)', () => {
    expect(ok(brackets)).toEqual([]);
  });
  test('brackets are tokens (10,001 fails)', () => {
    parseFails(brackets + ' pod');
  });
});

describe('bracket nesting limit (32)', () => {
  const nest = (n: number) => 'jeśli 1 = 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
  test('32 nested conditional bodies are fine', () => {
    expect(ok(nest(32)).length).toBe(1);
  });
  test('33 nested brackets is a parse-time error at the 33rd [', () => {
    const src = 'np 1 ' + nest(33);
    const p = at(src, '[', 33);
    parseFailsAt(src, p.line, p.column);
  });
  test('32 nested repeats are fine (32 brackets, 32 frames)', () => {
    const src = 'powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32);
    expect(ok(src).length).toBe(1);
  });
  test('32 nested parentheses are fine', () => {
    expect(dy(ok('np ' + '('.repeat(32) + '1' + ')'.repeat(32)))).toEqual([1]);
  });
});

describe('frame limit (32 active calls and repeats)', () => {
  const rec = 'oto r ma: n\njeśli n > 0 [r n - 1]\njuż\nnp 1\n';
  test('32 nested calls are fine (conditional bodies are not frames)', () => {
    expect(ok(rec + 'r 31').length).toBe(1);
  });
  test('33 nested calls is a run-time error at the 33rd call', () => {
    const r = failsAt(rec + 'r 32', 2, 14);
    expect(r.segments.length).toBe(1);
  });
  const mixed = 'oto r ma: n\npowtorz 1 [jeśli n > 0 [r n - 1]]\njuż\nnp 1\n';
  test('16 calls + 16 repeats = 32 frames is fine', () => {
    expect(ok(mixed + 'r 15').length).toBe(1);
  });
  test('17 calls + 16 repeats = 33 frames fails at the call', () => {
    const r = failsAt(mixed + 'r 16', 2, 25);
    expect(r.segments.length).toBe(1);
  });
  const def = 'oto p\nnp 1\njuż\n';
  test('31 repeats + 1 call = 32 frames is fine', () => {
    expect(ok(def + 'powtorz 1 ['.repeat(31) + 'p' + ']'.repeat(31)).length).toBe(1);
  });
  test('32 repeats + 1 call = 33 frames fails at the call', () => {
    const src = def + 'powtorz 1 ['.repeat(32) + 'p' + ']'.repeat(32);
    const r = failsAtNeedle(src, 'p]');
    expect(r.segments).toEqual([]);
  });
  test('unbounded recursion is an error, not a crash', () => {
    const r = fails('oto r\nnp 1\nr\njuż\nr');
    expect(r.segments.length).toBeGreaterThan(0);
  });
});

describe('operation limit (10,000)', () => {
  // repeat: 1 + per iteration (body ops + 1)
  test('commands in a repeat: exactly 10,000', () => {
    expect(ok('powtorz 4999 [np 1] pw 1').length).toBe(4999);
  });
  test('commands in a repeat: 10,001 fails at the extra command, keeping the drawing', () => {
    const src = 'powtorz 4999 [np 1] pw 1 pw 2';
    const r = failsAtNeedle(src, 'pw 2');
    expect(r.segments.length).toBe(4999);
  });
  test('true conditional counts 1 + body + 1', () => {
    ok('powtorz 2499 [jeśli 1 = 1 [pw 1]] pw 1 pw 1 pw 1');
    failsAtNeedle('powtorz 2499 [jeśli 1 = 1 [pw 1]] pw 1 pw 1 pw 1 pw 2', 'pw 2');
  });
  test('false conditional counts 1', () => {
    ok('powtorz 4999 [jeśli 1 = 2 [pw 1]] pw 1');
    failsAtNeedle('powtorz 4999 [jeśli 1 = 2 [pw 1]] pw 1 pw 2', 'pw 2');
  });
  test('jeżeli counts 1 + chosen body + 1', () => {
    ok('powtorz 2499 [jeżeli 1 = 2 [pw 1] [pw 1]] pw 1 pw 1 pw 1');
    failsAtNeedle('powtorz 2499 [jeżeli 1 = 2 [pw 1] [pw 1]] pw 1 pw 1 pw 1 pw 2', 'pw 2');
  });
  test('procedure call counts 1 + body + 1', () => {
    const def = 'oto p\npw 1\njuż\n';
    ok(def + 'powtorz 2499 [p] pw 1 pw 1 pw 1');
    failsAtNeedle(def + 'powtorz 2499 [p] pw 1 pw 1 pw 1 pw 2', 'pw 2');
  });
  test('niech counts 1', () => {
    ok('powtorz 4999 [niech x nrpowt] pw 1');
    failsAtNeedle('powtorz 4999 [niech x nrpowt] pw 1 pw 2', 'pw 2');
  });
  test('czyść counts as a command', () => {
    ok('powtorz 4999 [czyść] pw 1');
    failsAtNeedle('powtorz 4999 [czyść] pw 1 pw 2', 'pw 2');
  });
  test('nested repeats', () => {
    ok('powtorz 2 [powtorz 2498 [pw 1]] pw 1 pw 1 pw 1');
    failsAtNeedle('powtorz 2 [powtorz 2498 [pw 1]] pw 1 pw 1 pw 1 pw 2', 'pw 2');
  });
  test('finishing a repeat iteration counts (nested 2 x 2499 exceeds)', () => {
    fails('powtorz 2 [powtorz 2499 [pw 1]]');
  });
  test('empty repeat iterations count', () => {
    ok('powtorz 9999 []');
    fails('powtorz 10000 []');
  });
  test('evaluating expressions is not an operation', () => {
    const s = ok('powtorz 4999 [np (1 + 2) * 3 / 9 - nrpowt * 0 + -(1 - 1)] pw 1');
    expect(s.length).toBe(4999);
  });
});

describe('segment limit (10,000 kept)', () => {
  test('a large drawing within all limits works', () => {
    const body = Array(4990).fill('np 1').join(' ');
    const src = `powtorz 2 [${body}]`;
    // 9984 tokens, 1 + 2 * 4991 = 9983 ops, 9980 segments
    expect(ok(src).length).toBe(9980);
  });
});

describe('coordinate limit (±100,000)', () => {
  test('exactly at the limit is fine', () => {
    ok('np 100000');
    ok('ws 100000');
    ok('pw 90 np 100000');
    ok('lw 90 np 100000');
    ok('np 100000 ws 200000');
    ok('dol 90 np 100000', '3d');
    ok('gora 90 np 100000', '3d');
  });
  test('beyond the limit is a run-time error keeping earlier segments', () => {
    const r = fails('np 1 ws 1 np 100001');
    expect(r.error!.line).toBe(1);
    expect(r.segments.length).toBeGreaterThanOrEqual(2);
    expect(r.segments.length).toBeLessThanOrEqual(3);
    expect(dy(r.segments.slice(0, 2))).toEqual([1, -1]);
  });
  test('cumulative overflow', () => {
    const r = fails('powtorz 2 [np 60000]');
    expect(r.segments.length).toBeGreaterThanOrEqual(1);
    expect(dy(r.segments.slice(0, 1))).toEqual([60000]);
  });
  test('pen-up moves are also limited', () => {
    fails('pod np 100001');
    fails('pod ws 100000.5');
  });
  test('x and z coordinates are limited', () => {
    fails('pw 90 np 100000.5');
    fails('lw 90 np 100001');
    fails('gora 90 np 100001', '3d');
    fails('dol 90 np 100001', '3d');
  });
  test('error line on a later line', () => {
    const r = fails('np 1\nnp 50000\nnp 50000');
    expect(r.error!.line).toBe(3);
    expect(r.segments.length).toBeGreaterThanOrEqual(2);
  });
});
