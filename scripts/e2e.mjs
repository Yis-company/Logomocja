// End-to-end smoke test: builds the site under a sub-path, serves dist/ as plain
// static files (no rewrites), drives the UI in headless Chromium and saves screenshots.
// Usage: node scripts/e2e.mjs   (needs `bunx playwright install chromium` once)
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const BASE = '/Logomocja/builds/x/';
const OUT = join(ROOT, 'e2e-out');
const DIST = join(OUT, 'dist');
const SHOTS = join(OUT, 'shots');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
};

function log(msg) {
  console.log(`[e2e] ${msg}`);
}

function assert(cond, msg) {
  if (!cond) throw new Error(`Assertion failed: ${msg}`);
}

async function build() {
  log(`building with BASE_PATH=${BASE}`);
  const r = spawnSync('bun', ['run', 'build', '--', '--outDir', DIST, '--emptyOutDir'], {
    cwd: ROOT,
    env: { ...process.env, BASE_PATH: BASE },
    stdio: 'inherit',
  });
  assert(r.status === 0, 'build failed');
}

async function serve() {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(BASE)) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    let rel = url.pathname.slice(BASE.length);
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const file = join(DIST, rel);
    try {
      const s = await stat(file);
      if (!s.isFile()) throw new Error('dir');
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  return { server, url: `http://127.0.0.1:${port}${BASE}` };
}

async function loadExample(page, id, marker) {
  await page.selectOption('#examples', id);
  await page.waitForFunction((m) => document.querySelector('#editor textarea').value.includes(m), marker, { timeout: 20000 });
  await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Zakończono', null, { timeout: 20000 });
}

async function main() {
  await build();
  await mkdir(SHOTS, { recursive: true });
  const { server, url } = await serve();
  const browser = await chromium.launch({
    args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader', '--ignore-gpu-blocklist'],
  });
  const errors = [];
  const failed = [];
  try {
    // ---- desktop ---------------------------------------------------------
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('dialog', (d) => d.accept());
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('response', (r) => {
      if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(url, { waitUntil: 'load' });

    // Testing hook.
    const api = await page.evaluate(() => {
      const a = window.logomocja;
      return {
        version: a.version,
        square: a.run('powtórz 4 [np 100 pw 90]', '2d'),
        pitch2d: a.run('góra 90 np 10', '2d'),
        pitch3d: a.run('góra 90 np 10', '3d'),
        runtime: a.run('np 1 np 200000', '2D'),
      };
    });
    assert(typeof api.version === 'string' && api.version.length > 0, 'version string');
    assert(api.square.error === null && api.square.segments.length === 4, 'square draws 4 segments');
    assert(api.square.segments[1].to[0] === 100 && api.square.segments[1].color === '#16866a', 'square geometry');
    assert(api.pitch2d.error && api.pitch2d.error.line === 1 && api.pitch2d.segments.length === 0, 'pitch is error in 2d');
    assert(api.pitch3d.error === null && api.pitch3d.segments[0].to[2] === 10, 'pitch works in 3d');
    assert(api.runtime.error && api.runtime.segments.length === 1, 'runtime error keeps segments');
    log(`window.logomocja ok (version ${api.version})`);

    // Default example auto-runs; wait for it to finish.
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Zakończono', null, { timeout: 15000 });
    assert((await page.textContent('#st-segments')) === '4', 'status shows 4 segments');
    await page.screenshot({ path: join(SHOTS, 'desktop-2d.png') });

    // Step through a fresh program.
    await page.fill('#editor textarea', 'np 50\npw 90\nnp 50');
    await page.click('#btn-step');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Wstrzymano');
    assert((await page.textContent('#st-segments')) === '1', 'one segment after first step');
    assert((await page.$('.editor-highlight .active')) !== null, 'active statement highlighted');
    await page.click('#btn-step');
    await page.click('#btn-step');
    await page.click('#btn-step');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Zakończono');
    assert((await page.textContent('#st-segments')) === '2', 'two segments after stepping');

    // Parse error reporting.
    await page.fill('#editor textarea', 'np 50\n  npp 10');
    await page.click('#btn-run');
    await page.waitForSelector('.msg-error');
    const errText = await page.textContent('.msg-error');
    assert(errText.includes('wiersz 2') && errText.includes('kolumna 3') && errText.includes('npp'), `error message: ${errText}`);
    assert((await page.textContent('#st-segments')) === '0', 'nothing drawn on parse error');
    await page.screenshot({ path: join(SHOTS, 'desktop-error.png') });

    // Pause / resume on a slow run, then edit while running.
    await page.fill('#speed', '1');
    await page.$eval('#speed', (el) => el.dispatchEvent(new Event('input', { bubbles: true })));
    await page.fill('#editor textarea', 'powtórz 36 [np 40 pw 10]');
    await page.click('#btn-run');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Rysuje…');
    await page.click('#btn-pause');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Wstrzymano');
    assert((await page.textContent('#btn-pause-label')) === 'Wznów', 'pause button becomes resume');
    await page.click('#btn-pause');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Rysuje…');
    await page.type('#editor textarea', ' ');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Zmieniono');
    assert((await page.textContent('.msg-info')) !== null, 'stale message shown');
    await page.click('#btn-reset');
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Gotowy');
    assert((await page.textContent('#st-segments')) === '0', 'reset clears');

    // Draft persists across reload.
    await page.fill('#editor textarea', '; szkic\nnp 10');
    await page.reload({ waitUntil: 'load' });
    assert((await page.inputValue('#editor textarea')) === '; szkic\nnp 10', 'draft restored');

    // Instant speed + 3D mode + example.
    await page.fill('#speed', '10');
    await page.$eval('#speed', (el) => el.dispatchEvent(new Event('input', { bubbles: true })));
    await page.click('#mode-3d');
    await page.waitForFunction(() => document.getElementById('mode-3d').getAttribute('aria-pressed') === 'true', null, { timeout: 20000 });
    await loadExample(page, 'szescian', 'ściana');
    assert((await page.textContent('#st-segments')) === '24', `cube has 24 segments, got ${await page.textContent('#st-segments')}`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, 'desktop-3d-cube.png') });
    await loadExample(page, 'kula', 'okrąg');
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, 'desktop-3d-kula.png') });
    await loadExample(page, 'spirala3d', 'sprężynę');
    await page.waitForTimeout(400);
    await page.screenshot({ path: join(SHOTS, 'desktop-3d-spirala.png') });
    assert((await page.getAttribute('.stage-3d', 'data-segments')) === '240', '3D view uploaded 240 segments');
    await page.click('#btn-reset');
    await page.waitForFunction(() => document.querySelector('.stage-3d').dataset.segments === '0', null, { timeout: 5000 });
    await page.click('#btn-run');
    await page.waitForFunction(() => document.querySelector('.stage-3d').dataset.segments === '240', null, { timeout: 5000 });

    // Reload while in 3D mode: the stored draft must run in 3D (no pitch error) once the view is ready.
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(() => document.getElementById('st-state').textContent === 'Zakończono', null, { timeout: 20000 });
    assert((await page.getAttribute('#mode-3d', 'aria-pressed')) === 'true', '3D mode restored after reload');
    assert((await page.textContent('#st-segments')) === '240', `spiral re-ran in 3D after reload, got ${await page.textContent('#st-segments')}`);

    // Back to 2D with a 3D program: pitch must be reported as an error.
    await page.click('#mode-2d');
    await page.click('#btn-run');
    await page.waitForSelector('.msg-error');
    assert((await page.textContent('.msg-error')).includes('3D'), 'pitch error in 2D mentions 3D');

    // 2D examples screenshots.
    for (const [id, marker] of [['kwiat', 'płatek'], ['domek', 'Dom z dachem'], ['rozeta', 'rozeta'], ['gwiazda', 'gwiazda']]) {
      await loadExample(page, id, marker);
      await page.waitForTimeout(150);
      await page.screenshot({ path: join(SHOTS, `desktop-2d-${id}.png`) });
    }

    // Help dialog opens.
    await page.click('#help-btn');
    assert(await page.isVisible('#help'), 'help dialog visible');
    await page.screenshot({ path: join(SHOTS, 'desktop-help.png') });
    await page.click('#help-close');
    await page.close();

    // ---- phone ------------------------------------------------------------
    const phone = await browser.newPage({
      viewport: { width: 390, height: 780 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    phone.on('pageerror', (e) => errors.push(String(e)));
    phone.on('dialog', (d) => d.accept());
    phone.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text());
    });
    await phone.goto(url, { waitUntil: 'load' });
    await phone.waitForFunction(() => document.getElementById('st-state').textContent === 'Zakończono', null, { timeout: 20000 });
    await phone.screenshot({ path: join(SHOTS, 'phone-2d.png') });
    await phone.click('#mode-3d');
    await phone.waitForFunction(() => document.getElementById('mode-3d').getAttribute('aria-pressed') === 'true', null, { timeout: 20000 });
    await loadExample(phone, 'spirala3d', 'sprężynę');
    await phone.waitForTimeout(400);
    await phone.screenshot({ path: join(SHOTS, 'phone-3d.png') });
    await phone.close();

    // ---- no WebGL -----------------------------------------------------------
    const noGl = await browser.newPage({ viewport: { width: 1000, height: 700 } });
    await noGl.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') return null;
        return orig.call(this, type, ...rest);
      };
    });
    await noGl.goto(url, { waitUntil: 'load' });
    await noGl.click('#mode-3d');
    await noGl.waitForFunction(() => {
      const n = document.getElementById('stage-notice');
      return !n.hidden && n.dataset.kind === 'warn' && n.textContent.includes('WebGL');
    });
    assert((await noGl.getAttribute('#mode-3d', 'aria-disabled')) === 'true', '3D button disabled without WebGL');
    assert((await noGl.getAttribute('#mode-2d', 'aria-pressed')) === 'true', 'stays in 2D without WebGL');
    await noGl.fill('#editor textarea', 'powtórz 6 [np 60 pw 60]');
    await noGl.click('#btn-run');
    await noGl.waitForFunction(() => document.getElementById('st-state').textContent === 'Zakończono');
    await noGl.screenshot({ path: join(SHOTS, 'desktop-no-webgl.png') });
    await noGl.close();
  } finally {
    await browser.close();
    server.close();
  }
  const relevantErrors = errors.filter((e) => !/swiftshader|GPU stall|GroupMarkerNotSet/i.test(e));
  if (failed.length) {
    console.error('Failed requests:', failed);
    process.exit(1);
  }
  if (relevantErrors.length) {
    console.error('Console errors:', relevantErrors);
    process.exit(1);
  }
  log('all checks passed; screenshots in e2e-out/shots');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
