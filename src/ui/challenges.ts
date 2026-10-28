import { h, announce, debounce, svgIcon, ICONS } from './dom';
import { CodeEditor } from './editor';
import { drawPreview } from './geom';
import { CHALLENGES, type Challenge } from '../data/challenges';
import { compareDrawings } from '../lang/check';
import { compile, runProgram } from '../lang/interpreter';
import { lex } from '../lang/lexer';
import { COMMANDS, DEF_WORDS } from '../lang/keywords';
import * as store from './storage';
import { paper } from './theme';
import type { Page } from './router';
import type { Route } from './share';
import type { Segment } from '../lang/types';

function usesCommand(src: string, what: 'repeat' | 'procedure'): boolean {
  try {
    return lex(src).some((t) => t.kind === 'word' && !t.colonName && (what === 'repeat' ? COMMANDS.get(t.name) === 'repeat' : DEF_WORDS.has(t.name) && t.first));
  } catch {
    return false;
  }
}

export interface ChallengeVerdict {
  ok: boolean;
  reason: string;
  segments: Segment[];
  marks: [number, number, number][];
}

/** Runs the user's program and checks it against the challenge. */
export function evaluate(c: Challenge, source: string): ChallengeVerdict {
  const parsed = compile(source, c.mode);
  if (parsed.error) {
    return { ok: false, reason: `Program ma błąd w wierszu ${parsed.error.line}, kolumnie ${parsed.error.column}: ${parsed.error.message}`, segments: [], marks: [] };
  }
  const user = runProgram(source, c.mode);
  if (user.error) {
    return { ok: false, reason: `Program zatrzymał się z błędem w wierszu ${user.error.line}, kolumnie ${user.error.column}: ${user.error.message}`, segments: user.segments, marks: [] };
  }
  const expected = runProgram(c.reference, c.mode).segments;
  const cmp = compareDrawings(expected, user.segments);
  const missingReq = (c.requires ?? []).filter((r) => !usesCommand(source, r.command));
  if (!cmp.ok) return { ok: false, reason: cmp.reason, segments: user.segments, marks: [...cmp.missing, ...cmp.extra] };
  if (missingReq.length) return { ok: false, reason: `Rysunek jest poprawny, ale zadanie wymaga czegoś więcej. ${missingReq.map((r) => r.message).join(' ')}`, segments: user.segments, marks: [] };
  return { ok: true, reason: 'Brawo! Rysunek zgadza się ze wzorem.', segments: user.segments, marks: [] };
}

export class Challenges implements Page {
  readonly el: HTMLElement;
  readonly title = 'Wyzwania';
  private progress = store.loadProgress();
  private current: Challenge = CHALLENGES[0];
  private list = h('ul', { class: 'challenge-list' });
  private summary = h('p', { class: 'muted', role: 'status' });
  private detail = h('div', { class: 'challenge-detail' });
  private editor: CodeEditor | null = null;
  private target = h('canvas', { class: 'thumb big', role: 'img' });
  private result = h('canvas', { class: 'thumb big', role: 'img' });
  private verdict = h('div', { class: 'verdict', role: 'status', 'aria-live': 'polite' });
  private hintBox = h('p', { class: 'hint-box', hidden: true });

  constructor(private openInWorkspace: (src: string, mode: '2d' | '3d') => void) {
    this.el = h('div', { class: 'page' },
      h('h1', { tabindex: -1 }, 'Wyzwania'),
      h('p', { class: 'lead' }, 'Zadania do samodzielnego rozwiązania. Napisz program, kliknij „Sprawdź” – porównamy Twój rysunek ze wzorem (kolory i grubość nie mają znaczenia, liczy się kształt i położenie).'),
      this.summary,
      h('div', { class: 'challenge-layout' },
        h('nav', { 'aria-label': 'Lista wyzwań' }, this.list),
        this.detail,
      ),
    );
  }

  private solvedCount(): number {
    return CHALLENGES.filter((c) => this.progress.solved[c.id]).length;
  }

  private renderList(): void {
    this.list.replaceChildren(...CHALLENGES.map((c, i) => {
      const solved = !!this.progress.solved[c.id];
      return h('li', null, h('a', {
        href: `#/wyzwania/${c.id}`,
        class: 'challenge-link' + (c.id === this.current.id ? ' current' : ''),
        'aria-current': c.id === this.current.id ? 'page' : null,
      },
      h('span', { class: 'num', 'aria-hidden': 'true' }, String(i + 1)),
      h('span', { class: 'ct' }, c.title),
      h('span', { class: `chip chip-${c.mode}` }, c.mode.toUpperCase()),
      solved ? h('span', { class: 'done', title: 'Rozwiązane' }, svgIcon(ICONS.check, 16), h('span', { class: 'sr-only' }, 'rozwiązane')) : null));
    }));
    const n = this.solvedCount();
    this.summary.textContent = `Rozwiązane: ${n} z ${CHALLENGES.length}`;
  }

  private select(c: Challenge): void {
    this.current = c;
    this.renderList();
    const draft = this.progress.drafts[c.id] ?? `; Twoje rozwiązanie: ${c.title}\n`;
    this.editor = new CodeEditor({
      value: draft,
      label: `Twój program do wyzwania „${c.title}”`,
      onChange: debounce((v: string) => {
        this.progress.drafts[c.id] = v;
        store.saveProgress(this.progress);
      }, 300),
    });
    this.verdict.className = 'verdict';
    this.verdict.textContent = '';
    this.hintBox.hidden = true;
    this.hintBox.textContent = `Podpowiedź: ${c.hint}`;
    const solved = !!this.progress.solved[c.id];
    this.target.setAttribute('aria-label', `Wzór do narysowania: ${c.title}`);
    this.result.setAttribute('aria-label', 'Twój rysunek');
    this.detail.replaceChildren(h('div', null,
      h('h2', { id: 'challenge-title', tabindex: -1 }, c.title, ' ', h('span', { class: `chip chip-${c.mode}` }, c.mode.toUpperCase()), solved ? h('span', { class: 'chip chip-ok' }, 'rozwiązane') : null),
      h('p', null, c.task),
      c.mode === '3d' ? h('p', { class: 'muted small' }, 'Podgląd jest rzutem przestrzennym; sprawdzanie porównuje położenie odcinków w trzech wymiarach.') : false,
      h('div', { class: 'pair' },
        h('figure', null, this.target, h('figcaption', null, 'Wzór')),
        h('figure', null, this.result, h('figcaption', null, 'Twój rysunek (przerywana linia – wzór)')),
      ),
      h('div', { class: 'editor-box' }, this.editor.el),
      h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn primary', onClick: () => this.check(), 'aria-keyshortcuts': 'Control+Enter Meta+Enter' }, svgIcon(ICONS.check), h('span', null, 'Sprawdź')),
        h('button', { type: 'button', class: 'btn', onClick: () => { this.hintBox.hidden = !this.hintBox.hidden; } }, 'Podpowiedź'),
        h('button', { type: 'button', class: 'btn', onClick: () => this.openInWorkspace(this.editor!.value, c.mode) }, 'Otwórz w pracowni'),
      ),
      this.hintBox,
      this.verdict,
    ));
    requestAnimationFrame(() => this.drawTarget());
  }

  private drawTarget(user?: ChallengeVerdict): void {
    const c = this.current;
    const bg = paper().bg;
    const expected = runProgram(c.reference, c.mode).segments;
    const w = Math.min(320, Math.max(200, this.detail.clientWidth / 2 - 24 || 280));
    drawPreview(this.target, expected, { bg, mode: c.mode, lineScale: 0.9 }, w, 240);
    drawPreview(this.result, user?.segments ?? [], {
      bg, mode: c.mode, lineScale: 0.9, ghost: expected, marks: user?.marks,
    }, w, 240);
  }

  check(): void {
    if (!this.editor) return;
    const c = this.current;
    const v = evaluate(c, this.editor.value);
    this.drawTarget(v);
    this.verdict.className = 'verdict ' + (v.ok ? 'ok' : 'fail');
    this.verdict.replaceChildren(h('strong', null, v.ok ? 'Zaliczone! ' : 'Jeszcze nie. '), v.reason);
    if (v.ok && !this.progress.solved[c.id]) {
      this.progress.solved[c.id] = new Date().toISOString();
      store.saveProgress(this.progress);
      this.renderList();
      announce(`Wyzwanie „${c.title}” zaliczone`);
    }
  }

  onShortcut(name: 'run' | 'step' | 'pause' | 'reset'): void {
    if (name === 'run') this.check();
  }

  onShow(route: Route): void {
    this.progress = store.loadProgress();
    const id = route.path[1];
    const first = CHALLENGES.find((x) => !this.progress.solved[x.id]) ?? CHALLENGES[0];
    const c = CHALLENGES.find((x) => x.id === id) ?? (this.editor ? this.current : first);
    if (!this.editor || c.id !== this.current.id || id) this.select(c);
    else this.renderList();
  }
}
