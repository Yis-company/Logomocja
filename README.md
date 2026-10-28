# Logomocja

Polskojęzyczna pracownia Logo 2D i 3D, działająca w przeglądarce bez serwera i bez połączenia z siecią. Szkice, motyw i postęp wyzwań są przechowywane lokalnie.

## Uruchomienie

```sh
bun install
bun run dev
```

## Budowanie i testy

```sh
bun run test
bun run build
```

Wynik znajduje się w `dist/` i można go udostępnić na dowolnym statycznym serwerze. Dla podkatalogu ustaw na przykład `BASE_PATH=/Logomocja/builds/x/ bun run build`. Linki do programów używają fragmentu URL i nie wymagają reguł przepisywania tras.

Skróty: Ctrl/⌘+Enter uruchamia, Ctrl/⌘+. wykonuje krok, Ctrl/⌘+P wstrzymuje lub wznawia, Ctrl/⌘+R resetuje. W trybie 3D dostępność zależy od WebGL. Interfejs testowy przeglądarki to `window.logomocja`.
