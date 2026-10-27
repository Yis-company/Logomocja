import { cp, mkdir, rm } from 'node:fs/promises'

// All asset URLs are relative, so the site works under any BASE_PATH
// (e.g. /Logomocja/builds/x/) on a static host without rewrite rules.
const base = process.env.BASE_PATH ?? '/'
if (!base.startsWith('/') || !base.endsWith('/')) console.warn(`BASE_PATH=${base}: expected leading and trailing "/"`)

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })
const res = await Bun.build({ entrypoints: ['src/main.ts'], outdir: 'dist', target: 'browser', minify: true, naming: '[name].js' })
if (!res.success) {
  for (const l of res.logs) console.error(l)
  process.exit(1)
}
await cp('index.html', 'dist/index.html')
await cp('src/style.css', 'dist/style.css')
console.log(`Built dist/ (BASE_PATH=${base})`)
