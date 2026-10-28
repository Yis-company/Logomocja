import { describe, expect, test } from 'bun:test';
import { Interpreter, compile, runSource, type Mode } from '../src/lang/index';

const flat = (src: string, mode: Mode = '2d') => runSource(src, mode);

function endOf(src: string, mode: Mode = '2d'): number[] {
  const { segments } = flat(src, mode);
  return segments.length ? segments[segments.length - 1]!.to : [0, 0, 0];
}

function errorOf(src: string, mode: Mode = '2d') {
  const { error } = flat(src, mode);
  expect(error).not.toBeNull();
  return error!;
}

describe('commands and aliases', () => {
  test('Polish, accented and English spellings are equivalent', () => {
    const a = flat('naprzód 10 pw 90 powtórz 2 [np 5]').segments;
    const b = flat('naprzod 10 prawo 90 powtorz 2 [fd 5]').segments;
    const c = flat('np 10 pw 90 powtorz 2 [np 5]').segments;
    expect(a).toEqual(b);
    expect(a).toEqual(c);
  });

  test('keywords and names ignore case', () => {
    expect(endOf('NP 10 PW 90 NP 10')).toEqual([10, 10, 0]);
    expect(endOf('Niech Bok 4\nPOWTORZ 2 [NP BOK]')).toEqual([0, 8, 0]);
  });

  test('a semicolon comments out the rest of the line', () => {
    expect(flat('np 10 ; to jest komentarz np 99\nnp 1').segments).toHaveLength(2);
  });

  test('turns are right-handed: pw turns clockwise seen from above', () => {
    expect(endOf('pw 90 np 10')).toEqual([10, 0, 0]);
    expect(endOf('lw 90 np 10')).toEqual([-10, 0, 0]);
  });

  test('pen up moves without drawing; pen down draws with current colour and width', () => {
    const { segments } = flat('kolor "#C1763D" grubosc 5 pod np 10 opu np 10');
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({ from: [0, 10, 0], to: [0, 20, 0], color: '#c1763d', width: 5 });
  });

  test('a move of zero draws nothing', () => {
    expect(flat('np 0 ws 0').segments).toHaveLength(0);
  });

  test('dom returns home, drawing back if the pen is down, and resets orientation only', () => {
    const r = flat('np 10 pw 90 np 10 dom np 5');
    expect(r.segments).toHaveLength(4);
    expect(r.segments[3]!.to).toEqual([0, 5, 0]);
  });

  test('cs forgets drawn segments but keeps the turtle where it is', () => {
    const r = flat('np 100 cs np 10');
    expect(r.segments).toHaveLength(1);
    expect(r.segments[0]!.from).toEqual([0, 100, 0]);
  });

  test('a flat program gives identical coordinates in 2D and 3D', () => {
    const src = 'powtorz 7 [np 13.5 pw 51 powtorz 3 [np 4 lw 17] ws 2]';
    expect(flat(src, '2d')).toEqual(flat(src, '3d'));
  });
});

describe('3D turtle', () => {
  test('gora makes the nose go to the former up', () => {
    expect(endOf('gora 90 np 10', '3d')).toEqual([0, 0, 10]);
    expect(endOf('dol 90 np 10', '3d')).toEqual([0, 0, -10]);
  });

  test('pp rolls the right side: after pp 90 the right is the former down', () => {
    const compiled = compile('pp 90', '3d');
    if (!compiled.ok) throw new Error('nie powinno się zdarzyć');
    const it = new Interpreter(compiled.program);
    it.runToEnd();
    expect(it.turtle.right.map((v) => Math.round(v))).toEqual([0, 0, -1]);
    expect(it.turtle.heading).toEqual([0, 1, 0]);
  });

  test('pitch and roll are errors in 2D', () => {
    const e = errorOf('np 1\ngora 90');
    expect(e.line).toBe(2);
    expect(e.column).toBe(1);
    expect(e.message).toContain('3D');
  });
});

describe('expressions', () => {
  test('precedence and left associativity', () => {
    expect(endOf('np 20 - 5 - 3')).toEqual([0, 12, 0]);
    expect(endOf('np 2 + 3 * 4')).toEqual([0, 14, 0]);
    expect(endOf('np 8 / 2 / 2')).toEqual([0, 2, 0]);
  });

  test('binary operators need whitespace on both sides or on neither', () => {
    expect(endOf('np 10-5')).toEqual([0, 5, 0]);
    expect(endOf('np 10 - 5')).toEqual([0, 5, 0]);
    const e = errorOf('np 10 -5');
    expect(e.column).toBe(7);
    expect(e.message).toContain('operator');
  });

  test('unary signs stack and apply to parentheses and names', () => {
    expect(endOf('np -(3 - 5)')).toEqual([0, 2, 0]);
    expect(endOf('np - -2')).toEqual([0, 2, 0]);
    expect(endOf('niech bok 2 np -bok')).toEqual([0, -2, 0]);
    expect(endOf('niech bok 2 np -:bok')).toEqual([0, -2, 0]);
  });

  test('comparisons are exact', () => {
    expect(flat('jeśli 0.1 + 0.2 = 0.3 [np 10]').segments).toHaveLength(0);
    expect(flat('jeśli 2 * 3 = 6 [np 10]').segments).toHaveLength(1);
  });

  test('numbers are unsigned literals; 1e3, 0x10, NaN and Infinity are errors', () => {
    expect(errorOf('np 1e3').message).toContain('e3');
    expect(errorOf('np 0x10').message).toContain('x10');
    expect(errorOf('np NaN').message).toContain('Nieznana nazwa');
    expect(errorOf('np Infinity').message).toContain('Nieznana nazwa');
    expect(endOf('np .5')).toEqual([0, 0.5, 0]);
  });

  test('division by zero is a run-time error at the first token of the argument', () => {
    const r = flat('np 5\nnp 1 + 2 / 0');
    expect(r.segments).toHaveLength(1);
    expect(r.error).toEqual({ message: 'Dzielenie przez zero.', line: 2, column: 4 });
  });
});

describe('variables', () => {
  test('a top-level variable may be used before its niech, but reading it early is a run-time error', () => {
    const r = flat('np 5\nnp x\nniech x 5');
    expect(r.segments).toHaveLength(1);
    expect(r.error).toEqual({ message: 'Zmienna „x” nie ma jeszcze wartości.', line: 2, column: 4 });
  });

  test('a name that is never assigned is a parse-time error and draws nothing', () => {
    const r = flat('np 10\nnp y');
    expect(r.segments).toHaveLength(0);
    expect(r.error?.line).toBe(2);
    expect(r.error?.message).toContain('Nieznana nazwa');
  });

  test('niech inside a procedure is local and does not leak to the top level', () => {
    const r = flat('niech x 5\noto p\n  niech x 1\n  np x\njuż\np\nnp x');
    expect(r.segments.map((s) => Math.round(s.to[1]))).toEqual([1, 6]);
  });

  test('a local shadows a global; reading it before its niech in that call is an error', () => {
    const r = flat('niech g 5\noto p\n  np g\n  niech g 2\njuż\np');
    expect(r.segments).toHaveLength(0);
    expect(r.error).toEqual({ message: 'Zmienna „g” nie ma jeszcze wartości.', line: 3, column: 6 });
  });

  test('variables are case-insensitive and may be reassigned from themselves', () => {
    expect(endOf('niech n 3\nniech N n + 1\nnp n')).toEqual([0, 4, 0]);
  });

  test('a parameter can be reassigned', () => {
    expect(endOf('oto p ma: a\n  niech a a * 2\n  np a\njuż\np 3')).toEqual([0, 6, 0]);
  });
});

describe('repeat, nrpowt, conditionals', () => {
  test('repeat runs its body n times; 0 runs nothing', () => {
    expect(flat('powtorz 0 [np 10]').segments).toHaveLength(0);
    expect(flat('powtorz 3 [np 10]').segments).toHaveLength(3);
  });

  test('nrpowt counts from 1 in the innermost repeat', () => {
    expect(endOf('powtorz 4 [np nrpowt]')).toEqual([0, 10, 0]);
    const r = flat('powtorz 2 [powtorz 3 [np nrpowt pw 0]]');
    expect(r.segments.map((s) => Math.round(s.to[1] - s.from[1]))).toEqual([1, 2, 3, 1, 2, 3]);
  });

  test('nrpowt outside a repeat is a parse-time error, even inside a procedure called from one', () => {
    expect(errorOf('np nrpowt').message).toContain('nrpowt');
    const e = errorOf('oto p\n  np nrpowt\njuż\npowtorz 2 [p]');
    expect(e.line).toBe(2);
    expect(e.column).toBe(6);
  });

  test('repeat counts and widths written as literals are checked at parse time', () => {
    expect(errorOf('powtorz 2.5 [np 1]').message).toContain('całkowitą');
    expect(errorOf('powtorz 10001 []').message).toContain('10000');
    expect(errorOf('grubosc 13').column).toBe(9);
    expect(errorOf('grubosc 0').message).toContain('1 do 12');
  });

  test('a width computed from a name is checked at run time and keeps what was drawn', () => {
    const r = flat('np 5\nniech w 13\ngrubosc w + 0\nnp 5');
    expect(r.segments).toHaveLength(1);
    expect(r.error).toEqual({ message: 'Grubość musi być liczbą całkowitą od 1 do 12 (podano 13).', line: 3, column: 9 });
  });

  test('jeśli and jeżeli choose the right body', () => {
    expect(endOf('niech x 1\njeżeli x = 1 [np 10] [np 20]')).toEqual([0, 10, 0]);
    expect(endOf('niech x 2\njeżeli x = 1 [np 10] [np 20]')).toEqual([0, 20, 0]);
    expect(endOf('niech x 2\njeśli x <> 2 [np 10]')).toEqual([0, 0, 0]);
  });

  test('comparisons do not need whitespace', () => {
    expect(flat('jeśli 1<2 [np 10]').segments).toHaveLength(1);
  });
});

describe('procedures', () => {
  test('parameters, legacy colon form and calls with expressions', () => {
    expect(endOf('oto k ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nk 40 * 2 90')).toEqual([0, 0, 0]);
    expect(flat('oto k ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nk 40 * 2 90').segments).toHaveLength(4);
    expect(flat('oto k :bok\n  np :bok\njuż\nk 7').segments[0]!.to).toEqual([0, 7, 0]);
  });

  test('definitions may come after their calls and names ignore case', () => {
    expect(flat('KW 5\nOTO kw ma: a\n  np a\njuż').segments).toHaveLength(1);
  });

  test('stop ends the procedure from inside a repeat, not the program', () => {
    const r = flat('oto t\n  powtorz 5 [np 1 stop]\njuż\nt\nnp 10');
    expect(r.segments).toHaveLength(2);
    expect(r.segments[1]!.to).toEqual([0, 11, 0]);
  });

  test('stop at top level ends the program', () => {
    expect(flat('np 1 stop np 5').segments).toHaveLength(1);
  });

  test('recursion works and is bounded by the frame limit', () => {
    const r = flat('oto f ma: n\n  jeśli n = 0 [stop]\n  np 1\n  f n - 1\njuż\nf 10');
    expect(r.segments).toHaveLength(10);
    const e = flat('oto f\n  f\njuż\nf');
    expect(e.error?.message).toContain('zagnieżdżonych');
  });

  test('wrong argument counts are reported at the right token', () => {
    const missing = errorOf('oto k ma: a, b\n  np a\njuż\nk 1');
    expect(missing).toMatchObject({ line: 4, column: 1 });
    const extra = errorOf('oto k ma: a\n  np a\njuż\nk 1 2');
    expect(extra).toMatchObject({ line: 4, column: 5 });
  });

  test('definitions are top-level only and must end with już', () => {
    expect(errorOf('powtorz 1 [\n oto k\n]').message).toContain('w bloku');
    expect(errorOf('oto k\n  np 1').message).toContain('już');
    expect(errorOf('już').message).toContain('oto');
  });

  test('a procedure name may be defined once and may not be a command word', () => {
    expect(errorOf('oto a\njuż\noto a\njuż').message).toContain('już zdefiniowana');
    expect(errorOf('oto np\njuż').message).toContain('polecenia');
  });

  test('a parameter may share its name with a procedure', () => {
    const r = flat('oto a\n  np 3\njuż\noto b ma: a\n  np a\njuż\nb 4');
    expect(r.error).toBeNull();
    expect(r.segments[0]!.to).toEqual([0, 4, 0]);
  });
});

describe('errors and limits', () => {
  test('a parse-time error draws nothing and points at the token', () => {
    const r = flat('np 10\nfoo');
    expect(r.segments).toHaveLength(0);
    expect(r.error).toEqual({ message: 'Nieznane polecenie „foo”.', line: 2, column: 1 });
  });

  test('unbalanced brackets are reported at the opening bracket', () => {
    expect(errorOf('powtorz 2 [np 10').column).toBe(11);
    expect(errorOf('np 10 ]').message).toContain(']');
  });

  test('unbalanced parentheses', () => {
    expect(errorOf('np (3 + 4').column).toBe(4);
  });

  test('a missing argument is reported where it should have started', () => {
    expect(errorOf('np ]').column).toBe(4);
    expect(errorOf('np').column).toBe(1);
  });

  test('colours must be quoted six-digit hex', () => {
    expect(errorOf('kolor "#abc"').column).toBe(7);
    expect(errorOf('kolor 16866a').column).toBe(7);
  });

  test('a run-time error keeps what was drawn', () => {
    const r = flat('np 10\nnp 10 + 1 / 0');
    expect(r.segments).toHaveLength(1);
    expect(r.error?.line).toBe(2);
  });

  test('operations are limited to 10000, counting repeat iterations', () => {
    expect(flat('powtorz 9999 []').error).toBeNull();
    expect(flat('powtorz 10000 []').error?.message).toContain('operacji');
  });

  test('coordinates beyond 100000 are an error', () => {
    const e = errorOf('powtorz 1 [np 100001]');
    expect(e.message).toContain('100000');
  });

  test('source length and token count are limited', () => {
    const long = 'np 1\n'.repeat(5001);
    expect(flat(long).error?.message).toContain('tokenów');
    const big = ' '.repeat(50001);
    expect(compile(big, '2d')).toMatchObject({ ok: false, error: { line: 1, column: 50001 } });
  });

  test('bracket nesting is limited to 32', () => {
    const deep = 'powtorz 1 ['.repeat(33) + ']'.repeat(33);
    expect(errorOf(deep).message).toContain('zagnieżdżenie');
    expect(flat('powtorz 1 ['.repeat(32) + ']'.repeat(32)).error).toBeNull();
  });
});
