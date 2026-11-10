// Logomocja — sklejenie interfejsu: edytor, wykonanie, widoki, wyzwania, pliki, linki.
import { Machine, LogoError, parse, run, copySegments, type Mode, type RunResult, type Segment } from "./interp/machine";
import { EXAMPLES, findExample } from "./examples";
import { CHALLENGES, check, findChallenge, targetOf, type Challenge } from "./challenges";
import { referenceHTML } from "./reference";
import { Editor, type ErrorMark } from "./ui/editor";
import { View, View2D, View3D, type TurtlePose } from "./ui/view";
import {
  $, esc, store, toast, openDialog, confirmDialog, download, encodeProgram, decodeProgram, thumbSVG, nextPaint,
} from "./ui/support";

const VERSION = "1.0.0";

type Status = "idle" | "running" | "paused" | "done" | "error";
type Context = { kind: "free" } | { kind: "challenge"; ch: Challenge };

// ---------------------------------------------------------------- stan

let mode: Mode = store.get("mode") === "3d" ? "3d" : "2d";
let ctx: Context = { kind: "free" };
let machine: Machine | null = null;
let status: Status = "idle";
let autoFit = true;
let rafId = 0;
let lastT = 0;
let acc = 0;
let saveTimer = 0;
let liveTimer = 0;
/** Treść uznawana za „bezpieczną” (wczytaną z pliku, przykładu lub zapisaną) — osobno dla trybów. */
const clean: Record<Mode, string | null> = { "2d": null, "3d": null };
let done = new Set<string>((store.get("done") ?? "").split(",").filter(Boolean));

const editor = new Editor($("editor"), "Program w języku Logo");
const views: Partial<Record<Mode, View>> = {};
let viewProblem = "";
try {
  views["2d"] = new View2D($<HTMLCanvasElement>("canvas-2d"));
  views["3d"] = new View3D($<HTMLCanvasElement>("canvas-3d"));
} catch (e) {
  viewProblem = "Rysunek jest niedostępny: ta przeglądarka nie udostępnia kanwy (canvas). Programy nadal można pisać i sprawdzać.";
}
for (const v of Object.values(views)) v!.onUserMove = () => { autoFit = false; };
const view = (): View | undefined => views[mode];

const SPEEDS = [1, 2, 4, 8, 16, 32, 64, 160, 600, Infinity];
const SPEED_NAMES = ["bardzo wolno", "wolno", "wolno", "spokojnie", "spokojnie", "żwawo", "szybko", "szybko", "bardzo szybko", "od razu"];
const speedInput = $<HTMLInputElement>("speed");
const cps = () => SPEEDS[Math.min(9, Math.max(0, Number(speedInput.value) - 1))];

const SHORTCUTS = `
  <dl class="keys">
    <div><dt><kbd>Ctrl</kbd> + <kbd>Enter</kbd></dt><dd>Uruchom program (lub wznów po pauzie)</dd></div>
    <div><dt><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Enter</kbd></dt><dd>Krok: wykonaj jedno polecenie</dd></div>
    <div><dt><kbd>Ctrl</kbd> + <kbd>.</kbd></dt><dd>Pauza / wznów</dd></div>
    <div><dt><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Backspace</kbd></dt><dd>Reset: wyczyść rysunek, żółw wraca na start</dd></div>
    <div><dt><kbd>←</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>→</kbd></dt><dd>Na rysunku: przesuwanie (2D) lub obrót kamery (3D; z <kbd>Shift</kbd> przesuwanie)</dd></div>
    <div><dt><kbd>+</kbd> <kbd>−</kbd> <kbd>0</kbd></dt><dd>Na rysunku: powiększ, pomniejsz, dopasuj widok</dd></div>
    <div><dt><kbd>Esc</kbd></dt><dd>Zamknij okno dialogowe</dd></div>
  </dl>
  <p class="muted">Na Macu zamiast <kbd>Ctrl</kbd> użyj <kbd>⌘</kbd>. Mysz: przeciągnij, aby przesunąć (2D) lub obrócić (3D); kółko przybliża; w 3D przeciąganie z <kbd>Shift</kbd> lub prawym przyciskiem przesuwa kamerę. Na ekranie dotykowym: jeden palec obraca lub przesuwa, dwa palce przybliżają.</p>`;

// ---------------------------------------------------------------- scena

function ghost(): Segment[] | null {
  return ctx.kind === "challenge" ? targetOf(ctx.ch) : null;
}

function pose(): TurtlePose {
  const m = machine;
  if (!m) return { pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], pen: true, color: "#16866a" };
  return { pos: m.pos, h: m.h, r: m.r, u: m.u, pen: m.pen, color: m.color };
}

let shown: Segment[] = [];
function refresh(): void {
  if (machine) shown = machine.segments;
  view()?.setScene({ segments: shown, turtle: pose(), ghost: ghost() });
  const run = status === "running" || status === "paused";
  editor.setExecLine(run && machine?.next ? machine.next.line : 0);
  const p = pose();
  const n = (v: number) => String(Math.round(v * 10) / 10 + 0);
  let text = `x ${n(p.pos[0])}  y ${n(p.pos[1])}`;
  if (mode === "3d") text += `  z ${n(p.pos[2])}`;
  else text += `  kurs ${n(((Math.atan2(p.h[0], p.h[1]) * 180) / Math.PI + 360) % 360)}°`;
  $("readout").textContent = `${text}  ·  pióro ${p.pen ? "opuszczone" : "podniesione"}`;
}

function setStatus(s: Status, text: string): void {
  status = s;
  const el = $("status");
  el.textContent = text;
  el.dataset.state = s;
  const pause = $<HTMLButtonElement>("btn-pause");
  pause.disabled = !(s === "running" || s === "paused");
  $("pause-label").textContent = s === "paused" ? "Wznów" : "Pauza";
  document.body.dataset.run = s;
}

function showError(e: { message: string; line: number; column: number; offset?: number; length?: number } | null, kind = "", reveal = false): void {
  const panel = $("error-panel");
  if (!e) {
    panel.textContent = "";
    panel.hidden = true;
    editor.setError(null);
    return;
  }
  panel.hidden = false;
  panel.innerHTML = `<strong>${esc(kind || "Błąd")} — wiersz ${e.line}, kolumna ${e.column}:</strong> ${esc(e.message)}`;
  const mark: ErrorMark = { offset: e.offset ?? 0, length: e.length ?? 1, line: e.line, column: e.column, message: e.message };
  editor.setError(mark, reveal);
}

// ---------------------------------------------------------------- wykonanie

function stopLoop(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
}

function fitTo(segs: Segment[]): void {
  const v = view();
  if (!v) return;
  v.resize();
  v.scene = { segments: segs, turtle: null, ghost: ghost() };
  v.fit();
}

/** Analizuje program i przygotowuje maszynę. Przy błędzie zapisu nic nie rysuje. */
function prepare(): boolean {
  stopLoop();
  clearTimeout(liveTimer);
  const src = editor.value;
  try {
    const program = parse(src, mode);
    machine = new Machine(program);
  } catch (e) {
    if (!(e instanceof LogoError)) throw e;
    machine = null;
    shown = [];
    setStatus("error", "Błąd w programie — nic nie narysowano.");
    showError(e, "Błąd zapisu", true);
    refresh();
    return false;
  }
  showError(null);
  shown = machine.segments;
  if (autoFit) {
    const dry = run(src, mode);
    fitTo(dry.segments);
  }
  return true;
}

function finish(): void {
  stopLoop();
  const m = machine!;
  if (m.error) {
    setStatus("error", `Zatrzymano z błędem. Narysowano ${plural(m.segments.length)}.`);
    showError(m.error, "Błąd wykonania", true);
  } else {
    setStatus("done", `Gotowe: ${plural(m.segments.length)}, ${form(m.ops, "operacja", "operacje", "operacji")}.`);
  }
  refresh();
  if (ctx.kind === "challenge" && !m.error) verdict(ctx.ch, false);
}

function form(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10, m100 = n % 100;
  if (n === 1) return `${n} ${one}`;
  if (m10 >= 2 && m10 <= 4 && !(m100 >= 12 && m100 <= 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}
const plural = (n: number) => form(n, "odcinek", "odcinki", "odcinków");

function frame(t: number): void {
  rafId = 0;
  if (status !== "running" || !machine) return;
  const dt = Math.min(100, t - lastT);
  lastT = t;
  acc += (dt / 1000) * cps();
  const t0 = performance.now();
  let n = 0;
  while (acc >= 1 && !machine.done) {
    machine.step();
    acc -= 1;
    if (++n % 64 === 0 && performance.now() - t0 > 10) { acc = 0; break; }
  }
  if (machine.done) { finish(); return; }
  refresh();
  rafId = requestAnimationFrame(frame);
}

function loop(): void {
  if (!machine) return;
  if (cps() === Infinity) { machine.runToEnd(); finish(); return; }
  setStatus("running", "Żółw rysuje…");
  if (machine.done) { finish(); return; }
  acc = 1;
  lastT = performance.now();
  refresh();
  stopLoop();
  rafId = requestAnimationFrame(frame);
}

function actionRun(): void {
  if (status === "paused" && machine && !machine.done) { loop(); return; }
  if (prepare()) loop();
}

function actionStep(): void {
  stopLoop();
  if (!machine || machine.done || status === "idle" || status === "done" || status === "error") {
    if (!prepare()) return;
    if (machine!.done) { finish(); return; }
  } else {
    machine.step();
    if (machine.done) { finish(); return; }
  }
  const tk = machine!.next!;
  setStatus("paused", `Krok — następne: „${tk.s}” w wierszu ${tk.line}.`);
  refresh();
}

function actionPause(): void {
  if (status === "running") {
    stopLoop();
    setStatus("paused", machine?.next ? `Pauza przed wierszem ${machine.next.line}.` : "Pauza.");
    refresh();
  } else if (status === "paused") loop();
}

function actionReset(): void {
  stopLoop();
  machine = null;
  shown = [];
  setStatus("idle", "Gotowy.");
  $("ch-result").textContent = "";
  $("ch-result").className = "challenge-result";
  refresh();
  liveCheck();
}

/** Wykonuje cały program od razu, bez animacji. */
function runInstant(): RunResult {
  if (!prepare()) {
    const r = run(editor.value, mode);
    return { segments: [], error: r.error };
  }
  const m = machine!;
  m.runToEnd();
  finish();
  return {
    segments: copySegments(m.segments),
    error: m.error ? { message: m.error.message, line: m.error.line, column: m.error.column } : null,
  };
}

// ---------------------------------------------------------------- dokumenty i tryby

const draftKey = (): string => (ctx.kind === "challenge" ? `challenge:${ctx.ch.id}` : `draft:${mode}`);

function saveNow(): void {
  clearTimeout(saveTimer);
  saveTimer = 0;
  store.set(draftKey(), editor.value);
}

function liveCheck(): void {
  clearTimeout(liveTimer);
  liveTimer = window.setTimeout(() => {
    if (status === "running" || status === "paused") return;
    try {
      parse(editor.value, mode);
      if (!(machine && machine.error)) showError(null);
    } catch (e) {
      if (e instanceof LogoError) showError(e, "Błąd zapisu");
    }
  }, 350);
}

editor.onChange = () => {
  if (!saveTimer) saveTimer = window.setTimeout(saveNow, 300);
  if (status === "running" || status === "paused") {
    // Program zmienił się w trakcie działania: zatrzymujemy żółwia, rysunek zostaje.
    stopLoop();
    machine = null;
    setStatus("idle", "Program zmieniony — zatrzymano. Uruchom ponownie, aby zobaczyć nową wersję.");
    refresh();
  } else if (machine?.error) {
    machine.error = null;
  }
  liveCheck();
};

function defaultDraft(m: Mode): string {
  return findExample(m === "2d" ? "kwadrat" : "schody")!.source;
}

function isDirty(text: string, m: Mode): boolean {
  const t = text.trim();
  if (!t) return false;
  if (clean[m] !== null && clean[m]!.trim() === t) return false;
  return !EXAMPLES.some((e) => e.source.trim() === t);
}

function applyMode(): void {
  const c2 = $<HTMLCanvasElement>("canvas-2d"), c3 = $<HTMLCanvasElement>("canvas-3d");
  c2.hidden = mode !== "2d";
  c3.hidden = mode !== "3d";
  for (const r of document.querySelectorAll<HTMLInputElement>('input[name="mode"]')) r.checked = r.value === mode;
  document.body.dataset.mode = mode;
  const off = $("stage-off");
  off.hidden = !viewProblem;
  off.textContent = viewProblem;
  $("view-hint").textContent = mode === "2d"
    ? "Przeciągnij, aby przesunąć · kółko lub dwa palce: powiększenie"
    : "Przeciągnij, aby obrócić · Shift lub dwa palce: przesuwanie · kółko: przybliżenie";
  view()?.resize();
}

/** Wczytuje treść bieżącego kontekstu do edytora i zeruje wykonanie. */
function loadContext(): void {
  stopLoop();
  machine = null;
  shown = [];
  let text: string;
  if (ctx.kind === "challenge") {
    mode = ctx.ch.mode;
    text = store.get(draftKey()) ?? ctx.ch.starter;
  } else {
    text = store.get(draftKey()) ?? defaultDraft(mode);
  }
  editor.setValue(text);
  showError(null);
  applyMode();
  setStatus("idle", "Gotowy.");
  const bar = $("challenge-bar");
  bar.hidden = ctx.kind !== "challenge";
  $("mode-switch").hidden = ctx.kind === "challenge";
  $("mode-fixed").hidden = ctx.kind !== "challenge";
  $("btn-examples").hidden = ctx.kind === "challenge";
  $("btn-open").hidden = ctx.kind === "challenge";
  if (ctx.kind === "challenge") {
    const ch = ctx.ch;
    $("mode-fixed").textContent = `Tryb ${ch.mode.toUpperCase()}`;
    $("ch-title").textContent = ch.title;
    $("ch-task").textContent = ch.task;
    $("ch-hint").textContent = ch.hint;
    $("ch-badge").textContent = done.has(ch.id) ? "Wyzwanie ✓ zaliczone" : "Wyzwanie";
    $("ch-result").textContent = "";
    $("ch-result").className = "challenge-result";
    bar.querySelector("details")!.open = false;
  }
  autoFit = true;
  const v = view();
  if (v) {
    v.reset();
    if (ctx.kind === "challenge") fitTo([]);
  }
  refresh();
  liveCheck();
}

function setFree(m: Mode): void {
  if (ctx.kind === "free" && m === mode && !$("page-studio").hidden) return;
  saveNow();
  ctx = { kind: "free" };
  mode = m;
  store.set("mode", m);
  loadContext();
}

/** Zastępuje program w edytorze; poprzedni szkic trafia do kopii, którą można przywrócić. */
function replaceProgram(text: string, m: Mode, what: string, markClean = true): void {
  saveNow();
  if (ctx.kind !== "free" || m !== mode) {
    ctx = { kind: "free" };
    mode = m;
    store.set("mode", m);
  }
  const prev = store.get(draftKey());
  const hadDirty = prev !== null && prev !== text && isDirty(prev, m);
  if (hadDirty) store.set(`backup:${m}`, prev!);
  store.set(draftKey(), text);
  if (markClean) clean[m] = text;
  loadContext();
  if (hadDirty) {
    toast(`${what} Poprzedni szkic ${m.toUpperCase()} zachowano w kopii.`, {
      label: "Przywróć szkic",
      run: () => {
        const b = store.get(`backup:${m}`);
        if (b === null) return;
        replaceProgram(b, m, "Przywrócono szkic.", false);
        if (location.hash !== "#/") location.hash = "#/";
      },
    });
  }
}

async function loadExample(id: string, ask: boolean): Promise<void> {
  const ex = findExample(id);
  if (!ex) { toast(`Nie ma przykładu o nazwie „${id}”.`); return; }
  const current = ctx.kind === "free" && mode === ex.mode ? editor.value : store.get(`draft:${ex.mode}`) ?? "";
  if (ask && current !== ex.source && isDirty(current, ex.mode)) {
    const ok = await confirmDialog(
      "Zastąpić szkic przykładem?",
      `W trybie ${ex.mode.toUpperCase()} masz własny, niezapisany program. Wczytanie przykładu „${ex.title}” go zastąpi (kopię będzie można przywrócić).`,
      "Wczytaj przykład",
    );
    if (!ok) return;
  }
  replaceProgram(ex.source, ex.mode, `Wczytano przykład „${ex.title}”.`);
  if (location.hash !== "#/") history.replaceState(null, "", "#/");
  showPage("studio");
  runInstant();
  view()?.fit();
}

// ---------------------------------------------------------------- wyzwania

function saveDone(): void {
  store.set("done", [...done].join(","));
  $("nav-count").textContent = `${done.size}/${CHALLENGES.length}`;
}

function verdict(ch: Challenge, rerun: boolean): void {
  const src = editor.value;
  if (rerun) {
    const r = runInstant();
    if (r.error) {
      const el = $("ch-result");
      el.className = "challenge-result is-fail";
      el.textContent = "✗ Program ma błąd — popraw go i spróbuj ponownie.";
      return;
    }
    return; // finish() wywołało już ocenę
  }
  const v = check(ch, src);
  const el = $("ch-result");
  el.className = `challenge-result ${v.pass ? "is-pass" : "is-fail"}`;
  el.textContent = `${v.pass ? "✓" : "✗"} ${v.reason}`;
  if (v.pass) {
    if (!done.has(ch.id)) { done.add(ch.id); saveDone(); }
    $("ch-badge").textContent = "Wyzwanie ✓ zaliczone";
    const next = CHALLENGES.find((c) => !done.has(c.id));
    const a = document.createElement("a");
    a.className = "btn btn-small";
    a.href = next ? `#/wyzwania/${next.id}` : "#/wyzwania";
    a.textContent = next ? `Następne: ${next.title} →` : "Wszystkie wyzwania zaliczone! →";
    el.append(" ", a);
  }
}

function renderChallenges(): void {
  const page = $("page-challenges");
  const cards = CHALLENGES.map((ch) => {
    const ok = done.has(ch.id);
    return `<li class="card ${ok ? "is-done" : ""}">
      <a class="card-link" href="#/wyzwania/${ch.id}">
        <span class="thumb-wrap">${thumbSVG(targetOf(ch), ch.mode, `Wzór: ${ch.title}`)}</span>
        <span class="card-body">
          <span class="card-title">${esc(ch.title)} <span class="badge">${ch.mode.toUpperCase()}</span>${ok ? ' <span class="badge badge-ok">✓ zaliczone</span>' : ""}</span>
          <span class="card-text">${esc(ch.task)}</span>
          <span class="card-meta" aria-label="Poziom ${ch.level} z 3">${"●".repeat(ch.level)}${"○".repeat(3 - ch.level)} <span aria-hidden="true">poziom ${ch.level}</span></span>
        </span>
      </a></li>`;
  }).join("");
  page.innerHTML = `<div class="page-inner">
    <h2>Wyzwania</h2>
    <p class="lead">Każde wyzwanie pokazuje wzór. Napisz program, który narysuje taki sam kształt — żółw sprawdzi go automatycznie.
    Liczy się kształt i wielkość; kolor, grubość, kolejność kresek, położenie i obrót o 90° nie mają znaczenia.</p>
    <p class="progress" role="status"><strong>Postęp: ${done.size} z ${CHALLENGES.length}.</strong>
      <span class="bar" aria-hidden="true"><span style="width:${(done.size / CHALLENGES.length) * 100}%"></span></span>
      ${done.size ? '<button type="button" class="btn btn-small" id="ch-clear">Wyzeruj postęp</button>' : ""}</p>
    <ul class="cards">${cards}</ul></div>`;
  page.querySelector("#ch-clear")?.addEventListener("click", async () => {
    if (await confirmDialog("Wyzerować postęp?", "Zaliczenia wyzwań zostaną usunięte. Twoje programy zostaną.", "Wyzeruj")) {
      done = new Set();
      saveDone();
      renderChallenges();
    }
  });
}

// ---------------------------------------------------------------- strony i trasy

type PageName = "studio" | "challenges" | "reference";
let referenceReady = false;

function showPage(name: PageName): void {
  for (const p of ["studio", "challenges", "reference"] as PageName[]) $(`page-${p}`).hidden = p !== name;
  for (const a of document.querySelectorAll<HTMLAnchorElement>("[data-nav]")) {
    if (a.dataset.nav === name) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
  document.body.dataset.page = name;
  document.title = { studio: "Logomocja — pracownia", challenges: "Wyzwania — Logomocja", reference: "Polecenia — Logomocja" }[name];
  if (name === "studio") view()?.resize();
  else if (status === "running") actionPause();
}

function route(): void {
  const parts = location.hash.replace(/^#\/?/, "").split("/").map((s) => { try { return decodeURIComponent(s); } catch { return s; } });
  const head = parts[0] ?? "";
  if (head === "wyzwania") {
    const ch = parts[1] ? findChallenge(parts[1]) : undefined;
    if (ch) {
      if (!(ctx.kind === "challenge" && ctx.ch.id === ch.id)) {
        saveNow();
        ctx = { kind: "challenge", ch };
        loadContext();
      }
      showPage("studio");
      fitTo([]);
      refresh();
      return;
    }
    saveNow();
    renderChallenges();
    showPage("challenges");
    return;
  }
  if (head === "polecenia") {
    saveNow();
    if (!referenceReady) {
      $("page-reference").innerHTML = referenceHTML(SHORTCUTS);
      referenceReady = true;
    }
    showPage("reference");
    const target = parts[1] ? document.getElementById(parts[1]) : null;
    if (target) target.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
    return;
  }
  if (head === "p" && (parts[1] === "2d" || parts[1] === "3d") && parts[2]) {
    const src = decodeProgram(parts[2]);
    history.replaceState(null, "", "#/");
    if (src === null) {
      toast("Ten link jest uszkodzony — nie udało się odczytać programu.");
    } else {
      replaceProgram(src, parts[1], "Wczytano program z linku.");
      showPage("studio");
      runInstant();
      view()?.fit();
      return;
    }
  }
  if (head === "przyklady" && parts[1]) {
    void loadExample(parts[1], false);
    return;
  }
  if (ctx.kind !== "free" || $("page-studio").hidden) {
    const wasChallenge = ctx.kind !== "free";
    if (wasChallenge) {
      saveNow();
      ctx = { kind: "free" };
      mode = store.get("mode") === "3d" ? "3d" : "2d";
      loadContext();
    }
  }
  showPage("studio");
}

// ---------------------------------------------------------------- przyciski

$("btn-run").addEventListener("click", actionRun);
$("btn-step").addEventListener("click", actionStep);
$("btn-pause").addEventListener("click", actionPause);
$("btn-reset").addEventListener("click", actionReset);

const speedOut = () => {
  const i = Number(speedInput.value) - 1;
  $("speed-out").textContent = SPEED_NAMES[i];
  speedInput.setAttribute("aria-valuetext", SPEED_NAMES[i]);
};
speedInput.value = store.get("speed") ?? "6";
speedOut();
speedInput.addEventListener("input", () => { store.set("speed", speedInput.value); speedOut(); });

for (const r of document.querySelectorAll<HTMLInputElement>('input[name="mode"]')) {
  r.addEventListener("change", () => { if (r.checked) setFree(r.value as Mode); });
}

$("v-in").addEventListener("click", () => { view()?.zoomBy(1.3); autoFit = false; });
$("v-out").addEventListener("click", () => { view()?.zoomBy(1 / 1.3); autoFit = false; });
$("v-fit").addEventListener("click", () => { view()?.fit(); autoFit = true; });
$("v-reset").addEventListener("click", () => { view()?.reset(); autoFit = false; });
$("v-png").addEventListener("click", async () => {
  const v = view();
  if (!v) { toast(viewProblem); return; }
  const blob = await v.toBlob();
  if (blob) download(`logomocja-${ctx.kind === "challenge" ? ctx.ch.id : mode}.png`, blob);
  else toast("Nie udało się zapisać obrazu.");
});

$("btn-examples").addEventListener("click", () => {
  const list = $("examples-list");
  if (!list.childElementCount) {
    list.innerHTML = EXAMPLES.map((ex) => `<button type="button" class="card card-btn" data-example="${ex.id}">
      <span class="thumb-wrap">${thumbSVG(run(ex.source, ex.mode).segments, ex.mode, "")}</span>
      <span class="card-body"><span class="card-title">${esc(ex.title)} <span class="badge">${ex.mode.toUpperCase()}</span></span>
      <span class="card-text">${esc(ex.blurb)}</span><span class="card-meta"><code>${ex.id}</code></span></span></button>`).join("");
    list.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-example]");
      if (!b) return;
      $<HTMLDialogElement>("dlg-examples").close();
      void loadExample(b.dataset.example!, true);
    });
  }
  openDialog($<HTMLDialogElement>("dlg-examples"));
});

$("btn-save").addEventListener("click", () => {
  saveNow();
  const name = ctx.kind === "challenge" ? ctx.ch.id : `program-${mode}`;
  download(`${name}.logo`, new Blob([editor.value], { type: "text/plain;charset=utf-8" }));
  if (ctx.kind === "free") clean[mode] = editor.value;
});

const fileInput = $<HTMLInputElement>("file-input");
$("btn-open").addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  fileInput.value = "";
  if (!file) return;
  if (file.size > 400000) { toast("Ten plik jest za duży jak na program Logo (limit to 50 000 znaków)."); return; }
  const text = (await file.text()).replace(/^﻿/, "").replace(/\r\n?/g, "\n");
  // Tryb: jeśli program nie przechodzi w bieżącym, a przechodzi w drugim — przełączamy.
  let m: Mode = mode;
  const other: Mode = mode === "2d" ? "3d" : "2d";
  const fails = (md: Mode) => { try { parse(text, md); return false; } catch { return true; } };
  if (fails(m) && !fails(other)) m = other;
  const current = m === mode ? editor.value : store.get(`draft:${m}`) ?? "";
  if (current !== text && isDirty(current, m)) {
    const ok = await confirmDialog("Zastąpić szkic plikiem?", `W trybie ${m.toUpperCase()} masz własny, niezapisany program. Otwarcie pliku „${file.name}” go zastąpi (kopię będzie można przywrócić).`, "Otwórz plik");
    if (!ok) return;
  }
  replaceProgram(text, m, `Otwarto plik „${file.name}”.`);
  toast(`Otwarto „${file.name}” w trybie ${m.toUpperCase()}.`, undefined, 4000);
});

$("btn-share").addEventListener("click", () => {
  saveNow();
  const url = `${location.origin}${location.pathname}${location.search}#/p/${mode}/${encodeProgram(editor.value)}`;
  $<HTMLInputElement>("share-url").value = url;
  $("share-note").textContent = url.length > 8000 ? "Uwaga: link jest bardzo długi — niektóre komunikatory mogą go uciąć." : "";
  openDialog($<HTMLDialogElement>("dlg-share"));
  $<HTMLInputElement>("share-url").select();
});
$("share-copy").addEventListener("click", async () => {
  const input = $<HTMLInputElement>("share-url");
  let ok = false;
  try { await navigator.clipboard.writeText(input.value); ok = true; } catch {
    input.select();
    try { ok = document.execCommand("copy"); } catch { ok = false; }
  }
  $("share-note").textContent = ok ? "Skopiowano do schowka." : "Nie udało się skopiować — zaznacz link i skopiuj ręcznie.";
});

$("shortcuts-body").innerHTML = SHORTCUTS;
$("btn-shortcuts").addEventListener("click", () => openDialog($<HTMLDialogElement>("dlg-shortcuts")));

$("ch-check").addEventListener("click", () => { if (ctx.kind === "challenge") verdict(ctx.ch, true); });

$("page-reference").addEventListener("click", (e) => {
  const b = (e.target as HTMLElement).closest<HTMLElement>("[data-try]");
  if (!b) return;
  const src = b.dataset.try!, m = (b.dataset.mode === "3d" ? "3d" : "2d") as Mode;
  void (async () => {
    const current = store.get(`draft:${m}`) ?? "";
    if (current !== src && isDirty(current, m)) {
      const ok = await confirmDialog("Zastąpić szkic tym przykładem?", `W trybie ${m.toUpperCase()} masz własny, niezapisany program. Zostanie zastąpiony (kopię będzie można przywrócić).`, "Wypróbuj");
      if (!ok) return;
    }
    replaceProgram(src, m, "Wczytano przykład z opisu poleceń.");
    location.hash = "#/";
    showPage("studio");
    runInstant();
    view()?.fit();
  })();
});

// dialogi: kliknięcie w tło zamyka
for (const d of document.querySelectorAll<HTMLDialogElement>("dialog")) {
  d.addEventListener("click", (e) => { if (e.target === d) d.close("cancel"); });
}

$("skip-link").addEventListener("click", (e) => { e.preventDefault(); $("main").focus(); });

// ---------------------------------------------------------------- motyw

const THEMES = ["auto", "light", "dark"] as const;
const THEME_NAMES = { auto: "auto", light: "jasny", dark: "ciemny" };
function themeNow(): (typeof THEMES)[number] {
  const t = store.get("theme");
  return t === "light" || t === "dark" ? t : "auto";
}
function applyTheme(): void {
  const t = themeNow();
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  $("theme-label").textContent = `Motyw: ${THEME_NAMES[t]}`;
  $("btn-theme").setAttribute("aria-label", `Motyw: ${THEME_NAMES[t]}. Zmień motyw`);
  view()?.invalidate();
}
$("btn-theme").addEventListener("click", () => {
  const next = THEMES[(THEMES.indexOf(themeNow()) + 1) % THEMES.length];
  if (next === "auto") store.del("theme"); else store.set("theme", next);
  applyTheme();
});
window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => view()?.invalidate());

// ---------------------------------------------------------------- skróty

window.addEventListener("keydown", (e) => {
  const mod = e.ctrlKey || e.metaKey;
  if (!mod || e.altKey) return;
  if (document.querySelector("dialog[open]") || $("page-studio").hidden) return;
  if (e.key === "Enter") {
    e.preventDefault();
    if (e.shiftKey) actionStep(); else actionRun();
  } else if (e.key === "." && !e.shiftKey) {
    e.preventDefault();
    actionPause();
  } else if (e.key === "Backspace" && e.shiftKey) {
    e.preventDefault();
    actionReset();
  }
}, true);

// ---------------------------------------------------------------- start

if (typeof ResizeObserver !== "undefined") new ResizeObserver(() => view()?.resize()).observe($("stage"));
window.addEventListener("resize", () => view()?.resize());
window.addEventListener("pagehide", saveNow);
document.addEventListener("visibilitychange", () => { if (document.hidden) saveNow(); });
window.addEventListener("hashchange", route);

saveDone();
applyTheme();
loadContext();
route();

const api = {
  version: VERSION,
  run(source: string, m: Mode): RunResult {
    return run(source, m);
  },
  async open(source: string, m: Mode): Promise<RunResult> {
    const md: Mode = m === "3d" ? "3d" : "2d";
    const text = typeof source === "string" ? source : String(source ?? "");
    for (const d of document.querySelectorAll<HTMLDialogElement>("dialog[open]")) d.close("cancel");
    saveNow();
    if (ctx.kind !== "free" || md !== mode) { ctx = { kind: "free" }; mode = md; store.set("mode", md); }
    const prev = store.get(draftKey());
    if (prev !== null && prev !== text && isDirty(prev, md)) store.set(`backup:${md}`, prev);
    store.set(draftKey(), text);
    if (location.hash !== "#/" && location.hash !== "") history.replaceState(null, "", "#/");
    loadContext();
    showPage("studio");
    autoFit = true;
    const res = runInstant();
    const v = view();
    if (v) { v.resize(); v.fit(); v.render(); }
    await nextPaint();
    view()?.render();
    return res;
  },
  examples: EXAMPLES.map((e) => ({ id: e.id, title: e.title, mode: e.mode })),
};
(window as unknown as { logomocja: typeof api }).logomocja = api;
