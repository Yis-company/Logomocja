import type { Mode, RunResult } from '../lang/types';
import type { TurtleState } from '../lang/interpreter';
import { compile } from '../lang/interpreter';
import { lex, fmtInt } from '../lang/lexer';
import { keywordOf, SPATIAL } from '../lang/keywords';
import { fmtNum } from '../lang/parser';
import { EXAMPLES } from '../examples';
import { STARTERS } from '../app/starters';
import { store } from '../app/storage';
import { permalinkFor } from '../app/permalink';
import { CHALLENGES, checkChallenge, targetOf, type Challenge } from '../challenges';
import { h, icon, kbd, MOD } from './dom';
import { LogoEditor } from './editor';
import { Runner, RATES, SPEED_NAMES, INITIAL_TURTLE, type RunState, type RunInfo } from './runner';
import { TraceView } from './trace';
import { View2D } from './view2d';
import { Fallback3D } from './fallback3d';
import { webglProblem, type DrawingSurface } from './surface';
import { popover, menuItem, toast, type PopoverHandle } from './overlay';
import { renderThumb } from './thumbs';

export type Pane = 'code' | 'plate' | 'trace';

type Context = { kind: 'draft' } | { kind: 'task'; ch: Challenge };

interface Backup {
  source: string;
  mode: Mode;
  at: string;
}

export interface TaskProgress {
  solved: boolean;
  at?: string;
}

export interface StudioHost {
  navigate(hash: string): void;
  progress(): Record<string, TaskProgress>;
  markSolved(id: string): void;
}

const MODE_NAMES: Record<Mode, string> = { '2d': 'Płaszczyzna', '3d': 'Przestrzeń' };

function draftKey(mode: Mode): string {
  return `draft.${mode}`;
}

function isPristine(text: string): boolean {
  const t = text.trim();
  return t === '' || text === STARTERS['2d'] || text === STARTERS['3d'] || EXAMPLES.some((e) => e.source === text) || CHALLENGES.some((c) => text === starterFor(c));
}

function starterFor(ch: Challenge): string {
  return `; Zadanie: ${ch.title}\n; ${ch.task}\n`;
}

function usesSpace(source: string): boolean {
  return lex(source, true).tokens.some((t) => t.kind === 'word' && SPATIAL.has(keywordOf(t.name)!));
}

function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function timeStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export class Studio {
  readonly root: HTMLElement;
  mode: Mode;
  context: Context = { kind: 'draft' };
  readonly editor: LogoEditor;
  readonly runner: Runner;
  private trace: TraceView;
  private view2d: View2D;
  private view3d: DrawingSurface | null = null;
  private view3dState: 'none' | 'loading' | 'ready' | 'unavailable' = 'none';
  private view3dWaiters: (() => void)[] = [];
  private host2d: HTMLElement;
  private host3d: HTMLElement;
  private els: Record<string, HTMLElement> = {};
  private modeButtons: Record<Mode, HTMLButtonElement>;
  private paneButtons: Record<Pane, HTMLButtonElement>;
  private pane: Pane = 'code';
  private saveTimer = 0;
  private lintTimer = 0;
  private sharePop!: PopoverHandle;
  private fileInput: HTMLInputElement;
  private lastState: RunState = 'idle';
  private restoreItem!: HTMLButtonElement;

  constructor(private host: StudioHost) {
    this.mode = store.get<Mode>('mode', '2d') === '3d' ? '3d' : '2d';

    // ── plate ────────────────────────────────────────────────────────────────
    this.host2d = h('div', { class: 'plate-host', 'data-kind': '2d' });
    this.host3d = h('div', { class: 'plate-host', 'data-kind': '3d', hidden: true });
    this.view2d = new View2D(this.host2d);

    const viewBtn = (label: string, name: Parameters<typeof icon>[0], run: () => void, extra: Record<string, string> = {}) =>
      h('button', { type: 'button', class: 'icon-btn', 'aria-label': label, title: label, onclick: run, ...extra }, icon(name));
    const viewControls = h(
      'div',
      { class: 'view-controls', role: 'group', 'aria-label': 'Widok rysunku' },
      viewBtn('Przybliż', 'zoomIn', () => this.surface()?.zoomBy(1.3)),
      viewBtn('Oddal', 'zoomOut', () => this.surface()?.zoomBy(1 / 1.3)),
      viewBtn('Dopasuj widok do rysunku', 'fit', () => this.surface()?.fit(true)),
      (this.els.camReset = viewBtn('Ustaw kamerę od nowa', 'camera', () => this.surface()?.resetView(), { 'data-only': '3d' })),
    );
    const stat = (key: string, label: string) =>
      h('span', { class: `stat stat-${key}` }, (this.els[`k-${key}`] = h('span', { class: 'stat-k' }, label)), (this.els[`s-${key}`] = h('span', { class: 'stat-v' }, '0')));
    const strip = h(
      'div',
      { class: 'status-strip', 'aria-label': 'Stan żółwia' },
      stat('x', 'x'),
      stat('y', 'y'),
      stat('z', 'z'),
      stat('kurs', 'kurs'),
      stat('pen', 'pisak'),
      h('span', { class: 'stat stat-color' }, h('span', { class: 'stat-k' }, 'kolor'), (this.els.swatch = h('i', { class: 'stat-swatch' })), (this.els['s-color'] = h('span', { class: 'stat-v' }, '#16866a'))),
      stat('width', 'grubość'),
    );
    this.els.notice = h('div', { class: 'plate-notice', hidden: true, role: 'note' });
    this.els.taskBanner = h('div', { class: 'plate-banner', hidden: true });
    const plate = h(
      'section',
      { class: 'pane pane-plate', id: 'pane-plate', 'aria-label': 'Rysunek' },
      h('h2', { class: 'visually-hidden' }, 'Rysunek'),
      h('div', { class: 'plate' }, this.host2d, this.host3d, viewControls, this.els.notice, this.els.taskBanner),
      strip,
    );

    // ── editor ───────────────────────────────────────────────────────────────
    const editorHost = h('div', { class: 'editor-host' });
    this.editor = new LogoEditor(editorHost, (doc, key) => this.onEdit(doc, key));
    this.els.title = h('h2', { class: 'pane-title' }, 'Program');
    this.els.modeChip = h('span', { class: 'chip' });
    this.els.saved = h('span', { class: 'saved', 'aria-live': 'off' }, 'Zapisano w przeglądarce');
    this.els.taskPanel = h('div', { class: 'task-panel', hidden: true });
    const code = h(
      'section',
      { class: 'pane pane-code', id: 'pane-code', 'aria-labelledby': 'code-title' },
      this.els.taskPanel,
      h('div', { class: 'pane-head' }, Object.assign(this.els.title, { id: 'code-title' }), this.els.modeChip, h('span', { class: 'spacer' }), this.els.saved),
      editorHost,
    );

    // ── status line ──────────────────────────────────────────────────────────
    this.els.statusText = h('span', { class: 'status-text' }, 'Żółw czeka w punkcie startu.');
    this.els.statusAction = h('button', { type: 'button', class: 'link-btn', hidden: true, onclick: () => this.showError() }, 'Pokaż błąd');
    const status = h(
      'div',
      { class: 'run-status', role: 'status', 'aria-live': 'polite', 'data-tone': 'idle' },
      (this.els.statusIcon = h('span', { class: 'run-status-icon', 'aria-hidden': 'true' })),
      this.els.statusText,
      this.els.statusAction,
    );
    this.els.status = status;

    // ── trace ────────────────────────────────────────────────────────────────
    this.trace = new TraceView((row) => {
      this.editor.reveal(row.line, row.col);
      if (this.isNarrow()) this.setPane('code');
    });
    this.els.counters = h('span', { class: 'counters' });
    const tracePane = h(
      'section',
      { class: 'pane pane-trace', id: 'pane-trace', 'aria-labelledby': 'trace-title' },
      h('div', { class: 'pane-head' }, h('h2', { class: 'pane-title', id: 'trace-title' }, 'Przebieg'), h('span', { class: 'spacer' }), this.els.counters),
      this.trace.root,
    );

    // ── toolbar ──────────────────────────────────────────────────────────────
    const modeBtn = (m: Mode) =>
      h(
        'button',
        { type: 'button', class: 'seg-btn', role: 'radio', 'aria-checked': 'false', 'data-mode': m, onclick: () => this.switchMode(m) },
        h('span', { class: 'seg-main' }, m.toUpperCase()),
        h('span', { class: 'seg-sub' }, MODE_NAMES[m]),
      );
    this.modeButtons = { '2d': modeBtn('2d'), '3d': modeBtn('3d') };
    const modeGroup = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': 'Tryb rysowania' }, this.modeButtons['2d'], this.modeButtons['3d']);
    modeGroup.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next: Mode = this.mode === '2d' ? '3d' : '2d';
        this.switchMode(next);
        this.modeButtons[this.mode].focus();
      }
    });

    const toolBtn = (cls: string, label: string, name: Parameters<typeof icon>[0], keys: string, run: () => void) =>
      h(
        'button',
        { type: 'button', class: `btn ${cls}`, title: `${label} (${keys})`, 'aria-keyshortcuts': keys.replace(/Ctrl/g, 'Control').replace(/⌘/g, 'Meta').replace(/ \+ /g, '+'), onclick: run },
        icon(name),
        h('span', { class: 'btn-label' }, label),
      );
    this.els.run = toolBtn('btn-primary', 'Uruchom', 'play', `${MOD} + Enter`, () => this.run());
    this.els.step = toolBtn('btn-secondary', 'Krok', 'step', `${MOD} + Shift + Enter`, () => this.step());
    this.els.pause = toolBtn('btn-secondary', 'Pauza', 'pause', `${MOD} + Shift + Spacja`, () => this.runner.togglePause());
    this.els.reset = toolBtn('btn-secondary', 'Od nowa', 'reset', 'Esc', () => this.reset());
    const runGroup = h('div', { class: 'run-group', role: 'group', 'aria-label': 'Wykonanie' }, this.els.run, this.els.step, this.els.pause, this.els.reset);

    const speed = h('input', { type: 'range', min: '1', max: String(RATES.length - 1), step: '1', id: 'speed', 'aria-describedby': 'speed-out' }) as HTMLInputElement;
    const speedOut = h('output', { id: 'speed-out', for: 'speed', class: 'speed-out' });
    const initialSpeed = store.get<number>('speed', 8);
    speed.value = String(initialSpeed);
    this.runner = new Runner({
      surface: () => this.surface(),
      editor: this.editor,
      source: () => this.editor.value,
      mode: () => this.mode,
      onState: (s, info) => this.onRunState(s, info),
      onRows: (rows, reset) => this.trace.push(rows, reset),
      onTurtle: (t) => this.showTurtle(t),
    });
    const applySpeed = () => {
      const v = Number(speed.value);
      this.runner.setSpeed(v);
      speedOut.textContent = SPEED_NAMES[v] ?? '';
      speed.setAttribute('aria-valuetext', SPEED_NAMES[v] ?? '');
      store.set('speed', v);
    };
    speed.addEventListener('input', applySpeed);
    applySpeed();
    const speedCtl = h('div', { class: 'speed' }, h('label', { for: 'speed', class: 'speed-label' }, 'Tempo'), speed, speedOut);

    // file menu
    this.fileInput = h('input', { type: 'file', accept: '.logo,.txt,text/plain', class: 'visually-hidden', tabindex: '-1', 'aria-hidden': 'true' }) as HTMLInputElement;
    this.fileInput.addEventListener('change', () => this.openFile());
    const fileBtn = h('button', { type: 'button', class: 'btn btn-quiet' }, icon('file'), h('span', { class: 'btn-label' }, 'Plik'), icon('chevronDown', 'icon-small'));
    this.restoreItem = menuItem('Przywróć odłożony szkic', 'undo', () => this.restoreBackup());
    const fileMenu = h(
      'div',
      { class: 'menu' },
      menuItem('Nowy program', 'newFile', () => this.newProgram()),
      menuItem('Otwórz plik .logo…', 'upload', () => this.fileInput.click()),
      menuItem('Pobierz program (.logo)', 'download', () => this.downloadProgram()),
      menuItem('Zapisz rysunek jako PNG', 'image', () => void this.exportPNG()),
      h('hr', { class: 'menu-sep' }),
      this.restoreItem,
    );
    popover(fileBtn, fileMenu, { role: 'menu', label: 'Plik', align: 'start', onOpen: () => this.refreshRestoreItem() });

    // share
    const shareBtn = h('button', { type: 'button', class: 'btn btn-quiet' }, icon('link'), h('span', { class: 'btn-label' }, 'Udostępnij'));
    const shareInput = h('input', { type: 'text', readonly: true, class: 'share-input', id: 'share-url', 'aria-label': 'Link do programu' }) as HTMLInputElement;
    const shareMsg = h('p', { class: 'share-msg', 'aria-live': 'polite' });
    const copyBtn = h('button', { type: 'button', class: 'btn btn-secondary' }, icon('link'), h('span', null, 'Kopiuj link'));
    copyBtn.addEventListener('click', async () => {
      shareInput.select();
      let ok = false;
      try {
        await navigator.clipboard.writeText(shareInput.value);
        ok = true;
      } catch {
        ok = document.execCommand?.('copy') ?? false;
      }
      shareMsg.textContent = ok ? 'Skopiowano do schowka.' : 'Zaznaczono link: skopiuj go skrótem Ctrl+C.';
    });
    const sharePanel = h(
      'div',
      { class: 'share' },
      h('h3', { class: 'pop-title' }, 'Link do tego programu'),
      h('p', { class: 'pop-text' }, 'Link zawiera cały program i tryb. Kto go otworzy, zobaczy ten program wczytany i uruchomiony. Nic nie jest wysyłane na serwer.'),
      h('div', { class: 'share-row' }, shareInput, copyBtn),
      shareMsg,
    );
    this.sharePop = popover(shareBtn, sharePanel, {
      label: 'Udostępnij program',
      align: 'end',
      onOpen: () => {
        shareMsg.textContent = '';
        shareInput.value = 'Przygotowuję link…';
        void permalinkFor(this.editor.value, this.mode).then((url) => {
          shareInput.value = url;
          shareInput.select();
        });
      },
    });

    // shortcuts
    const keysBtn = h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Skróty klawiszowe', title: 'Skróty klawiszowe' }, icon('keyboard'));
    popover(keysBtn, shortcutsPanel(), { label: 'Skróty klawiszowe', align: 'end' });

    const toolbar = h(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      modeGroup,
      runGroup,
      speedCtl,
      h('span', { class: 'spacer' }),
      h('div', { class: 'tool-extra' }, fileBtn, shareBtn, keysBtn),
      this.fileInput,
    );

    // ── narrow-screen pane switch ────────────────────────────────────────────
    const paneBtn = (p: Pane, label: string) =>
      h('button', { type: 'button', role: 'tab', class: 'pane-tab', id: `tab-${p}`, 'aria-controls': `pane-${p}`, 'aria-selected': 'false', onclick: () => this.setPane(p) }, label);
    this.paneButtons = { code: paneBtn('code', 'Program'), plate: paneBtn('plate', 'Rysunek'), trace: paneBtn('trace', 'Przebieg') };
    const paneSwitch = h('div', { class: 'pane-switch', role: 'tablist', 'aria-label': 'Widok studia' }, this.paneButtons.code, this.paneButtons.plate, this.paneButtons.trace);
    paneSwitch.addEventListener('keydown', (e) => {
      const order: Pane[] = ['code', 'plate', 'trace'];
      const i = order.indexOf(this.pane);
      if (e.key === 'ArrowRight') this.setPane(order[(i + 1) % 3]!);
      else if (e.key === 'ArrowLeft') this.setPane(order[(i + 2) % 3]!);
      else return;
      e.preventDefault();
      this.paneButtons[this.pane].focus();
    });

    this.root = h('div', { class: 'studio', 'data-mode': this.mode, 'data-pane': this.pane }, toolbar, paneSwitch, code, status, tracePane, plate);

    window.addEventListener('dragover', (e) => {
      if (e.dataTransfer?.types.includes('Files')) e.preventDefault();
    });
    window.addEventListener('drop', (e) => {
      const f = e.dataTransfer?.files?.[0];
      if (!f || !this.root.isConnected || this.root.closest('[hidden]')) return;
      e.preventDefault();
      void this.readFile(f);
    });
  }

  /** Called once the studio is in the document. */
  start(): void {
    this.applyMode(this.mode, true);
    this.setPane('code');
    this.runner.runInstant();
    this.view2d.fit(false);
  }

  isNarrow(): boolean {
    return matchMedia('(max-width: 759px)').matches;
  }

  setPane(p: Pane): void {
    this.pane = p;
    this.root.dataset.pane = p;
    for (const [k, b] of Object.entries(this.paneButtons) as [Pane, HTMLButtonElement][]) {
      b.setAttribute('aria-selected', String(k === p));
      b.tabIndex = k === p ? 0 : -1;
    }
    requestAnimationFrame(() => this.surface()?.resize());
  }

  surface(): DrawingSurface | null {
    return this.mode === '2d' ? this.view2d : this.view3d;
  }

  // ── modes and buffers ──────────────────────────────────────────────────────

  private bufferKey(): string {
    return this.context.kind === 'task' ? `task-${this.context.ch.id}` : `draft-${this.mode}`;
  }

  private initialFor(key: string): string {
    if (key.startsWith('task-')) {
      const ch = CHALLENGES.find((c) => `task-${c.id}` === key)!;
      return store.get<string | null>(`zadanie.${ch.id}`, null) ?? starterFor(ch);
    }
    const mode = key === 'draft-3d' ? '3d' : '2d';
    return store.get<string | null>(draftKey(mode), null) ?? STARTERS[mode];
  }

  private applyMode(mode: Mode, initial = false): void {
    this.mode = mode;
    this.root.dataset.mode = mode;
    if (this.context.kind === 'draft') store.set('mode', mode);
    for (const [m, b] of Object.entries(this.modeButtons) as [Mode, HTMLButtonElement][]) {
      b.setAttribute('aria-checked', String(m === mode));
      b.tabIndex = m === mode ? 0 : -1;
      b.disabled = this.context.kind === 'task' && m !== mode;
      b.title = b.disabled ? 'Tryb wynika z zadania' : '';
    }
    this.els.modeChip!.textContent = `${MODE_NAMES[mode]} ${mode.toUpperCase()}`;
    this.trace.setMode(mode);
    this.host2d.hidden = mode !== '2d';
    this.host3d.hidden = mode !== '3d';
    this.els.camReset!.hidden = mode !== '3d';
    const key = this.bufferKey();
    this.editor.open(key, () => this.initialFor(key));
    if (mode === '3d') this.ensure3D();
    else this.showNotice(null);
    if (!initial) requestAnimationFrame(() => this.surface()?.resize());
    this.updateOverlay();
  }

  switchMode(mode: Mode): void {
    if (mode === this.mode || this.context.kind === 'task') return;
    this.runner.reset();
    this.applyMode(mode);
    this.runner.runInstant();
    this.whenSurfaceReady(() => this.surface()?.fit(false));
  }

  private ensure3D(): void {
    if (this.view3dState === 'ready' || this.view3dState === 'loading') return;
    if (this.view3dState === 'unavailable') {
      this.showNotice(this.els.notice!.dataset.reason ?? '');
      return;
    }
    const problem = webglProblem();
    if (problem) {
      this.fallback3D(problem);
      return;
    }
    this.view3dState = 'loading';
    this.showNotice('Wczytuję widok przestrzeni…', 'loading');
    import('./view3d')
      .then(({ View3D }) => {
        this.view3d = new View3D(this.host3d);
        this.view3dState = 'ready';
        this.afterSurfaceReady();
      })
      .catch((err) => {
        console.error(err);
        this.fallback3D('Nie udało się uruchomić widoku przestrzeni (WebGL).');
      });
  }

  private fallback3D(reason: string): void {
    this.view3d = new Fallback3D(this.host3d);
    this.view3dState = 'unavailable';
    this.els.notice!.dataset.reason = reason;
    this.afterSurfaceReady();
  }

  private afterSurfaceReady(): void {
    const s = this.view3d!;
    s.setSegments(this.runner.segments());
    s.setTurtle(this.currentTurtle);
    this.updateOverlay();
    if (this.mode === '3d') {
      if (this.view3dState === 'unavailable') this.showNotice(this.els.notice!.dataset.reason ?? '', 'warning');
      else this.showNotice(null);
      s.fit(false);
    }
    const waiters = this.view3dWaiters;
    this.view3dWaiters = [];
    waiters.forEach((w) => w());
  }

  /** Runs `fn` once the current mode's surface exists (3D loads lazily). */
  whenSurfaceReady(fn: () => void): void {
    if (this.mode === '2d' || this.view3dState === 'ready' || this.view3dState === 'unavailable') fn();
    else this.view3dWaiters.push(fn);
  }

  private showNotice(text: string | null, tone: 'loading' | 'warning' = 'warning'): void {
    const n = this.els.notice!;
    if (!text) {
      n.hidden = true;
      return;
    }
    n.hidden = false;
    n.dataset.tone = tone;
    n.replaceChildren(
      tone === 'warning' ? icon('warning') : h('span', { class: 'spinner', 'aria-hidden': 'true' }),
      h('span', null, tone === 'warning' ? h('strong', null, 'Widok 3D jest wyłączony. ') : null, text, tone === 'warning' ? ' Program nadal działa, a rysunek widać poniżej jako nieruchomy rzut z ukosa.' : null),
    );
  }

  // ── editing ────────────────────────────────────────────────────────────────

  private onEdit(doc: string, key: string): void {
    this.runner.stopForEdit();
    this.els.saved!.textContent = 'Zapisuję…';
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => {
      const ok = key.startsWith('task-') ? store.set(`zadanie.${key.slice(5)}`, doc) : store.set(draftKey(key === 'draft-3d' ? '3d' : '2d'), doc);
      this.els.saved!.textContent = ok ? 'Zapisano w przeglądarce' : 'Nie udało się zapisać (pamięć przeglądarki jest niedostępna)';
    }, 350);
    clearTimeout(this.lintTimer);
    this.lintTimer = window.setTimeout(() => this.lint(), 800);
  }

  private lint(): void {
    if (this.runner.busy) return;
    const src = this.editor.value;
    const c = compile(src, this.mode);
    if (c.error) this.editor.setError({ ...c.error, kind: 'parse' });
    else if (this.editor.error) this.editor.setError(null);
  }

  // ── execution ──────────────────────────────────────────────────────────────

  run(): void {
    this.runner.run();
    if (this.isNarrow() && !(this.runner.state === 'error' && this.editor.error?.kind === 'parse')) this.setPane('plate');
  }

  step(): void {
    this.runner.step();
  }

  reset(): void {
    this.runner.reset();
    this.updateOverlay();
  }

  private currentTurtle: TurtleState = INITIAL_TURTLE;

  private showTurtle(t: TurtleState): void {
    this.currentTurtle = t;
    const f = (v: number) => fmtNum(Math.round(v * 100) / 100).replace('-', '−');
    this.els['s-x']!.textContent = f(t.pos[0]);
    this.els['s-y']!.textContent = f(t.pos[1]);
    this.els['s-z']!.textContent = f(t.pos[2]);
    const flat = Math.abs(t.heading[2]) < 1e-9 && Math.abs(t.up[2] - 1) < 1e-9;
    this.els['k-kurs']!.textContent = flat ? 'kurs' : 'kierunek';
    if (flat) {
      const a = (Math.atan2(t.heading[0], t.heading[1]) * 180) / Math.PI;
      const r = Math.round((((a % 360) + 360) % 360) * 10) / 10;
      this.els['s-kurs']!.textContent = `${r === 360 ? 0 : r}°`;
    } else {
      this.els['s-kurs']!.textContent = `(${t.heading.map((v) => (Math.round(v * 100) / 100).toFixed(2).replace('-', '−')).join(', ')})`;
    }
    this.els['s-pen']!.textContent = t.penDown ? 'opuszczony' : 'podniesiony';
    this.els['s-color']!.textContent = t.color;
    this.els.swatch!.style.background = t.color;
    this.els['s-width']!.textContent = String(t.width);
  }

  private onRunState(state: RunState, info: RunInfo): void {
    const changed = state !== this.lastState;
    this.lastState = state;
    this.root.dataset.run = state;
    const pause = this.els.pause as HTMLButtonElement;
    (this.els.pause as HTMLButtonElement).disabled = !(state === 'running' || state === 'paused');
    if (changed) {
      const paused = state === 'paused';
      pause.replaceChildren(icon(paused ? 'play' : 'pause'), h('span', { class: 'btn-label' }, paused ? 'Wznów' : 'Pauza'));
      pause.title = `${paused ? 'Wznów' : 'Pauza'} (${MOD} + Shift + Spacja)`;
      pause.setAttribute('aria-pressed', String(paused));
      this.trace.setLive(state === 'running' || state === 'paused');
    }
    this.els.counters!.textContent = `${fmtInt(info.ops)} / ${fmtInt(10000)} operacji · ${fmtInt(info.segments)} odc.`;
    if (info.message !== undefined && info.message !== '') {
      const tone = state === 'error' ? 'error' : state === 'done' ? 'done' : state === 'running' ? 'running' : state === 'stopped' ? 'warning' : 'idle';
      this.els.status!.dataset.tone = tone;
      this.els.statusText!.textContent = info.error ? `${info.message} ${info.error.message}` : info.message;
      this.els.statusAction!.hidden = !info.error;
    }
    if (changed && state === 'done' && this.context.kind === 'task' && this.overlayDirty) this.updateOverlay();
  }

  private showError(): void {
    const e = this.editor.error;
    if (!e) return;
    if (this.isNarrow()) this.setPane('code');
    this.editor.reveal(e.line, e.column);
  }

  /** Runs the current program to the end without animation (used by window.logomocja.open). */
  runToEnd(): RunResult {
    return this.runner.runInstant();
  }

  // ── loading programs ───────────────────────────────────────────────────────

  /** Puts a program into the editor as one undoable paste, keeping the previous draft safe. */
  loadProgram(source: string, mode: Mode, what: string, runMode: 'animate' | 'instant' | 'none' = 'animate', quiet = false): void {
    if (this.context.kind === 'task') this.leaveTask(false);
    this.runner.reset();
    if (mode !== this.mode) this.applyMode(mode);
    const current = this.editor.value;
    if (current !== source && !isPristine(current)) {
      const backup: Backup = { source: current, mode, at: new Date().toISOString() };
      store.set(`backup.${mode}`, backup);
      if (!quiet) toast(`${what} Poprzedni szkic odłożono na bok.`.trim(), { label: 'Przywróć szkic', run: () => this.restoreBackup(mode) });
    } else if (what && !quiet) {
      toast(what);
    }
    this.editor.replaceAll(source);
    store.set(draftKey(mode), source);
    this.els.saved!.textContent = 'Zapisano w przeglądarce';
    if (runMode === 'animate') {
      this.whenSurfaceReady(() => this.run());
    } else if (runMode === 'instant') {
      this.runner.runInstant();
      this.whenSurfaceReady(() => this.surface()?.fit(false));
    }
  }

  private refreshRestoreItem(): void {
    const b = store.get<Backup | null>(`backup.${this.mode}`, null);
    this.restoreItem.hidden = !b || this.context.kind === 'task';
    if (b) {
      const d = new Date(b.at);
      const label = this.restoreItem.querySelector('.menu-label')!;
      label.textContent = `Przywróć odłożony szkic (${d.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })})`;
    }
  }

  restoreBackup(mode: Mode = this.mode): void {
    const b = store.get<Backup | null>(`backup.${mode}`, null);
    if (!b) return;
    if (this.context.kind === 'task') this.leaveTask(false);
    if (mode !== this.mode) this.applyMode(mode);
    if (!isPristine(this.editor.value) && this.editor.value !== b.source) {
      store.set(`backup.${mode}`, { source: this.editor.value, mode, at: new Date().toISOString() });
    } else {
      store.remove(`backup.${mode}`);
    }
    this.editor.replaceAll(b.source);
    store.set(draftKey(mode), b.source);
    toast('Przywrócono odłożony szkic.');
    this.runner.runInstant();
  }

  private newProgram(): void {
    if (this.context.kind === 'task') {
      this.editor.replaceAll(starterFor(this.context.ch));
      this.reset();
      this.editor.focus();
      return;
    }
    this.loadProgram('', this.mode, 'Zaczynasz nowy program.', 'none');
    this.reset();
    this.editor.focus();
  }

  private async openFile(): Promise<void> {
    const f = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (f) await this.readFile(f);
  }

  private async readFile(f: File): Promise<void> {
    if (f.size > 200_000) {
      toast(`Plik „${f.name}” jest za duży na program Logo.`, undefined, 'error');
      return;
    }
    const text = (await f.text()).replace(/\r\n?/g, '\n');
    const mode: Mode = usesSpace(text) ? '3d' : this.mode;
    this.loadProgram(text, mode, `Wczytano plik „${f.name}”.`, 'instant');
  }

  private downloadProgram(): void {
    const name = this.context.kind === 'task' ? `zadanie-${this.context.ch.id}.logo` : `logomocja-${this.mode}-${timeStamp()}.logo`;
    download(name, new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' }));
  }

  async exportPNG(): Promise<void> {
    const blob = await this.surface()?.exportPNG();
    if (!blob) {
      toast('Rysunek jest pusty. Najpierw uruchom program.', undefined, 'error');
      return;
    }
    download(`logomocja-${this.mode}-${timeStamp()}.png`, blob);
  }

  openShare(): void {
    this.sharePop.open();
  }

  // ── challenges ─────────────────────────────────────────────────────────────

  private overlayDirty = false;
  private lastCheck: ReturnType<typeof checkChallenge> | null = null;

  openTask(ch: Challenge): void {
    if (this.context.kind === 'task' && this.context.ch.id === ch.id) return;
    this.runner.reset();
    this.context = { kind: 'task', ch };
    this.lastCheck = null;
    this.applyMode(ch.mode);
    this.renderTaskPanel();
    this.runner.runInstant();
    this.whenSurfaceReady(() => this.surface()?.fit(false));
  }

  leaveTask(restore = true): void {
    if (this.context.kind !== 'task') return;
    this.runner.reset();
    this.context = { kind: 'draft' };
    this.lastCheck = null;
    this.els.taskPanel!.hidden = true;
    this.els.taskPanel!.replaceChildren();
    this.root.classList.remove('has-task');
    this.els.title!.textContent = 'Program';
    const mode = store.get<Mode>('mode', '2d') === '3d' ? '3d' : '2d';
    this.applyMode(mode);
    if (restore) {
      this.runner.runInstant();
      this.whenSurfaceReady(() => this.surface()?.fit(false));
    }
  }

  private updateOverlay(): void {
    const s = this.surface();
    if (!s) return;
    if (this.context.kind !== 'task') {
      s.setOverlay(null);
      return;
    }
    const ghost = targetOf(this.context.ch);
    s.setOverlay({ ghost, missing: this.lastCheck?.missing ?? [], extra: this.lastCheck?.extra ?? [] });
    this.overlayDirty = false;
  }

  private renderTaskPanel(): void {
    if (this.context.kind !== 'task') return;
    const ch = this.context.ch;
    const idx = CHALLENGES.indexOf(ch);
    const solved = this.host.progress()[ch.id]?.solved;
    const thumb = h('canvas', { class: 'task-thumb', 'aria-hidden': 'true', 'data-w': '96', 'data-h': '72' }) as HTMLCanvasElement;
    const result = h('div', { class: 'task-result', role: 'status', 'aria-live': 'polite' });
    if (solved) {
      result.dataset.tone = 'pass';
      result.append(h('strong', { class: 'stamp' }, icon('check'), 'Zaliczone'), ' To zadanie jest już rozwiązane. Możesz je zrobić jeszcze raz, inaczej.');
    }
    const next = CHALLENGES[idx + 1];
    const checkBtn = h('button', { type: 'button', class: 'btn btn-primary' }, icon('task'), h('span', null, 'Sprawdź rozwiązanie'));
    checkBtn.addEventListener('click', () => {
      this.runner.runInstant();
      const check = checkChallenge(ch, this.editor.value);
      this.lastCheck = check;
      this.updateOverlay();
      this.surface()?.fit(true);
      result.replaceChildren();
      result.dataset.tone = check.passed ? 'pass' : 'fail';
      if (check.passed) {
        this.host.markSolved(ch.id);
        result.append(h('strong', { class: 'stamp' }, icon('check'), check.verdict), ' ', check.reason);
        if (next) result.append(' ', h('a', { href: `#/zadania/${next.id}`, class: 'link-btn' }, `Następne: ${next.title}`, icon('arrowRight', 'icon-small')));
        else result.append(' ', h('a', { href: '#/zadania', class: 'link-btn' }, 'Wszystkie zadania'));
      } else {
        result.append(h('strong', { class: 'verdict' }, check.verdict, '. '), check.reason);
        if (check.error) result.append(' ', h('button', { type: 'button', class: 'link-btn', onclick: () => this.showError() }, 'Pokaż błąd'));
      }
      if (this.isNarrow() && !check.error) this.setPane('plate');
    });
    const hint = h('details', { class: 'task-hint' }, h('summary', null, 'Podpowiedź'), h('p', null, ch.hint));
    this.els.taskPanel!.replaceChildren(
      h(
        'div',
        { class: 'task-top' },
        thumb,
        h(
          'div',
          { class: 'task-text' },
          h('p', { class: 'task-crumbs' }, h('a', { href: '#/zadania' }, 'Zadania'), ` / ${idx + 1} z ${CHALLENGES.length} · ${ch.mode.toUpperCase()}`),
          h('h2', { class: 'task-title', id: 'task-title', tabindex: '-1' }, ch.title),
          h('p', { class: 'task-desc' }, ch.task),
        ),
      ),
      h('div', { class: 'task-actions' }, checkBtn, hint, h('button', { type: 'button', class: 'link-btn task-leave', onclick: () => this.host.navigate('#/') }, icon('arrowLeft', 'icon-small'), 'Wróć do szkicu')),
      result,
    );
    this.els.taskPanel!.hidden = false;
    this.root.classList.add('has-task');
    this.els.title!.textContent = 'Twoje rozwiązanie';
    requestAnimationFrame(() => renderThumb(thumb, targetOf(ch), ch.mode, { pad: 8, widthScale: 0.7 }));
  }

  refreshTheme(): void {
    this.view2d.refreshTheme();
    this.view3d?.refreshTheme();
    if (this.context.kind === 'task') {
      const thumb = this.root.querySelector<HTMLCanvasElement>('.task-thumb');
      if (thumb) renderThumb(thumb, targetOf(this.context.ch), this.context.ch.mode, { pad: 8, widthScale: 0.7 });
    }
  }

  focusEditor(): void {
    this.editor.focus();
  }
}

function shortcutsPanel(): HTMLElement {
  const row = (keys: HTMLElement, what: string) => h('div', { class: 'keys-row' }, h('dt', null, keys), h('dd', null, what));
  return h(
    'div',
    { class: 'keys' },
    h('h3', { class: 'pop-title' }, 'Skróty klawiszowe'),
    h(
      'dl',
      { class: 'keys-list' },
      row(kbd(MOD, 'Enter'), 'Uruchom program od początku'),
      row(kbd(MOD, 'Shift', 'Enter'), 'Wykonaj jedno polecenie (krok)'),
      row(kbd(MOD, 'Shift', 'Spacja'), 'Pauza albo wznowienie'),
      row(kbd('Esc'), 'Od nowa: wyczyść rysunek, żółw wraca na start'),
      row(h('span', { class: 'kbd-group' }, h('kbd', null, '+'), h('kbd', null, '−'), h('kbd', null, '0')), 'Na rysunku: przybliż, oddal, dopasuj'),
      row(h('span', { class: 'kbd-group' }, h('kbd', null, '←'), h('kbd', null, '↑'), h('kbd', null, '→'), h('kbd', null, '↓')), 'Na rysunku: przesuń widok (w 3D z Shift: obróć)'),
      row(kbd('Tab'), 'Wyjście z edytora do następnego przycisku'),
    ),
    h('p', { class: 'pop-text' }, 'Skróty działają też wtedy, gdy kursor stoi w edytorze.'),
  );
}
