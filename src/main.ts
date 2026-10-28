import './styles.css';
import { run, type Mode, type RunResult } from './lang';
import { Workspace } from './ui/workspace';
import { mountReference } from './ui/reference';
import { currentRoute, navigate } from './ui/router';
import { cycleTheme, initTheme, onThemeChange, themeLabel } from './ui/theme';
import { h } from './ui/dom';
import { loadString } from './ui/storage';
import { parseMode } from './ui/permalink';

declare global {
  interface Window {
    logomocja?: LogomocjaHook;
  }
}

/** The testing hook described in the brief. */
export interface LogomocjaHook {
  version: string;
  run(source: string, mode: Mode): RunResult;
  open(source: string, mode: Mode): Promise<RunResult>;
}

const VERSION = '1.0.0';

function nextFrames(count: number): Promise<void> {
  return new Promise((resolve) => {
    const step = (remaining: number) => {
      if (remaining <= 0) resolve();
      else requestAnimationFrame(() => step(remaining - 1));
    };
    step(count);
  });
}

function boot(): void {
  initTheme();

  const app = document.getElementById('main');
  if (!app) throw new Error('Brak elementu #main');

  const initialMode = parseMode(loadString('tryb')) ?? '2d';
  const workspace = new Workspace(initialMode);
  const referenceHost = h('div', { class: 'reference-host', hidden: true });
  let referenceMounted = false;
  app.append(workspace.element, referenceHost);

  const themeButton = h('button', {
    type: 'button',
    class: 'btn ghost theme-toggle',
    on: {
      click: () => cycleTheme(),
    },
  });
  const updateThemeLabel = () => {
    themeButton.textContent = themeLabel();
    themeButton.setAttribute('aria-label', themeLabel());
    themeButton.title = themeLabel();
  };
  updateThemeLabel();
  onThemeChange(() => {
    updateThemeLabel();
    workspace.refreshTheme();
  });
  document.getElementById('theme-slot')?.append(themeButton);

  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav]'));

  let lastHash: string | null = null;
  const route = () => {
    const current = currentRoute();
    const hash = window.location.hash;
    for (const link of navLinks) {
      const active = link.dataset.nav === current.page;
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    if (current.page === 'reference') {
      workspace.deactivate();
      if (!referenceMounted) {
        mountReference(referenceHost);
        referenceMounted = true;
      }
      referenceHost.hidden = false;
      document.title = 'Pomoc · Logomocja';
      return;
    }
    referenceHost.hidden = true;
    document.title = 'Logomocja';
    workspace.activate();
    if (hash !== lastHash) workspace.openFromParams(current.params);
    lastHash = hash;
  };
  window.addEventListener('hashchange', route);
  route();

  window.logomocja = {
    version: VERSION,
    run(source, mode) {
      return run(source, mode);
    },
    async open(source, mode) {
      if (currentRoute().page !== 'workspace') navigate('#/');
      workspace.activate();
      workspace.openForScreenshot(source, mode);
      await nextFrames(3);
      return run(source, mode);
    },
  };
}

boot();
