import type { Mode } from '../lang/parser';

// Link: #/p?tryb=2d&kod=<z.|t.><base64url>. „z.” to treść skompresowana deflate, „t.” to zwykły UTF-8.

function toB64url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Uint8Array {
  const b = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b + '==='.slice((b.length + 3) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeProgram(source: string): Promise<string> {
  const raw = new TextEncoder().encode(source);
  if (typeof CompressionStream !== 'undefined') {
    try {
      const z = await pipe(raw, new CompressionStream('deflate-raw'));
      if (z.length < raw.length) return 'z.' + toB64url(z);
    } catch {
      /* zostaje zwykły zapis */
    }
  }
  return 't.' + toB64url(raw);
}

export async function decodeProgram(code: string): Promise<string | null> {
  try {
    if (code.startsWith('z.')) {
      const bytes = await pipe(fromB64url(code.slice(2)), new DecompressionStream('deflate-raw'));
      return new TextDecoder().decode(bytes);
    }
    if (code.startsWith('t.')) return new TextDecoder().decode(fromB64url(code.slice(2)));
    return null;
  } catch {
    return null;
  }
}

export async function permalink(source: string, mode: Mode): Promise<string> {
  const base = location.href.split('#')[0];
  return `${base}#/p?tryb=${mode}&kod=${await encodeProgram(source)}`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'rysunek';
}
