export type Child = Node | string | number | null | undefined | false | Child[];

type Handler = (ev: never) => void;
export type Props = Record<string, string | number | boolean | null | undefined | Handler | Partial<CSSStyleDeclaration>>;

function append(el: Node, child: Child): void {
  if (child === null || child === undefined || child === false) return;
  if (Array.isArray(child)) {
    for (const c of child) append(el, c);
    return;
  }
  el.appendChild(typeof child === 'object' ? child : document.createTextNode(String(child)));
}

/** Tiny element factory: h('button', { class: 'btn', onclick }, 'Uruchom'). */
export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Props | null = null, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) {
    for (const [key, value] of Object.entries(props)) {
      if (value === null || value === undefined || value === false) continue;
      if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (key === 'class') {
        el.className = String(value);
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (value === true) {
        el.setAttribute(key, '');
      } else {
        el.setAttribute(key, String(value));
      }
    }
  }
  append(el, children);
  return el;
}

const SVG_NS = 'http://www.w3.org/2000/svg';

/** An authored 20×20 line icon. `paths` use the shared stroke style unless they set fill. */
export function icon(name: keyof typeof ICONS, cls = ''): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('class', `icon ${cls}`.trim());
  svg.innerHTML = ICONS[name];
  return svg;
}

const S = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"';

export const ICONS = {
  play: `<path d="M6 4.2v11.6a.6.6 0 0 0 .9.5l9.2-5.8a.6.6 0 0 0 0-1L6.9 3.7a.6.6 0 0 0-.9.5Z" fill="currentColor"/>`,
  step: `<path ${S} d="M4.5 5v10"/><path d="M8 5.2v9.6a.6.6 0 0 0 .9.5l7.2-4.8a.6.6 0 0 0 0-1L8.9 4.7a.6.6 0 0 0-.9.5Z" fill="currentColor"/>`,
  pause: `<rect x="5" y="4" width="3.4" height="12" rx=".8" fill="currentColor"/><rect x="11.6" y="4" width="3.4" height="12" rx=".8" fill="currentColor"/>`,
  reset: `<path ${S} d="M4.2 10a5.8 5.8 0 1 0 1.9-4.3"/><path ${S} d="M4 3.6v3.6h3.6"/>`,
  zoomIn: `<path ${S} d="M10 4.5v11M4.5 10h11"/>`,
  zoomOut: `<path ${S} d="M4.5 10h11"/>`,
  fit: `<path ${S} d="M3.5 7.5v-4h4M12.5 3.5h4v4M16.5 12.5v4h-4M7.5 16.5h-4v-4"/>`,
  camera: `<circle ${S} cx="10" cy="10" r="6.2"/><path ${S} d="M10 1.8v3.4M10 14.8v3.4M1.8 10h3.4M14.8 10h3.4"/><circle cx="10" cy="10" r="1.6" fill="currentColor"/>`,
  file: `<path ${S} d="M5 2.8h6.5L15.5 7v10.2H5Z"/><path ${S} d="M11.3 2.8V7h4.2"/>`,
  download: `<path ${S} d="M10 3.5v9M6.2 8.8 10 12.6l3.8-3.8M4 16.5h12"/>`,
  upload: `<path ${S} d="M10 12.5v-9M6.2 7.2 10 3.4l3.8 3.8M4 16.5h12"/>`,
  image: `<rect ${S} x="3" y="4" width="14" height="12" rx="1.5"/><path ${S} d="m3.5 14 4.2-4.2 3.3 3.3 2-2 3.5 3.4"/><circle cx="13" cy="7.8" r="1.3" fill="currentColor"/>`,
  link: `<path ${S} d="M8.6 11.4a3.2 3.2 0 0 0 4.5 0l2.6-2.6a3.2 3.2 0 0 0-4.5-4.5l-1 1"/><path ${S} d="M11.4 8.6a3.2 3.2 0 0 0-4.5 0l-2.6 2.6a3.2 3.2 0 0 0 4.5 4.5l1-1"/>`,
  sun: `<circle ${S} cx="10" cy="10" r="3.4"/><path ${S} d="M10 2.2v1.8M10 16v1.8M2.2 10H4M16 10h1.8M4.5 4.5l1.3 1.3M14.2 14.2l1.3 1.3M4.5 15.5l1.3-1.3M14.2 5.8l1.3-1.3"/>`,
  moon: `<path ${S} d="M15.8 12.4A6.4 6.4 0 0 1 7.6 4.2a6.4 6.4 0 1 0 8.2 8.2Z"/>`,
  system: `<circle ${S} cx="10" cy="10" r="6.5"/><path d="M10 3.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor"/>`,
  chevronDown: `<path ${S} d="m5.5 8 4.5 4.5L14.5 8"/>`,
  check: `<path ${S} d="m4.5 10.5 3.6 3.5 7.4-8"/>`,
  close: `<path ${S} d="m5.5 5.5 9 9M14.5 5.5l-9 9"/>`,
  more: `<circle cx="4.5" cy="10" r="1.5" fill="currentColor"/><circle cx="10" cy="10" r="1.5" fill="currentColor"/><circle cx="15.5" cy="10" r="1.5" fill="currentColor"/>`,
  keyboard: `<rect ${S} x="2.5" y="5" width="15" height="10" rx="1.5"/><path ${S} d="M5.5 8h1M9.5 8h1M13.5 8h1M5.5 12h9"/>`,
  undo: `<path ${S} d="M7 5.5 3.5 9 7 12.5"/><path ${S} d="M3.8 9h8.2a4.5 4.5 0 0 1 0 9h-2"/>`,
  newFile: `<path ${S} d="M5 2.8h6.5L15.5 7v10.2H5Z"/><path ${S} d="M10.2 9.5v5M7.7 12h5"/>`,
  arrowRight: `<path ${S} d="M4 10h11.5M11 5.5l4.5 4.5-4.5 4.5"/>`,
  arrowLeft: `<path ${S} d="M16 10H4.5M9 5.5 4.5 10 9 14.5"/>`,
  warning: `<path ${S} d="M10 3.2 17.6 16.4H2.4Z"/><path ${S} d="M10 8.2v3.6"/><circle cx="10" cy="14" r="1" fill="currentColor"/>`,
  turtle: `<path d="M10 2.5 15.6 16.2 10 13.1 4.4 16.2Z" fill="currentColor"/>`,
  task: `<rect ${S} x="3.5" y="3.5" width="13" height="13" rx="1.5"/><path ${S} d="m6.8 10.2 2.3 2.3 4.3-4.8"/>`,
} as const;

export function kbd(...keys: string[]): HTMLElement {
  const wrap = h('span', { class: 'kbd-group' });
  keys.forEach((k, i) => {
    if (i) wrap.append(h('span', { class: 'kbd-plus', 'aria-hidden': 'true' }, '+'));
    wrap.append(h('kbd', null, k));
  });
  return wrap;
}

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const MOD = isMac ? '⌘' : 'Ctrl';

let uid = 0;
export function nextId(prefix: string): string {
  return `${prefix}-${++uid}`;
}
