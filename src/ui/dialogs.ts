import { h } from './dom';

export interface DialogButton {
  label: string;
  value: string;
  primary?: boolean;
}

/** Modal dialog built on <dialog>; resolves with the value of the pressed button (or "cancel"). */
export function modal(title: string, body: Node | string, buttons: DialogButton[], opts: { wide?: boolean } = {}): Promise<string> {
  return new Promise((resolve) => {
    const titleId = `dlg-${Math.random().toString(36).slice(2)}`;
    const dlg = h('dialog', { class: 'dialog' + (opts.wide ? ' wide' : ''), 'aria-labelledby': titleId });
    let result = 'cancel';
    const bar = h('div', { class: 'dialog-actions' }, buttons.map((b) =>
      h('button', {
        type: 'button',
        class: b.primary ? 'btn primary' : 'btn',
        onClick: () => { result = b.value; dlg.close(); },
      }, b.label)));
    dlg.append(h('h2', { id: titleId }, title), h('div', { class: 'dialog-body' }, body), bar);
    dlg.addEventListener('close', () => { dlg.remove(); resolve(result); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    document.body.append(dlg);
    dlg.showModal();
    (bar.querySelector('.primary') as HTMLElement | null)?.focus();
  });
}

export async function confirmDialog(title: string, body: string, ok: string, cancel = 'Anuluj'): Promise<boolean> {
  const r = await modal(title, h('p', null, body), [
    { label: cancel, value: 'cancel' },
    { label: ok, value: 'ok', primary: true },
  ]);
  return r === 'ok';
}
