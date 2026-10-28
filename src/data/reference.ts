import type { Mode } from '../lang';

/** One documented item: a command, a rule or a limit, with an optional runnable example. */
export interface ReferenceItem {
  id: string;
  /** Heading, e.g. "np". */
  title: string;
  /** Aliases and argument, e.g. "naprzód, fd, forward · liczba". */
  signature?: string;
  /** Paragraphs of explanation in Polish. */
  text: string[];
  example?: { code: string; mode: Mode; caption?: string };
}

export interface ReferenceSection {
  id: string;
  title: string;
  intro?: string[];
  items: ReferenceItem[];
}

export const REFERENCE: readonly ReferenceSection[] = [
  {
    id: 'start',
    title: 'Szybki start',
    intro: [
      'Logomocja to studio do rysowania żółwiem. Piszesz program w edytorze, naciskasz Uruchom (Alt+U), a żółw rysuje na płaszczyźnie (tryb 2D) albo w przestrzeni (tryb 3D).',
      'Każde polecenie ma polską i angielską nazwę. Wielkość liter nie ma znaczenia, a polskie znaki można zapisywać także bez ogonków: naprzod i naprzód to to samo.',
      'Komentarz zaczyna się średnikiem i ciągnie się do końca wiersza.',
    ],
    items: [
      {
        id: 'pierwszy-rysunek',
        title: 'Pierwszy rysunek',
        text: ['Ten program rysuje kwadrat. Powtórz cztery razy: idź naprzód o 100 i skręć w prawo o 90 stopni.'],
        example: { code: 'powtorz 4 [\n  np 100\n  pw 90\n]\n', mode: '2d', caption: 'Kwadrat' },
      },
    ],
  },
  {
    id: 'ruch',
    title: 'Ruch i rysowanie',
    intro: [
      'Żółw zaczyna w punkcie (0, 0), patrząc w górę, z opuszczonym pisakiem, kolorem #16866a i grubością 3.',
    ],
    items: [
      {
        id: 'np',
        title: 'np',
        signature: 'naprzód, naprzód, fd, forward · liczba',
        text: ['Żółw idzie naprzód o podaną odległość. Gdy pisak jest opuszczony, zostaje narysowany odcinek.'],
        example: { code: 'np 100\nnp 50\n', mode: '2d' },
      },
      {
        id: 'ws',
        title: 'ws',
        signature: 'wstecz, bk, back · liczba',
        text: ['Żółw cofa się o podaną odległość.'],
        example: { code: 'np 80\nws 30\n', mode: '2d' },
      },
      {
        id: 'pw',
        title: 'pw',
        signature: 'prawo, rt, right · kąt w stopniach',
        text: ['Obraca żółwia w prawo o podany kąt. Ujemny kąt obraca w lewo.'],
        example: { code: 'np 60\npw 90\nnp 60\n', mode: '2d' },
      },
      {
        id: 'lw',
        title: 'lw',
        signature: 'lewo, lt, left · kąt w stopniach',
        text: ['Obraca żółwia w lewo o podany kąt.'],
        example: { code: 'np 60\nlw 45\nnp 60\n', mode: '2d' },
      },
      {
        id: 'pod',
        title: 'pod',
        signature: 'podnieś, pu, penup',
        text: ['Podnosi pisak. Ruch z podniesionym pisakiem niczego nie rysuje.'],
        example: { code: 'pod np 40 opu np 40\n', mode: '2d' },
      },
      {
        id: 'opu',
        title: 'opu',
        signature: 'opuść, pd, pendown',
        text: ['Opuszcza pisak. Od tej chwili każdy ruch rysuje linię.'],
        example: { code: 'pod np 30 opu np 30\n', mode: '2d' },
      },
      {
        id: 'kolor',
        title: 'kolor',
        signature: 'color · "#rrggbb"',
        text: [
          'Ustawia kolor pisaka. Kolor to sześć cyfr szesnastkowych w cudzysłowie, na przykład "#c1763d". Wielkość liter w cyfrach nie ma znaczenia.',
        ],
        example: { code: 'kolor "#c1763d"\nnp 50\nkolor "#2b6fb3"\nnp 50\n', mode: '2d' },
      },
      {
        id: 'grubosc',
        title: 'grubosc',
        signature: 'grubość, width · liczba całkowita od 1 do 12',
        text: ['Ustawia grubość linii w pikselach. Liczba musi być całkowita i mieścić się w zakresie od 1 do 12.'],
        example: { code: 'grubosc 1\nnp 60\ngrubosc 8\nnp 60\n', mode: '2d' },
      },
      {
        id: 'dom',
        title: 'dom',
        signature: 'home',
        text: [
          'Wraca do punktu (0, 0) i do pierwotnego kierunku. Jeśli pisak jest opuszczony, po drodze rysuje odcinek. Kolor, grubość i stan pisaka pozostają bez zmian.',
        ],
        example: { code: 'pw 90\nnp 80\ndom\nnp 40\n', mode: '2d' },
      },
      {
        id: 'cs',
        title: 'cs',
        signature: 'czyść, czysc, clearscreen',
        text: [
          'Usuwa wszystkie narysowane odcinki. Żółw zostaje tam, gdzie był, i nie zmienia kierunku ani koloru.',
        ],
        example: { code: 'np 80\npw 90\ncs\nnp 80\n', mode: '2d' },
      },
    ],
  },
  {
    id: 'powtarzanie',
    title: 'Powtarzanie',
    items: [
      {
        id: 'powtorz',
        title: 'powtorz',
        signature: 'powtórz, repeat · liczba od 0 do 10 000, potem [polecenia]',
        text: [
          'Wykonuje podane polecenia tyle razy, ile wynosi liczba. Zero oznacza, że nic się nie wykona. Treść może zawierać inne powtórzenia, warunki i wywołania procedur.',
        ],
        example: { code: 'powtorz 6 [\n  np 50\n  pw 60\n]\n', mode: '2d', caption: 'Sześciokąt' },
      },
      {
        id: 'nrpowt',
        title: 'nrpowt',
        signature: 'repcount · wartość',
        text: [
          'Numer bieżącego obrotu najbliższego powtórzenia, liczony od 1. Można go użyć tylko wewnątrz bloku powtórz. Procedura, która go używa, musi mieć własne powtórzenie.',
        ],
        example: { code: 'powtorz 5 [\n  np nrpowt * 20\n  pw 90\n]\n', mode: '2d' },
      },
    ],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    items: [
      {
        id: 'niech',
        title: 'niech',
        signature: 'let · nazwa wyrażenie',
        text: [
          'Przypisuje wartość wyrażenia do zmiennej. Kolejne niech tej samej nazwy zmienia wartość.',
          'Zmienna utworzona na poziomie głównym jest globalna i widoczna w całym programie. Zmienna utworzona w procedurze jest lokalna dla jednego wywołania: przesłania zmienną globalną o tej samej nazwie i znika, gdy wywołanie się kończy.',
          'Z nazwą można pracować w wyrażeniu tylko wtedy, gdy została przypisana poleceniem niech albo jest parametrem procedury.',
        ],
        example: { code: 'niech bok 40\npowtorz 4 [\n  np bok\n  pw 90\n  niech bok bok + 10\n]\n', mode: '2d' },
      },
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    items: [
      {
        id: 'jesli',
        title: 'jeśli',
        signature: 'if · warunek [polecenia]',
        text: [
          'Wykonuje blok, gdy warunek jest spełniony. Warunek to wyrażenie, porównanie i wyrażenie, na przykład x > 0.',
          'Porównania: = (równe), <> (różne), < , >, <=, >=. Porównania są dokładne: 0.1 + 0.2 = 0.3 jest fałszem.',
        ],
        example: { code: 'niech x 3\njeśli x > 2 [kolor "#16866a" np 50]\n', mode: '2d' },
      },
      {
        id: 'jezeli',
        title: 'jeżeli',
        signature: 'ifelse · warunek [polecenia] [polecenia]',
        text: ['Gdy warunek jest spełniony, wykonuje pierwszy blok; w przeciwnym razie drugi.'],
        example: {
          code: 'powtorz 6 [\n  jeżeli nrpowt < 4 [kolor "#16866a"] [kolor "#c1763d"]\n  np 40\n  pw 60\n]\n',
          mode: '2d',
        },
      },
      {
        id: 'stop-warunek',
        title: 'stop',
        signature: 'stop',
        text: [
          'Kończy bieżące wywołanie procedury. Na poziomie głównym kończy cały program. Wewnątrz powtórzenia lub warunku kończy też całą procedurę, a nie tylko blok.',
        ],
        example: {
          code: 'oto kawałek\n  np 50\n  stop\n  np 99\njuz\n\nkawałek\nnp 10\n',
          mode: '2d',
          caption: 'Procedura kończy się na stop, a program jedzie dalej',
        },
      },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    intro: [
      'Procedura to nazwana grupa poleceń. Definicja zaczyna się słowem oto na początku wiersza, po nim idzie nazwa i opcjonalnie ma: z listą parametrów oddzieloną przecinkami. Ciało ma kolejne wiersze, a kończy je słowo już, samo w wierszu.',
      'Definicje są tylko na poziomie głównym: nie można ich umieścić w powtórzeniu, w warunku ani w innej procedurze. Można je umieścić przed wywołaniem albo po nim.',
    ],
    items: [
      {
        id: 'oto',
        title: 'oto … już',
        signature: 'to · end',
        text: [
          'Każdy parametr można w ciele zapisać zwykłą nazwą albo w starszej formie :nazwa. Starszy nagłówek bez przecinków też działa: oto kwadrat :bok :kąt.',
          'Wywołanie podaje argumenty po spacji, dokładnie tyle, ile procedura ma parametrów. Argumentem może być całe wyrażenie: kwadrat 40 * 2 90 przekaże 80 i 90.',
          'Nazwa procedury nie może być słowem zarezerwowanym, a każda procedura może być zdefiniowana tylko raz.',
        ],
        example: {
          code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuz\n\nkwadrat 80 90\n',
          mode: '2d',
        },
      },
      {
        id: 'rekurencja',
        title: 'Rekurencja',
        text: [
          'Procedura może wywoływać samą siebie, także pośrednio. Warunek z jeśli kończy rekurencję. Naraz działa najwyżej 32 wywołań procedur i powtórzeń.',
        ],
        example: {
          code: 'oto gałąź ma: dł\n  jeśli dł < 6 [stop]\n  np dł\n  lw 30\n  gałąź dł * 0.7\n  pw 60\n  gałąź dł * 0.7\n  lw 30\n  ws dł\njuz\n\ngałąź 80\n',
          mode: '2d',
        },
      },
    ],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    items: [
      {
        id: 'dzialania',
        title: 'Działania',
        signature: '+ − * /',
        text: [
          'Mnożenie i dzielenie wiążą silniej niż dodawanie i odejmowanie. Działania tej samej wagi wykonują się od lewej: np 20 - 5 - 3 przesunie żółwia o 12, a np 2 + 3 * 4 o 14.',
          'Nawiasy grupują wyrażenia. Liczby zapisuje się jako 12, 12.5 albo .5. Znak minus przed liczbą lub nazwą to znak jednoargumentowy: np -bok, np - -2, np -(3 - 5).',
          'Operator dwuargumentowy musi mieć spacje po obu stronach albo po żadnej: np 10 - 5 i np 10-5 są równe. Zapis np 10 -5 jest błędem, bo minus ma spację tylko z jednej strony.',
        ],
        example: { code: 'np 2 + 3 * 4\nnp 10-5\nnp -(3 - 5)\n', mode: '2d' },
      },
      {
        id: 'liczby',
        title: 'Liczby',
        text: [
          'Liczby są zawsze dodatnie w zapisie, a znak podaje się operatorem. Zapisy 1e3, 0x10, NaN i Infinity są błędami. Dzielenie przez zero i wynik, który nie jest liczbą skończoną, zatrzymują program w miejscu błędu.',
        ],
      },
    ],
  },
  {
    id: 'trzeci-wymiar',
    title: 'Tryb 3D',
    intro: [
      'W trybie 3D żółw ma kierunek, prawą stronę i górę. Układ jest prawoskrętny: +X w prawo, +Y naprzód (na ekranie w górę), +Z do góry. Na początku żółw patrzy w +Y, jego prawa strona wskazuje +X, a góra to +Z.',
      'Polecenia gora, dol, pp i pl działają tylko w trybie 3D. Programy złożone z samych poleceń płaskich dają w obu trybach te same współrzędne.',
    ],
    items: [
      {
        id: 'gora',
        title: 'gora',
        signature: 'góra, pitchup · kąt',
        text: ['Podnosi nos żółwia o podany kąt. Kierunek obraca się ku górze, a góra ku tyłowi. Po gora 90 żółw leci w górę.'],
        example: { code: 'gora 90\nnp 80\n', mode: '3d' },
      },
      {
        id: 'dol',
        title: 'dol',
        signature: 'dół, pitchdown · kąt',
        text: ['Opuszcza nos żółwia o podany kąt, czyli obraca w przeciwną stronę niż gora.'],
        example: { code: 'dol 45\nnp 80\n', mode: '3d' },
      },
      {
        id: 'pp',
        title: 'pp',
        signature: 'przechylprawo, rr, rollright · kąt',
        text: ['Przechyla żółwia w prawo wokół kierunku: góra obraca się w stronę prawej strony. Kierunek się nie zmienia.'],
        example: { code: 'pp 90\ngora 90\nnp 80\n', mode: '3d' },
      },
      {
        id: 'pl',
        title: 'pl',
        signature: 'przechyllewo, rl, rollleft · kąt',
        text: ['Przechyla żółwia w lewo wokół kierunku.'],
        example: { code: 'pl 90\ngora 90\nnp 80\n', mode: '3d' },
      },
    ],
  },
  {
    id: 'ograniczenia',
    title: 'Ograniczenia',
    intro: [
      'Ograniczenia chronią przeglądarkę i sprawiają, że każdy program kończy się w rozsądnym czasie. Przekroczenie któregokolwiek oznacza błąd z numerem wiersza i kolumny.',
    ],
    items: [
      {
        id: 'limity',
        title: 'Limity',
        text: [
          'Program: najwyżej 50 000 znaków i 10 000 symboli (operatory, nawiasy, przecinki liczą się jako symbole).',
          'Zagnieżdżenie nawiasów [ ]: do 32 poziomów. Naraz działa najwyżej 32 wywołań procedur i powtórzeń.',
          'Wykonanych operacji: 10 000. Liczy się każde polecenie, niech, warunek, powtórzenie i wywołanie, a także zakończenie każdego obrotu powtórzenia, bloku warunku i wywołania.',
          'Rysunek: najwyżej 10 000 odcinków i współrzędne w zakresie ±100 000.',
          'Liczba powtórzeń: od 0 do 10 000. Grubość: od 1 do 12.',
        ],
      },
    ],
  },
  {
    id: 'skroty',
    title: 'Skróty klawiszowe',
    items: [
      {
        id: 'klawisze',
        title: 'Klawisze',
        text: [
          'Alt+U — Uruchom (wznawia wstrzymany program). Ctrl+Enter (⌘+Enter na Macu) działa tak samo w edytorze.',
          'Alt+K — Krok: wykonuje jedno polecenie.',
          'Alt+P — Pauza albo wznowienie.',
          'Alt+R — Reset: czyści rysunek i zatrzymuje program.',
          'Na płótnie: strzałki przesuwają widok, + i − przybliżają i oddalają, Home dopasowuje rysunek do okna.',
        ],
      },
    ],
  },
];
