import { h, svgIcon, ICONS, announce, debounce } from './dom';
import { CodeEditor } from './editor';
import { Runner, SPEEDS, SPEED_LABELS } from './runner';
import { View2D } from './view2d';
import { View3D } from './view3d';
import type { DrawingView } from './view';
import { EXAMPLES, DEFAULT_DRAFT, exampleById } from '../data/examples';
import * as store from './storage';
import { confirmDialog, modal } from './dialogs';
import { decodeSource, downloadBlob, downloadText, makePermalink, uses3d } from './share';
import type { LogoError, Mode, RunResult } from '../lang/types';
import type { Page } from './router';

const STATE_TEXT: Record<string, string> = {
  idle: 'Gotowe', running: 'Działa…', paused: 'Wstrzymano', done: 'Zakończono', error: 'Błąd',
};

export const SHORTCUTS: [string, string][] = [
  ['Ctrl + Enter  (⌘ + Enter)', 'Uruchom program od początku'],
  ['F10', 'Wykonaj jeden krok (podczas działania wstrzymuje program)'],
  ['F8', 'Wstrzymaj / wznów'],
  ['Esc', 'Zatrzymaj i wyczyść rysunek (reset)'],
  ['Strzałki (na rysunku)', '2D: przesuwanie, 3D: obracanie kamery; z Shift – przesuwanie'],
  ['+ / −  (na rysunku)', 'Przybliż / oddal'],
  ['0  (na rysunku)', '2D: dopasuj rysunek, 3D: zresetuj kamerę'],
];

export function showShortcuts(): void {
  void modal('Skróty klawiszowe', h('dl', { class: 'shortcuts' }, SHORTCUTS.flatMap(([k, d]) => [h('dt', null, h('kbd', null, k)), h('dd', null, d)])), [
    { label: 'Zamknij', value: 'ok', primary: true },
  ]);
}

export class Workspace implements Page {
  readonly el: HTMLElement;
  readonly title = 'Pracownia';
  readonly runner = new Runner();
  mode: Mode = store.loadMode();
  private editor: CodeEditor;
  private views: Partial<Record<Mode, DrawingView>> = {};
  private viewHost = h('div', { class: 'view-host' });
  private errorPanel = h('div', { class: 'error-panel', role: 'alert', hidden: true });
  private status = h('div', { class: 'statusbar', role: 'status' });
  private banner = h('div', { class: 'banner', role: 'status', hidden: true });
  private btnRun!: HTMLButtonElement;
  private btnStep!: HTMLButtonElement;
  private btnPause!: HTMLButtonElement;
  private btnReset!: HTMLButtonElement;
  private btnRestore!: HTMLButtonElement;
  private radios: Record<Mode, HTMLInputElement>;
  private select!: HTMLSelectElement;
  private fileInput!: HTMLInputElement;
  private speedOut = h('output', { class: 'speed-out' });

  constructor() {
    const draft = store.loadDraft(this.mode) ?? DEFAULT_DRAFT[this.mode];
    this.editor = new CodeEditor({
      value: draft,
      label: 'Edytor programu Logo',
      onChange: (v) => this.onEdit(v),
    });
    this.runner.speed = store.loadSpeed();
    this.runner.onChange = () => this.refresh();
    this.runner.onDraw = () => this.draw();
    this.radios = {
      '2d': h('input', { type: 'radio', name: 'mode', value: '2d', id: 'mode-2d', checked: this.mode === '2d', onChange: () => this.setMode('2d') }),
      '3d': h('input', { type: 'radio', name: 'mode', value: '3d', id: 'mode-3d', checked: this.mode === '3d', onChange: () => this.setMode('3d') }),
    };
    this.el = this.build();
    this.mountView();
    this.refresh();
    window.addEventListener('pagehide', () => store.saveDraft(this.mode, this.editor.value));
    // show the saved draft's drawing straight away
    requestAnimationFrame(() => {
      if (this.runner.state === 'idle' && !this.runner.machine && this.editor.value.trim()) {
        this.view().autoFit = true;
        this.runner.start(this.editor.value, this.mode, { instant: true });
      }
    });
  }

  // ---------- layout ----------

  private build(): HTMLElement {
    const segmented = h('fieldset', { class: 'segmented' },
      h('legend', { class: 'sr-only' }, 'Tryb rysowania'),
      this.radios['2d'], h('label', { for: 'mode-2d', title: 'Płaszczyzna (2D)' }, '2D'),
      this.radios['3d'], h('label', { for: 'mode-3d', title: 'Przestrzeń (3D)' }, '3D'),
    );

    this.select = h('select', { id: 'example-select', onChange: () => {
      const id = this.select.value;
      this.select.value = '';
      if (id) void this.requestExample(id);
    } },
      h('option', { value: '' }, 'Wybierz…'),
      h('optgroup', { label: 'Płaszczyzna (2D)' }, EXAMPLES.filter((e) => e.mode === '2d').map((e) => h('option', { value: e.id }, e.name))),
      h('optgroup', { label: 'Przestrzeń (3D)' }, EXAMPLES.filter((e) => e.mode === '3d').map((e) => h('option', { value: e.id }, e.name))),
    );

    const btn = (label: string, icon: string, onClick: () => void, extra: Record<string, unknown> = {}) =>
      h('button', { type: 'button', class: 'btn', onClick, ...extra }, svgIcon(icon), h('span', null, label));
    this.btnRun = btn('Uruchom', ICONS.play, () => this.run(), { class: 'btn primary', title: 'Uruchom (Ctrl+Enter)', 'aria-keyshortcuts': 'Control+Enter Meta+Enter' });
    this.btnStep = btn('Krok', ICONS.step, () => this.step(), { title: 'Wykonaj jeden krok (F10)', 'aria-keyshortcuts': 'F10' });
    this.btnPause = btn('Pauza', ICONS.pause, () => this.togglePause(), { title: 'Wstrzymaj / wznów (F8)', 'aria-keyshortcuts': 'F8' });
    this.btnReset = btn('Reset', ICONS.reset, () => this.reset(), { title: 'Zatrzymaj i wyczyść rysunek (Esc)', 'aria-keyshortcuts': 'Escape' });

    const speed = h('input', {
      type: 'range', id: 'speed', min: 1, max: 8, step: 1, value: this.runner.speed,
      onInput: () => {
        this.runner.speed = Number(speed.value);
        store.saveSpeed(this.runner.speed);
        this.updateSpeed();
        // changing to "instant" while running finishes the run at once
        if (this.runner.state === 'running' && SPEEDS[this.runner.speed - 1] === Infinity) {
          this.runner.pause();
          this.runner.resume();
        }
      },
    });
    this.updateSpeed = () => {
      const s = Number(speed.value);
      this.speedOut.textContent = SPEED_LABELS[s - 1];
      speed.setAttribute('aria-valuetext', SPEED_LABELS[s - 1]);
    };
    this.updateSpeed();

    this.fileInput = h('input', { type: 'file', accept: '.logo,.txt,text/plain', hidden: true, 'aria-label': 'Wybierz plik .logo', onChange: () => void this.onFile() });

    this.btnRestore = h('button', { type: 'button', class: 'btn subtle', onClick: () => void this.restoreBackup(), hidden: true, title: 'Przywróć szkic sprzed wczytania przykładu lub pliku' },
      svgIcon(ICONS.undo), h('span', null, 'Przywróć poprzedni szkic'));

    const toolbar = h('div', { class: 'toolbar', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      segmented,
      h('div', { class: 'field' }, h('label', { for: 'example-select' }, 'Przykład'), this.select),
      h('div', { class: 'btn-group' }, this.btnRun, this.btnStep, this.btnPause, this.btnReset),
      h('div', { class: 'field speed' }, h('label', { for: 'speed' }, 'Prędkość'), speed, this.speedOut),
    );

    const actions = h('div', { class: 'actions', role: 'group', 'aria-label': 'Udostępnianie i pliki' },
      btn('Udostępnij', ICONS.share, () => void this.share(), { title: 'Utwórz link do programu' }),
      btn('Pobierz .logo', ICONS.download, () => this.download(), { title: 'Zapisz program jako plik .logo' }),
      btn('Otwórz plik', ICONS.upload, () => this.fileInput.click(), { title: 'Wczytaj plik .logo' }),
      btn('Zapisz PNG', ICONS.image, () => void this.png(), { title: 'Zapisz rysunek jako obraz PNG' }),
      this.btnRestore,
      btn('Skróty', ICONS.help, showShortcuts, { class: 'btn subtle', title: 'Pokaż skróty klawiszowe' }),
      this.fileInput,
    );

    this.errorPanel.addEventListener('click', () => {
      const e = this.runner.error;
      if (e) this.editor.goto(e.line, e.column);
    });

    const codePane = h('section', { class: 'pane pane-code', 'aria-label': 'Program' },
      this.editor.el, this.errorPanel, this.status,
    );
    const viewPane = h('section', { class: 'pane pane-view', 'aria-label': 'Rysunek' }, this.banner, this.viewHost);
    return h('div', { class: 'workspace' }, h('h1', { class: 'sr-only', tabindex: -1, id: 'ws-title' }, 'Pracownia'), toolbar, h('div', { class: 'ws-main' }, codePane, viewPane), actions);
  }

  private updateSpeed: () => void = () => {};

  // ---------- views ----------

  private view(): DrawingView {
    return (this.views[this.mode] ??= this.mode === '2d' ? new View2D() : new View3D());
  }

  private mountView(): void {
    const v = this.view();
    this.viewHost.replaceChildren(v.el);
    const off = v instanceof View3D ? v.unavailable : null;
    this.banner.hidden = !off;
    this.banner.textContent = off ? `Tryb 3D jest wyłączony: ${off}` : '';
    requestAnimationFrame(() => {
      v.show();
      v.setScene(this.runner.scene());
    });
  }

  private draw(): void {
    const v = this.view();
    v.setScene(this.runner.scene());
    v.describe(this.runner.machine?.segments.length ?? 0);
  }

  onShow(): void {
    requestAnimationFrame(() => {
      this.view().show();
      this.draw();
    });
  }

  // ---------- state ----------

  private refresh(): void {
    const r = this.runner;
    const active = r.active;
    this.btnStep.disabled = false;
    this.btnPause.disabled = !active;
    this.btnPause.querySelector('span')!.textContent = r.state === 'paused' ? 'Wznów' : 'Pauza';
    this.btnPause.replaceChild(svgIcon(r.state === 'paused' ? ICONS.play : ICONS.pause), this.btnPause.querySelector('svg')!);
    this.btnReset.disabled = r.state === 'idle' && !r.machine;
    this.editor.setActiveLine(active ? r.line : null);
    this.editor.setError(r.error);
    if (r.error) {
      this.errorPanel.hidden = false;
      this.errorPanel.replaceChildren(
        h('strong', null, `Błąd w wierszu ${r.error.line}, kolumnie ${r.error.column}: `),
        r.error.message,
        h('span', { class: 'hint' }, r.machine ? ' Rysunek zachowuje to, co powstało przed błędem.' : ' Nic nie narysowano.'),
      );
      this.errorPanel.title = 'Kliknij, aby przejść do miejsca błędu';
    } else {
      this.errorPanel.hidden = true;
      this.errorPanel.replaceChildren();
    }
    const n = r.machine?.segments.length ?? 0;
    let text = STATE_TEXT[r.state];
    if (r.state === 'paused') text += ` (kroków: ${r.steps})`;
    if (r.state === 'idle' && r.machine) text = 'Program zmieniony – uruchom ponownie';
    this.status.textContent = `${text} · odcinków: ${n}` + (r.machine ? ` · operacji: ${r.machine.ops}` : '');
    const hasBackup = !!store.loadBackup(this.mode);
    this.btnRestore.hidden = !hasBackup;
  }

  private onEdit(v: string): void {
    const r = this.runner;
    if (r.active) r.cancel();
    else if (r.error) r.dismissError();
    this.saveDraft(v);
  }

  private saveDraft = debounce((v: string) => store.saveDraft(this.mode, v), 250);

  // ---------- commands ----------

  run(): void {
    this.view().autoFit = true;
    this.runner.start(this.editor.value, this.mode);
    announceResult(this.runner);
  }

  step(): void {
    if (!this.runner.active) this.view().autoFit = true;
    this.runner.step(this.editor.value, this.mode);
  }

  togglePause(): void {
    if (this.runner.state === 'running') this.runner.pause();
    else if (this.runner.state === 'paused') this.runner.resume();
  }

  reset(): void {
    this.view().autoFit = true;
    this.runner.reset();
    this.view().fit();
  }

  onShortcut(name: 'run' | 'step' | 'pause' | 'reset'): void {
    if (name === 'run') this.run();
    else if (name === 'step') this.step();
    else if (name === 'pause') this.togglePause();
    else this.reset();
  }

  // ---------- modes and loading ----------

  setMode(m: Mode): void {
    if (m === this.mode) return;
    store.saveDraft(this.mode, this.editor.value);
    this.runner.reset();
    this.mode = m;
    store.saveMode(m);
    this.radios[m].checked = true;
    this.editor.setValue(store.loadDraft(m) ?? DEFAULT_DRAFT[m]);
    this.mountView();
    this.refresh();
    announce(m === '3d' ? 'Tryb 3D' : 'Tryb 2D', false);
  }

  private currentDraft(m: Mode): string {
    return m === this.mode ? this.editor.value : (store.loadDraft(m) ?? DEFAULT_DRAFT[m]);
  }

  private isPristine(text: string): boolean {
    const t = text.trim();
    return t === '' || EXAMPLES.some((e) => e.source.trim() === t) || t === DEFAULT_DRAFT['2d'].trim() || t === DEFAULT_DRAFT['3d'].trim();
  }

  /** Puts `src` in the editor of `mode`, backing up a custom draft first. */
  private put(src: string, mode: Mode): void {
    const cur = this.currentDraft(mode);
    if (!this.isPristine(cur) && cur !== src) store.saveBackup(mode, cur);
    if (mode !== this.mode) this.setMode(mode);
    this.runner.reset();
    this.editor.setValue(src);
    store.saveDraft(mode, src);
    this.refresh();
  }

  /** Loads a program after confirming when it would overwrite the user's own draft. */
  async load(src: string, mode: Mode, what: string): Promise<boolean> {
    const cur = this.currentDraft(mode);
    if (!this.isPristine(cur) && cur !== src) {
      const ok = await confirmDialog(
        'Zastąpić bieżący szkic?',
        `W trybie ${mode.toUpperCase()} masz własny, niezapisany program. Wczytanie ${what} zastąpi go. Szkic zachowamy w pamięci przeglądarki – przyciskiem „Przywróć poprzedni szkic” możesz do niego wrócić.`,
        'Wczytaj i zastąp',
      );
      if (!ok) return false;
    }
    this.put(src, mode);
    return true;
  }

  async requestExample(id: string): Promise<void> {
    const ex = exampleById(id);
    if (!ex) return;
    const ok = await this.load(ex.source, ex.mode, `przykładu „${ex.name}”`);
    if (ok) {
      announce(`Wczytano przykład „${ex.name}”`);
      this.editor.focus();
    }
  }

  private async restoreBackup(): Promise<void> {
    const b = store.loadBackup(this.mode);
    if (!b) return;
    const cur = this.editor.value;
    this.runner.reset();
    this.editor.setValue(b);
    store.saveDraft(this.mode, b);
    if (!this.isPristine(cur)) store.saveBackup(this.mode, cur);
    else store.clearBackup(this.mode);
    this.refresh();
    announce('Przywrócono poprzedni szkic');
  }

  // ---------- files and sharing ----------

  private async share(): Promise<void> {
    const url = makePermalink(this.mode, this.editor.value);
    const input = h('input', { type: 'text', readOnly: true, value: url, class: 'url-input', 'aria-label': 'Link do programu' });
    const note = h('p', { class: 'muted' }, 'Link zawiera cały program i tryb. Otwarcie go wczytuje i od razu uruchamia program.');
    const copy = async () => {
      input.select();
      try {
        await navigator.clipboard.writeText(url);
        announce('Skopiowano link do schowka');
      } catch {
        try { document.execCommand('copy'); announce('Skopiowano link do schowka'); } catch { announce('Zaznacz link i skopiuj go ręcznie (Ctrl+C)'); }
      }
    };
    const body = h('div', null, input, note, url.length > 6000 ? h('p', { class: 'muted' }, 'Uwaga: link jest bardzo długi – niektóre komunikatory mogą go obciąć.') : null);
    const p = modal('Udostępnij program', body, [
      { label: 'Zamknij', value: 'cancel' },
      { label: 'Kopiuj link', value: 'copy', primary: true },
    ]);
    input.focus();
    input.select();
    // keep the dialog open on copy: re-open handled by simple approach
    const res = await p;
    if (res === 'copy') await copy();
  }

  private download(): void {
    downloadText(this.editor.value, `logomocja-${this.mode}.logo`);
    announce('Pobrano plik .logo');
  }

  private async onFile(): Promise<void> {
    const f = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (!f) return;
    if (f.size > 1_000_000) {
      announce('Plik jest zbyt duży na program Logo');
      return;
    }
    const text = await f.text();
    const mode: Mode = uses3d(text) ? '3d' : this.mode;
    const ok = await this.load(text.replace(/\r\n/g, '\n'), mode, `pliku „${f.name}”`);
    if (ok) announce(`Otwarto plik „${f.name}”${mode !== this.mode ? '' : ''}`);
  }

  private async png(): Promise<void> {
    const blob = await this.view().toPNG();
    if (!blob) {
      announce('Nie można zapisać obrazu: widok 3D jest wyłączony');
      return;
    }
    downloadBlob(blob, `logomocja-${this.mode}.png`);
    announce('Zapisano obraz PNG');
  }

  // ---------- entry points used by router / test hook ----------

  /** Loads and runs a program from a permalink. */
  openPermalink(mode: Mode, encoded: string): boolean {
    const src = decodeSource(encoded);
    if (src === null) {
      announce('Nieprawidłowy link: nie udało się odczytać programu');
      return false;
    }
    this.put(src, mode);
    this.view().autoFit = true;
    this.runner.start(src, mode, { instant: true });
    requestAnimationFrame(() => this.view().fit());
    return true;
  }

  /** Test hook: load source as if pasted, run to the end, fit the view. */
  async open(source: string, mode: Mode): Promise<RunResult> {
    this.put(source, mode);
    const v = this.view();
    v.autoFit = true;
    this.runner.start(source, mode, { instant: true });
    await nextFrame();
    v.show();
    v.setScene(this.runner.scene());
    v.fit();
    await nextFrame();
    await nextFrame();
    const res: RunResult = {
      segments: JSON.parse(JSON.stringify(this.runner.machine?.segments ?? [])),
      error: this.runner.error ? { ...this.runner.error } : null,
    };
    return res;
  }

  lastError(): LogoError | null {
    return this.runner.error;
  }
}

function announceResult(r: Runner): void {
  if (r.error) announce(`Błąd w wierszu ${r.error.line}, kolumnie ${r.error.column}: ${r.error.message}`, false);
}

export const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));
