# Logomocja

Polskojęzyczne studio do rysowania żółwiem, inspirowane klasycznym środowiskiem Logo. Działa w dwóch trybach: **Plan 2D** (płaszczyzna) i **Przestrzeń 3D** (żółw w trzech wymiarach). Bez kont, bez serwera i bez sieci w czasie działania.

## Uruchomienie

Wymagany jest [Bun](https://bun.sh).

```sh
bun install          # zależności (jednorazowo)
bun run dev          # serwer deweloperski z przeładowaniem
bun run build        # statyczna strona w katalogu dist/
bun run preview      # podgląd zbudowanej strony
bun run test         # testy interpretera, przykładów i wyzwań
```

### Podścieżka

Zmienna `BASE_PATH` (domyślnie `/`) określa, pod jakim adresem działa strona:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Katalog `dist/` działa z dowolnego statycznego hosta bez reguł przepisywania. Trasy są w hashu (`#/`, `#/wyzwania`, `#/pomoc`), więc odświeżenie strony nie zależy od serwera.

## Co jest w środku

- **Interpreter** (`src/logo/`): leksyker, parser z rozwiązywaniem nazw i sprawdzaniem zakresów, maszyna wykonująca program jako generator. Każde polecenie oddaje swoją pozycję przed wykonaniem, dzięki czemu krok, pauza i podświetlenie działają bez osobnej ścieżki kodu.
- **Interfejs** (`src/ui/`): edytor z nakładką podświetlającą (textarea + kopia z kolorami o tych samych metrykach), widok 2D, widok 3D z kamerą orbitującą, strona pomocy, wyzwania, routing i motyw.
- **Przykłady** (`src/logo/examples.ts`): trzynaście standardowych programów, bajt w bajt.
- **Wyzwania** (`src/logo/challenges.ts`): sześć zadań. Sprawdzarka porównuje rysunek ze wzorem w obie strony (próbkowanie odcinków, odległość do najbliższego odcinka wzoru) z tolerancją podaną w wyzwaniu.

### Testowy hook

Po załadowaniu strony `window.logomocja` ma:

- `version: string`
- `run(source, mode)` — zwraca `{ segments, error }` bez dotykania interfejsu;
- `open(source, mode)` — wczytuje program do edytora, wykonuje go do końca bez animacji, dopasowuje widok i zwraca `{ segments, error }` po narysowaniu.

## Decyzje projektowe

- **3D bez WebGL.** Przestrzeń jest rysowana na zwykłym `<canvas>` z perspektywą. Dzięki temu 3D działa wszędzie, gdzie działa 2D, i nie wymaga sprawdzania WebGL.
- **Ten sam ciąg współrzędnych w 2D i 3D.** Programy płaskie dają identyczne odcinki w obu trybach, bo obie ścieżki korzystają z tej samej maszyny. Funkcje sin/cos są dokładne dla wielokrotności 90°, więc proste figury trafiają w pełne współrzędne.
- **Błędy składni a wykonania.** Błąd składni (w tym `gora` w trybie 2D czy `nrpowt` poza powtórz) nie rysuje niczego. Błąd wykonania zostawia rysunek sprzed błędu.
- **Liczenie operacji.** Każde polecenie, przypisanie, warunek, powtórzenie i wywołanie to jedna operacja. Koniec obiegu powtórzenia, bloku warunkowego lub wywołania dodaje kolejną, także wtedy, gdy blok zakończył się przez `stop`. Koniec programu się nie liczy.
- **Limit odcinków.** Przy limicie 10 000 operacji i limicie 10 000 symboli w praktyce nie da się narysować 10 000 odcinków, więc ten limit jest egzekwowany, ale nie jest osiągalny z programu.
- **Schowek szkiców.** Wczytanie przykładu, pliku lub wyzwania nigdy nie kasuje szkicu: poprzedni tekst zostaje zapisany i można go przywrócić przyciskiem w pasku stanu.
- **Edycja w trakcie wykonywania.** Zmiana programu w trakcie animacji przerywa wykonanie, a rysunek się czyści. Po zakończeniu rysunek zostaje do kolejnego uruchomienia.

## Struktura

```
src/
  logo/        interpreter (lexer, parser, machine), examples, challenges
  ui/          editor, views, pages, router, theme, storage, share
  main.ts      entry point and window.logomocja
  style.css    tokens for light/dark, layout, responsive rules
tests/         bun test suites
```

## Testy

`bun run test` uruchamia testy interpretera (składnia, wyrażenia, geometria 2D/3D, zmienne, procedury, limity, błędy), testy trzynastu przykładów oraz sprawdzarki wyzwań. Testy przeglądarkowe nie są częścią projektu.
