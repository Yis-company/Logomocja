// Standardowe programy – źródła leżą w katalogu examples/ (bez zmian, bajt w bajt).
import type { Mode } from '../lang';
import kwadratSrc from '../../examples/kwadrat.logo' with { type: 'text' };
import gwiazdaSrc from '../../examples/gwiazda.logo' with { type: 'text' };
import rozetaSrc from '../../examples/rozeta.logo' with { type: 'text' };
import spiralaSrc from '../../examples/spirala.logo' with { type: 'text' };
import wielokatySrc from '../../examples/wielokaty.logo' with { type: 'text' };
import drzewoSrc from '../../examples/drzewo.logo' with { type: 'text' };
import sniezynkaSrc from '../../examples/sniezynka.logo' with { type: 'text' };
import schodySrc from '../../examples/schody.logo' with { type: 'text' };
import szescianSrc from '../../examples/szescian.logo' with { type: 'text' };
import pierscienSrc from '../../examples/pierscien.logo' with { type: 'text' };
import kulaSrc from '../../examples/kula.logo' with { type: 'text' };
import helisaSrc from '../../examples/helisa.logo' with { type: 'text' };
import drzewo3dSrc from '../../examples/drzewo3d.logo' with { type: 'text' };

export interface Example {
  id: string;
  name: string;
  mode: Mode;
  description: string;
  source: string;
}

export const EXAMPLES: Example[] = [
  { id: 'kwadrat', name: 'Kwadrat', mode: '2d', description: 'Cztery kroki do pierwszego rysunku.', source: kwadratSrc },
  { id: 'gwiazda', name: 'Gwiazda', mode: '2d', description: 'Mała zmiana kąta, wielka różnica.', source: gwiazdaSrc },
  { id: 'rozeta', name: 'Rozeta', mode: '2d', description: 'Jeden kwadrat. Wiele możliwości.', source: rozetaSrc },
  { id: 'spirala', name: 'Spirala', mode: '2d', description: 'Licznik powtórzeń i zmienna zmieniają kolor.', source: spiralaSrc },
  { id: 'wielokaty', name: 'Wielokąty', mode: '2d', description: 'Procedura liczy kąt z liczby boków.', source: wielokatySrc },
  { id: 'drzewo', name: 'Drzewo', mode: '2d', description: 'Gałąź rysuje dwie mniejsze gałęzie.', source: drzewoSrc },
  { id: 'sniezynka', name: 'Śnieżynka', mode: '2d', description: 'Krzywa Kocha z czterech poziomów.', source: sniezynkaSrc },
  { id: 'schody', name: 'Schody', mode: '3d', description: 'Pierwszy krok w trzeci wymiar.', source: schodySrc },
  { id: 'szescian', name: 'Sześcian', mode: '3d', description: 'Zbuduj bryłę z prostych poleceń.', source: szescianSrc },
  { id: 'pierscien', name: 'Pierścień', mode: '3d', description: 'Okrąg przechylony w przestrzeni.', source: pierscienSrc },
  { id: 'kula', name: 'Kula', mode: '3d', description: 'Okręgi obrócone wokół kierunku żółwia.', source: kulaSrc },
  { id: 'helisa', name: 'Helisa', mode: '3d', description: 'Spirala wznosi się obrót po obrocie.', source: helisaSrc },
  { id: 'drzewo3d', name: 'Drzewo 3D', mode: '3d', description: 'Gałęzie obracają się wokół pnia.', source: drzewo3dSrc },
];

export function findExample(idOrName: string): Example | undefined {
  const key = idOrName.normalize('NFC').toLowerCase();
  return EXAMPLES.find((e) => e.id === key || e.name.toLowerCase() === key);
}
