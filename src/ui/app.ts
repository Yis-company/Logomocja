import { h, svgIcon, ICONS, announce } from './dom';
import { Router, ROUTES, type RouteName } from './router';
import { Workspace, showShortcuts } from './workspace';
import { Gallery } from './gallery';
import { Challenges } from './challenges';
import { Reference } from './reference';
import { applyTheme, cycleTheme, themePref, THEME_LABEL, onThemeChange } from './theme';
import { runProgram } from '../lang/interpreter';
import type { Mode, RunResult } from '../lang/types';

export const VERSION = '1.0.0';

export interface LogomocjaApi {
  version: string;
  run(source: string, mode: Mode): RunResult;
  open(source: string, mode: Mode): Promise<RunResult>;
}

const asMode = (m: unknown): Mode => (m === '3d' || m === '3D' ? '3d' : '2d');

export function createApi(getApp: () => App | null): LogomocjaApi {
  return {
    version: VERSION,
    run(source: string, mode: Mode): RunResult {
      const r = runProgram(String(source ?? ''), asMode(mode));
      return JSON.parse(JSON.stringify(r)) as RunResult;
    },
    async open(source: string, mode: Mode): Promise<RunResult> {
      const app = getApp();
      if (!app) return runProgram(String(source ?? ''), asMode(mode));
      return app.open(String(source ?? ''), asMode(mode));
    },
  };
}

export class App {
  readonly router = new Router();
  readonly workspace = new Workspace();
  private nav = h('nav', { class: 'nav', 'aria-label': 'Główna nawigacja' });
  private themeBtn!: HTMLButtonElement;

  constructor(root: HTMLElement) {
    const gallery = new Gallery((id) => void this.openExample(id));
    const challenges = new Challenges((src, mode) => void this.sendToWorkspace(src, mode));
    const reference = new Reference((code, mode) => void this.sendToWorkspace(code, mode));
    this.router.add('pracownia', this.workspace);
    this.router.add('przyklady', gallery);
    this.router.add('wyzwania', challenges);
    this.router.add('instrukcja', reference);

    this.nav.append(...(Object.keys(ROUTES) as RouteName[]).map((k) =>
      h('a', { href: `#/${k}`, class: 'nav-link', dataset: { route: k } }, ROUTES[k])));

    this.themeBtn = h('button', { type: 'button', class: 'icon-btn', onClick: () => {
      cycleTheme();
      this.updateThemeBtn();
      announce(`Motyw: ${THEME_LABEL[themePref()]}`, false);
    } });
    this.updateThemeBtn();
    onThemeChange(() => {
      this.updateThemeBtn();
      this.router.page('przyklady') && (gallery.render(), reference.render());
    });

    const header = h('header', { class: 'topbar' },
      h('a', { href: '#/pracownia', class: 'brand', 'aria-label': 'Logomocja – strona główna (pracownia)' },
        h('span', { class: 'brand-mark', 'aria-hidden': 'true' }, svgIcon('M12 3l7 17-7-4-7 4z', 22)),
        h('span', { class: 'brand-name' }, 'Logomocja')),
      this.nav,
      h('div', { class: 'top-actions' },
        h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Skróty klawiszowe', title: 'Skróty klawiszowe', onClick: showShortcuts }, svgIcon(ICONS.help)),
        this.themeBtn),
    );
    const main = h('main', { id: 'main', tabindex: -1 }, ...(['pracownia', 'przyklady', 'wyzwania', 'instrukcja'] as RouteName[]).map((k) => this.router.page(k)!.el));
    root.append(
      h('a', { href: '#main', class: 'skip-link', onClick: (e: Event) => { e.preventDefault(); main.focus(); } }, 'Przejdź do treści'),
      header, main,
    );

    this.router.beforeShow = (name, route) => {
      if (name === 'pracownia' && route.query.has('p')) {
        const mode = asMode(route.query.get('m'));
        const ok = this.workspace.openPermalink(mode, route.query.get('p') ?? '');
        history.replaceState(null, '', location.href.split('#')[0] + '#/pracownia');
        if (ok) announce('Wczytano program z linku');
      }
    };
    this.router.afterShow = (name) => {
      this.nav.querySelectorAll('a').forEach((a) => {
        if (a.dataset.route === name) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });
    };
    document.addEventListener('keydown', (e) => this.onKey(e));
  }

  start(): void {
    this.router.start();
  }

  private updateThemeBtn(): void {
    const p = themePref();
    const label = `Motyw: ${THEME_LABEL[p]}. Kliknij, aby zmienić (automatyczny → jasny → ciemny)`;
    this.themeBtn.setAttribute('aria-label', label);
    this.themeBtn.title = label;
    this.themeBtn.replaceChildren(svgIcon(p === 'dark' ? ICONS.moon : p === 'light' ? ICONS.sun : ICONS.auto));
  }

  private async openExample(id: string): Promise<void> {
    this.router.go('pracownia');
    await this.workspace.requestExample(id);
  }

  private async sendToWorkspace(src: string, mode: Mode): Promise<void> {
    this.router.go('pracownia');
    const ok = await this.workspace.load(src, mode, 'tego programu');
    if (ok) announce('Wczytano program do pracowni');
  }

  private onKey(e: KeyboardEvent): void {
    if (document.querySelector('dialog[open]')) return;
    const page = this.router.current ? this.router.page(this.router.current) : null;
    if (!page?.onShortcut) return;
    const mod = e.ctrlKey || e.metaKey;
    let name: 'run' | 'step' | 'pause' | 'reset' | null = null;
    if (mod && e.key === 'Enter') name = 'run';
    else if (e.key === 'F10' && !mod && !e.altKey) name = 'step';
    else if (e.key === 'F8' && !mod && !e.altKey) name = 'pause';
    else if (e.key === 'Escape' && !mod && !e.altKey && !e.shiftKey) name = 'reset';
    if (!name) return;
    if (name === 'reset' && this.router.current !== 'pracownia') return;
    e.preventDefault();
    page.onShortcut(name);
  }

  async open(source: string, mode: Mode): Promise<RunResult> {
    this.router.go('pracownia');
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    return this.workspace.open(source, mode);
  }
}

export function boot(): App {
  applyTheme();
  const root = document.getElementById('app')!;
  const app = new App(root);
  app.start();
  return app;
}
