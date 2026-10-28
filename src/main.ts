import { normalizeMode, runSource, type RunResult } from './lang';
import { App } from './ui/app';
import { initTheme } from './ui/theme';
import { VERSION } from './version';


declare global {
  interface Window {
    logomocja: {
      version: string;
      run(source: string, mode: '2d' | '3d'): RunResult;
      open(source: string, mode: '2d' | '3d'): Promise<RunResult>;
    };
  }
}

let app: App | null = null;
let ready: Promise<App>;
let resolveApp!: (a: App) => void;
let rejectApp!: (e: unknown) => void;
ready = new Promise<App>((res, rej) => {
  resolveApp = res;
  rejectApp = rej;
});
ready.catch(() => undefined);

// Interfejs testowy dostępny od razu po załadowaniu skryptu.
window.logomocja = {
  version: VERSION,
  run: (source, mode) => runSource(source, mode),
  open: async (source, mode) => {
    const a = await ready;
    return a.open(String(source ?? ''), normalizeMode(mode));
  },
};

function boot(): void {
  const root = document.getElementById('app');
  if (!root) return;
  try {
    initTheme();
    app = new App(root);
    void app.start().then(() => resolveApp(app!), rejectApp);
  } catch (e) {
    rejectApp(e);
    root.textContent = '';
    const p = document.createElement('p');
    p.style.cssText = 'padding:24px;font-family:system-ui';
    p.textContent = `Nie udało się uruchomić aplikacji: ${e instanceof Error ? e.message : String(e)}`;
    root.appendChild(p);
    console.error(e);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
