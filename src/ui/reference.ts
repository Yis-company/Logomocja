import { REFERENCE, type ReferenceItem } from '../data/reference';
import { clear, h } from './dom';
import { encodeText } from './permalink';

/** The Pomoc page: every command, rule and limit, each with a runnable example. */
export function buildReference(): HTMLElement {
  const root = h('section', { class: 'reference', 'aria-labelledby': 'reference-title' });

  const toc = h(
    'nav',
    { class: 'toc', 'aria-label': 'Spis treści pomocy' },
    h('ol', {}, ...REFERENCE.map((section) => h('li', {}, h('a', {
      href: `#/pomoc`,
      on: {
        click: (event) => {
          event.preventDefault();
          document.getElementById(`sekcja-${section.id}`)?.scrollIntoView({ block: 'start' });
          document.getElementById(`sekcja-${section.id}`)?.focus({ preventScroll: true });
        },
      },
    }, section.title)))),
  );

  const itemNode = (item: ReferenceItem) => {
    const children: Node[] = [
      h('h4', { id: `pozycja-${item.id}` }, item.title),
    ];
    if (item.signature) children.push(h('p', { class: 'signature' }, item.signature));
    for (const paragraph of item.text) children.push(h('p', {}, paragraph));
    if (item.example) {
      const { code, mode, caption } = item.example;
      const link = `#/?tryb=${mode}&kod=${encodeText(code)}`;
      children.push(
        h(
          'figure',
          { class: 'example' },
          caption ? h('figcaption', {}, caption, ` · tryb ${mode.toUpperCase()}`) : h('figcaption', {}, `Przykład · tryb ${mode.toUpperCase()}`),
          h('pre', {}, h('code', {}, code)),
          h('a', { class: 'btn small', href: link }, 'Wypróbuj w edytorze'),
        ),
      );
    }
    return h('article', { class: 'ref-item' }, ...children);
  };

  const sections = REFERENCE.map((section) =>
    h(
      'section',
      { class: 'ref-section', id: `sekcja-${section.id}`, tabindex: -1, 'aria-labelledby': `naglowek-${section.id}` },
      h('h2', { id: `naglowek-${section.id}` }, section.title),
      ...(section.intro ?? []).map((paragraph) => h('p', {}, paragraph)),
      ...section.items.map(itemNode),
    ),
  );

  root.append(
    h('h1', { id: 'reference-title' }, 'Pomoc: język Logo w Logomocji'),
    h('p', { class: 'lead' }, 'Wszystko, co rozumie język: polecenia, wyrażenia, zmienne, warunki, procedury i ograniczenia. Każdy przykład można od razu wypróbować.'),
    h('p', {}, h('a', { class: 'btn', href: '#/' }, '← Wróć do studia')),
    toc,
    ...sections,
  );
  return root;
}

/** Re-renders the page, used by the router the first time it is shown. */
export function mountReference(host: HTMLElement): void {
  clear(host);
  host.append(buildReference());
}
