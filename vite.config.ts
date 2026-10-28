import { defineConfig } from 'vite';

/** `BASE_PATH` sets the sub-path the site is served from, e.g. `/Logomocja/builds/x/`. */
function basePath(raw: string | undefined): string {
  const p = (raw ?? '/').trim() || '/';
  const withLead = p.startsWith('/') || /^https?:/.test(p) ? p : `/${p}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

export default defineConfig({
  base: basePath(process.env.BASE_PATH),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
  },
});
