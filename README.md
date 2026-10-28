# Logomocja

Polska pracownia żółwia inspirowana klasycznym środowiskiem Logo: rysowanie na płaszczyźnie (2D) i w przestrzeni (3D, WebGL). Interfejs po polsku, bez kont, bez backendu, bez sieci w czasie działania.

Zawiera: edytor z podświetlaniem składni i znacznikiem błędu, uruchamianie / krok / pauza / reset z regulacją prędkości, widok 2D (przesuwanie, zoom, dopasowanie) i 3D (obrót, przesuwanie, zoom, siatka, osie), 13 przykładów, 10 wyzwań ze sprawdzaczem, linki do udostępniania, eksport PNG, pliki `.logo`, pełną instrukcję języka, motyw jasny/ciemny i skróty klawiszowe.

## Uruchomienie

```sh
bun install
bun run dev        # serwer deweloperski
bun run build      # statyczna strona w dist/
bun run preview    # podgląd dist/
bun run test       # testy interpretera, sprawdzacza wyzwań i instrukcji
bun run typecheck
```

`BASE_PATH` (domyślnie `/`) ustawia prefiks adresu, np. `BASE_PATH=/Logomocja/builds/x/ bun run build`. Routing opiera się na haszu (`#/pracownia`, `#/przyklady`, `#/wyzwania`, `#/instrukcja`), więc odświeżenie działa na zwykłym hostingu statycznym.

## Budowa

- `src/lang/` – lexer, parser (walidacja całego programu przed rysowaniem), interpreter oparty na generatorze (krokowanie), sprawdzacz wyzwań.
- `src/data/` – przykłady (dosłownie jak w specyfikacji), wyzwania, treść instrukcji.
- `src/ui/` – edytor (textarea + nakładka), widok 2D (canvas), widok 3D (własny renderer WebGL2 z grubymi liniami), strony, dialogi, motyw.
- `tests/` – testy `bun test`.

Hook testowy: `window.logomocja = { version, run(source, mode), open(source, mode) }`.

## Skróty

Ctrl/⌘+Enter – uruchom, F10 – krok, F8 – pauza/wznów, Esc – reset. Na rysunku: strzałki, +/−, 0 (lista także w aplikacji).

Brak WebGL 2 wyłącza tylko widok 3D (aplikacja podaje powód); 2D działa normalnie.
