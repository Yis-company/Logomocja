import type { Mode } from '../lang/ast';
import type { Route } from './router';

/** Kodowanie programu w adresie URL: base64url, opcjonalnie po kompresji deflate. */

function toBase64Url(bytes: Uint8Array): string {
  let bin = '';
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode(...bytes.subarray(i, i + CH));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const writer = stream.writable.getWriter();
  // Błędy zapisu i zamknięcia wracają przez odczyt strumienia — nie zostawiamy nieobsłużonych obietnic.
  writer.write(bytes as unknown as BufferSource).catch(() => undefined);
  writer.close().catch(() => undefined);
  const buf = await new Response(stream.readable).arrayBuffer();
  return new Uint8Array(buf);
}

export async function encodeProgram(source: string): Promise<string> {
  const raw = new TextEncoder().encode(source);
  const plain = 'u' + toBase64Url(raw);
  if (typeof CompressionStream === 'undefined') return plain;
  try {
    const z = 'z' + toBase64Url(await pipe(raw, new CompressionStream('deflate-raw')));
    return z.length < plain.length ? z : plain;
  } catch {
    return plain;
  }
}

export class BadLinkError extends Error {
  constructor() {
    super('Adres jest uszkodzony albo niepełny.');
    this.name = 'BadLinkError';
  }
}

export async function decodeProgram(payload: string): Promise<string> {
  try {
    const kind = payload[0];
    if (kind !== 'u' && kind !== 'z') throw new BadLinkError();
    if (!/^[A-Za-z0-9_-]*$/.test(payload.slice(1))) throw new BadLinkError();
    const bytes = fromBase64Url(payload.slice(1));
    if (kind === 'u') return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('Ta przeglądarka nie potrafi odczytać skompresowanego linku.');
    }
    return new TextDecoder('utf-8', { fatal: true }).decode(await pipe(bytes, new DecompressionStream('deflate-raw')));
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('Ta przeglądarka')) throw e;
    throw new BadLinkError();
  }
}

export function baseUrl(): string {
  return location.href.split('#')[0]!;
}

export async function buildPermalink(mode: Mode, source: string, base: string = baseUrl()): Promise<string> {
  const kod = await encodeProgram(source);
  return `${base}#/?tryb=${mode}&kod=${kod}`;
}

export interface SharedProgram {
  mode: Mode;
  payload: string;
}

/** Wyciąga z adresu tryb i zakodowany program (jeśli są). */
export function readPermalink(route: Route): SharedProgram | null {
  const kod = route.query.get('kod');
  if (!kod) return null;
  const tryb = route.query.get('tryb');
  return { mode: tryb === '3d' ? '3d' : '2d', payload: kod };
}
