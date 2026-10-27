export interface Example {
  name: string;
  category: string;
  desc: string;
  mode: "2d" | "3d";
  code: string;
  art: string;
  color: string;
}
export const examples: Example[] = [
  {
    name: "Rozeta",
    category: "GEOMETRIA",
    desc: "Z jednego kwadratu — cały kwiat.",
    mode: "2d",
    color: "#16866a",
    art: "rosette",
    code: '; Mały krok, wielki wzór.\n; Obróć kwadrat i zobacz, co powstanie.\n\nkolor "#16866a"\ngrubość 2\n\npowtórz 36 [\n  powtórz 4 [\n    np 100\n    pw 90\n  ]\n  pw 10\n]',
  },
  {
    name: "Pierwszy kwadrat",
    category: "NA POCZĄTEK",
    desc: "Cztery kroki. Cztery zakręty.",
    mode: "2d",
    color: "#bd8251",
    art: "square",
    code: '; Każda podróż zaczyna się od kroku.\nkolor "#bd8251"\ngrubość 3\n\npowtórz 4 [\n  np 120\n  pw 90\n]',
  },
  {
    name: "Kolorowy ogród",
    category: "PROCEDURY",
    desc: "Napisz raz, rozkwitaj wiele razy.",
    mode: "2d",
    color: "#a8789b",
    art: "flower",
    code: '; Procedura to Twój własny przepis.\noto płatek ma: bok\n  powtórz 2 [\n    np bok pw 60\n    np bok pw 120\n  ]\njuż\n\ngrubość 2\nkolor "#a8789b"\npowtórz 12 [płatek 65 pw 30]\nkolor "#bd8251"\npowtórz 12 [płatek 35 pw 30]',
  },
  {
    name: "W trzeci wymiar",
    category: "ODKRYJ 3D",
    desc: "Oderwij żółwia od kartki.",
    mode: "3d",
    color: "#6e87b5",
    art: "cube",
    code: '; Obracaj widok, przeciągając myszą.\nkolor "#6e87b5"\ngrubość 3\n\noto kwadrat ma: bok\n  powtórz 4 [np bok pw 90]\njuż\n\nkwadrat 100\ngóra 90\nnp 100\ndół 90\nkwadrat 100\npowtórz 3 [\n  np 100 pw 90\n  dół 90 np 100\n  ws 100 góra 90\n]',
  },
];
export function exampleArt(art: string, color: string) {
  let paths = "";
  if (art === "rosette") {
    for (let i = 0; i < 18; i++)
      paths += `<rect x="0" y="0" width="30" height="30" transform="rotate(${i * 20})"/>`;
  } else if (art === "square")
    paths =
      '<rect x="-25" y="-25" width="50" height="50"/><path d="M-25 25l-5 7h10Z" fill="currentColor"/>';
  else if (art === "flower") {
    for (let i = 0; i < 12; i++)
      paths += `<path d="M0 0Q-30-38 0-41Q30-38 0 0" transform="rotate(${i * 30})"/>`;
  } else
    paths =
      '<path d="m0-36 33 19v38L0 40l-33-19v-38ZM-33-17 0 2l33-19M0 2v38M0-36V2"/>';
  return `<svg viewBox="-55 -55 110 110" fill="none" stroke="${color}" stroke-width="1.2" aria-hidden="true">${paths}</svg>`;
}
