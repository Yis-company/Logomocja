import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { examples } from "../src/examples.ts";

// Serve only real static files, with no SPA rewrites, at the path embedded by Vite.
const html = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const asset = html.match(/src="([^"]+assets\/[^\"]+)"/)[1];
const base = asset.slice(0, asset.indexOf("assets/"));
const mime = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(
    new URL(req.url, "http://localhost").pathname,
  );
  if (!path.startsWith(base) || path.includes("..")) {
    res.writeHead(404);
    res.end();
    return;
  }
  const file = path.slice(base.length) || "index.html";
  try {
    const bytes = await readFile(new URL("../dist/" + file, import.meta.url));
    res.setHeader(
      "Content-Type",
      mime["." + file.split(".").pop()] || "application/octet-stream",
    );
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`,
  url = origin + base;
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const errors = [],
  external = [];
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
context.on("page", (p) => {
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("request", (r) => {
    if (
      !r.url().startsWith(origin) &&
      !r.url().startsWith("data:") &&
      !r.url().startsWith("blob:")
    )
      external.push(r.url());
  });
});
const page = await context.newPage();
const click = (action) =>
  page.locator(`[data-action="${action}"]`).first().click();
const wait = (fn) => page.waitForFunction(fn);
const stat = () => page.locator("#segment-count").innerText();
async function loaded(p = page) {
  await p.waitForFunction(() => window.logomocja);
  await p.evaluate(() => document.fonts.ready);
}
async function open(source, mode = "2d") {
  return page.evaluate(
    ({ source, mode }) => window.logomocja.open(source, mode),
    { source, mode },
  );
}
try {
  await mkdir(new URL("../.playwright", import.meta.url), { recursive: true });
  await page.goto(url);
  await loaded();
  assert.equal(await stat(), "48 odcinków");
  await page.screenshot({
    path: ".playwright/studio-desktop.png",
    fullPage: true,
  });
  const original = await page.locator("#editor").inputValue();
  assert.equal(
    (await page.evaluate(() => window.logomocja.run("np 20 - 5 - 3", "2d")))
      .segments[0].to[1],
    12,
  );
  assert.equal(await page.locator("#editor").inputValue(), original);
  for (const example of examples) {
    const r = await open(example.source, example.mode);
    assert.equal(r.error, null, example.id);
    assert.ok(r.segments.length > 0, example.id);
  }
  await open(examples.find((x) => x.id === "szescian").source, "3d");
  assert.equal(await page.locator("#webgl-warning").isVisible(), false);
  await page.screenshot({ path: ".playwright/studio-3d.png", fullPage: true });
  await click("orbit-left");
  await click("orbit-up");
  await click("zoom-in");
  await click("camera-reset");
  await open(examples[2].source);
  await click("theme");
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  await page.screenshot({
    path: ".playwright/studio-dark.png",
    fullPage: true,
  });
  await click("theme");
  await open("np 10\nnp 5 / 0");
  assert.equal(await stat(), "1 odcinek");
  assert.match(
    await page.locator("#error-message").innerText(),
    /Wiersz 2, kolumna 4/,
  );
  assert.equal(await page.locator(".error-token").count(), 1);
  await open("np 10\nnp 10 -5");
  assert.equal(await stat(), "0 odcinków");
  await page.locator("#editor").fill("np 10\npw 90\nnp 20");
  await click("reset");
  await click("step");
  assert.equal(await stat(), "1 odcinek");
  assert.equal(await page.locator("#execution-line").isVisible(), true);
  await click("step");
  await click("step");
  assert.equal(await stat(), "2 odcinków");
  await page.locator("#editor").fill("powtorz 100 [np 1 pw 4]");
  await page.locator("#speed").fill("15");
  await click("run");
  await page.waitForTimeout(150);
  await click("pause");
  assert.equal(await page.locator("#drawing-status").innerText(), "Pauza");
  await page.locator("#speed").fill("100");
  await click("pause");
  await wait(
    () =>
      document.querySelector("#drawing-status").textContent === "Narysowane",
  );
  assert.equal(await stat(), "100 odcinków");
  await page.locator("#speed").fill("10");
  await click("run");
  await page.locator("#editor").fill("np 77");
  assert.equal(
    await page.locator("#drawing-status").innerText(),
    "Zmieniono program",
  );
  await click("mode3d");
  await page.locator("#editor").fill("gora 90 np 44");
  await page.reload();
  await loaded();
  assert.equal(await page.locator("#editor").inputValue(), "gora 90 np 44");
  await click("mode2d");
  assert.equal(await page.locator("#editor").inputValue(), "np 77");
  await page.locator("#editor").fill("np 78");
  await click("choose-example");
  await page.locator('#modal [data-example="gwiazda"]').click();
  assert.match(await page.locator("#modal-title").innerText(), /Zachowaj/);
  await click("close-modal");
  assert.equal(await page.locator("#editor").inputValue(), "np 78");
  await click("choose-example");
  await page.locator('#modal [data-example="gwiazda"]').click();
  await click("confirm-load");
  assert.equal(await page.locator("#editor").inputValue(), examples[1].source);
  await click("files");
  assert.ok((await page.locator(".history-list button").count()) > 0);
  await page.locator(".history-list button").first().click();
  assert.equal(await page.locator("#editor").inputValue(), "np 78");
  await page.locator('nav [data-page="challenges"]').click();
  await page.locator('[data-challenge="linia"]').click();
  await click("check-challenge");
  assert.match(
    await page.locator("#challenge-result").innerText(),
    /Jeszcze nie ma/,
  );
  await page.locator("#editor").fill("np 100");
  await click("check-challenge");
  assert.match(
    await page.locator("#challenge-result").innerText(),
    /Udało się/,
  );
  await page.reload();
  await loaded();
  await page.locator('nav [data-page="challenges"]').click();
  assert.match(await page.locator(".progress-label").innerText(), /1 z 6/);
  await page.locator('nav [data-page="examples"]').click();
  await page.locator(".example-card").first().waitFor();
  assert.equal(await page.locator(".example-card").count(), 13);
  await page.locator('[data-filter="3d"]').click();
  assert.equal(await page.locator(".example-card").count(), 6);
  await page.locator('nav [data-page="reference"]').click();
  await page.locator("#reference-search").fill("pitchup");
  assert.equal(await page.locator(".reference-card").count(), 1);
  await page.reload();
  await loaded();
  assert.equal(await page.locator("#page-reference").isVisible(), true);
  const shared = "oto żółw ma: bok\n powtorz 4 [np bok pw 90]\njuż\nżółw 80";
  await open(shared);
  await click("share");
  const link = await page.locator("#share-url").inputValue();
  assert.ok(link.includes("#p="));
  const sharedPage = await context.newPage();
  await sharedPage.goto(link);
  await loaded(sharedPage);
  await sharedPage.waitForFunction(
    () => document.querySelector("#segment-count").textContent === "4 odcinków",
  );
  assert.equal(await sharedPage.locator("#editor").inputValue(), shared);
  await sharedPage.close();
  await click("close-modal");
  await click("files");
  let downloadEvent = page.waitForEvent("download");
  await click("download-logo");
  let download = await downloadEvent;
  assert.equal(await readFile(await download.path(), "utf8"), shared);
  downloadEvent = page.waitForEvent("download");
  await page.locator('#modal [data-action="png"]').click();
  download = await downloadEvent;
  const png = await readFile(await download.path());
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.ok(png.length > 1000);
  await page
    .locator("#file-input")
    .setInputFiles({
      name: "test.logo",
      mimeType: "text/plain",
      buffer: Buffer.from("np 123"),
    });
  await wait(() => document.querySelector("#editor").value === "np 123");
  assert.equal(await page.locator("#editor").inputValue(), "np 123");
  assert.equal(await stat(), "1 odcinek");
  await page.locator("#editor").focus();
  await page.keyboard.press("Tab");
  assert.notEqual(
    await page.evaluate(() => document.activeElement.id),
    "editor",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await open(examples[2].source);
  await page.screenshot({
    path: ".playwright/studio-mobile.png",
    fullPage: true,
  });
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["studio", "examples", "challenges", "reference"]) {
      await page.goto(url + "#" + route);
      await loaded();
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${width}: ${route} overflow`,
      );
    }
  }
  const fallback = await browser.newContext();
  await fallback.addInitScript(() => {
    const native = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/.test(type) ? null : native.call(this, type, ...args);
    };
  });
  const fp = await fallback.newPage();
  await fp.goto(url);
  await loaded(fp);
  await fp.evaluate(() => window.logomocja.open("gora 90 np 100", "3d"));
  assert.equal(await fp.locator("#webgl-warning").isVisible(), true);
  await fp.evaluate(() => window.logomocja.open("np 100", "2d"));
  assert.equal(await fp.locator("#segment-count").innerText(), "1 odcinek");
  await fallback.close();
  assert.deepEqual(external, [], "Runtime must not contact external services");
  assert.deepEqual(errors, [], "Browser errors");
  console.log(
    `PASS: static host ${base}, all 13 examples, 3D/fallback, run/step/pause, editor errors, drafts/history, challenges, routes, sharing, files/PNG, themes, keyboard, 390/320px layouts, no external requests.`,
  );
} finally {
  await browser.close();
  server.close();
}
