import { EditorState, StateEffect, StateField, RangeSetBuilder, type Extension, type Range } from '@codemirror/state';
import {
  EditorView,
  Decoration,
  type DecorationSet,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
  keymap,
  lineNumbers,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  GutterMarker,
  gutterLineClass,
  placeholder,
} from '@codemirror/view';
import { history, historyKeymap, defaultKeymap, insertNewlineAndIndent } from '@codemirror/commands';
import { bracketMatching, indentService, indentOnInput, indentUnit } from '@codemirror/language';
import { RangeSet } from '@codemirror/state';
import { classify } from './highlight';

export interface MarkedError {
  message: string;
  line: number;
  column: number;
  kind: 'parse' | 'runtime';
}

// ── Highlighting ───────────────────────────────────────────────────────────────

class SwatchWidget extends WidgetType {
  constructor(readonly color: string) {
    super();
  }
  override eq(other: SwatchWidget) {
    return other.color === this.color;
  }
  toDOM() {
    const el = document.createElement('span');
    el.className = 'cm-swatch';
    el.style.background = this.color;
    el.setAttribute('aria-hidden', 'true');
    return el;
  }
}

function buildHighlight(view: EditorView): DecorationSet {
  const source = view.state.doc.toString();
  const builder = new RangeSetBuilder<Decoration>();
  for (const s of classify(source)) {
    if (s.to <= s.from) continue;
    if (s.color) builder.add(s.from, s.from, Decoration.widget({ widget: new SwatchWidget(s.color), side: -1 }));
    builder.add(s.from, s.to, Decoration.mark({ class: `tok-${s.cls}` }));
  }
  return builder.finish();
}

const highlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = buildHighlight(view);
    }
    update(u: ViewUpdate) {
      if (u.docChanged) this.decorations = buildHighlight(u.view);
    }
  },
  { decorations: (v) => v.decorations },
);

// ── Error marker ───────────────────────────────────────────────────────────────

export const setErrorEffect = StateEffect.define<MarkedError | null>();

class ErrorWidget extends WidgetType {
  constructor(readonly err: MarkedError) {
    super();
  }
  override eq(o: ErrorWidget) {
    return o.err.message === this.err.message && o.err.line === this.err.line && o.err.column === this.err.column && o.err.kind === this.err.kind;
  }
  toDOM() {
    const box = document.createElement('div');
    box.className = `cm-error-note cm-error-${this.err.kind}`;
    box.setAttribute('role', 'note');
    const pos = document.createElement('span');
    pos.className = 'cm-error-pos';
    pos.textContent = `${this.err.kind === 'runtime' ? 'Błąd wykonania' : 'Błąd'} · wiersz ${this.err.line}, kolumna ${this.err.column}`;
    const caret = document.createElement('span');
    caret.className = 'cm-error-caret';
    caret.style.setProperty('--col', String(this.err.column - 1));
    caret.setAttribute('aria-hidden', 'true');
    const msg = document.createElement('span');
    msg.className = 'cm-error-msg';
    msg.textContent = this.err.message;
    box.append(caret, pos, msg);
    return box;
  }
  override ignoreEvent() {
    return false;
  }
}

class ErrorGutterMarker extends GutterMarker {
  override elementClass = 'cm-gutter-error';
}
const errorGutterMarker = new ErrorGutterMarker();

interface ErrorState {
  err: MarkedError | null;
  deco: DecorationSet;
}

function tokenEnd(text: string, start: number): number {
  const rest = text.slice(start);
  const m = /^("[^"\n]*"?|:?[\p{L}\p{M}\p{N}_.]+|<=|>=|<>|.)/u.exec(rest);
  return start + (m ? m[0].length : 1);
}

function errorDecorations(state: EditorState, err: MarkedError | null): DecorationSet {
  if (!err) return Decoration.none;
  const lineNo = Math.min(Math.max(err.line, 1), state.doc.lines);
  const line = state.doc.line(lineNo);
  const start = Math.min(line.from + Math.max(err.column - 1, 0), line.to);
  const end = Math.min(tokenEnd(line.text, start - line.from) + line.from, line.to);
  const ranges: Range<Decoration>[] = [Decoration.line({ class: `cm-error-line` }).range(line.from)];
  if (end > start) ranges.push(Decoration.mark({ class: 'cm-error-token' }).range(start, end));
  else ranges.push(Decoration.widget({ widget: new EofMarker(), side: 1 }).range(start));
  ranges.push(Decoration.widget({ widget: new ErrorWidget({ ...err, line: lineNo }), block: true, side: 1 }).range(line.to));
  return Decoration.set(ranges, true);
}

class EofMarker extends WidgetType {
  toDOM() {
    const el = document.createElement('span');
    el.className = 'cm-error-eof';
    el.setAttribute('aria-hidden', 'true');
    return el;
  }
}

const errorField = StateField.define<ErrorState>({
  create: () => ({ err: null, deco: Decoration.none }),
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setErrorEffect)) return { err: e.value, deco: errorDecorations(tr.state, e.value) };
    }
    if (tr.docChanged && value.err) return { err: null, deco: Decoration.none };
    return value;
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.deco),
});

const errorGutter = gutterLineClass.compute([errorField], (state) => {
  const v = state.field(errorField);
  if (!v.err) return RangeSet.empty;
  const lineNo = Math.min(Math.max(v.err.line, 1), state.doc.lines);
  return RangeSet.of([errorGutterMarker.range(state.doc.line(lineNo).from)]);
});

// ── Executing line ─────────────────────────────────────────────────────────────

export const setExecEffect = StateEffect.define<{ line: number; column: number; length: number } | null>();

const execField = StateField.define<DecorationSet>({
  create: () => Decoration.none,
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setExecEffect)) {
        if (!e.value) return Decoration.none;
        const lineNo = Math.min(Math.max(e.value.line, 1), tr.state.doc.lines);
        const line = tr.state.doc.line(lineNo);
        const from = Math.min(line.from + e.value.column - 1, line.to);
        const to = Math.min(from + e.value.length, line.to);
        const ranges: Range<Decoration>[] = [Decoration.line({ class: 'cm-exec-line' }).range(line.from)];
        if (to > from) ranges.push(Decoration.mark({ class: 'cm-exec-token' }).range(from, to));
        return Decoration.set(ranges, true);
      }
    }
    if (tr.docChanged) return Decoration.none;
    return value;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// ── Indentation ────────────────────────────────────────────────────────────────

const CLOSES = /^\s*(\]|już|juz|end)(\s|;|$)/i;

/** Indents two spaces inside brackets and procedure bodies; `]` and `już` step back out. */
const logoIndent = indentService.of((ctx, pos) => {
  const lineNo = ctx.state.doc.lineAt(pos).number;
  let base = 0;
  let opens = false;
  for (let n = lineNo - 1; n >= 1; n--) {
    const l = ctx.state.doc.line(n);
    if (l.text.trim() === '') continue;
    const code = l.text.replace(/;.*$/, '');
    base = /^\s*/.exec(l.text)![0].length;
    const balance = (code.match(/\[/g) || []).length - (code.match(/\]/g) || []).length;
    opens = balance > 0 || /^\s*(oto|to)\s/i.test(code);
    break;
  }
  let indent = base + (opens ? 2 : 0);
  if (CLOSES.test(ctx.textAfterPos(pos))) indent -= 2;
  return Math.max(0, indent);
});

const logoLanguageData = EditorState.languageData.of(() => [{ indentOnInput: /^\s*(\]|już|juz|end)$/i, commentTokens: { line: ';' } }]);

// ── Theme hooks (colours come from CSS custom properties) ─────────────────────

const baseTheme = EditorView.theme({
  '&': { height: '100%' },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6' },
  '.cm-content': { padding: '10px 0 40vh' },
});

export interface EditorOptions {
  parent: HTMLElement;
  doc: string;
  label: string;
  onChange: (doc: string) => void;
}

export function editorExtensions(label: string, onChange: (doc: string) => void): Extension[] {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    history(),
    drawSelection(),
    bracketMatching(),
    indentUnit.of('  '),
    EditorState.tabSize.of(2),
    logoIndent,
    logoLanguageData,
    indentOnInput(),
    keymap.of([{ key: 'Enter', run: insertNewlineAndIndent }, ...defaultKeymap, ...historyKeymap]),
    placeholder('Napisz program, na przykład:  powtorz 4 [np 100 pw 90]\nPotem naciśnij Uruchom.'),
    highlighter,
    errorField,
    errorGutter,
    execField,
    baseTheme,
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({ 'aria-label': label, tabindex: '0', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off', translate: 'no' }),
    EditorView.updateListener.of((u) => {
      if (u.docChanged) onChange(u.state.doc.toString());
    }),
  ];
}

/** CodeMirror wrapper. Each buffer (2D draft, 3D draft, each task) keeps its own EditorState. */
export class LogoEditor {
  view: EditorView;
  private states = new Map<string, EditorState>();
  private currentKey = '';
  private changeHandler: (doc: string, key: string) => void;
  private suppress = false;

  constructor(parent: HTMLElement, onChange: (doc: string, key: string) => void) {
    this.changeHandler = onChange;
    this.view = new EditorView({ parent, state: this.makeState('') });
  }

  private makeState(doc: string): EditorState {
    return EditorState.create({
      doc,
      extensions: editorExtensions('Program w języku Logo', (d) => {
        if (!this.suppress) this.changeHandler(d, this.currentKey);
      }),
    });
  }

  get key(): string {
    return this.currentKey;
  }

  /** Switches to a buffer, creating it from `initial` the first time. */
  open(key: string, initial: () => string): void {
    if (key === this.currentKey) return;
    if (this.currentKey) this.states.set(this.currentKey, this.view.state);
    let st = this.states.get(key);
    if (!st) st = this.makeState(initial());
    this.currentKey = key;
    this.view.setState(st);
  }

  get value(): string {
    return this.view.state.doc.toString();
  }

  /** Replaces the whole buffer as one undoable edit, like a paste. */
  replaceAll(text: string): void {
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: text },
      selection: { anchor: 0 },
      userEvent: 'input.paste',
      scrollIntoView: true,
    });
  }

  setError(err: MarkedError | null): void {
    this.view.dispatch({ effects: setErrorEffect.of(err) });
  }

  get error(): MarkedError | null {
    return this.view.state.field(errorField).err;
  }

  setExec(pos: { line: number; column: number; length: number } | null, reveal = false): void {
    const effects: StateEffect<unknown>[] = [setExecEffect.of(pos)];
    if (pos && reveal) {
      const lineNo = Math.min(Math.max(pos.line, 1), this.view.state.doc.lines);
      const line = this.view.state.doc.line(lineNo);
      effects.push(EditorView.scrollIntoView(line.from, { y: 'nearest' }));
    }
    this.view.dispatch({ effects });
  }

  reveal(line: number, column: number, focus = true): void {
    const lineNo = Math.min(Math.max(line, 1), this.view.state.doc.lines);
    const l = this.view.state.doc.line(lineNo);
    const at = Math.min(l.from + column - 1, l.to);
    this.view.dispatch({ selection: { anchor: at }, effects: EditorView.scrollIntoView(at, { y: 'center' }) });
    if (focus) this.view.focus();
  }

  focus(): void {
    this.view.focus();
  }
}
