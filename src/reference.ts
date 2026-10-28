export const referenceHTML=`
<div class="reference-intro"><span class="eyebrow">MAŁY JĘZYK, DUŻO MOŻLIWOŚCI</span><h2>Porozmawiaj z żółwiem.</h2><p>Wpisuj polecenia po polsku lub angielsku. Wielkość liter nie ma znaczenia, a polskie znaki są mile widziane. Na początek: <code>powtorz 4 [np 100 pw 90]</code>.</p></div>
<div class="reference-layout"><aside class="reference-toc"><a href="#jezyk-ruch">Ruch i pisak</a><a href="#jezyk-przestrzen">Przestrzeń 3D</a><a href="#jezyk-wyrazenia">Wyrażenia</a><a href="#jezyk-petle">Pętle i warunki</a><a href="#jezyk-zmienne">Zmienne</a><a href="#jezyk-procedury">Procedury</a><a href="#jezyk-limity">Błędy i limity</a></aside><div class="reference-body">
<section id="jezyk-ruch"><h3>01 / Ruch i pisak</h3><p>Żółw startuje w (0, 0, 0), patrzy w kierunku +Y, ma prawą stronę w +X, a górę w +Z. Pisak jest opuszczony, zielony (#16866a), o grubości 3. Na płaszczyźnie +X prowadzi w prawo, +Y do góry ekranu.</p>
<div class="command-table"><table><thead><tr><th>Polecenie i aliasy</th><th>Co robi</th><th>Przykład</th></tr></thead><tbody>
<tr><td><b>np</b>, naprzod, naprzód, fd, forward</td><td>Ruch do przodu o zadaną odległość.</td><td><code>np 100</code></td></tr>
<tr><td><b>ws</b>, wstecz, bk, back</td><td>Ruch do tyłu bez zmiany orientacji.</td><td><code>ws 40</code></td></tr>
<tr><td><b>pw</b>, prawo, rt, right</td><td>Obrót w prawo wokół własnej góry.</td><td><code>pw 90</code></td></tr>
<tr><td><b>lw</b>, lewo, lt, left</td><td>Obrót w lewo wokół własnej góry.</td><td><code>lw 45</code></td></tr>
<tr><td><b>pod</b>, podnies, podnieś, pu, penup</td><td>Podnosi pisak. Kolejne ruchy nie rysują.</td><td><code>pod np 50</code></td></tr>
<tr><td><b>opu</b>, opusc, opuść, pd, pendown</td><td>Opuszcza pisak.</td><td><code>opu np 50</code></td></tr>
<tr><td><b>kolor</b>, color</td><td>Zmienia kolor. Sześć cyfr hex w cudzysłowie.</td><td><code>kolor "#c1763d"</code></td></tr>
<tr><td><b>grubosc</b>, grubość, width</td><td>Ustawia całkowitą grubość od 1 do 12.</td><td><code>grubosc 4</code></td></tr>
<tr><td><b>dom</b>, home</td><td>Wraca do początku i ustawia początkową orientację. Rysuje drogę powrotną, gdy pisak jest opuszczony.</td><td><code>pod dom opu</code></td></tr>
<tr><td><b>czyść</b>, czysc, cs, clearscreen</td><td>Usuwa odcinki. Pozycja, orientacja i pisak pozostają bez zmian.</td><td><code>np 50 czyść np 20</code></td></tr>
<tr><td><b>stop</b></td><td>Natychmiast kończy bieżącą procedurę. Na najwyższym poziomie kończy program, także wewnątrz pętli.</td><td><code>np 20 stop np 80</code></td></tr>
</tbody></table></div><p>Odległości i kąty mogą być ujemne lub ułamkowe. Kąty podajemy w stopniach. Ruch o zero nie zostawia odcinka. Kolor, grubość i stan pisaka zachowują się do kolejnej zmiany.</p></section>
<section id="jezyk-przestrzen"><h3>02 / Trzeci wymiar</h3><p>Przestrzeń jest prawoskrętna. Płaski program rysuje identyczne współrzędne w 2D i 3D. Poniższe polecenia działają tylko w 3D; w 2D są błędem, także w niewykonanej gałęzi.</p><div class="command-table"><table><thead><tr><th>Polecenie i aliasy</th><th>Co robi</th><th>Przykład</th></tr></thead><tbody>
<tr><td><b>gora</b>, góra, pitchup</td><td>Pochyla nos w stronę własnej góry, wokół prawej osi.</td><td><code>gora 90 np 50</code></td></tr>
<tr><td><b>dol</b>, dół, pitchdown</td><td>Pochyla nos w dół. Góra żółwia obraca się razem z nim.</td><td><code>dol 30 np 50</code></td></tr>
<tr><td><b>pp</b>, przechylprawo, rr, rollright</td><td>Przechyla górę w stronę prawej osi, wokół kierunku ruchu.</td><td><code>pp 90 gora 90 np 50</code></td></tr>
<tr><td><b>pl</b>, przechyllewo, rl, rollleft</td><td>Przechyla w lewo. Kierunek patrzenia pozostaje bez zmian.</td><td><code>pl 45 np 50</code></td></tr>
</tbody></table></div><p>Po <code>gora 90</code> żółw patrzy w stronę swojej poprzedniej góry. Po <code>pp 90</code> jego góra wskazuje poprzednią prawą stronę, a prawa strona wskazuje poprzedni dół. Wszystkie obroty są lokalne. Znacznik 3D pokazuje nos (zielony), górę (pomarańczową) i prawą stronę (niebieską).</p></section>
<section id="jezyk-wyrazenia"><h3>03 / Liczby i wyrażenia</h3><p>Liczby to <code>80</code>, <code>12.5</code> lub <code>.5</code>. Znak jest operatorem. Zapis wykładniczy, szesnastkowy, NaN i Infinity są błędami. Dostępne działania: <code>+ - * /</code>. Mnożenie i dzielenie mają pierwszeństwo. Operatory o tym samym priorytecie liczymy od lewej.</p><pre>np 2 + 3 * 4   ; 14
np 20 - 5 - 3  ; 12
np -(3 - 5)    ; 2
np - -2        ; 2
niech bok 20
np -bok
np :bok        ; stary zapis zmiennej też działa</pre><p>Operator binarny musi mieć odstęp po obu stronach lub po żadnej. <code>np 10 - 5</code> i <code>np 10-5</code> są poprawne. <code>np 10 -5</code> jest błędem: po argumencie 10 zostaje nieoczekiwane -5. Reguła nie dotyczy porównań ani znaków jednoargumentowych.</p><p>Nawiasy okrągłe grupują działania. Komentarz zaczyna się od <code>;</code> i trwa do końca wiersza. Nowy wiersz ma znaczenie tylko przy nagłówku i zakończeniu procedury. Dzielenie przez zero i wynik nieskończony kończą wykonanie z błędem.</p></section>
<section id="jezyk-petle"><h3>04 / Powtórzenia i decyzje</h3><p><b>powtorz</b> (powtórz, repeat) przyjmuje całkowitą liczbę od 0 do 10 000 i ciało w nawiasach kwadratowych. Zero pomija ciało. Pętle i warunki można zagnieżdżać.</p><pre>powtorz 6 [np 60 pw 60]
powtorz 20 [np nrpowt * 3 pw 89]</pre><p><b>nrpowt</b> (repcount) jest wartością numeru iteracji od 1, z najbliższej otaczającej pętli. Działa leksykalnie: musi być zapisany w ciele pętli. Procedura wywołana z pętli nie dziedziczy jej licznika; musi mieć własną pętlę.</p><p><b>jeśli</b> (jesli, if) wykonuje ciało, gdy warunek jest prawdziwy. <b>jeżeli</b> (jezeli, ifelse) wybiera jedno z dwóch ciał. Porównania: <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code>. Są dokładne: <code>0.1 + 0.2 = 0.3</code> jest fałszem ze względu na zapis zmiennoprzecinkowy.</p><pre>niech bok 60
jeśli bok &gt; 40 [np bok]
jeżeli bok = 60 [pw 90] [lw 90]</pre></section>
<section id="jezyk-zmienne"><h3>05 / Zmienne</h3><p><b>niech</b> (let) tworzy lub zmienia zmienną. Nazwy nie rozróżniają wielkości liter; mogą zawierać polskie litery, cyfry i podkreślenie, lecz nie zaczynają się cyfrą. Nie mogą być poleceniami ani nazwami procedur.</p><pre>niech bok 30
powtorz 5 [
  np bok pw 90
  niech bok bok + 10
]</pre><p>Na najwyższym poziomie zmienna jest globalna. W procedurze „niech” tworzy zmienną lokalną dla tego wywołania; po przypisaniu zasłania globalną i znika po powrocie. Parametry też można zmieniać. Nazwa użyta w wyrażeniu musi być parametrem lub mieć przypisanie gdzieś w ciele tej procedury albo na najwyższym poziomie, nawet w późniejszym wierszu. Odczyt przed przypisaniem wartości na bieżącej ścieżce jest błędem wykonania.</p></section>
<section id="jezyk-procedury"><h3>06 / Własne polecenia</h3><p>Definicja <b>oto</b> (to) zaczyna osobny wiersz i zawiera nazwę oraz opcjonalne <code>ma:</code> z parametrami oddzielonymi przecinkami. Ciało jest w następnych wierszach. Kończy je samotne <b>już</b> (juz, end). Akceptowany jest też stary nagłówek <code>oto kwadrat :bok :kąt</code>.</p><pre>oto kwadrat ma: bok, kąt
  powtorz 4 [np bok pw kąt]
już

kwadrat 40 * 2 90</pre><p>Wywołanie przyjmuje dokładnie tyle wyrażeń, ile jest parametrów, oddzielonych odstępami. W przykładzie są to 80 i 90. Parametr może mieć tę samą nazwę co procedura: na miejscu polecenia nazwa wywołuje procedurę, na miejscu argumentu oznacza parametr. Nie ma wartości zwracanych.</p><p>Procedury mogą wywoływać się wzajemnie i rekurencyjnie. Definicje mogą stać przed wywołaniem lub po nim, ale tylko na najwyższym poziomie. Nie można powtórnie zdefiniować tej samej nazwy. <code>stop</code> kończy całe bieżące wywołanie, także z wnętrza pętli lub warunku.</p><pre>oto gałąź ma: długość
  jeśli długość &lt; 8 [stop]
  np długość
  lw 25 gałąź długość * 0.6 pw 25
  pod ws długość opu
już
gałąź 80</pre></section>
<section id="jezyk-limity"><h3>07 / Błędy, limity i sterowanie</h3><p>Przed rysowaniem sprawdzany jest cały program. Błąd składni nie rysuje niczego. Błąd wykonania zachowuje dotychczasowy rysunek, z uwzględnieniem wykonanych „czyść”. Komunikat pokazuje wiersz i kolumnę od 1. Błędny argument wskazuje początek swojego wyrażenia. Stałe grubości i liczby powtórzeń są sprawdzane przed uruchomieniem; wartości zależne od zmiennych podczas wykonania.</p><ul><li>50 000 znaków źródła i 10 000 tokenów (w tym operatory, nawiasy i przecinki).</li><li>32 poziomy nawiasów kwadratowych, także dla warunków.</li><li>32 aktywne ramki: wywołania procedur i powtórzenia. Ciała warunków nie tworzą ramek.</li><li>10 000 operacji: każde polecenie, przypisanie, warunek, powtórzenie i wywołanie, a także ukończenie każdej iteracji, wykonanego ciała warunku i wywołania procedury. Wyrażenia i koniec programu nie są operacjami.</li><li>10 000 zachowanych odcinków; „czyść” zwalnia ten limit.</li><li>Każda współrzędna musi mieścić się w ±100 000.</li></ul><p>Edycja w trakcie animacji zatrzymuje jej dalsze wykonanie. Uruchom ponownie, aby zobaczyć zmieniony program. Reset czyści rysunek i pozycję żółwia, zachowując kod. Szkice 2D i 3D zapisują się osobno w tej przeglądarce. Otwierany przykład archiwizuje poprzedni szkic; odzyskasz go w menu plików.</p><div class="shortcut-list"><span><kbd>Ctrl/⌘ ↵</kbd> Uruchom / wznów</span><span><kbd>Alt →</kbd> Jeden krok</span><span><kbd>Alt P</kbd> Pauza / wznów</span><span><kbd>Alt R</kbd> Reset</span></div><p>Płótno 2D: przeciągnięcie przesuwa, kółko powiększa. Z klawiatury: strzałki przesuwają, +/− powiększają, 0 dopasowuje. Płótno 3D: przeciągnięcie obraca, prawy przycisk lub dwa palce przesuwają. Kółko i gest szczypania powiększają; klawisze +/− i 0 też działają.</p></section>
</div></div>`;
