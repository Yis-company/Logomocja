import type { Mode } from '../lang';

/** Program w adresie: UTF-8 → base64 w wariancie URL-safe, bez dopełnienia. */
export function encodeProgram(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeProgram(code: string): string | null {
  try {
    const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export interface ParsedHash {
  path: string[];
  params: URLSearchParams;
}

export function parseHash(hash: string): ParsedHash {
  const raw = hash.replace(/^#/, '');
  const q = raw.indexOf('?');
  const pathPart = q >= 0 ? raw.slice(0, q) : raw;
  const params = new URLSearchParams(q >= 0 ? raw.slice(q + 1) : '');
  const path = pathPart.split('/').filter(Boolean).map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  return { path, params };
}

export function permalinkHash(source: string, mode: Mode): string {
  return `#/pracownia?tryb=${mode}&kod=${encodeProgram(source)}`;
}

export function permalink(source: string, mode: Mode): string {
  const url = new URL(window.location.href);
  url.hash = permalinkHash(source, mode);
  return url.toString();
}

/** Wyciąga program z parametrów adresu; null, gdy adres nie zawiera programu. */
export function programFromParams(params: URLSearchParams): { source: string; mode: Mode } | null {
  const code = params.get('kod');
  if (code === null) return null;
  const source = decodeProgram(code);
  if (source === null) return null;
  return { source, mode: params.get('tryb') === '3d' ? '3d' : '2d' };
}
