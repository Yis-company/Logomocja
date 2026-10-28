import type { Mode } from '../lang';

export interface RefExample {
  code: string;
  mode: Mode;
}

export interface CommandDoc {
  id: string;
  /** Pisownia polska (pierwsza: główna), bez ogonków itd. */
  polish: string[];
  english: string[];
  /** Składnia, np. „np wyrażenie”. */
  syntax: string;
  summary: string;
  details?: string[];
  example: RefExample;
  only3d?: boolean;
}

export const COMMAND_DOCS: CommandDoc[] = [
  {
    id: 'np',
    polish: ['np', 'naprzód', 'naprzod'],
    english: ['fd', 'forward'],
    syntax: 'np wyrażenie',
    summary: 'Przesuwa żółwia do przodu o podaną odległość.',
    details: [
      'Gdy pióro jest opuszczone, a położenie się zmienia, żółw rysuje prosty odcinek kolorem i grubością bieżącego pióra. Ruch o zero niczego nie rysuje.',
      'Ujemna odległość cofa żółwia, tak jak polecenie `ws`.',
    ],
    example: { code: 'np 100\npw 90\nnp 50', mode: '2d' },
  },
  {
    id: 'ws',
    polish: ['ws', 'wstecz'],
    english: ['bk', 'back'],
    syntax: 'ws wyrażenie',
    summary: 'Przesuwa żółwia do tyłu (wstecz) o podaną odległość, nie zmieniając kierunku.',
    example: { code: 'np 80\nws 30\npw 90\nnp 40', mode: '2d' },
  },
  {
    id: 'pw',
    polish: ['pw', 'prawo'],
    english: ['rt', 'right'],
    syntax: 'pw wyrażenie',
    summary: 'Obraca żółwia w prawo o podaną liczbę stopni (zgodnie z ruchem wskazówek zegara, patrząc z góry).',
    details: ['Kąt może być dowolną liczbą dziesiętną; ujemny kąt obraca w drugą stronę.'],
    example: { code: 'np 80\npw 60\nnp 80\npw 120\nnp 80', mode: '2d' },
  },
  {
    id: 'lw',
    polish: ['lw', 'lewo'],
    english: ['lt', 'left'],
    syntax: 'lw wyrażenie',
    summary: 'Obraca żółwia w lewo o podaną liczbę stopni.',
    example: { code: 'np 80\nlw 45\nnp 80\nlw 90\nnp 80', mode: '2d' },
  },
  {
    id: 'pod',
    polish: ['pod', 'podnieś', 'podnies'],
    english: ['pu', 'penup'],
    syntax: 'pod',
    summary: 'Podnosi pióro. Żółw porusza się dalej, ale nie zostawia śladu.',
    example: { code: 'np 40\npod\nnp 40\nopu\nnp 40', mode: '2d' },
  },
  {
    id: 'opu',
    polish: ['opu', 'opuść', 'opusc'],
    english: ['pd', 'pendown'],
    syntax: 'opu',
    summary: 'Opuszcza pióro. Od tej chwili ruch żółwia zostawia ślad. Na początku programu pióro jest opuszczone.',
    example: { code: 'pod\nnp 40\nopu\npw 90\nnp 60', mode: '2d' },
  },
  {
    id: 'kolor',
    polish: ['kolor'],
    english: ['color'],
    syntax: 'kolor "#rrggbb"',
    summary: 'Ustawia kolor pióra. Kolor zapisuje się w cudzysłowie jako sześć cyfr szesnastkowych poprzedzonych znakiem #.',
    details: ['Wielkość liter w cyfrach nie ma znaczenia. Kolor obowiązuje do następnej zmiany. Domyślny kolor to #16866a.'],
    example: { code: 'kolor "#c1763d"\nnp 60\nkolor "#2b6fb3"\npw 90\nnp 60', mode: '2d' },
  },
  {
    id: 'grubosc',
    polish: ['grubość', 'grubosc'],
    english: ['width'],
    syntax: 'grubość wyrażenie',
    summary: 'Ustawia grubość pióra: liczba całkowita od 1 do 12. Domyślna grubość to 3.',
    details: ['Wartość spoza zakresu albo niecałkowita jest błędem. Gdy grubość zapisano samymi liczbami, błąd zgłaszany jest jeszcze przed uruchomieniem programu.'],
    example: { code: 'grubosc 1\nnp 50\ngrubosc 6\npw 90\nnp 50\ngrubosc 12\npw 90\nnp 50', mode: '2d' },
  },
  {
    id: 'powtorz',
    polish: ['powtórz', 'powtorz'],
    english: ['repeat'],
    syntax: 'powtórz wyrażenie [ polecenia ]',
    summary: 'Wykonuje polecenia w nawiasach kwadratowych podaną liczbę razy.',
    details: [
      'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000; zero oznacza, że blok nie wykona się wcale.',
      'W bloku może być cokolwiek: kolejne powtórz, warunki, wywołania procedur. W bloku można użyć wartości `nrpowt`.',
    ],
    example: { code: 'powtorz 6 [np 60 pw 60]', mode: '2d' },
  },
  {
    id: 'nrpowt',
    polish: ['nrpowt'],
    english: ['repcount'],
    syntax: 'nrpowt',
    summary: 'To wartość, a nie polecenie: numer bieżącego obiegu najbliższego otaczającego powtórz, licząc od 1.',
    details: [
      '`nrpowt` odnosi się do powtórz, które otacza go w zapisie programu. Użyte w procedurze poza jakimkolwiek powtórz (nawet jeśli procedurę wywołano z wnętrza powtórz) lub na najwyższym poziomie poza powtórz jest błędem składni.',
    ],
    example: { code: 'powtorz 12 [\n  np nrpowt * 8\n  pw 90\n]', mode: '2d' },
  },
  {
    id: 'niech',
    polish: ['niech'],
    english: ['let'],
    syntax: 'niech nazwa wyrażenie',
    summary: 'Przypisuje wartość wyrażenia zmiennej. Kolejne niech zmienia wartość.',
    details: ['Zmienna nie może mieć nazwy polecenia ani procedury. Zasięg zmiennych opisano w sekcji „Zmienne”.'],
    example: { code: 'niech bok 40\npowtorz 5 [\n  np bok\n  pw 90\n  niech bok bok + 20\n]', mode: '2d' },
  },
  {
    id: 'jesli',
    polish: ['jeśli', 'jesli'],
    english: ['if'],
    syntax: 'jeśli warunek [ polecenia ]',
    summary: 'Wykonuje blok tylko wtedy, gdy warunek jest prawdziwy.',
    details: ['Warunek ma postać `wyrażenie porównanie wyrażenie`, np. `x < 10`.'],
    example: { code: 'powtorz 8 [\n  np 30\n  jeśli nrpowt > 4 [kolor "#c1763d"]\n  pw 45\n]', mode: '2d' },
  },
  {
    id: 'jezeli',
    polish: ['jeżeli', 'jezeli'],
    english: ['ifelse'],
    syntax: 'jeżeli warunek [ gdy prawda ] [ w przeciwnym razie ]',
    summary: 'Wykonuje pierwszy blok, gdy warunek jest prawdziwy, a w przeciwnym razie drugi.',
    example: {
      code: 'powtorz 10 [\n  jeżeli nrpowt < 6 [kolor "#16866a"] [kolor "#a478c0"]\n  np 40\n  pw 36\n]',
      mode: '2d',
    },
  },
  {
    id: 'stop',
    polish: ['stop'],
    english: ['stop'],
    syntax: 'stop',
    summary: 'Kończy bieżące wywołanie procedury; na najwyższym poziomie kończy cały program.',
    details: ['`stop` wewnątrz powtórz lub warunku kończy otaczającą procedurę (albo program), a nie tylko blok.'],
    example: { code: 'powtorz 10 [\n  np 20\n  pw 30\n  jeśli nrpowt = 6 [stop]\n]', mode: '2d' },
  },
  {
    id: 'dom',
    polish: ['dom'],
    english: ['home'],
    syntax: 'dom',
    summary: 'Odsyła żółwia do początku układu i przywraca kierunek początkowy.',
    details: [
      'Jeśli pióro jest opuszczone, a żółw nie był już w początku układu, rysowany jest odcinek powrotu. Kolor, grubość i stan pióra się nie zmieniają.',
    ],
    example: { code: 'np 80\npw 90\nnp 50\ndom\npw 90\nnp 30', mode: '2d' },
  },
  {
    id: 'czysc',
    polish: ['czyść', 'czysc'],
    english: ['cs', 'clearscreen'],
    syntax: 'czyść',
    summary: 'Usuwa z rysunku wszystkie dotychczas narysowane odcinki. Położenie i ustawienia żółwia pozostają bez zmian.',
    example: { code: 'powtorz 4 [np 60 pw 90]\nczyść\npw 45\npowtorz 4 [np 60 pw 90]', mode: '2d' },
  },
  {
    id: 'gora',
    polish: ['góra', 'gora'],
    english: ['pitchup'],
    syntax: 'góra wyrażenie',
    summary: 'Unosi nos żółwia o podaną liczbę stopni (tylko w trybie 3D).',
    details: ['Kierunek obraca się ku górze żółwia wokół jego prawej strony; góra obraca się razem z nim. Po `góra 90` żółw patrzy tam, gdzie wcześniej była jego góra.'],
    only3d: true,
    example: { code: 'np 60\ngora 90\nnp 60\ngora 90\nnp 60', mode: '3d' },
  },
  {
    id: 'dol',
    polish: ['dół', 'dol'],
    english: ['pitchdown'],
    syntax: 'dół wyrażenie',
    summary: 'Opuszcza nos żółwia o podaną liczbę stopni (tylko w trybie 3D).',
    only3d: true,
    example: { code: 'np 60\ndol 90\nnp 60\ndol 90\nnp 60', mode: '3d' },
  },
  {
    id: 'pp',
    polish: ['pp', 'przechylprawo'],
    english: ['rr', 'rollright'],
    syntax: 'pp wyrażenie',
    summary: 'Przechyla żółwia w prawo wokół kierunku ruchu (tylko w trybie 3D).',
    details: [
      'Kierunek ruchu się nie zmienia. Góra żółwia obraca się ku jego prawej stronie, więc po `pp 90` górą żółwia jest dawna prawa strona, a prawą – dawny dół.',
    ],
    only3d: true,
    example: { code: 'pp 90\ngora 90\nnp 80\npw 90\nnp 80', mode: '3d' },
  },
  {
    id: 'pl',
    polish: ['pl', 'przechyllewo'],
    english: ['rl', 'rollleft'],
    syntax: 'pl wyrażenie',
    summary: 'Przechyla żółwia w lewo wokół kierunku ruchu (tylko w trybie 3D).',
    only3d: true,
    example: { code: 'pl 90\ngora 90\nnp 80\npw 90\nnp 80', mode: '3d' },
  },
];

export type Block =
  | { t: 'p'; text: string }
  | { t: 'code'; code: string; mode: Mode }
  | { t: 'list'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'note'; text: string }
  | { t: 'axes' };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export const SECTIONS: Section[] = [
  {
    id: 'wstep',
    title: 'Wstęp: żółw i układ współrzędnych',
    blocks: [
      {
        t: 'p',
        text: 'Logomocja to pracownia języka Logo. Piszesz program, a **żółw** wykonuje go polecenie po poleceniu, rysując za sobą linię. Tryb **2D** to rysowanie na płaszczyźnie, tryb **3D** – w przestrzeni.',
      },
      {
        t: 'p',
        text: 'Układ współrzędnych jest prawoskrętny: oś **X** biegnie w prawo, oś **Y** „do przodu” (na kartce – w górę), a oś **Z** z kartki do góry. Płaszczyzna 2D to płaszczyzna XY (z = 0).',
      },
      { t: 'axes' },
      {
        t: 'list',
        items: [
          'Żółw zaczyna w punkcie (0, 0, 0) i patrzy w stronę +Y. Jego prawa strona to +X, a góra to +Z.',
          'Na początku pióro jest opuszczone, kolor to `#16866a`, a grubość kreski 3.',
          'Program złożony wyłącznie z poleceń płaskich daje dokładnie ten sam rysunek w trybie 2D i 3D.',
        ],
      },
      { t: 'code', code: '; pierwszy program\npowtorz 4 [np 100 pw 90]', mode: '2d' },
    ],
  },
  {
    id: 'zapis',
    title: 'Zasady zapisu',
    blocks: [
      {
        t: 'list',
        items: [
          '**Wielkość liter** w nazwach poleceń, procedur, zmiennych i parametrów nie ma znaczenia: `NP`, `Np` i `np` to to samo.',
          '**Aliasy.** Każde polecenie ma nazwę polską z ogonkami, bez ogonków i angielską, np. `naprzód`, `naprzod`, `np`, `fd`, `forward`. Wszystkie są równoważne.',
          '**Białe znaki** (spacje, tabulatory, nowe wiersze) rozdzielają elementy. Nowy wiersz ma znaczenie tylko w nagłówku procedury i przy słowie kończącym `już`.',
          '**Komentarz** zaczyna się średnikiem i trwa do końca wiersza.',
          '**Liczby** to niepodpisane liczby dziesiętne: `80`, `12.5`, `.5`. Znak minus lub plus jest operatorem. Zapisy `1e3`, `0x10`, `NaN` czy `Infinity` są błędami.',
          '**Kolor** to napis w cudzysłowie: `"#16866a"`.',
          '**Nawiasy kwadratowe** `[` `]` otaczają bloki poleceń (powtórz, jeśli, jeżeli) i mogą się zagnieżdżać, **okrągłe** `(` `)` grupują wyrażenia.',
        ],
      },
      {
        t: 'code',
        code: '; wszystkie cztery wiersze robią to samo\nnp 50\nNAPRZÓD 50\nfd 50\nForward 50',
        mode: '2d',
      },
    ],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    blocks: [
      {
        t: 'p',
        text: 'Wszędzie, gdzie polecenie przyjmuje liczbę, można podać **wyrażenie**: liczbę, nazwę (parametr lub zmienną, także w dawnej postaci `:nazwa`), `nrpowt`, wyrażenie w nawiasach, jednoargumentowy `-` lub `+` albo dwa wyrażenia połączone `+`, `-`, `*` lub `/`.',
      },
      {
        t: 'table',
        head: ['Operator', 'Znaczenie', 'Priorytet'],
        rows: [
          ['`*` `/`', 'mnożenie, dzielenie', 'wyższy'],
          ['`+` `-`', 'dodawanie, odejmowanie', 'niższy'],
          ['`-x` `+x`', 'znak liczby (można układać w stos: `- -2`)', 'najwyższy'],
        ],
      },
      {
        t: 'p',
        text: 'Operatory o jednakowym priorytecie łączą się od lewej: `np 20 - 5 - 3` przesuwa żółwia o 12, a `np 2 + 3 * 4` o 14.',
      },
      {
        t: 'note',
        text: '**Odstępy wokół operatora.** Operator `+ - * /` musi mieć białe znaki po obu stronach albo po żadnej: `np 10 - 5` i `np 10-5` przesuwają o 5. Zapis `np 10 -5` to polecenie `np 10` i błędny, zbłąkany element `-5`. Dzięki temu w wywołaniach procedur `f 10 -5` oznacza dwa argumenty: 10 i −5.',
      },
      { t: 'code', code: 'np 20 - 5 - 3\npw 90\nnp (2 + 3) * 10\npw 90\nnp -(3 - 5) * 10', mode: '2d' },
      {
        t: 'p',
        text: '**Warunek** ma postać `wyrażenie porównanie wyrażenie`, gdzie porównanie to `<`, `>`, `=`, `<=`, `>=` lub `<>` (różne). Porównania są dokładne, więc `0.1 + 0.2 = 0.3` jest fałszem. Dla porównań nie obowiązuje reguła odstępów.',
      },
      {
        t: 'p',
        text: 'Dzielenie przez zero i każdy nieskończony wynik są błędami wykonania. Samo obliczanie wyrażenia nie jest liczone jako wykonana operacja.',
      },
    ],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    blocks: [
      {
        t: 'p',
        text: 'Polecenie `niech nazwa wyrażenie` przypisuje wartość. Nazwa nie może być słowem zastrzeżonym (poleceniem, `nrpowt`, `oto`, `już`…) ani nazwą procedury.',
      },
      {
        t: 'list',
        items: [
          '`niech` na najwyższym poziomie tworzy lub zmienia **zmienną globalną**.',
          '`niech` wewnątrz procedury tworzy lub zmienia **zmienną lokalną** tego wywołania. Przesłania ona globalną o tej samej nazwie do końca wywołania i znika razem z nim. W ten sam sposób można zmienić parametr.',
          'Nazwę wolno użyć w wyrażeniu, jeśli jest parametrem procedury, jest przypisywana poleceniem `niech` gdziekolwiek w tej procedurze albo gdziekolwiek na najwyższym poziomie (także później w tekście). Inna nazwa to błąd składni.',
          'Odczyt zmiennej, która na bieżącej ścieżce nie ma jeszcze wartości, jest błędem wykonania.',
        ],
      },
      {
        t: 'code',
        code: 'niech bok 30\npowtorz 6 [\n  np bok\n  pw 90\n  niech bok bok + 15\n]',
        mode: '2d',
      },
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    blocks: [
      {
        t: 'p',
        text: '`jeśli warunek [ … ]` wykonuje blok, gdy warunek jest prawdziwy. `jeżeli warunek [ … ] [ … ]` wykonuje pierwszy blok, gdy warunek jest prawdziwy, a w przeciwnym razie drugi. Bloki mogą zawierać dowolne polecenia, także zagnieżdżone warunki.',
      },
      {
        t: 'code',
        code: 'niech zmiana 1\npowtorz 20 [\n  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]\n  niech zmiana -zmiana\n  np 10 + nrpowt * 3\n  pw 72\n]',
        mode: '2d',
      },
    ],
  },
  {
    id: 'powtarzanie',
    title: 'Powtarzanie i nrpowt',
    blocks: [
      {
        t: 'p',
        text: '`powtórz n [ … ]` wykonuje blok `n` razy; `n` musi być liczbą całkowitą od 0 do 10000. Wewnątrz bloku `nrpowt` oznacza numer bieżącego obiegu najbliższego otaczającego powtórz (od 1). Ustalane jest to według zapisu programu, a nie według kolejności wywołań.',
      },
      {
        t: 'code',
        code: 'powtorz 3 [\n  powtorz 4 [np 40 pw 90]\n  pw nrpowt * 40\n]',
        mode: '2d',
      },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    blocks: [
      {
        t: 'p',
        text: 'Własne polecenia definiuje się słowem `oto` (lub `to`) na początku wiersza, po którym podaje się nazwę i, opcjonalnie, `ma:` z listą parametrów oddzielonych przecinkami. Treść zajmuje kolejne wiersze, a kończy ją słowo `już` (lub `juz`, `end`) samotnie w osobnym wierszu.',
      },
      {
        t: 'code',
        code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90\npw 45\nkwadrat 40 * 2 90',
        mode: '2d',
      },
      {
        t: 'list',
        items: [
          'Dawny zapis nagłówka `oto kwadrat :bok :kąt` też działa, a parametr w treści może być zapisany jako `:bok` lub `bok`.',
          'Wywołanie podaje argumenty po kolei, oddzielone białymi znakami, dokładnie tyle, ile jest parametrów. Każdy argument jest wyrażeniem: `kwadrat 40 * 2 90` przekazuje 80 i 90.',
          'Parametr może mieć nazwę procedury: na początku polecenia nazwa jest wywołaniem, a w miejscu argumentu – parametrem.',
          'Definicje są tylko na najwyższym poziomie (nie w powtórz, warunku ani innej procedurze), mogą stać przed wywołaniami lub po nich, a nazwę można zdefiniować tylko raz.',
          'Procedura może wywoływać samą siebie, bezpośrednio lub przez inne procedury. `stop` kończy bieżące wywołanie.',
          'Procedury nie zwracają wartości.',
        ],
      },
      {
        t: 'code',
        code: '; rekurencja: spirala kwadratowa\noto spirala ma: bok\n  jeśli bok > 100 [stop]\n  np bok\n  pw 90\n  spirala bok + 5\njuż\n\nspirala 5',
        mode: '2d',
      },
    ],
  },
  {
    id: 'trzy-wymiary',
    title: 'Żółw w przestrzeni (3D)',
    blocks: [
      {
        t: 'p',
        text: 'W trybie 3D żółw ma trzy prostopadłe kierunki: **nos** (kierunek ruchu), **prawą stronę** i **górę**. Polecenia obracają je tak:',
      },
      {
        t: 'table',
        head: ['Polecenie', 'Co się obraca'],
        rows: [
          ['`pw` `lw`', 'nos obraca się w prawo/lewo wokół góry żółwia (prawa strona podąża za nosem)'],
          ['`góra` `dół`', 'nos obraca się ku górze/w dół wokół prawej strony (góra podąża za nosem)'],
          ['`pp` `pl`', 'góra obraca się ku prawej/lewej stronie wokół nosa; nos pozostaje bez zmian'],
        ],
      },
      {
        t: 'p',
        text: 'W trybie 2D polecenia `góra`, `dół`, `pp` i `pl` są błędem składni. W trybie 3D kamerę obracasz przeciągnięciem, przesuwasz przeciągnięciem z klawiszem Shift (lub prawym przyciskiem), a przybliżasz kółkiem myszy lub szczypnięciem.',
      },
      {
        t: 'code',
        code: 'kolor "#a478c0"\ngora 30\npowtorz 36 [np 12 pw 10]',
        mode: '3d',
      },
    ],
  },
  {
    id: 'bledy',
    title: 'Błędy i limity',
    blocks: [
      {
        t: 'p',
        text: 'Każdy błąd ma numer wiersza i kolumny oraz opis po polsku. Program jest sprawdzany w całości przed uruchomieniem: **błąd składni** (nieznane polecenie, brakujący argument, zły kolor, niezamknięty nawias, zła liczba argumentów procedury, nieznana nazwa, `nrpowt` poza powtórz, polecenie 3D w trybie 2D…) nie pozwala niczego narysować. **Błąd wykonania** (dzielenie przez zero, zmienna bez wartości, grubość lub liczba powtórzeń obliczona z nazw, przekroczony limit) zatrzymuje program, a to, co już narysowano, zostaje.',
      },
      {
        t: 'p',
        text: 'Szerokość pióra i liczba powtórzeń zapisane samymi liczbami (bez nazw) są sprawdzane już przy analizie programu. Błąd w argumencie wskazuje jego pierwszy element, a brakujący argument – miejsce, w którym powinien być.',
      },
      {
        t: 'table',
        head: ['Limit', 'Wartość'],
        rows: [
          ['Długość programu', '50 000 znaków'],
          ['Liczba tokenów (łącznie z operatorami, nawiasami i przecinkami)', '10 000'],
          ['Zagnieżdżenie nawiasów kwadratowych', '32'],
          ['Jednocześnie aktywne wywołania procedur i powtórz', '32'],
          ['Wykonane operacje (każde polecenie, niech, warunek, powtórz, wywołanie; plus jedna za zakończenie obiegu powtórz, bloku warunku i wywołania)', '10 000'],
          ['Zachowane odcinki rysunku', '10 000'],
          ['Współrzędne', '±100 000'],
          ['Liczba powtórzeń', '0–10 000'],
          ['Grubość pióra', '1–12 (liczba całkowita)'],
        ],
      },
    ],
  },
];
