import { describe, expect, test } from 'bun:test';
import { run, type RunResult } from '../src/lang/interpreter';
import { EXAMPLES } from '../src/content/examples';

const close = (a: number[], b: number[], eps = 1e-9) =>
  a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < eps);

function ok(src: string, mode: '2d' | '3d' = '2d'): RunResult {
  const r = run(src, mode);
  if (r.error) throw new Error(`unexpected error: ${JSON.stringify(r.error)}`);
  return r;
}

function err(src: string, mode: '2d' | '3d' = '2d') {
  const r = run(src, mode);
  if (!r.error) throw new Error('expected an error');
  return { ...r.error, segments: r.segments };
}

function endOf(r: RunResult) {
  return r.segments[r.segments.length - 1].to;
}

describe('przykłady standardowe', () => {
  const counts: Record<string, number> = {
    kwadrat: 4,
    gwiazda: 5,
    rozeta: 48,
    spirala: 90,
    wielokaty: 42,
    drzewo: 255,
    sniezynka: 768,
    schody: 12,
    szescian: 17,
    pierscien: 36,
    kula: 432,
    helisa: 240,
    drzewo3d: 121,
  };
  for (const e of EXAMPLES) {
    test(`${e.id} (${e.mode}) działa bez błędów`, () => {
      const r = ok(e.source, e.mode);
      expect(r.segments.length).toBe(counts[e.id]);
      for (const s of r.segments) {
        expect(s.color).toMatch(/^#[0-9a-f]{6}$/);
        expect(typeof s.width).toBe('number');
        expect(s.from.every(Number.isFinite) && s.to.every(Number.isFinite)).toBe(true);
      }
    });
  }

  test('płaskie przykłady dają te same współrzędne w 2D i 3D', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '2d')) {
      expect(run(e.source, '3d')).toEqual(run(e.source, '2d'));
    }
  });

  test('przykłady 3D zgłaszają błąd w trybie 2D', () => {
    for (const e of EXAMPLES.filter((x) => x.mode === '3d')) {
      const r = run(e.source, '2d');
      expect(r.error).not.toBeNull();
      expect(r.segments).toEqual([]);
    }
  });

  test('kwadrat: dokładne współrzędne', () => {
    const r = ok(EXAMPLES[0].source);
    expect(r.segments).toEqual([
      { from: [0, 0, 0], to: [0, 120, 0], color: '#16866a', width: 3 },
      { from: [0, 120, 0], to: [120, 120, 0], color: '#16866a', width: 3 },
      { from: [120, 120, 0], to: [120, 0, 0], color: '#16866a', width: 3 },
      { from: [120, 0, 0], to: [0, 0, 0], color: '#16866a', width: 3 },
    ]);
  });

  test('spirala zmienia kolory na przemian, długości rosną z nrpowt', () => {
    const r = ok(EXAMPLES.find((e) => e.id === 'spirala')!.source);
    expect(r.segments[0].color).toBe('#16866a');
    expect(r.segments[1].color).toBe('#c1763d');
    expect(r.segments[2].color).toBe('#16866a');
    const len = (i: number) => Math.hypot(...r.segments[i].to.map((v, k) => v - r.segments[i].from[k]));
    expect(len(0)).toBeCloseTo(2.5);
    expect(len(89)).toBeCloseTo(225);
  });
});

describe('geometria żółwia', () => {
  test('stan początkowy', () => {
    const r = ok('np 10');
    expect(r.segments).toEqual([{ from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 }]);
  });

  test('pw obraca zgodnie z ruchem wskazówek zegara', () => {
    expect(ok('pw 90 np 10').segments[0].to).toEqual([10, 0, 0]);
    expect(ok('lw 90 np 10').segments[0].to).toEqual([-10, 0, 0]);
    expect(ok('pw -90 np 10').segments[0].to).toEqual([-10, 0, 0]);
    expect(ok('ws 10').segments[0].to).toEqual([0, -10, 0]);
  });

  test('góra / dół / przechyły w 3D', () => {
    expect(ok('gora 90 np 10', '3d').segments[0].to).toEqual([0, 0, 10]);
    expect(ok('dol 90 np 10', '3d').segments[0].to).toEqual([0, 0, -10]);
    // po pp 90 grzbiet wskazuje dawne prawo (+X), więc góra 90 prowadzi w +X
    expect(ok('pp 90 gora 90 np 10', '3d').segments[0].to).toEqual([10, 0, 0]);
    // a prawo to dawny dół (-Z)
    expect(ok('pp 90 pw 90 np 10', '3d').segments[0].to).toEqual([0, 0, -10]);
    expect(ok('pl 90 pw 90 np 10', '3d').segments[0].to).toEqual([0, 0, 10]);
    // przechył nie zmienia kierunku
    expect(ok('pp 37 np 10', '3d').segments[0].to).toEqual([0, 10, 0]);
    expect(ok('gora 90 gora 90 np 10', '3d').segments[0].to).toEqual([0, -10, 0]);
  });

  test('polecenia 3D są błędem w trybie 2D', () => {
    for (const c of ['gora 10', 'góra 10', 'dol 10', 'dół 10', 'pp 10', 'pl 10', 'pitchup 1', 'rollleft 1']) {
      const e = err(`np 10\n${c}`);
      expect(e.line).toBe(2);
      expect(e.column).toBe(1);
      expect(e.segments).toEqual([]);
    }
  });

  test('ruch o zero nic nie rysuje, pióro podniesione też nie', () => {
    expect(ok('np 0 ws 0').segments).toEqual([]);
    expect(ok('pod np 10 opu np 5').segments).toEqual([{ from: [0, 10, 0], to: [0, 15, 0], color: '#16866a', width: 3 }]);
  });

  test('dom wraca do początku i rysuje, gdy pióro opuszczone', () => {
    const r = ok('pw 90 np 10 dom np 5');
    expect(r.segments.map((s) => s.to)).toEqual([[10, 0, 0], [0, 0, 0], [0, 5, 0]]);
    expect(ok('dom').segments).toEqual([]);
    expect(ok('pod np 10 dom opu np 1').segments).toEqual([{ from: [0, 0, 0], to: [0, 1, 0], color: '#16866a', width: 3 }]);
  });

  test('dom przywraca orientację 3D, nie zmienia pióra', () => {
    const r = ok('kolor "#ff0000" grubosc 5 pod gora 30 pp 40 np 5 dom opu np 5', '3d');
    expect(r.segments).toEqual([{ from: [0, 0, 0], to: [0, 5, 0], color: '#ff0000', width: 5 }]);
  });

  test('czyść usuwa odcinki i nic więcej', () => {
    const r = ok('kolor "#AABBCC" np 10 pw 90 czyść np 5');
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [5, 10, 0], color: '#aabbcc', width: 3 }]);
    expect(ok('np 10 cs').segments).toEqual([]);
    expect(ok('np 10 clearscreen czysc').segments).toEqual([]);
  });

  test('kolor i grubość', () => {
    const r = ok('kolor "#ABCDEF" grubosc 12 np 1 grubość 1 color "#000000" width 7 fd 1');
    expect(r.segments.map((s) => [s.color, s.width])).toEqual([['#abcdef', 12], ['#000000', 7]]);
  });

  test('aliasy angielskie i polskie są równoważne', () => {
    const pl = ok('naprzód 10 prawo 90 naprzod 5 wstecz 2 lewo 45 podnieś np 1 opuść np 1 powtórz 2 [np 1]');
    const en = ok('forward 10 right 90 fd 5 back 2 left 45 penup forward 1 pendown fd 1 repeat 2 [fd 1]');
    expect(en).toEqual(pl);
    const mix = ok('FD 10 Rt 90 NP 5 BK 2 LT 45 PU np 1 PD np 1 REPEAT 2 [np 1]');
    expect(mix).toEqual(pl);
  });
});

describe('wyrażenia', () => {
  const dist = (src: string) => endOf(ok(`np ${src}`))[1];

  test('pierwszeństwo i łączność', () => {
    expect(dist('20 - 5 - 3')).toBe(12);
    expect(dist('2 + 3 * 4')).toBe(14);
    expect(dist('(2 + 3) * 4')).toBe(20);
    expect(dist('100 / 10 / 2')).toBe(5);
    expect(dist('2 * 3 + 4 * 5')).toBe(26);
  });

  test('liczby dziesiętne', () => {
    expect(dist('12.5')).toBe(12.5);
    expect(dist('.5')).toBe(0.5);
  });

  test('reguła spacji wokół operatorów', () => {
    expect(dist('10 - 5')).toBe(5);
    expect(dist('10-5')).toBe(5);
    expect(dist('10*2')).toBe(20);
    expect(dist('10 / 2')).toBe(5);
    const e = err('np 10 -5');
    expect([e.line, e.column]).toEqual([1, 7]);
    expect(e.segments).toEqual([]);
    expect(err('np 10- 5').column).toBe(6);
    expect(err('np 10 *2').column).toBe(7);
    expect(err('np 10 +5').column).toBe(7);
    expect(err('np 10/ 2').column).toBe(6);
  });

  test('znaki jednoargumentowe', () => {
    expect(dist('-(3 - 5)')).toBe(2);
    expect(dist('- -2')).toBe(2);
    expect(dist('--2')).toBe(2);
    expect(dist('+3')).toBe(3);
    expect(dist('-+-4')).toBe(4);
    expect(endOf(ok('niech bok 7 np -bok'))[1]).toBe(-7);
    expect(dist('2 * -3 + 10')).toBe(4);
    expect(dist('10 - -3')).toBe(13);
  });

  test('porównania są dokładne', () => {
    expect(ok('jeśli 0.1 + 0.2 = 0.3 [np 10]').segments).toEqual([]);
    expect(ok('jeśli 0.5 + 0.25 = 0.75 [np 10]').segments.length).toBe(1);
    const cmp = (c: string) => ok(`jeśli ${c} [np 1]`).segments.length;
    expect(cmp('1 < 2')).toBe(1);
    expect(cmp('2 < 1')).toBe(0);
    expect(cmp('2 > 1')).toBe(1);
    expect(cmp('1 <= 1')).toBe(1);
    expect(cmp('1 >= 2')).toBe(0);
    expect(cmp('1 <> 2')).toBe(1);
    expect(cmp('1 <> 1')).toBe(0);
    expect(cmp('1<2')).toBe(1);
    // „2 -1”: minus ze spacją tylko z lewej nie jest działaniem
    expect(err('jeśli 2 -1 = 1 [np 1]').column).toBe(9);
  });

  test('niepoprawne liczby', () => {
    for (const bad of ['1e3', '0x10', '1.2.3', '5.', '12abc']) {
      const e = err(`np ${bad}`);
      expect([e.line, e.column]).toEqual([1, 4]);
    }
    expect(err('np NaN').column).toBe(4);
    expect(err('np Infinity').column).toBe(4);
  });

  test('dzielenie przez zero i wynik nieskończony to błędy wykonania', () => {
    const e = err('np 10\nniech z 0\nnp 5 + 10 / z');
    expect([e.line, e.column]).toEqual([3, 4]);
    expect(e.segments.length).toBe(1);
    const big = err('np 1\nniech x 1' + ' * 1000000000'.repeat(40) + '\nnp x');
    expect(big.line).toBe(2);
    expect(big.column).toBe(9);
    // literalne dzielenie przez zero też dopiero w trakcie
    const lit = err('np 3\nnp (1 / 0)');
    expect([lit.line, lit.column, lit.segments.length]).toEqual([2, 4, 1]);
  });

  test('głębokie nawiasy', () => {
    expect(dist('('.repeat(2000) + '7' + ')'.repeat(2000))).toBe(7);
  });

  test('nawiasy niezamknięte i nadmiarowe', () => {
    expect(err('np (1 + 2').column).toBe(4);
    expect(err('np 1 + 2)').column).toBe(9);
    expect(err('np (1 + 2 3)').column).toBe(11);
  });
});

describe('powtórz i nrpowt', () => {
  test('licznik powtórzeń', () => {
    const r = ok('powtorz 3 [np nrpowt pw 90]');
    expect(r.segments.length).toBe(3);
    expect(r.segments[2].to).toEqual([2, -2, 0]);
  });

  test('nrpowt dotyczy najbliższego powtórz', () => {
    const r = ok('powtorz 2 [powtorz 3 [np nrpowt] np nrpowt * 100]');
    const lens = r.segments.map((s) => s.to[1] - s.from[1]);
    expect(lens).toEqual([1, 2, 3, 100, 1, 2, 3, 200]);
  });

  test('zero powtórzeń, liczba spoza zakresu', () => {
    expect(ok('powtorz 0 [np 10]').segments).toEqual([]);
    expect(err('np 1 powtorz 10001 [np 1]').column).toBe(14);
    expect(err('np 1 powtorz 2.5 [np 1]').segments).toEqual([]);
    expect(err('powtorz -1 [np 1]').column).toBe(9);
    expect(err('powtorz 2 * 3.25 [np 1]').column).toBe(9);
    expect(ok('powtorz 2 * 3.5 [np 1]').segments.length).toBe(7);
  });

  test('liczba powtórzeń z nazwy sprawdzana w trakcie', () => {
    const e = err('np 5\nniech n 2.5\npowtorz n [np 1]');
    expect([e.line, e.column, e.segments.length]).toEqual([3, 9, 1]);
  });

  test('nrpowt poza powtórz jest błędem przed uruchomieniem', () => {
    const e = err('np 10\nnp nrpowt');
    expect([e.line, e.column, e.segments.length]).toEqual([2, 4, 0]);
    const p = err('oto a\n  np nrpowt\njuż\npowtorz 3 [a]');
    expect([p.line, p.column]).toEqual([2, 6]);
    expect(ok('oto a\n  powtorz 2 [np repcount]\njuż\na').segments.length).toBe(2);
    expect(err('nrpowt').column).toBe(1);
  });
});

describe('zmienne', () => {
  test('przypisanie i ponowne przypisanie', () => {
    expect(endOf(ok('niech x 5 niech x x * 2 np x'))[1]).toBe(10);
    expect(endOf(ok('let x 5 np :x'))[1]).toBe(5);
    expect(endOf(ok('niech Bok 5 np BOK'))[1]).toBe(5);
  });

  test('globalna przypisana później może być użyta w procedurze', () => {
    expect(endOf(ok('oto a\n np d\njuż\nniech d 9\na'))[1]).toBe(9);
  });

  test('nieznana nazwa to błąd przed uruchomieniem', () => {
    const e = err('np 10\nnp y');
    expect([e.line, e.column, e.segments.length]).toEqual([2, 4, 0]);
    // zmienna lokalna innej procedury nie jest widoczna
    const p = err('oto a\n niech q 1\njuż\noto b\n np q\njuż\na b');
    expect([p.line, p.column]).toEqual([5, 5]);
  });

  test('odczyt przed przypisaniem to błąd wykonania przy pierwszym tokenie argumentu', () => {
    const e = err('np 10\nnp 2 * x\nniech x 1');
    expect([e.line, e.column, e.segments.length]).toEqual([2, 4, 1]);
  });

  test('zmienna lokalna przesłania globalną do końca wywołania', () => {
    const src = `niech x 1
oto a
  np x
  niech x 10
  np x
już
a
np x`;
    const r = ok(src);
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([1, 10, 1]);
  });

  test('lokalna bez globalnej: odczyt przed niech to błąd', () => {
    const e = err('oto a\n  np y\n  niech y 2\njuż\na');
    expect([e.line, e.column]).toEqual([2, 6]);
  });

  test('parametr można przypisać na nowo', () => {
    expect(endOf(ok('oto a ma: b\n niech b b + 1\n np b\njuż\na 4'))[1]).toBe(5);
  });

  test('nazwa zmiennej nie może być poleceniem ani procedurą', () => {
    expect(err('niech np 4').column).toBe(7);
    expect(err('oto a\njuż\nniech a 4').column).toBe(7);
    expect(err('niech nrpowt 4').column).toBe(7);
  });
});

describe('warunki', () => {
  test('jeśli i jeżeli', () => {
    expect(ok('niech a 3 jeśli a > 2 [np 1]').segments.length).toBe(1);
    expect(ok('niech a 3 jesli a < 2 [np 1]').segments.length).toBe(0);
    const r = ok('niech a 3 jeżeli a > 2 [kolor "#ff0000"] [kolor "#0000ff"] np 1 jezeli a < 2 [kolor "#ff0000"] [kolor "#0000ff"] np 1');
    expect(r.segments.map((s) => s.color)).toEqual(['#ff0000', '#0000ff']);
    expect(ok('if 1 = 1 [fd 1] ifelse 1 = 2 [fd 1] [fd 2]').segments.length).toBe(2);
  });

  test('brak porównania lub nawiasu', () => {
    expect(err('jeśli 1 [np 1]').column).toBe(9);
    expect(err('jeżeli 1 = 1 [np 1]').segments).toEqual([]);
    expect(err('jeżeli 1 = 1 [np 1] np 4').column).toBe(21);
  });
});

describe('procedury', () => {
  test('przykład z opisu i nagłówek w starym stylu', () => {
    const a = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90');
    const b = ok('to kwadrat :bok :kąt\n  repeat 4 [fd :bok rt :kąt]\nend\n\nkwadrat 80 90');
    expect(a).toEqual(b);
    expect(a.segments.length).toBe(4);
    expect(a.segments[1].to).toEqual([80, 80, 0]);
  });

  test('argumenty są wyrażeniami', () => {
    const r = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 40 * 2 90');
    expect(r.segments[0].to).toEqual([0, 80, 0]);
  });

  test('wywołanie przed definicją, wielkość liter', () => {
    expect(ok('KROK 5\noto krok ma: d\n np d\nJUŻ').segments.length).toBe(1);
  });

  test('parametr o nazwie procedury', () => {
    const src = 'oto bok\n np 1\njuż\noto rys ma: bok\n  np bok\n  bok\njuż\nrys 7';
    const r = ok(src);
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([7, 1]);
  });

  test('stop kończy wywołanie, także z wnętrza powtórz', () => {
    const r = ok('oto a\n  powtorz 10 [np 1 jeśli nrpowt = 3 [stop]]\n  np 100\njuż\na\nnp 5');
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([1, 1, 1, 5]);
  });

  test('stop na najwyższym poziomie kończy program', () => {
    expect(ok('np 1 powtorz 5 [np 1 stop] np 1').segments.length).toBe(2);
  });

  test('rekurencja', () => {
    const r = ok('oto s ma: n\n  jeśli n = 0 [stop]\n  np n\n  s n - 1\njuż\ns 4');
    expect(r.segments.length).toBe(4);
  });

  test('zła liczba argumentów', () => {
    const src = 'oto k ma: a, b\n np a\njuż\n';
    const few = err(src + 'k 1\nnp 5');
    expect([few.line, few.column]).toEqual([5, 1]);
    const eof = err(src + 'k 1');
    expect([eof.line, eof.column]).toEqual([4, 1]);
    const many = err(src + 'k 1 2 3');
    expect([many.line, many.column]).toEqual([4, 7]);
    const bracket = err(src + 'powtorz 2 [k 1]');
    expect([bracket.line, bracket.column]).toEqual([4, 15]);
  });

  test('definicje: błędy', () => {
    expect(err('powtorz 2 [\noto a\njuż\n]').line).toBe(2);
    expect(err('oto a\n np 1\n').line).toBe(1);
    const nested = err('oto a\noto b\njuż\njuż');
    expect([nested.line, nested.column]).toEqual([2, 1]);
    const dup = err('oto a\njuż\noto A\njuż');
    expect([dup.line, dup.column]).toEqual([3, 5]);
    expect(err('oto a\n np 1 już').line).toBe(2);
    expect(err('już').line).toBe(1);
    expect(err('np 1 oto a\njuż').column).toBe(6);
    expect(err('oto np\njuż').column).toBe(5);
  });

  test('procedura nie zwraca wartości', () => {
    expect(err('oto a\njuż\nnp a').column).toBe(4);
  });
});

describe('błędy i ich pozycje', () => {
  test('nieznane polecenie', () => {
    const e = err('np 10\n  skacz 5');
    expect([e.line, e.column]).toEqual([2, 3]);
    expect(e.message).toContain('skacz');
  });

  test('brak argumentu', () => {
    expect(err('np').column).toBe(1);
    const e = err('powtorz 2 [np]');
    expect([e.line, e.column]).toEqual([1, 14]);
    expect(err('np pw 90').column).toBe(4);
    expect(err('np (').column).toBe(4);
    expect(err('np ()').column).toBe(5);
  });

  test('wartość zamiast polecenia', () => {
    expect(err('np 10 20').column).toBe(7);
    expect(err('"#ffffff"').column).toBe(1);
  });

  test('kolor', () => {
    expect(err('kolor "#12345"').column).toBe(7);
    expect(err('kolor "#12345g"').column).toBe(7);
    expect(err('kolor 5').column).toBe(7);
    expect(err('kolor').column).toBe(1);
    expect(err('kolor "#123456').column).toBe(7);
    expect(err('kolor red').column).toBe(7);
  });

  test('grubość', () => {
    expect(err('grubosc 0').column).toBe(9);
    expect(err('grubosc 13').column).toBe(9);
    expect(err('grubosc 2.5').column).toBe(9);
    const e = err('np 4\nniech g 20\ngrubosc g / 2 + 3');
    expect([e.line, e.column, e.segments.length]).toEqual([3, 9, 1]);
  });

  test('nawiasy kwadratowe', () => {
    expect(err('powtorz 2 [np 1').column).toBe(11);
    expect(err('np 1 ]').column).toBe(6);
    expect(err('powtorz 2 np 1').column).toBe(11);
    expect(err('powtorz 2').column).toBe(1);
  });

  test('komunikaty są po polsku', () => {
    expect(err('np 1 / 0').message).toMatch(/[Dd]zielenie przez zero/);
    expect(err('skacz').message).toMatch(/Nieznane polecenie/);
  });

  test('błąd składni nic nie rysuje, błąd wykonania zachowuje rysunek', () => {
    expect(err('np 10\nnp 10\nzzz').segments).toEqual([]);
    const r = err('np 10\nniech a 0\nnp 1 / a\nnp 5');
    expect(r.segments.length).toBe(1);
  });

  test('błąd wykonania po czyść zwraca tylko późniejsze odcinki', () => {
    const r = err('np 10\nczyść\nnp 3\nniech a 0\nnp 1 / a');
    expect(r.segments).toEqual([{ from: [0, 10, 0], to: [0, 13, 0], color: '#16866a', width: 3 }]);
  });

  test('komentarze', () => {
    expect(ok('; komentarz\nnp 10 ; i tu\n;np 5').segments.length).toBe(1);
  });

  test('nieznany znak', () => {
    expect(err('np 10 @').column).toBe(7);
  });
});

describe('limity', () => {
  test('długość źródła', () => {
    expect(ok('np 1' + ' '.repeat(49_996)).segments.length).toBe(1);
    expect(err('np 1' + ' '.repeat(49_997)).segments).toEqual([]);
  });

  test('liczba tokenów', () => {
    expect(ok('np 1 '.repeat(5000)).segments.length).toBe(5000);
    const e = err('np 1 '.repeat(5000) + 'pw');
    expect(e.column).toBe(25_001);
  });

  test('głębokość nawiasów kwadratowych', () => {
    const nest = (d: number) => 'powtorz 1 ['.repeat(d) + 'np 1' + ']'.repeat(d);
    expect(err(nest(33)).message).toMatch(/zagnieżdżenie/);
    // 32 poziomy nawiasów przechodzą parser, ale 32 powtórzenia + nic więcej mieszczą się w ramkach
    expect(ok(nest(32)).segments.length).toBe(1);
    const ifs = (d: number) => 'jeśli 1 = 1 ['.repeat(d) + 'np 1' + ']'.repeat(d);
    expect(ok(ifs(32)).segments.length).toBe(1);
    expect(err(ifs(33)).segments).toEqual([]);
  });

  test('ramki: wywołania i powtórzenia', () => {
    const rec = (n: number) => `oto r ma: n\n  jeśli n = 0 [stop]\n  r n - 1\njuż\nr ${n}`;
    expect(ok(rec(31)).error).toBeNull(); // 32 aktywne wywołania
    const e = err(rec(32));
    expect([e.line, e.column]).toEqual([3, 3]);
    // warunki nie są ramkami
    const nested = 'oto r ma: n\n  jeśli n > 0 [jeśli 1 = 1 [r n - 1]]\njuż\nr 31';
    expect(ok(nested).error).toBeNull();
  });

  test('wykonane operacje', () => {
    // 1 (powtórz) + n * (1 polecenie + 1 koniec iteracji)
    expect(ok('powtorz 4999 [pw 1]').error).toBeNull();
    expect(ok('pw 1 powtorz 4999 [pw 1]').error).toBeNull(); // dokładnie 10 000
    const e = err('pw 1 pw 1 powtorz 4999 [pw 1]');
    expect(e.message).toMatch(/10 000/);
    expect(err('powtorz 5000 [pw 1]').message).toMatch(/operacji/);
    // wywołanie: 1 + treść + 1
    // wywołanie: 1 + treść + 1; w powtórz: 1 + n * (1 + 1 + 1 + 1)
    const proc = 'oto a\n pw 1\njuż\n';
    expect(ok(proc + 'pw 1 pw 1 pw 1 powtorz 2499 [a]').error).toBeNull();
    expect(err(proc + 'pw 1 pw 1 pw 1 pw 1 powtorz 2499 [a]').message).toMatch(/operacji/);
    // jeśli: 1 + treść + 1; fałszywe: 1
    expect(ok('pw 1 pw 1 pw 1 powtorz 2499 [jeśli 1 = 1 [pw 1]]').error).toBeNull();
    expect(err('pw 1 pw 1 pw 1 pw 1 powtorz 2499 [jeśli 1 = 1 [pw 1]]').message).toMatch(/operacji/);
    expect(ok('pw 1 powtorz 4999 [jeśli 1 = 2 [pw 1]]').error).toBeNull();
    expect(err('pw 1 pw 1 powtorz 4999 [jeśli 1 = 2 [pw 1]]').message).toMatch(/operacji/);
    // stop: polecenie + zakończenie wywołania
    expect(ok('oto s\n stop\njuż\npw 1 pw 1 pw 1 powtorz 2499 [s]').error).toBeNull();
    expect(err('oto s\n stop\njuż\npw 1 pw 1 pw 1 pw 1 powtorz 2499 [s]').message).toMatch(/operacji/);
  });

  test('liczba odcinków', () => {
    // każdy odcinek to co najmniej jedna operacja, więc limit operacji pilnuje też odcinków
    const lots = 'powtorz 500 [np 1 pw 90 np 1 pw 90]\n';
    expect(ok(lots).segments.length).toBe(1000);
    expect(ok(lots + 'czyść\n' + lots).segments.length).toBe(1000);
  });

  test('współrzędne', () => {
    expect(ok('np 100000').segments.length).toBe(1);
    const e = err('np 50000\nnp 50001');
    expect([e.line, e.column, e.segments.length]).toEqual([2, 1, 1]);
    expect(err('pod np 100001').segments).toEqual([]);
    expect(err('gora 90 np 100000.5', '3d').line).toBe(1);
  });
});

describe('API run', () => {
  test('tryb 3D i 2D dają identyczne płaskie wyniki', () => {
    const src = 'powtorz 7 [np 33.3 pw 51.4 niech q nrpowt * 1.7 ws q lw 13]';
    expect(run(src, '3d')).toEqual(run(src, '2d'));
  });

  test('brak minus zera w wynikach', () => {
    const r = ok('pw 180 np 10 pw 90 np 5');
    for (const s of r.segments) for (const v of [...s.from, ...s.to]) expect(Object.is(v, -0)).toBe(false);
  });

  test('przykład geometrii 3D: helisa wznosi się', () => {
    const r = ok(EXAMPLES.find((e) => e.id === 'helisa')!.source, '3d');
    expect(r.segments[r.segments.length - 1].to[2]).toBeCloseTo(180);
    expect(close(r.segments[0].to, [0, 10, 0])).toBe(true);
  });
});
