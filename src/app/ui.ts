import { h, icon } from './dom';

let toastHost: HTMLElement | null = null;

function host(): HTMLElement {
  if (!toastHost) {
    toastHost = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'false' });
    document.body.appendChild(toastHost);
  }
  return toastHost;
}

export interface ToastOptions {
  actionLabel?: string;
  onAction?: () => void;
  kind?: 'info' | 'error' | 'success';
  timeout?: number;
}

export function toast(message: string, options: ToastOptions = {}): void {
  const el = h('div', { class: `toast toast-${options.kind ?? 'info'}` }, h('span', null, message));
  const remove = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  };
  if (options.actionLabel) {
    el.appendChild(
      h(
        'button',
        {
          class: 'btn btn-small btn-ghost',
          type: 'button',
          onClick: () => {
            options.onAction?.();
            remove();
          },
        },
        options.actionLabel,
      ),
    );
  }
  el.appendChild(
    h('button', { class: 'icon-btn toast-close', type: 'button', 'aria-label': 'Zamknij powiadomienie', onClick: remove }, icon('x', 14)),
  );
  const h0 = host();
  while (h0.children.length >= 3) h0.firstElementChild?.remove();
  h0.appendChild(el);
  setTimeout(remove, options.timeout ?? (options.actionLabel ? 9000 : 5000));
}

export interface DialogButton {
  label: string;
  value: string;
  primary?: boolean;
  danger?: boolean;
}

/** Okno modalne oparte na <dialog>: pułapka fokusu i Esc dostarcza przeglądarka. */
export function openDialog(options: {
  title: string;
  body: Node | string;
  buttons: DialogButton[];
  className?: string;
}): Promise<string> {
  return new Promise((resolve) => {
    const dlg = h('dialog', { class: `dialog ${options.className ?? ''}`, 'aria-labelledby': 'dlg-title' });
    let result = 'cancel';
    const close = (v: string) => {
      result = v;
      dlg.close();
    };
    const buttons = options.buttons.map((b) =>
      h(
        'button',
        {
          type: 'button',
          class: `btn ${b.primary ? 'btn-primary' : ''} ${b.danger ? 'btn-danger' : ''}`,
          onClick: () => close(b.value),
        },
        b.label,
      ),
    );
    dlg.append(
      h('h2', { id: 'dlg-title', class: 'dialog-title' }, options.title),
      h('div', { class: 'dialog-body' }, options.body),
      h('div', { class: 'dialog-actions' }, buttons),
    );
    dlg.addEventListener('close', () => {
      dlg.remove();
      resolve(result);
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) close('cancel');
    });
    document.body.appendChild(dlg);
    dlg.showModal();
    (dlg.querySelector('.btn-primary') as HTMLElement | null)?.focus();
  });
}
