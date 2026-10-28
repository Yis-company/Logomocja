import { h } from './dom';
import { icon } from './icons';

export interface DialogButton<T> {
  label: string;
  value: T;
  kind?: 'primary' | 'ghost' | 'danger';
}

/** Okno modalne (<dialog>) z przyciskami; zwraca wartość wybranego przycisku. */
export function ask<T>(opts: {
  title: string;
  body: (Node | string)[];
  buttons: DialogButton<T>[];
  cancelValue: T;
}): Promise<T> {
  return new Promise((resolve) => {
    const titleId = `dlg-${Math.random().toString(36).slice(2)}`;
    const dlg = h('dialog', { class: 'dialog', 'aria-labelledby': titleId });
    const close = (v: T) => {
      dlg.close();
      dlg.remove();
      resolve(v);
    };
    dlg.append(
      h('h2', { id: titleId }, opts.title),
      h('div', { class: 'dialog-body' }, ...opts.body),
      h(
        'div',
        { class: 'dialog-actions' },
        ...opts.buttons.map((b) =>
          h('button', { type: 'button', class: `btn ${b.kind ?? ''}`, onclick: () => close(b.value) }, b.label),
        ),
      ),
    );
    dlg.addEventListener('cancel', (e) => {
      e.preventDefault();
      close(opts.cancelValue);
    });
    document.body.append(dlg);
    dlg.showModal();
    const primary = dlg.querySelector<HTMLButtonElement>('.btn.primary');
    primary?.focus();
  });
}

/** Okno z odnośnikiem do skopiowania. */
export function showLink(url: string, copied: boolean): void {
  const input = h('input', { type: 'text', class: 'link-input', readonly: true, value: url, 'aria-label': 'Odnośnik do programu' });
  const status = h('p', { class: 'muted', role: 'status' }, copied ? 'Odnośnik skopiowano do schowka.' : 'Skopiuj odnośnik i wyślij go dalej.');
  const copy = h('button', { type: 'button', class: 'btn', html: `${icon('copy')}<span>Kopiuj</span>` });
  copy.addEventListener('click', async () => {
    input.select();
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Skopiowano!';
    } catch {
      const ok = document.execCommand?.('copy');
      status.textContent = ok ? 'Skopiowano!' : 'Zaznaczono — skopiuj skrótem Ctrl+C.';
    }
  });
  void ask({
    title: 'Odnośnik do programu',
    body: [
      h('p', {}, 'Kto otworzy ten odnośnik, zobaczy Twój program i jego rysunek. Program jest zapisany w samym adresie — nic nie trafia na serwer.'),
      h('div', { class: 'link-row' }, input, copy),
      status,
    ],
    buttons: [{ label: 'Zamknij', value: null, kind: 'primary' }],
    cancelValue: null,
  });
  setTimeout(() => input.select(), 50);
}

let toastHost: HTMLElement | null = null;

/** Krótki komunikat w rogu ekranu, opcjonalnie z przyciskiem akcji. */
export function toast(message: string, action?: { label: string; run: () => void }, ms = 7000): void {
  if (!toastHost) {
    toastHost = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite' });
    document.body.append(toastHost);
  }
  const el = h('div', { class: 'toast' }, h('span', {}, message));
  const remove = () => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 200);
  };
  if (action) {
    el.append(
      h('button', {
        type: 'button',
        class: 'btn small',
        onclick: () => {
          action.run();
          remove();
        },
      }, action.label),
    );
  }
  el.append(h('button', { type: 'button', class: 'icon-btn small', 'aria-label': 'Zamknij komunikat', html: icon('close'), onclick: remove }));
  toastHost.append(el);
  setTimeout(remove, ms);
}
