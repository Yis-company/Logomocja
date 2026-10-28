import { groups } from "./interpreter.js";
export const tasks = [
  {
    id: "square",
    name: "Pierwszy kwadrat",
    level: "Na rozgrzewkę",
    mode: "2d",
    description:
      "Narysuj kwadrat o boku 100. Zacznij w punkcie (0, 0), idź do przodu i skręcaj w prawo. Wróć do początku.",
    source: "powtorz 4 [np 100 pw 90]",
    hint: "Cztery razy powtórz ruch o 100 i skręt o 90°.",
  },
  {
    id: "triangle",
    name: "Trzy równe boki",
    level: "Kąty i powtórzenia",
    mode: "2d",
    description:
      "Narysuj trójkąt równoboczny o boku 120, od początku układu, pierwszy bok w górę. Skręcaj w prawo.",
    source: "powtorz 3 [np 120 pw 120]",
    hint: "Żółw obraca się o kąt zewnętrzny: 360 / 3.",
  },
  {
    id: "rectangle",
    name: "Długi i krótki",
    level: "Złap rytm",
    mode: "2d",
    description:
      "Narysuj prostokąt: 80 do przodu, 140 w prawo, następnie zamknij figurę. Początek w (0, 0).",
    source: "powtorz 2 [np 80 pw 90 np 140 pw 90]",
    hint: "W jednej iteracji możesz narysować dwa różne boki.",
  },
  {
    id: "gap",
    name: "Przerwa na oddech",
    level: "Podnieś pisak",
    mode: "2d",
    description:
      "Na osi Y narysuj odcinek od 0 do 50, pozostaw przerwę od 50 do 80, a potem narysuj odcinek od 80 do 130.",
    source: "np 50 pod np 30 opu np 50",
    hint: "pod podnosi pisak, opu opuszcza go ponownie.",
  },
  {
    id: "star",
    name: "Twoja gwiazda",
    level: "Mała geometria",
    mode: "2d",
    description:
      "Narysuj pięcioramienną gwiazdę z pięciu odcinków długości 150. Zacznij w (0, 0), idź w górę i skręcaj w prawo o 144°.",
    source: "powtorz 5 [np 150 pw 144]",
    hint: "Pięć powtórzeń, jeden ruch i jeden skręt.",
  },
  {
    id: "stairs",
    name: "W górę!",
    level: "Odkryj przestrzeń",
    mode: "3d",
    description:
      "Narysuj trzy stopnie w płaszczyźnie YZ. Każdy stopień to 40 do przodu (+Y) i 25 w górę (+Z). Początek w (0, 0, 0).",
    source: "powtorz 3 [np 40 gora 90 np 25 dol 90]",
    hint: "Po wspinaczce przywróć kierunek poziomy poleceniem dol 90.",
  },
];
const entries = {
  fd: ["Ruch do przodu wzdłuż kierunku żółwia.", "np 80"],
  bk: ["Ruch do tyłu bez zmiany kierunku.", "ws 40"],
  rt: ["Skręt w prawo wokół lokalnej osi góry. Kąt w stopniach.", "pw 90"],
  lt: ["Skręt w lewo.", "lw 45"],
  pu: ["Podnosi pisak. Kolejne ruchy nie zostawiają śladu.", "pod np 30"],
  pd: ["Opuszcza pisak.", "opu np 50"],
  color: [
    "Ustawia kolor: cudzysłów, # i dokładnie sześć cyfr hex.",
    'kolor "#16866a"',
  ],
  width: ["Całkowita grubość od 1 do 12.", "grubosc 3"],
  repeat: [
    "Powtarza ciało od 0 do 10 000 razy (liczba całkowita).",
    "powtorz 4 [np 80 pw 90]",
  ],
  let: ["Przypisuje lub zmienia wartość zmiennej.", "niech bok 80 np bok"],
  if: [
    "Wykonuje ciało tylko, gdy porównanie jest prawdziwe.",
    "jeśli 4 > 2 [np 80]",
  ],
  ifelse: [
    "Wybiera pierwsze lub drugie ciało.",
    "jeżeli 1 = 2 [np 20] [np 40]",
  ],
  stop: [
    "Kończy bieżące wywołanie procedury; poza procedurą kończy program, również wewnątrz pętli.",
    "np 20 stop np 80",
  ],
  home: [
    "Wraca do (0, 0, 0), rysując, jeśli pisak jest opuszczony. Przywraca kierunek +Y, prawą stronę +X i górę +Z. Kolor, grubość i pisak zostają.",
    "np 80 dom",
  ],
  cs: [
    "Usuwa wszystkie odcinki. Nie zmienia pozycji, orientacji ani pisaka.",
    "np 80 czyść np 20",
  ],
  pitchup: [
    "Tylko 3D. Pochyla nos w stronę lokalnej góry, wokół prawej osi.",
    "gora 90 np 80",
  ],
  pitchdown: ["Tylko 3D. Pochyla nos w dół.", "dol 45 np 80"],
  rollright: [
    "Tylko 3D. Obraca lokalną górę w stronę prawej osi, wokół kierunku żółwia.",
    "pp 90 gora 90 np 80",
  ],
  rollleft: [
    "Tylko 3D. Przechyla w lewo wokół kierunku żółwia. Sam kierunek się nie zmienia.",
    "pl 45 gora 30 np 80",
  ],
  repcount: [
    "Wartość (nie polecenie): numer iteracji od 1, dla najbliższego leksykalnie powtórzenia. Nie jest dziedziczona przez wywołaną procedurę.",
    "powtorz 10 [np nrpowt * 5 pw 90]",
  ],
  to: [
    "Definicja na początku osobnej linii, na najwyższym poziomie. Nazwa i parametry muszą być w tej samej linii.",
    "oto kwadrat ma: bok, kąt\n  powtorz 4 [np bok pw kąt]\njuż\nkwadrat 80 90",
  ],
  end: [
    "Zamyka definicję. Musi występować samotnie w linii.",
    "oto krok\n  np 30\njuż\nkrok",
  ],
};
export const escape = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export function reference() {
  return `<div class="doc-intro"><span class="eyebrow">MAŁY JĘZYK, DUŻO MOŻLIWOŚCI</span><h2>Rozmówki z żółwiem</h2><p>Wpisz polecenie. Podaj liczbę. Zobacz, dokąd zaprowadzi Cię pomysł.</p></div><section class="doc-section"><h3>Zanim zaczniesz</h3><p>Żółw startuje w (0, 0, 0), patrzy w stronę +Y, ma prawą stronę w +X i górę w +Z. Pisak jest opuszczony, zielony <code>#16866a</code>, o grubości 3. Układ jest prawoskrętny. W 2D rysujemy na płaszczyźnie XY. Te same płaskie polecenia mają identyczne współrzędne w 3D. Ruch o zero nie rysuje nic. Ujemna odległość lub kąt odwracają działanie.</p><p>Wielkość liter nie ma znaczenia. Średnik rozpoczyna komentarz do końca linii. Białe znaki oddzielają tokeny. Nowa linia ma znaczenie tylko w definicjach procedur. Nazwy zaczynają się literą lub podkreśleniem, dalej mogą mieć litery, cyfry i podkreślenia. Nie używaj słów poleceń jako nazw.</p></section><section class="doc-section"><h3>Liczby i wyrażenia</h3><p>Liczby: <code>80</code>, <code>12.5</code>, <code>.5</code>. Notacja wykładnicza, szesnastkowa, NaN i Infinity nie są liczbami. Znaki + i − są operatorami. Możesz używać zmiennych, parametrów, ich dawnej postaci <code>:bok</code>, nawiasów i operatorów <code>+ - * /</code>. Mnożenie i dzielenie mają pierwszeństwo. Pozostałe działania liczą się od lewej: <code>np 20 - 5 - 3</code> daje 12, <code>np 2 + 3 * 4</code> daje 14.</p><p>Operator binarny wymaga odstępu po obu stronach albo po żadnej: <code>np 10 - 5</code> i <code>np 10-5</code> są poprawne. <code>np 10 -5</code> to błąd. Znaki jednoargumentowe można łączyć: <code>np - -2</code>, <code>np -(3 - 5)</code>, <code>np -bok</code>. Dzielenie przez zero i nieskończone wyniki zatrzymują program.</p></section><section class="doc-section"><h3>Zmienne, warunki i procedury</h3><p><code>niech x 5</code> tworzy lub zmienia zmienną globalną na najwyższym poziomie, a w procedurze — lokalną dla tego wywołania. Parametr także można zmienić. Lokalne wartości znikają po powrocie. Nazwa musi być parametrem albo mieć deklarację niech gdzieś w bieżącej procedurze lub na najwyższym poziomie. Odczyt przed przypisaniem na wykonanej ścieżce jest błędem. Zmienna nie może mieć nazwy procedury; parametr może.</p><p>Warunek to dwa wyrażenia i porównanie: <code>&lt; &gt; = &lt;= &gt;= &lt;&gt;</code>. Porównania są dokładne, bez tolerancji: <code>0.1 + 0.2 = 0.3</code> jest fałszywe. Reguła odstępów operatorów nie dotyczy porównań. Ciała powtórzeń i warunków umieszczamy w <code>[ ]</code>; mogą się zagnieżdżać.</p><p>Definicje procedur mogą być przed wywołaniem lub za nim, ale nigdy w ciele innej konstrukcji. Nazwę można zdefiniować raz. Parametry zapisujemy <code>ma: bok, kąt</code> lub w dawnej postaci <code>:bok :kąt</code>. Argumenty wywołania oddzielamy spacjami: <code>kwadrat 40 * 2 90</code> przekazuje 80 i 90. Liczba argumentów musi zgadzać się z nagłówkiem. Rekurencja bezpośrednia i wzajemna jest dozwolona. Procedury nie zwracają wartości.</p></section><div class="reference-list">${Object.entries(
    entries,
  )
    .map(
      ([k, [desc, ex]]) =>
        `<article class="reference-command"><div><h3>${escape(groups[k].split(" ")[0])}${/pitch|roll/.test(k) ? '<span class="pill">3D</span>' : ""}</h3><p class="aliases">${escape(groups[k])}</p><p>${desc}</p></div><pre>${escape(ex)}</pre></article>`,
    )
    .join(
      "",
    )}</div><section class="doc-section"><h3>Granice i komunikaty</h3><p>Do 50 000 znaków, 10 000 tokenów (także operatory, nawiasy i przecinki), 32 poziomy nawiasów kwadratowych oraz 32 aktywne wywołania procedur i powtórzenia łącznie. Warunki nie zajmują ramki. Limit wykonania: 10 000 operacji. Każde polecenie, przypisanie, warunek, powtórzenie i wywołanie liczą się raz. Koniec każdej iteracji, wykonanego ciała warunku i wywołania liczy się dodatkowo raz. Wyrażenia i koniec programu nie zwiększają licznika.</p><p>Do 10 000 aktualnie zachowanych odcinków i współrzędne od −100 000 do +100 000. czyść zwalnia odcinki. Cały program jest sprawdzany przed rysowaniem. Błąd składni nie zostawia rysunku; błąd wykonania zachowuje dotychczasowe odcinki (po ostatnim czyść). Stałe grubości i liczby powtórzeń sprawdzamy przed wykonaniem; zależne od zmiennych — w czasie pracy. Błędy wskazują linię i kolumnę od 1; błąd wartości wskazuje początek argumentu.</p></section><section class="doc-section"><h3>Pod ręką</h3><p><kbd>Ctrl / ⌘ + Enter</kbd> Uruchom · <kbd>F10</kbd> Krok · <kbd>F8</kbd> Pauza / wznów · <kbd>Shift + Esc</kbd> Reset.</p><p>Na płótnie: strzałki przesuwają widok 2D lub obracają 3D; Shift + strzałki przesuwają 3D. + / − zmieniają skalę, F dopasowuje rysunek, 0 resetuje kamerę. Przeciągnij myszą lub palcem; w 3D Shift + przeciągnięcie przesuwa, dwa palce przesuwają i powiększają.</p><p>Szkice obu trybów zapisują się lokalnie. Wczytanie przykładu zachowuje poprzedni szkic w Historii (ostatnie 20 wersji). Link zawiera program i tryb; każdy, kto ma link, może je odczytać. Nic nie jest wysyłane na serwer. Widok 3D używa projekcji przestrzennej na canvas i nie wymaga WebGL.</p></section>`;
}
