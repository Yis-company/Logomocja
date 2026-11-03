import type { Mode } from '../lang/types';

export const STARTERS: Record<Mode, string> = {
  '2d': `; Witaj w Logomocji! Uruchom program przyciskiem Uruchom.
; Potem zmień liczby i sprawdź, co narysuje żółw.
kolor "#16866a"
grubosc 3
powtorz 6 [
  powtorz 6 [np 40 pw 60]
  pw 60
]`,
  '3d': `; W przestrzeni żółw umie też wznosić się i przechylać.
; Przeciągnij rysunek, żeby obejrzeć go z każdej strony.
kolor "#2b6fb3"
grubosc 3
powtorz 12 [
  powtorz 4 [np 60 pw 90]
  pp 30
]`,
};
