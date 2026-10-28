import pkg from '../../package.json';
import { findChallenge } from '../data/challenges';
import { type Mode, runProgram } from '../lang';
import { h, icon, turtleLogo } from './dom';
import { challengesPage, disposePages, examplesPage, referencePage, shortcutTable, type PageDeps } from './pages';
import { parseHash, programFromParams } from './share';
import { type ThemeChoice, cycleChoice, getChoice, initTheme, onThemeChange } from './theme';
import { openDialog } from './ui';
import { Workspace } from './workspace';

export const APP_VERSION: string = pkg.version;

type RouteName = 'pracownia' | 'przyklady' | 'wyzwania' | 'opis';

const NAV: { route: RouteName; label: string; href: string; iconName: string }[] = [
  { route: 'pracownia', label: 'Pracownia', href: '#/pracownia', iconName: 'edit' },
  { route: 'przyklady', label: 'Przykłady', href: '#/przyklady', iconName: 'grid' },
  { route: 'wyzwania', label: 'Wyzwania', href: '#/wyzwania', iconName: 'trophy' },
  { route: 'opis', label: 'Opis języka', href: '#/opis', iconName: 'book' },
];

const THEME_LABEL: Record<ThemeChoice, { text: string; icon: string }> = {
  auto: { text: 'Motyw: zgodny z systemem', icon: 'auto' },
  light: { text: 'Motyw: jasny', icon: 'sun' },
  dark: { text: 'Motyw: ciemny', icon: 'moon' },
};

function isTyping(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName);
}

export function startApp(root: HTMLElement): void {
  initTheme();
  const workspace = new Workspace();
  const pageHost = h('div', { class: 'page-host', hidden: true });
  const main = h('main', { id: 'main', tabindex: '-1' }, workspace.el, pageHost);

  const navLinks = new Map<RouteName, HTMLAnchorElement>();
  const nav = h(
    'nav',
    { class: 'main-nav', 'aria-label': 'Główna nawigacja' },
    NAV.map((n) => {
      const a = h('a', { href: n.href, title: n.label, 'data-testid': `nav-${n.route}` }, icon(n.iconName, 18), h('span', null, n.label));
      navLinks.set(n.route, a);
      return a;
    }),
  );

  const themeBtn = h('button', { type: 'button', class: 'icon-btn', 'data-testid': 'theme-toggle', onClick: () => { cycleChoice(); syncTheme(); } });
  const syncTheme = () => {
    const t = THEME_LABEL[getChoice()];
    themeBtn.replaceChildren(icon(t.icon, 20));
    themeBtn.setAttribute('aria-label', `${t.text}. Kliknij, aby zmienić.`);
    themeBtn.title = t.text;
  };
  onThemeChange(syncTheme);
  syncTheme();

  const helpBtn = h(
    'button',
    { type: 'button', class: 'icon-btn', title: 'Skróty klawiszowe (Shift+?)', 'aria-label': 'Skróty klawiszowe', 'data-testid': 'shortcuts', onClick: () => showHelp() },
    icon('keyboard', 20),
  );

  const header = h(
    'header',
    { class: 'app-header' },
    h('a', { class: 'brand', href: '#/pracownia', 'aria-label': 'Logomocja – strona główna' }, turtleLogo(30), h('span', { class: 'brand-name' }, 'Logomocja')),
    nav,
    h('div', { class: 'header-actions' }, helpBtn, themeBtn),
  );

  root.append(h('a', { class: 'skip-link', href: '#main', onClick: (e: Event) => { e.preventDefault(); main.focus(); } }, 'Przejdź do treści'), header, main);

  async function showHelp(): Promise<void> {
    await openDialog({
      title: 'Skróty klawiszowe',
      body: h('div', null, shortcutTable(), h('p', { class: 'muted' }, 'Na komputerach Apple zamiast Ctrl można użyć ⌘.')),
      buttons: [{ label: 'Zamknij', value: 'close', primary: true }],
      className: 'dialog-wide',
    });
  }

  const deps: PageDeps = {
    loadExample: (ex) => workspace.loadExample(ex),
    navigate: (hash) => {
      if (location.hash === hash) route();
      else location.hash = hash;
    },
  };

  let first = true;
  function show(name: RouteName, title: string, workspaceVisible = name === 'pracownia'): void {
    document.title = `${title} – Logomocja`;
    navLinks.forEach((a, key) => {
      if (key === name) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    const isWs = workspaceVisible;
    workspace.el.hidden = !isWs;
    workspace.setVisible(isWs);
    pageHost.hidden = isWs;
    if (isWs) pageHost.replaceChildren();
  }

  function route(): void {
    const { path, params } = parseHash(location.hash);
    const [head, second] = path;
    const link = programFromParams(params);
    disposePages();
    if (link && (!head || head === 'pracownia')) {
      workspace.setContext({ kind: 'free' });
      workspace.loadFromLink(link.source, link.mode);
      history.replaceState(null, '', `${location.pathname}${location.search}#/pracownia`);
      show('pracownia', 'Pracownia');
      return;
    }
    switch (head) {
      case undefined:
      case 'pracownia':
        workspace.setContext({ kind: 'free' });
        show('pracownia', 'Pracownia');
        break;
      case 'przyklady':
        pageHost.replaceChildren(examplesPage(deps));
        show('przyklady', 'Przykłady');
        break;
      case 'wyzwania': {
        const challenge = second ? findChallenge(second) : undefined;
        if (challenge) {
          workspace.setContext({ kind: 'challenge', challenge });
          show('wyzwania', `Wyzwanie: ${challenge.title}`, true);
        } else {
          pageHost.replaceChildren(challengesPage(deps));
          show('wyzwania', 'Wyzwania');
        }
        break;
      }
      case 'opis':
        pageHost.replaceChildren(referencePage(deps, second));
        show('opis', 'Opis języka');
        break;
      default:
        workspace.setContext({ kind: 'free' });
        history.replaceState(null, '', `${location.pathname}${location.search}#/pracownia`);
        show('pracownia', 'Pracownia');
    }
    if (!first && !(head === 'opis' && second)) {
      main.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    first = false;
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('pagehide', () => workspace.flushDraft());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') workspace.flushDraft();
  });
  document.addEventListener('keydown', (e) => {
    if (workspace.handleKey(e)) {
      e.preventDefault();
      return;
    }
    if (e.key === '?' && !isTyping(e.target) && !document.querySelector('dialog[open]')) {
      e.preventDefault();
      void showHelp();
    }
  });

  route();
  first = false;

  // Hak do testów i zrzutów ekranu.
  const normalizeMode = (m: unknown): Mode => (String(m).toLowerCase() === '3d' ? '3d' : '2d');
  (window as unknown as { logomocja: unknown }).logomocja = {
    version: APP_VERSION,
    run(source: string, mode: Mode) {
      return runProgram(String(source), normalizeMode(mode));
    },
    async open(source: string, mode: Mode) {
      const m = normalizeMode(mode);
      if (parseHash(location.hash).path[0] !== 'pracownia') {
        history.replaceState(null, '', `${location.pathname}${location.search}#/pracownia`);
      }
      workspace.setContext({ kind: 'free' });
      show('pracownia', 'Pracownia');
      return workspace.openSource(String(source), m);
    },
  };
}
