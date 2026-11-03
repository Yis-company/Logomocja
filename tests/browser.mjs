import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  acceptDownloads: true,
});
const errors = [],
  external = [];
page.on("pageerror", (e) => {
  errors.push(e.message);
  console.log("PAGE ERROR", e.message);
});
page.on("request", (r) => {
  if (
    !r.url().startsWith("http://localhost:") &&
    !r.url().startsWith("http://127.0.0.1:") &&
    !r.url().startsWith("data:")
  )
    external.push(r.url());
});
const url = process.env.APP_URL || "http://localhost:5173/";
await mkdir(".impeccable/review", { recursive: true });
try {
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  assert.equal(await page.evaluate(() => window.logomocja.version), "1.0.0");
  assert.equal(
    await page.evaluate(
      () => window.logomocja.run("np 10", "2d").segments.length,
    ),
    1,
  );
  await page.screenshot({
    path: ".impeccable/review/desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(250);
  assert.equal(
    await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    true,
  );
  await page.screenshot({
    path: ".impeccable/review/mobile.png",
    fullPage: true,
  });
  await page.locator("#theme").click();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: ".impeccable/review/mobile-dark.png",
    fullPage: true,
  });
  await page.locator("#theme").click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#code").fill("np 77");
  await page.getByRole("button", { name: "Przykłady 13" }).click();
  assert.equal(await page.locator(".library-item").count(), 13);
  await page.locator('.library-item[data-example="szescian"]').click();
  assert.equal(await page.locator("#viewname").textContent(), "Przestrzeń 3D");
  await page.locator("#pan3d").click();
  assert.equal(
    await page.locator("#pan3d").getAttribute("aria-pressed"),
    "true",
  );
  await page.locator("canvas").focus();
  await page.keyboard.press("Alt+ArrowRight");
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(150);
  await page.screenshot({
    path: ".impeccable/review/three-dimensional.png",
    fullPage: true,
  });
  await page.locator('[data-mode="2d"]').click();
  assert.equal(await page.locator("#code").inputValue(), "np 77");
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("#code").inputValue(), "np 77");
  await page.evaluate(() =>
    window.logomocja.open("np 10\nniech x 0 np 1 / x", "2d"),
  );
  assert.match(
    await page.locator("#error").textContent(),
    /Wiersz 2, kolumna 14/,
  );
  assert.equal(await page.locator(".error-token").count(), 1);
  await page.evaluate(() => window.logomocja.open("np 80 pw 90 np 50", "2d"));
  await page.locator("#share").click();
  const shared = page.url();
  assert.ok(shared.includes("#program="));
  await page.goto(url);
  await page.goto(shared);
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("#code").inputValue(), "np 80 pw 90 np 50");
  assert.match(await page.locator("#stats").textContent(), /2 odcink/);
  let dl = page.waitForEvent("download");
  await page.locator("#savefile").click();
  assert.ok((await dl).suggestedFilename().endsWith(".logo"));
  dl = page.waitForEvent("download");
  await page.locator("#png").click();
  assert.equal((await dl).suggestedFilename(), "logomocja.png");
  await page
    .locator("#file")
    .setInputFiles({
      name: "test.logo",
      mimeType: "text/plain",
      buffer: Buffer.from("np 33"),
    });
  await page.waitForFunction(
    () => document.querySelector("#code").value === "np 33",
  );
  await page.locator("#code").fill("np 10 pw 90 np 10");
  await page.locator("#step").click();
  assert.match(await page.locator("#stats").textContent(), /^1 odcink/);
  assert.equal(await page.locator(".executing").count(), 1);
  await page.locator("#code").fill("powtorz 100 [np 1 pw 1]");
  await page.locator("#speed").fill("1");
  await page.locator("#run").click();
  await page.waitForTimeout(100);
  await page.locator("#pause").click();
  const paused = await page.locator("#stats").textContent();
  await page.waitForTimeout(200);
  assert.equal(await page.locator("#stats").textContent(), paused);
  await page.locator("#pause").click();
  await page.locator("#code").fill("np 22");
  await page.waitForTimeout(150);
  assert.equal(await page.locator("#code").inputValue(), "np 22");
  await page.locator("#reset").click();
  assert.match(await page.locator("#stats").textContent(), /^0 odcink/);
  await page.getByRole("button", { name: "Wyzwania", exact: true }).click();
  await page.locator('[data-task="0"]').click();
  await page.locator("#code").fill("np 10");
  await page.locator("#check").click({ timeout: 3000 });
  assert.match(await page.locator("#feedback").textContent(), /Jeszcze nie/);
  await page.locator("#code").fill("powtorz 4 [np 100 pw 90]");
  await page.locator("#check").click();
  assert.match(await page.locator("#feedback").textContent(), /Brawo/);
  assert.deepEqual(
    await page.evaluate(() => JSON.parse(localStorage.getItem("progress"))),
    [0],
  );
  await page
    .getByRole("button", { name: "Słownik poleceń", exact: true })
    .click();
  assert.equal(await page.locator(".command-table article").count(), 19);
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  console.log(
    "Browser checks passed: desktop/mobile, themes, hook, 3D, drafts, errors, sharing, files, stepping, pause, reset, challenges, reference, zero external requests.",
  );
} catch (e) {
  console.log(
    "DEBUG",
    await page.evaluate(() => ({
      fonts: [...document.fonts].map((f) => [f.family, f.status]),
      studio: document.querySelector("#studio").hidden,
      check: document.querySelector("#check")?.getBoundingClientRect().toJSON(),
    })),
  );
  await page.screenshot({ path: "/tmp/browser-failure.png", fullPage: true });
  throw e;
} finally {
  await browser.close();
}
