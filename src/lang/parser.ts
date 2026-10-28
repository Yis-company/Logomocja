import type { ComparisonOp, Condition, Expr, ProcDef, Program, Stmt } from './ast';
import { errorAt, LogoError, tokenize, type Token } from './lexer';
import {
  COMPARISON_OPERATORS,
  commandKindOf,
  DEFINE_WORDS,
  END_WORDS,
  formatCount,
  HEADER_WORD,
  isReserved,
  LIMITS,
  type CommandKind,
  PITCH_AND_ROLL,
  type Mode,
  VALUE_WORDS,
} from './spec';

/**
 * Parsing happens in two passes. The first pass only reads procedure headers
 * and the names assigned with `niech`, so that calls may precede definitions
 * and so that every name can be checked against its scope. The second pass
 * builds the tree and reports every error the language defines.
 */

interface Declarations {
  procs: Map<string, ProcDef>;
  globals: Set<string>;
}

/** Lexical context of a statement: which procedure it is in and its nesting. */
interface Ctx {
  proc: ProcDef | null;
  repeatDepth: number;
  brackets: number;
}

/** Where an argument starts: the command it belongs to (for end-of-program errors) and its scope. */
interface Site {
  cmd: Token;
  ctx: Ctx;
}

interface Header {
  name: Token | null;
  params: Token[];
  /** Index of the first token after the header. */
  end: number;
  error: LogoError | null;
}

function isPunct(t: Token | undefined, text: string): boolean {
  return t !== undefined && t.kind === 'punct' && t.text === text;
}

function isDefineToken(t: Token | undefined): boolean {
  return t !== undefined && t.kind === 'name' && DEFINE_WORDS.has(t.norm);
}

function isEndToken(t: Token | undefined): boolean {
  return t !== undefined && t.kind === 'name' && END_WORDS.has(t.norm);
}

function argumentWord(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;
  if (count === 1) return 'argument';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'argumenty';
  return 'argumentów';
}

/**
 * Reads `oto name ma: a, b` or the legacy `oto name :a :b` starting at the
 * definition token. Everything about a header sits on the same line.
 */
export function readHeader(tokens: Token[], defIndex: number): Header {
  const def = tokens[defIndex];
  const params: Token[] = [];
  let i = defIndex + 1;
  const sameLine = (t: Token | undefined): t is Token => t !== undefined && t.line === def.line;
  const failure = (message: string, at: Token | undefined, name: Token | null = null): Header => ({
    name,
    params,
    end: i,
    error: errorAt(sameLine(at) ? at : def, message),
  });

  const name = tokens[i];
  if (!sameLine(name)) return failure('Brakuje nazwy procedury po słowie „oto”.', undefined);
  if (name.kind !== 'name') {
    return failure(`Oczekiwano nazwy procedury, a znaleziono „${name.text}”.`, name);
  }
  if (isReserved(name.norm)) {
    return failure(`„${name.text}” jest słowem zarezerwowanym i nie może być nazwą procedury.`, name, name);
  }
  i++;

  const head = tokens[i];
  let style: 'none' | 'ma' | 'legacy' = 'none';
  if (sameLine(head) && head.kind === 'name' && head.norm === HEADER_WORD && isPunct(tokens[i + 1], ':') && sameLine(tokens[i + 1])) {
    style = 'ma';
    i += 2;
  } else if (sameLine(head) && isPunct(head, ':')) {
    style = 'legacy';
  } else if (sameLine(head)) {
    return failure('Po nazwie procedury oczekiwano „ma:” albo parametrów zapisanych jako :nazwa.', head, name);
  }

  if (style !== 'none') {
    for (;;) {
      if (sameLine(tokens[i]) && isPunct(tokens[i], ':')) i++;
      const param = tokens[i];
      if (!sameLine(param) || param.kind !== 'name') {
        return failure('Oczekiwano nazwy parametru.', param, name);
      }
      if (isReserved(param.norm)) {
        return failure(`„${param.text}” jest słowem zarezerwowanym i nie może być parametrem.`, param, name);
      }
      if (params.some((p) => p.norm === param.norm)) {
        return failure(`Parametr „${param.text}” jest podany więcej niż raz.`, param, name);
      }
      params.push(param);
      i++;
      const separator = tokens[i];
      if (style === 'ma' && sameLine(separator) && isPunct(separator, ',')) {
        i++;
        continue;
      }
      if (style === 'legacy' && sameLine(separator) && isPunct(separator, ':')) continue;
      break;
    }
  }

  const after = tokens[i];
  if (sameLine(after)) {
    return failure(
      `Oczekiwano końca wiersza po nagłówku procedury, a znaleziono „${after.text}”.`,
      after,
      name,
    );
  }
  return { name, params, end: i, error: null };
}

/** First pass: procedure signatures and every name assigned with niech. */
function scanDeclarations(tokens: Token[]): Declarations {
  const procs = new Map<string, ProcDef>();
  const globals = new Set<string>();
  let inDefinition = false;
  let current: ProcDef | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!inDefinition && isDefineToken(t) && t.firstOnLine) {
      const header = readHeader(tokens, i);
      inDefinition = true;
      current = null;
      if (header.name && !header.error && !procs.has(header.name.norm)) {
        current = {
          name: header.name.norm,
          nameTok: header.name,
          params: header.params.map((p) => p.norm),
          declared: new Set(),
          body: [],
        };
        procs.set(current.name, current);
      }
      i = header.end - 1;
      continue;
    }
    if (inDefinition && isEndToken(t) && t.firstOnLine) {
      inDefinition = false;
      current = null;
      continue;
    }
    if (t.kind === 'name' && t.norm === 'niech') {
      const target = isPunct(tokens[i + 1], ':') ? tokens[i + 2] : tokens[i + 1];
      if (target?.kind === 'name') {
        (current ? current.declared : globals).add(target.norm);
      }
    }
  }
  return { procs, globals };
}

class Parser {
  private pos = 0;
  private parenDepth = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly mode: Mode,
    private readonly decl: Declarations,
  ) {}

  parse(): Program {
    const top: Ctx = { proc: null, repeatDepth: 0, brackets: 0 };
    const body: Stmt[] = [];
    while (this.pos < this.tokens.length) {
      if (isDefineToken(this.peek())) this.parseDefinition();
      else body.push(this.parseStatement(top));
    }
    return { mode: this.mode, procs: this.decl.procs, body };
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private isVariableName(norm: string, ctx: Ctx): boolean {
    if (this.decl.globals.has(norm)) return true;
    return ctx.proc !== null && (ctx.proc.params.includes(norm) || ctx.proc.declared.has(norm));
  }

  private parseDefinition(): void {
    const defTok = this.peek()!;
    if (!defTok.firstOnLine) {
      throw errorAt(defTok, 'Definicja procedury musi zaczynać się od nowego wiersza, od słowa „oto”.');
    }
    const header = readHeader(this.tokens, this.pos);
    if (header.error) throw header.error;
    const name = header.name!;
    const proc = this.decl.procs.get(name.norm);
    if (!proc || proc.nameTok !== name) {
      throw errorAt(name, `Procedura „${name.text}” jest już zdefiniowana.`);
    }
    this.pos = header.end;

    const ctx: Ctx = { proc, repeatDepth: 0, brackets: 0 };
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) {
        throw errorAt(defTok, `Brakuje słowa „już” kończącego definicję procedury „${name.text}”.`);
      }
      if (isEndToken(t)) {
        const after = this.tokens[this.pos + 1];
        if (!t.firstOnLine || (after && after.line === t.line)) {
          throw errorAt(t, 'Słowo „już” musi stać samo w wierszu.');
        }
        this.pos++;
        break;
      }
      if (isDefineToken(t)) {
        throw errorAt(t, 'Definicji procedury nie można umieścić wewnątrz innej procedury ani bloku [ ].');
      }
      body.push(this.parseStatement(ctx));
    }
    proc.body = body;
  }

  private parseStatement(ctx: Ctx): Stmt {
    const t = this.peek()!;
    if (t.kind === 'name') {
      if (isDefineToken(t)) {
        throw errorAt(t, 'Definicji procedury nie można umieścić wewnątrz innej procedury ani bloku [ ].');
      }
      if (isEndToken(t)) {
        throw errorAt(t, 'Słowo „już” kończy tylko definicję procedury i musi stać na początku wiersza.');
      }
      const kind = commandKindOf(t.norm);
      if (kind) {
        this.pos++;
        return this.parseCommand(kind, t, ctx);
      }
      const proc = this.decl.procs.get(t.norm);
      if (proc) {
        this.pos++;
        return this.parseCall(proc, t, ctx);
      }
      if (this.isVariableName(t.norm, ctx)) {
        throw errorAt(t, `„${t.text}” jest nazwą zmiennej, a nie poleceniem.`);
      }
      throw errorAt(t, `Nieznane polecenie „${t.text}”.`);
    }
    if (isPunct(t, ']')) throw errorAt(t, 'Nieoczekiwany nawias ].');
    if (isPunct(t, ')')) throw errorAt(t, 'Nieoczekiwany nawias ).');
    throw errorAt(t, `Oczekiwano polecenia, a znaleziono „${t.text}”.`);
  }

  private parseCommand(kind: CommandKind, tok: Token, ctx: Ctx): Stmt {
    const site: Site = { cmd: tok, ctx };
    switch (kind) {
      case 'pu':
      case 'pd':
      case 'home':
      case 'cs':
      case 'stop':
        return { kind: 'cmd', cmd: kind, tok };

      case 'color': {
        const s = this.peek();
        if (!s || s.kind !== 'string') {
          throw errorAt(s ?? tok, 'Oczekiwano koloru w postaci "#rrggbb".');
        }
        this.pos++;
        const match = /^"#([0-9a-f]{6})"$/i.exec(s.text);
        if (!match) {
          throw errorAt(s, `Nieprawidłowy kolor ${s.text}. Kolor ma mieć sześć cyfr szesnastkowych: "#rrggbb".`);
        }
        return { kind: 'cmd', cmd: 'color', tok, color: `#${match[1].toLowerCase()}` };
      }

      case 'fd':
      case 'bk':
      case 'rt':
      case 'lt':
      case 'pitchup':
      case 'pitchdown':
      case 'rollright':
      case 'rollleft': {
        if (PITCH_AND_ROLL.has(kind) && this.mode === '2d') {
          throw errorAt(tok, `Polecenie „${tok.text}” działa tylko w trybie 3D.`);
        }
        return { kind: 'cmd', cmd: kind, tok, arg: this.parseExpression(site) };
      }

      case 'width': {
        const arg = this.parseExpression(site);
        this.checkLiteral(arg, (v) => Number.isInteger(v) && v >= LIMITS.minWidth && v <= LIMITS.maxWidth,
          `Grubość musi być liczbą całkowitą od ${LIMITS.minWidth} do ${LIMITS.maxWidth}.`);
        return { kind: 'cmd', cmd: 'width', tok, arg };
      }

      case 'repeat': {
        const count = this.parseExpression(site);
        this.checkLiteral(count, (v) => Number.isInteger(v) && v >= 0 && v <= LIMITS.maxRepeat,
          `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${formatCount(LIMITS.maxRepeat)}.`);
        const body = this.parseBlock(tok, ctx, true);
        return { kind: 'repeat', tok, count, body };
      }

      case 'let': {
        let name = this.peek();
        if (isPunct(name, ':')) {
          this.pos++;
          name = this.peek();
        }
        if (!name || name.kind !== 'name') {
          throw errorAt(name ?? tok, 'Oczekiwano nazwy zmiennej po słowie „niech”.');
        }
        if (isReserved(name.norm)) {
          throw errorAt(name, `„${name.text}” jest słowem zarezerwowanym i nie może być nazwą zmiennej.`);
        }
        const isParam = ctx.proc?.params.includes(name.norm) ?? false;
        if (this.decl.procs.has(name.norm) && !isParam) {
          throw errorAt(name, `„${name.text}” jest nazwą procedury i nie może być nazwą zmiennej.`);
        }
        this.pos++;
        return { kind: 'let', tok, name: name.norm, value: this.parseExpression(site) };
      }

      case 'if': {
        const cond = this.parseCondition(site);
        return { kind: 'if', tok, cond, body: this.parseBlock(tok, ctx, false) };
      }

      case 'ifelse': {
        const cond = this.parseCondition(site);
        const then = this.parseBlock(tok, ctx, false);
        const otherwise = this.parseBlock(tok, ctx, false);
        return { kind: 'ifelse', tok, cond, then, otherwise };
      }
    }
  }

  private parseCall(proc: ProcDef, tok: Token, ctx: Ctx): Stmt {
    const site: Site = { cmd: tok, ctx };
    const args: Expr[] = [];
    for (let i = 0; i < proc.params.length; i++) args.push(this.parseExpression(site));
    const extra = this.peek();
    if (extra && (extra.kind === 'number' || isPunct(extra, '('))) {
      const n = proc.params.length;
      throw errorAt(
        extra,
        `Procedura „${proc.nameTok.text}” przyjmuje ${n} ${argumentWord(n)}, a podano więcej.`,
      );
    }
    return { kind: 'call', tok, proc, args };
  }

  private parseBlock(cmd: Token, outer: Ctx, inRepeat: boolean): Stmt[] {
    const open = this.peek();
    if (!open || !isPunct(open, '[')) {
      throw errorAt(open ?? cmd, 'Oczekiwano bloku w nawiasach [ ].');
    }
    if (outer.brackets + 1 > LIMITS.maxBracketDepth) {
      throw errorAt(open, `Zbyt głębokie zagnieżdżenie nawiasów [ ]. Limit to ${LIMITS.maxBracketDepth}.`);
    }
    this.pos++;
    const inner: Ctx = {
      proc: outer.proc,
      repeatDepth: outer.repeatDepth + (inRepeat ? 1 : 0),
      brackets: outer.brackets + 1,
    };
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) throw errorAt(open, 'Nawias [ nie ma pary ].');
      if (isPunct(t, ']')) {
        this.pos++;
        return body;
      }
      if (isEndToken(t)) {
        throw errorAt(open, 'Nawias [ nie ma pary ]: brakuje ] przed słowem „już”.');
      }
      if (isDefineToken(t)) {
        throw errorAt(t, 'Definicji procedury nie można umieścić wewnątrz bloku [ ] ani innej procedury.');
      }
      body.push(this.parseStatement(inner));
    }
  }

  private parseCondition(site: Site): Condition {
    const left = this.parseExpression(site);
    const op = this.peek();
    if (!op || op.kind !== 'op' || !COMPARISON_OPERATORS.has(op.text)) {
      if (op) {
        throw errorAt(op, `Oczekiwano porównania (=, <, >, <=, >=, <>), a znaleziono „${op.text}”.`);
      }
      throw errorAt(site.cmd, 'Brakuje porównania (=, <, >, <=, >=, <>).');
    }
    this.pos++;
    const right = this.parseExpression(site);
    return { left, op: op.text as ComparisonOp, right, tok: left.tok };
  }

  /** Parses one argument. The root node's `tok` is the first token of the argument. */
  private parseExpression(site: Site): Expr {
    const first = this.peek() ?? site.cmd;
    const root = this.parseSum(site);
    root.tok = first;
    return root;
  }

  private isBinary(t: Token | undefined, ops: readonly string[]): t is Token {
    // A binary operator needs whitespace on both sides or on neither side:
    // `10 - 5` and `10-5` are subtraction, `10 -5` is a stray token.
    return t !== undefined && t.kind === 'op' && ops.includes(t.text) && t.spaceBefore === t.spaceAfter;
  }

  private parseSum(site: Site): Expr {
    let left = this.parseProduct(site);
    for (;;) {
      const t = this.peek();
      if (!this.isBinary(t, ['+', '-'])) return left;
      this.pos++;
      const right = this.parseProduct(site);
      left = { kind: 'bin', op: t.text as '+' | '-', left, right, tok: left.tok };
    }
  }

  private parseProduct(site: Site): Expr {
    let left = this.parseUnary(site);
    for (;;) {
      const t = this.peek();
      if (!this.isBinary(t, ['*', '/'])) return left;
      this.pos++;
      const right = this.parseUnary(site);
      left = { kind: 'bin', op: t.text as '*' | '/', left, right, tok: left.tok };
    }
  }

  private parseUnary(site: Site): Expr {
    const start = this.peek() ?? site.cmd;
    let negative = false;
    for (;;) {
      const t = this.peek();
      if (!t || t.kind !== 'op' || (t.text !== '+' && t.text !== '-')) break;
      if (t.text === '-') negative = !negative;
      this.pos++;
    }
    const operand = this.parsePrimary(site);
    return negative ? { kind: 'neg', operand, tok: start } : operand;
  }

  private parsePrimary(site: Site): Expr {
    const t = this.peek();
    if (!t) throw errorAt(site.cmd, 'Brakuje wartości: liczby, nazwy albo wyrażenia.');

    if (t.kind === 'number') {
      this.pos++;
      return { kind: 'num', value: t.value, tok: t };
    }
    if (t.kind === 'name') return this.nameValue(t, site);
    if (isPunct(t, ':')) {
      // Legacy `:name` form, which means the same as `name`.
      this.pos++;
      const name = this.peek();
      if (!name || name.kind !== 'name') {
        throw errorAt(name ?? t, 'Oczekiwano nazwy po dwukropku.');
      }
      return this.nameValue(name, site);
    }
    if (isPunct(t, '(')) {
      if (++this.parenDepth > LIMITS.maxParenDepth) {
        throw errorAt(t, `Zbyt głębokie zagnieżdżenie nawiasów ( ). Limit to ${LIMITS.maxParenDepth}.`);
      }
      this.pos++;
      const inner = this.parseSum(site);
      const close = this.peek();
      if (!isPunct(close, ')')) throw errorAt(t, 'Nawias ( nie ma pary ).');
      this.pos++;
      this.parenDepth--;
      return inner;
    }
    throw errorAt(t, `Oczekiwano wartości, a znaleziono „${t.text}”.`);
  }

  /** Consumes the name token `t` (already peeked) and checks it as a value. */
  private nameValue(t: Token, site: Site): Expr {
    this.pos++;
    if (VALUE_WORDS.has(t.norm)) {
      if (site.ctx.repeatDepth === 0) {
        throw errorAt(t, 'Słowo „nrpowt” działa tylko wewnątrz bloku powtórz.');
      }
      return { kind: 'nrpowt', tok: t };
    }
    if (isReserved(t.norm)) {
      throw errorAt(t, `Oczekiwano wartości, a znaleziono „${t.text}”.`);
    }
    if (!this.isVariableName(t.norm, site.ctx)) {
      throw errorAt(
        t,
        `Nieznana nazwa „${t.text}”. Zmienną trzeba najpierw przypisać poleceniem „niech”, a parametr podać w nagłówku procedury.`,
      );
    }
    return { kind: 'var', name: t.norm, tok: t };
  }

  private checkLiteral(expr: Expr, valid: (value: number) => boolean, message: string): void {
    const value = evaluateLiteral(expr);
    if (value !== undefined && !valid(value)) throw errorAt(expr.tok, message);
  }
}

/** Value of an expression that uses no names, or undefined when it depends on run-time state. */
function evaluateLiteral(e: Expr): number | undefined {
  switch (e.kind) {
    case 'num':
      return e.value;
    case 'var':
    case 'nrpowt':
      return undefined;
    case 'neg': {
      const v = evaluateLiteral(e.operand);
      return v === undefined ? undefined : -v;
    }
    case 'bin': {
      const l = evaluateLiteral(e.left);
      const r = evaluateLiteral(e.right);
      if (l === undefined || r === undefined) return undefined;
      if (e.op === '/' && r === 0) return undefined;
      const result = e.op === '+' ? l + r : e.op === '-' ? l - r : e.op === '*' ? l * r : l / r;
      return Number.isFinite(result) ? result : undefined;
    }
  }
}

/** Parses a whole program. Throws LogoError with the first problem found. */
export function parseProgram(source: string, mode: Mode): Program {
  const tokens = tokenize(source);
  const decl = scanDeclarations(tokens);
  return new Parser(tokens, mode, decl).parse();
}
