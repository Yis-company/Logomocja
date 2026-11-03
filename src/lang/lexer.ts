// Lexer for the Logomocja dialect.

export type TokType =
  | 'num' | 'word' | 'color' | 'ma'
  | 'lbr' | 'rbr' | 'lpar' | 'rpar' | 'comma'
  | 'op' | 'cmp' | 'eof';

export interface Token {
  t: TokType;
  /** Raw text as written. */
  text: string;
  /** Normalised value: lowercase name, operator, lowercase colour. */
  v: string;
  /** Numeric value for numbers. */
  n: number;
  line: number;
  col: number;
  /** Index into the source. */
  pos: number;
  /** Whitespace (or start of input) directly before the token. */
  sb: boolean;
  /** Whitespace (or end of input / comment) directly after the token. */
  sa: boolean;
  /** Legacy `:name` form. */
  legacy?: boolean;
  /** First token on its line. */
  first: boolean;
  /** Last token on its line. */
  last: boolean;
}

export class LogoError extends Error {
  line: number;
  column: number;
  constructor(message: string, line: number, column: number) {
    super(message);
    this.line = line;
    this.column = column;
  }
}

export const LIMITS = {
  chars: 50_000,
  tokens: 10_000,
  depth: 32,
  frames: 32,
  ops: 10_000,
  segments: 10_000,
  coord: 100_000,
};

const WORD_START = /[\p{L}_]/u;
const WORD_CHAR = /[\p{L}\p{M}\p{N}_]/u;
const DIGIT = /[0-9]/;
const SPACE = /\s/;

export function normName(s: string): string {
  return s.normalize('NFC').toLowerCase();
}

export function tokenize(src: string): Token[] {
  if (src.length > LIMITS.chars) {
    const { line, col } = lineCol(src, LIMITS.chars);
    throw new LogoError(
      `Program jest za długi: ma ${fmtInt(src.length)} znaków, a limit to ${fmtInt(LIMITS.chars)}.`,
      line, col,
    );
  }
  const toks: Token[] = [];
  let i = 0;
  let line = 1;
  let lineStart = 0;
  let lastLine = 0;
  const n = src.length;

  const isSpaceAt = (k: number) => k < 0 || k >= n || SPACE.test(src[k]) || src[k] === ';';

  const push = (t: TokType, start: number, end: number, v: string, num = 0, legacy = false) => {
    if (toks.length >= LIMITS.tokens) {
      throw new LogoError(
        `Program ma za dużo elementów: limit to ${fmtInt(LIMITS.tokens)} (liczone są też operatory, nawiasy i przecinki).`,
        line, start - lineStart + 1,
      );
    }
    const tok: Token = {
      t, text: src.slice(start, end), v, n: num, line, col: start - lineStart + 1, pos: start,
      sb: start === 0 || SPACE.test(src[start - 1]),
      sa: isSpaceAt(end),
      legacy, first: line !== lastLine, last: false,
    };
    if (tok.first && toks.length) toks[toks.length - 1].last = true;
    lastLine = line;
    toks.push(tok);
  };

  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; lineStart = i; continue; }
    if (SPACE.test(c)) { i++; continue; }
    if (c === ';') { while (i < n && src[i] !== '\n') i++; continue; }
    const col = i - lineStart + 1;

    if (DIGIT.test(c) || (c === '.' && DIGIT.test(src[i + 1] ?? ''))) {
      const start = i;
      while (i < n && DIGIT.test(src[i])) i++;
      if (src[i] === '.') {
        i++;
        if (!DIGIT.test(src[i] ?? '')) throw badNumber(src, start, i, line, col);
        while (i < n && DIGIT.test(src[i])) i++;
      }
      if (i < n && (WORD_CHAR.test(src[i]) || src[i] === '.')) {
        while (i < n && (WORD_CHAR.test(src[i]) || src[i] === '.')) i++;
        throw badNumber(src, start, i, line, col);
      }
      push('num', start, i, src.slice(start, i), Number(src.slice(start, i)));
      continue;
    }

    if (WORD_START.test(c) || (c === ':' && WORD_START.test(src[i + 1] ?? ''))) {
      const legacy = c === ':';
      const start = i;
      if (legacy) i++;
      const ws = i;
      while (i < n && WORD_CHAR.test(src[i])) i++;
      const word = normName(src.slice(ws, i));
      if (!legacy && word === 'ma' && src[i] === ':') {
        i++;
        push('ma', start, i, 'ma:');
        continue;
      }
      push('word', start, i, word, 0, legacy);
      continue;
    }

    if (c === '"') {
      const start = i;
      let j = i + 1;
      while (j < n && src[j] !== '"' && src[j] !== '\n') j++;
      if (src[j] !== '"') {
        throw new LogoError('Niezamknięty cudzysłów. Kolor zapisz jako "#rrggbb", np. "#16866a".', line, col);
      }
      const body = src.slice(i + 1, j);
      if (!/^#[0-9a-fA-F]{6}$/.test(body)) {
        throw new LogoError(
          `Nieprawidłowy kolor ${src.slice(i, j + 1)}. Kolor to # i sześć cyfr szesnastkowych, np. "#16866a".`,
          line, col,
        );
      }
      i = j + 1;
      push('color', start, i, body.toLowerCase());
      continue;
    }

    const two = src.slice(i, i + 2);
    if (two === '<=' || two === '>=' || two === '<>') { push('cmp', i, i + 2, two); i += 2; continue; }
    if (c === '<' || c === '>' || c === '=') { push('cmp', i, i + 1, c); i++; continue; }
    if (c === '+' || c === '-' || c === '*' || c === '/') { push('op', i, i + 1, c); i++; continue; }
    if (c === '[') { push('lbr', i, i + 1, c); i++; continue; }
    if (c === ']') { push('rbr', i, i + 1, c); i++; continue; }
    if (c === '(') { push('lpar', i, i + 1, c); i++; continue; }
    if (c === ')') { push('rpar', i, i + 1, c); i++; continue; }
    if (c === ',') { push('comma', i, i + 1, c); i++; continue; }
    if (c === ':') throw new LogoError('Po dwukropku musi stać nazwa, np. :bok.', line, col);
    throw new LogoError(`Nieznany znak „${c}”.`, line, col);
  }
  if (toks.length) toks[toks.length - 1].last = true;
  toks.push({
    t: 'eof', text: '', v: '', n: 0, line, col: i - lineStart + 1, pos: i,
    sb: true, sa: true, first: true, last: true,
  });
  return toks;
}

function badNumber(src: string, start: number, end: number, line: number, col: number) {
  return new LogoError(
    `Nieprawidłowa liczba „${src.slice(start, end)}”. Liczby zapisuj cyframi z kropką, np. 80, 12.5 lub .5.`,
    line, col,
  );
}

function lineCol(src: string, idx: number) {
  let line = 1;
  let last = -1;
  for (let k = 0; k < idx; k++) if (src[k] === '\n') { line++; last = k; }
  return { line, col: idx - last };
}

export function fmtInt(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  const r = Math.round(n * 1e6) / 1e6;
  return String(r).replace('.', ',');
}
