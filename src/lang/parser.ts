import type { Cond, CompareOp, Expr, ExprOp, Mode, Proc, Program, Stmt } from './ast';
import { evalOps, EvalFail, repeatProblem, widthProblem } from './eval';
import { LogoError } from './errors';
import { COMMAND_BY_ID, isKeyword, KEYWORDS, type CommandId } from './keywords';
import { lex, positionOf, type Token } from './lexer';
import { LIMITS } from './limits';

// ---------------------------------------------------------------------------
// Pomocnicze

function describe(t: Token | undefined): string {
  if (!t) return 'koniec programu';
  switch (t.kind) {
    case 'num': return `liczbę ${t.text}`;
    case 'word': {
      const kw = KEYWORDS.get(t.name);
      if (kw?.kind === 'cmd') return `polecenie „${t.text}”`;
      if (kw) return `słowo „${t.text}”`;
      return `nazwę „${t.text}”`;
    }
    case 'cname': return `nazwę „${t.text}”`;
    case 'str': return `tekst ${t.text}`;
    case 'lbr': case 'rbr': case 'lpar': case 'rpar': return `nawias „${t.text}”`;
    case 'comma': return 'przecinek';
    case 'colon': return 'dwukropek';
    default: return `„${t.text}”`;
  }
}

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return few;
  return many;
}

const CMD_HELP: Partial<Record<CommandId, string>> = {
  forward: 'ile kroków', back: 'ile kroków', right: 'ile stopni', left: 'ile stopni',
  pitchup: 'ile stopni', pitchdown: 'ile stopni', rollright: 'ile stopni', rollleft: 'ile stopni',
};

// ---------------------------------------------------------------------------
// Nagłówki procedur (wspólne dla przebiegu wstępnego i właściwego)

interface HeaderScan {
  nameTok?: Token;
  params: Token[];
  /** Indeks pierwszego symbolu po nagłówku. */
  endIdx: number;
  error?: { tok: Token; message: string };
}

function scanHeader(tokens: Token[], idx: number): HeaderScan {
  const oto = tokens[idx]!;
  const same = (t: Token | undefined): t is Token => !!t && t.line === oto.line;
  const params: Token[] = [];
  let k = idx + 1;
  const fail = (tok: Token, message: string, nameTok?: Token): HeaderScan => ({ nameTok, params, endIdx: Math.max(k, idx + 1), error: { tok, message } });

  const nameTok = tokens[k];
  if (!same(nameTok)) return fail(oto, 'Po „oto” brakuje nazwy procedury, np. „oto kwadrat ma: bok”.');
  if (nameTok.kind === 'err') return fail(nameTok, nameTok.message);
  if (nameTok.kind !== 'word') return fail(nameTok, `Nazwa procedury musi być słowem (litery, cyfry, znak _), a znaleziono ${describe(nameTok)}.`);
  if (isKeyword(nameTok.name)) return fail(nameTok, `„${nameTok.text}” jest słowem zarezerwowanym języka i nie może być nazwą procedury.`, nameTok);
  k++;

  const addParam = (p: Token): HeaderScan | null => {
    if (p.kind === 'err') return fail(p, p.message, nameTok);
    if (p.kind !== 'word' && p.kind !== 'cname') return fail(p, `Nazwa parametru musi być słowem, a znaleziono ${describe(p)}.`, nameTok);
    if (isKeyword(p.name)) return fail(p, `„${p.text}” jest słowem zarezerwowanym języka i nie może być nazwą parametru.`, nameTok);
    if (params.some((q) => q.name === p.name)) return fail(p, `Parametr „${p.text.replace(/^:/, '')}” jest zadeklarowany dwa razy.`, nameTok);
    params.push(p);
    return null;
  };

  const t = tokens[k];
  if (same(t)) {
    const nx = tokens[k + 1];
    if (t.kind === 'word' && t.name === 'ma' && same(nx) && (nx.kind === 'colon' || nx.kind === 'cname')) {
      // oto nazwa ma: a, b, c
      k++;
      if (tokens[k]!.kind === 'colon') k++;
      for (;;) {
        const p = tokens[k];
        if (!same(p)) return fail(tokens[k - 1]!, 'Brakuje nazwy parametru (lista parametrów: „ma: bok, kąt”).', nameTok);
        const bad = addParam(p);
        if (bad) return bad;
        k++;
        const c = tokens[k];
        if (same(c) && c.kind === 'comma') {
          k++;
          continue;
        }
        break;
      }
    } else if (t.kind === 'word' && t.name === 'ma') {
      return fail(t, 'Po „ma” oczekiwano dwukropka i listy parametrów: „ma: bok, kąt”.', nameTok);
    } else {
      // zapis dawny: oto nazwa :a :b
      while (same(tokens[k]) && tokens[k]!.kind === 'cname') {
        const bad = addParam(tokens[k]!);
        if (bad) return bad;
        k++;
      }
    }
    if (same(tokens[k])) {
      const bad = tokens[k]!;
      return fail(bad, bad.kind === 'err' ? bad.message : `Nieoczekiwany symbol w nagłówku procedury: ${describe(bad)}. Parametry zapisujemy tak: „ma: a, b”.`, nameTok);
    }
  }
  return { nameTok, params, endIdx: k };
}

// ---------------------------------------------------------------------------
// Przebieg wstępny: nazwy procedur, ich parametry i zmienne zadeklarowane przez `niech`

interface PreResult {
  procs: Map<string, Proc>;
  /** Proc zdefiniowany nagłówkiem zaczynającym się w tokenie o danym indeksie. */
  procAt: Map<number, Proc>;
  globals: Set<string>;
}

function prepass(tokens: Token[]): PreResult {
  const procs = new Map<string, Proc>();
  const procAt = new Map<number, Proc>();
  const globals = new Set<string>();
  let cur: Proc | null = null;

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i]!;
    if (t.kind !== 'word') continue;
    const kw = KEYWORDS.get(t.name);
    if (!kw) continue;
    if (kw.kind === 'def' && t.firstOnLine && cur === null) {
      const h = scanHeader(tokens, i);
      const nm = h.nameTok;
      const proc: Proc = {
        name: nm && nm.kind === 'word' && !isKeyword(nm.name) ? nm.name : '',
        label: nm ? nm.text : '',
        params: h.params.map((p) => p.name),
        body: [],
        nameTok: nm ?? t,
        declared: new Set(h.params.map((p) => p.name)),
      };
      if (proc.name && !procs.has(proc.name)) procs.set(proc.name, proc);
      procAt.set(i, proc);
      cur = proc;
      i = h.endIdx - 1;
      continue;
    }
    if (kw.kind === 'end' && t.firstOnLine && t.lastOnLine && cur) {
      cur = null;
      continue;
    }
    if (kw.kind === 'cmd' && kw.id === 'let') {
      const nx = tokens[i + 1];
      if (nx && (nx.kind === 'word' || nx.kind === 'cname') && !isKeyword(nx.name)) {
        (cur ? cur.declared : globals).add(nx.name);
      }
    }
  }
  return { procs, procAt, globals };
}

// ---------------------------------------------------------------------------
// Parser właściwy

interface Ctx {
  proc: Proc | null;
  bracketDepth: number;
  repDepth: number;
}

class Parser {
  private pos = 0;
  private ctx: Ctx = { proc: null, bracketDepth: 0, repDepth: 0 };
  private defined = new Map<string, Token>();
  private prev: Stmt | null = null;

  constructor(
    private tokens: Token[],
    private mode: Mode,
    private pre: PreResult,
  ) {}

  private peek(): Token | undefined {
    const t = this.tokens[this.pos];
    if (t && t.kind === 'err') throw this.err(t, t.message);
    return t;
  }

  private err(t: Token, message: string): LogoError {
    return new LogoError(message, t.line, t.col, t.end - t.start);
  }

  private fail(t: Token, message: string): never {
    throw this.err(t, message);
  }

  parseProgram(): Program {
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (!t) break;
      if (t.kind === 'word' && KEYWORDS.get(t.name)?.kind === 'def') {
        if (!t.firstOnLine) this.fail(t, `Definicja procedury („${t.text}”) musi zaczynać się na początku wiersza.`);
        this.procDef();
        continue;
      }
      body.push(this.statement());
    }
    return { mode: this.mode, body, procs: this.pre.procs, globals: this.pre.globals };
  }

  // ----- procedury ------------------------------------------------------

  private procDef(): void {
    const idx = this.pos;
    const oto = this.tokens[idx]!;
    const h = scanHeader(this.tokens, idx);
    if (h.error) this.fail(h.error.tok, h.error.message);
    const nameTok = h.nameTok!;
    const first = this.defined.get(nameTok.name);
    if (first) this.fail(nameTok, `Procedura „${nameTok.text}” jest już zdefiniowana (linia ${first.line}). Nazwę można zdefiniować tylko raz.`);
    this.defined.set(nameTok.name, nameTok);
    const proc = this.pre.procAt.get(idx)!;
    this.pos = h.endIdx;

    const saved = this.ctx;
    this.ctx = { proc, bracketDepth: 0, repDepth: 0 };
    const body: Stmt[] = [];
    this.prev = null;
    for (;;) {
      const t = this.peek();
      if (!t) this.fail(oto, `Brakuje „już” kończącego procedurę „${nameTok.text}”.`);
      if (t.kind === 'word' && KEYWORDS.get(t.name)?.kind === 'end') {
        if (!(t.firstOnLine && t.lastOnLine)) this.fail(t, `„${t.text}” kończące procedurę musi stać samo w osobnym wierszu.`);
        this.pos++;
        break;
      }
      body.push(this.statement());
    }
    proc.body = body;
    this.ctx = saved;
    this.prev = null;
  }

  // ----- instrukcje -----------------------------------------------------

  private statement(): Stmt {
    const t = this.peek()!;
    const stmt = this.statement1(t);
    this.prev = stmt;
    return stmt;
  }

  private statement1(t: Token): Stmt {
    if (t.kind !== 'word') this.stray(t);
    const kw = KEYWORDS.get(t.name);
    if (kw) {
      switch (kw.kind) {
        case 'cmd':
          return this.command(kw.id, t);
        case 'def':
          if (this.ctx.bracketDepth > 0) this.fail(t, 'Definicji procedury nie można umieszczać wewnątrz bloku [ … ] (powtórz, jeśli, jeżeli). Definiuj procedury na najwyższym poziomie programu.');
          if (this.ctx.proc) this.fail(t, `Definicji procedury nie można umieszczać wewnątrz innej procedury („${this.ctx.proc.label}”). Czy brakuje „już” kończącego poprzednią procedurę?`);
          this.fail(t, `Definicja procedury („${t.text}”) musi zaczynać się na początku wiersza.`);
          break;
        case 'end':
          if (this.ctx.proc || this.ctx.bracketDepth > 0) {
            if (!(t.firstOnLine && t.lastOnLine)) this.fail(t, `„${t.text}” kończące procedurę musi stać samo w osobnym wierszu.`);
          }
          this.fail(t, `Niepasujące „${t.text}” — nie ma otwartej procedury („oto …”).`);
          break;
        case 'repcount':
          this.fail(t, `„${t.text}” jest wartością (numer powtórzenia), a nie poleceniem. Użyj jej jako argumentu, np. „np ${t.text} * 5”.`);
      }
    }
    const proc = this.pre.procs.get(t.name);
    if (proc) return this.call(proc, t);
    if (this.isDeclared(t.name)) {
      this.fail(t, `„${t.text}” jest zmienną, a nie poleceniem. Aby ustawić zmienną, napisz „niech ${t.text} wartość”.`);
    }
    this.fail(t, `Nieznane polecenie „${t.text}”.`);
  }

  private stray(t: Token): never {
    switch (t.kind) {
      case 'rbr': this.fail(t, 'Niepasujący nawias „]” — nie ma otwartego „[”.');
      case 'rpar': this.fail(t, 'Niepasujący nawias „)” — nie ma otwartego „(”.');
      case 'lbr': this.fail(t, 'Nieoczekiwany nawias „[”. Blok w nawiasach kwadratowych może występować tylko po powtórz, jeśli lub jeżeli.');
      case 'lpar': this.fail(t, 'Nieoczekiwany nawias „(”. Nawiasy okrągłe służą do grupowania wyrażeń, np. „np (2 + 3) * 4”.');
      case 'cmp': this.fail(t, `Nieoczekiwany znak „${t.text}”. Porównań używamy tylko w warunku po jeśli lub jeżeli.`);
      case 'comma': this.fail(t, 'Nieoczekiwany przecinek. Przecinki rozdzielają tylko parametry w nagłówku procedury.');
      case 'colon': this.fail(t, 'Nieoczekiwany dwukropek.');
      case 'op':
        this.fail(t, `Nieoczekiwany znak „${t.text}”. Operator łączący dwie wartości musi mieć odstępy po obu stronach albo po żadnej, np. „10 ${t.text} 5” lub „10${t.text}5”; zapis „10 ${t.text}5” to dwie osobne wartości.`);
      case 'str': this.fail(t, `Nieoczekiwany tekst ${t.text}. Tekst w cudzysłowie można podać tylko po poleceniu „kolor”.`);
      default: {
        const p = this.prev;
        let hint = '';
        if (p && p.t === 'call') {
          const n = p.proc.params.length;
          hint = ` Procedura „${p.proc.label}” przyjmuje ${n} ${plural(n, 'argument', 'argumenty', 'argumentów')}.`;
        } else if (p && p.t === 'cmd' && p.arg) {
          hint = ` Polecenie „${p.tok.text}” przyjmuje jeden argument.`;
        } else if (p && p.t === 'cmd') {
          hint = ` Polecenie „${p.tok.text}” nie przyjmuje argumentów.`;
        }
        this.fail(t, `Oczekiwano polecenia, a znaleziono ${describe(t)}.${hint}`);
      }
    }
  }

  private command(id: CommandId, tok: Token): Stmt {
    const spec = COMMAND_BY_ID.get(id)!;
    if (spec.only3d && this.mode === '2d') {
      this.fail(tok, `Polecenie „${tok.text}” działa tylko w trybie 3D. W trybie 2D żółw porusza się po płaszczyźnie — przełącz tryb na 3D.`);
    }
    this.pos++;
    switch (id) {
      case 'forward': case 'back': case 'right': case 'left':
      case 'pitchup': case 'pitchdown': case 'rollright': case 'rollleft': {
        const arg = this.expr(tok, `Polecenie „${tok.text}” wymaga argumentu: ${CMD_HELP[id]} (liczby lub wyrażenia).`);
        return { t: 'cmd', id, arg, tok };
      }
      case 'penup': case 'pendown': case 'home': case 'clear': case 'stop':
        return { t: 'cmd', id, tok };
      case 'color': {
        const need = `Polecenie „${tok.text}” wymaga koloru w cudzysłowie, np. ${tok.text} "#16866a".`;
        const c = this.peek();
        if (!c) this.fail(tok, need);
        if (c.kind !== 'str') this.fail(c, `${need} Znaleziono ${describe(c)}.`);
        if (!/^"#[0-9a-fA-F]{6}"$/.test(c.text)) {
          this.fail(c, `Niepoprawny kolor ${c.text}. Kolor to znak # i sześć cyfr szesnastkowych, np. "#16866a".`);
        }
        this.pos++;
        return { t: 'color', hex: c.text.slice(1, -1).toLowerCase(), tok };
      }
      case 'width': {
        const arg = this.expr(tok, `Polecenie „${tok.text}” wymaga argumentu: grubości linii (liczby całkowitej od ${LIMITS.minWidth} do ${LIMITS.maxWidth}).`);
        if (arg.const !== undefined) {
          const p = widthProblem(arg.const);
          if (p) this.fail(arg.tok, p);
        }
        return { t: 'cmd', id: 'width', arg, tok };
      }
      case 'repeat': {
        const count = this.expr(tok, `Polecenie „${tok.text}” wymaga liczby powtórzeń, np. ${tok.text} 4 [ np 50 pw 90 ].`);
        if (count.const !== undefined) {
          const p = repeatProblem(count.const);
          if (p) this.fail(count.tok, p);
        }
        const body = this.block(tok, `Po liczbie powtórzeń oczekiwano nawiasu „[” z poleceniami do powtórzenia.`, true);
        return { t: 'repeat', count, body, tok };
      }
      case 'let': {
        const n = this.peek();
        if (!n) this.fail(tok, `Polecenie „${tok.text}” wymaga nazwy zmiennej i wartości, np. ${tok.text} x 5.`);
        if (n.kind !== 'word' && n.kind !== 'cname') this.fail(n, `Po „${tok.text}” oczekiwano nazwy zmiennej, a znaleziono ${describe(n)}.`);
        if (isKeyword(n.name)) this.fail(n, `„${n.text}” jest słowem zarezerwowanym języka i nie może być nazwą zmiennej.`);
        if (this.pre.procs.has(n.name) && !this.ctx.proc?.params.includes(n.name)) this.fail(n, `„${n.text}” jest nazwą procedury i nie może być nazwą zmiennej.`);
        this.pos++;
        const expr = this.expr(tok, `Polecenie „${tok.text} ${n.text}” wymaga wartości (liczby lub wyrażenia).`);
        return { t: 'let', name: n.name, expr, tok };
      }
      case 'if': {
        const cond = this.cond(tok);
        const then = this.block(tok, `Po warunku oczekiwano nawiasu „[” z poleceniami.`, false);
        return { t: 'if', cond, then, tok };
      }
      case 'ifelse': {
        const cond = this.cond(tok);
        const then = this.block(tok, `Po warunku oczekiwano nawiasu „[” z poleceniami na „tak”.`, false);
        const els = this.block(tok, `Polecenie „${tok.text}” wymaga drugiego bloku [ … ] z poleceniami na „nie”.`, false);
        return { t: 'if', cond, then, else: els, tok };
      }
    }
  }

  private cond(cmd: Token): Cond {
    const need = `Polecenie „${cmd.text}” wymaga warunku, np. ${cmd.text} x > 5 [ … ].`;
    const left = this.expr(cmd, need);
    const c = this.peek();
    if (!c) this.fail(cmd, `${need} Brakuje operatora porównania.`);
    if (c.kind !== 'cmp') {
      this.fail(c, `W warunku oczekiwano operatora porównania (<, >, =, <=, >=, <>), a znaleziono ${describe(c)}.`);
    }
    this.pos++;
    const right = this.expr(cmd, `Po operatorze „${c.text}” oczekiwano wartości do porównania.`);
    return { left, op: c.text as CompareOp, right };
  }

  private block(cmd: Token, need: string, isRepeat: boolean): Stmt[] {
    const open = this.peek();
    if (!open) this.fail(cmd, need);
    if (open.kind !== 'lbr') this.fail(open, `${need} Znaleziono ${describe(open)}.`);
    if (this.ctx.bracketDepth >= LIMITS.maxBracketDepth) {
      this.fail(open, `Przekroczono limit zagnieżdżenia nawiasów [ ] (${LIMITS.maxBracketDepth}).`);
    }
    this.pos++;
    this.ctx.bracketDepth++;
    if (isRepeat) this.ctx.repDepth++;
    const stmts: Stmt[] = [];
    const unclosed = `Brakuje zamykającego nawiasu „]” dla tego „[”.`;
    for (;;) {
      const t = this.peek();
      if (!t) this.fail(open, unclosed);
      if (t.kind === 'rbr') {
        this.pos++;
        break;
      }
      if (t.kind === 'word' && KEYWORDS.get(t.name)?.kind === 'end' && t.firstOnLine && t.lastOnLine) this.fail(open, unclosed);
      stmts.push(this.statement());
    }
    this.ctx.bracketDepth--;
    if (isRepeat) this.ctx.repDepth--;
    return stmts;
  }

  private call(proc: Proc, tok: Token): Stmt {
    this.pos++;
    const n = proc.params.length;
    const args: Expr[] = [];
    for (let i = 0; i < n; i++) {
      args.push(
        this.expr(
          tok,
          `Procedura „${proc.label}” przyjmuje ${n} ${plural(n, 'argument', 'argumenty', 'argumentów')}, a podano ${i}. Brakuje argumentu „${proc.params[i]}”.`,
        ),
      );
    }
    return { t: 'call', proc, args, tok };
  }

  // ----- wyrażenia ------------------------------------------------------

  private isDeclared(name: string): boolean {
    const p = this.ctx.proc;
    return (p !== null && p.declared.has(name)) || this.pre.globals.has(name);
  }

  private expr(cmd: Token, need: string): Expr {
    const first = this.peek();
    if (!first) this.fail(cmd, need);
    const ops: ExprOp[] = [];
    this.parseInto(ops, cmd, need);
    const e: Expr = { ops, tok: first };
    if (!ops.some((o) => o.o === 'var' || o.o === 'rep')) {
      try {
        e.const = evalOps(ops, null);
      } catch (err) {
        if (!(err instanceof EvalFail)) throw err;
        // dzielenie przez zero itp. w stałym wyrażeniu: błąd wyjdzie w czasie wykonania
      }
    }
    return e;
  }

  private binary(t: Token | undefined, chars: string): boolean {
    return !!t && t.kind === 'op' && chars.includes(t.text) && t.spaceBefore === t.spaceAfter;
  }

  /**
   * Parsuje wyrażenie (algorytm stacji rozrządowej) do postaci odwrotnej notacji polskiej.
   * Bez rekurencji, więc zagnieżdżenie nawiasów okrągłych ogranicza tylko limit symboli.
   */
  private parseInto(out: ExprOp[], cmd: Token, need: string): void {
    type Item = { k: 'bin'; prec: number; o: 'add' | 'sub' | 'mul' | 'div' } | { k: 'neg' } | { k: 'lpar'; tok: Token };
    const stack: Item[] = [];
    let parens = 0;
    let expectOperand = true;
    let after: Token | null = null;
    const prec = (it: Item): number => (it.k === 'neg' ? 3 : it.k === 'bin' ? it.prec : 0);
    const emit = (it: Item): void => {
      if (it.k === 'neg') out.push({ o: 'neg' });
      else if (it.k === 'bin') out.push({ o: it.o });
    };
    for (;;) {
      const t = this.peek();
      if (expectOperand) {
        if (!t) this.missingValue(t, cmd, need, after);
        if (t.kind === 'op' && (t.text === '-' || t.text === '+')) {
          this.pos++;
          after = t;
          if (t.text === '-') stack.push({ k: 'neg' });
          continue;
        }
        if (t.kind === 'lpar') {
          this.pos++;
          after = t;
          parens++;
          stack.push({ k: 'lpar', tok: t });
          continue;
        }
        if (t.kind === 'num') {
          this.pos++;
          out.push({ o: 'num', v: t.value });
        } else if (t.kind === 'cname') {
          this.pos++;
          this.checkVar(t);
          out.push({ o: 'var', name: t.name });
        } else if (t.kind === 'word') {
          const kw = KEYWORDS.get(t.name);
          if (kw) {
            if (kw.kind !== 'repcount') this.missingValue(t, cmd, need, after);
            if (this.ctx.repDepth === 0) {
              this.fail(t, `„${t.text}” można użyć tylko wewnątrz bloku powtórz (nie wystarczy, że procedura jest wywoływana z powtórz).`);
            }
            this.pos++;
            out.push({ o: 'rep' });
          } else {
            this.pos++;
            this.checkVar(t);
            out.push({ o: 'var', name: t.name });
          }
        } else {
          this.missingValue(t, cmd, need, after);
        }
        expectOperand = false;
        continue;
      }
      // oczekujemy operatora binarnego, nawiasu zamykającego albo końca wyrażenia
      if (this.binary(t, '+-*/')) {
        const op = t!.text;
        const p = op === '+' || op === '-' ? 1 : 2;
        while (stack.length > 0) {
          const top = stack[stack.length - 1]!;
          if (top.k === 'lpar' || prec(top) < p) break;
          emit(stack.pop()!);
        }
        stack.push({ k: 'bin', prec: p, o: op === '+' ? 'add' : op === '-' ? 'sub' : op === '*' ? 'mul' : 'div' });
        after = t!;
        this.pos++;
        expectOperand = true;
        continue;
      }
      if (t && t.kind === 'rpar' && parens > 0) {
        for (;;) {
          const top = stack.pop()!;
          if (top.k === 'lpar') break;
          emit(top);
        }
        parens--;
        this.pos++;
        continue;
      }
      break;
    }
    while (stack.length > 0) {
      const it = stack.pop()!;
      if (it.k === 'lpar') this.fail(it.tok, 'Brakuje zamykającego nawiasu „)” dla tego „(”.');
      emit(it);
    }
  }

  /** Brak wartości tam, gdzie powinna być: komunikat wskazuje operator, po którym jej brakuje. */
  private missingValue(t: Token | undefined, cmd: Token, need: string, after: Token | null): never {
    if (!t) {
      this.fail(cmd, after ? `Po „${after.text}” brakuje wartości — program kończy się w tym miejscu.` : need);
    }
    const base = after
      ? `Po „${after.text}” oczekiwano wartości (liczby, nazwy lub wyrażenia w nawiasach), a znaleziono ${describe(t)}.`
      : `${need} Znaleziono ${describe(t)}.`;
    const where = t.line !== cmd.line ? ` „${cmd.text}” jest w wierszu ${cmd.line}.` : '';
    this.fail(t, base + where);
  }

  private checkVar(t: Token): void {
    if (this.isDeclared(t.name)) return;
    if (this.pre.procs.has(t.name)) {
      this.fail(t, `„${t.text}” jest nazwą procedury, a nie wartością. Procedury wywołujemy jak polecenia.`);
    }
    const hint = this.ctx.proc
      ? 'W wyrażeniu można użyć liczby, „nrpowt”, parametru procedury albo zmiennej ustawionej przez „niech”.'
      : 'W wyrażeniu można użyć liczby, „nrpowt” albo zmiennej ustawionej przez „niech”.';
    this.fail(t, `Nieznana nazwa „${t.text.replace(/^:/, '')}”. ${hint}`);
  }
}

// ---------------------------------------------------------------------------

export type ParseResult = { program: Program; error?: undefined } | { program?: undefined; error: LogoError };

/** Analizuje cały program. Przy błędzie nic nie jest wykonywane. */
export function parse(source: string, mode: Mode): ParseResult {
  if (source.length > LIMITS.maxChars) {
    const pos = positionOf(source, LIMITS.maxChars);
    return {
      error: new LogoError(
        `Program jest zbyt długi: limit to ${LIMITS.maxChars.toLocaleString('pl-PL')} znaków.`,
        pos.line,
        pos.column,
        1,
      ),
    };
  }
  const { tokens } = lex(source);
  try {
    const pre = prepass(tokens);
    const program = new Parser(tokens, mode, pre).parseProgram();
    return { program };
  } catch (e) {
    if (e instanceof LogoError) return { error: e };
    if (e instanceof RangeError) {
      return { error: new LogoError('Program jest zbyt głęboko zagnieżdżony.', 1, 1, 1) };
    }
    throw e;
  }
}
