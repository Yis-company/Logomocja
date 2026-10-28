import type { Mode } from '../lang/ast';

/** Treść strony „Polecenia”: opis całego dialektu z przykładami. */

export interface RefExample {
  code: string;
  mode: Mode;
  caption?: string;
  /** Przykład celowo kończy się błędem wykonania. */
  fails?: boolean;
}

export interface RefCommand {
  id: string;
  /** Wszystkie zapisy polecenia: polskie i angielskie. */
  names: string[];
  syntax: string;
  summary: string;
  details?: string[];
  example: RefExample;
}

export type RefBlock =
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'note'; text: string }
  | { t: 'example'; example: RefExample; title?: string }
  | { t: 'table'; head: string[]; rows: string[][] }
  | { t: 'commands'; items: RefCommand[] };

export interface RefSection {
  id: string;
  title: string;
  blocks: RefBlock[];
}

const cmd = (c: RefCommand): RefCommand => c;

export const REFERENCE: RefSection[] = [
  {
    id: 'start',
    title: 'Zaczynamy',
    blocks: [
      { t: 'p', text: 'Logomocja to pracownia żółwia. Piszesz program w języku Logo, a żółw chodzi po płaszczyźnie (2D) albo po przestrzeni (3D) i zostawia ślad — rysunek. Cały program działa w przeglądarce, bez internetu i bez kont.' },
      { t: 'p', text: 'Żółw zawsze ma położenie, kierunek i stan pióra. Zaczyna w początku układu, patrzy „do przodu”, ma opuszczone pióro, kolor `#16866a` i grubość 3. Polecenia przesuwają go i obracają; gdy pióro jest opuszczone, ruch rysuje odcinek.' },
      { t: 'p', text: 'Układ współrzędnych jest prawoskrętny: oś X biegnie w prawo, oś Y do przodu (w górę ekranu), a oś Z do góry, z płaszczyzny rysunku w stronę patrzącego. Płaszczyzna 2D to płaszczyzna XY (z = 0). Żółw startuje w punkcie (0, 0, 0) zwrócony w stronę +Y; jego prawa strona to +X, a „góra” żółwia to +Z.' },
      { t: 'example', title: 'Pierwszy program', example: { mode: '2d', code: '; Kwadrat: cztery razy „krok i skręt”.\npowtorz 4 [\n  np 100   ; naprzód o 100\n  pw 90    ; w prawo o 90 stopni\n]' } },
      { t: 'p', text: 'Przełącznik 2D/3D wybiera tryb. Programy złożone tylko z poleceń płaskich dają w obu trybach te same współrzędne. Polecenia `gora`, `dol`, `pp` i `pl` istnieją tylko w trybie 3D.' },
    ],
  },
  {
    id: 'zapis',
    title: 'Zapis programu',
    blocks: [
      { t: 'list', items: [
        'Wielkość liter nie ma znaczenia: `NP 10`, `Np 10` i `np 10` znaczą to samo — także w nazwach procedur, zmiennych i parametrów.',
        'Polecenia mają zapisy z polskimi znakami i bez nich: `naprzód` i `naprzod`, `powtórz` i `powtorz`, `jeśli` i `jesli`. W nazwach własnych znaki diakrytyczne są rozróżniane: `kąt` i `kat` to dwie różne nazwy.',
        'Każde polecenie ma też nazwę angielską (`fd`, `rt`, `repeat` …) — obie wersje można mieszać w jednym programie.',
        'Spacje, tabulatory i nowe wiersze rozdzielają symbole. Nowe wiersze mają znaczenie tylko w nagłówku i zakończeniu procedury (patrz „Procedury”).',
        'Średnik zaczyna komentarz, który trwa do końca wiersza: `np 10 ; to jest komentarz`.',
        'Liczby to dziesiętne zapisy bez znaku: `80`, `12.5`, `.5`. Minus i plus są operatorami. Zapisy `1e3`, `0x10`, `NaN` i `Infinity` są błędem.',
        'Kolor zapisujemy jako tekst w cudzysłowie z sześcioma cyframi szesnastkowymi: `"#16866a"` (wielkość cyfr nie ma znaczenia).',
        'Nawiasy kwadratowe `[` `]` obejmują ciało powtórzenia lub warunku i mogą się zagnieżdżać. Nawiasy okrągłe `(` `)` grupują wyrażenia. Przecinki rozdzielają parametry w nagłówku procedury.',
      ] },
      { t: 'note', text: 'Wszystkie polecenia i ich aliasy zebrano w tabeli poniżej; szczegółowy opis każdego z przykładem znajdziesz w kolejnych rozdziałach.' },
      { t: 'table', head: ['Polecenie', 'Angielski odpowiednik', 'Argument', 'Znaczenie'], rows: [
        ['np, naprzod, naprzód', 'fd, forward', 'wyrażenie', 'Idź naprzód o podaną odległość'],
        ['ws, wstecz', 'bk, back', 'wyrażenie', 'Idź wstecz'],
        ['pw, prawo', 'rt, right', 'wyrażenie', 'Skręć w prawo o tyle stopni'],
        ['lw, lewo', 'lt, left', 'wyrażenie', 'Skręć w lewo'],
        ['pod, podnies, podnieś', 'pu, penup', '—', 'Podnieś pióro'],
        ['opu, opusc, opuść', 'pd, pendown', '—', 'Opuść pióro'],
        ['kolor', 'color', '"#rrggbb"', 'Ustaw kolor pióra'],
        ['grubosc, grubość', 'width', 'liczba całkowita 1–12', 'Ustaw grubość linii'],
        ['powtorz, powtórz', 'repeat', 'liczba 0–10000 i [ ciało ]', 'Wykonaj ciało podaną liczbę razy'],
        ['niech', 'let', 'nazwa i wyrażenie', 'Przypisz wartość zmiennej'],
        ['jeśli, jesli', 'if', 'warunek i [ ciało ]', 'Wykonaj ciało, gdy warunek jest spełniony'],
        ['jeżeli, jezeli', 'ifelse', 'warunek i dwa [ ciała ]', 'Wykonaj pierwsze ciało albo drugie'],
        ['stop', 'stop', '—', 'Zakończ procedurę (na najwyższym poziomie: program)'],
        ['dom', 'home', '—', 'Wróć do początku układu i do pierwotnej orientacji'],
        ['czyść, czysc', 'cs, clearscreen', '—', 'Zapomnij wszystkie narysowane odcinki'],
        ['gora, góra', 'pitchup', 'wyrażenie', 'Unieś nos o tyle stopni (tylko 3D)'],
        ['dol, dół', 'pitchdown', 'wyrażenie', 'Opuść nos (tylko 3D)'],
        ['pp, przechylprawo', 'rr, rollright', 'wyrażenie', 'Przechyl w prawo wokół kierunku ruchu (tylko 3D)'],
        ['pl, przechyllewo', 'rl, rollleft', 'wyrażenie', 'Przechyl w lewo (tylko 3D)'],
        ['nrpowt', 'repcount', '—', 'Wartość: numer bieżącego powtórzenia'],
        ['oto … już', 'to … end', '—', 'Definicja procedury (aliasy zakończenia: juz, end)'],
      ] },
    ],
  },
  {
    id: 'ruch',
    title: 'Ruch i obroty',
    blocks: [
      { t: 'commands', items: [
        cmd({
          id: 'np', names: ['np', 'naprzod', 'naprzód', 'fd', 'forward'], syntax: 'np odległość',
          summary: 'Przesuwa żółwia naprzód o podaną odległość, wzdłuż jego kierunku.',
          details: ['Jeśli pióro jest opuszczone i położenie się zmienia, rysowany jest odcinek w bieżącym kolorze i grubości. Ruch o zero niczego nie rysuje. Ujemna odległość cofa żółwia.'],
          example: { mode: '2d', code: 'np 100\npw 90\nnp 50' },
        }),
        cmd({
          id: 'ws', names: ['ws', 'wstecz', 'bk', 'back'], syntax: 'ws odległość',
          summary: 'Cofa żółwia o podaną odległość (to samo co „np” z liczbą przeciwną).',
          example: { mode: '2d', code: 'np 100\nws 40\npw 90\nnp 60' },
        }),
        cmd({
          id: 'pw', names: ['pw', 'prawo', 'rt', 'right'], syntax: 'pw kąt',
          summary: 'Skręca żółwia w prawo o podaną liczbę stopni (zgodnie z ruchem wskazówek zegara, patrząc z góry).',
          details: ['Kąt może być dowolną liczbą dziesiętną; wartość ujemna skręca w drugą stronę. Obrót nie rysuje, ale zmienia kierunek kolejnych ruchów.'],
          example: { mode: '2d', code: 'powtorz 3 [np 120 pw 120]' },
        }),
        cmd({
          id: 'lw', names: ['lw', 'lewo', 'lt', 'left'], syntax: 'lw kąt',
          summary: 'Skręca żółwia w lewo o podaną liczbę stopni.',
          example: { mode: '2d', code: 'powtorz 4 [np 80 lw 90]' },
        }),
        cmd({
          id: 'dom', names: ['dom', 'home'], syntax: 'dom',
          summary: 'Przenosi żółwia do początku układu i przywraca pierwotną orientację.',
          details: ['Jeśli pióro jest opuszczone, a żółw nie stoi jeszcze w początku, rysowany jest odcinek powrotny. Stan pióra, kolor i grubość pozostają bez zmian.'],
          example: { mode: '2d', code: 'np 80\npw 120\nnp 80\ndom\nnp 40' },
        }),
      ] },
    ],
  },
  {
    id: 'pioro',
    title: 'Pióro, kolor i grubość',
    blocks: [
      { t: 'p', text: 'Stan pióra, kolor i grubość zostają takie, jakie ustawiono, aż do następnej zmiany.' },
      { t: 'commands', items: [
        cmd({
          id: 'pod', names: ['pod', 'podnies', 'podnieś', 'pu', 'penup'], syntax: 'pod',
          summary: 'Podnosi pióro: kolejne ruchy nie zostawiają śladu.',
          example: { mode: '2d', code: 'np 40\npod\nnp 40\nopu\nnp 40' },
        }),
        cmd({
          id: 'opu', names: ['opu', 'opusc', 'opuść', 'pd', 'pendown'], syntax: 'opu',
          summary: 'Opuszcza pióro: ruch znowu rysuje.',
          example: { mode: '2d', code: 'pod\nws 60\nopu\nnp 120' },
        }),
        cmd({
          id: 'kolor', names: ['kolor', 'color'], syntax: 'kolor "#rrggbb"',
          summary: 'Ustawia kolor pióra. Argumentem jest tekst w cudzysłowie: znak # i sześć cyfr szesnastkowych.',
          details: ['Niepoprawny zapis, np. `"#16"` albo `"zielony"`, jest błędem wskazującym ten tekst. Kolor można podać wyłącznie jako literał.'],
          example: { mode: '2d', code: 'kolor "#c1763d"\nnp 80\nkolor "#2b6fb3"\npw 90\nnp 80' },
        }),
        cmd({
          id: 'grubosc', names: ['grubosc', 'grubość', 'width'], syntax: 'grubosc liczba',
          summary: 'Ustawia grubość linii: liczba całkowita od 1 do 12.',
          details: ['Inna wartość (np. 0, 13 albo 2.5) jest błędem. Jeśli grubość jest zapisana samą liczbą, błąd wykryto przed rysowaniem; jeśli zależy od zmiennej — dopiero w trakcie wykonania.'],
          example: { mode: '2d', code: 'powtorz 6 [\n  grubosc nrpowt * 2\n  np 50\n  pw 60\n]' },
        }),
        cmd({
          id: 'czysc', names: ['czyść', 'czysc', 'cs', 'clearscreen'], syntax: 'czyść',
          summary: 'Usuwa wszystkie dotychczas narysowane odcinki. Niczego innego nie zmienia: żółw zostaje tam, gdzie był.',
          example: { mode: '2d', code: 'powtorz 4 [np 60 pw 90]\nczyść\npw 45\nnp 100' },
        }),
      ] },
    ],
  },
  {
    id: 'powtarzanie',
    title: 'Powtarzanie',
    blocks: [
      { t: 'commands', items: [
        cmd({
          id: 'powtorz', names: ['powtorz', 'powtórz', 'repeat'], syntax: 'powtorz n [ polecenia ]',
          summary: 'Wykonuje polecenia w nawiasach kwadratowych n razy.',
          details: [
            'Liczba powtórzeń musi być liczbą całkowitą od 0 do 10000; 0 oznacza, że ciało nie jest wykonywane wcale. Może to być wyrażenie, w tym parametr lub zmienna.',
            'Ciało może zawierać dowolne polecenia: inne powtórzenia, warunki i wywołania procedur. Nawiasy kwadratowe można zagnieżdżać do 32 poziomów.',
          ],
          example: { mode: '2d', code: 'powtorz 36 [\n  powtorz 4 [np 40 pw 90]\n  pw 10\n]' },
        }),
        cmd({
          id: 'nrpowt', names: ['nrpowt', 'repcount'], syntax: 'nrpowt',
          summary: 'Wartość (nie polecenie): numer bieżącego przebiegu najbliższego otaczającego „powtorz”, liczony od 1.',
          details: [
            'Ważne jest otoczenie w tekście programu, a nie w czasie wykonania: „nrpowt” zapisane w procedurze, która sama nie ma w sobie powtórzenia, jest błędem — nawet jeśli procedurę wywołano z wnętrza powtórzenia. Zapisane poza jakimkolwiek powtórzeniem na najwyższym poziomie to także błąd.',
          ],
          example: { mode: '2d', code: '; Każdy bok o 6 dłuższy od poprzedniego.\npowtorz 30 [\n  np nrpowt * 6\n  pw 90\n]' },
        }),
      ] },
    ],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    blocks: [
      { t: 'p', text: 'Wszędzie tam, gdzie polecenie przyjmuje liczbę, można wpisać wyrażenie. Wyrażenie to liczba, nazwa (parametr albo zmienna, także w dawnej postaci `:nazwa`), `nrpowt`, wyrażenie w nawiasach okrągłych, unarny `-` lub `+` zastosowany do dowolnego z nich albo dwa wyrażenia połączone znakiem `+`, `-`, `*` lub `/`.' },
      { t: 'list', items: [
        '`*` i `/` wiążą mocniej niż `+` i `-`. Operatory tego samego rzędu są łączone od lewej: `np 20 - 5 - 3` idzie o 12, a `np 2 + 3 * 4` o 14.',
        'Znaki unarne można układać w stosy i stosować wszędzie, gdzie oczekiwana jest wartość: `np -(3 - 5)`, `np - -2`, `np -bok`.',
        'Dzielenie przez zero i każdy wynik, który nie jest liczbą skończoną, to błąd wykonania.',
        'Warunek to dwa wyrażenia i operator porównania: `<`, `>`, `=`, `<=`, `>=` lub `<>`. Porównania są dokładne: `0.1 + 0.2 = 0.3` nie jest prawdą.',
      ] },
      { t: 'note', text: 'Reguła odstępów: operator `+`, `-`, `*` lub `/` musi mieć odstęp po obu stronach albo po żadnej. Zapisy `np 10 - 5` i `np 10-5` idą o 5, ale `np 10 -5` to polecenie „np 10” i osobna, zbłąkana wartość „-5” — błąd. Reguła nie dotyczy porównań: `x<3` i `x < 3` są równie dobre.' },
      { t: 'example', title: 'Wyrażenia w argumentach', example: { mode: '2d', code: 'np 2 + 3 * 20        ; 62\npw 360 / 4           ; 90\nnp (10 + 5) * 4      ; 60\npw -(30 - 120)       ; unarny minus przed nawiasem\nnp 100 - 3*10        ; 70' } },
    ],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    blocks: [
      { t: 'commands', items: [
        cmd({
          id: 'niech', names: ['niech', 'let'], syntax: 'niech nazwa wyrażenie',
          summary: 'Przypisuje wartość wyrażenia zmiennej; kolejne „niech” o tej samej nazwie zmieniają wartość.',
          details: [
            'Na najwyższym poziomie programu „niech” tworzy lub zmienia zmienną globalną. Wewnątrz procedury tworzy zmienną lokalną dla tego wywołania: przesłania globalną o tej samej nazwie do końca wywołania i znika razem z nim. Parametr też można przypisać od nowa.',
            'Nazwy zmiennych podlegają tym samym regułom co nazwy procedur — nie mogą być słowami zarezerwowanymi (poleceniami i ich aliasami) ani nazwą procedury.',
            'Nazwę wolno użyć w wyrażeniu, jeśli jest parametrem otaczającej procedury, jest przypisywana przez „niech” gdziekolwiek w ciele tej procedury albo jest przypisywana przez „niech” gdziekolwiek na najwyższym poziomie programu (także niżej niż użycie). Każda inna nazwa to błąd przed uruchomieniem.',
            'Odczyt zmiennej, która na danej ścieżce wykonania nie dostała jeszcze wartości, to błąd wykonania zgłaszany przy pierwszym symbolu argumentu.',
          ],
          example: { mode: '2d', code: 'niech bok 20\npowtorz 8 [\n  powtorz 4 [np bok pw 90]\n  niech bok bok + 10\n  pw 45\n]' },
        }),
      ] },
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    blocks: [
      { t: 'commands', items: [
        cmd({
          id: 'jesli', names: ['jeśli', 'jesli', 'if'], syntax: 'jeśli a < b [ polecenia ]',
          summary: 'Wykonuje ciało tylko wtedy, gdy warunek jest spełniony.',
          details: ['Ciało może zawierać wszystko, co ciało „powtorz”; liczy się do zagnieżdżenia nawiasów, ale nie jest osobną ramką wykonania.'],
          example: { mode: '2d', code: 'powtorz 12 [\n  np 30\n  jeśli nrpowt > 6 [kolor "#c1763d"]\n  pw 30\n]' },
        }),
        cmd({
          id: 'jezeli', names: ['jeżeli', 'jezeli', 'ifelse'], syntax: 'jeżeli a < b [ tak ] [ nie ]',
          summary: 'Wykonuje pierwsze ciało, gdy warunek jest spełniony, a w przeciwnym razie drugie.',
          example: { mode: '2d', code: 'powtorz 20 [\n  jeżeli nrpowt = 10 [kolor "#c1763d"] [kolor "#16866a"]\n  np nrpowt * 4\n  pw 90\n]' },
        }),
      ] },
      { t: 'p', text: 'Operatory porównania: `<` mniejsze, `>` większe, `=` równe, `<=` mniejsze lub równe, `>=` większe lub równe, `<>` różne.' },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    blocks: [
      { t: 'p', text: 'Procedura to nazwany fragment programu. Definicja zaczyna się słowem `oto` (albo `to`) na początku wiersza, po którym w tym samym wierszu następuje nazwa i — opcjonalnie — `ma:` z listą parametrów rozdzielonych przecinkami. Ciało zajmuje kolejne wiersze i kończy się wierszem, w którym jest samo `już` (aliasy: `juz`, `end`).' },
      { t: 'example', example: { mode: '2d', code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90\nkwadrat 40 * 2 90' } },
      { t: 'list', items: [
        'Wywołanie to nazwa i dokładnie tyle argumentów, ile procedura ma parametrów, rozdzielonych odstępami; każdy argument jest wyrażeniem, więc `kwadrat 40 * 2 90` przekazuje 80 i 90.',
        'Dawny nagłówek `oto kwadrat :bok :kąt` też działa, a parametr można w ciele zapisać jako `:bok` albo po prostu `bok`.',
        'Parametr może mieć nazwę procedury: na początku polecenia nazwa oznacza wywołanie, a na miejscu argumentu — parametr.',
        'Parametry i zmienne lokalne istnieją tylko w danym wywołaniu i mogą stać wszędzie, gdzie wyrażenie: w liczbie powtórzeń, w argumentach innych procedur.',
        'Definicje są tylko na najwyższym poziomie (nie wewnątrz powtórzenia, warunku ani innej procedury), mogą stać przed wywołaniami albo po nich, a nazwę można zdefiniować tylko raz.',
        'Procedury mogą wywoływać siebie, bezpośrednio albo przez inne. Procedury nie zwracają wartości.',
        '`stop` natychmiast kończy bieżące wywołanie; na najwyższym poziomie kończy program. Użyte wewnątrz powtórzenia lub warunku kończy otaczającą procedurę, a nie tylko ciało.',
      ] },
      { t: 'commands', items: [
        cmd({
          id: 'stop', names: ['stop'], syntax: 'stop',
          summary: 'Natychmiast kończy bieżące wywołanie procedury; na najwyższym poziomie programu kończy cały program.',
          details: ['Użyte wewnątrz powtórzenia lub warunku kończy otaczającą procedurę (albo program), a nie tylko to ciało. To najczęstszy sposób zakończenia rekurencji.'],
          example: { mode: '2d', code: 'oto spirala ma: bok\n  jeśli bok > 100 [stop]\n  np bok\n  pw 91\n  spirala bok + 5\nju\u017c\n\nspirala 5' },
        }),
      ] },
      { t: 'example', title: 'Rekurencja: drzewo', example: { mode: '2d', code: 'oto gałąź ma: dł\n  jeśli dł < 8 [stop]\n  np dł\n  lw 30\n  gałąź dł * 0.7\n  pw 60\n  gałąź dł * 0.7\n  lw 30\n  ws dł\njuż\n\npod ws 100 opu\ngałąź 70' } },
      { t: 'note', text: 'Procedura nazywająca się tak samo jak polecenie byłaby nieosiągalna, dlatego słowa zarezerwowane (wszystkie polecenia i ich aliasy, `nrpowt`, `oto`, `już` i ich odpowiedniki) nie mogą być nazwami procedur, zmiennych ani parametrów.' },
    ],
  },
  {
    id: 'przestrzen',
    title: 'Przestrzeń 3D',
    blocks: [
      { t: 'p', text: 'W trybie 3D żółw ma trzy wzajemnie prostopadłe wersory: kierunek ruchu (nos), prawą stronę i górę. Na początku są to +Y, +X i +Z. Obroty zmieniają je wszystkie razem, jak obrót prawdziwego obiektu.' },
      { t: 'commands', items: [
        cmd({
          id: 'gora', names: ['gora', 'góra', 'pitchup'], syntax: 'gora kąt',
          summary: 'Unosi nos: obraca kierunek ruchu o podany kąt w stronę „góry” żółwia, wokół jego prawej strony. Góra żółwia obraca się razem z nim.',
          details: ['Po „gora 90” żółw idzie wzdłuż dawnej góry. Tylko w trybie 3D — w 2D to błąd wykryty przed rysowaniem.'],
          example: { mode: '3d', code: 'np 60\ngora 90\nnp 60\npw 90\nnp 60' },
        }),
        cmd({
          id: 'dol', names: ['dol', 'dół', 'pitchdown'], syntax: 'dol kąt',
          summary: 'Opuszcza nos: obrót przeciwny do „gora”.',
          example: { mode: '3d', code: 'gora 90\nnp 60\ndol 90\nnp 60' },
        }),
        cmd({
          id: 'pp', names: ['pp', 'przechylprawo', 'rr', 'rollright'], syntax: 'pp kąt',
          summary: 'Przechyla żółwia w prawo wokół kierunku ruchu: góra żółwia obraca się w stronę jego prawej strony. Kierunek ruchu się nie zmienia.',
          details: ['Po „pp 90” górą żółwia jest jego dawna prawa strona, a prawą — dawny dół. Tylko w trybie 3D.'],
          example: { mode: '3d', code: 'pp 90\ngora 90\nnp 80   ; po przechyle „góra” prowadzi w bok' },
        }),
        cmd({
          id: 'pl', names: ['pl', 'przechyllewo', 'rl', 'rollleft'], syntax: 'pl kąt',
          summary: 'Przechyla żółwia w lewo — obrót przeciwny do „pp”.',
          example: { mode: '3d', code: 'pl 90\ngora 90\nnp 80' },
        }),
      ] },
      { t: 'example', title: 'Okrąg przechylony w przestrzeni', example: { mode: '3d', code: 'kolor "#a478c0"\ngora 30\npowtorz 36 [np 12 pw 10]' } },
      { t: 'note', text: 'Widok 3D rysuje przestrzeń na zwykłej kanwie 2D (rzut perspektywiczny z sortowaniem głębokości), więc nie wymaga WebGL i działa w każdej przeglądarce — także tam, gdzie akceleracja grafiki jest wyłączona.' },
      { t: 'p', text: 'Obracaj widok myszą (przeciąganie), przesuwaj z klawiszem Shift lub prawym przyciskiem, przybliżaj kółkiem. Siatka leży na płaszczyźnie z = 0, a osie X, Y i Z mają kolory czerwony, zielony i niebieski; mały wskaźnik w rogu pokazuje orientację kamery. Strzałka na żółwiu wskazuje jego kierunek, a trzy kolorowe kreski — jego prawą stronę, kierunek ruchu i górę.' },
    ],
  },
  {
    id: 'bledy',
    title: 'Błędy',
    blocks: [
      { t: 'p', text: 'Każdy błąd ma numer wiersza i kolumny (liczone od 1) oraz opis po polsku. W edytorze zaznaczony jest fragment, którego dotyczy błąd, a pod edytorem widać komunikat; kliknięcie go przenosi kursor w to miejsce.' },
      { t: 'list', items: [
        'Błąd analizy (składni) wykrywany jest zanim cokolwiek zostanie narysowane — program sprawdzany jest w całości, więc przy takim błędzie rysunek jest pusty. Zaliczają się tu: nieznane polecenie, brakujący lub źle zapisany argument, niepoprawny kolor, niedomknięty nawias, zła liczba argumentów procedury, definicja w złym miejscu, brak „już”, nieznana nazwa, „nrpowt” poza powtórzeniem, polecenie 3D w trybie 2D oraz grubość lub liczba powtórzeń zapisana samą liczbą spoza dozwolonego zakresu.',
        'Błąd wykonania zatrzymuje program, ale zachowuje to, co już narysowano (po ewentualnym „czyść”). Należą do nich: dzielenie przez zero, wynik nieskończony, zmienna bez wartości, grubość lub liczba powtórzeń obliczona z nazw i spoza zakresu oraz przekroczenie limitu.',
        'Błędna wartość argumentu (zła grubość, liczba powtórzeń, dzielenie przez zero, zmienna bez wartości) jest wskazywana przy pierwszym symbolu tego argumentu, a nie przy poleceniu. Brakujący argument — przy symbolu, który stoi tam, gdzie argument miał się zacząć, albo przy samym poleceniu, gdy program się tam kończy. Zbłąkana wartość tam, gdzie spodziewane jest polecenie, jest wskazywana na tej wartości.',
      ] },
      { t: 'example', title: 'Błąd wykonania zachowuje rysunek', example: { mode: '2d', fails: true, code: 'powtorz 4 [np 60 pw 90]\nniech x 0\nnp 100 / x     ; błąd: dzielenie przez zero\nnp 20' } },
    ],
  },
  {
    id: 'limity',
    title: 'Limity',
    blocks: [
      { t: 'p', text: 'Aby program nie zawiesił przeglądarki, obowiązują stałe limity. Przekroczenie któregokolwiek jest błędem.' },
      { t: 'table', head: ['Co', 'Limit'], rows: [
        ['Znaki w programie', '50 000'],
        ['Symbole (liczby, nazwy, operatory, nawiasy, przecinki)', '10 000'],
        ['Zagnieżdżenie nawiasów kwadratowych', '32'],
        ['Aktywne jednocześnie wywołania procedur i powtórzenia', '32 (ciała warunków się nie liczą)'],
        ['Wykonane operacje', '10 000 — liczy się każde polecenie, „niech”, warunek, powtórzenie i wywołanie, plus jedna za zakończenie każdego przebiegu powtórzenia, ciała warunku i wywołania procedury; samo obliczanie wyrażeń nie jest operacją'],
        ['Przechowywane odcinki', '10 000 (po „czyść” liczą się tylko te, które powstały później)'],
        ['Współrzędne', 'każda w zakresie ±100 000'],
        ['Liczba powtórzeń', '0–10 000'],
        ['Grubość linii', '1–12'],
      ] },
    ],
  },
];
