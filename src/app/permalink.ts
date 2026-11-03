import type { Mode } from '../lang/types';

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text: string): Uint8Array {
  const b64 = text.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

const canCompress = typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined';

/** Encodes a program as the `kod` value: "z" + deflate-raw + base64url, or "t" + base64url. */
export async function encodeSource(source: string): Promise<string> {
  const bytes = new TextEncoder().encode(source);
  if (canCompress) {
    try {
      return 'z' + toBase64Url(await pipe(bytes, new CompressionStream('deflate-raw')));
    } catch {
      /* fall through */
    }
  }
  return 't' + toBase64Url(bytes);
}

export async function decodeSource(value: string): Promise<string | null> {
  try {
    const kind = value[0];
    const bytes = fromBase64Url(value.slice(1));
    if (kind === 'z') {
      if (!canCompress) return null;
      return new TextDecoder().decode(await pipe(bytes, new DecompressionStream('deflate-raw')));
    }
    if (kind === 't') return new TextDecoder().decode(bytes);
    return null;
  } catch {
    return null;
  }
}

export async function permalinkFor(source: string, mode: Mode): Promise<string> {
  const base = location.href.split('#')[0];
  return `${base}#/?tryb=${mode}&kod=${await encodeSource(source)}`;
}
