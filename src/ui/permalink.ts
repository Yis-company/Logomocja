import type { Mode } from '../lang';

/** UTF-8 text to URL-safe base64, and back. Used for program text in the hash. */

export function encodeText(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeText(encoded: string): string | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Address of the workspace with `source` and `mode` in the hash. */
export function permalinkFor(source: string, mode: Mode): string {
  const url = new URL(window.location.href);
  url.hash = `/?tryb=${mode}&kod=${encodeText(source)}`;
  return url.toString();
}

export function parseMode(value: string | null): Mode | null {
  return value === '2d' || value === '3d' ? value : null;
}
