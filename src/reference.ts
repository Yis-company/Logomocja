export const commands = [
  [
    "Ruch",
    "np · naprzod · naprzód · fd · forward",
    "Odległość (wyrażenie)",
    "Przesuwa żółwia wzdłuż jego kierunku. Z opuszczonym pisakiem rysuje odcinek.",
    "np 100",
  ],
  [
    "Ruch",
    "ws · wstecz · bk · back",
    "Odległość (wyrażenie)",
    "Cofa żółwia, zachowując jego orientację.",
    "ws 40",
  ],
  [
    "Obrót",
    "pw · prawo · rt · right",
    "Kąt w stopniach",
    "Obraca w prawo wokół własnego wektora „góra”.",
    "pw 90",
  ],
  [
    "Obrót",
    "lw · lewo · lt · left",
    "Kąt w stopniach",
    "Obraca w lewo. Ujemny kąt odwraca kierunek obrotu.",
    "lw 45",
  ],
  [
    "Pisak",
    "pod · podnies · podnieś · pu · penup",
    "Bez argumentów",
    "Podnosi pisak. Kolejne ruchy nie rysują.",
    "pod np 50",
  ],
  [
    "Pisak",
    "opu · opusc · opuść · pd · pendown",
    "Bez argumentów",
    "Opuszcza pisak. Kolejne ruchy zostawiają ślad.",
    "opu np 50",
  ],
  [
    "Pisak",
    "kolor · color",
    'Kolor "#rrggbb"',
    "Ustawia kolor pisaka. Dokładnie sześć cyfr szesnastkowych, w cudzysłowie.",
    'kolor "#2b6fb3"',
  ],
  [
    "Pisak",
    "grubosc · grubość · width",
    "Całkowita liczba 1–12",
    "Ustawia grubość następnych odcinków.",
    "grubosc 4",
  ],
  [
    "Sterowanie",
    "powtorz · powtórz · repeat",
    "Liczba 0–10000 [polecenia]",
    "Powtarza blok. Liczba powtórzeń musi być całkowita.",
    "powtorz 4 [np 80 pw 90]",
  ],
  [
    "Zmienne",
    "niech · let",
    "Nazwa i wyrażenie",
    "Tworzy lub zmienia zmienną. W procedurze zapis jest lokalny dla wywołania.",
    "niech bok 80\nnp bok",
  ],
  [
    "Warunki",
    "jeśli · jesli · if",
    "Warunek [polecenia]",
    "Wykonuje blok tylko wtedy, gdy warunek jest prawdziwy.",
    "jeśli 3 < 5 [np 80]",
  ],
  [
    "Warunki",
    "jeżeli · jezeli · ifelse",
    "Warunek [tak] [nie]",
    "Wybiera jeden z dwóch bloków.",
    "jeżeli 2 = 3 [np 40] [np 80]",
  ],
  [
    "Sterowanie",
    "stop",
    "Bez argumentów",
    "Kończy bieżące wywołanie procedury. Na głównym poziomie kończy program, również wewnątrz bloku.",
    "np 50 stop np 100",
  ],
  [
    "Plansza",
    "dom · home",
    "Bez argumentów",
    "Wraca do początku i przywraca orientację +Y, prawo +X, góra +Z. Z opuszczonym pisakiem rysuje powrót.",
    "np 80 pw 90 np 40 dom",
  ],
  [
    "Plansza",
    "czyść · czysc · cs · clearscreen",
    "Bez argumentów",
    "Usuwa odcinki. Pozycja, orientacja i ustawienia pisaka pozostają.",
    "np 50 czyść np 80",
  ],
  [
    "Przestrzeń 3D",
    "gora · góra · pitchup",
    "Kąt w stopniach",
    "Unosi nos ku własnej górze, wokół prawego boku. Wyłącznie 3D.",
    "gora 90 np 80",
  ],
  [
    "Przestrzeń 3D",
    "dol · dół · pitchdown",
    "Kąt w stopniach",
    "Opuszcza nos. Obrót przeciwny do „gora”. Wyłącznie 3D.",
    "dol 30 np 80",
  ],
  [
    "Przestrzeń 3D",
    "pp · przechylprawo · rr · rollright",
    "Kąt w stopniach",
    "Przechyla górę w stronę prawego boku, wokół kierunku żółwia. Nie zmienia kierunku. Wyłącznie 3D.",
    "pp 90 gora 30 np 80",
  ],
  [
    "Przestrzeń 3D",
    "pl · przechyllewo · rl · rollleft",
    "Kąt w stopniach",
    "Przechyla w lewo, przeciwnie do „pp”. Wyłącznie 3D.",
    "pl 45 gora 45 np 80",
  ],
  [
    "Wartość",
    "nrpowt · repcount",
    "Wartość w wyrażeniu",
    "Numer bieżącego obiegu najbardziej wewnętrznej pętli, od 1. Nie jest poleceniem. Musi być zapisany leksykalnie w bloku powtórzenia.",
    "powtorz 8 [np nrpowt * 10 pw 90]",
  ],
  [
    "Procedury",
    "oto · to / już · juz · end",
    "Nazwa, opcjonalne parametry",
    "Definicja zaczyna się jako pierwsze słowo linii. Nagłówek jest w jednej linii, ciało od następnej, „już” samo w linii.",
    "oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 80 90",
  ],
];
export const referenceIntro = `<h2>Mały język, dużo możliwości.</h2><p>Żółw zaczyna w punkcie (0, 0, 0), patrząc do góry planszy: w kierunku +Y. Jego prawy bok wskazuje +X, a własna góra +Z. Pisak jest opuszczony, zielony (#16866a), o grubości 3. Zacznij od <code>np 100</code>, a potem dodaj skręt.</p>`;
export const referenceDetails = `
<section id="expressions"><h2>Wyrażenia i zapis</h2><p>Nazwy poleceń, procedur, parametrów i zmiennych ignorują wielkość liter. Nazwa zaczyna się literą lub podkreśleniem; dalej może zawierać litery, cyfry i podkreślenia. Polskie litery są dozwolone. Komentarz zaczyna się średnikiem <code>;</code> i trwa do końca linii. Białe znaki oddzielają słowa, a nowe linie mają znaczenie tylko dla definicji procedur.</p><p>Liczby to <code>80</code>, <code>12.5</code> lub <code>.5</code>. Znak jest osobnym operatorem. Zapisy <code>1e3</code>, <code>0x10</code>, <code>NaN</code> i <code>Infinity</code> są błędne. Kolory mają postać <code>"#16866a"</code>.</p><p>Możesz użyć liczby, zmiennej, parametru (także <code>:bok</code>), <code>nrpowt</code>, nawiasów okrągłych oraz operatorów <code>+ - * /</code>. Mnożenie i dzielenie mają pierwszeństwo. Operatory o tym samym priorytecie liczą od lewej: <code>20 - 5 - 3</code> daje 12, a <code>2 + 3 * 4</code> daje 14.</p><p>Operator binarny musi mieć odstęp z obu stron albo z żadnej: <code>np 10 - 5</code> i <code>np 10-5</code> są poprawne. <code>np 10 -5</code> zawiera zbędny argument i jest błędem. Reguła dotyczy także +, * i /. Znaki jednoargumentowe można łączyć: <code>np - -2</code>, <code>np -(3 - 5)</code>, <code>np -bok</code>. Dzielenie przez zero i wynik nieskończony zatrzymują wykonanie.</p></section>
<section id="variables"><h2>Zmienne, pętle i warunki</h2><p><code>niech bok 80</code> przypisuje wartość. Nazwa zmiennej nie może być poleceniem ani nazwą procedury. Zmienna globalna jest widoczna w procedurach. Wewnątrz wywołania <code>niech</code> tworzy lokalną zmienną, która od tego przypisania przesłania globalną i znika po zakończeniu wywołania. Można zmieniać parametry.</p><p>Odczyt nazwy jest poprawny składniowo, jeśli jest parametrem lub ma przypisanie gdziekolwiek w bieżącej procedurze bądź na głównym poziomie — także później lub w niewykonanej gałęzi. Odczyt przed faktycznym przypisaniem jest błędem wykonania.</p><p><code>powtorz 5 [np nrpowt * 10 pw 90]</code> wykonuje pięć obiegów. <code>nrpowt</code> odwołuje się do najbardziej wewnętrznego powtórzenia zapisanego w kodzie. Procedura bez własnej pętli nie może korzystać z licznika pętli, która ją wywołała.</p><p>Warunek zawiera dwa wyrażenia i porównanie: <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code>. Odstępy wokół porównania są dowolne. Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem ze względu na zapis zmiennoprzecinkowy. Bloki w nawiasach kwadratowych można zagnieżdżać.</p></section>
<section id="procedures"><h2>Własne procedury</h2><pre><code>oto wielokąt ma: boki, bok\n  powtorz boki [np bok pw 360 / boki]\njuż\n\nwielokąt 6 60</code></pre><p>Alternatywny nagłówek to <code>oto wielokąt :boki :bok</code>. Parametry można odczytać jako <code>bok</code> lub <code>:bok</code>. Wywołanie bierze dokładnie tyle argumentów, ile jest parametrów. Każdy jest wyrażeniem: <code>wielokąt 6 30 * 2</code> przekazuje 6 i 60.</p><p>Definicje są tylko na głównym poziomie, przed lub po wywołaniach. Każda nazwa może być zdefiniowana raz. Parametr może nazywać się tak samo jak procedura. Dozwolone są rekurencja i wzajemne wywołania, bez wartości zwracanych. <code>stop</code> wewnątrz pętli lub warunku kończy całą bieżącą procedurę (albo cały program na głównym poziomie).</p></section>
<section id="geometry"><h2>Płaszczyzna i przestrzeń</h2><p>2D rysuje w płaszczyźnie XY, gdzie z = 0. 3D używa prawoskrętnego układu X, Y, Z. Płaskie polecenia dają te same współrzędne w obu trybach. Kąty są w stopniach, także ujemne i ułamkowe. Ruch o zero nic nie rysuje.</p><p><code>pw</code> obraca kierunek ku własnemu prawemu bokowi, wokół własnej góry. <code>gora 90</code> kieruje nos w stronę dawnej góry. <code>pp 90</code> kieruje górę w stronę dawnego prawego boku, a prawy bok w stronę dawnego dołu. Kolor, grubość i stan pisaka trwają do zmiany. <code>dom</code> nie zmienia pisaka. <code>czyść</code> usuwa wyłącznie odcinki.</p><p>Przeciągnij planszę, aby przesunąć widok w 2D lub obrócić kamerę w 3D. Shift + przeciąganie przesuwa kamerę 3D. Kółko lub gest dwoma palcami przybliża. Na aktywnej planszy strzałki przesuwają lub obracają, Shift + strzałki przesuwają w 3D, + i − zmieniają skalę, F lub 0 dopasowuje widok. Renderer przestrzenny Canvas działa bez WebGL.</p></section>
<section id="limits"><h2>Błędy i limity</h2><p>Cały program jest sprawdzany przed rysowaniem. Błąd składniowy nie rysuje niczego. Błąd podczas wykonania zachowuje wcześniejsze odcinki, z uwzględnieniem wykonanego <code>czyść</code>. Komunikat wskazuje linię i kolumnę od 1. Błędna wartość argumentu wskazuje pierwszy znak jego wyrażenia.</p><p>Stała grubość i liczba powtórzeń są sprawdzane przed uruchomieniem. Wartości zależne od nazw są sprawdzane w trakcie. Nieprzypisana zmienna, dzielenie przez zero i przekroczenie limitu są błędami wykonania.</p><ul><li>50 000 znaków źródła i 10 000 tokenów (także operatorów, nawiasów i przecinków).</li><li>32 poziomy nawiasów kwadratowych.</li><li>32 aktywne ramki wywołań procedur i powtórzeń. Warunki nie tworzą ramek.</li><li>10 000 operacji: każde polecenie, przypisanie, warunek, powtórzenie i wywołanie; dodatkowo koniec każdego obiegu pętli, wykonanego bloku warunku i wywołania. Koniec programu i obliczanie wyrażeń nie kosztują operacji.</li><li>10 000 aktualnie zachowanych odcinków. Czyść zwalnia miejsce.</li><li>Każda współrzędna w zakresie od −100 000 do +100 000.</li></ul></section>
<section id="shortcuts"><h2>Skróty i twoje pliki</h2><p><kbd>Ctrl / ⌘ + Enter</kbd> uruchamia lub wznawia, <kbd>F10</kbd> wykonuje krok, <kbd>F8</kbd> wstrzymuje lub wznawia, <kbd>Shift + Escape</kbd> resetuje. Edycja podczas animacji wstrzymuje ją i przygotowuje nowy program do następnego uruchomienia.</p><p>Szkic każdego trybu zapisuje się lokalnie. Przykłady zachowują poprzedni program w historii szkiców. Udostępnij kopiuje adres z zakodowanym programem i trybem. Odbiorca uruchamia go automatycznie. Plik .logo zawiera zwykły tekst UTF-8. PNG zapisuje bieżący widok planszy. Dane nie opuszczają przeglądarki; link udostępniasz samodzielnie.</p></section>`;
