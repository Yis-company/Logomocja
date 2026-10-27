# Logomocja

Pracownia żółwia Logo w przeglądarce, po polsku, z rysowaniem na płaszczyźnie (2D)
i w przestrzeni (3D). Nawiązuje do klasycznej polskiej Logomocji, ale działa na
dzisiejszym komputerze i telefonie. Wszystko dzieje się lokalnie: bez kont,
bez serwera, bez połączeń sieciowych w trakcie pracy.

## Co potrafi

- **Edytor** z podświetlaniem składni, numerami wierszy i zaznaczaniem błędu
  w miejscu, w którym wystąpił (wiersz i kolumna, komunikat po polsku).
- **Uruchamianie** całego programu z animacją (regulowana szybkość, od kroku po
  kroku do „natychmiast”), **krok po kroku**, **wstrzymanie / wznowienie**,
  **reset**. Edycja w trakcie działania zatrzymuje program i prosi o ponowne
  uruchomienie, a dotychczasowy rysunek zostaje.
- **Tryb 2D**: płaszczyzna z siatką, przesuwanie, przybliżanie kółkiem lub
  szczypnięciem, dopasowanie widoku do rysunku.
- **Tryb 3D**: ta sama scena w przestrzeni, kamera do obracania, przesuwania
  i przybliżania (mysz lub dotyk), odcinki jako prawdziwe bryły, żółw w 3D.
  Gdy przeglądarka nie udostępnia WebGL, tryb 3D jest wyłączony z wyjaśnieniem,
  a 2D działa dalej.
- **Przykłady** do wczytania (kwadrat, gwiazda, rozeta, kwiat, domek, sześcian,
  sprężyna, kula) i **pomoc** z opisem języka.
- Szkic programu, tryb, szybkość i ustawienia są zapamiętywane w `localStorage`
  i wracają po odświeżeniu strony.

## Język

Pełny opis jest w oknie „Pomoc” w aplikacji. W skrócie:

```logo
oto kwadrat ma: bok, kąt
  powtórz 4 [np bok pw kąt]
już

kolor "#1864ab"
grubość 4
powtórz 12 [kwadrat 80 90 pw 30]
```

Polecenia: `np`/`naprzód` (`fd`), `ws`/`wstecz` (`bk`), `pw`/`prawo` (`rt`),
`lw`/`lewo` (`lt`), `pod`/`podnieś` (`pu`), `opu`/`opuść` (`pd`), `kolor`
(`color`), `grubość` (`width`, 1–12), `powtórz n [ … ]` (`repeat`), a w 3D
także `góra` (`pitchup`) i `dół` (`pitchdown`). Wielkość liter i polskie znaki
w nazwach poleceń nie mają znaczenia; `;` zaczyna komentarz. Procedury
definiuje się między `oto` a `już` (także `to` … `end`, nagłówek `oto nazwa :a :b`),
parametry mogą zastępować dowolną liczbę. Nie ma arytmetyki, zmiennych
globalnych ani rekurencji.

Ograniczenia: 50 000 znaków, 10 000 słów, 32 poziomy zagnieżdżenia, 10 000
operacji, 10 000 odcinków, współrzędne w zakresie ±100 000.

## Uruchamianie

Wymagany jest [Bun](https://bun.sh).

```sh
bun install        # zależności
bun run dev        # serwer deweloperski (http://localhost:5173)
bun run build      # statyczna strona w dist/
bun run preview    # podgląd zbudowanej strony
bun test           # testy interpretera (bun test)
```

### Budowanie pod podkatalog

Zmienna `BASE_PATH` (domyślnie `/`) ustawia ścieżkę, pod którą strona będzie
serwowana. Aplikacja nie ma tras, więc odświeżenie zawsze działa.

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Wynik w `dist/` to zwykłe pliki (HTML, CSS, JS, SVG); moduł 3D (three.js) jest
ładowany dopiero po przełączeniu na 3D.

### Testy

- `bun test` – testy jednostkowe leksera, parsera, interpretera i kontraktu `run()`
  (`tests/`).
- `bun run test:e2e` – test w prawdziwej przeglądarce (Playwright, Chromium):
  buduje stronę pod `/Logomocja/builds/x/`, serwuje ją jako statyczne pliki,
  klika po interfejsie w 2D i 3D, sprawdza wersję na telefonie i wariant bez
  WebGL, zapisuje zrzuty ekranu do `e2e-out/shots/`. Wymaga jednorazowo
  `bunx playwright install chromium` (oraz bibliotek systemowych Chromium).

## Hak testowy

Po załadowaniu strony dostępny jest obiekt `window.logomocja`:

```js
window.logomocja.version            // np. "1.0.0"
window.logomocja.run(source, mode)  // mode: "2d" | "3d"
// → { segments: [{ from: [x,y,z], to: [x,y,z], color: "#rrggbb", width }], error: null | { message, line, column } }
```

`run` interpretuje program niezależnie od interfejsu. Przy błędzie składni
`segments` jest puste; przy błędzie w trakcie wykonania zawiera to, co
narysowano wcześniej.

## Struktura

```
src/logo/      język: lekser, parser (walidacja statyczna), wykonanie krokowe, limity
src/ui/        edytor, widok 2D (canvas), widok 3D (three.js, ładowany leniwie), sterowanie
src/main.ts    punkt wejścia; rejestruje window.logomocja i startuje interfejs
tests/         testy jednostkowe (bun test)
scripts/e2e.mjs  test przeglądarkowy
```

Stos: TypeScript, Vite, three.js; bez frameworka UI.
