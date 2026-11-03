import { LogoError, EvalError } from './errors';
import { KEYWORDS, ONLY_3D, type Kw } from './keywords';
import { lex, type Tok } from './lexer';

export type Mode = '2d' | '3d';

export const MAX_DEPTH = 32;
export const MAX_REPEAT = 10_000;
const MAX_EXPR_DEPTH = 400;

export type Expr =
  | { k: 'num'; v: number; tok: Tok }
  | { k: 'var'; name: string; tok: Tok }
  | { k: 'rep'; tok: Tok }
  | { k: 'neg' | 'pos'; e: Expr; tok: Tok }
  | { k: 'bin'; op: '+' | '-' | '*' | '/'; a: Expr; b: Expr; tok: Tok };

export interface Arg {
  e: Expr;
  /** Pierwszy token wyrażenia: tu zgłaszamy błędne wartości. */
  start: Tok;
  /** Wyrażenie bez nazw i bez `nrpowt`: można je sprawdzić przed uruchomieniem. */
  literal: boolean;
}

export type CmpOp = '<' | '>' | '=' | '<=' | '>=' | '<>';
export interface Cond { a: Expr; op: CmpOp; b: Expr; start: Tok }

export type Stmt =
  | { k: 'move'; sign: 1 | -1; arg: Arg; tok: Tok }
  | { k: 'turn'; axis: 'yaw' | 'pitch' | 'roll'; sign: 1 | -1; arg: Arg; tok: Tok }
  | { k: 'pen'; down: boolean; tok: Tok }
  | { k: 'color'; color: string; tok: Tok }
  | { k: 'width'; arg: Arg; tok: Tok }
  | { k: 'repeat'; count: Arg; body: Stmt[]; tok: Tok; close: Tok }
  | { k: 'let'; name: string; arg: Arg; tok: Tok }
  | { k: 'if'; cond: Cond; then: Stmt[]; closeThen: Tok; else: Stmt[] | null; closeElse: Tok | null; tok: Tok }
  | { k: 'stop'; tok: Tok }
  | { k: 'home'; tok: Tok }
  | { k: 'clear'; tok: Tok }
  | { k: 'call'; name: string; args: Arg[]; tok: Tok };

export interface Proc {
  name: string;
  display: string;
  params: string[];
  body: Stmt[];
  tok: Tok;
}

export interface Program {
  mode: Mode;
  body: Stmt[];
  procs: Map<string, Proc>;
  source: string;
}

interface ProcHeader { params: string[]; vars: Set<string> }

interface Ctx {
  proc: ProcHeader | null;
  procName: string | null;
  repeatDepth: number;
  bracketDepth: number;
}

const fail = (msg: string, t: Tok): never => {
  throw new LogoError(msg, t.line, t.col);
};

const q = (s: string) => `„${s}”`;

export function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const d = n % 10, h = n % 100;
  if (d >= 2 && d <= 4 && (h < 12 || h > 14)) return few;
  return many;
}

/** Wstępny przegląd: nazwy i liczby parametrów procedur oraz nazwy nadawane przez `niech`. */
function prescan(toks: Tok[]) {
  const procs = new Map<string, ProcHeader>();
  const globals = new Set<string>();
  let current: ProcHeader | null = null;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (t.kind !== 'word' || t.colon) continue;
    const kw = KEYWORDS.get(t.name);
    if (!current && kw === 'to' && t.lineStart) {
      const nameTok = toks[i + 1];
      const header: ProcHeader = { params: [], vars: new Set() };
      let j = i + 1;
      if (nameTok && nameTok.kind === 'word' && !nameTok.lineStart) {
        j = i + 2;
        while (j < toks.length && !toks[j].lineStart) {
          const p = toks[j];
          if (p.kind === 'word' && p.name !== 'ma:') header.params.push(p.name);
          j++;
        }
        if (!procs.has(nameTok.name)) procs.set(nameTok.name, header);
      }
      current = header;
      i = j - 1;
      continue;
    }
    if (current && kw === 'end' && t.lineStart && t.lineEnd) {
      current = null;
      continue;
    }
    if (kw === 'let') {
      const n = toks[i + 1];
      if (n && n.kind === 'word') (current ? current.vars : globals).add(n.name);
    }
  }
  return { procs, globals };
}

export function parse(source: string, mode: Mode): Program {
  const toks = lex(source);
  const { procs: headers, globals } = prescan(toks);
  const procs = new Map<string, Proc>();
  let pos = 0;

  const peek = (): Tok | undefined => toks[pos];
  const next = (): Tok | undefined => toks[pos++];
  const lastTok = () => toks[pos - 1];

  const isKw = (t: Tok | undefined, kw: Kw) => !!t && t.kind === 'word' && !t.colon && KEYWORDS.get(t.name) === kw;

  // --- wyrażenia ---------------------------------------------------------

  let exprDepth = 0;
  const deeper = (t: Tok) => {
    if (++exprDepth > MAX_EXPR_DEPTH) fail('Wyrażenie jest zbyt głęboko zagnieżdżone.', t);
  };

  /** Czy operator stoi w pozycji dwuargumentowej (spacje z obu stron albo z żadnej). */
  const binaryOp = (t: Tok | undefined, ops: string[]) =>
    !!t && t.kind === 'op' && ops.includes(t.text) && t.wsBefore === t.wsAfter;

  function parseExpr(ctx: Ctx): Expr {
    let a = parseTerm(ctx);
    while (binaryOp(peek(), ['+', '-'])) {
      const op = next()!;
      const b = parseTerm(ctx);
      a = { k: 'bin', op: op.text as '+' | '-', a, b, tok: op };
    }
    return a;
  }

  function parseTerm(ctx: Ctx): Expr {
    let a = parseUnary(ctx);
    while (binaryOp(peek(), ['*', '/'])) {
      const op = next()!;
      const b = parseUnary(ctx);
      a = { k: 'bin', op: op.text as '*' | '/', a, b, tok: op };
    }
    return a;
  }

  function parseUnary(ctx: Ctx): Expr {
    const t = peek();
    if (t && t.kind === 'op' && (t.text === '-' || t.text === '+')) {
      next();
      deeper(t);
      const e = parseUnary(ctx);
      exprDepth--;
      return { k: t.text === '-' ? 'neg' : 'pos', e, tok: t };
    }
    return parsePrimary(ctx);
  }

  function missingValue(t: Tok | undefined, after: Tok): never {
    if (!t) return fail(`Program kończy się, a po ${q(after.text)} brakuje wartości.`, after);
    return fail(`Po ${q(after.text)} brakuje wartości: oczekiwano liczby, nazwy albo nawiasu „(”, a jest ${q(t.text)}.`, t);
  }

  function parsePrimary(ctx: Ctx): Expr {
    const t = peek();
    const before = lastTok();
    if (!t) return missingValue(t, before);
    if (t.kind === 'num') {
      next();
      return { k: 'num', v: t.value, tok: t };
    }
    if (t.kind === 'lpar') {
      next();
      deeper(t);
      const e = parseExpr(ctx);
      exprDepth--;
      const close = peek();
      if (!close) fail('Nawias „(” nie został zamknięty.', t);
      if (close!.kind !== 'rpar') fail(`Oczekiwano nawiasu „)”, a jest ${q(close!.text)}.`, close!);
      next();
      return e;
    }
    if (t.kind === 'word') {
      const kw = t.colon ? undefined : KEYWORDS.get(t.name);
      if (kw === 'repcount') {
        if (ctx.repeatDepth === 0) {
          fail(ctx.proc
            ? `${q(t.text)} można użyć tylko wewnątrz „powtórz” zapisanego w tej samej procedurze.`
            : `${q(t.text)} można użyć tylko wewnątrz „powtórz”.`, t);
        }
        next();
        return { k: 'rep', tok: t };
      }
      if (kw) {
        if (before && before.kind === 'op') return fail(`Po ${q(before.text)} brakuje wartości: jest polecenie ${q(t.text)}. Dokończ działanie albo usuń znak ${q(before.text)}.`, t);
        return fail(`Oczekiwano wartości, a jest polecenie ${q(t.text)}.`, t);
      }
      const name = t.name;
      const known = ctx.proc
        ? ctx.proc.params.includes(name) || ctx.proc.vars.has(name) || globals.has(name)
        : globals.has(name);
      if (!known) {
        if (headers.has(name)) fail(`${q(t.text)} to procedura, a nie wartość. Procedury nie zwracają wyników.`, t);
        fail(`Nieznana nazwa ${q(t.text)}. Nadaj jej wartość poleceniem „niech”${ctx.proc ? ' albo dodaj ją do parametrów procedury' : ''}.`, t);
      }
      next();
      return { k: 'var', name, tok: t };
    }
    return missingValue(t, before);
  }

  function hasNames(e: Expr): boolean {
    switch (e.k) {
      case 'num': return false;
      case 'var': case 'rep': return true;
      case 'neg': case 'pos': return hasNames(e.e);
      case 'bin': return hasNames(e.a) || hasNames(e.b);
    }
  }

  /** Argument polecenia; `owner` to polecenie albo wywołanie, do którego należy. */
  function parseArg(ctx: Ctx, owner: Tok, missing?: (t: Tok | undefined) => never): Arg {
    const t = peek();
    const startsExpr = !!t && (
      t.kind === 'num' || t.kind === 'lpar' ||
      (t.kind === 'op' && (t.text === '-' || t.text === '+')) ||
      (t.kind === 'word' && (t.colon || !KEYWORDS.has(t.name) || KEYWORDS.get(t.name) === 'repcount'))
    );
    if (!startsExpr) {
      if (missing) missing(t);
      if (!t) fail(`Brakuje argumentu polecenia ${q(owner.text)}.`, owner);
      fail(`Brakuje argumentu polecenia ${q(owner.text)}: oczekiwano liczby albo wyrażenia, a jest ${q(t!.text)}.`, t!);
    }
    exprDepth = 0;
    const e = parseExpr(ctx);
    return { e, start: t!, literal: !hasNames(e) };
  }

  function checkLiteral(arg: Arg, check: (v: number) => string | null) {
    if (!arg.literal) return;
    let v: number;
    try {
      v = evalConst(arg.e);
    } catch (e) {
      if (e instanceof EvalError) fail(e.message, arg.start);
      throw e;
    }
    const msg = check(v);
    if (msg) fail(msg, arg.start);
  }

  function parseCond(ctx: Ctx, owner: Tok): Cond {
    const left = parseArg(ctx, owner);
    const opTok = peek();
    if (!opTok) fail(`Po warunku brakuje porównania (<, >, =, <=, >=, <>).`, owner);
    if (opTok!.kind !== 'cmp') fail(`Oczekiwano porównania (<, >, =, <=, >=, <>), a jest ${q(opTok!.text)}.`, opTok!);
    next();
    const right = parseArg(ctx, opTok!);
    return { a: left.e, op: opTok!.text as CmpOp, b: right.e, start: left.start };
  }

  // --- polecenia ---------------------------------------------------------

  function parseBlock(ctx: Ctx, owner: Tok, what: string): { body: Stmt[]; close: Tok } {
    const open = peek();
    if (!open) fail(`Po ${what} brakuje nawiasu „[” z poleceniami.`, owner);
    if (open!.kind !== 'lbr') fail(`Po ${what} oczekiwano nawiasu „[”, a jest ${q(open!.text)}.`, open!);
    next();
    if (ctx.bracketDepth + 1 > MAX_DEPTH) fail(`Za głębokie zagnieżdżenie nawiasów: najwyżej ${MAX_DEPTH}.`, open!);
    const inner: Ctx = { ...ctx, bracketDepth: ctx.bracketDepth + 1 };
    const body: Stmt[] = [];
    for (;;) {
      const t = peek();
      if (!t) fail('Nawias „[” nie został zamknięty: brakuje „]”.', open!);
      if (t!.kind === 'rbr') {
        next();
        return { body, close: t! };
      }
      if (isKw(t, 'end') && ctx.proc) fail('Nawias „[” nie został zamknięty przed końcem procedury: brakuje „]”.', open!);
      body.push(parseStatement(inner));
    }
  }

  function parseStatement(ctx: Ctx): Stmt {
    const t = next()!;
    switch (t.kind) {
      case 'word': break;
      case 'rbr': return fail('Nadmiarowy nawias „]”: nie pasuje do żadnego „[”.', t);
      case 'lbr': return fail('Nawias „[” w tym miejscu jest nieoczekiwany: nawiasy kwadratowe otaczają treść „powtórz”, „jeśli” i „jeżeli”.', t);
      case 'rpar': return fail('Nadmiarowy nawias „)”.', t);
      case 'op': {
        const prev = toks[pos - 2];
        const hint = (t.text === '-' || t.text === '+') && t.wsBefore && !t.wsAfter && prev &&
          (prev.kind === 'num' || prev.kind === 'rpar' || prev.kind === 'word')
          ? ` Jeśli to działanie, postaw spacje po obu stronach znaku (${prev.text} ${t.text} …) albo nie stawiaj żadnej.`
          : '';
        return fail(`Nieoczekiwany znak ${q(t.text)}: w tym miejscu powinno stać polecenie.${hint}`, t);
      }
      default:
        return fail(`Nieoczekiwana wartość ${q(t.text)}: w tym miejscu powinno stać polecenie.`, t);
    }
    const kw = t.colon ? undefined : KEYWORDS.get(t.name);
    if (!kw) {
      if (!t.colon && headers.has(t.name)) return parseCall(ctx, t);
      const known = ctx.proc
        ? ctx.proc.params.includes(t.name) || ctx.proc.vars.has(t.name) || globals.has(t.name)
        : globals.has(t.name);
      if (t.colon || known) return fail(`Nieoczekiwana wartość ${q(t.text)}: w tym miejscu powinno stać polecenie.`, t);
      return fail(`Nieznane polecenie ${q(t.text)}.`, t);
    }
    switch (kw) {
      case 'fd': case 'bk':
        return { k: 'move', sign: kw === 'fd' ? 1 : -1, arg: parseArg(ctx, t), tok: t };
      case 'rt': case 'lt':
        return { k: 'turn', axis: 'yaw', sign: kw === 'rt' ? 1 : -1, arg: parseArg(ctx, t), tok: t };
      case 'up': case 'down': case 'rr': case 'rl': {
        if (mode === '2d' && ONLY_3D.has(kw)) fail(`Polecenie ${q(t.text)} działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`, t);
        const axis = kw === 'up' || kw === 'down' ? 'pitch' : 'roll';
        const sign = kw === 'up' || kw === 'rr' ? 1 : -1;
        return { k: 'turn', axis, sign, arg: parseArg(ctx, t), tok: t };
      }
      case 'pu': case 'pd':
        return { k: 'pen', down: kw === 'pd', tok: t };
      case 'stop': return { k: 'stop', tok: t };
      case 'home': return { k: 'home', tok: t };
      case 'cs': return { k: 'clear', tok: t };
      case 'color': {
        const c = peek();
        if (!c) fail(`Brakuje koloru po ${q(t.text)}. Pisz np. ${t.text} "#16866a".`, t);
        if (c!.kind !== 'str') fail(`Po ${q(t.text)} podaj kolor w cudzysłowie, np. "#16866a", a jest ${q(c!.text)}.`, c!);
        next();
        const inner = c!.text.slice(1, -1);
        if (!/^#[0-9a-fA-F]{6}$/.test(inner)) fail(`Nieprawidłowy kolor ${c!.text}. Kolor to # i sześć cyfr szesnastkowych, np. "#16866a".`, c!);
        return { k: 'color', color: inner.toLowerCase(), tok: t };
      }
      case 'width': {
        const arg = parseArg(ctx, t);
        checkLiteral(arg, widthProblem);
        return { k: 'width', arg, tok: t };
      }
      case 'repeat': {
        const count = parseArg(ctx, t);
        checkLiteral(count, repeatProblem);
        const { body, close } = parseBlock({ ...ctx, repeatDepth: ctx.repeatDepth + 1 }, lastTok(), 'liczbie powtórzeń');
        return { k: 'repeat', count, body, tok: t, close };
      }
      case 'let': {
        const n = peek();
        if (!n) fail(`Po ${q(t.text)} podaj nazwę zmiennej i wartość, np. ${t.text} bok 50.`, t);
        if (n!.kind !== 'word') fail(`Po ${q(t.text)} oczekiwano nazwy zmiennej, a jest ${q(n!.text)}.`, n!);
        if (!n!.colon && KEYWORDS.has(n!.name)) fail(`${q(n!.text)} to słowo języka i nie może być nazwą zmiennej.`, n!);
        if (headers.has(n!.name)) fail(`${q(n!.text)} to nazwa procedury i nie może być nazwą zmiennej.`, n!);
        next();
        const arg = parseArg(ctx, n!);
        return { k: 'let', name: n!.name, arg, tok: t };
      }
      case 'if': case 'ifelse': {
        const cond = parseCond(ctx, t);
        const a = parseBlock(ctx, lastTok(), 'warunku');
        if (kw === 'if') return { k: 'if', cond, then: a.body, closeThen: a.close, else: null, closeElse: null, tok: t };
        const b = parseBlock(ctx, a.close, `pierwszym bloku ${q(t.text)} (drugi blok to „w przeciwnym razie”)`);
        return { k: 'if', cond, then: a.body, closeThen: a.close, else: b.body, closeElse: b.close, tok: t };
      }
      case 'repcount':
        return fail(`Nieoczekiwana wartość ${q(t.text)}: w tym miejscu powinno stać polecenie.`, t);
      case 'to':
        return fail('Procedurę można zdefiniować tylko na najwyższym poziomie programu, nie wewnątrz innej procedury ani nawiasów.', t);
      case 'end':
        return fail(ctx.proc ? `${q(t.text)} musi stać sam w osobnym wierszu.` : `${q(t.text)} bez rozpoczynającego procedurę „oto”.`, t);
    }
  }

  function parseCall(ctx: Ctx, t: Tok): Stmt {
    const header = headers.get(t.name)!;
    const n = header.params.length;
    const args: Arg[] = [];
    for (let i = 0; i < n; i++) {
      args.push(parseArg(ctx, t, (found) => {
        const msg = `Procedura ${q(t.text)} potrzebuje ${n} ${plural(n, 'argumentu', 'argumentów', 'argumentów')}, a podano ${i}.`;
        return fail(msg, found ?? t);
      }));
    }
    return { k: 'call', name: t.name, args, tok: t };
  }

  function parseDefinition(otoTok: Tok) {
    if (!otoTok.lineStart) fail(`${q(otoTok.text)} musi stać na początku wiersza.`, otoTok);
    const nameTok = peek();
    if (!nameTok || nameTok.lineStart) fail(`Po ${q(otoTok.text)} podaj w tym samym wierszu nazwę procedury.`, otoTok);
    if (nameTok!.kind !== 'word' || nameTok!.colon || nameTok!.name.endsWith(':')) fail(`${q(nameTok!.text)} nie może być nazwą procedury.`, nameTok!);
    if (KEYWORDS.has(nameTok!.name)) fail(`${q(nameTok!.text)} to słowo języka i nie może być nazwą procedury.`, nameTok!);
    if (procs.has(nameTok!.name)) fail(`Procedura ${q(nameTok!.text)} jest już zdefiniowana. Każdą nazwę można zdefiniować tylko raz.`, nameTok!);
    next();
    const params: string[] = [];
    const addParam = (p: Tok) => {
      const name = p.name;
      if (p.kind !== 'word' || name.endsWith(':')) fail(`${q(p.text)} nie może być nazwą parametru.`, p);
      if (KEYWORDS.has(name)) fail(`${q(p.text)} to słowo języka i nie może być nazwą parametru.`, p);
      if (params.includes(name)) fail(`Parametr ${q(p.text)} powtarza się w nagłówku.`, p);
      params.push(name);
    };
    const onHeader = () => { const p = peek(); return p && !p.lineStart ? p : undefined; };
    let h = onHeader();
    if (h && h.kind === 'word' && !h.colon && h.name === 'ma:') {
      next();
      for (;;) {
        const p = onHeader();
        if (!p) fail('Po „ma:” podaj nazwy parametrów oddzielone przecinkami.', h);
        if (p!.kind !== 'word' || p!.colon) fail(`Oczekiwano nazwy parametru, a jest ${q(p!.text)}.`, p!);
        next();
        addParam(p!);
        const c = onHeader();
        if (!c) break;
        if (c.kind !== 'comma') fail(`Parametry oddzielaj przecinkami: oczekiwano „,”, a jest ${q(c.text)}.`, c);
        next();
      }
    } else {
      while ((h = onHeader())) {
        if (h.kind !== 'word' || !h.colon) fail(`Nieprawidłowy nagłówek procedury: parametry zapisz po „ma:” (oto ${nameTok!.text} ma: bok) albo z dwukropkiem (:bok).`, h);
        next();
        addParam(h);
      }
    }
    const header = headers.get(nameTok!.name)!;
    // Prescan mógł policzyć parametry inaczej tylko w błędnym nagłówku, który już odrzuciliśmy.
    header.params = params;
    const ctx: Ctx = { proc: header, procName: nameTok!.name, repeatDepth: 0, bracketDepth: 0 };
    const body: Stmt[] = [];
    for (;;) {
      const t = peek();
      if (!t) fail(`Brakuje „już” kończącego procedurę ${q(nameTok!.text)}.`, otoTok);
      if (isKw(t, 'end')) {
        if (!(t!.lineStart && t!.lineEnd)) fail(`${q(t!.text)} musi stać sam w osobnym wierszu.`, t!);
        next();
        break;
      }
      if (isKw(t, 'to')) fail(`Nie można zdefiniować procedury wewnątrz procedury ${q(nameTok!.text)}. Najpierw zakończ ją słowem „już” w osobnym wierszu.`, t!);
      body.push(parseStatement(ctx));
    }
    procs.set(nameTok!.name, { name: nameTok!.name, display: nameTok!.text, params, body, tok: nameTok! });
  }

  const body: Stmt[] = [];
  const top: Ctx = { proc: null, procName: null, repeatDepth: 0, bracketDepth: 0 };
  while (pos < toks.length) {
    const t = peek()!;
    if (isKw(t, 'to')) {
      next();
      parseDefinition(t);
      continue;
    }
    body.push(parseStatement(top));
  }
  return { mode, body, procs, source };
}

export function widthProblem(v: number): string | null {
  if (!Number.isInteger(v) || v < 1 || v > 12) return `Grubość musi być liczbą całkowitą od 1 do 12, a wynosi ${fmtNum(v)}.`;
  return null;
}

export function repeatProblem(v: number): string | null {
  if (!Number.isInteger(v) || v < 0 || v > MAX_REPEAT) return `Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000, a wynosi ${fmtNum(v)}.`;
  return null;
}

export function fmtNum(v: number): string {
  if (Number.isInteger(v)) return String(v);
  const r = Math.round(v * 1e6) / 1e6;
  return String(r === v ? v : r).replace('.', ',');
}

export function arith(op: string, a: number, b: number): number {
  let r: number;
  switch (op) {
    case '+': r = a + b; break;
    case '-': r = a - b; break;
    case '*': r = a * b; break;
    default:
      if (b === 0) throw new EvalError('Dzielenie przez zero.');
      r = a / b;
  }
  if (!Number.isFinite(r)) throw new EvalError('Wynik obliczenia jest zbyt duży: nie jest skończoną liczbą.');
  return r;
}

function evalConst(e: Expr): number {
  switch (e.k) {
    case 'num': return e.v;
    case 'neg': return -evalConst(e.e);
    case 'pos': return evalConst(e.e);
    case 'bin': return arith(e.op, evalConst(e.a), evalConst(e.b));
    default: throw new Error('nie stała');
  }
}
