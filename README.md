# Logomocja

Polskie studio Logo do rysowania żółwiem na płaszczyźnie i w przestrzeni. Aplikacja jest statyczna: interpreter, rysowanie, zapis szkiców i wyzwań działają w przeglądarce, bez konta, backendu i połączenia sieciowego w czasie działania.

## Uruchamianie

Wymagany jest Bun.

```sh
bun install
bun run dev
```

Otwórz adres lokalny pokazany przez Vite. Domyślny szkic to program `Kwadrat`; programy 2D i 3D zapisują się osobno w local storage.

## Budowanie i publikacja statyczna

```sh
bun run build
```

Gotowa strona znajduje się w `dist/`. Można ją umieścić na dowolnym hostingu plików statycznych. Ścieżkę bazową ustaw przez `BASE_PATH` podczas budowania; domyślnie jest to `/`.

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

W takim buildzie zasoby używają wskazanej ścieżki. Aplikacja nie ma routingu serwerowego; permalink programu jest zapisany w `#share=...`, więc odświeżenie strony nie wymaga reguł przepisywania adresów.

## Testy

```sh
bun run test
```

Testy obejmują trzynaście wbudowanych programów, składnię wyrażeń, zakres zmiennych, liczniki pętli, błędy składni i wykonania oraz ruch w 3D.

## Edytor i skróty

- `Ctrl+Enter` — uruchom program od początku.
- `Ctrl+.` — wykonaj jeden krok.
- `Esc` — wstrzymaj bieżące wykonywanie.
- `Ctrl+Backspace` — wyczyść rysunek i zresetuj pozycję żółwia.
- `Tab` w edytorze — wstaw dwa odstępy.

Tempo animacji ustaw suwakiem. Edycja zatrzymuje bieżące wykonywanie i zachowuje już narysowane odcinki. Zmiana przykładu pokazuje potwierdzenie, zapisuje kopię poprzedniego szkicu i udostępnia przycisk jego przywrócenia. Rysunek można pobrać jako PNG, a program jako plik `.logo`; plik `.logo` można również otworzyć z dysku.

Widok 2D przesuwa się przeciągnięciem, a kółko myszy przybliża i oddala. W 3D przeciągnięcie obraca kamerę, `Shift` i przeciągnięcie przesuwa ją, a przyciski strzałek obracają widok. Oba widoki rysują te same współrzędne interpretera na warstwie Canvas 2D; model i kamera 3D zachowują pełne współrzędne XYZ.

## Interpreter i API testowe

Interpreter w `src/interpreter.ts` wykonuje polskie i angielskie aliasy, wyrażenia, pętle, zmienne, warunki i rekurencyjne procedury. `src/examples.ts` zawiera trzynaście programów startowych.

Po załadowaniu strony dostępny jest obiekt `window.logomocja`:

```js
window.logomocja.run('powtorz 4 [np 80 pw 90]', '2d');
await window.logomocja.open('np 50', '3d');
```

`run(source, mode)` zwraca `{ segments, error }` bez zmieniania widoku. `open(source, mode)` wczytuje program, wykonuje go bez animacji, dopasowuje widok i zwraca ten sam wynik.

## Projekt

- `src/interpreter.ts` — lexer, parser, walidator i wykonawca z maszyną krokową.
- `src/examples.ts` — przykłady wbudowane.
- `src/DrawingCanvas.tsx` — interaktywna projekcja płaszczyzny i przestrzeni.
- `src/main.tsx`, `src/style.css` — aplikacja, strony, edytor i style.
