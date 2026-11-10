// Prosty serwer plików statycznych dla dist/ (do podglądu). PORT i BASE_PATH jak przy budowaniu.
let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = "/" + base;
if (!base.endsWith("/")) base += "/";
const port = Number(process.env.PORT || 4173);
const dist = `${import.meta.dir}/dist`;

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    if (path + "/" === base) return Response.redirect(base, 302);
    if (!path.startsWith(base)) return new Response("Nie znaleziono", { status: 404 });
    path = path.slice(base.length);
    if (path === "" || path.endsWith("/")) path += "index.html";
    if (path.includes("..")) return new Response("Nie znaleziono", { status: 404 });
    const file = Bun.file(`${dist}/${path}`);
    if (!(await file.exists())) return new Response("Nie znaleziono", { status: 404 });
    return new Response(file);
  },
});
console.log(`Logomocja: http://localhost:${port}${base}`);
