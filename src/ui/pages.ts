import { EXAMPLES } from '../logo/examples';
import { CHALLENGES } from '../logo/challenges';
import { COMMAND_REFERENCE, VALUE_REFERENCE } from '../logo/reference';
import { progressOf } from './progress';
import { encodeProgram, escapeHtml } from './util';

const modeName = (m: string) => (m === '3d' ? '3D' : '2D');

export function examplesPage(): string {
  const cards = EXAMPLES.map(
    (ex) => `
    <article class="card" id="ex-${ex.name}">
      <header>
        <h2>${escapeHtml(ex.name)}</h2>
        <span class="badge">${modeName(ex.mode)}</span>
      </header>
      <p>${escapeHtml(ex.description)}</p>
      <details>
        <summary>Pokaż program</summary>
        <pre><code>${escapeHtml(ex.source)}</code></pre>
      </details>
      <p class="actions">
        <a class="btn primary" href="#/?ex=${encodeURIComponent(ex.name)}">Otwórz w studiu</a>
      </p>
    </article>`,
  ).join('');
  return `
    <h1>Przykłady</h1>
    <p class="lead">Trzynaście standardowych programów. Każdy można wczytać do studia, uruchomić i zmienić.
    Wczytanie przykładu nie kasuje Twojego szkicu: poprzedni tekst zostaje do przywrócenia przyciskiem „Cofnij wczytanie”.</p>
    <div class="cards">${cards}</div>`;
}

export function challengesPage(): string {
  const done = new Set(progressOf());
  const rows = CHALLENGES.map(
    (c) => `
    <li class="card row">
      <div>
        <h2>${escapeHtml(c.title)}</h2>
        <p>${escapeHtml(c.task)}</p>
        <p class="meta">${modeName(c.mode)}</p>
      </div>
      <div class="row-end">
        <span class="badge ${done.has(c.id) ? 'ok' : ''}">${done.has(c.id) ? 'zaliczone' : 'do zrobienia'}</span>
        <a class="btn primary" href="#/wyzwanie/${encodeURIComponent(c.id)}">Ćwicz</a>
      </div>
    </li>`,
  ).join('');
  return `
    <h1>Wyzwania</h1>
    <p class="lead">Napisz program, który narysuje wskazany obraz. Sprawdzamy rysunek, a nie tekst programu.
    Zaliczono ${CHALLENGES.filter((c) => done.has(c.id)).length} z ${CHALLENGES.length}. Postęp zapisuje się w tej przeglądarce.</p>
    <ul class="challenge-list">${rows}</ul>`;
}

function permalink(example: string, mode: string): string {
  return `#/?m=${mode}&p=${encodeProgram(example)}`;
}

function commandsTable(): string {
  return COMMAND_REFERENCE.map(
    (e) => `
    <article class="card" id="cmd-${e.names[0].normalize('NFC').toLowerCase()}">
      <header>
        <h3><code>${e.names.map(escapeHtml).join('</code>, <code>')}</code></h3>
        <span class="badge">${modeName(e.mode)}</span>
      </header>
      <p><strong>Argument:</strong> ${escapeHtml(e.arg)}</p>
      <p>${escapeHtml(e.text)}</p>
      <pre><code>${escapeHtml(e.example)}</code></pre>
      <p class="actions"><a class="btn" href="${permalink(e.example, e.mode)}">Wypróbuj</a></p>
    </article>`,
  ).join('');
}

export function referencePage(): string {
  return `
    <h1>Pomoc i opis języka</h1>
    <nav class="toc" aria-label="Spis treści">
      <a href="#/pomoc#wprowadzenie">Wprowadzenie</a>
      <a href="#/pomoc#skladnia">Składnia</a>
      <a href="#/pomoc#polecenia">Polecenia</a>
      <a href="#/pomoc#wyrazenia">Wyrażenia</a>
      <a href="#/pomoc#zmienne">Zmienne i warunki</a>
      <a href="#/pomoc#powtorzenia">Powtórzenia</a>
      <a href="#/pomoc#procedury">Procedury</a>
      <a href="#/pomoc#ograniczenia">Ograniczenia i błędy</a>
      <a href="#/pomoc#skroty">Skróty klawiszowe</a>
    </nav>

    <section id="wprowadzenie">
      <h2>Wprowadzenie</h2>
      <p>Żółw startuje w punkcie (0, 0) i patrzy w górę (kierunek +Y). Ma pióro, kolor i grubość linii.
      Polecenia przesuwają go i obracają; gdy pióro jest opuszczone, zostawia ślad.
      W trybie 2D rysujemy na płaszczyźnie XY. W trybie 3D dochodzi oś Z (w górę), a żółw może się przechylać.</p>
      <p>Program pisz w edytorze i naciśnij Ctrl+Enter. Krok po kroku prześledzisz każde polecenie przyciskiem Krok (F10).</p>
    </section>

    <section id="skladnia">
      <h2>Składnia</h2>
      <ul>
        <li>Słowa kluczowe, nazwy procedur, zmiennych i parametrów nie rozróżniają wielkości liter. Polskie znaki działają, ale ich brak też jest dozwolony: <code>naprzód</code> to <code>naprzod</code>.</li>
        <li>Tokeny oddziela spacja. Nowy wiersz ma znaczenie tylko dla procedur (nagłówek i <code>już</code>).</li>
        <li>Średnik zaczyna komentarz do końca wiersza: <code>; to jest komentarz</code>.</li>
        <li>Liczby to proste zapisy dziesiętne: <code>80</code>, <code>12.5</code>, <code>.5</code>. Znak minus to operator, a <code>1e3</code>, <code>0x10</code>, <code>NaN</code> są błędem.</li>
        <li>Kolor zapisujemy w cudzysłowie, jako sześć cyfr szesnastkowych: <code>"#16866a"</code>.</li>
        <li>Nawiasy kwadratowe <code>[ ]</code> ograniczają treść powtórzeń i warunków (mogą być zagnieżdżone). Okrągłe <code>( )</code> grupują wyrażenia.</li>
      </ul>
    </section>

    <section id="polecenia">
      <h2>Polecenia</h2>
      <p>Każde polecenie ma polskie i angielskie nazwy, które działają tak samo. Przy każdym jest przykład, który można od razu wypróbować.</p>
      <div class="cards">${commandsTable()}</div>
    </section>

    <section id="wyrazenia">
      <h2>Wyrażenia</h2>
      <p>Argumentem może być liczba, nazwa (parametr lub zmienna, także zapis <code>:nazwa</code>), <code>nrpowt</code>, wyrażenie w nawiasach, znak <code>-</code> lub <code>+</code> przed nimi, albo dwa wyrażenia połączone <code>+ - * /</code>.</p>
      <ul>
        <li><code>*</code> i <code>/</code> wiążą mocniej niż <code>+</code> i <code>-</code>; równe priorytety łączą się od lewej: <code>np 20 - 5 - 3</code> przesuwa o 12, a <code>np 2 + 3 * 4</code> o 14.</li>
        <li>Dwuargumentowy operator musi mieć spację po obu stronach albo po żadnej: <code>10 - 5</code> i <code>10-5</code> są poprawne, a <code>10 -5</code> nie.</li>
        <li>Dzielenie przez zero i wynik niebędący liczbą skończoną to błędy wykonania.</li>
      </ul>
      <pre><code>niech a 40
np a * 2 - 10
pw a / 2
np -a</code></pre>
    </section>

    <section id="zmienne">
      <h2>Zmienne i warunki</h2>
      <p><code>niech nazwa wyrażenie</code> przypisuje wartość. Na poziomie programu zmienna jest globalna. W procedurze tworzy zmienną lokalną, która przesłania globalną do końca wywołania.</p>
      <p>Warunek to <code>wyrażenie porównanie wyrażenie</code>, gdzie porównanie to <code>=  &lt;  &gt;  &lt;=  &gt;=  &lt;&gt;</code>. Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem.</p>
      <p><code>jeśli warunek [ ... ]</code> wykonuje treść, gdy warunek jest prawdziwy. <code>jeżeli warunek [ ... ] [ ... ]</code> wybiera jedną z dwóch treści.</p>
      <p>Każda nazwa musi być parametrem procedury albo zmienną przypisaną poleceniem <code>niech</code> (w procedurze lub na poziomie programu). Inaczej to błąd, który widać przed uruchomieniem.</p>
    </section>

    <section id="powtorzenia">
      <h2>Powtórzenia</h2>
      <p><code>powtórz n [ ... ]</code> wykonuje treść <code>n</code> razy; <code>n</code> to liczba całkowita od 0 do 10000.
      Wewnątrz powtórzenia <code>${Object.keys(VALUE_REFERENCE)[0]}</code> ma wartość ${VALUE_REFERENCE.nrpowt}.</p>
      <p>Użycie <code>nrpowt</code> poza powtórzeniem, także w procedurze wywoływanej z powtórzenia, jest błędem.</p>
    </section>

    <section id="procedury">
      <h2>Procedury</h2>
      <pre><code>oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 80 90</code></pre>
      <p><code>oto nazwa ma: parametry</code> zaczyna definicję w nowym wierszu, a <code>już</code> stoi sam w swoim wierszu i ją kończy.
      Starsza forma <code>oto kwadrat :bok :kąt</code> też działa. Argumenty wywołania to wyrażenia oddzielone spacjami, w liczbie równej liczbie parametrów.
      Procedury mogą wywoływać siebie. <code>stop</code> kończy bieżącą procedurę (na poziomie programu — cały program).
      Definicje są tylko na poziomie programu, mogą być przed albo po wywołaniu. Nie ma wartości zwracanych.</p>
    </section>

    <section id="3d">
      <h2>Tryb 3D</h2>
      <p><code>gora</code> i <code>dol</code> zmieniają nachylenie nosa, <code>pp</code> i <code>pl</code> przechylają żółwia wokół kierunku ruchu. Te cztery polecenia działają tylko w trybie 3D.
      Program złożony z poleceń płaskich rysuje dokładnie to samo w obu trybach.</p>
    </section>

    <section id="ograniczenia">
      <h2>Ograniczenia i błędy</h2>
      <ul>
        <li>Program: do 50 000 znaków i 10 000 elementów składni.</li>
        <li>Zagnieżdżenie nawiasów [ ]: do 32 poziomów. Aktywnych wywołań procedur i powtórzeń naraz: do 32.</li>
        <li>Wykonanych operacji (każde polecenie, <code>niech</code>, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdej iteracji, treści warunku i wywołania): do 10 000.</li>
        <li>Narysowanych odcinków: do 10 000 (<code>cs</code> zwalnia miejsce). Współrzędne: w zakresie ±100 000.</li>
        <li>Błąd składni wykrywany przed uruchomieniem nie rysuje nic. Błąd wykonania zatrzymuje program, ale zostawia to, co już narysowano.</li>
        <li>Każdy błąd pokazuje wiersz i kolumnę w edytorze oraz opis po polsku.</li>
      </ul>
    </section>

    <section id="skroty">
      <h2>Skróty klawiszowe</h2>
      <table class="shortcuts-table">
        <thead><tr><th scope="col">Klawisz</th><th scope="col">Działanie</th></tr></thead>
        <tbody>
          <tr><td><kbd>Ctrl</kbd>+<kbd>Enter</kbd></td><td>Uruchom program</td></tr>
          <tr><td><kbd>F10</kbd></td><td>Krok: wykonaj jedno polecenie</td></tr>
          <tr><td><kbd>F9</kbd></td><td>Pauza lub wznowienie</td></tr>
          <tr><td><kbd>Esc</kbd></td><td>Reset: zatrzymaj i wyczyść rysunek</td></tr>
          <tr><td><kbd>+</kbd>, <kbd>−</kbd>, strzałki</td><td>Przybliż, oddal, przesuń widok 2D (gdy widok ma fokus)</td></tr>
        </tbody>
      </table>
    </section>`;
}
