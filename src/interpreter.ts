export type Mode = "2d" | "3d";
export type Vec = [number, number, number];
export type Segment = { from: Vec; to: Vec; color: string; width: number };
export type Issue = { message: string; line: number; column: number };
export type Token = {
  value: string;
  line: number;
  column: number;
  start: number;
  end: number;
  kind: string;
};
export const aliases: Record<string, string> = {};
const groups: Record<string, string> = {
  fd: "np naprzod naprzód fd forward",
  bk: "ws wstecz bk back",
  rt: "pw prawo rt right",
  lt: "lw lewo lt left",
  pu: "pod podnies podnieś pu penup",
  pd: "opu opusc opuść pd pendown",
  color: "kolor color",
  width: "grubosc grubość width",
  repeat: "powtorz powtórz repeat",
  let: "niech let",
  if: "jeśli jesli if",
  ifelse: "jeżeli jezeli ifelse",
  stop: "stop",
  home: "dom home",
  clear: "czyść czysc cs clearscreen",
  pitch: "gora góra pitchup",
  down: "dol dół pitchdown",
  roll: "pp przechylprawo rr rollright",
  unroll: "pl przechyllewo rl rollleft",
  to: "oto to",
  end: "już juz end",
  rep: "nrpowt repcount",
};
for (const [key, words] of Object.entries(groups))
  for (const word of words.split(" ")) aliases[word] = key;
export class LogoError extends Error {
  line: number;
  column: number;
  constructor(message: string, t: Token) {
    super(message);
    this.line = t.line;
    this.column = t.column;
  }
  issue(): Issue {
    return { message: this.message, line: this.line, column: this.column };
  }
}
const fail = (message: string, t: Token): never => {
  throw new LogoError(message, t);
};
export function tokenize(source: string): Token[] {
  const out: Token[] = [];
  let p = 0,
    line = 1,
    column = 1;
  const add = (
    value: string,
    kind: string,
    start: number,
    l: number,
    c: number,
  ) => {
    out.push({ value, kind, start, end: p, line: l, column: c });
    if (out.length > 10000)
      fail("Przekroczono limit 10 000 tokenów.", out.at(-1)!);
  };
  if (source.length > 50000)
    fail("Program przekracza 50 000 znaków.", { line: 1, column: 1 } as Token);
  while (p < source.length) {
    const ch = source[p];
    if (/\s/.test(ch)) {
      p++;
      if (ch === "\n") {
        line++;
        column = 1;
      } else column++;
      continue;
    }
    if (ch === ";") {
      while (p < source.length && source[p] !== "\n") {
        p++;
        column++;
      }
      continue;
    }
    const start = p,
      l = line,
      c = column;
    let value = "",
      kind = "";
    if (ch === '"') {
      value = ch;
      p++;
      column++;
      while (p < source.length && source[p] !== '"' && source[p] !== "\n") {
        value += source[p++];
        column++;
      }
      if (source[p] === '"') {
        value += '"';
        p++;
        column++;
      }
      kind = "string";
    } else if (/[\d.]/.test(ch)) {
      while (p < source.length && /[\p{L}\p{N}_.]/u.test(source[p])) {
        value += source[p++];
        column++;
      }
      kind = /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ? "number" : "invalid";
    } else if (/[\p{L}_:]/u.test(ch)) {
      while (p < source.length && /[\p{L}\p{N}_:]/u.test(source[p])) {
        value += source[p++];
        column++;
      }
      kind = "name";
    } else {
      value = ch;
      p++;
      column++;
      if (/[<>=]/.test(ch) && ["<=", ">=", "<>"].includes(ch + source[p])) {
        value += source[p++];
        column++;
      }
      kind = "symbol";
    }
    add(value, kind, start, l, c);
  }
  out.push({ value: "EOF", line, column, start: p, end: p, kind: "eof" });
  return out;
}
type Expr = {
  type: "num" | "name" | "rep" | "unary" | "binary";
  token: Token;
  value?: number;
  name?: string;
  op?: string;
  left?: Expr;
  right?: Expr;
};
type Cmd = {
  op: string;
  token: Token;
  args: Expr[];
  body?: Cmd[];
  other?: Cmd[];
  name?: string;
  color?: string;
  compare?: string;
};
type Proc = {
  name: string;
  token: Token;
  params: string[];
  body: Cmd[];
  locals: Set<string>;
};
type Program = { body: Cmd[]; procs: Map<string, Proc> };
const norm = (s: string) => s.replace(/^:/, "").toLowerCase();
const validName = (t: Token) =>
  t.kind === "name" && /^[\p{L}_][\p{L}\p{N}_]*$/u.test(norm(t.value));
class Parser {
  tokens: Token[];
  i = 0;
  procs = new Map<string, Proc>();
  globals = new Set<string>();
  current?: Proc;
  depth = 0;
  repeat = 0;
  constructor(
    public source: string,
    public mode: Mode,
  ) {
    this.tokens = tokenize(source);
  }
  peek() {
    return this.tokens[this.i];
  }
  take() {
    return this.tokens[this.i++];
  }
  error(message: string, t = this.peek()): never {
    return fail(message, t);
  }
  parse(): Program {
    // Read all headers first; forward calls and variable declarations are legal.
    const top: Token[] = [];
    let topDepth = 0;
    for (let i = 0; i < this.tokens.length; ) {
      const t = this.tokens[i];
      if (aliases[norm(t.value)] === "to") {
        if (topDepth > 0)
          this.error(
            "Definicje procedur są dozwolone tylko na głównym poziomie.",
            t,
          );
        if (this.tokens.slice(0, i).at(-1)?.line === t.line)
          this.error("Definicja „oto” musi zaczynać linię.", t);
        const header: Token[] = [];
        let j = i + 1;
        while (
          j < this.tokens.length &&
          this.tokens[j].line === t.line &&
          this.tokens[j].kind !== "eof"
        )
          header.push(this.tokens[j++]);
        const name = header.shift();
        if (
          !name ||
          !validName(name) ||
          name.value.startsWith(":") ||
          aliases[norm(name.value)]
        )
          this.error("Podaj poprawną nazwę procedury.", name || t);
        const key = norm(name.value);
        if (this.procs.has(key))
          this.error("Procedura „" + key + "” jest już zdefiniowana.", name);
        const params: string[] = [];
        if (header.length) {
          if (norm(header[0].value) === "ma:") {
            header.shift();
            if (!header.length) this.error("Po „ma:” podaj parametry.", name);
            let expect = true;
            for (const h of header) {
              if (expect) {
                if (
                  !validName(h) ||
                  h.value.startsWith(":") ||
                  aliases[norm(h.value)]
                )
                  this.error("Niepoprawny parametr.", h);
                params.push(norm(h.value));
              } else if (h.value !== ",")
                this.error("Oddziel parametry przecinkiem.", h);
              expect = !expect;
            }
            if (expect)
              this.error("Brak parametru po przecinku.", header.at(-1)!);
          } else
            for (const h of header) {
              if (
                !h.value.startsWith(":") ||
                !validName(h) ||
                aliases[norm(h.value)]
              )
                this.error("Użyj „ma: bok, kąt” albo „:bok :kąt”.", h);
              params.push(norm(h.value));
            }
        }
        if (new Set(params).size !== params.length)
          this.error("Nazwy parametrów muszą być różne.", name);
        const body: Token[] = [];
        let ended = false;
        for (; j < this.tokens.length; j++) {
          const b = this.tokens[j];
          if (aliases[norm(b.value)] === "to")
            this.error("Nie można zagnieżdżać definicji.", b);
          if (aliases[norm(b.value)] === "end") {
            if (
              this.tokens[j - 1]?.line === b.line ||
              (this.tokens[j + 1]?.line === b.line &&
                this.tokens[j + 1].kind !== "eof")
            )
              this.error("„już” musi być samo w linii.", b);
            ended = true;
            j++;
            break;
          }
          if (b.kind === "eof") break;
          body.push(b);
        }
        if (!ended) this.error("Brak „już” kończącego procedurę.", t);
        const proc: Proc = {
          name: key,
          token: t,
          params,
          body: [],
          locals: new Set(),
        };
        (proc as any).raw = body;
        this.procs.set(key, proc);
        i = j;
      } else {
        if (t.value === "[") topDepth++;
        if (t.value === "]") topDepth--;
        top.push(t);
        i++;
      }
    }
    const collect = (ts: Token[], set: Set<string>) => {
      for (let i = 0; i < ts.length; i++)
        if (aliases[norm(ts[i].value)] === "let") {
          const n = ts[i + 1];
          if (n && validName(n)) set.add(norm(n.value));
        }
    };
    collect(top, this.globals);
    for (const p of this.procs.values()) collect((p as any).raw, p.locals);
    for (const set of [
      this.globals,
      ...[...this.procs.values()].map((p) => p.locals),
    ])
      for (const n of set)
        if (aliases[n] || this.procs.has(n))
          this.error(
            "Zmienna nie może mieć nazwy polecenia ani procedury.",
            this.tokens.find((t) => norm(t.value) === n)!,
          );
    const eof = this.tokens.at(-1)!;
    for (const p of this.procs.values()) {
      this.current = p;
      this.tokens = [...(p as any).raw, eof];
      this.i = 0;
      this.repeat = 0;
      this.depth = 0;
      p.body = this.sequence(false);
    }
    this.current = undefined;
    this.tokens = top.at(-1)?.kind === "eof" ? top : [...top, eof];
    this.i = 0;
    this.repeat = 0;
    this.depth = 0;
    return { body: this.sequence(false), procs: this.procs };
  }
  sequence(bracket: boolean): Cmd[] {
    const out: Cmd[] = [];
    while (this.peek().kind !== "eof" && this.peek().value !== "]")
      out.push(this.command());
    if (bracket) {
      if (this.peek().value !== "]")
        this.error("Brak zamykającego nawiasu „]”.");
      this.take();
    } else if (this.peek().value === "]") this.error("Nadmiarowy nawias „]”.");
    return out;
  }
  block(isRepeat = false): Cmd[] {
    const t = this.take();
    if (t.value !== "[") this.error("Oczekiwano „[” rozpoczynającego blok.", t);
    if (++this.depth > 32) this.error("Przekroczono 32 poziomy nawiasów.", t);
    if (isRepeat) this.repeat++;
    const b = this.sequence(true);
    if (isRepeat) this.repeat--;
    this.depth--;
    return b;
  }
  expr(command: Token): Expr {
    const values: Expr[] = [],
      ops: { token: Token; kind: "unary" | "binary" | "group" }[] = [];
    let operand = true,
      groups = 0;
    const precedence = (v: string) => (v === "*" || v === "/" ? 2 : 1);
    const reduce = () => {
      const op = ops.pop()!;
      if (op.kind === "unary") {
        const right = values.pop()!;
        values.push({
          type: "unary",
          token: op.token,
          op: op.token.value,
          right,
        });
      } else {
        const right = values.pop()!,
          left = values.pop()!;
        values.push({
          type: "binary",
          token: left.token,
          op: op.token.value,
          left,
          right,
        });
      }
    };
    const unary = () => {
      while (ops.at(-1)?.kind === "unary") reduce();
    };
    for (;;) {
      const t = this.peek();
      if (operand) {
        if (t.kind === "eof") this.error("Brak argumentu polecenia.", command);
        if (t.value === "+" || t.value === "-") {
          this.take();
          ops.push({ token: t, kind: "unary" });
          continue;
        }
        if (t.value === "(") {
          this.take();
          ops.push({ token: t, kind: "group" });
          groups++;
          continue;
        }
        let e: Expr;
        if (t.kind === "number") {
          this.take();
          e = { type: "num", token: t, value: Number(t.value) };
        } else if (t.kind === "name") {
          const n = norm(t.value);
          if (aliases[n] === "rep") {
            if (!this.repeat)
              this.error("„nrpowt” można użyć tylko wewnątrz powtórzenia.", t);
            this.take();
            e = { type: "rep", token: t };
          } else if (
            this.globals.has(n) ||
            this.current?.params.includes(n) ||
            this.current?.locals.has(n)
          ) {
            this.take();
            e = { type: "name", token: t, name: n };
          } else
            this.error(
              "Nieznana nazwa „" + t.value + "” lub brak argumentu.",
              t,
            );
        } else this.error("Oczekiwano liczby, zmiennej lub wyrażenia.", t);
        values.push(e);
        operand = false;
        unary();
        continue;
      }
      if (["+", "-", "*", "/"].includes(t.value)) {
        const before = /\s/.test(this.source[t.start - 1] || ""),
          after = /\s/.test(this.source[t.end] || "");
        if (before !== after) {
          if (groups)
            this.error(
              "Operator wymaga odstępów z obu stron albo z żadnej.",
              t,
            );
          break;
        }
        while (
          ops.at(-1)?.kind === "binary" &&
          precedence(ops.at(-1)!.token.value) >= precedence(t.value)
        )
          reduce();
        this.take();
        ops.push({ token: t, kind: "binary" });
        operand = true;
        continue;
      }
      if (t.value === ")" && groups) {
        while (ops.at(-1)?.kind !== "group") reduce();
        const group = ops.pop()!;
        const v = values.pop()!;
        values.push({ ...v, token: group.token });
        groups--;
        this.take();
        unary();
        continue;
      }
      if (groups) this.error("Oczekiwano zamykającego nawiasu „)”.", t);
      break;
    }
    while (ops.length) reduce();
    return values[0];
  }
  command(): Cmd {
    const t = this.take(),
      name = t.value.toLowerCase(),
      op = aliases[name] || "call";
    const c: Cmd = { op, token: t, args: [] };
    if (t.value === "[" || ["to", "end", "rep"].includes(op))
      this.error("To polecenie nie może wystąpić w tym miejscu.", t);
    if (op === "call") {
      const p = this.procs.get(name);
      if (!p)
        this.error(
          t.kind === "number" || t.kind === "symbol"
            ? "W tym miejscu oczekiwano polecenia."
            : "Nieznane polecenie „" + t.value + "”.",
          t,
        );
      c.name = name;
      for (const [i] of p.params.entries()) {
        if (
          i > 0 &&
          this.peek().kind !== "eof" &&
          this.tokens[this.i - 1].end === this.peek().start
        )
          this.error("Oddziel argumenty procedury białym znakiem.");
        c.args.push(this.expr(t));
      }
      return c;
    }
    if (["pitch", "down", "roll", "unroll"].includes(op) && this.mode === "2d")
      this.error("To polecenie działa tylko w trybie 3D.", t);
    if (op === "let") {
      const n = this.take();
      if (
        !validName(n) ||
        n.value.startsWith(":") ||
        aliases[norm(n.value)] ||
        this.procs.has(norm(n.value))
      )
        this.error("Podaj poprawną nazwę zmiennej.", n);
      c.name = norm(n.value);
      c.args = [this.expr(t)];
    } else if (op === "color") {
      const n = this.take();
      if (!/^"#[0-9a-f]{6}"$/i.test(n.value))
        this.error(
          'Kolor zapisz jako sześć cyfr hex, np. "#16866a".',
          n.kind === "eof" ? t : n,
        );
      c.color = n.value.slice(1, -1).toLowerCase();
    } else if (["if", "ifelse"].includes(op)) {
      c.args.push(this.expr(t));
      const cmp = this.take();
      if (!["<", ">", "=", "<=", ">=", "<>"].includes(cmp.value))
        this.error("Oczekiwano porównania: <, >, =, <=, >= lub <>.", cmp);
      c.compare = cmp.value;
      c.args.push(this.expr(t));
      c.body = this.block();
      if (op === "ifelse") c.other = this.block();
    } else if (op === "repeat") {
      c.args = [this.expr(t)];
      this.staticCheck(c);
      c.body = this.block(true);
    } else if (
      [
        "fd",
        "bk",
        "rt",
        "lt",
        "width",
        "pitch",
        "down",
        "roll",
        "unroll",
      ].includes(op)
    ) {
      c.args = [this.expr(t)];
      this.staticCheck(c);
    }
    return c;
  }
  staticCheck(c: Cmd) {
    if (!["width", "repeat"].includes(c.op)) return;
    const a = c.args[0];
    if (hasName(a)) return;
    try {
      checkRange(c.op, evaluate(a, new Map(), new Map(), 0, a.token), a.token);
    } catch (e) {
      if (e instanceof LogoError && /zero|skończon/.test(e.message)) return;
      throw e;
    }
  }
}
function hasName(e: Expr): boolean {
  const pending = [e];
  while (pending.length) {
    const x = pending.pop()!;
    if (x.type === "name" || x.type === "rep") return true;
    if (x.left) pending.push(x.left);
    if (x.right) pending.push(x.right);
  }
  return false;
}
function evaluate(
  e: Expr,
  local: Map<string, number>,
  global: Map<string, number>,
  rep: number,
  at: Token,
): number {
  const work: { e: Expr; done: boolean }[] = [{ e, done: false }],
    values: number[] = [];
  while (work.length) {
    const { e: x, done } = work.pop()!;
    let n: number;
    if (!done && (x.type === "binary" || x.type === "unary")) {
      work.push({ e: x, done: true });
      if (x.right) work.push({ e: x.right, done: false });
      if (x.left) work.push({ e: x.left, done: false });
      continue;
    }
    if (x.type === "num") n = x.value!;
    else if (x.type === "rep") n = rep;
    else if (x.type === "name") {
      if (local.has(x.name!)) n = local.get(x.name!)!;
      else if (global.has(x.name!)) n = global.get(x.name!)!;
      else return fail("Zmienna „" + x.name + "” nie ma jeszcze wartości.", at);
    } else if (x.type === "unary") n = (x.op === "-" ? -1 : 1) * values.pop()!;
    else {
      const b = values.pop()!,
        a = values.pop()!;
      if (x.op === "/" && b === 0) fail("Nie można dzielić przez zero.", at);
      n =
        x.op === "+"
          ? a + b
          : x.op === "-"
            ? a - b
            : x.op === "*"
              ? a * b
              : a / b;
    }
    if (!Number.isFinite(n)) fail("Wynik musi być liczbą skończoną.", at);
    values.push(n);
  }
  return values[0];
}
function checkRange(op: string, n: number, t: Token) {
  if (op === "width" && (!Number.isInteger(n) || n < 1 || n > 12))
    fail("Grubość musi być liczbą całkowitą od 1 do 12.", t);
  if (op === "repeat" && (!Number.isInteger(n) || n < 0 || n > 10000))
    fail("Liczba powtórzeń musi być całkowita, od 0 do 10 000.", t);
}
const trig = (n: number) => (Math.abs(n) < 1e-15 ? 0 : n);
export type Turtle = {
  position: Vec;
  heading: Vec;
  right: Vec;
  up: Vec;
  pen: boolean;
  color: string;
  width: number;
};
const initial = (): Turtle => ({
  position: [0, 0, 0],
  heading: [0, 1, 0],
  right: [1, 0, 0],
  up: [0, 0, 1],
  pen: true,
  color: "#16866a",
  width: 3,
});
const mix = (a: Vec, b: Vec, c: number, s: number): Vec =>
  a.map((v, i) => {
    return v * c + b[i] * s;
  }) as Vec;
export class Execution {
  segments: Segment[] = [];
  error: Issue | null = null;
  turtle = initial();
  done = false;
  line = 0;
  operations = 0;
  iterator: Generator<number>;
  global = new Map<string, number>();
  frames = 0;
  program?: Program;
  constructor(source: string, mode: Mode) {
    try {
      this.program = new Parser(source, mode).parse();
      this.iterator = this.walk(this.program.body, new Map(), false, 0);
    } catch (e) {
      this.error = this.issue(e);
      this.done = true;
      this.iterator = (function* () {})();
    }
  }
  issue(e: unknown): Issue {
    return e instanceof LogoError
      ? e.issue()
      : {
          message: "Nie udało się wykonać programu: " + String(e),
          line: 1,
          column: 1,
        };
  }
  tick(t: Token) {
    if (++this.operations > 10000)
      fail("Przekroczono limit 10 000 wykonanych operacji.", t);
    this.line = t.line;
  }
  enter(t: Token) {
    if (++this.frames > 32)
      fail("Przekroczono 32 aktywne wywołania i powtórzenia.", t);
  }
  move(d: number, t: Token) {
    const a = this.turtle.position,
      b = mix(a, this.turtle.heading, 1, d);
    if (b.some((n) => !Number.isFinite(n) || Math.abs(n) > 100000))
      fail("Współrzędna przekracza zakres ±100 000.", t);
    if (this.turtle.pen && b.some((v, i) => v !== a[i])) {
      if (this.segments.length >= 10000)
        fail("Przekroczono limit 10 000 odcinków.", t);
      this.segments.push({
        from: [...a],
        to: [...b],
        color: this.turtle.color,
        width: this.turtle.width,
      });
    }
    this.turtle.position = b;
  }
  *walk(
    body: Cmd[],
    local: Map<string, number>,
    inProc: boolean,
    rep: number,
  ): Generator<number, boolean> {
    for (const c of body) {
      this.tick(c.token);
      const a = c.args.map((e) =>
        evaluate(e, local, this.global, rep, e.token),
      );
      const n = a[0],
        t = this.turtle;
      checkRange(c.op, n, c.args[0]?.token || c.token);
      switch (c.op) {
        case "fd":
        case "bk":
          this.move(n * (c.op === "bk" ? -1 : 1), c.token);
          break;
        case "rt":
        case "lt": {
          const r = (((n % 360) * Math.PI) / 180) * (c.op === "lt" ? -1 : 1),
            h = t.heading;
          t.heading = mix(h, t.right, trig(Math.cos(r)), trig(Math.sin(r)));
          t.right = mix(t.right, h, trig(Math.cos(r)), -trig(Math.sin(r)));
          break;
        }
        case "pitch":
        case "down": {
          const r = (((n % 360) * Math.PI) / 180) * (c.op === "down" ? -1 : 1),
            h = t.heading;
          t.heading = mix(h, t.up, trig(Math.cos(r)), trig(Math.sin(r)));
          t.up = mix(t.up, h, trig(Math.cos(r)), -trig(Math.sin(r)));
          break;
        }
        case "roll":
        case "unroll": {
          const r =
              (((n % 360) * Math.PI) / 180) * (c.op === "unroll" ? -1 : 1),
            u = t.up;
          t.up = mix(u, t.right, trig(Math.cos(r)), trig(Math.sin(r)));
          t.right = mix(t.right, u, trig(Math.cos(r)), -trig(Math.sin(r)));
          break;
        }
        case "pu":
          t.pen = false;
          break;
        case "pd":
          t.pen = true;
          break;
        case "color":
          t.color = c.color!;
          break;
        case "width":
          t.width = n;
          break;
        case "let":
          (inProc ? local : this.global).set(c.name!, n);
          break;
        case "clear":
          this.segments = [];
          break;
        case "home": {
          const p = t.position;
          const h = t.heading;
          t.heading = p.map((v) => -v) as Vec;
          this.move(1, c.token);
          t.heading = h;
          Object.assign(t, {
            position: [0, 0, 0],
            heading: [0, 1, 0],
            right: [1, 0, 0],
            up: [0, 0, 1],
          });
          break;
        }
        case "stop":
          yield c.token.line;
          return true;
        case "repeat": {
          yield c.token.line;
          this.enter(c.token);
          for (let i = 1; i <= n; i++) {
            if (yield* this.walk(c.body!, local, inProc, i)) {
              this.frames--;
              return true;
            }
            this.tick(c.token);
            yield c.token.line;
          }
          this.frames--;
          continue;
        }
        case "if":
        case "ifelse": {
          const yes =
            c.compare === "<"
              ? a[0] < a[1]
              : c.compare === ">"
                ? a[0] > a[1]
                : c.compare === "="
                  ? a[0] === a[1]
                  : c.compare === "<="
                    ? a[0] <= a[1]
                    : c.compare === ">="
                      ? a[0] >= a[1]
                      : a[0] !== a[1];
          yield c.token.line;
          const block = yes ? c.body : c.other;
          if (block) {
            if (yield* this.walk(block, local, inProc, rep)) return true;
            this.tick(c.token);
            yield c.token.line;
          }
          continue;
        }
        case "call": {
          const p = this.program!.procs.get(c.name!)!;
          const vars = new Map<string, number>();
          p.params.forEach((v, i) => vars.set(v, a[i]));
          yield c.token.line;
          this.enter(c.token);
          yield* this.walk(p.body, vars, true, 0);
          this.frames--;
          this.tick(c.token);
          yield c.token.line;
          continue;
        }
      }
      yield c.token.line;
    }
    return false;
  }
  step() {
    if (this.done) return;
    try {
      const r = this.iterator.next();
      this.done = !!r.done;
      if (!r.done) this.line = r.value;
    } catch (e) {
      this.error = this.issue(e);
      this.done = true;
    }
  }
  finish() {
    while (!this.done) this.step();
    return { segments: this.segments, error: this.error };
  }
}
export function run(source: string, mode: Mode = "2d") {
  return new Execution(source, mode).finish();
}
