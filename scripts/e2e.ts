// Sprawdzenie w przeglądarce: uruchom z BASE_PATH=/Logomocja/builds/x/ i serwerem scripts/serve.ts.
import { chromium } from 'playwright-core';
const url = process.env.URL || 'http://localhost:4174/Logomocja/builds/x/';
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let failures = 0;
const ok = (name: string, cond: boolean, extra = '') => {
  console.log(`${cond ? 'OK  ' : 'FAIL'} ${name}${extra ? ' — ' + extra : ''}`);
  if (!cond) failures++;
};
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(url);
await page.waitForFunction(() => !!(window as any).logomocja);
ok('hook version', typeof (await page.evaluate(() => (window as any).logomocja.version)) === 'string');
const r = await page.evaluate(() => (window as any).logomocja.run('powtorz 4 [np 100 pw 90]', '2d'));
ok('hook run', r.segments.length === 4 && r.error === null);

// praca krokowa
const ta = page.locator('textarea.ed-input');
await ta.fill('np 10\npw 90\nnp 20\nnp 30');
await page.click('[data-act="step"]');
await page.click('[data-act="step"]');
const execVisible = await page.locator('.ed-band-exec').isVisible();
const status1 = await page.locator('.status').innerText();
ok('step highlights line', execVisible, status1);
await page.keyboard.press('F10');
await page.keyboard.press('F10');
const status2 = await page.locator('.status').innerText();
ok('step to end', /Gotowe: 3 odcinki/.test(status2), status2);

// pauza / wznowienie przy wolnym tempie
await page.locator('[data-el="speed"]').fill('1');
await ta.fill('powtorz 20 [np 10 pw 18]');
await page.click('[data-act="run"]');
await page.waitForTimeout(700);
ok('running state', (await page.locator('.studio').getAttribute('data-state')) === 'running');
await page.click('[data-act="pause"]');
ok('paused state', (await page.locator('.studio').getAttribute('data-state')) === 'paused');
ok('pause button says Wznów', (await page.locator('[data-act="pause"]').innerText()).includes('Wznów'));
await page.click('[data-act="pause"]');
ok('resumed', (await page.locator('.studio').getAttribute('data-state')) === 'running');
// edycja w trakcie
await ta.press('End');
await ta.type(' ');
ok('edit stops run', (await page.locator('.studio').getAttribute('data-state')) === 'stopped', await page.locator('.status').innerText());
// reset klawiszem Esc
await page.keyboard.press('Escape');
ok('reset via Esc', (await page.locator('.studio').getAttribute('data-state')) === 'idle');
await page.locator('[data-el="speed"]').fill('6');

// błąd wykonania zostawia rysunek, błąd zapisu nic nie rysuje
await ta.fill('np 10\nniech z 0\nnp 1 / z');
await page.keyboard.press('Control+Enter');
await page.waitForTimeout(100);
ok('runtime error marker', await page.locator('.ed-lens').isVisible() && (await page.locator('.caption').innerText()).includes('1 odcinek'), await page.locator('.caption').innerText());
await ta.fill('np 10\nnp 1 / z');
await page.keyboard.press('Control+Enter');
await page.waitForTimeout(100);
ok('parse error shows status', (await page.locator('.status').innerText()).includes('Wiersz 2'), await page.locator('.status').innerText());

// przykład nie niszczy szkicu
await ta.fill('; mój szkic\nnp 42');
await page.waitForTimeout(400);
await page.evaluate(() => (location.hash = '#/przyklady'));
await page.click('a[href="#/przyklady/gwiazda"]');
await page.waitForTimeout(300);
ok('example loaded', (await ta.inputValue()).includes('Sekret gwiazdy'));
const toastText = await page.locator('.toast').first().innerText();
ok('stash toast', toastText.includes('schowku'), toastText);
await page.locator('.toast button', { hasText: 'Przywróć' }).click();
ok('restore draft', (await ta.inputValue()).includes('mój szkic'));

// trwałość po odświeżeniu
await page.reload();
await page.waitForFunction(() => !!(window as any).logomocja);
ok('draft persists', (await page.locator('textarea.ed-input').inputValue()).includes('mój szkic'));

// tryb 3D i szkic osobny dla trybu
await page.locator('.seg label', { hasText: '3D' }).click();
await page.waitForTimeout(500);
ok('3D canvas', await page.locator('.view-3d canvas').isVisible());
ok('3D draft separate', !(await page.locator('textarea.ed-input').inputValue()).includes('mój szkic'));

// link
await page.click('[data-act="link"]');
await page.waitForTimeout(400);
const href = await page.locator('[data-el="linkInput"]').inputValue();
ok('permalink built', href.includes('#/p?tryb=3d&kod='), href.slice(0, 90));
await page.keyboard.press('Escape');
const p2 = await ctx.newPage();
await p2.goto(href);
await p2.waitForFunction(() => !!(window as any).logomocja);
await p2.waitForTimeout(800);
ok('permalink opens in 3D', (await p2.locator('.studio').getAttribute('data-mode')) === '3d' && (await p2.locator('textarea.ed-input').inputValue()).length > 0);
ok('permalink ran', ['done', 'running'].includes((await p2.locator('.studio').getAttribute('data-state')) || ''), await p2.locator('.status').innerText());
await p2.close();

// pobieranie
const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="save"]')]);
ok('download .logo', dl.suggestedFilename().endsWith('.logo'), dl.suggestedFilename());
await page.click('[data-act="run"]');
await page.waitForTimeout(300);
const [png] = await Promise.all([page.waitForEvent('download'), page.click('[data-act="png"]')]);
const pngPath = await png.path();
ok('download png', png.suggestedFilename().endsWith('.png') && (await Bun.file(pngPath!).size) > 1000, png.suggestedFilename());

// otwieranie pliku
await page.locator('[data-el="file"]').setInputFiles({ name: 'test.logo', mimeType: 'text/plain', buffer: Buffer.from('gora 45\nnp 50') });
await page.waitForTimeout(300);
ok('open .logo', (await page.locator('textarea.ed-input').inputValue()).includes('gora 45'));

// zadanie
await page.evaluate(() => (location.hash = '#/zadania/trojkat'));
await page.waitForTimeout(300);
await page.locator('textarea.ed-input').fill('powtorz 3 [np 100 lw 120]');
await page.click('[data-task="check"]');
ok('task fail reason', (await page.locator('.verdict').innerText()).includes('Jeszcze nie'));
await page.locator('textarea.ed-input').fill('powtorz 3 [np 100 pw 120]');
await page.click('[data-task="check"]');
ok('task pass', (await page.locator('.verdict').innerText()).includes('Zaliczone'));
await page.evaluate(() => (location.hash = '#/zadania'));
await page.waitForTimeout(200);
ok('progress saved', (await page.locator('.progress').innerText()).includes('1'), await page.locator('.progress').innerText());

// odświeżenie na trasie pod ścieżką bazową
await page.evaluate(() => (location.hash = '#/pomoc/procedury'));
await page.reload();
await page.waitForTimeout(500);
ok('refresh on help route', await page.locator('#h-procedury').isVisible());
ok('no console errors', errors.length === 0, errors.join(' | '));
await ctx.close();

// bez WebGL
const noGl = await chromium.launch({ args: ['--disable-webgl', '--disable-3d-apis'] });
const p3 = await noGl.newPage();
await p3.goto(url);
await p3.waitForFunction(() => !!(window as any).logomocja);
const res = await p3.evaluate(() => (window as any).logomocja.open('gora 90 np 50 pw 90 np 50', '3d'));
ok('no-webgl open works', res.segments.length === 2 && res.error === null);
ok('no-webgl notice', (await p3.locator('.notice').innerText()).includes('WebGL'), await p3.locator('.notice').innerText());
await p3.evaluate(() => (window as any).logomocja.open('np 50', '2d'));
ok('2D still works without webgl', await p3.locator('.view-2d:not([hidden]) canvas').first().isVisible());
await noGl.close();
await browser.close();
console.log(failures ? `${failures} FAILED` : 'ALL OK');
process.exit(failures ? 1 : 0);
