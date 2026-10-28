import { REFERENCE, type RefBlock, type RefCommand, type RefExample } from '../../data/reference';
import { LIMITS, runSource, type Segment } from '../../lang';
import type { App, Page } from '../app';
import { h } from '../dom';
import { highlightToHtml } from '../highlight';
import { hrefFor, type Route } from '../router';
import { CANVAS_KEYS, MOUSE_HINTS, SHORTCUTS, showKeys } from '../shortcuts';
import { currentTheme, onThemeChange } from '../theme';
import { paletteFor } from '../view/common';
import { renderThumbnail } from '../view/view3d';
import { VERSION } from '../../version';

/** Zamienia `kod` w tekście na elementy <code>. */
export function inline(text: string): Array<Node | string> {
  return text.split('`').map((part, i) => (i % 2 ? h('code', null, part) : part));
}

export class ReferencePage implements Page {
  el: HTMLElement;
  private thumbs: Array<{ canvas: HTMLCanvasElement; segs: Segment[]; mode: '2d' | '3d' }> = [];
  private off: (() => void) | null = null;
  private scroller: HTMLElement;

  constructor(private app: App) {
    const toc = h('ol', { class: 'toc-list' });
    const content = h('article', { class: 'ref-content' });
    content.append(
      h('h1', null, 'Polecenia i opis języka'),
      h('p', { class: 'lead' }, 'Wszystko, co potrafi Logo w Logomocji: polecenia, wyrażenia, zmienne, warunki, procedury, przestrzeń 3D, błędy i limity. Każde polecenie ma przykład, który możesz uruchomić jednym kliknięciem.'),
    );
    for (const sec of REFERENCE) {
      toc.append(h('li', null, h('a', { href: hrefFor(['polecenia', sec.id]) }, sec.title)));
      const section = h('section', { class: 'ref-section', id: `ref-${sec.id}`, 'aria-labelledby': `ref-h-${sec.id}` }, h('h2', { id: `ref-h-${sec.id}` }, sec.title));
      for (const b of sec.blocks) section.append(...this.block(b));
      content.append(section);
    }
    // skróty klawiszowe
    toc.append(h('li', null, h('a', { href: hrefFor(['polecenia', 'skroty']) }, 'Skróty klawiszowe')));
    content.append(this.shortcutsSection());

    this.el = h(
      'div',
      { class: 'page page-scroll' },
      h(
        'div',
        { class: 'container ref-layout' },
        h('nav', { class: 'ref-toc', 'aria-label': 'Spis treści opisu języka' }, h('h2', { class: 'toc-title' }, 'Spis treści'), toc),
        content,
      ),
    );
    this.scroller = this.el;
  }

  title(): string {
    return 'Polecenia i opis języka';
  }

  enter(route: Route): void {
    this.renderThumbs();
    this.off ??= onThemeChange(() => this.renderThumbs());
    const target = route.path[1];
    if (target) {
      const el = document.getElementById(target === 'skroty' ? 'ref-skroty' : `ref-${target}`) ?? document.getElementById(`cmd-${target}`);
      if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
    } else this.scroller.scrollTop = 0;
  }

  leave(): void {
    this.off?.();
    this.off = null;
  }

  private renderThumbs(): void {
    const pal = paletteFor(currentTheme());
    for (const t of this.thumbs) renderThumbnail(t.canvas, t.segs, t.mode, pal, 200, 140);
  }

  private block(b: RefBlock): Node[] {
    switch (b.t) {
      case 'p': return [h('p', null, ...inline(b.text))];
      case 'list': return [h('ul', { class: 'ref-list' }, ...b.items.map((i) => h('li', null, ...inline(i))))];
      case 'note': return [h('p', { class: 'note' }, ...inline(b.text))];
      case 'example': return [this.example(b.example, b.title)];
      case 'table':
        return [
          h('div', { class: 'table-wrap' },
            h('table', { class: 'table' },
              h('thead', null, h('tr', null, ...b.head.map((c) => h('th', { scope: 'col' }, c)))),
              h('tbody', null, ...b.rows.map((r) => h('tr', null, ...r.map((c, i) => (i === 0 ? h('th', { scope: 'row' }, ...inline(c)) : h('td', null, ...inline(c)))))))),
          ),
        ];
      case 'commands': return b.items.map((c) => this.command(c));
    }
  }

  private command(c: RefCommand): HTMLElement {
    return h(
      'section',
      { class: 'ref-cmd', id: `cmd-${c.id}`, 'aria-label': `Polecenie ${c.names[0]}` },
      h('h3', null, h('code', { class: 'syntax' }, c.syntax)),
      h('p', { class: 'aliases' }, 'Zapisy: ', ...c.names.flatMap((n, i) => [i ? ' ' : '', h('code', null, n)])),
      h('p', null, ...inline(c.summary)),
      ...(c.details ?? []).map((d) => h('p', null, ...inline(d))),
      this.example(c.example, undefined, c.names[0]),
    );
  }

  private example(ex: RefExample, title?: string, cmdName?: string): HTMLElement {
    const code = h('pre', { class: 'code', tabindex: '0', 'aria-label': 'Przykładowy kod' });
    code.innerHTML = highlightToHtml(ex.code);
    const canvas = h('canvas', { class: 'thumb thumb-ref', role: 'img', 'aria-label': 'Podgląd rysunku z przykładu' });
    const r = runSource(ex.code, ex.mode);
    this.thumbs.push({ canvas, segs: r.segments, mode: ex.mode });
    return h(
      'figure',
      { class: 'ref-example' },
      title ? h('figcaption', null, title) : null,
      h(
        'div',
        { class: 'ref-example-body' },
        code,
        h('div', { class: 'ref-example-side' }, canvas,
          ex.fails ? h('p', { class: 'muted small' }, 'Ten program kończy się błędem wykonania — rysunek sprzed błędu zostaje.') : null,
          h('button', {
            class: 'btn btn-sm', type: 'button',
            'aria-label': cmdName ? `Wypróbuj przykład polecenia ${cmdName} w pracowni (${ex.mode.toUpperCase()})` : `Wypróbuj ten przykład w pracowni (${ex.mode.toUpperCase()})`,
            onclick: () => this.app.openInStudio(ex.code, ex.mode, { title: cmdName ?? 'przyklad' }),
          }, `Wypróbuj (${ex.mode.toUpperCase()})`),
        ),
      ),
    );
  }

  private shortcutsSection(): HTMLElement {
    const row = (keys: string[], label: string) =>
      h('tr', null, h('td', null, ...keys.flatMap((k, i) => [i ? ' lub ' : '', h('kbd', null, showKeys(k))])), h('td', null, label));
    return h(
      'section',
      { class: 'ref-section', id: 'ref-skroty', 'aria-labelledby': 'ref-h-skroty' },
      h('h2', { id: 'ref-h-skroty' }, 'Skróty klawiszowe'),
      h('p', null, 'Ta sama lista jest dostępna w pracowni pod przyciskiem z klawiaturą oraz po naciśnięciu klawisza ? poza edytorem. Na komputerach Apple zamiast Ctrl używaj ⌘.'),
      h('div', { class: 'table-wrap' }, h('table', { class: 'table keys' }, h('tbody', null, ...SHORTCUTS.map((s) => row(s.keys, s.label))))),
      h('h3', null, 'Rysunek'),
      h('div', { class: 'table-wrap' }, h('table', { class: 'table keys' }, h('tbody', null, ...CANVAS_KEYS.map((s) => row([s.keys], s.label)), ...MOUSE_HINTS.map((s) => row([s.keys], s.label))))),
      h('p', { class: 'muted' }, `Logomocja wersja ${VERSION} — działa w całości w przeglądarce. Programy, ustawienia i postępy są zapisywane wyłącznie lokalnie (localStorage); nic nie jest wysyłane do sieci.`),
      h('p', { class: 'muted' }, `Limity: program do ${LIMITS.maxChars.toLocaleString('pl-PL')} znaków, ${LIMITS.maxOps.toLocaleString('pl-PL')} operacji i ${LIMITS.maxSegments.toLocaleString('pl-PL')} odcinków.`),
    );
  }
}
