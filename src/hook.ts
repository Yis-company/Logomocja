import { version } from "../package.json";
import { parse } from "./logo/parser";
import { Executor } from "./logo/runtime";
import { LogoError, type Mode, type Segment } from "./logo/types";

export type HookOutcome = {
  segments: Segment[];
  error: null | { message: string; line: number; column: number };
};
export type OpenRequest = { source: string; mode: Mode; resolve: (outcome: HookOutcome) => void };

/** The benchmark testing hook: interprets a program without touching the UI. */
export function run(source: string, mode: Mode): HookOutcome {
  let executor: Executor | null = null;
  try {
    executor = new Executor(parse(source, mode));
    while (!executor.done) executor.tick();
    return { segments: executor.snapshot().segments, error: null };
  } catch (cause) {
    const error =
      cause instanceof LogoError
        ? { message: cause.message, line: cause.span.line, column: cause.span.column }
        : { message: String(cause), line: 1, column: 1 };
    return { segments: executor ? executor.snapshot().segments : [], error };
  }
}

/** Loads the program into the studio, runs it to the end and resolves once it is drawn. */
export function open(source: string, mode: Mode): Promise<HookOutcome> {
  return new Promise((resolve) => {
    window.dispatchEvent(new CustomEvent<OpenRequest>("logomocja:open", { detail: { source, mode, resolve } }));
  });
}

declare global {
  interface Window {
    logomocja?: { version: string; run: typeof run; open: typeof open };
  }
  interface WindowEventMap {
    "logomocja:open": CustomEvent<OpenRequest>;
  }
}
if (typeof window !== "undefined") window.logomocja = { version, run, open };
