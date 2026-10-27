import { LogoError, fmtInt } from "./errors";
import { LIMITS } from "./names";

export type TokenType = "word" | "number" | "string" | "lbracket" | "rbracket" | "comma" | "newline";

export interface Token {
  type: TokenType;
  text: string;
  /** Numeric value for "number" tokens. */
  value: number;
  line: number;
  column: number;
  /** Offset of the first character in the source. */
  offset: number;
  length: number;
  /** First non-newline token on its line. */
  lineStart: boolean;
}

/** Comment span, kept for syntax highlighting. */
export interface CommentSpan {
  offset: number;
  length: number;
}

export interface LexResult {
  tokens: Token[];
  comments: CommentSpan[];
}

const NUMBER_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

function isSpace(ch: string): boolean {
  return ch === " " || ch === "\t" || ch === "\f" || ch === "\v" || ch === " " || /\s/.test(ch);
}

function isNewline(ch: string): boolean {
  return ch === "\n" || ch === "\r" || ch === " " || ch === " ";
}

const WORD_STOP = new Set(["[", "]", ";", ","]);

/**
 * Split source text into tokens. In tolerant mode (used for highlighting)
 * no limit errors are thrown.
 */
export function lex(source: string, tolerant = false): LexResult {
  if (!tolerant && source.length > LIMITS.sourceChars) {
    const { line, column } = posAt(source, LIMITS.sourceChars);
    throw new LogoError(
      `Program jest za długi: ma ${fmtInt(source.length)} znaków, a dozwolone jest najwyżej ${fmtInt(LIMITS.sourceChars)}.`,
      { line, column },
    );
  }

  const tokens: Token[] = [];
  const comments: CommentSpan[] = [];
  let i = 0;
  let line = 1;
  let lineOffset = 0;
  let lineStart = true;
  let counted = 0;
  const n = source.length;

  const push = (type: TokenType, start: number, end: number, value = NaN) => {
    const text = source.slice(start, end);
    if (type !== "newline") {
      counted++;
      if (!tolerant && counted > LIMITS.tokens) {
        throw new LogoError(
          `Program ma za dużo elementów: dozwolone jest najwyżej ${fmtInt(LIMITS.tokens)} słów, liczb i nawiasów.`,
          { line, column: start - lineOffset + 1, length: end - start },
        );
      }
    }
    tokens.push({
      type,
      text,
      value,
      line,
      column: start - lineOffset + 1,
      offset: start,
      length: end - start,
      lineStart: type !== "newline" && lineStart,
    });
    if (type !== "newline") lineStart = false;
  };

  while (i < n) {
    const ch = source[i]!;
    if (isNewline(ch)) {
      push("newline", i, i + 1);
      if (ch === "\r" && source[i + 1] === "\n") i++;
      i++;
      line++;
      lineOffset = i;
      lineStart = true;
      continue;
    }
    if (isSpace(ch)) {
      i++;
      continue;
    }
    if (ch === ";") {
      const start = i;
      while (i < n && !isNewline(source[i]!)) i++;
      comments.push({ offset: start, length: i - start });
      continue;
    }
    if (ch === "[") {
      push("lbracket", i, i + 1);
      i++;
      continue;
    }
    if (ch === "]") {
      push("rbracket", i, i + 1);
      i++;
      continue;
    }
    if (ch === ",") {
      push("comma", i, i + 1);
      i++;
      continue;
    }
    if (ch === '"') {
      // Quoted text: up to the closing quote, or until whitespace/bracket.
      const start = i;
      i++;
      while (i < n) {
        const c = source[i]!;
        if (c === '"') {
          i++;
          break;
        }
        if (isSpace(c) || isNewline(c) || c === "[" || c === "]" || c === ";") break;
        i++;
      }
      push("string", start, i);
      continue;
    }
    const start = i;
    while (i < n) {
      const c = source[i]!;
      if (isSpace(c) || isNewline(c) || WORD_STOP.has(c)) break;
      i++;
    }
    const text = source.slice(start, i);
    if (NUMBER_RE.test(text)) {
      const value = Number(text);
      if (!Number.isFinite(value) && !tolerant) {
        throw new LogoError(`Liczba ${text.length > 20 ? text.slice(0, 20) + "…" : text} jest za duża.`, {
          line,
          column: start - lineOffset + 1,
          length: i - start,
        });
      }
      push("number", start, i, value);
    } else {
      push("word", start, i);
    }
  }
  return { tokens, comments };
}

/** 1-based line/column of a character offset. */
export function posAt(source: string, offset: number): { line: number; column: number } {
  let line = 1;
  let lineOffset = 0;
  for (let i = 0; i < offset && i < source.length; i++) {
    const ch = source[i]!;
    if (isNewline(ch)) {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      line++;
      lineOffset = i + 1;
    }
  }
  return { line, column: offset - lineOffset + 1 };
}
