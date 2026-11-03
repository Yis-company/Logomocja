import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { examples, challenges } from "../src/examples.js";
const origin = process.env.TEST_URL || "http://localhost:5173/";
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1080 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
let errors = [],
  outside = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (!r.url().startsWith(origin) && !r.url().startsWith("data:"))
    outside.push(r.url());
});
await page.goto(origin);
await page.waitForFunction(() => !!window.logomocja);
await page.evaluate(() => document.fonts.ready);
assert.equal(await page.locator("#segment-count").innerText(), "48 odcinków");
for (const ex of examples) {
  const r = await page.evaluate(
    async (e) => window.logomocja.open(e.source, e.mode),
    ex,
  );
  assert.equal(r.error, null, ex.name);
  assert(r.segments.length > 0, ex.name);
  assert.equal(await page.locator("#editor").inputValue(), ex.source);
}
const before = await page.locator("#editor").inputValue();
await page.evaluate(() => window.logomocja.run("np 5", "2d"));
assert.equal(await page.locator("#editor").inputValue(), before);
let r = await page.evaluate(() =>
  window.logomocja.open("np 10\nnp 1 / 0", "2d"),
);
assert.equal(r.segments.length, 1);
assert.equal(r.error.line, 2);
assert.equal(await page.locator(".error-char").count(), 1);
assert.match(await page.locator("#error-message").innerText(), /Dzielenie/);
r = await page.evaluate(() => window.logomocja.open("np 10\nnieznane", "2d"));
assert.equal(r.segments.length, 0);
await page.locator("#editor").fill("np 10 pw 90 np 10");
await page.locator("#step").click();
assert.equal(await page.locator("#segment-count").innerText(), "1 odcinków");
assert.equal(await page.locator(".executing-line").count(), 1);
await page.locator("#step").click();
await page.locator("#step").click();
assert.equal(await page.locator("#segment-count").innerText(), "2 odcinków");
await page.locator("#reset").click();
assert.equal(await page.locator("#segment-count").innerText(), "0 odcinków");
await page.locator("#editor").fill("powtorz 100 [np 1 pw 10]");
await page.locator("#run").click();
await page.waitForTimeout(180);
await page.locator("#pause").click();
const paused = await page.locator("#segment-count").innerText();
await page.waitForTimeout(200);
assert.equal(await page.locator("#segment-count").innerText(), paused);
await page.locator("#editor").fill("np 22");
await page.waitForTimeout(100);
assert.equal(await page.locator("#pause").isDisabled(), true);
await page.reload();
await page.waitForFunction(() => !!window.logomocja);
assert.equal(await page.locator("#editor").inputValue(), "np 22");
await page.waitForTimeout(100);
await page.locator('[data-example="kwadrat"]').click();
await page.locator("#history").click();
assert.match(await page.locator("#dialog-body").innerText(), /np 22/);
await page.locator("#dialog-close").click();
for (const c of challenges) {
  await page.locator('[data-page="challenges"]').click();
  await page.locator(`[data-task="${c.id}"]`).click();
  await page.locator("#editor").fill(c.source);
  await page.locator("#check-task").click();
  await page.waitForFunction(
    () => document.querySelector("#task-result")?.className === "task-pass",
  );
}
await page.locator('[data-page="challenges"]').click();
assert.equal(
  await page.locator("#progress-label").innerText(),
  "5 / 5 ukończonych",
);
await page.reload();
await page.waitForFunction(() => !!window.logomocja);
await page.locator('[data-page="challenges"]').click();
assert.equal(
  await page.locator("#progress-label").innerText(),
  "5 / 5 ukończonych",
);
await page.locator('[data-page="reference"]').click();
assert.equal(await page.locator(".command-list details").count(), 20);
await page.locator(".command-list summary").first().click();
assert(
  (await page.locator(".command-list details").first().getAttribute("open")) !==
    null,
);
await page.evaluate(() =>
  window.logomocja.open('kolor "#abcdef" np 65 pw 45 np 22', "2d"),
);
await page.locator("#share").click();
const url = await page.evaluate(() => navigator.clipboard.readText());
assert(url.includes("#p="));
const other = await context.newPage();
await other.goto(url);
await other.waitForFunction(
  () => document.querySelector("#segment-count")?.textContent === "2 odcinków",
);
assert.equal(
  await other.locator("#editor").inputValue(),
  'kolor "#abcdef" np 65 pw 45 np 22',
);
await other.close();
const dl = page.waitForEvent("download");
await page.locator("#save-file").click();
assert((await dl).suggestedFilename().endsWith(".logo"));
const png = page.waitForEvent("download");
await page.locator("#export-png").click();
assert((await png).suggestedFilename().endsWith(".png"));
await page.locator("#file-input").setInputFiles({
  name: "test.logo",
  mimeType: "text/plain",
  buffer: Buffer.from("np 77"),
});
await page.waitForFunction(
  () => document.querySelector("#editor").value === "np 77",
);
await page.locator("#theme").click();
assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
await page.waitForTimeout(300);
await page.screenshot({ path: ".impeccable/review/dark.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(150);
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
await page.locator('[data-page="challenges"]').click();
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
await page.locator('[data-page="reference"]').click();
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
assert.deepEqual(errors, []);
assert.deepEqual(outside, []);
console.log(
  "Browser checks passed: examples, API purity, errors, steps, pause, drafts, archives, 5 challenges, progress, reference, share, files, PNG, theme, mobile, no external requests.",
);
await browser.close();
