/**
 * Prosty serwer statyczny do podglądu zbudowanej strony (bez żadnych przepisań adresów).
 * Użycie: bun run scripts/serve.ts [--dir dist] [--base /podsciezka/] [--port 4173]
 */
import { existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const args = process.argv.slice(2);
const opt = (name: string, def: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1]! : def;
};
const dir = join(import.meta.dir, '..', opt('dir', 'dist'));
let base = opt('base', process.env.BASE_PATH ?? '/');
if (!base.startsWith('/')) base = '/' + base;
if (!base.endsWith('/')) base += '/';
const port = Number(opt('port', '4173'));

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.json': 'application/json',
};

const server = Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    if (!path.startsWith(base)) {
      if (path + '/' === base) return Response.redirect(url.origin + base, 301);
      return new Response('Nie znaleziono', { status: 404 });
    }
    path = normalize(path.slice(base.length));
    if (path.startsWith('..')) return new Response('Zabronione', { status: 403 });
    let file = join(dir, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) return new Response('Nie znaleziono', { status: 404 });
    return new Response(Bun.file(file), { headers: { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' } });
  },
});
console.log(`Podgląd: http://localhost:${server.port}${base}`);
