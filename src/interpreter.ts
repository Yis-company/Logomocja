export type Vec = [number, number, number];
export type Segment = { from: Vec; to: Vec; color: string; width: number };
type Tok = {
  v: string;
  line: number;
  column: number;
  start: number;
  end: number;
};
export class LogoError extends Error {
  line: number;
  column: number;
  constructor(message: string, t: Tok) {
    super(message);
    this.line = t.line;
    this.column = t.column;
  }
}
const groups: Record<string, string[]> = {
  fd: ["np", "naprzod", "naprzód", "fd", "forward"],
  bk: ["ws", "wstecz", "bk", "back"],
  rt: ["pw", "prawo", "rt", "right"],
  lt: ["lw", "lewo", "lt", "left"],
  pu: ["pod", "podnies", "podnieś", "pu", "penup"],
  pd: ["opu", "opusc", "opuść", "pd", "pendown"],
  color: ["kolor", "color"],
  width: ["grubosc", "grubość", "width"],
  repeat: ["powtorz", "powtórz", "repeat"],
  let: ["niech", "let"],
  if: ["jeśli", "jesli", "if"],
  ifelse: ["jeżeli", "jezeli", "ifelse"],
  stop: ["stop"],
  home: ["dom", "home"],
  cs: ["czyść", "czysc", "cs", "clearscreen"],
  pitch: ["gora", "góra", "pitchup"],
  down: ["dol", "dół", "pitchdown"],
  roll: ["pp", "przechylprawo", "rr", "rollright"],
  unroll: ["pl", "przechyllewo", "rl", "rollleft"],
  to: ["oto", "to"],
  end: ["już", "juz", "end"],
};
export const aliases = Object.fromEntries(
  Object.entries(groups).flatMap(([k, vs]) => vs.map((v) => [v, k])),
);
const fail = (m: string, t: Tok): never => {
  throw new LogoError(m, t);
};
const nameOK = (s: string) => /^[\p{L}_][\p{L}\p{N}_]*$/u.test(s);
function lex(s: string) {
  let ts: Tok[] = [],
    i = 0,
    line = 1,
    column = 1;
  const origin = { v: "", line: 1, column: 1, start: 0, end: 0 };
  if (s.length > 50000) fail("Przekroczono limit 50 000 znaków.", origin);
  while (i < s.length) {
    let ch = s[i];
    if (/\s/.test(ch)) {
      i++;
      if (ch === "\n") {
        line++;
        column = 1;
      } else column++;
      continue;
    }
    if (ch === ";") {
      while (i < s.length && s[i] !== "\n") {
        i++;
        column++;
      }
      continue;
    }
    let start = i,
      c = column,
      l = line,
      v = "";
    if (ch === '"') {
      v += s[i++];
      while (i < s.length && s[i] !== '"' && s[i] !== "\n") v += s[i++];
      if (s[i] === '"') v += s[i++];
    } else if (/[\[\](),+*/=<>-]/.test(ch)) {
      v = s[i++];
      if (/[<>]/.test(ch) && /[=>]/.test(s[i] || "!")) v += s[i++];
    } else {
      while (i < s.length && !/[\s;\[\](),+*/=<>-]/.test(s[i])) v += s[i++];
    }
    column += i - start;
    ts.push({ v: v.toLowerCase(), line: l, column: c, start, end: i });
    if (ts.length > 10000)
      fail("Przekroczono limit 10 000 tokenów.", ts.at(-1)!);
  }
  return ts;
}
type Expr = { t: Tok; kind: string; value?: any; a?: Expr; b?: Expr };
type Node = {
  t: Tok;
  cmd: string;
  args: Expr[];
  body?: Node[];
  other?: Node[];
  name?: string;
};
type Proc = {
  t: Tok;
  name: string;
  params: string[];
  tokens: Tok[];
  body: Node[];
  locals: Set<string>;
};
export function compile(source: string, mode: string) {
  const tokens = lex(source),
    procs = new Map<string, Proc>(),
    top: Tok[] = [];
  let i = 0,
    level = 0;
  while (i < tokens.length) {
    let t = tokens[i];
    if (t.v === "[") level++;
    if (t.v === "]") level--;
    if (aliases[t.v] === "to") {
      if (level !== 0)
        fail("Definicje są dozwolone tylko na najwyższym poziomie.", t);
      if (tokens[i - 1]?.line === t.line)
        fail("Definicja musi zaczynać wiersz.", t);
      let header: Tok[] = [];
      i++;
      while (i < tokens.length && tokens[i].line === t.line)
        header.push(tokens[i++]);
      let n = header.shift();
      if (
        !n ||
        !nameOK(n.v) ||
        aliases[n.v] ||
        procs.has(n.v) ||
        ["nrpowt", "repcount"].includes(n.v)
      )
        fail("Nieprawidłowa lub powtórzona nazwa procedury.", n || t);
      let params: string[] = [];
      if (header[0]?.v === "ma:") {
        header.shift();
        let want = true;
        for (const h of header) {
          if (want) {
            if (!nameOK(h.v) || aliases[h.v])
              fail("Oczekiwano nazwy parametru.", h);
            params.push(h.v);
          } else if (h.v !== ",") fail("Oddziel parametry przecinkiem.", h);
          want = !want;
        }
        if (want) fail("Brakuje parametru.", header.at(-1) || t);
      } else
        for (const h of header) {
          if (!/^:[\p{L}_][\p{L}\p{N}_]*$/u.test(h.v) || aliases[h.v.slice(1)])
            fail("Użyj ma: parametr lub :parametr.", h);
          params.push(h.v.slice(1));
        }
      if (new Set(params).size !== params.length)
        fail("Parametry muszą mieć różne nazwy.", t);
      let body: Tok[] = [];
      while (i < tokens.length && aliases[tokens[i].v] !== "end") {
        if (aliases[tokens[i].v] === "to")
          fail("Nie można zagnieżdżać definicji procedur.", tokens[i]);
        body.push(tokens[i++]);
      }
      if (i === tokens.length) fail("Brakuje zakończenia „już”.", t);
      let end = tokens[i++];
      if (tokens[i]?.line === end.line || tokens[i - 2]?.line === end.line)
        fail("„już” musi być samo w wierszu.", end);
      procs.set(n.v, {
        t,
        name: n.v,
        params,
        tokens: body,
        body: [],
        locals: new Set(),
      });
    } else {
      top.push(t);
      i++;
    }
  }
  const declarations = (ts: Tok[]) =>
    new Set(
      ts.filter((t, i) => aliases[ts[i - 1]?.v] === "let").map((t) => t.v),
    );
  const globals = declarations(top);
  for (const p of procs.values()) p.locals = declarations(p.tokens);
  function parse(ts: Tok[], p?: Proc) {
    let at = 0;
    const known = new Set([
      ...globals,
      ...(p?.locals || []),
      ...(p?.params || []),
    ]);
    const peek = () => ts[at];
    const need = (fallback: Tok) => peek() || fallback;
    function expr(fallback: Tok, rep: number, min = 0): Expr {
      let t = peek();
      if (!t) fail("Brakuje argumentu.", fallback);
      let e: Expr;
      if (t.v === "+" || t.v === "-") {
        at++;
        e = { kind: "unary", value: t.v, a: expr(fallback, rep, 3), t };
      } else if (t.v === "(") {
        at++;
        e = expr(t, rep);
        if (peek()?.v !== ")") fail("Brakuje zamykającego nawiasu ).", need(t));
        at++;
        e = { ...e, t };
      } else if (/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(t.v)) {
        at++;
        e = { kind: "number", value: Number(t.v), t };
      } else {
        let n = t.v.replace(/^:/, "");
        if (["nrpowt", "repcount"].includes(n)) {
          if (!rep) fail("nrpowt jest dostępny tylko wewnątrz powtórzenia.", t);
          at++;
          e = { kind: "rep", t };
        } else if (nameOK(n) && known.has(n)) {
          at++;
          e = { kind: "name", value: n, t };
        } else fail("Oczekiwano liczby lub zadeklarowanej zmiennej.", t);
      }
      while (peek() && ["+", "-", "*", "/"].includes(peek().v)) {
        let op = peek(),
          prec = ["*", "/"].includes(op.v) ? 2 : 1;
        let left = /\s/.test(source[op.start - 1] || ""),
          right = /\s/.test(source[op.end] || "");
        if (left !== right || prec < min) break;
        at++;
        e = {
          kind: "binary",
          value: op.v,
          a: e,
          b: expr(op, rep, prec + 1),
          t: e.t,
        };
      }
      return e;
    }
    function body(depth = 0, rep = 0, closing = false): Node[] {
      if (depth > 32)
        fail("Przekroczono głębokość nawiasów (32).", need(ts.at(-1)!));
      let out: Node[] = [];
      while (peek()) {
        let t = peek();
        if (t.v === "]") {
          if (!closing) fail("Nieoczekiwany nawias ].", t);
          at++;
          return out;
        }
        at++;
        let cmd = aliases[t.v] || (procs.has(t.v) ? "call" : "");
        if (!cmd || cmd === "to" || cmd === "end")
          fail(
            cmd === "to"
              ? "Definicje są dozwolone tylko na najwyższym poziomie."
              : `Nieznane polecenie „${t.v}”.`,
            t,
          );
        if (mode === "2d" && ["pitch", "down", "roll", "unroll"].includes(cmd))
          fail("To polecenie działa tylko w trybie 3D.", t);
        let node: Node = { t, cmd, args: [] };
        const arg = () => expr(t, rep);
        const block = (r = rep) => {
          if (peek()?.v !== "[") fail("Oczekiwano nawiasu [.", need(t));
          at++;
          return body(depth + 1, r, true);
        };
        if (
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
          ].includes(cmd)
        )
          node.args = [arg()];
        if (cmd === "let") {
          let n = peek();
          if (
            !n ||
            !nameOK(n.v) ||
            aliases[n.v] ||
            procs.has(n.v) ||
            ["nrpowt", "repcount"].includes(n.v)
          )
            fail("Nieprawidłowa nazwa zmiennej.", need(t));
          at++;
          node.name = n.v;
          node.args = [arg()];
        }
        if (cmd === "color") {
          let c = peek();
          if (!c || !/^"#[0-9a-f]{6}"$/.test(c.v))
            fail('Kolor zapisz jako "#16866a" (sześć cyfr hex).', need(t));
          at++;
          node.name = c.v.slice(1, -1);
        }
        if (cmd === "repeat") {
          node.args = [arg()];
          node.body = block(rep + 1);
        }
        if (cmd === "if" || cmd === "ifelse") {
          let a = arg(),
            op = peek();
          if (!op || !["<", ">", "=", "<=", ">=", "<>"].includes(op.v))
            fail("Oczekiwano porównania, np. > lub =.", need(t));
          at++;
          node.name = op.v;
          node.args = [a, arg()];
          node.body = block();
          if (cmd === "ifelse") node.other = block();
        }
        if (cmd === "call") {
          node.name = t.v;
          for (let j = 0; j < procs.get(t.v)!.params.length; j++)
            node.args.push(arg());
        }
        if (["repeat", "width"].includes(cmd) && constant(node.args[0])) {
          try {
            validate(cmd, evaluate(node.args[0], new Map(), 0), node.args[0].t);
          } catch (e) {
            if (
              e instanceof LogoError &&
              (e.message.includes("zero") || e.message.includes("skończoną"))
            ) {
            } else throw e;
          }
        }
        out.push(node);
      }
      if (closing) fail("Brakuje zamykającego nawiasu ].", ts.at(-1)!);
      return out;
    }
    return body();
  }
  const nodes = parse(top);
  for (const p of procs.values()) p.body = parse(p.tokens, p);
  return { nodes, procs };
}
function constant(e: Expr): boolean {
  return (
    e.kind === "number" ||
    (e.kind === "unary" && constant(e.a!)) ||
    (e.kind === "binary" && constant(e.a!) && constant(e.b!))
  );
}
function evaluate(e: Expr, env: Map<string, number>, rep: number): number {
  let n: number;
  if (e.kind === "number") n = e.value;
  else if (e.kind === "name") {
    if (!env.has(e.value))
      fail(`Zmienna „${e.value}” nie ma jeszcze wartości.`, e.t);
    n = env.get(e.value)!;
  } else if (e.kind === "rep") n = rep;
  else if (e.kind === "unary")
    n = (e.value === "-" ? -1 : 1) * evaluate(e.a!, env, rep);
  else {
    let a = evaluate(e.a!, env, rep),
      b = evaluate(e.b!, env, rep);
    if (e.value === "/" && b === 0) fail("Dzielenie przez zero.", e.t);
    n =
      e.value === "+"
        ? a + b
        : e.value === "-"
          ? a - b
          : e.value === "*"
            ? a * b
            : a / b;
  }
  if (!Number.isFinite(n)) fail("Wynik nie jest skończoną liczbą.", e.t);
  return n;
}
function validate(cmd: string, n: number, t: Tok) {
  if (
    !Number.isInteger(n) ||
    n < (cmd === "width" ? 1 : 0) ||
    n > (cmd === "width" ? 12 : 10000)
  )
    fail(
      cmd === "width"
        ? "Grubość musi być liczbą całkowitą od 1 do 12."
        : "Liczba powtórzeń musi być całkowita od 0 do 10 000.",
      t,
    );
}
const mix = (a: Vec, b: Vec, c: number, s: number): Vec =>
  a.map((v, i) => v * c + b[i] * s) as Vec;
export class Machine {
  segments: Segment[] = [];
  position: Vec = [0, 0, 0];
  heading: Vec = [0, 1, 0];
  right: Vec = [1, 0, 0];
  up: Vec = [0, 0, 1];
  color = "#16866a";
  width = 3;
  pen = true;
  error: any = null;
  line = 0;
  done = false;
  private iterator: Generator;
  private ops = 0;
  private frames = 0;
  constructor(source: string, mode = "2d") {
    try {
      const program = compile(source, mode);
      this.iterator = this.execute(
        program.nodes,
        new Map(),
        program.procs,
        0,
        false,
      );
    } catch (e) {
      this.error = errorObject(e);
      this.done = true;
      this.iterator = (function* () {})();
    }
  }
  private tick(t: Tok) {
    if (++this.ops > 10000) fail("Przekroczono limit 10 000 operacji.", t);
    this.line = t.line;
  }
  private move(d: number, t: Tok) {
    const to = this.position.map((v, i) => v + this.heading[i] * d) as Vec;
    if (to.some((v) => !Number.isFinite(v) || Math.abs(v) > 100000))
      fail("Współrzędna przekracza zakres ±100 000.", t);
    if (this.pen && to.some((v, i) => v !== this.position[i])) {
      if (this.segments.length >= 10000)
        fail("Przekroczono limit 10 000 odcinków.", t);
      this.segments.push({
        from: [...this.position],
        to: [...to],
        color: this.color,
        width: this.width,
      });
    }
    this.position = to;
  }
  private *execute(
    nodes: Node[],
    env: Map<string, number>,
    procs: Map<string, Proc>,
    rep: number,
    local: boolean,
  ): Generator {
    for (const n of nodes) {
      this.tick(n.t);
      const vals = n.args.map((e) => {
          try {
            return evaluate(e, env, rep);
          } catch (err) {
            if (err instanceof LogoError) throw new LogoError(err.message, e.t);
            throw err;
          }
        }),
        v = vals[0],
        rad = ((v % 360) * Math.PI) / 180,
        c = Math.cos(rad),
        s = Math.sin(rad);
      switch (n.cmd) {
        case "fd":
        case "bk":
          this.move(n.cmd === "fd" ? v : -v, n.args[0].t);
          break;
        case "rt":
        case "lt": {
          let h = this.heading,
            r = this.right,
            sg = n.cmd === "rt" ? s : -s;
          this.heading = mix(h, r, c, sg);
          this.right = mix(r, h, c, -sg);
          break;
        }
        case "pitch":
        case "down": {
          let h = this.heading,
            u = this.up,
            sg = n.cmd === "pitch" ? s : -s;
          this.heading = mix(h, u, c, sg);
          this.up = mix(u, h, c, -sg);
          break;
        }
        case "roll":
        case "unroll": {
          let u = this.up,
            r = this.right,
            sg = n.cmd === "roll" ? s : -s;
          this.up = mix(u, r, c, sg);
          this.right = mix(r, u, c, -sg);
          break;
        }
        case "pu":
          this.pen = false;
          break;
        case "pd":
          this.pen = true;
          break;
        case "color":
          this.color = n.name!;
          break;
        case "width":
          validate("width", v, n.args[0].t);
          this.width = v;
          break;
        case "let":
          env.set(n.name!, v);
          break;
        case "cs":
          this.segments = [];
          break;
        case "home": {
          this.heading = this.position.map((x) => -x) as Vec;
          this.move(1, n.t);
          this.heading = [0, 1, 0];
          this.right = [1, 0, 0];
          this.up = [0, 0, 1];
          break;
        }
        case "stop":
          yield n;
          return true;
        case "repeat": {
          validate("repeat", v, n.args[0].t);
          if (++this.frames > 32)
            fail("Przekroczono limit 32 aktywnych wywołań i powtórzeń.", n.t);
          yield n;
          for (let j = 1; j <= v; j++) {
            if (yield* this.execute(n.body!, env, procs, j, local)) {
              this.frames--;
              return true;
            }
            this.tick(n.t);
            yield n;
          }
          this.frames--;
          continue;
        }
        case "if":
        case "ifelse": {
          const a = vals[0],
            b = vals[1],
            ok =
              n.name === "<"
                ? a < b
                : n.name === ">"
                  ? a > b
                  : n.name === "="
                    ? a === b
                    : n.name === "<>"
                      ? a !== b
                      : n.name === "<="
                        ? a <= b
                        : a >= b;
          yield n;
          const chosen = ok ? n.body : n.other;
          if (chosen) {
            if (yield* this.execute(chosen, env, procs, rep, local))
              return true;
            this.tick(n.t);
            yield n;
          }
          continue;
        }
        case "call": {
          if (++this.frames > 32)
            fail("Przekroczono limit 32 aktywnych wywołań i powtórzeń.", n.t);
          const p = procs.get(n.name!)!;
          const scope = new Map<string, number>((this as any).global || env);
          for (const l of p.locals) scope.delete(l);
          p.params.forEach((key, i) => scope.set(key, vals[i]));
          if (!(this as any).global) (this as any).global = env;
          yield n;
          yield* this.execute(p.body, scope, procs, 0, true);
          this.frames--;
          this.tick(n.t);
          break;
        }
      }
      yield n;
    }
    return false;
  }
  step() {
    if (this.done) return;
    try {
      if (this.iterator.next().done) this.done = true;
    } catch (e) {
      this.error = errorObject(e);
      this.done = true;
    }
  }
  run() {
    while (!this.done) this.step();
    return { segments: this.segments, error: this.error };
  }
}
function errorObject(e: any) {
  return {
    message: e.message || "Nieoczekiwany błąd.",
    line: e.line || 1,
    column: e.column || 1,
  };
}
export function run(source: string, mode = "2d") {
  return new Machine(source, mode).run();
}
