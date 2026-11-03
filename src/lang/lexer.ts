import { LogoError } from './errors';
import { keywordOf, normName, type Keyword } from './keywords';

export const MAX_SOURCE_CHARS = 50_000;
export const MAX_TOKENS = 10_000;

export type TokenType =
  | 'num' // unsigned decimal literal
  | 'word' // name or keyword, optionally written :name
  | 'str' // "quoted"
  | 'lbr' | 'rbr' // [ ]
  | 'lpar' | 'rpar' // ( )
  | 'op' // + - * /
  | 'cmp' // < > = <= >= <>
  | 'comma'
  | 'ma'; // ma: in a procedure header

export interface Token {
  type: TokenType;
  text: string;
  /** numeric value for num tokens, string content for str tokens */
  value?: number | string;
  /** normalised name for word tokens (no leading colon) */
  name?: string;
  /** keyword for word tokens written without a colon */
  kw?: Keyword;
  /** written as :name */
  colon?: boolean;
  line: number;
  col: number;
  offset: number;
  length: number;
  index: number;
  spaceBefore: boolean;
  spaceAfter: boolean;
  firstOnLine: boolean;
  lastOnLine: boolean;
}

const isLetter = (c: string) => /[\p{L}_]/u.test(c);
const isNameChar = (c: string) => /[\p{L}\p{N}\p{M}_]/u.test(c);
const isDigit = (c: string) => c >= '0' && c <= '9';
const isSpace = (c: string) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v' || c === ' ' || c === '﻿';

/**
 * Splits source into tokens. Comments (; to end of line) behave as whitespace.
 * Throws LogoError on characters or literals the dialect does not know.
 */
export function lex(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let col = 1;
  const n = source.length;

  if (n > MAX_SOURCE_CHARS) {
    const pos = positionOf(source, MAX_SOURCE_CHARS);
    throw new LogoError(
      `Program jest za długi: ma ${n.toLocaleString('pl-PL')} znaków, a limit to 50 000.`,
      pos,
    );
  }

  let sawSpace = true; // start of input counts as whitespace
  let lineHasToken = false;

  const advance = (count: number) => {
    for (let k = 0; k < count; k++) {
      const c = source[i];
      i++;
      if (c === '\n' || (c === '\r' && source[i] !== '\n')) {
        line++;
        col = 1;
        lineHasToken = false;
      } else {
        col++;
      }
    }
  };

  const push = (type: TokenType, start: number, startLine: number, startCol: number, extra: Partial<Token> = {}) => {
    if (tokens.length >= MAX_TOKENS) {
      throw new LogoError('Program ma za dużo elementów: limit to 10 000 (liczby, nazwy, znaki działań i nawiasy).', {
        line: startLine,
        col: startCol,
        length: i - start,
      });
    }
    const prev = tokens[tokens.length - 1];
    const tok: Token = {
      type,
      text: source.slice(start, i),
      line: startLine,
      col: startCol,
      offset: start,
      length: i - start,
      index: tokens.length,
      spaceBefore: sawSpace,
      spaceAfter: true,
      firstOnLine: !lineHasToken,
      lastOnLine: true,
      ...extra,
    };
    if (prev) {
      prev.spaceAfter = sawSpace;
      if (prev.line === tok.line) prev.lastOnLine = false;
    }
    tokens.push(tok);
    sawSpace = false;
    lineHasToken = true;
  };

  while (i < n) {
    const c = source[i];
    if (isSpace(c)) {
      sawSpace = true;
      advance(1);
      continue;
    }
    if (c === ';') {
      sawSpace = true;
      while (i < n && source[i] !== '\n' && source[i] !== '\r') advance(1);
      continue;
    }
    const start = i;
    const sl = line;
    const sc = col;

    if (isDigit(c) || (c === '.' && isDigit(source[i + 1] ?? ''))) {
      while (i < n && isDigit(source[i])) advance(1);
      if (source[i] === '.' && isDigit(source[i + 1] ?? '')) {
        advance(1);
        while (i < n && isDigit(source[i])) advance(1);
      }
      const next = source[i] ?? '';
      if (next === '.' || isNameChar(next)) {
        let j = i;
        while (j < n && (isNameChar(source[j]) || source[j] === '.' || source[j] === '+' && /e$/i.test(source.slice(start, j)))) j++;
        const bad = source.slice(start, j);
        throw new LogoError(
          `„${bad}” nie jest liczbą. Liczby zapisuj zwykłymi cyframi z kropką, np. 80, 12.5 albo .5.`,
          { line: sl, col: sc, length: j - start },
        );
      }
      const text = source.slice(start, i);
      const value = Number(text);
      if (!Number.isFinite(value)) {
        throw new LogoError(`Liczba ${text.slice(0, 20)}… jest za duża.`, { line: sl, col: sc, length: i - start });
      }
      push('num', start, sl, sc, { value });
      continue;
    }

    if (c === ':' && isLetter(source[i + 1] ?? '')) {
      advance(1);
      while (i < n && isNameChar(source[i])) advance(1);
      const raw = source.slice(start + 1, i);
      push('word', start, sl, sc, { name: normName(raw), colon: true });
      continue;
    }

    if (isLetter(c)) {
      while (i < n && isNameChar(source[i])) advance(1);
      const raw = source.slice(start, i);
      const name = normName(raw);
      if (name === 'ma' && source[i] === ':') {
        advance(1);
        push('ma', start, sl, sc);
        continue;
      }
      push('word', start, sl, sc, { name, kw: keywordOf(raw) });
      continue;
    }

    if (c === '"') {
      advance(1);
      while (i < n && source[i] !== '"' && source[i] !== '\n' && source[i] !== '\r') advance(1);
      if (source[i] !== '"') {
        throw new LogoError('Brakuje cudzysłowu zamykającego. Kolor zapisz w całości, np. "#16866a".', {
          line: sl,
          col: sc,
          length: i - start,
        });
      }
      advance(1);
      push('str', start, sl, sc, { value: source.slice(start + 1, i - 1) });
      continue;
    }

    if (c === '[') { advance(1); push('lbr', start, sl, sc); continue; }
    if (c === ']') { advance(1); push('rbr', start, sl, sc); continue; }
    if (c === '(') { advance(1); push('lpar', start, sl, sc); continue; }
    if (c === ')') { advance(1); push('rpar', start, sl, sc); continue; }
    if (c === ',') { advance(1); push('comma', start, sl, sc); continue; }
    if (c === '+' || c === '-' || c === '*' || c === '/') { advance(1); push('op', start, sl, sc); continue; }
    if (c === '<') {
      advance(1);
      if (source[i] === '=' || source[i] === '>') advance(1);
      push('cmp', start, sl, sc);
      continue;
    }
    if (c === '>') {
      advance(1);
      if (source[i] === '=') advance(1);
      push('cmp', start, sl, sc);
      continue;
    }
    if (c === '=') { advance(1); push('cmp', start, sl, sc); continue; }

    const cp = source.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    let hint = '';
    if (ch === ':') hint = ' Dwukropek może stać tylko przed nazwą, np. :bok.';
    else if (ch === '‘' || ch === '’' || ch === '“' || ch === '”' || ch === '„' || ch === "'")
      hint = ' Kolor zapisz w zwykłym cudzysłowie: "#16866a".';
    else if (ch === '{' || ch === '}') hint = ' Treść powtórzenia ujmij w nawiasy kwadratowe [ ].';
    throw new LogoError(`Nieznany znak „${ch}”.${hint}`, { line: sl, col: sc, length: ch.length });
  }

  if (tokens.length) tokens[tokens.length - 1].spaceAfter = true;
  return tokens;
}

function positionOf(source: string, offset: number) {
  let line = 1;
  let col = 1;
  for (let k = 0; k < offset; k++) {
    const c = source[k];
    if (c === '\n' || (c === '\r' && source[k + 1] !== '\n')) {
      line++;
      col = 1;
    } else col++;
  }
  return { line, col };
}
