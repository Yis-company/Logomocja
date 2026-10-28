export const commandRows = [
  [
    "np · naprzod · naprzód",
    "fd · forward",
    "Idź do przodu o podaną odległość.",
    "np 80",
  ],
  ["ws · wstecz", "bk · back", "Cofnij się o podaną odległość.", "ws 40"],
  ["pw · prawo", "rt · right", "Obróć się w prawo (stopnie).", "pw 90"],
  ["lw · lewo", "lt · left", "Obróć się w lewo (stopnie).", "lw 45"],
  [
    "pod · podnies · podnieś",
    "pu · penup",
    "Podnieś pisak — ruch nie zostawia śladu.",
    "pod np 30",
  ],
  ["opu · opusc · opuść", "pd · pendown", "Opuść pisak.", "opu np 30"],
  [
    "kolor",
    "color",
    "Ustaw kolor; dokładnie sześć cyfr szesnastkowych w cudzysłowie.",
    'kolor "#16866a"',
  ],
  [
    "grubosc · grubość",
    "width",
    "Grubość linii: liczba całkowita od 1 do 12.",
    "grubosc 3",
  ],
  [
    "powtorz · powtórz",
    "repeat",
    "Powtórz blok od 0 do 10 000 razy (liczba całkowita).",
    "powtorz 4 [np 80 pw 90]",
  ],
  [
    "niech",
    "let",
    "Przypisz lub zmień wartość zmiennej.",
    "niech bok 80 np bok",
  ],
  [
    "jeśli · jesli",
    "if",
    "Wykonaj blok, jeśli porównanie jest prawdziwe.",
    "jeśli 3 < 5 [np 80]",
  ],
  [
    "jeżeli · jezeli",
    "ifelse",
    "Wybierz pierwszy lub drugi blok.",
    "jeżeli 3 > 5 [np 80] [ws 40]",
  ],
  [
    "stop",
    "stop",
    "Zakończ bieżącą procedurę; poza procedurą zakończ program.",
    "jeśli bok < 5 [stop]",
  ],
  [
    "dom",
    "home",
    "Wróć do (0, 0, 0), rysując przy opuszczonym pisaku; przywróć początkową orientację.",
    "pod dom opu",
  ],
  [
    "czyść · czysc",
    "cs · clearscreen",
    "Usuń odcinki. Pozycja, orientacja, kolor, grubość i pisak pozostają bez zmian.",
    "np 20 czyść np 40",
  ],
  [
    "gora · góra",
    "pitchup",
    "Tylko 3D: unieś nos ku górze żółwia.",
    "gora 90 np 60",
  ],
  ["dol · dół", "pitchdown", "Tylko 3D: pochyl nos w dół.", "dol 30 np 60"],
  [
    "pp · przechylprawo",
    "rr · rollright",
    "Tylko 3D: przechyl w prawo wokół kierunku ruchu.",
    "pp 90 gora 45 np 60",
  ],
  [
    "pl · przechyllewo",
    "rl · rollleft",
    "Tylko 3D: przechyl w lewo wokół kierunku ruchu.",
    "pl 45 gora 30 np 60",
  ],
  [
    "nrpowt",
    "repcount",
    "Wartość bieżącej iteracji od 1, najbliższej otaczającej pętli. To wartość, nie polecenie.",
    "powtorz 10 [np nrpowt * 5 pw 90]",
  ],
  [
    "oto … ma: / już · juz",
    "to / end",
    "Zdefiniuj procedurę z parametrami.",
    "oto kwadrat ma: bok\n  powtorz 4 [np bok pw 90]\njuż\nkwadrat 80",
  ],
];
export const referenceText = `
<section class="reference-intro"><span class="eyebrow">TWÓJ MAŁY PODRĘCZNIK</span><h2>Język, który zostawia ślad.</h2><p>Zacznij od <code>np 80</code>. Dodaj <code>pw 90</code>. Reszta to ciekawość.</p></section>
<h3>Podstawy i geometria</h3><p>Wielkość liter nie ma znaczenia — także w nazwach zmiennych i procedur. Średnik <code>;</code> zaczyna komentarz do końca wiersza. Białe znaki rozdzielają tokeny; wiersze mają znaczenie tylko dla definicji procedur. Bloki zapisuj w <code>[ ]</code>, grupy wyrażeń w <code>( )</code>.</p><p>Żółw startuje w (0, 0, 0), patrzy w +Y, ma prawą stronę w +X i górę w +Z. Układ jest prawoskrętny. W 2D rysujemy na płaszczyźnie XY. Początkowy pisak jest opuszczony, zielony <code>#16866a</code>, grubość 3. Ruch o zero nie tworzy odcinka. Płaskie polecenia dają takie same współrzędne w obu trybach.</p><p>Kąty są w stopniach, także ułamkowe lub ujemne. Obrót w prawo odbywa się wokół własnej góry, pochylenie wokół prawej osi, przechylenie wokół kierunku żółwia. Po <code>gora 90</code> nos wskazuje dawną górę. Po <code>pp 90</code> góra wskazuje dawną prawą stronę, prawa strona dawny dół. Orientacja pozostałych osi podąża za obrotem.</p>
<h3>Wyrażenia i liczby</h3><p>Liczby to dziesiętne literały bez znaku: <code>80</code>, <code>12.5</code>, <code>.5</code>. Zapisy <code>1e3</code>, <code>0x10</code>, <code>NaN</code> i <code>Infinity</code> są błędne. Znak jest osobnym operatorem. Mnożenie i dzielenie mają pierwszeństwo przed dodawaniem i odejmowaniem; na tym samym poziomie liczymy od lewej: <code>np 20 - 5 - 3</code> to 12, a <code>np 2 + 3 * 4</code> to 14.</p><p>Operator dwuargumentowy wymaga odstępów po obu stronach albo po żadnej: <code>10 - 5</code> i <code>10-5</code> są poprawne. <code>np 10 -5</code> jest błędem. Znaki jednoargumentowe można łączyć: <code>np -(3 - 5)</code>, <code>np - -2</code>, <code>np -bok</code>. Dzielenie przez zero i wynik nieskończony zatrzymują wykonanie. Samo obliczanie wyrażenia nie liczy się jako operacja.</p>
<h3>Zmienne, warunki i pętle</h3><p><code>niech bok 80</code> przypisuje zmienną; <code>niech bok bok + 5</code> zmienia ją. Nazwy zaczynają się literą lub podkreśleniem, dalej mogą zawierać litery, cyfry i podkreślenia. Nie mogą być poleceniami ani nazwami procedur. Parametr może nazywać się tak samo jak procedura i można go ponownie przypisać. Parametr lub zmienną można odczytać jako <code>bok</code> lub <code>:bok</code>.</p><p>Zmienne najwyższego poziomu są globalne. Przypisanie wewnątrz procedury tworzy zmienną lokalną na czas tego wywołania; po przypisaniu przesłania globalną. Nazwa musi być parametrem, mieć przypisanie w ciele tej procedury albo na najwyższym poziomie (także później w kodzie). Odczyt przed przypisaniem na wykonanej ścieżce jest błędem wykonania.</p><p>Warunek porównuje dwa wyrażenia za pomocą <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code>. Odstępy wokół porównania są dowolne. Porównania są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem z powodu reprezentacji liczb. Bloki mogą zawierać inne bloki i wywołania.</p><p><code>nrpowt</code> (lub <code>repcount</code>) to numer iteracji od 1 w najbliższej pętli zapisanej w kodzie. Nie jest dostępny w procedurze tylko dlatego, że została wywołana z pętli. W ciele procedury trzeba zapisać własną pętlę. Zero powtórzeń nie wykonuje bloku.</p>
<h3>Procedury i rekurencja</h3><p>Definicja zaczyna się na początku wiersza od <code>oto</code> lub <code>to</code>, nazwy i opcjonalnie <code>ma: bok, kąt</code>. Ciało jest w następnych wierszach. Kończymy osobnym wierszem <code>już</code>, <code>juz</code> lub <code>end</code>. Starszy nagłówek <code>oto kwadrat :bok :kąt</code> też działa.</p><p>Definicje są dozwolone tylko na najwyższym poziomie. Nazwę definiuje się raz; wywołanie może poprzedzać definicję. Argumenty są pozycyjne, oddzielone białymi znakami: <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90. Parametr może mieć nazwę procedury: w miejscu polecenia jest wywołaniem, w wyrażeniu parametrem. Procedury mogą wywoływać siebie i inne procedury. Nie zwracają wartości. <code>stop</code> kończy całą bieżącą procedurę, również z wnętrza pętli lub warunku.</p>
<h3>Błędy i bezpieczne granice</h3><p>Cały program sprawdzamy przed rysowaniem. Błąd składni, nieznana nazwa, polecenie 3D w 2D lub niepoprawna stała grubość/liczba powtórzeń nie pozostawia rysunku. Błąd wykonania zachowuje już narysowane odcinki (po ostatnim <code>czyść</code>). Wskazujemy wiersz i kolumnę od 1; błąd wartości wskazuje pierwszy token argumentu. Brak argumentu wskazuje napotkany token, a na końcu źródła — polecenie.</p><p>Limity: 50 000 znaków źródła, 10 000 tokenów (również operatory, nawiasy i przecinki), 32 poziomy bloków, 32 aktywne wywołania procedur i pętle łącznie, 10 000 operacji, 10 000 zachowanych odcinków i współrzędne od −100 000 do +100 000. Liczymy każde polecenie, przypisanie, warunek, pętlę i wywołanie oraz zakończenie każdej iteracji, wykonanego bloku warunkowego i wywołania. Bloki warunków nie zajmują ramek. Koniec programu nie jest operacją.</p>
<h3>Skróty i obsługa</h3><p><kbd>Ctrl / ⌘ + Enter</kbd> uruchamia, <kbd>Alt + →</kbd> wykonuje krok, <kbd>Ctrl / ⌘ + .</kbd> wstrzymuje lub wznawia, <kbd>Ctrl / ⌘ + Backspace</kbd> resetuje wykonanie. Edycja zatrzymuje program i zachowuje dotychczasowy rysunek do kolejnego uruchomienia.</p><p>Na płótnie: przeciągnij, aby przesunąć w 2D lub obrócić w 3D. Kółko przybliża; w 3D prawy przycisk przesuwa. Na klawiaturze: strzałki przesuwają / obracają, <kbd>+</kbd> i <kbd>−</kbd> zmieniają przybliżenie, <kbd>0</kbd> dopasowuje widok. Na telefonie gesty 3D obsługują obrót jednym palcem i przesuwanie/przybliżenie dwoma; w 2D użyj przycisków zoomu.</p><p>Programy i postępy zapisujemy tylko w tej przeglądarce. Wczytanie przykładu, pliku lub linku zachowuje poprzedni szkic w „Zachowane szkice” (ostatnie 20). Link zawiera cały program i tryb. Plik .logo to zwykły tekst UTF-8; tryb wybierasz w studiu. PNG zawiera aktualny widok. Aplikacja nie wysyła danych i działa bez sieci po załadowaniu plików strony.</p>`;
