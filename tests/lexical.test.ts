import { describe, expect, test } from 'bun:test';
import { ok, fails, parseFails, parseFailsAt, dy, closeSeg } from './helpers';

describe('case-insensitivity', () => {
  test('keywords ignore case', () => {
    expect(dy(ok('NP 10 Np 5 nP 2 FORWARD 1 Fd 1'))).toEqual([10, 5, 2, 1, 1]);
  });
  test('accented keywords ignore case', () => {
    expect(dy(ok('NAPRZÓD 10 Naprzód 2'))).toEqual([10, 2]);
    expect(dy(ok('POWTÓRZ 2 [NP 1]'))).toEqual([1, 1]);
  });
  test('variable names ignore case', () => {
    expect(dy(ok('NIECH Abc 4 np aBC np :ABC'))).toEqual([4, 4]);
  });
  test('procedure names, parameter names and header keywords ignore case', () => {
    const src = 'OTO Kwadrat MA: Bok\nNP bok\nNP :BOK\nJUŻ\nkwadrat 7\nKWADRAT 3';
    expect(dy(ok(src))).toEqual([7, 7, 3, 3]);
  });
  test('nrpowt ignores case', () => {
    expect(dy(ok('powtorz 2 [np NRPOWT np RepCount]'))).toEqual([1, 1, 2, 2]);
  });
});

describe('whitespace and newlines', () => {
  test('newline between command and argument is fine', () => {
    expect(dy(ok('np\n10'))).toEqual([10]);
  });
  test('tabs and multiple spaces separate tokens', () => {
    expect(dy(ok('np\t10   \t np  3'))).toEqual([10, 3]);
  });
  test('repeat may span lines', () => {
    expect(dy(ok('powtorz 2\n[\n  np 1\n]\n'))).toEqual([1, 1]);
  });
  test('brackets need no surrounding whitespace', () => {
    expect(dy(ok('powtorz 2[np 1]'))).toEqual([1, 1]);
  });
  test('empty program is fine', () => {
    expect(ok('')).toEqual([]);
    expect(ok('   \n\n  ')).toEqual([]);
  });
});

describe('comments', () => {
  test('semicolon comment runs to end of line', () => {
    expect(dy(ok('np 10 ; np 20\nnp 5'))).toEqual([10, 5]);
  });
  test('comment-only program', () => {
    expect(ok('; tylko komentarz')).toEqual([]);
  });
  test('comment directly after a token', () => {
    expect(dy(ok('np 10;komentarz\nnp 2'))).toEqual([10, 2]);
  });
  test('brackets and junk in a comment are ignored', () => {
    expect(dy(ok('np 1 ; ] [ ( foo 1e3 "#zz"\nnp 2'))).toEqual([1, 2]);
  });
  test('comment at end of program without newline', () => {
    expect(dy(ok('np 3 ; koniec'))).toEqual([3]);
  });
  test('error positions after a comment line', () => {
    parseFailsAt('; komentarz\n   foo', 2, 4);
  });
});

describe('numbers', () => {
  test('integer, decimal, and leading-dot literals', () => {
    expect(dy(ok('np 80'))).toEqual([80]);
    expect(dy(ok('np 12.5'))).toEqual([12.5]);
    expect(dy(ok('np .5'))).toEqual([0.5]);
    expect(dy(ok('np 0.25'))).toEqual([0.25]);
  });
  test('sign is an operator, not part of the literal', () => {
    expect(dy(ok('np -5'))).toEqual([-5]);
    expect(dy(ok('np +5'))).toEqual([5]);
  });
  for (const bad of ['1e3', '1E3', '0x10', 'NaN', 'Infinity', 'nan', 'infinity']) {
    test(`${bad} is not a number (parse-time error)`, () => {
      const r = parseFails(`np 10\nnp ${bad}`);
      expect(r.error!.line).toBe(2);
      expect([4, 5]).toContain(r.error!.column);
    });
  }
  test('NaN and Infinity are rejected at their position', () => {
    parseFailsAt('np NaN', 1, 4);
    parseFailsAt('np Infinity', 1, 4);
  });
});

describe('colour literals', () => {
  test('lowercase hex', () => {
    const s = ok('kolor "#abcdef" np 1');
    expect(s[0].color).toBe('#abcdef');
  });
  test('uppercase / mixed hex is accepted and reported lowercase', () => {
    expect(ok('kolor "#ABCDEF" np 1')[0].color).toBe('#abcdef');
    expect(ok('kolor "#16866A" np 1')[0].color).toBe('#16866a');
    expect(ok('kolor "#aB12Cd" np 1')[0].color).toBe('#ab12cd');
  });
  for (const bad of ['"#12345"', '"#1234567"', '"#12345g"', '"123456"', '#123456', '5', '"#123456', '"#"', '""', 'abc']) {
    test(`malformed colour ${bad} is a parse-time error at the argument`, () => {
      parseFailsAt(`np 1 kolor ${bad}`, 1, 12);
    });
  }
  test('colour literal is not an expression', () => {
    parseFailsAt('np "#123456"', 1, 4);
  });
});

describe('operators and parentheses', () => {
  test('parentheses group', () => {
    expect(dy(ok('np (2 + 3) * 2'))).toEqual([10]);
  });
  test('all six comparisons are recognised', () => {
    const segs = ok(
      'jeśli 1 < 2 [np 1] jeśli 2 > 1 [np 2] jeśli 1 = 1 [np 3] jeśli 1 <= 1 [np 4] jeśli 1 >= 1 [np 5] jeśli 1 <> 2 [np 6]',
    );
    expect(dy(segs)).toEqual([1, 2, 3, 4, 5, 6]);
  });
  test('unknown characters are errors', () => {
    fails('np 1 & 2');
    fails('np 1 % 2');
  });
});

describe('basic segment shape', () => {
  test('forward from origin', () => {
    const s = ok('np 10');
    expect(s.length).toBe(1);
    closeSeg(s[0], [0, 0, 0], [0, 10, 0]);
  });
});
