// Prosty serwer plików statycznych do podglądu dist/ (bez przepisywania adresów, jak zwykły hosting).
// Użycie: bun run serve [port]; BASE_PATH ustawia ścieżkę, pod którą widać dist/.
import { join, normalize } from "node:path";

let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = "/" + base;
if (!base.endsWith("/")) base += "/";
const port = Number(process.argv[2] || process.env.PORT || 4173);
const root = join(import.meta.dir, "dist");

Bun.serve({
  port,
  async fetch(req) {
    const path = decodeURIComponent(new URL(req.url).pathname);
    if (path + "/" === base) return Response.redirect(base, 301);
    if (!path.startsWith(base)) return new Response("Not found", { status: 404 });
    let rel = normalize(path.slice(base.length));
    if (rel.startsWith("..")) return new Response("Forbidden", { status: 403 });
    if (rel === "" || rel === "." || rel.endsWith("/")) rel = join(rel, "index.html");
    const file = Bun.file(join(root, rel));
    return (await file.exists()) ? new Response(file) : new Response("Not found", { status: 404 });
  },
});
console.log(`Logomocja: http://localhost:${port}${base}`);
