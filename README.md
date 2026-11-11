# Logomocja

Polska pracownia grafiki żółwia: piszesz program w dialekcie Logo, żółw rysuje go na arkuszu, na płaszczyźnie (2D) albo w przestrzeni (3D). Aplikacja jest w całości statyczna: po zbudowaniu to katalog plików, bez serwera i bez ruchu sieciowego w czasie działania.

## Uruchomienie

Wymagany jest [Bun](https://bun.sh) 1.1 lub nowszy.

```sh
bun install
bun run build      # buduje dist/
bun run serve      # podaje dist/ pod http://localhost:4173/
bun run dev        # build + serve
bun run test       # testy interpretera i zadań
```

`bun run serve` to tylko podgląd lokalny (`serve.ts`); do `dist/` nie trafia żaden kod serwera. Port można podać jako argument: `bun run serve.ts 8080`.

## Budowanie i ścieżka bazowa

`bun run build` tworzy samowystarczalny katalog `dist/`: `index.html`, jeden plik JS i jeden CSS (z haszem w nazwie), `icon.svg` i `fonts/`.

Zmienna `BASE_PATH` (domyślnie `/`) mówi, pod jaką ścieżką aplikacja będzie hostowana:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
BASE_PATH=/Logomocja/builds/x/ bun run serve   # podgląd pod tą samą ścieżką
```

Wszystkie odwołania do zasobów są względne, a nawigacja używa fragmentu adresu (`#/przyklady`, `#/zadania/domek`, `#/polecenia`), więc zwykły hosting statyczny wystarcza: bez przepisywania adresów i bez reguł zapasowych. Gdy ktoś otworzy adres bez końcowego ukośnika (`/Logomocja/builds/x`), strona sama go dopisze, żeby ścieżki względne się zgadzały. `dist/index.html` działa także otwarty prosto z dysku.

## Co jest w środku

| Widok | Adres | Zawartość |
| --- | --- | --- |
| Pracownia | `#/` | edytor, arkusz 2D/3D, uruchamianie, krok, pauza, reset, tempo |
| Przykłady | `#/przyklady` | trzynaście programów wzorcowych, każdy otwiera się we właściwym trybie |
| Zadania | `#/zadania` | osiem zadań ze wzorem i automatycznym sprawdzaniem |
| Polecenia | `#/polecenia` | opis całego dialektu z działającymi przykładami |

- **Edytor**: numery wierszy, kolorowanie składni, znacznik błędu w wierszu i kolumnie z polskim komunikatem, podświetlenie wykonywanego wiersza.
- **Wykonanie**: błąd wykryty przed startem nie rysuje niczego; błąd w trakcie zostawia to, co już narysowane. Zmiana programu w trakcie rysowania zatrzymuje wykonanie i zostawia rysunek.
- **Szkice**: osobny szkic dla 2D i 3D, zapisywany w `localStorage`. Wczytanie przykładu, pliku lub linku na zmieniony szkic najpierw pyta, a potem odkłada szkic do kopii, którą można przywrócić.
- **Udostępnianie**: link z programem i trybem w adresie (`#/?tryb=2d&kod=…`, po otwarciu program wczytuje się i wykonuje), eksport PNG, pobieranie i otwieranie plików `.logo`.
- **Skróty**: `Ctrl/⌘ + Enter` uruchom lub wznów, `Ctrl/⌘ + .` krok, `Esc` pauza, `Ctrl/⌘ + Shift + Backspace` reset. Lista jest też w aplikacji, w zakładce Polecenia.
- **Motyw**: jasny i ciemny, domyślnie według systemu, z ręcznym przełącznikiem.

### 3D bez WebGL

Widok 3D rysuje na zwykłym Canvas 2D: własny rzutnik perspektywiczny, przycinanie do płaszczyzny bliskiej i sortowanie odcinków według głębi. Dzięki temu 3D nie zależy od WebGL i jest dostępne wszędzie tam, gdzie działa 2D; nie ma stanu „3D wyłączone”, który trzeba by tłumaczyć. Program płaski daje w obu trybach dokładnie te same odcinki.

## Interfejs dla automatyzacji

```ts
window.logomocja = {
  version: string,
  run(source: string, mode: "2d" | "3d"): Promise<Result>,
  open(source: string, mode: "2d" | "3d"): Promise<Result>,
};

type Result = {
  segments: { from: [number, number, number]; to: [number, number, number]; color: string; width: number }[];
  error: null | { message: string; line: number; column: number };
};
```

- `run` wykonuje program bez dotykania interfejsu. Kolor ma postać `#rrggbb` małymi literami. Błąd składni daje pustą listę odcinków, błąd wykonania zostawia odcinki narysowane przed nim.
- `open` wczytuje program do edytora w podanym trybie (jak wklejenie), wykonuje go do końca bez animacji, dopasowuje widok i rozwiązuje obietnicę, gdy rysunek jest na ekranie.

Układ współrzędnych: żółw startuje w `(0, 0, 0)`, patrzy wzdłuż `+Y`, góra to `+Z`; `pw` skręca w prawo (ku `+X`).

## Kod źródłowy

```
src/core/interp.ts       tokenizer, parser, maszyna wykonująca (bez DOM)
src/core/examples.ts     trzynaście programów wzorcowych
src/core/challenges.ts   zadania i ich wzorcowe rozwiązania
src/core/check.ts        porównanie rysunku ze wzorem
src/core/highlight.ts    kolorowanie składni
src/ui/                  pracownia, edytor, arkusz (2D i 3D), strony, udostępnianie
src/styles.css           cały wygląd; opis systemu w DESIGN.md
build.ts, serve.ts       budowanie i lokalny podgląd
tests/                   testy (bun test)
```

Aplikacja nie ma zależności działających w przeglądarce; `devDependencies` to tylko typy i TypeScript.

## Testy

`bun run test` uruchamia 59 testów: składnię i semantykę dialektu, komunikaty i pozycje błędów, limity, zgodność 2D/3D, wszystkie programy wzorcowe oraz zadania (każde rozwiązanie wzorcowe przechodzi, starter nie).

## Projekt wizualny

Opis systemu: `DESIGN.md` (oraz `.impeccable/design.json`); założenia produktu: `PRODUCT.md`. Projekt powstał z użyciem Impeccable 4.7.0. Ograniczenia narzędzi w czasie pracy: bez generowania obrazów, bez sterowania przeglądarką przez MCP i bez agentów pomocniczych, więc przegląd końcowy i dokumentację systemu wykonano w tym samym wątku, a zrzuty ekranu pochodzą z bezgłowego Chromium (Playwright).

## Czcionki

Wszystkie czcionki są w `src/fonts/` i trafiają do `dist/fonts/`; nic nie jest pobierane z sieci.

- **osifont**: GNU GPL 3 z wyjątkiem dla czcionek (osadzanie nie obejmuje dokumentu licencją)
- **Public Sans**: SIL Open Font License 1.1
- **Red Hat Mono**: SIL Open Font License 1.1
