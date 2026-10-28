import type { Mode } from '../lang';

// Odnośnik do programu: #/kod/<tryb>/<dane>. Dane to „z” + base64url
// skompresowanego tekstu albo „t” + base64url samego tekstu UTF-8.

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
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
  const blob = new Blob([bytes as BlobPart]);
  const res = new Response(blob.stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeProgram(source: string): Promise<string> {
  const raw = new TextEncoder().encode(source);
  const plain = 't' + toBase64Url(raw);
  if (typeof CompressionStream === 'undefined') return plain;
  try {
    const packed = 'z' + toBase64Url(await pipe(raw, new CompressionStream('deflate-raw')));
    return packed.length < plain.length ? packed : plain;
  } catch {
    return plain;
  }
}

export async function decodeProgram(payload: string): Promise<string | null> {
  try {
    const kind = payload[0];
    const bytes = fromBase64Url(payload.slice(1));
    if (kind === 't') return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (kind === 'z' && typeof DecompressionStream !== 'undefined') {
      return new TextDecoder('utf-8', { fatal: true }).decode(await pipe(bytes, new DecompressionStream('deflate-raw')));
    }
  } catch {
    /* uszkodzony odnośnik */
  }
  return null;
}

export async function permalink(source: string, mode: Mode): Promise<string> {
  const url = new URL(window.location.href);
  url.hash = `#/kod/${mode}/${await encodeProgram(source)}`;
  return url.toString();
}
