# Logomocja

Polskojęzyczne studio do rysowania żółwiem w 2D i 3D, inspirowane klasycznym środowiskiem Logo.
Działa w przeglądarce: bez konta, bez serwera, bez sieci podczas pracy.

## Uruchomienie

Wymagane: [Bun](https://bun.sh) (1.x).

```sh
bun install
bun run dev        # serwer deweloperski
bun run build      # statyczna strona w dist/
bun run preview    # podgląd zbudowanej strony
bun run test       # testy interpretera, wyzwań, przykładów i interfejsu
bun run typecheck  # sprawdzenie typów (tsc)
```

### Podścieżka

`BASE_PATH` (domyślnie `/`) ustawia adres, pod którym strona jest serwowana:

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Trasy są haszowe (`#/`, `#/przyklady`, `#/wyzwania`, `#/pomoc`), więc odświeżenie
dowolnej strony działa na zwykłym serwerze plików, bez reguł przepisywania.

### Hook testowy

Po załadowaniu strony `window.logomocja` ma pola:

- `version` — wersja aplikacji,
- `run(source, mode)` — interpretuje program bez interfejsu i zwraca `{ segments, error }`,
- `open(source, mode)` — wczytuje program do edytora, rysuje go od razu (bez animacji), dopasowuje widok i zwraca `Promise` z tym samym wynikiem.

`mode` to `"2d"` albo `"3d"`.

## Struktura

```
index.html            powłoka strony
src/main.ts           router (hashowy), motyw, skróty, hook window.logomocja
src/style.css         style, motywy jasny i ciemny, układ mobilny
src/logo/             język: bez zależności od DOM
  lexer.ts            tokeny, pozycje, limit znaków i tokenów
  keywords.ts         słowa poleceń (polskie i angielskie aliasy)
  parser.ts           składnia, procedury, walidacja przed uruchomieniem
  evaluate.ts         wyrażenia i porównania
  machine.ts          żółw (ramka 3D), wykonanie krok po kroku (generator)
  index.ts            runSource / checkSource / eksport API
  check.ts            sprawdzanie wyzwań: dopasowanie rysunku z tolerancją
  challenges.ts       zadania
  examples.ts         13 standardowych programów (bajt w bajt)
  reference.ts        opis poleceń i przykłady na stronie Pomoc
src/ui/
  studio.ts           strona studia: edytor, sterowanie, pliki, link, wyzwania
  editor.ts           textarea z nakładką podświetlania, numery wierszy
  highlight.ts        podświetlanie składni
  view2d.ts           płaszczyzna (canvas): przesuwanie, zoom, PNG
  view3d.ts           przestrzeń (three.js), ładowana dopiero w trybie 3D
  pages.ts            przykłady, wyzwania, pomoc
  progress.ts, util.ts  postęp, pamięć lokalna, motyw, linki, pliki
tests/                testy bun (interpreter, wyzwania, przykłady, pomoc, test dymny interfejsu)
```

## Decyzje projektowe

- **Interpreter jako generator.** Każde polecenie to krok: generator oddaje token następnego
  polecenia, a wykonanie jednego kroku to jedno wznowienie. Dzięki temu „Uruchom”, „Krok”,
  „Pauza” i tempo korzystają z tego samego kodu, a `run` jest pętlą po krokach.
- **Walidacja przed rysowaniem.** Składnia, nazwy zmiennych, `nrpowt`, zakresy literałów
  i tryb 2D/3D są sprawdzane po całym parsowaniu. Błąd składni nie rysuje nic.
- **Wyzwania sprawdzane kształtem.** Oba rysunki zamieniane są na punkty co jednostkę
  długości. Każdy punkt wzorca musi mieć punkt w rysunku ucznia w odległości 1,5 i odwrotnie.
  Dzięki temu liczy się rysunek, a nie podział na odcinki. Wyzwanie może też wymagać słowa
  kluczowego (np. `oto` albo `nrpowt`).
- **Szkice.** Każdy tryb (2D i 3D) ma własny szkic, a każde wyzwanie własny zapis.
  Wczytanie przykładu, pliku albo linku zapisuje poprzedni tekst jako kopię, którą cofa
  przycisk „Cofnij wczytanie”.
- **Edycja w trakcie rysowania.** Zmiana tekstu zatrzymuje wykonanie i czyści rysunek,
  bo rysunek przestałby odpowiadać programowi.
- **Link.** `#/?m=2d&p=…` zawiera program w base64url; po otwarciu program się uruchamia.
- **Brak WebGL.** Tryb 3D jest wyłączony z komunikatem, a 2D działa dalej.

## Ograniczenia

- Dane zapisują się tylko w `localStorage` tej przeglądarki.
- Eksport PNG zapisuje to, co widać na płótnie, w rozdzielczości płótna.
