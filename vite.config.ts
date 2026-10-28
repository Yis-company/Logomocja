import { defineConfig, loadEnv } from 'vite';
export default defineConfig(({ mode }) => ({
  base: loadEnv(mode, '.', '').BASE_PATH || '/',
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/three/build/three.core')) return 'three-core';
          if (id.includes('/three/')) return 'three-renderer';
        },
      },
    },
  },
}));
