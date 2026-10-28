import type { Mode } from '../lang/parser';

export interface CommandDoc {
  id: string;
  polish: string[];
  english: string[];
  syntax: string;
  summary: string;
  example: string;
  mode: Mode;
  note?: string;
}

export const COMMAND_DOCS: CommandDoc[] = [
  {
    id: 'np', polish: ['np', 'naprzod', 'naprzód'], english: ['fd', 'forward'], syntax: 'np odległość',
    summary: 'Przesuwa żółwia do przodu o podaną odległość. Gdy pióro jest opuszczone, rysuje odcinek. Ruch o zero niczego nie rysuje.',
    example: 'np 100\npw 90\nnp 50', mode: '2d',
  },
  {
    id: 'ws', polish: ['ws', 'wstecz'], english: ['bk', 'back'], syntax: 'ws odległość',
    summary: 'Przesuwa żółwia do tyłu (to samo, co „np” z liczbą przeciwną). Kierunek żółwia się nie zmienia.',
    example: 'np 80\nws 30', mode: '2d',
  },
  {
    id: 'pw', polish: ['pw', 'prawo'], english: ['rt', 'right'], syntax: 'pw kąt',
    summary: 'Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry) o podaną liczbę stopni. Kąt może być ułamkiem lub liczbą ujemną.',
    example: 'powtorz 3 [np 100 pw 120]', mode: '2d',
  },
  {
    id: 'lw', polish: ['lw', 'lewo'], english: ['lt', 'left'], syntax: 'lw kąt',
    summary: 'Obraca żółwia w lewo o podaną liczbę stopni.',
    example: 'np 60\nlw 45\nnp 60', mode: '2d',
  },
  {
    id: 'pod', polish: ['pod', 'podnies', 'podnieś'], english: ['pu', 'penup'], syntax: 'pod',
    summary: 'Podnosi pióro: kolejne ruchy nie zostawiają śladu.',
    example: 'np 40\npod\nnp 40\nopu\nnp 40', mode: '2d',
  },
  {
    id: 'opu', polish: ['opu', 'opusc', 'opuść'], english: ['pd', 'pendown'], syntax: 'opu',
    summary: 'Opuszcza pióro: ruchy znowu rysują. Na początku programu pióro jest opuszczone.',
    example: 'pod np 30 opu np 30', mode: '2d',
  },
  {
    id: 'kolor', polish: ['kolor'], english: ['color'], syntax: 'kolor "#rrggbb"',
    summary: 'Ustawia kolor pióra. Kolor to napis w cudzysłowie: znak # i sześć cyfr szesnastkowych (wielkość liter nie ma znaczenia). Domyślnie "#16866a".',
    example: 'kolor "#c1763d"\npowtorz 4 [np 80 pw 90]', mode: '2d',
  },
  {
    id: 'grubosc', polish: ['grubosc', 'grubość'], english: ['width'], syntax: 'grubosc liczba',
    summary: 'Ustawia grubość linii: liczba całkowita od 1 do 12. Domyślnie 3.',
    example: 'grubosc 8\nnp 100\ngrubosc 1\npw 90\nnp 100', mode: '2d',
  },
  {
    id: 'powtorz', polish: ['powtorz', 'powtórz'], english: ['repeat'], syntax: 'powtorz liczba [ polecenia ]',
    summary: 'Wykonuje polecenia w nawiasach podaną liczbę razy. Liczba musi być całkowita, od 0 do 10000. W ciele działa „nrpowt”.',
    example: 'powtorz 6 [\n  np 70\n  pw 60\n]', mode: '2d',
  },
  {
    id: 'niech', polish: ['niech'], english: ['let'], syntax: 'niech nazwa wyrażenie',
    summary: 'Przypisuje wartość zmiennej. Kolejne „niech” z tą samą nazwą zmienia wartość. Nazwa nie może być poleceniem ani nazwą procedury.',
    example: 'niech bok 50\npowtorz 4 [np bok pw 90]\nniech bok bok * 2\npowtorz 4 [np bok pw 90]', mode: '2d',
  },
  {
    id: 'jesli', polish: ['jeśli', 'jesli'], english: ['if'], syntax: 'jeśli warunek [ polecenia ]',
    summary: 'Wykonuje polecenia w nawiasach tylko wtedy, gdy warunek jest prawdziwy.',
    example: 'powtorz 8 [\n  np 30\n  jeśli nrpowt > 4 [pw 90]\n  pw 20\n]', mode: '2d',
  },
  {
    id: 'jezeli', polish: ['jeżeli', 'jezeli'], english: ['ifelse'], syntax: 'jeżeli warunek [ gdy prawda ] [ gdy fałsz ]',
    summary: 'Wykonuje pierwsze ciało, gdy warunek jest prawdziwy, a w przeciwnym razie drugie.',
    example: 'powtorz 10 [\n  jeżeli nrpowt < 6 [kolor "#16866a"] [kolor "#c1763d"]\n  np 25\n  pw 36\n]', mode: '2d',
  },
  {
    id: 'stop', polish: ['stop'], english: ['stop'], syntax: 'stop',
    summary: 'Kończy bieżące wywołanie procedury (także z wnętrza powtórzenia lub warunku). Na najwyższym poziomie kończy cały program.',
    example: 'powtorz 10 [\n  np 20\n  jeśli nrpowt = 4 [stop]\n]', mode: '2d',
  },
  {
    id: 'dom', polish: ['dom'], english: ['home'], syntax: 'dom',
    summary: 'Odsyła żółwia do początku układu i przywraca kierunek startowy. Gdy pióro jest opuszczone, rysuje drogę powrotną. Kolor, grubość i stan pióra się nie zmieniają.',
    example: 'np 80\npw 90\nnp 80\ndom', mode: '2d',
  },
  {
    id: 'czysc', polish: ['czyść', 'czysc'], english: ['cs', 'clearscreen'], syntax: 'czyść',
    summary: 'Usuwa wszystkie dotychczas narysowane odcinki. Pozycja i kierunek żółwia zostają.',
    example: 'powtorz 4 [np 60 pw 90]\nczyść\nnp 100', mode: '2d',
  },
  {
    id: 'gora', polish: ['gora', 'góra'], english: ['pitchup'], syntax: 'gora kąt',
    summary: 'Tylko 3D. Unosi nos żółwia o podany kąt: obrót wokół wektora „prawo”. Po „gora 90” żółw patrzy tam, gdzie wcześniej była jego góra.',
    example: 'gora 90\nnp 100', mode: '3d',
  },
  {
    id: 'dol', polish: ['dol', 'dół'], english: ['pitchdown'], syntax: 'dol kąt',
    summary: 'Tylko 3D. Opuszcza nos żółwia o podany kąt.',
    example: 'np 50\ndol 45\nnp 50', mode: '3d',
  },
  {
    id: 'pp', polish: ['pp', 'przechylprawo'], english: ['rr', 'rollright'], syntax: 'pp kąt',
    summary: 'Tylko 3D. Przechyla żółwia w prawo wokół jego kierunku jazdy; kierunek się nie zmienia. Po „pp 90” góra żółwia wskazuje dawną prawą stronę.',
    example: 'pp 90\ngora 90\nnp 100', mode: '3d',
  },
  {
    id: 'pl', polish: ['pl', 'przechyllewo'], english: ['rl', 'rollleft'], syntax: 'pl kąt',
    summary: 'Tylko 3D. Przechyla żółwia w lewo wokół kierunku jazdy.',
    example: 'pl 90\ngora 90\nnp 100', mode: '3d',
  },
];

export interface Section { id: string; title: string; html: string; examples?: Array<{ code: string; mode: Mode; caption?: string }> }

export const SECTIONS: Section[] = [
  {
    id: 'start', title: 'Jak to działa',
    html: `<p>Logomocja to pracownia żółwia. Piszesz program, a żółw wykonuje go po kolei, zostawiając ślad pióra. Przełącznik <strong>2D / 3D</strong> wybiera płaszczyznę albo przestrzeń.</p>
<p>Żółw startuje w punkcie (0, 0, 0), patrzy w stronę osi <strong>+Y</strong> (na ekranie: w górę), jego prawa strona to oś <strong>+X</strong>, a góra to oś <strong>+Z</strong> (z ekranu ku Tobie). Pióro jest opuszczone, kolor to <code>#16866a</code>, grubość 3. W trybie 2D rysujesz na płaszczyźnie XY (z = 0).</p>
<p>Program złożony wyłącznie z poleceń płaskich daje te same współrzędne w 2D i w 3D.</p>`,
    examples: [{ code: '; pierwszy program\npowtorz 4 [np 100 pw 90]', mode: '2d' }],
  },
  {
    id: 'skladnia', title: 'Składnia i zapis',
    html: `<ul>
<li>Wielkość liter nie ma znaczenia: <code>NP</code>, <code>Np</code> i <code>np</code> to to samo. Polskie polecenia mają wersje z ogonkami i bez (<code>powtórz</code> i <code>powtorz</code>), a także angielskie odpowiedniki (<code>repeat</code>).</li>
<li>Średnik zaczyna komentarz, który trwa do końca wiersza.</li>
<li>Białe znaki rozdzielają znaki programu. Podział na wiersze ma znaczenie tylko w definicjach procedur.</li>
<li>Liczby to zapisy dziesiętne bez znaku: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy takie jak <code>1e3</code>, <code>0x10</code>, <code>NaN</code> czy <code>Infinity</code> są błędem. Znak minus lub plus to operator.</li>
<li>Kwadratowe nawiasy <code>[ ]</code> otaczają ciała powtórzeń i warunków i mogą się zagnieżdżać. Okrągłe <code>( )</code> grupują wyrażenia.</li>
<li>Kolor zapisujemy jako napis w cudzysłowie: <code>"#16866a"</code>.</li>
</ul>`,
    examples: [{ code: '; komentarz do końca wiersza\nKOLOR "#2B6FB3"   ; wielkie litery są w porządku\nPOWTÓRZ 3 [NP 90 PW 120]', mode: '2d' }],
  },
  {
    id: 'wyrazenia', title: 'Wyrażenia',
    html: `<p>Wszędzie tam, gdzie polecenie wymaga liczby, możesz podać wyrażenie: liczbę, nazwę (parametr lub zmienną, także w starej formie <code>:nazwa</code>), <code>nrpowt</code>, wyrażenie w nawiasach, znak <code>-</code> lub <code>+</code> przed dowolnym z nich albo dwa wyrażenia połączone znakiem <code>+</code>, <code>-</code>, <code>*</code> lub <code>/</code>.</p>
<ul>
<li><code>*</code> i <code>/</code> wiążą silniej niż <code>+</code> i <code>-</code>; działania o równym priorytecie liczymy od lewej: <code>np 20 - 5 - 3</code> przesuwa o 12, a <code>np 2 + 3 * 4</code> o 14.</li>
<li><strong>Odstępy wokół działania:</strong> operator musi mieć odstęp po obu stronach albo po żadnej. <code>np 10 - 5</code> i <code>np 10-5</code> przesuwają o 5, ale <code>np 10 -5</code> to polecenie <code>np 10</code> i zbłąkane <code>-5</code>, czyli błąd. Ta zasada nie dotyczy porównań.</li>
<li>Minusy można piętrzyć i stosować wszędzie: <code>np -(3 - 5)</code>, <code>np - -2</code>, <code>np -bok</code>.</li>
<li>Dzielenie przez zero i wynik, który nie jest liczbą skończoną, to błąd wykonania.</li>
<li><strong>Warunek</strong> to <code>wyrażenie porównanie wyrażenie</code>, gdzie porównanie to <code>&lt;</code> <code>&gt;</code> <code>=</code> <code>&lt;=</code> <code>&gt;=</code> <code>&lt;&gt;</code>. Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem.</li>
</ul>`,
    examples: [{ code: 'np 2 + 3 * 4   ; 14\npw 90\nnp 20 - 5 - 3   ; 12\npw 90\nnp -(3 - 5) * 10', mode: '2d' }],
  },
  {
    id: 'zmienne', title: 'Zmienne',
    html: `<p><code>niech x 5</code> przypisuje wartość wyrażenia zmiennej <code>x</code>; kolejne <code>niech x ...</code> ją zmienia. <code>niech</code> na najwyższym poziomie tworzy zmienną globalną. W procedurze tworzy zmienną lokalną dla tego wywołania, która przesłania globalną o tej samej nazwie i znika po zakończeniu wywołania.</p>
<p>Nazwy możesz używać w wyrażeniu, jeśli jest parametrem bieżącej procedury, jest przypisywana przez <code>niech</code> w tej procedurze albo gdzieś na najwyższym poziomie (także później w tekście). Inne nazwy to błąd przed uruchomieniem. Odczyt zmiennej, która jeszcze nie dostała wartości, to błąd wykonania.</p>`,
    examples: [{ code: 'niech bok 20\npowtorz 8 [\n  powtorz 4 [np bok pw 90]\n  niech bok bok + 10\n  pw 15\n]', mode: '2d' }],
  },
  {
    id: 'powtorz', title: 'Powtarzanie i „nrpowt”',
    html: `<p><code>powtorz n [ ... ]</code> wykonuje ciało <code>n</code> razy; <code>n</code> to liczba całkowita od 0 do 10000 (0 nie robi nic). Wewnątrz ciała <code>nrpowt</code> (po angielsku <code>repcount</code>) jest numerem bieżącego obiegu najbliższego otaczającego <code>powtorz</code>, licząc od 1. Wyszukuje się go w tekście programu, nie w czasie wywołań: <code>nrpowt</code> w procedurze, która sama nie jest wewnątrz powtórzenia, to błąd, nawet jeśli wywołasz ją z powtórzenia.</p>`,
    examples: [{ code: 'powtorz 30 [\n  np nrpowt * 4\n  pw 90\n]', mode: '2d' }],
  },
  {
    id: 'warunki', title: 'Warunki',
    html: `<p><code>jeśli warunek [ ... ]</code> wykonuje ciało, gdy warunek jest prawdziwy. <code>jeżeli warunek [ ... ] [ ... ]</code> wykonuje pierwsze ciało, gdy warunek jest prawdziwy, a drugie w przeciwnym razie. Ciała warunków mogą zawierać wszystko, co ciało powtórzenia.</p>`,
    examples: [{ code: 'niech znak 1\npowtorz 60 [\n  jeżeli znak > 0 [kolor "#16866a"] [kolor "#a478c0"]\n  niech znak -znak\n  np nrpowt\n  pw 61\n]', mode: '2d' }],
  },
  {
    id: 'procedury', title: 'Procedury',
    html: `<p>Definicja zaczyna się słowem <code>oto</code> (lub <code>to</code>) na początku wiersza, po którym w tym samym wierszu podajesz nazwę i, opcjonalnie, <code>ma:</code> oraz parametry rozdzielone przecinkami. Ciało zajmuje kolejne wiersze, a kończy je samotne w wierszu <code>już</code> (<code>juz</code>, <code>end</code>). Dozwolona jest też stara forma nagłówka <code>oto kwadrat :bok :kąt</code>, a w ciele parametr można zapisać jako <code>:bok</code> lub po prostu <code>bok</code>.</p>
<ul>
<li>Wywołanie to nazwa i dokładnie tyle argumentów, ile parametrów, oddzielonych białymi znakami. Argument jest wyrażeniem: <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90.</li>
<li>Definicje są tylko na najwyższym poziomie (nie w powtórzeniu, warunku ani innej procedurze), mogą stać przed wywołaniem lub po nim, a nazwę definiuje się raz.</li>
<li>Procedury mogą wywoływać same siebie (rekurencja). <code>stop</code> kończy bieżące wywołanie.</li>
<li>Parametr może nazywać się tak samo jak procedura: na miejscu polecenia nazwa jest wywołaniem, na miejscu argumentu parametrem.</li>
<li>Procedury nie zwracają wartości.</li>
</ul>`,
    examples: [
      { code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90\nkwadrat 40 * 2 60', mode: '2d' },
      { code: 'oto spirala ma: dł\n  jeśli dł > 120 [stop]\n  np dł\n  pw 91\n  spirala dł + 6\njuż\n\nspirala 6', mode: '2d', caption: 'Rekurencja i stop' },
    ],
  },
  {
    id: '3d', title: 'Przestrzeń 3D',
    html: `<p>Żółw ma trzy wektory: kierunek jazdy, prawo i górę. <code>pw</code>/<code>lw</code> obracają go wokół wektora „góra”, <code>gora</code>/<code>dol</code> unoszą i opuszczają nos (obrót wokół „prawo”), a <code>pp</code>/<code>pl</code> przechylają go wokół kierunku jazdy. Polecenia <code>gora</code>, <code>dol</code>, <code>pp</code> i <code>pl</code> w trybie 2D są błędem.</p>
<p>Widok 3D obracasz przeciągnięciem, przesuwasz prawym przyciskiem (lub dwoma palcami), a powiększasz kółkiem myszy lub szczypnięciem. Przycisk „Dopasuj” obejmuje całe rysunek, a „Resetuj widok” przywraca kamerę. Gdy przeglądarka nie obsługuje WebGL, program nadal działa, a rysunek pokazuje płaski rzut z komunikatem o przyczynie.</p>`,
    examples: [{ code: 'powtorz 4 [np 80 pw 90]\ngora 90\npowtorz 4 [np 80 pw 90]', mode: '3d' }],
  },
  {
    id: 'bledy', title: 'Błędy i limity',
    html: `<p>Każdy błąd ma numer wiersza i kolumny (od 1) oraz opis po polsku. Edytor podkreśla miejsce błędu. Program jest sprawdzany w całości przed uruchomieniem: <strong>błąd składni nie rysuje niczego</strong>. <strong>Błąd wykonania</strong> (np. dzielenie przez zero, nieprzypisana zmienna, przekroczony limit) zatrzymuje program, ale zachowuje to, co już narysowano.</p>
<p>Błąd w wartości argumentu (zła grubość, zła liczba powtórzeń, dzielenie przez zero, zmienna bez wartości) wskazuje pierwszy znak tego argumentu. Brakujący argument wskazuje miejsce, w którym miał się zacząć, albo samo polecenie, jeśli program się tam kończy. Grubość i liczba powtórzeń zapisane samymi liczbami są sprawdzane już przed uruchomieniem.</p>
<table><thead><tr><th>Limit</th><th>Wartość</th></tr></thead><tbody>
<tr><td>Znaki programu</td><td>50 000</td></tr>
<tr><td>Tokeny (słowa, liczby, operatory, nawiasy, przecinki)</td><td>10 000</td></tr>
<tr><td>Zagnieżdżenie nawiasów</td><td>32</td></tr>
<tr><td>Jednocześnie aktywne wywołania procedur i powtórzenia</td><td>32</td></tr>
<tr><td>Wykonane operacje (każde polecenie, <code>niech</code>, warunek, powtórzenie i wywołanie oraz zakończenie każdego obiegu, ciała warunku i wywołania)</td><td>10 000</td></tr>
<tr><td>Zachowane odcinki</td><td>10 000</td></tr>
<tr><td>Każda współrzędna</td><td>±100 000</td></tr>
<tr><td>Grubość</td><td>1 do 12</td></tr>
<tr><td>Liczba powtórzeń</td><td>0 do 10 000</td></tr>
</tbody></table>`,
  },
];

export const SHORTCUTS: Array<{ keys: string; action: string }> = [
  { keys: 'Ctrl + Enter', action: 'Uruchom program (lub wznów po pauzie)' },
  { keys: 'F10 albo Ctrl + Shift + Enter', action: 'Wykonaj jeden krok' },
  { keys: 'F6 albo Ctrl + .', action: 'Pauza / wznów' },
  { keys: 'F8 albo Esc', action: 'Zatrzymaj i wyczyść rysunek (reset)' },
  { keys: '? (poza edytorem)', action: 'Pokaż listę skrótów' },
  { keys: 'Strzałki, + , −, 0', action: 'Na rysunku: przesuń, przybliż, oddal, dopasuj' },
];
