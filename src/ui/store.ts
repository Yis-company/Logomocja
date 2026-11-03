// localStorage with graceful failure (private mode, quota).
const PREFIX = 'logomocja.';

export const store = {
  get(key: string): string | null {
    try { return localStorage.getItem(PREFIX + key); } catch { return null; }
  },
  set(key: string, value: string) {
    try { localStorage.setItem(PREFIX + key, value); } catch { /* storage unavailable */ }
  },
  remove(key: string) {
    try { localStorage.removeItem(PREFIX + key); } catch { /* storage unavailable */ }
  },
  json<T>(key: string, fallback: T): T {
    const raw = store.get(key);
    if (!raw) return fallback;
    try { return JSON.parse(raw) as T; } catch { return fallback; }
  },
};

export function encodeProgram(src: string): string {
  const bytes = new TextEncoder().encode(src);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeProgram(s: string): string | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
    return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
  } catch {
    return null;
  }
}
