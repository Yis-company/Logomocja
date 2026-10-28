import { type Mode } from '../lang/limits';

export interface RefCommand {
  /** Spellings as they can be typed, Polish first. */
  names: string;
  argument: string;
  summary: string;
  example: string;
  mode: Mode;
}

export const REF_COMMANDS: readonly RefCommand[] = [
  { names: 'np, naprzód, fd, forward', argument: 'liczba (wyrażenie)', summary: 'Przesuwa żółwia do przodu o podaną odległość. Gdy pisak jest opuszczony, rysuje odcinek.', example: 'np 100\npw 90\nnp 50', mode: '2d' },
  { names: 'ws, wstecz, bk, back', argument: 'liczba (wyrażenie)', summary: 'Przesuwa żółwia do tyłu o podaną odległość.', example: 'np 100\nws 50', mode: '2d' },
  { names: 'pw, prawo, rt, right', argument: 'kąt w stopniach', summary: 'Obraca żółwia w prawo (zgodnie z ruchem wskazówek zegara, patrząc z góry).', example: 'np 80 pw 90 np 80', mode: '2d' },
  { names: 'lw, lewo, lt, left', argument: 'kąt w stopniach', summary: 'Obraca żółwia w lewo. Ujemny kąt obraca w drugą stronę.', example: 'np 80 lw 90 np 80', mode: '2d' },
  { names: 'pod, podnieś, pu, penup', argument: 'brak', summary: 'Podnosi pisak. Ruchy nie rysują odcinków.', example: 'pod np 50 opu np 50', mode: '2d' },
  { names: 'opu, opuść, pd, pendown', argument: 'brak', summary: 'Opuszcza pisak. Kolejne ruchy rysują odcinki.', example: 'pod np 30 opu np 30', mode: '2d' },
  { names: 'kolor, color', argument: 'kolor w cudzysłowie, np. "#16866a"', summary: 'Ustawia kolor pisaka dla kolejnych odcinków. Kolor zapisuje się sześcioma cyframi szesnastkowymi.', example: 'kolor "#c1763d"\nnp 60', mode: '2d' },
  { names: 'grubosc, grubość, width', argument: 'liczba całkowita 1–12', summary: 'Ustawia grubość kreski dla kolejnych odcinków.', example: 'grubosc 6\nnp 60', mode: '2d' },
  { names: 'powtórz, powtorz, repeat', argument: 'liczba 0–10000, potem [ polecenia ]', summary: 'Wykonuje polecenia w nawiasach podaną liczbę razy.', example: 'powtorz 4 [np 80 pw 90]', mode: '2d' },
  { names: 'niech, let', argument: 'nazwa, potem wyrażenie', summary: 'Przypisuje wartość wyrażenia zmiennej. Ponowne niech zmienia wartość.', example: 'niech bok 40\npowtorz 4 [np bok pw 90]', mode: '2d' },
  { names: 'jeśli, jesli, if', argument: 'warunek, potem [ polecenia ]', summary: 'Wykonuje polecenia w nawiasach, gdy warunek jest prawdziwy.', example: 'niech x 3\njeśli x > 2 [np 50]', mode: '2d' },
  { names: 'jeżeli, jezeli, ifelse', argument: 'warunek, potem [ tak ] [ nie ]', summary: 'Wykonuje pierwszy blok, gdy warunek jest prawdziwy, a drugi w przeciwnym razie.', example: 'niech x 1\njeżeli x = 1 [kolor "#16866a"] [kolor "#c1763d"]\nnp 40', mode: '2d' },
  { names: 'stop', argument: 'brak', summary: 'Kończy bieżącą procedurę. Na poziomie programu kończy program.', example: 'oto krok ma: n\n  jeśli n = 0 [stop]\n  np 10\n  krok n - 1\njuż\nkrok 3', mode: '2d' },
  { names: 'dom, home', argument: 'brak', summary: 'Wraca żółwiem do punktu początkowego (0, 0) i kierunku w górę. Pisak i kolor zostają bez zmian.', example: 'np 80 pw 90\ndom\nnp 40', mode: '2d' },
  { names: 'czyść, czysc, cs, clearscreen', argument: 'brak', summary: 'Usuwa wszystkie dotychczas narysowane odcinki. Żółw zostaje na miejscu.', example: 'np 100\ncs\nnp 50', mode: '2d' },
  { names: 'gora, góra, pitchup', argument: 'kąt w stopniach', summary: 'Podnosi nos żółwia o kąt, obracając go wokół prawej strony. Tylko w trybie 3D.', example: 'gora 45 np 100', mode: '3d' },
  { names: 'dol, dół, pitchdown', argument: 'kąt w stopniach', summary: 'Opuszcza nos żółwia o kąt. Tylko w trybie 3D.', example: 'gora 45 np 100 dol 45 np 50', mode: '3d' },
  { names: 'pp, przechylprawo, rr, rollright', argument: 'kąt w stopniach', summary: 'Przechyla żółwia w prawo wokół kierunku ruchu. Kierunek się nie zmienia. Tylko w trybie 3D.', example: 'pp 45 np 50 pp -45', mode: '3d' },
  { names: 'pl, przechyllewo, rl, rollleft', argument: 'kąt w stopniach', summary: 'Przechyla żółwia w lewo wokół kierunku ruchu. Tylko w trybie 3D.', example: 'pl 45 np 50 pl -45', mode: '3d' },
];

export interface RefSection {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
}

export const REF_SECTIONS: readonly RefSection[] = [
  {
    id: 'start',
    title: 'Pierwsze kroki',
    paragraphs: [
      'Logomocja to język żółwia. Żółw zaczyna w punkcie (0, 0), patrząc w górę, z opuszczonym pisakiem. Każde polecenie przesuwa go albo zmienia jego kierunek, a gdy pisak jest opuszczony, zostawia za sobą kreskę.',
      'Wpisz program w edytorze i naciśnij Uruchom (Ctrl+Enter). Krok (Alt+K) wykonuje jedno polecenie, dzięki czemu widać, co się dzieje. Program działa w dwóch trybach: 2D rysuje na płaszczyźnie, a 3D w przestrzeni. Program złożony tylko z poleceń płaskich daje ten sam rysunek w obu trybach.',
    ],
  },
  {
    id: 'syntax',
    title: 'Zapis',
    paragraphs: [
      'Słowa kluczowe, nazwy procedur, zmiennych i parametrów nie rozróżniają wielkości liter. Polskie znaki działają tak samo jak wersje bez nich (naprzód i naprzod).',
      'Średnik zaczyna komentarz do końca wiersza. Odstępy oddzielają wyrazy; nowe wiersze mają znaczenie tylko przy definicjach procedur.',
      'Liczby zapisujemy w postaci 80, 12.5 albo .5. Znak minus jest operatorem, a nie częścią liczby. Zapisy 1e3, 0x10, NaN i Infinity są błędem.',
      'Nawiasy kwadratowe [ ] otaczają ciała powtórzeń i warunków i mogą być zagnieżdżone. Nawiasy okrągłe ( ) grupują wyrażenia.',
    ],
  },
  {
    id: 'expressions',
    title: 'Wyrażenia',
    paragraphs: [
      'Wyrażenie może być liczbą, nazwą zmiennej lub parametru, zapisem :nazwa (dawna forma), wartością nrpowt, nawiasem albo działaniem. Działania: + - * /. Mnożenie i dzielenie wiążą mocniej niż dodawanie i odejmowanie; działania tego samego rzędu liczymy od lewej.',
      'Operator dwuargumentowy musi mieć spację po obu stronach albo po żadnej: np 10 - 5 i np 10-5 są poprawne, a np 10 -5 nie jest.',
      'Znaki + i - można stawiać przed wyrażeniem i piętrzyć: np -(3 - 5), np - -2, np -bok.',
      'Dzielenie przez zero i wynik, który nie jest liczbą skończoną, to błąd wykonania.',
    ],
    items: ['np 20 - 5 - 3 przesuwa o 12', 'np 2 + 3 * 4 przesuwa o 14', 'Porównania są dokładne: jeśli 0.1 + 0.2 = 0.3 nie zadziała.'],
  },
  {
    id: 'variables',
    title: 'Zmienne',
    paragraphs: [
      'niech x 5 przypisuje zmiennej x wartość 5. Zmienna może być użyta, gdy została przypisana wcześniej w programie. Użycie nieznanej nazwy jest błędem składni, a odczyt zmiennej bez wartości jest błędem wykonania.',
      'Niech na poziomie programu tworzy zmienną globalną. Niech w procedurze tworzy zmienną lokalną dla tego wywołania: przesłania zmienną globalną o tej samej nazwie i znika po zakończeniu wywołania.',
    ],
  },
  {
    id: 'repeat',
    title: 'Powtarzanie',
    paragraphs: [
      'powtórz n [ ... ] wykonuje ciało n razy. n musi być liczbą całkowitą od 0 do 10000. Ciało może zawierać dowolne polecenia, w tym inne powtórzenia, warunki i wywołania procedur.',
      'Wewnątrz powtórzenia nrpowt (dawniej repcount) oznacza numer bieżącego obrotu pętli, liczony od 1. Dotyczy najbliższego otaczającego powtórzenia. Poza powtórzeniem użycie nrpowt jest błędem, także w procedurze wywoływanej z powtórzenia.',
    ],
  },
  {
    id: 'conditions',
    title: 'Warunki',
    paragraphs: [
      'Warunek to wyrażenie, porównanie i wyrażenie: x = 5, n < 3, a <> b. Dostępne porównania: = < > <= >= <>.',
      'jeśli warunek [ ... ] wykonuje ciało, gdy warunek jest prawdziwy. jeżeli warunek [ ... ] [ ... ] wybiera jedno z dwóch ciał. Ciała warunków nie są osobnymi ramkami wywołań.',
    ],
  },
  {
    id: 'procedures',
    title: 'Procedury',
    paragraphs: [
      'Definicja zaczyna się od oto (albo to) na początku wiersza, po niej nazwa i opcjonalnie ma: oraz lista parametrów rozdzielona przecinkami. Ciało składa się z kolejnych wierszy i kończy się słowem już (albo juz, end), które stoi samo w wierszu.',
      'Wywołanie podaje tyle argumentów, ile procedura ma parametrów, rozdzielonych odstępami. Każdy argument jest wyrażeniem, więc kwadrat 40 * 2 90 przekazuje 80 i 90.',
      'Stara forma nagłówka oto kwadrat :bok :kąt również działa. Parametr można użyć jako bok albo :bok.',
      'Procedury mogą wywoływać siebie. stop kończy bieżące wywołanie. Definicje muszą być na poziomie programu, nie wewnątrz powtórzenia, warunku ani innej procedury. Procedury nie zwracają wartości.',
    ],
    items: ['oto kwadrat ma: bok, kąt', '  powtórz 4 [np bok pw kąt]', 'już', '', 'kwadrat 80 90'],
  },
  {
    id: 'modes',
    title: 'Tryby 2D i 3D',
    paragraphs: [
      'W trybie 2D żółw porusza się na płaszczyźnie XY: +X w prawo, +Y w górę strony, a Z jest zawsze zerem. Polecenia gora, dol, pp i pl są w tym trybie błędem.',
      'W trybie 3D kierunek, prawa strona i góra żółwia tworzą układ prawoskrętny. gora podnosi nos, dol opuszcza nos, pp przechyla żółwia wokół kierunku ruchu, a pl przechyla w drugą stronę. Widok 3D można obracać, przesuwać i przybliżać.',
    ],
  },
  {
    id: 'errors',
    title: 'Błędy i limity',
    paragraphs: [
      'Błąd składni jest zgłaszany z numerem wiersza i kolumny, zanim cokolwiek zostanie narysowane. Błąd wykonania zatrzymuje program, a narysowane dotąd linie zostają na ekranie.',
      'Limity: 50 000 znaków źródła, 10 000 tokenów, zagnieżdżenie nawiasów [ ] do 32, do 32 ramek wywołań i powtórzeń naraz, 10 000 wykonanych operacji, 10 000 odcinków, współrzędne w zakresie ±100 000.',
    ],
  },
  {
    id: 'files',
    title: 'Zapis, link i pliki',
    paragraphs: [
      'Szkic każdego trybu zapisuje się w przeglądarce i przetrwa przeładowanie strony. Udostępnij tworzy link, który otwiera program w tym samym trybie i od razu go uruchamia.',
      'Zapisz .logo pobiera program jako zwykły plik tekstowy, a Otwórz .logo wczytuje taki plik. Eksport PNG zapisuje rysunek jako obraz.',
    ],
  },
];
