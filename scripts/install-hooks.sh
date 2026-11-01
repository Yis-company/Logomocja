#!/bin/sh
set -eu

cd "$(git rev-parse --show-toplevel)"
if git config --get core.hooksPath >/dev/null; then
  echo "Cannot install pre-push hook: core.hooksPath is configured. Preserve your hooks and resolve the configuration before running bun run prepare." >&2
  exit 1
fi

hooks_dir=$(git rev-parse --git-path hooks)
hook="$hooks_dir/pre-push"
mkdir -p "$hooks_dir"
if [ -e "$hook" ] || [ -L "$hook" ]; then
  if [ -L "$hook" ] || ! cmp -s scripts/pre-push-hook.sh "$hook"; then
    echo "Cannot install pre-push hook: $hook already exists. Preserve it and resolve the conflict before running bun run prepare." >&2
    exit 1
  fi
else
  cp scripts/pre-push-hook.sh "$hook"
fi
chmod +x "$hook"
