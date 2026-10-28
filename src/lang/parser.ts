import type { Arg, Comparison, Condition, Expr, Mode, Procedure, Program, Stmt } from './ast';
import { LIMITS, LogoFailure, big, fmt, plural } from './errors';
import { COMMANDS_3D, type CommandId } from './keywords';
import { lex, positionAt, type Token } from './lexer';

interface Scope {
  proc: Procedure | null;
  /** Liczba powtórzeń otaczających leksykalnie (w obrębie bieżącej procedury). */
  repeatDepth: number;
  /** Głębokość zagnieżdżenia nawiasów kwadratowych. */
  bracketDepth: number;
}

const fail = (tok: Token, message: string): never => {
  throw LogoFailure.at(tok, message);
};

/** Opis tokenu do komunikatów: „np”, „]”, „5”. */
const q = (tok: Token) => `„${tok.text}”`;

const argWord = (n: number) => plural(n, 'argument', 'argumenty', 'argumentów');

/**
 * Sprawdza limity rozmiaru i dzieli źródło na tokeny.
 * Rzuca LogoFailure przy przekroczeniu limitu znaków lub tokenów.
 */
export function tokenize(source: string): Token[] {
  if (source.length > LIMITS.sourceChars) {
    // Liczymy znaki jako punkty kodowe.
    let count = 0;
    for (let i = 0; i < source.length;) {
      if (count === LIMITS.sourceChars) {
        const p = positionAt(source, i);
        throw new LogoFailure(
          `Program jest za długi: ma więcej niż ${big(LIMITS.sourceChars)} znaków.`,
          p.line, p.col, i, i + 1,
        );
      }
      const cp = source.codePointAt(i)!;
      i += cp > 0xffff ? 2 : 1;
      count++;
    }
  }
  const { tokens } = lex(source);
  if (tokens.length > LIMITS.tokens) {
    fail(tokens[LIMITS.tokens]!, `Program ma za dużo elementów: więcej niż ${big(LIMITS.tokens)} tokenów.`);
  }
  return tokens;
}

/** Analizuje cały program. Rzuca LogoFailure przy pierwszym błędzie. */
export function parse(source: string, mode: Mode): Program {
  const tokens = tokenize(source);
  return new Parser(tokens, mode).parseProgram();
}

/** Wynik wstępnego przejścia: nagłówki procedur i nazwy przypisywane przez niech. */
interface Prepass {
  procedures: Map<string, Procedure>;
  globals: Set<string>;
}

/** Odczytuje (pobłażliwie) parametry z nagłówka zaczynającego się po tokenie nazwy. */
function lenientParams(tokens: Token[], nameIndex: number): string[] {
  const line = tokens[nameIndex]!.line;
  const params: string[] = [];
  let k = nameIndex + 1;
  const first = tokens[k];
  if (first && first.line === line && first.kind === 'word' && first.name === 'ma:') {
    for (k++; k < tokens.length && tokens[k]!.line === line; k++) {
      const t = tokens[k]!;
      if (t.kind === 'word') params.push(t.name!);
    }
  } else {
    for (; k < tokens.length && tokens[k]!.line === line; k++) {
      const t = tokens[k]!;
      if (t.kind === 'word' && t.colon) params.push(t.name!);
    }
  }
  return params;
}

function prepass(tokens: Token[]): Prepass {
  const procedures = new Map<string, Procedure>();
  const globals = new Set<string>();
  let current: Set<string> | null = null;
  for (let k = 0; k < tokens.length; k++) {
    const t = tokens[k]!;
    if (t.kind !== 'word') continue;
    if (t.keyword === 'to' && t.firstOnLine && !current) {
      current = new Set();
      const nameTok = tokens[k + 1];
      if (nameTok && nameTok.line === t.line && nameTok.kind === 'word' && !nameTok.colon
        && !nameTok.keyword && nameTok.name !== 'ma:' && !procedures.has(nameTok.name!)) {
        procedures.set(nameTok.name!, {
          name: nameTok.name!, display: nameTok.text, params: lenientParams(tokens, k + 1),
          locals: current, tok: t, body: [],
        });
      }
    } else if (t.keyword === 'end' && current) {
      current = null;
    } else if (t.keyword === 'let') {
      const nameTok = tokens[k + 1];
      if (nameTok && nameTok.kind === 'word' && !nameTok.keyword) {
        (current ?? globals).add(nameTok.name!);
      }
    }
  }
  return { procedures, globals };
}

class Parser {
  private i = 0;
  private readonly procedures: Map<string, Procedure>;
  private readonly globals: Set<string>;
  private parenDepth = 0;
  private sawName = false;
  /** Indeks ostatniego tokenu poprzedniego polecenia i jego opis (do podpowiedzi). */
  private lastEnd = -1;
  private lastHint = '';
  private strayHint = '';

  constructor(private readonly tokens: Token[], private readonly mode: Mode) {
    const pre = prepass(tokens);
    this.procedures = pre.procedures;
    this.globals = pre.globals;
  }

  parseProgram(): Program {
    const main = this.parseBlock('eof', { proc: null, repeatDepth: 0, bracketDepth: 0 }, null);
    return { mode: this.mode, main, procedures: this.procedures, globals: this.globals };
  }

  private peek(): Token | undefined {
    return this.tokens[this.i];
  }

  private next(): Token {
    return this.tokens[this.i++]!;
  }

  private last(): Token {
    return this.tokens[this.i - 1]!;
  }

  private parseBlock(end: 'eof' | 'rbr' | 'end', scope: Scope, open: Token | null): Stmt[] {
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) {
        if (end === 'eof') return body;
        if (end === 'rbr') fail(open!, 'Nawias „[” nie został zamknięty – brakuje „]”.');
        fail(open!, `Brakuje „już” kończącego procedurę „${scope.proc!.display}” (rozpoczętą w wierszu ${open!.line}).`);
      }
      const tok = t!;
      if (tok.kind === 'rbr') {
        if (end === 'rbr') { this.i++; return body; }
        fail(tok, 'Nadmiarowy nawias „]” – nie pasuje do żadnego „[”.');
      }
      if (tok.kind === 'word' && tok.keyword === 'end') {
        if (end === 'rbr') fail(open!, 'Nawias „[” nie został zamknięty – brakuje „]”.');
        if (end === 'eof') fail(tok, `${q(tok)} bez rozpoczętej procedury – definicja zaczyna się od „oto”.`);
        if (!tok.firstOnLine || !tok.lastOnLine) fail(tok, `${q(tok)} musi stać samo w osobnym wierszu.`);
        this.i++;
        return body;
      }
      const stmt = this.parseStatement(scope);
      if (stmt) body.push(stmt);
      this.lastEnd = this.i - 1;
    }
  }

  private stray(tok: Token): never {
    if (tok.kind === 'op') {
      const prev = this.tokens[this.i - 2];
      const afterValue = prev && (prev.kind === 'num' || prev.kind === 'word' || prev.kind === 'rpar');
      if (afterValue && tok.spaceBefore !== tok.spaceAfter) {
        const side = tok.spaceBefore ? 'tylko z lewej' : 'tylko z prawej';
        fail(tok, `Znak ${q(tok)} ma odstęp ${side} strony, więc nie łączy wartości. `
          + `Postaw odstępy z obu stron albo z żadnej, np. „10 ${tok.text} 5” lub „10${tok.text}5”.`);
      }
      return fail(tok, `Nieoczekiwany znak ${q(tok)} – w tym miejscu powinno być polecenie.`);
    }
    let hint = '';
    if (this.lastEnd === this.i - 2 && this.strayHint) hint = ' ' + this.strayHint;
    if (tok.kind === 'lpar') fail(tok, `Nieoczekiwane wyrażenie w nawiasie – w tym miejscu powinno być polecenie.${hint}`);
    return fail(tok, `Nieoczekiwana wartość ${q(tok)} – w tym miejscu powinno być polecenie.${hint}`);
  }

  private parseStatement(scope: Scope): Stmt | null {
    const t = this.next();
    this.strayHint = this.lastHint;
    this.lastHint = '';
    switch (t.kind) {
      case 'bad': return fail(t, t.error!);
      case 'num': case 'str': case 'lpar': case 'op': return this.stray(t);
      case 'cmp': return fail(t, `Nieoczekiwane porównanie ${q(t)} – porównań używa się w warunkach „jeśli” i „jeżeli”.`);
      case 'comma': return fail(t, 'Nieoczekiwany przecinek – przecinki rozdzielają tylko parametry w nagłówku procedury.');
      case 'rpar': return fail(t, 'Nadmiarowy nawias „)” – nie pasuje do żadnego „(”.');
      case 'lbr': return fail(t, 'Nieoczekiwany nawias „[” – blok w nawiasach musi następować po poleceniu, np. „powtórz 4 [ … ]”.');
      case 'rbr': return fail(t, 'Nadmiarowy nawias „]”.');
      case 'word': break;
    }
    if (t.colon) return this.stray(t);
    if (t.name === 'ma:') return fail(t, '„ma:” może wystąpić tylko w nagłówku procedury, np. „oto kwadrat ma: bok”.');
    const kw = t.keyword;
    if (kw === 'repcount') return fail(t, `${q(t)} to wartość (numer powtórzenia), a nie polecenie – użyj go jako argumentu, np. „np nrpowt”.`);
    if (kw === 'to') {
      this.parseDefinition(t, scope);
      return null;
    }
    if (kw === 'end') return fail(t, `Nieoczekiwane ${q(t)}.`);
    if (kw) return this.parseCommand(t, kw, scope);
    const proc = this.procedures.get(t.name!);
    if (proc) {
      const args: Arg[] = [];
      for (let k = 0; k < proc.params.length; k++) {
        args.push(this.parseArg(t, scope, () =>
          `Procedura „${proc.display}” potrzebuje ${proc.params.length} ${argWord(proc.params.length)}, a podano ${k}.`));
      }
      this.lastHint = proc.params.length === 0
        ? `Procedura „${proc.display}” nie przyjmuje argumentów.`
        : `Procedura „${proc.display}” przyjmuje ${proc.params.length} ${argWord(proc.params.length)}.`;
      return { k: 'call', tok: t, proc, args };
    }
    if (this.isDeclared(t.name!, scope)) return this.stray(t);
    return fail(t, `Nieznane polecenie ${q(t)}.`
      + (scope.proc ? '' : ` Jeśli to ma być procedura, zdefiniuj ją: „oto ${t.text}” … „już”.`));
  }

  private parseCommand(t: Token, kw: CommandId, scope: Scope): Stmt {
    if (COMMANDS_3D.has(kw) && this.mode === '2d') {
      fail(t, `Polecenie ${q(t)} działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`);
    }
    const needsNumber = () => `Polecenie ${q(t)} potrzebuje argumentu – liczby lub wyrażenia, np. „${t.text} 50”.`;
    const oneArgHint = `Polecenie ${q(t)} przyjmuje jeden argument.`;
    switch (kw) {
      case 'fd': case 'bk': {
        const arg = this.parseArg(t, scope, needsNumber);
        this.lastHint = oneArgHint;
        return { k: 'move', tok: t, sign: kw === 'fd' ? 1 : -1, arg };
      }
      case 'rt': case 'lt': {
        const arg = this.parseArg(t, scope, needsNumber);
        this.lastHint = oneArgHint;
        return { k: 'turn', tok: t, sign: kw === 'rt' ? 1 : -1, arg };
      }
      case 'up': case 'down': {
        const arg = this.parseArg(t, scope, needsNumber);
        this.lastHint = oneArgHint;
        return { k: 'pitch', tok: t, sign: kw === 'up' ? 1 : -1, arg };
      }
      case 'rollright': case 'rollleft': {
        const arg = this.parseArg(t, scope, needsNumber);
        this.lastHint = oneArgHint;
        return { k: 'roll', tok: t, sign: kw === 'rollright' ? 1 : -1, arg };
      }
      case 'pu': case 'pd':
        this.lastHint = `Polecenie ${q(t)} nie przyjmuje argumentów.`;
        return { k: 'pen', tok: t, down: kw === 'pd' };
      case 'home':
        this.lastHint = `Polecenie ${q(t)} nie przyjmuje argumentów.`;
        return { k: 'home', tok: t };
      case 'clear':
        this.lastHint = `Polecenie ${q(t)} nie przyjmuje argumentów.`;
        return { k: 'clear', tok: t };
      case 'stop':
        this.lastHint = `Polecenie ${q(t)} nie przyjmuje argumentów.`;
        return { k: 'stop', tok: t };
      case 'color': {
        const c = this.peek();
        if (c?.kind === 'bad') fail(c, c.error!);
        if (!c || c.kind !== 'str') {
          fail(c ?? t, `Polecenie ${q(t)} potrzebuje koloru zapisanego jako "#rrggbb", np. „kolor "#16866a"”.`);
        }
        const col = c!;
        if (!/^#[0-9a-fA-F]{6}$/.test(col.str!)) {
          fail(col, `Niepoprawny kolor ${col.text}. Kolor zapisz jako "#rrggbb" – krzyżyk i sześć cyfr szesnastkowych (0–9, a–f), np. "#16866a".`);
        }
        this.i++;
        this.lastHint = oneArgHint;
        return { k: 'color', tok: t, color: col.str!.toLowerCase() };
      }
      case 'width': {
        const arg = this.parseArg(t, scope, () => `Polecenie ${q(t)} potrzebuje liczby całkowitej od 1 do 12, np. „${t.text} 3”.`);
        if (arg.literal) {
          const v = tryConstant(arg.expr);
          if (v !== undefined) checkWidth(v, arg.first);
        }
        this.lastHint = oneArgHint;
        return { k: 'width', tok: t, arg };
      }
      case 'repeat': {
        const count = this.parseArg(t, scope, () => `Polecenie ${q(t)} potrzebuje liczby powtórzeń i bloku poleceń, np. „${t.text} 4 [np 50 pw 90]”.`);
        if (count.literal) {
          const v = tryConstant(count.expr);
          if (v !== undefined) checkRepeat(v, count.first);
        }
        const body = this.parseBracketBody(t, { ...scope, repeatDepth: scope.repeatDepth + 1 },
          `Po liczbie powtórzeń brakuje bloku poleceń w nawiasach, np. „${t.text} 4 [np 50 pw 90]”.`);
        return { k: 'repeat', tok: t, count, body };
      }
      case 'let': {
        const nt = this.peek();
        if (nt?.kind === 'bad') fail(nt, nt.error!);
        if (!nt || nt.kind !== 'word') {
          fail(nt ?? t, `Po ${q(t)} podaj nazwę zmiennej i wartość, np. „niech bok 50”.`);
        }
        const nameTok = nt!;
        if (nameTok.keyword || nameTok.name === 'ma:') {
          fail(nameTok, `${q(nameTok)} to słowo kluczowe – nie może być nazwą zmiennej.`);
        }
        const varName = nameTok.name!;
        const isParam = scope.proc?.params.includes(varName) ?? false;
        if (this.procedures.has(varName) && !isParam) {
          fail(nameTok, `„${nameTok.text}” to nazwa procedury – zmienna musi nazywać się inaczej.`);
        }
        this.i++;
        const arg = this.parseArg(t, scope, () => `Po „niech ${nameTok.text}” brakuje wartości, np. „niech ${nameTok.text} 50”.`);
        this.lastHint = `Polecenie „niech” przyjmuje nazwę i jedną wartość.`;
        return { k: 'let', tok: t, name: varName, arg };
      }
      case 'if': case 'ifelse': {
        const cond = this.parseCondition(t, scope);
        const thenBody = this.parseBracketBody(t, scope,
          `Po warunku brakuje bloku poleceń w nawiasach, np. „${t.text} x > 5 [np 10]”.`);
        if (kw === 'if') return { k: 'if', tok: t, cond, then: thenBody };
        const elseBody = this.parseBracketBody(t, scope,
          `${q(t)} potrzebuje dwóch bloków: pierwszy wykona się, gdy warunek jest spełniony, drugi – gdy nie jest. Brakuje drugiego bloku [ … ].`);
        return { k: 'ifelse', tok: t, cond, then: thenBody, else: elseBody };
      }
    }
    return fail(t, `Nieznane polecenie ${q(t)}.`);
  }

  private parseBracketBody(cmd: Token, scope: Scope, missing: string): Stmt[] {
    const t = this.peek();
    if (t?.kind === 'bad') fail(t, t.error!);
    if (!t || t.kind !== 'lbr') fail(t ?? cmd, missing);
    const open = t!;
    if (scope.bracketDepth + 1 > LIMITS.nesting) {
      fail(open, `Za głębokie zagnieżdżenie nawiasów – najwyżej ${LIMITS.nesting} poziomy.`);
    }
    this.i++;
    return this.parseBlock('rbr', { ...scope, bracketDepth: scope.bracketDepth + 1 }, open);
  }

  private parseCondition(cmd: Token, scope: Scope): Condition {
    const a = this.parseArg(cmd, scope, () => `${q(cmd)} potrzebuje warunku, np. „${cmd.text} x > 5 [ … ]”.`);
    const c = this.peek();
    if (c?.kind === 'bad') fail(c, c.error!);
    if (!c || c.kind !== 'cmp') {
      fail(c ?? this.last(), 'W warunku brakuje porównania: <, >, =, <=, >= albo <>.');
    }
    const opTok = c!;
    this.i++;
    const b = this.parseArg(opTok, scope, () => `Po porównaniu ${q(opTok)} brakuje wartości.`);
    return { a, op: opTok.text as Comparison, b, first: a.first };
  }

  private isDeclared(name: string, scope: Scope): boolean {
    if (scope.proc && (scope.proc.params.includes(name) || scope.proc.locals.has(name))) return true;
    return this.globals.has(name);
  }

  /** Czy token może rozpocząć wyrażenie (argument). */
  private canStart(t: Token, scope: Scope): boolean {
    switch (t.kind) {
      case 'num': case 'lpar': return true;
      case 'op': return t.text === '-' || t.text === '+';
      case 'word':
        if (t.colon) return true;
        if (t.keyword) return t.keyword === 'repcount';
        if (t.name === 'ma:') return false;
        // Nazwa procedury, która nie jest też parametrem ani zmienną, nie jest wartością.
        if (this.procedures.has(t.name!) && !this.isDeclared(t.name!, scope)) return false;
        return true;
      default: return false;
    }
  }

  private parseArg(cmd: Token, scope: Scope, missing: () => string): Arg {
    const first = this.peek();
    if (first?.kind === 'bad') fail(first, first.error!);
    if (!first || !this.canStart(first, scope)) {
      let msg = missing();
      if (first?.kind === 'word' && !first.keyword && this.procedures.has(first.name!)) {
        msg += ` „${first.text}” to procedura, a nie wartość.`;
      }
      fail(first ?? cmd, msg);
    }
    this.sawName = false;
    this.parenDepth = 0;
    const expr = this.parseExpr(scope);
    return { expr, first: first!, literal: !this.sawName };
  }

  private isBinary(t: Token | undefined, ops: string): boolean {
    return !!t && t.kind === 'op' && ops.includes(t.text) && t.spaceBefore === t.spaceAfter;
  }

  private parseExpr(scope: Scope): Expr {
    let left = this.parseTerm(scope);
    while (this.isBinary(this.peek(), '+-')) {
      const op = this.next();
      const right = this.parseTerm(scope);
      left = { k: 'bin', op: op.text as '+' | '-', a: left, b: right };
    }
    return left;
  }

  private parseTerm(scope: Scope): Expr {
    let left = this.parseUnary(scope);
    while (this.isBinary(this.peek(), '*/')) {
      const op = this.next();
      const right = this.parseUnary(scope);
      left = { k: 'bin', op: op.text as '*' | '/', a: left, b: right };
    }
    return left;
  }

  private parseUnary(scope: Scope): Expr {
    let negative = false;
    let t = this.peek();
    while (t && t.kind === 'op' && (t.text === '-' || t.text === '+')) {
      if (t.text === '-') negative = !negative;
      this.i++;
      t = this.peek();
    }
    const e = this.parsePrimary(scope);
    return negative ? { k: 'neg', e } : e;
  }

  private missingOperand(found: Token | undefined): never {
    const prev = this.last();
    let msg: string;
    if (prev.kind === 'lpar') msg = 'Po nawiasie „(” brakuje wyrażenia.';
    else if (prev.kind === 'op') msg = `Po znaku ${q(prev)} brakuje wartości.`;
    else msg = 'Brakuje wartości.';
    return fail(found ?? prev, msg);
  }

  private parsePrimary(scope: Scope): Expr {
    const t = this.peek();
    if (!t) return this.missingOperand(t);
    switch (t.kind) {
      case 'bad': return fail(t, t.error!);
      case 'num':
        this.i++;
        return { k: 'num', value: t.value! };
      case 'lpar': {
        if (this.parenDepth + 1 > LIMITS.parens) {
          fail(t, `Za głębokie zagnieżdżenie nawiasów okrągłych – najwyżej ${LIMITS.parens} poziomy.`);
        }
        this.i++;
        this.parenDepth++;
        const e = this.parseExpr(scope);
        this.parenDepth--;
        const close = this.peek();
        if (!close || close.kind !== 'rpar') fail(t, 'Nawias „(” nie został zamknięty – brakuje „)”.');
        this.i++;
        return e;
      }
      case 'word': {
        if (t.keyword === 'repcount') {
          if (scope.repeatDepth === 0) {
            fail(t, scope.proc
              ? `${q(t)} działa tylko wewnątrz „powtórz” w tej samej procedurze – tu nie ma otaczającego „powtórz”.`
              : `${q(t)} działa tylko wewnątrz bloku „powtórz”.`);
          }
          this.i++;
          this.sawName = true;
          return { k: 'repcount' };
        }
        if (t.keyword || t.name === 'ma:') return this.missingOperand(t);
        const name = t.name!;
        if (!this.isDeclared(name, scope)) {
          if (this.procedures.has(name)) fail(t, `„${t.text}” to procedura, a nie wartość.`);
          const display = t.colon ? t.text.slice(1) : t.text;
          fail(t, `Nieznana nazwa „${display}”. Nadaj jej wartość poleceniem „niech ${display} …”`
            + (scope.proc ? ` albo dodaj parametr procedury „${scope.proc.display}”.` : '.'));
        }
        this.i++;
        this.sawName = true;
        return { k: 'var', name, tok: t };
      }
      default:
        return this.missingOperand(t);
    }
  }

  private parseDefinition(oto: Token, scope: Scope): void {
    if (scope.proc) {
      fail(oto, `Nowa definicja wewnątrz procedury „${scope.proc.display}” – procedury definiuje się tylko na najwyższym poziomie. Czy brakuje „już”?`);
    }
    if (scope.bracketDepth > 0) {
      fail(oto, 'Procedury definiuje się tylko na najwyższym poziomie, nie wewnątrz nawiasów [ ].');
    }
    if (!oto.firstOnLine) fail(oto, `Definicja procedury ${q(oto)} musi zaczynać się na początku wiersza.`);
    const nt = this.peek();
    if (!nt || nt.line !== oto.line) fail(oto, `Po ${q(oto)} podaj nazwę procedury w tym samym wierszu, np. „oto kwadrat ma: bok”.`);
    const nameTok = nt!;
    if (nameTok.kind === 'bad') fail(nameTok, nameTok.error!);
    if (nameTok.kind !== 'word' || nameTok.colon) fail(nameTok, `${q(nameTok)} nie może być nazwą procedury.`);
    if (nameTok.keyword || nameTok.name === 'ma:') fail(nameTok, `${q(nameTok)} to słowo kluczowe – nie może być nazwą procedury.`);
    const proc = this.procedures.get(nameTok.name!);
    if (!proc || proc.tok !== oto) {
      fail(nameTok, `Procedura „${nameTok.text}” jest już zdefiniowana`
        + (proc ? ` (wiersz ${proc.tok.line}).` : '.'));
    }
    if (this.globals.has(nameTok.name!)) {
      fail(nameTok, `„${nameTok.text}” jest już nazwą zmiennej – procedura musi nazywać się inaczej.`);
    }
    this.i++;
    const params: string[] = [];
    const addParam = (p: Token) => {
      if (p.kind === 'bad') fail(p, p.error!);
      if (p.kind !== 'word' || p.name === 'ma:') fail(p, `${q(p)} nie może być nazwą parametru.`);
      if (p.keyword) fail(p, `${q(p)} to słowo kluczowe – nie może być nazwą parametru.`);
      if (params.includes(p.name!)) fail(p, `Parametr „${p.colon ? p.text.slice(1) : p.text}” powtarza się w nagłówku.`);
      params.push(p.name!);
    };
    const sameLine = () => {
      const t = this.peek();
      return t && t.line === oto.line ? t : undefined;
    };
    const first = sameLine();
    if (first && first.kind === 'word' && first.name === 'ma:') {
      this.i++;
      for (;;) {
        const p = sameLine();
        if (!p) fail(this.last(), this.last().kind === 'comma'
          ? 'Po przecinku brakuje nazwy parametru.'
          : 'Po „ma:” podaj nazwy parametrów rozdzielone przecinkami, np. „oto kwadrat ma: bok, kąt”.');
        addParam(p!);
        this.i++;
        const sep = sameLine();
        if (!sep) break;
        if (sep.kind !== 'comma') fail(sep, `Nieoczekiwane ${q(sep)} w nagłówku – parametry rozdzielaj przecinkami, a ciało procedury zacznij w nowym wierszu.`);
        this.i++;
      }
    } else {
      for (let p = sameLine(); p; p = sameLine()) {
        if (p.kind === 'word' && p.colon) {
          addParam(p);
          this.i++;
          continue;
        }
        if (p.kind === 'bad') fail(p, p.error!);
        fail(p, `Nieoczekiwane ${q(p)} w nagłówku procedury. Parametry zapisz po „ma:”, np. „oto ${nameTok.text} ma: bok”, a ciało procedury zacznij w nowym wierszu.`);
      }
    }
    proc!.params = params;
    proc!.display = nameTok.text;
    proc!.body = this.parseBlock('end', { proc: proc!, repeatDepth: 0, bracketDepth: 0 }, oto);
  }
}

/** Oblicza wyrażenie bez nazw; undefined, gdy wynik nie jest skończony. */
function tryConstant(e: Expr): number | undefined {
  const v = constant(e);
  return Number.isFinite(v) ? v : undefined;
}

function constant(e: Expr): number {
  switch (e.k) {
    case 'num': return e.value;
    case 'neg': return -constant(e.e);
    case 'bin': {
      const a = constant(e.a), b = constant(e.b);
      switch (e.op) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return b === 0 ? NaN : a / b;
      }
    }
    // eslint-disable-next-line no-fallthrough
    default: return NaN;
  }
}

export function checkWidth(v: number, at: Token): void {
  if (!Number.isInteger(v) || v < LIMITS.widthMin || v > LIMITS.widthMax) {
    fail(at, `Grubość musi być liczbą całkowitą od ${LIMITS.widthMin} do ${LIMITS.widthMax}, a wynosi ${fmt(v)}.`);
  }
}

export function checkRepeat(v: number, at: Token): void {
  if (!Number.isInteger(v) || v < 0 || v > LIMITS.repeat) {
    fail(at, `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${big(LIMITS.repeat)}, a wynosi ${fmt(v)}.`);
  }
}
