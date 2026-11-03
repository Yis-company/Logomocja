import { describe, expect, test } from 'bun:test';
import { run } from '../src/lang/interp';
import { EXAMPLES } from '../src/content/examples';
import { CHALLENGES, check } from '../src/content/challenges';

const last = (s: string, m: '2d' | '3d' = '2d') => {
  const r = run(s, m);
  expect(r.error).toBeNull();
  return r.segments[r.segments.length - 1].to;
};
const err = (s: string, m: '2d' | '3d' = '2d') => {
  const r = run(s, m);
  expect(r.error).not.toBeNull();
  return r;
};
const near = (a: number[], b: number[]) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 9));

describe('wyrażenia', () => {
  test('pierwszeństwo i łączność', () => {
    expect(last('np 20 - 5 - 3')).toEqual([0, 12, 0]);
    expect(last('np 2 + 3 * 4')).toEqual([0, 14, 0]);
    expect(last('np 100 / 5 / 2')).toEqual([0, 10, 0]);
  });
  test('spacje wokół operatora', () => {
    expect(last('np 10 - 5')).toEqual([0, 5, 0]);
    expect(last('np 10-5')).toEqual([0, 5, 0]);
    const r = err('np 10 -5');
    expect(r.error).toMatchObject({ line: 1, column: 7 });
    expect(r.segments).toEqual([]);
    expect(err('np 10 +5').error!.column).toBe(7);
    expect(err('np 10 *5').error!.column).toBe(7);
    expect(err('np 10* 5').error!.column).toBe(6);
  });
  test('znaki jednoargumentowe', () => {
    expect(last('np -(3 - 5)')).toEqual([0, 2, 0]);
    expect(last('np - -2')).toEqual([0, 2, 0]);
    expect(last('niech bok 4 np -bok')).toEqual([0, -4, 0]);
    expect(last('np +-+3')).toEqual([0, -3, 0]);
  });
  test('liczby', () => {
    expect(last('np .5')).toEqual([0, 0.5, 0]);
    expect(last('np 12.5')).toEqual([0, 12.5, 0]);
    for (const s of ['np 1e3', 'np 0x10', 'np NaN', 'np Infinity', 'np 5.']) err(s);
  });
  test('porównania są dokładne', () => {
    expect(run('jeśli 0.1 + 0.2 = 0.3 [np 5]', '2d')).toEqual({ segments: [], error: null });
    expect(run('jeśli 1 <> 2 [np 5]', '2d').segments.length).toBe(1);
    expect(run('jezeli 2 <= 1 [np 5] [np 7]', '2d').segments[0].to).toEqual([0, 7, 0]);
  });
  test('dzielenie przez zero to błąd wykonania w miejscu argumentu', () => {
    const r = run('np 10\nnp 5 + 1 / 0', '2d');
    expect(r.segments.length).toBe(1);
    expect(r.error).toMatchObject({ line: 2, column: 4 });
  });
});

describe('żółw', () => {
  test('stan początkowy i 2D', () => {
    const r = run('np 10 pw 90 np 10 lw 90 ws 5', '2d');
    expect(r.segments).toEqual([
      { from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 },
      { from: [0, 10, 0], to: [10, 10, 0], color: '#16866a', width: 3 },
      { from: [10, 10, 0], to: [10, 5, 0], color: '#16866a', width: 3 },
    ]);
  });
  test('góra, dół i przechył', () => {
    expect(last('gora 90 np 10', '3d')).toEqual([0, 0, 10]);
    expect(last('dol 90 np 10', '3d')).toEqual([0, 0, -10]);
    expect(last('pp 90 gora 90 np 10', '3d')).toEqual([10, 0, 0]);
    expect(last('pp 90 pw 90 np 10', '3d')).toEqual([0, 0, -10]);
    expect(last('pl 90 pw 90 np 10', '3d')).toEqual([0, 0, 10]);
    expect(err('gora 90', '2d').error).toMatchObject({ line: 1, column: 1 });
    expect(err('np 5 pp 1', '2d').segments).toEqual([]);
  });
  test('ten sam rysunek w 2D i 3D', () => {
    for (const e of EXAMPLES.filter((e) => e.mode === '2d')) {
      expect(run(e.source, '3d')).toEqual(run(e.source, '2d'));
    }
  });
  test('ruch o zero nie rysuje, pióro i kolor', () => {
    expect(run('np 0 pod np 5 opu kolor "#ABCDEF" grubosc 7 np 1', '2d').segments).toEqual([
      { from: [0, 5, 0], to: [0, 6, 0], color: '#abcdef', width: 7 },
    ]);
  });
  test('dom i czyść', () => {
    const r = run('np 5 pw 90 np 5 dom np 1', '2d');
    expect(r.segments.length).toBe(4);
    expect(r.segments[2].to).toEqual([0, 0, 0]);
    expect(r.segments[3].to).toEqual([0, 1, 0]);
    expect(run('dom', '2d').segments).toEqual([]);
    const c = run('np 5 czyść np 7', '2d');
    expect(c.segments).toEqual([{ from: [0, 5, 0], to: [0, 12, 0], color: '#16866a', width: 3 }]);
    const ce = run('np 5 czyść np 7 np 1 / 0', '2d');
    expect(ce.segments.length).toBe(1);
  });
  test('kąty ujemne i dziesiętne', () => {
    near(last('pw -90 np 10'), [-10, 0, 0]);
    near(last('pw 45 np 10'), [Math.SQRT1_2 * 10, Math.SQRT1_2 * 10, 0]);
  });
});

describe('powtórz, zmienne, warunki', () => {
  test('nrpowt', () => {
    const r = run('powtorz 3 [np nrpowt]', '2d');
    expect(r.segments.map((s) => s.to[1])).toEqual([1, 3, 6]);
    const n = run('powtorz 2 [powtorz 2 [np nrpowt] np nrpowt * 10]', '2d');
    expect(n.segments.map((s) => s.to[1] - s.from[1])).toEqual([1, 2, 10, 1, 2, 20]);
    expect(err('np nrpowt').error).toMatchObject({ line: 1, column: 4 });
    expect(err('oto a\n  np nrpowt\njuż\npowtorz 2 [a]').error).toMatchObject({ line: 2, column: 6 });
    expect(run('oto a\n  powtorz 2 [np repcount]\njuż\na', '2d').error).toBeNull();
  });
  test('zakres powtórzeń', () => {
    expect(run('powtorz 0 [np 1]', '2d')).toEqual({ segments: [], error: null });
    expect(err('np 1 powtorz 10001 [np 1]').segments).toEqual([]);
    expect(err('powtorz 2.5 [np 1]').error!.column).toBe(9);
    const r = run('np 1 niech n -1 powtorz n + 0 [np 1]', '2d');
    expect(r.segments.length).toBe(1);
    expect(r.error!.column).toBe(25);
  });
  test('grubość', () => {
    expect(err('grubosc 0').error!.column).toBe(9);
    expect(err('np 1 grubosc 2.5').segments).toEqual([]);
    const r = run('np 1 niech g 13 grubosc g', '2d');
    expect(r.segments.length).toBe(1);
    expect(r.error!.column).toBe(25);
  });
  test('zasięg nazw', () => {
    expect(err('np x').error).toMatchObject({ line: 1, column: 4 });
    expect(run('oto f\n np x\njuż\nniech x 3 f', '2d').segments.length).toBe(1);
    const u = run('np 5\npowtorz 1 [np 2 + x]\nniech x 1', '2d');
    expect(u.segments.length).toBe(1);
    expect(u.error).toMatchObject({ line: 2, column: 15 });
    expect(err('oto f\n niech y 2\njuż\nnp y').error!.line).toBe(4);
  });
  test('zmienne lokalne zasłaniają globalne', () => {
    const src = 'niech x 10\noto f\n np x\n niech x 1\n np x\njuż\nf np x';
    expect(run(src, '2d').segments.map((s) => s.to[1] - s.from[1])).toEqual([10, 1, 10]);
    expect(run('oto f ma: a\n niech a a * 2 np a\njuż\nf 3', '2d').segments[0].to).toEqual([0, 6, 0]);
  });
  test('zmienna nie może nazywać się jak procedura ani polecenie', () => {
    err('oto f\njuż\nniech f 1');
    err('niech np 1');
  });
});

describe('procedury', () => {
  test('wywołania i argumenty', () => {
    const src = 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 40 * 2 90';
    const r = run(src, '2d');
    expect(r.segments.length).toBe(4);
    expect(r.segments[0].to).toEqual([0, 80, 0]);
    expect(last('kw 10\noto KW :Bok\nnp :bok\njuż')).toEqual([0, 10, 0]);
    expect(err('oto f ma: a\njuż\nf').error).toMatchObject({ line: 3, column: 1 });
    expect(err('oto f ma: a\njuż\nf ]').error).toMatchObject({ line: 3, column: 3 });
  });
  test('parametr o nazwie procedury', () => {
    const src = 'oto bok\n np 1\njuż\noto f ma: bok\n bok np bok\njuż\nf 5';
    expect(run(src, '2d').segments.map((s) => s.to[1])).toEqual([1, 6]);
  });
  test('stop', () => {
    expect(run('np 5 stop np 5', '2d').segments.length).toBe(1);
    expect(run('powtorz 3 [np 1 stop] np 9', '2d').segments.length).toBe(1);
    const r = run('oto f\n powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\njuż\nf np 10', '2d');
    expect(r.segments.map((s) => s.to[1])).toEqual([1, 2, 12]);
  });
  test('błędy definicji', () => {
    expect(err('powtorz 2 [\noto f\njuż\n]').error!.line).toBe(2);
    expect(err('oto f\nnp 1').error).toMatchObject({ line: 1, column: 1 });
    expect(err('oto f\noto g\njuż\njuż').error!.line).toBe(2);
    expect(err('oto f\njuż\noto f\njuż').error!.line).toBe(3);
    expect(err('np 1 oto f\njuż').error!.column).toBe(6);
  });
  test('rekurencja i limit ramek', () => {
    expect(err('oto f ma: n\n f n + 1\njuż\nf 1').error!.line).toBe(2);
    const ok = run('oto f ma: n\n jeśli n > 31 [stop]\n np 1 f n + 1\njuż\nf 1', '2d');
    expect(ok.error).toBeNull();
    expect(ok.segments.length).toBe(31);
  });
});

describe('błędy i limity', () => {
  test('nawiasy', () => {
    expect(err('powtorz 2 [np 1').error).toMatchObject({ line: 1, column: 11 });
    expect(err('np 1 ]').error!.column).toBe(6);
    expect(err('np (1 + 2').error!.column).toBe(4);
    expect(err('np 1 + 2)').error!.column).toBe(9);
    expect(err('np ]').error!.column).toBe(4);
    expect(err('np').error!.column).toBe(1);
  });
  test('kolory', () => {
    for (const s of ['kolor "#12345"', 'kolor "red"', 'kolor 5', 'kolor "#1234567"', 'kolor']) err(s);
  });
  test('błąd składni niczego nie rysuje', () => {
    expect(run('np 50\npw 90\nnieznane 4', '2d')).toMatchObject({ segments: [], error: { line: 3, column: 1 } });
  });
  test('limit operacji', () => {
    expect(run('powtorz 4999 [pw 1]', '2d').error).toBeNull();
    expect(run('powtorz 5000 [pw 1]', '2d').error).not.toBeNull();
  });
  test('limit znaków, elementów, zagnieżdżenia, współrzędnych i odcinków', () => {
    expect(err('np 1 ' + ' '.repeat(50_000)).segments).toEqual([]);
    expect(err('pw 1 '.repeat(5001)).segments).toEqual([]);
    expect(err('powtorz 1 ['.repeat(33) + ']'.repeat(33)).segments).toEqual([]);
    expect(run('powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32), '2d').error).toBeNull();
    const c = run('np 60000 np 50000', '2d');
    expect(c.segments.length).toBe(1);
    expect(c.error!.column).toBe(10);
    expect(run('powtorz 32 [powtorz 1 [np 1]]', '2d').error).toBeNull();
  });
  test('komentarze i wielkość liter', () => {
    expect(last('NP 5 ; komentarz\nPOWTÓRZ 1 [Naprzód 5]')).toEqual([0, 10, 0]);
  });
});

describe('przykłady i wyzwania', () => {
  test('wszystkie przykłady działają', () => {
    for (const e of EXAMPLES) {
      const r = run(e.source, e.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });
  test('rozwiązania wzorcowe przechodzą, puste nie', () => {
    expect(CHALLENGES.length).toBeGreaterThanOrEqual(5);
    for (const c of CHALLENGES) {
      expect(check(c, c.solution).ok).toBe(true);
      expect(check(c, 'np 10').ok).toBe(false);
    }
  });
});

describe('pomoc', () => {
  test('przykłady z dokumentacji działają', async () => {
    const { COMMANDS, TOPICS } = await import('../src/content/reference');
    for (const c of COMMANDS) expect(run(c.example, c.mode).error).toBeNull();
    for (const t of TOPICS) for (const e of t.examples ?? []) expect(run(e.code, e.mode).error).toBeNull();
  });
});
