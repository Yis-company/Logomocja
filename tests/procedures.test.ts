import { describe, expect, test } from 'bun:test';
import { ok, fails, failsAt, parseFails, parseFailsAt, closeSeg, dy } from './helpers';

const len = (src: string) => dy(ok(src));

describe('definitions and calls', () => {
  test('spec example: square', () => {
    const s = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90');
    expect(s.length).toBe(4);
    closeSeg(s[0], [0, 0, 0], [0, 80, 0]);
    closeSeg(s[1], [0, 80, 0], [80, 80, 0]);
    closeSeg(s[3], [80, 0, 0], [0, 0, 0]);
  });
  test('arguments are expressions: kwadrat 40 * 2 90', () => {
    const s = ok('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 40 * 2 90');
    expect(s.length).toBe(4);
    closeSeg(s[0], [0, 0, 0], [0, 80, 0]);
    closeSeg(s[1], [0, 80, 0], [80, 80, 0]);
  });
  test('legacy header with :params, referenced both ways', () => {
    expect(len('oto p :bok :kąt\nnp :bok\nnp bok\nnp kąt\njuż\np 3 4')).toEqual([3, 3, 4]);
  });
  test('ma: header params may be referenced as :name', () => {
    expect(len('oto p ma: a, b\nnp :a\nnp :b\njuż\np 3 4')).toEqual([3, 4]);
  });
  test('ma: params without spaces after comma', () => {
    expect(len('oto p ma: a,b\nnp a\nnp b\njuż\np 1 2')).toEqual([1, 2]);
  });
  test('procedure with no parameters', () => {
    expect(len('oto p\nnp 2\njuż\np p')).toEqual([2, 2]);
  });
  test('aliases to / end / juz', () => {
    expect(len('to p\nfd 2\nend\np')).toEqual([2]);
    expect(len('oto p\nnp 2\njuz\np')).toEqual([2]);
    expect(len('TO p\nnp 2\nEND\np')).toEqual([2]);
  });
  test('definition after use', () => {
    expect(len('p 5\noto p ma: d\nnp d\njuż')).toEqual([5]);
  });
  test('unary argument after a whitespace-separated value is a new argument', () => {
    expect(len('oto p ma: a, b\nnp a\nnp b\njuż\np 10 -5')).toEqual([10, -5]);
  });
  test('binary argument expression consumes the following value', () => {
    // `10 - 5` is one argument; the second one is missing at end of program
    parseFailsAt('oto p ma: a, b\nnp a\nnp b\njuż\np 10 - 5', 5, 1);
  });
  test('parenthesised arguments', () => {
    expect(len('oto p ma: a, b\nnp a\nnp b\njuż\np (1 + 1) (2 * 2)')).toEqual([2, 4]);
  });
  test('parameters as repeat counts and as arguments of other calls', () => {
    const src = 'oto a ma: n\nnp n\njuż\noto b ma: m\npowtorz m [a m * 2]\njuż\nb 3';
    expect(len(src)).toEqual([6, 6, 6]);
  });
  test('parameter may share its name with a procedure', () => {
    const src = 'oto a ma: b\nnp b\njuż\noto b ma: a\na a\njuż\nb 7';
    expect(len(src)).toEqual([7]);
  });
  test('procedure name in argument position is not a value', () => {
    parseFailsAt('oto p\nnp 1\njuż\nnp p', 4, 4);
  });
});

describe('arity', () => {
  const def = 'oto p ma: a, b\nnp a\nnp b\njuż\n';
  test('too few at end of program reported at the call', () => {
    parseFailsAt(def + 'np 1\np 1', 6, 1);
  });
  test('too few before a command reported at that command', () => {
    parseFailsAt(def + 'p 1\nnp 2', 6, 1);
  });
  test('too few before ] reported at ]', () => {
    parseFailsAt(def + 'powtorz 2 [p 1]', 5, 15);
  });
  test('too many: stray value reported at that value', () => {
    parseFailsAt(def + 'p 1 2 3', 5, 7);
  });
  test('zero-parameter procedure given an argument', () => {
    parseFailsAt('oto q\nnp 1\njuż\nq 5', 4, 3);
  });
  test('arity checked even when the definition comes after the call', () => {
    parseFailsAt('np 1\np 1 2 3\noto p ma: a, b\nnp a\njuż', 2, 7);
  });
});

describe('recursion', () => {
  test('direct recursion', () => {
    const src = 'oto spirala ma: n\njeśli n > 0 [np n pw 90 spirala n - 1]\njuż\nspirala 3';
    const s = ok(src);
    expect(s.length).toBe(3);
    closeSeg(s[0], [0, 0, 0], [0, 3, 0]);
    closeSeg(s[1], [0, 3, 0], [2, 3, 0]);
    closeSeg(s[2], [2, 3, 0], [2, 2, 0]);
  });
  test('mutual recursion', () => {
    const src = 'oto a ma: n\njeśli n > 0 [np 1 b n - 1]\njuż\noto b ma: n\njeśli n > 0 [np 2 a n - 1]\njuż\na 4';
    expect(len(src)).toEqual([1, 2, 1, 2]);
  });
  test('each call has its own locals', () => {
    const src = 'oto r ma: n\nniech x n * 10 + 1\njeśli n > 0 [r n - 1]\nnp x\njuż\nr 2';
    expect(len(src)).toEqual([1, 11, 21]);
  });
});

describe('stop', () => {
  test('ends the current call, caller continues', () => {
    expect(len('oto p\nnp 1\nstop\nnp 2\njuż\np\nnp 3')).toEqual([1, 3]);
  });
  test('only the innermost call ends', () => {
    expect(len('oto a\nnp 1\nb\nnp 3\njuż\noto b\nnp 2\nstop\nnp 9\njuż\na')).toEqual([1, 2, 3]);
  });
  test('inside repeat and conditional bodies it ends the whole call', () => {
    const src = 'oto p\npowtorz 5 [np 1 jeśli nrpowt = 2 [stop]]\nnp 100\njuż\npowtorz 2 [p np 10]';
    expect(len(src)).toEqual([1, 1, 10, 1, 1, 10]);
  });
  test('inside jeżeli body in a procedure', () => {
    expect(len('oto p ma: n\njeżeli n > 1 [stop] [np n]\nnp 5\njuż\np 2\np 1')).toEqual([1, 5]);
  });
  test('called from a repeat it does not stop the repeat', () => {
    expect(len('oto p\nnp 1\nstop\njuż\npowtorz 3 [p np 2]')).toEqual([1, 2, 1, 2, 1, 2]);
  });
});

describe('scoping', () => {
  test('local niech shadows global and is discarded', () => {
    expect(len('niech x 10\noto p\nniech x 20\nnp x\njuż\np\nnp x')).toEqual([20, 10]);
  });
  test('shadowing applies for the rest of the call only', () => {
    expect(len('niech x 10\noto p\nnp x\nniech x 20\nnp x\njuż\np\nnp x')).toEqual([10, 20, 10]);
  });
  test('procedure reads a global', () => {
    expect(len('niech g 7\noto p\nnp g\njuż\np')).toEqual([7]);
  });
  test('global assigned after definition but before call', () => {
    expect(len('oto p\nnp g\njuż\nniech g 5\np')).toEqual([5]);
  });
  test('global updated between calls', () => {
    expect(len('oto p\nnp g\njuż\nniech g 1\np\nniech g 2\np')).toEqual([1, 2]);
  });
  test('global assigned only after the call is unassigned at run time', () => {
    const r = failsAt('oto p\nnp g\njuż\nnp 1\np\nniech g 5', 2, 4);
    expect(r.segments.length).toBe(1);
  });
  test('parameter shadows a global', () => {
    expect(len('niech a 1\noto p :a\nnp a\njuż\np 5\nnp a')).toEqual([5, 1]);
  });
  test('parameter can be reassigned', () => {
    expect(len('oto p :a\nniech a a * 2\nnp a\njuż\np 5')).toEqual([10]);
  });
  test('locals of one procedure are not visible in another', () => {
    parseFailsAt('oto a\nniech y 5\nb\njuż\noto b\nnp y\njuż\na', 6, 4);
  });
  test('locals are not visible at top level', () => {
    parseFailsAt('oto a\nniech y 5\njuż\na\nnp y', 5, 4);
  });
  test('parameters are not visible at top level', () => {
    parseFailsAt('oto a ma: k\nnp k\njuż\na 1\nnp k', 5, 4);
  });
  test('locals are discarded when the call ends', () => {
    const src = 'oto p ma: first\njeśli first = 1 [niech v 5]\nnp v\njuż\np 1\np 0';
    const r = failsAt(src, 3, 4);
    expect(dy(r.segments)).toEqual([5]);
  });
  test('unassigned local is a run-time error', () => {
    const r = failsAt('oto p\nnp 10\nnp z\nniech z 1\njuż\np', 3, 4);
    expect(r.segments.length).toBe(1);
  });
  test('top-level niech inside repeat creates a global visible in procedures', () => {
    expect(len('oto p\nnp g\njuż\npowtorz 2 [niech g nrpowt]\np')).toEqual([2]);
  });
  test('niech inside procedure does not change the global', () => {
    expect(len('niech x 1\noto p\npowtorz 2 [niech x 9]\njuż\np\nnp x')).toEqual([1]);
  });
});

describe('definition errors', () => {
  test('a name may be defined once', () => {
    const r = parseFails('oto p\nnp 1\njuż\noto p\nnp 2\njuż\np');
    expect(r.error!.line).toBe(4);
  });
  test('duplicate definitions differing only in case', () => {
    const r = parseFails('oto p\nnp 1\njuż\noto P\nnp 2\njuż');
    expect(r.error!.line).toBe(4);
  });
  test('definition inside a repeat body', () => {
    parseFailsAt('np 1\npowtorz 2 [\noto p\nnp 1\njuż\n]', 3, 1);
  });
  test('definition inside a conditional body', () => {
    parseFailsAt('np 1\njeśli 1 = 1 [\noto p\nnp 1\njuż\n]', 3, 1);
  });
  test('definition inside another procedure', () => {
    parseFailsAt('np 1\noto a\noto b\nnp 1\njuż\njuż\na', 3, 1);
  });
  test('missing już', () => {
    parseFails('np 1\noto p\nnp 1\n');
    parseFails('np 1\noto p ma: a\nnp a');
  });
  test('już must be alone on its line', () => {
    parseFails('np 1\noto p\nnp 1 już\np');
  });
  test('oto must start a line', () => {
    parseFails('np 1 oto p\nnp 1\njuż');
  });
  test('procedure name may not be a command word', () => {
    const r = parseFails('np 1\noto np\nnp 1\njuż');
    expect(r.error!.line).toBe(2);
  });
  test('unknown command in a never-called procedure is a parse-time error', () => {
    parseFailsAt('np 1\noto p\n  np 10\n  foo\njuż', 4, 3);
  });
  test('run-time error inside a procedure keeps earlier drawing', () => {
    const r = failsAt('oto p ma: d\nnp 10 / d\njuż\np 2\np 0', 2, 4);
    expect(r.segments.length).toBe(1);
    closeSeg(r.segments[0], [0, 0, 0], [0, 5, 0]);
  });
  test('call of an undefined procedure', () => {
    parseFailsAt('np 1\nkwadrat 10', 2, 1);
  });
  test('header without a name', () => {
    fails('oto\nnp 1\njuż');
  });
});
