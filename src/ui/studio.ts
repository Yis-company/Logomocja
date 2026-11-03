// The Studio: editor, run controls, the sheet (2D/3D) and its title block.
import { Machine, RunResult, compile, toError, run as interpret } from '../lang/interp';
import { LogoError } from '../lang/lexer';
import type { Mode } from '../lang/parser';
import { EXAMPLES, Example } from '../content/examples';
import { Editor } from './editor';
import { View2D, TurtlePose } from './view2d';
import type { View3D } from './view3d';
import { webglAvailable } from './view3d-check';
import { icon } from './icons';
import { store, encodeProgram } from './store';
import { drawPreview } from './preview';
import { toast } from './toast';

type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error' | 'stopped';

const SPEEDS = [2, 4, 8, 15, 30, 60, 120, 300, 1000, Infinity];
const SPEED_NAMES = ['bardzo wolno', 'wolno', 'wolno', 'spokojnie', 'średnio', 'średnio', 'szybko', 'szybko', 'bardzo szybko', 'natychmiast'];

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const MOD = isMac ? '⌘' : 'Ctrl';
export const SHORTCUTS: [string, string][] = [
  [`${MOD} + Enter`, 'Uruchom cały program'],
  [`${MOD} + Shift + Enter`, 'Wykonaj jedno polecenie (krok)'],
  [`${MOD} + .`, 'Pauza / wznów'],
  [`${MOD} + Shift + Backspace`, 'Reset: wyczyść rysunek'],
  ['Escape, potem Tab', 'Wyjdź z edytora klawiaturą'],
  ['Strzałki, +, −, 0', 'Przesuń, przybliż, dopasuj (na rysunku)'],
];

const HOME_POSE = (): TurtlePose => ({ pos: [0, 0, 0], h: [0, 1, 0], r: [1, 0, 0], u: [0, 0, 1], pen: true, color: '#16866a' });

export class Studio {
  el: HTMLElement;
  editor: Editor;
  mode: Mode = '2d';
  private drafts: Record<Mode, string>;
  private names: Record<Mode, string>;
  private state: RunState = 'idle';
  private machine: Machine | null = null;
  private iter: Iterator<unknown> | null = null;
  private budget = 0;
  private lastT = 0;
  private loop = 0;
  private speed: number;
  private view2d!: View2D;
  private view3d: View3D | null = null;
  private view3dLoading: Promise<View3D | null> | null = null;
  private noGL: string | null;
  private execLine = 0;
  private lastError: { message: string; line: number; column: number } | null = null;
  private $ = <T extends HTMLElement>(sel: string) => this.el.querySelector(sel) as T;

  constructor() {
    this.noGL = webglAvailable();
    this.speed = Number(store.get('speed') ?? 6);
    if (!(this.speed >= 1 && this.speed <= 10)) this.speed = 6;
    const m = store.get('mode');
    this.mode = m === '3d' ? '3d' : '2d';
    this.drafts = {
      '2d': store.get('draft.2d') ?? EXAMPLES[0].source,
      '3d': store.get('draft.3d') ?? EXAMPLES.find((e) => e.id === 'schody')!.source,
    };
    this.names = { '2d': store.get('name.2d') ?? 'Kwadrat', '3d': store.get('name.3d') ?? 'Schody' };
    this.el = document.createElement('section');
    this.el.className = 'studio';
    this.el.dataset.pane = 'code';
    this.el.setAttribute('aria-label', 'Studio');
    this.editor = new Editor('Kod programu w języku Logo', 'kod');
    this.render();
    this.editor.value = this.drafts[this.mode];
    this.editor.onInput = (v) => this.edited(v);
    this.editor.onKey = (e) => this.shortcut(e);
  }

  private render() {
    const exampleCells = EXAMPLES.map((e) => `
      <li><button type="button" class="ex-cell" data-example="${e.id}">
        <canvas class="ex-thumb" aria-hidden="true" data-thumb="${e.id}"></canvas>
        <span class="ex-name">${e.title}<span class="ex-mode">${e.mode.toUpperCase()}</span></span>
        <span class="ex-blurb">${e.blurb}</span>
      </button></li>`).join('');
    this.el.innerHTML = `
      <div class="pane-switch" role="tablist" aria-label="Widok">
        <button type="button" role="tab" id="tab-code" aria-controls="pane-code" data-pane="code" aria-selected="true">${icon('pen')}Kod</button>
        <button type="button" role="tab" id="tab-sheet" aria-controls="pane-sheet" data-pane="sheet" aria-selected="false">${icon('image')}Rysunek</button>
      </div>
      <div class="code-pane" id="pane-code" role="region" aria-label="Kod">
        <div class="code-bar">
          <div class="seg" role="radiogroup" aria-label="Tryb rysowania">
            <button type="button" role="radio" data-mode="2d">2D</button>
            <button type="button" role="radio" data-mode="3d"${this.noGL ? ' title="' + this.noGL + '"' : ''}>3D</button>
          </div>
          <button type="button" class="btn" popovertarget="examples" id="examples-btn">${icon('book')}<span>Przykłady</span></button>
          <span class="bar-gap"></span>
          <div class="file-actions" role="group" aria-label="Plik i udostępnianie">
            <button type="button" class="btn icon-only" data-act="open" aria-label="Otwórz plik .logo" title="Otwórz plik .logo">${icon('open')}</button>
            <button type="button" class="btn icon-only" data-act="save" aria-label="Pobierz program jako plik .logo" title="Pobierz .logo">${icon('download')}</button>
            <button type="button" class="btn icon-only" data-act="link" aria-label="Skopiuj link do programu" title="Skopiuj link">${icon('link')}</button>
            <button type="button" class="btn icon-only" data-act="png" aria-label="Zapisz rysunek jako PNG" title="Zapisz PNG">${icon('image')}</button>
          </div>
          <input type="file" accept=".logo,.txt,text/plain" hidden id="file-input" />
        </div>
        <div class="editor-slot"></div>
      </div>
      <div class="dock">
        <div class="status" role="status" aria-live="polite">
          <span class="status-dot" aria-hidden="true"></span>
          <span class="status-text"></span>
          <button type="button" class="link-btn" data-act="goto-error" hidden>Pokaż w kodzie</button>
        </div>
        <div class="run-bar" role="toolbar" aria-label="Wykonanie programu">
          <button type="button" class="btn primary" data-act="run" aria-keyshortcuts="Control+Enter Meta+Enter">${icon('play')}<span>Uruchom</span></button>
          <button type="button" class="btn" data-act="step" aria-keyshortcuts="Control+Shift+Enter Meta+Shift+Enter">${icon('step')}<span>Krok</span></button>
          <button type="button" class="btn" data-act="pause" aria-keyshortcuts="Control+. Meta+.">${icon('pause')}<span>Pauza</span></button>
          <button type="button" class="btn" data-act="reset" aria-keyshortcuts="Control+Shift+Backspace Meta+Shift+Backspace">${icon('reset')}<span>Reset</span></button>
          <label class="speed">
            <span class="speed-label">Tempo</span>
            <input type="range" min="1" max="10" step="1" value="${this.speed}" aria-valuetext="${SPEED_NAMES[this.speed - 1]}" />
          </label>
          <button type="button" class="btn icon-only ghost" popovertarget="shortcuts" aria-label="Skróty klawiszowe" title="Skróty klawiszowe">${icon('keyboard')}</button>
        </div>
      </div>
      <div class="sheet-pane" id="pane-sheet" role="region" aria-label="Rysunek">
        <div class="sheet" data-mode="${this.mode}">
          <div class="sheet-host host-2d"></div>
          <div class="sheet-host host-3d" hidden></div>
          <div class="nogl" hidden><p></p></div>
          <div class="view-tools" role="toolbar" aria-label="Widok rysunku">
            <button type="button" class="tool" data-act="zoom-in" aria-label="Przybliż" title="Przybliż">${icon('plus')}</button>
            <button type="button" class="tool" data-act="zoom-out" aria-label="Oddal" title="Oddal">${icon('minus')}</button>
            <button type="button" class="tool" data-act="fit" aria-label="Dopasuj widok do rysunku" title="Dopasuj">${icon('fit')}</button>
            <button type="button" class="tool" data-act="camera" aria-label="Przywróć kamerę" title="Przywróć kamerę" hidden>${icon('camera')}</button>
          </div>
          <dl class="title-block" aria-label="Tabliczka rysunku">
            <div class="tb-name"><dt>Arkusz</dt><dd data-tb="name"></dd></div>
            <div><dt>Tryb</dt><dd data-tb="mode"></dd></div>
            <div><dt>Skala</dt><dd data-tb="scale"></dd></div>
            <div><dt>Odcinki</dt><dd data-tb="segs"></dd></div>
            <div><dt>Kierunek</dt><dd data-tb="head"></dd></div>
            <div class="tb-wide"><dt>Żółw</dt><dd data-tb="pos"></dd></div>
            <div class="tb-wide"><dt>Pisak</dt><dd data-tb="pen"></dd></div>
          </dl>
        </div>
      </div>
      <div id="examples" popover class="pop examples-pop" aria-label="Przykłady">
        <div class="pop-head"><h2>Przykłady</h2><button type="button" class="btn icon-only ghost" popovertarget="examples" popovertargetaction="hide" aria-label="Zamknij">${icon('cross')}</button></div>
        <p class="pop-note">Wczytanie przykładu zachowuje Twój szkic — możesz go przywrócić.</p>
        <ul class="ex-grid">${exampleCells}</ul>
        <button type="button" class="btn restore" data-act="restore" hidden>${icon('restore')}<span>Przywróć poprzedni szkic</span></button>
      </div>
      <div id="shortcuts" popover class="pop shortcuts-pop" aria-label="Skróty klawiszowe">
        <div class="pop-head"><h2>Skróty klawiszowe</h2><button type="button" class="btn icon-only ghost" popovertarget="shortcuts" popovertargetaction="hide" aria-label="Zamknij">${icon('cross')}</button></div>
        <dl class="keys">${SHORTCUTS.map(([k, v]) => `<div><dt><kbd>${k}</kbd></dt><dd>${v}</dd></div>`).join('')}</dl>
      </div>`;
    this.$('.editor-slot').appendChild(this.editor.root);
    this.view2d = new View2D(this.$('.host-2d'));
    this.view2d.pose = HOME_POSE();
    this.view2d.onChange = () => this.updateTitleBlock();
    this.bind();
    this.applyMode();
    this.setStatus('Gotowe do uruchomienia. Naciśnij Uruchom albo Krok.', 'idle');
  }

  private bind() {
    this.el.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      if (b.dataset.mode) return this.setMode(b.dataset.mode as Mode);
      if (b.dataset.pane) return this.showPane(b.dataset.pane as 'code' | 'sheet');
      if (b.dataset.example) {
        const ex = EXAMPLES.find((x) => x.id === b.dataset.example)!;
        (this.$('#examples') as HTMLElement & { hidePopover(): void }).hidePopover();
        this.loadExample(ex);
        return;
      }
      const act = b.dataset.act;
      if (!act) return;
      const actions: Record<string, () => void> = {
        run: () => this.run(),
        step: () => this.step(),
        pause: () => this.togglePause(),
        reset: () => this.reset(),
        'zoom-in': () => this.zoom(1.25),
        'zoom-out': () => this.zoom(0.8),
        fit: () => this.fit(),
        camera: () => this.view3d?.resetCamera(),
        'goto-error': () => { this.showPane('code'); this.editor.focusError(); },
        open: () => this.$<HTMLInputElement>('#file-input').click(),
        save: () => this.download(),
        link: () => this.copyLink(),
        png: () => this.exportPNG(),
        restore: () => this.restoreBackup(),
      };
      actions[act]?.();
    });
    const range = this.$<HTMLInputElement>('.speed input');
    range.addEventListener('input', () => {
      this.speed = Number(range.value);
      range.setAttribute('aria-valuetext', SPEED_NAMES[this.speed - 1]);
      store.set('speed', String(this.speed));
    });
    this.$<HTMLInputElement>('#file-input').addEventListener('change', (e) => this.openFile(e));
    const pop = this.$('#examples');
    pop.addEventListener('toggle', (e) => {
      if ((e as ToggleEvent).newState === 'open') {
        this.drawThumbs();
        this.$('[data-act="restore"]').hidden = !store.get(`backup.${this.mode}`);
      }
    });
    this.el.addEventListener('keydown', (e) => {
      if (e.target !== this.editor.ta) this.shortcut(e);
    });
    const radios = [...this.el.querySelectorAll<HTMLButtonElement>('.seg [data-mode]')];
    radios.forEach((r) => r.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      const next = radios[(radios.indexOf(r) + 1) % radios.length];
      this.setMode(next.dataset.mode as Mode);
      next.focus();
    }));
  }

  private thumbsDrawn = false;
  private drawThumbs() {
    if (this.thumbsDrawn) return;
    this.thumbsDrawn = true;
    for (const ex of EXAMPLES) {
      const c = this.el.querySelector(`[data-thumb="${ex.id}"]`) as HTMLCanvasElement;
      drawPreview(c, [{ segments: interpret(ex.source, ex.mode).segments, style: 'normal' }], ex.mode, { widthScale: 0.6 });
    }
  }

  shortcut(e: KeyboardEvent): boolean {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return false;
    let f: (() => void) | null = null;
    if (e.key === 'Enter' && e.shiftKey) f = () => this.step();
    else if (e.key === 'Enter') f = () => this.run();
    else if (e.key === '.' && !e.shiftKey) f = () => this.togglePause();
    else if (e.key === 'Backspace' && e.shiftKey) f = () => this.reset();
    if (!f) return false;
    e.preventDefault();
    f();
    return true;
  }

  showPane(p: 'code' | 'sheet') {
    this.el.dataset.pane = p;
    this.el.querySelectorAll<HTMLButtonElement>('.pane-switch [data-pane]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.pane === p)));
    if (p === 'sheet') requestAnimationFrame(() => this.currentView()?.fitIfNeeded());
  }

  // ---------- drafts and modes ----------

  private edited(v: string) {
    this.drafts[this.mode] = v;
    store.set(`draft.${this.mode}`, v);
    if (this.names[this.mode] !== 'Szkic' && !EXAMPLES.some((e) => e.source === v)) this.setName('Szkic');
    if (this.state === 'running' || this.state === 'paused') {
      this.halt();
      this.state = 'stopped';
      this.setStatus('Zatrzymano, bo kod się zmienił. Rysunek pokazuje stan sprzed zmiany — uruchom ponownie.', 'warn');
      this.syncButtons();
    } else if (this.state === 'error') {
      this.lastError = null;
      this.setStatus('Kod zmieniony. Uruchom ponownie, aby sprawdzić.', 'idle');
    }
  }

  private setName(n: string) {
    this.names[this.mode] = n;
    store.set(`name.${this.mode}`, n);
    this.updateTitleBlock();
  }

  setMode(m: Mode) {
    if (m === this.mode) return;
    this.halt();
    this.drafts[this.mode] = this.editor.value;
    this.mode = m;
    store.set('mode', m);
    this.editor.value = this.drafts[m];
    this.state = 'idle';
    this.machine = null;
    this.applyMode();
    this.clearDrawing();
    this.setStatus(`Tryb ${m.toUpperCase()}. Szkic tego trybu jest zapisany osobno.`, 'idle');
  }

  private applyMode() {
    this.el.querySelectorAll<HTMLButtonElement>('.seg [data-mode]').forEach((b) => {
      b.setAttribute('aria-checked', String(b.dataset.mode === this.mode));
      b.tabIndex = b.dataset.mode === this.mode ? 0 : -1;
    });
    const sheet = this.$('.sheet');
    sheet.dataset.mode = this.mode;
    const is3d = this.mode === '3d';
    this.$('.host-2d').hidden = is3d;
    this.$('.host-3d').hidden = !is3d || !!this.noGL;
    const nogl = this.$('.nogl');
    nogl.hidden = !(is3d && this.noGL);
    nogl.querySelector('p')!.textContent = this.noGL ?? '';
    this.$('.view-tools').hidden = is3d && !!this.noGL;
    this.$('[data-act="camera"]').hidden = !is3d;
    if (is3d && !this.noGL) this.ensure3d();
    this.syncButtons();
    this.updateTitleBlock();
  }

  ensure3d(): Promise<View3D | null> {
    if (this.noGL) return Promise.resolve(null);
    if (!this.view3dLoading) {
      this.view3dLoading = import('./view3d').then(({ View3D }) => {
        try {
          const v = new View3D(this.$('.host-3d'));
          v.onChange = () => this.updateTitleBlock();
          v.segments = this.mode === '3d' && this.machine ? this.machine.segments : [];
          v.pose = this.mode === '3d' && this.machine ? this.poseOf(this.machine) : HOME_POSE();
          this.view3d = v;
          v.request();
          return v;
        } catch (err) {
          this.noGL = 'Nie udało się uruchomić widoku 3D (WebGL), więc jest wyłączony. Tryb 2D działa normalnie.';
          this.applyMode();
          return null;
        }
      }).catch(() => {
        this.noGL = 'Nie udało się wczytać modułu 3D. Tryb 2D działa normalnie.';
        this.applyMode();
        return null;
      });
    }
    return this.view3dLoading;
  }

  private currentView(): View2D | View3D | null {
    return this.mode === '3d' ? this.view3d : this.view2d;
  }

  /** Replace the editor text, keeping the previous draft recoverable. */
  replaceSource(src: string, mode: Mode, name: string, why: string) {
    const prev = this.mode === mode ? this.editor.value : this.drafts[mode];
    const isPristine = !prev.trim() || prev === src || EXAMPLES.some((e) => e.source === prev);
    if (!isPristine) store.set(`backup.${mode}`, prev);
    if (mode !== this.mode) this.setMode(mode);
    this.halt();
    this.editor.value = src;
    this.drafts[mode] = src;
    store.set(`draft.${mode}`, src);
    this.setName(name);
    if (!isPristine) {
      toast(`${why} Twój poprzedni szkic jest zachowany.`, { label: 'Przywróć szkic', run: () => this.restoreBackup() });
    }
  }

  loadExample(ex: Example) {
    this.replaceSource(ex.source, ex.mode, ex.title, `Wczytano przykład „${ex.title}”.`);
    this.run();
  }

  private restoreBackup() {
    const b = store.get(`backup.${this.mode}`);
    if (b === null) return;
    const cur = this.editor.value;
    this.halt();
    this.editor.value = b;
    this.drafts[this.mode] = b;
    store.set(`draft.${this.mode}`, b);
    if (cur.trim() && !EXAMPLES.some((e) => e.source === cur)) store.set(`backup.${this.mode}`, cur);
    else store.remove(`backup.${this.mode}`);
    this.setName('Szkic');
    (this.$('#examples') as HTMLElement & { hidePopover(): void }).hidePopover?.();
    this.state = 'idle';
    this.clearDrawing();
    this.setStatus('Przywrócono poprzedni szkic.', 'idle');
    this.editor.ta.focus();
  }

  // ---------- execution ----------

  private compileOrReport(): Machine | null {
    this.lastError = null;
    try {
      return new Machine(compile(this.editor.value, this.mode));
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      this.clearDrawing();
      this.fail(toError(e));
      return null;
    }
  }

  private start(): boolean {
    this.halt();
    const m = this.compileOrReport();
    if (!m) return false;
    this.machine = m;
    this.iter = m.run();
    this.attach();
    this.editor.setError(null);
    return true;
  }

  run() {
    if (!this.start()) return;
    this.state = 'running';
    if (SPEEDS[this.speed - 1] === Infinity) {
      this.drain();
      return;
    }
    this.setStatus('Rysuję…', 'run');
    this.syncButtons();
    this.lastT = performance.now();
    this.budget = 1;
    this.loop = requestAnimationFrame((t) => this.tick(t));
  }

  /** Run to the end without animation. */
  drain(): RunResult {
    while (this.state === 'running' && this.advance());
    this.refresh(true);
    return this.result();
  }

  private tick(t: number) {
    this.loop = 0;
    if (this.state !== 'running') return;
    const rate = SPEEDS[this.speed - 1];
    const dt = Math.min(0.25, (t - this.lastT) / 1000);
    this.lastT = t;
    if (rate === Infinity) { this.drain(); return; }
    this.budget += dt * rate;
    const t0 = performance.now();
    while (this.budget >= 1 && this.state === 'running') {
      this.budget -= 1;
      if (!this.advance()) break;
      if (performance.now() - t0 > 12) { this.budget = 0; break; }
    }
    this.refresh(false);
    if (this.state === 'running') this.loop = requestAnimationFrame((tt) => this.tick(tt));
  }

  /** Execute one command. Returns false when the program has ended. */
  private advance(): boolean {
    if (!this.iter || !this.machine) return false;
    try {
      const r = this.iter.next();
      if (r.done) { this.finish(); return false; }
      const tok = r.value as { line: number };
      this.execLine = tok.line;
      return true;
    } catch (e) {
      if (!(e instanceof LogoError)) throw e;
      this.iter = null;
      this.fail(toError(e));
      this.refresh(true);
      return false;
    }
  }

  step() {
    if (this.state === 'running') {
      this.state = 'paused';
    } else if (this.state !== 'paused') {
      if (!this.start()) return;
      this.state = 'paused';
    }
    this.cancelLoop();
    if (this.advance() && (this.state as RunState) === 'paused') {
      this.setStatus(`Krok: wiersz ${this.execLine}. Naciśnij Krok, aby wykonać następne polecenie.`, 'pause');
    }
    this.refresh(this.state !== 'paused');
    this.syncButtons();
  }

  togglePause() {
    if (this.state === 'running') {
      this.state = 'paused';
      this.cancelLoop();
      this.setStatus(`Pauza w wierszu ${this.execLine}.`, 'pause');
      this.refresh(false);
    } else if (this.state === 'paused') {
      this.state = 'running';
      this.setStatus('Rysuję…', 'run');
      this.lastT = performance.now();
      this.loop = requestAnimationFrame((t) => this.tick(t));
    }
    this.syncButtons();
  }

  reset() {
    this.halt();
    this.state = 'idle';
    this.machine = null;
    this.lastError = null;
    this.editor.setError(null);
    this.clearDrawing();
    this.setStatus('Wyczyszczono rysunek. Żółw wrócił na start.', 'idle');
    this.syncButtons();
  }

  private halt() {
    this.cancelLoop();
    this.iter = null;
    this.execLine = 0;
    this.editor.setExecLine(0);
  }

  private cancelLoop() {
    if (this.loop) cancelAnimationFrame(this.loop);
    this.loop = 0;
  }

  private finish() {
    this.state = 'done';
    this.iter = null;
    this.execLine = 0;
    const m = this.machine!;
    this.setStatus(`Gotowe: ${plural(m.segments.length, 'odcinek', 'odcinki', 'odcinków')}, ${plural(m.ops, 'operacja', 'operacje', 'operacji')}.`, 'ok');
    this.syncButtons();
  }

  private fail(err: { message: string; line: number; column: number }) {
    this.state = 'error';
    this.lastError = err;
    this.execLine = 0;
    this.editor.setExecLine(0);
    this.editor.setError(err);
    this.setStatus(`Wiersz ${err.line}, kolumna ${err.column}: ${err.message}`, 'error');
    this.syncButtons();
  }

  result(): RunResult {
    return { segments: this.machine ? this.machine.segments.map((s) => ({ ...s, from: [...s.from], to: [...s.to] })) : [], error: this.lastError };
  }

  private poseOf(m: Machine): TurtlePose {
    return { pos: m.pos, h: m.h, r: m.r, u: m.u, pen: m.pen, color: m.color };
  }

  private attach() {
    const m = this.machine!;
    this.view2d.segments = m.segments;
    this.view2d.pose = this.poseOf(m);
    if (this.view3d) { this.view3d.segments = m.segments; this.view3d.pose = this.poseOf(m); }
  }

  /** Push machine state to the views; at the end of a run, fit the drawing if it overflows. */
  private refresh(end: boolean) {
    const m = this.machine;
    if (m) this.attach();
    const live = this.state === 'running' || this.state === 'paused';
    this.editor.setExecLine(live ? this.execLine : 0);
    this.view2d.active = live;
    const v = this.currentView();
    if (!v) return;
    v.request();
    if (end) v.fitIfNeeded();
    else if (this.mode === '2d' && !this.view2d.touched) this.view2d.fitIfNeeded();
  }

  private clearDrawing() {
    this.view2d.segments = [];
    this.view2d.pose = HOME_POSE();
    this.view2d.request();
    if (this.view3d) { this.view3d.segments = []; this.view3d.pose = HOME_POSE(); this.view3d.request(); }
    this.updateTitleBlock();
  }

  private zoom(k: number) {
    if (this.mode === '3d') this.view3d?.zoom(k);
    else this.view2d.zoom(k);
  }

  fit() {
    this.currentView()?.fit();
  }

  /** Testing hook: load, run instantly, fit, and wait until painted. */
  async openProgram(src: string, mode: Mode): Promise<RunResult> {
    this.replaceSource(String(src), mode === '3d' ? '3d' : '2d', 'Szkic', 'Wczytano program.');
    if (this.mode === '3d') await this.ensure3d();
    if (this.start()) {
      this.state = 'running';
      this.drain();
    }
    this.showPane('sheet');
    const v = this.currentView();
    v?.fit();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (v && 'render' in v) v.render();
    else this.view2d.draw();
    return this.result();
  }

  // ---------- UI state ----------

  private setStatus(text: string, kind: 'idle' | 'run' | 'pause' | 'ok' | 'error' | 'warn') {
    const s = this.$('.status');
    s.dataset.kind = kind;
    this.$('.status-text').textContent = text;
    this.$('[data-act="goto-error"]').hidden = kind !== 'error';
  }

  private syncButtons() {
    const pause = this.$<HTMLButtonElement>('[data-act="pause"]');
    const can = this.state === 'running' || this.state === 'paused';
    pause.disabled = !can;
    pause.innerHTML = this.state === 'paused' ? `${icon('resume')}<span>Wznów</span>` : `${icon('pause')}<span>Pauza</span>`;
    this.el.dataset.run = this.state;
  }

  updateTitleBlock() {
    const set = (k: string, v: string) => { const d = this.el.querySelector(`[data-tb="${k}"]`); if (d && d.textContent !== v) d.textContent = v; };
    const m = this.machine;
    const pose = m ? this.poseOf(m) : HOME_POSE();
    set('name', this.names[this.mode]);
    set('mode', this.mode.toUpperCase());
    set('segs', String(m ? m.segments.length : 0));
    const f = (n: number) => fmt(n);
    if (this.mode === '2d') {
      set('pos', `x ${f(pose.pos[0])}  y ${f(pose.pos[1])}`);
      const deg = (Math.atan2(pose.h[0], pose.h[1]) * 180) / Math.PI;
      set('head', `${f(((deg % 360) + 360) % 360)}°`);
      set('scale', `${fmt(this.view2d.scale * 100)}%`);
    } else {
      set('pos', `${f(pose.pos[0])}; ${f(pose.pos[1])}; ${f(pose.pos[2])}`);
      set('head', `${f(pose.h[0])}; ${f(pose.h[1])}; ${f(pose.h[2])}`);
      set('scale', 'perspektywa');
    }
    set('pen', `${pose.pen ? 'opuszczony' : 'podniesiony'}`);
    const dd = this.el.querySelector('[data-tb="pen"]') as HTMLElement | null;
    if (dd) dd.style.setProperty('--pen', m ? m.color : '#16866a');
  }

  refreshTheme() {
    this.view2d.refreshPalette();
    this.view3d?.refreshPalette();
    this.thumbsDrawn = false;
  }

  // ---------- files and sharing ----------

  private fileName(ext: string) {
    const base = this.names[this.mode].normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/Ł/g, 'L')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'szkic';
    return `${base}-${this.mode}.${ext}`;
  }

  private download() {
    saveBlob(new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' }), this.fileName('logo'));
    toast(`Pobrano plik ${this.fileName('logo')}.`);
  }

  private async openFile(e: Event) {
    const input = e.target as HTMLInputElement;
    const f = input.files?.[0];
    input.value = '';
    if (!f) return;
    if (f.size > 200_000) { toast('Ten plik jest za duży jak na program Logo (limit 50 000 znaków).'); return; }
    const text = (await f.text()).replace(/\r\n?/g, '\n');
    const needs3d = /(^|[\s[\]])(gora|góra|dol|dół|pp|pl|przechylprawo|przechyllewo|pitchup|pitchdown|rollright|rollleft|rr|rl)(?=[\s[\]]|$)/im.test(text.replace(/;[^\n]*/g, ''));
    const mode: Mode = /-3d\.logo$/i.test(f.name) || needs3d ? '3d' : /-2d\.logo$/i.test(f.name) ? '2d' : this.mode;
    const name = f.name.replace(/(-[23]d)?\.(logo|txt)$/i, '') || 'Szkic';
    this.replaceSource(text, mode, name, `Otwarto plik ${f.name}.`);
    this.run();
  }

  permalink(): string {
    const base = location.href.split('#')[0];
    return `${base}#/kod?tryb=${this.mode}&p=${encodeProgram(this.editor.value)}`;
  }

  private async copyLink() {
    const url = this.permalink();
    try {
      await navigator.clipboard.writeText(url);
      toast('Skopiowano link do programu. Kto go otworzy, zobaczy ten sam rysunek.');
    } catch {
      history.replaceState(null, '', url);
      toast('Link jest w pasku adresu — skopiuj go stamtąd.');
    }
  }

  private async exportPNG() {
    const v = this.mode === '3d' ? this.view3d : this.view2d;
    if (!v) { toast('Widok 3D jest wyłączony, więc nie ma czego zapisać.'); return; }
    const blob = await v.toPNG();
    if (!blob) { toast('Nie udało się zapisać obrazu.'); return; }
    saveBlob(blob, this.fileName('png'));
    toast(`Zapisano rysunek ${this.fileName('png')}.`);
  }
}

export function saveBlob(blob: Blob, name: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function fmt(n: number) {
  const r = Math.round(n * 10) / 10;
  return (Object.is(r, -0) ? 0 : r).toLocaleString('pl-PL', { maximumFractionDigits: 1 });
}

export function plural(n: number, one: string, few: string, many: string) {
  const w = n === 1 ? one : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? few : many;
  return `${n.toLocaleString('pl-PL')} ${w}`;
}
