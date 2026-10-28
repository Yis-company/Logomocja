import { defineConfig } from 'vite';

// BASE_PATH (default "/") is the URL prefix the site is served under.
// Without it we emit relative asset URLs, which work from any location.
const raw = process.env.BASE_PATH?.trim();
let base = './';
if (raw && raw !== '/') {
  base = raw.startsWith('/') ? raw : `/${raw}`;
  if (!base.endsWith('/')) base += '/';
}

export default defineConfig({
  base,
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022', chunkSizeWarningLimit: 800 },
});
