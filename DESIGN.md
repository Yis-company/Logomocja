---
name: Logomocja
description: Spokojna pracownia do rysowania kodem.
colors:
  primary: "#16866a"
  primary-hover: "#10664f"
  shell: "#edf2ed"
  surface: "#ffffff"
  subtle: "#f6f8f5"
  ink: "#253c34"
  muted: "#65776c"
  line: "#dce4dd"
  selected: "#e4f0e8"
  error: "#ae3e38"
  error-bg: "#fff1ee"
  dark-shell: "#1d3026"
  dark-surface: "#17251f"
  dark-ink: "#e0ece3"
  dark-primary: "#57c9a3"
typography:
  headline:
    fontFamily: "Manrope Variable, Manrope, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-1px"
  title:
    fontFamily: "Manrope Variable, Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 750
    letterSpacing: "-0.4px"
  body:
    fontFamily: "Manrope Variable, Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.95
  label:
    fontFamily: "Manrope Variable, Manrope, sans-serif"
    fontSize: "11px"
    fontWeight: 650
  code:
    fontFamily: "JetBrains Mono Variable, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: "25px"
rounded:
  sm: "4px"
  control: "6px"
  notification: "8px"
  dialog: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "36px"
    padding: "0 14px"
  input-search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
---

# Design System: Logomocja

## Overview

**Creative North Star: "Pracownia odkrywców"**

System przywołuje muzealną pracownię edukacyjną: spokojne otoczenie, czytelne opisy i wolną przestrzeń do eksperymentowania. Zieleń wiąże działania z rysunkiem. Geometria jest prawdziwym rezultatem programu, a interfejs pomaga ją obejrzeć i zrozumieć.

To powierzchnia Operate. Znane przyciski, pola i nawigacja mają pierwszeństwo przed ozdobą. Charakter powstaje przez szałwiowe tło, precyzyjne wyrównanie, lokalne fonty i miniatury wykonywanych programów.

**Key Characteristics:**
- Jasne i ciemne powierzchnie o zielonym tonie.
- Płaskie podziały i oszczędna hierarchia tekstu.
- Autentyczne rysunki żółwia zamiast dekoracyjnych ilustracji.
- Jawne stany wykonania, błędów i lokalnego zapisu.

## Colors

Zieleń pisaka jest głównym akcentem; otaczają ją lekko zielone neutralne powierzchnie.

### Primary
- **Zieleń żółwia:** główne akcje, aktywny tryb, zaznaczenia, fokus i domyślny rysunek.
- **Ciemniejsza zieleń:** stan wskazania głównych przycisków.

### Neutral
- **Szałwiowe tło:** rama aplikacji i biblioteka.
- **Biała plansza:** pole rysunku i podstawowe powierzchnie.
- **Jasna zieleń neutralna:** edytor, opisy i przykłady kodu.
- **Atrament:** tekst podstawowy. Stonowana zieleń opisów zapewnia cichszą hierarchię.
- **Linia:** podziały obszarów, kontrolki i obramowania.

### Named Rules
**The Action Green Rule.** Akcent wskazuje działanie, wybór lub stan; kolory samego rysunku należą do programu użytkownika.

Motyw ciemny zamienia wszystkie powierzchnie i teksty przez zmienne CSS. Kolor odcinka pozostaje wartością z programu.

## Typography

**Body Font:** Manrope Variable, z lokalnym fallbackiem sans-serif.
**Label/Mono Font:** JetBrains Mono Variable dla kodu i współrzędnych.

Manrope ma przyjazny, geometryczny charakter. Hierarchia jest zwarta: tytuł biblioteki 16 px, nazwy paneli 12 px, kontrolki 11–12 px. Tekst przewodnika ma 12 px, interlinię 1,95 i miarę do 72ch. Jego główny nagłówek ma 30 px, na telefonie 25 px. Drobne informacje pomocnicze mają 8–10 px.

Kod ma 11 px i interlinię 25 px; przy szerokim ekranie rośnie do 12/27 px, a w zwężonym układzie desktopowym do 10/24 px. Telefon przywraca 11/24 px. Font nie używa ligatur. Kolorami rozróżnione są polecenia, liczby, nazwy, napisy, komentarze, nawiasy i operatory.

**The Code Is Code Rule.** Monospace służy kodowi i pomiarom, nie etykietom interfejsu.

## Layout

Główna przestrzeń jest trzema sąsiadującymi obszarami, bez kart wokół każdego panelu. Domyślna siatka ma kolumny 218 px, 360 px i pozostałą szerokość. Od 1550 px rosną do 240 i 420 px. Przy 1150 i 900 px kolumny się zwężają. Poniżej 740 px biblioteka przechodzi w poziomy wybór, edytor i plansza układają się pionowo. Kontrolki pozostają przy właściwym obszarze.

Nagłówek desktopowy ma 79 px, pasek nawigacji 57 px, stopka 44 px. Główna przestrzeń wypełnia pozostałą wysokość z minimum 650 px. Telefon używa wysokości treści i osobnych obszarów edytora (405 px) i rysunku (510 px).

Odstępy grupują kontrolki po 7–10 px; panele mają zwykle 16–25 px wewnętrznego marginesu. Przewodnik używa osobnego indeksu i większych przerw pomiędzy rozdziałami. Siatka punktów istnieje wyłącznie w rzeczywistej planszy Canvas.

## Elevation & Depth

Panele są płaskie, oddzielone tonem i pojedynczą linią. Cień jest zarezerwowany dla powiadomień oraz dialogów, które znajdują się ponad obszarem pracy. Nie ma cieni pod każdym panelem.

### Shadow Vocabulary
- **Powiadomienie:** `0 12px 35px #1f3a2e1a`.
- **Dialog:** `0 25px 80px #102e2940`, z przyciemnionym tłem.

**The Flat Workspace Rule.** Głębię w stałym układzie tworzą odcienie i podziały; warstwa nad nim może użyć miękkiego cienia.

## Shapes

Przyciski i pola mają promień 6 px, małe elementy 4 px, powiadomienia 8 px, a dialogi 12 px. Obramowania mają 1 px. Małe liczniki mają dyskretne narożniki; koła w wyzwaniach służą numerom i ukończeniu zadania. Ikony to spójne, obrysowe SVG o grubości 1,65, najczęściej 14–18 px.

## Components

### Buttons
Główne przyciski są zielone, z białym tekstem i krótkim czasownikiem. Drugorzędne używają powierzchni i obramowania. Kontrolki ikonowe mają dostępne etykiety i tytuły. Fokus to obrys 2 px z odsunięciem 3 px. Stan wyłączony zmniejsza krycie do 0,4. Wskazanie zmienia tło przez 150 ms; nie ma animacji wejścia strony.

### Inputs / Fields
Wyszukiwarka ma pojedynczą linię i promień 6 px. Suwak tempa korzysta z natywnej kontrolki w kolorze akcentu. Edytor jest tekstowym polem z zsynchronizowanym podświetleniem i numerami. Błąd ma kolorowy znak w kolumnie, podświetloną linię i polski komunikat. Zaznaczenie, karetka i fokus korzystają z palety.

### Navigation
Główne karty nawigacji mają ikonę, nazwę i zielone podkreślenie aktywnej strony. Przełącznik 2D/3D używa wypełnionego aktywnego przycisku. Biblioteka zaznacza wybrany przykład delikatnym tłem i linią. Telefon przewija przykłady poziomo; indeks przewodnika staje się przewijanym pasem odnośników.

### Program thumbnails
Miniatury są rysowane z właściwego źródła programu przez ten sam interpreter i projekcję co plansza. Nie są osobnymi obrazkami udającymi rezultat. Dopasowanie małych plansz używa proporcjonalnego marginesu.

### Feedback
Zielony sygnalizuje sukces, czerwony błąd. Tekst zawsze wyjaśnia stan. Stan wykonywania łączy linię kodu i pozycję żółwia; ograniczone miganie kropki respektuje `prefers-reduced-motion`. Dialogi służą historii i awaryjnemu kopiowaniu linku, z natywnym zarządzaniem fokusem.

## Do's and Don'ts

### Do:
- **Do** pozostawiaj rysunkowi dużą, spokojną powierzchnię.
- **Do** zachowuj wspólne wyrównania paneli i kontrolki przy ich zadaniu.
- **Do** pokazuj stan słowem oraz znakiem, także w motywie ciemnym.
- **Do** używaj prawdziwego interpretera do podglądów programów.

### Don't:
- **Don't** dodawaj dekoracyjnych kart i cieni do stałego układu pracy.
- **Don't** zastępuj geometrii ilustracją lub statyczną atrapą wyniku.
- **Don't** używaj monospace jako ozdoby etykiet.
- **Don't** polegaj wyłącznie na kolorze przy błędach i ukończeniu zadań.
