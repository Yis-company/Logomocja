# Logomocja

Polska pracownia programowania z żółwiem: edytor Logo, rysunki 2D i prawdziwa geometria przestrzenna 3D. Bez kont, backendu i połączeń z siecią podczas działania.

## Uruchomienie

Wymagany Bun (sprawdzone z 1.4.4).

```sh
bun install
bun run dev
```

Otwórz adres wypisany przez Vite (domyślnie http://localhost:5173).

## Build i hosting statyczny

```sh
bun run build
bun run preview
```

Kompletna witryna znajduje się w `dist/`. Fonty, ikony, przykłady i kod są lokalne. Serwuj katalog przez zwykły serwer statyczny; nie są potrzebne reguły przepisywania adresów.

Podścieżkę ustaw podczas budowania:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść zawartość `dist/` pod `/Logomocja/builds/x/`. Linki programów używają fragmentu `#p=...`, więc otwierają się i odświeżają również na hostingu bez rewrites. Bez `BASE_PATH` baza to `/`. Sprawdzono rzeczywisty build pod tą podścieżką na zwykłym serwerze HTTP.

## Testy

```sh
bun run test
```

38 testów obejmuje standardowe przykłady, aliasy, arytmetykę i odstępy operatorów, pozycje błędów, zakresy zmiennych, procedury i rekurencję, limity, wektory 3D, zgodność 2D/3D, kroki oraz sprawdzanie wyzwań. Silnik nie zależy od DOM.

Opcjonalny test przeglądarkowy wymaga Chromium i jego bibliotek systemowych:

```sh
bunx playwright install chromium
# W terminalu 1:
bun run dev
# W terminalu 2:
bun run test:browser
# Lub wobec gotowej witryny:
BASE_URL=http://localhost:8000/Logomocja/builds/x/ bun run test:browser
```

Sprawdza działanie edytora, błędów, pauzy, kroków, dwóch szkiców, historii, udostępniania, plików, PNG, kamery, motywów, wyzwań i wersji mobilnej. Zrzuty zapisuje w `.impeccable/review/`.

## Pracownia

- Trzynaście wbudowanych przykładów zawiera dokładny kod z briefu; miniatury generuje ten sam interpreter.
- Każdy tryb automatycznie zachowuje bieżący szkic w local storage. Otwarcie innego programu archiwizuje zastępowany szkic; „Twoje szkice” udostępniają 30 ostatnich wersji. Przy zastępowaniu programu w innym trybie zachowywane są oba szkice.
- Uruchom wykonuje program z animacją. Krok wykonuje kolejne polecenie. Pauza pozwala wznowić wykonanie. Reset usuwa rysunek i przywraca żółwia. Edycja podczas pracy zatrzymuje wykonanie; rysunek zostaje do ponownego uruchomienia.
- Pięć wyzwań sprawdza geometrię niezależnie od koloru, grubości i podziału boków na odcinki. Wymagana jest dwukierunkowa zgodność przebiegu linii z tolerancją 1,5 jednostki i długości z tolerancją 3%. Zaliczony postęp jest trwały lokalnie.
- Przycisk przy nazwie programu pobiera `.logo`; „Otwórz plik” importuje go w bieżącym trybie. Przycisk nad rysunkiem zapisuje PNG z aktualnej kamery. „Udostępnij” tworzy adres zawierający cały kod UTF-8 i tryb; odbiorca automatycznie widzi wykonany program.
- Podręcznik dokumentuje każdą komendę, aliasy, wyrażenia, zmienne, procedury, układ współrzędnych i wszystkie limity.

## Sterowanie

| Skrót / gest | Działanie |
| --- | --- |
| Ctrl / ⌘ + Enter | Uruchom od początku |
| F10 | Następne polecenie |
| F8 | Pauza / wznów |
| Shift + F5 | Reset |
| Tab w edytorze | Dwa odstępy |
| Escape, następnie Tab | Opuść edytor klawiaturą |
| Przeciągnięcie rysunku | Przesuń 2D / obróć 3D |
| Shift + przeciągnięcie / prawy przycisk | Przesuń 3D |
| Kółko / szczypanie | Zmień skalę |
| Dwa palce | Przesuń kamerę i zmień skalę |
| Strzałki na rysunku | Przesuń 2D / obróć 3D |
| Shift + strzałki | Przesuń 3D |
| + / − / 0 na rysunku | Przybliż / oddal / dopasuj |

Motyw startuje zgodnie z systemem. Ikona w nagłówku przełącza motyw systemowy, jasny i ciemny. Własny wybór jest zapamiętywany.

## Geometria i interpreter

`src/interpreter.ts` zawiera lexer z pozycjami źródłowymi, parser z analizą deklaracji i procedur, iteracyjny parser wyrażeń oraz maszynę wykonującą z limitem operacji. Całe drzewo programu jest walidowane przed utworzeniem odcinków. Błędy wykonania pozostawiają wcześniejsze odcinki. Te same polecenia wykonuje uruchomienie pełne i krokowe.

`src/renderer.ts` przechowuje rzeczywiste wektory 3D, obracaną kamerę ortograficzną i rzutowanie na Canvas 2D. 3D **nie wymaga WebGL** i działa także, gdy WebGL jest wyłączony; nie ma sztucznego trybu przestrzennego ani zależności od GPU. Siatka leży w XY, widoczne są osie XYZ i orientacja żółwia (wraz z lokalną górą). Kolejność widoczności przestrzennych odcinków ustala ich głębokość. PNG odpowiada bieżącemu widokowi.

Pozostałe moduły: `examples.ts` — programy, `challenges.ts` — zadania i kontrola geometrii, `reference.ts` — dokumentacja, `main.ts` — interfejs i stan lokalny. Źródło stylów to `style.css`. Nie ma runtime CDN, telemetrii ani serwera aplikacji.

## API testowe

Po załadowaniu strony:

```js
window.logomocja.version // "1.0.0"
window.logomocja.run('powtorz 4 [np 100 pw 90]', '2d')
await window.logomocja.open('gora 90 np 100', '3d')
```

`run` nie zmienia interfejsu. `open` ładuje kod, wykonuje go bez animacji, dopasowuje widok i rozwiązuje obietnicę po wyrenderowaniu. Obie funkcje zwracają `{ segments, error }`. Odcinek ma `from`, `to`, `color`, `width`; błąd ma polskie `message` oraz `line` i `column` od 1.

## Projekt i przegląd

Kontekst produktu: `PRODUCT.md`. Decyzje i tokeny interfejsu: `DESIGN.md` oraz `.impeccable/design.json`. Kontrakt powierzchni: `.impeccable/studio-brief.md`. Końcowy przegląd: `.impeccable/review/finish-review.md`.

Użyto Impeccable 4.7.0, w trybie Operate i z implementacją bez makiety rastrowej. Zgodnie z briefem nie prowadzono wywiadu ani nie delegowano pracy; przegląd i dokumentację wykonano w tym samym wątku zgodnie z procedurami zastępczymi. Zamiast niedostępnego sterowania MCP użyto lokalnego Playwright CLI. Brakujące biblioteki przeglądarki rozpakowano do katalogu tymczasowego, bez uprawnień administratora. Nie użyto generowania obrazów ani zewnętrznych modeli. Wszystkie grafiki rysuje aplikacja z danych programu.

Fonty Manrope i JetBrains Mono pochodzą z lokalnych paczek Fontsource i są objęte SIL Open Font License (pliki licencji w odpowiednich paczkach).
