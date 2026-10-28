import "./style.css";
import { run, createExecution, aliases } from "./interpreter.js";
import { examples } from "./examples.js";
import { DrawingView } from "./view.js";
import { commandRows, referenceText } from "./reference.js";
const $ = (s) => document.querySelector(s);
const plural = (n, one, few, many) =>
  n +
  " " +
  (n === 1
    ? one
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? few
      : many);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const paths = {
  play: "m8 5 11 7-11 7V5Z",
  step: "m5 5 10 7-10 7V5ZM19 5v14",
  pause: "M8 5v14M16 5v14",
  reset: "M3 10a9 9 0 1 1 2 9M3 4v6h6",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  fit: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  share: "M8 12h12m-5-5 5 5-5 5M11 4H4v16h7",
  sun: "M12 3v2m0 14v2M3 12h2m14 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  book: "M12 5c-3-3-7-3-10-1v15c3-2 7-2 10 0 3-2 7-2 10 0V4c-3-2-7-2-10 1Zm0 0v14",
  arrow: "M5 12h14m-5-5 5 5-5 5",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
  cube: "m12 2 10 5v10l-10 5-10-5V7l10-5Zm0 10 10-5M12 12 2 7m10 5v10",
  check: "m5 12 4 4L19 6",
  close: "m6 6 12 12M6 18 18 6",
  folder: "M3 7V4h7l2 3h9v13H3V7Z",
  clock: "M12 7v5l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  turtle:
    "M6 10c0-7 12-7 12 0v5H6v-5ZM9 8l6 7m0-7-6 7M9 5V3m6 2V3M6 10H3m15 0h3M8 15l-2 4m10-4 2 4m-6-4v4",
  flag: "M5 22V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0",
};
function icon(n) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[n] || paths.code}"/></svg>`;
}
function btn(id, n, label, extra = "") {
  return `<button id="${id}" ${extra}>${icon(n)}<span>${label}</span></button>`;
}
function read(k, d) {
  try {
    return JSON.parse(localStorage.getItem("logomocja-" + k)) ?? d;
  } catch {
    return d;
  }
}
function save(k, v) {
  try {
    localStorage.setItem("logomocja-" + k, JSON.stringify(v));
  } catch {
    toast("Brak miejsca na zapis lokalny. Pobierz program jako plik.");
  }
}
let mode = read("mode", "2d");
if (!["2d", "3d"].includes(mode)) mode = "2d";
let drafts = read("drafts", { "2d": examples[2][4], "3d": examples[8][4] });
let history = read("history", []),
  progress = read("progress", []),
  theme = read("theme", "auto");
let execution = null,
  playing = false,
  finished = false,
  currentError = null,
  title = "Mój program",
  selectedExample = "rozeta",
  challenge = null,
  timer = 0;
$("#app").innerHTML = `
<header class="site-header"><a class="brand" href="#" aria-label="Logomocja — studio"><span class="brand-mark">${icon("turtle")}</span>logomocja<span class="brand-dot">.</span></a><nav aria-label="Nawigacja główna"><button class="nav-active" id="studio">Studio<span class="nav-dot"></span></button><button id="examples-nav">Przykłady</button><button id="tasks-nav">Wyzwania <span class="small-tag">5</span></button><button id="reference-nav">Słownik poleceń ${icon("arrow")}</button></nav><div class="header-end"><span class="local-note"><i></i> Wszystko zostaje u Ciebie</span><button id="theme" class="icon-button" aria-label="Zmień motyw" title="Motyw: automatyczny">${icon("sun")}</button></div></header>
<main><section class="intro"><div><div class="eyebrow"><span class="tiny-line"></span> MAŁY ŻÓŁW. WIELKIE MOŻLIWOŚCI.</div><h1>Daj pomysłom <em>kierunek.</em></h1><p>Kilka poleceń. Nieskończenie wiele rysunków. Odkryj radość tworzenia z Logo.</p></div><div class="intro-aside"><span class="intro-scribble">np 100<br>pw 90<span>↗</span></span><span>Tak zaczyna się<br>coś ciekawego.</span></div></section>
<section class="workspace" aria-label="Studio rysowania"><div class="workspace-header"><div class="mode-switch" aria-label="Tryb rysowania"><button id="mode-2d" aria-pressed="true">${icon("code")} Płaszczyzna <span>2D</span></button><button id="mode-3d" aria-pressed="false">${icon("cube")} Przestrzeń <span>3D</span></button></div><div class="workspace-actions">${btn("file-menu", "folder", "Plik")}${btn("share", "share", "Udostępnij")}</div></div>
<div class="workspace-body"><section class="editor-panel" aria-label="Edytor programu"><div class="panel-label"><span>${icon("code")} TWÓJ PROGRAM</span><button id="history" title="Zachowane szkice">${icon("clock")}<span id="program-title">Mój program</span></button></div><div class="editor-wrap"><div class="gutter" aria-hidden="true"></div><div class="code-scroll"><pre class="highlight" aria-hidden="true"></pre><textarea id="editor" aria-label="Kod programu Logo" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off"></textarea></div></div><div id="error" class="error-message" role="alert" hidden></div><div class="editor-meta"><span>Logo <span class="meta-dot">•</span> <span id="line-count">1 wiersz</span></span><span id="saved">Zapisano lokalnie ${icon("check")}</span></div><div class="execution-bar">${btn("run", "play", "Uruchom", 'class="primary" title="Ctrl/⌘ + Enter"')}${btn("step", "step", "Krok", 'title="Alt + →"')}${btn("pause", "pause", "Pauza", 'title="Ctrl/⌘ + ."')}${btn("reset", "reset", "Reset", 'class="icon-button" aria-label="Resetuj wykonanie" title="Ctrl/⌘ + Backspace"')}</div><div class="speed-row"><label for="speed">Tempo żółwia</label><span>Spokojnie</span><input id="speed" type="range" min="1" max="100" value="65" aria-label="Tempo animacji"><span>Szybko</span></div></section>
<section class="drawing-panel" aria-label="Podgląd rysunku"><div class="drawing-top"><span><i></i> <span id="view-name">PŁÓTNO 2D</span></span><span id="position">X 0 <span>·</span> Y 0</span></div><div id="drawing"></div><div class="view-controls"><div class="zoom-group">${btn("zoom-out", "minus", "", 'class="icon-button" aria-label="Oddal"')}<span id="zoom">100%</span>${btn("zoom-in", "plus", "", 'class="icon-button" aria-label="Przybliż"')}</div>${btn("fit", "fit", "", 'class="icon-button" aria-label="Dopasuj rysunek" title="Dopasuj rysunek"')}${btn("camera-reset", "reset", "", 'class="icon-button" aria-label="Resetuj kamerę" title="Resetuj kamerę"')}${btn("png", "download", "", 'class="icon-button" aria-label="Eksportuj PNG" title="Eksportuj PNG"')}</div><span class="canvas-hint">Przeciągnij, by przesunąć · przewiń, by przybliżyć</span><span class="canvas-sign">Twoja wyobraźnia, w ruchu.</span></section></div>
<div class="workspace-status"><span><i id="status-dot"></i><span id="status">Gotowe na Twój pomysł</span></span><span><span id="segment-count">0 odcinków</span><span class="meta-dot">·</span><button id="shortcuts">Skróty klawiszowe <kbd>⌘ ↵</kbd></button></span></div></section>
<section id="challenge-active" hidden></section>
<section class="explore"><div class="explore-heading"><div><span class="eyebrow">OD CZEGO ZACZNIEMY?</span><h2>Mała inspiracja na dobry początek.</h2></div><button id="all-examples">Wszystkie przykłady ${icon("arrow")}</button></div><div class="example-grid"></div></section>
<footer><span>Logomocja <span class="footer-heart">↗</span> Z ciekawości do tworzenia.</span><span>Bez konta. Bez pośpiechu. Po swojemu.</span><button id="footer-help">Jak to działa? ${icon("book")}</button></footer></main>
<dialog id="modal" aria-labelledby="modal-title"><div class="modal-header"><span id="modal-title"></span><button id="modal-close" class="icon-button" aria-label="Zamknij">${icon("close")}</button></div><div id="modal-content"></div></dialog><div class="toast" role="status" hidden></div><input type="file" id="file-input" accept=".logo,text/plain" hidden>`;
const editor = $("#editor");
editor.value = drafts[mode] ?? "";
const view = new DrawingView(
  $("#drawing"),
  (s) => ($("#zoom").textContent = Math.round(s * 100) + "%"),
);
function applyTheme() {
  let dark =
    theme === "dark" ||
    (theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  $("#theme").title =
    "Motyw: " + { auto: "systemowy", light: "jasny", dark: "ciemny" }[theme];
  $("#theme").setAttribute(
    "aria-label",
    "Motyw: " +
      { auto: "systemowy", light: "jasny", dark: "ciemny" }[theme] +
      ". Kliknij, aby zmienić.",
  );
  view.draw();
}
applyTheme();
matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  applyTheme,
);
$("#theme").onclick = () => {
  theme = theme === "auto" ? "light" : theme === "light" ? "dark" : "auto";
  save("theme", theme);
  applyTheme();
  toast(
    "Motyw: " + { auto: "systemowy", light: "jasny", dark: "ciemny" }[theme],
  );
};
let toastTimeout;
function toast(msg) {
  let t = $(".toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => (t.hidden = true), 4500);
}
function syntax(line) {
  let result = "",
    last = 0;
  const re =
    /;.*$|"[^"\n]*"|[\p{L}_:][\p{L}\p{N}_:]*|(?:\d+(?:\.\d*)?|\.\d+)|[\[\]()\-+*/<>=,]/gu;
  let m;
  while ((m = re.exec(line))) {
    result += esc(line.slice(last, m.index));
    let v = m[0],
      kind =
        v[0] === ";"
          ? "comment"
          : v[0] === '"'
            ? "string"
            : /^[\d.]/.test(v)
              ? "number"
              : aliases[v.toLowerCase()] || v === "ma:"
                ? "command"
                : /^[\[\]()]$/.test(v)
                  ? "bracket"
                  : nameStart(v)
                    ? "name"
                    : "operator";
    result += `<span class="tok-${kind}">${esc(v)}</span>`;
    last = re.lastIndex;
  }
  return result + esc(line.slice(last));
}
function nameStart(s) {
  return /^[\p{L}_:]/u.test(s);
}
function highlight() {
  let lines = editor.value.split("\n");
  $(".highlight").innerHTML = lines
    .map((s, i) => {
      let err = currentError?.line === i + 1,
        active = execution?.state.line === i + 1 && !finished;
      let marker = err
        ? `<span class="inline-error" style="left:${Math.max(0, currentError.column - 1)}ch" title="${esc(currentError.message)}" aria-hidden="true">⌃</span>`
        : "";
      return `<span class="code-line ${active ? "executing" : ""} ${err ? "error-line" : ""}">${syntax(s) || " "}${marker}</span>`;
    })
    .join("");
  $(".gutter").innerHTML = lines
    .map(
      (_, i) =>
        `<span class="${currentError?.line === i + 1 ? "has-error" : ""} ${execution?.state.line === i + 1 && !finished ? "active-number" : ""}">${i + 1}</span>`,
    )
    .join("");
  $("#line-count").textContent = plural(
    lines.length,
    "wiersz",
    "wiersze",
    "wierszy",
  );
  syncScroll();
}
function syncScroll() {
  $(".highlight").scrollTop = editor.scrollTop;
  $(".highlight").scrollLeft = editor.scrollLeft;
  $(".gutter").scrollTop = editor.scrollTop;
}
editor.addEventListener("scroll", syncScroll);
editor.addEventListener("input", () => {
  pause(false);
  execution = null;
  finished = false;
  currentError = null;
  $("#error").hidden = true;
  drafts[mode] = editor.value;
  save("drafts", drafts);
  title = "Mój program";
  $("#program-title").textContent = title;
  status("Szkic zapisany · uruchom, aby zobaczyć zmiany");
  highlight();
});
editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    editor.setRangeText(
      "  ",
      editor.selectionStart,
      editor.selectionEnd,
      "end",
    );
    editor.dispatchEvent(new Event("input"));
  }
});
function status(s) {
  $("#status").textContent = s;
  $("#status-dot").className = playing
    ? "running"
    : currentError
      ? "error"
      : "";
}
function showError() {
  currentError = execution?.error || null;
  let box = $("#error");
  box.hidden = !currentError;
  if (currentError) {
    box.textContent = `Wiersz ${currentError.line}, kol. ${currentError.column}: ${currentError.message}`;
    editor.setAttribute("aria-invalid", "true");
    editor.setAttribute("aria-describedby", "error");
    status("Zatrzymano · sprawdź zaznaczone miejsce");
  } else {
    editor.removeAttribute("aria-invalid");
    editor.removeAttribute("aria-describedby");
  }
}
function update() {
  view.update(execution.state);
  $("#segment-count").textContent = plural(
    execution.state.segments.length,
    "odcinek",
    "odcinki",
    "odcinków",
  );
  let p = execution.state.position.map((x) =>
    Math.abs(x) < 0.001 ? 0 : Math.round(x * 10) / 10,
  );
  $("#position").innerHTML =
    `X ${p[0]} <span>·</span> Y ${p[1]}${mode === "3d" ? ` <span>·</span> Z ${p[2]}` : ""}`;
  showError();
  highlight();
}
function prepare() {
  execution = createExecution(editor.value, mode);
  finished = false;
  currentError = execution.error;
  update();
  return !currentError;
}
function pause(announce = true) {
  playing = false;
  clearTimeout(timer);
  $("#pause").innerHTML = icon("play") + "<span>Wznów</span>";
  if (announce && execution && !finished)
    status("Wstrzymano · możesz wykonać kolejny krok");
}
function complete() {
  pause(false);
  finished = true;
  update();
  if (!currentError) status("Gotowe! Twój rysunek jest na płótnie");
  $("#pause").disabled = true;
}
function tick() {
  if (!playing) return;
  let speed = Number($("#speed").value),
    batch = speed > 90 ? 40 : speed > 75 ? 6 : 1;
  for (let i = 0; i < batch; i++)
    if (execution.step().done) {
      complete();
      return;
    }
  update();
  status("Żółw rysuje…");
  timer = setTimeout(tick, Math.max(8, 310 - speed * 3));
}
function start() {
  pause(false);
  if (!prepare()) {
    finished = true;
    return;
  }
  playing = true;
  $("#pause").disabled = false;
  $("#pause").innerHTML = icon("pause") + "<span>Pauza</span>";
  tick();
}
$("#run").onclick = start;
$("#step").onclick = () => {
  pause(false);
  if (!execution || finished) {
    if (!prepare()) return;
  }
  $("#pause").disabled = false;
  let r = execution.step();
  if (r.done) complete();
  else {
    update();
    status("Krok · wiersz " + execution.state.line);
  }
};
$("#pause").onclick = () => {
  if (playing) pause();
  else if (execution && !finished && !currentError) {
    playing = true;
    $("#pause").innerHTML = icon("pause") + "<span>Pauza</span>";
    tick();
  }
};
$("#reset").onclick = () => {
  pause(false);
  execution = createExecution("", mode);
  finished = true;
  currentError = null;
  update();
  $("#pause").disabled = true;
  status("Płótno wyczyszczone · program czeka");
};
$("#zoom-in").onclick = () => view.zoom(1.2);
$("#zoom-out").onclick = () => view.zoom(1 / 1.2);
$("#fit").onclick = () => view.fit();
$("#camera-reset").onclick = () => view.resetCamera();
function setMode(next) {
  pause(false);
  drafts[mode] = editor.value;
  mode = next;
  save("mode", mode);
  editor.value = drafts[mode] ?? "";
  save("drafts", drafts);
  if (!view.setMode(mode) && mode === "3d")
    toast(
      "WebGL jest niedostępny. Programy 3D możesz obliczać, a widok 2D nadal działa.",
    );
  $("#mode-2d").setAttribute("aria-pressed", mode === "2d");
  $("#mode-3d").setAttribute("aria-pressed", mode === "3d");
  $("#view-name").textContent =
    mode === "3d" && view.mode !== "3d"
      ? "3D NIEDOSTĘPNE · BRAK WEBGL"
      : mode === "2d"
        ? "PŁÓTNO 2D"
        : "PRZESTRZEŃ 3D";
  $(".canvas-hint").textContent =
    mode === "2d"
      ? "Przeciągnij, by przesunąć · przewiń, by przybliżyć"
      : "Przeciągnij, by obrócić · prawy przycisk przesuwa";
  $("#camera-reset").hidden = mode !== "3d";
  execution = null;
  finished = false;
  currentError = null;
  $("#error").hidden = true;
  highlight();
}
$("#mode-2d").onclick = () => {
  if (mode !== "2d") {
    setMode("2d");
    instant();
  }
};
$("#mode-3d").onclick = () => {
  if (mode !== "3d") {
    setMode("3d");
    instant();
  }
};
function backup() {
  if (!editor.value.trim()) return;
  history.unshift({
    source: editor.value,
    mode,
    title,
    date: new Date().toLocaleString("pl-PL"),
  });
  history = history
    .filter(
      (x, i, a) =>
        a.findIndex((y) => y.source === x.source && y.mode === x.mode) === i,
    )
    .slice(0, 20);
  save("history", history);
}
function load(source, next, name = "Mój program") {
  backup();
  if (next !== mode) setMode(next);
  pause(false);
  editor.value = source;
  drafts[mode] = source;
  save("drafts", drafts);
  title = name;
  $("#program-title").textContent = title;
  execution = null;
  currentError = null;
  finished = false;
  highlight();
}
function instant() {
  pause(false);
  prepare();
  execution.finish();
  complete();
  view.fit();
  return { segments: execution.state.segments, error: execution.error };
}
async function open(source, next) {
  load(source, next);
  let result = instant();
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  view.fit();
  return result;
}
window.logomocja = { version: "1.0.0", run, open };
function useExample(e) {
  load(e[4], e[2], e[1]);
  selectedExample = e[0];
  challenge = null;
  $("#challenge-active").hidden = true;
  instant();
  closeModal();
  renderFeatured();
  toast(
    "Wczytano: " + e[1] + ". Poprzedni szkic znajdziesz w „Zachowane szkice”.",
  );
}
function svgPreview(source, mode = "2d") {
  let result = run(source, mode),
    points = result.segments.flatMap((s) => [project(s.from), project(s.to)]);
  function project(p) {
    return mode === "2d"
      ? [p[0], -p[1]]
      : [p[0] * 0.8 + p[1] * 0.55, -p[2] * 0.9 + p[0] * 0.3 - p[1] * 0.45];
  }
  if (!points.length) return "";
  let lo = [0, 1].map((i) => Math.min(...points.map((p) => p[i]))),
    hi = [0, 1].map((i) => Math.max(...points.map((p) => p[i]))),
    w = Math.max(hi[0] - lo[0], 1),
    h = Math.max(hi[1] - lo[1], 1),
    scale = Math.min(92 / w, 84 / h);
  return `<svg class="preview-svg" viewBox="0 0 130 110" aria-hidden="true"><g transform="translate(${65 - ((lo[0] + hi[0]) / 2) * scale},${55 - ((lo[1] + hi[1]) / 2) * scale}) scale(${scale})">${result.segments
    .map((s) => {
      let a = project(s.from),
        b = project(s.to);
      return `<path d="M${a.join(" ")}L${b.join(" ")}" fill="none" stroke="${s.color}" stroke-width="1.25" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>`;
    })
    .join("")}</g></svg>`;
}
function card(e) {
  return `<button class="example-card ${selectedExample === e[0] ? "selected" : ""}" data-example="${e[0]}"><span class="example-art art-${e[0]}">${svgPreview(e[4], e[2])}</span><span class="example-info"><span class="example-category">${e[2] === "2d" ? "NA PŁASZCZYŹNIE" : "W PRZESTRZENI"} <b>${e[2].toUpperCase()}</b></span><strong>${e[1]}</strong><span>${e[3]}</span></span><span class="card-arrow">${icon("arrow")}</span></button>`;
}
function bindExamples(root) {
  root
    .querySelectorAll("[data-example]")
    .forEach(
      (b) =>
        (b.onclick = () =>
          useExample(examples.find((e) => e[0] === b.dataset.example))),
    );
}
function renderFeatured() {
  $(".example-grid").innerHTML = [
    examples[0],
    examples[2],
    examples[5],
    examples[8],
  ]
    .map(card)
    .join("");
  bindExamples($(".example-grid"));
}
const modal = $("#modal");
let priorFocus;
function showModal(name, content, cls = "") {
  priorFocus = document.activeElement;
  $("#modal-title").textContent = name;
  $("#modal-content").className = cls;
  $("#modal-content").innerHTML = content;
  if (!modal.open) modal.showModal();
  $("#modal-content").scrollTop = 0;
}
function closeModal() {
  modal.close();
  priorFocus?.focus();
}
$("#modal-close").onclick = closeModal;
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    let r = modal.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      closeModal();
  }
});
function showExamples() {
  showModal(
    "Biblioteka przykładów",
    `<div class="modal-intro"><span class="eyebrow">13 POMYSŁÓW NA START</span><h2>Zobacz, co potrafi żółw.</h2><p>Wczytaj przykład i zmień coś po swojemu. Twój obecny szkic zostanie zachowany.</p></div><div class="library-grid">${examples.map(card).join("")}</div>`,
  );
  bindExamples($("#modal-content"));
}
$("#examples-nav").onclick = showExamples;
$("#all-examples").onclick = showExamples;
function reference() {
  showModal(
    "Słownik poleceń",
    `${referenceText}<h3>Wszystkie polecenia i aliasy</h3><div class="reference-table"><table><thead><tr><th>Po polsku / po angielsku</th><th>Działanie i przykład</th></tr></thead><tbody>${commandRows.map((r) => `<tr><td><strong>${esc(r[0])}</strong><small>${esc(r[1])}</small></td><td>${esc(r[2])}<pre>${esc(r[3])}</pre></td></tr>`).join("")}</tbody></table></div>`,
    "reference",
  );
}
$("#reference-nav").onclick = reference;
$("#footer-help").onclick = reference;
$("#shortcuts").onclick = () => {
  reference();
  [...$("#modal-content").querySelectorAll("h3")]
    .find((h) => h.textContent === "Skróty i obsługa")
    ?.scrollIntoView();
};
$("#studio").onclick = () => {
  closeModal();
  $(".workspace").scrollIntoView({ behavior: "smooth" });
};
$("#history").onclick = () => {
  showModal(
    "Zachowane szkice",
    `<div class="modal-intro"><h2>Pomysły nie przepadają.</h2><p>Ostatnie 20 szkiców zastąpionych przykładem, plikiem lub linkiem. Odtworzenie zachowa także obecny program.</p></div><div class="history-list">${history.length ? history.map((h, i) => `<button data-history="${i}"><span><strong>${esc(h.title)} <b class="small-tag">${h.mode.toUpperCase()}</b></strong><small>${esc(h.date)} · ${h.source.split("\n").length} wierszy</small><code>${esc(h.source.slice(0, 110))}</code></span>${icon("arrow")}</button>`).join("") : "<p>Nie ma jeszcze zachowanych szkiców. Twój bieżący program zapisuje się automatycznie.</p>"}</div>`,
  );
  document.querySelectorAll("[data-history]").forEach(
    (b) =>
      (b.onclick = () => {
        let h = history[Number(b.dataset.history)];
        load(h.source, h.mode, h.title);
        instant();
        closeModal();
        toast("Przywrócono szkic.");
      }),
  );
};
function download(url, name) {
  let a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}
$("#png").onclick = () => {
  download(view.export(), "logomocja-" + mode + ".png");
  toast("Rysunek zapisany jako PNG.");
};
$("#file-menu").onclick = () => {
  showModal(
    "Twój program w pliku",
    `<div class="modal-intro"><h2>Zabierz pomysł ze sobą.</h2><p>Plik .logo jest zwykłym tekstem. Otwieramy go w bieżącym trybie (${mode.toUpperCase()}).</p></div><div class="file-actions">${btn("save-logo", "download", "Pobierz program .logo", 'class="primary"')}${btn("open-logo", "folder", "Otwórz plik .logo")}</div>`,
  );
  $("#save-logo").onclick = () => {
    let u = URL.createObjectURL(
      new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
    );
    download(u, "moj-program.logo");
    setTimeout(() => URL.revokeObjectURL(u), 5000);
    closeModal();
  };
  $("#open-logo").onclick = () => $("#file-input").click();
};
$("#file-input").onchange = async (e) => {
  let file = e.target.files[0];
  if (file) {
    if (file.size > 200000) {
      toast("Plik jest za duży. Limit programu to 50 000 znaków.");
      return;
    }
    let source = await file.text();
    load(source, mode, file.name.replace(/\.logo$/i, ""));
    instant();
    closeModal();
    toast("Otwarto plik. Poprzedni szkic został zachowany.");
  }
  e.target.value = "";
};
function encode(s) {
  let bytes = new TextEncoder().encode(s),
    binary = "";
  for (let b of bytes) binary += String.fromCharCode(b);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
function decode(s) {
  return new TextDecoder("utf-8", { fatal: true }).decode(
    Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
      c.charCodeAt(0),
    ),
  );
}
$("#share").onclick = async () => {
  let url = new URL(location.href);
  url.hash = "p=" + encode(JSON.stringify({ source: editor.value, mode }));
  showModal(
    "Podziel się pomysłem",
    `<div class="modal-intro"><h2>Dobry pomysł idzie dalej.</h2><p>Ten link zawiera cały program i tryb. Po otwarciu od razu narysuje Twoją pracę — bez konta i serwera.</p></div><label class="share-label" for="share-url">Link do Twojego programu</label><input id="share-url" class="share-input" readonly value="${esc(url.href)}"><div class="file-actions">${btn("copy-link", "share", "Kopiuj link", 'class="primary"')}</div>`,
  );
  $("#copy-link").onclick = async () => {
    try {
      await navigator.clipboard.writeText(url.href);
      toast("Link skopiowany!");
    } catch {
      $("#share-url").select();
      toast("Zaznaczono link. Skopiuj go skrótem Ctrl/⌘ + C.");
    }
  };
};
function shared() {
  if (!location.hash.startsWith("#p=")) return false;
  try {
    let data = JSON.parse(decode(location.hash.slice(3)));
    if (
      typeof data.source !== "string" ||
      !["2d", "3d"].includes(data.mode) ||
      data.source.length > 50000
    )
      throw Error();
    load(data.source, data.mode, "Udostępniony program");
    instant();
    toast("Otwarto program z linku. Twój szkic został zachowany.");
    return true;
  } catch {
    toast("Nie udało się odczytać linku do programu.");
    return false;
  }
}
window.addEventListener("hashchange", shared);
const challenges = [
  {
    name: "Cztery równe strony",
    desc: "Narysuj kwadrat o boku 100. Zacznij w (0, 0), kierując się w +Y.",
    target: "powtorz 4 [np 100 pw 90]",
    mode: "2d",
    level: "01 · PIERWSZE KROKI",
  },
  {
    name: "Trzy to też figura",
    desc: "Narysuj trójkąt równoboczny o boku 120, skręcając w prawo. Zacznij w punkcie (0, 0), kierunek +Y.",
    target: "powtorz 3 [np 120 pw 120]",
    mode: "2d",
    level: "02 · KĄTY I PĘTLE",
  },
  {
    name: "Sięgnij gwiazd",
    desc: "Narysuj pięcioramienną gwiazdę: pięć odcinków długości 150, skręt w prawo o 144°. Początek: (0, 0), kierunek +Y.",
    target: "powtorz 5 [np 150 pw 144]",
    mode: "2d",
    level: "03 · RYTM POWTÓRZEŃ",
  },
  {
    name: "Rosnąca spirala",
    desc: "Narysuj 12 boków spirali: długości 10, 20, …, 120. Po każdym boku skręć w prawo o 90°. Początek: (0, 0), kierunek +Y. Użyj nrpowt lub zmiennej.",
    target: "powtorz 12 [np nrpowt * 10 pw 90]",
    mode: "2d",
    level: "04 · LICZNIK W RUCHU",
  },
  {
    name: "O krok wyżej",
    desc: "W 3D narysuj cztery stopnie. Każdy to 40 jednostek w +Y, potem 25 w +Z. Zaczynasz w (0, 0, 0). Po podniesieniu wróć do poziomego kierunku.",
    target: "powtorz 4 [np 40 gora 90 np 25 dol 90]",
    mode: "3d",
    level: "05 · TRZECI WYMIAR",
  },
];
function showChallenges() {
  showModal(
    "Wyzwania dla ciekawych",
    `<div class="modal-intro"><span class="eyebrow">NAUKA PRZEZ RYSOWANIE</span><h2>Twój następny mały krok.</h2><p>Pięć zadań, mnóstwo sposobów. Ukończono ${progress.length} z 5. Postępy zostają w tej przeglądarce.</p></div><div class="challenge-list">${challenges.map((c, i) => `<button data-challenge="${i}">${svgPreview(c.target, c.mode)}<span><small>${c.level}</small><strong>${c.name} ${progress.includes(i) ? "✓" : ""}</strong><span>${c.desc}</span></span>${icon("arrow")}</button>`).join("")}</div>`,
  );
  document
    .querySelectorAll("[data-challenge]")
    .forEach(
      (b) => (b.onclick = () => activateChallenge(Number(b.dataset.challenge))),
    );
}
$("#tasks-nav").onclick = showChallenges;
function activateChallenge(i) {
  let c = challenges[i];
  backup();
  if (mode !== c.mode) setMode(c.mode);
  challenge = i;
  load("; " + c.name + "\n; Napisz swój program poniżej.\n", c.mode, c.name);
  instant();
  $("#challenge-active").hidden = false;
  $("#challenge-active").innerHTML =
    `<div class="challenge-target">${svgPreview(c.target, c.mode)}</div><div><span class="eyebrow">WYZWANIE ${i + 1} / 5</span><h3>${c.name}</h3><p>${c.desc}</p><p id="challenge-result" role="status">Sprawdzamy położenie i długość linii (tolerancja 1 jednostki). Kolor i grubość są dowolne.</p></div><div class="challenge-actions">${btn("check-challenge", "check", "Sprawdź rysunek", 'class="primary"')}${btn("exit-challenge", "close", "Zakończ")}</div>`;
  $("#check-challenge").onclick = checkChallenge;
  $("#exit-challenge").onclick = () => {
    challenge = null;
    $("#challenge-active").hidden = true;
  };
  closeModal();
  $(".workspace").scrollIntoView({ behavior: "smooth" });
}
function checkChallenge() {
  let c = challenges[challenge],
    r = instant(),
    box = $("#challenge-result");
  if (r.error) {
    box.textContent = "Najpierw popraw błąd w programie: " + r.error.message;
    box.className = "fail";
    return;
  }
  let expected = run(c.target, c.mode).segments;
  const length = (s) => Math.hypot(...s.to.map((x, i) => x - s.from[i]));
  let total = (a) => a.reduce((v, s) => v + length(s), 0);
  function distance(p, s) {
    let v = s.to.map((x, i) => x - s.from[i]),
      d = v.reduce((a, x) => a + x * x, 0),
      t = d
        ? Math.max(
            0,
            Math.min(
              1,
              v.reduce((a, x, i) => a + x * (p[i] - s.from[i]), 0) / d,
            ),
          )
        : 0;
    return Math.hypot(...p.map((x, i) => x - s.from[i] - t * v[i]));
  }
  function covers(a, b) {
    if (!b.length) return false;
    return a.every((s) => {
      let n = Math.max(2, Math.ceil(length(s) / 3));
      for (let j = 0; j <= n; j++) {
        let p = s.from.map((x, i) => x + ((s.to[i] - x) * j) / n);
        if (!b.some((t) => distance(p, t) <= 1)) return false;
      }
      return true;
    });
  }
  let pass =
    Math.abs(total(r.segments) - total(expected)) <=
      Math.max(1, total(expected) * 0.005) &&
    covers(r.segments, expected) &&
    covers(expected, r.segments);
  if (pass) {
    if (!progress.includes(challenge)) {
      progress.push(challenge);
      save("progress", progress);
    }
    box.textContent =
      "Udało się! Rysunek pasuje do wzoru. Wyzwanie ukończone ✓";
    box.className = "pass";
    toast("Kolejny pomysł opanowany!");
  } else {
    box.textContent = r.segments.length
      ? "Jeszcze nie. Sprawdź długości, kąty i punkt początkowy. Rysunek powinien pokryć cały wzór bez dodatkowych linii."
      : "Żółw nie narysował jeszcze żadnej linii. Dodaj polecenia np i obrotu.";
    box.className = "fail";
  }
}
document.addEventListener("keydown", (e) => {
  let mod = e.ctrlKey || e.metaKey;
  if (mod && e.key === "Enter") {
    e.preventDefault();
    if (!modal.open) start();
  }
  if (e.altKey && e.key === "ArrowRight") {
    e.preventDefault();
    if (!modal.open) $("#step").click();
  }
  if (mod && e.key === ".") {
    e.preventDefault();
    $("#pause").click();
  }
  if (mod && e.key === "Backspace") {
    e.preventDefault();
    if (!modal.open) $("#reset").click();
  }
});
renderFeatured();
setMode(mode);
if (!shared()) instant();
$("#pause").disabled = true;
