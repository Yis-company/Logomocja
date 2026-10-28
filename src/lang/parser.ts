import { LIMITS, LogoErr, type Mode } from './types';
import { COMMANDS, DEF_WORDS, END_WORDS, REP_WORDS, THREE_D_ONLY, isReserved, type Cmd } from './keywords';
import { lex, type Token } from './lexer';

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'var'; name: string }
  | { k: 'rep' }
  | { k: 'neg'; a: Expr }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; a: Expr; b: Expr };

/** An expression together with its first token (used for error positions). */
export interface Arg {
  e: Expr;
  tok: Token;
}

export type CmpOp = '<' | '>' | '=' | '<=' | '>=' | '<>';

export type Stmt =
  | { k: 'cmd'; cmd: Cmd; tok: Token; arg?: Arg; colorHex?: string }
  | { k: 'repeat'; tok: Token; count: Arg; body: Stmt[] }
  | { k: 'let'; tok: Token; name: string; value: Arg }
  | { k: 'if'; tok: Token; cond: Cond; then: Stmt[]; else?: Stmt[] }
  | { k: 'call'; tok: Token; proc: string; args: Arg[] };

export interface Cond {
  left: Expr;
  op: CmpOp;
  right: Expr;
  tok: Token;
}

export interface Proc {
  name: string;
  params: string[];
  body: Stmt[];
  tok: Token;
}

export interface Program {
  main: Stmt[];
  procs: Map<string, Proc>;
}

interface Scope {
  proc: Proc | null;
  params: Set<string>;
  locals: Set<string>;
  repDepth: number;
}

interface ProcSig {
  name: string;
  params: string[];
  tok: Token;
  nameTok: Token;
}

const q = (s: string) => `„${s}”`;
const plArg = (n: number) => (n === 0 ? 'zero argumentów' : n === 1 ? '1 argument' : n < 5 ? `${n} argumenty` : `${n} argumentów`);
const COLOR_RE = /^"#[0-9a-fA-F]{6}"$/;

export const WIDTH_MSG = `Grubość musi być liczbą całkowitą od ${LIMITS.widthMin} do ${LIMITS.widthMax}.`;
export const REPEAT_MSG = `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${LIMITS.repeatMax}.`;

/** Evaluates an expression made only of literals. Returns undefined when it has names. */
function constValue(e: Expr): number | undefined | 'err' {
  switch (e.k) {
    case 'num': return e.v;
    case 'var': case 'rep': return undefined;
    case 'neg': {
      const v = constValue(e.a);
      return v === undefined || v === 'err' ? v : -v;
    }
    case 'bin': {
      const a = constValue(e.a);
      if (a === 'err') return 'err';
      const b = constValue(e.b);
      if (b === 'err') return 'err';
      if (a === undefined || b === undefined) return undefined;
      let r: number;
      if (e.op === '+') r = a + b;
      else if (e.op === '-') r = a - b;
      else if (e.op === '*') r = a * b;
      else { if (b === 0) return 'err'; r = a / b; }
      return Number.isFinite(r) ? r : 'err';
    }
  }
}

export function parse(source: string, mode: Mode): Program {
  return new Parser(source, mode).parseProgram();
}

class Parser {
  toks: Token[];
  pos = 0;
  sigs = new Map<string, ProcSig>();
  globalVars = new Set<string>();
  procVars = new Map<string, Set<string>>();
  defined = new Set<string>();
  procs = new Map<string, Proc>();
  depth = 0;
  parenDepth = 0;
  lastCallEnd = -1;
  lastCall: ProcSig | null = null;

  constructor(
    source: string,
    private mode: Mode,
  ) {
    this.toks = lex(source);
  }

  err(msg: string, t: Token): never {
    throw new LogoErr(msg, t.line, t.col);
  }

  peek(): Token | undefined {
    return this.toks[this.pos];
  }

  next(): Token {
    return this.toks[this.pos++];
  }

  // ---------- prescan: procedure signatures and declared variables ----------

  prescan(): void {
    let cur: string | null = null;
    for (let i = 0; i < this.toks.length; i++) {
      const t = this.toks[i];
      if (t.kind !== 'word' || t.colonName) continue;
      if (t.first && DEF_WORDS.has(t.name)) {
        try {
          const save = this.pos;
          this.pos = i;
          const sig = this.parseHeader();
          this.pos = save;
          if (!this.sigs.has(sig.name)) this.sigs.set(sig.name, sig);
          cur = sig.name;
          if (!this.procVars.has(cur)) this.procVars.set(cur, new Set());
        } catch {
          cur = null;
        }
        continue;
      }
      if (t.first && END_WORDS.has(t.name)) {
        cur = null;
        continue;
      }
      if (COMMANDS.get(t.name) === 'let') {
        const nt = this.toks[i + 1];
        if (nt && nt.kind === 'word') {
          (cur !== null ? this.procVars.get(cur)! : this.globalVars).add(nt.name);
        }
      }
    }
  }

  /** Parses "oto name [ma: a, b | :a :b]" starting at `oto`. Leaves pos after the header. */
  parseHeader(): ProcSig {
    const oto = this.next();
    const nameTok = this.peek();
    if (!nameTok || nameTok.line !== oto.line) this.err('Po „oto” brakuje nazwy procedury.', nameTok && nameTok.line === oto.line ? nameTok : oto);
    if (nameTok.kind === 'bad') this.err(nameTok.msg, nameTok);
    if (nameTok.kind !== 'word' || nameTok.colonName) this.err(`Oczekiwano nazwy procedury, a jest „${nameTok.text}”.`, nameTok);
    if (isReserved(nameTok.name)) this.err(`„${nameTok.text}” jest słowem zarezerwowanym i nie może być nazwą procedury.`, nameTok);
    this.next();
    const params: string[] = [];
    const addParam = (t: Token) => {
      if (isReserved(t.name)) this.err(`„${t.text}” jest słowem zarezerwowanym i nie może być parametrem.`, t);
      if (params.includes(t.name)) this.err(`Parametr ${q(t.text)} występuje w nagłówku więcej niż raz.`, t);
      params.push(t.name);
    };
    const sameLine = () => {
      const t = this.peek();
      return t && t.line === oto.line ? t : undefined;
    };
    let t = sameLine();
    if (t && t.kind === 'word' && !t.colonName && t.name === 'ma') {
      this.next();
      const colon = sameLine();
      if (!colon || colon.kind !== 'colon') this.err('Po „ma” oczekiwano dwukropka.', colon ?? t);
      this.next();
      for (;;) {
        const p = sameLine();
        if (!p) this.err('Oczekiwano nazwy parametru.', this.peek() ?? t);
        if (p.kind === 'bad') this.err(p.msg, p);
        if (p.kind !== 'word') this.err(`Oczekiwano nazwy parametru, a jest ${q(p.text)}.`, p);
        this.next();
        addParam(p);
        const sep = sameLine();
        if (sep && sep.kind === 'comma') {
          this.next();
          continue;
        }
        break;
      }
    } else {
      while ((t = sameLine()) && t.kind === 'word' && t.colonName) {
        this.next();
        addParam(t);
      }
    }
    const extra = sameLine();
    if (extra) this.err(`Po nagłówku procedury oczekiwano końca wiersza, a jest ${q(extra.text)}.`, extra);
    return { name: nameTok.name, params, tok: oto, nameTok };
  }

  // ---------- program ----------

  parseProgram(): Program {
    this.prescan();
    const main: Stmt[] = [];
    const scope: Scope = { proc: null, params: new Set(), locals: this.globalVars, repDepth: 0 };
    while (this.pos < this.toks.length) {
      const t = this.peek()!;
      if (t.kind === 'bad') this.err(t.msg, t);
      if (t.kind === 'word' && !t.colonName && DEF_WORDS.has(t.name)) {
        if (!t.first) this.err('Definicja procedury musi zaczynać się na początku wiersza.', t);
        this.parseProc();
        continue;
      }
      main.push(this.parseStmt(scope));
    }
    return { main, procs: this.procs };
  }

  parseProc(): void {
    const sig = this.parseHeader();
    if (this.defined.has(sig.name)) {
      this.err(`Procedura ${q(sig.name)} jest już zdefiniowana.`, sig.nameTok);
    }
    this.defined.add(sig.name);
    const proc: Proc = { name: sig.name, params: sig.params, body: [], tok: sig.tok };
    const scope: Scope = {
      proc,
      params: new Set(sig.params),
      locals: this.procVars.get(sig.name) ?? new Set(),
      repDepth: 0,
    };
    for (;;) {
      const t = this.peek();
      if (!t) this.err(`Brakuje „już” na końcu procedury ${q(sig.name)}.`, sig.tok);
      if (t.kind === 'bad') this.err(t.msg, t);
      if (t.kind === 'word' && !t.colonName && END_WORDS.has(t.name)) {
        if (!t.first || !t.last) this.err(`„${t.text}” musi stać samo w osobnym wierszu.`, t);
        this.next();
        break;
      }
      proc.body.push(this.parseStmt(scope));
    }
    this.procs.set(sig.name, proc);
  }

  // ---------- statements ----------

  stray(t: Token): never {
    if (t.kind === 'bad') this.err(t.msg, t);
    if (this.lastCall && this.pos === this.lastCallEnd) {
      const n = this.lastCall.params.length;
      const startsValue = t.kind === 'num' || t.kind === 'lpar' || t.kind === 'op' || (t.kind === 'word' && !COMMANDS.has(t.name) && !this.sigs.has(t.name));
      if (startsValue) {
        this.err(`Procedura ${q(this.lastCall.name)} przyjmuje ${plArg(n)}, a podano więcej.`, t);
      }
    }
    switch (t.kind) {
      case 'rbr': this.err('Nieoczekiwany znak „]” – brakuje otwierającego „[”.', t);
      case 'rpar': this.err('Nieoczekiwany znak „)” – brakuje otwierającego „(”.', t);
      case 'lbr': this.err('Nieoczekiwany znak „[” – ciało musi następować po poleceniu (powtórz, jeśli, jeżeli).', t);
      case 'num': case 'str': case 'lpar':
        this.err(`Nieoczekiwana wartość ${q(t.text)} – w tym miejscu powinno stać polecenie.`, t);
      case 'op': case 'cmp': case 'comma': case 'colon':
        this.err(`Nieoczekiwany znak ${q(t.text)} – w tym miejscu powinno stać polecenie.`, t);
      default:
        if (t.kind === 'word' && t.colonName) this.err(`Nieoczekiwana wartość ${q(t.text)} – w tym miejscu powinno stać polecenie.`, t);
        this.err(`Nieoczekiwany element ${q(t.text)}.`, t);
    }
  }

  parseStmt(scope: Scope): Stmt {
    const t = this.next();
    if (t.kind === 'bad') this.err(t.msg, t);
    if (t.kind !== 'word' || t.colonName) {
      this.pos--;
      return this.stray(t);
    }
    const cmd = COMMANDS.get(t.name);
    if (cmd) return this.parseCommand(cmd, t, scope);
    if (DEF_WORDS.has(t.name)) {
      this.err('Definicji procedury nie można umieścić wewnątrz powtórzenia, warunku ani innej procedury.', t);
    }
    if (END_WORDS.has(t.name)) this.err(`Nieoczekiwane ${q(t.text)} – brak otwartej definicji procedury.`, t);
    if (REP_WORDS.has(t.name)) this.err(`Nieoczekiwana wartość ${q(t.text)} – w tym miejscu powinno stać polecenie.`, t);
    const sig = this.sigs.get(t.name);
    if (sig) return this.parseCall(sig, t, scope);
    if (this.lastCall && this.pos - 1 === this.lastCallEnd) {
      this.pos--;
      this.stray(t);
    }
    return this.err(`Nieznane polecenie ${q(t.text)}.`, t);
  }

  parseCall(sig: ProcSig, t: Token, scope: Scope): Stmt {
    const args: Arg[] = [];
    for (let i = 0; i < sig.params.length; i++) {
      const nt = this.peek();
      if (!nt || !this.startsOperand(nt)) {
        const n = sig.params.length;
        this.err(
          `Procedura ${q(sig.name)} przyjmuje ${plArg(n)}, a podano ${i}.`,
          nt ?? t,
        );
      }
      args.push(this.parseArg(scope));
    }
    this.lastCall = sig;
    this.lastCallEnd = this.pos;
    return { k: 'call', tok: t, proc: sig.name, args };
  }

  parseCommand(cmd: Cmd, t: Token, scope: Scope): Stmt {
    if (this.mode === '2d' && THREE_D_ONLY.has(cmd)) {
      this.err(`Polecenie ${q(t.text)} działa tylko w trybie 3D.`, t);
    }
    switch (cmd) {
      case 'pu': case 'pd': case 'stop': case 'home': case 'cs':
        return { k: 'cmd', cmd, tok: t };
      case 'fd': case 'bk': case 'rt': case 'lt': case 'pitchup': case 'pitchdown': case 'rollright': case 'rollleft': {
        const arg = this.requireArg(t, scope);
        return { k: 'cmd', cmd, tok: t, arg };
      }
      case 'color': {
        const s = this.peek();
        if (!s) this.err(`Polecenie ${q(t.text)} wymaga koloru, np. "#16866a".`, t);
        if (s.kind === 'bad') this.err(s.msg, s);
        if (s.kind !== 'str') this.err(`Polecenie ${q(t.text)} wymaga koloru w cudzysłowie, np. "#16866a".`, s);
        this.next();
        if (!COLOR_RE.test(s.text)) this.err(`Nieprawidłowy kolor ${s.text}. Użyj formatu "#rrggbb" (sześć cyfr szesnastkowych).`, s);
        return { k: 'cmd', cmd, tok: t, colorHex: s.text.slice(1, -1).toLowerCase() };
      }
      case 'width': {
        const arg = this.requireArg(t, scope);
        const v = constValue(arg.e);
        if (v !== undefined && (v === 'err' || !Number.isInteger(v) || v < LIMITS.widthMin || v > LIMITS.widthMax)) {
          this.err(WIDTH_MSG, arg.tok);
        }
        return { k: 'cmd', cmd, tok: t, arg };
      }
      case 'let': {
        const nt = this.peek();
        if (!nt) this.err('Po „niech” brakuje nazwy zmiennej.', t);
        if (nt.kind === 'bad') this.err(nt.msg, nt);
        if (nt.kind !== 'word') this.err(`Po „niech” oczekiwano nazwy zmiennej, a jest ${q(nt.text)}.`, nt);
        if (isReserved(nt.name)) this.err(`${q(nt.text)} jest słowem zarezerwowanym i nie może być nazwą zmiennej.`, nt);
        if (this.sigs.has(nt.name)) this.err(`${q(nt.text)} jest nazwą procedury i nie może być nazwą zmiennej.`, nt);
        this.next();
        if (!this.peek() || !this.startsOperand(this.peek()!)) {
          this.err(`Zmienna ${q(nt.text)} wymaga wartości.`, this.peek() ?? t);
        }
        const value = this.parseArg(scope);
        return { k: 'let', tok: t, name: nt.name, value };
      }
      case 'repeat': {
        const count = this.requireArg(t, scope);
        const v = constValue(count.e);
        if (v !== undefined && (v === 'err' || !Number.isInteger(v) || v < 0 || v > LIMITS.repeatMax)) {
          this.err(REPEAT_MSG, count.tok);
        }
        const body = this.parseBody(t, { ...scope, repDepth: scope.repDepth + 1 });
        return { k: 'repeat', tok: t, count, body };
      }
      case 'if': case 'ifelse': {
        const cond = this.parseCond(t, scope);
        const then = this.parseBody(t, scope);
        let els: Stmt[] | undefined;
        if (cmd === 'ifelse') els = this.parseBody(t, scope);
        return { k: 'if', tok: t, cond, then, else: els };
      }
    }
  }

  parseCond(t: Token, scope: Scope): Cond {
    const first = this.peek();
    if (!first || !this.startsOperand(first)) {
      this.err(`Polecenie ${q(t.text)} wymaga warunku, np. x > 0.`, first ?? t);
    }
    const left = this.parseExpr(scope);
    const op = this.peek();
    if (!op || op.kind !== 'cmp') {
      this.err('W warunku oczekiwano porównania (<, >, =, <=, >=, <>).', op ?? t);
    }
    this.next();
    const r = this.peek();
    if (!r || !this.startsOperand(r)) {
      this.err('W warunku brakuje wyrażenia po znaku porównania.', r ?? op);
    }
    const right = this.parseExpr(scope);
    return { left, op: op.text as CmpOp, right, tok: first };
  }

  parseBody(cmdTok: Token, scope: Scope): Stmt[] {
    const open = this.peek();
    if (!open) this.err(`Po poleceniu ${q(cmdTok.text)} oczekiwano „[”.`, cmdTok);
    if (open.kind === 'bad') this.err(open.msg, open);
    if (open.kind !== 'lbr') this.err(`Po poleceniu ${q(cmdTok.text)} oczekiwano „[”, a jest ${q(open.text)}.`, open);
    this.next();
    if (this.depth >= LIMITS.nesting) this.err(`Za głębokie zagnieżdżenie nawiasów: limit to ${LIMITS.nesting}.`, open);
    this.depth++;
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) this.err('Brakuje zamykającego „]”.', open);
      if (t.kind === 'rbr') {
        this.next();
        break;
      }
      if (t.kind === 'word' && !t.colonName && END_WORDS.has(t.name)) {
        this.err('Brakuje zamykającego „]” przed końcem procedury.', open);
      }
      body.push(this.parseStmt(scope));
    }
    this.depth--;
    return body;
  }

  // ---------- expressions ----------

  startsOperand(t: Token): boolean {
    switch (t.kind) {
      case 'num': case 'lpar': return true;
      case 'op': return t.text === '-' || t.text === '+';
      case 'word': {
        if (t.colonName) return true;
        if (REP_WORDS.has(t.name)) return true;
        if (COMMANDS.has(t.name) || DEF_WORDS.has(t.name) || END_WORDS.has(t.name)) return false;
        return true;
      }
      default: return false;
    }
  }

  requireArg(cmdTok: Token, scope: Scope): Arg {
    const t = this.peek();
    if (!t) this.err(`Polecenie ${q(cmdTok.text)} wymaga argumentu.`, cmdTok);
    if (t.kind === 'bad') this.err(t.msg, t);
    if (!this.startsOperand(t)) this.err(`Polecenie ${q(cmdTok.text)} wymaga argumentu, a jest ${q(t.text)}.`, t);
    return this.parseArg(scope);
  }

  parseArg(scope: Scope): Arg {
    const tok = this.peek()!;
    return { e: this.parseExpr(scope), tok };
  }

  isBinary(t: Token | undefined, ops: string): t is Token {
    return !!t && t.kind === 'op' && ops.includes(t.text) && t.spaceBefore === t.spaceAfter;
  }

  parseExpr(scope: Scope): Expr {
    let left = this.parseTerm(scope);
    while (this.isBinary(this.peek(), '+-')) {
      const op = this.next();
      left = { k: 'bin', op: op.text as '+' | '-', a: left, b: this.parseTerm(scope, op) };
    }
    return left;
  }

  parseTerm(scope: Scope, after?: Token): Expr {
    let left = this.parseUnary(scope, after);
    while (this.isBinary(this.peek(), '*/')) {
      const op = this.next();
      left = { k: 'bin', op: op.text as '*' | '/', a: left, b: this.parseUnary(scope, op) };
    }
    return left;
  }

  parseUnary(scope: Scope, after?: Token): Expr {
    const t = this.peek();
    if (t && t.kind === 'op' && (t.text === '-' || t.text === '+')) {
      this.next();
      const a = this.parseUnary(scope, t);
      return t.text === '-' ? { k: 'neg', a } : a;
    }
    return this.parsePrimary(scope, after);
  }

  parsePrimary(scope: Scope, after?: Token): Expr {
    const t = this.peek();
    if (!t) this.err('Brakuje wyrażenia.', after ?? this.toks[this.toks.length - 1]);
    switch (t.kind) {
      case 'bad': return this.err(t.msg, t);
      case 'num':
        this.next();
        return { k: 'num', v: t.value };
      case 'lpar': {
        this.next();
        if (this.parenDepth >= LIMITS.nesting) this.err(`Za głębokie zagnieżdżenie nawiasów: limit to ${LIMITS.nesting}.`, t);
        this.parenDepth++;
        const nt = this.peek();
        if (!nt) this.err('Brakuje zamykającego „)”.', t);
        if (!this.startsOperand(nt)) this.err(`W nawiasie oczekiwano wyrażenia, a jest ${q(nt.text)}.`, nt);
        const e = this.parseExpr(scope);
        const close = this.peek();
        if (!close) this.err('Brakuje zamykającego „)”.', t);
        if (close.kind !== 'rpar') this.err(`Oczekiwano „)”, a jest ${q(close.text)}.`, close);
        this.next();
        this.parenDepth--;
        return e;
      }
      case 'word': {
        if (!t.colonName && REP_WORDS.has(t.name)) {
          if (scope.repDepth === 0) {
            this.err(`„${t.text}” można użyć tylko wewnątrz powtórzenia (w jego nawiasach „[ ]”).`, t);
          }
          this.next();
          return { k: 'rep' };
        }
        if (!t.colonName && (COMMANDS.has(t.name) || DEF_WORDS.has(t.name) || END_WORDS.has(t.name))) {
          this.err(`W tym miejscu oczekiwano wartości, a jest polecenie ${q(t.text)}.`, t);
        }
        if (scope.params.has(t.name) || scope.locals.has(t.name) || this.globalVars.has(t.name)) {
          this.next();
          return { k: 'var', name: t.name };
        }
        if (this.sigs.has(t.name)) {
          return this.err(`${q(t.text)} jest nazwą procedury, a nie parametrem ani zmienną – brakuje argumentu?`, t);
        }
        return this.err(`Nieznana nazwa ${q(t.text)}: to nie parametr ani zmienna przypisana przez „niech”.`, t);
      }
      default:
        return this.err(`W tym miejscu oczekiwano wartości, a jest ${q(t.text)}.`, t);
    }
  }
}
