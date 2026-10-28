import { formatCount, LIMITS, normaliseName } from './spec';

export type TokenKind = 'number' | 'name' | 'string' | 'op' | 'punct';

export interface Token {
  kind: TokenKind;
  /** Source text exactly as written. */
  text: string;
  /** Normalised name (lower-case NFC); equal to `text` for other kinds. */
  norm: string;
  /** Numeric value for number tokens. */
  value: number;
  line: number;
  col: number;
  /** Offsets into the source, end exclusive. */
  start: number;
  end: number;
  /** Whitespace (or a comment, or the start of the text) directly before / after. */
  spaceBefore: boolean;
  spaceAfter: boolean;
  /** True when this is the first token on its line. */
  firstOnLine: boolean;
}

/** A problem found before or during execution, with a 1-based position. */
export class LogoError extends Error {
  constructor(
    message: string,
    readonly line: number,
    readonly column: number,
  ) {
    super(message);
    this.name = 'LogoError';
  }
}

export function errorAt(tok: Token, message: string): LogoError {
  return new LogoError(message, tok.line, tok.col);
}

const NAME_RE = /[\p{L}_][\p{L}\p{N}\p{M}_]*/uy;
const NUMBER_RE = /(?:\d+(?:\.\d*)?|\.\d+)/y;
const NAME_START_RE = /[\p{L}_]/u;
const SPACE_RE = /\s/;
const OPERATOR_PAIRS = ['<=', '>=', '<>'];
const OPERATOR_CHARS = '+-*/<>=';
const PUNCT_CHARS = '()[],:';

/** Line and column (1-based) of a character offset. */
export function positionOf(source: string, index: number): { line: number; column: number } {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: index - lineStart + 1 };
}

function isSpaceAt(source: string, index: number): boolean {
  return index < 0 || index >= source.length || SPACE_RE.test(source[index]) || source[index] === ';';
}

export function tokenize(source: string): Token[] {
  if (source.length > LIMITS.maxChars) {
    const { line, column } = positionOf(source, LIMITS.maxChars);
    throw new LogoError(
      `Program jest za długi. Limit to ${formatCount(LIMITS.maxChars)} znaków.`,
      line,
      column,
    );
  }

  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let lineStart = 0;
  const n = source.length;

  const push = (kind: TokenKind, end: number, value = 0): Token => {
    const text = source.slice(i, end);
    const col = i - lineStart + 1;
    const token: Token = {
      kind,
      text,
      norm: kind === 'name' ? normaliseName(text) : text,
      value,
      line,
      col,
      start: i,
      end,
      spaceBefore: isSpaceAt(source, i - 1),
      spaceAfter: isSpaceAt(source, end),
      firstOnLine: tokens.length === 0 || tokens[tokens.length - 1].line !== line,
    };
    if (tokens.length >= LIMITS.maxTokens) {
      throw errorAt(
        token,
        `Program ma zbyt wiele symboli. Limit to ${formatCount(LIMITS.maxTokens)}.`,
      );
    }
    tokens.push(token);
    return token;
  };

  while (i < n) {
    const c = source[i];

    if (c === '\n') {
      line++;
      i++;
      lineStart = i;
      continue;
    }
    if (SPACE_RE.test(c)) {
      i++;
      continue;
    }
    if (c === ';') {
      while (i < n && source[i] !== '\n') i++;
      continue;
    }

    const col = i - lineStart + 1;

    if (c === '"') {
      let j = i + 1;
      while (j < n && source[j] !== '"' && source[j] !== '\n') j++;
      if (j >= n || source[j] !== '"') {
        throw new LogoError(
          'Niezamknięty napis. Kolor zapisz w cudzysłowie, na przykład "#16866a".',
          line,
          col,
        );
      }
      push('string', j + 1);
      i = j + 1;
      continue;
    }

    NUMBER_RE.lastIndex = i;
    const numberMatch = NUMBER_RE.exec(source);
    if (numberMatch && numberMatch.index === i) {
      const end = i + numberMatch[0].length;
      if (end < n && NAME_START_RE.test(source[end])) {
        throw new LogoError(
          'Nieprawidłowa liczba. Liczby mają tylko cyfry i kropkę, na przykład 12 albo 0.5.',
          line,
          col,
        );
      }
      push('number', end, Number(numberMatch[0]));
      i = end;
      continue;
    }

    NAME_RE.lastIndex = i;
    const nameMatch = NAME_RE.exec(source);
    if (nameMatch && nameMatch.index === i) {
      const end = i + nameMatch[0].length;
      push('name', end);
      i = end;
      continue;
    }

    const pair = source.slice(i, i + 2);
    if (OPERATOR_PAIRS.includes(pair)) {
      push('op', i + 2);
      i += 2;
      continue;
    }
    if (OPERATOR_CHARS.includes(c)) {
      push('op', i + 1);
      i++;
      continue;
    }
    if (PUNCT_CHARS.includes(c)) {
      push('punct', i + 1);
      i++;
      continue;
    }

    throw new LogoError(`Nieoczekiwany znak „${c}”.`, line, col);
  }

  return tokens;
}
