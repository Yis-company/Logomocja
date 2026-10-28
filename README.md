# Logomocja

Polskie studio Logo: edytor, animowane wykonanie i praca krokowa, rysowanie 2D oraz rzeczywista geometria 3D z obrotem kamery. Wszystko działa lokalnie, bez kont, backendu i zapytań sieciowych w czasie używania aplikacji.

## Uruchomienie

Wymagany Bun (1.1 lub nowszy).

```sh
bun install
bun run dev
```

Otwórz adres wypisany przez Vite (domyślnie http://localhost:5173).

## Build statyczny

```sh
bun run build
# lub:
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Wynik znajduje się w `dist/`. Wgraj zawartość tego katalogu pod wskazaną ścieżkę. Nie są potrzebne reguły przekierowań ani serwer aplikacji. Udostępniane programy zapisane są we fragmencie URL, więc także odświeżenie linku działa na zwykłym hostingu plików. Zależności, style, ikony i kod są dostarczane lokalnie; aplikacja nie używa zewnętrznych fontów ani CDN.

## Testy

```sh
bun run test
```

Testy obejmują 13 przykładów, wyrażenia, odmiany składni, walidację przed wykonaniem, lokalizację błędów, procedury, zakresy, rekurencję, geometrię, limity oraz zgodność wykonania krokowego z pełnym.

Dodatkowy test przeglądarkowy (przy uruchomionym `bun run dev`):

```sh
bunx playwright install --with-deps chromium
node scripts/browser-check.mjs
```

Można podać `TEST_URL`, aby sprawdzić również build pod podścieżką.

## Korzystanie

- **Uruchom** wykonuje program z animacją. Po pauzie wznawia wykonanie; po zakończeniu zaczyna od nowa. **Krok** wykonuje kolejną operację. Edycja przerywa wykonanie i zachowuje dotychczasowy rysunek do następnego uruchomienia. **Reset** przywraca początkowy stan żółwia i puste płótno.
- Tryby 2D i 3D mają osobne szkice w localStorage. Wczytanie przykładu, pliku, linku lub programu przez API zachowuje poprzedni szkic w historii dostępnej w **Przykłady → Historia szkiców** (do 30 wpisów).
- W 2D przeciąganie przesuwa płótno. W 3D przeciąganie obraca kamerę, a Shift + przeciąganie lub prawy przycisk przesuwa. Przycisk czterech strzałek przełącza przeciąganie na przesuwanie, także na telefonie. Shift + strzałki na aktywnym płótnie obracają kamerę. Kółko i gest dwoma palcami zmieniają skalę. Przyciski dopasowania i resetu kamery przywracają wygodny widok. Strzałki na aktywnym płótnie przesuwają, +/− zmieniają skalę, 0 dopasowuje.
- 3D wykorzystuje ortograficzny rzut trójwymiarowych współrzędnych na Canvas 2D. Nie wymaga WebGL, działa także przy wyłączonej akceleracji GPU. Orientacja żółwia ma pełną trójwymiarową bazę (kierunek, prawy bok, góra). Widok pokazuje siatkę XY, osie XYZ oraz lokalną górę żółwia.
- **Wyzwania** zawierają pięć wzorów, instrukcje i wskazówki. Sprawdzanie porównuje pokrycie geometryczne obu rysunków z tolerancją 1 jednostki, niezależnie od koloru, grubości, kierunku i podziału odcinków. Postęp jest lokalny.
- **Słownik** opisuje wszystkie aliasy poleceń, wyrażenia, procedury, zmienne i limity. Zawiera też skróty klawiaturowe: Ctrl/⌘+Enter (uruchom/wznów), Alt+→ (krok), Alt+P (pauza/wznów), Alt+R (reset).
- **Udostępnij** kopiuje samowystarczalny link z programem i trybem; przy braku dostępu do schowka pokazuje pole do skopiowania. Bardzo długie programy tworzą długie URL, dla których wygodniejszy jest plik `.logo`.
- **Eksport PNG** zapisuje aktualny widok płótna. Ikony folderu i pobierania nad edytorem otwierają i zapisują plik `.logo` w UTF-8.
- Przycisk słońca przełącza motyw: systemowy → jasny → ciemny. Wybór jest zapamiętywany.

## Interfejs testowy

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"
window.logomocja.run("powtorz 4 [np 100 pw 90]", "2d");
await window.logomocja.open("gora 90 np 100", "3d");
```

Obie metody zwracają `{ segments, error }`. `run` nie zmienia interfejsu; `open` ustawia kod i tryb, wykonuje program bez animacji, dopasowuje rysunek i czeka na jego narysowanie. Odcinki mają format `{ from: [x,y,z], to: [x,y,z], color: '#rrggbb', width }`. Błąd ma polskie `message` oraz `line`, `column` liczone od 1. Błędy parsowania nie pozostawiają odcinków; błędy wykonania zachowują dotychczasowy wynik.

## Struktura

- `src/interpreter.js` — tokenizer, parser AST, walidacja i wykonanie generatorowe bez `eval`.
- `src/examples.js` — 13 standardowych programów w oryginalnej postaci.
- `src/view.js` — Canvas, rzut 2D/3D, kamera, interakcje i dopasowanie.
- `src/app.js` — studio, trwałość danych, wyzwania, pliki i linki.
- `src/reference.js` — pełny polski słownik języka.
- `src/style.css` — układ responsywny i motywy.
- `tests/interpreter.test.js` — testy interpretera.

Dane są przechowywane wyłącznie w localStorage danej przeglądarki. Ich wyczyszczenie usuwa szkice, historię i postęp.
