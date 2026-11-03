// Zrzuty ekranu i szybkie sprawdzenie w prawdziwej przeglądarce (chromium z playwright-core).
import { chromium } from 'playwright-core';
const url = process.env.URL || 'http://localhost:4173/';
const out = process.env.OUT || '.impeccable/review/tmp';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const shots = (process.env.SHOTS || 'desktop').split(',');
for (const kind of shots) {
  const mobile = kind.startsWith('mobile');
  const dark = kind.includes('dark');
  const ctx = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 }, deviceScaleFactor: mobile ? 2 : 1, colorScheme: dark ? 'dark' : 'light', hasTouch: mobile });
  const page = await ctx.newPage();
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => !!(window as any).logomocja);
  const steps = (process.env.STEPS || 'studio').split(',');
  for (const step of steps) {
    const [name, arg, mode] = step.split(':');
    if (name === 'studio') {
      await page.evaluate(() => (location.hash = '#/pracownia'));
    } else if (name === 'open') {
      const { EXAMPLES } = await import('../src/examples');
      const ex = EXAMPLES.find((e) => e.id === arg)!;
      const r = await page.evaluate(([s, m]) => (window as any).logomocja.open(s, m), [ex.source, ex.mode]);
      console.log(kind, 'open', arg, r.segments.length, JSON.stringify(r.error));
    } else if (name === 'code') {
      const r = await page.evaluate(([s, m]) => (window as any).logomocja.open(s, m), [decodeURIComponent(arg), mode || '2d']);
      console.log(kind, 'code', r.segments.length, JSON.stringify(r.error));
    } else if (name === 'hash') {
      await page.evaluate((h) => (location.hash = h), decodeURIComponent(arg));
    } else if (name === 'wait') {
      await page.waitForTimeout(Number(arg));
    } else if (name === 'click') {
      await page.click(decodeURIComponent(arg));
    } else if (name === 'key') {
      await page.keyboard.press(arg);
    } else if (name === 'shot') {
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${out}/${kind}-${arg}.png`, fullPage: mode === 'full' });
    }
  }
  if (errors.length) console.log(kind, 'ERRORS', errors);
  await ctx.close();
}
await browser.close();
