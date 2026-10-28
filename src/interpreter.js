export const aliases = Object.create(null);
const groups = {
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
  cs: "czyść czysc cs clearscreen",
  pitch: "gora góra pitchup",
  down: "dol dół pitchdown",
  roll: "pp przechylprawo rr rollright",
  rollleft: "pl przechyllewo rl rollleft",
  to: "oto to",
  end: "już juz end",
};
for (const [k, v] of Object.entries(groups))
  for (const a of v.split(" ")) aliases[a] = k;
const ident = /^[\p{L}_][\p{L}\p{N}_]*$/u;
function fail(t, message) {
  throw { message, line: t?.line || 1, column: t?.column || 1 };
}
export function tokenize(source) {
  if (source.length > 50000) fail(null, "Przekroczono limit 50 000 znaków.");
  let out = [],
    i = 0,
    line = 1,
    column = 1;
  while (i < source.length) {
    let c = source[i];
    if (/\s/.test(c)) {
      if (c === "\n") {
        line++;
        column = 1;
      } else column++;
      i++;
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
      t = { line, column, start };
    let value;
    if (c === '"') {
      i++;
      while (i < source.length && source[i] !== '"' && source[i] !== "\n") i++;
      if (source[i] === '"') i++;
      value = source.slice(start, i);
    } else if (/[\d.]/.test(c)) {
      while (i < source.length && /[\p{L}\p{N}_.]/u.test(source[i])) i++;
      value = source.slice(start, i);
      if (!/^(\d+(\.\d+)?|\.\d+)$/.test(value))
        fail(t, "Niepoprawna liczba: " + value);
    } else if (/[\p{L}_:]/u.test(c)) {
      i++;
      while (i < source.length && /[\p{L}\p{N}_:]/u.test(source[i])) i++;
      value = source.slice(start, i).toLowerCase();
    } else if ("[](),+-*/<>= ".includes(c)) {
      i++;
      if ("<>".includes(c) && "=".includes(source[i] || "!")) i++;
      else if (c === "<" && source[i] === ">") i++;
      value = source.slice(start, i);
    } else fail(t, "Nieznany znak: " + c);
    out.push({
      ...t,
      v: value,
      end: i,
      binary:
        !["+", "-", "*", "/"].includes(value) ||
        /\s/.test(source[start - 1] || " ") === /\s/.test(source[i] || " "),
    });
    column += i - start;
    if (out.length > 10000) fail(t, "Przekroczono limit 10 000 tokenów.");
  }
  return out;
}
export function parse(source, mode = "2d") {
  const tokens = tokenize(source),
    procs = new Map(),
    main = [],
    reserved = (n) => aliases[n] || ["nrpowt", "repcount", "ma:"].includes(n);
  let depth = 0;
  for (let i = 0; i < tokens.length;) {
    let t = tokens[i];
    if (aliases[t.v] === "to") {
      if (depth || tokens[i - 1]?.line === t.line)
        fail(t, "Definicja musi zaczynać się na początku osobnej linii.");
      let head = [];
      while (tokens[i]?.line === t.line) head.push(tokens[i++]);
      let name = head[1];
      if (!name || !ident.test(name.v) || reserved(name.v) || procs.has(name.v))
        fail(name || t, "Niepoprawna lub powtórzona nazwa procedury.");
      let params = [];
      if (head[2]?.v === "ma:") {
        let h = head.slice(3);
        if (!h.length) fail(head[2], "Brak parametrów.");
        for (let j = 0; j < h.length; j++) {
          if (j % 2 === 1) {
            if (h[j].v !== ",") fail(h[j], "Oczekiwano przecinka.");
          } else params.push(h[j].v);
        }
        if (h.at(-1)?.v === ",") fail(h.at(-1), "Brak parametru.");
      } else
        params = head.slice(2).map((x) => {
          if (!x.v.startsWith(":")) fail(x, "Oczekiwano ma: lub :parametru.");
          return x.v.slice(1);
        });
      for (let p of params)
        if (
          !ident.test(p) ||
          reserved(p) ||
          params.filter((x) => x === p).length > 1
        )
          fail(name, "Niepoprawny parametr.");
      let body = [];
      while (i < tokens.length && aliases[tokens[i].v] !== "end") {
        if (aliases[tokens[i].v] === "to")
          fail(tokens[i], "Definicje nie mogą być zagnieżdżone.");
        body.push(tokens[i++]);
      }
      if (!tokens[i]) fail(t, "Brak już kończącego procedurę.");
      let e = tokens[i++];
      if (tokens[i]?.line === e.line || body.at(-1)?.line === e.line)
        fail(e, "już musi być samo w linii.");
      procs.set(name.v, { params, tokens: body, t: name });
    } else {
      if (t.v === "[") depth++;
      if (t.v === "]") depth--;
      main.push(t);
      i++;
    }
  }
  const declared = (ts) =>
    new Set(
      ts.flatMap((t, i) => (aliases[t.v] === "let" ? [ts[i + 1]?.v] : [])),
    );
  const globals = declared(main);
  function body(ts, params = [], locals = new Set()) {
    let i = 0;
    const peek = () => ts[i],
      take = () => ts[i++];
    function expr(repeat, cmd) {
      const values = [],
        operators = [];
      let expecting = true,
        opened = 0;
      const precedence = (o) => (o.unary ? 3 : "*/".includes(o.v) ? 2 : 1);
      const apply = () => {
        let o = operators.pop();
        if (o.unary) {
          let a = values.pop();
          values.push({ type: "unary", op: o.v, a, t: o });
        } else {
          let b = values.pop(),
            a = values.pop();
          values.push({ type: "binary", op: o.v, a, b, t: a.t });
        }
      };
      while (true) {
        let t = peek();
        if (expecting) {
          if (!t) fail(cmd, "Brak argumentu.");
          if (t.v === "+" || t.v === "-") {
            operators.push({ ...take(), unary: true });
            continue;
          }
          if (t.v === "(") {
            operators.push(take());
            opened++;
            continue;
          }
          take();
          let node;
          if (/^(\d|\.)/.test(t.v))
            node = { type: "num", value: Number(t.v), t };
          else {
            let name = t.v.replace(/^:/, "");
            if (["nrpowt", "repcount"].includes(name)) {
              if (!repeat)
                fail(t, "nrpowt jest dostępny tylko wewnątrz powtórzenia.");
              node = { type: "rep", t };
            } else if (
              ident.test(name) &&
              !reserved(name) &&
              (params.includes(name) || locals.has(name) || globals.has(name))
            )
              node = { type: "var", name, t };
            else
              fail(t, "Oczekiwano liczby lub zadeklarowanej zmiennej: " + t.v);
          }
          values.push(node);
          expecting = false;
        } else if (t?.v === ")" && opened) {
          take();
          while (operators.at(-1)?.v !== "(") apply();
          let opening = operators.pop(),
            a = values.pop();
          values.push({ type: "group", a, t: opening });
          opened--;
        } else if (t?.binary && ["+", "-", "*", "/"].includes(t.v)) {
          while (
            operators.length &&
            operators.at(-1).v !== "(" &&
            precedence(operators.at(-1)) >= precedence(t)
          )
            apply();
          operators.push(take());
          expecting = true;
        } else break;
      }
      if (opened)
        fail(
          peek() || operators.find((o) => o.v === "("),
          "Brak zamykającego nawiasu ).",
        );
      while (operators.length) apply();
      return values[0];
    }
    function block(level = 0, repeat = 0, closing = false) {
      let result = [];
      while (i < ts.length && peek().v !== "]") {
        let t = take(),
          op = aliases[t.v] || (procs.has(t.v) ? "call" : null);
        if (!op || ["to", "end"].includes(op))
          fail(t, "Nieznane polecenie: " + t.v);
        let n = { op, t };
        const arg = () => expr(repeat, t);
        const bracket = () => {
          let b = take();
          if (b?.v !== "[") fail(b || t, "Oczekiwano nawiasu [.");
          if (level >= 32) fail(b, "Przekroczono 32 poziomy nawiasów.");
          return block(level + 1, repeat + (op === "repeat" ? 1 : 0), true);
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
            "rollleft",
            "repeat",
          ].includes(op)
        ) {
          n.a = arg();
          if (
            mode === "2d" &&
            ["pitch", "down", "roll", "rollleft"].includes(op)
          )
            fail(t, "To polecenie działa tylko w trybie 3D.");
          if (["width", "repeat"].includes(op) && constant(n.a)) {
            let v;
            try {
              v = evaluate(n.a, {}, [], n.a.t);
            } catch {}
            if (v !== undefined) validate(op, v, n.a.t);
          }
        }
        if (op === "color") {
          n.color = take();
          if (!/^"#[0-9a-f]{6}"$/i.test(n.color?.v || ""))
            fail(n.color || t, 'Kolor musi mieć postać "#16866a".');
        }
        if (op === "let") {
          let name = take();
          if (
            !name ||
            !ident.test(name.v) ||
            reserved(name.v) ||
            procs.has(name.v)
          )
            fail(name || t, "Niepoprawna nazwa zmiennej.");
          n.name = name.v;
          n.a = arg();
        }
        if (op === "repeat") n.body = bracket();
        if (op === "if" || op === "ifelse") {
          n.a = arg();
          let cmp = take();
          if (!["<", ">", "=", "<=", ">=", "<>"].includes(cmp?.v))
            fail(cmp || t, "Oczekiwano porównania.");
          n.cmp = cmp.v;
          n.b = arg();
          n.body = bracket();
          if (op === "ifelse") n.other = bracket();
        }
        if (op === "call") {
          n.name = t.v;
          n.args = procs.get(t.v).params.map(() => arg());
        }
        result.push(n);
      }
      if (closing) {
        if (peek()?.v !== "]") fail(ts.at(-1), "Brak zamykającego nawiasu ].");
        take();
      }
      return result;
    }
    let result = block();
    if (i < ts.length) fail(peek(), "Nieoczekiwany nawias ].");
    return result;
  }
  const program = body(main);
  for (let p of procs.values())
    p.body = body(p.tokens, p.params, declared(p.tokens));
  return { program, procs };
}
function constant(n) {
  let stack = [n];
  while (stack.length) {
    let x = stack.pop();
    if (["var", "rep"].includes(x.type)) return false;
    if (x.a) stack.push(x.a);
    if (x.b) stack.push(x.b);
  }
  return true;
}
function validate(op, v, t) {
  if (
    !Number.isInteger(v) ||
    v < (op === "width" ? 1 : 0) ||
    v > (op === "width" ? 12 : 10000)
  )
    fail(
      t,
      op === "width"
        ? "Grubość musi być liczbą całkowitą od 1 do 12."
        : "Liczba powtórzeń musi być całkowita od 0 do 10 000.",
    );
}
function evaluate(n, env, reps, t) {
  const stack = [[n, false]],
    values = [];
  while (stack.length) {
    let [x, visited] = stack.pop();
    if (!visited && x.a) {
      stack.push([x, true]);
      if (x.b) stack.push([x.b, false]);
      stack.push([x.a, false]);
      continue;
    }
    let v;
    if (x.type === "num") v = x.value;
    else if (x.type === "rep") v = reps.at(-1);
    else if (x.type === "var") {
      v = env[x.name];
      if (v === undefined)
        fail(t, "Zmienna " + x.name + " nie ma jeszcze wartości.");
    } else if (x.type === "group") v = values.pop();
    else if (x.type === "unary") v = values.pop() * (x.op === "-" ? -1 : 1);
    else {
      let b = values.pop(),
        a = values.pop();
      if (x.op === "/" && b === 0) fail(t, "Dzielenie przez zero.");
      v = {
        "+": () => a + b,
        "-": () => a - b,
        "*": () => a * b,
        "/": () => a / b,
      }[x.op]();
    }
    if (!Number.isFinite(v)) fail(t, "Wynik nie jest skończoną liczbą.");
    values.push(v);
  }
  return values[0];
}
export function createExecution(source, mode = "2d") {
  const state = {
    segments: [],
    position: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: "#16866a",
    width: 3,
    error: null,
    line: 0,
    operations: 0,
    done: false,
  };
  let ast;
  try {
    ast = parse(source, mode);
  } catch (e) {
    state.error = e;
    state.done = true;
    return { state, step: () => state };
  }
  const globals = Object.create(null),
    sum = (a, b, k = 1) => a.map((v, i) => v + b[i] * k);
  let frames = 0;
  function count(t) {
    if (++state.operations > 10000)
      fail(t, "Przekroczono limit 10 000 operacji.");
  }
  function enter(t) {
    if (++frames > 32)
      fail(t, "Przekroczono limit 32 aktywnych wywołań i powtórzeń.");
  }
  function move(d, t) {
    let next = sum(state.position, state.heading, d);
    if (next.some((x) => !Number.isFinite(x) || Math.abs(x) > 100000))
      fail(t, "Współrzędna przekracza ±100 000.");
    if (state.pen && d !== 0) {
      if (state.segments.length >= 10000)
        fail(t, "Przekroczono limit 10 000 odcinków.");
      state.segments.push({
        from: [...state.position],
        to: next,
        color: state.color,
        width: state.width,
      });
    }
    state.position = next;
  }
  function rotate(a, b, deg) {
    let c = Math.cos(((deg % 360) * Math.PI) / 180),
      s = Math.sin(((deg % 360) * Math.PI) / 180),
      x = state[a],
      y = state[b];
    state[a] = x.map((v, i) => v * c + y[i] * s);
    state[b] = y.map((v, i) => v * c - x[i] * s);
  }
  function* execute(nodes, local = null, reps = []) {
    for (let n of nodes) {
      count(n.t);
      state.line = n.t.line;
      let env = local ? Object.assign(Object.create(globals), local) : globals;
      let val = (x) => evaluate(x, env, reps, x.t),
        v = n.a ? val(n.a) : 0;
      switch (n.op) {
        case "fd":
        case "bk":
          move(v * (n.op === "bk" ? -1 : 1), n.a.t);
          break;
        case "rt":
          rotate("heading", "right", v);
          break;
        case "lt":
          rotate("heading", "right", -v);
          break;
        case "pitch":
          rotate("heading", "up", v);
          break;
        case "down":
          rotate("heading", "up", -v);
          break;
        case "roll":
          rotate("up", "right", v);
          break;
        case "rollleft":
          rotate("up", "right", -v);
          break;
        case "pu":
          state.pen = false;
          break;
        case "pd":
          state.pen = true;
          break;
        case "color":
          state.color = n.color.v.slice(1, -1).toLowerCase();
          break;
        case "width":
          validate("width", v, n.a.t);
          state.width = v;
          break;
        case "let":
          (local || globals)[n.name] = v;
          break;
        case "cs":
          state.segments = [];
          break;
        case "home": {
          let p = state.position;
          if (state.pen && p.some((x) => x !== 0)) {
            if (state.segments.length >= 10000)
              fail(n.t, "Przekroczono limit odcinków.");
            state.segments.push({
              from: [...p],
              to: [0, 0, 0],
              color: state.color,
              width: state.width,
            });
          }
          state.position = [0, 0, 0];
          state.heading = [0, 1, 0];
          state.right = [1, 0, 0];
          state.up = [0, 0, 1];
          break;
        }
        case "stop":
          yield;
          return true;
        case "repeat":
          validate("repeat", v, n.a.t);
          enter(n.t);
          yield;
          for (let k = 1; k <= v; k++) {
            if (yield* execute(n.body, local, [...reps, k])) {
              frames--;
              return true;
            }
            count(n.t);
            yield;
          }
          frames--;
          continue;
        case "if":
        case "ifelse": {
          let b = val(n.b),
            ok = {
              "<": v < b,
              ">": v > b,
              "=": v === b,
              "<=": v <= b,
              ">=": v >= b,
              "<>": v !== b,
            }[n.cmp];
          yield;
          let chosen = ok ? n.body : n.other;
          if (chosen) {
            if (yield* execute(chosen, local, reps)) return true;
            count(n.t);
            yield;
          }
          continue;
        }
        case "call": {
          let p = ast.procs.get(n.name),
            scope = Object.create(null);
          p.params.forEach((x, i) => (scope[x] = val(n.args[i])));
          enter(n.t);
          yield;
          yield* execute(p.body, scope, []);
          frames--;
          count(n.t);
          yield;
          continue;
        }
      }
      yield;
    }
  }
  const iterator = execute(ast.program);
  return {
    state,
    step() {
      if (state.done) return state;
      try {
        state.done = iterator.next().done;
      } catch (e) {
        state.error = e;
        state.done = true;
      }
      return state;
    },
  };
}
export function run(source, mode = "2d") {
  const e = createExecution(source, mode);
  while (!e.state.done) e.step();
  return { segments: e.state.segments, error: e.state.error };
}
