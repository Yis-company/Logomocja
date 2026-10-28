import { h } from './dom';
import { drawPreview } from './geom';
import { REFERENCE, type RefCommand, type RefExample } from '../data/reference';
import { runProgram } from '../lang/interpreter';
import { paper } from './theme';
import { highlightHtml } from './editor';
import type { Page } from './router';
import type { Route } from './share';

/** Renders `text` with `backticks` as <code>. */
export function rich(text: string): (Node | string)[] {
  return text.split('`').map((part, i) => (i % 2 ? h('code', null, part) : part));
}

export class Reference implements Page {
  readonly el: HTMLElement;
  readonly title = 'Instrukcja';
  private previews: { cv: HTMLCanvasElement; ex: RefExample }[] = [];

  constructor(private tryIt: (code: string, mode: '2d' | '3d') => void) {
    const toc = h('nav', { class: 'toc', 'aria-label': 'Spis treści instrukcji' },
      h('h2', null, 'Spis treści'),
      h('ol', null, REFERENCE.map((s) => h('li', null, h('a', { href: `#/instrukcja/${s.id}` }, s.title)))),
    );
    const sections = REFERENCE.map((s) => {
      const body: Node[] = [h('h2', { id: `ref-${s.id}`, tabindex: -1 }, s.title), ...s.intro.map((p) => h('p', null, rich(p)))];
      if (s.commands) {
        body.push(h('div', { class: 'commands' }, s.commands.map((c) => this.command(c))));
      }
      if (s.table) {
        body.push(h('table', { class: 'table' },
          h('thead', null, h('tr', null, s.table.head.map((t) => h('th', { scope: 'col' }, t)))),
          h('tbody', null, s.table.rows.map((r) => h('tr', null, r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, rich(c)) : h('td', null, rich(c)))))))));
      }
      for (const ex of s.examples ?? []) body.push(this.example(ex.caption, ex));
      return h('section', { class: 'ref-section', 'aria-labelledby': `ref-${s.id}` }, body);
    });
    this.el = h('div', { class: 'page ref' },
      h('h1', { tabindex: -1 }, 'Instrukcja języka Logo'),
      h('p', { class: 'lead' }, 'Pełny opis polskiego dialektu Logo używanego w Logomocji: polecenia, wyrażenia, zmienne, warunki, procedury i limity. Przy każdym przykładzie znajdziesz przycisk, który wczytuje go do pracowni.'),
      h('div', { class: 'ref-layout' }, toc, h('div', { class: 'ref-content' }, sections)),
    );
  }

  private code(code: string): HTMLElement {
    const pre = h('pre', { class: 'codeblock' });
    pre.innerHTML = highlightHtml(code, null).replace(/\n$/, '');
    return pre;
  }

  private preview(ex: RefExample): HTMLCanvasElement {
    const cv = h('canvas', { class: 'thumb small', role: 'img', 'aria-label': ex.error ? 'Przykład błędu – brak rysunku lub rysunek urwany' : 'Podgląd rysunku z przykładu' });
    this.previews.push({ cv, ex });
    return cv;
  }

  private tryButton(ex: RefExample): HTMLElement {
    return h('button', { type: 'button', class: 'btn', onClick: () => this.tryIt(ex.code, ex.mode) }, 'Wypróbuj w pracowni');
  }

  private example(caption: string, ex: RefExample): HTMLElement {
    return h('figure', { class: 'example' },
      h('figcaption', null, rich(caption), ' ', h('span', { class: `chip chip-${ex.mode}` }, ex.mode.toUpperCase())),
      h('div', { class: 'example-row' }, this.code(ex.code), h('div', { class: 'example-side' }, this.preview(ex), this.tryButton(ex))),
    );
  }

  private command(c: RefCommand): HTMLElement {
    return h('article', { class: 'command' },
      h('h3', null, h('code', null, c.names[0]), c.only3d ? h('span', { class: 'chip chip-3d' }, 'tylko 3D') : null),
      h('dl', { class: 'aliases' },
        h('dt', null, 'Zapis'), h('dd', null, h('code', { class: 'syntax' }, c.syntax)),
        h('dt', null, 'Polskie nazwy'), h('dd', null, c.names.map((n, i) => [i ? ', ' : '', h('code', null, n)]).flat()),
        c.en.length ? h('dt', null, 'Angielskie nazwy') : null, c.en.length ? h('dd', null, c.en.map((n, i) => [i ? ', ' : '', h('code', null, n)]).flat()) : null,
      ),
      h('p', null, rich(c.desc)),
      h('div', { class: 'example-row' }, this.code(c.example.code), h('div', { class: 'example-side' }, this.preview(c.example), this.tryButton(c.example))),
    );
  }

  onShow(route: Route): void {
    requestAnimationFrame(() => {
      this.render();
      const sec = route.path[1];
      const target = sec ? document.getElementById(`ref-${sec}`) : null;
      if (target) {
        target.scrollIntoView({ block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  }

  render(): void {
    const bg = paper().bg;
    for (const { cv, ex } of this.previews) {
      const r = runProgram(ex.code, ex.mode);
      drawPreview(cv, r.segments, { bg, mode: ex.mode, lineScale: 0.7 }, 150, 110);
    }
  }
}
