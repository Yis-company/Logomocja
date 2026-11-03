import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1080 },
  deviceScaleFactor: 1,
});
let errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.TEST_URL || "http://localhost:5173/");
await page.waitForTimeout(1000);
console.log(
  "ready",
  await page.evaluate(() => ({
    hook: typeof window.logomocja,
    canvas: document.querySelector("#drawing").width,
    overflow: document.documentElement.scrollWidth > innerWidth,
  })),
  errors,
);
await page.screenshot({
  path: ".impeccable/review/desktop.png",
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
await page.screenshot({
  path: ".impeccable/review/mobile.png",
  fullPage: true,
});
console.log(
  "mobile overflow",
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
);
await browser.close();
