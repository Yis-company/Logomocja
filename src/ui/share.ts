import type { Mode } from "../core/interp";

const b64 = (bytes: Uint8Array) => {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const unb64 = (s: string) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

async function pipe(bytes: Uint8Array, stream: { readable: ReadableStream; writable: WritableStream }): Promise<Uint8Array> {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream as TransformStream));
  return new Uint8Array(await out.arrayBuffer());
}

/** Kod programu do adresu: „z.” + deflate, gdy przeglądarka umie i gdy to krótsze, inaczej „b.” + UTF-8. */
export async function encodeSource(source: string): Promise<string> {
  const raw = new TextEncoder().encode(source);
  const plain = "b." + b64(raw);
  try {
    if (typeof CompressionStream !== "undefined") {
      const packed = "z." + b64(await pipe(raw, new CompressionStream("deflate-raw")));
      if (packed.length < plain.length) return packed;
    }
  } catch {
    // zostaje wersja bez kompresji
  }
  return plain;
}

export async function decodeSource(code: string): Promise<string> {
  const kind = code.slice(0, 2);
  const bytes = unb64(code.slice(2));
  if (kind === "z.") return new TextDecoder().decode(await pipe(bytes, new DecompressionStream("deflate-raw")));
  if (kind === "b.") return new TextDecoder().decode(bytes);
  throw new Error("format");
}

export async function permalink(source: string, mode: Mode): Promise<string> {
  const base = location.href.split("#")[0];
  return `${base}#/?tryb=${mode}&kod=${await encodeSource(source)}`;
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function slug(name: string): string {
  const map: Record<string, string> = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };
  const s = name.toLowerCase().replace(/[ąćęłńóśźż]/g, (c) => map[c]).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s || "program";
}
