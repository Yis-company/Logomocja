import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./style.css";
import { run, createExecution, aliases } from "./interpreter.js";
import { examples, challenges } from "./examples.js";
import { DrawingView } from "./view.js";
import { referenceHtml } from "./reference.js";
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const icons = {
  play: '<path d="m8 5 11 7-11 7Z"/>',
  step: '<path d="m5 5 10 7-10 7Z"/><path d="M19 5v14"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  file: '<path d="M14 2H5v20h14V7ZM14 2v6h5M9 13h6m-6 4h6"/>',
  share: '<path d="M12 16V3m-5 5 5-5 5 5M5 12v9h14v-9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/>',
  fit: '<path d="M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  book: '<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
  code: '<path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 3l-4 18"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  history: '<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6m3-4v6l4 2"/>',
  chevron: '<path d="m8 5 7 7-7 7"/>',
  turtle:
    '<path d="m8 5 4-3 4 3 3 6-3 7H8l-3-7Z"/><path d="m8 6 4 4 4-4M7 14l5-4 5 4M12 10v8M5 8 2 6m17 2 3-2M7 17l-3 3m13-3 3 3M12 18v4"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.code}</svg>`;
const read = (k, fallback) => {
  try {
    return JSON.parse(localStorage.getItem("logomocja:" + k)) ?? fallback;
  } catch {
    return fallback;
  }
};
let storageOk = true;
const write = (k, v) => {
  try {
    localStorage.setItem("logomocja:" + k, JSON.stringify(v));
  } catch {
    storageOk = false;
  }
};
let mode = read("mode", "2d"),
  theme = read("theme", "system"),
  drafts = read("drafts", {
    "2d": examples[2].source,
    "3d": examples[8].source,
  }),
  archives = read("archives", []),
  progress = read("progress", {}),
  currentExample = examples.find((e) => e.source === drafts[mode]),
  activeChallenge = null,
  execution = null,
  running = false,
  paused = false,
  error = null,
  finished = false,
  timer = 0;
if (!["2d", "3d"].includes(mode)) mode = "2d";
const applyTheme = () => {
  document.documentElement.dataset.theme =
    theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
};
applyTheme();
$("#app").innerHTML =
  `<header class="topbar"><a class="brand" href="#studio" aria-label="Logomocja, studio"><span class="brand-mark">${icon("turtle")}</span><span>logomocja<span class="brand-dot">.</span></span></a><nav aria-label="Nawigacja główna"><button data-page="studio" class="nav-item active">${icon("code")}Studio</button><button data-page="challenges" class="nav-item">${icon("check")}Wyzwania<span class="nav-count">5</span></button><button data-page="reference" class="nav-item">${icon("book")}Słownik poleceń</button></nav><button id="theme" class="icon-button" aria-label="Zmień motyw" title="Motyw: systemowy">${icon("sun")}</button></header>
<main><section id="studio-page" class="page"><div class="workspace-heading"><div><h1>Pomysł. Kod. Rysunek.</h1><p>Poprowadź żółwia. Zobacz, dokąd zaprowadzi Cię ciekawość.</p></div><div class="save-indicator"><span class="status-dot"></span><span id="save-label">Szkic zapisany lokalnie</span></div></div>
<div id="challenge-banner" hidden></div>
<div class="workspace"><div class="work-toolbar"><div class="execution-controls"><button id="run" class="button primary">${icon("play")}<span>Uruchom</span><kbd>Ctrl ↵</kbd></button><button id="step" class="button subtle" title="Następny krok (F10)">${icon("step")}<span>Krok</span></button><button id="pause" class="icon-button" aria-label="Pauza (F8)" title="Pauza / wznów (F8)" disabled>${icon("pause")}</button><button id="reset" class="icon-button" aria-label="Resetuj wykonanie (Shift+Esc)" title="Resetuj (Shift+Esc)">${icon("reset")}</button><span class="toolbar-divider"></span><label class="speed-control">Tempo<input id="speed" type="range" min="1" max="100" value="70" aria-label="Tempo animacji"><span id="speed-label">Szybko</span></label></div><div class="mode-switch" role="group" aria-label="Tryb rysowania"><button data-mode="2d" aria-pressed="true">2D <span>Płaszczyzna</span></button><button data-mode="3d" aria-pressed="false">3D <span>Przestrzeń</span></button></div></div>
<div class="work-panes"><section class="editor-pane" aria-label="Edytor programu"><div class="pane-heading"><div><span class="file-dot"></span><span id="file-name">rozeta.logo</span></div><div><button id="history" class="icon-button small" aria-label="Zachowane wersje szkiców" title="Wersje szkiców">${icon("history")}</button><button id="open-file" class="icon-button small" aria-label="Otwórz plik .logo" title="Otwórz .logo">${icon("file")}</button><button id="save-file" class="icon-button small" aria-label="Pobierz program .logo" title="Pobierz .logo">${icon("download")}</button></div></div><div class="editor-area"><div class="gutter" aria-hidden="true"><div id="line-numbers"></div></div><div class="code-stack"><pre id="highlight" aria-hidden="true"></pre><textarea id="editor" aria-label="Kod programu Logo" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div></div><div id="error-message" role="alert" hidden></div><div class="editor-footer"><span id="cursor-position">Wiersz 1, kol. 1</span><span>Logo <span class="tiny-dot">·</span> UTF-8</span></div></section>
<section class="drawing-pane" aria-label="Plansza rysunku"><div class="pane-heading"><div><span class="live-dot"></span><span id="view-title">Widok 2D</span></div><div><button id="export-png" class="text-button">${icon("download")}PNG</button><button id="share" class="text-button">${icon("share")}Udostępnij</button></div></div><div class="canvas-wrap"><canvas id="drawing" tabindex="0" aria-label="Rysunek żółwia. Przeciągnij, aby przesuwać. Kółko przybliża."></canvas><div class="canvas-label" id="canvas-label">Płaszczyzna XY</div><div class="canvas-tools"><button id="zoom-in" class="icon-button" aria-label="Przybliż">${icon("plus")}</button><button id="zoom-out" class="icon-button" aria-label="Oddal">${icon("minus")}</button><span></span><button id="fit" class="icon-button" aria-label="Dopasuj rysunek" title="Dopasuj rysunek">${icon("fit")}</button><button id="camera-reset" class="icon-button" aria-label="Resetuj kamerę" title="Resetuj kamerę">${icon("reset")}</button><button id="grid" class="icon-button" aria-label="Pokaż siatkę" aria-pressed="true" title="Siatka i osie">${icon("grid")}</button></div></div><div class="drawing-footer"><span id="coords">x: 0 <span>y: 0</span></span><span id="zoom-label">100%</span><span id="gesture-hint">Przeciągnij, by przesunąć · kółko, by przybliżyć</span></div></section></div>
<div class="execution-status"><div><span id="execution-dot" class="status-dot"></span><span id="execution-label" role="status" aria-live="polite">Gotowe do rysowania</span></div><span id="segment-count">0 odcinków</span></div></div>
<section class="examples-section" aria-labelledby="examples-title"><div class="section-heading"><div><h2 id="examples-title">Zacznij od odrobiny inspiracji</h2><p>Wczytaj przykład, zmień jedną liczbę i zobacz, co się wydarzy.</p></div><div class="example-filters" role="group" aria-label="Filtr przykładów"><button data-filter="all" class="active">Wszystkie <span>13</span></button><button data-filter="2d">2D</button><button data-filter="3d">3D</button></div></div><div id="examples" class="examples-grid"></div></section><div class="studio-bottom"><span>${icon("turtle")}Każda wielka przygoda zaczyna się od <code>np 10</code>.</span><button id="shortcuts" class="text-button">Skróty klawiaturowe <kbd>?</kbd></button></div></section>
<section id="challenges-page" class="page" hidden><div class="reading-head"><div><h1>Małe wyzwania. Wielka satysfakcja.</h1><p>Pięć pomysłów do narysowania. Każdy rozwiąż po swojemu.</p></div><span id="progress-label" class="tag">0 / 5 ukończonych</span></div><div id="challenges" class="challenges-grid"></div><p class="local-note">Sprawdzamy geometrię w obu kierunkach z tolerancją 0,8 jednostki. Kolor, grubość i kolejność rysowania są dowolne. Postęp zostaje na tym urządzeniu.</p></section>
<section id="reference-page" class="page" hidden>${referenceHtml(esc)}</section></main>
<footer class="site-footer"><span>Logomocja <span>—</span> pracownia żółwia</span><span>Twórz swobodnie. Wszystko zostaje w Twojej przeglądarce.</span><button class="text-button" id="about">O pracowni</button></footer>
<dialog id="dialog"><div class="dialog-top"><h2 id="dialog-title"></h2><button id="dialog-close" class="icon-button" aria-label="Zamknij">${icon("close")}</button></div><div id="dialog-body"></div></dialog><div class="toast" id="toast" role="status" hidden></div><input id="file-input" type="file" accept=".logo,text/plain" hidden>`;
if (/Mac|iPhone|iPad/.test(navigator.platform))
  $("#run kbd").textContent = "⌘ ↵";
$("#theme").title =
  `Motyw: ${theme === "system" ? "systemowy" : theme === "dark" ? "ciemny" : "jasny"}`;
$("#theme").setAttribute("aria-label", $("#theme").title + ". Zmień motyw.");
$("#theme").innerHTML = icon(theme === "dark" ? "moon" : "sun");
const editor = $("#editor");
editor.value = drafts[mode] || "";
const view = new DrawingView($("#drawing"), {
  mode,
  onChange: () => {
    $("#zoom-label").textContent =
      `${Math.round((view?.scale / 1.5) * 100) || 100}%`;
  },
});
let toastTimer;
function toast(message, action) {
  clearTimeout(toastTimer);
  $("#toast").innerHTML =
    `<span>${esc(message)}</span>${action ? '<button class="toast-action">Przywróć</button>' : ""}`;
  $("#toast").hidden = false;
  if (action) $("#toast button").onclick = action;
  toastTimer = setTimeout(() => ($("#toast").hidden = true), 7000);
}
function clearLink() {
  if (location.hash.startsWith("#p="))
    history.replaceState(null, "", location.pathname + location.search);
}
function persist() {
  drafts[mode] = editor.value;
  write("drafts", drafts);
  write("mode", mode);
  $("#save-label").textContent = storageOk
    ? "Szkic zapisany lokalnie"
    : "Zapis niedostępny — pobierz plik";
}
function archive() {
  if (!editor.value.trim()) return;
  const entry = { source: editor.value, mode, date: new Date().toISOString() };
  if (archives.at(-1)?.source !== entry.source) {
    archives.push(entry);
    archives = archives.slice(-30);
    write("archives", archives);
  }
  return entry;
}
function showDialog(title, content) {
  $("#dialog-title").textContent = title;
  $("#dialog-body").innerHTML = content;
  $("#dialog").showModal();
}
$("#dialog-close").onclick = () => $("#dialog").close();
$("#dialog").onclick = (e) => {
  if (e.target === $("#dialog")) $("#dialog").close();
};
function syntax(line) {
  const re =
    /;.*$|"[^"\n]*"|\b\d+(?:\.\d+)?\b|\.\d+|:?[\p{L}_][\p{L}\p{N}_]*:?|[\[\]()<>+*=\/-]/gu;
  let out = "",
    last = 0;
  for (const m of line.matchAll(re)) {
    out += esc(line.slice(last, m.index));
    let s = m[0],
      cl = s.startsWith(";")
        ? "comment"
        : s.startsWith('"')
          ? "string"
          : /^(?:\d|\.\d)/.test(s)
            ? "number"
            : aliases[s.toLowerCase()] ||
                ["nrpowt", "repcount", "ma:"].includes(s.toLowerCase())
              ? "keyword"
              : /^[\[\]()<>+*=\/-]$/.test(s)
                ? "operator"
                : "name";
    out += `<span class="token-${cl}">${esc(s)}</span>`;
    last = m.index + s.length;
  }
  return out + esc(line.slice(last));
}
function highlight() {
  let lines = editor.value.split("\n");
  $("#highlight").innerHTML = lines
    .map((line, i) => {
      const err = error?.line === i + 1,
        active = execution?.state.line === i + 1 && !finished;
      let code = syntax(line) || " ";
      if (err) {
        let pos = Math.min(line.length, Math.max(0, error.column - 1));
        code =
          syntax(line.slice(0, pos)) +
          `<mark class="error-char" title="${esc(error.message)}">${esc(line[pos] || " ")}</mark>` +
          syntax(line.slice(pos + 1));
      }
      return `<span class="code-line ${err ? "error-line" : ""} ${active ? "executing-line" : ""}">${code}</span>`;
    })
    .join("");
  $("#line-numbers").innerHTML = lines
    .map(
      (_, i) =>
        `<div class="${error?.line === i + 1 ? "error-number" : ""} ${execution?.state.line === i + 1 && !finished ? "current-number" : ""}">${i + 1}</div>`,
    )
    .join("");
  syncScroll();
}
function syncScroll() {
  $("#highlight").style.transform =
    `translate(${-editor.scrollLeft}px,${-editor.scrollTop}px)`;
  $("#line-numbers").style.transform = `translateY(${-editor.scrollTop}px)`;
}
function cursor() {
  let before = editor.value.slice(0, editor.selectionStart).split("\n");
  $("#cursor-position").textContent =
    `Wiersz ${before.length}, kol. ${before.at(-1).length + 1}`;
}
editor.addEventListener("scroll", syncScroll);
editor.addEventListener("click", cursor);
editor.addEventListener("keyup", cursor);
editor.addEventListener("input", () => {
  clearLink();
  stopAnimation();
  execution = null;
  finished = false;
  error = null;
  currentExample = examples.find((e) => e.source === editor.value);
  $("#file-name").textContent = currentExample
    ? currentExample.id + ".logo"
    : "moj-program.logo";
  setError(null);
  persist();
  highlight();
  status("Szkic zmieniony. Uruchom, by zobaczyć wynik.");
});
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && !e.shiftKey) {
    e.preventDefault();
    editor.setRangeText(
      "  ",
      editor.selectionStart,
      editor.selectionEnd,
      "end",
    );
    editor.dispatchEvent(new Event("input"));
  }
  if (e.key === "Escape") $("#run").focus();
});
function setError(e) {
  error = e;
  editor.setAttribute("aria-invalid", e ? "true" : "false");
  if (e) editor.setAttribute("aria-describedby", "error-message");
  else editor.removeAttribute("aria-describedby");
  $("#error-message").hidden = !e;
  $("#error-message").textContent = e
    ? `Wiersz ${e.line}, kolumna ${e.column}: ${e.message}`
    : "";
  highlight();
}
function status(message) {
  $("#execution-label").textContent = message;
  $("#execution-dot").classList.toggle("is-running", running);
  $("#execution-dot").classList.toggle("is-error", !!error);
  $("#run span").textContent = paused ? "Wznów" : "Uruchom";
  $("#pause").disabled = !execution || finished;
  $("#pause").setAttribute("aria-label", paused ? "Wznów (F8)" : "Pauza (F8)");
  $("#pause").innerHTML = icon(paused ? "play" : "pause");
}
function updateView() {
  if (execution) view.state = execution.state;
  view.mode = mode;
  view.draw();
  const s = view.state;
  $("#coords").innerHTML =
    `x: ${Math.round(s.position[0] * 10) / 10}<span>y: ${Math.round(s.position[1] * 10) / 10}</span>${mode === "3d" ? `<span>z: ${Math.round(s.position[2] * 10) / 10}</span>` : ""}`;
  $("#segment-count").textContent = `${s.segments.length} odcinków`;
  highlight();
}
function stopAnimation() {
  clearTimeout(timer);
  running = false;
  paused = false;
}
function prepare() {
  stopAnimation();
  finished = false;
  error = null;
  setError(null);
  try {
    execution = createExecution(editor.value, mode);
    view.state = execution.state;
    updateView();
    return true;
  } catch (e) {
    execution = null;
    view.state = {
      segments: [],
      position: [0, 0, 0],
      heading: [0, 1, 0],
      right: [1, 0, 0],
      up: [0, 0, 1],
    };
    updateView();
    setError({ message: e.message, line: e.line || 1, column: e.column || 1 });
    status("Sprawdź wskazane miejsce w kodzie.");
    return false;
  }
}
function advance() {
  try {
    let n = execution.iterator.next();
    if (n.done) {
      stopAnimation();
      finished = true;
      status("Rysunek gotowy. Co zmienisz następnym razem?");
      return false;
    }
    return true;
  } catch (e) {
    stopAnimation();
    finished = true;
    setError({ message: e.message, line: e.line || 1, column: e.column || 1 });
    status("Wykonanie zatrzymane — rysunek został zachowany.");
    return false;
  }
}
function animate() {
  if (!running) return;
  let speed = +$("#speed").value,
    batch = speed > 85 ? Math.floor((speed - 80) / 2) : 1;
  for (let i = 0; i < batch; i++) if (!advance()) break;
  updateView();
  if (running) timer = setTimeout(animate, Math.max(8, (101 - speed) ** 1.55));
}
function runAnimated() {
  if (paused && execution && !finished) {
    paused = false;
    running = true;
    status("Żółw rysuje…");
    animate();
    return;
  }
  if (!prepare()) return;
  running = true;
  status("Żółw rysuje…");
  animate();
}
function step() {
  if (running) {
    clearTimeout(timer);
    running = false;
  }
  if (!execution || finished) {
    if (!prepare()) return;
  }
  paused = true;
  advance();
  updateView();
  if (!finished) status(`Krok po kroku · wiersz ${execution.state.line}`);
}
function pause() {
  if (!execution || finished) return;
  if (paused) {
    running = true;
    paused = false;
    status("Żółw rysuje…");
    animate();
  } else {
    clearTimeout(timer);
    running = false;
    paused = true;
    status("Pauza — kontynuuj, kiedy chcesz.");
  }
}
function reset() {
  stopAnimation();
  execution = null;
  finished = false;
  setError(null);
  view.state = {
    segments: [],
    position: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
  };
  view.reset();
  updateView();
  status("Plansza wyczyszczona. Kod czeka na Twój ruch.");
}
async function runInstant() {
  if (!prepare()) return { segments: [], error };
  while (advance()) {}
  updateView();
  view.fit();
  await new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(resolve)),
  );
  return { segments: view.state.segments, error };
}
$("#run").onclick = runAnimated;
$("#step").onclick = step;
$("#pause").onclick = pause;
$("#reset").onclick = reset;
$("#speed").oninput = () => {
  $("#speed-label").textContent =
    +$("#speed").value > 70
      ? "Szybko"
      : +$("#speed").value > 35
        ? "Spokojnie"
        : "Powoli";
};
function updateMode() {
  view.mode = mode;
  $$("[data-mode]").forEach((b) =>
    b.setAttribute("aria-pressed", b.dataset.mode === mode),
  );
  $("#view-title").textContent = `Widok ${mode.toUpperCase()}`;
  $("#canvas-label").textContent =
    mode === "2d" ? "Płaszczyzna XY" : "Przestrzeń XYZ";
  $("#gesture-hint").textContent =
    mode === "2d"
      ? "Przeciągnij, by przesunąć · kółko, by przybliżyć"
      : "Przeciągnij, by obrócić · Shift, by przesunąć";
  $("#drawing").setAttribute(
    "aria-label",
    mode === "2d"
      ? "Rysunek 2D. Strzałki przesuwają; plus i minus zmieniają skalę."
      : "Rysunek 3D. Strzałki obracają; Shift i strzałki przesuwają; plus i minus zmieniają skalę.",
  );
}
async function load(
  source,
  newMode,
  { preserve = true, instant = true, name = null, keepHash = false } = {},
) {
  if (!keepHash) clearLink();
  let previous = preserve ? archive() : null;
  persist();
  stopAnimation();
  mode = newMode;
  editor.value = source;
  currentExample = examples.find((e) => e.source === source);
  $("#file-name").textContent =
    name || (currentExample ? currentExample.id + ".logo" : "moj-program.logo");
  persist();
  updateMode();
  highlight();
  showPage("studio");
  if (previous && previous.source !== source)
    toast("Poprzedni szkic zachowany w Wersjach.", () => {
      load(previous.source, previous.mode, { name: "przywrocony-szkic.logo" });
      $("#toast").hidden = true;
    });
  return instant ? runInstant() : (reset(), { segments: [], error: null });
}
$$("[data-mode]").forEach(
  (b) =>
    (b.onclick = () => {
      if (mode === b.dataset.mode) return;
      clearLink();
      persist();
      stopAnimation();
      mode = b.dataset.mode;
      editor.value = drafts[mode] || "";
      activeChallenge = null;
      $("#challenge-banner").hidden = true;
      updateMode();
      persist();
      $("#file-name").textContent =
        examples.find((e) => e.source === editor.value)?.id + ".logo";
      if ($("#file-name").textContent === "undefined.logo")
        $("#file-name").textContent = "moj-program.logo";
      runInstant();
    }),
);
$("#zoom-in").onclick = () => view.zoom(1.2);
$("#zoom-out").onclick = () => view.zoom(1 / 1.2);
$("#fit").onclick = () => view.fit();
$("#camera-reset").onclick = () => view.reset();
$("#grid").onclick = () => {
  view.grid = !view.grid;
  $("#grid").setAttribute("aria-pressed", view.grid);
  view.draw();
};
let page = "studio";
function showPage(next) {
  const prior = page;
  page = next;
  $$(".page").forEach((p) => (p.hidden = p.id !== next + "-page"));
  $$("[data-page]").forEach((b) => {
    b.classList.toggle("active", b.dataset.page === next);
    if (b.dataset.page === next) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  if (next === "studio")
    requestAnimationFrame(() => {
      view.draw();
      if (prior !== "studio")
        renderExamples($(".example-filters .active").dataset.filter);
    });
  if (next === "challenges") renderChallenges();
}
$$("[data-page]").forEach((b) => (b.onclick = () => showPage(b.dataset.page)));
$(".brand").onclick = (e) => {
  e.preventDefault();
  showPage("studio");
};
function renderExamples(filter = "all") {
  $("#examples").innerHTML = examples
    .filter((e) => filter === "all" || e.mode === filter)
    .map(
      (e) =>
        `<button class="example" data-example="${e.id}" aria-label="Wczytaj przykład ${e.name}, ${e.mode.toUpperCase()}"><div class="preview"><canvas id="preview-${e.id}" aria-hidden="true"></canvas><span class="mode-tag">${e.mode.toUpperCase()}</span></div><div class="example-title"><h3>${e.name}</h3>${icon("arrow")}</div><p>${e.description}</p></button>`,
    )
    .join("");
  $$("[data-example]").forEach(
    (b) =>
      (b.onclick = () => {
        const ex = examples.find((e) => e.id === b.dataset.example);
        activeChallenge = null;
        $("#challenge-banner").hidden = true;
        load(ex.source, ex.mode);
        window.scrollTo({
          top: 0,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }),
  );
  requestAnimationFrame(() => {
    for (const ex of examples.filter(
      (e) => filter === "all" || e.mode === filter,
    )) {
      const canvas = $("#preview-" + ex.id);
      const small = new DrawingView(canvas, {
        mode: ex.mode,
        interactive: false,
      });
      small.grid = false;
      small.state = {
        segments: run(ex.source, ex.mode).segments,
        position: null,
      };
      small.fit();
      small.observer.disconnect();
    }
  });
}
$$("[data-filter]").forEach(
  (b) =>
    (b.onclick = () => {
      $$("[data-filter]").forEach((x) => x.classList.toggle("active", x === b));
      renderExamples(b.dataset.filter);
    }),
);
function renderChallenges() {
  $("#progress-label").textContent =
    `${Object.keys(progress).filter((k) => progress[k]).length} / 5 ukończonych`;
  $("#challenges").innerHTML = challenges
    .map(
      (c, i) =>
        `<article class="challenge"><div class="challenge-preview"><canvas id="task-${c.id}" aria-label="Wzór do narysowania: ${c.name}"></canvas><span class="mode-tag">${c.mode.toUpperCase()}</span>${progress[c.id] ? `<span class="completed">${icon("check")}Ukończone</span>` : ""}</div><div class="challenge-copy"><span class="task-number">Zadanie ${i + 1}</span><h2>${c.name}</h2><p>${c.description}</p><details><summary>Mała podpowiedź</summary><p>${c.hint}</p></details><button class="button secondary" data-task="${c.id}">Rozwiąż w studiu ${icon("arrow")}</button></div></article>`,
    )
    .join("");
  $$("[data-task]").forEach(
    (b) =>
      (b.onclick = () =>
        startChallenge(challenges.find((c) => c.id === b.dataset.task))),
  );
  requestAnimationFrame(() => {
    for (const c of challenges) {
      const small = new DrawingView($("#task-" + c.id), {
        mode: c.mode,
        interactive: false,
      });
      small.grid = false;
      small.state = {
        segments: run(c.source, c.mode).segments,
        position: null,
      };
      small.fit();
      small.observer.disconnect();
    }
  });
}
async function startChallenge(c) {
  await load(c.starter, c.mode, { instant: false });
  activeChallenge = c;
  $("#challenge-banner").hidden = false;
  $("#challenge-banner").innerHTML =
    `<div><strong>${c.name}</strong><p>${esc(c.description)}</p><span id="task-result" role="status"></span></div><div><button id="check-task" class="button primary">${icon("check")}Sprawdź rysunek</button><button id="leave-task" class="icon-button" aria-label="Zamknij zadanie">${icon("close")}</button></div>`;
  $("#check-task").onclick = checkTask;
  $("#leave-task").onclick = () => {
    activeChallenge = null;
    $("#challenge-banner").hidden = true;
  };
  window.scrollTo({ top: 0 });
  editor.focus();
}
const distance = (p, s) => {
  let v = s.to.map((n, i) => n - s.from[i]),
    w = p.map((n, i) => n - s.from[i]),
    len = v.reduce((a, n) => a + n * n, 0),
    t = len
      ? Math.max(0, Math.min(1, w.reduce((a, n, i) => a + n * v[i], 0) / len))
      : 0;
  return Math.hypot(...p.map((n, i) => n - s.from[i] - t * v[i]));
};
function covered(a, b) {
  for (const s of a) {
    let length = Math.hypot(...s.to.map((n, i) => n - s.from[i])),
      count = Math.min(1000, Math.max(2, Math.ceil(length / 2)));
    for (let j = 0; j <= count; j++) {
      let p = s.from.map((n, i) => n + ((s.to[i] - n) * j) / count);
      if (!b.some((t) => distance(p, t) < 0.8)) return false;
    }
  }
  return true;
}
async function checkTask() {
  const c = activeChallenge;
  if (!c) return;
  const result = await runInstant(),
    expected = run(c.source, c.mode).segments;
  let message,
    pass = false;
  if (result.error) message = "Najpierw popraw błąd w programie.";
  else if (!result.segments.length)
    message = "Plansza jest pusta. Opuść pisak i narysuj pierwszy odcinek.";
  else if (!covered(result.segments, expected))
    message = "Na rysunku są odcinki poza wzorem. Sprawdź długości i kąty.";
  else if (!covered(expected, result.segments))
    message = "Brakuje części wzoru. Sprawdź liczbę powtórzeń i stan pisaka.";
  else {
    pass = true;
    message = "Udało się! Twój rysunek zgadza się ze wzorem.";
    progress[c.id] = true;
    write("progress", progress);
  }
  $("#task-result").textContent = message;
  $("#task-result").className = pass ? "task-pass" : "task-fail";
}
$("#theme").onclick = () => {
  theme = theme === "system" ? "dark" : theme === "dark" ? "light" : "system";
  write("theme", theme);
  applyTheme();
  $("#theme").title =
    `Motyw: ${theme === "system" ? "systemowy" : theme === "dark" ? "ciemny" : "jasny"}`;
  $("#theme").setAttribute("aria-label", $("#theme").title + ". Zmień motyw.");
  $("#theme").innerHTML = icon(theme === "dark" ? "moon" : "sun");
  view.draw();
  renderExamples($(".example-filters .active").dataset.filter);
  if (page === "challenges") renderChallenges();
};
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (theme === "system") {
    applyTheme();
    view.draw();
    renderExamples($(".example-filters .active").dataset.filter);
    if (page === "challenges") renderChallenges();
  }
});
function download(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("#save-file").onclick = () =>
  download(
    new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
    currentExample?.id + ".logo" === "undefined.logo"
      ? "moj-program.logo"
      : (currentExample?.id || "moj-program") + ".logo",
  );
$("#open-file").onclick = () => $("#file-input").click();
$("#file-input").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  if (f.size > 200000) {
    toast("Plik jest za duży. Limit programu to 50 000 znaków.");
    return;
  }
  try {
    await load(await f.text(), mode, { name: f.name });
  } catch {
    toast("Nie udało się odczytać pliku. Wybierz plik tekstowy UTF-8.");
  }
  e.target.value = "";
};
$("#export-png").onclick = () => {
  view.draw({ exporting: true });
  view.canvas.toBlob((blob) => {
    if (blob) download(blob, "logomocja-" + mode + ".png");
    view.draw();
  }, "image/png");
};
function encode(s) {
  const bytes = new TextEncoder().encode(s);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function decode(s) {
  const str = atob(s.replaceAll("-", "+").replaceAll("_", "/"));
  return new TextDecoder().decode(Uint8Array.from(str, (c) => c.charCodeAt(0)));
}
$("#share").onclick = async () => {
  const hash =
      "#p=" + encode(JSON.stringify({ v: 1, source: editor.value, mode })),
    url = location.href.split("#")[0] + hash;
  history.replaceState(null, "", hash);
  try {
    await navigator.clipboard.writeText(url);
    toast("Link do Twojego programu skopiowany.");
  } catch {
    showDialog(
      "Link do programu",
      `<p>Skopiuj ten link. Po otwarciu rysunek uruchomi się automatycznie.</p><label class="field-label" for="share-link">Link do udostępnienia</label><textarea id="share-link" class="share-field" readonly>${esc(url)}</textarea>`,
    );
    $("#share-link").select();
  }
};
$("#history").onclick = () => {
  showDialog(
    "Zachowane szkice",
    archives.length
      ? `<p>Do 30 ostatnich wersji przed wczytaniem przykładu, pliku lub linku. Twój obecny szkic też zostanie zachowany przy przywracaniu.</p><div class="archive-list">${archives
          .map(
            (a, i) =>
              `<button data-archive="${i}"><div><strong>${a.mode.toUpperCase()} · ${new Date(a.date).toLocaleString("pl-PL")}</strong><code>${esc(a.source.slice(0, 70))}</code></div>${icon("history")}</button>`,
          )
          .reverse()
          .join("")}</div>`
      : "<p>Tutaj pojawią się Twoje szkice, gdy wczytasz przykład, plik lub udostępniony program.</p>",
  );
  $$("[data-archive]").forEach(
    (b) =>
      (b.onclick = () => {
        let a = archives[+b.dataset.archive];
        $("#dialog").close();
        load(a.source, a.mode);
      }),
  );
};
$("#shortcuts").onclick = () =>
  showDialog(
    "Skróty do tworzenia",
    `<dl class="shortcut-list"><div><dt>Uruchom / wznów</dt><dd><kbd>Ctrl / ⌘</kbd> + <kbd>Enter</kbd></dd></div><div><dt>Następny krok</dt><dd><kbd>F10</kbd></dd></div><div><dt>Pauza / wznów</dt><dd><kbd>F8</kbd></dd></div><div><dt>Resetuj</dt><dd><kbd>Shift</kbd> + <kbd>Esc</kbd></dd></div><div><dt>Wyjdź z edytora</dt><dd><kbd>Esc</kbd></dd></div></dl><p>Na planszy: strzałki, + / − i 0. W 3D Shift + strzałki przesuwają kamerę.</p>`,
  );
$("#about").onclick = () =>
  showDialog(
    "Cześć, tu Logomocja.",
    `<p>Pracownia rysowania żółwiem, inspirowana klasycznym polskim środowiskiem Logo. Małe polecenia, nieograniczona ciekawość.</p><p>Bez konta i bez serwera. Kod i postępy zapisujemy tylko w Twojej przeglądarce. Zachowaj ważne programy jako pliki .logo.</p><p>Wersja 1.0.0. Widok 3D: geometria przestrzenna z projekcją ortograficzną w Canvas, bez zależności od WebGL.</p>`,
  );
document.addEventListener("keydown", (e) => {
  if ($("#dialog").open) return;
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    showPage("studio");
    runAnimated();
  }
  if (e.key === "F10") {
    e.preventDefault();
    showPage("studio");
    step();
  }
  if (e.key === "F8") {
    e.preventDefault();
    pause();
  }
  if (e.shiftKey && e.key === "Escape") {
    e.preventDefault();
    reset();
  }
  if (e.key === "?" && e.target !== editor) $("#shortcuts").click();
});
window.logomocja = {
  version: "1.0.0",
  run,
  open: async (source, newMode) => {
    activeChallenge = null;
    $("#challenge-banner").hidden = true;
    return load(String(source), newMode === "3d" ? "3d" : "2d");
  },
};
async function readHash() {
  if (!location.hash.startsWith("#p=")) return false;
  try {
    let data = JSON.parse(decode(location.hash.slice(3)));
    if (typeof data.source !== "string" || !["2d", "3d"].includes(data.mode))
      throw Error();
    await load(data.source, data.mode, { keepHash: true });
    return true;
  } catch {
    toast("Nie można odczytać linku. Poproś o nowy link do programu.");
    return false;
  }
}
window.addEventListener("hashchange", readHash);
updateMode();
highlight();
renderExamples();
requestAnimationFrame(async () => {
  await document.fonts.ready;
  if (!(await readHash())) await runInstant();
});
