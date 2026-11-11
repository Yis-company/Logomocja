// Interpreter dialektu Logo używanego w Logomocji.
// Czysty moduł: bez DOM, bez zależności. Leksykon → parser → maszyna krokowa.

export type Mode = "2d" | "3d";
export type Vec3 = [number, number, number];

export interface Segment {
  from: Vec3;
  to: Vec3;
  color: string;
  width: number;
}

export interface LogoError {
  message: string;
  line: number;
  column: number;
}

export interface RunResult {
  segments: Segment[];
  error: LogoError | null;
}

export const LIMITS = {
  chars: 50_000,
  tokens: 10_000,
  depth: 32,
  frames: 32,
  ops: 10_000,
  segments: 10_000,
  coord: 100_000,
  repeat: 10_000,
  widthMin: 1,
  widthMax: 12,
} as const;

export const DEFAULT_COLOR = "#16866a";
export const DEFAULT_WIDTH = 3;

export class LogoErr extends Error {
  line: number;
  column: number;
  phase: "parse" | "run";
  constructor(message: string, pos: { line: number; col: number }, phase: "parse" | "run" = "parse") {
    super(message);
    this.line = pos.line;
    this.column = pos.col;
    this.phase = phase;
  }
  toJSON(): LogoError {
    return { message: this.message, line: this.line, column: this.column };
  }
}

// ---------------------------------------------------------------- słownik

export type CmdId =
  | "fd" | "bk" | "rt" | "lt" | "pu" | "pd" | "color" | "width" | "repeat" | "let"
  | "if" | "ifelse" | "stop" | "home" | "cs" | "pitchup" | "pitchdown" | "rollright" | "rollleft";

export const COMMAND_ALIASES: Record<CmdId, string[]> = {
  fd: ["np", "naprzod", "naprzód", "fd", "forward"],
  bk: ["ws", "wstecz", "bk", "back"],
  rt: ["pw", "prawo", "rt", "right"],
  lt: ["lw", "lewo", "lt", "left"],
  pu: ["pod", "podnies", "podnieś", "pu", "penup"],
  pd: ["opu", "opusc", "opuść", "pd", "pendown"],
  color: ["kolor", "color"],
  width: ["grubosc", "grubość", "width"],
  repeat: ["powtorz", "powtórz", "repeat"],
  let: ["niech", "let"],
  if: ["jeśli", "jesli", "if"],
  ifelse: ["jeżeli", "jezeli", "ifelse"],
  stop: ["stop"],
  home: ["dom", "home"],
  cs: ["czyść", "czysc", "cs", "clearscreen"],
  pitchup: ["gora", "góra", "pitchup"],
  pitchdown: ["dol", "dół", "pitchdown"],
  rollright: ["pp", "przechylprawo", "rr", "rollright"],
  rollleft: ["pl", "przechyllewo", "rl", "rollleft"],
};

const CMD = new Map<string, CmdId>();
for (const id of Object.keys(COMMAND_ALIASES) as CmdId[]) for (const a of COMMAND_ALIASES[id]) CMD.set(a, id);

export const TO_WORDS = ["oto", "to"];
export const END_WORDS = ["już", "juz", "end"];
export const REPCOUNT_WORDS = ["nrpowt", "repcount"];
const NOT_NUMBERS = ["nan", "infinity"];

const TO = new Set(TO_WORDS);
const END = new Set(END_WORDS);
const REPCOUNT = new Set(REPCOUNT_WORDS);
const NOTNUM = new Set(NOT_NUMBERS);

export function isReserved(lc: string): boolean {
  return CMD.has(lc) || TO.has(lc) || END.has(lc) || REPCOUNT.has(lc) || NOTNUM.has(lc);
}
export function commandId(lc: string): CmdId | undefined {
  return CMD.get(lc);
}
export function fold(word: string): string {
  return word.normalize("NFC").toLowerCase();
}

// ---------------------------------------------------------------- leksykon

type TokType = "num" | "word" | "cword" | "str" | "[" | "]" | "(" | ")" | "," | "op" | "cmp" | "ma:" | "err" | "eof";

interface Tok {
  t: TokType;
  v: string; // tekst źródłowy
  lc: string; // nazwa: małe litery, bez dwukropka
  n: number;
  line: number;
  col: number;
  sb: boolean; // odstęp przed
  sa: boolean; // odstęp po
  first: boolean; // pierwszy w wierszu
  last: boolean; // ostatni w wierszu
}

const RE_ID_START = /[\p{L}_]/u;
const RE_ID = /[\p{L}\p{N}\p{M}_]/u;
const RE_WS = /\s/;
const RE_NUM = /(?:\d+\.\d+|\d+|\.\d+)/y;

function lex(src: string): Tok[] {
  const toks: Tok[] = [];
  let i = 0;
  let line = 1;
  let col = 1;
  const n = src.length;
  const push = (t: TokType, v: string, startCol: number, extra?: Partial<Tok>) => {
    const startIdx = i - v.length;
    const before = startIdx === 0 ? " " : src[startIdx - 1];
    const after = i >= n ? " " : src[i];
    toks.push({
      t, v, lc: "", n: 0, line, col: startCol,
      sb: RE_WS.test(before),
      sa: RE_WS.test(after) || after === ";",
      first: false, last: false,
      ...extra,
    });
  };
  const fail = (message: string, c: number) => {
    toks.push({ t: "err", v: message, lc: "", n: 0, line, col: c, sb: true, sa: true, first: false, last: false });
  };
  scan: while (i < n) {
    const ch = src[i];
    if (ch === "\n") { i++; line++; col = 1; continue; }
    if (ch === "\r") { i++; if (src[i] === "\n") i++; line++; col = 1; continue; }
    if (RE_WS.test(ch)) { i++; col++; continue; }
    if (ch === ";") {
      while (i < n && src[i] !== "\n" && src[i] !== "\r") { i++; col++; }
      continue;
    }
    const c0 = col;
    if ((ch >= "0" && ch <= "9") || (ch === "." && src[i + 1] >= "0" && src[i + 1] <= "9")) {
      RE_NUM.lastIndex = i;
      const m = RE_NUM.exec(src)!;
      let end = i + m[0].length;
      if (end < n && (RE_ID.test(src[end]) || src[end] === ".")) {
        while (end < n && (RE_ID.test(src[end]) || src[end] === ".")) end++;
        fail(`Niepoprawna liczba „${src.slice(i, end)}”. Liczby zapisuj cyframi, z kropką dziesiętną: 80, 12.5, .5.`, c0);
        break scan;
      }
      const val = Number(m[0]);
      if (!Number.isFinite(val)) {
        fail("Ta liczba jest zbyt duża.", c0);
        break scan;
      }
      i = end; col += m[0].length;
      push("num", m[0], c0, { n: val });
      continue;
    }
    if (RE_ID_START.test(ch)) {
      let end = i + 1;
      while (end < n && RE_ID.test(src[end])) end++;
      const v = src.slice(i, end);
      const lc = fold(v);
      if (lc === "ma" && src[end] === ":") {
        i = end + 1; col += v.length + 1;
        push("ma:", v + ":", c0, { lc: "ma:" });
        continue;
      }
      i = end; col += v.length;
      push("word", v, c0, { lc });
      continue;
    }
    if (ch === ":") {
      if (i + 1 < n && RE_ID_START.test(src[i + 1])) {
        let end = i + 2;
        while (end < n && RE_ID.test(src[end])) end++;
        const v = src.slice(i, end);
        i = end; col += v.length;
        push("cword", v, c0, { lc: fold(v.slice(1)) });
        continue;
      }
      fail("Po dwukropku oczekiwano nazwy, na przykład :bok.", c0);
      break scan;
    }
    if (ch === '"') {
      let end = i + 1;
      while (end < n && src[end] !== '"' && src[end] !== "\n" && src[end] !== "\r") end++;
      if (src[end] !== '"') {
        fail('Brakuje zamykającego cudzysłowu. Kolor zapisz tak: "#16866a".', c0);
        break scan;
      }
      const v = src.slice(i, end + 1);
      i = end + 1; col += v.length;
      push("str", v, c0, { lc: v.slice(1, -1).toLowerCase() });
      continue;
    }
    if (ch === "[" || ch === "]" || ch === "(" || ch === ")" || ch === ",") {
      i++; col++;
      push(ch as TokType, ch, c0);
      continue;
    }
    if (ch === "+" || ch === "-" || ch === "*" || ch === "/") {
      i++; col++;
      push("op", ch, c0);
      continue;
    }
    if (ch === "<" || ch === ">" || ch === "=") {
      let v = ch;
      if (ch === "<" && (src[i + 1] === "=" || src[i + 1] === ">")) v += src[i + 1];
      else if (ch === ">" && src[i + 1] === "=") v += "=";
      i += v.length; col += v.length;
      push("cmp", v, c0);
      continue;
    }
    const cp = String.fromCodePoint(src.codePointAt(i)!);
    fail(`Nieznany znak „${cp}”.`, c0);
    break scan;
  }
  for (let k = 0; k < toks.length; k++) {
    toks[k].first = k === 0 || toks[k - 1].line !== toks[k].line;
    toks[k].last = k === toks.length - 1 || toks[k + 1].line !== toks[k].line;
  }
  toks.push({ t: "eof", v: "", lc: "", n: 0, line, col, sb: true, sa: true, first: true, last: true });
  return toks;
}

// ---------------------------------------------------------------- drzewo

type Pos = { line: number; col: number };

type RItem =
  | { k: "n"; v: number }
  | { k: "v"; name: string }
  | { k: "rc" }
  | { k: "o"; o: "+" | "-" | "*" | "/" | "neg" };

interface Expr {
  rpn: RItem[];
  pos: Pos;
  /** wartość stała, gdy wyrażenie nie zawiera nazw i dało się je policzyć */
  constant?: number;
  literal: boolean;
}

interface Cond {
  l: Expr;
  op: string;
  r: Expr;
  pos: Pos;
}

type Stmt =
  | { k: "move"; sign: 1 | -1; e: Expr; pos: Pos }
  | { k: "turn"; axis: "yaw" | "pitch" | "roll"; sign: 1 | -1; e: Expr; pos: Pos }
  | { k: "pen"; down: boolean; pos: Pos }
  | { k: "color"; c: string; pos: Pos }
  | { k: "width"; e: Expr; pos: Pos }
  | { k: "repeat"; e: Expr; body: Stmt[]; close: Pos; pos: Pos }
  | { k: "let"; name: string; e: Expr; pos: Pos }
  | { k: "if"; cond: Cond; a: Stmt[]; b: Stmt[] | null; closeA: Pos; closeB: Pos; pos: Pos }
  | { k: "stop"; pos: Pos }
  | { k: "home"; pos: Pos }
  | { k: "cs"; pos: Pos }
  | { k: "call"; name: string; args: Expr[]; pos: Pos };

interface Proc {
  name: string;
  shown: string;
  params: string[];
  body: Stmt[];
  pos: Pos;
  end: Pos;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Proc>;
}

const CMD_LABEL: Record<CmdId, string> = {
  fd: "np", bk: "ws", rt: "pw", lt: "lw", pu: "pod", pd: "opu", color: "kolor", width: "grubosc",
  repeat: "powtorz", let: "niech", if: "jeśli", ifelse: "jeżeli", stop: "stop", home: "dom", cs: "czyść",
  pitchup: "gora", pitchdown: "dol", rollright: "pp", rollleft: "pl",
};

function describe(t: Tok): string {
  if (t.t === "eof") return "koniec programu";
  return `„${t.v}”`;
}

// ---------------------------------------------------------------- parser

interface Scope {
  params: Set<string>;
  locals: Set<string>;
}

class Parser {
  toks: Tok[];
  i = 0;
  mode: Mode;
  procs = new Map<string, Proc>();
  arity = new Map<string, number>();
  globals = new Set<string>();
  procLocals = new Map<string, Set<string>>();
  scope: Scope | null = null;
  repeatDepth = 0;
  depth = 0;

  constructor(src: string, mode: Mode) {
    this.mode = mode;
    if (src.length > LIMITS.chars) {
      throw new LogoErr(
        `Program jest za długi: ${src.length} znaków, a limit to ${LIMITS.chars}. Skróć go.`,
        { line: 1, col: 1 },
      );
    }
    this.toks = lex(src);
    const real = this.toks.length - 1;
    if (real > LIMITS.tokens && this.toks.slice(0, LIMITS.tokens + 1).every((t) => t.t !== "err")) {
      const t = this.toks[LIMITS.tokens];
      throw new LogoErr(`Program ma za dużo elementów: limit to ${LIMITS.tokens} słów, liczb i znaków.`, t);
    }
    this.prescan();
  }

  /** Zbiera nazwy procedur (z liczbą parametrów) i zmiennych, bo można ich używać przed definicją. */
  prescan() {
    const T = this.toks;
    let current: Set<string> | null = null;
    for (let k = 0; k < T.length; k++) {
      const t = T[k];
      if (t.t !== "word") continue;
      if (TO.has(t.lc) && t.first && current === null) {
        const nameTok = T[k + 1];
        current = new Set();
        if (nameTok && nameTok.t === "word" && nameTok.line === t.line) {
          let count = 0;
          let j = k + 2;
          for (; j < T.length && T[j].line === t.line && T[j].t !== "eof"; j++) {
            if (T[j].t === "word" || T[j].t === "cword") count++;
          }
          if (!this.arity.has(nameTok.lc)) {
            this.arity.set(nameTok.lc, count);
            this.procLocals.set(nameTok.lc, current);
          }
          k = j - 1;
        }
        continue;
      }
      if (END.has(t.lc) && t.first && t.last && current !== null) {
        current = null;
        continue;
      }
      if (CMD.get(t.lc) === "let") {
        const nt = T[k + 1];
        if (nt && (nt.t === "word" || nt.t === "cword")) (current ?? this.globals).add(nt.lc);
      }
    }
  }

  get tok(): Tok {
    const t = this.toks[this.i];
    if (t.t === "err") throw new LogoErr(t.v, t);
    return t;
  }
  next(): Tok {
    const t = this.tok;
    if (t.t !== "eof") this.i++;
    return t;
  }

  parse(): Program {
    const body = this.block(null, null);
    return { mode: this.mode, body, procs: this.procs };
  }

  /** open: nawias otwierający blok albo null; procTok: „oto” bieżącej procedury albo null */
  block(open: Tok | null, procTok: Tok | null): Stmt[] {
    const out: Stmt[] = [];
    for (;;) {
      const t = this.tok;
      if (t.t === "eof") {
        if (open) throw new LogoErr("Brakuje nawiasu zamykającego „]” dla tego nawiasu „[”.", open);
        if (procTok) {
          throw new LogoErr("Brakuje słowa „już” kończącego tę procedurę. Wpisz „już” w osobnym wierszu.", procTok);
        }
        return out;
      }
      if (t.t === "]") {
        if (open) return out;
        throw new LogoErr("Nawias „]” nie ma pasującego nawiasu „[”.", t);
      }
      if (t.t === "word" && END.has(t.lc)) {
        if (open && procTok) {
          throw new LogoErr("Brakuje nawiasu zamykającego „]” przed końcem procedury.", open);
        }
        if (open) throw new LogoErr(`Słowo ${describe(t)} kończy procedurę i nie może stać wewnątrz nawiasów [ ].`, t);
        if (!procTok) throw new LogoErr(`Słowo ${describe(t)} bez pasującego „oto”. Usuń je albo zacznij procedurę od „oto nazwa”.`, t);
        if (!t.first || !t.last) {
          throw new LogoErr(`Słowo ${describe(t)} musi stać samo w osobnym wierszu.`, t);
        }
        return out;
      }
      if (t.t === "word" && TO.has(t.lc)) {
        if (open) {
          throw new LogoErr("Procedury nie można definiować wewnątrz nawiasów [ ]. Przenieś definicję na początek programu.", t);
        }
        if (procTok) {
          throw new LogoErr("Procedury nie można definiować wewnątrz innej procedury. Być może brakuje wcześniej słowa „już”.", t);
        }
        if (!t.first) throw new LogoErr(`Definicja procedury (${describe(t)}) musi zaczynać się na początku wiersza.`, t);
        this.procedure();
        continue;
      }
      out.push(this.statement());
    }
  }

  procedure() {
    const head = this.next();
    const sameLine = (t: Tok) => t.t !== "eof" && t.line === head.line;
    const nameTok = this.tok;
    if (!sameLine(nameTok)) throw new LogoErr(`Po ${describe(head)} podaj nazwę procedury w tym samym wierszu, na przykład: oto kwadrat.`, head);
    if (nameTok.t !== "word") throw new LogoErr(`${describe(nameTok)} nie może być nazwą procedury. Nazwa zaczyna się od litery.`, nameTok);
    if (isReserved(nameTok.lc)) throw new LogoErr(`Nazwa ${describe(nameTok)} jest zajęta przez język. Wybierz inną nazwę procedury.`, nameTok);
    if (this.procs.has(nameTok.lc)) throw new LogoErr(`Procedura ${describe(nameTok)} jest już zdefiniowana. Każdą nazwę można zdefiniować tylko raz.`, nameTok);
    this.next();
    const params: string[] = [];
    const addParam = (t: Tok) => {
      if (isReserved(t.lc)) throw new LogoErr(`Nazwa ${describe(t)} jest zajęta przez język. Wybierz inną nazwę parametru.`, t);
      if (params.includes(t.lc)) throw new LogoErr(`Parametr ${describe(t)} występuje dwa razy.`, t);
      params.push(t.lc);
      this.next();
    };
    let t = this.tok;
    if (sameLine(t) && t.t === "ma:") {
      const ma = this.next();
      for (;;) {
        t = this.tok;
        if (!sameLine(t)) throw new LogoErr("Po „ma:” podaj nazwy parametrów oddzielone przecinkami, na przykład: ma: bok, kąt.", params.length ? this.toks[this.i - 1] : ma);
        if (t.t !== "word" && t.t !== "cword") throw new LogoErr(`Oczekiwano nazwy parametru, a jest ${describe(t)}.`, t);
        addParam(t);
        t = this.tok;
        if (sameLine(t) && t.t === ",") { this.next(); continue; }
        break;
      }
    } else if (sameLine(t) && t.t === "cword") {
      while (sameLine(this.tok) && this.tok.t === "cword") addParam(this.tok);
    }
    t = this.tok;
    if (sameLine(t)) {
      if (params.length && (t.t === "word" || t.t === "cword")) {
        throw new LogoErr(`Parametry oddziel przecinkami: brakuje przecinka przed ${describe(t)}.`, t);
      }
      if (!params.length && t.t === "word") {
        throw new LogoErr(`Parametry podaj po słowie „ma:”, na przykład: oto ${nameTok.v} ma: ${t.v}.`, t);
      }
      throw new LogoErr(`Nagłówek procedury kończy się w tym wierszu, a jest tu jeszcze ${describe(t)}. Treść zacznij od nowego wiersza.`, t);
    }
    const locals = this.procLocals.get(nameTok.lc) ?? new Set<string>();
    const proc: Proc = { name: nameTok.lc, shown: nameTok.v, params, body: [], pos: nameTok, end: nameTok };
    this.procs.set(nameTok.lc, proc);
    const saved = { scope: this.scope, repeatDepth: this.repeatDepth, depth: this.depth };
    this.scope = { params: new Set(params), locals };
    this.repeatDepth = 0;
    this.depth = 0;
    proc.body = this.block(null, head);
    proc.end = this.next();
    this.scope = saved.scope;
    this.repeatDepth = saved.repeatDepth;
    this.depth = saved.depth;
  }

  statement(): Stmt {
    const t = this.tok;
    if (t.t === "word") {
      const id = CMD.get(t.lc);
      if (id) {
        this.next();
        return this.command(id, t);
      }
      const n = this.arity.get(t.lc);
      if (n !== undefined && !REPCOUNT.has(t.lc)) {
        this.next();
        const args: Expr[] = [];
        for (let k = 0; k < n; k++) {
          args.push(this.expr(t, () => {
            return `Procedura „${t.v}” przyjmuje ${plArgs(n)}, a podano ${k}.`;
          }));
        }
        const after = this.tok;
        if (this.startsValue(after)) {
          const takes = n === 0 ? "nie przyjmuje argumentów" : `przyjmuje ${plArgs(n)}`;
          throw new LogoErr(`Procedura „${t.v}” ${takes}, a tu jest dodatkowa wartość: ${describe(after)}.`, after);
        }
        return { k: "call", name: t.lc, args, pos: t };
      }
      if (REPCOUNT.has(t.lc)) {
        throw new LogoErr(`${describe(t)} to wartość, nie polecenie. Użyj jej jako argumentu, na przykład: np ${t.v} * 10.`, t);
      }
      if (this.isName(t.lc)) {
        throw new LogoErr(`W tym miejscu oczekiwano polecenia, a ${describe(t)} to wartość. Być może brakuje przed nią polecenia, na przykład „np”.`, t);
      }
      if (NOTNUM.has(t.lc)) throw new LogoErr(`${describe(t)} nie jest ani poleceniem, ani liczbą.`, t);
      throw new LogoErr(`Nieznane polecenie ${describe(t)}. Sprawdź pisownię albo zdefiniuj procedurę: oto ${t.v}.`, t);
    }
    if (t.t === "num" || t.t === "cword" || t.t === "str") {
      throw new LogoErr(`W tym miejscu oczekiwano polecenia, a jest wartość ${describe(t)}. Być może brakuje przed nią polecenia albo poprzednie polecenie ma za dużo argumentów.`, t);
    }
    if (t.t === "op") {
      throw new LogoErr(`W tym miejscu oczekiwano polecenia, a jest ${describe(t)}. Operator musi mieć odstęp z obu stron albo z żadnej: „10 ${t.v} 5” lub „10${t.v}5”.`, t);
    }
    if (t.t === "[") {
      throw new LogoErr("Nieoczekiwany nawias „[”. Nawias kwadratowy może stać tylko po „powtorz”, „jeśli” lub „jeżeli”.", t);
    }
    if (t.t === ")") throw new LogoErr("Nawias „)” nie ma pasującego nawiasu „(”.", t);
    if (t.t === "(") throw new LogoErr("W tym miejscu oczekiwano polecenia, a jest nawias „(”.", t);
    if (t.t === "ma:") throw new LogoErr("„ma:” może wystąpić tylko w nagłówku procedury, po jej nazwie.", t);
    throw new LogoErr(`W tym miejscu oczekiwano polecenia, a jest ${describe(t)}.`, t);
  }

  isName(lc: string): boolean {
    return !!(this.scope && (this.scope.params.has(lc) || this.scope.locals.has(lc))) || this.globals.has(lc);
  }

  startsValue(t: Tok): boolean {
    if (t.t === "num" || t.t === "cword" || t.t === "(") return true;
    if (t.t === "op") return true;
    if (t.t === "word") {
      if (REPCOUNT.has(t.lc)) return true;
      if (CMD.has(t.lc) || TO.has(t.lc) || END.has(t.lc)) return false;
      if (this.arity.has(t.lc)) return false;
      return this.isName(t.lc);
    }
    return false;
  }

  command(id: CmdId, t: Tok): Stmt {
    const label = `„${t.v}”`;
    const need = (what: string) => () => `Polecenie ${label} wymaga argumentu: ${what}.`;
    switch (id) {
      case "fd":
        return { k: "move", sign: 1, e: this.expr(t, need("odległości, na przykład 100")), pos: t };
      case "bk":
        return { k: "move", sign: -1, e: this.expr(t, need("odległości, na przykład 100")), pos: t };
      case "rt":
        return { k: "turn", axis: "yaw", sign: 1, e: this.expr(t, need("kąta w stopniach, na przykład 90")), pos: t };
      case "lt":
        return { k: "turn", axis: "yaw", sign: -1, e: this.expr(t, need("kąta w stopniach, na przykład 90")), pos: t };
      case "pitchup":
      case "pitchdown":
      case "rollright":
      case "rollleft": {
        if (this.mode === "2d") {
          throw new LogoErr(`Polecenie ${label} działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`, t);
        }
        const e = this.expr(t, need("kąta w stopniach, na przykład 90"));
        const axis = id === "pitchup" || id === "pitchdown" ? "pitch" : "roll";
        const sign = id === "pitchup" || id === "rollright" ? 1 : -1;
        return { k: "turn", axis, sign, e, pos: t };
      }
      case "pu":
        return { k: "pen", down: false, pos: t };
      case "pd":
        return { k: "pen", down: true, pos: t };
      case "stop":
        return { k: "stop", pos: t };
      case "home":
        return { k: "home", pos: t };
      case "cs":
        return { k: "cs", pos: t };
      case "color": {
        const a = this.tok;
        if (a.t !== "str") {
          const msg = `Polecenie ${label} wymaga koloru w cudzysłowie, na przykład: ${t.v} "#16866a".`;
          throw new LogoErr(msg, a.t === "eof" ? t : a);
        }
        if (!/^#[0-9a-f]{6}$/.test(a.lc)) {
          throw new LogoErr(`Niepoprawny kolor ${a.v}. Kolor to znak # i sześć cyfr szesnastkowych, na przykład "#16866a".`, a);
        }
        this.next();
        return { k: "color", c: a.lc, pos: t };
      }
      case "width": {
        const e = this.expr(t, need("liczby całkowitej od 1 do 12"));
        if (e.constant !== undefined) checkWidth(e.constant, e.pos, "parse");
        return { k: "width", e, pos: t };
      }
      case "repeat": {
        const e = this.expr(t, need("liczby powtórzeń, na przykład 4"));
        if (e.constant !== undefined) checkRepeat(e.constant, e.pos, "parse");
        const open = this.tok;
        if (open.t !== "[") {
          throw new LogoErr(`Po liczbie powtórzeń oczekiwano nawiasu „[” z poleceniami, a jest ${describe(open)}.`, open.t === "eof" ? t : open);
        }
        this.repeatDepth++;
        const { body, close } = this.bracketed();
        this.repeatDepth--;
        return { k: "repeat", e, body, close, pos: t };
      }
      case "let": {
        const nt = this.tok;
        if (nt.t !== "word" && nt.t !== "cword") {
          throw new LogoErr(`Po ${label} podaj nazwę zmiennej, a potem wartość, na przykład: ${t.v} bok 50.`, nt.t === "eof" ? t : nt);
        }
        if (isReserved(nt.lc)) {
          throw new LogoErr(`Nazwa ${describe(nt)} jest zajęta przez język i nie może być zmienną. Wybierz inną nazwę.`, nt);
        }
        if (this.arity.has(nt.lc)) {
          throw new LogoErr(`${describe(nt)} to nazwa procedury i nie może być zmienną. Wybierz inną nazwę.`, nt);
        }
        this.next();
        const e = this.expr(t, () => `Po nazwie zmiennej „${nt.v}” podaj jej wartość, na przykład: ${t.v} ${nt.v} 50.`);
        return { k: "let", name: nt.lc, e, pos: t };
      }
      case "if":
      case "ifelse": {
        const cond = this.condition(t);
        const openA = this.tok;
        if (openA.t !== "[") {
          throw new LogoErr(`Po warunku oczekiwano nawiasu „[” z poleceniami, a jest ${describe(openA)}.`, openA.t === "eof" ? t : openA);
        }
        const A = this.bracketed();
        if (id === "if") return { k: "if", cond, a: A.body, b: null, closeA: A.close, closeB: A.close, pos: t };
        const openB = this.tok;
        if (openB.t !== "[") {
          throw new LogoErr(`Polecenie ${label} wymaga dwóch bloków: [gdy prawda] [gdy fałsz]. Brakuje drugiego nawiasu „[”.`, openB.t === "eof" ? t : openB);
        }
        const B = this.bracketed();
        return { k: "if", cond, a: A.body, b: B.body, closeA: A.close, closeB: B.close, pos: t };
      }
    }
  }

  bracketed(): { body: Stmt[]; close: Pos } {
    const open = this.next();
    if (this.depth >= LIMITS.depth) {
      throw new LogoErr(`Nawiasy [ ] są zagnieżdżone zbyt głęboko: limit to ${LIMITS.depth} poziomy.`, open);
    }
    this.depth++;
    const body = this.block(open, this.scope ? open : null);
    const close = this.next();
    this.depth--;
    return { body, close };
  }

  condition(cmd: Tok): Cond {
    const label = `„${cmd.v}”`;
    const l = this.expr(cmd, () => `Polecenie ${label} wymaga warunku, na przykład: ${cmd.v} bok > 10 [ ... ].`);
    const c = this.tok;
    if (c.t !== "cmp") {
      throw new LogoErr(`W warunku oczekiwano porównania (<, >, =, <=, >=, <>), a jest ${describe(c)}.`, c.t === "eof" ? cmd : c);
    }
    this.next();
    const r = this.expr(cmd, () => `Po „${c.v}” oczekiwano wartości do porównania.`);
    return { l, op: c.v, r, pos: l.pos };
  }

  /** Wyrażenie metodą stacji rozrządowej: bez rekurencji, wynik w odwrotnej notacji polskiej. */
  expr(cmd: Tok, missing: () => string): Expr {
    const first = this.tok;
    const out: RItem[] = [];
    const ops: { o: "+" | "-" | "*" | "/" | "neg" | "pos" | "("; tok: Tok }[] = [];
    const prec = (o: string) => (o === "neg" || o === "pos" ? 3 : o === "*" || o === "/" ? 2 : 1);
    const emit = (o: string) => {
      if (o !== "pos") out.push({ k: "o", o: o as "+" });
    };
    let literal = true;
    let expectOperand = true;
    let parens = 0;
    let started = false;
    for (;;) {
      const t = this.tok;
      if (expectOperand) {
        if (t.t === "num") {
          out.push({ k: "n", v: t.n });
        } else if (t.t === "op" && (t.v === "-" || t.v === "+")) {
          ops.push({ o: t.v === "-" ? "neg" : "pos", tok: t });
          this.next();
          started = true;
          continue;
        } else if (t.t === "(") {
          ops.push({ o: "(", tok: t });
          parens++;
          this.next();
          started = true;
          continue;
        } else if (t.t === "cword" || (t.t === "word" && !CMD.has(t.lc) && !TO.has(t.lc) && !END.has(t.lc) && (REPCOUNT.has(t.lc) || this.isName(t.lc) || !this.arity.has(t.lc)))) {
          if (t.t === "word" && REPCOUNT.has(t.lc)) {
            if (this.repeatDepth === 0) {
              throw new LogoErr(`${describe(t)} działa tylko wewnątrz nawiasów polecenia „powtorz”${this.scope ? " w tej samej procedurze" : ""}.`, t);
            }
            out.push({ k: "rc" });
          } else if (NOTNUM.has(t.lc) && t.t === "word") {
            throw new LogoErr(`${describe(t)} nie jest liczbą. Liczby zapisuj cyframi: 80, 12.5, .5.`, t);
          } else if (this.isName(t.lc)) {
            out.push({ k: "v", name: t.lc });
          } else {
            throw new LogoErr(`Nieznana nazwa ${describe(t)}. Nadaj jej wartość poleceniem „niech ${t.lc} ...” albo dodaj ją do parametrów procedury.`, t);
          }
          literal = false;
        } else {
          // brak operandu
          if (!started) {
            throw new LogoErr(missing(), t.t === "eof" || t.line !== cmd.line ? cmd : t);
          }
          const prev = this.toks[this.i - 1];
          if (prev.t === "(" && t.t === ")") throw new LogoErr("Pusty nawias: między „(” a „)” oczekiwano wartości.", t);
          if (t.t === "word" && this.arity.has(t.lc)) {
            throw new LogoErr(`${describe(t)} to procedura, a nie wartość. Procedury nie zwracają wyników.`, t);
          }
          throw new LogoErr(`Po „${prev.v}” oczekiwano wartości, a jest ${describe(t)}.`, t.t === "eof" ? prev : t);
        }
        this.next();
        started = true;
        expectOperand = false;
        continue;
      }
      // oczekujemy operatora albo końca wyrażenia
      if (t.t === ")" && parens > 0) {
        while (ops[ops.length - 1].o !== "(") emit(ops.pop()!.o);
        ops.pop();
        parens--;
        this.next();
        continue;
      }
      if (t.t === "op") {
        if (t.sb === t.sa) {
          const p = prec(t.v);
          while (ops.length && ops[ops.length - 1].o !== "(" && prec(ops[ops.length - 1].o) >= p) emit(ops.pop()!.o);
          ops.push({ o: t.v as "+", tok: t });
          this.next();
          expectOperand = true;
          continue;
        }
        if (!t.sb && t.sa) {
          throw new LogoErr(`Operator „${t.v}” musi mieć odstęp z obu stron albo z żadnej: „10 ${t.v} 5” lub „10${t.v}5”.`, t);
        }
        if (parens > 0) {
          throw new LogoErr(`Operator „${t.v}” musi mieć odstęp z obu stron albo z żadnej: „10 ${t.v} 5” lub „10${t.v}5”.`, t);
        }
        break; // odstęp tylko z lewej: to początek następnej wartości
      }
      if (parens > 0) {
        let open = ops.length - 1;
        while (ops[open].o !== "(") open--;
        throw new LogoErr("Brakuje nawiasu zamykającego „)” dla tego nawiasu „(”.", ops[open].tok);
      }
      break;
    }
    while (ops.length) emit(ops.pop()!.o);
    const e: Expr = { rpn: out, pos: { line: first.line, col: first.col }, literal };
    if (literal) {
      try {
        e.constant = evalRpn(out, e.pos, null as never);
      } catch {
        // dzielenie przez zero itp. zgłosi wykonanie
      }
    }
    return e;
  }
}

function plArgs(n: number): string {
  if (n === 1) return "1 argument";
  const d = n % 10;
  const h = n % 100;
  return d >= 2 && d <= 4 && !(h >= 12 && h <= 14) ? `${n} argumenty` : `${n} argumentów`;
}

function checkWidth(v: number, pos: Pos, phase: "parse" | "run") {
  if (!Number.isInteger(v) || v < LIMITS.widthMin || v > LIMITS.widthMax) {
    throw new LogoErr(`Grubość musi być liczbą całkowitą od 1 do 12, a jest ${fmt(v)}.`, pos, phase);
  }
}
function checkRepeat(v: number, pos: Pos, phase: "parse" | "run") {
  if (!Number.isInteger(v) || v < 0 || v > LIMITS.repeat) {
    throw new LogoErr(`Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000, a jest ${fmt(v)}.`, pos, phase);
  }
}

export function fmt(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const s = v.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return s === "-0" ? "0" : s;
}

interface Env {
  locals: Map<string, number> | null;
  rc: number[];
}

function evalRpn(rpn: RItem[], pos: Pos, ctx: { env: Env; globals: Map<string, number> }): number {
  const st: number[] = [];
  for (let i = 0; i < rpn.length; i++) {
    const it = rpn[i];
    switch (it.k) {
      case "n":
        st.push(it.v);
        break;
      case "rc":
        st.push(ctx.env.rc[ctx.env.rc.length - 1]);
        break;
      case "v": {
        let v: number | undefined;
        if (ctx.env.locals && ctx.env.locals.has(it.name)) v = ctx.env.locals.get(it.name);
        else v = ctx.globals.get(it.name);
        if (v === undefined) {
          throw new LogoErr(`Zmienna „${it.name}” nie ma jeszcze wartości. Nadaj ją wcześniej poleceniem „niech ${it.name} ...”.`, pos, "run");
        }
        st.push(v);
        break;
      }
      case "o": {
        if (it.o === "neg") {
          st.push(-st.pop()!);
          break;
        }
        const b = st.pop()!;
        const a = st.pop()!;
        let r: number;
        if (it.o === "+") r = a + b;
        else if (it.o === "-") r = a - b;
        else if (it.o === "*") r = a * b;
        else {
          if (b === 0) throw new LogoErr("Dzielenie przez zero. Sprawdź, czy dzielnik nie jest równy 0.", pos, "run");
          r = a / b;
        }
        st.push(r);
        break;
      }
    }
  }
  const r = st[0];
  if (!Number.isFinite(r)) throw new LogoErr("Wynik wyrażenia nie jest liczbą skończoną (jest zbyt duży).", pos, "run");
  return r === 0 ? 0 : r;
}

export function parse(source: string, mode: Mode): Program {
  return new Parser(source, mode).parse();
}

// ---------------------------------------------------------------- maszyna

export interface TurtleState {
  pos: Vec3;
  h: Vec3;
  r: Vec3;
  u: Vec3;
  pen: boolean;
  color: string;
  width: number;
}

export interface StepEvent {
  line: number;
  column: number;
  /** rodzaj wykonanej operacji: przydaje się animacji */
  kind: Stmt["k"];
}

function sincos(deg: number): [number, number] {
  let d = deg % 360;
  if (d < 0) d += 360;
  if (d === 0) return [0, 1];
  if (d === 90) return [1, 0];
  if (d === 180) return [0, -1];
  if (d === 270) return [-1, 0];
  const rad = (d * Math.PI) / 180;
  return [Math.sin(rad), Math.cos(rad)];
}

/** a' = a·cos + b·sin, b' = b·cos − a·sin */
function rotate(a: Vec3, b: Vec3, deg: number) {
  const [s, c] = sincos(deg);
  for (let i = 0; i < 3; i++) {
    const x = a[i];
    const y = b[i];
    a[i] = x * c + y * s + 0;
    b[i] = y * c - x * s + 0;
  }
}

export class Machine {
  program: Program;
  segments: Segment[] = [];
  turtle: TurtleState = {
    pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1],
    pen: true, color: DEFAULT_COLOR, width: DEFAULT_WIDTH,
  };
  ops = 0;
  frames = 0;
  maxFrames = 0;
  error: LogoErr | null = null;
  done = false;
  /** rośnie przy każdym „czyść”: widok wie, że musi narysować wszystko od nowa */
  clears = 0;
  private globals = new Map<string, number>();
  private gen: Generator<StepEvent, void>;

  constructor(program: Program) {
    this.program = program;
    this.gen = this.main();
  }

  /** Wykonuje jedną operację. Zwraca zdarzenie albo null, gdy program się skończył (lub przerwał go błąd). */
  step(): StepEvent | null {
    if (this.done) return null;
    try {
      const r = this.gen.next();
      if (r.done) {
        this.done = true;
        return null;
      }
      return r.value;
    } catch (e) {
      this.done = true;
      if (e instanceof LogoErr) {
        this.error = e;
        return null;
      }
      throw e;
    }
  }

  runAll(): void {
    while (this.step()) { /* dalej */ }
  }

  private tick(pos: Pos) {
    if (this.ops >= LIMITS.ops) {
      throw new LogoErr(`Program wykonał już ${LIMITS.ops} operacji i został zatrzymany. Zmniejsz liczbę powtórzeń albo sprawdź, czy rekurencja ma warunek „stop”.`, pos, "run");
    }
    this.ops++;
  }

  private enter(pos: Pos) {
    if (this.frames >= LIMITS.frames) {
      throw new LogoErr(`Zbyt głębokie zagnieżdżenie: limit to ${LIMITS.frames} aktywne wywołania procedur i powtórzenia. Sprawdź, czy rekurencja ma warunek „stop”.`, pos, "run");
    }
    this.frames++;
    if (this.frames > this.maxFrames) this.maxFrames = this.frames;
  }

  private ev(e: Expr, env: Env): number {
    if (e.constant !== undefined) return e.constant;
    return evalRpn(e.rpn, e.pos, { env, globals: this.globals });
  }

  private moveTo(target: Vec3, pos: Pos) {
    const t = this.turtle;
    for (let i = 0; i < 3; i++) {
      if (!Number.isFinite(target[i]) || Math.abs(target[i]) > LIMITS.coord) {
        throw new LogoErr("Żółw wyszedłby poza dozwolony obszar: każda współrzędna musi mieścić się w ±100000.", pos, "run");
      }
      if (target[i] === 0) target[i] = 0;
    }
    const moved = target[0] !== t.pos[0] || target[1] !== t.pos[1] || target[2] !== t.pos[2];
    if (moved && t.pen) {
      if (this.segments.length >= LIMITS.segments) {
        throw new LogoErr(`Rysunek ma już ${LIMITS.segments} odcinków, więcej się nie zmieści. Użyj „czyść” albo narysuj mniej.`, pos, "run");
      }
      this.segments.push({ from: [t.pos[0], t.pos[1], t.pos[2]], to: [target[0], target[1], target[2]], color: t.color, width: t.width });
    }
    t.pos = target;
  }

  private *main(): Generator<StepEvent, void> {
    yield* this.block(this.program.body, { locals: null, rc: [] });
  }

  /** Zwraca true, gdy wykonano „stop”. */
  private *block(stmts: Stmt[], env: Env): Generator<StepEvent, boolean> {
    for (let i = 0; i < stmts.length; i++) {
      const s = stmts[i];
      this.tick(s.pos);
      const event: StepEvent = { line: s.pos.line, column: s.pos.col, kind: s.k };
      const t = this.turtle;
      switch (s.k) {
        case "move": {
          const d = this.ev(s.e, env) * s.sign;
          this.moveTo([t.pos[0] + t.h[0] * d, t.pos[1] + t.h[1] * d, t.pos[2] + t.h[2] * d], s.pos);
          yield event;
          break;
        }
        case "turn": {
          const a = this.ev(s.e, env) * s.sign;
          if (s.axis === "yaw") rotate(t.h, t.r, a);
          else if (s.axis === "pitch") rotate(t.h, t.u, a);
          else rotate(t.u, t.r, a);
          yield event;
          break;
        }
        case "pen":
          t.pen = s.down;
          yield event;
          break;
        case "color":
          t.color = s.c;
          yield event;
          break;
        case "width": {
          const w = this.ev(s.e, env);
          checkWidth(w, s.e.pos, "run");
          t.width = w;
          yield event;
          break;
        }
        case "home":
          this.moveTo([0, 0, 0], s.pos);
          t.h = [0, 1, 0];
          t.r = [1, 0, 0];
          t.u = [0, 0, 1];
          yield event;
          break;
        case "cs":
          this.segments.length = 0;
          this.clears++;
          yield event;
          break;
        case "let": {
          const v = this.ev(s.e, env);
          if (env.locals) env.locals.set(s.name, v);
          else this.globals.set(s.name, v);
          yield event;
          break;
        }
        case "stop":
          yield event;
          return true;
        case "repeat": {
          const n = this.ev(s.e, env);
          checkRepeat(n, s.e.pos, "run");
          this.enter(s.pos);
          yield event;
          env.rc.push(0);
          for (let k = 1; k <= n; k++) {
            env.rc[env.rc.length - 1] = k;
            if (yield* this.block(s.body, env)) {
              env.rc.pop();
              this.frames--;
              return true;
            }
            this.tick(s.close);
          }
          env.rc.pop();
          this.frames--;
          break;
        }
        case "if": {
          const l = evalRpnExpr(this, s.cond.l, s.cond.pos, env);
          const r = evalRpnExpr(this, s.cond.r, s.cond.pos, env);
          const o = s.cond.op;
          const ok = o === "<" ? l < r : o === ">" ? l > r : o === "=" ? l === r : o === "<=" ? l <= r : o === ">=" ? l >= r : l !== r;
          yield event;
          const body = ok ? s.a : s.b;
          if (body) {
            if (yield* this.block(body, env)) return true;
            this.tick(ok ? s.closeA : s.closeB);
          }
          break;
        }
        case "call": {
          const proc = this.program.procs.get(s.name)!;
          const locals = new Map<string, number>();
          for (let k = 0; k < proc.params.length; k++) locals.set(proc.params[k], this.ev(s.args[k], env));
          this.enter(s.pos);
          yield event;
          yield* this.block(proc.body, { locals, rc: [] });
          this.frames--;
          this.tick(proc.end);
          break;
        }
      }
    }
    return false;
  }

  /** dostęp dla warunków: błąd wskazuje początek całego warunku */
  _eval(e: Expr, pos: Pos, env: Env): number {
    if (e.constant !== undefined) return e.constant;
    return evalRpn(e.rpn, pos, { env, globals: this.globals });
  }
}

function evalRpnExpr(m: Machine, e: Expr, pos: Pos, env: Env): number {
  return m._eval(e, pos, env);
}

// ---------------------------------------------------------------- API

export function toError(e: LogoErr): LogoError {
  return { message: e.message, line: e.line, column: e.column };
}

export function copySegments(segs: Segment[]): Segment[] {
  return segs.map((s) => ({ from: [s.from[0], s.from[1], s.from[2]], to: [s.to[0], s.to[1], s.to[2]], color: s.color, width: s.width }));
}

export function run(source: string, mode: Mode): RunResult {
  if (mode !== "2d" && mode !== "3d") {
    return { segments: [], error: { message: "Nieznany tryb. Dozwolone tryby to „2d” i „3d”.", line: 1, column: 1 } };
  }
  let program: Program;
  try {
    program = parse(String(source ?? ""), mode);
  } catch (e) {
    if (e instanceof LogoErr) return { segments: [], error: toError(e) };
    throw e;
  }
  const m = new Machine(program);
  m.runAll();
  return { segments: copySegments(m.segments), error: m.error ? toError(m.error) : null };
}
