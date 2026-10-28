import { render } from 'preact';
import './styles/app.css';
import './state/theme';
import type { Mode } from './lang/ast';
import { runPublic, type PublicResult } from './lang/index';
import { navigate, route } from './state/router';
import { openForTesting } from './state/studio';
import { App } from './ui/App';

declare global {
  interface Window {
    logomocja: {
      version: string;
      run(source: string, mode?: Mode): PublicResult;
      open(source: string, mode?: Mode): Promise<PublicResult>;
    };
  }
}

function normMode(mode: unknown): Mode {
  return mode === '3d' ? '3d' : '2d';
}

window.logomocja = {
  version: __APP_VERSION__,
  run: (source, mode) => runPublic(String(source ?? ''), normMode(mode)),
  open: async (source, mode) => {
    const r = route.peek();
    if (r.name !== 'studio') navigate({ name: 'studio' });
    return openForTesting(String(source ?? ''), normMode(mode));
  },
};

render(<App />, document.getElementById('app')!);
