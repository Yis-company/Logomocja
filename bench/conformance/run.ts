// Runs every suite in a directory against a built app served under its base path.
import { chromium } from "@playwright/test";
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { parseArgs } from "node:util";
import { type Case, compareCase, type Outcome, parseSuite } from "./compare";

export type SuiteReport = { passed: number; total: number; failures: { name: string; reason: string }[] };
export type Report = { hook: boolean; suites: Record<string, SuiteReport> };

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

function serve(dist: string, basePath: string) {
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

export async function runConformance(dist: string, basePath: string, suitesDir: string): Promise<Report> {
  const suites = loadSuites(suitesDir);
  const { port, close } = await serve(dist, basePath);
  const browser = await chromium.launch();
  const report: Report = { hook: false, suites: {} };
  try {
    const page = await browser.newPage();
    await page.goto(`http://127.0.0.1:${port}${basePath}`, { waitUntil: "load" });
    report.hook = await page
      .waitForFunction(() => typeof (window as unknown as { logomocja?: { run?: unknown } }).logomocja?.run === "function", null, { timeout: 20_000 })
      .then(() => true, () => false);
    for (const [name, cases] of Object.entries(suites)) {
      const suite: SuiteReport = { passed: 0, total: cases.length, failures: [] };
      report.suites[name] = suite;
      for (const c of cases) {
        let reason: string | null;
        if (!report.hook) reason = "no window.logomocja.run hook";
        else
          try {
            const outcome = (await page.evaluate(
              ([source, mode]) =>
                Promise.race([
                  Promise.resolve((window as unknown as { logomocja: { run: (s: string, m: string) => unknown } }).logomocja.run(source, mode)),
                  new Promise((_, reject) => setTimeout(() => reject(new Error("run() timed out")), 10_000)),
                ]).then((r) => JSON.parse(JSON.stringify(r ?? null))),
              [c.source, c.mode],
            )) as Outcome | null;
            reason = outcome ? compareCase(c, outcome) : "run() returned nothing";
          } catch (cause) {
            reason = `run() threw: ${cause instanceof Error ? cause.message : String(cause)}`.slice(0, 300);
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
