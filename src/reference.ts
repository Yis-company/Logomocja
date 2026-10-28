// Polish command reference, rendered as HTML. Examples carry data attributes for "Wypróbuj".
import { highlightLine } from "./ui/editor";
import { SHORTCUTS } from "./shortcuts";

interface Cmd {
  names: string;
  en: string;
  arg: string;
  desc: string;
  ex: string;
  mode?: "3d";
}

const CMDS: Cmd[] = [
  { names: "np, naprzod, naprzód", en: "fd, forward", arg: "wyrażenie", desc: "Przesuwa żółwia do przodu o podaną odległość. Gdy pisak jest opuszczony, rysuje odcinek.", ex: "np 100" },
  { names: "ws, wstecz", en: "bk, back", arg: "wyrażenie", desc: "Przesuwa żółwia do tyłu; kierunek się nie zmienia.", ex: "np 50 ws 120" },
  { names: "pw, prawo", en: "rt, right", arg: "wyrażenie (stopnie)", desc: "Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry).", ex: "pw 90 np 80" },
  { names: "lw, lewo", en: "lt, left", arg: "wyrażenie (stopnie)", desc: "Obraca żółwia w lewo. Ujemny kąt obraca w drugą stronę.", ex: "lw 45 np 80" },
  { names: "pod, podnies, podnieś", en: "pu, penup", arg: "—", desc: "Podnosi pisak: żółw chodzi, ale nie rysuje.", ex: "np 30 pod np 30 opu np 30" },
  { names: "opu, opusc, opuść", en: "pd, pendown", arg: "—", desc: "Opuszcza pisak: od teraz ruch zostawia ślad.", ex: "pod ws 50 opu np 100" },
  { names: "kolor", en: "color", arg: "kolor w cudzysłowie", desc: "Ustawia kolor pisaka: znak # i sześć cyfr szesnastkowych (wielkość liter bez znaczenia).", ex: 'kolor "#c1763d" np 100' },
  { names: "grubosc, grubość", en: "width", arg: "liczba całkowita 1–12", desc: "Ustawia grubość linii.", ex: "grubosc 8 np 100" },
  { names: "powtorz, powtórz", en: "repeat", arg: "liczba całkowita 0–10000, potem [ … ]", desc: "Wykonuje polecenia w nawiasach podaną liczbę razy.", ex: "powtorz 6 [np 60 pw 60]" },
  { names: "niech", en: "let", arg: "nazwa, potem wyrażenie", desc: "Nadaje zmiennej wartość (tworzy ją albo zmienia).", ex: "niech bok 40\npowtorz 4 [np bok pw 90]" },
  { names: "jeśli, jesli", en: "if", arg: "warunek, potem [ … ]", desc: "Wykonuje polecenia w nawiasach tylko wtedy, gdy warunek jest spełniony.", ex: "niech a 5\njeśli a > 3 [np 100]" },
  { names: "jeżeli, jezeli", en: "ifelse", arg: "warunek, potem [ … ] [ … ]", desc: "Gdy warunek jest spełniony, wykonuje pierwszy nawias, w przeciwnym razie drugi.", ex: "niech a 1\njeżeli a = 1 [kolor \"#2b6fb3\"] [kolor \"#c1763d\"]\nnp 100" },
  { names: "stop", en: "stop", arg: "—", desc: "Kończy bieżącą procedurę; poza procedurą kończy cały program. Działa także z wnętrza powtórz i warunku.", ex: "powtorz 10 [np 20 pw 36 jeśli nrpowt = 5 [stop]]" },
  { names: "dom", en: "home", arg: "—", desc: "Wraca do punktu (0, 0, 0) i początkowego kierunku. Gdy pisak jest opuszczony, rysuje drogę powrotu.", ex: "np 80 pw 90 np 60 dom" },
  { names: "czyść, czysc", en: "cs, clearscreen", arg: "—", desc: "Usuwa wszystko, co narysowano. Żółw zostaje tam, gdzie był.", ex: "np 100 czyść pw 90 np 50" },
  { names: "gora, góra", en: "pitchup", arg: "wyrażenie (stopnie)", desc: "Tylko 3D: unosi nos żółwia w górę (obrót wokół jego prawego boku).", ex: "gora 45 np 100", mode: "3d" },
  { names: "dol, dół", en: "pitchdown", arg: "wyrażenie (stopnie)", desc: "Tylko 3D: opuszcza nos żółwia w dół.", ex: "dol 45 np 100", mode: "3d" },
  { names: "pp, przechylprawo", en: "rr, rollright", arg: "wyrażenie (stopnie)", desc: "Tylko 3D: przechyla żółwia na prawy bok (obrót wokół kierunku ruchu).", ex: "pp 90 gora 90 np 100", mode: "3d" },
  { names: "pl, przechyllewo", en: "rl, rollleft", arg: "wyrażenie (stopnie)", desc: "Tylko 3D: przechyla żółwia na lewy bok.", ex: "pl 90 gora 90 np 100", mode: "3d" },
];

function code(src: string, mode: "2d" | "3d" = "2d", tryIt = true): string {
  const body = src.split("\n").map((l) => highlightLine(l, new Set(["kwadrat", "gałąź", "silnia", "kw", "schodek"]))).join("\n");
  const enc = encodeURIComponent(src);
  return `<div class="ref-code"><pre><code>${body}</code></pre>${tryIt ? `<button type="button" class="btn small" data-try="${enc}" data-mode="${mode}">Wypróbuj<span class="sr-only"> ten przykład w trybie ${mode.toUpperCase()}</span></button>` : ""}</div>`;
}

export function referenceHTML(): string {
  const rows = CMDS.map(
    (c) => `<section class="ref-cmd" id="cmd-${c.en.split(",")[0]}">
      <h3><code>${c.names}</code> <span class="muted">(${c.en})</span>${c.mode ? ' <span class="tag">3D</span>' : ""}</h3>
      <p><strong>Argument:</strong> ${c.arg}. ${c.desc}</p>
      ${code(c.ex, c.mode ?? "2d")}
    </section>`,
  ).join("");
  return `
  <article class="ref">
    <h1>Język Logomocji — ściąga</h1>
    <nav class="ref-toc" aria-label="Spis treści">
      <a href="#/pomoc/podstawy">Podstawy</a>
      <a href="#/pomoc/polecenia">Polecenia</a>
      <a href="#/pomoc/wyrazenia">Wyrażenia</a>
      <a href="#/pomoc/zmienne">Zmienne</a>
      <a href="#/pomoc/powtorz">Powtórzenia</a>
      <a href="#/pomoc/warunki">Warunki</a>
      <a href="#/pomoc/procedury">Procedury</a>
      <a href="#/pomoc/przestrzen">Przestrzeń 3D</a>
      <a href="#/pomoc/limity">Ograniczenia</a>
      <a href="#/pomoc/skroty">Skróty</a>
    </nav>

    <section id="podstawy">
      <h2>Podstawy</h2>
      <p>Program to ciąg poleceń dla żółwia. Żółw zaczyna w punkcie (0, 0), patrzy w górę ekranu (oś +Y), ma opuszczony pisak, kolor <code>#16866a</code> i grubość 3.
      Polecenia oddzielasz spacjami albo nowymi liniami. Wielkość liter nie ma znaczenia, a każde polskie polecenie ma też angielski odpowiednik. Słowa z polskimi znakami możesz pisać także bez nich (<code>powtórz</code> = <code>powtorz</code>).</p>
      <p>Średnik <code>;</code> zaczyna komentarz do końca linii. Liczby piszesz cyframi z kropką dziesiętną: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy takie jak <code>1e3</code> czy <code>0x10</code> są błędem.</p>
      ${code("; mój pierwszy rysunek\nnp 100 pw 90 np 50")}
    </section>

    <section id="polecenia">
      <h2>Polecenia</h2>
      ${rows}
    </section>

    <section id="wyrazenia">
      <h2>Wyrażenia</h2>
      <p>Wszędzie, gdzie polecenie oczekuje liczby, możesz wpisać wyrażenie: liczbę, nazwę parametru lub zmiennej (także w starym zapisie <code>:nazwa</code>), <code>nrpowt</code>, wyrażenie w nawiasach okrągłych, znak <code>-</code> lub <code>+</code> przed którymkolwiek z nich oraz działania <code>+ - * /</code>.</p>
      <ul>
        <li>Mnożenie i dzielenie wiążą mocniej niż dodawanie i odejmowanie: <code>np 2 + 3 * 4</code> idzie o 14.</li>
        <li>Działania o tej samej mocy liczą się od lewej: <code>np 20 - 5 - 3</code> idzie o 12.</li>
        <li><strong>Zasada odstępów:</strong> znak działania musi mieć spacje po obu stronach albo nie mieć ich wcale. <code>np 10 - 5</code> i <code>np 10-5</code> idą o 5, ale <code>np 10 -5</code> to błąd: <code>-5</code> jest osobną wartością, a nie odejmowaniem.</li>
        <li>Znaki można łączyć: <code>np -(3 - 5)</code>, <code>np - -2</code>, <code>np -bok</code>.</li>
        <li>Dzielenie przez zero i wynik, który nie jest skończoną liczbą, przerywają program.</li>
      </ul>
      <p><strong>Warunek</strong> to dwa wyrażenia połączone porównaniem: <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code> (<code>&lt;&gt;</code> znaczy „różne”). Porównania są dokładne, więc <code>0.1 + 0.2 = 0.3</code> nie jest spełnione.</p>
      ${code("np (20 + 30) * 2\npw 360 / 8\nnp 10-5")}
    </section>

    <section id="zmienne">
      <h2>Zmienne</h2>
      <p><code>niech nazwa wyrażenie</code> nadaje zmiennej wartość; kolejne <code>niech</code> ją zmienia. Nazwa nie może być poleceniem ani nazwą procedury.</p>
      <ul>
        <li><code>niech</code> poza procedurami tworzy zmienną globalną, widoczną w całym programie.</li>
        <li><code>niech</code> wewnątrz procedury tworzy zmienną lokalną dla danego wywołania. Od tej chwili zasłania ona globalną o tej samej nazwie, a po zakończeniu wywołania znika. Tak samo można zmienić parametr.</li>
        <li>Nazwy możesz użyć tylko wtedy, gdy jest parametrem procedury albo gdzieś (w tej procedurze lub na najwyższym poziomie, także niżej w tekście) stoi <code>niech</code> z tą nazwą. Inaczej program się nie uruchomi.</li>
        <li>Odczyt zmiennej, która jeszcze nie dostała wartości, przerywa program.</li>
      </ul>
      ${code("niech bok 10\npowtorz 12 [\n  np bok pw 90\n  niech bok bok + 10\n]")}
    </section>

    <section id="powtorz">
      <h2>Powtórzenia i <code>nrpowt</code></h2>
      <p><code>powtorz n [ … ]</code> wykonuje nawias <em>n</em> razy; <em>n</em> musi być liczbą całkowitą od 0 do 10000. W środku możesz zagnieżdżać kolejne powtórzenia, warunki i wywołania procedur.</p>
      <p><code>nrpowt</code> (ang. <code>repcount</code>) to numer bieżącego obrotu najbliższego otaczającego <code>powtorz</code>, licząc od 1. Musi stać w tekście wewnątrz nawiasu <code>powtorz</code> — w procedurze również wewnątrz jej własnego <code>powtorz</code>.</p>
      ${code("powtorz 36 [np nrpowt * 4 pw 100]")}
    </section>

    <section id="warunki">
      <h2>Warunki</h2>
      <p><code>jeśli warunek [ … ]</code> wykonuje nawias, gdy warunek jest spełniony. <code>jeżeli warunek [ … ] [ … ]</code> wybiera jeden z dwóch nawiasów.</p>
      ${code("powtorz 8 [\n  jeżeli nrpowt < 5 [kolor \"#2b6fb3\"] [kolor \"#c1763d\"]\n  np 60 pw 45\n]")}
    </section>

    <section id="procedury">
      <h2>Procedury</h2>
      <p>Procedurę definiujesz na najwyższym poziomie: linia zaczyna się od <code>oto</code> (ang. <code>to</code>), potem nazwa i opcjonalnie <code>ma:</code> z listą parametrów po przecinku. Treść kończy słowo <code>już</code> (<code>juz</code>, <code>end</code>) w osobnej linii. Działa też stary nagłówek <code>oto kwadrat :bok :kąt</code>.</p>
      <ul>
        <li>Wywołanie to nazwa i dokładnie tyle argumentów, ile parametrów: <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90.</li>
        <li>Definicja może stać przed wywołaniem albo po nim, ale nie wewnątrz nawiasów ani innej procedury. Każda nazwa może być zdefiniowana raz.</li>
        <li>Procedura może wywoływać samą siebie (rekurencja). <code>stop</code> kończy bieżące wywołanie.</li>
        <li>Procedury nie zwracają wartości.</li>
      </ul>
      ${code("oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90")}
      ${code("oto gałąź ma: dł\n  jeśli dł < 10 [stop]\n  np dł lw 30 gałąź dł * 0.6\n  pw 60 gałąź dł * 0.6\n  lw 30 pod ws dł opu\njuż\n\ngałąź 80")}
    </section>

    <section id="przestrzen">
      <h2>Przestrzeń 3D</h2>
      <p>Układ jest prawoskrętny: X w prawo, Y do przodu (w górę kartki), Z w górę, ponad kartkę. W trybie 2D żółw porusza się po płaszczyźnie XY. W 3D dochodzą cztery obroty: <code>gora</code>/<code>dol</code> (nos w górę lub w dół) i <code>pp</code>/<code>pl</code> (przechył wokół kierunku ruchu). Program złożony tylko z poleceń płaskich rysuje to samo w obu trybach.</p>
      <p>W widoku 3D przeciągnij, aby obracać kamerę, przeciągnij prawym przyciskiem (albo dwoma palcami), aby przesuwać, i przewijaj, aby przybliżać. Osie: X czerwona, Y zielona, Z niebieska.</p>
      ${code("powtorz 8 [\n  powtorz 4 [np 60 gora 90]\n  pp 45\n]", "3d")}
    </section>

    <section id="limity">
      <h2>Ograniczenia i błędy</h2>
      <ul>
        <li>najwyżej 50 000 znaków i 10 000 elementów programu (liczby, słowa, znaki działań, nawiasy, przecinki);</li>
        <li>najwyżej 32 poziomy zagnieżdżenia nawiasów;</li>
        <li>najwyżej 32 jednocześnie aktywne wywołania procedur i powtórzenia (warunki się nie liczą);</li>
        <li>najwyżej 10 000 wykonanych operacji (każde polecenie, <code>niech</code>, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdego obrotu, nawiasu warunku i wywołania);</li>
        <li>najwyżej 10 000 odcinków na rysunku i współrzędne w zakresie ±100 000.</li>
      </ul>
      <p>Każdy błąd podaje linię i kolumnę. Błąd w zapisie programu (np. nieznane polecenie, brak nawiasu) wykrywany jest przed rysowaniem — wtedy nic się nie rysuje. Błąd w trakcie działania (np. dzielenie przez zero, przekroczony limit) zatrzymuje żółwia, ale to, co już narysował, zostaje.</p>
    </section>

    <section id="skroty">
      <h2>Skróty klawiszowe</h2>
      <dl class="keys">${SHORTCUTS.map((s) => `<dt>${s.keys.map((k) => `<kbd>${k}</kbd>`).join(" lub ")}</dt><dd>${s.label}</dd>`).join("")}</dl>
      <p>W widoku 2D (po kliknięciu lub przejściu klawiszem Tab): strzałki przesuwają, <kbd>+</kbd>/<kbd>-</kbd> przybliżają, <kbd>0</kbd> dopasowuje. W widoku 3D: strzałki przesuwają, <kbd>A</kbd>/<kbd>D</kbd> obracają, <kbd>+</kbd>/<kbd>-</kbd> przybliżają, <kbd>0</kbd> resetuje kamerę.</p>
    </section>
  </article>`;
}
