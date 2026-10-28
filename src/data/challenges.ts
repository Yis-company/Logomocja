import type { Mode } from '../lang/types';

export interface Challenge {
  id: string;
  title: string;
  mode: Mode;
  level: 1 | 2 | 3;
  task: string;
  hint: string;
  /** Reference solution; the expected drawing is whatever this program draws. */
  reference: string;
  /** Extra requirements on the source, checked on top of the drawing. */
  requires?: { command: 'repeat' | 'procedure'; message: string }[];
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'kwadrat',
    title: 'Kwadrat',
    mode: '2d',
    level: 1,
    task: 'Narysuj kwadrat o boku 100. Zacznij w punkcie startowym, najpierw idź do góry i skręcaj w prawo.',
    hint: 'Cztery razy: naprzód 100, w prawo 90. Użyj powtorz 4 [ … ] albo cztery razy napisz te dwa polecenia.',
    reference: 'powtorz 4 [np 100 pw 90]',
  },
  {
    id: 'trojkat',
    title: 'Trójkąt równoboczny',
    mode: '2d',
    level: 1,
    task: 'Narysuj trójkąt równoboczny o boku 120. Zacznij w punkcie startowym, idź do góry i skręcaj w prawo.',
    hint: 'Trzy boki, a po każdym skręt o kąt zewnętrzny. Cały obrót to 360°, więc 360 / 3 = 120°.',
    reference: 'powtorz 3 [np 120 pw 120]',
  },
  {
    id: 'szesciokat',
    title: 'Sześciokąt z pętlą',
    mode: '2d',
    level: 1,
    task: 'Narysuj sześciokąt foremny o boku 80, używając polecenia powtorz. Zacznij w punkcie startowym, idź do góry i skręcaj w prawo.',
    hint: 'Sześć boków i skręt 360 / 6 = 60 stopni po każdym z nich.',
    reference: 'powtorz 6 [np 80 pw 60]',
    requires: [{ command: 'repeat', message: 'Użyj polecenia powtorz.' }],
  },
  {
    id: 'schodki',
    title: 'Schodki',
    mode: '2d',
    level: 2,
    task: 'Narysuj cztery stopnie schodów: każdy to 40 w górę, potem 40 w prawo. Zacznij w punkcie startowym, żółw patrzy do góry. Schody nie wracają do początku.',
    hint: 'Jeden stopień: np 40, pw 90, np 40, lw 90 – po nim żółw znów patrzy do góry. Powtórz to 4 razy.',
    reference: 'powtorz 4 [np 40 pw 90 np 40 lw 90]',
  },
  {
    id: 'gwiazda',
    title: 'Pięcioramienna gwiazda',
    mode: '2d',
    level: 2,
    task: 'Narysuj pięcioramienną gwiazdę jednym pociągnięciem: pięć odcinków o długości 150. Zacznij w punkcie startowym, idź do góry i skręcaj w prawo.',
    hint: 'Przy gwieździe skręt wynosi 144°, a nie 72°. Pięć razy: np 150, pw 144.',
    reference: 'powtorz 5 [np 150 pw 144]',
  },
  {
    id: 'dom',
    title: 'Domek',
    mode: '2d',
    level: 2,
    task: 'Narysuj domek: kwadrat 100 × 100 (jak w pierwszym wyzwaniu: do góry i w prawo od punktu startowego), a na nim dach – trójkąt równoboczny o boku 100 wsparty na górnym boku kwadratu.',
    hint: 'Po kwadracie żółw stoi w punkcie startowym, patrząc do góry. Idź np 100 na górny lewy róg, skręć w prawo o 30° i narysuj trójkąt: powtorz 3 [np 100 pw 120].',
    reference: 'powtorz 4 [np 100 pw 90]\nnp 100 pw 30\npowtorz 3 [np 100 pw 120]',
  },
  {
    id: 'okrag',
    title: 'Okrąg',
    mode: '2d',
    level: 2,
    task: 'Narysuj okrąg jako wielokąt o 36 bokach długości 10. Zacznij w punkcie startowym, idź do góry i skręcaj w prawo.',
    hint: 'powtorz 36 [np 10 pw 10] – 36 × 10° daje pełny obrót.',
    reference: 'powtorz 36 [np 10 pw 10]',
  },
  {
    id: 'kwadraty',
    title: 'Trzy kwadraty z procedurą',
    mode: '2d',
    level: 3,
    task: 'Zdefiniuj własną procedurę rysującą kwadrat o zadanym boku i użyj jej do narysowania trzech kwadratów o bokach 40, 80 i 120, wszystkich z jednym wspólnym rogiem w punkcie startowym (do góry i w prawo).',
    hint: 'oto kw ma: a … już – w środku powtorz 4 [np a pw 90]. Potem: kw 40 kw 80 kw 120. Po każdym kwadracie żółw wraca na start i patrzy do góry.',
    reference: 'oto kw ma: a\n  powtorz 4 [np a pw 90]\njuż\nkw 40 kw 80 kw 120',
    requires: [{ command: 'procedure', message: 'Zdefiniuj własną procedurę (oto … już) i użyj jej.' }],
  },
  {
    id: 'osie',
    title: 'Trzy osie',
    mode: '3d',
    level: 2,
    task: 'Narysuj trzy odcinki długości 100 wychodzące z punktu startowego: wzdłuż osi Y (przed żółwiem), osi Z (do góry) i osi X (w prawo). Po każdym odcinku wróć do punktu startowego.',
    hint: 'np 100 ws 100 rysuje odcinek tam i z powrotem. Potem gora 90 kieruje żółwia w górę (oś Z), dol 90 przywraca poprzedni kierunek, a pw 90 kieruje go wzdłuż osi X.',
    reference: 'np 100 ws 100\ngora 90 np 100 ws 100 dol 90\npw 90 np 100 ws 100',
  },
  {
    id: 'szescian',
    title: 'Sześcian',
    mode: '3d',
    level: 3,
    task: 'Narysuj sześcian o krawędzi 100, którego jeden wierzchołek leży w punkcie startowym, a krawędzie biegną wzdłuż dodatnich osi X, Y i Z.',
    hint: 'Dwa kwadraty (dolny i górny) połączone czterema krawędziami. Do góry przechodzisz poleceniem gora 90, a wracasz poleceniem dol 90.',
    reference: 'powtorz 4 [np 100 pw 90]\ngora 90 np 100 dol 90\npowtorz 4 [np 100 pw 90]\npowtorz 4 [\n  np 100\n  dol 90 np 100\n  pod ws 100 opu\n  gora 90 pw 90\n]',
  },
];
