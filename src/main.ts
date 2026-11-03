import './styles.css';
import { run as interpret } from './lang/interp';
import type { Mode } from './lang/parser';
import { Studio } from './ui/studio';
import { ChallengesPage, HelpPage } from './ui/pages';
import { icon, MARK } from './ui/icons';
import { store, decodeProgram } from './ui/store';
import { toast } from './ui/toast';

const VERSION = '1.0.0';

const app = document.getElementById('app')!;
app.innerHTML = `
  <header class="rail">
    <a class="wordmark" href="#/" aria-label="Logomocja — studio">${MARK}<span>Logomocja</span></a>
    <nav class="rail-nav" aria-label="Główna">
      <a href="#/" data-route="studio">Studio</a>
      <a href="#/wyzwania" data-route="wyzwania">Wyzwania</a>
      <a href="#/pomoc" data-route="pomoc">Pomoc</a>
    </nav>
    <button type="button" class="theme-btn" aria-label="Motyw"></button>
  </header>
  <main id="main" tabindex="-1"></main>`;

const main = document.getElementById('main')!;
const studio = new Studio();
const openInStudio = (src: string, mode: Mode, name: string) => {
  location.hash = '#/';
  studio.replaceSource(src, mode, name, `Otwarto „${name}” w studiu.`);
  studio.run();
};
const challenges = new ChallengesPage(openInStudio);
const help = new HelpPage((src, mode) => openInStudio(src, mode, 'Przykład z pomocy'));

type Route = 'studio' | 'wyzwania' | 'pomoc';
let current: Route | null = null;

function route() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  if (parts[0] === 'kod') {
    const params = new URLSearchParams(query);
    const mode: Mode = params.get('tryb') === '3d' ? '3d' : '2d';
    const src = decodeProgram(params.get('p') ?? '');
    history.replaceState(null, '', location.pathname + location.search + '#/');
    show('studio');
    if (src === null) {
      toast('Ten link jest uszkodzony — nie udało się odczytać programu.');
      return;
    }
    studio.replaceSource(src, mode, 'Z linku', 'Otwarto program z linku.');
    studio.run();
    return;
  }
  const r: Route = parts[0] === 'wyzwania' ? 'wyzwania' : parts[0] === 'pomoc' ? 'pomoc' : 'studio';
  show(r);
  if (r === 'wyzwania') challenges.show(parts[1]);
}

function show(r: Route) {
  const el = r === 'studio' ? studio.el : r === 'wyzwania' ? challenges.el : help.el;
  if (current !== r) {
    main.replaceChildren(el);
    const first = current === null;
    current = r;
    document.title = r === 'studio' ? 'Logomocja' : r === 'wyzwania' ? 'Wyzwania · Logomocja' : 'Pomoc · Logomocja';
    if (!first) main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  document.body.dataset.route = r;
  document.querySelectorAll<HTMLAnchorElement>('.rail-nav a').forEach((a) => {
    if (a.dataset.route === r) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// ---------- theme: system by default, manual override ----------
const themeBtn = document.querySelector('.theme-btn') as HTMLButtonElement;
const THEMES = ['system', 'light', 'dark'] as const;
type Theme = (typeof THEMES)[number];
const THEME_TEXT: Record<Theme, string> = { system: 'Motyw: jak w systemie', light: 'Motyw: jasny', dark: 'Motyw: ciemny' };
function applyTheme(t: Theme) {
  if (t === 'system') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
  themeBtn.innerHTML = `${icon(t === 'system' ? 'auto' : t === 'light' ? 'sun' : 'moon')}<span class="theme-label">${t === 'system' ? 'System' : t === 'light' ? 'Jasny' : 'Ciemny'}</span>`;
  themeBtn.setAttribute('aria-label', `${THEME_TEXT[t]}. Kliknij, aby zmienić.`);
  themeBtn.title = THEME_TEXT[t];
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b1f1a' : '#123a31');
  requestAnimationFrame(() => studio.refreshTheme());
}
let theme: Theme = (store.get('theme') as Theme) || 'system';
if (!THEMES.includes(theme)) theme = 'system';
applyTheme(theme);
themeBtn.addEventListener('click', () => {
  theme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
  if (theme === 'system') store.remove('theme');
  else store.set('theme', theme);
  applyTheme(theme);
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (theme === 'system') applyTheme('system'); });

window.addEventListener('hashchange', route);
route();

// ---------- testing hook ----------
declare global {
  interface Window {
    logomocja: {
      version: string;
      run: (source: string, mode: Mode) => ReturnType<typeof interpret>;
      open: (source: string, mode: Mode) => Promise<ReturnType<typeof interpret>>;
    };
  }
}

window.logomocja = {
  version: VERSION,
  run: (source, mode) => interpret(source, mode),
  open: async (source, mode) => {
    if (current !== 'studio') { history.replaceState(null, '', location.pathname + location.search + '#/'); show('studio'); }
    return studio.openProgram(source, mode);
  },
};
