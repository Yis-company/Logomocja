# Logomocja

Polskojęzyczna pracownia rysowania żółwiem: edytor Logo, płaszczyzna 2D i prawdziwa geometria przestrzenna 3D. Wszystko działa w przeglądarce, bez kont, backendu i zewnętrznych żądań w czasie działania.

## Uruchomienie

Wymagany Bun.

```sh
bun install
bun run dev
```

Vite poda lokalny adres (domyślnie http://localhost:5173).

## Build statyczny

```sh
bun run build
```

Gotowa witryna znajduje się w `dist/`. Wystarczy dowolny statyczny serwer HTTP. Żadne reguły przekierowań ani kod serwerowy nie są potrzebne. Podgląd lokalny: `bun run preview`.

Budowanie dla podkatalogu:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść zawartość `dist/` pod wskazaną ścieżką. Domyślne `BASE_PATH` to `/`. Zasoby, fonty oraz licencje są lokalne. Linki programów używają fragmentu `#p=…`, więc odświeżenie na statycznym hostingu działa bez przepisywania adresów.

## Testy

```sh
bun run test
```

52 testy interpretera obejmują wszystkie 13 przykładów, aliasy, operatory i ich odstępy, pozycje błędów, zakresy zmiennych, procedury, rekurencję, liczniki leksykalne, operacje, ramki, współrzędne i orientację 3D. Wyrażenia blisko limitu 10 000 tokenów są obsługiwane iteracyjnie, bez dodatkowego limitu stosu JavaScript.

Opcjonalne testy przeglądarkowe (wymagają Chromium Playwright i jego bibliotek systemowych):

```sh
bunx playwright install --with-deps chromium
# W drugim terminalu uruchom bun run dev.
bun run test:browser
bun run test:responsive
```

`TEST_URL=http://localhost:4173/Logomocja/builds/x/ bun run test:browser` sprawdza również build umieszczony pod podścieżką. Zestaw sprawdza API, wszystkie przykłady i wyzwania, błędy, kroki, pauzę, zapis i historię, udostępnianie, pliki, PNG, motyw i brak zewnętrznych żądań. Test responsywności sprawdza studio, wyzwania i słownik przy szerokościach 320, 360, 390, 760, 768, 1024 i 1440 px.

Weryfikacja wykonana w Chromium: oba buildy (domyślny i `/Logomocja/builds/x/`) oraz powyższe przepływy przeszły. Materiały przeglądu znajdują się w `.impeccable/review/`.

## Korzystanie

- **Uruchom** wykonuje program z animacją. **Krok** przechodzi przez kolejne polecenia; **Pauza** zatrzymuje i wznawia. Tempo jest regulowane suwakiem.
- **Reset** czyści wykonanie, zachowując kod. Edycja zatrzymuje bieżące wykonanie; kolejny start wykonuje nową wersję od początku.
- W 2D przeciąganie przesuwa planszę. W 3D przeciąganie obraca kamerę, Shift lub prawy przycisk myszy przesuwa. Dwa palce przesuwają i przybliżają. Kółko i przyciski +/− zmieniają skalę.
- **Dopasuj** obejmuje cały rysunek; **Reset kamery** przywraca początkowe ustawienie. Siatkę z osiami można wyłączyć.
- Każdy tryb zachowuje własny szkic. Przed wczytaniem przykładu, pliku, zadania lub linku poprzedni szkic trafia do **Wersji** (ikona zegara przy nazwie pliku, do 30 wersji). Komunikat umożliwia szybkie przywrócenie.
- **Wyzwania** zawierają pięć wzorów, podpowiedzi i automatyczne sprawdzanie. Sprawdzamy pokrycie odcinków w obie strony z tolerancją 0,8 jednostki, niezależnie od koloru, grubości, podziału i kolejności. Wynik wyjaśnia błąd; ukończone zadania zapisują się lokalnie.
- **Słownik poleceń** opisuje pełny dialekt, przykłady każdego polecenia, wyrażenia, zmienne, procedury, limity i obsługę.
- **Udostępnij** kopiuje link zawierający kod i tryb. Otwarty link uruchamia program. Gdy schowek jest niedostępny, link można skopiować z pola. Edycja usuwa stary fragment linku, by odświeżenie nie nadpisało nowego szkicu.
- **PNG** eksportuje aktualny kadr bez siatki i znacznika. Program można pobrać i otworzyć jako tekstowy plik `.logo` UTF-8.
- Motyw przełącza się w kolejności systemowy → ciemny → jasny → systemowy. Wybór jest zapamiętywany.

Skróty: Ctrl/⌘+Enter — uruchom/wznów; F10 — krok; F8 — pauza/wznów; Shift+Esc — reset. Tab w edytorze wstawia dwa odstępy, Esc oddaje fokus do przycisku uruchomienia. Na planszy: strzałki, Shift+strzałki w 3D, +/− oraz 0. Wszystkie skróty są też opisane w interfejsie.

## Architektura

- `src/interpreter.js`: tokenizer z pozycjami źródłowymi, parser całego programu, iteracyjne wyrażenia, generator wykonania i czysta funkcja `run`. Bez `eval` i bez wykonywania JavaScript z programu użytkownika. Błędy składni dają pusty rysunek, błędy wykonania zachowują już narysowane odcinki. Limity i liczenie operacji pochodzą z briefu.
- `src/view.js`: Canvas 2D i ortograficzna projekcja współrzędnych 3D. Żółw ma trzy obracane lokalne wektory: kierunek, prawą stronę i górę. Kamera nie zmienia danych rysunku. Ten renderer nie wymaga WebGL, więc widok przestrzenny pozostaje dostępny również bez niego. Niebieska kreska przy żółwiu w 3D wskazuje jego lokalną górę.
- `src/app.js`: edytor z warstwą kolorowania, znaczniki błędów, animacja i sterowanie, zapis, pliki, linki i zadania.
- `src/examples.js`: 13 programów w oryginalnym brzmieniu oraz 5 zadań.
- `src/reference.js`: polska dokumentacja pełnego języka.
- `src/style.css`: motywy, stany i układ responsywny. Fonty Inter i JetBrains Mono są pakowane lokalnie; licencje OFL znajdują się w `public/licenses/` i w buildzie.

## API do testów

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"
window.logomocja.run('powtorz 4 [np 100 pw 90]', '2d');
await window.logomocja.open('gora 90 np 100', '3d');
```

`run(source, mode)` jest synchroniczny i nie zmienia UI. `open(source, mode)` wczytuje program do edytora, wykonuje go bez animacji, dopasowuje widok i rozwiązuje obietnicę po narysowaniu. Obie funkcje zwracają `{ segments, error }`. Odcinki mają `{ from: [x,y,z], to: [x,y,z], color, width }`, a błąd `{ message, line, column }` lub `null`.

## Projekt wizualny

Zastosowano Impeccable 4.7.0 w trybie Operate. Decyzje zapisano w `PRODUCT.md`, `.impeccable/surface.md`, `DESIGN.md` i `.impeccable/design.json`. Kierunek to współczesny zeszyt matematyczny: chłodna jasna powierzchnia, zielony atrament, prawdziwa geometria zamiast dekoracji. Przegląd końcowy przeprowadzono w wątku, bez agentów delegowanych i bez generowania obrazów. Chromium uruchomiono przez CLI; brakujące biblioteki kontenera uzupełniono w katalogu tymczasowym bez zmian uprawnień systemowych.
