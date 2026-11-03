import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const b = await chromium.launch({ args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto(process.env.TEST_URL || "http://localhost:5173");
await p.waitForFunction(() => window.logomocja);
for (const width of [320, 360, 390, 760, 768, 1024, 1440]) {
  await p.setViewportSize({ width, height: 900 });
  for (const tab of ["studio", "challenges", "reference"]) {
    await p.locator(`[data-page="${tab}"]`).click();
    await p.waitForTimeout(30);
    const over = await p.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    console.log(width, tab, over ? "OVERFLOW" : "OK");
    assert(!over);
  }
}
await b.close();
