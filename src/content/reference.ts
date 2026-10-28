import type { Mode } from '../lang';

export interface RefExample { source: string; mode: Mode; caption?: string }
export interface RefEntry {
  id: string;
  title: string;
  aliases: string[];
  syntax: string;
  body: string;
  example?: RefExample;
}
export interface RefSection {
  id: string;
  title: string;
  intro: string;
  entries: RefEntry[];
  examples?: RefExample[];
}

/** Treść zakładki „Pomoc” – opis języka Logomocji. */
export const REFERENCE: RefSection[] = [
  // ───────────────────────────── Pierwsze kroki
  {
    id: 'pierwsze-kroki',
    title: 'Pierwsze kroki',
    intro:
      '<p>W Logomocji rysujesz, wydając polecenia <strong>żółwiowi</strong>. Żółw stoi na płaszczyźnie (albo w przestrzeni), patrzy w określoną stronę i trzyma pióro. Gdy idzie z opuszczonym piórem, zostawia za sobą linię.</p>' +
      '<p>Wpisz program w edytorze i naciśnij <strong>Uruchom</strong> (albo <kbd>Ctrl</kbd>+<kbd>Enter</kbd>). Przycisk <strong>Krok</strong> wykonuje program po jednym poleceniu, a <strong>Reset</strong> przywraca żółwia do stanu początkowego.</p>' +
      '<p><strong>Układ współrzędnych.</strong> Oś <code>+X</code> biegnie w prawo, oś <code>+Y</code> do przodu, czyli w górę strony, a oś <code>+Z</code> wychodzi z ekranu w Twoją stronę. Na początku żółw stoi w punkcie <code>(0, 0, 0)</code>, patrzy w kierunku <code>+Y</code>, ma opuszczone pióro, kolor <code>#16866a</code> i grubość <code>3</code>.</p>' +
      '<p><strong>Tryby 2D i 3D.</strong> W trybie 2D żółw porusza się po płaskiej kartce (płaszczyzna XY). W trybie 3D może też unosić nos i przechylać się – służą do tego polecenia z rozdziału „Trzeci wymiar”. Program, który nie wychodzi z płaszczyzny, rysuje w obu trybach to samo.</p>' +
      '<p>Każde polecenie ma nazwę polską (z polskimi znakami albo bez nich) i angielską, np. <code>np</code>, <code>naprzód</code>, <code>naprzod</code> i <code>fd</code> znaczą to samo. Wielkość liter nie ma znaczenia.</p>',
    entries: [],
    examples: [
      {
        mode: '2d',
        caption: 'Pierwszy rysunek: kwadrat.',
        source: `np 100
pw 90
np 100
pw 90
np 100
pw 90
np 100
`,
      },
    ],
  },

  // ───────────────────────────── Ruch i obroty
  {
    id: 'ruch',
    title: 'Ruch i obroty',
    intro:
      '<p>Żółw idzie zawsze w kierunku, w którym patrzy, i obraca się względem samego siebie. Odległości podajesz w krokach (jednostkach układu), a kąty w stopniach. Argument może być dowolnym wyrażeniem, np. <code>np 40 * 2</code>.</p>',
    entries: [
      {
        id: 'np',
        title: 'np — naprzód',
        aliases: ['np', 'naprzod', 'naprzód', 'fd', 'forward'],
        syntax: 'np odległość',
        body:
          '<p>Przesuwa żółwia do przodu o podaną odległość. Jeśli pióro jest opuszczone, rysuje odcinek. Ruch o <code>0</code> niczego nie rysuje, a odległość ujemna oznacza ruch do tyłu.</p>',
        example: { mode: '2d', source: `np 100\n` },
      },
      {
        id: 'ws',
        title: 'ws — wstecz',
        aliases: ['ws', 'wstecz', 'bk', 'back'],
        syntax: 'ws odległość',
        body:
          '<p>Przesuwa żółwia do tyłu o podaną odległość, bez zmiany kierunku, w którym patrzy. <code>ws 50</code> działa tak samo jak <code>np -50</code>.</p>',
        example: { mode: '2d', source: `np 100\npw 90\nws 60\n` },
      },
      {
        id: 'pw',
        title: 'pw — prawo',
        aliases: ['pw', 'prawo', 'rt', 'right'],
        syntax: 'pw kąt',
        body:
          '<p>Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry) o podaną liczbę stopni. Żółw się nie przesuwa. Kąt może być ułamkowy, a kąt ujemny obraca w lewo.</p>',
        example: {
          mode: '2d',
          caption: 'Trójkąt równoboczny.',
          source: `np 100\npw 120\nnp 100\npw 120\nnp 100\n`,
        },
      },
      {
        id: 'lw',
        title: 'lw — lewo',
        aliases: ['lw', 'lewo', 'lt', 'left'],
        syntax: 'lw kąt',
        body:
          '<p>Obraca żółwia w lewo o podaną liczbę stopni. <code>lw 90</code> to to samo co <code>pw -90</code>.</p>',
        example: { mode: '2d', source: `np 60\nlw 90\nnp 60\nlw 45\nnp 60\n` },
      },
    ],
  },

  // ───────────────────────────── Pióro
  {
    id: 'pioro',
    title: 'Pióro',
    intro:
      '<p>Pióro decyduje, czy żółw zostawia ślad, jakiego jest on koloru i jak jest gruby. Ustawienia pióra obowiązują, dopóki ich nie zmienisz.</p>',
    entries: [
      {
        id: 'pod',
        title: 'pod — podnieś pióro',
        aliases: ['pod', 'podnies', 'podnieś', 'pu', 'penup'],
        syntax: 'pod',
        body:
          '<p>Podnosi pióro. Od tej chwili żółw się porusza, ale niczego nie rysuje. Przydaje się, gdy chcesz przejść w inne miejsce kartki.</p>',
        example: { mode: '2d', source: `np 40\npod\nnp 30\nopu\nnp 40\n` },
      },
      {
        id: 'opu',
        title: 'opu — opuść pióro',
        aliases: ['opu', 'opusc', 'opuść', 'pd', 'pendown'],
        syntax: 'opu',
        body:
          '<p>Opuszcza pióro, więc kolejne ruchy znów rysują linie. Na początku programu pióro jest już opuszczone.</p>',
        example: {
          mode: '2d',
          caption: 'Linia przerywana.',
          source: `powtórz 5 [\n  opu np 20\n  pod np 10\n]\n`,
        },
      },
      {
        id: 'kolor',
        title: 'kolor — kolor pióra',
        aliases: ['kolor', 'color'],
        syntax: 'kolor "#rrggbb"',
        body:
          '<p>Ustawia kolor kolejnych linii. Kolor zapisujesz w cudzysłowie jako znak <code>#</code> i sześć cyfr szesnastkowych, np. <code>"#c1763d"</code>. Wielkość liter nie ma znaczenia. Argumentem musi być taki zapis – nie może to być wyrażenie ani zmienna.</p>',
        example: {
          mode: '2d',
          source: `kolor "#c1763d"\nnp 60\nkolor "#3D5A98"\npw 90\nnp 60\n`,
        },
      },
      {
        id: 'grubosc',
        title: 'grubość — grubość pióra',
        aliases: ['grubosc', 'grubość', 'width'],
        syntax: 'grubość liczba',
        body:
          '<p>Ustawia grubość linii. Wartość musi być liczbą całkowitą od <code>1</code> do <code>12</code>. Na początku grubość wynosi <code>3</code>.</p>',
        example: {
          mode: '2d',
          source: `grubość 1\nnp 50\npw 90\ngrubość 8\nnp 50\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Powtarzanie
  {
    id: 'powtarzanie',
    title: 'Powtarzanie',
    intro:
      '<p>Zamiast pisać to samo kilka razy, każ żółwiowi powtarzać. Polecenia do powtórzenia umieszczasz w nawiasach kwadratowych <code>[ ]</code>. Powtórzenia można zagnieżdżać jedne w drugich.</p>',
    entries: [
      {
        id: 'powtorz',
        title: 'powtórz — powtarzaj',
        aliases: ['powtorz', 'powtórz', 'repeat'],
        syntax: 'powtórz ile [ polecenia ]',
        body:
          '<p>Wykonuje polecenia w nawiasach podaną liczbę razy. Liczba powtórzeń musi być liczbą całkowitą od <code>0</code> do <code>10000</code>. Przy <code>0</code> polecenia w nawiasach nie wykonują się ani razu.</p>',
        example: {
          mode: '2d',
          caption: 'Kwadrat w trzech linijkach.',
          source: `powtórz 4 [\n  np 100\n  pw 90\n]\n`,
        },
      },
      {
        id: 'nrpowt',
        title: 'nrpowt — numer powtórzenia',
        aliases: ['nrpowt', 'repcount'],
        syntax: 'nrpowt',
        body:
          '<p>To nie polecenie, tylko wartość, której używasz w wyrażeniach. Oznacza numer bieżącego powtórzenia, licząc od <code>1</code>.</p>' +
          '<p>Liczy się to powtórzenie, które <strong>w tekście programu</strong> najbliżej obejmuje <code>nrpowt</code> (najbardziej wewnętrzne). Dlatego <code>nrpowt</code> w treści procedury działa tylko wtedy, gdy w tej samej treści stoi wewnątrz <code>powtórz</code>. Nie wystarczy, że procedurę wywołano z wnętrza powtórzenia – taki program, podobnie jak <code>nrpowt</code> poza wszelkim powtórzeniem, zostanie odrzucony przed uruchomieniem.</p>',
        example: {
          mode: '2d',
          caption: 'Spirala: każdy bok jest dłuższy od poprzedniego.',
          source: `powtórz 30 [\n  np nrpowt * 5\n  pw 90\n]\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Zmienne
  {
    id: 'zmienne',
    title: 'Zmienne',
    intro:
      '<p>Zmienna to nazwa, pod którą zapamiętujesz liczbę, żeby użyć jej później. Nazwy zmiennych, tak jak polecenia, nie rozróżniają wielkości liter i mogą zawierać polskie znaki.</p>',
    entries: [
      {
        id: 'niech',
        title: 'niech — przypisz wartość',
        aliases: ['niech', 'let'],
        syntax: 'niech nazwa wyrażenie',
        body:
          '<p>Oblicza wyrażenie i zapisuje wynik pod podaną nazwą. Kolejne <code>niech</code> z tą samą nazwą zmienia jej wartość, np. <code>niech bok bok + 10</code>.</p>' +
          '<p><strong>Zasięg.</strong></p>' +
          '<ul>' +
          '<li><code>niech</code> poza procedurami tworzy zmienną <strong>globalną</strong>.</li>' +
          '<li><code>niech</code> wewnątrz procedury tworzy zmienną <strong>lokalną</strong>, ważną tylko w tym jednym wywołaniu. Od tego miejsca do końca wywołania przesłania ona zmienną globalną o tej samej nazwie, a po zakończeniu wywołania znika. Tak samo możesz zmieniać wartości parametrów procedury.</li>' +
          '</ul>' +
          '<p><strong>Jakich nazw można używać.</strong> Nazwa zmiennej nie może być nazwą polecenia ani procedury. Nazwy możesz użyć tylko wtedy, gdy jest:</p>' +
          '<ul>' +
          '<li>parametrem procedury, w której jej używasz,</li>' +
          '<li>przypisana przez <code>niech</code> gdziekolwiek w treści tej procedury,</li>' +
          '<li>przypisana przez <code>niech</code> gdziekolwiek poza procedurami (przed miejscem użycia lub po nim).</li>' +
          '</ul>' +
          '<p>Inna nazwa to błąd wykryty jeszcze przed uruchomieniem. Odczytanie zmiennej, której <code>niech</code> jeszcze się nie wykonało, to błąd w trakcie działania programu.</p>',
        example: {
          mode: '2d',
          source: `niech bok 20\npowtórz 8 [\n  np bok\n  pw 90\n  niech bok bok + 10\n]\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Wyrażenia
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    intro:
      '<p>Wszędzie tam, gdzie polecenie oczekuje liczby, możesz wpisać <strong>wyrażenie</strong>: liczbę, nazwę parametru lub zmiennej (także w starym zapisie <code>:nazwa</code>), <code>nrpowt</code>, wyrażenie w nawiasach okrągłych albo kilka takich elementów połączonych działaniami.</p>' +
      '<p><strong>Liczby</strong> zapisujesz dziesiętnie, z kropką jako separatorem: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy <code>1e3</code>, <code>0x10</code>, <code>NaN</code> i <code>Infinity</code> są błędne.</p>' +
      '<p><strong>Działania:</strong> <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>. Mnożenie i dzielenie wykonują się przed dodawaniem i odejmowaniem, a działania o tym samym priorytecie – od lewej do prawej. Na przykład <code>np 2 + 3 * 4</code> idzie o 14, a <code>np 20 - 5 - 3</code> o 12. Kolejność zmienisz nawiasami: <code>np (2 + 3) * 4</code> idzie o 20.</p>' +
      '<p><strong>Odstępy wokół działań.</strong> Znak działania musi mieć spację po obu stronach albo nie mieć jej wcale. <code>np 10 - 5</code> i <code>np 10-5</code> idą o 5. Natomiast <code>np 10 -5</code> oznacza <code>np 10</code>, po którym stoi osobne <code>-5</code> – i to jest błąd. Ta sama zasada dotyczy <code>+</code>, <code>*</code> i <code>/</code> (ale nie porównań).</p>' +
      '<p><strong>Znak liczby.</strong> Minus lub plus przed wartością to osobne działanie, a nie część liczby. Można je stawiać przed liczbą, nazwą, <code>nrpowt</code> i nawiasem, także po kilka naraz: <code>np -bok</code>, <code>np -(3 - 5)</code>, <code>np - -2</code>.</p>' +
      '<p><strong>Dzielenie przez zero</strong> i każdy inny wynik, który nie jest skończoną liczbą, przerywa program błędem.</p>' +
      '<p><strong>Porównania są dokładne.</strong> Komputer liczy na ułamkach dwójkowych, więc np. <code>0.1 + 0.2</code> nie jest dokładnie równe <code>0.3</code> i warunek <code>jeśli 0.1 + 0.2 = 0.3 [ … ]</code> się nie spełni.</p>',
    entries: [],
    examples: [
      {
        mode: '2d',
        caption: 'Kolejność działań: pierwszy odcinek ma 14, drugi 20, trzeci 12.',
        source: `np 2 + 3 * 4\npw 90\nnp (2 + 3) * 4\npw 90\nnp 20 - 5 - 3\n`,
      },
      {
        mode: '2d',
        caption: 'Znak przed wartością.',
        source: `niech bok 30\nnp -bok\npw 90\nnp -(3 - 5) * 20\n`,
      },
    ],
  },

  // ───────────────────────────── Warunki
  {
    id: 'warunki',
    title: 'Warunki',
    intro:
      '<p>Warunek pozwala wykonać polecenia tylko wtedy, gdy coś jest prawdą. Warunek ma postać <code>wyrażenie porównanie wyrażenie</code>. Dostępne porównania:</p>' +
      '<ul>' +
      '<li><code>&lt;</code> – mniejsze niż,</li>' +
      '<li><code>&gt;</code> – większe niż,</li>' +
      '<li><code>=</code> – równe,</li>' +
      '<li><code>&lt;=</code> – mniejsze lub równe,</li>' +
      '<li><code>&gt;=</code> – większe lub równe,</li>' +
      '<li><code>&lt;&gt;</code> – różne.</li>' +
      '</ul>' +
      '<p>Pamiętaj, że porównania są dokładne (zob. „Wyrażenia”).</p>',
    entries: [
      {
        id: 'jesli',
        title: 'jeśli — jeżeli warunek jest spełniony',
        aliases: ['jeśli', 'jesli', 'if'],
        syntax: 'jeśli warunek [ polecenia ]',
        body:
          '<p>Wykonuje polecenia w nawiasach tylko wtedy, gdy warunek jest spełniony. W przeciwnym razie je pomija.</p>',
        example: {
          mode: '2d',
          caption: 'Druga połowa boków jest pomarańczowa.',
          source: `powtórz 12 [\n  kolor "#16866a"\n  jeśli nrpowt > 6 [ kolor "#c1763d" ]\n  np 40\n  pw 30\n]\n`,
        },
      },
      {
        id: 'jezeli',
        title: 'jeżeli — jeśli tak, w przeciwnym razie',
        aliases: ['jeżeli', 'jezeli', 'ifelse'],
        syntax: 'jeżeli warunek [ gdy tak ] [ gdy nie ]',
        body:
          '<p>Ma dwa bloki poleceń. Gdy warunek jest spełniony, wykonuje pierwszy blok, a gdy nie – drugi.</p>',
        example: {
          mode: '2d',
          caption: 'Cztery schodki, a potem prosto.',
          source: `powtórz 8 [\n  jeżeli nrpowt < 5 [ np 20 pw 90 np 20 lw 90 ] [ np 10 ]\n]\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Procedury
  {
    id: 'procedury',
    title: 'Procedury',
    intro:
      '<p>Procedura to Twoje własne polecenie. Raz ją definiujesz, a potem wywołujesz jej nazwą jak każde inne polecenie, także wielokrotnie i z różnymi argumentami.</p>',
    entries: [
      {
        id: 'oto',
        title: 'oto … już — definicja procedury',
        aliases: ['oto', 'to', 'już', 'juz', 'end', 'ma:'],
        syntax: 'oto nazwa ma: parametr1, parametr2\n  polecenia\njuż',
        body:
          '<p>Definicja zaczyna się od <code>oto</code> (lub <code>to</code>) na początku wiersza. W tym samym wierszu podajesz nazwę procedury i opcjonalnie <code>ma:</code> z listą parametrów rozdzielonych przecinkami. Treść procedury zaczyna się w następnym wierszu i kończy słowem <code>już</code> (lub <code>juz</code>, <code>end</code>) stojącym samotnie we własnym wierszu.</p>' +
          '<p>Działa też starszy zapis nagłówka: <code>oto kwadrat :bok :kąt</code>. W treści do parametru możesz się odwołać jako <code>:bok</code> lub po prostu <code>bok</code>.</p>' +
          '<ul>' +
          '<li>Procedury definiujesz tylko na najwyższym poziomie programu – nie wewnątrz innej procedury ani nawiasów. Definicja może stać przed jej użyciem albo po nim.</li>' +
          '<li>Każdą nazwę można zdefiniować tylko raz.</li>' +
          '<li>Parametr może nazywać się tak samo jak procedura: na miejscu polecenia ta nazwa oznacza wywołanie, a na miejscu argumentu – parametr.</li>' +
          '<li>Procedury nie zwracają wartości.</li>' +
          '</ul>',
        example: {
          mode: '2d',
          source: `oto kwadrat ma: bok, kąt\n  powtórz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90\n`,
        },
      },
      {
        id: 'wywolanie',
        title: 'Wywołanie procedury',
        aliases: [],
        syntax: 'nazwa argument1 argument2 …',
        body:
          '<p>Procedurę wywołujesz jej nazwą, a po niej podajesz argumenty oddzielone odstępami – dokładnie tyle, ile procedura ma parametrów, w tej samej kolejności. Każdy argument jest wyrażeniem: <code>kwadrat 40 * 2 90</code> przekazuje <code>80</code> i <code>90</code>.</p>' +
          '<p>Procedura może wywoływać samą siebie (<strong>rekurencja</strong>). Pamiętaj tylko, żeby w którymś momencie przestała – pomoże w tym <code>stop</code>.</p>',
        example: {
          mode: '2d',
          caption: 'Starszy zapis nagłówka i wywołania z wyrażeniami.',
          source: `oto trójkąt :bok\n  powtórz 3 [np :bok pw 120]\njuż\n\npowtórz 4 [trójkąt nrpowt * 25]\n`,
        },
      },
      {
        id: 'stop',
        title: 'stop — zakończ procedurę',
        aliases: ['stop'],
        syntax: 'stop',
        body:
          '<p>Natychmiast kończy bieżące wywołanie procedury, nawet jeśli stoi w środku powtórzenia lub warunku. Użyte poza procedurą kończy cały program.</p>',
        example: {
          mode: '2d',
          caption: 'Rekurencyjna spirala, która zatrzymuje się, gdy bok robi się krótki.',
          source: `oto spirala ma: bok\n  jeśli bok < 5 [ stop ]\n  np bok\n  pw 90\n  spirala bok - 8\njuż\n\nspirala 120\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Trzeci wymiar
  {
    id: 'trzeci-wymiar',
    title: 'Trzeci wymiar',
    intro:
      '<p>W trybie 3D żółw jest jak samolot: ma kierunek, w którym leci (<strong>nos</strong>), stronę prawą i stronę „w górę” (<strong>grzbiet</strong>). Polecenia <code>pw</code> i <code>lw</code> obracają go wokół grzbietu, a polecenia z tego rozdziału pozwalają unosić nos i przechylać się na boki. Wszystkie obroty są względem żółwia, nie ekranu.</p>' +
      '<p>Te cztery polecenia działają <strong>tylko w trybie 3D</strong>. W trybie 2D są błędem.</p>',
    entries: [
      {
        id: 'gora',
        title: 'góra — nos w górę',
        aliases: ['gora', 'góra', 'pitchup'],
        syntax: 'góra kąt',
        body:
          '<p>Obraca kierunek ruchu w stronę grzbietu, wokół osi skierowanej w prawo od żółwia. Po <code>góra 90</code> żółw patrzy tam, gdzie wcześniej był jego grzbiet. Tylko w trybie 3D.</p>',
        example: {
          mode: '3d',
          source: `np 60\ngóra 90\nnp 60\ngóra 90\nnp 60\n`,
        },
      },
      {
        id: 'dol',
        title: 'dół — nos w dół',
        aliases: ['dol', 'dół', 'pitchdown'],
        syntax: 'dół kąt',
        body:
          '<p>Obrót odwrotny do <code>góra</code>: kieruje nos w stronę przeciwną do grzbietu. <code>dół 30</code> to to samo co <code>góra -30</code>. Tylko w trybie 3D.</p>',
        example: {
          mode: '3d',
          source: `powtórz 6 [\n  np 50\n  dół 60\n]\n`,
        },
      },
      {
        id: 'pp',
        title: 'pp — przechył w prawo',
        aliases: ['pp', 'przechylprawo', 'rr', 'rollright'],
        syntax: 'pp kąt',
        body:
          '<p>Przechyla żółwia w prawo wokół kierunku ruchu: grzbiet obraca się w stronę prawego boku. Po <code>pp 90</code> grzbiet wskazuje tam, gdzie był prawy bok, a prawy bok – tam, gdzie był spód. Kierunek ruchu się nie zmienia. Tylko w trybie 3D.</p>',
        example: {
          mode: '3d',
          caption: 'Dwa kwadraty w prostopadłych płaszczyznach.',
          source: `powtórz 4 [np 60 pw 90]\npp 90\npowtórz 4 [np 60 pw 90]\n`,
        },
      },
      {
        id: 'pl',
        title: 'pl — przechył w lewo',
        aliases: ['pl', 'przechyllewo', 'rl', 'rollleft'],
        syntax: 'pl kąt',
        body:
          '<p>Obrót odwrotny do <code>pp</code>: przechyla żółwia w lewo wokół kierunku ruchu. Kierunek ruchu się nie zmienia. Tylko w trybie 3D.</p>',
        example: {
          mode: '3d',
          caption: 'Śruba z kwadratów.',
          source: `powtórz 12 [\n  powtórz 4 [np 40 pw 90]\n  pl 15\n]\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Inne polecenia
  {
    id: 'inne',
    title: 'Inne polecenia',
    intro: '<p>Kilka przydatnych drobiazgów.</p>',
    entries: [
      {
        id: 'dom',
        title: 'dom — powrót do początku',
        aliases: ['dom', 'home'],
        syntax: 'dom',
        body:
          '<p>Przenosi żółwia do punktu <code>(0, 0, 0)</code> i ustawia go tak jak na początku programu (patrzy w kierunku <code>+Y</code>). Jeśli pióro jest opuszczone, a żółw nie stoi już w początku układu, rysuje odcinek. Stan pióra, kolor i grubość się nie zmieniają.</p>',
        example: { mode: '2d', source: `np 80\npw 90\nnp 60\ndom\n` },
      },
      {
        id: 'czysc',
        title: 'czyść — wyczyść rysunek',
        aliases: ['czyść', 'czysc', 'cs', 'clearscreen'],
        syntax: 'czyść',
        body:
          '<p>Usuwa wszystkie narysowane dotąd linie. Nic więcej się nie zmienia: żółw zostaje w tym samym miejscu, patrzy w tę samą stronę i ma te same ustawienia pióra.</p>',
        example: {
          mode: '2d',
          caption: 'Zostanie tylko drugi odcinek.',
          source: `np 100\nczyść\npw 90\nnp 50\n`,
        },
      },
      {
        id: 'komentarz',
        title: '; — komentarz',
        aliases: [';'],
        syntax: '; dowolny tekst',
        body:
          '<p>Średnik rozpoczyna komentarz, który trwa do końca wiersza. Żółw go pomija, a Tobie pomaga opisać, co robi program.</p>',
        example: {
          mode: '2d',
          source: `; Mój pierwszy program\nnp 50 ; idę do przodu\npw 90\nnp 50\n`,
        },
      },
    ],
  },

  // ───────────────────────────── Limity
  {
    id: 'limity',
    title: 'Limity',
    intro:
      '<p>Żeby żaden program nie zawiesił przeglądarki, Logomocja ma kilka ograniczeń. Przekroczenie któregokolwiek z nich jest zgłaszane jako błąd.</p>' +
      '<ul>' +
      '<li>Program może mieć najwyżej <strong>50 000 znaków</strong>.</li>' +
      '<li>Najwyżej <strong>10 000 tokenów</strong> (słów, liczb, nazw; liczą się też znaki działań, nawiasy i przecinki).</li>' +
      '<li>Nawiasy kwadratowe można zagnieżdżać najwyżej na <strong>32 poziomy</strong> (bloki warunków też się liczą).</li>' +
      '<li>Nawiasy okrągłe w wyrażeniu też można zagnieżdżać najwyżej na <strong>32 poziomy</strong>.</li>' +
      '<li>Jednocześnie może trwać najwyżej <strong>32</strong> wywołań procedur i powtórzeń razem (warunki się nie liczą).</li>' +
      '<li>Program może wykonać najwyżej <strong>10 000 operacji</strong>. Operacją jest każde polecenie, każde <code>niech</code>, każdy warunek, każde powtórzenie i każde wywołanie procedury, a także zakończenie każdego obrotu powtórzenia, bloku warunku i wywołania procedury. Obrót albo blok przerwany przez <code>stop</code> nie dolicza zakończenia, ale przerwane wywołanie procedury – tak.</li>' +
      '<li>Rysunek może mieć najwyżej <strong>10 000 odcinków</strong> naraz (odcinki usunięte przez <code>czyść</code> się nie liczą).</li>' +
      '<li>Każda współrzędna żółwia musi mieścić się w przedziale od <strong>−100 000</strong> do <strong>100 000</strong>.</li>' +
      '<li>Grubość pióra: liczba całkowita od <strong>1</strong> do <strong>12</strong>. Liczba powtórzeń: liczba całkowita od <strong>0</strong> do <strong>10 000</strong>.</li>' +
      '</ul>',
    entries: [],
  },

  // ───────────────────────────── Błędy
  {
    id: 'bledy',
    title: 'Błędy',
    intro:
      '<p>Gdy coś jest nie tak, Logomocja wyświetla komunikat z <strong>numerem wiersza i kolumny</strong> (liczonymi od 1) miejsca, w którym znalazła problem. Zły argument wskazuje pierwszym znakiem tego argumentu. Brakujący argument – tym, co stoi na jego miejscu, albo samym poleceniem, jeśli program się na nim kończy.</p>' +
      '<p>Błędy są dwojakiego rodzaju:</p>' +
      '<ul>' +
      '<li><strong>Błędy w zapisie programu</strong> (np. nieznane polecenie, brakujący nawias, zła liczba argumentów, brak <code>już</code>, nieznana nazwa, zły kolor). Cały program jest sprawdzany przed rysowaniem, więc w takim przypadku <strong>nic się nie rysuje</strong>. Tu wykrywane są też zła grubość lub liczba powtórzeń, jeśli wpisano je wprost jako liczbę.</li>' +
      '<li><strong>Błędy w trakcie działania</strong> (np. dzielenie przez zero, odczyt zmiennej bez wartości, przekroczenie limitu, zła grubość lub liczba powtórzeń obliczona z wyrażenia ze zmienną). Program zatrzymuje się, ale <strong>to, co zdążył narysować, zostaje</strong>.</li>' +
      '</ul>',
    entries: [],
  },

  // ───────────────────────────── Skróty klawiszowe
  {
    id: 'skroty',
    title: 'Skróty klawiszowe',
    intro:
      '<p><strong>Sterowanie programem</strong></p>' +
      '<ul>' +
      '<li><kbd>Ctrl</kbd>+<kbd>Enter</kbd> (na Macu <kbd>⌘</kbd>+<kbd>Enter</kbd>) – Uruchom</li>' +
      '<li><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Enter</kbd> lub <kbd>F10</kbd> – Krok</li>' +
      '<li><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Spacja</kbd> lub <kbd>F8</kbd> – Pauza / Wznów</li>' +
      '<li><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> – Reset</li>' +
      '</ul>' +
      '<p><strong>Edytor</strong></p>' +
      '<ul>' +
      '<li><kbd>Tab</kbd> wstawia wcięcie.</li>' +
      '<li>Żeby opuścić edytor klawiaturą, naciśnij <kbd>Esc</kbd>, a potem <kbd>Tab</kbd>.</li>' +
      '</ul>' +
      '<p><strong>Rysunek</strong></p>' +
      '<ul>' +
      '<li>Przeciąganie – przesuwa widok (2D) lub obraca go wokół rysunku (3D).</li>' +
      '<li>Kółko myszy lub gest szczypania – przybliża i oddala.</li>' +
      '<li>Strzałki – przesuwają widok (2D) lub obracają go (3D; z <kbd>Shift</kbd> przesuwają).</li>' +
      '<li><kbd>+</kbd> i <kbd>−</kbd> – przybliżają i oddalają.</li>' +
      '<li><kbd>0</kbd> – dopasowuje widok do rysunku.</li>' +
      '<li>Dwuklik – dopasowuje widok do rysunku (2D).</li>' +
      '</ul>',
    entries: [],
  },
];
