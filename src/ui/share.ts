import type { Mode } from '../logo/index';

/** UTF-8 aware base64url, so the permalink stays short and URL-safe. */
export function encodeSource(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSource(token: string): string | null {
  try {
    const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '='));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Hash route for the editor with a program: `#/?tryb=3d&kod=...`. */
export function permalink(source: string, mode: Mode, extra: Record<string, string> = {}): string {
  const params = new URLSearchParams({ tryb: mode, kod: encodeSource(source), ...extra });
  return `${location.origin}${location.pathname}#/?${params.toString()}`;
}
