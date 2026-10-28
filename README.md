# Logomocja

Polskojęzyczna pracownia Logo do rysowania żółwiem. Wymaga Bun.

- `bun install` instaluje zależności
- `bun run dev` uruchamia serwer deweloperski
- `bun run build` buduje statyczną stronę w `dist/`
- `bun run test` uruchamia testy interpretera
- Podścieżkę ustawisz przez `BASE_PATH=/Logomocja/builds/x/ bun run build`.

Strona działa lokalnie, bez kont i serwera. Szkice i postęp wyzwań są przechowywane w localStorage. API: `window.logomocja.run(source, mode)` oraz `window.logomocja.open(source, mode)`.
