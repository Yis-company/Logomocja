import type { Mode } from '../lang/ast';
import { CHALLENGES } from '../data/challenges';
import { EXAMPLES } from '../data/examples';
import { REFERENCE } from '../data/reference';
import { Stash } from './store';

const norm = (s: string) => s.replace(/\r\n?/g, '\n').trim();

/** Teksty dostarczane przez aplikację (przykłady, strona poleceń, wyzwania) — nie są szkicem użytkownika. */
let builtIn: Set<string> | null = null;
function builtInTexts(): Set<string> {
  if (builtIn) return builtIn;
  const set = new Set<string>();
  for (const e of EXAMPLES) set.add(norm(e.source));
  for (const c of CHALLENGES) {
    set.add(norm(c.starter));
    set.add(norm(c.solution));
  }
  for (const sec of REFERENCE) {
    for (const b of sec.blocks) {
      if (b.t === 'example') set.add(norm(b.example.code));
      else if (b.t === 'commands') for (const c of b.items) set.add(norm(c.example.code));
    }
  }
  builtIn = set;
  return set;
}

/** Czy tekst to niezapisany szkic użytkownika (nie przykład, nie szablon, nie kopia w „Szkicach”). */
export function isUserDraft(text: string, mode: Mode, pristine: string[] = []): boolean {
  const t = norm(text);
  if (t === '') return false;
  if (builtInTexts().has(t)) return false;
  if (pristine.some((p) => norm(p) === t)) return false;
  if (Stash.list().some((e) => e.mode === mode && norm(e.source) === t)) return false;
  return true;
}
