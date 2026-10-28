import type { Mode } from '../lang/ast';

export interface CommandDoc {
  names: string[];
  english: string[];
  arg: string;
  text: string;
  example: string;
  mode?: Mode;
}

export interface DocSection {
  id: string;
  title: string;
  intro?: string;
  commands?: CommandDoc[];
  /** Dowolne bloki: akapit HTML lub przykład kodu. */
  blocks?: ({ html: string } | { code: string; mode?: Mode; note?: string })[];
}

export const REFERENCE: DocSection[] = [
  {
    id: 'start',
    title: 'Na początek',
    blocks: [
      {
        html: `<p>Logomocja to język do rysowania żółwiem. Żółw stoi w początku układu, patrzy w górę ekranu i trzyma opuszczone pióro. Każde polecenie przesuwa go albo obraca, a tam, gdzie przejdzie z opuszczonym piórem, zostaje linia.</p>
<p>Program to po prostu ciąg poleceń oddzielonych spacjami lub nowymi wierszami. Wielkość liter nie ma znaczenia (<code>NP</code> to to samo co <code>np</code>), a każde polecenie ma polską i angielską nazwę. Polskie nazwy z ogonkami działają tak samo jak bez nich: <code>powtórz</code> i <code>powtorz</code>.</p>`,
      },
      { code: '; Pierwszy rysunek: kwadrat\npowtorz 4 [np 100 pw 90]' },
      {
        html: `<p>Studio ma dwa tryby: <strong>2D</strong> (rysunek na płaszczyźnie) i <strong>3D</strong> (rysunek w przestrzeni, z kamerą, którą można obracać). Program złożony tylko z płaskich poleceń rysuje to samo w obu trybach.</p>`,
      },
    ],
  },
  {
    id: 'zapis',
    title: 'Zasady zapisu',
    blocks: [
      {
        html: `<ul>
<li><strong>Odstępy</strong> — spacje i nowe wiersze rozdzielają elementy programu. Nowy wiersz ma znaczenie tylko w definicji procedury (nagłówek <code>oto</code> i końcowe <code>już</code>).</li>
<li><strong>Komentarz</strong> zaczyna się średnikiem <code>;</code> i trwa do końca wiersza.</li>
<li><strong>Liczby</strong> zapisuje się cyframi, z kropką dziesiętną: <code>80</code>, <code>12.5</code>, <code>.5</code>. Znak minus to działanie, nie część liczby. Zapisy takie jak <code>1e3</code>, <code>0x10</code>, <code>NaN</code> czy <code>Infinity</code> są błędem.</li>
<li><strong>Nawiasy kwadratowe</strong> <code>[ ]</code> otaczają treść powtórzeń i warunków, mogą się zagnieżdżać. <strong>Nawiasy okrągłe</strong> <code>( )</code> grupują działania.</li>
<li><strong>Kolor</strong> zapisuje się w cudzysłowie jako <code>"#</code> i sześć cyfr szesnastkowych: <code>"#16866a"</code>. Wielkość liter cyfr nie ma znaczenia.</li>
<li><strong>Działania</strong>: <code>+ - * /</code>, <strong>porównania</strong>: <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code> (to ostatnie znaczy „różne”).</li>
<li><strong>Nazwy</strong> procedur, zmiennych i parametrów składają się z liter (także polskich), cyfr i podkreśleń i nie mogą zaczynać się cyfrą. Wielkość liter nie ma znaczenia, ale ogonki tak: <code>kąt</code> i <code>kat</code> to dwie różne nazwy.</li>
</ul>`,
      },
    ],
  },
  {
    id: 'ruch',
    title: 'Ruch i obroty',
    intro: 'Argumentem każdego z tych poleceń jest wyrażenie: liczba, nazwa albo działanie.',
    commands: [
      {
        names: ['np', 'naprzod', 'naprzód'],
        english: ['fd', 'forward'],
        arg: 'odległość',
        text: 'Przesuwa żółwia naprzód o podaną odległość. Z opuszczonym piórem rysuje odcinek. Ruch o 0 niczego nie rysuje.',
        example: 'np 100',
      },
      {
        names: ['ws', 'wstecz'],
        english: ['bk', 'back'],
        arg: 'odległość',
        text: 'Cofa żółwia o podaną odległość, bez obracania go.',
        example: 'np 100\nws 50\npw 90\nnp 50',
      },
      {
        names: ['pw', 'prawo'],
        english: ['rt', 'right'],
        arg: 'kąt w stopniach',
        text: 'Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry). Kąt ujemny obraca w lewo.',
        example: 'np 60\npw 90\nnp 60\npw 135\nnp 85',
      },
      {
        names: ['lw', 'lewo'],
        english: ['lt', 'left'],
        arg: 'kąt w stopniach',
        text: 'Obraca żółwia w lewo.',
        example: 'powtorz 6 [np 50 lw 60]',
      },
      {
        names: ['dom'],
        english: ['home'],
        arg: '—',
        text: 'Wraca do początku układu (rysując linię, jeśli pióro jest opuszczone i żółw nie stoi już w początku) i ustawia żółwia w pozycji startowej: przodem w górę ekranu. Nie zmienia pióra, koloru ani grubości.',
        example: 'np 80\npw 90\nnp 80\ndom',
      },
    ],
  },
  {
    id: 'pioro',
    title: 'Pióro i rysunek',
    intro: 'Na starcie pióro jest opuszczone, kolor to "#16866a", a grubość 3. Ustawienia obowiązują, dopóki ich nie zmienisz.',
    commands: [
      {
        names: ['pod', 'podnies', 'podnieś'],
        english: ['pu', 'penup'],
        arg: '—',
        text: 'Podnosi pióro: żółw porusza się bez rysowania.',
        example: 'np 40\npod\nnp 30\nopu\nnp 40',
      },
      {
        names: ['opu', 'opusc', 'opuść'],
        english: ['pd', 'pendown'],
        arg: '—',
        text: 'Opuszcza pióro: od teraz ruch zostawia linię.',
        example: 'powtorz 6 [opu np 15 pod np 10]',
      },
      {
        names: ['kolor'],
        english: ['color'],
        arg: '"#rrggbb"',
        text: 'Ustawia kolor pióra. Kolor podaje się zawsze w cudzysłowie jako sześć cyfr szesnastkowych.',
        example: 'kolor "#c1763d"\nnp 80\nkolor "#2b6fb3"\npw 90\nnp 80',
      },
      {
        names: ['grubosc', 'grubość'],
        english: ['width'],
        arg: 'liczba całkowita 1–12',
        text: 'Ustawia grubość linii. Wartość musi być liczbą całkowitą od 1 do 12.',
        example: 'powtorz 6 [grubosc nrpowt * 2 np 30 pw 60]',
      },
      {
        names: ['czyść', 'czysc'],
        english: ['cs', 'clearscreen'],
        arg: '—',
        text: 'Wymazuje wszystko, co narysowano do tej pory. Nie zmienia położenia żółwia ani ustawień pióra.',
        example: 'np 100\nczyść\npw 90\nnp 50',
      },
    ],
  },
  {
    id: 'przestrzen',
    title: 'Ruch w przestrzeni (tylko 3D)',
    intro:
      'Układ współrzędnych jest prawoskrętny: oś x biegnie w prawo, y naprzód (w górę kartki), a z w górę, nad kartkę. Żółw ma kierunek (dokąd patrzy), prawy bok i grzbiet. Te polecenia działają tylko w trybie 3D — w trybie 2D są błędem.',
    commands: [
      {
        names: ['gora', 'góra'],
        english: ['pitchup'],
        arg: 'kąt w stopniach',
        text: 'Unosi nos żółwia o podany kąt (obrót wokół prawego boku). Po „góra 90” żółw patrzy tam, gdzie wcześniej miał grzbiet.',
        example: 'np 50\ngora 90\nnp 50\ndol 90\nnp 50',
        mode: '3d',
      },
      {
        names: ['dol', 'dół'],
        english: ['pitchdown'],
        arg: 'kąt w stopniach',
        text: 'Opuszcza nos żółwia — obrót w przeciwną stronę niż „góra”.',
        example: 'powtorz 4 [np 60 dol 90]',
        mode: '3d',
      },
      {
        names: ['pp', 'przechylprawo'],
        english: ['rr', 'rollright'],
        arg: 'kąt w stopniach',
        text: 'Przechyla żółwia na prawy bok, wokół kierunku ruchu. Kierunek się nie zmienia. Po „pp 90” grzbiet wskazuje dawne prawo, a prawy bok — dawny dół.',
        example: 'powtorz 4 [\n  powtorz 4 [np 60 pw 90]\n  pp 45\n]',
        mode: '3d',
      },
      {
        names: ['pl', 'przechyllewo'],
        english: ['rl', 'rollleft'],
        arg: 'kąt w stopniach',
        text: 'Przechyla żółwia na lewy bok.',
        example: 'pl 90\npowtorz 36 [np 10 pw 10]',
        mode: '3d',
      },
    ],
  },
  {
    id: 'powtorz',
    title: 'Powtarzanie',
    commands: [
      {
        names: ['powtorz', 'powtórz'],
        english: ['repeat'],
        arg: 'liczba całkowita 0–10 000, potem [ treść ]',
        text: 'Wykonuje polecenia w nawiasach podaną liczbę razy (0 — ani razu). W środku może być wszystko: inne powtórzenia, warunki, wywołania procedur.',
        example: 'powtorz 8 [\n  powtorz 4 [np 60 pw 90]\n  pw 45\n]',
      },
    ],
    blocks: [
      {
        html: `<h3 id="nrpowt"><code>nrpowt</code> <span class="alias">repcount</span></h3>
<p><code>nrpowt</code> to wartość, nie polecenie: numer bieżącego obrotu najbliższego <code>powtórz</code>, licząc od 1. „Najbliższego” w sensie zapisu programu — <code>nrpowt</code> musi stać wewnątrz nawiasów jakiegoś <code>powtórz</code>. Użyty w procedurze, musi stać wewnątrz <code>powtórz</code> tej samej procedury, nawet jeśli procedurę wywołuje się z wnętrza powtórzenia. Poza powtórzeniem jest błędem.</p>`,
      },
      { code: 'powtorz 36 [\n  np nrpowt * 4\n  pw 90\n]' },
    ],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    blocks: [
      {
        html: `<p>Wszędzie, gdzie polecenie przyjmuje liczbę, można wpisać <strong>wyrażenie</strong>: liczbę, nazwę (parametr lub zmienną, także w starym zapisie <code>:nazwa</code>), <code>nrpowt</code>, wyrażenie w nawiasach, znak <code>-</code> lub <code>+</code> przed którymkolwiek z nich albo dwa wyrażenia połączone działaniem <code>+ - * /</code>.</p>
<ul>
<li>Mnożenie i dzielenie wiążą mocniej niż dodawanie i odejmowanie: <code>np 2 + 3 * 4</code> to krok o 14.</li>
<li>Działania o tym samym priorytecie liczy się od lewej: <code>np 20 - 5 - 3</code> to krok o 12.</li>
<li>Znaki można łączyć: <code>np -(3 - 5)</code>, <code>np - -2</code>, <code>np -bok</code>.</li>
<li><strong>Spacje wokół działań</strong>: operator <code>+ - * /</code> musi mieć spację z obu stron albo z żadnej. <code>np 10 - 5</code> i <code>np 10-5</code> to krok o 5. Ale <code>np 10 -5</code> to krok o 10 i osobny, zbłąkany element <code>-5</code> — czyli błąd. Ta reguła nie dotyczy porównań.</li>
<li>Dzielenie przez zero i wynik, który nie jest skończoną liczbą, to błędy wykonania.</li>
</ul>`,
      },
      { code: 'np 2 + 3 * 4\npw 90\nnp (2 + 3) * 4\npw 90\nnp 100 / 4 - 5' },
      {
        html: `<p><strong>Warunek</strong> to dwa wyrażenia połączone porównaniem: <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code>. Porównania są dokładne — <code>0.1 + 0.2 = 0.3</code> nie jest prawdą, bo komputer liczy ułamki dziesiętne z drobnym błędem.</p>`,
      },
    ],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    commands: [
      {
        names: ['niech'],
        english: ['let'],
        arg: 'nazwa, potem wyrażenie',
        text: 'Nadaje zmiennej wartość wyrażenia. Kolejne „niech” z tą samą nazwą zmienia wartość. Nazwa zmiennej nie może być poleceniem ani nazwą procedury.',
        example: 'niech bok 10\npowtorz 12 [\n  np bok\n  pw 90\n  niech bok bok + 10\n]',
      },
    ],
    blocks: [
      {
        html: `<ul>
<li><code>niech</code> na najwyższym poziomie programu tworzy lub zmienia zmienną <strong>globalną</strong>.</li>
<li><code>niech</code> w procedurze tworzy lub zmienia zmienną <strong>lokalną</strong> dla danego wywołania. Od tej chwili do końca wywołania przesłania ona zmienną globalną o tej samej nazwie, a po zakończeniu wywołania znika. Tak samo można zmienić wartość parametru.</li>
<li>Nazwy można użyć w wyrażeniu tylko wtedy, gdy jest parametrem bieżącej procedury, gdy gdzieś w tej procedurze nadaje się jej wartość przez <code>niech</code> albo gdy nadaje się jej wartość przez <code>niech</code> gdzieś na najwyższym poziomie programu (przed użyciem lub po nim). Każda inna nazwa to błąd, zgłaszany przed uruchomieniem.</li>
<li>Odczyt zmiennej, która na tej ścieżce wykonania nie dostała jeszcze wartości, to błąd wykonania.</li>
</ul>`,
      },
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    commands: [
      {
        names: ['jeśli', 'jesli'],
        english: ['if'],
        arg: 'warunek, potem [ treść ]',
        text: 'Wykonuje treść, gdy warunek jest spełniony.',
        example: 'powtorz 12 [\n  jeśli nrpowt > 6 [kolor "#c1763d"]\n  np 40\n  pw 30\n]',
      },
      {
        names: ['jeżeli', 'jezeli'],
        english: ['ifelse'],
        arg: 'warunek, potem [ tak ] [ nie ]',
        text: 'Wykonuje pierwszą treść, gdy warunek jest spełniony, a w przeciwnym razie drugą.',
        example: 'powtorz 8 [\n  jeżeli nrpowt < 5 [kolor "#16866a"] [kolor "#2b6fb3"]\n  np 50\n  pw 45\n]',
      },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    blocks: [
      {
        html: `<p>Procedura to nowe polecenie zbudowane z innych. Definicja zaczyna się słowem <code>oto</code> (lub <code>to</code>) <strong>na początku wiersza</strong>, po nim w tym samym wierszu nazwa i — opcjonalnie — <code>ma:</code> z listą parametrów oddzielonych przecinkami. Treść zaczyna się w następnym wierszu i kończy słowem <code>już</code> (lub <code>juz</code>, <code>end</code>) stojącym <strong>samotnie w osobnym wierszu</strong>.</p>`,
      },
      { code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90' },
      {
        html: `<ul>
<li>Działa też stary zapis nagłówka: <code>oto kwadrat :bok :kąt</code>, a parametru można używać jako <code>:bok</code> albo po prostu <code>bok</code>.</li>
<li>Wywołanie podaje tyle argumentów, ile procedura ma parametrów, oddzielonych odstępami. Każdy argument to wyrażenie, więc <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90.</li>
<li>Parametr może nazywać się tak samo jak procedura: na miejscu polecenia ta nazwa oznacza wywołanie, a na miejscu argumentu — parametr.</li>
<li>Definicje stoją tylko na najwyższym poziomie (nigdy w nawiasach ani w innej procedurze), mogą być przed wywołaniami lub po nich. Każdą nazwę można zdefiniować tylko raz.</li>
<li>Procedura może wywoływać samą siebie (rekurencja). Polecenie <code>stop</code> kończy bieżące wywołanie — także z wnętrza <code>powtórz</code> czy warunku. Na najwyższym poziomie <code>stop</code> kończy program.</li>
<li>Procedury nie zwracają wartości.</li>
</ul>`,
      },
      {
        code: 'oto gałąź ma: dł\n  jeśli dł < 8 [stop]\n  np dł\n  lw 30 gałąź dł * 0.65\n  pw 60 gałąź dł * 0.65\n  lw 30\n  pod ws dł opu\njuż\n\ngałąź 80',
      },
    ],
    commands: [
      {
        names: ['stop'],
        english: ['stop'],
        arg: '—',
        text: 'Kończy bieżące wywołanie procedury; na najwyższym poziomie kończy cały program.',
        example: 'powtorz 100 [\n  np nrpowt * 3\n  pw 70\n  jeśli nrpowt = 20 [stop]\n]',
      },
    ],
  },
  {
    id: 'bledy',
    title: 'Błędy',
    blocks: [
      {
        html: `<p>Każdy błąd ma polski opis oraz numer wiersza i kolumny. W edytorze błędne miejsce jest podkreślone, a pod nim pojawia się dymek z opisem.</p>
<ul>
<li><strong>Błędy zapisu</strong> wykrywa się, zanim cokolwiek zostanie narysowane: nieznane polecenie, brak lub zły argument, zły kolor, niezamknięty nawias, zła liczba argumentów procedury, definicja wewnątrz bloku, brak <code>już</code>, nieznana nazwa, <code>nrpowt</code> poza powtórzeniem, polecenie 3D w trybie 2D. Stała grubość lub liczba powtórzeń spoza zakresu też jest wykrywana od razu.</li>
<li><strong>Błędy wykonania</strong> wychodzą dopiero w trakcie: dzielenie przez zero, zmienna bez wartości, grubość lub liczba powtórzeń wyliczona ze zmiennych i niepoprawna, przekroczenie limitu. Program zatrzymuje się, a to, co już narysował, zostaje na ekranie.</li>
<li>Zły argument (np. dzielenie przez zero) jest wskazywany na początku tego argumentu. Brakujący argument wskazuje się w miejscu, gdzie powinien się zaczynać (np. na <code>]</code>), a na końcu programu — na samym poleceniu.</li>
</ul>`,
      },
    ],
  },
  {
    id: 'limity',
    title: 'Limity',
    blocks: [
      {
        html: `<p>Żeby żaden program nie zawiesił przeglądarki, Logomocja ma limity. Przekroczenie któregokolwiek jest błędem.</p>
<table class="limits">
<thead><tr><th scope="col">Co</th><th scope="col">Limit</th></tr></thead>
<tbody>
<tr><td>Długość programu</td><td>50 000 znaków</td></tr>
<tr><td>Elementy programu (słowa, liczby, działania, nawiasy, przecinki)</td><td>10 000</td></tr>
<tr><td>Zagnieżdżenie nawiasów kwadratowych</td><td>32 poziomy</td></tr>
<tr><td>Jednocześnie aktywne wywołania procedur i powtórzenia (warunki się nie liczą)</td><td>32</td></tr>
<tr><td>Wykonane operacje: każde polecenie, <code>niech</code>, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdego obrotu pętli, treści warunku i wywołania</td><td>10 000</td></tr>
<tr><td>Odcinki na rysunku (po <code>czyść</code> liczy się od nowa)</td><td>10 000</td></tr>
<tr><td>Współrzędne żółwia</td><td>od −100 000 do 100 000</td></tr>
<tr><td>Liczba powtórzeń</td><td>od 0 do 10 000</td></tr>
<tr><td>Grubość</td><td>od 1 do 12</td></tr>
</tbody>
</table>`,
      },
    ],
  },
];
