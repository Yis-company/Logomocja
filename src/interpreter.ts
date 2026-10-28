export type Mode = '2d' | '3d';
export type Vec = [number, number, number];
export interface Segment { from: Vec; to: Vec; color: string; width: number }
export interface LogoError { message: string; line: number; column: number }
export interface Result { segments: Segment[]; error: LogoError | null }
export interface Turtle { position: Vec; heading: Vec; right: Vec; up: Vec; pen: boolean; color: string; width: number }
type Token = { value: string; kind: 'name' | 'number' | 'string' | 'symbol' | 'eof'; line: number; column: number; start: number; end: number };
type Expr = { type: 'number'; value: number; token: Token } | { type: 'name'; name: string; token: Token } | { type: 'rep'; token: Token } | { type: 'unary'; op: string; value: Expr; token: Token } | { type: 'binary'; op: string; left: Expr; right: Expr; token: Token };
type Argument = { expr: Expr; token: Token };
type Condition = { left: Argument; right: Argument; op: string };
type Node = { kind: string; token: Token; arg?: Argument; name?: string; color?: string; body?: Node[]; otherwise?: Node[]; condition?: Condition; args?: Argument[] };
type Procedure = { name: string; token: Token; params: string[]; tokens: Token[]; locals: Set<string>; body: Node[] };
type Program = { body: Node[]; procedures: Map<string, Procedure>; globals: Set<string> };

export const aliases: Record<string, string> = Object.create(null);
const groups: Record<string, string> = {
  fd: 'np naprzod naprzód fd forward', bk: 'ws wstecz bk back', rt: 'pw prawo rt right', lt: 'lw lewo lt left',
  pu: 'pod podnies podnieś pu penup', pd: 'opu opusc opuść pd pendown', color: 'kolor color', width: 'grubosc grubość width',
  repeat: 'powtorz powtórz repeat', let: 'niech let', if: 'jeśli jesli if', ifelse: 'jeżeli jezeli ifelse', stop: 'stop',
  home: 'dom home', clear: 'czyść czysc cs clearscreen', pitch: 'gora góra pitchup', pitchdown: 'dol dół pitchdown',
  roll: 'pp przechylprawo rr rollright', rollleft: 'pl przechyllewo rl rollleft', to: 'oto to', end: 'już juz end', rep: 'nrpowt repcount',
};
for (const [command, names] of Object.entries(groups)) for (const name of names.split(' ')) aliases[name] = command;
const canonical = (t: Token) => t.kind === 'name' ? aliases[t.value] : undefined;
class Fault extends Error {
  detail: LogoError;
  constructor(message: string, token: Pick<Token, 'line' | 'column'>) {
    super(message); this.detail = { message, line: token.line, column: token.column };
  }
}
function fail(message: string, token: Token): never { throw new Fault(message, token); }

function tokenize(source: string): Token[] {
  let i = 0, line = 1, column = 1;
  const tokens: Token[] = [];
  const advance = () => { if (source[i++] === '\n') { line++; column = 1; } else column++; };
  if (source.length > 50000) {
    for (; i < 50000;) advance();
    throw new Fault('Program przekracza limit 50 000 znaków.', { line, column });
  }
  while (i < source.length) {
    if (/\s/u.test(source[i])) { advance(); continue; }
    if (source[i] === ';') { while (i < source.length && source[i] !== '\n') advance(); continue; }
    const token: Token = { value: '', kind: 'symbol', line, column, start: i, end: i };
    const rest = source.slice(i);
    if (/^[\d.]/u.test(rest)) {
      const match = rest.match(/^(?:\d+(?:\.\d+)?|\.\d+)/u);
      if (!match || /[\p{L}\p{N}_.]/u.test(rest[match[0].length] || ' ')) fail('Niepoprawna liczba. Użyj zapisu dziesiętnego, np. 80 lub 12.5.', token);
      token.kind = 'number'; token.value = match[0];
    } else if (/^[\p{L}_]/u.test(rest)) {
      token.kind = 'name'; token.value = rest.match(/^[\p{L}_][\p{L}\p{N}_]*/u)![0];
    } else if (source[i] === '"') {
      token.kind = 'string';
      const match = rest.match(/^"[^"\n\r]*"/u);
      if (!match) fail('Niezamknięty napis. Kolor zapisz np. "#16866a".', token);
      token.value = match[0];
    } else {
      token.value = rest.match(/^(?:<=|>=|<>|[+\-*/<>=\[\](),:])/u)?.[0] || '';
      if (!token.value) fail(`Nieznany znak „${source[i]}”.`, token);
    }
    const length = token.value.length;
    for (let n = 0; n < length; n++) advance();
    token.value = token.value.toLocaleLowerCase('pl'); token.end = i;
    tokens.push(token);
    if (tokens.length > 10000) fail('Program przekracza limit 10 000 tokenów.', token);
  }
  tokens.push({ value: '', kind: 'eof', start: i, end: i, line, column });
  return tokens;
}
function validName(token: Token, procedures?: Map<string, Procedure>, parameter = false) {
  if (token.kind !== 'name' || aliases[token.value] || (!parameter && procedures?.has(token.value)))
    fail('Oczekiwano nazwy, która nie jest poleceniem ani nazwą procedury.', token);
}
function declarations(tokens: Token[], procedures: Map<string, Procedure>, params: string[] = []): Set<string> {
  const names = new Set<string>();
  for (let i = 0; i < tokens.length - 1; i++) if (canonical(tokens[i]) === 'let') {
    if (tokens[i + 1].kind === 'eof') fail('Po „niech” podaj nazwę zmiennej i jej wartość.', tokens[i]);
    validName(tokens[i + 1], procedures, params.includes(tokens[i + 1].value)); names.add(tokens[i + 1].value);
  }
  return names;
}
function extract(tokens: Token[], source: string): { tokens: Token[]; procedures: Map<string, Procedure> } {
  const top: Token[] = [], procedures = new Map<string, Procedure>();
  let depth = 0;
  for (let i = 0; i < tokens.length;) {
    const token = tokens[i];
    if (canonical(token) !== 'to' || depth !== 0) {
      top.push(token); if (token.value === '[') depth++; if (token.value === ']') depth--;
      i++; continue;
    }
    const lineStart = source.lastIndexOf('\n', token.start - 1) + 1;
    if (source.slice(lineStart, token.start).trim()) fail('Definicja „oto” musi zaczynać się na początku wiersza.', token);
    // Keep a statement boundary so arguments cannot accidentally span a definition.
    top.push({ ...token, kind: 'symbol', value: '$definition' });
    const header: Token[] = [];
    i++;
    while (tokens[i].kind !== 'eof' && tokens[i].line === token.line) header.push(tokens[i++]);
    const name = header.shift();
    if (!name) fail('Po „oto” podaj nazwę procedury.', token);
    validName(name);
    if (procedures.has(name.value)) fail(`Procedura „${name.value}” jest już zdefiniowana.`, name);
    const params: string[] = [];
    const addParam = (p: Token) => {
      validName(p, undefined, true);
      if (params.includes(p.value)) fail(`Parametr „${p.value}” występuje dwa razy.`, p);
      params.push(p.value);
    };
    if (header.length) {
      if (header[0].value === 'ma' && header[1]?.value === ':') {
        let h = 2;
        if (!header[h]) fail('Po „ma:” podaj parametry rozdzielone przecinkami.', header[1]);
        while (h < header.length) {
          addParam(header[h++]);
          if (h < header.length) {
            if (header[h].value !== ',') fail('Parametry po „ma:” rozdziel przecinkami.', header[h]);
            const comma = header[h++];
            if (!header[h]) fail('Po przecinku podaj nazwę parametru.', comma);
          }
        }
      } else {
        for (let h = 0; h < header.length;) {
          if (header[h].value !== ':') fail('Użyj nagłówka „oto nazwa ma: parametr” lub „oto nazwa :parametr”.', header[h]);
          const colon = header[h++];
          if (!header[h]) fail('Po dwukropku podaj nazwę parametru.', colon);
          addParam(header[h++]);
        }
      }
    }
    const body: Token[] = [];
    while (tokens[i].kind !== 'eof' && canonical(tokens[i]) !== 'end') {
      if (canonical(tokens[i]) === 'to') fail('Procedurę można zdefiniować tylko na najwyższym poziomie programu.', tokens[i]);
      body.push(tokens[i++]);
    }
    if (tokens[i].kind === 'eof') fail(`Brakuje „już” kończącego procedurę „${name.value}”.`, token);
    const end = tokens[i];
    if (tokens[i - 1].line === end.line || tokens[i + 1]?.line === end.line && tokens[i + 1]?.kind !== 'eof')
      fail('„już” musi być samo w swoim wierszu.', end);
    body.push({ ...end, kind: 'eof', value: '' });
    procedures.set(name.value, { name: name.value, token, params, tokens: body, locals: new Set(), body: [] });
    i++;
  }
  return { tokens: top, procedures };
}
function literal(expr: Expr): boolean {
  const pending = [expr];
  while (pending.length) {
    const e = pending.pop()!;
    if (e.type === 'name' || e.type === 'rep') return false;
    if (e.type === 'unary') pending.push(e.value);
    if (e.type === 'binary') pending.push(e.left, e.right);
  }
  return true;
}
type Environment = { globals: Map<string, number>; locals?: Map<string, number>; localNames?: Set<string> };
function value(expr: Expr, env: Environment, rep: number | undefined): number {
  const pending: { expr: Expr; ready: boolean }[] = [{ expr, ready: false }], values: number[] = [];
  while (pending.length) {
    const task = pending.pop()!, e = task.expr;
    if (!task.ready && (e.type === 'unary' || e.type === 'binary')) {
      pending.push({ expr: e, ready: true });
      if (e.type === 'unary') pending.push({ expr: e.value, ready: false });
      else pending.push({ expr: e.right, ready: false }, { expr: e.left, ready: false });
      continue;
    }
    let result: number;
    if (e.type === 'number') result = e.value;
    else if (e.type === 'rep') result = rep!;
    else if (e.type === 'name') {
      const map = env.locals?.has(e.name) ? env.locals : env.globals;
      if (!map.has(e.name)) fail(`Zmienna „${e.name}” nie ma jeszcze wartości na tej ścieżce programu.`, e.token);
      result = map.get(e.name)!;
    } else if (e.type === 'unary') result = (e.op === '-' ? -1 : 1) * values.pop()!;
    else {
      const b = values.pop()!, a = values.pop()!;
      if (e.op === '/' && b === 0) fail('Nie można dzielić przez zero.', e.token);
      result = e.op === '+' ? a + b : e.op === '-' ? a - b : e.op === '*' ? a * b : a / b;
    }
    if (!Number.isFinite(result)) fail('Wynik wyrażenia nie jest liczbą skończoną.', e.token);
    values.push(result);
  }
  return values[0];
}
function argumentValue(arg: Argument, env: Environment, rep?: number): number {
  try { return value(arg.expr, env, rep); }
  catch (e) { if (e instanceof Fault) throw new Fault(e.message, arg.token); throw e; }
}
function checkRange(kind: string, n: number, token: Token) {
  if (kind === 'width' && (!Number.isInteger(n) || n < 1 || n > 12)) fail('Grubość musi być liczbą całkowitą od 1 do 12.', token);
  if (kind === 'repeat' && (!Number.isInteger(n) || n < 0 || n > 10000)) fail('Liczba powtórzeń musi być całkowita, od 0 do 10 000.', token);
}
class Parser {
  i = 0;
  constructor(private tokens: Token[], private source: string, private mode: Mode, private procedures: Map<string, Procedure>, private names: Set<string>, private params = new Set<string>()) {}
  peek() { return this.tokens[this.i]; }
  take() { return this.tokens[this.i++]; }
  expression(fallback: Token, repDepth: number): Expr {
    // Explicit stacks keep valid, deeply parenthesized expressions independent of JS call-stack limits.
    const values: Expr[] = [], ops: { token: Token; kind: 'unary' | 'binary' | 'open' }[] = [];
    let operand = true, parens = 0;
    const precedence = (op: string) => ['+', '-'].includes(op) ? 1 : ['*', '/'].includes(op) ? 2 : 0;
    const apply = () => {
      const op = ops.pop()!, token = op.token;
      if (op.kind === 'unary') values.push({ type: 'unary', op: token.value, value: values.pop()!, token });
      else { const right = values.pop()!, left = values.pop()!; values.push({ type: 'binary', op: token.value, left, right, token }); }
    };
    const signs = () => { while (ops.at(-1)?.kind === 'unary') apply(); };
    while (true) {
      let token = this.peek();
      if (operand) {
        if (token.kind === 'eof') fail('Brakuje argumentu polecenia.', fallback);
        if (token.value === '+' || token.value === '-') { ops.push({ token: this.take(), kind: 'unary' }); continue; }
        if (token.value === '(') { ops.push({ token: this.take(), kind: 'open' }); parens++; continue; }
        if (token.kind === 'number') values.push({ type: 'number', value: Number(token.value), token });
        else {
          if (token.value === ':') { this.take(); token = this.peek(); }
          if (token.kind !== 'name') fail('Oczekiwano wyrażenia: liczby, zmiennej lub nawiasu.', token.kind === 'eof' ? fallback : token);
          if (canonical(token) === 'rep') {
            if (!repDepth) fail('„nrpowt” jest dostępne tylko wewnątrz leksykalnego ciała „powtorz”.', token);
            values.push({ type: 'rep', token });
          } else {
            if (canonical(token)) fail(`Brakuje argumentu. W tym miejscu znaleziono polecenie „${token.value}”.`, token);
            if (!this.names.has(token.value)) fail(`Nieznana zmienna „${token.value}”. Zadeklaruj ją poleceniem „niech”.`, token);
            values.push({ type: 'name', name: token.value, token });
          }
        }
        this.take(); operand = false; signs(); continue;
      }
      if (token.value === ')' && parens) {
        while (ops.at(-1)?.kind !== 'open') apply();
        ops.pop(); parens--; this.take(); signs(); continue;
      }
      const prec = precedence(token.value);
      const balanced = /\s/u.test(this.source[token.start - 1] || '') === /\s/u.test(this.source[token.end] || '');
      if (prec && balanced) {
        while (ops.at(-1)?.kind === 'binary' && precedence(ops.at(-1)!.token.value) >= prec) apply();
        ops.push({ token: this.take(), kind: 'binary' }); operand = true; continue;
      }
      if (parens) fail('Brakuje zamykającego nawiasu „)”.', token.kind === 'eof' ? ops.slice().reverse().find(op => op.kind === 'open')!.token : token);
      break;
    }
    while (ops.length) apply();
    return values[0];
  }
  argument(command: Token, rep: number): Argument {
    const token = this.peek().kind === 'eof' ? command : this.peek();
    return { token, expr: this.expression(command, rep) };
  }
  block(command: Token, depth: number, rep: number): Node[] {
    if (this.peek().value !== '[') fail('Oczekiwano ciała polecenia w nawiasach „[ … ]”.', this.peek().kind === 'eof' ? command : this.peek());
    const open = this.take();
    if (depth >= 32) fail('Przekroczono limit 32 poziomów zagnieżdżenia nawiasów.', open);
    const body = this.list(depth + 1, rep);
    if (this.peek().value !== ']') fail('Brakuje zamykającego nawiasu „]”.', open);
    this.take(); return body;
  }
  list(depth = 0, rep = 0): Node[] {
    const nodes: Node[] = [];
    while (this.peek().kind !== 'eof' && (this.peek().value !== ']' || depth === 0)) {
      const token = this.take(), kind = canonical(token);
      if (token.value === '$definition') continue;
      if (kind === 'to' || kind === 'end') fail('Definicje procedur są dozwolone tylko na najwyższym poziomie, w osobnych wierszach.', token);
      if (this.mode === '2d' && ['pitch', 'pitchdown', 'roll', 'rollleft'].includes(kind || '')) fail('To polecenie działa tylko w trybie 3D. Przełącz na „Przestrzeń”.', token);
      const node: Node = { kind: kind || 'call', token };
      if (['fd', 'bk', 'rt', 'lt', 'width', 'pitch', 'pitchdown', 'roll', 'rollleft', 'repeat'].includes(kind || '')) {
        node.arg = this.argument(token, rep);
        if ((kind === 'width' || kind === 'repeat') && literal(node.arg.expr)) {
          let n: number | undefined;
          // Arithmetic faults are deliberately deferred until execution.
          try { n = argumentValue(node.arg, { globals: new Map() }); } catch (e) { if (!(e instanceof Fault)) throw e; }
          if (n !== undefined) checkRange(kind, n, node.arg.token);
        }
        if (kind === 'repeat') node.body = this.block(token, depth, rep + 1);
      } else if (kind === 'let') {
        const name = this.peek(); validName(name, this.procedures, this.params.has(name.value)); this.take(); node.name = name.value; node.arg = this.argument(token, rep);
      } else if (kind === 'color') {
        const color = this.peek();
        if (color.kind !== 'string' || !/^"#[\da-f]{6}"$/u.test(color.value)) fail('Kolor musi mieć postać „"#16866a"”: sześć cyfr szesnastkowych w cudzysłowie.', color.kind === 'eof' ? token : color);
        this.take(); node.color = color.value.slice(1, -1);
      } else if (kind === 'if' || kind === 'ifelse') {
        const left = this.argument(token, rep), op = this.peek();
        if (!['<', '>', '=', '<=', '>=', '<>'].includes(op.value)) fail('W warunku użyj porównania: <, >, =, <=, >= lub <>.', op.kind === 'eof' ? token : op);
        this.take(); node.condition = { left, op: op.value, right: this.argument(token, rep) };
        node.body = this.block(token, depth, rep);
        if (kind === 'ifelse') node.otherwise = this.block(token, depth, rep);
      } else if (['pu', 'pd', 'home', 'clear', 'stop'].includes(kind || '')) {
        // Commands without arguments.
      } else if (token.kind === 'name' && this.procedures.has(token.value)) {
        node.name = token.value; node.args = this.procedures.get(token.value)!.params.map(() => this.argument(token, rep));
      } else {
        fail(token.kind === 'name' ? `Nieznane polecenie „${token.value}”. Sprawdź pisownię w słowniku.` : `Nieoczekiwany token „${token.value}”. W tym miejscu powinno być polecenie.`, token);
      }
      nodes.push(node);
    }
    return nodes;
  }
}
function parse(source: string, mode: Mode): Program {
  const parts = extract(tokenize(source), source);
  const globals = declarations(parts.tokens, parts.procedures);
  for (const proc of parts.procedures.values()) {
    proc.locals = declarations(proc.tokens, parts.procedures, proc.params);
    proc.params.forEach(p => proc.locals.add(p));
    proc.body = new Parser(proc.tokens, source, mode, parts.procedures, new Set([...globals, ...proc.locals]), new Set(proc.params)).list();
  }
  const body = new Parser(parts.tokens, source, mode, parts.procedures, globals).list();
  return { body, procedures: parts.procedures, globals };
}
export const initialTurtle = (): Turtle => ({ position: [0, 0, 0], heading: [0, 1, 0], right: [1, 0, 0], up: [0, 0, 1], pen: true, color: '#16866a', width: 3 });
const combine = (a: Vec, b: Vec, x: number, y: number): Vec => a.map((v, i) => v * x + b[i] * y) as Vec;
const normalize = (a: Vec): Vec => { const len = Math.hypot(...a); return a.map(v => Math.abs(v / len) < 1e-14 ? 0 : v / len) as Vec; };
const STOP = Symbol('stop');
export class Execution {
  segments: Segment[] = [];
  turtle = initialTurtle();
  error: LogoError | null = null;
  done = false;
  operations = 0;
  current: { line: number; column: number } | null = null;
  private frames = 0;
  private iterator?: Generator<Node>;
  constructor(source: string, mode: Mode) {
    try { const program = parse(source, mode); this.iterator = this.execute(program); }
    catch (e) { if (!(e instanceof Fault)) throw e; this.error = e.detail; this.done = true; }
  }
  private tick(token: Token) {
    this.operations++;
    if (this.operations > 10000) fail('Przekroczono limit 10 000 wykonanych operacji.', token);
  }
  private enter(token: Token) {
    if (++this.frames > 32) fail('Przekroczono limit 32 aktywnych wywołań procedur i powtórzeń.', token);
  }
  private move(to: Vec, token: Token) {
    if (to.some(v => !Number.isFinite(v) || Math.abs(v) > 100000)) fail('Współrzędne żółwia muszą mieścić się w przedziale od −100 000 do 100 000.', token);
    const from = this.turtle.position;
    if (this.turtle.pen && to.some((v, i) => v !== from[i])) {
      if (this.segments.length >= 10000) fail('Przekroczono limit 10 000 zachowanych odcinków.', token);
      this.segments.push({ from: [...from], to: [...to], color: this.turtle.color, width: this.turtle.width });
    }
    this.turtle.position = to;
  }
  private *execute(program: Program): Generator<Node> {
    const self = this;
    function* list(nodes: Node[], env: Environment, rep?: number): Generator<Node> {
      for (const node of nodes) {
        self.tick(node.token);
        const t = self.turtle, n = node.arg ? argumentValue(node.arg, env, rep) : 0;
        switch (node.kind) {
          case 'fd': case 'bk': self.move(combine(t.position, t.heading, 1, node.kind === 'bk' ? -n : n), node.arg!.token); break;
          case 'home': self.move([0, 0, 0], node.token); t.heading = [0, 1, 0]; t.right = [1, 0, 0]; t.up = [0, 0, 1]; break;
          case 'rt': case 'lt': case 'pitch': case 'pitchdown': case 'roll': case 'rollleft': {
            const sign = ['lt', 'pitchdown', 'rollleft'].includes(node.kind) ? -1 : 1;
            const angle = (n % 360) * Math.PI / 180 * sign, c = Math.cos(angle), s = Math.sin(angle);
            if (['rt', 'lt'].includes(node.kind)) {
              const h = t.heading; t.heading = normalize(combine(h, t.right, c, s)); t.right = normalize(combine(t.right, h, c, -s));
            } else if (['pitch', 'pitchdown'].includes(node.kind)) {
              const h = t.heading; t.heading = normalize(combine(h, t.up, c, s)); t.up = normalize(combine(t.up, h, c, -s));
            } else {
              const u = t.up; t.up = normalize(combine(u, t.right, c, s)); t.right = normalize(combine(t.right, u, c, -s));
            }
            break;
          }
          case 'pu': t.pen = false; break;
          case 'pd': t.pen = true; break;
          case 'color': t.color = node.color!; break;
          case 'width': checkRange('width', n, node.arg!.token); t.width = n; break;
          case 'clear': self.segments.length = 0; break;
          case 'let': (env.locals || env.globals).set(node.name!, n); break;
          case 'stop': yield node; throw STOP;
          case 'repeat': {
            checkRange('repeat', n, node.arg!.token); self.enter(node.token); yield node;
            try { for (let i = 1; i <= n; i++) { yield* list(node.body!, env, i); self.tick(node.token); } }
            finally { self.frames--; }
            continue;
          }
          case 'if': case 'ifelse': {
            const condition = node.condition!, a = argumentValue(condition.left, env, rep), b = argumentValue(condition.right, env, rep);
            const holds = condition.op === '=' ? a === b : condition.op === '<>' ? a !== b : condition.op === '<' ? a < b : condition.op === '>' ? a > b : condition.op === '<=' ? a <= b : a >= b;
            const body = holds ? node.body : node.otherwise;
            yield node;
            if (body) { yield* list(body, env, rep); self.tick(node.token); }
            continue;
          }
          case 'call': {
            const proc = program.procedures.get(node.name!)!, locals = new Map<string, number>();
            proc.params.forEach((name, i) => locals.set(name, argumentValue(node.args![i], env, rep)));
            self.enter(node.token); yield node;
            try { yield* list(proc.body, { globals: env.globals, locals, localNames: proc.locals }); }
            catch (e) { if (e !== STOP) throw e; }
            finally { self.frames--; }
            self.tick(node.token); continue;
          }
        }
        yield node;
      }
    }
    try { yield* list(program.body, { globals: new Map() }); }
    catch (e) { if (e !== STOP) throw e; }
  }
  step(): void {
    if (this.done) return;
    try {
      const next = this.iterator!.next(); this.done = !!next.done;
      if (!next.done) this.current = { line: next.value.token.line, column: next.value.token.column };
    } catch (e) {
      if (!(e instanceof Fault)) throw e;
      this.error = e.detail; this.current = { line: e.detail.line, column: e.detail.column }; this.done = true;
    }
  }
  finish(): Result { while (!this.done) this.step(); return { segments: this.segments, error: this.error }; }
}
export function run(source: string, mode: Mode = '2d'): Result { return new Execution(source, mode).finish(); }
