import './style.css';
import { runProgram, type Mode, type RunResult } from './logo/index';
import { editorApi } from './ui/editor-page';
import { startApp } from './ui/app';

export interface LogomocjaApi {
  version: string;
  /** Interprets the source without touching the UI. */
  run(source: string, mode: Mode): RunResult;
  /** Loads the source into the editor, runs it to the end and resolves once the drawing is on screen. */
  open(source: string, mode: Mode): Promise<RunResult>;
}

declare global {
  interface Window {
    logomocja: LogomocjaApi;
  }
}

const waitForEditor = async (): Promise<void> => {
  for (let i = 0; i < 300 && !editorApi(); i++) {
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
  }
};

window.logomocja = {
  version: '1.0.0',
  run: (source, mode) => runProgram(source, mode),
  async open(source, mode) {
    if (!editorApi()) {
      location.hash = '#/';
      await waitForEditor();
    }
    const api = editorApi();
    if (!api) throw new Error('Edytor nie jest dostępny.');
    return api.open(source, mode);
  },
};

startApp(document.getElementById('app')!);
