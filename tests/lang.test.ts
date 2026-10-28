import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang';

const len = (src: string, mode: '2d' | '3d' = '2d') => run(src, mode);
const end = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = run(src, mode);
  expect(r.error).toBeNull();
  const s = r.segments;
  return s.length ? s[s.length - 1].to : [0, 0, 0];
};
const near = (a: number[], b: number[]) => a.forEach((v, i) => expect(Math.abs(v - b[i])).toBeLessThan(1e-9));
const err = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = run(src, mode);
  expect(r.error).not.toBeNull();
  return r;
};

describe('wyrażenia', () => {
  test('priorytety i łączność', () => {
    near(end('np 20 - 5 - 3'), [0, 12, 0]);
    near(end('np 2 + 3 * 4'), [0, 14, 0]);
    near(end('np 10-5'), [0, 5, 0]);
    near(end('np 10 - 5'), [0, 5, 0]);
    near(end('np -(3 - 5)'), [0, 2, 0]);
    near(end('np - -2'), [0, 2, 0]);
    near(end('np 2 * 3 / 4'), [0, 1.5, 0]);
  });
  test('odstępy wokół operatora', () => {
    const r = err('np 10 -5');
    expect(r.error!.line).toBe(1);
    expect(r.error!.column).toBe(7);
    expect(r.segments).toEqual([]);
    err('np 10 *5');
    err('np 10* 5');
  });
  test('wartości niepoprawne', () => {
    for (const s of ['np 1e3', 'np 0x10', 'np NaN', 'np Infinity']) err(s);
    near(end('np .5'), [0, 0.5, 0]);
  });
  test('dzielenie przez zero w argumencie', () => {
    const r = err('np 10\nnp 3 + 4 / (2 - 2)');
    expect(r.error!.line).toBe(2);
    expect(r.error!.column).toBe(4);
    expect(r.segments.length).toBe(1);
  });
  test('porównania są dokładne', () => {
    const r = run('jeśli 0.1 + 0.2 = 0.3 [np 10]', '2d');
    expect(r.segments.length).toBe(0);
  });
});

describe('żółw', () => {
  test('kierunki', () => {
    near(end('pw 90 np 10'), [10, 0, 0]);
    near(end('lw 90 np 10'), [-10, 0, 0]);
    near(end('ws 5'), [0, -5, 0]);
  });
  test('3D: gora, pp', () => {
    near(end('gora 90 np 10', '3d'), [0, 0, 10]);
    near(end('dol 90 np 10', '3d'), [0, 0, -10]);
    near(end('pp 90 gora 90 np 10', '3d'), [10, 0, 0]);
    near(end('pp 90 pw 90 np 10', '3d'), [0, 0, -10]);
  });
  test('3D tylko w 3D', () => {
    const r = err('np 5\ngora 10');
    expect(r.error!.line).toBe(2);
    expect(r.segments).toEqual([]);
  });
  test('dom i czyść', () => {
    const r = run('np 10 pw 90 np 10 dom np 5', '2d');
    expect(r.segments.length).toBe(4);
    near(r.segments[2].to, [0, 0, 0]);
    near(r.segments[3].to, [0, 5, 0]);
    const c = run('np 10 czyść np 5', '2d');
    expect(c.segments.length).toBe(1);
  });
  test('pióro i kolor', () => {
    const r = run('pod np 10 opu kolor "#ABCDEF" grubosc 5 np 10', '2d');
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [0, 20, 0], color: '#abcdef', width: 5 }]);
  });
});

describe('powtórz i zmienne', () => {
  test('nrpowt', () => {
    near(end('powtorz 3 [np nrpowt]'), [0, 6, 0]);
    err('np nrpowt');
    err('oto f\n np nrpowt\njuż\npowtorz 2 [f]');
  });
  test('zmienne', () => {
    near(end('niech x 5 niech x x * 2 np x'), [0, 10, 0]);
    err('np y');
    const r = err('np 5\nnp x\nniech x 1');
    expect(r.error!.line).toBe(2);
    expect(r.segments.length).toBe(1);
    err('niech np 5');
  });
  test('zakresy', () => {
    near(end('niech x 3\noto f\n niech x 10\n np x\njuż\nf np x'), [0, 13, 0]);
  });
  test('limity argumentów', () => {
    err('grubosc 0');
    err('grubosc 13');
    err('grubosc 2.5');
    err('powtorz 10001 [np 1]');
    err('powtorz 1.5 [np 1]');
    expect(run('powtorz 0 [np 1]', '2d').error).toBeNull();
    const r = err('np 1\nniech n 20\ngrubosc n');
    expect(r.error!.line).toBe(3);
    expect(r.segments.length).toBe(1);
  });
});

describe('procedury', () => {
  test('definicja i wywołanie', () => {
    const r = run('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 40 * 2 90', '2d');
    expect(r.error).toBeNull();
    expect(r.segments.length).toBe(4);
    near(r.segments[0].to, [0, 80, 0]);
  });
  test('stara składnia i nazwy z wielkich liter', () => {
    const r = run('OTO Kw :bok :k\n np :bok pw k\nEND\nKW 10 90', '2d');
    expect(r.error).toBeNull();
  });
  test('stop kończy procedurę', () => {
    near(end('oto f\n powtorz 5 [np 1 stop]\n np 100\njuż\nf'), [0, 1, 0]);
    near(end('np 3 stop np 100'), [0, 3, 0]);
  });
  test('błędy', () => {
    err('oto f ma: a\n np a\njuż\nf');
    err('oto f\n np 1\n');
    err('powtorz 2 [\noto f\n np 1\njuż\n]');
    err('oto f\n np 1\njuż\noto f\n np 2\njuż');
    err('oto f\n np 1 już');
  });
  test('parametr o nazwie procedury', () => {
    const r = run('oto f ma: g\n np g\njuż\noto g ma: x\n np x\njuż\nf 4 g 5', '2d');
    expect(r.error).toBeNull();
  });
});

describe('limity', () => {
  test('operacje', () => {
    const r = run('powtorz 10000 [np 1]', '2d');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBeGreaterThan(1000);
  });
  test('odcinki, współrzędne i zagnieżdżenie', () => {
    err('powtorz 100 [powtorz 100 [np 1]]'); // 10 000+ operacji
    err('np 100001');
    err('oto f\n f\njuż\nf');
    err('['.repeat(33));
  });
  test('pozycja błędu limitu', () => {
    const r = err('powtorz 5000 [np 1]');
    expect(r.error!.message).toContain('limit');
  });
});
