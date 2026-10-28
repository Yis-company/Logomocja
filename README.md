# Logomocja

Polskojęzyczne studio Logo: rysowanie na płaszczyźnie i w prawdziwej przestrzeni 3D. Aplikacja statyczna, bez kont, serwera aplikacyjnego i usług zewnętrznych. Czcionki, interpreter i renderer znajdują się w buildzie; aplikacja nie potrzebuje dostępu do sieci poza pobraniem własnych plików statycznych.

## Uruchomienie

Wymagany Bun (testowane na Bun 1.4.4).

```sh
bun install
bun run dev
```

Otwórz adres wypisany przez Vite (domyślnie `http://localhost:5173`).

## Build i publikacja

```sh
bun install
bun run build
```

Gotowa strona znajduje się w `dist/`. Udostępnij ten katalog dowolnym serwerem plików statycznych, np.:

```sh
python3 -m http.server 8080 --directory dist
```

Budowanie do podkatalogu:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Wgraj **zawartość** `dist/` do `/Logomocja/builds/x/` hosta. Nie są potrzebne reguły przekierowań: udostępnione programy są zapisane we fragmencie URL (`#p=…`), a strony pomocy i bibliotekę otwieramy w oknach dialogowych. `BASE_PATH` domyślnie wynosi `/`; zalecana końcowa ukośna kreska.

## Testy

```sh
bun run test
```

Testy obejmują wszystkie 13 standardowych programów, parser, pierwszeństwo i odstępy operatorów, wyrażenia bez rekurencji stosu JS, aliasy, współrzędne i orientację 3D, deklaracje i zakresy zmiennych, rekurencję procedur, `stop`, leksykalny licznik pętli, błędy z pozycjami, walidację przed wykonaniem, zachowanie odcinków po błędzie wykonania, limity i zgodność krokowania z wykonaniem pełnym.

Opcjonalne testy rzeczywistej przeglądarki (uruchom wcześniej serwer):

```sh
bunx playwright install --with-deps chromium
node scripts/check-browser.mjs
# lub dla statycznego buildu w podkatalogu:
TEST_URL=http://localhost:8080/Logomocja/builds/x/ node scripts/check-browser.mjs
```

Ten skrypt sprawdza interfejs, 13 przykładów, renderowanie 3D, eksport PNG, szkice, linki, zadanie, błędy, krokowanie, motywy, mobilny układ, dokumentację oraz obsługę braku WebGL. Zapisuje podglądy ekranów w `/tmp/logomocja-*.png`. Chromium wymaga systemowych bibliotek opisanych przez Playwright.

## Obsługa

- **Uruchom**, **Krok**, **Pauza / Wznów**, **Reset** i suwak tempa sterują wykonaniem. Reset czyści wykonanie, zachowując kod. Edycja zatrzymuje animację i zachowuje rysunek do ponownego uruchomienia.
- Płaszczyzna: przeciąganie przesuwa, kółko i przyciski zmieniają skalę; przycisk dopasowania mieści cały rysunek.
- Przestrzeń: przeciąganie obraca kamerę, prawy przycisk przesuwa, kółko przybliża. Na ekranie dotykowym jeden palec obraca, dwa przesuwają i przybliżają. Siatka leży w XY; osie X/Y/Z są czerwone/zielone/niebieskie. Trzy strzałki żółwia pokazują kierunek, prawą stronę i górę.
- Bez WebGL widok przestrzenny pokazuje komunikat. Interpreter 3D nadal działa, a płaszczyzna pozostaje dostępna.
- Biblioteka zawiera 13 niezmienionych programów z briefu. Wczytanie przykładu, pliku, odtworzonego szkicu lub linku zachowuje dotychczasowy kod w historii. Przycisk z zegarem nad edytorem otwiera **Zachowane szkice** (ostatnie 20).
- Każdy tryb ma własny szkic w `localStorage`. Tu także zapisują się ukończone wyzwania i preferencja motywu. Brak dostępu do pamięci nie blokuje tworzenia; można pobrać plik.
- **Plik** pobiera i otwiera tekst UTF-8 `.logo` w wybranym trybie. **Udostępnij** tworzy link zawierający kod i tryb, automatycznie uruchamiany po otwarciu. Przycisk pobierania na płótnie eksportuje aktualny widok do PNG.
- Pięć wyzwań ma podgląd i automatyczny sprawdzian. Porównujemy pokrycie geometrii w obu kierunkach (próbki co najwyżej co 3 jednostki, tolerancja odległości 1) oraz sumę długości (tolerancja 0,5%, minimum 1). Dopuszczamy dzielenie prostych linii na mniejsze odcinki i dowolny styl pisaka; początek i rozmiar figury są określone w zadaniu.
- Kompletny polski opis poleceń, aliasów, składni, geometrii, limitów i błędów jest dostępny w **Słowniku poleceń**.
- Motyw startuje zgodnie z systemem. Przycisk słońca przełącza: systemowy → jasny → ciemny → systemowy.

Skróty:

| Skrót                | Działanie                     |
| -------------------- | ----------------------------- |
| Ctrl / ⌘ + Enter     | Uruchom od początku           |
| Alt + →              | Wykonaj kolejny krok          |
| Ctrl / ⌘ + .         | Pauza / wznów                 |
| Ctrl / ⌘ + Backspace | Reset wykonania               |
| Strzałki na płótnie  | Przesuwanie 2D / obracanie 3D |
| + / − na płótnie     | Przybliż / oddal              |
| 0 na płótnie         | Dopasuj rysunek               |

## Interfejs testowy

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"
window.logomocja.run("powtorz 4 [np 100 pw 90]", "2d");
await window.logomocja.open("gora 90 np 80", "3d");
```

`run(source, mode)` działa synchronicznie, nie zmienia interfejsu ani pamięci lokalnej. Zwraca `{ segments, error }`. Odcinek ma postać `{ from: [x,y,z], to: [x,y,z], color: '#rrggbb', width }`. Błąd to `null` albo `{ message, line, column }`, z polskim opisem i pozycją od 1. Błąd parsowania daje pusty rysunek; błąd wykonania zachowuje odcinki sprzed błędu, uwzględniając `czyść`.

`open(source, mode)` zachowuje wcześniejszy szkic, wczytuje kod do edytora, wykonuje go bez animacji, dopasowuje widok i po wyrenderowaniu rozwiązuje Promise z takim samym wynikiem. Tryb to `2d` lub `3d`.

## Struktura

- `src/interpreter.js` — tokenizer, parser AST, walidacja całego programu, generator wykonujący polecenia, geometria i limity. Bez DOM i zależności renderera.
- `src/view.js` — płótno Canvas 2D i WebGL Three.js, sterowanie kamerą, dopasowanie, znacznik żółwia, eksport.
- `src/main.js` — edytor z kolorowaniem, obsługa wykonania, plików, historii, linków, zadań i motywów.
- `src/examples.js` — 13 standardowych przykładów z nazwami i trybami.
- `src/reference.js` — polski podręcznik i tabela wszystkich aliasów z przykładami.
- `src/style.css` — responsywny interfejs, motywy, widoczny fokus, ograniczenie ruchu.
- `tests/interpreter.test.js` — testy Bun, niezależne od przeglądarki.
- `scripts/check-browser.mjs` — opcjonalny sprawdzian Playwright.

Interfejs używa lokalnych fontów Manrope, DM Mono i Lora na licencji SIL OFL; licencje znajdują się w `public/licenses/` i trafiają do `dist/licenses/`. Three.js jest na licencji MIT. Obsługa klawiatury, semantyczne przyciski i podpisy oraz natywne modalne dialogi nie wymagają dodatkowych bibliotek komponentów.
