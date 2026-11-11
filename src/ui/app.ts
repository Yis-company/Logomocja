import { challengeById } from "../core/challenges";
import { exampleById } from "../core/examples";
import { run, type Mode, type RunResult } from "../core/interp";
import { ICON } from "./icons";
import { challengesPage, examplesPage, notFoundPage, referencePage } from "./pages";
import { decodeSource } from "./share";
import { load, save } from "./store";
import { Studio } from "./studio";

declare const __VERSION__: string;

type Theme = "light" | "dark";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const systemTheme = (): Theme => (media.matches ? "dark" : "light");

const NAV: [string, string][] = [
  ["#/", "Pracownia"],
  ["#/przyklady", "Przykłady"],
  ["#/zadania", "Zadania"],
  ["#/polecenia", "Polecenia"],
];

document.body.innerHTML = `
  <a class="skip" href="#main">Przejdź do treści</a>
  <header class="top">
    <a class="brand" href="#/" aria-label="Logomocja, pracownia">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false"><path d="M12 2.5 20 20l-8-4.5L4 20z" fill="currentColor"/></svg>
      <span>Logomocja</span>
    </a>
    <nav class="nav" aria-label="Główna">
      ${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join("")}
    </nav>
    <button class="top-btn" id="theme" type="button">${ICON.theme}<span class="vh"></span></button>
  </header>
  <main id="main" tabindex="-1">
    <div id="studio" class="studio"></div>
    <div id="page" hidden></div>
  </main>
  <dialog class="dlg" id="confirm" aria-labelledby="confirm-title" aria-describedby="confirm-body">
    <form method="dialog">
      <h2 id="confirm-title"></h2>
      <p id="confirm-body"></p>
      <div class="dlg-actions">
        <button class="btn" value="no" id="confirm-no"></button>
        <button class="btn btn-primary" value="yes" id="confirm-yes"></button>
      </div>
    </form>
  </dialog>
  <dialog class="dlg" id="link" aria-labelledby="link-title">
    <form method="dialog">
      <h2 id="link-title">Link do programu</h2>
      <p>Ten adres zawiera cały program i tryb rysowania. Kto go otworzy, zobaczy gotowy rysunek. Nic nie jest wysyłane na żaden serwer.</p>
      <label class="field"><span>Adres</span><input id="link-url" type="text" readonly spellcheck="false"></label>
      <p class="dlg-note" id="link-note" role="status"></p>
      <div class="dlg-actions">
        <button class="btn" value="close">Zamknij</button>
        <button class="btn btn-primary" type="button" id="link-copy">${ICON.link}<span>Kopiuj adres</span></button>
      </div>
    </form>
  </dialog>`;

const $ = <T extends HTMLElement = HTMLElement>(sel: string) => document.querySelector<T>(sel)!;
const studioEl = $("#studio");
const pageEl = $("#page");

// ---------------------------------------------------------------- motyw

function applyTheme() {
  const pref = load<string>("motyw", "auto");
  const theme: Theme = pref === "dark" || pref === "light" ? pref : systemTheme();
  document.documentElement.dataset.theme = theme;
  const btn = $("#theme");
  const label = theme === "dark" ? "Włącz jasny motyw" : "Włącz ciemny motyw";
  btn.querySelector(".vh")!.textContent = label;
  btn.title = `${label}${pref === "auto" ? " (teraz: jak w systemie)" : ""}`;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", getComputedStyle(document.documentElement).getPropertyValue("--shell").trim());
  studio?.themeChanged();
}

// ---------------------------------------------------------------- okna

function confirmDialog(title: string, body: string, yes: string, no: string): Promise<boolean> {
  const d = $<HTMLDialogElement>("#confirm");
  $("#confirm-title").textContent = title;
  $("#confirm-body").textContent = body;
  $("#confirm-yes").textContent = yes;
  $("#confirm-no").textContent = no;
  d.returnValue = "no";
  d.showModal();
  $("#confirm-no").focus();
  return new Promise((resolve) => {
    d.addEventListener("close", () => resolve(d.returnValue === "yes"), { once: true });
  });
}

function showLink(url: string) {
  const d = $<HTMLDialogElement>("#link");
  const input = $<HTMLInputElement>("#link-url");
  input.value = url;
  $("#link-note").textContent = url.length > 8000 ? "Ten adres jest bardzo długi. Niektóre komunikatory mogą go uciąć: w razie kłopotów pobierz plik .logo." : "";
  d.showModal();
  input.focus();
  input.select();
}

$("#link-copy").addEventListener("click", async () => {
  const input = $<HTMLInputElement>("#link-url");
  let ok = false;
  try {
    await navigator.clipboard.writeText(input.value);
    ok = true;
  } catch {
    input.focus();
    input.select();
    try { ok = document.execCommand("copy"); } catch { ok = false; }
  }
  $("#link-note").textContent = ok ? "Skopiowano adres do schowka." : "Nie udało się skopiować. Zaznacz adres i skopiuj go ręcznie.";
});

// ---------------------------------------------------------------- pracownia i strony

const studio: Studio = new Studio(studioEl, {
  confirm: confirmDialog,
  showLink,
  goFree: () => {
    if (location.hash !== "#/" && location.hash !== "") history.replaceState(null, "", "#/");
  },
});

$("#theme").addEventListener("click", () => {
  const next: Theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  save("motyw", next === systemTheme() ? "auto" : next);
  applyTheme();
});
media.addEventListener("change", applyTheme);
applyTheme();

function showStudio(title: string) {
  pageEl.hidden = true;
  pageEl.innerHTML = "";
  studioEl.hidden = false;
  document.title = title;
  studio.activate();
}

function showPage(html: string, title: string) {
  studioEl.hidden = true;
  pageEl.innerHTML = html;
  pageEl.hidden = false;
  document.title = title;
}

function markNav(current: string) {
  for (const a of document.querySelectorAll<HTMLAnchorElement>(".nav a")) {
    if (a.getAttribute("href") === current) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  }
}

let firstRoute = true;

async function route() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  const focusHeading = !firstRoute;
  firstRoute = false;
  const [head, sub] = parts;
  if (!head) {
    markNav("#/");
    const q = new URLSearchParams(query);
    const code = q.get("kod");
    if (code) {
      const mode: Mode = q.get("tryb") === "3d" ? "3d" : "2d";
      history.replaceState(null, "", "#/");
      let source: string | null = null;
      try {
        source = await decodeSource(code);
      } catch {
        source = null;
      }
      if (studio.ctx.kind !== "free") studio.setContext({ kind: "free" });
      showStudio("Logomocja: pracownia");
      if (source === null) {
        await confirmDialog("Link jest uszkodzony", "Nie udało się odczytać programu z tego adresu. Być może został ucięty przy kopiowaniu. Twój szkic pozostał bez zmian.", "Rozumiem", "Zamknij");
      } else {
        await studio.loadProgram(source, mode, "Program z linku", "program z linku");
        studio.activate();
      }
      return;
    }
    if (studio.ctx.kind !== "free") studio.setContext({ kind: "free" });
    showStudio("Logomocja: pracownia");
    if (focusHeading) $("#main").focus({ preventScroll: true });
    return;
  }
  if (head === "zadania" && sub) {
    const c = challengeById(sub);
    if (c) {
      markNav("#/zadania");
      if (studio.ctx.kind !== "challenge" || studio.ctx.c !== c) studio.setContext({ kind: "challenge", c });
      showStudio(`${c.title}: zadanie w Logomocji`);
      if (focusHeading) $("#task-title")?.focus?.();
      return;
    }
  }
  let html: string;
  let title: string;
  if (head === "przyklady" && !sub) { html = examplesPage(); title = "Przykłady: Logomocja"; markNav("#/przyklady"); }
  else if (head === "zadania" && !sub) { html = challengesPage(); title = "Zadania: Logomocja"; markNav("#/zadania"); }
  else if (head === "polecenia") { html = referencePage(); title = "Polecenia: Logomocja"; markNav("#/polecenia"); }
  else { html = notFoundPage(); title = "Nie ma takiej strony: Logomocja"; markNav(""); }
  showPage(html, title);
  window.scrollTo(0, 0);
  if (head === "polecenia" && sub) jump(sub, false);
  else if (focusHeading) pageEl.querySelector<HTMLElement>("h1")?.focus({ preventScroll: true });
}

function jump(id: string, smooth: boolean) {
  const h = document.getElementById("h-" + id);
  if (!h) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  h.scrollIntoView({ behavior: smooth && !reduce ? "smooth" : "auto", block: "start" });
  h.focus({ preventScroll: true });
}

pageEl.addEventListener("click", async (e) => {
  const t = e.target as HTMLElement;
  const ex = t.closest<HTMLElement>("[data-example]");
  if (ex) {
    const item = exampleById(ex.dataset.example!)!;
    if (await studio.loadProgram(item.source, item.mode, item.name, `przykład ${item.name}`)) location.hash = "#/";
    return;
  }
  const tr = t.closest<HTMLElement>("[data-try]");
  if (tr) {
    const mode = tr.dataset.mode as Mode;
    if (await studio.loadProgram(tr.dataset.try!, mode, "Przykład z opisu poleceń", "ten przykład")) location.hash = "#/";
    return;
  }
  const j = t.closest<HTMLElement>("[data-jump]");
  if (j) {
    e.preventDefault();
    history.replaceState(null, "", `#/polecenia/${j.dataset.jump}`);
    jump(j.dataset.jump!, true);
  }
});

window.addEventListener("hashchange", route);
const ready = route();

// ---------------------------------------------------------------- interfejs dla testów i automatów

const nextFrame = () =>
  new Promise<void>((resolve) => {
    let done = false;
    const end = () => { if (!done) { done = true; resolve(); } };
    requestAnimationFrame(() => requestAnimationFrame(end));
    setTimeout(end, 250);
  });

const api = {
  version: __VERSION__,
  run(source: string, mode: Mode): RunResult {
    return run(String(source), mode === "3d" ? "3d" : "2d");
  },
  async open(source: string, mode: Mode): Promise<RunResult> {
    await ready;
    const m: Mode = mode === "3d" ? "3d" : "2d";
    for (const d of document.querySelectorAll<HTMLDialogElement>("dialog[open]")) d.close();
    if (location.hash !== "#/" && location.hash !== "") history.replaceState(null, "", "#/");
    markNav("#/");
    showStudio("Logomocja: pracownia");
    const result = studio.openDirect(String(source), m);
    await document.fonts?.ready;
    await nextFrame();
    return result;
  },
};

declare global {
  interface Window {
    logomocja: typeof api;
  }
}
window.logomocja = api;
