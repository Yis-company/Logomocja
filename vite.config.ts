import { defineConfig } from 'vite';

/** Ścieżka bazowa strony, np. /Logomocja/builds/x/ – zawsze z ukośnikiem na końcu. */
function basePath(): string {
  let base = process.env.BASE_PATH?.trim() || '/';
  if (!base.startsWith('/') && !base.startsWith('.')) base = '/' + base;
  if (!base.endsWith('/')) base += '/';
  return base;
}

export default defineConfig({
  base: basePath(),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    assetsInlineLimit: 0,
  },
});
