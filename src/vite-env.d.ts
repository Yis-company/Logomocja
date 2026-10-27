/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface LogomocjaApi {
  version: string;
  run(source: string, mode: '2d' | '3d' | string): import('./logo').RunResult;
}

interface Window {
  logomocja: LogomocjaApi;
}
