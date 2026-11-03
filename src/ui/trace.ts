import type { Mode } from '../lang/types';
import type { TraceRow } from './runner';
import { h } from './dom';

const ROW_H = 28;

function num(v: number): string {
  const r = Math.round(v * 100) / 100;
  return (r === 0 ? '0' : String(r)).replace('-', '−');
}

/**
 * The run set as a departure timetable: one row per executed statement, the current
 * step on the yellow bar, a run-time error as a red footnote row. Virtualised.
 */
export class TraceView {
  readonly root: HTMLElement;
  private scroller: HTMLElement;
  private spacer: HTMLElement;
  private body: HTMLElement;
  private head: HTMLElement;
  private empty: HTMLElement;
  private rows: TraceRow[] = [];
  private mode: Mode = '2d';
  private live = false;
  private follow = true;
  private raf = 0;

  constructor(private onPick: (row: TraceRow) => void) {
    this.head = h('div', { class: 'trace-head', 'aria-hidden': 'true' });
    this.spacer = h('div', { class: 'trace-spacer' });
    this.body = h('div', { class: 'trace-body' });
    this.empty = h(
      'p',
      { class: 'trace-empty' },
      'Tu pojawi się rozkład kroków: każde wykonane polecenie w osobnym wierszu, z miejscem w programie i pozycją żółwia. Uruchom program albo wykonaj pierwszy krok.',
    );
    this.scroller = h(
      'div',
      { class: 'trace-scroll', tabindex: '0', role: 'region', 'aria-label': 'Przebieg programu: wykonane polecenia' },
      this.spacer,
      this.body,
    );
    this.root = h('div', { class: 'trace' }, this.head, this.scroller, this.empty);
    this.scroller.addEventListener('scroll', () => {
      const atBottom = this.scroller.scrollTop + this.scroller.clientHeight >= this.scroller.scrollHeight - ROW_H;
      this.follow = atBottom;
      this.request();
    });
    this.body.addEventListener('click', (e) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('[data-n]');
      if (!el) return;
      const row = this.rows[Number(el.dataset.n) - 1];
      if (row) this.onPick(row);
    });
    new ResizeObserver(() => this.request()).observe(this.scroller);
    this.renderHead();
    this.update();
  }

  setMode(mode: Mode): void {
    if (mode === this.mode) return;
    this.mode = mode;
    this.renderHead();
    this.request();
  }

  /** `live` marks the last row as the current step. */
  setLive(live: boolean): void {
    if (live === this.live) return;
    this.live = live;
    this.request();
  }

  push(rows: TraceRow[], reset: boolean): void {
    if (reset) {
      this.rows = [];
      this.follow = true;
      this.scroller.scrollTop = 0;
    }
    for (const r of rows) this.rows.push(r);
    this.update();
  }

  get count(): number {
    return this.rows.length;
  }

  private renderHead(): void {
    const cols = ['Nr', 'Wiersz', 'Polecenie', 'x', 'y', this.mode === '3d' ? 'z' : 'kurs'];
    this.head.replaceChildren(...cols.map((c, i) => h('span', { class: `tc tc-${i}` }, c)));
    this.root.dataset.mode = this.mode;
  }

  private update(): void {
    this.spacer.style.height = `${this.rows.length * ROW_H}px`;
    this.empty.hidden = this.rows.length > 0;
    this.scroller.hidden = this.rows.length === 0;
    if (this.follow) this.scroller.scrollTop = this.scroller.scrollHeight;
    // render now: scrolling and the rows must land in the same frame
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.render();
  }

  private request(): void {
    if (this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.render();
    });
  }

  private render(): void {
    if (this.follow && this.rows.length) this.scroller.scrollTop = this.scroller.scrollHeight;
    const top = this.scroller.scrollTop;
    const height = this.scroller.clientHeight || 200;
    const first = Math.max(0, Math.floor(top / ROW_H) - 4);
    const last = Math.min(this.rows.length, Math.ceil((top + height) / ROW_H) + 4);
    const frag: HTMLElement[] = [];
    for (let i = first; i < last; i++) {
      const r = this.rows[i]!;
      const current = this.live && i === this.rows.length - 1 && !r.error;
      const cls = `trace-row${current ? ' is-current' : ''}${r.error ? ' is-error' : ''}`;
      const third = this.mode === '3d' ? num(r.pos[2]) : r.heading === null ? '–' : `${num(r.heading)}°`;
      const label = r.error
        ? h('span', { class: 'tc tc-2 trace-error-text' }, r.error)
        : h(
            'span',
            { class: 'tc tc-2', style: { paddingLeft: `${Math.min(r.depth, 6) * 10}px` } },
            r.color ? h('i', { class: 'trace-swatch', style: { background: r.color } }) : null,
            r.label,
          );
      frag.push(
        h(
          'div',
          { class: cls, 'data-n': String(r.n), style: { transform: `translateY(${i * ROW_H}px)` }, title: `Pokaż wiersz ${r.line} w programie` },
          h('span', { class: 'tc tc-0' }, r.error ? '!' : String(r.n)),
          h('span', { class: 'tc tc-1' }, `${r.line}:${r.col}`),
          label,
          h('span', { class: 'tc tc-3' }, r.error ? '' : num(r.pos[0])),
          h('span', { class: 'tc tc-4' }, r.error ? '' : num(r.pos[1])),
          h('span', { class: 'tc tc-5' }, r.error ? '' : third),
        ),
      );
    }
    this.body.replaceChildren(...frag);
  }
}
