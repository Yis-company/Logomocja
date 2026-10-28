import "./style.css";
import { run, createExecution, aliases } from "./interpreter.js";
import { examples } from "./examples.js";
import { DrawingView } from "./view.js";
import { commands, extraReference } from "./reference.js";
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
const icons = {
  pan: '<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
  turtle:
    '<path d="M8 8 5 5m11 3 3-3M8 16l-3 3m11-3 3 3M9 5l3-3 3 3M9 19l3 3 3-3"/><path d="m12 5 6 4v6l-6 4-6-4V9Z"/><path d="m6 9 6 4 6-4m-6 4v6"/>',
  play: '<path d="m8 5 11 7-11 7Z"/>',
  step: '<path d="m5 5 10 7-10 7Z"/><path d="M19 5v14"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  book: '<path d="M12 6v15m0-15C8 3 4 4 2 5v14c3-1 7-1 10 2 3-3 7-3 10-2V5c-2-1-6-2-10 1Z"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-5-12-2 18"/>',
  flag: '<path d="M5 21V4c5-5 9 5 14 0v10c-5 5-9-5-14 0"/>',
  share:
    '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4m-6 8 6 4"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  fit: '<path d="M9 3H3v6m12-6h6v6M3 15v6h6m6 0h6v-6M8 8h8v8H8Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  file: '<path d="M14 3H5v18h14V8Zm0 0v5h5M8 13h8m-8 4h6"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 4 3c-1 1-1 1-1 3m0 2v1"/>',
  cube: '<path d="m12 2 9 5v10l-9 5-9-5V7Zm0 10L3 7m9 5 9-5m-9 5v10"/>',
  folder: '<path d="M3 6h7l2 3h9v12H3Zm0 0V3h7l2 3h7v3"/>',
};
const icon = (n, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n] || icons.code}</svg>`;
function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    toast("Nie udało się zapisać danych lokalnie.");
  }
}
let mode = read("logo-mode", "2d"),
  theme = read("logo-theme", "system"),
  current = "rozeta",
  drafts = read("logo-drafts", {}),
  backups = read("logo-backups", []),
  progress = read("logo-progress", []),
  execution = null,
  timer = null,
  activeChallenge = null;
const initial = examples.find((e) => e.id === "rozeta");
let source =
  drafts[mode] ??
  (mode === "2d"
    ? initial.source
    : examples.find((e) => e.id === "szescian").source);
$("#app").innerHTML =
  `<header class="header"><a class="brand" href="#" aria-label="Logomocja — studio"><span class="brand-mark">${icon("turtle")}</span><span>logomocja<span class="brand-dot">.</span></span></a><span class="brand-note">MAŁE POLECENIA. WIELKIE ODKRYCIA.</span><nav aria-label="Nawigacja"><button class="nav-button active" id="studioNav">${icon("code")}Studio</button><button class="nav-button" id="examplesNav">${icon("folder")}Przykłady</button><button class="nav-button" id="challengesNav">${icon("flag")}Wyzwania<span class="nav-badge">5</span></button><button class="nav-button" id="referenceNav">${icon("book")}Słownik</button></nav><button class="icon-button theme-button" id="theme" aria-label="Zmień motyw">${icon("sun")}</button></header>
<main><section class="intro"><div><div class="eyebrow"><span></span> TWOJA PRZESTRZEŃ DO EKSPERYMENTOWANIA</div><h1>Pomysł. Polecenie. <span>Rysunek.</span></h1><p>Poprowadź żółwia i zobacz, dokąd zaprowadzi Cię wyobraźnia.</p></div><div class="intro-aside"><span class="little-turtle">${icon("turtle")}</span><span>Od pierwszej kreski<br>do trzeciego wymiaru.</span><svg class="sketch" viewBox="0 0 80 50" aria-hidden="true"><path d="M2 15Q35 3 55 30l-5-14m5 14-15-3" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></div></section>
<section class="workspace" aria-label="Studio rysowania"><section class="editor-panel"><div class="panel-head"><div class="panel-title">${icon("code")}Twój program<span class="live-dot"></span></div><div class="file-actions"><button id="openFile" class="icon-button" title="Otwórz plik .logo" aria-label="Otwórz plik .logo">${icon("folder")}</button><button id="saveFile" class="icon-button" title="Pobierz program .logo" aria-label="Pobierz program .logo">${icon("download")}</button><input id="fileInput" type="file" accept=".logo,text/plain" hidden></div></div><div class="file-tab"><span class="file-tab-name">${icon("file")}<span id="fileName">mój-program.logo</span><span class="saved-mark">●</span></span><span id="saveStatus">Zapisano lokalnie</span></div><div class="editor-wrap"><div class="line-numbers" aria-hidden="true"></div><div class="code-area"><pre id="highlight" aria-hidden="true"></pre><textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Edytor programu Logo" wrap="off"></textarea></div></div><div class="error-bar" id="error" role="status"></div><div class="editor-bottom"><span><span class="status-dot"></span><span id="runStatus">Gotowy do odkrywania</span></span><span id="cursorStatus">Wiersz 1, kol. 1</span></div><div class="execution-controls"><div class="run-row"><button class="primary" id="run" title="Ctrl / ⌘ + Enter">${icon("play")}<span>Uruchom</span><kbd>⌘ ↵</kbd></button><button class="secondary" id="step" title="Alt + →">${icon("step")}Krok</button><button class="icon-button" id="pause" title="Pauza / wznów · Alt + P" aria-label="Pauza lub wznowienie">${icon("pause")}</button><button class="icon-button" id="reset" title="Reset · Alt + R" aria-label="Reset programu">${icon("reset")}</button></div><div class="speed-row"><label for="speed">Tempo</label><span class="speed-label">spokojnie</span><input id="speed" type="range" min="1" max="100" value="75"><span class="speed-label">błyskawicznie</span></div></div></section>
<section class="drawing-panel"><div class="panel-head"><div class="panel-title">${icon("turtle")}Twoje płótno</div><div class="mode-switch" aria-label="Tryb rysowania"><button data-mode="2d">2D <span>Płaszczyzna</span></button><button data-mode="3d">3D <span>Przestrzeń</span></button></div></div><div class="canvas-wrap"><canvas id="canvas" tabindex="0" aria-label="Płótno rysunku. Przeciągnij, aby przesunąć; kółko lub dwa palce zmieniają skalę. W 3D przeciągnij, aby obrócić."></canvas><div class="canvas-label"><span class="status-dot"></span><span id="viewLabel">WIDOK 2D</span></div><div class="canvas-tools"><button class="icon-button" id="zoomIn" aria-label="Powiększ" title="Powiększ">${icon("plus")}</button><span id="zoomValue">100%</span><button class="icon-button" id="zoomOut" aria-label="Pomniejsz" title="Pomniejsz">${icon("minus")}</button><span class="tool-divider"></span><button class="icon-button" id="fit" aria-label="Dopasuj rysunek" title="Dopasuj rysunek">${icon("fit")}</button><button class="icon-button" id="dragPan" aria-label="Przesuwanie kamery zamiast obrotu" title="Przesuwanie kamery zamiast obrotu" aria-pressed="false">${icon("pan")}</button><button class="icon-button" id="camera" aria-label="Resetuj kamerę" title="Resetuj kamerę">${icon("reset")}</button></div><div class="canvas-hint" id="canvasHint">Przeciągnij, by przesunąć <span>·</span> przewiń, by przybliżyć</div></div><div class="canvas-bottom"><span id="coordinates">x: 0 <span>y: 0</span></span><span id="segmentCount">0 odcinków</span><button id="export">${icon("download")}Eksport PNG</button><button id="share">${icon("share")}Udostępnij</button></div></section></section>
<section class="examples-strip"><div class="section-heading"><div><span class="eyebrow">OD CZEGO ZACZĄĆ?</span><h2>Mała inspiracja, wielkie możliwości</h2></div><button id="allExamples" class="text-button">Wszystkie przykłady <span>13</span>${icon("arrow")}</button></div><div class="example-grid" id="quickExamples"></div></section><section class="tip"><span class="tip-icon">${icon("help")}</span><p><strong>Każda wielka przygoda zaczyna się od <code>np 100</code>.</strong> Zmieniaj liczby, eksperymentuj i patrz, co się wydarzy.</p><button id="tipReference" class="text-button">Poznaj polecenia ${icon("arrow")}</button></section></main><footer><span>logomocja. <span class="footer-muted">Z ciekawości do tworzenia.</span></span><span>Działa lokalnie. Twoje pomysły zostają z Tobą. <span class="footer-dot">●</span></span><button id="shortcuts">Skróty klawiaturowe ${icon("code")}</button></footer><dialog id="modal"><div class="modal-top"><span id="modalEyebrow" class="eyebrow">LOGOMOCJA</span><button id="closeModal" class="icon-button" aria-label="Zamknij">${icon("close")}</button></div><div id="modalBody"></div></dialog><div id="toast" role="status"></div>`;
const editor = $("#editor"),
  canvas = $("#canvas"),
  view = new DrawingView(canvas);
function applyTheme() {
  document.documentElement.dataset.theme =
    theme === "system"
      ? matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  $("#theme").title =
    "Motyw: " + { system: "systemowy", dark: "ciemny", light: "jasny" }[theme];
  view.draw();
}
applyTheme();
matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  applyTheme,
);
$("#theme").onclick = () => {
  theme = { system: "light", light: "dark", dark: "system" }[theme];
  save("logo-theme", theme);
  applyTheme();
  toast(
    "Motyw: " + { system: "systemowy", light: "jasny", dark: "ciemny" }[theme],
  );
};
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("show");
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => $("#toast").classList.remove("show"), 3600);
}
function persist() {
  drafts[mode] = editor.value;
  save("logo-drafts", drafts);
  save("logo-mode", mode);
}
function highlight() {
  const error = execution?.state.error,
    active = execution && !execution.state.done ? execution.state.line : 0;
  let lines = editor.value.split("\n");
  $("#highlight").innerHTML =
    lines
      .map((line, i) => {
        let tokens =
          line.match(
            /;.*$|"[^"\n]*"|\b\d+(?:\.\d+)?\b|[\p{L}_:][\p{L}\p{N}_:]*|[\[\]()]+|[^\p{L}\p{N}_\[\]()";]+/gu,
          ) || [];
        let markup = tokens
          .map((s) => {
            let cls = s.startsWith(";")
              ? "comment"
              : s.startsWith('"')
                ? "string"
                : /^\d/.test(s)
                  ? "number"
                  : aliases[s.toLowerCase()]
                    ? "keyword"
                    : /^[\[\]()]/.test(s)
                      ? "bracket"
                      : /^[\p{L}:]/u.test(s)
                        ? "name"
                        : "";
            return `<span class="${cls}">${esc(s)}</span>`;
          })
          .join("");
        return `<div class="code-line ${active === i + 1 ? "executing" : ""} ${error?.line === i + 1 ? "error-line" : ""}">${markup || " "}<span class="error-pin" style="left:${Math.max(0, (error?.column || 1) - 1)}ch" ${error?.line === i + 1 ? "" : "hidden"}>⌃</span></div>`;
      })
      .join("") + "\n";
  $(".line-numbers").innerHTML = lines
    .map(
      (_, i) =>
        `<div class="${error?.line === i + 1 ? "error-number" : active === i + 1 ? "active-number" : ""}">${i + 1}</div>`,
    )
    .join("");
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $(".line-numbers").scrollTop = editor.scrollTop;
  cursor();
}
function cursor() {
  let before = editor.value.slice(0, editor.selectionStart),
    lines = before.split("\n");
  $("#cursorStatus").textContent =
    `Wiersz ${lines.length}, kol. ${lines.at(-1).length + 1}`;
}
editor.addEventListener("scroll", () => {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $(".line-numbers").scrollTop = editor.scrollTop;
});
editor.addEventListener("click", cursor);
editor.addEventListener("keyup", cursor);
editor.addEventListener("input", () => {
  pause();
  execution = null;
  $("#error").textContent = "";
  $("#error").classList.remove("visible");
  $("#runStatus").textContent = "Program zmieniony";
  persist();
  highlight();
  $("#fileName").textContent = "mój-program.logo";
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
function pause() {
  clearTimeout(timer);
  timer = null;
  $("#pause").setAttribute("aria-pressed", "false");
}
function update() {
  if (!execution) return;
  let s = execution.state;
  view.state = s;
  view.draw();
  $("#error").textContent = s.error
    ? `Wiersz ${s.error.line}, kolumna ${s.error.column}: ${s.error.message}`
    : "";
  $("#error").classList.toggle("visible", !!s.error);
  $("#runStatus").textContent = s.error
    ? "Sprawdź zaznaczone miejsce"
    : s.done
      ? "Rysunek gotowy"
      : timer
        ? "Żółw rysuje…"
        : "Zatrzymano · możesz zrobić krok";
  $("#segmentCount").textContent = s.segments.length + " odcinków";
  $("#coordinates").textContent = s.position
    .map(
      (v, i) =>
        ["x", "y", "z"][i] +
        ": " +
        (Math.abs(v) < 0.01 ? 0 : Math.round(v * 10) / 10),
    )
    .slice(0, mode === "3d" ? 3 : 2)
    .join("   ");
  $("#pause").setAttribute("aria-pressed", !!timer);
  highlight();
}
function startExecution() {
  pause();
  execution = createExecution(editor.value, mode);
  update();
  return execution;
}
function tick() {
  if (!execution || execution.state.done) {
    pause();
    update();
    return;
  }
  let speed = +$("#speed").value,
    batch = speed > 90 ? 100 : speed > 70 ? 8 : 1;
  for (let i = 0; i < batch && !execution.state.done; i++) execution.step();
  timer = setTimeout(tick, Math.max(8, 400 - speed * 4));
  update();
  if (execution.state.done) {
    pause();
    update();
  }
}
function play() {
  if (!execution || execution.state.done) startExecution();
  if (!execution.state.done) {
    timer = true;
    tick();
  }
}
$("#run").onclick = play;
$("#step").onclick = () => {
  pause();
  if (!execution || execution.state.done) startExecution();
  execution.step();
  update();
};
$("#pause").onclick = () => {
  if (timer) {
    pause();
    update();
  } else if (execution && !execution.state.done) {
    timer = true;
    tick();
  }
};
$("#reset").onclick = () => {
  startExecution();
  $("#runStatus").textContent = "Gotowy do odkrywania";
};
function preserve() {
  let text = editor.value;
  if (
    text.trim() &&
    !backups.some((b) => b.source === text && b.mode === mode)
  ) {
    backups.unshift({
      source: text,
      mode,
      date: new Date().toLocaleString("pl-PL"),
    });
    backups = backups.slice(0, 30);
    save("logo-backups", backups);
  }
}
function setMode(m) {
  persist();
  pause();
  mode = m;
  save("logo-mode", mode);
  view.mode = m;
  document
    .querySelectorAll("[data-mode]")
    .forEach((b) => b.classList.toggle("selected", b.dataset.mode === m));
  $("#viewLabel").textContent =
    m === "2d" ? "WIDOK 2D" : "WIDOK 3D · RZUT PRZESTRZENNY";
  $("#canvasHint").innerHTML =
    m === "2d"
      ? "Przeciągnij, by przesunąć <span>·</span> przewiń, by przybliżyć"
      : "Przeciągnij, by obrócić <span>·</span> Shift + przeciągnięcie przesuwa";
  $("#camera").hidden = m === "2d";
  $("#dragPan").hidden = m === "2d";
}
async function openSource(text, m, { backup = false, name } = {}) {
  if (backup) preserve();
  setMode(m);
  editor.value = text;
  persist();
  $("#fileName").textContent = name ? name + ".logo" : "mój-program.logo";
  startExecution();
  while (!execution.state.done) execution.step();
  update();
  view.fit();
  await new Promise(requestAnimationFrame);
  return { segments: execution.state.segments, error: execution.state.error };
}
window.logomocja = {
  version: "1.0.0",
  run,
  open: (s, m) => openSource(s, m, { backup: true }),
};
document.querySelectorAll("[data-mode]").forEach(
  (b) =>
    (b.onclick = () => {
      if (mode === b.dataset.mode) return;
      setMode(b.dataset.mode);
      editor.value = drafts[mode] ?? "";
      execution = null;
      startExecution();
      view.reset();
      highlight();
      persist();
    }),
);
$("#zoomIn").onclick = () => view.zoomBy(1.25);
$("#zoomOut").onclick = () => view.zoomBy(0.8);
$("#fit").onclick = () => view.fit();
$("#camera").onclick = () => view.reset();
$("#dragPan").onclick = () => {
  view.dragPan = !view.dragPan;
  $("#dragPan").setAttribute("aria-pressed", String(view.dragPan));
  toast(
    view.dragPan
      ? "Przeciągnij, aby przesunąć kamerę."
      : "Przeciągnij, aby obrócić kamerę.",
  );
};
function download(blob, name) {
  let a = document.createElement("a"),
    url = URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$("#saveFile").onclick = () =>
  download(
    new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
    "moj-program.logo",
  );
$("#openFile").onclick = () => $("#fileInput").click();
$("#fileInput").onchange = async (e) => {
  let f = e.target.files[0];
  if (!f) return;
  if (f.size > 200000) {
    toast("Plik jest za duży. Limit kodu to 50 000 znaków.");
    return;
  }
  await openSource(await f.text(), mode, {
    backup: true,
    name: f.name.replace(/\.logo$/, ""),
  });
  toast("Plik otwarty. Poprzedni szkic jest w historii.");
  e.target.value = "";
};
$("#export").onclick = () => {
  view.draw();
  canvas.toBlob((b) => download(b, "logomocja-" + mode + ".png"), "image/png");
};
$("#share").onclick = async () => {
  const bytes = new TextEncoder().encode(
    JSON.stringify({ s: editor.value, m: mode }),
  );
  let encoded = btoa(Array.from(bytes, (x) => String.fromCharCode(x)).join(""));
  let url =
    location.href.split("#")[0] + "#program=" + encodeURIComponent(encoded);
  try {
    await navigator.clipboard.writeText(url);
    toast("Link do programu skopiowany!");
  } catch {
    showModal(
      "UDOSTĘPNIJ",
      `<h2>Twój program w jednym linku</h2><p>Skopiuj link. Otworzy gotowy rysunek bez konta i serwera.</p><textarea class="share-url" aria-label="Link do programu" readonly>${esc(url)}</textarea>`,
    );
    $(".share-url").select();
  }
};
function showModal(label, html) {
  pause();
  $("#modalEyebrow").textContent = label;
  $("#modalBody").innerHTML = html;
  $("#modal").showModal();
}
$("#closeModal").onclick = () => $("#modal").close();
$("#modal").addEventListener("click", (e) => {
  if (e.target === $("#modal")) $("#modal").close();
});
$("#studioNav").onclick = () => {
  $("#modal").close();
  editor.focus();
};
function thumbnail(e) {
  const result = run(e.source, e.mode),
    c = document.createElement("canvas");
  c.width = 240;
  c.height = 140;
  const ctx = c.getContext("2d");
  const proj = (p) =>
    e.mode === "3d"
      ? [
          p[0] * 0.85 - p[1] * 0.5,
          -p[2] * 0.85 - (p[0] * 0.5 + p[1] * 0.85) * 0.4,
        ]
      : [p[0], -p[1]];
  let points = result.segments.flatMap((s) => [proj(s.from), proj(s.to)]);
  if (!points.length) return "";
  let minx = Math.min(...points.map((p) => p[0])),
    maxx = Math.max(...points.map((p) => p[0])),
    miny = Math.min(...points.map((p) => p[1])),
    maxy = Math.max(...points.map((p) => p[1])),
    z = Math.min(
      190 / Math.max(1, maxx - minx),
      110 / Math.max(1, maxy - miny),
    );
  for (let s of result.segments) {
    let a = proj(s.from),
      b = proj(s.to);
    ctx.beginPath();
    ctx.moveTo(
      120 + (a[0] - (minx + maxx) / 2) * z,
      70 + (a[1] - (miny + maxy) / 2) * z,
    );
    ctx.lineTo(
      120 + (b[0] - (minx + maxx) / 2) * z,
      70 + (b[1] - (miny + maxy) / 2) * z,
    );
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  return c.toDataURL();
}
const thumbnails = new Map(examples.map((e) => [e.id, thumbnail(e)]));
function card(e) {
  return `<button class="example-card ${e.id === current ? "current" : ""}" data-example="${e.id}"><div class="example-preview"><img src="${thumbnails.get(e.id)}" alt="Rysunek: ${e.name}"><span class="mode-badge">${e.mode.toUpperCase()}</span><span class="card-open">${icon("arrow")}</span></div><div class="example-info"><strong>${e.name}</strong><span>${e.desc}</span></div></button>`;
}
function bindExamples() {
  document.querySelectorAll("[data-example]").forEach(
    (b) =>
      (b.onclick = () => {
        const e = examples.find((x) => x.id === b.dataset.example);
        current = e.id;
        openSource(e.source, e.mode, { backup: true, name: e.id });
        $("#modal").close();
        toast(
          "Wczytano: " + e.name + ". Poprzedni szkic zachowano w historii.",
        );
        quickExamples();
      }),
  );
}
function quickExamples() {
  $("#quickExamples").innerHTML = [
    "kwadrat",
    "rozeta",
    "spirala",
    "drzewo",
    "szescian",
  ]
    .map((id) => card(examples.find((e) => e.id === id)))
    .join("");
  bindExamples();
}
function examplesModal() {
  showModal(
    "BIBLIOTEKA POMYSŁÓW",
    `<h2>Co dziś narysujesz?</h2><p>13 gotowych programów. Wczytaj, uruchom i nadaj im swój charakter.<br>Przy wczytaniu Twój szkic trafia do lokalnej historii.</p><div class="library-tabs"><button id="showLibrary" class="secondary">Przykłady</button><button id="showHistory" class="secondary">Historia szkiców (${backups.length})</button></div><div id="libraryContent" class="library-grid">${examples.map(card).join("")}</div>`,
  );
  bindExamples();
  $("#showHistory").onclick = () => {
    $("#libraryContent").innerHTML = backups.length
      ? backups
          .map(
            (b, i) =>
              `<button class="history-item" data-backup="${i}"><strong>${esc(b.date)} · ${b.mode.toUpperCase()}</strong><code>${esc(b.source.slice(0, 100))}</code><span>Przywróć ${icon("arrow")}</span></button>`,
          )
          .join("")
      : "<p>Tutaj znajdziesz szkice zachowane przed wczytaniem przykładów i plików.</p>";
    document.querySelectorAll("[data-backup]").forEach(
      (b) =>
        (b.onclick = () => {
          let item = backups[+b.dataset.backup];
          openSource(item.source, item.mode, { backup: true });
          $("#modal").close();
        }),
    );
  };
  $("#showLibrary").onclick = examplesModal;
}
$("#examplesNav").onclick = examplesModal;
$("#allExamples").onclick = examplesModal;
function referenceModal() {
  showModal(
    "SŁOWNIK JĘZYKA",
    `<h2>Dogadaj się z żółwiem.</h2><p>Wszystkie polecenia, od pierwszego kroku do rekurencji.</p><input class="reference-search" placeholder="Szukaj polecenia…" aria-label="Szukaj polecenia"><div class="reference-list">${commands.map((c) => `<article class="command-entry"><h3>${esc(c[0])} <span>${esc(c[1])}</span></h3><small>${esc(c[2])}</small><p>${esc(c[3])}</p><pre>${esc(c[4])}</pre></article>`).join("")}</div><div class="reference-text">${extraReference}</div>`,
  );
  $(".reference-search").oninput = (e) => {
    let q = e.target.value.toLowerCase();
    document
      .querySelectorAll(".command-entry")
      .forEach((c) => (c.hidden = !c.textContent.toLowerCase().includes(q)));
  };
}
$("#referenceNav").onclick = referenceModal;
$("#tipReference").onclick = referenceModal;
$("#shortcuts").onclick = referenceModal;
const challenges = [
  {
    name: "Cztery równe boki",
    desc: "Narysuj kwadrat o boku 100, zaczynając w (0, 0), w kierunku +Y. Skręcaj w prawo. Kolor i grubość są dowolne.",
    target: "powtorz 4 [np 100 pw 90]",
    hint: "Pełen obrót to 360°. Kwadrat ma cztery kąty proste.",
  },
  {
    name: "Trójkąt na dobry początek",
    desc: "Narysuj trójkąt równoboczny o boku 120. Zacznij w (0, 0), kieruj się +Y i skręcaj w prawo.",
    target: "powtorz 3 [np 120 pw 120]",
    hint: "Żółw obraca się o kąt zewnętrzny: 360 / 3.",
  },
  {
    name: "Gwiazda w pięciu ruchach",
    desc: "Narysuj pięcioramienną gwiazdę z pięciu odcinków po 150. Start (0, 0), kierunek +Y, skręty w prawo o 144°.",
    target: "powtorz 5 [np 150 pw 144]",
    hint: "Użyj pętli powtorz i kąta 144.",
  },
  {
    name: "Przerwa na oddech",
    desc: "Narysuj dwie pionowe kreski po 60: pierwszą od (0,0) do (0,60), drugą od (0,100) do (0,160). Przerwa 40 nie może być narysowana.",
    target: "np 60 pod np 40 opu np 60",
    hint: "pod podnosi pisak, opu go opuszcza.",
  },
  {
    name: "Schody do przestrzeni",
    desc: "W 3D narysuj 3 stopnie: każdy to 50 w kierunku +Y i 30 w kierunku +Z. Start (0,0,0). Po każdym stopniu przywróć poziomy kierunek.",
    mode: "3d",
    target: "powtorz 3 [np 50 gora 90 np 30 dol 90]",
    hint: "gora 90 kieruje nos ku górze; dol 90 przywraca kierunek.",
  },
];
function checkDrawing(actual, expected) {
  if (!actual.length) return "Rysunek jest pusty. Uruchom kilka ruchów żółwia.";
  const dist = (p, a, b) => {
    let d = b.map((v, i) => v - a[i]),
      l = d.reduce((s, v) => s + v * v, 0),
      t = l
        ? Math.max(
            0,
            Math.min(1, p.reduce((s, v, i) => s + (v - a[i]) * d[i], 0) / l),
          )
        : 0;
    return Math.hypot(...p.map((v, i) => v - a[i] - t * d[i]));
  };
  const covered = (one, other) =>
    one.every((s) => {
      let length = Math.hypot(...s.to.map((v, i) => v - s.from[i])),
        steps = Math.min(1000, Math.max(2, Math.ceil(length / 2)));
      for (let i = 0; i <= steps; i++) {
        let p = s.from.map((v, j) => v + ((s.to[j] - v) * i) / steps);
        if (!other.some((o) => dist(p, o.from, o.to) < 1)) return false;
      }
      return true;
    });
  if (!covered(actual, expected))
    return "Część kreski jest poza wzorem. Sprawdź długości, kąty i pozycję początkową.";
  if (!covered(expected, actual))
    return "Brakuje części wzoru. Sprawdź liczbę powtórzeń i stan pisaka.";
  return null;
}
function challengesModal() {
  showModal(
    "ĆWICZ I ODKRYWAJ",
    `<h2>Twój kolejny mały krok.</h2><p>Pięć wyzwań, coraz więcej możliwości. Ukończono ${progress.length} z 5.</p><div class="challenge-list">${challenges.map((c, i) => `<button data-challenge="${i}" class="challenge-card"><span class="challenge-number ${progress.includes(i) ? "complete" : ""}">${progress.includes(i) ? icon("check") : String(i + 1).padStart(2, "0")}</span><span><strong>${c.name}</strong><small>${c.mode === "3d" ? "Przestrzeń 3D" : "Płaszczyzna 2D"} · ${progress.includes(i) ? "Ukończone" : "Do odkrycia"}</small></span>${icon("arrow")}</button>`).join("")}</div>`,
  );
  document
    .querySelectorAll("[data-challenge]")
    .forEach((b) => (b.onclick = () => challengeDetail(+b.dataset.challenge)));
}
function challengeDetail(i) {
  let c = challenges[i];
  showModal(
    "WYZWANIE " + (i + 1) + " / 5",
    `<h2>${c.name}</h2><p>${c.desc}</p><div class="target-preview"><img src="${thumbnail({ source: c.target, mode: c.mode || "2d" })}" alt="Wzór do narysowania"><span>TWÓJ CEL · tolerancja 1 jednostka</span></div><details><summary>Potrzebujesz wskazówki?</summary><p>${c.hint}</p></details><div class="challenge-actions"><button class="primary" id="startChallenge">${icon("code")}Przejdź do edytora</button><button class="secondary" id="checkChallenge">${icon("check")}Sprawdź mój program</button></div><p id="challengeResult" role="status"></p>`,
  );
  $("#startChallenge").onclick = () => {
    activeChallenge = i;
    openSource(
      `; Wyzwanie: ${c.name}\n; Tutaj wpisz swój program.\n`,
      c.mode || "2d",
      { backup: true },
    );
    $("#modal").close();
    $("#tipReference").innerHTML = "Sprawdź wyzwanie " + icon("check");
    $("#tipReference").onclick = () => challengeDetail(i);
    $(".tip p").innerHTML = `<strong>${c.name}.</strong> ${c.desc}`;
    editor.focus();
  };
  $("#checkChallenge").onclick = () => {
    let m = c.mode || "2d";
    if (mode !== m) {
      $("#challengeResult").textContent =
        "Przełącz tryb na " + m.toUpperCase() + ".";
      return;
    }
    let result = run(editor.value, mode),
      reason = result.error
        ? `Wiersz ${result.error.line}: ${result.error.message}`
        : checkDrawing(result.segments, run(c.target, m).segments);
    $("#challengeResult").textContent = reason
      ? "Jeszcze nie! " + reason
      : "Brawo! Rysunek zgadza się ze wzorem. Wyzwanie ukończone.";
    $("#challengeResult").className = reason ? "fail-result" : "pass-result";
    if (!reason && !progress.includes(i)) {
      progress.push(i);
      save("logo-progress", progress);
    }
  };
}
$("#challengesNav").onclick = challengesModal;
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    play();
  }
  if (e.altKey && e.key === "ArrowRight") {
    e.preventDefault();
    $("#step").click();
  }
  if (e.altKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
    $("#pause").click();
  }
  if (e.altKey && e.key.toLowerCase() === "r") {
    e.preventDefault();
    $("#reset").click();
  }
});
quickExamples();
async function loadHash() {
  if (location.hash.startsWith("#program=")) {
    try {
      let data = JSON.parse(
        new TextDecoder().decode(
          Uint8Array.from(
            atob(decodeURIComponent(location.hash.slice(9))),
            (c) => c.charCodeAt(0),
          ),
        ),
      );
      if (typeof data.s !== "string" || !["2d", "3d"].includes(data.m))
        throw Error();
      await openSource(data.s, data.m, { backup: true });
      toast("Program z linku gotowy. Miłego odkrywania!");
      return true;
    } catch {
      toast("Nie udało się odczytać programu z linku.");
    }
  }
  return false;
}
editor.value = source;
view.mode = mode;
document
  .querySelectorAll("[data-mode]")
  .forEach((b) => b.classList.toggle("selected", b.dataset.mode === mode));
loadHash().then((loaded) => {
  if (!loaded) openSource(source, mode);
});
window.addEventListener("hashchange", loadHash);
