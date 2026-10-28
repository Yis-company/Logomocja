import type { Mode } from '../lang/ast';
import { openDialog } from './dialog';
import { formatTime, h, icon } from './dom';
import { replaceHash } from './router';
import { buildPermalink } from './share';
import { CANVAS_KEYS, MOUSE_HINTS, SHORTCUTS, showKeys } from './shortcuts';
import { Stash } from './store';
import { toast } from './toast';
import type { Workspace } from './workspace';

async function copyText(text: string, input?: HTMLInputElement): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* przejdź do metody zapasowej */
  }
  try {
    const el = input ?? h('input', { value: text, readonly: true, style: { position: 'fixed', opacity: '0' } });
    if (!input) document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, text.length);
    const ok = document.execCommand('copy');
    if (!input) el.remove();
    return ok;
  } catch {
    return false;
  }
}

export async function shareDialog(mode: Mode, source: string): Promise<string> {
  const url = await buildPermalink(mode, source);
  replaceHash(url.slice(url.indexOf('#')));
  const input = h('input', {
    class: 'input mono', type: 'text', readonly: true, value: url, id: 'permalink-input',
    'aria-label': 'Link do programu', onfocus: () => input.select(),
  });
  const status = h('p', { class: 'muted small', role: 'status', 'aria-live': 'polite' });
  const copy = h(
    'button',
    {
      class: 'btn btn-primary', type: 'button',
      onclick: async () => {
        const ok = await copyText(url, input);
        status.textContent = ok ? 'Skopiowano link do schowka.' : 'Nie udało się skopiować automatycznie — zaznacz link i skopiuj go ręcznie.';
        if (ok) toast('Skopiowano link do schowka.', { kind: 'ok' });
      },
    },
    icon('copy', 16),
    'Kopiuj link',
  );
  const actions: Node[] = [copy];
  if (typeof navigator.share === 'function') {
    actions.push(
      h('button', {
        class: 'btn', type: 'button',
        onclick: () => void navigator.share({ title: 'Logomocja', text: 'Mój program w Logomocji', url }).catch(() => undefined),
      }, icon('share', 16), 'Udostępnij…'),
    );
  }
  const dlg = openDialog({
    title: 'Link do programu',
    className: 'dialog-share',
    body: [
      h('p', null, `Ten adres zawiera cały program i tryb ${mode.toUpperCase()}. Kto go otworzy, zobaczy ten sam rysunek — nic nie jest wysyłane na żaden serwer.`),
      h('label', { class: 'field-label', for: 'permalink-input' }, 'Adres'),
      input,
      status,
    ],
    actions: [...actions, h('button', { class: 'btn btn-ghost', type: 'button', onclick: () => dlg.close() }, 'Zamknij')],
  });
  setTimeout(() => input.select(), 30);
  return url;
}

export function stashDialog(ws: Workspace): void {
  const list = h('ul', { class: 'stash-list' });
  const render = () => {
    list.replaceChildren();
    const entries = Stash.list();
    ws.refreshStashCount();
    if (!entries.length) {
      list.append(h('li', { class: 'muted' }, 'Brak zachowanych szkiców. Gdy wczytasz przykład, plik lub link w miejsce niezapisanego kodu, poprzedni kod zostanie zapisany tutaj.'));
      return;
    }
    for (const e of entries) {
      const lines = e.source.split(/\r?\n/).length;
      list.append(
        h(
          'li',
          { class: 'stash-item' },
          h(
            'div',
            { class: 'stash-meta' },
            h('strong', null, e.label),
            h('span', { class: 'muted small' }, `${e.mode.toUpperCase()} · ${lines} wierszy · ${formatTime(e.savedAt)}`),
          ),
          h('pre', { class: 'stash-preview' }, e.source.split(/\r?\n/).slice(0, 4).join('\n')),
          h(
            'div',
            { class: 'stash-actions' },
            h('button', {
              class: 'btn btn-sm btn-primary', type: 'button',
              onclick: () => {
                dlg.close();
                ws.replaceSource(e.source, { mode: e.mode, run: true });
                Stash.remove(e.id);
                ws.refreshStashCount();
                toast('Przywrócono szkic.', { kind: 'ok' });
              },
            }, 'Przywróć'),
            h('button', {
              class: 'btn btn-sm btn-ghost', type: 'button', 'aria-label': `Usuń szkic: ${e.label}`,
              onclick: () => {
                Stash.remove(e.id);
                render();
              },
            }, icon('trash', 14), 'Usuń'),
          ),
        ),
      );
    }
  };
  render();
  const dlg = openDialog({
    title: 'Zachowane szkice',
    className: 'dialog-wide',
    body: [h('p', { class: 'muted' }, 'Kopie kodu, który został zastąpiony przykładem, plikiem lub linkiem. Przywrócenie szkicu zachowuje bieżący kod w tym samym miejscu.'), list],
    actions: [h('button', { class: 'btn', type: 'button', onclick: () => dlg.close() }, 'Zamknij')],
  });
}

export function shortcutsDialog(): void {
  const row = (keys: string[], label: string) =>
    h(
      'tr',
      null,
      h('td', null, ...keys.flatMap((k, i) => [i ? ' lub ' : '', h('kbd', null, showKeys(k))])),
      h('td', null, label),
    );
  const dlg = openDialog({
    title: 'Skróty klawiszowe',
    className: 'dialog-wide',
    body: [
      h('h3', null, 'Program'),
      h('table', { class: 'table keys' }, h('tbody', null, ...SHORTCUTS.map((s) => row(s.keys, s.label)))),
      h('h3', null, 'Rysunek (po ustawieniu fokusu na rysunku)'),
      h('table', { class: 'table keys' }, h('tbody', null, ...CANVAS_KEYS.map((s) => row([s.keys], s.label)))),
      h('h3', null, 'Mysz i ekran dotykowy'),
      h('table', { class: 'table keys' }, h('tbody', null, ...MOUSE_HINTS.map((s) => h('tr', null, h('td', null, s.keys), h('td', null, s.label))))),
    ],
    actions: [h('button', { class: 'btn', type: 'button', onclick: () => dlg.close() }, 'Zamknij')],
  });
}
