# Logomocja

Polskie studio grafiki żółwia w przeglądarce, w duchu klasycznej Logomocji.
Piszesz program w Logo, uruchamiasz go i patrzysz, jak żółw rysuje: na płaszczyźnie (2D)
albo w przestrzeni (3D). Nie ma kont ani serwera, a aplikacja nie korzysta z sieci.

## Co jest w środku

- **Studio**: edytor z numeracją wierszy, kolorowaniem składni, sprawdzaniem błędów na bieżąco
  i podświetleniem wykonywanego polecenia. Do tego Uruchom / Krok / Pauza / Wznów / Reset,
  suwak tempa, tryby 2D i 3D oraz żółw pokazujący położenie i orientację.
- **Widok 2D**: przesuwanie, powiększanie (mysz, kółko, dotyk, klawiatura), dopasowanie, osie i początek układu.
- **Widok 3D** (three.js, ładowany na żądanie): orbitowanie, przesuwanie, przybliżanie, reset kamery,
  siatka podłoża i osie. Bez WebGL tryb 3D pokazuje wyjaśnienie, a tryb 2D działa normalnie.
- **13 przykładów standardowych** (strona „Przykłady” i lista w studiu). Gdy wczytanie przykładu
  zastąpiłoby niezapisany szkic, aplikacja najpierw pyta, a potem i tak zachowuje kopię do przywrócenia.
- **8 wyzwań** z automatycznym sprawdzaniem rysunku: porównanie geometryczne z tolerancją 1,5 jednostki,
  niezależne od kolejności, kierunku i podziału odcinków, w części zadań także kolorów i użycia
  `powtórz`/procedur. Postęp zapisuje się lokalnie.
- **Udostępnianie**: odnośnik z programem i trybem w adresie (`#/program?tryb=…&kod=…`),
  eksport PNG, pobieranie i otwieranie plików `.logo` (także przeciągnięciem na edytor).
- **Pomoc**: pełny opis dialektu po polsku z przykładem do każdego polecenia i przyciskiem „Wypróbuj”.
- Szkic każdego trybu przetrwa odświeżenie strony (localStorage). Jest motyw jasny i ciemny
  (domyślnie jak w systemie), układ na telefon i komputer oraz pełna obsługa klawiaturą.

### Skróty klawiszowe

| Klawisze | Działanie |
| --- | --- |
| Ctrl/⌘ + Enter | Uruchom |
| Ctrl/⌘ + Shift + Enter lub F10 | Krok |
| Ctrl/⌘ + Shift + Spacja lub F8 | Pauza / wznów |
| Ctrl/⌘ + Shift + Backspace lub F9 | Reset |
| Tab / Shift + Tab w edytorze | wcięcie (Escape, potem Tab: wyjście z edytora) |
| ? | lista skrótów |

## Uruchamianie

Wymagany jest [Bun](https://bun.sh).

```sh
bun install
bun run dev        # serwer deweloperski Vite
bun run build      # statyczna strona w dist/
bun run preview    # podgląd zbudowanej strony
bun run test       # testy interpretera, wyzwań i dokumentacji (bun test)
```

### Ścieżka bazowa

Build uwzględnia zmienną `BASE_PATH` (domyślnie `/`):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Zawartość `dist/` działa wtedy pod tą ścieżką na dowolnym hostingu statycznym, bez reguł przepisywania.
Aplikacja używa tras w części `#…` adresu, więc odświeżenie na każdej podstronie działa.

## Interfejs testowy

Po załadowaniu strony dostępny jest `window.logomocja`:

- `version`: wersja aplikacji (z `package.json`);
- `run(source, mode)`: interpretuje program bez dotykania interfejsu i zwraca `{ segments, error }`;
- `open(source, mode)`: wczytuje program do edytora w danym trybie (`"2d"`/`"3d"`), wykonuje go bez animacji,
  dopasowuje widok i zwraca obietnicę `{ segments, error }`, gdy rysunek jest już na ekranie.

`segments` to odcinki `{ from: [x,y,z], to: [x,y,z], color: "#rrggbb", width }` w kolejności rysowania.
`error` to `null` albo `{ message, line, column }` (komunikat po polsku, pozycja liczona od 1).

## Struktura

```
src/lang/       interpreter: lekser, parser (AST), wykonanie krokowe (generator), porównywanie rysunków
src/content/    przykłady, wyzwania, treść pomocy
src/ui/         edytor, widoki 2D/3D, studio, strony, motyw, udostępnianie
src/main.ts     powłoka aplikacji, trasy (hash), window.logomocja
tests/          testy bun (semantyka języka, błędy i limity, wyzwania, przykłady z pomocy)
```

Interpreter najpierw sprawdza cały program (błąd składni = nic nie jest rysowane), a potem wykonuje
go jako generator zatrzymujący się przed każdym poleceniem. Na tym opiera się animacja, praca krokowa
i podświetlanie wiersza. Obroty żółwia są liczone tym samym kodem w 2D i 3D, więc płaskie programy
dają w obu trybach identyczne współrzędne.

### Decyzje interpretacyjne

Opis języka zostawia kilka miejsc otwartych. Przyjęto:

- Błąd w warunku (np. dzielenie przez zero) wskazuje pierwszy token warunku.
- Przekroczenie limitu operacji przy „zakończeniu” obrotu pętli, treści warunku lub wywołania
  wskazuje polecenie `powtórz` / `jeśli` / wywołanie. Wywołanie zakończone przez `stop` liczy się
  jako zakończone, a przerwany przez `stop` obrót pętli i treść warunku nie.
- Przekroczenie zakresu współrzędnych i limitu odcinków wskazuje polecenie ruchu; żółw się wtedy nie przesuwa.
- Limit głębokości 32 dotyczy nawiasów kwadratowych (nawiasy okrągłe nie mają osobnego limitu).
