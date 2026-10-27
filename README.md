# Logomocja

Polska pracownia Logo: edytor, płótno 2D i przestrzeń 3D z kamerą orbitalną. Wszystkie zasoby są lokalne; aplikacja nie wymaga konta, serwera aplikacyjnego ani połączenia z siecią po załadowaniu. Szkic jest zapisywany w localStorage.

## Uruchomienie

```sh
bun install
bun run dev
```

## Kompilacja i testy

```sh
bun test
bun run build
```

Folder `dist/` można umieścić na dowolnym statycznym hostingu. Dla podkatalogu:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Udostępnij zawartość `dist/` dokładnie pod tą ścieżką. Aplikacja ma jeden dokument i nie wymaga reguł przekierowań. Do lokalnego podglądu produkcyjnego można użyć `bunx vite preview --host 0.0.0.0`.

## Obsługa

Uruchom wykonuje program, Pauza wstrzymuje, Wznów kontynuuje, Krok wykonuje następną operację (również wejście w powtórzenie lub procedurę), a ↺ czyści rysunek. Edycja zatrzymuje wykonanie; następne uruchomienie zaczyna od nowa. Ctrl/Cmd+Enter uruchamia lub wstrzymuje. Przykłady zastępują bieżący szkic. Ściągawka opisuje składnię.

2D automatycznie dopasowuje rysunek. W 3D przeciąganie obraca kamerę, prawy przycisk przesuwa, kółko przybliża; na ekranie dotykowym jeden palec obraca, dwa przesuwają i przybliżają. Przycisk Dopasuj obejmuje cały rysunek. Brak WebGL wyłącza wyłącznie widok 3D i pokazuje komunikat. Grubość kreski w widoku WebGL zależy od obsługi linii przez przeglądarkę; pełna wartość jest zachowana w interpreterze.

## Interpreter

`src/interpreter.js` jest niezależny od DOM. Najpierw tokenizuje i waliduje wszystkie definicje oraz polecenia, następnie wykonuje generator operacji z limitami. Obsługuje polskie i angielskie aliasy, procedury z parametrami, zagnieżdżone powtórzenia i lokalny układ współrzędnych żółwia.

Po załadowaniu strony dostępne jest:

```js
window.logomocja.version
window.logomocja.run('powtórz 4 [np 80 pw 90]', '2d')
// { segments: [{ from, to, color, width }, ...], error: null }
```

Tryb `3d` w tym API działa także bez WebGL. Błędy zawierają polski komunikat, wiersz i kolumnę. API nie zmienia stanu interfejsu.

Dodatkowy test interfejsu (wymaga Chromium i jego bibliotek systemowych): uruchom serwer developerski, wykonaj `bunx playwright install chromium`, następnie `node scripts/browser-check.mjs`. Można podać `TEST_URL` dla innego adresu, także podkatalogu. Test sprawdza uruchomienie, kroki, zapis szkicu, pomoc i szerokość mobilną.
