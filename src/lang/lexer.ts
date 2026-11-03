import { LIMITS } from './types';
import { normalizeName } from './keywords';

export type TokKind =
  | 'num'
  | 'word'
  | 'ref' // legacy :name
  | 'str'
  | 'op' // + - * /
  | 'cmp' // < > = <= >= <>
  | 'lparen'
  | 'rparen'
  | 'lbrack'
  | 'rbrack'
  | 'comma'
  | 'colon'
  | 'bad' // only produced in tolerant mode
  | 'eof';

export interface Token {
  kind: TokKind;
  text: string;
  /** Numeric value for `num`. */
  value: number;
  /** Normalised name for `word` and `ref` (without the colon), string body for `str`. */
  name: string;
  line: number;
  col: number;
  offset: number;
  end: number;
  spaceBefore: boolean;
  spaceAfter: boolean;
  /** First token on its line. */
  lineStart: boolean;
  /** Last token on its line. */
  lineEnd: boolean;
}

export class LogoSyntaxError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
  ) {
    super(message);
  }
}

export interface Comment {
  offset: number;
  end: number;
}

export interface LexResult {
  tokens: Token[];
  comments: Comment[];
}

const NAME_START = /[\p{L}_]/u;
const NAME_CHAR = /[\p{L}\p{M}\p{N}_]/u;
const DIGIT = /[0-9]/;

function isSpace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\f' || ch === '\v' || ch === '\u00a0' || ch === '\ufeff';
}

/** Line/column (1-based) of a source offset. */
export function positionOf(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < offset && i < source.length; i++) {
    if (source[i] === '\n') {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: offset - lineStart + 1 };
}

/**
 * Splits source into tokens. In strict mode the first lexical problem throws a
 * LogoSyntaxError; in tolerant mode (used by the editor highlighter) problems become
 * `bad` tokens and lexing continues. Limits are enforced only in strict mode.
 */
export function lex(source: string, tolerant = false): LexResult {
  if (!tolerant && source.length > LIMITS.sourceChars) {
    const p = positionOf(source, LIMITS.sourceChars);
    throw new LogoSyntaxError(
      `Program jest za długi: ma ${fmtInt(source.length)} znaków, a limit to ${fmtInt(LIMITS.sourceChars)}.`,
      p.line,
      p.column,
    );
  }
  const tokens: Token[] = [];
  const comments: Comment[] = [];
  let i = 0;
  let line = 1;
  let lineOffset = 0;
  let lastLineWithToken = 0;
  let prevEnd = -1;
  const n = source.length;

  const push = (kind: TokKind, start: number, end: number, extra: Partial<Token> = {}) => {
    const tok: Token = {
      kind,
      text: source.slice(start, end),
      value: 0,
      name: '',
      line,
      col: start - lineOffset + 1,
      offset: start,
      end,
      spaceBefore: prevEnd !== start,
      spaceAfter: true,
      lineStart: lastLineWithToken !== line,
      lineEnd: true,
      ...extra,
    };
    const prev = tokens[tokens.length - 1];
    if (prev) {
      prev.spaceAfter = tok.spaceBefore;
      prev.lineEnd = prev.line !== tok.line;
    }
    tokens.push(tok);
    lastLineWithToken = line;
    prevEnd = end;
    if (!tolerant && tokens.length > LIMITS.tokens) {
      throw new LogoSyntaxError(
        `Program ma za dużo elementów: limit to ${fmtInt(LIMITS.tokens)} (liczą się polecenia, liczby, nazwy, operatory i nawiasy).`,
        tok.line,
        tok.col,
      );
    }
    return tok;
  };

  const fail = (message: string, start: number, end: number) => {
    if (!tolerant) throw new LogoSyntaxError(message, line, start - lineOffset + 1);
    push('bad', start, end, { name: message });
  };

  while (i < n) {
    const ch = source[i]!;
    if (ch === '\n') {
      i++;
      line++;
      lineOffset = i;
      continue;
    }
    if (isSpace(ch)) {
      i++;
      continue;
    }
    if (ch === ';') {
      const start = i;
      while (i < n && source[i] !== '\n') i++;
      comments.push({ offset: start, end: i });
      continue;
    }
    const start = i;
    // Numbers: 80, 12.5, .5 — anything glued to them makes the literal malformed.
    if (DIGIT.test(ch) || (ch === '.' && i + 1 < n && DIGIT.test(source[i + 1]!))) {
      while (i < n && DIGIT.test(source[i]!)) i++;
      let ok = true;
      if (source[i] === '.') {
        i++;
        if (!(i < n && DIGIT.test(source[i]!))) ok = false;
        while (i < n && DIGIT.test(source[i]!)) i++;
      }
      if (i < n && (NAME_CHAR.test(source[i]!) || source[i] === '.')) {
        ok = false;
        while (i < n && (NAME_CHAR.test(source[i]!) || source[i] === '.')) i++;
      }
      const text = source.slice(start, i);
      if (!ok) {
        fail(
          `„${text}” nie jest poprawną liczbą. Liczby zapisuj cyframi z kropką dziesiętną, np. 80, 12.5 albo .5.`,
          start,
          i,
        );
        continue;
      }
      push('num', start, i, { value: Number(text) });
      continue;
    }
    if (NAME_START.test(ch)) {
      while (i < n && NAME_CHAR.test(source[i]!)) i++;
      const text = source.slice(start, i);
      push('word', start, i, { name: normalizeName(text) });
      continue;
    }
    if (ch === ':') {
      if (i + 1 < n && NAME_START.test(source[i + 1]!)) {
        i++;
        while (i < n && NAME_CHAR.test(source[i]!)) i++;
        push('ref', start, i, { name: normalizeName(source.slice(start + 1, i)) });
      } else {
        i++;
        push('colon', start, i);
      }
      continue;
    }
    if (ch === '"') {
      i++;
      while (i < n && source[i] !== '"' && source[i] !== '\n') i++;
      if (source[i] !== '"') {
        fail('Brakuje cudzysłowu zamykającego. Kolor zapisz w całości, np. "#16866a".', start, i);
        continue;
      }
      i++;
      push('str', start, i, { name: source.slice(start + 1, i - 1) });
      continue;
    }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
      i++;
      push('op', start, i);
      continue;
    }
    if (ch === '<' || ch === '>' || ch === '=') {
      i++;
      if (ch === '<' && (source[i] === '=' || source[i] === '>')) i++;
      else if (ch === '>' && source[i] === '=') i++;
      push('cmp', start, i);
      continue;
    }
    if (ch === '(') {
      i++;
      push('lparen', start, i);
      continue;
    }
    if (ch === ')') {
      i++;
      push('rparen', start, i);
      continue;
    }
    if (ch === '[') {
      i++;
      push('lbrack', start, i);
      continue;
    }
    if (ch === ']') {
      i++;
      push('rbrack', start, i);
      continue;
    }
    if (ch === ',') {
      i++;
      push('comma', start, i);
      continue;
    }
    // Unknown character (take a whole code point).
    const cp = source.codePointAt(i)!;
    const len = cp > 0xffff ? 2 : 1;
    i += len;
    fail(`Nieznany znak „${source.slice(start, i)}”. Tego znaku nie ma w języku Logo.`, start, i);
  }

  const eof: Token = {
    kind: 'eof',
    text: '',
    value: 0,
    name: '',
    line,
    col: n - lineOffset + 1,
    offset: n,
    end: n,
    spaceBefore: true,
    spaceAfter: true,
    lineStart: true,
    lineEnd: true,
  };
  const last = tokens[tokens.length - 1];
  if (last) {
    last.spaceAfter = true;
    last.lineEnd = true;
  }
  tokens.push(eof);
  return { tokens, comments };
}

/** Polish integer formatting: groups of three digits from 10 000 up, separated by a space. */
export function fmtInt(n: number): string {
  const s = String(Math.trunc(Math.abs(n)));
  const sign = n < 0 ? '-' : '';
  if (s.length < 5) return sign + s;
  return sign + s.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
