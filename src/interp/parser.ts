// Parser dialektu Logomocji: tokeny -> drzewo programu, z pełną walidacją.
import { lex, LogoError, type Tok } from "./lexer";

export type Mode = "2d" | "3d";

export type Expr =
  | { k: "num"; v: number }
  | { k: "var"; name: string }
  | { k: "rep" }
  | { k: "neg"; e: Expr }
  | { k: "bin"; op: string; l: Expr; r: Expr };

/** Argument: wyrażenie i token, od którego się zaczyna (miejsce zgłaszania błędów). */
export interface Arg { e: Expr; at: Tok }
export interface Cond { l: Expr; op: string; r: Expr; at: Tok }

export type Node =
  | { k: "move"; tok: Tok; sign: 1 | -1; arg: Arg }
  | { k: "turn"; tok: Tok; axis: "yaw" | "pitch" | "roll"; sign: 1 | -1; arg: Arg }
  | { k: "pen"; tok: Tok; down: boolean }
  | { k: "color"; tok: Tok; color: string }
  | { k: "width"; tok: Tok; arg: Arg }
  | { k: "repeat"; tok: Tok; arg: Arg; body: Node[] }
  | { k: "let"; tok: Tok; name: string; arg: Arg }
  | { k: "if"; tok: Tok; cond: Cond; then: Node[]; else: Node[] | null }
  | { k: "stop"; tok: Tok }
  | { k: "home"; tok: Tok }
  | { k: "clear"; tok: Tok }
  | { k: "call"; tok: Tok; proc: Proc; args: Arg[] };

export interface Proc { name: string; params: string[]; body: Node[] }
export interface Program { body: Node[]; procs: Map<string, Proc>; mode: Mode }

export const MAX_DEPTH = 32;

type CmdKind =
  | "fd" | "bk" | "rt" | "lt" | "pu" | "pd" | "color" | "width" | "repeat" | "let" | "if" | "ifelse"
  | "stop" | "home" | "cs" | "up" | "down" | "rr" | "rl";

const ALIASES: Record<CmdKind, string[]> = {
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
  up: ["gora", "góra", "pitchup"],
  down: ["dol", "dół", "pitchdown"],
  rr: ["pp", "przechylprawo", "rr", "rollright"],
  rl: ["pl", "przechyllewo", "rl", "rollleft"],
};

export const COMMANDS = new Map<string, CmdKind>();
for (const k of Object.keys(ALIASES) as CmdKind[]) for (const a of ALIASES[k]) COMMANDS.set(a, k);
export const DEF_WORDS = new Set(["oto", "to"]);
export const END_WORDS = new Set(["już", "juz", "end"]);
export const REP_WORDS = new Set(["nrpowt", "repcount"]);
export const THREE_D = new Set<CmdKind>(["up", "down", "rr", "rl"]);

export function isReserved(name: string): boolean {
  return COMMANDS.has(name) || DEF_WORDS.has(name) || END_WORDS.has(name) || REP_WORDS.has(name);
}

const COLOR = /^#[0-9a-fA-F]{6}$/;

function isLiteral(e: Expr): boolean {
  switch (e.k) {
    case "num": return true;
    case "neg": return isLiteral(e.e);
    case "bin": return isLiteral(e.l) && isLiteral(e.r);
    default: return false;
  }
}

/** Wartość wyrażenia stałego albo null, gdy nie da się jej policzyć (np. dzielenie przez zero). */
function constValue(e: Expr): number | null {
  switch (e.k) {
    case "num": return e.v;
    case "neg": { const v = constValue(e.e); return v === null ? null : -v; }
    case "bin": {
      const l = constValue(e.l), r = constValue(e.r);
      if (l === null || r === null) return null;
      if (e.op === "/" && r === 0) return null;
      const v = e.op === "+" ? l + r : e.op === "-" ? l - r : e.op === "*" ? l * r : l / r;
      return Number.isFinite(v) ? v : null;
    }
    default: return null;
  }
}

export function widthProblem(v: number): string | null {
  if (!Number.isInteger(v) || v < 1 || v > 12) return `Grubość musi być liczbą całkowitą od 1 do 12, a jest ${fmt(v)}.`;
  return null;
}
export function repeatProblem(v: number): string | null {
  if (!Number.isInteger(v) || v < 0 || v > 10000)
    return `Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000, a jest ${fmt(v)}.`;
  return null;
}
export function fmt(v: number): string {
  return String(Math.round(v * 1e6) / 1e6);
}

interface Scope { name: string; params: Set<string>; locals: Set<string> }

export function parse(source: string, mode: Mode): Program {
  const toks = lex(source);
  let p = 0;

  // --- przebieg wstępny: nazwy procedur, ich arność i zmienne (łagodny, bez błędów) ---
  const arity = new Map<string, number>();
  const globals = new Set<string>();
  const procLocals = new Map<Tok, Set<string>>();
  {
    let cur: Set<string> | null = null;
    for (let i = 0; i < toks.length; i++) {
      const tk = toks[i];
      if (tk.t !== "word") continue;
      if (DEF_WORDS.has(tk.name) && tk.first) {
        cur = new Set();
        procLocals.set(tk, cur);
        const nameTok = toks[i + 1];
        if (nameTok && nameTok.t === "word" && nameTok.line === tk.line) {
          let cnt = 0;
          let j = i + 2;
          for (; j < toks.length && toks[j].line === tk.line && toks[j].t !== "eof" && toks[j].t !== "err"; j++) {
            if (toks[j].t === "word" || toks[j].t === "var") cnt++;
          }
          if (!arity.has(nameTok.name) && !isReserved(nameTok.name)) arity.set(nameTok.name, cnt);
          i = j - 1;
        }
      } else if (END_WORDS.has(tk.name)) {
        cur = null;
      } else if (COMMANDS.get(tk.name) === "let") {
        const nx = toks[i + 1];
        if (nx && (nx.t === "word" || nx.t === "var")) (cur ?? globals).add(nx.name);
      }
    }
  }

  const procs = new Map<string, Proc>();
  for (const [name] of arity) procs.set(name, { name, params: [], body: [] });
  const defined = new Set<string>();

  let scope: Scope | null = null;
  let repeatDepth = 0;
  const brackets: Tok[] = [];

  const err = (msg: string, tk: Tok): never => { throw new LogoError(msg, tk); };
  const peek = (): Tok => {
    const tk = toks[p];
    if (tk.t === "err") throw new LogoError(tk.s, tk);
    return tk;
  };
  const show = (tk: Tok): string => `„${tk.s}”`;

  const OP_SPACING =
    "Operator musi mieć odstępy po obu stronach albo po żadnej (np. 10 - 5 lub 10-5).";

  /** Błąd „brak argumentu”: przy znalezionym tokenie albo przy poleceniu, gdy program się kończy. */
  function missing(cmd: Tok, what: string): never {
    const tk = peek();
    if (tk.t === "eof") return err(`Polecenie ${show(cmd)} wymaga: ${what}, a program się tu kończy.`, cmd);
    if (tk.t === "op") return err(`Polecenie ${show(cmd)} wymaga: ${what}, a tu jest ${show(tk)}. ${OP_SPACING}`, tk);
    return err(`Polecenie ${show(cmd)} wymaga: ${what}, a tu jest ${show(tk)}.`, tk);
  }

  function parsePrimary(cmd: Tok, what: string): Expr {
    const tk = peek();
    if (tk.t === "num") { p++; return { k: "num", v: tk.v }; }
    if (tk.t === "op" && (tk.s === "-" || tk.s === "+")) {
      p++;
      const e = parsePrimary(cmd, what);
      return tk.s === "-" ? { k: "neg", e } : e;
    }
    if (tk.t === "(") {
      p++;
      const e = parseExpr(cmd, "wyrażenie w nawiasie");
      const cl = peek();
      if (cl.t !== ")") {
        if (cl.t === "eof") err("Brakuje nawiasu zamykającego „)”.", tk);
        if (cl.t === "op") err(`Oczekiwano „)”, a tu jest ${show(cl)}. ${OP_SPACING}`, cl);
        err(`Oczekiwano „)”, a tu jest ${show(cl)}.`, cl);
      }
      p++;
      return e;
    }
    if (tk.t === "word" || tk.t === "var") {
      const name = tk.name;
      if (tk.t === "word") {
        if (REP_WORDS.has(name)) {
          if (repeatDepth === 0)
            err(`${show(tk)} działa tylko wewnątrz nawiasów polecenia powtórz.`, tk);
          p++;
          return { k: "rep" };
        }
        if (isReserved(name)) missing(cmd, what);
      }
      if ((scope && (scope.params.has(name) || scope.locals.has(name))) || globals.has(name)) {
        p++;
        return { k: "var", name };
      }
      if (tk.t === "word" && arity.has(name))
        err(`${show(tk)} to procedura, a nie wartość — procedury niczego nie zwracają.`, tk);
      err(`Nieznana nazwa ${show(tk)}: to nie parametr ani zmienna nadana przez „niech”.`, tk);
    }
    return missing(cmd, what);
  }

  function parseExpr(cmd: Tok, what: string): Expr {
    const operands: Expr[] = [parsePrimary(cmd, what)];
    const ops: string[] = [];
    for (;;) {
      const tk = peek();
      if (tk.t !== "op") break;
      if (tk.sb !== tk.sa) {
        if (tk.sb) break; // odstęp tylko z lewej: to już nie jest część wyrażenia
        err(OP_SPACING, tk);
      }
      p++;
      ops.push(tk.s);
      operands.push(parsePrimary(cmd, `liczba po operatorze „${tk.s}”`));
    }
    // składanie z priorytetami, lewostronnie
    const terms: Expr[] = [operands[0]];
    const addOps: string[] = [];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === "*" || ops[i] === "/") {
        terms[terms.length - 1] = { k: "bin", op: ops[i], l: terms[terms.length - 1], r: operands[i + 1] };
      } else {
        addOps.push(ops[i]);
        terms.push(operands[i + 1]);
      }
    }
    let e = terms[0];
    for (let i = 0; i < addOps.length; i++) e = { k: "bin", op: addOps[i], l: e, r: terms[i + 1] };
    return e;
  }

  function parseArg(cmd: Tok, what: string): Arg {
    const at = peek();
    return { e: parseExpr(cmd, what), at };
  }

  function parseCond(cmd: Tok): Cond {
    const at = peek();
    const l = parseExpr(cmd, "warunek, np. x > 0");
    const c = peek();
    if (c.t !== "cmp") {
      if (c.t === "eof") err(`W warunku polecenia ${show(cmd)} brakuje porównania (<, >, =, <=, >=, <>).`, cmd);
      err(`W warunku brakuje porównania (<, >, =, <=, >=, <>), a tu jest ${show(c)}.${c.t === "op" ? " " + OP_SPACING : ""}`, c);
    }
    p++;
    const r = parseExpr(cmd, "wartość po porównaniu");
    return { l, op: c.s, r, at };
  }

  function parseBody(cmd: Tok, isRepeat: boolean, what: string): Node[] {
    const open = peek();
    if (open.t !== "[") missing(cmd, what);
    if (brackets.length >= MAX_DEPTH)
      err(`Za głębokie zagnieżdżenie nawiasów kwadratowych: limit to ${MAX_DEPTH} poziomy.`, open);
    p++;
    brackets.push(open);
    if (isRepeat) repeatDepth++;
    const body = parseStatements();
    if (isRepeat) repeatDepth--;
    brackets.pop();
    p++; // „]” sprawdzone w parseStatements
    return body;
  }

  function parseCommand(cmd: Tok, kind: CmdKind): Node {
    p++;
    if (THREE_D.has(kind) && mode !== "3d")
      err(`Polecenie ${show(cmd)} działa tylko w trybie 3D. Przełącz tryb na 3D.`, cmd);
    switch (kind) {
      case "fd": return { k: "move", tok: cmd, sign: 1, arg: parseArg(cmd, "odległość") };
      case "bk": return { k: "move", tok: cmd, sign: -1, arg: parseArg(cmd, "odległość") };
      case "rt": return { k: "turn", tok: cmd, axis: "yaw", sign: 1, arg: parseArg(cmd, "kąt w stopniach") };
      case "lt": return { k: "turn", tok: cmd, axis: "yaw", sign: -1, arg: parseArg(cmd, "kąt w stopniach") };
      case "up": return { k: "turn", tok: cmd, axis: "pitch", sign: 1, arg: parseArg(cmd, "kąt w stopniach") };
      case "down": return { k: "turn", tok: cmd, axis: "pitch", sign: -1, arg: parseArg(cmd, "kąt w stopniach") };
      case "rr": return { k: "turn", tok: cmd, axis: "roll", sign: 1, arg: parseArg(cmd, "kąt w stopniach") };
      case "rl": return { k: "turn", tok: cmd, axis: "roll", sign: -1, arg: parseArg(cmd, "kąt w stopniach") };
      case "pu": return { k: "pen", tok: cmd, down: false };
      case "pd": return { k: "pen", tok: cmd, down: true };
      case "stop": return { k: "stop", tok: cmd };
      case "home": return { k: "home", tok: cmd };
      case "cs": return { k: "clear", tok: cmd };
      case "color": {
        const tk = peek();
        if (tk.t !== "str") missing(cmd, 'kolor w cudzysłowie, np. "#16866a"');
        if (!COLOR.test(tk.name))
          err(`Nieprawidłowy kolor ${tk.s}. Kolor to znak # i sześć cyfr szesnastkowych, np. "#16866a".`, tk);
        p++;
        return { k: "color", tok: cmd, color: tk.name.toLowerCase() };
      }
      case "width": {
        const arg = parseArg(cmd, "grubość od 1 do 12");
        if (isLiteral(arg.e)) {
          const v = constValue(arg.e);
          const prob = v === null ? null : widthProblem(v);
          if (prob) err(prob, arg.at);
        }
        return { k: "width", tok: cmd, arg };
      }
      case "repeat": {
        const arg = parseArg(cmd, "liczba powtórzeń");
        if (isLiteral(arg.e)) {
          const v = constValue(arg.e);
          const prob = v === null ? null : repeatProblem(v);
          if (prob) err(prob, arg.at);
        }
        const body = parseBody(cmd, true, "polecenia w nawiasach [ ]");
        return { k: "repeat", tok: cmd, arg, body };
      }
      case "let": {
        const nt = peek();
        if (nt.t !== "word" && nt.t !== "var") missing(cmd, "nazwa zmiennej");
        if (nt.t === "word" && isReserved(nt.name))
          err(`${show(nt)} to słowo języka — nie może być nazwą zmiennej.`, nt);
        if (arity.has(nt.name))
          err(`${show(nt)} to nazwa procedury — nie może być nazwą zmiennej.`, nt);
        p++;
        const arg = parseArg(cmd, "wartość zmiennej");
        return { k: "let", tok: cmd, name: nt.name, arg };
      }
      case "if": {
        const cond = parseCond(cmd);
        const then = parseBody(cmd, false, "polecenia w nawiasach [ ]");
        return { k: "if", tok: cmd, cond, then, else: null };
      }
      case "ifelse": {
        const cond = parseCond(cmd);
        const then = parseBody(cmd, false, "polecenia w nawiasach [ ]");
        const els = parseBody(cmd, false, "drugi blok w nawiasach [ ] (na wypadek, gdy warunek nie zachodzi)");
        return { k: "if", tok: cmd, cond, then, else: els };
      }
    }
  }

  function parseCall(cmd: Tok): Node {
    p++;
    const proc = procs.get(cmd.name)!;
    const n = arity.get(cmd.name)!;
    const args: Arg[] = [];
    for (let i = 0; i < n; i++) {
      args.push(parseArg(cmd, `${n} ${n === 1 ? "argument" : n < 5 ? "argumenty" : "argumentów"} (podano ${i})`));
    }
    return { k: "call", tok: cmd, proc, args };
  }

  function parseDef(oto: Tok): void {
    p++;
    const nameTok = toks[p];
    if (nameTok.t === "err") peek();
    if (nameTok.t === "eof" || nameTok.line !== oto.line)
      err(`Po ${show(oto)} w tym samym wierszu musi stać nazwa procedury.`, oto);
    if (nameTok.t !== "word") err(`Nazwa procedury musi być słowem, a tu jest ${show(nameTok)}.`, nameTok);
    if (isReserved(nameTok.name)) err(`${show(nameTok)} to słowo języka — nie może być nazwą procedury.`, nameTok);
    if (defined.has(nameTok.name)) err(`Procedura ${show(nameTok)} jest już zdefiniowana.`, nameTok);
    p++;
    const params: string[] = [];
    const addParam = (tk: Tok) => {
      if (tk.t === "word" && isReserved(tk.name)) err(`${show(tk)} to słowo języka — nie może być nazwą parametru.`, tk);
      if (params.includes(tk.name)) err(`Parametr ${show(tk)} powtarza się w nagłówku.`, tk);
      params.push(tk.name);
    };
    const onLine = () => {
      const tk = toks[p];
      if (tk.t === "err" && tk.line === oto.line) peek();
      return tk.t !== "eof" && tk.t !== "err" && tk.line === oto.line;
    };
    if (onLine()) {
      if (toks[p].t === "ma") {
        const ma = toks[p];
        p++;
        for (;;) {
          if (!onLine()) err(`Po „ma:” podaj nazwy parametrów oddzielone przecinkami.`, params.length ? toks[p - 1] : ma);
          const tk = toks[p];
          if (tk.t !== "word" && tk.t !== "var") err(`Oczekiwano nazwy parametru, a tu jest ${show(tk)}.`, tk);
          addParam(tk);
          p++;
          if (!onLine()) break;
          if (toks[p].t !== ",") err(`Parametry oddziela się przecinkami, a tu jest ${show(toks[p])}.`, toks[p]);
          p++;
        }
      } else {
        while (onLine()) {
          const tk = toks[p];
          if (tk.t !== "var")
            err(`W nagłówku procedury oczekiwano „ma:” i listy parametrów (albo parametrów w formie :nazwa), a tu jest ${show(tk)}. Treść procedury zacznij od nowego wiersza.`, tk);
          addParam(tk);
          p++;
        }
      }
    }
    defined.add(nameTok.name);
    const proc = procs.get(nameTok.name)!;
    proc.params = params;
    scope = { name: nameTok.name, params: new Set(params), locals: procLocals.get(oto) ?? new Set() };
    const savedRep = repeatDepth;
    repeatDepth = 0;
    defTok = oto;
    proc.body = parseStatements();
    // parseStatements zatrzymało się na „już”
    p++;
    repeatDepth = savedRep;
    scope = null;
    defTok = null;
  }

  let defTok: Tok | null = null;

  function parseStatements(): Node[] {
    const out: Node[] = [];
    const base = brackets.length;
    const inBody = base > 0 && (defTok === null || brackets[base - 1].off > defTok.off);
    for (;;) {
      const tk = peek();
      if (tk.t === "eof") {
        if (inBody) err("Brakuje nawiasu zamykającego „]”.", brackets[base - 1]);
        if (defTok) err(`Procedura nie ma zakończenia: brakuje „już” w osobnym wierszu.`, defTok);
        return out;
      }
      if (tk.t === "]") {
        if (inBody) return out;
        err("Nawias „]” bez pasującego „[”.", tk);
      }
      if (tk.t !== "word") {
        if (tk.t === "op") err(`Nieoczekiwane ${show(tk)} w miejscu polecenia. ${OP_SPACING}`, tk);
        if (tk.t === ")") err("Nawias „)” bez pasującego „(”.", tk);
        err(`Oczekiwano polecenia, a tu jest ${show(tk)}.`, tk);
      }
      const name = tk.name;
      if (DEF_WORDS.has(name)) {
        if (inBody) err("Procedury nie można definiować wewnątrz nawiasów [ ].", tk);
        if (defTok) err("Procedury nie można definiować wewnątrz innej procedury (może brakuje „już”?).", tk);
        if (!tk.first) err(`${show(tk)} musi stać na początku wiersza.`, tk);
        parseDef(tk);
        continue;
      }
      if (END_WORDS.has(name)) {
        if (inBody) err("Brakuje nawiasu zamykającego „]”.", brackets[base - 1]);
        if (!defTok) err(`${show(tk)} bez wcześniejszego „oto”.`, tk);
        if (!tk.first || !tk.last) err(`${show(tk)} musi stać samo w osobnym wierszu.`, tk);
        return out;
      }
      const kind = COMMANDS.get(name);
      if (kind) { out.push(parseCommand(tk, kind)); continue; }
      if (arity.has(name)) { out.push(parseCall(tk)); continue; }
      if (REP_WORDS.has(name)) err(`${show(tk)} to wartość, a nie polecenie.`, tk);
      if ((scope && (scope.params.has(name) || scope.locals.has(name))) || globals.has(name))
        err(`${show(tk)} to zmienna, a nie polecenie.`, tk);
      err(`Nieznane polecenie ${show(tk)}.`, tk);
    }
  }

  const body = parseStatements();
  return { body, procs, mode };
}
