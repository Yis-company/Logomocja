import { describe, expect, test } from 'bun:test';
import { run2, run3 } from './helpers';
import { LIMITS } from '../src/lang';

describe('limity', () => {
  test('50 000 znaków: dokładnie tyle jest dozwolone, więcej to błąd', () => {
    const base = 'np 1 ';
    const ok = ';'.repeat(LIMITS.maxChars);
    expect(run2(ok).error).toBeNull();
    const tooLong = ok + ';';
    const r = run2(tooLong);
    expect(r.error).not.toBeNull();
    expect(r.error!.line).toBe(1);
    expect(r.error!.column).toBe(LIMITS.maxChars + 1);
    expect(r.segments).toEqual([]);
    // wiele wierszy
    const lines = ('; komentarz ........................\n').repeat(2000);
    expect(lines.length).toBeGreaterThan(LIMITS.maxChars);
    const rl = run2(lines);
    expect(rl.error).not.toBeNull();
    expect(rl.error!.line).toBeGreaterThan(1);
    void base;
  });

  test('10 000 symboli: operatory, nawiasy i przecinki też się liczą', () => {
    expect(run2('pod '.repeat(10_000)).error).toBeNull();
    const r = run2('pod '.repeat(10_000) + 'pod');
    expect(r.error).not.toBeNull();
    expect(r.error!.line).toBe(1);
    expect(r.error!.column).toBe(10_000 * 4 + 1);
    expect(r.segments).toEqual([]);
    // 5000 × "np 1" to 10 000 symboli
    expect(run2('niech x 1\n' + 'x '.repeat(0) + 'pod\n'.repeat(9_997)).error).toBeNull();
    // 4 999 × "np" + liczba = 9 998 symboli, a operator i nawiasy też są symbolami
    const exprTokens = 'np ' + '(1)+'.repeat(2_000) + '(1)';
    expect(exprTokens.split(/(?=[()+])|(?<=[()+])|\s+/).filter(Boolean).length).toBeLessThan(10_000);
    expect(run2(exprTokens).segments[0]!.to[1]).toBe(2_001);
    const tooMany = run2('np ' + '(1)+'.repeat(2_600) + '(1)');
    expect(tooMany.error!.message).toContain('limit');
  });

  test('zagnieżdżenie nawiasów [ ] do 32', () => {
    const nest = (n: number) => 'powtorz 1 ['.repeat(n) + 'pod' + ']'.repeat(n);
    expect(run2(nest(32)).error).toBeNull();
    const r = run2(nest(33));
    expect(r.error).not.toBeNull();
    expect(r.error!.column).toBe(32 * 'powtorz 1 ['.length + 'powtorz 1 '.length + 1);
    expect(r.segments).toEqual([]);
    const cond = (n: number) => 'jeśli 1 = 1 ['.repeat(n) + 'pod' + ']'.repeat(n);
    expect(run2(cond(32)).error).toBeNull();
    expect(run2(cond(33)).error).not.toBeNull();
  });

  test('zagnieżdżone nawiasy okrągłe nie przewracają stosu', () => {
    // głębokość nawiasów okrągłych ogranicza tylko limit 10 000 symboli (2 × 4 900 + 2 = 9 802)
    const deep = run2('np ' + '('.repeat(4900) + '1' + ')'.repeat(4900));
    expect(deep.error).toBeNull();
    expect(deep.segments[0]!.to[1]).toBe(1);
    expect(run2('np ' + '('.repeat(100) + '1' + ')'.repeat(100)).segments[0]!.to[1]).toBe(1);
    const unclosed = run2('np ' + '('.repeat(3000) + '1' + ')'.repeat(2999));
    expect(unclosed.error!.column).toBe(4); // niedomknięty jest najbardziej zewnętrzny nawias
    expect(run2('np ' + '(-'.repeat(2000) + '1' + ')'.repeat(2000)).segments[0]!.to[1]).toBe(1);
    const long = run2('np ' + '1 + '.repeat(4000) + '1');
    expect(long.segments[0]!.to[1]).toBe(4001);
    const unary = run2('np ' + '- '.repeat(4001) + '1');
    expect(unary.segments[0]!.to[1]).toBe(-1);
  });

  test('32 aktywne ramki: wywołania i powtórzenia razem', () => {
    const rec = (limit: number) => `oto r ma: n\n jeśli n > ${limit} [stop]\n r n + 1\njuż\nr 1`;
    // r(1)..r(k) aktywne jednocześnie; k ramek
    expect(run2(rec(31)).error).toBeNull(); // r(1)…r(32): dokładnie 32 aktywne ramki
    const over = run2(rec(32)); // r(33) byłoby 33. ramką
    expect(over.error).not.toBeNull();
    expect(over.error!.message).toContain('32');
    expect(over.error!.line).toBe(3);
    const mixed = 'oto r ma: n\n jeśli n > 40 [stop]\n powtorz 1 [r n + 1]\njuż\nr 1';
    const m = run2(mixed);
    expect(m.error).not.toBeNull(); // wywołanie + powtórzenie = 2 ramki na poziom
    const inf = run2('oto r\n r\njuż\nnp 5\nr');
    expect(inf.error).not.toBeNull();
    expect(inf.segments.length).toBe(1); // błąd wykonania zachowuje rysunek
  });

  test('zagnieżdżone powtórzenia liczą się do 32 ramek', () => {
    const nest = (n: number) => 'powtorz 1 ['.repeat(n) + 'pod' + ']'.repeat(n);
    expect(run2(nest(32)).error).toBeNull();
  });

  test('10 000 wykonanych operacji: każda iteracja i wywołanie liczą się dodatkowo', () => {
    // powtórz: 1 + n×(ciało + 1)
    expect(run2('powtorz 4999 [pod]').error).toBeNull(); // 1 + 4999×2 = 9999
    expect(run2('powtorz 5000 [pod]').error).not.toBeNull(); // 10001
    expect(run2('pod powtorz 4999 [pod]').error).toBeNull(); // 10000 dokładnie? 1+1+4999*2 = 10000
    expect(run2('pod pod powtorz 4999 [pod]').error).not.toBeNull();
    const r = run2('powtorz 5000 [np 1 pod]');
    expect(r.error).not.toBeNull();
    expect(r.error!.message).toContain('10');
    expect(r.segments.length).toBeGreaterThan(0); // zachowane po błędzie
  });

  test('wywołanie procedury: 1 + 1 operacji + ciało', () => {
    const src = (n: number) => `oto f\n pod\njuż\npowtorz ${n} [f]`;
    // powtórz 1 + n×(wywołanie 1 + pod 1 + koniec wywołania 1 + koniec iteracji 1) = 1 + 4n
    expect(run2(src(2499)).error).toBeNull(); // 9997
    expect(run2(src(2500)).error).not.toBeNull(); // 10001
  });

  test('jeśli: 1 operacja + 1 za zakończone ciało (tylko gdy wykonano)', () => {
    // powtórz 1 + n×(jeśli 1 + ciało pod 1 + koniec ciała 1 + koniec iteracji 1) = 1 + 4n
    expect(run2('powtorz 2499 [jeśli 1 = 1 [pod]]').error).toBeNull();
    expect(run2('powtorz 2500 [jeśli 1 = 1 [pod]]').error).not.toBeNull();
    // gdy warunek nie jest spełniony: 1 + n×(1 + 1) = 1 + 2n
    expect(run2('powtorz 4999 [jeśli 1 = 2 [pod]]').error).toBeNull();
    expect(run2('powtorz 5000 [jeśli 1 = 2 [pod]]').error).not.toBeNull();
  });

  test('współrzędne w zakresie ±100 000', () => {
    expect(run2('np 100000').error).toBeNull();
    expect(run2('np 100000').segments[0]!.to).toEqual([0, 100000, 0]);
    const r = run2('np 5 np 100000');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBe(1);
    expect(run2('ws 100001').error).not.toBeNull();
    expect(run2('pod np 100001').error).not.toBeNull(); // także z uniesionym piórem
    expect(run2('pw 90 np 100000 ws 200000').error).toBeNull();
    expect(run3('gora 90 np 100001').error).not.toBeNull();
    expect(run3('gora 90 np 100000').error).toBeNull();
  });

  test('wyrażenia nie są operacjami', () => {
    // 1 + n×(np + koniec iteracji) przy dowolnie długim wyrażeniu
    expect(run2('powtorz 4999 [pod]').error).toBeNull();
    const heavy = 'powtorz 100 [np ' + '1 + '.repeat(500) + '1]';
    expect(run2(heavy).error).toBeNull();
  });
});
