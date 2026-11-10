// Lekser dialektu Logomocji.

export class LogoError extends Error {
  line: number;
  column: number;
  offset: number;
  length: number;
  constructor(message: string, at: { line: number; col: number; off?: number; len?: number }) {
    super(message);
    this.name = "LogoError";
    this.line = at.line;
    this.column = at.col;
    this.offset = at.off ?? 0;
    this.length = Math.max(1, at.len ?? 1);
  }
}

export type TokType =
  | "num" | "word" | "var" | "str" | "[" | "]" | "(" | ")" | "op" | "cmp" | "," | "ma" | "eof" | "err";

export interface Tok {
  t: TokType;
  /** surowy tekst */
  s: string;
  /** wartość liczby */
  v: number;
  /** nazwa znormalizowana (małe litery, NFC) */
  name: string;
  line: number;
  col: number;
  off: number;
  len: number;
  /** odstęp przed / po (dla operatorów) */
  sb: boolean;
  sa: boolean;
  first: boolean;
  last: boolean;
}

export const MAX_SOURCE = 50000;
export const MAX_TOKENS = 10000;

const WORD = /[\p{L}_][\p{L}\p{M}\p{N}_]*/uy;
const NUM = /(?:\d+(?:\.\d+)?|\.\d+)/y;
const JUNK = /[\p{L}\p{M}\p{N}_.]+/uy;
const WS = /\s/;

export function norm(s: string): string {
  return s.normalize("NFC").toLowerCase();
}

export function lex(src: string): Tok[] {
  const toks: Tok[] = [];
  const n = src.length;
  let i = 0;
  let line = 1;
  let cOff = 0;
  let cVal = 1;
  const colOf = (off: number): number => {
    while (cOff < off) {
      const ch = src.charCodeAt(cOff);
      if (!(ch >= 0xdc00 && ch <= 0xdfff)) cVal++;
      cOff++;
    }
    return cVal;
  };
  let count = 0;
  let stopped = false;
  const mk = (t: TokType, start: number, end: number, extra?: Partial<Tok>): Tok => ({
    t, s: src.slice(start, end), v: 0, name: "", line, col: colOf(start), off: start, len: end - start,
    sb: start === 0 || WS.test(src[start - 1]),
    sa: end >= n || WS.test(src[end]) || src[end] === ";",
    first: false, last: false, ...extra,
  });
  const fail = (msg: string, start: number, end: number) => {
    const tk = mk("err", start, Math.max(end, start + 1));
    tk.s = msg;
    toks.push(tk);
    stopped = true;
  };
  const push = (t: TokType, start: number, end: number, extra?: Partial<Tok>) => {
    count++;
    if (count > MAX_TOKENS) {
      fail("Program jest za długi: limit to 10 000 elementów (tokenów).", start, end);
      return;
    }
    toks.push(mk(t, start, end, extra));
  };

  if (n > MAX_SOURCE) {
    fail("Program jest za długi: limit to 50 000 znaków.", 0, 1);
  }

  while (!stopped && i < n) {
    const c = src[i];
    if (c === "\n") {
      line++;
      i++;
      cOff = i;
      cVal = 1;
      continue;
    }
    if (WS.test(c) || c === "﻿") { i++; continue; }
    if (c === ";") {
      while (i < n && src[i] !== "\n") i++;
      continue;
    }
    if (c === "[" || c === "]" || c === "(" || c === ")" || c === ",") { push(c, i, i + 1); i++; continue; }
    if (c === "+" || c === "-" || c === "*" || c === "/") { push("op", i, i + 1); i++; continue; }
    if (c === "<" || c === ">" || c === "=") {
      let e = i + 1;
      if (c === "<" && (src[e] === "=" || src[e] === ">")) e++;
      else if (c === ">" && src[e] === "=") e++;
      push("cmp", i, e);
      i = e;
      continue;
    }
    if (c === '"') {
      let e = i + 1;
      while (e < n && src[e] !== '"' && src[e] !== "\n") e++;
      if (e >= n || src[e] !== '"') {
        fail("Niedomknięty napis: brakuje zamykającego cudzysłowu \".", i, e);
        break;
      }
      push("str", i, e + 1, { name: src.slice(i + 1, e) });
      i = e + 1;
      continue;
    }
    NUM.lastIndex = i;
    const nm = NUM.exec(src);
    if (nm) {
      let e = i + nm[0].length;
      JUNK.lastIndex = e;
      const junk = JUNK.exec(src);
      if (junk) {
        e += junk[0].length;
        fail(`Nieprawidłowa liczba „${src.slice(i, e)}”. Liczby zapisuj tak: 80, 12.5 albo .5.`, i, e);
        break;
      }
      const v = Number(nm[0]);
      if (!Number.isFinite(v)) {
        fail("Ta liczba jest za duża.", i, e);
        break;
      }
      push("num", i, e, { v });
      i = e;
      continue;
    }
    if (c === ":") {
      WORD.lastIndex = i + 1;
      const m = WORD.exec(src);
      if (!m) {
        fail("Po dwukropku powinna stać nazwa, np. :bok.", i, i + 1);
        break;
      }
      const e = i + 1 + m[0].length;
      push("var", i, e, { name: norm(m[0]) });
      i = e;
      continue;
    }
    WORD.lastIndex = i;
    const wm = WORD.exec(src);
    if (wm) {
      const e = i + wm[0].length;
      const name = norm(wm[0]);
      if (name === "ma" && src[e] === ":") {
        push("ma", i, e + 1, { name });
        i = e + 1;
      } else {
        push("word", i, e, { name });
        i = e;
      }
      continue;
    }
    const cp = String.fromCodePoint(src.codePointAt(i)!);
    fail(`Nieoczekiwany znak „${cp}”.`, i, i + cp.length);
  }

  if (!stopped) {
    const eof = mk("eof", n, n);
    eof.len = 1;
    toks.push(eof);
  }
  for (let k = 0; k < toks.length; k++) {
    const tk = toks[k];
    tk.first = k === 0 || toks[k - 1].line !== tk.line;
    const nx = toks[k + 1];
    tk.last = !nx || nx.t === "eof" || nx.line !== tk.line;
  }
  return toks;
}
