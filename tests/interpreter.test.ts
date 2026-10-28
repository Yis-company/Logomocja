import { describe, expect, test } from 'bun:test';
import { diagnose, run, Session, type Mode } from '../src/lang';
import { EXAMPLES } from '../src/data/examples';

const seg = (source: string, mode: Mode = '2d') => run(source, mode);
const lastTo = (source: string, mode: Mode = '2d') => {
  const { segments } = run(source, mode);
  return segments.at(-1)?.to;
};

function errorOf(source: string, mode: Mode = '2d') {
  const result = run(source, mode);
  expect(result.error).not.toBeNull();
  return result.error!;
}

describe('lexical rules', () => {
  test('keywords and names ignore case', () => {
    expect(seg('NP 10 PW 90 Np 10').segments.length).toBe(2);
    expect(seg('Kolor "#16866A"').segments).toEqual([]);
  });

  test('accented and unaccented spellings are equivalent', () => {
    expect(seg('naprzód 10').segments).toEqual(seg('naprzod 10').segments);
    expect(seg('podnieś np 5 opuść np 5').segments).toEqual(seg('podnies np 5 opusc np 5').segments);
    expect(seg('grubość 4 np 5').segments[0].width).toBe(4);
  });

  test('a semicolon starts a comment to the end of the line', () => {
    const { segments, error } = seg('np 10 ; to jest komentarz np 99\nnp 5');
    expect(error).toBeNull();
    expect(segments.length).toBe(2);
  });

  test('numbers may be .5, 12.5 or 5.', () => {
    expect(lastTo('np .5')).toEqual([0, 0.5, 0]);
    expect(lastTo('np 12.5')).toEqual([0, 12.5, 0]);
    expect(lastTo('np 5.')).toEqual([0, 5, 0]);
  });

  test('exponent, hex, NaN and Infinity are errors', () => {
    for (const source of ['np 1e3', 'np 0x10', 'np NaN', 'np Infinity']) {
      expect(seg(source).segments).toEqual([]);
      expect(seg(source).error).not.toBeNull();
    }
    expect(errorOf('np 1e3').column).toBe(4);
  });

  test('colour literal is a quoted six-digit hex string, returned lower-case', () => {
    expect(seg('kolor "#ABCDEF" np 1').segments[0].color).toBe('#abcdef');
    expect(errorOf('kolor "#abc" np 1').message).toContain('#rrggbb');
    expect(errorOf('kolor 5 np 1').column).toBe(7);
    expect(errorOf('kolor "#16866g"').message).toContain('#rrggbb');
  });

  test('an unterminated string is an error', () => {
    expect(errorOf('kolor "#16866a').column).toBe(7);
  });

  test('characters outside the dialect are errors', () => {
    const error = errorOf('np 10 @');
    expect(error.line).toBe(1);
    expect(error.column).toBe(7);
  });
});

describe('expressions', () => {
  test('* and / bind tighter than + and -, left to right', () => {
    expect(lastTo('np 20 - 5 - 3')).toEqual([0, 12, 0]);
    expect(lastTo('np 2 + 3 * 4')).toEqual([0, 14, 0]);
    expect(lastTo('np 8 / 2 / 2')).toEqual([0, 2, 0]);
    expect(lastTo('np 2 * (3 + 4)')).toEqual([0, 14, 0]);
  });

  test('binary operator with whitespace on both sides or neither side', () => {
    expect(lastTo('np 10 - 5')).toEqual([0, 5, 0]);
    expect(lastTo('np 10-5')).toEqual([0, 5, 0]);
    expect(lastTo('np 10 -5')).toBeUndefined();
    expect(errorOf('np 10 -5').column).toBe(7);
    expect(errorOf('np 10- 5').column).toBe(6);
    expect(errorOf('np 10 *5').column).toBe(7);
  });

  test('a comparison does not follow the spacing rule', () => {
    const { error } = seg('niech x 1 jeśli x<2 [np 1] jeśli x>=1 [np 2]');
    expect(error).toBeNull();
  });

  test('unary signs stack and apply to any operand', () => {
    expect(lastTo('np -(3 - 5)')).toEqual([0, 2, 0]);
    expect(lastTo('np - -2')).toEqual([0, 2, 0]);
    expect(lastTo('np 10 * -2')).toEqual([0, -20, 0]);
    expect(lastTo('niech bok 4 np -bok')).toEqual([0, -4, 0]);
    const deep = 'np ' + '- '.repeat(5001) + '1';
    expect(seg(deep).error).toBeNull();
  });

  test('division by zero is a run-time error at the argument', () => {
    const result = seg('np 10\nnp 1/0');
    expect(result.error).toEqual({ message: 'Dzielenie przez zero.', line: 2, column: 4 });
    expect(result.segments.length).toBe(1);
  });

  test('a missing operand is reported at the command when the program ends', () => {
    expect(errorOf('np 10 +').column).toBe(1);
    expect(errorOf('np').column).toBe(1);
  });

  test('unbalanced parentheses are reported at the open parenthesis', () => {
    expect(errorOf('np (3 + 4').column).toBe(4);
    expect(errorOf('np 3)').column).toBe(5);
  });

  test('a non-finite result is a run-time error', () => {
    const big = '1' + '0'.repeat(100);
    const result = seg(`np ${big} * ${big} * ${big} * ${big} * ${big}`);
    expect(result.error?.message).toContain('skończoną');
    expect(result.error?.column).toBe(4);
  });
});

describe('turtle and drawing', () => {
  test('starts at the origin heading +Y with pen down, default colour and width', () => {
    const [s] = seg('np 10').segments;
    expect(s).toEqual({ from: [0, 0, 0], to: [0, 10, 0], color: '#16866a', width: 3 });
  });

  test('the aliases are equivalent', () => {
    const polish = 'powtorz 4 [np 50 pw 90]';
    const english = 'repeat 4 [fd 50 rt 90]';
    expect(seg(polish).segments).toEqual(seg(english).segments);
    expect(seg('ws 10').segments[0].to).toEqual([0, -10, 0]);
    expect(seg('back 10').segments[0].to).toEqual([0, -10, 0]);
  });

  test('pw turns right, lw turns left; the right vector follows the heading', () => {
    expect(lastTo('pw 90 np 10')).toEqual([10, 0, 0]);
    expect(lastTo('lw 90 np 10')).toEqual([-10, 0, 0]);
    expect(lastTo('pw -90 np 10')).toEqual([-10, 0, 0]);
    expect(lastTo('lw 45 np 10')![0]).toBeCloseTo(-10 * Math.SQRT1_2, 9);
  });

  test('a square closes exactly', () => {
    expect(lastTo('powtorz 4 [np 100 pw 90]')).toEqual([0, 0, 0]);
    expect(lastTo('powtorz 3 [np 120 pw 120]')![1]).toBeCloseTo(0, 9);
  });

  test('pen up moves without drawing, pen down resumes', () => {
    const { segments } = seg('pod np 10 opu np 10');
    expect(segments.length).toBe(1);
    expect(segments[0].from).toEqual([0, 10, 0]);
  });

  test('a move of zero draws nothing', () => {
    expect(seg('np 0 ws 0').segments).toEqual([]);
  });

  test('dom returns to the origin and the initial orientation, drawing if pen is down', () => {
    const { segments } = seg('pw 90 np 10 dom np 3');
    expect(segments.length).toBe(3);
    expect(segments[1]).toEqual({ from: [10, 0, 0], to: [0, 0, 0], color: '#16866a', width: 3 });
    expect(segments[2].to).toEqual([0, 3, 0]);
  });

  test('dom at the origin draws nothing and keeps pen state', () => {
    const { segments } = seg('pod dom np 2');
    expect(segments).toEqual([]);
  });

  test('czyść removes every drawn segment and changes nothing else', () => {
    const { segments } = seg('kolor "#c1763d" np 10 cs np 5');
    expect(segments.length).toBe(1);
    expect(segments[0]).toEqual({ from: [0, 10, 0], to: [0, 15, 0], color: '#c1763d', width: 3 });
  });

  test('colour and width persist until changed', () => {
    const { segments } = seg('kolor "#2b6fb3" grubosc 5 np 1 pw 90 np 1 kolor "#000000" np 1');
    expect(segments.map((s) => [s.color, s.width])).toEqual([
      ['#2b6fb3', 5],
      ['#2b6fb3', 5],
      ['#000000', 5],
    ]);
  });

  test('a width outside 1 to 12 or not an integer is a parse-time error', () => {
    const tooWide = seg('np 10 grubosc 13');
    expect(tooWide.segments).toEqual([]);
    expect(tooWide.error?.column).toBe(15);
    expect(seg('grubosc 2.5 np 1').error?.message).toContain('od 1 do 12');
    expect(seg('grubosc 0 np 1').error).not.toBeNull();
  });

  test('a width computed from a name is checked when executed', () => {
    const result = seg('np 10\nniech w 20\ngrubosc w\nnp 1');
    expect(result.segments.length).toBe(1);
    expect(result.error).toEqual({
      message: 'Grubość musi być liczbą całkowitą od 1 do 12.',
      line: 3,
      column: 9,
    });
  });

  test('coordinates are limited to 100 000 in each direction', () => {
    expect(seg('powtorz 1000 [np 100]').error).toBeNull();
    const result = seg('powtorz 1001 [np 100]');
    expect(result.error?.message).toContain('100 000');
    expect(result.segments.length).toBe(1000);
  });
});

describe('repeat and nrpowt', () => {
  test('a count of 0 runs nothing', () => {
    expect(seg('powtorz 0 [np 10]')).toEqual({ segments: [], error: null });
  });

  test('the count must be an integer from 0 to 10000 when written as a literal', () => {
    expect(seg('powtorz 10001 [np 1]').error?.column).toBe(9);
    expect(seg('powtorz 2.5 [np 1]').error).not.toBeNull();
    expect(seg('powtorz 10000 [pu]').error?.message).not.toContain('od 0 do');
  });

  test('nrpowt counts the iterations from 1', () => {
    expect(lastTo('powtorz 3 [np nrpowt]')).toEqual([0, 6, 0]);
    expect(seg('powtorz 3 [np nrpowt]').segments.map((s) => s.to[1])).toEqual([1, 3, 6]);
  });

  test('nrpowt refers to the innermost enclosing repeat', () => {
    const { segments } = seg('powtorz 2 [powtorz 2 [np nrpowt] pw 180]');
    expect(segments.map((s) => s.to[1])).toEqual([1, 3, 2, 0]);
  });

  test('nrpowt outside a repeat is a parse-time error', () => {
    expect(seg('np nrpowt').error?.message).toContain('nrpowt');
    expect(seg('oto f\n np nrpowt\njuz\npowtorz 2 [f]').error?.line).toBe(2);
  });

  test('a repeat count can come from a variable', () => {
    expect(seg('niech n 3\npowtorz n [np 1]').segments.length).toBe(3);
  });

  test('a run-time repeat count that is not an integer is reported at the argument', () => {
    const result = seg('niech n 2.5\npowtorz n [np 1]');
    expect(result.error).toEqual({
      message: 'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000.',
      line: 2,
      column: 9,
    });
  });
});

describe('variables', () => {
  test('niech assigns and reassigns a global', () => {
    expect(lastTo('niech x 5 np x niech x x * 2 np x')).toEqual([0, 15, 0]);
  });

  test('a name must be declared somewhere to be used', () => {
    const error = errorOf('np y');
    expect(error.column).toBe(4);
    expect(error.message).toContain('y');
  });

  test('a variable assigned only inside a procedure is not visible at top level', () => {
    expect(errorOf('oto f\n niech z 1\njuz\nf\nnp z').line).toBe(5);
  });

  test('reading a declared but unassigned variable is a run-time error at the argument', () => {
    const result = seg('oto f ma: a\n  np z\n  niech z 1\njuz\nf 1');
    expect(result.error).toEqual({ message: 'Zmienna „z” nie ma jeszcze wartości.', line: 2, column: 6 });
  });

  test('a local niech shadows a global for the rest of the call only', () => {
    const { segments, error } = seg(`niech x 5
oto f
  niech x 10
  np x
już
f
np x`);
    expect(error).toBeNull();
    expect(segments.map((s) => s.to[1])).toEqual([10, 15]);
  });

  test('a procedure reads globals', () => {
    expect(lastTo('niech g 7\noto f\n np g\njuz\nf')).toEqual([0, 7, 0]);
  });

  test('a parameter can be reassigned inside its procedure', () => {
    expect(lastTo('oto f ma: a\n niech a a + 1\n np a\njuz\nf 2')).toEqual([0, 3, 0]);
  });

  test('a variable may not share the name of a procedure', () => {
    expect(errorOf('oto f\njuz\nniech f 1').line).toBe(3);
  });

  test('a parameter may share the name of a procedure', () => {
    expect(lastTo('oto f ma: f\n np f\njuz\nf 3')).toEqual([0, 3, 0]);
  });
});

describe('conditionals', () => {
  test('jeśli runs its body only when the condition holds', () => {
    expect(seg('jeśli 0.1 + 0.2 = 0.3 [np 5]').segments).toEqual([]);
    expect(seg('jeśli 1 + 2 = 3 [np 5]').segments.length).toBe(1);
  });

  test('jeżeli picks the first or second body', () => {
    const source = `niech x 0
jeżeli x > 0 [np 1] [np 2]
niech x 1
jeżeli x > 0 [np 4] [np 8]`;
    expect(seg(source).segments.map((s) => s.to[1])).toEqual([2, 6]);
  });

  test('all six comparisons', () => {
    const body = (cond: string) => seg(`jeśli ${cond} [np 1]`).segments.length;
    expect(body('2 < 3')).toBe(1);
    expect(body('3 > 2')).toBe(1);
    expect(body('3 = 3')).toBe(1);
    expect(body('2 <= 2')).toBe(1);
    expect(body('2 >= 3')).toBe(0);
    expect(body('2 <> 3')).toBe(1);
  });

  test('a condition needs a comparison', () => {
    expect(errorOf('jeśli 1 [np 1]').column).toBe(9);
  });
});

describe('procedures', () => {
  test('the legacy header with :name parameters', () => {
    expect(lastTo('oto kwadrat :bok :kat\n powtorz 4 [np :bok pw :kat]\njuz\nkwadrat 10 90')).toEqual([0, 0, 0]);
    expect(lastTo('oto f :a\n np :a\njuz\nf 4')).toEqual([0, 4, 0]);
  });

  test('a comma-separated parameter list after ma:', () => {
    expect(lastTo('oto f ma: a, b\n np a np b\njuz\nf 2 3')).toEqual([0, 5, 0]);
  });

  test('calls take expressions as positional arguments', () => {
    expect(lastTo('oto f ma: a, b\n np a - b\njuz\nf 40 * 2 90')).toEqual([0, -10, 0]);
  });

  test('a procedure may be called before it is defined', () => {
    expect(seg('f 5\noto f ma: x\n np x\njuz').segments.length).toBe(1);
  });

  test('wrong argument count: missing argument is reported at the call', () => {
    const error = errorOf('oto f ma: a, b\n np a\njuz\nf 1');
    expect(error).toEqual({ message: error.message, line: 4, column: 1 });
    expect(error.message.length).toBeGreaterThan(0);
  });

  test('wrong argument count: extra argument is reported', () => {
    const error = errorOf('oto f ma: a\n np a\njuz\nf 1 2');
    expect(error.message).toContain('przyjmuje 1 argument');
    expect(error.column).toBe(5);
  });

  test('a definition inside a body is an error', () => {
    expect(errorOf('powtorz 2 [oto f\njuz]').message).toContain('wewnątrz');
    expect(errorOf('oto f\n oto g\n np 1\njuz\njuz').line).toBe(2);
  });

  test('a definition must start a line', () => {
    expect(errorOf('np 1 oto f\njuz').column).toBe(6);
  });

  test('a missing już is reported at the definition', () => {
    const error = errorOf('oto f\n np 1\n');
    expect(error).toEqual({ message: error.message, line: 1, column: 1 });
    expect(error.message).toContain('już');
  });

  test('już must stand alone on its line', () => {
    expect(errorOf('oto f\n np 1 już\njuz').line).toBe(2);
  });

  test('a procedure name may not be a reserved word', () => {
    expect(errorOf('oto np\n np 1\njuz').column).toBe(5);
  });

  test('a name may be defined only once', () => {
    expect(errorOf('oto f\njuz\noto f\njuz').line).toBe(3);
  });

  test('recursion works', () => {
    expect(lastTo('oto f ma: n\n jeśli n > 0 [np 1 f n - 1]\njuz\nf 5')).toEqual([0, 5, 0]);
  });

  test('stop ends the current call, and the caller carries on', () => {
    const { segments } = seg('oto f\n np 5\n stop\n np 7\njuz\nf np 1');
    expect(segments.map((s) => s.to[1])).toEqual([5, 6]);
  });

  test('stop inside a repeat ends the whole procedure call', () => {
    const { segments } = seg('oto f\n powtorz 5 [np 1 stop]\n np 100\njuz\nf');
    expect(segments.length).toBe(1);
  });

  test('stop at top level ends the program', () => {
    expect(seg('np 1 stop np 5').segments.length).toBe(1);
  });

  test('a conditional body that stops ends the procedure call', () => {
    const { segments } = seg('oto f ma: n\n jeśli n = 0 [stop]\n np 1\njuz\nf 0 np 1');
    expect(segments.length).toBe(1);
  });

  test('frames: 32 nested calls are allowed, 33 are not', () => {
    const define = 'oto f ma: n\n jeśli n > 0 [f n - 1]\njuz\n';
    expect(seg(`${define}f 31`).error).toBeNull();
    const error = seg(`${define}f 32`).error;
    expect(error?.message).toContain('32');
  });
});

describe('nesting and size limits', () => {
  test('bracket nesting may reach 32 levels but not 33', () => {
    const nest = (depth: number) => `${'powtorz 1 ['.repeat(depth)}np 1${']'.repeat(depth)}`;
    expect(seg(nest(32)).error).toBeNull();
    expect(seg(nest(33)).error?.message).toContain('nawiasów');
  });

  test('operations: 10 000 is allowed, one more is not', () => {
    // One repeat (1 operation) plus two per iteration: command and iteration end.
    expect(seg('powtorz 4999 [pw 0]').error).toBeNull();
    const result = seg('powtorz 5000 [pw 0]');
    expect(result.error?.message).toContain('10 000');
  });

  test('more than 10 000 tokens is an error', () => {
    const source = 'np 1 '.repeat(5001);
    expect(seg(source).error?.message).toContain('symboli');
  });

  test('more than 50 000 characters is an error', () => {
    const source = '; ' + 'x'.repeat(50_000);
    const error = seg(source).error;
    expect(error?.message).toContain('długi');
    expect(error?.line).toBe(1);
    expect(error?.column).toBe(50_001);
  });

  test('parentheses nested beyond the limit are an error, not a crash', () => {
    const source = `np ${'('.repeat(300)}1${')'.repeat(300)}`;
    expect(seg(source).error).not.toBeNull();
  });
});

describe('dimensions', () => {
  test('pitch and roll commands are errors in 2D mode, reported before anything is drawn', () => {
    const result = seg('np 10 gora 90', '2d');
    expect(result.segments).toEqual([]);
    expect(result.error).toEqual({ message: 'Polecenie „gora” działa tylko w trybie 3D.', line: 1, column: 7 });
    for (const word of ['dol 1', 'pp 1', 'pl 1', 'pitchup 1', 'rollleft 1']) {
      expect(seg(word, '2d').error).not.toBeNull();
    }
  });

  test('gora and dol tilt the heading up and down', () => {
    expect(lastTo('gora 90 np 10', '3d')).toEqual([0, 0, 10]);
    expect(lastTo('dol 90 np 10', '3d')).toEqual([0, 0, -10]);
    expect(lastTo('gora 30 np 10', '3d')![2]).toBeCloseTo(10 * Math.sin(Math.PI / 6), 9);
  });

  test('after gora 90 the turtle heads along its former up, and dol 90 brings it back', () => {
    expect(lastTo('gora 90 np 10 dol 90 np 10', '3d')).toEqual([0, 10, 10]);
  });

  test('pp rolls the up vector toward the right, leaving the heading alone', () => {
    // After pp 90 the up vector is the former right, so gora 90 heads along +X.
    expect(lastTo('pp 90 gora 90 np 10', '3d')).toEqual([10, 0, 0]);
    expect(lastTo('pl 90 gora 90 np 10', '3d')).toEqual([-10, 0, 0]);
  });

  test('a flat program draws the same segments in 2D and 3D', () => {
    const flat = `powtorz 6 [np 30 pw 60]
kolor "#c1763d"
pod np 5 opu np 5`;
    expect(seg(flat, '2d')).toEqual(seg(flat, '3d'));
  });

  test('every standard flat program matches in both modes', () => {
    for (const example of EXAMPLES.filter((e) => e.mode === '2d')) {
      expect(seg(example.source, '2d')).toEqual(seg(example.source, '3d'));
    }
  });

  test('the staircase climbs to the expected corner', () => {
    const schody = EXAMPLES.find((e) => e.name === 'schody')!;
    expect(seg(schody.source, '3d').segments.at(-1)?.to).toEqual([0, 210, 120]);
  });
});

describe('errors and positions', () => {
  test('an unknown command is reported at its position', () => {
    const error = errorOf('np 10\nfoo 3');
    expect(error).toEqual({ message: 'Nieznane polecenie „foo”.', line: 2, column: 1 });
  });

  test('an unclosed bracket is reported at the opening bracket', () => {
    expect(errorOf('powtorz 2 [np 1').column).toBe(11);
  });

  test('a stray closing bracket is reported at the bracket', () => {
    expect(errorOf('np 1 ]').column).toBe(6);
  });

  test('a stray value where a command is expected is reported at that value', () => {
    expect(errorOf('np 1 5').column).toBe(6);
  });

  test('a missing argument reported at the token found, e.g. a closing bracket', () => {
    expect(errorOf('powtorz 2 [np ]').column).toBe(15);
  });

  test('a parse-time error draws nothing', () => {
    const result = seg('np 10 np 10 np nope');
    expect(result.segments).toEqual([]);
    expect(result.error).not.toBeNull();
  });

  test('a run-time error keeps what was drawn before it', () => {
    const result = seg('np 10 np 10 pw 90 np 1/0');
    expect(result.segments.length).toBe(2);
    expect(result.error?.message).toBe('Dzielenie przez zero.');
  });

  test('a run-time error keeps the segments drawn after a czyść that ran', () => {
    const result = seg('np 10 cs np 1 np 1/0');
    expect(result.segments.length).toBe(1);
    expect(result.error).not.toBeNull();
  });

  test('diagnose reports the same first error as run, without running', () => {
    expect(diagnose('np 10\nfoo', '2d')).toEqual({ message: 'Nieznane polecenie „foo”.', line: 2, column: 1 });
    expect(diagnose('np 10', '2d')).toBeNull();
  });
});

describe('sessions', () => {
  test('steps run one statement at a time and report the next position', () => {
    const session = new Session('np 10\nnp 10\nnp 10', '2d');
    expect(session.position).toEqual({ line: 1, column: 1 });
    expect(session.segments.length).toBe(0);
    session.advance(1);
    expect(session.segments.length).toBe(1);
    expect(session.position).toEqual({ line: 2, column: 1 });
    session.advance(10);
    expect(session.status).toBe('finished');
    expect(session.segments.length).toBe(3);
    expect(session.position).toBeNull();
  });

  test('a session that fails at run time stops with the error', () => {
    const session = new Session('np 1\nnp 1/0\nnp 5', '2d');
    session.advance(100);
    expect(session.status).toBe('failed');
    expect(session.error?.line).toBe(2);
    expect(session.segments.length).toBe(1);
  });

  test('a session over a program with no statements finishes at once', () => {
    expect(new Session('; nic tu nie ma', '2d').status).toBe('finished');
  });
});
