import { describe, expect, test } from 'bun:test';
import { runProgram } from '../src/lang';

const close = (a: number[], b: number[], eps = 1e-9) => {
  expect(a.length).toBe(b.length);
  a.forEach((v, i) => expect(Math.abs(v - b[i])).toBeLessThan(eps));
};

function ok(src: string, mode: '2d' | '3d' = '2d') {
  const r = runProgram(src, mode);
  expect(r.error).toBeNull();
  return r.segments;
}
function fail(src: string, mode: '2d' | '3d' = '2d') {
  const r = runProgram(src, mode);
  expect(r.error).not.toBeNull();
  return r;
}

describe('liczby i leksyka', () => {
  test('liczby dziesiętne', () => {
    expect(ok('np 80')[0].to).toEqual([0, 80, 0]);
    expect(ok('np 12.5')[0].to).toEqual([0, 12.5, 0]);
    expect(ok('np .5')[0].to).toEqual([0, 0.5, 0]);
  });
  test('niepoprawne liczby to błąd', () => {
    for (const bad of ['1e3', '0x10', 'NaN', 'Infinity', '1.', '1.2.3', '5x']) {
      const r = fail(`np ${bad}`);
      expect(r.segments).toEqual([]);
      expect(r.error!.line).toBe(1);
      expect(r.error!.column).toBe(4);
    }
  });
  test('wielkość liter i aliasy', () => {
    const a = ok('NP 10 Pw 90 NAPRZÓD 10 rt 90 FORWARD 10');
    expect(a.length).toBe(3);
    for (const alias of ['np', 'naprzod', 'naprzód', 'fd', 'forward']) {
      expect(ok(`${alias} 5`)[0].to).toEqual([0, 5, 0]);
    }
    for (const alias of ['ws', 'wstecz', 'bk', 'back']) {
      expect(ok(`${alias} 5`)[0].to).toEqual([0, -5, 0]);
    }
  });
  test('komentarze', () => {
    expect(ok('; nic\nnp 5 ; pięć\n; koniec').length).toBe(1);
  });
  test('kolor', () => {
    expect(ok('kolor "#AbCdEf" np 1')[0].color).toBe('#abcdef');
    for (const bad of ['"#12345"', '"#1234567"', '"16866a"', '"#gggggg"', '5', '']) {
      const r = fail(`kolor ${bad}`);
      expect(r.error!.line).toBe(1);
    }
    expect(fail('kolor "#12"').error!.column).toBe(7);
  });
});

describe('wyrażenia', () => {
  test('priorytety i łączność', () => {
    expect(ok('np 20 - 5 - 3')[0].to[1]).toBe(12);
    expect(ok('np 2 + 3 * 4')[0].to[1]).toBe(14);
    expect(ok('np 100 / 5 / 2')[0].to[1]).toBe(10);
    expect(ok('np (2 + 3) * 4')[0].to[1]).toBe(20);
  });
  test('reguła odstępów wokół operatora', () => {
    expect(ok('np 10 - 5')[0].to[1]).toBe(5);
    expect(ok('np 10-5')[0].to[1]).toBe(5);
    expect(ok('np 2*3')[0].to[1]).toBe(6);
    const r = fail('np 10 -5');
    expect(r.error).toMatchObject({ line: 1, column: 7 });
    expect(r.segments).toEqual([]);
    expect(fail('np 10- 5').error).toMatchObject({ line: 1, column: 6 });
    expect(fail('np 10 *2').error).toMatchObject({ line: 1, column: 7 });
    expect(fail('np 10 /2').error).toMatchObject({ line: 1, column: 7 });
    expect(fail('np 10 +2').error).toMatchObject({ line: 1, column: 7 });
  });
  test('znaki jednoargumentowe', () => {
    expect(ok('np -(3 - 5)')[0].to[1]).toBe(2);
    expect(ok('np - -2')[0].to[1]).toBe(2);
    expect(ok('np +5')[0].to[1]).toBe(5);
    expect(ok('niech bok 4 np -bok')[0].to[1]).toBe(-4);
    expect(ok('np 3 * -2')[0].to[1]).toBe(-6);
    expect(ok('np 3 - -2')[0].to[1]).toBe(5);
    expect(ok('np ---2')[0].to[1]).toBe(-2);
  });
  test('dzielenie przez zero i brak skończonego wyniku', () => {
    const r = fail('np 10 np 5 / 0');
    expect(r.error).toMatchObject({ line: 1, column: 10 });
    expect(r.segments.length).toBe(1);
    const big = fail('niech x 99999999999 niech x x * x niech x x * x niech x x * x niech x x * x niech x x * x np 1');
    expect(big.error!.message).toContain('skończon');
  });
  test('porównania są dokładne', () => {
    expect(ok('jeśli 0.1 + 0.2 = 0.3 [np 5]').length).toBe(0);
    expect(ok('jeśli 0.1 + 0.2 <> 0.3 [np 5]').length).toBe(1);
    expect(ok('jeśli 3 <= 3 [np 5]').length).toBe(1);
    expect(ok('jeśli 3 >= 4 [np 5]').length).toBe(0);
    expect(ok('jeśli 3<4 [np 5]').length).toBe(1);
  });
  test('stara forma :nazwa', () => {
    expect(ok('niech x 7 np :x')[0].to[1]).toBe(7);
  });
});

describe('geometria', () => {
  test('stan początkowy i skręty', () => {
    const s = ok('np 10 pw 90 np 10 pw 90 np 10 pw 90 np 10');
    close(s[0].from, [0, 0, 0]);
    close(s[3].to, [0, 0, 0]);
    expect(s[0].color).toBe('#16866a');
    expect(s[0].width).toBe(3);
  });
  test('lewo i wstecz', () => {
    const s = ok('lw 90 np 10');
    close(s[0].to, [-10, 0, 0]);
    const t = ok('pw 90 ws 10');
    close(t[0].to, [-10, 0, 0]);
  });
  test('zero nie rysuje, pióro w górze nie rysuje', () => {
    expect(ok('np 0 pod np 5 opu np 5').length).toBe(1);
  });
  test('kolejność i parametry odcinków', () => {
    const s = ok('kolor "#c1763d" grubosc 5 np 10 kolor "#2b6fb3" grubosc 1 np 10');
    expect(s[0]).toEqual({ from: [0, 0, 0], to: [0, 10, 0], color: '#c1763d', width: 5 });
    expect(s[1]).toEqual({ from: [0, 10, 0], to: [0, 20, 0], color: '#2b6fb3', width: 1 });
  });
  test('gora / dol (3D)', () => {
    close(ok('gora 90 np 10', '3d')[0].to, [0, 0, 10]);
    close(ok('dol 90 np 10', '3d')[0].to, [0, 0, -10]);
    // po gora 90 „prawo” nadal wzdłuż X, a góra żółwia to dawny tył (−Y)
    const s = ok('gora 90 pw 90 np 10', '3d');
    close(s[0].to, [10, 0, 0]);
  });
  test('pp / pl (3D)', () => {
    // po pp 90 góra żółwia to dawna prawa strona (+X), prawa to dawny dół (−Z)
    close(ok('pp 90 gora 90 np 10', '3d')[0].to, [10, 0, 0]);
    close(ok('pp 90 pw 90 np 10', '3d')[0].to, [0, 0, -10]);
    close(ok('pl 90 gora 90 np 10', '3d')[0].to, [-10, 0, 0]);
    // przechył nie zmienia kierunku
    close(ok('pp 33 np 10', '3d')[0].to, [0, 10, 0]);
  });
  test('polecenia przestrzenne w 2D to błąd składni', () => {
    for (const c of ['gora', 'dol', 'pp', 'pl', 'pitchup', 'rollright']) {
      const r = fail(`np 10\n  ${c} 30`);
      expect(r.segments).toEqual([]);
      expect(r.error).toMatchObject({ line: 2, column: 3 });
    }
  });
  test('programy płaskie dają te same współrzędne w 2D i 3D', () => {
    const src = 'powtorz 7 [np 13 pw 47 pod np 3 opu lw 12.5 np 2]';
    expect(runProgram(src, '2d').segments).toEqual(runProgram(src, '3d').segments);
  });
  test('dom', () => {
    const s = ok('np 10 pw 90 np 10 dom np 5');
    expect(s.length).toBe(4);
    close(s[2].from, [10, 10, 0]);
    close(s[2].to, [0, 0, 0]);
    close(s[3].to, [0, 5, 0]);
    // nie rysuje, gdy żółw już jest w początku; nie zmienia koloru ani pióra
    expect(ok('dom').length).toBe(0);
    const t = ok('kolor "#c1763d" pod np 10 dom opu np 1');
    expect(t.length).toBe(1);
    expect(t[0].color).toBe('#c1763d');
    // przywraca także orientację przestrzenną
    close(ok('gora 40 pp 20 dom np 4', '3d')[0].to, [0, 4, 0]);
  });
  test('czyść', () => {
    const s = ok('np 10 np 10 czyść np 5');
    expect(s.length).toBe(1);
    close(s[0].from, [0, 20, 0]);
    // limit odcinków liczy odcinki aktualnie zachowane
    const big = ok('powtorz 3000 [np 1 czyść]'.replace('3000', '2000'));
    expect(big.length).toBe(0);
  });
});

describe('powtorz i nrpowt', () => {
  test('powtarza i numeruje', () => {
    const s = ok('powtorz 3 [np nrpowt]');
    expect(s.map((x) => x.to[1] - x.from[1])).toEqual([1, 2, 3]);
  });
  test('zagnieżdżone: najbliższe powtórz', () => {
    const s = ok('powtorz 2 [powtorz 3 [np nrpowt] pw 90]');
    expect(s.length).toBe(6);
  });
  test('zero powtórzeń', () => {
    expect(ok('powtorz 0 [np 5]').length).toBe(0);
  });
  test('poprawność liczby powtórzeń', () => {
    expect(fail('powtorz 10001 [np 1]').error).toMatchObject({ line: 1, column: 9 });
    expect(fail('powtorz 2.5 [np 1]').error).toMatchObject({ line: 1, column: 9 });
    expect(fail('powtorz -1 [np 1]').error).toMatchObject({ line: 1, column: 9 });
    expect(fail('np 1 powtorz 10 / 4 [np 1]').segments).toEqual([]);
  });
  test('liczba powtórzeń z nazwy sprawdzana w czasie działania', () => {
    const r = fail('niech n 2.5 np 3 powtorz n [np 1]');
    expect(r.segments.length).toBe(1);
    expect(r.error).toMatchObject({ line: 1, column: 26 });
  });
  test('nrpowt poza powtórz to błąd składni', () => {
    expect(fail('np nrpowt').error).toMatchObject({ line: 1, column: 4 });
    const r = fail('oto f\n  np nrpowt\njuż\npowtorz 3 [f]');
    expect(r.error).toMatchObject({ line: 2, column: 6 });
    expect(r.segments).toEqual([]);
    expect(ok('oto f\n  powtorz 2 [np nrpowt]\njuż\nf').length).toBe(2);
    expect(ok('powtorz 2 [jeśli nrpowt = 2 [np 7]]').length).toBe(1);
  });
});

describe('zmienne', () => {
  test('niech i zmiana wartości', () => {
    const s = ok('niech x 5 np x niech x x * 2 np x');
    expect(s.map((v) => v.to[1])).toEqual([5, 15]);
  });
  test('nazwa bez deklaracji to błąd składni', () => {
    const r = fail('np 5 np zmienna');
    expect(r.error).toMatchObject({ line: 1, column: 9 });
    expect(r.segments).toEqual([]);
  });
  test('deklaracja po użyciu jest dozwolona, ale odczyt przed przypisaniem to błąd czasu działania', () => {
    const r = fail('np 5 np 3 + x niech x 1');
    expect(r.segments.length).toBe(1);
    expect(r.error).toMatchObject({ line: 1, column: 9 });
  });
  test('nazwy zastrzeżone i nazwy procedur', () => {
    expect(fail('niech np 5').error).toMatchObject({ line: 1, column: 7 });
    expect(fail('niech nrpowt 5').error).toMatchObject({ line: 1, column: 7 });
    expect(fail('oto f\n np 1\njuż\nniech f 5').error).toMatchObject({ line: 4, column: 7 });
  });
  test('niech w procedurze jest lokalne i przesłania zmienną globalną', () => {
    const s = ok(
      'niech x 10\noto f\n  np x\n  niech x 3\n  np x\njuż\nf np x',
    );
    expect(s.map((v) => v.to[1] - v.from[1])).toEqual([10, 3, 10]);
  });
  test('zmienna lokalna znika po wywołaniu, a globalna jest czytana', () => {
    const r = fail('oto f\n niech y 2\njuż\nf np y');
    // y jest przypisana tylko w procedurze – na najwyższym poziomie nie jest zadeklarowana
    expect(r.error).toMatchObject({ line: 4, column: 6 });
  });
  test('parametr można przypisać na nowo', () => {
    const s = ok('oto f ma: a\n niech a a + 1\n np a\njuż\nf 4');
    expect(s[0].to[1]).toBe(5);
  });
  test('wartość niedostępna w wywołaniu rekurencyjnym nie przecieka', () => {
    const s = ok('oto f ma: n\n jeśli n = 0 [stop]\n niech k n\n f n - 1\n np k\njuż\nf 3');
    expect(s.map((v) => v.to[1] - v.from[1])).toEqual([1, 2, 3]);
  });
});

describe('warunki', () => {
  test('jeśli i jeżeli', () => {
    expect(ok('jeśli 1 < 2 [np 1]').length).toBe(1);
    expect(ok('jesli 1 > 2 [np 1]').length).toBe(0);
    expect(ok('jeżeli 1 > 2 [np 1] [np 2]')[0].to[1]).toBe(2);
    expect(ok('jezeli 1 < 2 [np 1] [np 2]')[0].to[1]).toBe(1);
    expect(ok('if 1 < 2 [fd 1]').length).toBe(1);
    expect(ok('ifelse 1 > 2 [fd 1] [fd 2]')[0].to[1]).toBe(2);
  });
  test('brak drugiego bloku', () => {
    expect(fail('jeżeli 1 < 2 [np 1]\nnp 3').error).not.toBeNull();
  });
  test('stop w bloku kończy program / procedurę', () => {
    expect(ok('np 1 jeśli 1 < 2 [stop] np 2').length).toBe(1);
    expect(ok('powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]').length).toBe(2);
    const s = ok('oto f\n powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\n np 100\njuż\nf f np 7');
    expect(s.length).toBe(5);
  });
});

describe('procedury', () => {
  test('definicja i wywołanie', () => {
    const s = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90');
    expect(s.length).toBe(4);
    close(s[3].to, [0, 0, 0]);
  });
  test('stara forma nagłówka i :parametr', () => {
    const s = ok('to kw :bok :kąt\n  powtorz 4 [np :bok pw :kąt]\nend\nkw 10 90');
    expect(s.length).toBe(4);
    const t = ok('oto kw :bok\n np bok\nend\nkw 10');
    expect(t.length).toBe(1);
  });
  test('definicja po wywołaniu', () => {
    expect(ok('f 5\noto f ma: a\n np a\njuż').length).toBe(1);
  });
  test('argumenty to wyrażenia', () => {
    const s = ok('oto f ma: a, b\n np a pw b\njuż\nf 40 * 2 90');
    expect(s[0].to[1]).toBe(80);
    const t = ok('oto f ma: a, b\n np a np b\njuż\nf 10 -5');
    expect(t.map((x) => x.to[1] - x.from[1])).toEqual([10, -5]);
  });
  test('parametr o nazwie procedury', () => {
    const s = ok('oto f ma: g\n np g\njuż\noto g\n np 100\njuż\nf 5 g');
    expect(s.map((x) => x.to[1] - x.from[1])).toEqual([5, 100]);
  });
  test('zła liczba argumentów', () => {
    expect(fail('oto f ma: a, b\n np a\njuż\nf 1').error).toMatchObject({ line: 4 });
    const r = fail('oto f ma: a\n np a\njuż\nf 1 2');
    expect(r.error).toMatchObject({ line: 4, column: 5 });
    const q = fail('oto f ma: a\n np a\njuż\nf\nnp 2');
    expect(q.error).toMatchObject({ line: 5, column: 1 });
    const w = fail('oto f ma: a\n np a\njuż\nf');
    expect(w.error).toMatchObject({ line: 4, column: 1 });
  });
  test('błędy definicji', () => {
    expect(fail('oto f\n np 1').error).toMatchObject({ line: 1, column: 1 });
    expect(fail('powtorz 2 [\noto f\nnp 1\njuż\n]').error).toMatchObject({ line: 2, column: 1 });
    expect(fail('oto f\n oto g\n np 1\niż').error).toMatchObject({ line: 2 });
    expect(fail('oto f\n np 1\njuż\noto f\n np 2\njuż').error).toMatchObject({ line: 4, column: 5 });
    expect(fail('oto np\n np 1\njuż').error).toMatchObject({ line: 1, column: 5 });
    expect(fail('oto f ma: a, a\n np a\njuż').error).toMatchObject({ line: 1, column: 14 });
    expect(fail('np 1 już').error).toMatchObject({ line: 1, column: 6 });
    expect(fail('oto f\n np 1 już').error).toMatchObject({ line: 2, column: 7 });
    expect(fail('np 1 oto f\n np 1\njuż').error).toMatchObject({ line: 1, column: 6 });
  });
  test('rekurencja i stop', () => {
    const s = ok('oto f ma: n\n jeśli n = 0 [stop]\n np n\n f n - 1\njuż\nf 3');
    expect(s.map((x) => x.to[1] - x.from[1])).toEqual([3, 2, 1]);
  });
  test('nieznane polecenie wskazuje token', () => {
    expect(fail('np 1\n  xyz 5').error).toMatchObject({ line: 2, column: 3 });
  });
  test('procedura wołana z powtórz ma własne nrpowt', () => {
    const s = ok('oto f\n powtorz 2 [np nrpowt]\njuż\npowtorz 3 [f]');
    expect(s.length).toBe(6);
  });
});

describe('błędy składni – pozycje', () => {
  test('brak argumentu', () => {
    expect(fail('np').error).toMatchObject({ line: 1, column: 1 });
    expect(fail('np ]').error).toMatchObject({ line: 1, column: 4 });
    expect(fail('np (3 +').error).toMatchObject({ line: 1 });
    expect(fail('powtorz 3').error).toMatchObject({ line: 1, column: 1 });
    expect(fail('np\npw 3').error).toMatchObject({ line: 2, column: 1 });
  });
  test('nawiasy', () => {
    expect(fail('powtorz 2 [np 1').error).toMatchObject({ line: 1, column: 11 });
    expect(fail('np 1 ]').error).toMatchObject({ line: 1, column: 6 });
    expect(fail('np (1 + 2').error).toMatchObject({ line: 1, column: 4 });
    expect(fail('np 1 )').error).toMatchObject({ line: 1, column: 6 });
    expect(fail('np ((1)').error).toMatchObject({ line: 1, column: 4 });
  });
  test('zbłąkana wartość', () => {
    expect(fail('np 10 20').error).toMatchObject({ line: 1, column: 7 });
    expect(fail('pod 5').error).toMatchObject({ line: 1, column: 5 });
  });
  test('grubość', () => {
    for (const w of ['0', '13', '2.5', '-1', '3 * 5']) {
      const r = fail(`np 5 grubosc ${w}`);
      expect(r.segments).toEqual([]);
      expect(r.error).toMatchObject({ line: 1, column: 14 });
    }
    expect(ok('grubosc 12 np 1')[0].width).toBe(12);
    const r = fail('np 5 niech w 20 grubosc w np 5');
    expect(r.segments.length).toBe(1);
    expect(r.error).toMatchObject({ line: 1, column: 25 });
  });
  test('błąd składni nic nie rysuje', () => {
    const r = fail('np 100 pw 90 np 100 xyz');
    expect(r.segments).toEqual([]);
  });
  test('wskazanie argumentu w błędzie czasu działania', () => {
    const r = fail('niech a 0 np 50 np 10 + 5 / a');
    expect(r.error).toMatchObject({ line: 1, column: 20 });
    expect(r.segments.length).toBe(1);
    const c = fail('niech a 0 jeśli 1 < 2 / a [np 1]');
    expect(c.error).toMatchObject({ line: 1, column: 21 });
  });
  test('znaki spoza języka', () => {
    expect(fail('np 5 @').error).toMatchObject({ line: 1, column: 6 });
    expect(fail('np 5 "abc').error).toMatchObject({ line: 1, column: 6 });
    expect(fail('np 5 {').error).toMatchObject({ line: 1, column: 6 });
  });
  test('CRLF', () => {
    expect(fail('np 1\r\n  xyz').error).toMatchObject({ line: 2, column: 3 });
  });
});

describe('limity', () => {
  test('liczba znaków', () => {
    const src = '; ' + 'x'.repeat(50_000);
    expect(fail(src).error).not.toBeNull();
    expect(ok('; ' + 'x'.repeat(49_990)).length).toBe(0);
  });
  test('liczba tokenów', () => {
    expect(ok('np 1 '.repeat(2500) + 'czyść').length).toBe(0);
    expect(ok('pod '.repeat(5000)).length).toBe(0);
    const over = fail('pod '.repeat(10_001));
    expect(over.error!.message).toContain('token');
    expect(over.segments).toEqual([]);
  });
  test('zagnieżdżenie nawiasów', () => {
    const nest = (n: number) => 'powtorz 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    // 32 poziomy nawiasów, ale też 32 ramki powtórz – dokładnie na granicy
    expect(ok(nest(32)).length).toBe(1);
    const r = fail(nest(33));
    expect(r.segments).toEqual([]);
    expect(r.error!.column).toBe(33 * 11);
    const ifs = (n: number) => 'jeśli 1 < 2 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    expect(ok(ifs(32)).length).toBe(1);
    expect(fail(ifs(33)).error).not.toBeNull();
  });
  test('ramki: powtórz i wywołania', () => {
    const r = fail('oto f\n f\njuż\nf');
    expect(r.error).toMatchObject({ line: 2 });
    // 32 aktywne ramki są dozwolone
    const nest = 'powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32);
    expect(ok(nest).length).toBe(1);
    const rec = ok('oto f ma: n\n jeśli n = 0 [stop]\n f n - 1\njuż\nf 31');
    expect(rec.length).toBe(0);
    const tooDeep = fail('oto f ma: n\n jeśli n = 0 [stop]\n f n - 1\njuż\nf 32');
    expect(tooDeep.error!.message).toContain('32');
    // warunki nie liczą się jako ramki
    const cond = 'jeśli 1 < 2 ['.repeat(32) + 'np 1' + ']'.repeat(32);
    expect(ok(cond).length).toBe(1);
  });
  test('operacje: granica dokładna', () => {
    // 1 (powtórz) + 4999·(np + koniec iteracji) = 9999
    expect(ok('powtorz 4999 [np 1]').length).toBe(4999);
    // piąty tysiąc: np to operacja 10000, koniec iteracji – 10001
    const r = fail('powtorz 5000 [np 1]');
    expect(r.segments.length).toBe(5000);
    expect(r.error).toMatchObject({ line: 1, column: 1 });
    // samo wyrażenie nie jest operacją
    expect(ok('np 1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12').length).toBe(1);
  });
  test('odcinki: limit 10000 zachowanych', () => {
    const r = fail('powtorz 4000 [np 1 czyść] powtorz 4000 [np 1 czyść] powtorz 400 [np 1]');
    expect(r.error!.message).toContain('operacji');
    // czyść pozwala rysować dalej
    const s = ok('powtorz 2000 [np 1] czyść powtorz 2000 [np 1]');
    expect(s.length).toBe(2000);
    // segmentów 10000, ale ograniczają operacje; sprawdzamy limit odcinków osobno
    const lines = Array.from({ length: 3 }, () => 'powtorz 2400 [np 1 pw 1]').join('\n');
    const big = fail(lines);
    expect(big.error).not.toBeNull();
  });
  test('współrzędne w granicach ±100000', () => {
    expect(ok('np 100000').length).toBe(1);
    const r = fail('np 99999 np 2');
    expect(r.segments.length).toBe(1);
    expect(r.error).toMatchObject({ line: 1, column: 10 });
    expect(fail('pod np 100001').error).not.toBeNull();
    expect(fail('np 100000 pw 90 np 100000 pw 90 np 200001').error).not.toBeNull();
  });
});

describe('standardowe programy', () => {
  test('Kwadrat zamyka się', () => {
    const s = ok('powtorz 4 [np 120 pw 90]');
    close(s[3].to, [0, 0, 0]);
  });
  test('Kula – kierunek po pełnych okręgach', () => {
    const s = ok('powtorz 36 [np 10 gora 10]', '3d');
    close(s[35].to, [0, 0, 0], 1e-9);
  });
});

describe('kolejność błędów i skrajne wartości', () => {
  test('wcześniejsza nieznana nazwa wygrywa z późniejszym błędem składni', () => {
    expect(fail('np foo\nnp 3x').error).toMatchObject({ line: 1, column: 4 });
    expect(fail('np foo\nxyz 5').error).toMatchObject({ line: 1, column: 4 });
    // nazwa, która zostanie zadeklarowana później, nie jest błędem
    expect(fail('np foo\nniech foo 5 xyz').error).toMatchObject({ line: 2, column: 13 });
    // wcześniejszy błąd składni wygrywa z późniejszą nazwą
    expect(fail('xyz\nnp foo').error).toMatchObject({ line: 1, column: 1 });
  });
  test('ogromne literały i kąty', () => {
    const huge = '9'.repeat(400);
    const r = fail(`pw ${huge}\nnp 10`);
    expect(r.error).toMatchObject({ line: 1, column: 4 });
    expect(fail(`np ${huge}`).error).toMatchObject({ line: 1, column: 4 });
    expect(fail(`niech x ${huge}\nnp x`).error).toMatchObject({ line: 1, column: 9 });
    const big = ok('pw 1e30'.replace('1e30', '1' + '0'.repeat(30)) + '\nnp 10');
    expect(big.length).toBe(1);
    for (const c of big[0].to) expect(Number.isFinite(c)).toBe(true);
  });
});
