# Benchmark environment. Any change here, or to the CLI flags, runner, judge or
# tasks, must bump bench/env/VERSION. Image tag: logomocja-bench:env-<VERSION>.
FROM node:24.22.1-bookworm-slim

# The slim image has no CA store; the Codex CLI needs one for TLS.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/*
RUN npm install -g bun@1.4.4 @anthropic-ai/claude-code@2.1.310 @openai/codex@0.164.0 \
  && npm cache clean --force

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY src/logo src/logo
COPY src/challenges src/challenges
COPY bench bench

# Fresh homes for both CLIs: no host settings, memory, skills or MCP servers.
ENV HOME=/home/bench CODEX_HOME=/auth/codex
RUN mkdir -p /home/bench /auth/codex /work
# The model's working directory stays empty.
WORKDIR /work
ENTRYPOINT ["bun", "/app/bench/run.ts"]
