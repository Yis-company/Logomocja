// Parser: tokens -> validated program tree. Every parse-time rule lives here.
import { LogoError, LIMITS, Token, fmtNum, fmtInt } from './lexer';

export type Mode = '2d' | '3d';

export type Cmd =
  | 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width' | 'repeat' | 'let'
  | 'if' | 'ifelse' | 'stop' | 'home' | 'cs' | 'up' | 'down' | 'rr' | 'rl';

export const KEYWORDS: Record<string, Cmd | 'rep' | 'def' | 'end'> = {
  np: 'fd', naprzod: 'fd', 'naprzód': 'fd', fd: 'fd', forward: 'fd',
  ws: 'bk', wstecz: 'bk', bk: 'bk', back: 'bk',
  pw: 'rt', prawo: 'rt', rt: 'rt', right: 'rt',
  lw: 'lt', lewo: 'lt', lt: 'lt', left: 'lt',
  pod: 'pu', podnies: 'pu', 'podnieś': 'pu', pu: 'pu', penup: 'pu',
  opu: 'pd', opusc: 'pd', 'opuść': 'pd', pd: 'pd', pendown: 'pd',
  kolor: 'color', color: 'color',
  grubosc: 'width', 'grubość': 'width', width: 'width',
  powtorz: 'repeat', 'powtórz': 'repeat', repeat: 'repeat',
  niech: 'let', let: 'let',
  'jeśli': 'if', jesli: 'if', if: 'if',
  'jeżeli': 'ifelse', jezeli: 'ifelse', ifelse: 'ifelse',
  stop: 'stop',
  dom: 'home', home: 'home',
  'czyść': 'cs', czysc: 'cs', cs: 'cs', clearscreen: 'cs',
  gora: 'up', 'góra': 'up', pitchup: 'up',
  dol: 'down', 'dół': 'down', pitchdown: 'down',
  pp: 'rr', przechylprawo: 'rr', rr: 'rr', rollright: 'rr',
  pl: 'rl', przechyllewo: 'rl', rl: 'rl', rollleft: 'rl',
  nrpowt: 'rep', repcount: 'rep',
  oto: 'def', to: 'def',
  'już': 'end', juz: 'end', end: 'end',
};

const ONLY_3D = new Set<Cmd>(['up', 'down', 'rr', 'rl']);

export type Expr =
  | { k: 'num'; v: number }
  | { k: 'var'; name: string; tok: Token }
  | { k: 'rep' }
  | { k: 'neg'; e: Expr }
  | { k: 'bin'; op: string; a: Expr; b: Expr };

export interface Arg { e: Expr; tok: Token; literal: boolean }

export type Stmt =
  | { k: 'move'; sign: 1 | -1; arg: Arg; tok: Token }
  | { k: 'turn'; axis: 'yaw' | 'pitch' | 'roll'; sign: 1 | -1; arg: Arg; tok: Token }
  | { k: 'pen'; down: boolean; tok: Token }
  | { k: 'color'; value: string; tok: Token }
  | { k: 'width'; arg: Arg; tok: Token }
  | { k: 'repeat'; count: Arg; body: Stmt[]; tok: Token; close: Token }
  | { k: 'let'; name: string; arg: Arg; tok: Token }
  | { k: 'if'; a: Arg; cmp: string; b: Arg; then: Stmt[]; thenClose: Token; else: Stmt[] | null; elseClose: Token | null; tok: Token }
  | { k: 'stop'; tok: Token }
  | { k: 'home'; tok: Token }
  | { k: 'cs'; tok: Token }
  | { k: 'call'; name: string; args: Arg[]; tok: Token };

export interface Proc {
  name: string;
  display: string;
  params: string[];
  tok: Token;
  endTok: Token;
  bodyToks: Token[];
  locals: Set<string>;
  body: Stmt[];
}

export interface Program {
  mode: Mode;
  procs: Map<string, Proc>;
  globals: Set<string>;
  body: Stmt[];
}

const err = (msg: string, t: Token) => new LogoError(msg, t.line, t.col);
const q = (s: string) => `„${s}”`;
const isEnd = (t: Token) => t.t === 'word' && !t.legacy && KEYWORDS[t.v] === 'end';
const isDef = (t: Token) => t.t === 'word' && !t.legacy && KEYWORDS[t.v] === 'def';

function describe(t: Token): string {
  if (t.t === 'eof') return 'koniec programu';
  return q(t.text);
}

/** Pass 1: split out procedure definitions and collect names. */
function splitDefinitions(toks: Token[], mode: Mode): Program & { top: Token[] } {
  const procs = new Map<string, Proc>();
  const top: Token[] = [];
  let depth = 0;
  let i = 0;
  while (i < toks.length) {
    const t = toks[i];
    if (t.t === 'eof') { top.push(t); break; }
    if (isDef(t)) {
      if (depth > 0) throw err(`Procedury nie można definiować wewnątrz bloku [ ]. Przenieś ${q(t.text)} poza nawiasy.`, t);
      if (!t.first) throw err(`${q(t.text)} musi stać na początku wiersza.`, t);
      const p = parseHeader(toks, i, procs);
      procs.set(p.proc.name, p.proc);
      i = p.next;
      continue;
    }
    if (isEnd(t)) throw err(`${q(t.text)} bez wcześniejszego ${q('oto')}: nie ma tu procedury do zakończenia.`, t);
    if (t.t === 'lbr') depth++;
    else if (t.t === 'rbr' && depth > 0) depth--;
    top.push(t);
    i++;
  }
  const globals = new Set<string>();
  collectLets(top, globals);
  for (const p of procs.values()) {
    collectLets(p.bodyToks, p.locals);
    for (const prm of p.params) p.locals.add(prm);
  }
  return { mode, procs, globals, body: [], top };
}

function collectLets(toks: Token[], into: Set<string>) {
  for (let k = 0; k + 1 < toks.length; k++) {
    const t = toks[k];
    if (t.t === 'word' && !t.legacy && KEYWORDS[t.v] === 'let' && toks[k + 1].t === 'word') into.add(toks[k + 1].v);
  }
}

function checkNewName(t: Token, what: string) {
  if (t.t !== 'word') throw err(`Oczekiwano nazwy ${what}, a jest ${describe(t)}.`, t);
  if (KEYWORDS[t.v]) throw err(`${q(t.text)} to słowo języka — nie może być nazwą ${what}.`, t);
}

function parseHeader(toks: Token[], i: number, procs: Map<string, Proc>) {
  const defTok = toks[i];
  const nameTok = toks[i + 1];
  if (nameTok.t === 'eof' || nameTok.line !== defTok.line) {
    throw err(`Po ${q(defTok.text)} podaj nazwę procedury w tym samym wierszu, np. oto kwadrat ma: bok.`, defTok);
  }
  if (nameTok.legacy) throw err(`Nazwa procedury nie zaczyna się od dwukropka: napisz ${q(nameTok.text.slice(1))}.`, nameTok);
  checkNewName(nameTok, 'procedury');
  if (procs.has(nameTok.v)) throw err(`Procedura ${q(nameTok.text)} jest już zdefiniowana. Każdą nazwę można zdefiniować raz.`, nameTok);
  const params: string[] = [];
  let k = i + 2;
  const onLine = () => toks[k].t !== 'eof' && toks[k].line === defTok.line;
  const addParam = (pt: Token) => {
    checkNewName(pt, 'parametru');
    if (params.includes(pt.v)) throw err(`Parametr ${q(pt.text)} powtarza się w nagłówku.`, pt);
    params.push(pt.v);
  };
  if (onLine() && toks[k].t === 'ma') {
    const maTok = toks[k];
    k++;
    if (!onLine()) throw err(`Po ${q('ma:')} wypisz parametry rozdzielone przecinkami, np. ma: bok, kąt.`, maTok);
    for (;;) {
      addParam(toks[k]);
      k++;
      if (!onLine()) break;
      if (toks[k].t !== 'comma') throw err(`Oczekiwano przecinka między parametrami, a jest ${describe(toks[k])}.`, toks[k]);
      k++;
      if (!onLine()) throw err(`Po przecinku brakuje nazwy parametru.`, toks[k - 1]);
    }
  } else {
    while (onLine()) {
      const pt = toks[k];
      if (pt.t !== 'word' || !pt.legacy) {
        throw err(`Nieoczekiwany element ${describe(pt)} w nagłówku procedury. Parametry wypisz po ${q('ma:')}, np. oto kwadrat ma: bok.`, pt);
      }
      addParam(pt);
      k++;
    }
  }
  const bodyStart = k;
  for (;;) {
    const t = toks[k];
    if (t.t === 'eof') throw err(`Brakuje ${q('już')} kończącego procedurę ${q(nameTok.text)}.`, defTok);
    if (isDef(t)) throw err(`Procedury nie można definiować wewnątrz innej procedury. Zakończ ${q(nameTok.text)} słowem ${q('już')}.`, t);
    if (isEnd(t)) {
      if (!t.first || !t.last) throw err(`${q(t.text)} musi stać sam w osobnym wierszu.`, t);
      break;
    }
    k++;
  }
  const endTok = toks[k];
  const bodyToks = toks.slice(bodyStart, k);
  bodyToks.push({ ...endTok, t: 'eof' });
  const proc: Proc = {
    name: nameTok.v, display: nameTok.text, params, tok: nameTok, endTok, bodyToks,
    locals: new Set(), body: [],
  };
  return { proc, next: k + 1 };
}

class Parser {
  i = 0;
  depth = 0;
  parens = 0;
  rep = 0;
  constructor(private toks: Token[], private prog: Program, private proc: Proc | null) {}

  peek() { return this.toks[this.i]; }
  next() { return this.toks[this.i++]; }

  parseAll(): Stmt[] {
    const out: Stmt[] = [];
    while (this.peek().t !== 'eof') {
      if (this.peek().t === 'rbr') throw err(`Nadmiarowy nawias ${q(']')} — nie ma do niego pasującego ${q('[')}.`, this.peek());
      out.push(this.stmt());
    }
    return out;
  }

  block(cmd: Token, what: string): { body: Stmt[]; close: Token } {
    const open = this.peek();
    if (open.t !== 'lbr') {
      const at = open.t === 'eof' ? cmd : open;
      throw err(`${what}: oczekiwano bloku w nawiasach [ ], a jest ${describe(open)}.`, at);
    }
    this.next();
    this.depth++;
    if (this.depth > LIMITS.depth) throw err(`Za głębokie zagnieżdżenie nawiasów: limit to ${LIMITS.depth} poziomy.`, open);
    const body: Stmt[] = [];
    for (;;) {
      const t = this.peek();
      if (t.t === 'rbr') break;
      if (t.t === 'eof') throw err(`Brakuje nawiasu ${q(']')} zamykającego ten blok.`, open);
      body.push(this.stmt());
    }
    const close = this.next();
    this.depth--;
    return { body, close };
  }

  stmt(): Stmt {
    const t = this.next();
    if (t.t !== 'word') return this.stray(t);
    if (t.legacy) throw err(`Oczekiwano polecenia, a jest wartość ${q(t.text)}.`, t);
    const kw = KEYWORDS[t.v];
    if (!kw) {
      const p = this.prog.procs.get(t.v);
      if (p) {
        const args: Arg[] = [];
        for (let a = 0; a < p.params.length; a++) {
          args.push(this.arg(t, `Procedura ${q(p.display)} potrzebuje ${argCount(p.params.length)}, a podano ${a}.`));
        }
        return { k: 'call', name: p.name, args, tok: t };
      }
      if (this.known(t.v)) throw err(`Oczekiwano polecenia, a jest wartość ${q(t.text)}.`, t);
      throw err(`Nieznane polecenie ${q(t.text)}.${hint(t.v)}`, t);
    }
    if (kw === 'rep') throw err(`${q(t.text)} to wartość, nie polecenie — użyj jej jako argumentu, np. np ${t.text} * 10.`, t);
    if (kw === 'def') throw err(`Procedury definiuje się tylko na najwyższym poziomie programu, nie wewnątrz bloku.`, t);
    if (kw === 'end') throw err(`Nieoczekiwane ${q(t.text)}.`, t);
    if (this.prog.mode === '2d' && ONLY_3D.has(kw)) {
      throw err(`Polecenie ${q(t.text)} działa tylko w trybie 3D. Przełącz tryb na 3D albo usuń to polecenie.`, t);
    }
    const name = q(t.text);
    switch (kw) {
      case 'fd': case 'bk':
        return { k: 'move', sign: kw === 'fd' ? 1 : -1, arg: this.arg(t, `Polecenie ${name} potrzebuje odległości, np. ${t.text} 50.`), tok: t };
      case 'rt': case 'lt':
        return { k: 'turn', axis: 'yaw', sign: kw === 'rt' ? 1 : -1, arg: this.arg(t, `Polecenie ${name} potrzebuje kąta w stopniach, np. ${t.text} 90.`), tok: t };
      case 'up': case 'down':
        return { k: 'turn', axis: 'pitch', sign: kw === 'up' ? 1 : -1, arg: this.arg(t, `Polecenie ${name} potrzebuje kąta w stopniach, np. ${t.text} 90.`), tok: t };
      case 'rr': case 'rl':
        return { k: 'turn', axis: 'roll', sign: kw === 'rr' ? 1 : -1, arg: this.arg(t, `Polecenie ${name} potrzebuje kąta w stopniach, np. ${t.text} 90.`), tok: t };
      case 'pu': case 'pd':
        return { k: 'pen', down: kw === 'pd', tok: t };
      case 'stop': return { k: 'stop', tok: t };
      case 'home': return { k: 'home', tok: t };
      case 'cs': return { k: 'cs', tok: t };
      case 'color': {
        const c = this.peek();
        if (c.t !== 'color') {
          throw err(`Polecenie ${name} potrzebuje koloru w cudzysłowie, np. kolor "#16866a", a jest ${describe(c)}.`, c.t === 'eof' ? t : c);
        }
        this.next();
        return { k: 'color', value: c.v, tok: t };
      }
      case 'width': {
        const arg = this.arg(t, `Polecenie ${name} potrzebuje grubości od 1 do 12, np. ${t.text} 3.`);
        if (arg.literal) checkWidth(constEval(arg), arg.tok);
        return { k: 'width', arg, tok: t };
      }
      case 'repeat': {
        const count = this.arg(t, `Polecenie ${name} potrzebuje liczby powtórzeń, np. ${t.text} 4 [np 50 pw 90].`);
        if (count.literal) checkRepeat(constEval(count), count.tok);
        this.rep++;
        const { body, close } = this.block(t, `Po liczbie powtórzeń w ${name}`);
        this.rep--;
        return { k: 'repeat', count, body, tok: t, close };
      }
      case 'let': {
        const nt = this.peek();
        if (nt.t !== 'word') {
          throw err(`Po ${name} podaj nazwę zmiennej i wartość, np. niech bok 50.`, nt.t === 'eof' ? t : nt);
        }
        if (nt.legacy) throw err(`Nazwę zmiennej po ${name} pisz bez dwukropka: ${q(nt.text.slice(1))}.`, nt);
        if (KEYWORDS[nt.v]) throw err(`${q(nt.text)} to słowo języka — nie może być nazwą zmiennej.`, nt);
        if (this.prog.procs.has(nt.v)) throw err(`${q(nt.text)} to nazwa procedury — zmienna musi mieć inną nazwę.`, nt);
        this.next();
        return { k: 'let', name: nt.v, arg: this.arg(t, `Po ${name} ${nt.text} podaj wartość, np. niech ${nt.text} 50.`), tok: t };
      }
      case 'if': case 'ifelse': {
        const a = this.arg(t, `Po ${name} podaj warunek, np. ${t.text} bok > 10 [...].`);
        const c = this.peek();
        if (c.t !== 'cmp') {
          throw err(`Oczekiwano porównania (<, >, =, <=, >=, <>), a jest ${describe(c)}.`, c.t === 'eof' ? t : c);
        }
        this.next();
        const b = this.arg(c, `Po porównaniu ${q(c.text)} brakuje drugiej strony warunku.`);
        const th = this.block(t, `Po warunku w ${name}`);
        if (kw === 'if') return { k: 'if', a, cmp: c.v, b, then: th.body, thenClose: th.close, else: null, elseClose: null, tok: t };
        const el = this.block(t, `${name} potrzebuje dwóch bloków — po pierwszym`);
        return { k: 'if', a, cmp: c.v, b, then: th.body, thenClose: th.close, else: el.body, elseClose: el.close, tok: t };
      }
    }
  }

  stray(t: Token): never {
    if (t.t === 'eof') throw err('Nieoczekiwany koniec programu.', t);
    if (t.t === 'lbr') throw err(`Nieoczekiwany nawias ${q('[')} — blok musi następować po powtórz, jeśli lub jeżeli.`, t);
    if (t.t === 'rbr') throw err(`Nadmiarowy nawias ${q(']')} — nie ma do niego pasującego ${q('[')}.`, t);
    if (t.t === 'rpar') throw err(`Nadmiarowy nawias ${q(')')} — nie ma do niego pasującego ${q('(')}.`, t);
    if (t.t === 'op' && (t.v === '-' || t.v === '+') && !t.sa) {
      throw err(`Oczekiwano polecenia, a jest ${q(t.text + this.peek().text)}. Jeśli to odejmowanie, postaw spacje po obu stronach znaku ${q(t.text)} albo po żadnej.`, t);
    }
    if (t.t === 'op') throw err(`Oczekiwano polecenia, a jest operator ${q(t.text)}. Operator musi mieć spacje po obu stronach albo po żadnej.`, t);
    if (t.t === 'num' || t.t === 'lpar') throw err(`Oczekiwano polecenia, a jest wartość ${q(t.text)}. Czy brakuje polecenia przed nią?`, t);
    if (t.t === 'color') throw err(`Oczekiwano polecenia, a jest kolor ${q(t.text)}. Kolor ustawia się poleceniem kolor.`, t);
    if (t.t === 'cmp') throw err(`Porównanie ${q(t.text)} może stać tylko w warunku jeśli lub jeżeli.`, t);
    if (t.t === 'ma') throw err(`${q('ma:')} może stać tylko w nagłówku procedury.`, t);
    if (t.t === 'comma') throw err(`Nieoczekiwany przecinek. Argumenty rozdziela się spacjami.`, t);
    throw err(`Nieoczekiwany element ${q(t.text)}.`, t);
  }

  known(name: string) {
    return (this.proc !== null && this.proc.locals.has(name)) || this.prog.globals.has(name);
  }

  arg(cmd: Token, missing: string): Arg {
    const start = this.peek();
    if (!startsExpr(start)) throw err(missing, start.t === 'eof' ? cmd : start);
    const before = { vars: this.vars };
    this.vars = 0;
    const e = this.expr(cmd);
    const literal = this.vars === 0;
    this.vars = before.vars;
    return { e, tok: start, literal };
  }

  vars = 0;

  expr(cmd: Token): Expr {
    let a = this.term(cmd);
    for (;;) {
      const t = this.peek();
      if (t.t === 'op' && (t.v === '+' || t.v === '-') && t.sb === t.sa) {
        this.next();
        a = { k: 'bin', op: t.v, a, b: this.term(t) };
      } else return a;
    }
  }

  term(cmd: Token): Expr {
    let a = this.unary(cmd);
    for (;;) {
      const t = this.peek();
      if (t.t === 'op' && (t.v === '*' || t.v === '/') && t.sb === t.sa) {
        this.next();
        a = { k: 'bin', op: t.v, a, b: this.unary(t) };
      } else return a;
    }
  }

  unary(cmd: Token): Expr {
    let neg = false;
    let any = false;
    while (this.peek().t === 'op' && (this.peek().v === '-' || this.peek().v === '+')) {
      if (this.next().v === '-') neg = !neg;
      any = true;
    }
    const e = this.primary(any ? this.toks[this.i - 1] : cmd);
    return neg ? { k: 'neg', e } : e;
  }

  primary(cmd: Token): Expr {
    const t = this.peek();
    if (t.t === 'num') { this.next(); return { k: 'num', v: t.n }; }
    if (t.t === 'lpar') {
      this.next();
      this.parens++;
      if (this.parens > LIMITS.depth) throw err(`Za głębokie zagnieżdżenie nawiasów: limit to ${LIMITS.depth} poziomy.`, t);
      const e = this.expr(t);
      if (this.peek().t !== 'rpar') {
        throw err(`Brakuje nawiasu ${q(')')} zamykającego ten nawias.`, t);
      }
      this.next();
      this.parens--;
      return e;
    }
    if (t.t === 'word') {
      const kw = t.legacy ? undefined : KEYWORDS[t.v];
      if (kw === 'rep') {
        if (this.rep === 0) {
          throw err(`${q(t.text)} działa tylko wewnątrz bloku powtórz${this.proc ? ' zapisanego w tej samej procedurze' : ''}.`, t);
        }
        this.next();
        this.vars++;
        return { k: 'rep' };
      }
      if (kw) throw err(`Brakuje wartości: ${q(t.text)} to polecenie, a tu potrzebna jest liczba lub wyrażenie.`, t);
      if (this.known(t.v)) {
        this.next();
        this.vars++;
        return { k: 'var', name: t.v, tok: t };
      }
      if (this.prog.procs.has(t.v)) throw err(`${q(t.text)} to procedura — nie daje wartości, której można tu użyć.`, t);
      throw err(`Nieznana nazwa ${q(t.text)}: to nie jest parametr ani zmienna ustawiona przez niech.`, t);
    }
    const at = t.t === 'eof' ? cmd : t;
    throw err(`Brakuje wartości po ${q(cmd.text)}: oczekiwano liczby lub wyrażenia, a jest ${describe(t)}.`, at);
  }
}

function startsExpr(t: Token) {
  return t.t === 'num' || t.t === 'lpar' || (t.t === 'op' && (t.v === '-' || t.v === '+')) ||
    (t.t === 'word' && (t.legacy || !KEYWORDS[t.v] || KEYWORDS[t.v] === 'rep'));
}

function argCount(n: number) {
  if (n === 1) return '1 argumentu';
  return `${n} argumentów`;
}

const COMMON: Record<string, string> = {
  naprzód: 'np', forward: 'fd', prosto: 'np', obrot: 'pw', obróć: 'pw', powtorzyc: 'powtorz', koniec: 'już',
  kolorpisaka: 'kolor', pióro: 'opu', podniesc: 'podnieś', opuscic: 'opuść',
};
function hint(v: string) {
  const h = COMMON[v];
  return h ? ` Może chodziło o ${q(h)}?` : ' Sprawdź pisownię albo zdefiniuj procedurę słowem oto.';
}

export function evalConst(e: Expr): number {
  switch (e.k) {
    case 'num': return e.v;
    case 'neg': return -evalConst(e.e);
    case 'bin': return binop(e.op, evalConst(e.a), evalConst(e.b));
    default: throw new Error('not constant');
  }
}

export function binop(op: string, a: number, b: number): number {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    default:
      if (b === 0) throw new RangeError('div0');
      return a / b;
  }
}

function constEval(arg: Arg): number {
  try {
    const v = evalConst(arg.e);
    if (!Number.isFinite(v)) throw new RangeError('inf');
    return v;
  } catch (e) {
    throw err((e as Error).message === 'div0' ? 'Dzielenie przez zero.' : 'Wynik obliczenia nie jest skończoną liczbą.', arg.tok);
  }
}

export function checkWidth(v: number, at: Token) {
  if (!Number.isInteger(v) || v < 1 || v > 12) {
    throw err(`Grubość musi być liczbą całkowitą od 1 do 12, a wynosi ${fmtNum(v)}.`, at);
  }
}

export function checkRepeat(v: number, at: Token) {
  if (!Number.isInteger(v) || v < 0 || v > 10000) {
    throw err(`Liczba powtórzeń musi być liczbą całkowitą od 0 do ${fmtInt(10000)}, a wynosi ${fmtNum(v)}.`, at);
  }
}

export function parse(toks: Token[], mode: Mode): Program {
  const prog = splitDefinitions(toks, mode);
  const errors: LogoError[] = [];
  const attempt = (f: () => void) => {
    try { f(); } catch (e) { if (e instanceof LogoError) errors.push(e); else throw e; }
  };
  attempt(() => { prog.body = new Parser(prog.top, prog, null).parseAll(); });
  for (const p of prog.procs.values()) attempt(() => { p.body = new Parser(p.bodyToks, prog, p).parseAll(); });
  if (errors.length) {
    errors.sort((a, b) => a.line - b.line || a.column - b.column);
    throw errors[0];
  }
  return prog;
}
