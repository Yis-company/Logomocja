// Lexer for the Logomocja dialect.

export const LIMITS = {
  chars: 50_000,
  tokens: 10_000,
  nesting: 32,
  frames: 32,
  ops: 10_000,
  segments: 10_000,
  coord: 100_000,
} as const;

export class LogoError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number,
    public runtime = false,
  ) {
    super(message);
  }
}

export type TokType =
  | "num" // unsigned decimal literal
  | "word" // command, name, keyword (v is lower-cased)
  | "str" // quoted string (v is the inner text, raw)
  | "lbr"
  | "rbr"
  | "lpar"
  | "rpar"
  | "op" // + - * /
  | "cmp" // < > = <= >= <>
  | "comma"
  | "ma"; // the `ma:` keyword in a procedure header

export interface Tok {
  t: TokType;
  v: string;
  raw: string;
  num: number;
  line: number;
  col: number;
  /** whitespace (or start of input) directly before */
  sb: boolean;
  /** whitespace (or end of input) directly after */
  sa: boolean;
  /** legacy `:name` form */
  colon: boolean;
  /** first token on its line */
  first: boolean;
  /** last token on its line */
  last: boolean;
}

const isWordChar = (c: string) => /[\p{L}\p{N}_]/u.test(c);
const isDigit = (c: string) => c >= "0" && c <= "9";
const isSpace = (c: string) => c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f" || c === "\v" || c === " ";

/** Line/column (1-based) of a string offset. */
export function posOf(src: string, offset: number): { line: number; col: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < offset && i < src.length; i++) {
    if (src[i] === "\n") {
      line++;
      col = 1;
    } else col++;
  }
  return { line, col };
}

export function lex(input: string): Tok[] {
  if (input.length > LIMITS.chars) {
    const p = posOf(input, LIMITS.chars);
    throw new LogoError(`Program jest za długi: najwyżej ${LIMITS.chars.toLocaleString("pl-PL")} znaków.`, p.line, p.col);
  }
  const src = input.replace(/\r\n?/g, "\n");
  const toks: Tok[] = [];
  let i = 0;
  let line = 1;
  let col = 1;
  let lastLine = 0;

  const push = (t: TokType, start: number, end: number, sLine: number, sCol: number, v: string, num = 0, colon = false) => {
    if (toks.length >= LIMITS.tokens) {
      throw new LogoError(`Za dużo elementów w programie: najwyżej ${LIMITS.tokens.toLocaleString("pl-PL")}.`, sLine, sCol);
    }
    const before = start === 0 ? true : isSpace(src[start - 1]!) || src[start - 1] === ";";
    const after = end >= src.length ? true : isSpace(src[end]!) || src[end] === ";";
    const prev = toks[toks.length - 1];
    const first = sLine !== lastLine;
    if (first && prev) prev.last = true;
    lastLine = sLine;
    toks.push({ t, v, raw: src.slice(start, end), num, line: sLine, col: sCol, sb: before, sa: after, colon, first, last: false });
  };

  while (i < src.length) {
    const c = src[i]!;
    if (c === "\n") {
      i++;
      line++;
      col = 1;
      continue;
    }
    if (isSpace(c)) {
      i++;
      col++;
      continue;
    }
    if (c === ";") {
      while (i < src.length && src[i] !== "\n") {
        i++;
        col++;
      }
      continue;
    }
    const start = i;
    const sLine = line;
    const sCol = col;
    const adv = (n: number) => {
      i += n;
      col += n;
    };

    if (isDigit(c) || (c === "." && isDigit(src[i + 1] ?? ""))) {
      while (i < src.length && isDigit(src[i]!)) adv(1);
      if (src[i] === ".") {
        adv(1);
        while (i < src.length && isDigit(src[i]!)) adv(1);
      }
      if (i < src.length && (isWordChar(src[i]!) || src[i] === ".")) {
        while (i < src.length && (isWordChar(src[i]!) || src[i] === ".")) adv(1);
        throw new LogoError(`„${src.slice(start, i)}” nie jest poprawną liczbą. Liczby zapisuj cyframi, np. 80, 12.5 albo .5.`, sLine, sCol);
      }
      const text = src.slice(start, i);
      push("num", start, i, sLine, sCol, text, Number(text));
      continue;
    }
    if (isWordChar(c) || (c === ":" && isWordChar(src[i + 1] ?? ""))) {
      const colon = c === ":";
      if (colon) adv(1);
      const ws = i;
      while (i < src.length && isWordChar(src[i]!)) adv(1);
      const word = src.slice(ws, i).normalize("NFC").toLowerCase();
      if (!colon && word === "ma" && src[i] === ":") {
        adv(1);
        push("ma", start, i, sLine, sCol, "ma:");
        continue;
      }
      push("word", start, i, sLine, sCol, word, 0, colon);
      continue;
    }
    if (c === '"') {
      adv(1);
      while (i < src.length && src[i] !== '"' && !isSpace(src[i]!) && src[i] !== "]" && src[i] !== "[") adv(1);
      if (src[i] !== '"') {
        throw new LogoError(`Niezamknięty cudzysłów. Kolor zapisuj tak: "#16866a".`, sLine, sCol);
      }
      adv(1);
      push("str", start, i, sLine, sCol, src.slice(start + 1, i - 1));
      continue;
    }
    if (c === "[") { adv(1); push("lbr", start, i, sLine, sCol, c); continue; }
    if (c === "]") { adv(1); push("rbr", start, i, sLine, sCol, c); continue; }
    if (c === "(") { adv(1); push("lpar", start, i, sLine, sCol, c); continue; }
    if (c === ")") { adv(1); push("rpar", start, i, sLine, sCol, c); continue; }
    if (c === ",") { adv(1); push("comma", start, i, sLine, sCol, c); continue; }
    if (c === "+" || c === "-" || c === "*" || c === "/") { adv(1); push("op", start, i, sLine, sCol, c); continue; }
    if (c === "<" || c === ">" || c === "=") {
      const two = src.slice(i, i + 2);
      if (two === "<=" || two === ">=" || two === "<>") {
        adv(2);
        push("cmp", start, i, sLine, sCol, two);
      } else {
        adv(1);
        push("cmp", start, i, sLine, sCol, c);
      }
      continue;
    }
    throw new LogoError(`Nieznany znak „${c}”.`, sLine, sCol);
  }
  const lastTok = toks[toks.length - 1];
  if (lastTok) lastTok.last = true;
  return toks;
}
