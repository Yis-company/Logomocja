# Logomocja

Polskojęzyczna pracownia Logo do rysowania żółwiem na płaszczyźnie i w przestrzeni. Aplikacja działa lokalnie w przeglądarce; projekty i postęp wyzwań zapisuje w localStorage.

## Uruchomienie

Wymagany Bun. Uruchom `bun install`, a następnie `bun run dev` i otwórz adres pokazany przez Vite.

## Build

`bun run build` tworzy statyczną witrynę w `dist/`. Ścieżkę wdrożenia ustala `BASE_PATH`, np. `BASE_PATH=/Logomocja/builds/x/ bun run build`. Aplikacja używa hash URL do udostępniania programu.

## Testy

`bun run test` uruchamia zestaw testów interpretera przez Node.js.

## Język

Polecenia i składnię opisuje zakładka „Język Logo”. Przykłady są wbudowane w aplikację. API automatyzacji dostępne po załadowaniu strony: `window.logomocja.run(source, mode)` i `window.logomocja.open(source, mode)`.
