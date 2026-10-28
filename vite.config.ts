import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const basePath = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.BASE_PATH || '/';

export default defineConfig({
  base: basePath.endsWith('/') ? basePath : `${basePath}/`,
  plugins: [react()],
});
