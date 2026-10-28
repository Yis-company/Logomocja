import { LogoError, tokenize, type Token } from './lexer';
import {
  DEFINE_WORDS,
  END_WORDS,
  MA_WORD,
  NRPOWT_WORDS,
  WORDS,
  isReserved,
  type WordInfo,
} from './keywords';
import type { Arg, Cond, Expr, Mode, Program, Proc, Stmt } from './ast';
import { evaluate, fail, isConstant } from './evaluate';

export const MAX_BRACKET_DEPTH = 32;
export const MAX_REPEAT = 10_000;
export const MAX_WIDTH = 12;
const DIM3_OPS = new Set(['pitchup', 'pitchdown', 'rollright', 'rollleft']);

interface Header {
  name: string;
  tok: Token;
  params: { key: string; tok: Token }[];
  /** Index of the first token after the header. */
  end: number;
}

/** Reads `oto name ma: a, b` (or the legacy `oto name :a :b`) starting at token `i`. */
function readHeader(toks: Token[], i: number): Header {
  const hdr = toks[i];
  const onHeaderLine = (t: Token | undefined): t is Token => t !== undefined && t.line === hdr.line;
  const nameTok = toks[i + 1];
  if (!onHeaderLine(nameTok) || nameTok.kind !== 'word') {
    throw fail(onHeaderLine(nameTok) ? nameTok : hdr, 'Po słowie „oto” podaj nazwę procedury.');
  }
  if (isReserved(nameTok.key)) throw fail(nameTok, `Nazwa „${nameTok.text}” jest zarezerwowana.`);

  const params: Header['params'] = [];
  const addParam = (t: Token) => {
    if (isReserved(t.key)) throw fail(t, `Nazwa „${t.text}” jest zarezerwowana.`);
    if (params.some((p) => p.key === t.key)) throw fail(t, `Parametr „${t.text}” występuje dwa razy.`);
    params.push({ key: t.key, tok: t });
  };

  let j = i + 2;
  const first = toks[j];
  if (onHeaderLine(first) && first.kind === 'word' && first.key === MA_WORD) {
    j++;
    if (onHeaderLine(toks[j]) && toks[j].kind === 'colon') j++;
    while (onHeaderLine(toks[j]) && ['word', 'var', 'comma'].includes(toks[j].kind)) {
      const t = toks[j++];
      if (t.kind !== 'comma') addParam(t);
    }
  } else {
    while (onHeaderLine(toks[j]) && toks[j].kind === 'var') addParam(toks[j++]);
  }

  const after = toks[j];
  if (after && after.line === hdr.line) {
    throw fail(after, 'Nagłówek procedury musi kończyć się w osobnym wierszu.');
  }
  return { name: nameTok.key, tok: nameTok, params, end: j };
}

/** First pass: every procedure header, so that calls may precede definitions. */
function scanDefinitions(toks: Token[]): Map<string, Header> {
  const defs = new Map<string, Header>();
  toks.forEach((t, i) => {
    if (t.kind === 'word' && DEFINE_WORDS.has(t.key) && t.first) {
      const h = readHeader(toks, i);
      if (defs.has(h.name)) throw fail(h.tok, `Procedura „${h.tok.text}” jest już zdefiniowana.`);
      defs.set(h.name, h);
    }
  });
  return defs;
}

class Parser {
  private i = 0;
  private depth = 0;
  private inProc = false;

  constructor(
    private readonly toks: Token[],
    private readonly defs: Map<string, Header>,
    readonly procs: Map<string, Proc>,
  ) {}

  private peek(): Token | undefined {
    return this.toks[this.i];
  }

  /** Statements until `]` (bracket body), the end of a procedure, or the end of the program. */
  block(bracket: Token | null): Stmt[] {
    const out: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) {
        if (bracket) throw fail(bracket, 'Nawias „[” nie ma pasującego „]”.');
        return out;
      }
      if (t.kind === 'rbr') {
        if (bracket) return out;
        throw fail(t, 'Nawias „]” nie ma pasującego „[”.');
      }
      if (t.kind === 'word' && END_WORDS.has(t.key)) {
        if (bracket) throw fail(t, `Brakuje „]” przed słowem „${t.text}”.`);
        if (this.inProc) return out;
        throw fail(t, `Słowo „${t.text}” nie zamyka żadnej procedury.`);
      }
      if (t.kind === 'word' && DEFINE_WORDS.has(t.key)) {
        if (bracket || this.inProc) {
          throw fail(t, 'Definicja procedury jest dozwolona tylko na najwyższym poziomie programu.');
        }
        if (!t.first) throw fail(t, 'Słowo „oto” musi zaczynać wiersz.');
        this.definition();
        continue;
      }
      out.push(this.statement());
    }
  }

  private definition() {
    const h = readHeader(this.toks, this.i);
    this.i = h.end;
    this.inProc = true;
    const body = this.block(null);
    this.inProc = false;
    const endTok = this.peek();
    if (!endTok) throw fail(h.tok, `Procedura „${h.tok.text}” nie ma zakończenia „już”.`);
    const next = this.toks[this.i + 1];
    if (!endTok.first || (next && next.line === endTok.line)) {
      throw fail(endTok, 'Słowo „już” musi stać w osobnym wierszu.');
    }
    this.i++;
    this.procs.set(h.name, { name: h.tok.text, tok: h.tok, params: h.params, body });
  }

  private statement(): Stmt {
    const t = this.toks[this.i++];
    if (t.kind === 'word') {
      const w = WORDS.get(t.key);
      if (w) return this.command(t, w);
      if (this.defs.has(t.key)) return this.call(t);
      if (NRPOWT_WORDS.has(t.key)) throw fail(t, '„nrpowt” jest wartością, a nie poleceniem.');
      throw fail(t, `Nieznane polecenie „${t.text}”.`);
    }
    if (t.kind === 'num' || t.kind === 'var' || t.kind === 'str') {
      throw fail(t, `Oczekiwano polecenia, a znaleziono wartość „${t.text}”.`);
    }
    throw fail(t, `Nieoczekiwany znak „${t.text}”.`);
  }

  private command(t: Token, w: WordInfo): Stmt {
    switch (w.op) {
      case 'color': {
        const v = this.peek();
        if (!v || v.kind !== 'str') throw fail(v ?? t, 'Oczekiwano koloru w cudzysłowie, np. "#16866a".');
        this.i++;
        if (!/^#[0-9a-f]{6}$/i.test(v.key)) {
          throw fail(v, `Nieprawidłowy kolor ${v.text}: podaj sześć cyfr szesnastkowych, np. "#16866a".`);
        }
        return { op: 'color', tok: t, value: v.key.toLowerCase() };
      }
      case 'repeat': {
        const count = this.arg(t);
        return { op: 'repeat', tok: t, count, body: this.body(t) };
      }
      case 'let': {
        const nt = this.peek();
        if (!nt || (nt.kind !== 'word' && nt.kind !== 'var')) {
          throw fail(nt ?? t, 'Po słowie „niech” podaj nazwę zmiennej.');
        }
        this.i++;
        if (isReserved(nt.key) || this.defs.has(nt.key)) {
          throw fail(nt, `Nazwa „${nt.text}” jest zarezerwowana (polecenie lub procedura).`);
        }
        return { op: 'let', tok: t, name: nt.key, value: this.arg(t) };
      }
      case 'if': {
        const cond = this.cond(t);
        return { op: 'if', tok: t, cond, body: this.body(t) };
      }
      case 'ifelse': {
        const cond = this.cond(t);
        const body = this.body(t);
        return { op: 'ifelse', tok: t, cond, body, elseBody: this.body(t) };
      }
      case 'pu':
      case 'pd':
      case 'home':
      case 'cs':
      case 'stop':
        return { op: w.op, tok: t };
      default: {
        const args = [this.arg(t)];
        return { op: w.op, tok: t, args } as Stmt;
      }
    }
  }

  private call(t: Token): Stmt {
    const h = this.defs.get(t.key)!;
    const args: Arg[] = h.params.map(() => this.arg(t));
    const nx = this.peek();
    if (nx && (nx.kind === 'num' || nx.kind === 'var' || nx.kind === 'lpar')) {
      throw fail(nx, `Procedura „${t.text}” przyjmuje ${h.params.length} argument(y), a podano więcej.`);
    }
    return { op: 'call', tok: t, name: t.key, args };
  }

  private body(t: Token): Stmt[] {
    const lb = this.peek();
    if (!lb || lb.kind !== 'lbr') throw fail(lb ?? t, `Oczekiwano „[” rozpoczynającego treść polecenia „${t.text}”.`);
    this.i++;
    this.depth++;
    if (this.depth > MAX_BRACKET_DEPTH) {
      throw fail(lb, `Zbyt wiele zagnieżdżonych nawiasów [ ] (limit ${MAX_BRACKET_DEPTH}).`);
    }
    const stmts = this.block(lb);
    this.i++;
    this.depth--;
    return stmts;
  }

  private cond(t: Token): Cond {
    const first = this.peek();
    if (!first || !this.canStart(first)) throw fail(first ?? t, 'Brakuje warunku.');
    const l = this.expr();
    const op = this.peek();
    if (!op || op.kind !== 'cmp') {
      throw fail(op ?? t, 'W warunku brakuje porównania: =, <, >, <=, >= albo <>.');
    }
    this.i++;
    const rt = this.peek();
    if (!rt || !this.canStart(rt)) throw fail(rt ?? op, 'Brakuje wartości po porównaniu.');
    return { l, op: op.text, r: this.expr(), tok: first };
  }

  private arg(cmd: Token): Arg {
    const t = this.peek();
    if (!t || !this.canStart(t)) throw fail(t ?? cmd, `Brakuje argumentu polecenia „${cmd.text}”.`);
    return { e: this.expr(), tok: t };
  }

  /** Whether a token can begin an expression. */
  private canStart(t: Token): boolean {
    if (t.kind === 'num' || t.kind === 'var' || t.kind === 'lpar') return true;
    if (t.kind === 'op') return t.text === '+' || t.text === '-';
    if (t.kind === 'word') {
      return !(WORDS.has(t.key) || this.defs.has(t.key) || DEFINE_WORDS.has(t.key) || END_WORDS.has(t.key));
    }
    return false;
  }

  /** A binary operator needs whitespace on both sides or on neither side. */
  private isBinary(t: Token | undefined): t is Token {
    return t !== undefined && t.kind === 'op' && t.sp === t.sa;
  }

  private expr(): Expr {
    let l = this.term();
    for (;;) {
      const t = this.peek();
      if (!this.isBinary(t) || (t.text !== '+' && t.text !== '-')) return l;
      this.i++;
      l = { k: 'bin', op: t.text as '+' | '-', l, r: this.term(t) };
    }
  }

  private term(after?: Token): Expr {
    let l = this.unary(after);
    for (;;) {
      const t = this.peek();
      if (!this.isBinary(t) || (t.text !== '*' && t.text !== '/')) return l;
      this.i++;
      l = { k: 'bin', op: t.text as '*' | '/', l, r: this.unary(t) };
    }
  }

  private unary(after?: Token): Expr {
    const t = this.peek();
    if (t && t.kind === 'op' && (t.text === '+' || t.text === '-')) {
      this.i++;
      const e = this.unary(t);
      return t.text === '-' ? { k: 'neg', e } : e;
    }
    return this.operand(after);
  }

  private operand(after?: Token): Expr {
    const t = this.peek();
    if (!t) throw fail(after!, 'Brakuje wartości po operatorze.');
    this.i++;
    if (t.kind === 'num') return { k: 'num', v: t.value };
    if (t.kind === 'var') return { k: 'var', tok: t };
    if (t.kind === 'word' && NRPOWT_WORDS.has(t.key)) return { k: 'rep', tok: t };
    if (t.kind === 'word' && this.canStart(t)) return { k: 'var', tok: t };
    if (t.kind === 'lpar') {
      const e = this.expr();
      const c = this.peek();
      if (!c || c.kind !== 'rpar') throw fail(c ?? t, 'Brakuje „)” zamykającego nawias.');
      this.i++;
      return e;
    }
    this.i--;
    throw fail(t, after ? 'Brakuje wartości po operatorze.' : 'Oczekiwano wartości.');
  }
}

function collectNames(stmts: Stmt[], out: Set<string>): void {
  for (const s of stmts) {
    if (s.op === 'let') out.add(s.name);
    else if (s.op === 'repeat' || s.op === 'if') collectNames(s.body, out);
    else if (s.op === 'ifelse') {
      collectNames(s.body, out);
      collectNames(s.elseBody, out);
    }
  }
}

function checkExpr(e: Expr, scope: Set<string>, inRep: boolean): void {
  switch (e.k) {
    case 'num':
      return;
    case 'var':
      if (!scope.has(e.tok.key)) {
        throw fail(
          e.tok,
          `Nieznana nazwa „${e.tok.text}”: użyj parametru procedury albo najpierw przypisz zmienną poleceniem „niech”.`,
        );
      }
      return;
    case 'rep':
      if (!inRep) throw fail(e.tok, '„nrpowt” można użyć tylko wewnątrz powtórzenia.');
      return;
    case 'neg':
      return checkExpr(e.e, scope, inRep);
    case 'bin':
      checkExpr(e.l, scope, inRep);
      checkExpr(e.r, scope, inRep);
  }
}

/** Literal arguments (no names) are checked before anything runs. */
function checkLiteral(arg: Arg, ok: (v: number) => boolean, message: string): void {
  if (!isConstant(arg.e)) return;
  const v = evaluate(arg.e, { get: () => undefined, rep: undefined }, arg.tok);
  if (!ok(v)) throw fail(arg.tok, message);
}

const isInt = (v: number, lo: number, hi: number) => Number.isInteger(v) && v >= lo && v <= hi;

function checkBlock(stmts: Stmt[], scope: Set<string>, inRep: boolean, mode: Mode): void {
  for (const s of stmts) {
    if (s.op === 'color' || s.op === 'pu' || s.op === 'pd' || s.op === 'home' || s.op === 'cs' || s.op === 'stop') {
      continue;
    }
    if (s.op === 'let') {
      checkExpr(s.value.e, scope, inRep);
    } else if (s.op === 'repeat') {
      checkExpr(s.count.e, scope, inRep);
      checkLiteral(s.count, (v) => isInt(v, 0, MAX_REPEAT), `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${MAX_REPEAT}.`);
      checkBlock(s.body, scope, true, mode);
    } else if (s.op === 'if') {
      checkExpr(s.cond.l, scope, inRep);
      checkExpr(s.cond.r, scope, inRep);
      checkBlock(s.body, scope, inRep, mode);
    } else if (s.op === 'ifelse') {
      checkExpr(s.cond.l, scope, inRep);
      checkExpr(s.cond.r, scope, inRep);
      checkBlock(s.body, scope, inRep, mode);
      checkBlock(s.elseBody, scope, inRep, mode);
    } else if (s.op === 'call') {
      s.args.forEach((a) => checkExpr(a.e, scope, inRep));
    } else {
      if (DIM3_OPS.has(s.op) && mode === '2d') {
        throw fail(s.tok, `Polecenie „${s.tok.text}” działa tylko w trybie 3D.`);
      }
      if (!('args' in s)) continue;
      for (const a of s.args) checkExpr(a.e, scope, inRep);
      if (s.op === 'width') {
        s.args.forEach((a) =>
          checkLiteral(a, (v) => isInt(v, 1, MAX_WIDTH), `Grubość linii musi być liczbą całkowitą od 1 do ${MAX_WIDTH}.`),
        );
      }
    }
  }
}

/** Checks names, `nrpowt`, literal ranges and mode restrictions; reports the first problem in source order. */
function validate(prog: Program): void {
  const problems: LogoError[] = [];
  const attempt = (fn: () => void) => {
    try {
      fn();
    } catch (e) {
      if (e instanceof LogoError) problems.push(e);
      else throw e;
    }
  };

  const topNames = new Set<string>();
  collectNames(prog.top, topNames);
  attempt(() => checkBlock(prog.top, topNames, false, prog.mode));

  for (const proc of prog.procs.values()) {
    const scope = new Set(topNames);
    for (const p of proc.params) scope.add(p.key);
    collectNames(proc.body, scope);
    attempt(() => checkBlock(proc.body, scope, false, prog.mode));
  }

  if (problems.length) {
    problems.sort((a, b) => a.line - b.line || a.column - b.column);
    throw problems[0];
  }
}

/** Parses and validates a whole program. Throws LogoError on the first problem. */
export function parse(source: string, mode: Mode): Program {
  const toks = tokenize(source);
  const defs = scanDefinitions(toks);
  const procs = new Map<string, Proc>();
  const top = new Parser(toks, defs, procs).block(null);
  const prog: Program = { top, procs, mode };
  validate(prog);
  return prog;
}
