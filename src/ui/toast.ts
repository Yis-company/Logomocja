import { el } from './dom';

let region: HTMLElement | null = null;

function ensureRegion(): HTMLElement {
  if (!region) {
    region = el('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(region);
  }
  return region;
}

/** A short notice, optionally with one action such as "Cofnij". */
export function toast(message: string, action?: { label: string; run: () => void }): void {
  const host = ensureRegion();
  const item = el('div', { class: 'toast' }, el('span', { text: message }));
  const dismiss = (): void => item.remove();
  if (action) {
    item.append(
      el('button', {
        class: 'btn btn-link',
        type: 'button',
        text: action.label,
        on: {
          click: () => {
            action.run();
            dismiss();
          },
        },
      }),
    );
  }
  item.append(el('button', { class: 'btn btn-icon', type: 'button', 'aria-label': 'Zamknij powiadomienie', text: '×', on: { click: dismiss } }));
  host.append(item);
  setTimeout(dismiss, action ? 12000 : 6000);
}
