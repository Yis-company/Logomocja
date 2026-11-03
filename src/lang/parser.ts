import { lex, LogoSyntaxError, fmtInt, type Token } from './lexer';
import { keywordOf, isReserved, SPATIAL, type Keyword } from './keywords';
import { LIMITS, type Mode } from './types';

export type BinOp = '+' | '-' | '*' | '/';
export type CmpOp = '<' | '>' | '=' | '<=' | '>=' | '<>';

export type RpnOp =
  | { k: 'num'; v: number }
  | { k: 'var'; name: string; display: string }
  | { k: 'rep' }
  | { k: 'neg' }
  | { k: 'bin'; op: BinOp };

export interface Expr {
  rpn: RpnOp[];
  /** First token of the expression: run-time problems with its value are reported here. */
  tok: Token;
  /** True when the expression uses no names and no `nrpowt`. */
  literal: boolean;
  text: string;
}

export type Stmt =
  | { k: 'move'; sign: 1 | -1; arg: Expr; tok: Token }
  | { k: 'turn'; sign: 1 | -1; arg: Expr; tok: Token }
  | { k: 'pitch'; sign: 1 | -1; arg: Expr; tok: Token }
  | { k: 'roll'; sign: 1 | -1; arg: Expr; tok: Token }
  | { k: 'pen'; down: boolean; tok: Token }
  | { k: 'color'; color: string; tok: Token }
  | { k: 'width'; arg: Expr; tok: Token }
  | { k: 'repeat'; count: Expr; body: Stmt[]; tok: Token }
  | { k: 'let'; name: string; display: string; arg: Expr; tok: Token }
  | { k: 'if'; left: Expr; cmp: CmpOp; right: Expr; then: Stmt[]; else: Stmt[] | null; tok: Token }
  | { k: 'stop'; tok: Token }
  | { k: 'home'; tok: Token }
  | { k: 'clear'; tok: Token }
  | { k: 'call'; name: string; args: Expr[]; tok: Token };

export interface ProcDef {
  name: string;
  display: string;
  params: string[];
  body: Stmt[];
  tok: Token;
  nameTok: Token;
}

export interface Program {
  main: Stmt[];
  procs: Map<string, ProcDef>;
  mode: Mode;
  source: string;
}

export interface Prescan {
  procs: Map<string, { params: string[]; display: string }>;
  globals: Set<string>;
  locals: Map<string, Set<string>>;
}

/**
 * Collects procedure signatures and every `niech` target before the real parse, so
 * that calls and names may appear before their definitions. Tolerates broken input.
 */
export function prescan(tokens: Token[]): Prescan {
  const procs = new Map<string, { params: string[]; display: string }>();
  const globals = new Set<string>();
  const locals = new Map<string, Set<string>>();
  let inProc = false;
  let current: Set<string> = new Set();
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.kind !== 'word') continue;
    const kw = keywordOf(t.name);
    if (kw === 'to' && t.lineStart && !inProc) {
      inProc = true;
      current = new Set();
      const nt = tokens[i + 1]!;
      if (nt.kind === 'word' && nt.line === t.line && !isReserved(nt.name) && !procs.has(nt.name)) {
        const params: string[] = [];
        for (let j = i + 2; j < tokens.length && tokens[j]!.line === t.line && tokens[j]!.kind !== 'eof'; j++) {
          const p = tokens[j]!;
          if (p.kind === 'ref' || (p.kind === 'word' && !(p.name === 'ma' && params.length === 0 && j === i + 2))) {
            if (!isReserved(p.name)) params.push(p.name);
          }
        }
        procs.set(nt.name, { params, display: nt.text });
        locals.set(nt.name, current);
      }
      continue;
    }
    if (kw === 'end' && inProc && t.lineStart && t.lineEnd) {
      inProc = false;
      continue;
    }
    if (kw === 'let') {
      const nt = tokens[i + 1]!;
      if ((nt.kind === 'word' || nt.kind === 'ref') && !isReserved(nt.name)) {
        (inProc ? current : globals).add(nt.name);
      }
    }
  }
  return { procs, globals, locals };
}

interface OpEntry {
  k: 'neg' | 'pos' | 'bin' | 'paren';
  op?: BinOp;
  tok: Token;
}

function prec(o: OpEntry): number {
  if (o.k === 'neg' || o.k === 'pos') return 3;
  return o.op === '*' || o.op === '/' ? 2 : 1;
}

/** Compact number formatting for messages, in the language's own notation (dot decimals). */
export function fmtNum(v: number): string {
  if (!Number.isFinite(v)) return String(v);
  if (Number.isInteger(v)) return Math.abs(v) >= 10000 ? fmtInt(v) : String(v);
  const r = Math.round(v * 1e6) / 1e6;
  return String(r === 0 ? v : r);
}

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const dd = n % 100;
  if (d >= 2 && d <= 4 && !(dd >= 12 && dd <= 14)) return few;
  return many;
}

/** "przyjmuje 1 argument / 2 argumenty / 5 argumentów" (accusative). */
export function argumentsWord(n: number): string {
  return `${n} ${plural(n, 'argument', 'argumenty', 'argumentów')}`;
}

/** "wymaga 1 argumentu / 2 argumentów" (genitive). */
export function argumentsGenitive(n: number): string {
  return `${n} ${n === 1 ? 'argumentu' : 'argumentów'}`;
}

/** Evaluates a literal RPN expression; throws a message string on a bad result. */
export function evalLiteral(rpn: RpnOp[]): number {
  const st: number[] = [];
  for (const op of rpn) {
    switch (op.k) {
      case 'num':
        st.push(op.v);
        break;
      case 'neg':
        st.push(-st.pop()!);
        break;
      case 'bin': {
        const b = st.pop()!;
        const a = st.pop()!;
        st.push(applyBin(op.op, a, b));
        break;
      }
      default:
        throw new Error('not literal');
    }
  }
  return st[0]!;
}

export class EvalProblem extends Error {}

export function applyBin(op: BinOp, a: number, b: number): number {
  let r: number;
  switch (op) {
    case '+':
      r = a + b;
      break;
    case '-':
      r = a - b;
      break;
    case '*':
      r = a * b;
      break;
    case '/':
      if (b === 0) throw new EvalProblem('Dzielenie przez zero. Sprawdź, czy dzielnik w tym wyrażeniu nie wynosi 0.');
      r = a / b;
      break;
  }
  if (!Number.isFinite(r)) throw new EvalProblem('Wynik obliczenia jest za duży: to nie jest skończona liczba.');
  return r;
}

export function widthProblem(v: number): string | null {
  if (Number.isInteger(v) && v >= LIMITS.widthMin && v <= LIMITS.widthMax) return null;
  return `Grubość musi być liczbą całkowitą od 1 do 12, a wychodzi ${fmtNum(v)}.`;
}

export function repeatProblem(v: number): string | null {
  if (Number.isInteger(v) && v >= 0 && v <= LIMITS.repeatMax) return null;
  return `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${fmtInt(LIMITS.repeatMax)}, a wychodzi ${fmtNum(v)}.`;
}

class Parser {
  private pos = 0;
  private procs = new Map<string, ProcDef>();
  private proc: ProcDef | null = null;
  private procParams = new Set<string>();
  private procLocals = new Set<string>();
  private bracketDepth = 0;
  private repeatDepth = 0;
  private lastStmt: Stmt | null = null;

  constructor(
    private source: string,
    private tokens: Token[],
    private mode: Mode,
    private pre: Prescan,
  ) {}

  private peek(o = 0): Token {
    return this.tokens[Math.min(this.pos + o, this.tokens.length - 1)]!;
  }

  private next(): Token {
    const t = this.tokens[this.pos]!;
    if (this.pos < this.tokens.length - 1) this.pos++;
    return t;
  }

  private err(tok: Token, message: string): never {
    throw new LogoSyntaxError(message, tok.line, tok.col);
  }

  parseProgram(): Program {
    const main: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.kind === 'eof') break;
      if (t.kind === 'word') {
        const kw = keywordOf(t.name);
        if (kw === 'to') {
          this.parseDefinition();
          continue;
        }
        if (kw === 'end') {
          this.err(t, `„${t.text}” kończy definicję procedury, ale żadna procedura nie została tu rozpoczęta słowem „oto”.`);
        }
      }
      main.push(this.parseStatement());
    }
    return { main, procs: this.procs, mode: this.mode, source: this.source };
  }

  private parseDefinition(): void {
    const oto = this.next();
    if (!oto.lineStart) {
      this.err(oto, `Definicja procedury musi zaczynać się na początku wiersza. Przenieś „${oto.text}” do nowej linii.`);
    }
    const nameTok = this.peek();
    if (nameTok.kind === 'eof' || nameTok.line !== oto.line) {
      this.err(oto, `Po „${oto.text}” podaj w tym samym wierszu nazwę procedury, np. „oto kwadrat”.`);
    }
    if (nameTok.kind !== 'word') {
      this.err(nameTok, `„${nameTok.text}” nie może być nazwą procedury. Nazwa musi zaczynać się literą, np. „kwadrat”.`);
    }
    if (isReserved(nameTok.name)) {
      this.err(nameTok, `„${nameTok.text}” to słowo języka Logo, więc procedura musi mieć inną nazwę.`);
    }
    const existing = this.procs.get(nameTok.name);
    if (existing) {
      this.err(
        nameTok,
        `Procedura „${nameTok.text}” jest już zdefiniowana w wierszu ${existing.tok.line}. Każdą nazwę można zdefiniować tylko raz.`,
      );
    }
    this.next();
    const params = this.parseHeader(oto, nameTok);
    const def: ProcDef = { name: nameTok.name, display: nameTok.text, params, body: [], tok: oto, nameTok };
    this.procs.set(def.name, def);

    this.proc = def;
    this.procParams = new Set(params);
    this.procLocals = this.pre.locals.get(def.name) ?? new Set();
    this.bracketDepth = 0;
    this.repeatDepth = 0;
    this.lastStmt = null;
    for (;;) {
      const t = this.peek();
      if (t.kind === 'eof') {
        this.err(oto, `Brakuje „już” na końcu procedury „${def.display}”. Zakończ definicję słowem „już” w osobnym wierszu.`);
      }
      if (t.kind === 'word') {
        const kw = keywordOf(t.name);
        if (kw === 'end') {
          if (t.lineStart && t.lineEnd) {
            this.next();
            break;
          }
          this.err(t, `„${t.text}” musi stać sam w osobnym wierszu, żeby zakończyć procedurę „${def.display}”.`);
        }
        if (kw === 'to') {
          this.err(
            t,
            `Nie można definiować procedury wewnątrz innej procedury. Najpierw zakończ „${def.display}” słowem „już”.`,
          );
        }
      }
      def.body.push(this.parseStatement());
    }
    this.proc = null;
    this.procParams = new Set();
    this.procLocals = new Set();
    this.lastStmt = null;
  }

  private parseHeader(oto: Token, nameTok: Token): string[] {
    const line = oto.line;
    const params: string[] = [];
    const add = (t: Token) => {
      if (t.kind === 'word' && isReserved(t.name)) {
        this.err(t, `„${t.text}” to słowo języka Logo, więc nie może być nazwą parametru.`);
      }
      if (t.kind === 'ref' && isReserved(t.name)) {
        this.err(t, `„${t.text.slice(1)}” to słowo języka Logo, więc nie może być nazwą parametru.`);
      }
      if (params.includes(t.name)) this.err(t, `Parametr „${t.kind === 'ref' ? t.text.slice(1) : t.text}” powtarza się w nagłówku.`);
      params.push(t.name);
    };
    const onLine = (t: Token) => t.kind !== 'eof' && t.line === line;
    const garbage = (t: Token): never =>
      this.err(
        t,
        `W wierszu nagłówka po nazwie procedury mogą stać tylko parametry, np. „oto kwadrat ma: bok” albo „oto kwadrat :bok”. Treść procedury zacznij w następnym wierszu.`,
      );

    let t = this.peek();
    if (!onLine(t)) return params;
    if (t.kind === 'word' && t.name === 'ma') {
      let last = this.next();
      if (onLine(this.peek()) && this.peek().kind === 'colon') last = this.next();
      let expectName = true;
      for (;;) {
        t = this.peek();
        if (!onLine(t)) {
          if (expectName) {
            this.err(last, `Po „ma:” wypisz nazwy parametrów oddzielone przecinkami, np. „oto kwadrat ma: bok, kąt”.`);
          }
          break;
        }
        if (expectName) {
          if (t.kind === 'word' || t.kind === 'ref') {
            add(t);
            last = this.next();
            expectName = false;
            continue;
          }
          this.err(t, `Tu powinna stać nazwa parametru, np. „bok”.`);
        }
        if (t.kind === 'comma') {
          last = this.next();
          expectName = true;
          continue;
        }
        if (t.kind === 'word' || t.kind === 'ref') {
          this.err(t, `Parametry oddziel przecinkami, np. „ma: bok, kąt”.`);
        }
        garbage(t);
      }
      return params;
    }
    if (t.kind === 'ref') {
      while (onLine(this.peek()) && this.peek().kind === 'ref') add(this.next());
      if (onLine(this.peek())) garbage(this.peek());
      return params;
    }
    void nameTok;
    return garbage(t);
  }

  private inScope(name: string): boolean {
    if (this.proc) {
      return this.procParams.has(name) || this.procLocals.has(name) || this.pre.globals.has(name);
    }
    return this.pre.globals.has(name);
  }

  private parseStatement(): Stmt {
    const stmt = this.parseStatementInner();
    this.lastStmt = stmt;
    return stmt;
  }

  private parseStatementInner(): Stmt {
    const t = this.peek();
    switch (t.kind) {
      case 'word': {
        const kw = keywordOf(t.name);
        if (kw) return this.parseCommand(kw);
        if (this.pre.procs.has(t.name)) return this.parseCall();
        if (this.inScope(t.name)) {
          this.err(t, `„${t.text}” to zmienna, a tu powinno stać polecenie. Może brakuje polecenia przed nią, np. „np ${t.text}”?`);
        }
        this.err(
          t,
          `Nieznane polecenie „${t.text}”. Sprawdź pisownię albo zdefiniuj procedurę o tej nazwie: „oto ${t.text}”.`,
        );
      }
      // falls through (unreachable)
      case 'num':
      case 'lparen':
      case 'ref':
        return this.stray(t);
      case 'op':
        if (t.text === '+' || t.text === '-') return this.stray(t);
        return this.err(t, `Nieoczekiwany znak „${t.text}”. Działanie musi stać między dwiema wartościami, np. „np 10 ${t.text} 2”.`);
      case 'rbrack':
        return this.err(t, `Nadmiarowy nawias „]”: nie ma do niego pasującego „[”.`);
      case 'lbrack':
        return this.err(t, `Nieoczekiwany nawias „[”. Nawias kwadratowy otwiera treść polecenia powtórz, jeśli albo jeżeli.`);
      case 'rparen':
        return this.err(t, `Nadmiarowy nawias „)”: nie ma do niego pasującego „(”.`);
      case 'str':
        return this.err(t, `Kolor może stać tylko po poleceniu „kolor”, np. kolor "#16866a".`);
      case 'cmp':
        return this.err(t, `Porównanie „${t.text}” może stać tylko w warunku polecenia jeśli albo jeżeli.`);
      case 'comma':
        return this.err(t, `Przecinek oddziela tylko parametry w nagłówku procedury („oto kwadrat ma: bok, kąt”).`);
      case 'colon':
        return this.err(t, `Dwukropek może stać tylko w nagłówku procedury („ma:”) albo tuż przed nazwą („:bok”).`);
      default:
        return this.err(t, `Nieoczekiwany element „${t.text}”.`);
    }
  }

  /** A value standing where a command is expected. */
  private stray(t: Token): never {
    let shown = t.text;
    if (t.kind === 'op') {
      const nt = this.peek(1);
      if (!nt.spaceBefore && nt.kind !== 'eof') shown += nt.text;
    }
    let msg = `Nieoczekiwana wartość „${shown}”: tu powinno stać polecenie.`;
    if (t.kind === 'op' && t.spaceBefore && !t.spaceAfter) {
      msg += ` Jeśli to działanie, postaw odstępy po obu stronach znaku „${t.text}” (np 10 ${t.text} 5) albo nie stawiaj ich wcale (np 10${t.text}5).`;
    } else if (this.lastStmt && this.lastStmt.k === 'call') {
      const def = this.pre.procs.get(this.lastStmt.name)!;
      msg += ` Procedura „${def.display}” przyjmuje ${argumentsWord(def.params.length)}.`;
    } else if (this.lastStmt && 'arg' in this.lastStmt) {
      msg += ` Polecenie „${this.lastStmt.tok.text}” przyjmuje tylko jeden argument.`;
    }
    return this.err(t, msg);
  }

  private expectExpr(cmd: Token, missing: string): Expr {
    const t = this.peek();
    const e = this.parseExpr();
    if (!e) this.err(t.kind === 'eof' ? cmd : t, missing);
    return e;
  }

  private parseCommand(kw: Keyword): Stmt {
    const tok = this.next();
    const name = tok.text;
    const needNumber = `Polecenie „${name}” wymaga argumentu: liczby albo wyrażenia, np. „${name} 50”.`;
    if (SPATIAL.has(kw) && this.mode === '2d') {
      this.err(tok, `Polecenie „${name}” działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`);
    }
    switch (kw) {
      case 'forward':
      case 'back':
        return { k: 'move', sign: kw === 'forward' ? 1 : -1, arg: this.expectExpr(tok, needNumber), tok };
      case 'right':
      case 'left':
        return { k: 'turn', sign: kw === 'right' ? 1 : -1, arg: this.expectExpr(tok, `Polecenie „${name}” wymaga kąta w stopniach, np. „${name} 90”.`), tok };
      case 'pitchup':
      case 'pitchdown':
        return { k: 'pitch', sign: kw === 'pitchup' ? 1 : -1, arg: this.expectExpr(tok, `Polecenie „${name}” wymaga kąta w stopniach, np. „${name} 90”.`), tok };
      case 'rollright':
      case 'rollleft':
        return { k: 'roll', sign: kw === 'rollright' ? 1 : -1, arg: this.expectExpr(tok, `Polecenie „${name}” wymaga kąta w stopniach, np. „${name} 90”.`), tok };
      case 'penup':
        return { k: 'pen', down: false, tok };
      case 'pendown':
        return { k: 'pen', down: true, tok };
      case 'stop':
        return { k: 'stop', tok };
      case 'home':
        return { k: 'home', tok };
      case 'clear':
        return { k: 'clear', tok };
      case 'color': {
        const t = this.peek();
        if (t.kind !== 'str') {
          this.err(t.kind === 'eof' ? tok : t, `Po poleceniu „${name}” podaj kolor w cudzysłowie: # i sześć cyfr szesnastkowych, np. ${name} "#16866a".`);
        }
        if (!/^#[0-9a-fA-F]{6}$/.test(t.name)) {
          this.err(t, `${t.text} nie jest poprawnym kolorem. Kolor to # i sześć cyfr szesnastkowych (0–9, a–f), np. "#16866a".`);
        }
        this.next();
        return { k: 'color', color: t.name.toLowerCase(), tok };
      }
      case 'width': {
        const arg = this.expectExpr(tok, `Polecenie „${name}” wymaga liczby całkowitej od 1 do 12, np. „${name} 3”.`);
        if (arg.literal) this.checkLiteral(arg, widthProblem);
        return { k: 'width', arg, tok };
      }
      case 'repeat': {
        const count = this.expectExpr(tok, `Polecenie „${name}” wymaga liczby powtórzeń i treści w nawiasach, np. „${name} 4 [np 50 pw 90]”.`);
        if (count.literal) this.checkLiteral(count, repeatProblem);
        this.repeatDepth++;
        const body = this.parseBody(tok, `Po liczbie powtórzeń otwórz nawias „[” z poleceniami do powtórzenia, np. „${name} 4 [np 50 pw 90]”.`);
        this.repeatDepth--;
        return { k: 'repeat', count, body, tok };
      }
      case 'let': {
        const t = this.peek();
        if (t.kind !== 'word' && t.kind !== 'ref') {
          this.err(t.kind === 'eof' ? tok : t, `Po „${name}” podaj nazwę zmiennej i jej wartość, np. „${name} bok 50”.`);
        }
        const display = t.kind === 'ref' ? t.text.slice(1) : t.text;
        if (isReserved(t.name)) {
          this.err(t, `„${display}” to słowo języka Logo, więc nie może być nazwą zmiennej.`);
        }
        if (this.pre.procs.has(t.name) && !(this.proc && this.procParams.has(t.name))) {
          this.err(t, `„${display}” to nazwa procedury, więc zmienna musi nazywać się inaczej.`);
        }
        this.next();
        const arg = this.expectExpr(tok, `Po nazwie zmiennej „${display}” podaj wartość, np. „${name} ${display} 50”.`);
        return { k: 'let', name: t.name, display, arg, tok };
      }
      case 'if':
      case 'ifelse': {
        const left = this.expectExpr(tok, `Po „${name}” podaj warunek, np. „${name} bok > 10 [...]”.`);
        const c = this.peek();
        if (c.kind !== 'cmp') {
          this.err(c.kind === 'eof' ? tok : c, `W warunku brakuje porównania: <, >, =, <=, >= albo <>, np. „${name} bok > 10 [...]”.`);
        }
        this.next();
        const right = this.expectExpr(tok, `Po porównaniu „${c.text}” podaj drugą wartość, np. „${name} bok ${c.text} 10 [...]”.`);
        const then = this.parseBody(tok, kw === 'if'
          ? `Po warunku otwórz nawias „[” z poleceniami, np. „${name} bok > 10 [np bok]”.`
          : `Po warunku podaj dwie treści w nawiasach: „[...]” gdy warunek jest spełniony i „[...]” gdy nie jest.`);
        let otherwise: Stmt[] | null = null;
        if (kw === 'ifelse') {
          otherwise = this.parseBody(tok, `„${name}” potrzebuje drugiego nawiasu „[...]” z poleceniami na wypadek, gdy warunek nie jest spełniony.`);
        }
        return { k: 'if', left, cmp: c.text as CmpOp, right, then, else: otherwise, tok };
      }
      case 'repcount':
        return this.stray(tok);
      case 'to':
        return this.err(tok, `Procedury definiuje się tylko na najwyższym poziomie programu: „${name}” nie może stać wewnątrz nawiasów ani innej procedury.`);
      case 'end':
        return this.err(tok, `„${name}” kończy definicję procedury, ale żadna procedura nie została tu rozpoczęta słowem „oto”.`);
    }
  }

  private checkLiteral(e: Expr, problem: (v: number) => string | null): void {
    let v: number;
    try {
      v = evalLiteral(e.rpn);
    } catch (ex) {
      if (ex instanceof EvalProblem) this.err(e.tok, ex.message);
      throw ex;
    }
    const p = problem(v);
    if (p) this.err(e.tok, p);
  }

  private parseBody(cmd: Token, missing: string): Stmt[] {
    const open = this.peek();
    if (open.kind !== 'lbrack') this.err(open.kind === 'eof' ? cmd : open, missing);
    if (this.bracketDepth + 1 > LIMITS.bracketDepth) {
      this.err(open, `Za głębokie zagnieżdżenie nawiasów „[ ]”: limit to ${LIMITS.bracketDepth} poziomy.`);
    }
    this.next();
    this.bracketDepth++;
    const body: Stmt[] = [];
    const saved = this.lastStmt;
    this.lastStmt = null;
    for (;;) {
      const t = this.peek();
      if (t.kind === 'rbrack') {
        this.next();
        break;
      }
      if (t.kind === 'eof') this.err(open, `Nawias „[” nie został zamknięty. Dopisz „]” na końcu treści.`);
      if (t.kind === 'word') {
        const kw = keywordOf(t.name);
        if (kw === 'to') {
          this.err(t, `Procedury definiuje się tylko na najwyższym poziomie programu: „${t.text}” nie może stać wewnątrz nawiasów.`);
        }
        if (kw === 'end' && this.proc) {
          this.err(open, `Nawias „[” nie został zamknięty przed końcem procedury „${this.proc.display}”. Dopisz „]”.`);
        }
      }
      body.push(this.parseStatement());
    }
    this.bracketDepth--;
    this.lastStmt = saved;
    return body;
  }

  private parseCall(): Stmt {
    const tok = this.next();
    const sig = this.pre.procs.get(tok.name)!;
    const args: Expr[] = [];
    for (let i = 0; i < sig.params.length; i++) {
      const t = this.peek();
      const e = this.parseExpr();
      if (!e) {
        this.err(
          t.kind === 'eof' ? tok : t,
          `Procedura „${tok.text}” wymaga ${argumentsGenitive(sig.params.length)}, a podano ${i}.`,
        );
      }
      args.push(e);
    }
    return { k: 'call', name: tok.name, args, tok };
  }

  private canStartOperand(t: Token): boolean {
    switch (t.kind) {
      case 'num':
      case 'lparen':
      case 'ref':
        return true;
      case 'op':
        return t.text === '+' || t.text === '-';
      case 'word': {
        const kw = keywordOf(t.name);
        if (kw) return kw === 'repcount';
        if (this.pre.procs.has(t.name) && !this.inScope(t.name)) return false;
        return true;
      }
      default:
        return false;
    }
  }

  /** Resolves a name in value position; null when the word cannot be a value at all. */
  private resolveValue(t: Token): RpnOp | null {
    if (t.kind === 'word') {
      const kw = keywordOf(t.name);
      if (kw === 'repcount') {
        if (this.repeatDepth === 0) {
          this.err(
            t,
            this.proc
              ? `„${t.text}” może stać tylko wewnątrz nawiasów powtórz w tej samej procedurze. Tu, w procedurze „${this.proc.display}”, nie ma wokół niego żadnego powtórz.`
              : `„${t.text}” może stać tylko wewnątrz nawiasów polecenia powtórz: podaje numer bieżącego powtórzenia.`,
          );
        }
        return { k: 'rep' };
      }
      if (kw) return null;
    }
    const display = t.kind === 'ref' ? t.text.slice(1) : t.text;
    if (this.inScope(t.name)) return { k: 'var', name: t.name, display };
    if (t.kind === 'word' && this.pre.procs.has(t.name)) return null;
    if (t.kind === 'ref' && isReserved(t.name)) {
      this.err(t, `„${display}” to słowo języka Logo, a nie nazwa parametru ani zmiennej.`);
    }
    if (this.proc) {
      this.err(
        t,
        `Nieznana nazwa „${display}”: to nie jest parametr procedury „${this.proc.display}” ani zmienna nadana przez „niech”.`,
      );
    }
    this.err(t, `Nieznana nazwa „${display}”: nie ma takiej zmiennej. Nadaj jej wartość poleceniem „niech ${display} …”.`);
  }

  private parseExpr(): Expr | null {
    const start = this.peek();
    if (!this.canStartOperand(start)) return null;
    const out: RpnOp[] = [];
    const ops: OpEntry[] = [];
    let expectOperand = true;
    let depth = 0;
    let literal = true;
    let last = start;
    const flush = (o: OpEntry) => {
      if (o.k === 'neg') out.push({ k: 'neg' });
      else if (o.k === 'bin') out.push({ k: 'bin', op: o.op! });
    };
    for (;;) {
      const t = this.peek();
      if (expectOperand) {
        if (t.kind === 'op' && (t.text === '+' || t.text === '-')) {
          ops.push({ k: t.text === '-' ? 'neg' : 'pos', tok: t });
          last = this.next();
          continue;
        }
        if (t.kind === 'num') {
          out.push({ k: 'num', v: t.value });
          last = this.next();
          expectOperand = false;
          continue;
        }
        if (t.kind === 'lparen') {
          ops.push({ k: 'paren', tok: t });
          depth++;
          last = this.next();
          continue;
        }
        if (t.kind === 'word' || t.kind === 'ref') {
          const r = this.resolveValue(t);
          if (r) {
            out.push(r);
            literal = false;
            last = this.next();
            expectOperand = false;
            continue;
          }
        }
        if (t.kind === 'eof') this.err(last, `Po „${last.text}” brakuje liczby albo nazwy.`);
        this.err(t, `Po „${last.text}” brakuje liczby albo nazwy, a stoi „${t.text}”.`);
      }
      if (t.kind === 'op') {
        if (t.spaceBefore === t.spaceAfter) {
          const o: OpEntry = { k: 'bin', op: t.text as BinOp, tok: t };
          while (ops.length) {
            const top = ops[ops.length - 1]!;
            if (top.k === 'paren' || prec(top) < prec(o)) break;
            flush(ops.pop()!);
          }
          ops.push(o);
          last = this.next();
          expectOperand = true;
          continue;
        }
        if (!t.spaceBefore) {
          this.err(
            t,
            `Znak „${t.text}” ma odstęp tylko z prawej strony. Postaw odstępy po obu stronach (10 ${t.text} 5) albo nie stawiaj ich wcale (10${t.text}5).`,
          );
        }
      } else if (t.kind === 'rparen' && depth > 0) {
        while (ops.length && ops[ops.length - 1]!.k !== 'paren') flush(ops.pop()!);
        ops.pop();
        depth--;
        last = this.next();
        continue;
      }
      if (depth > 0) {
        let open = start;
        for (let i = ops.length - 1; i >= 0; i--) {
          if (ops[i]!.k === 'paren') {
            open = ops[i]!.tok;
            break;
          }
        }
        if (t.kind === 'eof') this.err(open, `Nawias „(” nie został zamknięty. Dopisz „)”.`);
        if (t.kind === 'op') {
          this.err(
            t,
            `Znak „${t.text}” ma odstęp tylko z lewej strony. Postaw odstępy po obu stronach (10 ${t.text} 5) albo nie stawiaj ich wcale (10${t.text}5).`,
          );
        }
        this.err(t, `Brakuje nawiasu „)” zamykającego „(” z wiersza ${open.line}, kolumny ${open.col}.`);
      }
      while (ops.length) flush(ops.pop()!);
      break;
    }
    return { rpn: out, tok: start, literal, text: this.source.slice(start.offset, last.end) };
  }
}

export function parse(source: string, mode: Mode): Program {
  const { tokens } = lex(source);
  const pre = prescan(tokens);
  return new Parser(source, tokens, mode, pre).parseProgram();
}
