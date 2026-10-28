import { type Mode } from '../lang/limits';

/** base64url of the UTF-8 bytes; used for the program part of permalinks. */
export function encodeProgram(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeProgram(encoded: string): string | null {
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

/** The address of the workspace that opens `source` in `mode`. */
export function permalink(source: string, mode: Mode): string {
  const base = location.href.split('#')[0];
  return `${base}#/?m=${mode}&p=${encodeProgram(source)}`;
}

export function parseQuery(query: string): URLSearchParams {
  return new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
}
