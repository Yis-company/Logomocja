# Logomocja

Polskojęzyczne studio Logo: edytor, animacja i kroki, rysowanie 2D i przestrzenne 3D, 13 przykładów, 5 automatycznie sprawdzanych wyzwań, dokumentacja języka, pliki i udostępnianie. Bez kont i serwera aplikacji. Wszystkie zasoby, w tym fonty, są lokalne.

## Uruchomienie

```sh
bun install
bun run dev
```

## Budowanie i publikowanie

```sh
bun run build
# lub:
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Opublikuj zawartość `dist/` pod wskazaną ścieżką. To statyczne pliki; nie wymagają reguł przepisywania adresów. Nawigacja jest stanem aplikacji, a udostępniony program znajduje się w fragmencie URL. Strona po załadowaniu nie wykonuje żądań sieciowych do usług zewnętrznych. Lokalny podgląd: `bunx vite preview --host`.

## Testy

```sh
bun run test
bun run check
# opcjonalne testy przeglądarki, po uruchomieniu dev:
bunx playwright install chromium
bun run test:browser
```

Interpreter ma testy wszystkich standardowych programów, składni, pozycji błędów, geometrii, rekurencji, zakresów zmiennych, przerwań i limitów. Test przeglądarki wymaga zależności systemowych Chromium; na typowym Linuksie instaluje je `bunx playwright install-deps chromium`.

## Sterowanie

Ctrl/⌘ + Enter uruchamia, F7 wykonuje krok, F8 wstrzymuje/wznawia, F9 resetuje. Edycja zatrzymuje bieżące wykonanie. Widok: przeciąganie przesuwa w 2D i obraca w 3D, Shift lub prawy przycisk przesuwa w 3D. Dostępny jest także przycisk przełączający przesuwanie, również na telefonie. Kółko i przyciski +/− zmieniają skalę, dwuklik dopasowuje rysunek. Z fokusem na płótnie strzałki przesuwają, Alt+strzałki obracają kamerę 3D.

3D jest rzeczywistą projekcją ortograficzną współrzędnych XYZ na Canvas 2D. Kamera orbituje wokół sceny, ma siatkę i osie. WebGL nie jest potrzebne, więc brak WebGL nie wyłącza 3D. Rysunki płaskie mają identyczną geometrię w obu trybach.

Szkice 2D i 3D oraz postęp ćwiczeń zapisują się w localStorage. Przed wczytaniem programu zachowywany jest poprzedni szkic, dostępny pod pracownią. Wyzwania porównują dwustronnie pokrycie odcinków (próbki co 1/20 odcinka, tolerancja 1,5 jednostki); ignorują kolor i grubość.

## API testowe

```js
window.logomocja.version
window.logomocja.run('powtorz 4 [np 80 pw 90]', '2d')
await window.logomocja.open('gora 90 np 100', '3d')
```

`run` nie dotyka interfejsu. `open` wczytuje, wykonuje bez animacji i dopasowuje widok. Wynik: `{ segments, error }`, zgodnie z briefem. Parser najpierw waliduje cały program, a generator wykonuje go z zachowaniem rysunku przy błędzie wykonania.

## Struktura i projekt

- `src/interpreter.ts`: lexer, parser, walidacja, maszyna wykonania.
- `src/view.ts`: interaktywny renderer 2D/3D.
- `src/main.ts`: edytor, odtwarzanie, biblioteka, wyzwania i pliki.
- `src/examples.ts`: trzynaście oryginalnych programów.
- `DESIGN.md`, `.impeccable/`: system wizualny i przegląd wykonany według Impeccable 4.7.0.
- `public/fonts/`: Manrope (OFL), DejaVu Sans Mono (licencje obok fontów).
