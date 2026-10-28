import { describe, expect, test } from 'bun:test';
import { runSource } from '../src/lang';

/** Prosty generator losowych programów: mieszanka poprawnych i zepsutych fragmentów. */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PIECES = [
  'np', 'ws', 'pw', 'lw', 'pod', 'opu', 'kolor', 'grubosc', 'powtorz', 'niech', 'jeśli', 'jeżeli', 'stop', 'dom', 'czyść',
  'gora', 'dol', 'pp', 'pl', 'nrpowt', 'oto', 'już', 'ma:', 'x', 'y', 'f', 'g', ':x', '[', ']', '(', ')', ',', '+', '-', '*', '/',
  '<', '>', '=', '<=', '>=', '<>', '0', '1', '5', '10', '90', '120', '.5', '2.5', '"#16866a"', '"#zzz"', '"', ';', '\n', '\n', ' ', '1e3', '@', 'ę', '€', ':',
];

function randomProgram(r: () => number): string {
  const n = 1 + Math.floor(r() * 40);
  let out = '';
  for (let i = 0; i < n; i++) {
    out += PIECES[Math.floor(r() * PIECES.length)]!;
    out += r() < 0.8 ? ' ' : '';
  }
  return out;
}

describe('odporność na dowolne dane wejściowe', () => {
  test('losowe programy nigdy nie wyrzucają wyjątku i dają poprawny kształt wyniku', () => {
    const r = rng(12345);
    for (let i = 0; i < 4000; i++) {
      const src = randomProgram(r);
      for (const mode of ['2d', '3d'] as const) {
        const res = runSource(src, mode);
        expect(Array.isArray(res.segments)).toBe(true);
        if (res.error) {
          expect(typeof res.error.message).toBe('string');
          expect(Number.isInteger(res.error.line) && res.error.line >= 1).toBe(true);
          expect(Number.isInteger(res.error.column) && res.error.column >= 1).toBe(true);
        }
        for (const s of res.segments) {
          expect(s.from.every(Number.isFinite) && s.to.every(Number.isFinite)).toBe(true);
          expect(/^#[0-9a-f]{6}$/.test(s.color)).toBe(true);
          expect(Number.isInteger(s.width) && s.width >= 1 && s.width <= 12).toBe(true);
          expect(s.from.concat(s.to).every((v) => Math.abs(v) <= 100000 && !Object.is(v, -0))).toBe(true);
        }
      }
    }
  });

  test('programy płaskie dają identyczny wynik w obu trybach', () => {
    const flat = ['np', 'ws', 'pw', 'lw', 'pod', 'opu', 'kolor "#aa11bb"', 'grubosc 4', 'dom', 'czyść', 'stop'];
    const r = rng(777);
    for (let i = 0; i < 1500; i++) {
      let src = '';
      const n = 1 + Math.floor(r() * 14);
      for (let k = 0; k < n; k++) {
        const w = flat[Math.floor(r() * flat.length)]!;
        src += w + (['np', 'ws', 'pw', 'lw'].includes(w) ? ` ${Math.floor(r() * 200) - 20}` : '') + ' ';
        if (r() < 0.15) src = `powtorz ${Math.floor(r() * 6)} [${src}] `;
      }
      expect(JSON.stringify(runSource(src, '2d'))).toBe(JSON.stringify(runSource(src, '3d')));
    }
  });

  test('dziwne znaki, bardzo długie słowa i liczby nie psują analizy', () => {
    for (const src of ['😀', 'np 😀', 'a'.repeat(20000), '9'.repeat(400), 'np ' + '9'.repeat(400), '\u0000', 'np 10', '"' + 'x'.repeat(1000), ':'.repeat(100), '[' .repeat(40), ')'.repeat(1000)]) {
      const res = runSource(src, '2d');
      expect(res.segments.length >= 0).toBe(true);
    }
    expect(runSource('np 10', '2d').segments.length).toBe(1); // twarda spacja to odstęp
  });
});
