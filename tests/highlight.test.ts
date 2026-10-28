import { describe, expect, test } from 'bun:test';
import { highlight, highlightToHtml, runsToHtml } from '../src/ui/highlight';

const classes = (src: string) => highlight(src).map((l) => l.filter((r) => r.cls).map((r) => `${r.text}:${r.cls}`));

describe('podświetlanie składni', () => {
  test('liczba wierszy zgadza się z edytorem (LF, CRLF, CR, pusty koniec)', () => {
    expect(highlight('').length).toBe(1);
    expect(highlight('a').length).toBe(1);
    expect(highlight('a\nb').length).toBe(2);
    expect(highlight('a\r\nb\r\n').length).toBe(3);
    expect(highlight('a\rb').length).toBe(2);
    expect(highlight('\n\n').length).toBe(3);
  });

  test('tekst wiersza jest zachowany bez zmian (nic nie ginie ani się nie dubluje)', () => {
    const src = 'oto kwadrat ma: bok, kąt ; komentarz\n  powtorz 4 [np bok pw kąt]\njuż\n\nkolor "#16866a" np 1e3 @ "zły';
    const lines = highlight(src);
    const text = lines.map((l) => l.map((r) => r.text).join('')).join('\n');
    expect(text).toBe(src);
  });

  test('klasy: polecenia, liczby, nawiasy, komentarze, procedury, nazwy', () => {
    const l = classes('oto f ma: a\n  np a * 2.5 ; ok\njuż\nf 1');
    expect(l[0]).toEqual(['oto:t-def', 'f:t-proc', 'ma:t-name', '::t-op', 'a:t-name']);
    expect(l[1]).toEqual(['np:t-move', 'a:t-name', '*:t-op', '2.5:t-num', '; ok:t-com']);
    expect(l[2]).toEqual(['już:t-def']);
    expect(l[3]).toEqual(['f:t-proc', '1:t-num']);
  });

  test('kolory polecenia kolor mają próbkę, a zepsute literały są oznaczone', () => {
    const lines = highlight('kolor "#16866a" kolor "#12"');
    const ok = lines[0]!.find((r) => r.text === '"#16866a"')!;
    expect(ok.swatch).toBe('#16866a');
    const bad = lines[0]!.find((r) => r.text === '"#12"')!;
    expect(bad.swatch).toBeUndefined();
    expect(bad.cls).toContain('t-bad');
  });

  test('nawiasy kwadratowe dostają kolor wg głębokości, nadmiarowy zamykający jest błędem', () => {
    const l = classes('[[ ]] ]')[0]!;
    expect(l).toEqual(['[:t-br t-br0', '[:t-br t-br1', ']:t-br t-br1', ']:t-br t-br0', ']:t-err']);
  });

  test('HTML jest bezpiecznie zamieniany', () => {
    const html = runsToHtml(highlight('np 1 ; <b>&</b>')[0]!);
    expect(html).toContain('&lt;b&gt;&amp;&lt;/b&gt;');
    expect(html).not.toContain('<b>');
    expect(highlightToHtml('np 1')).toContain('class="code-line"');
  });
});
