import { runProgram } from '../lang/interpreter';
import type { Mode, RunResult } from '../lang/types';
import { findExample } from '../examples';
import { findChallenge } from '../challenges';
import { h, icon, isMac } from '../ui/dom';
import { Studio, type TaskProgress } from '../ui/studio';
import { examplesPage, tasksPage, referencePage, type Page } from '../ui/pages';
import { popoverOpen, toast } from '../ui/overlay';
import { decodeSource } from './permalink';
import { store } from './storage';

type PageKey = 'studio' | 'examples' | 'tasks' | 'reference';
type Theme = 'system' | 'light' | 'dark';

const TITLES: Record<PageKey, string> = {
  studio: 'Studio',
  examples: 'Przykłady',
  tasks: 'Zadania',
  reference: 'Polecenia',
};

const THEME_LABEL: Record<Theme, string> = { system: 'Auto', light: 'Jasny', dark: 'Ciemny' };
const THEME_DESC: Record<Theme, string> = {
  system: 'Motyw: jak w systemie. Kliknij, aby wybrać jasny.',
  light: 'Motyw: jasny. Kliknij, aby wybrać ciemny.',
  dark: 'Motyw: ciemny. Kliknij, aby wrócić do ustawienia systemu.',
};

function brandMark(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('class', 'brand-mark');
  svg.setAttribute('aria-hidden', 'true');
  // a square path that the turtle has just finished, the marker heading out of it
  svg.innerHTML =
    '<path d="M6 26V9h17" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="square"/>' +
    '<path d="M29.5 9 20.5 4.2v9.6Z" fill="currentColor"/>';
  return svg;
}

export class App {
  readonly studio: Studio;
  private pages: Record<Exclude<PageKey, 'studio'>, Page>;
  private navLinks: Record<string, HTMLAnchorElement> = {};
  private current: PageKey | null = null;
  private theme: Theme;
  private themeBtn: HTMLButtonElement;
  private mq = matchMedia('(prefers-color-scheme: dark)');
  private progress: Record<string, TaskProgress>;
  private firstRoute = true;

  constructor(private mount: HTMLElement) {
    this.theme = store.get<Theme>('theme', 'system');
    this.progress = store.get<Record<string, TaskProgress>>('zadania', {});
    this.applyTheme(false);

    this.studio = new Studio({
      navigate: (hash) => {
        location.hash = hash;
      },
      progress: () => this.progress,
      markSolved: (id) => {
        const first = !this.progress[id]?.solved;
        this.progress[id] = { solved: true, at: new Date().toISOString() };
        store.set('zadania', this.progress);
        if (first) toast('Zadanie zaliczone. Postęp zapisano w tej przeglądarce.');
      },
    });
    this.pages = {
      examples: examplesPage(),
      tasks: tasksPage(() => this.progress),
      reference: referencePage((source, mode, what) => {
        location.hash = '#/';
        this.studio.loadProgram(source, mode, `Wczytano ${what}.`);
      }),
    };

    const nav = h('nav', { class: 'nav', 'aria-label': 'Główne' });
    for (const [key, href] of [
      ['studio', '#/'],
      ['examples', '#/przyklady'],
      ['tasks', '#/zadania'],
      ['reference', '#/polecenia'],
    ] as const) {
      const a = h('a', { href, class: 'nav-link', 'data-page': key }, TITLES[key]);
      this.navLinks[key] = a;
      nav.append(a);
    }
    this.themeBtn = h('button', { type: 'button', class: 'theme-btn', onclick: () => this.cycleTheme() });
    this.renderThemeBtn();
    const skip = h(
      'button',
      {
        type: 'button',
        class: 'skip-link',
        onclick: () => (this.current === 'studio' ? this.studio.focusEditor() : this.pages[this.current as Exclude<PageKey, 'studio'>]?.heading.focus()),
      },
      'Przejdź do treści',
    );
    const header = h(
      'header',
      { class: 'topbar' },
      skip,
      h('a', { class: 'brand', href: '#/', 'aria-label': 'Logomocja, studio' }, brandMark(), h('span', { class: 'brand-name' }, 'Logomocja')),
      nav,
      h('span', { class: 'spacer' }),
      this.themeBtn,
    );
    const main = h('main', { id: 'main', class: 'main' });
    this.studio.root.dataset.page = 'studio';
    main.append(this.studio.root);
    for (const [key, p] of Object.entries(this.pages)) {
      p.root.dataset.page = key;
      p.root.hidden = true;
      main.append(p.root);
    }
    this.mount.replaceChildren(header, main);
    this.studio.start();

    this.mq.addEventListener('change', () => this.theme === 'system' && this.applyTheme(true));
    window.addEventListener('hashchange', () => void this.route());
    document.addEventListener('keydown', (e) => this.onKey(e), true);
    window.addEventListener('storage', (e) => {
      if (e.key === 'logomocja.v1.zadania') {
        this.progress = store.get('zadania', {});
        if (this.current === 'tasks') this.pages.tasks.refresh();
      }
    });
  }

  // ── theme ──────────────────────────────────────────────────────────────────

  private applyTheme(notify: boolean): void {
    const resolved = this.theme === 'system' ? (this.mq.matches ? 'dark' : 'light') : this.theme;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePref = this.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#1b1a17' : '#ffd200');
    if (notify) {
      this.studio.refreshTheme();
      Object.values(this.pages).forEach((p) => p.refresh());
    }
  }

  private cycleTheme(): void {
    this.theme = this.theme === 'system' ? 'light' : this.theme === 'light' ? 'dark' : 'system';
    store.set('theme', this.theme);
    this.applyTheme(true);
    this.renderThemeBtn();
  }

  private renderThemeBtn(): void {
    const name = this.theme === 'system' ? 'system' : this.theme === 'light' ? 'sun' : 'moon';
    this.themeBtn.replaceChildren(icon(name), h('span', { class: 'theme-label' }, THEME_LABEL[this.theme]));
    this.themeBtn.setAttribute('aria-label', THEME_DESC[this.theme]);
    this.themeBtn.title = THEME_DESC[this.theme];
  }

  // ── routing ────────────────────────────────────────────────────────────────

  private show(page: PageKey, navKey: PageKey = page): void {
    const changed = page !== this.current;
    this.current = page;
    this.studio.root.hidden = page !== 'studio';
    for (const [key, p] of Object.entries(this.pages)) p.root.hidden = key !== page;
    for (const [key, a] of Object.entries(this.navLinks)) {
      if (key === navKey) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    document.title = page === 'studio' ? 'Logomocja · studio rysowania żółwiem' : `${TITLES[page]} · Logomocja`;
    if (page !== 'studio') this.pages[page].show();
    else requestAnimationFrame(() => this.studio.surface()?.resize());
    if (changed && !this.firstRoute) {
      if (page === 'studio') {
        // keep focus where the user is working; the editor is the natural landing
      } else {
        window.scrollTo(0, 0);
        this.pages[page].heading.focus({ preventScroll: true });
      }
    }
  }

  async route(): Promise<void> {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path = '/', query = ''] = raw.split('?');
    const parts = path.split('/').filter(Boolean).map((p) => decodeURIComponent(p));
    const params = new URLSearchParams(query);
    try {
      if (parts.length === 0) {
        if (params.has('kod')) {
          await this.openPermalink(params);
          return;
        }
        this.studio.leaveTask();
        this.show('studio');
        return;
      }
      switch (parts[0]) {
        case 'przyklady': {
          const ex = parts[1] ? findExample(parts[1]) : undefined;
          if (ex) {
            history.replaceState(null, '', '#/');
            this.show('studio');
            this.studio.loadProgram(ex.source, ex.mode, `Wczytano przykład „${ex.title}”.`);
            return;
          }
          this.show('examples');
          return;
        }
        case 'zadania': {
          const ch = parts[1] ? findChallenge(parts[1]) : undefined;
          if (ch) {
            this.show('studio', 'tasks');
            this.studio.openTask(ch);
            document.title = `${ch.title} · Zadania · Logomocja`;
            return;
          }
          this.show('tasks');
          return;
        }
        case 'polecenia': {
          const inPage = this.current === 'reference';
          this.show('reference');
          this.pages.reference.show(parts[1], inPage);
          return;
        }
        default:
          history.replaceState(null, '', '#/');
          this.studio.leaveTask();
          this.show('studio');
      }
    } finally {
      this.firstRoute = false;
    }
  }

  private async openPermalink(params: URLSearchParams): Promise<void> {
    const mode: Mode = params.get('tryb') === '3d' ? '3d' : '2d';
    const source = await decodeSource(params.get('kod') ?? '');
    history.replaceState(null, '', '#/');
    this.show('studio');
    if (source === null) {
      toast('Ten link do programu jest uszkodzony albo niepełny, więc nie dało się go wczytać.', undefined, 'error');
      return;
    }
    this.studio.loadProgram(source, mode, 'Wczytano program z linku.');
  }

  // ── keyboard ───────────────────────────────────────────────────────────────

  private onKey(e: KeyboardEvent): void {
    if (this.current !== 'studio') return;
    const mod = isMac ? e.metaKey : e.ctrlKey;
    if (mod && !e.altKey && e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (e.shiftKey) this.studio.step();
      else this.studio.run();
      return;
    }
    if (mod && e.shiftKey && !e.altKey && (e.code === 'Space' || e.key === ' ')) {
      e.preventDefault();
      e.stopPropagation();
      this.studio.runner.togglePause();
      return;
    }
    if (e.key === 'Escape' && !mod && !e.shiftKey && !e.altKey && !popoverOpen()) {
      const t = e.target as HTMLElement | null;
      if (t?.closest('dialog, details[open] > summary')) return;
      e.preventDefault();
      this.studio.reset();
    }
  }

  // ── testing hook ───────────────────────────────────────────────────────────

  api(version: string) {
    const norm = (m: unknown): Mode => (m === '3d' ? '3d' : '2d');
    return {
      version,
      run: (source: string, mode: Mode): RunResult => runProgram(String(source ?? ''), norm(mode)),
      open: async (source: string, mode: Mode): Promise<RunResult> => {
        const m = norm(mode);
        if (this.current !== 'studio' || location.hash.startsWith('#/zadania/')) {
          history.replaceState(null, '', '#/');
          this.studio.leaveTask();
          this.show('studio');
        }
        this.studio.loadProgram(String(source ?? ''), m, '', 'none', true);
        await new Promise<void>((resolve) => this.studio.whenSurfaceReady(resolve));
        if (this.studio.isNarrow()) this.studio.setPane('plate');
        await new Promise((r) => requestAnimationFrame(r));
        this.studio.surface()?.resize();
        const result = this.studio.runToEnd();
        const surface = this.studio.surface();
        surface?.fit(false);
        surface?.renderNow();
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        surface?.renderNow();
        return result;
      },
    };
  }
}
