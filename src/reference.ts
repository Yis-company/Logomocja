// Strona „Polecenia”: pełny opis dialektu po polsku.
import { highlight } from "./ui/editor";

interface Cmd { pl: string; en: string; arg: string; desc: string; ex: string; mode?: "3d" }

const MOVES: Cmd[] = [
  { pl: "np, naprzod, naprzód", en: "fd, forward", arg: "wyrażenie", desc: "Żółw idzie naprzód o podaną odległość. Z opuszczonym piórem rysuje odcinek.", ex: "np 100" },
  { pl: "ws, wstecz", en: "bk, back", arg: "wyrażenie", desc: "Żółw cofa się o podaną odległość, nie obracając się.", ex: "np 100 ws 50" },
  { pl: "pw, prawo", en: "rt, right", arg: "wyrażenie", desc: "Obrót w prawo o podaną liczbę stopni (zgodnie z ruchem wskazówek zegara, patrząc z góry).", ex: "np 60 pw 90 np 60" },
  { pl: "lw, lewo", en: "lt, left", arg: "wyrażenie", desc: "Obrót w lewo o podaną liczbę stopni. Kąt ujemny obraca w drugą stronę.", ex: "np 60 lw 45 np 60" },
  { pl: "dom", en: "home", arg: "—", desc: "Powrót do punktu 0,0 i ustawienia początkowego (nosem w górę ekranu). Z opuszczonym piórem rysuje odcinek do środka. Pióro, kolor i grubość zostają bez zmian.", ex: "pw 30 np 100 pw 120 np 100 dom" },
];
const PEN: Cmd[] = [
  { pl: "pod, podnies, podnieś", en: "pu, penup", arg: "—", desc: "Podnosi pióro: żółw porusza się bez rysowania.", ex: "np 40 pod np 40 opu np 40" },
  { pl: "opu, opusc, opuść", en: "pd, pendown", arg: "—", desc: "Opuszcza pióro: żółw znowu rysuje.", ex: "pod np 50 opu np 50" },
  { pl: "kolor", en: "color", arg: "kolor w cudzysłowie", desc: "Ustawia kolor pióra. Kolor to znak # i sześć cyfr szesnastkowych (czerwony, zielony, niebieski).", ex: 'kolor "#c1763d" np 100' },
  { pl: "grubosc, grubość", en: "width", arg: "liczba całkowita 1–12", desc: "Ustawia grubość kreski.", ex: "grubosc 8 np 100" },
  { pl: "czyść, czysc", en: "cs, clearscreen", arg: "—", desc: "Zapomina wszystkie narysowane odcinki. Żółw zostaje tam, gdzie stał, i niczego innego nie zmienia.", ex: "np 100 czyść pw 90 np 100" },
];
const FLOW: Cmd[] = [
  { pl: "powtorz, powtórz", en: "repeat", arg: "liczba 0–10000, potem [ polecenia ]", desc: "Wykonuje polecenia w nawiasach podaną liczbę razy. Wewnątrz nawiasów „nrpowt” (repcount) to numer bieżącego powtórzenia, liczony od 1.", ex: "powtorz 6 [np nrpowt * 20 pw 60]" },
  { pl: "niech", en: "let", arg: "nazwa, potem wyrażenie", desc: "Nadaje zmiennej wartość. Kolejne „niech” z tą samą nazwą zmienia wartość.", ex: "niech bok 80\npowtorz 4 [np bok pw 90]" },
  { pl: "jeśli, jesli", en: "if", arg: "warunek, potem [ polecenia ]", desc: "Wykonuje polecenia tylko wtedy, gdy warunek jest spełniony.", ex: "powtorz 8 [\n  jeśli nrpowt > 4 [kolor \"#c1763d\"]\n  np 50 pw 45\n]" },
  { pl: "jeżeli, jezeli", en: "ifelse", arg: "warunek, potem [ … ] [ … ]", desc: "Wykonuje pierwszy blok, gdy warunek jest spełniony, a drugi — gdy nie jest.", ex: "niech n 3\njeżeli n > 5 [np 100] [np 30]" },
  { pl: "stop", en: "stop", arg: "—", desc: "Kończy bieżącą procedurę (także z wnętrza pętli lub warunku). Poza procedurą kończy cały program.", ex: "np 50 stop np 500" },
];
const SPACE: Cmd[] = [
  { pl: "gora, góra", en: "pitchup", arg: "wyrażenie", desc: "Unosi nos żółwia o podaną liczbę stopni. Po „gora 90” żółw leci prosto w górę.", ex: "np 60 gora 90 np 60", mode: "3d" },
  { pl: "dol, dół", en: "pitchdown", arg: "wyrażenie", desc: "Opuszcza nos żółwia o podaną liczbę stopni.", ex: "gora 45 np 80 dol 90 np 80", mode: "3d" },
  { pl: "pp, przechylprawo", en: "rr, rollright", arg: "wyrażenie", desc: "Przechyla żółwia w prawo wokół kierunku lotu. Kierunek się nie zmienia, ale zmienia się to, gdzie żółw ma „górę” i „prawo”.", ex: "powtorz 4 [np 60 gora 90 np 60 dol 90 ws 60 pp 90]", mode: "3d" },
  { pl: "pl, przechyllewo", en: "rl, rollleft", arg: "wyrażenie", desc: "Przechyla żółwia w lewo wokół kierunku lotu.", ex: "pl 90 pw 90 np 80", mode: "3d" },
];

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function code(src: string, mode: "2d" | "3d" = "2d", tryIt = true): string {
  const btn = tryIt
    ? `<button type="button" class="btn btn-small try" data-try="${esc(src)}" data-mode="${mode}">Wypróbuj<span class="sr-only">: ${esc(src)}</span></button>`
    : "";
  return `<div class="ref-code"><pre class="code">${highlight(src, null).replace(/\n$/, "")}</pre>${btn}</div>`;
}

function table(title: string, id: string, intro: string, cmds: Cmd[]): string {
  const rows = cmds
    .map(
      (c) => `<article class="ref-cmd">
        <h4><code>${esc(c.pl)}</code> <span class="ref-en">ang. <code>${esc(c.en)}</code></span>${c.mode ? ' <span class="badge">tylko 3D</span>' : ""}</h4>
        <p class="ref-arg"><strong>Argument:</strong> ${esc(c.arg)}</p>
        <p>${esc(c.desc)}</p>
        ${code(c.ex, c.mode ?? "2d")}
      </article>`,
    )
    .join("");
  return `<section id="${id}" class="ref-section"><h3>${title}</h3><p>${intro}</p><div class="ref-grid">${rows}</div></section>`;
}

export function referenceHTML(shortcuts: string): string {
  return `
  <div class="page-inner prose">
    <h2>Polecenia Logomocji</h2>
    <p class="lead">Program to lista poleceń dla żółwia. Żółw startuje w punkcie 0,0, patrzy w górę ekranu, ma opuszczone pióro w kolorze
    <code>"#16866a"</code> i grubości 3. Każde polecenie ma nazwę polską i angielską — działają tak samo, a wielkość liter nie ma znaczenia.</p>
    <nav class="ref-toc" aria-label="Spis treści">
      <a href="#/polecenia/ruch">Ruch</a><a href="#/polecenia/pioro">Pióro</a><a href="#/polecenia/sterowanie">Pętle, zmienne, warunki</a>
      <a href="#/polecenia/wyrazenia">Wyrażenia</a><a href="#/polecenia/procedury">Procedury</a><a href="#/polecenia/przestrzen">Przestrzeń 3D</a>
      <a href="#/polecenia/bledy">Błędy i limity</a><a href="#/polecenia/skroty">Skróty</a>
    </nav>

    <section class="ref-section" id="zapis"><h3>Zapis programu</h3>
      <ul>
        <li>Polecenia oddziela się odstępami lub nowymi wierszami. Podział na wiersze ma znaczenie tylko przy nagłówku procedury i słowie <code>już</code>.</li>
        <li>Średnik zaczyna komentarz, który trwa do końca wiersza: <code>; to jest komentarz</code>.</li>
        <li>Liczby to zapis dziesiętny bez znaku: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy typu <code>1e3</code> czy <code>0x10</code> są błędem.</li>
        <li>Nawiasy kwadratowe <code>[ ]</code> obejmują polecenia pętli i warunków, okrągłe <code>( )</code> grupują działania.</li>
        <li>Kolor to napis w cudzysłowie: <code>"#16866a"</code>.</li>
      </ul>
    </section>

    ${table("Ruch", "ruch", "Odległości są w krokach żółwia, kąty w stopniach. Liczby mogą być ułamkowe i ujemne.", MOVES)}
    ${table("Pióro i rysunek", "pioro", "Ustawienia pióra obowiązują, dopóki ich nie zmienisz.", PEN)}
    ${table("Pętle, zmienne i warunki", "sterowanie", "Bloki w nawiasach kwadratowych można dowolnie zagnieżdżać (do 32 poziomów).", FLOW)}

    <section class="ref-section" id="wyrazenia"><h3>Wyrażenia</h3>
      <p>Wszędzie, gdzie polecenie oczekuje liczby, można wpisać wyrażenie: liczbę, nazwę zmiennej lub parametru (także w dawnym zapisie <code>:nazwa</code>),
      <code>nrpowt</code>, działanie w nawiasach, znak <code>-</code> lub <code>+</code> przed wartością albo dwa wyrażenia połączone znakiem <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>.</p>
      <ul>
        <li>Mnożenie i dzielenie wykonują się przed dodawaniem i odejmowaniem; działania równorzędne — od lewej do prawej.</li>
        <li><strong>Odstępy wokół działania:</strong> znak działania musi mieć odstęp po obu stronach albo po żadnej. <code>np 10 - 5</code> i <code>np 10-5</code> to 5 kroków,
        ale <code>np 10 -5</code> to <code>np 10</code> i zabłąkane <code>-5</code>, czyli błąd. Dzięki tej zasadzie <code>kwadrat 40 -5</code> przekazuje dwa argumenty.</li>
        <li>Znak przed wartością można powtarzać: <code>np -(3 - 5)</code>, <code>np - -2</code>, <code>np -bok</code>.</li>
        <li>Warunek to dwa wyrażenia i porównanie między nimi: <code>&lt;</code>, <code>&gt;</code>, <code>=</code>, <code>&lt;=</code>, <code>&gt;=</code>, <code>&lt;&gt;</code> (różne). Porównania są dokładne — <code>0.1 + 0.2 = 0.3</code> nie jest spełnione.</li>
        <li>Dzielenie przez zero zatrzymuje program z błędem.</li>
      </ul>
      ${code("np 2 + 3 * 4\npw 90\nnp (2 + 3) * 4")}
      ${code("niech bok 30\npowtorz 4 [np bok * nrpowt pw 90]")}
    </section>

    <section class="ref-section" id="zmienne"><h3>Zmienne</h3>
      <ul>
        <li><code>niech x 5</code> tworzy zmienną <code>x</code> lub zmienia jej wartość. Nazwa nie może być słowem języka ani nazwą procedury.</li>
        <li><code>niech</code> poza procedurą tworzy zmienną globalną, widoczną w całym programie.</li>
        <li><code>niech</code> wewnątrz procedury tworzy zmienną lokalną tego wywołania; przesłania ona zmienną globalną o tej samej nazwie i znika po zakończeniu wywołania. Tak samo można zmienić wartość parametru.</li>
        <li>Użycie nazwy, której nigdzie nie nadano wartości, jest błędem wykrywanym przed uruchomieniem. Odczyt zmiennej, zanim program nadał jej wartość, zatrzymuje program.</li>
      </ul>
      ${code("niech krok 10\npowtorz 20 [\n  np krok\n  pw 90\n  niech krok krok + 10\n]")}
    </section>

    <section class="ref-section" id="procedury"><h3>Procedury</h3>
      <p>Procedura to własne polecenie. Definicja zaczyna się od <code>oto</code> (ang. <code>to</code>) na początku wiersza; w tym samym wierszu stoi nazwa i — po <code>ma:</code> — parametry oddzielone przecinkami.
      Treść zajmuje kolejne wiersze, a kończy ją <code>już</code> (także <code>juz</code>, <code>end</code>) w osobnym wierszu.</p>
      ${code("oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90")}
      <ul>
        <li>Działa też dawny zapis nagłówka: <code>oto kwadrat :bok :kąt</code>, a w treści <code>:bok</code> zamiast <code>bok</code>.</li>
        <li>Wywołanie podaje tyle argumentów, ile procedura ma parametrów, oddzielonych odstępami. Każdy argument to wyrażenie: <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90.</li>
        <li>Definicje stoją tylko na najwyższym poziomie (nie w nawiasach i nie w innej procedurze), przed wywołaniami lub po nich. Nazwy nie można zdefiniować dwa razy.</li>
        <li>Procedura może wywoływać samą siebie (rekurencja). <code>stop</code> kończy bieżące wywołanie. Procedury nie zwracają wartości.</li>
        <li><code>nrpowt</code> odnosi się do pętli zapisanej w tym samym miejscu programu — w treści procedury poza pętlą jest błędem.</li>
      </ul>
      ${code("oto gałąź ma: dł\n  jeśli dł < 10 [stop]\n  np dł\n  lw 30 gałąź dł * 0.65\n  pw 60 gałąź dł * 0.65\n  lw 30 ws dł\njuż\n\ngałąź 80")}
    </section>

    ${table("Przestrzeń 3D", "przestrzen", "W trybie 3D oś x biegnie w prawo, y — naprzód, a z — do góry. Żółw startuje na podłożu, nosem wzdłuż osi y, z „górą” wzdłuż osi z. Polecenia poniżej działają tylko w trybie 3D; w trybie 2D są błędem. Program złożony z samych poleceń płaskich rysuje to samo w obu trybach.", SPACE)}

    <section class="ref-section" id="bledy"><h3>Błędy i limity</h3>
      <p>Program jest sprawdzany w całości, zanim żółw ruszy: przy błędzie zapisu nic się nie rysuje. Błąd, który wychodzi dopiero w trakcie działania
      (np. dzielenie przez zero), zatrzymuje żółwia, ale zostawia to, co już narysował. Każdy komunikat podaje wiersz i kolumnę, a edytor podkreśla to miejsce.</p>
      <table class="ref-table">
        <thead><tr><th scope="col">Limit</th><th scope="col">Wartość</th></tr></thead>
        <tbody>
          <tr><td>Długość programu</td><td>50 000 znaków</td></tr>
          <tr><td>Liczba elementów programu (słów, liczb, znaków, nawiasów)</td><td>10 000</td></tr>
          <tr><td>Zagnieżdżenie nawiasów kwadratowych</td><td>32 poziomy</td></tr>
          <tr><td>Jednocześnie aktywne pętle i wywołania procedur</td><td>32</td></tr>
          <tr><td>Wykonane operacje (polecenia, pętle, warunki, wywołania oraz zakończenia ich bloków)</td><td>10 000</td></tr>
          <tr><td>Odcinki na rysunku</td><td>10 000</td></tr>
          <tr><td>Współrzędne żółwia</td><td>od −100 000 do 100 000</td></tr>
          <tr><td>Liczba powtórzeń w <code>powtorz</code></td><td>liczba całkowita 0–10 000</td></tr>
          <tr><td>Grubość pióra</td><td>liczba całkowita 1–12</td></tr>
        </tbody>
      </table>
    </section>

    <section class="ref-section" id="skroty"><h3>Skróty klawiszowe</h3>
      ${shortcuts}
    </section>
  </div>`;
}
