import { join } from 'node:path';
const p = Bun.spawn(['bun', 'run', join(import.meta.dir, 'serve.ts'), ...process.argv.slice(2)], { stdout: 'inherit', stderr: 'inherit' });
await p.exited;
