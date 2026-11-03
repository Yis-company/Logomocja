import { icon } from './icons';

let host: HTMLElement | null = null;

/** Krótki komunikat u dołu ekranu, z opcjonalnym działaniem (np. „Przywróć szkic”). */
export function toast(message: string, action?: { label: string; run: () => void }) {
  if (!host) {
    host = document.createElement('div');
    host.className = 'toasts';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.append(host);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  const text = document.createElement('span');
  text.textContent = message;
  el.append(text);
  let timer = 0;
  const close = () => {
    clearTimeout(timer);
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 180);
  };
  if (action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-small btn-on-dark';
    b.innerHTML = `${icon('restore')}<span></span>`;
    b.querySelector('span')!.textContent = action.label;
    b.addEventListener('click', () => {
      action.run();
      close();
    });
    el.append(b);
  }
  const x = document.createElement('button');
  x.type = 'button';
  x.className = 'btn btn-icon btn-small btn-on-dark';
  x.setAttribute('aria-label', 'Zamknij komunikat');
  x.innerHTML = icon('cross');
  x.addEventListener('click', close);
  el.append(x);
  host.append(el);
  while (host.children.length > 3) host.firstElementChild!.remove();
  timer = window.setTimeout(close, action ? 12000 : 5000);
  el.addEventListener('mouseenter', () => clearTimeout(timer));
  el.addEventListener('focusin', () => clearTimeout(timer));
}
