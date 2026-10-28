/** Small helpers for building DOM without string-concatenated HTML. */

type Child = Node | string | null | undefined | false;
type Listener = (event: Event) => void;

export interface Props {
  class?: string;
  id?: string;
  on?: Partial<Record<string, Listener>>;
  [attr: string]: string | number | boolean | null | undefined | Partial<Record<string, Listener>>;
}

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === false) continue;
    if (key === 'on') {
      for (const [type, listener] of Object.entries(value as Record<string, Listener>)) {
        node.addEventListener(type, listener);
      }
    } else if (key === 'class') {
      node.className = String(value);
    } else if (key === 'value' && 'value' in node) {
      (node as unknown as HTMLInputElement).value = String(value);
    } else if (value === true) {
      node.setAttribute(key, '');
    } else {
      node.setAttribute(key, String(value));
    }
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

export function clear(node: Element): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}
