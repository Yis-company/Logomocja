import { LIMITS } from './limits';
import { normalizeName } from './keywords';

export type TokenKind =
  | 'num' // liczba bez znaku
  | 'word' // nazwa lub słowo kluczowe
  | 'cname' // :nazwa (zapis dawny)
  | 'str' // "..." (literał koloru)
  | 'op' // + - * /
  | 'cmp' // < > = <= >= <>
  | 'lbr' | 'rbr' // [ ]
  | 'lpar' | 'rpar' // ( )
  | 'comma'
  | 'colon'
  | 'err'; // błąd leksykalny — zgłaszany dopiero, gdy parser do niego dojdzie

export interface Token {
  kind: TokenKind;
  /** Tekst z kodu źródłowego. */
  text: string;
  /** Wartość liczby. */
  value: number;
  /** Znormalizowana nazwa (małe litery) dla `word` i `cname`. */
  name: string;
  line: number;
  col: number;
  start: number;
  end: number;
  spaceBefore: boolean;
  spaceAfter: boolean;
  firstOnLine: boolean;
  lastOnLine: boolean;
  /** Komunikat dla `err`. */
  message: string;
}

export interface LexResult {
  tokens: Token[];
  /** Zakresy komentarzy (offsety początku i końca) — do podświetlania. */
  comments: Array<[number, number]>;
}

export interface LexOptions {
  /** Egzekwuj limity liczby symboli (domyślnie tak). */
  limits?: boolean;
}

const WORD_START = /[\p{L}_]/u;
const WORD_PART = /[\p{L}\p{M}\p{N}_]/u;
const WS = /\s/;

function isDigit(c: string): boolean {
  return c >= '0' && c <= '9';
}

function charAtCp(src: string, i: number): string {
  const cp = src.codePointAt(i);
  return cp === undefined ? '' : String.fromCodePoint(cp);
}

export function lex(source: string, options: LexOptions = {}): LexResult {
  const limits = options.limits !== false;
  const tokens: Token[] = [];
  const comments: Array<[number, number]> = [];
  const n = source.length;
  let i = 0;
  let line = 1;
  let lineStart = 0;
  let lastTokenLine = 0;
  let stop = false;

  const push = (kind: TokenKind, start: number, end: number, extra: Partial<Token> = {}): Token | null => {
    if (limits && tokens.length >= LIMITS.maxTokens) {
      // 10 001. symbol: błąd limitu, dalsza analiza nie ma sensu.
      tokens.push(makeToken('err', start, end, {
        message: `Przekroczono limit ${LIMITS.maxTokens.toLocaleString('pl-PL')} symboli w programie.`,
      }));
      stop = true;
      return null;
    }
    const t = makeToken(kind, start, end, extra);
    tokens.push(t);
    return t;
  };

  const makeToken = (kind: TokenKind, start: number, end: number, extra: Partial<Token>): Token => {
    const prev = start > 0 ? source[start - 1]! : '';
    const next = end < n ? source[end]! : '';
    const t: Token = {
      kind,
      text: source.slice(start, end),
      value: 0,
      name: '',
      line,
      col: start - lineStart + 1,
      start,
      end,
      spaceBefore: start === 0 || WS.test(prev),
      spaceAfter: end >= n || WS.test(next) || next === ';',
      firstOnLine: lastTokenLine !== line,
      lastOnLine: false,
      message: '',
      ...extra,
    };
    lastTokenLine = line;
    return t;
  };

  while (i < n && !stop) {
    const c = source[i]!;

    // Białe znaki i nowe linie.
    if (c === '\n') {
      i++;
      line++;
      lineStart = i;
      continue;
    }
    if (c === '\r') {
      i++;
      if (source[i] === '\n') i++;
      line++;
      lineStart = i;
      continue;
    }
    if (c === ' ' || c === '\t' || WS.test(c) || c === '﻿') {
      i++;
      continue;
    }

    // Komentarz do końca wiersza.
    if (c === ';') {
      const s = i;
      while (i < n && source[i] !== '\n' && source[i] !== '\r') i++;
      comments.push([s, i]);
      continue;
    }

    const start = i;

    // Liczby: 80, 12.5, .5 — a wszystko inne, co zaczyna się jak liczba, jest błędem.
    if (isDigit(c) || (c === '.' && i + 1 < n && isDigit(source[i + 1]!))) {
      let j = i;
      while (j < n && isDigit(source[j]!)) j++;
      if (source[j] === '.' && j + 1 < n && isDigit(source[j + 1]!)) {
        j++;
        while (j < n && isDigit(source[j]!)) j++;
      }
      const after = j < n ? charAtCp(source, j) : '';
      if (after !== '' && (after === '.' || WORD_PART.test(after))) {
        // np. 1e3, 0x10, 5., 1.2.3, 10pw
        while (j < n) {
          const ch = charAtCp(source, j);
          if (ch === '.' || WORD_PART.test(ch)) j += ch.length;
          else break;
        }
        const raw = source.slice(start, j);
        push('err', start, j, {
          message: `Niepoprawna liczba „${raw}”. Liczby zapisujemy dziesiętnie, np. 80, 12.5 lub .5 (bez znaku, bez notacji wykładniczej).`,
        });
        i = j;
        continue;
      }
      const raw = source.slice(start, j);
      const value = Number(raw);
      if (!Number.isFinite(value)) {
        push('err', start, j, { message: `Liczba „${raw.length > 24 ? raw.slice(0, 24) + '…' : raw}” jest zbyt duża.` });
      } else {
        push('num', start, j, { value });
      }
      i = j;
      continue;
    }

    // Słowa (nazwy i słowa kluczowe).
    const cp = charAtCp(source, i);
    if (WORD_START.test(cp)) {
      let j = i + cp.length;
      while (j < n) {
        const ch = charAtCp(source, j);
        if (WORD_PART.test(ch)) j += ch.length;
        else break;
      }
      push('word', start, j, { name: normalizeName(source.slice(start, j)) });
      i = j;
      continue;
    }

    switch (c) {
      case '"': {
        let j = i + 1;
        while (j < n && source[j] !== '"' && source[j] !== '\n' && source[j] !== '\r') j++;
        if (j >= n || source[j] !== '"') {
          push('err', start, j, { message: 'Niezamknięty cudzysłów. Kolor zapisujemy tak: "#16866a".' });
          i = j;
        } else {
          push('str', start, j + 1);
          i = j + 1;
        }
        continue;
      }
      case ':': {
        const nextCh = i + 1 < n ? charAtCp(source, i + 1) : '';
        const prevIsWord = i > 0 && WORD_PART.test(charAtCp(source, i - 1)) ;
        if (nextCh !== '' && WORD_START.test(nextCh) && !prevIsWord) {
          let j = i + 1 + nextCh.length;
          while (j < n) {
            const ch = charAtCp(source, j);
            if (WORD_PART.test(ch)) j += ch.length;
            else break;
          }
          push('cname', start, j, { name: normalizeName(source.slice(i + 1, j)) });
          i = j;
        } else {
          push('colon', start, i + 1);
          i++;
        }
        continue;
      }
      case '+': case '-': case '*': case '/':
        push('op', start, i + 1);
        i++;
        continue;
      case '<':
        if (source[i + 1] === '=' || source[i + 1] === '>') {
          push('cmp', start, i + 2);
          i += 2;
        } else {
          push('cmp', start, i + 1);
          i++;
        }
        continue;
      case '>':
        if (source[i + 1] === '=') {
          push('cmp', start, i + 2);
          i += 2;
        } else {
          push('cmp', start, i + 1);
          i++;
        }
        continue;
      case '=':
        push('cmp', start, i + 1);
        i++;
        continue;
      case '[': push('lbr', start, i + 1); i++; continue;
      case ']': push('rbr', start, i + 1); i++; continue;
      case '(': push('lpar', start, i + 1); i++; continue;
      case ')': push('rpar', start, i + 1); i++; continue;
      case ',': push('comma', start, i + 1); i++; continue;
      default: {
        const bad = charAtCp(source, i);
        push('err', start, i + bad.length, { message: `Nieoczekiwany znak „${bad}”.` });
        i += bad.length;
        continue;
      }
    }
  }

  // lastOnLine: ostatni symbol w wierszu.
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k]!;
    const nx = tokens[k + 1];
    t.lastOnLine = !nx || nx.line !== t.line;
  }

  return { tokens, comments };
}

/** Pozycja (1-based) dla offsetu w źródle. */
export function positionOf(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lineStart = 0;
  const end = Math.min(offset, source.length);
  for (let i = 0; i < end; i++) {
    const c = source[i];
    if (c === '\n') {
      line++;
      lineStart = i + 1;
    } else if (c === '\r') {
      if (source[i + 1] === '\n') i++;
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: offset - lineStart + 1 };
}
