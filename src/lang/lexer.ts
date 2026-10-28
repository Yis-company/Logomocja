import { LIMITS } from './limits';
import { type Position } from './errors';

export type TokenType =
  | 'word' // command, keyword or name
  | 'number'
  | 'string' // "...", a colour literal when well formed
  | 'colonvar' // :name, the legacy way to refer to a variable or parameter
  | 'colon'
  | 'punct' // [ ] ( ) ,
  | 'op' // + - * / < > = <= >= <>
  | 'newline'
  | 'error'
  | 'eof';

export interface Token extends Position {
  type: TokenType;
  /** Raw source text of the token. */
  text: string;
  /** Lower-cased, NFC-normalised name for words and colonvars; content for strings. */
  name: string;
  value: number;
  offset: number;
  length: number;
  /** Whitespace (or line start/end, or a comment) directly before the token. */
  spaceBefore: boolean;
  /** Whitespace (or line end, or a comment) directly after the token. */
  spaceAfter: boolean;
  /** Message for error tokens. */
  message?: string;
}

const NAME_START = /[\p{L}_]/u;
const NAME_RE = /[\p{L}_][\p{L}\p{N}\p{M}_]*/uy;
const NUMBER_RE = /(?:\d+(?:\.\d+)?|\.\d+)/y;

function isBlank(ch: string | undefined): boolean {
  return ch === undefined || ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n' || ch === ';' || ch === '\f' || ch === '\v' || ch === ' ';
}

/**
 * Splits source text into tokens. Never throws: problems become `error` tokens,
 * and the parser reports the first one it meets, so errors come out in source order.
 */
export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let line = 1;
  let lineStart = 0;
  let i = 0;
  let counted = 0;

  const push = (type: TokenType, start: number, length: number, extra: Partial<Token> = {}): void => {
    const token: Token = {
      type,
      text: source.slice(start, start + length),
      name: '',
      value: 0,
      offset: start,
      length,
      line,
      column: start - lineStart + 1,
      spaceBefore: start === 0 || isBlank(source[start - 1]),
      spaceAfter: isBlank(source[start + length]),
      ...extra,
    };
    if (type !== 'newline' && type !== 'eof') {
      counted++;
      if (counted > LIMITS.tokens && type !== 'error') {
        tokens.push({ ...token, type: 'error', message: `Program ma za dużo tokenów (limit ${LIMITS.tokens}).` });
        i = source.length;
        return;
      }
    }
    tokens.push(token);
  };

  while (i < source.length) {
    const ch = source[i]!;

    if (ch === '\n') {
      push('newline', i, 1);
      i++;
      line++;
      lineStart = i;
      continue;
    }
    if (ch === ' ' || ch === '\t' || ch === '\r' || ch === '\f' || ch === '\v' || ch === ' ') {
      i++;
      continue;
    }
    if (ch === ';') {
      while (i < source.length && source[i] !== '\n') i++;
      continue;
    }
    if (ch === '"') {
      const close = source.indexOf('"', i + 1);
      const newline = source.indexOf('\n', i + 1);
      if (close === -1 || (newline !== -1 && newline < close)) {
        const end = newline === -1 ? source.length : newline;
        push('error', i, end - i, { message: 'Niezamknięty ciąg znaków: brakuje zamykającego cudzysłowu.' });
        i = end;
        continue;
      }
      const content = source.slice(i + 1, close);
      push('string', i, close - i + 1, { name: content });
      i = close + 1;
      continue;
    }
    if ((ch >= '0' && ch <= '9') || (ch === '.' && source[i + 1] !== undefined && source[i + 1]! >= '0' && source[i + 1]! <= '9')) {
      NUMBER_RE.lastIndex = i;
      const m = NUMBER_RE.exec(source);
      const text = m ? m[0] : ch;
      push('number', i, text.length, { value: Number(text) });
      i += text.length;
      continue;
    }
    if (NAME_START.test(ch)) {
      NAME_RE.lastIndex = i;
      const m = NAME_RE.exec(source)!;
      const text = m[0];
      push('word', i, text.length, { name: text.normalize('NFC').toLowerCase() });
      i += text.length;
      continue;
    }
    if (ch === ':') {
      const next = source[i + 1];
      if (next !== undefined && NAME_START.test(next)) {
        NAME_RE.lastIndex = i + 1;
        const m = NAME_RE.exec(source)!;
        push('colonvar', i, m[0].length + 1, { name: m[0].normalize('NFC').toLowerCase() });
        i += m[0].length + 1;
      } else {
        push('colon', i, 1);
        i++;
      }
      continue;
    }
    if (ch === '[' || ch === ']' || ch === '(' || ch === ')' || ch === ',') {
      push('punct', i, 1);
      i++;
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '=') {
      push('op', i, 1);
      i++;
      continue;
    }
    if (ch === '<' || ch === '>') {
      const two = source.slice(i, i + 2);
      const len = two === '<=' || two === '>=' || two === '<>' ? 2 : 1;
      push('op', i, len);
      i += len;
      continue;
    }
    push('error', i, 1, { message: `Nieznany znak „${ch}”.` });
    i++;
  }

  tokens.push({
    type: 'eof',
    text: '',
    name: '',
    value: 0,
    offset: source.length,
    length: 0,
    line,
    column: source.length - lineStart + 1,
    spaceBefore: true,
    spaceAfter: true,
  });
  return tokens;
}

