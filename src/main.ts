import './styles.css';
import { VERSION } from './version';
import { runLogo } from './logo/run';
import type { Mode, RunResult } from './logo/types';
import { startApp } from './ui/app';

export interface LogomocjaApi {
  readonly version: string;
  /** Interprets a program without touching the UI. */
  run(source: string, mode: Mode): RunResult;
}

declare global {
  interface Window {
    logomocja: LogomocjaApi;
  }
}

window.logomocja = {
  version: VERSION,
  run: (source, mode) => runLogo(source, mode),
};

startApp();
