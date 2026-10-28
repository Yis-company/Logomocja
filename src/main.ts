import './styles.css';
import { runSource, type Mode } from './lang/index';
import { createReferencePage } from './ui/reference-page';
import { ChallengesPage } from './ui/challenges-page';
import { createThemeButton } from './ui/theme';
import { Workspace } from './ui/workspace';
import { el } from './ui/dom';
import { parseQuery } from './ui/share';

const ROUTES = ['edytor', 'wyzwania', 'referencja'] as const;
type Route = (typeof ROUTES)[number];

function mount(): void {
  const app = document.getElementById('app')!;
  const workspace = new Workspace();
  const challenges = new ChallengesPage();
  const reference = createReferencePage();

  const sections: Record<Route, HTMLElement> = {
    edytor: el('section', { id: 'view-edytor', 'aria-label': 'Edytor', class: 'route' }, workspace.element),
    wyzwania: el('section', { id: 'view-wyzwania', 'aria-label': 'Wyzwania', class: 'route', hidden: true }, challenges.element),
    referencja: el('section', { id: 'view-referencja', 'aria-label': 'Dokumentacja', class: 'route', hidden: true }, reference),
  };

  const links: Record<Route, HTMLAnchorElement> = {
    edytor: el('a', { href: '#/', text: 'Edytor' }),
    wyzwania: el('a', { href: '#/wyzwania', text: 'Wyzwania' }),
    referencja: el('a', { href: '#/referencja', text: 'Dokumentacja' }),
  };

  app.append(
    el('a', { class: 'skip-link', href: '#main', text: 'Przejdź do treści' }),
    el(
      'header',
      { class: 'site-head' },
      el(
        'a',
        { class: 'brand', href: '#/', 'aria-label': 'Logomocja, strona główna' },
        turtleIcon(),
        el('span', { class: 'brand-name', text: 'Logomocja' }),
        el('span', { class: 'brand-tag', text: 'studio żółwia' }),
      ),
      el('nav', { class: 'site-nav', 'aria-label': 'Główna' }, ...ROUTES.map((r) => links[r])),
      el('div', { class: 'head-tools' }, createThemeButton()),
    ),
    el('main', { id: 'main', tabindex: '-1' }, sections.edytor, sections.wyzwania, sections.referencja),
    el(
      'footer',
      { class: 'site-foot' },
      el('span', { text: `Logomocja ${__APP_VERSION__}. Bez kont, bez serwera, bez sieci w trakcie działania.` }),
    ),
  );

  const show = (route: Route): void => {
    for (const r of ROUTES) {
      sections[r].hidden = r !== route;
      if (r === route) links[r].setAttribute('aria-current', 'page');
      else links[r].removeAttribute('aria-current');
    }
    document.title = route === 'edytor' ? 'Logomocja · studio żółwia' : `${links[route].textContent} · Logomocja`;
  };

  const route = (): void => {
    const raw = location.hash.replace(/^#\/?/, '');
    const [path = '', query = ''] = splitOnce(raw, '?');
    const name = path.split('/')[0] ?? '';
    const params = parseQuery(query);
    if (name === 'wyzwania') {
      show('wyzwania');
      challenges.open(path.split('/')[1] ?? params.get('id'));
      return;
    }
    if (name === 'referencja') {
      show('referencja');
      return;
    }
    show('edytor');
    const encoded = params.get('p');
    if (encoded !== null) {
      workspace.loadPermalink(params.get('m'), encoded);
      // Drop the program from the address bar so a reload keeps the user's own draft.
      history.replaceState(null, '', '#/');
    }
  };

  window.addEventListener('hashchange', route);
  route();

  window.logomocja = {
    version: __APP_VERSION__,
    run: (source: string, mode: Mode) => runSource(source, mode),
    open: (source: string, mode: Mode) => workspace.openForTest(source, mode),
  };
}

function splitOnce(text: string, sep: string): [string, string?] {
  const i = text.indexOf(sep);
  return i === -1 ? [text] : [text.slice(0, i), text.slice(i + 1)];
}

function turtleIcon(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'brand-mark');
  svg.innerHTML =
    '<path d="M16 3 L27 27 L16 21 L5 27 Z" fill="currentColor" opacity=".92"/>' +
    '<path d="M5 27 Q16 33 27 27" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".5"/>';
  return svg;
}

mount();
