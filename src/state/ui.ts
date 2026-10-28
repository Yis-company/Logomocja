import { signal } from '@preact/signals';

export interface Toast {
  id: number;
  text: string;
  tone: 'info' | 'success' | 'error';
  action?: { label: string; run: () => void };
}

export const toasts = signal<Toast[]>([]);
let nextToast = 1;

export function toast(text: string, opts: { tone?: Toast['tone']; action?: Toast['action']; timeout?: number } = {}): number {
  const id = nextToast++;
  toasts.value = [...toasts.value.slice(-3), { id, text, tone: opts.tone ?? 'info', action: opts.action }];
  const timeout = opts.timeout ?? (opts.action ? 9000 : 4500);
  window.setTimeout(() => dismissToast(id), timeout);
  return id;
}

export function dismissToast(id: number): void {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

export interface DialogButton<T extends string> {
  value: T;
  label: string;
  primary?: boolean;
}

export interface DialogSpec {
  title: string;
  body: string;
  buttons: DialogButton<string>[];
  /** Optional text field (for naming a program). */
  input?: { label: string; value: string };
  resolve: (value: string | null, input?: string) => void;
}

export const dialog = signal<DialogSpec | null>(null);

/** Shows a modal dialog and resolves with the chosen button value (null when dismissed). */
export function ask<T extends string>(
  title: string,
  body: string,
  buttons: DialogButton<T>[],
  input?: { label: string; value: string },
): Promise<{ choice: T | null; input?: string }> {
  return new Promise((resolve) => {
    dialog.value = {
      title,
      body,
      buttons,
      input,
      resolve: (value, text) => {
        dialog.value = null;
        resolve({ choice: value as T | null, input: text });
      },
    };
  });
}

/** Live region text for screen readers. */
export const announcement = signal('');

export function announce(text: string): void {
  // Re-setting the same text would not be announced again.
  announcement.value = '';
  window.setTimeout(() => (announcement.value = text), 30);
}

export const shortcutsOpen = signal(false);
export const shareOpen = signal(false);
