import { describe, expect, test } from 'bun:test';
import { run, Execution, type Segment } from '../src/lang/interp';
import { parse } from '../src/lang/parser';
import { EXAMPLES } from '../src/examples';
import { TASKS, checkTask } from '../src/challenges';
import { helpExamples } from '../src/ui/help';
import { encodeProgram, decodeProgram } from '../src/ui/share';

const r2 = (s: string) => run(s, '2d');
const r3 = (s: string) => run(s, '3d');
const round = (v: number) => Math.round(v * 1e6) / 1e6 || 0;
const pts = (segs: Segment[]) => segs.map((s) => [s.from.map(round), s.to.map(round)]);
const ends = (segs: Segment[]) => segs.map((s) => s.to.map(round));
const ops = (src: string, mode: '2d' | '3d' = '2d') => {
  const ex = new Execution(parse(src, mode));
  ex.runToEnd();
  return { ops: ex.ops, error: ex.error };
};
const err = (src: string, mode: '2d' | '3d' = '2d') => {
  const r = run(src, mode);
  expect(r.error).not.toBeNull();
  return r.error!;
};
const at = (src: string, line: number, column: number, mode: '2d' | '3d' = '2d') => {
  const e = err(src, mode);
  expect([e.line, e.column]).toEqual([line, column]);
  expect(typeof e.message).toBe('string');
  expect(e.message.length).toBeGreaterThan(5);
  return e;
};

describe('programy standardowe', () => {
  const counts: Record<string, number> = {
    kwadrat: 4, gwiazda: 5, rozeta: 48, spirala: 90, wielokaty: 42, drzewo: 255, sniezynka: 768,
    schody: 12, szescian: 17, pierscien: 36, kula: 432, helisa: 240, drzewo3d: 121,
  };
  for (const ex of EXAMPLES) {
    test(`${ex.id} (${ex.mode}) rysuje bez błędu`, () => {
      const r = run(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBe(counts[ex.id]);
      for (const s of r.segments) {
        expect(s.color).toMatch(/^#[0-9a-f]{6}$/);
        expect(Number.isInteger(s.width)).toBe(true);
        expect(s.from).toHaveLength(3);
      }
    });
  }
  test('są wszystkie trzynaście, z właściwymi trybami', () => {
    expect(EXAMPLES.map((e) => e.id)).toEqual(Object.keys(counts));
    expect(EXAMPLES.filter((e) => e.mode === '3d').map((e) => e.id)).toEqual(['schody', 'szescian', 'pierscien', 'kula', 'helisa', 'drzewo3d']);
  });
  test('kwadrat ma dokładne współrzędne', () => {
    const r = r2(EXAMPLES[0].source);
    expect(pts(r.segments)).toEqual([
      [[0, 0, 0], [0, 120, 0]],
      [[0, 120, 0], [120, 120, 0]],
      [[120, 120, 0], [120, 0, 0]],
      [[120, 0, 0], [0, 0, 0]],
    ]);
    expect(r.segments[0]).toMatchObject({ color: '#16866a', width: 3 });
  });
  test('spirala zmienia kolory na przemian', () => {
    const r = r2(EXAMPLES[3].source);
    expect(r.segments.slice(0, 3).map((s) => s.color)).toEqual(['#16866a', '#c1763d', '#16866a']);
    expect(round(r.segments[1].from[1] - r.segments[1].to[1])).not.toBe(0);
  });
  test('płaskie programy dają te same współrzędne w 2D i 3D', () => {
    for (const ex of EXAMPLES.filter((e) => e.mode === '2d')) {
      expect(r3(ex.source).segments).toEqual(r2(ex.source).segments);
    }
  });
  test('schody wznoszą się w osi z', () => {
    const r = r3(EXAMPLES.find((e) => e.id === 'schody')!.source);
    expect(ends(r.segments).slice(0, 2)).toEqual([[0, 35, 0], [0, 35, 20]]);
    expect(ends(r.segments).at(-1)).toEqual([0, 210, 120]);
  });
});

describe('wyrażenia', () => {
  test('pierwszeństwo i łączność w lewo', () => {
    expect(ends(r2('np 20 - 5 - 3').segments)).toEqual([[0, 12, 0]]);
    expect(ends(r2('np 2 + 3 * 4').segments)).toEqual([[0, 14, 0]]);
    expect(ends(r2('np 100 / 5 / 2').segments)).toEqual([[0, 10, 0]]);
    expect(ends(r2('np (2 + 3) * 4').segments)).toEqual([[0, 20, 0]]);
  });
  test('spacje wokół operatora', () => {
    expect(ends(r2('np 10 - 5').segments)).toEqual([[0, 5, 0]]);
    expect(ends(r2('np 10-5').segments)).toEqual([[0, 5, 0]]);
    const e = at('np 10 -5', 1, 7);
    expect(r2('np 10 -5').segments).toEqual([]);
    expect(e.message).toContain('-');
    at('np 10 +5', 1, 7);
    at('np 10 *5', 1, 7);
    at('np 10 /5', 1, 7);
    at('np 10- 5', 1, 6);
    expect(ends(r2('np 4*5').segments)).toEqual([[0, 20, 0]]);
  });
  test('porównania nie podlegają regule spacji', () => {
    expect(r2('jeśli 1<2 [np 5]').segments).toHaveLength(1);
    expect(r2('jeśli 1 <2 [np 5]').segments).toHaveLength(1);
  });
  test('znaki jednoargumentowe', () => {
    expect(ends(r2('np -(3 - 5)').segments)).toEqual([[0, 2, 0]]);
    expect(ends(r2('np - -2').segments)).toEqual([[0, 2, 0]]);
    expect(ends(r2('np +-+3').segments)).toEqual([[0, -3, 0]]);
    expect(ends(r2('niech bok 7\nnp -bok').segments)).toEqual([[0, -7, 0]]);
    expect(ends(r2('np 2 * -3').segments)).toEqual([[0, -6, 0]]);
  });
  test('liczby', () => {
    expect(ends(r2('np .5').segments)).toEqual([[0, 0.5, 0]]);
    expect(ends(r2('np 12.5').segments)).toEqual([[0, 12.5, 0]]);
    at('np 1e3', 1, 4);
    at('np 0x10', 1, 4);
    at('np NaN', 1, 4);
    at('np Infinity', 1, 4);
    at('np 5.', 1, 4);
    at('np 1.2.3', 1, 4);
  });
  test('dzielenie przez zero i wynik nieskończony: błąd wykonania przy pierwszym tokenie argumentu', () => {
    const r = r2('np 10\nniech z 0\nnp 3 + 5 / z');
    expect(r.segments).toHaveLength(1);
    expect([r.error!.line, r.error!.column]).toEqual([3, 4]);
    const big = r2('niech a 10\npowtorz 400 [niech a a * 10]\nnp 1');
    expect(big.error).not.toBeNull();
    expect(big.error!.line).toBe(2);
  });
  test('wyrażenie nie jest operacją', () => {
    expect(ops('np 1 + 2 * 3 - 4').ops).toBe(1);
  });
  test('porównania są dokładne', () => {
    expect(r2('jeśli 0.1 + 0.2 = 0.3 [np 10]').segments).toHaveLength(0);
    expect(r2('jeśli 0.5 + 0.25 = 0.75 [np 10]').segments).toHaveLength(1);
    expect(r2('jeżeli 3 <> 3 [np 1] [np 2]').segments[0].to[1]).toBe(2);
    expect(r2('jeśli 3 <= 3 [np 1]\njeśli 3 >= 4 [np 1]').segments).toHaveLength(1);
  });
});

describe('słowa i składnia', () => {
  test('wielkość liter, polskie znaki i angielskie aliasy', () => {
    const a = r2('POWTÓRZ 4 [NaPrZóD 10 Prawo 90]').segments;
    const b = r2('repeat 4 [fd 10 rt 90]').segments;
    const c = r2('powtorz 4 [naprzod 10 pw 90]').segments;
    expect(a).toEqual(b);
    expect(b).toEqual(c);
    expect(a).toHaveLength(4);
    expect(r2('PODNIEŚ np 10 OPUŚĆ np 5').segments).toHaveLength(1);
    expect(r2('pu fd 10 pd bk 5 lt 90 forward 5 back 1 right 1 left 1').segments).toHaveLength(3);
    expect(r2('np 5 czysc np 1 cs np 2 clearscreen np 3').segments).toHaveLength(1);
  });
  test('komentarze', () => {
    expect(r2('; tylko komentarz\nnp 10 ; i tu\n;np 50').segments).toHaveLength(1);
  });
  test('kolor', () => {
    expect(r2('kolor "#AABBCC" np 1').segments[0].color).toBe('#aabbcc');
    expect(r2('color "#000000" np 1').segments[0].color).toBe('#000000');
    at('kolor "#12345"', 1, 7);
    at('kolor "#1234567"', 1, 7);
    at('kolor "16866a"', 1, 7);
    at('kolor 5', 1, 7);
    at('kolor', 1, 1);
    at('kolor "#16866a', 1, 7);
  });
  test('grubość', () => {
    expect(r2('grubosc 12 np 1 grubość 1 np 1 width 7 np 1').segments.map((s) => s.width)).toEqual([12, 1, 7]);
    at('np 10\ngrubosc 13', 2, 9);
    expect(r2('np 10\ngrubosc 13').segments).toEqual([]);
    at('grubosc 0', 1, 9);
    at('grubosc 2.5', 1, 9);
    at('grubosc 1 + 0.5', 1, 9);
    const r = r2('np 10\nniech g 20\ngrubosc g - 5');
    expect(r.segments).toHaveLength(1);
    expect([r.error!.line, r.error!.column]).toEqual([3, 9]);
  });
  test('nawiasy', () => {
    at('powtorz 4 [np 10', 1, 11);
    at('np 5 ]', 1, 6);
    at('np (5', 1, 4);
    at('np (5 + 1', 1, 4);
    at('np 5)', 1, 5);
    at('np [5]', 1, 4);
  });
  test('brakujący argument wskazuje token w jego miejscu albo polecenie na końcu programu', () => {
    at('np', 1, 1);
    at('powtorz 2 [np]', 1, 14);
    at('np )', 1, 4);
    at('pw np 5', 1, 4);
    at('np 5 +', 1, 6);
  });
  test('nieznane polecenia i wartości bez polecenia', () => {
    at('naprzodd 10', 1, 1);
    at('np 10 20', 1, 7);
    at('niech a 1\na', 2, 1);
    at('5', 1, 1);
    at('"#ffffff"', 1, 1);
  });
  test('błąd zapisu nic nie rysuje', () => {
    const r = r2('np 100\npw 90\nnp 100\nxyz');
    expect(r.segments).toEqual([]);
    expect([r.error!.line, r.error!.column]).toEqual([4, 1]);
  });
  test('kolumny liczone w znakach, także z polskimi literami', () => {
    at('niech żółć 5\nnp żółć ąę', 2, 9);
  });
});

describe('ruch i geometria', () => {
  test('ruch o zero nic nie rysuje, podniesione pióro też nie', () => {
    expect(r2('np 0 pod np 10 opu np 0').segments).toEqual([]);
  });
  test('ws i skręty', () => {
    expect(ends(r2('ws 10').segments)).toEqual([[0, -10, 0]]);
    expect(ends(r2('pw 90 np 10').segments)).toEqual([[10, 0, 0]]);
    expect(ends(r2('lw 90 np 10').segments)).toEqual([[-10, 0, 0]]);
    expect(ends(r2('pw -90 np 10').segments)).toEqual([[-10, 0, 0]]);
    expect(ends(r2('pw 450 np 10').segments)).toEqual([[10, 0, 0]]);
    const d = r2('pw 45 np 10').segments[0].to;
    expect(round(d[0])).toBe(round(Math.SQRT2 * 5));
  });
  test('dom wraca z linią i przywraca kierunek, nie zmienia pióra', () => {
    const r = r2('kolor "#ff0000" grubosc 5 pw 90 np 50 dom np 10');
    expect(pts(r.segments)).toEqual([[[0, 0, 0], [50, 0, 0]], [[50, 0, 0], [0, 0, 0]], [[0, 0, 0], [0, 10, 0]]]);
    expect(r.segments[2]).toMatchObject({ color: '#ff0000', width: 5 });
    expect(r2('dom').segments).toEqual([]);
    expect(r2('pod np 10 dom').segments).toEqual([]);
    expect(r3('gora 90 np 10 dom np 5').segments.map((s) => s.to.map(round))).toEqual([[0, 0, 10], [0, 0, 0], [0, 5, 0]]);
  });
  test('czyść usuwa odcinki i nie zmienia stanu żółwia', () => {
    const r = r2('kolor "#123456" np 10 pw 90 czyść np 5');
    expect(pts(r.segments)).toEqual([[[0, 10, 0], [5, 10, 0]]]);
    expect(r.segments[0].color).toBe('#123456');
  });
  test('gora 90: żółw leci wzdłuż dawnej góry, góra idzie do tyłu', () => {
    expect(ends(r3('gora 90 np 10').segments)).toEqual([[0, 0, 10]]);
    expect(ends(r3('dol 90 np 10').segments)).toEqual([[0, 0, -10]]);
    // po gora 90 góra żółwia to -y; kolejne gora 90 kieruje go w -y
    expect(ends(r3('gora 90 gora 90 np 10').segments)).toEqual([[0, -10, 0]]);
  });
  test('pp 90: góra staje się dawnym prawem, prawo dawnym dołem', () => {
    // po pp 90 obrót w prawo (wokół nowej góry = +x) kieruje żółwia w dawny dół (-z)
    expect(ends(r3('pp 90 pw 90 np 10').segments)).toEqual([[0, 0, -10]]);
    // gora po pp 90 obraca kierunek ku nowej górze (+x)
    expect(ends(r3('pp 90 gora 90 np 10').segments)).toEqual([[10, 0, 0]]);
    expect(ends(r3('pl 90 gora 90 np 10').segments)).toEqual([[-10, 0, 0]]);
    // przechył nie zmienia kierunku
    expect(ends(r3('pp 37 np 10').segments)).toEqual([[0, 10, 0]]);
  });
  test('polecenia przestrzenne w trybie 2D to błąd zapisu', () => {
    for (const c of ['gora 10', 'góra 10', 'dol 10', 'dół 10', 'pp 10', 'pl 10', 'pitchup 1', 'pitchdown 1', 'rr 1', 'rl 1', 'przechylprawo 1', 'przechyllewo 1', 'rollright 1', 'rollleft 1']) {
      const e = at(`np 10\n${c}`, 2, 1);
      expect(e.message).toContain('3D');
    }
    expect(r3('gora 10 dol 10 pp 10 pl 10').error).toBeNull();
  });
  test('pierścień jest przechylony o 30 stopni', () => {
    const r = r3(EXAMPLES.find((e) => e.id === 'pierscien')!.source);
    const z = r.segments[0].to[2] / 12;
    expect(round(z)).toBe(round(Math.sin(Math.PI / 6)));
  });
});

describe('powtórzenia', () => {
  test('liczba powtórzeń', () => {
    expect(r2('powtorz 0 [np 10]').segments).toEqual([]);
    at('powtorz 10001 [np 1]', 1, 9);
    at('powtorz -1 [np 1]', 1, 9);
    at('powtorz 1.5 [np 1]', 1, 9);
    at('powtorz 4 np 1', 1, 11);
    const r = r2('np 1\nniech n 2.5\npowtorz n [np 1]');
    expect(r.segments).toHaveLength(1);
    expect([r.error!.line, r.error!.column]).toEqual([3, 9]);
  });
  test('nrpowt w najbliższym powtórzeniu', () => {
    expect(ends(r2('powtorz 3 [np nrpowt]').segments)).toEqual([[0, 1, 0], [0, 3, 0], [0, 6, 0]]);
    const r = r2('powtorz 2 [powtorz 3 [np nrpowt] np nrpowt * 100]');
    expect(r.segments.map((s) => round(s.to[1] - s.from[1]))).toEqual([1, 2, 3, 100, 1, 2, 3, 200]);
    expect(ends(r2('powtorz 2 [repcount + 0 > 1]'.replace('repcount + 0 > 1', 'np repcount')).segments)).toEqual([[0, 1, 0], [0, 3, 0]]);
  });
  test('nrpowt poza powtórzeniem to błąd zapisu, także w procedurze', () => {
    at('np nrpowt', 1, 4);
    at('np 10\noto p\n  np nrpowt\njuż\npowtorz 3 [p]', 3, 6);
    expect(r2('oto p\n  powtorz 2 [np nrpowt]\njuż\np').segments).toHaveLength(2);
  });
});

describe('zmienne', () => {
  test('globalne, także zadeklarowane później', () => {
    expect(ends(r2('niech a 5\nnp a\nniech a a + 1\nnp :a').segments)).toEqual([[0, 5, 0], [0, 11, 0]]);
    const r = r2('np 1\nnp x\nniech x 4');
    expect(r.segments).toHaveLength(1);
    expect([r.error!.line, r.error!.column]).toEqual([2, 4]);
  });
  test('nieznana nazwa to błąd zapisu', () => {
    at('np 10\nnp bok', 2, 4);
    at('oto p\n  niech lok 1\njuż\nnp lok', 4, 4);
  });
  test('zmienne lokalne zasłaniają globalne do końca wywołania', () => {
    const src = 'niech x 5\noto p\n  np x\n  niech x 10\n  np x\njuż\np\nnp x';
    expect(r2(src).segments.map((s) => round(s.to[1] - s.from[1]))).toEqual([5, 10, 5]);
  });
  test('parametr można zmienić, a lokalne znikają po wywołaniu', () => {
    const src = 'oto p ma: a\n  niech a a * 2\n  np a\njuż\np 3\np 4';
    expect(r2(src).segments.map((s) => round(s.to[1] - s.from[1]))).toEqual([6, 8]);
    const r = r2('oto p\n  jeśli 1 = 2 [niech q 1]\n  np 5 + q\njuż\np');
    expect([r.error!.line, r.error!.column]).toEqual([3, 6]);
  });
  test('procedura nie widzi zmiennych lokalnych wywołującego', () => {
    const r = r2('oto a\n  niech v 1\n  b\njuż\noto b\n  np v\njuż\na');
    expect(r.error).not.toBeNull();
    expect(r.error!.line).toBe(6);
  });
  test('nazwa zmiennej nie może być poleceniem ani procedurą', () => {
    at('niech np 5', 1, 7);
    at('oto kw\njuż\nniech kw 5', 3, 7);
  });
  test('niech w powtórzeniu na najwyższym poziomie jest globalna', () => {
    expect(r2('powtorz 3 [niech s nrpowt]\nnp s').segments[0].to[1]).toBe(3);
  });
});

describe('warunki', () => {
  test('jeśli i jeżeli', () => {
    expect(r2('niech a 3\njeśli a > 2 [np 1]\njesli a < 2 [np 2]\nif a = 3 [np 3]').segments).toHaveLength(2);
    expect(ends(r2('jeżeli 1 > 2 [np 1] [np 2]\njezeli 2 > 1 [np 10] [np 20]\nifelse 1 = 1 [np 100] [np 200]').segments).map((p) => p[1])).toEqual([2, 12, 112]);
  });
  test('brak porównania albo bloku', () => {
    at('jeśli 1 [np 1]', 1, 9);
    at('jeśli 1 > 2', 1, 11);
    at('jeżeli 1 > 2 [np 1]', 1, 19);
  });
  test('stop w bloku warunku kończy procedurę', () => {
    expect(r2('oto p\n  jeśli 1 = 1 [np 1 stop np 2]\n  np 3\njuż\np\nnp 4').segments.map((s) => round(s.to[1] - s.from[1]))).toEqual([1, 4]);
  });
});

describe('procedury', () => {
  test('przykład z opisu języka', () => {
    expect(ends(r2('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90').segments)).toEqual([[0, 80, 0], [80, 80, 0], [80, 0, 0], [0, 0, 0]]);
  });
  test('wywołanie przed definicją, argument jako wyrażenie', () => {
    expect(ends(r2('kwadrat 40 * 2 90\noto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż').segments)[0]).toEqual([0, 80, 0]);
  });
  test('dawny nagłówek z dwukropkami i aliasy to/end', () => {
    expect(r2('oto k :bok :kąt\n  powtorz 4 [np :bok pw kąt]\njuż\nk 10 90').segments).toHaveLength(4);
    expect(r2('to sq :s\n  repeat 4 [fd :s rt 90]\nend\nsq 5').segments).toHaveLength(4);
    expect(r2('OTO Duzy MA: A\n  np a\nJUZ\nduzy 3').segments).toHaveLength(1);
  });
  test('parametr o nazwie procedury', () => {
    const src = 'oto bok ma: bok\n  jeśli bok < 10 [stop]\n  np bok\n  bok bok / 2\njuż\nbok 40';
    expect(r2(src).segments.map((s) => round(s.to[1] - s.from[1]))).toEqual([40, 20, 10]);
  });
  test('ujemny argument dzięki regule spacji', () => {
    expect(ends(r2('oto p ma: a, b\n  np a pw 90 np b\njuż\np 40 -5').segments)).toEqual([[0, 40, 0], [-5, 40, 0]]);
  });
  test('liczba argumentów', () => {
    at('oto p ma: a, b\n  np a\njuż\np 1', 4, 1);
    at('oto p ma: a, b\n  np a\njuż\np 1 ]', 4, 5);
    at('oto p ma: a\n  np a\njuż\np 1 2', 4, 5);
    at('oto p ma: a, b\n  np a\njuż\npowtorz 2 [p 1]', 4, 15);
  });
  test('błędy definicji', () => {
    at('oto p\n  np 1\njuż\noto p\n  np 2\njuż', 4, 5);
    at('oto p\n  np 1', 1, 1);
    at('oto p\n  np 1 już', 2, 8);
    at('np 1 oto p\njuż', 1, 6);
    at('powtorz 2 [\noto p\njuż\n]', 2, 1);
    at('oto a\n  oto b\n  już\njuż', 2, 3);
    at('już', 1, 1);
    at('oto np\njuż', 1, 5);
    at('oto p ma: a a\njuż', 1, 13);
    at('oto p ma: a, a\njuż', 1, 14);
    at('oto\njuż', 1, 1);
  });
  test('stop kończy wywołanie także z wnętrza powtórzenia; na najwyższym poziomie kończy program', () => {
    expect(r2('oto p\n  powtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\n  np 100\njuż\np np 10').segments.map((s) => round(s.to[1] - s.from[1]))).toEqual([1, 1, 10]);
    expect(r2('np 1\nstop\nnp 2').segments).toHaveLength(1);
    expect(r2('powtorz 3 [np 1 stop]\nnp 5').segments).toHaveLength(1);
  });
  test('rekurencja i limit 32 ramek', () => {
    const rec = (n: number) => `oto a ma: n\n  jeśli n > 0 [a n - 1]\njuż\na ${n}`;
    expect(r2(rec(31)).error).toBeNull();
    const e = r2(rec(32)).error!;
    expect(e).not.toBeNull();
    expect(e.line).toBe(2);
    expect([err('oto a\n  np 1\n  a\njuż\na').line]).toEqual([3]);
    expect(r2('oto a\n  np 1\n  a\njuż\na').segments).toHaveLength(32);
    // powtórzenia też są ramkami, warunki nie
    const nest = (n: number) => 'powtorz 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    expect(r2(nest(32)).error).toBeNull();
    const callIn = 'oto p\n  np 1\njuż\n' + 'powtorz 1 ['.repeat(32) + 'p' + ']'.repeat(32);
    expect(r2(callIn).error).not.toBeNull();
    const ifs = 'oto p\n  np 1\njuż\n' + 'powtorz 1 ['.repeat(16) + 'jeśli 1 = 1 ['.repeat(15) + 'p' + ']'.repeat(31);
    expect(r2(ifs).error).toBeNull();
  });
  test('definicje bez wywołań nic nie robią', () => {
    expect(r2('oto p\n  np 1\njuż').segments).toEqual([]);
  });
});

describe('limity', () => {
  test('liczenie operacji', () => {
    expect(ops('np 1').ops).toBe(1);
    expect(ops('powtorz 3 [np 1]').ops).toBe(1 + 3 * 2);
    expect(ops('jeśli 1 = 1 [np 1]').ops).toBe(3);
    expect(ops('jeśli 1 = 2 [np 1]').ops).toBe(1);
    expect(ops('jeżeli 1 = 2 [np 1] [np 2 np 3]').ops).toBe(4);
    expect(ops('niech a 1').ops).toBe(1);
    expect(ops('oto p\n  np 1\njuż\np').ops).toBe(3);
    expect(ops('oto p\n  stop\n  np 1\njuż\np').ops).toBe(3);
  });
  test('10 000 operacji wolno, 10 001 już nie', () => {
    expect(ops('powtorz 4999 [np 0]\nnp 0').error).toBeNull();
    expect(ops('powtorz 4999 [np 0]\nnp 0').ops).toBe(10000);
    const r = r2('powtorz 5000 [np 1]');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBe(5000);
    expect(r.error!.message).toContain('10 000');
  });
  test('nieskończona pętla zatrzymuje się na limicie i zostawia rysunek', () => {
    const r = r2('oto p\n  np 1 pw 1\n  p\njuż\npowtorz 10000 [p]');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBeGreaterThan(0);
  });
  test('współrzędne w zakresie ±100 000', () => {
    expect(r2('np 100000').error).toBeNull();
    const r = r2('np 10\npw 90\nnp 100001');
    expect([r.error!.line, r.error!.column]).toEqual([3, 1]);
    expect(r.segments).toHaveLength(1);
    expect(r2('pod np 100001').error).not.toBeNull();
    expect(r3('gora 90 np 100000.5').error).not.toBeNull();
  });
  test('długość źródła i liczba tokenów', () => {
    expect(r2(';' + 'x'.repeat(49_999)).error).toBeNull();
    expect(r2(';' + 'x'.repeat(50_000)).error).not.toBeNull();
    expect(r2('pod '.repeat(10_000)).error).toBeNull();
    const e = r2('pod '.repeat(10_001)).error!;
    expect(e).not.toBeNull();
    expect([e.line, e.column]).toEqual([1, 40_001]);
    // przecinki, nawiasy i operatory też są tokenami
    expect(r2('np ' + '(1) + '.repeat(2500) + '1').error).not.toBeNull();
  });
  test('zagnieżdżenie nawiasów do 32', () => {
    const nest = (n: number) => 'jeśli 1 = 1 ['.repeat(n) + 'np 1' + ']'.repeat(n);
    expect(r2(nest(32)).error).toBeNull();
    const e = r2(nest(33)).error!;
    expect([e.line, e.column]).toEqual([1, 32 * 13 + 13]);
  });
  test('błąd wykonania zostawia rysunek po ostatnim czyść', () => {
    const r = r2('np 10\nczyść\nnp 5\nniech z 0\nnp 1 / z');
    expect(r.segments).toHaveLength(1);
    expect(r.segments[0].to[1]).toBe(15);
  });
});

describe('wynik w formacie haczyka testowego', () => {
  test('odcinki mają from, to, color, width', () => {
    const r = r2('np 10');
    expect(r).toEqual({ segments: [{ from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 }], error: null });
  });
  test('błąd ma message, line, column', () => {
    const r = r2('np 10\nnp');
    expect(Object.keys(r.error!).sort()).toEqual(['column', 'line', 'message']);
  });
});

describe('przykłady z pomocy', () => {
  test('każdy działa bez błędu', () => {
    const all = helpExamples();
    expect(all.length).toBeGreaterThan(20);
    for (const ex of all) {
      const r = run(ex.code, ex.mode);
      if (r.error) throw new Error(`${ex.code}\n→ ${r.error.message}`);
      expect(r.segments.length).toBeGreaterThan(0);
    }
  });
});

describe('zadania', () => {
  test('co najmniej pięć, każde rozwiązanie wzorcowe przechodzi', () => {
    expect(TASKS.length).toBeGreaterThanOrEqual(5);
    for (const t of TASKS) {
      expect(checkTask(t, t.solution).ok).toBe(true);
      expect(checkTask(t, t.starter).ok).toBe(false);
    }
  });
  test('kolejność, kierunek i podział odcinków nie mają znaczenia', () => {
    const t = TASKS.find((x) => x.id === 'trojkat')!;
    expect(checkTask(t, 'np 50 np 50 pw 120 np 100 pw 120 np 100').ok).toBe(true);
    expect(checkTask(t, 'pw 60 np 100 lw 120 np 100 lw 120 np 100').ok).toBe(true);
  });
  test('zły rysunek dostaje powód', () => {
    const t = TASKS.find((x) => x.id === 'trojkat')!;
    const mirrored = checkTask(t, 'powtorz 3 [np 100 lw 120]');
    expect(mirrored.ok).toBe(false);
    expect(mirrored.reason).toContain('Brakuje');
    const extra = checkTask(t, 'powtorz 3 [np 100 pw 120] pw 90 np 40');
    expect(extra.reason).toContain('nie ma we wzorze');
    expect(checkTask(t, 'np').reason).toContain('błąd');
    expect(checkTask(t, 'pod np 10').reason).toContain('niczego');
  });
});

describe('link do programu', () => {
  test('zapis i odczyt zachowują tekst', async () => {
    for (const ex of EXAMPLES) {
      const code = await encodeProgram(ex.source);
      expect(code).toMatch(/^[zt]\.[A-Za-z0-9_-]+$/);
      expect(await decodeProgram(code)).toBe(ex.source);
    }
    expect(await decodeProgram('z.!!!')).toBeNull();
    expect(await decodeProgram('xyz')).toBeNull();
  });
});
