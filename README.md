# Logomocja

Polskojęzyczne studio Logo: edytor, rysowanie żółwiem na płaszczyźnie i w przestrzeni, 13 przykładów, 6 sprawdzanych wyzwań i pełny przewodnik po języku. Bez kont, backendu i zewnętrznych usług. Fonty i wszystkie zasoby są lokalne.

## Uruchomienie

```sh
bun install
bun run dev
```

Vite poda lokalny adres (domyślnie `http://localhost:5173`).

## Build statyczny

```sh
bun run build
```

Wynik jest w `dist/`. Katalog można udostępnić dowolnym serwerem plików statycznych, np. `python3 -m http.server 4173 --directory dist`.

Dla hostowania pod ścieżką:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść zawartość `dist/` w `/Logomocja/builds/x/` hosta. Nawigacja używa fragmentu URL (`#studio`, `#challenges`, `#guide/limits`, `#p=…`), więc odświeżenie nie wymaga reguł przepisywania adresów. Build nie zawiera kodu serwerowego, CDN, analityki ani wywołań API.

## Testy

```sh
bun run test
```

207 testów interpretera i sprawdzania wyzwań: wszystkie przykłady i aliasy, priorytety i odstępy operatorów, lokalność zmiennych, procedury i rekurencja, leksykalny licznik, dokładne warunki, geometria 2D/3D, zachowanie częściowego wyniku, pozycje błędów i limity. Build dodatkowo uruchamia kontrolę typów TypeScript.

Dodatkowy sprawdzian przeglądarkowy (w drugim terminalu uruchom `bun run dev`):

```sh
bunx playwright install chromium
bun run test:browser
```

Chromium wymaga zwykłych bibliotek systemowych Playwright; na standardowym środowisku developerskim można je zainstalować przez `bunx playwright install-deps chromium`. Test sprawdza publiczne API, wszystkie przykłady, sterowanie wykonaniem, edycję, skróty, szkice, linki, import/eksport, wyzwania i postęp, przewodnik, błędy, klawiaturę oraz brak zewnętrznych żądań. `TEST_URL` pozwala wskazać inny adres aplikacji.

## Obsługa

- **Uruchom** wykonuje program z animacją; **Od razu** wykonuje go natychmiast. **Krok**, pauza/wznowienie i reset są obok edytora. Suwak zmienia tempo. Edycja wstrzymuje wykonanie; następne uruchomienie zaczyna nową wersję programu.
- **2D:** przeciąganie przesuwa planszę, kółko przybliża. **3D:** przeciąganie obraca kamerę, Shift + przeciąganie lub prawy przycisk przesuwa. Dwoma palcami można przesuwać i przybliżać. Przyciski planszy dopasowują rysunek, zmieniają skalę, resetują kamerę i przełączają siatkę.
- Plansza ma obsługę klawiatury: strzałki, Shift + strzałki w 3D, `+`, `-`, `F` lub `0`. Żółw pokazuje kierunek, a w 3D także wektory góry (niebieski) i prawego boku (czerwony).
- **Ctrl / ⌘ + Enter:** uruchom/wznów. **F10:** krok. **F8:** pauza/wznów. **Shift + Escape:** reset. Tab przechodzi normalnie między kontrolkami, także z edytora.
- Każdy tryb ma osobny automatycznie zapisany szkic. Otwarcie przykładu, pliku i linku zachowuje poprzedni kod w **Szkicach** (30 ostatnich wersji). Dane są wyłącznie w local storage tej przeglądarki.
- **Udostępnij** kopiuje URL z UTF-8 programu i trybem; otwarcie uruchamia go automatycznie. W razie niedostępnego schowka pojawia się pole do ręcznego kopiowania. **.logo** pobiera kod, **Otwórz plik** odczytuje tekst UTF-8. **Eksport PNG** zapisuje bieżący widok planszy, z siatką i żółwiem.
- Wyzwania sprawdzają obustronne pokrycie odcinków w przestrzeni, z tolerancją 1,2 jednostki. Można dzielić odcinki i zmieniać kolejność, kolor oraz grubość. Nadmiarowe i brakujące krawędzie mają różne komunikaty. Postęp zapisuje się lokalnie.
- Przycisk słońca/księżyca przełącza kolejno motyw systemowy, jasny i ciemny.

## Architektura

- `src/interpreter.ts`: tokenizer z pozycjami, pełna walidacja przed wykonaniem, iteracyjny parser wyrażeń i ewaluator, generator operacji, lokalne środowiska wywołań oraz wektorowa orientacja żółwia. `Execution.step()` i `finish()` korzystają z tego samego silnika.
- `src/view.ts`: renderowanie Canvas 2D oraz prawdziwa ortograficzna projekcja współrzędnych XYZ, z orbitowaniem kamery i sortowaniem głębokości. 3D działa bez WebGL i nie zależy od dostępności jego sterownika.
- `src/examples.ts`: 13 źródeł z briefu; miniatury powstają z tych samych programów i interpretera.
- `src/challenges.ts`: zadania i geometryczny sprawdzian.
- `src/main.ts`, `src/style.css`: interfejs, edytor, pliki, motywy, udostępnianie i zapis lokalny.
- `src/reference.ts`: dokumentacja wszystkich aliasów, poleceń i reguł języka.

## Publiczny hook

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"
window.logomocja.run('powtorz 4 [np 100 pw 90]', '2d');
await window.logomocja.open('gora 90 np 80', '3d');
```

Obie metody zwracają `{ segments, error }`. Segment ma `from`, `to` (trzy liczby), `color` (małe litery hex) i `width`. Błąd ma polskie `message` oraz `line` i `column` liczone od 1. `run` nie zmienia UI. `open` aktualizuje edytor, wykonuje kod bez animacji i dopasowuje widok przed rozwiązaniem Promise. Błąd parsowania daje pusty rysunek; błąd wykonania zachowuje wcześniejsze odcinki.

## Projekt i przegląd

Decyzje produktowe: `PRODUCT.md`. System wizualny: `DESIGN.md` i `.impeccable/design.json`. Kierunek i kontrakt powierzchni: `.impeccable/surfaces/studio.md`. Wynik przeglądu: `.impeccable/review/REVIEW.md`. Zrzuty obejmują desktop, telefon, dodatkowe szerokości, tryb ciemny, 3D, błędy, wykonanie krokowe, wyzwania i przewodnik.

Zastosowano Impeccable 4.7.0. Zgodnie z ograniczeniami briefu projekt powstał bez generowania obrazów i delegowanych agentów; przegląd końcowy i dokumentację wykonano w tym samym wątku. Zrzuty i sprawdzenie interakcji wykonano lokalnym Chromium przez CLI Playwright, bez MCP. Fonty Manrope i JetBrains Mono są dystrybuowane przez pakiety Fontsource na licencji SIL OFL (pliki licencji w pakietach).
