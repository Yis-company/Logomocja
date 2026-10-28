import { keywordOf, nameKey, type Keyword } from './keywords';
import type { SourceSpan } from './errors';

export type TokenType =
  | 'num' | 'name' | 'param' | 'ma' | 'str'
  | 'op' | 'cmp' | '[' | ']' | '(' | ')' | ','
  | 'comment' | 'error' | 'eof';

export interface Token extends SourceSpan {
  type: TokenType;
  /** Raw text as written in the source. */
  text: string;
  /** Numeric value of a number literal. */
  value?: number;
  /** Normalised name (NFC, lower case) for names and `:name`. */
  key?: string;
  /** Keyword this name spells, if any. */
  kw?: Keyword;
  /** Content of a string literal (without the quotes). */
  str?: string;
  /** Whitespace (or the start/end of the text) directly before/after the token. */
  spaceBefore: boolean;
  spaceAfter: boolean;
  /** Message of an `error` token. */
  message?: string;
}

const NAME_START = /[\p{L}\p{M}_]/u;
const NAME_CHAR = /[\p{L}\p{M}\p{N}_]/u;
const NUMBER_CHAR = /[\p{L}\p{M}\p{N}_.]/u;
const NUMBER_RE = /^(?:\d+(?:\.\d+)?|\.\d+)$/;

function isSpace(ch: string | undefined): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f' || ch === '\v' || ch === ' ' || ch === '﻿';
}

/**
 * Splits a source text into tokens. Never throws: malformed input becomes
 * `error` tokens so that the parser can report problems in source order.
 * Comments are included only when `withComments` is set (for highlighting).
 */
export function tokenize(src: string, withComments = false): Token[] {
  const tokens: Token[] = [];
  const n = src.length;
  let i = 0;
  let line = 1;
  let lineStart = 0;

  const push = (type: TokenType, start: number, end: number, extra?: Partial<Token>): Token => {
    const tok: Token = {
      type,
      text: src.slice(start, end),
      line,
      col: start - lineStart + 1,
      offset: start,
      end,
      spaceBefore: start === 0 || isSpace(src[start - 1]),
      spaceAfter: end >= n || isSpace(src[end]) || src[end] === ';',
      ...extra,
    };
    tokens.push(tok);
    return tok;
  };

  while (i < n) {
    const ch = src[i];
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      i++;
      line++;
      lineStart = i;
      continue;
    }
    if (isSpace(ch)) {
      i++;
      continue;
    }
    if (ch === ';') {
      let j = i;
      while (j < n && src[j] !== '\n' && src[j] !== '\r') j++;
      if (withComments) push('comment', i, j);
      i = j;
      continue;
    }
    const start = i;
    if (ch === '[' || ch === ']' || ch === '(' || ch === ')' || ch === ',') {
      push(ch, i, i + 1);
      i++;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      push('op', i, i + 1);
      i++;
      continue;
    }
    if (ch === '<' || ch === '>' || ch === '=') {
      let j = i + 1;
      if (ch === '<' && (src[j] === '=' || src[j] === '>')) j++;
      else if (ch === '>' && src[j] === '=') j++;
      push('cmp', i, j);
      i = j;
      continue;
    }
    if (ch === '"') {
      let j = i + 1;
      while (j < n && src[j] !== '"' && src[j] !== '\n' && src[j] !== '\r') j++;
      if (src[j] === '"') {
        push('str', i, j + 1, { str: src.slice(i + 1, j) });
        i = j + 1;
      } else {
        push('error', i, j, { message: 'Brakuje cudzysłowu zamykającego tekst. Kolor zapisz tak: "#16866a".' });
        i = j;
      }
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < n && NUMBER_CHAR.test(src[j])) j++;
      const text = src.slice(i, j);
      if (NUMBER_RE.test(text)) {
        const value = Number(text);
        if (Number.isFinite(value)) push('num', i, j, { value });
        else push('error', i, j, { message: `Liczba „${text}” jest za duża.` });
      } else {
        push('error', i, j, { message: `„${text}” nie jest poprawną liczbą. Liczby zapisuj cyframi, z kropką dziesiętną, np. 80, 12.5 albo .5.` });
      }
      i = j;
      continue;
    }
    if (NAME_START.test(ch)) {
      let j = i;
      while (j < n && NAME_CHAR.test(src[j])) j++;
      const text = src.slice(i, j);
      const key = nameKey(text);
      if (key === 'ma' && src[j] === ':') {
        push('ma', i, j + 1);
        i = j + 1;
        continue;
      }
      push('name', i, j, { key, kw: keywordOf(key) });
      i = j;
      continue;
    }
    if (ch === ':') {
      let j = i + 1;
      if (j < n && NAME_START.test(src[j])) {
        while (j < n && NAME_CHAR.test(src[j])) j++;
        const text = src.slice(i + 1, j);
        const key = nameKey(text);
        push('param', i, j, { key, kw: keywordOf(key) });
      } else {
        push('error', i, i + 1, { message: 'Po dwukropku powinna stać nazwa parametru, np. :bok.' });
        j = i + 1;
      }
      i = j;
      continue;
    }
    // Anything else is a character the language does not know.
    const cp = src.codePointAt(i)!;
    const len = cp > 0xffff ? 2 : 1;
    let message = `Nieznany znak „${String.fromCodePoint(cp)}”.`;
    if (ch === '#') {
      let j = i + 1;
      while (j < n && NAME_CHAR.test(src[j])) j++;
      push('error', start, j, { message: `Kolor zapisz w cudzysłowie, np. "${src.slice(i, j)}".` });
      i = j;
      continue;
    }
    if (ch === '„' || ch === '”' || ch === '“' || ch === '«' || ch === '»') {
      message = 'Użyj zwykłego cudzysłowu " zamiast drukarskiego.';
    } else if (ch === '{' || ch === '}') {
      message = `Nieznany znak „${ch}”. Treść powtórzeń i warunków ujmij w nawiasy kwadratowe [ ].`;
    } else if (ch === '!') {
      message = 'Nieznany znak „!”. Do porównania „różne od” użyj <>.';
    }
    push('error', i, i + len, { message });
    i += len;
  }
  tokens.push({
    type: 'eof', text: '', line, col: i - lineStart + 1, offset: n, end: n,
    spaceBefore: true, spaceAfter: true,
  });
  return tokens;
}
