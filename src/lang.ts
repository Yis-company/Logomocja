// Logomocja: lexer, parser (with whole-program validation) and turtle machine.

export type Mode = '2d' | '3d'
export type Vec = [number, number, number]
export interface Seg {
  from: Vec
  to: Vec
  color: string
  width: number
}
export interface LogoError {
  message: string
  line: number
  column: number
}

export const LIMITS = {
  chars: 50000,
  tokens: 10000,
  depth: 32,
  ops: 10000,
  segments: 10000,
  coord: 100000,
}

class LogoErr extends Error {
  constructor(message: string, readonly line: number, readonly column: number) {
    super(message)
  }
}
const fail = (message: string, at: { line: number; col: number }): never => {
  throw new LogoErr(message, at.line, at.col)
}
const toError = (e: unknown): LogoError => {
  if (e instanceof LogoErr) return { message: e.message, line: e.line, column: e.column }
  throw e
}

// ---------- lexer ----------

interface Tok {
  t: 'word' | 'str' | 'lb' | 'rb' | 'comma' | 'bad'
  text: string
  line: number
  col: number
  first: boolean
  last: boolean
  msg?: string
}

const norm = (s: string) => s.normalize('NFC').toLowerCase()

function lex(src: string): Tok[] {
  if (src.length > LIMITS.chars) {
    const head = src.slice(0, LIMITS.chars)
    const line = head.split('\n').length
    const col = head.length - head.lastIndexOf('\n')
    fail(`Program jest za długi (maksymalnie ${LIMITS.chars} znaków)`, { line, col })
  }
  const toks: Tok[] = []
  let line = 1
  let col = 1
  let i = 0
  const n = src.length
  const push = (t: Tok['t'], text: string, c: number, msg?: string) => {
    const prev = toks[toks.length - 1]
    toks.push({ t, text, line, col: c, first: !prev || prev.line !== line, last: false, msg })
    if (toks.length > LIMITS.tokens)
      fail(`Program ma za dużo tokenów (maksymalnie ${LIMITS.tokens})`, { line, col: c })
  }
  while (i < n) {
    const ch = src[i]
    if (ch === '\n') {
      line++
      col = 1
      i++
    } else if (/\s/.test(ch)) {
      i++
      col++
    } else if (ch === ';') {
      while (i < n && src[i] !== '\n') i++
    } else if (ch === '[' || ch === ']' || ch === ',') {
      push(ch === '[' ? 'lb' : ch === ']' ? 'rb' : 'comma', ch, col)
      i++
      col++
    } else if (ch === '"') {
      let j = i + 1
      while (j < n && src[j] !== '"' && src[j] !== '\n') j++
      if (src[j] === '"') {
        push('str', src.slice(i + 1, j), col)
        j++
      } else {
        push('bad', src.slice(i, j), col, 'Niezamknięty cudzysłów')
      }
      col += j - i
      i = j
    } else {
      let j = i
      while (j < n && !/[\s\[\],;"]/.test(src[j])) j++
      const text = src.slice(i, j)
      if (norm(text).startsWith('ma:') && text.length > 3) {
        push('word', text.slice(0, 3), col)
        push('word', text.slice(3), col + 3)
      } else push('word', text, col)
      col += j - i
      i = j
    }
  }
  toks.forEach((t, k) => {
    const nx = toks[k + 1]
    t.last = !nx || nx.line !== t.line
  })
  return toks
}

// ---------- AST ----------

type Op = 'fd' | 'bk' | 'rt' | 'lt' | 'pu' | 'pd' | 'color' | 'width' | 'repeat' | 'up' | 'down'
type Arg = { lit: number; tok: Tok } | { p: number; tok: Tok }
type Node =
  | { k: 'cmd'; op: Op; arg?: Arg; color?: string; tok: Tok }
  | { k: 'rep'; count: Arg; body: Node[]; tok: Tok }
  | CallNode
interface CallNode {
  k: 'call'
  name: string
  args: Arg[]
  tok: Tok
  proc?: ProcDef
}
type Kind = 'w' | 'r'
interface ProcDef {
  name: string
  params: string[]
  body: Node[]
  tok: Tok
  need: Set<Kind>[]
  fwd: { from: number; call: CallNode; idx: number }[]
  calls: CallNode[]
}
export interface Program {
  main: Node[]
  procs: Map<string, ProcDef>
}

const KEYWORDS = new Map<string, Op>()
const defKw = (op: Op, names: string) => names.split(' ').forEach((n) => KEYWORDS.set(n, op))
defKw('fd', 'np naprzod naprzód fd forward')
defKw('bk', 'ws wstecz bk back')
defKw('rt', 'pw prawo rt right')
defKw('lt', 'lw lewo lt left')
defKw('pu', 'pod podnies podnieś pu penup')
defKw('pd', 'opu opusc opuść pd pendown')
defKw('color', 'kolor color')
defKw('width', 'grubosc grubość width')
defKw('repeat', 'powtorz powtórz repeat')
defKw('up', 'gora góra pitchup')
defKw('down', 'dol dół pitchdown')
const DEF_START = new Set(['oto', 'to'])
const DEF_END = new Set(['już', 'juz', 'end'])
const NUM_RE = /^[+-]?(\d+(\.\d+)?|\.\d+)$/
const IDENT_RE = /^[\p{L}_][\p{L}\p{N}_]*$/u
const isEnd = (t: Tok) => t.t === 'word' && DEF_END.has(norm(t.text))
const isDef = (t: Tok) => t.t === 'word' && DEF_START.has(norm(t.text))
const pluralArg = (n: number) =>
  n === 1 ? 'argument' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'argumenty' : 'argumentów'

function checkLit(kind: Kind | null, v: number, t: Tok) {
  if (kind === 'w' && (!Number.isInteger(v) || v < 1 || v > 12))
    fail('Grubość musi być liczbą całkowitą od 1 do 12', t)
  if (kind === 'r' && (!Number.isInteger(v) || v < 0 || v > 10000))
    fail('Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000', t)
}

class Parser {
  i = 0
  bd = 0
  procs = new Map<string, ProcDef>()
  arity = new Map<string, number>()
  allCalls: CallNode[] = []

  constructor(private toks: Tok[], private mode: Mode) {}

  private header(at: number) {
    const toks = this.toks
    const oto = toks[at]
    const nameTok = toks[at + 1]
    if (!nameTok || nameTok.line !== oto.line) fail('Brak nazwy procedury po „oto”', oto)
    if (nameTok.t !== 'word' || !IDENT_RE.test(nameTok.text))
      fail(`Niepoprawna nazwa procedury „${nameTok.text}”`, nameTok)
    const name = norm(nameTok.text)
    if (KEYWORDS.has(name) || DEF_START.has(name) || DEF_END.has(name))
      fail(`Nazwa „${nameTok.text}” jest zarezerwowana dla polecenia`, nameTok)
    const params: string[] = []
    let j = at + 2
    const same = (t: Tok | undefined): t is Tok => !!t && t.line === oto.line
    const addParam = (t: Tok) => {
      if (t.t !== 'word') fail('Oczekiwano nazwy parametru', t)
      const p = norm(t.text.replace(/^:/, ''))
      if (!IDENT_RE.test(p)) fail(`Niepoprawna nazwa parametru „${t.text}”`, t)
      if (params.includes(p)) fail(`Parametr „${t.text}” jest zdefiniowany dwa razy`, t)
      params.push(p)
    }
    if (same(toks[j]) && toks[j].t === 'word' && norm(toks[j].text) === 'ma:') {
      j++
      for (;;) {
        const t = toks[j]
        if (!same(t)) fail('Oczekiwano nazwy parametru', same(toks[j - 1]) ? toks[j - 1] : oto)
        addParam(t)
        j++
        if (same(toks[j]) && toks[j].t === 'comma') j++
        else break
      }
    } else {
      while (same(toks[j]) && toks[j].t === 'word' && toks[j].text.startsWith(':')) addParam(toks[j++])
    }
    if (same(toks[j]))
      fail('Nieoczekiwany element w nagłówku procedury (parametry rozdziela się przecinkami, a ciało zaczyna w następnej linii)', toks[j])
    return { name, params, next: j, nameTok }
  }

  private prepass() {
    this.toks.forEach((t, k) => {
      if (t.first && isDef(t)) {
        try {
          const h = this.header(k)
          if (!this.arity.has(h.name)) this.arity.set(h.name, h.params.length)
        } catch (e) {
          if (!(e instanceof LogoErr)) throw e
        }
      }
    })
  }

  parse(): Program {
    this.prepass()
    const main: Node[] = []
    while (this.i < this.toks.length) {
      const t = this.toks[this.i]
      if (isDef(t)) {
        if (!t.first) fail('„oto” musi zaczynać linię', t)
        this.def()
      } else main.push(this.statement(null))
    }
    this.finish()
    return { main, procs: this.procs }
  }

  private def() {
    const defTok = this.toks[this.i]
    const h = this.header(this.i)
    if (this.procs.has(h.name)) fail(`Procedura „${h.name}” jest już zdefiniowana`, h.nameTok)
    const def: ProcDef = {
      name: h.name,
      params: h.params,
      body: [],
      tok: defTok,
      need: h.params.map(() => new Set<Kind>()),
      fwd: [],
      calls: [],
    }
    this.procs.set(h.name, def)
    this.i = h.next
    for (;;) {
      const t = this.toks[this.i]
      if (!t) fail(`Brak „już” kończącego procedurę „${h.name}”`, defTok)
      if (isEnd(t)) {
        if (!(t.first && t.last)) fail('„już” musi stać samo w osobnej linii', t)
        this.i++
        return
      }
      def.body.push(this.statement(def))
    }
  }

  private statement(proc: ProcDef | null): Node {
    const t = this.toks[this.i]
    switch (t.t) {
      case 'bad':
        return fail(t.msg!, t)
      case 'lb':
        return fail('Nieoczekiwany znak „[” – nawiasy służą tylko do ciała polecenia „powtórz”', t)
      case 'rb':
        return fail('Nieoczekiwany znak „]” bez pasującego „[”', t)
      case 'comma':
        return fail('Nieoczekiwany przecinek', t)
      case 'str':
        return fail('Nieoczekiwany tekst w cudzysłowie – kolor podaje się po poleceniu „kolor”', t)
    }
    const w = norm(t.text)
    if (DEF_START.has(w))
      return fail('Definicje procedur są dozwolone tylko na najwyższym poziomie (nie wewnątrz powtórzenia ani procedury)', t)
    if (DEF_END.has(w)) return fail(`„${t.text}” bez pasującego „oto”`, t)
    const op = KEYWORDS.get(w)
    if (op) {
      this.i++
      return this.command(op, t, proc)
    }
    if (this.arity.has(w)) {
      this.i++
      return this.call(w, t, proc)
    }
    return fail(`Nieznane polecenie „${t.text}”`, t)
  }

  private command(op: Op, cmd: Tok, proc: ProcDef | null): Node {
    const toks = this.toks
    if (op === 'pu' || op === 'pd') return { k: 'cmd', op, tok: cmd }
    if (op === 'color') {
      const t = toks[this.i]
      if (!t || t.t === 'rb' || isEnd(t)) return fail('Brak koloru po poleceniu „kolor” (np. "#16866a")', cmd)
      if (t.t === 'bad') return fail(t.msg!, t)
      if (t.t !== 'str') return fail(`Oczekiwano koloru w cudzysłowie, np. "#16866a", a jest „${t.text}”`, t)
      if (!/^#[0-9a-f]{6}$/i.test(t.text))
        return fail(`Niepoprawny kolor "${t.text}" – oczekiwano formatu "#rrggbb"`, t)
      this.i++
      return { k: 'cmd', op, color: t.text.toLowerCase(), tok: cmd }
    }
    if (op === 'repeat') {
      const count = this.numArg(cmd, proc, 'r')
      const lb = toks[this.i]
      if (!lb || lb.t !== 'lb') return fail('Oczekiwano „[” po liczbie powtórzeń', lb ?? cmd)
      if (++this.bd > LIMITS.depth) fail(`Zbyt głębokie zagnieżdżenie nawiasów (maksymalnie ${LIMITS.depth})`, lb)
      this.i++
      const body: Node[] = []
      for (;;) {
        const t = toks[this.i]
        if (!t || isEnd(t)) fail('Brak zamykającego „]” dla tego „[”', lb)
        if (t.t === 'rb') {
          this.i++
          break
        }
        body.push(this.statement(proc))
      }
      this.bd--
      return { k: 'rep', count, body, tok: cmd }
    }
    if ((op === 'up' || op === 'down') && this.mode === '2d')
      return fail(`Polecenie „${cmd.text}” działa tylko w trybie 3D`, cmd)
    return { k: 'cmd', op, arg: this.numArg(cmd, proc, op === 'width' ? 'w' : null), tok: cmd }
  }

  private paramIndex(t: Tok, proc: ProcDef | null) {
    return proc ? proc.params.indexOf(norm(t.text.replace(/^:/, ''))) : -1
  }

  private numArg(cmd: Tok, proc: ProcDef | null, kind: Kind | null): Arg {
    const t = this.toks[this.i]
    if (!t || t.t === 'rb' || isEnd(t)) return fail(`Brak argumentu po poleceniu „${cmd.text}”`, cmd)
    if (t.t === 'bad') return fail(t.msg!, t)
    if (t.t === 'word') {
      if (NUM_RE.test(t.text)) {
        const v = Number(t.text)
        if (!Number.isFinite(v)) return fail('Liczba jest zbyt duża', t)
        checkLit(kind, v, t)
        this.i++
        return { lit: v, tok: t }
      }
      const p = this.paramIndex(t, proc)
      if (p >= 0) {
        this.i++
        if (kind) proc!.need[p].add(kind)
        return { p, tok: t }
      }
      if (t.text.startsWith(':')) return fail(`Nieznany parametr „${t.text}”`, t)
    }
    return fail(`Oczekiwano liczby, a jest „${t.text}”`, t)
  }

  private call(name: string, tok: Tok, proc: ProcDef | null): Node {
    const n = this.arity.get(name)!
    const args: Arg[] = []
    const arityFail = (at: Tok, more = false): never =>
      fail(`Procedura „${tok.text}” wymaga ${n} ${pluralArg(n)}, a podano ${more ? 'więcej' : args.length}`, at)
    for (let k = 0; k < n; k++) {
      const t = this.toks[this.i]
      if (t && t.t === 'word') {
        if (NUM_RE.test(t.text)) {
          const v = Number(t.text)
          if (!Number.isFinite(v)) fail('Liczba jest zbyt duża', t)
          args.push({ lit: v, tok: t })
          this.i++
          continue
        }
        const p = this.paramIndex(t, proc)
        if (p >= 0) {
          args.push({ p, tok: t })
          this.i++
          continue
        }
        const w = norm(t.text)
        if (t.text.startsWith(':')) fail(`Nieznany parametr „${t.text}”`, t)
        if (!KEYWORDS.has(w) && !this.arity.has(w) && !DEF_START.has(w) && !DEF_END.has(w))
          fail(`Niepoprawny argument „${t.text}” – oczekiwano liczby`, t)
      }
      arityFail(tok)
    }
    const extra = this.toks[this.i]
    if (extra && extra.t === 'word' && NUM_RE.test(extra.text)) arityFail(extra, true)
    const node: CallNode = { k: 'call', name, args, tok }
    this.allCalls.push(node)
    if (proc) {
      proc.calls.push(node)
      args.forEach((a, idx) => {
        if ('p' in a) proc.fwd.push({ from: a.p, call: node, idx })
      })
    }
    return node
  }

  private finish() {
    for (const c of this.allCalls) c.proc = this.procs.get(c.name)!
    // recursion
    const reaches = (from: ProcDef, target: ProcDef, seen = new Set<ProcDef>()): boolean => {
      if (from === target) return true
      if (seen.has(from)) return false
      seen.add(from)
      return from.calls.some((c) => reaches(c.proc!, target, seen))
    }
    let bad: { tok: Tok; msg: string } | null = null
    for (const p of this.procs.values())
      for (const c of p.calls)
        if (reaches(c.proc!, p)) {
          const t = c.tok
          if (!bad || t.line < bad.tok.line || (t.line === bad.tok.line && t.col < bad.tok.col))
            bad = {
              tok: t,
              msg:
                c.proc === p
                  ? `Procedura „${p.name}” wywołuje samą siebie – rekurencja jest niedozwolona`
                  : `Wywołanie „${c.tok.text}” w procedurze „${p.name}” tworzy rekurencję, która jest niedozwolona`,
            }
        }
    if (bad) fail(bad.msg, bad.tok)
    // propagate "this parameter ends up as a width / repeat count" through calls
    for (let changed = true; changed; ) {
      changed = false
      for (const p of this.procs.values())
        for (const e of p.fwd)
          for (const k of e.call.proc!.need[e.idx])
            if (!p.need[e.from].has(k)) {
              p.need[e.from].add(k)
              changed = true
            }
    }
    for (const c of this.allCalls)
      c.args.forEach((a, k) => {
        if ('lit' in a) for (const kind of c.proc!.need[k]) checkLit(kind, a.lit, a.tok)
      })
  }
}

export function compile(source: string, mode: Mode): { program: Program; error: null } | { program: null; error: LogoError } {
  try {
    return { program: new Parser(lex(source), mode).parse(), error: null }
  } catch (e) {
    return { program: null, error: toError(e) }
  }
}

// ---------- machine ----------

const trig = (deg: number): [number, number] => {
  const a = ((deg % 360) + 360) % 360
  if (a % 90 === 0) {
    const q = a / 90
    return [[1, 0, -1, 0][q], [0, 1, 0, -1][q]]
  }
  const r = (a * Math.PI) / 180
  return [Math.cos(r), Math.sin(r)]
}
const fmt = (v: number) => v + 0

export class Machine {
  segments: Seg[] = []
  pos: Vec = [0, 0, 0]
  h: Vec = [0, 1, 0]
  r: Vec = [1, 0, 0]
  u: Vec = [0, 0, 1]
  pen = true
  color = '#16866a'
  width = 3
  ops = 0
  finished = false
  error: LogoError | null = null
  /** token (line/col) of the command executed last */
  last: { line: number; col: number } | null = null
  private gen: Generator<Tok>

  constructor(private program: Program) {
    this.gen = this.exec(program.main, [], 0)
  }

  step(): 'ok' | 'done' | 'error' {
    if (this.finished) return this.error ? 'error' : 'done'
    try {
      const r = this.gen.next()
      if (r.done) {
        this.finished = true
        return 'done'
      }
      this.last = r.value
      return 'ok'
    } catch (e) {
      this.error = toError(e)
      this.finished = true
      return 'error'
    }
  }

  private tick(t: Tok) {
    if (++this.ops > LIMITS.ops) fail(`Przekroczono limit ${LIMITS.ops} wykonanych operacji`, t)
  }

  private val(a: Arg, env: number[]) {
    return 'lit' in a ? a.lit : env[a.p]
  }

  private *exec(nodes: Node[], env: number[], depth: number): Generator<Tok> {
    for (const node of nodes) {
      if (node.k === 'cmd') {
        this.tick(node.tok)
        this.apply(node, env)
        yield node.tok
      } else if (node.k === 'rep') {
        this.tick(node.tok)
        const n = this.val(node.count, env)
        if (n > 0 && depth + 1 > LIMITS.depth)
          fail(`Przekroczono maksymalną głębokość zagnieżdżenia (${LIMITS.depth})`, node.tok)
        for (let i = 0; i < n; i++) yield* this.exec(node.body, env, depth + 1)
      } else {
        this.tick(node.tok)
        if (depth + 1 > LIMITS.depth)
          fail(`Przekroczono maksymalną głębokość zagnieżdżenia (${LIMITS.depth})`, node.tok)
        yield* this.exec(node.proc!.body, node.args.map((a) => this.val(a, env)), depth + 1)
      }
    }
  }

  private rotate(a: Vec, b: Vec, deg: number) {
    const [c, s] = trig(deg)
    for (let k = 0; k < 3; k++) {
      const x = a[k]
      const y = b[k]
      a[k] = x * c + y * s
      b[k] = y * c - x * s
    }
  }

  private apply(node: Extract<Node, { k: 'cmd' }>, env: number[]) {
    const v = node.arg ? this.val(node.arg, env) : 0
    switch (node.op) {
      case 'fd':
      case 'bk': {
        const d = node.op === 'fd' ? v : -v
        const to: Vec = [fmt(this.pos[0] + this.h[0] * d), fmt(this.pos[1] + this.h[1] * d), fmt(this.pos[2] + this.h[2] * d)]
        if (to.some((c) => !(Math.abs(c) <= LIMITS.coord)))
          fail(`Współrzędna poza dozwolonym zakresem ±${LIMITS.coord}`, node.tok)
        if (this.pen && d !== 0) {
          if (this.segments.length >= LIMITS.segments)
            fail(`Przekroczono limit ${LIMITS.segments} narysowanych odcinków`, node.tok)
          this.segments.push({ from: [...this.pos], to: [...to], color: this.color, width: this.width })
        }
        this.pos = to
        break
      }
      case 'rt': this.rotate(this.h, this.r, v); break
      case 'lt': this.rotate(this.h, this.r, -v); break
      case 'up': this.rotate(this.h, this.u, v); break
      case 'down': this.rotate(this.h, this.u, -v); break
      case 'pu': this.pen = false; break
      case 'pd': this.pen = true; break
      case 'color': this.color = node.color!; break
      case 'width': this.width = v; break
    }
  }
}

export function runProgram(source: string, mode: Mode): { segments: Seg[]; error: LogoError | null } {
  const c = compile(source, mode)
  if (c.error) return { segments: [], error: c.error }
  const m = new Machine(c.program)
  while (m.step() === 'ok');
  return { segments: m.segments, error: m.error }
}
