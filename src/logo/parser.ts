import type { Mode, NumArg, ProcDef, Program, Stmt } from './ast';
import { COMMAND_BY_WORD, DEFINE_WORDS, END_WORDS, isReservedWord } from './commands';
import { fmtInt, LIMITS, LogoError, type Pos } from './errors';
import { tokenize, type Token } from './lexer';

interface Header {
  name: string;
  displayName: string;
  params: string[];
  pos: Pos;
  /** Index of the first token after the header line. */
  bodyStart: number;
}

interface ProcContext {
  name: string;
  displayName: string;
  params: string[];
}

interface CallEdge {
  from: string;
  to: string;
  pos: Pos;
}

export function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n);
  if (abs === 1) return one;
  const last = abs % 10;
  const last2 = abs % 100;
  if (last >= 2 && last <= 4 && !(last2 >= 12 && last2 <= 14)) return few;
  return many;
}

function q(text: string): string {
  return `„${text}”`;
}

/** Parses and validates a whole program. Throws LogoError on the first problem. */
export function parse(source: string, mode: Mode): Program {
  const tokens = tokenize(source);
  const p = new Parser(tokens, mode);
  return p.parseProgram();
}

class Parser {
  private i = 0;
  private readonly headers = new Map<number, Header>();
  private readonly procs = new Map<string, ProcDef>();
  private readonly headerByName = new Map<string, Header>();
  private readonly edges: CallEdge[] = [];
  private bracketDepth = 0;
  private lastStmt: Stmt | null = null;

  constructor(
    private readonly tokens: Token[],
    private readonly mode: Mode,
  ) {}

  // ---- token helpers -------------------------------------------------

  private peek(): Token {
    return this.tokens[this.i]!;
  }

  private next(): Token {
    const t = this.tokens[this.i]!;
    if (t.kind !== 'eof') this.i++;
    return t;
  }

  private skipNewlines(): void {
    while (this.peek().kind === 'newline') this.i++;
  }

  private peekSkippingNewlines(): Token {
    let j = this.i;
    while (this.tokens[j]!.kind === 'newline') j++;
    return this.tokens[j]!;
  }

  private isDefineWord(t: Token): boolean {
    return t.kind === 'word' && DEFINE_WORDS.has(t.value);
  }

  private isEndWord(t: Token): boolean {
    return t.kind === 'word' && END_WORDS.has(t.value);
  }

  // ---- program -------------------------------------------------------

  parseProgram(): Program {
    this.prescanHeaders();
    const main: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.kind === 'eof') break;
      if (t.kind === 'newline') {
        this.i++;
        continue;
      }
      if (this.isDefineWord(t)) {
        if (!t.lineStart) {
          throw new LogoError(`Słowo ${q(t.text)} rozpoczynające definicję procedury musi stać na początku wiersza.`, t.pos);
        }
        this.parseDefinition();
        continue;
      }
      if (this.isEndWord(t)) {
        throw new LogoError(`Słowo ${q(t.text)} kończy procedurę, ale nie ma wcześniej pasującego „oto”.`, t.pos);
      }
      main.push(this.parseStatement(null));
    }
    this.checkRecursion();
    return { main, procs: this.procs, mode: this.mode };
  }

  // ---- headers (first pass) -------------------------------------------

  /** Collects procedure names and arities so calls can be validated before definitions. */
  private prescanHeaders(): void {
    for (let j = 0; j < this.tokens.length; j++) {
      const t = this.tokens[j]!;
      if (!(this.isDefineWord(t) && t.lineStart)) continue;
      const header = this.parseHeader(j);
      const existing = this.headerByName.get(header.name);
      if (existing) {
        throw new LogoError(
          `Procedura ${q(header.displayName)} jest już zdefiniowana (w wierszu ${existing.pos.line}). Każdą nazwę można zdefiniować tylko raz.`,
          this.tokens[j + 1]!.pos,
        );
      }
      this.headerByName.set(header.name, header);
      this.headers.set(j, header);
    }
    // A parameter must not share a name with a procedure: the body could not tell them apart.
    for (const header of this.headerByName.values()) {
      for (const param of header.params) {
        const clash = this.headerByName.get(param);
        if (clash) {
          throw new LogoError(
            `Parametr ${q(param)} procedury ${q(header.displayName)} ma taką samą nazwę jak procedura ${q(clash.displayName)}. Zmień nazwę parametru.`,
            header.pos,
          );
        }
      }
    }
  }

  private parseHeader(otoIndex: number): Header {
    const oto = this.tokens[otoIndex]!;
    const nameTok = this.tokens[otoIndex + 1]!;
    if (nameTok.kind === 'newline' || nameTok.kind === 'eof') {
      throw new LogoError(`Po ${q(oto.text)} brakuje nazwy procedury, np. „oto kwadrat”.`, oto.pos);
    }
    if (nameTok.kind !== 'word') {
      throw new LogoError(`${q(nameTok.text)} nie może być nazwą procedury. Nazwa powinna być słowem, np. „kwadrat”.`, nameTok.pos);
    }
    if (isReservedWord(nameTok.value)) {
      throw new LogoError(`${q(nameTok.text)} to nazwa polecenia i nie może być nazwą procedury.`, nameTok.pos);
    }
    const params: string[] = [];
    const paramDisplay: string[] = [];
    let j = otoIndex + 2;
    let t = this.tokens[j]!;
    const addParam = (tok: Token): void => {
      const name = tok.value;
      if (isReservedWord(name)) {
        throw new LogoError(`${q(tok.text)} to nazwa polecenia i nie może być nazwą parametru.`, tok.pos);
      }
      if (params.includes(name)) {
        throw new LogoError(`Parametr ${q(name)} powtarza się w nagłówku procedury ${q(nameTok.text)}.`, tok.pos);
      }
      params.push(name);
      paramDisplay.push(tok.text.replace(/^:/, ''));
    };

    if (t.kind === 'ma') {
      j++;
      let expectName = true;
      let count = 0;
      for (;;) {
        t = this.tokens[j]!;
        if (t.kind === 'newline' || t.kind === 'eof') break;
        if (t.kind === 'comma') {
          if (expectName) {
            throw new LogoError(
              count === 0 ? `Po „ma:” oczekiwano nazwy parametru, a nie przecinka.` : `Nieoczekiwany przecinek: między parametrami wystarczy jeden.`,
              t.pos,
            );
          }
          expectName = true;
          j++;
          continue;
        }
        if (t.kind === 'word' || t.kind === 'param') {
          addParam(t);
          count++;
          expectName = false;
          j++;
          continue;
        }
        throw new LogoError(`${q(t.text)} nie może być nazwą parametru. Parametry to słowa oddzielone przecinkami, np. „ma: bok, kąt”.`, t.pos);
      }
      if (count === 0) {
        throw new LogoError(`Po „ma:” brakuje listy parametrów, np. „oto ${nameTok.text} ma: bok”.`, this.tokens[otoIndex + 2]!.pos);
      }
      if (expectName) {
        throw new LogoError(`Po przecinku brakuje nazwy kolejnego parametru.`, this.tokens[j - 1]!.pos);
      }
    } else {
      // Legacy form: oto nazwa :a :b
      for (;;) {
        t = this.tokens[j]!;
        if (t.kind === 'newline' || t.kind === 'eof') break;
        if (t.kind === 'param') {
          addParam(t);
          j++;
          continue;
        }
        if (t.kind === 'comma') {
          j++;
          continue;
        }
        throw new LogoError(
          `Nieoczekiwane ${q(t.text)} w nagłówku procedury ${q(nameTok.text)}. Parametry podaje się po „ma:” (np. „ma: bok, kąt”) albo jako „:bok :kąt”, a treść procedury zaczyna się w nowym wierszu.`,
          t.pos,
        );
      }
    }
    // j points at the newline/eof ending the header line.
    return {
      name: nameTok.value,
      displayName: nameTok.text,
      params,
      pos: oto.pos,
      bodyStart: j,
    };
  }

  // ---- definitions ---------------------------------------------------

  private parseDefinition(): void {
    const oto = this.peek();
    const header = this.headers.get(this.i)!;
    this.i = header.bodyStart;
    const ctx: ProcContext = { name: header.name, displayName: header.displayName, params: header.params };
    const body: Stmt[] = [];
    this.lastStmt = null;
    for (;;) {
      const t = this.peek();
      if (t.kind === 'eof') {
        throw new LogoError(`Brakuje słowa „już” kończącego procedurę ${q(header.displayName)}. Napisz „już” w osobnym wierszu po jej treści.`, oto.pos);
      }
      if (t.kind === 'newline') {
        this.i++;
        continue;
      }
      if (this.isEndWord(t)) {
        if (!t.lineStart) {
          throw new LogoError(`Słowo ${q(t.text)} kończące procedurę musi stać samo w osobnym wierszu.`, t.pos);
        }
        this.i++;
        const after = this.peek();
        if (after.kind !== 'newline' && after.kind !== 'eof') {
          throw new LogoError(`Po ${q(t.text)} nie może być nic więcej w tym samym wierszu; przenieś ${q(after.text)} do nowego wiersza.`, after.pos);
        }
        break;
      }
      if (this.isDefineWord(t)) {
        throw new LogoError(
          `Nie można definiować procedury wewnątrz procedury ${q(header.displayName)}. Najpierw zakończ ją słowem „już”.`,
          t.pos,
        );
      }
      body.push(this.parseStatement(ctx));
    }
    this.procs.set(header.name, {
      name: header.name,
      displayName: header.displayName,
      params: header.params,
      body,
      pos: oto.pos,
    });
    this.lastStmt = null;
  }

  // ---- statements ----------------------------------------------------

  private parseStatement(ctx: ProcContext | null): Stmt {
    const t = this.next();
    switch (t.kind) {
      case 'number': {
        const prev = this.lastStmt;
        const hint = prev
          ? prev.kind === 'call'
            ? ` Procedura ${q(prev.word)} przyjmuje ${this.arityText(this.headerByName.get(prev.name)!)}.`
            : prev.kind === 'pen'
              ? ` Polecenie ${q(prev.word)} nie przyjmuje argumentów.`
              : ` Polecenie ${q(prev.word)} przyjmuje tylko jeden argument.`
          : '';
        throw new LogoError(`Nieoczekiwana liczba ${q(t.text)}: w tym miejscu powinno być polecenie.${hint}`, t.pos);
      }
      case 'color':
        if (!t.color) throw this.badColor(t);
        throw new LogoError(`Nieoczekiwany kolor ${t.text}: przed kolorem powinno stać polecenie „kolor”.`, t.pos);
      case 'param':
        throw new LogoError(`Nieoczekiwany parametr ${q(t.text)}: w tym miejscu powinno być polecenie, np. „np ${t.text}”.`, t.pos);
      case 'lbracket':
        throw new LogoError(`Nieoczekiwany nawias „[”: nawiasy mogą stać tylko po „powtórz” i liczbie powtórzeń, np. „powtórz 4 [ … ]”.`, t.pos);
      case 'rbracket':
        throw new LogoError(`Nawias „]” nie ma pasującego nawiasu otwierającego „[”.`, t.pos);
      case 'comma':
        throw new LogoError(`Nieoczekiwany przecinek. Argumenty oddziela się spacjami, np. „kwadrat 80 90”.`, t.pos);
      case 'ma':
        throw new LogoError(`Słowo „ma:” może pojawić się tylko w nagłówku procedury, np. „oto kwadrat ma: bok”.`, t.pos);
      case 'newline':
      case 'eof':
        // Unreachable: callers skip newlines and check for eof.
        throw new LogoError('Nieoczekiwany koniec programu.', t.pos);
      case 'word':
        return this.parseWordStatement(t, ctx);
    }
  }

  private parseWordStatement(t: Token, ctx: ProcContext | null): Stmt {
    const cmd = COMMAND_BY_WORD.get(t.value);
    let stmt: Stmt;
    if (cmd) {
      switch (cmd) {
        case 'fd':
        case 'bk':
          stmt = { kind: 'move', sign: cmd === 'fd' ? 1 : -1, arg: this.parseNumArg(t, ctx, 'odległości'), pos: t.pos, word: t.text };
          break;
        case 'rt':
        case 'lt':
          stmt = { kind: 'yaw', sign: cmd === 'rt' ? 1 : -1, arg: this.parseNumArg(t, ctx, 'kąta w stopniach'), pos: t.pos, word: t.text };
          break;
        case 'pitchup':
        case 'pitchdown':
          if (this.mode === '2d') {
            throw new LogoError(
              `Polecenie ${q(t.text)} obraca żółwia w przestrzeni i działa tylko w trybie 3D. Przełącz pracownię na 3D albo usuń to polecenie.`,
              t.pos,
            );
          }
          stmt = { kind: 'pitch', sign: cmd === 'pitchup' ? 1 : -1, arg: this.parseNumArg(t, ctx, 'kąta w stopniach'), pos: t.pos, word: t.text };
          break;
        case 'pu':
        case 'pd':
          stmt = { kind: 'pen', down: cmd === 'pd', pos: t.pos, word: t.text };
          break;
        case 'color':
          stmt = { kind: 'color', value: this.parseColorArg(t), pos: t.pos, word: t.text };
          break;
        case 'width': {
          const arg = this.parseNumArg(t, ctx, 'grubości');
          if (arg.kind === 'num' && !validWidth(arg.value)) {
            throw new LogoError(widthMessage(arg.value), arg.pos);
          }
          stmt = { kind: 'width', arg, pos: t.pos, word: t.text };
          break;
        }
        case 'repeat':
          stmt = this.parseRepeat(t, ctx);
          break;
      }
    } else {
      const header = this.headerByName.get(t.value);
      if (!header) {
        throw new LogoError(this.unknownCommandMessage(t, ctx), t.pos);
      }
      stmt = this.parseCall(t, header, ctx);
    }
    this.lastStmt = stmt;
    return stmt;
  }

  private unknownCommandMessage(t: Token, ctx: ProcContext | null): string {
    if (ctx && ctx.params.includes(t.value)) {
      return `${q(t.text)} to parametr procedury ${q(ctx.displayName)}, a nie polecenie. Użyj go jako argumentu, np. „np ${t.text}”.`;
    }
    if (t.text.startsWith('#')) {
      return `Nieznane polecenie ${q(t.text)}. Kolor zapisuje się w cudzysłowie po poleceniu „kolor”, np. kolor "${t.text}".`;
    }
    return `Nieznane polecenie ${q(t.text)}. Dostępne polecenia to m.in. np, ws, pw, lw, pod, opu, kolor, grubość, powtórz, góra, dół oraz nazwy zdefiniowanych procedur.`;
  }

  private parseNumArg(cmd: Token, ctx: ProcContext | null, what: string): NumArg {
    const t = this.peekSkippingNewlines();
    if (t.kind === 'number') {
      this.skipNewlines();
      this.i++;
      return { kind: 'num', value: t.num, pos: t.pos };
    }
    if (t.kind === 'param' || (t.kind === 'word' && ctx !== null && ctx.params.includes(t.value))) {
      const name = t.value;
      if (ctx === null) {
        throw new LogoError(`${q(t.text)} wygląda na parametr, ale parametrów można używać tylko wewnątrz procedury.`, t.pos);
      }
      const index = ctx.params.indexOf(name);
      if (index < 0) {
        throw new LogoError(
          `Procedura ${q(ctx.displayName)} nie ma parametru ${q(name)}.${ctx.params.length ? ` Jej parametry to: ${ctx.params.join(', ')}.` : ' Nie ma żadnych parametrów.'}`,
          t.pos,
        );
      }
      this.skipNewlines();
      this.i++;
      return { kind: 'param', name, index, pos: t.pos };
    }
    const missing = `Polecenie ${q(cmd.text)} wymaga ${what}, np. „${cmd.text} 50”.`;
    if (t.kind === 'word') {
      if (this.isEndWord(t) || this.isDefineWord(t)) {
        throw new LogoError(missing, cmd.pos);
      }
      throw new LogoError(`Polecenie ${q(cmd.text)} oczekuje liczby, a dostało ${q(t.text)}.`, t.pos);
    }
    if (t.kind === 'color') {
      throw new LogoError(`Polecenie ${q(cmd.text)} oczekuje liczby, a dostało kolor ${t.text}.`, t.pos);
    }
    throw new LogoError(missing, cmd.pos);
  }

  private parseColorArg(cmd: Token): string {
    const t = this.peekSkippingNewlines();
    if (t.kind === 'color') {
      if (!t.color) throw this.badColor(t);
      this.skipNewlines();
      this.i++;
      return t.color;
    }
    if (t.kind === 'word' && t.text.startsWith('#')) {
      throw new LogoError(`Kolor musi być w cudzysłowie: kolor "${t.text}".`, t.pos);
    }
    if (t.kind === 'number' || t.kind === 'param' || (t.kind === 'word' && !this.isEndWord(t) && !this.isDefineWord(t))) {
      throw new LogoError(`Polecenie ${q(cmd.text)} oczekuje koloru w postaci "#rrggbb", a dostało ${q(t.text)}.`, t.pos);
    }
    throw new LogoError(`Polecenie ${q(cmd.text)} wymaga koloru, np. ${cmd.text} "#16866a".`, cmd.pos);
  }

  private badColor(t: Token): LogoError {
    return new LogoError(
      `Niepoprawny kolor ${t.text}. Kolor zapisuje się jako „#” i sześć cyfr szesnastkowych w cudzysłowie, np. "#16866a".`,
      t.pos,
    );
  }

  private parseRepeat(cmd: Token, ctx: ProcContext | null): Stmt {
    const count = this.parseNumArg(cmd, ctx, 'liczby powtórzeń');
    if (count.kind === 'num' && !validRepeatCount(count.value)) {
      throw new LogoError(repeatMessage(count.value), count.pos);
    }
    const open = this.peekSkippingNewlines();
    if (open.kind !== 'lbracket') {
      if (open.kind === 'eof' || this.isEndWord(open) || this.isDefineWord(open)) {
        throw new LogoError(`Po „${cmd.text} ${countText(count)}” brakuje treści w nawiasach, np. „${cmd.text} ${countText(count)} [np 50 pw 90]”.`, cmd.pos);
      }
      throw new LogoError(`Po „${cmd.text} ${countText(count)}” oczekiwano nawiasu „[”, a jest ${q(open.text)}.`, open.pos);
    }
    this.skipNewlines();
    this.i++;
    this.bracketDepth++;
    if (this.bracketDepth > LIMITS.depth) {
      throw new LogoError(`Za głębokie zagnieżdżenie nawiasów: dozwolone są najwyżej ${LIMITS.depth} poziomy.`, open.pos);
    }
    const body: Stmt[] = [];
    const savedLast = this.lastStmt;
    this.lastStmt = null;
    for (;;) {
      const t = this.peek();
      if (t.kind === 'newline') {
        this.i++;
        continue;
      }
      if (t.kind === 'rbracket') {
        this.i++;
        break;
      }
      if (t.kind === 'eof' || this.isEndWord(t)) {
        throw new LogoError(`Brakuje zamykającego nawiasu „]” dla nawiasu otwartego w wierszu ${open.pos.line}, kolumnie ${open.pos.column}.`, open.pos);
      }
      if (this.isDefineWord(t)) {
        throw new LogoError(`Definicja procedury nie może znajdować się wewnątrz nawiasów „[ ]”. Przenieś ją na początek wiersza poza „powtórz”.`, t.pos);
      }
      body.push(this.parseStatement(ctx));
    }
    this.bracketDepth--;
    this.lastStmt = savedLast;
    return { kind: 'repeat', count, body, pos: cmd.pos, word: cmd.text };
  }

  private parseCall(t: Token, header: Header, ctx: ProcContext | null): Stmt {
    const args: NumArg[] = [];
    for (let k = 0; k < header.params.length; k++) {
      const a = this.peekSkippingNewlines();
      const isNumeric =
        a.kind === 'number' || a.kind === 'param' || (a.kind === 'word' && ctx !== null && ctx.params.includes(a.value));
      if (!isNumeric) {
        throw new LogoError(
          `Procedura ${q(t.text)} oczekuje ${this.arityText(header)}, a podano ${k === 0 ? 'żadnego' : String(k)}.`,
          t.pos,
        );
      }
      args.push(this.parseNumArg(t, ctx, 'liczby'));
    }
    const extra = this.peekSkippingNewlines();
    if (extra.kind === 'number' || extra.kind === 'param' || (extra.kind === 'word' && ctx !== null && ctx.params.includes(extra.value))) {
      throw new LogoError(
        header.params.length === 0
          ? `Procedura ${q(t.text)} nie przyjmuje argumentów, a podano ${q(extra.text)}.`
          : `Za dużo argumentów dla procedury ${q(t.text)}: oczekuje ${this.arityText(header)}.`,
        extra.pos,
      );
    }
    if (ctx) {
      this.edges.push({ from: ctx.name, to: header.name, pos: t.pos });
    }
    return { kind: 'call', name: header.name, args, pos: t.pos, word: t.text };
  }

  private arityText(header: Header): string {
    const n = header.params.length;
    if (n === 0) return 'żadnych argumentów';
    return `${n} ${plural(n, 'argumentu', 'argumentów', 'argumentów')} (${header.params.join(', ')})`;
  }

  // ---- recursion check -------------------------------------------------

  private checkRecursion(): void {
    // Build adjacency with the first call position for each (from, to).
    const adj = new Map<string, Map<string, Pos>>();
    for (const e of this.edges) {
      let m = adj.get(e.from);
      if (!m) {
        m = new Map();
        adj.set(e.from, m);
      }
      if (!m.has(e.to)) m.set(e.to, e.pos);
    }
    const WHITE = 0;
    const GRAY = 1;
    const BLACK = 2;
    const state = new Map<string, number>();
    const stack: string[] = [];
    const display = (n: string): string => this.procs.get(n)?.displayName ?? n;

    const visit = (node: string): void => {
      state.set(node, GRAY);
      stack.push(node);
      const outs = adj.get(node);
      if (outs) {
        for (const [to, pos] of outs) {
          const s = state.get(to) ?? WHITE;
          if (s === GRAY) {
            // Cycle: stack from `to` to node, closed by node -> to.
            const start = stack.indexOf(to);
            const cycle = stack.slice(start);
            cycle.push(to);
            // Report at the earliest call token in the cycle, in source order.
            let best = pos;
            for (let k = 0; k + 1 < cycle.length; k++) {
              const p = adj.get(cycle[k]!)!.get(cycle[k + 1]!)!;
              if (p.line < best.line || (p.line === best.line && p.column < best.column)) best = p;
            }
            if (to === node) {
              throw new LogoError(
                `Procedura ${q(display(node))} wywołuje samą siebie. Rekurencja nie jest dozwolona, nawet jeśli to wywołanie nigdy by się nie wykonało.`,
                best,
              );
            }
            throw new LogoError(
              `Procedura ${q(display(to))} wywołuje pośrednio samą siebie (${cycle.map(display).join(' → ')}). Rekurencja nie jest dozwolona.`,
              best,
            );
          }
          if (s === WHITE) visit(to);
        }
      }
      stack.pop();
      state.set(node, BLACK);
    };
    for (const name of this.procs.keys()) {
      if ((state.get(name) ?? WHITE) === WHITE) visit(name);
    }
  }
}

function countText(count: NumArg): string {
  return count.kind === 'num' ? String(count.value) : count.name;
}

export function validWidth(v: number): boolean {
  return Number.isInteger(v) && v >= LIMITS.widthMin && v <= LIMITS.widthMax;
}

export function widthMessage(v: number, paramName?: string): string {
  const got = paramName ? `parametr ${q(paramName)} ma wartość ${v}` : `podano ${v}`;
  return `Grubość pisaka musi być liczbą całkowitą od ${LIMITS.widthMin} do ${LIMITS.widthMax}, a ${got}.`;
}

export function validRepeatCount(v: number): boolean {
  return Number.isInteger(v) && v >= 0 && v <= LIMITS.repeatMax;
}

export function repeatMessage(v: number, paramName?: string): string {
  const got = paramName ? `parametr ${q(paramName)} ma wartość ${v}` : `podano ${v}`;
  return `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${fmtInt(LIMITS.repeatMax)}, a ${got}.`;
}
