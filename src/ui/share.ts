import type { Mode } from '../lang/ast';
import { lex } from '../lang/lexer';

export function encodeSource(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeSource(encoded: string): string | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b64 + '==='.slice((b64.length + 3) % 4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Absolute permalink to the current program and mode; works under any base path. */
export function permalink(source: string, mode: Mode): string {
  const base = location.href.split('#')[0];
  return `${base}#/?tryb=${mode}&kod=${encodeSource(source)}`;
}

export function download(name: string, data: Blob) {
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function fileSlug(title: string): string {
  const s = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'rysunek';
}

/** Guesses the mode a file was written for: pitch or roll commands mean 3D. */
export function guessMode(source: string): Mode | null {
  try {
    const toks = lex(source);
    return toks.some((t) => t.type === 'word' && !t.colon && (t.kw === 'gora' || t.kw === 'dol' || t.kw === 'pp' || t.kw === 'pl')) ? '3d' : null;
  } catch {
    return /(^|\s)(gora|góra|dol|dół|pp|pl|przechylprawo|przechyllewo|pitchup|pitchdown|rollright|rollleft)\s/i.test(source) ? '3d' : null;
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.append(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}
