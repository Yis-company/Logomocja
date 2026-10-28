import { h, icon } from './dom';

let host: HTMLElement | null = null;

export interface ToastOptions {
  kind?: 'info' | 'ok' | 'error';
  actionLabel?: string;
  onAction?: () => void;
  timeout?: number;
}

export function toast(message: string, opts: ToastOptions = {}): void {
  if (!host) {
    host = h('div', { class: 'toasts', 'aria-live': 'polite', 'aria-atomic': 'false', role: 'status' });
    document.body.appendChild(host);
  }
  const kind = opts.kind ?? 'info';
  const el = h('div', { class: `toast toast-${kind}` }, h('span', { class: 'toast-msg' }, message));
  let timer: ReturnType<typeof setTimeout> | undefined;
  const dismiss = () => {
    if (timer) clearTimeout(timer);
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 180);
  };
  if (opts.actionLabel && opts.onAction) {
    el.appendChild(
      h('button', {
        class: 'btn btn-sm btn-ghost toast-action',
        type: 'button',
        onclick: () => {
          opts.onAction!();
          dismiss();
        },
      }, opts.actionLabel),
    );
  }
  el.appendChild(
    h('button', { class: 'icon-btn toast-close', type: 'button', 'aria-label': 'Zamknij powiadomienie', onclick: dismiss }, icon('x', 16)),
  );
  host.appendChild(el);
  while (host.children.length > 3) host.firstElementChild?.remove();
  timer = setTimeout(dismiss, opts.timeout ?? (opts.onAction ? 9000 : 4500));
}
