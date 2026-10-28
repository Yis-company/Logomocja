import "./style.css";
import { compile, initialTurtle, run, type Execution, type RunResult, type Segment } from "./lang/interp";
import type { Mode } from "./lang/parser";
import { EXAMPLES } from "./examples";
import { CHALLENGES, check, targetSegments, type Challenge } from "./challenges";
import { Editor } from "./ui/editor";
import { View2D } from "./ui/view2d";
import { View3D, webglProblem } from "./ui/view3d";
import { referenceHTML } from "./reference";
import { SHORTCUTS, matchShortcut } from "./shortcuts";
import { decodeProgram, encodeProgram } from "./share";

const VERSION = "1.0.0";
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ---------- storage ----------
const store = {
  get(k: string): string | null {
    try {
      return localStorage.getItem("logomocja:" + k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem("logomocja:" + k, v);
    } catch {}
  },
};

// ---------- state ----------
let mode: Mode = store.get("mode") === "3d" ? "3d" : "2d";
let challenge: Challenge | null = null;
let exec: Execution | null = null;
type RunState = "idle" | "running" | "paused" | "done";
let runState: RunState = "idle";
let speed = Number(store.get("speed")) || 7;
const no3d = webglProblem();
if (no3d && mode === "3d") mode = "2d";

const editor = new Editor($("editor"));
const v2d = new View2D($<HTMLCanvasElement>("c2d"));
let v3d: View3D | null = null;
let v3dError: string | null = no3d;

function getV3d(): View3D | null {
  if (v3d || v3dError) return v3d;
  try {
    v3d = new View3D($<HTMLCanvasElement>("c3d"));
  } catch (e) {
    v3dError = "Nie udało się uruchomić grafiki 3D (WebGL). Tryb 2D działa normalnie.";
  }
  return v3d;
}

const view = () => (mode === "3d" ? getV3d() : v2d);

// ---------- drafts ----------
const draftKey = () => (challenge ? `challenge:${challenge.id}` : `draft:${mode}`);
const defaultDraft = (m: Mode) => EXAMPLES.find((e) => e.id === (m === "2d" ? "kwadrat" : "schody"))!.source;
function readDraft(m: Mode): string {
  return store.get(`draft:${m}`) ?? defaultDraft(m);
}
let saveTimer = 0;
function saveDraftSoon() {
  clearTimeout(saveTimer);
  saveTimer = window.setTimeout(saveDraft, 250);
}
function saveDraft() {
  clearTimeout(saveTimer);
  store.set(draftKey(), editor.value);
}
window.addEventListener("pagehide", saveDraft);
const isPristine = (src: string) => src.trim() === "" || EXAMPLES.some((e) => e.source === src);

// ---------- toast & dialogs ----------
let toastTimer = 0;
function toast(msg: string, action?: { label: string; run: () => void }) {
  const t = $("toast");
  t.innerHTML = "";
  const span = document.createElement("span");
  span.textContent = msg;
  t.append(span);
  if (action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn small";
    b.textContent = action.label;
    b.onclick = () => {
      t.hidden = true;
      action.run();
    };
    t.append(b);
  }
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => (t.hidden = true), action ? 9000 : 3500);
}

function confirmDialog(text: string, ok = "Wczytaj"): Promise<boolean> {
  const d = $<HTMLDialogElement>("confirm-dialog");
  $("cd-text").textContent = text;
  $("cd-ok").textContent = ok;
  d.returnValue = "";
  d.showModal();
  return new Promise((res) => d.addEventListener("close", () => res(d.returnValue === "ok"), { once: true }));
}

// ---------- mode ----------
function applyModeUI() {
  $("mode-2d").setAttribute("aria-checked", String(mode === "2d"));
  $("mode-3d").setAttribute("aria-checked", String(mode === "3d"));
  for (const id of ["mode-2d", "mode-3d"]) ($(id) as HTMLButtonElement).disabled = !!challenge;
  const unavailable = mode === "3d" && !getV3d();
  $("c2d").hidden = mode !== "2d";
  $("c3d").hidden = mode !== "3d" || unavailable;
  const note = $("no3d");
  note.hidden = !unavailable;
  note.textContent = unavailable ? v3dError ?? "" : "";
  if (v3dError) $("mode-3d").title = v3dError;
  $("fit-btn").textContent = mode === "3d" ? "Reset kamery" : "Dopasuj";
}

function setMode(m: Mode, opts: { keepEditor?: boolean } = {}) {
  if (m === "3d" && v3dError && !opts.keepEditor) {
    toast(v3dError);
  }
  saveDraft();
  stopExec();
  mode = m;
  store.set("mode", m);
  applyModeUI();
  if (!opts.keepEditor) editor.value = readDraft(m);
  clearDrawing();
  fitView();
}

// ---------- runner ----------
function setRunState(s: RunState) {
  runState = s;
  const pause = $<HTMLButtonElement>("pause-btn");
  pause.disabled = !(s === "running" || s === "paused");
  $("pause-label").textContent = s === "paused" ? "Wznów" : "Pauza";
  pause.setAttribute("aria-label", s === "paused" ? "Wznów" : "Pauza");
  document.body.dataset.run = s;
}

function syncViews(segs: Segment[], turtle = exec?.turtle ?? initialTurtle()) {
  for (const v of [v2d, v3d]) {
    if (!v) continue;
    v.segments = segs;
    v.turtle = turtle;
    v.request();
  }
  const p = turtle.pos.map((n) => Math.round(n * 10) / 10);
  const head = Math.round(((Math.atan2(turtle.h[0], turtle.h[1]) * 180) / Math.PI + 360) % 360);
  $("view-info").textContent =
    mode === "2d" ? `x ${p[0]} · y ${p[1]} · kierunek ${head}° · ${turtle.pen ? "pisak w dół" : "pisak w górze"}` : `x ${p[0]} · y ${p[1]} · z ${p[2]} · ${turtle.pen ? "pisak w dół" : "pisak w górze"}`;
}

function clearDrawing() {
  syncViews([], initialTurtle());
  editor.setActiveLine(0);
}

function fitView() {
  const v = view();
  if (v) v.fit();
}

function showError(err: { message: string; line: number; column: number } | null, runtime = false) {
  const box = $("error-box");
  if (!err) {
    box.hidden = true;
    box.innerHTML = "";
    editor.setMarker(null);
    return;
  }
  editor.setMarker(err);
  box.hidden = false;
  box.innerHTML = "";
  const b = document.createElement("button");
  b.type = "button";
  b.className = "err-pos";
  b.textContent = `Linia ${err.line}, kolumna ${err.column}`;
  b.title = "Przejdź do miejsca błędu";
  b.onclick = () => editor.focusAt(err.line, err.column);
  const m = document.createElement("span");
  m.textContent = (runtime ? "Błąd podczas działania: " : "Błąd: ") + err.message + (runtime ? " Rysunek do tego miejsca został zachowany." : " Nic nie zostało narysowane.");
  box.append(b, m);
}

function status(msg: string) {
  $("status").textContent = msg;
}

function stopExec() {
  exec = null;
  setRunState("idle");
  editor.setActiveLine(0);
}

/** Compile the current program. Returns false on a parse error (which is shown). */
function start(): boolean {
  saveDraft();
  const c = compile(editor.value, mode);
  showError(c.error);
  if (!c.exec) {
    exec = null;
    clearDrawing();
    setRunState("idle");
    status("Program ma błąd — popraw go i uruchom ponownie.");
    return false;
  }
  exec = c.exec;
  syncViews(exec.segments, exec.turtle);
  return true;
}

function finish() {
  if (!exec) return;
  setRunState("done");
  syncViews(exec.segments, exec.turtle);
  editor.setActiveLine(0);
  if (exec.error) {
    showError({ message: exec.error.message, line: exec.error.line, column: exec.error.column }, true);
    status(`Zatrzymano na błędzie. Odcinków: ${exec.segments.length}.`);
  } else {
    status(`Gotowe. Odcinków: ${exec.segments.length}, operacji: ${exec.ops}.`);
  }
}

function doRun() {
  if (!start()) return;
  setRunState("running");
  status("Rysuję…");
  if (speed >= 10) {
    exec!.runToEnd();
    finish();
    fitView();
    return;
  }
  fitAfterRun();
  lastTick = performance.now();
  acc = 0;
  requestAnimationFrame(tick);
}

const STEPS_PER_FRAME = [0, 0, 0, 0, 1, 3, 8, 20, 60, 200];
const MS_PER_STEP = [0, 400, 160, 60];
let lastTick = 0;
let acc = 0;

function advance(n: number): boolean {
  if (!exec) return false;
  let ev = null;
  for (let i = 0; i < n; i++) {
    ev = exec.step();
    if (!ev) {
      finish();
      return false;
    }
  }
  if (ev) editor.setActiveLine(ev.line);
  syncViews(exec.segments, exec.turtle);
  return true;
}

function tick(now: number) {
  if (runState !== "running" || !exec) return;
  let n: number;
  if (speed >= 10) n = Infinity;
  else if (speed <= 3) {
    acc += now - lastTick;
    n = Math.floor(acc / MS_PER_STEP[speed]!);
    acc -= n * MS_PER_STEP[speed]!;
  } else n = STEPS_PER_FRAME[speed]!;
  lastTick = now;
  if (n === Infinity) {
    exec.runToEnd();
    finish();
    return;
  }
  if (n > 0 && !advance(n)) return;
  requestAnimationFrame(tick);
}

function doStep() {
  if (runState === "running") {
    setRunState("paused");
  } else if (!exec || runState === "done" || runState === "idle") {
    if (!start()) return;
    setRunState("paused");
  }
  if (advance(1)) status("Krok po kroku: podświetlona linia wykona się w następnym kroku.");
}

function doPause() {
  if (runState === "running") {
    setRunState("paused");
    status("Pauza.");
  } else if (runState === "paused") {
    setRunState("running");
    status("Rysuję…");
    lastTick = performance.now();
    acc = 0;
    requestAnimationFrame(tick);
  }
}

function doReset() {
  stopExec();
  showError(null);
  clearDrawing();
  status("Wyczyszczono. Żółw wrócił na start.");
}

// ---------- loading programs ----------
async function loadProgram(source: string, m: Mode, how: "confirm" | "backup" | "silent", label: string): Promise<boolean> {
  if (challenge) exitChallenge(false);
  saveDraft();
  const current = readDraft(m);
  if (current !== source && !isPristine(current)) {
    if (how === "confirm") {
      const ok = await confirmDialog(`Wczytanie „${label}” zastąpi Twój program w trybie ${m.toUpperCase()}. Poprzednia wersja zostanie zapamiętana i będzie można ją przywrócić.`);
      if (!ok) return false;
    }
    store.set("backup", JSON.stringify({ mode: m, source: current }));
    if (how !== "silent")
      toast(`Wczytano „${label}”. Poprzedni program zapamiętano.`, {
        label: "Przywróć",
        run: () => restoreBackup(),
      });
  }
  stopExec();
  showError(null);
  mode = m;
  store.set("mode", m);
  applyModeUI();
  editor.value = source;
  saveDraft();
  clearDrawing();
  return true;
}

function restoreBackup() {
  const raw = store.get("backup");
  if (!raw) return;
  try {
    const b = JSON.parse(raw) as { mode: Mode; source: string };
    void loadProgram(b.source, b.mode, "silent", "poprzedni program").then(() => toast("Przywrócono poprzedni program."));
  } catch {}
}

// ---------- challenges ----------
function progress(): Record<string, boolean> {
  try {
    return JSON.parse(store.get("progress") ?? "{}");
  } catch {
    return {};
  }
}

function enterChallenge(c: Challenge) {
  saveDraft();
  stopExec();
  showError(null);
  challenge = c;
  mode = c.mode;
  applyModeUI();
  $("challenge-panel").hidden = false;
  $("cp-title").textContent = `Wyzwanie: ${c.title}`;
  $("cp-mode").textContent = c.mode.toUpperCase();
  $("cp-task").textContent = c.task;
  $("cp-hint").textContent = c.hint;
  $("cp-result").textContent = "";
  $("cp-result").className = "cp-result";
  updateChallengeStatus();
  editor.value = store.get(`challenge:${c.id}`) ?? `; ${c.title}\n; ${c.task}\n\n`;
  const ghost = ($<HTMLInputElement>("cp-ghost")).checked ? targetSegments(c) : [];
  v2d.ghost = ghost;
  getV3d()?.setGhost(ghost);
  clearDrawing();
  fitView();
  status("Napisz program i naciśnij „Sprawdź”.");
}

function updateChallengeStatus() {
  if (!challenge) return;
  $("cp-status").textContent = progress()[challenge.id] ? "✓ Ukończone" : "";
}

function exitChallenge(restore = true) {
  if (!challenge) return;
  saveDraft();
  challenge = null;
  $("challenge-panel").hidden = true;
  v2d.ghost = [];
  v3d?.setGhost([]);
  mode = store.get("mode") === "3d" && !v3dError ? "3d" : "2d";
  applyModeUI();
  if (restore) {
    stopExec();
    showError(null);
    editor.value = readDraft(mode);
    clearDrawing();
    fitView();
  }
}

function checkChallenge() {
  if (!challenge) return;
  saveDraft();
  doRunInstant();
  const v = check(challenge, editor.value);
  const r = $("cp-result");
  r.textContent = (v.pass ? "✓ " : "✗ ") + v.reason;
  r.className = "cp-result " + (v.pass ? "ok" : "bad");
  if (v.pass) {
    const p = progress();
    p[challenge.id] = true;
    store.set("progress", JSON.stringify(p));
    updateChallengeStatus();
  }
}

function doRunInstant(): RunResult {
  if (!start()) return { segments: [], error: compile(editor.value, mode).error };
  exec!.runToEnd();
  finish();
  return { segments: exec!.segments, error: exec!.error ? { message: exec!.error.message, line: exec!.error.line, column: exec!.error.column } : null };
}

function previewSVG(segs: Segment[], m: Mode): string {
  const proj = (p: [number, number, number]): [number, number] => (m === "2d" ? [p[0], -p[1]] : [p[0] + p[1] * 0.45, -(p[2] + p[1] * 0.3)]);
  const pts = segs.flatMap((s) => [proj(s.from), proj(s.to)]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const size = Math.max(maxX - minX, maxY - minY, 1);
  const pad = size * 0.1;
  const lines = segs
    .map((s) => {
      const a = proj(s.from);
      const b = proj(s.to);
      return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    })
    .join("");
  return `<svg viewBox="${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><g stroke="currentColor" stroke-width="${size / 40}" stroke-linecap="round">${lines}</g></svg>`;
}

function renderChallenges() {
  const p = progress();
  const done = CHALLENGES.filter((c) => p[c.id]).length;
  const page = $("page-wyzwania");
  page.innerHTML = `
    <div class="page-inner">
      <h1 id="ch-h">Wyzwania</h1>
      <p>Narysuj to, co na obrazku. Program zaczyna się od żółwia w punkcie (0, 0) skierowanego w górę. Sprawdzarka porównuje Twój rysunek ze wzorem (kształt i położenie, z tolerancją 2 jednostek; kolor i grubość nie mają znaczenia).</p>
      <p class="progress-line"><strong>Ukończono ${done} z ${CHALLENGES.length}.</strong> <button type="button" class="btn small ghost" id="reset-progress">Wyzeruj postęp</button></p>
      <ul class="cards">
        ${CHALLENGES.map(
          (c) => `<li class="card ${p[c.id] ? "is-done" : ""}">
            <div class="card-art">${previewSVG(targetSegments(c), c.mode)}</div>
            <div class="card-body">
              <h2>${c.title} <span class="tag">${c.mode.toUpperCase()}</span> ${p[c.id] ? '<span class="done-badge">✓ Ukończone</span>' : ""}</h2>
              <p>${c.task}</p>
              <a class="btn primary" href="#/wyzwanie/${c.id}" ${c.mode === "3d" && v3dError ? 'aria-describedby="ch-no3d"' : ""}>Rozwiąż<span class="sr-only"> wyzwanie ${c.title}</span></a>
            </div>
          </li>`,
        ).join("")}
      </ul>
      ${v3dError ? `<p id="ch-no3d" class="muted">Uwaga: ${v3dError} Wyzwania 3D sprawdzisz, ale bez podglądu.</p>` : ""}
    </div>`;
  $("reset-progress").onclick = async () => {
    if (await confirmDialog("Usunąć zapisany postęp wszystkich wyzwań?", "Wyzeruj")) {
      store.set("progress", "{}");
      renderChallenges();
    }
  };
}

// ---------- reference ----------
function renderReference() {
  const page = $("page-pomoc");
  if (page.dataset.ready) return;
  page.innerHTML = `<div class="page-inner">${referenceHTML()}</div>`;
  page.dataset.ready = "1";
  page.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLElement>("[data-try]");
    if (!b) return;
    const src = decodeURIComponent(b.dataset.try!);
    const m = b.dataset.mode as Mode;
    void loadProgram(src, m, "confirm", "przykład ze ściągi").then((ok) => {
      if (!ok) return;
      location.hash = "#/";
      doRun();
    });
  });
}

// ---------- routing ----------
function showPage(name: "studio" | "wyzwania" | "pomoc") {
  for (const p of ["studio", "wyzwania", "pomoc"]) $(`page-${p}`).hidden = p !== name;
  document.querySelectorAll<HTMLAnchorElement>(".mainnav a").forEach((a) => {
    const active = a.dataset.route === name;
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  document.title = { studio: "Logomocja", wyzwania: "Wyzwania — Logomocja", pomoc: "Ściąga — Logomocja" }[name];
  if (name === "studio") {
    requestAnimationFrame(() => {
      view()?.request();
    });
  }
}

async function route() {
  const h = decodeURI(location.hash.replace(/^#/, "")) || "/";
  const parts = h.split("/").filter(Boolean);
  if (parts[0] === "wyzwania") {
    renderChallenges();
    showPage("wyzwania");
    return;
  }
  if (parts[0] === "pomoc") {
    renderReference();
    showPage("pomoc");
    const sec = parts[1] && document.getElementById(parts[1]);
    if (sec) sec.scrollIntoView();
    else window.scrollTo(0, 0);
    return;
  }
  if (parts[0] === "wyzwanie" && parts[1]) {
    const c = CHALLENGES.find((x) => x.id === parts[1]);
    showPage("studio");
    if (c) {
      if (challenge?.id !== c.id) enterChallenge(c);
    } else location.replace("#/wyzwania");
    return;
  }
  if (parts[0] === "p" && parts[1] && parts[2]) {
    const m: Mode = parts[1] === "3d" ? "3d" : "2d";
    showPage("studio");
    try {
      const src = await decodeProgram(location.hash.split("/").slice(3).join("/"));
      history.replaceState(null, "", location.pathname + location.search + "#/");
      await loadProgram(src, m, "backup", "program z linku");
      doRunInstant();
      fitView();
    } catch {
      history.replaceState(null, "", location.pathname + location.search + "#/");
      toast("Nie udało się odczytać programu z linku.");
    }
    return;
  }
  if (challenge) exitChallenge();
  showPage("studio");
}
window.addEventListener("hashchange", () => void route());

// ---------- files, sharing, export ----------
function download(name: string, blob: Blob) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

async function shareLink() {
  const payload = await encodeProgram(editor.value);
  const url = `${location.origin}${location.pathname}${location.search}#/p/${mode}/${payload}`;
  let copied = false;
  try {
    await navigator.clipboard.writeText(url);
    copied = true;
  } catch {}
  const d = document.createElement("dialog");
  d.className = "share-dialog";
  d.setAttribute("aria-labelledby", "share-h");
  d.innerHTML = `<form method="dialog"><h2 id="share-h">Link do programu</h2>
    <p>${copied ? "Link został skopiowany do schowka." : "Skopiuj link poniżej."} Otwarcie go wczyta i uruchomi ten program w trybie ${mode.toUpperCase()}.</p>
    <label class="sr-only" for="share-url">Link</label>
    <input id="share-url" type="text" readonly />
    <div class="dlg-actions"><button class="btn primary" value="ok">Zamknij</button></div></form>`;
  document.body.append(d);
  const inp = d.querySelector("input")!;
  inp.value = url;
  d.addEventListener("close", () => d.remove());
  d.showModal();
  inp.focus();
  inp.select();
}

// ---------- theme ----------
type ThemePref = "system" | "light" | "dark";
let themePref: ThemePref = (store.get("theme") as ThemePref) || "system";
const mq = matchMedia("(prefers-color-scheme: dark)");
function applyTheme() {
  const dark = themePref === "dark" || (themePref === "system" && mq.matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  const label = { system: "Motyw: systemowy", light: "Motyw: jasny", dark: "Motyw: ciemny" }[themePref];
  $("theme-label").textContent = label.replace("Motyw: ", "");
  $("theme-icon").textContent = { system: "◐", light: "☀", dark: "☾" }[themePref];
  $("theme-btn").setAttribute("aria-label", `${label}. Kliknij, aby zmienić.`);
  v2d.request();
  v3d?.refreshTheme();
}
mq.addEventListener("change", applyTheme);
$("theme-btn").onclick = () => {
  themePref = themePref === "system" ? "light" : themePref === "light" ? "dark" : "system";
  store.set("theme", themePref);
  applyTheme();
};

// ---------- wiring ----------
const exSel = $<HTMLSelectElement>("example-select");
for (const m of ["2d", "3d"] as Mode[]) {
  const g = document.createElement("optgroup");
  g.label = m === "2d" ? "Płaskie (2D)" : "Przestrzenne (3D)";
  for (const e of EXAMPLES.filter((x) => x.mode === m)) {
    const o = document.createElement("option");
    o.value = e.id;
    o.textContent = `${e.title} — ${e.blurb}`;
    g.append(o);
  }
  exSel.append(g);
}
exSel.onchange = async () => {
  const ex = EXAMPLES.find((e) => e.id === exSel.value);
  exSel.value = "";
  if (!ex) return;
  if (location.hash.startsWith("#/wyzwanie")) history.replaceState(null, "", location.pathname + location.search + "#/");
  if (await loadProgram(ex.source, ex.mode, "confirm", ex.title)) {
    doRun();
  }
};

function fitAfterRun() {
  // Fit once the drawing is complete (instant) or now, for animated runs fit to the final drawing.
  if (!exec) return;
  if (runState === "done") return fitView();
  const preview = run(editor.value, mode);
  const v = view();
  if (!v) return;
  const saved = v.segments;
  v.segments = preview.segments;
  v.fit();
  v.segments = saved;
  v.request();
}

$("mode-2d").onclick = () => mode !== "2d" && setMode("2d");
$("mode-3d").onclick = () => {
  if (v3dError) {
    applyModeUI();
    toast(v3dError);
    return;
  }
  if (mode !== "3d") setMode("3d");
};
$("mode-2d").onkeydown = $("mode-3d").onkeydown = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "ArrowUp" || e.key === "ArrowDown") {
    e.preventDefault();
    const next = mode === "2d" ? "3d" : "2d";
    $(`mode-${next}`).focus();
    $(`mode-${next}`).click();
  }
};

$("new-btn").onclick = async () => {
  if (!isPristine(editor.value) && !(await confirmDialog("Zacząć od pustego programu? Obecny program zostanie zapamiętany i będzie można go przywrócić.", "Nowy"))) return;
  if (!isPristine(editor.value)) store.set("backup", JSON.stringify({ mode, source: editor.value }));
  stopExec();
  showError(null);
  editor.value = "";
  saveDraft();
  clearDrawing();
  editor.ta.focus();
  toast("Nowy program.", isPristine(readDraft(mode)) ? undefined : { label: "Przywróć", run: restoreBackup });
};
$("open-btn").onclick = () => $<HTMLInputElement>("file-input").click();
$<HTMLInputElement>("file-input").onchange = async (e) => {
  const input = e.target as HTMLInputElement;
  const f = input.files?.[0];
  input.value = "";
  if (!f) return;
  if (f.size > 200_000) return toast("Plik jest za duży.");
  const text = (await f.text()).replace(/\r\n?/g, "\n");
  if (await loadProgram(text, challenge ? challenge.mode : mode, "confirm", f.name)) {
    toast(`Otwarto plik ${f.name}.`);
    fitView();
  }
};
$("save-btn").onclick = () => {
  const name = challenge ? `wyzwanie-${challenge.id}.logo` : `logomocja-${mode}.logo`;
  download(name, new Blob([editor.value], { type: "text/plain;charset=utf-8" }));
};
$("link-btn").onclick = () => void shareLink();
$("png-btn").onclick = async () => {
  const v = view();
  if (!v) return toast(v3dError ?? "Widok niedostępny.");
  const blob = await v.toBlob();
  if (blob) download(`logomocja-${mode}.png`, blob);
};

$("run-btn").onclick = () => doRun();
$("step-btn").onclick = () => doStep();
$("pause-btn").onclick = () => doPause();
$("reset-btn").onclick = () => doReset();
$("fit-btn").onclick = () => fitView();
$("zoom-in").onclick = () => (mode === "2d" ? v2d.zoom(1.25) : getV3d()?.dolly(0.8));
$("zoom-out").onclick = () => (mode === "2d" ? v2d.zoom(0.8) : getV3d()?.dolly(1.25));

const speedIn = $<HTMLInputElement>("speed");
const SPEED_NAMES = ["", "bardzo wolno", "wolno", "spokojnie", "umiarkowanie", "żwawo", "szybko", "bardzo szybko", "błyskawicznie", "turbo", "natychmiast"];
function applySpeed() {
  speedIn.value = String(speed);
  $("speed-out").textContent = SPEED_NAMES[speed]!;
  speedIn.setAttribute("aria-valuetext", SPEED_NAMES[speed]!);
}
speedIn.oninput = () => {
  speed = Number(speedIn.value);
  store.set("speed", String(speed));
  applySpeed();
};
applySpeed();

$("cp-check").onclick = () => checkChallenge();
$("cp-exit").onclick = () => {
  location.hash = "#/";
};
$<HTMLInputElement>("cp-ghost").onchange = (e) => {
  if (!challenge) return;
  const g = (e.target as HTMLInputElement).checked ? targetSegments(challenge) : [];
  v2d.ghost = g;
  v2d.request();
  v3d?.setGhost(g);
};

editor.onInput = () => {
  saveDraftSoon();
  if (runState === "running" || runState === "paused") {
    stopExec();
    status("Zatrzymano, bo program został zmieniony. Rysunek pozostał — uruchom ponownie, aby zobaczyć zmiany.");
  }
  if (!$("error-box").hidden) showError(null);
};

$("shortcut-list").innerHTML = SHORTCUTS.map((s) => `<dt>${s.keys.map((k) => `<kbd>${k}</kbd>`).join(" lub ")}</dt><dd>${s.label}</dd>`).join("");

document.addEventListener("keydown", (e) => {
  const a = matchShortcut(e);
  if (!a || $("page-studio").hidden || document.querySelector("dialog[open]")) return;
  e.preventDefault();
  ({ run: doRun, step: doStep, pause: doPause, reset: doReset })[a]();
});

// ---------- testing hook ----------
async function openHook(source: string, m: Mode): Promise<RunResult> {
  if (location.hash && location.hash !== "#/" && location.hash !== "#") history.replaceState(null, "", location.pathname + location.search + "#/");
  if (challenge) exitChallenge(false);
  showPage("studio");
  await loadProgram(String(source), m === "3d" ? "3d" : "2d", "silent", "program");
  const res = doRunInstant();
  fitView();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  view()?.request();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return res;
}

declare global {
  interface Window {
    logomocja: { version: string; run: (source: string, mode: Mode) => RunResult; open: (source: string, mode: Mode) => Promise<RunResult> };
  }
}
window.logomocja = {
  version: VERSION,
  run: (source, m) => run(String(source), m === "3d" ? "3d" : "2d"),
  open: openHook,
};

// ---------- boot ----------
applyModeUI();
applyTheme();
editor.value = readDraft(mode);
setRunState("idle");
clearDrawing();
requestAnimationFrame(() => fitView());
status("Napisz program albo wybierz przykład, a potem naciśnij „Uruchom”.");
void route();
