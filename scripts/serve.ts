// Prosty serwer plików statycznych dla dist/ pod dowolną ścieżką bazową (bez przepisywania adresów).
const root = new URL('../dist/', import.meta.url).pathname;
const base = process.env.BASE_PATH || '/';
const port = Number(process.env.PORT || 4173);
Bun.serve({
  port,
  async fetch(req) {
    let path = decodeURIComponent(new URL(req.url).pathname);
    if (!path.startsWith(base)) return new Response('Not found', { status: 404 });
    path = path.slice(base.length);
    if (path === '' || path.endsWith('/')) path += 'index.html';
    const file = Bun.file(root + path);
    if (!(await file.exists())) return new Response('Not found', { status: 404 });
    return new Response(file);
  },
});
console.log(`http://localhost:${port}${base}`);
