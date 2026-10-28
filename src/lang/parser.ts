import type { Arg, BinaryOp, CompareOp, Condition, Expr, Mode, ProcDef, Program, Stmt } from './ast';
import { LogoError, formatNumber, q } from './errors';
import { tokenize, type Token } from './lexer';
import {
  COMMANDS,
  COMMAND_ALIASES,
  COMMAND_NAME_PL,
  DEFINE_WORDS,
  END_WORDS,
  PARAMS_WORD,
  REPCOUNT_WORDS,
  THREE_D_ONLY,
  isReservedWord,
  type CommandId,
} from './keywords';
import { evalConstant } from './evaluate';

export const MAX_NESTING = 32;
export const MAX_REPEAT = 10_000;
export const MIN_WIDTH = 1;
export const MAX_WIDTH = 12;

interface ProcHeader {
  name: string;
  params: string[];
  locals: Set<string>;
}

interface Scope {
  proc: ProcHeader | null;
}

const COLOR_RE = /^#[0-9a-f]{6}$/i;

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10;
  const h = n % 100;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
}

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

export class Parser {
  private readonly toks: Token[];
  private pos = 0;
  private readonly mode: Mode;
  private readonly headers = new Map<string, ProcHeader>();
  private readonly globals = new Set<string>();
  private readonly defined = new Map<string, ProcDef>();
  private scope: Scope = { proc: null };
  private repeatDepth = 0;
  private bracketDepth = 0;

  constructor(source: string, mode: Mode) {
    this.toks = tokenize(source);
    this.mode = mode;
  }

  // ---------------------------------------------------------------- helpers

  private peek(offset = 0): Token | undefined {
    return this.toks[this.pos + offset];
  }

  private next(): Token {
    return this.toks[this.pos++];
  }

  private fail(message: string, tok: Token): never {
    throw new LogoError(message, tok);
  }

  private isWord(tok: Token | undefined, set: Set<string>): boolean {
    return !!tok && tok.type === 'word' && !tok.colon && set.has(tok.lower);
  }

  private commandOf(tok: Token | undefined): CommandId | undefined {
    if (!tok || tok.type !== 'word' || tok.colon) return undefined;
    return COMMANDS.get(tok.lower);
  }

  private inScope(name: string): boolean {
    const proc = this.scope.proc;
    if (proc && (proc.params.includes(name) || proc.locals.has(name))) return true;
    return this.globals.has(name);
  }

  // ---------------------------------------------------------- pre-pass

  /**
   * Pierwsze przejście: nagłówki procedur (nazwy i liczba parametrów) oraz
   * nazwy przypisywane przez `niech` — globalnie i w każdej procedurze.
   * Dzięki temu wywołania i nazwy mogą stać przed definicją.
   */
  private prescan(): void {
    const t = this.toks;
    let depth = 0;
    let i = 0;
    while (i < t.length) {
      const tok = t[i];
      if (tok.type === '[') depth++;
      else if (tok.type === ']') depth = Math.max(0, depth - 1);
      else if (depth === 0 && tok.lineStart && this.isWord(tok, DEFINE_WORDS)) {
        const nameTok = t[i + 1];
        let j = i + 1;
        let header: ProcHeader | null = null;
        if (nameTok && !nameTok.lineStart && nameTok.type === 'word' && !nameTok.colon) {
          header = { name: nameTok.lower, params: [], locals: new Set() };
          j = i + 2;
          while (j < t.length && !t[j].lineStart) {
            const p = t[j];
            if (p.type === 'word' && p.lower !== PARAMS_WORD) header.params.push(p.lower);
            j++;
          }
        }
        // Treść aż do `już` stojącego samotnie w wierszu.
        while (j < t.length && !(t[j].lineStart && t[j].lineEnd && this.isWord(t[j], END_WORDS))) {
          if (header && this.commandOf(t[j]) === 'let' && t[j + 1]?.type === 'word') {
            header.locals.add(t[j + 1].lower);
          }
          j++;
        }
        if (header && !this.headers.has(header.name)) this.headers.set(header.name, header);
        i = j + 1;
        continue;
      } else if (this.commandOf(tok) === 'let' && t[i + 1]?.type === 'word') {
        this.globals.add(t[i + 1].lower);
      }
      i++;
    }
  }

  // ---------------------------------------------------------- program

  parseProgram(): Program {
    this.prescan();
    const body: Stmt[] = [];
    let last: Stmt | null = null;
    while (this.pos < this.toks.length) {
      const tok = this.peek()!;
      if (this.isWord(tok, DEFINE_WORDS)) {
        if (!tok.lineStart) {
          this.fail(`Definicja procedury (${q(tok.text)}) musi zaczynać się na początku wiersza.`, tok);
        }
        this.parseDefinition();
        last = null;
        continue;
      }
      if (this.isWord(tok, END_WORDS)) {
        this.fail(`${q(tok.text)} kończy definicję procedury, ale żadna procedura nie została rozpoczęta słowem „oto”.`, tok);
      }
      last = this.parseStatement(last);
      body.push(last);
    }
    return { body, procs: this.defined, mode: this.mode };
  }

  private parseDefinition(): void {
    const otoTok = this.next();
    const nameTok = this.peek();
    if (!nameTok || nameTok.lineStart) {
      this.fail('Po słowie „oto” podaj w tym samym wierszu nazwę procedury, np. „oto kwadrat ma: bok”.', otoTok);
    }
    if (nameTok.type !== 'word' || nameTok.colon || nameTok.lower === PARAMS_WORD) {
      this.fail(`${q(nameTok.text)} nie może być nazwą procedury. Nazwa składa się z liter, cyfr i podkreśleń.`, nameTok);
    }
    if (isReservedWord(nameTok.lower)) {
      this.fail(`${q(nameTok.text)} to słowo języka — wybierz dla procedury inną nazwę.`, nameTok);
    }
    if (this.defined.has(nameTok.lower)) {
      const prev = this.defined.get(nameTok.lower)!;
      this.fail(`Procedura ${q(nameTok.text)} jest już zdefiniowana w wierszu ${prev.tok.line}. Nazwę można zdefiniować tylko raz.`, nameTok);
    }
    this.next();

    const params: string[] = [];
    const addParam = (p: Token) => {
      if (p.type !== 'word' || p.lower === PARAMS_WORD) {
        this.fail(`Oczekiwano nazwy parametru, a jest ${q(p.text)}.`, p);
      }
      if (isReservedWord(p.lower)) this.fail(`${q(p.text)} to słowo języka — nie może być nazwą parametru.`, p);
      if (params.includes(p.lower)) this.fail(`Parametr ${q(p.text)} powtarza się w nagłówku.`, p);
      params.push(p.lower);
    };
    const sameLine = () => {
      const t = this.peek();
      return t && !t.lineStart ? t : undefined;
    };
    let t = sameLine();
    if (t) {
      if (t.type === 'word' && !t.colon && t.lower === PARAMS_WORD) {
        const maTok = this.next();
        let p = sameLine();
        if (!p) this.fail('Po „ma:” wypisz nazwy parametrów oddzielone przecinkami, np. „ma: bok, kąt”.', maTok);
        for (;;) {
          addParam(this.next());
          p = sameLine();
          if (!p) break;
          if (p.type !== ',') this.fail(`Parametry oddziel przecinkami — oczekiwano „,”, a jest ${q(p.text)}.`, p);
          const comma = this.next();
          p = sameLine();
          if (!p) this.fail('Po przecinku brakuje nazwy parametru.', comma);
        }
      } else if (t.type === 'word' && t.colon) {
        while ((t = sameLine())) {
          if (t.type !== 'word' || !t.colon) {
            this.fail(`W nagłówku w starym stylu każdy parametr zapisuje się z dwukropkiem, np. „:bok” — a jest ${q(t.text)}.`, t);
          }
          addParam(this.next());
        }
      } else {
        this.fail(`Po nazwie procedury oczekiwano „ma:” i listy parametrów, a jest ${q(t.text)}.`, t);
      }
    }

    const header = this.headers.get(nameTok.lower) ?? { name: nameTok.lower, params, locals: new Set<string>() };
    const def: ProcDef = { name: nameTok.lower, display: nameTok.text, params, body: [], tok: nameTok };
    this.defined.set(def.name, def);

    const saved = { scope: this.scope, rep: this.repeatDepth };
    this.scope = { proc: { name: def.name, params, locals: header.locals } };
    this.repeatDepth = 0;
    let last: Stmt | null = null;
    for (;;) {
      const tok = this.peek();
      if (!tok) {
        this.fail(`Brakuje słowa „już” kończącego procedurę ${q(def.display)}. Napisz je samo w osobnym wierszu.`, otoTok);
      }
      if (this.isWord(tok, END_WORDS)) {
        if (!(tok.lineStart && tok.lineEnd)) {
          this.fail(`${q(tok.text)} kończące procedurę musi stać samo w osobnym wierszu.`, tok);
        }
        this.next();
        break;
      }
      if (this.isWord(tok, DEFINE_WORDS)) {
        this.fail(`Nie można zdefiniować procedury wewnątrz procedury ${q(def.display)}. Czy brakuje słowa „już”?`, tok);
      }
      last = this.parseStatement(last);
      def.body.push(last);
    }
    this.scope = saved.scope;
    this.repeatDepth = saved.rep;
  }

  // ---------------------------------------------------------- statements

  private parseBlock(owner: Token, what: string): { body: Stmt[]; close: Token } {
    const open = this.peek();
    if (!open) this.fail(`Polecenie ${what} wymaga treści w nawiasach kwadratowych [ ].`, owner);
    if (open.type !== '[') {
      this.fail(`Po poleceniu ${what} oczekiwano nawiasu „[”, a jest ${q(open.text)}.`, open);
    }
    this.next();
    this.bracketDepth++;
    if (this.bracketDepth > MAX_NESTING) {
      this.fail(`Za głębokie zagnieżdżenie nawiasów — limit to ${MAX_NESTING} poziomy.`, open);
    }
    const body: Stmt[] = [];
    let last: Stmt | null = null;
    for (;;) {
      const tok = this.peek();
      if (!tok) this.fail('Brakuje nawiasu zamykającego „]” do tego nawiasu.', open);
      if (tok.type === ']') {
        this.next();
        this.bracketDepth--;
        return { body, close: tok };
      }
      if (this.isWord(tok, DEFINE_WORDS) && tok.lineStart) {
        this.fail('Procedury definiuje się tylko na najwyższym poziomie programu, nie wewnątrz nawiasów.', tok);
      }
      if (this.isWord(tok, END_WORDS) && tok.lineStart && tok.lineEnd) {
        this.fail('Brakuje nawiasu zamykającego „]” do tego nawiasu.', open);
      }
      last = this.parseStatement(last);
      body.push(last);
    }
  }

  private parseStatement(prev: Stmt | null): Stmt {
    const tok = this.peek()!;
    if (tok.type === 'word' && !tok.colon) {
      const cmd = COMMANDS.get(tok.lower);
      if (cmd) return this.parseCommand(cmd);
      const header = this.headers.get(tok.lower);
      if (header) return this.parseCall(header);
      if (REPCOUNT_WORDS.has(tok.lower)) {
        this.fail(`${q(tok.text)} to wartość (numer powtórzenia), a nie polecenie — użyj jej jako argumentu, np. „np nrpowt * 10”.`, tok);
      }
      if (this.isWord(tok, DEFINE_WORDS)) {
        this.fail('Procedury definiuje się tylko na najwyższym poziomie programu, na początku wiersza.', tok);
      }
      if (this.isWord(tok, END_WORDS)) {
        this.fail(`${q(tok.text)} może stać tylko samo w osobnym wierszu, na końcu definicji procedury.`, tok);
      }
      if (tok.lower === PARAMS_WORD) {
        this.fail('„ma:” może stać tylko w nagłówku procedury, po jej nazwie.', tok);
      }
      if (this.inScope(tok.lower)) {
        this.fail(`${q(tok.text)} to zmienna, a nie polecenie. Aby zmienić jej wartość, napisz „niech ${tok.text} …”.`, tok);
      }
      this.fail(`Nieznane polecenie ${q(tok.text)}.${this.suggest(tok.lower)}`, tok);
    }
    // Wartość tam, gdzie powinno stać polecenie.
    if (tok.type === ']') this.fail('Nawias „]” nie ma pary — brakuje „[”.', tok);
    if (tok.type === ')') this.fail('Nawias „)” nie ma pary — brakuje „(”.', tok);
    if (tok.type === '[') this.fail('Nawias „[” musi stać po poleceniu, np. „powtórz 4 [ … ]”.', tok);
    let hint = '';
    if (tok.type === 'op' && tok.spaceBefore !== tok.spaceAfter) {
      hint = ' Operator działania musi mieć spację z obu stron albo z żadnej: „10 - 5” lub „10-5”.';
    } else if (prev && prev.k === 'call') {
      const n = prev.args.length;
      hint = ` Czy to nie za dużo argumentów? Procedura ${q(prev.tok.text)} przyjmuje ${n} ${plural(n, 'argument', 'argumenty', 'argumentów')}.`;
    } else if (prev && (prev.k === 'move' || prev.k === 'turn' || prev.k === 'width' || prev.k === 'let')) {
      hint = ` Polecenie ${q(prev.tok.text)} przyjmuje tylko jeden argument.`;
    } else if (prev && (prev.k === 'pen' || prev.k === 'home' || prev.k === 'clear' || prev.k === 'stop')) {
      hint = ` Polecenie ${q(prev.tok.text)} nie przyjmuje argumentów.`;
    }
    this.fail(`Oczekiwano polecenia, a jest ${q(tok.text)}.${hint}`, tok);
  }

  private suggest(lower: string): string {
    let best = '';
    let bestD = Infinity;
    const candidates: string[] = [];
    for (const aliases of Object.values(COMMAND_ALIASES)) candidates.push(...aliases);
    candidates.push(...this.headers.keys());
    for (const c of candidates) {
      const d = levenshtein(lower, c);
      if (d < bestD) {
        bestD = d;
        best = c;
      }
    }
    const limit = lower.length <= 3 ? 1 : 2;
    return bestD <= limit ? ` Czy chodziło o ${q(best)}?` : '';
  }

  private parseCommand(cmd: CommandId): Stmt {
    const tok = this.next();
    const name = q(tok.text);
    if (THREE_D_ONLY.has(cmd) && this.mode === '2d') {
      this.fail(`Polecenie ${name} działa tylko w trybie 3D — w trybie 2D żółw nie może się pochylać ani przechylać.`, tok);
    }
    switch (cmd) {
      case 'forward':
      case 'back':
        return { k: 'move', sign: cmd === 'forward' ? 1 : -1, arg: this.parseArg(tok), tok };
      case 'right':
      case 'left':
        return { k: 'turn', axis: 'yaw', sign: cmd === 'right' ? 1 : -1, arg: this.parseArg(tok), tok };
      case 'pitchup':
      case 'pitchdown':
        return { k: 'turn', axis: 'pitch', sign: cmd === 'pitchup' ? 1 : -1, arg: this.parseArg(tok), tok };
      case 'rollright':
      case 'rollleft':
        return { k: 'turn', axis: 'roll', sign: cmd === 'rollright' ? 1 : -1, arg: this.parseArg(tok), tok };
      case 'penup':
      case 'pendown':
        return { k: 'pen', down: cmd === 'pendown', tok };
      case 'stop':
        return { k: 'stop', tok };
      case 'home':
        return { k: 'home', tok };
      case 'clear':
        return { k: 'clear', tok };
      case 'color': {
        const c = this.peek();
        if (!c) this.fail(`Polecenie ${name} wymaga koloru w cudzysłowie, np. kolor "#16866a".`, tok);
        if (c.type !== 'str') {
          this.fail(`Polecenie ${name} wymaga koloru w cudzysłowie, np. kolor "#16866a" — a jest ${q(c.text)}.`, c);
        }
        if (!COLOR_RE.test(c.lower)) {
          this.fail(`Niepoprawny kolor ${c.text}. Kolor zapisuje się jako # i sześć cyfr szesnastkowych, np. "#16866a".`, c);
        }
        this.next();
        return { k: 'color', value: c.lower, tok };
      }
      case 'width': {
        const arg = this.parseArg(tok);
        if (arg.literal) checkWidth(evalConstantAt(arg), arg.first, 'parse');
        return { k: 'width', arg, tok };
      }
      case 'repeat': {
        const count = this.parseArg(tok);
        if (count.literal) checkRepeat(evalConstantAt(count), count.first, 'parse');
        this.repeatDepth++;
        const { body, close } = this.parseBlock(tok, name);
        this.repeatDepth--;
        return { k: 'repeat', count, body, tok, close };
      }
      case 'let': {
        const nameTok = this.peek();
        if (!nameTok) this.fail(`Po ${name} podaj nazwę zmiennej i wartość, np. „niech bok 50”.`, tok);
        if (nameTok.type !== 'word' || nameTok.lower === PARAMS_WORD) {
          this.fail(`Po ${name} oczekiwano nazwy zmiennej, a jest ${q(nameTok.text)}.`, nameTok);
        }
        if (isReservedWord(nameTok.lower)) {
          this.fail(`${q(nameTok.text)} to słowo języka — nie może być nazwą zmiennej.`, nameTok);
        }
        const isParam = !!this.scope.proc?.params.includes(nameTok.lower);
        if (this.headers.has(nameTok.lower) && !isParam) {
          this.fail(`${q(nameTok.text)} to nazwa procedury — zmienna musi mieć inną nazwę.`, nameTok);
        }
        this.next();
        const arg = this.parseArg(tok);
        return { k: 'let', name: nameTok.lower, arg, tok };
      }
      case 'if': {
        const cond = this.parseCondition(tok);
        const { body } = this.parseBlock(tok, name);
        return { k: 'if', cond, then: body, else: null, tok };
      }
      case 'ifelse': {
        const cond = this.parseCondition(tok);
        const a = this.parseBlock(tok, name);
        const b = this.parseBlock(tok, `${name} (drugi blok — „w przeciwnym razie”)`);
        return { k: 'if', cond, then: a.body, else: b.body, tok };
      }
    }
  }

  private parseCall(header: ProcHeader): Stmt {
    const tok = this.next();
    const args: Arg[] = [];
    const n = header.params.length;
    for (let i = 0; i < n; i++) {
      const start = this.peek();
      if (!start || !this.canStartExpr(start)) {
        const msg = `Procedura ${q(tok.text)} potrzebuje ${n} ${plural(n, 'argumentu', 'argumentów', 'argumentów')}, a podano ${i}.`;
        if (!start) this.fail(msg, tok);
        this.fail(`${msg} Zamiast kolejnego argumentu jest ${q(start.text)}.`, start);
      }
      args.push(this.parseArg(tok));
    }
    return { k: 'call', name: header.name, args, tok };
  }

  // ---------------------------------------------------------- expressions

  private canStartExpr(tok: Token): boolean {
    if (tok.type === 'num' || tok.type === '(') return true;
    if (tok.type === 'op') return tok.text === '-' || tok.text === '+';
    if (tok.type === 'word') {
      if (tok.colon) return true;
      if (COMMANDS.has(tok.lower) || DEFINE_WORDS.has(tok.lower) || END_WORDS.has(tok.lower)) return false;
      if (tok.lower === PARAMS_WORD) return false;
      if (this.headers.has(tok.lower) && !this.inScope(tok.lower)) return false;
      return true;
    }
    return false;
  }

  /** Argument polecenia `cmd`. Błąd braku argumentu wskazuje token zastany w jego miejscu. */
  private parseArg(cmd: Token): Arg {
    const start = this.peek();
    if (!start) {
      this.fail(`Polecenie ${q(cmd.text)} wymaga argumentu — liczby lub wyrażenia.`, cmd);
    }
    this.checkOperandStart(start, cmd);
    const expr = this.parseExpr();
    return { expr, first: start, literal: isLiteral(expr) };
  }

  private checkOperandStart(start: Token, owner: Token): void {
    if (this.canStartExpr(start)) return;
    if (start.type === 'word' && !start.colon && this.headers.has(start.lower)) {
      this.fail(`${q(start.text)} to procedura — nie zwraca wartości, więc nie może być argumentem polecenia ${q(owner.text)}.`, start);
    }
    const what = owner.type === 'op' ? `operatorze ${q(owner.text)}` : `poleceniu ${q(owner.text)}`;
    this.fail(`Brakuje argumentu: po ${what} oczekiwano liczby lub wyrażenia, a jest ${q(start.text)}.`, start);
  }

  private parseCondition(cmd: Token): Condition {
    const first = this.peek();
    if (!first) this.fail(`Polecenie ${q(cmd.text)} wymaga warunku, np. „${cmd.text} x > 5 [ … ]”.`, cmd);
    this.checkOperandStart(first, cmd);
    const a = this.parseExpr();
    const opTok = this.peek();
    if (!opTok) this.fail('Warunek wymaga porównania: <, >, =, <=, >= lub <>.', cmd);
    if (opTok.type !== 'cmp') {
      this.fail(`Warunek wymaga porównania (<, >, =, <=, >= lub <>), a jest ${q(opTok.text)}.`, opTok);
    }
    this.next();
    const bStart = this.peek();
    if (!bStart) this.fail(`Po porównaniu ${q(opTok.text)} brakuje drugiej strony warunku.`, opTok);
    this.checkOperandStart(bStart, opTok);
    const b = this.parseExpr();
    return { a, op: opTok.text as CompareOp, b, first };
  }

  private binaryAt(ops: string): Token | undefined {
    const t = this.peek();
    if (t && t.type === 'op' && ops.includes(t.text) && t.spaceBefore === t.spaceAfter) return t;
    return undefined;
  }

  private parseExpr(): Expr {
    let left = this.parseTerm();
    let op: Token | undefined;
    while ((op = this.binaryAt('+-'))) {
      this.next();
      const right = this.parseOperandAfter(op, () => this.parseTerm());
      left = { k: 'bin', op: op.text as BinaryOp, a: left, b: right, tok: op };
    }
    return left;
  }

  private parseTerm(): Expr {
    let left = this.parseUnary();
    let op: Token | undefined;
    while ((op = this.binaryAt('*/'))) {
      this.next();
      const right = this.parseOperandAfter(op, () => this.parseUnary());
      left = { k: 'bin', op: op.text as BinaryOp, a: left, b: right, tok: op };
    }
    return left;
  }

  private parseOperandAfter(op: Token, parse: () => Expr): Expr {
    const t = this.peek();
    if (!t) this.fail(`Po operatorze ${q(op.text)} brakuje liczby lub wyrażenia.`, op);
    this.checkOperandStart(t, op);
    return parse();
  }

  private parseUnary(): Expr {
    const signs: Token[] = [];
    let t = this.peek();
    while (t && t.type === 'op' && (t.text === '-' || t.text === '+')) {
      signs.push(this.next());
      t = this.peek();
      if (!t) this.fail(`Po znaku ${q(signs[signs.length - 1].text)} brakuje liczby lub wyrażenia.`, signs[signs.length - 1]);
      this.checkOperandStart(t, signs[signs.length - 1]);
    }
    let e = this.parsePrimary();
    for (let i = signs.length - 1; i >= 0; i--) {
      if (signs[i].text === '-') e = { k: 'neg', e, tok: signs[i] };
    }
    return e;
  }

  private parsePrimary(): Expr {
    const t = this.next();
    if (t.type === 'num') return { k: 'num', value: t.value, tok: t };
    if (t.type === '(') {
      const inner = this.peek();
      if (!inner) this.fail('Nawias „(” nie został zamknięty.', t);
      this.checkOperandStart(inner, t);
      const e = this.parseExpr();
      const close = this.peek();
      if (!close) this.fail('Nawias „(” nie został zamknięty — brakuje „)”.', t);
      if (close.type !== ')') this.fail(`Oczekiwano nawiasu zamykającego „)”, a jest ${q(close.text)}.`, close);
      this.next();
      return e;
    }
    // t.type === 'word' (gwarantuje checkOperandStart)
    if (!t.colon && REPCOUNT_WORDS.has(t.lower)) {
      if (this.repeatDepth === 0) {
        const where = this.scope.proc
          ? ` W procedurze ${q(this.scope.proc.name)} „nrpowt” musi stać wewnątrz jej własnego „powtórz”.`
          : '';
        this.fail(`${q(t.text)} można użyć tylko wewnątrz „powtórz [ … ]”.${where}`, t);
      }
      return { k: 'rep', tok: t };
    }
    if (REPCOUNT_WORDS.has(t.lower)) {
      this.fail(`${q(t.text)}: numer powtórzenia zapisuje się bez dwukropka — „nrpowt”.`, t);
    }
    if (!this.inScope(t.lower)) {
      const where = this.scope.proc ? ` w procedurze ${q(this.scope.proc.name)}` : '';
      this.fail(
        `Nieznana nazwa ${q(t.text)}${where}. Nazwa musi być parametrem procedury albo zmienną nadaną przez „niech”.`,
        t,
      );
    }
    return { k: 'var', name: t.lower, tok: t };
  }
}

function isLiteral(e: Expr): boolean {
  switch (e.k) {
    case 'num':
      return true;
    case 'var':
    case 'rep':
      return false;
    case 'neg':
      return isLiteral(e.e);
    case 'bin':
      return isLiteral(e.a) && isLiteral(e.b);
  }
}

function evalConstantAt(arg: Arg): number {
  try {
    return evalConstant(arg.expr);
  } catch (e) {
    if (e instanceof Error) throw new LogoError(e.message, arg.first);
    throw e;
  }
}

export function checkWidth(w: number, at: Token, phase: 'parse' | 'run'): void {
  if (!Number.isInteger(w) || w < MIN_WIDTH || w > MAX_WIDTH) {
    throw new LogoError(
      `Grubość musi być liczbą całkowitą od ${MIN_WIDTH} do ${MAX_WIDTH}, a wynosi ${formatNumber(w)}.`,
      at,
      phase,
    );
  }
}

export function checkRepeat(n: number, at: Token, phase: 'parse' | 'run'): void {
  if (!Number.isInteger(n) || n < 0 || n > MAX_REPEAT) {
    throw new LogoError(
      `Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000, a wynosi ${formatNumber(n)}.`,
      at,
      phase,
    );
  }
}

export function parse(source: string, mode: Mode): Program {
  return new Parser(source, mode).parseProgram();
}

export { COMMAND_NAME_PL };
