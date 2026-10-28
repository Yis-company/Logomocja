export const MAX_CHARS = 50000;
export const MAX_TOKENS = 10000;

export type TokType = 'num' | 'word' | 'str' | 'op' | 'cmp' | 'lbr' | 'rbr' | 'lpar' | 'rpar' | 'comma' | 'ma' | 'bad';

export interface Token {
  type: TokType;
  /** Tekst do porównań (słowa: małe litery, NFC; napisy: zawartość bez cudzysłowów). */
  text: string;
  line: number;
  col: number;
  start: number;
  end: number;
  wsBefore: boolean;
  wsAfter: boolean;
  firstOnLine: boolean;
  lastOnLine: boolean;
  value?: number;
  /** Słowo zapisane w starej formie `:nazwa`. */
  colon?: boolean;
  /** Komunikat dla tokenu błędnego. */
  msg?: string;
  /** Błąd limitu (zgłaszany od razu). */
  limit?: boolean;
}

const isLetter = (c: string) => /[\p{L}_]/u.test(c);
const isWordChar = (c: string) => /[\p{L}\p{N}_]/u.test(c);
const isDigit = (c: string) => c >= '0' && c <= '9';
const isWs = (c: string | undefined) => c === undefined || /\s/.test(c) || c === ';';

export interface LexResult {
  tokens: Token[];
  limitError?: Token;
}

export function lex(src: string): LexResult {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let lineStart = 0;
  const n = src.length;

  if (n > MAX_CHARS) {
    // pozycja pierwszego znaku ponad limitem
    let l = 1;
    let ls = 0;
    for (let k = 0; k < MAX_CHARS; k++) if (src[k] === '\n') { l++; ls = k + 1; }
    const tok = mk('bad', '', MAX_CHARS, MAX_CHARS + 1, l, MAX_CHARS - ls + 1);
    tok.msg = `Program jest za długi: limit to ${MAX_CHARS} znaków`;
    tok.limit = true;
    return { tokens: [tok], limitError: tok };
  }

  function mk(type: TokType, text: string, start: number, end: number, ln = line, col = start - lineStart + 1): Token {
    return {
      type, text, line: ln, col, start, end,
      wsBefore: start === 0 || isWs(src[start - 1]),
      wsAfter: end >= n || isWs(src[end]),
      firstOnLine: false, lastOnLine: false,
    };
  }
  function push(t: Token): boolean {
    if (tokens.length >= MAX_TOKENS) {
      t.type = 'bad';
      t.msg = `Za dużo tokenów: limit to ${MAX_TOKENS}`;
      t.limit = true;
      tokens.push(t);
      return false;
    }
    tokens.push(t);
    return true;
  }

  outer: while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; lineStart = i; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === ';') { while (i < n && src[i] !== '\n') i++; continue; }
    const start = i;
    let t: Token;
    if (isDigit(c) || (c === '.' && i + 1 < n && isDigit(src[i + 1]))) {
      while (i < n && isDigit(src[i])) i++;
      if (src[i] === '.' && i + 1 < n && isDigit(src[i + 1])) {
        i++;
        while (i < n && isDigit(src[i])) i++;
      }
      if (i < n && isWordChar(src[i])) {
        while (i < n && isWordChar(src[i])) i++;
        t = mk('bad', src.slice(start, i), start, i);
        t.msg = `Niepoprawna liczba „${src.slice(start, i)}”: dozwolone są tylko dziesiętne zapisy, np. 80, 12.5, .5`;
      } else {
        t = mk('num', src.slice(start, i), start, i);
        t.value = Number(src.slice(start, i));
      }
    } else if (isLetter(c) || (c === ':' && i + 1 < n && isLetter(src[i + 1]))) {
      const colon = c === ':';
      if (colon) i++;
      const ws = i;
      while (i < n && isWordChar(src[i])) i++;
      const text = src.slice(ws, i).normalize('NFC').toLowerCase();
      if (!colon && text === 'ma' && src[i] === ':') {
        i++;
        t = mk('ma', 'ma:', start, i);
      } else {
        t = mk('word', text, start, i);
        if (colon) t.colon = true;
      }
    } else if (c === '"') {
      let j = i + 1;
      while (j < n && src[j] !== '"' && src[j] !== '\n') j++;
      if (src[j] === '"') {
        i = j + 1;
        t = mk('str', src.slice(start + 1, j), start, i);
      } else {
        i = j;
        t = mk('bad', '"', start, start + 1);
        t.msg = 'Brakuje zamykającego cudzysłowu „"”';
      }
    } else if (c === '+' || c === '-' || c === '*' || c === '/') {
      i++;
      t = mk('op', c, start, i);
    } else if (c === '<' || c === '>' || c === '=') {
      const two = src.slice(i, i + 2);
      if (two === '<=' || two === '>=' || two === '<>') { i += 2; t = mk('cmp', two, start, i); }
      else { i++; t = mk('cmp', c, start, i); }
    } else if (c === '[') { i++; t = mk('lbr', c, start, i); }
    else if (c === ']') { i++; t = mk('rbr', c, start, i); }
    else if (c === '(') { i++; t = mk('lpar', c, start, i); }
    else if (c === ')') { i++; t = mk('rpar', c, start, i); }
    else if (c === ',') { i++; t = mk('comma', c, start, i); }
    else {
      i++;
      t = mk('bad', c, start, i);
      t.msg = `Nieznany znak „${c}”`;
    }
    if (!push(t)) {
      return { tokens, limitError: t };
    }
    if (t.type === 'bad') continue outer;
  }

  // firstOnLine / lastOnLine
  for (let k = 0; k < tokens.length; k++) {
    tokens[k].firstOnLine = k === 0 || tokens[k - 1].line !== tokens[k].line;
    tokens[k].lastOnLine = k === tokens.length - 1 || tokens[k + 1].line !== tokens[k].line;
  }
  return { tokens };
}
