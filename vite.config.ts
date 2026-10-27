import { defineConfig } from "vite";
import pkg from "./package.json" with { type: "json" };

/** Normalise BASE_PATH so it always starts and ends with a slash. */
function basePath(raw: string | undefined): string {
  let base = (raw ?? "").trim() || "/";
  if (!base.startsWith("/")) base = "/" + base;
  if (!base.endsWith("/")) base += "/";
  return base;
}

export default defineConfig({
  base: basePath(process.env.BASE_PATH),
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    target: "es2020",
    chunkSizeWarningLimit: 1200,
  },
});
