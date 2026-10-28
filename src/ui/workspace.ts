import { EXAMPLES, findExample } from '../data/examples';
import { guessMode, programFileName, readTextFile, downloadProgram, downloadBlob, slug } from './files';
import { LogoError, parse, type Mode, type Segment } from '../lang';
import { isUserDraft } from './dirty';
import { debounce, h, icon, nextFrame, uid, type IconName } from './dom';
import { Editor } from './editor';
import { Runner, SPEEDS, odcinkow, type RunState } from './runner';
import { shareDialog, stashDialog } from './dialogs';
import { hrefFor, replaceHash } from './router';
import { Settings, Stash } from './store';
import { tooltip } from './shortcuts';
import { toast } from './toast';
import { type Scene, type View } from './view/common';
import { View2D } from './view/view2d';
import { View3D } from './view/view3d';

export interface WorkspaceOptions {
  initialMode: Mode;
  /** Czy użytkownik może przełączać tryb 2D/3D. */
  modeSwitch: boolean;
  /** Tekst edytora dla trybu (np. zapisany szkic). */
  load(mode: Mode): string;
  /** Zapis tekstu po każdej zmianie. */
  persist(mode: Mode, text: string): void;
  /** Teksty uznawane za „nietknięte” (szablon zadania), których nie trzeba zachowywać. */
  pristine?: () => string[];
  /** Czy pokazywać listę przykładów. */
  examples?: boolean;
  ariaLabel?: string;
  /** Wywoływane przy zmianie trybu. */
  onMode?(mode: Mode): void;
  /** Wywoływane po każdej zmianie kodu użytkownika. */
  onEdit?(): void;
}

export interface ReplaceOptions {
  mode?: Mode;
  title?: string | null;
  /** Wykonaj od razu, bez animacji. */
  run?: boolean;
  /** Nie zachowuj poprzedniego szkicu (np. gdy zastępuje go sam użytkownik). */
  stash?: boolean;
  quiet?: boolean;
}

const MODE_LABEL: Record<Mode, string> = { '2d': 'Płaszczyzna (2D)', '3d': 'Przestrzeń (3D)' };

export class Workspace {
  readonly el: HTMLElement;
  readonly editor: Editor;
  readonly runner: Runner;
  /** Miejsce nad edytorem — np. opis zadania. */
  readonly topSlot: HTMLElement;
  /** Miejsce w przyborniku widoku — np. przełącznik wzoru. */
  readonly viewToolsSlot: HTMLElement;
  mode: Mode;
  title: string | null = null;
  private views: Partial<Record<Mode, View>> = {};
  private view!: View;
  private viewHost: HTMLElement;
  private buttons: Record<string, HTMLButtonElement> = {};
  private modeInputs: Partial<Record<Mode, HTMLInputElement>> = {};
  private speedInput!: HTMLInputElement;
  private speedLabel!: HTMLElement;
  private statusEl: HTMLElement;
  private statusBar: HTMLElement;
  private gotoErrorBtn: HTMLButtonElement;
  private caretEl: HTMLElement;
  private badge: HTMLElement;
  private stashCount!: HTMLElement;
  private fileInput: HTMLInputElement;
  private validate: ReturnType<typeof debounce<[]>>;
  private currentError: LogoError | null = null;
  private runState: RunState = 'idle';
  private disposed = false;
  private splitter!: HTMLElement;

  constructor(private opts: WorkspaceOptions) {
    this.mode = opts.initialMode;

    this.editor = new Editor({
      ariaLabel: opts.ariaLabel ?? 'Edytor programu Logo',
      placeholder: '; Wpisz program, np. powtorz 4 [np 100 pw 90]',
      onInput: (text) => this.onUserEdit(text),
      onCaret: (l, c) => {
        this.caretEl.textContent = `Wiersz ${l}, kolumna ${c}`;
      },
    });

    this.runner = new Runner({
      scene: (s) => this.onScene(s),
      line: (l) => this.editor.setActiveLine(l),
      state: (s) => this.onState(s),
      error: (e) => this.onError(e),
      finished: (info) => this.onFinished(info),
      message: (m) => this.setStatus(m),
    });
    this.runner.speed = Settings.speed;

    this.topSlot = h('div', { class: 'code-top' });
    this.viewToolsSlot = h('div', { class: 'view-tools-slot' });
    this.viewHost = h('div', { class: 'view-host' });
    this.caretEl = h('span', { class: 'caret-pos', 'aria-hidden': 'true' }, 'Wiersz 1, kolumna 1');
    const statusId = uid('status');
    this.statusEl = h('p', { id: statusId, class: 'status-text', role: 'status', 'aria-live': 'polite', onclick: () => this.editor.selectError() });
    this.editor.textarea.setAttribute('aria-describedby', statusId);
    this.gotoErrorBtn = h('button', { class: 'btn btn-sm status-goto', type: 'button', hidden: true, onclick: () => this.editor.selectError() }, 'Pokaż błąd w kodzie');
    this.statusBar = h('div', { class: 'statusbar' }, this.statusEl, this.gotoErrorBtn, this.caretEl);
    this.badge = h('div', { class: 'view-badge', 'aria-hidden': 'true' });
    this.fileInput = h('input', {
      type: 'file',
      accept: '.logo,.txt,text/plain',
      class: 'sr-only',
      tabindex: '-1',
      'aria-label': 'Wybierz plik programu (.logo)',
      onchange: () => void this.onFilePicked(),
    });

    const transport = this.buildTransport();
    const fileBar = this.buildFileBar();
    const hint = h('div', { class: 'view-hint', 'aria-hidden': 'true' });
    const tools = this.buildViewTools();

    const codePane = h(
      'section',
      { class: 'pane pane-code', 'aria-label': 'Kod programu' },
      this.topSlot,
      fileBar,
      this.editor.el,
      this.statusBar,
    );
    const viewPane = h(
      'section',
      { class: 'pane pane-view', 'aria-label': 'Rysunek żółwia' },
      this.viewHost,
      this.badge,
      hint,
      tools,
    );
    const splitEl = h('div', { class: 'split' }, codePane, viewPane);
    this.splitter = this.buildSplitter(splitEl);
    splitEl.append(this.splitter);
    this.el = h('div', { class: 'workspace' }, transport, splitEl, this.fileInput);
    this.applySplit(Settings.split);

    this.validate = debounce(() => this.liveValidate(), 280);
    this.bindDrop();
    this.bindLayoutHelpers(tools);

    this.switchView(this.mode);
    this.runner.refresh();
    const initial = opts.load(this.mode);
    this.editor.setValue(initial);
    this.updateHint();
    this.refreshStashCount();
    this.updateButtons();
    this.setStatus('Gotowe do uruchomienia.');
  }

  /**
   * Pomocnicze zachowania układu: pas zasłonięty przez przybornik (dopasowanie widoku go omija)
   * oraz tryb „pisania” na niskich ekranach (klawiatura ekranowa) — wtedy rysunek się zwija.
   */
  private bindLayoutHelpers(tools: HTMLElement): void {
    const update = () => {
      if (!this.view) return;
      const narrow = this.viewHost.clientWidth < 640;
      const next = narrow && tools.offsetHeight > 0 ? tools.offsetHeight + 14 : 0;
      for (const v of Object.values(this.views)) if (v && v.topInset !== next) {
        v.topInset = next;
        if (v.autoFit) v.fit(false);
      }
    };
    if (typeof ResizeObserver === 'function') {
      const ro = new ResizeObserver(update);
      ro.observe(this.viewHost);
      ro.observe(tools);
    }
    this.editor.textarea.addEventListener('focus', () => this.el.classList.add('editing'));
    this.editor.textarea.addEventListener('blur', () => this.el.classList.remove('editing'));
  }

  // ----- podział edytor / rysunek ---------------------------------------

  private applySplit(ratio: number): void {
    const r = Math.min(0.7, Math.max(0.25, ratio));
    this.el.style.setProperty('--code-w', `${(r * 100).toFixed(2)}%`);
    this.splitter?.setAttribute('aria-valuenow', String(Math.round(r * 100)));
    Settings.split = r;
  }

  private buildSplitter(split: HTMLElement): HTMLElement {
    const el = h('div', {
      class: 'splitter',
      role: 'separator',
      tabindex: '0',
      'aria-orientation': 'vertical',
      'aria-label': 'Szerokość edytora i rysunku',
      'aria-valuemin': '25',
      'aria-valuemax': '70',
      'aria-valuenow': '42',
      title: 'Przeciągnij, aby zmienić szerokość edytora (lub użyj strzałek)',
    });
    let dragging = false;
    const move = (clientX: number) => {
      const rect = split.getBoundingClientRect();
      this.applySplit((clientX - rect.left) / rect.width);
    };
    el.addEventListener('pointerdown', (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      el.classList.add('dragging');
      e.preventDefault();
    });
    el.addEventListener('pointermove', (e) => {
      if (dragging) move(e.clientX);
    });
    const end = (e: PointerEvent) => {
      dragging = false;
      el.classList.remove('dragging');
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('dblclick', () => this.applySplit(0.42));
    el.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 0.08 : 0.02;
      if (e.key === 'ArrowLeft') this.applySplit(Settings.split - step);
      else if (e.key === 'ArrowRight') this.applySplit(Settings.split + step);
      else if (e.key === 'Home') this.applySplit(0.25);
      else if (e.key === 'End') this.applySplit(0.7);
      else return;
      e.preventDefault();
    });
    return el;
  }

  /** Przeciągnięcie pliku .logo na obszar roboczy otwiera go. */
  private bindDrop(): void {
    const hasFiles = (e: DragEvent) => !!e.dataTransfer && [...e.dataTransfer.types].includes('Files');
    let depth = 0;
    this.el.addEventListener('dragenter', (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth++;
      this.el.classList.add('drop-target');
    });
    this.el.addEventListener('dragover', (e) => {
      if (hasFiles(e)) e.preventDefault();
    });
    this.el.addEventListener('dragleave', () => {
      depth = Math.max(0, depth - 1);
      if (depth === 0) this.el.classList.remove('drop-target');
    });
    this.el.addEventListener('drop', (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      depth = 0;
      this.el.classList.remove('drop-target');
      const f = e.dataTransfer?.files?.[0];
      if (f) void this.openFile(f);
    });
  }

  // ----- budowa interfejsu ---------------------------------------------

  private btn(id: string, label: string, ic: IconName, title: string, onclick: () => void, cls = ''): HTMLButtonElement {
    const b = h(
      'button',
      { class: `btn ${cls}`, type: 'button', title, 'aria-label': label, onclick },
      icon(ic, 18),
      h('span', { class: 'btn-label' }, label),
    );
    this.buttons[id] = b;
    return b;
  }

  private buildTransport(): HTMLElement {
    const gid = uid('mode');
    const modeGroup = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Tryb rysowania' });
    if (this.opts.modeSwitch) {
      for (const m of ['2d', '3d'] as const) {
        const input = h('input', {
          type: 'radio',
          name: gid,
          id: `${gid}-${m}`,
          value: m,
          checked: m === this.mode,
          class: 'seg-input',
          onchange: () => this.setMode(m),
        });
        this.modeInputs[m] = input;
        modeGroup.append(
          input,
          h('label', { class: 'seg-label', for: `${gid}-${m}`, title: MODE_LABEL[m] }, m === '2d' ? '2D' : '3D'),
        );
      }
    } else {
      modeGroup.append(h('span', { class: 'seg-fixed', title: MODE_LABEL[this.mode] }, this.mode === '2d' ? '2D' : '3D'));
      modeGroup.removeAttribute('role');
    }

    const speedId = uid('speed');
    this.speedInput = h('input', {
      type: 'range', id: speedId, min: '0', max: String(SPEEDS.length - 1), step: '1', value: String(Settings.speed),
      class: 'range', 'aria-label': 'Szybkość animacji',
      oninput: () => {
        const v = Number(this.speedInput.value);
        Settings.speed = v;
        this.runner.setSpeed(v);
        this.updateSpeedLabel();
      },
    });
    this.speedLabel = h('span', { class: 'speed-label', 'aria-hidden': 'true' });
    this.updateSpeedLabel();

    const run = this.btn('run', 'Uruchom', 'play', tooltip('Uruchom program', 'run'), () => this.run(), 'btn-primary');
    run.setAttribute('aria-keyshortcuts', 'Control+Enter F9');
    const step = this.btn('step', 'Krok', 'step', tooltip('Wykonaj jeden krok', 'step'), () => this.step());
    step.setAttribute('aria-keyshortcuts', 'Control+Shift+Enter F10');
    const pause = this.btn('pause', 'Pauza', 'pause', tooltip('Wstrzymaj', 'pause'), () => this.togglePause());
    pause.setAttribute('aria-keyshortcuts', 'Control+. F8');
    const reset = this.btn('reset', 'Reset', 'reset', tooltip('Zatrzymaj i wyczyść rysunek', 'reset'), () => this.reset());
    reset.setAttribute('aria-keyshortcuts', 'Escape');
    const share = this.btn('share', 'Link', 'link', 'Utwórz link do tego programu', () => void this.share());
    const png = this.btn('png', 'PNG', 'image', 'Zapisz rysunek jako obraz PNG', () => void this.exportPng());

    return h(
      'div',
      { class: 'transport', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      modeGroup,
      h('div', { class: 'btn-group' }, run, step, pause, reset),
      h('label', { class: 'speed', for: speedId }, h('span', { class: 'speed-title' }, 'Szybkość'), this.speedInput, this.speedLabel),
      h('span', { class: 'spacer' }),
      h('div', { class: 'btn-group transport-share' }, share, png),
    );
  }

  private buildFileBar(): HTMLElement {
    const bar = h('div', { class: 'filebar', role: 'toolbar', 'aria-label': 'Pliki i przykłady' });
    if (this.opts.examples) {
      const sel = h('select', {
        class: 'select',
        'aria-label': 'Wczytaj przykładowy program',
        title: 'Wczytaj przykładowy program',
        onchange: () => {
          const id = sel.value;
          sel.value = '';
          if (id) this.loadExample(id);
        },
      });
      sel.append(h('option', { value: '' }, 'Przykłady…'));
      for (const m of ['2d', '3d'] as const) {
        const g = h('optgroup', { label: m === '2d' ? 'Płaszczyzna (2D)' : 'Przestrzeń (3D)' });
        for (const e of EXAMPLES.filter((x) => x.mode === m)) g.append(h('option', { value: e.id }, e.name));
        sel.append(g);
      }
      bar.append(sel);
    }
    this.stashCount = h('span', { class: 'count', 'aria-hidden': 'true' });
    bar.append(
      h('button', { class: 'btn btn-sm', type: 'button', title: 'Otwórz program z pliku .logo', onclick: () => this.fileInput.click() }, icon('upload', 16), h('span', { class: 'btn-label' }, 'Otwórz'), h('span', { class: 'sr-only' }, ' plik')),
      h('button', { class: 'btn btn-sm', type: 'button', title: `${tooltip('Pobierz program jako plik .logo', 'save')}`, onclick: () => this.download() }, icon('download', 16), h('span', { class: 'btn-label' }, 'Pobierz'), h('span', { class: 'sr-only' }, ' plik .logo')),
      h('button', { class: 'btn btn-sm', type: 'button', title: 'Zachowane szkice — kopie programów zastąpionych innymi', onclick: () => stashDialog(this) }, icon('layers', 16), h('span', { class: 'btn-label' }, 'Szkice'), this.stashCount),
    );
    return bar;
  }

  private buildViewTools(): HTMLElement {
    const mk = (label: string, ic: IconName, fn: () => void) =>
      h('button', { class: 'icon-btn tool', type: 'button', title: label, 'aria-label': label, onclick: fn }, icon(ic, 18));
    const preset = (label: string, title: string, kind: 'top' | 'front' | 'side') =>
      h('button', {
        class: 'btn btn-sm btn-ghost tool-3d', type: 'button', title, 'aria-label': title,
        onclick: () => this.view.preset?.(kind),
      }, label);
    return h(
      'div',
      { class: 'view-tools', role: 'toolbar', 'aria-label': 'Widok rysunku' },
      this.viewToolsSlot,
      preset('Góra', 'Widok z góry (tak jak w trybie 2D)', 'top'),
      preset('Przód', 'Widok z przodu', 'front'),
      preset('Bok', 'Widok z boku', 'side'),
      (() => { const b = mk('Utwórz link do tego programu', 'link', () => void this.share()); b.classList.add('tool-mobile'); return b; })(),
      (() => { const b = mk('Zapisz rysunek jako obraz PNG', 'image', () => void this.exportPng()); b.classList.add('tool-mobile'); return b; })(),
      (() => { const b = mk('Przybliż', 'zoomIn', () => this.view.zoomBy(1.4)); b.classList.add('tool-zoom'); return b; })(),
      (() => { const b = mk('Oddal', 'zoomOut', () => this.view.zoomBy(1 / 1.4)); b.classList.add('tool-zoom'); return b; })(),
      mk('Dopasuj widok do rysunku', 'fit', () => {
        this.view.autoFit = true;
        this.view.fit(true);
      }),
      mk('Resetuj widok (przywróć domyślną kamerę)', 'target', () => this.view.resetView()),
    );
  }

  private updateSpeedLabel(): void {
    const s = SPEEDS[Number(this.speedInput.value)]!;
    this.speedLabel.textContent = s.label;
    this.speedInput.setAttribute('aria-valuetext', s.label);
  }

  private updateHint(): void {
    this.el.dataset.mode = this.mode;
    const hint = this.el.querySelector('.view-hint');
    if (!hint) return;
    hint.textContent =
      this.mode === '3d'
        ? 'Przeciągnij — obrót · Shift lub prawy przycisk — przesuwanie · kółko — zbliżenie'
        : 'Przeciągnij — przesuwanie · kółko — zbliżenie · dwuklik — dopasowanie';
  }

  // ----- widoki ---------------------------------------------------------

  private switchView(mode: Mode): void {
    if (this.view) this.view.el.hidden = true;
    let v = this.views[mode];
    if (!v) {
      v = mode === '2d' ? new View2D() : new View3D();
      v.onUserCamera = () => this.el.classList.add('touched');
      v.topInset = this.viewHost.clientWidth < 640 && this.viewHost.clientWidth > 0 ? 54 : 0;
      this.views[mode] = v;
      this.viewHost.append(v.el);
    }
    v.el.hidden = false;
    this.view = v;
    v.autoFit = true;
    const s = this.lastScene;
    if (s) v.setScene(s);
    requestAnimationFrame(() => v!.fit(false));
  }

  private lastScene: Scene | null = null;

  private onScene(s: Scene): void {
    this.lastScene = s;
    this.view?.setScene(s);
    const n = s.count + (s.partial ? 1 : 0);
    this.badge.textContent = n > 0 ? `${n} ${odcinkow(n)}` : '';
  }

  getView(): View {
    return this.view;
  }

  // ----- stan ----------------------------------------------------------

  private onState(s: RunState): void {
    this.runState = s;
    this.el.dataset.run = s;
    this.updateButtons();
  }

  private updateButtons(): void {
    const s = this.runState;
    const pause = this.buttons.pause!;
    const running = s === 'running';
    const paused = s === 'paused';
    pause.disabled = !(running || paused);
    const label = paused ? 'Wznów' : 'Pauza';
    pause.setAttribute('aria-label', label);
    pause.title = tooltip(paused ? 'Wznów wykonanie' : 'Wstrzymaj wykonanie', 'pause');
    pause.querySelector('.btn-label')!.textContent = label;
    pause.replaceChild(icon(paused ? 'play' : 'pause', 18), pause.querySelector('svg')!);
    this.buttons.run!.classList.toggle('is-active', running);
  }

  private onError(e: LogoError | null): void {
    this.currentError = e;
    if (!e) {
      this.editor.setError(null);
      this.editor.textarea.removeAttribute('aria-invalid');
      this.statusBar.classList.remove('is-error');
      this.gotoErrorBtn.hidden = true;
      return;
    }
    this.editor.setError({ line: e.line, column: e.column, length: e.length, message: e.message, phase: e.phase });
    this.showErrorStatus(e);
  }

  private showErrorStatus(e: LogoError): void {
    const kind = e.phase === 'run' ? 'Błąd wykonania' : 'Błąd w programie';
    this.statusEl.textContent = `${kind} — wiersz ${e.line}, kolumna ${e.column}: ${e.message}`;
    this.statusEl.title = 'Kliknij, aby przejść do miejsca błędu';
    this.editor.textarea.setAttribute('aria-invalid', 'true');
    this.statusBar.classList.add('is-error');
    this.gotoErrorBtn.hidden = false;
  }

  private setStatus(text: string): void {
    if (this.currentError) return;
    this.statusEl.textContent = text;
    this.statusEl.title = '';
    this.editor.textarea.removeAttribute('aria-invalid');
    this.statusBar.classList.remove('is-error');
    this.gotoErrorBtn.hidden = true;
  }

  private onFinished(info: { segments: Segment[]; error: LogoError | null; ops: number; animated: boolean }): void {
    const v = this.view;
    if (v.autoFit) v.fit(true);
    const n = info.segments.length;
    v.setDescription(
      info.error
        ? `Rysunek żółwia, tryb ${this.mode.toUpperCase()}: ${n} ${odcinkow(n)}, program zakończył się błędem.`
        : `Rysunek żółwia, tryb ${this.mode.toUpperCase()}: ${n} ${odcinkow(n)}.`,
    );
  }

  // ----- działania ------------------------------------------------------

  /** Uruchamia program z animacją (zgodnie z ustawioną szybkością). */
  run(): void {
    this.prepareRun();
    this.runner.run(this.editor.value, this.mode, true);
    // przy animacji zaczynamy od domyślnego kadru; rysunek powiększa go w miarę potrzeby
    this.view.fit(false);
  }

  /** Uruchamia i kończy od razu; zwraca wynik. */
  runInstant(): { segments: Segment[]; error: LogoError | null } {
    this.prepareRun();
    const r = this.runner.run(this.editor.value, this.mode, false);
    const v = this.view;
    v.autoFit = true;
    v.fit(false);
    v.paintNow();
    return r;
  }

  private prepareRun(): void {
    this.validate.cancel();
    this.currentError = null;
    this.editor.setError(null);
    this.view.autoFit = true;
    this.el.classList.remove('touched');
  }

  step(): void {
    this.validate.cancel();
    const fresh = this.runState === 'idle' || this.runState === 'finished';
    if (fresh) this.prepareRun();
    this.runner.step(this.editor.value, this.mode);
    if (fresh) this.view.fit(false);
  }

  togglePause(): void {
    this.runner.togglePause();
  }

  reset(): void {
    this.validate.cancel();
    this.currentError = null;
    this.runner.reset();
    this.view.autoFit = true;
    this.view.fit(true);
    this.liveValidate();
  }

  setGhost(g: Segment[] | null): void {
    this.runner.setGhost(g);
    if (this.view.autoFit) this.view.fit(true);
  }

  /** Ustawia fokus w edytorze (poza ekranami dotykowymi, gdzie wysunęłaby się klawiatura ekranowa). */
  focusEditor(): void {
    if (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) return;
    this.editor.focus();
  }

  get source(): string {
    return this.editor.value;
  }

  /** Użytkownik zmienił kod. */
  private onUserEdit(text: string): void {
    this.opts.persist(this.mode, text);
    this.title = null;
    // adres z linkiem do udostępniania przestaje opisywać program, który właśnie zmieniono
    if (location.hash.includes('kod=')) replaceHash(hrefFor([]));
    const wasRunning = this.runState === 'running' || this.runState === 'paused';
    if (wasRunning) {
      this.runner.halt();
      this.currentError = null;
      this.editor.setError(null);
      this.setStatus('Zmiana kodu zatrzymała wykonanie — uruchom program ponownie (Ctrl+Enter).');
    } else if (this.currentError) {
      this.currentError = null;
      this.editor.setError(null);
      this.setStatus('Kod zmieniony.');
    }
    this.validate();
    this.opts.onEdit?.();
  }

  /** Sprawdza program w tle i pokazuje ewentualny błąd składni bez rysowania. */
  private liveValidate(): void {
    if (this.disposed || this.runState === 'running' || this.runState === 'paused') return;
    const text = this.editor.value;
    const r = parse(text, this.mode);
    if (r.error) {
      this.currentError = r.error;
      this.editor.setError({ line: r.error.line, column: r.error.column, length: r.error.length, message: r.error.message, phase: 'parse' });
      this.showErrorStatus(r.error);
    } else if (this.currentError) {
      this.currentError = null;
      this.editor.setError(null);
      this.setStatus(text.trim() ? 'Program wygląda poprawnie — uruchom go (Ctrl+Enter).' : 'Gotowe do uruchomienia.');
    }
  }

  // ----- tryb -----------------------------------------------------------

  setMode(mode: Mode, opts: { run?: boolean; text?: string } = {}): void {
    if (mode === this.mode && opts.text === undefined) {
      this.syncModeInputs();
      return;
    }
    this.validate.cancel();
    this.runner.reset();
    this.currentError = null;
    this.editor.setError(null);
    this.mode = mode;
    Settings.mode = mode;
    this.title = null;
    this.syncModeInputs();
    this.switchView(mode);
    this.updateHint();
    const text = opts.text ?? this.opts.load(mode);
    this.editor.setValue(text);
    if (opts.text !== undefined) this.opts.persist(mode, text);
    this.opts.onMode?.(mode);
    if (opts.run !== false && text.trim()) this.runInstant();
    else this.liveValidate();
  }

  private syncModeInputs(): void {
    for (const m of ['2d', '3d'] as const) {
      const i = this.modeInputs[m];
      if (i) i.checked = m === this.mode;
    }
  }

  // ----- zastępowanie kodu (z zachowaniem szkicu) -----------------------

  /** Tekst, który zostałby utracony przy wczytaniu czegoś w trybie `target`. */
  private atRisk(target: Mode): string {
    if (target === this.mode) return this.editor.value;
    return this.opts.load(target);
  }

  /**
   * Wczytuje kod do edytora. Jeśli zastępuje niezapisany szkic użytkownika,
   * szkic trafia do „Szkiców” i można go od razu przywrócić.
   */
  replaceSource(text: string, o: ReplaceOptions = {}): void {
    const target = this.opts.modeSwitch ? (o.mode ?? this.mode) : this.mode;
    const prev = this.atRisk(target);
    let undo: (() => void) | null = null;
    if (o.stash !== false && prev !== text && isUserDraft(prev, target, this.opts.pristine?.() ?? [])) {
      const entry = Stash.add(target, prev);
      this.refreshStashCount();
      const prevTitle = this.title;
      undo = () => {
        Stash.remove(entry.id);
        this.refreshStashCount();
        this.replaceSource(prev, { mode: target, stash: false, run: true, quiet: true, title: prevTitle });
      };
    }
    if (target !== this.mode) {
      this.setMode(target, { text, run: o.run !== false });
      this.title = o.title ?? null;
    } else {
      this.title = o.title ?? null;
      this.validate.cancel();
      this.runner.reset();
      this.currentError = null;
      this.editor.setError(null);
      this.editor.setValue(text);
      this.opts.persist(this.mode, text);
      if (o.run !== false) this.runInstant();
      else this.liveValidate();
    }
    this.opts.onEdit?.();
    if (undo && !o.quiet) {
      toast('Poprzedni szkic został zachowany w „Szkicach”.', { actionLabel: 'Cofnij', onAction: undo });
    }
  }

  loadExample(id: string): void {
    const ex = findExample(id);
    if (!ex) return;
    this.replaceSource(ex.source, { mode: ex.mode, title: ex.id, run: true });
    this.focusEditor();
    toast(`Wczytano przykład „${ex.name}” (${ex.mode.toUpperCase()}).`, { kind: 'ok' });
  }

  refreshStashCount(): void {
    const n = Stash.list().length;
    this.stashCount.textContent = n ? String(n) : '';
    this.stashCount.classList.toggle('on', n > 0);
  }

  // ----- pliki, obraz, link --------------------------------------------

  download(): void {
    downloadProgram(this.editor.value, programFileName(this.mode, this.title ?? 'logomocja'));
    toast('Program został pobrany jako plik .logo.', { kind: 'ok' });
  }

  private async onFilePicked(): Promise<void> {
    const f = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (!f) return;
    await this.openFile(f);
  }

  async openFile(f: File): Promise<void> {
    try {
      const text = await readTextFile(f);
      const mode = this.opts.modeSwitch ? guessMode(f.name, text, this.mode) : this.mode;
      this.replaceSource(text, { mode, title: slug(f.name.replace(/\.[^.]+$/, '')), run: true });
      toast(`Otwarto plik „${f.name}”.`, { kind: 'ok' });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Nie udało się otworzyć pliku.', { kind: 'error' });
    }
  }

  async exportPng(): Promise<void> {
    try {
      this.view.paintNow();
      const blob = await this.view.exportPng();
      downloadBlob(blob, `${slug(this.title ?? 'rysunek')}-${this.mode}.png`);
      const empty = !this.lastScene || this.lastScene.count === 0;
      toast(empty ? 'Rysunek jest pusty, więc zapisany obraz PNG jest biały.' : 'Rysunek zapisano jako obraz PNG.', { kind: empty ? 'info' : 'ok' });
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Nie udało się zapisać obrazu.', { kind: 'error' });
    }
  }

  async share(): Promise<void> {
    await shareDialog(this.mode, this.editor.value);
  }

  // ----- sterowanie z zewnątrz -----------------------------------------

  /** Pierwsze narysowanie szkicu po zbudowaniu strony. */
  init(): void {
    if (this.editor.value.trim()) this.runInstant();
    else this.liveValidate();
  }

  /** Czeka na namalowanie rysunku (do testów i zrzutów ekranu). */
  async settled(): Promise<void> {
    await nextFrame();
    this.view.paintNow();
    await nextFrame();
  }

  dispose(): void {
    this.disposed = true;
    this.runner.dispose();
    this.validate.cancel();
    this.editor.dispose();
    for (const v of Object.values(this.views)) v?.dispose();
  }

}

