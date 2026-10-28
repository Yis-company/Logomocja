import { defineConfig } from "vite";

let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = "/" + base;
if (!base.endsWith("/")) base += "/";

export default defineConfig({
  base,
  build: { outDir: "dist", emptyOutDir: true, chunkSizeWarningLimit: 1200 },
});
