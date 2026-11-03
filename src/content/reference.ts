import type { Mode } from '../lang/types';

export type Block =
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'code'; source: string; mode?: Mode; caption?: string; runnable?: boolean }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'cmd'; name: string; aliases: string; arg: string; text: string; example: string; mode?: Mode; only3d?: boolean };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

// Inline `code` spans use backticks.
export const REFERENCE: Section[] = [
  {
    id: 'start',
    title: 'Jak to działa',
    blocks: [
      { t: 'p', text: 'Program w Logo to lista poleceń dla żółwia. Żółw stoi na środku rysunku, patrzy przed siebie i ma opuszczony pisak: każdy jego krok zostawia linię. Polecenia piszesz w edytorze, a przycisk Uruchom wykonuje je po kolei.' },
      { t: 'p', text: 'Studio ma dwa tryby. Płaszczyzna (2D) to kartka: żółw chodzi i skręca. Przestrzeń (3D) dodaje wznoszenie i przechylanie, a rysunek można obracać kamerą. Program złożony tylko z poleceń płaskich rysuje to samo w obu trybach.' },
      { t: 'code', source: '; Pierwszy rysunek: kwadrat.\npowtorz 4 [np 100 pw 90]', caption: 'Najkrótszy sposób na kwadrat.' },
      { t: 'p', text: 'Uruchom rysuje cały program z wybranym tempem. Krok wykonuje jedno polecenie i zatrzymuje się, a edytor podświetla wykonany wiersz. Pauza wstrzymuje rysowanie, Od nowa czyści rysunek i odsyła żółwia na start. Panel Przebieg pokazuje każde wykonane polecenie z jego miejscem w programie i pozycją żółwia. Kliknij wiersz przebiegu, żeby przejść do tego miejsca w edytorze.' },
      { t: 'p', text: 'Jeśli zmienisz program w trakcie rysowania, studio zatrzyma wykonanie i zostawi to, co już narysowane. Wystarczy uruchomić program ponownie.' },
    ],
  },
  {
    id: 'ruch',
    title: 'Ruch i obroty',
    blocks: [
      { t: 'p', text: 'Odległości to jednostki rysunku, a kąty to stopnie. Liczby mogą być ułamkowe, a ujemne odwracają kierunek: `pw -90` działa jak `lw 90`.' },
      { t: 'cmd', name: 'np', aliases: 'naprzod, naprzód, fd, forward', arg: 'odległość', text: 'Żółw idzie naprzód o podaną odległość. Z opuszczonym pisakiem rysuje odcinek. Krok o zero niczego nie rysuje.', example: 'np 100' },
      { t: 'cmd', name: 'ws', aliases: 'wstecz, bk, back', arg: 'odległość', text: 'Żółw cofa się o podaną odległość, nie odwracając się.', example: 'np 80\nws 40\npw 90\nnp 50' },
      { t: 'cmd', name: 'pw', aliases: 'prawo, rt, right', arg: 'kąt w stopniach', text: 'Żółw obraca się w prawo, czyli zgodnie z ruchem wskazówek zegara, gdy patrzysz z góry.', example: 'np 60\npw 90\nnp 60\npw 45\nnp 60' },
      { t: 'cmd', name: 'lw', aliases: 'lewo, lt, left', arg: 'kąt w stopniach', text: 'Żółw obraca się w lewo.', example: 'np 60\nlw 90\nnp 60\nlw 90\nnp 30' },
      { t: 'cmd', name: 'dom', aliases: 'home', arg: 'brak', text: 'Żółw wraca do punktu startu i ustawia się jak na początku: przodem wzdłuż osi y. Jeśli pisak jest opuszczony, a żółw nie stoi w punkcie startu, droga powrotna zostaje narysowana. Pisak, kolor i grubość się nie zmieniają.', example: 'np 80\npw 90\nnp 50\ndom' },
    ],
  },
  {
    id: 'pisak',
    title: 'Pisak',
    blocks: [
      { t: 'p', text: 'Na początku pisak jest opuszczony, ma kolor `"#16866a"` i grubość 3. Ustawienia obowiązują, dopóki ich nie zmienisz.' },
      { t: 'cmd', name: 'pod', aliases: 'podnies, podnieś, pu, penup', arg: 'brak', text: 'Podnosi pisak: żółw chodzi, ale nie rysuje.', example: 'np 30\npod\nnp 30\nopu\nnp 30' },
      { t: 'cmd', name: 'opu', aliases: 'opusc, opuść, pd, pendown', arg: 'brak', text: 'Opuszcza pisak: kolejne kroki znowu rysują.', example: 'powtorz 6 [np 10 pod np 10 opu]' },
      { t: 'cmd', name: 'kolor', aliases: 'color', arg: 'kolor w cudzysłowie', text: 'Ustawia kolor pisaka. Kolor zapisuje się jako # i sześć cyfr szesnastkowych (0–9, a–f) w cudzysłowie: dwie cyfry na czerwony, zielony i niebieski. Wielkość liter nie ma znaczenia.', example: 'kolor "#c1763d"\nnp 60\npw 90\nkolor "#2b6fb3"\nnp 60' },
      { t: 'cmd', name: 'grubość', aliases: 'grubosc, width', arg: 'liczba całkowita od 1 do 12', text: 'Ustawia grubość linii w pikselach ekranu.', example: 'powtorz 6 [\n  grubosc nrpowt * 2\n  np 40\n  pw 60\n]' },
      { t: 'cmd', name: 'czyść', aliases: 'czysc, cs, clearscreen', arg: 'brak', text: 'Wymazuje wszystko, co narysowano do tej pory. Żółw zostaje tam, gdzie stał, z tym samym kierunkiem, pisakiem, kolorem i grubością.', example: 'powtorz 4 [np 80 pw 90]\nczyść\npw 45\nnp 60' },
    ],
  },
  {
    id: 'przestrzen',
    title: 'Przestrzeń 3D',
    blocks: [
      { t: 'p', text: 'Układ współrzędnych jest prawoskrętny: oś x biegnie w prawo, oś y do przodu po kartce, a oś z w górę, nad kartkę. Płaszczyzna 2D to podłoga z = 0. Żółw startuje w punkcie (0, 0, 0), patrzy wzdłuż osi y, prawy bok ma wzdłuż osi x, a grzbiet wzdłuż osi z.' },
      { t: 'p', text: 'W przestrzeni `pw` i `lw` obracają żółwia wokół jego grzbietu, więc działają tak samo jak na płaszczyźnie, ale względem tego, jak żółw jest akurat ustawiony. Cztery polecenia poniżej działają tylko w trybie 3D: w trybie 2D są błędem.' },
      { t: 'cmd', name: 'góra', aliases: 'gora, pitchup', arg: 'kąt w stopniach', text: 'Podnosi nos żółwia: kierunek obraca się w stronę grzbietu. Po `gora 90` żółw patrzy tam, gdzie wcześniej miał grzbiet.', example: 'np 50\ngora 90\nnp 50\ndol 90\nnp 50', mode: '3d', only3d: true },
      { t: 'cmd', name: 'dół', aliases: 'dol, pitchdown', arg: 'kąt w stopniach', text: 'Opuszcza nos żółwia, odwrotnie do `gora`.', example: 'gora 45\nnp 60\ndol 90\nnp 60', mode: '3d', only3d: true },
      { t: 'cmd', name: 'pp', aliases: 'przechylprawo, rr, rollright', arg: 'kąt w stopniach', text: 'Przechyla żółwia na prawy bok, wokół kierunku, w którym patrzy. Kierunek się nie zmienia, obraca się grzbiet: po `pp 90` grzbiet jest tam, gdzie był prawy bok.', example: 'powtorz 6 [\n  powtorz 4 [np 50 pw 90]\n  pp 60\n]', mode: '3d', only3d: true },
      { t: 'cmd', name: 'pl', aliases: 'przechyllewo, rl, rollleft', arg: 'kąt w stopniach', text: 'Przechyla żółwia na lewy bok, odwrotnie do `pp`.', example: 'powtorz 4 [\n  np 60\n  pl 90\n  pw 90\n]', mode: '3d', only3d: true },
      { t: 'p', text: 'Kamerę obracasz, przeciągając rysunek. Prawy przycisk myszy albo dwa palce przesuwają widok, kółko lub gest szczypania przybliża. Przycisk z celownikiem ustawia kamerę od nowa, a przycisk z narożnikami dopasowuje widok do rysunku.' },
    ],
  },
  {
    id: 'powtorz',
    title: 'Powtarzanie',
    blocks: [
      { t: 'cmd', name: 'powtórz', aliases: 'powtorz, repeat', arg: 'liczba całkowita od 0 do 10 000, potem [ treść ]', text: 'Wykonuje polecenia w nawiasach kwadratowych podaną liczbę razy. Zero oznacza, że treść nie wykona się ani razu. W nawiasach może stać wszystko: inne powtórzenia, warunki i wywołania procedur.', example: 'powtorz 5 [np 80 pw 72]' },
      { t: 'cmd', name: 'nrpowt', aliases: 'repcount', arg: 'to wartość, nie polecenie', text: 'Numer bieżącego powtórzenia najbliższego powtórz, licząc od 1. Może stać tylko wewnątrz nawiasów powtórz, w tej samej procedurze: nrpowt w procedurze bez własnego powtórz jest błędem, nawet jeśli procedurę wywołuje się z wnętrza powtórz.', example: 'powtorz 30 [np nrpowt * 3 pw 50]' },
      { t: 'code', source: 'powtorz 3 [\n  powtorz 4 [np 40 pw 90]\n  pw 120\n]', caption: 'Powtórzenia można zagnieżdżać: tu trzy kwadraty.' },
    ],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    blocks: [
      { t: 'p', text: 'Wszędzie, gdzie polecenie potrzebuje liczby, można wpisać wyrażenie: liczbę, nazwę parametru lub zmiennej, `nrpowt`, wyrażenie w nawiasach okrągłych, wyrażenie ze znakiem minus albo plus z przodu, albo dwa wyrażenia połączone znakiem `+`, `-`, `*` lub `/`.' },
      { t: 'list', items: [
        'Liczby zapisuje się cyframi z kropką dziesiętną: `80`, `12.5`, `.5`. Zapisy `1e3`, `0x10`, `NaN` i `Infinity` nie są liczbami.',
        'Mnożenie i dzielenie wykonują się przed dodawaniem i odejmowaniem, a działania tej samej wagi od lewej do prawej: `np 20 - 5 - 3` idzie o 12, a `np 2 + 3 * 4` o 14.',
        'Znak działania musi mieć odstęp z obu stron albo z żadnej: `np 10 - 5` i `np 10-5` idą o 5. Natomiast `np 10 -5` to `np 10` i osobne `-5`, które jest błędem, bo minus ma odstęp tylko z lewej. Ta zasada nie dotyczy porównań.',
        'Minus i plus z przodu można łączyć i stawiać przed każdą wartością: `np -(3 - 5)`, `np - -2`, `np -bok`.',
        'Dzielenie przez zero i wynik, który nie jest skończoną liczbą, są błędami wykonania.',
      ] },
      { t: 'code', source: 'np 20 - 5 - 3   ; 12\npw 90\nnp 2 + 3 * 4    ; 14\npw 90\nnp (2 + 3) * 4  ; 20\npw 90\nnp 10-5         ; 5', caption: 'Kolejność działań.' },
      { t: 'code', source: 'oto dwa ma: a, b\n  np a pw 90 np b\njuż\n\ndwa 80 -30', caption: 'Przy wywołaniu procedury zasada odstępów rozdziela argumenty: tu a = 80, b = −30.' },
    ],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    blocks: [
      { t: 'cmd', name: 'niech', aliases: 'let', arg: 'nazwa, potem wartość', text: 'Nadaje zmiennej wartość wyrażenia. Kolejne niech z tą samą nazwą zmienia wartość. Nazwa nie może być słowem języka (np. `np`) ani nazwą procedury.', example: 'niech bok 30\npowtorz 6 [\n  np bok\n  pw 60\n  niech bok bok + 10\n]' },
      { t: 'list', items: [
        'niech poza procedurami tworzy zmienną globalną, widoczną w całym programie.',
        'niech wewnątrz procedury tworzy zmienną lokalną tego wywołania. Od tej chwili do końca wywołania przesłania zmienną globalną o tej samej nazwie, a po zakończeniu wywołania znika. Tak samo można zmienić wartość parametru.',
        'Nazwy można użyć tylko wtedy, gdy jest parametrem procedury, w której stoi, gdy ta procedura nadaje jej wartość przez niech, albo gdy nadaje ją niech poza procedurami, wcześniej lub później w programie. Każda inna nazwa jest błędem.',
        'Odczyt zmiennej, która na tej drodze wykonania nie dostała jeszcze wartości, jest błędem wykonania.',
        'Nazwę można też zapisać po staremu, z dwukropkiem: `:bok` znaczy to samo co `bok`.',
      ] },
      { t: 'code', source: 'niech krok 10\noto schody\n  np krok      ; zmienna globalna: 10\n  niech krok 40\n  pw 90 np krok ; zmienna lokalna: 40\njuż\nschody\nlw 90 np krok   ; znowu globalna: 10', caption: 'Zmienna lokalna znika po zakończeniu wywołania.' },
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    blocks: [
      { t: 'p', text: 'Warunek to dwa wyrażenia i porównanie między nimi: `<` mniejsze, `>` większe, `=` równe, `<=` mniejsze lub równe, `>=` większe lub równe, `<>` różne. Porównania są dokładne, więc `0.1 + 0.2 = 0.3` nie jest prawdą: komputer liczy ułamki dziesiętne z drobnym zaokrągleniem.' },
      { t: 'cmd', name: 'jeśli', aliases: 'jesli, if', arg: 'warunek, potem [ treść ]', text: 'Wykonuje treść w nawiasach tylko wtedy, gdy warunek jest spełniony.', example: 'powtorz 12 [\n  jeśli nrpowt > 6 [kolor "#c1763d"]\n  np 40\n  pw 30\n]' },
      { t: 'cmd', name: 'jeżeli', aliases: 'jezeli, ifelse', arg: 'warunek, potem [ treść ] [ treść ]', text: 'Wykonuje pierwszą treść, gdy warunek jest spełniony, a drugą, gdy nie jest.', example: 'niech parzysty 0\npowtorz 8 [\n  jeżeli parzysty = 1 [kolor "#c1763d"] [kolor "#2b6fb3"]\n  niech parzysty 1 - parzysty\n  np 50\n  pw 45\n]' },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    blocks: [
      { t: 'p', text: 'Procedura to nowe polecenie zbudowane z innych. Definicja zaczyna się od `oto` na początku wiersza; w tym samym wierszu stoi nazwa i, jeśli trzeba, `ma:` z listą parametrów oddzielonych przecinkami. Treść zajmuje kolejne wiersze, a kończy ją `już` w osobnym wierszu.' },
      { t: 'cmd', name: 'oto … już', aliases: 'to … end, juz', arg: 'nazwa, opcjonalnie ma: parametry', text: 'Definiuje procedurę. Wywołanie to nazwa i dokładnie tyle argumentów, ile procedura ma parametrów, oddzielonych odstępami. Każdy argument jest wyrażeniem, więc `kwadrat 40 * 2 90` przekazuje 80 i 90. Definicje stoją tylko na najwyższym poziomie programu, nigdy w nawiasach ani w innej procedurze, a mogą być przed wywołaniem albo po nim. Każdą nazwę definiuje się raz.', example: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90\nkwadrat 40 * 2 120' },
      { t: 'cmd', name: 'stop', aliases: 'stop', arg: 'brak', text: 'Kończy bieżące wywołanie procedury od razu, także z wnętrza powtórz i warunku. Poza procedurą kończy cały program. Procedury nie zwracają wartości.', example: 'oto schodek ma: n\n  jeśli n = 0 [stop]\n  np 20 pw 90 np 20 lw 90\n  schodek n - 1\njuż\n\nschodek 5' },
      { t: 'list', items: [
        'Starszy zapis nagłówka też działa: `oto kwadrat :bok :kąt`.',
        'Parametr może nazywać się tak samo jak procedura. Na miejscu polecenia ta nazwa wywołuje procedurę, a na miejscu wartości oznacza parametr.',
        'Procedury mogą wywoływać same siebie, bezpośrednio albo przez inne procedury. To rekurencja: potrzebuje warunku z `stop`, który ją kończy.',
      ] },
      { t: 'code', source: 'oto gałąź ma: dł\n  jeśli dł < 8 [stop]\n  np dł\n  lw 30 gałąź dł * 0.6\n  pw 60 gałąź dł * 0.6\n  lw 30\n  pod ws dł opu\njuż\n\ngałąź 80', caption: 'Rekurencja: każda gałąź rysuje dwie mniejsze.' },
    ],
  },
  {
    id: 'pisownia',
    title: 'Pisownia i komentarze',
    blocks: [
      { t: 'list', items: [
        'Wielkość liter nie ma znaczenia w poleceniach, nazwach procedur, zmiennych i parametrów: `NP`, `Np` i `np` to to samo.',
        'Polskie litery działają obok zapisu bez nich: `powtórz` i `powtorz`, `jeśli` i `jesli`, `już` i `juz`. Każde polecenie ma też angielską nazwę, na przykład `fd` dla `np` i `repeat` dla `powtórz`.',
        'Odstępy oddzielają elementy programu. Nowa linia ma znaczenie tylko w definicji procedury: nagłówek `oto` musi stać w jednym wierszu, a `już` w osobnym.',
        'Średnik zaczyna komentarz, który trwa do końca wiersza. Żółw go pomija.',
      ] },
      { t: 'code', source: '; To jest komentarz.\nPOWTÓRZ 3 [NAPRZÓD 60 PRAWO 120] ; tu też', caption: 'Wielkie litery i polskie znaki.' },
    ],
  },
  {
    id: 'bledy',
    title: 'Błędy',
    blocks: [
      { t: 'p', text: 'Każdy błąd ma numer wiersza i kolumny. Edytor podkreśla miejsce błędu na czerwono, zaznacza wiersz na marginesie i wypisuje pod nim wyjaśnienie. Studio sprawdza program już w trakcie pisania, a ostatecznie przy uruchomieniu.' },
      { t: 'list', items: [
        'Błąd w zapisie, na przykład nieznane polecenie, brakujący nawias albo nieznana nazwa, wychodzi przed rysowaniem. Wtedy nic nie zostaje narysowane.',
        'Błąd wykonania, na przykład dzielenie przez zero, zmienna bez wartości albo przekroczony limit, zatrzymuje żółwia w połowie. To, co narysował do tej chwili, zostaje na rysunku, a przebieg kończy się czerwonym wierszem.',
        'Zła wartość argumentu (na przykład grubość 13) jest wskazywana na początku tego argumentu, a brakujący argument w miejscu, gdzie powinien się zacząć.',
        'Grubość i liczba powtórzeń zapisane samymi liczbami są sprawdzane przed rysowaniem. Gdy zależą od zmiennej, są sprawdzane w chwili wykonania.',
      ] },
      { t: 'code', source: 'np 100\npw 90\nnp 50 / (2 - 2)', caption: 'Błąd wykonania: pierwsza linia zostaje na rysunku.' },
    ],
  },
  {
    id: 'limity',
    title: 'Limity',
    blocks: [
      { t: 'p', text: 'Limity chronią przed programami, które nigdy się nie kończą. Przekroczenie któregokolwiek jest błędem.' },
      {
        t: 'table',
        head: ['Co', 'Limit'],
        rows: [
          ['Długość programu', '50 000 znaków'],
          ['Elementy programu: polecenia, liczby, nazwy, operatory, nawiasy i przecinki', '10 000'],
          ['Zagnieżdżenie nawiasów kwadratowych', '32 poziomy'],
          ['Aktywne naraz wywołania procedur i powtórzenia (warunki się nie liczą)', '32'],
          ['Wykonane operacje', '10 000'],
          ['Odcinki na rysunku (po czyść liczy się od nowa)', '10 000'],
          ['Każda współrzędna żółwia', 'od −100 000 do 100 000'],
          ['Grubość', 'liczba całkowita od 1 do 12'],
          ['Liczba powtórzeń', 'liczba całkowita od 0 do 10 000'],
        ],
      },
      { t: 'p', text: 'Operacją jest każde polecenie, każde niech, każdy warunek, każde powtórz i każde wywołanie procedury. Do tego dochodzi jedna operacja za zakończenie każdego obrotu powtórz, każdej wykonanej treści warunku i każdego wywołania. Dojście do końca programu się nie liczy. Na przykład `powtorz 4 [np 10 pw 90]` to 13 operacji: jedna za powtórz i po trzy za każdy obrót.' },
    ],
  },
  {
    id: 'skroty',
    title: 'Skróty i pliki',
    blocks: [
      {
        t: 'table',
        head: ['Skrót', 'Działanie'],
        rows: [
          ['Ctrl + Enter (⌘ + Enter)', 'Uruchom program od początku'],
          ['Ctrl + Shift + Enter', 'Wykonaj jedno polecenie (krok)'],
          ['Ctrl + Shift + Spacja', 'Pauza albo wznowienie'],
          ['Esc', 'Od nowa: wyczyść rysunek, żółw wraca na start'],
          ['+  −  0 na rysunku', 'Przybliż, oddal, dopasuj widok'],
          ['Strzałki na rysunku', 'Przesuń widok; w 3D z Shift obróć kamerę'],
        ],
      },
      { t: 'p', text: 'Menu Plik zapisuje program jako plik `.logo`, otwiera taki plik (można go też upuścić na studio) i zapisuje rysunek jako obraz PNG. Udostępnij tworzy link z całym programem: otwarcie linku wczytuje i uruchamia program. Szkic każdego trybu zapisuje się sam w pamięci przeglądarki. Gdy wczytujesz przykład, plik albo link, dotychczasowy szkic zostaje odłożony i można go przywrócić z menu Plik.' },
    ],
  },
];
