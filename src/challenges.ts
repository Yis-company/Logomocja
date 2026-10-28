import { run, type Mode, type Segment, type Vec } from './interpreter';
export interface Challenge { id: string; title: string; description: string; hint: string; mode: Mode; target: string; starter: string; level: string }
export const challenges: Challenge[] = [
  { id: 'square', title: 'Cztery równe boki', description: 'Narysuj kwadrat o boku 100. Zacznij w punkcie (0, 0), w górę, potem skręcaj w prawo. Zamknij figurę.', hint: 'Pełny obrót to 360°. Podziel go na cztery równe skręty. Przyda się powtorz.', mode: '2d', target: 'powtorz 4 [np 100 pw 90]', starter: '; Kwadrat o boku 100\n; Spróbuj użyć powtorz.\n', level: '01 · Pierwsze kroki' },
  { id: 'triangle', title: 'Trzy to dobry początek', description: 'Narysuj trójkąt równoboczny o boku 120. Zacznij w (0, 0) i idź w górę. Kolejne skręty wykonuj w prawo.', hint: 'Żółw skręca o kąt zewnętrzny: 360 / 3, a nie o kąt wewnątrz trójkąta.', mode: '2d', target: 'powtorz 3 [np 120 pw 120]', starter: '; Trzy boki po 120\n', level: '02 · Kąty' },
  { id: 'steps', title: 'Schodki na papierze', description: 'Narysuj trzy stopnie. Każdy prowadzi 40 jednostek w górę, potem 40 w prawo. Zacznij w (0, 0).', hint: 'Jeden stopień to: ruch, skręt w prawo, ruch i skręt w lewo.', mode: '2d', target: 'powtorz 3 [np 40 pw 90 np 40 lw 90]', starter: '; Trzy stopnie po 40\n', level: '03 · Powtórzenia' },
  { id: 'gap', title: 'Przerwa na oddech', description: 'Na osi Y narysuj dwa odcinki: od 0 do 50 oraz od 100 do 150. Pomiędzy nimi zostaw pustą przerwę.', hint: '„pod” podnosi pisak, a „opu” go opuszcza. Żółw może się ruszać bez rysowania.', mode: '2d', target: 'np 50 pod np 50 opu np 50', starter: '; Dwie kreski i przerwa\n', level: '04 · Sterowanie pisakiem' },
  { id: 'growing', title: 'Coraz dalej', description: 'Zbuduj otwartą kwadratową spiralę: sześć kolejnych odcinków o długościach 20, 40, 60, 80, 100 i 120. Po każdym skręć w prawo o 90°.', hint: 'W powtórzeniu wartość „nrpowt” rośnie od 1. Pomnóż ją przez 20.', mode: '2d', target: 'powtorz 6 [np nrpowt * 20 pw 90]', starter: '; Sześć coraz dłuższych boków\n', level: '05 · Licznik pętli' },
  { id: 'space', title: 'O jeden wymiar dalej', description: 'Narysuj trzy przestrzenne stopnie. Każdy prowadzi 50 jednostek do przodu (+Y) i 30 w górę (+Z), zaczynając w (0, 0, 0).', hint: '„gora 90” ustawia żółwia pionowo. Po ruchu w górę wróć do poziomu przez „dol 90”.', mode: '3d', target: 'powtorz 3 [np 50 gora 90 np 30 dol 90]', starter: '; Trzy stopnie w przestrzeni\n', level: '06 · Trzeci wymiar' },
];
const distance = (a: Vec, b: Vec) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
function pointDistance(p: Vec, s: Segment) {
  const d = s.to.map((v, i) => v - s.from[i]), length2 = d.reduce((v, n) => v + n * n, 0);
  const t = Math.max(0, Math.min(1, d.reduce((v, n, i) => v + (p[i] - s.from[i]) * n, 0) / length2));
  return Math.hypot(...d.map((v, i) => p[i] - (s.from[i] + v * t)));
}
function covered(a: Segment[], b: Segment[]) {
  for (const s of a) {
    const steps = Math.max(2, Math.min(1000, Math.ceil(distance(s.from, s.to) / 1.5)));
    for (let i = 0; i <= steps; i++) {
      const p = s.from.map((v, axis) => v + (s.to[axis] - v) * i / steps) as Vec;
      if (!b.some(target => pointDistance(p, target) <= 0.8)) return false;
    }
  }
  return true;
}
export function checkChallenge(challenge: Challenge, source: string): { pass: boolean; message: string } {
  const result = run(source, challenge.mode);
  if (result.error) return { pass: false, message: `Najpierw popraw program: wiersz ${result.error.line}, kolumna ${result.error.column}. ${result.error.message}` };
  if (!result.segments.length) return { pass: false, message: 'Rysunek jest pusty. Opuść pisak i wykonaj pierwszy ruch.' };
  const target = run(challenge.target, challenge.mode).segments;
  const length = (segments: Segment[]) => segments.reduce((sum, s) => sum + distance(s.from, s.to), 0);
  // Length bounds make the symmetric geometric check fast even for adversarial submissions.
  if (Math.abs(length(result.segments) - length(target)) > Math.max(2, length(target) * 0.01)) return { pass: false, message: 'Łączna długość kresek nie pasuje do wzoru. Sprawdź długości, liczbę powtórzeń i podnoszenie pisaka.' };
  if (!covered(result.segments, target)) return { pass: false, message: 'Część kresek wychodzi poza wzór. Sprawdź kąty, kierunek i punkt początkowy. Tolerancja wynosi 0,8 jednostki.' };
  if (!covered(target, result.segments)) return { pass: false, message: 'Brakuje części wzoru. Sprawdź, czy wszystkie boki są narysowane i czy pisak jest opuszczony.' };
  return { pass: true, message: 'Udało się! Twój rysunek pasuje do wzoru. Kolejne wyzwanie czeka.' };
}
