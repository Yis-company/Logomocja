# Agent environment. Any change here, to the CLI flags in bench/runners.ts, to
# bench/agent.ts or to the verification steps must bump bench/env/VERSION.
# Image tag: logomocja-bench:env-<VERSION>. The repo is mounted at run time.
FROM node:24.22.1-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git curl python3 \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g bun@1.4.4 @anthropic-ai/claude-code@2.1.310 @openai/codex@0.164.0 \
  && npm cache clean --force

# The agent runs as a regular user: Claude Code refuses to bypass permissions as root.
RUN useradd --create-home --shell /bin/bash agent \
  && mkdir -p /work /out /home/agent/.codex \
  && chown -R agent:agent /work /out /home/agent
USER agent
ENV HOME=/home/agent CODEX_HOME=/home/agent/.codex
WORKDIR /work
