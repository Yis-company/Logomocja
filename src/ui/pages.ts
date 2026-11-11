import { CHALLENGES, targetOf } from "../core/challenges";
import { EXAMPLES } from "../core/examples";
import { highlight } from "../core/highlight";
import { COMMAND_ALIASES, LIMITS, run, type CmdId, type Mode } from "../core/interp";
import { ICON } from "./icons";
import { load } from "./store";
import { thumbSvg } from "./thumbs";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const big = (v: number) => v.toString().replace(/\B(?=(\d{3})+$)/g, " ");
const MAC = /Mac|iPhone|iPad/.test(navigator.platform || "");
const MOD = MAC ? "⌘" : "Ctrl";

function segWord(n: number) {
  const d = n % 10, h = n % 100;
  if (n === 1) return "odcinek";
  return d >= 2 && d <= 4 && !(h >= 12 && h <= 14) ? "odcinki" : "odcinków";
}

export function examplesPage(): string {
  const group = (mode: Mode, title: string, lead: string) => `
    <section class="group" aria-labelledby="g-${mode}">
      <div class="group-head"><h2 id="g-${mode}">${title}</h2><p>${lead}</p></div>
      <ul class="tiles">
        ${EXAMPLES.filter((e) => e.mode === mode).map((e) => {
          const segs = run(e.source, e.mode).segments;
          return `<li><button type="button" class="tile" data-example="${e.id}">
            <span class="thumb">${thumbSvg("ex:" + e.id, segs, e.mode)}</span>
            <span class="tile-name">${esc(e.name)}</span>
            <span class="tile-text">${esc(e.blurb)}</span>
            <span class="tile-meta"><span class="tag">${e.mode.toUpperCase()}</span>${segs.length} ${segWord(segs.length)}</span>
          </button></li>`;
        }).join("")}
      </ul>
    </section>`;
  return `
    <div class="page page-wide">
      <header class="page-head">
        <h1 tabindex="-1">Przykłady</h1>
        <p>Trzynaście gotowych programów. Wybierz rysunek, a jego kod otworzy się w pracowni we właściwym trybie. Jeśli masz tam własny, niezapisany szkic, najpierw o niego zapytamy.</p>
      </header>
      ${group("2d", "Na płaszczyźnie", "Tryb 2D: żółw chodzi po kartce.")}
      ${group("3d", "W przestrzeni", "Tryb 3D: żółw unosi nos i przechyla się na boki.")}
    </div>`;
}

export function challengesPage(): string {
  const solved = load<string[]>("zaliczone", []);
  const done = CHALLENGES.filter((c) => solved.includes(c.id)).length;
  return `
    <div class="page page-wide">
      <header class="page-head">
        <h1 tabindex="-1">Zadania</h1>
        <p>Na arkuszu czeka wzór narysowany linią przerywaną. Napisz program, który go pokryje, i sprawdź rysunek. Liczy się kształt, rozmiar i położenie; kolejność kresek, kolor i grubość są dowolne.</p>
        <p class="progress"><span class="n">${done} / ${CHALLENGES.length}</span> zaliczonych. Postęp zapisuje się w tej przeglądarce.</p>
      </header>
      <ol class="tiles tiles-tasks">
        ${CHALLENGES.map((c, i) => {
          const ok = solved.includes(c.id);
          return `<li><a class="tile" href="#/zadania/${c.id}">
            <span class="thumb thumb-target">${thumbSvg("ch:" + c.id, targetOf(c), c.mode, true)}</span>
            <span class="tile-name"><span class="n">${i + 1}.</span> ${esc(c.title)}</span>
            <span class="tile-text">${esc(c.task)}</span>
            <span class="tile-meta"><span class="tag">${c.mode.toUpperCase()}</span>${ok ? `<span class="done">${ICON.check}zaliczone</span>` : "do zrobienia"}</span>
          </a></li>`;
        }).join("")}
      </ol>
    </div>`;
}

export function notFoundPage(): string {
  return `<div class="page"><header class="page-head"><h1 tabindex="-1">Nie ma takiej strony</h1>
    <p>Ten adres nie prowadzi do żadnej części Logomocji. <a href="#/">Wróć do pracowni</a>.</p></header></div>`;
}

// ---------------------------------------------------------------- opis języka

interface Entry {
  id?: CmdId;
  names?: string[];
  args: string;
  text: string;
  code: string;
  mode?: Mode;
}

let exampleNo = 0;
function sample(code: string, mode: Mode = "2d"): string {
  const r = run(code, mode);
  const key = "ref:" + exampleNo++;
  const fig = r.segments.length ? `<span class="thumb thumb-small">${thumbSvg(key, r.segments, mode)}</span>` : "";
  return `<div class="sample">
    <pre class="code"><code>${highlight(code)}</code></pre>
    ${fig}
    <button type="button" class="btn btn-small" data-try="${esc(code)}" data-mode="${mode}">${ICON.arrow}<span>Wypróbuj w ${mode.toUpperCase()}</span></button>
  </div>`;
}

function entry(e: Entry): string {
  const names = e.names ?? COMMAND_ALIASES[e.id!];
  return `<article class="cmd">
    <h3><code>${esc(names[0])}</code>${e.args ? ` <span class="args">${esc(e.args)}</span>` : ""}</h3>
    ${names.length > 1 ? `<p class="aliases">Inne zapisy: ${names.slice(1).map((n) => `<code>${esc(n)}</code>`).join(", ")}</p>` : ""}
    <p>${e.text}</p>
    ${sample(e.code, e.mode)}
  </article>`;
}

const MOVE: Entry[] = [
  { id: "fd", args: "odległość", text: "Żółw idzie naprzód o podaną odległość. Jeśli pisak jest opuszczony, zostawia odcinek.", code: "np 100" },
  { id: "bk", args: "odległość", text: "Żółw cofa się o podaną odległość, nie zmieniając kierunku, w którym patrzy.", code: "np 100\nws 40" },
  { id: "rt", args: "kąt", text: "Obrót w prawo o kąt w stopniach. Sam obrót niczego nie rysuje.", code: "np 80\npw 90\nnp 80" },
  { id: "lt", args: "kąt", text: "Obrót w lewo o kąt w stopniach.", code: "np 80\nlw 45\nnp 80" },
  { id: "home", args: "", text: "Żółw wraca do punktu startu (0, 0, 0) i ustawia się nosem do góry arkusza. Z opuszczonym pisakiem rysuje po drodze odcinek.", code: "pw 30\nnp 100\npw 120\nnp 100\ndom" },
  { id: "cs", args: "", text: "Ściera cały dotychczasowy rysunek. Żółw zostaje tam, gdzie stał, i patrzy tam, gdzie patrzył.", code: "np 100\nczyść\npw 90\nnp 60" },
];
const PEN: Entry[] = [
  { id: "pu", args: "", text: "Podnosi pisak: od tej chwili żółw chodzi, ale nie rysuje.", code: "np 40\npod\nnp 40\nopu\nnp 40" },
  { id: "pd", args: "", text: "Opuszcza pisak: żółw znów rysuje. Na początku programu pisak jest opuszczony.", code: "pod\nnp 50\nopu\nnp 50" },
  { id: "color", args: '"#rrggbb"', text: 'Ustawia kolor pisaka. Kolor to znak # i sześć cyfr szesnastkowych w cudzysłowie. Kolor początkowy to <code>"#16866a"</code>.', code: 'kolor "#c1763d"\nnp 60\nkolor "#2b6fb3"\nnp 60' },
  { id: "width", args: "liczba", text: "Ustawia grubość pisaka: liczba całkowita od 1 do 12. Grubość początkowa to 3.", code: "grubosc 1\nnp 40\ngrubosc 6\nnp 40\ngrubosc 12\nnp 40" },
];
const FLOW: Entry[] = [
  { id: "repeat", args: "ile [ polecenia ]", text: "Wykonuje polecenia z nawiasu podaną liczbę razy. Liczba powtórzeń musi być całkowita, od 0 do 10 000.", code: "powtorz 5 [\n  np 100\n  pw 144\n]" },
  { names: ["nrpowt", "repcount"], args: "", text: "Numer bieżącego powtórzenia, liczony od 1. Działa tylko wewnątrz nawiasów <code>powtorz</code> i dotyczy najbliższego powtarzania.", code: "powtorz 20 [\n  np nrpowt * 6\n  pw 90\n]" },
  { id: "if", args: "warunek [ polecenia ]", text: "Wykonuje polecenia tylko wtedy, gdy warunek jest prawdziwy. Warunek to dwa wyrażenia i znak porównania między nimi: <code>&lt;</code>, <code>&gt;</code>, <code>=</code>, <code>&lt;=</code>, <code>&gt;=</code> albo <code>&lt;&gt;</code> (różne).", code: "powtorz 8 [\n  jeśli nrpowt > 4 [kolor \"#c1763d\"]\n  np 60\n  pw 45\n]" },
  { id: "ifelse", args: "warunek [ gdy prawda ] [ gdy fałsz ]", text: "Wybiera jeden z dwóch bloków: pierwszy, gdy warunek jest prawdziwy, drugi, gdy fałszywy.", code: "powtorz 10 [\n  jeżeli nrpowt < 6 [np 30] [np 60]\n  pw 36\n]" },
  { id: "stop", args: "", text: "Kończy bieżącą procedurę i wraca do miejsca, z którego ją wywołano, także ze środka powtarzania. Poza procedurą kończy cały program.", code: "oto promień ma: dł\n  jeśli dł > 100 [stop]\n  np dł\n  ws dł\njuż\n\npowtorz 12 [\n  promień nrpowt * 12\n  pw 30\n]" },
];
const SPACE: Entry[] = [
  { id: "pitchup", args: "kąt", mode: "3d", text: "Unosi nos żółwia o podany kąt. Po <code>gora 90</code> żółw patrzy pionowo w górę.", code: "np 80\ngora 90\nnp 80" },
  { id: "pitchdown", args: "kąt", mode: "3d", text: "Opuszcza nos żółwia o podany kąt.", code: "gora 45\nnp 80\ndol 90\nnp 80" },
  { id: "rollright", args: "kąt", mode: "3d", text: "Przechyla żółwia w prawo wokół kierunku, w którym patrzy. Sam przechył nie zmienia kierunku marszu, ale zmienia to, co znaczą następne skręty.", code: "powtorz 6 [\n  powtorz 4 [np 70 pw 90]\n  pp 60\n]" },
  { id: "rollleft", args: "kąt", mode: "3d", text: "Przechyla żółwia w lewo wokół kierunku, w którym patrzy.", code: "powtorz 3 [\n  powtorz 3 [np 90 pw 120]\n  pl 120\n]" },
];

export function referencePage(): string {
  exampleNo = 0;
  const kbd = (s: string) => `<kbd>${s}</kbd>`;
  const sections: [string, string, string][] = [
    ["zapis", "Zapis programu", `
      <p>Program to polecenia oddzielone odstępami lub nowymi wierszami. W jednym wierszu może stać kilka poleceń. Wielkość liter nie ma znaczenia: <code>NP</code>, <code>Np</code> i <code>np</code> to to samo polecenie. Większość poleceń ma kilka zapisów: krótki, pełny (z polskimi znakami albo bez) i angielski.</p>
      <ul>
        <li><strong>Komentarz</strong> zaczyna się średnikiem i trwa do końca wiersza.</li>
        <li><strong>Liczby</strong> zapisuje się cyframi z kropką dziesiętną: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy takie jak <code>5.</code>, <code>1e3</code> czy <code>0x10</code> są błędem.</li>
        <li><strong>Nazwy</strong> zmiennych i procedur zaczynają się od litery (także polskiej) lub podkreślnika, dalej mogą mieć cyfry. Nie mogą powtarzać nazw poleceń.</li>
        <li><strong>Nawiasy kwadratowe</strong> obejmują polecenia do powtórzenia lub warunkowego wykonania, <strong>okrągłe</strong> grupują obliczenia.</li>
      </ul>
      ${sample('; Dwa polecenia w wierszu, potem komentarz\nNP 60 pw 90 ; skręt w prawo\nnaprzód 60')}
      <p>Na starcie żółw stoi w punkcie (0, 0, 0), patrzy w górę arkusza (wzdłuż osi Y), pisak jest opuszczony, ma kolor <code>"#16866a"</code> i grubość 3. Kąty podaje się w stopniach.</p>`],
    ["ruch", "Ruch i arkusz", MOVE.map(entry).join("")],
    ["pisak", "Pisak", PEN.map(entry).join("")],
    ["sterowanie", "Powtarzanie i warunki", FLOW.map(entry).join("")],
    ["zmienne", "Zmienne", `
      <article class="cmd">
        <h3><code>niech</code> <span class="args">nazwa wartość</span></h3>
        <p class="aliases">Inne zapisy: <code>let</code></p>
        <p>Nadaje zmiennej wartość. Tej samej zmiennej można potem nadać nową wartość, także obliczoną ze starej. W wyrażeniach nazwę zmiennej pisze się po prostu (<code>bok</code>) albo z dwukropkiem (<code>:bok</code>).</p>
        ${sample("niech bok 20\npowtorz 5 [\n  powtorz 4 [np bok pw 90]\n  niech bok bok + 20\n]")}
        <p>Zmienna nadana poza procedurami jest wspólna dla całego programu. <code>niech</code> wewnątrz procedury tworzy zmienną lokalną, która znika po zakończeniu procedury. Procedura może czytać zmienne wspólne, jeśli nie ma własnej o tej samej nazwie. Użycie zmiennej, zanim dostanie wartość, jest błędem.</p>
      </article>`],
    ["wyrazenia", "Wyrażenia", `
      <p>Wszędzie, gdzie polecenie oczekuje liczby, można wpisać wyrażenie: liczby, zmienne, <code>nrpowt</code>, działania <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, nawiasy okrągłe i minus przed wartością. Mnożenie i dzielenie mają pierwszeństwo przed dodawaniem i odejmowaniem, a działania o tym samym pierwszeństwie liczy się od lewej.</p>
      ${sample("niech n 7\npowtorz n [\n  np (40 + 20) * 1.5\n  pw 360 / n\n]")}
      <article class="cmd">
        <h3>Odstępy wokół działań</h3>
        <p>Polecenia nie mają nawiasów wokół argumentów, więc o tym, gdzie kończy się jedna wartość, a zaczyna następna, decydują odstępy. Znak działania musi mieć odstęp <strong>z obu stron albo z żadnej</strong>: <code>10 - 5</code> i <code>10-5</code> to odejmowanie. Znak z odstępem tylko z lewej strony zaczyna nową wartość: w <code>dwa 10 -5</code> procedura dostaje dwie wartości, 10 i −5.</p>
        ${sample("oto krok ma: a, b\n  np a pw 90 np b lw 90\njuż\n\nkrok 60 -20\nkrok 60 - 20 30")}
        <p>Dzielenie przez zero i wynik zbyt duży, by był liczbą, zatrzymują program z komunikatem.</p>
      </article>`],
    ["procedury", "Procedury", `
      <article class="cmd">
        <h3><code>oto</code> <span class="args">nazwa ma: parametr, parametr</span> … <code>już</code></h3>
        <p class="aliases">Inne zapisy: <code>to</code> … <code>juz</code>, <code>end</code>; parametry także w stylu <code>oto kwadrat :bok</code></p>
        <p>Definiuje własne polecenie. Nagłówek zajmuje cały wiersz i zaczyna się na jego początku; treść stoi w następnych wierszach, a słowo <code>już</code> w osobnym wierszu kończy definicję. Procedurę wywołuje się jej nazwą, podając tyle wartości, ile ma parametrów. Definicja może stać w programie niżej niż wywołanie.</p>
        ${sample("oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\n\nkwadrat 40\nkwadrat 80\nkwadrat 120")}
        <p>Procedura może wywoływać samą siebie. Taka rekurencja musi mieć warunek z poleceniem <code>stop</code>, inaczej program zatrzyma limit zagnieżdżenia albo limit operacji. Procedury nie zwracają wyników i nie można ich definiować wewnątrz nawiasów ani innych procedur.</p>
        ${sample("oto gałąź ma: dł\n  jeśli dł < 10 [stop]\n  np dł\n  lw 30 gałąź dł * 0.65\n  pw 60 gałąź dł * 0.65\n  lw 30\n  ws dł\njuż\n\ngałąź 80")}
      </article>`],
    ["przestrzen", "Trzeci wymiar", `
      <p>W trybie 3D żółw ma trzy osie obrotu. <code>pw</code> i <code>lw</code> skręcają go wokół jego własnego grzbietu, <code>gora</code> i <code>dol</code> unoszą i opuszczają nos, a <code>pp</code> i <code>pl</code> przechylają go na boki. Każdy obrót liczy się względem aktualnego ustawienia żółwia, nie względem arkusza. Program bez tych czterech poleceń rysuje w obu trybach dokładnie to samo, na płaszczyźnie siatki. W trybie 2D polecenia przestrzenne są błędem, zanim cokolwiek zostanie narysowane.</p>
      ${SPACE.map(entry).join("")}`],
    ["bledy", "Błędy", `
      <p>Każdy komunikat podaje wiersz i kolumnę oraz podpowiada, co poprawić. Miejsce błędu jest podkreślone w edytorze, a numer wiersza zaznaczony na marginesie.</p>
      <ul>
        <li><strong>Błąd w zapisie</strong> (nieznane polecenie, brak nawiasu, zła liczba argumentów) wykrywa się przed uruchomieniem. Żółw nie rysuje wtedy niczego.</li>
        <li><strong>Błąd w trakcie rysowania</strong> (dzielenie przez zero, przekroczony limit, zmienna bez wartości) zatrzymuje program. To, co żółw zdążył narysować, zostaje na arkuszu.</li>
      </ul>
      ${sample("np 100\npw 90\nnp 100 / 0")}`],
    ["limity", "Ograniczenia", `
      <p>Limity chronią przeglądarkę przed programem, który nigdy się nie kończy. Tabelka rysunkowa na arkuszu pokazuje, ile odcinków i operacji program już zużył.</p>
      <table class="limits">
        <thead><tr><th scope="col">Co</th><th scope="col">Limit</th></tr></thead>
        <tbody>
          <tr><th scope="row">Długość programu</th><td class="n">${big(LIMITS.chars)} znaków</td></tr>
          <tr><th scope="row">Słowa, liczby i znaki w programie</th><td class="n">${big(LIMITS.tokens)}</td></tr>
          <tr><th scope="row">Zagnieżdżenie nawiasów [ ] w zapisie</th><td class="n">${LIMITS.depth} poziomy</td></tr>
          <tr><th scope="row">Aktywne naraz powtórzenia i wywołania procedur</th><td class="n">${LIMITS.frames}</td></tr>
          <tr><th scope="row">Operacje w jednym uruchomieniu</th><td class="n">${big(LIMITS.ops)}</td></tr>
          <tr><th scope="row">Odcinki na arkuszu</th><td class="n">${big(LIMITS.segments)}</td></tr>
          <tr><th scope="row">Każda współrzędna żółwia</th><td class="n">od −${big(LIMITS.coord)} do ${big(LIMITS.coord)}</td></tr>
          <tr><th scope="row">Liczba powtórzeń w <code>powtorz</code></th><td class="n">od 0 do ${big(LIMITS.repeat)}, całkowita</td></tr>
          <tr><th scope="row">Grubość pisaka</th><td class="n">od ${LIMITS.widthMin} do ${LIMITS.widthMax}, całkowita</td></tr>
        </tbody>
      </table>
      <p>Operacją jest każde wykonane polecenie. Dodatkowo po jednej operacji liczy się za każde zakończone powtórzenie, każdy wykonany blok warunku i każde zakończone wywołanie procedury.</p>`],
    ["skroty", "Skróty klawiszowe", `
      <table class="limits keys">
        <thead><tr><th scope="col">Czynność</th><th scope="col">Klawisze</th></tr></thead>
        <tbody>
          <tr><th scope="row">Uruchom program lub wznów po pauzie</th><td>${kbd(MOD)} + ${kbd("Enter")}</td></tr>
          <tr><th scope="row">Wykonaj jeden krok</th><td>${kbd(MOD)} + ${kbd(".")}</td></tr>
          <tr><th scope="row">Pauza</th><td>${kbd("Esc")}</td></tr>
          <tr><th scope="row">Reset: wyczyść arkusz, żółw na start</th><td>${kbd(MOD)} + ${kbd("Shift")} + ${kbd("Backspace")}</td></tr>
          <tr><th scope="row">Arkusz: przesuń widok (w 3D obróć kamerę)</th><td>strzałki</td></tr>
          <tr><th scope="row">Arkusz 3D: przesuń widok</th><td>${kbd("Shift")} + strzałki</td></tr>
          <tr><th scope="row">Arkusz: powiększ, pomniejsz, dopasuj</th><td>${kbd("+")} ${kbd("−")} ${kbd("0")}</td></tr>
        </tbody>
      </table>
      <p>Skróty programu działają w całej pracowni, także gdy kursor jest w edytorze. Klawisz Tab nie wstawia wcięcia, tylko przechodzi do następnej kontrolki; wcięcia robi się spacjami, a Enter zachowuje wcięcie poprzedniego wiersza. Myszą arkusz przesuwa się przeciąganiem, a w 3D przeciąganie obraca kamerę (z Shiftem lub prawym przyciskiem przesuwa). Kółko myszy i gest szczypania zmieniają powiększenie.</p>`],
  ];
  return `
    <div class="page page-ref">
      <nav class="toc" aria-label="Spis treści">
        <ol>${sections.map(([id, title]) => `<li><a href="#/polecenia/${id}" data-jump="${id}">${title}</a></li>`).join("")}</ol>
      </nav>
      <div class="ref-body">
        <header class="page-head">
          <h1 tabindex="-1">Polecenia</h1>
          <p>Cały dialekt Logo, którym mówi Logomocja. Każdy przykład jest prawdziwym programem: obok widać, co rysuje, i można go otworzyć w pracowni.</p>
        </header>
        ${sections.map(([id, title, body]) => `<section class="ref-sec" id="sec-${id}" aria-labelledby="h-${id}"><h2 id="h-${id}" tabindex="-1">${title}</h2>${body}</section>`).join("")}
      </div>
    </div>`;
}
