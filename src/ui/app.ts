import { compile, run, runProgram, type Execution, type LogoError, type Mode, type RunResult } from '../lang';
import { lex } from '../lang/lexer';
import { COMMANDS_3D, type CommandId } from '../lang/keywords';
import { EXAMPLES, exampleById } from '../content/examples';
import { CHALLENGES, challengeById, type Challenge } from '../content/challenges';
import { checkChallenge, expectedDrawing } from '../content/checker';
import { download, h, nextPaint, svgIcon } from './dom';
import { Editor } from './editor';
import { ICONS, type IconName } from './icons';
import { dialog, toast } from './overlay';
import { axonometric, paintThumbnail, planar } from './paint';
import { DEFAULT_SPEED, Player, SPEEDS, type PlayerFrame, type PlayerState } from './player';
import { decodeProgram, permalink } from './share';
import { load, loadJson, save, saveJson } from './storage';
import { effectiveTheme, onThemeChange, setThemePref, themePref, type ThemePref } from './theme';
import { View2D, type StageView } from './view2d';
import { webglAvailable } from './webgl';
import { registerThumbnail, renderChallengesPage, renderExamplesPage, renderReferencePage, repaintThumbnails } from './pages';

type Context = { kind: 'draft'; mode: Mode } | { kind: 'challenge'; id: string };
type Page = 'studio' | 'examples' | 'challenges' | 'reference';

interface Progress {
  solved?: boolean;
  code?: string;
}

const MOD = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl';

export const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: `${MOD}+Enter`, action: 'Uruchom program od początku' },
  { keys: `${MOD}+Shift+Enter albo F10`, action: 'Wykonaj jeden krok' },
  { keys: `${MOD}+Shift+Spacja albo F8`, action: 'Pauza / wznów' },
  { keys: `${MOD}+Shift+X`, action: 'Reset: wyczyść rysunek i ustaw żółwia na starcie' },
  { keys: 'Tab (w edytorze)', action: 'Wcięcie; Esc, a potem Tab – wyjście z edytora' },
  { keys: 'Strzałki, +, −, 0 (na rysunku)', action: 'Przesuwanie (2D) lub obracanie (3D), powiększanie, dopasowanie' },
  { keys: 'Shift+strzałki (rysunek 3D)', action: 'Przesuwanie widoku 3D' },
];

const MODE_LABEL: Record<Mode, string> = { '2d': '2D', '3d': '3D' };

function iconButton(icon: IconName, label: string, opts: { cls?: string; text?: boolean; title?: string; onclick: () => void }) {
  const b = h('button', {
    type: 'button',
    class: `btn ${opts.cls ?? ''} ${opts.text ? '' : 'btn-icon'}`.trim(),
    'aria-label': opts.text ? null : label,
    title: opts.title ?? label,
    onclick: opts.onclick,
  }, svgIcon(ICONS[icon]), opts.text ? h('span', { class: 'btn-label' }, label) : null);
  return b;
}

/** Czy program używa poleceń 3D (do wyboru trybu przy otwieraniu pliku). */
function uses3D(source: string): boolean {
  return lex(source).tokens.some((t) => t.kind === 'word' && t.keyword && COMMANDS_3D.has(t.keyword as CommandId));
}

export class App {
  private drafts: Record<Mode, string>;
  private progress: Record<string, Progress>;
  private context: Context = { kind: 'draft', mode: '2d' };
  private page: Page = 'studio';
  private readonly editor: Editor;
  private readonly player: Player;
  private readonly view2d: View2D;
  private view3d: StageView | null = null;
  private view3dLoading: Promise<StageView> | null = null;
  private readonly webgl = webglAvailable();
  private showGhost = true;
  private runError: LogoError | null = null;
  private liveTimer = 0;
  private saveTimer = 0;
  private lastFrame: PlayerFrame | null = null;
  /** Numer „pokolenia” uruchomień: rośnie przy każdej zmianie, która unieważnia trwające uruchomienie. */
  private gen = 0;
  /** Klucze pamięci zmienione w tej karcie, a jeszcze niezapisane. */
  private readonly dirty = new Set<string>();
  /** Wyzwania, których kod zmieniono w tej karcie. */
  private readonly dirtyCodes = new Set<string>();
  private progressReset = false;
  private savedContext = '';

  // Elementy interfejsu.
  private readonly root: HTMLElement;
  private readonly pages: Record<Page, HTMLElement>;
  private readonly navLinks: Record<Page, HTMLAnchorElement>;
  private readonly stage: HTMLElement;
  private readonly stageLoading: HTMLElement;
  private readonly modeButtons: Record<Mode, HTMLButtonElement>;
  private readonly challengeTab: HTMLButtonElement;
  private readonly challengeCard: HTMLElement;
  private readonly errorBar: HTMLElement;
  private readonly statusLine: HTMLElement;
  private readonly announcer: HTMLElement;
  private readonly btnRun: HTMLButtonElement;
  private readonly btnStep: HTMLButtonElement;
  private readonly btnPause: HTMLButtonElement;
  private readonly btnReset: HTMLButtonElement;
  private readonly btnGhost: HTMLButtonElement;
  private readonly speedInput: HTMLInputElement;
  private readonly speedOutput: HTMLOutputElement;
  private readonly themeButton: HTMLButtonElement;
  private readonly fileInput: HTMLInputElement;
  private readonly runState: HTMLElement;

  constructor(mount: HTMLElement) {
    this.drafts = {
      '2d': load('draft:2d') ?? exampleById('kwadrat')!.source,
      '3d': load('draft:3d') ?? exampleById('schody')!.source,
    };
    this.progress = loadJson<Record<string, Progress>>('challenges', {});
    const savedCtx = loadJson<Context | null>('context', null);
    if (savedCtx?.kind === 'draft' && (savedCtx.mode === '2d' || savedCtx.mode === '3d')) this.context = savedCtx;
    if (savedCtx?.kind === 'challenge' && challengeById(savedCtx.id)) this.context = savedCtx;

    this.announcer = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
    this.editor = new Editor({
      label: 'Program w języku Logo',
      describedBy: 'editor-help',
      onChange: (v) => this.onEdit(v),
    });
    this.player = new Player((f) => this.onFrame(f), (s) => this.onPlayerState(s));
    this.player.setSpeed(Number(load('speed')) || DEFAULT_SPEED);
    this.view2d = new View2D({ project: planar, label: 'Rysunek żółwia na płaszczyźnie' });

    // --- Nagłówek ---
    const nav = (page: Page, href: string, label: string, icon: IconName) =>
      h('a', { href, class: 'nav-link', 'data-page': page }, svgIcon(ICONS[icon]), h('span', null, label));
    this.navLinks = {
      studio: nav('studio', '#/', 'Studio', 'code'),
      examples: nav('examples', '#/przyklady', 'Przykłady', 'grid'),
      challenges: nav('challenges', '#/wyzwania', 'Wyzwania', 'trophy'),
      reference: nav('reference', '#/pomoc', 'Pomoc', 'book'),
    };
    this.themeButton = h('button', { type: 'button', class: 'btn btn-icon', onclick: () => this.cycleTheme() });
    const header = h('header', { class: 'topbar' },
      h('a', { class: 'brand', href: '#/', 'aria-label': 'Logomocja – studio' },
        svgIcon(ICONS.turtle, 'icon brand-mark'), h('span', { class: 'brand-name' }, 'Logo', h('b', null, 'mocja'))),
      h('nav', { class: 'nav', 'aria-label': 'Główna nawigacja' }, Object.values(this.navLinks)),
      h('div', { class: 'top-actions' },
        iconButton('keyboard', 'Skróty klawiszowe', { onclick: () => this.showShortcuts() }),
        this.themeButton),
    );

    // --- Studio: edytor ---
    const modeBtn = (mode: Mode) => h('button', {
      type: 'button', class: 'seg-btn', 'aria-pressed': 'false',
      title: `Szkic w trybie ${MODE_LABEL[mode]}`,
      onclick: () => this.switchContext({ kind: 'draft', mode }),
    }, `Szkic ${MODE_LABEL[mode]}`);
    this.modeButtons = { '2d': modeBtn('2d'), '3d': modeBtn('3d') };
    this.challengeTab = h('button', { type: 'button', class: 'seg-btn seg-challenge', 'aria-pressed': 'true', hidden: true, title: 'Bieżące wyzwanie' });
    this.fileInput = h('input', {
      type: 'file', accept: '.logo,.txt,text/plain', class: 'sr-only', tabindex: '-1', 'aria-hidden': 'true',
      onchange: () => this.openFile(),
    });
    const fileActions = h('div', { class: 'file-actions' },
      iconButton('upload', 'Otwórz plik .logo', { onclick: () => this.fileInput.click() }),
      iconButton('download', 'Pobierz program jako plik .logo', { onclick: () => this.downloadProgram() }),
      iconButton('share', 'Udostępnij odnośnik do programu', { onclick: () => void this.share() }),
      this.fileInput,
    );
    this.challengeCard = h('section', { class: 'challenge-card', hidden: true, 'aria-label': 'Wyzwanie' });
    this.errorBar = h('div', { class: 'error-bar', role: 'status', 'aria-live': 'polite' });
    const editorPane = h('section', { class: 'pane editor-pane', 'aria-label': 'Edytor programu' },
      h('div', { class: 'pane-head' },
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Tryb i szkic' }, this.modeButtons['2d'], this.modeButtons['3d'], this.challengeTab),
        fileActions),
      this.challengeCard,
      this.editor.root,
      this.errorBar,
      h('p', { id: 'editor-help', class: 'sr-only' },
        `Tab wstawia wcięcie; naciśnij Escape, a potem Tab, aby opuścić edytor. ${MOD}+Enter uruchamia program.`),
    );

    // --- Studio: sterowanie i rysunek ---
    this.btnRun = iconButton('run', 'Uruchom', { cls: 'btn-primary', text: true, title: `Uruchom (${MOD}+Enter)`, onclick: () => void this.runAction() });
    this.btnStep = iconButton('step', 'Krok', { text: true, title: `Jeden krok (${MOD}+Shift+Enter, F10)`, onclick: () => void this.stepAction() });
    this.btnPause = iconButton('pause', 'Pauza', { text: true, title: `Pauza / wznów (${MOD}+Shift+Spacja, F8)`, onclick: () => this.pauseAction() });
    this.btnReset = iconButton('reset', 'Reset', { text: true, title: `Reset (${MOD}+Shift+X)`, onclick: () => this.resetAction() });
    this.speedInput = h('input', {
      type: 'range', min: '1', max: String(SPEEDS.length), step: '1', id: 'speed',
      value: String(this.player.speedLevel), 'aria-describedby': 'speed-out',
      oninput: () => this.onSpeed(),
    });
    this.speedOutput = h('output', { id: 'speed-out', for: 'speed', class: 'speed-out' });
    this.runState = h('span', { class: 'run-state', 'aria-hidden': 'true' });
    const controls = h('div', { class: 'controls', role: 'toolbar', 'aria-label': 'Wykonywanie programu' },
      h('div', { class: 'control-buttons' }, this.btnRun, this.btnStep, this.btnPause, this.btnReset),
      h('div', { class: 'speed' },
        h('label', { for: 'speed' }, 'Tempo'), this.speedInput, this.speedOutput),
    );
    this.btnGhost = h('button', {
      type: 'button', class: 'btn btn-icon', 'aria-pressed': 'true', hidden: true,
      'aria-label': 'Pokaż wzór wyzwania na rysunku', title: 'Wzór wyzwania na rysunku',
      onclick: () => this.toggleGhost(),
    }, svgIcon(ICONS.eye));
    const viewTools = h('div', { class: 'view-tools', role: 'toolbar', 'aria-label': 'Widok rysunku' },
      iconButton('plus', 'Powiększ', { onclick: () => this.currentView()?.zoom(1.25) }),
      iconButton('minus', 'Pomniejsz', { onclick: () => this.currentView()?.zoom(0.8) }),
      iconButton('fit', 'Dopasuj widok do rysunku', { onclick: () => this.currentView()?.fit() }),
      iconButton('target', 'Widok domyślny', { onclick: () => this.currentView()?.resetView() }),
      this.btnGhost,
      iconButton('image', 'Zapisz rysunek jako PNG', { onclick: () => void this.exportPng() }),
    );
    this.stageLoading = h('div', { class: 'stage-loading', hidden: true }, 'Ładowanie widoku 3D…');
    this.stage = h('div', { class: 'stage' }, this.view2d.element, this.stageLoading, viewTools, this.runState);
    this.statusLine = h('div', { class: 'status-line', id: 'stage-status', 'aria-live': 'off' });
    this.view2d.element.querySelector('canvas')?.setAttribute('aria-describedby', 'stage-status');
    const stagePane = h('section', { class: 'pane stage-pane', 'aria-label': 'Rysunek' },
      controls, this.stage, this.statusLine);

    const studio = h('div', { class: 'studio' }, editorPane, stagePane);
    this.pages = {
      studio: h('section', { class: 'page page-studio', 'aria-label': 'Studio' }, studio),
      examples: h('section', { class: 'page page-doc', hidden: true }),
      challenges: h('section', { class: 'page page-doc', hidden: true }),
      reference: h('section', { class: 'page page-doc page-reference', hidden: true }),
    };
    const main = h('main', { id: 'main', tabindex: '-1' }, Object.values(this.pages));
    this.root = h('div', { class: 'app' }, header, main, this.announcer);
    mount.replaceChildren(this.root);

    onThemeChange(() => this.onTheme());
    this.updateThemeButton();
    this.onSpeed(false);
    document.addEventListener('keydown', (e) => this.onShortcut(e), true);
    window.addEventListener('hashchange', () => void this.route());
    window.addEventListener('storage', (e) => this.onStorage(e));
    document.querySelector('.skip-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      main.focus();
    });
    window.addEventListener('beforeunload', () => this.persistNow());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.persistNow(); });

    this.applyContext();
    this.onPlayerState('idle');
    void this.route();
  }

  // ------------------------------------------------------------------
  // Konteksty: szkic 2D, szkic 3D, wyzwanie
  // ------------------------------------------------------------------

  private get mode(): Mode {
    return this.context.kind === 'draft' ? this.context.mode : challengeById(this.context.id)!.mode;
  }

  private challenge(): Challenge | null {
    return this.context.kind === 'challenge' ? challengeById(this.context.id) ?? null : null;
  }

  private buffer(ctx: Context = this.context): string {
    if (ctx.kind === 'draft') return this.drafts[ctx.mode];
    const ch = challengeById(ctx.id)!;
    return this.progress[ch.id]?.code ?? ch.starter;
  }

  private setBuffer(value: string, ctx: Context = this.context): void {
    if (value === this.buffer(ctx)) return;
    if (ctx.kind === 'draft') {
      this.drafts[ctx.mode] = value;
      this.dirty.add(`draft:${ctx.mode}`);
    } else {
      this.progress[ctx.id] = { ...this.progress[ctx.id], code: value };
      this.dirtyCodes.add(ctx.id);
      this.dirty.add('challenges');
    }
  }

  private setDraft(mode: Mode, value: string): void {
    this.drafts[mode] = value;
    this.dirty.add(`draft:${mode}`);
  }

  /** Zapisuje zawartość edytora do bieżącego bufora. */
  private commitEditor(): void {
    this.setBuffer(this.editor.value);
  }

  /**
   * Zapisuje tylko to, co zmieniono w tej karcie – dzięki temu karta
   * otwarta w tle nie nadpisze nowszego szkicu z innej karty.
   */
  private persistNow(): void {
    clearTimeout(this.saveTimer);
    this.commitEditor();
    for (const mode of ['2d', '3d'] as Mode[]) {
      if (this.dirty.has(`draft:${mode}`)) save(`draft:${mode}`, this.drafts[mode]);
    }
    if (this.dirty.has('challenges')) {
      const stored = this.progressReset ? {} : loadJson<Record<string, Progress>>('challenges', {});
      const merged: Record<string, Progress> = { ...stored };
      for (const [id, local] of Object.entries(this.progress)) {
        const other = stored[id] ?? {};
        merged[id] = {
          solved: !!(local.solved || other.solved),
          code: this.dirtyCodes.has(id) || other.code === undefined ? local.code : other.code,
        };
      }
      saveJson('challenges', merged);
      this.progress = merged;
      this.dirtyCodes.clear();
      this.progressReset = false;
    }
    this.dirty.clear();
    const ctx = JSON.stringify(this.context);
    if (ctx !== this.savedContext) {
      save('context', ctx);
      this.savedContext = ctx;
    }
  }

  /** Inna karta zapisała szkic albo postępy – przejmij je, jeśli tu nic nie zmieniono. */
  private onStorage(e: StorageEvent): void {
    if (!e.key?.startsWith('logomocja:') || e.newValue === null) return;
    const key = e.key.slice('logomocja:'.length);
    const active = this.buffer();
    if ((key === 'draft:2d' || key === 'draft:3d') && !this.dirty.has(key)) {
      this.drafts[key === 'draft:2d' ? '2d' : '3d'] = e.newValue;
    } else if (key === 'challenges') {
      let other: Record<string, Progress>;
      try { other = JSON.parse(e.newValue) as Record<string, Progress>; } catch { return; }
      for (const [id, p] of Object.entries(other)) {
        const local = this.progress[id] ?? {};
        this.progress[id] = {
          solved: !!(local.solved || p.solved),
          code: this.dirtyCodes.has(id) ? local.code : p.code ?? local.code,
        };
      }
      if (this.context.kind === 'challenge') this.renderChallengeCard();
    } else {
      return;
    }
    if (this.buffer() !== active && this.editor.value === active) {
      this.applyContext();
      toast('Program zmieniono w innej karcie – wczytano najnowszą wersję.');
    }
  }

  private persistSoon(): void {
    clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.persistNow(), 300);
  }

  private switchContext(ctx: Context): void {
    if (JSON.stringify(ctx) === JSON.stringify(this.context)) {
      if (this.page !== 'studio') location.hash = '#/';
      return;
    }
    this.commitEditor();
    this.context = ctx;
    this.applyContext();
    this.persistNow();
    if (ctx.kind === 'challenge') {
      if (location.hash !== `#/wyzwanie/${ctx.id}`) history.replaceState(null, '', `#/wyzwanie/${ctx.id}`);
    } else if (this.page === 'studio' && location.hash.startsWith('#/wyzwanie/')) {
      history.replaceState(null, '', '#/');
    }
    if (this.page !== 'studio') this.showPage('studio');
  }

  /** Odświeża interfejs po zmianie kontekstu. */
  private applyContext(): void {
    this.gen++;
    clearTimeout(this.liveTimer);
    this.player.clear();
    this.runError = null;
    this.editor.setValue(this.buffer());
    this.editor.setMark(null);
    this.editor.setExecLine(null);
    const ch = this.challenge();
    for (const m of ['2d', '3d'] as Mode[]) {
      const active = this.context.kind === 'draft' && this.context.mode === m;
      this.modeButtons[m].setAttribute('aria-pressed', String(active));
    }
    this.challengeTab.hidden = !ch;
    this.btnGhost.hidden = !ch;
    if (ch) this.challengeTab.textContent = `Wyzwanie: ${ch.title}`;
    this.renderChallengeCard();
    void this.showModeView(!!ch);
    this.liveCheck();
    this.renderStatus();
  }

  // ------------------------------------------------------------------
  // Widoki rysunku
  // ------------------------------------------------------------------

  private currentView(): StageView | null {
    return this.mode === '2d' ? this.view2d : this.view3d;
  }

  private async ensure3D(): Promise<StageView> {
    if (this.view3d) return this.view3d;
    if (!this.view3dLoading) {
      this.view3dLoading = (async () => {
        let view: StageView;
        if (!this.webgl) {
          view = this.make3DFallback('Twoja przeglądarka nie udostępnia WebGL, więc widok 3D jest wyłączony. Pokazuję uproszczony, nieruchomy rzut rysunku.');
        } else {
          this.stageLoading.hidden = false;
          let mod: typeof import('./view3d') | null = null;
          try {
            mod = await import('./view3d');
          } catch (err) {
            console.error(err);
          }
          if (!mod) {
            view = this.make3DFallback('Nie udało się wczytać modułu widoku 3D, więc widok 3D jest wyłączony. Odśwież stronę, aby spróbować ponownie. Na razie pokazuję uproszczony, nieruchomy rzut rysunku.');
          } else {
            try {
              view = new mod.View3D('Rysunek żółwia w przestrzeni', () => this.on3DLost());
            } catch (err) {
              console.error(err);
              view = this.make3DFallback('Nie udało się uruchomić WebGL, więc widok 3D jest wyłączony. Pokazuję uproszczony, nieruchomy rzut rysunku.');
            }
          }
          this.stageLoading.hidden = true;
        }
        view.setVisible(false);
        view.element.querySelector('canvas')?.setAttribute('aria-describedby', 'stage-status');
        this.stage.insertBefore(view.element, this.stageLoading);
        this.view3d = view;
        return view;
      })();
    }
    return this.view3dLoading;
  }

  private make3DFallback(message: string): View2D {
    const notice = h('div', { class: 'stage-notice', role: 'note' }, svgIcon(ICONS.warn), h('span', null, message));
    return new View2D({ project: axonometric(), label: 'Uproszczony rzut rysunku przestrzennego', axes3d: true, notice });
  }

  private on3DLost(): void {
    toast('Widok 3D przestał działać (utracono kontekst WebGL). Odśwież stronę, aby go przywrócić.');
  }

  private async showModeView(fit = false): Promise<void> {
    const mode = this.mode;
    this.view2d.setVisible(mode === '2d');
    if (this.view3d) this.view3d.setVisible(mode === '3d');
    const view = mode === '3d' ? await this.ensure3D() : this.view2d;
    if (this.mode !== mode) return;
    view.setVisible(true);
    this.pushFrame();
    // Nowe wyzwanie: pokaż cały wzór.
    if (fit) {
      await nextPaint();
      view.fit();
    }
  }

  private ghost() {
    const ch = this.challenge();
    return ch && this.showGhost ? expectedDrawing(ch) : null;
  }

  private onFrame(f: PlayerFrame): void {
    this.lastFrame = f;
    this.pushFrame();
    const st = this.player.state;
    const active = st === 'running' || st === 'paused';
    const step = f.stepIndex >= 0 ? this.player.exec?.steps[f.stepIndex] : undefined;
    this.editor.setExecLine(active && step ? step.line : null);
    this.renderStatus();
  }

  private pushFrame(): void {
    const view = this.currentView();
    if (!view) return;
    const f = this.lastFrame ?? this.player.frame();
    view.setFrame({ segments: f.segments, partial: f.partial, turtle: f.turtle, ghost: this.ghost() });
  }

  private toggleGhost(): void {
    this.showGhost = !this.showGhost;
    this.btnGhost.setAttribute('aria-pressed', String(this.showGhost));
    this.pushFrame();
  }

  // ------------------------------------------------------------------
  // Wykonywanie
  // ------------------------------------------------------------------

  /** Analizuje i wykonuje program z edytora; przy błędzie składni zwraca null. */
  private prepareRun(): Execution | null {
    this.commitEditor();
    clearTimeout(this.liveTimer);
    this.runError = null;
    const exec = runProgram(this.editor.value, this.mode, true);
    if (exec.error && exec.error.phase === 'parse') {
      this.player.clear();
      this.showError(exec.error, 'error');
      this.announce(`Błąd w wierszu ${exec.error.line}, kolumna ${exec.error.column}: ${exec.error.message} Nic nie narysowano.`);
      return null;
    }
    this.showError(null);
    return exec;
  }

  /**
   * Przygotowuje widok i odtwarzacz. Wczytanie widoku 3D trwa chwilę – jeśli
   * w tym czasie zmieniono program lub tryb, wynik jest już nieaktualny (null).
   */
  private async startExec(exec: Execution, gen: number): Promise<StageView | null> {
    const mode = this.mode;
    const view = mode === '3d' ? await this.ensure3D() : this.view2d;
    if (gen !== this.gen || mode !== this.mode) return null;
    view.prepare(exec.drawn, [[0, 0, 0], exec.final.pos]);
    this.player.load(exec);
    return view;
  }

  private async runAction(): Promise<void> {
    if (this.page !== 'studio') this.showPage('studio');
    const gen = ++this.gen;
    const exec = this.prepareRun();
    if (!exec) return;
    if (await this.startExec(exec, gen)) this.player.play();
  }

  private async stepAction(): Promise<void> {
    if (this.page !== 'studio') this.showPage('studio');
    const st = this.player.state;
    if (this.player.exec && (st === 'paused' || st === 'running')) {
      this.player.step();
      return;
    }
    const gen = ++this.gen;
    const exec = this.prepareRun();
    if (!exec) return;
    if (await this.startExec(exec, gen)) this.player.step();
  }

  private pauseAction(): void {
    const st = this.player.state;
    if (st === 'running') this.player.pause();
    else if (st === 'paused' && this.player.exec) this.player.play();
  }

  private resetAction(): void {
    this.gen++;
    this.player.clear();
    this.runError = null;
    this.editor.setExecLine(null);
    this.liveCheck(true);
    this.announce('Wyczyszczono rysunek. Żółw stoi na starcie.');
  }

  /** Uruchamia bez animacji i czeka, aż rysunek będzie widoczny. */
  private async runInstant(fit: boolean): Promise<Execution> {
    const gen = ++this.gen;
    clearTimeout(this.liveTimer);
    const exec = runProgram(this.editor.value, this.mode, true);
    this.runError = null;
    if (exec.error?.phase === 'parse') {
      this.player.clear();
      this.showError(exec.error, 'error');
    } else {
      this.showError(null);
      if (await this.startExec(exec, gen)) this.player.finishNow();
    }
    const view = this.mode === '3d' ? await this.ensure3D() : this.view2d;
    await nextPaint();
    if (fit) view.fit();
    await view.painted();
    return exec;
  }

  private onPlayerState(s: PlayerState): void {
    const p = this.player;
    const hasExec = !!p.exec;
    this.btnStep.disabled = false;
    this.btnPause.disabled = !(hasExec && (s === 'running' || s === 'paused'));
    const resume = s === 'paused';
    this.btnPause.replaceChildren(svgIcon(ICONS[resume ? 'resume' : 'pause']), h('span', { class: 'btn-label' }, resume ? 'Wznów' : 'Pauza'));
    this.btnPause.setAttribute('aria-label', resume ? 'Wznów' : 'Pauza');
    this.btnReset.disabled = !hasExec && !this.runError;
    const labels: Record<PlayerState, string> = { idle: '', running: 'Działa…', paused: 'Pauza', done: '' };
    this.runState.textContent = labels[s];
    this.runState.dataset.state = s;
    this.stage.dataset.state = s;
    if (s === 'done' && p.exec) {
      this.editor.setExecLine(null);
      const ex = p.exec;
      if (ex.error) {
        this.runError = ex.error;
        this.showError(ex.error, 'error');
        this.announce(`Błąd w wierszu ${ex.error.line}, kolumna ${ex.error.column}: ${ex.error.message} Narysowano ${ex.segments.length} odc.`);
      } else {
        const n = ex.segments.length;
        this.announce(`Gotowe. Narysowano ${n} ${n === 1 ? 'odcinek' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'odcinki' : 'odcinków'}.`);
      }
    }
    if (s === 'idle') this.editor.setExecLine(null);
    this.renderStatus();
  }

  private onSpeed(store = true): void {
    const level = Number(this.speedInput.value);
    this.player.setSpeed(level);
    const label = SPEEDS[level - 1]!.label;
    this.speedOutput.textContent = label;
    this.speedInput.setAttribute('aria-valuetext', label);
    if (store) save('speed', String(level));
  }

  private renderStatus(): void {
    const f = this.lastFrame ?? this.player.frame();
    const t = f.turtle;
    const n = (v: number) => {
      const r = Math.round(v * 10) / 10;
      return (Object.is(r, -0) ? 0 : r).toLocaleString('pl-PL');
    };
    const parts: string[] = [];
    if (this.mode === '2d') {
      let ang = (Math.atan2(t.h[0], t.h[1]) * 180) / Math.PI;
      if (ang < 0) ang += 360;
      parts.push(`x ${n(t.pos[0])}`, `y ${n(t.pos[1])}`, `kierunek ${n(ang % 360)}°`);
    } else {
      parts.push(`x ${n(t.pos[0])}`, `y ${n(t.pos[1])}`, `z ${n(t.pos[2])}`,
        `nos (${n(t.h[0])}; ${n(t.h[1])}; ${n(t.h[2])})`);
    }
    parts.push(t.pen ? 'pióro opuszczone' : 'pióro podniesione');
    const exec = this.player.exec;
    parts.push(`odcinki: ${f.segments.length + (f.partial ? 1 : 0)}`);
    if (exec) parts.push(`krok ${Math.max(0, f.stepIndex + 1)}/${exec.steps.length}`);
    this.statusLine.replaceChildren(
      h('span', { class: 'swatch', style: `background:${t.color}`, title: `Kolor ${t.color}, grubość ${t.width}` }),
      parts.join(' · '),
    );
  }

  // ------------------------------------------------------------------
  // Edycja i błędy
  // ------------------------------------------------------------------

  private onEdit(value: string): void {
    this.gen++;
    this.setBuffer(value);
    this.persistSoon();
    const st = this.player.state;
    if (st === 'running' || st === 'paused') {
      this.player.halt();
      toast('Program zmieniono w trakcie działania, więc wykonywanie zatrzymano. Uruchom go ponownie.');
    }
    if (this.runError) {
      this.runError = null;
      this.showError(null);
    }
    clearTimeout(this.liveTimer);
    this.liveTimer = window.setTimeout(() => this.liveCheck(), 650);
  }

  /** Sprawdza składnię podczas pisania i delikatnie zaznacza błąd. */
  private liveCheck(force = false): void {
    if (this.runError && !force) return;
    const c = compile(this.editor.value, this.mode);
    this.showError(c.ok ? null : c.error, 'hint');
  }

  private showError(err: LogoError | null, severity: 'error' | 'hint' = 'error'): void {
    if (!err) {
      this.editor.setMark(null);
      this.errorBar.replaceChildren();
      this.errorBar.dataset.kind = 'ok';
      return;
    }
    this.editor.setMark({ start: err.start, end: err.end, line: err.line, column: err.column, message: err.message, severity });
    this.errorBar.dataset.kind = severity;
    const where = `Wiersz ${err.line}, kolumna ${err.column}`;
    const prefix = severity === 'hint' ? 'Uwaga' : err.phase === 'parse' ? 'Błąd – nic nie narysowano' : 'Błąd podczas działania';
    this.errorBar.replaceChildren(
      svgIcon(ICONS.warn),
      h('div', { class: 'error-text' },
        h('strong', null, `${prefix}. `),
        h('button', { type: 'button', class: 'link-btn', onclick: () => this.editor.focusAt(err.start), title: 'Przejdź do miejsca błędu' }, where),
        ': ', err.message),
    );
  }

  private announce(text: string): void {
    this.announcer.textContent = '';
    window.setTimeout(() => { this.announcer.textContent = text; }, 30);
  }

  // ------------------------------------------------------------------
  // Wczytywanie programów (przykłady, pliki, odnośniki)
  // ------------------------------------------------------------------

  private isPrecious(text: string): boolean {
    const t = text.trim();
    if (!t) return false;
    return !EXAMPLES.some((e) => e.source.trim() === t);
  }

  /**
   * Wczytuje program do szkicu danego trybu. Niezapisany szkic nie ginie:
   * przy confirm pytamy o zgodę, a poprzednia wersja trafia do kopii,
   * którą można przywrócić.
   */
  private async loadIntoDraft(source: string, mode: Mode, opts: { title: string; confirm: boolean; quiet?: boolean }): Promise<boolean> {
    this.commitEditor();
    const previous = this.drafts[mode];
    const precious = this.isPrecious(previous) && previous !== source;
    if (precious && opts.confirm) {
      const answer = await dialog(
        `Zastąpić szkic ${MODE_LABEL[mode]}?`,
        h('div', null,
          h('p', null, `W szkicu ${MODE_LABEL[mode]} jest Twój program. Wczytanie „${opts.title}” zastąpi go w edytorze.`),
          h('p', null, 'Poprzednią wersję będzie można przywrócić jednym kliknięciem albo najpierw pobrać jako plik.')),
        [
          { label: 'Anuluj', value: 'cancel' },
          { label: 'Pobierz szkic i zastąp', value: 'download' },
          { label: 'Zastąp szkic', value: 'replace', primary: true },
        ],
      );
      if (answer === 'cancel') return false;
      if (answer === 'download') download(`szkic-${mode}.logo`, new Blob([previous], { type: 'text/plain;charset=utf-8' }));
    }
    // Kopia trafia na stos (najwyżej 10 wersji), więc kolejne wczytania niczego nie gubią.
    const current = this.drafts[mode];
    const keep = this.isPrecious(current) && current !== source;
    if (keep) this.pushBackup(mode, current);
    this.setDraft(mode, source);
    this.context = { kind: 'draft', mode };
    this.applyContext();
    this.persistNow();
    if (keep && !opts.quiet) {
      toast(`Wczytano „${opts.title}”. Poprzedni szkic ${MODE_LABEL[mode]} zachowano.`, {
        label: 'Przywróć poprzedni', run: () => this.restoreBackup(mode),
      }, 10000);
    }
    return true;
  }

  private backups(mode: Mode): string[] {
    const list = loadJson<unknown>(`backups:${mode}`, []);
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string') : [];
  }

  private pushBackup(mode: Mode, text: string): void {
    const list = this.backups(mode).filter((b) => b !== text);
    list.push(text);
    saveJson(`backups:${mode}`, list.slice(-10));
  }

  private restoreBackup(mode: Mode): void {
    const list = this.backups(mode);
    const backup = list.pop();
    if (backup === undefined) return;
    this.commitEditor();
    const current = this.drafts[mode];
    saveJson(`backups:${mode}`, list);
    if (this.isPrecious(current) && current !== backup) this.pushBackup(mode, current);
    this.setDraft(mode, backup);
    this.context = { kind: 'draft', mode };
    this.applyContext();
    this.persistNow();
    if (this.page !== 'studio') location.hash = '#/';
    toast(`Przywrócono poprzedni szkic ${MODE_LABEL[mode]}.`);
  }

  /** Wczytuje przykład po nazwie (też z adresu #/przyklad/nazwa). */
  async loadExample(id: string, runAfter = true): Promise<boolean> {
    const ex = exampleById(id);
    if (!ex) {
      toast(`Nie ma przykładu „${id}”.`);
      return false;
    }
    const ok = await this.loadIntoDraft(ex.source, ex.mode, { title: ex.title, confirm: true });
    if (!ok) return false;
    this.showPage('studio');
    if (runAfter) {
      await nextPaint();
      await this.runAction();
    }
    return true;
  }

  /** Wczytuje dowolny program (np. z dokumentacji) do szkicu. */
  async tryProgram(source: string, mode: Mode, title: string): Promise<void> {
    const ok = await this.loadIntoDraft(source, mode, { title, confirm: true });
    if (!ok) return;
    location.hash = '#/';
    await nextPaint();
    await this.runAction();
  }

  private async openFile(): Promise<void> {
    const file = this.fileInput.files?.[0];
    this.fileInput.value = '';
    if (!file) return;
    if (file.size > 1_000_000) {
      toast('Ten plik jest za duży jak na program Logo.');
      return;
    }
    let text = await file.text();
    text = text.replace(/^﻿/, '');
    const mode: Mode = uses3D(text) ? '3d' : this.context.kind === 'draft' ? this.context.mode : this.mode;
    const ok = await this.loadIntoDraft(text, mode, { title: file.name, confirm: true });
    if (ok) {
      this.showPage('studio');
      toast(`Otwarto plik „${file.name}” w szkicu ${MODE_LABEL[mode]}.`);
    }
  }

  private downloadProgram(): void {
    this.commitEditor();
    const ch = this.challenge();
    const name = ch ? `wyzwanie-${ch.id}.logo` : `szkic-${this.mode}.logo`;
    download(name, new Blob([this.editor.value], { type: 'text/plain;charset=utf-8' }));
  }

  private async share(): Promise<void> {
    this.commitEditor();
    const url = await permalink(this.editor.value, this.mode);
    const input = h('input', { type: 'text', readonly: true, value: url, class: 'share-input', 'aria-label': 'Odnośnik do programu' });
    const copyStatus = h('p', { class: 'muted', role: 'status' });
    const body = h('div', null,
      h('p', null, `Ten odnośnik zawiera cały program i tryb ${MODE_LABEL[this.mode]}. Kto go otworzy, zobaczy program w edytorze i od razu gotowy rysunek.`),
      input,
      h('div', { class: 'row' },
        h('button', {
          type: 'button', class: 'btn', onclick: async () => {
            try {
              await navigator.clipboard.writeText(url);
              copyStatus.textContent = 'Skopiowano do schowka.';
            } catch {
              input.select();
              copyStatus.textContent = 'Zaznaczono odnośnik – skopiuj go skrótem Ctrl+C.';
            }
          },
        }, svgIcon(ICONS.copy), ' Kopiuj odnośnik')),
      copyStatus,
    );
    setTimeout(() => input.select(), 50);
    await dialog('Udostępnij program', body, [{ label: 'Zamknij', value: 'close', primary: true }]);
  }

  private async exportPng(): Promise<void> {
    const view = this.mode === '3d' ? await this.ensure3D() : this.view2d;
    const blob = await view.exportPng();
    if (!blob) {
      toast('Nie udało się zapisać obrazu.');
      return;
    }
    const ch = this.challenge();
    download(ch ? `wyzwanie-${ch.id}.png` : `logomocja-${this.mode}.png`, blob);
  }

  // ------------------------------------------------------------------
  // Wyzwania
  // ------------------------------------------------------------------

  private renderChallengeCard(): void {
    const ch = this.challenge();
    const card = this.challengeCard;
    card.hidden = !ch;
    if (!ch) {
      card.replaceChildren();
      return;
    }
    const solved = !!this.progress[ch.id]?.solved;
    const thumb = h('canvas', { class: 'cc-thumb', width: '120', height: '120', role: 'img', 'aria-label': `Wzór do narysowania: ${ch.title}` });
    const result = h('div', { class: 'cc-result', role: 'status', 'aria-live': 'polite' });
    const idx = CHALLENGES.indexOf(ch);
    card.replaceChildren(
      h('div', { class: 'cc-main' },
        thumb,
        h('div', { class: 'cc-text' },
          h('p', { class: 'cc-kicker' },
            `Wyzwanie ${idx + 1} z ${CHALLENGES.length} · ${MODE_LABEL[ch.mode]}`,
            solved ? h('span', { class: 'badge badge-ok' }, svgIcon(ICONS.check), 'rozwiązane') : null),
          h('h2', { class: 'cc-title' }, ch.title),
          h('p', { class: 'cc-goal' }, ch.goal),
          h('details', { class: 'cc-hints' },
            h('summary', null, 'Podpowiedź'),
            h('ul', null, ch.hints.map((t) => h('li', null, t)))),
        ),
      ),
      h('div', { class: 'cc-actions' },
        iconButton('check', 'Sprawdź', { cls: 'btn-primary', text: true, onclick: () => void this.checkCurrent(result) }),
        iconButton('restore', 'Zacznij od nowa', { text: true, onclick: () => void this.restartChallenge() }),
        iconButton('back', 'Wszystkie wyzwania', { text: true, onclick: () => { location.hash = '#/wyzwania'; } }),
      ),
      iconButton('cross', 'Zamknij wyzwanie i wróć do szkicu', { cls: 'btn-small cc-close', onclick: () => this.switchContext({ kind: 'draft', mode: ch.mode }) }),
      result,
    );
    registerThumbnail(thumb, () => paintThumbnail(thumb, expectedDrawing(ch), ch.mode === '3d' ? axonometric() : planar, { axes3d: ch.mode === '3d' }));
  }

  private async checkCurrent(result: HTMLElement): Promise<void> {
    const ch = this.challenge();
    if (!ch) return;
    this.commitEditor();
    // Sprawdzamy dokładnie ten tekst, który był w edytorze w chwili kliknięcia.
    const source = this.editor.value;
    const gen = this.gen + 1;
    await this.runInstant(false);
    if (this.gen !== gen || this.challenge() !== ch) return;
    const verdict = checkChallenge(ch, source);
    result.dataset.pass = String(verdict.pass);
    result.replaceChildren(
      svgIcon(ICONS[verdict.pass ? 'check' : 'cross']),
      h('div', null, h('strong', null, verdict.pass ? 'Zaliczone! ' : 'Jeszcze nie. '), verdict.reason),
    );
    if (verdict.pass) {
      const wasSolved = this.progress[ch.id]?.solved;
      this.progress[ch.id] = { ...this.progress[ch.id], solved: true, code: source };
      this.dirtyCodes.add(ch.id);
      this.dirty.add('challenges');
      this.persistNow();
      if (!wasSolved) {
        const next = CHALLENGES.find((c) => !this.progress[c.id]?.solved);
        toast(`Brawo! Wyzwanie „${ch.title}” rozwiązane.`, next ? {
          label: 'Następne wyzwanie', run: () => this.switchContext({ kind: 'challenge', id: next.id }),
        } : undefined, 9000);
        const kicker = this.challengeCard.querySelector('.cc-kicker');
        if (kicker && !kicker.querySelector('.badge')) kicker.append(h('span', { class: 'badge badge-ok' }, svgIcon(ICONS.check), 'rozwiązane'));
      }
    }
  }

  private async restartChallenge(): Promise<void> {
    const ch = this.challenge();
    if (!ch) return;
    const answer = await dialog('Zacząć od nowa?', 'Twój program w tym wyzwaniu zostanie zastąpiony szkicem startowym.', [
      { label: 'Anuluj', value: 'cancel' },
      { label: 'Zacznij od nowa', value: 'ok', primary: true },
    ]);
    if (answer !== 'ok') return;
    this.progress[ch.id] = { ...this.progress[ch.id], code: ch.starter };
    this.dirtyCodes.add(ch.id);
    this.dirty.add('challenges');
    this.applyContext();
    this.persistNow();
  }

  challengeSolved(id: string): boolean {
    return !!this.progress[id]?.solved;
  }

  async resetProgress(): Promise<boolean> {
    const answer = await dialog('Wyczyścić postępy?', 'Wszystkie wyzwania będą znów nierozwiązane, a Twoje rozwiązania zostaną usunięte.', [
      { label: 'Anuluj', value: 'cancel' },
      { label: 'Wyczyść postępy', value: 'ok', primary: true },
    ]);
    if (answer !== 'ok') return false;
    this.progress = {};
    this.progressReset = true;
    this.dirty.add('challenges');
    if (this.context.kind === 'challenge') this.applyContext();
    this.persistNow();
    return true;
  }

  // ------------------------------------------------------------------
  // Strony i routing
  // ------------------------------------------------------------------

  private showPage(page: Page): void {
    const changed = this.page !== page;
    this.page = page;
    for (const [p, el] of Object.entries(this.pages) as [Page, HTMLElement][]) el.hidden = p !== page;
    for (const [p, a] of Object.entries(this.navLinks) as [Page, HTMLAnchorElement][]) {
      if (p === page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    document.title = {
      studio: 'Logomocja – studio żółwia 2D i 3D',
      examples: 'Przykłady – Logomocja',
      challenges: 'Wyzwania – Logomocja',
      reference: 'Pomoc – Logomocja',
    }[page];
    if (page === 'studio') void this.showModeView();
    if (changed && page !== 'studio') window.scrollTo(0, 0);
  }

  private async route(): Promise<void> {
    // Kotwice spoza routingu (np. „#main” z odnośnika „Przejdź do treści”) pomijamy.
    if (location.hash && !location.hash.startsWith('#/')) return;
    let hash: string;
    try {
      hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    } catch {
      hash = '';
    }
    const [head = '', ...rest] = hash.split('/');
    switch (head) {
      case '':
        this.showPage('studio');
        return;
      case 'przyklady':
        renderExamplesPage(this.pages.examples, this);
        this.showPage('examples');
        return;
      case 'przyklad': {
        const ok = await this.loadExample(rest[0] ?? '', false);
        history.replaceState(null, '', ok ? '#/' : '#/przyklady');
        if (ok) {
          this.showPage('studio');
          await nextPaint();
          await this.runAction();
        } else {
          void this.route();
        }
        return;
      }
      case 'wyzwania':
        renderChallengesPage(this.pages.challenges, this);
        this.showPage('challenges');
        return;
      case 'wyzwanie': {
        const ch = challengeById(rest[0] ?? '');
        if (!ch) {
          history.replaceState(null, '', '#/wyzwania');
          void this.route();
          return;
        }
        this.switchContext({ kind: 'challenge', id: ch.id });
        this.showPage('studio');
        return;
      }
      case 'pomoc':
        renderReferencePage(this.pages.reference, this, rest[0]);
        this.showPage('reference');
        return;
      case 'kod': {
        const mode = rest[0] === '3d' ? '3d' : '2d';
        const source = await decodeProgram(location.hash.split('/').slice(3).join('/'));
        history.replaceState(null, '', '#/');
        this.showPage('studio');
        if (source === null) {
          toast('Ten odnośnik jest uszkodzony – nie udało się odczytać programu.');
          return;
        }
        await this.loadIntoDraft(source, mode, { title: 'program z odnośnika', confirm: false });
        await this.runInstant(true);
        return;
      }
      default:
        history.replaceState(null, '', '#/');
        this.showPage('studio');
    }
  }

  openChallenge(id: string): void {
    location.hash = `#/wyzwanie/${id}`;
  }

  // ------------------------------------------------------------------
  // Motyw, skróty
  // ------------------------------------------------------------------

  private cycleTheme(): void {
    const order: ThemePref[] = ['system', 'light', 'dark'];
    setThemePref(order[(order.indexOf(themePref()) + 1) % order.length]!);
  }

  private updateThemeButton(): void {
    const pref = themePref();
    const label = { system: 'Motyw: systemowy', light: 'Motyw: jasny', dark: 'Motyw: ciemny' }[pref];
    this.themeButton.replaceChildren(svgIcon(ICONS[pref === 'system' ? 'auto' : pref === 'light' ? 'sun' : 'moon']));
    this.themeButton.setAttribute('aria-label', `${label} (zmień)`);
    this.themeButton.title = `${label} – kliknij, aby zmienić`;
  }

  private onTheme(): void {
    this.updateThemeButton();
    this.view2d.refreshTheme();
    this.view3d?.refreshTheme();
    const color = effectiveTheme() === 'dark' ? '#0f1514' : '#f4efe4';
    document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', color));
    repaintThumbnails();
  }

  private showShortcuts(): void {
    const table = h('table', { class: 'shortcuts' },
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Skrót'), h('th', { scope: 'col' }, 'Działanie'))),
      h('tbody', null, SHORTCUTS.map((s) => h('tr', null, h('td', null, h('kbd', null, s.keys)), h('td', null, s.action)))));
    void dialog('Skróty klawiszowe', table, [{ label: 'Zamknij', value: 'close', primary: true }]);
  }

  private onShortcut(e: KeyboardEvent): void {
    if (document.querySelector('dialog[open]')) return;
    const mod = e.ctrlKey || e.metaKey;
    let action: (() => void) | null = null;
    if (mod && !e.altKey && e.key === 'Enter') action = e.shiftKey ? () => void this.stepAction() : () => void this.runAction();
    else if (e.key === 'F10' && !mod && !e.shiftKey && !e.altKey) action = () => void this.stepAction();
    else if ((mod && e.shiftKey && e.code === 'Space') || (e.key === 'F8' && !mod && !e.shiftKey && !e.altKey)) action = () => this.pauseAction();
    else if (mod && e.shiftKey && !e.altKey && e.code === 'KeyX') action = () => this.resetAction();
    if (!action) return;
    e.preventDefault();
    e.stopPropagation();
    action();
  }

  // ------------------------------------------------------------------
  // Interfejs testowy
  // ------------------------------------------------------------------

  async openForTest(source: string, mode: Mode): Promise<RunResult> {
    if (typeof source !== 'string') source = String(source ?? '');
    if (mode !== '2d' && mode !== '3d') mode = '2d';
    if (location.hash && location.hash !== '#/' && location.hash !== '#') history.replaceState(null, '', '#/');
    this.showPage('studio');
    await this.loadIntoDraft(source, mode, { title: 'wklejony program', confirm: false, quiet: true });
    // Program wklejony do edytora: zachowuje się jak zwykła edycja.
    const exec = await this.runInstant(true);
    return {
      segments: exec.segments.map((s) => ({ from: [...s.from], to: [...s.to], color: s.color, width: s.width })),
      error: exec.error ? { message: exec.error.message, line: exec.error.line, column: exec.error.column } : null,
    };
  }

  runForTest(source: string, mode: Mode): RunResult {
    return run(source, mode);
  }
}

