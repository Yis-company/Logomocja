import type { Mode } from '../lang/ast';
import { LIMITS } from '../lang';

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 2000);
}

export function downloadProgram(source: string, name: string): void {
  downloadBlob(new Blob([source], { type: 'text/plain;charset=utf-8' }), name);
}

export function slug(s: string): string {
  return (
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ł/g, 'l')
      .replace(/Ł/g, 'L')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'program'
  );
}

export function programFileName(mode: Mode, title?: string): string {
  return `${slug(title ?? 'logomocja')}-${mode}.logo`;
}

const THREE_D_WORDS = /(^|[^\p{L}\p{N}_])(gora|góra|dol|dół|pp|pl|przechylprawo|przechyllewo|pitchup|pitchdown|rr|rl|rollright|rollleft)(?![\p{L}\p{N}_])/iu;

/** Zgaduje tryb dla wczytywanego pliku: nazwa pliku lub użycie poleceń 3D. */
export function guessMode(fileName: string, source: string, current: Mode): Mode {
  if (/(^|[^a-z0-9])3d(\.|$|[^a-z0-9])/i.test(fileName)) return '3d';
  if (/(^|[^a-z0-9])2d(\.|$|[^a-z0-9])/i.test(fileName)) return '2d';
  const noComments = source.replace(/;.*$/gm, '');
  if (THREE_D_WORDS.test(noComments)) return '3d';
  return current;
}

export const MAX_FILE_BYTES = 1_000_000;

export async function readTextFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error(`Plik jest zbyt duży (${Math.round(file.size / 1024)} KB). Program może mieć najwyżej ${LIMITS.maxChars.toLocaleString('pl-PL')} znaków.`);
  const text = await file.text();
  return text.replace(/^﻿/, '');
}
