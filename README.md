# Logomocja

Polskojęzyczne studio Logo: edytor, żółw na kartce i w przestrzeni, 13 standardowych przykładów, 6 automatycznie sprawdzanych wyzwań i pełna dokumentacja języka. Bez kont, backendu, telemetrii i usług zewnętrznych. Wszystkie zasoby, także fonty, są dołączone do witryny.

## Uruchomienie

Wymagany [Bun](https://bun.sh/).

```sh
bun install
bun run dev
```

Otwórz adres wypisany przez Vite (domyślnie `http://localhost:5173`).

## Budowanie i publikacja

```sh
bun run build
bun run preview
```

Gotowa witryna znajduje się w `dist/`. Opublikuj cały ten katalog na dowolnym hostingu statycznym.

Dla podkatalogu ustaw ścieżkę podczas budowania, z początkowym i końcowym ukośnikiem:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Następnie umieść **zawartość** `dist/` pod `/Logomocja/builds/x/`. Nie są potrzebne reguły przepisywania adresów. Nawigacja pomiędzy ekranami nie zmienia ścieżki, a udostępnianie korzysta z fragmentu `#p=…`. Odświeżenie linku działa na zwykłym serwerze plików. Domyślny `BASE_PATH` to `/`.

Nie ma połączeń do zewnętrznych usług w trakcie działania aplikacji. Po pobraniu strony interpreter, rysowanie, zadania i eksport działają bez internetu. Nie jest instalowany service worker: ponowne otwarcie strony bez połączenia wymaga lokalnego serwera lub zasobów zachowanych przez przeglądarkę.

## Testy

```sh
bun run test
```

Testy Bun obejmują leksykę, wszystkie aliasy, precedencję i odstępy operatorów, głębokie wyrażenia, pozycje błędów, walidację całego programu, zakres zmiennych, procedury i rekurencję, leksykalny licznik powtórzeń, warunki, `stop`, geometrię 2D/3D, obrót lokalnych osi, stan pisaka, czyszczenie, limity, liczenie operacji, wszystkie przykłady i checker wyzwań.

Dodatkowy test integracyjny w Chromium:

```sh
bunx playwright install --with-deps chromium
# w drugim terminalu: bun run dev
bun run test:browser
```

Można wskazać dowolny już uruchomiony serwer, w tym zbudowaną witrynę w podkatalogu:

```sh
TEST_URL=http://localhost:8080/Logomocja/builds/x/ bun run test:browser
```

Test sprawdza publiczny hook, 13 przykładów, klawiaturę i kamerę, wykonanie krokowe, pauzę i reset, błędy, szkice i kopie, 6 zadań i postęp, dokumentację, import/eksport, PNG, linki, motywy, szerokości 320/390/768 px oraz działanie po wyłączeniu sieci. Zrzuty trafiają do `/tmp/logomocja-*.png`. Ten test wymaga Chromium i jego bibliotek systemowych; nie są one potrzebne do budowania ani testów interpretera.

## Używanie studia

- `Ctrl` / `Cmd` + `Enter`: uruchom od początku.
- `F10`: wykonaj krok. `F8`: pauza / wznów. `Shift` + `Esc`: wyczyść wykonanie i przywróć żółwia.
- Tempo zmienia szybkość animacji. Edycja kodu zatrzymuje wykonanie i zeruje stan; nowy przebieg zawsze korzysta z całego nowego programu.
- Przeciąganie przesuwa kartkę w 2D i obraca kamerę w 3D. Shift + przeciąganie, prawy przycisk lub narzędzie dłoni przesuwa kamerę. Dwa palce przesuwają i zmieniają skalę. Dostępne są przyciski zbliżenia, dopasowania i resetu.
- Gdy płótno ma fokus: strzałki przesuwają/obracają; Shift + strzałki przesuwa w 3D; `+` / `−` przybliża/oddala; `0` resetuje kamerę.
- Ikona motywu przełącza systemowy → jasny → ciemny → systemowy. Wybór jest zapamiętywany.
- Kod obu trybów zapisuje się osobno w localStorage. Wczytanie przykładu, pliku, zadania albo linku zachowuje poprzedni kod w **Szkicach** (ikona historii nad edytorem). Przy zmianie trybu zewnętrznym programem zachowywany jest również zastępowany szkic docelowego trybu.
- `.logo` to zwykły tekst UTF-8. Plik nie zawiera trybu: przed importem wybierz 2D lub 3D. PNG zapisuje bieżący kadr, z siatką i żółwiem.
- Link zawiera cały kod i tryb (UTF-8 JSON kodowany base64url w fragmencie), bez zapisywania na serwerze. Osoba mająca link może odczytać i uruchomić kod. Bardzo długie programy dają długie adresy; do ich przenoszenia można też używać `.logo`.

## Interpreter i rysowanie

`src/interpreter.js` nie zależy od DOM. Najpierw tokenizuje i waliduje cały program, zbiera definicje i deklaracje, a potem wykonuje AST generatorem. Jawne stosy wyrażeń pozwalają obsługiwać tysiące nawiasów i operatorów bez zależności od stosu JavaScript. Generator służy zarówno wykonaniu natychmiastowemu, jak i animacji/krokom. Limity egzekwowane są również dla programów w linkach i wywołaniach hooka.

Żółw przechowuje wektory kierunku, prawego boku i góry; obroty są lokalne i zgodne z prawoskrętnym układem współrzędnych. Płaskie polecenia w obu trybach używają tej samej geometrii. Renderer Canvas 2D pokazuje rzeczywiste współrzędne 3D przez obracaną projekcję ortograficzną z sortowaniem odcinków według głębokości. Nie jest to emulacja poleceń 3D na płaszczyźnie; **WebGL nie jest wymagany**, więc brak WebGL nie wyłącza trybu 3D. Osie żółwia pokazują również jego przechył.

Checker zadań porównuje w obu kierunkach punkty próbkowane na odcinkach z odległością do najbliższego odcinka wzoru (tolerancja 0,8 jednostki). Ignoruje kolor, grubość, kolejność i podział krawędzi, ale wymaga zgodnego kształtu i położenia. Treść zadania określa wymiary, punkt startowy i kierunki. Dodatkowe i brakujące linie mają osobne komunikaty. Postęp jest lokalny.

## Hook testowy

Po załadowaniu strony dostępne jest:

```js
window.logomocja.version // "1.0.0"
window.logomocja.run('powtorz 4 [np 120 pw 90]', '2d')
await window.logomocja.open('gora 90 np 100', '3d')
```

Obie metody zwracają `{ segments, error }`. `run` jest synchroniczny, niezależny od UI. `open` ładuje kod do edytora, wykonuje go bez animacji i rozwiązuje Promise po dopasowaniu i namalowaniu widoku. Każdy odcinek ma `{ from: [x,y,z], to: [x,y,z], color, width }`. Błąd jest `null` lub `{ message, line, column }` (po polsku, pozycje od 1). Błąd parsowania zwraca puste odcinki; błąd wykonania zachowuje wcześniejsze rysowanie po uwzględnieniu czyszczenia.

## Pliki projektu

- `src/interpreter.js` — lexer, parser, zakresy, wykonanie, geometria i limity.
- `src/view.js` — renderer 2D/3D i obsługa kamery.
- `src/main.js` — edytor, ekran studia, pliki, linki, trwałość i hook.
- `src/examples.js` — 13 standardowych programów w niezmienionej postaci.
- `src/challenges.js` — zadania i porównanie geometrii.
- `src/reference.js` — pełna polska dokumentacja języka.
- `src/style.css`, `src/icons.js`, `src/fonts/` — lokalne zasoby interfejsu.
- `tests/interpreter.test.js` — testy jednostkowe; `scripts/browser-check.mjs` — integracja w przeglądarce.

Fonty DM Sans i IBM Plex Mono są dołączone na licencji SIL Open Font License; treści licencji znajdują się w `public/fonts/` i są kopiowane do gotowej witryny.
