// Drobne narzędzia interfejsu: pamięć lokalna, powiadomienia, okna dialogowe, miniatury, kodowanie linków.
import type { Mode, Segment, Vec } from "../interp/machine";

export const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Brak elementu #${id}`);
  return el as T;
};

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const PREFIX = "logomocja:";
export const store = {
  get(key: string): string | null {
    try { return localStorage.getItem(PREFIX + key); } catch { return null; }
  },
  set(key: string, value: string): void {
    try { localStorage.setItem(PREFIX + key, value); } catch { /* pamięć niedostępna lub pełna */ }
  },
  del(key: string): void {
    try { localStorage.removeItem(PREFIX + key); } catch { /* nic */ }
  },
};

export function toast(message: string, action?: { label: string; run: () => void }, ms = 9000): void {
  const box = $("toasts");
  const el = document.createElement("div");
  el.className = "toast";
  const span = document.createElement("span");
  span.textContent = message;
  el.append(span);
  const close = () => el.remove();
  if (action) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-small";
    b.textContent = action.label;
    b.addEventListener("click", () => { close(); action.run(); });
    el.append(b);
  }
  const x = document.createElement("button");
  x.type = "button";
  x.className = "btn btn-icon btn-small";
  x.setAttribute("aria-label", "Zamknij powiadomienie");
  x.textContent = "×";
  x.addEventListener("click", close);
  el.append(x);
  while (box.children.length >= 3) box.firstElementChild!.remove();
  box.append(el);
  setTimeout(close, ms);
}

export function openDialog(dlg: HTMLDialogElement): void {
  if (dlg.open) return;
  if (typeof dlg.showModal === "function") dlg.showModal();
  else dlg.setAttribute("open", "");
}

export function confirmDialog(title: string, text: string, okLabel: string): Promise<boolean> {
  const dlg = $<HTMLDialogElement>("dlg-confirm");
  if (typeof dlg.showModal !== "function") return Promise.resolve(window.confirm(`${title}\n\n${text}`));
  $("confirm-title").textContent = title;
  $("confirm-text").textContent = text;
  $("confirm-ok").textContent = okLabel;
  dlg.returnValue = "cancel";
  return new Promise((resolve) => {
    dlg.addEventListener("close", () => resolve(dlg.returnValue === "ok"), { once: true });
    dlg.showModal();
    $("confirm-cancel").focus();
  });
}

export function download(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function encodeProgram(src: string): string {
  const bytes = new TextEncoder().encode(src);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x2000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x2000));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeProgram(code: string): string | null {
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "=".repeat((4 - (b64.length % 4)) % 4));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Miniatura rysunku jako SVG (3D w rzucie ukośnym). */
export function thumbSVG(segs: Segment[], mode: Mode, label: string): string {
  const az = 0.62, el = 0.42;
  const R: Vec = [Math.cos(az), Math.sin(az), 0];
  const U: Vec = [-Math.sin(az) * Math.sin(el), Math.cos(az) * Math.sin(el), Math.cos(el)];
  const P = (p: Vec): [number, number] =>
    mode === "3d" ? [p[0] * R[0] + p[1] * R[1], -(p[0] * U[0] + p[1] * U[1] + p[2] * U[2])] : [p[0], -p[1]];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const lines = segs.map((s) => {
    const a = P(s.from), b = P(s.to);
    x0 = Math.min(x0, a[0], b[0]); x1 = Math.max(x1, a[0], b[0]);
    y0 = Math.min(y0, a[1], b[1]); y1 = Math.max(y1, a[1], b[1]);
    return { a, b, s };
  });
  if (!lines.length) { x0 = y0 = -1; x1 = y1 = 1; }
  const size = Math.max(x1 - x0, y1 - y0, 1);
  const pad = size * 0.08;
  const k = size / 150;
  const groups = new Map<string, string>();
  const f = (n: number) => Math.round(n * 100) / 100;
  for (const { a, b, s } of lines) {
    const key = `${s.color}|${s.width}`;
    groups.set(key, (groups.get(key) ?? "") + `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`);
  }
  let paths = "";
  for (const [key, d] of groups) {
    const [color, width] = key.split("|");
    paths += `<path d="${d}" stroke="${color}" stroke-width="${f(Math.max(1.4, Number(width) * 0.8) * k)}"/>`;
  }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, half = size / 2 + pad;
  return `<svg class="thumb" viewBox="${f(cx - half)} ${f(cy - half)} ${f(half * 2)} ${f(half * 2)}" role="img" aria-label="${esc(label)}" fill="none" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

export function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    let done = false;
    const fin = () => { if (!done) { done = true; resolve(); } };
    requestAnimationFrame(() => requestAnimationFrame(fin));
    setTimeout(fin, 120);
  });
}
