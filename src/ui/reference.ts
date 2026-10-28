import { EXAMPLES } from '../logo/examples';
import { encodeSource } from './share';

interface Entry {
  names: string;
  argument: string;
  text: string;
  example: string;
  mode: '2d' | '3d';
}

const COMMANDS: Entry[] = [
  { names: 'np, naprzod, naprzód, fd, forward', argument: 'wyrażenie', text: 'Przesuwa żółwia do przodu o podaną odległość. Rysuje, jeśli pisak jest opuszczony.', example: 'np 80', mode: '2d' },
  { names: 'ws, wstecz, bk, back', argument: 'wyrażenie', text: 'Przesuwa żółwia do tyłu o podaną odległość.', example: 'ws 40', mode: '2d' },
  { names: 'pw, prawo, rt, right', argument: 'wyrażenie (stopnie)', text: 'Obraca żółwia w prawo, wokół pionu.', example: 'pw 90', mode: '2d' },
  { names: 'lw, lewo, lt, left', argument: 'wyrażenie (stopnie)', text: 'Obraca żółwia w lewo, wokół pionu. Ujemny kąt obraca w drugą stronę.', example: 'lw 45', mode: '2d' },
  { names: 'pod, podnies, podnieś, pu, penup', argument: 'brak', text: 'Podnosi pisak: kolejne ruchy nie rysują.', example: 'pod np 50 opu', mode: '2d' },
  { names: 'opu, opusc, opuść, pd, pendown', argument: 'brak', text: 'Opuszcza pisak: ruchy znów rysują.', example: 'opu np 50', mode: '2d' },
  { names: 'kolor, color', argument: 'kolor "#rrggbb"', text: 'Ustawia kolor pisaka. Kolor zapisany jest w cudzysłowie, sześcioma cyframi szesnastkowymi.', example: 'kolor "#c1763d"', mode: '2d' },
  { names: 'grubosc, grubość, width', argument: 'liczba całkowita 1–12', text: 'Ustawia grubość linii.', example: 'grubosc 4', mode: '2d' },
  { names: 'powtorz, powtórz, repeat', argument: 'liczba 0–10000, potem [ blok ]', text: 'Wykonuje blok podaną liczbę razy. Wewnątrz bloku nrpowt daje numer obiegu, od 1.', example: 'powtorz 4 [np 50 pw 90]', mode: '2d' },
  { names: 'niech, let', argument: 'nazwa wyrażenie', text: 'Przypisuje wartość zmiennej. Na poziomie głównym tworzy zmienną globalną, w procedurze lokalną dla wywołania.', example: 'niech bok 40', mode: '2d' },
  { names: 'jeśli, jesli, if', argument: 'warunek [ blok ]', text: 'Wykonuje blok, gdy warunek jest spełniony. Warunek to wyrażenie porównania: = < > <= >= <>.', example: 'jeśli bok > 10 [np bok]', mode: '2d' },
  { names: 'jeżeli, jezeli, ifelse', argument: 'warunek [ blok ] [ blok ]', text: 'Wykonuje pierwszy blok, gdy warunek jest spełniony, a w przeciwnym razie drugi.', example: 'jeżeli nrpowt > 2 [kolor "#c1763d"] [kolor "#16866a"]', mode: '2d' },
  { names: 'stop', argument: 'brak', text: 'Kończy bieżącą procedurę. Na poziomie głównym kończy program.', example: 'jeśli bok < 5 [stop]', mode: '2d' },
  { names: 'dom, home', argument: 'brak', text: 'Wraca do punktu (0, 0) i do kierunku startowego. Pisak i kolor zostają bez zmian.', example: 'dom', mode: '2d' },
  { names: 'czyść, czysc, cs, clearscreen', argument: 'brak', text: 'Kasuje cały dotychczasowy rysunek. Żółw i jego stan zostają.', example: 'cs', mode: '2d' },
  { names: 'gora, góra, pitchup', argument: 'wyrażenie (stopnie)', text: 'Tylko 3D. Unosi nos żółwia o podany kąt.', example: 'gora 90 np 50', mode: '3d' },
  { names: 'dol, dół, pitchdown', argument: 'wyrażenie (stopnie)', text: 'Tylko 3D. Opuszcza nos żółwia o podany kąt.', example: 'dol 30 np 50', mode: '3d' },
  { names: 'pp, przechylprawo, rr, rollright', argument: 'wyrażenie (stopnie)', text: 'Tylko 3D. Przechyla żółwia w prawo wokół kierunku ruchu; kierunek się nie zmienia.', example: 'pp 90 gora 90 np 50', mode: '3d' },
  { names: 'pl, przechyllewo, rl, rollleft', argument: 'wyrażenie (stopnie)', text: 'Tylko 3D. Przechyla żółwia w lewo wokół kierunku ruchu.', example: 'pl 90 gora 90 np 50', mode: '3d' },
];

const sections: { title: string; html: string }[] = [
  {
    title: 'Podstawy',
    html: `
      <p>Logomocja to program, który rysuje żółwiem. Żółw startuje w punkcie (0, 0), patrzy w górę ekranu i rysuje, bo pisak jest opuszczony.</p>
      <ul>
        <li>Słowa kluczowe, nazwy procedur i zmiennych nie rozróżniają wielkości liter. <code>NP</code>, <code>np</code> i <code>Np</code> to to samo.</li>
        <li>Białe znaki oddzielają symbole. Nowa linia nie kończy polecenia, za wyjątkiem nagłówka i końca procedury.</li>
        <li>Średnik zaczyna komentarz do końca wiersza: <code>; to jest komentarz</code>.</li>
        <li>Liczby są dodatnie: <code>80</code>, <code>12.5</code>, <code>.5</code>. Znak minus jest operatorem.</li>
        <li>Kierunki w 2D: +X w prawo, +Y w górę ekranu. W 3D dochodzi +Z, w górę.</li>
      </ul>`,
  },
  {
    title: 'Wyrażenia',
    html: `
      <p>Wyrażenie to liczba, nazwa zmiennej lub parametru (także <code>:nazwa</code>), <code>nrpowt</code>, nawias albo działanie.</p>
      <ul>
        <li>Operatory <code>+ - * /</code>. Mnożenie i dzielenie wiążą mocniej niż dodawanie i odejmowanie. Działania tej samej wagi liczymy od lewej.</li>
        <li>Binarny operator ma spację po obu stronach albo przed żadną: <code>np 10 - 5</code> i <code>np 10-5</code> są poprawne, <code>np 10 -5</code> już nie.</li>
        <li>Znaki <code>-</code> i <code>+</code> przed wartością to znaki jednoargumentowe: <code>np -(3 - 5)</code>, <code>np - -2</code>.</li>
        <li>Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem.</li>
        <li>Dzielenie przez zero i wynik niebędący liczbą skończoną to błąd wykonania.</li>
      </ul>`,
  },
  {
    title: 'Zmienne i procedury',
    html: `
      <p>Procedurę definiuje się słowem <code>oto</code>, parametry podaje się po <code>ma:</code>, a ciało kończy słowo <code>już</code> w osobnym wierszu.</p>
      <pre><code>oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90</code></pre>
      <ul>
        <li>Wywołanie podaje tyle argumentów, ile procedura ma parametrów, oddzielonych spacją. Każdy argument jest wyrażeniem: <code>kwadrat 40 * 2 90</code>.</li>
        <li>Definicje są tylko na poziomie głównym. Mogą stać przed wywołaniem albo po nim. Procedura może wywoływać siebie.</li>
        <li><code>niech</code> na poziomie głównym tworzy zmienną globalną. W procedurze tworzy zmienną lokalną, która przesłania globalną do końca wywołania.</li>
        <li>Nazwę można użyć tylko wtedy, gdy jest parametrem, przypisano ją przez <code>niech</code> w tej procedurze albo na poziomie głównym.</li>
      </ul>`,
  },
  {
    title: 'Powtórz i warunki',
    html: `
      <p><code>powtorz n [ ... ]</code> wykonuje blok <code>n</code> razy; <code>n</code> to liczba całkowita od 0 do 10000. Wewnątrz bloku <code>nrpowt</code> to numer obiegu, zaczynając od 1. Poza powtórz <code>nrpowt</code> jest błędem.</p>
      <p><code>jeśli warunek [ ... ]</code> i <code>jeżeli warunek [ ... ] [ ... ]</code> działają jak w większości języków. Wewnątrz procedury <code>stop</code> kończy procedurę, nie tylko blok.</p>`,
  },
  {
    title: 'Limity',
    html: `
      <ul>
        <li>50 000 znaków programu i 10 000 symboli.</li>
        <li>Zagnieżdżenie nawiasów [ ] do 32 poziomów.</li>
        <li>Do 32 aktywnych wywołań procedur i powtórzeń naraz; bloki warunkowe się nie liczą.</li>
        <li>10 000 wykonanych operacji. Każde polecenie, przypisanie, warunek, powtórzenie i wywołanie liczy się jako jedna operacja, a koniec obiegu, bloku lub wywołania dodaje jeszcze jedną.</li>
        <li>10 000 odcinków na rysunku oraz współrzędne w zakresie ±100 000.</li>
      </ul>
      <p>Błąd składni nie rysuje niczego. Błąd wykonania zostawia rysunek narysowany przed błędem.</p>`,
  },
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function referenceHtml(): string {
  const rows = COMMANDS.map((c) => {
    const link = `#/?tryb=${c.mode}&kod=${encodeSource(c.example)}`;
    return `
      <article class="cmd" id="${esc(c.names.split(',')[0].trim())}">
        <h3><code>${esc(c.names.split(',')[0].trim())}</code>${c.mode === '3d' ? ' <span class="badge">tylko 3D</span>' : ''}</h3>
        <p class="aliases">Aliasy: ${esc(c.names)}</p>
        <p><strong>Argument:</strong> ${esc(c.argument)}</p>
        <p>${esc(c.text)}</p>
        <pre><code>${esc(c.example)}</code></pre>
        <a class="try" href="${link}">Wypróbuj w edytorze</a>
      </article>`;
  }).join('');
  const examples = EXAMPLES.map((e) => {
    const link = `#/?tryb=${e.mode}&kod=${encodeSource(e.source)}`;
    return `<li><a href="${link}">${esc(e.title)}</a> <span class="muted">(${e.mode === '2d' ? '2D' : '3D'}, ${esc(e.name)})</span></li>`;
  }).join('');
  return `
    <article class="reference">
      <h1>Pomoc i język Logo</h1>
      ${sections.map((s) => `<section aria-labelledby="s-${esc(s.title)}"><h2 id="s-${esc(s.title)}">${esc(s.title)}</h2>${s.html}</section>`).join('')}
      <section aria-labelledby="s-polecenia">
        <h2 id="s-polecenia">Polecenia</h2>
        <p>Każde polecenie ma polskie i angielskie nazwy. Obie są równoważne.</p>
        ${rows}
      </section>
      <section aria-labelledby="s-przyklady">
        <h2 id="s-przyklady">Programy przykładowe</h2>
        <ul class="examples">${examples}</ul>
      </section>
    </article>`;
}

export function mountReference(root: HTMLElement) {
  root.innerHTML = referenceHtml();
}
