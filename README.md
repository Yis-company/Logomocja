# Logomocja

Samodzielna, polskojęzyczna pracownia języka Logo. Program działa lokalnie w przeglądarce, bez konta i usług sieciowych. Rysunek 3D jest rzutowany na płótno Canvas 2D, dzięki czemu nie wymaga WebGL.

## Uruchomienie

```sh
bun install
bun run dev
```

Adres serwera deweloperskiego pojawi się w terminalu. Produkcyjną, statyczną wersję buduje `bun run build`; wynik znajduje się w `dist/`. Ścieżkę hostowania można ustawić np. `BASE_PATH=/Logomocja/builds/x/ bun run build`. Katalog wynikowy można umieścić na dowolnym serwerze statycznym. `bun run test` uruchamia testy interpretera.

Szkice, motyw i postępy wyzwań są przechowywane wyłącznie w localStorage przeglądarki. Link udostępniania zawiera program i tryb w części hash adresu.
