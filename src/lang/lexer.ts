import { LIMITS, LogoErr } from './types';
import { norm } from './keywords';

export type TokKind =
  | 'num' | 'word' | 'colon' | 'str' | 'op' | 'cmp'
  | 'lbr' | 'rbr' | 'lpar' | 'rpar' | 'comma' | 'bad';

export interface Token {
  kind: TokKind;
  text: string;
  line: number;
  col: number;
  /** Normalised name for words (without the leading ':'). */
  name: string;
  /** Word written as ":name". */
  colonName: boolean;
  value: number;
  spaceBefore: boolean;
  spaceAfter: boolean;
  /** First / last token on its line. */
  first: boolean;
  last: boolean;
  /** Message of a malformed token. */
  msg: string;
}

const isWs = (c: string | undefined) => c === undefined || c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v' || c === ' ';
const isDigit = (c: string | undefined) => c !== undefined && c >= '0' && c <= '9';
const identRe = /[\p{L}\p{M}\p{N}_]/u;
const isIdStart = (c: string | undefined) => c !== undefined && /[\p{L}_]/u.test(c);
const isIdPart = (c: string | undefined) => c !== undefined && identRe.test(c);

export function lex(src: string): Token[] {
  if (src.length > LIMITS.chars) {
    let line = 1;
    let col = 1;
    for (let i = 0; i < LIMITS.chars; i++) {
      if (src[i] === '\n') { line++; col = 1; } else col++;
    }
    throw new LogoErr(`Program jest za długi: limit to ${LIMITS.chars} znaków.`, line, col);
  }
  const toks: Token[] = [];
  let i = 0;
  let line = 1;
  let lineStart = 0;
  const n = src.length;

  const push = (kind: TokKind, start: number, end: number, extra: Partial<Token> = {}) => {
    if (toks.length >= LIMITS.tokens) {
      throw new LogoErr(`Za dużo elementów programu: limit to ${LIMITS.tokens}.`, line, start - lineStart + 1);
    }
    const text = src.slice(start, end);
    const t: Token = {
      kind, text, line, col: start - lineStart + 1, name: '', colonName: false, value: 0,
      spaceBefore: start === 0 || isWs(src[start - 1]),
      spaceAfter: end >= n || isWs(src[end]) || src[end] === ';',
      first: false, last: false, msg: '', ...extra,
    };
    toks.push(t);
  };

  while (i < n) {
    const c = src[i];
    if (c === '\n') { i++; line++; lineStart = i; continue; }
    if (isWs(c)) { i++; continue; }
    if (c === ';') { while (i < n && src[i] !== '\n') i++; continue; }
    const start = i;
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1]))) {
      while (isDigit(src[i])) i++;
      let bad = false;
      if (src[i] === '.') {
        if (isDigit(src[i + 1])) { i++; while (isDigit(src[i])) i++; } else if (c !== '.') { i++; bad = true; }
      }
      if (isIdPart(src[i])) bad = true;
      if (bad) {
        while (isIdPart(src[i]) || src[i] === '.') i++;
        const text = src.slice(start, i);
        push('bad', start, i, { msg: `Nieprawidłowa liczba „${text}”. Liczba to zapis dziesiętny, np. 80, 12.5 albo .5.` });
      } else {
        const text = src.slice(start, i);
        push('num', start, i, { value: Number(text) });
      }
      continue;
    }
    if (isIdStart(c) || (c === ':' && isIdStart(src[i + 1]))) {
      const colon = c === ':';
      if (colon) i++;
      const s2 = i;
      while (i < n && isIdPart(src[i])) i++;
      const name = norm(src.slice(s2, i));
      push('word', start, i, { name, colonName: colon });
      if (!colon && name === 'ma' && src[i] === ':') {
        push('colon', i, i + 1);
        i++;
      }
      continue;
    }
    if (c === '"') {
      i++;
      while (i < n && src[i] !== '"' && src[i] !== '\n') i++;
      if (src[i] === '"') {
        i++;
        push('str', start, i);
      } else {
        push('bad', start, i, { msg: 'Niezamknięty napis: brakuje końcowego cudzysłowu.' });
      }
      continue;
    }
    i++;
    switch (c) {
      case '[': push('lbr', start, i); break;
      case ']': push('rbr', start, i); break;
      case '(': push('lpar', start, i); break;
      case ')': push('rpar', start, i); break;
      case ',': push('comma', start, i); break;
      case ':': push('colon', start, i); break;
      case '+': case '-': case '*': case '/': push('op', start, i); break;
      case '=': push('cmp', start, i); break;
      case '<':
        if (src[i] === '=' || src[i] === '>') i++;
        push('cmp', start, i);
        break;
      case '>':
        if (src[i] === '=') i++;
        push('cmp', start, i);
        break;
      default: {
        const cp = String.fromCodePoint(src.codePointAt(start)!);
        i = start + cp.length;
        push('bad', start, i, { msg: `Nieoczekiwany znak „${cp}”.` });
      }
    }
  }
  for (let k = 0; k < toks.length; k++) {
    toks[k].first = k === 0 || toks[k - 1].line !== toks[k].line;
    toks[k].last = k === toks.length - 1 || toks[k + 1].line !== toks[k].line;
  }
  return toks;
}

