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
  rep: "nrpowt repcount",
};
for (const [k, v] of Object.entries(groups))
  for (const a of v.split(" ")) aliases[a] = k;
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
const nameRE = /^[\p{L}_][\p{L}\p{N}_]*$/u;
function lex(s) {
  if (s.length > 50000) fail("Program przekracza limit 50 000 znaków.");
  let a = [],
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
      t = { line, column, start };
    if (c === '"') {
      i++;
      while (i < s.length && s[i] !== '"' && s[i] !== "\n") i++;
      if (s[i] === '"') i++;
    } else if (/[\d.]/.test(c)) {
      while (i < s.length && /[\w.]/.test(s[i])) i++;
    } else if (/[\p{L}_:]/u.test(c)) {
      i++;
      while (i < s.length && /[\p{L}\p{N}_:]/u.test(s[i])) i++;
    } else if (/[<>]/.test(c)) {
      i++;
      if (s[i] === "=" || (c === "<" && s[i] === ">")) i++;
    } else i++;
    t.raw = s.slice(start, i);
    t.v = t.raw.toLowerCase();
    t.end = i;
    column += i - start;
    a.push(t);
    if (a.length > 10000) fail("Przekroczono limit 10 000 tokenów.", t);
  }
  return a;
}
export function compile(source, mode = "2d") {
  const ts = lex(source),
    procs = new Map();
  let i = 0,
    depth = 0,
    repeatDepth = 0,
    currentParams = new Set();
  const peek = () => ts[i],
    take = () => ts[i++],
    is = (v) => peek()?.v === v;
  function header(at) {
    let t = ts[at],
      j = at + 1,
      n = ts[j++];
    if (!n || n.line !== t.line || !nameRE.test(n.v) || aliases[n.v])
      fail("Nieprawidłowa nazwa procedury.", n || t);
    let params = [];
    if (ts[j]?.line === t.line) {
      if (ts[j].v === "ma:") {
        j++;
        let need = true;
        while (ts[j]?.line === t.line) {
          let p = ts[j++];
          if (need) {
            if (!nameRE.test(p.v) || aliases[p.v])
              fail("Oczekiwano nazwy parametru.", p);
            params.push(p.v);
          } else if (p.v !== ",") fail("Parametry oddziel przecinkami.", p);
          need = !need;
        }
        if (need) fail("Brakuje parametru po przecinku.", ts[j - 1]);
      } else {
        while (ts[j]?.line === t.line) {
          let p = ts[j++];
          if (
            !p.v.startsWith(":") ||
            !nameRE.test(p.v.slice(1)) ||
            aliases[p.v.slice(1)]
          )
            fail("Użyj ma: lub parametrów :nazwa.", p);
          params.push(p.v.slice(1));
        }
      }
    }
    if (new Set(params).size !== params.length)
      fail("Powtórzona nazwa parametru.", n);
    return { name: n.v, params, next: j, t: n };
  }
  for (let p = 0; p < ts.length; p++)
    if (aliases[ts[p].v] === "to") {
      if (p && ts[p - 1].line === ts[p].line)
        fail("Definicja musi zaczynać wiersz.", ts[p]);
      let h = header(p);
      if (procs.has(h.name)) fail("Procedura jest już zdefiniowana.", h.t);
      procs.set(h.name, { ...h, body: [] });
    }
  function expr(_min = 0, anchor) {
    const values = [],
      ops = [];
    let need = true,
      parens = 0;
    function reduce() {
      let o = ops.pop();
      if (o.unary)
        values.push({ kind: "unary", op: o.t.v, a: values.pop(), t: o.t });
      else {
        let b = values.pop(),
          a = values.pop();
        values.push({ kind: "binary", op: o.t.v, a, b, t: a.t });
      }
    }
    function signs() {
      while (ops.at(-1)?.unary) reduce();
    }
    while (true) {
      let t = peek();
      if (need) {
        if (!t) fail("Brakuje argumentu.", anchor);
        if (t.v === "+" || t.v === "-") {
          ops.push({ t, unary: true, p: 3 });
          take();
          continue;
        }
        if (t.v === "(") {
          ops.push({ t, group: true });
          take();
          parens++;
          continue;
        }
        let e;
        if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t.v))
          e = { kind: "num", value: Number(t.v), t };
        else if (aliases[t.v] === "rep") {
          if (!repeatDepth)
            fail("nrpowt można użyć tylko wewnątrz powtórzenia.", t);
          e = { kind: "rep", t };
        } else if (nameRE.test(t.v.replace(/^:/, "")) && !aliases[t.v])
          e = { kind: "name", name: t.v.replace(/^:/, ""), t };
        else fail("Oczekiwano liczby lub wyrażenia.", t);
        take();
        values.push(e);
        need = false;
        signs();
        continue;
      }
      if (t?.v === ")" && parens) {
        while (!ops.at(-1).group) reduce();
        let o = ops.pop();
        values.push({ kind: "group", a: values.pop(), t: o.t });
        parens--;
        take();
        signs();
        continue;
      }
      let p =
        t && (["+", "-"].includes(t.v) ? 1 : ["*", "/"].includes(t.v) ? 2 : 0);
      if (p) {
        let left = t.start > 0 && /\s/.test(source[t.start - 1]),
          right = /\s/.test(source[t.end] || "");
        if (left === right) {
          while (ops.length && !ops.at(-1).group && ops.at(-1).p >= p) reduce();
          ops.push({ t, p });
          take();
          need = true;
          continue;
        }
      }
      if (parens)
        fail(
          "Brakuje zamykającego nawiasu ).",
          t || ops.find((o) => o.group)?.t || anchor,
        );
      break;
    }
    while (ops.length) reduce();
    return values[0];
  }
  function body() {
    let t = take();
    if (t?.v !== "[") fail("Oczekiwano bloku [ ... ].", t || ts[i - 2]);
    if (++depth > 32) fail("Przekroczono głębokość 32 bloków.", t);
    let b = commands(true);
    if (!is("]")) fail("Brakuje zamykającego nawiasu ].", peek() || t);
    take();
    depth--;
    return b;
  }
  function commands(block = false, proc = false) {
    let out = [];
    while (peek() && !is("]")) {
      let t = peek(),
        op = aliases[t.v];
      if (op === "end" && proc) break;
      take();
      if (op === "to") {
        if (block || proc)
          fail("Definicje są dozwolone tylko na najwyższym poziomie.", t);
        let h = header(i - 1),
          p = procs.get(h.name);
        i = h.next;
        let old = repeatDepth;
        repeatDepth = 0;
        currentParams = new Set(p.params);
        p.body = commands(false, true);
        currentParams = new Set();
        repeatDepth = old;
        let end = peek();
        if (!end || aliases[end.v] !== "end")
          fail("Brakuje zakończenia już.", end || t);
        if (ts[i - 1]?.line === end.line || ts[i + 1]?.line === end.line)
          fail("Zakończenie już musi być samo w wierszu.", end);
        take();
        continue;
      }
      let n = { op, t };
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
        ].includes(op)
      ) {
        if (mode === "2d" && ["pitch", "down", "roll", "rollleft"].includes(op))
          fail("To polecenie działa tylko w trybie 3D.", t);
        n.a = expr(0, t);
      } else if (op === "color") {
        n.color = take();
        if (!n.color || !/^"#[0-9a-f]{6}"$/.test(n.color.v))
          fail('Kolor musi mieć postać "#16866a".', n.color || t);
      } else if (op === "let") {
        n.name = take();
        if (
          !n.name ||
          !nameRE.test(n.name.v) ||
          aliases[n.name.v] ||
          (procs.has(n.name.v) && !currentParams.has(n.name.v))
        )
          fail("Nieprawidłowa nazwa zmiennej.", n.name || t);
        n.a = expr(0, t);
      } else if (op === "repeat") {
        n.a = expr(0, t);
        repeatDepth++;
        n.body = body();
        repeatDepth--;
      } else if (op === "if" || op === "ifelse") {
        n.a = expr(0, t);
        n.cmp = take();
        if (!n.cmp || !["<", ">", "=", "<=", ">=", "<>"].includes(n.cmp.v))
          fail("Oczekiwano porównania, np. > lub =.", n.cmp || t);
        n.b = expr(0, t);
        n.body = body();
        if (op === "ifelse") n.other = body();
      } else if (["pu", "pd", "stop", "home", "cs"].includes(op)) {
      } else if (procs.has(t.v)) {
        n.op = "call";
        n.proc = t.v;
        n.args = procs.get(t.v).params.map(() => expr(0, t));
      } else fail("Nieznane polecenie lub zbędna wartość: " + t.raw, t);
      out.push(n);
    }
    return out;
  }
  let main = commands();
  if (peek()) fail("Nieoczekiwany nawias lub zakończenie.", peek());
  function declarations(b, set = new Set()) {
    for (let n of b) {
      if (n.op === "let") set.add(n.name.v);
      if (n.body) declarations(n.body, set);
      if (n.other) declarations(n.other, set);
    }
    return set;
  }
  let globals = declarations(main);
  function validate(b, locals) {
    function ve(e) {
      const stack = e ? [e] : [];
      while (stack.length) {
        let x = stack.pop();
        if (x.kind === "name" && !locals.has(x.name) && !globals.has(x.name))
          fail("Nieznana zmienna: " + x.name, x.t);
        if (x.a) stack.push(x.a);
        if (x.b) stack.push(x.b);
      }
    }
    for (let n of b) {
      ve(n.a);
      ve(n.b);
      n.args?.forEach(ve);
      if (["width", "repeat"].includes(n.op) && constant(n.a)) {
        let val;
        try {
          val = evaluate(n.a, {}, new Map(), 0);
        } catch {
          val = null;
        }
        if (val !== null) range(n.op, val, n.a.t);
      }
      if (n.body) validate(n.body, locals);
      if (n.other) validate(n.other, locals);
    }
  }
  validate(main, new Set());
  for (let p of procs.values())
    validate(p.body, declarations(p.body, new Set(p.params)));
  return { main, procs };
}
function constant(e) {
  const stack = [e];
  while (stack.length) {
    let x = stack.pop();
    if (x.kind === "name" || x.kind === "rep") return false;
    if (x.a) stack.push(x.a);
    if (x.b) stack.push(x.b);
  }
  return true;
}
function range(op, v, t) {
  if (
    !Number.isInteger(v) ||
    v < (op === "width" ? 1 : 0) ||
    v > (op === "width" ? 12 : 10000)
  )
    fail(
      op === "width"
        ? "Grubość musi być liczbą całkowitą od 1 do 12."
        : "Liczba powtórzeń musi być całkowita od 0 do 10 000.",
      t,
    );
}
function evaluate(e, local, global, rep) {
  const stack = [[e, false]],
    values = [];
  while (stack.length) {
    let [x, visited] = stack.pop(),
      v;
    if (!visited && x.a) {
      stack.push([x, true]);
      if (x.b) stack.push([x.b, false]);
      stack.push([x.a, false]);
      continue;
    }
    switch (x.kind) {
      case "num":
        v = x.value;
        break;
      case "name":
        v = Object.hasOwn(local, x.name) ? local[x.name] : global.get(x.name);
        if (v === undefined)
          fail("Zmienna " + x.name + " nie ma jeszcze wartości.", e.t);
        break;
      case "rep":
        v = rep;
        break;
      case "group":
        v = values.pop();
        break;
      case "unary":
        v = (x.op === "-" ? -1 : 1) * values.pop();
        break;
      case "binary": {
        let b = values.pop(),
          a = values.pop();
        if (x.op === "/" && b === 0) fail("Dzielenie przez zero.", e.t);
        v =
          x.op === "+"
            ? a + b
            : x.op === "-"
              ? a - b
              : x.op === "*"
                ? a * b
                : a / b;
      }
    }
    if (!Number.isFinite(v))
      fail("Wynik wyrażenia nie jest skończoną liczbą.", e.t);
    values.push(v);
  }
  return values[0];
}

export function createExecution(source, mode = "2d") {
  let state = {
      segments: [],
      position: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
      pen: true,
      color: "#16866a",
      width: 3,
      line: 0,
    },
    error = null,
    program;
  try {
    program = compile(source, mode);
  } catch (e) {
    error = toError(e);
  }
  let operations = 0,
    frames = 0;
  const global = new Map();
  const STOP = Symbol();
  function tick(t) {
    if (++operations > 10000) fail("Przekroczono limit 10 000 operacji.", t);
    state.line = t.line;
  }
  function enter(t) {
    if (++frames > 32)
      fail("Przekroczono limit 32 aktywnych wywołań i powtórzeń.", t);
  }
  function move(to, t) {
    if (to.some((x) => !Number.isFinite(x) || Math.abs(x) > 100000))
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
  function rotate(a, b, degrees) {
    let c = Math.cos(((degrees % 360) * Math.PI) / 180),
      s = Math.sin(((degrees % 360) * Math.PI) / 180),
      av = state[a],
      bv = state[b];
    state[a] = av.map((x, i) => x * c + bv[i] * s);
    state[b] = bv.map((x, i) => x * c - av[i] * s);
  }
  function* exec(body, local = Object.create(null), inProc = false, rep = 0) {
    for (let n of body) {
      tick(n.t);
      let val = n.a ? evaluate(n.a, local, global, rep) : 0;
      switch (n.op) {
        case "fd":
        case "bk":
          move(
            state.position.map(
              (x, i) => x + state.heading[i] * val * (n.op === "bk" ? -1 : 1),
            ),
            n.a.t,
          );
          break;
        case "rt":
        case "lt":
          rotate("heading", "right", val * (n.op === "lt" ? -1 : 1));
          break;
        case "pitch":
        case "down":
          rotate("heading", "up", val * (n.op === "down" ? -1 : 1));
          break;
        case "roll":
        case "rollleft":
          rotate("up", "right", val * (n.op === "rollleft" ? -1 : 1));
          break;
        case "pu":
          state.pen = false;
          break;
        case "pd":
          state.pen = true;
          break;
        case "color":
          state.color = n.color.v.slice(1, -1);
          break;
        case "width":
          range("width", val, n.a.t);
          state.width = val;
          break;
        case "let":
          if (inProc) local[n.name.v] = val;
          else global.set(n.name.v, val);
          break;
        case "home":
          move([0, 0, 0], n.t);
          state.heading = [0, 1, 0];
          state.right = [1, 0, 0];
          state.up = [0, 0, 1];
          break;
        case "cs":
          state.segments = [];
          break;
        case "stop":
          yield n.t;
          throw STOP;
        case "repeat":
          range("repeat", val, n.a.t);
          yield n.t;
          enter(n.t);
          for (let j = 1; j <= val; j++) {
            yield* exec(n.body, local, inProc, j);
            tick(n.t);
          }
          frames--;
          continue;
        case "if":
        case "ifelse": {
          let b = evaluate(n.b, local, global, rep),
            v = n.cmp.v,
            yes =
              v === "<"
                ? val < b
                : v === ">"
                  ? val > b
                  : v === "="
                    ? val === b
                    : v === "<="
                      ? val <= b
                      : v === ">="
                        ? val >= b
                        : val !== b;
          yield n.t;
          let chosen = yes ? n.body : n.other;
          if (chosen) {
            yield* exec(chosen, local, inProc, rep);
            tick(n.t);
          }
          continue;
        }
        case "call": {
          let p = program.procs.get(n.proc),
            args = n.args.map((a) => evaluate(a, local, global, rep));
          yield n.t;
          enter(n.t);
          try {
            yield* exec(
              p.body,
              Object.assign(
                Object.create(null),
                Object.fromEntries(p.params.map((k, i) => [k, args[i]])),
              ),
              true,
              0,
            );
          } catch (e) {
            if (e !== STOP) throw e;
          }
          frames--;
          tick(n.t);
          continue;
        }
      }
      yield n.t;
    }
  }
  function* runner() {
    if (error) return;
    try {
      yield* exec(program.main);
    } catch (e) {
      if (e !== STOP) error = toError(e);
    }
  }
  let iterator = runner();
  return {
    state,
    get error() {
      return error;
    },
    step() {
      let r = iterator.next();
      return { done: r.done, error, state };
    },
    finish() {
      while (!this.step().done) {}
      return { segments: state.segments, error };
    },
  };
}
function toError(e) {
  return {
    message: e.message || "Błąd programu.",
    line: e.line || 1,
    column: e.column || 1,
  };
}
export function run(source, mode = "2d") {
  return createExecution(source, mode).finish();
}
