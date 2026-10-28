import { aliases, type LogoError } from './interpreter';
export const escapeHTML = (s: string) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
export function highlight(source: string) {
  const pattern = /(;[^\n]*|"[^"\n]*"|(?:\d+(?:\.\d+)?|\.\d+)|[\p{L}_][\p{L}\p{N}_]*|[\[\]()]|[+\-*/<>=:,])/gu;
  let result = '', start = 0;
  for (const match of source.matchAll(pattern)) {
    result += escapeHTML(source.slice(start, match.index));
    const v = match[0], type = v.startsWith(';') ? 'comment' : v.startsWith('"') ? 'string' : /^[\d.]/u.test(v) ? 'number' : aliases[v.toLocaleLowerCase('pl')] ? 'command' : /^[\[\]()]/u.test(v) ? 'bracket' : /^[+\-*/<>=:,]/u.test(v) ? 'operator' : 'name';
    result += `<span class="tok-${type}">${escapeHTML(v)}</span>`; start = match.index + v.length;
  }
  return result + escapeHTML(source.slice(start));
}
export class Editor {
  error: LogoError | null = null;
  activeLine: number | null = null;
  onChange?: () => void;
  onCursor?: (line: number, column: number) => void;
  constructor(public input: HTMLTextAreaElement, private pre: HTMLElement, private gutter: HTMLElement) {
    input.addEventListener('input', () => { this.error = null; this.activeLine = null; this.render(); this.onChange?.(); this.cursor(); });
    input.addEventListener('scroll', () => this.sync());
    input.addEventListener('click', () => this.cursor()); input.addEventListener('keyup', () => this.cursor());
    input.addEventListener('keydown', e => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault(); const start = input.selectionStart, end = input.selectionEnd;
        input.setRangeText('  ', start, end, 'end'); input.dispatchEvent(new Event('input')); this.sync();
      }
    });
  }
  get value() { return this.input.value; }
  set value(value: string) { this.input.value = value; this.error = null; this.activeLine = null; this.render(); this.cursor(); }
  private sync() { this.pre.scrollTop = this.input.scrollTop; this.pre.scrollLeft = this.input.scrollLeft; this.gutter.scrollTop = this.input.scrollTop; }
  private cursor() {
    const before = this.value.slice(0, this.input.selectionStart), parts = before.split('\n'); this.onCursor?.(parts.length, parts.at(-1)!.length + 1);
  }
  render() {
    const lines = this.value.split('\n');
    this.pre.innerHTML = lines.map((line, i) => `<div class="code-line${i + 1 === this.activeLine ? ' executing' : ''}${i + 1 === this.error?.line ? ' has-error' : ''}">${highlight(line) || ' '}${i + 1 === this.error?.line ? `<span class="error-pin" style="left:calc(${Math.max(0, this.error.column - 1)}ch + 18px)" title="${escapeHTML(this.error.message)}" aria-hidden="true"></span><span class="inline-error-text"> ← ${escapeHTML(this.error.message)}</span>` : ''}</div>`).join('');
    this.gutter.innerHTML = lines.map((_, i) => `<div class="${i + 1 === this.error?.line ? 'error-number' : i + 1 === this.activeLine ? 'active-number' : ''}">${i + 1}</div>`).join('');
    this.input.setAttribute('aria-invalid', String(!!this.error)); this.sync();
  }
  mark(error: LogoError | null, line: number | null) {
    this.error = error; this.activeLine = line; this.render();
    const target = error?.line || line;
    if (target) { const y = (target - 1) * 27; if (y < this.input.scrollTop || y > this.input.scrollTop + this.input.clientHeight - 60) this.input.scrollTop = Math.max(0, y - 54); this.sync(); }
  }
  focusError() {
    if (!this.error) return;
    const offset = this.value.split('\n').slice(0, this.error.line - 1).reduce((sum, l) => sum + l.length + 1, 0) + this.error.column - 1;
    this.input.focus(); this.input.setSelectionRange(offset, offset + 1);
  }
}
