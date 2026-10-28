# Logomocja

Polskojęzyczna pracownia Logo do rysowania żółwiem na płaszczyźnie 2D i w przestrzeni 3D. Projekt działa całkowicie w przeglądarce: nie ma konta, serwera aplikacji ani żądań sieciowych w czasie pracy. Postęp, szkice i motyw są przechowywane wyłącznie w local storage przeglądarki.

## Wymagania

- Bun (projekt jest bez zależności zewnętrznych)
- Nowoczesna przeglądarka z obsługą modułów ES, Canvas 2D i local storage

## Instalacja i uruchomienie

```sh
bun install
bun run build
```

Build tworzy samodzielną stronę statyczną w `dist/`. Można ją otworzyć przez lokalny serwer statyczny, na przykład:

```sh
python3 -m http.server 8000 -d dist
```

Następnie otwórz `http://localhost:8000`. Do wdrożenia pod ścieżką ustaw `BASE_PATH` podczas budowania. Ścieżka powinna zaczynać i kończyć się ukośnikiem; domyślną wartością jest `/`.

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Strona nie korzysta z tras serwerowych, więc odświeżenie podścieżki nie wymaga reguł rewrite.

## Testy

```sh
bun run test
```

Testy sprawdzają interpreter, dialekt, geometrię i wszystkie wbudowane przykłady.

## Funkcje

- Edytor z podświetlaniem składni, diagnostyką z pozycją błędu i automatycznym zapisem szkicu osobno dla 2D i 3D.
- Uruchamianie, krok, pauza, reset i regulacja tempa. Skróty: `Ctrl/⌘ + Enter`, `F8`, `F9`, `Esc`.
- Płótno 2D z siatką, początkiem, przesuwaniem, powiększaniem i dopasowaniem rysunku. Widok 3D pokazuje osie, siatkę i żółwia; przeciągnij płótno, aby orbitować kamerą.
- Trzynaście wbudowanych programów, pięć automatycznie sprawdzanych wyzwań, referencja języka, linki do programów i eksport/import `.logo` oraz PNG.
- Jasny i ciemny motyw z wyborem systemowym.

## Interfejs testowy

Po załadowaniu strony `window.logomocja` udostępnia:

```js
window.logomocja.run(source, '2d')
window.logomocja.run(source, '3d')
await window.logomocja.open(source, '2d')
```

`run` zwraca `{ segments, error }` bez zmiany interfejsu. `open` ładuje program do edytora, uruchamia go bez animacji i dopasowuje płótno. Odcinki zwracane przez interpreter mają pola `from`, `to`, `color` oraz `width`.
