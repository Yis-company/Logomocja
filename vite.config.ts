import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/Logomocja/' : '/',
  define: { 'import.meta.env.VITE_PAGES': JSON.stringify(mode === 'pages') },
  plugins: [react(), tailwindcss()],
  resolve: {alias: {'@': fileURLToPath(new URL('./src', import.meta.url))}},
  test: {include: ['src/**/*.test.ts', 'scripts/**/*.test.ts']},
}));
