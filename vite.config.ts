import { defineConfig } from 'vite';

function normalizeBase(raw: string | undefined): string {
  let b = raw && raw.trim() ? raw.trim() : '/';
  if (!b.startsWith('/')) b = '/' + b;
  if (!b.endsWith('/')) b += '/';
  return b;
}

export default defineConfig({
  base: normalizeBase(process.env.BASE_PATH),
  build: { outDir: 'dist', emptyOutDir: true, chunkSizeWarningLimit: 1200 },
});
