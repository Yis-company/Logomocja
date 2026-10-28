# Logomocja

Polskie, lokalne studio języka Logo: edytor, rysowanie na płaszczyźnie i w rzeczywistej przestrzeni 3D, 13 oryginalnych przykładów, 6 sprawdzanych wyzwań i kompletny opis języka.

## Uruchamianie

Wymagany [Bun](https://bun.sh/). W katalogu projektu:

```sh
bun install
bun run dev
```

Otwórz adres podany przez Vite (domyślnie http://localhost:5173).

```sh
bun run build     # TypeScript + statyczny serwis w dist/
bun run preview   # podgląd gotowej kompilacji
bun run test      # testy interpretera, geometrii, przykładów i zadań
```

Do wdrożenia wystarcza zawartość `dist/` i dowolny serwer plików statycznych. Nie ma backendu, kont, analityki ani zewnętrznych żądań podczas działania. Czcionki są dołączane lokalnie. WebGL jest potrzebny tylko do wizualizacji 3D; interpreter przestrzenny i studio 2D działają również bez niego.

## Podkatalog na hostingu

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść wtedy zawartość `dist/` pod `/Logomocja/builds/x/`. `BASE_PATH` domyślnie wynosi `/`; użyj ścieżki z ukośnikiem końcowym. Nawigacja nie zmienia ścieżki dokumentu. Linki programów i odnośniki do dokumentacji używają fragmentów URL, więc odświeżenie nie wymaga reguł przepisywania adresów.

## Studio

- **Uruchom / Wznów** — wykonanie z animacją i regulacją tempa.
- **Krok** — następne polecenie; **Pauza** zatrzymuje animację; **Reset** czyści rysunek i przywraca żółwia, zachowując kod.
- Edycja podczas wykonywania zatrzymuje wykonanie i zachowuje aktualny rysunek do ponownego uruchomienia.
- Płótno 2D: przeciągnięcie przesuwa, kółko przybliża względem wskaźnika, przycisk dopasowania obejmuje cały rysunek.
- Płótno 3D: przeciągnięcie obraca, prawy przycisk lub dwa palce przesuwają, kółko lub szczypanie przybliża. Przycisk dopasowania resetuje kamerę.
- Na aktywnym płótnie strzałki przesuwają, +/− zmieniają powiększenie, a 0 dopasowuje widok.
- Menu plików otwiera i pobiera `.logo` oraz przywraca archiwalne szkice. Otwarcie przykładu lub pliku archiwizuje zastępowany szkic (do 30 kopii) i pokazuje możliwość cofnięcia.
- Szkice 2D i 3D, archiwum, motyw oraz postępy wyzwań zapisują się osobno w `localStorage`. Motyw początkowo podąża za systemem; przycisk przełącza systemowy → jasny → ciemny.
- Udostępnianie koduje UTF-8 programu i tryb w fragmencie URL. Otwarty link automatycznie wykonuje program i dopasowuje widok. Żaden program nie jest wysyłany na serwer.
- PNG zawiera aktualny widok płótna, ze znacznikami i siatką (siatkę można ukryć).

Skróty: **Ctrl/⌘ + Enter** uruchamia lub wznawia, **Alt + →** wykonuje krok, **Alt + P** pauzuje lub wznawia, **Alt + R** resetuje. Tab w edytorze dodaje dwa odstępy.

## Publiczne API

Po załadowaniu dokumentu dostępne jest:

```js
window.logomocja.version // "1.0.0"
window.logomocja.run('powtorz 4 [np 100 pw 90]', '2d')
await window.logomocja.open('gora 90 np 100', '3d')
```

`run(source, mode)` jest synchroniczne i nie dotyka interfejsu. `open(source, mode)` ładuje i zapisuje szkic, wykonuje go bez animacji, dopasowuje widok i zwraca Promise po narysowaniu. Obie funkcje zwracają:

```js
{
  segments: [{ from: [0, 0, 0], to: [0, 100, 0], color: '#16866a', width: 3 }],
  error: null // albo { message: 'Polski komunikat', line: 1, column: 4 }
}
```

Każdy program jest w całości analizowany przed wykonaniem. Błędy składni dają pustą listę odcinków; błędy wykonania zachowują to, co narysowano, z uwzględnieniem wykonanych poleceń `czyść`. Dokumentacja wszystkich aliasów, składni, zakresów zmiennych, geometrii i limitów znajduje się w zakładce **Język**.

## Architektura

- `src/interpreter.ts`: niezależny tokenizer, parser, drzewo wyrażeń i wykonanie krokowe z limitami. Jedna implementacja obsługuje API, animację i walidację zadań.
- `src/view.ts`: Canvas 2D oraz Three.js / WebGL z lokalnym układem orientacji żółwia i kamerą OrbitControls. W 3D szerokości linii realizują `LineSegments2`.
- `src/main.ts`: dostępny interfejs, sterowanie, pliki, linki, motywy i lokalne szkice.
- `src/examples.ts`: 13 programów z briefu, bez zmian treści.
- `src/challenges.ts`: zadania i dwukierunkowe porównanie pokrycia geometrycznego. Tolerancja: 0,8 jednostki, próbki co najwyżej co 3 jednostki. Dopuszcza dzielenie odcinków i inny kolor, kolejność oraz rozwiązania bez procedury.
- `src/reference.ts`: pełna polska dokumentacja dialektu.
- `tests/`: testy regresyjne uruchamiane przez Bun.

## Testy przeglądarkowe

Opcjonalna weryfikacja interfejsu za pomocą Playwright:

```sh
bunx playwright install --with-deps chromium
bun run test:browser
```

Testy obejmują publiczny interfejs, sterowanie, kopie szkiców, pliki, linki, postępy, telefon, motywy i brak WebGL. Nie są potrzebne do zbudowania ani uruchomienia serwisu.
