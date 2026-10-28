import { el } from './dom';

/** A native modal dialog with a title and a close button. Escape and focus handling come from the browser. */
export function createDialog(id: string, title: string, body: (Node | string)[]): HTMLDialogElement {
  const heading = el('h2', { class: 'dialog-title', id: `${id}-title`, text: title });
  const close = el('button', { class: 'btn btn-ghost btn-icon', type: 'button', 'aria-label': 'Zamknij okno', text: '×' });
  const dialog = el(
    'dialog',
    { class: 'dialog', id, 'aria-labelledby': `${id}-title` },
    el('header', { class: 'dialog-head' }, heading, close),
    el('div', { class: 'dialog-body' }, ...body),
  );
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    // A click on the backdrop (outside the content box) closes the dialog.
    if (e.target === dialog) dialog.close();
  });
  document.body.append(dialog);
  return dialog;
}
