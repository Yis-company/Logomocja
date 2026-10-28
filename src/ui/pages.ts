import { run, type Mode } from '../lang';
import { EXAMPLES, type Example } from '../content/examples';
import { CHALLENGES, expectedSegments, type Challenge } from '../content/challenges';
import { REFERENCE, type CommandDoc } from '../content/reference';
import { h } from './dom';
import { highlightHtml } from './highlight';
import { icon } from './icons';
import { paintFitted, themeColors } from './paint';
import { loadJSON, saveJSON } from './storage';
import { ask } from './dialogs';
import { SHORTCUTS } from './studio';

/** Miniatury rysowane po wstawieniu do dokumentu (i po zmianie motywu). */
const thumbs: { canvas: HTMLCanvasElement; paint: () => void }[] = [];

function thumbnail(label: string, segs: () => ReturnType<typeof run>['segments'], mode: Mode, w = 240, hgt = 170): HTMLCanvasElement {
  const canvas = h('canvas', { class: 'thumb', role: 'img', 'aria-label': label });
  const paint = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = hgt * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintFitted(ctx, segs(), mode, w, hgt, { background: themeColors().stage, padding: 14, widthScale: 0.8 });
  };
  thumbs.push({ canvas, paint });
  paint();
  return canvas;
}

export function repaintThumbnails(): void {
  for (const t of thumbs) if (t.canvas.isConnected) t.paint();
}

function codeBlock(code: string, mode: Mode, onTry: (code: string, mode: Mode) => void): HTMLElement {
  return h(
    'div',
    { class: 'code-sample' },
    h('pre', { html: highlightHtml(code).replace(/\n$/, '') }),
    h('button', {
      type: 'button',
      class: 'btn small',
      html: `${icon('play')}<span>Wypróbuj${mode === '3d' ? ' w 3D' : ''}</span>`,
      onclick: () => onTry(code, mode),
    }),
  );
}

// ------------------------------------------------------------- przykłady

export function examplesPage(onOpen: (ex: Example) => void): HTMLElement {
  const card = (ex: Example) =>
    h(
      'li',
      { class: 'card example-card' },
      thumbnail(`Miniatura: ${ex.title}`, () => run(ex.source, ex.mode).segments, ex.mode),
      h(
        'div',
        { class: 'card-body' },
        h('h3', {}, ex.title, ' ', h('span', { class: `badge mode-${ex.mode}` }, ex.mode.toUpperCase())),
        h('p', {}, ex.blurb),
        h('button', {
          type: 'button',
          class: 'btn primary',
          html: `${icon('play')}<span>Otwórz „${ex.title}”</span>`,
          onclick: () => onOpen(ex),
        }),
      ),
    );
  return h(
    'section',
    { class: 'page', id: 'przyklady', 'aria-labelledby': 'przyklady-h' },
    h('header', { class: 'page-head' }, h('h1', { id: 'przyklady-h' }, 'Przykłady'), h('p', {}, 'Trzynaście programów na dobry początek. Otwórz dowolny w studiu, uruchom go i zmieniaj liczby, żeby zobaczyć, co się stanie.')),
    h('h2', {}, 'Na płaszczyźnie (2D)'),
    h('ul', { class: 'cards' }, ...EXAMPLES.filter((e) => e.mode === '2d').map(card)),
    h('h2', {}, 'W przestrzeni (3D)'),
    h('ul', { class: 'cards' }, ...EXAMPLES.filter((e) => e.mode === '3d').map(card)),
  );
}

// ------------------------------------------------------------- wyzwania

export function challengesPage(): { root: HTMLElement; refresh: () => void } {
  const list = h('ul', { class: 'cards' });
  const summary = h('p', { class: 'progress-text' });
  const bar = h('div', { class: 'progress', role: 'progressbar', 'aria-label': 'Postęp wyzwań', 'aria-valuemin': 0, 'aria-valuemax': CHALLENGES.length });
  const fill = h('div', { class: 'progress-fill' });
  bar.append(fill);

  const resetBtn = h('button', {
    type: 'button',
    class: 'btn ghost small',
    onclick: async () => {
      const yes = await ask({
        title: 'Wyzerować postęp?',
        body: [h('p', {}, 'Wszystkie wyzwania zostaną oznaczone jako nierozwiązane. Twoje zapisane rozwiązania zostaną.')],
        buttons: [
          { label: 'Anuluj', value: false, kind: 'ghost' },
          { label: 'Wyzeruj', value: true, kind: 'danger' },
        ],
        cancelValue: false,
      });
      if (yes) {
        saveJSON('challenges', {});
        refresh();
      }
    },
  }, 'Wyzeruj postęp');

  const card = (c: Challenge, solved: boolean) =>
    h(
      'li',
      { class: `card challenge-card${solved ? ' solved' : ''}` },
      thumbnail(`Wzór: ${c.title}`, () => expectedSegments(c), c.mode),
      h(
        'div',
        { class: 'card-body' },
        h(
          'h3',
          {},
          c.title,
          ' ',
          h('span', { class: `badge mode-${c.mode}` }, c.mode.toUpperCase()),
          ' ',
          h('span', { class: 'level', 'aria-label': `Poziom ${c.level} z 3`, title: `Poziom ${c.level} z 3` }, '●'.repeat(c.level) + '○'.repeat(3 - c.level)),
        ),
        h('p', {}, c.task),
        h(
          'div',
          { class: 'card-actions' },
          h('a', { class: 'btn primary', href: `#/wyzwanie/${c.id}`, html: `${icon('target')}<span>${solved ? 'Rozwiąż ponownie' : 'Rozwiąż'}<span class="sr-only">: ${c.title}</span></span>` }),
          solved ? h('span', { class: 'badge ok', html: `${icon('check')} rozwiązane` }) : null,
        ),
      ),
    );

  function refresh(): void {
    const progress = loadJSON<Record<string, unknown>>('challenges', {});
    const done = CHALLENGES.filter((c) => progress[c.id]).length;
    summary.textContent = `Rozwiązane: ${done} z ${CHALLENGES.length}${done === CHALLENGES.length ? ' — wszystkie! Gratulacje!' : ''}`;
    bar.setAttribute('aria-valuenow', String(done));
    fill.style.width = `${(done / CHALLENGES.length) * 100}%`;
    list.replaceChildren(...CHALLENGES.map((c) => card(c, !!progress[c.id])));
  }
  refresh();

  const root = h(
    'section',
    { class: 'page', id: 'wyzwania', 'aria-labelledby': 'wyzwania-h' },
    h(
      'header',
      { class: 'page-head' },
      h('h1', { id: 'wyzwania-h' }, 'Wyzwania'),
      h('p', {}, 'Każde wyzwanie pokazuje rysunek do odtworzenia. Napisz program, naciśnij „Sprawdź”, a Logomocja porówna Twój rysunek ze wzorem (z tolerancją 1,5 jednostki; kolejność i kierunek linii nie mają znaczenia).'),
      h('div', { class: 'progress-row' }, summary, bar, resetBtn),
    ),
    list,
  );
  return { root, refresh };
}

// ------------------------------------------------------------- pomoc

export function referencePage(onTry: (code: string, mode: Mode) => void): HTMLElement {
  const toc = h('nav', { class: 'toc', 'aria-label': 'Spis treści' }, h('h2', {}, 'Spis treści'));
  const tocList = h('ol', {});
  toc.append(tocList);
  const content = h('div', { class: 'doc' });

  const cmd = (c: CommandDoc, mode: Mode) =>
    h(
      'article',
      { class: 'cmd', id: `cmd-${c.names[0]}` },
      h(
        'h3',
        {},
        h('code', {}, c.names[0]),
        ...c.names.slice(1).map((n) => h('span', { class: 'alias' }, n)),
        ...c.english.map((n) => h('span', { class: 'alias en', title: 'nazwa angielska' }, n)),
      ),
      h('p', { class: 'arg' }, h('span', { class: 'muted' }, 'Argument: '), c.arg),
      h('p', {}, c.text),
      codeBlock(c.example, c.mode ?? mode, onTry),
    );

  for (const sec of REFERENCE) {
    tocList.append(h('li', {}, h('a', { href: `#/pomoc/${sec.id}`, 'data-target': sec.id }, sec.title)));
    const mode: Mode = sec.id === 'przestrzen' ? '3d' : '2d';
    const section = h('section', { id: `doc-${sec.id}`, 'aria-labelledby': `doc-${sec.id}-h` }, h('h2', { id: `doc-${sec.id}-h`, tabindex: -1 }, sec.title));
    if (sec.intro) section.append(h('p', { class: 'intro' }, sec.intro));
    for (const b of sec.blocks ?? []) {
      if ('html' in b) section.append(h('div', { html: b.html }));
      else section.append(codeBlock(b.code, b.mode ?? mode, onTry));
    }
    for (const c of sec.commands ?? []) section.append(cmd(c, mode));
    content.append(section);
  }

  // skróty klawiszowe
  tocList.append(h('li', {}, h('a', { href: '#/pomoc/skroty', 'data-target': 'skroty' }, 'Skróty klawiszowe')));
  content.append(
    h('section', { id: 'doc-skroty', 'aria-labelledby': 'doc-skroty-h' }, h('h2', { id: 'doc-skroty-h', tabindex: -1 }, 'Skróty klawiszowe'), shortcutsTable()),
  );

  return h(
    'section',
    { class: 'page reference', id: 'pomoc', 'aria-labelledby': 'pomoc-h' },
    h('header', { class: 'page-head' }, h('h1', { id: 'pomoc-h' }, 'Pomoc: język Logomocji'), h('p', {}, 'Wszystkie polecenia, wyrażenia, zmienne, warunki, procedury i limity — z przykładem do każdego polecenia. Przycisk „Wypróbuj” otwiera przykład w studiu.')),
    h('div', { class: 'doc-layout' }, toc, content),
  );
}

export function shortcutsTable(): HTMLElement {
  return h(
    'table',
    { class: 'shortcuts' },
    h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Klawisze'), h('th', { scope: 'col' }, 'Działanie'))),
    h('tbody', {}, ...SHORTCUTS().map(([k, d]) => h('tr', {}, h('td', {}, h('kbd', {}, k)), h('td', {}, d)))),
  );
}
