export type Mode = "2d" | "3d";
export type Vec = [number, number, number];
export type Segment = { from: Vec; to: Vec; color: string; width: number };
export type LogoError = { message: string; line: number; column: number };
export type Result = { segments: Segment[]; error: LogoError | null };
export type Token = {
  kind: string;
  value: string;
  line: number;
  column: number;
  start: number;
  end: number;
  binary?: boolean;
};
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
  clear: ["czyść", "czysc", "cs", "clearscreen"],
  pitch: ["gora", "góra", "pitchup"],
  down: ["dol", "dół", "pitchdown"],
  roll: ["pp", "przechylprawo", "rr", "rollright"],
  unroll: ["pl", "przechyllewo", "rl", "rollleft"],
  to: ["oto", "to"],
  end: ["już", "juz", "end"],
  count: ["nrpowt", "repcount"],
};
export const aliases = Object.fromEntries(
  Object.entries(groups).flatMap(([key, values]) =>
    values.map((v) => [v, key]),
  ),
);
const lower = (s: string) => s.toLocaleLowerCase("pl");
class Fault extends Error {
  detail: LogoError;
  constructor(message: string, token: Pick<Token, "line" | "column">) {
    super(message);
    this.detail = { message, line: token.line, column: token.column };
  }
}
function fail(message: string, t: Pick<Token, "line" | "column">): never {
  throw new Fault(message, t);
}
const eofToken: Token = {
  kind: "eof",
  value: "",
  line: 1,
  column: 1,
  start: 0,
  end: 0,
};
export function tokenize(source: string): Token[] {
  if (source.length > 50000)
    fail("Program przekracza limit 50 000 znaków.", { line: 1, column: 1 });
  const out: Token[] = [];
  let i = 0,
    line = 1,
    column = 1;
  const advance = (n: number) => {
    for (let j = 0; j < n; j++) {
      if (source[i++] === "\n") {
        line++;
        column = 1;
      } else column++;
    }
  };
  while (i < source.length) {
    const c = source[i];
    if (/\s/.test(c)) {
      advance(1);
      continue;
    }
    if (c === ";") {
      while (i < source.length && source[i] !== "\n") advance(1);
      continue;
    }
    const t: Token = { kind: "", value: "", line, column, start: i, end: i };
    const rest = source.slice(i);
    let value = "";
    if (/\d/.test(c) || (c === "." && /\d/.test(source[i + 1] || ""))) {
      value = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)/)![0];
      t.kind = "number";
      if (/[\p{L}\p{N}_.]/u.test(source[i + value.length] || " "))
        fail("Niepoprawna liczba. Użyj zapisu dziesiętnego, np. 12.5.", t);
    } else if (c === '"') {
      const match = rest.match(/^"[^"\r\n]*"/);
      if (!match) fail('Niedomknięty kolor. Przykład: "#16866a".', t);
      value = match[0];
      t.kind = "string";
      if (!/^"#[\da-f]{6}"$/i.test(value))
        fail('Kolor musi mieć postać "#rrggbb", np. "#16866a".', t);
    } else if (
      /[\p{L}_]/u.test(c) ||
      (c === ":" && /[\p{L}_]/u.test(source[i + 1] || ""))
    ) {
      value = rest.match(/^:?[\p{L}_][\p{L}\p{N}_]*/u)![0];
      t.kind = c === ":" ? "variable" : "word";
    } else if ("[]()+-*/<>=,:".includes(c)) {
      value = rest.match(/^(?:<=|>=|<>)/)?.[0] || c;
      t.kind = "symbol";
      if ("+-*/".includes(c))
        t.binary =
          /\s/.test(source[i - 1] || " ") === /\s/.test(source[i + 1] || " ");
    } else fail(`Nieznany znak „${c}”.`, t);
    t.value = lower(value);
    advance(value.length);
    t.end = i;
    out.push(t);
    if (out.length > 10000) fail("Program przekracza limit 10 000 tokenów.", t);
  }
  out.push({ ...eofToken, start: i, end: i, line, column });
  return out;
}
type Expr = {
  ref?: Token;
  type: "number" | "name" | "count" | "unary" | "binary";
  t: Token;
  value?: number | string;
  left?: Expr;
  right?: Expr;
};
type Node = {
  cmd: string;
  t: Token;
  arg?: Expr;
  arg2?: Expr;
  args?: Expr[];
  name?: string;
  color?: string;
  op?: string;
  body?: Node[];
  other?: Node[];
};
type Procedure = {
  name: string;
  t: Token;
  params: string[];
  bodyTokens: Token[];
  body: Node[];
  locals: Set<string>;
};
type Parsed = {
  body: Node[];
  procedures: Map<string, Procedure>;
  globals: Set<string>;
};
const nameOf = (t: Token) => t.value.replace(/^:/, "");
function validName(
  t: Token,
  procedures?: Map<string, Procedure>,
  parameter = false,
) {
  if (
    !["word", "variable"].includes(t.kind) ||
    aliases[nameOf(t)] ||
    (!parameter && procedures?.has(nameOf(t)))
  )
    fail(
      "Niedozwolona nazwa. Użyj nazwy, która nie jest poleceniem ani procedurą.",
      t,
    );
}
function declared(nodes: Node[], set = new Set<string>()): Set<string> {
  for (const n of nodes) {
    if (n.cmd === "let") set.add(n.name!);
    if (n.body) declared(n.body, set);
    if (n.other) declared(n.other, set);
  }
  return set;
}
function checkNames(nodes: Node[], scope: Set<string>) {
  const visit = (e?: Expr) => {
    const stack = e ? [e] : [];
    while (stack.length) {
      const expr = stack.pop()!;
      if (expr.type === "name" && !scope.has(expr.value as string))
        fail(
          `Nieznana zmienna „${expr.value}”. Zadeklaruj ją poleceniem niech.`,
          expr.ref || expr.t,
        );
      if (expr.right) stack.push(expr.right);
      if (expr.left) stack.push(expr.left);
    }
  };
  for (const n of nodes) {
    visit(n.arg);
    visit(n.arg2);
    n.args?.forEach(visit);
    if (n.body) checkNames(n.body, scope);
    if (n.other) checkNames(n.other, scope);
  }
}
function hasName(e: Expr): boolean {
  const stack = [e];
  while (stack.length) {
    const expr = stack.pop()!;
    if (expr.type === "name" || expr.type === "count") return true;
    if (expr.left) stack.push(expr.left);
    if (expr.right) stack.push(expr.right);
  }
  return false;
}
function calculate(
  e: Expr,
  env: Map<string, number>,
  globals: Map<string, number>,
  count: number,
  anchor = e.t,
): number {
  const stack: { expr: Expr; visited: boolean }[] = [
      { expr: e, visited: false },
    ],
    values: number[] = [];
  while (stack.length) {
    const { expr, visited } = stack.pop()!;
    let result: number;
    if ((expr.type === "unary" || expr.type === "binary") && !visited) {
      stack.push({ expr, visited: true });
      stack.push({ expr: expr.right!, visited: false });
      if (expr.left) stack.push({ expr: expr.left, visited: false });
      continue;
    }
    if (expr.type === "number") result = expr.value as number;
    else if (expr.type === "count") result = count;
    else if (expr.type === "name") {
      const name = expr.value as string,
        value = env.has(name) ? env.get(name) : globals.get(name);
      if (value === undefined)
        fail(`Zmienna „${name}” nie ma jeszcze wartości.`, anchor);
      result = value;
    } else if (expr.type === "unary")
      result = (expr.value === "-" ? -1 : 1) * values.pop()!;
    else {
      const b = values.pop()!,
        a = values.pop()!;
      if (expr.value === "/" && b === 0)
        fail("Nie można dzielić przez zero.", anchor);
      result =
        expr.value === "+"
          ? a + b
          : expr.value === "-"
            ? a - b
            : expr.value === "*"
              ? a * b
              : a / b;
    }
    if (!Number.isFinite(result))
      fail("Wynik wyrażenia nie jest skończoną liczbą.", anchor);
    values.push(result);
  }
  return values[0];
}
function range(cmd: string, value: number, t: Token) {
  if (cmd === "width" && (!Number.isInteger(value) || value < 1 || value > 12))
    fail("Grubość musi być liczbą całkowitą od 1 do 12.", t);
  if (
    cmd === "repeat" &&
    (!Number.isInteger(value) || value < 0 || value > 10000)
  )
    fail("Liczba powtórzeń musi być całkowita, od 0 do 10 000.", t);
}
class Parser {
  i = 0;
  constructor(
    private tokens: Token[],
    private procedures: Map<string, Procedure>,
    private mode: Mode,
    private params = new Set<string>(),
  ) {}
  peek() {
    return this.tokens[this.i] || this.tokens[this.tokens.length - 1];
  }
  take() {
    return this.tokens[this.i++];
  }
  expression(command: Token, repeat: number): Expr {
    const values: Expr[] = [];
    const operators: {
      t: Token;
      kind: "unary" | "binary" | "open";
      precedence: number;
    }[] = [];
    let operand = true,
      parentheses = 0;
    const reduce = () => {
      const op = operators.pop()!,
        right = values.pop()!;
      if (op.kind === "unary")
        values.push({ type: "unary", t: op.t, value: op.t.value, right });
      else {
        const left = values.pop()!;
        values.push({
          type: "binary",
          t: left.t,
          value: op.t.value,
          left,
          right,
        });
      }
    };
    const unary = () => {
      while (operators.at(-1)?.kind === "unary") reduce();
    };
    while (true) {
      const t = this.peek();
      if (operand) {
        if (t.kind === "eof") fail("Brakuje argumentu polecenia.", command);
        if (t.value === "+" || t.value === "-") {
          operators.push({ t: this.take(), kind: "unary", precedence: 3 });
          continue;
        }
        if (t.value === "(") {
          operators.push({ t: this.take(), kind: "open", precedence: 0 });
          parentheses++;
          continue;
        }
        let value: Expr;
        if (t.kind === "number")
          value = { type: "number", t, value: Number(t.value) };
        else if (aliases[t.value] === "count") {
          if (!repeat)
            fail(
              "nrpowt działa wyłącznie wewnątrz powtórzenia zapisanego w tym samym ciele.",
              t,
            );
          value = { type: "count", t };
        } else if (
          (t.kind === "word" || t.kind === "variable") &&
          !aliases[nameOf(t)]
        )
          value = { type: "name", t, ref: t, value: nameOf(t) };
        else fail("Oczekiwano wyrażenia: liczby, zmiennej lub nawiasu.", t);
        this.take();
        values.push(value);
        operand = false;
        unary();
        continue;
      }
      const prec =
        t.value === "+" || t.value === "-"
          ? 1
          : t.value === "*" || t.value === "/"
            ? 2
            : 0;
      if (prec && t.binary) {
        while (operators.length && operators.at(-1)!.precedence >= prec)
          reduce();
        operators.push({ t: this.take(), kind: "binary", precedence: prec });
        operand = true;
        continue;
      }
      if (t.value === ")" && parentheses > 0) {
        while (operators.at(-1)?.kind !== "open") reduce();
        const open = operators.pop()!.t;
        this.take();
        parentheses--;
        values[values.length - 1] = { ...values.at(-1)!, t: open };
        unary();
        continue;
      }
      break;
    }
    if (parentheses) {
      const open = [...operators].reverse().find((op) => op.kind === "open")!.t;
      fail(
        "Brakuje zamykającego nawiasu „)”.",
        this.peek().kind === "eof" ? open : this.peek(),
      );
    }
    while (operators.length) reduce();
    return values[0];
  }
  block(repeat: number, depth: number, anchor: Token): Node[] {
    if (this.peek().value !== "[")
      fail(
        "Oczekiwano bloku w nawiasach [ ... ].",
        this.peek().kind === "eof" ? anchor : this.peek(),
      );
    const open = this.take();
    if (depth >= 32)
      fail("Przekroczono limit 32 poziomów nawiasów kwadratowych.", open);
    const body = this.body(repeat, depth + 1, true);
    if (this.peek().value !== "]")
      fail("Brakuje zamykającego nawiasu „]”.", open);
    this.take();
    return body;
  }
  body(repeat = 0, depth = 0, inBlock = false): Node[] {
    const out: Node[] = [];
    while (
      this.peek().kind !== "eof" &&
      !(inBlock && this.peek().value === "]")
    ) {
      const t = this.take(),
        cmd = aliases[t.value];
      if (cmd === "to" || cmd === "end")
        fail(
          "Definicja procedury jest dozwolona tylko na najwyższym poziomie, od początku linii.",
          t,
        );
      if (t.kind !== "word")
        fail(
          `Nieoczekiwana wartość „${t.value}”. W tym miejscu powinno być polecenie.`,
          t,
        );
      const n: Node = { cmd: cmd || "call", t };
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
      ) {
        if (
          this.mode === "2d" &&
          ["pitch", "down", "roll", "unroll"].includes(cmd)
        )
          fail("To polecenie działa w przestrzeni 3D. Przełącz tryb na 3D.", t);
        n.arg = this.expression(t, repeat);
      } else if (cmd === "color") {
        const color = this.peek();
        if (color.kind !== "string")
          fail(
            'Oczekiwano koloru w postaci "#rrggbb".',
            color.kind === "eof" ? t : color,
          );
        n.color = this.take().value.slice(1, -1);
      } else if (cmd === "let") {
        const name = this.peek();
        if (name.kind === "eof") fail("Brakuje nazwy zmiennej.", t);
        validName(name, this.procedures, this.params.has(nameOf(name)));
        n.name = nameOf(this.take());
        n.arg = this.expression(t, repeat);
      } else if (cmd === "repeat") {
        n.arg = this.expression(t, repeat);
        n.body = this.block(repeat + 1, depth, t);
      } else if (cmd === "if" || cmd === "ifelse") {
        n.arg = this.expression(t, repeat);
        const op = this.peek();
        if (!["<", ">", "=", "<=", ">=", "<>"].includes(op.value))
          fail(
            "Warunek wymaga porównania: <, >, =, <=, >= lub <>.",
            op.kind === "eof" ? t : op,
          );
        n.op = this.take().value;
        n.arg2 = this.expression(t, repeat);
        n.body = this.block(repeat, depth, t);
        if (cmd === "ifelse") n.other = this.block(repeat, depth, t);
      } else if (["pu", "pd", "stop", "home", "clear"].includes(cmd)) {
        /* no arguments */
      } else {
        const proc = this.procedures.get(t.value);
        if (!proc)
          fail(
            `Nieznane polecenie „${t.value}”. Sprawdź pisownię w słowniku.`,
            t,
          );
        n.name = t.value;
        n.args = proc.params.map(() => this.expression(t, repeat));
      }
      if ((cmd === "width" || cmd === "repeat") && !hasName(n.arg!)) {
        let value: number | undefined;
        try {
          value = calculate(n.arg!, new Map(), new Map(), 0);
        } catch {
          /* arithmetic errors happen at run time */
        }
        if (value !== undefined) range(cmd, value, n.arg!.t);
      }
      out.push(n);
    }
    return out;
  }
}
export function parse(source: string, mode: Mode): Parsed {
  const tokens = tokenize(source),
    procedures = new Map<string, Procedure>(),
    main: Token[] = [];
  let bracketDepth = 0;
  for (let i = 0; i < tokens.length; ) {
    const t = tokens[i];
    if (aliases[t.value] === "to" && bracketDepth === 0) {
      if (i > 0 && tokens[i - 1].line === t.line)
        fail("oto musi zaczynać nową linię.", t);
      const header: Token[] = [];
      let j = i + 1;
      while (
        j < tokens.length &&
        tokens[j].line === t.line &&
        tokens[j].kind !== "eof"
      )
        header.push(tokens[j++]);
      const nameToken = header.shift();
      if (!nameToken) fail("Brakuje nazwy procedury.", t);
      validName(nameToken);
      const name = nameOf(nameToken);
      if (procedures.has(name))
        fail(`Procedura „${name}” jest już zdefiniowana.`, nameToken);
      const params: string[] = [];
      if (header.length) {
        if (header[0].value === "ma" && header[1]?.value === ":") {
          header.splice(0, 2);
          if (!header.length)
            fail("Po ma: podaj parametry oddzielone przecinkami.", t);
          while (header.length) {
            const p = header.shift()!;
            validName(p, undefined, true);
            params.push(nameOf(p));
            if (header.length) {
              const comma = header.shift()!;
              if (comma.value !== "," || !header.length)
                fail("Parametry po ma: oddziel przecinkami.", comma);
            }
          }
        } else {
          for (const p of header) {
            if (p.kind !== "variable")
              fail("Użyj nagłówka ma: bok, kąt albo :bok :kąt.", p);
            validName(p, undefined, true);
            params.push(nameOf(p));
          }
        }
      }
      if (new Set(params).size !== params.length)
        fail("Nazwy parametrów nie mogą się powtarzać.", nameToken);
      const start = j;
      while (
        j < tokens.length &&
        aliases[tokens[j].value] !== "end" &&
        tokens[j].kind !== "eof"
      ) {
        if (aliases[tokens[j].value] === "to")
          fail("Nie można definiować procedury wewnątrz procedury.", tokens[j]);
        j++;
      }
      if (tokens[j]?.kind === "eof" || j >= tokens.length)
        fail(`Brakuje „już” kończącego procedurę „${name}”.`, t);
      const end = tokens[j];
      if (
        tokens[j - 1]?.line === end.line ||
        (tokens[j + 1]?.line === end.line && tokens[j + 1]?.kind !== "eof")
      )
        fail("już musi być samo w osobnej linii.", end);
      procedures.set(name, {
        name,
        t,
        params,
        bodyTokens: [...tokens.slice(start, j), { ...end, kind: "eof" }],
        body: [],
        locals: new Set(),
      });
      i = j + 1;
    } else {
      if (t.value === "[") bracketDepth++;
      if (t.value === "]") bracketDepth--;
      main.push(t);
      i++;
    }
  }
  if (main.at(-1)?.kind !== "eof") main.push(tokens.at(-1)!);
  for (const p of procedures.values())
    p.body = new Parser(
      p.bodyTokens,
      procedures,
      mode,
      new Set(p.params),
    ).body();
  const body = new Parser(main, procedures, mode).body(),
    globals = declared(body);
  checkNames(body, globals);
  for (const p of procedures.values()) {
    p.locals = declared(p.body, new Set(p.params));
    checkNames(p.body, new Set([...globals, ...p.locals]));
  }
  return { body, procedures, globals };
}
export type Turtle = {
  position: Vec;
  heading: Vec;
  right: Vec;
  up: Vec;
  pen: boolean;
  color: string;
  width: number;
};
export function initialTurtle(): Turtle {
  return {
    position: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: "#16866a",
    width: 3,
  };
}
class Stop extends Error {}
const combination = (a: Vec, b: Vec, c: number, s: number): Vec =>
  a.map((v, i) => v * c + b[i] * s) as Vec;
export class Session {
  segments: Segment[] = [];
  turtle = initialTurtle();
  error: LogoError | null = null;
  done = false;
  operations = 0;
  current: Token | null = null;
  private parsed?: Parsed;
  private iterator?: Generator<Token>;
  private frames = 0;
  private globals = new Map<string, number>();
  constructor(source: string, mode: Mode) {
    try {
      this.parsed = parse(source, mode);
      this.iterator = this.execute(this.parsed.body, this.globals, []);
    } catch (e) {
      this.error = this.asError(e);
      this.done = true;
    }
  }
  private asError(e: unknown): LogoError {
    return e instanceof Fault
      ? e.detail
      : {
          message:
            "Program jest zbyt złożony do przetworzenia. Uprość wyrażenia.",
          line: this.current?.line || 1,
          column: this.current?.column || 1,
        };
  }
  private tick(t: Token) {
    if (++this.operations > 10000)
      fail("Przekroczono limit 10 000 wykonanych operacji.", t);
  }
  private frame(t: Token) {
    if (++this.frames > 32)
      fail("Przekroczono limit 32 aktywnych wywołań i powtórzeń.", t);
  }
  private move(to: Vec, t: Token) {
    if (to.some((v) => !Number.isFinite(v) || Math.abs(v) > 100000))
      fail(
        "Współrzędne muszą mieścić się w zakresie od −100 000 do 100 000.",
        t,
      );
    if (this.turtle.pen && to.some((v, i) => v !== this.turtle.position[i])) {
      if (this.segments.length >= 10000)
        fail("Przekroczono limit 10 000 zachowanych odcinków.", t);
      this.segments.push({
        from: [...this.turtle.position],
        to: [...to],
        color: this.turtle.color,
        width: this.turtle.width,
      });
    }
    this.turtle.position = to;
  }
  private *execute(
    nodes: Node[],
    env: Map<string, number>,
    counts: number[],
  ): Generator<Token> {
    for (const n of nodes) {
      this.current = n.t;
      this.tick(n.t);
      const val = (e: Expr) =>
        calculate(e, env, this.globals, counts.at(-1) || 0);
      const t = this.turtle;
      if (["fd", "bk"].includes(n.cmd)) {
        const d = val(n.arg!) * (n.cmd === "bk" ? -1 : 1);
        this.move(
          t.position.map((v, i) => v + t.heading[i] * d) as Vec,
          n.arg!.t,
        );
      } else if (
        ["rt", "lt", "pitch", "down", "roll", "unroll"].includes(n.cmd)
      ) {
        const a =
          ((val(n.arg!) % 360) *
            (["lt", "down", "unroll"].includes(n.cmd) ? -1 : 1) *
            Math.PI) /
          180;
        const c = Math.cos(a),
          s = Math.sin(a);
        if (n.cmd === "rt" || n.cmd === "lt") {
          const h = t.heading;
          t.heading = combination(h, t.right, c, s);
          t.right = combination(t.right, h, c, -s);
        } else if (n.cmd === "pitch" || n.cmd === "down") {
          const h = t.heading;
          t.heading = combination(h, t.up, c, s);
          t.up = combination(t.up, h, c, -s);
        } else {
          const u = t.up;
          t.up = combination(u, t.right, c, s);
          t.right = combination(t.right, u, c, -s);
        }
      } else if (n.cmd === "pu") t.pen = false;
      else if (n.cmd === "pd") t.pen = true;
      else if (n.cmd === "color") t.color = n.color!;
      else if (n.cmd === "width") {
        const v = val(n.arg!);
        range("width", v, n.arg!.t);
        t.width = v;
      } else if (n.cmd === "let") env.set(n.name!, val(n.arg!));
      else if (n.cmd === "clear") this.segments.splice(0);
      else if (n.cmd === "home") {
        this.move([0, 0, 0], n.t);
        Object.assign(t, {
          heading: [0, 1, 0],
          right: [1, 0, 0],
          up: [0, 0, 1],
        });
      } else if (n.cmd === "stop") {
        yield n.t;
        throw new Stop();
      } else if (n.cmd === "repeat") {
        const count = val(n.arg!);
        range("repeat", count, n.arg!.t);
        yield n.t;
        if (count > 0) {
          this.frame(n.t);
          try {
            for (let k = 1; k <= count; k++) {
              yield* this.execute(n.body!, env, [...counts, k]);
              this.tick(n.t);
            }
          } finally {
            this.frames--;
          }
        }
        continue;
      } else if (n.cmd === "if" || n.cmd === "ifelse") {
        const a = val(n.arg!),
          b = val(n.arg2!);
        const yes =
          n.op === "<"
            ? a < b
            : n.op === ">"
              ? a > b
              : n.op === "="
                ? a === b
                : n.op === "<="
                  ? a <= b
                  : n.op === ">="
                    ? a >= b
                    : a !== b;
        yield n.t;
        const body = yes ? n.body : n.other;
        if (body) {
          yield* this.execute(body, env, counts);
          this.tick(n.t);
        }
        continue;
      } else if (n.cmd === "call") {
        const p = this.parsed!.procedures.get(n.name!)!,
          local = new Map<string, number>();
        n.args!.forEach((arg, i) => local.set(p.params[i], val(arg)));
        this.frame(n.t);
        yield n.t;
        try {
          yield* this.execute(p.body, local, []);
        } catch (e) {
          if (!(e instanceof Stop)) throw e;
        } finally {
          this.frames--;
        }
        this.tick(n.t);
        continue;
      }
      yield n.t;
    }
  }
  step(): Result {
    if (!this.done) {
      try {
        const event = this.iterator!.next();
        this.done = !!event.done;
        if (!event.done) this.current = event.value;
      } catch (e) {
        this.done = true;
        if (!(e instanceof Stop)) this.error = this.asError(e);
      }
    }
    return { segments: this.segments, error: this.error };
  }
  finish(): Result {
    while (!this.done) this.step();
    return { segments: this.segments, error: this.error };
  }
}
export function run(source: string, mode: Mode = "2d"): Result {
  return new Session(source, mode).finish();
}
