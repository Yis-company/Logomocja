import type { Mode } from '../lang/ast';
import { compile } from '../lang/index';
import { fmtNum, plural, type LogoError } from '../lang/errors';
import { initialTurtle, type RunResult, type Segment, type TurtleState } from '../lang/interpreter';
import { EXAMPLES, isDisposable } from '../examples';
import { CHALLENGE_BY_ID, checkChallenge, patternOf, requirementText, type Challenge } from '../challenges';
import { h } from './dom';
import { icon } from './icons';
import { Editor } from './editor';
import { View2D, isoProjection } from './view2d';
import { computeCallouts, type DrawingView } from './view';
import { record, secondsPerCost, interpolate, tempoLabel, TEMPO_MAX, type Recording } from './player';
import { webglAvailable } from './gl';
import { backupDraft, clearBackup, loadBackup, loadDraft, saveDraft, type DraftKey } from './drafts';
import { store } from './storage';
import { toast } from './toast';
import { copyText, download, fileSlug, guessMode, permalink } from './share';
import { markSolved, isSolved } from './progress';
import { SHORTCUTS, shortcutLabel } from './shortcuts';

type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error' | 'stale' | 'edited';

const FIRST_DRAFT: Record<Mode, string> = {
  '2d': EXAMPLES.find((e) => e.id === 'kwadrat')!.source,
  '3d': EXAMPLES.find((e) => e.id === 'schody')!.source,
};

export class Studio {
  readonly root: HTMLElement;
  mode: Mode;
  task: Challenge | null = null;
  private readonly editor: Editor;
  private view: DrawingView;
  private readonly view2d: View2D;
  private view3d: DrawingView | null = null;
  private view3dLoading: Promise<DrawingView> | null = null;
  private readonly viewWrap: HTMLElement;
  private readonly notice: HTMLElement;

  // playback
  private rec: Recording | null = null;
  private index = 0;
  private frac = 0;
  private stepping = false;
  private state: RunState = 'idle';
  private raf = 0;
  private last = 0;
  private drawn: Segment[] = [];
  private turtle: TurtleState = initialTurtle();
  private parseError: LogoError | null = null;
  private tempo: number;
  private calloutsOn: boolean;
  private saveTimer = 0;

  // controls
  private readonly btnRun: HTMLButtonElement;
  private readonly btnStep: HTMLButtonElement;
  private readonly btnPause: HTMLButtonElement;
  private readonly btnReset: HTMLButtonElement;
  private readonly modeBtns: Record<Mode, HTMLButtonElement>;
  private readonly tempoInput: HTMLInputElement;
  private readonly tempoOut: HTMLElement;
  private readonly status: HTMLElement;
  private readonly title: HTMLElement;
  private readonly modeChip: HTMLElement;
  private readonly keyList: HTMLElement;
  private readonly readout: HTMLElement;
  private readonly taskPanel: HTMLElement;
  private readonly fileInput: HTMLInputElement;
  private readonly fileMenu: HTMLElement;
  private readonly fileBtn: HTMLButtonElement;
  private readonly restoreItem: HTMLButtonElement;
  private readonly calloutBtn: HTMLButtonElement;
  private readonly resetViewBtn: HTMLButtonElement;

  constructor() {
    this.mode = store.get('mode') === '3d' ? '3d' : '2d';
    this.tempo = Number(store.get('tempo')) || 4;
    this.calloutsOn = store.get('callouts') !== 'off';

    this.status = h('div', { class: 'status', id: 'studio-status', role: 'status', 'aria-live': 'polite' });
    this.editor = new Editor({
      label: 'Kod programu',
      describedBy: 'studio-status editor-help',
      onInput: () => this.onEdit(),
    });

    const btn = (cls: string, label: string, ic: Parameters<typeof icon>[0], onclick: () => void, keys?: string) => {
      const b = h('button', { class: `btn ${cls}`, type: 'button', onclick }, icon(ic, 18), h('span', { class: 'btn-label' }, label)) as HTMLButtonElement;
      if (keys) {
        b.setAttribute('aria-keyshortcuts', keys);
        b.title = `${label} (${shortcutLabel(keys)})`;
      }
      return b;
    };
    this.btnRun = btn('btn-primary', 'Uruchom', 'play', () => this.run(), SHORTCUTS.run.aria);
    this.btnStep = btn('btn-quiet', 'Krok', 'step', () => this.step(), SHORTCUTS.step.aria);
    this.btnPause = btn('btn-quiet', 'Pauza', 'pause', () => this.togglePause(), SHORTCUTS.pause.aria);
    this.btnReset = btn('btn-quiet', 'Reset', 'reset', () => this.reset(), SHORTCUTS.reset.aria);

    this.tempoInput = h('input', {
      type: 'range', min: '1', max: String(TEMPO_MAX), step: '1', value: String(this.tempo), id: 'tempo',
      class: 'range', 'aria-describedby': 'tempo-out',
    }) as HTMLInputElement;
    this.tempoOut = h('output', { id: 'tempo-out', for: 'tempo', class: 'tempo-out' });
    this.tempoInput.addEventListener('input', () => this.setTempo(Number(this.tempoInput.value)));

    const modeBtn = (m: Mode, label: string) =>
      h('button', { class: 'seg-btn', type: 'button', 'aria-pressed': 'false', onclick: () => this.switchMode(m) }, label) as HTMLButtonElement;
    this.modeBtns = { '2d': modeBtn('2d', '2D'), '3d': modeBtn('3d', '3D') };

    // file menu (disclosure)
    this.fileInput = h('input', { type: 'file', accept: '.logo,.txt,text/plain', class: 'visually-hidden', tabindex: '-1', 'aria-hidden': 'true' }) as HTMLInputElement;
    this.fileInput.addEventListener('change', () => this.openFile());
    const item = (label: string, ic: Parameters<typeof icon>[0], run: () => void) =>
      h('button', { class: 'menu-item', type: 'button', onclick: () => { this.closeMenu(); run(); } }, icon(ic, 16), label) as HTMLButtonElement;
    this.restoreItem = item('Przywróć poprzedni szkic', 'undo', () => this.restoreBackup());
    this.fileMenu = h('div', { class: 'menu', id: 'file-menu', hidden: true },
      item('Otwórz plik .logo…', 'open', () => this.fileInput.click()),
      item('Pobierz program (.logo)', 'download', () => this.downloadProgram()),
      item('Kopiuj link do programu', 'link', () => this.copyLink()),
      item('Zapisz rysunek jako PNG', 'image', () => this.exportPNG()),
      this.restoreItem,
    );
    this.fileBtn = h('button', { class: 'btn btn-quiet', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'file-menu', onclick: () => this.toggleMenu() },
      icon('open', 18), h('span', { class: 'btn-label' }, 'Plik')) as HTMLButtonElement;
    this.fileMenu.addEventListener('keydown', (e) => this.menuKeys(e));
    document.addEventListener('pointerdown', (e) => {
      if (!this.fileMenu.hidden && !this.fileMenu.contains(e.target as Node) && !this.fileBtn.contains(e.target as Node)) this.closeMenu();
    });

    this.taskPanel = h('section', { class: 'task', hidden: true, 'aria-labelledby': 'task-title' });

    // chart: band, figure, key
    this.title = h('h1', { class: 'band-title', id: 'chart-title' }, 'Mój rysunek');
    this.modeChip = h('span', { class: 'band-chip' }, '2D');
    const viewBtn = (label: string, ic: Parameters<typeof icon>[0], run: () => void) =>
      h('button', { class: 'btn btn-band btn-icon', type: 'button', 'aria-label': label, title: label, onclick: run }, icon(ic, 18)) as HTMLButtonElement;
    this.calloutBtn = h('button', { class: 'btn btn-band', type: 'button', 'aria-pressed': String(this.calloutsOn), title: 'Numerowane opisy kolorów na rysunku', onclick: () => this.toggleCallouts() },
      icon('tag', 18), h('span', { class: 'btn-label' }, 'Opisy')) as HTMLButtonElement;
    this.resetViewBtn = viewBtn('Widok początkowy', 'reset', () => this.view.resetView());
    const band = h('div', { class: 'band' },
      h('div', { class: 'band-head' }, this.title, this.modeChip),
      h('div', { class: 'band-tools', role: 'toolbar', 'aria-label': 'Widok rysunku' },
        this.calloutBtn,
        viewBtn('Pomniejsz', 'zoomOut', () => this.view.zoom(0.8)),
        viewBtn('Powiększ', 'zoomIn', () => this.view.zoom(1.25)),
        viewBtn('Dopasuj widok do rysunku', 'fit', () => this.view.fit()),
        this.resetViewBtn,
      ),
    );

    this.view2d = new View2D(undefined, { label: 'Rysunek 2D. Przeciągnij, aby przesunąć; kółko myszy, gest szczypania albo klawisze + i − zmieniają powiększenie; strzałki przesuwają; 0 dopasowuje.' });
    this.view = this.view2d;
    this.notice = h('p', { class: 'view-notice', hidden: true });
    this.viewWrap = h('div', { class: 'view-wrap' }, this.view.element, this.notice);

    this.keyList = h('ol', { class: 'key-list', 'aria-label': 'Legenda kolorów' });
    this.readout = h('p', { class: 'readout', 'aria-label': 'Położenie żółwia' });
    const key = h('div', { class: 'key' }, this.keyList, this.readout);

    const help = h('p', { class: 'visually-hidden', id: 'editor-help' },
      'Tab wstawia wcięcie. Aby wyjść z edytora klawiszem Tab, naciśnij najpierw Escape.');

    this.root = h('div', { class: 'studio', 'data-mode': this.mode },
      h('section', { class: 'studio-code', 'aria-label': 'Program' },
        h('div', { class: 'code-head' },
          h('div', { class: 'seg', role: 'group', 'aria-label': 'Tryb rysowania' }, this.modeBtns['2d'], this.modeBtns['3d']),
          h('div', { class: 'menu-wrap' }, this.fileBtn, this.fileMenu, this.fileInput),
        ),
        this.taskPanel,
        h('div', { class: 'runbar', role: 'toolbar', 'aria-label': 'Wykonanie programu' },
          this.btnRun, this.btnStep, this.btnPause, this.btnReset,
          h('div', { class: 'tempo' }, h('label', { for: 'tempo' }, 'Tempo'), this.tempoInput, this.tempoOut),
        ),
        this.editor.root,
        help,
        this.status,
      ),
      h('section', { class: 'chart', 'aria-labelledby': 'chart-title' }, band, this.viewWrap, key),
    );

    this.setTempo(this.tempo, false);
    this.applyMode();
    this.editor.setValue(this.loadText(this.draftKey()));
    window.addEventListener('pagehide', () => this.flushSave());
    document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && this.flushSave());
    this.renderStatus();
  }

  // ================================================================ lifecycle

  /** Shows the studio in free mode or with a challenge. */
  async enter(taskId: string | null) {
    const task = taskId ? CHALLENGE_BY_ID.get(taskId) ?? null : null;
    if (task?.id === this.task?.id && this.root.isConnected && this.rec) return;
    this.flushSave();
    this.stop();
    this.task = task;
    if (task && this.mode !== task.mode) this.mode = task.mode;
    else if (!task) this.mode = store.get('mode') === '3d' ? '3d' : '2d';
    await this.applyMode();
    this.renderTask();
    this.editor.setValue(this.loadText(this.draftKey()));
    this.clearMarks();
    requestAnimationFrame(() => this.drawInstant(true));
  }

  private draftKey(): DraftKey {
    return this.task ? `task:${this.task.id}` : this.mode;
  }

  private loadText(key: DraftKey): string {
    const saved = loadDraft(key);
    if (saved !== null) return saved;
    if (this.task) return this.task.starter;
    return FIRST_DRAFT[key as Mode] ?? '';
  }

  private onEdit() {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flushSave(), 300);
    if (this.state === 'running' || this.state === 'paused') {
      this.stop();
      this.state = 'stale';
    } else if (this.state === 'error' || this.state === 'done') {
      this.state = 'edited';
    }
    this.parseError = null;
    this.editor.setError(null);
    this.editor.setExecLine(null);
    this.updateTitle();
    this.renderStatus();
    this.renderTaskResult(null);
  }

  private flushSave() {
    clearTimeout(this.saveTimer);
    saveDraft(this.draftKey(), this.editor.value);
  }

  // ================================================================ mode & view

  async switchMode(m: Mode) {
    if (this.task) {
      toast(`To zadanie rysuje się w trybie ${this.task.mode.toUpperCase()}. Wyjdź z zadania, aby zmienić tryb.`, { icon: 'alert' });
      return;
    }
    if (m === this.mode) return;
    this.flushSave();
    this.stop();
    this.mode = m;
    store.set('mode', m);
    await this.applyMode();
    this.editor.setValue(this.loadText(this.draftKey()));
    this.clearMarks();
    requestAnimationFrame(() => this.drawInstant(true));
  }

  private async applyMode() {
    const m = this.mode;
    this.root.dataset.mode = m;
    for (const k of ['2d', '3d'] as Mode[]) {
      this.modeBtns[k].setAttribute('aria-pressed', String(k === m));
      this.modeBtns[k].disabled = !!this.task && this.task.mode !== k;
    }
    this.modeChip.textContent = m === '2d' ? '2D' : '3D';
    this.resetViewBtn.hidden = m === '2d';
    const next = m === '2d' ? this.view2d : await this.get3DView();
    if (next !== this.view) {
      this.view.element.replaceWith(next.element);
      this.view = next;
      next.refreshTheme();
      requestAnimationFrame(() => next.resize());
    }
    this.view.setInk(getComputedStyle(this.root).getPropertyValue('--mode-fill').trim() || '#16866a');
    this.notice.hidden = !(m === '3d' && !webglAvailable());
    this.updateTitle();
  }

  private get3DView(): Promise<DrawingView> {
    if (this.view3d) return Promise.resolve(this.view3d);
    if (!this.view3dLoading) {
      if (!webglAvailable()) {
        this.notice.textContent =
          'Widok 3D jest wyłączony: ta przeglądarka nie udostępnia WebGL (bywa wyłączony w ustawieniach lub przez sterownik grafiki). Pokazuję uproszczony rzut z jednego kierunku — bez obracania kamery. Tryb 2D działa normalnie.';
        const v = new View2D(isoProjection(), { label: 'Rysunek 3D w rzucie uproszczonym (bez WebGL).' });
        this.view3d = v;
        this.view3dLoading = Promise.resolve(v);
      } else {
        this.view3dLoading = import('./view3d').then((mod) => {
          const v = new mod.View3D({
            label: 'Rysunek 3D. Przeciągnij, aby obracać; prawym przyciskiem lub dwoma palcami przesuwasz; kółko lub szczypanie przybliża. Strzałki obracają, Shift ze strzałkami przesuwa, + i − przybliżają, 0 dopasowuje.',
          });
          this.view3d = v;
          return v as DrawingView;
        });
      }
    }
    return this.view3dLoading;
  }

  refreshTheme() {
    this.view2d.refreshTheme();
    this.view3d?.refreshTheme();
    this.view.setInk(getComputedStyle(this.root).getPropertyValue('--mode-fill').trim() || '#16866a');
  }

  private updateTitle() {
    let t = 'Mój rysunek';
    if (this.task) t = this.task.title;
    else {
      const src = this.editor.value.trim();
      const ex = EXAMPLES.find((e) => e.source.trim() === src);
      if (ex) t = ex.title;
    }
    this.title.textContent = t;
  }

  private titleText() {
    return this.title.textContent || 'Rysunek';
  }

  private toggleCallouts() {
    this.calloutsOn = !this.calloutsOn;
    store.set('callouts', this.calloutsOn ? 'on' : 'off');
    this.calloutBtn.setAttribute('aria-pressed', String(this.calloutsOn));
    this.renderKey();
  }

  // ================================================================ running

  private setTempo(v: number, persist = true) {
    this.tempo = Math.max(1, Math.min(TEMPO_MAX, Math.round(v)));
    this.tempoInput.value = String(this.tempo);
    this.tempoInput.setAttribute('aria-valuetext', `${this.tempo} z ${TEMPO_MAX}, ${tempoLabel(this.tempo)}`);
    this.tempoOut.textContent = tempoLabel(this.tempo);
    if (persist) store.set('tempo', String(this.tempo));
  }

  /** Compiles and records the current text; false when it does not parse. */
  private prepare(): boolean {
    this.stop();
    this.clearMarks();
    this.parseError = null;
    const c = compile(this.editor.value, this.mode);
    if (!c.program) {
      this.parseError = c.error;
      this.rec = null;
      this.drawn = [];
      this.turtle = initialTurtle();
      this.state = 'error';
      this.editor.setError({ line: c.error.line, column: c.error.column, length: c.error.length, message: c.error.message });
      this.syncView();
      this.renderStatus();
      return false;
    }
    this.rec = record(c.program);
    this.index = 0;
    this.frac = 0;
    this.drawn = [];
    this.turtle = initialTurtle();
    this.syncView();
    return true;
  }

  run() {
    if (!this.prepare()) return;
    if (this.tempo >= TEMPO_MAX) {
      this.applyAll();
      return;
    }
    this.state = 'running';
    this.renderStatus();
    this.loop();
  }

  /** Runs to the end at once — used on load, mode switch and by the testing hook. */
  drawInstant(fit = false) {
    if (!this.prepare()) return;
    this.applyAll(fit);
  }

  private applyAll(fit = false) {
    const rec = this.rec!;
    while (this.index < rec.events.length) this.apply(this.index++);
    this.finish(fit);
  }

  step() {
    if (this.state === 'running') {
      this.state = 'paused';
      this.stopLoop();
    }
    if (!this.rec || this.state === 'done' || this.state === 'error' || this.state === 'stale' || this.state === 'edited' || this.state === 'idle') {
      if (!this.prepare()) return;
      this.state = 'paused';
    }
    const rec = this.rec!;
    if (this.stepping || this.frac > 0) {
      // finish the command in flight first
      if (this.index < rec.events.length) this.apply(this.index++);
      this.frac = 0;
      this.stepping = false;
    }
    if (this.index >= rec.events.length) {
      this.finish();
      return;
    }
    this.stepping = true;
    this.editor.setExecLine(rec.events[this.index].line);
    this.renderStatus();
    this.loop();
  }

  togglePause() {
    if (this.state === 'running') {
      this.state = 'paused';
      this.stopLoop();
      this.renderStatus();
    } else if (this.state === 'paused' && this.rec) {
      this.state = 'running';
      this.stepping = false;
      this.renderStatus();
      this.loop();
    }
  }

  reset() {
    this.stop();
    this.rec = null;
    this.drawn = [];
    this.turtle = initialTurtle();
    this.state = 'idle';
    this.clearMarks();
    this.syncView();
    this.renderStatus();
  }

  private stop() {
    this.stopLoop();
    this.stepping = false;
    if (this.rec && this.frac > 0 && this.index < this.rec.events.length) {
      this.view.setPartial(null);
    }
    this.frac = 0;
    this.editor.setExecLine(null);
  }

  private stopLoop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private loop() {
    this.stopLoop();
    this.last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - this.last) / 1000);
      this.last = now;
      this.advance(dt);
      if (this.raf) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  private advance(dt: number) {
    const rec = this.rec;
    if (!rec) return this.stopLoop();
    const n = rec.events.length;
    if (this.stepping) {
      const stepTime = Math.min(0.35, Math.max(0.12, rec.costs[this.index] * 0.6));
      this.frac += dt / stepTime;
      if (this.frac >= 1) {
        this.apply(this.index++);
        this.frac = 0;
        this.stepping = false;
        this.stopLoop();
        if (this.index >= n) this.finish();
        else this.renderStatus();
        return;
      }
    } else {
      const spc = secondsPerCost(rec, this.tempo);
      let budget = dt;
      while (this.index < n) {
        const stepTime = rec.costs[this.index] * spc;
        const need = (1 - this.frac) * stepTime;
        if (budget >= need) {
          budget -= need;
          this.apply(this.index++);
          this.frac = 0;
          continue;
        }
        this.frac += budget / stepTime;
        break;
      }
      if (this.index >= n) {
        this.finish();
        return;
      }
    }
    // the command in flight
    const ev = rec.events[this.index];
    const { turtle, partial } = interpolate(this.turtle, ev, this.frac);
    this.view.setPartial(partial);
    this.view.setTurtle(turtle);
    this.renderReadout(turtle);
    this.editor.setExecLine(ev.line);
  }

  private apply(i: number) {
    const ev = this.rec!.events[i];
    if (ev.cleared) this.drawn = [];
    if (ev.segment) this.drawn.push(ev.segment);
    this.turtle = ev.turtle;
    this.view.setPartial(null);
    this.view.setSegments(this.drawn);
    this.view.setTurtle(this.turtle);
    this.renderReadout(this.turtle);
  }

  private finish(fit = false) {
    this.stopLoop();
    this.stepping = false;
    this.frac = 0;
    const rec = this.rec!;
    this.editor.setExecLine(null);
    this.view.setPartial(null);
    this.view.setSegments(this.drawn);
    this.view.setTurtle(this.turtle);
    if (rec.error) {
      this.state = 'error';
      this.editor.setError({ line: rec.error.line, column: rec.error.column, length: rec.error.length, message: rec.error.message });
    } else {
      this.state = 'done';
    }
    this.renderKey();
    const pts = this.drawn.flatMap((s) => [s.from, s.to]);
    if (fit || (!this.view.userMoved && pts.length && !this.view.isVisible(pts))) this.view.fit();
    this.renderStatus();
  }

  private clearMarks() {
    this.editor.setError(null);
    this.editor.setExecLine(null);
  }

  private syncView() {
    this.view.setPartial(null);
    this.view.setSegments(this.drawn);
    this.view.setTurtle(this.turtle);
    this.view.setGhost(this.task && this.ghostOn ? patternOf(this.task) : null);
    this.renderKey();
    this.renderReadout(this.turtle);
  }

  // ================================================================ status, key, readout

  private renderStatus() {
    const s = this.status;
    s.className = 'status';
    s.replaceChildren();
    const rec = this.rec;
    const segs = this.drawn.length;
    const segText = `${fmtNum(segs)} ${plural(segs, 'odcinek', 'odcinki', 'odcinków')}`;
    const err = this.parseError ?? (this.state === 'error' ? rec?.error ?? null : null);
    this.btnPause.disabled = !(this.state === 'running' || this.state === 'paused');
    const pauseLabel = this.btnPause.querySelector('.btn-label')!;
    const paused = this.state === 'paused';
    pauseLabel.textContent = paused ? 'Wznów' : 'Pauza';
    this.btnPause.replaceChild(icon(paused ? 'play' : 'pause', 18), this.btnPause.querySelector('svg')!);
    this.btnPause.title = `${paused ? 'Wznów' : 'Pauza'} (${shortcutLabel(SHORTCUTS.pause.aria)})`;
    this.btnReset.disabled = this.state === 'idle' && !segs;
    this.root.dataset.state = this.state;

    if (err) {
      s.classList.add('is-error');
      const where = `Wiersz ${err.line}, kolumna ${err.column}`;
      const kind = this.parseError ? 'Nic nie narysowano — popraw błąd i uruchom ponownie.' : `Rysunek zatrzymał się po ${segText}.`;
      s.append(
        icon('alert', 18),
        h('div', { class: 'status-body' },
          h('p', { class: 'status-main' }, h('strong', null, `${where}: `), err.message),
          h('p', { class: 'status-sub' }, kind),
        ),
        h('button', { class: 'btn btn-quiet btn-sm', type: 'button', onclick: () => this.editor.jumpTo(err.line, err.column) }, 'Pokaż w kodzie'),
      );
      return;
    }
    let main = '';
    let sub = '';
    switch (this.state) {
      case 'idle':
        main = 'Gotowe do pracy.';
        sub = `Naciśnij Uruchom (${shortcutLabel(SHORTCUTS.run.aria)}) albo Krok, aby iść polecenie po poleceniu.`;
        break;
      case 'running':
        main = 'Rysuję…';
        sub = 'Zaznaczony wiersz to polecenie, które wykonuje żółw.';
        break;
      case 'paused':
        main = this.index > 0 || this.stepping ? `Pauza w wierszu ${rec?.events[this.stepping ? this.index : this.index - 1]?.line ?? 1}.` : 'Pauza.';
        sub = 'Krok wykona następne polecenie, Wznów dokończy rysunek.';
        break;
      case 'done':
        s.classList.add('is-done');
        main = segs ? `Gotowe: ${segText}.` : 'Gotowe — ten program niczego nie rysuje.';
        sub = `Wykonano ${fmtNum(rec?.ops ?? 0)} ${plural(rec?.ops ?? 0, 'operację', 'operacje', 'operacji')} z 10 000.`;
        break;
      case 'stale':
        main = 'Kod się zmienił, więc przerwałem rysowanie.';
        sub = 'Na planszy zostaje poprzednia wersja. Uruchom, aby narysować nową.';
        break;
      case 'edited':
        main = 'Kod zmieniony.';
        sub = 'Uruchom, aby zobaczyć nowy rysunek.';
        break;
    }
    s.append(h('div', { class: 'status-body' }, h('p', { class: 'status-main' }, main), h('p', { class: 'status-sub' }, sub)));
  }

  private renderKey() {
    const callouts = computeCallouts(this.drawn);
    this.view.setCallouts(this.calloutsOn && (this.state === 'done' || this.state === 'error' || this.state === 'idle' || this.state === 'stale' || this.state === 'edited') ? callouts : null);
    this.keyList.replaceChildren(
      ...(callouts.length
        ? callouts.map((c) =>
            h('li', { class: 'key-item' },
              h('span', { class: 'key-n', 'aria-hidden': 'true' }, String(c.n)),
              h('span', { class: 'key-swatch', style: `--swatch:${c.color}`, 'aria-hidden': 'true' }),
              h('span', { class: 'key-text' },
                h('code', null, c.color),
                ` ${fmtNum(c.count)} ${plural(c.count, 'odcinek', 'odcinki', 'odcinków')}, długość ${fmtNum(Math.round(c.length))}`),
            ),
          )
        : [h('li', { class: 'key-empty' }, this.state === 'error' && this.parseError ? 'Brak rysunku — program ma błąd.' : 'Tu pojawi się legenda kolorów.')]),
    );
  }

  private renderReadout(t: TurtleState) {
    const f = (v: number) => (Math.abs(v) < 0.005 ? '0' : v.toLocaleString('pl-PL', { maximumFractionDigits: 1, minimumFractionDigits: 0 }));
    let heading = (Math.atan2(t.heading[0], t.heading[1]) * 180) / Math.PI;
    if (heading < 0) heading += 360;
    if (heading >= 359.95) heading = 0;
    const parts = [
      ['x', f(t.pos[0])],
      ['y', f(t.pos[1])],
    ];
    if (this.mode === '3d') parts.push(['z', f(t.pos[2])]);
    const flatHeading = Math.hypot(t.heading[0], t.heading[1]) > 1e-6;
    parts.push(['kierunek', flatHeading ? `${f(heading)}°` : t.heading[2] > 0 ? 'w górę' : 'w dół']);
    if (this.mode === '3d') parts.push(['wznios', `${f((Math.asin(Math.max(-1, Math.min(1, t.heading[2]))) * 180) / Math.PI)}°`]);
    parts.push(['pióro', t.pen ? 'opuszczone' : 'podniesione']);
    this.readout.replaceChildren(
      ...parts.map(([k, v]) => h('span', { class: 'ro' }, h('span', { class: 'ro-k' }, k), h('span', { class: 'ro-v' }, v))),
    );
  }

  // ================================================================ challenges

  private ghostOn = true;

  private renderTask() {
    const t = this.task;
    const p = this.taskPanel;
    p.hidden = !t;
    this.root.classList.toggle('has-task', !!t);
    if (!t) {
      p.replaceChildren();
      return;
    }
    const ghost = h('input', { type: 'checkbox', id: 'ghost-toggle', checked: this.ghostOn }) as HTMLInputElement;
    ghost.addEventListener('change', () => {
      this.ghostOn = ghost.checked;
      this.view.setGhost(this.ghostOn ? patternOf(t) : null);
    });
    const solved = isSolved(t.id);
    p.replaceChildren(...[
      h('div', { class: 'task-head' },
        h('h2', { id: 'task-title', class: 'task-title' }, `Zadanie: ${t.title}`),
        solved ? h('span', { class: 'task-badge' }, icon('check', 14), 'rozwiązane') : null,
        h('a', { class: 'btn btn-quiet btn-sm task-exit', href: '#/' }, icon('exit', 16), 'Wyjdź z zadania'),
      ),
      h('p', { class: 'task-text' }, t.task),
      t.requires?.length ? h('p', { class: 'task-req' }, `Wymagane: ${t.requires.map(requirementText).join(', ')}.`) : null,
      h('details', { class: 'task-hint' }, h('summary', null, 'Podpowiedź'), h('p', null, t.hint)),
      h('div', { class: 'task-actions' },
        h('button', { class: 'btn btn-task', type: 'button', onclick: () => this.checkTask() }, icon('check', 18), 'Sprawdź'),
        h('label', { class: 'check', for: 'ghost-toggle' }, ghost, 'Pokaż wzór na planszy'),
      ),
      h('div', { class: 'task-result', id: 'task-result', role: 'status', 'aria-live': 'polite' }),
    ].filter((x) => !!x) as HTMLElement[]);
  }

  private renderTaskResult(r: { pass: boolean; title: string; reason: string } | null) {
    const el = this.taskPanel.querySelector('#task-result');
    if (!el) return;
    el.className = 'task-result';
    el.replaceChildren();
    if (!r) return;
    el.classList.add(r.pass ? 'is-pass' : 'is-fail');
    el.append(icon(r.pass ? 'check' : 'x', 18), h('div', null, h('strong', null, r.title), ' ', r.reason));
  }

  checkTask() {
    const t = this.task;
    if (!t) return;
    this.flushSave();
    const r = checkChallenge(t, this.editor.value);
    this.drawInstant();
    this.renderTaskResult(r);
    if (r.pass) {
      const first = !isSolved(t.id);
      markSolved(t.id);
      if (first) this.renderTask(), this.renderTaskResult(r);
    }
  }

  // ================================================================ loading & files

  /**
   * Loads a program as if pasted: keeps the learner's own draft as a backup
   * (with an undo in the toast) unless it is empty or an untouched example.
   */
  async load(source: string, mode: Mode, how: 'example' | 'link' | 'file' | 'hook', name?: string) {
    if (this.task) {
      this.flushSave();
      this.task = null;
      this.renderTask();
    }
    this.flushSave();
    this.stop();
    if (mode !== this.mode) {
      this.mode = mode;
      store.set('mode', mode);
    }
    await this.applyMode();
    const key = this.draftKey();
    const previous = this.loadText(key);
    const kept = previous.trim() !== source.trim() && backupDraft(key, previous);
    this.editor.setValue(source, { undoable: how !== 'hook' });
    saveDraft(key, source);
    this.updateTitle();
    this.clearMarks();
    if (how === 'hook') return;
    this.drawInstant(true);
    const what = how === 'example' ? `Wczytano przykład „${name}”` : how === 'link' ? 'Wczytano program z linku' : `Otwarto plik ${name ?? ''}`.trim();
    toast(kept ? `${what}. Twój poprzedni szkic jest zachowany.` : `${what}.`, {
      icon: 'check',
      action: kept ? { label: 'Przywróć mój szkic', run: () => this.restoreBackup() } : undefined,
    });
  }

  private restoreBackup() {
    const key = this.draftKey();
    const b = loadBackup(key);
    if (!b) {
      toast('Nie ma zachowanego szkicu w tym trybie.', { icon: 'alert' });
      return;
    }
    const current = this.editor.value;
    this.editor.setValue(b.text, { undoable: true });
    saveDraft(key, b.text);
    if (!isDisposable(current) && current.trim() !== b.text.trim()) backupDraft(key, current);
    else clearBackup(key);
    this.updateTitle();
    this.drawInstant();
    toast('Przywrócono poprzedni szkic.', { icon: 'undo' });
  }

  private async openFile() {
    const f = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (!f) return;
    if (f.size > 200_000) {
      toast('Ten plik jest za duży na program Logo (limit to 50 000 znaków).', { tone: 'error', icon: 'alert' });
      return;
    }
    const text = (await f.text()).replace(/^﻿/, '');
    const mode = this.task ? this.task.mode : guessMode(text) ?? this.mode;
    await this.load(text, mode, 'file', f.name);
  }

  private downloadProgram() {
    const name = `${fileSlug(this.titleText())}.logo`;
    download(name, new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' }));
    toast(`Pobrano ${name}.`, { icon: 'download' });
  }

  private async copyLink() {
    const url = permalink(this.editor.value, this.mode);
    const ok = await copyText(url);
    if (ok) toast('Skopiowano link. Kto go otworzy, zobaczy ten program i rysunek.', { icon: 'link' });
    else {
      history.replaceState(null, '', url);
      toast('Nie udało się skopiować. Link jest teraz w pasku adresu — skopiuj go stamtąd.', { icon: 'alert' });
    }
  }

  private async exportPNG() {
    try {
      const blob = await this.view.toPNG(this.titleText());
      const name = `${fileSlug(this.titleText())}.png`;
      download(name, blob);
      toast(`Zapisano ${name}.`, { icon: 'image' });
    } catch {
      toast('Nie udało się zapisać obrazka.', { tone: 'error', icon: 'alert' });
    }
  }

  private toggleMenu() {
    if (this.fileMenu.hidden) this.openMenu();
    else this.closeMenu();
  }

  private openMenu() {
    this.restoreItem.hidden = !loadBackup(this.draftKey());
    this.fileMenu.hidden = false;
    this.fileBtn.setAttribute('aria-expanded', 'true');
    (this.fileMenu.querySelector('button:not([hidden])') as HTMLElement)?.focus();
  }

  private closeMenu(refocus = false) {
    if (this.fileMenu.hidden) return;
    this.fileMenu.hidden = true;
    this.fileBtn.setAttribute('aria-expanded', 'false');
    if (refocus) this.fileBtn.focus();
  }

  private menuKeys(e: KeyboardEvent) {
    const items = [...this.fileMenu.querySelectorAll<HTMLButtonElement>('button:not([hidden])')];
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === 'Escape') {
      e.preventDefault();
      this.closeMenu(true);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Tab') {
      this.closeMenu();
    }
  }

  // ================================================================ testing hook

  async openForHook(source: string, mode: Mode): Promise<RunResult> {
    await this.load(source, mode, 'hook');
    if (this.view === this.view3d || mode === '3d') await this.get3DView();
    this.view.resize();
    this.drawInstant(true);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
    const rec = this.rec;
    const err = this.parseError ?? rec?.error ?? null;
    return {
      segments: (this.parseError ? [] : rec?.segments ?? []).map((s) => ({ from: [...s.from], to: [...s.to], color: s.color, width: s.width })) as Segment[],
      error: err ? err.toJSON() : null,
    };
  }

  /** Keyboard shortcuts while the studio is on screen. */
  handleShortcut(action: keyof typeof SHORTCUTS) {
    if (action === 'run') this.run();
    else if (action === 'step') this.step();
    else if (action === 'pause') this.togglePause();
    else if (action === 'reset') this.reset();
  }

  pause() {
    if (this.state === 'running') this.togglePause();
    this.flushSave();
  }
}
