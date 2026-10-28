import './style.css';
import { runSource, type Segment } from './logo';
import type { Mode } from './logo/ast';
import { findChallenge } from './logo/challenges';
import { EXAMPLES } from './logo/examples';
import { Studio, type Doc } from './ui/studio';
import { challengesPage, examplesPage, referencePage } from './ui/pages';
import {
  applyTheme,
  decodeProgram,
  getThemeChoice,
  parseHash,
  parseMode,
  storageGet,
  THEME_LABEL,
  type ThemeChoice,
} from './ui/util';

const page = document.getElementById('page')!;
let studio: Studio | null = null;
let studioKey = '';
let waiters: ((s: Studio) => void)[] = [];

const LAST_MODE_KEY = 'logomocja.tryb';

function setNav(current: string) {
  document.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => {
    if (a.dataset.nav === current) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function unmountStudio() {
  studio?.destroy();
  studio = null;
  studioKey = '';
}

/** Makes the studio for a document, or reuses the mounted one. */
function showStudio(doc: Doc, key: string): Studio {
  if (studio && studioKey === key) return studio;
  unmountStudio();
  page.innerHTML = '';
  studio = new Studio(page, doc);
  studioKey = key;
  for (const w of waiters) w(studio);
  waiters = [];
  return studio;
}

/** Applies query parameters of the studio route: a permalink (m, p) or an example (ex). */
function applyStudioQuery(s: Studio, query: URLSearchParams) {
  const p = query.get('p');
  const ex = query.get('ex');
  if (p !== null) {
    const source = decodeProgram(p);
    const mode = parseMode(query.get('m')) ?? '2d';
    if (source !== null) s.loadFromLink(source, mode);
  } else if (ex !== null) {
    const example = EXAMPLES.find((e) => e.name === ex);
    if (example) s.loadExample(example);
  }
  if (p !== null || ex !== null) history.replaceState(null, '', `${location.pathname}${location.search}#/`);
}

function route() {
  const { path, query } = parseHash();
  const isStudio = path === '/' || path.startsWith('/wyzwanie/');
  if (!isStudio) unmountStudio();

  if (path === '/' || path === '') {
    setNav('studio');
    const mode: Mode = parseMode(query.get('m')) ?? (storageGet(LAST_MODE_KEY) === '3d' ? '3d' : '2d');
    const s = showStudio({ kind: 'mode', mode }, `mode:${mode}`);
    applyStudioQuery(s, query);
    return;
  }
  if (path.startsWith('/wyzwanie/')) {
    setNav('wyzwania');
    const id = decodeURIComponent(path.slice('/wyzwanie/'.length));
    const challenge = findChallenge(id);
    if (!challenge) return notFound();
    showStudio({ kind: 'challenge', challenge }, `challenge:${id}`);
    return;
  }
  if (path === '/przyklady') {
    setNav('przyklady');
    page.innerHTML = examplesPage();
  } else if (path === '/wyzwania') {
    setNav('wyzwania');
    page.innerHTML = challengesPage();
  } else if (path === '/pomoc') {
    setNav('pomoc');
    page.innerHTML = referencePage();
    const anchor = location.hash.split('#')[2];
    if (anchor) document.getElementById(anchor)?.scrollIntoView();
  } else {
    return notFound();
  }
  page.focus({ preventScroll: true });
}

function notFound() {
  setNav('');
  page.innerHTML = `<h1>Nie ma takiej strony</h1><p><a href="#/">Wróć do studia</a></p>`;
}

/* ---------- theme and help ---------- */

function renderTheme() {
  const choice = getThemeChoice();
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')!;
  btn.textContent = `Motyw: ${THEME_LABEL[choice]}`;
  btn.setAttribute('aria-label', `Motyw: ${THEME_LABEL[choice]}. Kliknij, aby zmienić.`);
}

const THEME_ORDER: ThemeChoice[] = ['system', 'light', 'dark'];
document.querySelector('[data-theme-toggle]')!.addEventListener('click', () => {
  const next = THEME_ORDER[(THEME_ORDER.indexOf(getThemeChoice()) + 1) % THEME_ORDER.length];
  applyTheme(next);
  renderTheme();
});
renderTheme();

const help = document.querySelector<HTMLDialogElement>('[data-help]')!;
document.querySelector('[data-help-open]')!.addEventListener('click', () => help.showModal());
help.addEventListener('click', (e) => {
  if (e.target === help) help.close();
});

/* ---------- test hook ---------- */

function whenStudio(): Promise<Studio> {
  if (studio) return Promise.resolve(studio);
  return new Promise((resolve) => waiters.push(resolve));
}

window.addEventListener('hashchange', route);
window.addEventListener('pagehide', () => studio?.flushDraft());
window.addEventListener('beforeunload', () => studio?.flushDraft());

route();

declare global {
  interface Window {
    logomocja: {
      version: string;
      run(source: string, mode: '2d' | '3d'): { segments: Segment[]; error: { message: string; line: number; column: number } | null };
      open(source: string, mode: '2d' | '3d'): Promise<{ segments: Segment[]; error: { message: string; line: number; column: number } | null }>;
    };
  }
}

window.logomocja = {
  version: '1.0.0',
  run(source, mode) {
    return runSource(source, mode === '3d' ? '3d' : '2d');
  },
  async open(source, mode) {
    const m: Mode = mode === '3d' ? '3d' : '2d';
    if (!studio) location.hash = '#/';
    const s = await whenStudio();
    return s.openInstant(source, m);
  },
};
