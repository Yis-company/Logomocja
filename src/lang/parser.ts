import type { Arg, CmpOp, Cond, Expr, Mode, Proc, Program, Stmt } from './ast';
import { LogoError } from './errors';
import { DISPLAY, type Keyword } from './keywords';
import { lex, type Token } from './lexer';
import { evalConst, EvalFailure, evalFailureMessage } from './evaluate';

export const MAX_NESTING = 32;
export const MAX_WIDTH = 12;
export const MAX_REPEAT = 10_000;

interface ProcScope {
  name: string;
  display: string;
  params: Set<string>;
  locals: Set<string>;
}

interface Ctx {
  proc: ProcScope | null;
  repeatDepth: number;
  bracketDepth: number;
}

interface Header {
  name: string;
  arity: number;
  params: string[];
}

const isJuz = (t: Token | undefined) => !!t && t.type === 'word' && !t.colon && t.kw === 'juz';
const isOto = (t: Token | undefined) => !!t && t.type === 'word' && !t.colon && t.kw === 'oto';
const isAloneJuz = (t: Token | undefined) => isJuz(t) && t!.firstOnLine && t!.lastOnLine;

/** Parses and validates a whole program. Throws LogoError on the first problem. */
export function parse(source: string, mode: Mode): Program {
  const toks = lex(source);
  return new Parser(toks, mode).program();
}

class Parser {
  private i = 0;
  private end: number;
  private endTok: Token | null = null;
  private ctx: Ctx = { proc: null, repeatDepth: 0, bracketDepth: 0 };
  private readonly headers = new Map<string, Header>();
  private readonly globals = new Set<string>();
  private readonly procs = new Map<string, Proc>();
  private readonly uses: Program['uses'] = new Set();
  private readonly callGraph = new Map<string, Set<string>>();
  private lastStmt: Stmt | null = null;

  constructor(private readonly toks: Token[], private readonly mode: Mode) {
    this.end = toks.length;
    this.prescan();
  }

  // ---------------------------------------------------------------- prescan

  /** Collects procedure names and arities and the names assigned at top level. */
  private prescan() {
    const t = this.toks;
    let i = 0;
    while (i < t.length) {
      const tok = t[i];
      if (isOto(tok) && tok.firstOnLine) {
        const h = this.readHeaderLoose(i);
        if (h && !this.headers.has(h.name)) this.headers.set(h.name, h);
        let j = i + 1;
        while (j < t.length && !isAloneJuz(t[j])) j++;
        i = j + 1;
        continue;
      }
      if (tok.type === 'word' && !tok.colon && tok.kw === 'niech') {
        const nx = t[i + 1];
        if (nx && nx.type === 'word' && !nx.kw) this.globals.add(nx.name!);
      }
      i++;
    }
  }

  private readHeaderLoose(i: number): Header | null {
    const t = this.toks;
    const oto = t[i];
    const nameTok = t[i + 1];
    if (!nameTok || nameTok.line !== oto.line || nameTok.type !== 'word' || nameTok.kw || nameTok.colon) return null;
    const params: string[] = [];
    let j = i + 2;
    if (t[j] && t[j].line === oto.line && t[j].type === 'ma') {
      j++;
      while (t[j] && t[j].line === oto.line) {
        if (t[j].type === 'word') params.push(t[j].name!);
        j++;
      }
    } else {
      while (t[j] && t[j].line === oto.line && t[j].type === 'word' && t[j].colon) {
        params.push(t[j].name!);
        j++;
      }
    }
    return { name: nameTok.name!, arity: params.length, params };
  }

  // ---------------------------------------------------------------- helpers

  private peek(): Token | null {
    return this.i < this.end ? this.toks[this.i] : null;
  }

  private next(): Token {
    return this.toks[this.i++];
  }

  /** Where a missing piece is reported: the token found there, or the command at the end of the program. */
  private missingAt(cmd: Token): Token {
    return this.peek() ?? this.endTok ?? cmd;
  }

  private fail(message: string, at: Token): never {
    throw new LogoError(message, at);
  }

  private quote(t: Token) {
    return `„${t.text}”`;
  }

  // ---------------------------------------------------------------- program

  program(): Program {
    const body: Stmt[] = [];
    while (this.peek()) {
      const t = this.peek()!;
      if (isOto(t)) {
        this.definition();
        this.lastStmt = null;
        continue;
      }
      body.push(this.statement());
    }
    if (this.procs.size) {
      // a procedure is "used" when something calls it
      for (const callees of this.callGraph.values()) if (callees.size) this.uses.add('procedure');
      if (this.hasRecursion()) this.uses.add('recursion');
    }
    return { mode: this.mode, body, procs: this.procs, uses: this.uses };
  }

  private hasRecursion(): boolean {
    const g = this.callGraph;
    const state = new Map<string, number>();
    const visit = (n: string): boolean => {
      state.set(n, 1);
      for (const m of g.get(n) ?? []) {
        if (state.get(m) === 1) return true;
        if (!state.has(m) && visit(m)) return true;
      }
      state.set(n, 2);
      return false;
    };
    for (const n of this.procs.keys()) if (!state.has(n) && visit(n)) return true;
    return false;
  }

  private definition() {
    const oto = this.next();
    if (!oto.firstOnLine) {
      this.fail(`Definicja procedury (${this.quote(oto)}) musi zaczynać się na początku wiersza.`, oto);
    }
    const nameTok = this.peek();
    if (!nameTok || nameTok.line !== oto.line) {
      this.fail(`Po ${this.quote(oto)} napisz w tym samym wierszu nazwę procedury, np. oto kwadrat ma: bok.`, oto);
    }
    if (nameTok.type !== 'word' || nameTok.colon) {
      this.fail(`${this.quote(nameTok)} nie może być nazwą procedury. Nazwa składa się z liter, cyfr i podkreśleń, np. kwadrat.`, nameTok);
    }
    if (nameTok.kw) {
      this.fail(`${this.quote(nameTok)} to polecenie języka, więc nie może być nazwą procedury.`, nameTok);
    }
    const name = nameTok.name!;
    const prior = this.procs.get(name);
    if (prior) {
      this.fail(`Procedura ${this.quote(nameTok)} jest już zdefiniowana w wierszu ${prior.tok.line}. Każda nazwa może być zdefiniowana tylko raz.`, nameTok);
    }
    this.next();

    const params: string[] = [];
    const seen = new Map<string, Token>();
    const addParam = (p: Token) => {
      if (p.type !== 'word') {
        this.fail(`${this.quote(p)} nie może być nazwą parametru. Wypisz parametry po przecinku, np. ma: bok, kąt.`, p);
      }
      if (p.kw && !p.colon) this.fail(`${this.quote(p)} to polecenie języka, więc nie może być nazwą parametru.`, p);
      if (p.colon && p.kw) this.fail(`${this.quote(p)} to polecenie języka, więc nie może być nazwą parametru.`, p);
      if (seen.has(p.name!)) this.fail(`Parametr ${this.quote(p)} występuje dwa razy w nagłówku procedury.`, p);
      seen.set(p.name!, p);
      params.push(p.name!);
    };
    const onLine = () => {
      const p = this.peek();
      return p && p.line === oto.line ? p : null;
    };

    const maybeMa = onLine();
    if (maybeMa && maybeMa.type === 'ma') {
      this.next();
      const first = onLine();
      if (!first) this.fail(`Po ${this.quote(maybeMa)} wypisz parametry, np. ma: bok, kąt.`, maybeMa);
      addParam(this.next());
      while (onLine() && onLine()!.type === 'comma') {
        const comma = this.next();
        const p = onLine();
        if (!p) this.fail('Po przecinku brakuje nazwy parametru.', comma);
        addParam(this.next());
      }
    } else {
      while (onLine() && onLine()!.type === 'word' && onLine()!.colon) addParam(this.next());
    }
    const extra = onLine();
    if (extra) {
      if (extra.type === 'word' && !extra.colon && !extra.kw && params.length === 0) {
        this.fail(`Parametry wypisz po „ma:”, np. oto ${nameTok.text} ma: ${extra.text}. Treść procedury zacznij od nowego wiersza.`, extra);
      }
      if (extra.type === 'comma' || (extra.type === 'word' && !extra.colon && !extra.kw)) {
        this.fail(`Parametry oddzielaj przecinkami, np. ma: bok, kąt.`, extra);
      }
      this.fail(`Nieoczekiwane ${this.quote(extra)} w nagłówku procedury. Treść procedury zacznij od nowego wiersza.`, extra);
    }

    // the body ends at the first "już" standing alone on its line
    let j = this.i;
    while (j < this.toks.length && !isAloneJuz(this.toks[j])) j++;
    const found = j < this.toks.length;

    const locals = new Set<string>();
    for (let k = this.i; k < j; k++) {
      const t = this.toks[k];
      const nx = this.toks[k + 1];
      if (t.type === 'word' && !t.colon && t.kw === 'niech' && nx && nx.type === 'word' && !nx.kw && k + 1 < j) {
        locals.add(nx.name!);
      }
    }

    const scope: ProcScope = { name, display: nameTok.text, params: new Set(params), locals };
    const proc: Proc = { name, display: nameTok.text, params, body: [], tok: nameTok };
    this.procs.set(name, proc);
    this.callGraph.set(name, new Set());

    const saved = { end: this.end, endTok: this.endTok, ctx: this.ctx };
    this.end = j;
    this.endTok = found ? this.toks[j] : null;
    this.ctx = { proc: scope, repeatDepth: 0, bracketDepth: 0 };
    this.lastStmt = null;
    while (this.peek()) {
      const t = this.peek()!;
      if (isOto(t)) {
        this.fail(
          `Procedury nie można definiować wewnątrz innej procedury. Czy brakuje „już” na końcu procedury ${this.quote(nameTok)}?`,
          t,
        );
      }
      proc.body.push(this.statement());
    }
    if (!found) {
      this.fail(`Brakuje „już” na końcu procedury ${this.quote(nameTok)}. Napisz „już” sam w osobnym wierszu.`, oto);
    }
    this.end = saved.end;
    this.endTok = saved.endTok;
    this.ctx = saved.ctx;
    this.i = j + 1;
  }

  // ---------------------------------------------------------------- statements

  private statement(): Stmt {
    const stmt = this.statementInner();
    this.lastStmt = stmt;
    return stmt;
  }

  private statementInner(): Stmt {
    const t = this.next();
    if (t.type === 'word' && !t.colon) {
      const kw = t.kw;
      if (kw) return this.command(kw, t);
      const header = this.headers.get(t.name!);
      if (header) return this.call(t, header);
      this.unknownCommand(t);
    }
    switch (t.type) {
      case 'rbr':
        this.fail('Nadmiarowy nawias „]” — nie ma do niego pasującego „[”.', t);
      case 'lbr':
        this.fail('Nawias „[” może otwierać tylko treść polecenia powtórz, jeśli albo jeżeli.', t);
      case 'rpar':
        this.fail('Nadmiarowy nawias „)” — nie ma do niego pasującego „(”.', t);
      default:
        this.strayValue(t);
    }
  }

  private strayValue(t: Token): never {
    let text = t.text;
    const nx = this.peek();
    if (t.type === 'op' && nx && !t.spaceAfter && (nx.type === 'num' || nx.type === 'word' || nx.type === 'lpar')) {
      text = t.text + nx.text;
    }
    let msg = `Nieoczekiwana wartość „${text}” — w tym miejscu powinno stać polecenie.`;
    if (t.type === 'op' && t.spaceBefore && !t.spaceAfter) {
      msg += ` Jeśli to działanie, postaw spacje po obu stronach znaku „${t.text}” albo nie stawiaj żadnej, np. 10 ${t.text} 5.`;
    } else if (t.type === 'op' && !t.spaceBefore && t.spaceAfter) {
      msg += ` Jeśli to działanie, postaw spacje po obu stronach znaku „${t.text}”, np. 10 ${t.text} 5.`;
    } else if (this.lastStmt && this.lastStmt.k === 'call') {
      const h = this.headers.get(this.lastStmt.name)!;
      msg += ` Procedura „${this.lastStmt.tok.text}” przyjmuje ${h.arity} ${argWord(h.arity)}.`;
    } else if (this.lastStmt && hasSingleArg(this.lastStmt)) {
      msg += ` Polecenie „${this.lastStmt.tok.text}” przyjmuje jedną wartość.`;
    }
    this.fail(msg, t);
  }

  private unknownCommand(t: Token): never {
    const name = t.name!;
    if (this.isDeclared(name)) {
      this.fail(`„${t.text}” to wartość, a w tym miejscu powinno stać polecenie.`, t);
    }
    const lower = name;
    if (lower === 'nan' || lower === 'infinity') {
      this.fail(`„${t.text}” nie jest poleceniem ani liczbą.`, t);
    }
    const suggestion = suggest(lower, [...Object.values(DISPLAY), ...[...this.headers.values()].map((h) => h.name)]);
    let msg = `Nieznane polecenie „${t.text}”.`;
    if (suggestion) msg += ` Czy chodziło o „${suggestion}”?`;
    else msg += ' Spis poleceń znajdziesz w zakładce Pomoc.';
    this.fail(msg, t);
  }

  private command(kw: Keyword, t: Token): Stmt {
    switch (kw) {
      case 'np':
      case 'ws':
        return { k: 'move', sign: kw === 'np' ? 1 : -1, arg: this.arg(t, 'odległości, np. ' + t.text + ' 100'), tok: t };
      case 'pw':
      case 'lw':
        return { k: 'turn', axis: 'yaw', sign: kw === 'pw' ? 1 : -1, arg: this.arg(t, 'kąta w stopniach, np. ' + t.text + ' 90'), tok: t };
      case 'gora':
      case 'dol':
      case 'pp':
      case 'pl': {
        if (this.mode === '2d') {
          this.fail(`Polecenie „${t.text}” działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`, t);
        }
        const axis = kw === 'gora' || kw === 'dol' ? 'pitch' : 'roll';
        const sign = kw === 'gora' || kw === 'pp' ? 1 : -1;
        return { k: 'turn', axis, sign, arg: this.arg(t, 'kąta w stopniach, np. ' + t.text + ' 90'), tok: t };
      }
      case 'pod':
      case 'opu':
        return { k: 'pen', down: kw === 'opu', tok: t };
      case 'stop':
        return { k: 'stop', tok: t };
      case 'dom':
        return { k: 'home', tok: t };
      case 'czysc':
        return { k: 'clear', tok: t };
      case 'kolor': {
        const c = this.peek();
        if (!c || c.type !== 'str') {
          const at = this.missingAt(t);
          this.fail(`Polecenie „${t.text}” potrzebuje koloru w cudzysłowie, np. kolor "#16866a".`, at);
        }
        this.next();
        const v = String(c.value);
        if (!/^#[0-9a-fA-F]{6}$/.test(v)) {
          this.fail(`Niepoprawny kolor ${c.text}. Zapisz go jako # i sześć cyfr szesnastkowych (0–9, a–f), np. "#16866a".`, c);
        }
        return { k: 'color', color: v.toLowerCase(), tok: t };
      }
      case 'grubosc': {
        const arg = this.arg(t, `grubości od 1 do ${MAX_WIDTH}, np. ${t.text} 3`);
        if (arg.constant) checkWidth(this.constValue(arg), arg, 'parse');
        return { k: 'width', arg, tok: t };
      }
      case 'powtorz': {
        const count = this.arg(t, `liczby powtórzeń, np. ${t.text} 4 [np 100 pw 90]`);
        if (count.constant) checkRepeat(this.constValue(count), count, 'parse');
        this.uses.add('repeat');
        this.ctx.repeatDepth++;
        const { body, close } = this.block(t, `liczbie powtórzeń`);
        this.ctx.repeatDepth--;
        return { k: 'repeat', count, body, tok: t, close };
      }
      case 'niech': {
        const nameTok = this.peek();
        if (!nameTok || nameTok.type !== 'word') {
          this.fail(`Po „${t.text}” podaj nazwę zmiennej i wartość, np. niech bok 50.`, this.missingAt(t));
        }
        if (nameTok.kw) {
          this.fail(`„${nameTok.text}” to polecenie języka, więc nie może być nazwą zmiennej.`, nameTok);
        }
        if (this.headers.has(nameTok.name!)) {
          this.fail(`„${nameTok.text}” to nazwa procedury. Zmienna musi mieć inną nazwę.`, nameTok);
        }
        this.next();
        const arg = this.arg(t, `wartości, np. niech ${nameTok.text} 50`);
        this.uses.add('variable');
        return { k: 'let', name: nameTok.name!, arg, tok: t };
      }
      case 'jesli': {
        const cond = this.cond(t);
        this.uses.add('if');
        const { body } = this.block(t, 'warunku');
        return { k: 'if', cond, body, tok: t };
      }
      case 'jezeli': {
        const cond = this.cond(t);
        this.uses.add('if');
        const { body } = this.block(t, 'warunku');
        const { body: elseBody } = this.block(t, 'pierwszym bloku', true);
        return { k: 'ifelse', cond, body, elseBody, tok: t };
      }
      case 'nrpowt':
        this.strayValue(t);
      case 'oto':
        this.fail('Procedury definiuje się tylko na najwyższym poziomie programu, nie wewnątrz nawiasów ani innej procedury.', t);
      case 'juz':
        if (this.ctx.proc) this.fail('„już” musi stać sam w osobnym wierszu.', t);
        this.fail('„już” kończy procedurę, ale tutaj nie zaczęto żadnej. Procedurę zaczyna „oto”.', t);
    }
  }

  private call(t: Token, header: Header): Stmt {
    const args: Arg[] = [];
    for (let k = 0; k < header.arity; k++) {
      const p = this.peek();
      if (!p || !canStartOperand(p)) {
        const given = k;
        this.fail(
          `Procedura „${t.text}” potrzebuje ${header.arity} ${argWord(header.arity)} (${header.params.join(', ')}), a podano ${given}.`,
          this.missingAt(t),
        );
      }
      args.push(this.argExpr());
    }
    const caller = this.ctx.proc?.name ?? '';
    if (caller) this.callGraph.get(caller)!.add(header.name);
    else this.callGraph.set('', (this.callGraph.get('') ?? new Set()).add(header.name));
    return { k: 'call', name: header.name, args, tok: t };
  }

  private block(cmd: Token, after: string, second = false): { body: Stmt[]; close: Token } {
    const open = this.peek();
    if (!open || open.type !== 'lbr') {
      const msg = second
        ? `Polecenie „${cmd.text}” potrzebuje dwóch bloków: [ gdy warunek jest spełniony ] [ gdy nie jest ].`
        : `Po ${after} otwórz nawias „[” z poleceniami, np. [np 50 pw 90].`;
      this.fail(msg, this.missingAt(cmd));
    }
    this.next();
    if (this.ctx.bracketDepth + 1 > MAX_NESTING) {
      this.fail(`Za głębokie zagnieżdżenie nawiasów [ ]: limit to ${MAX_NESTING} poziomy.`, open);
    }
    this.ctx.bracketDepth++;
    const body: Stmt[] = [];
    const savedLast = this.lastStmt;
    this.lastStmt = null;
    for (;;) {
      const p = this.peek();
      if (!p) this.fail('Ten nawias „[” nie ma pasującego „]”.', open);
      if (p.type === 'rbr') break;
      if (isOto(p)) {
        this.fail('Procedury definiuje się tylko na najwyższym poziomie programu, nie wewnątrz nawiasów [ ].', p);
      }
      body.push(this.statement());
    }
    const close = this.next();
    this.ctx.bracketDepth--;
    this.lastStmt = savedLast;
    return { body, close };
  }

  private cond(cmd: Token): Cond {
    const a = this.arg(cmd, 'warunku, np. jeśli bok > 10 [...]');
    const t = this.peek();
    if (!t || t.type !== 'cmp') {
      this.fail('W warunku brakuje porównania: <, >, =, <=, >= albo <>.', this.missingAt(cmd));
    }
    this.next();
    const b = this.arg(cmd, '', `Po znaku „${t.text}” brakuje wartości do porównania.`);
    return { a, op: t.text as CmpOp, b, first: a.first };
  }

  // ---------------------------------------------------------------- expressions

  private arg(cmd: Token, what: string, custom?: string): Arg {
    const p = this.peek();
    if (!p || !canStartOperand(p)) {
      let msg = custom ?? `Polecenie „${cmd.text}” potrzebuje ${what}.`;
      if (p && p.type === 'word' && p.kw && !p.colon && !custom) msg += ` Zamiast wartości jest polecenie „${p.text}”.`;
      this.fail(msg, this.missingAt(cmd));
    }
    return this.argExpr();
  }

  private constantFlag = true;

  private argExpr(): Arg {
    const first = this.peek()!;
    const saved = this.constantFlag;
    this.constantFlag = true;
    const e = this.sum();
    const constant = this.constantFlag;
    this.constantFlag = saved && constant;
    return { e, first, constant };
  }

  private constValue(arg: Arg): number {
    try {
      return evalConst(arg.e);
    } catch (err) {
      if (err instanceof EvalFailure) throw new LogoError(evalFailureMessage(err), arg.first, 'parse');
      throw err;
    }
  }

  private isBinaryOp(t: Token | null, ops: string): t is Token {
    return !!t && t.type === 'op' && ops.includes(t.text) && t.spaceBefore === t.spaceAfter;
  }

  private sum(): Expr {
    let a = this.term();
    for (;;) {
      const t = this.peek();
      if (!this.isBinaryOp(t, '+-')) return a;
      this.next();
      const b = this.term(t);
      a = { k: 'bin', op: t.text as '+' | '-', a, b, tok: t };
    }
  }

  private term(after?: Token): Expr {
    let a = this.unary(after);
    for (;;) {
      const t = this.peek();
      if (!this.isBinaryOp(t, '*/')) return a;
      this.next();
      const b = this.unary(t);
      a = { k: 'bin', op: t.text as '*' | '/', a, b, tok: t };
    }
  }

  private unary(after?: Token): Expr {
    // iterative so long chains of signs cannot exhaust the stack
    const signs: Token[] = [];
    let p = this.peek();
    while (p && p.type === 'op' && (p.text === '-' || p.text === '+')) {
      signs.push(this.next());
      p = this.peek();
    }
    let e = this.primary(signs[signs.length - 1] ?? after);
    for (let k = signs.length - 1; k >= 0; k--) {
      if (signs[k].text === '-') e = { k: 'neg', e, tok: signs[k] };
    }
    return e;
  }

  private primary(after?: Token): Expr {
    const t = this.peek();
    if (!t || !canStartPrimary(t)) {
      const at = t ?? this.endTok ?? after!;
      if (after && after.type === 'op') this.fail(`Po znaku „${after.text}” brakuje liczby albo nazwy.`, at);
      if (after && after.type === 'lpar') this.fail('Po nawiasie „(” brakuje liczby albo nazwy.', at);
      this.fail('Brakuje liczby albo nazwy.', at);
    }
    this.next();
    switch (t.type) {
      case 'num':
        return { k: 'num', v: t.value as number, tok: t };
      case 'lpar': {
        const e = this.sum();
        const c = this.peek();
        if (c && c.type === 'rpar') {
          this.next();
          return e;
        }
        if (!c || c.type === 'rbr' || c.type === 'lbr' || (c.type === 'word' && c.kw && !c.colon) || c.type === 'cmp') {
          this.fail('Ten nawias „(” nie ma pasującego „)”.', t);
        }
        let msg = `Oczekiwano „)”, a jest „${c.text}”.`;
        if (c.type === 'op') msg += ` Działanie zapisz ze spacjami po obu stronach znaku albo bez żadnej, np. 10 ${c.text} 5.`;
        this.fail(msg, c);
      }
      case 'word': {
        if (t.kw === 'nrpowt' && !t.colon) {
          if (this.ctx.repeatDepth === 0) {
            this.fail(
              this.ctx.proc
                ? `„${t.text}” działa tylko wewnątrz powtórz zapisanego w tej samej procedurze.`
                : `„${t.text}” działa tylko wewnątrz nawiasów polecenia powtórz.`,
              t,
            );
          }
          this.constantFlag = false;
          this.uses.add('nrpowt');
          return { k: 'rep', tok: t };
        }
        const name = t.name!;
        if (t.kw && t.colon) this.fail(`„${t.text}” to polecenie języka, a nie nazwa wartości.`, t);
        if (!this.isDeclared(name)) this.unknownName(t);
        this.constantFlag = false;
        return { k: 'var', name, tok: t };
      }
    }
    throw new Error('unreachable');
  }

  private isDeclared(name: string) {
    const p = this.ctx.proc;
    if (p && (p.params.has(name) || p.locals.has(name))) return true;
    return this.globals.has(name);
  }

  private unknownName(t: Token): never {
    const name = t.name!;
    if (name === 'nan' || name === 'infinity') {
      this.fail(`„${t.text}” nie jest liczbą. Liczby zapisuj cyframi, np. 80 albo 12.5.`, t);
    }
    if (this.headers.has(name) && !this.isDeclared(name)) {
      this.fail(`„${t.text}” to procedura — nie ma wartości, której można tu użyć.`, t);
    }
    const p = this.ctx.proc;
    const known = [...this.globals, ...(p ? [...p.params, ...p.locals] : [])];
    const s = suggest(name, known);
    let msg = p
      ? `Nieznana nazwa „${t.text}”: nie jest parametrem procedury „${p.display}” ani zmienną.`
      : `Nieznana nazwa „${t.text}”. Najpierw nadaj jej wartość, np. niech ${t.text.replace(/^:/, '')} 10.`;
    if (s) msg += ` Czy chodziło o „${s}”?`;
    this.fail(msg, t);
  }
}

function canStartPrimary(t: Token) {
  if (t.type === 'num' || t.type === 'lpar') return true;
  if (t.type === 'word') return t.colon || !t.kw || t.kw === 'nrpowt';
  return false;
}

function canStartOperand(t: Token) {
  return canStartPrimary(t) || (t.type === 'op' && (t.text === '-' || t.text === '+'));
}

function hasSingleArg(s: Stmt) {
  return s.k === 'move' || s.k === 'turn' || s.k === 'width' || s.k === 'let';
}

function argWord(n: number) {
  if (n === 1) return 'argument';
  const d = n % 10;
  const dd = n % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return 'argumenty';
  return 'argumentów';
}

export function checkWidth(v: number, arg: Arg, kind: 'parse' | 'runtime') {
  if (!Number.isInteger(v) || v < 1 || v > MAX_WIDTH) {
    throw new LogoError(
      `Grubość musi być liczbą całkowitą od 1 do ${MAX_WIDTH}, a jest ${fmt(v)}.`,
      arg.first,
      kind,
    );
  }
}

export function checkRepeat(v: number, arg: Arg, kind: 'parse' | 'runtime') {
  if (!Number.isInteger(v) || v < 0 || v > MAX_REPEAT) {
    throw new LogoError(
      `Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000, a jest ${fmt(v)}.`,
      arg.first,
      kind,
    );
  }
}

function fmt(v: number) {
  return Number.isInteger(v) ? String(v) : String(Math.round(v * 10000) / 10000).replace('.', ',');
}

function suggest(word: string, candidates: string[]): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  const limit = word.length <= 3 ? 1 : 2;
  for (const c of new Set(candidates)) {
    const d = levenshtein(word, c);
    if (d < bestD && d <= limit && d > 0) {
      best = c;
      bestD = d;
    }
  }
  return best;
}

function levenshtein(a: string, b: string): number {
  const strip = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').replace(/ł/g, 'l');
  if (strip(a) === strip(b)) return 0.5;
  const m = a.length;
  const n = b.length;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
