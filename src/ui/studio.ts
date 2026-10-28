import { compile, Execution, exportSegments, LogoError, type Mode, type RunResult, type Segment, type Turtle } from '../lang';
import { THREE_D_ONLY, COMMANDS } from '../lang/keywords';
import { tokenize } from '../lang/lexer';
import { EXAMPLES, type Example } from '../content/examples';
import { checkChallenge, expectedSegments, type Challenge } from '../content/challenges';
import { CodeEditor } from './editor';
import { View2D } from './view2d';
import type { View3D } from './view3d';
import { h, download, isMac, nextFrame } from './dom';
import { icon } from './icons';
import { ask, showLink, toast } from './dialogs';
import { load, save, loadJSON, saveJSON } from './storage';
import { buildPermalink } from './share';
import { export2DPng, paintFitted, themeColors } from './paint';
import { onThemeChange } from './theme';

type RunState = 'idle' | 'running' | 'paused' | 'done' | 'error' | 'stopped';

/** Kroki na sekundę dla kolejnych pozycji suwaka tempa. */
const SPEEDS = [1, 3, 6, 12, 25, 50, 100, 250, 1000, Infinity];
const DEFAULT_SPEED = 8;

const DEFAULT_DRAFTS: Record<Mode, string> = {
  '2d': `; Witaj w Logomocji! Naciśnij „Uruchom” (Ctrl+Enter).
; Żółw zaczyna w środku i patrzy w górę.
kolor "#16866a"
grubosc 3
powtorz 6 [
  np 80
  pw 60
]
`,
  '3d': `; Tryb 3D: żółw może też unosić nos (góra) i przechylać się (pp).
; Obracaj widok myszą lub palcem.
kolor "#2b6fb3"
grubosc 3
powtorz 4 [
  powtorz 4 [np 80 pw 90]
  pp 45
]
`,
};

export function kroki(n: number): string {
  if (n === 1) return 'krok';
  const d = n % 10;
  const t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? 'kroki' : 'kroków';
}

function odcinki(n: number): string {
  if (n === 1) return '1 odcinek';
  const d = n % 10;
  const t = n % 100;
  const w = d >= 2 && d <= 4 && (t < 12 || t > 14) ? 'odcinki' : 'odcinków';
  return `${n.toLocaleString('pl-PL')} ${w}`;
}

function speedLabel(i: number): string {
  const s = SPEEDS[i - 1];
  return s === Infinity ? 'natychmiast' : `${s} ${kroki(s)}/s`;
}

export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Czy program używa poleceń dostępnych tylko w 3D (np. przy otwieraniu pliku). */
export function looks3D(source: string): boolean {
  try {
    return tokenize(source).some((t) => t.type === 'word' && !t.colon && THREE_D_ONLY.has(COMMANDS.get(t.lower)!));
  } catch {
    return /(^|\s)(gora|góra|dol|dół|pp|pl|przechyl\w+|pitch\w+|roll\w+)\s/i.test(source);
  }
}

function key(mode: Mode): string {
  return `draft.${mode}`;
}

export class Studio {
  readonly root: HTMLElement;
  readonly editor: CodeEditor;
  private mode: Mode = '2d';
  private view2d!: View2D;
  private view3d: View3D | null = null;
  private view3dLoading: Promise<View3D | null> | null = null;
  private readonly has3D = webglAvailable();
  private view3dError: string | null = null;

  private exec: Execution | null = null;
  private state: RunState = 'idle';
  private segments: Segment[] = [];
  private turtle: Turtle | null = null;
  private speed = DEFAULT_SPEED;
  private budget = 0;
  private lastTime = 0;
  private rafId = 0;
  private checkTimer = 0;
  private saveTimer = 0;

  private challenge: Challenge | null = null;
  private showGhost = true;
  private onChallengeSolved: ((c: Challenge) => void) | null = null;

  // elementy
  private readonly modeButtons: Record<Mode, HTMLButtonElement>;
  private readonly btnRun: HTMLButtonElement;
  private readonly btnStep: HTMLButtonElement;
  private readonly btnPause: HTMLButtonElement;
  private readonly btnReset: HTMLButtonElement;
  private readonly speedInput: HTMLInputElement;
  private readonly speedOut: HTMLOutputElement;
  private readonly status: HTMLElement;
  private readonly statusText: HTMLElement;
  private readonly statusJump: HTMLButtonElement;
  private readonly canvas2d: HTMLCanvasElement;
  private readonly canvas3d: HTMLCanvasElement;
  private readonly stageNote: HTMLElement;
  private readonly stageInfo: HTMLElement;
  private readonly tools3d: HTMLElement;
  private readonly exampleSelect: HTMLSelectElement;
  private readonly fileInput: HTMLInputElement;
  private readonly taskCard: HTMLElement;

  constructor() {
    this.editor = new CodeEditor({ label: 'Program w języku Logo', id: 'kod' });

    const mk = (cls: string, label: string, ic: Parameters<typeof icon>[0], shortcut: string, aria: string, onclick: () => void) =>
      h('button', {
        type: 'button',
        class: `btn ${cls}`,
        title: `${label} (${shortcut})`,
        'aria-keyshortcuts': aria,
        html: `${icon(ic)}<span class="lbl">${label}</span>`,
        onclick,
      });
    const mod = isMac ? '⌘' : 'Ctrl';
    this.btnRun = mk('primary', 'Uruchom', 'play', `${mod}+Enter`, isMac ? 'Meta+Enter' : 'Control+Enter', () => this.run());
    this.btnStep = mk('', 'Krok', 'step', `${mod}+Shift+Enter lub F10`, 'F10', () => this.step());
    this.btnPause = mk('', 'Pauza', 'pause', `${mod}+Shift+Spacja lub F8`, 'F8', () => this.togglePause());
    this.btnReset = mk('', 'Reset', 'reset', `${mod}+Shift+Backspace lub F9`, 'F9', () => this.reset());

    this.modeButtons = {
      '2d': h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': 'true', onclick: () => this.switchMode('2d') }, '2D'),
      '3d': h('button', { type: 'button', class: 'seg-btn', 'aria-pressed': 'false', onclick: () => this.switchMode('3d') }, '3D'),
    };

    this.speed = Math.min(10, Math.max(1, Number(load('speed')) || DEFAULT_SPEED));
    this.speedInput = h('input', {
      type: 'range',
      min: 1,
      max: 10,
      step: 1,
      value: this.speed,
      id: 'tempo',
      'aria-describedby': 'tempo-out',
    });
    this.speedOut = h('output', { id: 'tempo-out', for: 'tempo' }, speedLabel(this.speed));
    this.speedInput.addEventListener('input', () => {
      this.speed = Number(this.speedInput.value);
      this.speedOut.textContent = speedLabel(this.speed);
      this.speedInput.setAttribute('aria-valuetext', speedLabel(this.speed));
      save('speed', String(this.speed));
    });
    this.speedInput.setAttribute('aria-valuetext', speedLabel(this.speed));

    this.exampleSelect = h(
      'select',
      { class: 'select', 'aria-label': 'Wczytaj przykład' },
      h('option', { value: '' }, 'Przykłady…'),
      h('optgroup', { label: 'Płaskie (2D)' }, ...EXAMPLES.filter((e) => e.mode === '2d').map((e) => h('option', { value: e.id }, e.title))),
      h('optgroup', { label: 'Przestrzenne (3D)' }, ...EXAMPLES.filter((e) => e.mode === '3d').map((e) => h('option', { value: e.id }, e.title))),
    );
    this.exampleSelect.addEventListener('change', () => {
      const ex = EXAMPLES.find((e) => e.id === this.exampleSelect.value);
      this.exampleSelect.value = '';
      if (ex) {
        void this.loadExample(ex).then((ok) => {
          if (ok && !/^#\/?$/.test(location.hash)) location.hash = '#/';
        });
      }
    });

    this.fileInput = h('input', { type: 'file', accept: '.logo,.txt,text/plain', class: 'sr-only', tabindex: -1, 'aria-hidden': 'true' });
    this.fileInput.addEventListener('change', () => {
      const f = this.fileInput.files?.[0];
      this.fileInput.value = '';
      if (f) void this.openFile(f);
    });

    const fileBtn = (label: string, ic: Parameters<typeof icon>[0], onclick: () => void, title = label) =>
      h('button', { type: 'button', class: 'btn ghost', title, html: `${icon(ic)}<span class="lbl">${label}</span>`, onclick });

    const toolbar = h(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      h('div', { class: 'seg', role: 'group', 'aria-label': 'Tryb rysowania' }, this.modeButtons['2d'], this.modeButtons['3d']),
      h('div', { class: 'run-group' }, this.btnRun, this.btnStep, this.btnPause, this.btnReset),
      h('div', { class: 'speed' }, h('label', { for: 'tempo' }, 'Tempo'), this.speedInput, this.speedOut),
    );

    const fileBar = h(
      'div',
      { class: 'filebar', role: 'toolbar', 'aria-label': 'Plik i udostępnianie' },
      this.exampleSelect,
      fileBtn('Otwórz', 'open', () => this.fileInput.click(), 'Otwórz plik .logo'),
      fileBtn('Pobierz', 'save', () => this.downloadProgram(), 'Pobierz program jako plik .logo'),
      fileBtn('Link', 'link', () => void this.share(), 'Utwórz odnośnik do programu'),
      fileBtn('PNG', 'image', () => void this.exportPng(), 'Zapisz rysunek jako obraz PNG'),
      this.fileInput,
    );

    this.statusText = h('span', { class: 'status-text' });
    this.statusJump = h('button', { type: 'button', class: 'btn small ghost', hidden: true, onclick: () => this.jumpToError() }, 'Pokaż miejsce');
    this.status = h('div', { class: 'status', role: 'status', 'aria-live': 'polite' }, this.statusText, this.statusJump);

    this.taskCard = h('section', { class: 'task-card', hidden: true, 'aria-label': 'Wyzwanie' });

    this.canvas2d = h('canvas', {
      class: 'c2d',
      tabindex: 0,
      role: 'img',
      'aria-label': 'Rysunek 2D. Strzałki przesuwają widok, plus i minus powiększają, zero dopasowuje rysunek.',
    });
    this.canvas3d = h('canvas', {
      class: 'c3d',
      tabindex: 0,
      role: 'img',
      hidden: true,
      'aria-label': 'Rysunek 3D. Strzałki obracają kamerę, Shift ze strzałkami przesuwa, plus i minus przybliżają, zero dopasowuje.',
    });
    this.stageNote = h('div', { class: 'stage-note', hidden: true, role: 'note' });
    this.stageInfo = h('div', { class: 'stage-info', 'aria-hidden': 'true' });

    const tool = (label: string, ic: Parameters<typeof icon>[0], onclick: () => void) =>
      h('button', { type: 'button', class: 'icon-btn', title: label, 'aria-label': label, html: icon(ic), onclick });
    this.tools3d = h(
      'div',
      { class: 'tool-group', hidden: true },
      tool('Obróć kamerę w lewo', 'orbitL', () => this.view3d?.orbit(-15, 0)),
      tool('Obróć kamerę w prawo', 'orbitR', () => this.view3d?.orbit(15, 0)),
      tool('Kamera wyżej', 'up', () => this.view3d?.orbit(0, 10)),
      tool('Kamera niżej', 'down', () => this.view3d?.orbit(0, -10)),
      tool('Przywróć kamerę', 'camera', () => this.view3d?.resetCamera()),
    );
    const tools = h(
      'div',
      { class: 'view-tools', role: 'toolbar', 'aria-label': 'Widok' },
      tool('Przybliż', 'zoomIn', () => this.zoom(1.3)),
      tool('Oddal', 'zoomOut', () => this.zoom(1 / 1.3)),
      tool('Dopasuj rysunek do widoku', 'fit', () => this.fitView()),
      this.tools3d,
    );

    const stage = h('div', { class: 'stage' }, this.canvas2d, this.canvas3d, this.stageNote, this.stageInfo, tools);

    this.root = h(
      'section',
      { class: 'studio', id: 'studio', 'aria-label': 'Studio' },
      h('h1', { class: 'sr-only' }, 'Studio Logomocji'),
      toolbar,
      h(
        'div',
        { class: 'workspace' },
        h('div', { class: 'pane code-pane' }, this.taskCard, fileBar, this.editor.root, this.status),
        h('div', { class: 'pane stage-pane' }, stage),
      ),
    );

    this.editor.onChange((v) => this.onEdit(v));
    this.bindDrop();
  }

  /** Wywoływane po wstawieniu do dokumentu (płótna muszą mieć rozmiar). */
  mount(): void {
    this.view2d = new View2D(this.canvas2d);
    this.view2d.onUserMove = () => this.updateInfo();
    const savedMode = load('mode');
    this.mode = savedMode === '3d' ? '3d' : '2d';
    this.editor.value = this.draftFor(this.mode);
    this.applyMode();
    this.setState('idle');
    this.checkSoon();
    onThemeChange(() => {
      this.view2d.refreshTheme();
      this.view3d?.refreshTheme();
    });
    window.addEventListener('keydown', (e) => this.onShortcut(e));
  }

  isVisible(): boolean {
    return !this.root.hidden && this.root.isConnected;
  }

  getMode(): Mode {
    return this.mode;
  }

  // ------------------------------------------------------------ szkice

  private draftFor(mode: Mode): string {
    return load(key(mode)) ?? DEFAULT_DRAFTS[mode];
  }

  private storageKey(): string {
    return this.challenge ? `challenge.${this.challenge.id}` : key(this.mode);
  }

  private persistNow(): void {
    clearTimeout(this.saveTimer);
    save(this.storageKey(), this.editor.value);
  }

  /** Czy bieżący szkic zawiera pracę, której nie ma nigdzie indziej. */
  private isDraftPrecious(mode: Mode): boolean {
    const text = (this.challenge || mode !== this.mode ? this.draftFor(mode) : this.editor.value).trim();
    if (!text) return false;
    if (text === DEFAULT_DRAFTS[mode].trim()) return false;
    if (EXAMPLES.some((e) => e.source.trim() === text)) return false;
    if (load(`pristine.${mode}`)?.trim() === text) return false;
    return true;
  }

  /**
   * Zastępuje szkic trybu nowym programem. Poprzedni szkic trafia do kopii
   * zapasowej, którą można przywrócić z komunikatu.
   */
  replaceDraft(text: string, mode: Mode, what: string, quiet = false): void {
    const wasChallenge = !!this.challenge;
    const previous = !wasChallenge && mode === this.mode ? this.editor.value : this.draftFor(mode);
    const precious = this.isDraftPrecious(mode);
    this.leaveChallenge(false);
    if (precious) save(`backup.${mode}`, previous);
    save(key(mode), text);
    save(`pristine.${mode}`, text);
    this.stopExecution();
    if (mode !== this.mode || wasChallenge) {
      this.mode = mode;
      save('mode', mode);
      this.applyMode();
    }
    this.editor.value = text;
    this.editor.setError(null);
    this.clearDrawing();
    this.setState('idle');
    if (!quiet) {
      if (precious) {
        toast(`Wczytano: ${what}. Poprzedni szkic zachowano.`, {
          label: 'Przywróć szkic',
          run: () => this.restoreBackup(mode),
        });
      } else {
        toast(`Wczytano: ${what}.`);
      }
    }
  }

  private restoreBackup(mode: Mode): void {
    const backup = load(`backup.${mode}`);
    if (backup === null) return;
    this.leaveChallenge(false);
    if (mode !== this.mode) {
      this.mode = mode;
      save('mode', mode);
      this.applyMode();
    }
    this.stopExecution();
    this.clearDrawing();
    this.editor.value = backup;
    save(key(mode), backup);
    this.setState('idle');
    this.checkSoon();
    toast('Przywrócono poprzedni szkic.');
  }

  /** Pyta o zgodę, jeśli wczytanie programu zastąpiłoby cenny szkic. */
  async confirmReplace(mode: Mode, what: string): Promise<boolean> {
    if (!this.challenge && !this.isDraftPrecious(mode)) return true;
    const where = this.challenge ? 'Wyjdziesz z wyzwania (Twoje rozwiązanie zostanie zapisane), a b' : 'B';
    const choice = await ask<'load' | 'save' | 'cancel'>({
      title: `Wczytać ${what}?`,
      body: [
        h(
          'p',
          {},
          `${where}ieżący szkic w trybie ${mode.toUpperCase()} zostanie zastąpiony. Kopia szkicu zostanie zachowana i będzie można ją przywrócić.`,
        ),
      ],
      buttons: [
        { label: 'Anuluj', value: 'cancel', kind: 'ghost' },
        { label: 'Pobierz szkic i wczytaj', value: 'save' },
        { label: 'Wczytaj', value: 'load', kind: 'primary' },
      ],
      cancelValue: 'cancel',
    });
    if (choice === 'cancel') return false;
    if (choice === 'save') {
      const text = this.challenge || mode !== this.mode ? this.draftFor(mode) : this.editor.value;
      download(new Blob([text], { type: 'text/plain;charset=utf-8' }), `szkic-${mode}.logo`);
    }
    return true;
  }

  /** Wczytuje przykład (po potwierdzeniu) i uruchamia go. */
  async loadExample(ex: Example): Promise<boolean> {
    if (!(await this.confirmReplace(ex.mode, `przykład „${ex.title}”`))) return false;
    this.replaceDraft(ex.source, ex.mode, `przykład „${ex.title}”`);
    this.run();
    return true;
  }

  async loadShared(source: string, mode: Mode): Promise<void> {
    this.replaceDraft(source, mode, 'program z odnośnika');
    this.run();
  }

  // ------------------------------------------------------------ tryby i wyzwania

  private applyMode(): void {
    for (const m of ['2d', '3d'] as const) {
      this.modeButtons[m].setAttribute('aria-pressed', String(m === this.mode));
    }
    const is3d = this.mode === '3d';
    this.canvas2d.hidden = is3d;
    this.tools3d.hidden = !is3d;
    this.root.dataset.mode = this.mode;
    if (is3d) {
      if (!this.has3D || this.view3dError) {
        this.canvas3d.hidden = true;
        this.showNote3D();
      } else {
        this.canvas3d.hidden = false;
        this.stageNote.hidden = true;
        void this.ensure3D();
      }
    } else {
      this.canvas3d.hidden = true;
      this.stageNote.hidden = true;
      this.view2d?.resize();
    }
    this.modeButtons['3d'].title = this.has3D
      ? 'Tryb 3D'
      : 'Tryb 3D: podgląd wyłączony, bo przeglądarka nie obsługuje WebGL';
    this.pushDrawing();
  }

  private showNote3D(): void {
    this.root.classList.add('no3d');
    this.stageNote.hidden = false;
    this.stageNote.innerHTML = '';
    this.stageNote.append(
      h('strong', {}, 'Podgląd 3D jest wyłączony.'),
      h(
        'p',
        {},
        this.view3dError ??
          'Ta przeglądarka lub urządzenie nie udostępnia WebGL, który jest potrzebny do rysowania w przestrzeni. Program w trybie 3D nadal można pisać, uruchamiać i sprawdzać, ale rysunek się nie wyświetli. Tryb 2D działa normalnie.',
      ),
    );
  }

  private ensure3D(): Promise<View3D | null> {
    if (this.view3d) return Promise.resolve(this.view3d);
    if (!this.has3D) return Promise.resolve(null);
    if (!this.view3dLoading) {
      this.view3dLoading = import('./view3d')
        .then((m) => {
          this.view3d = new m.View3D(this.canvas3d);
          this.view3d.onUserMove = () => this.updateInfo();
          this.pushDrawing();
          this.view3d.fit();
          return this.view3d;
        })
        .catch((err: unknown) => {
          console.error(err);
          this.view3dError =
            'Nie udało się uruchomić grafiki 3D (WebGL zgłosił błąd). Program w trybie 3D nadal można pisać i sprawdzać, a tryb 2D działa normalnie.';
          if (this.mode === '3d') {
            this.canvas3d.hidden = true;
            this.showNote3D();
          }
          return null;
        });
    }
    return this.view3dLoading;
  }

  switchMode(mode: Mode): void {
    if (mode === this.mode) return;
    if (this.challenge) {
      toast(`To wyzwanie rozwiązuje się w trybie ${this.challenge.mode.toUpperCase()}. Zamknij wyzwanie, aby zmienić tryb.`);
      return;
    }
    this.persistNow();
    this.stopExecution();
    this.clearDrawing();
    this.mode = mode;
    save('mode', mode);
    this.editor.value = this.draftFor(mode);
    this.editor.setError(null);
    this.applyMode();
    this.setState('idle');
    this.checkSoon();
  }

  /** Otwiera wyzwanie w studiu. */
  enterChallenge(c: Challenge, onSolved: (c: Challenge) => void): void {
    if (this.challenge?.id === c.id) return;
    this.persistNow();
    this.stopExecution();
    this.clearDrawing();
    this.challenge = c;
    this.onChallengeSolved = onSolved;
    this.mode = c.mode;
    this.applyMode();
    this.editor.value = load(`challenge.${c.id}`) ?? c.starter;
    this.editor.setError(null);
    this.renderTaskCard();
    this.taskCard.hidden = false;
    this.root.classList.add('in-challenge');
    this.setState('idle');
    this.pushDrawing();
    this.fitView();
    this.checkSoon();
  }

  /** Wraca ze szkicu wyzwania do zwykłego szkicu trybu. */
  leaveChallenge(restoreDraft = true): void {
    if (!this.challenge) return;
    this.persistNow();
    this.challenge = null;
    this.taskCard.hidden = true;
    this.taskCard.innerHTML = '';
    this.root.classList.remove('in-challenge');
    if (restoreDraft) {
      this.stopExecution();
      this.clearDrawing();
      const m = load('mode') === '3d' ? '3d' : '2d';
      this.mode = m;
      this.editor.value = this.draftFor(m);
      this.editor.setError(null);
      this.applyMode();
      this.setState('idle');
      this.checkSoon();
    }
  }

  currentChallenge(): Challenge | null {
    return this.challenge;
  }

  private renderTaskCard(): void {
    const c = this.challenge!;
    const thumb = h('canvas', { class: 'task-thumb', width: 160, height: 120, role: 'img', 'aria-label': `Wzór do narysowania: ${c.title}` });
    const result = h('p', { class: 'task-result', role: 'status', 'aria-live': 'polite' });
    const ghostToggle = h('input', { type: 'checkbox', id: 'ghost-toggle', checked: this.showGhost });
    ghostToggle.addEventListener('change', () => {
      this.showGhost = ghostToggle.checked;
      this.pushDrawing();
    });
    const solved = loadJSON<Record<string, unknown>>('challenges', {})[c.id];
    this.taskCard.innerHTML = '';
    this.taskCard.append(
      h(
        'div',
        { class: 'task-head' },
        h('span', { class: 'badge' }, `Wyzwanie · ${c.mode.toUpperCase()}`),
        solved ? h('span', { class: 'badge ok', html: `${icon('check')} rozwiązane` }) : null,
        h('button', {
          type: 'button',
          class: 'icon-btn small task-close',
          'aria-label': 'Zamknij wyzwanie i wróć do szkicu',
          title: 'Zamknij wyzwanie',
          html: icon('close'),
          onclick: () => {
            location.hash = '#/wyzwania';
          },
        }),
      ),
      h(
        'div',
        { class: 'task-body' },
        thumb,
        h(
          'div',
          {},
          h('h2', {}, c.title),
          h('p', {}, c.task),
          h('details', {}, h('summary', {}, 'Podpowiedź'), h('p', {}, c.hint)),
        ),
      ),
      h(
        'div',
        { class: 'task-actions' },
        h('button', {
          type: 'button',
          class: 'btn primary',
          html: `${icon('target')}<span>Sprawdź</span>`,
          onclick: () => this.checkCurrentChallenge(result),
        }),
        h('label', { class: 'check' }, ghostToggle, ' Pokaż wzór na rysunku'),
      ),
      result,
    );
    const ctx = thumb.getContext('2d')!;
    const col = themeColors();
    paintFitted(ctx, expectedSegments(c), c.mode, 160, 120, { background: col.stage, padding: 12 });
  }

  private checkCurrentChallenge(result: HTMLElement): void {
    const c = this.challenge;
    if (!c) return;
    this.persistNow();
    const r = checkChallenge(c, this.editor.value);
    // pokaż to, co narysował program
    this.run({ instant: true });
    result.className = `task-result ${r.ok ? 'ok' : 'fail'}`;
    result.textContent = r.message;
    if (r.ok) {
      const progress = loadJSON<Record<string, { solvedAt: string }>>('challenges', {});
      const first = !progress[c.id];
      progress[c.id] = { solvedAt: new Date().toISOString() };
      saveJSON('challenges', progress);
      this.onChallengeSolved?.(c);
      if (first) {
        const head = this.taskCard.querySelector('.task-head');
        head?.insertBefore(h('span', { class: 'badge ok', html: `${icon('check')} rozwiązane` }), head.lastChild);
      }
    }
  }

  // ------------------------------------------------------------ wykonanie

  private compileOrShow(): Execution | null {
    const src = this.editor.value;
    const c = compile(src, this.mode);
    if (c.error) {
      this.stopExecution();
      this.clearDrawing();
      this.showError(c.error, false);
      this.setState('error');
      return null;
    }
    this.editor.setError(null);
    return new Execution(c.program);
  }

  run(opts: { instant?: boolean } = {}): void {
    this.persistNow();
    this.stopExecution();
    const exec = this.compileOrShow();
    if (!exec) return;
    this.exec = exec;
    this.clearDrawing();
    this.turtle = exec.turtle;
    if (opts.instant || SPEEDS[this.speed - 1] === Infinity) {
      exec.runToEnd();
      this.finish();
      return;
    }
    this.setState('running');
    this.budget = 1;
    this.lastTime = performance.now();
    this.loop();
  }

  /** Uruchomienie bez animacji — dla window.logomocja.open. */
  runInstant(): RunResult {
    this.run({ instant: true });
    const err = this.editor.getError();
    const runErr = this.exec?.error;
    if (!this.exec && err) return { segments: [], error: { message: err.message, line: err.line, column: err.column } };
    return {
      segments: exportSegments(this.exec?.segments ?? []),
      error: runErr ? runErr.toInfo() : null,
    };
  }

  step(): void {
    if (this.state === 'running') {
      this.pause();
      return;
    }
    if (this.state !== 'paused' || !this.exec) {
      this.stopExecution();
      const exec = this.compileOrShow();
      if (!exec) return;
      this.exec = exec;
      this.clearDrawing();
      this.turtle = exec.turtle;
      exec.step(); // ustawienie na pierwszym poleceniu
      if (exec.finished) {
        this.finish();
        return;
      }
      this.setState('paused');
      this.sync();
      return;
    }
    this.exec.step();
    if (this.exec.finished) this.finish();
    else this.sync();
  }

  togglePause(): void {
    if (this.state === 'running') this.pause();
    else if (this.state === 'paused') this.resume();
  }

  pause(): void {
    if (this.state !== 'running') return;
    cancelAnimationFrame(this.rafId);
    this.setState('paused');
    this.sync();
  }

  resume(): void {
    if (this.state !== 'paused' || !this.exec) return;
    if (SPEEDS[this.speed - 1] === Infinity) {
      this.exec.runToEnd();
      this.finish();
      return;
    }
    this.setState('running');
    this.budget = 1;
    this.lastTime = performance.now();
    this.loop();
  }

  reset(): void {
    this.stopExecution();
    this.clearDrawing();
    this.editor.setError(null);
    this.setState('idle');
    this.view2d.resetView();
    this.view3d?.resetCamera();
    this.checkSoon();
  }

  private loop = (): void => {
    const exec = this.exec;
    if (!exec || this.state !== 'running') return;
    const now = performance.now();
    const rate = SPEEDS[this.speed - 1];
    const dt = Math.min(0.25, (now - this.lastTime) / 1000);
    this.lastTime = now;
    if (rate === Infinity) {
      exec.runToEnd();
    } else {
      this.budget += dt * rate;
      let n = Math.floor(this.budget);
      this.budget -= n;
      n = Math.min(n, 4000);
      while (n-- > 0 && exec.step());
    }
    if (exec.finished) {
      this.finish();
      return;
    }
    this.sync();
    this.rafId = requestAnimationFrame(this.loop);
  };

  private finish(): void {
    cancelAnimationFrame(this.rafId);
    const exec = this.exec!;
    this.sync();
    this.editor.setActive(null);
    if (exec.error) {
      this.showError(exec.error, false);
      this.setState('error');
    } else {
      this.setState('done');
    }
    if (this.mode === '2d' ? this.view2d.autoFit : this.view3d?.autoFit) this.fitView(false);
  }

  /** Zatrzymuje wykonanie, zostawiając rysunek. */
  private stopExecution(): void {
    cancelAnimationFrame(this.rafId);
    this.exec = null;
    this.editor.setActive(null);
  }

  private clearDrawing(): void {
    this.segments = [];
    this.turtle = null;
    this.pushDrawing();
  }

  /** Przenosi stan wykonania do widoków i edytora. */
  private sync(): void {
    const exec = this.exec;
    if (!exec) return;
    this.segments = exec.segments;
    this.turtle = exec.turtle;
    this.pushDrawing();
    const cur = exec.current;
    if (cur && (this.state === 'paused' || this.state === 'running')) {
      this.editor.setActive({ line: cur.tok.line, column: cur.tok.col, length: cur.tok.text.length });
    } else {
      this.editor.setActive(null);
    }
    this.updateInfo();
  }

  private pushDrawing(): void {
    const ghost = this.challenge && this.showGhost ? expectedSegments(this.challenge) : null;
    // nowa tablica przy każdej zmianie długości, żeby widoki wykryły zmianę
    const state = { segments: this.segments, turtle: this.turtle ? { ...this.turtle } : null, ghost };
    if (this.mode === '2d') this.view2d?.setState(state);
    else this.view3d?.setState(state);
    this.updateInfo();
  }

  private zoom(f: number): void {
    if (this.mode === '2d') this.view2d.zoomBy(f);
    else this.view3d?.zoomBy(f);
  }

  fitView(mark = true): void {
    if (this.mode === '2d') this.view2d.fit(mark);
    else this.view3d?.fit(mark);
  }

  /** Czeka, aż rysunek będzie na ekranie (po dopasowaniu widoku). */
  async settle(): Promise<void> {
    if (this.mode === '3d') await this.ensure3D();
    this.pushDrawing();
    this.fitView();
    await nextFrame();
    this.view3d?.renderNow();
    await nextFrame();
  }

  private updateInfo(): void {
    const n = this.segments.length;
    const ops = this.exec?.ops ?? 0;
    const parts = [this.mode.toUpperCase(), odcinki(n)];
    if (ops) parts.push(`${ops.toLocaleString('pl-PL')} operacji`);
    this.stageInfo.textContent = parts.join(' · ');
  }

  // ------------------------------------------------------------ stan i błędy

  private setState(s: RunState): void {
    this.state = s;
    this.root.dataset.state = s;
    const running = s === 'running';
    const paused = s === 'paused';
    this.btnPause.disabled = !(running || paused);
    this.btnPause.innerHTML = `${icon(paused ? 'resume' : 'pause')}<span class="lbl">${paused ? 'Wznów' : 'Pauza'}</span>`;
    this.btnPause.title = `${paused ? 'Wznów' : 'Pauza'} (${isMac ? '⌘' : 'Ctrl'}+Shift+Spacja lub F8)`;
    this.btnRun.innerHTML = `${icon('play')}<span class="lbl">${running || paused ? 'Od nowa' : 'Uruchom'}</span>`;
    this.btnReset.disabled = s === 'idle' && this.segments.length === 0;
    if (s !== 'error') {
      this.statusJump.hidden = true;
      this.status.classList.remove('err');
    }
    const n = this.segments.length;
    switch (s) {
      case 'idle':
        this.say('Gotowy. Naciśnij „Uruchom” albo „Krok”, aby wykonywać polecenie po poleceniu.');
        break;
      case 'running':
        this.say('Program działa…');
        break;
      case 'paused':
        this.say('Pauza. „Krok” wykonuje podświetlone polecenie, „Wznów” rusza dalej.');
        break;
      case 'done':
        this.say(`Gotowe: ${odcinki(n)}, ${(this.exec?.ops ?? 0).toLocaleString('pl-PL')} operacji.`);
        break;
      case 'stopped':
        this.say('Program zmieniono w trakcie działania, więc wykonanie przerwano. Uruchom go ponownie.');
        break;
      case 'error':
        break;
    }
    this.updateInfo();
  }

  private say(text: string): void {
    this.statusText.textContent = text;
  }

  private showError(err: LogoError, soft: boolean): void {
    this.editor.setError({ message: err.message, line: err.line, column: err.column, soft });
    const kind = soft ? 'Uwaga' : err.phase === 'run' ? 'Błąd wykonania' : 'Błąd';
    this.say(`${kind} — wiersz ${err.line}, kolumna ${err.column}: ${err.message}`);
    this.status.classList.toggle('err', !soft);
    this.statusJump.hidden = false;
  }

  private jumpToError(): void {
    const e = this.editor.getError();
    if (e) this.editor.goTo(e.line, e.column);
  }

  private onEdit(_value: string): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.persistNow(), 300);
    if (this.state === 'running' || this.state === 'paused') {
      this.stopExecution();
      this.setState('stopped');
    }
    if (this.editor.getError()) this.editor.setError(null);
    if (this.state === 'error') this.setState('idle');
    this.checkSoon();
  }

  /** Sprawdzanie składni na bieżąco, chwilę po ostatniej zmianie. */
  private checkSoon(): void {
    clearTimeout(this.checkTimer);
    this.checkTimer = window.setTimeout(() => {
      if (this.state === 'running' || this.state === 'paused') return;
      const c = compile(this.editor.value, this.mode);
      if (c.error) {
        this.showError(c.error, true);
      } else if (this.editor.getError()?.soft) {
        this.editor.setError(null);
        this.statusJump.hidden = true;
        this.setState(this.state === 'error' ? 'idle' : this.state);
      }
    }, 450);
  }

  // ------------------------------------------------------------ pliki

  private downloadProgram(): void {
    const name = this.challenge ? `wyzwanie-${this.challenge.id}` : `logomocja-${this.mode}`;
    download(new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' }), `${name}.logo`);
    if (!this.challenge) save(`pristine.${this.mode}`, this.editor.value);
  }

  private async openFile(file: File): Promise<void> {
    if (file.size > 1_000_000) {
      toast('Ten plik jest za duży — program może mieć najwyżej 50 000 znaków.');
      return;
    }
    const text = (await file.text()).replace(/\r\n?/g, '\n');
    const mode: Mode = this.challenge ? this.challenge.mode : looks3D(text) ? '3d' : this.mode;
    if (this.challenge) {
      this.editor.value = text;
      this.persistNow();
      this.checkSoon();
      toast(`Wczytano plik „${file.name}”.`);
      return;
    }
    this.replaceDraft(text, mode, `plik „${file.name}”`);
    this.checkSoon();
  }

  private bindDrop(): void {
    const el = this.editor.root;
    el.addEventListener('dragover', (e) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        el.classList.add('drop');
      }
    });
    el.addEventListener('dragleave', () => el.classList.remove('drop'));
    el.addEventListener('drop', (e) => {
      el.classList.remove('drop');
      const f = e.dataTransfer?.files?.[0];
      if (f) {
        e.preventDefault();
        void this.openFile(f);
      }
    });
  }

  private async share(): Promise<void> {
    const url = await buildPermalink(this.editor.value, this.mode);
    let copied = false;
    try {
      await navigator.clipboard.writeText(url);
      copied = true;
    } catch {
      copied = false;
    }
    showLink(url, copied);
  }

  private async exportPng(): Promise<void> {
    if (!this.segments.length) {
      toast('Nie ma jeszcze czego zapisać — najpierw uruchom program.');
      return;
    }
    let blob: Blob;
    if (this.mode === '3d') {
      const v = await this.ensure3D();
      if (!v) {
        toast('Bez WebGL nie da się zapisać rysunku 3D.');
        return;
      }
      blob = await v.exportPng();
    } else {
      blob = await export2DPng(this.segments, themeColors().stage);
    }
    const name = this.challenge ? `wyzwanie-${this.challenge.id}` : `logomocja-${this.mode}`;
    download(blob, `${name}.png`);
  }

  // ------------------------------------------------------------ skróty

  private onShortcut(e: KeyboardEvent): void {
    if (!this.isVisible() || document.querySelector('dialog[open]')) return;
    const mod = e.ctrlKey || e.metaKey;
    let action: (() => void) | null = null;
    if (mod && e.key === 'Enter' && !e.shiftKey) action = () => this.run();
    else if ((mod && e.shiftKey && e.key === 'Enter') || e.key === 'F10') action = () => this.step();
    else if ((mod && e.shiftKey && (e.code === 'Space' || e.key === ' ')) || e.key === 'F8') action = () => this.togglePause();
    else if ((mod && e.shiftKey && e.key === 'Backspace') || e.key === 'F9') action = () => this.reset();
    if (action) {
      e.preventDefault();
      action();
    }
  }
}

export const SHORTCUTS = (): [string, string][] => {
  const mod = isMac ? '⌘' : 'Ctrl';
  return [
    [`${mod} + Enter`, 'Uruchom program od początku'],
    [`${mod} + Shift + Enter  lub  F10`, 'Krok: wykonaj jedno polecenie'],
    [`${mod} + Shift + Spacja  lub  F8`, 'Pauza / wznów'],
    [`${mod} + Shift + Backspace  lub  F9`, 'Reset: wyczyść rysunek'],
    ['Tab / Shift + Tab', 'Wcięcie wiersza w edytorze (Escape, potem Tab — wyjście z edytora)'],
    ['Strzałki', 'Na rysunku: przesuwanie widoku (2D) lub obrót kamery (3D)'],
    ['Shift + strzałki', 'Na rysunku 3D: przesuwanie kamery'],
    ['+  /  −', 'Na rysunku: przybliż / oddal'],
    ['0', 'Na rysunku: dopasuj widok do rysunku'],
    ['?', 'Ta lista skrótów'],
  ];
};
