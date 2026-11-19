import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// No-push runs have local branches. The release checkout fetches origin's refs.
const publishedBenchmarkSources = spawnSync('git', [
  'for-each-ref', '--format=%(refname:strip=4)', 'refs/remotes/origin/build/',
], { encoding: 'utf8' }).stdout?.trim().replace(/\s+/g, ' ') ?? '';

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/Logomocja/' : '/',
  define: {
    'import.meta.env.VITE_PAGES': JSON.stringify(mode === 'pages'),
    'import.meta.env.VITE_PUBLISHED_BENCHMARK_SOURCE_IDS': JSON.stringify(publishedBenchmarkSources),
  },
  plugins: [react(), tailwindcss(), {
    name: 'logomocja-metadata',
    transformIndexHtml(html) {
      const pages = mode === 'pages';
      return html
        .replace('%LOGOMOCJA_LANG%', pages ? 'en' : 'pl')
        .replace('%LOGOMOCJA_TITLE%', pages ? 'Benchmark · Logomocja' : 'Logomocja — pracownia żółwia')
        .replace('%LOGOMOCJA_DESCRIPTION%', pages
          ? 'Explore how AI coding agents build the same 2D and 3D Logo studio from a versioned brief.'
          : 'Pracownia Logo — ucz się programowania, rysując z żółwiem w 2D i 3D.');
    },
  }],
  resolve: {alias: {'@': fileURLToPath(new URL('./src', import.meta.url))}},
  test: {include: ['src/**/*.test.ts', 'scripts/**/*.test.ts', 'bench/**/*.test.ts']},
}));
