type Child = Node | string | null | undefined | false;
type Props = Record<string, unknown>;

/** Tiny hyperscript helper. */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Props | null = null,
  ...children: (Child | Child[])[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className = String(v);
      else if (k === 'text') el.textContent = String(v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      else if (k === 'dataset') Object.assign(el.dataset, v as object);
      else if (k in el && k !== 'list' && k !== 'form') (el as unknown as Record<string, unknown>)[k] = v;
      else el.setAttribute(k, v === true ? '' : String(v));
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.append(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

export function svgIcon(path: string, size = 18): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', path);
  svg.append(p);
  return svg;
}

export const ICONS = {
  play: 'M6 4l14 8-14 8z',
  step: 'M5 4l10 8-10 8zM19 4v16',
  pause: 'M8 4v16M16 4v16',
  stop: 'M6 6h12v12H6z',
  reset: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  fit: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  share: 'M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5',
  download: 'M12 3v12M7 10l5 5 5-5M5 21h14',
  upload: 'M12 15V3M7 8l5-5 5 5M5 21h14',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01',
  help: 'M9 9a3 3 0 1 1 4 2.8c-.7.4-1 1-1 1.7M12 17h.01',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  moon: 'M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z',
  auto: 'M12 3a9 9 0 1 0 0 18zM12 3v18',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  check: 'M5 13l4 4L19 7',
  copy: 'M9 9h11v11H9zM5 15V4h11',
} as const;

export function iconButton(label: string, icon: string, onClick: () => void, extra: Props = {}): HTMLButtonElement {
  return h('button', { type: 'button', class: 'icon-btn', 'aria-label': label, title: label, onClick, ...extra }, svgIcon(icon));
}

let liveEl: HTMLElement | null = null;
/** Announces a message to screen readers and shows a brief toast. */
export function announce(msg: string, toast = true): void {
  if (!liveEl) liveEl = document.getElementById('live');
  if (liveEl) {
    liveEl.textContent = '';
    setTimeout(() => { if (liveEl) liveEl.textContent = msg; }, 20);
  }
  if (toast) showToast(msg);
}

let toastTimer = 0;
function showToast(msg: string): void {
  let t = document.getElementById('toast');
  if (!t) {
    t = h('div', { id: 'toast', class: 'toast', 'aria-hidden': 'true' });
    document.body.append(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t!.classList.remove('show'), 2600);
}

export function debounce<T extends unknown[]>(fn: (...a: T) => void, ms: number): (...a: T) => void {
  let id = 0;
  return (...a: T) => {
    clearTimeout(id);
    id = window.setTimeout(() => fn(...a), ms);
  };
}
