import './style.css';
import { run } from './lang/interp';
import type { Mode } from './lang/parser';
import { parseHash } from './lib/share';
import * as store from './lib/storage';
import { h } from './ui/dom';
import { renderReference } from './ui/reference';
import { Studio } from './ui/studio';

const VERSION = '1.0.0';

type Theme = 'auto' | 'light' | 'dark';
const THEME_LABEL: Record<Theme, string> = { auto: 'Motyw: systemowy', light: 'Motyw: jasny', dark: 'Motyw: ciemny' };
const THEME_ICON: Record<Theme, string> = { auto: '◐', light: '☀', dark: '☾' };

let studio!: Studio;
let resolveReady: () => void;
const ready = new Promise<void>(r => { resolveReady = r; });

async function goStudio() {
  const target = '#/';
  if (parseHash(location.hash).path !== '/') {
    location.hash = target;
    await new Promise(r => setTimeout(r, 0));
  }
  await ready;
}

declare global {
  interface Window {
    logomocja: {
      version: string;
      run: typeof run;
      open: (source: string, mode: Mode) => ReturnType<Studio['open']>;
    };
  }
}

window.logomocja = {
  version: VERSION,
  run: (source, mode) => run(source, mode),
  open: async (source, mode) => {
    await goStudio();
    return studio.open(source, mode);
  },
};

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'auto') root.removeAttribute('data-theme'); else root.dataset.theme = t;
}

function boot() {
  const app = document.getElementById('app')!;
  let theme = (store.load('theme') as Theme) || 'auto';
  if (!['auto', 'light', 'dark'].includes(theme)) theme = 'auto';
  applyTheme(theme);

  const themeBtn = h('button', { type: 'button', class: 'btn btn-ghost' });
  const paintThemeBtn = () => {
    themeBtn.replaceChildren(h('span', { class: 'ico', 'aria-hidden': 'true' }, THEME_ICON[theme]), h('span', { class: 'lbl' }, THEME_LABEL[theme]));
    themeBtn.title = 'Przełącz motyw: systemowy, jasny, ciemny';
  };
  paintThemeBtn();
  themeBtn.addEventListener('click', () => {
    theme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
    store.save('theme', theme);
    applyTheme(theme);
    paintThemeBtn();
    studio.themeChanged();
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => studio.themeChanged());

  const navStudio = h('a', { href: '#/', class: 'nav-link' }, 'Pracownia');
  const navRef = h('a', { href: '#/instrukcja', class: 'nav-link' }, 'Instrukcja');
  const brand = h('a', { href: '#/', class: 'brand', 'aria-label': 'Logomocja, strona główna' },
    h('span', { class: 'brand-ico', 'aria-hidden': 'true' }),
    h('span', { class: 'brand-name' }, 'Logomocja'));
  brand.querySelector('.brand-ico')!.innerHTML =
    '<svg viewBox="0 0 32 32" width="26" height="26"><path d="M16 3 L25 23 L16 19 L7 23 Z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';
  const header = h('header', { class: 'topbar' }, brand,
    h('nav', { 'aria-label': 'Główna nawigacja', class: 'nav' }, navStudio, navRef), themeBtn);
  const skip = h('a', { href: '#main', class: 'skip', onclick: (e: Event) => { e.preventDefault(); document.getElementById('main')!.focus(); } }, 'Przejdź do treści');

  const main = h('main', { id: 'main', tabindex: -1 });
  studio = new Studio();
  const ref = renderReference();
  const refWrap = h('div', { class: 'ref-wrap', hidden: true }, ref);
  main.append(studio.root, refWrap);
  app.replaceChildren(skip, header, main);

  let current = '';
  const route = async () => {
    const r = parseHash(location.hash);
    const isRef = r.path === '/instrukcja';
    const which = isRef ? 'ref' : 'studio';
    studio.root.hidden = isRef;
    refWrap.hidden = !isRef;
    studio.setVisible(!isRef);
    if (!isRef) navStudio.setAttribute('aria-current', 'page'); else navStudio.removeAttribute('aria-current');
    if (isRef) navRef.setAttribute('aria-current', 'page'); else navRef.removeAttribute('aria-current');
    document.title = isRef ? 'Instrukcja · Logomocja' : 'Logomocja: pracownia żółwia 2D i 3D';
    if (which !== current) {
      current = which;
      if (isRef) document.getElementById('ref-title')?.focus({ preventScroll: false });
      else window.scrollTo(0, 0);
    }
    if (!isRef && r.params.has('kod')) await studio.openFromParams(r.params);
  };
  window.addEventListener('hashchange', () => { void route(); });
  void route().then(resolveReady);
}

boot();
