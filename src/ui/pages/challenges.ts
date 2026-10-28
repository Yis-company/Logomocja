import { CHALLENGES, LEVEL_LABEL, checkChallenge, expectedDrawing, findChallenge, type Challenge } from '../../data/challenges';
import type { Segment } from '../../lang';
import type { App, Page } from '../app';
import { openDialog } from '../dialog';
import { clear, h, icon } from '../dom';
import { highlightToHtml } from '../highlight';
import { hrefFor, navigate, type Route } from '../router';
import { ChallengeDrafts, Progress } from '../store';
import { currentTheme, onThemeChange } from '../theme';
import { toast } from '../toast';
import { paletteFor } from '../view/common';
import { renderThumbnail } from '../view/view3d';
import { Workspace } from '../workspace';

export class ChallengesPage implements Page {
  el: HTMLElement;
  private listEl: HTMLElement;
  private detailEl: HTMLElement;
  private ws: Workspace | null = null;
  private currentId: string | null = null;
  private off: (() => void) | null = null;
  private thumbs: Array<{ canvas: HTMLCanvasElement; c: Challenge }> = [];

  constructor(_app: App) {
    this.listEl = h('div', { class: 'page page-scroll' });
    this.detailEl = h('div', { class: 'page page-challenge' });
    this.el = h('div', { class: 'page-wrap' }, this.listEl, this.detailEl);
  }

  title(route?: Route): string {
    const id = route?.path[1];
    const c = id ? findChallenge(id) : undefined;
    return c ? `Wyzwanie: ${c.title}` : 'Wyzwania';
  }

  workspace(): Workspace | null {
    return this.ws && !this.detailEl.hidden ? this.ws : null;
  }

  enter(route: Route): void {
    const id = route.path[1];
    const c = id ? findChallenge(id) : undefined;
    this.off ??= onThemeChange(() => this.renderThumbs());
    if (c) {
      this.listEl.hidden = true;
      this.detailEl.hidden = false;
      this.showDetail(c);
    } else {
      this.detailEl.hidden = true;
      this.listEl.hidden = false;
      this.disposeDetail();
      this.showList();
      if (id) navigate(['wyzwania'], undefined, true);
    }
  }

  leave(): void {
    this.off?.();
    this.off = null;
    this.disposeDetail();
  }

  private disposeDetail(): void {
    this.ws?.dispose();
    this.ws = null;
    this.currentId = null;
    clear(this.detailEl);
  }

  // ----- lista ----------------------------------------------------------

  private showList(): void {
    const prog = Progress.all();
    const solved = CHALLENGES.filter((c) => prog[c.id]?.solved).length;
    this.thumbs = [];
    const grid = h('div', { class: 'card-grid' });
    for (const c of CHALLENGES) {
      const p = prog[c.id];
      const canvas = h('canvas', { class: 'thumb', role: 'img', 'aria-label': `Wzór rysunku: ${c.title}` });
      this.thumbs.push({ canvas, c });
      grid.append(
        h(
          'article',
          { class: `card challenge-card${p?.solved ? ' is-solved' : ''}`, 'data-challenge': c.id },
          h('div', { class: 'thumb-wrap' }, canvas),
          h(
            'div',
            { class: 'card-body' },
            h(
              'h2',
              { class: 'card-title' },
              c.title,
              h('span', { class: `badge badge-${c.mode}` }, c.mode.toUpperCase()),
            ),
            h('p', { class: 'muted' }, c.summary),
            h(
              'p',
              { class: 'meta' },
              h('span', { class: `level level-${c.level}` }, `Poziom: ${LEVEL_LABEL[c.level]}`),
              p?.solved
                ? h('span', { class: 'solved' }, icon('check', 14), 'Rozwiązane')
                : p && p.attempts > 0
                  ? h('span', { class: 'muted' }, `Próby: ${p.attempts}${p.best !== undefined ? `, najlepiej ${String(p.best).replace('.', ',')}%` : ''}`)
                  : null,
            ),
            h(
              'div',
              { class: 'card-actions' },
              h('a', { class: 'btn btn-primary btn-sm', href: hrefFor(['wyzwania', c.id]), 'aria-label': `${p?.solved ? 'Otwórz ponownie wyzwanie' : p?.attempts ? 'Kontynuuj wyzwanie' : 'Rozpocznij wyzwanie'}: ${c.title}` }, p?.solved ? 'Otwórz ponownie' : p?.attempts ? 'Kontynuuj' : 'Rozpocznij'),
            ),
          ),
        ),
      );
    }
    clear(this.listEl);
    this.listEl.append(
      h(
        'div',
        { class: 'container' },
        h('h1', null, 'Wyzwania'),
        h('p', { class: 'lead' }, 'Każde zadanie pokazuje, co narysować. Napisz program, a Logomocja porówna jego rysunek ze wzorem i powie, czy się zgadza — albo czego brakuje.'),
        h(
          'div',
          { class: 'progress-line', role: 'status' },
          h('strong', null, `Rozwiązane: ${solved} z ${CHALLENGES.length}`),
          h('progress', { max: String(CHALLENGES.length), value: String(solved), 'aria-label': 'Postęp w wyzwaniach' }),
          solved > 0
            ? h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: () => this.confirmReset() }, 'Wyzeruj postęp')
            : null,
        ),
        grid,
      ),
    );
    this.renderThumbs();
  }

  private confirmReset(): void {
    const dlg = openDialog({
      title: 'Wyzerować postęp?',
      body: [h('p', null, 'Zapisany postęp w wyzwaniach zostanie usunięty. Twoje programy zostaną zachowane.')],
      actions: [
        h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => dlg.close() }, 'Anuluj'),
        h('button', {
          class: 'btn btn-primary', type: 'button',
          onclick: () => {
            dlg.close();
            Progress.reset();
            this.showList();
          },
        }, 'Wyzeruj'),
      ],
    });
  }

  private renderThumbs(): void {
    const pal = paletteFor(currentTheme());
    for (const t of this.thumbs) renderThumbnail(t.canvas, expectedDrawing(t.c), t.c.mode, pal, 440, 270, true);
  }

  // ----- szczegóły ------------------------------------------------------

  private showDetail(c: Challenge): void {
    if (this.currentId === c.id && this.ws) return;
    this.disposeDetail();
    this.currentId = c.id;
    const ws = new Workspace({
      initialMode: c.mode,
      modeSwitch: false,
      examples: false,
      ariaLabel: `Edytor programu — ${c.title}`,
      load: () => ChallengeDrafts.get(c.id) ?? c.starter,
      persist: (_m, t) => ChallengeDrafts.set(c.id, t),
      pristine: () => [c.starter],
    });
    this.ws = ws;
    ws.setGhost(null);

    const result = h('div', { class: 'task-result', role: 'status', 'aria-live': 'polite' });
    const ghostId = `ghost-${c.id}`;
    const ghost = h('input', {
      type: 'checkbox', id: ghostId, class: 'sr-only-check',
      onchange: () => ws.setGhost(ghost.checked ? expectedDrawing(c) : null),
    });
    const ghostLabel = h('label', { class: 'btn btn-sm ghost-toggle', for: ghostId, title: 'Pokaż wzór przerywaną linią na rysunku' }, icon('eye', 16), 'Wzór na rysunku');
    ws.viewToolsSlot.append(ghost, ghostLabel);

    const preview = h('canvas', { class: 'thumb thumb-sm', role: 'img', 'aria-label': `Wzór do narysowania: ${c.title}` });
    const redraw = () => renderThumbnail(preview, expectedDrawing(c), c.mode, paletteFor(currentTheme()), 190, 130);
    redraw();
    const offTheme = onThemeChange(redraw);
    const origDispose = ws.dispose.bind(ws);
    ws.dispose = () => {
      offTheme();
      origDispose();
    };

    const solutionCode = h('pre', { class: 'code' });
    solutionCode.innerHTML = highlightToHtml(c.solution);
    const prog = Progress.get(c.id);

    const check = h('button', { class: 'btn btn-primary', type: 'button', onclick: () => this.check(c, ws, result) }, icon('check', 16), 'Sprawdź');
    const idx = CHALLENGES.findIndex((x) => x.id === c.id);
    const next = CHALLENGES[idx + 1];

    const panel = h(
      'div',
      { class: 'task' },
      h(
        'details',
        { class: 'task-details', open: window.matchMedia('(min-width: 900px)').matches },
        h(
          'summary',
          null,
          h('span', { class: 'task-title' }, c.title),
          h('span', { class: `badge badge-${c.mode}` }, c.mode.toUpperCase()),
          h('span', { class: `level level-${c.level}` }, LEVEL_LABEL[c.level]),
          prog.solved ? h('span', { class: 'solved' }, icon('check', 14), 'Rozwiązane') : null,
        ),
        h(
          'div',
          { class: 'task-content' },
          h('div', { class: 'task-grid' }, h('div', { class: 'task-text' }, ...c.task.map((t) => h('p', null, t))), h('figure', { class: 'task-figure' }, preview, h('figcaption', null, 'Wzór'))),
          h('details', { class: 'hints' }, h('summary', null, 'Podpowiedzi'), h('ol', null, ...c.hints.map((t) => h('li', null, t)))),
          h(
            'details',
            { class: 'hints' },
            h('summary', null, 'Rozwiązanie wzorcowe'),
            h('p', { class: 'muted small' }, 'Spróbuj najpierw sam. Jeśli utkniesz, zobacz, jak można to zapisać:'),
            solutionCode,
            h('button', { class: 'btn btn-sm', type: 'button', onclick: () => ws.replaceSource(c.solution, { run: true }) }, 'Wstaw do edytora'),
          ),
          next ? h('p', { class: 'next-line' }, 'Następne: ', h('a', { href: hrefFor(['wyzwania', next.id]) }, next.title)) : null,
        ),
      ),
      h(
        'div',
        { class: 'task-bar' },
        h('div', { class: 'task-actions' }, check, h('button', {
          class: 'btn btn-sm', type: 'button', title: 'Wstaw szablon startowy (poprzedni kod trafi do „Szkiców”)',
          onclick: () => {
            ws.replaceSource(c.starter, { run: true });
            result.replaceChildren();
          },
        }, 'Zacznij od nowa'), h('a', { class: 'btn btn-sm btn-ghost', href: hrefFor(['wyzwania']) }, '← Lista wyzwań')),
        result,
      ),
    );
    ws.el.classList.add('has-task');
    ws.topSlot.append(panel);
    clear(this.detailEl);
    this.detailEl.append(ws.el);
    // pierwsze uruchomienie szkicu
    ws.runInstant();
    ws.setGhost(null);
  }

  private check(c: Challenge, ws: Workspace, out: HTMLElement): void {
    const r = ws.runInstant();
    clear(out);
    const record = (score: number, ok: boolean) =>
      Progress.update(c.id, (p) => ({
        solved: p.solved || ok,
        solvedAt: ok && !p.solved ? Date.now() : p.solvedAt,
        attempts: p.attempts + 1,
        best: Math.max(p.best ?? 0, score),
      }));
    if (r.error) {
      record(0, false);
      out.append(this.verdict(false, 'Program zawiera błąd', `${r.error.message} (wiersz ${r.error.line}, kolumna ${r.error.column})`));
      return;
    }
    const res = checkChallenge(c, r.segments as Segment[]);
    const wasSolved = Progress.get(c.id).solved;
    record(res.score, res.ok);
    if (res.ok) {
      const idx = CHALLENGES.findIndex((x) => x.id === c.id);
      const next = CHALLENGES[idx + 1];
      out.append(
        this.verdict(true, wasSolved ? 'Zgadza się — znowu!' : 'Brawo! Wyzwanie rozwiązane.', res.reason),
      );
      if (next) out.append(h('a', { class: 'btn btn-sm', href: hrefFor(['wyzwania', next.id]) }, `Następne: ${next.title} →`));
      if (!wasSolved) toast(`Wyzwanie „${c.title}” rozwiązane!`, { kind: 'ok' });
    } else {
      out.append(this.verdict(false, 'Jeszcze nie', `${res.reason} (zgodność ${String(res.score).replace('.', ',')}%)`));
    }
  }

  private verdict(ok: boolean, title: string, detail: string): HTMLElement {
    return h(
      'div',
      { class: `verdict ${ok ? 'verdict-ok' : 'verdict-fail'}` },
      icon(ok ? 'check' : 'alert', 20),
      h('div', null, h('strong', null, title), h('p', null, detail)),
    );
  }
}

