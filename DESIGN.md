---
name: Logomocja
description: Polska pracownia grafiki żółwia jako arkusz rysunku technicznego; edytor po lewej, arkusz z tabelką rysunkową po prawej.
colors:
  ozalid-blue: "#1d3f8a"
  drawing-ink: "#14213d"
  ink-soft: "#4d5b78"
  bristol-sheet: "#fdfdfb"
  pane: "#f4f6f9"
  desk: "#e8ecf2"
  rule-soft: "#c3cbd9"
  grid: "#e9edf3"
  grid-strong: "#d3dbe7"
  tint: "#e2e8f1"
  turtle-green: "#0f7a5f"
  turtle-mark: "#16866a"
  correction-red: "#b3261e"
  error-tint: "#fbe6e3"
  warn: "#7a4a00"
  night-sheet: "#0c1320"
  night-pane: "#0f1829"
  night-ink: "#e4eaf5"
  night-shell: "#15306f"
  night-turtle: "#3cc49a"
  night-error: "#ffa397"
typography:
  display:
    fontFamily: "osifont, Public Sans, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.02em"
  headline:
    fontFamily: "osifont, Public Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "0.02em"
  title:
    fontFamily: "osifont, Public Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.02em"
  body:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.45
  code:
    fontFamily: "Red Hat Mono, ui-monospace, Cascadia Mono, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "22px"
rounded:
  none: "0"
  control: "2px"
spacing:
  hair: "0.375rem"
  sm: "0.625rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
components:
  button:
    backgroundColor: "{colors.bristol-sheet}"
    textColor: "{colors.drawing-ink}"
    rounded: "{rounded.control}"
    padding: "0 0.75rem"
    height: "2.25rem"
  button-hover:
    backgroundColor: "{colors.tint}"
  button-primary:
    backgroundColor: "{colors.turtle-green}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 0.75rem"
    height: "2.25rem"
  button-primary-hover:
    backgroundColor: "#0b6650"
  button-check:
    backgroundColor: "{colors.drawing-ink}"
    textColor: "{colors.bristol-sheet}"
    rounded: "{rounded.control}"
  mode-switch-active:
    backgroundColor: "{colors.drawing-ink}"
    textColor: "{colors.bristol-sheet}"
    typography: "{typography.title}"
  tile:
    backgroundColor: "{colors.bristol-sheet}"
    textColor: "{colors.drawing-ink}"
    rounded: "{rounded.none}"
  title-block:
    backgroundColor: "{colors.bristol-sheet}"
    textColor: "{colors.drawing-ink}"
    rounded: "{rounded.none}"
    padding: "0.3125rem 0.5rem"
  top-bar:
    backgroundColor: "{colors.ozalid-blue}"
    textColor: "#ffffff"
    height: "3rem"
---

# Design System: Logomocja

## 1. Overview

**Creative North Star: "Arkusz rysunku technicznego"**

Logomocja wygląda jak stanowisko kreślarskie. Program to instrukcja wykonania rysunku, a wynik leży na arkuszu: biały brystol w ramce, siatka pomocnicza, osie kreską-kropką i tabelka rysunkowa w prawym dolnym rogu, która na żywo podaje położenie żółwia, kurs, liczbę odcinków, stan pisaka i skalę. Wszystko, co nie jest rysunkiem ucznia, jest narysowane tuszem jednej barwy w trzech grubościach linii.

System służy pracy, nie prezentacji. Pierwszy ekran to od razu pracownia: edytor po lewej, arkusz po prawej, uruchamianie pod ręką. Kolor jest oszczędny i ma znaczenie: błękit ozalidu trzyma powłokę, zieleń żółwia oznacza jedyną główną czynność (Uruchom) i samego żółwia, czerwień korektorska oznacza wyłącznie błąd. Rysunek ucznia jest zawsze najbarwniejszą rzeczą na ekranie.

Pismo techniczne (osifont, ISO 3098) pojawia się tam, gdzie na prawdziwym arkuszu pisze się szablonem: w tytułach, nazwie dokumentu, tabelce, przełączniku 2D/3D i znacznikach trybu. Interfejs mówi krojem Public Sans, kod krojem Red Hat Mono. Motyw ciemny to nocna odbitka: granatowa powłoka, prawie czarny arkusz, jasne linie; te same reguły, odwrócone wartości.

**Key Characteristics:**
- Arkusz z ramką i żywą tabelką rysunkową jako znak rozpoznawczy.
- Trzy grubości linii (1, 2, 3 px) zamiast cieni i wypełnień.
- Jedna zielona czynność na ekranie; czerwień tylko dla błędu.
- Wzór zadania kreską przerywaną, osie kreską-kropką, rysunek ucznia linią ciągłą.
- Żółw porusza się skokowo, krok po kroku, bez wygładzania.
- Narożniki 2 px na kontrolkach, 0 na arkuszach i kaflach.

## 2. Colors

Paleta tuszu i papieru: jedna barwa linii, jedna barwa powłoki, dwa kolory znaczące.

### Primary
- **Błękit ozalidu** (#1d3f8a): górna belka z nawigacją, obrys fokusu, kolor poleceń w kodzie. W motywie ciemnym belka ma #15306f, a fokus i polecenia #a9c0ff.

### Secondary
- **Zieleń żółwia** (#0f7a5f): przycisk Uruchom, znacznik żółwia, suwak tempa, stan „zaliczone”. Domyślny kolor pisaka to pokrewna #16866a. W motywie ciemnym #3cc49a z ciemnym tekstem #04211a.

### Tertiary
- **Czerwień korektorska** (#b3261e): podkreślenie błędu w kodzie, dymek z komunikatem, numer błędnego wiersza, wynik „jeszcze nie”. Tło stanu błędu: #fbe6e3. W motywie ciemnym #ffa397 na #3a1715.

### Neutral
- **Tusz kreślarski** (#14213d): tekst, wszystkie linie konstrukcyjne, ramka arkusza, aktywna pozycja przełącznika trybu, przycisk Sprawdź rysunek.
- **Tusz rozcieńczony** (#4d5b78): opisy, etykiety tabelki, komentarze pomocnicze.
- **Brystol** (#fdfdfb): arkusz, pole edytora, kafle, przyciski.
- **Blat** (#f4f6f9 i #e8ecf2): tło paneli i tło strony pod arkuszami.
- **Siatka** (#e9edf3, co piąta linia #d3dbe7) i **linia pomocnicza** (#c3cbd9).
- **Nocna odbitka**: arkusz #0c1320, panel #0f1829, tusz #e4eaf5.

Kolorowanie składni ma własne, stonowane barwy: polecenia #1d3f8a, liczby #8a4b00, napisy #0d6b54, komentarze #5c6880 kursywą, nawiasy #7a2e8e.

### Named Rules
**The One Green Rule.** Na każdym ekranie zielone wypełnienie ma tylko jedna czynność: Uruchom. Drugi zielony przycisk odbiera żółwiowi znaczenie.

**The Red Means Error Rule.** Czerwieni nie używa się do ozdoby, ostrzeżeń ani czynności niszczących. Czerwone jest to, co trzeba poprawić w programie.

**The Loudest Line Rule.** Interfejs nie konkuruje z rysunkiem: poza belką, zielonym przyciskiem i błędem wszystko jest tuszem na papierze.

## 3. Typography

**Display Font:** osifont (zapas: Public Sans, system-ui)
**Body Font:** Public Sans (zapas: system-ui, Segoe UI)
**Label/Mono Font:** Red Hat Mono (zapas: ui-monospace, Menlo, Consolas)

**Character:** Jednokreskowe pismo techniczne obok rzeczowego groteska urzędowego i wyraźnego kroju maszynowego. Zestaw brzmi jak opis na rysunku wykonawczym, nie jak plakat.

### Hierarchy
- **Display** (osifont 400, 2.25rem, 1.1; na telefonie 1.875rem): tytuły stron Przykłady, Zadania, Polecenia.
- **Headline** (osifont 400, 1.5rem, 1.15): nazwa dokumentu nad edytorem, tytuł zadania, nagłówki sekcji.
- **Title** (osifont 400, 1.25rem, 1.2): nazwy kafli, nazwa rysunku w tabelce, znak słowny.
- **Body** (Public Sans 400, 0.9375rem, 1.5; treść do 62–72 znaków w wierszu): opisy, treść zadań, opis poleceń.
- **Label** (Public Sans 600, 0.8125rem): napisy przycisków, stan wykonania, wartości tabelki (cyfry tabelaryczne).
- **Code** (Red Hat Mono 400, 0.875rem / 22px; na telefonie 1rem / 24px): edytor i przykłady kodu; polecenia pogrubione 600.

### Named Rules
**The Stencil Rule.** Pismo techniczne tylko tam, gdzie na arkuszu pisze się szablonem: tytuły, nazwy, tabelka, znaczniki 2D/3D. Nigdy w zdaniach, przyciskach ani komunikatach błędów.

**The Tabular Rule.** Każda liczba, która zmienia się w czasie pracy (położenie, kurs, liczniki, tempo), ma cyfry tabelaryczne, żeby nic nie skakało.

## 4. Layout

Pracownia wypełnia okno pod belką 3rem: siatka dwóch kolumn, edytor 38% (min. 22rem) i arkusz na resztę, rozdzielone linią 2 px. Panel kodu to pionowy stos: zadanie (tylko w zadaniach), pasek dokumentu, edytor, stan, pasek uruchamiania. Pasek uruchamiania zawija suwak tempa do drugiego wiersza, gdy brakuje miejsca; podpowiedzi klawiszy przy przyciskach pojawiają się dopiero powyżej 1720 px.

Poniżej 860 px arkusz przechodzi nad edytor (40/60), tabelka zwija się do dwuwierszowej listwy pod rysunkiem, przyciski drugorzędne zostają samymi ikonami z etykietą dla czytników, a kontrolki rosną do 44 px. W zadaniach na telefonie strona się przewija, arkusz i pasek uruchamiania przyklejają się do krawędzi. W poziomie telefonu wraca układ dwukolumnowy.

Strony treści mają kolumnę do 76rem (tekst do 46rem) z odstępami 2.5rem; kafle przykładów w siatce 5 kolumn (2 na telefonie), zadania w 4 (lista na telefonie), polecenia ze spisem treści po lewej. Odstępy: 0.375rem między kontrolkami, 0.625–1rem wewnątrz paneli, 1.5–2.5rem między sekcjami.

### Named Rules
**The Sheet Is Sacred Rule.** Na arkuszu leżą tylko: rysunek, siatka, osie, żółw i tabelka. Żadnych pływających paneli, podpowiedzi ani przycisków na rysunku.

## 5. Elevation & Depth

System jest płaski. Nie ma cieni, rozmyć ani warstw szkła; głębię zastępuje grubość linii. Linia 1 px rozdziela rzeczy tego samego rzędu (komórki tabelki, kafle, kontrolki), 2 px rozdziela obszary (panele, ramka arkusza, podkreślenie sekcji), 3 px oznacza to, co wymaga uwagi (podkreślenie błędu). Okna dialogowe leżą na przyciemnionym tle i mają ramkę 2 px, bez cienia.

### Named Rules
**The Three Pens Rule.** Tylko trzy grubości: 1, 2 i 3 px. Jeśli coś ma się wyróżniać, dostaje grubszą linię albo odwrócenie (tusz jako tło), nigdy cień.

## 6. Shapes

Kontrolki mają narożnik 2 px, jak ścięty róg szablonu. Arkusz, kafle, tabelka, pola kodu i okna dialogowe mają narożniki ostre. Ikony są autorskie, rysowane jedną kreską 1.75 px w polu 20 px, z zaokrąglonymi końcami; żadnych gotowych zestawów ani emoji. Żółw to strzałka-grot wskazująca kurs, w 3D z płetwą grzbietową pokazującą przechył. Stany rozróżnia się rodzajem linii: ciągła dla rysunku, przerywana dla wzoru zadania, kreska-kropka dla osi.

## 7. Components

### Buttons
- **Shape:** wysokość 2.25rem (44 px na telefonie), narożnik 2 px, ramka 1 px tuszem.
- **Primary (Uruchom):** tło zieleń żółwia, biały tekst, ikona odtwarzania; najechanie przyciemnia do #0b6650.
- **Default (Krok, Pauza, Reset, powiększenie):** brystol z ramką tuszem; najechanie daje tło #e2e8f1, naciśnięcie odwraca na tusz.
- **Quiet (Otwórz, Pobierz, Link, Dopasuj, Kamera, PNG):** bez ramki i tła do najechania.
- **Check (Sprawdź rysunek):** odwrócony, tusz jako tło; jedyna główna czynność panelu zadania.
- **Disabled:** `aria-disabled` i krycie 0.42; przycisk zostaje w kolejności Tab.
- **Focus:** obrys 2 px błękitem ozalidu z odstępem 2 px; na belce biały obrys do wewnątrz.

### Mode switch (2D / 3D)
Grupa radiowa w jednej ramce, pismem technicznym; wybrana pozycja odwrócona na tusz. W zadaniu tryb jest ustalony, druga pozycja wygaszona.

### Tags
Znacznik trybu (2D, 3D) to pismo techniczne w cienkiej ramce w kolorze tekstu, bez tła.

### Tiles
Kafle przykładów i zadań: miniatura rysunku na brystolu, linia 1 px, nazwa pismem technicznym, jedno zdanie opisu, znacznik trybu i licznik odcinków albo stan zadania. Cały kafel jest jednym przyciskiem lub odnośnikiem; najechanie daje tło #e2e8f1 i podwójny obrys. Miniatury zadań są kreską przerywaną, jak wzór na arkuszu.

### Editor
Pole tekstowe nad pokolorowaną warstwą kodu, numery wierszy w osobnej rynnie z linią 1 px. Wykonywany wiersz ma zielonkawe tło i pogrubiony numer; błędny wiersz czerwony numer, błędny wyraz podkreślenie 3 px i dymek z komunikatem tuż pod nim. Pasek stanu pod edytorem powtarza komunikat z odnośnikiem „Wiersz N, kolumna M”, który stawia tam kursor.

### Title block (tabelka rysunkowa)
Tabela w prawym dolnym rogu arkusza, przylegająca do ramki: lewa i górna krawędź 2 px, komórki 1 px. Etykiety pismem technicznym w tuszu rozcieńczonym, wartości krojem Public Sans 550 z cyframi tabelarycznymi. Wiersze: Rysunek, Żółw i Kurs, Odcinki i Operacje, Pisak i Skala. Na telefonie zwija się do listwy z czterema wartościami.

### Navigation
Belka w błękicie ozalidu: znak-grot i nazwa pismem technicznym, cztery pozycje (Pracownia, Przykłady, Zadania, Polecenia), przełącznik motywu po prawej. Bieżąca pozycja ma białe podkreślenie 3 px. Na telefonie znika nazwa, zostaje znak.

### Dialogs and notices
Okno dialogowe: brystol, ramka 2 px, tytuł pismem technicznym, dwie czynności nazwane po skutku („Wczytaj i zachowaj kopię”, „Zostaw mój szkic”). Baner kopii szkicu leży nad edytorem i ma czynności Przywróć szkic i Usuń kopię.

## 8. Do's and Don'ts

### Do:
- **Do** rozdzielaj obszary linią 1, 2 lub 3 px w kolorze tuszu (#14213d); to jedyne narzędzie hierarchii poza wielkością pisma.
- **Do** zostaw zieleń żółwia (#0f7a5f) dla Uruchom, żółwia, tempa i stanu „zaliczone”.
- **Do** pisz komunikaty po polsku, pełnym zdaniem, z wierszem i kolumną oraz wskazówką, co poprawić.
- **Do** pokazuj wzór zadania kreską przerywaną, a osie kreską-kropką, w motywie jasnym i ciemnym.
- **Do** dawaj każdej kontrolce etykietę, widoczny fokus 2 px i cel dotyku 44 px na telefonie.
- **Do** utrzymuj kontrast tekstu co najmniej 4.5:1 w obu motywach, także w kolorowaniu składni.

### Don't:
- **Don't** dodawaj cieni, rozmyć, gradientów ani szklanych paneli; system jest płaski.
- **Don't** używaj czerwieni (#b3261e) do niczego poza błędem programu i niezaliczonym sprawdzeniem.
- **Don't** składaj zdań, przycisków ani komunikatów pismem technicznym; osifont jest do tytułów, nazw i tabelki.
- **Don't** kładź na arkuszu niczego poza rysunkiem, siatką, osiami, żółwiem i tabelką.
- **Don't** wygładzaj ruchu żółwia ani nie animuj układu; przejścia dotyczą tylko koloru tła (150 ms) i znikają przy `prefers-reduced-motion`.
- **Don't** zaokrąglaj narożników ponad 2 px i nie zagnieżdżaj ramek w ramkach.
- **Don't** używaj emoji, gotowych zestawów ikon ani kolorowych pasków przy krawędzi jako akcentu.
