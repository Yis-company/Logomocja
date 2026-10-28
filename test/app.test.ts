import { describe, expect, test } from 'bun:test';
import { highlightHtml, offsetOf } from '../src/app/highlight';
import { decodeProgram, encodeProgram, parseHash, permalinkHash, programFromParams } from '../src/app/share';
import { slug } from '../src/app/files';
import { EXAMPLES } from '../src/data/examples';
import { tokenize } from '../src/lang/lexer';

describe('permalink', () => {
  test('kodowanie i dekodowanie zachowuje polskie znaki', () => {
    for (const e of EXAMPLES) {
      expect(decodeProgram(encodeProgram(e.source))).toBe(e.source);
    }
    expect(decodeProgram(encodeProgram('; zażółć gęślą jaźń 🐢'))).toBe('; zażółć gęślą jaźń 🐢');
  });
  test('adres zawiera tryb i program, a odczyt je odtwarza', () => {
    const hash = permalinkHash('np 10\npw 90', '3d');
    expect(hash.startsWith('#/pracownia?tryb=3d&kod=')).toBe(true);
    const parsed = parseHash(hash);
    expect(parsed.path).toEqual(['pracownia']);
    expect(programFromParams(parsed.params)).toEqual({ source: 'np 10\npw 90', mode: '3d' });
  });
  test('uszkodzony kod nie przechodzi', () => {
    expect(decodeProgram('%%%')).toBeNull();
    expect(programFromParams(new URLSearchParams('kod=!!'))).toBeNull();
    expect(programFromParams(new URLSearchParams(''))).toBeNull();
  });
  test('długi program', () => {
    const big = 'np 1 '.repeat(9000);
    expect(decodeProgram(encodeProgram(big))).toBe(big);
  });
});

describe('edytor – pomocnicze', () => {
  test('offsetOf', () => {
    const src = 'ab\ncde\nf';
    expect(offsetOf(src, 1, 1)).toBe(0);
    expect(offsetOf(src, 2, 2)).toBe(4);
    expect(offsetOf(src, 3, 1)).toBe(7);
    expect(offsetOf(src, 9, 1)).toBe(src.length);
  });
  test('podświetlanie zachowuje tekst znak po znaku', () => {
    for (const e of EXAMPLES) {
      const html = highlightHtml(e.source);
      const text = html
        .replace(/<[^>]+>/g, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      expect(text).toBe(e.source + '\n');
    }
  });
  test('znacznik błędu nie zmienia tekstu', () => {
    const src = 'np 10 20\nxyz';
    const html = highlightHtml(src, offsetOf(src, 1, 7));
    expect(html).toContain('err-mark');
    expect(html.replace(/<[^>]+>/g, '')).toBe(src + '\n');
    const eol = highlightHtml('np', 2);
    expect(eol).toContain('err-point');
  });
  test('klasy tokenów', () => {
    const html = highlightHtml('oto f ma: a\n np a ; x\njuż\nf 1');
    expect(html).toContain('t-def');
    expect(html).toContain('t-proc');
    expect(html).toContain('t-com');
    expect(html).toContain('t-cmd');
  });
});

describe('inne', () => {
  test('slug nazwy pliku', () => {
    expect(slug('Śnieżynka 3D')).toBe('sniezynka-3d');
    expect(slug('###')).toBe('program');
  });
  test('leksyka: numery wierszy i flagi odstępów', () => {
    const t = tokenize('np 10-5\n  pw 90');
    expect(t.map((x) => x.text)).toEqual(['np', '10', '-', '5', 'pw', '90', '']);
    expect(t[2].spaceBefore).toBe(false);
    expect(t[2].spaceAfter).toBe(false);
    expect(t[4]).toMatchObject({ line: 2, col: 3, firstOnLine: true });
  });
});
