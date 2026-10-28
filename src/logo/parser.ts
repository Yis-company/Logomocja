import { errorAt, type Pos } from './errors';
import type { Token } from './lexer';
import { BLOCK_WORDS, COMMAND_WORDS, END_WORDS, MODE_3D_ONLY, type CmdName, type Mode, RESERVED, VALUE_WORDS } from './vocab';

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'ref'; name: string }
  | { k: 'nrpowt' }
  | { k: 'un'; sign: 1 | -1; e: Expr }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; a: Expr; b: Expr };

/** An argument expression, located at its first token. */
export interface Arg {
  e: Expr;
  pos: Pos;
}

export interface Cond {
  a: Arg;
  op: '<' | '>' | '=' | '<=' | '>=' | '<>';
  b: Arg;
}

export type Stmt =
  | { t: 'cmd'; pos: Pos; cmd: CmdName; args: Arg[]; color: string }
  | { t: 'stop'; pos: Pos }
  | { t: 'repeat'; pos: Pos; count: Arg; body: Stmt[] }
  | { t: 'if'; pos: Pos; cond: Cond; body: Stmt[]; elseBody: Stmt[] | null }
  | { t: 'let'; pos: Pos; name: string; value: Arg }
  | { t: 'call'; pos: Pos; proc: string; args: Arg[] };

export interface ProcDef {
  name: string;
  params: string[];
  body: Stmt[];
  pos: Pos;
  /** Names assigned with `niech` inside this body. */
  assigned: Set<string>;
}

export interface Program {
  mode: Mode;
  top: Stmt[];
  procs: Map<string, ProcDef>;
}

type Ctx = 'top' | 'proc' | 'bracket';

const MAX_NESTING = 32;
const MAX_REPEAT = 10000;

const posOf = (t: Token): Pos => ({ line: t.line, column: t.column });

/** Value of an expression that uses no names, or undefined if it cannot be known before running. */
export function constValue(e: Expr): number | undefined {
  switch (e.k) {
    case 'num':
      return e.v;
    case 'un': {
      const v = constValue(e.e);
      return v === undefined ? undefined : e.sign * v;
    }
    case 'bin': {
      const a = constValue(e.a);
      const b = constValue(e.b);
      if (a === undefined || b === undefined) return undefined;
      const r = { '+': a + b, '-': a - b, '*': a * b, '/': b === 0 ? NaN : a / b }[e.op];
      return Number.isFinite(r) ? r : undefined;
    }
    default:
      return undefined;
  }
}

class Parser {
  private i = 0;
  private cur: ProcDef | null = null;
  private repeatDepth = 0;
  private depth = 0;
  private readonly procs = new Map<string, ProcDef>();
  private readonly topAssigned = new Set<string>();
  private readonly refs: { name: string; pos: Pos; proc: ProcDef | null }[] = [];

  constructor(
    private readonly toks: Token[],
    private readonly mode: Mode,
  ) {}

  parse(): Program {
    this.collectProcs();
    this.i = 0;
    const top = this.stmts('top', null);
    for (const r of this.refs) {
      const local = r.proc && (r.proc.params.includes(r.name) || r.proc.assigned.has(r.name));
      if (!local && !this.topAssigned.has(r.name)) {
        throw errorAt(`Nieznana nazwa „${r.name}”. Użyj parametru albo najpierw przypisz wartość przez „niech”.`, r.pos);
      }
    }
    return { mode: this.mode, top, procs: this.procs };
  }

  // ---- procedure headers -------------------------------------------------

  private lineStart(j: number): boolean {
    return j === 0 || this.toks[j - 1].line < this.toks[j].line;
  }

  /** Reads `oto name [ma: p1, p2 | :p1 :p2]` starting at index j; returns the name, params and the next index. */
  private header(j: number): { name: string; params: string[]; next: number } {
    const oto = this.toks[j];
    const at = (k: number): Token | undefined => this.toks[k];
    const same = (k: number): boolean => at(k)?.line === oto.line;
    const nameTok = at(j + 1);
    if (!nameTok || !same(j + 1) || nameTok.kind !== 'word') {
      throw errorAt('Oczekiwano nazwy procedury po „oto”.', same(j + 1) && nameTok ? posOf(nameTok) : posOf(oto));
    }
    if (RESERVED.has(nameTok.key)) throw errorAt(`Nazwa „${nameTok.text}” jest zarezerwowana.`, posOf(nameTok));

    const params: string[] = [];
    const addParam = (t: Token) => {
      if (RESERVED.has(t.key)) throw errorAt(`Nazwa „${t.text}” jest zarezerwowana.`, posOf(t));
      if (params.includes(t.key)) throw errorAt(`Parametr „${t.text}” występuje dwa razy.`, posOf(t));
      params.push(t.key);
    };

    let k = j + 2;
    if (same(k) && at(k)!.kind === 'word' && at(k)!.key === 'ma' && same(k + 1) && at(k + 1)!.kind === 'colon') {
      k += 2;
      while (same(k) && at(k)!.kind === 'word') {
        addParam(at(k)!);
        k++;
        if (same(k) && at(k)!.kind === 'comma') k++;
        else break;
      }
    } else {
      while (same(k) && at(k)!.kind === 'colon' && same(k + 1) && at(k + 1)!.kind === 'word') {
        addParam(at(k + 1)!);
        k += 2;
      }
    }
    if (same(k)) {
      const extra = at(k)!;
      throw errorAt(`Nieoczekiwany symbol „${extra.text}” w nagłówku procedury (oczekiwano przecinka).`, posOf(extra));
    }
    return { name: nameTok.key, params, next: k };
  }

  private collectProcs() {
    for (let j = 0; j < this.toks.length; j++) {
      const t = this.toks[j];
      if (t.kind !== 'word' || !BLOCK_WORDS.has(t.key) || !this.lineStart(j)) continue;
      const h = this.header(j);
      if (this.procs.has(h.name)) {
        throw errorAt(`Procedura „${h.name}” jest już zdefiniowana.`, posOf(this.toks[j + 1]));
      }
      this.procs.set(h.name, { name: h.name, params: h.params, body: [], pos: posOf(t), assigned: new Set() });
    }
  }

  private definition() {
    const oto = this.toks[this.i];
    const h = this.header(this.i);
    const def = this.procs.get(h.name)!;
    this.cur = def;
    this.repeatDepth = 0;
    this.i = h.next;
    def.body = this.stmts('proc', oto);
    this.i++; // the closing już
    this.cur = null;
  }

  // ---- statements --------------------------------------------------------

  private stmts(ctx: Ctx, owner: Token | null): Stmt[] {
    const out: Stmt[] = [];
    for (;;) {
      const t = this.toks[this.i];
      if (!t) {
        if (ctx === 'bracket') throw errorAt('Nie zamknięto nawiasu „[”.', posOf(owner!));
        if (ctx === 'proc') {
          throw errorAt(`Brakuje słowa „już” kończącego procedurę „${this.cur!.name}”.`, posOf(owner!));
        }
        return out;
      }
      if (t.kind === 'rb') {
        if (ctx === 'bracket') return out;
        throw errorAt('Nieoczekiwany nawias „]”.', posOf(t));
      }
      if (t.kind === 'word') {
        if (END_WORDS.has(t.key)) {
          if (ctx === 'proc') return out;
          throw errorAt('Nieoczekiwane „już”: nie ma otwartej procedury.', posOf(t));
        }
        if (BLOCK_WORDS.has(t.key)) {
          if (ctx === 'top' && this.lineStart(this.i)) {
            this.definition();
            continue;
          }
          if (ctx === 'proc') {
            throw errorAt('Definicja procedury nie może znajdować się wewnątrz innej procedury (czy brakuje „już”?).', posOf(t));
          }
          throw errorAt(
            this.lineStart(this.i)
              ? 'Definicja procedury nie może znajdować się wewnątrz bloku.'
              : 'Definicja procedury musi zaczynać się od nowego wiersza.',
            posOf(t),
          );
        }
      }
      out.push(this.statement());
    }
  }

  private statement(): Stmt {
    const t = this.toks[this.i];
    if (t.kind !== 'word') {
      const what = t.kind === 'num' ? `liczbę „${t.text}”` : `„${t.text}”`;
      throw errorAt(`Oczekiwano polecenia, a znaleziono ${what}.`, posOf(t));
    }
    if (t.key === 'nrpowt' || t.key === 'repcount') {
      throw errorAt(`„${t.text}” jest wartością, a nie poleceniem.`, posOf(t));
    }
    const cmd = COMMAND_WORDS.get(t.key);
    if (cmd) return this.command(cmd, t);
    if (this.procs.has(t.key)) return this.call(t);
    throw errorAt(`Nieznane polecenie „${t.text}”.`, posOf(t));
  }

  private command(cmd: CmdName, t: Token): Stmt {
    const pos = posOf(t);
    if (MODE_3D_ONLY.has(cmd) && this.mode === '2d') {
      throw errorAt(`Polecenie „${t.text}” działa tylko w trybie 3D.`, pos);
    }
    this.i++;
    const simple = (): Stmt => ({ t: 'cmd', pos, cmd, args: [this.arg(t)], color: '' });
    switch (cmd) {
      case 'stop':
        return { t: 'stop', pos };
      case 'home':
      case 'pu':
      case 'pd':
      case 'cs':
        return { t: 'cmd', pos, cmd, args: [], color: '' };
      case 'color': {
        const ct = this.toks[this.i];
        if (!ct || ct.kind !== 'str' || !/^"#[0-9a-fA-F]{6}"$/.test(ct.text)) {
          throw errorAt('Nieprawidłowy kolor. Oczekiwano koloru w formie "#rrggbb".', ct ? posOf(ct) : pos);
        }
        this.i++;
        return { t: 'cmd', pos, cmd, args: [], color: ct.text.slice(1, 8).toLowerCase() };
      }
      case 'width': {
        const a = this.arg(t);
        this.literal(a, (v) => Number.isInteger(v) && v >= 1 && v <= 12, 'Grubość musi być liczbą całkowitą od 1 do 12.');
        return { t: 'cmd', pos, cmd, args: [a], color: '' };
      }
      case 'repeat': {
        const count = this.arg(t);
        this.literal(
          count,
          (v) => Number.isInteger(v) && v >= 0 && v <= MAX_REPEAT,
          'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.',
        );
        this.repeatDepth++;
        const body = this.bracket(t);
        this.repeatDepth--;
        return { t: 'repeat', pos, count, body };
      }
      case 'let': {
        const nt = this.toks[this.i];
        if (!nt || nt.kind !== 'word') throw errorAt('Oczekiwano nazwy zmiennej po „niech”.', nt ? posOf(nt) : pos);
        if (RESERVED.has(nt.key) || this.procs.has(nt.key)) {
          throw errorAt(`Nazwy „${nt.text}” nie można użyć jako nazwy zmiennej.`, posOf(nt));
        }
        this.i++;
        (this.cur ? this.cur.assigned : this.topAssigned).add(nt.key);
        return { t: 'let', pos, name: nt.key, value: this.arg(t) };
      }
      case 'if': {
        const cond = this.cond(t);
        return { t: 'if', pos, cond, body: this.bracket(t), elseBody: null };
      }
      case 'ifelse': {
        const cond = this.cond(t);
        const body = this.bracket(t);
        return { t: 'if', pos, cond, body, elseBody: this.bracket(t) };
      }
      case 'fd':
      case 'bk':
      case 'rt':
      case 'lt':
      case 'pitchup':
      case 'pitchdown':
      case 'rollright':
      case 'rollleft':
        return simple();
    }
  }

  private call(t: Token): Stmt {
    const def = this.procs.get(t.key)!;
    this.i++;
    const args: Arg[] = [];
    for (let k = 0; k < def.params.length; k++) {
      if (!this.startsExpr(this.toks[this.i])) {
        throw errorAt(`Procedura „${def.name}” oczekuje ${def.params.length} argumentów, podano ${k}.`, posOf(t));
      }
      args.push(this.arg(t));
    }
    return { t: 'call', pos: posOf(t), proc: def.name, args };
  }

  private bracket(owner: Token): Stmt[] {
    const t = this.toks[this.i];
    if (!t || t.kind !== 'lb') throw errorAt('Oczekiwano „[”.', t ? posOf(t) : posOf(owner));
    if (this.depth >= MAX_NESTING) throw errorAt(`Zbyt głębokie zagnieżdżenie nawiasów (limit ${MAX_NESTING}).`, posOf(t));
    this.i++;
    this.depth++;
    const body = this.stmts('bracket', t);
    this.depth--;
    this.i++; // the closing ]
    return body;
  }

  private cond(cmdTok: Token): Cond {
    const a = this.arg(cmdTok);
    const t = this.toks[this.i];
    if (!t || t.kind !== 'cmp') {
      throw errorAt('Oczekiwano porównania: =, <, >, <=, >= lub <>.', t ? posOf(t) : posOf(cmdTok));
    }
    this.i++;
    return { a, op: t.text as Cond['op'], b: this.arg(cmdTok) };
  }

  // ---- expressions -------------------------------------------------------

  private startsExpr(t: Token | undefined): boolean {
    if (!t) return false;
    switch (t.kind) {
      case 'num':
      case 'colon':
      case 'lp':
        return true;
      case 'op':
        return t.text === '+' || t.text === '-';
      case 'word':
        return VALUE_WORDS.has(t.key) || !RESERVED.has(t.key);
      default:
        return false;
    }
  }

  private arg(cmdTok: Token): Arg {
    const first = this.toks[this.i];
    if (!this.startsExpr(first)) {
      if (!first || first.kind === 'rb' || first.kind === 'rp') {
        throw errorAt(`Brakuje argumentu polecenia „${cmdTok.text}”.`, first ? posOf(first) : posOf(cmdTok));
      }
      throw errorAt(`Oczekiwano liczby lub nazwy zmiennej, a znaleziono „${first.text}”.`, posOf(first));
    }
    return { e: this.sum(), pos: posOf(first) };
  }

  /** A binary operator needs whitespace on both sides or on neither side. */
  private isBinary(t: Token | undefined): t is Token {
    return !!t && t.spaceBefore === t.spaceAfter;
  }

  private operand(opTok: Token): Expr {
    const t = this.toks[this.i];
    if (!this.startsExpr(t)) {
      throw errorAt(`Brakuje wartości po operatorze „${opTok.text}”.`, t ? posOf(t) : posOf(opTok));
    }
    return this.product();
  }

  private sum(): Expr {
    let a = this.product();
    for (;;) {
      const t = this.toks[this.i];
      if (t?.kind !== 'op' || (t.text !== '+' && t.text !== '-') || !this.isBinary(t)) return a;
      this.i++;
      a = { k: 'bin', op: t.text, a, b: this.operand(t) };
    }
  }

  private product(): Expr {
    let a = this.unary();
    for (;;) {
      const t = this.toks[this.i];
      if (t?.kind !== 'op' || (t.text !== '*' && t.text !== '/') || !this.isBinary(t)) return a;
      this.i++;
      a = { k: 'bin', op: t.text, a, b: this.operand(t) };
    }
  }

  private unary(): Expr {
    const t = this.toks[this.i];
    if (t?.kind === 'op' && (t.text === '+' || t.text === '-')) {
      this.i++;
      const next = this.toks[this.i];
      if (!this.startsExpr(next)) {
        throw errorAt(`Brakuje wartości po znaku „${t.text}”.`, next ? posOf(next) : posOf(t));
      }
      return { k: 'un', sign: t.text === '-' ? -1 : 1, e: this.unary() };
    }
    return this.primary();
  }

  private primary(): Expr {
    const t = this.toks[this.i];
    this.i++;
    if (t.kind === 'num') return { k: 'num', v: t.value };
    if (t.kind === 'colon') {
      const w = this.toks[this.i];
      if (w?.kind !== 'word') throw errorAt('Oczekiwano nazwy zmiennej po dwukropku.', w ? posOf(w) : posOf(t));
      this.i++;
      return this.ref(w);
    }
    if (t.kind === 'lp') {
      const e = this.sum();
      const close = this.toks[this.i];
      if (close?.kind !== 'rp') throw errorAt('Nie zamknięto nawiasu „(”.', posOf(t));
      this.i++;
      return e;
    }
    if (t.kind === 'word') {
      if (VALUE_WORDS.has(t.key)) {
        if (this.repeatDepth === 0) {
          throw errorAt('Wartość „nrpowt” można użyć tylko wewnątrz powtórz.', posOf(t));
        }
        return { k: 'nrpowt' };
      }
      return this.ref(t);
    }
    throw errorAt(`Oczekiwano liczby lub nazwy zmiennej, a znaleziono „${t.text}”.`, posOf(t));
  }

  private ref(t: Token): Expr {
    this.refs.push({ name: t.key, pos: posOf(t), proc: this.cur });
    return { k: 'ref', name: t.key };
  }

  /** Checks an argument that is a literal number against a range; names are checked when running. */
  private literal(a: Arg, ok: (v: number) => boolean, message: string) {
    const v = constValue(a.e);
    if (v !== undefined && !ok(v)) throw errorAt(message, a.pos);
  }
}

export function parseTokens(tokens: Token[], mode: Mode): Program {
  return new Parser(tokens, mode).parse();
}
