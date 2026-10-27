import { LogoError, parse, type Mode } from "../lang";
import { fmtInt } from "../lang/errors";
import type { DrawingView } from "../render/view";
import { View2D } from "../render/view2d";
import { CodeEditor } from "./editor";
import { EXAMPLES, WELCOME } from "./examples";
import { Player, SPEEDS, SPEED_LABELS } from "./player";
import { loadSaved, save, type ThemeChoice } from "./storage";

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Brak elementu #${id}`);
  return el as T;
}

/** Why 3D is unavailable, or null when WebGL works. */
function webglProblem(): string | null {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return "ta przeglądarka nie udostępnia WebGL (może być wyłączony w ustawieniach lub zablokowany przez sterownik karty graficznej)";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  } catch {
    return "nie udało się uruchomić WebGL w tej przeglądarce";
  }
}

function fmtCoord(v: number): string {
  const r = Math.round(v * 10) / 10;
  return (r === 0 ? 0 : r).toLocaleString("pl-PL", { maximumFractionDigits: 1 });
}

export class App {
  private readonly player: Player;
  private readonly editor: CodeEditor;
  private view: DrawingView | null = null;
  private viewMode: Mode | null = null;
  private mode: Mode;
  private readonly no3d: string | null;
  private threeLoading = false;
  /** The editor changed after the current run started. */
  private stale = false;
  private lastState = "idle";
  private checkTimer = 0;
  private saveTimer = 0;
  private liveError: LogoError | null = null;
  private notice = "";

  constructor() {
    const saved = loadSaved();
    this.no3d = webglProblem();
    this.mode = saved.mode === "3d" && !this.no3d ? "3d" : "2d";
    this.applyTheme(saved.theme ?? "auto");

    this.player = new Player(() => this.onPlayerChange());
    if (typeof saved.speed === "number") this.player.setSpeed(saved.speed);

    this.editor = new CodeEditor($("editorHost"), () => this.onEdit());
    this.editor.setValue(typeof saved.source === "string" ? saved.source : WELCOME);

    this.bindControls();
    this.bindExamples();
    this.setupModeButtons();
    if (saved.mode === "3d" && this.no3d) {
      this.notice = `Zapisany program był w trybie 3D, ale ${this.no3d}. Działa tryb 2D.`;
    }
    void this.ensureView();
    this.updateUi();
    this.scheduleCheck();
  }

  // -------------------------------------------------------------------------
  // Views

  private async ensureView(): Promise<void> {
    if (this.viewMode === this.mode && this.view) return;
    const host = $("viewHost");
    this.view?.dispose();
    this.view = null;
    this.viewMode = null;
    if (this.mode === "2d") {
      this.view = new View2D(host);
      this.viewMode = "2d";
    } else {
      this.threeLoading = true;
      this.updateUi();
      try {
        const { View3D } = await import("../render/view3d");
        if (this.mode !== "3d") return; // switched back while loading
        this.view = new View3D(host, () => this.on3dLost());
        this.viewMode = "3d";
      } catch (e) {
        console.error(e);
        this.disable3d("nie udało się uruchomić widoku 3D (WebGL zgłosił błąd)");
        return;
      } finally {
        this.threeLoading = false;
      }
    }
    this.view.render(this.player.frame());
    if (this.player.hasProgram && !this.view.contains(this.player.frame())) this.view.fit(this.player.frame());
    this.updateUi();
  }

  private on3dLost(): void {
    this.disable3d("kontekst WebGL został utracony (np. przez sterownik karty graficznej)");
  }

  private disable3d(reason: string): void {
    this.notice = `Tryb 3D jest wyłączony: ${reason}. Tryb 2D działa normalnie.`;
    const b = $<HTMLButtonElement>("mode3d");
    b.disabled = true;
    b.title = `Tryb 3D niedostępny: ${reason}`;
    this.setMode("2d");
  }

  private setupModeButtons(): void {
    const b2 = $<HTMLButtonElement>("mode2d");
    const b3 = $<HTMLButtonElement>("mode3d");
    b2.addEventListener("click", () => this.setMode("2d"));
    b3.addEventListener("click", () => this.setMode("3d"));
    if (this.no3d) {
      b3.disabled = true;
      b3.title = `Tryb 3D niedostępny: ${this.no3d}`;
      if (!this.notice) this.notice = `Tryb 3D jest wyłączony: ${this.no3d}. Tryb 2D działa normalnie.`;
    }
  }

  private setMode(mode: Mode): void {
    if (mode === "3d" && $<HTMLButtonElement>("mode3d").disabled) return;
    if (mode === this.mode && this.view) return;
    const wasFinished = this.player.state === "done" && !this.stale;
    this.mode = mode;
    save({ mode });
    this.player.reset();
    this.stale = false;
    if (wasFinished) {
      // Show the same program in the new mode right away.
      if (this.player.load(this.editor.value, mode)) this.player.complete();
    }
    void this.ensureView().then(() => {
      const f = this.player.frame();
      if (this.view && f.segments.length) this.view.fit(f);
    });
    this.scheduleCheck();
    this.updateUi();
  }

  // -------------------------------------------------------------------------
  // Running

  private run(): void {
    this.stale = false;
    this.liveError = null;
    this.player.run(this.editor.value, this.mode);
    this.showDrawingOnPhone();
  }

  private togglePause(): void {
    const p = this.player;
    if (p.state === "running") p.pause();
    else if (p.state === "paused") {
      if (this.stale) this.run();
      else {
        p.resume();
        this.showDrawingOnPhone();
      }
    } else this.run();
  }

  private step(): void {
    const p = this.player;
    const fresh = !p.hasProgram || p.state === "done" || p.state === "error" || this.stale || p.mode !== this.mode;
    if (fresh) {
      this.stale = false;
      this.liveError = null;
      if (!p.load(this.editor.value, this.mode)) return;
    }
    p.step();
  }

  private reset(): void {
    this.stale = false;
    this.player.reset();
    this.scheduleCheck();
  }

  private onPlayerChange(): void {
    const p = this.player;
    const frame = p.frame();
    this.view?.render(frame);
    const finished = (p.state === "done" || p.state === "error") && this.lastState !== p.state;
    if (finished && this.view && frame.segments.length && !this.view.contains(frame)) this.view.fit(frame);
    if (p.state === "error" && this.lastState !== "error" && p.error) {
      if (p.error.phase === "parse") this.showCodeOnPhone();
    }
    this.lastState = p.state;
    this.updateUi();
  }

  // -------------------------------------------------------------------------
  // Editing

  private onEdit(): void {
    const p = this.player;
    if (p.hasProgram && (p.state === "running" || p.state === "paused")) this.stale = true;
    if (p.state === "error") this.stale = true;
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => save({ source: this.editor.value }), 250);
    this.scheduleCheck();
    this.updateUi();
  }

  /** Validate the draft in the background so mistakes show up while typing. */
  private scheduleCheck(): void {
    clearTimeout(this.checkTimer);
    this.checkTimer = window.setTimeout(() => {
      try {
        parse(this.editor.value, this.mode);
        this.liveError = null;
      } catch (e) {
        this.liveError = e instanceof LogoError ? e : null;
      }
      this.updateUi();
    }, 350);
  }

  // -------------------------------------------------------------------------
  // UI state

  private updateUi(): void {
    const p = this.player;
    const running = p.state === "running";
    const paused = p.state === "paused" && p.hasProgram;

    const pauseBtn = $<HTMLButtonElement>("pauseBtn");
    pauseBtn.disabled = !running && !paused;
    pauseBtn.querySelector(".label")!.textContent = running ? "Pauza" : "Wznów";
    pauseBtn.classList.toggle("is-paused", !running);
    pauseBtn.setAttribute("aria-label", running ? "Pauza" : "Wznów");
    $<HTMLButtonElement>("resetBtn").disabled = !p.hasProgram && p.state !== "error";
    $("runBtn").querySelector(".label")!.textContent = p.hasProgram && p.state !== "error" ? "Od nowa" : "Uruchom";

    const b2 = $("mode2d");
    const b3 = $("mode3d");
    b2.setAttribute("aria-checked", String(this.mode === "2d"));
    b3.setAttribute("aria-checked", String(this.mode === "3d"));
    document.documentElement.dataset.mode = this.mode;

    this.updateStatus();
    this.updateHud();
    this.updateMarks();
  }

  private updateMarks(): void {
    const p = this.player;
    if (this.stale) {
      this.editor.setMarks({ error: this.liveErrorMark() });
      return;
    }
    const err = p.state === "error" && p.error ? p.error : null;
    const errMark = err ? { line: err.line, column: err.column, length: err.length } : this.liveErrorMark();
    const step = p.state === "paused" && p.lastStep ? p.lastStep.tok : null;
    const active = step ? { line: step.line, column: step.column, length: step.length } : null;
    this.editor.setMarks({ error: errMark, active });
    if (active && p.state === "paused") this.editor.scrollToLine(active.line);
  }

  private liveErrorMark() {
    const e = this.liveError;
    return e ? { line: e.line, column: e.column, length: e.length } : null;
  }

  private setStatus(kind: string, html: string): void {
    const el = $("status");
    if (el.dataset.kind !== kind) el.dataset.kind = kind;
    if (el.innerHTML !== html) el.innerHTML = html;
  }

  private updateStatus(): void {
    const p = this.player;
    const segs = p.frame().segments.length;
    const counts = `polecenia: ${fmtInt(p.stepsDone)} · odcinki: ${fmtInt(segs)}`;
    const staleNote = this.stale
      ? `<p class="status-note">Program zmienił się od uruchomienia – rysunek pokazuje poprzednią wersję. ${
          p.state === "running" ? "Naciśnij „Od nowa”, aby zobaczyć zmiany." : "„Wznów” i „Krok” zaczną od nowa."
        }</p>`
      : "";
    const notice = this.notice ? `<p class="status-note warn">${esc(this.notice)}</p>` : "";

    if (this.threeLoading) {
      this.setStatus("info", `<p>Ładowanie widoku 3D…</p>${notice}`);
      return;
    }
    if (p.state === "error" && p.error && !this.stale) {
      const e = p.error;
      const head =
        e.phase === "parse"
          ? "Błąd w programie – nic nie zostało narysowane."
          : `Błąd podczas rysowania – rysunek zatrzymany (${counts}).`;
      this.setStatus(
        "error",
        `<p class="status-head">${head}</p><p><button type="button" class="pos-link" data-line="${e.line}" data-col="${e.column}" data-len="${e.length}">Wiersz ${e.line}, kolumna ${e.column}</button>: ${esc(e.message)}</p>${notice}`,
      );
      return;
    }
    if (this.liveError && (p.state === "idle" || this.stale || p.state === "done" || p.state === "error")) {
      const e = this.liveError;
      this.setStatus(
        "warn",
        `<p class="status-head">Program zawiera błąd:</p><p><button type="button" class="pos-link" data-line="${e.line}" data-col="${e.column}" data-len="${e.length}">Wiersz ${e.line}, kolumna ${e.column}</button>: ${esc(e.message)}</p>${staleNote}${notice}`,
      );
      return;
    }
    let text: string;
    switch (p.state) {
      case "idle":
        text = matchMedia("(pointer: coarse)").matches
          ? "Gotowy. „Uruchom” rysuje cały program, „Krok” wykonuje jedno polecenie."
          : `Gotowy. <kbd>Ctrl</kbd>+<kbd>Enter</kbd> uruchamia program, <kbd>Ctrl</kbd>+<kbd>.</kbd> wykonuje jeden krok.`;
        break;
      case "running":
        text = `Rysuję… (${counts})`;
        break;
      case "paused":
        text = p.lastStep
          ? `Pauza (${counts}). Ostatnio wykonane polecenie jest podświetlone w kodzie.`
          : `Program gotowy do pracy krokowej. Naciśnij „Krok”.`;
        break;
      case "done":
        text = `Gotowe (${counts}).`;
        break;
      default:
        text = "";
    }
    this.setStatus(p.state === "done" ? "ok" : "info", `<p>${text}</p>${staleNote}${notice}`);
  }

  private updateHud(): void {
    const pose = this.player.frame().pose;
    const parts = [
      `x ${fmtCoord(pose.pos[0])}`,
      `y ${fmtCoord(pose.pos[1])}`,
      ...(this.mode === "3d" ? [`z ${fmtCoord(pose.pos[2])}`] : []),
    ];
    if (this.mode === "2d") {
      const raw = (Math.atan2(pose.heading[0], pose.heading[1]) * 180) / Math.PI;
      const deg = (((Math.round(raw * 10) / 10) % 360) + 360) % 360;
      parts.push(`kurs ${fmtCoord(deg)}°`);
    }
    const html =
      `<span>${parts.join(" · ")}</span>` +
      `<span class="hud-pen"><i class="sw" style="background:${pose.color}"></i>${pose.penDown ? "pisak w dół" : "pisak w górze"} · ${pose.width} px</span>`;
    const hud = $("hud");
    if (hud.innerHTML !== html) hud.innerHTML = html;
  }

  // -------------------------------------------------------------------------
  // Controls

  private bindControls(): void {
    $("runBtn").addEventListener("click", () => this.run());
    $("pauseBtn").addEventListener("click", () => this.togglePause());
    $("stepBtn").addEventListener("click", () => this.step());
    $("resetBtn").addEventListener("click", () => this.reset());

    const speed = $<HTMLInputElement>("speed");
    speed.max = String(SPEEDS.length - 1);
    speed.value = String(this.player.speedLevel);
    const speedLabel = $("speedLabel");
    const showSpeed = () => {
      speedLabel.textContent = SPEED_LABELS[this.player.speedLevel] ?? "";
      speed.setAttribute("aria-valuetext", speedLabel.textContent);
    };
    showSpeed();
    speed.addEventListener("input", () => {
      this.player.setSpeed(Number(speed.value));
      save({ speed: this.player.speedLevel });
      showSpeed();
    });

    $("status").addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".pos-link");
      if (!b) return;
      this.showCodeOnPhone();
      this.editor.reveal(Number(b.dataset.line), Number(b.dataset.col), Number(b.dataset.len));
    });

    $("fitBtn").addEventListener("click", () => this.view?.fit(this.player.frame()));
    $("zoomInBtn").addEventListener("click", () => this.view?.zoomBy(1.25));
    $("zoomOutBtn").addEventListener("click", () => this.view?.zoomBy(0.8));
    $("homeBtn").addEventListener("click", () => this.view?.resetView());
    $("pngBtn").addEventListener("click", () => void this.exportPng());

    $("helpBtn").addEventListener("click", () => $<HTMLDialogElement>("help").showModal());
    $("helpClose").addEventListener("click", () => $<HTMLDialogElement>("help").close());
    $("themeBtn").addEventListener("click", () => {
      const order: ThemeChoice[] = ["auto", "light", "dark"];
      const cur = (document.documentElement.dataset.themeChoice as ThemeChoice) ?? "auto";
      const next = order[(order.indexOf(cur) + 1) % order.length]!;
      this.applyTheme(next);
      save({ theme: next });
    });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => this.view?.refreshTheme());

    for (const tab of document.querySelectorAll<HTMLButtonElement>("[data-tab]")) {
      tab.addEventListener("click", () => this.setTab(tab.dataset.tab as "code" | "canvas"));
    }

    document.addEventListener("keydown", (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "Enter") {
        e.preventDefault();
        this.run();
      } else if (mod && e.key === ".") {
        e.preventDefault();
        this.step();
      } else if (e.key === "Escape" && this.player.state === "running") {
        this.player.pause();
      }
    });
    window.addEventListener("beforeunload", () => save({ source: this.editor.value }));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") save({ source: this.editor.value });
    });
  }

  private bindExamples(): void {
    const sel = $<HTMLSelectElement>("examples");
    for (const ex of EXAMPLES) {
      const o = document.createElement("option");
      o.value = ex.id;
      o.textContent = ex.title;
      sel.append(o);
    }
    sel.addEventListener("change", () => {
      const ex = EXAMPLES.find((x) => x.id === sel.value);
      sel.value = "";
      if (!ex) return;
      this.player.reset();
      this.stale = false;
      this.editor.setValue(ex.source, true);
      save({ source: ex.source });
      let mode = ex.mode;
      if (mode === "3d" && $<HTMLButtonElement>("mode3d").disabled) {
        this.notice = `Przykład „${ex.title}” wymaga trybu 3D, który jest niedostępny w tej przeglądarce.`;
        mode = "2d";
      }
      if (mode !== this.mode) {
        this.mode = mode;
        save({ mode });
        void this.ensureView();
      }
      this.run();
      this.editor.textarea.blur();
    });
  }

  private applyTheme(choice: ThemeChoice): void {
    const root = document.documentElement;
    root.dataset.themeChoice = choice;
    if (choice === "auto") delete root.dataset.theme;
    else root.dataset.theme = choice;
    const btn = document.getElementById("themeBtn");
    if (btn) {
      const label = { auto: "Motyw: automatyczny", light: "Motyw: jasny", dark: "Motyw: ciemny" }[choice];
      btn.title = label;
      btn.setAttribute("aria-label", label);
    }
    this.view?.refreshTheme();
  }

  private setTab(tab: "code" | "canvas"): void {
    $("workspace").dataset.tab = tab;
    for (const b of document.querySelectorAll<HTMLButtonElement>("[data-tab]")) {
      b.setAttribute("aria-selected", String(b.dataset.tab === tab));
    }
    if (tab === "canvas") window.dispatchEvent(new Event("resize"));
  }

  private isPhone(): boolean {
    return matchMedia("(max-width: 820px)").matches;
  }

  private showDrawingOnPhone(): void {
    if (this.isPhone()) this.setTab("canvas");
  }

  private showCodeOnPhone(): void {
    if (this.isPhone()) this.setTab("code");
  }

  private async exportPng(): Promise<void> {
    const blob = await this.view?.toPng();
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `logomocja-${this.mode}.png`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
