import { h } from './dom';
import { icon, type IconName } from './icons';

let region: HTMLElement | null = null;

function ensureRegion() {
  if (!region) {
    region = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(region);
  }
  return region;
}

export interface ToastOptions {
  tone?: 'info' | 'ok' | 'error';
  action?: { label: string; run: () => void };
  icon?: IconName;
  timeout?: number;
}

/** Short, non-blocking message at the bottom; an optional action undoes or follows up. */
export function toast(message: string, opts: ToastOptions = {}) {
  const r = ensureRegion();
  const el = h('div', { class: `toast toast-${opts.tone ?? 'info'}` });
  if (opts.icon) el.append(icon(opts.icon, 16));
  el.append(h('span', { class: 'toast-msg' }, message));
  let timer = 0;
  const close = () => {
    clearTimeout(timer);
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 180);
  };
  if (opts.action) {
    const a = opts.action;
    el.append(h('button', { class: 'btn btn-quiet btn-sm', type: 'button', onclick: () => { a.run(); close(); } }, a.label));
  }
  el.append(h('button', { class: 'btn btn-icon btn-sm toast-close', type: 'button', 'aria-label': 'Zamknij powiadomienie', onclick: close }, icon('x', 14)));
  const arm = () => {
    clearTimeout(timer);
    timer = window.setTimeout(close, opts.timeout ?? (opts.action ? 9000 : 4500));
  };
  el.addEventListener('pointerenter', () => clearTimeout(timer));
  el.addEventListener('pointerleave', arm);
  el.addEventListener('focusin', () => clearTimeout(timer));
  el.addEventListener('focusout', arm);
  r.append(el);
  while (r.children.length > 3) r.firstElementChild?.remove();
  arm();
}
