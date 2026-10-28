import './styles.css';
import { run, type Mode, type RunResult } from './lang';
import { findExample } from './content/examples';
import { findChallenge } from './content/challenges';
import { Studio } from './ui/studio';
import { challengesPage, examplesPage, referencePage, repaintThumbnails, shortcutsTable } from './ui/pages';
import { h } from './ui/dom';
import { icon } from './ui/icons';
import { ask, toast } from './ui/dialogs';
import { initTheme, onThemeChange, setTheme, themeChoice, type ThemeChoice } from './ui/theme';
import { decodeProgram } from './ui/share';

declare const __APP_VERSION__: string;

initTheme();

const studio = new Studio();
const examples = examplesPage((ex) => void openExample(ex.id));
const challenges = challengesPage();
const reference = referencePage((code, mode) => void tryCode(code, mode));

// ------------------------------------------------------------- powłoka

type Route = 'studio' | 'przyklady' | 'wyzwania' | 'pomoc';

const navLinks: Record<Route, HTMLAnchorElement> = {
  studio: h('a', { href: '#/' }, 'Studio'),
  przyklady: h('a', { href: '#/przyklady' }, 'Przykłady'),
  wyzwania: h('a', { href: '#/wyzwania' }, 'Wyzwania'),
  pomoc: h('a', { href: '#/pomoc' }, 'Pomoc'),
};

const THEME_LABEL: Record<ThemeChoice, string> = {
  auto: 'Motyw: jak w systemie',
  light: 'Motyw: jasny',
  dark: 'Motyw: ciemny',
};
const THEME_ICON: Record<ThemeChoice, Parameters<typeof icon>[0]> = { auto: 'auto', light: 'sun', dark: 'moon' };

const themeBtn = h('button', { type: 'button', class: 'icon-btn' });
function renderThemeBtn(): void {
  const c = themeChoice();
  themeBtn.innerHTML = icon(THEME_ICON[c]);
  themeBtn.setAttribute('aria-label', `${THEME_LABEL[c]}. Kliknij, aby zmienić.`);
  themeBtn.title = THEME_LABEL[c];
}
themeBtn.addEventListener('click', () => {
  const order: ThemeChoice[] = ['auto', 'light', 'dark'];
  const next = order[(order.indexOf(themeChoice()) + 1) % order.length];
  setTheme(next);
  renderThemeBtn();
  toast(THEME_LABEL[next] + '.', undefined, 2500);
});
renderThemeBtn();
onThemeChange(() => repaintThumbnails());

function showShortcuts(): void {
  void ask({
    title: 'Skróty klawiszowe',
    body: [shortcutsTable()],
    buttons: [{ label: 'Zamknij', value: null, kind: 'primary' }],
    cancelValue: null,
  });
}

const shortcutsBtn = h('button', {
  type: 'button',
  class: 'icon-btn',
  title: 'Skróty klawiszowe (?)',
  'aria-label': 'Skróty klawiszowe',
  'aria-keyshortcuts': '?',
  html: icon('keyboard'),
  onclick: showShortcuts,
});

const brand = h(
  'a',
  { class: 'brand', href: '#/', 'aria-label': 'Logomocja — studio' },
  h('span', {
    class: 'brand-mark',
    'aria-hidden': 'true',
    html: '<svg viewBox="0 0 64 64" width="30" height="30"><rect width="64" height="64" rx="14" fill="var(--accent)"/><path d="M14 46 L30 18 L48 40" fill="none" stroke="var(--on-accent)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><g transform="translate(48 40) rotate(130)"><ellipse rx="7" ry="8.5" fill="var(--accent-2)"/><circle cy="-11" r="3.4" fill="var(--accent-2)"/></g></svg>',
  }),
  h('span', { class: 'brand-name' }, 'Logomocja'),
);

const main = h('main', { id: 'main', tabindex: -1 }, studio.root, examples, challenges.root, reference);
const pages: Record<Route, HTMLElement> = {
  studio: studio.root,
  przyklady: examples,
  wyzwania: challenges.root,
  pomoc: reference,
};

const header = h(
  'header',
  { class: 'topbar' },
  brand,
  h('nav', { class: 'mainnav', 'aria-label': 'Główne' }, ...Object.values(navLinks)),
  h('div', { class: 'top-actions' }, shortcutsBtn, themeBtn),
);

document.getElementById('app')!.append(header, main);
studio.mount();

window.addEventListener('keydown', (e) => {
  const t = e.target as HTMLElement;
  const typing = t && (t.tagName === 'TEXTAREA' || t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.isContentEditable);
  if (e.key === '?' && !typing && !document.querySelector('dialog[open]')) {
    e.preventDefault();
    showShortcuts();
  }
});

// ------------------------------------------------------------- trasy

let currentRoute: Route | null = null;

function show(route: Route, focus: boolean): void {
  for (const [r, el] of Object.entries(pages) as [Route, HTMLElement][]) el.hidden = r !== route;
  for (const [r, a] of Object.entries(navLinks) as [Route, HTMLAnchorElement][]) {
    if (r === route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  document.body.dataset.route = route;
  const titles: Record<Route, string> = {
    studio: 'Logomocja — studio grafiki żółwia',
    przyklady: 'Przykłady — Logomocja',
    wyzwania: 'Wyzwania — Logomocja',
    pomoc: 'Pomoc — Logomocja',
  };
  document.title = titles[route];
  if (route === 'wyzwania') challenges.refresh();
  if (focus && currentRoute !== route && route !== 'studio') {
    pages[route].querySelector<HTMLElement>('h1')?.setAttribute('tabindex', '-1');
    pages[route].querySelector<HTMLElement>('h1')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  currentRoute = route;
}

function goHome(): void {
  history.replaceState(null, '', '#/');
  route(false);
}

async function openExample(id: string): Promise<void> {
  const ex = findExample(id);
  if (!ex) {
    toast(`Nie ma przykładu o nazwie „${id}”.`);
    location.hash = '#/przyklady';
    return;
  }
  if (!(await studio.confirmReplace(ex.mode, `przykład „${ex.title}”`))) {
    if (location.hash.startsWith('#/przyklad/')) history.replaceState(null, '', '#/przyklady');
    route(false);
    return;
  }
  studio.replaceDraft(ex.source, ex.mode, `przykład „${ex.title}”`);
  goHome();
  studio.run();
}

async function tryCode(code: string, mode: Mode): Promise<void> {
  if (!(await studio.confirmReplace(mode, 'przykład z pomocy'))) return;
  studio.replaceDraft(code + '\n', mode, 'przykład z pomocy');
  location.hash = '#/';
  studio.run();
}

async function openShared(params: URLSearchParams): Promise<void> {
  const mode: Mode = params.get('tryb') === '3d' ? '3d' : '2d';
  const data = params.get('kod') ?? '';
  try {
    const source = await decodeProgram(data);
    goHome();
    await studio.loadShared(source, mode);
  } catch (e) {
    goHome();
    toast(`Nie udało się otworzyć odnośnika: ${e instanceof Error ? e.message : 'uszkodzone dane'}`);
  }
}

function route(focus = true): void {
  const raw = location.hash.replace(/^#/, '');
  const [pathPart, query = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const head = parts[0] ?? '';

  if (head !== 'wyzwanie' && studio.currentChallenge()) studio.leaveChallenge();

  switch (head) {
    case '':
    case 'studio':
      show('studio', focus);
      break;
    case 'przyklady':
      show('przyklady', focus);
      break;
    case 'przyklad':
      show('przyklady', false);
      void openExample(parts[1] ?? '');
      break;
    case 'wyzwania':
      show('wyzwania', focus);
      break;
    case 'wyzwanie': {
      const c = findChallenge(parts[1] ?? '');
      if (!c) {
        toast('Nie ma takiego wyzwania.');
        history.replaceState(null, '', '#/wyzwania');
        show('wyzwania', focus);
        break;
      }
      show('studio', false);
      studio.enterChallenge(c, () => challenges.refresh());
      break;
    }
    case 'pomoc': {
      show('pomoc', focus && !parts[1]);
      if (parts[1]) {
        const target = document.getElementById(`doc-${parts[1]}`);
        if (target) {
          target.scrollIntoView({ block: 'start' });
          target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
        }
      }
      break;
    }
    case 'program':
      show('studio', false);
      void openShared(new URLSearchParams(query));
      break;
    default:
      show('studio', focus);
  }
}

window.addEventListener('hashchange', () => route(true));
route(false);

// ------------------------------------------------------------- interfejs testowy

interface LogomocjaApi {
  version: string;
  run(source: string, mode: Mode): RunResult;
  open(source: string, mode: Mode): Promise<RunResult>;
}

const api: LogomocjaApi = {
  version: __APP_VERSION__,
  run(source: string, mode: Mode): RunResult {
    return run(String(source ?? ''), mode === '3d' ? '3d' : '2d');
  },
  async open(source: string, mode: Mode): Promise<RunResult> {
    const m: Mode = mode === '3d' ? '3d' : '2d';
    for (const d of Array.from(document.querySelectorAll('dialog[open]'))) (d as HTMLDialogElement).close();
    if (currentRoute !== 'studio' || studio.currentChallenge()) goHome();
    studio.replaceDraft(String(source ?? ''), m, 'program', true);
    const result = studio.runInstant();
    await studio.settle();
    return result;
  },
};

declare global {
  interface Window {
    logomocja: LogomocjaApi;
  }
}

window.logomocja = api;
