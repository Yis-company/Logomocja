import { defineConfig } from 'vite';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base: base.endsWith('/') ? base : base + '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
});
