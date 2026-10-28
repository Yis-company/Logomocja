# Logomocja

Statyczna, działająca lokalnie pracownia języka Logo z widokami 2D i 3D. Nie wymaga konta ani usług sieciowych.

## Uruchomienie

Wymagany jest Bun. Zainstaluj zależności przez `bun install`, a następnie uruchom `bunx vite` i otwórz podany adres. `bun run build` tworzy gotowy statyczny serwis w `dist/`. Aby zbudować dla podkatalogu, użyj na przykład `BASE_PATH=/Logomocja/builds/x/ bun run build`. Pliki można udostępnić dowolnym serwerem statycznym bez reguł przekierowań.

`bun run test` uruchamia testy interpretera. Szkice i postępy są przechowywane w localStorage przeglądarki. Link udostępniania zawiera program i tryb w części hash adresu.
