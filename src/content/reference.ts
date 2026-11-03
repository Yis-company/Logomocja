// Polish command reference. Each example has a "Wypróbuj" button that opens it in the Studio.
import type { Mode } from '../lang/parser';

export interface RefCommand {
  names: string;
  english: string;
  arg: string;
  text: string;
  example: string;
  mode: Mode;
}

export const COMMANDS: RefCommand[] = [
  { names: 'np, naprzod, naprzód', english: 'fd, forward', arg: 'wyrażenie', text: 'Przesuwa żółwia naprzód o podaną odległość. Jeśli pisak jest opuszczony, rysuje odcinek.', example: 'np 100', mode: '2d' },
  { names: 'ws, wstecz', english: 'bk, back', arg: 'wyrażenie', text: 'Przesuwa żółwia do tyłu, nie zmieniając kierunku.', example: 'np 80\nws 40', mode: '2d' },
  { names: 'pw, prawo', english: 'rt, right', arg: 'wyrażenie (stopnie)', text: 'Obraca żółwia w prawo — zgodnie z ruchem wskazówek zegara, patrząc z góry.', example: 'np 60\npw 90\nnp 60', mode: '2d' },
  { names: 'lw, lewo', english: 'lt, left', arg: 'wyrażenie (stopnie)', text: 'Obraca żółwia w lewo. Ujemny kąt obraca w drugą stronę.', example: 'np 60\nlw 45\nnp 60', mode: '2d' },
  { names: 'pod, podnies, podnieś', english: 'pu, penup', arg: 'brak', text: 'Podnosi pisak: żółw chodzi, ale nie rysuje.', example: 'np 30\npod np 30 opu\nnp 30', mode: '2d' },
  { names: 'opu, opusc, opuść', english: 'pd, pendown', arg: 'brak', text: 'Opuszcza pisak: kolejne ruchy znów rysują.', example: 'pod np 40 opu\nnp 40', mode: '2d' },
  { names: 'kolor', english: 'color', arg: 'kolor w cudzysłowie', text: 'Ustawia kolor pisaka. Kolor zapisuje się jako # i sześć cyfr szesnastkowych.', example: 'kolor "#c1763d"\nnp 100', mode: '2d' },
  { names: 'grubosc, grubość', english: 'width', arg: 'liczba całkowita 1–12', text: 'Ustawia grubość linii.', example: 'grubosc 8\nnp 100', mode: '2d' },
  { names: 'powtorz, powtórz', english: 'repeat', arg: 'liczba całkowita 0–10 000, potem [ blok ]', text: 'Wykonuje blok podaną liczbę razy. Bloki można zagnieżdżać.', example: 'powtorz 6 [np 60 pw 60]', mode: '2d' },
  { names: 'niech', english: 'let', arg: 'nazwa, potem wyrażenie', text: 'Nadaje zmiennej wartość. Kolejne niech z tą samą nazwą zmienia wartość.', example: 'niech bok 20\npowtorz 8 [np bok pw 90 niech bok bok + 10]', mode: '2d' },
  { names: 'jeśli, jesli', english: 'if', arg: 'warunek, potem [ blok ]', text: 'Wykonuje blok tylko wtedy, gdy warunek jest spełniony.', example: 'powtorz 8 [\n  jeśli nrpowt > 4 [kolor "#c1763d"]\n  np 20 pw 45\n]', mode: '2d' },
  { names: 'jeżeli, jezeli', english: 'ifelse', arg: 'warunek, potem [ blok ] [ blok ]', text: 'Wykonuje pierwszy blok, gdy warunek jest spełniony, a drugi w przeciwnym razie.', example: 'powtorz 12 [\n  jeżeli nrpowt < 7 [np 30] [ws 15]\n  pw 30\n]', mode: '2d' },
  { names: 'stop', english: 'stop', arg: 'brak', text: 'Kończy bieżącą procedurę. Poza procedurą kończy cały program.', example: 'np 50\nstop\nnp 50', mode: '2d' },
  { names: 'dom', english: 'home', arg: 'brak', text: 'Wraca do punktu startowego (rysując, jeśli pisak jest opuszczony) i ustawia żółwia jak na początku.', example: 'np 80 pw 90 np 80\ndom', mode: '2d' },
  { names: 'czyść, czysc', english: 'cs, clearscreen', arg: 'brak', text: 'Usuwa wszystkie narysowane dotąd odcinki. Żółw zostaje tam, gdzie był.', example: 'np 100\nczyść\npw 90 np 50', mode: '2d' },
  { names: 'gora, góra', english: 'pitchup', arg: 'wyrażenie (stopnie)', text: 'Unosi nos żółwia w górę. Po gora 90 żółw idzie tam, gdzie wcześniej miał „górę”. Tylko w 3D.', example: 'np 50\ngora 90\nnp 50', mode: '3d' },
  { names: 'dol, dół', english: 'pitchdown', arg: 'wyrażenie (stopnie)', text: 'Opuszcza nos żółwia w dół. Tylko w 3D.', example: 'np 50\ndol 45\nnp 50', mode: '3d' },
  { names: 'pp, przechylprawo', english: 'rr, rollright', arg: 'wyrażenie (stopnie)', text: 'Przechyla żółwia na prawe skrzydło, wokół kierunku ruchu. Kierunek się nie zmienia. Tylko w 3D.', example: 'pp 90\npowtorz 4 [np 60 pw 90]', mode: '3d' },
  { names: 'pl, przechyllewo', english: 'rl, rollleft', arg: 'wyrażenie (stopnie)', text: 'Przechyla żółwia na lewe skrzydło. Tylko w 3D.', example: 'powtorz 6 [\n  powtorz 4 [np 50 pw 90]\n  pl 30\n]', mode: '3d' },
];

export interface RefTopic { id: string; title: string; html: string; examples?: { code: string; mode: Mode }[] }

export const TOPICS: RefTopic[] = [
  {
    id: 'start', title: 'Pierwsze kroki',
    html: `<p>Żółw stoi w punkcie startowym, patrzy w górę kartki i trzyma opuszczony pisak w kolorze <code>"#16866a"</code> o grubości 3. Każde polecenie przesuwa go albo obraca. Napisz program po lewej stronie i naciśnij <strong>Uruchom</strong>.</p>
      <p>Polecenia oddziela się spacjami lub nowymi wierszami. Wielkość liter nie ma znaczenia, a polskie litery są opcjonalne: <code>powtórz</code> i <code>powtorz</code> to to samo. Średnik zaczyna komentarz do końca wiersza.</p>`,
    examples: [{ code: '; mój pierwszy rysunek\nnp 100 pw 90 np 100', mode: '2d' }],
  },
  {
    id: 'wyrazenia', title: 'Wyrażenia',
    html: `<p>Tam, gdzie polecenie oczekuje liczby, można wpisać wyrażenie: liczbę (<code>80</code>, <code>12.5</code>, <code>.5</code>), nazwę zmiennej lub parametru (także w dawnym zapisie <code>:bok</code>), <code>nrpowt</code>, nawias albo działanie <code>+ - * /</code>.</p>
      <ul>
        <li>Mnożenie i dzielenie są silniejsze niż dodawanie i odejmowanie: <code>np 2 + 3 * 4</code> idzie o 14.</li>
        <li>Działania tej samej siły liczy się od lewej: <code>np 20 - 5 - 3</code> idzie o 12.</li>
        <li><strong>Spacje wokół znaku działania</strong> stawiaj po obu stronach albo po żadnej: <code>np 10 - 5</code> i <code>np 10-5</code> idą o 5. Zapis <code>np 10 -5</code> to błąd: to <code>np 10</code> i osobne <code>-5</code>.</li>
        <li>Minus i plus przed wartością można łączyć: <code>np -(3 - 5)</code>, <code>np - -2</code>, <code>np -bok</code>.</li>
        <li>Liczby zapisuje się tylko cyframi i kropką. <code>1e3</code>, <code>0x10</code>, <code>NaN</code> nie są liczbami.</li>
        <li>Dzielenie przez zero i wynik nieskończony to błędy wykonania.</li>
      </ul>`,
    examples: [{ code: 'np 2 + 3 * 4\npw 90\nnp (2 + 3) * 4', mode: '2d' }],
  },
  {
    id: 'zmienne', title: 'Zmienne',
    html: `<p><code>niech x 5</code> nadaje zmiennej <code>x</code> wartość. Nazwa nie może być słowem języka ani nazwą procedury.</p>
      <ul>
        <li><code>niech</code> poza procedurami tworzy zmienną globalną.</li>
        <li><code>niech</code> wewnątrz procedury tworzy zmienną lokalną tego wywołania: zasłania globalną o tej samej nazwie do końca wywołania i znika, gdy wywołanie się skończy. Parametr też można tak zmienić.</li>
        <li>Nazwy można użyć, jeśli jest parametrem bieżącej procedury, jeśli gdzieś w jej treści stoi <code>niech</code> z tą nazwą, albo jeśli <code>niech</code> z tą nazwą stoi gdzieś poza procedurami (przed albo po użyciu). Inna nazwa to błąd od razu, zanim cokolwiek się narysuje.</li>
        <li>Odczyt zmiennej, która jeszcze nie dostała wartości, to błąd wykonania.</li>
      </ul>`,
    examples: [{ code: 'niech bok 10\npowtorz 20 [\n  np bok pw 90\n  niech bok bok + 6\n]', mode: '2d' }],
  },
  {
    id: 'warunki', title: 'Warunki',
    html: `<p>Warunek to dwa wyrażenia i porównanie między nimi: <code>&lt;</code>, <code>&gt;</code>, <code>=</code>, <code>&lt;=</code>, <code>&gt;=</code> albo <code>&lt;&gt;</code> (różne).</p>
      <p><code>jeśli warunek [ … ]</code> wykonuje blok, gdy warunek jest spełniony. <code>jeżeli warunek [ … ] [ … ]</code> wykonuje pierwszy blok albo — w przeciwnym razie — drugi.</p>
      <p>Porównania są dokładne. <code>jeśli 0.1 + 0.2 = 0.3 [ … ]</code> nie wykona bloku, bo komputer liczy ułamki dziesiętne w przybliżeniu.</p>`,
    examples: [{ code: 'niech zmiana 1\npowtorz 16 [\n  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]\n  niech zmiana -zmiana\n  np 60 pw 157.5\n]', mode: '2d' }],
  },
  {
    id: 'powtorz', title: 'Powtórzenia i nrpowt',
    html: `<p><code>powtorz n [ … ]</code> wykonuje blok <code>n</code> razy; <code>n</code> musi być liczbą całkowitą od 0 do 10 000.</p>
      <p>Wewnątrz bloku <code>nrpowt</code> (też <code>repcount</code>) to numer bieżącego powtórzenia najbliższego <code>powtorz</code>, licząc od 1. „Najbliższe” liczy się w tekście programu: <code>nrpowt</code> w procedurze musi stać wewnątrz <code>powtorz</code> zapisanego w tej samej procedurze.</p>`,
    examples: [{ code: 'powtorz 36 [\n  np nrpowt * 4\n  pw 100\n]', mode: '2d' }],
  },
  {
    id: 'procedury', title: 'Procedury',
    html: `<p>Procedura to nazwany fragment programu z parametrami. Definicja zaczyna się słowem <code>oto</code> (też <code>to</code>) na początku wiersza, po nim nazwa i — opcjonalnie — <code>ma:</code> z parametrami po przecinku. Treść zaczyna się w następnym wierszu i kończy słowem <code>już</code> (też <code>juz</code>, <code>end</code>) stojącym samotnie w wierszu.</p>
      <ul>
        <li>Działa też dawny zapis nagłówka: <code>oto kwadrat :bok :kąt</code>.</li>
        <li>Wywołanie podaje dokładnie tyle argumentów, ile parametrów, rozdzielonych spacjami. Każdy argument jest wyrażeniem: <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90.</li>
        <li>Procedury definiuje się tylko na najwyższym poziomie, przed albo po wywołaniach. Każdą nazwę można zdefiniować raz.</li>
        <li>Procedura może wywoływać samą siebie. <code>stop</code> natychmiast kończy bieżące wywołanie — także z wnętrza bloku.</li>
        <li>Parametr może nazywać się tak jak procedura: jako polecenie to wywołanie, jako argument — parametr.</li>
      </ul>`,
    examples: [{ code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90', mode: '2d' }],
  },
  {
    id: 'przestrzen', title: 'Przestrzeń 3D',
    html: `<p>Osie: X w prawo, Y do przodu (w górę kartki), Z w górę, w stronę patrzącego. Płaszczyzna 2D to XY. Żółw ma kierunek ruchu, prawe skrzydło i „górę”.</p>
      <ul>
        <li><code>pw</code>/<code>lw</code> obracają kierunek wokół „góry” żółwia.</li>
        <li><code>gora</code>/<code>dol</code> unoszą i opuszczają nos wokół prawego skrzydła.</li>
        <li><code>pp</code>/<code>pl</code> przechylają żółwia wokół kierunku ruchu.</li>
      </ul>
      <p>Program złożony tylko z poleceń płaskich rysuje dokładnie to samo w 2D i w 3D. W trybie 2D polecenia <code>gora</code>, <code>dol</code>, <code>pp</code> i <code>pl</code> są błędem.</p>`,
    examples: [{ code: 'powtorz 8 [\n  powtorz 36 [np 8 pw 10]\n  pp 22.5\n]', mode: '3d' }],
  },
  {
    id: 'bledy', title: 'Błędy i ograniczenia',
    html: `<p>Każdy błąd ma numer wiersza i kolumny oraz opis po polsku. Zaznaczenie w edytorze pokazuje dokładne miejsce.</p>
      <ul>
        <li><strong>Błąd w zapisie</strong> (nieznane polecenie, brak argumentu, zły kolor, brak nawiasu lub <code>już</code>, nieznana nazwa, zła grubość lub liczba powtórzeń wpisana wprost) wykrywany jest przed rysowaniem — wtedy nic się nie rysuje.</li>
        <li><strong>Błąd wykonania</strong> (dzielenie przez zero, zmienna bez wartości, zła grubość lub liczba powtórzeń obliczona ze zmiennej, przekroczony limit) zatrzymuje program, a to, co już narysowano, zostaje.</li>
        <li>Zły argument jest zgłaszany przy jego pierwszym elemencie, a nie przy poleceniu.</li>
      </ul>
      <table class="limits">
        <caption>Ograniczenia</caption>
        <tbody>
          <tr><th scope="row">Długość programu</th><td>50 000 znaków</td></tr>
          <tr><th scope="row">Elementy programu</th><td>10 000 (także operatory, nawiasy i przecinki)</td></tr>
          <tr><th scope="row">Zagnieżdżenie nawiasów</th><td>32 poziomy</td></tr>
          <tr><th scope="row">Aktywne wywołania i powtórzenia</th><td>32 naraz (bloki warunków się nie liczą)</td></tr>
          <tr><th scope="row">Wykonane operacje</th><td>10 000 — każde polecenie, <code>niech</code>, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdego obrotu pętli, bloku warunku i wywołania</td></tr>
          <tr><th scope="row">Narysowane odcinki</th><td>10 000 (po <code>czyść</code> liczą się od nowa)</td></tr>
          <tr><th scope="row">Współrzędne</th><td>od −100 000 do 100 000</td></tr>
        </tbody>
      </table>`,
  },
];
