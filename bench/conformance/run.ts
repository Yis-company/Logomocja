// Runs every suite in a directory against a built app served under its base path.
import { chromium } from "@playwright/test";
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { type Case, compareCase, type Outcome, parseSuite } from "./compare";

export type SuiteReport = { passed: number; total: number; failures: { name: string; reason: string }[] };
/** `hook`: `run` exists; `open`: `open` exists. Suites named `<file>@open` were run through `open`. */
export type Report = { hook: boolean; open: boolean; suites: Record<string, SuiteReport> };

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".wasm": "application/wasm",
};

export function serve(dist: string, basePath: string) {
  const root = resolve(dist);
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://x").pathname);
    if (!pathname.startsWith(basePath)) {
      response.writeHead(404).end();
      return;
    }
    let path = resolve(root, pathname.slice(basePath.length) || "index.html");
    if (existsSync(path) && statSync(path).isDirectory()) path = join(path, "index.html");
    if (!path.startsWith(root + sep) || !existsSync(path)) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "Content-Type": types[extname(path)] ?? "application/octet-stream" });
    createReadStream(path).pipe(response);
  });
  return new Promise<{ port: number; close: () => void }>((done) =>
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      done({ port: typeof address === "object" && address ? address.port : 0, close: () => server.close() });
    }),
  );
}

export function loadSuites(dir: string): Record<string, Case[]> {
  return Object.fromEntries(
    readdirSync(dir)
      .filter((name) => name.endsWith(".json"))
      .sort()
      .map((name) => [name.slice(0, -5), parseSuite(JSON.parse(readFileSync(join(dir, name), "utf8")))]),
  );
}

type Entry = "run" | "open";
const callHook = ([source, mode, entry, budget]: [string, string, Entry, number]) => {
  const hook = (window as unknown as { logomocja: Record<Entry, (s: string, m: string) => unknown> }).logomocja;
  const started = performance.now();
  return Promise.race([
    Promise.resolve(hook[entry](source, mode)),
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${entry}() timed out`)), budget)),
  ]).then((r) => ({ outcome: JSON.parse(JSON.stringify(r ?? null)), ms: performance.now() - started }));
};

/** Runs every suite through `run`, then again through `open` (the UI path), reporting each as a separate suite. */
export async function runConformance(dist: string, basePath: string, suitesDir: string): Promise<Report> {
  const suites = loadSuites(suitesDir);
  const { port, close } = await serve(dist, basePath);
  const browser = await chromium.launch();
  const report: Report = { hook: false, open: false, suites: {} };
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(`http://127.0.0.1:${port}${basePath}`, { waitUntil: "load" });
    report.hook = await page
      .waitForFunction(() => typeof (window as unknown as { logomocja?: { run?: unknown } }).logomocja?.run === "function", null, { timeout: 20_000 })
      .then(() => true, () => false);
    report.open = await page.evaluate(() => typeof (window as unknown as { logomocja?: { open?: unknown } }).logomocja?.open === "function");
    for (const entry of ["run", "open"] as const)
      for (const [name, cases] of Object.entries(suites)) {
        const suite: SuiteReport = { passed: 0, total: cases.length, failures: [] };
        report.suites[entry === "run" ? name : `${name}@open`] = suite;
        const available = entry === "run" ? report.hook : report.open;
        for (const c of cases) {
          let reason: string | null;
          if (!available) reason = `no window.logomocja.${entry} hook`;
          else
            try {
              const { outcome, ms } = (await page.evaluate(callHook, [c.source, c.mode, entry, entry === "run" ? 10_000 : 30_000] as [string, string, Entry, number])) as {
                outcome: Outcome | null;
                ms: number;
              };
              reason = outcome ? compareCase(c, outcome) : `${entry}() returned nothing`;
              if (reason === null && entry === "run" && c.budgetMs && ms > c.budgetMs)
                reason = `took ${Math.round(ms)} ms, budget ${c.budgetMs} ms`;
            } catch (cause) {
              reason = `${entry}() threw: ${cause instanceof Error ? cause.message : String(cause)}`.slice(0, 300);
            }
          if (reason === null) suite.passed++;
          else suite.failures.push({ name: c.name, reason });
        }
      }
  } finally {
    await browser.close();
    close();
  }
  return report;
}

if (import.meta.main) {
  const { values } = parseArgs({
    options: {
      dist: { type: "string" },
      base: { type: "string", default: "/" },
      suites: { type: "string", default: resolve(import.meta.dirname, "v1") },
    },
  });
  if (!values.dist) {
    console.error("Usage: bun bench/conformance/run.ts --dist <dir> [--base /sub/path/] [--suites bench/conformance/v1]");
    process.exit(2);
  }
  const report = await runConformance(values.dist, values.base, values.suites);
  console.log(JSON.stringify(report, null, 2));
}
