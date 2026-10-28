import { h, icon, uid } from './dom';

export interface DialogHandle {
  el: HTMLDialogElement;
  close(): void;
}

/** Okno dialogowe oparte na natywnym <dialog>: pułapka fokusu, Esc i tło za darmo. */
export function openDialog(opts: {
  title: string;
  body: Node | Node[];
  actions?: Node[];
  className?: string;
  onClose?: () => void;
}): DialogHandle {
  const titleId = uid('dlg-title');
  const dlg = h('dialog', { class: `dialog ${opts.className ?? ''}`, 'aria-labelledby': titleId });
  const closeBtn = h('button', { class: 'icon-btn', type: 'button', 'aria-label': 'Zamknij okno', onclick: () => close() }, icon('x', 18));
  const body = h('div', { class: 'dialog-body' }, ...(Array.isArray(opts.body) ? opts.body : [opts.body]));
  dlg.append(
    h('div', { class: 'dialog-head' }, h('h2', { id: titleId }, opts.title), closeBtn),
    body,
  );
  if (opts.actions?.length) dlg.append(h('div', { class: 'dialog-actions' }, ...opts.actions));
  const restoreFocus = document.activeElement as HTMLElement | null;
  const close = () => {
    if (dlg.open) dlg.close();
  };
  dlg.addEventListener('close', () => {
    dlg.remove();
    opts.onClose?.();
    if (restoreFocus && document.contains(restoreFocus)) restoreFocus.focus();
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) close();
  });
  document.body.appendChild(dlg);
  if (typeof dlg.showModal === 'function') dlg.showModal();
  else dlg.setAttribute('open', '');
  return { el: dlg, close };
}

export function anyDialogOpen(): boolean {
  return !!document.querySelector('dialog[open]');
}
