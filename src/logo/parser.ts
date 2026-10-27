import { LogoError } from './errors';
import { COMMANDS, DEFINE_WORDS, END_WORDS, PARAMS_WORD, REPEAT_WORDS, isReserved, type CommandSpec, type Op } from './commands';
import { tokenize, type Token } from './lexer';
import { MAX_DEPTH, MAX_REPEAT, MAX_WIDTH, MIN_WIDTH } from './limits';
import type { Mode } from './types';

export type Arg =
  | { kind: 'number'; value: number; token: Token }
  | { kind: 'param'; name: string; token: Token };

export interface CommandStatement {
  kind: 'command';
  op: Op;
  token: Token;
  arg?: Arg;
  color?: string;
}

export interface RepeatStatement {
  kind: 'repeat';
  token: Token;
  count: Arg;
  body: Statement[];
}

export interface CallStatement {
  kind: 'call';
  token: Token;
  procedure: Procedure;
  args: Arg[];
}

export type Statement = CommandStatement | RepeatStatement | CallStatement;

export interface Procedure {
  name: string;
  /** The `oto` keyword. */
  token: Token;
  params: string[];
  body: Statement[];
  calls: CallStatement[];
}

export interface Program {
  procedures: Map<string, Procedure>;
  main: Statement[];
}

interface Scope {
  params: ReadonlySet<string>;
  procedure: Procedure | null;
  /** Number of enclosing brackets. */
  depth: number;
}

interface Header {
  keyword: Token;
  nameToken: Token;
  name: string;
  params: string[];
  /** Index of the first token after the header line. */
  end: number;
}

export function parseProgram(source: string, mode: Mode): Program {
  return new Parser(tokenize(source), mode).parse();
}

class Parser {
  private pos = 0;
  private readonly procedures = new Map<string, Procedure>();

  constructor(
    private readonly tokens: Token[],
    private readonly mode: Mode,
  ) {}

  parse(): Program {
    this.collectProcedures();
    this.pos = 0;
    const main = this.parseStatements({ params: new Set(), procedure: null, depth: 0 }, null);
    this.checkRecursion();
    return { procedures: this.procedures, main };
  }

  /** First pass: register every header so calls can precede definitions and be checked for arity. */
  private collectProcedures(): void {
    for (let i = 0; i < this.tokens.length; i++) {
      if (!this.isDefinitionAt(i)) continue;
      const header = this.readHeader(i);
      if (this.procedures.has(header.name)) {
        throw new LogoError(`Procedura „${header.name}” została już zdefiniowana`, header.nameToken);
      }
      this.procedures.set(header.name, {
        name: header.name,
        token: header.keyword,
        params: header.params,
        body: [],
        calls: [],
      });
      i = header.end - 1;
    }
  }

  private parseStatements(scope: Scope, open: Token | null): Statement[] {
    const statements: Statement[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) {
        if (open) throw new LogoError('Brakujący znak „]” dla nawiasu otwartego tutaj', open);
        if (scope.procedure) {
          throw new LogoError(`Brakujące słowo „już” na końcu procedury „${scope.procedure.name}”`, scope.procedure.token);
        }
        return statements;
      }
      if (t.type === 'rbracket') {
        if (open) return statements;
        throw new LogoError('Nieoczekiwany znak „]” bez pasującego „[”', t);
      }
      if (t.type === 'word' && END_WORDS.has(t.value as string)) {
        if (open) throw new LogoError('Brakujący znak „]” przed słowem „już”', open);
        if (scope.procedure) return statements;
        throw new LogoError('Słowo „już” bez pasującego „oto”', t);
      }
      if (t.type === 'word' && DEFINE_WORDS.has(t.value as string)) {
        if (scope.procedure || open) {
          throw new LogoError('Definicji procedury nie można umieścić wewnątrz innej procedury ani pętli', t);
        }
        this.parseDefinition();
        continue;
      }
      statements.push(this.parseStatement(scope));
    }
  }

  private parseDefinition(): void {
    const keyword = this.tokens[this.pos];
    if (!this.startsLine(this.pos)) {
      throw new LogoError('Definicja procedury musi zaczynać się od nowego wiersza', keyword);
    }
    const header = this.readHeader(this.pos);
    const procedure = this.procedures.get(header.name)!;
    this.pos = header.end;
    procedure.body = this.parseStatements({ params: new Set(procedure.params), procedure, depth: 0 }, null);

    const endIndex = this.pos;
    const end = this.tokens[endIndex];
    this.pos++;
    const before = this.tokens[endIndex - 1];
    const after = this.tokens[endIndex + 1];
    if ((before && before.line === end.line) || (after && after.line === end.line)) {
      throw new LogoError('Słowo „już” musi stać samo w swoim wierszu', end);
    }
  }

  private parseStatement(scope: Scope): Statement {
    const t = this.next();
    if (t.type !== 'word') {
      const what = t.type === 'number' ? 'liczbę' : t.type === 'string' ? 'kolor' : 'znak';
      throw new LogoError(`Oczekiwano polecenia, a znaleziono ${what} „${t.text}”`, t);
    }
    const name = t.value as string;

    const command = COMMANDS.get(name);
    if (command) return this.parseCommand(command, t, scope);
    if (REPEAT_WORDS.has(name)) return this.parseRepeat(t, scope);

    const procedure = this.procedures.get(name);
    if (procedure) return this.parseCall(procedure, t, scope);

    if (scope.params.has(name)) {
      throw new LogoError(`„${t.text}” jest parametrem i nie może być poleceniem`, t);
    }
    throw new LogoError(`Nieznane polecenie „${t.text}”`, t);
  }

  private parseCommand(spec: CommandSpec, t: Token, scope: Scope): CommandStatement {
    if (spec.spaceOnly && this.mode === '2d') {
      throw new LogoError(`Polecenie „${t.text}” działa tylko w trybie 3D`, t);
    }
    switch (spec.arg) {
      case 'none':
        return { kind: 'command', op: spec.op, token: t };
      case 'color':
        return { kind: 'command', op: spec.op, token: t, color: this.parseColor(t) };
      case 'width': {
        const arg = this.parseArgument(scope, t);
        if (arg.kind === 'number' && !isWidth(arg.value)) {
          throw new LogoError(`Grubość musi być liczbą całkowitą z zakresu ${MIN_WIDTH}–${MAX_WIDTH}`, arg.token);
        }
        return { kind: 'command', op: spec.op, token: t, arg };
      }
      case 'number':
        return { kind: 'command', op: spec.op, token: t, arg: this.parseArgument(scope, t) };
    }
  }

  private parseRepeat(t: Token, scope: Scope): RepeatStatement {
    const count = this.parseArgument(scope, t);
    if (count.kind === 'number' && !isRepeatCount(count.value)) {
      throw new LogoError(`Liczba powtórzeń musi być liczbą całkowitą z zakresu 0–${MAX_REPEAT}`, count.token);
    }
    const open = this.peek();
    if (!open || open.type !== 'lbracket') {
      throw new LogoError('Oczekiwano „[” po liczbie powtórzeń', open ?? t);
    }
    this.pos++;
    if (scope.depth + 1 > MAX_DEPTH) {
      throw new LogoError(`Zbyt duża głębokość zagnieżdżenia (maks. ${MAX_DEPTH})`, open);
    }
    const body = this.parseStatements({ ...scope, depth: scope.depth + 1 }, open);
    this.pos++; // the closing bracket, guaranteed by parseStatements
    return { kind: 'repeat', token: t, count, body };
  }

  private parseCall(procedure: Procedure, t: Token, scope: Scope): CallStatement {
    const args: Arg[] = [];
    for (let k = 0; k < procedure.params.length; k++) {
      const next = this.peek();
      const startsArgument =
        next !== undefined &&
        (next.type === 'number' ||
          next.type === 'colon' ||
          (next.type === 'word' && scope.params.has(next.value as string)));
      if (!startsArgument) {
        const n = procedure.params.length;
        throw new LogoError(
          `Procedura „${procedure.name}” przyjmuje ${n} ${pluralArguments(n)}, a podano ${k}`,
          t,
        );
      }
      args.push(this.parseArgument(scope, t));
    }
    const call: CallStatement = { kind: 'call', token: t, procedure, args };
    scope.procedure?.calls.push(call);
    return call;
  }

  /** A numeric argument: a literal, or a parameter of the enclosing procedure (`bok` or `:bok`). */
  private parseArgument(scope: Scope, owner: Token): Arg {
    const t = this.peek();
    if (!t) throw new LogoError(`Polecenie „${owner.text}” wymaga argumentu liczbowego`, owner);

    if (t.type === 'number') {
      this.pos++;
      return { kind: 'number', value: t.value as number, token: t };
    }
    if (t.type === 'colon') {
      this.pos++;
      const name = this.peek();
      if (!name || name.type !== 'word') {
        throw new LogoError('Po dwukropku oczekiwano nazwy parametru', t);
      }
      this.pos++;
      if (!scope.params.has(name.value as string)) {
        throw new LogoError(`Nieznany parametr „${name.text}”`, name);
      }
      return { kind: 'param', name: name.value as string, token: name };
    }
    if (t.type === 'word' && scope.params.has(t.value as string)) {
      this.pos++;
      return { kind: 'param', name: t.value as string, token: t };
    }
    throw new LogoError(`Oczekiwano liczby po „${owner.text}”, a znaleziono „${t.text}”`, t);
  }

  private parseColor(owner: Token): string {
    const t = this.peek();
    if (!t || t.type !== 'string') {
      throw new LogoError('Oczekiwano koloru w formacie "#rrggbb"', t ?? owner);
    }
    this.pos++;
    if (!/^#[0-9a-f]{6}$/i.test(t.value as string)) {
      throw new LogoError(`Nieprawidłowy kolor ${t.text}, oczekiwano formatu "#rrggbb"`, t);
    }
    return (t.value as string).toLowerCase();
  }

  /** Header: `oto nazwa ma: a, b` or the legacy `oto nazwa :a :b`. Only tokens on the keyword's line belong to it. */
  private readHeader(index: number): Header {
    const tokens = this.tokens;
    const keyword = tokens[index];
    const onLine = (k: number) => k < tokens.length && tokens[k].line === keyword.line;

    if (!onLine(index + 1) || tokens[index + 1].type !== 'word') {
      throw new LogoError('Oczekiwano nazwy procedury po słowie „oto”', keyword);
    }
    const nameToken = tokens[index + 1];
    if (isReserved(nameToken.value as string)) {
      throw new LogoError(`„${nameToken.text}” jest słowem zarezerwowanym i nie może być nazwą procedury`, nameToken);
    }

    const params: string[] = [];
    const addParam = (tok: Token) => {
      const name = tok.value as string;
      if (isReserved(name)) {
        throw new LogoError(`„${tok.text}” jest słowem zarezerwowanym i nie może być nazwą parametru`, tok);
      }
      if (params.includes(name)) {
        throw new LogoError(`Parametr „${tok.text}” występuje w nagłówku więcej niż raz`, tok);
      }
      params.push(name);
    };

    let k = index + 2;
    if (onLine(k) && tokens[k].type === 'word' && tokens[k].value === PARAMS_WORD) {
      const maToken = tokens[k];
      k++;
      if (!onLine(k) || tokens[k].type !== 'colon') {
        throw new LogoError(`Oczekiwano dwukropka po słowie „${PARAMS_WORD}”`, maToken);
      }
      k++;
      while (onLine(k) && tokens[k].type === 'word') {
        addParam(tokens[k]);
        k++;
        if (!(onLine(k) && tokens[k].type === 'comma')) break;
        const comma = tokens[k];
        k++;
        if (!onLine(k) || tokens[k].type !== 'word') {
          throw new LogoError('Oczekiwano nazwy parametru po przecinku', comma);
        }
      }
    } else {
      while (onLine(k) && tokens[k].type === 'colon') {
        const colon = tokens[k];
        k++;
        if (!onLine(k) || tokens[k].type !== 'word') {
          throw new LogoError('Oczekiwano nazwy parametru po dwukropku', colon);
        }
        addParam(tokens[k]);
        k++;
      }
    }

    if (onLine(k)) {
      throw new LogoError(`Nieoczekiwany element w nagłówku procedury: „${tokens[k].text}”`, tokens[k]);
    }
    return {
      keyword,
      nameToken,
      name: nameToken.value as string,
      params,
      end: k,
    };
  }

  /** Detects recursion along the static call graph, including calls that would never run. */
  private checkRecursion(): void {
    const state = new Map<Procedure, 'active' | 'done'>();
    const visit = (procedure: Procedure) => {
      state.set(procedure, 'active');
      for (const call of procedure.calls) {
        const callee = state.get(call.procedure);
        if (callee === 'active') {
          throw new LogoError(
            `Procedura „${call.procedure.name}” nie może wywoływać samej siebie, także pośrednio`,
            call.token,
          );
        }
        if (!callee) visit(call.procedure);
      }
      state.set(procedure, 'done');
    };
    for (const procedure of this.procedures.values()) {
      if (!state.has(procedure)) visit(procedure);
    }
  }

  private isDefinitionAt(index: number): boolean {
    const t = this.tokens[index];
    return t.type === 'word' && DEFINE_WORDS.has(t.value as string) && this.startsLine(index);
  }

  private startsLine(index: number): boolean {
    return index === 0 || this.tokens[index - 1].line !== this.tokens[index].line;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    return this.tokens[this.pos++];
  }
}

function isWidth(value: number): boolean {
  return Number.isInteger(value) && value >= MIN_WIDTH && value <= MAX_WIDTH;
}

function isRepeatCount(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= MAX_REPEAT;
}

function pluralArguments(n: number): string {
  if (n === 1) return 'argument';
  const last = n % 10;
  const teen = n % 100 >= 12 && n % 100 <= 14;
  return last >= 2 && last <= 4 && !teen ? 'argumenty' : 'argumentów';
}
