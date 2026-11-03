import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { examples } from "../src/examples.ts";
const appUrl = process.env.TEST_URL || "http://localhost:5173/";
const appOrigin = new URL(appUrl).origin;
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
const external = [];
page.on("request", (r) => {
  if (
    !r.url().startsWith(appOrigin) &&
    !r.url().startsWith("data:")
  )
    external.push(r.url());
});
await page.goto(appUrl);
await page.waitForFunction(() => window.logomocja);
assert.equal(await page.locator("[data-example]").count(), 7);
const before = await page.locator("#editor").inputValue();
const pure = await page.evaluate(() =>
  window.logomocja.run("np 20 pw 90 np 40", "2d"),
);
assert.equal(pure.segments.length, 2);
assert.equal(await page.locator("#editor").inputValue(), before);
for (const ex of examples) {
  const r = await page.evaluate(
    async (e) => await window.logomocja.open(e.source, e.mode),
    ex,
  );
  assert.equal(r.error, null, ex.id);
  assert.ok(r.segments.length);
  assert.equal(await page.locator("#editor").inputValue(), ex.source);
  assert.equal(
    await page.locator(`[data-mode="${ex.mode}"]`).getAttribute("aria-pressed"),
    "true",
  );
}
await page.evaluate(() =>
  window.logomocja.open("powtorz 4 [np 100 pw 90]", "2d"),
);
await page.locator("#reset").click();
assert.equal(await page.locator("#segment-count").textContent(), "0 odcinków");
await page.locator("#step").click();
await page.locator("#step").click();
assert.equal(await page.locator("#segment-count").textContent(), "1 odcinków");
assert.equal(await page.locator(".code-line.executing").count(), 1);
await page.locator("#speed").fill("1");
await page.locator("#run").click();
await page.waitForTimeout(250);
await page.locator("#pause").click();
const paused = await page.locator("#segment-count").textContent();
await page.waitForTimeout(250);
assert.equal(await page.locator("#segment-count").textContent(), paused);
await page.locator("#pause").click();
await page.waitForTimeout(150);
await page.locator("#editor").fill("np 77");
assert.ok(
  (await page.locator("#execution-state").textContent()).includes(
    "Kod zmieniony",
  ),
);
await page.keyboard.press("Control+Enter");
await page.waitForTimeout(400);
assert.equal(await page.locator("#segment-count").textContent(), "1 odcinków");
await page.locator("#share").click();
const url = await page.evaluate(() => navigator.clipboard.readText());
assert.ok(url.includes("#p=2d."));
const shared = await context.newPage();
await shared.goto(url);
await shared.waitForFunction(
  () => window.logomocja && document.querySelector("#editor").value === "np 77",
);
assert.equal(
  await shared.locator("#segment-count").textContent(),
  "1 odcinków",
);
await shared.close();
await page.locator('[data-filter="2d"]').click();
await page.locator('[data-example="gwiazda"]').click();
assert.equal(await page.locator("#editor").inputValue(), examples[1].source);
await page.locator("#history").click();
assert.ok(
  await page
    .locator("#history-list")
    .textContent()
    .then((t) => t.includes("np 77")),
);
await page.locator("#close-history").click();
await page.locator("#editor").fill("np 88");
await page.locator('[data-mode="3d"]').click();
await page.locator("#editor").fill("gora 90 np 55");
await page.locator('[data-mode="2d"]').click();
assert.equal(await page.locator("#editor").inputValue(), "np 88");
await page.reload();
await page.waitForFunction(() => window.logomocja);
assert.equal(await page.locator("#editor").inputValue(), "np 88");
await page.locator('[data-mode="3d"]').click();
assert.equal(await page.locator("#editor").inputValue(), "gora 90 np 55");
await page.locator('[data-mode="2d"]').click();
await page
  .locator("#file-input")
  .setInputFiles({
    name: "test.logo",
    mimeType: "text/plain",
    buffer: Buffer.from("np 12 pw 90 np 34"),
  });
await page.waitForFunction(
  () => document.querySelector("#editor").value === "np 12 pw 90 np 34",
);
assert.equal(await page.locator("#segment-count").textContent(), "2 odcinków");
let downloadPromise = page.waitForEvent("download");
await page.locator("#download").click();
let download = await downloadPromise;
assert.ok(download.suggestedFilename().endsWith(".logo"));
downloadPromise = page.waitForEvent("download");
await page.locator("#export").click();
download = await downloadPromise;
assert.ok(download.suggestedFilename().endsWith(".png"));
await page.locator('[data-tab="challenges"]').click();
await page.waitForSelector("#challenges-panel:not([hidden])");
await page.locator("#editor").fill("powtorz 4 [np 100 pw 90]");
await page.locator("#check-challenge").click();
assert.ok(
  (await page.locator("#challenge-result").textContent()).includes("pasują"),
);
await page.reload();
await page.waitForSelector("#challenges-panel:not([hidden])");
assert.equal(await page.locator(".nav-count").textContent(), "1/6");
await page.locator("#editor").fill("np 10");
await page.locator("#check-challenge").click();
assert.ok(
  (await page.locator("#challenge-result").textContent()).includes("Brakuje"),
);
await page.locator('[data-tab="guide"]').click();
await page.waitForSelector("#guide:not([hidden])");
await page.locator("#command-search").fill("rollright");
assert.equal(await page.locator(".command-entry").count(), 1);
await page.locator("#command-search").fill("");
await page.locator('a[href="#guide/limits"]').click();
await page.waitForFunction(() => location.hash === "#guide/limits");
await page.reload();
await page.waitForSelector("#guide:not([hidden])");
await page.evaluate(() => window.logomocja.open("np 20", "2d"));
await page.waitForSelector("#workspace:not([hidden])");
await page.locator("#editor").fill("np 10\nnp 2 / 0");
await page.locator("#instant").click();
assert.ok(
  (await page.locator("#error").textContent()).includes("Linia 2, kolumna 4"),
);
assert.equal(await page.locator("#segment-count").textContent(), "1 odcinków");
assert.equal(await page.locator(".error-caret").count(), 1);
await page.locator("#editor").fill("np 10\nnieznane");
await page.locator("#instant").click();
assert.equal(await page.locator("#segment-count").textContent(), "0 odcinków");
await page.locator("#editor").focus();
await page.keyboard.press("Tab");
assert.notEqual(await page.evaluate(() => document.activeElement.id), "editor");
assert.deepEqual(errors, []);
assert.deepEqual(external, []);
console.log(
  "PASS: all 13 examples, pure API, stepping, pause/resume, editing, shortcuts, drafts, history, permalink, file import/download, PNG, challenges/progress, reference/routes, error markers, keyboard exit, zero external requests.",
);
await browser.close();
