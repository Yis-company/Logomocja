// List prices in USD per million tokens, used only where the CLI reports no
// cost. The Claude CLI reports its own list-price cost; Codex reports none.
// Source: https://developers.openai.com/api/docs/pricing, standard tier,
// short context (≤272K input tokens per request), read on 2026-10-27.
// Cache writes are free on OpenAI, so they need no column.
import type { Tokens } from "./result";

export const prices: Record<string, { input: number; cachedInput: number; output: number }> = {
  "gpt-6-astra": { input: 10, cachedInput: 1, output: 50 },
  "gpt-6.1-sol": { input: 2, cachedInput: 0.1, output: 10 },
  "gpt-6.1-terra": { input: 1, cachedInput: 0.05, output: 5 },
};

export type Cost = { costUsd: number | null; costBasis: "cli" | "list" | null };

/** The CLI's own figure when it reports one, else an estimate at list prices. */
export function cost(model: string, parsed: { costUsd: number | null; tokens: Tokens }): Cost {
  if (parsed.costUsd !== null) return { costUsd: parsed.costUsd, costBasis: "cli" };
  const price = prices[model];
  if (!price) return { costUsd: null, costBasis: null };
  const { input, cachedInput, output } = parsed.tokens;
  const perMillion = input * price.input + cachedInput * price.cachedInput + output * price.output;
  return { costUsd: Math.round(perMillion) / 1_000_000, costBasis: "list" };
}
