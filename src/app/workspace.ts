import { CHALLENGES, type Challenge, checkChallenge, targetSegments } from '../data/challenges';
import { EXAMPLES, type Example } from '../data/examples';
import { SHORTCUTS } from '../data/shortcuts';
import {
  type Mode,
  type RunResult,
  type Segment,
  compile,
  runProgram,
} from '../lang';
import { CodeEditor } from './editor';
import { h, icon } from './dom';
import { downloadBlob, downloadText, pickFile, readTextFile, slug } from './files';
import { type RunState, Runner, type RunnerSnapshot, SPEEDS } from './runner';
import { permalink } from './share';
import {
  type HistoryEntry,
  getChallengeDraft,
  getDraft,
  getHistory,
  getMode,
  getProgress,
  getSpeed,
  isDisposable,
  pushHistory,
  recordAttempt,
  removeHistory,
  setChallengeDraft,
  setDraft,
  setMode,
  setSaved,
  setSpeed,
} from './state';
import { openDialog, toast } from './ui';
import type { CanvasView } from './view';
import { View2D } from './view2d';
import { View3D } from './view3d';

export type WorkspaceContext = { kind: 'free' } | { kind: 'challenge'; challenge: Challenge };

const LEVELS = { 1: 'łatwe', 2: 'średnie', 3: 'trudne' } as const;

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  const m10 = n % 10;
  const m100 = n % 100;
  return m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 > 20) ? few : many;
}

function formatNum(v: number): string {
  const r = Math.round(v * 100) / 100;
  return (Object.is(r, -0) ? 0 : r).toString().replace('.', ',');
}

export class Workspace {
  readonly el: HTMLElement;
  mode: Mode;
  context: WorkspaceContext = { kind: 'free' };

  private editor: CodeEditor;
  private views: Record<Mode, CanvasView> = { '2d': new View2D(), '3d': new View3D() };
  private runner: Runner;
  private ghost: Segment[] | null = null;
  private showGhost = true;
  private docName: Record<Mode, string | null> = { '2d': null, '3d': null };
  private lastSnap: RunnerSnapshot | null = null;
  private saveTimer = 0;
  private diagTimer = 0;
  private visible = false;
  private runnerErrorShown = false;

  // elementy
  private modeInputs!: Record<Mode, HTMLButtonElement>;
  private btnRun!: HTMLButtonElement;
  private btnStep!: HTMLButtonElement;
  private btnPause!: HTMLButtonElement;
  private btnReset!: HTMLButtonElement;
  private speedInput!: HTMLInputElement;
  private speedOut!: HTMLElement;
  private exampleSelect!: HTMLSelectElement;
  private statusEl!: HTMLElement;
  private infoEl!: HTMLElement;
  private errorBar!: HTMLElement;
  private viewHost!: HTMLElement;
  private challengeHost!: HTMLElement;
  private panes!: HTMLElement;

  constructor() {
    this.mode = getMode();
    this.editor = new CodeEditor('Kod programu Logo');
    this.runner = new Runner((snap) => this.onSnapshot(snap));
    const speed = getSpeed();
    this.runner.setSpeed(speed !== null ? speed : 0);
    this.el = this.build();
    this.editor.onInput = (value) => this.onEdit(value);
    this.editor.el.addEventListener('dragover', (e) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    });
    this.editor.el.addEventListener('drop', (e) => {
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      e.preventDefault();
      void this.openDroppedFile(file);
    });
    for (const v of Object.values(this.views)) v.onUserNavigate = () => this.updateInfo();
    this.applyMode(false);
    this.editor.setValue(getDraft(this.mode));
    this.runInstant();
  }

  // ───────────────────────── budowa interfejsu ─────────────────────────

  private build(): HTMLElement {
    const shortcutTitle = (label: string, key: keyof typeof SHORTCUTS) =>
      `${label} (${SHORTCUTS[key].keys[0].join('+')})`;

    const modeButton = (mode: Mode, label: string) =>
      h(
        'button',
        {
          type: 'button',
          role: 'radio',
          class: 'seg-btn',
          'aria-checked': 'false',
          tabindex: '-1',
          'data-testid': `mode-${mode}`,
          'data-mode': mode,
          onClick: () => this.switchMode(mode),
          onKeydown: (e: KeyboardEvent) => this.onModeKey(e, mode),
        },
        label,
      );
    this.modeInputs = { '2d': modeButton('2d', '2D'), '3d': modeButton('3d', '3D') };

    const mkBtn = (
      label: string,
      iconName: string,
      title: string,
      onClick: () => void,
      extra: Record<string, unknown> = {},
    ) =>
      h(
        'button',
        { type: 'button', class: 'btn btn-tool', title, 'aria-label': label, onClick, ...extra },
        icon(iconName),
        h('span', { class: 'btn-label' }, label),
      );

    this.btnRun = mkBtn('Uruchom', 'play', shortcutTitle('Uruchom', 'run'), () => this.run(), {
      class: 'btn btn-tool btn-primary',
      'aria-keyshortcuts': SHORTCUTS.run.aria,
      'data-testid': 'run',
    });
    this.btnStep = mkBtn('Krok', 'step', shortcutTitle('Wykonaj jeden krok', 'step'), () => this.step(), {
      'aria-keyshortcuts': SHORTCUTS.step.aria,
      'data-testid': 'step',
    });
    this.btnPause = mkBtn('Pauza', 'pause', shortcutTitle('Wstrzymaj', 'pause'), () => this.togglePause(), {
      'aria-keyshortcuts': SHORTCUTS.pause.aria,
      'data-testid': 'pause',
    });
    this.btnReset = mkBtn('Reset', 'reset', shortcutTitle('Zatrzymaj i wyczyść rysunek', 'reset'), () => this.reset(), {
      'aria-keyshortcuts': SHORTCUTS.reset.aria,
      'data-testid': 'reset',
    });

    this.speedInput = h('input', {
      type: 'range',
      min: '0',
      max: String(SPEEDS.length - 1),
      step: '1',
      value: String(this.runner.speedIndex),
      id: 'speed',
      'data-testid': 'speed',
      onInput: () => this.onSpeed(),
    });
    this.speedOut = h('output', { for: 'speed', class: 'speed-out' });
    this.onSpeed(false);

    this.exampleSelect = h(
      'select',
      {
        id: 'example-select',
        class: 'select',
        'data-testid': 'example-select',
        'aria-label': 'Wczytaj przykład',
        onChange: () => {
          const ex = EXAMPLES.find((e) => e.id === this.exampleSelect.value);
          this.exampleSelect.value = '';
          if (ex) void this.loadExample(ex);
        },
      },
      h('option', { value: '' }, 'Przykłady…'),
      h('optgroup', { label: 'Płaszczyzna (2D)' }, EXAMPLES.filter((e) => e.mode === '2d').map((e) => h('option', { value: e.id }, e.name))),
      h('optgroup', { label: 'Przestrzeń (3D)' }, EXAMPLES.filter((e) => e.mode === '3d').map((e) => h('option', { value: e.id }, `${e.name}`))),
    );

    const fileBtn = (label: string, iconName: string, onClick: () => void, testid: string) =>
      mkBtn(label, iconName, label, onClick, { 'data-testid': testid });

    const toolbar = h(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      h(
        'div',
        { class: 'seg', role: 'radiogroup', 'aria-label': 'Tryb rysowania', 'data-testid': 'mode-switch' },
        this.modeInputs['2d'],
        this.modeInputs['3d'],
      ),
      h('div', { class: 'tool-group', role: 'group', 'aria-label': 'Wykonanie' }, this.btnRun, this.btnStep, this.btnPause, this.btnReset),
      h(
        'div',
        { class: 'tool-group speed' },
        h('label', { for: 'speed', class: 'speed-label' }, 'Szybkość'),
        this.speedInput,
        this.speedOut,
      ),
      h(
        'div',
        { class: 'tool-group tool-files', role: 'group', 'aria-label': 'Pliki i udostępnianie' },
        h('div', { class: 'select-wrap' }, this.exampleSelect),
        fileBtn('Otwórz plik', 'upload', () => void this.openFile(), 'open-file'),
        fileBtn('Pobierz .logo', 'download', () => this.downloadProgram(), 'download'),
        fileBtn('Zapisz PNG', 'image', () => void this.exportPng(), 'png'),
        fileBtn('Udostępnij link', 'link', () => void this.share(), 'share'),
        fileBtn('Poprzednie szkice', 'undo', () => void this.showHistory(), 'history'),
      ),
    );

    // widok
    this.viewHost = h('div', { class: 'view-host' }, this.views['2d'].el, this.views['3d'].el);
    const viewBtn = (label: string, iconName: string, fn: () => void) =>
      h('button', { type: 'button', class: 'icon-btn view-btn', title: label, 'aria-label': label, onClick: fn }, icon(iconName, 18));
    const viewControls = h(
      'div',
      { class: 'view-controls', role: 'group', 'aria-label': 'Widok rysunku' },
      viewBtn('Dopasuj widok do rysunku', 'fit', () => this.fitView()),
      viewBtn('Przybliż', 'zoomIn', () => this.view.zoomBy(1.25)),
      viewBtn('Oddal', 'zoomOut', () => this.view.zoomBy(0.8)),
      viewBtn('Przywróć domyślny widok', 'crosshair', () => this.resetView()),
    );
    this.infoEl = h('div', { class: 'view-info', 'aria-live': 'off', 'data-testid': 'turtle-info' });
    const viewPane = h('div', { class: 'pane pane-view' }, this.viewHost, viewControls, this.infoEl);

    // kod
    this.challengeHost = h('div', { class: 'challenge-host', hidden: true });
    this.statusEl = h('span', { class: 'status-text', role: 'status', 'aria-live': 'polite', 'data-testid': 'status' });
    const statusBar = h(
      'div',
      { class: 'status' },
      this.statusEl,
      h(
        'span',
        { class: 'status-keys', 'aria-hidden': 'true' },
        h('kbd', null, 'Ctrl'),
        '+',
        h('kbd', null, 'Enter'),
        ' uruchom · ',
        h('kbd', null, 'F10'),
        ' krok · ',
        h('kbd', null, 'F8'),
        ' pauza · ',
        h('kbd', null, 'Esc'),
        ' reset · ',
        h('kbd', null, '?'),
        ' skróty',
      ),
    );
    this.errorBar = h('div', { class: 'error-bar', hidden: true, 'data-testid': 'error' });
    const codePane = h('div', { class: 'pane pane-code' }, this.challengeHost, this.editor.el, this.errorBar, statusBar);

    this.panes = h('div', { class: 'panes' }, codePane, viewPane);
    return h(
      'section',
      { class: 'workspace', 'aria-label': 'Pracownia' },
      h('h1', { class: 'sr-only' }, 'Logomocja – pracownia żółwia'),
      toolbar,
      this.panes,
    );
  }

  private get view(): CanvasView {
    return this.views[this.mode];
  }

  // ───────────────────────── aktywacja ─────────────────────────

  /** Wywoływane przez router, gdy pracownia staje się widoczna lub znika. */
  setVisible(visible: boolean): void {
    this.visible = visible;
    if (!visible) this.runner.pause();
    if (visible) {
      this.view.requestDraw();
      this.updateStatus();
    }
  }

  setContext(ctx: WorkspaceContext): void {
    const same =
      this.context.kind === ctx.kind &&
      (ctx.kind === 'free' || (this.context.kind === 'challenge' && this.context.challenge.id === ctx.challenge.id));
    if (same) return;
    this.flushDraft();
    this.runner.reset();
    this.context = ctx;
    if (ctx.kind === 'challenge') {
      this.mode = ctx.challenge.mode;
      this.ghost = targetSegments(ctx.challenge);
      this.showGhost = true;
      this.applyMode(false);
      this.editor.setValue(getChallengeDraft(ctx.challenge.id) ?? ctx.challenge.starter);
      this.renderChallenge();
    } else {
      this.ghost = null;
      this.mode = getMode();
      this.challengeHost.hidden = true;
      this.applyMode(false);
      this.editor.setValue(getDraft(this.mode));
    }
    this.panes.classList.toggle('with-challenge', ctx.kind === 'challenge');
    this.updateScene(this.runner.snapshot());
    this.runInstant();
    this.view.fit(this.runner.snapshot().segments.length ? undefined : this.ghost ?? undefined);
  }

  // ───────────────────────── tryb ─────────────────────────

  private applyMode(persist: boolean): void {
    for (const m of ['2d', '3d'] as const) {
      const on = m === this.mode;
      this.modeInputs[m].setAttribute('aria-checked', String(on));
      this.modeInputs[m].tabIndex = on ? 0 : -1;
    }
    const fixed = this.context.kind === 'challenge';
    this.modeInputs['2d'].disabled = fixed;
    this.modeInputs['3d'].disabled = fixed;
    this.exampleSelect.disabled = fixed;
    this.views['2d'].el.hidden = this.mode !== '2d';
    this.views['3d'].el.hidden = this.mode !== '3d';
    this.el?.setAttribute('data-mode', this.mode);
    if (persist && this.context.kind === 'free') setMode(this.mode);
    this.view.requestDraw();
  }

  private onModeKey(e: KeyboardEvent, mode: Mode): void {
    const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    if (!keys.includes(e.key) || this.context.kind === 'challenge') return;
    e.preventDefault();
    const target: Mode = mode === '2d' ? '3d' : '2d';
    this.switchMode(target);
    this.modeInputs[target].focus();
  }

  private switchMode(mode: Mode): void {
    if (mode === this.mode || this.context.kind === 'challenge') return;
    this.flushDraft();
    this.runner.reset();
    this.mode = mode;
    this.applyMode(true);
    this.editor.setValue(getDraft(mode));
    this.editor.setError(null);
    this.runInstant();
  }

  // ───────────────────────── uruchamianie ─────────────────────────

  private fitFor(source: string): void {
    const dry = runProgram(source, this.mode);
    if (dry.segments.length) this.view.fit(dry.segments);
    else if (this.ghost) this.view.fit(this.ghost);
    else this.view.resetView();
  }

  run(): void {
    const source = this.editor.value;
    this.editor.setError(null);
    this.fitFor(source);
    this.runner.start(source, this.mode);
  }

  /** Bez animacji – używane po wczytaniu, zmianie trybu i w teście. */
  private runInstant(): void {
    const source = this.editor.value;
    this.editor.setError(null);
    this.fitFor(source);
    this.runner.runInstant(source, this.mode);
  }

  step(): void {
    if (this.runner.state === 'idle' || this.runner.state === 'done' || this.runner.state === 'error') {
      this.editor.setError(null);
      this.fitFor(this.editor.value);
    }
    this.runner.stepOnce(this.editor.value, this.mode);
  }

  togglePause(): void {
    if (this.runner.state === 'running') this.runner.pause();
    else if (this.runner.state === 'paused') this.runner.resume();
  }

  reset(): void {
    this.runner.reset();
    this.editor.setError(null);
    this.editor.setActiveLine(null);
    this.view.autoFit = true;
    if (this.ghost) this.view.fit(this.ghost);
    else this.view.resetView();
  }

  private onSpeed(persist = true): void {
    const idx = Number(this.speedInput.value);
    this.runner.setSpeed(idx);
    const s = SPEEDS[idx];
    this.speedOut.textContent = s.label;
    this.speedInput.setAttribute('aria-valuetext', s.label);
    if (persist) setSpeed(idx);
  }

  private fitView(): void {
    this.view.fit();
    this.updateInfo();
  }

  private resetView(): void {
    this.view.resetView();
  }

  // ───────────────────────── reakcja na zmiany ─────────────────────────

  private onSnapshot(snap: RunnerSnapshot): void {
    this.lastSnap = snap;
    this.updateScene(snap);
    const active = snap.state === 'running' || snap.state === 'paused';
    this.editor.setActiveLine(active && snap.step ? snap.step.line : null, active);
    if (snap.error) {
      this.editor.setError(snap.error);
      this.showError(snap.error.line, snap.error.column, snap.error.message);
    } else {
      this.hideError();
    }
    this.updateButtons(snap.state);
    this.updateStatus();
    this.updateInfo();
  }

  private updateScene(snap: RunnerSnapshot): void {
    this.view.setScene({
      segments: snap.segments,
      turtle: snap.turtle,
      ghost: this.showGhost ? this.ghost : null,
    });
  }

  private updateButtons(state: RunState): void {
    const active = state === 'running' || state === 'paused';
    this.btnPause.disabled = !active;
    const paused = state === 'paused';
    const label = paused ? 'Wznów' : 'Pauza';
    this.btnPause.replaceChildren(icon(paused ? 'play' : 'pause'), h('span', { class: 'btn-label' }, label));
    this.btnPause.setAttribute('aria-label', label);
    this.btnPause.title = `${paused ? 'Wznów wykonanie' : 'Wstrzymaj'} (F8)`;
    this.el.setAttribute('data-state', state);
  }

  private updateStatus(): void {
    const snap = this.lastSnap;
    if (!snap) return;
    const n = snap.segments.length;
    const seg = `${n} ${plural(n, 'odcinek', 'odcinki', 'odcinków')}`;
    let text = '';
    switch (snap.state) {
      case 'idle':
        text = snap.note ?? (n > 0 ? `Gotowy. Na rysunku: ${seg}.` : 'Gotowy. Napisz program i naciśnij Uruchom (Ctrl+Enter).');
        break;
      case 'running':
        text = `Wykonywanie… ${snap.ops} ${plural(snap.ops, 'operacja', 'operacje', 'operacji')}, ${seg}.`;
        break;
      case 'paused':
        text = `Wstrzymano${snap.step ? ` w wierszu ${snap.step.line}` : ''}. ${snap.ops} ${plural(snap.ops, 'operacja', 'operacje', 'operacji')}, ${seg}.`;
        break;
      case 'done':
        text = `Zakończono: ${seg}, ${snap.ops} ${plural(snap.ops, 'operacja', 'operacje', 'operacji')}.`;
        break;
      case 'error':
        text = snap.segments.length
          ? `Program zatrzymany błędem. Zachowano rysunek: ${seg}.`
          : 'Błąd w programie – nic nie narysowano.';
        break;
    }
    this.statusEl.setAttribute('aria-live', snap.state === 'running' ? 'off' : 'polite');
    this.statusEl.textContent = text;
  }

  private updateInfo(): void {
    const t = this.lastSnap?.turtle;
    if (!t) return;
    const f = t.fwd;
    let heading = Math.round((((Math.atan2(f[0], f[1]) * 180) / Math.PI + 360) % 360) * 100) / 100;
    if (heading >= 360) heading = 0;
    const parts =
      this.mode === '2d'
        ? [`x ${formatNum(t.pos[0])}`, `y ${formatNum(t.pos[1])}`, `kierunek ${formatNum(heading)}°`]
        : [`x ${formatNum(t.pos[0])}`, `y ${formatNum(t.pos[1])}`, `z ${formatNum(t.pos[2])}`, `nos (${f.map(formatNum).join('; ')})`];
    parts.push(t.penDown ? 'pióro opuszczone' : 'pióro podniesione');
    this.infoEl.replaceChildren(
      h('span', { class: 'info-swatch', style: { background: t.color } }),
      h('span', { class: 'info-text' }, `Żółw: ${parts.join(' · ')} · grubość ${t.width}`),
    );
  }

  private showError(line: number, column: number, message: string): void {
    const live = this.errorBar;
    live.hidden = false;
    live.replaceChildren(
      icon('info', 16),
      h(
        'button',
        {
          type: 'button',
          class: 'error-jump',
          title: 'Przejdź do miejsca błędu',
          onClick: () => this.editor.focusAt(line, column),
        },
        `Wiersz ${line}, kolumna ${column}`,
      ),
      h('span', { class: 'error-text' }, message),
    );
    this.runnerErrorShown = true;
  }

  private hideError(): void {
    if (!this.runnerErrorShown) return;
    this.errorBar.hidden = true;
    this.errorBar.replaceChildren();
    this.runnerErrorShown = false;
  }

  private onEdit(value: string): void {
    if (this.runner.active) this.runner.interrupt('Przerwano: kod został zmieniony w trakcie działania. Uruchom go ponownie.');
    this.editor.setError(null);
    this.hideError();
    this.editor.setActiveLine(null, false);
    if (this.context.kind === 'challenge') this.setChallengeResult(null);
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flushDraft(), 300);
    window.clearTimeout(this.diagTimer);
    this.diagTimer = window.setTimeout(() => this.liveDiagnostics(), 700);
  }

  /** Podgląd błędów składni podczas pisania (nic nie uruchamia). */
  private liveDiagnostics(): void {
    if (this.runner.active) return;
    const c = compile(this.editor.value, this.mode);
    if (c.error) {
      this.editor.setError(c.error);
      this.showError(c.error.line, c.error.column, c.error.message);
    } else {
      this.editor.setError(null);
      this.hideError();
    }
  }

  flushDraft(): void {
    window.clearTimeout(this.saveTimer);
    const value = this.editor.value;
    if (this.context.kind === 'challenge') setChallengeDraft(this.context.challenge.id, value);
    else setDraft(this.mode, value);
  }

  // ───────────────────────── wczytywanie programów ─────────────────────────

  private currentDraft(mode: Mode): string {
    if (mode === this.mode && this.context.kind === 'free') return this.editor.value;
    return getDraft(mode);
  }

  /** Wstawia program do pracowni (w danym trybie), zachowując poprzedni szkic w historii. */
  private replaceDocument(source: string, mode: Mode, name: string | null, reason: string): HistoryEntry | null {
    if (this.context.kind === 'challenge') this.setContext({ kind: 'free' });
    else this.flushDraft();
    const old = this.currentDraft(mode);
    let stashed: HistoryEntry | null = null;
    if (!isDisposable(mode, old) && old !== source) {
      stashed = pushHistory({ mode, source: old, reason });
    }
    this.runner.reset();
    this.mode = mode;
    this.applyMode(true);
    this.editor.setValue(source);
    this.docName[mode] = name;
    setDraft(mode, source);
    this.runInstant();
    return stashed;
  }

  async loadExample(ex: Example): Promise<boolean> {
    if (this.context.kind === 'challenge') this.setContext({ kind: 'free' });
    const old = this.currentDraft(ex.mode);
    if (!isDisposable(ex.mode, old) && old !== ex.source) {
      const lines = old.split('\n').length;
      const answer = await openDialog({
        title: 'Zastąpić bieżący szkic?',
        body: h(
          'div',
          null,
          h(
            'p',
            null,
            `W trybie ${ex.mode.toUpperCase()} masz własny szkic (${lines} ${plural(lines, 'wiersz', 'wiersze', 'wierszy')}), którego nie zapisano do pliku. Wczytanie przykładu „${ex.name}” zastąpi go.`,
          ),
          h('p', null, 'Szkic nie przepadnie: trafi do historii i będzie można go przywrócić przyciskiem „Poprzednie szkice”.'),
        ),
        buttons: [
          { label: 'Anuluj', value: 'cancel' },
          { label: `Wczytaj „${ex.name}”`, value: 'ok', primary: true },
        ],
      });
      if (answer !== 'ok') return false;
    }
    const stashed = this.replaceDocument(
      ex.source,
      ex.mode,
      EXAMPLES.some((e) => e.id === ex.id) ? ex.id : null,
      `przed wczytaniem przykładu „${ex.name}”`,
    );
    toast(`Wczytano przykład „${ex.name}” (${ex.mode.toUpperCase()}).`, {
      actionLabel: stashed ? 'Cofnij' : undefined,
      onAction: stashed ? () => this.restoreHistory(stashed) : undefined,
      kind: 'success',
    });
    this.editor.focus();
    return true;
  }

  /** Program z permalinku: bez pytania (użytkownik sam otworzył adres), ale ze śladem w historii. */
  loadFromLink(source: string, mode: Mode): void {
    const stashed = this.replaceDocument(source, mode, null, 'przed otwarciem linku');
    toast('Wczytano program z linku i uruchomiono go.', {
      kind: 'success',
      actionLabel: stashed ? 'Przywróć poprzedni szkic' : undefined,
      onAction: stashed ? () => this.restoreHistory(stashed) : undefined,
    });
  }

  /** Hak testowy: wczytuje źródło „jak wklejone”, uruchamia bez animacji i dopasowuje widok. */
  async openSource(source: string, mode: Mode): Promise<RunResult> {
    this.replaceDocument(source, mode, null, 'przed wczytaniem programu');
    this.view.autoFit = true;
    const result = runProgram(source, mode);
    this.fitFor(source);
    this.view.fit(result.segments.length ? result.segments : undefined);
    this.view.drawNow();
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    this.view.drawNow();
    return result;
  }

  private restoreHistory(entry: HistoryEntry): void {
    const current = this.currentDraft(entry.mode);
    if (!isDisposable(entry.mode, current) && current !== entry.source) {
      pushHistory({ mode: entry.mode, source: current, reason: 'przed przywróceniem szkicu' });
    }
    removeHistory(entry.at);
    this.docName[entry.mode] = null;
    if (this.context.kind === 'challenge') this.setContext({ kind: 'free' });
    this.runner.reset();
    this.mode = entry.mode;
    this.applyMode(true);
    this.editor.setValue(entry.source);
    setDraft(entry.mode, entry.source);
    this.runInstant();
    toast('Przywrócono poprzedni szkic.', { kind: 'success' });
  }

  private async showHistory(): Promise<void> {
    const list = getHistory();
    const body = h('div', { class: 'history' });
    if (list.length === 0) {
      body.append(h('p', null, 'Historia jest pusta. Gdy wczytasz przykład, plik lub link w miejsce niezapisanego szkicu, zastąpiony szkic pojawi się tutaj.'));
    } else {
      const ul = h('ul', { class: 'history-list' });
      for (const e of list) {
        const first = e.source.split('\n').find((l) => l.trim() !== '') ?? '(pusty)';
        ul.append(
          h(
            'li',
            null,
            h(
              'div',
              { class: 'history-meta' },
              h('strong', null, `${e.mode.toUpperCase()} · ${new Date(e.at).toLocaleString('pl-PL')}`),
              h('span', null, e.reason),
              h('code', null, first.length > 60 ? `${first.slice(0, 60)}…` : first),
            ),
            h(
              'button',
              {
                type: 'button',
                class: 'btn btn-small',
                onClick: () => {
                  (document.querySelector('dialog[open]') as HTMLDialogElement | null)?.close();
                  this.restoreHistory(e);
                },
              },
              'Przywróć',
            ),
          ),
        );
      }
      body.append(ul);
    }
    await openDialog({ title: 'Poprzednie szkice', body, buttons: [{ label: 'Zamknij', value: 'close', primary: true }] });
  }

  // ───────────────────────── pliki i udostępnianie ─────────────────────────

  private downloadProgram(): void {
    this.flushDraft();
    const src = this.editor.value;
    const base = this.docName[this.mode] ?? (this.context.kind === 'challenge' ? this.context.challenge.id : `program-${this.mode}`);
    downloadText(src, `${slug(base)}.logo`);
    setSaved(this.mode, src);
    toast('Pobrano plik .logo.', { kind: 'success' });
  }

  private async openFile(): Promise<void> {
    const file = await pickFile();
    if (file) await this.openDroppedFile(file);
  }

  private async openDroppedFile(file: File): Promise<void> {
    try {
      const { text, name } = await readTextFile(file);
      await this.loadText(text, name);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Nie udało się otworzyć pliku.', { kind: 'error' });
    }
  }

  private async loadText(text: string, name: string): Promise<void> {
    if (this.context.kind === 'challenge') this.setContext({ kind: 'free' });
    const mode = this.mode;
    const old = this.currentDraft(mode);
    if (!isDisposable(mode, old) && old !== text) {
      const answer = await openDialog({
        title: 'Zastąpić bieżący szkic?',
        body: h('p', null, `Plik „${name}” zastąpi niezapisany szkic w trybie ${mode.toUpperCase()}. Szkic trafi do historii i będzie można go przywrócić.`),
        buttons: [
          { label: 'Anuluj', value: 'cancel' },
          { label: 'Otwórz plik', value: 'ok', primary: true },
        ],
      });
      if (answer !== 'ok') return;
    }
    const stashed = this.replaceDocument(text, mode, name.replace(/\.[^.]+$/, ''), `przed otwarciem pliku „${name}”`);
    setSaved(mode, text);
    toast(`Otwarto plik „${name}” (tryb ${mode.toUpperCase()}).`, {
      kind: 'success',
      actionLabel: stashed ? 'Cofnij' : undefined,
      onAction: stashed ? () => this.restoreHistory(stashed) : undefined,
    });
  }

  private async exportPng(): Promise<void> {
    try {
      this.view.drawNow();
      const blob = await this.view.toBlob();
      const base = this.docName[this.mode] ?? `rysunek-${this.mode}`;
      downloadBlob(blob, `${slug(base)}.png`);
      toast('Zapisano rysunek jako PNG.', { kind: 'success' });
    } catch {
      toast('Nie udało się zapisać PNG.', { kind: 'error' });
    }
  }

  private async share(): Promise<void> {
    const src = this.editor.value;
    const url = permalink(src, this.mode);
    const input = h('input', {
      type: 'text',
      readonly: true,
      class: 'share-input',
      value: url,
      'aria-label': 'Adres do udostępnienia',
      'data-testid': 'share-url',
    });
    input.addEventListener('focus', () => input.select());
    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = false;
    }
    setSaved(this.mode, src);
    const body = h(
      'div',
      null,
      h('p', null, copied ? 'Adres skopiowano do schowka. Każdy, kto go otworzy, zobaczy ten sam program i od razu go uruchomi.' : 'Skopiuj adres poniżej. Każdy, kto go otworzy, zobaczy ten sam program i od razu go uruchomi.'),
      input,
      url.length > 2000 ? h('p', { class: 'muted' }, `Uwaga: adres ma ${url.length} znaków – niektóre komunikatory mogą go obciąć.`) : null,
    );
    const answer = await openDialog({
      title: 'Udostępnij program',
      body,
      buttons: [
        { label: 'Zamknij', value: 'close' },
        { label: 'Kopiuj adres', value: 'copy', primary: true },
      ],
    });
    if (answer === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        toast('Skopiowano adres.', { kind: 'success' });
      } catch {
        toast('Nie udało się skopiować – zaznacz adres ręcznie.', { kind: 'error' });
      }
    }
  }

  // ───────────────────────── wyzwania ─────────────────────────

  private renderChallenge(): void {
    if (this.context.kind !== 'challenge') return;
    const c = this.context.challenge;
    const done = !!getProgress()[c.id]?.done;
    const idx = CHALLENGES.findIndex((x) => x.id === c.id);
    const next = CHALLENGES[idx + 1];
    this.challengeHost.hidden = false;
    const result = h('div', { class: 'challenge-result', role: 'status', 'aria-live': 'polite', 'data-testid': 'challenge-result' });
    const ghostBox = h('input', {
      type: 'checkbox',
      checked: this.showGhost,
      id: 'ghost-toggle',
      onChange: () => {
        this.showGhost = ghostBox.checked;
        this.updateScene(this.runner.snapshot());
      },
    });
    const solution = h('pre', { class: 'code-sample' }, c.solution);
    this.challengeHost.replaceChildren(
      h(
        'section',
        { class: 'challenge-panel', 'aria-labelledby': 'challenge-title' },
        h(
          'header',
          { class: 'challenge-head' },
          h('h2', { id: 'challenge-title' }, c.title),
          h('span', { class: `badge level-${c.level}` }, LEVELS[c.level]),
          h('span', { class: 'badge' }, c.mode.toUpperCase()),
          done ? h('span', { class: 'badge badge-ok', 'data-testid': 'challenge-done' }, '✓ zaliczone') : null,
        ),
        h('p', null, c.task),
        h('ul', { class: 'challenge-details' }, c.details.map((d) => h('li', null, d))),
        h(
          'div',
          { class: 'challenge-actions' },
          h(
            'button',
            { type: 'button', class: 'btn btn-primary', 'data-testid': 'challenge-check', onClick: () => this.checkCurrentChallenge() },
            icon('check', 16),
            'Sprawdź',
          ),
          h('label', { class: 'check-label', for: 'ghost-toggle' }, ghostBox, 'Pokaż wzór na rysunku'),
          h('a', { class: 'link-quiet', href: '#/wyzwania' }, 'Wszystkie wyzwania'),
          next ? h('a', { class: 'link-quiet', href: `#/wyzwania/${next.id}` }, 'Następne →') : null,
        ),
        result,
        h(
          'details',
          { class: 'challenge-help' },
          h('summary', null, 'Podpowiedź i rozwiązanie'),
          h('p', null, h('strong', null, 'Podpowiedź: '), c.hint),
          h('p', null, h('strong', null, 'Rozwiązanie wzorcowe:')),
          solution,
        ),
      ),
    );
  }

  private setChallengeResult(r: { pass: boolean; reason: string } | null): void {
    const box = this.challengeHost.querySelector('.challenge-result');
    if (!box) return;
    if (!r) {
      box.className = 'challenge-result';
      box.textContent = '';
      return;
    }
    box.className = `challenge-result ${r.pass ? 'pass' : 'fail'}`;
    box.replaceChildren(icon(r.pass ? 'check' : 'x', 18), h('div', null, h('strong', null, r.pass ? 'Brawo! Zadanie zaliczone.' : 'Jeszcze nie.'), h('p', null, r.reason)));
    const host = this.challengeHost;
    const overflow = box.getBoundingClientRect().bottom - host.getBoundingClientRect().bottom;
    if (overflow > 0) host.scrollTop += overflow + 8;
  }

  private checkCurrentChallenge(): void {
    if (this.context.kind !== 'challenge') return;
    const c = this.context.challenge;
    this.flushDraft();
    this.editor.setError(null);
    this.runInstant();
    const result = checkChallenge(c, this.editor.value);
    recordAttempt(c.id, result.pass);
    this.setChallengeResult(result);
    if (result.pass) {
      this.renderChallenge();
      this.setChallengeResult(result);
    }
  }

  // ───────────────────────── skróty klawiszowe ─────────────────────────

  /** Zwraca true, jeśli obsłużono klawisz. */
  handleKey(e: KeyboardEvent): boolean {
    if (!this.visible) return false;
    if (document.querySelector('dialog[open]')) return false;
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key === 'Enter') {
      this.run();
      return true;
    }
    if (e.key === 'F10' && !mod) {
      this.step();
      return true;
    }
    if (e.key === 'F8' && !mod) {
      this.togglePause();
      return true;
    }
    if (e.key === 'Escape' && !mod && !e.shiftKey && this.runner.state !== 'idle') {
      this.reset();
      return true;
    }
    return false;
  }

  focusEditor(): void {
    this.editor.focus();
  }

  get runState(): RunState {
    return this.runner.state;
  }
}
