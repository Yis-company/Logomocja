/**
 * Budowanie statycznej strony do `dist/`.
 *
 * Zmienna środowiskowa BASE_PATH (domyślnie „/”) wyznacza ścieżkę, pod którą strona
 * będzie wystawiona, np. BASE_PATH=/Logomocja/builds/x/. Zasoby mają w HTML adresy
 * zaczynające się od tej ścieżki, a na wypadek innego miejsca wystawienia — adres
 * zapasowy względny. Trasy aplikacji używają hasha (#/…), więc odświeżenie
 * strony działa bez żadnych reguł przepisywania po stronie serwera.
 */
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

export function normalizeBase(raw: string | undefined): string {
  let b = (raw ?? '/').trim();
  if (b === '') b = '/';
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(b)) return b.endsWith('/') ? b : b + '/';
  if (!b.startsWith('/')) b = '/' + b;
  if (!b.endsWith('/')) b += '/';
  return b.replace(/\/{2,}/g, '/');
}

const root = import.meta.dir;
const dist = join(root, 'dist');
const base = normalizeBase(process.env.BASE_PATH)
  .replace(/ /g, '%20')
  .replace(/["'<>`]/g, (c) => encodeURIComponent(c));

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, 'assets'), { recursive: true });

const result = await Bun.build({
  entrypoints: [join(root, 'src/main.ts'), join(root, 'src/styles/main.css')],
  outdir: join(dist, 'assets'),
  target: 'browser',
  format: 'iife',
  minify: true,
  sourcemap: 'none',
  naming: { entry: '[name]-[hash].[ext]', chunk: '[name]-[hash].[ext]', asset: '[name]-[hash].[ext]' },
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}

let js = '';
let css = '';
for (const out of result.outputs) {
  const rel = relative(join(dist, 'assets'), out.path);
  if (out.kind === 'entry-point' && rel.endsWith('.js')) js = rel;
  else if (rel.endsWith('.css')) css = rel;
}
if (!js || !css) {
  console.error('Nie znaleziono wygenerowanych plików JS/CSS.', result.outputs.map((o) => o.path));
  process.exit(1);
}

const html = (await readFile(join(root, 'src/index.html'), 'utf8'))
  .replaceAll('%BASE%%CSS%', `${base}assets/${css}`)
  .replaceAll('%BASE%%JS%', `${base}assets/${js}`)
  .replaceAll('./%CSS%', `./assets/${css}`)
  .replaceAll('./%JS%', `./assets/${js}`)
  .replaceAll('%BASE%', base);
await writeFile(join(dist, 'index.html'), html);

await cp(join(root, 'public'), dist, { recursive: true });

const manifest = {
  name: 'Logomocja — pracownia żółwia',
  short_name: 'Logomocja',
  description: 'Polska pracownia żółwia: rysowanie w 2D i w przestrzeni 3D.',
  lang: 'pl',
  start_url: base,
  scope: base,
  display: 'standalone',
  background_color: '#f4f1e8',
  theme_color: '#0f7a5f',
  icons: [{ src: `${base}favicon.svg`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
};
await writeFile(join(dist, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

console.log(`Zbudowano dist/ (BASE_PATH=${base}): ${js}, ${css}`);
