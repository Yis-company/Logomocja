# Logomocja

Polska pracownia Logo: edytor kodu, rysowanie na płaszczyźnie i w prawdziwej przestrzeni 3D. Cała aplikacja działa w przeglądarce. Nie ma kont, backendu, analityki, zewnętrznych fontów ani żądań do usług sieciowych podczas używania aplikacji.

## Uruchomienie

Potrzebny jest Bun. Z katalogu projektu:

```sh
bun install
bun run dev
```

Vite wyświetli adres lokalnego serwera (domyślnie `http://localhost:5173`).

## Build i publikacja

```sh
bun install
bun run build
```

Gotowa strona znajduje się w `dist/`. Opublikuj zawartość tego katalogu na dowolnym statycznym serwerze. Do lokalnego podglądu możesz użyć `python3 -m http.server 8080 --directory dist` i otworzyć `http://localhost:8080/`.

Budowanie dla podścieżki:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Zawartość `dist/` należy wtedy umieścić pod `/Logomocja/builds/x/`. `BASE_PATH` ma domyślną wartość `/`; podawaj początkowy i końcowy ukośnik. Wartość jest uwzględniana także dla fontów. Aplikacja nie ma tras wymagających przekierowań: odświeżenie adresu działa na zwykłym hostingu plików. Wygenerowane pliki JavaScript, CSS i WOFF/WOFF2 są kompletne i lokalne. Otwieraj stronę przez HTTP(S), a nie `file://`.

## Obsługa

- **Uruchom** wykonuje program od początku. Podczas rysowania ten przycisk zmienia się w **Pauza**, a po zatrzymaniu w **Wznów**. Skrót: `Ctrl+Enter` / `⌘+Enter` w edytorze.
- **Krok** wykonuje pojedynczą operację, wliczając obsługę wywołań i powtórzeń. Suwak ustawia tempo animacji.
- **Resetuj** czyści rysunek i przywraca stan początkowy żółwia, zachowując kod.
- Edycja zatrzymuje wykonywanie; dotychczasowy rysunek pozostaje do kolejnego uruchomienia. Nowe wykonanie zawsze zaczyna się od początku i najpierw waliduje cały program.
- Tryb 2D pozwala przesuwać płótno i przybliżać je. W 3D lewy przycisk obraca kamerę, prawy przesuwa, a kółko przybliża. Na telefonie: jeden palec obraca, dwa przesuwają/przybliżają. Dostępne są też przyciski powiększenia i dopasowania rysunku.
- Zmiana trybu i wybór przykładu pokazują od razu gotowy rysunek. Wczytanie przykładu zastępuje bieżący szkic. Przycisk pobierania zapisuje kod jako plik `.logo`.
- Kod i tryb są automatycznie zapisywane w `localStorage` pod kluczem `logomocja-draft`. Brak dostępu do pamięci nie uniemożliwia pracy; edytor pokazuje wtedy informację o braku zapisu.
- Jeśli WebGL jest niedostępny, tryb 3D jest wyłączony z wyjaśnieniem. Canvas 2D i interpreter pozostają dostępne.

Wbudowana instrukcja opisuje polecenia, procedury i sterowanie kamerą. Interfejs, komunikaty oraz przykłady są po polsku.

## Język i interpreter

Obsługiwane są wszystkie polskie i angielskie aliasy ze specyfikacji, liczby dziesiętne ze znakiem, komentarze `;`, kolory `"#rrggbb"`, zagnieżdżone powtórzenia oraz procedury z parametrami. Nagłówki `oto nazwa ma: bok, kąt` i `oto nazwa :bok :kąt` są równoważne. Wielkość liter nie ma znaczenia.

Definicje są zbierane przed analizą wywołań. Walidacja obejmuje cały program, także niewykonywane bloki i procedury. Graf wywołań jest sprawdzany pod kątem rekurencji bez używania rekurencyjnego przechodzenia po grafie. Parametry mają lokalny zakres.

Stan żółwia jest niezależny od renderera. Trzy wektory opisują lokalne osie: kierunek, prawo i górę. Obrót zmienia odpowiednią parę wektorów. Płaskie polecenia generują identyczne współrzędne w obu trybach. Błędy składni i stałych argumentów nie pozostawiają odcinków; błędy wykonania zachowują wcześniejsze odcinki.

Limity: 50 000 znaków, 10 000 tokenów, 32 poziomy nawiasów, 32 aktywne ramki powtórzeń/procedur, 10 000 operacji, 10 000 odcinków, współrzędne w zakresie ±100 000. Każde polecenie liczy się jako operacja; powtórzenie dodatkowo liczy rozpoczęcie każdej iteracji, także pustej. Wywołanie procedury liczy jedną operację wejścia. Przekroczenie limitu zatrzymuje program przed wykonaniem niedozwolonej operacji.

## API testowe

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"
window.logomocja.run('powtórz 4 [np 80 pw 90]', '2d');
// { segments: [{ from: [x,y,z], to: [x,y,z], color: "#16866a", width: 3 }, ...], error: null }
```

`run(source, mode)` jest synchroniczne i nie zmienia interfejsu, szkicu ani rysunku. `mode` to `"2d"` lub `"3d"`. Interpreter 3D działa także bez WebGL. Błąd ma postać `{ message, line, column }` z polskim komunikatem i pozycją liczoną od 1. Wynik zawsze zawiera tablicę `segments` i pole `error`.

## Testowanie

```sh
bun run test
bun run build
```

Testy interpretera obejmują geometrię, aliasy, procedury, zakres parametrów, rekurencję, pozycje błędów, limity oraz wykonanie krokowe.

Dodatkowy test gotowej strony w Chromium:

```sh
bunx playwright install --with-deps chromium
bun run build
bun run test:browser
```

Instalacja bibliotek systemowych przeglądarki może wymagać uprawnień administratora. Test sam uruchamia lokalny serwer statyczny i sprawdza API, sterowanie wykonaniem, edycję, zapis szkicu, błędy, 3D, kamerę, instrukcję, układ mobilny i brak WebGL. Zrzuty ekranu zapisuje w `/tmp/logomocja-*.png`.

Test publikacji w podścieżce bez reguł rewrite:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
BASE_PATH=/Logomocja/builds/x/ bun run test:browser
```

## Struktura

- `src/interpreter.ts` — lexer, parser, walidacja i krokowa maszyna wykonania; brak zależności od DOM.
- `src/drawing.ts` — Canvas 2D, Three.js, linie o określonej grubości i kamera orbitalna.
- `src/main.ts` — edytor, sterowanie, pamięć lokalna i publiczne API.
- `src/examples.ts` — lokalne przykłady i miniatury SVG.
- `src/style.css` — układ responsywny, typografia i stany interfejsu.
- `tests/interpreter.test.ts` — testy jednostkowe Bun.
- `scripts/check-browser.ts` — testy gotowego buildu w Playwright.

Technologie: TypeScript, Vite, Canvas 2D, Three.js. Fonty DM Sans oraz IBM Plex Mono są dołączone z pakietów Fontsource na licencji SIL Open Font License; teksty licencji znajdują się również w `public/licenses/` i trafiają do buildu.
