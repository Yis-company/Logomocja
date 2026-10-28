import type { Mode } from '../lang/ast';

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
  const body = new Blob([bytes as BlobPart]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(body).arrayBuffer());
}

/** Encodes a program as a compact URL-safe string ("z…" compressed, "u…" plain UTF-8). */
export async function encodeProgram(source: string): Promise<string> {
  const raw = new TextEncoder().encode(source);
  const plain = 'u' + toBase64Url(raw);
  if (typeof CompressionStream === 'undefined') return plain;
  try {
    const packed = 'z' + toBase64Url(await pipe(raw, new CompressionStream('deflate-raw')));
    return packed.length < plain.length ? packed : plain;
  } catch {
    return plain;
  }
}

export async function decodeProgram(payload: string): Promise<string> {
  const kind = payload[0];
  const bytes = fromBase64Url(payload.slice(1));
  if (kind === 'u') return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  if (kind === 'z') {
    const out = await pipe(bytes, new DecompressionStream('deflate-raw'));
    return new TextDecoder('utf-8', { fatal: true }).decode(out);
  }
  throw new Error('Nieznany format linku.');
}

export async function permalinkFor(source: string, mode: Mode): Promise<string> {
  const payload = await encodeProgram(source);
  const base = location.href.replace(/#.*$/, '');
  return `${base}#/p/${mode}/${payload}`;
}
