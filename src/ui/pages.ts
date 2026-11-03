import { EXAMPLES, type Example } from '../examples';
import { CHALLENGES, targetOf } from '../challenges';
import { REFERENCE, type Block } from '../content/reference';
import { runProgram } from '../lang/interpreter';
import type { Mode } from '../lang/types';
import { fmtInt } from '../lang/lexer';
import { h, icon } from './dom';
import { highlightedCode } from './highlight';
import { renderThumb } from './thumbs';
import type { TaskProgress } from './studio';

const exampleRuns = new Map<string, ReturnType<typeof runProgram>>();
function exampleRun(e: Example) {
  let r = exampleRuns.get(e.id);
  if (!r) exampleRuns.set(e.id, (r = runProgram(e.source, e.mode)));
  return r;
}

/** Inline `code` spans in prose. */
function rich(text: string): (string | HTMLElement)[] {
  const out: (string | HTMLElement)[] = [];
  text.split(/(`[^`]+`)/).forEach((part) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) out.push(h('code', { class: 'inline-code' }, part.slice(1, -1)));
    else if (part) out.push(part);
  });
  return out;
}

function thumb(cls: string, w: number, ht: number): HTMLCanvasElement {
  return h('canvas', { class: cls, 'data-w': String(w), 'data-h': String(ht), 'aria-hidden': 'true' }) as HTMLCanvasElement;
}

export interface Page {
  root: HTMLElement;
  heading: HTMLElement;
  show(arg?: string): void;
  refresh(): void;
}

// ── Examples ────────────────────────────────────────────────────────────────

export function examplesPage(): Page {
  const heading = h('h1', { class: 'page-title', tabindex: '-1' }, 'Przykłady');
  const canvases: [HTMLCanvasElement, Example][] = [];
  const column = (mode: Mode, title: string, lede: string) => {
    const list = h('ol', { class: 'board', role: 'list' });
    for (const e of EXAMPLES.filter((x) => x.mode === mode)) {
      const r = exampleRun(e);
      const c = thumb('board-thumb', 132, 96);
      canvases.push([c, e]);
      const lines = e.source.split('\n').length;
      list.append(
        h(
          'li',
          { class: 'board-row' },
          c,
          h(
            'div',
            { class: 'board-main' },
            h('h3', { class: 'board-title' }, e.title),
            h('p', { class: 'board-desc' }, e.description),
            h('p', { class: 'board-meta' }, h('span', null, `${lines} wierszy`), h('span', null, `${fmtInt(r.segments.length)} odc.`), h('code', { class: 'board-id' }, e.id)),
            h('details', { class: 'board-code' }, h('summary', null, 'Pokaż kod'), h('pre', { class: 'code-block' }, highlightedCode(e.source))),
          ),
          h('a', { class: 'btn btn-secondary board-open', href: `#/przyklady/${e.id}`, 'aria-label': `Otwórz przykład ${e.title} w studiu` }, h('span', null, 'Otwórz'), icon('arrowRight', 'icon-small')),
        ),
      );
    }
    return h('section', { class: 'board-col', 'aria-labelledby': `col-${mode}` }, h('div', { class: 'board-head' }, h('h2', { id: `col-${mode}`, class: 'board-col-title' }, title), h('p', { class: 'board-lede' }, lede)), list);
  };
  const root = h(
    'div',
    { class: 'page page-examples' },
    h('header', { class: 'page-head' }, heading, h('p', { class: 'page-lede' }, 'Trzynaście programów do uruchomienia i przerabiania. Każdy otwiera się w swoim trybie. Twój dotychczasowy szkic zostaje odłożony, więc niczego nie stracisz.')),
    h('div', { class: 'board-grid' }, column('2d', 'Płaszczyzna 2D', 'Kartka, krok i skręt.'), column('3d', 'Przestrzeń 3D', 'Wznoszenie i przechylanie.')),
  );
  const draw = () => canvases.forEach(([c, e]) => renderThumb(c, exampleRun(e).segments, e.mode, { pad: 10, widthScale: 0.65 }));
  return {
    root,
    heading,
    show: () => requestAnimationFrame(draw),
    refresh: draw,
  };
}

// ── Challenges ──────────────────────────────────────────────────────────────

export function tasksPage(progress: () => Record<string, TaskProgress>): Page {
  const heading = h('h1', { class: 'page-title', tabindex: '-1' }, 'Zadania');
  const summary = h('p', { class: 'progress-text' });
  const track = h('div', { class: 'progress-track', 'aria-hidden': 'true' });
  const list = h('ol', { class: 'board board-tasks', role: 'list' });
  const canvases: [HTMLCanvasElement, (typeof CHALLENGES)[number]][] = [];
  const root = h(
    'div',
    { class: 'page page-tasks' },
    h(
      'header',
      { class: 'page-head' },
      heading,
      h('p', { class: 'page-lede' }, 'Każde zadanie pokazuje wzór do narysowania. Napisz program, a studio porówna Twój rysunek ze wzorem. Liczy się kształt: rysunek może leżeć w innym miejscu albo być lustrzanym odbiciem. Postęp zapisuje się w tej przeglądarce.'),
      h('div', { class: 'progress' }, summary, track),
    ),
    list,
  );
  const build = () => {
    const p = progress();
    const done = CHALLENGES.filter((c) => p[c.id]?.solved).length;
    summary.replaceChildren(h('strong', null, `${done} z ${CHALLENGES.length}`), ' zadań zaliczonych');
    track.replaceChildren(...CHALLENGES.map((c) => h('span', { class: `progress-cell${p[c.id]?.solved ? ' is-done' : ''}` })));
    canvases.length = 0;
    list.replaceChildren(
      ...CHALLENGES.map((c, i) => {
        const solved = !!p[c.id]?.solved;
        const cv = thumb('board-thumb', 132, 96);
        canvases.push([cv, c]);
        return h(
          'li',
          { class: `board-row${solved ? ' is-solved' : ''}` },
          h('span', { class: 'board-num', 'aria-hidden': 'true' }, String(i + 1)),
          cv,
          h(
            'div',
            { class: 'board-main' },
            h('h3', { class: 'board-title' }, h('span', { class: 'visually-hidden' }, `Zadanie ${i + 1}: `), c.title),
            h('p', { class: 'board-desc' }, c.task),
            h(
              'p',
              { class: 'board-meta' },
              h('span', { class: 'chip chip-small' }, c.mode === '2d' ? 'Płaszczyzna 2D' : 'Przestrzeń 3D'),
              solved ? h('span', { class: 'stamp stamp-small' }, icon('check'), 'Zaliczone') : h('span', { class: 'board-status' }, 'Do zrobienia'),
            ),
          ),
          h('a', { class: `btn ${solved ? 'btn-secondary' : 'btn-primary'} board-open`, href: `#/zadania/${c.id}`, 'aria-label': `${solved ? 'Otwórz ponownie' : 'Rozwiąż'} zadanie ${c.title}` }, h('span', null, solved ? 'Otwórz' : 'Rozwiąż'), icon('arrowRight', 'icon-small')),
        );
      }),
    );
    requestAnimationFrame(() => canvases.forEach(([cv, c]) => renderThumb(cv, targetOf(c), c.mode, { pad: 10, widthScale: 0.7 })));
  };
  return {
    root,
    heading,
    show: build,
    refresh: build,
  };
}

// ── Reference ───────────────────────────────────────────────────────────────

export function referencePage(tryIt: (source: string, mode: Mode, what: string) => void): Page {
  const heading = h('h1', { class: 'page-title', tabindex: '-1' }, 'Polecenia');
  const toc = h('nav', { class: 'ref-toc', 'aria-label': 'Spis treści' }, h('p', { class: 'ref-toc-title' }, 'Spis treści'), h('ol', null, ...REFERENCE.map((s) => h('li', null, h('a', { href: `#/polecenia/${s.id}`, 'data-section': s.id }, s.title)))));
  const tryBtn = (source: string, mode: Mode, what: string) =>
    h('button', { type: 'button', class: 'btn btn-quiet btn-small try-btn', onclick: () => tryIt(source, mode, what), 'aria-label': `Wypróbuj w studiu: ${what}` }, icon('play', 'icon-small'), h('span', null, 'Wypróbuj'));

  const renderBlock = (b: Block, section: string): HTMLElement => {
    switch (b.t) {
      case 'p':
        return h('p', null, ...rich(b.text));
      case 'list':
        return h('ul', { class: 'ref-list' }, ...b.items.map((i) => h('li', null, ...rich(i))));
      case 'code': {
        const mode = b.mode ?? '2d';
        return h(
          'figure',
          { class: 'ref-code' },
          h('pre', { class: 'code-block' }, highlightedCode(b.source)),
          h('figcaption', null, b.caption ? h('span', null, b.caption) : null, tryBtn(b.source, mode, b.caption ?? `przykład z rozdziału ${section}`)),
        );
      }
      case 'table':
        return h(
          'div',
          { class: 'table-wrap' },
          h(
            'table',
            { class: 'ref-table' },
            b.caption ? h('caption', null, b.caption) : null,
            h('thead', null, h('tr', null, ...b.head.map((x) => h('th', { scope: 'col' }, x)))),
            h('tbody', null, ...b.rows.map((r) => h('tr', null, ...r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, ...rich(c)) : h('td', null, ...rich(c))))))),
          ),
        );
      case 'cmd': {
        const mode = b.mode ?? '2d';
        return h(
          'article',
          { class: 'cmd', id: `cmd-${b.name.split(' ')[0]}` },
          h('div', { class: 'cmd-head' }, h('h3', { class: 'cmd-name' }, h('code', null, b.name)), b.only3d ? h('span', { class: 'chip chip-small' }, 'tylko 3D') : null),
          h(
            'dl',
            { class: 'cmd-facts' },
            h('div', null, h('dt', null, 'Inne zapisy'), h('dd', null, ...b.aliases.split(', ').flatMap((a, i) => (i ? [', ', h('code', null, a)] : [h('code', null, a)])))),
            h('div', null, h('dt', null, 'Argument'), h('dd', null, b.arg)),
          ),
          h('p', { class: 'cmd-text' }, ...rich(b.text)),
          h('figure', { class: 'ref-code' }, h('pre', { class: 'code-block' }, highlightedCode(b.example)), h('figcaption', null, h('span', null, `Przykład · ${mode.toUpperCase()}`), tryBtn(b.example, mode, `przykład polecenia „${b.name}”`))),
        );
      }
    }
  };

  const summaryTable = h(
    'div',
    { class: 'table-wrap' },
    h(
      'table',
      { class: 'ref-table ref-summary' },
      h('caption', null, 'Wszystkie polecenia w skrócie'),
      h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Polecenie'), h('th', { scope: 'col' }, 'Po angielsku'), h('th', { scope: 'col' }, 'Argument'), h('th', { scope: 'col' }, 'Działanie'))),
      h(
        'tbody',
        null,
        ...[
          ['np, naprzod, naprzód', 'fd, forward', 'wyrażenie', 'idź naprzód'],
          ['ws, wstecz', 'bk, back', 'wyrażenie', 'cofnij się'],
          ['pw, prawo', 'rt, right', 'wyrażenie', 'obróć w prawo o tyle stopni'],
          ['lw, lewo', 'lt, left', 'wyrażenie', 'obróć w lewo'],
          ['pod, podnies, podnieś', 'pu, penup', '—', 'podnieś pisak'],
          ['opu, opusc, opuść', 'pd, pendown', '—', 'opuść pisak'],
          ['kolor', 'color', 'kolor "#rrggbb"', 'ustaw kolor pisaka'],
          ['grubosc, grubość', 'width', 'liczba całkowita 1–12', 'ustaw grubość linii'],
          ['powtorz, powtórz', 'repeat', 'liczba 0–10 000, [ treść ]', 'powtórz treść'],
          ['nrpowt', 'repcount', '(wartość)', 'numer bieżącego powtórzenia'],
          ['niech', 'let', 'nazwa, wyrażenie', 'nadaj zmiennej wartość'],
          ['jeśli, jesli', 'if', 'warunek, [ treść ]', 'wykonaj, gdy warunek jest spełniony'],
          ['jeżeli, jezeli', 'ifelse', 'warunek, [ treść ] [ treść ]', 'wykonaj jedną z dwóch treści'],
          ['oto … już (juz)', 'to … end', 'nazwa, ma: parametry', 'zdefiniuj procedurę'],
          ['stop', 'stop', '—', 'zakończ procedurę albo program'],
          ['dom', 'home', '—', 'wróć na start'],
          ['czyść, czysc', 'cs, clearscreen', '—', 'wymaż rysunek'],
          ['gora, góra', 'pitchup', 'wyrażenie', 'podnieś nos (tylko 3D)'],
          ['dol, dół', 'pitchdown', 'wyrażenie', 'opuść nos (tylko 3D)'],
          ['pp, przechylprawo', 'rr, rollright', 'wyrażenie', 'przechyl w prawo (tylko 3D)'],
          ['pl, przechyllewo', 'rl, rollleft', 'wyrażenie', 'przechyl w lewo (tylko 3D)'],
        ].map((r) => h('tr', null, h('th', { scope: 'row' }, h('code', null, r[0]!)), h('td', null, h('code', null, r[1]!)), h('td', null, r[2]!), h('td', null, r[3]!))),
      ),
    ),
  );

  const sections = REFERENCE.map((s) =>
    h('section', { class: 'ref-section', id: `ref-${s.id}`, 'aria-labelledby': `ref-h-${s.id}` }, h('h2', { id: `ref-h-${s.id}`, tabindex: '-1' }, s.title), ...s.blocks.map((b) => renderBlock(b, s.title))),
  );
  sections[0]!.append(summaryTable);
  const content = h('div', { class: 'ref-content' }, h('header', { class: 'page-head' }, heading, h('p', { class: 'page-lede' }, 'Opis całego języka: polecenia, wyrażenia, zmienne, warunki, procedury i limity. Każdy przykład można uruchomić w studiu przyciskiem Wypróbuj.')), ...sections);
  const root = h('div', { class: 'page page-reference' }, toc, content);

  const links = [...toc.querySelectorAll<HTMLAnchorElement>('a[data-section]')];
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const id = (e.target as HTMLElement).id.slice(4);
        links.forEach((a) => (a.dataset.section === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      }
    },
    { rootMargin: '-20% 0px -70% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  return {
    root,
    heading,
    show(arg?: string) {
      if (!arg) return;
      const target = document.getElementById(`ref-${arg}`);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
          target.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true });
        });
      }
    },
    refresh() {},
  };
}
