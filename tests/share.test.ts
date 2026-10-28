import { expect, test } from "bun:test";
import { decodeProgram, encodeProgram } from "../src/share";
import { EXAMPLES } from "../src/examples";

test("permalink payload round-trips", async () => {
  for (const e of EXAMPLES) {
    const p = await encodeProgram(e.source);
    expect(p).toMatch(/^[zu][A-Za-z0-9_-]*$/);
    expect(await decodeProgram(p)).toBe(e.source);
  }
});
