export const aliases = {
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
  rollleft: "pl przechyllewo rl rollleft",
};
const commands = Object.fromEntries(
  Object.entries(aliases).flatMap(([k, v]) => v.split(" ").map((a) => [a, k])),
);
const reserved = new Set([
  ...Object.keys(commands),
  "oto",
  "to",
  "już",
  "juz",
  "end",
  "nrpowt",
  "repcount",
]);
const nameOK = (s) => /^[\p{L}_][\p{L}\p{N}_]*$/u.test(s);
class LogoError extends Error {
  constructor(message, t) {
    super(message);
    this.line = t?.line || 1;
    this.column = t?.column || 1;
  }
}
const fail = (s, t) => {
  throw new LogoError(s, t);
};
function lex(s) {
  if (s.length > 50000) fail("Program przekracza 50 000 znaków.");
  let out = [],
    i = 0,
    line = 1,
    column = 1;
  while (i < s.length) {
    let c = s[i];
    if (/\s/.test(c)) {
      if (c === "\n") {
        line++;
        column = 1;
      } else column++;
      i++;
      continue;
    }
    if (c === ";") {
      while (i < s.length && s[i] !== "\n") {
        i++;
        column++;
      }
      continue;
    }
    let start = i,
      l = line,
      col = column,
      raw;
    if (c === '"') {
      i++;
      while (i < s.length && s[i] !== '"' && s[i] !== "\n") i++;
      if (s[i] === '"') i++;
      raw = s.slice(start, i);
    } else {
      let m = s
        .slice(i)
        .match(
          /^(?:<=|>=|<>|[+*\/()\[\],=<>-]|(?:\d+(?:\.\d*)?|\.\d+)|:?[\p{L}_][\p{L}\p{N}_]*:?)/u,
        );
      raw = m?.[0] || c;
      i += raw.length;
      if (/^\d/.test(raw) && /[\p{L}\d_.]/u.test(s[i] || "")) {
        while (i < s.length && !/[\s\[\]()]/.test(s[i])) i++;
        raw = s.slice(start, i);
      }
    }
    column += i - start;
    out.push({
      v: raw.toLowerCase(),
      line: l,
      column: col,
      start,
      end: i,
      binary: /\s/.test(s[start - 1] || "") === /\s/.test(s[i] || ""),
    });
    if (out.length > 10000)
      fail("Przekroczono limit 10 000 tokenów.", out.at(-1));
  }
  return out;
}
export function parse(source, mode = "2d") {
  const tokens = lex(source),
    procs = new Map(),
    top = [];
  let i = 0,
    definitionDepth = 0;
  while (i < tokens.length) {
    let t = tokens[i];
    if (["oto", "to"].includes(t.v)) {
      if (definitionDepth)
        fail("Definicje są dozwolone tylko na najwyższym poziomie.", t);
      if (tokens[i - 1]?.line === t.line)
        fail("Definicja musi zaczynać wiersz.", t);
      let header = [];
      while (i < tokens.length && tokens[i].line === t.line)
        header.push(tokens[i++]);
      let n = header[1];
      if (!n || !nameOK(n.v) || reserved.has(n.v) || procs.has(n.v))
        fail("Niepoprawna lub powtórzona nazwa procedury.", n || t);
      let rest = header.slice(2),
        params = [];
      if (rest[0]?.v === "ma:") {
        rest.shift();
        if (!rest.length) fail("Brak parametru.", n);
        for (let j = 0; j < rest.length; j++) {
          if (j % 2 === 1) {
            if (rest[j].v !== ",")
              fail("Oddziel parametry przecinkiem.", rest[j]);
          } else params.push(rest[j]);
        }
        if (rest.at(-1)?.v === ",") fail("Brak parametru.", rest.at(-1));
      } else {
        for (let p of rest) {
          if (!p.v.startsWith(":")) fail("Użyj ma: lub :parametr.", p);
          params.push({ ...p, v: p.v.slice(1) });
        }
      }
      for (let p of params) {
        if (
          !nameOK(p.v) ||
          reserved.has(p.v) ||
          params.filter((x) => x.v === p.v).length > 1
        )
          fail("Niepoprawny parametr.", p);
      }
      let body = [];
      while (i < tokens.length && !["już", "juz", "end"].includes(tokens[i].v))
        body.push(tokens[i++]);
      if (i === tokens.length) fail("Brakuje końca procedury: już.", t);
      let end = tokens[i++];
      if (tokens[i - 2]?.line === end.line || tokens[i]?.line === end.line)
        fail("już musi być osobno w wierszu.", end);
      procs.set(n.v, { params: params.map((p) => p.v), tokens: body, t: n });
    } else {
      if (t.v === "[") definitionDepth++;
      if (t.v === "]") definitionDepth--;
      top.push(tokens[i++]);
    }
  }
  const declarations = (ts) =>
    new Set(
      ts.flatMap((t, i) =>
        commands[t.v] === "let" && ts[i + 1] ? [ts[i + 1].v] : [],
      ),
    );
  const globals = declarations(top);
  function bodyParse(ts, local, params = []) {
    let p = 0;
    const known = new Set([...globals, ...local]);
    function expr(rep, origin) {
      let t = ts[p];
      if (!t) fail("Brakuje argumentu.", origin);
      p++;
      let e;
      if (t.v === "+" || t.v === "-")
        e = { type: "unary", op: t.v, a: atom(rep, origin), t };
      else if (t.v === "(") {
        e = expression(rep, origin, 0);
        if (ts[p]?.v !== ")") fail("Brakuje nawiasu ).", ts[p] || t);
        p++;
        e = { ...e, t };
      } else if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t.v))
        e = { type: "num", value: Number(t.v), t };
      else {
        let n = t.v.replace(/^:/, "");
        if (["nrpowt", "repcount"].includes(n)) {
          if (!rep) fail("nrpowt wymaga otaczającego powtórzenia.", t);
          e = { type: "rep", t };
        } else if (known.has(n)) e = { type: "var", name: n, t };
        else fail("Nieznana wartość lub brak argumentu: " + t.v, t);
      }
      return e;
    }
    function atom(rep, o) {
      return expr(rep, o);
    }
    function expression(rep, o, min = 0) {
      let a = atom(rep, o);
      while (p < ts.length) {
        let op = ts[p],
          prec = ["*", "/"].includes(op.v)
            ? 2
            : ["+", "-"].includes(op.v)
              ? 1
              : 0;
        if (!prec || prec < min || !op.binary) break;
        p++;
        let b = expression(rep, o, prec + 1);
        a = { type: "bin", op: op.v, a, b, t: a.t };
      }
      return a;
    }
    function block(depth, rep) {
      if (depth > 32) fail("Przekroczono 32 poziomy nawiasów.", ts[p - 1]);
      let nodes = [];
      while (p < ts.length && ts[p].v !== "]") {
        let t = ts[p++],
          cmd = commands[t.v],
          n = { cmd, t };
        if (!cmd && procs.has(t.v)) {
          n.cmd = "call";
          n.name = t.v;
          n.args = procs.get(t.v).params.map(() => expression(rep, t));
        } else if (!cmd) fail("Nieznane polecenie: " + t.v, t);
        else if (
          ["pitch", "down", "roll", "rollleft"].includes(cmd) &&
          mode !== "3d"
        )
          fail("To polecenie wymaga trybu 3D.", t);
        else if (cmd === "color") {
          let c = ts[p++];
          if (!c || !/^"#[0-9a-f]{6}"$/.test(c.v))
            fail('Kolor musi mieć postać "#16866a".', c || t);
          n.color = c.v.slice(1, -1);
        } else if (cmd === "let") {
          let v = ts[p++];
          if (
            !v ||
            !nameOK(v.v) ||
            reserved.has(v.v) ||
            (procs.has(v.v) && !params.includes(v.v))
          )
            fail("Niepoprawna nazwa zmiennej.", v || t);
          n.name = v.v;
          n.expr = expression(rep, t);
        } else if (["if", "ifelse"].includes(cmd)) {
          n.a = expression(rep, t);
          n.op = ts[p++];
          if (!n.op || !["<", ">", "=", "<=", ">=", "<>"].includes(n.op.v))
            fail("Oczekiwano porównania.", n.op || t);
          n.b = expression(rep, t);
        } else if (!["pu", "pd", "home", "clear", "stop"].includes(cmd))
          n.expr = expression(rep, t);
        if (["width", "repeat"].includes(cmd) && constant(n.expr)) {
          let value;
          try {
            value = evaluate(n.expr, {}, [], n.expr.t);
          } catch {}
          if (value !== undefined) validate(cmd, value, n.expr.t);
        }
        if (["repeat", "if", "ifelse"].includes(cmd)) {
          n.bodies = [];
          for (let k = 0; k < (cmd === "ifelse" ? 2 : 1); k++) {
            if (ts[p]?.v !== "[") fail("Oczekiwano nawiasu [.", ts[p] || t);
            p++;
            n.bodies.push(block(depth + 1, rep + (cmd === "repeat" ? 1 : 0)));
            if (ts[p]?.v !== "]") fail("Brakuje nawiasu ].", ts[p] || t);
            p++;
          }
        }
        nodes.push(n);
      }
      return nodes;
    }
    let result = block(0, 0);
    if (p < ts.length) fail("Nieoczekiwany nawias ].", ts[p]);
    return result;
  }
  for (let proc of procs.values())
    proc.body = bodyParse(
      proc.tokens,
      new Set([...proc.params, ...declarations(proc.tokens)]),
      proc.params,
    );
  return { body: bodyParse(top, []), procs };
}
function constant(e) {
  return (
    e.type === "num" ||
    (e.type === "unary" && constant(e.a)) ||
    (e.type === "bin" && constant(e.a) && constant(e.b))
  );
}
function validate(cmd, v, t) {
  let max = cmd === "width" ? 12 : 10000,
    min = cmd === "width" ? 1 : 0;
  if (!Number.isInteger(v) || v < min || v > max)
    fail(
      `${cmd === "width" ? "Grubość" : "Liczba powtórzeń"} musi być liczbą całkowitą od ${min} do ${max}.`,
      t,
    );
}
function evaluate(e, env, reps, origin = e.t) {
  let v;
  if (e.type === "num") v = e.value;
  else if (e.type === "var") {
    v = env[e.name];
    if (v === undefined)
      fail("Zmienna " + e.name + " nie ma jeszcze wartości.", origin);
  } else if (e.type === "rep") v = reps.at(-1);
  else if (e.type === "unary")
    v = (e.op === "-" ? -1 : 1) * evaluate(e.a, env, reps, origin);
  else {
    let a = evaluate(e.a, env, reps, origin),
      b = evaluate(e.b, env, reps, origin);
    if (e.op === "/" && b === 0) fail("Nie można dzielić przez zero.", origin);
    v =
      e.op === "+"
        ? a + b
        : e.op === "-"
          ? a - b
          : e.op === "*"
            ? a * b
            : a / b;
  }
  if (!Number.isFinite(v)) fail("Wynik nie jest skończoną liczbą.", origin);
  return v;
}
const initial = () => ({
  pos: [0, 0, 0],
  heading: [0, 1, 0],
  right: [1, 0, 0],
  up: [0, 0, 1],
  pen: true,
  color: "#16866a",
  width: 3,
});
export function createExecution(source, mode = "2d") {
  let state = initial(),
    segments = [],
    error = null,
    tree;
  try {
    tree = parse(source, mode);
  } catch (e) {
    error = { message: e.message, line: e.line || 1, column: e.column || 1 };
  }
  let ops = 0,
    globals = Object.create(null);
  const tick = (t) => {
    if (++ops > 10000) fail("Przekroczono 10 000 operacji.", t);
  };
  function move(pos, t) {
    if (pos.some((x) => !Number.isFinite(x) || Math.abs(x) > 100000))
      fail("Współrzędne przekraczają ±100 000.", t);
    if (state.pen && pos.some((x, i) => x !== state.pos[i])) {
      if (segments.length >= 10000) fail("Przekroczono 10 000 odcinków.", t);
      segments.push({
        from: [...state.pos],
        to: [...pos],
        color: state.color,
        width: state.width,
      });
    }
    state.pos = pos;
  }
  function rotate(a, b, degrees) {
    let c = Math.cos((degrees * Math.PI) / 180),
      s = Math.sin((degrees * Math.PI) / 180),
      aa = state[a],
      bb = state[b];
    state[a] = aa.map((v, i) => v * c + bb[i] * s);
    state[b] = bb.map((v, i) => v * c - aa[i] * s);
  }
  function* execute(nodes, env, reps, frames) {
    for (let n of nodes) {
      tick(n.t);
      let v = n.expr ? evaluate(n.expr, env, reps) : 0;
      switch (n.cmd) {
        case "fd":
        case "bk":
          move(
            state.pos.map(
              (x, i) => x + state.heading[i] * v * (n.cmd === "bk" ? -1 : 1),
            ),
            n.expr.t,
          );
          break;
        case "rt":
        case "lt":
          rotate("heading", "right", v * (n.cmd === "lt" ? -1 : 1));
          break;
        case "pitch":
        case "down":
          rotate("heading", "up", v * (n.cmd === "down" ? -1 : 1));
          break;
        case "roll":
        case "rollleft":
          rotate("up", "right", v * (n.cmd === "rollleft" ? -1 : 1));
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
          validate("width", v, n.expr.t);
          state.width = v;
          break;
        case "clear":
          segments.length = 0;
          break;
        case "home":
          move([0, 0, 0], n.t);
          Object.assign(state, {
            heading: [0, 1, 0],
            right: [1, 0, 0],
            up: [0, 0, 1],
          });
          break;
        case "let":
          env[n.name] = v;
          break;
        case "stop":
          yield n.t;
          return true;
        case "repeat":
          validate("repeat", v, n.expr.t);
          if (v && frames >= 32) fail("Przekroczono 32 aktywne ramki.", n.t);
          yield n.t;
          for (let j = 1; j <= v; j++) {
            if (yield* execute(n.bodies[0], env, [...reps, j], frames + 1))
              return true;
            tick(n.t);
            yield n.t;
          }
          continue;
        case "if":
        case "ifelse": {
          let a = evaluate(n.a, env, reps),
            b = evaluate(n.b, env, reps),
            yes = {
              "<": a < b,
              ">": a > b,
              "=": a === b,
              "<=": a <= b,
              ">=": a >= b,
              "<>": a !== b,
            }[n.op.v],
            body = n.bodies[yes ? 0 : 1];
          yield n.t;
          if (body) {
            if (yield* execute(body, env, reps, frames)) return true;
            tick(n.t);
            yield n.t;
          }
          continue;
        }
        case "call": {
          if (frames >= 32) fail("Przekroczono 32 aktywne ramki.", n.t);
          let proc = tree.procs.get(n.name),
            local = Object.create(globals);
          proc.params.forEach(
            (p, i) => (local[p] = evaluate(n.args[i], env, reps)),
          );
          yield n.t;
          yield* execute(proc.body, local, [], frames + 1);
          tick(n.t);
          yield n.t;
          continue;
        }
      }
      yield n.t;
    }
  }
  let iterator = error ? null : execute(tree.body, globals, [], 0),
    done = !!error;
  return {
    state,
    segments,
    get error() {
      return error;
    },
    get done() {
      return done;
    },
    get operations() {
      return ops;
    },
    step() {
      if (done) return null;
      try {
        let r = iterator.next();
        done = r.done;
        return r.value;
      } catch (e) {
        error = {
          message: e.message,
          line: e.line || 1,
          column: e.column || 1,
        };
        done = true;
        return null;
      }
    },
    result() {
      return { segments, error };
    },
  };
}
export function run(source, mode = "2d") {
  let execution = createExecution(source, mode);
  while (!execution.done) execution.step();
  return execution.result();
}
