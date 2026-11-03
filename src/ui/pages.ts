// Wyzwania (challenges) and Pomoc (reference) pages.
import { CHALLENGES, Challenge, check, expected } from '../content/challenges';
import { COMMANDS, TOPICS } from '../content/reference';
import type { Mode } from '../lang/parser';
import { Editor } from './editor';
import { drawPreview } from './preview';
import { icon } from './icons';
import { store } from './store';
import { SHORTCUTS } from './studio';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

type Progress = Record<string, boolean>;

export class ChallengesPage {
  el: HTMLElement;
  private editor: Editor;
  private current: Challenge = CHALLENGES[0];
  private progress: Progress = store.json<Progress>('progress', {});
  private last: { ok: boolean; reason: string; segments: import('../lang/interp').Segment[] } | null = null;

  constructor(private openInStudio: (src: string, mode: Mode, name: string) => void) {
    this.el = document.createElement('section');
    this.el.className = 'page challenges';
    this.el.setAttribute('aria-labelledby', 'ch-title');
    this.editor = new Editor('Twoje rozwiązanie', 'rozwiazanie');
    this.editor.onInput = (v) => { store.set(`challenge.${this.current.id}`, v); this.last = null; this.paint(); this.setResult(null); };
    this.editor.onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); this.check(); return true; }
      return false;
    };
    this.el.innerHTML = `
      <nav class="ch-list" aria-label="Lista wyzwań">
        <h1 id="ch-title">Wyzwania</h1>
        <p class="ch-count"></p>
        <ol></ol>
      </nav>
      <article class="ch-detail" aria-live="off">
        <header class="ch-head">
          <h2 class="ch-name"></h2>
          <span class="ch-badge"></span>
        </header>
        <p class="ch-task"></p>
        <details class="ch-hint"><summary>Podpowiedź</summary><p></p></details>
        <div class="ch-work">
          <figure class="ch-figure">
            <canvas class="ch-canvas" role="img"></canvas>
            <figcaption><span class="key-target"></span>Wzór <span class="key-attempt"></span>Twój rysunek</figcaption>
          </figure>
          <div class="ch-code">
            <div class="ch-editor-slot"></div>
            <div class="ch-actions">
              <button type="button" class="btn primary" data-act="check" aria-keyshortcuts="Control+Enter Meta+Enter">${icon('check')}<span>Sprawdź</span></button>
              <button type="button" class="btn" data-act="studio">${icon('pen')}<span>Otwórz w studiu</span></button>
            </div>
            <div class="ch-result" role="status" aria-live="polite"></div>
          </div>
        </div>
      </article>`;
    this.el.querySelector('.ch-editor-slot')!.appendChild(this.editor.root);
    this.el.addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('button');
      if (!b) return;
      if (b.dataset.act === 'check') this.check();
      if (b.dataset.act === 'studio') this.openInStudio(this.editor.value, this.current.mode, this.current.title);
    });
    new ResizeObserver(() => this.paint()).observe(this.el.querySelector('.ch-canvas')!);
  }

  show(id?: string) {
    const c = CHALLENGES.find((x) => x.id === id) ?? this.current;
    this.current = c;
    this.last = null;
    this.renderList();
    this.el.querySelector('.ch-name')!.textContent = c.title;
    this.el.querySelector('.ch-task')!.textContent = c.task;
    this.el.querySelector('.ch-hint p')!.textContent = c.hint;
    (this.el.querySelector('.ch-hint') as HTMLDetailsElement).open = false;
    const canvas = this.el.querySelector('.ch-canvas')!;
    canvas.setAttribute('aria-label', `Wzór do narysowania: ${c.title}. ${c.task}`);
    this.editor.value = store.get(`challenge.${c.id}`) ?? (c.mode === '3d' ? '; Tryb 3D\n' : '');
    this.setBadge();
    this.setResult(null);
    this.paint();
  }

  private renderList() {
    const done = CHALLENGES.filter((c) => this.progress[c.id]).length;
    this.el.querySelector('.ch-count')!.textContent = `Zaliczone: ${done} z ${CHALLENGES.length}`;
    this.el.querySelector('.ch-list ol')!.innerHTML = CHALLENGES.map((c) => `
      <li><a href="#/wyzwania/${c.id}"${c.id === this.current.id ? ' aria-current="page"' : ''}>
        <span class="ch-state${this.progress[c.id] ? ' is-done' : ''}" aria-hidden="true">${this.progress[c.id] ? icon('check') : ''}</span>
        <span class="ch-li-title">${esc(c.title)}</span>
        <span class="ch-li-mode">${c.mode.toUpperCase()}</span>
        <span class="sr-only">${this.progress[c.id] ? 'zaliczone' : 'do zrobienia'}</span>
      </a></li>`).join('');
  }

  private setBadge() {
    const b = this.el.querySelector('.ch-badge') as HTMLElement;
    const ok = this.progress[this.current.id];
    b.className = `ch-badge${ok ? ' is-done' : ''}`;
    b.innerHTML = ok ? `${icon('check')}Zaliczone` : `Tryb ${this.current.mode.toUpperCase()}`;
  }

  private paint() {
    const canvas = this.el.querySelector('.ch-canvas') as HTMLCanvasElement;
    if (!canvas.clientWidth) return;
    const layers: Parameters<typeof drawPreview>[1] = [{ segments: expected(this.current), style: 'target' }];
    if (this.last) layers.push({ segments: this.last.segments, style: 'normal' });
    drawPreview(canvas, layers, this.current.mode, { grid: true });
  }

  private setResult(r: { ok: boolean; reason: string } | null) {
    const el = this.el.querySelector('.ch-result') as HTMLElement;
    if (!r) { el.innerHTML = ''; el.dataset.kind = ''; return; }
    el.dataset.kind = r.ok ? 'ok' : 'fail';
    el.innerHTML = `${icon(r.ok ? 'check' : 'cross')}<p><strong>${r.ok ? 'Zaliczone!' : 'Jeszcze nie.'}</strong> ${esc(r.reason)}</p>`;
  }

  check() {
    const r = check(this.current, this.editor.value);
    this.last = r;
    this.editor.setError(r.error ?? null);
    if (r.ok) {
      this.progress[this.current.id] = true;
      store.set('progress', JSON.stringify(this.progress));
      this.renderList();
      this.setBadge();
    }
    this.setResult(r);
    this.paint();
  }
}

export class HelpPage {
  el: HTMLElement;
  constructor(onTry: (src: string, mode: Mode) => void) {
    this.el = document.createElement('section');
    this.el.className = 'page help';
    this.el.setAttribute('aria-labelledby', 'help-title');
    const tryBtn = (code: string, mode: Mode) => `
      <div class="example"><pre><code>${esc(code)}</code></pre>
        <button type="button" class="btn small" data-try="${esc(code)}" data-mode="${mode}">${icon('play')}<span>Wypróbuj${mode === '3d' ? ' w 3D' : ''}</span></button></div>`;
    const toc = [...TOPICS.slice(0, 1), { id: 'polecenia', title: 'Polecenia' }, ...TOPICS.slice(1), { id: 'skroty', title: 'Skróty klawiszowe' }];
    this.el.innerHTML = `
      <nav class="help-toc" aria-label="Spis treści">
        <h1 id="help-title">Pomoc: język Logomocji</h1>
        <ol>${toc.map((t) => `<li><a href="#/pomoc" data-jump="${t.id}">${t.title}</a></li>`).join('')}</ol>
      </nav>
      <div class="help-body">
        ${section(TOPICS[0])}
        <section id="h-polecenia" aria-labelledby="hh-polecenia">
          <h2 id="hh-polecenia" tabindex="-1">Polecenia</h2>
          <p>Każda nazwa polska i angielska znaczy to samo. Polecenia oznaczone 3D działają tylko w trybie 3D.</p>
          <div class="cmd-list">
          ${COMMANDS.map((c) => `
            <article class="cmd">
              <h3><code>${c.names.split(', ').join('</code>, <code>')}</code>${c.mode === '3d' ? '<span class="tag">3D</span>' : ''}</h3>
              <p class="cmd-meta"><span>Po angielsku: <code>${c.english.split(', ').join('</code>, <code>')}</code></span><span>Argument: ${esc(c.arg)}</span></p>
              <p>${esc(c.text)}</p>
              ${tryBtn(c.example, c.mode)}
            </article>`).join('')}
          </div>
        </section>
        ${TOPICS.slice(1).map(section).join('')}
        <section id="h-skroty" aria-labelledby="hh-skroty">
          <h2 id="hh-skroty" tabindex="-1">Skróty klawiszowe</h2>
          <dl class="keys">${SHORTCUTS.map(([k, v]) => `<div><dt><kbd>${k}</kbd></dt><dd>${v}</dd></div>`).join('')}</dl>
        </section>
      </div>`;
    function section(t: (typeof TOPICS)[number]) {
      return `<section id="h-${t.id}" aria-labelledby="hh-${t.id}">
        <h2 id="hh-${t.id}" tabindex="-1">${t.title}</h2>${t.html}
        ${(t.examples ?? []).map((e) => tryBtn(e.code, e.mode)).join('')}
      </section>`;
    }
    this.el.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const j = target.closest('[data-jump]') as HTMLElement | null;
      if (j) {
        e.preventDefault();
        const h = this.el.querySelector(`#hh-${j.dataset.jump}`) as HTMLElement;
        h.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        h.focus({ preventScroll: true });
        return;
      }
      const b = target.closest('[data-try]') as HTMLElement | null;
      if (b) onTry(b.dataset.try!, b.dataset.mode as Mode);
    });
  }
}
