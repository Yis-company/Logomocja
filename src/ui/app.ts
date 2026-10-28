import type { Mode } from '../lang/ast';
import { runSource, type Segment } from '../lang';
import { EXAMPLES } from '../data/examples';
import { anyDialogOpen } from './dialog';
import { shortcutsDialog } from './dialogs';
import { clear, h, icon, nextFrame, turtleLogo, type IconName } from './dom';
import { hrefFor, parseHash, replaceHash, type Route } from './router';
import { decodeProgram, readPermalink } from './share';
import { matchShortcut } from './shortcuts';
import { Drafts, Settings } from './store';
import { applyTheme, cycleTheme, THEME_LABEL } from './theme';
import { toast } from './toast';
import { Workspace } from './workspace';
import { ChallengesPage } from './pages/challenges';
import { ExamplesPage } from './pages/examples';
import { ReferencePage } from './pages/reference';

export interface Page {
  el: HTMLElement;
  /** Wywoływane przy każdym wejściu na stronę. */
  enter?(route: Route): void;
  leave?(): void;
  title(route: Route): string;
  /** Aktywny obszar roboczy (skróty klawiszowe). */
  workspace?(): Workspace | null;
}

const NAV: Array<{ id: string; label: string; icon: IconName; href: string }> = [
  { id: 'pracownia', label: 'Pracownia', icon: 'pencil', href: hrefFor([]) },
  { id: 'przyklady', label: 'Przykłady', icon: 'grid', href: hrefFor(['przyklady']) },
  { id: 'wyzwania', label: 'Wyzwania', icon: 'star', href: hrefFor(['wyzwania']) },
  { id: 'polecenia', label: 'Polecenia', icon: 'book', href: hrefFor(['polecenia']) },
];

export class App {
  readonly studio: Workspace;
  private main: HTMLElement;
  private navLinks = new Map<string, HTMLAnchorElement>();
  private pages = new Map<string, Page>();
  private current: { id: string; page: Page } | null = null;
  private themeBtn!: HTMLButtonElement;
  private ready: Promise<void>;
  private initialRun = false;
  private resolveReady!: () => void;

  constructor(private root: HTMLElement) {
    this.ready = new Promise((res) => (this.resolveReady = res));
    this.studio = new Workspace({
      initialMode: Settings.mode,
      modeSwitch: true,
      examples: true,
      ariaLabel: 'Edytor programu Logo',
      load: (m) => Drafts.get(m) ?? defaultSource(m),
      persist: (m, t) => Drafts.set(m, t),
    });
    this.main = h('main', { id: 'main', class: 'main', tabindex: '-1' });
    this.build();
    window.addEventListener('hashchange', () => void this.route());
    this.bindGlobalDrop();
    document.addEventListener('keydown', (e) => this.onKey(e));
  }

  private build(): void {
    const brand = h(
      'a',
      { class: 'brand', href: hrefFor([]), 'aria-label': 'Logomocja — strona główna (pracownia)' },
      h('span', { class: 'brand-mark' }, turtleLogo(30)),
      h('span', { class: 'brand-name' }, 'Logomocja'),
    );
    const nav = h('nav', { class: 'mainnav', 'aria-label': 'Główne' });
    for (const n of NAV) {
      const a = h('a', { class: 'navlink', href: n.href, 'data-nav': n.id }, icon(n.icon, 20), h('span', null, n.label));
      this.navLinks.set(n.id, a);
      nav.append(a);
    }
    this.themeBtn = h('button', { class: 'icon-btn', type: 'button', onclick: () => this.onTheme() });
    const keys = h('button', { class: 'icon-btn', type: 'button', title: 'Skróty klawiszowe', 'aria-label': 'Skróty klawiszowe', onclick: () => shortcutsDialog() }, icon('keyboard', 20));
    const actions = h('div', { class: 'appbar-actions' }, keys, this.themeBtn);
    const skip = h('a', { class: 'skip-link', href: '#main', onclick: (e: Event) => { e.preventDefault(); this.main.focus(); } }, 'Przejdź do treści');
    const header = h('header', { class: 'appbar' }, brand, nav, actions);
    this.root.append(skip, header, this.main);
    this.updateThemeBtn();
  }

  private onTheme(): void {
    const next = cycleTheme();
    this.updateThemeBtn();
    toast(`Motyw: ${THEME_LABEL[next]}.`);
  }

  private updateThemeBtn(): void {
    const pref = Settings.theme;
    const label = `Motyw: ${THEME_LABEL[pref]}. Kliknij, aby zmienić.`;
    this.themeBtn.setAttribute('aria-label', label);
    this.themeBtn.title = label;
    this.themeBtn.replaceChildren(icon(pref === 'dark' ? 'moon' : pref === 'light' ? 'sun' : 'auto', 20));
  }

  /** Plik upuszczony poza obszarem roboczym nie może otworzyć się w karcie — otwieramy go w pracowni. */
  private bindGlobalDrop(): void {
    const hasFiles = (e: DragEvent) => !!e.dataTransfer && [...e.dataTransfer.types].includes('Files');
    window.addEventListener('dragover', (e) => {
      if (hasFiles(e)) e.preventDefault();
    });
    window.addEventListener('drop', (e) => {
      if (!hasFiles(e) || e.defaultPrevented) return;
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (!f) return;
      this.goStudio();
      replaceHash(hrefFor([]));
      void this.studio.openFile(f);
    });
  }

  // ----- trasy ----------------------------------------------------------

  private getPage(id: string): Page {
    let p = this.pages.get(id);
    if (p) return p;
    switch (id) {
      case 'przyklady': p = new ExamplesPage(this); break;
      case 'wyzwania': p = new ChallengesPage(this); break;
      case 'polecenia': p = new ReferencePage(this); break;
      default: p = new StudioPage(this); break;
    }
    this.pages.set(id, p);
    return p;
  }

  async start(): Promise<void> {
    applyTheme();
    await this.route(true);
    if (!this.initialRun) {
      this.initialRun = true;
      await nextFrame();
      this.studio.init();
    }
    this.resolveReady();
  }

  async route(initial = false): Promise<void> {
    const route = parseHash();
    const shared = readPermalink(route);
    if (shared) {
      await this.openShared(shared.payload, shared.mode);
      return;
    }
    const first = route.path[0] ?? '';
    const id = ['przyklady', 'wyzwania', 'polecenia'].includes(first) ? first : 'pracownia';
    const page = this.getPage(id);
    if (this.current && this.current.id !== id) this.current.page.leave?.();
    if (!this.current || this.current.id !== id) {
      clear(this.main);
      this.main.append(page.el);
      this.current = { id, page };
    }
    page.enter?.(route);
    for (const [k, a] of this.navLinks) {
      if (k === id) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    document.title = `${page.title(route)} — Logomocja`;
    if (!initial) this.main.scrollTop = 0;
    if (id === 'pracownia') {
      // widok mógł być ukryty — dopasuj po pokazaniu
      await nextFrame();
      this.studio.getView().paintNow();
    }
  }

  /** Otwiera program z adresu (link do udostępniania). */
  private async openShared(payload: string, mode: Mode): Promise<void> {
    try {
      const source = await decodeProgram(payload);
      // adres „zużywamy”: dalsze edycje nie są nadpisywane przy odświeżeniu
      replaceHash(hrefFor([]));
      this.goStudio();
      this.studio.replaceSource(source, { mode, run: true, title: 'link' });
      toast('Wczytano program z linku i uruchomiono go.', { kind: 'ok' });
    } catch (e) {
      replaceHash(hrefFor([]));
      this.goStudio();
      toast(`Nie udało się odczytać linku: ${e instanceof Error && e.name === 'BadLinkError' ? e.message : e instanceof Error ? e.message : 'nieznany błąd.'}`, { kind: 'error' });
    }
  }

  private goStudio(): void {
    const page = this.getPage('pracownia');
    if (this.current && this.current.id !== 'pracownia') this.current.page.leave?.();
    if (!this.current || this.current.id !== 'pracownia') {
      clear(this.main);
      this.main.append(page.el);
      this.current = { id: 'pracownia', page };
    }
    page.enter?.({ path: [], query: new URLSearchParams() });
    for (const [k, a] of this.navLinks) {
      if (k === 'pracownia') a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    document.title = 'Pracownia — Logomocja';
  }

  /** Ładuje program do pracowni (np. z przykładu lub strony poleceń). */
  openInStudio(source: string, mode: Mode, opts: { title?: string; run?: boolean } = {}): void {
    this.goStudio();
    replaceHash(hrefFor([]));
    this.studio.replaceSource(source, { mode, title: opts.title ?? null, run: opts.run !== false });
    void nextFrame().then(() => this.studio.focusEditor());
  }

  loadExampleInStudio(id: string): void {
    this.goStudio();
    replaceHash(hrefFor([]));
    this.studio.loadExample(id);
  }

  /**
   * Interfejs testowy: wczytuje kod do edytora (jak wklejony), wykonuje go do końca
   * bez animacji, dopasowuje widok i czeka na namalowanie rysunku.
   */
  async open(source: string, mode: Mode): Promise<{ segments: Segment[]; error: { message: string; line: number; column: number } | null }> {
    await this.ready;
    this.goStudio();
    replaceHash(hrefFor([]));
    const ws = this.studio;
    ws.runner.reset();
    if (ws.mode !== mode) ws.setMode(mode, { text: source, run: false });
    else {
      ws.editor.setValue(source);
      Drafts.set(mode, source);
    }
    ws.title = null;
    ws.runInstant();
    await ws.settled();
    // wynik z czystego interpretera — ten sam, który widać na ekranie
    return runSource(source, mode);
  }

  // ----- skróty ---------------------------------------------------------

  private activeWorkspace(): Workspace | null {
    return this.current?.page.workspace?.() ?? null;
  }

  private onKey(e: KeyboardEvent): void {
    if (anyDialogOpen()) return;
    const id = matchShortcut(e);
    if (!id) return;
    const t = e.target as HTMLElement | null;
    const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    const inEditor = !!t && t.classList?.contains('editor-input');
    if (id === 'help') {
      if (typing) return;
      e.preventDefault();
      shortcutsDialog();
      return;
    }
    const ws = this.activeWorkspace();
    if (!ws) return;
    // Esc w polach formularzy (poza edytorem) zostaje dla przeglądarki
    if (id === 'reset' && typing && !inEditor) return;
    e.preventDefault();
    switch (id) {
      case 'run': ws.run(); break;
      case 'step': ws.step(); break;
      case 'pause': ws.togglePause(); break;
      case 'reset': ws.reset(); break;
      case 'save': ws.download(); break;
    }
  }
}

class StudioPage implements Page {
  el: HTMLElement;
  constructor(private app: App) {
    this.el = h('div', { class: 'page page-studio' }, app.studio.el);
  }
  title(): string {
    return 'Pracownia';
  }
  workspace(): Workspace {
    return this.app.studio;
  }
  enter(): void {
    void nextFrame().then(() => this.app.studio.getView().paintNow());
  }
}

export function defaultSource(mode: Mode): string {
  return EXAMPLES.find((e) => e.id === (mode === '2d' ? 'kwadrat' : 'szescian'))!.source;
}

