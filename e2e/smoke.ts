/**
 * Opcjonalny test przeglądarkowy (nie wchodzi w skład `bun run test`).
 *
 *   bun run build
 *   npm i --no-save playwright && npx playwright install chromium   # jednorazowo
 *   bun run e2e
 *
 * Serwuje `dist/` z losowego portu i sprawdza najważniejsze ścieżki użytkownika.
 */
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { tmpdir } from 'node:os';

const dist = join(import.meta.dir, '..', 'dist');
if (!existsSync(join(dist, 'index.html'))) {
  console.error('Brak dist/ — uruchom najpierw: bun run build');
  process.exit(2);
}

let chromium: typeof import('playwright').chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Zainstaluj Playwright: npm i --no-save playwright && npx playwright install chromium');
  process.exit(2);
}

const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const server = Bun.serve({
  port: 0,
  fetch(req) {
    const p = normalize(decodeURIComponent(new URL(req.url).pathname)).replace(/^\/+/, '');
    let f = join(dist, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f)) return new Response('404', { status: 404 });
    return new Response(Bun.file(f), { headers: { 'content-type': TYPES[extname(f)] ?? 'application/octet-stream' } });
  },
});
const base = `http://localhost:${server.port}/`;

let failed = 0;
const check = (cond: boolean, msg: string) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!cond) failed++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
const page = await ctx.newPage();
const errors: string[] = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

await page.goto(base);
await page.waitForFunction(() => (window as any).logomocja);

// --- interfejs testowy
const run = await page.evaluate(() => (window as any).logomocja.run('powtorz 4 [np 100 pw 90]', '2d'));
check(run.segments.length === 4 && run.error === null, 'window.logomocja.run');
const bad = await page.evaluate(() => (window as any).logomocja.run('np 1 foo', '2d'));
check(bad.segments.length === 0 && bad.error?.line === 1 && bad.error?.column === 6, 'run: błąd analizy bez rysunku, z pozycją');
const open = await page.evaluate(() => (window as any).logomocja.open('gora 90 np 50', '3d'));
check(open.segments.length === 1 && open.error === null, 'window.logomocja.open (3D)');
check(await page.isChecked('input[type=radio][value="3d"]'), 'open przełącza tryb');

// --- przykłady, szkic nie ginie
await page.click('label[for$="-2d"]');
await page.fill('.editor-input', '; moj szkic\nnp 77');
await page.selectOption('select.select', 'gwiazda');
check((await page.textContent('.toasts'))!.includes('Cofnij'), 'wczytanie przykładu zachowuje szkic (Cofnij)');
await page.click('.toast button:has-text("Cofnij")');
check((await page.inputValue('.editor-input')) === '; moj szkic\nnp 77', 'Cofnij przywraca szkic');

// --- uruchamianie, krok, pauza, reset
await page.fill('.editor-input', 'powtorz 4 [np 50 pw 90]');
await page.keyboard.press('F10');
check((await page.getAttribute('.workspace', 'data-run')) === 'paused', 'krok wstrzymuje wykonanie');
check(((await page.textContent('.ln-active')) ?? '').includes('powtorz'), 'podświetlenie wykonywanego wiersza');
await page.keyboard.press('Escape');
check((await page.getAttribute('.workspace', 'data-run')) === 'idle', 'Esc zeruje');

// --- błąd wykonania zachowuje rysunek
await page.fill('.editor-input', 'np 30\nniech x 0\nnp 5 / x');
await page.keyboard.press('Control+Enter');
await page.waitForTimeout(1500);
check(/wiersz 3, kolumna 4: Dzielenie przez zero/.test((await page.textContent('.status-text')) ?? ''), 'komunikat błędu wykonania');
check((await page.textContent('.view-badge')) === '1 odcinek', 'rysunek sprzed błędu zostaje');

// --- link i plik
await page.evaluate(() => (window as any).logomocja.open('powtorz 5 [np 100 pw 144]', '2d'));
await page.click('.transport button[aria-label="Link"]');
const url = await page.inputValue('#permalink-input');
await page.keyboard.press('Escape');
const p2 = await ctx.newPage();
await p2.goto(url);
await p2.waitForTimeout(800);
check((await p2.inputValue('.editor-input')) === 'powtorz 5 [np 100 pw 144]', 'permalink wczytuje program');
check((await p2.textContent('.view-badge')) === '5 odcinków', 'permalink uruchamia program');
await p2.close();
const [dl] = await Promise.all([page.waitForEvent('download'), page.click('button[title^="Pobierz program"]')]);
check(readFileSync((await dl.path())!, 'utf8') === 'powtorz 5 [np 100 pw 144]' && dl.suggestedFilename().endsWith('.logo'), 'pobranie pliku .logo');
const [png] = await Promise.all([page.waitForEvent('download'), page.click('.transport button[aria-label="PNG"]')]);
check(readFileSync((await png.path())!).subarray(0, 8).toString('hex') === '89504e470d0a1a0a', 'eksport PNG');
const tmp = join(tmpdir(), 'e2e-open.logo');
writeFileSync(tmp, 'gora 30\nnp 40\n');
await page.setInputFiles('input[type=file]', tmp);
await page.waitForTimeout(500);
check((await page.inputValue('.editor-input')) === 'gora 30\nnp 40\n', 'otwarcie pliku .logo');

// --- wyzwanie
await page.goto(base + '#/wyzwania/trojkat');
await page.waitForTimeout(600);
await page.fill('.editor-input', 'powtorz 4 [np 120 pw 90]');
await page.click('button:has-text("Sprawdź")');
check(/Jeszcze nie/.test((await page.textContent('.verdict')) ?? ''), 'błędna odpowiedź jest odrzucana');
await page.fill('.editor-input', 'powtorz 3 [np 120 pw 120]');
await page.click('button:has-text("Sprawdź")');
check(/Brawo/.test((await page.textContent('.verdict')) ?? ''), 'poprawna odpowiedź przechodzi');

// --- motyw i trwałość
await page.goto(base);
await page.fill('.editor-input', 'np 12');
await page.reload();
await page.waitForFunction(() => (window as any).logomocja);
check((await page.inputValue('.editor-input')) === 'np 12', 'szkic przetrwał odświeżenie');

check(errors.length === 0, `brak błędów w konsoli (${errors.join(' | ') || 'ok'})`);

await browser.close();
server.stop();
console.log(failed ? `\n${failed} nie przeszło` : '\nWszystko przeszło');
process.exit(failed ? 1 : 0);
