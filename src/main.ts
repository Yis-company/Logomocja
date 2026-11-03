import './styles.css';
import { run } from './lang/interp';
import { Studio } from './ui/studio';
import { galleryPage, tasksPage } from './ui/pages';
import { helpPage, scrollToSection } from './ui/help';
import { icon, mark } from './ui/icons';
import { load, save } from './ui/store';
import { decodeProgram } from './ui/share';
import { exampleById } from './examples';
import { taskById } from './challenges';
import { toast } from './ui/toast';
import type { Mode } from './lang/parser';

const VERSION = '1.0.0';

type Theme = 'auto' | 'light' | 'dark';
const THEME_LABEL: Record<Theme, string> = { auto: 'systemowy', light: 'jasny', dark: 'ciemny' };

const app = document.getElementById('app')!;
app.innerHTML = `
  <a class="skip" href="#main" data-skip>Przejdź do treści</a>
  <header class="band">
    <a class="brand" href="#/pracownia" aria-label="Logomocja: pracownia">${mark()}<span>Logomocja</span></a>
    <nav class="nav" aria-label="Główna">
      <a href="#/pracownia" data-nav="pracownia">Pracownia</a>
      <a href="#/przyklady" data-nav="przyklady">Przykłady</a>
      <a href="#/zadania" data-nav="zadania">Zadania</a>
      <a href="#/pomoc" data-nav="pomoc">Pomoc</a>
    </nav>
    <button type="button" class="btn btn-icon btn-on-spot theme" data-theme-toggle></button>
  </header>
  <main id="main" tabindex="-1"></main>`;

const main = app.querySelector('main')!;
const studio = new Studio();
main.append(studio.root);
const pageHost = document.createElement('div');
pageHost.className = 'page-host';
main.append(pageHost);

// --- motyw ---------------------------------------------------------------------

const themeBtn = app.querySelector<HTMLButtonElement>('[data-theme-toggle]')!;
let theme: Theme = (['auto', 'light', 'dark'] as Theme[]).includes(load('motyw') as Theme) ? (load('motyw') as Theme) : 'auto';

function applyTheme() {
  if (theme === 'auto') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  const dark = theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0b3f33' : '#0d6b55');
  themeBtn.innerHTML = icon(theme === 'auto' ? 'auto' : theme === 'light' ? 'sun' : 'moon');
  const label = `Motyw: ${THEME_LABEL[theme]}. Zmień motyw`;
  themeBtn.setAttribute('aria-label', label);
  themeBtn.title = label;
  studio.onThemeChange();
}
themeBtn.addEventListener('click', () => {
  theme = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto';
  save('motyw', theme);
  applyTheme();
  toast(`Motyw: ${THEME_LABEL[theme]}.`);
});
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme());
applyTheme();

app.querySelector('[data-skip]')!.addEventListener('click', (e) => {
  e.preventDefault();
  main.focus();
});

// --- trasy (w adresie po #, więc odświeżenie działa na każdym hostingu) ---------

let helpEl: HTMLElement | null = null;

function show(page: HTMLElement | null, nav: string, title: string) {
  studio.setVisible(page === null);
  pageHost.hidden = page === null;
  if (page) {
    if (pageHost.firstElementChild !== page) pageHost.replaceChildren(page);
  }
  for (const a of app.querySelectorAll<HTMLElement>('[data-nav]')) {
    if (a.dataset.nav === nav) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
  document.title = `${title} · Logomocja`;
}

function go(hash: string) {
  history.replaceState(null, '', hash);
  route();
}

async function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [pathPart, query = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const head = parts[0] ?? 'pracownia';

  switch (head) {
    case 'pracownia':
      studio.openDraft();
      show(null, 'pracownia', 'Pracownia');
      return;
    case 'przyklady': {
      if (parts[1]) {
        const ex = exampleById(parts[1]);
        if (ex) {
          show(null, 'pracownia', ex.title);
          studio.loadExample(ex);
          history.replaceState(null, '', '#/pracownia');
          return;
        }
        toast(`Nie ma przykładu „${parts[1]}”.`);
      }
      show(galleryPage(), 'przyklady', 'Przykłady');
      window.scrollTo(0, 0);
      return;
    }
    case 'zadania': {
      const t = parts[1] ? taskById(parts[1]) : undefined;
      if (t) {
        studio.openTask(t);
        show(null, 'zadania', `Zadanie: ${t.title}`);
        return;
      }
      if (parts[1]) toast(`Nie ma zadania „${parts[1]}”.`);
      studio.openDraft();
      show(tasksPage(), 'zadania', 'Zadania');
      window.scrollTo(0, 0);
      return;
    }
    case 'pomoc': {
      if (!helpEl) {
        helpEl = helpPage((code, mode) => {
          go('#/pracownia');
          studio.replaceDraft(code, mode, 'Wczytano przykład z pomocy.');
          studio.runProgram(false);
        });
      }
      show(helpEl, 'pomoc', 'Pomoc');
      if (parts[1]) requestAnimationFrame(() => scrollToSection(helpEl!, parts[1]));
      else window.scrollTo(0, 0);
      return;
    }
    case 'p': {
      const params = new URLSearchParams(query);
      const mode: Mode = params.get('tryb') === '3d' ? '3d' : '2d';
      const code = params.get('kod') ?? '';
      const source = await decodeProgram(code);
      history.replaceState(null, '', '#/pracownia');
      show(null, 'pracownia', 'Pracownia');
      if (source === null) {
        studio.openDraft();
        toast('Ten link jest uszkodzony: nie udało się odczytać programu.');
        return;
      }
      await studio.openShared(source, mode);
      return;
    }
    default:
      go('#/pracownia');
  }
}

window.addEventListener('hashchange', () => route());
route();

// --- haczyk dla testów -----------------------------------------------------------

declare global {
  interface Window {
    logomocja: {
      version: string;
      run: typeof run;
      open: (source: string, mode: Mode) => Promise<ReturnType<typeof run>>;
    };
  }
}

window.logomocja = {
  version: VERSION,
  run: (source: string, mode: Mode) => run(source, mode),
  open: async (source: string, mode: Mode) => {
    if (!/^#\/?(pracownia)?$/.test(location.hash)) {
      history.replaceState(null, '', '#/pracownia');
    }
    studio.openDraft();
    show(null, 'pracownia', 'Pracownia');
    return studio.openFromHook(source, mode);
  },
};
