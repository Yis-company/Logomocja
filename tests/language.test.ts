import { describe, expect, test } from 'bun:test';
import { path, run2, run3 } from './helpers';
import { runSource } from '../src/lang';

describe('leksyka', () => {
  test('słowa kluczowe ignorują wielkość liter, także polskie litery', () => {
    expect(path(run2('NP 10'))).toEqual([[0, 0, 0], [0, 10, 0]]);
    expect(path(run2('Naprzód 10 PW 90 NaPrZoD 5'))).toEqual([[0, 0, 0], [0, 10, 0], [5, 10, 0]]);
    expect(run2('POWTÓRZ 2 [NP 1]').error).toBeNull();
    expect(run2('JEŚLI 1 < 2 [np 1]').segments.length).toBe(1);
    expect(run2('JEŻELI 1 > 2 [np 1] [np 2]').segments[0]!.to).toEqual([0, 2, 0]);
  });

  test('wszystkie aliasy polskie i angielskie są równoważne', () => {
    const groups: string[][] = [
      ['np 10', 'naprzod 10', 'naprzód 10', 'fd 10', 'forward 10'],
      ['np 10 ws 3', 'np 10 wstecz 3', 'np 10 bk 3', 'np 10 back 3'],
      ['np 5 pw 90 np 5', 'np 5 prawo 90 np 5', 'np 5 rt 90 np 5', 'np 5 right 90 np 5'],
      ['np 5 lw 90 np 5', 'np 5 lewo 90 np 5', 'np 5 lt 90 np 5', 'np 5 left 90 np 5'],
      ['np 5 pod np 5', 'np 5 podnies np 5', 'np 5 podnieś np 5', 'np 5 pu np 5', 'np 5 penup np 5'],
      ['pod np 5 opu np 5', 'pod np 5 opusc np 5', 'pod np 5 opuść np 5', 'pod np 5 pd np 5', 'pod np 5 pendown np 5'],
      ['kolor "#112233" np 5', 'color "#112233" np 5'],
      ['grubosc 5 np 5', 'grubość 5 np 5', 'width 5 np 5'],
      ['powtorz 2 [np 1]', 'powtórz 2 [np 1]', 'repeat 2 [np 1]'],
      ['niech x 3 np x', 'let x 3 np x'],
      ['jesli 1 < 2 [np 1]', 'jeśli 1 < 2 [np 1]', 'if 1 < 2 [np 1]'],
      ['jezeli 1 < 2 [np 1] [np 2]', 'jeżeli 1 < 2 [np 1] [np 2]', 'ifelse 1 < 2 [np 1] [np 2]'],
      ['np 3 stop np 5', 'np 3 STOP np 5'],
      ['np 3 pw 90 np 3 dom', 'np 3 pw 90 np 3 home'],
      ['np 3 czyść np 2', 'np 3 czysc np 2', 'np 3 cs np 2', 'np 3 clearscreen np 2'],
    ];
    for (const g of groups) {
      const ref = JSON.stringify(run2(g[0]!));
      expect(JSON.parse(ref).error).toBeNull();
      for (const s of g) expect(JSON.stringify(run2(s))).toBe(ref);
    }
    const groups3: string[][] = [
      ['gora 30 np 5', 'góra 30 np 5', 'pitchup 30 np 5'],
      ['dol 30 np 5', 'dół 30 np 5', 'pitchdown 30 np 5'],
      ['pp 30 gora 30 np 5', 'przechylprawo 30 gora 30 np 5', 'rr 30 gora 30 np 5', 'rollright 30 gora 30 np 5'],
      ['pl 30 gora 30 np 5', 'przechyllewo 30 gora 30 np 5', 'rl 30 gora 30 np 5', 'rollleft 30 gora 30 np 5'],
    ];
    for (const g of groups3) {
      const ref = JSON.stringify(run3(g[0]!));
      expect(JSON.parse(ref).error).toBeNull();
      for (const s of g) expect(JSON.stringify(run3(s))).toBe(ref);
    }
  });

  test('komentarze, białe znaki i końce wierszy', () => {
    expect(path(run2('; tylko komentarz\nnp 10 ; reszta\n\n\tpw 90\r\nnp 5'))).toEqual([[0, 0, 0], [0, 10, 0], [5, 10, 0]]);
    expect(run2('').segments).toEqual([]);
    expect(run2('; nic').error).toBeNull();
  });

  test('liczby: 80, 12.5, .5; inne zapisy są błędami', () => {
    expect(run2('np 12.5').segments[0]!.to[1]).toBe(12.5);
    expect(run2('np .5').segments[0]!.to[1]).toBe(0.5);
    for (const bad of ['np 1e3', 'np 0x10', 'np NaN', 'np Infinity', 'np 5.', 'np 1.2.3', 'np 10pw', 'np 1_000']) {
      const r = run2(bad);
      expect(r.error).not.toBeNull();
      expect(r.error!.line).toBe(1);
      expect(r.error!.column).toBe(4);
      expect(r.segments).toEqual([]);
    }
  });

  test('znak jest operatorem, a nie częścią liczby', () => {
    expect(run2('np -5').segments[0]!.to).toEqual([0, -5, 0]);
    expect(run2('np +5').segments[0]!.to).toEqual([0, 5, 0]);
  });

  test('kolory: wielkość cyfr szesnastkowych nie ma znaczenia, wynik jest małymi literami', () => {
    const r = run2('kolor "#AbCdEf" np 1');
    expect(r.segments[0]!.color).toBe('#abcdef');
    expect(run2('np 1').segments[0]!.color).toBe('#16866a');
    expect(run2('np 1').segments[0]!.width).toBe(3);
  });

  test('nazwy ze znakami diakrytycznymi i dawny zapis :nazwa', () => {
    expect(path(run2('niech ŁÓDŹ 7 np :łódź niech Żółw 2 np żółW'))).toEqual([[0, 0, 0], [0, 7, 0], [0, 9, 0]]);
  });
});

describe('wyrażenia', () => {
  const len = (src: string) => run2(src).segments[0]!.to[1];

  test('priorytety i łączność lewostronna', () => {
    expect(len('np 20 - 5 - 3')).toBe(12);
    expect(len('np 2 + 3 * 4')).toBe(14);
    expect(len('np 100 / 10 / 5')).toBe(2);
    expect(len('np (2 + 3) * 4')).toBe(20);
    expect(len('np 2 * 3 + 4 * 5')).toBe(26);
    expect(len('np 10 - 2 * 3')).toBe(4);
  });

  test('odstępy wokół operatora: po obu stronach albo po żadnej', () => {
    expect(len('np 10 - 5')).toBe(5);
    expect(len('np 10-5')).toBe(5);
    expect(len('np 3*4')).toBe(12);
    expect(len('np 3 * 4')).toBe(12);
    expect(len('np 12/4')).toBe(3);
    expect(len('np 1+2')).toBe(3);
    for (const bad of ['np 10 -5', 'np 10- 5', 'np 3 *4', 'np 3* 4', 'np 3 /4', 'np 3 +4']) {
      const r = run2(bad);
      expect(r.error).not.toBeNull();
      expect(r.segments).toEqual([]);
      expect(r.error!.line).toBe(1);
    }
    // błąd wskazuje operator, który ma odstęp tylko z jednej strony
    expect(run2('np 10 -5').error!.column).toBe(7);
    expect(run2('np 10- 5').error!.column).toBe(6);
  });

  test('odstęp może być nową linią', () => {
    expect(len('np 10\n- 5')).toBe(5);
    expect(run2('np 10\n-5').error!.line).toBe(2);
  });

  test('operatory unarne można układać w stosy i stosować wszędzie', () => {
    expect(len('np -(3 - 5)')).toBe(2);
    expect(len('np - -2')).toBe(2);
    expect(len('np --2')).toBe(2);
    expect(len('np +-+2')).toBe(-2);
    expect(len('np 3 * -2')).toBe(-6);
    expect(len('np 3*-2')).toBe(-6);
    expect(len('np 10 - -5')).toBe(15);
    expect(len('niech bok 4 np -bok')).toBe(-4);
    expect(len('niech bok 4 np - - bok')).toBe(4);
    expect(len('np -2 * 3')).toBe(-6);
  });

  test('argumenty procedur: kolejna wartość może zaczynać się od znaku', () => {
    const r = run2('oto f ma: a, b\n np a\n pw 90\n np b\njuż\nf 10 -5');
    expect(r.error).toBeNull();
    expect(path(r)).toEqual([[0, 0, 0], [0, 10, 0], [-5, 10, 0]]);
    expect(run2('oto f ma: a\n np a\njuż\nf 10 -5').error!.column).toBe(6);
    expect(path(run2('oto f ma: a, b\n np a\n pw 90\n np b\njuż\nf 40 * 2 90'))).toEqual([[0, 0, 0], [0, 80, 0], [90, 80, 0]]);
  });

  test('porównania są dokładne i nie mają reguły odstępów', () => {
    expect(run2('jeśli 0.1 + 0.2 = 0.3 [np 1]').segments.length).toBe(0);
    expect(run2('jeśli 0.1 + 0.2 <> 0.3 [np 1]').segments.length).toBe(1);
    expect(run2('jeśli 0.5 + 0.25 = 0.75 [np 1]').segments.length).toBe(1);
    for (const c of ['1<2', '1 <2', '1< 2', '1 < 2', '2>1', '1<=1', '1>=1', '1=1', '1<>2', '1 <>2', '-1<0', '-1<-0']) {
      expect(run2(`jeśli ${c} [np 1]`).segments.length).toBe(1);
    }
    for (const c of ['2<1', '1>2', '1<1', '1>1', '2<=1', '1>=2', '1=2', '1<>1']) {
      expect(run2(`jeśli ${c} [np 1]`).segments.length).toBe(0);
    }
  });

  test('dzielenie przez zero i wyniki nieskończone to błędy wykonania', () => {
    const a = run2('np 5 pw 90 np 1 / 0 np 7');
    expect(a.error!.message).toContain('zero');
    expect(a.segments.length).toBe(1);
    expect(a.error!.line).toBe(1);
    expect(a.error!.column).toBe(15); // pierwszy symbol argumentu
    const b = run2('niech x 0 np 3 / x');
    expect(b.error).not.toBeNull();
    expect(run2('niech x 1e0 powtorz 400 [niech x x * 1000000000] np x').error).not.toBeNull();
    const big = '9'.repeat(300);
    expect(run2(`np ${big} * ${big}`).error).not.toBeNull();
  });
});

describe('geometria', () => {
  test('stan początkowy i kierunki: +Y do przodu, +X w prawo', () => {
    expect(path(run2('np 10 pw 90 np 10 pw 90 np 10 pw 90 np 10'))).toEqual([[0, 0, 0], [0, 10, 0], [10, 10, 0], [10, 0, 0], [0, 0, 0]]);
    expect(path(run2('lw 90 np 10'))).toEqual([[0, 0, 0], [-10, 0, 0]]);
    expect(path(run2('ws 10'))).toEqual([[0, 0, 0], [0, -10, 0]]);
  });

  test('kąty dziesiętne i ujemne', () => {
    expect(path(run2('pw -90 np 10'))).toEqual([[0, 0, 0], [-10, 0, 0]]);
    const r = run2('pw 45 np 10');
    expect(r.segments[0]!.to[0]).toBeCloseTo(7.0710678, 5);
    expect(r.segments[0]!.to[1]).toBeCloseTo(7.0710678, 5);
    expect(path(run2('pw 450 np 10'))).toEqual([[0, 0, 0], [10, 0, 0]]);
  });

  test('ruch o zero niczego nie rysuje; pióro w górze też nie', () => {
    expect(run2('np 0').segments).toEqual([]);
    expect(run2('pod np 10 opu np 10').segments.length).toBe(1);
    expect(run2('pod np 10 opu np 10').segments[0]!.from).toEqual([0, 10, 0]);
  });

  test('kolor i grubość utrzymują się do zmiany', () => {
    const r = run2('kolor "#ff0000" grubosc 7 np 1 pw 90 np 1 kolor "#00ff00" np 1 grubosc 2 np 1');
    expect(r.segments.map((s) => [s.color, s.width])).toEqual([
      ['#ff0000', 7], ['#ff0000', 7], ['#00ff00', 7], ['#00ff00', 2],
    ]);
  });

  test('dom: wraca do początku (rysując), przywraca orientację, zostawia pióro, kolor i grubość', () => {
    const r = run2('kolor "#123456" grubosc 5 np 10 pw 90 np 10 dom np 5');
    expect(r.segments.length).toBe(4);
    expect(r.segments[2]!.from).toEqual([10, 10, 0]);
    expect(r.segments[2]!.to).toEqual([0, 0, 0]);
    expect(r.segments[2]!.color).toBe('#123456');
    expect(r.segments[2]!.width).toBe(5);
    expect(r.segments[3]!.to).toEqual([0, 5, 0]);
    // już w początku — nic nie rysuje
    expect(run2('dom dom').segments).toEqual([]);
    // pióro w górze — nic nie rysuje
    expect(run2('np 5 pod dom opu np 3').segments.map((s) => s.to)).toEqual([[0, 5, 0], [0, 3, 0]]);
  });

  test('czyść usuwa odcinki i niczego innego nie zmienia', () => {
    const r = run2('kolor "#112233" np 10 pw 90 czyść np 5');
    expect(r.segments.length).toBe(1);
    expect(r.segments[0]!.from).toEqual([0, 10, 0]);
    expect(r.segments[0]!.to).toEqual([5, 10, 0]);
    expect(r.segments[0]!.color).toBe('#112233');
  });

  test('polecenia 3D: góra, dół, przechył', () => {
    expect(path(run3('gora 90 np 10'))).toEqual([[0, 0, 0], [0, 0, 10]]);
    expect(path(run3('dol 90 np 10'))).toEqual([[0, 0, 0], [0, 0, -10]]);
    // po gora 90 nos wskazuje dawną górę, a góra żółwia wskazuje dawny tył (-Y)
    expect(path(run3('gora 90 gora 90 np 10'))).toEqual([[0, 0, 0], [0, -10, 0]]);
    // przechył nie zmienia kierunku, ale obraca żółwia wokół niego
    expect(path(run3('pp 90 np 10'))).toEqual([[0, 0, 0], [0, 10, 0]]);
    // po pp 90 góra żółwia to dawna prawa strona (+X), a prawa to dawny dół (-Z)
    expect(path(run3('pp 90 gora 90 np 10'))).toEqual([[0, 0, 0], [10, 0, 0]]);
    expect(path(run3('pp 90 pw 90 np 10'))).toEqual([[0, 0, 0], [0, 0, -10]]);
    expect(path(run3('pl 90 gora 90 np 10'))).toEqual([[0, 0, 0], [-10, 0, 0]]);
    expect(path(run3('pl 90 pw 90 np 10'))).toEqual([[0, 0, 0], [0, 0, 10]]);
  });

  test('dom w 3D przywraca wszystkie wektory', () => {
    expect(path(run3('gora 40 pp 20 pw 33 np 10 dom np 4'))).toEqual(
      path(run3('gora 40 pp 20 pw 33 np 10 dom np 4')),
    );
    const r = run3('gora 90 np 10 dom np 4');
    expect(r.segments[2]!.to).toEqual([0, 4, 0]);
  });

  test('polecenia płaskie dają te same współrzędne w 2D i w 3D', () => {
    const src = 'kolor "#aa00bb" powtorz 7 [np 13 pw 51.5 pod np 2 opu lw 12 ws 1]';
    expect(JSON.stringify(run2(src))).toBe(JSON.stringify(run3(src)));
  });

  test('w 2D polecenia gora, dol, pp, pl są błędami analizy', () => {
    for (const c of ['gora 10', 'góra 10', 'dol 10', 'dół 10', 'pp 10', 'pl 10', 'rr 10', 'rl 10', 'pitchup 5', 'pitchdown 5', 'rollright 5', 'rollleft 5']) {
      const r = run2(`np 10 ${c}`);
      expect(r.error).not.toBeNull();
      expect(r.error!.column).toBe(7);
      expect(r.segments).toEqual([]); // błąd analizy: nic nie narysowano
    }
  });
});

describe('powtarzanie i nrpowt', () => {
  test('powtorz n [...] wykonuje ciało n razy; 0 nie robi nic', () => {
    expect(run2('powtorz 5 [np 1]').segments.length).toBe(5);
    expect(run2('powtorz 0 [np 1]').segments.length).toBe(0);
    expect(run2('powtorz 0 [np 1] np 2').segments.length).toBe(1);
    expect(run2('powtorz 2 []').error).toBeNull();
  });

  test('liczba powtórzeń: całkowita 0–10000', () => {
    for (const n of ['-1', '2.5', '10001', '1 / 3']) {
      const r = run2(`np 5 powtorz ${n} [pod]`);
      expect(r.error).not.toBeNull();
      expect(r.segments).toEqual([]); // literał: błąd analizy
      expect(r.error!.column).toBe(14);
    }
    // 10000 powtórzeń samo w sobie jest dozwolone, ale licznik operacji (1 + po 1 na iterację) przekracza limit
    expect(run2('powtorz 9999 []').error).toBeNull();
    expect(run2('powtorz 10000 []').error!.message).toContain('limit');
    expect(run2('powtorz 6 / 2 [np 1]').segments.length).toBe(3);
  });

  test('liczba powtórzeń zależna od nazwy jest sprawdzana w czasie wykonania', () => {
    const r = run2('niech n 2.5 np 5 powtorz n [pod]');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBe(1);
    expect(r.error!.column).toBe(26);
    expect(run2('niech n 3 powtorz n [np 1]').segments.length).toBe(3);
  });

  test('nrpowt liczy od 1 w najbliższym powtórzeniu', () => {
    expect(run2('powtorz 3 [np nrpowt]').segments.map((s) => s.to[1] - s.from[1])).toEqual([1, 2, 3]);
    const r = run2('powtorz 2 [powtorz 3 [np nrpowt] ws 100 ws nrpowt]');
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([1, 2, 3, -100, -1, 1, 2, 3, -100, -2]);
    expect(run2('powtorz 3 [jeśli nrpowt = 2 [np 10]]').segments.length).toBe(1);
    expect(run2('powtorz 3 [np REPCOUNT]').segments.length).toBe(3);
  });

  test('nrpowt w liczbie powtórzeń odnosi się do zewnętrznego powtórzenia', () => {
    const r = run2('powtorz 3 [powtorz nrpowt [np 1]]');
    expect(r.segments.length).toBe(1 + 2 + 3);
  });

  test('nrpowt poza powtórzeniem to błąd analizy — także w procedurze wywoływanej z powtórzenia', () => {
    expect(run2('np 1 np nrpowt').error!.column).toBe(9);
    expect(run2('np 1 np nrpowt').segments).toEqual([]);
    const src = 'oto f\n  np nrpowt\njuż\npowtorz 3 [f]';
    const r = run2(src);
    expect(r.error).not.toBeNull();
    expect(r.error!.line).toBe(2);
    expect(r.error!.column).toBe(6);
    expect(run2('oto f\n  powtorz 2 [np nrpowt]\njuż\nf').segments.length).toBe(2);
    expect(run2('oto f ma: n\n  jeśli 1 < 2 [np nrpowt]\njuż\nf 3').error).not.toBeNull();
  });

  test('stop w powtórzeniu kończy procedurę albo program', () => {
    expect(run2('powtorz 5 [np 1 jeśli nrpowt = 3 [stop]]').segments.length).toBe(3);
    expect(run2('np 1 stop np 2').segments.length).toBe(1);
    const r = run2('oto f\n  powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\n  np 100\njuż\nf f np 7');
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([1, 1, 1, 1, 7]);
  });
});

describe('zmienne', () => {
  test('niech tworzy i zmienia zmienną globalną', () => {
    expect(run2('niech x 5 np x niech x x + 1 np x').segments.map((s) => s.to[1])).toEqual([5, 11]);
    expect(run2('np x niech x 5').error!.message).toContain('nie ma jeszcze wartości');
  });

  test('użycie przed przypisaniem w kodzie to błąd wykonania z pozycją argumentu', () => {
    const r = run2('np 3 np 2 + x niech x 5');
    expect(r.segments.length).toBe(1);
    expect(r.error!.column).toBe(9); // pierwszy symbol argumentu: "2"
  });

  test('nazwa nigdzie niezadeklarowana to błąd analizy', () => {
    const r = run2('np 3 np y');
    expect(r.error!.column).toBe(9);
    expect(r.segments).toEqual([]);
    // zmienna globalna zadeklarowana później jest widoczna w procedurze
    expect(run2('oto f\n np y\njuż\nniech y 3\nf').segments.length).toBe(1);
    expect(run2('oto f\n np y\njuż\nf').error!.line).toBe(2);
  });

  test('zmienne nie mogą nazywać się jak polecenia ani procedury', () => {
    expect(run2('niech np 5').error!.column).toBe(7);
    expect(run2('niech nrpowt 5').error!.column).toBe(7);
    expect(run2('niech to 5').error!.column).toBe(7);
    expect(run2('oto f\n np 1\njuż\nniech f 3').error!.column).toBe(7);
    expect(run2('niech F 3\noto f\n np 1\njuż').error).not.toBeNull();
  });

  test('niech w procedurze jest lokalne i przesłania globalną', () => {
    const src = [
      'niech x 10',
      'oto f',
      '  np x',
      '  niech x 3',
      '  np x',
      'już',
      'f',
      'np x',
    ].join('\n');
    const r = run2(src);
    expect(r.error).toBeNull();
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([10, 3, 10]);
  });

  test('zmienna lokalna nie jest widoczna w wywoływanej procedurze, parametry można nadpisać', () => {
    const src = [
      'oto g',
      '  np y',
      'już',
      'oto f ma: y',
      '  niech y y + 1',
      '  np y',
      '  g',
      'już',
      'niech y 100',
      'f 5',
    ].join('\n');
    const r = run2(src);
    expect(r.error).toBeNull();
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([6, 100]);
  });

  test('nazwa lokalna używana przed przypisaniem bez globalnej to błąd wykonania', () => {
    const r = run2('oto f\n  np x\n  niech x 3\njuż\nf');
    expect(r.error).not.toBeNull();
    expect(r.error!.line).toBe(2);
  });
});

describe('warunki', () => {
  test('jeśli / jeżeli', () => {
    expect(run2('jeśli 3 > 2 [np 1] np 2').segments.length).toBe(2);
    expect(run2('jeśli 3 < 2 [np 1] np 2').segments.length).toBe(1);
    expect(run2('jeżeli 3 > 2 [np 1] [np 5]').segments[0]!.to[1]).toBe(1);
    expect(run2('jeżeli 3 < 2 [np 1] [np 5]').segments[0]!.to[1]).toBe(5);
  });

  test('ciała mogą zawierać wszystko', () => {
    const r = run2('powtorz 3 [jeżeli nrpowt = 2 [powtorz 2 [np 1] jeśli 1 = 1 [pw 90]] [np 10]]');
    expect(r.error).toBeNull();
    expect(r.segments.length).toBe(4);
  });

  test('brak operatora porównania i brak drugiego bloku to błędy', () => {
    expect(run2('jeśli 3 [np 1]').error!.column).toBe(9);
    expect(run2('jeżeli 3 > 2 [np 1]').error).not.toBeNull();
    expect(run2('jeśli 1 < 2 < 3 [np 1]').error!.column).toBe(13);
  });
});

describe('procedury', () => {
  test('definicja, wywołanie, parametry i argumenty-wyrażenia', () => {
    const src = 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90';
    const r = run2(src);
    expect(path(r)).toEqual([[0, 0, 0], [0, 80, 0], [80, 80, 0], [80, 0, 0], [0, 0, 0]]);
    expect(run2('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 40 * 2 90').segments[0]!.to[1]).toBe(80);
  });

  test('zapis dawny nagłówka i odwołania :nazwa', () => {
    const r = run2('oto kwadrat :bok :kat\n  powtorz 4 [np :bok pw :kat]\nkoniec\njuż\nkwadrat 50 90');
    expect(r.error).not.toBeNull(); // "koniec" nie jest słowem kluczowym
    const ok = run2('oto kwadrat :bok :kat\n  powtorz 4 [np :bok pw kat]\njuż\nkwadrat 50 90');
    expect(ok.error).toBeNull();
    expect(ok.segments.length).toBe(4);
    expect(run2('TO kw :a\n np :A\nEND\nkw 5').segments.length).toBe(1);
    expect(run2('oto kw ma: a\n np A\nJUZ\nkw 5').segments.length).toBe(1);
    expect(run2('oto kw ma:a,b\n np a pw b\njuż\nkw 5 90').segments.length).toBe(1);
  });

  test('procedura bez parametrów; wywołanie przed definicją', () => {
    expect(run2('f f\noto f\n np 1\njuż').segments.length).toBe(2);
    expect(run2('oto F\n np 1\njuż\nf').segments.length).toBe(1);
  });

  test('parametr o nazwie procedury można przypisać od nowa, zmiennej o takiej nazwie utworzyć nie można', () => {
    const ok = run2('oto bok\n np 5\njuż\noto f ma: bok\n niech bok bok + 1\n np bok\n bok\njuż\nf 3');
    expect(ok.error).toBeNull();
    expect(ok.segments.map((s) => s.to[1] - s.from[1])).toEqual([4, 5]);
    expect(run2('oto bok\n np 5\njuż\noto f\n niech bok 1\njuż\nf').error!.line).toBe(5);
  });

  test('parametr może mieć nazwę procedury: w poleceniu to wywołanie, w argumencie parametr', () => {
    const src = 'oto bok\n np 5\njuż\noto f ma: bok\n bok\n np bok\njuż\nf 3';
    const r = run2(src);
    expect(r.error).toBeNull();
    expect(r.segments.map((s) => s.to[1] - s.from[1])).toEqual([5, 3]);
  });

  test('parametry mogą stać w miejscu licznika powtórzeń i argumentów innych procedur', () => {
    const src = 'oto b ma: x\n np x\njuż\noto f ma: n, d\n powtorz n [b d]\njuż\nf 3 4';
    expect(run2(src).segments.length).toBe(3);
  });

  test('rekurencja bezpośrednia i pośrednia; stop kończy wywołanie', () => {
    const src = 'oto a ma: n\n jeśli n < 1 [stop]\n np n\n a n - 1\njuż\na 4';
    expect(run2(src).segments.map((s) => s.to[1] - s.from[1])).toEqual([4, 3, 2, 1]);
    const mutual = 'oto a ma: n\n jeśli n < 1 [stop]\n np 1\n b n - 1\njuż\noto b ma: n\n np 2\n a n - 1\njuż\na 3';
    expect(run2(mutual).error).toBeNull();
    expect(run2(mutual).segments.length).toBe(4);
  });

  test('stop w procedurze nie kończy programu', () => {
    expect(run2('oto f\n stop\n np 99\njuż\nf np 1').segments.length).toBe(1);
  });

  test('definicja musi być na początku wiersza i tylko na najwyższym poziomie', () => {
    expect(run2('np 1 oto f\n np 1\njuż').error!.column).toBe(6);
    const inRepeat = run2('powtorz 2 [\n oto f\n np 1\n już\n]');
    expect(inRepeat.error!.line).toBe(2);
    expect(inRepeat.error!.column).toBe(2);
    const inProc = run2('oto a\n oto b\n np 1\n już\njuż');
    expect(inProc.error!.line).toBe(2);
    expect(run2('jeśli 1 < 2 [\noto f\n]').error!.line).toBe(2);
  });

  test('nazwa tylko raz; brak „już”; „już” musi stać samo', () => {
    expect(run2('oto f\n np 1\njuż\noto F\n np 2\njuż').error!.line).toBe(4);
    const missing = run2('np 1\noto f\n np 1\n');
    expect(missing.error!.line).toBe(2);
    expect(missing.error!.column).toBe(1);
    expect(missing.segments).toEqual([]);
    expect(run2('oto f\n np 1 już').error).not.toBeNull();
    expect(run2('oto f\n np 1\njuż np 1').error).not.toBeNull();
    expect(run2('już').error).not.toBeNull();
  });

  test('wywołanie z błędną liczbą argumentów', () => {
    const few = run2('oto f ma: a, b\n np a\njuż\nf 1\nnp 5');
    expect(few.error).not.toBeNull();
    expect(few.segments).toEqual([]);
    expect(few.error!.line).toBe(5);
    expect(run2('oto f ma: a, b\n np a\njuż\nf 1').error!.line).toBe(4); // koniec programu: przy poleceniu
    expect(run2('oto f ma: a, b\n np a\njuż\nf 1').error!.column).toBe(1);
    const many = run2('oto f ma: a\n np a\njuż\nf 1 2');
    expect(many.error!.line).toBe(4);
    expect(many.error!.column).toBe(5);
  });

  test('nagłówki: słowa zarezerwowane i powtórzone parametry', () => {
    expect(run2('oto np\n np 1\njuż').error!.column).toBe(5);
    expect(run2('oto f ma: a, a\n np 1\njuż').error!.column).toBe(14);
    expect(run2('oto f ma: np\n np 1\njuż').error!.column).toBe(11);
    expect(run2('oto\n np 1\njuż').error!.column).toBe(1);
    expect(run2('oto f ma:\n np 1\njuż').error).not.toBeNull();
    expect(run2('oto f ma: a,\n np 1\njuż').error).not.toBeNull();
  });
});

describe('błędy: pozycje i komunikaty', () => {
  const at = (src: string, line: number, col: number, mode: '2d' | '3d' = '2d') => {
    const r = runSource(src, mode);
    expect(r.error).not.toBeNull();
    expect({ line: r.error!.line, column: r.error!.column }).toEqual({ line, column: col });
    expect(r.error!.message.length).toBeGreaterThan(5);
    return r;
  };

  test('nieznane polecenie, zbłąkana wartość', () => {
    at('np 10\nfoo 5', 2, 1);
    at('np 10 5', 1, 7);
    at('pod 5', 1, 5);
    at('np 5 "#112233"', 1, 6);
    at('5', 1, 1);
    at('np 1\n  ]', 2, 3);
    at('np 1 )', 1, 6);
    at('np 1 [', 1, 6);
    at('np 1 ,', 1, 6);
  });

  test('brakujący argument: w miejscu, gdzie powinien się zaczynać; przy poleceniu, gdy program się kończy', () => {
    at('np', 1, 1);
    at('np\n', 1, 1);
    at('np pw 90', 1, 4);
    at('powtorz 3 [np ]', 1, 15);
    at('powtorz 3 [np (3 + )]', 1, 20);
    at('np 3 +', 1, 1);
    at('np (', 1, 1);
    at('kolor', 1, 1);
    at('kolor 5', 1, 7);
    at('niech x', 1, 1);
    at('niech 5 3', 1, 7);
    at('powtorz', 1, 1);
    at('powtorz 3', 1, 1);
    at('powtorz 3 np 1', 1, 11);
    at('jeśli', 1, 1);
  });

  test('nawiasy', () => {
    at('powtorz 3 [np 1', 1, 11);
    at('np (3 + 4', 1, 4);
    at('np (3 + 4 pw 90', 1, 4);
    at('np 3)', 1, 5);
    at('powtorz 2 [powtorz 2 [np 1]', 1, 11);
    at('np 1]', 1, 5);
    at('powtorz 2 [np 1]]', 1, 17);
  });

  test('kolor', () => {
    at('kolor "#12"', 1, 7);
    at('kolor "#12345g"', 1, 7);
    at('kolor "123456"', 1, 7);
    at('kolor #123456', 1, 7);
    at('kolor "#1234567"', 1, 7);
    at('kolor "#123456', 1, 7);
    expect(run2('kolor "#12345F" np 1').error).toBeNull();
  });

  test('grubość: całkowita od 1 do 12', () => {
    for (const w of ['0', '13', '2.5', '-1']) {
      const r = at(`np 5 grubosc ${w}`, 1, 14);
      expect(r.segments).toEqual([]); // literał: błąd analizy
    }
    expect(run2('grubosc 12 np 1').segments[0]!.width).toBe(12);
    expect(run2('grubosc 1 np 1').segments[0]!.width).toBe(1);
    expect(run2('grubosc 6 / 2 np 1').segments[0]!.width).toBe(3);
    const rt = at('np 5 niech w 20 grubosc w + 1', 1, 25);
    expect(rt.segments.length).toBe(1); // błąd wykonania zachowuje rysunek
  });

  test('wyrażenie z nazwą jest sprawdzane przy wykonaniu, wskazuje pierwszy symbol argumentu', () => {
    const r = at('niech a 3\nnp 10\ngrubosc 2 * a * 5', 3, 9);
    expect(r.segments.length).toBe(1);
  });

  test('błąd leksykalny wskazuje znak', () => {
    at('np 10 @', 1, 7);
    at('np 10 {', 1, 7);
    at('np 10 #x', 1, 7);
    at('np 5\n  np 3 !', 2, 8);
    at('np "abc', 1, 4);
  });

  test('pierwszy błąd w kodzie źródłowym', () => {
    at('np 1\nnp 2 5\nfoo', 2, 6);
    at('foo\nnp 2 5', 1, 1);
    at('np 1\nnp xyz\noto f\n np\njuż', 2, 4);
  });

  test('błąd analizy w procedurze nic nie rysuje, nawet gdy program zaczyna się od poleceń', () => {
    const r = run2('np 100\nf\noto f\n  np xxx\njuż');
    expect(r.segments).toEqual([]);
    expect(r.error!.line).toBe(4);
    expect(r.error!.column).toBe(6);
  });

  test('błąd wykonania zachowuje narysowane odcinki — po czyść tylko późniejsze', () => {
    const r = run2('np 10 czyść np 5 np 1 / 0');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBe(1);
    expect(r.segments[0]!.to).toEqual([0, 15, 0]);
  });
});

describe('interfejs testowy', () => {
  test('tryb 3d / 2d bez względu na wielkość liter, nieznany tryb to 2d', () => {
    expect(runSource('gora 10', '3D').error).toBeNull();
    expect(runSource('gora 10', 'xyz').error).not.toBeNull();
  });
  test('odcinki mają postać { from, to, color, width }', () => {
    const s = run2('np 1').segments[0]!;
    expect(Object.keys(s).sort()).toEqual(['color', 'from', 'to', 'width']);
    expect(s.from.length).toBe(3);
  });
});

describe('parser wyrażeń: zgodność z JavaScriptem na losowych wyrażeniach', () => {
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

  function gen(r: () => number, depth: number): string {
    const pick = r();
    if (depth <= 0 || pick < 0.25) return String(Math.floor(r() * 20));
    if (pick < 0.4) return `(${gen(r, depth - 1)})`;
    if (pick < 0.5) return `${r() < 0.5 ? '-' : '+'}${gen(r, depth - 1)}`;
    const op = ['+', '-', '*', '/'][Math.floor(r() * 4)]!;
    const sp = r() < 0.5 ? ' ' : '';
    return `${gen(r, depth - 1)}${sp}${op}${sp}${gen(r, depth - 1)}`;
  }

  test('wartość wyrażenia równa się wartości liczonej przez JavaScript (te same priorytety)', () => {
    const r = rng(2024);
    let checked = 0;
    for (let i = 0; i < 3000; i++) {
      const e = gen(r, 1 + Math.floor(r() * 5));
      // w JavaScripcie „--” to dekrement, a „+-” itp. są poprawne: dopisz odstępy tylko do oceny
      const js = e.replace(/([+\-*/])(?=[+\-])/g, '$1 ');
      let want: number;
      try {
        want = Function(`"use strict"; return (${js});`)() as number;
      } catch {
        continue;
      }
      const res = run2(`np ${e}`);
      if (!Number.isFinite(want) || Math.abs(want) > 100000) continue;
      if (res.error) {
        // jedyny dopuszczalny błąd: dzielenie przez zero w podwyrażeniu, które JS „ukrył” (np. 0 * (1/0))
        expect(res.error.message).toContain('zero');
        continue;
      }
      const got = res.segments.length ? res.segments[0]!.to[1] : 0;
      expect(Object.is(got, want) || got === want || Math.abs(got - want) < 1e-9).toBe(true);
      checked++;
    }
    expect(checked).toBeGreaterThan(1500);
  });
});
