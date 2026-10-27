import { defineConfig } from 'vite';

// BASE_PATH lets the static build live under a sub-path, e.g. /Logomocja/builds/x/.
const requested = process.env.BASE_PATH || '/';
const base = requested.endsWith('/') ? requested : `${requested}/`;

export default defineConfig({
  base,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
  },
});
