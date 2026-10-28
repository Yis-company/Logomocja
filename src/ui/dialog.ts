import { h } from './dom';

export interface AppDialog {
  element: HTMLDialogElement;
  open(opener?: HTMLElement | null): void;
  close(): void;
}

/**
 * A native modal dialog with a title and a close button. Focus returns to the
 * element that opened it. The browser handles Escape and the focus trap.
 */
export function createDialog(id: string, title: string, body: Node[]): AppDialog {
  let opener: HTMLElement | null = null;
  const titleId = `${id}-title`;
  const element = h(
    'dialog',
    { class: 'dialog', id, 'aria-labelledby': titleId },
    h(
      'div',
      { class: 'dialog-head' },
      h('h2', { id: titleId }, title),
      h('button', { type: 'button', class: 'btn ghost', 'aria-label': 'Zamknij', on: { click: () => dialog.close() } }, '✕'),
    ),
    h('div', { class: 'dialog-body' }, ...body),
  );
  const dialog = element;
  dialog.addEventListener('close', () => {
    opener?.focus({ preventScroll: true });
    opener = null;
  });
  // Clicks on the backdrop (outside the box) close the dialog.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.body.append(element);
  return {
    element,
    open(from?: HTMLElement | null) {
      opener = from ?? (document.activeElement as HTMLElement | null);
      if (!dialog.open) dialog.showModal();
      const focusTarget = dialog.querySelector<HTMLElement>('[data-autofocus]') ?? dialog.querySelector<HTMLElement>('button, input, a');
      focusTarget?.focus();
    },
    close() {
      if (dialog.open) dialog.close();
    },
  };
}
