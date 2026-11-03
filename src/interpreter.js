const aliases = {
  fd: "np",
  forward: "np",
  naprzod: "np",
  naprzód: "np",
  np: "np",
  bk: "ws",
  back: "ws",
  wstecz: "ws",
  ws: "ws",
  rt: "pw",
  right: "pw",
  prawo: "pw",
  pw: "pw",
  lt: "lw",
  left: "lw",
  lewo: "lw",
  lw: "lw",
  pu: "pod",
  penup: "pod",
  podnies: "pod",
  podnieś: "pod",
  pod: "pod",
  pd: "opu",
  pendown: "opu",
  opusc: "opu",
  opuść: "opu",
  opu: "opu",
  color: "kolor",
  kolor: "kolor",
  width: "grubosc",
  grubość: "grubosc",
  grubosc: "grubosc",
  repeat: "powtorz",
  powtórz: "powtorz",
  powtorz: "powtorz",
  let: "niech",
  niech: "niech",
  if: "jesli",
  jeśli: "jesli",
  jesli: "jesli",
  ifelse: "jezeli",
  jeżeli: "jezeli",
  jezeli: "jezeli",
  stop: "stop",
  home: "dom",
  dom: "dom",
  cs: "czysc",
  clearscreen: "czysc",
  czyść: "czysc",
  czysc: "czysc",
  pitchup: "gora",
  góra: "gora",
  gora: "gora",
  pitchdown: "dol",
  dół: "dol",
  dol: "dol",
  rr: "pp",
  rollright: "pp",
  przechylprawo: "pp",
  pp: "pp",
  rl: "pl",
  rollleft: "pl",
  przechyllewo: "pl",
  pl: "pl",
  to: "oto",
  oto: "oto",
  end: "juz",
  już: "juz",
  juz: "juz",
};
export { aliases };
const reserved = (n) => aliases[n] || ["nrpowt", "repcount", "ma"].includes(n);
export class LogoError extends Error {
  constructor(message, t = { line: 1, column: 1 }) {
    super(message);
    this.line = t.line;
    this.column = t.column;
  }
}
const fail = (m, t) => {
  throw new LogoError(m, t);
};
export function tokenize(source) {
  if (source.length > 50000) fail("Program przekracza limit 50 000 znaków.");
  let out = [],
    i = 0,
    line = 1,
    column = 1;
  while (i < source.length) {
    let c = source[i];
    if (c === "\n") {
      i++;
      line++;
      column = 1;
      continue;
    }
    if (/\s/.test(c)) {
      i++;
      column++;
      continue;
    }
    if (c === ";") {
      while (i < source.length && source[i] !== "\n") {
        i++;
        column++;
      }
      continue;
    }
    const start = i,
      col = column;
    let type, value;
    if (c === '"') {
      i++;
      while (i < source.length && source[i] !== '"' && source[i] !== "\n") i++;
      if (source[i] === '"') i++;
      type = "string";
      value = source.slice(start, i);
    } else if (/[0-9.]/.test(c)) {
      const m = source.slice(i).match(/^(?:\d+(?:\.\d+)?|\.\d+)/);
      if (!m) fail("Niepoprawna liczba.", { line, column });
      i += m[0].length;
      if (/[\p{L}\p{N}_.]/u.test(source[i] || "")) {
        while (i < source.length && /[\p{L}\p{N}_.]/u.test(source[i])) i++;
        fail("Niepoprawna liczba. Użyj zapisu dziesiętnego.", { line, column });
      }
      type = "number";
      value = Number(m[0]);
    } else if (/[\p{L}_:]/u.test(c)) {
      const m = source.slice(i).match(/^:?[\p{L}_][\p{L}\p{N}_]*:?/u);
      if (!m) fail("Po dwukropku podaj nazwę.", { line, column });
      i += m[0].length;
      type = "name";
      value = m[0].toLowerCase();
    } else if ("+-*/[](),<>= ".includes(c)) {
      i++;
      value = c;
      if (
        "<>".includes(c) &&
        ["=", ">"].includes(source[i]) &&
        (source[i] === "=" || c === "<")
      )
        value += source[i++];
      type = "symbol";
    } else fail(`Nieznany znak „${c}”.`, { line, column });
    column += i - start;
    out.push({
      type,
      value,
      start,
      end: i,
      line,
      column: col,
      raw: source.slice(start, i),
    });
    if (out.length > 10000)
      fail("Przekroczono limit 10 000 tokenów.", out.at(-1));
  }
  return out;
}
const clean = (n) => n.replace(/^:/, "");
const validName = (n) => /^[\p{L}_][\p{L}\p{N}_]*$/u.test(n);
function evaluate(root, env, reps) {
  const stack = [[root, false]],
    values = [];
  while (stack.length) {
    const [e, visited] = stack.pop();
    if (e.kind === "number") {
      values.push(e.value);
      continue;
    }
    if (e.kind === "name") {
      if (!env.has(e.name) || env.get(e.name) === undefined)
        throw new Error(`Zmienna „${e.name}” nie ma jeszcze wartości.`);
      values.push(env.get(e.name));
      continue;
    }
    if (e.kind === "rep") {
      values.push(reps.at(-1));
      continue;
    }
    if (!visited) {
      stack.push([e, true]);
      if (e.kind === "unary") stack.push([e.child, false]);
      else {
        stack.push([e.right, false]);
        stack.push([e.left, false]);
      }
      continue;
    }
    let n;
    if (e.kind === "unary") {
      const v = values.pop();
      n = e.op === "-" ? -v : v;
    } else {
      const b = values.pop(),
        a = values.pop();
      if (e.op === "/" && b === 0) throw new Error("Dzielenie przez zero.");
      n =
        e.op === "+"
          ? a + b
          : e.op === "-"
            ? a - b
            : e.op === "*"
              ? a * b
              : a / b;
    }
    if (!Number.isFinite(n))
      throw new Error("Wynik wyrażenia nie jest skończoną liczbą.");
    values.push(n);
  }
  return values[0];
}
const hasName = (root) => {
  const stack = [root];
  while (stack.length) {
    const e = stack.pop();
    if (["name", "rep"].includes(e.kind)) return true;
    if (e.child) stack.push(e.child);
    if (e.left) stack.push(e.left, e.right);
  }
  return false;
};
export function parse(source, mode = "2d") {
  const all = tokenize(source),
    procs = new Map(),
    top = [];
  const ownLine = (t) =>
    source.split("\n")[t.line - 1].split(";")[0].trim().toLowerCase() ===
    t.raw.toLowerCase();
  const lineStart = (t) =>
    !source.slice(source.lastIndexOf("\n", t.start - 1) + 1, t.start).trim();
  let topDepth = 0;
  for (let i = 0; i < all.length; ) {
    const t = all[i];
    if (aliases[t.value] !== "oto") {
      if (t.value === "[") topDepth++;
      if (t.value === "]") topDepth--;
      top.push(t);
      i++;
      continue;
    }
    if (topDepth > 0)
      fail(
        "Definicja procedury jest dozwolona tylko na najwyższym poziomie.",
        t,
      );
    if (!lineStart(t)) fail("Definicja „oto” musi zaczynać linię.", t);
    let header = [];
    i++;
    while (i < all.length && all[i].line === t.line) header.push(all[i++]);
    let name = header.shift();
    if (
      !name ||
      name.type !== "name" ||
      !validName(name.value) ||
      reserved(name.value)
    )
      fail("Podaj poprawną nazwę procedury.", name || t);
    if (procs.has(name.value))
      fail(`Procedura „${name.value}” jest już zdefiniowana.`, name);
    let params = [];
    if (header.length) {
      if (header[0].value === "ma:") {
        header.shift();
        if (!header.length) fail("Po „ma:” podaj parametry.", name);
        while (header.length) {
          let p = header.shift();
          if (p.type !== "name" || !validName(p.value) || reserved(p.value))
            fail("Niepoprawna nazwa parametru.", p);
          params.push(p.value);
          if (header.length) {
            let comma = header.shift();
            if (comma.value !== "," || !header.length)
              fail("Parametry oddziel przecinkami.", comma);
          }
        }
      } else {
        for (const p of header) {
          if (
            p.type !== "name" ||
            !p.value.startsWith(":") ||
            !validName(clean(p.value)) ||
            reserved(clean(p.value))
          )
            fail("Użyj „ma: bok, kąt” albo „:bok :kąt”.", p);
          params.push(clean(p.value));
        }
      }
    }
    if (new Set(params).size !== params.length)
      fail("Nazwy parametrów muszą być różne.", name);
    let body = [];
    while (
      i < all.length &&
      !(aliases[all[i].value] === "juz" && ownLine(all[i]))
    ) {
      if (aliases[all[i].value] === "oto")
        fail("Nie można zagnieżdżać definicji procedur.", all[i]);
      body.push(all[i++]);
    }
    if (i === all.length) fail("Brakuje „już” w osobnej linii.", t);
    i++;
    procs.set(name.value, { name: name.value, params, t, raw: body });
  }
  const declarations = (ts, params = []) => {
    let set = new Set();
    for (let i = 0; i < ts.length; i++)
      if (aliases[ts[i].value] === "niech") {
        const n = ts[i + 1];
        if (
          n?.type !== "name" ||
          !validName(n.value) ||
          reserved(n.value) ||
          (procs.has(n.value) && !params.includes(n.value))
        )
          fail("Niepoprawna nazwa zmiennej.", n || ts[i]);
        set.add(n.value);
      }
    return set;
  };
  const globals = declarations(top);
  function bodyParse(ts, names) {
    let i = 0;
    function expr(rep, fallback) {
      const values = [],
        ops = [];
      let operand = true,
        depth = 0;
      const priority = (o) => (o === "+" || o === "-" ? 1 : 2);
      const apply = () => {
        const o = ops.pop();
        if (o.unary) {
          const child = values.pop();
          values.push({ kind: "unary", op: o.value, child, t: o.t });
        } else {
          const right = values.pop(),
            left = values.pop();
          values.push({ kind: "binary", op: o.value, left, right, t: left.t });
        }
      };
      const unary = () => {
        while (ops.at(-1)?.unary) apply();
      };
      while (true) {
        const t = ts[i];
        if (operand) {
          if (!t) fail("Brakuje argumentu.", fallback);
          if (t.value === "+" || t.value === "-") {
            ops.push({ value: t.value, unary: true, t });
            i++;
            continue;
          }
          if (t.value === "(") {
            ops.push({ value: "(", t });
            depth++;
            i++;
            continue;
          }
          let e;
          if (t.type === "number") e = { kind: "number", value: t.value, t };
          else if (
            t.type === "name" &&
            ["nrpowt", "repcount"].includes(clean(t.value))
          ) {
            if (!rep)
              fail(
                "„nrpowt” działa tylko wewnątrz powtórzenia w tym samym kodzie.",
                t,
              );
            e = { kind: "rep", t };
          } else if (t.type === "name" && names.has(clean(t.value)))
            e = { kind: "name", name: clean(t.value), t };
          else {
            if (t.type === "name" && !aliases[t.value] && !procs.has(t.value))
              fail(`Nieznana zmienna „${clean(t.value)}”.`, t);
            fail("Oczekiwano wyrażenia liczbowego.", t);
          }
          values.push(e);
          i++;
          unary();
          operand = false;
          continue;
        }
        if (t?.value === ")" && depth) {
          while (ops.at(-1).value !== "(") apply();
          const opening = ops.pop();
          const e = values.pop();
          values.push({ ...e, t: opening.t });
          depth--;
          i++;
          unary();
          continue;
        }
        if (
          t &&
          ["+", "-", "*", "/"].includes(t.value) &&
          /\s/.test(source[t.start - 1] || "") ===
            /\s/.test(source[t.end] || "")
        ) {
          while (
            ops.length &&
            ops.at(-1).value !== "(" &&
            priority(ops.at(-1).value) >= priority(t.value)
          )
            apply();
          ops.push({ value: t.value, t });
          i++;
          operand = true;
          continue;
        }
        if (depth)
          fail(
            "Brakuje zamykającego nawiasu „)”.",
            t || ops.find((o) => o.value === "(").t,
          );
        while (ops.length) apply();
        return values[0];
      }
    }

    function block(depth = 0, rep = 0, bracket = false, opening = null) {
      let out = [];
      while (i < ts.length) {
        let t = ts[i];
        if (t.value === "]") {
          if (!bracket) fail("Nadmiarowy nawias „]”.", t);
          i++;
          return out;
        }
        i++;
        let cmd = aliases[t.value],
          node = { cmd, t, args: [] };
        if (!cmd && procs.has(t.value)) cmd = node.cmd = "call";
        if (!cmd)
          fail(
            t.type === "name"
              ? `Nieznane polecenie „${t.raw}”.`
              : "Oczekiwano polecenia, znaleziono wartość.",
            t,
          );
        if (["oto", "juz"].includes(cmd))
          fail(
            "Definicja procedury jest dozwolona tylko na najwyższym poziomie, z „już” w osobnej linii.",
            t,
          );
        const arg = () => expr(rep, t);
        const group = (r = rep) => {
          let b = ts[i];
          if (b?.value !== "[")
            fail("Oczekiwano bloku w nawiasach „[ ]”.", b || t);
          if (depth >= 32) fail("Przekroczono limit 32 poziomów nawiasów.", b);
          i++;
          return block(depth + 1, r, true, b);
        };
        if (
          [
            "np",
            "ws",
            "pw",
            "lw",
            "gora",
            "dol",
            "pp",
            "pl",
            "grubosc",
          ].includes(cmd)
        ) {
          if (mode === "2d" && ["gora", "dol", "pp", "pl"].includes(cmd))
            fail("To polecenie działa tylko w trybie 3D.", t);
          node.args = [arg()];
        }
        if (cmd === "kolor") {
          let c = ts[i];
          if (c?.type !== "string" || !/^"#[\da-f]{6}"$/i.test(c.value))
            fail(
              'Kolor zapisz jako sześć cyfr szesnastkowych, np. "#16866a".',
              c || t,
            );
          i++;
          node.color = c.value.slice(1, -1).toLowerCase();
        }
        if (cmd === "niech") {
          node.name = ts[i++]?.value;
          node.args = [arg()];
        }
        if (cmd === "powtorz") {
          node.args = [arg()];
          node.body = group(rep + 1);
        }
        if (cmd === "jesli" || cmd === "jezeli") {
          node.args = [arg()];
          let op = ts[i++];
          if (!op || !["<", ">", "=", "<=", ">=", "<>"].includes(op.value))
            fail("Warunek wymaga porównania: <, >, =, <=, >= lub <>.", op || t);
          node.compare = op.value;
          node.args.push(arg());
          node.body = group();
          if (cmd === "jezeli") node.other = group();
        }
        if (cmd === "call") {
          node.proc = procs.get(t.value);
          for (let n = 0; n < node.proc.params.length; n++)
            node.args.push(arg());
        }
        if (["grubosc", "powtorz"].includes(cmd) && !hasName(node.args[0])) {
          let v;
          try {
            v = evaluate(node.args[0], new Map(), []);
          } catch {}
          if (v !== undefined) validate(cmd, v, node.args[0].t);
        }
        out.push(node);
      }
      if (bracket) fail("Brakuje zamykającego nawiasu „]”.", opening || ts.at(-1));
      return out;
    }
    return block();
  }
  for (const p of procs.values()) {
    p.locals = declarations(p.raw, p.params);
    p.body = bodyParse(p.raw, new Set([...globals, ...p.params, ...p.locals]));
  }
  return { body: bodyParse(top, globals), procs };
}
function validate(cmd, v, t) {
  if (cmd === "grubosc" && (!Number.isInteger(v) || v < 1 || v > 12))
    fail("Grubość musi być liczbą całkowitą od 1 do 12.", t);
  if (cmd === "powtorz" && (!Number.isInteger(v) || v < 0 || v > 10000))
    fail("Liczba powtórzeń musi być całkowita, od 0 do 10 000.", t);
}
const combine = (a, b, c, s) => a.map((v, i) => v * c + b[i] * s);
export function createExecution(source, mode = "2d") {
  const ast = parse(source, mode),
    state = {
      segments: [],
      position: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
      pen: true,
      color: "#16866a",
      width: 3,
      line: 0,
      column: 0,
      operations: 0,
    };
  let frames = 0;
  const globals = new Map();
  const STOP = Symbol("stop");
  const tick = (t) => {
    if (++state.operations > 10000)
      fail("Przekroczono limit 10 000 operacji.", t);
  };
  const frame = (t) => {
    if (++frames > 32)
      fail("Przekroczono limit 32 aktywnych wywołań i powtórzeń.", t);
  };
  function move(to, t) {
    if (to.some((v) => !Number.isFinite(v) || Math.abs(v) > 100000))
      fail("Współrzędna przekracza zakres ±100 000.", t);
    if (state.pen && to.some((v, i) => v !== state.position[i])) {
      if (state.segments.length >= 10000)
        fail("Przekroczono limit 10 000 odcinków.", t);
      state.segments.push({
        from: [...state.position],
        to: [...to],
        color: state.color,
        width: state.width,
      });
    }
    state.position = to;
  }
  function* exec(nodes, local = null, reps = []) {
    for (const n of nodes) {
      tick(n.t);
      state.line = n.t.line;
      state.column = n.t.column;
      const env = new Map(globals);
      if (local) for (const [k, v] of local) env.set(k, v);
      const vals = n.args.map((e) => {
          try {
            const v = evaluate(e, env, reps);
            if (!Number.isFinite(v))
              throw new Error("Wynik wyrażenia nie jest skończoną liczbą.");
            return v;
          } catch (e2) {
            fail(e2.message, e.t);
          }
        }),
        v = vals[0];
      if (["grubosc", "powtorz"].includes(n.cmd))
        validate(n.cmd, v, n.args[0].t);
      switch (n.cmd) {
        case "np":
        case "ws":
          move(
            state.position.map(
              (p, i) => p + state.heading[i] * v * (n.cmd === "ws" ? -1 : 1),
            ),
            n.t,
          );
          break;
        case "pw":
        case "lw": {
          let a = (((v % 360) * Math.PI) / 180) * (n.cmd === "lw" ? -1 : 1),
            h = state.heading,
            r = state.right;
          state.heading = combine(h, r, Math.cos(a), Math.sin(a));
          state.right = combine(r, h, Math.cos(a), -Math.sin(a));
          break;
        }
        case "gora":
        case "dol": {
          let a = (((v % 360) * Math.PI) / 180) * (n.cmd === "dol" ? -1 : 1),
            h = state.heading,
            u = state.up;
          state.heading = combine(h, u, Math.cos(a), Math.sin(a));
          state.up = combine(u, h, Math.cos(a), -Math.sin(a));
          break;
        }
        case "pp":
        case "pl": {
          let a = (((v % 360) * Math.PI) / 180) * (n.cmd === "pl" ? -1 : 1),
            u = state.up,
            r = state.right;
          state.up = combine(u, r, Math.cos(a), Math.sin(a));
          state.right = combine(r, u, Math.cos(a), -Math.sin(a));
          break;
        }
        case "pod":
          state.pen = false;
          break;
        case "opu":
          state.pen = true;
          break;
        case "kolor":
          state.color = n.color;
          break;
        case "grubosc":
          state.width = v;
          break;
        case "dom":
          move([0, 0, 0], n.t);
          state.heading = [0, 1, 0];
          state.right = [1, 0, 0];
          state.up = [0, 0, 1];
          break;
        case "czysc":
          state.segments = [];
          break;
        case "niech":
          (local || globals).set(n.name, v);
          break;
        case "stop":
          yield state;
          throw STOP;
      }
      yield state;
      if (n.cmd === "powtorz") {
        frame(n.t);
        try {
          for (let j = 1; j <= v; j++) {
            yield* exec(n.body, local, [...reps, j]);
            tick(n.t);
          }
        } finally {
          frames--;
        }
      }
      if (n.cmd === "jesli" || n.cmd === "jezeli") {
        const [a, b] = vals,
          yes =
            n.compare === "<"
              ? a < b
              : n.compare === ">"
                ? a > b
                : n.compare === "="
                  ? a === b
                  : n.compare === "<="
                    ? a <= b
                    : n.compare === ">="
                      ? a >= b
                      : a !== b;
        let body = yes ? n.body : n.other;
        if (body) {
          yield* exec(body, local, reps);
          tick(n.t);
        }
      }
      if (n.cmd === "call") {
        frame(n.t);
        const loc = new Map();
        n.proc.params.forEach((p, i) => loc.set(p, vals[i]));
        try {
          yield* exec(n.proc.body, loc, []);
        } catch (e) {
          if (e !== STOP) throw e;
        } finally {
          frames--;
        }
        tick(n.t);
      }
    }
  }
  function* program() {
    try {
      yield* exec(ast.body);
    } catch (e) {
      if (e !== STOP) throw e;
    }
  }
  return { state, iterator: program() };
}
export function run(source, mode = "2d") {
  let ex;
  try {
    ex = createExecution(source, mode);
    for (const _ of ex.iterator) {
    }
    return { segments: ex.state.segments, error: null };
  } catch (e) {
    return {
      segments: ex?.state.segments || [],
      error: { message: e.message, line: e.line || 1, column: e.column || 1 },
    };
  }
}
