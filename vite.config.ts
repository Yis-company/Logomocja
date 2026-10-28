import { defineConfig } from 'vite';

/**
 * BASE_PATH sets the public sub-path the site is served from (default "/").
 * Asset URLs are generated relative to it, so `dist/` works from any folder.
 */
function normaliseBase(raw: string | undefined): string {
  let base = (raw ?? '/').trim();
  if (!base.startsWith('/') && !/^https?:\/\//.test(base)) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;
  return base;
}

export default defineConfig({
  base: normaliseBase(process.env.BASE_PATH),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 5173,
  },
});
