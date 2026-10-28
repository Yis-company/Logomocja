import { run, type Mode } from '../lang';
import { EXAMPLES } from '../content/examples';
import { CHALLENGES } from '../content/challenges';
import { expectedDrawing } from '../content/checker';
import { REFERENCE, type RefExample } from '../content/reference';
import { h, svgIcon } from './dom';
import { highlightBlock } from './highlight';
import { ICONS } from './icons';
import { axonometric, paintThumbnail, planar } from './paint';
import type { App } from './app';

const MODE_LABEL: Record<Mode, string> = { '2d': '2D', '3d': '3D' };

/** Zarejestrowane miniatury – po zmianie motywu rysujemy je ponownie. */
const thumbJobs = new Map<HTMLCanvasElement, () => void>();
const painted = new Set<HTMLCanvasElement>();

function runJob(canvas: HTMLCanvasElement): void {
  const job = thumbJobs.get(canvas);
  if (!job) return;
  painted.add(canvas);
  job();
}

/** Miniatury rysujemy dopiero, gdy pojawią się na ekranie. */
const io = typeof IntersectionObserver !== 'undefined'
  ? new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io!.unobserve(e.target);
      runJob(e.target as HTMLCanvasElement);
    }
  }, { rootMargin: '200px' })
  : null;

function lazyPaint(canvas: HTMLCanvasElement, job: () => void): void {
  thumbJobs.set(canvas, job);
  if (io) io.observe(canvas);
  else requestAnimationFrame(() => runJob(canvas));
}

/** Miniatura rysowana od razu (np. w karcie wyzwania). */
export function registerThumbnail(canvas: HTMLCanvasElement, job: () => void): void {
  thumbJobs.set(canvas, job);
  requestAnimationFrame(() => runJob(canvas));
}

export function repaintThumbnails(): void {
  for (const canvas of [...thumbJobs.keys()]) {
    if (!canvas.isConnected) {
      thumbJobs.delete(canvas);
      painted.delete(canvas);
    } else if (painted.has(canvas)) {
      runJob(canvas);
    }
  }
}

function thumbnail(source: string, mode: Mode, label: string, cls = 'thumb'): HTMLCanvasElement {
  const canvas = h('canvas', { class: cls, role: 'img', 'aria-label': label });
  lazyPaint(canvas, () => {
    const segs = run(source, mode).segments;
    paintThumbnail(canvas, segs, mode === '3d' ? axonometric() : planar, { axes3d: mode === '3d' });
  });
  return canvas;
}

function pageHeader(title: string, lead: string): HTMLElement {
  return h('header', { class: 'doc-header' }, h('h1', null, title), h('p', { class: 'lead' }, lead));
}

export function renderExamplesPage(root: HTMLElement, app: App): void {
  const cards = EXAMPLES.map((ex) => h('li', { class: 'card' },
    thumbnail(ex.source, ex.mode, `Podgląd: ${ex.title}`),
    h('div', { class: 'card-body' },
      h('div', { class: 'card-title-row' },
        h('h2', { class: 'card-title' }, ex.title),
        h('span', { class: `badge badge-${ex.mode}` }, MODE_LABEL[ex.mode])),
      h('p', { class: 'card-text' }, ex.description),
      h('details', { class: 'card-code' },
        h('summary', null, 'Pokaż kod'),
        h('pre', { class: 'code-block', html: highlightBlock(ex.source) })),
      h('div', { class: 'card-actions' },
        h('a', { class: 'btn btn-primary', href: `#/przyklad/${ex.id}`, 'aria-label': `Otwórz przykład ${ex.title} w studiu` },
          svgIcon(ICONS.run), h('span', null, 'Otwórz')),
        h('code', { class: 'card-id', title: 'Nazwa przykładu' }, ex.id)),
    ),
  ));
  void app;
  root.replaceChildren(h('div', { class: 'doc' },
    pageHeader('Przykłady', 'Trzynaście programów na dobry początek. Otwórz dowolny w studiu, uruchom go i zmieniaj liczby, żeby zobaczyć, co się stanie. Twój szkic nie zginie – przed zastąpieniem zapytamy o zgodę.'),
    h('ul', { class: 'card-grid', role: 'list' }, cards),
  ));
}

export function renderChallengesPage(root: HTMLElement, app: App): void {
  const solved = CHALLENGES.filter((c) => app.challengeSolved(c.id)).length;
  const items = CHALLENGES.map((ch, i) => {
    const done = app.challengeSolved(ch.id);
    const canvas = h('canvas', { class: 'thumb', role: 'img', 'aria-label': `Wzór: ${ch.title}` });
    lazyPaint(canvas, () => paintThumbnail(canvas, expectedDrawing(ch), ch.mode === '3d' ? axonometric() : planar, { axes3d: ch.mode === '3d' }));
    return h('li', { class: `card ${done ? 'card-done' : ''}` },
      canvas,
      h('div', { class: 'card-body' },
        h('div', { class: 'card-title-row' },
          h('h2', { class: 'card-title' }, `${i + 1}. ${ch.title}`),
          h('span', { class: `badge badge-${ch.mode}` }, MODE_LABEL[ch.mode])),
        h('p', { class: 'card-text' }, ch.goal),
        h('div', { class: 'card-actions' },
          h('a', { class: `btn ${done ? '' : 'btn-primary'}`, href: `#/wyzwanie/${ch.id}`, 'aria-label': `${done ? 'Otwórz ponownie' : 'Rozwiąż'} wyzwanie ${ch.title}` },
            svgIcon(ICONS[done ? 'restore' : 'trophy']), h('span', null, done ? 'Otwórz ponownie' : 'Rozwiąż')),
          done ? h('span', { class: 'badge badge-ok' }, svgIcon(ICONS.check), 'rozwiązane') : h('span', { class: 'muted' }, 'nierozwiązane'),
        ),
      ),
    );
  });
  const progressBar = h('div', { class: 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(CHALLENGES.length), 'aria-valuenow': String(solved), 'aria-label': 'Rozwiązane wyzwania' },
    h('div', { class: 'progress-fill', style: `width:${(solved / CHALLENGES.length) * 100}%` }));
  root.replaceChildren(h('div', { class: 'doc' },
    pageHeader('Wyzwania', 'Narysuj wzór, a Logomocja sama sprawdzi rysunek. Liczy się kształt i rozmiar – nie to, gdzie żółw zaczął ani w jakiej kolejności rysował.'),
    h('div', { class: 'progress-row' },
      h('p', null, h('strong', null, `${solved} z ${CHALLENGES.length}`), ' rozwiązanych'),
      progressBar,
      solved > 0 ? h('button', {
        type: 'button', class: 'btn btn-small', onclick: async () => {
          if (await app.resetProgress()) renderChallengesPage(root, app);
        },
      }, 'Wyczyść postępy') : null),
    h('ul', { class: 'card-grid', role: 'list' }, items),
  ));
}

function exampleBlock(ex: RefExample, app: App, title: string): HTMLElement {
  return h('figure', { class: 'ref-example' },
    h('div', { class: 'ref-example-code' },
      h('pre', { class: 'code-block', html: highlightBlock(ex.source) }),
      h('div', { class: 'ref-example-actions' },
        h('span', { class: `badge badge-${ex.mode}` }, MODE_LABEL[ex.mode]),
        h('button', {
          type: 'button', class: 'btn btn-small',
          'aria-label': `Wypróbuj przykład „${title}” w studiu`,
          onclick: () => void app.tryProgram(ex.source, ex.mode, `przykład: ${title}`),
        }, svgIcon(ICONS.run), ' Wypróbuj'))),
    thumbnail(ex.source, ex.mode, `Rysunek przykładu: ${title}`, 'thumb ref-thumb'),
    ex.caption ? h('figcaption', null, ex.caption) : null,
  );
}

let renderedReference = false;

export function renderReferencePage(root: HTMLElement, app: App, sectionId?: string): void {
  if (!renderedReference) {
    renderedReference = true;
    const toc = h('nav', { class: 'ref-toc', 'aria-label': 'Spis treści pomocy' },
      h('h2', { class: 'ref-toc-title' }, 'Spis treści'),
      h('ol', null, REFERENCE.map((s) => h('li', null, h('a', { href: `#/pomoc/${s.id}` }, s.title)))));
    const sections = REFERENCE.map((s) => h('section', { class: 'ref-section', id: `ref-${s.id}`, 'aria-labelledby': `ref-h-${s.id}`, tabindex: '-1' },
      h('h2', { id: `ref-h-${s.id}` }, s.title),
      h('div', { class: 'ref-intro', html: s.intro }),
      (s.examples ?? []).map((ex, i) => exampleBlock(ex, app, `${s.title} ${i + 1}`)),
      s.entries.map((e) => h('article', { class: 'ref-entry', id: `ref-${e.id}`, 'aria-labelledby': `ref-h-${e.id}` },
        h('h3', { id: `ref-h-${e.id}` }, e.title),
        h('p', { class: 'ref-syntax' }, h('span', { class: 'muted' }, 'Składnia: '), h('code', null, e.syntax)),
        e.aliases.length ? h('p', { class: 'ref-aliases' }, h('span', { class: 'muted' }, 'Zapis: '),
          e.aliases.map((a) => h('code', { class: 'chip' }, a))) : null,
        h('div', { class: 'ref-body', html: e.body }),
        e.example ? exampleBlock(e.example, app, e.title) : null,
      )),
    ));
    root.replaceChildren(h('div', { class: 'doc doc-reference' },
      pageHeader('Pomoc: język Logomocji', 'Wszystko, co potrafi żółw: polecenia, wyrażenia, zmienne, warunki, procedury i limity. Każdy przykład możesz od razu wypróbować w studiu.'),
      h('div', { class: 'ref-layout' }, toc, h('div', { class: 'ref-content' }, sections)),
    ));
  }
  requestAnimationFrame(() => {
    const target = sectionId ? root.querySelector<HTMLElement>(`#ref-${CSS.escape(sectionId)}`) : null;
    if (target) {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    } else {
      window.scrollTo(0, 0);
    }
  });
}
