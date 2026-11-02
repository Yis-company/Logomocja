#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ "$(uname -s)" = Darwin ]; then
  exec caffeinate -i bun bench/queue.ts run "$@"
fi
exec bun bench/queue.ts run "$@"
