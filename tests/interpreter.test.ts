import { describe, expect, test } from 'bun:test';
import { aliases, Execution, run } from '../src/interpreter';
import { examples } from '../src/examples';

const end = (source: string, mode: '2d' | '3d' = '2d') => { const r = run(source, mode); expect(r.error).toBeNull(); return r.segments.at(-1)?.to; };
const errorAt = (source: string, line: number, column: number, segments = 0) => {
  const r = run(source, '2d'); expect(r.error).not.toBeNull(); expect(r.error).toMatchObject({ line, column }); expect(r.segments).toHaveLength(segments); return r.error!;
};
describe('wyrażenia i tokeny', () => {
  test('precedencja i łączność', () => {
    expect(end('np 20 - 5 - 3')).toEqual([0, 12, 0]);
    expect(end('np 2 + 3 * 4')).toEqual([0, 14, 0]);
    expect(end('np 10-5')).toEqual([0, 5, 0]);
    expect(end('np -(3 - 5) np - -2 np +.5')).toEqual([0, 4.5, 0]);
  });
  test('długie wyrażenia nie zależą od stosu JavaScript', () => {
    expect(end('np ' + '-'.repeat(9000) + '1')).toEqual([0, 1, 0]);
    expect(end('np ' + '('.repeat(4999) + '1' + ')'.repeat(4999))).toEqual([0, 1, 0]);
    expect(end('np ' + '1+'.repeat(4999) + '1')).toEqual([0, 5000, 0]);
    expect(end('np 2 * - (3 - 5) + + - - 3')).toEqual([0, 7, 0]);
  });
  test('wszystkie aliasy poleceń', () => {
    const forms: Record<string, string> = { fd: 'A 5', bk: 'A 5', rt: 'A 90 np 3', lt: 'A 90 np 3', pu: 'A np 3', pd: 'pod A np 3', color: 'A "#ABCDEF" np 3', width: 'A 5 np 3', repeat: 'A 2 [np 3]', let: 'A x 5 np x', if: 'A 1 = 1 [np 3]', ifelse: 'A 1 = 2 [np 3] [np 4]', stop: 'np 1 A np 2', home: 'np 3 A', clear: 'np 3 A np 2', pitch: 'A 90 np 3', pitchdown: 'A 90 np 3', roll: 'A 90 gora 90 np 3', rollleft: 'A 90 gora 90 np 3', to: 'A f\nnp 3\njuż\nf', end: 'oto f\nnp 3\nA\nf', rep: 'powtorz 3 [np A]' };
    for (const [alias, canonical] of Object.entries(aliases)) {
      const primary = Object.keys(aliases).find(name => aliases[name] === canonical)!;
      const actual = run(forms[canonical].replace('A', alias), '3d');
      expect(actual.error, alias).toBeNull(); expect(actual).toEqual(run(forms[canonical].replace('A', primary), '3d'));
    }
  });
  test('symetria odstępów operatorów', () => {
    for (const s of ['np 10 -5', 'np 10- 5', 'np 10 +5', 'np 10* 5', 'np 10 /5']) expect(run(s).error).not.toBeNull();
    errorAt('np 10 -5', 1, 7);
  });
  test('tylko liczby dziesiętne', () => {
    for (const s of ['1e3', '0x10', 'NaN', 'Infinity', '1.2.3', '.']) expect(run(`np ${s}`).error).not.toBeNull();
  });
  test('polskie litery, aliasy, komentarze, kolory', () => {
    const r = run('; cześć\nKoLoR "#AAbBcC" GrUbOśĆ 4 NAPRZÓD 12.5 PRAWO 90 fd 5');
    expect(r.error).toBeNull(); expect(r.segments[1]).toMatchObject({ to: [5, 12.5, 0], color: '#aabbcc', width: 4 });
  });
  test('argument wskazuje pierwszy token, także w nawiasie', () => {
    errorAt('np 10\nnp (5 + 1 / 0)', 2, 4, 1);
    errorAt('np 10\nnp (x + 1)\nniech x 5', 2, 4, 1);
    errorAt('np 5\ngrubosc (2 * 7)', 2, 9);
    errorAt('powtorz 1 [np ]', 1, 15);
    errorAt('np', 1, 1);
    errorAt('niech', 1, 1);
    errorAt('np\noto f\nnp 3\njuż\n10', 2, 1);
    errorAt('np 1\noto f\nnp 3\njuż\n+ 2', 5, 1);
  });
  test('błąd parsowania nie rysuje, runtime zachowuje rysunek', () => {
    errorAt('np 5\nbzdura', 2, 1);
    errorAt('np 5\nnp 1 / 0', 2, 4, 1);
    errorAt('np 5\nniech x 13\ngrubosc x', 3, 9, 1);
  });
});
describe('zmienne, warunki, procedury', () => {
  test('deklaracja późniejsza jest rozpoznana, ale niezainicjalizowana', () => {
    expect(errorAt('np x\nniech x 3', 1, 4).message).toContain('jeszcze wartości');
    expect(run('np x').error?.message).toContain('Nieznana zmienna');
  });
  test('lokalne zmienne i parametry', () => {
    expect(end('niech x 3\nf 10\nnp x\noto f ma: x\nniech x x + 2\nnp x\njuż')).toEqual([0, 15, 0]);
    expect(end('oto f :x\nnp :x\njuż\nf 7')).toEqual([0, 7, 0]);
    expect(end('oto f ma: f\nnp f\njuż\nf 7')).toEqual([0, 7, 0]);
    expect(end('oto f ma: f\nniech f 5\nnp f\njuż\nf 7')).toEqual([0, 5, 0]);
    expect(end('niech x 5\noto f\nniech x x + 1\nnp x\njuż\nf np x')).toEqual([0, 11, 0]);
  });
  test('przypisania w innych ścieżkach deklarują nazwę', () => {
    errorAt('jeśli 1 = 2 [niech a 3]\nnp a', 2, 4);
    expect(end('jeżeli 2>=1 [niech a 6] [niech a 7] np a')).toEqual([0, 6, 0]);
  });
  test('porównanie dokładne i sześć operatorów', () => {
    expect(run('jeśli 0.1 + 0.2 = 0.3 [np 4]').segments).toHaveLength(0);
    for (const condition of ['1<2', '2>1', '1=1', '1<=1', '2>=2', '1<>2']) expect(end(`jeśli ${condition} [np 8]`)).toEqual([0, 8, 0]);
  });
  test('rekurencja i stop wychodzący z całego wywołania', () => {
    expect(end('oto f ma: n\njeśli n = 0 [stop]\nnp n f n - 1\njuż\nf 4')).toEqual([0, 10, 0]);
    expect(end('oto f\npowtorz 8 [np 1 jeśli 1 = 1 [stop]] np 99\njuż\nf np 3')).toEqual([0, 4, 0]);
    expect(end('powtorz 9 [np 1 stop] np 99')).toEqual([0, 1, 0]);
  });
  test('argumenty procedury są pełnymi wyrażeniami', () => {
    expect(end('f 40 * 2 90\noto f ma: a, b\nnp a pw b\njuż')).toEqual([0, 80, 0]);
    expect(end('f 10 -2\noto f ma: a, b\nnp a np b\njuż')).toEqual([0, 8, 0]);
    expect(run('oto f ma: a, b\nnp a\njuż\nf 1').error).not.toBeNull();
  });
  test('błędne definicje', () => {
    for (const s of ['oto x\nnp 1', 'oto x\nnp 1 już', 'np 1 oto x\njuż', 'oto x\noto y\njuż\njuż', 'powtorz 1 [\noto x\njuż\n]', 'oto x\njuż\noto x\njuż', 'oto x ma: a,\njuż']) expect(run(s).error).not.toBeNull();
  });
  test('parametry wywołującego nie przeciekają, zmienne w wywołaniach nie przeciekają', () => {
    expect(run('oto f ma: x\ng\njuż\noto g\nnp x\njuż\nf 5').error?.message).toContain('Nieznana zmienna');
    errorAt('oto f ma: n\njeśli n = 1 [niech x 3]\nnp x\njuż\nf 1 f 0', 3, 4, 1);
  });
});
describe('powtórzenia i limity', () => {
  test('najbliższy leksykalny nrpowt', () => {
    expect(end('powtorz 2 [np nrpowt powtorz 2 [np repcount] np nrpowt]')).toEqual([0, 12, 0]);
    expect(run('powtorz 2 [f]\noto f\nnp nrpowt\njuż').error).not.toBeNull();
    expect(run('np nrpowt').error).not.toBeNull();
    expect(run('powtorz 0 [np 8]').segments).toHaveLength(0);
  });
  test('zakres i całkowitość', () => {
    for (const s of ['grubosc 0', 'grubosc 12.1', 'powtorz 1.5 []', 'powtorz 10001 []', 'powtorz -1 []']) expect(run('np 1 ' + s).segments).toHaveLength(0);
  });
  test('operacje obejmują końce iteracji i ciał', () => {
    const a = new Execution('powtorz 2 [np 1]', '2d'); a.finish(); expect(a.operations).toBe(5);
    const b = new Execution('jeśli 1 = 1 [] jeśli 1 = 2 []', '2d'); b.finish(); expect(b.operations).toBe(3);
    const c = run('powtorz 10000 []'); expect(c.error?.message).toContain('operacji');
    const d = run('oto f\nf\njuż\nf'); expect(d.error?.message).toContain('32 aktywnych');
    const e = new Execution('oto f\nstop\njuż\nf', '2d'); e.finish(); expect(e.operations).toBe(3);
    const f = new Execution('powtorz 9999 []', '2d'); expect(f.finish().error).toBeNull(); expect(f.operations).toBe(10000);
    const g = run('powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32)); expect(g.error).toBeNull();
    const h = run('jeśli 1 = 1 ['.repeat(32) + 'np 1' + ']'.repeat(32)); expect(h.error).toBeNull();
  });
  test('nawiasy, tokeny, źródło i współrzędne', () => {
    expect(run('powtorz 1 ['.repeat(33) + ']'.repeat(33)).error?.message).toContain('32 poziomów');
    expect(run('pod '.repeat(10001)).error?.message).toContain('tokenów');
    expect(run(';'.repeat(50001)).error?.message).toContain('znaków');
    errorAt('np 10 np 100000', 1, 10, 1);
  });
});
describe('geometria', () => {
  test('dom, czyść, pióro, zero', () => {
    expect(run('np 0').segments).toHaveLength(0);
    const r = run('np 10 pod dom opu pw 90 kolor "#ABCDEF" grubosc 5 np 20 czysc dom np 3');
    expect(r.error).toBeNull(); expect(r.segments).toHaveLength(2);
    expect(r.segments[0]).toEqual({ from: [20, 0, 0], to: [0, 0, 0], color: '#abcdef', width: 5 });
    expect(r.segments[1].to).toEqual([0, 3, 0]);
    errorAt('np 3 czysc np 2 np 1 / 0', 1, 20, 1);
  });
  test('orientacja przestrzenna', () => {
    expect(end('gora 90 np 10', '3d')).toEqual([0, 0, 10]);
    expect(end('pp 90 gora 90 np 10', '3d')).toEqual([10, 0, 0]);
    expect(end('pp 90 pw 90 np 10', '3d')).toEqual([0, 0, -10]);
    expect(end('pl 90 gora 90 np 10', '3d')).toEqual([-10, 0, 0]);
    for (const s of ['gora', 'dol', 'pp', 'pl']) expect(run(`np 1 ${s} 30`).segments).toHaveLength(0);
  });
  test('płaskie programy są identyczne w obu trybach', () => {
    for (const e of examples.filter(e => e.mode === '2d')) expect(run(e.source, '2d')).toEqual(run(e.source, '3d'));
  });
  test('wszystkie 13 standardowych programów', () => {
    expect(examples).toHaveLength(13);
    for (const e of examples) { const r = run(e.source, e.mode); expect(r.error, e.name).toBeNull(); expect(r.segments.length).toBeGreaterThan(0); }
    expect(run(examples[0].source).segments).toHaveLength(4);
    expect(run(examples[6].source).segments).toHaveLength(768);
  });
});
