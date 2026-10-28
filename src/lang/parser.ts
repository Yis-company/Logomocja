import { type Arg, type Comparison, type Condition, type Expr, type ProcDef, type Program, type Stmt } from './ast';
import { type CommandDef, type CommandId, commandAvailable, DEFINITION_WORDS, END_WORDS, findCommand, isReservedWord, REPEAT_VALUE_WORDS } from './commands';
import { LogoFailure, type Position } from './errors';
import { tokenize, type Token } from './lexer';
import { LIMITS, type Mode } from './limits';

interface Header {
  name: string;
  nameTok: Token;
  params: { name: string; tok: Token }[];
  /** Index of the newline or end-of-file token that ends the header line. */
  end: number;
}

const COMPARISONS: readonly string[] = ['<', '>', '=', '<=', '>=', '<>'];
const HEX_COLOUR = /^#[0-9a-fA-F]{6}$/;

function at(t: Token): Position {
  return { line: t.line, column: t.column };
}

function describe(t: Token): string {
  switch (t.type) {
    case 'eof':
      return 'koniec programu';
    case 'newline':
      return 'koniec wiersza';
    case 'string':
      return `ciąg „${t.text}”`;
    case 'number':
      return `liczba „${t.text}”`;
    case 'op':
      return `operator „${t.text}”`;
    default:
      return `„${t.text}”`;
  }
}

/** Evaluates an expression that has no names; returns null when it cannot be known statically. */
export function constantValue(e: Expr): number | null {
  switch (e.k) {
    case 'num':
      return e.v;
    case 'var':
    case 'nrpowt':
      return null;
    case 'neg': {
      const v = constantValue(e.e);
      return v === null ? null : -v;
    }
    case 'bin': {
      const l = constantValue(e.l);
      const r = constantValue(e.r);
      if (l === null || r === null) return null;
      let v: number;
      switch (e.op) {
        case '+':
          v = l + r;
          break;
        case '-':
          v = l - r;
          break;
        case '*':
          v = l * r;
          break;
        case '/':
          if (r === 0) return null;
          v = l / r;
          break;
      }
      return Number.isFinite(v) ? v : null;
    }
  }
}

class Parser {
  private readonly toks: Token[];
  private i = 0;
  private readonly headers = new Map<string, Header>();
  private readonly globals = new Set<string>();
  private readonly localsByProc = new Map<string, Set<string>>();
  private readonly procs = new Map<string, ProcDef>();
  private curProc: ProcDef | null = null;
  private repeatDepth = 0;
  private bracketDepth = 0;

  constructor(
    source: string,
    private readonly mode: Mode,
  ) {
    this.toks = tokenize(source);
  }

  parse(): Program {
    this.prescan();
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.type === 'eof') break;
      if (t.type === 'word' && DEFINITION_WORDS.includes(t.name)) {
        this.parseDefinition();
      } else if (t.type === 'word' && END_WORDS.includes(t.name)) {
        throw new LogoFailure('„już” bez odpowiadającego „oto”.', at(t));
      } else {
        body.push(this.parseStatement());
      }
    }
    return { mode: this.mode, body, procs: this.procs, globals: this.globals };
  }

  // ---- pre-scan: headers, arities and the names that may be read ----

  private prescan(): void {
    let current: string | null = null;
    for (let j = 0; j < this.toks.length; j++) {
      const t = this.toks[j]!;
      const lineStart = j === 0 || this.toks[j - 1]!.type === 'newline';
      if (t.type === 'word' && lineStart && DEFINITION_WORDS.includes(t.name)) {
        let header: Header | null = null;
        try {
          header = this.readHeader(j);
        } catch {
          header = null;
        }
        if (header && !this.headers.has(header.name)) {
          this.headers.set(header.name, header);
          this.localsByProc.set(header.name, new Set(header.params.map((p) => p.name)));
        }
        current = header ? header.name : null;
      } else if (t.type === 'word' && lineStart && END_WORDS.includes(t.name)) {
        current = null;
      } else if (t.type === 'word' && t.name === 'niech') {
        const target = this.toks[j + 1];
        if (target && target.type === 'word') {
          if (current !== null) this.localsByProc.get(current)?.add(target.name);
          else this.globals.add(target.name);
        }
      }
    }
  }

  /** Reads `oto name [ma: | :]params` starting at the `oto` token index. Throws on malformed headers. */
  private readHeader(j: number): Header {
    const ot = this.toks[j]!;
    const nameTok = this.toks[j + 1];
    if (!nameTok || nameTok.type === 'newline' || nameTok.type === 'eof') {
      throw new LogoFailure('Oczekiwano nazwy procedury po „oto”.', at(ot));
    }
    if (nameTok.type !== 'word') {
      throw new LogoFailure(`Oczekiwano nazwy procedury, a znaleziono ${describe(nameTok)}.`, at(nameTok));
    }
    if (isReservedWord(nameTok.name)) {
      throw new LogoFailure(`„${nameTok.text}” jest nazwą polecenia i nie może być nazwą procedury.`, at(nameTok));
    }
    let k = j + 2;
    const params: Header['params'] = [];
    const isEnd = (t: Token | undefined): boolean => !t || t.type === 'newline' || t.type === 'eof';
    const first = this.toks[k];
    if (first && first.type === 'word' && first.name === 'ma') {
      k++;
      const colon = this.toks[k];
      if (colon && colon.type === 'colon') k++;
      else if (!colon || colon.type !== 'colonvar') {
        throw new LogoFailure('Oczekiwano „:” po słowie „ma”.', at(colon && !isEnd(colon) ? colon : first));
      }
    } else if (first && first.type === 'word') {
      throw new LogoFailure('Oczekiwano słowa „ma:” przed listą parametrów.', at(first));
    }
    while (!isEnd(this.toks[k])) {
      const t = this.toks[k]!;
      if (t.type === 'punct' && t.text === ',') {
        k++;
        continue;
      }
      if (t.type === 'colonvar' || t.type === 'word') {
        if (isReservedWord(t.name)) {
          throw new LogoFailure(`„${t.text}” jest nazwą polecenia i nie może być nazwą parametru.`, at(t));
        }
        if (params.some((p) => p.name === t.name)) {
          throw new LogoFailure(`Parametr „${t.text}” występuje w nagłówku więcej niż raz.`, at(t));
        }
        params.push({ name: t.name, tok: t });
        k++;
        continue;
      }
      throw new LogoFailure(`Oczekiwano nazwy parametru, a znaleziono ${describe(t)}.`, at(t));
    }
    return { name: nameTok.name, nameTok, params, end: k };
  }

  // ---- token cursor ----

  /** The next significant token; newlines are skipped (they only matter for headers and `już`). */
  private peek(): Token {
    while (this.toks[this.i]!.type === 'newline') this.i++;
    return this.toks[this.i]!;
  }

  private next(): Token {
    const t = this.peek();
    this.i++;
    return t;
  }

  private atLineStart(index: number): boolean {
    return index === 0 || this.toks[index - 1]!.type === 'newline';
  }

  private startsExpr(t: Token): boolean {
    switch (t.type) {
      case 'number':
      case 'colonvar':
        return true;
      case 'word':
        return REPEAT_VALUE_WORDS.includes(t.name) || !isReservedWord(t.name);
      case 'punct':
        return t.text === '(';
      case 'op':
        return t.text === '+' || t.text === '-';
      default:
        return false;
    }
  }

  /** Reports a missing piece at the token where it should have started, or at the command when the program ends. */
  private missing(found: Token, cmd: Token, message: string): LogoFailure {
    return new LogoFailure(message, at(found.type === 'eof' ? cmd : found));
  }

  // ---- statements ----

  private parseStatement(): Stmt {
    const t = this.peek();
    switch (t.type) {
      case 'error':
        throw new LogoFailure(t.message ?? 'Błąd składni.', at(t));
      case 'word': {
        if (DEFINITION_WORDS.includes(t.name)) {
          throw new LogoFailure('Definicji procedury nie można umieścić w bloku ani wewnątrz innej procedury.', at(t));
        }
        if (END_WORDS.includes(t.name)) {
          throw new LogoFailure('„już” bez odpowiadającego „oto”.', at(t));
        }
        const def = findCommand(t.name);
        if (def) return this.parseCommand(def, t);
        if (this.headers.has(t.name)) return this.parseCall(t);
        throw new LogoFailure(`Nieznane polecenie „${t.text}”.`, at(t));
      }
      case 'punct':
        if (t.text === ']') throw new LogoFailure('Nieoczekiwany nawias „]”.', at(t));
        if (t.text === '[') throw new LogoFailure('Nieoczekiwany nawias „[”: przed nawiasem brakuje polecenia.', at(t));
        throw new LogoFailure(`Oczekiwano polecenia, a znaleziono ${describe(t)}.`, at(t));
      case 'op': {
        const hint = t.spaceBefore !== t.spaceAfter ? ' Operator musi mieć spacje po obu stronach albo po żadnej.' : '';
        throw new LogoFailure(`Oczekiwano polecenia, a znaleziono ${describe(t)}.${hint}`, at(t));
      }
      case 'eof':
        throw new LogoFailure('Oczekiwano polecenia.', at(t));
      default:
        throw new LogoFailure(`Oczekiwano polecenia, a znaleziono ${describe(t)}.`, at(t));
    }
  }

  private parseCommand(def: CommandDef, head: Token): Stmt {
    if (!commandAvailable(def, this.mode)) {
      throw new LogoFailure(`Polecenie „${head.text}” działa tylko w trybie 3D.`, at(head));
    }
    this.next();
    const pos = at(head);
    const length = head.length;
    const cmd = (id: CommandId, args: Arg[]): Stmt => ({ k: 'cmd', op: id, args, pos, length });

    switch (def.args) {
      case 'none':
        return cmd(def.id, []);

      case 'expr': {
        const arg = this.parseArg(head, `Brakuje argumentu polecenia „${head.text}”: oczekiwano liczby lub wyrażenia.`);
        if (def.id === 'width') {
          const v = arg.literal;
          if (v !== null && (!Number.isInteger(v) || v < LIMITS.widthMin || v > LIMITS.widthMax)) {
            throw new LogoFailure(`Grubość musi być liczbą całkowitą od ${LIMITS.widthMin} do ${LIMITS.widthMax} (podano ${v}).`, arg.pos);
          }
        }
        return cmd(def.id, [arg]);
      }

      case 'colour': {
        const t = this.peek();
        if (t.type !== 'string') {
          throw this.missing(t, head, 'Oczekiwano koloru w cudzysłowie, np. "#16866a".');
        }
        this.next();
        if (!HEX_COLOUR.test(t.name)) {
          throw new LogoFailure(`Nieprawidłowy kolor ${t.text}: oczekiwano „#” i sześciu cyfr szesnastkowych, np. "#16866a".`, at(t));
        }
        return { k: 'color', value: t.name.toLowerCase(), pos, length };
      }

      case 'expr-repeat': {
        const count = this.parseArg(head, `Brakuje liczby powtórzeń w poleceniu „${head.text}”.`);
        if (count.literal !== null && (!Number.isInteger(count.literal) || count.literal < 0 || count.literal > LIMITS.repeatMax)) {
          throw new LogoFailure(`Liczba powtórzeń musi być liczbą całkowitą od 0 do ${LIMITS.repeatMax} (podano ${count.literal}).`, count.pos);
        }
        this.repeatDepth++;
        const body = this.parseBlock(`Oczekiwano „[” z ciałem powtórzenia po liczbie powtórzeń.`, head);
        this.repeatDepth--;
        return { k: 'repeat', count, body, pos, length };
      }

      case 'name-expr': {
        const t = this.peek();
        if (t.type !== 'word') {
          throw this.missing(t, head, `Oczekiwano nazwy zmiennej po „${head.text}”.`);
        }
        this.checkNewVariableName(t);
        this.next();
        const value = this.parseArg(head, `Brakuje wartości zmiennej „${t.text}”.`);
        return { k: 'let', name: t.name, value, pos, length };
      }

      case 'condition': {
        const cond = this.parseCondition(head);
        const body = this.parseBlock(`Oczekiwano „[” z ciałem warunku.`, head);
        return { k: 'if', cond, body, elseBody: null, pos, length };
      }

      case 'condition-ifelse': {
        const cond = this.parseCondition(head);
        const body = this.parseBlock(`Oczekiwano „[” z pierwszym ciałem warunku.`, head);
        const elseBody = this.parseBlock(`Oczekiwano drugiego bloku „[ ... ]” w poleceniu „${head.text}”.`, head);
        return { k: 'if', cond, body, elseBody, pos, length };
      }
    }
  }

  private checkNewVariableName(t: Token): void {
    if (REPEAT_VALUE_WORDS.includes(t.name) || isReservedWord(t.name)) {
      throw new LogoFailure(`„${t.text}” jest słowem języka i nie może być nazwą zmiennej.`, at(t));
    }
    if (this.headers.has(t.name)) {
      throw new LogoFailure(`„${t.text}” jest nazwą procedury i nie może być nazwą zmiennej.`, at(t));
    }
  }

  private parseCall(t: Token): Stmt {
    const header = this.headers.get(t.name)!;
    this.next();
    const args: Arg[] = [];
    const n = header.params.length;
    const message = `Brakuje argumentu: procedura „${t.text}” oczekuje ${n} ${plural(n)}.`;
    for (let k = 0; k < n; k++) {
      args.push(this.parseArg(t, message));
    }
    return { k: 'call', name: t.name, args, pos: at(t), length: t.length };
  }

  private parseCondition(head: Token): Condition {
    const left = this.parseArg(head, `Brakuje lewej strony warunku w poleceniu „${head.text}”.`);
    const t = this.peek();
    if (t.type !== 'op' || !COMPARISONS.includes(t.text)) {
      throw this.missing(t, head, 'Oczekiwano operatora porównania: =, <, >, <=, >= lub <>.');
    }
    this.next();
    const right = this.parseArg(head, `Brakuje prawej strony warunku przy „${t.text}”.`);
    return { left, op: t.text as Comparison, right };
  }

  /** Parses `[ statements ]`. Bodies are not frames, so the bracket depth is the only limit here. */
  private parseBlock(missingMessage: string, head: Token): Stmt[] {
    const open = this.peek();
    if (open.type !== 'punct' || open.text !== '[') {
      throw this.missing(open, head, missingMessage);
    }
    if (this.bracketDepth + 1 > LIMITS.bracketDepth) {
      throw new LogoFailure(`Zbyt duże zagnieżdżenie nawiasów [ ] (limit ${LIMITS.bracketDepth}).`, at(open));
    }
    this.next();
    this.bracketDepth++;
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.type === 'eof' || (t.type === 'word' && END_WORDS.includes(t.name))) {
        throw new LogoFailure('Nie zamknięto nawiasu „[”.', at(open));
      }
      if (t.type === 'punct' && t.text === ']') {
        this.next();
        break;
      }
      body.push(this.parseStatement());
    }
    this.bracketDepth--;
    return body;
  }

  private parseDefinition(): void {
    const ot = this.peek();
    if (!this.atLineStart(this.i)) {
      throw new LogoFailure('Definicja procedury musi zaczynać się od nowego wiersza.', at(ot));
    }
    const header = this.readHeader(this.i);
    if (this.procs.has(header.name)) {
      throw new LogoFailure(`Procedura „${header.nameTok.text}” jest już zdefiniowana.`, at(header.nameTok));
    }
    this.i = header.end;
    const proc: ProcDef = {
      name: header.name,
      params: header.params.map((p) => p.name),
      locals: this.localsByProc.get(header.name) ?? new Set(),
      body: [],
      pos: at(header.nameTok),
    };
    this.procs.set(header.name, proc);

    const savedProc = this.curProc;
    const savedRepeat = this.repeatDepth;
    this.curProc = proc;
    this.repeatDepth = 0;
    for (;;) {
      const t = this.peek();
      if (t.type === 'eof') {
        throw new LogoFailure(`Brakuje „już” kończącego definicję procedury „${header.nameTok.text}”.`, at(ot));
      }
      if (t.type === 'word' && END_WORDS.includes(t.name)) {
        const after = this.toks[this.i + 1];
        if (!this.atLineStart(this.i) || (after && after.type !== 'newline' && after.type !== 'eof')) {
          throw new LogoFailure('„już” musi stać samo w wierszu.', at(t));
        }
        this.i++;
        break;
      }
      proc.body.push(this.parseStatement());
    }
    this.curProc = savedProc;
    this.repeatDepth = savedRepeat;
  }

  // ---- expressions ----

  /** Parses one argument. `missingMessage` is used when no expression starts where one is required. */
  private parseArg(head: Token, missingMessage: string): Arg {
    const t = this.peek();
    if (!this.startsExpr(t)) {
      throw this.missing(t, head, missingMessage);
    }
    const expr = this.parseSum();
    return { pos: at(t), expr, literal: constantValue(expr) };
  }

  private binaryOperator(t: Token, ops: readonly string[]): boolean {
    // A binary operator needs whitespace on both sides or on neither side.
    return t.type === 'op' && ops.includes(t.text) && t.spaceBefore === t.spaceAfter;
  }

  private parseSum(): Expr {
    let left = this.parseProduct();
    for (;;) {
      const t = this.peek();
      if (!this.binaryOperator(t, ['+', '-'])) break;
      this.next();
      const right = this.parseProduct();
      left = { k: 'bin', op: t.text as '+' | '-', l: left, r: right };
    }
    return left;
  }

  private parseProduct(): Expr {
    let left = this.parseUnary();
    for (;;) {
      const t = this.peek();
      if (!this.binaryOperator(t, ['*', '/'])) break;
      this.next();
      const right = this.parseUnary();
      left = { k: 'bin', op: t.text as '*' | '/', l: left, r: right };
    }
    return left;
  }

  private parseUnary(): Expr {
    const t = this.peek();
    if (t.type === 'op' && (t.text === '+' || t.text === '-')) {
      this.next();
      const e = this.parseUnary();
      return t.text === '-' ? { k: 'neg', e } : e;
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expr {
    const t = this.peek();
    switch (t.type) {
      case 'number':
        this.next();
        if (!Number.isFinite(t.value)) {
          throw new LogoFailure('Liczba jest za duża.', at(t));
        }
        return { k: 'num', v: t.value };
      case 'colonvar':
        this.next();
        return this.checkedName(t);
      case 'word':
        if (REPEAT_VALUE_WORDS.includes(t.name)) {
          if (this.repeatDepth === 0) {
            throw new LogoFailure(`„${t.text}” można użyć tylko wewnątrz powtórzenia.`, at(t));
          }
          this.next();
          return { k: 'nrpowt' };
        }
        if (isReservedWord(t.name)) {
          throw new LogoFailure(`Oczekiwano wartości, a znaleziono ${describe(t)}.`, at(t));
        }
        this.next();
        return this.checkedName(t);
      case 'punct':
        if (t.text === '(') {
          this.next();
          const e = this.parseSum();
          const close = this.peek();
          if (close.type !== 'punct' || close.text !== ')') {
            throw new LogoFailure('Nie zamknięto nawiasu „(”.', at(t));
          }
          this.next();
          return e;
        }
        throw new LogoFailure(`Oczekiwano wartości, a znaleziono ${describe(t)}.`, at(t));
      default:
        throw new LogoFailure(`Oczekiwano wartości, a znaleziono ${describe(t)}.`, at(t));
    }
  }

  /** A name may be read only if it is a parameter or local of the enclosing procedure, or a top-level variable. */
  private checkedName(t: Token): Expr {
    const name = t.name;
    const known = this.curProc ? this.curProc.locals.has(name) || this.globals.has(name) : this.globals.has(name);
    if (!known) {
      throw new LogoFailure(`Nieznana nazwa „${t.text}”: nie jest parametrem ani zmienną ustawioną poleceniem „niech”.`, at(t));
    }
    return { k: 'var', name };
  }
}

function plural(n: number): string {
  if (n === 1) return 'argument';
  if (n >= 2 && n <= 4) return 'argumenty';
  return 'argumentów';
}

/** Parses a whole program. Throws LogoFailure for the first problem in source order. */
export function parseProgram(source: string, mode: Mode): Program {
  return new Parser(source, mode).parse();
}

