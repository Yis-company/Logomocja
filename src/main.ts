import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "./style.css";
import { Execution, run, aliases, type Mode, type Issue } from "./interpreter";
import { examples, type Example } from "./examples";
import { View } from "./view";
import { commands, referenceIntro, referenceDetails } from "./reference";
import { challenges, checkDrawing, target } from "./challenges";
const icons: Record<string, string> = {
  turtle:
    '<path d="M8 8 5 5m11 3 3-3M8 16l-3 3m11-3 3 3M9 6V4a3 3 0 0 1 6 0v2M9 18l3 3 3-3"/><rect x="6" y="6" width="12" height="12" rx="5"/><path d="m9 9 6 6m0-6-6 6"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  step: '<path d="m5 5 10 7-10 7Zm13 0v14"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>',
  folder: '<path d="M3 7V4h6l2 3h10v13H3Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
  book: '<path d="M12 5v16M3 3h5a4 4 0 0 1 4 2 4 4 0 0 1 4-2h5v16h-5a4 4 0 0 0-4 2 4 4 0 0 0-4-2H3Z"/>',
  flag: '<path d="M5 21V3m0 1c5-5 9 5 14 0v10c-5 5-9-5-14 0"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  history: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6m3-3v6l4 2"/>',
  file: '<path d="M14 2H5v20h14V7Zm0 0v6h5"/>',
  grid: '<path d="M3 3h18v18H3Zm6 0v18m6-18v18M3 9h18M3 15h18"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
};
const icon = (name: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.code}</svg>`;
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const $ = <T extends HTMLElement = HTMLElement>(s: string) =>
  document.querySelector<T>(s)!;
const storage = {
  get(key: string, fallback: string) {
    try {
      return localStorage.getItem("logomocja:" + key) || fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem("logomocja:" + key, value);
    } catch {}
  },
};
let mode: Mode = storage.get("mode", "2d") === "3d" ? "3d" : "2d";
let activeExample = storage.get(
  "example:" + mode,
  mode === "2d" ? "rozeta" : "szescian",
);
let source = storage.get(
  "draft:" + mode,
  examples.find((e) => e.id === activeExample)?.source || examples[2].source,
);
let execution: Execution;
let playing = false;
let dirty = false;
let timer = 0;
let activeTab = "studio";
let exampleFilter: Mode = mode;
let challengeId = challenges[0].id;
let currentError: Issue | null = null;
let theme = storage.get("theme", "system");
type Snapshot = { source: string; mode: Mode; time: string };
let history: Snapshot[] = [];
try {
  history = JSON.parse(storage.get("history", "[]"));
} catch {}
let progress: string[] = [];
try {
  progress = JSON.parse(storage.get("progress", "[]"));
} catch {}
$("#app").innerHTML = `
<header class="topbar"><a href="#studio" class="brand" aria-label="Logomocja, studio">${icon("turtle")}<span>logomocja<span class="brand-dot">.</span></span></a><span class="brand-caption">Twoje pomysły. Rysowane kodem.</span><div class="top-actions"><span class="local-note"><span class="status-dot"></span>Wszystko zostaje u Ciebie</span><button id="theme" class="icon-button" title="Zmień motyw" aria-label="Zmień motyw"></button><button id="share" class="button share-button">${icon("share")}<span>Udostępnij</span></button></div></header>
<div class="subbar"><nav aria-label="Nawigacja główna"><button data-tab="studio" class="nav-tab active">${icon("code")}Studio</button><button data-tab="challenges" class="nav-tab">${icon("flag")}Wyzwania<span class="nav-count">${progress.length}/6</span></button><button data-tab="guide" class="nav-tab">${icon("book")}Przewodnik</button></nav><div class="subbar-right"><span class="key-hint"><kbd>Ctrl</kbd> + <kbd>Enter</kbd> uruchom</span><span class="version">Wersja 1.0</span></div></div>
<main id="workspace" class="workspace">
<aside class="library" aria-label="Biblioteka programów"><div id="examples-panel"><div class="library-heading"><h1>Przykłady</h1><span class="total-count">13</span></div><p class="library-intro">Otwórz, uruchom, zmień coś.</p><div class="filter-tabs" aria-label="Tryb przykładów"><button data-filter="2d">Płaszczyzna <span>2D</span></button><button data-filter="3d">Przestrzeń <span>3D</span></button></div><div id="example-list" class="example-list"></div><div class="learning-note"><div class="note-title">${icon("turtle")}Mały krok na początek</div><p>Żółw rozumie <code>np 100</code>.<br>A Ty już umiesz programować.</p><button id="learn" class="text-button">Poznaj polecenia ${icon("arrow")}</button></div></div><div id="challenges-panel" hidden><div class="library-heading"><h1>Wyzwania</h1><span class="total-count">6</span></div><p class="library-intro">Pomysł jest Twój. Cel jest tutaj.</p><div id="challenge-list"></div><div id="challenge-details"></div></div><div class="library-bottom"><span class="status-dot"></span>Twórz bez konta. Po swojemu.</div></aside>
<section class="editor-panel" aria-label="Edytor programu"><div class="panel-heading"><div class="file-title">${icon("file")}<span id="filename">rozeta.logo</span></div><span id="save-state" class="save-state">${icon("check")}Zapisano</span></div><div class="run-toolbar"><button id="run" class="button primary" title="Uruchom (Ctrl+Enter)">${icon("play")}<span>Uruchom</span></button><button id="step" class="button secondary" title="Krok (F10)">${icon("step")}Krok</button><button id="pause" class="icon-button" title="Wstrzymaj / wznów (F8)" aria-label="Wstrzymaj lub wznów">${icon("pause")}</button><button id="reset" class="icon-button" title="Reset (Shift+Escape)" aria-label="Reset programu">${icon("reset")}</button></div>
<div class="editor-wrap"><div id="line-numbers" class="line-numbers" aria-hidden="true"></div><div class="code-area"><pre id="highlight" aria-hidden="true"></pre><textarea id="editor" aria-label="Kod programu Logo" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div></div><div id="error" class="error-message" role="alert" hidden></div>
<div class="editor-controls"><label for="speed">Tempo</label><input type="range" id="speed" min="1" max="100" value="70" aria-label="Tempo animacji"><span id="speed-label">Szybko</span><button id="instant" class="text-button" title="Uruchom bez animacji">Od razu ${icon("chevron")}</button></div><div class="editor-foot"><span id="execution-state"><span class="status-dot"></span>Gotowe do rysowania</span><span id="line-position">Ln 1, Kol 1</span></div>
<div class="editor-bottom"><button id="import" class="small-button">${icon("folder")}Otwórz plik</button><button id="download" class="small-button">${icon("download")}.logo</button><button id="history" class="small-button" title="Historia zachowanych szkiców">${icon("history")}Szkice</button><input type="file" id="file-input" accept=".logo,text/plain" hidden></div></section>
<section class="drawing-panel" aria-label="Plansza rysunku"><div class="panel-heading drawing-heading"><div class="drawing-title">Plansza<span id="drawing-badge">XY</span></div><div class="mode-switch" role="group" aria-label="Tryb rysowania"><button data-mode="2d">2D</button><button data-mode="3d">3D</button></div><button id="export" class="small-button" title="Pobierz rysunek PNG">${icon("download")}Eksport PNG</button></div><div class="canvas-wrap"><canvas id="canvas" tabindex="0" aria-label="Rysunek żółwia. Przeciągnij, aby przesunąć lub obrócić widok. Kółko zmienia przybliżenie."></canvas><div class="view-tools"><button id="fit" class="icon-button" aria-label="Dopasuj rysunek" title="Dopasuj rysunek (F)">${icon("fit")}</button><div class="tool-divider"></div><button id="zoom-in" class="icon-button" aria-label="Przybliż" title="Przybliż">${icon("plus")}</button><button id="zoom-out" class="icon-button" aria-label="Oddal" title="Oddal">${icon("minus")}</button><div class="tool-divider"></div><button id="camera-reset" class="icon-button" aria-label="Reset kamery" title="Reset kamery">${icon("reset")}</button><button id="grid" class="icon-button pressed" aria-label="Siatka" aria-pressed="true" title="Pokaż / ukryj siatkę">${icon("grid")}</button></div><div class="canvas-label"><span class="status-dot"></span><span id="canvas-label">Płaszczyzna 2D</span></div></div><div class="drawing-status"><span id="gesture-hint">Przeciągnij, aby przesunąć · scroll, aby przybliżyć</span><span id="segment-count">48 odcinków</span></div><div class="drawing-info"><div class="example-caption"><span class="caption-line"></span><div><h2 id="drawing-name">Rozeta</h2><p id="drawing-description">Jeden kwadrat. Wiele możliwości.</p></div></div><div class="position-readout"><span>POZYCJA ŻÓŁWIA</span><div id="coordinates">X 0 <span>·</span> Y 0</div></div></div></section>
</main>
<main id="guide" hidden><aside class="guide-nav"><h1>Przewodnik</h1><p>Od pierwszej kreski<br>do własnych światów.</p><a href="#guide/commands">Polecenia</a><a href="#guide/expressions">Wyrażenia i zapis</a><a href="#guide/variables">Zmienne i warunki</a><a href="#guide/procedures">Procedury</a><a href="#guide/geometry">Płaszczyzna i przestrzeń</a><a href="#guide/limits">Błędy i limity</a><a href="#guide/shortcuts">Skróty i pliki</a></aside><article class="reference"><div class="reference-title"><h1>Rysowanie zaczyna się od słowa.</h1><p>Cały język Logo w jednym miejscu. Po polsku, krok po kroku.</p></div>${referenceIntro}<section id="commands"><div class="reference-search"><h2>Wszystkie polecenia</h2><input id="command-search" type="search" placeholder="Szukaj polecenia…" aria-label="Szukaj polecenia"></div><div id="command-list"></div></section>${referenceDetails}</article></main>
<footer class="app-footer"><span>LOGOMOCJA <span class="footer-separator">/</span> Miejsce na Twoją wyobraźnię.</span><button id="shortcuts" class="text-button">Skróty klawiszowe ${icon("chevron")}</button><span class="footer-local">Zapis lokalny · bez chmury</span></footer>
<div id="toast" class="toast" role="status" hidden></div><dialog id="history-dialog"><div class="dialog-heading"><h2>Twoje zachowane szkice</h2><button class="icon-button" id="close-history" aria-label="Zamknij">${icon("close")}</button></div><p>Przy otwieraniu przykładu i pliku zachowujemy poprzedni kod. Ostatnie 30 wersji pozostaje w tej przeglądarce.</p><div id="history-list"></div></dialog>
<dialog id="share-dialog"><div class="dialog-heading"><h2>Link do Twojego rysunku</h2><button class="icon-button" id="close-share" aria-label="Zamknij">${icon("close")}</button></div><p>Skopiuj adres. Po otwarciu program uruchomi się automatycznie.</p><input id="share-url" readonly aria-label="Adres do udostępnienia"><button class="button primary" id="copy-link">${icon("share")}Kopiuj link</button></dialog>`;
const editor = $<HTMLTextAreaElement>("#editor");
editor.value = source;
const view = new View($<HTMLCanvasElement>("#canvas"));
view.mode = mode;
const guideView = $("#guide");
function notify(message: string) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  window.setTimeout(() => (toast.hidden = true), 3600);
}
function applyTheme() {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  view.dark = dark;
  view.draw();
  $("#theme").innerHTML = icon(dark ? "moon" : "sun");
  $("#theme").setAttribute(
    "aria-label",
    `Motyw: ${theme === "system" ? "systemowy" : dark ? "ciemny" : "jasny"}. Kliknij, aby zmienić.`,
  );
}
$("#theme").onclick = () => {
  theme = theme === "system" ? "light" : theme === "light" ? "dark" : "system";
  storage.set("theme", theme);
  applyTheme();
  notify(
    "Motyw: " +
      (theme === "system"
        ? "zgodny z systemem"
        : theme === "light"
          ? "jasny"
          : "ciemny"),
  );
};
matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  applyTheme,
);
applyTheme();
function persist() {
  source = editor.value;
  storage.set("draft:" + mode, source);
  storage.set("mode", mode);
  storage.set("example:" + mode, activeExample);
  $("#save-state").innerHTML = icon("check") + "Zapisano lokalnie";
}
function keepDraft(text: string, draftMode: Mode) {
  if (
    !text.trim() ||
    (history[0]?.source === text && history[0]?.mode === draftMode)
  )
    return;
  history.unshift({
    source: text,
    mode: draftMode,
    time: new Date().toISOString(),
  });
  history = history.slice(0, 30);
  storage.set("history", JSON.stringify(history));
}
function archive() {
  keepDraft(editor.value, mode);
}
function highlight() {
  const text = editor.value;
  const error = currentError;
  const lines = text.split("\n");
  let highlighted = "";
  const pattern =
    /(;[^\n]*|"[^"\n]*"?|\b\d+(?:\.\d+)?|\.\d+|[\p{L}_:][\p{L}\p{N}_:]*|[\[\]()]+|[+*/<>=,-])/gu;
  lines.forEach((line, i) => {
    let out = "",
      pos = 0;
    for (const m of line.matchAll(pattern)) {
      out += esc(line.slice(pos, m.index));
      const v = m[0],
        key = v.replace(/^:/, "").toLowerCase();
      const kind = v.startsWith(";")
        ? "comment"
        : v.startsWith('"')
          ? "string"
          : /^[\d.]/.test(v)
            ? "number"
            : /^[\[\]()]+$/.test(v)
              ? "bracket"
              : aliases[key]
                ? "keyword"
                : /^[+*/<>=,-]$/.test(v)
                  ? "operator"
                  : "name";
      out += `<span class="syntax-${kind}">${esc(v)}</span>`;
      pos = m.index! + v.length;
    }
    out += esc(line.slice(pos));
    const active =
      !dirty && execution && !execution.done && execution.line === i + 1;
    const err = error?.line === i + 1;
    highlighted += `<div class="code-line${active ? " executing" : ""}${err ? " has-error" : ""}">${out || " "}${err ? `<span class="error-caret" style="left:${Math.max(0, error.column - 1)}ch" title="${esc(error.message)}"></span>` : ""}</div>`;
  });
  $("#highlight").innerHTML = highlighted + '<div class="code-line"> </div>';
  $("#line-numbers").innerHTML = lines
    .map(
      (_, i) =>
        `<div class="${error?.line === i + 1 ? "error-line" : !dirty && execution && !execution.done && execution.line === i + 1 ? "current-line" : ""}">${i + 1}</div>`,
    )
    .join("");
  syncScroll();
  position();
}
function syncScroll() {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $("#line-numbers").scrollTop = editor.scrollTop;
}
function position() {
  const before = editor.value.slice(0, editor.selectionStart),
    lines = before.split("\n");
  $("#line-position").textContent =
    `Ln ${lines.length}, Kol ${lines.at(-1)!.length + 1}`;
}
function showError(error: Issue | null) {
  currentError = error;
  $("#error").hidden = !error;
  if (error) {
    $("#error").innerHTML =
      `${icon("info")}<div><strong>Linia ${error.line}, kolumna ${error.column}</strong><span>${esc(error.message)}</span></div>`;
  }
  highlight();
}
function update() {
  view.segments = execution.segments;
  view.turtle = execution.turtle;
  view.draw();
  $("#segment-count").textContent = execution.segments.length + " odcinków";
  const t = execution.turtle,
    p = t.position.map((v) =>
      Math.abs(v) < 0.005 ? "0" : Number(v.toFixed(1)).toString(),
    );
  $("#coordinates").innerHTML =
    `X ${p[0]} <span>·</span> Y ${p[1]}${mode === "3d" ? ` <span>·</span> Z ${p[2]}` : ""}`;
  const text = execution.error
    ? "Program zatrzymany"
    : playing
      ? "Żółw rysuje…"
      : execution.done
        ? "Rysunek gotowy"
        : dirty
          ? "Kod zmieniony · uruchom ponownie"
          : "Wstrzymano · możesz wykonać krok";
  $("#execution-state").innerHTML =
    `<span class="status-dot ${execution.error ? "error-dot" : playing ? "running-dot" : ""}"></span>${text}`;
  $("#run span").textContent = !execution.done && !dirty ? "Wznów" : "Uruchom";
  $<HTMLButtonElement>("#pause").disabled = execution.done || dirty;
  $("#pause").innerHTML = icon(playing ? "pause" : "play");
  $("#pause").setAttribute("aria-label", playing ? "Wstrzymaj" : "Wznów");
  highlight();
}
function halt() {
  playing = false;
  cancelAnimationFrame(timer);
}
function prepare() {
  halt();
  execution = new Execution(editor.value, mode);
  dirty = false;
  showError(execution.error);
  update();
}
function finish() {
  prepare();
  execution.finish();
  showError(execution.error);
  update();
  view.fit();
}
function animate() {
  let last = 0,
    acc = 0;
  playing = true;
  function frame(time: number) {
    if (!playing) return;
    const speed = Number($<HTMLInputElement>("#speed").value),
      interval = Math.max(1, 210 - speed * 2.08);
    acc += Math.min(time - last, 100);
    last = time;
    let count = 0;
    while (acc >= interval && !execution.done && count < 150) {
      execution.step();
      acc -= interval;
      count++;
    }
    update();
    if (execution.done) {
      halt();
      showError(execution.error);
      update();
      return;
    }
    timer = requestAnimationFrame(frame);
  }
  timer = requestAnimationFrame(frame);
  update();
}
function start() {
  if (playing) {
    notify("Program już się wykonuje.");
    return;
  }
  if (!execution || execution.done || dirty) prepare();
  if (!execution.done) animate();
}
function step() {
  halt();
  if (!execution || execution.done || dirty) prepare();
  execution.step();
  showError(execution.error);
  update();
}
function reset() {
  prepare();
  notify("Plansza wyczyszczona. Żółw wrócił do początku.");
}
$("#run").onclick = start;
$("#step").onclick = step;
$("#instant").onclick = finish;
$("#pause").onclick = () => {
  if (playing) {
    halt();
    update();
  } else if (!execution.done && !dirty) animate();
};
$("#reset").onclick = reset;
editor.addEventListener("input", () => {
  if (playing) halt();
  dirty = true;
  currentError = null;
  $("#error").hidden = true;
  persist();
  highlight();
  $("#execution-state").innerHTML =
    '<span class="status-dot"></span>Kod zmieniony · uruchom ponownie';
  $<HTMLButtonElement>("#pause").disabled = true;
});
editor.addEventListener("scroll", syncScroll);
editor.addEventListener("click", position);
editor.addEventListener("keyup", position);
$<HTMLInputElement>("#speed").oninput = () => {
  const n = Number($<HTMLInputElement>("#speed").value);
  $("#speed-label").textContent =
    n < 30
      ? "Powoli"
      : n < 65
        ? "Spokojnie"
        : n < 95
          ? "Szybko"
          : "Błyskawicznie";
};
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    start();
  } else if (e.key === "F10") {
    e.preventDefault();
    step();
  } else if (e.key === "F8") {
    e.preventDefault();
    if (playing) {
      halt();
      update();
    } else start();
  } else if (e.shiftKey && e.key === "Escape") {
    e.preventDefault();
    reset();
  }
});
function setMode(next: Mode, loadDraft = true) {
  if (next !== mode) {
    halt();
    persist();
    if (!loadDraft) keepDraft(storage.get("draft:" + next, ""), next);
    mode = next;
    view.mode = mode;
    view.pan = [0, 0];
    view.center = [0, 0, 0];
    view.yaw = -0.65;
    view.elevation = 0.57;
    if (loadDraft) {
      activeExample = storage.get(
        "example:" + mode,
        mode === "2d" ? "rozeta" : "szescian",
      );
      editor.value = storage.get(
        "draft:" + mode,
        examples.find((e) => e.id === activeExample)?.source || "",
      );
      dirty = false;
      finish();
    }
  }
  storage.set("mode", mode);
  document.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach((b) => {
    b.classList.toggle("active", b.dataset.mode === mode);
    b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
  });
  $("#drawing-badge").textContent = mode === "2d" ? "XY" : "XYZ";
  $("#canvas-label").textContent =
    mode === "2d" ? "Płaszczyzna 2D" : "Przestrzeń 3D";
  $("#gesture-hint").textContent =
    mode === "2d"
      ? "Przeciągnij, aby przesunąć · scroll, aby przybliżyć"
      : "Przeciągnij: obrót · Shift: przesuwanie · scroll: zoom";
  caption();
}
function caption() {
  const ex = examples.find((e) => e.id === activeExample);
  $("#filename").textContent = (activeExample || "moj-program") + ".logo";
  $("#drawing-name").textContent =
    activeTab === "challenges"
      ? challenges.find((c) => c.id === challengeId)!.name
      : ex?.name || "Twój rysunek";
  $("#drawing-description").textContent =
    activeTab === "challenges"
      ? "Sprawdź swój kod, gdy rysunek będzie gotowy."
      : ex?.description || "Każdy pomysł zaczyna się od jednej kreski.";
}
function loadExample(e: Example) {
  archive();
  setMode(e.mode, false);
  editor.value = e.source;
  activeExample = e.id;
  persist();
  finish();
  renderExamples();
  caption();
  notify("Otworzono „" + e.name + "”. Poprzedni kod znajdziesz w Szkicach.");
}
function renderExamples() {
  document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach((b) => {
    b.classList.toggle("active", b.dataset.filter === exampleFilter);
    b.setAttribute("aria-pressed", String(b.dataset.filter === exampleFilter));
  });
  $("#example-list").innerHTML = examples
    .filter((e) => e.mode === exampleFilter)
    .map(
      (e) =>
        `<button class="example-item ${e.id === activeExample ? "selected" : ""}" data-example="${e.id}"><canvas class="example-thumb" width="80" height="80" aria-hidden="true"></canvas><span>${e.name}</span>${icon("chevron")}</button>`,
    )
    .join("");
  document
    .querySelectorAll<HTMLButtonElement>("[data-example]")
    .forEach((b) => {
      const e = examples.find((e) => e.id === b.dataset.example)!;
      const thumb = new View(b.querySelector("canvas")!, false);
      thumb.mode = e.mode;
      thumb.grid = false;
      thumb.showTurtle = false;
      thumb.segments = run(e.source, e.mode).segments;
      thumb.width = 42;
      thumb.height = 42;
      const pts = thumb.segments.flatMap((s) => [s.from, s.to]);
      const ps = pts.map((p) => thumb.project(p));
      const xs = ps.map((p) => p[0]),
        ys = ps.map((p) => p[1]),
        minX = Math.min(...xs),
        maxX = Math.max(...xs),
        minY = Math.min(...ys),
        maxY = Math.max(...ys);
      thumb.scale = 30 / Math.max(maxX - minX, maxY - minY, 1);
      thumb.pan = [
        (-(minX + maxX) / 2) * thumb.scale,
        (-(minY + maxY) / 2) * thumb.scale,
      ];
      thumb.segments = thumb.segments.map((s) => ({ ...s, width: 1 }));
      thumb.draw();
      b.onclick = () => loadExample(e);
    });
}
document.querySelectorAll<HTMLButtonElement>("[data-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      exampleFilter = b.dataset.filter as Mode;
      renderExamples();
    }),
);
document.querySelectorAll<HTMLButtonElement>("[data-mode]").forEach(
  (b) =>
    (b.onclick = () => {
      setMode(b.dataset.mode as Mode);
      exampleFilter = mode;
      renderExamples();
    }),
);
function tab(name: string) {
  activeTab = name;
  halt();
  window.scrollTo(0, 0);
  $("#workspace").hidden = name === "guide";
  guideView.hidden = name !== "guide";
  $("#examples-panel").hidden = name === "challenges";
  $("#challenges-panel").hidden = name !== "challenges";
  document.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach((b) => {
    b.classList.toggle("active", b.dataset.tab === name);
    b.setAttribute("aria-current", b.dataset.tab === name ? "page" : "false");
  });
  if (name === "challenges") renderChallenges();
  caption();
  update();
  requestAnimationFrame(() => {
    view.resize();
    view.draw();
  });
}
document.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach(
  (b) =>
    (b.onclick = () => {
      location.hash = b.dataset.tab!;
    }),
);
$("#learn").onclick = () => {
  location.hash = "guide/commands";
};
$("#shortcuts").onclick = () => {
  location.hash = "guide/shortcuts";
};
function route() {
  const hash = location.hash.slice(1);
  if (hash.startsWith("p=")) return;
  const [name, anchor] = hash.split("/");
  tab(["studio", "challenges", "guide"].includes(name) ? name : "studio");
  if (name === "guide" && anchor)
    requestAnimationFrame(() =>
      document
        .getElementById(anchor)
        ?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
}
window.addEventListener("hashchange", () => {
  if (location.hash.startsWith("#p=")) loadLink();
  else route();
});
function renderChallenges() {
  const c = challenges.find((c) => c.id === challengeId)!;
  $("#challenge-list").innerHTML = challenges
    .map(
      (c, i) =>
        `<button class="challenge-item ${c.id === challengeId ? "selected" : ""}" data-challenge="${c.id}"><span class="challenge-num ${progress.includes(c.id) ? "complete" : ""}">${progress.includes(c.id) ? icon("check") : i + 1}</span><span>${c.name}<small>${c.mode.toUpperCase()}</small></span>${icon("chevron")}</button>`,
    )
    .join("");
  $("#challenge-details").innerHTML =
    `<div class="challenge-target"><canvas id="target-canvas" aria-label="Wzór do narysowania"></canvas><span>Wzór · ${c.mode.toUpperCase()}</span></div><h2>${c.name}</h2><p>${c.description}</p><p class="check-rules">Liczy się geometria i położenie (tolerancja 1,2). Kolor i grubość dowolne.</p><details><summary>Mała podpowiedź</summary><p>${c.hint}</p></details><button class="button primary" id="check-challenge">${icon("check")}Sprawdź rysunek</button><div id="challenge-result" role="status"></div>`;
  const v = new View($<HTMLCanvasElement>("#target-canvas"), false);
  v.mode = c.mode;
  v.segments = target(c.id);
  v.showTurtle = false;
  v.grid = false;
  v.resize();
  requestAnimationFrame(() => v.fit());
  document.querySelectorAll<HTMLButtonElement>("[data-challenge]").forEach(
    (b) =>
      (b.onclick = () => {
        challengeId = b.dataset.challenge!;
        const next = challenges.find((c) => c.id === challengeId)!;
        setMode(next.mode);
        renderChallenges();
        caption();
      }),
  );
  $("#check-challenge").onclick = () => {
    if (mode !== c.mode) {
      $("#challenge-result").textContent =
        "Przełącz na tryb " + c.mode.toUpperCase() + ".";
      return;
    }
    finish();
    if (execution.error) {
      $("#challenge-result").className = "challenge-fail";
      $("#challenge-result").textContent =
        "Najpierw popraw błąd w programie: " + execution.error.message;
      return;
    }
    const result = checkDrawing(execution.segments, target(c.id));
    $("#challenge-result").className = result.pass
      ? "challenge-pass"
      : "challenge-fail";
    $("#challenge-result").textContent = result.reason;
    if (result.pass && !progress.includes(c.id)) {
      progress.push(c.id);
      storage.set("progress", JSON.stringify(progress));
      $(".nav-count").textContent = progress.length + "/6";
      document.querySelector(
        `[data-challenge="${c.id}"] .challenge-num`,
      )!.innerHTML = icon("check");
      document
        .querySelector(`[data-challenge="${c.id}"] .challenge-num`)!
        .classList.add("complete");
    }
  };
}
function renderReference(search = "") {
  const term = search.toLowerCase();
  const items = commands.filter((c) =>
    c.join(" ").toLowerCase().includes(term),
  );
  $("#command-list").innerHTML =
    items
      .map(
        (c) =>
          `<div class="command-entry"><div><span class="command-category">${c[0]}</span><h3>${esc(c[1])}</h3><div class="command-argument">${esc(c[2])}</div><p>${esc(c[3])}</p></div><pre><code>${esc(c[4])}</code></pre></div>`,
      )
      .join("") ||
    "<p>Nie znaleziono polecenia. Spróbuj polskiej lub angielskiej nazwy.</p>";
}
renderReference();
$<HTMLInputElement>("#command-search").oninput = (e) =>
  renderReference((e.target as HTMLInputElement).value);
$("#fit").onclick = () => view.fit();
$("#camera-reset").onclick = () => view.resetCamera();
$("#zoom-in").onclick = () => view.zoom(1.25);
$("#zoom-out").onclick = () => view.zoom(0.8);
$("#grid").onclick = () => {
  view.grid = !view.grid;
  $("#grid").classList.toggle("pressed", view.grid);
  $("#grid").setAttribute("aria-pressed", String(view.grid));
  view.draw();
};
function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("#download").onclick = () =>
  download(
    new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
    (activeExample || "moj-program") + ".logo",
  );
$("#import").onclick = () => $<HTMLInputElement>("#file-input").click();
$<HTMLInputElement>("#file-input").onchange = async (e) => {
  const input = e.target as HTMLInputElement,
    file = input.files?.[0];
  if (!file) return;
  if (file.size > 200000) {
    notify("Plik jest za duży. Limit programu to 50 000 znaków.");
    input.value = "";
    return;
  }
  try {
    const text = await file.text();
    archive();
    editor.value = text;
    activeExample = "";
    persist();
    finish();
    caption();
    renderExamples();
    notify("Otworzono plik. Poprzedni kod jest w Szkicach.");
  } catch {
    notify("Nie udało się odczytać pliku. Spróbuj ponownie.");
  }
  input.value = "";
};
$("#export").onclick = () => {
  view.draw();
  view.canvas.toBlob((blob) => {
    if (blob)
      download(blob, "logomocja-" + (activeExample || "rysunek") + ".png");
    else notify("Nie udało się zapisać PNG.");
  }, "image/png");
};
function shareUrl() {
  const bytes = new TextEncoder().encode(editor.value);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const data = btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return location.href.split("#")[0] + "#p=" + mode + "." + data;
}
$("#share").onclick = async () => {
  const url = shareUrl();
  try {
    await navigator.clipboard.writeText(url);
    notify("Link do programu skopiowany. Możesz go udostępnić.");
  } catch {
    $<HTMLInputElement>("#share-url").value = url;
    $<HTMLDialogElement>("#share-dialog").showModal();
    $<HTMLInputElement>("#share-url").select();
  }
};
$("#close-share").onclick = () => $<HTMLDialogElement>("#share-dialog").close();
$("#copy-link").onclick = async () => {
  try {
    await navigator.clipboard.writeText(
      $<HTMLInputElement>("#share-url").value,
    );
    notify("Link skopiowany.");
    $<HTMLDialogElement>("#share-dialog").close();
  } catch {
    $<HTMLInputElement>("#share-url").select();
    notify("Zaznaczony adres skopiujesz skrótem Ctrl+C.");
  }
};
$("#history").onclick = () => {
  $("#history-list").innerHTML = history.length
    ? history
        .map(
          (h, i) =>
            `<button data-restore="${i}" class="history-row"><span>${icon("file")} Szkic ${h.mode.toUpperCase()}<small>${new Date(h.time).toLocaleString("pl-PL")}</small></span><code>${esc(
              h.source
                .split("\n")
                .find((l) => l.trim() && !l.startsWith(";"))
                ?.slice(0, 60) || "Pusty szkic",
            )}</code>${icon("chevron")}</button>`,
        )
        .join("")
    : '<div class="history-empty">Jeszcze nie ma zachowanych wersji. Twój bieżący szkic zapisuje się automatycznie. Przy otwieraniu innego programu pojawi się tutaj.</div>';
  document.querySelectorAll<HTMLButtonElement>("[data-restore]").forEach(
    (b) =>
      (b.onclick = () => {
        const h = history[Number(b.dataset.restore)];
        archive();
        setMode(h.mode, false);
        editor.value = h.source;
        activeExample = "";
        persist();
        finish();
        caption();
        renderExamples();
        $<HTMLDialogElement>("#history-dialog").close();
        notify("Przywrócono szkic. Poprzednia wersja też jest zachowana.");
      }),
  );
  $<HTMLDialogElement>("#history-dialog").showModal();
};
$("#close-history").onclick = () =>
  $<HTMLDialogElement>("#history-dialog").close();
async function open(source: string, next: Mode) {
  if (activeTab === "guide") tab("studio");
  archive();
  setMode(next, false);
  editor.value = source;
  activeExample = "";
  persist();
  finish();
  caption();
  renderExamples();
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => {
      view.resize();
      view.fit();
      resolve();
    }),
  );
  return { segments: execution.segments, error: execution.error };
}
async function loadLink() {
  try {
    const match = location.hash.match(/^#p=(2d|3d)\.([A-Za-z0-9_-]+)$/);
    if (!match) throw Error();
    const binary = atob(match[2].replace(/-/g, "+").replace(/_/g, "/"));
    const text = new TextDecoder("utf-8", { fatal: true }).decode(
      Uint8Array.from(binary, (c) => c.charCodeAt(0)),
    );
    tab("studio");
    await open(text, match[1] as Mode);
    notify("Otworzono udostępniony program. Poprzedni szkic jest zachowany.");
  } catch {
    notify("Link do programu jest niepoprawny lub uszkodzony.");
  }
}
declare global {
  interface Window {
    logomocja: { version: string; run: typeof run; open: typeof open };
  }
}
window.logomocja = { version: "1.0.0", run, open };
execution = new Execution(source, mode);
execution.finish();
setMode(mode, false);
renderExamples();
showError(execution.error);
update();
requestAnimationFrame(() => {
  view.resize();
  view.fit();
});
if (location.hash.startsWith("#p=")) loadLink();
else route();
