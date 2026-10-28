export type Reference = {
  name: string;
  aliases: string;
  args: string;
  text: string;
  example: string;
  group: string;
};
export const reference: Reference[] = [
  {
    name: "np",
    aliases: "naprzod · naprzód · fd · forward",
    args: "odległość",
    text: "Idź do przodu w kierunku żółwia. Liczby ujemne odwracają kierunek.",
    example: "np 80",
    group: "Ruch",
  },
  {
    name: "ws",
    aliases: "wstecz · bk · back",
    args: "odległość",
    text: "Cofnij się bez zmieniania kierunku patrzenia.",
    example: "ws 40",
    group: "Ruch",
  },
  {
    name: "pw",
    aliases: "prawo · rt · right",
    args: "kąt",
    text: "Skręć w prawo wokół własnej osi góry. Kąt podaj w stopniach.",
    example: "pw 90",
    group: "Ruch",
  },
  {
    name: "lw",
    aliases: "lewo · lt · left",
    args: "kąt",
    text: "Skręć w lewo. Wartość ujemna oznacza skręt w prawo.",
    example: "lw 45",
    group: "Ruch",
  },
  {
    name: "pod",
    aliases: "podnies · podnieś · pu · penup",
    args: "",
    text: "Podnieś pióro. Kolejne ruchy nie zostawiają śladu.",
    example: "pod np 50",
    group: "Pióro",
  },
  {
    name: "opu",
    aliases: "opusc · opuść · pd · pendown",
    args: "",
    text: "Opuść pióro. Żółw znowu rysuje przy każdym ruchu.",
    example: "opu np 50",
    group: "Pióro",
  },
  {
    name: "kolor",
    aliases: "color",
    args: '"#rrggbb"',
    text: "Ustaw kolor linii. Wymagane sześć cyfr szesnastkowych i cudzysłowy.",
    example: 'kolor "#16866a"',
    group: "Pióro",
  },
  {
    name: "grubość",
    aliases: "grubosc · width",
    args: "liczba",
    text: "Ustaw grubość pióra: liczba całkowita od 1 do 12.",
    example: "grubosc 3",
    group: "Pióro",
  },
  {
    name: "powtórz",
    aliases: "powtorz · repeat",
    args: "liczba [polecenia]",
    text: "Powtórz blok od 0 do 10 000 razy. Liczba musi być całkowita. Bloki mogą się zagnieżdżać.",
    example: "powtorz 4 [np 80 pw 90]",
    group: "Programowanie",
  },
  {
    name: "nrpowt",
    aliases: "repcount",
    args: "wartość",
    text: "Numer iteracji najbliższego powtórzenia, od 1. To wartość w wyrażeniu, nie polecenie. Powtórzenie musi otaczać zapis w tym samym ciele: procedura nie dziedziczy licznika z miejsca wywołania.",
    example: "powtorz 10 [np nrpowt * 5 pw 90]",
    group: "Programowanie",
  },
  {
    name: "niech",
    aliases: "let",
    args: "nazwa wyrażenie",
    text: "Utwórz lub zmień zmienną. Na poziomie programu jest globalna, wewnątrz procedury — lokalna dla tego wywołania. Parametry też można zmieniać. Lokalna wartość przesłania globalną do końca wywołania.",
    example: "niech bok 80\nnp bok * 2",
    group: "Programowanie",
  },
  {
    name: "jeśli",
    aliases: "jesli · if",
    args: "warunek [polecenia]",
    text: "Wykonaj blok, gdy porównanie jest prawdziwe. Porównania są dokładne, bez zaokrąglania.",
    example: "niech bok 80\njeśli bok > 50 [np bok]",
    group: "Programowanie",
  },
  {
    name: "jeżeli",
    aliases: "jezeli · ifelse",
    args: "warunek [tak] [nie]",
    text: "Wykonaj pierwszy blok, gdy warunek jest prawdziwy; w przeciwnym razie drugi.",
    example: "niech bok 40\njeżeli bok >= 50 [np bok] [np 50]",
    group: "Programowanie",
  },
  {
    name: "oto … już",
    aliases: "to … juz · end",
    args: "nazwa ma: parametr, parametr",
    text: "Zdefiniuj procedurę. oto rozpoczyna linię; nazwa i parametry są w tej samej linii. Ciało zaczyna się w następnej. już jest samo w osobnej linii. Definicje są tylko na najwyższym poziomie i mogą być po wywołaniu. Każda nazwa może być zdefiniowana raz. Dozwolona rekurencja, bez wartości zwracanej.",
    example:
      "oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 80 90",
    group: "Programowanie",
  },
  {
    name: "stop",
    aliases: "stop",
    args: "",
    text: "Zakończ bieżącą procedurę, także z wnętrza powtórzenia lub warunku. Na poziomie głównym zakończ cały program.",
    example: "oto krok ma: bok\n  jeśli bok < 1 [stop]\n  np bok\njuż\nkrok 20",
    group: "Programowanie",
  },
  {
    name: "dom",
    aliases: "home",
    args: "",
    text: "Wróć do (0, 0, 0) i początkowej orientacji. Przy opuszczonym piórze narysuj odcinek do początku. Kolor, grubość i stan pióra pozostają.",
    example: "np 80 pw 90 np 40 dom",
    group: "Ruch",
  },
  {
    name: "czyść",
    aliases: "czysc · cs · clearscreen",
    args: "",
    text: "Usuń wszystkie dotychczasowe kreski, zachowując pozycję, orientację i pióro. Limit odcinków liczy tylko aktualnie zachowane.",
    example: "np 80 czyść pw 90 np 40",
    group: "Pióro",
  },
  {
    name: "góra",
    aliases: "gora · pitchup",
    args: "kąt",
    text: "Tylko 3D. Unieś nos żółwia w stronę jego własnej góry, obracając wokół prawej osi.",
    example: "gora 90 np 80",
    group: "Przestrzeń 3D",
  },
  {
    name: "dół",
    aliases: "dol · pitchdown",
    args: "kąt",
    text: "Tylko 3D. Opuść nos; przeciwieństwo góra.",
    example: "gora 45 np 60 dol 45 np 60",
    group: "Przestrzeń 3D",
  },
  {
    name: "pp",
    aliases: "przechylprawo · rr · rollright",
    args: "kąt",
    text: "Tylko 3D. Przechyl górę żółwia w stronę jego prawej osi. Kierunek ruchu się nie zmienia; obraca się prawa oś i góra.",
    example: "pp 90 gora 90 np 80",
    group: "Przestrzeń 3D",
  },
  {
    name: "pl",
    aliases: "przechyllewo · rl · rollleft",
    args: "kąt",
    text: "Tylko 3D. Przechyl żółwia w lewo wokół kierunku patrzenia.",
    example: "pl 45 powtorz 36 [np 8 gora 10]",
    group: "Przestrzeń 3D",
  },
];
export const languageNotes = [
  {
    title: "Zapis i nazwy",
    text: "Wielkość liter nie ma znaczenia, także w polskich nazwach. Nazwy zaczynają się literą lub podkreśleniem; dalej mogą zawierać też cyfry. Komentarz po średniku ; trwa do końca wiersza. Nowe linie mają znaczenie tylko w definicjach procedur. Zmienna nie może nazywać się tak jak polecenie lub procedura. Parametr może mieć nazwę procedury.",
  },
  {
    title: "Liczby i wyrażenia",
    text: "Liczby dziesiętne: 80, 12.5, .5. Zapis 1e3, 0x10, NaN i Infinity jest błędem. Znaki + i − są operatorami. Używaj +, -, *, / oraz nawiasów ( ). Mnożenie i dzielenie mają pierwszeństwo; operatory tego samego poziomu działają od lewej: 20 - 5 - 3 = 12. Znaki jednoargumentowe można składać: np - -2, np -(3 - 5). Nie ma funkcji trygonometrycznych.",
  },
  {
    title: "Odstępy przy operatorach",
    text: "Operator dwuargumentowy musi mieć odstępy z obu stron albo z żadnej: np 10 - 5 i np 10-5 znaczą to samo. Zapis np 10 -5 jest błędem: 10 jest pierwszym argumentem, a -5 zbędną wartością. Dotyczy +, -, * i /; nie dotyczy porównań.",
  },
  {
    title: "Zmienne, warunki i wywołania",
    text: "W wyrażeniu można użyć parametru, zmiennej zadeklarowanej przez niech w tym ciele lub globalnie oraz :nazwa jako starszego zapisu. Deklaracja może być później w kodzie, lecz odczyt przed przypisaniem na bieżącej ścieżce jest błędem wykonania. Porównania: <, >, =, <=, >=, <>. Są dokładne: 0.1 + 0.2 = 0.3 jest fałszem. Argumenty procedur są pozycyjne; każdy jest wyrażeniem: kwadrat 40 * 2 90 przekazuje 80 i 90. Obsługiwany jest też nagłówek oto kwadrat :bok :kąt.",
  },
  {
    title: "Pozycja i orientacja",
    text: "Układ prawoskrętny: +X w prawo, +Y do przodu na stronie, +Z w górę z płaszczyzny. Start w (0, 0, 0), kierunek +Y, prawa oś +X i góra +Z. Pióro opuszczone, kolor #16866a, grubość 3. W 2D rysujemy na XY. Kąty w stopniach, także ujemne i ułamkowe. Ruch o 0 nie zostawia odcinka. Płaskie polecenia dają te same współrzędne w 2D i 3D.",
  },
  {
    title: "Błędy i granice",
    text: "Program jest w całości sprawdzany przed startem. Błąd składni, nieznana nazwa, nrpowt poza powtórzeniem lub polecenie przestrzenne w 2D nie rysują nic. Stałe wyrażenia grubości i liczby powtórzeń są sprawdzane przed startem; zależne od nazw — w trakcie. Błąd wykonania (np. dzielenie przez zero, nieskończony wynik lub brak wartości zmiennej) zatrzymuje program i zachowuje dotychczasowy rysunek po ostatnim czyść. Wiersze i kolumny liczymy od 1. Błąd wartości wskazuje początek całego argumentu.",
  },
  {
    title: "Limity pracowni",
    text: "50 000 znaków źródła; 10 000 tokenów (także operatory, nawiasy i przecinki); 32 poziomy nawiasów kwadratowych; 32 aktywne ramki wywołań procedur i powtórzeń (warunki nie zajmują ramek); 10 000 operacji; 10 000 zachowanych odcinków; każda współrzędna od −100 000 do 100 000. Operacją jest każde polecenie, niech, warunek, powtórzenie lub wywołanie, a także zakończenie każdej iteracji, wykonanego bloku warunku i wywołania procedury. Samo liczenie wyrażeń oraz koniec programu nie są operacjami.",
  },
  {
    title: "Sterowanie i skróty",
    text: "Ctrl/⌘ + Enter: uruchom od początku. Alt + →: jeden krok. Alt + P: pauza lub wznów. Alt + R: reset. Na płótnie 2D: przeciąganie przesuwa, kółko powiększa, strzałki przesuwają, + i − zmieniają skalę. W 3D: przeciąganie obraca, prawy przycisk lub dwa palce przesuwają, kółko albo szczypanie przybliża. Dostępne są też przyciski obrotu i skali.",
  },
];
