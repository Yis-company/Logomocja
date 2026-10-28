import { lex, Token } from './lexer';

export type Mode = '2d' | '3d';

export class LogoError extends Error {
  line: number;
  column: number;
  length: number;
  code?: string;
  constructor(message: string, tok: { line: number; col: number; start: number; end: number }, code?: string) {
    super(message);
    this.line = tok.line;
    this.column = tok.col;
    this.length = Math.max(1, tok.end - tok.start);
    this.code = code;
  }
}

export type CmdName =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width' | 'repeat' | 'let' | 'if' | 'ifelse'
  | 'stop' | 'home' | 'cs' | 'pitchup' | 'pitchdown' | 'rollright' | 'rollleft';

const ALIASES: Record<CmdName, string[]> = {
  fd: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
  bk: ['ws', 'wstecz', 'bk', 'back'],
  rt: ['pw', 'prawo', 'rt', 'right'],
  lt: ['lw', 'lewo', 'lt', 'left'],
  pu: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
  pd: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
  color: ['kolor', 'color'],
  width: ['grubosc', 'grubość', 'width'],
  repeat: ['powtorz', 'powtórz', 'repeat'],
  let: ['niech', 'let'],
  if: ['jeśli', 'jesli', 'if'],
  ifelse: ['jeżeli', 'jezeli', 'ifelse'],
  stop: ['stop'],
  home: ['dom', 'home'],
  cs: ['czyść', 'czysc', 'cs', 'clearscreen'],
  pitchup: ['gora', 'góra', 'pitchup'],
  pitchdown: ['dol', 'dół', 'pitchdown'],
  rollright: ['pp', 'przechylprawo', 'rr', 'rollright'],
  rollleft: ['pl', 'przechyllewo', 'rl', 'rollleft'],
};

export const COMMANDS = new Map<string, CmdName>();
for (const [k, v] of Object.entries(ALIASES)) for (const a of v) COMMANDS.set(a.normalize('NFC'), k as CmdName);

const REP_WORDS = new Set(['nrpowt', 'repcount']);
const DEF_WORDS = new Set(['oto', 'to']);
const END_WORDS = new Set(['już', 'juz', 'end']);

export function isReserved(w: string): boolean {
  return COMMANDS.has(w) || REP_WORDS.has(w) || DEF_WORDS.has(w) || END_WORDS.has(w);
}
export const KEYWORD_SETS = { REP_WORDS, DEF_WORDS, END_WORDS };

const THREE_D: ReadonlySet<CmdName> = new Set<CmdName>(['pitchup', 'pitchdown', 'rollright', 'rollleft']);

export type Expr =
  | { t: 'num'; v: number }
  | { t: 'var'; name: string }
  | { t: 'rep' }
  | { t: 'neg'; e: Expr }
  | { t: 'bin'; op: '+' | '-' | '*' | '/'; l: Expr; r: Expr };

export interface Arg { e: Expr; tok: Token }
export interface Cond { l: Expr; op: string; r: Expr; tok: Token }

export type Stmt =
  | { k: 'cmd'; name: CmdName; tok: Token; arg?: Arg }
  | { k: 'color'; tok: Token; color: string }
  | { k: 'repeat'; tok: Token; count: Arg; body: Stmt[] }
  | { k: 'if'; tok: Token; cond: Cond; then: Stmt[]; else?: Stmt[] }
  | { k: 'let'; tok: Token; name: string; value: Arg }
  | { k: 'call'; tok: Token; proc: string; args: Arg[] };

export interface Proc {
  name: string;
  params: string[];
  body: Stmt[];
  tok: Token;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Proc>;
}

interface Header { name: Token; params: Token[]; next: number }
interface Scope { params: Set<string>; vars: Set<string> }
interface ProcInfo { header: Header; scope: Scope }

const LIMIT_DEPTH = 32;

/** Oblicza wyrażenie stałe; undefined, gdy zależy od nazw. Rzuca Error przy dzieleniu przez zero. */
export function constValue(e: Expr): number | undefined {
  switch (e.t) {
    case 'num': return e.v;
    case 'var': case 'rep': return undefined;
    case 'neg': { const v = constValue(e.e); return v === undefined ? undefined : -v; }
    case 'bin': {
      const a = constValue(e.l);
      const b = constValue(e.r);
      if (a === undefined || b === undefined) return undefined;
      return applyOp(e.op, a, b);
    }
  }
}

export function applyOp(op: string, a: number, b: number): number {
  let r: number;
  switch (op) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    default:
      if (b === 0) throw new Error('Dzielenie przez zero');
      r = a / b;
  }
  if (!Number.isFinite(r)) throw new Error('Wynik działania nie jest liczbą skończoną');
  return r;
}

class Parser {
  toks: Token[];
  pos = 0;
  procInfos = new Map<number, ProcInfo>(); // klucz: indeks tokenu `oto`
  procArity = new Map<string, number>();
  globals = new Set<string>();
  defined = new Set<string>();
  procs = new Map<string, Proc>();
  scope: Scope | null = null;
  repDepth = 0;
  bracketDepth = 0;
  parenDepth = 0;
  ownerTok: Token;
  ownerMsg = '';

  constructor(toks: Token[], public mode: Mode) {
    this.toks = toks;
    this.ownerTok = toks[0];
  }

  fail(msg: string, tok: Token, code?: string): never {
    throw new LogoError(msg, tok, code);
  }

  peek(): Token | undefined {
    const t = this.toks[this.pos];
    if (t && t.type === 'bad') this.fail(t.msg ?? 'Nieznany znak', t);
    return t;
  }
  next(): Token {
    const t = this.peek()!;
    this.pos++;
    return t;
  }

  // ---------- wstępne przejście: nagłówki procedur i zmienne ----------
  prescan(): void {
    let cur: Scope | null = null;
    for (let i = 0; i < this.toks.length; i++) {
      const t = this.toks[i];
      if (t.type !== 'word' || t.colon) continue;
      if (DEF_WORDS.has(t.text) && t.firstOnLine) {
        try {
          const header = this.parseHeader(i);
          const scope: Scope = { params: new Set(header.params.map(p => p.text)), vars: new Set() };
          this.procInfos.set(i, { header, scope });
          if (!this.procArity.has(header.name.text)) this.procArity.set(header.name.text, header.params.length);
          cur = scope;
          i = header.next - 1;
        } catch { cur = null; }
      } else if (END_WORDS.has(t.text) && t.firstOnLine) {
        cur = null;
      } else if (t.text === 'niech' || t.text === 'let') {
        const nx = this.toks[i + 1];
        if (nx && nx.type === 'word') (cur ? cur.vars : this.globals).add(nx.text);
      }
    }
  }

  parseHeader(i: number): Header {
    const oto = this.toks[i];
    const name = this.toks[i + 1];
    if (name && name.type === 'bad') this.fail(name.msg ?? '', name);
    if (!name || name.line !== oto.line) {
      this.fail('Brakuje nazwy procedury po „oto”', name && name.line !== oto.line ? name : oto);
    }
    if (name.type !== 'word') this.fail('Oczekiwano nazwy procedury', name);
    if (isReserved(name.text)) this.fail(`„${name.text}” jest słowem zastrzeżonym i nie może być nazwą procedury`, name);
    const params: Token[] = [];
    let j = i + 2;
    const sameLine = () => this.toks[j] && this.toks[j].line === oto.line;
    const addParam = (t: Token) => {
      if (t.type === 'bad') this.fail(t.msg ?? '', t);
      if (t.type !== 'word') this.fail('Oczekiwano nazwy parametru', t);
      if (isReserved(t.text)) this.fail(`„${t.text}” jest słowem zastrzeżonym i nie może być parametrem`, t);
      if (params.some(p => p.text === t.text)) this.fail(`Parametr „${t.text}” jest już zadeklarowany`, t);
      params.push(t);
    };
    if (sameLine() && this.toks[j].type === 'ma') {
      j++;
      if (!sameLine()) this.fail('Po „ma:” oczekiwano nazwy parametru', this.toks[j] ?? this.toks[j - 1]);
      addParam(this.toks[j++]);
      while (sameLine() && this.toks[j].type === 'comma') {
        j++;
        if (!sameLine()) this.fail('Po przecinku oczekiwano nazwy parametru', this.toks[j] ?? this.toks[j - 1]);
        addParam(this.toks[j++]);
      }
    } else {
      while (sameLine() && (this.toks[j].colon || this.toks[j].type === 'comma')) {
        if (this.toks[j].type === 'comma') { j++; continue; }
        addParam(this.toks[j++]);
      }
    }
    if (sameLine()) this.fail('Nieoczekiwany znak w nagłówku procedury (parametry oddziela się przecinkami)', this.toks[j]);
    return { name, params, next: j };
  }

  // ---------- program ----------
  parseProgram(): Program {
    this.prescan();
    const body = this.parseBlock('top');
    return { mode: this.mode, body, procs: this.procs };
  }

  /** kind: top = program, proc = ciało procedury, bracket = ciało w nawiasach. */
  parseBlock(kind: 'top' | 'proc' | 'bracket', opener?: Token): Stmt[] {
    const out: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) {
        if (kind === 'bracket') this.fail('Brakuje zamykającego „]” dla tego nawiasu', opener!);
        if (kind === 'proc') this.fail('Brakuje „już” kończącego definicję procedury', opener!);
        return out;
      }
      if (kind === 'bracket' && t.type === 'rbr') return out;
      if (kind === 'proc' && t.type === 'word' && !t.colon && END_WORDS.has(t.text) && this.bracketDepth === 0) return out;
      const s = this.parseStatement(kind);
      if (s) out.push(s);
    }
  }

  parseStatement(kind: 'top' | 'proc' | 'bracket'): Stmt | null {
    const t = this.next();
    if (t.type !== 'word' || t.colon) {
      if (t.type === 'rbr') this.fail('Nieoczekiwany nawias „]” bez pasującego „[”', t);
      if (t.type === 'rpar') this.fail('Nieoczekiwany nawias „)” bez pasującego „(”', t);
      if (t.type === 'lbr') this.fail('Nieoczekiwany nawias „[”: najpierw polecenie, które ma mieć ciało', t);
      if (t.type === 'str') this.fail('Nieoczekiwany napis: kolor podaje się po poleceniu „kolor”', t);
      this.fail(`Nieoczekiwana wartość „${this.src(t)}” w miejscu polecenia`, t);
    }
    const w = t.text;
    if (DEF_WORDS.has(w)) return this.parseDefinition(t, kind);
    if (END_WORDS.has(w)) {
      this.fail(`Nieoczekiwane „${w}”: nie ma otwartej definicji procedury`, t);
    }
    if (REP_WORDS.has(w)) this.fail(`„${w}” jest wartością, nie poleceniem`, t);
    const cmd = COMMANDS.get(w);
    if (cmd) return this.parseCommand(cmd, t);
    if (this.procArity.has(w)) return this.parseCall(t);
    this.fail(`Nieznane polecenie „${w}”`, t);
  }

  src(t: Token): string {
    return t.type === 'num' ? t.text : t.type === 'str' ? `"${t.text}"` : t.text;
  }

  parseDefinition(oto: Token, kind: 'top' | 'proc' | 'bracket'): null {
    if (kind !== 'top') this.fail('Definicja procedury jest dozwolona tylko na najwyższym poziomie programu', oto);
    if (!oto.firstOnLine) this.fail('Definicja procedury musi zaczynać się na początku wiersza', oto);
    const idx = this.pos - 1;
    const info = this.procInfos.get(idx);
    if (!info) {
      this.parseHeader(idx); // rzuci właściwy błąd
      this.fail('Niepoprawny nagłówek procedury', oto);
    }
    const { header, scope } = info;
    if (this.defined.has(header.name.text)) this.fail(`Procedura „${header.name.text}” jest już zdefiniowana`, header.name);
    this.defined.add(header.name.text);
    this.pos = header.next;
    this.scope = scope;
    this.repDepth = 0;
    const body = this.parseBlock('proc', oto);
    const end = this.next();
    if (!(end.firstOnLine && end.lastOnLine)) {
      this.fail(`„${end.text}” musi stać samo w osobnym wierszu`, end);
    }
    this.scope = null;
    this.procs.set(header.name.text, {
      name: header.name.text,
      params: header.params.map(p => p.text),
      body,
      tok: oto,
    });
    return null;
  }

  parseCommand(cmd: CmdName, t: Token): Stmt {
    if (this.mode === '2d' && THREE_D.has(cmd)) {
      this.fail(`Polecenie „${t.text}” działa tylko w trybie 3D`, t, 'needs3d');
    }
    this.ownerTok = t;
    this.ownerMsg = '';
    switch (cmd) {
      case 'pu': case 'pd': case 'stop': case 'home': case 'cs':
        return { k: 'cmd', name: cmd, tok: t };
      case 'fd': case 'bk': case 'rt': case 'lt': case 'pitchup': case 'pitchdown': case 'rollright': case 'rollleft': {
        const arg = this.parseArg();
        return { k: 'cmd', name: cmd, tok: t, arg };
      }
      case 'width': {
        const arg = this.parseArg();
        this.checkLiteral(arg, 1, 12, 'Grubość musi być liczbą całkowitą od 1 do 12');
        return { k: 'cmd', name: cmd, tok: t, arg };
      }
      case 'color': {
        const c = this.peek();
        if (!c) this.fail('Brakuje koloru po „kolor”, np. kolor "#16866a"', t);
        if (c.type !== 'str') this.fail('Oczekiwano koloru w cudzysłowie, np. "#16866a"', c);
        this.pos++;
        if (!/^#[0-9a-fA-F]{6}$/.test(c.text)) {
          this.fail(`Niepoprawny kolor "${c.text}": oczekiwano zapisu "#rrggbb", np. "#16866a"`, c);
        }
        return { k: 'color', tok: t, color: c.text.toLowerCase() };
      }
      case 'let': {
        const n = this.peek();
        if (!n) this.fail('Brakuje nazwy zmiennej po „niech”', t);
        if (n.type !== 'word') this.fail('Oczekiwano nazwy zmiennej', n);
        this.pos++;
        if (isReserved(n.text)) this.fail(`„${n.text}” jest poleceniem lub słowem zastrzeżonym i nie może być nazwą zmiennej`, n);
        if (this.procArity.has(n.text)) this.fail(`„${n.text}” jest nazwą procedury i nie może być nazwą zmiennej`, n);
        this.ownerTok = t;
        const value = this.parseArg();
        return { k: 'let', tok: t, name: n.text, value };
      }
      case 'repeat': {
        const count = this.parseArg();
        this.checkLiteral(count, 0, 10000, 'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000');
        const open = this.expectOpen(t);
        this.repDepth++;
        const body = this.parseBracketBody(open);
        this.repDepth--;
        return { k: 'repeat', tok: t, count, body };
      }
      case 'if': case 'ifelse': {
        const cond = this.parseCond();
        const open = this.expectOpen(t);
        const then = this.parseBracketBody(open);
        if (cmd === 'if') return { k: 'if', tok: t, cond, then };
        this.ownerTok = t;
        const open2 = this.expectOpen(t, 'Po pierwszym ciele „jeżeli” oczekiwano drugiego ciała w nawiasach [ ]');
        const els = this.parseBracketBody(open2);
        return { k: 'if', tok: t, cond, then, else: els };
      }
    }
  }

  expectOpen(owner: Token, msg = 'Oczekiwano „[”'): Token {
    const o = this.peek();
    if (!o) this.fail(msg, owner);
    if (o.type !== 'lbr') this.fail(msg, o);
    this.pos++;
    return o;
  }

  parseBracketBody(open: Token): Stmt[] {
    if (++this.bracketDepth > LIMIT_DEPTH) this.fail(`Przekroczono limit zagnieżdżenia nawiasów (${LIMIT_DEPTH})`, open);
    const body = this.parseBlock('bracket', open);
    this.pos++; // ]
    this.bracketDepth--;
    return body;
  }

  checkLiteral(arg: Arg, min: number, max: number, msg: string) {
    let v: number | undefined;
    try { v = constValue(arg.e); } catch (e) { this.fail((e as Error).message, arg.tok); }
    if (v !== undefined && (!Number.isInteger(v) || v < min || v > max)) this.fail(msg, arg.tok);
  }

  parseCall(t: Token): Stmt {
    const arity = this.procArity.get(t.text)!;
    this.ownerTok = t;
    this.ownerMsg = ` (procedura „${t.text}” przyjmuje argumentów: ${arity})`;
    const args: Arg[] = [];
    for (let i = 0; i < arity; i++) {
      this.ownerTok = t;
      this.ownerMsg = ` (procedura „${t.text}” przyjmuje argumentów: ${arity})`;
      args.push(this.parseArg());
    }
    return { k: 'call', tok: t, proc: t.text, args };
  }

  // ---------- wyrażenia ----------
  parseArg(): Arg {
    const owner = this.ownerTok;
    const ownerMsg = this.ownerMsg;
    const first = this.peek();
    const e = this.parseExpr();
    this.ownerTok = owner;
    this.ownerMsg = ownerMsg;
    return { e, tok: first! };
  }

  parseCond(): Cond {
    const owner = this.ownerTok;
    const first = this.peek();
    const l = this.parseExpr();
    const c = this.peek();
    if (!c) this.fail('Oczekiwano operatora porównania (<, >, =, <=, >=, <>)', owner);
    if (c.type !== 'cmp') this.fail('Oczekiwano operatora porównania (<, >, =, <=, >=, <>)', c);
    this.pos++;
    const r = this.parseExpr();
    return { l, op: c.text, r, tok: first! };
  }

  /** Operator dwuargumentowy: odstępy po obu stronach albo po żadnej. */
  binOp(ops: string): Token | null {
    const t = this.peek();
    if (!t || t.type !== 'op' || !ops.includes(t.text)) return null;
    if (t.wsBefore !== t.wsAfter) return null;
    return t;
  }

  parseExpr(): Expr {
    let l = this.parseTerm();
    for (let o = this.binOp('+-'); o; o = this.binOp('+-')) {
      this.pos++;
      const r = this.parseTerm();
      l = { t: 'bin', op: o.text as '+' | '-', l, r };
    }
    return l;
  }
  parseTerm(): Expr {
    let l = this.parseUnary();
    for (let o = this.binOp('*/'); o; o = this.binOp('*/')) {
      this.pos++;
      const r = this.parseUnary();
      l = { t: 'bin', op: o.text as '*' | '/', l, r };
    }
    return l;
  }
  parseUnary(): Expr {
    let neg = false;
    for (;;) {
      const t = this.peek();
      if (t && t.type === 'op' && (t.text === '-' || t.text === '+')) {
        this.pos++;
        if (t.text === '-') neg = !neg;
        continue;
      }
      break;
    }
    const e = this.parsePrimary();
    return neg ? { t: 'neg', e } : e;
  }

  missing(t: Token | undefined): never {
    const msg = 'Brakuje argumentu (wyrażenia)' + this.ownerMsg;
    this.fail(msg, t ?? this.ownerTok);
  }

  parsePrimary(): Expr {
    const t = this.peek();
    if (!t) this.missing(t);
    switch (t.type) {
      case 'num':
        this.pos++;
        return { t: 'num', v: t.value! };
      case 'lpar': {
        this.pos++;
        if (++this.parenDepth > LIMIT_DEPTH) this.fail(`Przekroczono limit zagnieżdżenia nawiasów (${LIMIT_DEPTH})`, t);
        const e = this.parseExpr();
        const c = this.peek();
        if (!c) this.fail('Brakuje zamykającego „)” dla tego nawiasu', t);
        if (c.type !== 'rpar') this.fail('Oczekiwano „)”', c);
        this.pos++;
        this.parenDepth--;
        return e;
      }
      case 'word': {
        const w = t.text;
        if (!t.colon && REP_WORDS.has(w)) {
          if (this.repDepth === 0) this.fail(`„${w}” można użyć tylko wewnątrz powtórzenia (powtorz)`, t);
          this.pos++;
          return { t: 'rep' };
        }
        if (!t.colon && isReserved(w)) this.missing(t);
        const known = this.scope
          ? this.scope.params.has(w) || this.scope.vars.has(w) || this.globals.has(w)
          : this.globals.has(w);
        if (!known) {
          this.fail(`Nieznana nazwa „${w}”: to nie jest parametr ani zmienna (przypisz ją poleceniem niech)`, t);
        }
        this.pos++;
        return { t: 'var', name: w };
      }
      default:
        this.missing(t);
    }
  }
}

export function parse(source: string, mode: Mode): Program {
  const { tokens, limitError } = lex(source);
  if (limitError) throw new LogoError(limitError.msg ?? 'Przekroczono limit', limitError);
  const p = new Parser(tokens, mode);
  return p.parseProgram();
}
