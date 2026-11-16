#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ "$(uname -s)" = Darwin ]; then
  exec caffeinate -i bun bench/queue.ts run "$@"
fi
# Linux: a transient user service outlives the terminal or app that started it.
if ! command -v systemd-run >/dev/null || ! systemctl --user show-environment >/dev/null 2>&1; then
  echo "A systemd user manager is required so the queue survives this session. Nothing was started." >&2
  exit 1
fi
unit="logomocja-bench-$(date -u +%Y%m%d-%H%M%S)"
env_args=(--setenv=PATH)
for name in CLAUDE_CODE_OAUTH_TOKEN CLAUDE_CODE_OAUTH_TOKEN_FILE; do
  if [ -n "${!name:-}" ]; then env_args+=("--setenv=$name"); fi
done
systemd-run --user --quiet --collect --unit "$unit" --working-directory "$PWD" "${env_args[@]}" \
  bun bench/queue.ts run "$@"
echo "Started $unit. Follow: journalctl --user -fu $unit. Status: bun run bench:status"
