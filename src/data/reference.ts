import type { Mode } from '../lang/types';

export interface RefExample {
  code: string;
  mode: Mode;
  /** The example demonstrates an error on purpose. */
  error?: boolean;
}

export interface RefCommand {
  names: string[];
  en: string[];
  syntax: string;
  desc: string;
  example: RefExample;
  only3d?: boolean;
}

export interface RefSection {
  id: string;
  title: string;
  intro: string[];
  commands?: RefCommand[];
  examples?: (RefExample & { caption: string })[];
  table?: { head: string[]; rows: string[][] };
}

export const REFERENCE: RefSection[] = [
  {
    id: 'start',
    title: 'Jak działa żółw',
    intro: [
      'Logo steruje żółwiem, który chodzi po ekranie i zostawia ślad. Program to ciąg poleceń: żółw wykonuje je po kolei, od góry do dołu.',
      'Układ współrzędnych jest prawoskrętny: oś X biegnie w prawo, oś Y do przodu (w górę ekranu), a oś Z – w górę „z kartki”. Płaszczyzna 2D to płaszczyzna XY, czyli z = 0.',
      'Żółw startuje w punkcie (0, 0, 0), patrzy wzdłuż osi +Y, ma pióro opuszczone, kolor `#16866a` i grubość 3. Jednostka długości jest umowna, kąty podajemy w stopniach.',
      'Tryb 2D i tryb 3D używają tego samego języka. Program złożony wyłącznie z poleceń płaskich rysuje w obu trybach dokładnie ten sam kształt; polecenia `gora`, `dol`, `pp` i `pl` są dostępne tylko w trybie 3D.',
    ],
    examples: [
      { caption: 'Pierwszy program: kwadrat o boku 100.', mode: '2d', code: 'powtorz 4 [np 100 pw 90]' },
    ],
  },
  {
    id: 'ruch',
    title: 'Ruch i skręty',
    intro: ['Polecenia ruchu i skrętu wymagają jednego argumentu – wyrażenia (patrz „Wyrażenia”). Każde z nich ma polską i angielską nazwę; wszystkie warianty są równoważne.'],
    commands: [
      { names: ['np', 'naprzod', 'naprzód'], en: ['fd', 'forward'], syntax: 'np odległość', desc: 'Przesuwa żółwia o podaną odległość zgodnie z jego kierunkiem. Gdy pióro jest opuszczone i położenie się zmienia, rysuje odcinek. Przesunięcie o 0 niczego nie rysuje.', example: { mode: '2d', code: 'np 150' } },
      { names: ['ws', 'wstecz'], en: ['bk', 'back'], syntax: 'ws odległość', desc: 'Cofa żółwia o podaną odległość (to samo co `np` z liczbą przeciwną). Kierunek żółwia się nie zmienia.', example: { mode: '2d', code: 'np 100\nws 40' } },
      { names: ['pw', 'prawo'], en: ['rt', 'right'], syntax: 'pw kąt', desc: 'Skręca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry) o podaną liczbę stopni. Kąt może być ułamkiem i może być ujemny – wtedy skręt jest w drugą stronę.', example: { mode: '2d', code: 'np 80\npw 120\nnp 80' } },
      { names: ['lw', 'lewo'], en: ['lt', 'left'], syntax: 'lw kąt', desc: 'Skręca żółwia w lewo o podaną liczbę stopni.', example: { mode: '2d', code: 'np 80\nlw 60\nnp 80' } },
      { names: ['dom'], en: ['home'], syntax: 'dom', desc: 'Przenosi żółwia do punktu (0, 0, 0) i przywraca kierunek początkowy. Jeśli pióro jest opuszczone, a żółw nie stał w punkcie startowym, rysuje odcinek powrotny. Kolor, grubość i stan pióra się nie zmieniają.', example: { mode: '2d', code: 'np 100\npw 90\nnp 100\ndom' } },
      { names: ['czysc', 'czyść'], en: ['cs', 'clearscreen'], syntax: 'czyść', desc: 'Usuwa wszystkie dotychczas narysowane odcinki. Położenie, kierunek, kolor i grubość zostają bez zmian.', example: { mode: '2d', code: 'powtorz 4 [np 60 pw 90]\nczyść\nnp 100' } },
    ],
  },
  {
    id: 'piorko',
    title: 'Pióro, kolor i grubość',
    intro: ['Stan pióra, kolor i grubość obowiązują, dopóki ich nie zmienisz.'],
    commands: [
      { names: ['pod', 'podnies', 'podnieś'], en: ['pu', 'penup'], syntax: 'pod', desc: 'Podnosi pióro: żółw chodzi, ale nie zostawia śladu.', example: { mode: '2d', code: 'np 50\npod\nnp 50\nopu\nnp 50' } },
      { names: ['opu', 'opusc', 'opuść'], en: ['pd', 'pendown'], syntax: 'opu', desc: 'Opuszcza pióro: ruch żółwia znów rysuje.', example: { mode: '2d', code: 'pod np 60 opu\npowtorz 3 [np 60 pw 120]' } },
      { names: ['kolor'], en: ['color'], syntax: 'kolor "#rrggbb"', desc: 'Ustawia kolor pióra. Kolor to napis w cudzysłowie: znak # i dokładnie sześć cyfr szesnastkowych (wielkość liter nie ma znaczenia).', example: { mode: '2d', code: 'kolor "#c1763d"\npowtorz 3 [np 100 pw 120]' } },
      { names: ['grubosc', 'grubość'], en: ['width'], syntax: 'grubość liczba', desc: 'Ustawia grubość kreski. Wartość musi być liczbą całkowitą od 1 do 12.', example: { mode: '2d', code: 'grubosc 1\nnp 60\ngrubosc 6\nnp 60' } },
    ],
  },
  {
    id: 'trzy-d',
    title: 'Polecenia przestrzenne (3D)',
    intro: [
      'W przestrzeni żółw ma trzy wzajemnie prostopadłe kierunki: przód (kierunek ruchu), prawo i górę. Skręty obracają je razem, jak sztywny układ.',
      '`pw` i `lw` obracają żółwia wokół jego „góry”. Poniższe cztery polecenia działają wyłącznie w trybie 3D – w trybie 2D są błędem.',
    ],
    commands: [
      { names: ['gora', 'góra'], en: ['pitchup'], syntax: 'góra kąt', desc: 'Unosi nos żółwia: przód obraca się w stronę „góry” wokół wektora „prawo”. Po `gora 90` żółw idzie dokładnie tam, gdzie wcześniej była jego góra.', only3d: true, example: { mode: '3d', code: 'np 60\ngora 90\nnp 60' } },
      { names: ['dol', 'dół'], en: ['pitchdown'], syntax: 'dół kąt', desc: 'Opuszcza nos żółwia – obrót odwrotny do `gora`.', only3d: true, example: { mode: '3d', code: 'np 60\ndol 90\nnp 60' } },
      { names: ['pp', 'przechylprawo'], en: ['rr', 'rollright'], syntax: 'pp kąt', desc: 'Przechyla żółwia w prawo wokół jego kierunku: „góra” obraca się w stronę „prawo”, a kierunek ruchu się nie zmienia. Po `pp 90` górą żółwia jest dawne prawo, a prawą stroną – dawny dół.', only3d: true, example: { mode: '3d', code: 'pp 90\ngora 90\nnp 80' } },
      { names: ['pl', 'przechyllewo'], en: ['rl', 'rollleft'], syntax: 'pl kąt', desc: 'Przechyla żółwia w lewo – obrót odwrotny do `pp`.', only3d: true, example: { mode: '3d', code: 'pl 90\ngora 90\nnp 80' } },
    ],
    examples: [
      { caption: 'Okrąg przechylony o 30° względem płaszczyzny.', mode: '3d', code: 'kolor "#a478c0"\ngora 30\npowtorz 36 [np 12 pw 10]' },
    ],
  },
  {
    id: 'powtarzanie',
    title: 'Powtarzanie',
    intro: [
      '`powtorz n [ … ]` wykonuje polecenia w nawiasach kwadratowych `n` razy. Liczba powtórzeń musi być liczbą całkowitą od 0 do 10 000 (0 oznacza, że ciało się nie wykona). Powtórzenia można zagnieżdżać.',
      '`nrpowt` (po angielsku `repcount`) to wartość, nie polecenie: numer bieżącego obrotu najbliższego otaczającego powtórzenia, licząc od 1. Obowiązuje zasada leksykalna – `nrpowt` musi stać wewnątrz nawiasów powtórzenia w tekście programu. Użyte w procedurze poza jej własnym powtórzeniem albo na najwyższym poziomie programu jest błędem, nawet jeśli procedurę wywołano z wnętrza powtórzenia.',
    ],
    commands: [
      { names: ['powtorz', 'powtórz'], en: ['repeat'], syntax: 'powtórz liczba [ polecenia ]', desc: 'Wykonuje polecenia zadaną liczbę razy.', example: { mode: '2d', code: 'powtorz 6 [np 70 pw 60]' } },
      { names: ['nrpowt'], en: ['repcount'], syntax: 'nrpowt', desc: 'Numer bieżącego powtórzenia (1, 2, 3, …). Może stać w każdym wyrażeniu wewnątrz powtórzenia.', example: { mode: '2d', code: 'powtorz 8 [np nrpowt * 12 pw 90]' } },
    ],
    examples: [
      { caption: 'Zagnieżdżone powtórzenia – `nrpowt` dotyczy zawsze najbliższego z nich.', mode: '2d', code: 'powtorz 12 [\n  powtorz 4 [np 80 pw 90]\n  pw 30\n]' },
    ],
  },
  {
    id: 'zmienne',
    title: 'Zmienne',
    intro: [
      '`niech nazwa wyrażenie` nadaje zmiennej wartość; kolejne `niech` z tą samą nazwą zmienia ją. Nazwa nie może być nazwą polecenia ani procedury.',
      'Na najwyższym poziomie programu `niech` tworzy zmienną globalną. Wewnątrz procedury `niech` tworzy zmienną lokalną dla danego wywołania: przesłania globalną o tej samej nazwie i znika, gdy wywołanie się kończy. Parametr też można zmienić przez `niech`.',
      'Nazwy wolno użyć w wyrażeniu, jeśli jest parametrem otaczającej procedury, jest przypisana przez `niech` gdziekolwiek w ciele tej procedury albo gdziekolwiek na najwyższym poziomie programu (także niżej niż użycie). W przeciwnym razie to błąd przy wczytywaniu programu. Odczyt zmiennej, która jeszcze nie ma wartości, jest błędem w trakcie działania.',
      'Wielkość liter w nazwach nie ma znaczenia. Zmienne można też zapisywać w dawnej formie z dwukropkiem: `:bok`.',
    ],
    commands: [
      { names: ['niech'], en: ['let'], syntax: 'niech nazwa wyrażenie', desc: 'Przypisuje wartość wyrażenia zmiennej.', example: { mode: '2d', code: 'niech bok 40\npowtorz 5 [\n  powtorz 4 [np bok pw 90]\n  niech bok bok + 20\n  pw 15\n]' } },
    ],
  },
  {
    id: 'wyrazenia',
    title: 'Wyrażenia',
    intro: [
      'Wszędzie tam, gdzie polecenie przyjmuje liczbę, można podać wyrażenie: liczbę (`80`, `12.5`, `.5`), nazwę (parametr lub zmienną, także jako `:nazwa`), `nrpowt`, wyrażenie w nawiasach, znak `+` lub `-` przed którymkolwiek z nich albo dwa wyrażenia połączone znakiem `+`, `-`, `*` lub `/`.',
      '`*` i `/` wiążą mocniej niż `+` i `-`; działania o równym priorytecie liczymy od lewej: `np 20 - 5 - 3` przesuwa o 12, a `np 2 + 3 * 4` o 14. Znaki jednoargumentowe można piętrzyć: `np -(3 - 5)`, `np - -2`.',
      'Liczby to zapis dziesiętny bez znaku (znak jest działaniem). Zapisy `1e3`, `0x10`, `NaN` i `Infinity` nie są liczbami i dają błąd.',
      'Odstępy wokół działania: znak `+ - * /` jako działanie dwuargumentowe musi mieć spację po obu stronach albo po żadnej. `np 10 - 5` i `np 10-5` przesuwają o 5. Natomiast `np 10 -5` to `np 10` i osobne, błędne `-5` – dzięki temu przy wywołaniach procedur `kw 40 -5` oznacza dwa argumenty. Ta zasada nie dotyczy porównań.',
      'Dzielenie przez zero i każdy wynik nieskończony lub nieokreślony kończą program błędem w czasie działania. Porównania są dokładne, bez zaokrągleń: `0.1 + 0.2 = 0.3` jest fałszem.',
    ],
    examples: [
      { caption: 'Priorytety i nawiasy.', mode: '2d', code: 'np 2 + 3 * 4\npw 90\nnp (2 + 3) * 4' },
      { caption: 'Znaki jednoargumentowe.', mode: '2d', code: 'niech bok 50\nnp -bok\npw 90\nnp - -bok' },
      { caption: 'Błąd: `-5` po spacji jest osobnym, zbędnym elementem.', mode: '2d', code: 'np 10 -5', error: true },
      { caption: 'Błąd: dzielenie przez zero (rysunek sprzed błędu zostaje).', mode: '2d', code: 'np 50\nnp 1 / 0', error: true },
    ],
  },
  {
    id: 'warunki',
    title: 'Warunki',
    intro: [
      'Warunek to `wyrażenie porównanie wyrażenie`, gdzie porównanie to jedno z: `<` `>` `=` `<=` `>=` `<>` (różne).',
      'Ciała warunków mogą zawierać wszystko, co ciało powtórzenia, w tym kolejne warunki, powtórzenia i wywołania procedur.',
    ],
    commands: [
      { names: ['jesli', 'jeśli'], en: ['if'], syntax: 'jeśli warunek [ polecenia ]', desc: 'Wykonuje polecenia tylko wtedy, gdy warunek jest prawdziwy.', example: { mode: '2d', code: 'powtorz 10 [\n  np 30\n  jeśli nrpowt > 5 [pw 45]\n]' } },
      { names: ['jezeli', 'jeżeli'], en: ['ifelse'], syntax: 'jeżeli warunek [ gdy prawda ] [ gdy fałsz ]', desc: 'Wykonuje pierwsze ciało, gdy warunek jest prawdziwy, a w przeciwnym razie drugie.', example: { mode: '2d', code: 'niech zmiana 1\npowtorz 20 [\n  jeżeli zmiana > 0 [kolor "#16866a"] [kolor "#c1763d"]\n  niech zmiana -zmiana\n  np nrpowt * 4\n  pw 90\n]' } },
    ],
  },
  {
    id: 'procedury',
    title: 'Procedury',
    intro: [
      'Własne polecenie definiujesz słowem `oto` (po angielsku `to`) na początku wiersza, po którym w tym samym wierszu podajesz nazwę i opcjonalnie `ma:` z listą parametrów oddzielonych przecinkami. Ciało zajmuje kolejne wiersze i kończy się słowem `już` (także `juz`, `end`) samotnie w osobnym wierszu.',
      'Dawny nagłówek `oto kwadrat :bok :kąt` także jest poprawny; w ciele parametr można zapisać jako `:bok` albo po prostu `bok`.',
      'Wywołanie to nazwa i dokładnie tyle argumentów, ile procedura ma parametrów, oddzielonych odstępami. Każdy argument jest wyrażeniem: `kwadrat 40 * 2 90` przekazuje 80 i 90. Parametr może mieć taką samą nazwę jak procedura – w miejscu polecenia nazwa oznacza wywołanie, a w miejscu argumentu parametr.',
      'Definicje wolno umieszczać wyłącznie na najwyższym poziomie (nie w powtórzeniu, warunku ani innej procedurze); mogą stać przed wywołaniami lub po nich, a nazwę można zdefiniować tylko raz. Procedury mogą wywoływać same siebie (rekurencja) i siebie nawzajem. Procedury nie zwracają wartości.',
      '`stop` kończy bieżące wywołanie procedury od razu – także wtedy, gdy stoi wewnątrz powtórzenia lub warunku. Na najwyższym poziomie kończy cały program.',
    ],
    commands: [
      { names: ['oto', 'to'], en: [], syntax: 'oto nazwa ma: parametr, parametr …\n  polecenia\njuż', desc: 'Definiuje procedurę. `już` (także `juz`, `end`) musi stać samo w wierszu.', example: { mode: '2d', code: 'oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\n\nkwadrat 40\nkwadrat 80\nkwadrat 120' } },
      { names: ['stop'], en: ['stop'], syntax: 'stop', desc: 'Kończy bieżącą procedurę (albo program, jeśli stoi na najwyższym poziomie).', example: { mode: '2d', code: 'oto spirala ma: dł\n  jeśli dł > 120 [stop]\n  np dł\n  pw 90\n  spirala dł + 8\njuż\n\nspirala 5' } },
    ],
    examples: [
      { caption: 'Rekurencja: drzewo, w którym każda gałąź rysuje dwie mniejsze.', mode: '2d', code: 'oto gałąź ma: dł\n  jeśli dł < 8 [stop]\n  np dł\n  lw 30\n  gałąź dł * 0.7\n  pw 60\n  gałąź dł * 0.7\n  lw 30\n  ws dł\njuż\n\ngałąź 60' },
      { caption: 'Stara forma nagłówka i parametrów z dwukropkiem.', mode: '2d', code: 'oto bok :dł :kąt\n  np :dł\n  pw :kąt\njuż\n\npowtorz 5 [bok 100 144]' },
    ],
  },
  {
    id: 'zapis',
    title: 'Zapis programu',
    intro: [
      'Wielkość liter nie ma znaczenia w słowach kluczowych ani w nazwach. Polskie litery diakrytyzowane można zastąpić zwykłymi: `naprzód` i `naprzod`, `czyść` i `czysc`, `już` i `juz` znaczą to samo.',
      'Odstęp (spacja, tabulator, nowy wiersz) oddziela elementy programu. Nowe wiersze mają znaczenie tylko w nagłówku i zakończeniu procedury.',
      'Średnik zaczyna komentarz, który trwa do końca wiersza.',
      'Nawiasy kwadratowe `[` `]` otaczają ciała powtórzeń i warunków; nawiasy okrągłe `(` `)` grupują wyrażenia. Kolor zapisujemy jako `"#16866a"`.',
    ],
    examples: [
      { caption: 'Komentarze i różne zapisy tego samego polecenia.', mode: '2d', code: '; Kwadrat zapisany na kilka sposobów\nNP 50 Pw 90\nnaprzód 50 PRAWO 90\nFD 50 RT 90\nforward 50 right 90' },
    ],
  },
  {
    id: 'bledy',
    title: 'Błędy i limity',
    intro: [
      'Każdy błąd ma wiersz i kolumnę (liczone od 1) oraz opis po polsku; edytor podkreśla miejsce błędu. Błąd niewłaściwego argumentu (zła grubość lub liczba powtórzeń, dzielenie przez zero, wynik nieskończony, zmienna bez wartości) wskazuje pierwszy element tego argumentu, a nie polecenie. Brakujący argument jest wskazany w miejscu, gdzie powinien się zacząć, albo na poleceniu, jeśli program na nim się kończy. Zbędna wartość tam, gdzie powinno stać polecenie, jest wskazana na tej wartości.',
      'Program jest sprawdzany w całości, zanim cokolwiek narysuje: przy błędzie wczytywania (nieznane polecenie, niezamknięty nawias, zły kolor, złe wywołanie procedury, `nrpowt` poza powtórzeniem, nieznana nazwa, polecenie 3D w trybie 2D, brak `już`, grubość lub liczba powtórzeń zapisana samymi liczbami spoza zakresu) nic nie powstaje. Błędy, które wychodzą dopiero w trakcie (przekroczony limit, dzielenie przez zero, zmienna bez wartości, zła grubość lub liczba powtórzeń obliczona z nazwy) zatrzymują program, ale to, co do tej pory narysowano, zostaje.',
    ],
    table: {
      head: ['Limit', 'Wartość'],
      rows: [
        ['Długość programu', '50 000 znaków'],
        ['Elementy programu (liczby, nazwy, operatory, nawiasy, przecinki)', '10 000'],
        ['Zagnieżdżenie nawiasów', '32'],
        ['Jednocześnie aktywne wywołania procedur i powtórzenia', '32'],
        ['Wykonane operacje (każde polecenie, `niech`, warunek, powtórzenie i wywołanie, plus 1 za zakończenie każdego obrotu powtórzenia, ciała warunku i wywołania)', '10 000'],
        ['Zachowane odcinki', '10 000'],
        ['Współrzędne', 'od −100 000 do 100 000'],
        ['Liczba powtórzeń', 'od 0 do 10 000'],
        ['Grubość', 'od 1 do 12 (liczba całkowita)'],
      ],
    },
    examples: [
      { caption: 'Błąd wczytywania: nieznane polecenie – nic nie zostanie narysowane.', mode: '2d', code: 'np 100\nskocz 20', error: true },
      { caption: 'Błąd wykonania: za dużo operacji – rysunek sprzed błędu zostaje.', mode: '2d', code: 'powtorz 10000 [np 1 pw 1]', error: true },
    ],
  },
];
