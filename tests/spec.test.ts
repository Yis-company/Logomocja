// Spec-conformance tests for the Logomocja interpreter.
// Every expected value below is derived from /tmp/logomocja-spec.md, not from the implementation.
import { describe, test, expect } from 'bun:test';
import { runPublic } from '../src/lang/index';
import { EXAMPLES } from '../src/content/examples';

type Mode = '2d' | '3d';
type V3 = [number, number, number];
interface Seg { from: V3; to: V3; color: string; width: number }
type Result = ReturnType<typeof runPublic>;

const EPS = 1e-9;
const DEF_COLOR = '#16866a';
const DEF_WIDTH = 3;

const run = (src: string, mode: Mode = '2d'): Result => runPublic(src, mode);

function v(p: number[]): V3 {
  return [p[0], p[1], p.length > 2 ? p[2] : 0];
}
/** Builds an expected segment; 2D points may omit z. */
function S(from: number[], to: number[], color = DEF_COLOR, width = DEF_WIDTH): Seg {
  return { from: v(from), to: v(to), color, width };
}
/** Builds a connected polyline of segments through the given points. */
function path(points: number[][], color = DEF_COLOR, width = DEF_WIDTH): Seg[] {
  const out: Seg[] = [];
  for (let i = 1; i < points.length; i++) out.push(S(points[i - 1], points[i], color, width));
  return out;
}

function near(a: number, b: number): boolean {
  return Math.abs(a - b) <= EPS;
}
function segNear(a: Seg, b: Seg): boolean {
  return a.color === b.color && a.width === b.width
    && a.from.length === 3 && a.to.length === 3
    && [0, 1, 2].every((i) => near(a.from[i], b.from[i]) && near(a.to[i], b.to[i]));
}
const r9 = (x: number) => {
  const y = Math.round(x * 1e9) / 1e9;
  return y === 0 ? 0 : y;
};
const roundSeg = (s: Seg) => ({ from: s.from.map(r9), to: s.to.map(r9), color: s.color, width: s.width });

function expectSegs(actual: Seg[], expected: Seg[]): void {
  const same = actual.length === expected.length && actual.every((s, i) => segNear(s, expected[i]));
  if (!same) expect(actual.map(roundSeg)).toEqual(expected.map(roundSeg));
}

/** Runs a program that must succeed and returns its segments. */
function ok(src: string, mode: Mode = '2d'): Seg[] {
  const r = run(src, mode);
  expect(r.error).toBeNull();
  return r.segments as Seg[];
}
function okSegs(src: string, expected: Seg[], mode: Mode = '2d'): void {
  expectSegs(ok(src, mode), expected);
}

function pos(r: Result) {
  return r.error ? { line: r.error.line, column: r.error.column } : null;
}

/**
 * Asserts a parse-time error: nothing drawn, error at (line, column) when given.
 * The program is also run after a drawing line, to prove nothing is drawn even then.
 */
function parseErr(src: string, line: number | null = null, column: number | null = null, mode: Mode = '2d'): void {
  const r = run(src, mode);
  expect(r.error).not.toBeNull();
  expect(typeof r.error!.message).toBe('string');
  expect(r.error!.message.length).toBeGreaterThan(0);
  expect(r.segments).toEqual([]);
  if (line !== null) expect(pos(r)).toEqual({ line, column: column! });
  const r2 = run('np 1 opu\n' + src, mode);
  expect(r2.error).not.toBeNull();
  expect(r2.segments).toEqual([]);
  if (line !== null) expect(pos(r2)).toEqual({ line: line + 1, column: column! });
}

/** Asserts a run-time error at (line, column) when given, keeping the expected segments. */
function runErr(src: string, line: number | null, column: number | null, expected: Seg[], mode: Mode = '2d'): void {
  const r = run(src, mode);
  expect(r.error).not.toBeNull();
  expect(r.error!.message.length).toBeGreaterThan(0);
  if (line !== null) expect(pos(r)).toEqual({ line, column: column! });
  expectSegs(r.segments as Seg[], expected);
}

function caseVariants(w: string): string[] {
  const chars = [...w];
  const alt1 = chars.map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join('');
  const alt2 = chars.map((c, i) => (i % 2 ? c.toLowerCase() : c.toUpperCase())).join('');
  return [...new Set([w, w.toUpperCase(), alt1, alt2])];
}

// ----------------------------------------------------------------------------
// Reference 3D turtle (Rodrigues rotations) used to compute expected values.
// ----------------------------------------------------------------------------
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function rot(vec: V3, k: V3, deg: number): V3 {
  const t = (deg * Math.PI) / 180;
  const c = Math.cos(t);
  const s = Math.sin(t);
  const kv = cross(k, vec);
  const kd = dot(k, vec);
  return [0, 1, 2].map((i) => vec[i] * c + kv[i] * s + k[i] * kd * (1 - c)) as V3;
}
class RefTurtle {
  p: V3 = [0, 0, 0];
  h: V3 = [0, 1, 0];
  r: V3 = [1, 0, 0];
  u: V3 = [0, 0, 1];
  segs: Seg[] = [];
  fd(d: number) {
    const n = add(this.p, scale(this.h, d));
    if (d !== 0) this.segs.push({ from: this.p, to: n, color: DEF_COLOR, width: DEF_WIDTH });
    this.p = n;
  }
  // pw: heading towards right, around up (clockwise seen from above = negative angle about up)
  rt(a: number) { this.h = rot(this.h, this.u, -a); this.r = rot(this.r, this.u, -a); }
  // gora: heading towards up, around right (positive angle about right takes h to u)
  up(a: number) { this.h = rot(this.h, this.r, a); this.u = rot(this.u, this.r, a); }
  // pp: up towards right, around heading (positive angle about h takes u to r)
  rr(a: number) { this.u = rot(this.u, this.h, a); this.r = rot(this.r, this.h, a); }
  apply(cmd: string, x: number) {
    switch (cmd) {
      case 'np': this.fd(x); break;
      case 'ws': this.fd(-x); break;
      case 'pw': this.rt(x); break;
      case 'lw': this.rt(-x); break;
      case 'gora': this.up(x); break;
      case 'dol': this.up(-x); break;
      case 'pp': this.rr(x); break;
      case 'pl': this.rr(-x); break;
      default: throw new Error(cmd);
    }
  }
}

/** Orientation (heading, right, up) of the turtle after `prefix`, measured through drawn segments (3D). */
function orientation(prefix: string): { h: V3; r: V3; u: V3; p: V3 } {
  const probe = (suffix: string) => {
    const segs = ok(`${prefix}\nopu ${suffix} np 1`, '3d');
    const s = segs[segs.length - 1];
    return { from: s.from as V3, d: [s.to[0] - s.from[0], s.to[1] - s.from[1], s.to[2] - s.from[2]] as V3 };
  };
  const a = probe('');
  const b = probe('pw 90');
  const c = probe('gora 90');
  return { h: a.d, r: b.d, u: c.d, p: a.from };
}
function expectVec(actual: number[], expected: number[]) {
  const same = [0, 1, 2].every((i) => near(actual[i], expected[i]));
  if (!same) expect(actual.map(r9)).toEqual(expected.map(r9));
}

// ============================================================================
// Command aliases
// ============================================================================
const ALIASES = {
  fd: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  bk: ['ws', 'wstecz', 'bk', 'back'],
  rt: ['pw', 'prawo', 'rt', 'right'],
  lt: ['lw', 'lewo', 'lt', 'left'],
  pu: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  pd: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  color: ['kolor', 'color'],
  width: ['grubosc', 'grubość', 'width'],
  repeat: ['powtorz', 'powtórz', 'repeat'],
  let: ['niech', 'let'],
  if: ['jeśli', 'jesli', 'if'],
  ifelse: ['jeżeli', 'jezeli', 'ifelse'],
  stop: ['stop'],
  home: ['dom', 'home'],
  cs: ['czyść', 'czysc', 'cs', 'clearscreen'],
  up: ['gora', 'góra', 'pitchup'],
  down: ['dol', 'dół', 'pitchdown'],
  rr: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rl: ['pl', 'przechyllewo', 'rl', 'rollleft'],
  repcount: ['nrpowt', 'repcount'],
  to: ['oto', 'to'],
  end: ['już', 'juz', 'end'],
} as const;

const ALIAS_CASES: { group: keyof typeof ALIASES; mode: Mode; prog: (w: string) => string; expected: Seg[] }[] = [
  { group: 'fd', mode: '2d', prog: (w) => `${w} 10`, expected: [S([0, 0], [0, 10])] },
  { group: 'bk', mode: '2d', prog: (w) => `${w} 10`, expected: [S([0, 0], [0, -10])] },
  { group: 'rt', mode: '2d', prog: (w) => `${w} 90 np 10`, expected: [S([0, 0], [10, 0])] },
  { group: 'lt', mode: '2d', prog: (w) => `${w} 90 np 10`, expected: [S([0, 0], [-10, 0])] },
  { group: 'pu', mode: '2d', prog: (w) => `np 10 ${w} np 10`, expected: [S([0, 0], [0, 10])] },
  { group: 'pd', mode: '2d', prog: (w) => `pod np 10 ${w} np 10`, expected: [S([0, 10], [0, 20])] },
  { group: 'color', mode: '2d', prog: (w) => `${w} "#ABCDEF" np 10`, expected: [S([0, 0], [0, 10], '#abcdef')] },
  { group: 'width', mode: '2d', prog: (w) => `${w} 7 np 10`, expected: [S([0, 0], [0, 10], DEF_COLOR, 7)] },
  { group: 'repeat', mode: '2d', prog: (w) => `${w} 3 [np 10 pw 90]`, expected: path([[0, 0], [0, 10], [10, 10], [10, 0]]) },
  { group: 'let', mode: '2d', prog: (w) => `${w} bok 15 np bok`, expected: [S([0, 0], [0, 15])] },
  { group: 'if', mode: '2d', prog: (w) => `${w} 1 < 2 [np 10] ${w} 2 < 1 [np 20]`, expected: [S([0, 0], [0, 10])] },
  {
    group: 'ifelse', mode: '2d',
    prog: (w) => `${w} 1 > 2 [np 10] [np 20] ${w} 1 < 2 [pw 90 np 5] [np 30]`,
    expected: path([[0, 0], [0, 20], [5, 20]]),
  },
  { group: 'stop', mode: '2d', prog: (w) => `np 10 ${w} np 10`, expected: [S([0, 0], [0, 10])] },
  { group: 'home', mode: '2d', prog: (w) => `np 10 pw 90 np 10 ${w} np 5`, expected: [...path([[0, 0], [0, 10], [10, 10], [0, 0]]), S([0, 0], [0, 5])] },
  { group: 'cs', mode: '2d', prog: (w) => `np 10 ${w} np 5`, expected: [S([0, 10], [0, 15])] },
  { group: 'up', mode: '3d', prog: (w) => `${w} 90 np 10`, expected: [S([0, 0, 0], [0, 0, 10])] },
  { group: 'down', mode: '3d', prog: (w) => `${w} 90 np 10`, expected: [S([0, 0, 0], [0, 0, -10])] },
  { group: 'rr', mode: '3d', prog: (w) => `${w} 90 pw 90 np 10`, expected: [S([0, 0, 0], [0, 0, -10])] },
  { group: 'rl', mode: '3d', prog: (w) => `${w} 90 pw 90 np 10`, expected: [S([0, 0, 0], [0, 0, 10])] },
  { group: 'repcount', mode: '2d', prog: (w) => `powtorz 3 [np ${w}]`, expected: path([[0, 0], [0, 1], [0, 3], [0, 6]]) },
  { group: 'to', mode: '2d', prog: (w) => `${w} kw ma: a\nnp a\njuż\nkw 10`, expected: [S([0, 0], [0, 10])] },
  { group: 'end', mode: '2d', prog: (w) => `oto kw ma: a\nnp a\n${w}\nkw 10`, expected: [S([0, 0], [0, 10])] },
];

describe('command aliases (Polish/English, accented/unaccented, mixed case)', () => {
  for (const c of ALIAS_CASES) {
    for (const alias of ALIASES[c.group]) {
      for (const w of caseVariants(alias)) {
        test(`${c.group}: ${w}`, () => okSegs(c.prog(w), c.expected, c.mode));
      }
    }
  }

  test('ma: is case-insensitive in headers', () => okSegs('oto kw MA: a\nnp a\njuż\nkw 10', [S([0, 0], [0, 10])]));

  test('3D commands in 3D mode under every alias are equivalent', () => {
    for (const w of [...ALIASES.up, ...ALIASES.down, ...ALIASES.rr, ...ALIASES.rl]) ok(`${w} 30 np 1`, '3d');
  });

  describe('pitch and roll commands are parse-time errors in 2D, at the command', () => {
    for (const w of [...ALIASES.up, ...ALIASES.down, ...ALIASES.rr, ...ALIASES.rl]) {
      for (const x of caseVariants(w)) {
        test(x, () => parseErr(`np 10 ${x} 90`, 1, 7, '2d'));
      }
    }
  });
});

// ============================================================================
// Number lexing
// ============================================================================
describe('numbers', () => {
  test('80', () => okSegs('np 80', [S([0, 0], [0, 80])]));
  test('12.5', () => okSegs('np 12.5', [S([0, 0], [0, 12.5])]));
  test('.5', () => okSegs('np .5', [S([0, 0], [0, 0.5])]));
  test('0.25', () => okSegs('np 0.25', [S([0, 0], [0, 0.25])]));
  test('leading zeros are decimal: 007', () => okSegs('np 007', [S([0, 0], [0, 7])]));
  test('a sign is an operator: np -5', () => okSegs('np -5', [S([0, 0], [0, -5])]));
  test('a sign is an operator: np +5', () => okSegs('np +5', [S([0, 0], [0, 5])]));

  for (const bad of ['1e3', '1E3', '1e-3', '0x10', '1.2.3', '12a', '1_0', '.', '..5']) {
    test(`invalid number ${bad} is an error at the literal`, () => parseErr(`np ${bad}`, 1, 4));
  }
  for (const bad of ['NaN', 'Infinity', 'nan', 'infinity']) {
    test(`${bad} is not a number`, () => parseErr(`np ${bad}`, 1, 4));
  }
  test('1,5 is not a number (comma is a stray token)', () => parseErr('np 1,5', 1, 5));

  // Ambiguous: the spec lists `80`, `12.5`, `.5`; it does not say whether a trailing dot (`5.`) is valid.
  // The implementation rejects it.
  test.skip('AMBIGUOUS: trailing-dot literal 5.', () => {});
});

// ============================================================================
// Operator precedence and associativity
// ============================================================================
describe('precedence and associativity', () => {
  const cases: [string, number][] = [
    ['20 - 5 - 3', 12],
    ['2 + 3 * 4', 14],
    ['100 / 10 / 2', 5],
    ['8 / 4 * 2', 4],
    ['2 - 3 + 4', 3],
    ['2 * 3 + 4 * 5', 26],
    ['(2 + 3) * 4', 20],
    ['20 - (5 - 3)', 18],
    ['10-2*3', 4],
    ['2*3-4/2', 4],
    ['-2 * -3', 6],
    ['- 2 + 5', 3],
    ['-2 + 5', 3],
    ['2 * -3 + 10', 4],
    ['2 - -3 * 2', 8],
    ['((((7))))', 7],
    ['3 * (2 + (4 - 1)) / 5', 3],
    ['1 + 2 - 3 + 4 - 5 + 6', 5],
    ['64 / 4 / 2 / 2', 4],
  ];
  for (const [e, val] of cases) {
    test(`np ${e} moves ${val}`, () => okSegs(`np ${e}`, [S([0, 0], [0, val])]));
  }
});

// ============================================================================
// Whitespace rule for binary operators
// ============================================================================
describe('whitespace rule for binary operators', () => {
  const ops: [string, number][] = [['+', 15], ['-', 5], ['*', 50], ['/', 2]];
  for (const [op, val] of ops) {
    test(`np 10 ${op} 5 (both sides)`, () => okSegs(`np 10 ${op} 5`, [S([0, 0], [0, val])]));
    test(`np 10${op}5 (neither side)`, () => okSegs(`np 10${op}5`, [S([0, 0], [0, val])]));
    test(`np 10 ${op}5 (left only) is np 10 then a stray token, error at the operator`, () => parseErr(`np 10 ${op}5`, 1, 7));
    test(`np 10${op} 5 (right only) is an error at the operator`, () => parseErr(`np 10${op} 5`, 1, 6));
    test(`inside parentheses: np (10 ${op} 5) and np (10${op}5)`, () => {
      okSegs(`np (10 ${op} 5)`, [S([0, 0], [0, val])]);
      okSegs(`np (10${op}5)`, [S([0, 0], [0, val])]);
    });
    test(`inside parentheses: np (10 ${op}5) is an error`, () => parseErr(`np (10 ${op}5)`));
    test(`inside parentheses: np (10${op} 5) is an error`, () => parseErr(`np (10${op} 5)`));
    test(`after a parenthesis: np (10) ${op}5 is an error at the operator`, () => parseErr(`np (10) ${op}5`, 1, 9));
    test(`newline counts as whitespace: np 10\\n${op} 5`, () => okSegs(`np 10\n${op} 5`, [S([0, 0], [0, val])]));
  }

  const P2 = 'oto p ma: a, b\nnp a\npw 90\nnp b\njuż\n';
  test('procedure arguments: p 10 -5 passes two arguments (10, -5)', () => okSegs(`${P2}p 10 -5`, path([[0, 0], [0, 10], [-5, 10]])));
  test('procedure arguments: p 10 +5 passes two arguments (10, 5)', () => okSegs(`${P2}p 10 +5`, path([[0, 0], [0, 10], [5, 10]])));
  test('procedure arguments: p 10-5 3 passes (5, 3)', () => okSegs(`${P2}p 10-5 3`, path([[0, 0], [0, 5], [3, 5]])));
  test('procedure arguments: p 10 * 2 3 passes (20, 3)', () => okSegs(`${P2}p 10 * 2 3`, path([[0, 0], [0, 20], [3, 20]])));
  test('procedure arguments: p 10 / 2 3 passes (5, 3)', () => okSegs(`${P2}p 10 / 2 3`, path([[0, 0], [0, 5], [3, 5]])));
  test('procedure arguments: p (10) -5 passes (10, -5)', () => okSegs(`${P2}p (10) -5`, path([[0, 0], [0, 10], [-5, 10]])));
  test('procedure arguments: p 10 -(5) passes (10, -5)', () => okSegs(`${P2}p 10 -(5)`, path([[0, 0], [0, 10], [-5, 10]])));
  test('procedure arguments: p 10 - 5 is one argument; missing second reported at the call (program ends)', () =>
    parseErr(`${P2}p 10 - 5`, 6, 1));
  test('procedure arguments: p 10 *2 3 — second argument cannot start at "*"', () => parseErr(`${P2}p 10 *2 3`, 6, 6));
  test('procedure arguments: p 10 /2 3 — second argument cannot start at "/"', () => parseErr(`${P2}p 10 /2 3`, 6, 6));
  test('kwadrat 40 * 2 90 passes 80 and 90 (spec example)', () =>
    okSegs('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 40 * 2 90',
      path([[0, 0], [0, 80], [80, 80], [80, 0], [0, 0]])));

  test('the rule does not apply to comparisons', () => {
    okSegs('jeśli 1<2 [np 1]', [S([0, 0], [0, 1])]);
    okSegs('jeśli 1 <2 [np 1]', [S([0, 0], [0, 1])]);
    okSegs('jeśli 1< 2 [np 1]', [S([0, 0], [0, 1])]);
    okSegs('jeśli 2 <>1 [np 1]', [S([0, 0], [0, 1])]);
    okSegs('jeśli 2>= 1 [np 1]', [S([0, 0], [0, 1])]);
  });
  test('the rule applies to operators inside conditions: jeśli 5 -3 > 0 is an error', () => parseErr('jeśli 5 -3 > 0 [np 1]'));
  test('inside a repeat body: [np 10 -5] is an error at "-"', () => parseErr('powtorz 2 [np 10 -5]', 1, 18));
});

// ============================================================================
// Unary signs
// ============================================================================
describe('stacked unary signs', () => {
  const cases: [string, number][] = [
    ['- -2', 2],
    ['--2', 2],
    ['-(3 - 5)', 2],
    ['- - - 3', -3],
    ['---3', -3],
    ['-+-+3', 3],
    ['+ + 4', 4],
    ['3 - -2', 5],
    ['3--2', 5],
    ['3 * -2', -6],
    ['3*-2', -6],
    ['2 * - - 3', 6],
    ['2 - - - 1', 1],
    ['-(-(-(2)))', -2],
  ];
  for (const [e, val] of cases) {
    test(`np ${e} moves ${val}`, () => okSegs(`np ${e}`, [S([0, 0], [0, val])]));
  }
  test('np -bok', () => okSegs('niech bok 4 np -bok', [S([0, 0], [0, -4])]));
  test('np - -:bok', () => okSegs('niech bok 4 np - -:bok', [S([0, 0], [0, 4])]));
  test('np -nrpowt', () => okSegs('powtorz 2 [np -nrpowt]', path([[0, 0], [0, -1], [0, -3]])));
  test('unary signs in procedure arguments: p - -2 -3', () =>
    okSegs('oto p ma: a, b\nnp a\npw 90\nnp b\njuż\np - -2 -3', path([[0, 0], [0, 2], [-3, 2]])));
});

// ============================================================================
// Comparisons
// ============================================================================
describe('comparisons', () => {
  const cases: [string, boolean][] = [
    ['2 < 3', true], ['3 < 3', false],
    ['3 > 2', true], ['3 > 3', false],
    ['3 = 3', true], ['3 = 4', false],
    ['3 <= 3', true], ['4 <= 3', false],
    ['3 >= 3', true], ['2 >= 3', false],
    ['3 <> 4', true], ['3 <> 3', false],
    ['2 * 3 > 1 + 4', true],
    ['-1 < 0', true],
    ['2-1=1', true],
    ['0.1 + 0.2 = 0.3', false],
    ['0.1 + 0.2 <> 0.3', true],
  ];
  for (const [c, holds] of cases) {
    test(`jeśli ${c}`, () => okSegs(`jeśli ${c} [np 1]`, holds ? [S([0, 0], [0, 1])] : []));
    test(`jeżeli ${c}`, () => okSegs(`jeżeli ${c} [np 1] [np 2]`, [S([0, 0], [0, holds ? 1 : 2])]));
  }
});

// ============================================================================
// Geometry
// ============================================================================
describe('geometry 2D', () => {
  test('initial state: origin, heading +Y, pen down, colour #16866a, width 3', () =>
    okSegs('np 10', [S([0, 0, 0], [0, 10, 0], '#16866a', 3)]));
  test('pw rotates clockwise seen from above', () => okSegs('pw 90 np 10', [S([0, 0], [10, 0])]));
  test('lw rotates counter-clockwise', () => okSegs('lw 90 np 10', [S([0, 0], [-10, 0])]));
  test('negative angles turn the other way', () => {
    okSegs('pw -90 np 10', [S([0, 0], [-10, 0])]);
    okSegs('lw -90 np 10', [S([0, 0], [10, 0])]);
  });
  test('ws moves -d', () => okSegs('pw 90 ws 10', [S([0, 0], [-10, 0])]));
  test('np of a negative distance moves backwards', () => okSegs('np -7', [S([0, 0], [0, -7])]));
  test('pw 30', () => okSegs('pw 30 np 10', [S([0, 0], [5, 10 * Math.cos(Math.PI / 6)])]));
  test('pw 45', () => okSegs('pw 45 np 10', [S([0, 0], [10 * Math.SQRT1_2, 10 * Math.SQRT1_2])]));
  test('lw 45', () => okSegs('lw 45 np 10', [S([0, 0], [-10 * Math.SQRT1_2, 10 * Math.SQRT1_2])]));
  test('pw 120', () => okSegs('pw 120 np 10', [S([0, 0], [10 * Math.sin((2 * Math.PI) / 3), -5])]));
  test('pw 360 and pw 450', () => {
    okSegs('pw 360 np 10', [S([0, 0], [0, 10])]);
    okSegs('pw 450 np 10', [S([0, 0], [10, 0])]);
  });
  test('decimal angles', () => okSegs('pw 12.5 np 10', [S([0, 0], [10 * Math.sin((12.5 * Math.PI) / 180), 10 * Math.cos((12.5 * Math.PI) / 180)])]));
  test('a square closes exactly', () =>
    okSegs('powtorz 4 [np 100 pw 90]', path([[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]])));
  test('a move of zero draws nothing', () => {
    okSegs('np 0', []);
    okSegs('ws 0', []);
    okSegs('np 5 - 5', []);
    okSegs('np 10 np 0 np 5', path([[0, 0], [0, 10], [0, 15]]));
  });
  test('pen up moves without drawing; pen down draws again', () =>
    okSegs('pod np 10 opu np 10', [S([0, 10], [0, 20])]));
  test('pen state, colour and width persist until changed', () =>
    okSegs('kolor "#ff0000" grubosc 5 np 10 pw 90 np 10 kolor "#00ff00" np 10 grubosc 1 np 10', [
      S([0, 0], [0, 10], '#ff0000', 5),
      S([0, 10], [10, 10], '#ff0000', 5),
      S([10, 10], [20, 10], '#00ff00', 5),
      S([20, 10], [30, 10], '#00ff00', 1),
    ]));
  test('flat programs produce identical coordinates in 2D and 3D', () => {
    const progs = [
      'powtorz 4 [np 100 pw 90]',
      'powtorz 5 [np 180 pw 144]',
      'powtorz 36 [np 12 pw 10] dom pw 33 ws 17 lw 71.5 np 9',
      'powtorz 90 [np nrpowt * 2.5 pw 89]',
    ];
    for (const p of progs) expect(run(p, '3d')).toEqual(run(p, '2d'));
  });
});

describe('geometry 3D', () => {
  test('gora 90 heads along the former up; up follows (becomes former back); right unchanged', () => {
    const o = orientation('gora 90');
    expectVec(o.h, [0, 0, 1]);
    expectVec(o.u, [0, -1, 0]);
    expectVec(o.r, [1, 0, 0]);
  });
  test('dol 90 rotates the opposite way', () => {
    const o = orientation('dol 90');
    expectVec(o.h, [0, 0, -1]);
    expectVec(o.u, [0, 1, 0]);
    expectVec(o.r, [1, 0, 0]);
  });
  test('pp 90: up is former right, right is former down, heading unchanged', () => {
    const o = orientation('pp 90');
    expectVec(o.h, [0, 1, 0]);
    expectVec(o.u, [1, 0, 0]);
    expectVec(o.r, [0, 0, -1]);
  });
  test('pl 90 rotates the opposite way', () => {
    const o = orientation('pl 90');
    expectVec(o.h, [0, 1, 0]);
    expectVec(o.u, [-1, 0, 0]);
    expectVec(o.r, [0, 0, 1]);
  });
  test('pw rotates around up, right follows', () => {
    const o = orientation('pw 90');
    expectVec(o.h, [1, 0, 0]);
    expectVec(o.r, [0, -1, 0]);
    expectVec(o.u, [0, 0, 1]);
  });
  test('pp does not change the heading', () => okSegs('pp 37 np 10', [S([0, 0, 0], [0, 10, 0])], '3d'));
  test('gora keeps the right vector', () => okSegs('gora 37 pw 90 np 10', [S([0, 0, 0], [10, 0, 0])], '3d'));
  test('pw keeps the up vector', () => okSegs('pw 37 gora 90 np 10', [S([0, 0, 0], [0, 0, 10])], '3d'));
  test('gora 30 / dol 30', () => {
    const c = 10 * Math.cos(Math.PI / 6);
    okSegs('gora 30 np 10', [S([0, 0, 0], [0, c, 5])], '3d');
    okSegs('dol 30 np 10', [S([0, 0, 0], [0, c, -5])], '3d');
  });
  test('pp 30 / pl 30 then pw 90', () => {
    const c = 10 * Math.cos(Math.PI / 6);
    okSegs('pp 30 pw 90 np 10', [S([0, 0, 0], [c, 0, -5])], '3d');
    okSegs('pl 30 pw 90 np 10', [S([0, 0, 0], [c, 0, 5])], '3d');
  });
  test('pw then gora / gora then pw', () => {
    okSegs('pw 90 gora 90 np 10', [S([0, 0, 0], [0, 0, 10])], '3d');
    okSegs('gora 90 pw 90 np 10', [S([0, 0, 0], [10, 0, 0])], '3d');
    okSegs('gora 90 np 10 pw 90 np 10', path([[0, 0, 0], [0, 0, 10], [10, 0, 10]]), '3d');
  });
  const seqs: [string, number][][] = [
    [['pw', 17], ['np', 10], ['gora', 23], ['np', 7], ['pp', 41], ['np', 5], ['dol', 7], ['pw', 113], ['np', 9],
      ['pl', 13], ['lw', 29], ['np', 11], ['gora', -50], ['ws', 4], ['pp', -200], ['np', 3], ['pw', 0.5], ['np', 6]],
    [['gora', 45], ['pw', 45], ['np', 10], ['pp', 90], ['pw', 90], ['np', 10], ['dol', 135], ['np', 10], ['pl', 30], ['lw', 60], ['np', 10]],
    [['pp', 10], ['pw', 10], ['gora', 10], ['np', 20], ['pp', 10], ['pw', 10], ['gora', 10], ['np', 20], ['pp', 10], ['pw', 10], ['gora', 10], ['np', 20]],
  ];
  seqs.forEach((seq, i) => {
    test(`matches a reference rigid-body turtle (sequence ${i + 1})`, () => {
      const ref = new RefTurtle();
      for (const [c, x] of seq) ref.apply(c, x);
      okSegs(seq.map(([c, x]) => `${c} ${x}`).join(' '), ref.segs, '3d');
    });
    test(`orientation stays orthonormal and right-handed (sequence ${i + 1})`, () => {
      const ref = new RefTurtle();
      for (const [c, x] of seq) ref.apply(c, x);
      const o = orientation(seq.map(([c, x]) => `${c} ${x}`).join(' '));
      expectVec(o.h, ref.h);
      expectVec(o.r, ref.r);
      expectVec(o.u, ref.u);
      expectVec(cross(o.r, o.h), o.u);
    });
  });
});

describe('geometry 3D: seeded random command sequences against the reference turtle', () => {
  let seed = 20261028;
  const rnd = (n: number) => {
    seed = (Math.imul(seed, 1103515245) + 12345) & 0x7fffffff;
    return (seed >>> 8) % n;
  };
  const CMDS = ['np', 'ws', 'pw', 'lw', 'gora', 'dol', 'pp', 'pl'];
  const ANG = [0, 1, 7.5, 13.3, 15, 30, 45, 90, 120, 180, 270, 360, 0.5, 89];
  for (let t = 0; t < 40; t++) {
    const seq: [string, number][] = [];
    const n = 4 + rnd(25);
    for (let i = 0; i < n; i++) {
      const c = CMDS[rnd(CMDS.length)];
      const x = c === 'np' || c === 'ws' ? [1, 10, 25.5, 3.3][rnd(4)] : (rnd(2) ? 1 : -1) * ANG[rnd(ANG.length)];
      seq.push([c, x]);
    }
    test(`random sequence ${t + 1}`, () => {
      const ref = new RefTurtle();
      for (const [c, x] of seq) ref.apply(c, x);
      okSegs(seq.map(([c, x]) => `${c} ${x}`).join('\n'), ref.segs, '3d');
    });
  }
});

describe('dom', () => {
  test('returns to origin drawing a segment, resets heading', () =>
    okSegs('np 10 pw 90 np 10 dom np 5', [...path([[0, 0], [0, 10], [10, 10], [0, 0]]), S([0, 0], [0, 5])]));
  test('no segment when already at origin', () => okSegs('pw 45 dom np 5', [S([0, 0], [0, 5])]));
  test('no segment when the pen is up; pen state untouched', () => okSegs('pod np 10 dom np 5', []));
  test('colour and width untouched', () =>
    okSegs('kolor "#ff0000" grubosc 5 np 10 dom np 1', [
      S([0, 0], [0, 10], '#ff0000', 5), S([0, 10], [0, 0], '#ff0000', 5), S([0, 0], [0, 1], '#ff0000', 5),
    ]));
  test('3D: resets heading +Y, right +X, up +Z and returns to origin', () => {
    const o = orientation('gora 30 pp 20 pw 10 np 10 dom');
    expectVec(o.p, [0, 0, 0]);
    expectVec(o.h, [0, 1, 0]);
    expectVec(o.r, [1, 0, 0]);
    expectVec(o.u, [0, 0, 1]);
  });
});

describe('czyść', () => {
  test('removes every segment drawn so far', () => okSegs('np 10 pw 90 np 10 czyść', []));
  test('changes nothing else (position, heading, pen, colour, width)', () =>
    okSegs('kolor "#123456" grubosc 9 np 10 pw 90 czyść np 5', [S([0, 10], [5, 10], '#123456', 9)]));
  test('pen up survives czyść', () => okSegs('pod czyść np 5', []));
  test('only segments drawn afterwards are returned', () =>
    okSegs('np 1 czyść np 2 czyść np 3', [S([0, 3], [0, 6])]));
});

// ============================================================================
// Repeat and nrpowt
// ============================================================================
describe('repeat', () => {
  test('0 runs nothing', () => okSegs('powtorz 0 [np 10]', []));
  test('n times', () => expect(ok('powtorz 7 [np 1]').length).toBe(7));
  test('count may be an expression', () => expect(ok('powtorz 2 * 3 [np 1]').length).toBe(6));
  test('count from a variable', () => expect(ok('niech n 4 powtorz n [np 1]').length).toBe(4));
  test('10000 passes the count check (it then exceeds the operation limit at run time)', () =>
    runErr('np 1 powtorz 10000 []', null, null, [S([0, 0], [0, 1])]));
  test('nested repeats', () => expect(ok('powtorz 3 [powtorz 4 [np 1]]').length).toBe(12));
  test('literal count 10001 is a parse-time error at the count', () => parseErr('powtorz 10001 [np 1]', 1, 9));
  test('literal count 2.5 is a parse-time error at the count', () => parseErr('powtorz 2.5 [np 1]', 1, 9));
  test('literal count -1 is a parse-time error at its first token', () => parseErr('powtorz -1 [np 1]', 1, 9));
  test('literal count expression 5 / 2 is a parse-time error at its first token', () => parseErr('powtorz 5 / 2 [np 1]', 1, 9));
  test('literal count in unexecuted code is still checked at parse time', () => parseErr('jeśli 1 = 2 [powtorz 20000 [np 1]]', 1, 22));
  test('count from a name checked at run time, at the first token of the argument', () =>
    runErr('np 10\nniech n 1.25\npowtorz 2 * n [np 1]', 3, 9, [S([0, 0], [0, 10])]));
  test('negative count from a name', () => runErr('np 10 niech n -1 powtorz n [np 1]', 1, 26, [S([0, 0], [0, 10])]));
  test('count from a name above 10000', () => runErr('np 10 niech n 10001 powtorz n [np 1]', 1, 29, [S([0, 0], [0, 10])]));
  test('bad name-dependent count in a branch not taken is not an error', () => okSegs('niech n -1 jeśli 1 = 2 [powtorz n [np 1]]', []));
});

describe('nrpowt', () => {
  test('iteration number of the current repeat starting at 1', () =>
    okSegs('powtorz 3 [np nrpowt]', path([[0, 0], [0, 1], [0, 3], [0, 6]])));
  test('innermost enclosing repeat', () =>
    okSegs('powtorz 2 [powtorz 2 [np nrpowt * 10]]', path([[0, 0], [0, 10], [0, 30], [0, 40], [0, 60]])));
  test('after an inner repeat ends, refers to the outer one again', () =>
    okSegs('powtorz 2 [powtorz 3 [] np nrpowt]', path([[0, 0], [0, 1], [0, 3]])));
  test('inner repeat count can use the outer nrpowt', () => expect(ok('powtorz 3 [powtorz nrpowt [np 1]]').length).toBe(6));
  test('inside a conditional inside a repeat', () =>
    okSegs('powtorz 4 [jeśli nrpowt = 3 [np nrpowt]]', [S([0, 0], [0, 3])]));
  test('inside a repeat in a procedure body', () =>
    okSegs('oto p\npowtorz 2 [np nrpowt]\njuż\np', path([[0, 0], [0, 1], [0, 3]])));
  test('in a procedure body outside a repeat is a parse-time error even if called from a repeat', () =>
    parseErr('oto p\nnp nrpowt\njuż\npowtorz 2 [p]', 2, 4));
  test('at top level outside a repeat is a parse-time error', () => parseErr('np 10 np nrpowt', 1, 10));
  test('in the count of its own (top-level) repeat it is outside any repeat', () => parseErr('powtorz nrpowt [np 1]', 1, 9));
  test('repcount alias outside a repeat', () => parseErr('np REPCOUNT', 1, 4));
  test('nrpowt cannot be a command', () => parseErr('powtorz 2 [nrpowt]', 1, 12));
});

// ============================================================================
// Variables
// ============================================================================
describe('variables', () => {
  test('assign and reassign', () => okSegs('niech x 5 niech x x + 1 np x', [S([0, 0], [0, 6])]));
  test('names ignore case', () => okSegs('niech Bok 5 np BOK np bok', path([[0, 0], [0, 5], [0, 10]])));
  test('Polish letters ignore case', () => okSegs('niech KĄT 90 pw kąt np 1', [S([0, 0], [1, 0])]));
  test('legacy :name reference to a variable', () => okSegs('niech x 7 np :x', [S([0, 0], [0, 7])]));
  test('top-level niech inside a repeat updates the global', () => okSegs('niech x 0 powtorz 3 [niech x x + 1] np x', [S([0, 0], [0, 3])]));
  test('undeclared name is a parse-time error at the name', () => parseErr('np 10\nnp bok', 2, 4));
  test('use before the top-level niech: declared, but unassigned at run time', () =>
    runErr('np 5\nnp x\nniech x 10', 2, 4, [S([0, 0], [0, 5])]));
  test('unassigned variable reported at the first token of the argument', () =>
    runErr('np 10 np 3 * x niech x 2', 1, 10, [S([0, 0], [0, 10])]));
  test('niech in a branch not taken declares but does not assign', () =>
    runErr('np 1\njeśli 1 = 2 [niech q 1]\nnp q', 3, 4, [S([0, 0], [0, 1])]));
  test('assigned on the current path (second iteration)', () =>
    okSegs('powtorz 2 [jeśli nrpowt = 2 [np x] niech x 5]', [S([0, 0], [0, 5])]));
  test('not yet assigned on the current path (first iteration)', () =>
    runErr('powtorz 2 [jeśli nrpowt = 1 [np x] niech x 5]', 1, 33, []));
  test('procedure reads a global assigned at top level after the definition', () =>
    okSegs('oto p\nnp g\njuż\nniech g 4\np', [S([0, 0], [0, 4])]));
  test('procedure called before the global is assigned: run-time error', () =>
    runErr('np 1\noto p\nnp g\njuż\np\nniech g 4', 3, 4, [S([0, 0], [0, 1])]));
  test('local shadows a global for the rest of the call and is discarded', () =>
    okSegs('niech x 3\noto p\nnp x\nniech x 7\nnp x\njuż\np\nnp x', path([[0, 0], [0, 3], [0, 10], [0, 13]])));
  test('a procedure cannot modify a global', () => okSegs('niech g 1\noto p\nniech g 2\njuż\np\nnp g', [S([0, 0], [0, 1])]));
  test('locals do not survive between calls', () =>
    expect(ok('niech v 1\noto p\njeśli v = 1 [np 5]\nniech v 2\njuż\np\np').length).toBe(2));
  test('locals are per call in recursion', () =>
    okSegs('oto p ma: n\njeśli n > 0 [niech v n * 10 p n - 1 np v]\njuż\np 2', path([[0, 0], [0, 10], [0, 30]])));
  test('declared local read before assignment, no global: run-time error', () =>
    runErr('np 1\noto p\nnp x\nniech x 7\njuż\np', 3, 4, [S([0, 0], [0, 1])]));
  test('parameter reassigned', () => okSegs('oto p ma: a\nniech a a * 2\nnp a\njuż\np 5', [S([0, 0], [0, 10])]));
  test('reassigning a parameter does not change the caller variable', () =>
    okSegs('niech a 5\noto p ma: a\nniech a 1\njuż\np a\nnp a', [S([0, 0], [0, 5])]));
  test('name assigned only in another procedure is a parse-time error', () =>
    parseErr('oto p\nniech q 1\njuż\noto r\nnp q\njuż', 5, 4));
  test('procedure local is not visible at top level (parse-time)', () => parseErr('oto p\nniech q 1\njuż\np\nnp q', 5, 4));
  test('variables are lexical, not dynamic: callee sees the global, not the caller local', () =>
    okSegs('niech x 1\noto q\nnp x\njuż\noto p\nniech x 50\nq\njuż\np', [S([0, 0], [0, 1])]));
  test('variable may not be a command word', () => {
    parseErr('niech np 5', 1, 7);
    parseErr('niech powtórz 5', 1, 7);
    parseErr('niech nrpowt 5', 1, 7);
  });
  test('variable may not be the name of a procedure (procedure defined later)', () => parseErr('niech kw 5\noto kw\njuż'));
  test('variable may not be the name of a procedure (procedure defined earlier, other case)', () => parseErr('oto kw\njuż\nniech KW 5'));
  test('niech needs a name', () => parseErr('niech 5 5', 1, 7));
});

// ============================================================================
// Procedures
// ============================================================================
describe('procedures', () => {
  const SQUARE = path([[0, 0], [0, 80], [80, 80], [80, 0], [0, 0]]);
  test('ma: header form', () => okSegs('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90', SQUARE));
  test('ma: header without spaces after commas', () => okSegs('oto kwadrat ma: bok,kąt\npowtorz 4 [np bok pw kąt]\njuż\nkwadrat 80 90', SQUARE));
  test('legacy header form with :param references', () => okSegs('oto kwadrat :bok :kąt\npowtorz 4 [np :bok pw :kąt]\njuż\nkwadrat 80 90', SQUARE));
  test('legacy header with plain references', () => okSegs('oto kwadrat :bok :kąt\npowtorz 4 [np bok pw kąt]\njuż\nkwadrat 80 90', SQUARE));
  test(':param references with a ma: header', () => okSegs('oto kwadrat ma: bok, kąt\npowtorz 4 [np :bok pw :kąt]\njuż\nkwadrat 80 90', SQUARE));
  test('to / end English forms', () => okSegs('to kwadrat :bok :kąt\nrepeat 4 [fd bok rt kąt]\nend\nkwadrat 80 90', SQUARE));
  test('procedure, parameter and keyword names ignore case', () =>
    okSegs('OTO KwAdRaT MA: BoK\nNP bok\nNp :BOK\nJUŻ\nkwadrat 10\nKWADRAT 5', path([[0, 0], [0, 10], [0, 20], [0, 25], [0, 30]])));
  test('procedure without parameters', () => okSegs('oto p\nnp 10\njuż\np p', path([[0, 0], [0, 10], [0, 20]])));
  test('definition after use', () => okSegs('kw 10\noto kw ma: a\nnp a\njuż', [S([0, 0], [0, 10])]));
  test('parameter named like a procedure: call in command position, parameter in argument position', () =>
    okSegs('oto bok ma: n\nnp n\npw 90\njuż\noto kwadrat ma: bok\npowtorz 4 [bok bok]\njuż\nkwadrat 10',
      path([[0, 0], [0, 10], [10, 10], [10, 0], [0, 0]])));
  test('parameters stand in for repeat counts and call arguments', () =>
    okSegs('oto a ma: n, d\npowtorz n [b d]\njuż\noto b ma: x\nnp x\njuż\na 3 2', path([[0, 0], [0, 2], [0, 4], [0, 6]])));
  test('recursion', () =>
    okSegs('oto schody ma: n\njeśli n = 0 [stop]\nnp 10 pw 90 np 10 lw 90\nschody n - 1\njuż\nschody 3',
      path([[0, 0], [0, 10], [10, 10], [10, 20], [20, 20], [20, 30], [30, 30]])));
  test('mutual recursion, defined after use', () =>
    okSegs('a 3\noto a ma: n\njeśli n > 0 [np 1 b n - 1]\njuż\noto b ma: n\njeśli n > 0 [np 2 a n - 1]\njuż',
      path([[0, 0], [0, 1], [0, 3], [0, 4]])));
  test('stop inside a repeat ends the procedure call, not just the body', () =>
    okSegs('oto p\npowtorz 5 [\n  np 10\n  jeśli nrpowt = 2 [stop]\n]\nnp 100\njuż\np\npw 90 np 1',
      path([[0, 0], [0, 10], [0, 20], [1, 20]])));
  test('stop inside nested repeats ends the whole call', () =>
    okSegs('oto p\npowtorz 3 [powtorz 3 [np 1 stop] np 50]\nnp 100\njuż\np\np', path([[0, 0], [0, 1], [0, 2]])));
  test('stop inside an else body ends the call', () =>
    okSegs('oto p ma: n\njeżeli n > 5 [np 1] [stop]\nnp 100\njuż\np 3\npw 90 np 1', [S([0, 0], [1, 0])]));
  test('stop in a called procedure does not stop the caller repeat', () =>
    expect(ok('oto p\nnp 1\nstop\nnp 100\njuż\npowtorz 3 [p]').length).toBe(3));
  test('stop at top level ends the program', () => okSegs('np 10 stop np 10', [S([0, 0], [0, 10])]));
  test('stop at top level inside repeat and conditional ends the program', () =>
    okSegs('powtorz 3 [np 10 jeśli nrpowt = 2 [stop]] np 99', path([[0, 0], [0, 10], [0, 20]])));
  test('duplicate definition is an error', () => parseErr('oto p\njuż\noto p\njuż'));
  test('duplicate definition differing only in case is an error', () => parseErr('oto p\njuż\noto P\njuż'));
  test('definition inside a repeat body', () => parseErr('powtorz 2 [\noto p\njuż\n]', 2, 1));
  test('definition inside a conditional body', () => parseErr('jeśli 1 = 1 [\noto p\njuż\n]', 2, 1));
  test('definition inside another procedure', () => parseErr('oto p\noto q\njuż\njuż', 2, 1));
  test('oto not at the beginning of a line', () => parseErr('np 10 oto p\njuż'));
  test('missing już', () => parseErr('oto p\nnp 10'));
  test('już not alone on its line', () => parseErr('oto p\nnp 10 już'));
  test('body on the header line', () => parseErr('oto p np 10\njuż'));
  test('procedure name may not be a keyword', () => parseErr('oto np\njuż'));
  test('too few arguments, program ends: reported at the call', () => parseErr('oto p ma: a, b\njuż\np 1', 3, 1));
  test('too few arguments: reported where the argument should start', () => parseErr('oto p ma: a, b\njuż\np 1 np 5', 3, 5));
  test('too few arguments before a ]', () => parseErr('oto p ma: a\njuż\npowtorz 2 [p]', 3, 13));
  test('too many arguments: the extra value is stray', () => parseErr('oto p ma: a, b\njuż\np 1 2 3', 3, 7));
  test('argument missing because the next line starts a definition', () => parseErr('p\noto p ma: a\njuż', 2, 1));
  test('unknown procedure', () => parseErr('np 10\nfoo 5', 2, 1));
  test('procedure name used as a value is an error', () => parseErr('oto q\njuż\nnp q', 3, 4));
});

// ============================================================================
// Error positions
// ============================================================================
describe('error positions: missing arguments', () => {
  test('np at end of program → at np', () => parseErr('np', 1, 1));
  test('second command missing its argument at end', () => parseErr('np 10 pw', 1, 7));
  test('next line', () => parseErr('pw 90\nnp', 2, 1));
  test('powtorz at end', () => parseErr('powtorz', 1, 1));
  test('powtorz count, no body, at end', () => parseErr('powtorz 3', 1, 1));
  test('jeśli at end', () => parseErr('jeśli', 1, 1));
  test('jeśli condition, no body, at end', () => parseErr('jeśli 1 < 2', 1, 1));
  test('jeżeli missing second body at end', () => parseErr('jeżeli 1 < 2 [np 1]', 1, 1));
  test('niech at end', () => parseErr('niech', 1, 1));
  test('niech name at end', () => parseErr('niech x', 1, 1));
  test('kolor at end', () => parseErr('kolor', 1, 1));
  test('grubosc at end', () => parseErr('grubosc', 1, 1));
  test('gora at end (3D)', () => parseErr('gora', 1, 1, '3d'));
  test('missing argument inside an unclosed bracket at end → at the command', () => parseErr('powtorz 2 [np', 1, 12));
  test('before ]', () => parseErr('powtorz 2 [np]', 1, 14));
  test('before ) ', () => parseErr('np )', 1, 4));
  test('before ]', () => parseErr('np ]', 1, 4));
  test('before another command', () => parseErr('np pw 90', 1, 4));
  test('niech x before ]', () => parseErr('powtorz 1 [niech x]', 1, 19));
  test('kolor before ]', () => parseErr('powtorz 1 [kolor]', 1, 17));
  test('powtorz count missing before [', () => parseErr('powtorz [np 1]', 1, 9));
  test('jeśli condition missing before [', () => parseErr('jeśli [np 1]', 1, 7));
  test('powtorz body missing before another command', () => parseErr('powtorz 2 np 1', 1, 11));
  test('jeżeli second body missing before another command', () => parseErr('jeżeli 1 = 1 [np 1] np 2', 1, 21));
  test('operand missing before )', () => parseErr('np (10 + )', 1, 10));
  test('empty parentheses', () => parseErr('np ()', 1, 5));
  test('argument missing before już in a procedure body', () => parseErr('oto p\nnp\njuż', 3, 1));
  test('program ends in a comment after the command → at the command', () => parseErr('np ; komentarz', 1, 1));
  test('before a comparison', () => parseErr('np < 1', 1, 4));
  test('before a comma', () => parseErr('np ,', 1, 4));
  test('before a colour literal', () => parseErr('np "#ffffff"', 1, 4));
  test('procedure argument before a colour literal', () => parseErr('oto p ma: a\njuż\np "#ffffff"', 3, 3));
  test('jeśli body missing before ]', () => parseErr('powtorz 1 [jeśli 1 = 1]', 1, 23));
  test('jeśli comparison missing before ]', () => parseErr('powtorz 1 [jeśli 1]', 1, 19));
  test('grubosc before ]', () => parseErr('grubosc ]', 1, 9));

  // Ambiguous: is the operand of an operator / the right side of a comparison an "argument"?
  // A strict reading of "at the command itself when the program ends there" would put these at the command.
  // The implementation reports them at the operator / comparison / parenthesis / sign instead.
  test.skip('AMBIGUOUS: np 10 + (end) — implementation reports at "+" (1,7)', () => parseErr('np 10 +', 1, 1));
  test.skip('AMBIGUOUS: jeśli 1 = (end) — implementation reports at "=" (1,9)', () => parseErr('jeśli 1 =', 1, 1));
  test.skip('AMBIGUOUS: np ( (end) — implementation reports at "(" (1,4)', () => parseErr('np (', 1, 1));
  test.skip('AMBIGUOUS: np - (end) — implementation reports at "-" (1,4)', () => parseErr('np -', 1, 1));
});

describe('error positions: stray values', () => {
  test('np 10 20', () => parseErr('np 10 20', 1, 7));
  test('a number at the start', () => parseErr('5', 1, 1));
  test('stray parenthesised value', () => parseErr('np 10 (5)', 1, 7));
  test('stray -5', () => parseErr('np 10 -5', 1, 7));
  test('stray +5', () => parseErr('np 10 +5', 1, 7));
  test('stray value in a body', () => parseErr('powtorz 2 [np 10 20]', 1, 18));
  test('stray :x', () => parseErr('niech x 1 np 10 :x', 1, 17));
  test('stray .5', () => parseErr('np 10 .5', 1, 7));
  test('stray colour literal', () => parseErr('"#ffffff"', 1, 1));
  test('stray nrpowt', () => parseErr('powtorz 2 [np 10 nrpowt]', 1, 18));
  test('stray value on the next line', () => parseErr('np 10\n20', 2, 1));
});

describe('error positions: other errors', () => {
  test('unknown command', () => parseErr('np 10\n  foo 5', 2, 3));
  test('malformed colour: 7 digits', () => parseErr('kolor "#1234567"', 1, 7));
  test('malformed colour: 5 digits', () => parseErr('kolor "#12345"', 1, 7));
  test('malformed colour: non-hex', () => parseErr('kolor "#gggggg"', 1, 7));
  test('malformed colour: no #', () => parseErr('kolor "16866a"', 1, 7));
  test('malformed colour: unquoted', () => parseErr('kolor #16866a', 1, 7));
  test('malformed colour: a number', () => parseErr('kolor 5', 1, 7));
  test('colour hex digits are case-insensitive, output lowercase', () => okSegs('kolor "#AbCdEf" np 1', [S([0, 0], [0, 1], '#abcdef')]));
  test('width 13 (literal) at parse time, at the argument', () => parseErr('np 10 grubosc 13', 1, 15));
  test('width 0', () => parseErr('grubosc 0', 1, 9));
  test('width 2.5', () => parseErr('grubosc 2.5', 1, 9));
  test('width -3 at its first token', () => parseErr('grubosc -3', 1, 9));
  test('width (13) at its first token', () => parseErr('grubosc (13)', 1, 9));
  test('width literal expression 2 * 7', () => parseErr('np 10 grubosc 2 * 7', 1, 15));
  test('width 1 and 12 accepted, 3 * 4 accepted', () => {
    expect(ok('grubosc 1 np 1')[0].width).toBe(1);
    expect(ok('grubosc 12 np 1')[0].width).toBe(12);
    expect(ok('grubosc 3 * 4 np 1')[0].width).toBe(12);
    expect(ok('grubosc 12.0 np 1')[0].width).toBe(12);
  });
  test('literal width in unexecuted code is checked at parse time', () => parseErr('oto p\ngrubosc 0\njuż', 2, 9));
  test('width from a name checked at run time, at the first token of the argument', () =>
    runErr('np 10\nniech w 13\ngrubosc w', 3, 9, [S([0, 0], [0, 10])]));
  test('width from a name: first token is a literal', () =>
    runErr('np 10 niech a 7 grubosc 2 * a', 1, 25, [S([0, 0], [0, 10])]));
  test('width from a name: first token is a parenthesis', () =>
    runErr('np 10 niech a 0 grubosc (a + 1) * 20', 1, 25, [S([0, 0], [0, 10])]));
  test('unbalanced ]', () => parseErr('np 10 ]', 1, 7));
  test('unclosed [ reported at the [', () => parseErr('powtorz 2 [np 10', 1, 11));
  test('unbalanced )', () => parseErr('np 10)', 1, 6));
  test('unclosed ( reported at the (', () => parseErr('np (10', 1, 4));
  test('stray [', () => parseErr('np 10 [np 1]', 1, 7));
  test('undeclared name in a procedure', () => parseErr('oto p ma: a\nnp b\njuż', 2, 4));
  test('division by zero: run time, at the first token of the argument', () =>
    runErr('np 10\nnp 5 + 10 / 0', 2, 4, [S([0, 0], [0, 10])]));
  test('division by zero through a variable', () => runErr('np 10 niech z 0 np 10 / z', 1, 20, [S([0, 0], [0, 10])]));
  test('division by zero in a literal width is still a run-time error', () =>
    runErr('np 10 grubosc 6 / 0', 1, 15, [S([0, 0], [0, 10])]));
  test('division by zero in a literal repeat count is a run-time error', () =>
    runErr('np 10 powtorz 6 / (2 - 2) [np 1]', 1, 15, [S([0, 0], [0, 10])]));
  test('division by zero in niech', () => runErr('np 10 niech q -1 / 0', 1, 15, [S([0, 0], [0, 10])]));
  test('division by zero in a procedure argument', () =>
    runErr('oto p ma: a\nnp a\njuż\nnp 1\np 2 + 3 / 0', 5, 3, [S([0, 0], [0, 1])]));
  test('unassigned variable in a procedure argument', () =>
    runErr('oto p ma: a\nnp a\njuż\nnp 1\np 2 + y\nniech y 3', 5, 3, [S([0, 0], [0, 1])]));
  const BIG = Array(32).fill('10000000000').join(' * ');
  test('non-finite result (literal) is a run-time error at the first token', () =>
    runErr(`np 10\nnp ${BIG}`, 2, 4, [S([0, 0], [0, 10])]));
  test('non-finite result via a variable', () =>
    runErr(`np 10\nniech a 10000000000\nniech b -a * ${Array(31).fill('a').join(' * ')}`, 3, 9, [S([0, 0], [0, 10])]));

  // Ambiguous: for a condition, is "the argument" the whole condition or each side of the comparison?
  // The implementation reports at the first token of the side that contains the reference.
  test.skip('AMBIGUOUS: unassigned variable on the right side of a condition', () => {
    // jeśli 0 < x [np 1] niech x 1  → implementation: column of "x" (1,11), not of "0" (1,7)
  });
});

describe('parse-time versus run-time', () => {
  test('a late parse error draws nothing', () => parseErr('np 10\nnp 20\nfoo', 3, 1));
  test('a parse error in a procedure never called draws nothing', () => parseErr('np 10\noto p\nnp bok\njuż', 3, 4));
  test('run-time error keeps what was drawn', () => runErr('np 10 pw 90 np 10 np 1 / 0', 1, 22, path([[0, 0], [0, 10], [10, 10]])));
  test('run-time error keeps what was drawn after czyść', () =>
    runErr('np 10 czyść np 20 np 1 / 0', 1, 22, [S([0, 10], [0, 30])]));
  test('run-time error after czyść with nothing drawn since', () => runErr('np 10 czyść np 1 / 0', 1, 16, []));
});

// ============================================================================
// Limits
// ============================================================================
describe('limits: source length', () => {
  test('50000 characters accepted', () => okSegs('np 1' + ' '.repeat(49996), [S([0, 0], [0, 1])]));
  test('50001 characters rejected (nothing drawn)', () => {
    const r = run('np 1' + ' '.repeat(49997));
    expect(r.error).not.toBeNull();
    expect(r.segments).toEqual([]);
  });
  test('comments count as source characters', () => {
    expect(run(';' + 'x'.repeat(49999)).error).toBeNull();
    expect(run(';' + 'x'.repeat(50000)).error).not.toBeNull();
  });
});

describe('limits: tokens', () => {
  test('10000 tokens accepted', () => expect(run('pod '.repeat(10000)).error).toBeNull());
  test('10001 tokens rejected', () => {
    const r = run('np 1 ' + 'pod '.repeat(9999));
    expect(r.error).not.toBeNull();
    expect(r.segments).toEqual([]);
  });
  test('parentheses and operators are tokens', () => {
    // np ( 1 ) = 4 tokens, each "+1" = 2 tokens
    expect(run('np (1)' + '+1'.repeat(4997) + ' pod pod').error).toBeNull(); // 4 + 9994 + 2 = 10000
    expect(run('np (1)' + '+1'.repeat(4998) + ' pod').error).not.toBeNull(); // 4 + 9996 + 1 = 10001
  });
  test('brackets are tokens', () => {
    // powtorz 1 [ ] = 4 tokens
    expect(run('powtorz 1 []' + ' pod'.repeat(9996)).error).toBeNull();
    expect(run('powtorz 1 []' + ' pod'.repeat(9997)).error).not.toBeNull();
  });
  test('commas are tokens', () => {
    const params = Array.from({ length: 100 }, (_, i) => `a${i}`).join(', ');
    const header = `oto p ma: ${params}\njuż\n`; // oto p ma: + 100 names + 99 commas + już = 203 tokens
    expect(run(header + 'pod '.repeat(9797)).error).toBeNull();
    expect(run(header + 'pod '.repeat(9798)).error).not.toBeNull();
  });
  test('comparisons are tokens; comments are not', () => {
    // jeśli 1 = 1 [ ] = 6 tokens
    expect(run('jeśli 1 = 1 [] ; comment\n' + 'pod '.repeat(9994)).error).toBeNull();
    expect(run('jeśli 1 = 1 [] ; comment\n' + 'pod '.repeat(9995)).error).not.toBeNull();
  });
});

describe('limits: bracket nesting', () => {
  const nest = (n: number, open = 'powtorz 1 [') => open.repeat(n) + 'np 1' + ']'.repeat(n);
  test('32 nested repeat brackets accepted', () => okSegs(nest(32), [S([0, 0], [0, 1])]));
  test('33 nested repeat brackets rejected at the 33rd [', () => parseErr(nest(33), 1, 32 * 11 + 11));
  test('conditional brackets count: 32 accepted', () => okSegs(nest(32, 'jeśli 1 = 1 ['), [S([0, 0], [0, 1])]));
  test('conditional brackets count: 33 rejected', () => parseErr(nest(33, 'jeśli 1 = 1 [')));
  test('mixed: 16 repeats + 16 conditionals accepted, one more rejected', () => {
    okSegs(nest(16, 'jeśli 1 = 1 [') .replace('np 1', nest(16)), [S([0, 0], [0, 1])]);
    parseErr(nest(16, 'jeśli 1 = 1 [').replace('np 1', nest(17)));
  });
  test('inside a procedure body: 32 accepted, 33 rejected', () => {
    // conditionals, so that the call frame plus repeat frames do not hit the frame limit
    okSegs(`oto p\n${nest(32, 'jeśli 1 = 1 [')}\njuż\np`, [S([0, 0], [0, 1])]);
    parseErr(`oto p\n${nest(33, 'jeśli 1 = 1 [')}\njuż\np`);
  });
  test('the second body of jeżeli is at the same depth', () =>
    okSegs(nest(31).replace('np 1', 'jeżeli 1 = 2 [np 5] [np 1]'), [S([0, 0], [0, 1])]));
});

describe('limits: frames (calls + repeats; conditionals do not count)', () => {
  const REC = 'oto p ma: n\njeśli n > 0 [p n - 1]\njuż\nnp 10\n';
  test('32 nested calls accepted (conditional bodies are not frames)', () => okSegs(`${REC}p 31`, [S([0, 0], [0, 10])]));
  test('33 nested calls rejected at run time', () => runErr(`${REC}p 32`, null, null, [S([0, 0], [0, 10])]));
  const MIX = 'oto p ma: n\njeśli n > 0 [powtorz 1 [p n - 1]]\njuż\nnp 10\n';
  test('calls and repeats together: 32 accepted', () => okSegs(`${MIX}powtorz 1 [p 15]`, [S([0, 0], [0, 10])]));
  test('calls and repeats together: 33 rejected', () => runErr(`${MIX}powtorz 1 [powtorz 1 [p 15]]`, null, null, [S([0, 0], [0, 10])]));
  test('32 nested repeats accepted', () => okSegs('powtorz 1 ['.repeat(32) + 'np 1' + ']'.repeat(32), [S([0, 0], [0, 1])]));
  test('frames are released: sequential deep recursions are fine', () => okSegs(`${REC}p 31 p 31 p 31`, [S([0, 0], [0, 10])]));
  test('frames released after stop inside a repeat', () =>
    okSegs('oto q ma: n\njeśli n > 0 [powtorz 1 [q n - 1 stop]]\njuż\nnp 10\nq 15\nq 15', [S([0, 0], [0, 10])]));

  // Ambiguous: is a repeat with count 0 an "active frame"? The implementation counts it (enters a frame).
  test.skip('AMBIGUOUS: powtorz 0 [...] at depth 32', () => {});
});

describe('limits: operations', () => {
  const pods = (n: number) => ' pod'.repeat(n);
  test('commands + repeat + iteration ends: exactly 10000 accepted', () =>
    expect(ok('powtorz 4999 [np 1] np 1').length).toBe(5000)); // 1 + 4999*2 + 1
  test('10001 rejected at run time, keeping what was drawn', () => {
    const r = run('powtorz 4999 [np 1] np 1 np 1');
    expect(r.error).not.toBeNull();
    expect(r.segments.length).toBe(5000);
    expectSegs([r.segments[4999] as Seg], [S([0, 4999], [0, 5000])]);
  });
  test('repeat 0 counts one operation', () => {
    expect(run('powtorz 4999 [pod] powtorz 0 [pod]').error).toBeNull();
    expect(run('powtorz 4999 [pod] powtorz 0 [pod] pod').error).not.toBeNull();
  });
  test('niech counts', () => {
    expect(run('powtorz 4999 [niech a 1] niech a 2').error).toBeNull();
    expect(run('powtorz 4999 [niech a 1] niech a 2 niech a 3').error).not.toBeNull();
  });
  test('conditional (true) counts itself and its body end', () => {
    expect(run('powtorz 2499 [jeśli 1 = 1 [pod]]' + pods(3)).error).toBeNull(); // 1 + 2499*4 + 3
    expect(run('powtorz 2499 [jeśli 1 = 1 [pod]]' + pods(4)).error).not.toBeNull();
  });
  test('conditional (false, no body) counts only itself', () => {
    expect(run('powtorz 4999 [jeśli 1 = 2 [pod]]' + pods(1)).error).toBeNull();
    expect(run('powtorz 4999 [jeśli 1 = 2 [pod]]' + pods(2)).error).not.toBeNull();
  });
  test('jeżeli else body end counts', () => {
    expect(run('powtorz 2499 [jeżeli 1 = 2 [pod] [pod]]' + pods(3)).error).toBeNull();
    expect(run('powtorz 2499 [jeżeli 1 = 2 [pod] [pod]]' + pods(4)).error).not.toBeNull();
  });
  test('empty conditional body still counts its end', () => {
    expect(run('powtorz 3333 [jeśli 1 = 1 []]').error).toBeNull(); // 1 + 3333*3
    expect(run('powtorz 3333 [jeśli 1 = 1 []] pod').error).not.toBeNull();
  });
  test('call counts itself and its end', () => {
    expect(run('oto p\njuż\npowtorz 3333 [p]').error).toBeNull(); // 1 + 3333*3
    expect(run('oto p\njuż\npowtorz 3333 [p] pod').error).not.toBeNull();
  });
  test('call with a body', () => {
    expect(run('oto p\npod\njuż\npowtorz 2499 [p]' + pods(3)).error).toBeNull();
    expect(run('oto p\npod\njuż\npowtorz 2499 [p]' + pods(4)).error).not.toBeNull();
  });
  test('evaluating expressions is not an operation', () => {
    expect(run('oto p ma: a\njuż\npowtorz 3333 [p 1 + 2 * 3 - (4 / 2)]').error).toBeNull();
    expect(run('powtorz 4999 [pw 1 + 2 * 3 - (4 / 2) + 1 - 1] pw 1 * 1 * 1').error).toBeNull();
  });
  test('nested repeats', () => {
    expect(run('powtorz 10 [powtorz 498 [pod]]' + pods(19)).error).toBeNull(); // 1 + 10*(1+996+1) + 19
    expect(run('powtorz 10 [powtorz 498 [pod]]' + pods(20)).error).not.toBeNull();
  });
  test('stop is a command and counts; reaching the end of the program does not', () => {
    expect(run('powtorz 4999 [pod] stop').error).toBeNull();
    expect(run('powtorz 4999 [pod] pod stop').error).not.toBeNull();
  });
  test('powtorz 10000 [] needs 10001 operations', () => expect(run('powtorz 10000 []').error).not.toBeNull());
  test('pure commands: 10000 accepted', () => expect(run('pod '.repeat(10000)).error).toBeNull());

  // Ambiguous: does a call ended by `stop` count as "finishing" the call? Does an iteration ended by `stop`
  // count as finishing the iteration? The implementation counts the call end but not the iteration end.
  test.skip('AMBIGUOUS: operation counting when stop ends a call / an iteration', () => {});
});

describe('limits: segments', () => {
  // Each operation draws at most one segment and at most 10000 operations run, so more than 10000 kept
  // segments can never be reached; we check that close to the maximum works and that czyść frees space.
  test('9996 kept segments are fine', () => {
    const r = run('powtorz 2 [' + 'np 1 '.repeat(4998) + ']');
    expect(r.error).toBeNull();
    expect(r.segments.length).toBe(9996);
  });
  test('czyść releases kept segments', () => {
    const r = run('powtorz 2 [czyść ' + 'np 1 '.repeat(4997) + ']');
    expect(r.error).toBeNull();
    expect(r.segments.length).toBe(4997);
    expectSegs([r.segments[0] as Seg], [S([0, 4997], [0, 4998])]);
  });
});

describe('limits: coordinates', () => {
  test('±100000 is within bounds', () => {
    okSegs('np 100000', [S([0, 0], [0, 100000])]);
    okSegs('ws 100000', [S([0, 0], [0, -100000])]);
    okSegs('pw 90 np 100000', [S([0, 0], [100000, 0])]);
    okSegs('gora 90 np 100000', [S([0, 0, 0], [0, 0, 100000])], '3d');
    okSegs('dol 90 np 100000', [S([0, 0, 0], [0, 0, -100000])], '3d');
  });
  test('beyond +100000 is a run-time error keeping earlier segments', () =>
    runErr('np 100000 np 0.001', null, null, [S([0, 0], [0, 100000])]));
  test('beyond -100000 on x', () => runErr('np 1 lw 90 np 100000.5', null, null, [S([0, 0], [0, 1])]));
  test('beyond on z', () => runErr('np 1 gora 90 np 100001', null, null, [S([0, 0, 0], [0, 1, 0])], '3d'));
  test('also when the pen is up', () => runErr('np 1 pod np 100000', null, null, [S([0, 0], [0, 1])]));
});

// ============================================================================
// Output format
// ============================================================================
describe('output format', () => {
  test('segment shape: from/to arrays of 3 numbers, lowercase colour, numeric width', () => {
    const r = run('kolor "#ABCDEF" grubosc 4 np 10');
    expect(r.error).toBeNull();
    expect(r.segments).toEqual([{ from: [0, 0, 0], to: [0, 10, 0], color: '#abcdef', width: 4 }]);
    const s = r.segments[0];
    expect(Object.keys(s).sort()).toEqual(['color', 'from', 'to', 'width']);
    expect(typeof s.width).toBe('number');
    for (const c of [...s.from, ...s.to]) expect(typeof c).toBe('number');
  });
  test('default colour is lowercase #16866a', () => expect(ok('np 1')[0].color).toBe('#16866a'));
  test('segments are in drawing order', () =>
    okSegs('np 1 pw 90 np 2 pw 90 np 3', path([[0, 0], [0, 1], [2, 1], [2, -2]])));
  test('error object shape', () => {
    const r = run('foo');
    expect(r.error).not.toBeNull();
    expect(Object.keys(r.error!).sort()).toEqual(['column', 'line', 'message']);
  });
  test('no error is null', () => expect(run('').error).toBeNull());
  test('empty program and comment-only program draw nothing', () => {
    expect(run('')).toEqual({ segments: [], error: null });
    expect(run('; nic\n  ; nic')).toEqual({ segments: [], error: null });
  });
});

// ============================================================================
// Lexical rules
// ============================================================================
describe('lexical rules', () => {
  test('comments run to the end of the line', () => okSegs('np 10 ; pw 90 np 10\nnp 5', path([[0, 0], [0, 10], [0, 15]])));
  test('arguments may be on the next line', () => okSegs('np\n10', [S([0, 0], [0, 10])]));
  test('commands may share a line or not', () => okSegs('np 1 np 1\nnp\n1', path([[0, 0], [0, 1], [0, 2], [0, 3]])));
  test('header and body lines may carry comments', () => okSegs('oto p ; komentarz\nnp 1 ; x\njuż ; koniec\np', [S([0, 0], [0, 1])]));
  test('brackets may touch their contents', () => expect(ok('powtorz 2[np 1]').length).toBe(2));
  test('tokens without separating whitespace where unambiguous', () => {
    expect(ok('powtorz 2 [np 1]powtorz 2 [np 1]').length).toBe(4);
    okSegs('np(10)', [S([0, 0], [0, 10])]);
    okSegs('np-5', [S([0, 0], [0, -5])]);
    okSegs('kolor"#ffffff"np 1', [S([0, 0], [0, 1], '#ffffff')]);
    okSegs('jeśli 1=1[np 1]', [S([0, 0], [0, 1])]);
    okSegs('oto p ma:a,b\nnp a+b\njuż\np 1 2', [S([0, 0], [0, 3])]);
  });
  test('a number glued to a name is not a number', () => parseErr('pw 90np 10', 1, 4));
  test('unary signs in repeat counts and widths', () => {
    expect(ok('powtorz -(-2) [np 1]').length).toBe(2);
    expect(ok('grubosc +3 np 1')[0].width).toBe(3);
    expect(ok('grubosc - -4 np 1')[0].width).toBe(4);
  });
  test('CRLF and CR line endings count as one line break', () => {
    parseErr('np 10\r\nfoo', 2, 1);
    parseErr('np 10\rfoo', 2, 1);
  });

  // Ambiguous: a comment directly after an operator (`np 10 -;c` + newline + `5`). A comment is not
  // whitespace, but it is followed by a newline. The implementation treats `;` like whitespace here,
  // so the program moves 5.
  test.skip('AMBIGUOUS: operator followed directly by a comment', () => {});
  // Ambiguous: "Calls take positional arguments separated by whitespace". `p (1)(2)` has no whitespace
  // between the arguments; the implementation accepts it as two arguments.
  test.skip('AMBIGUOUS: procedure arguments not separated by whitespace, p (1)(2)', () => {});
  // Ambiguous: names starting with "_" — the spec never defines which characters a name may contain.
  // The implementation accepts letters, marks and "_" first, then also digits.
  test.skip('AMBIGUOUS: allowed name characters', () => {});
  // Ambiguous: "50,000 source characters" and "column" — code points or UTF-16 units? The implementation
  // counts UTF-16 units (an emoji in a comment counts 2 towards the source limit).
  test.skip('AMBIGUOUS: characters vs UTF-16 code units', () => {});
});

describe('ambiguous points (not asserted)', () => {
  // "Variable names ... may not be ... the name of a procedure" vs "A parameter may share its name with a
  // procedure" and "A parameter can be reassigned the same way". Reassigning such a parameter with niech:
  // the implementation allows it.
  test.skip('AMBIGUOUS: niech on a parameter that shares its name with a procedure', () => {});
  // Position of "a missing już": the implementation reports it at the `oto` of the unterminated definition.
  test.skip('AMBIGUOUS: position of a missing już', () => {});
  // Position of a duplicate definition: implementation reports the name in the second header.
  test.skip('AMBIGUOUS: position of a duplicate definition', () => {});
  // Position of limit errors ("the offending token"): the implementation uses the 10001st token, the
  // 50001st character, the statement (or closing ] / już) whose operation is the 10001st, the call or
  // repeat that would be the 33rd frame, and the move/dom command that leaves the ±100000 box.
  test.skip('AMBIGUOUS: positions of limit errors', () => {});
  // Program ending inside an unterminated procedure right after a command that needs an argument
  // (`oto p` / `np`): missing argument (implementation, at np) or missing już?
  test.skip('AMBIGUOUS: missing argument vs missing już at end of program', () => {});
});

// ============================================================================
// Standard examples
// ============================================================================
describe('standard examples', () => {
  for (const ex of EXAMPLES) {
    test(`${ex.id} runs without error`, () => {
      const r = run(ex.source, ex.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }
  const byId = (id: string) => EXAMPLES.find((e) => e.id === id)!;
  test('kwadrat: closed square of side 120', () =>
    okSegs(byId('kwadrat').source, path([[0, 0], [0, 120], [120, 120], [120, 0], [0, 0]])));
  test('schody: exact staircase', () => {
    const pts: number[][] = [[0, 0, 0]];
    for (let i = 1; i <= 6; i++) pts.push([0, 35 * i, 20 * (i - 1)], [0, 35 * i, 20 * i]);
    okSegs(byId('schody').source, path(pts, '#16866a', 4), '3d');
  });
  const counts: Record<string, number> = {
    gwiazda: 5, rozeta: 48, spirala: 90, wielokaty: 42, drzewo: 255, sniezynka: 768,
    szescian: 17, pierscien: 36, kula: 432, helisa: 240, drzewo3d: 121,
  };
  for (const [id, n] of Object.entries(counts)) {
    test(`${id}: ${n} segments`, () => expect(ok(byId(id).source, byId(id).mode).length).toBe(n));
  }
  test('pierscien matches the reference turtle', () => {
    const ref = new RefTurtle();
    ref.up(30);
    for (let i = 0; i < 36; i++) { ref.fd(12); ref.rt(10); }
    okSegs(byId('pierscien').source, ref.segs.map((s) => ({ ...s, color: '#a478c0' })), '3d');
  });
});
