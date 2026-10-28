import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { examples } from "../src/examples.js";
const base = process.env.TEST_URL || "http://localhost:5173/";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base);
await page.waitForFunction(() => window.logomocja);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: "/tmp/logomocja-desktop.png", fullPage: true });
assert.equal(await page.locator(".example-grid .example-card").count(), 4);
const network = [];
page.on("request", (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
    network.push(r.url());
});
for (let e of examples) {
  let r = await page.evaluate(
    async (e) => window.logomocja.open(e[4], e[2]),
    e,
  );
  assert.equal(r.error, null, e[1]);
  assert.ok(r.segments.length > 0);
  if (e[0] === "szescian")
    await page.screenshot({ path: "/tmp/logomocja-3d.png", fullPage: true });
}
await page.evaluate(() =>
  window.logomocja.open("powtorz 4 [np 100 pw 90]", "2d"),
);
const dl = page.waitForEvent("download");
await page.locator("#png").click();
assert.match((await dl).suggestedFilename(), /\.png$/);
await page.locator("#editor").fill("np 42");
await page.locator("#all-examples").click();
await page.locator('#modal [data-example="gwiazda"]').click();
assert.equal(await page.locator("#editor").inputValue(), examples[1][4]);
await page.locator("#history").click();
assert.ok((await page.locator("[data-history]").count()) > 0);
await page.locator('[data-history="0"]').click();
assert.equal(await page.locator("#editor").inputValue(), "np 42");
await page.locator("#share").click();
const shared = await page.locator("#share-url").inputValue();
await page.locator("#modal-close").click();
await page.goto(shared);
await page.waitForFunction(
  () => window.logomocja && document.querySelector("#editor").value === "np 42",
);
assert.equal(await page.locator("#segment-count").textContent(), "1 odcinek");
await page.locator("#tasks-nav").click();
await page.locator('[data-challenge="0"]').click();
await page.locator("#editor").fill("powtorz 4 [np 100 pw 90]");
await page.locator("#check-challenge").click();
assert.match(await page.locator("#challenge-result").textContent(), /Udało/);
await page.locator("#editor").fill("np 10\nnp 2 / 0");
await page.locator("#speed").fill("100");
await page.locator("#run").click();
await page.waitForFunction(() => !document.querySelector("#error").hidden);
assert.match(await page.locator("#error").textContent(), /Wiersz 2, kol. 4/);
assert.equal(await page.locator(".inline-error").count(), 1);
await page.evaluate(() => history.replaceState(null, "", location.pathname));
await page.locator("#editor").fill("powtorz 20 [np 1 pw 18]");
await page.locator("#step").click();
await page.locator("#step").click();
assert.equal(await page.locator("#segment-count").textContent(), "1 odcinek");
assert.ok((await page.locator(".executing").count()) > 0);
await page.reload();
assert.equal(
  await page.locator("#editor").inputValue(),
  "powtorz 20 [np 1 pw 18]",
);
await page.locator("#theme").click();
await page.locator("#theme").click();
await page.waitForTimeout(250);
await page.screenshot({ path: "/tmp/logomocja-dark.png", fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() =>
  window.logomocja.open("powtorz 12 [powtorz 4 [np 100 pw 90] pw 30]", "2d"),
);
await page.screenshot({ path: "/tmp/logomocja-mobile.png", fullPage: true });
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await page.locator("#reference-nav").click();
assert.equal(await page.locator("table tbody tr").count(), 21);
await page.locator("#modal-close").click();
// Text files round-trip without replacing the draft silently.
await page
  .locator("#file-input")
  .setInputFiles({
    name: "rysunek.logo",
    mimeType: "text/plain",
    buffer: Buffer.from("np 17 pw 90 np 9", "utf8"),
  });
await page.waitForFunction(
  () => document.querySelector("#editor").value === "np 17 pw 90 np 9",
);
assert.equal(await page.locator("#editor").inputValue(), "np 17 pw 90 np 9");
await page.locator("#file-menu").click();
const logoDownload = page.waitForEvent("download");
await page.locator("#save-logo").click();
const savedLogo = await logoDownload;
assert.match(savedLogo.suggestedFilename(), /\.logo$/);
const stream = await savedLogo.createReadStream();
let content = "";
for await (const c of stream) content += c.toString();
assert.equal(content, "np 17 pw 90 np 9");
// Every exercise accepts its target and rejects an incomplete drawing.
const targets = [
  "powtorz 4 [np 100 pw 90]",
  "powtorz 3 [np 120 pw 120]",
  "powtorz 5 [np 150 pw 144]",
  "powtorz 12 [np nrpowt * 10 pw 90]",
  "powtorz 4 [np 40 gora 90 np 25 dol 90]",
];
for (let i = 0; i < targets.length; i++) {
  await page.locator("#tasks-nav").click();
  await page.locator(`[data-challenge="${i}"]`).click();
  await page.locator("#check-challenge").click();
  assert.match(
    await page.locator("#challenge-result").textContent(),
    /jeszcze żadnej/,
  );
  await page.locator("#editor").fill(targets[i]);
  await page.locator("#check-challenge").click();
  assert.match(await page.locator("#challenge-result").textContent(), /Udało/);
}
assert.equal(
  await page.evaluate(
    () => JSON.parse(localStorage.getItem("logomocja-progress")).length,
  ),
  5,
);
await page.locator("#exit-challenge").click();
await page.locator("#mode-2d").click();
await page.locator("#editor").fill("powtorz 4 [np 10 pw 90]");
await page.locator("#speed").fill("1");
await page.locator("#run").click();
await page.waitForTimeout(350);
await page.locator("#pause").click();
const paused = await page.locator("#segment-count").textContent();
await page.waitForTimeout(350);
assert.equal(await page.locator("#segment-count").textContent(), paused);
await page.locator("#speed").fill("100");
await page.locator("#pause").click();
await page.waitForFunction(() =>
  document.querySelector("#status").textContent.startsWith("Gotowe!"),
);
assert.equal(await page.locator("#segment-count").textContent(), "4 odcinki");
await page.locator("#reset").click();
assert.equal(await page.locator("#segment-count").textContent(), "0 odcinków");
assert.equal(
  await page.locator("#editor").inputValue(),
  "powtorz 4 [np 10 pw 90]",
);
const noGL = await browser.newContext();
await noGL.addInitScript(() => {
  const old = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...a) {
    if (type.includes("webgl")) return null;
    return old.call(this, type, ...a);
  };
});
const off = await noGL.newPage();
await off.goto(base);
await off.waitForFunction(() => window.logomocja);
await off.locator("#mode-3d").click();
assert.match(await off.locator("#view-name").textContent(), /WEBGL/);
await off.locator("#mode-2d").click();
assert.match(await off.locator("#view-name").textContent(), /2D/);
assert.deepEqual(errors, []);
assert.deepEqual(network, []);
await browser.close();
console.log(
  "Browser checks passed: 13 examples, 3D, files, drafts, sharing, challenge, errors, stepping, themes, mobile, reference, WebGL fallback.",
);
