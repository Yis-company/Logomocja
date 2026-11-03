import '@fontsource-variable/archivo/wdth.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import './styles/tokens.css';
import './styles/app.css';

import { normalizeMode, run, type Mode } from './lang/index';
import { EXAMPLE_BY_ID } from './examples';
import { CHALLENGE_BY_ID } from './challenges';
import { h, svgEl } from './ui/dom';
import { icon } from './ui/icons';
import { Studio } from './ui/studio';
import { challengesPage, galleryPage, referencePage } from './ui/pages';
import { decodeSource } from './ui/share';
import { toast } from './ui/toast';
import { applyTheme, nextThemePref, onTheme, setThemePref, themePref, type ThemePref } from './ui/theme';
import { matchShortcut, SHORTCUTS, shortcutLabel } from './ui/shortcuts';
import { onProgress } from './ui/progress';

export const VERSION = '1.0.0';

applyTheme();

// ------------------------------------------------------------------ shell

const main = h('main', { id: 'main', tabindex: '-1' });

function brandMark() {
  const svg = svgEl('svg', { viewBox: '0 0 28 28', width: 28, height: 28, 'aria-hidden': 'true', class: 'brand-mark' });
  svg.append(
    svgEl('path', { d: 'M5 23V5h18v9', fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    svgEl('path', { d: 'M23 26.5l-5-9.5 5 2.6 5-2.6z', fill: 'var(--brand-turtle)' }),
  );
  return svg;
}

const NAV: { href: string; label: string; match: (p: string[]) => boolean }[] = [
  { href: '#/', label: 'Pracownia', match: (p) => p[0] === '' || p[0] === 'zadanie' },
  { href: '#/przyklady', label: 'Przykłady', match: (p) => p[0] === 'przyklady' },
  { href: '#/zadania', label: 'Zadania', match: (p) => p[0] === 'zadania' },
  { href: '#/pomoc', label: 'Pomoc', match: (p) => p[0] === 'pomoc' },
];

const navLinks = NAV.map((n) => h('a', { href: n.href, class: 'nav-link' }, n.label));

const themeBtn = h('button', { class: 'btn btn-header btn-icon', type: 'button' }) as HTMLButtonElement;
const THEME_TEXT: Record<ThemePref, string> = { system: 'jak w systemie', light: 'jasny', dark: 'ciemny' };
function renderThemeBtn() {
  const p = themePref();
  themeBtn.replaceChildren(icon(p === 'system' ? 'monitor' : p === 'dark' ? 'moon' : 'sun', 18));
  const label = `Motyw: ${THEME_TEXT[p]}. Zmień na: ${THEME_TEXT[nextThemePref()]}`;
  themeBtn.setAttribute('aria-label', label);
  themeBtn.title = label;
}
themeBtn.addEventListener('click', () => {
  setThemePref(nextThemePref());
  renderThemeBtn();
});
renderThemeBtn();

const keysPanel = h('div', { id: 'keys-panel', class: 'popover keys-panel', popover: 'auto', role: 'dialog', 'aria-labelledby': 'keys-title' },
  h('h2', { id: 'keys-title', class: 'popover-title' }, 'Skróty klawiszowe'),
  h('dl', { class: 'keys-list' },
    (Object.keys(SHORTCUTS) as (keyof typeof SHORTCUTS)[]).flatMap((k) => [
      h('dt', null, h('kbd', null, shortcutLabel(SHORTCUTS[k].aria))),
      h('dd', null, SHORTCUTS[k].label),
    ]),
    h('dt', null, h('kbd', null, 'Esc'), ', ', h('kbd', null, 'Tab')),
    h('dd', null, 'Wyjście z edytora (sam Tab wstawia wcięcie)'),
    h('dt', null, h('kbd', null, '+'), ' ', h('kbd', null, '−'), ' ', h('kbd', null, '0')),
    h('dd', null, 'Na planszy: powiększ, pomniejsz, dopasuj'),
  ),
  h('a', { href: '#/pomoc/skroty', class: 'popover-link', onclick: () => keysPanel.hidePopover?.() }, 'Więcej w Pomocy'),
);
const keysBtn = h('button', { class: 'btn btn-header btn-icon', type: 'button', popovertarget: 'keys-panel', 'aria-label': 'Skróty klawiszowe', title: 'Skróty klawiszowe' }, icon('keyboard', 18));

const skip = h('a', { class: 'skip-link', href: '#main' }, 'Przejdź do treści');
skip.addEventListener('click', (e) => {
  e.preventDefault();
  (main.querySelector('h1') as HTMLElement | null)?.setAttribute('tabindex', '-1');
  main.focus();
});

const header = h('header', { class: 'app-header' },
  h('a', { class: 'brand', href: '#/', 'aria-label': 'Logomocja — pracownia' }, brandMark(), h('span', { class: 'brand-name' }, 'Logomocja')),
  h('nav', { class: 'nav', 'aria-label': 'Główna' }, navLinks),
  h('div', { class: 'header-tools' }, keysBtn, themeBtn),
);

document.body.append(skip, header, main, keysPanel);

// ------------------------------------------------------------------ routes

const studio = new Studio();
onTheme(() => {
  studio.refreshTheme();
  renderThemeBtn();
});

let current = '';
let firstRoute = true;

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, query] = raw.split('?');
  return { parts: path.split('/').map(decodeURIComponent), params: new URLSearchParams(query ?? '') };
}

function setPage(key: string, el: HTMLElement, title: string, focus = true) {
  if (current === 'studio' && key !== 'studio') studio.pause();
  current = key;
  if (main.firstElementChild !== el) main.replaceChildren(el);
  document.title = `${title} — Logomocja`;
  const { parts } = parseHash();
  navLinks.forEach((a, i) => {
    if (NAV[i].match(parts)) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  if (focus && !firstRoute) {
    const h1 = el.querySelector('h1') as HTMLElement | null;
    if (h1) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
    window.scrollTo(0, 0);
  }
  firstRoute = false;
}

async function showStudio(taskId: string | null) {
  setPage('studio', studio.root, taskId ? `Zadanie: ${CHALLENGE_BY_ID.get(taskId)?.title ?? ''}` : 'Pracownia', false);
  await studio.enter(taskId);
}

async function route() {
  const { parts, params } = parseHash();
  const [p0, p1] = parts;

  if ((p0 === '' || p0 === 'kod') && params.has('kod')) {
    const src = decodeSource(params.get('kod')!);
    const mode = normalizeMode(params.get('tryb') ?? '2d');
    history.replaceState(null, '', '#/');
    await showStudio(null);
    if (src === null) toast('Ten link jest uszkodzony — nie udało się odczytać programu.', { tone: 'error', icon: 'alert' });
    else await studio.load(src, mode, 'link');
    return;
  }
  switch (p0) {
    case '':
      return showStudio(null);
    case 'zadanie':
      if (p1 && CHALLENGE_BY_ID.has(p1)) return showStudio(p1);
      toast('Nie ma takiego zadania.', { icon: 'alert' });
      history.replaceState(null, '', '#/zadania');
      return route();
    case 'przyklad': {
      const ex = p1 ? EXAMPLE_BY_ID.get(p1) : undefined;
      history.replaceState(null, '', '#/');
      await showStudio(null);
      if (ex) await studio.load(ex.source, ex.mode, 'example', ex.title);
      else toast('Nie ma takiego przykładu.', { icon: 'alert' });
      return;
    }
    case 'przyklady':
      return setPage('przyklady', galleryPage(), 'Przykłady');
    case 'zadania':
      return setPage('zadania', challengesPage(), 'Zadania');
    case 'pomoc': {
      const page = referencePage((code, mode) => {
        location.hash = '#/';
        void studio.load(code, mode, 'example', 'z Pomocy');
      }, p1);
      setPage('pomoc', page, 'Pomoc', !p1);
      return;
    }
    default:
      toast('Nie ma takiej strony — otwieram pracownię.', { icon: 'alert' });
      history.replaceState(null, '', '#/');
      return showStudio(null);
  }
}

window.addEventListener('hashchange', () => void route());
onProgress(() => {
  if (current === 'zadania') setPage('zadania', challengesPage(), 'Zadania', false);
});

// ------------------------------------------------------------------ shortcuts

document.addEventListener(
  'keydown',
  (e) => {
    if (current !== 'studio') return;
    const action = matchShortcut(e);
    if (!action) return;
    e.preventDefault();
    e.stopPropagation();
    studio.handleShortcut(action);
  },
  true,
);

// ------------------------------------------------------------------ testing hook

declare global {
  interface Window {
    logomocja: {
      version: string;
      run: (source: string, mode: Mode | string) => ReturnType<typeof run>;
      open: (source: string, mode: Mode | string) => Promise<ReturnType<typeof run>>;
    };
  }
}

window.logomocja = {
  version: VERSION,
  run: (source, mode) => run(String(source ?? ''), normalizeMode(mode)),
  open: async (source, mode) => {
    if (current !== 'studio' || studio.task) {
      history.replaceState(null, '', '#/');
      await showStudio(null);
    }
    return studio.openForHook(String(source ?? ''), normalizeMode(mode));
  },
};

void route();
