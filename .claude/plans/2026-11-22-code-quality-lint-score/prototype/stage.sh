#!/usr/bin/env bash
# Copy each app's product source (no tests, configs, build scripts) unchanged into stage/<id>
# and record the staged file list per app. Usage: stage.sh <scratch-dir-with-corpus>
set -euo pipefail
S=$1
rm -rf "$S/stage" && mkdir -p "$S/stage"
for app in "$S"/corpus/*/; do
  id=$(basename "$app")
  (cd "$app" && find . \( -name node_modules -o -name dist -o -name tests -o -name test -o -name __tests__ -o -name scripts -o -name e2e \) -prune -o -type f \
    \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' -o -name '*.mjs' \) \
    ! -name '*.test.*' ! -name '*.spec.*' ! -name '*.config.*' ! -name 'build.*' ! -name '*.d.ts' -print | sort) > "$S/stage-$id.files"
  while read -r f; do mkdir -p "$S/stage/$id/$(dirname "$f")"; cp "$app/$f" "$S/stage/$id/$f"; done < "$S/stage-$id.files"
done
ls "$S/stage" | wc -l
