import {
  OP_ADD, OP_DIV, OP_MUL, OP_NEG, OP_NUM, OP_REP, OP_SUB, OP_VAR,
  type Comparison, type Condition, type Expr, type Instr, type Mode, type Procedure,
  type Program, type Stmt,
} from './ast';
import { LIMITS, LogoError, fmtNum, plural, thousands } from './errors';
import { ALL_SPELLINGS, COMMANDS_3D, type Keyword } from './keywords';
import { tokenize, type Token } from './lexer';

interface ProcContext {
  key: string;
  name: string;
  params: Set<string>;
  vars: Set<string>;
}

interface Header {
  key: string | null;
  arity: number;
  vars: Set<string>;
}

type StackItem =
  | { kind: '('; tok: Token }
  | { kind: 'neg' | 'pos'; tok: Token }
  | { kind: 'bin'; op: string; prec: number; tok: Token };

const BIN_CODE: Record<string, number> = { '+': OP_ADD, '-': OP_SUB, '*': OP_MUL, '/': OP_DIV };

/** Parses and validates a whole program. Throws a LogoError on the first problem. */
export function parse(src: string, mode: Mode): Program {
  if (src.length > LIMITS.sourceChars) {
    const at = positionOf(src, LIMITS.sourceChars);
    throw new LogoError(
      `Program jest za długi: ma ${thousands(src.length)} znaków, a limit to ${thousands(LIMITS.sourceChars)}.`,
      at,
    );
  }
  const tokens = tokenize(src).filter((t) => t.type !== 'comment');
  // The final token is the synthetic end-of-file marker.
  if (tokens.length - 1 > LIMITS.tokens) {
    throw new LogoError(
      `Program ma za dużo elementów: limit to ${thousands(LIMITS.tokens)} (słów, liczb, operatorów i nawiasów).`,
      tokens[LIMITS.tokens],
    );
  }
  return new Parser(tokens, mode).program();
}

function positionOf(src: string, offset: number) {
  let line = 1;
  let lineStart = 0;
  for (let i = 0; i < offset; i++) {
    const ch = src[i];
    if (ch === '\n' || (ch === '\r' && src[i + 1] !== '\n')) {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, col: offset - lineStart + 1, offset, end: offset + 1 };
}

/** Evaluates an expression without names. Returns undefined when it fails (left for run time). */
export function constantValue(e: Expr): number | undefined {
  const st: number[] = [];
  for (const ins of e.code) {
    switch (ins.op) {
      case OP_NUM: st.push(ins.v!); break;
      case OP_NEG: st[st.length - 1] = -st[st.length - 1]; break;
      case OP_VAR: case OP_REP: return undefined;
      default: {
        const b = st.pop()!;
        const a = st.pop()!;
        let r: number;
        if (ins.op === OP_ADD) r = a + b;
        else if (ins.op === OP_SUB) r = a - b;
        else if (ins.op === OP_MUL) r = a * b;
        else {
          if (b === 0) return undefined;
          r = a / b;
        }
        if (!Number.isFinite(r)) return undefined;
        st.push(r);
      }
    }
  }
  return st[0];
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

const DESCRIBE: Partial<Record<string, string>> = { eof: 'koniec programu' };

function show(t: Token): string {
  return DESCRIBE[t.type] ?? `„${t.text}”`;
}

class Parser {
  private i = 0;
  private readonly headers = new Map<number, Header>();
  private readonly arity = new Map<string, number>();
  private readonly topVars = new Set<string>();
  private readonly procs = new Map<string, Procedure>();
  private proc: ProcContext | null = null;
  private repDepth = 0;
  private brDepth = 0;

  constructor(
    private readonly toks: Token[],
    private readonly mode: Mode,
  ) {
    this.prescan();
  }

  // ---------------------------------------------------------------- helpers

  private peek(k = 0): Token {
    return this.toks[Math.min(this.i + k, this.toks.length - 1)];
  }

  private next(): Token {
    const t = this.toks[this.i];
    if (this.i < this.toks.length - 1) this.i++;
    return t;
  }

  private firstOnLine(idx: number): boolean {
    return idx === 0 || this.toks[idx - 1].line !== this.toks[idx].line;
  }

  private aloneOnLine(idx: number): boolean {
    const t = this.toks[idx];
    const after = this.toks[idx + 1];
    return this.firstOnLine(idx) && (after.type === 'eof' || after.line !== t.line);
  }

  private fail(message: string, at: Token): never {
    throw new LogoError(message, at);
  }

  private failToken(t: Token): never {
    throw new LogoError(t.message ?? `Nieoczekiwany ${show(t)}.`, t);
  }

  /**
   * Finds procedure headers (to know arities of calls that precede definitions)
   * and the names assigned with `niech` at top level and in every procedure body.
   */
  private prescan(): void {
    const toks = this.toks;
    let cur: Header | null = null;
    for (let idx = 0; idx < toks.length - 1; idx++) {
      const t = toks[idx];
      if (t.type !== 'name') continue;
      if (t.kw === 'to' && cur === null && this.firstOnLine(idx)) {
        const nameTok = toks[idx + 1];
        let key: string | null = null;
        let arity = 0;
        if (nameTok.type === 'name' && !nameTok.kw && nameTok.line === t.line) {
          key = nameTok.key!;
          for (let j = idx + 2; toks[j].type !== 'eof' && toks[j].line === t.line; j++) {
            if (toks[j].type === 'name' || toks[j].type === 'param') arity++;
          }
          if (!this.arity.has(key)) this.arity.set(key, arity);
        }
        cur = { key, arity, vars: new Set() };
        this.headers.set(idx, cur);
        continue;
      }
      if (t.kw === 'end' && cur !== null && this.aloneOnLine(idx)) {
        cur = null;
        continue;
      }
      if (t.kw === 'let') {
        const n = toks[idx + 1];
        if ((n.type === 'name' || n.type === 'param') && !n.kw) (cur ? cur.vars : this.topVars).add(n.key!);
      }
    }
  }

  // ---------------------------------------------------------------- program

  program(): Program {
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.type === 'eof') break;
      if (t.type === 'name' && t.kw === 'to') {
        if (!this.firstOnLine(this.i)) {
          this.fail('Słowo „oto” musi stać na początku linii: definicja procedury zaczyna się w nowej linii.', t);
        }
        this.definition();
        continue;
      }
      if (t.type === 'name' && t.kw === 'end') {
        this.fail(`Słowo „${t.text}” kończy procedurę, ale żadna procedura nie została rozpoczęta słowem „oto”.`, t);
      }
      body.push(this.statement());
    }
    return { mode: this.mode, body, procs: this.procs };
  }

  private definition(): void {
    const otoIdx = this.i;
    const oto = this.next();
    const header = this.headers.get(otoIdx);
    const nameTok = this.peek();
    if (nameTok.type === 'eof' || nameTok.line !== oto.line) {
      this.fail(`Po „${oto.text}” podaj w tej samej linii nazwę procedury, np. „oto kwadrat”.`, oto);
    }
    if (nameTok.type === 'error') this.failToken(nameTok);
    if (nameTok.type !== 'name') {
      this.fail(`${show(nameTok)} nie może być nazwą procedury. Nazwa zaczyna się od litery, np. „kwadrat”.`, nameTok);
    }
    if (nameTok.kw) {
      this.fail(`„${nameTok.text}” to słowo języka Logo — wybierz inną nazwę procedury.`, nameTok);
    }
    const key = nameTok.key!;
    const existing = this.procs.get(key);
    if (existing) {
      this.fail(`Procedura „${nameTok.text}” jest już zdefiniowana w linii ${existing.nameTok.line}.`, nameTok);
    }
    this.next();

    const params: string[] = [];
    const paramNames: string[] = [];
    const addParam = (p: Token) => {
      if (p.kw) this.fail(`„${p.text.replace(/^:/, '')}” to słowo języka Logo — nie może być nazwą parametru.`, p);
      if (params.includes(p.key!)) this.fail(`Parametr „${p.text.replace(/^:/, '')}” powtarza się w nagłówku.`, p);
      params.push(p.key!);
      paramNames.push(p.text.replace(/^:/, ''));
    };
    const sameLine = () => this.peek().type !== 'eof' && this.peek().line === oto.line;

    if (sameLine()) {
      const t = this.peek();
      if (t.type === 'ma') {
        this.next();
        for (;;) {
          const p = this.peek();
          if (!sameLine()) {
            this.fail('Po „ma:” podaj w tej samej linii nazwy parametrów oddzielone przecinkami, np. „ma: bok, kąt”.', p.type === 'eof' || p.line !== oto.line ? this.toks[this.i - 1] : p);
          }
          if (p.type === 'error') this.failToken(p);
          if (p.type !== 'name' && p.type !== 'param') {
            this.fail(`${show(p)} nie może być nazwą parametru. Nazwa zaczyna się od litery, np. „bok”.`, p);
          }
          this.next();
          addParam(p);
          if (!sameLine()) break;
          const sep = this.peek();
          if (sep.type === ',') {
            this.next();
            continue;
          }
          if (sep.type === 'name' || sep.type === 'param') {
            this.fail('Parametry oddziel przecinkami, np. „ma: bok, kąt”.', sep);
          }
          if (sep.type === 'error') this.failToken(sep);
          this.fail(`Nieoczekiwany ${show(sep)} w nagłówku procedury. Treść procedury zacznij od nowej linii.`, sep);
        }
      } else if (t.type === 'param') {
        while (sameLine() && this.peek().type === 'param') addParam(this.next());
      } else if (t.type === 'name' && !t.kw) {
        this.fail(`Przed parametrami napisz „ma:”, np. „oto ${nameTok.text} ma: ${t.text}”.`, t);
      }
      if (sameLine()) {
        const extra = this.peek();
        if (extra.type === 'error') this.failToken(extra);
        this.fail(`Nieoczekiwany ${show(extra)} w nagłówku procedury. Treść procedury zacznij od nowej linii.`, extra);
      }
    }

    const ctx: ProcContext = {
      key,
      name: nameTok.text,
      params: new Set(params),
      vars: header?.vars ?? new Set(),
    };
    const saved = { proc: this.proc, rep: this.repDepth, br: this.brDepth };
    this.proc = ctx;
    this.repDepth = 0;
    this.brDepth = 0;
    const body: Stmt[] = [];
    let endTok: Token;
    for (;;) {
      const t = this.peek();
      if (t.type === 'eof') {
        this.fail(`Brakuje słowa „już” kończącego procedurę „${nameTok.text}”. Napisz je samo w osobnej linii.`, oto);
      }
      if (t.type === 'name' && t.kw === 'end') {
        if (!this.aloneOnLine(this.i)) {
          this.fail(`Słowo „${t.text}” musi stać samo w osobnej linii.`, t);
        }
        endTok = this.next();
        break;
      }
      if (t.type === 'name' && t.kw === 'to') {
        this.fail(
          `Nie można definiować procedury wewnątrz innej procedury. Czy brakuje słowa „już” na końcu procedury „${nameTok.text}”?`,
          t,
        );
      }
      body.push(this.statement());
    }
    this.proc = saved.proc;
    this.repDepth = saved.rep;
    this.brDepth = saved.br;
    this.procs.set(key, { name: nameTok.text, key, params, paramNames, body, nameTok, endTok });
  }

  // ---------------------------------------------------------------- statements

  private statement(): Stmt {
    const t = this.peek();
    switch (t.type) {
      case 'error':
        this.failToken(t);
      // eslint-disable-next-line no-fallthrough
      case 'name':
        return t.kw ? this.keywordStatement(t, t.kw) : this.call(t);
      case 'num':
      case 'param':
      case '(':
        this.strayValue(t);
      // eslint-disable-next-line no-fallthrough
      case 'op':
        if (t.text === '+' || t.text === '-') this.strayValue(t);
        this.fail(`Nieoczekiwany operator „${t.text}”: w tym miejscu powinno stać polecenie.`, t);
      // eslint-disable-next-line no-fallthrough
      case 'cmp':
        this.fail(`Nieoczekiwany znak porównania „${t.text}”. Porównań używa się w warunkach: jeśli x > 0 [ ... ].`, t);
      // eslint-disable-next-line no-fallthrough
      case 'str':
        this.fail(`Nieoczekiwany tekst ${t.text}: w tym miejscu powinno stać polecenie. Kolor ustawia się poleceniem kolor ${t.text}.`, t);
      // eslint-disable-next-line no-fallthrough
      case '[':
        this.fail('Nieoczekiwany nawias „[”. Nawiasy kwadratowe obejmują treść polecenia powtorz, jeśli albo jeżeli.', t);
      // eslint-disable-next-line no-fallthrough
      case ']':
        this.fail('Nawias „]” nie ma pary — brakuje otwierającego nawiasu „[”.', t);
      // eslint-disable-next-line no-fallthrough
      case ')':
        this.fail('Nawias „)” nie ma pary — brakuje otwierającego nawiasu „(”.', t);
      // eslint-disable-next-line no-fallthrough
      case ',':
        this.fail('Nieoczekiwany przecinek. Przecinki oddzielają tylko parametry w nagłówku procedury.', t);
      // eslint-disable-next-line no-fallthrough
      case 'ma':
        this.fail('„ma:” może wystąpić tylko w nagłówku procedury, np. „oto kwadrat ma: bok”.', t);
      // eslint-disable-next-line no-fallthrough
      default:
        this.fail(`Nieoczekiwany ${show(t)}.`, t);
    }
  }

  /** Reports a value standing where a command is expected. */
  private strayValue(t: Token): never {
    let text = t.text;
    const n = this.peek(1);
    if ((t.type === 'op') && n.offset === t.end && n.type !== 'eof') text += n.text;
    if (text.length > 24) text = text.slice(0, 24) + '…';
    let message = `Nieoczekiwana wartość „${text}”: w tym miejscu powinno stać polecenie.`;
    const prev = this.i > 0 ? this.toks[this.i - 1] : null;
    if (t.type === 'op' && t.spaceBefore && !t.spaceAfter && prev && isValueEnd(prev)) {
      message += ` Jeśli to miało być działanie, operator „${t.text}” musi mieć spacje po obu stronach albo po żadnej: „${prev.text} ${t.text} ${n.text}” lub „${prev.text}${t.text}${n.text}”.`;
    } else if (prev && isValueEnd(prev)) {
      message += ' Czy polecenie lub procedura nie dostały za dużo argumentów?';
    }
    this.fail(message, t);
  }

  private keywordStatement(t: Token, kw: Keyword): Stmt {
    switch (kw) {
      case 'fd': case 'bk': {
        this.next();
        return { kind: 'move', tok: t, dir: kw === 'fd' ? 1 : -1, arg: this.argument(t) };
      }
      case 'rt': case 'lt': case 'up': case 'down': case 'rr': case 'rl': {
        if (COMMANDS_3D.has(kw) && this.mode === '2d') {
          this.fail(`Polecenie „${t.text}” działa tylko w trybie 3D. Przełącz tryb na 3D, aby obracać żółwia w przestrzeni.`, t);
        }
        this.next();
        const axis = kw === 'rt' || kw === 'lt' ? 'yaw' : kw === 'up' || kw === 'down' ? 'pitch' : 'roll';
        const sign = kw === 'rt' || kw === 'up' || kw === 'rr' ? 1 : -1;
        return { kind: 'turn', tok: t, axis, sign, arg: this.argument(t) };
      }
      case 'pu': case 'pd':
        this.next();
        return { kind: 'pen', tok: t, down: kw === 'pd' };
      case 'stop':
        this.next();
        return { kind: 'stop', tok: t };
      case 'home':
        this.next();
        return { kind: 'home', tok: t };
      case 'cs':
        this.next();
        return { kind: 'clear', tok: t };
      case 'color': {
        this.next();
        const c = this.peek();
        if (c.type === 'error') this.failToken(c);
        if (c.type !== 'str') {
          this.fail(`Po „${t.text}” podaj kolor w cudzysłowie, np. ${t.text} "#16866a".`, c.type === 'eof' ? t : c);
        }
        if (!/^#[0-9a-fA-F]{6}$/.test(c.str!)) {
          this.fail(`Nieprawidłowy kolor ${c.text}. Kolor zapisuje się jako "#rrggbb": krzyżyk i sześć cyfr szesnastkowych, np. "#16866a".`, c);
        }
        this.next();
        return { kind: 'color', tok: t, color: c.str!.toLowerCase() };
      }
      case 'width': {
        this.next();
        const arg = this.argument(t);
        if (!arg.names) {
          const v = constantValue(arg);
          if (v !== undefined && !(Number.isInteger(v) && v >= 1 && v <= 12)) {
            this.fail(widthMessage(v), arg.first);
          }
        }
        return { kind: 'width', tok: t, arg };
      }
      case 'repeat': {
        this.next();
        const count = this.argument(t);
        if (!count.names) {
          const v = constantValue(count);
          if (v !== undefined && !(Number.isInteger(v) && v >= 0 && v <= 10000)) {
            this.fail(repeatMessage(v), count.first);
          }
        }
        this.repDepth++;
        const { body, close } = this.block(t);
        this.repDepth--;
        return { kind: 'repeat', tok: t, count, body, close };
      }
      case 'let': {
        this.next();
        const n = this.peek();
        if (n.type === 'error') this.failToken(n);
        if (n.type !== 'name' && n.type !== 'param') {
          this.fail(`Po „${t.text}” podaj nazwę zmiennej i jej wartość, np. „${t.text} bok 50”.`, n.type === 'eof' ? t : n);
        }
        const plain = n.text.replace(/^:/, '');
        if (n.kw) this.fail(`„${plain}” to słowo języka Logo — nie może być nazwą zmiennej.`, n);
        const key = n.key!;
        if (this.arity.has(key) && !(this.proc && this.proc.params.has(key))) {
          this.fail(`„${plain}” to nazwa procedury — zmienna musi nazywać się inaczej.`, n);
        }
        this.next();
        const arg = this.argument(t, `Po „${t.text} ${plain}” podaj wartość, np. „${t.text} ${plain} 10”.`);
        return { kind: 'let', tok: t, key, name: plain, arg };
      }
      case 'if': case 'ifelse': {
        this.next();
        const cond = this.condition(t);
        const thenPart = this.block(t);
        if (kw === 'if') {
          return { kind: 'if', tok: t, cond, then: thenPart.body, thenClose: thenPart.close, else: null, elseClose: null };
        }
        const elsePart = this.block(t, true);
        return {
          kind: 'if', tok: t, cond, then: thenPart.body, thenClose: thenPart.close,
          else: elsePart.body, elseClose: elsePart.close,
        };
      }
      case 'repcount':
        this.fail(`„${t.text}” to wartość (numer powtórzenia), a nie polecenie. Użyj jej jako argumentu, np. „np ${t.text} * 10”.`, t);
      // eslint-disable-next-line no-fallthrough
      case 'to':
        this.fail('Procedury można definiować tylko na najwyższym poziomie programu, a nie wewnątrz nawiasów [ ].', t);
      // eslint-disable-next-line no-fallthrough
      case 'end':
        this.fail(`Słowo „${t.text}” może kończyć tylko procedurę i musi stać samo w osobnej linii.`, t);
    }
  }

  private call(t: Token): Stmt {
    const key = t.key!;
    const n = this.arity.get(key);
    if (n === undefined) {
      let message = `Nieznane polecenie „${t.text}”.`;
      const isVar = this.proc
        ? this.proc.params.has(key) || this.proc.vars.has(key) || this.topVars.has(key)
        : this.topVars.has(key);
      if (isVar) {
        message += ` „${t.text}” to zmienna — użyj jej jako argumentu polecenia, np. „np ${t.text}”.`;
      } else {
        const suggestion = this.suggest(key);
        if (suggestion) message += ` Czy chodziło o „${suggestion}”?`;
      }
      this.fail(message, t);
    }
    this.next();
    const args: Expr[] = [];
    for (let k = 0; k < n; k++) {
      const a = this.peek();
      if (a.type === 'error') this.failToken(a);
      if (!this.canStartExpr(a)) {
        this.fail(
          `Procedura „${t.text}” wymaga ${n} ${plural(n, 'argumentu', 'argumentów', 'argumentów')}, a podano ${k}.`,
          a.type === 'eof' ? t : a,
        );
      }
      args.push(this.expression());
    }
    return { kind: 'call', tok: t, key, args };
  }

  private suggest(key: string): string | null {
    let best: string | null = null;
    let bestD = Infinity;
    const candidates = [...ALL_SPELLINGS, ...this.arity.keys()];
    for (const c of candidates) {
      const d = levenshtein(key, c);
      if (d < bestD && d <= Math.max(1, Math.floor(Math.min(key.length, c.length) / 3))) {
        best = c;
        bestD = d;
      }
    }
    return best;
  }

  private block(owner: Token, second = false): { body: Stmt[]; close: Token } {
    const open = this.peek();
    if (open.type === 'error') this.failToken(open);
    if (open.type !== '[') {
      const what = second
        ? `Polecenie „${owner.text}” wymaga dwóch części w nawiasach: [ gdy warunek jest spełniony ] [ gdy nie jest ].`
        : `Po „${owner.text}” brakuje nawiasu „[” z poleceniami do wykonania.`;
      this.fail(`${what}${open.type === 'eof' ? '' : ` Napotkano ${show(open)}.`}`, open.type === 'eof' ? owner : open);
    }
    if (this.brDepth >= LIMITS.nesting) {
      this.fail(`Za dużo zagnieżdżonych nawiasów [ ] (limit to ${LIMITS.nesting}).`, open);
    }
    this.next();
    this.brDepth++;
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.type === ']') break;
      if (t.type === 'eof') this.fail('Brakuje nawiasu „]” zamykającego ten nawias.', open);
      if (t.type === 'name' && t.kw === 'end') {
        if (this.proc && this.aloneOnLine(this.i)) this.fail('Brakuje nawiasu „]” zamykającego ten nawias.', open);
        this.fail(`Słowo „${t.text}” może kończyć tylko procedurę i musi stać samo w osobnej linii.`, t);
      }
      body.push(this.statement());
    }
    const close = this.next();
    this.brDepth--;
    return { body, close };
  }

  // ---------------------------------------------------------------- expressions

  private canStartExpr(t: Token): boolean {
    switch (t.type) {
      case 'num': case 'param': case '(':
        return true;
      case 'name':
        return !t.kw || t.kw === 'repcount';
      case 'op':
        return t.text === '+' || t.text === '-';
      default:
        return false;
    }
  }

  /** Parses one argument of `owner`, reporting a missing argument the way the rules require. */
  private argument(owner: Token, message?: string): Expr {
    const t = this.peek();
    if (t.type === 'error') this.failToken(t);
    if (!this.canStartExpr(t)) {
      const base = message ?? `Polecenie „${owner.text}” wymaga argumentu: liczby albo wyrażenia.`;
      this.fail(t.type === 'eof' ? base : `${base} Napotkano ${show(t)}.`, t.type === 'eof' ? owner : t);
    }
    return this.expression();
  }

  private condition(owner: Token): Condition {
    const t = this.peek();
    if (t.type === 'error') this.failToken(t);
    if (!this.canStartExpr(t)) {
      const base = `Po „${owner.text}” podaj warunek, np. „${owner.text} x > 0 [ ... ]”.`;
      this.fail(t.type === 'eof' ? base : `${base} Napotkano ${show(t)}.`, t.type === 'eof' ? owner : t);
    }
    const left = this.expression();
    const c = this.peek();
    if (c.type === 'error') this.failToken(c);
    if (c.type !== 'cmp') {
      this.fail(
        `W warunku brakuje znaku porównania (<, >, =, <=, >=, <>). Napotkano ${show(c)}.`,
        c.type === 'eof' ? owner : c,
      );
    }
    this.next();
    const r = this.peek();
    if (r.type === 'error') this.failToken(r);
    if (!this.canStartExpr(r)) {
      this.fail(`Po znaku „${c.text}” brakuje wartości do porównania. Napotkano ${show(r)}.`, r.type === 'eof' ? c : r);
    }
    const right = this.expression();
    return { left, op: c.text as Comparison, right };
  }

  /**
   * Parses an expression with an operator-precedence (shunting-yard) loop, so
   * deeply nested parentheses or stacked signs never exhaust the call stack.
   * A binary operator continues the expression only when it has whitespace on
   * both sides or on neither side.
   */
  private expression(): Expr {
    const first = this.peek();
    const code: Instr[] = [];
    const stack: StackItem[] = [];
    let names = false;
    let last = first;
    let prev: Token = first;
    let expectOperand = true;
    let open = 0;

    const emit = (item: StackItem) => {
      if (item.kind === 'neg') code.push({ op: OP_NEG });
      else if (item.kind === 'bin') code.push({ op: BIN_CODE[item.op] });
    };

    for (;;) {
      const t = this.peek();
      if (expectOperand) {
        if (t.type === 'op' && (t.text === '+' || t.text === '-')) {
          stack.push({ kind: t.text === '-' ? 'neg' : 'pos', tok: t });
          prev = this.next();
          continue;
        }
        if (t.type === '(') {
          stack.push({ kind: '(', tok: t });
          open++;
          prev = this.next();
          continue;
        }
        if (t.type === 'num') {
          code.push({ op: OP_NUM, v: t.value });
        } else if (t.type === 'name' && t.kw === 'repcount') {
          if (this.repDepth === 0) {
            this.fail(
              this.proc
                ? `„${t.text}” można użyć tylko wewnątrz powtorz. Tu jest w treści procedury „${this.proc.name}”, poza powtórzeniem (liczy się miejsce zapisu, nie wywołania).`
                : `„${t.text}” można użyć tylko wewnątrz nawiasów polecenia powtorz.`,
              t,
            );
          }
          code.push({ op: OP_REP });
          names = true;
        } else if ((t.type === 'name' && !t.kw) || t.type === 'param') {
          this.resolve(t);
          code.push({ op: OP_VAR, key: t.key, name: t.text.replace(/^:/, '') });
          names = true;
        } else {
          if (t.type === 'error') this.failToken(t);
          const at = t.type === 'eof' ? prev : t;
          const tail = t.type === 'eof' ? '' : ` Napotkano ${show(t)}.`;
          if (prev.type === '(') this.fail(`Po nawiasie „(” brakuje wartości.${tail}`, at);
          if (prev.type === 'op' && stack.length && stack[stack.length - 1].tok === prev && stack[stack.length - 1].kind !== 'bin') {
            this.fail(`Po znaku „${prev.text}” brakuje wartości.${tail}`, at);
          }
          this.fail(`Po operatorze „${prev.text}” brakuje wartości.${tail}`, at);
        }
        last = prev = this.next();
        expectOperand = false;
        continue;
      }

      if (t.type === 'op' && t.spaceBefore === t.spaceAfter) {
        const prec = t.text === '*' || t.text === '/' ? 2 : 1;
        while (stack.length) {
          const top = stack[stack.length - 1];
          if (top.kind === '(' || (top.kind === 'bin' && top.prec < prec)) break;
          emit(stack.pop()!);
        }
        stack.push({ kind: 'bin', op: t.text, prec, tok: t });
        prev = this.next();
        expectOperand = true;
        continue;
      }
      if (t.type === ')' && open > 0) {
        while (stack[stack.length - 1].kind !== '(') emit(stack.pop()!);
        stack.pop();
        open--;
        last = prev = this.next();
        continue;
      }
      if (open > 0) {
        let lastOpen: Token = first;
        for (let k = stack.length - 1; k >= 0; k--) {
          if (stack[k].kind === '(') {
            lastOpen = stack[k].tok;
            break;
          }
        }
        if (t.type === 'error') this.failToken(t);
        if (this.canStartExpr(t)) {
          let message = `Oczekiwano operatora albo nawiasu „)”, a napotkano ${show(t)}.`;
          if (t.type === 'op' && t.spaceBefore !== t.spaceAfter) {
            message += ` Operator „${t.text}” musi mieć spacje po obu stronach albo po żadnej.`;
          }
          this.fail(message, t);
        }
        this.fail('Nawias „(” nie ma pary — brakuje zamykającego nawiasu „)”.', lastOpen);
      }
      while (stack.length) emit(stack.pop()!);
      return { first, last, code, names };
    }
  }

  private resolve(t: Token): void {
    const key = t.key!;
    const known = this.proc
      ? this.proc.params.has(key) || this.proc.vars.has(key) || this.topVars.has(key)
      : this.topVars.has(key);
    if (known) return;
    const plain = t.text.replace(/^:/, '');
    if (t.kw) {
      this.fail(`„${plain}” to słowo języka Logo, a nie nazwa wartości.`, t);
    }
    if (this.arity.has(key)) {
      this.fail(`„${plain}” to nazwa procedury, a nie wartość — procedury nie zwracają wyniku.`, t);
    }
    const where = this.proc
      ? `parametrem procedury „${this.proc.name}” ani zmienną nadaną poleceniem niech`
      : 'zmienną nadaną poleceniem niech';
    this.fail(`Nieznana nazwa „${plain}”: nie jest ${where}.`, t);
  }
}

function isValueEnd(t: Token): boolean {
  return t.type === 'num' || t.type === 'param' || t.type === ')' || (t.type === 'name' && (!t.kw || t.kw === 'repcount'));
}

export function widthMessage(v: number): string {
  return `Grubość musi być liczbą całkowitą od 1 do 12, a wynosi ${fmtNum(v)}.`;
}

export function repeatMessage(v: number): string {
  return `Liczba powtórzeń musi być liczbą całkowitą od 0 do ${thousands(10000)}, a wynosi ${fmtNum(v)}.`;
}
