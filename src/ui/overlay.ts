import { h, svgIcon } from './dom';
import { ICONS } from './icons';

let toastHost: HTMLElement | null = null;

/** Krótki komunikat w rogu ekranu (ogłaszany też czytnikom ekranu). */
export function toast(message: string, action?: { label: string; run: () => void }, timeout = 6000): void {
  if (!toastHost) {
    toastHost = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.appendChild(toastHost);
  }
  const close = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 200);
  };
  const el = h('div', { class: 'toast' },
    h('span', { class: 'toast-text' }, message),
    action ? h('button', { class: 'btn btn-small', type: 'button', onclick: () => { action.run(); close(); } }, action.label) : null,
    h('button', { class: 'btn-icon btn-small', type: 'button', 'aria-label': 'Zamknij komunikat', onclick: close }, svgIcon(ICONS.cross)),
  );
  toastHost.appendChild(el);
  setTimeout(close, timeout);
}

export interface DialogButton {
  label: string;
  value: string;
  primary?: boolean;
}

/** Okno dialogowe (natywny <dialog>, z obsługą klawiatury i pułapką fokusu). */
export function dialog(title: string, body: Node | string, buttons: DialogButton[]): Promise<string> {
  return new Promise((resolve) => {
    const titleId = `dlg-${Math.random().toString(36).slice(2)}`;
    const dlg = h('dialog', { class: 'dialog', 'aria-labelledby': titleId },
      h('h2', { id: titleId, class: 'dialog-title' }, title),
      h('div', { class: 'dialog-body' }, typeof body === 'string' ? h('p', null, body) : body),
      h('div', { class: 'dialog-actions' },
        buttons.map((b) => h('button', {
          type: 'button', class: b.primary ? 'btn btn-primary' : 'btn',
          onclick: () => { dlg.close(b.value); },
        }, b.label)),
      ),
    );
    dlg.addEventListener('close', () => {
      resolve(dlg.returnValue || 'cancel');
      dlg.remove();
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close('cancel');
    });
    document.body.appendChild(dlg);
    dlg.showModal();
    const primary = dlg.querySelector<HTMLButtonElement>('.btn-primary');
    (primary ?? dlg.querySelector<HTMLButtonElement>('button'))?.focus();
  });
}
