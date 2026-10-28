// Parser: tokens -> validated AST. All parse-time checks live here.
import { LIMITS, LogoError, lex, type Tok } from "./lexer";

export type Mode = "2d" | "3d";

export type CmdId =
  | "fd" | "bk" | "rt" | "lt" | "pu" | "pd" | "color" | "width" | "repeat" | "let"
  | "if" | "ifelse" | "stop" | "home" | "cs" | "up" | "down" | "rr" | "rl";

export const COMMANDS: Record<string, CmdId> = {
  np: "fd", naprzod: "fd", "naprzód": "fd", fd: "fd", forward: "fd",
  ws: "bk", wstecz: "bk", bk: "bk", back: "bk",
  pw: "rt", prawo: "rt", rt: "rt", right: "rt",
  lw: "lt", lewo: "lt", lt: "lt", left: "lt",
  pod: "pu", podnies: "pu", "podnieś": "pu", pu: "pu", penup: "pu",
  opu: "pd", opusc: "pd", "opuść": "pd", pd: "pd", pendown: "pd",
  kolor: "color", color: "color",
  grubosc: "width", "grubość": "width", width: "width",
  powtorz: "repeat", "powtórz": "repeat", repeat: "repeat",
  niech: "let", let: "let",
  "jeśli": "if", jesli: "if", if: "if",
  "jeżeli": "ifelse", jezeli: "ifelse", ifelse: "ifelse",
  stop: "stop",
  dom: "home", home: "home",
  "czyść": "cs", czysc: "cs", cs: "cs", clearscreen: "cs",
  gora: "up", "góra": "up", pitchup: "up",
  dol: "down", "dół": "down", pitchdown: "down",
  pp: "rr", przechylprawo: "rr", rr: "rr", rollright: "rr",
  pl: "rl", przechyllewo: "rl", rl: "rl", rollleft: "rl",
};

const DEF_WORDS = new Set(["oto", "to"]);
const END_WORDS = new Set(["już", "juz", "end"]);
const REPCOUNT = new Set(["nrpowt", "repcount"]);
export const RESERVED = new Set([...Object.keys(COMMANDS), ...DEF_WORDS, ...END_WORDS, ...REPCOUNT, "ma"]);

export type Expr =
  | { k: "num"; v: number; tok: Tok }
  | { k: "var"; name: string; tok: Tok }
  | { k: "rep"; tok: Tok }
  | { k: "neg"; e: Expr; tok: Tok }
  | { k: "bin"; op: string; l: Expr; r: Expr; tok: Tok };

/** An argument expression: `tok` is its first token (where argument errors are reported). */
export interface Arg { e: Expr; tok: Tok }
export interface Cond { l: Expr; op: string; r: Expr; tok: Tok }

export type Stmt =
  | { k: "move"; cmd: "fd" | "bk" | "rt" | "lt" | "up" | "down" | "rr" | "rl"; arg: Arg; tok: Tok }
  | { k: "pen"; down: boolean; tok: Tok }
  | { k: "color"; value: string; tok: Tok }
  | { k: "width"; arg: Arg; tok: Tok }
  | { k: "repeat"; arg: Arg; body: Stmt[]; tok: Tok }
  | { k: "let"; name: string; arg: Arg; tok: Tok }
  | { k: "if"; cond: Cond; body: Stmt[]; tok: Tok }
  | { k: "ifelse"; cond: Cond; a: Stmt[]; b: Stmt[]; tok: Tok }
  | { k: "stop"; tok: Tok }
  | { k: "home"; tok: Tok }
  | { k: "cs"; tok: Tok }
  | { k: "call"; proc: Proc; args: Arg[]; tok: Tok };

export interface Proc {
  name: string;
  display: string;
  params: string[];
  body: Stmt[];
  tok: Tok;
  /** names this procedure may read: params + its own `niech` names */
  locals: Set<string>;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Proc>;
}

interface RawProc {
  proc: Proc;
  nameTok: Tok;
  bodyToks: Tok[];
}

const q = (t: Tok) => `„${t.raw}”`;

function err(msg: string, t: Tok): never {
  throw new LogoError(msg, t.line, t.col);
}

/** Split top-level code from procedure definitions. */
function split(toks: Tok[]): { top: Tok[]; raws: RawProc[] } {
  const top: Tok[] = [];
  const raws: RawProc[] = [];
  let depth = 0;
  let i = 0;
  while (i < toks.length) {
    const t = toks[i]!;
    if (t.t === "word" && !t.colon && DEF_WORDS.has(t.v)) {
      if (depth > 0) err(`Procedurę można zdefiniować tylko poza nawiasami — nie wewnątrz powtórzenia ani warunku.`, t);
      if (!t.first) err(`Słowo ${q(t)} musi stać na początku linii.`, t);
      // header
      const nameTok = toks[i + 1];
      if (!nameTok || nameTok.line !== t.line) err(`Po ${q(t)} podaj nazwę procedury w tej samej linii.`, t);
      if (nameTok.t !== "word" || nameTok.colon) err(`${q(nameTok)} nie może być nazwą procedury.`, nameTok);
      if (RESERVED.has(nameTok.v)) err(`${q(nameTok)} to słowo języka — wybierz inną nazwę procedury.`, nameTok);
      const params: string[] = [];
      let j = i + 2;
      const onLine = (k: number) => toks[k] && toks[k]!.line === t.line;
      const addParam = (p: Tok) => {
        if (p.t !== "word") err(`Oczekiwano nazwy parametru, a jest ${q(p)}.`, p);
        if (RESERVED.has(p.v)) err(`${q(p)} to słowo języka — nie może być nazwą parametru.`, p);
        if (params.includes(p.v)) err(`Parametr ${q(p)} powtarza się.`, p);
        params.push(p.v);
      };
      if (onLine(j) && toks[j]!.t === "ma") {
        const maTok = toks[j]!;
        j++;
        if (!onLine(j)) err(`Po „ma:” podaj nazwy parametrów oddzielone przecinkami.`, maTok);
        for (;;) {
          const p = toks[j]!;
          if (p.colon) err(`Po „ma:” pisz nazwy parametrów bez dwukropka.`, p);
          addParam(p);
          j++;
          if (onLine(j) && toks[j]!.t === "comma") {
            j++;
            if (!onLine(j)) err(`Po przecinku brakuje nazwy parametru.`, toks[j - 1]!);
            continue;
          }
          break;
        }
      } else {
        while (onLine(j) && toks[j]!.t === "word" && toks[j]!.colon) {
          addParam(toks[j]!);
          j++;
        }
      }
      if (onLine(j)) err(`Nieoczekiwane ${q(toks[j]!)} w nagłówku procedury.`, toks[j]!);
      // body
      const bodyToks: Tok[] = [];
      let closed = false;
      while (j < toks.length) {
        const b = toks[j]!;
        if (b.t === "word" && !b.colon && DEF_WORDS.has(b.v)) {
          err(`Nie można definiować procedury wewnątrz innej procedury. Czy brakuje „już” po procedurze „${nameTok.raw}”?`, b);
        }
        if (b.t === "word" && !b.colon && END_WORDS.has(b.v)) {
          if (!b.first || !b.last) err(`${q(b)} musi stać sam w osobnej linii.`, b);
          closed = true;
          j++;
          break;
        }
        bodyToks.push(b);
        j++;
      }
      if (!closed) err(`Procedura „${nameTok.raw}” nie ma zakończenia — dopisz „już” w osobnej linii.`, t);
      raws.push({
        proc: { name: nameTok.v, display: nameTok.raw, params, body: [], tok: t, locals: new Set(params) },
        nameTok,
        bodyToks,
      });
      i = j;
      continue;
    }
    if (t.t === "word" && !t.colon && END_WORDS.has(t.v)) err(`${q(t)} bez wcześniejszego „oto”.`, t);
    if (t.t === "lbr") depth++;
    if (t.t === "rbr" && depth > 0) depth--;
    top.push(t);
    i++;
  }
  return { top, raws };
}

function letNames(toks: Tok[]): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i + 1 < toks.length; i++) {
    const t = toks[i]!;
    const n = toks[i + 1]!;
    if (t.t === "word" && !t.colon && COMMANDS[t.v] === "let" && n.t === "word" && !RESERVED.has(n.v)) s.add(n.v);
  }
  return s;
}

/** Evaluate a name-free expression at parse time (for literal checks). Returns null if it has names. */
function constValue(e: Expr): number | null {
  switch (e.k) {
    case "num":
      return e.v;
    case "var":
    case "rep":
      return null;
    case "neg": {
      const v = constValue(e.e);
      return v === null ? null : -v;
    }
    case "bin": {
      const l = constValue(e.l);
      const r = constValue(e.r);
      if (l === null || r === null) return null;
      return binop(e.op, l, r);
    }
  }
}

export function binop(op: string, l: number, r: number): number {
  switch (op) {
    case "+": return l + r;
    case "-": return l - r;
    case "*": return l * r;
    default: return r === 0 ? NaN : l / r;
  }
}

export function checkWidth(v: number): string | null {
  if (!Number.isFinite(v)) return null; // reported elsewhere
  if (!Number.isInteger(v) || v < 1 || v > 12) return `Grubość musi być liczbą całkowitą od 1 do 12, a wynosi ${fmt(v)}.`;
  return null;
}
export function checkCount(v: number): string | null {
  if (!Number.isFinite(v)) return null;
  if (!Number.isInteger(v) || v < 0 || v > 10000) return `Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000, a wynosi ${fmt(v)}.`;
  return null;
}
export function fmt(v: number): string {
  return String(Math.round(v * 1e6) / 1e6).replace(".", ",");
}

class Parser {
  i = 0;
  depth = 0;
  constructor(
    private toks: Tok[],
    private mode: Mode,
    private procs: Map<string, Proc>,
    private globals: Set<string>,
    private proc: Proc | null,
  ) {}

  peek(): Tok | undefined {
    return this.toks[this.i];
  }

  block(rep: number, cmd: Tok): Stmt[] {
    const open = this.peek();
    if (!open) err(`Brakuje „[” — po ${q(cmd)} podaj polecenia w nawiasach kwadratowych.`, cmd);
    if (open.t !== "lbr") err(`Oczekiwano „[”, a jest ${q(open)}.`, open);
    if (this.depth + 1 > LIMITS.nesting) err(`Za głębokie zagnieżdżenie nawiasów: najwyżej ${LIMITS.nesting} poziomy.`, open);
    this.i++;
    this.depth++;
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) err(`Brakuje zamykającego „]” dla tego nawiasu.`, open);
      if (t.t === "rbr") {
        this.i++;
        break;
      }
      body.push(this.stmt(rep));
    }
    this.depth--;
    return body;
  }

  statements(): Stmt[] {
    const out: Stmt[] = [];
    while (this.i < this.toks.length) {
      const t = this.peek()!;
      if (t.t === "rbr") err(`Nadmiarowy nawias „]” — nie ma do niego pary „[”.`, t);
      out.push(this.stmt(0));
    }
    return out;
  }

  stmt(rep: number): Stmt {
    const t = this.peek()!;
    if (t.t !== "word" || t.colon) {
      if (t.t === "lbr") err(`Nieoczekiwany nawias „[” — nawiasy kwadratowe stoją po poleceniu powtórz, jeśli lub jeżeli.`, t);
      err(`Nieoczekiwane ${q(t)} — w tym miejscu powinno być polecenie.`, t);
    }
    this.i++;
    const cmd = COMMANDS[t.v];
    if (!cmd) {
      const p = this.procs.get(t.v);
      if (p) {
        const args: Arg[] = [];
        for (let n = 0; n < p.params.length; n++) {
          const next = this.peek();
          if (!next || next.t === "rbr" || (next.t === "word" && !next.colon && (COMMANDS[next.v] || this.procs.has(next.v)) && !this.nameKnown(next.v))) {
            err(`Procedura „${p.display}” potrzebuje ${p.params.length} ${plural(p.params.length, "argumentu", "argumentów", "argumentów")}, a podano ${n}.`, next ?? t);
          }
          args.push(this.arg(rep, t));
        }
        return { k: "call", proc: p, args, tok: t };
      }
      if (REPCOUNT.has(t.v)) err(`${q(t)} to wartość, nie polecenie.`, t);
      if (this.nameKnown(t.v)) err(`${q(t)} to zmienna, nie polecenie. Aby zmienić jej wartość, napisz „niech ${t.raw} …”.`, t);
      err(`Nieznane polecenie ${q(t)}.`, t);
    }
    switch (cmd) {
      case "fd": case "bk": case "rt": case "lt":
        return { k: "move", cmd, arg: this.arg(rep, t), tok: t };
      case "up": case "down": case "rr": case "rl":
        if (this.mode === "2d") err(`Polecenie ${q(t)} działa tylko w trybie 3D.`, t);
        return { k: "move", cmd, arg: this.arg(rep, t), tok: t };
      case "pu": case "pd":
        return { k: "pen", down: cmd === "pd", tok: t };
      case "stop":
        return { k: "stop", tok: t };
      case "home":
        return { k: "home", tok: t };
      case "cs":
        return { k: "cs", tok: t };
      case "color": {
        const c = this.peek();
        if (!c) err(`Brakuje koloru po ${q(t)}, np. kolor "#16866a".`, t);
        if (c.t !== "str") err(`Kolor zapisuj w cudzysłowie, np. "#16866a", a jest ${q(c)}.`, c);
        if (!/^#[0-9a-fA-F]{6}$/.test(c.v)) err(`Niepoprawny kolor ${q(c)}: oczekiwano # i sześciu cyfr szesnastkowych, np. "#16866a".`, c);
        this.i++;
        return { k: "color", value: c.v.toLowerCase(), tok: t };
      }
      case "width": {
        const arg = this.arg(rep, t);
        const v = constValue(arg.e);
        if (v !== null) {
          const m = checkWidth(v);
          if (m) err(m, arg.tok);
        }
        return { k: "width", arg, tok: t };
      }
      case "repeat": {
        const arg = this.arg(rep, t);
        const v = constValue(arg.e);
        if (v !== null) {
          const m = checkCount(v);
          if (m) err(m, arg.tok);
        }
        const body = this.block(rep + 1, t);
        return { k: "repeat", arg, body, tok: t };
      }
      case "let": {
        const n = this.peek();
        if (!n || n.t === "rbr") err(`Po ${q(t)} podaj nazwę zmiennej i wartość, np. niech bok 50.`, n ?? t);
        if (n.t !== "word") err(`${q(n)} nie może być nazwą zmiennej.`, n);
        if (RESERVED.has(n.v)) err(`${q(n)} to słowo języka — nie może być nazwą zmiennej.`, n);
        if (this.procs.has(n.v)) err(`${q(n)} to nazwa procedury — zmienna musi nazywać się inaczej.`, n);
        this.i++;
        return { k: "let", name: n.v, arg: this.arg(rep, t), tok: t };
      }
      case "if": {
        const cond = this.cond(rep, t);
        return { k: "if", cond, body: this.block(rep, t), tok: t };
      }
      case "ifelse": {
        const cond = this.cond(rep, t);
        const a = this.block(rep, t);
        const b = this.block(rep, t);
        return { k: "ifelse", cond, a, b, tok: t };
      }
    }
  }

  nameKnown(v: string): boolean {
    return (this.proc !== null && this.proc.locals.has(v)) || this.globals.has(v);
  }

  arg(rep: number, cmd: Tok): Arg {
    const tok = this.peek();
    if (!tok) err(`Brakuje wartości po ${q(cmd)}.`, cmd);
    const e = this.expr(rep, cmd, 0);
    return { e, tok };
  }

  cond(rep: number, cmd: Tok): Cond {
    const tok = this.peek();
    if (!tok) err(`Brakuje warunku po ${q(cmd)}, np. ${cmd.raw} x > 0 [ … ].`, cmd);
    const l = this.expr(rep, cmd, 0);
    const c = this.peek();
    if (!c) err(`Brakuje porównania w warunku (<, >, =, <=, >=, <>).`, cmd);
    if (c.t !== "cmp") err(`Oczekiwano porównania (<, >, =, <=, >=, <>), a jest ${q(c)}.`, c);
    this.i++;
    const r = this.expr(rep, cmd, 0);
    return { l, op: c.v, r, tok };
  }

  isBinary(t: Tok | undefined, ops: string): boolean {
    return !!t && t.t === "op" && ops.includes(t.v) && t.sb === t.sa;
  }

  expr(rep: number, cmd: Tok, pd: number): Expr {
    let l = this.term(rep, cmd, pd);
    while (this.isBinary(this.peek(), "+-")) {
      const op = this.toks[this.i++]!;
      const r = this.term(rep, cmd, pd);
      l = { k: "bin", op: op.v, l, r, tok: op };
    }
    return l;
  }

  term(rep: number, cmd: Tok, pd: number): Expr {
    let l = this.unary(rep, cmd, pd);
    while (this.isBinary(this.peek(), "*/")) {
      const op = this.toks[this.i++]!;
      const r = this.unary(rep, cmd, pd);
      l = { k: "bin", op: op.v, l, r, tok: op };
    }
    return l;
  }

  unary(rep: number, cmd: Tok, pd: number): Expr {
    const t = this.peek();
    if (!t) err(`Brakuje wartości po ${q(cmd)}.`, cmd);
    if (t.t === "op" && (t.v === "-" || t.v === "+")) {
      this.i++;
      const e = this.unary(rep, cmd, pd);
      return t.v === "-" ? { k: "neg", e, tok: t } : e;
    }
    return this.primary(rep, cmd, pd);
  }

  primary(rep: number, cmd: Tok, pd: number): Expr {
    const t = this.peek()!;
    switch (t.t) {
      case "num":
        this.i++;
        return { k: "num", v: t.num, tok: t };
      case "lpar": {
        if (pd + 1 > LIMITS.nesting) err(`Za głębokie zagnieżdżenie nawiasów: najwyżej ${LIMITS.nesting} poziomy.`, t);
        this.i++;
        const e = this.expr(rep, cmd, pd + 1);
        const c = this.peek();
        if (!c) err(`Brakuje zamykającego „)” dla tego nawiasu.`, t);
        if (c.t !== "rpar") err(`Oczekiwano „)”, a jest ${q(c)}.`, c);
        this.i++;
        return e;
      }
      case "word": {
        if (!t.colon && REPCOUNT.has(t.v)) {
          if (rep === 0) err(`${q(t)} można użyć tylko wewnątrz powtórz […].`, t);
          this.i++;
          return { k: "rep", tok: t };
        }
        if (!t.colon && RESERVED.has(t.v)) err(`Brakuje wartości po ${q(cmd)} — ${q(t)} to polecenie, a nie liczba.`, t);
        if (!this.nameKnown(t.v)) {
          if (!t.colon && this.procs.has(t.v)) err(`${q(t)} to procedura — nie ma wartości, której można tu użyć.`, t);
          err(`Nieznana nazwa ${q(t)}: to nie jest parametr ani zmienna ustawiona przez „niech”.`, t);
        }
        this.i++;
        return { k: "var", name: t.v, tok: t };
      }
      case "rbr":
      case "rpar":
        err(`Brakuje wartości po ${q(cmd)}.`, t);
      case "str":
        err(`Tekst ${q(t)} nie jest liczbą.`, t);
      default:
        err(`Oczekiwano wartości, a jest ${q(t)}.`, t);
    }
  }
}

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const dd = n % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return few;
  return many;
}

export function parse(source: string, mode: Mode): Program {
  const toks = lex(source);
  const { top, raws } = split(toks);
  const procs = new Map<string, Proc>();
  for (const r of raws) {
    if (procs.has(r.proc.name)) err(`Procedura „${r.nameTok.raw}” jest już zdefiniowana.`, r.nameTok);
    procs.set(r.proc.name, r.proc);
  }
  const globals = letNames(top);
  for (const r of raws) for (const n of letNames(r.bodyToks)) r.proc.locals.add(n);
  // Parse in source order so the first error in the text is reported.
  const units: { first: Tok | undefined; run: () => void }[] = [];
  let body: Stmt[] = [];
  units.push({
    first: top[0],
    run: () => {
      body = new Parser(top, mode, procs, globals, null).statements();
    },
  });
  for (const r of raws) {
    units.push({
      first: r.proc.tok,
      run: () => {
        r.proc.body = new Parser(r.bodyToks, mode, procs, globals, r.proc).statements();
      },
    });
  }
  // Collect errors and report the earliest one.
  let first: LogoError | null = null;
  for (const u of units) {
    try {
      u.run();
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      if (!first || e.line < first.line || (e.line === first.line && e.column < first.column)) first = e;
    }
  }
  if (first) throw first;
  return { mode, body, procs };
}
