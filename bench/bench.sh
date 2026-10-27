#!/usr/bin/env bash
# Runs the benchmark inside the versioned Docker image.
# Usage: bench/bench.sh --model claude:claude-opus-5-5 [--samples 1] [--effort high] [--probe]
# Auth: CLAUDE_CODE_OAUTH_TOKEN (or CLAUDE_CODE_OAUTH_TOKEN_FILE) for Claude;
#       ~/.codex/auth.json (ChatGPT login) is copied for Codex and removed afterwards.
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=$(tr -d '[:space:]' < bench/env/VERSION)
IMAGE="logomocja-bench:env-$VERSION"
if [ "${BENCH_REBUILD:-}" = 1 ] || ! docker image inspect "$IMAGE" >/dev/null 2>&1; then
  docker build -f bench/env/Dockerfile -t "$IMAGE" .
fi

AUTH=$(mktemp -d)
trap 'rm -rf "$AUTH"' EXIT
mkdir -p "$AUTH/codex" bench/results
if [ -f "$HOME/.codex/auth.json" ]; then cp "$HOME/.codex/auth.json" "$AUTH/codex/auth.json"; fi
: > "$AUTH/env"
if [ -n "${CLAUDE_CODE_OAUTH_TOKEN_FILE:-}" ]; then
  printf 'CLAUDE_CODE_OAUTH_TOKEN=%s\n' "$(tr -d '[:space:]' < "$CLAUDE_CODE_OAUTH_TOKEN_FILE")" >> "$AUTH/env"
elif [ -n "${CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then
  printf 'CLAUDE_CODE_OAUTH_TOKEN=%s\n' "$CLAUDE_CODE_OAUTH_TOKEN" >> "$AUTH/env"
fi

echo "Benchmarking app version $(jq -r .version package.json) at $(git rev-parse --short HEAD) ($(git branch --show-current || echo detached)) with $IMAGE" >&2
docker run --rm \
  --env-file "$AUTH/env" \
  -e BENCH_COMMIT="$(git rev-parse HEAD)" \
  -v "$PWD/bench/results:/app/bench/results" \
  -v "$AUTH/codex:/auth/codex" \
  "$IMAGE" "$@"
