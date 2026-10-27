// Captures the standard programs in a built app through window.logomocja.open:
// one screenshot per program, plus one phone-sized capture, and whether each
// program's segments matched the reference outcome.
import { chromium } from "@playwright/test";
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { compareCase, type Outcome } from "./conformance/compare";
import { serve } from "./conformance/run";
import { loadExpected, loadPrograms } from "./programs";

export type GalleryReport = {
  hook: boolean;
  programs: Record<string, { matches: boolean; reason: string | null }>;
};
export const MOBILE_PROGRAM = "drzewo";

export async function captureGallery(dist: string, basePath: string, version: string, outDir: string): Promise<GalleryReport> {
  const programs = loadPrograms(version);
  const expected = loadExpected(version);
  mkdirSync(outDir, { recursive: true });
  const { port, close } = await serve(dist, basePath);
  const browser = await chromium.launch();
  const report: GalleryReport = { hook: false, programs: {} };
  const capture = async (width: number, height: number, ids: string[], prefix: string) => {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`http://127.0.0.1:${port}${basePath}`, { waitUntil: "load" });
    const hook = await page
      .waitForFunction(() => typeof (window as unknown as { logomocja?: { open?: unknown } }).logomocja?.open === "function", null, { timeout: 20_000 })
      .then(() => true, () => false);
    for (const program of programs.filter((p) => ids.includes(p.id))) {
      let reason: string | null = hook ? null : "no window.logomocja.open hook";
      if (hook)
        try {
          const outcome = (await page.evaluate(
            ([source, mode]) =>
              Promise.race([
                Promise.resolve((window as unknown as { logomocja: { open: (s: string, m: string) => unknown } }).logomocja.open(source, mode)),
                new Promise((_, reject) => setTimeout(() => reject(new Error("open() timed out")), 30_000)),
              ]).then((r) => JSON.parse(JSON.stringify(r ?? null))),
            [program.source, program.mode],
          )) as Outcome | null;
          const want = expected[program.id];
          reason = outcome
            ? compareCase({ name: program.id, mode: program.mode, source: program.source, expect: want.error ? { error: want.error, segments: want.segments } : { segments: want.segments } }, outcome)
            : "open() returned nothing";
        } catch (cause) {
          reason = `open() threw: ${cause instanceof Error ? cause.message : String(cause)}`.slice(0, 300);
        }
      await page.waitForTimeout(250);
      const png = join(outDir, `${prefix}${program.id}.png`);
      await page.screenshot({ path: png });
      // WebP is a fifth of the size; keep the PNG when cwebp is not installed.
      if (spawnSync("cwebp", ["-quiet", "-q", "85", png, "-o", png.replace(/\.png$/, ".webp")]).status === 0) rmSync(png);
      if (prefix === "") report.programs[program.id] = { matches: reason === null, reason };
    }
    await page.close();
    return hook;
  };
  try {
    report.hook = await capture(1280, 800, programs.map((p) => p.id), "");
    await capture(390, 844, [MOBILE_PROGRAM], "mobile-");
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
      version: { type: "string", default: "v2" },
      out: { type: "string" },
    },
  });
  if (!values.dist || !values.out) {
    console.error("Usage: bun bench/gallery.ts --dist <dir> --out <dir> [--base /sub/path/] [--version v2]");
    process.exit(2);
  }
  const report = await captureGallery(values.dist, values.base, values.version, resolve(values.out));
  console.log(JSON.stringify(report, null, 2));
}
