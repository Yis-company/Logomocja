import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { examples } from "../src/examples.js";
const base = process.env.BASE_PATH || "/";
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (!path.startsWith(base)) throw Error();
    const file = resolve("dist", path.slice(base.length) || "index.html");
    if (!file.startsWith(resolve("dist") + "/")) throw Error();
    res.setHeader(
      "Content-Type",
      { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" }[
        extname(file)
      ] || "application/octet-stream",
    );
    res.end(await readFile(file));
  } catch {
    res.statusCode = 404;
    res.end("Not found");
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${server.address().port}${base}`;
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
      viewport: { width: 1440, height: 1050 },
    }),
    page = await context.newPage();
  const errors = [],
    requests = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => requests.push(r.url()));
  await page.goto(url);
  await page.waitForFunction(() => window.logomocja?.version);
  assert.equal(
    await page.locator("#segment-count").textContent(),
    "48 odcinków",
  );
  await page.screenshot({ path: "/tmp/logomocja-desktop.png", fullPage: true });
  for (const example of examples) {
    const result = await page.evaluate(
      async (e) => window.logomocja.open(e.source, e.mode),
      example,
    );
    assert.equal(result.error, null, example.id);
    assert(result.segments.length > 0);
    assert.equal(await page.locator("#source").inputValue(), example.source);
  }
  await page.screenshot({ path: "/tmp/logomocja-3d.png", fullPage: true });
  const before = await page.locator("#source").inputValue();
  await page.evaluate(() => window.logomocja.run("np 5", "2d"));
  assert.equal(await page.locator("#source").inputValue(), before);
  await page.evaluate(() => window.logomocja.open("np 10\nnp 1 / 0", "2d"));
  assert.match(
    await page.locator("#error-detail").textContent(),
    /Linia 2, kolumna 4/,
  );
  assert.equal(await page.locator(".error-pointer").count(), 1);
  await page.locator("#source").fill("np 5\nnp 5");
  await page.locator("#step").click();
  assert.equal(
    await page.locator("#segment-count").textContent(),
    "1 odcinków",
  );
  await page.locator("#step").click();
  assert.equal(
    await page.locator("#segment-count").textContent(),
    "2 odcinków",
  );
  await page.locator("#source").fill("powtorz 100 [np 2 pw 3]");
  await page.locator("#speed").fill("1");
  await page.locator("#run").click();
  await page.waitForTimeout(400);
  await page.locator("#pause").click();
  const paused = await page.locator("#segment-count").textContent();
  await page.waitForTimeout(400);
  assert.equal(await page.locator("#segment-count").textContent(), paused);
  await page.locator("#pause").click();
  await page.waitForTimeout(800);
  assert.notEqual(await page.locator("#segment-count").textContent(), paused);
  await page.locator("#source").fill("np 17");
  assert.match(await page.locator("#execution-status").textContent(), /Edycja/);
  await page.reload();
  assert.equal(await page.locator("#source").inputValue(), "np 17");
  await page.locator('[data-page="examples"]').first().click();
  await page.locator('#example-grid [data-example="gwiazda"]').click();
  await page.locator("#files").click();
  assert.match(await page.locator(".history-list").textContent(), /Mój szkic/);
  await page.locator("#close-dialog").click();
  await page.locator("#share").click();
  const share = await page.locator("#share-url").inputValue();
  await page.locator("#close-dialog").click();
  const shared = await context.newPage();
  await shared.goto(share);
  await shared.waitForFunction(() => window.logomocja?.version);
  assert.equal(
    await shared.locator("#source").inputValue(),
    examples[1].source,
  );
  assert.equal(
    await shared.locator("#segment-count").textContent(),
    "5 odcinków",
  );
  await shared.close();
  await page.locator('[data-page="tasks"]').click();
  await page.locator('[data-task="square"]').click();
  await page.locator("#source").fill("np 100");
  await page.locator("#check-task").click();
  assert.match(await page.locator("#task-result").textContent(), /Brakuje 3/);
  await page.locator("#source").fill("powtorz 4 [np 100 pw 90]");
  await page.locator("#check-task").click();
  assert.match(await page.locator("#task-result").textContent(), /Brawo/);
  await page.reload();
  await page.locator('[data-page="tasks"]').click();
  assert.match(await page.locator("#progress-label").textContent(), /1 z 6/);
  await page.locator('[data-page="studio"]').first().click();
  const dl = page.waitForEvent("download");
  await page.locator("#png").click();
  assert.match((await dl).suggestedFilename(), /\.png$/);
  await page.locator("#files").click();
  const fileDl = page.waitForEvent("download");
  await page.locator("#save-file").click();
  assert.match((await fileDl).suggestedFilename(), /\.logo$/);
  await page
    .locator("#file-input")
    .setInputFiles({
      name: "test.logo",
      mimeType: "text/plain",
      buffer: Buffer.from('kolor "#abcdef"\nnp 123'),
    });
  await page.waitForFunction(
    () => document.querySelector("#source").value === 'kolor "#abcdef"\nnp 123',
  );
  await page.locator("#theme").click();
  await page.locator("#theme").click();
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.screenshot({ path: "/tmp/logomocja-dark.png", fullPage: true });
  const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    }),
    phone = await mobile.newPage();
  await phone.goto(url);
  await phone.waitForFunction(() => window.logomocja?.version);
  assert.equal(
    await phone.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await phone.screenshot({ path: "/tmp/logomocja-phone.png", fullPage: true });
  await phone.locator('[data-page="reference"]').click();
  assert.equal(
    await phone.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await context.setOffline(true);
  await page.evaluate(() =>
    window.logomocja.open("gora 90 np 100 pw 90 np 50", "3d"),
  );
  assert.equal(
    await page.locator("#segment-count").textContent(),
    "2 odcinków",
  );
  assert.deepEqual(errors, []);
  assert(requests.every((r) => r.startsWith(url)));
  console.log(
    "Browser checks passed: 13 examples, API isolation, errors, step/pause/edit, persistence, history, permalink, challenges, files, PNG, dark mode, phone, offline; base=" +
      base,
  );
} finally {
  await browser.close();
  server.close();
}
