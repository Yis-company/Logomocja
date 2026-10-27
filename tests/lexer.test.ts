import { describe, expect, test } from 'bun:test';
import { tokenize } from '../src/logo/lexer';

describe('lexer', () => {
  test('splits words, numbers, brackets and colours with positions', () => {
    const t = tokenize('np 80\n  powtórz 4 [pw 90] kolor "#AbCdEf"');
    const kinds = t.map((x) => x.kind);
    expect(kinds).toEqual(['word', 'number', 'newline', 'word', 'number', 'lbracket', 'word', 'number', 'rbracket', 'word', 'color', 'eof']);
    expect(t[3]!.pos).toEqual({ line: 2, column: 3, length: 7 });
    expect(t[10]!.color).toBe('#abcdef');
    expect(t[0]!.lineStart).toBe(true);
    expect(t[1]!.lineStart).toBe(false);
    expect(t[3]!.lineStart).toBe(true);
  });

  test('numbers: signed decimals only', () => {
    const t = tokenize('80 -12.5 .5 +3 1. 1e5 - 1,5');
    expect(t.slice(0, 5).map((x) => x.num)).toEqual([80, -12.5, 0.5, 3, 1]);
    expect(t[5]!.kind).toBe('word'); // 1e5
    expect(t[6]!.kind).toBe('word'); // -
    expect(t[7]!.kind).toBe('number'); // 1
    expect(t[8]!.kind).toBe('comma');
    expect(t[9]!.kind).toBe('number'); // 5
  });

  test('comments run to end of line', () => {
    const t = tokenize('np 10 ; komentarz [ "x\nws 5');
    expect(t.map((x) => x.text)).toEqual(['np', '10', '\n', 'ws', '5', '']);
  });

  test('params and ma: keyword', () => {
    const t = tokenize('oto kw MA: bok :Kąt');
    expect(t[2]!.kind).toBe('ma');
    expect(t[4]!.kind).toBe('param');
    expect(t[4]!.value).toBe('kąt');
  });

  test('malformed colours are tokens with empty colour', () => {
    const t = tokenize('"#123" "#16866a "zzz"');
    expect(t[0]!.kind).toBe('color');
    expect(t[0]!.color).toBe('');
    expect(t[1]!.kind).toBe('color');
    expect(t[1]!.color).toBe('');
    expect(t[2]!.color).toBe('');
  });

  test('CRLF line endings', () => {
    const t = tokenize('np 10\r\nws 5');
    expect(t[3]!.pos).toEqual({ line: 2, column: 1, length: 2 });
  });
});
