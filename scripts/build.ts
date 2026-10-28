// Buduje samodzielną statyczną stronę do dist/.
// BASE_PATH (domyślnie „/”) trafia do manifestu; adresy zasobów w index.html są
// względne, więc strona działa pod dowolną ścieżką, bez reguł przepisywania.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = join(import.meta.dir, '..');
const dist = join(root, 'dist');

export async function build(): Promise<void> {
  let base = process.env.BASE_PATH || '/';
  if (!base.startsWith('/')) base = `/${base}`;
  if (!base.endsWith('/')) base = `${base}/`;

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });

  const result = await Bun.build({
    entrypoints: [join(root, 'src/app/index.ts'), join(root, 'src/styles.css')],
    outdir: join(dist, 'assets'),
    naming: '[name]-[hash].[ext]',
    target: 'browser',
    format: 'iife',
    minify: true,
    sourcemap: 'none',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  if (!result.success) {
    for (const log of result.logs) console.error(log);
    throw new Error('Budowanie nie powiodło się');
  }

  let js = '';
  let css = '';
  for (const out of result.outputs) {
    const rel = relative(dist, out.path).split('\\').join('/');
    if (out.path.endsWith('.js')) js = rel;
    else if (out.path.endsWith('.css')) css = rel;
  }
  if (!js || !css) throw new Error('Brak wyników budowania (js/css)');

  const template = await readFile(join(root, 'index.html'), 'utf8');
  const html = template.replace('%JS%', `./${js}`).replace('%CSS%', `./${css}`).replaceAll('%ASSETS%', './');
  await writeFile(join(dist, 'index.html'), html);

  await cp(join(root, 'public'), dist, { recursive: true });
  const manifest = {
    name: 'Logomocja',
    short_name: 'Logomocja',
    description: 'Polska pracownia żółwia: Logo w 2D i 3D.',
    lang: 'pl',
    start_url: base,
    scope: base,
    display: 'standalone',
    background_color: '#f4efe4',
    theme_color: '#f4efe4',
    icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
  await writeFile(join(dist, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
  console.log(`Zbudowano dist/ (BASE_PATH=${base}): ${js}, ${css}`);
}

if (import.meta.main) await build();
