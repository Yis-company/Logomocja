// src/interpreter.js
var aliases = {};
for (const [canonical, words] of Object.entries({ forward: "np naprzod naprzód fd forward", back: "ws wstecz bk back", right: "pw prawo rt right", left: "lw lewo lt left", penup: "pod podnies podnieś pu penup", pendown: "opu opusc opuść pd pendown", color: "kolor color", width: "grubosc grubość width", repeat: "powtorz powtórz repeat", let: "niech let", if: "jeśli jesli if", ifelse: "jeżeli jezeli ifelse", stop: "stop", home: "dom home", clear: "czyść czysc cs clearscreen", pitchup: "gora góra pitchup", pitchdown: "dol dół pitchdown", rollright: "pp przechylprawo rr rollright", rollleft: "pl przechyllewo rl rollleft" }))
  for (const w of words.split(" "))
    aliases[w] = canonical;
var norm = (s) => s.toLocaleLowerCase("pl-PL");
var isName = (t) => !!t && /^:?\p{L}[\p{L}\p{N}_]*$/u.test(t.text);
var name = (t) => norm(t.text.replace(/^:/, ""));

class LogoError extends Error {
  constructor(message, token) {
    super(message);
    this.line = token?.line || 1;
    this.column = token?.col || 1;
  }
}
function fail(msg, t) {
  throw new LogoError(msg, t);
}
function tokenize(src) {
  if (src.length > 50000)
    fail("Program przekracza limit 50 000 znaków.", { line: 1, col: 1 });
  let tokens = [], i = 0, line = 1, col = 1;
  while (i < src.length) {
    let c = src[i];
    if (c === ";") {
      while (i < src.length && src[i] !== `
`) {
        i++;
        col++;
      }
      continue;
    }
    if (/\s/u.test(c)) {
      if (c === `
`) {
        line++;
        col = 1;
      } else
        col++;
      i++;
      continue;
    }
    let start = i, l = line, k = col, text = "";
    if (c === '"') {
      i++;
      while (i < src.length && src[i] !== '"' && src[i] !== `
`)
        i++;
      if (src[i] === '"')
        i++;
      text = src.slice(start, i);
    } else if (/[\[\](),+*/=<>-]/.test(c)) {
      i++;
      if ((c === "<" || c === ">") && (src[i] === "=" || c === "<" && src[i] === ">"))
        i++;
      text = src.slice(start, i);
    } else {
      while (i < src.length && !/[\s;\[\](),+*/=<>-]/u.test(src[i]))
        i++;
      text = src.slice(start, i);
    }
    col += i - start;
    tokens.push({ text, line: l, col: k, start, end: i });
    if (tokens.length > 1e4)
      fail("Program przekracza limit 10 000 tokenów.", tokens.at(-1));
  }
  return tokens;
}
function parse(src, mode) {
  const all = tokenize(src), defs = new Map, main = [];
  let index = 0, bracketDepth = 0;
  while (index < all.length) {
    let t = all[index], w = norm(t.text);
    if (w === "oto" || w === "to") {
      if (bracketDepth > 0)
        fail("Definicja jest dozwolona tylko na najwyższym poziomie.", t);
      if (index > 0 && all[index - 1].line === t.line)
        fail("Definicja musi zaczynać się na początku wiersza.", t);
      let header = [];
      index++;
      while (index < all.length && all[index].line === t.line)
        header.push(all[index++]);
      let id = header.shift();
      if (!isName(id) || id.text.startsWith(":") || aliases[name(id)] || ["oto", "to", "już", "juz", "end", "nrpowt", "repcount"].includes(name(id)))
        fail("Nieprawidłowa nazwa procedury.", id || t);
      let key = name(id);
      if (defs.has(key))
        fail("Procedura jest już zdefiniowana.", id);
      let params = [];
      if (header.length) {
        if (norm(header[0].text) === "ma:") {
          header.shift();
          let want = true;
          while (header.length) {
            let p = header.shift();
            if (want) {
              if (!isName(p) || p.text.startsWith(":"))
                fail("Oczekiwano nazwy parametru.", p);
              params.push(name(p));
            } else if (p.text !== ",")
              fail("Oczekiwano przecinka.", p);
            want = !want;
          }
          if (want)
            fail("Oczekiwano nazwy parametru.", id);
        } else {
          for (const p of header) {
            if (!isName(p) || !p.text.startsWith(":"))
              fail("Nieprawidłowy parametr.", p);
            params.push(name(p));
          }
        }
      }
      if (new Set(params).size !== params.length || params.some((p) => aliases[p] || ["nrpowt", "repcount"].includes(p)))
        fail("Nieprawidłowa nazwa parametru.", id);
      let body = [];
      while (index < all.length && !["już", "juz", "end"].includes(norm(all[index].text)))
        body.push(all[index++]);
      if (index === all.length)
        fail("Brakuje zakończenia „już”.", t);
      let end = all[index++];
      if (index < all.length && all[index].line === end.line || body.length && body.at(-1).line === end.line)
        fail("„już” musi stać samo w wierszu.", end);
      defs.set(key, { id, params, tokens: body });
    } else {
      if (t.text === "[")
        bracketDepth++;
      else if (t.text === "]")
        bracketDepth--;
      main.push(t);
      index++;
    }
  }
  function parseBlock(tokens, proc = null) {
    let i = 0, depth = 0;
    const peek = () => tokens[i], take = () => tokens[i++];
    function expr(fallback, min = 0) {
      let t = peek();
      if (!t || ["]", ")", "[", ","].includes(t.text))
        fail("Oczekiwano wyrażenia.", t || fallback);
      let node;
      if (t.text === "+" || t.text === "-") {
        take();
        node = { type: "unary", op: t.text, value: expr(fallback, 3), token: t };
      } else if (t.text === "(") {
        take();
        node = expr(t);
        node = { type: "unary", op: "+", value: node, token: t };
        if (peek()?.text !== ")")
          fail("Brakuje zamykającego nawiasu.", peek() || t);
        take();
      } else if (/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(t.text)) {
        take();
        node = { type: "number", value: Number(t.text), token: t };
      } else if (isName(t)) {
        take();
        let n = name(t);
        if (n === "nrpowt" || n === "repcount") {
          if (!depth)
            fail("„nrpowt” można użyć tylko wewnątrz powtórzenia.", t);
          node = { type: "rep", token: t };
        } else
          node = { type: "var", name: n, token: t };
      } else
        fail("Nieprawidłowe wyrażenie.", t);
      while (peek() && ["+", "-", "*", "/"].includes(peek().text)) {
        let op = peek(), prec = op.text === "+" || op.text === "-" ? 1 : 2;
        if (prec < min)
          break;
        let prev = tokens[i - 1], next = tokens[i + 1];
        let leftSpace = prev.end < op.start, rightSpace = next ? op.end < next.start : false;
        if (leftSpace !== rightSpace)
          break;
        take();
        node = { type: "binary", op: op.text, left: node, right: expr(op, prec + 1), token: node.token };
      }
      return node;
    }
    function block(repeatDepth = 0, nesting = 0, closing = false) {
      if (nesting > 32)
        fail("Przekroczono limit zagnieżdżenia nawiasów.", peek());
      let out = [];
      while (i < tokens.length && peek().text !== "]") {
        let t = take(), word = norm(t.text), cmd = aliases[word];
        if (!cmd && !defs.has(word))
          fail(["oto", "to"].includes(word) ? "Definicja jest dozwolona tylko na najwyższym poziomie." : "Nieznane polecenie: " + t.text, t);
        let n = { cmd: cmd || "call", token: t };
        if (["forward", "back", "right", "left", "width", "pitchup", "pitchdown", "rollright", "rollleft"].includes(cmd)) {
          if (mode === "2d" && ["pitchup", "pitchdown", "rollright", "rollleft"].includes(cmd))
            fail("To polecenie działa tylko w trybie 3D.", t);
          n.arg = expr(t);
        } else if (cmd === "color") {
          let a = take();
          if (!a || !/^"#[0-9a-f]{6}"$/i.test(a.text))
            fail("Oczekiwano koloru w postaci „#rrggbb”.", a || t);
          n.color = a.text.slice(1, -1).toLowerCase();
        } else if (cmd === "let") {
          let a = take();
          if (!isName(a) || a.text.startsWith(":") || aliases[name(a)] || defs.has(name(a)) || ["nrpowt", "repcount", "oto", "to", "już", "juz", "end"].includes(name(a)))
            fail("Nieprawidłowa nazwa zmiennej.", a || t);
          n.name = name(a);
          n.arg = expr(t);
        } else if (cmd === "repeat" || cmd === "if" || cmd === "ifelse") {
          n.arg = expr(t);
          if (cmd !== "repeat") {
            let op = take();
            if (!op || !["<", ">", "=", "<=", ">=", "<>"].includes(op.text))
              fail("Oczekiwano operatora porównania.", op || t);
            n.op = op.text;
            n.right = expr(t);
          }
          let b = take();
          if (b?.text !== "[")
            fail("Oczekiwano nawiasu „[”.", b || t);
          if (cmd === "repeat")
            depth++;
          n.body = block(repeatDepth + (cmd === "repeat"), nesting + 1, true);
          if (cmd === "repeat")
            depth--;
          if (peek()?.text !== "]")
            fail("Brakuje nawiasu „]”.", peek() || b);
          take();
          if (cmd === "ifelse") {
            b = take();
            if (b?.text !== "[")
              fail("Oczekiwano drugiego nawiasu „[”.", b || t);
            n.other = block(repeatDepth, nesting + 1, true);
            if (peek()?.text !== "]")
              fail("Brakuje nawiasu „]”.", peek() || b);
            take();
          }
        } else if (!cmd) {
          n.name = word;
          n.args = [];
          for (let j = 0;j < defs.get(word).params.length; j++)
            n.args.push(expr(t));
        }
        out.push(n);
      }
      if (!closing && peek()?.text === "]")
        fail("Nieoczekiwany nawias „]”.", peek());
      return out;
    }
    return block();
  }
  const program = parseBlock(main);
  for (const d of defs.values())
    d.body = parseBlock(d.tokens, d);
  const globalNames = new Set;
  function collect(nodes, set) {
    for (const n of nodes) {
      if (n.cmd === "let")
        set.add(n.name);
      if (n.body)
        collect(n.body, set);
      if (n.other)
        collect(n.other, set);
    }
  }
  collect(program, globalNames);
  function validate(nodes, local) {
    function check(e) {
      if (!e)
        return;
      if (e.type === "var" && !local.has(e.name) && !globalNames.has(e.name))
        fail("Nieznana zmienna: " + e.name, e.token);
      if (e.value && typeof e.value === "object")
        check(e.value);
      check(e.left);
      check(e.right);
    }
    for (const n of nodes) {
      check(n.arg);
      check(n.right);
      for (const e of n.args || [])
        check(e);
      if ((n.cmd === "width" || n.cmd === "repeat") && !hasVar(n.arg)) {
        try {
          let v = evaluate(n.arg, {}, {}, []);
          if (!Number.isInteger(v) || v < (n.cmd === "width" ? 1 : 0) || v > (n.cmd === "width" ? 12 : 1e4))
            fail(n.cmd === "width" ? "Grubość musi być liczbą całkowitą od 1 do 12." : "Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.", n.arg.token);
        } catch (e) {
          if (e instanceof LogoError && !e.message.includes("zero") && !e.message.includes("skończon"))
            throw e;
        }
      }
      if (n.body)
        validate(n.body, local);
      if (n.other)
        validate(n.other, local);
    }
  }
  validate(program, globalNames);
  for (const d of defs.values()) {
    let local = new Set(d.params);
    collect(d.body, local);
    validate(d.body, local);
  }
  return { program, defs };
}
function hasVar(e) {
  return e.type === "var" || e.type === "rep" || e.type === "unary" && hasVar(e.value) || e.type === "binary" && (hasVar(e.left) || hasVar(e.right));
}
function evaluate(e, locals, globals, reps, origin = e.token) {
  let v;
  if (e.type === "number")
    v = e.value;
  else if (e.type === "var") {
    if (Object.hasOwn(locals, e.name))
      v = locals[e.name];
    else if (Object.hasOwn(globals, e.name))
      v = globals[e.name];
    else
      fail("Zmienna „" + e.name + "” nie ma jeszcze wartości.", origin);
  } else if (e.type === "rep")
    v = reps.at(-1);
  else if (e.type === "unary") {
    let a = evaluate(e.value, locals, globals, reps, origin);
    v = e.op === "-" ? -a : a;
  } else {
    let a = evaluate(e.left, locals, globals, reps, origin), b = evaluate(e.right, locals, globals, reps, origin);
    if (e.op === "/" && b === 0)
      fail("Nie można dzielić przez zero.", origin);
    v = e.op === "+" ? a + b : e.op === "-" ? a - b : e.op === "*" ? a * b : a / b;
  }
  if (!Number.isFinite(v))
    fail("Wynik wyrażenia nie jest liczbą skończoną.", origin);
  return v;
}
var add = (a, b) => a.map((x, i) => x + b[i]);
var mul = (a, n) => a.map((x) => x * n);
function rotate(a, b, deg) {
  let x = deg * Math.PI / 180, c = Math.cos(x), s = Math.sin(x);
  return [add(mul(a, c), mul(b, s)), add(mul(b, c), mul(a, -s))];
}
function createExecution(source, mode = "2d") {
  let parsed;
  try {
    parsed = parse(source, mode);
  } catch (e) {
    return { segments: [], error: { message: e.message, line: e.line || 1, column: e.column || 1 }, done: true, step() {
      return this;
    } };
  }
  let state = { segments: [], error: null, done: false, position: [0, 0, 0], heading: [0, 1, 0], right: [1, 0, 0], up: [0, 0, 1], pen: true, color: "#16866a", width: 3, line: null }, globals = {}, reps = [], operations = 0, frames = 0;
  function tick(t) {
    if (++operations > 1e4)
      fail("Przekroczono limit 10 000 operacji.", t);
  }
  function move(d, t) {
    let dest = add(state.position, mul(state.heading, d));
    if (dest.some((x) => !Number.isFinite(x) || Math.abs(x) > 1e5))
      fail("Przekroczono zakres współrzędnych.", t);
    if (state.pen && d !== 0) {
      if (state.segments.length >= 1e4)
        fail("Przekroczono limit odcinków.", t);
      state.segments.push({ from: [...state.position], to: [...dest], color: state.color, width: state.width });
    }
    state.position = dest;
  }
  function* execute(nodes, locals, isProc = false) {
    for (const n of nodes) {
      tick(n.token);
      state.line = n.token.line;
      yield;
      let value = () => evaluate(n.arg, locals, globals, reps);
      switch (n.cmd) {
        case "forward":
          move(value(), n.arg.token);
          break;
        case "back":
          move(-value(), n.arg.token);
          break;
        case "right":
          [state.heading, state.right] = rotate(state.heading, state.right, value());
          break;
        case "left":
          [state.heading, state.right] = rotate(state.heading, state.right, -value());
          break;
        case "pitchup":
          [state.heading, state.up] = rotate(state.heading, state.up, value());
          break;
        case "pitchdown":
          [state.heading, state.up] = rotate(state.heading, state.up, -value());
          break;
        case "rollright":
          [state.up, state.right] = rotate(state.up, state.right, value());
          break;
        case "rollleft":
          [state.up, state.right] = rotate(state.up, state.right, -value());
          break;
        case "penup":
          state.pen = false;
          break;
        case "pendown":
          state.pen = true;
          break;
        case "color":
          state.color = n.color;
          break;
        case "width": {
          let x = value();
          if (!Number.isInteger(x) || x < 1 || x > 12)
            fail("Grubość musi być liczbą całkowitą od 1 do 12.", n.arg.token);
          state.width = x;
          break;
        }
        case "let":
          (isProc ? locals : globals)[n.name] = value();
          break;
        case "clear":
          state.segments.length = 0;
          break;
        case "home": {
          let d = state.position;
          if (d.some((x) => x !== 0)) {
            if (state.pen) {
              if (state.segments.length >= 1e4)
                fail("Przekroczono limit odcinków.", n.token);
              state.segments.push({ from: [...d], to: [0, 0, 0], color: state.color, width: state.width });
            }
            state.position = [0, 0, 0];
          }
          state.heading = [0, 1, 0];
          state.right = [1, 0, 0];
          state.up = [0, 0, 1];
          break;
        }
        case "stop":
          return "stop";
        case "repeat": {
          let count = value();
          if (!Number.isInteger(count) || count < 0 || count > 1e4)
            fail("Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.", n.arg.token);
          if (++frames > 32)
            fail("Przekroczono limit zagnieżdżenia wywołań i powtórzeń.", n.token);
          for (let j = 1;j <= count; j++) {
            reps.push(j);
            let stop = yield* execute(n.body, locals, isProc);
            reps.pop();
            if (stop === "stop") {
              frames--;
              return "stop";
            }
            tick(n.token);
          }
          frames--;
          break;
        }
        case "if":
        case "ifelse": {
          let a = value(), b = evaluate(n.right, locals, globals, reps), ok = { "<": () => a < b, ">": () => a > b, "=": () => a === b, "<=": () => a <= b, ">=": () => a >= b, "<>": () => a !== b }[n.op]();
          let branch = ok ? n.body : n.other;
          if (branch) {
            let stop = yield* execute(branch, locals, isProc);
            if (stop === "stop")
              return "stop";
            tick(n.token);
          }
          break;
        }
        case "call": {
          let def = parsed.defs.get(n.name), args = n.args.map((e) => evaluate(e, locals, globals, reps)), scope = {};
          def.params.forEach((p, i) => scope[p] = args[i]);
          if (++frames > 32)
            fail("Przekroczono limit zagnieżdżenia wywołań i powtórzeń.", n.token);
          yield* execute(def.body, scope, true);
          frames--;
          tick(n.token);
          break;
        }
      }
    }
  }
  const gen = execute(parsed.program, globals);
  let started = false;
  state.step = function() {
    if (this.done)
      return this;
    try {
      if (!started) {
        gen.next();
        started = true;
      }
      let r = gen.next();
      if (r.done) {
        this.done = true;
        this.line = null;
      }
    } catch (e) {
      this.error = { message: e.message, line: e.line || 1, column: e.column || 1 };
      this.done = true;
      this.line = null;
    }
    return this;
  };
  return state;
}
function run(source, mode = "2d") {
  const s = createExecution(source, mode);
  while (!s.done)
    s.step();
  return { segments: s.segments, error: s.error };
}

// src/examples.js
var examples = [
  ["kwadrat", "Kwadrat", "2d", "Cztery kroki do pierwszego rysunku.", `; Cztery boki, cztery skręty.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 120
  pw 90
]`],
  ["gwiazda", "Gwiazda", "2d", "Mała zmiana kąta, wielka różnica.", `; Sekret gwiazdy? Kąt 144 stopni.
kolor "#c1763d"
grubosc 3
powtorz 5 [
  np 180
  pw 144
]`],
  ["rozeta", "Rozeta", "2d", "Jeden kwadrat. Wiele możliwości.", `; Obróć kwadrat i zobacz, co powstanie.
kolor "#16866a"
grubosc 2
powtorz 12 [
  powtorz 4 [
    np 100
    pw 90
  ]
  pw 30
]`],
  ["spirala", "Spirala", "2d", "Licznik powtórzeń i zmienna zmieniają kolor.", `; Każdy bok jest dłuższy od poprzedniego, kolory na zmianę.
grubosc 2
niech zmiana 1
powtorz 90 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]
  niech zmiana -zmiana
  np nrpowt * 2.5
  pw 89
]`],
  ["wielokaty", "Wielokąty", "2d", "Procedura liczy kąt z liczby boków.", `; Jedna procedura, wiele figur: kąt liczy się sam.
oto wielokąt ma: boki, bok
  powtorz boki [np bok pw 360 / boki]
już

grubosc 2
niech n 3
powtorz 7 [
  wielokąt n 60
  niech n n + 1
  pw 360 / 7
]`],
  ["drzewo", "Drzewo", "2d", "Gałąź rysuje dwie mniejsze gałęzie.", `; Rekurencja: gałąź rysuje dwie mniejsze gałęzie.
oto gałąź ma: dł
  jeśli dł < 6 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  lw 25
  gałąź dł * 0.7
  pw 50
  gałąź dł * 0.7
  lw 25
  pod ws dł opu
już

pod ws 120 opu
gałąź 90`],
  ["sniezynka", "Śnieżynka", "2d", "Krzywa Kocha z czterech poziomów.", `; Krzywa Kocha: każdy odcinek dzieli się na cztery.
oto koch ma: dł, poziom
  jeśli poziom = 0 [np dł stop]
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
  pw 120
  koch dł / 3 poziom - 1
  lw 60
  koch dł / 3 poziom - 1
już

kolor "#2b6fb3"
grubosc 1
pod pw 90 ws 135 lw 90 np 80 opu
powtorz 3 [
  koch 270 4
  pw 120
]`],
  ["schody", "Schody", "3d", "Pierwszy krok w trzeci wymiar.", `; Żółw wspina się w przestrzeni.
kolor "#16866a"
grubosc 4
powtorz 6 [
  np 35
  gora 90
  np 20
  dol 90
]`],
  ["szescian", "Sześcian", "3d", "Zbuduj bryłę z prostych poleceń.", `; Dwa kwadraty połączone krawędziami.
kolor "#16866a"
grubosc 3
powtorz 4 [np 100 pw 90]
gora 90 np 100 dol 90
powtorz 4 [np 100 pw 90]
powtorz 4 [
  np 100
  dol 90 np 100
  pod ws 100 opu
  gora 90 pw 90
]`],
  ["pierscien", "Pierścień", "3d", "Okrąg przechylony w przestrzeni.", `; Okrąg przechylony o 30 stopni.
kolor "#a478c0"
grubosc 3
gora 30
powtorz 36 [np 12 pw 10]`],
  ["kula", "Kula", "3d", "Okręgi obrócone wokół kierunku żółwia.", `; Dwanaście okręgów, każdy przechylony o 15 stopni.
grubosc 2
niech zmiana 1
powtorz 12 [
  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#2b6fb3"]
  niech zmiana -zmiana
  powtorz 36 [np 10 gora 10]
  pp 15
]`],
  ["helisa", "Helisa", "3d", "Spirala wznosi się obrót po obrocie.", `; Spirala wznosi się ku górze.
kolor "#c1763d"
grubosc 3
powtorz 120 [
  np 10
  pw 15
  gora 90 np 1.5 dol 90
]`],
  ["drzewo3d", "Drzewo 3D", "3d", "Gałęzie obracają się wokół pnia.", `; Drzewo w przestrzeni: gałęzie obracają się wokół pnia.
oto gałąź ma: dł
  jeśli dł < 8 [stop]
  jeżeli dł > 30 [kolor "#6b4f2a" grubosc 3] [kolor "#2f8f4e" grubosc 1]
  np dł
  powtorz 3 [
    gora 35
    gałąź dł * 0.6
    dol 35
    pp 120
  ]
  pod ws dł opu
już

gora 90
gałąź 70`]
].map(([id, name, mode, description, source]) => ({ id, name, mode, description, source }));

// src/app.js
var $ = (s) => document.querySelector(s);
var $$ = (s) => [...document.querySelectorAll(s)];
var editor = $("#editor");
var canvas = $("#canvas");
var ctx = canvas.getContext("2d");
var defaults = { "2d": examples[0].source, "3d": examples.find((e) => e.id === "schody").source };
var read = (k, d = "") => {
  try {
    return localStorage.getItem(k) ?? d;
  } catch {
    return d;
  }
};
var save = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};
var mode = "2d";
var execution = null;
var playing = false;
var timer = 0;
var currentChallenge = null;
var view = { scale: 1.25, panX: 0, panY: 0, yaw: -0.65, pitch: 0.55 };
var challenges = [
  { id: "line", name: "Pierwszy ślad", description: "Narysuj jeden odcinek długości 100, od środka prosto do góry.", art: "│", source: "np 100" },
  { id: "square", name: "Kwadrat", description: "Narysuj kwadrat o boku 100. Zacznij w środku, kierując się w górę i skręcając w prawo.", art: "□", source: "powtorz 4 [np 100 pw 90]" },
  { id: "triangle", name: "Trójkąt", description: "Narysuj trójkąt równoboczny o boku 100, skręcając w prawo o 120°.", art: "△", source: "powtorz 3 [np 100 pw 120]" },
  { id: "stairs", name: "Dwa schodki", description: "Narysuj dwa schodki: 50 w górę i 50 w prawo, dwa razy.", art: "⌁", source: "powtorz 2 [np 50 pw 90 np 50 lw 90]" },
  { id: "cross", name: "Krzyżyk", description: "Narysuj cztery ramiona o długości 70, wychodzące ze środka kolejno w górę, w prawo, w dół i w lewo.", art: "✳", source: "powtorz 4 [np 70 ws 70 pw 90]" }
];
function toast(text) {
  let el = $("#toast");
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 3000);
}
function showPage(id) {
  $$(".page").forEach((e) => e.classList.toggle("active", e.id === id));
  $$(".nav").forEach((e) => e.classList.toggle("active", e.dataset.page === id));
  if (id === "studio")
    requestAnimationFrame(draw);
}
$$(".nav").forEach((b) => b.onclick = () => showPage(b.dataset.page));
$$("[data-go]").forEach((b) => b.onclick = () => showPage(b.dataset.go));
function esc(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
var words = new Set("np naprzod naprzód fd forward ws wstecz bk back pw prawo rt right lw lewo lt left pod podnies podnieś pu penup opu opusc opuść pd pendown kolor color grubosc grubość width powtorz powtórz repeat niech let jeśli jesli if jeżeli jezeli ifelse stop dom home czyść czysc cs clearscreen gora góra pitchup dol dół pitchdown pp przechylprawo rr rollright pl przechyllewo rl rollleft oto to już juz end".split(" "));
function highlight() {
  let text = editor.value;
  $("#highlight").innerHTML = text.split(/(;[^\n]*|"[^"\n]*"|\b\d+(?:\.\d+)?|[\[\]()]|:?\p{L}[\p{L}\p{N}_]*:?)/gu).map((t) => {
    let cls = t.startsWith(";") ? "comment" : t.startsWith('"') ? "string" : /^[\[\]()]$/.test(t) ? "bracket" : /^\d/.test(t) ? "number" : words.has(t.toLocaleLowerCase("pl-PL")) ? "command" : "name";
    return `<span class="tok-${cls}">${esc(t)}</span>`;
  }).join("") + `
`;
  $("#line-numbers").textContent = Array.from({ length: text.split(`
`).length }, (_, i) => i + 1).join(`
`);
  updateCursor();
}
function updateCursor() {
  let before = editor.value.slice(0, editor.selectionStart), lines = before.split(`
`);
  $("#cursor").textContent = `Wiersz ${lines.length}, kol. ${lines.at(-1).length + 1}`;
}
function updateLine() {
  let line = execution?.line, el = $("#line-highlight");
  el.style.display = line ? "block" : "none";
  if (line)
    el.style.top = 18 + (line - 1) * 25 - editor.scrollTop + "px";
  let marker = $("#error-marker"), error = execution?.error;
  marker.style.display = error ? "block" : "none";
  if (error) {
    marker.style.top = 18 + (error.line - 1) * 25 + 20 - editor.scrollTop + "px";
    marker.style.left = 53 + (error.column - 1) * 7.83 - editor.scrollLeft + "px";
  }
}
editor.addEventListener("scroll", () => {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $("#line-numbers").scrollTop = editor.scrollTop;
  updateLine();
});
editor.addEventListener("click", updateCursor);
editor.addEventListener("keyup", updateCursor);
editor.addEventListener("input", () => {
  stopPlaying();
  execution = null;
  save("logomocja-draft-" + mode, editor.value);
  $("#error").hidden = true;
  updateLine();
  $("#status").innerHTML = '<span class="dot"></span> Szkic zmieniony';
  highlight();
  draw();
});
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    let { selectionStart: a, selectionEnd: b } = editor;
    editor.setRangeText("  ", a, b, "end");
    editor.dispatchEvent(new Event("input"));
  }
});
function stopPlaying() {
  playing = false;
  clearTimeout(timer);
  $("#pause").textContent = "Ⅱ";
}
function setError(e) {
  let el = $("#error");
  el.hidden = !e;
  if (e) {
    el.textContent = `Wiersz ${e.line}, kolumna ${e.column}: ${e.message}`;
    let lines = editor.value.split(`
`), offset = lines.slice(0, e.line - 1).reduce((n, l) => n + l.length + 1, 0) + e.column - 1;
    editor.setSelectionRange(offset, offset);
    $("#status").innerHTML = '<span class="dot"></span> Program zatrzymany';
  }
  updateLine();
}
function status() {
  if (!execution)
    return;
  setError(execution.error);
  if (execution.done && !execution.error)
    $("#status").innerHTML = `<span class="dot"></span> Gotowe · ${execution.segments.length} odcinków`;
  else if (!execution.done)
    $("#status").innerHTML = '<span class="dot"></span> Rysowanie w toku';
  updateLine();
}
function begin() {
  stopPlaying();
  execution = createExecution(editor.value, mode);
  setError(execution.error);
  status();
  draw();
}
function next() {
  if (!execution || execution.done)
    begin();
  if (!execution.done)
    execution.step();
  status();
  draw();
}
function animate() {
  if (!playing)
    return;
  let speed = +$("#speed").value;
  let steps = speed > 85 ? Math.ceil((speed - 85) * 2) : 1;
  for (let i = 0;i < steps && !execution.done; i++)
    execution.step();
  status();
  draw();
  if (execution.done) {
    stopPlaying();
    return;
  }
  timer = setTimeout(animate, Math.max(5, 150 - speed * 1.5));
}
$("#run").onclick = () => {
  begin();
  if (!execution.done) {
    playing = true;
    animate();
  }
};
$("#step").onclick = () => {
  stopPlaying();
  next();
};
$("#pause").onclick = () => {
  if (playing) {
    stopPlaying();
    $("#status").innerHTML = '<span class="dot"></span> Wstrzymano';
  } else if (execution && !execution.done) {
    playing = true;
    $("#pause").textContent = "▶";
    animate();
  }
};
$("#reset").onclick = () => {
  stopPlaying();
  execution = null;
  setError(null);
  updateLine();
  $("#status").innerHTML = '<span class="dot"></span> Gotowy do rysowania';
  draw();
};
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    (e.shiftKey ? $("#step") : $("#run")).click();
  } else if ((e.ctrlKey || e.metaKey) && e.key === ".") {
    e.preventDefault();
    $("#pause").click();
  } else if ((e.ctrlKey || e.metaKey) && e.key === "Backspace") {
    e.preventDefault();
    $("#reset").click();
  }
});
function switchMode(newMode) {
  if (newMode === mode)
    return;
  save("logomocja-draft-" + mode, editor.value);
  mode = newMode;
  editor.value = read("logomocja-draft-" + mode, defaults[mode]);
  $("#restore").hidden = read("logomocja-backup-" + mode, null) === null;
  $$("[data-mode]").forEach((b) => {
    let on = b.dataset.mode === mode;
    b.classList.toggle("selected", on);
    b.setAttribute("aria-pressed", on);
  });
  $("#view-label").textContent = mode === "2d" ? "WIDOK Z GÓRY" : "WIDOK PRZESTRZENNY";
  $("#canvas-hint").textContent = mode === "2d" ? "PRZECIĄGNIJ, ABY PRZESUNĄĆ  ·  PRZEWIŃ, ABY PRZYBLIŻYĆ" : "PRZECIĄGNIJ, ABY OBRÓCIĆ  ·  DWA PALCE, ABY PRZESUNĄĆ";
  stopPlaying();
  execution = null;
  setError(null);
  highlight();
  resetView();
  draw();
}
$$("[data-mode]").forEach((b) => b.onclick = () => switchMode(b.dataset.mode));
function loadSource(source, m, backup = true) {
  if (backup) {
    save("logomocja-backup-" + mode, editor.value);
    $("#restore").hidden = false;
  }
  switchMode(m);
  if (backup) {
    save("logomocja-backup-" + m, editor.value);
    $("#restore").hidden = false;
  }
  editor.value = source;
  save("logomocja-draft-" + mode, source);
  highlight();
  stopPlaying();
  execution = null;
  setError(null);
  showPage("studio");
  draw();
}
$("#restore").onclick = () => {
  let backup = read("logomocja-backup-" + mode, null);
  if (backup !== null) {
    let old = editor.value;
    editor.value = backup;
    save("logomocja-backup-" + mode, old);
    save("logomocja-draft-" + mode, backup);
    highlight();
    $("#reset").click();
    toast("Przywrócono poprzedni szkic.");
  }
};
function open(source, m) {
  loadSource(source, m, false);
  execution = createExecution(source, m);
  while (!execution.done)
    execution.step();
  status();
  fit();
  draw();
  return new Promise((resolve) => requestAnimationFrame(() => resolve({ segments: execution.segments, error: execution.error })));
}
window.logomocja = { version: "1.0.0", run, open };
function resetView() {
  view = { scale: 1.25, panX: 0, panY: 0, yaw: -0.65, pitch: 0.55 };
}
function dimensions() {
  let r = canvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1, w = Math.max(1, r.width), h = Math.max(1, r.height);
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { w, h };
}
function projection(p) {
  if (mode === "2d")
    return [p[0], -p[1]];
  let [x, y, z] = p, c = Math.cos(view.yaw), s = Math.sin(view.yaw), h = x * c - y * s, depth = x * s + y * c;
  return [h, -(z * Math.cos(view.pitch) - depth * Math.sin(view.pitch))];
}
function screen(p, w, h) {
  let q = projection(p);
  return [w / 2 + view.panX + q[0] * view.scale, h / 2 + view.panY + q[1] * view.scale];
}
function line(a, b, w, h, color, width = 1) {
  let p = screen(a, w, h), q = screen(b, w, h);
  ctx.beginPath();
  ctx.moveTo(...p);
  ctx.lineTo(...q);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}
function draw() {
  let { w, h } = dimensions(), dark = document.documentElement.dataset.theme === "dark";
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = dark ? "#1c2922" : "#fbfcf8";
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  let grid = dark ? "#34483b" : "#eaf0e8";
  if (mode === "2d") {
    let spacing = 50 * view.scale;
    if (spacing > 8) {
      ctx.beginPath();
      let ox = ((w / 2 + view.panX) % spacing + spacing) % spacing, oy = ((h / 2 + view.panY) % spacing + spacing) % spacing;
      for (let x = ox;x < w; x += spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = oy;y < h; y += spacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    let o = screen([0, 0, 0], w, h);
    ctx.strokeStyle = dark ? "#678779" : "#c6d9ca";
    ctx.beginPath();
    ctx.moveTo(o[0] - 7, o[1]);
    ctx.lineTo(o[0] + 7, o[1]);
    ctx.moveTo(o[0], o[1] - 7);
    ctx.lineTo(o[0], o[1] + 7);
    ctx.stroke();
  } else {
    for (let i = -10;i <= 10; i++) {
      line([i * 50, -500, 0], [i * 50, 500, 0], w, h, grid);
      line([-500, i * 50, 0], [500, i * 50, 0], w, h, grid);
    }
    line([0, 0, 0], [120, 0, 0], w, h, "#d98d7c", 1.5);
    line([0, 0, 0], [0, 120, 0], w, h, "#84b896", 1.5);
    line([0, 0, 0], [0, 0, 120], w, h, "#8eaad0", 1.5);
  }
  for (const seg of execution?.segments || [])
    line(seg.from, seg.to, w, h, seg.color, seg.width);
  let p = execution?.position || [0, 0, 0], head = execution?.heading || [0, 1, 0], right = execution?.right || [1, 0, 0];
  let center = screen(p, w, h), tip = screen(p.map((v, i) => v + head[i] * 16 / view.scale), w, h), left = screen(p.map((v, i) => v - head[i] * 9 / view.scale - right[i] * 8 / view.scale), w, h), r = screen(p.map((v, i) => v - head[i] * 9 / view.scale + right[i] * 8 / view.scale), w, h);
  ctx.beginPath();
  ctx.moveTo(...tip);
  ctx.lineTo(...left);
  ctx.lineTo(...center);
  ctx.lineTo(...r);
  ctx.closePath();
  ctx.fillStyle = "#16866a";
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  if (mode === "3d" && execution?.up) {
    line(p, p.map((v, i) => v + execution.up[i] * 18 / view.scale), w, h, "#d19d58", 2);
  }
}
function fit() {
  let segs = execution?.segments || [];
  if (!segs.length) {
    resetView();
    return;
  }
  let pts = segs.flatMap((s) => [projection(s.from), projection(s.to)]), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]), minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys), { w, h } = dimensions();
  view.scale = Math.max(0.02, Math.min(5, (w - 100) / Math.max(30, maxX - minX), (h - 100) / Math.max(30, maxY - minY)));
  view.panX = -(minX + maxX) / 2 * view.scale;
  view.panY = -(minY + maxY) / 2 * view.scale;
  draw();
}
$("#fit").onclick = fit;
$("#camera-reset").onclick = () => {
  resetView();
  draw();
};
$("#zoom-in").onclick = () => {
  view.scale = Math.min(10, view.scale * 1.25);
  draw();
};
$("#zoom-out").onclick = () => {
  view.scale = Math.max(0.02, view.scale / 1.25);
  draw();
};
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  view.scale = Math.max(0.02, Math.min(10, view.scale * (e.deltaY < 0 ? 1.1 : 1 / 1.1)));
  draw();
}, { passive: false });
var drag = null;
var pointers = new Map;
function pointerCenter() {
  let p = [...pointers.values()];
  return { x: p.reduce((a, v) => a + v.x, 0) / p.length, y: p.reduce((a, v) => a + v.y, 0) / p.length };
}
canvas.addEventListener("pointerdown", (e) => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  let c = pointerCenter();
  drag = { ...c, pan: pointers.size > 1 || e.shiftKey || e.button === 2 || mode === "2d" };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!pointers.has(e.pointerId))
    return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  let c = pointerCenter();
  if (!drag) {
    drag = { ...c, pan: pointers.size > 1 || mode === "2d" };
    return;
  }
  let dx = c.x - drag.x, dy = c.y - drag.y;
  drag.x = c.x;
  drag.y = c.y;
  if (drag.pan || pointers.size > 1) {
    view.panX += dx;
    view.panY += dy;
  } else {
    view.yaw += dx * 0.01;
    view.pitch = Math.max(-1.5, Math.min(1.5, view.pitch + dy * 0.01));
  }
  draw();
});
function releasePointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size) {
    drag = { ...pointerCenter(), pan: mode === "2d" || pointers.size > 1 };
  } else
    drag = null;
}
canvas.addEventListener("pointerup", releasePointer);
canvas.addEventListener("pointercancel", releasePointer);
canvas.addEventListener("contextmenu", (e) => e.preventDefault());
canvas.addEventListener("keydown", (e) => {
  let dx = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0, dy = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
  if (dx || dy) {
    e.preventDefault();
    if (mode === "3d" && e.shiftKey) {
      view.yaw += dx * 0.12;
      view.pitch = Math.max(-1.5, Math.min(1.5, view.pitch + dy * 0.12));
    } else {
      view.panX += dx * 20;
      view.panY += dy * 20;
    }
    draw();
  } else if (e.key === "+" || e.key === "-") {
    e.preventDefault();
    view.scale = Math.max(0.02, Math.min(10, view.scale * (e.key === "+" ? 1.25 : 0.8)));
    draw();
  }
});
new ResizeObserver(draw).observe(canvas);
function download(blob, filename) {
  let url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("#save-file").onclick = () => download(new Blob([editor.value], { type: "text/plain;charset=utf-8" }), "program.logo");
$("#open-file").onclick = () => $("#file").click();
$("#file").onchange = async (e) => {
  let f = e.target.files[0];
  if (f) {
    loadSource(await f.text(), mode);
    toast("Otwarto plik. Poprzedni szkic można przywrócić.");
  }
  e.target.value = "";
};
$("#png").onclick = () => canvas.toBlob((blob) => download(blob, "logomocja.png"), "image/png");
$("#share").onclick = async () => {
  let bytes = new TextEncoder().encode(JSON.stringify({ source: editor.value, mode })), binary = Array.from(bytes, (b) => String.fromCharCode(b)).join(""), hash = btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  let url = location.href.split("#")[0] + "#program=" + hash;
  try {
    await navigator.clipboard.writeText(url);
    toast("Link do programu skopiowany.");
  } catch {
    prompt("Skopiuj link do programu:", url);
  }
};
$("#example-list").innerHTML = examples.map((e, i) => `<article class="card"><div class="card-art">${["□", "☆", "✳", "◎", "⬡", "♧", "❄", "⌁", "◇", "◯", "◉", "〰", "♧"][i]}</div><span class="tag">${e.mode.toUpperCase()} / PRZYKŁAD ${String(i + 1).padStart(2, "0")}</span><h3>${e.name}</h3><p>${e.description}</p><button data-example="${e.id}">Otwórz w pracowni →</button></article>`).join("");
$$("[data-example]").forEach((b) => b.onclick = () => {
  let e = examples.find((x) => x.id === b.dataset.example);
  loadSource(e.source, e.mode);
  toast("Przykład załadowany. Poprzedni szkic można przywrócić.");
});
function challengeCards() {
  $("#challenge-list").innerHTML = challenges.map((c, i) => `<article class="card"><div class="card-art">${c.art}</div><span class="tag">WYZWANIE ${String(i + 1).padStart(2, "0")} ${read("logomocja-challenge-" + c.id) ? " / ✓ UKOŃCZONE" : ""}</span><h3>${c.name}</h3><p>${c.description}</p><button data-challenge="${c.id}">Podejmij wyzwanie →</button></article>`).join("");
  $$("[data-challenge]").forEach((b) => b.onclick = () => {
    currentChallenge = challenges.find((c) => c.id === b.dataset.challenge);
    switchMode("2d");
    showPage("studio");
    $("#challenge-bar").hidden = false;
    $("#challenge-text").textContent = currentChallenge.name + ": " + currentChallenge.description;
  });
}
var bar = document.createElement("div");
bar.id = "challenge-bar";
bar.hidden = true;
bar.innerHTML = '<span id="challenge-text"></span><button id="check-challenge">Sprawdź rysunek</button><button id="close-challenge" aria-label="Zamknij wyzwanie">×</button>';
$(".workspace").before(bar);
$("#close-challenge").onclick = () => {
  bar.hidden = true;
  currentChallenge = null;
};
$("#check-challenge").onclick = () => {
  let got = run(editor.value, "2d"), expected = run(currentChallenge.source, "2d");
  if (got.error) {
    toast(`Błąd w wierszu ${got.error.line}: ${got.error.message}`);
    return;
  }
  let same = (a, b) => Math.hypot(...a.map((x, i) => x - b[i])) < 0.1;
  let unused = [...got.segments];
  for (const e of expected.segments) {
    let i = unused.findIndex((s) => same(s.from, e.from) && same(s.to, e.to) || same(s.from, e.to) && same(s.to, e.from));
    if (i < 0) {
      toast("Jeszcze nie: brakuje odcinka we właściwym miejscu.");
      return;
    }
    unused.splice(i, 1);
  }
  if (unused.length) {
    toast("Jeszcze nie: rysunek ma dodatkowe odcinki.");
    return;
  }
  save("logomocja-challenge-" + currentChallenge.id, "1");
  challengeCards();
  toast("Brawo! Wyzwanie ukończone ✓");
};
challengeCards();
var refRows = [["np, naprzod, naprzód, fd, forward", "np 100", "Ruch do przodu."], ["ws, wstecz, bk, back", "ws 50", "Ruch do tyłu."], ["pw, prawo, rt, right", "pw 90", "Skręt w prawo."], ["lw, lewo, lt, left", "lw 90", "Skręt w lewo."], ["pod, podnies, podnieś, pu, penup", "pod", "Podnieś pisak."], ["opu, opusc, opuść, pd, pendown", "opu", "Opuść pisak."], ["kolor, color", 'kolor "#16866a"', "Kolor pisaka: sześć cyfr szesnastkowych."], ["grubosc, grubość, width", "grubosc 3", "Grubość od 1 do 12."], ["powtorz, powtórz, repeat", "powtorz 4 [np 50 pw 90]", "Powtórz od 0 do 10000 razy."], ["niech, let", "niech bok 50", "Przypisz zmienną."], ["jeśli, jesli, if", "jeśli bok > 10 [np bok]", "Wykonaj, gdy warunek jest prawdziwy."], ["jeżeli, jezeli, ifelse", "jeżeli bok > 10 [np bok] [np 10]", "Wybierz jeden z dwóch bloków."], ["stop", "stop", "Zakończ procedurę lub program."], ["dom, home", "dom", "Wróć do początku i ustaw początkowy kierunek."], ["czyść, czysc, cs, clearscreen", "czyść", "Usuń narysowane odcinki."], ["gora, góra, pitchup", "gora 90", "Unieś dziób (3D)."], ["dol, dół, pitchdown", "dol 90", "Opuść dziób (3D)."], ["pp, przechylprawo, rr, rollright", "pp 90", "Przechyl w prawo (3D)."], ["pl, przechyllewo, rl, rollleft", "pl 90", "Przechyl w lewo (3D)."]];
$("#reference-content").innerHTML = `<h2>Pierwsze kroki</h2><p>Żółw zaczyna w środku, zwrócony w górę, z opuszczonym pisakiem. Polecenia można wpisywać w jednym lub w wielu wierszach. Średnik rozpoczyna komentarz.</p><pre>; Narysuj kwadrat
powtorz 4 [np 100 pw 90]</pre><h2>Polecenia</h2><table><thead><tr><th>Nazwy</th><th>Przykład</th><th>Co robi?</th></tr></thead><tbody>${refRows.map((r) => `<tr><td>${esc(r[0])}</td><td><code>${esc(r[1])}</code></td><td>${esc(r[2])}</td></tr>`).join("")}</tbody></table><h2>Wyrażenia i zmienne</h2><p>Używaj liczb, nazw, nawiasów oraz działań +, −, * i /. Mnożenie i dzielenie mają pierwszeństwo. Wokół operatora wpisz spacje po obu stronach lub po żadnej: <code>np 10 - 5</code> albo <code>np 10-5</code>. Znaki jednoargumentowe można łączyć: <code>np - -2</code>. Liczby nie obsługują zapisu wykładniczego. Nazwy nie rozróżniają wielkości liter.</p><pre>niech bok 40
np bok * 2
powtorz 5 [np nrpowt * 10 pw 90]</pre><p><code>nrpowt</code> (lub <code>repcount</code>) to numer bieżącego powtórzenia, dostępny tylko wewnątrz jego bloku. Zmienne są globalne albo lokalne dla wywołania procedury; można je też zapisać jako <code>:bok</code>.</p><h2>Warunki i procedury</h2><p>Porównania: &lt;, &gt;, =, &lt;=, &gt;=, &lt;&gt;. Porównania są dokładne. Definicje muszą być na najwyższym poziomie; <code>oto</code> i <code>już</code> stoją w osobnych wierszach. Działają też aliasy <code>to</code>, <code>juz</code>, <code>end</code> i starszy nagłówek <code>oto kwadrat :bok</code>. Procedury mogą być rekurencyjne.</p><pre>oto kwadrat ma: bok
  powtorz 4 [np bok pw 90]
już
kwadrat 80</pre><h2>Granice pracowni</h2><p>50 000 znaków, 10 000 tokenów, 32 poziomy nawiasów i 32 aktywne powtórzenia lub wywołania, 10 000 operacji i 10 000 zachowanych odcinków. Współrzędne mieszczą się w zakresie ±100 000. Błędy składni nie rysują nic; błędy wykonania pozostawiają dotychczasowy rysunek.</p><h2>Skróty klawiaturowe</h2><p>Na płótnie strzałki przesuwają widok, Shift ze strzałkami obraca widok 3D, a + i − zmieniają przybliżenie.</p><p><kbd>Ctrl/⌘ + Enter</kbd> uruchamia, <kbd>Ctrl/⌘ + Shift + Enter</kbd> wykonuje krok, <kbd>Ctrl/⌘ + .</kbd> wstrzymuje lub wznawia, a <kbd>Ctrl/⌘ + Backspace</kbd> resetuje rysunek.</p>`;
function applyTheme(t, persist = false) {
  document.documentElement.dataset.theme = t;
  if (persist)
    save("logomocja-theme", t);
  draw();
}
var theme = read("logomocja-theme", matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(theme);
$("#theme").onclick = () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!read("logomocja-theme"))
    applyTheme(e.matches ? "dark" : "light");
});
editor.value = read("logomocja-draft-2d", defaults["2d"]);
$("#restore").hidden = read("logomocja-backup-2d", null) === null;
highlight();
var hash = location.hash;
if (hash.startsWith("#program=")) {
  try {
    let encoded = hash.slice(9).replaceAll("-", "+").replaceAll("_", "/"), binary = atob(encoded), data = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
    if (typeof data.source === "string" && ["2d", "3d"].includes(data.mode))
      open(data.source, data.mode);
  } catch {
    toast("Nie udało się otworzyć linku do programu.");
  }
} else {
  execution = createExecution(editor.value, mode);
  while (!execution.done)
    execution.step();
  status();
  requestAnimationFrame(fit);
}
