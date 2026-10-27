# Logomocja

Polskojęzyczne studio grafiki żółwia Logo: piszesz program, uruchamiasz go i patrzysz, jak żółw rysuje — na płaszczyźnie (2D) albo w przestrzeni z kamerą, którą można obracać, przesuwać i przybliżać (3D). Działa na komputerze i w telefonie. Nie ma kont, serwera ani sieci w trakcie działania; ostatni program zapisuje się w `localStorage`.

## Uruchomienie

Wymagane: [Bun](https://bun.sh) (1.x).

```sh
bun install
bun run dev        # serwer deweloperski (Vite)
bun run build      # sprawdzenie typów + statyczna strona w dist/
bun run preview    # podgląd zbudowanej strony
bun test           # testy interpretera
```

`bun run build` tworzy w `dist/` gotową, statyczną stronę bez kodu serwerowego i bez żądań sieciowych w trakcie działania.

### Podścieżka (`BASE_PATH`)

Zmienna `BASE_PATH` (domyślnie `/`) określa, pod jaką ścieżką strona będzie działać:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Wszystkie odwołania do zasobów w `dist/` zaczynają się od tej ścieżki, więc strona działa na zwykłym hostingu plików bez reguł przepisywania. Aplikacja nie ma tras, więc odświeżenie strony na dowolnym adresie w tej ścieżce działa bez dodatkowej konfiguracji.

## Obsługa

- **Uruchom** (Ctrl+Enter / Cmd+Enter) — wykonuje cały program.
- **Krok** — wykonuje jedno polecenie. Każde polecenie to jeden krok, także w pętlach i procedurach.
- **Odtwórz / Pauza** — wykonuje program automatycznie; suwak „Tempo” ustawia liczbę poleceń na sekundę.
- **Reset** — czyści rysunek i zatrzymuje program.
- **Dopasuj** — dopasowuje widok do rysunku. Po zakończeniu programu widok dopasowuje się sam.
- **2D / 3D** — przełącza tryb. W 2D przeciągnij, aby przesunąć, a kółkiem myszy lub gestem szczypania — przybliżyć. W 3D przeciągnij, aby obrócić, prawym przyciskiem lub dwoma palcami — przesunąć, kółkiem — przybliżyć.
- **Wczytaj** — wstawia jeden z wbudowanych przykładów.

Błąd pokazuje się pod edytorem z numerem wiersza i kolumny. Kliknięcie w komunikat przenosi kursor do miejsca błędu.

### Edycja w trakcie działania

Zmiana programu podczas wykonywania zatrzymuje go i zaznacza, że rysunek nie odpowiada już tekstowi. Następny **Krok**, **Odtwórz** lub **Uruchom** zaczyna nowy przebieg od początku, czyszcząc rysunek.

### Tryb 3D bez WebGL

Jeśli przeglądarka nie udostępnia WebGL, przycisk 3D jest wyłączony, a w rysunku pojawia się informacja, dlaczego. Tryb 2D działa bez zmian. Kod 3D (three.js) ładuje się dopiero przy pierwszym wejściu w tryb 3D.

## Język

Składnia i semantyka są opisane w specyfikacji projektu. Najważniejsze:

| Polecenie | Angielski alias | Działanie |
| --- | --- | --- |
| `np d`, `naprzód d` | `fd d` | Naprzód o `d` |
| `ws d`, `wstecz d` | `bk d` | Wstecz o `d` |
| `pw a`, `prawo a` | `rt a` | Obrót w prawo o `a` stopni |
| `lw a`, `lewo a` | `lt a` | Obrót w lewo o `a` stopni |
| `pod`, `podnieś` | `pu` | Podnieś pisak |
| `opu`, `opuść` | `pd` | Opuść pisak |
| `kolor "#rrggbb"` | `color` | Kolor pisaka |
| `grubość n` | `width n` | Grubość linii, 1–12 |
| `powtórz n [ … ]` | `repeat` | Powtórzenie bloku, `n` w zakresie 0–10 000 |
| `góra a` | `pitchup a` | Pochylenie nosa w górę (tylko 3D) |
| `dół a` | `pitchdown a` | Pochylenie nosa w dół (tylko 3D) |
| `oto nazwa ma: a, b … już` | `to … end` | Procedura z parametrami |

- Słowa kluczowe nie rozróżniają wielkości liter; polskie i angielskie formy są równoważne.
- Średnik zaczyna komentarz.
- Parametry można używać jako liczb (`np bok`) lub w starym stylu (`np :bok`). Nagłówek `oto nazwa :a :b` też jest akceptowany.
- Procedury mogą występować przed lub po wywołaniu. Rekurencja, bezpośrednia i pośrednia, jest błędem, nawet jeśli wywołanie nie zostałoby wykonane.
- Program z samymi poleceniami płaskimi daje identyczne współrzędne w 2D i 3D.

### Limity

| Limit | Wartość | Kiedy |
| --- | --- | --- |
| Znaki źródła | 50 000 | przed uruchomieniem |
| Tokeny | 10 000 | przed uruchomieniem |
| Zagnieżdżenie nawiasów | 32 | przed uruchomieniem |
| Zagnieżdżenie ramek (pętle i procedury) | 32 | w czasie działania |
| Operacje | 10 000 | w czasie działania |
| Narysowane odcinki | 10 000 | w czasie działania |
| Współrzędne | ±100 000 | w czasie działania |

Operacje to każde wykonane polecenie oraz każdy obieg pętli i każde wywołanie procedury. Błędy wykrywane przed uruchomieniem (składnia, zakresy literałów, tryb, rekurencja) nie rysują niczego. Błędy z czasu działania (limity, zakres parametru przekazanego do `grubość` lub `powtórz`) zatrzymują program i zostawiają to, co już narysowano.

## Testowy interfejs

Po załadowaniu strony `window.logomocja` ma pola:

- `version` — wersja aplikacji (tekst),
- `run(source, mode)` — interpretuje program bez dotykania interfejsu (`mode` to `"2d"` albo `"3d"`) i zwraca `{ segments, error }`.

`segments` to odcinki w kolejności rysowania, każdy jako `{ from: [x, y, z], to: [x, y, z], color, width }` z kolorem w postaci `#rrggbb`. `error` to `null` albo `{ message, line, column }`. Przy błędzie składniowym `segments` jest puste; przy błędzie w czasie działania zawiera to, co narysowano wcześniej.

## Struktura

```
src/logo/       język: leksyka, parser i walidacja, maszyna żółwia, limity, przykłady
src/render/     rysowanie: płaszczyzna (Canvas 2D), przestrzeń (three.js), sprawdzenie WebGL
src/ui/         interfejs: edytor, sterowanie wykonaniem, zapis w localStorage
tests/          testy interpretera (bun test)
```

Interpreter działa jako generator: każde polecenie to punkt zatrzymania. Dzięki temu krok po kroku, pauza i wznowienie używają tej samej ścieżki co uruchomienie całego programu.
