# Logomocja

Polska pracownia Logo: edytor, żółw na płaszczyźnie i w prawdziwej przestrzeni 3D. Gotowa statyczna aplikacja bez kont, backendu, analityki ani połączeń z zewnętrznymi usługami podczas używania. Wszystkie biblioteki, ikony i fonty są lokalne.

## Uruchomienie

Wymagany Bun 1.2 lub nowszy.

```sh
bun install
bun run dev
```

Otwórz adres wypisany przez Vite (domyślnie `http://localhost:5173`). Na starcie czeka gotowa rozeta. Górna nawigacja prowadzi do 13 przykładów, 6 wyzwań i pełnego słownika języka.

## Budowanie i publikacja

```sh
bun run build
bun run preview
```

Build sprawdza typy TypeScript i tworzy samowystarczalny katalog `dist/`. Opublikuj całą jego zawartość na dowolnym hostingu statycznym. Pliki należy udostępniać przez HTTP/HTTPS; otwieranie `index.html` przez `file://` nie obsługuje modułów ES.

Dla podkatalogu ustaw ścieżkę podczas budowania:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Skopiuj zawartość `dist/` do `/Logomocja/builds/x/` na hoście. Ścieżka powinna zaczynać się i kończyć `/`. Nawigacja korzysta z fragmentów URL (`#studio`, `#examples`, `#challenges`, `#reference`), więc odświeżenie działa bez reguł przekierowań. Permalinki zachowują podkatalog.

Nie ma żądań do CDN ani zewnętrznych API. Po pobraniu strony i jej zasobów wszystkie funkcje działają lokalnie. Do ponownego otwarcia strony potrzebny jest hosting statyczny; aplikacja nie instaluje service workera.

## Testy

```sh
bun run test
```

34 testy obejmują wszystkie aliasy i standardowe programy, geometrię 2D/3D, wyrażenia i odstępy przy operatorach, procedury i rekurencję, zmienne i zakresy, błędy oraz ich pozycje, walidację przed wykonaniem, limity, wykonanie krokowe i sprawdzanie zadań. Długie wyrażenia są parsowane i obliczane iteracyjnie, bez zależności od limitu stosu JavaScript.

Opcjonalny test Chromium wymaga dodatkowo Node.js 22.18+ lub 24+ oraz Playwrighta z przeglądarką i jej bibliotekami systemowymi:

```sh
bunx playwright install --with-deps chromium
bun run test:browser
```

Test sam buduje i uruchamia zwykły serwer plików bez przekierowań. Sprawdza 13 przykładów, hook testowy, renderowanie 3D i brak WebGL, edytor i błędy, krok/pauzę/wznowienie, lokalne szkice i historię, zadania, routing, udostępnianie, import/eksport plików, PNG, motywy, nawigację klawiaturą i widoki 390/320 px. Weryfikuje brak zewnętrznych żądań i błędów JavaScript. Zrzuty zapisuje w `.playwright/`.

Ten sam test można wykonać pod podścieżką:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run test:browser
```

Instalowanie bibliotek systemowych przez `--with-deps` może wymagać uprawnień administratora; nie jest potrzebne do zwykłego budowania ani testów interpretera.

## Korzystanie

- **Uruchom** zawsze zaczyna program od początku. **Krok** wykonuje następne polecenie. **Pauza / Wznów** zachowuje stan; **Reset** czyści rysunek i wraca do początkowego żółwia. Tempo można zmieniać podczas rysowania.
- Edycja zatrzymuje aktualne wykonanie i zachowuje rysunek do następnego uruchomienia. Błąd składni nie rysuje nic; błąd wykonania zachowuje odcinki po ostatnim `czyść`.
- W 2D przeciąganie przesuwa płótno, a kółko zmienia skalę wokół kursora. Są też przyciski skali, dopasowania i resetu. Po ustawieniu fokusu na płótnie działają strzałki oraz `+` / `-`.
- W 3D przeciąganie obraca kamerę, prawy przycisk albo dwa palce przesuwają, kółko albo szczypanie przybliżają. Przyciski obrotu, skali i resetu są dostępne z klawiatury. Żółw ma znacznik oraz trzy kolorowe osie orientacji. 3D wymaga WebGL 2; jego brak nie blokuje 2D i jest objaśniony w podglądzie.
- Szkic każdego trybu, motyw i postępy zadań zapisują się w `localStorage`. Przed wczytaniem innego programu poprzedni szkic trafia do historii (ostatnie 20). Dla zmodyfikowanego szkicu aplikacja pokazuje też wyraźne potwierdzenie. Historia i pliki są pod ikoną folderu w edytorze.
- **Udostępnij** tworzy link zawierający program i tryb w fragmencie URL. Dane są kodowane UTF-8/base64url i, jeśli przeglądarka pozwala, kompresowane. Fragment nie jest wysyłany do serwera. Otwarty link ładuje, wykonuje i dopasowuje rysunek.
- Ikona pobierania nad rysunkiem eksportuje bieżący widok jako PNG. Menu plików zapisuje program jako zwykły tekst `.logo` i otwiera takie pliki w bieżącym trybie.
- Motyw początkowo podąża za systemem; przycisk słońca/księżyca ustawia i zapamiętuje ręczny wybór.

Skróty są też opisane w aplikacji:

| Działanie           | Skrót            |
| ------------------- | ---------------- |
| Uruchom od początku | Ctrl / ⌘ + Enter |
| Jeden krok          | Alt + →          |
| Pauza / wznów       | Alt + P          |
| Reset               | Alt + R          |

Tab swobodnie opuszcza edytor. Przyciski mają widoczny fokus, dialogi utrzymują fokus w oknie i obsługują Escape, a zmniejszenie animacji w ustawieniach systemowych jest respektowane przez interfejs.

## Hook do automatyzacji

Po załadowaniu aplikacji:

```js
window.logomocja.version; // "1.0.0"

// Czysty interpreter, bez zmiany interfejsu:
const result = window.logomocja.run("powtorz 4 [np 100 pw 90]", "2d");

// Wczytanie do edytora, wykonanie bez animacji i dopasowanie widoku:
const sameResult = await window.logomocja.open("gora 90 np 80", "3d");
```

Obie funkcje zwracają `{ segments, error }`. Odcinek ma `{ from: [x,y,z], to: [x,y,z], color, width }`; kolor jest małymi literami. Błąd to `null` lub `{ message, line, column }`, po polsku i z pozycjami od 1. `open` zachowuje poprzedni szkic w historii bez przerywania automatyzacji dialogiem; rozwiązuje obietnicę po wyrenderowaniu wyniku.

## Struktura

- `src/interpreter.ts` — tokenizer, parser całego programu, walidacja zakresów i maszyna wykonująca jako generator; niezależna od DOM.
- `src/view.ts` — Canvas 2D i renderer Three.js z OrbitControls. Odcinki 3D mają rzeczywistą geometrię, niezależną od ograniczeń szerokości linii WebGL.
- `src/main.ts` — edytor z warstwą składni, sterowanie, nawigacja, historia i pliki, motywy, hook i linki.
- `src/examples.ts` — trzynaście oryginalnych programów w niezmienionej postaci.
- `src/challenges.ts` — sześć zadań i porównywanie geometrii w obu kierunkach; tolerancja 1,2 jednostki i 2,5% sumy długości. Kolor, grubość i kolejność linii nie wpływają na ocenę.
- `src/reference.ts` — kompletny słownik wraz z przykładami, regułami i limitami.
- `tests/` — testy Bun; `scripts/browser-check.mjs` — dodatkowa weryfikacja prawdziwej przeglądarki.

Vite i TypeScript służą tylko do budowania. Używane fonty: DM Sans, Lora i IBM Plex Mono. Licencje fontów (SIL OFL) i Three.js (MIT) są w `public/licenses/` i trafiają do `dist/licenses/`.
