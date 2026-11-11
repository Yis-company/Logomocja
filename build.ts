// Buduje samodzielny, statyczny katalog dist/. BASE_PATH (domyślnie "/") to ścieżka, pod którą trafi strona.
import { createHash } from "node:crypto";
import { cp, mkdir, rm } from "node:fs/promises";
import pkg from "./package.json";

let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = "/" + base;
if (!base.endsWith("/")) base += "/";

const out = "dist";
await rm(out, { recursive: true, force: true });
await mkdir(`${out}/fonts`, { recursive: true });

const result = await Bun.build({
  entrypoints: ["src/ui/app.ts"],
  target: "browser",
  format: "iife",
  minify: true,
  define: { __VERSION__: JSON.stringify(pkg.version) },
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
const hash = (s: string | Uint8Array) => createHash("sha256").update(s).digest("hex").slice(0, 10);
const js = await result.outputs[0].text();
const css = (await Bun.file("src/styles.css").text()).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\n\s*\n/g, "\n");
const jsName = `app.${hash(js)}.js`;
const cssName = `styles.${hash(css)}.css`;
await Bun.write(`${out}/${jsName}`, js);
await Bun.write(`${out}/${cssName}`, css);
await cp("src/fonts", `${out}/fonts`, { recursive: true });
await Bun.write(`${out}/icon.svg`, Bun.file("src/icon.svg"));
// Wszystkie odwołania są względne, więc ten sam katalog działa pod dowolną ścieżką;
// BASE_PATH służy do naprawy adresu podanego bez końcowego ukośnika.
const html = (await Bun.file("src/index.html").text())
  .replace("__BASE_PATH__", base)
  .replace("__ICON__", "icon.svg")
  .replace("__CSS__", cssName)
  .replace("__JS__", jsName);
await Bun.write(`${out}/index.html`, html);
console.log(`dist/ gotowy (BASE_PATH=${base}): index.html, ${jsName} ${(js.length / 1024).toFixed(0)} kB, ${cssName} ${(css.length / 1024).toFixed(0)} kB`);
