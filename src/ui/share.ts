import type { Mode } from '../lang';

// Odnośnik: #/program?tryb=2d&kod=<dane>
// Dane: „z” + base64url(deflate-raw(UTF-8)) albo „u” + base64url(UTF-8).

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as Uint8Array<ArrayBuffer>]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeProgram(source: string): Promise<string> {
  const raw = new TextEncoder().encode(source);
  if (typeof CompressionStream !== 'undefined') {
    try {
      const packed = await pipe(raw, new CompressionStream('deflate-raw'));
      if (packed.length < raw.length) return 'z' + toBase64Url(packed);
    } catch {
      /* zostaje wersja bez kompresji */
    }
  }
  return 'u' + toBase64Url(raw);
}

export async function decodeProgram(data: string): Promise<string> {
  const kind = data[0];
  const bytes = fromBase64Url(data.slice(1));
  if (kind === 'u') return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (kind === 'z') {
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('Ta przeglądarka nie potrafi rozpakować skompresowanego odnośnika.');
    }
    const raw = await pipe(bytes, new DecompressionStream('deflate-raw'));
    return new TextDecoder('utf-8', { fatal: true }).decode(raw);
  }
  throw new Error('Nieznany format odnośnika.');
}

export async function buildPermalink(source: string, mode: Mode): Promise<string> {
  const data = await encodeProgram(source);
  const url = new URL(window.location.href);
  url.hash = `#/program?tryb=${mode}&kod=${data}`;
  return url.toString();
}
