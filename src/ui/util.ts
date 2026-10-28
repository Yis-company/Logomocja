import type { Mode } from '../logo/ast';

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function storageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function storageSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage may be full or disabled; the app keeps working without it */
  }
}

export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/* ---------- theme ---------- */

export type ThemeChoice = 'system' | 'light' | 'dark';
const THEME_KEY = 'logomocja.motyw';
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

export function getThemeChoice(): ThemeChoice {
  const v = storageGet(THEME_KEY);
  return v === 'light' || v === 'dark' ? v : 'system';
}

export function isDarkTheme(): boolean {
  const choice = getThemeChoice();
  return choice === 'dark' || (choice === 'system' && darkQuery.matches);
}

export function applyTheme(choice: ThemeChoice): void {
  if (choice === 'system') {
    storageRemove(THEME_KEY);
    delete document.documentElement.dataset.theme;
  } else {
    storageSet(THEME_KEY, choice);
    document.documentElement.dataset.theme = choice;
  }
  window.dispatchEvent(new Event('logomocja:theme'));
}

darkQuery.addEventListener('change', () => window.dispatchEvent(new Event('logomocja:theme')));

export const THEME_LABEL: Record<ThemeChoice, string> = {
  system: 'systemowy',
  light: 'jasny',
  dark: 'ciemny',
};

export function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ---------- permalinks ---------- */

/** Encodes a program as URL-safe base64 of its UTF-8 bytes. */
export function encodeProgram(source: string): string {
  let bin = '';
  for (const b of new TextEncoder().encode(source)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeProgram(text: string): string | null {
  try {
    const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function parseMode(v: string | null | undefined): Mode | null {
  return v === '2d' || v === '3d' ? v : null;
}

/** Splits `#/path?query` into its path and query parameters. */
export function parseHash(): { path: string; query: URLSearchParams } {
  const raw = location.hash.replace(/^#/, '') || '/';
  const q = raw.indexOf('?');
  const path = q === -1 ? raw : raw.slice(0, q);
  const query = new URLSearchParams(q === -1 ? '' : raw.slice(q + 1));
  return { path: path || '/', query };
}

/* ---------- files ---------- */

export function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(',');
  const type = head.slice(5, head.indexOf(';'));
  const bin = atob(body);
  return new Blob([Uint8Array.from(bin, (c) => c.charCodeAt(0))], { type });
}

export function safeFileName(s: string): string {
  return s.replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-+|-+$/g, '') || 'program';
}

/** Whether this browser can create a WebGL context (needed for the 3D view). */
export function webglAvailable(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}
