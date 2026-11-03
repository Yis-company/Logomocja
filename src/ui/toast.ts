// Polite, non-blocking notices with an optional action.
let host: HTMLElement | null = null;

export function toast(text: string, action?: { label: string; run: () => void }) {
  if (!host) {
    host = document.createElement('div');
    host.className = 'toasts';
    host.setAttribute('role', 'status');
    host.setAttribute('aria-live', 'polite');
    document.body.appendChild(host);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  const p = document.createElement('p');
  p.textContent = text;
  t.appendChild(p);
  if (action) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn small';
    b.textContent = action.label;
    b.addEventListener('click', () => { action.run(); t.remove(); });
    t.appendChild(b);
  }
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'toast-x';
  close.setAttribute('aria-label', 'Zamknij powiadomienie');
  close.innerHTML = '<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/></svg>';
  close.addEventListener('click', () => t.remove());
  t.appendChild(close);
  host.appendChild(t);
  while (host.children.length > 3) host.firstElementChild!.remove();
  let timer = window.setTimeout(() => t.remove(), action ? 12000 : 5000);
  t.addEventListener('focusin', () => clearTimeout(timer));
  t.addEventListener('focusout', () => { timer = window.setTimeout(() => t.remove(), 4000); });
}
