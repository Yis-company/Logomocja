import { LogoError, type Position } from './errors';
import { MAX_SOURCE_CHARS, MAX_TOKENS } from './limits';

export type TokenType = 'word' | 'number' | 'string' | 'colon' | 'comma' | 'lbracket' | 'rbracket';

export interface Token {
  type: TokenType;
  /** Text as written in the source. */
  text: string;
  /** Lowercased word, numeric value, or the text between the quotes of a colour. */
  value: string | number;
  line: number;
  column: number;
}

const NUMBER_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
const WORD_BREAK = /[\s[\];,:"]/;
const PUNCTUATION: Record<string, TokenType> = { ':': 'colon', ',': 'comma', '[': 'lbracket', ']': 'rbracket' };

/** 1-based position of a character index in the source. */
export function positionOf(source: string, index: number): Position {
  let line = 1;
  let column = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
  }
  return { line, column };
}

export function tokenize(source: string): Token[] {
  if (source.length > MAX_SOURCE_CHARS) {
    throw new LogoError(
      `Program jest za długi (maks. ${MAX_SOURCE_CHARS.toLocaleString('pl-PL').replace(/,/g, ' ')} znaków)`,
      positionOf(source, MAX_SOURCE_CHARS),
    );
  }

  const tokens: Token[] = [];
  let line = 1;
  let column = 1;
  let i = 0;

  while (i < source.length) {
    const ch = source[i];

    if (ch === '\n') {
      i++;
      line++;
      column = 1;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      column++;
      continue;
    }
    if (ch === ';') {
      while (i < source.length && source[i] !== '\n') {
        i++;
        column++;
      }
      continue;
    }

    const at = { line, column };
    if (tokens.length >= MAX_TOKENS) {
      throw new LogoError(`Program ma zbyt wiele elementów (maks. ${MAX_TOKENS})`, at);
    }

    let token: Token;
    if (ch === '"') {
      const close = source.indexOf('"', i + 1);
      const newline = source.indexOf('\n', i + 1);
      if (close === -1 || (newline !== -1 && newline < close)) {
        throw new LogoError('Niedomknięty cudzysłów; kolor musi mieścić się w jednym wierszu', at);
      }
      const text = source.slice(i, close + 1);
      token = { type: 'string', text, value: text.slice(1, -1), line, column };
      column += text.length;
      i += text.length;
    } else if (ch in PUNCTUATION) {
      token = { type: PUNCTUATION[ch], text: ch, value: ch, line, column };
    } else {
      let end = i;
      while (end < source.length && !WORD_BREAK.test(source[end])) end++;
      const text = source.slice(i, end);
      if (NUMBER_PATTERN.test(text)) {
        const value = Number(text);
        if (!Number.isFinite(value)) throw new LogoError(`Liczba „${text}” jest poza zakresem`, at);
        token = { type: 'number', text, value, line, column };
      } else {
        token = { type: 'word', text, value: text.normalize('NFC').toLowerCase(), line, column };
      }
      column += text.length;
      i = end;
      tokens.push(token);
      continue;
    }

    if (ch in PUNCTUATION) {
      column++;
      i++;
    }
    tokens.push(token);
  }

  return tokens;
}
