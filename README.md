# Logomocja

Polskojęzyczne, lokalne studio Logo: edytor, płaskie i przestrzenne rysowanie żółwiem, 13 oryginalnych przykładów, 5 automatycznie sprawdzanych wyzwań i pełny słownik języka. Bez konta, backendu i połączeń sieciowych w czasie działania.

## Uruchomienie

Wymagany Bun.

```sh
bun install
bun run dev
```

Otwórz adres wyświetlony przez Vite (domyślnie `http://localhost:5173`).

## Budowanie statycznej strony

```sh
bun run build
```

Wynik w `dist/` można umieścić na dowolnym statycznym serwerze HTTP. Do lokalnego podglądu: `python3 -m http.server 8080 --directory dist`.

Dla zagnieżdżonej ścieżki:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść zawartość `dist/` dokładnie pod `/Logomocja/builds/x/`. Nie są potrzebne reguły przepisywania URL. Nawigacja działa w jednej stronie; udostępnione programy są zakodowane w fragmencie `#program=…`. Zasoby, style i kod są lokalne, bez zewnętrznych fontów, CDN ani zapytań API. Do działania aplikacji nie jest potrzebny WebGL: widok 3D to ortograficzna projekcja rzeczywistych współrzędnych XYZ w Canvas 2D.

## Testy

```sh
bun run test
```

Testy obejmują wszystkie programy wzorcowe, aliasy, operatory, składnię, pozycje błędów, zakresy zmiennych, rekurencję, limity, geometrię 3D i zgodność wykonywania krokowego z pełnym przebiegiem.

Opcjonalne testy przeglądarkowe (przy uruchomionym serwerze):

```sh
bunx playwright install --with-deps chromium
node scripts/browser-check.mjs
# alternatywny serwer, także pod zagnieżdżoną ścieżką:
TEST_URL=http://localhost:8080/Logomocja/builds/x/ node scripts/browser-check.mjs
```

Skrypt sprawdza interfejs, wszystkie przykłady, API testowe, błędy, kroki, wyzwania, kopie, dokumentację, odświeżanie, permalink i widok mobilny. Zapisuje zrzuty do `/tmp/logomocja-*.png`.

## Korzystanie

- **Ctrl/⌘ + Enter** uruchamia program od początku; **Alt+S** wykonuje krok; **Alt+P** zatrzymuje/wznawia; **Alt+R** resetuje żółwia i rysunek. Tempo reguluje suwak.
- Edycja zatrzymuje wykonanie. Dotychczasowy obraz zostaje do następnego uruchomienia. Błąd składni czyści wynik; błąd wykonania zachowuje odcinki narysowane do błędu.
- W 2D przeciąganie przesuwa widok. W 3D obraca kamerę; Shift albo przycisk przesuwania zmienia gest w przesuwanie. Kółko i przyciski ± regulują skalę. Po zaznaczeniu płótna działają również strzałki, Shift i ±. Dostępne są dopasowanie i reset kamery.
- Przycisk `···` nad kodem otwiera pliki `.logo` i lokalne kopie. Przykłady, wyzwania, importy oraz API `open` zachowują zastępowany szkic; przy zmianie trybu zachowują również szkic docelowego trybu. Trzymamy 30 kopii. Każdy tryb ma niezależny szkic w localStorage.
- PNG eksportuje bieżący widok z siatką i żółwiem. Udostępnienie kopiuje link zawierający kod i tryb; gdy schowek jest niedostępny, pokazuje link do ręcznego skopiowania. Otwarcie linku uruchamia program i dopasowuje widok.
- Wyzwania porównują nieuporządkowany zbiór odcinków (kierunek odcinka jest dowolny) ze wzorcem, z tolerancją 0,5 jednostki na współrzędną. Wymagana jest taka sama liczba odcinków; kolor i grubość nie mają znaczenia. Wyniki zapisują się lokalnie.
- Motyw można przełączać kolejno: systemowy → jasny → ciemny → systemowy.

## API do automatycznej weryfikacji

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"
window.logomocja.run('powtorz 4 [np 100 pw 90]', '2d');
await window.logomocja.open('gora 90 np 100', '3d');
```

`run` jest synchroniczne, nie dotyka UI. `open` zwraca Promise po wczytaniu kodu, wykonaniu i narysowaniu dopasowanego wyniku. Obie metody zwracają `{ segments, error }`. Każdy odcinek ma `{ from: [x,y,z], to: [x,y,z], color, width }`; błąd to `null` albo `{ message, line, column }`.

## Struktura

- `src/interpreter.js` — tokenizacja z pozycjami, walidacja całego programu, AST i generator krokowego wykonania. Jeden silnik dla UI i API.
- `src/view.js` — Canvas, projekcja 2D/3D, kamera, siatka, osie i orientacja żółwia.
- `src/examples.js` — trzynaście programów wzorcowych.
- `src/main.js` — edytor, wyzwania, słownik, pliki, linki, lokalny zapis i dostępność.
- `src/style.css` — responsywny interfejs, jasny i ciemny motyw.
- `src/interpreter.test.js` — testy Bun.
- `scripts/browser-check.mjs` — opcjonalny test Playwright.

Programy nie są wykonywane przez JavaScript `eval`. Interpreter ma limity podane w słowniku. localStorage jest jedynym magazynem danych; jego wyczyszczenie usuwa szkice, kopie i postęp.
