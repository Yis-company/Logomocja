import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import assert from "node:assert/strict";
const base = process.env.BASE_PATH || "/";
const server = Bun.serve({
  port: 0,
  async fetch(req) {
    let path = new URL(req.url).pathname;
    if (!path.startsWith(base))
      return new Response("Not found", { status: 404 });
    path = path.slice(base.length) || "index.html";
    const file = Bun.file(resolve("dist", path));
    if (!(await file.exists()))
      return new Response("Not found", { status: 404 });
    return new Response(file);
  },
});
const url = `http://localhost:${server.port}${base}`;
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
  });
  const errors: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (req) => requests.push(req.url()));
  await page.goto(url);
  await page.waitForFunction(
    () =>
      window.logomocja &&
      document.querySelector("#stats")?.textContent?.includes("144 odcinków"),
  );
  await page.screenshot({ path: "/tmp/logomocja-desktop.png", fullPage: true });
  assert.equal(
    await page.evaluate(() => typeof window.logomocja.version),
    "string",
  );
  const code = page.locator("#editor");
  await code.fill("np 10 pw 90 np 20");
  await page.locator("#step").click();
  assert.match(await page.locator("#stats").innerText(), /1 odcinków/);
  await page.locator("#run").click();
  await page.waitForFunction(() =>
    document.querySelector("#status")?.textContent?.startsWith("Gotowe."),
  );
  assert.match(await page.locator("#stats").innerText(), /2 odcinków/);
  await code.fill("repeat 1000 [np 1 pw 5]");
  await page.locator("#run").click();
  await page.waitForTimeout(100);
  await page.locator("#run").click();
  assert.match(await page.locator("#status").innerText(), /Pauza/);
  await page.locator("#run").click();
  await code.fill("np 7");
  assert.match(await page.locator("#status").innerText(), /Kod zmieniony/);
  assert.match(await page.locator("#run").innerText(), /Uruchom/);
  await page.reload();
  assert.equal(await code.inputValue(), "np 7");
  await page.locator("#reset").click();
  assert.match(await page.locator("#stats").innerText(), /0 odcinków/);
  await code.fill("np 10\n  niewiadoma");
  await page.locator("#run").click();
  assert.match(await page.locator("#error").innerText(), /Linia 2, kolumna 3/);
  assert.match(await page.locator("#stats").innerText(), /0 odcinków/);
  assert.equal(await page.locator("#mode3d").isDisabled(), false);
  await page.locator('[data-example="3"]').click();
  await page.waitForFunction(
    () =>
      document.querySelector("#mode3d")?.getAttribute("aria-pressed") ===
      "true",
  );
  assert.equal(await page.locator(".three-canvas").isVisible(), true);
  assert.equal(await page.locator("#error").isVisible(), false);
  await page.screenshot({ path: "/tmp/logomocja-3d.png", fullPage: true });
  const rect = await page.locator(".three-canvas").boundingBox();
  await page.mouse.move(rect!.x + rect!.width / 2, rect!.y + rect!.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    rect!.x + rect!.width / 2 + 60,
    rect!.y + rect!.height / 2 + 40,
  );
  await page.mouse.up();
  await page.locator("#help-link").click();
  assert.equal(await page.locator("dialog").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").isVisible(), false);
  await page.locator('[data-example="0"]').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/tmp/logomocja-mobile.png", fullPage: true });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.locator("#step").click();
  await page.locator("#reset").click();
  assert.match(await page.locator("#stats").innerText(), /0 odcinków/);
  await page.setViewportSize({ width: 320, height: 700 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  const no3d = await browser.newPage();
  await no3d.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      type: any,
      ...args: any[]
    ) {
      if (
        type === "webgl" ||
        type === "webgl2" ||
        type === "experimental-webgl"
      )
        return null;
      return get.apply(this, [type, ...args] as any);
    } as any;
  });
  await no3d.goto(url);
  await no3d.waitForFunction(() => window.logomocja);
  assert.equal(await no3d.locator("#mode3d").isDisabled(), true);
  assert.match(await no3d.locator("#webgl-message").innerText(), /WebGL/);
  assert.equal(
    (await no3d.evaluate(() => window.logomocja.run("np 3", "2d"))).segments
      .length,
    1,
  );
  assert.deepEqual(errors, []);
  assert.equal(
    requests.every(
      (r) =>
        r.startsWith(`http://localhost:${server.port}/`) ||
        r.startsWith("data:"),
    ),
    true,
  );
  console.log(
    "Browser checks passed: API, stepping, pause/resume, editing, storage, errors, 3D, camera, help, mobile, WebGL fallback, local assets.",
  );
} finally {
  await browser.close();
  server.stop();
}
