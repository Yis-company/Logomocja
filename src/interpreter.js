export const groups = {
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
  pitchup: "gora góra pitchup",
  pitchdown: "dol dół pitchdown",
  rollright: "pp przechylprawo rr rollright",
  rollleft: "pl przechyllewo rl rollleft",
  to: "oto to",
  end: "już juz end",
  repcount: "nrpowt repcount",
};
export const aliases = Object.assign(
  Object.create(null),
  Object.fromEntries(
    Object.entries(groups).flatMap(([k, v]) => v.split(" ").map((a) => [a, k])),
  ),
);
class LogoError extends Error {
  constructor(message, t) {
    super(message);
    this.line = t?.line || 1;
    this.column = t?.column || 1;
  }
}
const fail = (m, t) => {
  throw new LogoError(m, t);
};
const nameOK = (s) => /^[\p{L}_][\p{L}\p{N}_]*$/u.test(s);
export function tokenize(source) {
  if (source.length > 50000)
    fail("Przekroczono limit 50 000 znaków.", { line: 1, column: 1 });
  const ts = [];
  let i = 0,
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
    let start = i,
      t = { line, column, start };
    let m = source
      .slice(i)
      .match(
        /^(?:ma:|"[^"\n]*"?|<=|>=|<>|[\[\](),+*/=<>-]|(?::)?[\p{L}_][\p{L}\p{N}_]*|(?:\d+(?:\.\d*)?|\.\d+)[\p{L}\p{N}_.]*)/iu,
      );
    if (!m) fail("Nieznany znak „" + c + "”.", t);
    t.raw = m[0];
    t.v = t.raw.toLowerCase();
    i += t.raw.length;
    column += t.raw.length;
    t.end = i;
    t.binary =
      /\s/.test(source[start - 1] || " ") === /\s/.test(source[i] || " ");
    ts.push(t);
    if (ts.length > 10000) fail("Przekroczono limit 10 000 tokenów.", t);
  }
  return ts;
}
// Iterative evaluation keeps valid, long expressions independent of the JS call stack.
function calculate(e, env, rep) {
  const work = [[e, false]],
    values = [];
  while (work.length) {
    const [node, visited] = work.pop();
    let v;
    if (!visited && (node.kind === "unary" || node.kind === "binary")) {
      work.push([node, true]);
      if (node.b) work.push([node.b, false]);
      work.push([node.a, false]);
      continue;
    }
    if (node.kind === "num") v = node.value;
    else if (node.kind === "name") {
      const local = env.local && Object.hasOwn(env.local, node.name);
      const scope = local ? env.local : env.global;
      if (!Object.hasOwn(scope, node.name))
        fail("Zmienna „" + node.name + "” nie ma jeszcze wartości.", node.t);
      v = scope[node.name];
    } else if (node.kind === "rep") v = rep;
    else if (node.kind === "unary")
      v = (node.op === "-" ? -1 : 1) * values.pop();
    else {
      const b = values.pop(),
        a = values.pop();
      if (node.op === "/" && b === 0) fail("Dzielenie przez zero.", node.t);
      v = {
        "+": () => a + b,
        "-": () => a - b,
        "*": () => a * b,
        "/": () => a / b,
      }[node.op]();
    }
    if (!Number.isFinite(v)) fail("Wynik nie jest skończoną liczbą.", node.t);
    values.push(v);
  }
  return values[0];
}
function constant(e) {
  const work = [e];
  while (work.length) {
    const n = work.pop();
    if (n.kind === "name" || n.kind === "rep") return false;
    if (n.a) work.push(n.a);
    if (n.b) work.push(n.b);
  }
  return true;
}
function range(kind, v, t) {
  if (kind === "width" && (!Number.isInteger(v) || v < 1 || v > 12))
    fail("Grubość musi być liczbą całkowitą od 1 do 12.", t);
  if (kind === "repeat" && (!Number.isInteger(v) || v < 0 || v > 10000))
    fail("Liczba powtórzeń musi być całkowita, od 0 do 10 000.", t);
}
export function parse(source, mode = "2d") {
  const all = tokenize(source),
    procs = new Map(),
    top = [];
  let bracket = 0;
  for (let i = 0; i < all.length; ) {
    const t = all[i];
    if (aliases[t.v] === "to") {
      if (bracket || all[i - 1]?.line === t.line)
        fail(
          "Definicja oto musi zaczynać osobną linię na najwyższym poziomie.",
          t,
        );
      let header = [];
      i++;
      while (i < all.length && all[i].line === t.line) header.push(all[i++]);
      let n = header.shift();
      if (!n || !nameOK(n.v) || aliases[n.v] || procs.has(n.v))
        fail("Niepoprawna lub powtórzona nazwa procedury.", n || t);
      let params = [];
      if (header.length) {
        if (header[0].v === "ma:") {
          header.shift();
          let expect = true;
          for (const p of header) {
            if (expect) {
              if (!nameOK(p.v) || aliases[p.v])
                fail("Niepoprawny parametr.", p);
              params.push(p.v);
            } else if (p.v !== ",") fail("Parametry oddziel przecinkiem.", p);
            expect = !expect;
          }
          if (expect) fail("Brakuje parametru.", header.at(-1) || t);
        } else {
          for (const p of header) {
            if (
              !p.v.startsWith(":") ||
              !nameOK(p.v.slice(1)) ||
              aliases[p.v.slice(1)]
            )
              fail("Użyj ma: nazwa, nazwa lub :nazwa.", p);
            params.push(p.v.slice(1));
          }
        }
      }
      if (new Set(params).size !== params.length)
        fail("Parametry nie mogą się powtarzać.", n);
      const body = [];
      let ended = false;
      while (i < all.length) {
        let b = all[i++];
        if (aliases[b.v] === "to") fail("Nie można zagnieżdżać definicji.", b);
        if (aliases[b.v] === "end") {
          if (all[i - 2]?.line === b.line || all[i]?.line === b.line)
            fail("już musi być samo w linii.", b);
          ended = true;
          break;
        }
        body.push(b);
      }
      if (!ended) fail("Brakuje końca procedury: już.", t);
      procs.set(n.v, { name: n.v, params, t, raw: body });
    } else {
      if (t.v === "[") bracket++;
      if (t.v === "]") bracket--;
      top.push(t);
      i++;
    }
  }
  const declared = (ts) => {
    const names = new Set();
    for (let i = 0; i < ts.length; i++)
      if (aliases[ts[i].v] === "let") {
        let n = ts[i + 1];
        if (!n || !nameOK(n.v) || aliases[n.v] || procs.has(n.v))
          fail("Niepoprawna nazwa zmiennej.", n || ts[i]);
        names.add(n.v);
      }
    return names;
  };
  const globals = declared(top);
  function bodyParse(ts, locals) {
    let i = 0;
    // Shunting-yard parser: parentheses and unary chains do not consume call frames.
    function expr(rep, anchor) {
      const values = [],
        ops = [];
      let expected = true,
        parens = 0;
      const reduce = () => {
        const op = ops.pop();
        if (op.unary)
          values.push({ kind: "unary", op: op.t.v, a: values.pop(), t: op.t });
        else {
          const b = values.pop(),
            a = values.pop();
          values.push({ kind: "binary", op: op.t.v, a, b, t: a.t });
        }
      };
      const unary = () => {
        while (ops.at(-1)?.unary) reduce();
      };
      while (true) {
        const t = ts[i];
        if (expected) {
          if (!t) fail("Brakuje argumentu.", anchor);
          if (t.v === "+" || t.v === "-") {
            ops.push({ unary: true, t, prec: 3 });
            i++;
            continue;
          }
          if (t.v === "(") {
            ops.push({ paren: true, t });
            parens++;
            i++;
            continue;
          }
          let e;
          if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t.v))
            e = { kind: "num", value: Number(t.v), t };
          else if (aliases[t.v] === "repcount") {
            if (!rep)
              fail("nrpowt jest dostępny tylko wewnątrz powtórzenia.", t);
            e = { kind: "rep", t };
          } else {
            const n = t.v.replace(/^:/, "");
            if (!nameOK(n) || (!locals.has(n) && !globals.has(n)))
              fail("Nieznana wartość lub brak argumentu: " + t.raw + ".", t);
            e = { kind: "name", name: n, t };
          }
          values.push(e);
          i++;
          expected = false;
          unary();
          continue;
        }
        const prec = t && { "+": 1, "-": 1, "*": 2, "/": 2 }[t.v];
        if (prec && t.binary) {
          while (ops.length && !ops.at(-1).paren && ops.at(-1).prec >= prec)
            reduce();
          ops.push({ t, prec });
          i++;
          expected = true;
          continue;
        }
        if (t?.v === ")" && parens) {
          while (!ops.at(-1).paren) reduce();
          const opening = ops.pop();
          values[values.length - 1] = { ...values.at(-1), t: opening.t };
          parens--;
          i++;
          unary();
          continue;
        }
        if (parens)
          fail(
            "Brakuje zamykającego nawiasu ).",
            t || ops.find((op) => op.paren).t,
          );
        break;
      }
      while (ops.length) reduce();
      return values[0];
    }
    function block(depth = 0, rep = 0, closing = false) {
      let out = [];
      while (i < ts.length && ts[i].v !== "]") {
        let t = ts[i++],
          k = aliases[t.v],
          n = { k, t };
        if (!k && procs.has(t.v)) {
          n.k = "call";
          n.name = t.v;
          n.args = procs.get(t.v).params.map(() => expr(rep, t));
        } else if (
          [
            "fd",
            "bk",
            "rt",
            "lt",
            "width",
            "pitchup",
            "pitchdown",
            "rollright",
            "rollleft",
            "repeat",
          ].includes(k)
        ) {
          if (mode === "2d" && /^(pitch|roll)/.test(k))
            fail("To polecenie działa tylko w trybie 3D.", t);
          n.e = expr(rep, t);
          if ((k === "width" || k === "repeat") && constant(n.e)) {
            try {
              range(k, calculate(n.e, { global: {} }, 0), n.e.t);
            } catch (e) {
              if (!/zero|skończoną/.test(e.message)) throw e;
            }
          }
        } else if (k === "let") {
          n.name = ts[i++]?.v;
          n.e = expr(rep, t);
        } else if (k === "color") {
          let c = ts[i++];
          if (!c || !/^"#[0-9a-f]{6}"$/.test(c.v))
            fail(
              'Kolor zapisz jako "#16866a" — sześć cyfr szesnastkowych.',
              c || t,
            );
          n.color = c.v.slice(1, -1);
        } else if (k === "if" || k === "ifelse") {
          n.a = expr(rep, t);
          n.cmp = ts[i++];
          if (!n.cmp || !["<", ">", "=", "<=", ">=", "<>"].includes(n.cmp.v))
            fail("Brakuje porównania: <, >, =, <=, >= lub <>.", n.cmp || t);
          n.b = expr(rep, t);
        } else if (!["pu", "pd", "home", "cs", "stop"].includes(k))
          fail("Nieznane polecenie: " + t.raw + ".", t);
        if (["repeat", "if", "ifelse"].includes(k)) {
          const read = () => {
            let b = ts[i++];
            if (b?.v !== "[") fail("Oczekiwano nawiasu [.", b || t);
            if (depth >= 32) fail("Przekroczono 32 poziomy nawiasów.", b);
            return block(depth + 1, rep + (k === "repeat" ? 1 : 0), true);
          };
          n.body = read();
          if (k === "ifelse") n.other = read();
        }
        out.push(n);
      }
      if (closing) {
        if (ts[i]?.v !== "]")
          fail("Brakuje zamykającego nawiasu ].", ts.at(-1));
        i++;
      } else if (ts[i]) fail("Nieoczekiwany nawias ].", ts[i]);
      return out;
    }
    return block();
  }
  for (const p of procs.values()) {
    p.locals = new Set([...p.params, ...declared(p.raw)]);
    p.body = bodyParse(p.raw, p.locals);
  }
  return { body: bodyParse(top, new Set()), procs };
}
export function createMachine(source, mode = "2d") {
  const state = {
    segments: [],
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: "#16866a",
    width: 3,
    error: null,
    line: null,
    operations: 0,
    done: false,
  };
  let program;
  try {
    program = parse(source, mode);
  } catch (e) {
    state.error = {
      message: e.message,
      line: e.line || 1,
      column: e.column || 1,
    };
    state.done = true;
    return { state, step: () => state };
  }
  let frames = 0;
  const global = Object.create(null);
  const op = (t) => {
    if (++state.operations > 10000)
      fail("Przekroczono limit 10 000 operacji.", t);
  };
  const enter = (t) => {
    if (++frames > 32)
      fail("Przekroczono limit 32 aktywnych wywołań i powtórzeń.", t);
  };
  const value = (e, env, rep) => {
    try {
      return calculate(e, env, rep);
    } catch (err) {
      err.line = e.t.line;
      err.column = e.t.column;
      throw err;
    }
  };
  const move = (p, t) => {
    if (p.some((v) => !Number.isFinite(v) || Math.abs(v) > 100000))
      fail("Współrzędne przekraczają ±100 000.", t);
    if (p.some((v, i) => v !== state.pos[i]) && state.pen) {
      if (state.segments.length >= 10000)
        fail("Przekroczono limit 10 000 odcinków.", t);
      state.segments.push({
        from: [...state.pos],
        to: p,
        color: state.color,
        width: state.width,
      });
    }
    state.pos = p;
  };
  const rotate = (a, b, deg) => {
    let c = Math.cos(((deg % 360) * Math.PI) / 180),
      s = Math.sin(((deg % 360) * Math.PI) / 180),
      av = state[a],
      bv = state[b];
    state[a] = av.map((v, i) => v * c + bv[i] * s);
    state[b] = bv.map((v, i) => v * c - av[i] * s);
  };
  function* execute(body, env, rep = 0) {
    for (const n of body) {
      op(n.t);
      state.line = n.t.line;
      let v = n.e ? value(n.e, env, rep) : 0;
      switch (n.k) {
        case "fd":
        case "bk":
          move(
            state.pos.map(
              (x, i) => x + state.heading[i] * v * (n.k === "bk" ? -1 : 1),
            ),
            n.t,
          );
          break;
        case "rt":
        case "lt":
          rotate("heading", "right", v * (n.k === "lt" ? -1 : 1));
          break;
        case "pitchup":
        case "pitchdown":
          rotate("heading", "up", v * (n.k === "pitchdown" ? -1 : 1));
          break;
        case "rollright":
        case "rollleft":
          rotate("up", "right", v * (n.k === "rollleft" ? -1 : 1));
          break;
        case "pu":
          state.pen = false;
          break;
        case "pd":
          state.pen = true;
          break;
        case "color":
          state.color = n.color;
          break;
        case "width":
          range("width", v, n.e.t);
          state.width = v;
          break;
        case "let":
          (env.local || global)[n.name] = v;
          break;
        case "cs":
          state.segments = [];
          break;
        case "home":
          move([0, 0, 0], n.t);
          state.heading = [0, 1, 0];
          state.right = [1, 0, 0];
          state.up = [0, 0, 1];
          break;
        case "stop":
          yield;
          return true;
        case "repeat":
          range("repeat", v, n.e.t);
          yield;
          enter(n.t);
          for (let j = 1; j <= v; j++) {
            if (yield* execute(n.body, env, j)) {
              frames--;
              return true;
            }
            op(n.t);
          }
          frames--;
          continue;
        case "if":
        case "ifelse": {
          let a = value(n.a, env, rep),
            b = value(n.b, env, rep),
            yes = {
              "<": a < b,
              ">": a > b,
              "=": a === b,
              "<=": a <= b,
              ">=": a >= b,
              "<>": a !== b,
            }[n.cmp.v];
          yield;
          let branch = yes ? n.body : n.other;
          if (branch) {
            if (yield* execute(branch, env, rep)) return true;
            op(n.t);
          }
          continue;
        }
        case "call": {
          const p = program.procs.get(n.name),
            args = n.args.map((e) => value(e, env, rep));
          yield;
          enter(n.t);
          yield* execute(p.body, {
            global,
            local: Object.assign(
              Object.create(null),
              Object.fromEntries(p.params.map((x, i) => [x, args[i]])),
            ),
            locals: p.locals,
          });
          frames--;
          op(n.t);
          continue;
        }
      }
      yield;
    }
  }
  const iterator = execute(program.body, { global });
  return {
    state,
    step() {
      if (state.done) return state;
      try {
        state.done = iterator.next().done;
      } catch (e) {
        state.error = {
          message: e.message,
          line: e.line || 1,
          column: e.column || 1,
        };
        state.done = true;
      }
      return state;
    },
  };
}
export function run(source, mode = "2d") {
  const m = createMachine(source, mode);
  while (!m.state.done) m.step();
  return { segments: m.state.segments, error: m.state.error };
}
