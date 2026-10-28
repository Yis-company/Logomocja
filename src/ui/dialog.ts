import { h } from './dom';

let uid = 0;

export interface Dlg { dlg: HTMLDialogElement; body: HTMLElement; open(): void; close(): void }

export function makeDialog(title: string, opts: { wide?: boolean; onClose?: () => void } = {}): Dlg {
  const id = `dlg-${++uid}`;
  const body = h('div', { class: 'dlg-body' });
  const closeBtn = h('button', { type: 'button', class: 'btn btn-ghost dlg-x', 'aria-label': 'Zamknij okno' }, '✕');
  const dlg = h('dialog', { class: `dlg${opts.wide ? ' dlg-wide' : ''}`, 'aria-labelledby': id },
    h('div', { class: 'dlg-head' }, h('h2', { id }, title), closeBtn), body);
  document.body.append(dlg);
  const close = () => { if (dlg.open) dlg.close(); };
  closeBtn.addEventListener('click', close);
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.addEventListener('close', () => opts.onClose?.());
  return {
    dlg, body, close,
    open() { if (!dlg.open) dlg.showModal(); },
  };
}

export function anyDialogOpen(): boolean {
  return !!document.querySelector('dialog[open]');
}

let toastHost: HTMLElement | null = null;

export function toast(message: string, action?: { label: string; run: () => void }, ms = 6000) {
  if (!toastHost) {
    toastHost = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(toastHost);
  }
  const el = h('div', { class: 'toast' }, h('span', {}, message));
  if (action) {
    el.append(h('button', {
      type: 'button', class: 'btn btn-small',
      onclick: () => { action.run(); el.remove(); },
    }, action.label));
  }
  toastHost.append(el);
  setTimeout(() => el.remove(), ms);
}

/** Pyta o zgodę; zwraca wybrany przycisk. */
export function ask(title: string, text: string, choices: Array<{ id: string; label: string; primary?: boolean }>): Promise<string> {
  return new Promise(resolve => {
    let answer = 'cancel';
    const d = makeDialog(title, { onClose: () => { d.dlg.remove(); resolve(answer); } });
    d.body.append(
      h('p', {}, text),
      h('div', { class: 'dlg-actions' }, ...choices.map(c => h('button', {
        type: 'button', class: `btn${c.primary ? ' btn-primary' : ''}`,
        onclick: () => { answer = c.id; d.close(); },
      }, c.label))),
    );
    d.open();
  });
}
