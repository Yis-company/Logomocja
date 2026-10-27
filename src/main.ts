import "@fontsource-variable/dm-sans/wght.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-ext-400.css";
import "./style.css";
import {
  compile,
  Execution,
  errorOf,
  run,
  type Mode,
  type LogoError,
} from "./interpreter";
import { Drawing } from "./drawing";
import { examples, exampleArt } from "./examples";
declare global {
  interface Window {
    logomocja: { version: string; run: typeof run };
  }
}
window.logomocja = { version: "1.0.0", run };
const icons: Record<string, string> = {
  play: '<path d="m7 4 13 8-13 8Z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  step: '<path d="m5 5 10 7-10 7ZM19 5v14"/>',
  reset: '<path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4M12 16v1"/>',
  code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  fit: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8Z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  grid: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
  turtle: '<path d="m12 3 8 17-8-4-8 4Z"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  leaf: '<path d="M19 4C6 3 3 9 6 16c7 3 13 0 13-12ZM5 20 15 9"/>',
  cube: '<path d="m12 2 9 5v10l-9 5-9-5V7ZM3 7l9 5 9-5M12 12v10"/>',
};
const icon = (name: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || ""}</svg>`;
const turtleLogo =
  '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="m24 7 4 5 8 1 1 7 5 4-5 4-1 7-8 1-4 5-4-5-8-1-1-7-5-4 5-4 1-7 8-1Z" fill="currentColor" opacity=".16"/><path d="m24 10 4 5m7 5 4 4-4 4m-7 7-4 4-4-4M13 28l-4-4 4-4m7-5 4-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m24 15 8 5v9l-8 5-8-5v-9Z" stroke="currentColor" stroke-width="2"/><path d="m24 20 4 3v4l-4 3-4-3v-4Z" fill="currentColor"/></svg>';
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<header class="site-header"><a class="brand" href="#" aria-label="Logomocja — pracownia">${turtleLogo}<span>logomocja<span class="brand-dot">.</span></span></a><nav aria-label="Nawigacja"><a class="nav-active" href="#">Pracownia</a><button id="examples-link">Przykłady</button><button id="help-link">Jak to działa ${icon("help")}</button></nav><span class="local-badge"><i></i> Twoje pomysły, lokalnie</span></header>
<main><section class="intro"><div><div class="eyebrow">TROCHĘ KODU. MNÓSTWO MOŻLIWOŚCI.</div><h1>Wielkie rzeczy zaczynają się od <span>małego żółwia.</span></h1><p>Pisz, eksperymentuj i patrz, jak Twój kod zamienia się w rysunek.</p></div><div class="intro-note">Ta sama ciekawość.<br>Nowy wymiar.<svg viewBox="0 0 65 35" aria-hidden="true"><path d="M4 5Q30 32 57 12m-8-2 10 1-4 9"/></svg></div></section>
<section class="workspace" aria-label="Pracownia Logo"><div class="editor-pane"><div class="panel-heading"><div class="file-title"><span class="file-dot"></span>program.logo<span class="file-tag">LOGO</span></div><button class="icon-button" id="download" title="Pobierz kod" aria-label="Pobierz kod">${icon("download")}</button></div><div class="editor-topline"><span>${icon("code")} TWÓJ KOD</span><span id="saved">Zapisano lokalnie ${icon("check")}</span></div><div class="code-area"><div class="line-numbers" aria-hidden="true"></div><div class="code-input"><pre id="highlight" aria-hidden="true"></pre><textarea id="editor" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Kod programu Logo" aria-describedby="editor-hint"></textarea></div></div><div class="error-box" id="error" role="alert" hidden></div><div class="editor-hint" id="editor-hint"><span><kbd>Ctrl</kbd> + <kbd>Enter</kbd> uruchom</span><button id="commands-link">Ściąga poleceń ${icon("arrow")}</button></div><div class="execution-bar"><button id="run" class="primary-button">${icon("play")}<span>Uruchom</span></button><button id="step" class="secondary-button" title="Wykonaj kolejny krok">${icon("step")}<span>Krok</span></button><button id="reset" class="icon-button" title="Wyczyść rysunek i ustaw żółwia na początku" aria-label="Resetuj">${icon("reset")}</button><div class="speed-control"><label for="speed">Tempo <span id="speed-name">spokojnie</span></label><input id="speed" type="range" min="1" max="5" value="3" aria-label="Tempo rysowania"></div></div></div>
<div class="canvas-pane"><div class="panel-heading canvas-heading"><div class="canvas-title">${icon("turtle")}<span>Twoje płótno</span></div><div class="mode-switch" role="group" aria-label="Tryb rysowania"><button id="mode2d" class="selected" aria-pressed="true">2D <span>Płaszczyzna</span></button><button id="mode3d" aria-pressed="false">3D <span>Przestrzeń</span></button></div></div><div class="drawing-wrap"><div id="drawing"></div><div class="canvas-label"><span id="view-label">WIDOK Z GÓRY</span><span class="axis-label" id="axis-label">X / Y</span></div><div class="canvas-controls"><button id="zoom-in" class="icon-button" title="Przybliż" aria-label="Przybliż">${icon("plus")}</button><span id="zoom-value">130%</span><button id="zoom-out" class="icon-button" title="Oddal" aria-label="Oddal">${icon("minus")}</button><span class="control-divider"></span><button id="fit" class="icon-button" title="Dopasuj rysunek do widoku" aria-label="Dopasuj rysunek">${icon("fit")}</button></div><div id="webgl-message" hidden></div><div class="canvas-tip" id="canvas-tip">Przeciągnij, aby przesunąć · Przewiń, aby przybliżyć</div><div class="origin-marker" aria-hidden="true">${icon("turtle")} <span>miejsce na Twój pomysł</span></div></div><div class="canvas-footer"><div class="canvas-toggles"><button id="grid" class="toggle-on" aria-pressed="true">${icon("grid")} Siatka</button><button id="turtle" class="toggle-on" aria-pressed="true">${icon("turtle")} Żółw</button></div><span class="coordinates" id="coordinates">x: 0 <b>y: 0</b><span>z: 0</span></span></div></div></section>
<div class="status-bar"><span id="status" role="status"><i></i> Gotowy na Twój pomysł</span><span id="stats">0 odcinków <span>·</span> 0 operacji</span></div>
<section class="examples-section" id="examples"><div class="section-heading"><div><h2>Od czego zaczniemy?</h2><p>Wybierz inspirację. Zmień jedną liczbę. Zobacz, co się stanie.</p></div><span class="examples-note">MAŁE PROGRAMY, WIELKIE ODKRYCIA ${icon("leaf")}</span></div><div class="example-grid">${examples.map((e, i) => `<button class="example-card" data-example="${i}"><div class="example-art art-${e.art}">${exampleArt(e.art, e.color)}</div><div class="example-info"><span class="example-category">${e.category}</span><h3>${e.name}${e.mode === "3d" ? '<span class="tag-3d">3D</span>' : ""}</h3><p>${e.desc}</p></div><span class="example-arrow">${icon("arrow")}</span></button>`).join("")}</div></section>
<footer><span>Stare dobre Logo. Nowa przestrzeń dla wyobraźni.</span><span>${icon("leaf")} Bez konta. Bez chmury. Po prostu twórz.</span></footer></main>
<dialog id="help-dialog"><div class="dialog-head"><div><div class="eyebrow">POZNAJ SWOJEGO ŻÓŁWIA</div><h2>Kilka słów. Nieskończenie wiele rysunków.</h2></div><button class="icon-button" id="close-help" aria-label="Zamknij instrukcję">${icon("close")}</button></div><p>Żółw zaczyna na środku kartki i patrzy w górę. Podaj mu polecenie i liczbę, a potem kliknij <strong>Uruchom</strong>. Wielkość liter nie ma znaczenia.</p><div class="help-example"><code>powtórz 4 [np 100 pw 90]</code><span>Twój pierwszy kwadrat ↗</span></div><table><thead><tr><th>Polecenie</th><th>Co robi?</th></tr></thead><tbody><tr><td><code>np 100</code> / <code>ws 50</code></td><td>Idź naprzód / wstecz</td></tr><tr><td><code>pw 90</code> / <code>lw 45</code></td><td>Skręć w prawo / lewo o podany kąt</td></tr><tr><td><code>pod</code> / <code>opu</code></td><td>Podnieś / opuść pisak</td></tr><tr><td><code>kolor "#16866a"</code></td><td>Zmień kolor pisaka (6 cyfr hex)</td></tr><tr><td><code>grubość 3</code></td><td>Ustaw grubość od 1 do 12</td></tr><tr><td><code>powtórz 6 [np 60 pw 60]</code></td><td>Powtórz polecenia w nawiasach</td></tr><tr><td><code>góra 90</code> / <code>dół 90</code></td><td>Unieś / opuść nos żółwia w 3D</td></tr></tbody></table><h3>Własne polecenia? Oto procedury.</h3><pre class="help-code">oto kwadrat ma: bok, kąt\n  powtórz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90</pre><p>Definicję zakończ słowem <code>już</code> w osobnej linii. Parametry są lokalne. Procedury nie mogą wywoływać siebie, także przez inne procedury.</p><p class="help-small">Komentarze zaczynają się od <code>;</code>. Działają też polecenia bez polskich znaków i angielskie odpowiedniki, np. <code>forward</code>, <code>right</code>, <code>repeat</code>. Używaj liczb dziesiętnych z kropką, bez działań arytmetycznych. Limit: 10 000 operacji i 32 poziomy zagnieżdżenia. Krok obejmuje również obsługę powtórzeń i wywołań procedur.</p><h3>Odkrywaj przestrzeń</h3><p>W 3D przeciągaj, aby obracać kamerę. Prawy przycisk myszy przesuwa widok, kółko przybliża. Na ekranie dotykowym obracaj jednym palcem, przybliżaj i przesuwaj dwoma. Osie: X w prawo, Y naprzód, Z w górę. Polecenia <code>góra</code> i <code>dół</code> obracają żółwia względem jego własnych osi.</p><p class="help-small">Kod zapisuje się tylko w tej przeglądarce. Edycja zatrzymuje wykonanie; ponowne uruchomienie zaczyna rysunek od początku. Przycisk pobierania pozwala zachować kod w pliku.</p></dialog>`;
const $ = <T extends HTMLElement = HTMLElement>(selector: string) =>
  document.querySelector<T>(selector)!;
const editor = $<HTMLTextAreaElement>("#editor"),
  status = $("#status"),
  errorBox = $("#error");
let mode: Mode = "2d",
  ex: Execution | null = null,
  running = false,
  timer = 0,
  edited = false;
let draft = examples[0].code;
try {
  const stored = JSON.parse(localStorage.getItem("logomocja-draft") || "null");
  if (stored && typeof stored.code === "string") {
    draft = stored.code;
    mode = stored.mode === "3d" ? "3d" : "2d";
  }
} catch {}
editor.value = draft;
const drawing = new Drawing(
  $("#drawing"),
  (n) => ($("#zoom-value").textContent = n + "%"),
);
function webglUnavailable() {
  mode = "2d";
  const b = $<HTMLButtonElement>("#mode3d");
  b.disabled = true;
  b.title = "WebGL jest niedostępny w tej przeglądarce.";
  document
    .querySelectorAll<HTMLButtonElement>("[data-example]")
    .forEach((card) => {
      if (examples[Number(card.dataset.example)].mode === "3d") {
        card.disabled = true;
        card.title = "Ten przykład wymaga WebGL.";
      }
    });
  $("#webgl-message").hidden = false;
  $("#webgl-message").textContent =
    "Tryb 3D niedostępny: przeglądarka nie udostępnia WebGL. Możesz nadal rysować w 2D.";
}
if (!drawing.webgl) webglUnavailable();
$("#drawing").addEventListener("webgl-lost", () => {
  webglUnavailable();
  changeMode("2d");
});
function escape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function highlight() {
  const text = editor.value;
  $("#highlight").innerHTML =
    text
      .split("\n")
      .map((line) => {
        const re =
          /(;.*$)|("[^"\n]*")|([+-]?(?:\d+(?:\.\d*)?|\.\d+))|([\p{L}_][\p{L}\p{N}_]*:?)|([\[\]])/gu;
        let out = "",
          last = 0;
        for (const m of line.matchAll(re)) {
          out += escape(line.slice(last, m.index));
          const cls = m[1]
            ? "comment"
            : m[2]
              ? "string"
              : m[3]
                ? "number"
                : m[5]
                  ? "bracket"
                  : /^(powtórz|powtorz|repeat|oto|to|już|juz|end|ma:)$/i.test(
                        m[0],
                      )
                    ? "keyword"
                    : "command";
          out += `<span class="syntax-${cls}">${escape(m[0])}</span>`;
          last = m.index! + m[0].length;
        }
        return out + escape(line.slice(last));
      })
      .join("\n") + "\n";
  $(".line-numbers").innerHTML = text
    .split("\n")
    .map((_, i) => `<span data-line="${i + 1}">${i + 1}</span>`)
    .join("");
  syncScroll();
}
function syncScroll() {
  $("#highlight").scrollTop = editor.scrollTop;
  $("#highlight").scrollLeft = editor.scrollLeft;
  $(".line-numbers").scrollTop = editor.scrollTop;
}
function save() {
  try {
    localStorage.setItem(
      "logomocja-draft",
      JSON.stringify({ code: editor.value, mode }),
    );
    $("#saved").innerHTML = `Zapisano lokalnie ${icon("check")}`;
  } catch {
    $("#saved").textContent = "Zapis lokalny niedostępny";
  }
}
function setStatus(message: string, kind = "ready") {
  status.innerHTML = `<i class="${kind}"></i>${escape(message)}`;
}
function showError(error: LogoError | null) {
  errorBox.hidden = !error;
  if (error) {
    errorBox.innerHTML = `<button id="error-position">Linia ${error.line}, kolumna ${error.column} ${icon("arrow")}</button><span>${escape(error.message)}</span>`;
    $("#error-position").onclick = () => {
      const before = editor.value
        .split("\n")
        .slice(0, error.line - 1)
        .join("\n");
      const pos = before.length + (error.line > 1 ? 1 : 0) + error.column - 1;
      editor.focus();
      editor.setSelectionRange(pos, pos + 1);
      editor.scrollTop = Math.max(0, (error.line - 4) * 25);
      syncScroll();
    };
  }
}
function updateButtons() {
  const button = $("#run");
  button.innerHTML = running
    ? `${icon("pause")}<span>Pauza</span>`
    : ex && !ex.done
      ? `${icon("play")}<span>Wznów</span>`
      : `${icon("play")}<span>Uruchom</span>`;
  $<HTMLButtonElement>("#step").disabled = running;
  $(".workspace").classList.toggle("is-running", running);
}
function stop() {
  running = false;
  clearTimeout(timer);
  updateButtons();
}
function render() {
  drawing.update(
    ex?.segments || [],
    ex?.position || [0, 0, 0],
    ex?.heading || [0, 1, 0],
  );
  const p = ex?.position || [0, 0, 0];
  const fmt = (n: number) =>
    Math.abs(n) < 0.05 ? "0" : n.toFixed(1).replace(/\.0$/, "");
  $("#coordinates").innerHTML =
    `x: ${fmt(p[0])} <b>y: ${fmt(p[1])}</b><span>z: ${fmt(p[2])}</span>`;
  $("#stats").innerHTML =
    `${ex?.segments.length || 0} odcinków <span>·</span> ${Math.min(ex?.operations || 0, 10000)} operacji`;
  $(".origin-marker").classList.toggle(
    "visible",
    !ex?.segments.length && !running,
  );
  document
    .querySelectorAll(".line-numbers .active")
    .forEach((el) => el.classList.remove("active"));
  if (ex && !ex.done) $(`[data-line="${ex.line}"]`)?.classList.add("active");
}
function prepare() {
  stop();
  ex = null;
  showError(null);
  try {
    ex = new Execution(compile(editor.value, mode));
    edited = false;
    render();
    return true;
  } catch (e) {
    showError(errorOf(e));
    setStatus("Popraw kod i spróbuj ponownie", "error");
    render();
    return false;
  }
}
function finish() {
  stop();
  if (ex?.error) {
    showError(ex.error);
    setStatus("Wykonanie zatrzymane — sprawdź komunikat", "error");
  } else setStatus("Gotowe. A co, jeśli zmienisz jedną liczbę?");
  render();
  updateButtons();
}
const rates = [1, 2, 5, 15, 80];
function tick() {
  if (!running || !ex) return;
  const count = rates[Number($<HTMLInputElement>("#speed").value) - 1];
  for (let i = 0; i < count && !ex.done; i++) ex.step();
  render();
  if (ex.done) finish();
  else timer = window.setTimeout(tick, 50);
}
$("#run").onclick = () => {
  if (running) {
    stop();
    setStatus("Pauza — Twój żółw odpoczywa", "paused");
    return;
  }
  if (!ex || ex.done || edited) {
    if (!prepare()) return;
  }
  running = true;
  setStatus("Żółw rysuje…", "running");
  updateButtons();
  tick();
};
$("#step").onclick = () => {
  if (!ex || ex.done || edited) {
    if (!prepare()) return;
  }
  ex!.step();
  render();
  if (ex!.done) finish();
  else {
    setStatus(`Krok po kroku · linia ${ex!.line}`, "paused");
    updateButtons();
  }
};
$("#reset").onclick = () => {
  stop();
  ex = null;
  showError(null);
  render();
  setStatus("Czysta kartka. Zacznij od nowa.");
  updateButtons();
};
editor.addEventListener("input", () => {
  stop();
  ex = null;
  edited = true;
  showError(null);
  highlight();
  save();
  setStatus("Kod zmieniony — uruchom, aby zobaczyć efekt");
  updateButtons();
});
editor.addEventListener("scroll", syncScroll);
editor.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    $("#run").click();
  } else if (e.key === "Tab") {
    e.preventDefault();
    const start = editor.selectionStart,
      end = editor.selectionEnd;
    editor.setRangeText("  ", start, end, "end");
    editor.dispatchEvent(new Event("input"));
  } else if (e.key === "Enter") {
    e.preventDefault();
    const start = editor.selectionStart;
    const line = editor.value.slice(0, start).split("\n").at(-1) || "";
    const indent = line.match(/^\s*/)?.[0] || "";
    editor.setRangeText(
      "\n" + indent + (line.trimEnd().endsWith("[") ? "  " : ""),
      start,
      editor.selectionEnd,
      "end",
    );
    editor.dispatchEvent(new Event("input"));
  }
});
$<HTMLInputElement>("#speed").oninput = () => {
  $("#speed-name").textContent = [
    "powoli",
    "uważnie",
    "spokojnie",
    "szybko",
    "błyskawicznie",
  ][Number($<HTMLInputElement>("#speed").value) - 1];
};
function modeUI() {
  drawing.setMode(mode);
  $("#mode2d").classList.toggle("selected", mode === "2d");
  $("#mode3d").classList.toggle("selected", mode === "3d");
  $("#mode2d").setAttribute("aria-pressed", String(mode === "2d"));
  $("#mode3d").setAttribute("aria-pressed", String(mode === "3d"));
  $("#view-label").textContent =
    mode === "2d" ? "WIDOK Z GÓRY" : "PRZESTRZEŃ 3D";
  $("#axis-label").textContent = mode === "2d" ? "X / Y" : "X / Y / Z";
  $("#zoom-value").style.display = mode === "2d" ? "" : "none";
  $("#canvas-tip").textContent =
    mode === "2d"
      ? "Przeciągnij, aby przesunąć · Przewiń, aby przybliżyć"
      : "Przeciągnij, aby obrócić · Dwa palce, aby przybliżyć";
}
function preview() {
  if (!prepare()) return;
  while (!ex!.done) ex!.step();
  finish();
  drawing.fit();
}
function changeMode(next: Mode) {
  if (next === "3d" && !drawing.webgl) return;
  stop();
  mode = next;
  modeUI();
  save();
  preview();
}
$("#mode2d").onclick = () => {
  if (mode !== "2d") changeMode("2d");
};
$("#mode3d").onclick = () => {
  if (mode !== "3d") changeMode("3d");
};
$("#zoom-in").onclick = () => drawing.zoom(1.25);
$("#zoom-out").onclick = () => drawing.zoom(0.8);
$("#fit").onclick = () => drawing.fit();
$("#grid").onclick = () => {
  drawing.showGrid = !drawing.showGrid;
  $("#grid").classList.toggle("toggle-on", drawing.showGrid);
  $("#grid").setAttribute("aria-pressed", String(drawing.showGrid));
  drawing.paint();
};
$("#turtle").onclick = () => {
  drawing.showTurtle = !drawing.showTurtle;
  $("#turtle").classList.toggle("toggle-on", drawing.showTurtle);
  $("#turtle").setAttribute("aria-pressed", String(drawing.showTurtle));
  drawing.paint();
};
for (const b of document.querySelectorAll<HTMLButtonElement>(
  "[data-example]",
)) {
  const example = examples[Number(b.dataset.example)];
  if (example.mode === "3d" && !drawing.webgl) {
    b.disabled = true;
    b.title = "Ten przykład wymaga WebGL.";
  }
  b.onclick = () => {
    stop();
    editor.value = example.code;
    mode = example.mode;
    modeUI();
    highlight();
    save();
    preview();
    setStatus(`Wczytano: ${example.name}. Teraz dodaj coś od siebie.`);
    $(".workspace").scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
$("#examples-link").onclick = () =>
  $("#examples").scrollIntoView({ behavior: "smooth", block: "start" });
const help = $<HTMLDialogElement>("#help-dialog");
for (const id of ["#help-link", "#commands-link"])
  $(id).onclick = () => help.showModal();
$("#close-help").onclick = () => help.close();
help.addEventListener("click", (e) => {
  if (e.target === help) {
    const r = help.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      help.close();
  }
});
$("#download").onclick = () => {
  const url = URL.createObjectURL(
    new Blob([editor.value], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "moj-program.logo";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus("Kod zapisany w pliku moj-program.logo");
};
highlight();
modeUI();
requestAnimationFrame(() => {
  preview();
  if (!ex?.error && ex)
    setStatus("Twój pomysł zaczyna się tutaj. Uruchom lub zmień kod.");
});
