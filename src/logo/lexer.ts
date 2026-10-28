export const MAX_CHARS = 50_000;
export const MAX_TOKENS = 10_000;

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

export type TokKind =
  | 'num'
  | 'word'
  | 'var'
  | 'str'
  | 'op'
  | 'cmp'
  | 'lbr'
  | 'rbr'
  | 'lpar'
  | 'rpar'
  | 'comma'
  | 'colon';

export interface Token {
  kind: TokKind;
  /** Source text of the token (without the leading ':' for variables). */
  text: string;
  /** Normalised key: lowercase NFC for words and variables, contents for strings. */
  key: string;
  value: number;
  line: number;
  col: number;
  /** First token on its line. */
  first: boolean;
  /** Whitespace (or line start/end, or a comment) directly before the token. */
  sp: boolean;
  /** Whitespace (or line end, or a comment) directly after the token. */
  sa: boolean;
}

export function normKey(s: string): string {
  return s.normalize('NFC').toLowerCase();
}

const NUMBER = /\d+(?:\.\d+)?|\.\d+/y;
const WORD = /[\p{L}_][\p{L}\p{N}_]*/uy;
const isSpace = (c: string | undefined) =>
  c === undefined || c === ' ' || c === '\t' || c === '\r' || c === '\n' || c === ';';

/** Line/column (1-based) of a character index. */
export function positionOf(src: string, index: number): { line: number; col: number } {
  let line = 1;
  let lineStart = 0;
  for (let k = 0; k < index && k < src.length; k++) {
    if (src[k] === '\n') {
      line++;
      lineStart = k + 1;
    }
  }
  return { line, col: index - lineStart + 1 };
}

export function tokenize(src: string): Token[] {
  if (src.length > MAX_CHARS) {
    const { line, col } = positionOf(src, MAX_CHARS);
    throw new LogoError(`Program jest za długi (limit to 50 000 znaków).`, line, col);
  }
  const toks: Token[] = [];
  let i = 0;
  let line = 1;
  let lineStart = 0;
  let lastLine = 0;
  const n = src.length;

  const fail = (at: number, message: string): never => {
    const p = positionOf(src, at);
    throw new LogoError(message, p.line, p.col);
  };

  const push = (kind: TokKind, text: string, start: number, extra: Partial<Token> = {}) => {
    const tok: Token = {
      kind,
      text,
      key: text.toLowerCase(),
      value: 0,
      line,
      col: start - lineStart + 1,
      first: line !== lastLine,
      sp: start === 0 || isSpace(src[start - 1]),
      sa: false,
      ...extra,
    };
    lastLine = line;
    toks.push(tok);
    if (toks.length > MAX_TOKENS) {
      throw new LogoError(`Program ma więcej niż 10 000 elementów.`, tok.line, tok.col);
    }
    return tok;
  };

  while (i < n) {
    const c = src[i];
    if (c === '\n') {
      i++;
      line++;
      lineStart = i;
      continue;
    }
    if (c === ' ' || c === '\t' || c === '\r' || c === '\f') {
      i++;
      continue;
    }
    if (c === ';') {
      while (i < n && src[i] !== '\n') i++;
      continue;
    }

    const start = i;
    let tok: Token;
    if ((c >= '0' && c <= '9') || (c === '.' && src[i + 1] >= '0' && src[i + 1] <= '9')) {
      NUMBER.lastIndex = i;
      const m = NUMBER.exec(src)!;
      tok = push('num', m[0], start, { value: parseFloat(m[0]) });
      i += m[0].length;
    } else if (/[\p{L}_]/u.test(c)) {
      WORD.lastIndex = i;
      const m = WORD.exec(src)!;
      tok = push('word', m[0], start, { key: normKey(m[0]) });
      i += m[0].length;
    } else if (c === ':' && /[\p{L}_]/u.test(src[i + 1] ?? '')) {
      WORD.lastIndex = i + 1;
      const m = WORD.exec(src)!;
      tok = push('var', m[0], start, { key: normKey(m[0]) });
      i += 1 + m[0].length;
    } else if (c === '"') {
      const close = src.indexOf('"', i + 1);
      const nl = src.indexOf('\n', i + 1);
      if (close === -1 || (nl !== -1 && nl < close)) {
        fail(i, 'Niedomknięty cudzysłów: napis musi mieścić się w jednym wierszu i kończyć cudzysłowem.');
      }
      const content = src.slice(i + 1, close);
      tok = push('str', src.slice(i, close + 1), start, { key: content });
      i = close + 1;
    } else {
      const two = src.slice(i, i + 2);
      let kind: TokKind | null = null;
      let len = 1;
      if (two === '<=' || two === '>=' || two === '<>') {
        kind = 'cmp';
        len = 2;
      } else if (c === '<' || c === '>' || c === '=') {
        kind = 'cmp';
      } else if (c === '+' || c === '-' || c === '*' || c === '/') {
        kind = 'op';
      } else if (c === '[') kind = 'lbr';
      else if (c === ']') kind = 'rbr';
      else if (c === '(') kind = 'lpar';
      else if (c === ')') kind = 'rpar';
      else if (c === ',') kind = 'comma';
      else if (c === ':') kind = 'colon';
      if (!kind) fail(i, `Nieznany znak '${c}'.`);
      tok = push(kind!, src.slice(i, i + len), start);
      i += len;
    }
    tok.sa = isSpace(src[i]);
  }
  return toks;
}
