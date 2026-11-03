import type { Mode } from '../lang/ast';

export interface RefEntry {
  id?: string;
  names: string[];
  arg?: string;
  text: string;
  example?: { code: string; mode?: Mode };
}

export interface RefSection {
  id: string;
  title: string;
  intro?: string[];
  table?: { head: string[]; rows: string[][] };
  entries?: RefEntry[];
  examples?: { caption?: string; code: string; mode?: Mode }[];
}

export const REFERENCE: RefSection[] = [
  {
    id: 'start',
    title: 'Pierwsze kroki',
    intro: [
      'Po lewej piszesz program, po prawej żółw rysuje go na planszy. Przycisk Uruchom wykonuje cały program od początku, Krok wykonuje jedno polecenie naraz, Pauza zatrzymuje rysowanie, a Reset czyści planszę i stawia żółwia na starcie. Suwak Tempo zmienia szybkość rysowania; na końcu skali rysunek pojawia się od razu.',
      'Żółw zaczyna w punkcie (0, 0, 0), patrzy w górę planszy (oś y), pióro ma opuszczone, kolor `"#16866a"` i grubość 3. Oś x biegnie w prawo, oś y do góry planszy, a oś z — w trybie 3D — w górę, prosto do ciebie.',
      'Tryb 2D rysuje na płaszczyźnie, tryb 3D w przestrzeni, w której możesz obracać kamerę. Każdy tryb ma własny szkic, który zapisuje się w tej przeglądarce. Wielkość liter nie ma znaczenia, a polecenia działają z polskimi znakami i bez nich: `powtórz` i `powtorz` to to samo.',
      'Przycisk Opisy włącza numerowane opisy na planszy: każdy kolor dostaje numer przy swoim pierwszym odcinku, a legenda pod planszą mówi, ile odcinków tym kolorem narysowano i jak są długie.',
    ],
    examples: [{ caption: 'Najkrótszy rysunek: kreska długości 100.', code: 'np 100' }],
  },
  {
    id: 'ruch',
    title: 'Ruch i obroty',
    entries: [
      {
        names: ['np', 'naprzód', 'naprzod', 'fd', 'forward'],
        arg: 'odległość (wyrażenie)',
        text: 'Przesuwa żółwia naprzód o podaną odległość. Jeśli pióro jest opuszczone, zostaje odcinek. Ruch o 0 niczego nie rysuje.',
        example: { code: 'np 80' },
      },
      {
        names: ['ws', 'wstecz', 'bk', 'back'],
        arg: 'odległość (wyrażenie)',
        text: 'Przesuwa żółwia do tyłu, nie zmieniając kierunku. ws 50 to to samo co np -50.',
        example: { code: 'np 80 ws 40 pw 90 np 40' },
      },
      {
        names: ['pw', 'prawo', 'rt', 'right'],
        arg: 'kąt w stopniach (wyrażenie)',
        text: 'Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry). Kąt może być dowolną liczbą, także ułamkiem; ujemny obraca w drugą stronę.',
        example: { code: 'np 60 pw 90 np 60 pw 45 np 60' },
      },
      {
        names: ['lw', 'lewo', 'lt', 'left'],
        arg: 'kąt w stopniach (wyrażenie)',
        text: 'Obraca żółwia w lewo.',
        example: { code: 'np 60 lw 120 np 60 lw 120 np 60' },
      },
      {
        names: ['dom', 'home'],
        text: 'Wraca do punktu (0, 0, 0), rysując odcinek, jeśli pióro jest opuszczone, i ustawia żółwia tak jak na starcie: przodem do osi y. Pióra, koloru i grubości nie zmienia.',
        example: { code: 'np 80 pw 90 np 60 dom' },
      },
    ],
  },
  {
    id: 'pioro',
    title: 'Pióro, kolor i grubość',
    entries: [
      {
        names: ['pod', 'podnieś', 'podnies', 'pu', 'penup'],
        text: 'Podnosi pióro: żółw chodzi, ale nie rysuje.',
        example: { code: 'np 30 pod np 20 opu np 30' },
      },
      {
        names: ['opu', 'opuść', 'opusc', 'pd', 'pendown'],
        text: 'Opuszcza pióro: od teraz każdy ruch zostawia ślad.',
        example: { code: 'pod ws 40 opu np 80' },
      },
      {
        names: ['kolor', 'color'],
        arg: 'kolor w cudzysłowie: "#rrggbb"',
        text: 'Ustawia kolor pióra. Kolor zapisujesz jako # i sześć cyfr szesnastkowych (0–9, a–f), w cudzysłowie, np. "#c1763d". Wielkość liter nie ma znaczenia. Tu nie wolno użyć wyrażenia ani zmiennej.',
        example: { code: 'kolor "#c1763d" np 60 pw 90\nkolor "#2b6fb3" np 60' },
      },
      {
        names: ['grubość', 'grubosc', 'width'],
        arg: 'liczba całkowita od 1 do 12 (wyrażenie)',
        text: 'Ustawia grubość linii. Inna wartość, np. 0, 13 albo 2.5, jest błędem.',
        example: { code: 'grubość 1 np 40 pw 90\ngrubość 6 np 40 pw 90\ngrubość 12 np 40' },
      },
      {
        names: ['czyść', 'czysc', 'cs', 'clearscreen'],
        text: 'Wymazuje wszystko, co już narysowano. Żółw zostaje tam, gdzie jest, i nic innego się nie zmienia.',
        example: { code: 'np 100 czyść pw 90 np 50' },
      },
    ],
  },
  {
    id: 'powtorz',
    title: 'Powtórzenia',
    entries: [
      {
        names: ['powtórz', 'powtorz', 'repeat'],
        arg: 'liczba całkowita od 0 do 10 000, potem [ polecenia ] (wyrażenie)',
        text: 'Wykonuje polecenia w nawiasach kwadratowych podaną liczbę razy (przy 0 ani razu). W środku może być wszystko: inne powtórzenia, warunki, wywołania procedur.',
        example: { code: 'powtorz 6 [np 50 pw 60]' },
      },
      {
        id: 'nrpowt',
        names: ['nrpowt', 'repcount'],
        text: 'To nie polecenie, tylko wartość: numer bieżącego powtórzenia najbliższego powtórz, licząc od 1. Działa tylko wewnątrz nawiasów powtórz zapisanego w tym samym miejscu programu — w procedurze tylko wtedy, gdy powtórz jest w tej samej procedurze.',
        example: { code: 'powtorz 20 [np nrpowt * 6 pw 90]' },
      },
    ],
    examples: [{ caption: 'Powtórzenie w powtórzeniu: dwanaście obróconych kwadratów.', code: 'powtorz 12 [\n  powtorz 4 [np 60 pw 90]\n  pw 30\n]' }],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    intro: [
      'Tam, gdzie polecenie potrzebuje liczby, możesz wpisać wyrażenie: liczbę (`80`, `12.5`, `.5`), nazwę parametru albo zmiennej (także z dwukropkiem, `:bok`), `nrpowt`, wyrażenie w nawiasach okrągłych, wyrażenie ze znakiem `-` albo `+` przed nim, albo dwa wyrażenia połączone działaniem.',
      'Mnożenie i dzielenie wykonują się przed dodawaniem i odejmowaniem, a działania tej samej wagi od lewej do prawej: `np 20 - 5 - 3` idzie o 12, `np 2 + 3 * 4` o 14. Nawiasy zmieniają kolejność: `np (2 + 3) * 4` idzie o 20.',
      'Ważne: znak działania ma mieć spacje po obu stronach albo nie mieć ich wcale. `np 10 - 5` i `np 10-5` idą o 5. Ale `np 10 -5` to `np 10` i osobne `-5`, a to jest błąd — tak samo dla `+`, `*` i `/`. Ta zasada nie dotyczy porównań.',
      'Znaki przed liczbą można łączyć: `np -(3 - 5)`, `np - -2`, `np -bok`. Liczby zapisuj tylko cyframi z kropką; `1e3`, `0x10`, `NaN` i `Infinity` nie są liczbami. Dzielenie przez zero i zbyt duży wynik są błędem w czasie działania.',
    ],
    table: {
      head: ['Działanie', 'Przykład', 'Wynik'],
      rows: [
        ['dodawanie `+`', '`np 40 + 20`', '60'],
        ['odejmowanie `-`', '`np 100-30`', '70'],
        ['mnożenie `*`', '`np 3 * 4 + 1`', '13'],
        ['dzielenie `/`', '`pw 360 / 5`', '72'],
        ['zmiana znaku', '`np -(3 - 5)`', '2'],
      ],
    },
    examples: [{ caption: 'Kąt wyliczony z działania: pięciokąt.', code: 'powtorz 5 [np 70 pw 360 / 5]' }],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    entries: [
      {
        names: ['niech', 'let'],
        arg: 'nazwa, potem wyrażenie',
        text: 'Nadaje zmiennej wartość wyrażenia; kolejne niech z tą samą nazwą ją zmienia. Nazwa nie może być poleceniem ani nazwą procedury. Poza procedurą niech tworzy zmienną globalną; wewnątrz procedury — zmienną lokalną, która istnieje tylko do końca tego wywołania i zasłania zmienną globalną o tej samej nazwie.',
        example: { code: 'niech bok 20\npowtorz 8 [\n  np bok pw 90\n  niech bok bok + 10\n]' },
      },
    ],
    intro: [
      'Nazwy można użyć w wyrażeniu tylko wtedy, gdy jest parametrem procedury, w której jesteś, albo gdy gdzieś w tej procedurze lub gdziekolwiek na najwyższym poziomie programu (także niżej) stoi dla niej niech. Inna nazwa to błąd, zanim cokolwiek się narysuje.',
      'Jeśli niech jest w programie, ale jeszcze się nie wykonał, odczyt tej zmiennej zatrzyma program z błędem „nie ma jeszcze wartości”.',
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    intro: [
      'Warunek to dwa wyrażenia i porównanie między nimi: `<` mniejsze, `>` większe, `=` równe, `<=` mniejsze lub równe, `>=` większe lub równe, `<>` różne. Porównania są dokładne, więc `0.1 + 0.2 = 0.3` nie jest prawdą.',
    ],
    entries: [
      {
        names: ['jeśli', 'jesli', 'if'],
        arg: 'warunek, potem [ polecenia ]',
        text: 'Wykonuje polecenia w nawiasach tylko wtedy, gdy warunek jest spełniony.',
        example: { code: 'powtorz 12 [\n  jeśli nrpowt > 6 [kolor "#c1763d"]\n  np 40 pw 30\n]' },
      },
      {
        names: ['jeżeli', 'jezeli', 'ifelse'],
        arg: 'warunek, potem [ gdy tak ] [ gdy nie ]',
        text: 'Wykonuje pierwszy blok, gdy warunek jest spełniony, a drugi, gdy nie jest.',
        example: { code: 'niech z 1\npowtorz 10 [\n  jeżeli z > 0 [grubość 6] [grubość 2]\n  niech z -z\n  np 30 pw 36\n]' },
      },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    intro: [
      'Procedura to nowe polecenie zbudowane z innych. Definicja zaczyna się od `oto` (albo `to`) na początku wiersza; w tym samym wierszu podajesz nazwę i, jeśli trzeba, `ma:` z listą parametrów po przecinku. Treść piszesz w kolejnych wierszach, a kończysz słowem `już` (albo `juz`, `end`) stojącym samotnie w osobnym wierszu.',
      'Działa też dawny zapis nagłówka: `oto kwadrat :bok :kąt`. Do parametru możesz się odwołać jako `bok` albo `:bok`.',
      'Wywołanie to nazwa i dokładnie tyle argumentów, ile procedura ma parametrów, oddzielonych spacjami. Każdy argument jest wyrażeniem, więc `kwadrat 40 * 2 90` przekazuje 80 i 90. Procedury definiuje się tylko na najwyższym poziomie programu — nie w nawiasach i nie w innej procedurze — przed albo po miejscu, w którym są używane. Każda nazwa może być zdefiniowana raz.',
      'Procedura może wywoływać samą siebie (rekurencja). `stop` natychmiast kończy bieżące wywołanie, także wtedy, gdy stoi w nawiasach powtórz albo warunku. Procedury nie zwracają wartości.',
    ],
    entries: [
      {
        names: ['oto', 'to'],
        arg: 'nazwa, potem opcjonalnie ma: parametry',
        text: 'Zaczyna definicję procedury.',
        example: { code: 'oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\n\nkwadrat 80 90' },
      },
      {
        names: ['już', 'juz', 'end'],
        text: 'Kończy definicję procedury. Musi stać sam w wierszu.',
      },
      {
        names: ['stop'],
        text: 'Kończy bieżące wywołanie procedury; poza procedurą kończy cały program.',
        example: { code: 'oto spirala ma: bok\n  jeśli bok > 90 [stop]\n  np bok pw 90\n  spirala bok + 6\njuż\n\nspirala 6' },
      },
    ],
  },
  {
    id: 'przestrzen',
    title: 'Przestrzeń 3D',
    intro: [
      'W trybie 3D żółw ma trzy kierunki: przód (tam idzie np), prawy bok (tam skręca pw) i górę (nad grzbietem). Te cztery polecenia działają tylko w trybie 3D — w 2D są błędem. Program złożony wyłącznie z poleceń płaskich rysuje w obu trybach dokładnie to samo.',
    ],
    entries: [
      {
        names: ['góra', 'gora', 'pitchup'],
        arg: 'kąt w stopniach (wyrażenie)',
        text: 'Podnosi nos żółwia: obraca przód w stronę góry, wokół prawego boku. Po góra 90 żółw leci tam, gdzie wcześniej miał grzbiet.',
        example: { code: 'np 50 gora 90 np 50', mode: '3d' },
      },
      {
        names: ['dół', 'dol', 'pitchdown'],
        arg: 'kąt w stopniach (wyrażenie)',
        text: 'Opuszcza nos żółwia: obraca go w przeciwną stronę niż góra.',
        example: { code: 'gora 90 np 50 dol 90 np 50', mode: '3d' },
      },
      {
        names: ['pp', 'przechylprawo', 'rr', 'rollright'],
        arg: 'kąt w stopniach (wyrażenie)',
        text: 'Przechyla żółwia w prawo wokół kierunku lotu: grzbiet obraca się ku prawemu bokowi. Kierunek się nie zmienia, ale potem pw i góra działają w innych płaszczyznach.',
        example: { code: 'powtorz 6 [powtorz 4 [np 40 pw 90] pp 30]', mode: '3d' },
      },
      {
        names: ['pl', 'przechyllewo', 'rl', 'rollleft'],
        arg: 'kąt w stopniach (wyrażenie)',
        text: 'Przechyla żółwia w lewo.',
        example: { code: 'pl 90 powtorz 4 [np 40 pw 90]', mode: '3d' },
      },
    ],
  },
  {
    id: 'bledy',
    title: 'Błędy i limity',
    intro: [
      'Każdy błąd ma numer wiersza i kolumny, zaznaczenie w kodzie i opis po polsku. Program jest sprawdzany w całości, zanim żółw ruszy: jeśli jest w nim błąd zapisu (nieznane polecenie, brak argumentu, zły kolor, niedomknięty nawias, brak `już`, nieznana nazwa, `nrpowt` poza powtórz, polecenie 3D w trybie 2D), nic się nie narysuje.',
      'Grubość i liczba powtórzeń wpisane samymi liczbami są sprawdzane od razu. Gdy zależą od zmiennych, sprawdza je dopiero wykonanie. Błędy w czasie działania — dzielenie przez zero, zmienna bez wartości, przekroczony limit — zatrzymują żółwia, ale to, co już narysował, zostaje.',
      'Zły argument wskazujemy na jego pierwszym znaku, a brakujący tam, gdzie powinien się zacząć.',
    ],
    table: {
      head: ['Limit', 'Wartość'],
      rows: [
        ['Długość programu', '50 000 znaków'],
        ['Elementy programu (liczby, nazwy, działania, nawiasy, przecinki)', '10 000'],
        ['Zagnieżdżenie nawiasów [ ]', '32 poziomy'],
        ['Jednocześnie trwające wywołania procedur i powtórzenia', '32'],
        ['Wykonane operacje', '10 000: każde polecenie, niech, warunek, powtórz i wywołanie, oraz jedna za zakończenie każdego obrotu pętli, bloku warunku i wywołania'],
        ['Odcinki na planszy', '10 000 (czyść zeruje licznik)'],
        ['Współrzędne żółwia', 'od −100 000 do 100 000'],
        ['Grubość', 'liczba całkowita 1–12'],
        ['Liczba powtórzeń', 'liczba całkowita 0–10 000'],
      ],
    },
  },
  {
    id: 'pliki',
    title: 'Zapisywanie i dzielenie się',
    intro: [
      'Szkic każdego trybu zapisuje się sam w tej przeglądarce i wraca po odświeżeniu strony. Menu Plik pozwala otworzyć plik `.logo`, pobrać program jako plik `.logo`, skopiować link do programu i zapisać rysunek jako PNG.',
      'Link zawiera cały program i tryb. Kto go otworzy, zobaczy program w edytorze i gotowy rysunek. Wczytanie przykładu, linku albo pliku nigdy nie kasuje twojego szkicu bez śladu: poprzedni szkic jest zachowany i można go przywrócić z powiadomienia albo z menu Plik.',
    ],
  },
  {
    id: 'skroty',
    title: 'Skróty klawiszowe',
    intro: ['Skróty działają w pracowni, także wtedy, gdy piszesz w edytorze.'],
  },
];
