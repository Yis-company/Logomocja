import { defineConfig } from 'vite';
import pkg from './package.json';

function normaliseBase(raw: string | undefined): string {
  let base = (raw ?? '').trim() || '/';
  if (!base.startsWith('/') && !base.startsWith('.')) base = '/' + base;
  if (!base.endsWith('/')) base += '/';
  return base;
}

export default defineConfig({
  base: normaliseBase(process.env.BASE_PATH),
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    chunkSizeWarningLimit: 900,
  },
});
