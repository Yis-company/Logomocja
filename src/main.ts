import './styles.css';
import { run, type Mode } from './lang';
import { EXAMPLES } from './content/examples';
import { App } from './ui/app';
import { version } from '../package.json';

const app = new App(document.getElementById('app')!);

declare global {
  interface Window {
    logomocja: {
      version: string;
      run: typeof run;
      open: (source: string, mode: Mode) => Promise<ReturnType<typeof run>>;
      examples: { id: string; title: string; mode: Mode; source: string }[];
      loadExample: (id: string) => Promise<boolean>;
    };
  }
}

window.logomocja = {
  version,
  run: (source, mode) => run(source, mode),
  open: (source, mode) => app.openForTest(source, mode),
  examples: EXAMPLES.map(({ id, title, mode, source }) => ({ id, title, mode, source })),
  loadExample: (id) => app.loadExample(id),
};
