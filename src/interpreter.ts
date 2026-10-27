export type Vec = [number, number, number];
export type Mode = "2d" | "3d";
export interface Segment {
  from: Vec;
  to: Vec;
  color: string;
  width: number;
}
export interface LogoError {
  message: string;
  line: number;
  column: number;
}
interface Token {
  text: string;
  line: number;
  column: number;
}
class Fault extends Error {
  constructor(
    message: string,
    public token: Token,
  ) {
    super(message);
  }
}
function fail(t: Token, m: string): never {
  throw new Fault(m, t);
}
const lower = (s: string) => s.toLocaleLowerCase("pl");
const numberPattern = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/;
const namePattern = /^[\p{L}_][\p{L}\p{N}_]*$/u;
const aliases: Record<string, string> = Object.create(null);
for (const [op, names] of Object.entries({
  fd: "np naprzod naprzód fd forward",
  bk: "ws wstecz bk back",
  rt: "pw prawo rt right",
  lt: "lw lewo lt left",
  pu: "pod podnies podnieś pu penup",
  pd: "opu opusc opuść pd pendown",
  color: "kolor color",
  width: "grubosc grubość width",
  repeat: "powtorz powtórz repeat",
  up: "gora góra pitchup",
  down: "dol dół pitchdown",
}))
  for (const n of names.split(" ")) aliases[n] = op;
const starts = new Set(["oto", "to"]);
const ends = new Set(["już", "juz", "end"]);
function tokenize(source: string): Token[] {
  if (source.length > 50000)
    fail(
      { text: "", line: 1, column: 1 },
      "Program przekracza limit 50 000 znaków.",
    );
  const out: Token[] = [];
  let i = 0,
    line = 1,
    column = 1;
  while (i < source.length) {
    const ch = source[i];
    if (ch === "\n") {
      i++;
      line++;
      column = 1;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      column++;
      continue;
    }
    if (ch === ";") {
      while (i < source.length && source[i] !== "\n") {
        i++;
        column++;
      }
      continue;
    }
    const t: Token = { text: "", line, column };
    const start = i;
    if ("[],".includes(ch)) {
      i++;
      column++;
    } else if (ch === '"') {
      i++;
      column++;
      while (i < source.length && source[i] !== '"' && source[i] !== "\n") {
        i++;
        column++;
      }
      if (source[i] === '"') {
        i++;
        column++;
      }
    } else {
      while (i < source.length && !/[\s\[\],;"]/.test(source[i])) {
        i++;
        column++;
      }
    }
    t.text = source.slice(start, i);
    out.push(t);
    if (out.length > 10000) fail(t, "Program przekracza limit 10 000 tokenów.");
  }
  return out;
}
type Arg = { token: Token; value?: number; param?: string };
interface Node {
  token: Token;
  op: string;
  args: Arg[];
  body?: Node[];
  color?: string;
  name?: string;
}
interface Procedure {
  token: Token;
  params: string[];
  tokens: Token[];
  body: Node[];
}
export interface Program {
  body: Node[];
  procedures: Map<string, Procedure>;
}
export function compile(source: string, mode: Mode): Program {
  const tokens = tokenize(source);
  const procedures = new Map<string, Procedure>();
  const main: Token[] = [];
  const lines = source.split("\n");
  let depth = 0;
  const alone = (t: Token) =>
    tokens.filter((x) => x.line === t.line).length === 1;
  for (let i = 0; i < tokens.length;) {
    const t = tokens[i],
      name = lower(t.text);
    if (starts.has(name)) {
      if (depth !== 0 || lines[t.line - 1].slice(0, t.column - 1).trim())
        fail(
          t,
          "Definicja „oto” musi zaczynać osobną linię, poza innymi blokami.",
        );
      const header: Token[] = [];
      i++;
      while (i < tokens.length && tokens[i].line === t.line)
        header.push(tokens[i++]);
      const nt = header.shift();
      if (!nt || !namePattern.test(nt.text))
        fail(nt || t, "Podaj poprawną nazwę procedury po „oto”.");
      const pn = lower(nt.text);
      if (aliases[pn] || starts.has(pn) || ends.has(pn))
        fail(nt, "Ta nazwa jest zarezerwowana dla polecenia.");
      if (procedures.has(pn))
        fail(nt, `Procedura „${nt.text}” jest już zdefiniowana.`);
      const params: string[] = [];
      const add = (p: Token, legacy = false) => {
        const n = lower(legacy ? p.text.slice(1) : p.text);
        if (!namePattern.test(n) || params.includes(n))
          fail(p, "Niepoprawna lub powtórzona nazwa parametru.");
        params.push(n);
      };
      if (header.length) {
        if (lower(header[0].text) === "ma:") {
          header.shift();
          if (!header.length)
            fail(nt, "Po „ma:” podaj parametry rozdzielone przecinkami.");
          for (let h = 0; h < header.length; h++) {
            if (h % 2 === 0) add(header[h]);
            else if (header[h].text !== ",")
              fail(header[h], "Parametry w nagłówku rozdziel przecinkami.");
          }
          if (header.at(-1)?.text === ",")
            fail(header.at(-1)!, "Brakuje parametru po przecinku.");
        } else
          for (const p of header) {
            if (!p.text.startsWith(":"))
              fail(p, "Użyj „ma: bok, kąt” lub parametrów „:bok :kąt”.");
            add(p, true);
          }
      }
      const body: Token[] = [];
      while (i < tokens.length && !ends.has(lower(tokens[i].text))) {
        if (starts.has(lower(tokens[i].text)))
          fail(
            tokens[i],
            "Nie można definiować procedury wewnątrz innej procedury.",
          );
        body.push(tokens[i++]);
      }
      if (i === tokens.length)
        fail(t, "Brakuje „już” kończącego definicję procedury.");
      if (!alone(tokens[i]))
        fail(tokens[i], "„już” musi być samo w osobnej linii.");
      i++;
      procedures.set(pn, { token: nt, params, tokens: body, body: [] });
    } else {
      if (ends.has(name))
        fail(t, "Nieoczekiwane „już” poza definicją procedury.");
      main.push(t);
      if (t.text === "[") depth++;
      if (t.text === "]") depth--;
      i++;
    }
  }
  function parse(ts: Token[], params: string[]): Node[] {
    let i = 0;
    const eof = ts.at(-1) || { text: "", line: 1, column: 1 };
    function arg(owner: Token): Arg {
      const t = ts[i];
      if (!t) fail(owner, "Brakuje argumentu liczbowego.");
      if (numberPattern.test(t.text) && Number.isFinite(Number(t.text))) {
        i++;
        return { token: t, value: Number(t.text) };
      }
      const n = lower(t.text.replace(/^:/, ""));
      if (params.includes(n)) {
        i++;
        return { token: t, param: n };
      }
      fail(t, `Oczekiwano liczby lub parametru, otrzymano „${t.text}”.`);
    }
    function range(a: Arg, min: number, max: number, label: string) {
      if (
        a.value !== undefined &&
        (!Number.isInteger(a.value) || a.value < min || a.value > max)
      )
        fail(
          a.token,
          `${label} musi być liczbą całkowitą od ${min} do ${max}.`,
        );
    }
    function block(depth: number, opening?: Token): Node[] {
      if (depth > 32)
        fail(opening || eof, "Przekroczono limit 32 poziomów zagnieżdżenia.");
      const nodes: Node[] = [];
      while (i < ts.length) {
        const t = ts[i++],
          n = lower(t.text);
        if (n === "]") {
          if (!opening) fail(t, "Nadmiarowy nawias „]”.");
          return nodes;
        }
        if (n === "[")
          fail(
            t,
            "Nawias „[” powinien wystąpić po poleceniu „powtórz” i liczbie.",
          );
        if (starts.has(n))
          fail(t, "Definicje procedur są dozwolone tylko poza blokami.");
        const op = aliases[n];
        const node: Node = { token: t, op: op || "call", args: [] };
        if (op === "pu" || op === "pd") {
        } else if (op === "color") {
          const c = ts[i];
          if (!c || !/^"#[0-9a-f]{6}"$/i.test(c.text))
            fail(
              c || t,
              'Kolor zapisz w cudzysłowie jako sześć cyfr hex, np. "#16866a".',
            );
          node.color = c.text.slice(1, -1).toLowerCase();
          i++;
        } else if (op) {
          if ((op === "up" || op === "down") && mode === "2d")
            fail(t, "Polecenia „góra” i „dół” działają tylko w trybie 3D.");
          const a = arg(t);
          node.args.push(a);
          if (op === "width") range(a, 1, 12, "Grubość");
          if (op === "repeat") {
            range(a, 0, 10000, "Liczba powtórzeń");
            const b = ts[i];
            if (!b || b.text !== "[")
              fail(b || t, "Po liczbie powtórzeń oczekiwano nawiasu „[”.");
            i++;
            node.body = block(depth + 1, b);
          }
        } else {
          const p = procedures.get(n);
          if (!p) fail(t, `Nieznane polecenie „${t.text}”.`);
          node.name = n;
          for (let a = 0; a < p.params.length; a++) node.args.push(arg(t));
          const extra = ts[i];
          if (extra && numberPattern.test(extra.text))
            fail(
              extra,
              `Procedura „${t.text}” wymaga dokładnie ${p.params.length} argumentów.`,
            );
        }
        nodes.push(node);
      }
      if (opening) fail(opening, "Brakuje nawiasu zamykającego „]”.");
      return nodes;
    }
    return block(0);
  }
  for (const p of procedures.values()) p.body = parse(p.tokens, p.params);
  const body = parse(main, []);
  // Iterative graph traversal also handles very long, unused call chains.
  const edges = new Map<string, Node[]>();
  for (const [name, proc] of procedures) {
    const calls: Node[] = [],
      pending = [...proc.body];
    while (pending.length) {
      const node = pending.pop()!;
      if (node.op === "call") calls.push(node);
      if (node.body) pending.push(...node.body);
    }
    edges.set(name, calls);
  }
  const visited = new Set<string>(),
    active = new Set<string>();
  for (const name of procedures.keys()) {
    if (visited.has(name)) continue;
    const stack = [{ name, index: 0 }];
    active.add(name);
    while (stack.length) {
      const frame = stack.at(-1)!,
        calls = edges.get(frame.name)!;
      if (frame.index === calls.length) {
        active.delete(frame.name);
        visited.add(frame.name);
        stack.pop();
        continue;
      }
      const call = calls[frame.index++],
        target = call.name!;
      if (active.has(target))
        fail(
          call.token,
          `Rekurencja: procedura „${target}” wywołuje samą siebie, bezpośrednio lub pośrednio.`,
        );
      if (!visited.has(target)) {
        active.add(target);
        stack.push({ name: target, index: 0 });
      }
    }
  }
  return { body, procedures };
}
const addScaled = (a: Vec, b: Vec, s: number): Vec =>
  a.map((v, i) => v + b[i] * s) as Vec;
const combine = (a: Vec, b: Vec, c: number, s: number): Vec =>
  a.map((v, i) => v * c + b[i] * s) as Vec;
export class Execution {
  segments: Segment[] = [];
  position: Vec = [0, 0, 0];
  heading: Vec = [0, 1, 0];
  right: Vec = [1, 0, 0];
  up: Vec = [0, 0, 1];
  color = "#16866a";
  width = 3;
  pen = true;
  operations = 0;
  error: LogoError | null = null;
  done = false;
  line = 1;
  private iterator: Generator<void>;
  constructor(program: Program) {
    this.iterator = this.execute(program.body, {}, 0, program);
  }
  private *execute(
    nodes: Node[],
    env: Record<string, number>,
    depth: number,
    p: Program,
  ): Generator<void> {
    for (const n of nodes) {
      this.line = n.token.line;
      this.tick(n.token);
      const values = n.args.map((a) =>
        a.param !== undefined ? env[a.param] : a.value!,
      );
      const v = values[0];
      if (n.op === "repeat" || n.op === "call") {
        if (depth >= 32)
          fail(n.token, "Przekroczono limit 32 aktywnych bloków i procedur.");
        if (n.op === "repeat") {
          if (!Number.isInteger(v) || v < 0 || v > 10000)
            fail(
              n.args[0].token,
              "Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.",
            );
          yield;
          for (let i = 0; i < v; i++) {
            this.tick(n.token);
            yield;
            yield* this.execute(n.body!, env, depth + 1, p);
          }
        } else {
          const proc = p.procedures.get(n.name!)!;
          const local: Record<string, number> = Object.create(null);
          proc.params.forEach((name, i) => (local[name] = values[i]));
          yield;
          yield* this.execute(proc.body, local, depth + 1, p);
        }
        continue;
      }
      if (n.op === "fd" || n.op === "bk") {
        const d = n.op === "fd" ? v : -v,
          next = addScaled(this.position, this.heading, d);
        if (next.some((x) => !Number.isFinite(x) || Math.abs(x) > 100000))
          fail(n.token, "Współrzędna przekracza dozwolony zakres ±100 000.");
        if (this.pen && d !== 0) {
          if (this.segments.length >= 10000)
            fail(n.token, "Przekroczono limit 10 000 odcinków.");
          this.segments.push({
            from: [...this.position],
            to: [...next],
            color: this.color,
            width: this.width,
          });
        }
        this.position = next;
      } else if (["rt", "lt", "up", "down"].includes(n.op)) {
        const angle =
            (((v % 360) * Math.PI) / 180) *
            (n.op === "lt" || n.op === "down" ? -1 : 1),
          c = Math.cos(angle),
          s = Math.sin(angle);
        if (n.op === "rt" || n.op === "lt") {
          const h = this.heading;
          this.heading = combine(h, this.right, c, s);
          this.right = combine(this.right, h, c, -s);
        } else {
          const h = this.heading;
          this.heading = combine(h, this.up, c, s);
          this.up = combine(this.up, h, c, -s);
        }
      } else if (n.op === "pu") this.pen = false;
      else if (n.op === "pd") this.pen = true;
      else if (n.op === "color") this.color = n.color!;
      else if (n.op === "width") {
        if (!Number.isInteger(v) || v < 1 || v > 12)
          fail(
            n.args[0].token,
            "Grubość musi być liczbą całkowitą od 1 do 12.",
          );
        this.width = v;
      }
      yield;
    }
  }
  private tick(t: Token) {
    if (++this.operations > 10000)
      fail(
        t,
        "Przekroczono limit 10 000 operacji. Skróć program lub zmniejsz liczbę powtórzeń.",
      );
  }
  step() {
    if (this.done) return;
    try {
      this.done = !!this.iterator.next().done;
    } catch (e) {
      this.error = errorOf(e);
      this.done = true;
    }
  }
}
export function errorOf(e: unknown): LogoError {
  return e instanceof Fault
    ? { message: e.message, line: e.token.line, column: e.token.column }
    : { message: "Nie udało się wykonać programu.", line: 1, column: 1 };
}
export function run(
  source: string,
  mode: Mode,
): { segments: Segment[]; error: LogoError | null } {
  try {
    const ex = new Execution(compile(source, mode));
    while (!ex.done) ex.step();
    return { segments: ex.segments, error: ex.error };
  } catch (e) {
    return { segments: [], error: errorOf(e) };
  }
}
