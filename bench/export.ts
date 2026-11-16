import { chmodSync, chownSync, lstatSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Let the host group delete and read what this container user created in the export.
 * Entries owned by someone else (host files) already belong to the host. Stays non-root.
 */
export function shareExport(root: string, gid = lstatSync(root).gid): void {
  const uid = process.getuid?.();
  const share = (path: string) => {
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) throw Error(`Benchmark export contains a symbolic link: ${path}`);
    const dir = stat.isDirectory();
    if (stat.uid === uid) {
      chownSync(path, stat.uid, gid);
      chmodSync(path, (stat.mode & 0o7777) | (dir ? 0o070 : 0o040));
    }
    if (dir) for (const entry of readdirSync(path)) share(join(path, entry));
  };
  share(root);
}
