import { LogoError } from './errors';

export const MAX_SOURCE = 50_000;
export const MAX_TOKENS = 10_000;

export type TokKind =
  | 'num' | 'word' | 'str' | 'lbr' | 'rbr' | 'lpar' | 'rpar' | 'comma' | 'op' | 'cmp';

export interface Tok {
  kind: TokKind;
  /** Tekst tokenu tak, jak stoi w źródle. */
  text: string;
  /** Dla słów: nazwa małymi literami, bez dwukropka na początku. */
  name: string;
  /** Słowo zapisane w formie `:nazwa`. */
  colon: boolean;
  value: number;
  line: number;
  col: number;
  offset: number;
  end: number;
  wsBefore: boolean;
  wsAfter: boolean;
  lineStart: boolean;
  lineEnd: boolean;
}

const isLetter = (c: string) => /[\p{L}_]/u.test(c);
const isWordChar = (c: string) => /[\p{L}\p{N}_]/u.test(c);
const isDigit = (c: string) => c >= '0' && c <= '9';
const isSpace = (c: string) => c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === '\f' || c === '\v' || c === ' ';

/** Pozycja (wiersz, kolumna) dla przesunięcia w tekście; kolumny liczone w punktach kodowych. */
function makeLocator(src: string) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') starts.push(i + 1);
  return (offset: number) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    const col = Array.from(src.slice(starts[lo], offset)).length + 1;
    return { line: lo + 1, col };
  };
}

export function lex(src: string): Tok[] {
  const locate = makeLocator(src);
  if (src.length > MAX_SOURCE) {
    const p = locate(MAX_SOURCE);
    throw new LogoError(`Program jest za długi: najwyżej ${fmtInt(MAX_SOURCE)} znaków, a ma ${fmtInt(src.length)}.`, p.line, p.col);
  }
  const toks: Tok[] = [];
  let i = 0;
  let sawSpace = true;
  let sawNewline = true;
  const err = (msg: string, at: number): never => {
    const p = locate(at);
    throw new LogoError(msg, p.line, p.col);
  };
  const push = (kind: TokKind, start: number, end: number, extra: Partial<Tok> = {}) => {
    if (toks.length >= MAX_TOKENS) {
      err(`Program ma za dużo elementów: najwyżej ${fmtInt(MAX_TOKENS)} (słów, liczb, znaków i nawiasów).`, start);
    }
    const p = locate(start);
    const prev = toks[toks.length - 1];
    if (prev) {
      prev.wsAfter = sawSpace;
      prev.lineEnd = sawNewline;
    }
    toks.push({
      kind, text: src.slice(start, end), name: '', colon: false, value: NaN,
      line: p.line, col: p.col, offset: start, end,
      wsBefore: sawSpace, wsAfter: true, lineStart: sawNewline, lineEnd: true,
      ...extra,
    });
    sawSpace = false;
    sawNewline = false;
  };

  while (i < src.length) {
    const c = src[i];
    if (isSpace(c)) {
      if (c === '\n') sawNewline = true;
      sawSpace = true;
      i++;
      continue;
    }
    if (c === ';') {
      while (i < src.length && src[i] !== '\n') i++;
      sawSpace = true;
      continue;
    }
    const start = i;
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1] ?? ''))) {
      while (isDigit(src[i] ?? '')) i++;
      if (src[i] === '.') {
        i++;
        if (!isDigit(src[i] ?? '')) {
          while (i < src.length && (isWordChar(src[i]) || src[i] === '.')) i++;
          err(`„${src.slice(start, i)}” nie jest poprawną liczbą. Liczby zapisuj tak: 80, 12.5 albo .5.`, start);
        }
        while (isDigit(src[i] ?? '')) i++;
      }
      if (i < src.length && (isWordChar(src[i]) || src[i] === '.')) {
        while (i < src.length && (isWordChar(src[i]) || src[i] === '.')) i++;
        err(`„${src.slice(start, i)}” nie jest poprawną liczbą. Liczby zapisuj tak: 80, 12.5 albo .5.`, start);
      }
      const value = Number(src.slice(start, i));
      if (!Number.isFinite(value)) err(`Liczba „${src.slice(start, Math.min(i, start + 12))}…” jest za duża.`, start);
      push('num', start, i, { value });
      continue;
    }
    if (isLetter(c) || (c === ':' && isLetter(src[i + 1] ?? ''))) {
      const colon = c === ':';
      if (colon) i++;
      while (i < src.length && isWordChar(src[i])) i++;
      // `ma:` w nagłówku procedury: dwukropek przyklejony do słowa.
      if (!colon && src[i] === ':') i++;
      const text = src.slice(start, i);
      push('word', start, i, { colon, name: (colon ? text.slice(1) : text).toLowerCase() });
      continue;
    }
    if (c === '"') {
      i++;
      while (i < src.length && src[i] !== '"' && src[i] !== '\n') i++;
      if (src[i] !== '"') err('Brakuje cudzysłowu zamykającego kolor. Pisz np. kolor "#16866a".', start);
      i++;
      push('str', start, i);
      continue;
    }
    const two = src.slice(i, i + 2);
    if (two === '<=' || two === '>=' || two === '<>') {
      i += 2;
      push('cmp', start, i);
      continue;
    }
    i++;
    switch (c) {
      case '[': push('lbr', start, i); break;
      case ']': push('rbr', start, i); break;
      case '(': push('lpar', start, i); break;
      case ')': push('rpar', start, i); break;
      case ',': push('comma', start, i); break;
      case '+': case '-': case '*': case '/': push('op', start, i); break;
      case '<': case '>': case '=': push('cmp', start, i); break;
      case ':': err('Po dwukropku powinna stać nazwa, np. :bok.', start); break;
      default: {
        const ch = String.fromCodePoint(src.codePointAt(start)!);
        err(`Nieznany znak „${ch}”.`, start);
      }
    }
  }
  const last = toks[toks.length - 1];
  if (last) {
    last.wsAfter = true;
    last.lineEnd = true;
  }
  return toks;
}

export function fmtInt(n: number): string {
  return n.toLocaleString('pl-PL').replace(/ /g, ' ');
}
