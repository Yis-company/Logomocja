# Logomocja

Polskojęzyczna pracownia Logo: edytor, animowane wykonanie, rysowanie 2D i przestrzenne 3D, 13 oryginalnych przykładów, 6 sprawdzanych wyzwań i pełny słownik języka. Projekt działa w przeglądarce, bez kont, backendu, CDN, telemetrii ani żądań sieciowych podczas używania. Wszystkie zasoby są lokalne.

## Uruchomienie

Wymagany Bun (sprawdzone z 1.4.4).

```sh
bun install
bun run dev
```

Adres serwera zostanie wypisany w terminalu (domyślnie `http://localhost:5173`).

## Budowanie i publikowanie

```sh
bun run build
```

Wynik to samodzielna statyczna strona w `dist/`. Opublikuj całą zawartość tego katalogu na dowolnym serwerze plików statycznych. Serwer aplikacyjny nie jest potrzebny.

Dla publikacji w podkatalogu:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść zawartość `dist/` dokładnie w `/Logomocja/builds/x/`. `BASE_PATH` domyślnie wynosi `/`; używaj ścieżki z końcowym ukośnikiem. Nawigacja odbywa się w jednej stronie. Linki do programów używają fragmentu `#p=...`, więc nie wymagają reguł przepisywania adresów. Odświeżenie linku działa na zwykłym statycznym hostingu.

Pliki trzeba serwować przez HTTP(S), ponieważ aplikacja używa modułów JavaScript. Po załadowaniu aplikacja nie wymaga połączenia sieciowego; nie instaluje service workera ani nie gwarantuje pierwszego otwarcia strony bez połączenia.

## Testy

```sh
bun run test
```

Testy jednostkowe sprawdzają standardowe przykłady, aliasy, pozycje błędów, pierwszeństwo i odstępy operatorów, długie wyrażenia, zakresy zmiennych, procedury i rekurencję, stop, nrpowt, granice wykonania, pisak, lokalne osie 3D oraz zgodność płaskich programów między trybami. Nie wymagają przeglądarki ani dostępu do sieci.

Opcjonalny test Chromium (wymaga również Node.js oraz bibliotek systemowych Chromium):

```sh
bunx playwright install --with-deps chromium
bun run test:browser
# Ten sam test dla publikacji pod zagnieżdżoną ścieżką:
BASE_PATH=/Logomocja/builds/x/ bun run test:browser
```

Test przeglądarkowy uruchamia własny serwer statyczny bez fallbacku SPA. Sprawdza wszystkie 13 przykładów i API, krokowanie, pauzę, edycję podczas pracy, zapis szkicu, historię, permalink, wyzwania i postęp, import/eksport plików, PNG, motyw ciemny, telefon o szerokości 390 px i pracę po odcięciu sieci. Zapisuje zrzuty ekranu w katalogu tymczasowym systemu (`/tmp/logomocja-*.png`).

## Korzystanie

- **Uruchom** wykonuje program z animacją; suwak reguluje jej tempo. **Krok** wykonuje jedno polecenie. **Pauza** wstrzymuje lub wznawia. **Reset** czyści rysunek i stan żółwia, zachowując kod. Edycja zatrzymuje rozpoczęte wykonanie; ponowne uruchomienie zaczyna od początku.
- **2D / 3D** przełącza osobne, automatycznie zapisywane szkice. Stan i postęp przechowywane są wyłącznie w localStorage. Jeśli pamięć jest niedostępna, komunikat przy edytorze zachęca do pobrania pliku.
- Wczytanie przykładu, wyzwania, pliku lub linku zachowuje poprzedni kod w **Pliki → Historia**. Historia obejmuje ostatnie 20 wersji, wraz z trybem i datą. Pliki `.logo` otwierają się w aktualnym trybie i nie uruchamiają automatycznie.
- **Udostępnij** koduje źródło i tryb w adresie URL (UTF-8 + base64url). Otwierający link widzi i automatycznie wykonuje program. Link nie jest sekretem ani zasobem zapisanym na serwerze. Dla długich programów wygodniej przesłać plik `.logo`.
- **Eksport PNG** zapisuje aktualny widok płótna, wraz z kamerą, siatką i znacznikiem żółwia, w rozdzielczości ekranu urządzenia.
- Wyzwania porównują odcinki bez uwzględniania koloru, grubości, kolejności lub kierunku rysowania. Każdy oczekiwany bok powinien być jednym odcinkiem. Tolerancja położenia końca wynosi 0,5 jednostki. Nadmiarowe i brakujące odcinki są zgłaszane osobno.
- Motyw początkowo śledzi ustawienia systemu. Przycisk w nagłówku przełącza kolejno: systemowy → jasny → ciemny → systemowy.

### Klawiatura i kamera

| Skrót                       | Działanie                       |
| --------------------------- | ------------------------------- |
| Ctrl / ⌘ + Enter            | Uruchom                         |
| F10                         | Krok                            |
| F8                          | Pauza / wznów                   |
| Shift + Esc                 | Reset wykonania                 |
| Strzałki na płótnie         | Przesuwanie 2D / orbitowanie 3D |
| Shift + strzałki na płótnie | Przesuwanie kamery 3D           |
| + / − na płótnie            | Przybliż / oddal                |
| F / 0 na płótnie            | Dopasuj rysunek / reset kamery  |

Mysz: przeciąganie przesuwa 2D lub obraca 3D, Shift + przeciąganie przesuwa 3D, kółko zmienia skalę. Przycisk ✥ przełącza orbitowanie i przesuwanie 3D. Dotyk: jeden palec przeciąga, dwa palce przesuwają i zmieniają skalę. Wszystkie działania mają także przyciski lub skróty klawiaturowe.

## API do automatyzacji

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"

const result = window.logomocja.run("np 100 pw 90 np 50", "2d");
// Bez zmiany edytora, płótna lub localStorage:
// { segments: [{from:[x,y,z], to:[x,y,z], color:'#rrggbb', width:3}, ...], error:null }

await window.logomocja.open("gora 90 np 100", "3d");
// Wczytuje kod, wykonuje bez animacji, dopasowuje widok.
// Promise kończy się po wyrenderowaniu rysunku; wynik jak w run().
```

Błąd ma postać `{message, line, column}` (komunikat po polsku, współrzędne od 1). Błąd walidacji daje pustą listę odcinków. Błąd wykonania zachowuje odcinki po ostatnim wykonanym `czyść`.

## Struktura i decyzje

- `src/interpreter.js`: lexer, dwufazowy parser (deklaracje i ciała), iteracyjny parser/evaluator wyrażeń oraz generator wykonania. Ten sam interpreter obsługuje API, animację i kroki. Wszystkie limity są wspólne. Kod nie jest wykonywany przez `eval`.
- `src/view.js`: widoki na Canvas 2D. Tryb 3D przechowuje rzeczywiste punkty XYZ i pełną lokalną bazę orientacji żółwia. Kamera używa projekcji ortograficznej, z orbitowaniem i przesuwaniem. Nie wymaga WebGL; działa również, gdy GPU/WebGL są niedostępne. To rysunek przestrzenny z odcinków, bez powierzchni i ukrywania krawędzi.
- `src/main.js`: polski interfejs, edytor z kolorowaną warstwą, transport wykonania, zapis, pliki, linki i sprawdzanie wyzwań.
- `src/examples.js`: trzynaście przykładów z briefu, z zachowanym kodem, nazwami i trybami.
- `src/content.js`: sześć wyzwań i kompletny polski słownik, wraz z aliasami, przykładami, semantyką i limitami.
- `src/style.css`: responsywny układ i motywy.
- `src/interpreter.test.js`, `scripts/browser-check.mjs`: testy jednostkowe i integracyjne.

Jedyne zależności projektu są narzędziami deweloperskimi (Vite i Playwright). Kod produkcyjny nie pobiera bibliotek, czcionek ani obrazów z sieci.
