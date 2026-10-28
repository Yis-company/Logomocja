import { EXAMPLES } from '../../data/examples';
import { runSource, type Segment } from '../../lang';
import type { App, Page } from '../app';
import { h } from '../dom';
import { highlightToHtml } from '../highlight';
import { currentTheme, onThemeChange } from '../theme';
import { paletteFor } from '../view/common';
import { renderThumbnail } from '../view/view3d';

/** Galeria trzynastu programów wzorcowych. */
export class ExamplesPage implements Page {
  el: HTMLElement;
  private thumbs: Array<{ canvas: HTMLCanvasElement; segments: Segment[]; mode: '2d' | '3d' }> = [];
  private off: (() => void) | null = null;

  constructor(private app: App) {
    const grid = h('div', { class: 'card-grid' });
    for (const ex of EXAMPLES) {
      const canvas = h('canvas', { class: 'thumb', role: 'img', 'aria-label': `Podgląd rysunku: ${ex.name}` });
      const r = runSource(ex.source, ex.mode);
      this.thumbs.push({ canvas, segments: r.segments, mode: ex.mode });
      const code = h('pre', { class: 'code' });
      code.innerHTML = highlightToHtml(ex.source);
      grid.append(
        h(
          'article',
          { class: 'card example-card', 'data-example': ex.id },
          h('div', { class: 'thumb-wrap' }, canvas),
          h(
            'div',
            { class: 'card-body' },
            h('h2', { class: 'card-title' }, ex.name, h('span', { class: `badge badge-${ex.mode}`, title: ex.mode === '2d' ? 'Płaszczyzna' : 'Przestrzeń' }, ex.mode.toUpperCase())),
            h('p', { class: 'muted' }, ex.tagline),
            h(
              'div',
              { class: 'card-actions' },
              h('button', {
                class: 'btn btn-primary btn-sm', type: 'button', 'aria-label': `Wczytaj przykład ${ex.name} do pracowni`,
                onclick: () => this.app.loadExampleInStudio(ex.id),
              }, 'Wczytaj'),
            ),
            h('details', { class: 'code-details' }, h('summary', null, 'Pokaż kod'), code),
          ),
        ),
      );
    }
    this.el = h(
      'div',
      { class: 'page page-scroll' },
      h(
        'div',
        { class: 'container' },
        h('h1', null, 'Przykłady'),
        h('p', { class: 'lead' }, 'Trzynaście gotowych programów — siedem na płaszczyźnie i sześć w przestrzeni. Wczytaj dowolny do pracowni, uruchom go krok po kroku i zmieniaj liczby, żeby zobaczyć, co się stanie.'),
        grid,
      ),
    );
  }

  title(): string {
    return 'Przykłady';
  }

  enter(): void {
    this.renderThumbs();
    this.off ??= onThemeChange(() => this.renderThumbs());
  }

  leave(): void {
    this.off?.();
    this.off = null;
  }

  private renderThumbs(): void {
    const pal = paletteFor(currentTheme());
    for (const t of this.thumbs) renderThumbnail(t.canvas, t.segments, t.mode, pal, 440, 270, true);
  }
}
