import { chromium } from "@playwright/test";
import { examples } from "../src/examples.js";
const b = await chromium.launch({ args: ["--no-sandbox"] });
const p = await b.newPage({ viewport: { width: 1440, height: 1080 } });
await p.goto(process.env.TEST_URL || "http://localhost:5173/");
await p.waitForFunction(() => window.logomocja);
console.log(
  await p.evaluate(() =>
    [1000, 4000].map((n) => [
      n,
      window.logomocja.run("np " + "(".repeat(n) + "1" + ")".repeat(n), "2d")
        .error,
      window.logomocja.run("np " + Array(n).fill("1").join("+"), "2d").error,
    ]),
  ),
);
await p.evaluate((e) => window.logomocja.open(e.source, e.mode), examples[8]);
await p.screenshot({ path: ".impeccable/review/3d.png", fullPage: true });
await p.locator('[data-page="challenges"]').click();
await p.waitForTimeout(200);
await p.screenshot({
  path: ".impeccable/review/challenges.png",
  fullPage: true,
});
await p.locator('[data-page="reference"]').click();
await p.screenshot({
  path: ".impeccable/review/reference.png",
  fullPage: true,
});
await b.close();
