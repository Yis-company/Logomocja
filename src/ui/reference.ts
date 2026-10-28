import { COMMAND_DOCS, SECTIONS, SHORTCUTS } from '../data/reference';
import { EXAMPLES } from '../data/examples';
import { permalinkHash } from '../lib/share';
import type { Mode } from '../lang/parser';
import { h } from './dom';
import { highlight } from './highlight';

function code(src: string): HTMLElement {
  const pre = h('pre', { class: 'code', tabindex: 0, 'aria-label': 'Przykładowy kod' });
  const c = h('code', {});
  c.innerHTML = highlight(src).replace(/\n$/, '');
  pre.append(c);
  return pre;
}

function tryLink(src: string, mode: Mode): HTMLElement {
  return h('a', { class: 'btn btn-small', href: permalinkHash(src, mode) }, `Wypróbuj w pracowni (${mode.toUpperCase()})`);
}

function example(src: string, mode: Mode, caption?: string): HTMLElement {
  return h('figure', { class: 'ex' },
    caption ? h('figcaption', {}, caption) : null,
    code(src),
    h('div', { class: 'ex-actions' }, tryLink(src, mode)));
}

export function renderReference(): HTMLElement {
  const root = h('div', { class: 'doc' });
  const toc = h('nav', { class: 'toc', 'aria-label': 'Spis treści' });
  const tocList = h('ul', {});
  toc.append(h('h2', {}, 'Spis treści'), tocList);
  const addToc = (id: string, title: string) => {
    tocList.append(h('li', {}, h('a', {
      href: '#/instrukcja', onclick: (e: Event) => {
        e.preventDefault();
        const t = document.getElementById(id);
        t?.scrollIntoView({ behavior: 'auto', block: 'start' });
        t?.focus({ preventScroll: true });
      },
    }, title)));
  };

  const main = h('div', { class: 'doc-main' });
  main.append(h('h1', { id: 'ref-title', tabindex: -1 }, 'Instrukcja języka Logo'),
    h('p', { class: 'lead' }, 'Wszystko, co potrafi Logomocja: polecenia, wyrażenia, zmienne, warunki, procedury i limity. Każdy przykład możesz otworzyć w pracowni jednym kliknięciem.'));

  const addSection = (id: string, title: string, body: Array<Node | string>) => {
    addToc(id, title);
    main.append(h('section', { class: 'doc-sec', 'aria-labelledby': `h-${id}` },
      h('h2', { id, tabindex: -1 }, h('span', { id: `h-${id}` }, title)), ...body));
  };

  for (const s of SECTIONS.slice(0, 3)) {
    const body = h('div', { class: 'prose' });
    body.innerHTML = s.html;
    addSection('s-' + s.id, s.title, [body, ...(s.examples ?? []).map(e => example(e.code, e.mode, e.caption))]);
  }

  // polecenia
  const cmds = h('div', { class: 'cmds' });
  for (const d of COMMAND_DOCS) {
    cmds.append(h('article', { class: 'cmd', id: `cmd-${d.id}` },
      h('h3', {}, h('code', {}, d.syntax), d.mode === '3d' ? h('span', { class: 'badge' }, '3D') : null),
      h('p', { class: 'aliases' }, 'Polskie: ', h('code', {}, d.polish.join(', ')), ' · angielskie: ', h('code', {}, d.english.join(', '))),
      h('p', {}, d.summary),
      example(d.example, d.mode)));
  }
  addSection('s-polecenia', 'Polecenia', [
    h('p', {}, 'Każde polecenie ma polskie i angielskie nazwy; wszystkie są równoważne. Polecenia „gora”, „dol”, „pp” i „pl” działają tylko w trybie 3D.'),
    cmds,
  ]);

  for (const s of SECTIONS.slice(3)) {
    const body = h('div', { class: 'prose' });
    body.innerHTML = s.html;
    addSection('s-' + s.id, s.title, [body, ...(s.examples ?? []).map(e => example(e.code, e.mode, e.caption))]);
  }

  // gotowe programy
  addSection('s-programy', 'Gotowe programy', [
    h('p', {}, 'Przykłady z pracowni (przycisk „Przykłady”):'),
    h('ul', { class: 'plain' }, ...EXAMPLES.map(e => h('li', {}, h('a', { href: permalinkHash(e.source, e.mode) }, e.name), ` (${e.mode.toUpperCase()}): ${e.blurb}`))),
  ]);

  addSection('s-skroty', 'Skróty klawiszowe', [
    h('table', { class: 'keys' },
      h('thead', {}, h('tr', {}, h('th', { scope: 'col' }, 'Skrót'), h('th', { scope: 'col' }, 'Działanie'))),
      h('tbody', {}, ...SHORTCUTS.map(s => h('tr', {}, h('td', {}, h('kbd', {}, s.keys)), h('td', {}, s.action))))),
  ]);

  root.append(toc, main);
  return root;
}
