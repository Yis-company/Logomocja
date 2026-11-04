import { execFileSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createQueue, parseMatrix, queueStatus, runQueue } from "./queue";

function fixture(efforts = ["high", "low"], layer?: string) {
  const root = mkdtempSync(join(tmpdir(), "logomocja-queue-"));
  const runner = join(root, "runner.mjs");
  writeFileSync(
    runner,
    `
    import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
    import { parseArgs } from 'node:util';
    const { values: v } = parseArgs({ options: {
      model: { type: 'string' }, effort: { type: 'string' }, prompt: { type: 'string' }, layer: { type: 'string' },
      'run-info': { type: 'string' }, 'no-push': { type: 'boolean' }
    }});
    const calls = 'calls.txt';
    appendFileSync(calls, 'start ' + v.effort + ' no-push=' + !!v['no-push'] + '\\n');
    const id = v.effort + '-' + readFileSync(calls, 'utf8').split('\\n').length;
    writeFileSync(v['run-info'], JSON.stringify({ id, transcript: 'unused' }));
    await new Promise(r => setTimeout(r, 10));
    mkdirSync('bench/results/' + id, { recursive: true });
    writeFileSync('bench/results/' + id + '/result.json', JSON.stringify({
      id, layer: v.layer ? { id: v.layer } : undefined, task: 'app', prompt: v.prompt, runner: 'codex', model: 'fixture', effort: v.effort,
      status: v.effort === 'auth' ? 'failed' : v.effort === 'partial' ? 'partial' : 'completed', verify: { built: true },
      statusDetail: v.effort === 'auth' ? 'success: Failed to authenticate. API Error: 401 Invalid bearer token' : v.effort === 'partial' ? 'quota limit reached' : 'success'
    }));
    appendFileSync(calls, 'end ' + v.effort + '\\n');
    if (v.effort === 'crash') process.exit(1);
  `,
  );
  const dir = createQueue(
    efforts.map((effort) => ({ model: "codex:fixture", effort })),
    "v2",
    true,
    root,
    layer,
  );
  const options = {
    command: [process.execPath, runner],
    containerRunning: () => false,
  };
  const state = () => JSON.parse(readFileSync(join(dir, "state.json"), "utf8"));
  return { root, dir, options, state };
}

describe("benchmark queue", () => {
  it("validates the entire matrix before starting", () => {
    expect(() => parseMatrix([])).toThrow(/nonempty/);
    for (const bad of [
      null,
      { model: "gemini:other" },
      { model: "codex:ok", effort: "high\nsecret" },
      { model: "codex:ok", token: "no" },
    ])
      expect(() => parseMatrix([{ model: "codex:ok" }, bad])).toThrow(
        /entry 2/,
      );
    expect(parseMatrix([{ model: "claude:fixture" }])[0].effort).toBeNull();
  });
  it("runs sequentially, persists results, forwards no-push, and skips completed work on resume", async () => {
    const f = fixture();
    expect(await runQueue(f.dir, false, f.options)).toBe(true);
    expect(readFileSync(join(f.root, "calls.txt"), "utf8")).toBe(
      "start high no-push=true\nend high\nstart low no-push=true\nend low\n",
    );
    expect(f.state().entries.map((e: { status: string }) => e.status)).toEqual([
      "completed",
      "completed",
    ]);
    expect(queueStatus(f.dir).join("\n")).toMatch(
      /completed.*codex:fixture.*high.*high-/,
    );
    expect(await runQueue(f.dir, false, f.options)).toBe(true);
    expect(
      readFileSync(join(f.root, "calls.txt"), "utf8").split("\n"),
    ).toHaveLength(5);
  });
  it.each(["impeccable-v1", "tdd-v1", "impeccable-tdd-v1"])("preserves %s and rejects results from another condition on resume", async (layer) => {
    const f = fixture(["high"], layer);
    expect(await runQueue(f.dir, false, f.options)).toBe(true);
    expect(f.state().layer).toBe(layer);
    expect(await runQueue(f.dir, false, f.options)).toBe(true);
    const info = JSON.parse(readFileSync(join(f.dir, "1.run.json"), "utf8"));
    const file = join(f.root, "bench/results", info.id, "result.json");
    const saved = JSON.parse(readFileSync(file, "utf8"));
    expect(saved.layer.id).toBe(layer);
    saved.layer.id = "another-condition";
    writeFileSync(file, JSON.stringify(saved));
    await expect(runQueue(f.dir, false, f.options)).rejects.toThrow(/missing or invalid/);
    delete saved.layer;
    writeFileSync(file, JSON.stringify(saved));
    await expect(runQueue(f.dir, false, f.options)).rejects.toThrow(/missing or invalid/);
  });
  it("requires both a successful exit and a completed result; failures do not block later entries", async () => {
    const f = fixture(["partial", "crash", "high"]);
    expect(await runQueue(f.dir, false, f.options)).toBe(false);
    expect(f.state().entries.map((e: { status: string }) => e.status)).toEqual([
      "failed",
      "failed",
      "completed",
    ]);
    await runQueue(f.dir, false, f.options);
    expect(
      readFileSync(join(f.root, "calls.txt"), "utf8").split("\n"),
    ).toHaveLength(7);
    await runQueue(f.dir, true, f.options);
    expect(
      readFileSync(join(f.root, "calls.txt"), "utf8").split("\n"),
    ).toHaveLength(11);
  });
  it("marks a dead attempt interrupted and requires explicit retry", async () => {
    const f = fixture(["high"]);
    const state = f.state();
    state.entries[0].status = "running";
    writeFileSync(join(f.dir, "state.json"), JSON.stringify(state));
    writeFileSync(join(f.dir, "lock"), "0");
    expect(await runQueue(f.dir, false, f.options)).toBe(false);
    expect(f.state().entries[0].status).toBe("interrupted");
    expect(await runQueue(f.dir, true, f.options)).toBe(true);
  });
  it.each(["partial", "auth"])("leaves later entries queued after %s provider failures, resuming without retrying the failed attempt", async (failure) => {
    const f = fixture([failure, "high"]);
    expect(await runQueue(f.dir, false, { ...f.options, stopOnLimit: true })).toBe(false);
    expect(f.state().entries.map((e: { status: string }) => e.status)).toEqual(["failed", "queued"]);
    expect(await runQueue(f.dir, false, { ...f.options, stopOnLimit: true })).toBe(false);
    expect(f.state().entries.map((e: { status: string }) => e.status)).toEqual(["failed", "completed"]);
    expect(readFileSync(join(f.root, "calls.txt"), "utf8")).toBe(
      `start ${failure} no-push=true\nend ${failure}\nstart high no-push=true\nend high\n`,
    );
  });
  it("refuses a live queue or orphaned container instead of duplicating work", async () => {
    const f = fixture(["high"]);
    writeFileSync(join(f.dir, "lock"), String(process.pid));
    await expect(runQueue(f.dir, true, f.options)).rejects.toThrow(
      /already running/,
    );
    writeFileSync(join(f.dir, "lock"), "0");
    const state = f.state();
    state.entries[0].status = "running";
    writeFileSync(join(f.dir, "state.json"), JSON.stringify(state));
    writeFileSync(
      join(f.dir, "1.run.json"),
      JSON.stringify({ id: "orphan", transcript: "unused" }),
    );
    await expect(
      runQueue(f.dir, true, { ...f.options, containerRunning: () => true }),
    ).rejects.toThrow(/still running/);
  });
  it("does not trust a completed entry if its result disappears", async () => {
    const f = fixture(["high"]);
    const state = f.state();
    state.entries[0].status = "completed";
    writeFileSync(join(f.dir, "state.json"), JSON.stringify(state));
    await expect(runQueue(f.dir, false, f.options)).rejects.toThrow(
      /missing or invalid/,
    );
  });
  it("labels inactivity as possible stalling and dead processes as interrupted, without changing state", () => {
    const f = fixture(["high", "low"]);
    const state = f.state();
    state.entries[0] = {
      ...state.entries[0],
      status: "running",
      pid: process.pid,
    };
    state.entries[1].status = "running";
    writeFileSync(join(f.dir, "state.json"), JSON.stringify(state));
    writeFileSync(join(f.dir, "1.log"), "quiet");
    const before = readFileSync(join(f.dir, "state.json"), "utf8");
    const rows = queueStatus(f.dir, 15, Date.now() + 16 * 60_000);
    expect(rows[0]).toContain("possibly stalled");
    expect(rows[1]).toContain("interrupted");
    expect(readFileSync(join(f.dir, "state.json"), "utf8")).toBe(before);
  });
  it.each(["Darwin", "Linux"])(
    "wraps the queue with caffeinate only on %s",
    (platform) => {
      const dir = mkdtempSync(join(tmpdir(), "logomocja-awake-"));
      const bin = join(dir, "bin");
      mkdirSync(bin);
      for (const [name, script] of Object.entries({
        uname: `echo ${platform}`,
        caffeinate: 'echo "awake $*" >> "$CALLS"; shift; exec "$@"',
        bun: 'echo "bun $*" >> "$CALLS"',
      })) {
        writeFileSync(join(bin, name), `#!/bin/sh\n${script}\n`);
        chmodSync(join(bin, name), 0o755);
      }
      const calls = join(dir, "calls");
      execFileSync(
        "bash",
        [resolve("bench/queue.sh"), "--matrix", "example.json", "--no-push"],
        {
          env: {
            ...process.env,
            PATH: `${bin}:${process.env.PATH}`,
            CALLS: calls,
          },
        },
      );
      const text = readFileSync(calls, "utf8");
      expect(text.includes("awake -i bun bench/queue.ts run")).toBe(
        platform === "Darwin",
      );
      expect(text).toContain(
        "bun bench/queue.ts run --matrix example.json --no-push",
      );
    },
  );
});
