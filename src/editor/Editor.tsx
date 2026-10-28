import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { SourceSpan } from '../lang/errors';
import { highlight, type LineRange } from './highlight';

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
/** Long programs only get the lines around the visible part highlighted. */
const WINDOWED_FROM = 300;
const MARGIN = 80;

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

/** Typing the last letter of "już" (or "juz") alone on an indented line moves it back to the start. */
function dedentEnd(ta: HTMLTextAreaElement, e: InputEvent): void {
  if (e.inputType !== 'insertText' || ta.selectionStart !== ta.selectionEnd) return;
  const text = ta.value;
  const pos = ta.selectionStart;
  const start = lineStartOf(text, pos);
  const nl = text.indexOf('\n', pos);
  const line = text.slice(start, nl < 0 ? text.length : nl);
  const m = /^([ \t]+)(już|juz)$/i.exec(line);
  if (!m || pos !== start + line.length) return;
  ta.setSelectionRange(start, start + m[1].length);
  insertText(ta, '');
  const caret = start + m[2].length;
  ta.setSelectionRange(caret, caret);
}

let measureCtx: CanvasRenderingContext2D | null = null;

/** Horizontal position of a text offset inside the textarea (monospaced font, tabs of 2). */
function offsetX(ta: HTMLTextAreaElement, offset: number): number {
  const cs = getComputedStyle(ta);
  measureCtx ??= document.createElement('canvas').getContext('2d');
  let charW = 8.7;
  if (measureCtx) {
    measureCtx.font = `${cs.fontSize} ${cs.fontFamily}`;
    charW = measureCtx.measureText('0000000000').width / 10 || charW;
  }
  const text = ta.value;
  let col = 0;
  for (let i = lineStartOf(text, offset); i < offset; i++) col = text[i] === '\t' ? col + 2 - (col % 2) : col + 1;
  return (parseFloat(cs.paddingLeft) || 0) + col * charW;
}

/** Scrolls the textarea sideways so that x (in content coordinates) is visible. */
function revealX(ta: HTMLTextAreaElement, x: number, width = 0): void {
  if (x < ta.scrollLeft + 8 || x + width > ta.scrollLeft + ta.clientWidth - 8) {
    ta.scrollLeft = Math.max(0, x - ta.clientWidth / 3);
  }
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
  const lineCount = useMemo(() => {
    let n = 1;
    for (let i = 0; i < value.length; i++) if (value.charCodeAt(i) === 10) n++;
    return n;
  }, [value]);
  const windowed = lineCount > WINDOWED_FROM;
  const [win, setWin] = useState<LineRange>({ first: 1, last: 2 * MARGIN });
  const html = useMemo(
    () => highlight(value, errorOffset, windowed ? win : undefined),
    [value, errorOffset, windowed, win.first, win.last],
  );
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
    // Read the live text: this runs from a handle created on mount.
    const text = ta.value;
    let line = 1;
    for (let i = 0; i < offset && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
    const { lh, padTop } = metrics();
    const top = padTop + (line - 1) * lh;
    if (top < ta.scrollTop + lh || top + 2 * lh > ta.scrollTop + ta.clientHeight) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 2);
    }
    revealX(ta, offsetX(ta, offset), 24);
  };

  const syncScroll = () => {
    const ta = taRef.current;
    if (!ta) return;
    if (layerRef.current) layerRef.current.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
    if (gutterRef.current) gutterRef.current.style.transform = `translateY(${-ta.scrollTop}px)`;
    placeBubbleRef.current();
    if (windowed) {
      const { lh, padTop } = metrics();
      const firstVisible = Math.max(1, Math.floor((ta.scrollTop - padTop) / lh) + 1);
      const lastVisible = firstVisible + Math.ceil(ta.clientHeight / lh) + 1;
      if (firstVisible < win.first || lastVisible > win.last) {
        setWin({ first: Math.max(1, firstVisible - MARGIN), last: lastVisible + MARGIN });
      }
    }
  };

  // Re-check the highlighted window when the text changes (e.g. a long paste).
  useLayoutEffect(() => {
    if (windowed) syncScroll();
  }, [value, windowed]);

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
    if (props.follow) {
      const ta = taRef.current!;
      if (exec.line !== lastFollowLine.current) {
        lastFollowLine.current = exec.line;
        if (top < ta.scrollTop || top + lh > ta.scrollTop + ta.clientHeight) {
          ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
        }
      }
      if (el) revealX(ta, el.offsetLeft, el.offsetWidth);
      else revealX(ta, offsetX(ta, exec.offset), 24);
      syncScroll();
    }
  }, [exec, html, props.follow]);

  // Position the error bubble under the offending token (again after every scroll).
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  useEffect(() => setBubbleDismissed(false), [error]);
  const placeBubble = () => {
    const bubble = bubbleRef.current;
    const ta = taRef.current;
    if (!bubble || !ta) return;
    if (!error || !props.errorBubble || bubbleDismissed) {
      bubble.hidden = true;
      return;
    }
    const { lh, padTop } = metrics();
    const el = tokenEl(error.offset);
    const anchor = el ? el.offsetLeft + Math.min(el.offsetWidth, 24) / 2 : offsetX(ta, error.offset) + 6;
    const top = el ? el.offsetTop + lh : padTop + error.line * lh;
    bubble.hidden = false;
    bubble.style.maxWidth = `${Math.max(160, Math.min(ta.clientWidth - 16, 480))}px`;
    // Keep the bubble inside the visible part of the editor; the arrow still points at the token.
    const width = bubble.offsetWidth;
    const minLeft = ta.scrollLeft + 4;
    const maxLeft = Math.max(minLeft, ta.scrollLeft + ta.clientWidth - width - 8);
    const left = Math.max(minLeft, Math.min(anchor - 18, maxLeft));
    bubble.style.left = `${left}px`;
    // Flip above the line when there is no room below it.
    const tokenTop = top - lh;
    const below = top + 2 + bubble.offsetHeight <= ta.scrollTop + ta.clientHeight || tokenTop - bubble.offsetHeight - 8 < ta.scrollTop;
    bubble.classList.toggle('error-bubble-above', !below);
    bubble.style.top = below ? `${top + 2}px` : `${tokenTop - bubble.offsetHeight - 6}px`;
    const arrow = anchor - left - 6;
    bubble.classList.toggle('error-bubble-far', arrow < 0 || arrow > width);
    bubble.style.setProperty('--arrow-x', `${Math.max(8, Math.min(width - 20, arrow))}px`);
  };
  const placeBubbleRef = useRef(placeBubble);
  placeBubbleRef.current = placeBubble;
  useLayoutEffect(placeBubble, [error, html, props.errorBubble, bubbleDismissed]);

  const onKeyDown = (e: KeyboardEvent) => {
    const ta = taRef.current!;
    if (e.key === 'Escape') {
      tabTrapReleased.current = true;
      setBubbleDismissed(true);
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
          onInput={(e) => {
            const ta = e.currentTarget as HTMLTextAreaElement;
            dedentEnd(ta, e as InputEvent);
            props.onChange(ta.value);
          }}
          onScroll={syncScroll}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
