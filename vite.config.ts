import { defineConfig } from 'vite';

// BASE_PATH lets the static build live under a sub-path, e.g. /Logomocja/builds/x/
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base: base.endsWith('/') ? base : `${base}/`,
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
});
