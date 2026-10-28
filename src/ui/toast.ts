import { h } from './dom';

export interface ToastAction {
  label: string;
  run: () => void;
}

/**
 * Short messages at the bottom of the screen. An optional action (for example
 * "restore") can be attached. A toast with the same `group` replaces the older one.
 */
export function showToast(message: string, action?: ToastAction, group?: string): void {
  const host = document.getElementById('toasts');
  if (!host) return;
  if (group) {
    for (const old of host.querySelectorAll<HTMLElement>(`[data-group="${group}"]`)) old.remove();
  }
  const toast = h(
    'div',
    { class: 'toast', 'data-group': group ?? null },
    h('span', {}, message),
    action
      ? h('button', {
          type: 'button',
          class: 'btn small',
          on: {
            click: () => {
              action.run();
              toast.remove();
            },
          },
        }, action.label)
      : null,
  );
  host.append(toast);
  window.setTimeout(() => toast.remove(), action ? 12000 : 5000);
}
