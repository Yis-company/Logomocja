import { diagnose, Session, type Diagnostic, type Mode, type Segment, type Turtle } from '../lang';
import { EXAMPLES, type Example } from '../data/examples';
import { CHALLENGES, type Challenge } from '../challenges/challenges';
import { checkChallenge } from '../challenges/checker';
import { clear, h } from './dom';
import { Editor } from './editor';
import { createDialog, type AppDialog } from './dialog';
import { decodeText, parseMode, permalinkFor } from './permalink';
import { loadJson, loadString, saveJson, saveString } from './storage';
import { showToast } from './toast';
import { View2D, type Scene } from './view2d';
import { View3D, webglAvailable } from './view3d';

/** Speed steps for the animation, in statements per second. The last one runs at once. */
const SPEEDS = [1, 3, 10, 30, 100, 300, 1000, Infinity];
const SPEED_LABELS = ['1 polecenie na sekundę', '3 polecenia na sekundę', '10 poleceń na sekundę', '30 poleceń na sekundę', '100 poleceń na sekundę', '300 poleceń na sekundę', '1000 poleceń na sekundę', 'natychmiast'];
const DEFAULT_SPEED = 4;

const STARTER: Record<Mode, string> = {
  '2d': `; Witaj w Logomocji! Naciśnij Uruchom (Alt+U), aby zobaczyć rysunek.
kolor "#16866a"
grubosc 3
powtorz 4 [
  np 100
  pw 90
]
`,
  '3d': `; Tryb 3D: gora i dol unoszą i opuszczają nos żółwia.
kolor "#c1763d"
grubosc 3
powtorz 6 [
  np 40
  gora 90
  np 25
  dol 90
]
`,
};

const MODE_NAMES: Record<Mode, string> = { '2d': '2D', '3d': '3D' };

function initialTurtle(): Turtle {
  return {
    position: [0, 0, 0],
    heading: [0, 1, 0],
    right: [1, 0, 0],
    up: [0, 0, 1],
    pen: true,
    color: '#16866a',
    width: 3,
  };
}

const EMPTY_SEGMENTS: readonly Segment[] = [];

interface ChallengeProgress {
  solved: string[];
}

function draftKey(mode: Mode): string {
  return `szkic.${mode}`;
}

function backupKey(mode: Mode): string {
  return `kopia.${mode}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = h('a', { href: url, download: filename, class: 'visually-hidden' });
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/**
 * The studio page: editor, drawing, toolbar, examples, challenges and sharing.
 * It owns the single running session and keeps the editor's draft per mode.
 */
export class Workspace {
  readonly element: HTMLElement;
  private mode: Mode;
  private readonly drafts: Record<Mode, string>;
  private readonly editor: Editor;
  private readonly view2d: View2D;
  private view3d: View3D | null = null;
  private readonly webgl = webglAvailable();

  private session: Session | null = null;
  private sessionSource = '';
  private playing = false;
  private stale = false;
  private budget = 0;
  private lastFrame = 0;
  private diagnostic: Diagnostic | null = null;
  private validateTimer = 0;
  private draftTimer = 0;
  private speedIndex: number;
  private challenge: Challenge | null = null;
  private challengeResult: { passed: boolean; message: string } | null = null;
  private showTarget = false;
  private target: readonly Segment[] | null = null;

  private readonly statusLine: HTMLElement;
  private readonly runButton: HTMLButtonElement;
  private readonly stepButton: HTMLButtonElement;
  private readonly pauseButton: HTMLButtonElement;
  private readonly resetButton: HTMLButtonElement;
  private readonly speedInput: HTMLInputElement;
  private readonly speedOutput: HTMLOutputElement;
  private readonly modeButtons: Record<Mode, HTMLButtonElement>;
  private readonly modeNotice: HTMLElement;
  private readonly canvasHost: HTMLElement;
  private readonly canvas2d: HTMLCanvasElement;
  private readonly canvas3d: HTMLCanvasElement;
  private readonly followToggle: HTMLInputElement;
  private readonly banner: HTMLElement;
  private readonly fileInput: HTMLInputElement;
  private readonly paneTabs: HTMLButtonElement[];
  private readonly panes: HTMLElement;

  private readonly examplesDialog: AppDialog;
  private readonly challengesDialog: AppDialog;
  private readonly shareDialog: AppDialog;
  private readonly shortcutsDialog: AppDialog;
  private readonly shareInput: HTMLInputElement;

  constructor(initialMode: Mode) {
    this.mode = this.canUse3d() || initialMode === '2d' ? initialMode : '2d';
    this.drafts = {
      '2d': loadString(draftKey('2d')) ?? STARTER['2d'],
      '3d': loadString(draftKey('3d')) ?? STARTER['3d'],
    };
    this.speedIndex = Math.min(SPEEDS.length - 1, Math.max(0, Number(loadString('szybkosc') ?? DEFAULT_SPEED)));

    // Editor.
    this.editor = new Editor({
      label: 'Program w języku Logo',
      describedBy: 'status-line',
      onChange: (text) => this.onEdit(text),
    });
    // Toolbar controls.
    this.runButton = h('button', { type: 'button', class: 'btn primary', title: 'Uruchom (Alt+U lub Ctrl+Enter)', on: { click: () => this.runOrResume() } }, 'Uruchom');
    this.stepButton = h('button', { type: 'button', class: 'btn', title: 'Krok (Alt+K)', on: { click: () => this.step() } }, 'Krok');
    this.pauseButton = h('button', { type: 'button', class: 'btn', title: 'Pauza (Alt+P)', on: { click: () => this.togglePause() } }, 'Pauza');
    this.resetButton = h('button', { type: 'button', class: 'btn', title: 'Reset (Alt+R)', on: { click: () => this.reset() } }, 'Reset');
    this.speedInput = h('input', {
      type: 'range',
      min: 0,
      max: SPEEDS.length - 1,
      step: 1,
      value: this.speedIndex,
      id: 'speed',
      'aria-label': 'Szybkość animacji',
      on: { input: () => this.setSpeed(Number(this.speedInput.value)) },
    });
    this.speedOutput = h('output', { for: 'speed', class: 'speed-output' });
    this.modeButtons = {
      '2d': h('button', { type: 'button', role: 'radio', 'aria-checked': 'false', class: 'seg', on: { click: () => this.setMode('2d') } }, '2D'),
      '3d': h('button', {
        type: 'button',
        role: 'radio',
        'aria-checked': 'false',
        class: 'seg',
        disabled: !this.canUse3d(),
        title: this.canUse3d() ? 'Tryb 3D' : 'Tryb 3D jest niedostępny w tej przeglądarce',
        on: { click: () => this.setMode('3d') },
      }, '3D'),
    };
    this.statusLine = h('p', { id: 'status-line', class: 'status', role: 'status' });
    this.modeNotice = h('p', { class: 'notice', hidden: true });

    // Drawing.
    this.canvas2d = h('canvas', {
      class: 'view-canvas',
      tabindex: 0,
      role: 'img',
      'aria-label': 'Rysunek w widoku 2D. Strzałki przesuwają widok, plus i minus przybliżają.',
    });
    this.canvas3d = h('canvas', {
      class: 'view-canvas',
      tabindex: 0,
      role: 'img',
      'aria-label': 'Rysunek w widoku 3D. Przeciągnij, aby obracać kamerę; kółko myszy przybliża.',
      hidden: true,
    });
    this.canvasHost = h('div', { class: 'view-host' }, this.canvas2d, this.canvas3d);
    this.view2d = new View2D(this.canvas2d, () => this.updateStatus());
    this.followToggle = h('input', {
      type: 'checkbox',
      id: 'follow',
      checked: true,
      on: {
        change: () => {
          this.view2d.setFollow(this.followToggle.checked && this.playing);
        },
      },
    });

    // Challenge banner.
    this.banner = h('section', { class: 'challenge', 'aria-label': 'Wyzwanie', hidden: true });

    // Mobile tabs and panes.
    this.panes = h('div', { class: 'panes', 'data-pane': 'code' });
    this.paneTabs = [
      h('button', { type: 'button', class: 'pane-tab', 'aria-pressed': 'true', on: { click: () => this.showPane('code') } }, 'Program'),
      h('button', { type: 'button', class: 'pane-tab', 'aria-pressed': 'false', on: { click: () => this.showPane('view') } }, 'Rysunek'),
    ];

    this.fileInput = h('input', {
      type: 'file',
      accept: '.logo,text/plain',
      class: 'visually-hidden',
      'aria-label': 'Wybierz plik .logo',
      on: { change: () => this.openFile() },
    });

    // Dialogs.
    this.examplesDialog = createDialog('dialog-examples', 'Przykłady', [this.examplesList()]);
    this.challengesDialog = createDialog('dialog-challenges', 'Wyzwania', [this.challengesList()]);
    this.shareInput = h('input', { type: 'text', readonly: true, class: 'link-input', 'aria-label': 'Link do programu', id: 'share-link' });
    this.shareDialog = createDialog('dialog-share', 'Udostępnij program', [
      h('p', {}, 'Link zawiera program i tryb. Po otwarciu program zostanie wczytany i uruchomiony. Nic nie trafia na serwer: link jest zapisany w adresie.'),
      h('div', { class: 'link-row' }, this.shareInput, h('button', { type: 'button', class: 'btn primary', on: { click: () => this.copyLink() } }, 'Kopiuj link')),
    ]);
    this.shortcutsDialog = createDialog('dialog-shortcuts', 'Skróty klawiszowe', [this.shortcutsTable()]);

    const details = h('details', { class: 'menu' });
    // Choosing an item closes the menu, then runs the action.
    const menuItem = (label: string, action: () => void) =>
      h('button', {
        type: 'button',
        class: 'menu-item',
        on: {
          click: () => {
            details.open = false;
            action();
          },
        },
      }, label);
    details.append(
      h('summary', { class: 'btn' }, 'Plik i więcej'),
      h(
        'div',
        { class: 'menu-list' },
        menuItem('Zapisz program (.logo)', () => this.downloadProgram()),
        menuItem('Otwórz plik (.logo)', () => this.fileInput.click()),
        menuItem('Eksportuj rysunek (PNG)', () => void this.exportPng()),
        menuItem('Udostępnij link…', () => this.openShare()),
        menuItem('Przywróć poprzedni szkic', () => this.restoreBackup()),
      ),
    );
    const moreMenu = details;

    const toolbar = h(
      'div',
      { class: 'toolbar', role: 'toolbar', 'aria-label': 'Sterowanie programem' },
      h('div', { class: 'tool-group' }, this.runButton, this.stepButton, this.pauseButton, this.resetButton),
      h('label', { class: 'speed', for: 'speed' }, h('span', {}, 'Szybkość'), this.speedInput, this.speedOutput),
      h(
        'div',
        {
          class: 'segmented',
          role: 'radiogroup',
          'aria-label': 'Tryb rysowania',
          on: { keydown: (event) => this.modeKey(event as KeyboardEvent) },
        },
        this.modeButtons['2d'],
        this.modeButtons['3d'],
      ),
      h('div', { class: 'tool-group' },
        h('button', { type: 'button', class: 'btn', on: { click: () => this.examplesDialog.open(this.focusedButton()) } }, 'Przykłady'),
        h('button', { type: 'button', class: 'btn', on: { click: () => this.challengesDialog.open(this.focusedButton()) } }, 'Wyzwania'),
        moreMenu,
        h('button', { type: 'button', class: 'btn ghost', on: { click: () => this.shortcutsDialog.open(this.focusedButton()) } }, 'Skróty'),
      ),
    );

    const codePane = h(
      'div',
      { class: 'pane pane-code' },
      this.banner,
      this.editor.element,
      this.statusLine,
    );
    const viewPane = h(
      'div',
      { class: 'pane pane-view' },
      h(
        'div',
        { class: 'view-toolbar', role: 'toolbar', 'aria-label': 'Widok rysunku' },
        h('button', { type: 'button', class: 'btn small', title: 'Oddal (−)', 'aria-label': 'Oddal', on: { click: () => this.zoom(0.8) } }, '−'),
        h('button', { type: 'button', class: 'btn small', title: 'Przybliż (+)', 'aria-label': 'Przybliż', on: { click: () => this.zoom(1.25) } }, '+'),
        h('button', { type: 'button', class: 'btn small', title: 'Dopasuj rysunek (Home)', on: { click: () => this.fit() } }, 'Dopasuj'),
        h('button', { type: 'button', class: 'btn small mode-2d-only', title: 'Wróć do początku układu', on: { click: () => this.view2d.resetView() } }, 'Początek'),
        h('label', { class: 'check mode-2d-only' }, this.followToggle, ' Podążaj za żółwiem'),
      ),
      this.modeNotice,
      this.canvasHost,
      h('p', { class: 'hint' }, 'Przeciągnij, aby przesunąć widok. Kółko myszy albo szczypanie przybliża. Klawisze: strzałki, + i −, Home.'),
    );
    this.panes.append(codePane, viewPane);

    this.element = h(
      'section',
      { class: 'studio', 'aria-label': 'Studio Logomocja' },
      h('h1', { class: 'visually-hidden' }, 'Studio Logomocja'),
      toolbar,
      h('div', { class: 'pane-switch', role: 'tablist', 'aria-label': 'Przełącz widok' }, ...this.paneTabs),
      this.panes,
      this.fileInput,
    );
    this.speedOutput.textContent = SPEED_LABELS[this.speedIndex];
    this.speedInput.setAttribute('aria-valuetext', SPEED_LABELS[this.speedIndex]);

    window.addEventListener('keydown', (event) => this.shortcut(event));
    requestAnimationFrame(this.frame);
    this.editor.setValue(this.drafts[this.mode], { focus: false });
    this.validate();
    this.updateView();
    this.updateStatus();
    this.refreshChallengeBanner();
  }

  get currentMode(): Mode {
    return this.mode;
  }

  canUse3d(): boolean {
    return this.webgl;
  }

  /** Called after the theme changes, so canvases repaint in the new colours. */
  refreshTheme(): void {
    this.view2d.refreshPalette();
    this.view3d?.refreshTheme();
    this.render();
  }

  /** Shows the workspace, and for the first time the 3D view if that mode is active. */
  activate(): void {
    this.element.hidden = false;
    this.updateView();
    this.view2d.refreshPalette();
    this.view3d?.refreshTheme();
    this.render();
  }

  deactivate(): void {
    this.element.hidden = true;
    this.playing = false;
  }

  /**
   * Loads a program named in the hash: a permalink (`kod`, `tryb`) or a standard
   * program by name (`przyklad`). Returns false when the hash names neither.
   */
  openFromParams(params: URLSearchParams): boolean {
    const name = params.get('przyklad');
    if (name !== null) {
      const example = EXAMPLES.find((e) => e.name === name.trim().toLowerCase());
      if (example) {
        this.loadSource(example.source, example.mode, { backup: true, run: true });
        return true;
      }
      showToast(`Nie ma przykładu o nazwie „${name}”.`);
      return true;
    }
    const code = params.get('kod');
    if (code === null) return false;
    const text = decodeText(code);
    if (text === null) {
      showToast('Link jest uszkodzony i nie zawiera poprawnego programu.');
      return true;
    }
    const requested = parseMode(params.get('tryb')) ?? this.mode;
    let mode = requested;
    if (requested === '3d' && !this.canUse3d()) {
      mode = '2d';
      showToast('Tryb 3D jest niedostępny w tej przeglądarce, więc program otwarto w trybie 2D.');
    }
    this.loadSource(text, mode, { backup: true, run: true });
    return true;
  }

  /** Public for the test hook: load into the editor, run to the end and fit the view. */
  openForScreenshot(source: string, mode: Mode): void {
    if (mode !== this.mode) this.setMode(mode);
    this.loadSource(source, mode, { backup: false, run: false });
    this.finishAll();
  }

  /** Runs the whole program at once, without animation, then fits the view. */
  runToEndNow(): void {
    this.session = null;
    this.stopSession();
    const diag = diagnose(this.editor.value, this.mode);
    this.diagnostic = diag;
    this.editor.setDiagnostic(diag);
    if (diag) {
      this.updateStatus();
      this.render();
      return;
    }
    this.session = new Session(this.editor.value, this.mode);
    this.sessionSource = this.editor.value;
    this.session.advance(Infinity);
    this.playing = false;
    this.afterAdvance();
  }

  private finishAll(): void {
    this.runToEndNow();
    this.view2d.fitToScene();
    this.view3d?.fitTo(this.sceneFor());
  }

  // ---------- Program control ----------

  private runOrResume(): void {
    if (this.session && !this.session.done && !this.stale) {
      this.playing = true;
      this.updateStatus();
      return;
    }
    this.start(true);
  }

  private start(autoplay: boolean): void {
    this.stopSession();
    const text = this.editor.value;
    const diag = diagnose(text, this.mode);
    this.diagnostic = diag;
    this.editor.setDiagnostic(diag);
    if (diag) {
      this.updateStatus();
      this.render();
      return;
    }
    this.session = new Session(text, this.mode);
    this.sessionSource = text;
    this.playing = autoplay;
    this.budget = 0;
    this.view2d.setFollow(autoplay && this.followToggle.checked && this.mode === '2d');
    if (this.view3d) {
      this.view3d.fitTo(this.sceneFor());
      this.view3d.setFollow(autoplay);
    }
    this.updateStatus();
    this.render();
  }

  private step(): void {
    if (!this.session || this.stale) {
      this.start(false);
    }
    if (!this.session || this.session.done) {
      this.updateStatus();
      return;
    }
    this.playing = false;
    this.session.advance(1);
    this.afterAdvance();
  }

  private togglePause(): void {
    if (!this.session || this.session.done || this.stale) return;
    this.playing = !this.playing;
    this.view2d.setFollow(this.playing && this.followToggle.checked && this.mode === '2d');
    this.view3d?.setFollow(this.playing);
    this.updateStatus();
  }

  private reset(): void {
    this.stopSession();
    this.updateStatus();
    this.render();
  }

  /** Forgets the session and clears the drawing. The program text stays. */
  private stopSession(): void {
    this.session = null;
    this.sessionSource = '';
    this.playing = false;
    this.stale = false;
    this.budget = 0;
    this.editor.setActiveLine(null);
    this.view2d.setFollow(false);
    this.view3d?.setFollow(false);
  }

  private afterAdvance(): void {
    if (this.session?.done) {
      this.playing = false;
      this.editor.setActiveLine(null);
      this.view2d.setFollow(false);
      this.view3d?.setFollow(false);
      if (this.session.status === 'finished') this.view3d?.fitTo(this.sceneFor());
    }
    this.updateStatus();
    this.render();
  }

  private setSpeed(index: number): void {
    this.speedIndex = index;
    saveString('szybkosc', String(index));
    this.speedOutput.textContent = SPEED_LABELS[index];
    this.speedInput.setAttribute('aria-valuetext', SPEED_LABELS[index]);
  }

  private frame = (now: number): void => {
    const dt = this.lastFrame ? Math.min(0.25, (now - this.lastFrame) / 1000) : 0;
    this.lastFrame = now;
    if (this.playing && this.session && !this.session.done && !this.stale) {
      const rate = SPEEDS[this.speedIndex];
      if (rate === Infinity) {
        this.session.advance(Infinity);
      } else {
        this.budget += rate * dt;
        const whole = Math.floor(this.budget);
        if (whole > 0) {
          this.budget -= whole;
          this.session.advance(whole);
        }
      }
      this.afterAdvance();
    }
    requestAnimationFrame(this.frame);
  };

  // ---------- Editing ----------

  private onEdit(text: string): void {
    this.drafts[this.mode] = text;
    window.clearTimeout(this.draftTimer);
    this.draftTimer = window.setTimeout(() => saveJson(draftKey(this.mode), text), 250);
    if (this.session && text !== this.sessionSource) {
      // The drawing belongs to the previous text: stop, keep it, and say so.
      this.stale = true;
      this.playing = false;
      this.editor.setActiveLine(null);
      this.view2d.setFollow(false);
      this.view3d?.setFollow(false);
    }
    window.clearTimeout(this.validateTimer);
    this.validateTimer = window.setTimeout(() => this.validate(), 150);
    this.updateStatus();
  }

  private validate(): void {
    this.diagnostic = diagnose(this.editor.value, this.mode);
    this.editor.setDiagnostic(this.diagnostic);
    this.updateStatus();
  }

  /** Replaces the editor text. The previous text is kept as a backup and can be restored. */
  private loadSource(text: string, mode: Mode, options: { backup: boolean; run: boolean }): void {
    const previous = this.mode === mode ? this.editor.value : this.drafts[mode];
    if (options.backup && previous.trim() !== '' && previous !== text) {
      saveString(backupKey(mode), previous);
      showToast(
        'Poprzedni szkic został zachowany.',
        { label: 'Przywróć', run: () => this.restoreBackup(mode) },
        'backup',
      );
    }
    if (mode !== this.mode) this.setMode(mode);
    this.stopSession();
    this.editor.setValue(text);
    this.drafts[mode] = text;
    saveJson(draftKey(mode), text);
    this.validate();
    if (options.run) this.start(true);
    else this.render();
    this.updateView();
  }

  private restoreBackup(mode: Mode = this.mode): void {
    const text = loadString(backupKey(mode));
    if (text === null) {
      showToast('Nie ma zachowanego szkicu.');
      return;
    }
    this.loadSource(text, mode, { backup: false, run: false });
    showToast('Przywrócono poprzedni szkic.');
  }

  // ---------- Modes and views ----------

  private setMode(mode: Mode): void {
    if (mode === this.mode) return;
    if (mode === '3d' && !this.canUse3d()) return;
    this.drafts[this.mode] = this.editor.value;
    saveJson(draftKey(this.mode), this.editor.value);
    this.mode = mode;
    saveString('tryb', mode);
    this.stopSession();
    this.editor.setValue(this.drafts[mode], { focus: false });
    this.validate();
    this.updateView();
    this.render();
  }

  private updateView(): void {
    const is3d = this.mode === '3d';
    if (is3d && !this.view3d && this.canUse3d()) {
      try {
        this.view3d = new View3D(this.canvas3d);
      } catch {
        this.view3d = null;
      }
    }
    const working3d = is3d && this.view3d !== null;
    if (is3d && !working3d) {
      this.mode = '2d';
    }
    this.canvas2d.hidden = this.mode === '3d' && working3d;
    this.canvas3d.hidden = !(this.mode === '3d' && working3d);
    for (const element of this.element.querySelectorAll<HTMLElement>('.mode-2d-only')) {
      element.hidden = this.mode === '3d';
    }
    this.modeButtons['2d'].setAttribute('aria-checked', String(this.mode === '2d'));
    this.modeButtons['3d'].setAttribute('aria-checked', String(this.mode === '3d'));
    this.modeButtons['2d'].classList.toggle('active', this.mode === '2d');
    this.modeButtons['3d'].classList.toggle('active', this.mode === '3d');
    if (!this.canUse3d()) {
      this.modeNotice.hidden = false;
      this.modeNotice.textContent =
        'Tryb 3D jest niedostępny, bo ta przeglądarka nie udostępnia WebGL, czyli grafiki 3D. Tryb 2D działa normalnie.';
    } else {
      this.modeNotice.hidden = true;
    }
  }

  private zoom(factor: number): void {
    if (this.mode === '3d' && this.view3d) this.view3d.zoomBy(factor);
    else this.view2d.zoomBy(factor);
  }

  private fit(): void {
    if (this.mode === '3d' && this.view3d) this.view3d.fitTo(this.sceneFor());
    else this.view2d.fitToScene();
  }

  private showPane(pane: 'code' | 'view'): void {
    this.panes.dataset.pane = pane;
    this.paneTabs[0].setAttribute('aria-pressed', String(pane === 'code'));
    this.paneTabs[1].setAttribute('aria-pressed', String(pane === 'view'));
  }

  private sceneFor(): Scene {
    return {
      segments: this.session?.segments ?? EMPTY_SEGMENTS,
      revision: this.session?.revision ?? -1,
      turtle: this.session?.turtle ?? initialTurtle(),
      ghost: this.showTarget ? this.target : null,
    };
  }

  private render(): void {
    const scene = this.sceneFor();
    this.view2d.setScene(scene);
    this.view3d?.setScene(scene);
  }

  // ---------- Status ----------

  private updateStatus(): void {
    const session = this.session;
    const stale = this.stale;
    let text: string;
    let tone: 'ok' | 'error' | 'busy' | 'muted' = 'muted';

    if (this.diagnostic) {
      const { line, column, message } = this.diagnostic;
      text = `Błąd w linii ${line}, kolumnie ${column}: ${message}`;
      tone = 'error';
    } else if (stale) {
      text = 'Program zmieniono od ostatniego uruchomienia. Naciśnij Uruchom, aby zobaczyć nowy rysunek.';
      tone = 'busy';
    } else if (!session) {
      text = 'Gotowe. Naciśnij Uruchom (Alt+U), aby zobaczyć rysunek.';
    } else if (session.status === 'failed' && session.error) {
      const { line, column, message } = session.error;
      text = `Błąd w linii ${line}, kolumnie ${column}: ${message} Narysowano ${session.segments.length} odcinków.`;
      tone = 'error';
    } else if (session.status === 'finished') {
      text = `Program zakończony. Narysowano ${session.segments.length} odcinków.`;
      tone = 'ok';
    } else if (this.playing) {
      const line = session.position?.line ?? 0;
      text = `Rysuję… linia ${line}.`;
      tone = 'busy';
    } else {
      const line = session.position?.line ?? 0;
      text = `Wstrzymano na linii ${line}. Wznów: Alt+P, krok: Alt+K.`;
      tone = 'muted';
    }
    this.statusLine.textContent = text;
    this.statusLine.dataset.tone = tone;
    this.editor.setActiveLine(session && !session.done && !stale && session.position ? session.position.line : null);

    const hasLiveSession = session !== null && !session.done && !stale;
    this.pauseButton.disabled = !hasLiveSession;
    this.pauseButton.textContent = this.playing ? 'Pauza' : 'Wznów';
    this.stepButton.disabled = session?.done === true && !stale;
    this.speedOutput.textContent = SPEED_LABELS[this.speedIndex];
  }

  // ---------- Keyboard ----------

  private shortcut(event: KeyboardEvent): void {
    if (this.element.hidden) return;
    if (document.querySelector('dialog[open]')) return;
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      this.runOrResume();
      return;
    }
    if (!event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.code) {
      case 'KeyU':
        this.runOrResume();
        break;
      case 'KeyK':
        this.step();
        break;
      case 'KeyP':
        this.togglePause();
        break;
      case 'KeyR':
        this.reset();
        break;
      default:
        return;
    }
    event.preventDefault();
  }

  /** Arrow keys move between the two modes, as in a radio group. */
  private modeKey(event: KeyboardEvent): void {
    const next: Record<string, Mode> = { ArrowLeft: '2d', ArrowRight: '3d', ArrowUp: '2d', ArrowDown: '3d', Home: '2d', End: '3d' };
    const mode = next[event.key];
    if (!mode) return;
    event.preventDefault();
    this.setMode(mode);
    this.modeButtons[mode].focus();
  }

  private focusedButton(): HTMLElement | null {
    return document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  // ---------- Files and sharing ----------

  private downloadProgram(): void {
    const blob = new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `program-${this.mode}.logo`);
  }

  private openFile(): void {
    const file = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (!file) return;
    file.text().then(
      (text) => this.loadSource(text, this.mode, { backup: true, run: false }),
      () => showToast('Nie udało się odczytać pliku.'),
    );
  }

  private async exportPng(): Promise<void> {
    try {
      const blob = this.mode === '3d' && this.view3d ? await this.view3d.exportPng() : await this.view2d.exportPng();
      downloadBlob(blob, `logomocja-${this.mode}.png`);
    } catch {
      showToast('Nie udało się wyeksportować rysunku.');
    }
  }

  private openShare(): void {
    this.shareInput.value = permalinkFor(this.editor.value, this.mode);
    this.shareDialog.open(this.focusedButton());
    this.shareInput.select();
  }

  private async copyLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareInput.value);
      showToast('Link skopiowano do schowka.');
    } catch {
      this.shareInput.select();
      showToast('Zaznaczono link. Skopiuj go klawiszami Ctrl+C.');
    }
  }

  // ---------- Examples ----------

  private examplesList(): HTMLElement {
    const item = (example: Example) =>
      h(
        'li',
        {},
        h(
          'button',
          {
            type: 'button',
            class: 'card',
            on: {
              click: () => {
                this.examplesDialog.close();
                this.loadSource(example.source, example.mode, { backup: true, run: true });
              },
            },
          },
          h('span', { class: 'card-title' }, example.title, h('span', { class: `badge badge-${example.mode}` }, MODE_NAMES[example.mode])),
          h('span', { class: 'card-text' }, example.blurb),
          h('code', { class: 'card-name' }, example.name),
        ),
      );
    return h(
      'div',
      {},
      h('p', {}, 'Wybierz przykład: program trafi do edytora w odpowiednim trybie i od razu się uruchomi. Twój obecny szkic zostanie zachowany.'),
      h('h3', {}, 'Tryb 2D'),
      h('ul', { class: 'cards' }, ...EXAMPLES.filter((e) => e.mode === '2d').map(item)),
      h('h3', {}, 'Tryb 3D'),
      h('ul', { class: 'cards' }, ...EXAMPLES.filter((e) => e.mode === '3d').map(item)),
    );
  }

  // ---------- Challenges ----------

  private solved(): Set<string> {
    const stored = loadJson<ChallengeProgress>('wyzwania', { solved: [] });
    return new Set(Array.isArray(stored.solved) ? stored.solved : []);
  }

  private markSolved(id: string): void {
    const solved = this.solved();
    solved.add(id);
    saveJson('wyzwania', { solved: [...solved] });
  }

  private challengesList(): HTMLElement {
    const solved = this.solved();
    const summary = h('p', { class: 'progress', 'aria-live': 'polite' }, `Zaliczone: ${solved.size} z ${CHALLENGES.length}.`);
    return h(
      'div',
      {},
      summary,
      h(
        'p',
        {},
        'Każde wyzwanie opisuje rysunek. Napisz program w edytorze i sprawdź go. Sprawdzamy położenie, wielkość i kształt; kolor i grubość są dowolne.',
      ),
      h(
        'ul',
        { class: 'cards' },
        ...CHALLENGES.map((challenge) =>
          h(
            'li',
            {},
            h(
              'button',
              {
                type: 'button',
                class: 'card',
                on: {
                  click: () => {
                    this.challengesDialog.close();
                    this.startChallenge(challenge);
                  },
                },
              },
              h('span', { class: 'card-title' }, challenge.title, h('span', { class: `badge badge-${challenge.mode}` }, MODE_NAMES[challenge.mode])),
              h('span', { class: 'card-text' }, challenge.task),
              h('span', { class: solved.has(challenge.id) ? 'done' : 'todo' }, solved.has(challenge.id) ? '✓ zaliczone' : 'do zrobienia'),
            ),
          ),
        ),
      ),
    );
  }

  private startChallenge(challenge: Challenge): void {
    this.challenge = challenge;
    this.challengeResult = null;
    this.showTarget = false;
    this.target = null;
    if (challenge.mode !== this.mode) {
      if (challenge.mode === '3d' && !this.canUse3d()) {
        showToast('To wyzwanie wymaga trybu 3D, a ta przeglądarka nie udostępnia WebGL.');
        this.challenge = null;
        this.refreshChallengeBanner();
        return;
      }
      this.setMode(challenge.mode);
    }
    this.refreshChallengeBanner();
    this.showPane('code');
    this.editor.focus();
  }

  private refreshChallengeBanner(): void {
    clear(this.banner);
    const challenge = this.challenge;
    if (!challenge) {
      this.banner.hidden = true;
      return;
    }
    this.banner.hidden = false;
    const resultLine = h('p', { class: 'challenge-result', role: 'status' });
    if (this.challengeResult) {
      resultLine.textContent = this.challengeResult.message;
      resultLine.dataset.tone = this.challengeResult.passed ? 'ok' : 'error';
    }
    const children: Node[] = [
      h('div', { class: 'challenge-head' },
        h('h2', {}, `Wyzwanie: ${challenge.title}`),
        h('span', { class: `badge badge-${challenge.mode}` }, MODE_NAMES[challenge.mode]),
      ),
      h('p', { class: 'challenge-task' }, challenge.task),
    ];
    if (challenge.hint) children.push(h('p', { class: 'challenge-hint' }, `Wskazówka: ${challenge.hint}`));
    children.push(
      h('div', { class: 'challenge-actions' },
        h('button', { type: 'button', class: 'btn primary', on: { click: () => this.checkChallengeNow() } }, 'Sprawdź program'),
        h('button', {
          type: 'button',
          class: 'btn',
          'aria-pressed': String(this.showTarget),
          on: { click: () => this.toggleTarget() },
        }, this.showTarget ? 'Ukryj wzór' : 'Pokaż wzór'),
        h('button', { type: 'button', class: 'btn ghost', on: { click: () => this.endChallenge() } }, 'Zakończ wyzwanie'),
      ),
      resultLine,
    );
    this.banner.append(...children);
  }

  private checkChallengeNow(): void {
    const challenge = this.challenge;
    if (!challenge) return;
    if (challenge.mode !== this.mode) {
      if (challenge.mode === '3d' && !this.canUse3d()) return;
      this.setMode(challenge.mode);
    }
    const result = checkChallenge(challenge, this.editor.value);
    this.target = result.target;
    this.challengeResult = { passed: result.passed, message: result.message };
    if (result.passed) {
      this.markSolved(challenge.id);
      showToast(`Zaliczone: ${challenge.title}.`);
    }
    // Draw the learner's program at once, so it can be compared with the target.
    this.runToEndNow();
    this.refreshChallengeBanner();
  }

  private toggleTarget(): void {
    this.showTarget = !this.showTarget;
    if (this.showTarget && !this.target && this.challenge) {
      this.target = checkChallenge(this.challenge, this.editor.value).target;
    }
    this.refreshChallengeBanner();
    this.render();
  }

  private endChallenge(): void {
    this.challenge = null;
    this.challengeResult = null;
    this.showTarget = false;
    this.target = null;
    this.refreshChallengeBanner();
    this.render();
  }

  // ---------- Shortcuts ----------

  private shortcutsTable(): HTMLElement {
    const rows: Array<[string, string]> = [
      ['Alt+U  (lub Ctrl+Enter, ⌘+Enter)', 'Uruchom albo wznów program'],
      ['Alt+K', 'Krok: wykonaj jedno polecenie'],
      ['Alt+P', 'Pauza albo wznowienie'],
      ['Alt+R', 'Reset: wyczyść rysunek i zatrzymaj program'],
      ['Strzałki, + i − (na płótnie)', 'Przesuń i przybliż widok'],
      ['Home (na płótnie)', 'Dopasuj rysunek do okna'],
    ];
    return h(
      'table',
      { class: 'table' },
      h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Klawisze'), h('th', { scope: 'col' }, 'Działanie'))),
      h('tbody', {}, ...rows.map(([keys, action]) => h('tr', {}, h('td', {}, h('kbd', {}, keys)), h('td', {}, action)))),
    );
  }

}
