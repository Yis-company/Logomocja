import type { Mode } from '../lang/types';

export function encodeSource(src: string): string {
  const bytes = new TextEncoder().encode(src);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSource(b64: string): string | null {
  try {
    const s = b64.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

export function makePermalink(mode: Mode, src: string): string {
  const base = location.href.split('#')[0];
  return `${base}#/pracownia?m=${mode}&p=${encodeSource(src)}`;
}

export interface Route {
  path: string[];
  query: URLSearchParams;
}

export function parseHash(hash = location.hash): Route {
  const raw = hash.replace(/^#/, '');
  const [p, q = ''] = raw.split('?');
  return { path: p.split('/').filter(Boolean), query: new URLSearchParams(q) };
}

export function downloadBlob(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function downloadText(text: string, name: string): void {
  downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), name);
}

/** Heuristic: does the program use 3D-only commands? */
export function uses3d(src: string): boolean {
  return /(^|[^\p{L}\p{N}_])(gora|góra|dol|dół|pp|pl|pitchup|pitchdown|rr|rl|rollright|rollleft|przechylprawo|przechyllewo)(?![\p{L}\p{N}_])/imu.test(src.replace(/;[^\n]*/g, ''));
}
