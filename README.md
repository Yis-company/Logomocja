# Logomocja

Polska pracownia żółwia Logo w przeglądarce — rysowanie na płaszczyźnie (2D) i w przestrzeni (3D).
Statyczna strona bez backendu i bez sieci w czasie działania.

## Uruchamianie

```sh
bun install
bun run dev        # serwer deweloperski Vite
bun run build      # statyczna strona w dist/
bun run preview    # podgląd zbudowanej strony
bun run test       # testy interpretera, sprawdzarki wyzwań i linków
```

Budowanie pod podścieżką (np. na statycznym hostingu bez reguł przepisywania):

```sh
BASE_PATH=/Logomocja/builds/x/ bun run build
```

Aplikacja używa routingu po haszu (`#/`, `#/wyzwania`, `#/wyzwanie/<id>`, `#/pomoc`, `#/p/<tryb>/<dane>`),
więc odświeżenie dowolnej strony działa bez konfiguracji serwera.

## Co jest w środku

- `src/lang/` — lekser, parser (wszystkie kontrole w czasie analizy) i interpreter jako generator
  (krokowanie, animacja, limity). Bez zależności od DOM.
- `src/examples.ts` — 13 programów wzorcowych, `src/challenges.ts` — wyzwania i sprawdzarka
  (porównanie kształtu i położenia z tolerancją 2 jednostek, w obie strony).
- `src/ui/` — edytor (textarea + nakładka z kolorowaniem, numery linii, znacznik błędu, bieżąca linia),
  widok 2D (canvas: przesuwanie, przybliżanie, dopasowanie, początek układu) i 3D (three.js: kamera orbitalna,
  siatka, osie, żółw pokazujący orientację). Bez WebGL tryb 2D działa, a aplikacja wyjaśnia, czemu 3D jest wyłączone.
- `src/reference.ts` — ściąga języka po polsku, `src/share.ts` — permalinki (deflate + base64url).

Szkice obu trybów, programy wyzwań, postęp, motyw i tempo są zapisywane w `localStorage`.

## Skróty klawiszowe

| Akcja | Klawisze |
| --- | --- |
| Uruchom | Ctrl/⌘+Enter, F8 |
| Krok | Ctrl/⌘+Shift+Enter, F10 |
| Pauza / wznów | Ctrl/⌘+Shift+Spacja, F9 |
| Reset | Ctrl/⌘+Shift+Backspace, F7 |

## Hak testowy

Po załadowaniu strony `window.logomocja` udostępnia:

- `version` — wersja aplikacji,
- `run(source, mode)` — interpretuje program bez dotykania interfejsu, zwraca `{ segments, error }`,
- `open(source, mode)` — wczytuje program do edytora, wykonuje go bez animacji, dopasowuje widok
  i zwraca obietnicę `{ segments, error }`, gdy rysunek jest na ekranie.

`mode` to `"2d"` albo `"3d"`.
