import { describe, expect, test } from 'bun:test';
import { BadLinkError, decodeProgram, encodeProgram, buildPermalink, readPermalink } from '../src/ui/share';
import { parseHash } from '../src/ui/router';
import { EXAMPLES } from '../src/data/examples';
import { guessMode, slug } from '../src/ui/files';

describe('adres do udostępniania', () => {
  test('program z polskimi znakami wraca bez zmian', async () => {
    for (const e of EXAMPLES) {
      const enc = await encodeProgram(e.source);
      expect(await decodeProgram(enc)).toBe(e.source);
      expect(/^[uz][A-Za-z0-9_-]+$/.test(enc)).toBe(true);
    }
    expect(await decodeProgram(await encodeProgram(''))).toBe('');
    const big = '; zażółć gęślą jaźń\n'.repeat(2000);
    expect(await decodeProgram(await encodeProgram(big))).toBe(big);
  });

  test('permalink zawiera tryb i program, a odczyt z hasha działa', async () => {
    const url = await buildPermalink('3d', 'gora 10 np 5', 'https://x.test/Logomocja/builds/x/');
    expect(url.startsWith('https://x.test/Logomocja/builds/x/#/?tryb=3d&kod=')).toBe(true);
    const hash = url.slice(url.indexOf('#'));
    const sp = readPermalink(parseHash(hash))!;
    expect(sp.mode).toBe('3d');
    expect(await decodeProgram(sp.payload)).toBe('gora 10 np 5');
  });

  test('uszkodzony adres daje czytelny błąd, a nie wyjątek silnika', async () => {
    for (const bad of ['', 'x', 'zzzz%%%', 'u%%%', 'u/+=', 'zAAAA', 'z' + 'A'.repeat(7), 'u_w']) {
      let err: unknown = null;
      try {
        await decodeProgram(bad);
      } catch (e) {
        err = e;
      }
      expect(err).toBeInstanceOf(BadLinkError);
      expect((err as Error).message).toContain('Adres');
    }
    const full = await encodeProgram('powtorz 36 [np 10 pw 10] ; zażółć gęślą jaźń '.repeat(20));
    let truncated: unknown = null;
    try {
      await decodeProgram(full.slice(0, Math.floor(full.length / 2)));
    } catch (e) {
      truncated = e;
    }
    expect(truncated).toBeInstanceOf(BadLinkError);
  });

  test('brak kodu w adresie to brak programu', () => {
    expect(readPermalink(parseHash('#/przyklady'))).toBeNull();
    expect(readPermalink(parseHash('#/?tryb=2d'))).toBeNull();
  });
});

describe('pliki', () => {
  test('nazwy plików', () => {
    expect(slug('Śnieżynka Kocha!')).toBe('sniezynka-kocha');
    expect(slug('')).toBe('program');
  });
  test('tryb z nazwy pliku i z treści', () => {
    expect(guessMode('kula-3d.logo', 'np 1', '2d')).toBe('3d');
    expect(guessMode('x.logo', 'np 1 gora 30', '2d')).toBe('3d');
    expect(guessMode('x.logo', '; gora 30\nnp 1', '2d')).toBe('2d');
    expect(guessMode('x.logo', 'np 1', '3d')).toBe('3d');
    expect(guessMode('x-2d.logo', 'np 1', '3d')).toBe('2d');
  });
});
