// src/interpreter.js
var groups = {
  forward: "np naprzod naprzód fd forward",
  back: "ws wstecz bk back",
  right: "pw prawo rt right",
  left: "lw lewo lt left",
  penup: "pod podnies podnieś pu penup",
  pendown: "opu opusc opuść pd pendown",
  color: "kolor color",
  width: "grubosc grubość width",
  repeat: "powtorz powtórz repeat",
  let: "niech let",
  if: "jeśli jesli if",
  ifelse: "jeżeli jezeli ifelse",
  stop: "stop",
  home: "dom home",
  clear: "czyść czysc cs clearscreen",
  pitchup: "gora góra pitchup",
  pitchdown: "dol dół pitchdown",
  rollright: "pp przechylprawo rr rollright",
  rollleft: "pl przechyllewo rl rollleft"
};
var aliases = Object.fromEntries(Object.entries(groups).flatMap(([k, v]) => v.split(" ").map((x) => [x, k])));
var norm = (x) => x.toLocaleLowerCase("pl");
var fail = (message, t) => {
  throw { message, line: t?.line || 1, column: t?.col || 1 };
};
function lex(s) {
  if (s.length > 50000)
    fail("Program przekracza limit 50 000 znaków.", { line: 1, col: 1 });
  const out = [];
  let i = 0, line = 1, col = 1;
  while (i < s.length) {
    let c = s[i];
    if (c === `
`) {
      i++;
      line++;
      col = 1;
      continue;
    }
    if (/\s/.test(c)) {
      i++;
      col++;
      continue;
    }
    if (c === ";") {
      while (i < s.length && s[i] !== `
`) {
        i++;
        col++;
      }
      continue;
    }
    let start = i, l = line, p = col, v;
    if (c === '"') {
      i++;
      col++;
      while (i < s.length && s[i] !== '"' && s[i] !== `
`) {
        i++;
        col++;
      }
      if (s[i] === '"') {
        i++;
        col++;
      }
      v = s.slice(start, i);
    } else if (/[\p{L}_:]/u.test(c)) {
      i++;
      col++;
      while (i < s.length && /[\p{L}\p{N}_:]/u.test(s[i])) {
        i++;
        col++;
      }
      v = s.slice(start, i);
    } else if (/[0-9.]/.test(c)) {
      i++;
      col++;
      while (i < s.length && /[\p{L}\p{N}_.]/u.test(s[i])) {
        i++;
        col++;
      }
      v = s.slice(start, i);
    } else {
      i++;
      col++;
      if ((c === "<" || c === ">") && /[=>]/.test(s[i] || "")) {
        i++;
        col++;
      }
      v = s.slice(start, i);
    }
    out.push({ v, n: norm(v), line: l, col: p, start, end: i });
    if (out.length > 1e4)
      fail("Program przekracza limit 10 000 tokenów.", out.at(-1));
  }
  return out;
}
var nameOk = (s) => /^:?[\p{L}_][\p{L}\p{N}_]*$/u.test(s);
var clean = (s) => norm(s.replace(/^:/, ""));
function parse(source, mode) {
  const ts = lex(source), procs = new Map, main = [];
  let i = 0, scanDepth = 0;
  while (i < ts.length) {
    const t = ts[i];
    if (t.n === "oto" || t.n === "to") {
      if (scanDepth)
        fail("Definicja w niedozwolonym miejscu.", t);
      if (i > 0 && ts[i - 1].line === t.line)
        fail("Definicja musi zaczynać się na początku wiersza.", t);
      const line = t.line;
      i++;
      const n = ts[i++];
      if (!n || n.line !== line || !nameOk(n.v) || aliases[n.n])
        fail("Nieprawidłowa nazwa procedury.", n || t);
      const name = clean(n.v);
      if (procs.has(name))
        fail("Procedura jest już zdefiniowana.", n);
      let header = [];
      while (i < ts.length && ts[i].line === line)
        header.push(ts[i++]);
      let params = [];
      if (header.length) {
        if (header[0].n === "ma:") {
          header.shift();
          let expectName = true;
          for (const h of header) {
            if (expectName) {
              if (!nameOk(h.v))
                fail("Oczekiwano nazwy parametru.", h);
              params.push(clean(h.v));
            } else if (h.v !== ",")
              fail("Oczekiwano przecinka.", h);
            expectName = !expectName;
          }
          if (expectName)
            fail("Oczekiwano parametru.", header.at(-1) || n);
        } else {
          for (const h of header) {
            if (!h.v.startsWith(":") || !nameOk(h.v))
              fail("Nieprawidłowy parametr.", h);
            params.push(clean(h.v));
          }
        }
      }
      if (new Set(params).size !== params.length)
        fail("Powtórzona nazwa parametru.", n);
      let body = [];
      while (i < ts.length && !["już", "juz", "end"].includes(ts[i].n))
        body.push(ts[i++]);
      if (i === ts.length)
        fail("Brakuje końca procedury „już”.", t);
      const end = ts[i++];
      if (ts[i] && ts[i].line === end.line || body.at(-1) && body.at(-1).line === end.line)
        fail("„Już” musi być samo w wierszu.", end);
      procs.set(name, { name, params, t, body });
    } else {
      if (t.v === "[")
        scanDepth++;
      if (t.v === "]")
        scanDepth--;
      main.push(ts[i++]);
    }
  }
  const global = new Set;
  function collect(arr, set) {
    for (let j = 0;j < arr.length; j++)
      if (aliases[arr[j].n] === "let" && arr[j + 1])
        set.add(clean(arr[j + 1].v));
  }
  collect(main, global);
  for (const p of procs.values()) {
    p.locals = new Set(p.params);
    collect(p.body, p.locals);
  }
  function parsePart(tokens, proc) {
    let k = 0, depth = 0, repeatDepth = 0;
    const declared = new Set([...global, ...proc?.locals || []]);
    const peek = () => tokens[k];
    const take = () => tokens[k++];
    function expr(command, min = 0) {
      let t = peek();
      if (!t || ["]", ")", "[", ","].includes(t.v))
        fail("Brakuje argumentu.", t || command);
      take();
      let node;
      if (t.v === "+" || t.v === "-")
        node = { type: "unary", op: t.v, a: expr(command, 3), t };
      else if (t.v === "(") {
        node = expr(command);
        if (peek()?.v !== ")")
          fail("Brakuje nawiasu zamykającego.", peek() || t);
        take();
        node = { ...node, t };
      } else if (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(t.v))
        node = { type: "number", value: Number(t.v), t };
      else if (nameOk(t.v)) {
        let name = clean(t.v);
        if (name === "nrpowt" || name === "repcount") {
          if (!repeatDepth)
            fail("„nrpowt” działa tylko wewnątrz powtórzenia.", t);
          node = { type: "rep", t };
        } else {
          if (!declared.has(name))
            fail("Nieznana zmienna: " + t.v, t);
          node = { type: "var", name, t };
        }
      } else
        fail("Nieprawidłowe wyrażenie.", t);
      while (peek() && ["+", "-", "*", "/"].includes(peek().v)) {
        const op = peek(), prec = op.v === "*" || op.v === "/" ? 2 : 1;
        if (prec < min)
          break;
        const prev = tokens[k - 1], next = tokens[k + 1];
        if (!next)
          break;
        const left = op.start > prev.end, right = next.start > op.end;
        if (left !== right)
          break;
        take();
        node = { type: "binary", op: op.v, a: node, b: expr(command, prec + 1), t: node.t };
      }
      return node;
    }
    function block(owner, isRepeat = false) {
      const b = take();
      if (!b || b.v !== "[")
        fail("Oczekiwano nawiasu „[”.", b || owner);
      if (++depth > 32)
        fail("Przekroczono limit zagnieżdżenia nawiasów.", b);
      if (isRepeat)
        repeatDepth++;
      let result = commands(true);
      if (isRepeat)
        repeatDepth--;
      depth--;
      return result;
    }
    function commands(inBlock = false) {
      let out = [];
      while (k < tokens.length) {
        let t = take();
        if (t.v === "]") {
          if (!inBlock)
            fail("Nieoczekiwany nawias „]”.", t);
          return out;
        }
        let op = aliases[t.n];
        if (["oto", "to", "już", "juz", "end"].includes(t.n))
          fail("Definicja w niedozwolonym miejscu.", t);
        let p = procs.get(clean(t.v));
        if (!op && !p)
          fail("Nieznane polecenie: " + t.v, t);
        let item = { op: op || "call", t };
        if (["forward", "back", "right", "left", "width", "pitchup", "pitchdown", "rollright", "rollleft", "repeat"].includes(op)) {
          if (mode === "2d" && ["pitchup", "pitchdown", "rollright", "rollleft"].includes(op))
            fail("To polecenie jest dostępne tylko w 3D.", t);
          item.arg = expr(t);
          if (op === "repeat")
            item.body = block(t, true);
        } else if (op === "color") {
          let x = take();
          if (!x || !/^"#[0-9a-f]{6}"$/i.test(x.v))
            fail('Oczekiwano koloru w formacie "#rrggbb".', x || t);
          item.color = x.v.slice(1, -1).toLowerCase();
        } else if (op === "let") {
          let x = take();
          if (!x || !nameOk(x.v) || aliases[clean(x.v)] || procs.has(clean(x.v)))
            fail("Nieprawidłowa nazwa zmiennej.", x || t);
          item.name = clean(x.v);
          item.arg = expr(t);
        } else if (op === "if" || op === "ifelse") {
          item.a = expr(t);
          let cmp = take();
          if (!cmp || !["<", ">", "=", "<=", ">=", "<>"].includes(cmp.v))
            fail("Oczekiwano porównania.", cmp || t);
          item.cmp = cmp.v;
          item.b = expr(t);
          item.body = block(t);
          if (op === "ifelse")
            item.other = block(t);
        } else if (!op) {
          item.proc = p;
          item.args = p.params.map(() => expr(t));
        }
        out.push(item);
      }
      if (inBlock)
        fail("Brakuje nawiasu „]”.", tokens.at(-1));
      return out;
    }
    return commands();
  }
  const program = parsePart(main, null);
  for (const p of procs.values())
    p.code = parsePart(p.body, p);
  function literal(e) {
    return e.type === "number" || e.type === "unary" && literal(e.a) || e.type === "binary" && literal(e.a) && literal(e.b);
  }
  function check(list) {
    for (const c of list) {
      if (["width", "repeat"].includes(c.op) && literal(c.arg)) {
        let v;
        try {
          v = evalExpr(c.arg, {}, {}, []);
        } catch {
          v = NaN;
        }
        if (Number.isFinite(v) && (!Number.isInteger(v) || v < (c.op === "width" ? 1 : 0) || v > (c.op === "width" ? 12 : 1e4)))
          fail(c.op === "width" ? "Grubość musi być liczbą całkowitą od 1 do 12." : "Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.", c.arg.t);
      }
      if (c.body)
        check(c.body);
      if (c.other)
        check(c.other);
    }
  }
  check(program);
  for (const p of procs.values())
    check(p.code);
  return { program, procs };
}
function evalExpr(e, global, local, reps) {
  let v;
  if (e.type === "number")
    v = e.value;
  else if (e.type === "rep")
    v = reps.at(-1);
  else if (e.type === "var") {
    v = Object.hasOwn(local, e.name) ? local[e.name] : global[e.name];
    if (v === undefined)
      throw Error("Zmienna nie ma jeszcze wartości.");
  } else if (e.type === "unary") {
    v = evalExpr(e.a, global, local, reps) * (e.op === "-" ? -1 : 1);
  } else {
    let a = evalExpr(e.a, global, local, reps), b = evalExpr(e.b, global, local, reps);
    v = e.op === "+" ? a + b : e.op === "-" ? a - b : e.op === "*" ? a * b : a / b;
  }
  if (!Number.isFinite(v))
    throw Error("Dzielenie przez zero lub wynik nie jest liczbą skończoną.");
  return v;
}
var add = (a, b, s = 1) => a.map((x, i) => x + b[i] * s);
var scale = (a, s) => a.map((x) => x * s);
function createExecution(source, mode = "2d") {
  let parsed;
  try {
    parsed = parse(source, mode);
  } catch (e) {
    return { segments: [], error: e, done: true, step() {
      return false;
    } };
  }
  const state = { segments: [], error: null, done: false, pos: [0, 0, 0], heading: [0, 1, 0], right: [1, 0, 0], up: [0, 0, 1], pen: true, color: "#16866a", width: 3, line: 0 };
  let global = {}, ops = 0, frames = 0, reps = [];
  const tick = (t) => {
    if (++ops > 1e4)
      fail("Przekroczono limit 10 000 operacji.", t);
  };
  function value(e, local) {
    try {
      return evalExpr(e, global, local, reps);
    } catch (err) {
      fail(err.message, e.t);
    }
  }
  function move(d, t) {
    let dest = add(state.pos, state.heading, d);
    if (dest.some((x) => !Number.isFinite(x) || Math.abs(x) > 1e5))
      fail("Przekroczono zakres współrzędnych.", t);
    if (state.pen && d !== 0) {
      if (state.segments.length >= 1e4)
        fail("Przekroczono limit odcinków.", t);
      state.segments.push({ from: [...state.pos], to: [...dest], color: state.color, width: state.width });
    }
    state.pos = dest;
  }
  function* exec(list, local = {}, inside = false) {
    for (const c of list) {
      tick(c.t);
      state.line = c.t.line;
      yield c.t;
      let a = c.arg ? value(c.arg, local) : 0;
      switch (c.op) {
        case "forward":
          move(a, c.t);
          break;
        case "back":
          move(-a, c.t);
          break;
        case "right":
        case "left": {
          let r = a * Math.PI / 180 * (c.op === "right" ? 1 : -1), { heading: h, right: v } = state;
          state.heading = add(scale(h, Math.cos(r)), v, Math.sin(r));
          state.right = add(scale(v, Math.cos(r)), h, -Math.sin(r));
          break;
        }
        case "pitchup":
        case "pitchdown": {
          let r = a * Math.PI / 180 * (c.op === "pitchup" ? 1 : -1), { heading: h, up: u } = state;
          state.heading = add(scale(h, Math.cos(r)), u, Math.sin(r));
          state.up = add(scale(u, Math.cos(r)), h, -Math.sin(r));
          break;
        }
        case "rollright":
        case "rollleft": {
          let r = a * Math.PI / 180 * (c.op === "rollright" ? 1 : -1), { up: u, right: v } = state;
          state.up = add(scale(u, Math.cos(r)), v, Math.sin(r));
          state.right = add(scale(v, Math.cos(r)), u, -Math.sin(r));
          break;
        }
        case "penup":
          state.pen = false;
          break;
        case "pendown":
          state.pen = true;
          break;
        case "color":
          state.color = c.color;
          break;
        case "width":
          if (!Number.isInteger(a) || a < 1 || a > 12)
            fail("Grubość musi być liczbą całkowitą od 1 do 12.", c.arg.t);
          state.width = a;
          break;
        case "let":
          (inside ? local : global)[c.name] = a;
          break;
        case "clear":
          state.segments.length = 0;
          break;
        case "home": {
          let dist = Math.hypot(...state.pos);
          if (dist && state.pen) {
            if (state.segments.length >= 1e4)
              fail("Przekroczono limit odcinków.", c.t);
            state.segments.push({ from: [...state.pos], to: [0, 0, 0], color: state.color, width: state.width });
          }
          state.pos = [0, 0, 0];
          state.heading = [0, 1, 0];
          state.right = [1, 0, 0];
          state.up = [0, 0, 1];
          break;
        }
        case "stop":
          return true;
        case "repeat":
          if (!Number.isInteger(a) || a < 0 || a > 1e4)
            fail("Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000.", c.arg.t);
          if (++frames > 32)
            fail("Przekroczono limit zagnieżdżenia wywołań.", c.t);
          for (let j = 1;j <= a; j++) {
            reps.push(j);
            let stop = yield* exec(c.body, local, inside);
            reps.pop();
            if (stop) {
              frames--;
              return true;
            }
            tick(c.t);
          }
          frames--;
          break;
        case "if":
        case "ifelse": {
          let x = value(c.a, local), y = value(c.b, local), ok = { "<": () => x < y, ">": () => x > y, "=": () => x === y, "<=": () => x <= y, ">=": () => x >= y, "<>": () => x !== y }[c.cmp]();
          let body = ok ? c.body : c.other;
          if (body) {
            if (yield* exec(body, local, inside))
              return true;
            tick(c.t);
          }
          break;
        }
        case "call": {
          let args = c.args.map((e) => value(e, local));
          if (++frames > 32)
            fail("Przekroczono limit zagnieżdżenia wywołań.", c.t);
          let vars = Object.fromEntries(c.proc.params.map((p, i) => [p, args[i]]));
          yield* exec(c.proc.code, vars, true);
          frames--;
          tick(c.t);
          break;
        }
      }
    }
    return false;
  }
  const gen = exec(parsed.program);
  let primed = false;
  state.step = () => {
    if (state.done)
      return false;
    try {
      if (!primed) {
        gen.next();
        primed = true;
      }
      let result = gen.next();
      if (result.done) {
        state.done = true;
        state.line = 0;
        return false;
      }
      return true;
    } catch (e) {
      state.error = e.message ? { message: e.message, line: e.line || 1, column: e.column || 1 } : e;
      state.done = true;
      state.line = 0;
      return false;
    }
  };
  return state;
}
function run(source, mode = "2d") {
  let s = createExecution(source, mode);
  while (s.step())
    ;
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
];

// src/app.js
var $ = (s) => document.querySelector(s);
var app = $("#app");
app.innerHTML = `<header class="topbar"><a class="brand" href="#" aria-label="Logomocja — pracownia"><span class="brandmark">L<span>.</span></span><span>logomocja<small>PRACOWNIA ŻÓŁWIA</small></span></a><nav aria-label="Nawigacja główna"><button data-page="studio" class="nav active">Pracownia</button><button data-page="examples" class="nav">Przykłady</button><button data-page="challenges" class="nav">Wyzwania</button><button data-page="reference" class="nav">Język Logo</button></nav><button id="theme" class="icon-btn" aria-label="Zmień motyw" title="Zmień motyw">◐</button></header>
<main><section id="studio" class="page"><div class="page-heading"><div><div class="overline">TWOJA PRZESTRZEŃ DO TWORZENIA</div><h1>Pracownia <span>żółwia</span></h1><p>Wpisz kilka poleceń i zobacz, dokąd Cię zaprowadzą.</p></div><div class="heading-actions"><button id="share">Udostępnij</button><button id="restore" title="Przywróć szkic sprzed załadowania przykładu">Przywróć szkic</button><button id="download">Pobierz .logo</button><label class="button">Otwórz plik<input id="file" type="file" accept=".logo,.txt,text/plain" hidden></label></div></div>
<div class="workspace"><section class="editor-panel panel"><div class="panel-head"><div><span class="panel-title">Program</span><span class="subtle"> / edytor</span></div><div class="mode-switch" role="group" aria-label="Tryb rysowania"><button data-mode="2d" class="selected">2D</button><button data-mode="3d">3D</button></div></div><div class="editor-wrap"><div id="lines" aria-hidden="true"></div><div class="code-area"><pre id="highlight" aria-hidden="true"></pre><textarea id="editor" spellcheck="false" aria-label="Kod programu Logo" autocapitalize="off" autocomplete="off"></textarea></div></div><div id="error" role="status" class="error"></div><div class="editor-footer"><span id="draft-status">Szkic zapisuje się automatycznie</span><span>Logo · UTF-8</span></div></section>
<section class="canvas-panel panel"><div class="panel-head"><div><span class="panel-title">Podgląd</span><span id="view-mode" class="subtle"> / płaszczyzna 2D</span></div><div class="view-actions"><button id="fit" title="Dopasuj rysunek">Dopasuj</button><button id="camera" title="Resetuj widok">Reset widoku</button><button id="png" title="Pobierz obraz PNG">PNG ↓</button></div></div><div class="canvas-wrap"><canvas id="canvas" aria-label="Rysunek żółwia" tabindex="0"></canvas><div class="canvas-hint" id="hint">Przeciągnij, aby przesunąć · przewiń, aby przybliżyć</div><div class="canvas-label" id="coords">X 0 &nbsp; Y 0</div></div><div class="transport"><button id="run" class="primary">▶ <span>Uruchom</span></button><button id="step" title="Krok (Ctrl+Enter)">Krok</button><button id="pause" title="Pauza (Ctrl+.)">Pauza</button><button id="reset" title="Reset (Ctrl+Backspace)">Reset</button><label class="speed">Tempo <input id="speed" type="range" min="1" max="100" value="75" aria-label="Tempo rysowania"></label></div></section></div><div class="below"><span><i class="dot"></i> <span id="status">Gotowy do rysowania</span></span><span>Uruchom <kbd>Ctrl Enter</kbd> &nbsp; Krok <kbd>Alt Enter</kbd> &nbsp; Pauza <kbd>Ctrl .</kbd> &nbsp; Reset <kbd>Ctrl Backspace</kbd></span></div></section>
<section id="examples" class="page hidden"><div class="page-heading"><div><h1>Przykłady</h1><p>Gotowe programy na dobry początek. Wybierz jeden i sprawdź, jak działa.</p></div></div><div id="example-list" class="example-list"></div></section>
<section id="challenges" class="page hidden"><div class="page-heading"><div><h1>Wyzwania</h1><p>Małe zadania, duże odkrycia. Napisz program w pracowni i sprawdź rysunek.</p></div></div><div id="challenge-list" class="challenge-list"></div></section>
<section id="reference" class="page hidden"><div class="page-heading"><div><h1>Język Logo</h1><p>Ściąga z poleceń, wyrażeń i zasad rządzących światem żółwia.</p></div></div><article class="docs" id="docs"></article></section></main><div id="toast" role="status"></div>`;
var mode = "2d";
var execution = null;
var timer = null;
var paused = false;
var scale2 = 1;
var offset = [0, 0];
var angle = 0.65;
var elevation = 0.65;
var drag = null;
var activeChallenge = null;
var editor = $("#editor");
var canvas = $("#canvas");
var ctx = canvas.getContext("2d");
var starter = `; Twój pierwszy rysunek
kolor "#16866a"
powtorz 4 [
  np 120
  pw 90
]`;
var esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
function highlight() {
  let s = editor.value;
  let html = esc(s).replace(/(;[^\n]*|&quot;[^\n]*?&quot;|"[^"\n]*"|\b\d+(?:\.\d+)?\b|\b(?:np|pw|lw|ws|powtorz|powtórz|kolor|grubosc|niech|jeśli|jeżeli|oto|już|gora|dol|pp|pl|pod|opu|stop|dom|czyść)\b|[\[\]()])/giu, (m) => `<span class="${m[0] === ";" ? "comment" : m[0] === '"' ? "string" : /^\d/.test(m) ? "number" : /^[\[\]()]$/.test(m) ? "bracket" : "keyword"}">${m}</span>`);
  $("#highlight").innerHTML = html + `
`;
  const n = s.split(`
`).length;
  $("#lines").innerHTML = Array.from({ length: n }, (_, i) => `<div class="${execution?.line === i + 1 ? "current" : ""} ${execution?.error?.line === i + 1 ? "bad" : ""}">${i + 1}</div>`).join("");
}
function sync() {
  localStorage.setItem("logo-draft-" + mode, editor.value);
  highlight();
}
function setMode(m) {
  if (mode !== m) {
    localStorage.setItem("logo-draft-" + mode, editor.value);
    mode = m;
    editor.value = localStorage.getItem("logo-draft-" + mode) || (mode === "2d" ? starter : `; Rysuj w przestrzeni
gora 45
powtorz 4 [np 100 pw 90]`);
    reset();
  }
  document.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("selected", b.dataset.mode === mode));
  $("#view-mode").textContent = mode === "2d" ? " / płaszczyzna 2D" : " / przestrzeń 3D";
  $("#hint").textContent = mode === "2d" ? "Przeciągnij, aby przesunąć · przewiń, aby przybliżyć" : "Przeciągnij, aby obrócić · Shift + przeciągnij, aby przesunąć";
  highlight();
  draw();
}
function page(id) {
  document.querySelectorAll(".page").forEach((x) => x.classList.toggle("hidden", x.id !== id));
  document.querySelectorAll(".nav").forEach((x) => x.classList.toggle("active", x.dataset.page === id));
  if (id === "studio")
    requestAnimationFrame(draw);
}
function message(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 3000);
}
function reset() {
  clearTimeout(timer);
  timer = null;
  paused = false;
  execution = null;
  $("#error").textContent = "";
  $("#status").textContent = "Gotowy do rysowania";
  $("#pause").textContent = "Pauza";
  highlight();
  draw();
}
function prepare() {
  clearTimeout(timer);
  execution = createExecution(editor.value, mode);
  paused = false;
  showError();
  return !execution.done;
}
function showError() {
  let e = execution?.error;
  $("#error").textContent = e ? `Wiersz ${e.line}, kolumna ${e.column}: ${e.message}` : "";
  if (e)
    $("#status").textContent = "Program zatrzymany z błędem";
  highlight();
}
function step() {
  if (!execution || execution.done) {
    if (!prepare())
      return;
  }
  execution.step();
  showError();
  if (execution.done && !execution.error)
    $("#status").textContent = "Rysunek gotowy";
  draw();
}
function animate() {
  if (paused || !execution || execution.done) {
    if (execution?.done && !execution.error)
      $("#status").textContent = "Rysunek gotowy";
    showError();
    draw();
    return;
  }
  let speed = +$("#speed").value;
  let count = speed > 85 ? Math.ceil((speed - 80) / 3) : 1;
  for (let i = 0;i < count && !execution.done; i++)
    execution.step();
  showError();
  draw();
  timer = setTimeout(animate, Math.max(5, 150 - speed * 1.45));
}
function start() {
  if (!prepare())
    return;
  $("#status").textContent = "Żółw rysuje…";
  animate();
}
function project(p) {
  if (mode === "2d")
    return [p[0], -p[1]];
  let x = p[0] * Math.cos(angle) - p[1] * Math.sin(angle), depth = p[0] * Math.sin(angle) + p[1] * Math.cos(angle);
  return [x, depth * Math.sin(elevation) - p[2] * Math.cos(elevation)];
}
function resize() {
  let r = canvas.getBoundingClientRect(), d = devicePixelRatio || 1;
  if (canvas.width !== Math.round(r.width * d) || canvas.height !== Math.round(r.height * d)) {
    canvas.width = Math.round(r.width * d);
    canvas.height = Math.round(r.height * d);
  }
  ctx.setTransform(d, 0, 0, d, 0, 0);
  return [r.width, r.height];
}
function draw() {
  let [w, h] = resize();
  let dark = document.documentElement.dataset.theme === "dark" || !document.documentElement.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = dark ? "#202823" : "#fafbf7";
  ctx.fillRect(0, 0, w, h);
  let origin = [w / 2 + offset[0], h / 2 + offset[1]];
  const point = (p) => {
    let q = project(p);
    return [origin[0] + q[0] * scale2, origin[1] + q[1] * scale2];
  };
  function line(a, b, color, width = 1) {
    a = point(a);
    b = point(b);
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
  }
  let grid = dark ? "#35423b" : "#e7ece5";
  if (mode === "2d") {
    let spacing = 50;
    for (let v = -1000;v <= 1000; v += spacing) {
      line([v, -1000, 0], [v, 1000, 0], grid);
      line([-1000, v, 0], [1000, v, 0], grid);
    }
  } else {
    for (let v = -500;v <= 500; v += 50) {
      line([v, -500, 0], [v, 500, 0], grid);
      line([-500, v, 0], [500, v, 0], grid);
    }
    line([-500, 0, 0], [500, 0, 0], dark ? "#a26060" : "#cd9c91");
    line([0, -500, 0], [0, 500, 0], dark ? "#668f78" : "#9ac3a5");
    line([0, 0, 0], [0, 0, 300], dark ? "#6686ad" : "#9eb9d4");
  }
  let o = point([0, 0, 0]);
  ctx.fillStyle = dark ? "#a6b9a9" : "#96aa9b";
  ctx.beginPath();
  ctx.arc(...o, 3, 0, 7);
  ctx.fill();
  for (const s of execution?.segments || [])
    line(s.from, s.to, s.color, Math.max(1, s.width * scale2));
  let pos = execution?.pos || [0, 0, 0], head = execution?.heading || [0, 1, 0], right = execution?.right || [1, 0, 0], p = point(pos), tip = point(pos.map((x, i) => x + head[i] * 12 / scale2)), l = point(pos.map((x, i) => x - head[i] * 7 / scale2 + right[i] * 6 / scale2)), r = point(pos.map((x, i) => x - head[i] * 7 / scale2 - right[i] * 6 / scale2));
  ctx.beginPath();
  ctx.moveTo(...tip);
  ctx.lineTo(...l);
  ctx.lineTo(...r);
  ctx.closePath();
  ctx.fillStyle = "#16866a";
  ctx.fill();
  ctx.strokeStyle = dark ? "#c2e4d5" : "#fff";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  $("#coords").textContent = `X ${Math.round(pos[0])}   Y ${Math.round(pos[1])}${mode === "3d" ? "   Z " + Math.round(pos[2]) : ""}`;
}
function fit() {
  let points = (execution?.segments || []).flatMap((s) => [project(s.from), project(s.to)]);
  if (!points.length) {
    scale2 = 1;
    offset = [0, 0];
    draw();
    return;
  }
  let xs = points.map((p) => p[0]), ys = points.map((p) => p[1]), minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys), r = canvas.getBoundingClientRect();
  scale2 = Math.min((r.width - 100) / (maxX - minX || 1), (r.height - 100) / (maxY - minY || 1), 4);
  scale2 = Math.max(0.05, scale2);
  offset = [-(minX + maxX) / 2 * scale2, -(minY + maxY) / 2 * scale2];
  draw();
}
editor.addEventListener("input", () => {
  if (execution && !execution.done) {
    reset();
    $("#status").textContent = "Kod zmieniony — uruchom program ponownie";
  }
  sync();
});
editor.addEventListener("scroll", () => {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $("#lines").scrollTop = editor.scrollTop;
});
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    editor.setRangeText("  ", editor.selectionStart, editor.selectionEnd, "end");
    editor.dispatchEvent(new Event("input"));
  }
});
$("#run").onclick = start;
$("#step").onclick = step;
$("#pause").onclick = () => {
  if (!execution || execution.done)
    return;
  paused = !paused;
  $("#pause").textContent = paused ? "Wznów" : "Pauza";
  $("#status").textContent = paused ? "Wstrzymano" : "Żółw rysuje…";
  if (!paused)
    animate();
};
$("#reset").onclick = reset;
$("#fit").onclick = fit;
$("#camera").onclick = () => {
  scale2 = 1;
  offset = [0, 0];
  angle = 0.65;
  elevation = 0.65;
  draw();
};
document.querySelectorAll("[data-mode]").forEach((b) => b.onclick = () => setMode(b.dataset.mode));
document.querySelectorAll("[data-page]").forEach((b) => b.onclick = () => page(b.dataset.page));
canvas.addEventListener("keydown", (e) => {
  let used = true;
  if (e.key === "+" || e.key === "=")
    scale2 = Math.min(10, scale2 * 1.15);
  else if (e.key === "-")
    scale2 = Math.max(0.05, scale2 / 1.15);
  else if (e.key === "ArrowLeft") {
    if (mode === "3d" && !e.shiftKey)
      angle -= 0.1;
    else
      offset[0] -= 20;
  } else if (e.key === "ArrowRight") {
    if (mode === "3d" && !e.shiftKey)
      angle += 0.1;
    else
      offset[0] += 20;
  } else if (e.key === "ArrowUp") {
    if (mode === "3d" && !e.shiftKey)
      elevation = Math.max(-1.4, elevation - 0.1);
    else
      offset[1] -= 20;
  } else if (e.key === "ArrowDown") {
    if (mode === "3d" && !e.shiftKey)
      elevation = Math.min(1.4, elevation + 0.1);
    else
      offset[1] += 20;
  } else
    used = false;
  if (used) {
    e.preventDefault();
    draw();
  }
});
canvas.addEventListener("pointerdown", (e) => {
  drag = [e.clientX, e.clientY, e.shiftKey || e.button === 1];
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener("pointermove", (e) => {
  if (!drag)
    return;
  let dx = e.clientX - drag[0], dy = e.clientY - drag[1];
  if (mode === "3d" && !drag[2]) {
    angle += dx * 0.01;
    elevation = Math.max(-1.4, Math.min(1.4, elevation + dy * 0.01));
  } else {
    offset[0] += dx;
    offset[1] += dy;
  }
  drag = [e.clientX, e.clientY, drag[2]];
  draw();
});
canvas.addEventListener("pointerup", () => drag = null);
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  scale2 = Math.max(0.05, Math.min(10, scale2 * Math.exp(-e.deltaY * 0.001)));
  draw();
}, { passive: false });
new ResizeObserver(draw).observe(canvas);
$("#theme").onclick = () => {
  let current = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  document.documentElement.dataset.theme = current === "dark" ? "light" : "dark";
  localStorage.setItem("logo-theme", document.documentElement.dataset.theme);
  draw();
};
if (localStorage.getItem("logo-theme"))
  document.documentElement.dataset.theme = localStorage.getItem("logo-theme");
function download(name, data, type) {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([data], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("#restore").onclick = () => {
  let backup = localStorage.getItem("logo-backup-" + mode);
  if (backup === null) {
    message("Brak zapisanego poprzedniego szkicu.");
    return;
  }
  editor.value = backup;
  sync();
  reset();
  message("Przywrócono poprzedni szkic.");
};
$("#download").onclick = () => download("program.logo", editor.value, "text/plain;charset=utf-8");
$("#file").onchange = async (e) => {
  let f = e.target.files[0];
  if (f) {
    editor.value = await f.text();
    sync();
    reset();
    message("Plik został otwarty.");
  }
  e.target.value = "";
};
$("#png").onclick = () => {
  let a = document.createElement("a");
  a.download = "logomocja.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
};
$("#share").onclick = async () => {
  let payload = btoa(unescape(encodeURIComponent(JSON.stringify({ source: editor.value, mode }))));
  let url = location.href.split("#")[0] + "#program=" + encodeURIComponent(payload);
  try {
    await navigator.clipboard.writeText(url);
    message("Link skopiowany do schowka.");
  } catch {
    prompt("Skopiuj link do programu:", url);
  }
};
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    e.preventDefault();
    start();
  } else if (e.altKey && e.key === "Enter") {
    e.preventDefault();
    step();
  } else if (e.ctrlKey && e.key === ".") {
    e.preventDefault();
    $("#pause").click();
  } else if (e.ctrlKey && e.key === "Backspace") {
    e.preventDefault();
    reset();
  }
});
$("#example-list").innerHTML = examples.map((e, i) => `<article class="example"><div class="example-number">${String(i + 1).padStart(2, "0")}</div><div><div class="example-title">${e[1]} <span class="badge">${e[2].toUpperCase()}</span></div><p>${e[3]}</p></div><button data-example="${i}">Otwórz program <span>→</span></button></article>`).join("");
document.querySelectorAll("[data-example]").forEach((b) => b.onclick = () => {
  let e = examples[+b.dataset.example];
  if (editor.value.trim() && !confirm("Otworzyć przykład? Aktualny szkic zostanie zachowany jako kopia do odzyskania."))
    return;
  localStorage.setItem("logo-backup-" + mode, editor.value);
  setMode(e[2]);
  localStorage.setItem("logo-backup-" + mode, editor.value);
  editor.value = e[4];
  sync();
  reset();
  page("studio");
  message("Przykład otwarty. Poprzedni szkic jest dostępny w kopii lokalnej.");
});
var challenges = [["Pierwsza linia", "Narysuj odcinek długości 100 do przodu.", "np 100"], ["Kwadrat", "Narysuj kwadrat o boku 100, zaczynając od ruchu do przodu.", "powtorz 4 [np 100 pw 90]"], ["Trójkąt", "Narysuj trójkąt równoboczny o boku 100. Skręcaj w prawo.", "powtorz 3 [np 100 pw 120]"], ["Schodek", "Narysuj odcinek 50 do przodu, potem 50 w prawo.", "np 50 pw 90 np 50"], ["Krzyżyk", "Narysuj linię 100, wróć bez rysowania i narysuj linię 100 w prawo.", "np 100 pod ws 100 opu pw 90 np 100"]];
function challengeList() {
  let done = JSON.parse(localStorage.getItem("logo-progress") || "{}");
  $("#challenge-list").innerHTML = challenges.map((c, i) => `<article class="challenge"><div class="challenge-index">${done[i] ? "✓" : String(i + 1).padStart(2, "0")}</div><div><h2>${c[0]}</h2><p>${c[1]}</p><div id="challenge-result-${i}" class="challenge-result">${done[i] ? "Ukończone" : ""}</div></div><div class="challenge-actions"><button data-task="${i}">Pisz w pracowni</button><button data-check="${i}" class="outline">Sprawdź rysunek</button></div></article>`).join("");
  document.querySelectorAll("[data-task]").forEach((b) => b.onclick = () => {
    activeChallenge = +b.dataset.task;
    setMode("2d");
    page("studio");
    message("Wyzwanie: " + challenges[activeChallenge][0] + ". Wróć do wyzwań, aby sprawdzić.");
  });
  document.querySelectorAll("[data-check]").forEach((b) => b.onclick = () => {
    let i = +b.dataset.check;
    let actual = run(mode === "2d" ? editor.value : localStorage.getItem("logo-draft-2d") || "", "2d"), expected = run(challenges[i][2], "2d");
    let a = actual.segments, e = expected.segments;
    let equal = !actual.error && a.length === e.length && a.every((s, j) => ["from", "to"].every((k) => s[k].every((v, n) => Math.abs(v - e[j][k][n]) < 0.1)));
    let result = $("#challenge-result-" + i);
    if (equal) {
      let d = JSON.parse(localStorage.getItem("logo-progress") || "{}");
      d[i] = true;
      localStorage.setItem("logo-progress", JSON.stringify(d));
      result.textContent = "Brawo! Rysunek zgadza się z zadaniem.";
      result.className = "challenge-result success";
    } else {
      result.textContent = actual.error ? "Program zawiera błąd: " + actual.error.message : `Rysunek jeszcze nie pasuje: oczekiwano ${e.length} odcinków w odpowiednich miejscach, otrzymano ${a.length}.`;
      result.className = "challenge-result failure";
    }
  });
}
challengeList();
$("#docs").innerHTML = `<h2>Pierwsze kroki</h2><p>Żółw zaczyna w punkcie (0, 0, 0), patrząc do przodu wzdłuż osi Y. Pisze zielonym pisakiem. Polecenia można oddzielać spacją lub nową linią; średnik rozpoczyna komentarz.</p><pre>np 100   ; idź do przodu
pw 90    ; skręć w prawo</pre><h2>Ruch i pisak</h2><div class="table-wrap"><table><thead><tr><th>Polecenie i aliasy</th><th>Działanie i przykład</th></tr></thead><tbody>${[["np, naprzod, naprzód, fd, forward", "Ruch do przodu: np 100"], ["ws, wstecz, bk, back", "Ruch do tyłu: ws 50"], ["pw, prawo, rt, right", "Obrót w prawo: pw 90"], ["lw, lewo, lt, left", "Obrót w lewo: lw 90"], ["pod, podnies, podnieś, pu, penup", "Podnieś pisak: pod"], ["opu, opusc, opuść, pd, pendown", "Opuść pisak: opu"], ["kolor, color", 'Kolor pisaka: kolor "#16866a"'], ["grubosc, grubość, width", "Grubość od 1 do 12: grubosc 3"], ["dom, home", "Wróć do początku i ustawienia: dom"], ["czyść, czysc, cs, clearscreen", "Usuń narysowane odcinki: czyść"], ["gora, góra, pitchup", "Unieś dziób w 3D: gora 90"], ["dol, dół, pitchdown", "Opuść dziób w 3D: dol 90"], ["pp, przechylprawo, rr, rollright", "Przechyl w prawo w 3D: pp 90"], ["pl, przechyllewo, rl, rollleft", "Przechyl w lewo w 3D: pl 90"], ["stop", "Zakończ procedurę lub program: stop"]].map((x) => `<tr><td><code>${x[0]}</code></td><td>${esc(x[1])}</td></tr>`).join("")}</tbody></table></div><h2>Powtórzenia i zmienne</h2><p><code>powtorz</code>, <code>powtórz</code> lub <code>repeat</code> wykonuje blok od 0 do 10 000 razy. <code>nrpowt</code> (lub <code>repcount</code>) to numer bieżącego powtórzenia. <code>niech</code> (lub <code>let</code>) przypisuje zmienną.</p><pre>niech bok 40
powtorz 4 [np bok pw 90]</pre><h2>Wyrażenia i warunki</h2><p>Możesz używać +, -, *, /, nawiasów i znaków jednoargumentowych. Mnożenie i dzielenie mają pierwszeństwo. Wokół operatora muszą być spacje po obu stronach albo po żadnej. Porównania: &lt;, &gt;, =, &lt;=, &gt;=, &lt;&gt; są dokładne.</p><pre>jeśli bok &gt; 20 [np bok]
jeżeli bok = 40 [pw 90] [lw 90]</pre><p>Aliasy: <code>jesli</code>, <code>if</code>, <code>jezeli</code>, <code>ifelse</code>.</p><h2>Procedury</h2><p>Definicja zaczyna się od <code>oto</code> (lub <code>to</code>) na początku wiersza, a kończy osobnym wierszem <code>już</code> (lub <code>juz</code>, <code>end</code>). Parametry i zmienne przypisane w procedurze są lokalne. Można też zapisać parametry jako <code>:bok</code>.</p><pre>oto kwadrat ma: bok
  powtorz 4 [np bok pw 90]
już
kwadrat 80</pre><h2>Granice</h2><p>Program może mieć 50 000 znaków, 10 000 tokenów, 32 poziomy nawiasów i 32 aktywne ramki wywołań lub powtórzeń. Limit to 10 000 operacji i 10 000 zachowanych odcinków; współrzędne mieszczą się w zakresie ±100 000. Błąd składni zatrzymuje program przed rysowaniem, a błąd wykonania zachowuje dotychczasowy rysunek.</p><h2>Skróty klawiaturowe</h2><p>Ctrl Enter — uruchom · Alt Enter — krok · Ctrl . — pauza lub wznowienie · Ctrl Backspace — reset.</p>`;
window.logomocja = { version: "1.0.0", run, async open(source, m) {
  setMode(m);
  editor.value = source;
  sync();
  reset();
  execution = createExecution(source, m);
  while (execution.step())
    ;
  showError();
  page("studio");
  fit();
  await new Promise(requestAnimationFrame);
  draw();
  return { segments: execution.segments, error: execution.error };
} };
editor.value = localStorage.getItem("logo-draft-2d") || starter;
setMode("2d");
if (location.hash.startsWith("#program=")) {
  try {
    let obj = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(location.hash.slice(9))))));
    window.logomocja.open(obj.source, obj.mode);
  } catch {
    message("Nie udało się odczytać linku do programu.");
  }
}
