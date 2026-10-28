import { keywordOf, normalizeName, type KeywordId } from './keywords';

export type TokenKind =
  | 'num'    // liczba bez znaku
  | 'word'   // nazwa lub słowo kluczowe (także :nazwa i ma:)
  | 'str'    // napis w cudzysłowie, np. "#16866a"
  | 'lbr' | 'rbr'   // [ ]
  | 'lpar' | 'rpar' // ( )
  | 'comma'
  | 'op'     // + - * /
  | 'cmp'    // < > = <= >= <>
  | 'bad';   // fragment, którego nie da się rozpoznać

export interface Token {
  kind: TokenKind;
  /** Tekst źródłowy tokenu. */
  text: string;
  /** Wiersz i kolumna (od 1, kolumna liczona w znakach). */
  line: number;
  col: number;
  /** Przesunięcie w źródle (jednostki UTF-16) – dla edytora. */
  start: number;
  end: number;
  /** Czy przed tokenem jest odstęp (spacja, nowy wiersz, komentarz, początek programu). */
  spaceBefore: boolean;
  /** Czy po tokenie jest odstęp (lub koniec programu). */
  spaceAfter: boolean;
  firstOnLine: boolean;
  lastOnLine: boolean;
  /** Dla 'num': wartość. */
  value?: number;
  /** Dla 'word': znormalizowana nazwa (bez dwukropka). */
  name?: string;
  /** Dla 'word': słowo kluczowe, jeśli nim jest. */
  keyword?: KeywordId;
  /** Dla 'word': zapis z dwukropkiem (:bok). */
  colon?: boolean;
  /** Dla 'str': zawartość między cudzysłowami. */
  str?: string;
  /** Dla 'bad': komunikat błędu. */
  error?: string;
}

export interface Comment {
  start: number;
  end: number;
}

export interface LexResult {
  tokens: Token[];
  comments: Comment[];
}

const QUOTES = new Set(['"', '“', '”', '„']);
const isDigit = (c: string) => c >= '0' && c <= '9';
const WORD_START = /[\p{L}_]/u;
const WORD_PART = /[\p{L}\p{M}\p{N}_]/u;
const isWordStart = (c: string) => WORD_START.test(c);
const isWordPart = (c: string) => WORD_PART.test(c);
const isSpace = (c: string) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v' || c === ' ' || c === '﻿';
/** Znaki kończące nieudany napis. */
const isStringStop = (c: string) => isSpace(c) || c === '[' || c === ']' || c === '(' || c === ')' || c === ';';

/**
 * Dzieli źródło na tokeny. Nigdy nie rzuca: błędne fragmenty stają się
 * tokenami 'bad' z komunikatem, żeby parser mógł zgłosić je we właściwej
 * kolejności, a podświetlanie składni mogło je pokazać.
 */
export function lex(source: string): LexResult {
  const tokens: Token[] = [];
  const comments: Comment[] = [];
  let i = 0;
  let line = 1;
  let col = 1;
  let space = true;
  const n = source.length;

  // Przesuwa się o jeden znak (punkt kodowy), aktualizując wiersz i kolumnę.
  const advance = () => {
    const c = source[i]!;
    if (c === '\r') {
      i++;
      if (source[i] === '\n') i++;
      line++; col = 1;
      return;
    }
    if (c === '\n') { i++; line++; col = 1; return; }
    const cp = source.codePointAt(i)!;
    i += cp > 0xffff ? 2 : 1;
    col++;
  };
  const charAt = (k: number) => {
    const cp = source.codePointAt(k);
    return cp === undefined ? '' : String.fromCodePoint(cp);
  };

  while (i < n) {
    const c = charAt(i);
    if (isSpace(c)) { advance(); space = true; continue; }
    if (c === ';') {
      const s = i;
      while (i < n && source[i] !== '\n' && source[i] !== '\r') advance();
      comments.push({ start: s, end: i });
      space = true;
      continue;
    }
    const start = i, tl = line, tc = col;
    const make = (kind: TokenKind, extra: Partial<Token> = {}): Token => {
      const t: Token = {
        kind, text: source.slice(start, i), line: tl, col: tc, start, end: i,
        spaceBefore: space, spaceAfter: true, firstOnLine: true, lastOnLine: true, ...extra,
      };
      tokens.push(t);
      space = false;
      return t;
    };

    if (isDigit(c) || (c === '.' && isDigit(charAt(i + 1)))) {
      while (i < n && isDigit(source[i]!)) advance();
      if (source[i] === '.' && isDigit(source[i + 1] ?? '')) {
        advance();
        while (i < n && isDigit(source[i]!)) advance();
      }
      const next = charAt(i);
      if (next === '.' || (next !== '' && isWordPart(next))) {
        while (i < n && (charAt(i) === '.' || isWordPart(charAt(i)))) advance();
        make('bad', {
          error: `Niepoprawna liczba „${source.slice(start, i)}”. Liczby zapisuj cyframi, np. 80, 12.5 lub .5.`,
        });
        continue;
      }
      const text = source.slice(start, i);
      const value = Number(text);
      if (!Number.isFinite(value)) {
        make('bad', { error: `Liczba „${text.length > 20 ? text.slice(0, 20) + '…' : text}” jest za duża.` });
        continue;
      }
      make('num', { value });
      continue;
    }

    if (isWordStart(c) || (c === ':' && isWordStart(charAt(i + 1)))) {
      const colon = c === ':';
      if (colon) advance();
      const nameStart = i;
      while (i < n && isWordPart(charAt(i))) advance();
      let name = normalizeName(source.slice(nameStart, i));
      if (!colon && name === 'ma' && source[i] === ':') {
        advance();
        name = 'ma:';
      }
      const keyword = colon || name === 'ma:' ? undefined : keywordOf(name);
      make('word', { name, keyword, colon });
      continue;
    }

    if (QUOTES.has(c)) {
      advance();
      let closed = false;
      while (i < n) {
        const d = charAt(i);
        if (QUOTES.has(d)) { advance(); closed = true; break; }
        if (isStringStop(d)) break;
        advance();
      }
      if (closed) {
        const text = source.slice(start, i);
        make('str', { str: [...text].slice(1, -1).join('') });
      } else {
        make('bad', {
          error: `Niepoprawny kolor ${source.slice(start, i)} – brakuje zamykającego cudzysłowu. Zapisz kolor jako "#rrggbb", np. "#16866a".`,
        });
      }
      continue;
    }

    advance();
    switch (c) {
      case '[': make('lbr'); break;
      case ']': make('rbr'); break;
      case '(': make('lpar'); break;
      case ')': make('rpar'); break;
      case ',': make('comma'); break;
      case '+': case '-': case '*': case '/': make('op'); break;
      case '<':
        if (source[i] === '=' || source[i] === '>') advance();
        make('cmp');
        break;
      case '>':
        if (source[i] === '=') advance();
        make('cmp');
        break;
      case '=': make('cmp'); break;
      default:
        make('bad', { error: `Nieznany znak „${c}”.` });
    }
  }

  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k]!;
    const prev = tokens[k - 1];
    const next = tokens[k + 1];
    t.spaceAfter = next ? next.spaceBefore : true;
    t.firstOnLine = !prev || prev.line < t.line;
    t.lastOnLine = !next || next.line > t.line;
  }
  return { tokens, comments };
}

/** Wiersz i kolumna dla przesunięcia w źródle (np. dla limitu długości). */
export function positionAt(source: string, offset: number): { line: number; col: number } {
  let line = 1, col = 1;
  for (let i = 0; i < offset && i < source.length;) {
    const ch = source[i]!;
    if (ch === '\r') { i++; if (source[i] === '\n') i++; line++; col = 1; continue; }
    if (ch === '\n') { i++; line++; col = 1; continue; }
    const cp = source.codePointAt(i)!;
    i += cp > 0xffff ? 2 : 1;
    col++;
  }
  return { line, col };
}
