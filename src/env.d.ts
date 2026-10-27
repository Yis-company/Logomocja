/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface Window {
  logomocja: {
    version: string;
    run(source: string, mode: "2d" | "3d"): import("./lang").RunResult;
  };
}
