import type { Mode } from '../lang/ast';
import { run } from '../lang/index';
import { EXAMPLES } from '../examples';
import { CHALLENGES, patternOf, requirementText } from '../challenges';
import { h } from './dom';
import { icon } from './icons';
import { thumbnail } from './thumbs';
import { getProgress, resetProgress } from './progress';
import { SHORTCUTS, shortcutLabel } from './shortcuts';
import { REFERENCE, type RefEntry } from './reference-content';

const LEVEL = ['', 'łatwe', 'średnie', 'trudne'];

function modeTag(mode: Mode) {
  return h('span', { class: `tag tag-${mode}` }, mode === '2d' ? '2D' : '3D');
}

// ------------------------------------------------------------------ examples

export function galleryPage(): HTMLElement {
  const section = (mode: Mode, title: string, lead: string) => {
    const id = `g-${mode}`;
    return h('section', { class: 'cells-section', 'aria-labelledby': id, 'data-mode': mode },
      h('h2', { id, class: 'section-title' }, title),
      h('p', { class: 'section-lead' }, lead),
      h('ul', { class: 'cells' },
        EXAMPLES.filter((e) => e.mode === mode).map((e) => {
          const segs = run(e.source, e.mode).segments;
          const desc = `ex-${e.id}-d`;
          return h('li', null,
            h('a', { class: 'cell', href: `#/przyklad/${e.id}`, 'aria-describedby': desc },
              h('div', { class: 'cell-figure' }, thumbnail(segs, e.mode, `Rysunek: ${e.title}`)),
              h('div', { class: 'cell-body' },
                h('h3', { class: 'cell-title' }, e.title, modeTag(e.mode)),
                h('p', { class: 'cell-text', id: desc }, e.blurb),
              ),
            ),
          );
        }),
      ),
    );
  };
  return h('div', { class: 'page page-gallery' },
    h('header', { class: 'page-band band-neutral' },
      h('h1', { class: 'band-title' }, 'Przykłady'),
      h('p', { class: 'band-lead' }, 'Trzynaście gotowych programów. Otwórz dowolny w pracowni. Twój szkic zostanie zachowany i można go przywrócić.'),
    ),
    h('div', { class: 'page-body' },
      section('2d', 'Na płaszczyźnie', 'Siedem rysunków 2D: od kwadratu po krzywą Kocha.'),
      section('3d', 'W przestrzeni', 'Sześć brył i linii 3D. Po otwarciu obracaj je myszą albo palcem.'),
    ),
  );
}

// ------------------------------------------------------------------ challenges

export function challengesPage(): HTMLElement {
  const progress = getProgress();
  const solved = CHALLENGES.filter((c) => progress[c.id]).length;
  const list = h('ol', { class: 'cells cells-tasks' },
    CHALLENGES.map((c, i) => {
      const done = progress[c.id];
      const desc = `task-${c.id}-d`;
      return h('li', null,
        h('a', { class: `cell cell-task${done ? ' is-solved' : ''}`, href: `#/zadanie/${c.id}`, 'aria-describedby': desc },
          h('div', { class: 'cell-figure' }, thumbnail(patternOf(c), c.mode, `Wzór: ${c.title}`)),
          h('div', { class: 'cell-body' },
            h('h2', { class: 'cell-title' }, h('span', { class: 'cell-n' }, `${i + 1}.`), c.title),
            h('p', { class: 'cell-text', id: desc }, c.task),
            h('p', { class: 'cell-meta' },
              modeTag(c.mode),
              h('span', null, `Poziom: ${LEVEL[c.level]}`),
              c.requires?.length ? h('span', null, `wymaga ${c.requires.map(requirementText).join(', ')}`) : null,
              done
                ? h('span', { class: 'cell-status is-solved' }, icon('check', 14), `rozwiązane ${new Date(done.solvedAt).toLocaleDateString('pl-PL')}`)
                : h('span', { class: 'cell-status' }, 'do zrobienia'),
            ),
          ),
        ),
      );
    }),
  );

  const resetBtn = h('button', { class: 'btn btn-quiet btn-sm btn-danger', type: 'button' }, 'Wyczyść postępy') as HTMLButtonElement;
  let armed = false;
  resetBtn.addEventListener('click', () => {
    if (!armed) {
      armed = true;
      resetBtn.textContent = 'Na pewno? Kliknij ponownie, aby wyczyścić';
      setTimeout(() => {
        armed = false;
        resetBtn.textContent = 'Wyczyść postępy';
      }, 5000);
      return;
    }
    resetProgress();
    location.hash = '#/zadania';
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });

  return h('div', { class: 'page page-tasks' },
    h('header', { class: 'page-band band-task' },
      h('h1', { class: 'band-title' }, 'Zadania'),
      h('p', { class: 'band-lead' }, 'Narysuj to, co pokazuje wzór. Pracownia sprawdzi rysunek sama. Wystarczy, że kształt, rozmiar i kierunek się zgadzają; żółw może zacząć w dowolnym miejscu, a rysunek może być lustrzany (skręty w lewo zamiast w prawo).'),
    ),
    h('div', { class: 'page-body' },
      h('div', { class: 'tasks-summary' },
        h('p', { class: 'tasks-count' }, h('strong', null, `${solved} z ${CHALLENGES.length}`), ' rozwiązanych'),
        h('div', { class: 'tasks-bar', role: 'img', 'aria-label': `Rozwiązano ${solved} z ${CHALLENGES.length} zadań` },
          CHALLENGES.map((c) => h('span', { class: `tasks-tick${progress[c.id] ? ' is-on' : ''}` })),
        ),
        solved ? resetBtn : null,
      ),
      list,
      h('p', { class: 'page-note' }, 'Postępy i rozwiązania zapisują się tylko w tej przeglądarce.'),
    ),
  );
}

// ------------------------------------------------------------------ reference

export function referencePage(onTry: (code: string, mode: Mode) => void, focusId?: string): HTMLElement {
  const toc = h('nav', { class: 'ref-toc', 'aria-label': 'Spis treści pomocy' },
    h('ol', null, REFERENCE.map((s) => h('li', null, h('a', { href: `#/pomoc/${s.id}` }, s.title)))),
  );

  const entry = (e: RefEntry) =>
    h('article', { class: 'ref-entry', id: e.id ? `ref-${e.id}` : undefined },
      h('h3', { class: 'ref-name' }, ...e.names.map((n, i) => h('code', { class: i === 0 ? 'ref-main' : 'ref-alias' }, n))),
      e.arg ? h('p', { class: 'ref-arg' }, h('span', { class: 'ref-arg-k' }, 'Argument: '), e.arg) : null,
      h('p', { class: 'ref-text' }, e.text),
      e.example ? exampleBlock(e.example.code, e.example.mode ?? '2d', onTry) : null,
    );

  const article = h('div', { class: 'ref-article' },
    REFERENCE.map((s) =>
      h('section', { class: 'ref-section', id: `pomoc-${s.id}`, 'aria-labelledby': `pomoc-${s.id}-h` },
        h('h2', { id: `pomoc-${s.id}-h`, class: 'ref-h2', tabindex: '-1' }, s.title),
        s.intro?.map((p) => h('p', { class: 'ref-p' }, ...richText(p))),
        s.id === 'skroty' ? shortcutsTable() : null,
        s.table ? refTable(s.table) : null,
        s.entries?.map(entry),
        s.examples?.map((ex) => h('div', { class: 'ref-ex' }, ex.caption ? h('p', { class: 'ref-p' }, ...richText(ex.caption)) : null, exampleBlock(ex.code, ex.mode ?? '2d', onTry))),
      ),
    ),
  );

  const page = h('div', { class: 'page page-ref' },
    h('header', { class: 'page-band band-ref' },
      h('h1', { class: 'band-title' }, 'Pomoc'),
      h('p', { class: 'band-lead' }, 'Cały język Logomocji: polecenia, wyrażenia, zmienne, warunki, procedury i limity. Każdy przykład otworzysz przyciskiem Wypróbuj.'),
    ),
    h('div', { class: 'page-body ref-layout' }, toc, article),
  );
  if (focusId) {
    requestAnimationFrame(() => {
      const target = page.querySelector<HTMLElement>(`#pomoc-${CSS.escape(focusId)}-h`);
      target?.scrollIntoView({ block: 'start' });
      target?.focus({ preventScroll: true });
    });
  }
  return page;
}

function richText(s: string): (Node | string)[] {
  // `code` spans in reference prose
  return s.split(/(`[^`]+`)/).map((part) => (part.startsWith('`') ? h('code', null, part.slice(1, -1)) : part));
}

function refTable(t: { head: string[]; rows: string[][] }) {
  return h('div', { class: 'table-wrap' },
    h('table', { class: 'ref-table' },
      h('thead', null, h('tr', null, t.head.map((c) => h('th', { scope: 'col' }, c)))),
      h('tbody', null, t.rows.map((r) => h('tr', null, r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, ...richText(c)) : h('td', null, ...richText(c))))))),
    ),
  );
}

function shortcutsTable() {
  const rows = (Object.keys(SHORTCUTS) as (keyof typeof SHORTCUTS)[]).map((k) => [shortcutLabel(SHORTCUTS[k].aria), SHORTCUTS[k].label]);
  rows.push(['Escape, potem Tab', 'Wyjście z edytora kodu klawiszem Tab (sam Tab wstawia wcięcie)']);
  rows.push(['Strzałki, + i −, 0', 'Na planszy: przesuwanie (w 3D obracanie), powiększanie, dopasowanie']);
  return h('div', { class: 'table-wrap' },
    h('table', { class: 'ref-table' },
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Klawisze'), h('th', { scope: 'col' }, 'Działanie'))),
      h('tbody', null, rows.map(([k, v]) => h('tr', null, h('th', { scope: 'row' }, h('kbd', null, k)), h('td', null, v)))),
    ),
  );
}

export function exampleBlock(code: string, mode: Mode, onTry: (code: string, mode: Mode) => void) {
  const result = run(code, mode);
  return h('figure', { class: 'ref-example' },
    h('pre', { class: 'ref-code' }, h('code', null, code)),
    h('div', { class: 'ref-fig' },
      result.segments.length
        ? thumbnail(result.segments, mode, 'Wynik przykładu', 132, 104)
        : h('p', { class: 'ref-fig-empty' }, result.error ? `Błąd: ${result.error.message}` : 'Bez rysunku'),
      h('button', { class: 'btn btn-quiet btn-sm', type: 'button', onclick: () => onTry(code, mode) }, icon('pen', 16), 'Wypróbuj'),
    ),
  );
}
