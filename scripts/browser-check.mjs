import { chromium, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import assert from 'node:assert/strict';
import { examples } from '../src/examples.ts';

// A deliberately plain static host: only existing files, with no route rewrites.
const base = process.env.BASE_PATH || '/';
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base)) throw Error('Outside base');
    const relative = pathname.slice(base.length) || 'index.html';
    const filename = resolve('dist', relative);
    if (!filename.startsWith(resolve('dist') + '/')) throw Error('Outside dist');
    res.setHeader('Content-Type', mime[extname(filename)] || 'application/octet-stream');
    res.end(await readFile(filename));
  } catch { res.statusCode = 404; res.end('Not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`, url = origin + base;
await mkdir('artifacts', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, colorScheme: 'light', acceptDownloads: true });
const page = await context.newPage(), errors = [], external = [];
context.on('page', p => p.on('pageerror', e => errors.push(e.message)));
page.on('pageerror', e => errors.push(e.message));
context.on('request', req => { if (!req.url().startsWith(origin) && !req.url().startsWith('blob:') && !req.url().startsWith('data:')) external.push(req.url()); });
const opened = (source, mode = '2d') => page.evaluate(([s, m]) => window.logomocja.open(s, m), [source, mode]);
const renderReady = () => page.evaluate(async () => { await document.fonts.ready; await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); });
try {
  await page.goto(url);
  await page.waitForFunction(() => window.logomocja);
  await renderReady();
  await page.screenshot({ path: 'artifacts/studio-desktop.png', fullPage: true });
  const initial = await page.locator('#code-input').inputValue();
  const pure = await page.evaluate(() => window.logomocja.run('np 10 pw 90 np 20', '2d'));
  assert.equal(pure.error, null); assert.deepEqual(pure.segments[1].to, [20, 10, 0]);
  assert.equal(await page.locator('#code-input').inputValue(), initial);
  for (const example of examples) {
    const result = await opened(example.source, example.mode);
    assert.equal(result.error, null, example.name);
    assert(result.segments.length > 0, example.name);
    assert.equal(await page.locator('#code-input').inputValue(), example.source);
    await page.screenshot({ path: `artifacts/example-${example.id}.png`, fullPage: false });
  }
  console.log('✓ All 13 examples, public run/open hook, rendered screenshots');

  await opened('np 10\nnp 1 / 0');
  await expect(page.locator('#error-message')).toContainText('Wiersz 2, kolumna 4');
  await expect(page.locator('.has-error')).toHaveCount(1);
  await expect(page.locator('.error-pin')).toHaveCount(1);
  await expect(page.locator('#segment-count')).toHaveText('1 odcinek');
  await opened('np 10\nnieznane');
  await expect(page.locator('#segment-count')).toHaveText('0 odcinków');
  const deep = await page.evaluate(() => window.logomocja.run('np ' + '-'.repeat(9000) + '1', '2d'));
  assert.equal(deep.error, null);
  await page.locator('#code-input').fill('np 10\npw 90\nnp 20');
  await page.keyboard.press('F10'); await expect(page.locator('#segment-count')).toHaveText('1 odcinek');
  await expect(page.locator('.executing')).toHaveCount(1);
  await page.keyboard.press('F10'); await expect(page.locator('#segment-count')).toHaveText('1 odcinek');
  await page.keyboard.press('F10'); await expect(page.locator('#segment-count')).toHaveText('2 odcinków');
  await page.keyboard.press('Shift+Escape'); await expect(page.locator('#segment-count')).toHaveText('0 odcinków');
  await page.locator('#code-input').fill('powtorz 100 [np 1 pw 3]');
  await page.locator('#speed').fill('1');
  await page.keyboard.press('Control+Enter');
  await expect(page.locator('#run')).toBeDisabled();
  await page.keyboard.press('F8'); await expect(page.locator('#execution-status')).toContainText('Pauza');
  await page.keyboard.press('F8'); await expect(page.locator('#run')).toBeDisabled();
  await page.locator('#code-input').fill('np 17');
  await expect(page.locator('#run')).toBeEnabled(); await expect(page.locator('#pause')).toBeDisabled();
  await expect(page.locator('#execution-status')).toContainText('Zmieniono');
  console.log('✓ Parse/runtime errors, long expressions, step, pause, resume, reset, editing');

  await page.locator('#mode-3d').click(); await page.locator('#code-input').fill('gora 90 np 31');
  await page.reload(); await expect(page.locator('#code-input')).toHaveValue('gora 90 np 31');
  await page.locator('#mode-2d').click(); await expect(page.locator('#code-input')).toHaveValue('np 17');
  await page.locator('[data-page="examples"]').click();
  await page.locator('#example-library [data-example="kwadrat"]').click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('logomocja:history')));
  assert(saved.some(d => d.source === 'np 17' && d.mode === '2d'));
  await page.locator('#history').click(); await expect(page.locator('.history-item')).not.toHaveCount(0); await page.locator('#close-dialog').click();
  await page.locator('[data-page="challenges"]').click(); await page.locator('[data-challenge="square"]').click();
  await page.locator('#code-input').fill('np 4'); await page.locator('#check-challenge').click(); await expect(page.locator('#challenge-result')).toHaveClass('challenge-fail');
  await page.locator('#code-input').fill('powtorz 4 [np 100 pw 90]'); await page.locator('#check-challenge').click(); await expect(page.locator('#challenge-result')).toHaveClass('challenge-pass');
  await page.reload(); await page.locator('[data-page="challenges"]').click(); await expect(page.locator('#progress-label')).toContainText('1 / 6');
  console.log('✓ Both mode drafts, archived drafts, challenge failure/pass and persistent progress');

  const sharedSource = '; Zażółć gęślą jaźń\nkolor "#ABCDEF"\nnp 42';
  await opened(sharedSource);
  await page.locator('#share').click(); const permalink = await page.locator('#share-url').inputValue();
  assert(permalink.startsWith(url + '#p=')); await page.locator('#close-dialog').click();
  const recipient = await context.newPage(); await recipient.goto(permalink); await expect(recipient.locator('#code-input')).toHaveValue(sharedSource); await expect(recipient.locator('#segment-count')).toHaveText('1 odcinek'); await recipient.close();
  const programDownload = page.waitForEvent('download'); await page.locator('#save-file').click();
  const program = await programDownload; assert(program.suggestedFilename().endsWith('.logo'));
  await program.saveAs('artifacts/download.logo'); assert.equal(await readFile('artifacts/download.logo', 'utf8'), sharedSource);
  await page.locator('#file-input').setInputFiles({ name: 'własny.logo', mimeType: 'text/plain', buffer: Buffer.from('np 23 pw 90 np 11') });
  await expect(page.locator('#code-input')).toHaveValue('np 23 pw 90 np 11');
  await expect(page.locator('#segment-count')).toHaveText('2 odcinków');
  const imageDownload = page.waitForEvent('download'); await page.locator('#export-png').click();
  const image = await imageDownload; await image.saveAs('artifacts/export.png');
  assert.equal((await readFile('artifacts/export.png')).subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  console.log('✓ Unicode permalinks, automatic playback, .logo import/download, PNG export');

  const canvasImage = () => page.locator('#drawing').evaluate(c => c.toDataURL());
  const beforePan = await canvasImage(); await page.locator('#drawing').focus(); await page.keyboard.press('ArrowRight'); assert.notEqual(await canvasImage(), beforePan);
  await page.keyboard.press('+'); assert.notEqual(await canvasImage(), beforePan);
  await opened(examples.find(e => e.id === 'szescian').source, '3d');
  const beforeOrbit = await canvasImage(); await page.locator('#drawing').focus(); await page.keyboard.press('Shift+ArrowLeft'); assert.notEqual(await canvasImage(), beforeOrbit);
  await page.locator('#camera-reset').click();
  await page.locator('#theme').click(); await page.locator('#theme').click(); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.screenshot({ path: 'artifacts/studio-dark-3d.png', fullPage: true });
  await page.locator('#theme').click(); await page.emulateMedia({ colorScheme: 'dark' }); await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' }); await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await context.setOffline(true);
  await page.locator('[data-page="examples"]').click(); await page.locator('#example-library [data-example="helisa"]').click(); await expect(page.locator('#segment-count')).toHaveText('240 odcinków');
  await page.locator('[data-page="reference"]').click(); await page.locator('#command-search').fill('pitchup'); await expect(page.locator('.command-entry:visible')).toHaveCount(1);
  await context.setOffline(false);
  console.log('✓ Keyboard camera controls, dark/system themes, offline 3D, searchable reference');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const section of ['studio', 'examples', 'challenges', 'reference']) {
      await page.locator(`[data-page="${section}"]`).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `${width}px ${section} must not overflow`);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 }); await opened(examples[2].source); await renderReady();
  await page.screenshot({ path: 'artifacts/studio-mobile.png', fullPage: true });
  await page.locator('#code-input').focus(); await page.keyboard.press('Shift+Tab'); assert.notEqual(await page.evaluate(() => document.activeElement.id), 'code-input');
  await page.locator('[data-page="examples"]').click(); await page.reload(); await expect(page.locator('#page-examples')).toBeVisible();
  assert.deepEqual(errors, []); assert.deepEqual(external, []);
  console.log(`✓ Four viewport sizes, keyboard focus, static hash refresh, no JS errors or external requests (${base})`);
} finally { await browser.close(); await new Promise(r => server.close(r)); }
