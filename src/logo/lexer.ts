import { LIMITS, LogoError, type Pos } from './errors';

export type TokenKind =
  | 'word' // identifier / command / procedure name
  | 'number' // numeric literal
  | 'color' // "#rrggbb" (may be malformed; see `valid`)
  | 'param' // :name
  | 'ma' // the `ma:` keyword of a procedure header
  | 'lbracket'
  | 'rbracket'
  | 'comma'
  | 'newline'
  | 'eof';

export interface Token {
  kind: TokenKind;
  /** Raw text as written in the source. */
  text: string;
  /** Lower-cased text for words/params (without the leading colon for params). */
  value: string;
  /** Parsed number for `number` tokens. */
  num: number;
  /** For `color` tokens: normalised lowercase #rrggbb, or '' when malformed. */
  color: string;
  pos: Pos;
  /** True when this token is the first token on its line. */
  lineStart: boolean;
}

const NUMBER_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function isSpace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\f' || ch === '\v' || ch === ' ';
}

function isDelimiter(ch: string): boolean {
  return ch === '[' || ch === ']' || ch === ',' || ch === ';' || ch === '"' || ch === '\n' || isSpace(ch);
}

/**
 * Splits Logo source into tokens. Newlines are emitted as tokens because
 * procedure headers and `już` are line-sensitive; comments are dropped.
 */
export function tokenize(source: string): Token[] {
  if (source.length > LIMITS.sourceChars) {
    const pos = offsetToPos(source, LIMITS.sourceChars);
    throw new LogoError(
      `Program jest za długi: ma ${source.length.toLocaleString('pl-PL')} znaków, a dozwolone jest najwyżej ${LIMITS.sourceChars.toLocaleString('pl-PL')}.`,
      pos,
    );
  }

  const tokens: Token[] = [];
  let line = 1;
  let col = 1;
  let i = 0;
  let lineStart = true;
  let tokenCount = 0;
  const n = source.length;

  const push = (kind: TokenKind, text: string, pos: Pos, extra?: Partial<Token>): void => {
    if (kind !== 'newline' && kind !== 'eof') {
      tokenCount++;
      if (tokenCount > LIMITS.tokens) {
        throw new LogoError(
          `Program ma za dużo elementów: dozwolone jest najwyżej ${LIMITS.tokens.toLocaleString('pl-PL')} słów i liczb.`,
          pos,
        );
      }
    }
    tokens.push({
      kind,
      text,
      value: extra?.value ?? text,
      num: extra?.num ?? NaN,
      color: extra?.color ?? '',
      pos,
      lineStart: kind === 'newline' ? false : lineStart,
    });
    if (kind !== 'newline') lineStart = false;
  };

  while (i < n) {
    const ch = source[i]!;
    if (ch === '\n') {
      push('newline', '\n', { line, column: col, length: 1 });
      i++;
      line++;
      col = 1;
      lineStart = true;
      continue;
    }
    if (isSpace(ch)) {
      i++;
      col++;
      continue;
    }
    if (ch === ';') {
      // Comment to end of line.
      while (i < n && source[i] !== '\n') {
        i++;
        col++;
      }
      continue;
    }
    const startCol = col;
    const startLine = line;
    if (ch === '[' || ch === ']' || ch === ',') {
      push(ch === '[' ? 'lbracket' : ch === ']' ? 'rbracket' : 'comma', ch, { line, column: col, length: 1 });
      i++;
      col++;
      continue;
    }
    if (ch === '"') {
      // Colour literal: read to the closing quote on the same line, or to whitespace.
      let j = i + 1;
      let closed = false;
      while (j < n && source[j] !== '\n') {
        if (source[j] === '"') {
          closed = true;
          break;
        }
        if (isSpace(source[j]!)) break;
        j++;
      }
      const end = closed ? j + 1 : j;
      const text = source.slice(i, end);
      const inner = closed ? source.slice(i + 1, j) : source.slice(i + 1, j);
      const valid = closed && COLOR_RE.test(inner);
      push('color', text, { line: startLine, column: startCol, length: text.length }, {
        value: inner,
        color: valid ? inner.toLowerCase() : '',
      });
      col += end - i;
      i = end;
      continue;
    }
    // Word, number or :param — read until a delimiter.
    let j = i;
    while (j < n && !isDelimiter(source[j]!)) j++;
    const text = source.slice(i, j);
    const pos: Pos = { line: startLine, column: startCol, length: text.length };
    if (NUMBER_RE.test(text)) {
      const num = Number(text);
      if (!Number.isFinite(num)) {
        throw new LogoError(`Liczba „${text}” jest za duża.`, pos);
      }
      push('number', text, pos, { num });
    } else if (text.startsWith(':') && text.length > 1) {
      push('param', text, pos, { value: text.slice(1).toLowerCase() });
    } else if (text.toLowerCase() === 'ma:') {
      push('ma', text, pos, { value: 'ma:' });
    } else {
      push('word', text, pos, { value: text.toLowerCase() });
    }
    col += j - i;
    i = j;
  }
  push('eof', '', { line, column: col, length: 0 });
  return tokens;
}

/** Converts a character offset into a 1-based line/column position. */
export function offsetToPos(source: string, offset: number): Pos {
  let line = 1;
  let col = 1;
  const end = Math.min(offset, source.length);
  for (let i = 0; i < end; i++) {
    if (source[i] === '\n') {
      line++;
      col = 1;
    } else {
      col++;
    }
  }
  return { line, column: col, length: 1 };
}
