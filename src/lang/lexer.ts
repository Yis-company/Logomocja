import { LogoError, q } from './errors';
import { normaliseName } from './keywords';

export type TokenType =
  | 'num' // liczba
  | 'word' // słowo: polecenie, nazwa, `ma:`, `:nazwa`
  | 'str' // napis w cudzysłowie (literał koloru)
  | 'op' // + - * /
  | 'cmp' // < > = <= >= <>
  | '['
  | ']'
  | '('
  | ')'
  | ',';

export interface Token {
  type: TokenType;
  /** Tekst tokenu dokładnie tak, jak w źródle. */
  text: string;
  /** Dla słów: nazwa znormalizowana (małe litery, bez dwukropka). */
  lower: string;
  /** Dla liczb: wartość. */
  value: number;
  /** Słowo zapisane z dwukropkiem, np. `:bok`. */
  colon: boolean;
  line: number;
  col: number;
  /** Przesunięcie w źródle (jednostki kodu UTF-16). */
  offset: number;
  end: number;
  /** Czy przed tokenem jest biały znak (lub początek programu). */
  spaceBefore: boolean;
  /** Czy po tokenie jest biały znak (lub koniec programu). */
  spaceAfter: boolean;
  /** Czy token jest pierwszy w swoim wierszu. */
  lineStart: boolean;
  /** Czy token jest ostatni w swoim wierszu. */
  lineEnd: boolean;
  /** Numer tokenu (od 0). */
  index: number;
}

export const MAX_SOURCE_CHARS = 50_000;
export const MAX_TOKENS = 10_000;

const WORD_START = /[\p{L}_]/u;
const WORD_PART = /[\p{L}\p{M}\p{N}_]/u;
const DIGIT = /[0-9]/;

function isSpace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f' || ch === '\v' || ch === ' ' || ch === '﻿';
}

/** Pozycja (wiersz, kolumna) danego przesunięcia w źródle. */
export function positionAt(source: string, offset: number): { line: number; col: number } {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source.charCodeAt(i) === 10) {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, col: offset - lineStart + 1 };
}

export function tokenize(source: string): Token[] {
  const chars = Array.from(source);
  if (chars.length > MAX_SOURCE_CHARS) {
    // Przesunięcie pierwszego znaku ponad limit.
    let offset = 0;
    for (let i = 0; i < MAX_SOURCE_CHARS; i++) offset += chars[i].length;
    throw new LogoError(
      `Program jest za długi: ma ${chars.length.toLocaleString('pl-PL')} znaków, a limit to 50 000.`,
      positionAt(source, offset),
    );
  }

  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let lineOffset = 0;
  let sawSpace = true;
  let atLineStart = true;
  const n = source.length;

  const push = (type: TokenType, start: number, end: number, extra: Partial<Token> = {}) => {
    if (tokens.length >= MAX_TOKENS) {
      throw new LogoError('Program ma za dużo elementów: limit to 10 000 tokenów.', {
        line,
        col: start - lineOffset + 1,
      });
    }
    const text = source.slice(start, end);
    const tok: Token = {
      type,
      text,
      lower: text,
      value: 0,
      colon: false,
      line,
      col: start - lineOffset + 1,
      offset: start,
      end,
      spaceBefore: sawSpace,
      spaceAfter: true,
      lineStart: atLineStart,
      lineEnd: true,
      index: tokens.length,
      ...extra,
    };
    const prev = tokens[tokens.length - 1];
    if (prev) {
      prev.spaceAfter = sawSpace;
      prev.lineEnd = atLineStart;
    }
    tokens.push(tok);
    sawSpace = false;
    atLineStart = false;
  };

  const err = (message: string, at: number): never => {
    throw new LogoError(message, { line, col: at - lineOffset + 1 });
  };

  while (i < n) {
    const ch = source[i];
    if (ch === '\n') {
      i++;
      line++;
      lineOffset = i;
      sawSpace = true;
      atLineStart = true;
      continue;
    }
    if (isSpace(ch)) {
      i++;
      sawSpace = true;
      continue;
    }
    if (ch === ';') {
      while (i < n && source[i] !== '\n') i++;
      sawSpace = true;
      continue;
    }
    const start = i;
    if (DIGIT.test(ch) || (ch === '.' && i + 1 < n && DIGIT.test(source[i + 1]))) {
      while (i < n && DIGIT.test(source[i])) i++;
      if (source[i] === '.') {
        i++;
        if (!(i < n && DIGIT.test(source[i]))) {
          err(`Niepoprawna liczba ${q(source.slice(start, i))}: po kropce muszą stać cyfry.`, start);
        }
        while (i < n && DIGIT.test(source[i])) i++;
      }
      if (i < n && (WORD_PART.test(source[i]) || source[i] === '.')) {
        let j = i;
        while (j < n && (WORD_PART.test(source[j]) || source[j] === '.')) j++;
        err(
          `Niepoprawna liczba ${q(source.slice(start, j))}. Liczby zapisuje się cyframi, np. 80, 12.5 lub .5.`,
          start,
        );
      }
      const text = source.slice(start, i);
      const value = Number(text);
      if (!Number.isFinite(value)) err(`Liczba ${q(text)} jest za duża.`, start);
      push('num', start, i, { value });
      continue;
    }
    if (WORD_START.test(ch) || ch === ':') {
      let colon = false;
      if (ch === ':') {
        colon = true;
        i++;
        if (!(i < n && WORD_START.test(source[i]))) {
          err('Po dwukropku powinna stać nazwa, np. :bok.', start);
        }
      }
      while (i < n && WORD_PART.test(source[i])) i++;
      let word = source.slice(colon ? start + 1 : start, i);
      if (!colon && normaliseName(word) === 'ma' && source[i] === ':') {
        i++;
        word = 'ma:';
      }
      push('word', start, i, { lower: normaliseName(word), colon });
      continue;
    }
    if (ch === '"') {
      i++;
      while (i < n && source[i] !== '"' && source[i] !== '\n') i++;
      if (source[i] !== '"') err('Brakuje cudzysłowu zamykającego napis. Kolor zapisuje się tak: "#16866a".', start);
      i++;
      push('str', start, i, { lower: source.slice(start + 1, i - 1).toLowerCase() });
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      i++;
      push('op', start, i);
      continue;
    }
    if (ch === '<' || ch === '>' || ch === '=') {
      i++;
      if (ch === '<' && (source[i] === '=' || source[i] === '>')) i++;
      else if (ch === '>' && source[i] === '=') i++;
      push('cmp', start, i);
      continue;
    }
    if (ch === '[' || ch === ']' || ch === '(' || ch === ')' || ch === ',') {
      i++;
      push(ch, start, i);
      continue;
    }
    const cp = String.fromCodePoint(source.codePointAt(i)!);
    err(`Nieznany znak ${q(cp)}.`, start);
  }
  const last = tokens[tokens.length - 1];
  if (last) {
    last.spaceAfter = true;
    last.lineEnd = true;
  }
  return tokens;
}
