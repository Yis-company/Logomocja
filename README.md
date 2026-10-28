# Logomocja

Polska pracownia żółwia w przeglądarce, wzorowana na klasycznym polskim środowisku Logo o tej samej nazwie.
Piszesz program, uruchamiasz go i patrzysz, jak żółw rysuje – na płaszczyźnie (**2D**) albo w przestrzeni (**3D**).
Interfejs jest po polsku. Aplikacja działa wyłącznie w przeglądarce: bez kont, bez serwera, bez żadnych połączeń
sieciowych w czasie działania.

```logo
oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

powtorz 12 [kwadrat 80 90 pw 30]
```

## Co potrafi

- **Edytor** z numerami wierszy, kolorowaniem składni (polecenia, liczby, nazwy, napisy/kolory, komentarze, nawiasy),
  znacznikiem błędu w miejscu wiersza i kolumny (z polskim komunikatem) oraz podświetleniem wykonywanego wiersza.
- **Wykonanie**: uruchom całość, krok po kroku, pauza/wznów, reset, regulowana szybkość animacji (domyślnie „automatycznie”: rysunek powstaje w około półtorej sekundy niezależnie od wielkości programu; skrajne ustawienie wykonuje wszystko natychmiast). Edycja w trakcie
  działania przerywa program (rysunek zostaje), a błąd składni nie rysuje niczego – błąd wykonania zachowuje to, co już narysowano.
- **Widok 2D**: przesuwanie, powiększanie (kółko, szczypanie, klawisze), dopasowanie do rysunku, siatka i widoczny początek układu.
- **Widok 3D**: obracanie, przesuwanie i przybliżanie kamery, reset, siatka podłoża i osie X/Y/Z, żółw jako ostrosłup
  pokazujący orientację. Widok 3D jest rysowany rzutem perspektywicznym na zwykłym płótnie 2D, więc **nie wymaga WebGL**
  i działa wszędzie tam, gdzie działa 2D.
- **13 standardowych programów** (`examples/*.logo`, bez zmian) ładowanych po nazwie do właściwego trybu. Wczytanie przykładu
  w miejsce niezapisanego szkicu pyta o zgodę, a zastąpiony szkic trafia do historii („Poprzednie szkice”).
- **Wyzwania** (9 zadań 2D i 3D): każde pokazuje wzór (także jako cień na rysunku), sprawdza rysunek automatycznie i zapisuje postęp lokalnie.
- **Udostępnianie i pliki**: permalink (`#/pracownia?tryb=…&kod=…`) wczytuje i uruchamia program; eksport rysunku do PNG;
  pobieranie i otwieranie plików `.logo`.
- **Opis języka** po polsku (`#/opis`): wszystkie polecenia z przykładami, wyrażenia, zmienne, warunki, procedury, 3D, błędy i limity.
- Szkice obu trybów, tryb, szybkość i motyw przetrwają przeładowanie (tylko `localStorage`).
- **Skróty klawiszowe** (lista pod `?` i w opisie języka): `Ctrl+Enter` uruchom, `F10` krok, `F8` pauza/wznów, `Esc` reset.
- Układ responsywny (telefon i komputer), jasny/ciemny motyw zgodny z systemem z ręcznym przełącznikiem, pełna obsługa
  klawiaturą, widoczny fokus, etykiety dla czytników ekranu.

## Uruchamianie, budowanie, testy

Wymagany jest [Bun](https://bun.sh) (testowane z 1.4). Projekt nie ma zależności uruchomieniowych ani deweloperskich.

```sh
bun install          # nic nie instaluje, ale jest bezpieczne do uruchomienia
bun run build        # buduje samodzielną statyczną stronę do dist/
bun run test         # testy interpretera, wyzwań, dokumentacji i pomocników
bun run dev          # serwer deweloperski z przebudową na http://localhost:3000
bun run typecheck    # opcjonalnie: wymaga zainstalowanego `tsc` (typescript)
```

`dist/` zawiera zwykłe pliki (`index.html`, `assets/*.js`, `assets/*.css`, ikona, manifest) – można je wystawić dowolnym
serwerem statycznym, także z podkatalogu.

### Ścieżka bazowa (`BASE_PATH`)

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Adresy zasobów w `index.html` są względne, a nawigacja używa hasza (`#/pracownia`, `#/przyklady`, `#/wyzwania/…`, `#/opis`),
więc odświeżenie dowolnej podstrony działa na hostingu statycznym bez reguł przepisywania. `BASE_PATH` trafia do
manifestu aplikacji (`start_url`, `scope`). Skrypt JS jest zwykłym skryptem (nie modułem), więc `dist/index.html` działa nawet po otwarciu z dysku.

## Hak testowy

Po załadowaniu strony dostępny jest obiekt `window.logomocja`:

| Składnik | Opis |
| --- | --- |
| `version` | wersja aplikacji (napis) |
| `run(source, mode)` | interpretuje program (`mode`: `"2d"` albo `"3d"`) bez dotykania interfejsu; zwraca `{ segments, error }` |
| `open(source, mode)` | wczytuje program do edytora jak wklejony, uruchamia go bez animacji, dopasowuje widok i po narysowaniu zwraca ten sam wynik co `run` |

`segments` to odcinki w kolejności rysowania: `{ from: [x, y, z], to: [x, y, z], color: "#rrggbb", width }`;
`error` to `null` albo `{ message, line, column }` (wiersz i kolumna liczone od 1).

## Budowa projektu

```
index.html            szablon strony (adresy zasobów podstawia scripts/build.ts)
examples/*.logo       13 standardowych programów, dokładnie w brzmieniu z wymagań
scripts/              build.ts (Bun.build → dist/), dev.ts (serwer deweloperski)
src/lang/             interpreter: leksyka, parser, wykonawca (bez zależności od DOM)
  lexer.ts            tokeny, położenie, odstępy wokół operatorów
  parser.ts           składnia, kontrola nazw, limity składni, komunikaty po polsku
  expr.ts, interp.ts  obliczanie wyrażeń, żółw 3D, limity wykonania
src/data/             przykłady, wyzwania i ich sprawdzanie, treść opisu języka, skróty
src/app/              interfejs: edytor, widoki 2D/3D, wykonawca (animacja/krok), strony, router
src/styles.css        style i motywy
test/                 testy (bun test)
```

### Interpreter w skrócie

Program jest w całości analizowany przed uruchomieniem (błąd składni nic nie rysuje), a następnie wykonywany przez
generator, który po każdej operacji oddaje jej położenie w kodzie – na tym opiera się animacja, krokowanie i podświetlanie
wiersza; ten sam kod, bez przerw, obsługuje `window.logomocja.run`. Wyrażenia są drzewami z płaskimi łańcuchami
`+ -` i `* /`, więc bardzo długie wyrażenia nie wyczerpują stosu. Obroty dla wielokrotności 90° są dokładne
(bez błędów zmiennoprzecinkowych typu `6e-17`).

Przyjęte rozstrzygnięcia tam, gdzie wymagania zostawiają swobodę:

- Pozycja błędu: nierozpoznany token → on sam; brak argumentu → token, który stoi w miejscu argumentu (przy końcu programu
  – polecenie); niezamknięty `[` lub `(` na końcu programu → otwierający nawias; brak `już` → słowo `oto`; błąd w argumencie → jego pierwszy token.
- Operacje: do limitu 10 000 liczy się każde polecenie, `niech`, warunek, powtórz i wywołanie oraz jedna operacja za
  ukończenie obiegu powtórz, wykonanego bloku warunku i wywołania procedury (także zakończonego `stop`).
  Przerwanie obiegu przez `stop` nie liczy się jako ukończenie.
- Sprawdzanie wyzwań porównuje rysunki geometrycznie (pokrycie i precyzja próbek w tolerancji ≈2% przekątnej wzoru),
  niezależnie od kolejności, podziału na odcinki i grubości; kolory są sprawdzane tylko tam, gdzie zadanie tego wymaga.
