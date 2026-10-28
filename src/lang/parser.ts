import {
  type CmpOp,
  type Condition,
  type Expr,
  LogoError,
  type ProcDef,
  type Program,
  type Stmt,
} from './ast';
import { constantValue } from './expr';
import {
  COMMAND_TABLE,
  type Mode,
  RESERVED,
  isDefClose,
  isDefOpen,
  isRepcount,
} from './keywords';
import { MAX_SOURCE_CHARS, type Token, tokenize } from './lexer';

export const MAX_BRACKET_DEPTH = 32;
const MAX_PAREN_DEPTH = 256;
export const MAX_WIDTH = 12;
export const MAX_REPEAT = 10_000;

interface Header {
  oto: Token;
  nameTok: Token;
  params: Token[];
  /** Indeks pierwszego tokenu po nagłówku. */
  end: number;
}

interface ProcScope {
  name: string;
  params: Set<string>;
  assigned: Set<string>;
}

interface Ref {
  name: string;
  tok: Token;
  scope: ProcScope | null;
}

interface Ctx {
  scope: ProcScope | null;
  /** Ile powtórz otacza bieżące miejsce (leksykalnie, w obrębie procedury). */
  repDepth: number;
  /** Głębokość nawiasów kwadratowych. */
  depth: number;
}

function q(tok: Token): string {
  return tok.kind === 'eof' ? 'koniec programu' : `„${tok.text}”`;
}

function errAt(tok: { line: number; col: number }, message: string): LogoError {
  return new LogoError(message, tok.line, tok.col);
}

/** Miejsce tuż za tokenem (np. gdzie powinien być brakujący element w wierszu). */
function after(tok: Token): { line: number; col: number } {
  return { line: tok.line, col: tok.col + tok.text.length };
}

export function parse(source: string, mode: Mode): Program {
  if (source.length > MAX_SOURCE_CHARS) {
    throw new LogoError(
      `Program jest za długi: ${source.length} znaków (limit to ${MAX_SOURCE_CHARS})`,
      1,
      1,
    );
  }
  return new Parser(tokenize(source), mode).parseProgram();
}

class Parser {
  private pos = 0;
  private headers = new Map<string, Header | LogoError>();
  private procs = new Map<string, ProcDef>();
  private topVars = new Set<string>();
  private refs: Ref[] = [];
  private parenDepth = 0;

  constructor(
    private toks: Token[],
    private mode: Mode,
  ) {}

  // ───────────────────────── pomocnicze ─────────────────────────

  private peek(): Token {
    return this.toks[this.pos];
  }
  private next(): Token {
    const t = this.toks[this.pos];
    if (t.kind !== 'eof') this.pos++;
    return t;
  }

  private checkLexError(t: Token): void {
    if (t.kind === 'error') throw errAt(t, t.message ?? 'Błąd składni');
  }

  // ───────────────────────── nagłówki procedur ─────────────────────────

  private scanHeaders(): void {
    for (let i = 0; i < this.toks.length; i++) {
      const t = this.toks[i];
      if (t.kind !== 'ident' || !isDefOpen(t.value as string) || !t.firstOnLine) continue;
      try {
        const h = this.parseHeader(i);
        const name = h.nameTok.value as string;
        if (!this.headers.has(name)) this.headers.set(name, h);
        i = h.end - 1;
      } catch (e) {
        if (!(e instanceof LogoError)) throw e;
        const nameTok = this.toks[i + 1];
        if (nameTok && nameTok.kind === 'ident' && nameTok.line === t.line) {
          const name = nameTok.value as string;
          if (!this.headers.has(name)) this.headers.set(name, e);
        }
      }
    }
  }

  private parseHeader(idx: number): Header {
    const toks = this.toks;
    const oto = toks[idx];
    const nameTok = toks[idx + 1];
    if (nameTok.kind === 'error') throw errAt(nameTok, nameTok.message ?? 'Błąd składni');
    if (nameTok.kind !== 'ident' || nameTok.line !== oto.line) {
      throw errAt(
        nameTok.kind === 'eof' || nameTok.line !== oto.line ? oto : nameTok,
        `Po „${oto.text}” oczekiwano nazwy procedury`,
      );
    }
    const params: Token[] = [];
    let i = idx + 2;
    const sameLine = (t: Token) => t.kind !== 'eof' && t.line === oto.line;
    const t0 = toks[i];
    const t1 = toks[i + 1];

    const isMa =
      sameLine(t0) &&
      t0.kind === 'ident' &&
      t0.value === 'ma' &&
      sameLine(t1) &&
      (t1.kind === 'colon' || (t1.kind === 'cname' && t1.start === t0.end));

    if (isMa) {
      let last: Token = t0;
      if (t1.kind === 'colon') {
        i += 2;
        last = t1;
      } else {
        i += 1; // dwukropek jest częścią tokenu :nazwa – obsłuży go pętla poniżej
        last = t0;
      }
      for (;;) {
        const p = toks[i];
        if (!sameLine(p)) {
          throw errAt(after(last), 'Po „ma:” oczekiwano nazwy parametru');
        }
        if (p.kind === 'error') throw errAt(p, p.message ?? 'Błąd składni');
        if (p.kind !== 'ident' && p.kind !== 'cname') {
          throw errAt(p, `Oczekiwano nazwy parametru, a jest ${q(p)}`);
        }
        params.push(p);
        i++;
        last = p;
        const sep = toks[i];
        if (!sameLine(sep)) break;
        if (sep.kind !== 'comma') {
          throw errAt(sep, `Parametry oddziela się przecinkami, a jest ${q(sep)}`);
        }
        last = sep;
        i++;
      }
    } else {
      while (sameLine(toks[i])) {
        const p = toks[i];
        if (p.kind === 'error') throw errAt(p, p.message ?? 'Błąd składni');
        if (p.kind !== 'cname') {
          throw errAt(
            p,
            `W nagłówku procedury oczekiwano „ma:” z listą parametrów albo parametrów w postaci :nazwa, a jest ${q(p)}`,
          );
        }
        params.push(p);
        i++;
      }
    }
    return { oto, nameTok, params, end: i };
  }

  // ───────────────────────── program ─────────────────────────

  parseProgram(): Program {
    this.scanHeaders();
    const body: Stmt[] = [];
    const ctx: Ctx = { scope: null, repDepth: 0, depth: 0 };
    try {
      for (;;) {
        const t = this.peek();
        if (t.kind === 'eof') break;
        if (t.kind === 'ident' && isDefOpen(t.value as string)) {
          this.parseDefinition();
          continue;
        }
        body.push(this.parseStatement(ctx));
      }
    } catch (e) {
      if (e instanceof LogoError) throw this.earlierNameError(e) ?? e;
      throw e;
    }
    this.resolveRefs();
    return { procs: this.procs, body };
  }

  /**
   * Błąd składni przerywa analizę, zanim poznamy wszystkie przypisania. Jeśli wcześniej w kodzie
   * użyto nazwy, której nie da się już zadeklarować (nie występuje nawet w dalszej części programu),
   * zgłaszamy ten wcześniejszy błąd – błędy powinny być raportowane w kolejności występowania.
   */
  private earlierNameError(syntax: LogoError): LogoError | null {
    const later = new Set<string>();
    for (let i = this.pos; i < this.toks.length - 1; i++) {
      const t = this.toks[i];
      if (t.kind === 'ident' && COMMAND_TABLE.get(t.value as string)?.command === 'let') {
        const n = this.toks[i + 1];
        if (n.kind === 'ident') later.add(n.value as string);
      }
    }
    for (const r of this.refs) {
      if (r.tok.line > syntax.line || (r.tok.line === syntax.line && r.tok.col >= syntax.column)) break;
      const declared = r.scope
        ? r.scope.params.has(r.name) || r.scope.assigned.has(r.name) || this.topVars.has(r.name)
        : this.topVars.has(r.name);
      if (!declared && !later.has(r.name)) return this.nameError(r);
    }
    return null;
  }

  private nameError(r: Ref): LogoError {
    const shown = r.tok.text.replace(/^:/, '');
    return errAt(
      r.tok,
      this.headers.has(r.name)
        ? `„${shown}” jest nazwą procedury, a nie zmienną ani parametrem (czy poprzedniemu poleceniu nie brakuje argumentów?)`
        : `Nieznana nazwa „${shown}”: to nie jest parametr ani zmienna (przypisz ją poleceniem niech)`,
    );
  }

  private resolveRefs(): void {
    for (const r of this.refs) {
      const ok = r.scope
        ? r.scope.params.has(r.name) || r.scope.assigned.has(r.name) || this.topVars.has(r.name)
        : this.topVars.has(r.name);
      if (!ok) throw this.nameError(r);
    }
  }

  private checkNewName(tok: Token, what: string): string {
    const name = tok.value as string;
    if (RESERVED.has(name)) {
      throw errAt(tok, `„${tok.text}” jest słowem zastrzeżonym i nie może być ${what}`);
    }
    return name;
  }

  private parseDefinition(): void {
    const oto = this.peek();
    if (!oto.firstOnLine) {
      throw errAt(oto, `„${oto.text}” musi stać na początku wiersza`);
    }
    const h = this.parseHeader(this.pos);
    this.pos = h.end;
    const name = this.checkNewName(h.nameTok, 'nazwą procedury');
    if (this.procs.has(name)) {
      throw errAt(h.nameTok, `Procedura „${h.nameTok.text}” jest już zdefiniowana`);
    }
    const params: string[] = [];
    for (const p of h.params) {
      const pn = this.checkNewName(p, 'nazwą parametru');
      if (params.includes(pn)) {
        throw errAt(p, `Parametr „${pn}” występuje w nagłówku więcej niż raz`);
      }
      params.push(pn);
    }
    const scope: ProcScope = { name, params: new Set(params), assigned: new Set() };
    const def: ProcDef = { name, params, body: [], tok: oto, nameTok: h.nameTok };
    // Procedura jest widoczna dla samej siebie (rekurencja) – zarejestrowana z góry.
    this.procs.set(name, def);
    const ctx: Ctx = { scope, repDepth: 0, depth: 0 };
    for (;;) {
      const t = this.peek();
      if (t.kind === 'eof') {
        throw errAt(oto, `Brakuje „już” kończącego procedurę „${h.nameTok.text}”`);
      }
      if (t.kind === 'ident') {
        const w = t.value as string;
        if (isDefClose(w)) {
          if (!t.firstOnLine || !t.lastOnLine) {
            throw errAt(t, `„${t.text}” musi stać samo w osobnym wierszu`);
          }
          this.next();
          return;
        }
        if (isDefOpen(w)) {
          throw errAt(
            t,
            `Definicja procedury nie może być wewnątrz innej procedury (brakuje „już” dla „${h.nameTok.text}”?)`,
          );
        }
      }
      def.body.push(this.parseStatement(ctx));
    }
  }

  // ───────────────────────── instrukcje ─────────────────────────

  private parseStatement(ctx: Ctx): Stmt {
    const t = this.next();
    this.checkLexError(t);
    if (t.kind === 'ident') {
      const w = t.value as string;
      const info = COMMAND_TABLE.get(w);
      if (info) return this.parseCommand(t, info.command, ctx);
      if (isDefOpen(w)) {
        throw errAt(t, 'Definicja procedury jest dozwolona tylko na najwyższym poziomie programu');
      }
      if (isDefClose(w)) {
        throw errAt(t, `„${t.text}” nie kończy żadnej procedury (brakuje „oto”)`);
      }
      if (isRepcount(w)) {
        throw errAt(t, `„${t.text}” jest wartością, a nie poleceniem – użyj jej w wyrażeniu`);
      }
      const h = this.headers.get(w);
      if (h) {
        if (h instanceof LogoError) throw h;
        return this.parseCall(t, w, h.params.length, ctx);
      }
      throw errAt(t, `Nieznane polecenie „${t.text}”`);
    }
    switch (t.kind) {
      case 'rbr':
        throw errAt(t, 'Nieoczekiwany nawias „]” – nie ma pasującego „[”');
      case 'rp':
        throw errAt(t, 'Nieoczekiwany nawias „)” – nie ma pasującego „(”');
      case 'lbr':
        throw errAt(t, 'Nieoczekiwany nawias „[” – nawias kwadratowy musi następować po poleceniu');
      case 'eof':
        throw errAt(t, 'Nieoczekiwany koniec programu');
      default:
        throw errAt(
          t,
          `Nieoczekiwane ${q(t)}: w tym miejscu powinno być polecenie (poprzednie polecenie nie przyjmuje więcej argumentów)`,
        );
    }
  }

  private parseCommand(tok: Token, command: string, ctx: Ctx): Stmt {
    const info = COMMAND_TABLE.get(tok.value as string)!;
    if (info.only3d && this.mode === '2d') {
      throw errAt(tok, `Polecenie „${tok.text}” działa tylko w trybie 3D`);
    }
    switch (command) {
      case 'fd':
      case 'bk':
      case 'rt':
      case 'lt':
      case 'pitchup':
      case 'pitchdown':
      case 'rr':
      case 'rl': {
        const arg = this.parseExpr(tok, ctx);
        return { t: 'cmd', op: command, arg, tok };
      }
      case 'pu':
      case 'pd':
      case 'stop':
      case 'home':
      case 'cs':
        return { t: 'cmd', op: command, tok };
      case 'width': {
        const arg = this.parseExpr(tok, ctx);
        const v = constantValue(arg);
        if (v !== undefined && !(Number.isInteger(v) && v >= 1 && v <= MAX_WIDTH)) {
          throw errAt(arg.tok, `Grubość musi być liczbą całkowitą od 1 do ${MAX_WIDTH}`);
        }
        return { t: 'cmd', op: 'width', arg, tok };
      }
      case 'color': {
        const c = this.next();
        this.checkLexError(c);
        if (c.kind !== 'str') {
          throw errAt(
            c.kind === 'eof' ? tok : c,
            c.kind === 'eof'
              ? `Brakuje koloru po „${tok.text}” (np. „#16866a”)`
              : `Po „${tok.text}” oczekiwano koloru w cudzysłowie, np. "#16866a", a jest ${q(c)}`,
          );
        }
        if (!/^#[0-9a-fA-F]{6}$/.test(c.value as string)) {
          throw errAt(c, `Niepoprawny kolor ${c.text}: oczekiwano zapisu "#rrggbb" (sześć cyfr szesnastkowych)`);
        }
        return { t: 'cmd', op: 'color', color: (c.value as string).toLowerCase(), tok };
      }
      case 'repeat': {
        const count = this.parseExpr(tok, ctx);
        const v = constantValue(count);
        if (v !== undefined && !(Number.isInteger(v) && v >= 0 && v <= MAX_REPEAT)) {
          throw errAt(count.tok, `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${MAX_REPEAT}`);
        }
        const body = this.parseBody(tok, { ...ctx, repDepth: ctx.repDepth + 1 });
        return { t: 'repeat', count, body, tok };
      }
      case 'let': {
        const n = this.next();
        this.checkLexError(n);
        if (n.kind !== 'ident') {
          throw errAt(
            n.kind === 'eof' ? tok : n,
            n.kind === 'eof'
              ? `Brakuje nazwy zmiennej po „${tok.text}”`
              : `Po „${tok.text}” oczekiwano nazwy zmiennej, a jest ${q(n)}`,
          );
        }
        const name = this.checkNewName(n, 'nazwą zmiennej');
        if (this.headers.has(name)) {
          throw errAt(n, `„${n.text}” jest nazwą procedury i nie może być nazwą zmiennej`);
        }
        const value = this.parseExpr(tok, ctx);
        if (ctx.scope) ctx.scope.assigned.add(name);
        else this.topVars.add(name);
        return { t: 'let', name, value, tok, global: !ctx.scope };
      }
      case 'if':
      case 'ifelse': {
        const cond = this.parseCondition(tok, ctx);
        const inner = ctx;
        const then = this.parseBody(tok, inner);
        if (command === 'if') return { t: 'if', cond, then, tok };
        const els = this.parseBody(tok, inner);
        return { t: 'if', cond, then, else: els, tok };
      }
    }
    throw errAt(tok, `Nieobsługiwane polecenie „${tok.text}”`);
  }

  private parseBody(cmdTok: Token, ctx: Ctx): Stmt[] {
    const open = this.next();
    this.checkLexError(open);
    if (open.kind !== 'lbr') {
      throw errAt(
        open.kind === 'eof' ? cmdTok : open,
        open.kind === 'eof'
          ? `Brakuje „[” po poleceniu „${cmdTok.text}”`
          : `Oczekiwano „[” rozpoczynającego blok, a jest ${q(open)}`,
      );
    }
    if (ctx.depth + 1 > MAX_BRACKET_DEPTH) {
      throw errAt(open, `Przekroczono maksymalne zagnieżdżenie nawiasów (${MAX_BRACKET_DEPTH})`);
    }
    const inner: Ctx = { ...ctx, depth: ctx.depth + 1 };
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.kind === 'eof') throw errAt(open, 'Nawias „[” nie został zamknięty – brakuje „]”');
      if (t.kind === 'rbr') {
        this.next();
        return body;
      }
      if (t.kind === 'ident') {
        const w = t.value as string;
        if (isDefClose(w)) throw errAt(open, 'Nawias „[” nie został zamknięty – brakuje „]”');
        if (isDefOpen(w)) {
          throw errAt(t, 'Definicji procedury nie można umieszczać wewnątrz nawiasów [ ]');
        }
      }
      body.push(this.parseStatement(inner));
    }
  }

  private parseCall(tok: Token, name: string, arity: number, ctx: Ctx): Stmt {
    const args: Expr[] = [];
    for (let i = 0; i < arity; i++) {
      const t = this.peek();
      if (!this.canStartOperand(t)) {
        this.checkLexError(t);
        throw errAt(
          t.kind === 'eof' ? tok : t,
          `Procedura „${tok.text}” oczekuje ${arity} ${pluralArgs(arity)}, a podano ${i}`,
        );
      }
      args.push(this.parseExpr(tok, ctx));
    }
    return { t: 'call', proc: name, args, tok };
  }

  // ───────────────────────── wyrażenia ─────────────────────────

  private canStartOperand(t: Token): boolean {
    switch (t.kind) {
      case 'num':
      case 'cname':
      case 'lp':
        return true;
      case 'op':
        return t.value === '+' || t.value === '-';
      case 'ident': {
        const w = t.value as string;
        return isRepcount(w) || !RESERVED.has(w);
      }
      default:
        return false;
    }
  }

  private parseCondition(cmd: Token, ctx: Ctx): Condition {
    const left = this.parseExpr(cmd, ctx);
    const c = this.peek();
    this.checkLexError(c);
    if (c.kind !== 'cmp') {
      throw errAt(
        c.kind === 'eof' ? cmd : c,
        `Oczekiwano operatora porównania (<, >, =, <=, >=, <>), a jest ${q(c)}`,
      );
    }
    this.next();
    const right = this.parseExpr(cmd, ctx);
    return { left, op: c.value as CmpOp, right };
  }

  /** Argument polecenia: pełne wyrażenie. `cmd` – token, przy którym zgłaszamy brak argumentu na końcu programu. */
  private parseExpr(cmd: Token, ctx: Ctx): Expr {
    const first = this.parseTerm(cmd, ctx);
    const rest: { op: '+' | '-'; e: Expr }[] = [];
    for (;;) {
      const t = this.peek();
      if (t.kind === 'op' && (t.value === '+' || t.value === '-') && this.isBinary(t)) {
        this.next();
        rest.push({ op: t.value as '+' | '-', e: this.parseTerm(cmd, ctx, t) });
      } else break;
    }
    return rest.length ? { k: 'sum', first, rest, tok: first.tok } : first;
  }

  private parseTerm(cmd: Token, ctx: Ctx, afterOp?: Token): Expr {
    const first = this.parseUnary(cmd, ctx, afterOp);
    const rest: { op: '*' | '/'; e: Expr }[] = [];
    for (;;) {
      const t = this.peek();
      if (t.kind === 'op' && (t.value === '*' || t.value === '/') && this.isBinary(t)) {
        this.next();
        rest.push({ op: t.value as '*' | '/', e: this.parseUnary(cmd, ctx, t) });
      } else break;
    }
    return rest.length ? { k: 'prod', first, rest, tok: first.tok } : first;
  }

  /** Operator dwuargumentowy musi mieć odstępy po obu stronach albo po żadnej. */
  private isBinary(t: Token): boolean {
    return t.spaceBefore === t.spaceAfter;
  }

  private parseUnary(cmd: Token, ctx: Ctx, afterOp?: Token): Expr {
    const signs: Token[] = [];
    let negative = false;
    for (;;) {
      const t = this.peek();
      if (t.kind === 'op' && (t.value === '+' || t.value === '-')) {
        signs.push(this.next());
        if (t.value === '-') negative = !negative;
      } else break;
    }
    const prim = this.parsePrimary(cmd, ctx, signs.length ? signs[signs.length - 1] : afterOp);
    if (!signs.length) return prim;
    return negative
      ? { k: 'neg', e: prim, tok: signs[0] }
      : { k: 'paren', e: prim, tok: signs[0] };
  }

  private parsePrimary(cmd: Token, ctx: Ctx, prevTok?: Token): Expr {
    const t = this.next();
    this.checkLexError(t);
    switch (t.kind) {
      case 'num':
        return { k: 'num', v: t.value as number, tok: t };
      case 'cname':
        this.refs.push({ name: t.value as string, tok: t, scope: ctx.scope });
        return { k: 'var', name: t.value as string, tok: t };
      case 'lp': {
        if (this.parenDepth >= MAX_PAREN_DEPTH) {
          throw errAt(t, `Zbyt głębokie zagnieżdżenie nawiasów okrągłych (limit ${MAX_PAREN_DEPTH})`);
        }
        this.parenDepth++;
        const inner = this.parseExpr(cmd, ctx);
        this.parenDepth--;
        const c = this.peek();
        this.checkLexError(c);
        if (c.kind !== 'rp') {
          throw c.kind === 'eof'
            ? errAt(t, 'Nawias „(” nie został zamknięty – brakuje „)”')
            : errAt(c, `Oczekiwano „)” zamykającego nawias, a jest ${q(c)}`);
        }
        this.next();
        return { k: 'paren', e: inner, tok: t };
      }
      case 'ident': {
        const w = t.value as string;
        if (isRepcount(w)) {
          if (ctx.repDepth === 0) {
            throw errAt(
              t,
              `„${t.text}” można użyć tylko wewnątrz bloku powtórz [ … ] (w tej samej procedurze albo na najwyższym poziomie)`,
            );
          }
          return { k: 'rep', tok: t };
        }
        if (RESERVED.has(w)) {
          throw errAt(t, this.missingMessage(cmd, prevTok, `znaleziono polecenie „${t.text}”`));
        }
        this.refs.push({ name: w, tok: t, scope: ctx.scope });
        return { k: 'var', name: w, tok: t };
      }
      case 'eof':
        throw errAt(cmd, this.missingMessage(cmd, prevTok, 'program kończy się w tym miejscu'));
      default:
        throw errAt(t, this.missingMessage(cmd, prevTok, `znaleziono ${q(t)}`));
    }
  }

  private missingMessage(cmd: Token, prevTok: Token | undefined, found: string): string {
    if (prevTok && prevTok.kind === 'op') {
      return `Brakuje wartości po operatorze „${prevTok.text}” (${found})`;
    }
    return `Brakuje argumentu polecenia „${cmd.text}”: oczekiwano liczby, nazwy lub wyrażenia, ale ${found}`;
  }
}

function pluralArgs(n: number): string {
  if (n === 1) return 'argumentu';
  return 'argumentów';
}

