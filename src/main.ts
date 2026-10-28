import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/dm-sans/latin-ext-400.css";
import "@fontsource/dm-sans/latin-ext-500.css";
import "@fontsource/dm-sans/latin-ext-600.css";
import "@fontsource/dm-sans/latin-ext-700.css";
import "@fontsource/lora/latin-400.css";
import "@fontsource/lora/latin-ext-400.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-ext-400.css";
import "@fontsource/ibm-plex-mono/latin-ext-600.css";
import "@fontsource/lora/latin-400-italic.css";
import "@fontsource/lora/latin-ext-400-italic.css";
import "./style.css";
import {
  run,
  Session,
  aliases,
  initialTurtle,
  type Mode,
  type Result,
  type LogoError,
} from "./interpreter";
import { examples, type Example } from "./examples";
import { DrawingView } from "./view";
import { challenges, checkChallenge, type Challenge } from "./challenges";
import { reference, languageNotes } from "./reference";

const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
const paths: Record<string, string> = {
  enter: '<path d="M19 5v8H5m4-4-4 4 4 4"/>',
  play: '<path d="m8 5 11 7-11 7z"/>',
  step: '<path d="m5 5 10 7-10 7z"/><path d="M19 5v14"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M3 11a9 9 0 1 1 2.5 7M3 4v7h7"/>',
  arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
  upRight: '<path d="M6 18 18 6M6 6h12v12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8z"/>',
  share: '<path d="M12 16V3m-5 5 5-5 5 5M5 13v7h14v-7"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  file: '<path d="M14 3H5v18h14V8l-5-5zM14 3v6h5M8 13h8m-8 4h6"/>',
  moon: '<path d="M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  chevron: '<path d="m8 10 4 4 4-4"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  book: '<path d="M12 5v16M3 4c3-1 6-1 9 1 3-2 6-2 9-1v15c-3-1-6-1-9 1-3-2-6-2-9-1z"/>',
  box: '<path d="m12 3 9 5v9l-9 5-9-5V8l9-5zM3 8l9 5 9-5m-9 5v9M7.5 5.5l9 5"/>',
  plane: '<path d="m12 3 9 9-9 9-9-9 9-9zM3 12h18M12 3v18"/>',
  spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
  folder: '<path d="M3 7V4h7l3 3h8v13H3z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
  rotate:
    '<path d="M4 8c2-5 14-5 16 0M4 8l3-4M4 8l5 1M20 16c-2 5-14 5-16 0m16 0-3 4m3-4-5-1"/>',
};
const icon = (name: string, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
const turtleLogo = `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="m20 8 11 7v12l-11 7-11-7V15z" fill="currentColor" opacity=".18"/><path d="m20 10 9 6v10l-9 6-9-6V16zM20 10v22M11 16l18 10m0-10L11 26" stroke="currentColor" stroke-width="1.7"/><path d="M20 4v4m-13 4 3 3m20 0 3-3M7 30l4-3m18 0 4 3M20 33v3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`;
function read<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem("logomocja:" + key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}
let storageWorks = true;
function write(key: string, value: unknown) {
  try {
    localStorage.setItem("logomocja:" + key, JSON.stringify(value));
  } catch {
    storageWorks = false;
  }
}
const drafts = {
  "2d": read("draft:2d", examples[2].source),
  "3d": read("draft:3d", examples[8].source),
};
let mode: Mode = read("mode", "2d");
if (mode !== "2d" && mode !== "3d") mode = "2d";
let source = drafts[mode],
  baseline = source,
  currentName =
    examples.find((e) => e.mode === mode && e.source === source)?.name ||
    "Mój program";
let session: Session | null = null,
  running = false,
  animation = 0,
  status = "Gotowy",
  currentError: LogoError | null = null;
let currentChallenge: Challenge | null = null;
let completed = read<string[]>("completed", []);
let theme = read<"system" | "light" | "dark">("theme", "system");
let activePage = "studio";
const thumbnails = new Map<string, string>();
function preview(source: string, mode: Mode) {
  const key = mode + source;
  if (thumbnails.has(key)) return thumbnails.get(key)!;
  const segments = run(source, mode).segments;
  const project = (p: number[]) =>
    mode === "2d"
      ? [p[0], -p[1]]
      : [p[0] * 0.82 - p[1] * 0.58, p[0] * 0.32 + p[1] * 0.35 - p[2] * 0.95];
  const points = segments.flatMap((s) => [project(s.from), project(s.to)]);
  let minx = 0,
    maxx = 100,
    miny = -100,
    maxy = 0;
  if (points.length) {
    minx = Math.min(...points.map((p) => p[0]));
    maxx = Math.max(...points.map((p) => p[0]));
    miny = Math.min(...points.map((p) => p[1]));
    maxy = Math.max(...points.map((p) => p[1]));
  }
  const w = Math.max(maxx - minx, 30),
    h = Math.max(maxy - miny, 30),
    pad = Math.max(w, h) * 0.16;
  const result = `<svg class="preview-svg" viewBox="${minx - pad} ${miny - pad} ${w + pad * 2} ${h + pad * 2}" fill="none" aria-hidden="true">${segments
    .map((s) => {
      const a = project(s.from),
        b = project(s.to);
      return `<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" stroke="${s.color}" stroke-width="1.4" vector-effect="non-scaling-stroke" stroke-linecap="round"/>`;
    })
    .join("")}</svg>`;
  thumbnails.set(key, result);
  return result;
}
$("#app").innerHTML = `
<header class="app-header"><a class="brand" href="#studio" aria-label="Logomocja — pracownia">${turtleLogo}<span>logomocja<span class="brand-dot">.</span></span><span class="brand-label">PRACOWNIA ŻÓŁWIA</span></a>
<nav aria-label="Główna nawigacja"><a href="#studio" data-page="studio" class="active">Pracownia</a><a href="#examples" data-page="examples">Przykłady <span class="nav-count">13</span></a><a href="#challenges" data-page="challenges">Wyzwania</a><a href="#reference" data-page="reference">Słownik</a></nav>
<div class="header-actions"><button class="icon-button" data-action="theme" id="theme-button" aria-label="Zmień motyw">${icon("sun")}</button><span class="header-divider"></span><button class="button dark share-button" data-action="share">${icon("share")}<span>Udostępnij</span></button></div></header>
<main>
<section id="page-studio" class="page">
<div class="intro"><div><p class="eyebrow"><span class="tiny-line"></span> POMYŚL. NAPISZ. NARYSUJ.</p><h1>Wielkie pomysły zaczynają się<br class="desktop-break"> od <em>małego żółwia.</em></h1><p class="intro-text">Kilka poleceń, nieskończenie wiele możliwości. Dokąd dziś pójdziemy?</p></div><div class="intro-note">${icon("spark")}<span>Od pierwszej kreski<br>po trzeci wymiar.</span><svg viewBox="0 0 100 48" fill="none" aria-hidden="true"><path d="M5 8c12 30 37 31 47 11S76 8 89 31m-12-3 14 6 1-15" stroke="currentColor" stroke-width="1.2"/></svg></div></div>
<div class="workspace-top"><div class="workspace-label"><span class="live-dot"></span> Twoja pracownia <span class="local-badge">Zapisuje się na tym urządzeniu</span></div><div class="workspace-switches"><div class="segmented" role="group" aria-label="Tryb rysowania"><button data-action="mode2d" id="mode-2d">${icon("plane")}2D <span>Płaszczyzna</span></button><button data-action="mode3d" id="mode-3d">${icon("box")}3D <span>Przestrzeń</span></button></div><button class="button subtle choose-example" data-action="choose-example">${icon("folder")}<span>Wczytaj przykład</span>${icon("chevron")}</button></div></div>
<div id="challenge-banner" hidden></div>
<div class="studio-grid">
<section class="editor-panel panel" aria-label="Edytor programu"><div class="panel-heading"><div>${icon("file")}<h2>Program</h2><span class="filename" id="filename">rozeta.logo</span></div><button class="icon-button" data-action="files" title="Pliki i historia szkiców" aria-label="Pliki i historia szkiców">${icon("folder")}</button></div>
<div class="editor-area"><div class="gutter" aria-hidden="true"><div id="line-numbers"></div></div><div class="code-stack"><div id="execution-line" aria-hidden="true"></div><pre id="highlight" aria-hidden="true"><code id="highlight-code"></code></pre><span class="sr-only" id="editor-help">Edytor Logo. Ctrl lub Command z Enter uruchamia program. Tab przenosi fokus do następnego elementu.</span><textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Kod programu Logo" aria-describedby="editor-help error-message"></textarea></div></div>
<div id="error-message" class="error-message" role="alert" hidden></div><div class="editor-meta"><span id="cursor-position">Wiersz 1, kol. 1</span><span id="saved-label"><span class="live-dot small"></span> Zapisano</span></div>
<div class="run-controls"><button class="button primary run-button" data-action="run" title="Uruchom (Ctrl/⌘ + Enter)">${icon("play")}Uruchom<span class="key-hint">Ctrl ${icon("enter")}</span></button><button class="button control-button" data-action="step" title="Krok (Alt + →)">${icon("step")}<span>Krok</span></button><button class="button control-button" data-action="pause" id="pause-button" title="Pauza / Wznów (Alt + P)">${icon("pause")}<span>Pauza</span></button><button class="icon-button reset-button" data-action="reset" title="Reset (Alt + R)" aria-label="Resetuj program i rysunek">${icon("reset")}</button></div>
<div class="speed-row"><label for="speed">Tempo żółwia</label><span class="speed-slow">wolno</span><input id="speed" type="range" min="1" max="100" value="65" aria-label="Tempo animacji"/><span>szybko</span></div></section>
<section class="drawing-panel panel" aria-label="Podgląd rysunku"><div class="panel-heading"><div><h2>Rysunek</h2><span class="view-mode" id="view-mode">Płaszczyzna 2D</span></div><div class="drawing-heading-actions"><span class="drawing-status"><span class="live-dot small"></span><span id="drawing-status">Gotowy</span></span><button class="icon-button" data-action="png" title="Pobierz rysunek PNG" aria-label="Pobierz rysunek PNG">${icon("download")}</button></div></div>
<div class="canvas-stage"><div id="drawing"></div><div class="canvas-label"><span class="live-dot small"></span><span id="canvas-hint">Twoje pomysły mają tu miejsce.</span></div><div class="axis-badge" id="axis-badge"><span>Y</span><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 36V8m0 28h29m-29 0 13-13" stroke="currentColor" fill="none"/><path d="m9 12 3-4 3 4m22 21 4 3-4 3" stroke="currentColor" fill="none"/></svg><b>X</b></div>
<div class="camera-tools" id="orbit-tools" hidden><button class="icon-button" data-action="orbit-left" aria-label="Obróć kamerę w lewo">${icon("rotate")}</button><button class="icon-button" data-action="orbit-right" aria-label="Obróć kamerę w prawo">${icon("rotate", "flip-icon")}</button><button class="icon-button" data-action="orbit-up" aria-label="Obróć kamerę w górę">${icon("arrow", "up-icon")}</button><button class="icon-button" data-action="orbit-down" aria-label="Obróć kamerę w dół">${icon("arrow", "down-icon")}</button></div>
<div class="view-tools"><button class="icon-button" data-action="zoom-in" aria-label="Powiększ" title="Powiększ">${icon("plus")}</button><button class="icon-button" data-action="zoom-out" aria-label="Pomniejsz" title="Pomniejsz">${icon("minus")}</button><span></span><button class="icon-button" data-action="fit" aria-label="Dopasuj cały rysunek" title="Dopasuj rysunek">${icon("fit")}</button><button class="icon-button" data-action="camera-reset" aria-label="Resetuj widok" title="Resetuj widok">${icon("reset")}</button></div><div id="webgl-warning" class="webgl-warning" role="status" hidden></div></div>
<div class="drawing-footer"><span id="coordinates">X <b>0</b><i></i> Y <b>0</b></span><span class="canvas-instruction" id="canvas-instruction">Przeciągnij, aby przesunąć · przewiń, aby przybliżyć</span><span id="segment-count">0 odcinków</span><span id="zoom-level">100%</span></div></section></div>
<div class="quick-reference"><div class="quick-title">${icon("book")}<span>Mała ściąga.<br><strong>Wielki początek.</strong></span></div><button data-action="insert" data-code="np 100" class="quick-command"><code>np <span>100</span></code><span>100 kroków do przodu</span></button><button data-action="insert" data-code="pw 90" class="quick-command"><code>pw <span>90</span></code><span>Skręt o 90° w prawo</span></button><button data-action="insert" data-code="powtorz 4 [np 80 pw 90]" class="quick-command"><code>powtorz <span>4</span> [ … ]</code><span>Powtórz coś kilka razy</span></button><a href="#reference" class="text-link">Poznaj język ${icon("upRight")}</a></div>
<div class="inspiration-heading"><div><span class="eyebrow">A MOŻE TAK?</span><h2>Trochę inspiracji na start</h2></div><a href="#examples" class="text-link">Wszystkie przykłady <span>13</span> ${icon("arrow")}</a></div><div id="featured-examples" class="featured-examples"></div>
</section>
<section id="page-examples" class="page library-page" hidden></section><section id="page-challenges" class="page library-page" hidden></section><section id="page-reference" class="page library-page" hidden></section>
</main>
<footer class="app-footer"><span>${turtleLogo}<b>logomocja.</b> Mały język. Dużo wyobraźni.</span><span>Bez konta. Bez pośpiechu. Po swojemu.<button class="text-link" data-action="shortcuts">Skróty klawiszowe ${icon("upRight")}</button></span></footer>
<div class="toast" id="toast" role="status" hidden></div><dialog id="modal" aria-labelledby="modal-title"></dialog><input type="file" id="file-input" accept=".logo,text/plain" hidden/>`;
const editor = $<HTMLTextAreaElement>("#editor");
const view = new DrawingView($("#drawing"));
const modal = $<HTMLDialogElement>("#modal");
function showModal(title: string, content: string, cls = "") {
  modal.innerHTML = `<div class="modal-heading"><h2 id="modal-title">${title}</h2><button class="icon-button" data-action="close-modal" aria-label="Zamknij okno">${icon("close")}</button></div><div class="modal-content ${cls}">${content}</div>`;
  if (!modal.open) modal.showModal();
}
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    const r = modal.getBoundingClientRect();
    const p = e as MouseEvent;
    if (
      p.clientX < r.left ||
      p.clientX > r.right ||
      p.clientY < r.top ||
      p.clientY > r.bottom
    )
      modal.close();
  }
});
let toastTimer = 0;
function toast(message: string) {
  const el = $("#toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (el.hidden = true), 4200);
}
function saveDraft() {
  drafts[mode] = source;
  write("draft:" + mode, source);
  $("#saved-label").innerHTML = storageWorks
    ? '<span class="live-dot small"></span> Zapisano'
    : "Pamięć niedostępna — pobierz plik";
}
function archive(text: string, name: string, m: Mode) {
  if (!text.trim()) return;
  const history = read<
    { source: string; name: string; mode: Mode; date: string }[]
  >("history", []);
  if (history[0]?.source === text && history[0]?.mode === m) return;
  history.unshift({
    source: text,
    name,
    mode: m,
    date: new Date().toISOString(),
  });
  write("history", history.slice(0, 20));
}
function highlight() {
  const regex =
    /;[^\n]*|"[^"\n]*(?:"|$)|:?[\p{L}_][\p{L}\p{N}_]*|(?:\d+(?:\.\d*)?|\.\d+)|[\[\]()]+|[+*/<>=-]+|\s+|./gu;
  const errorIndex = currentError
    ? source
        .split("\n")
        .slice(0, currentError.line - 1)
        .reduce((n, l) => n + l.length + 1, 0) +
      currentError.column -
      1
    : -1;
  let output = "";
  for (const match of source.matchAll(regex)) {
    const token = match[0];
    let kind = "";
    if (token.startsWith(";")) kind = "comment";
    else if (token.startsWith('"')) kind = "string";
    else if (aliases[token.toLocaleLowerCase("pl")]) kind = "keyword";
    else if (/^[\d.]/.test(token)) kind = "number";
    else if (/^[\[\]()]/.test(token)) kind = "bracket";
    else if (/^[:\p{L}_]/u.test(token)) kind = "name";
    else if (/^[+*/<>=-]/.test(token)) kind = "operator";
    let content = esc(token);
    if (
      errorIndex >= match.index! &&
      errorIndex < match.index! + token.length
    ) {
      const i = errorIndex - match.index!;
      content =
        esc(token.slice(0, i)) +
        `<mark class="error-token">${esc(token.slice(i, i + 1)) || " "}</mark>` +
        esc(token.slice(i + 1));
    }
    output += kind ? `<span class="syntax-${kind}">${content}</span>` : content;
  }
  if (errorIndex >= source.length)
    output += '<mark class="error-token"> </mark>';
  $("#highlight-code").innerHTML = output + "\n";
  const count = source.split("\n").length;
  $("#line-numbers").innerHTML = Array.from(
    { length: count },
    (_, i) =>
      `<span${currentError?.line === i + 1 ? ' class="error-number"' : ""}>${i + 1}</span>`,
  ).join("");
  syncScroll();
}
function syncScroll() {
  $("#highlight").style.transform =
    `translate(${-editor.scrollLeft}px,${-editor.scrollTop}px)`;
  $("#line-numbers").style.transform = `translateY(${-editor.scrollTop}px)`;
  const line =
    !session?.done && session?.current && !currentError
      ? session.current.line
      : 0;
  $("#execution-line").style.display = line ? "block" : "none";
  $("#execution-line").style.top =
    `${(line - 1) * 27 + 23 - editor.scrollTop}px`;
}
function cursor() {
  const before = editor.value.slice(0, editor.selectionStart),
    lines = before.split("\n");
  $("#cursor-position").textContent =
    `Wiersz ${lines.length}, kol. ${lines.at(-1)!.length + 1}`;
}
function setError(error: LogoError | null) {
  currentError = error;
  const el = $("#error-message");
  el.hidden = !error;
  el.innerHTML = error
    ? `<strong>Wiersz ${error.line}, kolumna ${error.column}</strong><span>${esc(error.message)}</span>`
    : "";
  editor.setAttribute("aria-invalid", String(!!error));
  highlight();
}
function updateModeUI() {
  for (const m of ["2d", "3d"]) {
    $("#mode-" + m).classList.toggle("selected", m === mode);
    $("#mode-" + m).setAttribute("aria-pressed", String(m === mode));
  }
  $("#view-mode").textContent =
    mode === "2d" ? "Płaszczyzna 2D" : "Przestrzeń 3D";
  $("#filename").textContent =
    currentName.toLocaleLowerCase("pl").replace(/ /g, "-") + ".logo";
  $("#canvas-hint").textContent =
    mode === "2d"
      ? "Twoje pomysły mają tu miejsce."
      : "Spójrz na pomysł z każdej strony.";
  $("#canvas-instruction").textContent =
    mode === "2d"
      ? "Przeciągnij, aby przesunąć · przewiń, aby przybliżyć"
      : "Przeciągnij, aby obrócić · dwa palce przesuwają";
  $("#orbit-tools").hidden = mode !== "3d";
  view.setMode(mode);
  $("#webgl-warning").hidden = mode !== "3d" || view.available3D;
  $("#webgl-warning").textContent = view.failure;
}
function updateStats() {
  const pos = view.turtle?.position || [0, 0, 0],
    fmt = (n: number) =>
      Math.abs(n) < 0.05
        ? "0"
        : n.toLocaleString("pl", { maximumFractionDigits: 1 });
  $("#coordinates").innerHTML =
    `X <b>${fmt(pos[0])}</b><i></i> Y <b>${fmt(pos[1])}</b>${mode === "3d" ? `<i></i>Z <b>${fmt(pos[2])}</b>` : ""}`;
  $("#segment-count").textContent =
    `${view.segments.length} ${view.segments.length === 1 ? "odcinek" : "odcinków"}`;
  $("#zoom-level").textContent =
    mode === "2d" ? `${Math.round(view.scale * 100)}%` : "XYZ";
  if (mode === "3d" && !view.available3D) {
    $("#webgl-warning").hidden = false;
    $("#webgl-warning").textContent = view.failure;
  }
}
view.onChange = updateStats;
function setStatus(text: string) {
  status = text;
  $("#drawing-status").textContent = text;
  $(".drawing-status").classList.toggle("is-running", running);
  $(".drawing-status").classList.toggle("has-error", !!currentError);
}
function stopAnimation() {
  running = false;
  cancelAnimationFrame(animation);
}
function paintSession() {
  if (!session) return;
  view.update(session.segments, session.turtle);
  updateStats();
  syncScroll();
  const paused = !running && !session.done;
  $("#pause-button").innerHTML =
    `${icon(paused ? "play" : "pause")}<span>${paused ? "Wznów" : "Pauza"}</span>`;
  $<HTMLButtonElement>("#pause-button").disabled = session.done;
  if (session.done) {
    stopAnimation();
    setError(session.error);
    setStatus(session.error ? "Popraw program" : "Narysowane");
  }
}
function createSession() {
  stopAnimation();
  source = editor.value;
  saveDraft();
  session = new Session(source, mode);
  setError(session.error);
  view.update(session.segments, session.turtle);
  syncScroll();
  return session;
}
function startRun() {
  const s = createSession();
  if (s.done) {
    paintSession();
    return;
  }
  running = true;
  setStatus("Żółw rysuje…");
  let last = 0,
    credit = 0;
  const loop = (time: number) => {
    if (!running || !session) return;
    if (!last) last = time;
    const speed = Number($<HTMLInputElement>("#speed").value),
      rate = 1 + Math.pow(speed / 100, 3) * 600;
    credit += (Math.min(time - last, 100) * rate) / 1000;
    last = time;
    const steps = Math.min(500, Math.floor(credit));
    credit -= steps;
    for (let i = 0; i < steps && !session.done; i++) session.step();
    paintSession();
    if (running) animation = requestAnimationFrame(loop);
  };
  animation = requestAnimationFrame(loop);
  paintSession();
}
function resume() {
  if (!session || session.done) return;
  running = true;
  setStatus("Żółw rysuje…");
  let last = performance.now(),
    credit = 0;
  const loop = (time: number) => {
    if (!running || !session) return;
    const speed = Number($<HTMLInputElement>("#speed").value);
    credit +=
      (Math.min(time - last, 100) * (1 + Math.pow(speed / 100, 3) * 600)) /
      1000;
    last = time;
    const steps = Math.min(500, Math.floor(credit));
    credit -= steps;
    for (let i = 0; i < steps && !session.done; i++) session.step();
    paintSession();
    if (running) animation = requestAnimationFrame(loop);
  };
  animation = requestAnimationFrame(loop);
  paintSession();
}
function pauseResume() {
  if (!session || session.done) return;
  if (running) {
    stopAnimation();
    setStatus("Pauza");
    paintSession();
  } else resume();
}
function step() {
  if (!session || session.done) createSession();
  stopAnimation();
  session!.step();
  setStatus("Krok po kroku");
  paintSession();
  if (session?.current && !session.done) {
    const top = (session.current.line - 1) * 27;
    if (
      top < editor.scrollTop ||
      top > editor.scrollTop + editor.clientHeight - 70
    )
      editor.scrollTop = Math.max(0, top - 80);
    syncScroll();
  }
}
function reset() {
  stopAnimation();
  session = null;
  view.update([], initialTurtle());
  setError(null);
  setStatus("Gotowy");
  $("#pause-button").innerHTML = `${icon("pause")}<span>Pauza</span>`;
  $<HTMLButtonElement>("#pause-button").disabled = true;
  syncScroll();
}
function runInstant(): Result {
  const s = createSession(),
    result = s.finish();
  paintSession();
  view.fit();
  return result;
}
function setSource(text: string) {
  source = text;
  editor.value = text;
  editor.setSelectionRange(0, 0);
  editor.scrollTop = 0;
  editor.scrollLeft = 0;
  cursor();
  saveDraft();
  highlight();
}
function showStudio() {
  if (location.hash !== "#studio") location.hash = "studio";
  navigate("studio");
}
function switchMode(m: Mode) {
  if (m === mode) return;
  saveDraft();
  stopAnimation();
  mode = m;
  write("mode", mode);
  source = drafts[mode];
  baseline = source;
  currentName = "Mój program";
  currentChallenge = null;
  updateChallengeBanner();
  setSource(source);
  reset();
  updateModeUI();
  view.fit();
}
let pendingLoad: (() => void) | null = null;
function requestLoad(
  text: string,
  targetMode: Mode,
  name: string,
  challenge: Challenge | null = null,
) {
  const apply = () => {
    saveDraft();
    const previous = drafts[targetMode];
    if (previous !== text)
      archive(
        previous,
        targetMode === mode ? currentName : "Szkic " + targetMode.toUpperCase(),
        targetMode,
      );
    mode = targetMode;
    write("mode", mode);
    currentName = name;
    baseline = text;
    currentChallenge = challenge;
    setSource(text);
    updateModeUI();
    updateChallengeBanner();
    modal.close();
    showStudio();
    if (challenge) {
      reset();
      view.fit();
    } else runInstant();
    toast("Wczytano: " + name + ". Poprzedni szkic jest w historii plików.");
  };
  if (
    drafts[targetMode] !== text &&
    ((targetMode === mode && source !== baseline) ||
      (targetMode !== mode &&
        drafts[targetMode] !== examples[8].source &&
        drafts[targetMode] !== examples[2].source))
  ) {
    pendingLoad = apply;
    showModal(
      "Zachowaj swój pomysł",
      `<p>W edytorze jest Twój szkic. Przed wczytaniem „${esc(name)}” zachowamy go w <strong>Pliki → Historia szkiców</strong>. Możesz do niego wrócić w każdej chwili.</p><div class="modal-buttons"><button class="button" data-action="close-modal">Zostań przy szkicu</button><button class="button primary" data-action="confirm-load">Zachowaj i wczytaj ${icon("arrow")}</button></div>`,
    );
  } else apply();
}
editor.addEventListener("input", () => {
  if (session) {
    stopAnimation();
    session = null;
    setStatus("Zmieniono program");
    $("#pause-button").innerHTML = `${icon("pause")}<span>Pauza</span>`;
    $<HTMLButtonElement>("#pause-button").disabled = true;
  }
  source = editor.value;
  currentName = "Mój program";
  setError(null);
  saveDraft();
  cursor();
  $("#filename").textContent = "moj-program.logo";
  syncScroll();
});
editor.addEventListener("scroll", syncScroll);
editor.addEventListener("click", cursor);
editor.addEventListener("keyup", cursor);

function updateChallengeBanner() {
  const el = $("#challenge-banner");
  el.hidden = !currentChallenge;
  el.innerHTML = currentChallenge
    ? `<div class="challenge-banner-main"><span class="challenge-symbol">${icon("spark")}</span><div><span class="eyebrow">TWOJE WYZWANIE</span><h3>${esc(currentChallenge.name)}</h3><p>${esc(currentChallenge.description)}</p></div><button class="button primary" data-action="check-challenge">${icon("check")}Sprawdź rysunek</button><button class="icon-button" data-action="leave-challenge" aria-label="Zamknij zadanie">${icon("close")}</button></div><div id="challenge-result" role="status" hidden></div>`
    : "";
}
function renderExamples(filter = "all") {
  $("#page-examples").innerHTML =
    `<div class="page-intro"><p class="eyebrow">ODKRYWAJ, ZMIENIAJ, TWÓRZ</p><h1>Jeden pomysł.<br><em>Mnóstwo możliwości.</em></h1><p>13 gotowych programów. Zajrzyj do środka i dodaj coś od siebie.</p></div><div class="library-toolbar"><h2>Biblioteka przykładów <span>13</span></h2><div class="segmented" role="group" aria-label="Filtr przykładów">${[
      ["all", "Wszystkie"],
      ["2d", "Płaszczyzna 2D"],
      ["3d", "Przestrzeń 3D"],
    ]
      .map(
        ([v, n]) =>
          `<button data-action="filter-examples" data-filter="${v}" class="${filter === v ? "selected" : ""}" aria-pressed="${filter === v}">${n}</button>`,
      )
      .join("")}</div></div><div class="example-grid">${examples
      .filter((e) => filter === "all" || e.mode === filter)
      .map(
        (e) =>
          `<button class="example-card" data-example="${e.id}"><div class="example-art">${preview(e.source, e.mode)}<span class="art-mode">${e.mode.toUpperCase()}</span></div><div class="example-info"><span class="eyebrow">${e.tag}</span><h3>${e.name}${icon("upRight")}</h3><p>${e.description}</p></div></button>`,
      )
      .join("")}</div>`;
}
function renderChallenges() {
  $("#page-challenges").innerHTML =
    `<div class="page-intro"><p class="eyebrow">MAŁE KROKI, WIELKA SATYSFAKCJA</p><h1>Teraz <em>Twoja kolej.</em></h1><p>Spójrz na wzór, napisz program i sprawdź swój rysunek. Każda kreska czegoś uczy.</p></div><div class="library-toolbar"><h2>Ścieżka odkrywcy</h2><span class="progress-label">${icon("check")} ${completed.length} z ${challenges.length} ukończonych</span></div><div class="challenge-grid">${challenges.map((c) => `<article class="challenge-card ${completed.includes(c.id) ? "completed" : ""}"><div class="challenge-art">${preview(c.target, c.mode)}<span class="art-mode">${c.mode.toUpperCase()}</span>${completed.includes(c.id) ? `<span class="completed-badge">${icon("check")}Ukończone</span>` : ""}</div><div class="challenge-info"><span class="eyebrow">${c.level}</span><h3>${c.name}</h3><p>${c.description}</p><details><summary>Mała podpowiedź</summary><p>${c.hint}</p></details><button class="button primary" data-challenge="${c.id}">${completed.includes(c.id) ? "Spróbuj ponownie" : "Podejmij wyzwanie"} ${icon("arrow")}</button></div></article>`).join("")}</div><p class="library-note">Sprawdzamy położenie linii z tolerancją 1,2 jednostki oraz łączną długość z tolerancją 2,5%. Kolor, grubość i kolejność rysowania są dowolne. Postępy zostają na tym urządzeniu.</p>`;
}
function referenceCards(query = "") {
  const q = query.toLocaleLowerCase("pl");
  const list = reference.filter((r) =>
    [r.name, r.aliases, r.text, r.group]
      .join(" ")
      .toLocaleLowerCase("pl")
      .includes(q),
  );
  $("#reference-list").innerHTML = list.length
    ? ["Ruch", "Pióro", "Programowanie", "Przestrzeń 3D"]
        .map((group) => {
          const items = list.filter((r) => r.group === group);
          return items.length
            ? `<section class="reference-group"><h2>${group}</h2>${items.map((r) => `<article class="reference-card"><div class="reference-description"><h3><code>${esc(r.name)}</code> <span>${esc(r.args)}</span></h3><p>${r.text}</p><small>${r.aliases}</small></div><pre><code>${esc(r.example)}</code></pre></article>`).join("")}</section>`
            : "";
        })
        .join("")
    : '<p class="empty-state">Nie ma takiego polecenia. Spróbuj wpisać np, kolor lub repeat.</p>';
}
function renderReference() {
  $("#page-reference").innerHTML =
    `<div class="page-intro"><p class="eyebrow">POZNAJ JĘZYK ŻÓŁWIA</p><h1>Kilka słów.<br><em>Cały świat do narysowania.</em></h1><p>Pełny słownik Logomocji — od pierwszego ruchu do własnych procedur.</p></div><div class="reference-layout"><aside class="reference-sidebar"><label for="reference-search">Znajdź polecenie</label><input id="reference-search" type="search" placeholder="np, kolor, powtórz…"/><a href="#reference" data-action="ref-top">Polecenia</a><a href="#language-notes" data-action="ref-notes">Zasady języka i limity ${icon("arrow")}</a><div class="reference-tip">${icon("info")}<p>Możesz pisać po polsku i po angielsku. Wielkie i małe litery działają tak samo.</p></div></aside><div><div id="reference-list"></div><section id="language-notes" class="language-notes"><p class="eyebrow">JAK TO DZIAŁA</p><h2>Zasady języka</h2>${languageNotes.map((n) => `<article><h3>${n.title}</h3><p>${n.text}</p></article>`).join("")}</section></div></div>`;
  referenceCards();
  $("#reference-search").addEventListener("input", (e) =>
    referenceCards((e.target as HTMLInputElement).value),
  );
}
function navigate(page: string) {
  if (!["studio", "examples", "challenges", "reference"].includes(page))
    page = "studio";
  activePage = page;
  document
    .querySelectorAll<HTMLElement>("main > .page")
    .forEach((p) => (p.hidden = p.id !== "page-" + page));
  document.querySelectorAll("[data-page]").forEach((a) => {
    const yes = (a as HTMLElement).dataset.page === page;
    a.classList.toggle("active", yes);
    if (yes) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  if (page === "examples") renderExamples();
  if (page === "challenges") renderChallenges();
  if (page === "reference") renderReference();
  if (page === "studio") requestAnimationFrame(() => view.fit());
}
function fileMenu() {
  const history = read<
    { source: string; name: string; mode: Mode; date: string }[]
  >("history", []);
  showModal(
    "Twoje pliki i szkice",
    `<p>Programy zostają w pamięci tej przeglądarki. Pobierz plik, żeby mieć własną kopię.</p><div class="file-actions"><button class="button primary" data-action="download-logo">${icon("download")}Pobierz .logo</button><button class="button" data-action="open-file">${icon("folder")}Otwórz .logo</button><button class="button" data-action="png">${icon("download")}Rysunek PNG</button></div><h3 class="history-title">Historia szkiców <span>ostatnie 20</span></h3>${history.length ? `<div class="history-list">${history.map((h, i) => `<button data-action="restore" data-index="${i}"><span>${icon("file")}<b>${esc(h.name)}</b><small>${h.mode.toUpperCase()} · ${new Date(h.date).toLocaleString("pl", { dateStyle: "short", timeStyle: "short" })}</small></span>${icon("arrow")}</button>`).join("")}</div>` : '<p class="empty-state">Tu pojawią się szkice zachowane przed wczytaniem przykładu lub pliku.</p>'}`,
  );
}
function download(url: string, name: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
}
function downloadLogo() {
  const url = URL.createObjectURL(
    new Blob([source], { type: "text/plain;charset=utf-8" }),
  );
  download(url, "logomocja-" + mode + ".logo");
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Zapisano program jako plik .logo.");
}
async function permalink() {
  const bytes = new TextEncoder().encode(JSON.stringify({ source, mode }));
  let payload = bytes,
    prefix = "r";
  if (typeof CompressionStream !== "undefined") {
    payload = new Uint8Array(
      await new Response(
        new Blob([bytes])
          .stream()
          .pipeThrough(new CompressionStream("deflate")),
      ).arrayBuffer(),
    );
    prefix = "z";
  }
  let binary = "";
  payload.forEach((c) => (binary += String.fromCharCode(c)));
  const hash =
    prefix +
    btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return location.href.split("#")[0] + "#p=" + hash;
}
async function share() {
  const url = await permalink();
  showModal(
    "Podaj pomysł dalej.",
    `<p>Ten link zawiera Twój program i tryb ${mode.toUpperCase()}. Osoba, która go otworzy, od razu zobaczy rysunek. Bez konta i bez wysyłania na serwer.</p><label class="field-label" for="share-url">Link do programu</label><div class="copy-field"><input id="share-url" readonly value="${esc(url)}"/><button class="button primary" data-action="copy-link">Kopiuj link</button></div><p class="muted">Możesz też pobrać program jako plik .logo.</p><button class="button" data-action="download-logo">${icon("download")}Pobierz program</button>`,
  );
}
function applyTheme() {
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  view.setTheme(dark);
  $("#theme-button").innerHTML = icon(dark ? "sun" : "moon");
  $("#theme-button").setAttribute(
    "aria-label",
    dark ? "Włącz jasny motyw" : "Włącz ciemny motyw",
  );
}
function shortcuts() {
  showModal(
    "Małe skróty do wielkich pomysłów",
    `<div class="shortcut-list">${[
      ["Uruchom od początku", "Ctrl / ⌘ + Enter"],
      ["Jeden krok", "Alt + →"],
      ["Pauza / wznów", "Alt + P"],
      ["Reset programu", "Alt + R"],
    ]
      .map(([a, b]) => `<div><span>${a}</span><kbd>${b}</kbd></div>`)
      .join(
        "",
      )}</div><p>Zmiana kodu zatrzymuje wykonanie i zostawia rysunek. Kolejne uruchomienie zaczyna od początku.</p><p>Przesuwaj płótno 2D myszą albo strzałkami. Powiększaj kółkiem lub klawiszami + i −. W 3D użyj gestów albo przycisków obrotu obok płótna.</p>`,
  );
}
const actions: Record<string, (el: HTMLElement) => void | Promise<void>> = {
  run: startRun,
  step,
  pause: pauseResume,
  reset,
  theme: () => {
    theme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    write("theme", theme);
    applyTheme();
  },
  mode2d: () => switchMode("2d"),
  mode3d: () => switchMode("3d"),
  "choose-example": () =>
    showModal(
      "Dokąd pójdzie żółw?",
      `<p>Wybierz punkt wyjścia. Każdy przykład możesz dowolnie zmieniać.</p><div class="example-picker">${examples.map((e) => `<button data-example="${e.id}"><span class="picker-art">${preview(e.source, e.mode)}</span><span><strong>${e.name}</strong><small>${e.description}</small></span><span class="mode-chip">${e.mode.toUpperCase()}</span>${icon("arrow")}</button>`).join("")}</div>`,
    ),
  files: fileMenu,
  "close-modal": () => modal.close(),
  "confirm-load": () => {
    pendingLoad?.();
    pendingLoad = null;
  },
  png: () => {
    download(view.exportPNG(), "logomocja-" + mode + ".png");
    toast("Pobrano rysunek PNG.");
  },
  "download-logo": downloadLogo,
  "open-file": () => $<HTMLInputElement>("#file-input").click(),
  restore: (el) => {
    const h = read<{ source: string; name: string; mode: Mode }[]>(
      "history",
      [],
    )[Number(el.dataset.index)];
    if (h) requestLoad(h.source, h.mode, h.name);
  },
  share,
  "copy-link": async () => {
    const input = $<HTMLInputElement>("#share-url");
    input.select();
    try {
      await navigator.clipboard.writeText(input.value);
      toast("Link skopiowany. Podziel się swoim rysunkiem!");
    } catch {
      document.execCommand("copy");
      toast("Link zaznaczony — skopiuj go za pomocą Ctrl/⌘ + C.");
    }
  },
  "zoom-in": () => view.zoom(1.25),
  "zoom-out": () => view.zoom(0.8),
  fit: () => view.fit(),
  "camera-reset": () => view.resetCamera(),
  "orbit-left": () => view.orbit(-0.2),
  "orbit-right": () => view.orbit(0.2),
  "orbit-up": () => view.orbit(0, -0.2),
  "orbit-down": () => view.orbit(0, 0.2),
  shortcuts,
  "filter-examples": (el) => renderExamples(el.dataset.filter),
  insert: (el) => {
    const at = editor.selectionStart;
    const code = el.dataset.code!;
    editor.focus();
    editor.setRangeText(
      (at > 0 && source[at - 1] !== "\n" ? "\n" : "") + code + "\n",
      at,
      editor.selectionEnd,
      "end",
    );
    editor.dispatchEvent(new Event("input"));
  },
  "ref-top": () =>
    $("#reference-list").scrollIntoView({ behavior: "smooth", block: "start" }),
  "ref-notes": () =>
    $("#language-notes").scrollIntoView({ behavior: "smooth", block: "start" }),
  "check-challenge": () => {
    if (!currentChallenge) return;
    const result = runInstant(),
      check = checkChallenge(currentChallenge, result),
      el = $("#challenge-result");
    el.hidden = false;
    el.className = check.passed ? "passed" : "failed";
    el.innerHTML = `${icon(check.passed ? "check" : "info")}<span>${check.message}</span>`;
    if (check.passed && !completed.includes(currentChallenge.id)) {
      completed.push(currentChallenge.id);
      write("completed", completed);
    }
  },
  "leave-challenge": () => {
    currentChallenge = null;
    updateChallengeBanner();
  },
};
document.addEventListener("click", (e) => {
  const el = (e.target as Element).closest<HTMLElement>(
    "[data-action],[data-example],[data-challenge]",
  );
  if (!el) return;
  if (el.dataset.action) {
    if (el.tagName === "A") e.preventDefault();
    const act = actions[el.dataset.action];
    if (act)
      Promise.resolve(act(el)).catch(() =>
        toast("Nie udało się wykonać tej operacji. Spróbuj ponownie."),
      );
  } else if (el.dataset.example) {
    const x = examples.find((x) => x.id === el.dataset.example)!;
    requestLoad(x.source, x.mode, x.name);
  } else if (el.dataset.challenge) {
    const c = challenges.find((c) => c.id === el.dataset.challenge)!;
    requestLoad(c.starter, c.mode, c.name, c);
  }
});
$<HTMLInputElement>("#file-input").addEventListener("change", async (e) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (file.size > 200000) {
    toast("Plik jest za duży. Program może mieć do 50 000 znaków.");
    return;
  }
  const text = await file.text();
  if (text.length > 50000) {
    toast("Program przekracza limit 50 000 znaków.");
    return;
  }
  modal.close();
  requestLoad(text, mode, file.name.replace(/\.logo$/i, ""));
  (e.target as HTMLInputElement).value = "";
});
document.addEventListener("keydown", (e) => {
  if (modal.open) return;
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    showStudio();
    startRun();
  }
  if (e.altKey && e.key === "ArrowRight") {
    e.preventDefault();
    showStudio();
    step();
  }
  if (e.altKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
    pauseResume();
  }
  if (e.altKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    reset();
  }
});
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (theme === "system") applyTheme();
});
$("#featured-examples").innerHTML = ["kwadrat", "gwiazda", "drzewo", "szescian"]
  .map((id) => {
    const e = examples.find((e) => e.id === id)!;
    return `<button class="featured-card" data-example="${e.id}"><div class="featured-art">${preview(e.source, e.mode)}</div><div><span class="eyebrow">${e.mode.toUpperCase()} · ${e.tag}</span><h3>${e.name}</h3><p>${e.description}</p></div><span class="featured-arrow">${icon("arrow")}</span></button>`;
  })
  .join("");
async function openProgram(
  text: string,
  m: Mode,
  preserveHash = false,
): Promise<Result> {
  if (m !== "2d" && m !== "3d") m = "2d";
  saveDraft();
  if (drafts[m] !== text) archive(drafts[m], "Szkic " + m.toUpperCase(), m);
  stopAnimation();
  mode = m;
  write("mode", m);
  currentName = "Mój program";
  baseline = text;
  currentChallenge = null;
  updateChallengeBanner();
  setSource(text);
  if (preserveHash) navigate("studio");
  else showStudio();
  updateModeUI();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  const result = runInstant();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  return result;
}
declare global {
  interface Window {
    logomocja: { version: string; run: typeof run; open: typeof openProgram };
  }
}
window.logomocja = { version: "1.0.0", run, open: openProgram };
async function loadHash() {
  if (location.hash.startsWith("#p=")) {
    try {
      const value = location.hash.slice(3),
        raw = atob(value.slice(1).replace(/-/g, "+").replace(/_/g, "/"));
      let bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
      if (value[0] === "z")
        bytes = new Uint8Array(
          await new Response(
            new Blob([bytes])
              .stream()
              .pipeThrough(new DecompressionStream("deflate")),
          ).arrayBuffer(),
        );
      const data = JSON.parse(new TextDecoder().decode(bytes));
      if (
        typeof data.source !== "string" ||
        !["2d", "3d"].includes(data.mode) ||
        data.source.length > 50000
      )
        throw Error();
      await openProgram(data.source, data.mode, true);
      toast(
        "Wczytano udostępniony program. Poprzedni szkic zachowano w historii.",
      );
    } catch {
      navigate("studio");
      toast(
        "Ten link nie zawiera poprawnego programu. Twój szkic jest bezpieczny.",
      );
    }
  } else navigate(location.hash.slice(1) || "studio");
}
window.addEventListener("hashchange", () => {
  void loadHash();
});
setSource(source);
updateModeUI();
applyTheme();
runInstant();
void loadHash();
