# Logomocja

Polska pracownia żółwia w stylu klasycznego Logo: rysowanie 2D oraz w przestrzeni 3D.
Wszystko działa w przeglądarce, bez kont, serwera i połączenia z siecią w czasie działania.

## Uruchomienie

```sh
bun install
bun run dev        # serwer deweloperski
bun run build      # statyczna strona w dist/
bun run preview    # podgląd zbudowanej strony
bun run test       # testy interpretera, przykładów, wyzwań i instrukcji
bun run typecheck  # sprawdzenie typów
```

`BASE_PATH` ustawia ścieżkę bazową, np. `BASE_PATH=/Logomocja/builds/x/ bun run build`.
Routing opiera się na hashu (`#/`, `#/instrukcja`), więc odświeżenie działa na dowolnym statycznym hostingu.

## Struktura

- `src/lang/`: lekser, parser i interpreter (generator wykonujący program krok po kroku).
- `src/data/`: przykłady (13 standardowych programów), wyzwania, treść instrukcji.
- `src/lib/`: porównywanie rysunków (sprawdzanie wyzwań), kodowanie linków, localStorage.
- `src/ui/`: edytor, widok 2D (canvas), widok 3D (three.js, ładowany leniwie), pracownia.
- `tests/`: testy `bun test`.

## Funkcje

Edytor z podświetlaniem składni i znacznikiem błędu, uruchamianie/krok/pauza/reset z regulacją prędkości,
widoki 2D i 3D (obrót, przesuwanie, zoom, dopasowanie), przykłady, 10 wyzwań ze sprawdzaczem i zapisem postępu,
link do programu, eksport PNG, pliki `.logo`, instrukcja po polsku, motyw jasny/ciemny, skróty klawiszowe (Ctrl+Enter, F10, F6, F8/Esc).
Bez WebGL widok 3D zamienia się na rzut izometryczny z komunikatem o przyczynie.

## Hook testowy

`window.logomocja` ma `version`, `run(source, mode)` (czysty interpreter) i `open(source, mode)` (wczytuje do edytora, uruchamia i dopasowuje widok).
