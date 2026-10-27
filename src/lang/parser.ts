import { LogoError, plural, fmtInt } from "./errors";
import { lex, type Token } from "./lexer";
import {
  END_WORDS,
  LIMITS,
  PARAMS_WORD,
  PRIMITIVES,
  REPEAT_WORDS,
  RESERVED,
  TO_WORDS,
  norm,
  type PrimInfo,
} from "./names";

export type Mode = "2d" | "3d";

export type Arg =
  | { kind: "num"; value: number; tok: Token }
  | { kind: "param"; index: number; name: string; tok: Token };

export type Stmt =
  | { kind: "prim"; info: PrimInfo; tok: Token; arg?: Arg; color?: string }
  | { kind: "repeat"; tok: Token; count: Arg; body: Stmt[] }
  | { kind: "call"; tok: Token; proc: Proc; args: Arg[] };

export interface Proc {
  name: string;
  key: string;
  params: string[];
  paramKeys: Map<string, number>;
  nameTok: Token;
  body: Stmt[];
  /** Body tokens without newlines, parsed after all headers are known. */
  bodyTokens: Token[];
  endTok: Token;
}

export interface Program {
  mode: Mode;
  main: Stmt[];
  procs: Map<string, Proc>;
}

const COLOR_RE = /^"#[0-9a-fA-F]{6}"$/;
const NAME_RE = /^[\p{L}_][^:"]*$/u;
const NUMBER_RE = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;

function q(text: string): string {
  const t = text.length > 30 ? text.slice(0, 30) + "…" : text;
  return `„${t}”`;
}

function fail(message: string, tok: Token): never {
  throw new LogoError(message, tok);
}

/** Parse and validate a whole program. Throws LogoError on the first problem. */
export function parse(source: string, mode: Mode): Program {
  const { tokens } = lex(source);
  const procs = new Map<string, Proc>();
  const main = splitDefinitions(tokens, procs);

  // Procedure bodies and the main code are parsed separately; if several of
  // them are broken, report the problem that comes first in the source.
  let first: LogoError | null = null;
  const attempt = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      if (!first || e.line < first.line || (e.line === first.line && e.column < first.column)) first = e;
    }
  };
  for (const proc of procs.values()) {
    attempt(() => {
      proc.body = new StmtParser(proc.bodyTokens, procs, mode, proc).parseAll();
    });
  }
  const program: Program = { mode, main: [], procs };
  attempt(() => {
    program.main = new StmtParser(main, procs, mode, null).parseAll();
  });
  if (first) throw first;
  checkRecursion(procs);
  return program;
}

// ---------------------------------------------------------------------------
// Pass 1: carve procedure definitions out of the token stream.

function splitDefinitions(tokens: Token[], procs: Map<string, Proc>): Token[] {
  const main: Token[] = [];
  let depth = 0;
  let i = 0;
  const len = tokens.length;
  while (i < len) {
    const t = tokens[i]!;
    if (t.type === "newline") {
      i++;
      continue;
    }
    if (t.type === "word") {
      const k = norm(t.text);
      if (TO_WORDS.has(k)) {
        if (depth > 0) {
          fail(`Procedury definiuje się tylko na najwyższym poziomie programu, nie wewnątrz nawiasów powtórz.`, t);
        }
        if (!t.lineStart) {
          fail(`Definicja procedury (${q(t.text)}) musi zaczynać się na początku wiersza.`, t);
        }
        let j = i + 1;
        const header: Token[] = [];
        while (j < len && tokens[j]!.type !== "newline") header.push(tokens[j++]!);
        const proc = parseHeader(t, header, procs);

        let endTok: Token | null = null;
        let strayEnd: Token | null = null;
        while (j < len) {
          const u = tokens[j]!;
          if (u.type === "newline") {
            j++;
            continue;
          }
          if (u.type === "word") {
            const uk = norm(u.text);
            if (END_WORDS.has(uk)) {
              const next = tokens[j + 1];
              if (u.lineStart && (!next || next.type === "newline")) {
                endTok = u;
                j++;
                break;
              }
              strayEnd ??= u;
            } else if (TO_WORDS.has(uk)) {
              fail(
                `Nie można definiować procedury wewnątrz innej procedury. Czy brakuje „już” na końcu procedury ${q(proc.name)}?`,
                u,
              );
            }
          }
          proc.bodyTokens.push(u);
          j++;
        }
        if (!endTok) {
          if (strayEnd) {
            fail(`Słowo ${q(strayEnd.text)} kończące procedurę musi stać samo w osobnym wierszu.`, strayEnd);
          }
          fail(`Brak „już” kończącego procedurę ${q(proc.name)}. Dopisz „już” w osobnym wierszu po jej treści.`, t);
        }
        proc.endTok = endTok;
        procs.set(proc.key, proc);
        i = j;
        continue;
      }
      if (END_WORDS.has(k)) {
        fail(`${q(t.text)} bez pasującego „oto”: tym słowem kończy się definicję procedury.`, t);
      }
    } else if (t.type === "lbracket") {
      depth++;
    } else if (t.type === "rbracket") {
      depth = Math.max(0, depth - 1);
    }
    main.push(t);
    i++;
  }
  return main;
}

function validateName(text: string, tok: Token, what: "procedury" | "parametru"): void {
  const k = norm(text);
  if (text === "") fail(`Brak nazwy ${what}.`, tok);
  if (NUMBER_RE.test(text)) fail(`Nazwa ${what} nie może być liczbą (${q(text)}).`, tok);
  if (RESERVED.has(k)) fail(`${q(text)} to słowo języka Logo – nie może być nazwą ${what}.`, tok);
  if (!NAME_RE.test(text)) {
    fail(`Niepoprawna nazwa ${what} ${q(text)}: nazwa zaczyna się od litery i nie zawiera dwukropków ani cudzysłowów.`, tok);
  }
}

function subToken(tok: Token, skip: number): Token {
  return {
    ...tok,
    text: tok.text.slice(skip),
    column: tok.column + skip,
    offset: tok.offset + skip,
    length: tok.length - skip,
    lineStart: false,
  };
}

function parseHeader(otoTok: Token, toks: Token[], procs: Map<string, Proc>): Proc {
  const nameTok = toks[0];
  if (!nameTok) fail(`Po ${q(otoTok.text)} podaj nazwę procedury, np. „oto kwadrat ma: bok”.`, otoTok);
  if (nameTok.type !== "word" && nameTok.type !== "number") {
    fail(`Po ${q(otoTok.text)} oczekiwano nazwy procedury, a jest ${q(nameTok.text)}.`, nameTok);
  }
  validateName(nameTok.text, nameTok, "procedury");
  const key = norm(nameTok.text);
  const existing = procs.get(key);
  if (existing) {
    fail(
      `Procedura ${q(nameTok.text)} jest już zdefiniowana (wiersz ${existing.nameTok.line}). Każdą nazwę można zdefiniować tylko raz.`,
      nameTok,
    );
  }
  const proc: Proc = {
    name: nameTok.text,
    key,
    params: [],
    paramKeys: new Map(),
    nameTok,
    body: [],
    bodyTokens: [],
    endTok: otoTok,
  };

  const addParam = (tok: Token, text: string) => {
    validateName(text, tok, "parametru");
    const pk = norm(text);
    if (proc.paramKeys.has(pk)) fail(`Parametr ${q(text)} występuje dwa razy w nagłówku procedury.`, tok);
    proc.paramKeys.set(pk, proc.params.length);
    proc.params.push(text);
  };

  const rest = toks.slice(1);
  if (rest.length === 0) return proc;
  const first = rest[0]!;
  const fk = first.type === "word" ? norm(first.text) : "";

  if (fk.startsWith(PARAMS_WORD)) {
    const items: Token[] = [];
    if (fk.length > PARAMS_WORD.length) items.push(subToken(first, PARAMS_WORD.length));
    items.push(...rest.slice(1));
    if (items.length === 0) fail(`Po „ma:” podaj nazwy parametrów oddzielone przecinkami, np. „ma: bok, kąt”.`, first);
    let expectName = true;
    let last = first;
    for (const it of items) {
      last = it;
      if (expectName) {
        if (it.type === "comma") fail(`Brak nazwy parametru przed przecinkiem.`, it);
        if (it.type !== "word") fail(`Niepoprawna nazwa parametru ${q(it.text)}.`, it);
        const text = it.text.startsWith(":") ? it.text.slice(1) : it.text;
        addParam(it.text.startsWith(":") ? subToken(it, 1) : it, text);
        expectName = false;
      } else {
        if (it.type !== "comma") fail(`Parametry w nagłówku oddziel przecinkami, np. „ma: bok, kąt”.`, it);
        expectName = true;
      }
    }
    if (expectName) fail(`Po przecinku brakuje nazwy parametru.`, last);
    return proc;
  }

  if (first.type === "word" && first.text.startsWith(":")) {
    for (const it of rest) {
      if (it.type !== "word" || !it.text.startsWith(":") || it.text.length < 2) {
        fail(`W nagłówku oczekiwano parametru w postaci „:nazwa”, a jest ${q(it.text)}.`, it);
      }
      addParam(subToken(it, 1), it.text.slice(1));
    }
    return proc;
  }

  if (fk === "ma") fail(`Po „ma” brakuje dwukropka: napisz „ma: bok, kąt”.`, first);
  fail(
    `Nieoczekiwane ${q(first.text)} w nagłówku procedury. Parametry podaje się po „ma:”, a treść procedury zaczyna się w następnym wierszu.`,
    first,
  );
}

// ---------------------------------------------------------------------------
// Pass 2: statements.

class StmtParser {
  private i = 0;
  private depth = 0;

  constructor(
    private readonly toks: Token[],
    private readonly procs: Map<string, Proc>,
    private readonly mode: Mode,
    private readonly proc: Proc | null,
  ) {}

  parseAll(): Stmt[] {
    return this.block(null);
  }

  private peek(): Token | undefined {
    return this.toks[this.i];
  }

  /** Parse statements until EOF (open === null) or the matching "]". */
  private block(open: Token | null): Stmt[] {
    const out: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) {
        if (open) fail(`Nawias „[” nie został zamknięty. Brakuje „]”.`, open);
        return out;
      }
      if (t.type === "rbracket") {
        if (open) {
          this.i++;
          return out;
        }
        fail(`Nadmiarowy nawias „]” – nie pasuje do żadnego „[”.`, t);
      }
      out.push(this.statement(t, out[out.length - 1]));
    }
  }

  private isParamWord(t: Token): boolean {
    if (t.type !== "word") return false;
    const k = norm(t.text);
    if (k.startsWith(":")) return true;
    return !!this.proc && this.proc.paramKeys.has(k);
  }

  private statement(t: Token, prev: Stmt | undefined): Stmt {
    switch (t.type) {
      case "lbracket":
        fail(`Nieoczekiwany nawias „[”. Nawiasy kwadratowe otaczają treść polecenia „powtórz”.`, t);
      case "number":
        this.extraArgument(t, prev);
      case "string":
        if (COLOR_RE.test(t.text)) fail(`Kolor ${t.text} musi stać po poleceniu „kolor”.`, t);
        fail(`Nieoczekiwany tekst ${q(t.text)}. Tekst w cudzysłowie służy tylko do podawania koloru.`, t);
      case "comma":
        fail(`Nieoczekiwany przecinek. Przecinki oddzielają tylko parametry w nagłówku procedury; ułamki zapisuj z kropką, np. 1.5.`, t);
      case "newline":
      case "rbracket":
        fail(`Nieoczekiwany znak ${q(t.text)}.`, t);
      case "word":
        break;
    }
    const k = norm(t.text);
    this.i++;

    const prim = PRIMITIVES.get(k);
    if (prim) {
      if (prim.only3d && this.mode === "2d") {
        fail(`Polecenie ${q(t.text)} działa tylko w trybie 3D. Przełącz się na 3D, aby obracać żółwia w górę i w dół.`, t);
      }
      switch (prim.arg) {
        case "none":
          return { kind: "prim", info: prim, tok: t };
        case "number":
          return { kind: "prim", info: prim, tok: t, arg: this.numArg(t, `polecenia ${q(t.text)}`) };
        case "width": {
          const arg = this.numArg(t, `polecenia ${q(t.text)}`);
          if (arg.kind === "num") checkWidth(arg.value, arg.tok, "parse");
          return { kind: "prim", info: prim, tok: t, arg };
        }
        case "color": {
          const a = this.peek();
          if (!a || a.type === "rbracket" || a.type === "lbracket" || (a.type === "word" && this.isKeywordLike(a))) {
            fail(`Polecenie ${q(t.text)} wymaga koloru w postaci "#rrggbb", np. kolor "#16866a".`, t);
          }
          if (a.type !== "string" || !COLOR_RE.test(a.text)) {
            fail(
              `Niepoprawny kolor ${q(a.text)}. Kolor zapisuje się w cudzysłowie jako # i sześć cyfr szesnastkowych, np. "#16866a".`,
              a,
            );
          }
          this.i++;
          return { kind: "prim", info: prim, tok: t, color: a.text.slice(1, -1).toLowerCase() };
        }
      }
    }

    if (REPEAT_WORDS.has(k)) {
      const count = this.numArg(t, `polecenia ${q(t.text)}`);
      if (count.kind === "num") checkRepeat(count.value, count.tok, "parse");
      const open = this.peek();
      if (!open || open.type !== "lbracket") {
        fail(`Po liczbie powtórzeń oczekiwano nawiasu „[” z poleceniami do powtórzenia.`, open ?? count.tok);
      }
      this.i++;
      this.depth++;
      if (this.depth > LIMITS.depth) {
        fail(`Za głębokie zagnieżdżenie nawiasów: najwyżej ${LIMITS.depth} poziomy.`, open);
      }
      const body = this.block(open);
      this.depth--;
      return { kind: "repeat", tok: t, count, body };
    }

    const proc = this.procs.get(k);
    if (proc) {
      const args: Arg[] = [];
      for (let n = 0; n < proc.params.length; n++) {
        const a = this.peek();
        if (!a || this.isMissing(a)) {
          const need = proc.params.length;
          fail(
            `Procedura ${q(proc.name)} wymaga ${need} ${plural(need, "argumentu", "argumentów", "argumentów")}, a podano ${n}.`,
            t,
          );
        }
        args.push(this.numArg(t, `procedury ${q(proc.name)}`));
      }
      return { kind: "call", tok: t, proc, args };
    }

    if (TO_WORDS.has(k)) fail(`Procedury definiuje się tylko na najwyższym poziomie programu, nie wewnątrz innej procedury ani powtórz.`, t);
    if (END_WORDS.has(k)) fail(`Słowo ${q(t.text)} kończące procedurę musi stać samo w osobnym wierszu.`, t);
    if (this.isParamWord(t)) {
      if (this.proc && this.proc.paramKeys.has(k.replace(/^:/, ""))) {
        if (prev) this.extraArgument(t, prev);
        fail(`Parametr ${q(t.text)} to liczba, a nie polecenie. Użyj go jako argumentu, np. „np ${t.text}”.`, t);
      }
      fail(this.proc ? `Nieznany parametr ${q(t.text)}.` : `Parametrów (${q(t.text)}) można używać tylko wewnątrz procedury.`, t);
    }
    fail(unknownCommandMessage(t.text, this.procs), t);
  }

  /** A stray number/parameter after a complete statement. */
  private extraArgument(t: Token, prev: Stmt | undefined): never {
    if (prev?.kind === "call") {
      const need = prev.proc.params.length;
      fail(
        need === 0
          ? `Procedura ${q(prev.proc.name)} nie przyjmuje argumentów, a podano ${q(t.text)}.`
          : `Za dużo argumentów: procedura ${q(prev.proc.name)} przyjmuje ${need} ${plural(need, "argument", "argumenty", "argumentów")}.`,
        prev.tok,
      );
    }
    if (prev?.kind === "prim") {
      const name = prev.tok.text;
      fail(
        prev.info.arg === "none"
          ? `Polecenie ${q(name)} nie przyjmuje argumentów, a po nim stoi ${q(t.text)}.`
          : `Za dużo argumentów: polecenie ${q(name)} przyjmuje jeden argument.`,
        t,
      );
    }
    fail(`Nieoczekiwana liczba ${q(t.text)}. Liczba musi być argumentem polecenia, np. „np ${t.text}”.`, t);
  }

  private isKeywordLike(t: Token): boolean {
    const k = norm(t.text);
    return RESERVED.has(k) || this.procs.has(k);
  }

  /** The token cannot start an argument: the argument is missing rather than wrong. */
  private isMissing(t: Token): boolean {
    if (t.type === "rbracket" || t.type === "lbracket") return true;
    if (t.type !== "word") return false;
    if (this.isParamWord(t)) return false;
    return this.isKeywordLike(t);
  }

  private numArg(cmd: Token, who: string): Arg {
    const a = this.peek();
    if (!a || this.isMissing(a)) fail(`Brak argumentu ${who}: oczekiwano liczby.`, cmd);
    if (a.type === "number") {
      this.i++;
      return { kind: "num", value: a.value, tok: a };
    }
    if (a.type === "word") {
      const k = norm(a.text);
      const bare = k.startsWith(":") ? k.slice(1) : k;
      if (this.proc && this.proc.paramKeys.has(bare)) {
        this.i++;
        const index = this.proc.paramKeys.get(bare)!;
        return { kind: "param", index, name: this.proc.params[index]!, tok: a };
      }
      if (k.startsWith(":")) {
        fail(
          this.proc
            ? `Nieznany parametr ${q(a.text)}. Procedura ${q(this.proc.name)} ${
                this.proc.params.length ? `ma parametry: ${this.proc.params.join(", ")}` : "nie ma parametrów"
              }.`
            : `Parametrów (${q(a.text)}) można używać tylko wewnątrz procedury.`,
          a,
        );
      }
    }
    fail(`Argument ${who} musi być liczbą, a jest ${q(a.text)}.`, a);
  }
}

export function checkWidth(value: number, tok: Token, phase: "parse" | "run"): void {
  if (!Number.isInteger(value) || value < LIMITS.widthMin || value > LIMITS.widthMax) {
    throw new LogoError(
      `Grubość musi być liczbą całkowitą od ${LIMITS.widthMin} do ${LIMITS.widthMax}, a jest ${fmtNum(value)}.`,
      tok,
      phase,
    );
  }
}

export function checkRepeat(value: number, tok: Token, phase: "parse" | "run"): void {
  if (!Number.isInteger(value) || value < 0 || value > LIMITS.repeatMax) {
    throw new LogoError(
      `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${fmtInt(LIMITS.repeatMax)}, a jest ${fmtNum(value)}.`,
      tok,
      phase,
    );
  }
}

export function fmtNum(v: number): string {
  if (Object.is(v, -0)) return "0";
  return String(v).replace("e+", "e");
}

// ---------------------------------------------------------------------------
// Suggestions for unknown words.

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n]!;
}

function unknownCommandMessage(text: string, procs: Map<string, Proc>): string {
  const k = norm(text);
  const base = `Nieznane polecenie ${q(text)}.`;
  // "np10" → "np 10"
  const glued = /^(\p{L}+)([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/u.exec(k);
  if (glued && (PRIMITIVES.has(glued[1]!) || REPEAT_WORDS.has(glued[1]!))) {
    return `${base} Oddziel polecenie od liczby spacją: „${glued[1]} ${glued[2]}”.`;
  }
  const candidates = [...PRIMITIVES.keys(), ...REPEAT_WORDS, ...[...procs.values()].map((p) => p.key)];
  let best = "";
  let bestD = Infinity;
  for (const c of candidates) {
    const d = levenshtein(k, c);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  const limit = k.length <= 3 ? 1 : 2;
  if (bestD <= limit) {
    const proc = procs.get(best);
    return `${base} Czy chodziło o „${proc ? proc.name : best}”?`;
  }
  return `${base} Jeśli to procedura, zdefiniuj ją: „oto ${text} … już”.`;
}

// ---------------------------------------------------------------------------
// Recursion is forbidden, even if the recursive call would never run.

function collectCalls(stmts: Stmt[], out: Array<{ tok: Token; proc: Proc }>): void {
  for (const s of stmts) {
    if (s.kind === "call") out.push({ tok: s.tok, proc: s.proc });
    else if (s.kind === "repeat") collectCalls(s.body, out);
  }
}

function checkRecursion(procs: Map<string, Proc>): void {
  const edges = new Map<string, Array<{ tok: Token; proc: Proc }>>();
  const all: Array<{ from: Proc; tok: Token; proc: Proc }> = [];
  for (const p of procs.values()) {
    const calls: Array<{ tok: Token; proc: Proc }> = [];
    collectCalls(p.body, calls);
    edges.set(p.key, calls);
    for (const c of calls) all.push({ from: p, ...c });
  }
  all.sort((a, b) => a.tok.offset - b.tok.offset);

  /** Path of procedure names from `start` to `target`, or null. */
  const pathTo = (start: Proc, target: Proc): string[] | null => {
    const seen = new Set<string>();
    const stack: Array<{ p: Proc; path: string[] }> = [{ p: start, path: [start.name] }];
    while (stack.length) {
      const { p, path } = stack.pop()!;
      if (p.key === target.key) return path;
      if (seen.has(p.key)) continue;
      seen.add(p.key);
      for (const c of edges.get(p.key) ?? []) stack.push({ p: c.proc, path: [...path, c.proc.name] });
    }
    return null;
  };

  for (const e of all) {
    if (e.proc.key === e.from.key) {
      fail(`Procedura ${q(e.from.name)} wywołuje samą siebie. Rekurencja nie jest dozwolona – użyj „powtórz”.`, e.tok);
    }
    const path = pathTo(e.proc, e.from);
    if (path) {
      fail(
        `Rekurencja nie jest dozwolona: procedura ${q(e.from.name)} wywołuje samą siebie pośrednio (${[e.from.name, ...path].join(" → ")}).`,
        e.tok,
      );
    }
  }
}
