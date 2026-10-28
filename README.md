# Logomocja

Polskie studio Logo z żółwiem, który rysuje na płaszczyźnie (2D) i w przestrzeni (3D).
Inspiracją jest klasyczna polska Logomocja; to jej współczesna, przeglądarkowa wersja:
działa na komputerze i telefonie, bez kont, bez serwera i bez sieci.

## Uruchamianie

Wymagany jest [Bun](https://bun.sh) (1.1 lub nowszy).

```sh
bun install          # zależności
bun run dev          # serwer deweloperski Vite (http://localhost:5173)
bun run build        # statyczna strona w dist/
bun run preview      # podgląd zbudowanej strony
bun run test         # testy interpretera i treści (bun test)
bun run typecheck    # sprawdzenie typów TypeScript
```

### Budowanie pod podścieżką

`bun run build` honoruje zmienną `BASE_PATH` (domyślnie `/`). Strona w `dist/` to zwykłe
pliki statyczne. Routing działa na fragmencie adresu (`#/…`), więc odświeżenie dowolnej
podstrony działa na każdym statycznym hostingu, także bez reguł przepisywania adresów:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
# zawartość dist/ można teraz serwować spod /Logomocja/builds/x/
```

## Co jest w środku

- **Studio**: edytor z numerami wierszy, kolorowaniem składni, znacznikiem błędu
  (wiersz, kolumna, komunikat po polsku) i podświetleniem wykonywanego wiersza.
  Przyciski Uruchom, Krok, Pauza/Wznów, Reset i suwak tempa. Edycja w trakcie
  działania zatrzymuje program, ale zostawia to, co już narysowano.
- **Widok 2D** (płótno): przesuwanie, powiększanie (kółko, gest, klawisze), dopasowanie,
  widoczny początek układu i siatka z podziałką.
- **Widok 3D** (three.js, ładowany dopiero przy pierwszym użyciu): obracanie, przesuwanie,
  powiększanie, reset, siatka na płaszczyźnie XY i osie. Bez WebGL aplikacja to wyjaśnia
  i pokazuje uproszczony, nieruchomy rzut aksonometryczny, a tryb 2D działa normalnie.
- **Przykłady**: 13 programów standardowych (dosłownie) pod nazwami `kwadrat`, `gwiazda`,
  `rozeta`, `spirala`, `wielokaty`, `drzewo`, `sniezynka`, `schody`, `szescian`,
  `pierscien`, `kula`, `helisa`, `drzewo3d`. Adres `#/przyklad/<nazwa>` wczytuje przykład
  we właściwym trybie. Jeśli w szkicu jest własny program, aplikacja pyta o zgodę
  i zachowuje kopię, którą można przywrócić.
- **Wyzwania**: 9 zadań (7 w 2D, 2 w 3D) z automatycznym sprawdzaniem. Sprawdzarka porównuje
  kształt i rozmiar rysunku ze wzorem: nie liczy się kolejność ani kierunek rysowania,
  podział odcinków ani położenie całości. Tolerancja to 1% rozmiaru wzoru, co najmniej
  1,5 jednostki. Niektóre zadania wymagają `powtórz` albo procedury. Postępy zapisują się
  w `localStorage`.
- **Udostępnianie**: odnośnik `#/kod/<tryb>/<dane>` zawiera program (skompresowany
  `deflate-raw`, w base64url). Jego otwarcie wczytuje i od razu uruchamia program.
  Jest też eksport PNG oraz zapis i odczyt plików `.logo`.
- **Pomoc** (`#/pomoc`): pełny opis dialektu po polsku, z przykładem przy każdym poleceniu.
- **Szkice** obu trybów, wybrany motyw (systemowy, jasny albo ciemny) i tempo przetrwają
  przeładowanie strony.

### Skróty klawiszowe

| Skrót | Działanie |
| --- | --- |
| Ctrl/⌘ + Enter | Uruchom |
| Ctrl/⌘ + Shift + Enter, F10 | Krok |
| Ctrl/⌘ + Shift + Spacja, F8 | Pauza / wznów |
| Ctrl/⌘ + Shift + X | Reset |
| Tab / Esc, Tab (w edytorze) | wcięcie / wyjście z edytora |
| strzałki, +, −, 0 (na rysunku) | przesuwanie (2D) lub obracanie (3D), powiększanie, dopasowanie |

## Interfejs testowy

Po załadowaniu strony dostępny jest obiekt `window.logomocja`:

- `version`: wersja z `package.json`,
- `run(source, mode)`: interpretuje program bez dotykania interfejsu i zwraca
  `{ segments, error }`,
- `open(source, mode)`: wkleja program do edytora w danym trybie, wykonuje go bez animacji,
  dopasowuje widok i zwraca obietnicę z `{ segments, error }`, gdy rysunek jest już na ekranie,
- dodatkowo `examples` (lista przykładów) i `loadExample(nazwa)`.

`mode` to `"2d"` albo `"3d"`. Odcinek ma postać
`{ from: [x, y, z], to: [x, y, z], color: "#rrggbb", width }`, a błąd postać
`{ message, line, column }` (kolumna i wiersz liczone od 1).

## Struktura projektu

```
src/lang/        interpreter: lekser, parser (pełna walidacja przed uruchomieniem), wykonanie z limitami
src/content/     przykłady, wyzwania i sprawdzarka, treść pomocy
src/ui/          edytor, widoki 2D i 3D, odtwarzacz animacji, strony, udostępnianie, motyw
src/styles.css   wygląd (jasny i ciemny motyw, układ na telefon i komputer)
tests/           testy (bun test): specyfikacja języka, limity, programy standardowe, wyzwania, pomoc
```

Interpreter najpierw analizuje cały program. Błąd składni oznacza, że nic nie zostanie
narysowane. Potem program się wykonuje i zapisuje ślad kroków, który odtwarzacz animuje
(z płynnym ruchem żółwia przy wolnym tempie). Błąd wykonania zatrzymuje program,
a narysowane odcinki zostają.

### Rozstrzygnięcia niejednoznaczności

- Licznik operacji: zakończenie obrotu pętli albo bloku warunku liczy się tylko wtedy,
  gdy blok dobiegł końca. Blok przerwany przez `stop` się nie liczy. Zakończenie wywołania
  procedury liczy się zawsze, także po `stop`.
- Ramka `powtórz` (do limitu 32) powstaje także przy zerowej liczbie powtórzeń.
- Przekroczenie limitu współrzędnych, odcinków lub operacji jest zgłaszane przy poleceniu,
  które by go przekroczyło. Takie polecenie niczego już nie rysuje.
- Nawiasy okrągłe można zagnieżdżać najwyżej na 32 poziomy, tak jak kwadratowe.
- Szerokość i liczba powtórzeń zapisane samymi liczbami są sprawdzane przed uruchomieniem.
  Dzielenie przez zero w takim zapisie jest jednak zawsze błędem wykonania.
- Kolor można zapisać także w polskich cudzysłowach („…”), bo telefony często zamieniają
  nimi zwykłe cudzysłowy.
