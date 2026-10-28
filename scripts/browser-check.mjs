import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { examples } from "../src/examples.js";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1060 } });
let errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.TEST_URL || "http://localhost:5173/");
await page.waitForFunction(() => window.logomocja);
await page.screenshot({ path: "/tmp/logomocja-desktop.png", fullPage: true });
for (let ex of examples) {
  let r = await page.evaluate(
    (ex) => window.logomocja.open(ex.source, ex.mode),
    ex,
  );
  assert.equal(r.error, null, ex.id);
  assert.ok(r.segments.length);
}
await page.evaluate(() => window.logomocja.open("np 50\npw 90\nnp 50", "2d"));
await page.locator("#reset").click();
await page.locator("#step").click();
assert.match(await page.locator("#status").textContent(), /1 odcinków/);
await page.locator("#code").fill("np 20\nnieznane");
await page.locator("#run").click();
assert.match(await page.locator("#error").textContent(), /Wiersz 2/);
assert.equal(await page.locator(".invalid").count(), 1);
await page.locator('[data-page="challenges"]').click();
await page.locator('[data-task="0"]').click();
await page.locator("#code").fill("powtorz 4 [np 100 pw 90]");
await page.locator("#check-task").click();
assert.match(await page.locator("#toast").textContent(), /Brawo/);
await page.locator("#code").fill("np 123");
await page.locator('[data-page="examples"]').click();
await page.locator('[data-example="kula"]').click();
await page.locator("#files").click();
assert.ok((await page.locator(".backup").count()) > 0);
await page.locator(".close").click();
await page.locator('[data-page="reference"]').click();
assert.equal(await page.locator(".reference tbody tr").count(), 19);
await page.locator('[data-page="studio"]').click();
await page.evaluate(() =>
  window.logomocja.open("powtorz 4 [np 120 pw 90]", "2d"),
);
await page.reload();
assert.equal(
  await page.locator("#code").inputValue(),
  "powtorz 4 [np 120 pw 90]",
);
const shared = await page.evaluate(
  () =>
    location.href.split("#")[0] +
    "#program=" +
    encodeURIComponent(btoa(JSON.stringify({ source: "np 42", mode: "3d" }))),
);
await page.goto(shared);
await page.waitForTimeout(100);
assert.equal(await page.locator("#code").inputValue(), "np 42");
assert.match(await page.locator("#status").textContent(), /1 odcinków/);
await page.evaluate(() =>
  window.logomocja.open("powtorz 12 [powtorz 4 [np 100 pw 90] pw 30]", "2d"),
);
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({ path: "/tmp/logomocja-mobile.png", fullPage: true });
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await page.locator("#theme").click();
await page.locator("#theme").click();
await page.screenshot({ path: "/tmp/logomocja-dark.png", fullPage: true });
if (await page.locator("#close-task").count())
  await page.locator("#close-task").click();
const pngPromise = page.waitForEvent("download");
await page.locator("#export").click();
const png = await pngPromise;
assert.equal(png.suggestedFilename(), "logomocja.png");
assert.equal(await png.failure(), null);
await page.locator("#files").click();
const filePromise = page.waitForEvent("download");
await page.locator("#save-file").click();
const file = await filePromise;
assert.ok(file.suggestedFilename().endsWith(".logo"));
assert.equal(await file.failure(), null);
await page
  .locator("#file-input")
  .setInputFiles({
    name: "test.logo",
    mimeType: "text/plain",
    buffer: Buffer.from("np 31"),
  });
await page.waitForFunction(() => document.querySelector("#code").value === "np 31");
assert.equal(await page.locator("#code").inputValue(), "np 31");
assert.match(await page.locator("#status").textContent(), /1 odcinków/);
await page.locator("#code").fill("powtorz 100 [np 1 pw 3]");
await page.locator("#run").click();
await page.locator("#pause").click();
const paused = await page.locator("#coordinates").textContent();
await page.waitForTimeout(150);
assert.equal(await page.locator("#coordinates").textContent(), paused);
await page.locator("#pause").click();
await page.waitForTimeout(150);
assert.notEqual(await page.locator("#coordinates").textContent(), paused);
await page.locator("#reset").click();
await page.evaluate(() =>
  window.logomocja.open(
    "powtorz 4 [np 100 pw 90] gora 90 np 100 dol 90 powtorz 4 [np 100 pw 90]",
    "3d",
  ),
);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.locator("#fit").click();
await page.screenshot({ path: "/tmp/logomocja-3d.png", fullPage: true });
await page.context().setOffline(true);
let offline = await page.evaluate(() => window.logomocja.open("np 17", "2d"));
assert.equal(offline.error, null);
assert.equal(offline.segments[0].to[1], 17);
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "Browser checks passed: all examples, hook, errors, step, challenges, backups, reference, persistence, permalink, mobile and themes.",
);
