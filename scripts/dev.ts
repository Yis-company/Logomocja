// Serwer deweloperski: buduje dist/ i serwuje go na http://localhost:3000, przebudowując po zmianach.
import { watch } from 'node:fs';
import { join } from 'node:path';
import { build } from './build';

const root = join(import.meta.dir, '..');
await build();

let timer: ReturnType<typeof setTimeout> | undefined;
for (const dir of ['src', 'examples', 'public', 'index.html']) {
  watch(join(root, dir), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e)), 150);
  });
}

const dist = join(root, 'dist');
const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  async fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = Bun.file(join(dist, path));
    return (await file.exists()) ? new Response(file) : new Response('Nie znaleziono', { status: 404 });
  },
});
console.log(`Logomocja: http://localhost:${server.port}/`);
