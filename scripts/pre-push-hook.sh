#!/bin/sh
set -eu
cd "$(git rev-parse --show-toplevel)"
exec sh scripts/pre-push.sh
