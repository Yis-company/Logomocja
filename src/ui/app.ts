import { mountChallenges } from './challenges-page';
import { mountEditor } from './editor-page';
import { mountReference } from './reference';
import { store, themeKey } from './storage';

type ThemeChoice = 'auto' | 'light' | 'dark';
const THEMES: ThemeChoice[] = ['auto', 'light', 'dark'];
const THEME_LABEL: Record<ThemeChoice, string> = { auto: 'automatyczny', light: 'jasny', dark: 'ciemny' };

function currentTheme(): ThemeChoice {
  const saved = store.get(themeKey);
  return THEMES.includes(saved as ThemeChoice) ? (saved as ThemeChoice) : 'auto';
}

function applyTheme(choice: ThemeChoice) {
  document.documentElement.dataset.theme = choice;
  const btn = document.getElementById('theme');
  if (btn) btn.textContent = `Motyw: ${THEME_LABEL[choice]}`;
}

/** Hash routes: #/ (editor), #/wyzwania, #/pomoc. Queries after `?` carry the program. */
export function startApp(main: HTMLElement) {
  let dispose: (() => void) | null = null;

  const themeBtn = document.getElementById('theme') as HTMLButtonElement;
  applyTheme(currentTheme());
  themeBtn.addEventListener('click', () => {
    const next = THEMES[(THEMES.indexOf(currentTheme()) + 1) % THEMES.length];
    store.set(themeKey, next);
    applyTheme(next);
  });

  function route() {
    dispose?.();
    dispose = null;
    const [path, qs] = location.hash.replace(/^#/, '').split('?');
    const query = new URLSearchParams(qs ?? '');
    const page = path.replace(/^\/+/, '');
    for (const a of document.querySelectorAll<HTMLAnchorElement>('nav a[data-route]')) {
      const active = a.dataset.route === page;
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }
    if (page === 'pomoc') mountReference(main);
    else if (page === 'wyzwania') mountChallenges(main);
    else dispose = mountEditor(main, query);
    document.title = page === 'pomoc' ? 'Pomoc · Logomocja' : page === 'wyzwania' ? 'Wyzwania · Logomocja' : 'Logomocja';
    main.focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', route);
  route();
}
