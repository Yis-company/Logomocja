/** Tryb deweloperski: buduje stronę, serwuje ją i przebudowuje po zmianie plików w src/. */
import { watch } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');
let building = false;
let again = false;

async function build(): Promise<void> {
  if (building) {
    again = true;
    return;
  }
  building = true;
  const p = Bun.spawn(['bun', 'run', 'build.ts'], { cwd: root, stdout: 'inherit', stderr: 'inherit', env: { ...process.env, BASE_PATH: '/' } });
  await p.exited;
  building = false;
  if (again) {
    again = false;
    await build();
  }
}

await build();
let timer: ReturnType<typeof setTimeout> | undefined;
watch(join(root, 'src'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => void build(), 150);
});
Bun.spawn(['bun', 'run', 'scripts/serve.ts', '--base', '/'], { cwd: root, stdout: 'inherit', stderr: 'inherit' });
