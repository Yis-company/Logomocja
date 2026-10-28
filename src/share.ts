// Permalink payloads: "z" + base64url(deflate-raw(utf8)) when CompressionStream exists, else "u" + base64url(utf8).

function b64url(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unb64url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

async function pipe(bytes: Uint8Array, stream: TransformStream<Uint8Array, Uint8Array>): Promise<Uint8Array> {
  const res = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await res.arrayBuffer());
}

export async function encodeProgram(src: string): Promise<string> {
  const bytes = new TextEncoder().encode(src);
  if (typeof CompressionStream !== "undefined") {
    try {
      return "z" + b64url(await pipe(bytes, new CompressionStream("deflate-raw") as unknown as TransformStream<Uint8Array, Uint8Array>));
    } catch {}
  }
  return "u" + b64url(bytes);
}

export async function decodeProgram(payload: string): Promise<string> {
  const kind = payload[0];
  const bytes = unb64url(payload.slice(1));
  if (kind === "z") {
    const raw = await pipe(bytes, new DecompressionStream("deflate-raw") as unknown as TransformStream<Uint8Array, Uint8Array>);
    return new TextDecoder().decode(raw);
  }
  if (kind === "u") return new TextDecoder().decode(bytes);
  throw new Error("bad payload");
}
