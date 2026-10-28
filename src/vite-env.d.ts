/// <reference types="vite/client" />

/** Injected by vite.config.ts from package.json. */
declare const __APP_VERSION__: string;

interface LogomocjaWindowApi {
  version: string;
  run: (source: string, mode: '2d' | '3d') => { segments: import('./lang/index').Segment[]; error: import('./lang/index').LogoError | null };
  open: (source: string, mode: '2d' | '3d') => Promise<{ segments: import('./lang/index').Segment[]; error: import('./lang/index').LogoError | null }>;
}

interface Window {
  logomocja: LogomocjaWindowApi;
}
