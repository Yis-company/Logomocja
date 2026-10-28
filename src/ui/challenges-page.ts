import { CHALLENGES, type Challenge, checkDrawing, findChallenge } from '../content/challenges';
import { compile, runSource, type Segment } from '../lang/index';
import { el } from './dom';
import { Editor } from './editor';
import { loadItem, loadJson, saveItem, saveJson } from './storage';
import { View2D } from './view2d';
import { type View3D } from './view3d';
import { webglProblem } from './webgl';

const PROGRESS_KEY = 'wyzwania';
const DRAFT_PREFIX = 'wyzwanie.';

interface Progress {
  solved: Record<string, boolean>;
}

/** Practice tasks: write a program, check it against the expected picture, keep the result locally. */
export class ChallengesPage {
  readonly element: HTMLElement;
  private readonly list: HTMLElement;
  private readonly detail: HTMLElement;
  private current: Challenge = CHALLENGES[0]!;
  private expected: readonly Segment[] = [];
  private editor!: Editor;
  private result!: HTMLElement;
  private stageHost!: HTMLElement;
  private view2: View2D | null = null;
  private view3: View3D | null = null;
  private progress: Progress = loadJson<Progress>(PROGRESS_KEY, { solved: {} });
  private saveTimer = 0;

  constructor() {
    this.list = el('ul', { class: 'challenge-list', 'aria-label': 'Lista wyzwań' });
    this.detail = el('div', { class: 'challenge-detail' });
    this.element = el(
      'div',
      { class: 'challenges' },
      el('h1', { text: 'Wyzwania' }),
      el('p', {
        class: 'lead',
        text: 'Narysuj wskazany obrazek własnym programem. Sprawdzenie porównuje rysunek ze wzorem, a nie kod, więc pętle, procedury i inne sposoby są dozwolone.',
      }),
      el('div', { class: 'challenge-layout' }, this.list, this.detail),
    );
    this.select(CHALLENGES[0]!.id);
  }

  /** Opens a challenge by id; an unknown or missing id keeps the current one. */
  open(id: string | null): void {
    const challenge = id ? findChallenge(id) : undefined;
    if (challenge && challenge.id !== this.current.id) this.select(challenge.id);
  }

  private select(id: string): void {
    const next = findChallenge(id);
    if (!next) return;
    this.flushSave();
    this.current = next;
    this.expected = runSource(next.solution, next.mode).segments;
    this.buildList();
    this.buildDetail();
  }

  private buildList(): void {
    this.list.innerHTML = '';
    for (const c of CHALLENGES) {
      const solved = this.progress.solved[c.id] === true;
      const button = el(
        'button',
        {
          class: 'challenge-item',
          type: 'button',
          'aria-current': c.id === this.current.id ? 'true' : undefined,
          on: { click: () => this.select(c.id) },
        },
        el('span', { class: 'challenge-title', text: c.title }),
        el('span', { class: 'badge', text: c.mode.toUpperCase() }),
        solved ? el('span', { class: 'solved', 'aria-label': 'Zaliczone', title: 'Zaliczone', text: '✓' }) : false,
      );
      this.list.append(el('li', {}, button));
    }
  }

  private buildDetail(): void {
    const c = this.current;
    // The stage is rebuilt for every challenge, so its views are rebuilt with it.
    this.view2?.dispose();
    this.view3?.dispose();
    this.view2 = null;
    this.view3 = null;
    this.detail.innerHTML = '';
    this.result = el('div', { class: 'check-result', role: 'status', 'aria-live': 'polite' });
    this.stageHost = el('div', { class: 'stage-host challenge-stage' });
    const editorHost = el('div', { class: 'editor-host' });
    this.editor = new Editor(editorHost, { label: `Program do wyzwania: ${c.title}`, onInput: () => this.onInput() });
    this.editor.setTextSilently(loadItem(DRAFT_PREFIX + c.id) ?? '; Napisz program tutaj.\n');

    const check = el('button', { class: 'btn btn-primary', type: 'button', text: 'Sprawdź', on: { click: () => this.check() } });
    const clear = el('button', { class: 'btn btn-ghost', type: 'button', text: 'Wyczyść kod', on: { click: () => this.editor.replaceText('') } });
    const solution = el(
      'details',
      { class: 'solution' },
      el('summary', { text: 'Pokaż rozwiązanie' }),
      el('p', { text: 'Wzorcowy program rysuje dokładnie ten obrazek.' }),
      el('pre', { class: 'code-sample' }, el('code', { text: c.solution })),
      el('button', { class: 'btn', type: 'button', text: 'Wstaw do edytora', on: { click: () => this.editor.replaceText(c.solution) } }),
    );

    this.detail.append(
      el('header', { class: 'challenge-head' }, el('h2', { text: c.title }), el('span', { class: 'badge', text: c.mode.toUpperCase() })),
      el('p', { class: 'task', text: c.task }),
      ...(c.require ? [el('p', { class: 'muted', text: requirementText(c) })] : []),
      el(
        'div',
        { class: 'challenge-work' },
        el('div', { class: 'challenge-code' }, el('div', { class: 'toolbar-group' }, check, clear), editorHost, this.result, solution),
        el('div', { class: 'challenge-stage-wrap' }, this.stageHost),
      ),
    );
    this.showStage([]);
    void this.ensureView().then(() => this.showStage([]));
  }

  private onInput(): void {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout(() => this.flushSave(), 300);
  }

  private flushSave(): void {
    window.clearTimeout(this.saveTimer);
    if (this.editor) saveItem(DRAFT_PREFIX + this.current.id, this.editor.value);
  }

  private async ensureView(): Promise<void> {
    if (this.current.mode === '2d') {
      if (!this.view2) this.view2 = new View2D(this.stageHost);
      return;
    }
    if (this.view3 || webglProblem()) return;
    const { View3D: Class } = await import('./view3d');
    this.view3 = new Class(this.stageHost);
  }

  /** Shows the learner's drawing over the expected picture, which is drawn as a faint ghost. */
  private showStage(drawn: readonly Segment[]): void {
    if (this.current.mode === '2d') {
      if (!this.view2) return;
      this.view2.render(drawn, null, this.expected);
      this.view2.fit();
    } else if (this.view3) {
      this.view3.render(drawn, null, this.expected, 0);
    }
  }

  private check(): void {
    const c = this.current;
    const compiled = compile(this.editor.value, c.mode);
    if (!compiled.ok) {
      this.editor.setError({ line: compiled.error.line, column: compiled.error.column, message: compiled.error.message });
      this.setResult(false, `Błąd składni, linia ${compiled.error.line}, kolumna ${compiled.error.column}: ${compiled.error.message}`);
      return;
    }
    const run = runSource(this.editor.value, c.mode);
    this.editor.setError(run.error ? { line: run.error.line, column: run.error.column, message: run.error.message } : null);
    this.showStage(run.segments);
    if (run.error) {
      this.setResult(false, `Błąd wykonania, linia ${run.error.line}, kolumna ${run.error.column}: ${run.error.message}`);
      return;
    }
    const verdict = checkDrawing(c, run.segments);
    if (verdict.ok && this.progress.solved[c.id] !== true) {
      this.progress.solved[c.id] = true;
      saveJson(PROGRESS_KEY, this.progress);
      this.buildList();
    }
    this.setResult(verdict.ok, verdict.reason);
  }

  private setResult(ok: boolean, reason: string): void {
    this.result.className = `check-result ${ok ? 'is-pass' : 'is-fail'}`;
    this.result.textContent = `${ok ? 'Zaliczone.' : 'Jeszcze nie.'} ${reason}`;
  }
}

function requirementText(c: Challenge): string {
  const parts: string[] = [];
  if (c.require?.colour) parts.push(`kolor ${c.require.colour}`);
  if (c.require?.width !== undefined) parts.push(`grubość ${c.require.width}`);
  return `Wymagania: ${parts.join(', ')}.`;
}
