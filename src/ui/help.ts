import { highlightHTML } from './highlight';
import { icon } from './icons';
import { SHORTCUTS } from './shortcuts';
import type { Mode } from '../lang/parser';

export interface HelpExample {
  code: string;
  mode: Mode;
}

interface Cmd {
  names: string[];
  english: string[];
  arg: string;
  text: string;
  ex: HelpExample;
}

const c2 = (code: string): HelpExample => ({ code, mode: '2d' });
const c3 = (code: string): HelpExample => ({ code, mode: '3d' });

const MOVE: Cmd[] = [
  { names: ['np', 'naprzod', 'naprzód'], english: ['fd', 'forward'], arg: 'odległość', text: 'Przesuwa żółwia naprzód o podaną liczbę kroków. Z opuszczonym piórem zostawia linię.', ex: c2('np 100') },
  { names: ['ws', 'wstecz'], english: ['bk', 'back'], arg: 'odległość', text: 'Przesuwa żółwia do tyłu; żółw nie zmienia kierunku.', ex: c2('np 100\nws 40\npw 90\nnp 40') },
  { names: ['pw', 'prawo'], english: ['rt', 'right'], arg: 'kąt w stopniach', text: 'Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry).', ex: c2('np 60\npw 90\nnp 60') },
  { names: ['lw', 'lewo'], english: ['lt', 'left'], arg: 'kąt w stopniach', text: 'Obraca żółwia w lewo. Ujemny kąt obraca w drugą stronę.', ex: c2('np 60\nlw 45\nnp 60') },
  { names: ['dom'], english: ['home'], arg: '—', text: 'Wraca do środka układu (z linią, jeśli pióro jest opuszczone) i ustawia żółwia głową w górę. Pióro, kolor i grubość się nie zmieniają.', ex: c2('np 80\npw 90\nnp 60\ndom') },
];

const PEN: Cmd[] = [
  { names: ['pod', 'podnies', 'podnieś'], english: ['pu', 'penup'], arg: '—', text: 'Podnosi pióro: żółw chodzi, ale nie rysuje.', ex: c2('np 30\npod np 20 opu\nnp 30') },
  { names: ['opu', 'opusc', 'opuść'], english: ['pd', 'pendown'], arg: '—', text: 'Opuszcza pióro: od teraz ruch zostawia linię.', ex: c2('pod ws 50 opu\nnp 100') },
  { names: ['kolor'], english: ['color'], arg: 'kolor "#rrggbb"', text: 'Ustawia kolor pióra. Kolor zapisuje się w cudzysłowie jako # i sześć cyfr szesnastkowych. Na początku pióro ma kolor "#16866a".', ex: c2('kolor "#c1763d"\nnp 100\nkolor "#2b6fb3"\npw 90 np 100') },
  { names: ['grubosc', 'grubość'], english: ['width'], arg: 'liczba całkowita 1–12', text: 'Ustawia grubość linii. Na początku wynosi 3.', ex: c2('grubosc 1 np 60\ngrubosc 6 np 60\ngrubosc 12 np 60') },
  { names: ['czyść', 'czysc'], english: ['cs', 'clearscreen'], arg: '—', text: 'Zmazuje wszystko, co narysowano do tej pory. Żółw zostaje tam, gdzie był, i patrzy w tę samą stronę.', ex: c2('powtorz 4 [np 80 pw 90]\nczyść\npw 45 np 80') },
];

const SPACE: Cmd[] = [
  { names: ['gora', 'góra'], english: ['pitchup'], arg: 'kąt w stopniach', text: 'Unosi nos żółwia ku jego „górze”. Po gora 90 żółw leci tam, gdzie przedtem miał grzbiet.', ex: c3('np 50\ngora 90\nnp 50') },
  { names: ['dol', 'dół'], english: ['pitchdown'], arg: 'kąt w stopniach', text: 'Opuszcza nos żółwia w dół.', ex: c3('np 50\ndol 45\nnp 50') },
  { names: ['pp', 'przechylprawo'], english: ['rr', 'rollright'], arg: 'kąt w stopniach', text: 'Przechyla żółwia na prawy bok wokół kierunku ruchu. Kierunek się nie zmienia, zmienia się to, gdzie jest „góra” i „prawo”.', ex: c3('pp 90\npowtorz 4 [np 60 pw 90]') },
  { names: ['pl', 'przechyllewo'], english: ['rl', 'rollleft'], arg: 'kąt w stopniach', text: 'Przechyla żółwia na lewy bok.', ex: c3('pl 45\npowtorz 4 [np 60 pw 90]') },
];

const q = (s: string) => `<code>${s}</code>`;

function codeBlock(ex: HelpExample): string {
  return `<div class="sample">
    <pre class="code"><code>${highlightHTML(ex.code)}</code></pre>
    <button type="button" class="btn btn-quiet btn-small" data-try="${encodeURIComponent(ex.code)}" data-mode="${ex.mode}">${icon('play')}<span>Wypróbuj w pracowni${ex.mode === '3d' ? ' (3D)' : ''}</span></button>
  </div>`;
}

function cmdTable(cmds: Cmd[]): string {
  return cmds.map((c) => `
    <article class="cmd">
      <h3 class="cmd-name">${c.names.map(q).join(' ')}</h3>
      <dl class="cmd-meta">
        <div><dt>Po angielsku</dt><dd>${c.english.map(q).join(', ')}</dd></div>
        <div><dt>Argument</dt><dd>${c.arg}</dd></div>
      </dl>
      <p>${c.text}</p>
      ${codeBlock(c.ex)}
    </article>`).join('');
}

const SECTIONS: { id: string; title: string; body: () => string }[] = [
  {
    id: 'start',
    title: 'Pierwsze kroki',
    body: () => `
      <p>Logomocja to pracownia języka Logo. Piszesz polecenia, a żółw wykonuje je jedno po drugim i rysuje ślad. W trybie <strong>2D</strong> żółw chodzi po płaszczyźnie, w trybie <strong>3D</strong> także się wznosi i przechyla.</p>
      <p>Żółw zaczyna w środku układu, głową w górę kartki (oś y), z opuszczonym piórem w kolorze "#16866a" o grubości 3. Oś x biegnie w prawo, oś z do góry, w stronę patrzącego na kartkę.</p>
      ${codeBlock(c2('; Średnik zaczyna komentarz.\npowtorz 4 [np 100 pw 90]'))}
      <p>„Uruchom” rysuje cały program z animacją w wybranym tempie. „Krok” wykonuje jedno polecenie i podświetla jego wiersz. „Pauza” wstrzymuje rysowanie, „Reset” czyści kartkę. Wielkość liter nie ma znaczenia, a polecenia można pisać z polskimi znakami albo bez nich: ${q('powtórz')} i ${q('powtorz')} znaczą to samo. Działają też angielskie nazwy, np. ${q('fd')} i ${q('rt')}.</p>`,
  },
  { id: 'ruch', title: 'Ruch i obroty', body: () => cmdTable(MOVE) },
  { id: 'pioro', title: 'Pióro, kolor i grubość', body: () => cmdTable(PEN) },
  {
    id: 'powtorz',
    title: 'Powtórzenia',
    body: () => `
      <article class="cmd">
        <h3 class="cmd-name">${q('powtorz')} ${q('powtórz')}</h3>
        <dl class="cmd-meta"><div><dt>Po angielsku</dt><dd>${q('repeat')}</dd></div><div><dt>Argument</dt><dd>liczba całkowita 0–10 000, potem [ polecenia ]</dd></div></dl>
        <p>Wykonuje polecenia w nawiasach kwadratowych podaną liczbę razy. Przy 0 nie wykonuje ich wcale. W środku może stać wszystko, także kolejne powtórzenia, warunki i wywołania procedur.</p>
        ${codeBlock(c2('powtorz 6 [\n  powtorz 6 [np 40 pw 60]\n  pw 60\n]'))}
      </article>
      <article class="cmd">
        <h3 class="cmd-name">${q('nrpowt')}</h3>
        <dl class="cmd-meta"><div><dt>Po angielsku</dt><dd>${q('repcount')}</dd></div><div><dt>Rodzaj</dt><dd>wartość, nie polecenie</dd></div></dl>
        <p>Numer bieżącego powtórzenia najbliższego „powtórz”, licząc od 1. Musi stać wewnątrz „powtórz” zapisanego w tym samym miejscu programu: w procedurze liczy się tylko „powtórz” z tej procedury.</p>
        ${codeBlock(c2('powtorz 20 [\n  np nrpowt * 8\n  pw 90\n]'))}
      </article>`,
  },
  {
    id: 'wyrazenia',
    title: 'Liczby i wyrażenia',
    body: () => `
      <p>Liczby zapisujemy cyframi, z kropką jako przecinkiem dziesiętnym: ${q('80')}, ${q('12.5')}, ${q('.5')}. Zapisy takie jak ${q('1e3')} czy ${q('0x10')} nie są liczbami. Tam, gdzie polecenie oczekuje liczby, można wpisać wyrażenie:</p>
      <ul>
        <li>działania ${q('+')} ${q('-')} ${q('*')} ${q('/')}; mnożenie i dzielenie są ważniejsze od dodawania i odejmowania, a działania równorzędne liczy się od lewej: ${q('np 20 - 5 - 3')} idzie o 12, ${q('np 2 + 3 * 4')} o 14;</li>
        <li>nawiasy okrągłe: ${q('np (2 + 3) * 4')};</li>
        <li>znak przed wartością, także kilka razy: ${q('np -(3 - 5)')}, ${q('np - -2')}, ${q('np -bok')};</li>
        <li>nazwy zmiennych i parametrów (także w dawnym zapisie ${q(':bok')}) oraz ${q('nrpowt')}.</li>
      </ul>
      <div class="callout">
        <h3>Spacje przy znakach działań</h3>
        <p>Znak działania musi mieć spacje po obu stronach albo nie mieć ich wcale: ${q('np 10 - 5')} i ${q('np 10-5')} idą o 5. Zapis ${q('np 10 -5')} oznacza dwie rzeczy: ${q('np 10')} i osobne ${q('-5')}, więc jest błędem. Dzięki tej zasadzie ${q('kwadrat 40 -5')} przekazuje procedurze dwa argumenty: 40 i -5.</p>
      </div>
      <p>Dzielenie przez zero i wynik zbyt duży, by był liczbą, są błędami wykonania.</p>
      ${codeBlock(c2('niech bok 30\nnp bok * 2 + 10\npw 360 / 4\nnp -(bok - 50)'))}`,
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    body: () => `
      <article class="cmd">
        <h3 class="cmd-name">${q('niech')}</h3>
        <dl class="cmd-meta"><div><dt>Po angielsku</dt><dd>${q('let')}</dd></div><div><dt>Argumenty</dt><dd>nazwa, potem wyrażenie</dd></div></dl>
        <p>Nadaje zmiennej wartość; kolejne ${q('niech')} z tą samą nazwą ją zmienia. Nazwa nie może być słowem języka ani nazwą procedury.</p>
        ${codeBlock(c2('niech bok 20\npowtorz 8 [\n  np bok pw 90\n  niech bok bok + 10\n]'))}
      </article>
      <ul>
        <li>${q('niech')} poza procedurami tworzy zmienną <strong>globalną</strong>.</li>
        <li>${q('niech')} wewnątrz procedury tworzy zmienną <strong>lokalną</strong> dla tego wywołania. Od tej chwili do końca wywołania zasłania zmienną globalną o tej samej nazwie; po powrocie znika. Tak samo można zmienić parametr.</li>
        <li>Nazwy wolno użyć, jeśli jest parametrem procedury, jeśli w tej procedurze stoi gdzieś ${q('niech')} z tą nazwą albo jeśli ${q('niech')} z tą nazwą stoi gdzieś poza procedurami (przed albo po użyciu). Inna nazwa to błąd, zgłaszany przed rysowaniem.</li>
        <li>Odczyt zmiennej, która jeszcze nie dostała wartości, zatrzymuje program.</li>
      </ul>`,
  },
  {
    id: 'warunki',
    title: 'Warunki',
    body: () => `
      <p>Warunek to dwa wyrażenia i porównanie między nimi: ${q('<')} ${q('>')} ${q('=')} ${q('<=')} ${q('>=')} ${q('<>')} (różne). Porównania są dokładne: ${q('0.1 + 0.2 = 0.3')} nie jest prawdą, bo komputer liczy ułamki z drobnym błędem.</p>
      <article class="cmd">
        <h3 class="cmd-name">${q('jeśli')} ${q('jesli')}</h3>
        <dl class="cmd-meta"><div><dt>Po angielsku</dt><dd>${q('if')}</dd></div><div><dt>Argumenty</dt><dd>warunek, potem [ polecenia ]</dd></div></dl>
        <p>Wykonuje polecenia tylko wtedy, gdy warunek jest spełniony.</p>
        ${codeBlock(c2('powtorz 8 [\n  jeśli nrpowt > 4 [kolor "#c1763d"]\n  np 30 pw 45\n]'))}
      </article>
      <article class="cmd">
        <h3 class="cmd-name">${q('jeżeli')} ${q('jezeli')}</h3>
        <dl class="cmd-meta"><div><dt>Po angielsku</dt><dd>${q('ifelse')}</dd></div><div><dt>Argumenty</dt><dd>warunek, [ gdy tak ], [ gdy nie ]</dd></div></dl>
        <p>Wykonuje pierwszy blok, gdy warunek jest spełniony, a drugi w przeciwnym razie.</p>
        ${codeBlock(c2('powtorz 12 [\n  jeżeli nrpowt / 2 = 6 [grubosc 8] [grubosc 2]\n  np 20\n]'))}
      </article>`,
  },
  {
    id: 'procedury',
    title: 'Procedury',
    body: () => `
      <p>Procedura to nowe polecenie zbudowane z innych. Definicja zaczyna się od ${q('oto')} (albo ${q('to')}) na początku wiersza; w tym samym wierszu stoi nazwa, a po ${q('ma:')} lista parametrów oddzielonych przecinkami. Treść zaczyna się w następnym wierszu i kończy słowem ${q('już')} (albo ${q('juz')}, ${q('end')}) stojącym samotnie w osobnym wierszu.</p>
      ${codeBlock(c2('oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90\nkwadrat 40 * 2 -90'))}
      <ul>
        <li>Wywołanie podaje dokładnie tyle argumentów, ile procedura ma parametrów; każdy argument to wyrażenie.</li>
        <li>Działa też dawny zapis nagłówka ${q('oto kwadrat :bok :kąt')}, a parametr można pisać jako ${q(':bok')} albo ${q('bok')}.</li>
        <li>Definicje stoją tylko na najwyższym poziomie programu, przed albo po wywołaniach. Każdą nazwę definiuje się raz.</li>
        <li>Parametr może nazywać się tak jak procedura: na początku polecenia to wywołanie, w miejscu wartości to parametr.</li>
        <li>Procedura może wywołać samą siebie (rekurencja). Procedury nie zwracają wartości.</li>
      </ul>
      <article class="cmd">
        <h3 class="cmd-name">${q('stop')}</h3>
        <dl class="cmd-meta"><div><dt>Argument</dt><dd>—</dd></div></dl>
        <p>Natychmiast kończy bieżące wywołanie procedury, także gdy stoi w środku powtórzenia albo warunku. Poza procedurą kończy cały program.</p>
        ${codeBlock(c2('oto spirala ma: dł\n  jeśli dł > 120 [stop]\n  np dł pw 90\n  spirala dł + 8\njuż\n\nspirala 8'))}
      </article>`,
  },
  {
    id: 'trzyd',
    title: 'Przestrzeń 3D',
    body: () => `
      <p>W trybie 3D żółw ma trzy kierunki: <strong>naprzód</strong> (głowa), <strong>prawo</strong> i <strong>górę</strong> (grzbiet). ${q('pw')} i ${q('lw')} obracają go wokół grzbietu, ${q('gora')} i ${q('dol')} wokół prawego boku, a ${q('pp')} i ${q('pl')} wokół kierunku ruchu. Program złożony tylko z poleceń płaskich rysuje w 3D dokładnie to samo co w 2D, na ziemi (z = 0). W trybie 2D poniższe polecenia są błędem.</p>
      ${cmdTable(SPACE)}`,
  },
  {
    id: 'bledy',
    title: 'Błędy i ograniczenia',
    body: () => `
      <p>Każdy błąd ma numer wiersza i kolumny oraz opis po polsku; edytor zaznacza miejsce, a znacznik znika, gdy poprawisz ten wiersz. Program jest sprawdzany w całości, zanim żółw ruszy: przy błędzie zapisu nic się nie rysuje. Błędy, które wychodzą dopiero w trakcie (dzielenie przez zero, przekroczony limit, zmienna bez wartości, zła grubość albo liczba powtórzeń wyliczona ze zmiennej), zatrzymują żółwia, a to, co narysował, zostaje.</p>
      <table class="limits">
        <caption class="sr-only">Ograniczenia programu</caption>
        <thead><tr><th scope="col">Co</th><th scope="col">Najwyżej</th></tr></thead>
        <tbody>
          <tr><td>Długość programu</td><td>50 000 znaków</td></tr>
          <tr><td>Elementy programu (słowa, liczby, znaki działań, nawiasy, przecinki)</td><td>10 000</td></tr>
          <tr><td>Zagnieżdżenie nawiasów kwadratowych</td><td>32</td></tr>
          <tr><td>Jednocześnie trwające wywołania procedur i powtórzenia</td><td>32</td></tr>
          <tr><td>Wykonane operacje: każde polecenie, ${q('niech')}, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdego obiegu powtórzenia, bloku warunku i wywołania</td><td>10 000</td></tr>
          <tr><td>Odcinki na rysunku (po ${q('czyść')} liczy się od nowa)</td><td>10 000</td></tr>
          <tr><td>Współrzędne żółwia</td><td>od -100 000 do 100 000</td></tr>
          <tr><td>Grubość pióra</td><td>liczba całkowita 1–12</td></tr>
          <tr><td>Liczba powtórzeń</td><td>liczba całkowita 0–10 000</td></tr>
        </tbody>
      </table>`,
  },
  {
    id: 'skroty',
    title: 'Skróty klawiszowe',
    body: () => `
      <dl class="keys keys-wide">${SHORTCUTS.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
      <p>Na Macu zamiast Ctrl użyj ⌘. Edytor przy Enterze zachowuje wcięcie, a po „[” na końcu wiersza dodaje dwie spacje. Tab przechodzi do następnego przycisku, więc klawiatura nigdy nie zostaje uwięziona w edytorze.</p>`,
  },
];

/** Wszystkie przykłady z pomocy: testy sprawdzają, że działają bez błędu. */
export function helpExamples(): HelpExample[] {
  const all: HelpExample[] = [];
  for (const list of [MOVE, PEN, SPACE]) for (const c of list) all.push(c.ex);
  for (const s of SECTIONS) {
    const html = s.body();
    for (const m of html.matchAll(/data-try="([^"]+)" data-mode="(2d|3d)"/g)) all.push({ code: decodeURIComponent(m[1]), mode: m[2] as Mode });
  }
  return all;
}

export function helpPage(onTry: (code: string, mode: Mode) => void): HTMLElement {
  const el = document.createElement('div');
  el.className = 'page page-help';
  el.innerHTML = `
    <nav class="toc" aria-label="Spis treści pomocy">
      <h2 class="toc-title">Spis treści</h2>
      <ol>${SECTIONS.map((s) => `<li><a href="#/pomoc/${s.id}" data-sec="${s.id}">${s.title}</a></li>`).join('')}</ol>
    </nav>
    <article class="doc">
      <header class="page-head">
        <h1>Pomoc: język Logomocji</h1>
        <p class="lede">Wszystkie polecenia z przykładami. Każdy przykład można otworzyć w pracowni jednym kliknięciem.</p>
      </header>
      ${SECTIONS.map((s) => `<section id="pomoc-${s.id}" class="doc-sec" aria-labelledby="h-${s.id}"><h2 id="h-${s.id}" tabindex="-1">${s.title}</h2>${s.body()}</section>`).join('')}
    </article>`;
  el.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('[data-try]');
    if (!b) return;
    onTry(decodeURIComponent(b.dataset.try!), b.dataset.mode as Mode);
  });
  return el;
}

export function scrollToSection(page: HTMLElement, id: string) {
  const h = page.querySelector<HTMLElement>(`#h-${CSS.escape(id)}`);
  if (!h) return;
  h.scrollIntoView({ block: 'start' });
  h.focus({ preventScroll: true });
  for (const a of page.querySelectorAll<HTMLElement>('.toc a')) {
    if (a.dataset.sec === id) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
}
