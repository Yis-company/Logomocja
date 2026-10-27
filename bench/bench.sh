#!/usr/bin/env bash
# Runs one benchmark task. Usage: bench/bench.sh --model claude:claude-opus-5-5 [--task app|tests] [--effort high]
# Auth: CLAUDE_CODE_OAUTH_TOKEN or CLAUDE_CODE_OAUTH_TOKEN_FILE for Claude; ~/.codex/auth.json for Codex.
set -euo pipefail
cd "$(dirname "$0")/.."
exec bun bench/run.ts "$@"
