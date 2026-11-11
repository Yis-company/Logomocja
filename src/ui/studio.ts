import {
  LIMITS, LogoErr, Machine, copySegments, parse, run, toError,
  type LogoError, type Mode, type RunResult, type Segment, type TurtleState,
} from "../core/interp";
import { CHALLENGES, targetOf, type Challenge } from "../core/challenges";
import { compareDrawings } from "../core/check";
import { Editor } from "./editor";
import { ICON } from "./icons";
import { downloadBlob, permalink, slug } from "./share";
import { load, remove, save } from "./store";
import { SheetView, type Palette } from "./view";

interface Doc {
  source: string;
  /** treść w chwili wczytania (przykład, plik, link); null dla szkicu pisanego od zera */
  origin: string | null;
  name: string;
}

type RunState = "idle" | "running" | "paused" | "done" | "error";
export type Context = { kind: "free" } | { kind: "challenge"; c: Challenge };

const RATES = [2, 5, 10, 20, 40, 80, 160, 400, 1200, Infinity];
const MAC = /Mac|iPhone|iPad/.test(navigator.platform || "");
const MOD = MAC ? "⌘" : "Ctrl";
const STARTER: Record<Mode, Doc> = {
  "2d": {
    name: "Szkic 2D",
    origin: null,
    source: "; Witaj w pracowni. Zmień liczby i uruchom program jeszcze raz.\npowtorz 6 [\n  np 90\n  pw 60\n]\n",
  },
  "3d": {
    name: "Szkic 3D",
    origin: null,
    source: "; Żółw w przestrzeni: gora i dol unoszą i opuszczają nos.\npowtorz 4 [\n  np 90\n  gora 90\n  np 45\n  dol 90\n  pw 90\n]\n",
  },
};
STARTER["2d"].origin = STARTER["2d"].source;
STARTER["3d"].origin = STARTER["3d"].source;

const home = (): TurtleState => ({ pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], pen: true, color: "#16866a", width: 3 });
const num = (v: number) => {
  const r = Math.round(v * 10) / 10;
  return (Object.is(r, -0) ? 0 : r).toString().replace(".", ",").replace("-", "−");
};
const big = (v: number) => v.toString().replace(/\B(?=(\d{3})+$)/g, " ");
const deg = (rad: number) => {
  let d = Math.round(((rad * 180) / Math.PI) * 10) / 10;
  if (d < 0) d += 360;
  if (d >= 360) d -= 360;
  return num(d) + "°";
};
function plural(n: number, one: string, few: string, many: string) {
  const d = n % 10, h = n % 100;
  if (n === 1) return one;
  return d >= 2 && d <= 4 && !(h >= 12 && h <= 14) ? few : many;
}
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface StudioHost {
  confirm(title: string, body: string, yes: string, no: string): Promise<boolean>;
  showLink(url: string): void;
  goFree(): void;
}

export class Studio {
  el: HTMLElement;
  mode: Mode;
  ctx: Context = { kind: "free" };
  private host: StudioHost;
  private docs: Record<Mode, Doc>;
  private editor: Editor;
  private view: SheetView;
  private machine: Machine | null = null;
  private state: RunState = "idle";
  private error: LogoError | null = null;
  private frozen: Segment[] = [];
  private turtle: TurtleState = home();
  private ops = 0;
  private speed: number;
  private raf = 0;
  private last = 0;
  private budget = 0;
  private lintTimer = 0;
  private solved: string[];
  private $: <T extends HTMLElement = HTMLElement>(sel: string) => T;

  constructor(el: HTMLElement, host: StudioHost) {
    this.el = el;
    this.host = host;
    this.mode = load<Mode>("tryb", "2d") === "3d" ? "3d" : "2d";
    this.docs = {
      "2d": load<Doc>("szkic:2d", { ...STARTER["2d"] }),
      "3d": load<Doc>("szkic:3d", { ...STARTER["3d"] }),
    };
    for (const m of ["2d", "3d"] as Mode[]) {
      const d = this.docs[m];
      if (!d || typeof d.source !== "string") this.docs[m] = { ...STARTER[m] };
    }
    this.speed = Math.min(10, Math.max(1, load<number>("tempo", 6) | 0)) || 6;
    this.solved = load<string[]>("zaliczone", []);
    el.innerHTML = this.template();
    this.$ = (sel) => el.querySelector(sel)!;
    this.editor = new Editor(this.$(".ed"), "Program w języku Logo");
    this.view = new SheetView(this.$<HTMLCanvasElement>("canvas"), this.readPalette());
    this.view.onCamera = () => this.paintBlock();
    this.editor.onInput = (v) => this.edited(v);
    this.bind();
    this.measureInsets();
    new ResizeObserver(() => this.measureInsets()).observe(this.$(".sheet"));
    document.fonts?.load('15px "osifont"').then(() => this.view.invalidate(), () => {});
    this.show(false);
  }

  // ------------------------------------------------------------ szablon

  private template(): string {
    const k = (keys: string) => `<kbd>${keys}</kbd>`;
    return `
    <div class="pane pane-code">
      <section class="task" hidden aria-labelledby="task-title"></section>
      <header class="codebar">
        <h1 class="docname" id="docname"></h1>
        <div class="tools" role="group" aria-label="Plik i udostępnianie">
          <button class="btn btn-quiet" data-act="open" type="button">${ICON.open}<span>Otwórz</span></button>
          <button class="btn btn-quiet" data-act="save" type="button" title="Pobierz program jako plik .logo">${ICON.download}<span>Pobierz</span></button>
          <button class="btn btn-quiet" data-act="link" type="button" title="Link, który otwiera ten program">${ICON.link}<span>Link</span></button>
          <input type="file" id="file" accept=".logo,.lgo,.txt,text/plain" hidden>
        </div>
      </header>
      <div class="notice" hidden></div>
      <div class="ed"></div>
      <div class="status" id="status" role="status" aria-live="polite"></div>
      <div class="runbar" role="group" aria-label="Sterowanie programem">
        <button class="btn btn-primary" data-act="run" type="button" aria-keyshortcuts="Control+Enter">${ICON.play}<span class="lbl">Uruchom</span>${k(`${MOD}&nbsp;Enter`)}</button>
        <button class="btn" data-act="step" type="button" aria-keyshortcuts="Control+.">${ICON.step}<span class="lbl">Krok</span>${k(`${MOD}&nbsp;.`)}</button>
        <button class="btn" data-act="pause" type="button" aria-keyshortcuts="Escape">${ICON.pause}<span class="lbl">Pauza</span>${k("Esc")}</button>
        <button class="btn" data-act="reset" type="button" aria-keyshortcuts="Control+Shift+Backspace" title="Reset: czyści arkusz i ustawia żółwia na starcie (${MOD}+Shift+Backspace)">${ICON.reset}<span class="lbl">Reset</span></button>
        <label class="speed"><span class="speed-name">Tempo</span>
          <input type="range" id="speed" min="1" max="10" step="1" value="${this.speed}">
          <output for="speed" id="speed-out"></output>
        </label>
      </div>
    </div>
    <div class="pane pane-sheet">
      <div class="sheetbar">
        <fieldset class="seg" id="mode">
          <legend class="vh">Tryb rysowania</legend>
          <label><input type="radio" name="mode" value="2d"><span>2D</span></label>
          <label><input type="radio" name="mode" value="3d"><span>3D</span></label>
        </fieldset>
        <div class="tools" role="group" aria-label="Widok arkusza">
          <button class="btn btn-icon" data-act="zoom-out" type="button" aria-label="Pomniejsz" title="Pomniejsz (−)">${ICON.minus}</button>
          <button class="btn btn-icon" data-act="zoom-in" type="button" aria-label="Powiększ" title="Powiększ (+)">${ICON.plus}</button>
          <button class="btn btn-quiet" data-act="fit" type="button" title="Dopasuj rysunek do arkusza (0)">${ICON.fit}<span>Dopasuj</span></button>
          <button class="btn btn-quiet" data-act="camera" type="button" title="Ustaw kamerę w położeniu początkowym">${ICON.camera}<span>Kamera</span></button>
          <button class="btn btn-quiet" data-act="png" type="button" title="Zapisz rysunek jako obraz PNG">${ICON.image}<span>PNG</span></button>
        </div>
      </div>
      <div class="sheet">
        <canvas tabindex="0" role="img" aria-label="Arkusz z rysunkiem" aria-describedby="sheet-help"></canvas>
        <p class="vh" id="sheet-help">Strzałki przesuwają widok, w trybie 3D obracają kamerę, a z klawiszem Shift przesuwają. Plus i minus zmieniają powiększenie, zero dopasowuje rysunek.</p>
        <table class="tblock" aria-label="Tabelka rysunkowa">
          <tbody>
            <tr><th scope="row">Rysunek</th><td colspan="3" id="tb-name"></td></tr>
            <tr><th scope="row">Żółw</th><td id="tb-pos" class="n"></td><th scope="row">Kurs</th><td id="tb-head" class="n"></td></tr>
            <tr><th scope="row">Odcinki</th><td id="tb-seg" class="n"></td><th scope="row">Operacje</th><td id="tb-ops" class="n"></td></tr>
            <tr class="tb-wide"><th scope="row">Pisak</th><td id="tb-pen"></td><th scope="row">Skala</th><td id="tb-scale" class="n"></td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }

  private readPalette(): Palette {
    const cs = getComputedStyle(document.documentElement);
    const v = (n: string) => cs.getPropertyValue(n).trim();
    return {
      sheet: v("--sheet"), grid: v("--sheet-grid"), gridStrong: v("--sheet-grid-strong"),
      ink: v("--ink"), inkSoft: v("--ink-soft"), turtle: v("--turtle-mark"), target: v("--ink-soft"),
    };
  }

  themeChanged() {
    this.view.palette = this.readPalette();
    this.view.invalidate();
  }

  private measureInsets() {
    const tb = this.$(".tblock");
    const overlay = getComputedStyle(tb).position === "absolute";
    this.view.insets = { top: 0, right: 0, bottom: overlay ? tb.offsetHeight + 8 : 0, left: 0 };
    if (this.view.auto) this.view.fit(true);
  }

  // ------------------------------------------------------------ zdarzenia

  private bind() {
    this.el.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-act]");
      if (!b || b.getAttribute("aria-disabled") === "true") return;
      this.act(b.dataset.act!, b);
    });
    this.$<HTMLInputElement>("#speed").addEventListener("input", (e) => {
      this.speed = Number((e.target as HTMLInputElement).value);
      save("tempo", this.speed);
      this.paintSpeed();
    });
    this.$("#mode").addEventListener("change", (e) => {
      const v = (e.target as HTMLInputElement).value as Mode;
      if (this.ctx.kind === "free") this.setMode(v);
    });
    this.$<HTMLInputElement>("#file").addEventListener("change", async (e) => {
      const input = e.target as HTMLInputElement;
      const f = input.files?.[0];
      input.value = "";
      if (!f) return;
      if (f.size > 400_000) {
        this.say("Ten plik jest za duży na program w Logo (limit programu to 50 000 znaków).", "warn");
        return;
      }
      const text = (await f.text()).replace(/\r\n?/g, "\n");
      const name = f.name.replace(/\.(logo|lgo|txt)$/i, "") || "Program z pliku";
      const mode: Mode = this.ctx.kind === "challenge" ? this.ctx.c.mode : this.mode;
      if (this.ctx.kind === "challenge") {
        this.replaceSource(text);
        this.say(`Wczytano plik ${f.name} do tego zadania.`);
      } else {
        await this.loadProgram(text, mode, name, `plik ${f.name}`);
      }
    });
    document.addEventListener("keydown", (e) => {
      if (this.el.hidden || document.querySelector("dialog[open]")) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "Enter") { e.preventDefault(); this.act("run"); }
      else if (mod && !e.shiftKey && e.key === ".") { e.preventDefault(); this.act("step"); }
      else if (mod && e.shiftKey && e.key === "Backspace") { e.preventDefault(); this.act("reset"); }
      else if (e.key === "Escape" && this.state === "running") { e.preventDefault(); this.act("pause"); }
    });
  }

  private act(name: string, from?: HTMLElement) {
    switch (name) {
      case "run": this.state === "running" ? null : this.runProgram(); break;
      case "step": this.stepOnce(); break;
      case "pause": if (this.state === "running") this.pause(); break;
      case "reset": this.reset(); this.say("Arkusz wyczyszczony, żółw wrócił na start."); break;
      case "zoom-in": this.view.zoomBy(1.25); break;
      case "zoom-out": this.view.zoomBy(0.8); break;
      case "fit": this.view.fit(); break;
      case "camera": this.view.resetCamera(); break;
      case "png": this.exportPng(); break;
      case "open": this.$<HTMLInputElement>("#file").click(); break;
      case "save": {
        const name = slug(this.docName(false)) + ".logo";
        downloadBlob(new Blob([this.editor.value], { type: "text/plain;charset=utf-8" }), name);
        this.say(`Pobrano plik ${name}.`);
        break;
      }
      case "link":
        permalink(this.editor.value, this.mode).then((url) => this.host.showLink(url));
        break;
      case "restore": this.restoreBackup(); break;
      case "drop-backup": remove(`kopia:${this.mode}`); this.paintNotice(); break;
      case "check": this.check(); break;
      case "goto-error":
        if (this.error) this.editor.focusAt(this.error.line, this.error.column);
        break;
      case "starter":
        if (this.ctx.kind === "challenge") {
          const c = this.ctx.c;
          this.host.confirm("Zacząć zadanie od nowa?", "Twój program do tego zadania zostanie zastąpiony programem startowym.", "Zacznij od nowa", "Zostaw mój program")
            .then((ok) => { if (ok) { this.replaceSource(c.starter); from?.focus(); } });
        }
        break;
    }
  }

  // ------------------------------------------------------------ dokumenty

  private get doc(): Doc {
    return this.docs[this.mode];
  }

  private docName(decorated = true): string {
    if (this.ctx.kind === "challenge") return this.ctx.c.title;
    const d = this.doc;
    const changed = decorated && d.origin !== null && d.source !== d.origin && !d.name.startsWith("Szkic");
    return changed ? `${d.name} (zmieniony)` : d.name;
  }

  private persist() {
    if (this.ctx.kind === "challenge") save(`zadanie:${this.ctx.c.id}`, this.editor.value);
    else {
      this.doc.source = this.editor.value;
      save(`szkic:${this.mode}`, this.doc);
    }
  }

  private edited(_value: string) {
    this.persist();
    if (this.state === "running" || this.state === "paused") {
      this.halt();
      this.state = "idle";
      this.say("Program zmienił się w trakcie rysowania, więc wykonanie zostało zatrzymane. To, co już narysowane, zostaje na arkuszu.", "warn");
    } else if (this.error || this.state === "done" || this.state === "error") {
      this.state = "idle";
      this.say(this.frozen.length ? "Program zmieniony. Rysunek na arkuszu pochodzi z poprzedniego uruchomienia." : "Gotowy.");
    }
    this.error = null;
    this.editor.setError(null);
    this.paint();
    clearTimeout(this.lintTimer);
    this.lintTimer = window.setTimeout(() => this.lint(), 500);
  }

  private lint() {
    if (this.state === "running" || this.state === "paused") return;
    try {
      parse(this.editor.value, this.mode);
    } catch (e) {
      if (!(e instanceof LogoErr)) throw e;
      this.error = toError(e);
      this.editor.setError(this.error);
      this.sayError("Błąd w programie");
    }
  }

  /** Podmienia treść edytora bez pytania; używane tam, gdzie decyzja już zapadła. */
  private replaceSource(text: string) {
    this.halt();
    this.editor.setValue(text);
    this.persist();
    this.runInstant();
    this.view.fit();
    this.paint();
  }

  setContext(ctx: Context) {
    this.halt();
    clearTimeout(this.lintTimer);
    this.ctx = ctx;
    if (ctx.kind === "challenge") this.mode = ctx.c.mode;
    else this.mode = load<Mode>("tryb", "2d") === "3d" ? "3d" : "2d";
    this.show(true);
  }

  private show(run: boolean) {
    const source = this.ctx.kind === "challenge" ? load<string>(`zadanie:${this.ctx.c.id}`, this.ctx.c.starter) : this.doc.source;
    this.editor.setValue(typeof source === "string" ? source : "");
    this.view.scene.mode = this.mode;
    this.view.scene.target = this.ctx.kind === "challenge" ? targetOf(this.ctx.c) : null;
    this.reset();
    this.paintTask();
    this.paintNotice();
    if (run) {
      this.runInstant();
      this.view.fit();
    }
    this.say(this.error ? "" : "Gotowy.", "info", !!this.error);
    this.paint();
  }

  /** Wywoływane, gdy pracownia staje się widoczna: płótno dostaje rozmiar dopiero wtedy. */
  activate() {
    this.view.resize();
    if (this.state === "idle" && !this.frozen.length && !this.error) {
      this.runInstant();
      this.say(this.error ? "" : "Gotowy.", "info", !!this.error);
    }
    this.view.fit();
    this.paint();
  }

  setMode(mode: Mode) {
    if (mode === this.mode) return;
    this.halt();
    this.mode = mode;
    save("tryb", mode);
    this.show(true);
  }

  isDirty(mode: Mode): boolean {
    const d = this.docs[mode];
    return d.source.trim() !== "" && d.source !== d.origin;
  }

  /**
   * Wczytuje program do szkicu danego trybu. Zmieniony szkic nie ginie po cichu:
   * najpierw pytanie, potem kopia, którą można przywrócić.
   */
  async loadProgram(source: string, mode: Mode, name: string, what: string): Promise<boolean> {
    const d = this.docs[mode];
    const dirty = this.isDirty(mode) && d.source !== source;
    if (dirty) {
      const ok = await this.host.confirm(
        `Zastąpić szkic ${mode.toUpperCase()}?`,
        `W szkicu ${mode.toUpperCase()} jest program, którego nie ma w żadnym pliku. Jeśli wczytasz ${what}, szkic trafi do kopii i będzie można go przywrócić.`,
        "Wczytaj i zachowaj kopię", "Zostaw mój szkic",
      );
      if (!ok) return false;
      save(`kopia:${mode}`, { ...d, loaded: name });
    }
    this.docs[mode] = { source, origin: source, name };
    save(`szkic:${mode}`, this.docs[mode]);
    save("tryb", mode);
    if (this.ctx.kind !== "free") this.host.goFree();
    this.ctx = { kind: "free" };
    this.halt();
    this.mode = mode;
    this.show(true);
    return true;
  }

  /** „Jak wklejone”: treść trafia do edytora i szkicu, bez pytań i bez animacji. */
  openDirect(source: string, mode: Mode): RunResult {
    this.ctx = { kind: "free" };
    this.halt();
    this.mode = mode;
    save("tryb", mode);
    this.docs[mode].source = source;
    this.docs[mode].name = STARTER[mode].name;
    save(`szkic:${mode}`, this.docs[mode]);
    this.show(false);
    this.view.resize();
    const result = this.runInstant();
    this.view.fit();
    this.say(this.error ? "" : this.doneText(), "info", !!this.error);
    this.paint();
    this.view.drawNow();
    return result;
  }

  private restoreBackup() {
    const b = load<(Doc & { loaded?: string }) | null>(`kopia:${this.mode}`, null);
    if (!b) return;
    this.docs[this.mode] = { source: b.source, origin: b.origin, name: b.name };
    save(`szkic:${this.mode}`, this.doc);
    remove(`kopia:${this.mode}`);
    this.show(true);
    this.say("Przywrócono poprzedni szkic.");
    this.editor.ta.focus();
  }

  // ------------------------------------------------------------ wykonanie

  private halt() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.machine) {
      this.frozen = copySegments(this.machine.segments);
      this.turtle = this.snapshot(this.machine.turtle);
      this.ops = this.machine.ops;
      this.machine = null;
    }
    this.editor.setExecLine(null);
  }

  private snapshot(t: TurtleState): TurtleState {
    return { ...t, pos: [...t.pos], h: [...t.h], r: [...t.r], u: [...t.u] };
  }

  reset() {
    this.halt();
    this.frozen = [];
    this.turtle = home();
    this.ops = 0;
    this.state = "idle";
    this.error = null;
    this.editor.setError(null);
    this.paint();
  }

  /** Przygotowuje maszynę. Przy błędzie składni nic nie zostaje narysowane. */
  private prepare(): boolean {
    this.halt();
    clearTimeout(this.lintTimer);
    this.frozen = [];
    this.turtle = home();
    this.ops = 0;
    this.error = null;
    try {
      this.machine = new Machine(parse(this.editor.value, this.mode));
    } catch (e) {
      if (!(e instanceof LogoErr)) throw e;
      this.error = toError(e);
      this.state = "error";
      this.editor.setError(this.error);
      this.sayError("Program nie został uruchomiony");
      this.paint();
      return false;
    }
    this.editor.setError(null);
    return true;
  }

  private prefit() {
    if (!this.view.auto) return;
    // dopasowanie do końcowego rysunku, żeby animacja nie wychodziła poza arkusz
    const final = run(this.editor.value, this.mode).segments;
    const scene = this.view.scene;
    const keep = scene.segments;
    scene.segments = final;
    scene.turtle = null;
    this.view.fit(true);
    scene.segments = keep;
  }

  runProgram() {
    if (this.state === "paused" && this.machine) {
      this.state = "running";
      this.say("Rysuję dalej.");
      this.loop();
      this.paint();
      return;
    }
    if (!this.prepare()) return;
    if (RATES[this.speed - 1] === Infinity) {
      this.machine!.runAll();
      this.finish();
      if (this.view.auto) this.view.fit(true);
      return;
    }
    this.prefit();
    this.state = "running";
    this.say("Rysuję.");
    this.loop();
    this.paint();
  }

  runInstant(): RunResult {
    if (!this.prepare()) return { segments: [], error: this.error };
    const m = this.machine!;
    m.runAll();
    const result = { segments: copySegments(m.segments), error: m.error ? toError(m.error) : null };
    this.finish(true);
    return result;
  }

  private loop() {
    cancelAnimationFrame(this.raf);
    this.last = 0;
    this.budget = 1;
    const frame = (ts: number) => {
      const m = this.machine;
      if (!m || this.state !== "running") return;
      const rate = RATES[this.speed - 1];
      const dt = this.last ? Math.min(250, ts - this.last) : 0;
      this.last = ts;
      this.budget = rate === Infinity ? Infinity : this.budget + (dt / 1000) * rate;
      const until = performance.now() + 10;
      let line = 0;
      while (this.budget >= 1 && !m.done) {
        const ev = m.step();
        this.budget -= 1;
        if (ev) line = ev.line;
        if (performance.now() > until) { this.budget = Math.min(this.budget, 1); break; }
      }
      if (line) this.editor.setExecLine(line, rate <= 20);
      if (m.done) {
        this.finish();
        return;
      }
      this.paint();
      this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  private pause() {
    cancelAnimationFrame(this.raf);
    this.state = "paused";
    this.say("Pauza. Wznów program albo wykonuj go krok po kroku.");
    this.paint();
    this.$('[data-act="run"]').focus({ preventScroll: true });
  }

  stepOnce() {
    if (this.state === "running") cancelAnimationFrame(this.raf);
    if (!this.machine || this.state === "idle" || this.state === "done" || this.state === "error") {
      if (!this.prepare()) return;
      this.prefit();
    }
    const m = this.machine!;
    this.state = "paused";
    const ev = m.step();
    if (m.done) {
      this.finish();
      return;
    }
    if (ev) {
      this.editor.setExecLine(ev.line, true);
      this.say(`Krok: wiersz ${ev.line}, kolumna ${ev.column}. Operacja ${m.ops} z ${big(LIMITS.ops)}.`);
    }
    this.paint();
  }

  private doneText(): string {
    const n = this.frozen.length;
    return `Gotowe: ${big(n)} ${plural(n, "odcinek", "odcinki", "odcinków")}, ${big(this.ops)} ${plural(this.ops, "operacja", "operacje", "operacji")}.`;
  }

  private finish(quiet = false) {
    const m = this.machine!;
    const err = m.error;
    this.halt();
    if (err) {
      this.error = toError(err);
      this.state = "error";
      this.editor.setError(this.error);
      this.sayError("Program zatrzymany");
    } else {
      this.state = "done";
      if (!quiet) this.say(this.doneText());
    }
    this.paint();
  }

  private check() {
    if (this.ctx.kind !== "challenge") return;
    const c = this.ctx.c;
    const r = this.runInstant();
    this.view.fit();
    const out = this.$(".task-result");
    let pass = false;
    let reason: string;
    if (r.error) {
      reason = `Program zatrzymał się na błędzie w wierszu ${r.error.line}, więc nie da się go porównać ze wzorem. Popraw błąd i sprawdź ponownie.`;
      this.sayError("Program zatrzymany");
    } else {
      const res = compareDrawings(r.segments, targetOf(c));
      pass = res.pass;
      reason = res.reason;
      this.say(this.doneText());
    }
    if (pass && !this.solved.includes(c.id)) {
      this.solved.push(c.id);
      save("zaliczone", this.solved);
    }
    const i = CHALLENGES.indexOf(c);
    const next = CHALLENGES[i + 1];
    out.className = `task-result ${pass ? "is-pass" : "is-fail"}`;
    out.innerHTML = pass
      ? `${ICON.check}<p><strong>Zaliczone.</strong> ${esc(reason)} ${next ? `<a href="#/zadania/${next.id}">Następne zadanie: ${esc(next.title)}</a>` : `<a href="#/zadania">Wróć do listy zadań</a>`}</p>`
      : `${ICON.cross}<p><strong>Jeszcze nie.</strong> ${esc(reason)}</p>`;
    this.paintTaskState();
  }

  private async exportPng() {
    const blob = await this.view.toPNG();
    if (!blob) {
      this.say("Nie udało się zapisać obrazu PNG w tej przeglądarce.", "warn");
      return;
    }
    const name = `${slug(this.docName(false))}-${this.mode}.png`;
    downloadBlob(blob, name);
    this.say(`Zapisano obraz ${name}.`);
  }

  // ------------------------------------------------------------ rysowanie interfejsu

  private say(text: string, kind: "info" | "warn" = "info", keep = false) {
    if (keep) return;
    const s = this.$("#status");
    s.className = `status${kind === "warn" ? " is-warn" : ""}`;
    s.textContent = text;
  }

  private sayError(lead: string) {
    const e = this.error!;
    const s = this.$("#status");
    s.className = "status is-error";
    s.innerHTML = `<button type="button" class="status-pos" data-act="goto-error" title="Przejdź do miejsca błędu">Wiersz ${e.line}, kolumna ${e.column}</button><span><strong>${lead}.</strong> ${esc(e.message)}</span>`;
  }

  private paintSpeed() {
    const r = RATES[this.speed - 1];
    const text = r === Infinity ? "od razu" : `${r} ${plural(r, "krok", "kroki", "kroków")}/s`;
    this.$("#speed-out").textContent = text;
    this.$<HTMLInputElement>("#speed").setAttribute("aria-valuetext", r === Infinity ? "bez animacji" : `${r} kroków na sekundę`);
  }

  private paintTask() {
    const box = this.$(".task");
    if (this.ctx.kind !== "challenge") {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    const c = this.ctx.c;
    const i = CHALLENGES.indexOf(c);
    box.hidden = false;
    box.innerHTML = `
      <p class="task-meta"><a href="#/zadania">Zadania</a><span aria-hidden="true">/</span><span>${i + 1} z ${CHALLENGES.length}</span><span class="tag">${c.mode.toUpperCase()}</span><span class="task-state"></span></p>
      <h2 id="task-title">${esc(c.title)}</h2>
      <p class="task-text">${esc(c.task)} Wzór jest na arkuszu, narysowany linią przerywaną.</p>
      <details class="task-hint"><summary>Podpowiedź</summary><p>${esc(c.hint)}</p></details>
      <div class="task-actions">
        <button class="btn btn-check" type="button" data-act="check">${ICON.check}<span>Sprawdź rysunek</span></button>
        <button class="btn btn-quiet" type="button" data-act="starter">${ICON.undo}<span>Od nowa</span></button>
      </div>
      <div class="task-result" role="status" aria-live="polite"></div>`;
    this.paintTaskState();
  }

  private paintTaskState() {
    if (this.ctx.kind !== "challenge") return;
    const done = this.solved.includes(this.ctx.c.id);
    const s = this.$(".task-state");
    s.innerHTML = done ? `${ICON.check}zaliczone` : "";
  }

  private paintNotice() {
    const box = this.$(".notice");
    const b = this.ctx.kind === "free" ? load<(Doc & { loaded?: string }) | null>(`kopia:${this.mode}`, null) : null;
    if (!b) {
      box.hidden = true;
      box.innerHTML = "";
      return;
    }
    box.hidden = false;
    box.innerHTML = `<p>Poprzedni szkic ${this.mode.toUpperCase()} (${esc(b.name)}) jest w kopii.</p>
      <button class="btn btn-small" type="button" data-act="restore">${ICON.undo}<span>Przywróć szkic</span></button>
      <button class="btn btn-small btn-quiet" type="button" data-act="drop-backup">Usuń kopię</button>`;
  }

  private paintBlock() {
    const t = this.machine ? this.machine.turtle : this.turtle;
    const segs = this.machine ? this.machine.segments.length : this.frozen.length;
    const ops = this.machine ? this.machine.ops : this.ops;
    const set = (id: string, text: string) => {
      const n = this.$(id);
      if (n.textContent !== text) n.textContent = text;
    };
    set("#tb-name", this.docName());
    if (this.mode === "2d") {
      set("#tb-pos", `x ${num(t.pos[0])}  y ${num(t.pos[1])}`);
      set("#tb-head", deg(Math.atan2(t.h[0], t.h[1])));
    } else {
      set("#tb-pos", `x ${num(t.pos[0])}  y ${num(t.pos[1])}  z ${num(t.pos[2])}`);
      const flat = Math.hypot(t.h[0], t.h[1]);
      const pitch = Math.round((Math.atan2(t.h[2], flat) * 1800) / Math.PI) / 10;
      set("#tb-head", `${flat < 1e-9 ? "0°" : deg(Math.atan2(t.h[0], t.h[1]))}  nos ${num(pitch)}°`);
    }
    set("#tb-seg", `${big(segs)} / ${big(LIMITS.segments)}`);
    set("#tb-ops", `${big(ops)} / ${big(LIMITS.ops)}`);
    set("#tb-pen", t.pen ? `opuszczony, ${t.color}, ${t.width}` : "podniesiony");
    set("#tb-scale", this.view.scaleLabel());
  }

  private paint() {
    const m = this.machine;
    const scene = this.view.scene;
    scene.mode = this.mode;
    scene.segments = m ? m.segments : this.frozen;
    scene.turtle = m ? m.turtle : this.turtle;
    this.view.invalidate();
    this.paintBlock();
    this.el.dataset.state = this.state;
    this.el.dataset.mode = this.mode;
    this.el.dataset.ctx = this.ctx.kind;
    this.$("#docname").textContent = this.docName();
    const run = this.$('[data-act="run"]');
    run.querySelector(".lbl")!.textContent = this.state === "paused" ? "Wznów" : "Uruchom";
    run.setAttribute("aria-disabled", String(this.state === "running"));
    this.$('[data-act="pause"]').setAttribute("aria-disabled", String(this.state !== "running"));
    for (const r of this.el.querySelectorAll<HTMLInputElement>('input[name="mode"]')) {
      r.checked = r.value === this.mode;
      r.disabled = this.ctx.kind === "challenge" && r.value !== this.mode;
    }
    this.$('[data-act="camera"]').hidden = this.mode !== "3d";
    const n = scene.segments.length;
    this.$("canvas").setAttribute(
      "aria-label",
      `Arkusz ${this.mode.toUpperCase()}: ${n} ${plural(n, "odcinek", "odcinki", "odcinków")}${scene.target ? ", wzór zadania linią przerywaną" : ""}`,
    );
    this.paintSpeed();
  }
}
