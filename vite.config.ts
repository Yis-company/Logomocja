import { defineConfig } from 'vite';

/** BASE_PATH lets the static site live under a sub-path, e.g. /Logomocja/builds/x/. */
function basePath(): string {
  let b = process.env.BASE_PATH || '/';
  if (!b.startsWith('/')) b = '/' + b;
  if (!b.endsWith('/')) b += '/';
  return b;
}

export default defineConfig({
  base: basePath(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
});
