export type Child = Node | string | number | false | null | undefined;

type Listeners = { [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void };

export interface Props {
  class?: string;
  text?: string;
  on?: Listeners;
  [attr: string]: unknown;
}

/** Small DOM builder: `el('button', { class: 'btn', on: { click } }, 'Uruchom')`. */
export function el<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props = {}, ...children: Child[]): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'class') node.className = String(value);
    else if (key === 'text') node.textContent = String(value);
    else if (key === 'on') {
      for (const [type, fn] of Object.entries(value as Record<string, EventListener>)) {
        node.addEventListener(type, fn);
      }
    } else if (key === 'value' && 'value' in node) (node as HTMLInputElement).value = String(value);
    else node.setAttribute(key, value === true ? '' : String(value));
  }
  for (const child of children) {
    if (child === false || child === null || child === undefined) continue;
    node.append(typeof child === 'string' || typeof child === 'number' ? String(child) : child);
  }
  return node;
}

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Triggers a file download for a Blob or a string. */
export function download(filename: string, content: Blob | string, type = 'text/plain;charset=utf-8'): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = el('a', { href: url, download: filename, hidden: true });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
