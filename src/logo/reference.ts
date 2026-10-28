import type { Mode } from './ast';

export interface RefEntry {
  /** Polish and English spellings, as written in the dialect. */
  names: string[];
  /** What the command takes. */
  arg: string;
  /** Explanation in Polish. */
  text: string;
  /** A short program that demonstrates the command. */
  example: string;
  mode: Mode;
}

/** One entry per command, with an example that is run by the test suite. */
export const COMMAND_REFERENCE: RefEntry[] = [
  {
    names: ['np', 'naprzód', 'naprzod', 'fd', 'forward'],
    arg: 'wyrażenie',
    text: 'Idzie do przodu o podaną długość. Jeśli pióro jest opuszczone, rysuje odcinek.',
    example: 'powtorz 4 [np 80 pw 90]',
    mode: '2d',
  },
  {
    names: ['ws', 'wstecz', 'bk', 'back'],
    arg: 'wyrażenie',
    text: 'Idzie do tyłu o podaną długość.',
    example: 'np 80 ws 40',
    mode: '2d',
  },
  {
    names: ['pw', 'prawo', 'rt', 'right'],
    arg: 'wyrażenie (stopnie)',
    text: 'Obraca żółwia w prawo o podany kąt. Ujemny kąt obraca w lewo.',
    example: 'np 50 pw 90 np 50',
    mode: '2d',
  },
  {
    names: ['lw', 'lewo', 'lt', 'left'],
    arg: 'wyrażenie (stopnie)',
    text: 'Obraca żółwia w lewo o podany kąt.',
    example: 'np 50 lw 90 np 50',
    mode: '2d',
  },
  {
    names: ['pod', 'podnieś', 'podnies', 'pu', 'penup'],
    arg: 'brak',
    text: 'Podnosi pióro: ruch nie zostawia śladu.',
    example: 'np 30 pod np 30 opu np 30',
    mode: '2d',
  },
  {
    names: ['opu', 'opuść', 'opusc', 'pd', 'pendown'],
    arg: 'brak',
    text: 'Opuszcza pióro: ruch znów rysuje.',
    example: 'pod np 30 opu np 30',
    mode: '2d',
  },
  {
    names: ['kolor', 'color'],
    arg: 'kolor w cudzysłowie, np. "#16866a"',
    text: 'Ustawia kolor pióra. Kolor zapisujemy jako sześć cyfr szesnastkowych w cudzysłowie.',
    example: 'kolor "#c1763d" np 60',
    mode: '2d',
  },
  {
    names: ['grubość', 'grubosc', 'width'],
    arg: 'liczba całkowita 1–12',
    text: 'Ustawia grubość linii.',
    example: 'grubosc 8 np 60',
    mode: '2d',
  },
  {
    names: ['powtórz', 'powtorz', 'repeat'],
    arg: 'liczba 0–10000, potem [ polecenia ]',
    text: 'Wykonuje polecenia w nawiasach podaną liczbę razy. Wewnątrz działa nrpowt.',
    example: 'powtorz 6 [np 40 pw 60]',
    mode: '2d',
  },
  {
    names: ['niech', 'let'],
    arg: 'nazwa wyrażenie',
    text: 'Przypisuje wartość zmiennej. Na poziomie programu zmienna jest globalna, w procedurze lokalna.',
    example: 'niech bok 50\nnp bok pw 90 np bok',
    mode: '2d',
  },
  {
    names: ['jeśli', 'jesli', 'if'],
    arg: 'warunek [ polecenia ]',
    text: 'Wykonuje polecenia, gdy warunek jest prawdziwy. Warunek to wyrażenie, porównanie (=, <, >, <=, >=, <>) i wyrażenie.',
    example: 'niech x 3\njeśli x > 2 [np 50]',
    mode: '2d',
  },
  {
    names: ['jeżeli', 'jezeli', 'ifelse'],
    arg: 'warunek [ polecenia ] [ inaczej ]',
    text: 'Wykonuje pierwszy blok, gdy warunek jest prawdziwy, a drugi w przeciwnym razie.',
    example: 'niech x 1\njeżeli x > 2 [kolor "#16866a" np 40] [kolor "#c1763d" np 80]',
    mode: '2d',
  },
  {
    names: ['stop'],
    arg: 'brak',
    text: 'Kończy bieżącą procedurę. Na poziomie programu kończy cały program.',
    example: 'oto kreska ma: d\n  np d\n  jeśli d > 50 [stop]\n  np d\njuz\n\nkreska 60\nkreska 20',
    mode: '2d',
  },
  {
    names: ['dom', 'home'],
    arg: 'brak',
    text: 'Wraca do punktu (0, 0) i do kierunku w górę. Pióro, kolor i grubość zostają bez zmian.',
    example: 'np 50 pw 90 np 50 dom',
    mode: '2d',
  },
  {
    names: ['czyść', 'czysc', 'cs', 'clearscreen'],
    arg: 'brak',
    text: 'Usuwa wszystkie dotychczas narysowane odcinki. Żółw zostaje tam, gdzie jest.',
    example: 'np 50 cs pw 90 np 50',
    mode: '2d',
  },
  {
    names: ['góra', 'gora', 'pitchup'],
    arg: 'wyrażenie (stopnie)',
    text: 'Tylko 3D. Podnosi nos żółwia o podany kąt, w stronę wektora „góry”.',
    example: 'gora 45 np 60',
    mode: '3d',
  },
  {
    names: ['dół', 'dol', 'pitchdown'],
    arg: 'wyrażenie (stopnie)',
    text: 'Tylko 3D. Opuszcza nos żółwia o podany kąt.',
    example: 'dol 45 np 60',
    mode: '3d',
  },
  {
    names: ['pp', 'przechylprawo', 'rr', 'rollright'],
    arg: 'wyrażenie (stopnie)',
    text: 'Tylko 3D. Przechyla żółwia w prawo wokół kierunku ruchu; kierunek się nie zmienia.',
    example: 'pp 45 np 40 pw 90 np 40',
    mode: '3d',
  },
  {
    names: ['pl', 'przechyllewo', 'rl', 'rollleft'],
    arg: 'wyrażenie (stopnie)',
    text: 'Tylko 3D. Przechyla żółwia w lewo wokół kierunku ruchu.',
    example: 'pl 45 np 40',
    mode: '3d',
  },
];

/** Value words, not commands. */
export const VALUE_REFERENCE = {
  nrpowt: 'numer bieżącego powtórzenia, liczony od 1 (alias: repcount)',
};
