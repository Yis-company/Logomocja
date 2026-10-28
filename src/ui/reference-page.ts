import { REF_COMMANDS, REF_SECTIONS } from '../content/reference';
import { encodeProgram } from './share';
import { el } from './dom';

/** Builds the Polish command reference. Every example links to the workspace, where it runs. */
/** An in-page link. Hash routing owns the URL, so the link scrolls instead of changing the hash. */
function sectionLink(id: string, text: string): HTMLAnchorElement {
  return el('a', {
    href: `#${id}`,
    text,
    on: {
      click: (e: MouseEvent) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ block: 'start' });
      },
    },
  });
}

export function createReferencePage(): HTMLElement {
  const root = el('div', { class: 'prose' });
  root.append(el('h1', { text: 'Dokumentacja języka' }));
  root.append(
    el('p', {
      class: 'lead',
      text: 'Wszystkie polecenia Logomocji z przykładami. Każdy przykład można otworzyć w edytorze jednym kliknięciem.',
    }),
  );

  const toc = el(
    'nav',
    { class: 'toc', 'aria-label': 'Spis treści' },
    el('strong', { text: 'Spis treści' }),
    el(
      'ol',
      {},
      el('li', {}, sectionLink('ref-polecenia', 'Polecenia')),
      ...REF_SECTIONS.map((s) => el('li', {}, sectionLink(`ref-${s.id}`, s.title))),
    ),
  );
  root.append(toc);

  root.append(el('h2', { id: 'ref-polecenia', text: 'Polecenia' }));
  const table = el(
    'table',
    { class: 'ref-table' },
    el(
      'thead',
      {},
      el('tr', {}, el('th', { scope: 'col', text: 'Nazwy' }), el('th', { scope: 'col', text: 'Argument' }), el('th', { scope: 'col', text: 'Działanie' })),
    ),
  );
  const body = el('tbody');
  for (const c of REF_COMMANDS) {
    body.append(
      el(
        'tr',
        {},
        el('td', {}, el('code', { text: c.names }), c.mode === '3d' ? el('span', { class: 'badge', text: '3D' }) : false),
        el('td', { text: c.argument }),
        el('td', {}, el('p', { text: c.summary }), exampleBlock(c.example, c.mode, c.names.split(',')[0]!.trim())),
      ),
    );
  }
  table.append(body);
  root.append(el('div', { class: 'table-wrap' }, table));

  for (const section of REF_SECTIONS) {
    root.append(el('h2', { id: `ref-${section.id}`, text: section.title }));
    for (const p of section.paragraphs) root.append(el('p', { text: p }));
    if (section.items && section.items.length > 0) {
      root.append(el('pre', { class: 'code-sample' }, el('code', { text: section.items.join('\n') })));
    }
  }

  root.append(el('h2', { id: 'ref-skroty', text: 'Skróty klawiszowe' }));
  root.append(
    el(
      'ul',
      {},
      el('li', {}, el('kbd', { text: 'Ctrl+Enter' }), ' uruchom program'),
      el('li', {}, el('kbd', { text: 'Alt+K' }), ' krok'),
      el('li', {}, el('kbd', { text: 'Alt+P' }), ' wstrzymaj lub wznów'),
      el('li', {}, el('kbd', { text: 'Alt+R' }), ' reset'),
    ),
  );
  return root;
}

function exampleBlock(source: string, mode: '2d' | '3d', label: string): HTMLElement {
  const href = `#/?m=${mode}&p=${encodeProgram(source)}`;
  return el(
    'div',
    { class: 'ref-example' },
    el('pre', { class: 'code-sample' }, el('code', { text: source })),
    el('a', { class: 'btn btn-link', href, 'aria-label': `Otwórz przykład polecenia ${label} w edytorze`, text: 'Otwórz w edytorze →' }),
  );
}
