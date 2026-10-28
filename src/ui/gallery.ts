import { h, debounce } from './dom';
import { drawPreview } from './geom';
import { EXAMPLES } from '../data/examples';
import { runProgram } from '../lang/interpreter';
import { paper } from './theme';
import type { Page } from './router';

export class Gallery implements Page {
  readonly el: HTMLElement;
  readonly title = 'Przykłady';
  private canvases: { cv: HTMLCanvasElement; id: string }[] = [];

  constructor(private open: (id: string) => void) {
    const cards = EXAMPLES.map((ex) => {
      const cv = h('canvas', { class: 'thumb', 'aria-hidden': 'true' });
      this.canvases.push({ cv, id: ex.id });
      const lines = ex.source.split('\n').length;
      return h('li', { class: 'card' },
        cv,
        h('div', { class: 'card-body' },
          h('h3', null, ex.name, ' ', h('span', { class: `chip chip-${ex.mode}` }, ex.mode.toUpperCase())),
          h('p', null, ex.description),
          h('p', { class: 'muted small' }, `${lines} ${lines === 1 ? 'wiersz' : lines < 5 ? 'wiersze' : 'wierszy'} kodu`),
          h('button', { type: 'button', class: 'btn primary', onClick: () => this.open(ex.id), 'aria-label': `Otwórz przykład ${ex.name} w pracowni` }, 'Otwórz w pracowni'),
        ),
      );
    });
    this.el = h('div', { class: 'page' },
      h('h1', { tabindex: -1 }, 'Przykłady'),
      h('p', { class: 'lead' }, 'Trzynaście gotowych programów. Otwórz dowolny w pracowni, uruchom go i zmieniaj liczby – to najlepszy sposób, by zrozumieć, jak działa Logo.'),
      h('ul', { class: 'cards' }, cards),
    );
  }

  onShow(): void {
    requestAnimationFrame(() => this.render());
    if (!this.resizeBound) {
      this.resizeBound = true;
      window.addEventListener('resize', debounce(() => { if (!this.el.hidden) this.render(); }, 150));
    }
  }
  private resizeBound = false;

  render(): void {
    const bg = paper().bg;
    for (const { cv, id } of this.canvases) {
      const ex = EXAMPLES.find((e) => e.id === id)!;
      const r = runProgram(ex.source, ex.mode);
      const w = Math.round(cv.parentElement?.clientWidth || 250);
      drawPreview(cv, r.segments, { bg, mode: ex.mode, lineScale: 0.8 }, w, Math.round(w * 0.62));
    }
  }
}
