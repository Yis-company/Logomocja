# Logomocja

Polskojęzyczne studio programowania z żółwiem: edytor Logo, płaskie rysunki 2D i rzeczywista geometria przestrzenna 3D. Bez kont, backendu, analityki i zewnętrznych usług. Wszystkie skrypty, ikony i czcionki są częścią statycznego wydania.

## Uruchomienie

Wymagany jest [Bun](https://bun.sh/). Z katalogu projektu:

```sh
bun install
bun run dev
```

Otwórz adres podany przez Vite, zwykle `http://localhost:5173/`.

```sh
bun run test       # testy interpretera i automatycznego sprawdzania wyzwań
bun run build      # TypeScript + kompletna witryna w dist/
bun run preview    # lokalny podgląd wydania, zwykle port 4173
```

Zawartość `dist/` można opublikować na dowolnym statycznym hostingu. Wydanie nie potrzebuje procesu Node/Bun po stronie serwera. Korzystaj z HTTP(S); otwieranie modułów ES przez `file://` jest ograniczane przez przeglądarki.

## Publikacja pod podścieżką

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Umieść zawartość `dist/` pod `/Logomocja/builds/x/`. `BASE_PATH` domyślnie wynosi `/`; podaj ścieżkę rozpoczynającą i kończącą się ukośnikiem. Vite uwzględnia ją również dla ikon i lokalnych fontów.

Nawigacja korzysta z fragmentów adresu: `#studio`, `#examples`, `#challenges`, `#reference`. Odświeżanie każdej strony działa bez reguł przepisywania adresów. Link do programu ma postać `…/#p=…` i zawiera UTF-8 JSON zakodowany jako base64url. Otwarcie linku wczytuje program, wykonuje go i dopasowuje płótno.

## Korzystanie ze studia

- **Uruchom** rozpoczyna animację od początkowego żółwia. Po pauzie przycisk **Wznów** kontynuuje bieżący program. Kontrolka tempa zmienia szybkość wykonywania.
- **Krok** wykonuje kolejne polecenie, pokazując jego wiersz. Edycja zatrzymuje wykonywanie i pozostawia dotychczasowy rysunek; następne uruchomienie użyje nowego kodu. **Reset** czyści płótno i wykonanie, zachowując kod.
- **2D:** przeciąganie przesuwa płótno, kółko lub gest szczypania zmienia skalę. Przycisk dopasowania pokazuje cały rysunek i początek układu.
- **3D:** przeciąganie obraca kamerę; Shift + przeciąganie, prawy przycisk lub dwa palce przesuwają ją. Kółko albo dwa palce zmieniają powiększenie. Przy żółwiu czerwona oś oznacza prawą stronę, niebieska górę. Kamera ma osobny reset.
- **Przykłady:** wszystkie 13 programów z briefu, z zachowaniem dokładnego kodu, nazw, opisów i trybów. Przykłady otwierają się i wykonują automatycznie.
- **Wyzwania:** sześć zadań ze wzorem, opisem, podpowiedzią i sprawdzaniem rysunku. Wynik i powód są wyświetlane po sprawdzeniu. Ukończone zadania zapisują się lokalnie.
- **Pliki i linki:** przyciski w nagłówku edytora otwierają i pobierają `.logo`. Import używa aktualnie wybranego trybu. „Eksport PNG” zapisuje aktualny widok płótna. „Udostępnij” tworzy link zawierający kod i tryb.
- **Motyw:** przycisk w prawym górnym rogu przełącza systemowy → jasny → ciemny. Domyślnie wygląd podąża za ustawieniem systemu.
- **Słownik:** komplet poleceń i aliasów, przykłady, reguły wyrażeń, zmiennych, warunków, procedur, geometrii i limitów. Pole wyszukiwania filtruje polecenia.

### Szkice i prywatność

Szkice 2D i 3D zapisują się osobno w `localStorage`, po każdej edycji. Otwarcie przykładu, pliku, zadania lub linku odkłada poprzedni program danego trybu do **Moich szkiców**, skąd można go odzyskać. Ponowne otwarcie identycznego kodu nie tworzy duplikatów. Szkice i postępy nie są synchronizowane pomiędzy urządzeniami. Usunięcie danych witryny usuwa lokalne zapisy; plik `.logo` jest przenośną kopią.

Gdy zapis przeglądarki jest niedostępny lub pełny, edytor pokazuje informację o braku zapisu i zachęca do pobrania pliku. Bieżąca sesja nadal działa w pamięci.

### Klawiatura

| Czynność | Skrót |
| --- | --- |
| Uruchom / wznów | Ctrl+Enter lub ⌘+Enter |
| Kolejne polecenie | F10 |
| Pauza / wznów | F8 |
| Reset wykonania i płótna | Shift+Escape |
| Dwie spacje w edytorze | Tab |
| Opuść edytor do poprzedniej kontrolki | Shift+Tab |
| Przesuń aktywne płótno | Strzałki |
| Obróć aktywne płótno 3D | Shift+strzałki |
| Przybliż / oddal aktywne płótno | + / − |
| Reset kamery i dopasowanie | 0 |

Na niektórych laptopach F8 i F10 wymagają Fn. Wszystkie funkcje mają również przyciski, dostępne klawiaturą. Animacja żółwia jest pod kontrolą użytkownika; dekoracyjne animacje respektują `prefers-reduced-motion`.

## Interpreter i geometria

Interpreter jest niezależny od DOM. Najpierw tokenizuje cały kod, zbiera deklaracje i sygnatury procedur oraz waliduje pełny AST. Błąd parsowania zwraca pustą listę odcinków. Wykonanie jest generatorem, z którego korzystają zarówno animacja i krokowanie, jak i synchroniczny `run`. Błąd czasu wykonania zachowuje odcinki powstałe do chwili błędu, uwzględniając `czyść`.

Obsługiwany jest cały dialekt z briefu, w tym:

- wszystkie polskie, akcentowane i angielskie aliasy, niezależnie od wielkości liter;
- precedencja i lewostronna łączność operatorów, symetria odstępów, wielokrotne znaki jednoargumentowe i nawiasy;
- leksykalny `nrpowt`, globalne zmienne, lokalne przypisania i parametry, dokładne porównania;
- nowoczesne i starsze nagłówki procedur, deklaracje przed lub po wywołaniu, rekurencja i `stop`;
- limity 50 000 znaków, 10 000 tokenów, 32 poziomów nawiasów kwadratowych, 32 aktywnych ramek, 10 000 operacji, 10 000 odcinków i współrzędnych ±100 000;
- wskazanie pierwszego tokenu argumentu przy błędnej wartości lub obliczeniu.

Przypisanie lokalne przesłania zmienną globalną od chwili wykonania tego przypisania do końca bieżącego wywołania. Wywołania nie dziedziczą lokalnych zmiennych wywołującego. Parametr może mieć nazwę procedury i może zostać ponownie przypisany.

Pozycja i orientacja żółwia są reprezentowane w XYZ przez trzy ortonormalne osie. Płaskie polecenia dają identyczne współrzędne w 2D i 3D. Renderer 3D wykonuje ortograficzną projekcję prawdziwych współrzędnych przestrzennych, z obrotem kamery, siatką XY, osiami XYZ i sortowaniem kresek względem głębokości. **WebGL nie jest wymagany**, więc brak WebGL nie wyłącza 3D ani 2D. To studio kresek, bez bryłowych powierzchni, oświetlenia czy perspektywy.

Sprawdzanie zadań porównuje geometrię obu rysunków w obu kierunkach. Próbki kresek muszą leżeć do 0,8 jednostki od wzoru; łączna długość może różnić się maksymalnie o 1% lub 2 jednostki (większa wartość). Kolor, grubość, kierunek i kolejność odcinków nie mają znaczenia. Podział boku na krótsze odcinki jest dozwolony; dodatkowe kreski i przesunięcie figury nie przechodzą sprawdzenia.

## Publiczny hook testowy

Po załadowaniu strony:

```js
window.logomocja.version; // "1.0.0"

const result = window.logomocja.run('powtorz 4 [np 100 pw 90]', '2d');
// { segments: [{ from: [x,y,z], to: [x,y,z], color: '#16866a', width: 3 }, ...],
//   error: null | { message: '…', line: 1, column: 1 } }

const displayed = await window.logomocja.open('gora 90 np 100', '3d');
// Kod w edytorze, program wykonany bez animacji, widok dopasowany,
// rysunek wyświetlony przed rozwiązaniem Promise. Ten sam format wyniku.
```

`run` nie zmienia interfejsu, kamery, szkiców ani stanu bieżącego wykonania. `open` zachowuje poprzedni szkic i ładuje program tak, jak przy wklejeniu do edytora. Hook 3D działa niezależnie od możliwości sprzętowego renderowania.

## Weryfikacja w przeglądarce

Opcjonalny zestaw Playwright wymaga Node 22.18+ lub 24+ oraz Chromium z jego bibliotekami systemowymi:

```sh
bunx playwright install --with-deps chromium
bun run build
bun run test:browser
```

Test sam uruchamia zwykły serwer plików statycznych, bez rewrite rules. Sprawdza 13 przykładów, hook, błędy, krokowanie, pauzę, edycję podczas pracy, zapisy, zadania, linki Unicode, import i eksport, PNG, kamerę, tryby kolorystyczne, pracę offline i brak zewnętrznych żądań. Kontroluje układ przy szerokościach 320, 390, 768 i 1440 px oraz zapisuje zrzuty w `artifacts/`.

Tak samo można sprawdzić wydanie z podścieżką:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
BASE_PATH=/Logomocja/builds/x/ bun run test:browser
```

## Układ projektu

| Plik | Odpowiedzialność |
| --- | --- |
| `src/interpreter.ts` | Tokenizer, parser, wyrażenia, generator wykonania, geometria żółwia |
| `src/renderer.ts` | Canvas, projekcje 2D/3D, kamera, gesty, eksport PNG |
| `src/editor.ts` | Edytor z podświetlaniem składni, numerami i pozycją błędu |
| `src/examples.ts` | 13 standardowych programów, bez zmian w kodzie |
| `src/challenges.ts` | Sześć zadań i geometryczny checker |
| `src/reference.ts` | Pełny polski słownik języka |
| `src/main.ts` | Interfejs, nawigacja, pliki, zapis lokalny, hook |
| `src/style.css`, `src/fonts.css` | Responsywny wygląd, dwa motywy, lokalne fonty |
| `tests/` | Testy interpretera i zadań uruchamiane przez Bun |
| `scripts/browser-check.mjs` | Opcjonalne testy funkcjonalne Chromium |

Fonty Manrope i JetBrains Mono są dostarczane przez Fontsource na licencji SIL Open Font License. Kopie licencji są w `public/licenses/` i w gotowym wydaniu. Ikony są lokalnymi SVG.
