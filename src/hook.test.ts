import { describe, expect, it } from "vitest";
import { run } from "./hook";

describe("benchmark hook", () => {
  it("returns segments in drawing order with pen state", () => {
    const { segments, error } = run('kolor "#FF0000"\npowtorz 2 [np 10 pw 90]', "2d");
    expect(error).toBeNull();
    expect(segments).toEqual([
      { from: [0, 0, 0], to: [0, 10, 0], color: "#FF0000", width: 3 },
      { from: [0, 10, 0], to: [10, 10, 0], color: "#FF0000", width: 3 },
    ]);
  });

  it("reports parse errors with position and no segments", () => {
    expect(run("np 10\ngora 90", "2d")).toEqual({
      segments: [],
      error: { message: expect.stringMatching(/3D/), line: 2, column: 1 },
    });
  });

  it("keeps what was drawn before a run-time error", () => {
    const outcome = run("np 10\npowtorz 10000 [np 1]", "2d");
    expect(outcome.error?.line).toBe(2);
    expect(outcome.segments.length).toBeGreaterThan(1);
  });
});
