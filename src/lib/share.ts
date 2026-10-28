import type { Mode } from '../lang/parser';

export function encodeSource(src: string): string {
  const bytes = new TextEncoder().encode(src);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSource(s: string): string | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function permalinkHash(src: string, mode: Mode): string {
  return `#/?tryb=${mode}&kod=${encodeSource(src)}`;
}

export interface Route { path: string; params: URLSearchParams }

export function parseHash(hash: string): Route {
  let h = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!h.startsWith('/')) h = '/' + h;
  const q = h.indexOf('?');
  const path = q < 0 ? h : h.slice(0, q);
  const params = new URLSearchParams(q < 0 ? '' : h.slice(q + 1));
  return { path: path.replace(/\/+$/, '') || '/', params };
}
