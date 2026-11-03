import { h, icon } from './dom';

const supportsPopover = typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;

let openCount = 0;
/** True while any popover from this module is open (global shortcuts yield to it). */
export function popoverOpen(): boolean {
  return openCount > 0;
}

export interface PopoverHandle {
  el: HTMLElement;
  open(): void;
  close(): void;
  toggle(): void;
  isOpen(): boolean;
}

/**
 * A panel anchored to a trigger button. Uses the native popover top layer when
 * available so it never clips inside scrolling containers.
 */
export function popover(trigger: HTMLButtonElement, content: HTMLElement, opts: { role?: string; label: string; align?: 'start' | 'end'; onOpen?: () => void } ): PopoverHandle {
  const id = `pop-${Math.random().toString(36).slice(2, 8)}`;
  const el = h('div', { class: 'popover', id, role: opts.role ?? 'dialog', 'aria-label': opts.label }, content);
  if (supportsPopover) el.setAttribute('popover', 'auto');
  document.body.append(el);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', id);
  trigger.setAttribute('aria-haspopup', opts.role === 'menu' ? 'menu' : 'dialog');
  let isOpen = false;
  // A press on the trigger while open light-dismisses the popover; the click that
  // follows must not reopen it.
  let swallowClick = false;

  const place = () => {
    const r = trigger.getBoundingClientRect();
    el.style.position = 'fixed';
    el.style.margin = '0';
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    let left = opts.align === 'end' ? r.right - width : r.left;
    left = Math.min(Math.max(8, left), window.innerWidth - width - 8);
    let top = r.bottom + 6;
    if (top + height > window.innerHeight - 8) top = Math.max(8, r.top - height - 6);
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  };

  const onDocDown = (e: PointerEvent) => {
    if (!el.contains(e.target as Node) && !trigger.contains(e.target as Node)) handle.close();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      handle.close();
      trigger.focus();
    }
  };

  const setOpen = (v: boolean) => {
    if (v === isOpen) return;
    isOpen = v;
    openCount += v ? 1 : -1;
    trigger.setAttribute('aria-expanded', String(v));
    if (v) {
      document.addEventListener('pointerdown', onDocDown, true);
      el.addEventListener('keydown', onKey);
    } else {
      document.removeEventListener('pointerdown', onDocDown, true);
      el.removeEventListener('keydown', onKey);
    }
  };

  if (supportsPopover) {
    el.addEventListener('toggle', (e) => {
      const open = (e as ToggleEvent).newState === 'open';
      setOpen(open);
    });
  }

  const handle: PopoverHandle = {
    el,
    open() {
      opts.onOpen?.();
      if (supportsPopover) el.showPopover();
      else el.classList.add('is-open');
      setOpen(true);
      place();
      const first = el.querySelector<HTMLElement>('[role="menuitem"]:not([disabled]), input, button:not([disabled])');
      first?.focus();
    },
    close() {
      if (supportsPopover) {
        if (el.matches(':popover-open')) el.hidePopover();
      } else el.classList.remove('is-open');
      setOpen(false);
    },
    toggle() {
      if (isOpen) handle.close();
      else handle.open();
    },
    isOpen: () => isOpen,
  };
  trigger.addEventListener('pointerdown', () => {
    swallowClick = isOpen;
  });
  trigger.addEventListener('click', () => {
    if (swallowClick) {
      swallowClick = false;
      handle.close();
      return;
    }
    handle.toggle();
  });
  window.addEventListener('resize', () => isOpen && place());

  if (opts.role === 'menu') {
    el.addEventListener('keydown', (e) => {
      const items = [...el.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled]):not([hidden])')];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.key === 'ArrowDown') items[(i + 1) % items.length]?.focus();
      else if (e.key === 'ArrowUp') items[(i - 1 + items.length) % items.length]?.focus();
      else if (e.key === 'Home') items[0]?.focus();
      else if (e.key === 'End') items[items.length - 1]?.focus();
      else if (e.key === 'Tab') handle.close();
      else return;
      e.preventDefault();
    });
    el.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('[role="menuitem"]')) {
        handle.close();
        trigger.focus();
      }
    });
  }
  return handle;
}

export function menuItem(label: string, iconName: Parameters<typeof icon>[0], onSelect: () => void, hint?: string): HTMLButtonElement {
  return h(
    'button',
    { type: 'button', class: 'menu-item', role: 'menuitem', tabindex: '-1', onclick: onSelect },
    icon(iconName),
    h('span', { class: 'menu-label' }, label),
    hint ? h('span', { class: 'menu-hint' }, hint) : null,
  );
}

// ── Toasts ──────────────────────────────────────────────────────────────────

let region: HTMLElement | null = null;

function toastRegion(): HTMLElement {
  if (!region) {
    region = h('div', { class: 'toasts', role: 'status', 'aria-live': 'polite', 'aria-relevant': 'additions' });
    document.body.append(region);
  }
  return region;
}

export function toast(message: string, action?: { label: string; run: () => void }, tone: 'info' | 'error' = 'info'): void {
  const el = h('div', { class: `toast toast-${tone}` }, h('span', { class: 'toast-text' }, message));
  let timer = 0;
  const close = () => {
    clearTimeout(timer);
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 180);
  };
  if (action) {
    el.append(
      h('button', { type: 'button', class: 'btn btn-quiet btn-small', onclick: () => { action.run(); close(); } }, action.label),
    );
  }
  el.append(h('button', { type: 'button', class: 'icon-btn btn-small', 'aria-label': 'Zamknij powiadomienie', onclick: close }, icon('close')));
  const arm = () => {
    clearTimeout(timer);
    timer = window.setTimeout(close, action ? 10000 : 5000);
  };
  el.addEventListener('pointerenter', () => clearTimeout(timer));
  el.addEventListener('pointerleave', arm);
  el.addEventListener('focusin', () => clearTimeout(timer));
  el.addEventListener('focusout', arm);
  toastRegion().append(el);
  arm();
}
