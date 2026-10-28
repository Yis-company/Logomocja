import { CHALLENGES, type Challenge, targetSegments } from '../data/challenges';
import { EXAMPLES, type Example } from '../data/examples';
import { COMMAND_DOCS, type Block, SECTIONS } from '../data/reference';
import { SHORTCUTS } from '../data/shortcuts';
import { type Mode, runProgram } from '../lang';
import { h, icon } from './dom';
import { highlightHtml } from './highlight';
import { getProgress } from './state';
import type { CanvasView } from './view';
import { View2D } from './view2d';
import { View3D } from './view3d';

export interface PageDeps {
  /** Wczytuje przykład (z pytaniem o zastąpienie szkicu); zwraca true, gdy wczytano. */
  loadExample(ex: Example): Promise<boolean>;
  navigate(hash: string): void;
}

const liveViews: CanvasView[] = [];

/** Zwalnia miniatury poprzedniej strony. */
export function disposePages(): void {
  for (const v of liveViews.splice(0)) v.destroy();
}

/** Minimalna miniatura rysunku. */
function thumbnail(segments: ReturnType<typeof targetSegments>, mode: Mode, label: string): HTMLElement {
  const view: CanvasView = mode === '2d' ? new View2D() : new View3D();
  view.minimal = true;
  liveViews.push(view);
  view.el.removeAttribute('tabindex');
  view.el.setAttribute('role', 'img');
  view.el.setAttribute('aria-label', label);
  view.el.classList.add('thumb');
  view.setScene({ segments, turtle: null, ghost: null });
  view.fit(segments);
  return view.el;
}

function pageHeader(title: string, lead: string): HTMLElement {
  return h('header', { class: 'page-head' }, h('h1', null, title), h('p', { class: 'lead' }, lead));
}

// ───────────────────────── przykłady ─────────────────────────

export function examplesPage(deps: PageDeps): HTMLElement {
  const card = (ex: Example) => {
    const r = runProgram(ex.source, ex.mode);
    return h(
      'article',
      { class: 'card', 'data-testid': `example-${ex.id}` },
      thumbnail(r.segments, ex.mode, `Podgląd rysunku: ${ex.name}`),
      h(
        'div',
        { class: 'card-body' },
        h('h2', null, ex.name, ' ', h('span', { class: 'badge' }, ex.mode.toUpperCase())),
        h('p', null, ex.description),
        h(
          'button',
          {
            type: 'button',
            class: 'btn btn-primary btn-small',
            'data-testid': `load-${ex.id}`,
            'aria-label': `Wczytaj przykład ${ex.name} do pracowni`,
            onClick: async () => {
              if (await deps.loadExample(ex)) deps.navigate('#/pracownia');
            },
          },
          'Wczytaj do pracowni',
        ),
      ),
    );
  };
  return h(
    'div',
    { class: 'page' },
    pageHeader(
      'Przykłady',
      'Trzynaście gotowych programów. Wczytaj dowolny do pracowni, uruchom go krok po kroku i zmieniaj liczby, żeby zobaczyć, co się stanie.',
    ),
    h('h2', { class: 'group-title' }, 'Płaszczyzna (2D)'),
    h('div', { class: 'cards' }, EXAMPLES.filter((e) => e.mode === '2d').map(card)),
    h('h2', { class: 'group-title' }, 'Przestrzeń (3D)'),
    h('div', { class: 'cards' }, EXAMPLES.filter((e) => e.mode === '3d').map(card)),
  );
}

// ───────────────────────── wyzwania ─────────────────────────

const LEVEL = { 1: 'łatwe', 2: 'średnie', 3: 'trudne' } as const;

export function challengesPage(deps: PageDeps): HTMLElement {
  const progress = getProgress();
  const done = CHALLENGES.filter((c) => progress[c.id]?.done).length;
  const card = (c: Challenge) => {
    const ok = !!progress[c.id]?.done;
    return h(
      'article',
      { class: `card ${ok ? 'card-done' : ''}`, 'data-testid': `challenge-${c.id}` },
      thumbnail(targetSegments(c), c.mode, `Wzór do narysowania: ${c.title}`),
      h(
        'div',
        { class: 'card-body' },
        h(
          'h2',
          null,
          c.title,
          ' ',
          h('span', { class: 'badge' }, c.mode.toUpperCase()),
          ' ',
          h('span', { class: `badge level-${c.level}` }, LEVEL[c.level]),
          ok ? h('span', { class: 'badge badge-ok' }, '✓ zaliczone') : null,
        ),
        h('p', null, c.task),
        h(
          'button',
          {
            type: 'button',
            class: `btn btn-small ${ok ? '' : 'btn-primary'}`,
            'data-testid': `open-${c.id}`,
            'aria-label': `${ok ? 'Rozwiąż ponownie' : 'Rozwiąż'}: ${c.title}`,
            onClick: () => deps.navigate(`#/wyzwania/${c.id}`),
          },
          ok ? 'Rozwiąż ponownie' : 'Rozwiąż',
        ),
      ),
    );
  };
  return h(
    'div',
    { class: 'page' },
    pageHeader(
      'Wyzwania',
      'Zadania do samodzielnego rozwiązania. Każde pokazuje wzór, a program sprawdza się automatycznie, porównując twój rysunek ze wzorem.',
    ),
    h(
      'div',
      { class: 'progress', role: 'status', 'data-testid': 'progress' },
      h('div', { class: 'progress-bar', 'aria-hidden': 'true' }, h('span', { style: { width: `${(done / CHALLENGES.length) * 100}%` } })),
      h('span', null, `Zaliczone: ${done} z ${CHALLENGES.length}`),
    ),
    h('div', { class: 'cards' }, CHALLENGES.map(card)),
  );
}

// ───────────────────────── opis języka ─────────────────────────

function inline(text: string): (Node | string)[] {
  // **pogrubienie** i `kod`
  const out: (Node | string)[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index! > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) out.push(h('strong', null, tok.slice(2, -2)));
    else out.push(h('code', { class: 'inline-code' }, tok.slice(1, -1)));
    last = m.index! + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function codeSample(code: string, mode: Mode, deps: PageDeps, label: string): HTMLElement {
  const pre = h('pre', { class: 'code-sample' });
  const codeEl = h('code');
  codeEl.innerHTML = highlightHtml(code).replace(/\n$/, '');
  pre.append(codeEl);
  const ex: Example = { id: `opis-${label}`, name: label, mode, description: '', source: code };
  return h(
    'div',
    { class: 'sample' },
    pre,
    h(
      'div',
      { class: 'sample-bar' },
      h('span', { class: 'badge' }, mode.toUpperCase()),
      h(
        'button',
        {
          type: 'button',
          class: 'btn btn-small',
          'aria-label': `Wypróbuj w pracowni: ${label}`,
          onClick: async () => {
            if (await deps.loadExample(ex)) deps.navigate('#/pracownia');
          },
        },
        icon('play', 14),
        'Wypróbuj',
      ),
    ),
  );
}

function axesFigure(): HTMLElement {
  const wrap = h('figure', { class: 'figure' });
  wrap.innerHTML = `<svg viewBox="0 0 320 200" width="320" height="200" role="img" aria-label="Układ współrzędnych: oś X w prawo, oś Y w górę, oś Z ku patrzącemu; żółw w początku układu skierowany w stronę osi Y">
    <rect x="1" y="1" width="318" height="198" rx="10" class="fig-bg"/>
    <g stroke-width="2" stroke-linecap="round">
      <path d="M40 150H280" stroke="var(--axis-x)"/><path d="M280 150l-9-5m9 5l-9 5" stroke="var(--axis-x)" fill="none"/>
      <path d="M90 190V30" stroke="var(--axis-y)"/><path d="M90 30l-5 9m5-9l5 9" stroke="var(--axis-y)" fill="none"/>
    </g>
    <circle cx="90" cy="150" r="9" fill="none" stroke="var(--axis-z)" stroke-width="2"/><circle cx="90" cy="150" r="2.6" fill="var(--axis-z)"/>
    <g class="fig-text" font-size="14" font-weight="700">
      <text x="274" y="136" fill="var(--axis-x)">X</text><text x="100" y="40" fill="var(--axis-y)">Y</text><text x="104" y="172" fill="var(--axis-z)">Z (ku tobie)</text>
    </g>
    <path d="M90 126l9 24-9-5-9 5z" fill="var(--accent)" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
    <text x="130" y="108" font-size="13" class="fig-text">żółw patrzy w stronę +Y</text>
  </svg>`;
  wrap.append(h('figcaption', null, 'Układ współrzędnych: początek (0, 0, 0), oś Z skierowana z kartki ku tobie.'));
  return wrap;
}

function renderBlock(b: Block, deps: PageDeps, sectionTitle: string): Node {
  switch (b.t) {
    case 'p':
      return h('p', null, inline(b.text));
    case 'note':
      return h('p', { class: 'note' }, inline(b.text));
    case 'list':
      return h('ul', null, b.items.map((i) => h('li', null, inline(i))));
    case 'code':
      return codeSample(b.code, b.mode, deps, sectionTitle);
    case 'axes':
      return axesFigure();
    case 'table':
      return h(
        'div',
        { class: 'table-wrap' },
        h(
          'table',
          null,
          h('thead', null, h('tr', null, b.head.map((c) => h('th', { scope: 'col' }, c)))),
          h('tbody', null, b.rows.map((r) => h('tr', null, r.map((c) => h('td', null, inline(c)))))),
        ),
      );
  }
}

export function referencePage(deps: PageDeps, anchor?: string): HTMLElement {
  const commandsSection = h(
    'section',
    { id: 'polecenia', class: 'ref-section', 'aria-labelledby': 'h-polecenia' },
    h('h2', { id: 'h-polecenia' }, 'Polecenia'),
    h(
      'p',
      null,
      'Każde polecenie ma aliasy: polski (z ogonkami i bez) oraz angielski. Argument zapisany jako „wyrażenie” może być liczbą, nazwą albo działaniem.',
    ),
    ...COMMAND_DOCS.map((d) =>
      h(
        'article',
        { id: `cmd-${d.id}`, class: 'command', 'data-testid': `cmd-${d.id}` },
        h(
          'header',
          null,
          h('h3', null, h('code', null, d.syntax)),
          d.only3d ? h('span', { class: 'badge' }, 'tylko 3D') : null,
        ),
        h(
          'p',
          { class: 'aliases' },
          h('span', null, 'Polskie: '),
          d.polish.map((a, i) => [i ? ', ' : '', h('code', { class: 'inline-code' }, a)]),
          h('span', null, ' · angielskie: '),
          d.english.map((a, i) => [i ? ', ' : '', h('code', { class: 'inline-code' }, a)]),
        ),
        h('p', null, inline(d.summary)),
        ...(d.details ?? []).map((t) => h('p', null, inline(t))),
        codeSample(d.example.code, d.example.mode, deps, d.polish[0]),
      ),
    ),
  );

  const shortcuts = h(
    'section',
    { id: 'skroty', class: 'ref-section', 'aria-labelledby': 'h-skroty' },
    h('h2', { id: 'h-skroty' }, 'Skróty klawiszowe'),
    shortcutTable(),
  );

  const sections: { id: string; title: string; node: Node }[] = [];
  const order = ['wstep', 'zapis'];
  const byId = new Map(SECTIONS.map((s) => [s.id, s]));
  const build = (id: string) => {
    const s = byId.get(id)!;
    return {
      id: s.id,
      title: s.title,
      node: h(
        'section',
        { id: s.id, class: 'ref-section', 'aria-labelledby': `h-${s.id}` },
        h('h2', { id: `h-${s.id}` }, s.title),
        ...s.blocks.map((b) => renderBlock(b, deps, s.title)),
      ),
    };
  };
  for (const id of order) sections.push(build(id));
  sections.push({ id: 'polecenia', title: 'Polecenia', node: commandsSection });
  for (const s of SECTIONS) if (!order.includes(s.id)) sections.push(build(s.id));
  sections.push({ id: 'skroty', title: 'Skróty klawiszowe', node: shortcuts });

  const toc = h(
    'nav',
    { class: 'toc', 'aria-label': 'Spis treści opisu języka' },
    h('h2', { class: 'toc-title' }, 'Spis treści'),
    h(
      'ul',
      null,
      sections.map((s) => h('li', null, h('a', { href: `#/opis/${s.id}` }, s.title))),
      h(
        'li',
        null,
        h('span', { class: 'toc-sub' }, 'Polecenia:'),
        h(
          'span',
          { class: 'toc-cmds' },
          COMMAND_DOCS.map((d) => h('a', { href: `#/opis/cmd-${d.id}` }, d.polish[0])),
        ),
      ),
    ),
  );

  const page = h(
    'div',
    { class: 'page page-ref' },
    pageHeader('Opis języka', 'Pełny opis dialektu Logo używanego w Logomocji: polecenia, wyrażenia, zmienne, warunki, procedury, tryb przestrzenny oraz błędy i limity.'),
    h('div', { class: 'ref-layout' }, toc, h('div', { class: 'ref-content' }, sections.map((s) => s.node))),
  );
  if (anchor) {
    queueMicrotask(() => requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView({ block: 'start' })));
  }
  return page;
}

export function shortcutTable(): HTMLElement {
  const rows = Object.values(SHORTCUTS).map((s) =>
    h(
      'tr',
      null,
      h(
        'td',
        { class: 'keys' },
        s.keys.map((combo, i) => [
          i ? ' lub ' : '',
          combo.map((k, j) => [j ? ' + ' : '', h('kbd', null, k)]),
        ]),
      ),
      h('td', null, s.label),
    ),
  );
  return h(
    'div',
    { class: 'table-wrap' },
    h('table', { class: 'shortcuts' }, h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Skrót'), h('th', { scope: 'col' }, 'Działanie'))), h('tbody', null, rows)),
  );
}
