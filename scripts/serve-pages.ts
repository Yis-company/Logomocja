// Production acceptance server: /Logomocja/ maps to dist, with no SPA fallback.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
const root = resolve("dist");
const types: Record<string, string> = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (!url.pathname.startsWith("/Logomocja/"))
      throw Error("Outside Pages base");
    const path = resolve(
      root,
      decodeURIComponent(url.pathname.slice("/Logomocja/".length)) ||
        "index.html",
    );
    if (!path.startsWith(root + sep)) throw Error("Outside dist");
    const content = await readFile(path);
    response.writeHead(200, {
      "Content-Type": types[extname(path)] ?? "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(5182, "127.0.0.1");
