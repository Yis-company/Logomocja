import { LogoError } from './errors';

export type TokKind =
  | 'word' | 'num' | 'str' | 'op' | 'cmp'
  | 'lp' | 'rp' | 'lb' | 'rb' | 'comma' | 'colon' | 'bad';

export interface Token {
  kind: TokKind;
  /** Source text of the token. */
  text: string;
  /** Lowercase form of a word, used for all keyword and name lookups. */
  key: string;
  value: number;
  line: number;
  column: number;
  /** Whitespace (or the start of input) directly before the token. */
  spaceBefore: boolean;
  /** Whitespace (or the end of input) directly after the token. */
  spaceAfter: boolean;
}

export const MAX_TOKENS = 10000;

const NUM = /\d+(?:\.\d+)?|\.\d+/y;
const WORD = /[\p{L}_][\p{L}\p{N}_]*/uy;
const STR = /"[^"\n]*"?/y;
const CMP = /<=|>=|<>|[<>=]/y;
const OP = /[+\-*/]/y;
const PUNCT: Record<string, TokKind> = { '(': 'lp', ')': 'rp', '[': 'lb', ']': 'rb', ',': 'comma', ':': 'colon' };

const isSpace = (c: string | undefined) => c === undefined || /\s/.test(c);

export function tokenize(src: string): Token[] {
  const toks: Token[] = [];
  let i = 0;
  let line = 1;
  let lineStart = 0;

  const match = (re: RegExp): string => {
    re.lastIndex = i;
    return re.exec(src)?.[0] ?? '';
  };

  while (i < src.length) {
    const ch = src[i];
    if (ch === '\n') {
      i++;
      line++;
      lineStart = i;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === ';') {
      while (i < src.length && src[i] !== '\n') i++;
      continue;
    }

    let kind: TokKind;
    let text = match(STR);
    if (text) kind = 'str';
    else if ((text = match(NUM))) kind = 'num';
    else if ((text = match(WORD))) kind = 'word';
    else if ((text = match(CMP))) kind = 'cmp';
    else if ((text = match(OP))) kind = 'op';
    else {
      text = ch;
      kind = PUNCT[ch] ?? 'bad';
    }

    const column = i - lineStart + 1;
    if (toks.length >= MAX_TOKENS) {
      throw new LogoError(`Program ma więcej niż ${MAX_TOKENS} symboli.`, line, column);
    }
    toks.push({
      kind,
      text,
      key: kind === 'word' ? text.toLowerCase() : '',
      value: kind === 'num' ? parseFloat(text) : 0,
      line,
      column,
      spaceBefore: isSpace(src[i - 1]),
      spaceAfter: isSpace(src[i + text.length]),
    });
    i += text.length;
  }
  return toks;
}
