#!/bin/sh
set -eu

cd "$(git rev-parse --show-toplevel)"
for tool in bun node; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Pre-push requires $tool on PATH." >&2
    exit 1
  fi
done
for tool in biome tsc vitest; do
  if [ ! -x "node_modules/.bin/$tool" ]; then
    echo "Pre-push requires installed dependencies (missing $tool). Run bun install." >&2
    exit 1
  fi
done

for check in lint typecheck test; do
  echo "Pre-push: bun run $check"
  if ! bun run "$check"; then
    echo "Pre-push failed: bun run $check" >&2
    exit 1
  fi
done
