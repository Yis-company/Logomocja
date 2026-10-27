# Logomocja

Polskojęzyczna pracownia żółwia inspirowana klasycznym środowiskiem Logo o tej samej nazwie:
rysowanie płaskie (2D) i przestrzenne (3D, z obrotem, przesuwaniem i zoomem kamery).
Działa w całości w przeglądarce, bez zależności uruchomieniowych, bez sieci.

## Uruchomienie

```sh
bun install          # brak zależności, polecenie jest bezpieczne
bun run build        # buduje statyczną stronę do dist/
bun test             # testy interpretera
python3 -m http.server -d dist 8080   # dowolny serwer statyczny
```

`BASE_PATH` (domyślnie `/`) jest respektowane: wszystkie adresy zasobów w `dist/` są względne,
więc strona działa pod dowolnym podkatalogiem (np. `BASE_PATH=/Logomocja/builds/x/`) bez reguł
przepisywania; aplikacja nie ma tras.

## Budowa

- `src/lang.ts` – lexer, parser z walidacją całego programu, maszyna żółwia (generator wykonujący po jednym poleceniu), limity.
- `src/render.ts` – widok na Canvas 2D: płaszczyzna XY oraz kamera perspektywiczna 3D (orbita, przesuwanie, zoom, szczypanie na ekranach dotykowych). 3D nie wymaga WebGL, więc działa wszędzie tam, gdzie działa 2D.
- `src/main.ts` – interfejs: uruchom / krok / pauza / reset, szybkość animacji, błędy z linią i kolumną (klikalne), przykłady, szkic zapisywany w `localStorage`.
- `window.logomocja = { version, run(source, mode) }` – punkt testowy zwracający `{ segments, error }`.

## Decyzje i interpretacja specyfikacji

- Błędy statyczne (składnia, rekurencja, argumenty) przerywają program przed rysowaniem. Parametr użyty jako grubość lub liczba powtórzeń jest sprawdzany także statycznie – literały przekazane w wywołaniach (również przez kolejne procedury) są weryfikowane i błąd wskazuje dany argument.
- Operacje: każde wykonane polecenie, wejście w `powtórz` i wywołanie procedury to jedna operacja (iteracje pętli nie są liczone osobno).
- Edycja w trakcie działania przerywa wykonywanie (rysunek zostaje); kolejne uruchomienie startuje od zera.
- Brakujące `już` jest zgłaszane na nagłówku `oto`, niedomknięty `[` – na tym nawiasie.
