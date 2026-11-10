// Buduje statyczną stronę do dist/. Zmienna BASE_PATH (domyślnie "/") ustawia ścieżkę bazową.
import { rm, mkdir } from "node:fs/promises";

let base = process.env.BASE_PATH || "/";
if (!base.startsWith("/")) base = "/" + base;
if (!base.endsWith("/")) base += "/";

const root = import.meta.dir;
const out = `${root}/dist`;
await rm(out, { recursive: true, force: true });
await mkdir(`${out}/assets`, { recursive: true });

const result = await Bun.build({
  entrypoints: [`${root}/src/main.ts`],
  target: "browser",
  format: "iife",
  minify: true,
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
const js = await result.outputs[0].text();
const css = await Bun.file(`${root}/src/styles.css`).text();
const hash = Bun.hash(js + css).toString(36).slice(0, 8);

const html = (await Bun.file(`${root}/src/index.html`).text()).replaceAll("%BASE%", base).replaceAll("%HASH%", hash);
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2.5l3.2 4.6h-6.4zM6 9.5l4 1.500-2.500 3zM26 9.500l-4 1.500 2.500 3zM7 25l3.500-3 1.500 3.500zM25 25l-3.500-3-1.500 3.500z" fill="#c1763d"/><ellipse cx="16" cy="16.2" rx="8.5" ry="9.800" fill="#16866a"/><path d="M16 10.500l4.300 2.700v5.600L16 21.500l-4.300-2.700v-5.600z" fill="none" stroke="#fffdf8" stroke-width="1.600" stroke-linejoin="round"/></svg>`;

await Bun.write(`${out}/assets/app.js`, js);
await Bun.write(`${out}/assets/app.css`, css);
await Bun.write(`${out}/index.html`, html);
await Bun.write(`${out}/favicon.svg`, favicon);
console.log(`Zbudowano dist/ (BASE_PATH=${base}, app.js ${(js.length / 1024).toFixed(1)} kB)`);
