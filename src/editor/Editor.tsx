import { useEffect, useLayoutEffect, useMemo, useRef } from 'preact/hooks';
import type { SourceSpan } from '../lang/errors';
import { highlight } from './highlight';

export interface EditorError {
  message: string;
  line: number;
  column: number;
  offset: number;
  end: number;
}

export interface EditorHandle {
  focus(): void;
  /** Moves the caret to a position and scrolls it into view. */
  reveal(offset: number, end?: number): void;
  textarea(): HTMLTextAreaElement | null;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  error: EditorError | null;
  /** Show the error message in a bubble under the token (after running). */
  errorBubble: boolean;
  exec: SourceSpan | null;
  /** Keep the executing line in view (while stepping or animating slowly). */
  follow: boolean;
  label: string;
  describedBy?: string;
  handleRef?: (h: EditorHandle | null) => void;
}

const INDENT = '  ';

function insertText(ta: HTMLTextAreaElement, text: string): void {
  ta.focus();
  // execCommand keeps the native undo history; fall back when unsupported.
  let ok = false;
  try {
    ok = document.execCommand('insertText', false, text);
  } catch {
    ok = false;
  }
  if (!ok) {
    ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function lineStartOf(text: string, pos: number): number {
  return text.lastIndexOf('\n', pos - 1) + 1;
}

export function Editor(props: Props) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const gutterExecRef = useRef<HTMLDivElement>(null);
  const tabTrapReleased = useRef(false);
  const lastFollowLine = useRef(-1);

  const { value, error, exec } = props;
  const errorOffset = error ? error.offset : null;
  const html = useMemo(() => highlight(value, errorOffset), [value, errorOffset]);
  const lineCount = useMemo(() => {
    let n = 1;
    for (let i = 0; i < value.length; i++) if (value.charCodeAt(i) === 10) n++;
    return n;
  }, [value]);
  const numbers = useMemo(() => {
    let s = '';
    for (let i = 1; i <= lineCount; i++) s += i + '\n';
    return s;
  }, [lineCount]);

  // Keep the textarea in sync when the value is replaced from outside.
  useLayoutEffect(() => {
    const ta = taRef.current;
    if (ta && ta.value !== value) ta.value = value;
  }, [value]);

  useEffect(() => {
    props.handleRef?.({
      focus: () => taRef.current?.focus(),
      reveal: (offset: number, end?: number) => {
        const ta = taRef.current;
        if (!ta) return;
        ta.focus();
        ta.setSelectionRange(offset, end ?? offset);
        scrollToOffset(offset);
      },
      textarea: () => taRef.current,
    });
    return () => props.handleRef?.(null);
  }, []);

  const metrics = () => {
    const ta = taRef.current!;
    const cs = getComputedStyle(ta);
    return { lh: parseFloat(cs.lineHeight) || 22, padTop: parseFloat(cs.paddingTop) || 0 };
  };

  const scrollToOffset = (offset: number) => {
    const ta = taRef.current;
    if (!ta) return;
    const line = value.slice(0, offset).split('\n').length;
    const { lh, padTop } = metrics();
    const top = padTop + (line - 1) * lh;
    if (top < ta.scrollTop + lh || top + 2 * lh > ta.scrollTop + ta.clientHeight) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 2);
    }
  };

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (layerRef.current) layerRef.current.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    if (gutterRef.current) gutterRef.current.style.transform = `translateY(${-ta.scrollTop}px)`;
  };

  const tokenEl = (offset: number): HTMLElement | null =>
    preRef.current?.querySelector<HTMLElement>(`[data-o="${offset}"]`) ?? null;

  // Position the execution highlight (line band, token box and gutter arrow).
  useLayoutEffect(() => {
    const band = bandRef.current;
    const box = boxRef.current;
    const garrow = gutterExecRef.current;
    if (!band || !box || !garrow) return;
    if (!exec) {
      band.hidden = true;
      box.hidden = true;
      garrow.hidden = true;
      lastFollowLine.current = -1;
      return;
    }
    const { lh, padTop } = metrics();
    const top = padTop + (exec.line - 1) * lh;
    band.hidden = false;
    band.style.top = `${top}px`;
    band.style.height = `${lh}px`;
    garrow.hidden = false;
    garrow.style.top = `${top}px`;
    garrow.style.height = `${lh}px`;
    const el = tokenEl(exec.offset);
    if (el) {
      box.hidden = false;
      box.style.left = `${el.offsetLeft - 2}px`;
      box.style.top = `${el.offsetTop}px`;
      box.style.width = `${el.offsetWidth + 4}px`;
      box.style.height = `${lh}px`;
    } else {
      box.hidden = true;
    }
    if (props.follow && exec.line !== lastFollowLine.current) {
      lastFollowLine.current = exec.line;
      const ta = taRef.current!;
      if (top < ta.scrollTop || top + lh > ta.scrollTop + ta.clientHeight) {
        ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
        syncScroll();
      }
    }
  }, [exec, html, props.follow]);

  // Position the error bubble under the offending token.
  useLayoutEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    if (!error || !props.errorBubble) {
      bubble.hidden = true;
      return;
    }
    const { lh, padTop } = metrics();
    const el = tokenEl(error.offset);
    const left = el ? el.offsetLeft : 14;
    const top = el ? el.offsetTop + lh : padTop + error.line * lh;
    bubble.hidden = false;
    bubble.style.left = `${Math.max(4, left - 6)}px`;
    bubble.style.top = `${top + 2}px`;
  }, [error, html, props.errorBubble]);

  const onKeyDown = (e: KeyboardEvent) => {
    const ta = taRef.current!;
    if (e.key === 'Escape') {
      tabTrapReleased.current = true;
      return;
    }
    if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (tabTrapReleased.current) {
        tabTrapReleased.current = false;
        return; // let the browser move focus
      }
      e.preventDefault();
      const text = ta.value;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const multi = text.slice(s, en).includes('\n');
      if (!multi && !e.shiftKey) {
        insertText(ta, INDENT);
        return;
      }
      // Indent or outdent every selected line.
      const start = lineStartOf(text, s);
      const block = text.slice(start, en);
      const lines = block.split('\n');
      const changed = lines.map((l) => (e.shiftKey ? l.replace(/^( {1,2}|\t)/, '') : l.length ? INDENT + l : l)).join('\n');
      ta.setSelectionRange(start, en);
      insertText(ta, changed);
      ta.setSelectionRange(start, start + changed.length);
      return;
    }
    tabTrapReleased.current = false;
    if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      const text = ta.value;
      const s = ta.selectionStart;
      const start = lineStartOf(text, s);
      const line = text.slice(start, s);
      let indent = /^[ \t]*/.exec(line)![0];
      if (/\[\s*(;.*)?$/.test(line)) indent += INDENT;
      else if (/^\s*(oto|to)\s/i.test(line)) indent += INDENT;
      e.preventDefault();
      insertText(ta, '\n' + indent);
      return;
    }
    if (e.key === ']' && !e.ctrlKey && !e.metaKey) {
      // Typing "]" on an otherwise blank line dedents it.
      const text = ta.value;
      const s = ta.selectionStart;
      if (s === ta.selectionEnd) {
        const start = lineStartOf(text, s);
        const before = text.slice(start, s);
        if (before.length >= 2 && /^[ \t]+$/.test(before)) {
          e.preventDefault();
          ta.setSelectionRange(s - Math.min(2, before.length), s);
          insertText(ta, ']');
        }
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === '/' || e.code === 'Slash')) {
      e.preventDefault();
      const text = ta.value;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      const start = lineStartOf(text, s);
      let end = text.indexOf('\n', en > s && text[en - 1] === '\n' ? en - 1 : en);
      if (end < 0) end = text.length;
      const lines = text.slice(start, end).split('\n');
      const allCommented = lines.every((l) => !l.trim() || /^\s*;/.test(l));
      const changed = lines
        .map((l) => (allCommented ? l.replace(/^(\s*); ?/, '$1') : l.trim() ? l.replace(/^(\s*)/, '$1; ') : l))
        .join('\n');
      ta.setSelectionRange(start, end);
      insertText(ta, changed);
      ta.setSelectionRange(start, start + changed.length);
    }
  };

  return (
    <div class="editor" style={{ '--digits': String(String(lineCount).length) }}>
      <div class="editor-gutter" aria-hidden="true">
        <div class="editor-gutter-inner" ref={gutterRef}>
          <pre class="editor-numbers">{numbers}</pre>
          <div class="gutter-exec" ref={gutterExecRef} hidden />
          {error && (
            <div
              class="gutter-error"
              style={{ top: `calc(var(--ed-pad) + ${error.line - 1} * var(--ed-lh))` }}
              title={error.message}
            />
          )}
        </div>
      </div>
      <div class="editor-main">
        <div class="editor-layer" ref={layerRef} aria-hidden="true">
          <div class="exec-band" ref={bandRef} hidden />
          <div class="exec-box" ref={boxRef} hidden />
          <pre class="editor-highlight"><code ref={preRef} dangerouslySetInnerHTML={{ __html: html }} /></pre>
          <div class="error-bubble" ref={bubbleRef} hidden>
            <strong>Linia {error?.line}, kolumna {error?.column}:</strong> {error?.message}
          </div>
        </div>
        <textarea
          ref={taRef}
          class="editor-input"
          spellcheck={false}
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          wrap="off"
          aria-label={props.label}
          aria-describedby={props.describedBy}
          aria-invalid={error ? 'true' : 'false'}
          defaultValue={value}
          onInput={(e) => props.onChange((e.currentTarget as HTMLTextAreaElement).value)}
          onScroll={syncScroll}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
