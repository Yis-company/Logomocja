export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function downloadText(text: string, filename: string): void {
  downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), filename);
}

export const MAX_FILE_BYTES = 512 * 1024;

export interface PickedFile {
  name: string;
  text: string;
}

/** Odczytuje plik tekstowy; rzuca Error z polskim komunikatem, gdy plik się nie nadaje. */
export async function readTextFile(file: File): Promise<PickedFile> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`Plik „${file.name}” jest za duży (${Math.round(file.size / 1024)} KB).`);
  }
  let text = await file.text();
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  if (text.includes('\u0000')) {
    throw new Error(`Plik „${file.name}” nie jest plikiem tekstowym.`);
  }
  return { name: file.name, text };
}

export function pickFile(accept = '.logo,.txt,text/plain'): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    input.addEventListener('change', () => {
      resolve(input.files?.[0] ?? null);
      input.remove();
    });
    input.addEventListener('cancel', () => {
      resolve(null);
      input.remove();
    });
    document.body.appendChild(input);
    input.click();
  });
}

export function slug(s: string): string {
  return (
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ł/g, 'l')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'program'
  );
}
