import "./style.css";
import { createMachine, run, aliases } from "./interpreter.js";
import { examples } from "./examples.js";
import { TurtleView, thumbnail } from "./view.js";
import { tasks, reference, escape } from "./content.js";
const $ = (s) => document.querySelector(s);
const icon = (name) => {
  const paths = {
    play: "M8 5l11 7-11 7z",
    step: "M5 5l10 7-10 7z M19 5v14",
    pause: "M8 5v14 M16 5v14",
    reset: "M4 10a8 8 0 1 1 1 8 M4 4v6h6",
    fit: "M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5 M8 12h8 M12 8v8",
    download: "M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5",
    share:
      "M9 15l6-6 M8 16l-2 2a4 4 0 0 1-6-6l5-5 M16 8l2-2a4 4 0 0 1 6 6l-5 5",
    sun: "M12 3v2 M12 19v2 M3 12h2 M19 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    folder: "M3 7V4h7l2 3h9v13H3z",
    arrow: "M5 12h14 M14 7l5 5-5 5",
    check: "M5 12l4 4L19 6",
    close: "M6 6l12 12 M6 18L18 6",
    turtle:
      "M7 9l-3-3 M17 9l3-3 M7 16l-3 3 M17 16l3 3 M10 5V3h4v2 M6 12a6 7 0 1 0 12 0 6 7 0 1 0-12 0 M9 10l3-3 3 3v5l-3 3-3-3z",
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.arrow}"/></svg>`;
};
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem("logomocja:" + key)) ?? fallback;
  } catch {
    return fallback;
  }
}
let storageOK = true;
function save(key, value) {
  try {
    localStorage.setItem("logomocja:" + key, JSON.stringify(value));
  } catch {
    storageOK = false;
  }
}
let mode = read("mode", "2d");
if (!["2d", "3d"].includes(mode)) mode = "2d";
let drafts = read("drafts", {
  "2d": examples[2].source,
  "3d": examples[8].source,
});
let history = read("history", []),
  progress = read("progress", {}),
  theme = read("theme", "system");
let selectedTask = null,
  machine = null,
  running = false,
  timer = null,
  title = "Mój szkic",
  error = null;
const initial = examples.find((e) => e.source === drafts[mode]);
if (initial) title = initial.name;
const defaultState = () => createMachine("", mode).state;
document.querySelector("#app").innerHTML = `
<header class="header"><a class="brand" href="#" aria-label="Logomocja — pracownia"><span class="brand-icon">${icon("turtle")}</span>logomocja<span class="brand-dot">.</span></a><nav aria-label="Nawigacja główna"><button class="nav active" data-page="studio">Pracownia</button><button class="nav" data-page="examples">Przykłady<span class="nav-count">13</span></button><button class="nav" data-page="tasks">Wyzwania</button><button class="nav" data-page="reference">Słownik poleceń</button></nav><button id="theme" class="icon-button theme-button" aria-label="Motyw: systemowy" title="Zmień motyw">${icon("sun")}</button></header>
<main><section id="studio" class="page"><div class="intro"><div><div class="eyebrow"><span class="tiny-dot"></span> TWOJA PRACOWNIA KREATYWNEGO KODOWANIA</div><h1>Małe polecenia. <em>Wielkie możliwości.</em></h1><p>Pomyśl, napisz, narysuj. Żółw zrobi resztę.</p></div><div class="intro-note"><span class="hand-star">✳</span><span>Od pierwszej kreski<br>do trzeciego wymiaru.</span></div></div>
<div class="workspace"><section class="editor-panel" aria-label="Edytor programu"><div class="panel-heading"><div class="panel-title"><span class="code-mark">&lt;/&gt;</span><span id="program-title">${escape(title)}</span><span class="file-ext">.logo</span></div><button id="files" class="icon-button" title="Pliki i historia" aria-label="Pliki i historia">${icon("folder")}</button></div><div class="editor-info"><span><span class="tiny-dot"></span> <span id="saved">Zapisano na tym urządzeniu</span></span><span>LOGO</span></div><div class="code-editor"><div id="line-numbers" aria-hidden="true"></div><div class="code-area"><pre id="highlight" aria-hidden="true"></pre><textarea id="source" aria-label="Kod programu Logo" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div></div><div id="error-detail" role="alert" hidden></div><div class="editor-foot"><span id="cursor">Ln 1, Kol 1</span><span>UTF-8 <span class="foot-dot">·</span> Polski Logo</span></div><div class="run-bar"><button id="run" class="primary">${icon("play")}<span>Uruchom</span><kbd>⌘ ↵</kbd></button><button id="step" class="icon-button boxed" title="Krok (F10)" aria-label="Wykonaj jeden krok (F10)">${icon("step")}</button><button id="pause" class="icon-button boxed" title="Pauza / wznów (F8)" aria-label="Pauza lub wznów (F8)">${icon("pause")}</button><button id="reset" class="icon-button boxed" title="Reset (Shift + Esc)" aria-label="Reset programu (Shift + Esc)">${icon("reset")}</button></div><div class="speed-row"><label for="speed">Tempo żółwia</label><span class="speed-slow">wolniej</span><input id="speed" type="range" min="1" max="100" value="70" aria-label="Tempo animacji"><span>szybciej</span></div></section>
<section class="drawing-panel" aria-label="Rysunek"><div class="panel-heading"><div class="mode-switch" role="group" aria-label="Wymiar rysunku"><button id="mode2d" aria-pressed="true">2D <span>Płaszczyzna</span></button><button id="mode3d" aria-pressed="false">3D <span>Przestrzeń</span></button></div><div class="canvas-top-actions"><button id="png" class="quiet">${icon("download")}<span>Eksport PNG</span></button><button id="share" class="quiet">${icon("share")}<span>Udostępnij</span></button></div></div><div class="canvas-wrap"><canvas id="drawing" tabindex="0" aria-label="Płótno żółwia. Strzałki przesuwają lub obracają widok, plus i minus przybliżają, F dopasowuje."></canvas><div class="canvas-label"><span class="tiny-dot"></span><span id="view-label">WIDOK Z GÓRY</span></div><div class="view-tools"><button id="pan" class="icon-button" title="Przełącz obracanie i przesuwanie 3D" aria-label="Tryb przesuwania kamery" aria-pressed="false">✥</button><span></span><button id="zoom-in" class="icon-button" aria-label="Przybliż">+</button><button id="zoom-out" class="icon-button" aria-label="Oddal">−</button><span></span><button id="fit" class="icon-button" title="Dopasuj rysunek (F)" aria-label="Dopasuj rysunek">${icon("fit")}</button><button id="camera-reset" class="icon-button" title="Reset kamery (0)" aria-label="Reset kamery">${icon("reset")}</button></div><div class="canvas-hint" id="canvas-hint">Przeciągnij, aby przesunąć · przewiń, aby przybliżyć</div></div><div class="drawing-foot"><span id="execution-status" role="status"><span class="tiny-dot"></span> Gotowe do rysowania</span><div><span id="segment-count">0 odcinków</span><span class="foot-dot">·</span><span id="zoom-label">100%</span></div></div></section></div>
<div id="active-task" hidden></div><section class="inspiration"><div class="section-line"><div><span class="eyebrow">OD CZEGO ZACZNIEMY?</span><h2>Pomysł na pierwszą podróż</h2></div><button class="text-link" data-page="examples">Wszystkie przykłady ${icon("arrow")}</button></div><div id="featured" class="featured-grid"></div></section><div class="bottom-note"><span>${icon("turtle")} Nie musisz znać drogi. Wystarczy pierwszy krok.</span><button id="shortcuts" class="text-link">Skróty klawiszowe <kbd>?</kbd></button></div></section>
<section id="examples" class="page" hidden><div class="page-intro"><span class="eyebrow">13 SPOSOBÓW NA „A CO, JEŚLI…”</span><h1>Zacznij od ciekawości.</h1><p>Wczytaj przykład, uruchom i zmień jedną liczbę. Zobacz, co się stanie.</p></div><div class="filter-row" role="group" aria-label="Filtr przykładów"><button class="chip active" data-filter="all">Wszystkie</button><button class="chip" data-filter="2d">Płaszczyzna 2D</button><button class="chip" data-filter="3d">Przestrzeń 3D</button><span>Twój szkic trafi do historii przed wczytaniem.</span></div><div id="example-grid" class="example-grid"></div></section>
<section id="tasks" class="page" hidden><div class="page-intro"><span class="eyebrow">NAUKA PRZEZ RYSOWANIE</span><h1>Małe wyzwania, duża satysfakcja.</h1><p>Znajdź własną drogę do rysunku. Liczy się geometria, nie kolor ani kolejność kresek.</p></div><div class="progress-line"><span id="progress-label"></span><progress id="progress" max="6" value="0" aria-label="Ukończone wyzwania"></progress></div><div id="task-grid" class="example-grid"></div></section>
<section id="reference" class="page reference-page" hidden>${reference()}</section></main><footer><span>logomocja<span class="brand-dot">.</span> <span class="footer-caption">Stara dobra ciekawość. Nowa przestrzeń.</span></span><span>Bez konta. Bez chmury. Po Twojemu. <span class="tiny-dot"></span></span></footer>
<dialog id="dialog"><div class="dialog-heading"><h2 id="dialog-title"></h2><button id="close-dialog" class="icon-button" aria-label="Zamknij">${icon("close")}</button></div><div id="dialog-content"></div></dialog><div id="toast" role="status" hidden></div><input id="file-input" type="file" accept=".logo,text/plain" hidden>`;
const editor = $("#source"),
  view = new TurtleView($("#drawing"));
editor.value = drafts[mode] || "";
view.mode = mode;
const previews = new Map(
  examples.map((e) => [
    e.id,
    thumbnail(run(e.source, e.mode).segments, e.mode),
  ]),
);
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => ($("#toast").hidden = true), 4500);
}
function modal(title, html) {
  $("#dialog-title").textContent = title;
  $("#dialog-content").innerHTML = html;
  $("#dialog").showModal();
}
$("#close-dialog").onclick = () => $("#dialog").close();
$("#dialog").addEventListener("click", (e) => {
  if (e.target === $("#dialog")) $("#dialog").close();
});
function page(name) {
  document
    .querySelectorAll(".page")
    .forEach((el) => (el.hidden = el.id !== name));
  document.querySelectorAll(".nav").forEach((el) => {
    el.classList.toggle("active", el.dataset.page === name);
    el.setAttribute(
      "aria-current",
      el.dataset.page === name ? "page" : "false",
    );
  });
  if (name === "studio") requestAnimationFrame(() => view.draw());
  window.scrollTo({ top: 0, behavior: "instant" });
}
document
  .querySelectorAll("[data-page]")
  .forEach((b) => (b.onclick = () => page(b.dataset.page)));
$(".brand").onclick = (e) => {
  e.preventDefault();
  page("studio");
};
function applyTheme() {
  const resolved =
    theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  document.documentElement.dataset.theme = resolved;
  $("#theme").setAttribute(
    "aria-label",
    "Motyw: " +
      { system: "systemowy", light: "jasny", dark: "ciemny" }[theme] +
      ". Kliknij, aby zmienić.",
  );
  $("#theme").title = $("#theme").getAttribute("aria-label");
  view.draw();
}
$("#theme").onclick = () => {
  theme = { system: "light", light: "dark", dark: "system" }[theme];
  save("theme", theme);
  applyTheme();
  toast(
    "Motyw: " + { system: "systemowy", light: "jasny", dark: "ciemny" }[theme],
  );
};
matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  applyTheme,
);
function persist() {
  drafts[mode] = editor.value;
  save("drafts", drafts);
  $("#saved").textContent = storageOK
    ? "Zapisano na tym urządzeniu"
    : "Pamięć niedostępna — pobierz plik";
}
function archive() {
  if (editor.value.trim() && history[0]?.source !== editor.value) {
    history.unshift({ source: editor.value, mode, title, date: Date.now() });
    history = history.slice(0, 20);
    save("history", history);
  }
}
function highlight() {
  const lines = editor.value.split("\n");
  const regex =
    /(;[^\n]*|"[^"\n]*"?|(?:\d+(?:\.\d*)?|\.\d+)|[:\p{L}_][\p{L}\p{N}_:]*|[\[\](),]|[+*/<>=-])/gu;
  $("#highlight").innerHTML = lines
    .map((line, index) => {
      let html = "",
        last = 0;
      for (const match of line.matchAll(regex)) {
        html += escape(line.slice(last, match.index));
        const t = match[0],
          cls = t.startsWith(";")
            ? "comment"
            : t.startsWith('"')
              ? "string"
              : /^\d|^\./.test(t)
                ? "number"
                : aliases[t.toLowerCase()] || t.toLowerCase() === "ma:"
                  ? "keyword"
                  : /^[\[\](),]$/.test(t)
                    ? "bracket"
                    : /^[+*/<>=-]$/.test(t)
                      ? "operator"
                      : "name";
        html += `<span class="syntax-${cls}">${escape(t)}</span>`;
        last = match.index + t.length;
      }
      html += escape(line.slice(last));
      return `<span class="code-line ${!machine?.state.done && machine?.state.line === index + 1 ? "executing" : ""} ${error?.line === index + 1 ? "has-error" : ""}">${html || " "}${error?.line === index + 1 ? `<span class="error-pointer" style="left:${error.column - 1}ch" title="${escape(error.message)}">⌃</span>` : ""}</span>`;
    })
    .join("");
  $("#line-numbers").innerHTML = lines
    .map(
      (_, i) =>
        `<span class="${!machine?.state.done && machine?.state.line === i + 1 ? "current" : ""} ${error?.line === i + 1 ? "error-number" : ""}">${i + 1}</span>`,
    )
    .join("");
  syncScroll();
  cursor();
}
function syncScroll() {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $("#line-numbers").scrollTop = editor.scrollTop;
}
function cursor() {
  const before = editor.value.slice(0, editor.selectionStart).split("\n");
  $("#cursor").textContent =
    `Ln ${before.length}, Kol ${before.at(-1).length + 1}`;
}
editor.addEventListener("scroll", syncScroll);
editor.addEventListener("click", cursor);
editor.addEventListener("keyup", cursor);
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = editor.selectionStart;
    editor.setRangeText("  ", start, editor.selectionEnd, "end");
    editor.dispatchEvent(new Event("input"));
  }
});
editor.addEventListener("input", () => {
  const wasRunning = running;
  pause();
  machine = null;
  error = null;
  $("#error-detail").hidden = true;
  title = "Mój szkic";
  $("#program-title").textContent = title;
  persist();
  highlight();
  setStatus(
    wasRunning
      ? "Edycja zatrzymała wykonanie. Uruchom ponownie."
      : "Szkic gotowy do uruchomienia",
  );
});
function setStatus(s) {
  $("#execution-status").innerHTML =
    `<span class="tiny-dot ${error ? "red" : ""}"></span>${escape(s)}`;
}
function pause() {
  running = false;
  clearTimeout(timer);
  $("#pause").setAttribute("aria-pressed", "false");
  $("#pause").innerHTML = icon("pause");
}
function update() {
  error = machine?.state.error || null;
  view.state = machine?.state || defaultState();
  view.draw();
  highlight();
  $("#error-detail").hidden = !error;
  if (error) {
    $("#error-detail").innerHTML =
      `<strong>Linia ${error.line}, kolumna ${error.column}</strong><span>${escape(error.message)}</span>`;
    setStatus("Sprawdź zaznaczone miejsce w kodzie");
  } else if (machine?.state.done) setStatus("Gotowe. Dokąd teraz?");
  else
    setStatus(
      running ? "Żółw rysuje…" : "Wstrzymano — możesz wykonać kolejny krok",
    );
  $("#segment-count").textContent = `${view.state.segments.length} odcinków`;
  if (machine?.state.done) pause();
}
function prepare() {
  pause();
  machine = createMachine(editor.value, mode);
  update();
}
function tick() {
  if (!running || !machine) return;
  const speed = +$("#speed").value;
  let batch = speed > 85 ? Math.round((speed - 80) * 1.5) : 1;
  for (let i = 0; i < batch && !machine.state.done; i++) machine.step();
  update();
  if (running) timer = setTimeout(tick, Math.max(8, 360 - speed * 4));
}
function start() {
  prepare();
  if (!machine.state.done) {
    running = true;
    $("#pause").setAttribute("aria-pressed", "true");
    tick();
  }
}
function step() {
  pause();
  if (!machine || machine.state.done) prepare();
  if (!machine.state.done) machine.step();
  update();
}
function togglePause() {
  if (running) {
    pause();
    setStatus("Pauza — wznów, gdy zechcesz");
  } else if (machine && !machine.state.done) {
    running = true;
    $("#pause").setAttribute("aria-pressed", "true");
    tick();
  } else start();
}
function reset() {
  pause();
  machine = null;
  error = null;
  view.state = defaultState();
  $("#error-detail").hidden = true;
  highlight();
  view.reset();
  $("#segment-count").textContent = "0 odcinków";
  setStatus("Czysta kartka. Nowy początek.");
}
function finish() {
  prepare();
  while (!machine.state.done) machine.step();
  update();
  view.fit();
  return { segments: machine.state.segments, error: machine.state.error };
}
function setMode(next) {
  if (mode === next) return;
  persist();
  pause();
  mode = next;
  save("mode", mode);
  editor.value = drafts[mode] || "";
  title = examples.find((e) => e.source === editor.value)?.name || "Mój szkic";
  $("#program-title").textContent = title;
  view.mode = mode;
  reset();
  modeUI();
}
function modeUI() {
  $("#mode2d").setAttribute("aria-pressed", mode === "2d");
  $("#mode3d").setAttribute("aria-pressed", mode === "3d");
  $("#view-label").textContent =
    mode === "2d" ? "WIDOK Z GÓRY" : "PRZESTRZEŃ · X Y Z";
  $("#pan").hidden = mode !== "3d";
  $("#canvas-hint").textContent =
    mode === "2d"
      ? "Przeciągnij, aby przesunąć · przewiń, aby przybliżyć"
      : "Przeciągnij, aby obrócić · Shift, aby przesunąć";
  view.draw();
}
function load(source, next, name = "Mój szkic", instant = true) {
  archive();
  setMode(next);
  archive();
  editor.value = source;
  title = name;
  $("#program-title").textContent = title;
  persist();
  page("studio");
  if (instant) finish();
  else {
    reset();
    highlight();
  }
  toast("Wczytano. Poprzedni szkic znajdziesz w Plikach → Historia.");
}
$("#mode2d").onclick = () => setMode("2d");
$("#mode3d").onclick = () => setMode("3d");
$("#run").onclick = start;
$("#step").onclick = step;
$("#pause").onclick = togglePause;
$("#reset").onclick = reset;
$("#zoom-in").onclick = () => view.zoom(1.25);
$("#zoom-out").onclick = () => view.zoom(0.8);
$("#fit").onclick = () => view.fit();
$("#camera-reset").onclick = () => view.reset();
$("#pan").onclick = () => {
  view.dragMode = view.dragMode === "orbit" ? "pan" : "orbit";
  $("#pan").setAttribute("aria-pressed", view.dragMode === "pan");
};
view.onDraw = () =>
  ($("#zoom-label").textContent = Math.round(view.scale * 100) + "%");
function download(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("#png").onclick = () => {
  $("#drawing").toBlob((b) => {
    if (b) download(b, "logomocja-" + mode + ".png");
  });
};
function encode(data) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}
function decode(s) {
  const bytes = Uint8Array.from(
    atob(s.replaceAll("-", "+").replaceAll("_", "/")),
    (c) => c.charCodeAt(0),
  );
  return JSON.parse(new TextDecoder().decode(bytes));
}
$("#share").onclick = () => {
  const url = new URL(location.href);
  url.hash = "p=" + encode({ source: editor.value, mode });
  modal(
    "Podaj pomysł dalej",
    `<p>Ten link zawiera Twój kod i tryb rysowania. Po otwarciu program uruchomi się automatycznie — bez konta i bez serwera.</p><label class="field-label" for="share-url">Link do programu</label><input class="text-input" id="share-url" readonly value="${escape(url.href)}"><button id="copy-link" class="primary">Kopiuj link</button><p class="muted">Długie programy tworzą długie linki. Możesz też przekazać plik .logo.</p>`,
  );
  $("#copy-link").onclick = async () => {
    try {
      await navigator.clipboard.writeText(url.href);
      toast("Link skopiowany!");
    } catch {
      $("#share-url").select();
      toast("Zaznaczono link — skopiuj go za pomocą Ctrl / ⌘ + C.");
    }
  };
};
$("#files").onclick = () => {
  modal(
    "Pliki i historia",
    `<div class="file-actions"><button id="save-file" class="primary">${icon("download")} Pobierz .logo</button><button id="open-file" class="secondary">${icon("folder")} Otwórz .logo</button></div><h3>Poprzednie szkice</h3><p class="muted">Ostatnie 20 wersji zachowanych przed wczytaniem. Tylko na tym urządzeniu.</p><div class="history-list">${history.length ? history.map((h, i) => `<button class="history-item" data-history="${i}"><span><strong>${escape(h.title)}</strong><small>${new Date(h.date).toLocaleString("pl-PL")} · ${h.mode.toUpperCase()}</small></span><span>Przywróć ↗</span></button>`).join("") : "<p>Tu pojawią się szkice, gdy wczytasz przykład, plik lub wyzwanie.</p>"}</div>`,
  );
  $("#save-file").onclick = () =>
    download(
      new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
      "program.logo",
    );
  $("#open-file").onclick = () => $("#file-input").click();
  document.querySelectorAll("[data-history]").forEach(
    (b) =>
      (b.onclick = () => {
        const h = history[+b.dataset.history];
        $("#dialog").close();
        load(h.source, h.mode, h.title, false);
      }),
  );
};
$("#file-input").onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 200000) {
    toast("Plik jest zbyt duży. Limit programu: 50 000 znaków.");
    return;
  }
  const source = await file.text();
  if (source.length > 50000) {
    toast("Program przekracza limit 50 000 znaków.");
    return;
  }
  $("#dialog").close();
  load(source, mode, file.name.replace(/\.logo$/i, ""), false);
  e.target.value = "";
};
function exampleCard(e, small = false) {
  return `<button class="example-card ${small ? "small" : ""}" data-example="${e.id}"><div class="preview">${previews.get(e.id)}<span class="pill">${e.mode.toUpperCase()}</span></div><div class="example-copy"><h3>${escape(e.name)}<span>↗</span></h3><p>${escape(e.description)}</p></div></button>`;
}
function bindExamples() {
  document.querySelectorAll("[data-example]").forEach(
    (b) =>
      (b.onclick = () => {
        const e = examples.find((e) => e.id === b.dataset.example);
        selectedTask = null;
        renderActiveTask();
        load(e.source, e.mode, e.name);
      }),
  );
}
$("#featured").innerHTML = ["kwadrat", "gwiazda", "drzewo", "szescian"]
  .map((id) =>
    exampleCard(
      examples.find((e) => e.id === id),
      true,
    ),
  )
  .join("");
function renderExamples(filter = "all") {
  $("#example-grid").innerHTML = examples
    .filter((e) => filter === "all" || e.mode === filter)
    .map((e) => exampleCard(e))
    .join("");
  bindExamples();
}
renderExamples();
document.querySelectorAll("[data-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll("[data-filter]")
        .forEach((x) => x.classList.toggle("active", x === b));
      renderExamples(b.dataset.filter);
    }),
);
function renderTasks() {
  $("#progress-label").textContent =
    `${Object.keys(progress).filter((k) => progress[k]).length} z 6 wyzwań ukończonych`;
  $("#progress").value = Object.keys(progress).filter(
    (k) => progress[k],
  ).length;
  $("#task-grid").innerHTML = tasks
    .map(
      (t, i) =>
        `<button class="example-card task-card" data-task="${t.id}"><div class="preview">${thumbnail(run(t.source, t.mode).segments, t.mode)}<span class="pill">${progress[t.id] ? "✓ GOTOWE" : t.mode.toUpperCase()}</span></div><div class="example-copy"><span class="eyebrow">0${i + 1} / ${t.level}</span><h3>${t.name}<span>↗</span></h3><p>${t.description}</p></div></button>`,
    )
    .join("");
  document.querySelectorAll("[data-task]").forEach(
    (b) =>
      (b.onclick = () => {
        selectedTask = tasks.find((t) => t.id === b.dataset.task);
        load(
          "; " + selectedTask.name + "\n; Twój program zaczyna się tutaj.\n",
          selectedTask.mode,
          selectedTask.name,
          false,
        );
        renderActiveTask();
      }),
  );
}
function renderActiveTask() {
  const el = $("#active-task");
  el.hidden = !selectedTask;
  if (!selectedTask) return;
  el.innerHTML = `<div class="task-preview">${thumbnail(run(selectedTask.source, selectedTask.mode).segments, selectedTask.mode)}</div><div><span class="eyebrow">TWOJE WYZWANIE · ${selectedTask.mode.toUpperCase()}</span><h2>${selectedTask.name}</h2><p>${selectedTask.description}</p><details><summary>Mała podpowiedź</summary><p>${selectedTask.hint}</p></details><p id="task-result" role="status"></p></div><div class="task-actions"><button id="check-task" class="primary">${icon("check")} Sprawdź rysunek</button><button id="leave-task" class="quiet">Zakończ wyzwanie</button></div>`;
  $("#leave-task").onclick = () => {
    selectedTask = null;
    renderActiveTask();
  };
  $("#check-task").onclick = () => {
    let result;
    if (mode !== selectedTask.mode)
      result = "Zmień tryb na " + selectedTask.mode.toUpperCase() + ".";
    else {
      const r = finish(),
        expected = run(selectedTask.source, selectedTask.mode).segments;
      if (r.error) result = "Najpierw popraw błąd programu: " + r.error.message;
      else {
        const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
        const pool = [...r.segments];
        let missing = 0;
        for (const s of expected) {
          const i = pool.findIndex(
            (x) =>
              (distance(x.from, s.from) < 0.5 && distance(x.to, s.to) < 0.5) ||
              (distance(x.from, s.to) < 0.5 && distance(x.to, s.from) < 0.5),
          );
          if (i < 0) missing++;
          else pool.splice(i, 1);
        }
        if (!missing && !pool.length) {
          progress[selectedTask.id] = true;
          save("progress", progress);
          renderTasks();
          result = "Brawo! Rysunek jest poprawny. Wyzwanie ukończone.";
        } else
          result = `Jeszcze chwila! Brakuje ${missing} oczekiwanych odcinków, a ${pool.length} nie pasuje. Sprawdź długości, kąty i punkt startu. Tolerancja końców: 0,5 jednostki; każdy bok ma być jednym odcinkiem.`;
      }
    }
    $("#task-result").textContent = result;
  };
}
renderTasks();
$("#shortcuts").onclick = () =>
  modal(
    "Skróty, które skracają drogę",
    `<dl class="shortcuts"><dt>Uruchom program</dt><dd><kbd>Ctrl / ⌘ + Enter</kbd></dd><dt>Jeden krok</dt><dd><kbd>F10</kbd></dd><dt>Pauza / wznów</dt><dd><kbd>F8</kbd></dd><dt>Reset programu</dt><dd><kbd>Shift + Esc</kbd></dd><dt>Dopasuj / resetuj kamerę</dt><dd><kbd>F / 0</kbd> na płótnie</dd><dt>Przesuń / obróć widok</dt><dd><kbd>Strzałki</kbd> na płótnie</dd><dt>Przesuń widok 3D</dt><dd><kbd>Shift + strzałki</kbd></dd><dt>Przybliż / oddal</dt><dd><kbd>+ / −</kbd> na płótnie</dd></dl>`,
  );
document.addEventListener("keydown", (e) => {
  if ($("#dialog").open) return;
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    page("studio");
    start();
  } else if (e.key === "F10") {
    e.preventDefault();
    step();
  } else if (e.key === "F8") {
    e.preventDefault();
    togglePause();
  } else if (e.shiftKey && e.key === "Escape") {
    e.preventDefault();
    reset();
  }
});
window.logomocja = {
  version: "1.0.0",
  run,
  async open(source, next) {
    if (!["2d", "3d"].includes(next))
      throw new Error("Tryb musi być 2d lub 3d.");
    selectedTask = null;
    renderActiveTask();
    load(String(source), next, "Mój szkic");
    const result = {
      segments: machine.state.segments,
      error: machine.state.error,
    };
    await new Promise((resolve) =>
      requestAnimationFrame(() => {
        view.fit();
        requestAnimationFrame(resolve);
      }),
    );
    return result;
  },
};
applyTheme();
modeUI();
highlight();
finish();
function loadHash() {
  if (location.hash.startsWith("#p=")) {
    try {
      const data = decode(location.hash.slice(3));
      if (
        typeof data.source !== "string" ||
        !["2d", "3d"].includes(data.mode) ||
        data.source.length > 50000
      )
        throw Error();
      window.logomocja.open(data.source, data.mode);
    } catch {
      toast("Nie udało się odczytać linku. Sprawdź, czy jest kompletny.");
    }
  }
}
loadHash();
window.addEventListener("hashchange", loadHash);
