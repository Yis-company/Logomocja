# Logomocja

Statyczna, polskojęzyczna pracownia języka Logo. Szkic jest przechowywany wyłącznie w localStorage przeglądarki. Widok 3D korzysta z WebGL; w razie jego braku nadal działa 2D.

## Uruchomienie i budowanie

```sh
bun install
bun run dev
bun run build
```

Gotowe pliki znajdują się w `dist/`. Można je udostępnić dowolnym statycznym serwerem. Dla instalacji w podkatalogu ustaw ścieżkę podczas budowania, np. `BASE_PATH=/Logomocja/builds/x/ bun run build`. Aplikacja nie wymaga serwera ani połączenia z siecią podczas działania.

## Testowanie

`bun test` uruchamia testy interpretera. Po załadowaniu strony dostępny jest też interfejs `window.logomocja.run(source, mode)`, gdzie tryb to `2d` albo `3d`.

Przykłady i krótką ściągę z poleceń znajdziesz w aplikacji. W 3D przeciągnięcie obraca kamerę, prawy przycisk przesuwa, a kółko myszy przybliża.
