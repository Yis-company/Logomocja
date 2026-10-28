# Logomocja

Polska pracownia języka Logo, działająca w całości w przeglądarce. Szkice, motyw i postępy są zapisywane lokalnie.

## Uruchomienie

Wymagany Bun. Wykonaj `bun install`, następnie `bun run dev` (lub `bunx vite`) dla serwera deweloperskiego. `bun run build` tworzy statyczną stronę w `dist/`. Aby przygotować stronę pod podkatalog, użyj np. `BASE_PATH=/Logomocja/builds/x/ bun run build`. `bun run test` uruchamia testy interpretera.

W widoku 3D przeciąganie obraca kamerę, a Shift + przeciąganie przesuwa widok. Kółko myszy przybliża. Aplikacja rysuje na Canvas 2D, więc nie wymaga WebGL ani połączenia z siecią.
