import { defineConfig } from "@playwright/test";
import development from "./playwright.config";
export default defineConfig({
  ...development,
  testDir: "./tests/pages",
  testIgnore: [],
  use: { ...development.use, baseURL: "http://127.0.0.1:5182/Logomocja/" },
  webServer: { command: "bun scripts/serve-pages.ts", url: "http://127.0.0.1:5182/Logomocja/", reuseExistingServer: false },
});
