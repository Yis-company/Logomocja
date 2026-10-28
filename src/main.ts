import './styles.css';
import { boot, createApi, VERSION, type App, type LogomocjaApi } from './ui/app';

declare global {
  interface Window {
    logomocja: LogomocjaApi;
  }
}

let app: App | null = null;
// The hook is available immediately; `open` waits for the UI.
window.logomocja = createApi(() => app);
void VERSION;

const start = () => {
  app = boot();
};
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
else start();
