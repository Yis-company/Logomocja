import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { examples } from "../src/examples.js";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
let errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.TEST_URL || "http://localhost:5173/");
await page.waitForFunction(
  () =>
    window.logomocja &&
    document.querySelector("#segmentCount").textContent === "48 odcinków",
);
await page.screenshot({ path: "/tmp/logomocja-desktop.png", fullPage: true });
let r = await page.evaluate(() =>
  window.logomocja.open("powtorz 4 [np 100 pw 90]", "2d"),
);
assert.equal(r.error, null);
assert.equal(r.segments.length, 4);
await page.click("#step");
await page.click("#pause");
await page.click("#reset");
await page.evaluate(() => window.logomocja.open("np 10\nnp 1 / 0", "2d"));
assert.match(await page.locator("#error").textContent(), /Wiersz 2, kolumna 4/);
await page.click("#examplesNav");
await page.click('[data-example="kula"]');
assert.equal(await page.locator("#segmentCount").textContent(), "432 odcinków");
await page.click("#examplesNav");
await page.click("#showHistory");
assert.ok((await page.locator("[data-backup]").count()) > 0);
await page.click("#closeModal");
await page.evaluate(() =>
  window.logomocja.open("powtorz 4 [np 100 pw 90]", "2d"),
);
await page.click("#challengesNav");
await page.click('[data-challenge="0"]');
await page.click("#checkChallenge");
assert.match(await page.locator("#challengeResult").textContent(), /Brawo/);
await page.click("#closeModal");
await page.click("#referenceNav");
assert.equal(await page.locator(".command-entry").count(), 19);
await page.fill(".reference-search", "góra");
assert.equal(await page.locator(".command-entry:visible").count(), 1);
await page.click("#closeModal");
await page.evaluate(() =>
  window.logomocja.open("gora 90 np 80 pp 90 gora 90 np 60", "3d"),
);
await page.screenshot({ path: "/tmp/logomocja-3d.png", fullPage: true });
await page.reload();
await page.waitForFunction(() => window.logomocja);
assert.match(await page.locator("#editor").inputValue(), /gora 90/);
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() =>
  window.logomocja.open("powtorz 12 [powtorz 4 [np 100 pw 90] pw 30]", "2d"),
);
await page.screenshot({ path: "/tmp/logomocja-mobile.png", fullPage: true });
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.click("#export"),
]);
assert.match(download.suggestedFilename(), /\.png$/);
// Exercise every standard program through the public screenshot hook.
for (const example of examples) {
  const result = await page.evaluate(
    ({ source, mode }) => window.logomocja.open(source, mode),
    example,
  );
  assert.equal(result.error, null, example.id);
}
await page.click("#dragPan");
assert.equal(
  await page.locator("#dragPan").getAttribute("aria-pressed"),
  "true",
);
await page.locator("#canvas").focus();
await page.keyboard.press("Shift+ArrowRight");
await page.click("#camera");
await page.click("#theme");
await page.click("#theme");
assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
await page.screenshot({ path: "/tmp/logomocja-dark.png", fullPage: true });
await page.setInputFiles("#fileInput", {
  name: "test.logo",
  mimeType: "text/plain",
  buffer: Buffer.from("np 42"),
});
assert.equal(await page.locator("#editor").inputValue(), "np 42");
assert.equal(await page.locator("#segmentCount").textContent(), "1 odcinków");
const shareData = Buffer.from(
  JSON.stringify({ s: 'kolor "#abcdef" np 73', m: "2d" }),
).toString("base64");
await page.goto(
  (process.env.TEST_URL || "http://localhost:5173/") +
    "#program=" +
    encodeURIComponent(shareData),
);
await page.waitForFunction(() =>
  document.querySelector("#editor").value.includes("np 73"),
);
assert.equal(await page.locator("#segmentCount").textContent(), "1 odcinków");
await page.context().setOffline(true);
await page.evaluate(() => window.logomocja.open("np 24", "2d"));
assert.equal(await page.locator("#segmentCount").textContent(), "1 odcinków");
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "Browser checks passed: hooks, errors, history, examples, challenges, reference, persistence, mobile, PNG.",
);
