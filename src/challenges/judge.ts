import { appendCall, parse } from "../logo/parser";
import { Executor } from "../logo/runtime";
import {
  LIMITS,
  LogoError,
  type Program,
  type Segment,
  type Vec3,
} from "../logo/types";
import { type Challenge, expectedDrawing } from "./tasks";

export type CaseResult = {
  args: readonly number[];
  passed: boolean;
  message: string;
  expected: Segment[];
  actual: Segment[];
};
export type JudgeResult = {
  cases: CaseResult[];
  passed: number;
  error?: LogoError;
};
const TOLERANCE = 1e-5;
const distance = (a: Vec3, b: Vec3) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const subtract = (a: Vec3, b: Vec3): Vec3 => [
  a[0] - b[0],
  a[1] - b[1],
  a[2] - b[2],
];
type Interval = [number, number];
type Carrier = {
  origin: Vec3;
  unit: Vec3;
  expected: Interval[];
  actual: Interval[];
};
function projection(carrier: Carrier, segment: Segment): Interval | null {
  const from = subtract(segment.from, carrier.origin);
  const to = subtract(segment.to, carrier.origin);
  const start = dot(from, carrier.unit);
  const end = dot(to, carrier.unit);
  const perpendicular = (v: Vec3, position: number) =>
    Math.hypot(
      v[0] - position * carrier.unit[0],
      v[1] - position * carrier.unit[1],
      v[2] - position * carrier.unit[2],
    );
  if (
    perpendicular(from, start) > TOLERANCE ||
    perpendicular(to, end) > TOLERANCE
  )
    return null;
  return [Math.min(start, end), Math.max(start, end)];
}
function merged(intervals: readonly Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result: Interval[] = [];
  for (const [start, end] of sorted) {
    const last = result.at(-1);
    if (last && start <= last[1] + TOLERANCE) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}
function covers(
  whole: readonly Interval[],
  parts: readonly Interval[],
): boolean {
  let cursor = 0;
  for (const [start, end] of parts) {
    while (cursor < whole.length && whole[cursor][1] < start - TOLERANCE)
      cursor++;
    if (
      cursor >= whole.length ||
      whole[cursor][0] > start + TOLERANCE ||
      whole[cursor][1] < end - TOLERANCE
    )
      return false;
  }
  return true;
}

export function validateSource(source: string, task: Challenge): Program {
  const program = parse(source, task.mode);
  if (program.instructions.length)
    throw new LogoError(
      "W wyzwaniu wpisz tylko definicje procedur. Usuń polecenia poza nimi.",
      program.instructions[0].span,
    );
  const definition = program.definitions[task.id];
  if (!definition)
    throw new LogoError(
      `Zdefiniuj procedurę „${task.id}” z parametrami ${task.params.map((p) => `:${p}`).join(" ")}.`,
    );
  if (definition.params.length !== task.params.length)
    throw new LogoError(
      `Procedura „${task.id}” wymaga ${task.params.length} parametrów.`,
      definition.span,
    );
  return program;
}

export class GeometryComparison {
  private carriers: Carrier[] = [];
  private actualIndex = 0;
  private carrierIndex = 0;
  comparisons = 0;
  failure: string | null = null;
  done = false;
  constructor(
    expected: readonly Segment[],
    private actual: readonly Segment[],
  ) {
    for (const segment of expected) {
      const length = distance(segment.from, segment.to);
      if (length <= TOLERANCE) continue;
      let carrier = this.carriers.find(
        (item) => projection(item, segment) !== null,
      );
      if (!carrier) {
        carrier = {
          origin: segment.from,
          unit: subtract(segment.to, segment.from).map(
            (value) => value / length,
          ) as Vec3,
          expected: [],
          actual: [],
        };
        this.carriers.push(carrier);
      }
      carrier.expected.push(projection(carrier, segment) as Interval);
    }
    for (const carrier of this.carriers)
      carrier.expected = merged(carrier.expected);
  }

  /** Process a bounded number of carrier comparisons; returns true when complete. */
  advance(maxComparisons = 2_000): boolean {
    let used = 0;
    while (!this.done && used < maxComparisons) {
      if (this.actualIndex >= this.actual.length) {
        for (const carrier of this.carriers) {
          const actual = merged(carrier.actual);
          const missing = !covers(actual, carrier.expected);
          const extra = !covers(carrier.expected, actual);
          if (missing || extra) {
            this.failure = `${missing ? "Brakuje" : "Dodatkowy"} odcinek przy (${carrier.origin.map((n) => +n.toFixed(1)).join(", ")}).`;
            break;
          }
        }
        this.done = true;
        continue;
      }
      const segment = this.actual[this.actualIndex];
      if (distance(segment.from, segment.to) <= TOLERANCE) {
        this.actualIndex++;
        this.carrierIndex = 0;
        continue;
      }
      const carrier = this.carriers[this.carrierIndex];
      if (!carrier) {
        this.failure = `Dodatkowy odcinek przy (${segment.from.map((n) => +n.toFixed(1)).join(", ")}).`;
        this.done = true;
        continue;
      }
      const interval = projection(carrier, segment);
      this.comparisons++;
      used++;
      if (interval) {
        carrier.actual.push(interval);
        this.actualIndex++;
        this.carrierIndex = 0;
      } else this.carrierIndex++;
    }
    return this.done;
  }
}

export function compareGeometry(
  expected: readonly Segment[],
  actual: readonly Segment[],
): { passed: boolean; message: string; comparisons: number } {
  const comparison = new GeometryComparison(expected, actual);
  while (!comparison.advance()) {
    /* Bounded per call; synchronous helper for tests. */
  }
  return {
    passed: !comparison.failure,
    message: comparison.failure ?? "Rysunek jest poprawny.",
    comparisons: comparison.comparisons,
  };
}

export type JudgeProgress = {
  completed: number;
  total: number;
  latest?: CaseResult;
};
export type JudgeOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: JudgeProgress) => void;
  onSample?: (segments: Segment[]) => void;
};
const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export async function runChallenge(
  source: string,
  task: Challenge,
  argsList: readonly (readonly number[])[],
  options: JudgeOptions = {},
): Promise<JudgeResult | null> {
  let program: Program;
  try {
    program = validateSource(source, task);
  } catch (cause) {
    return {
      cases: [],
      passed: 0,
      error:
        cause instanceof LogoError
          ? cause
          : new LogoError("Nie udało się odczytać programu."),
    };
  }
  const cases: CaseResult[] = [];
  let ticks = 0;
  let comparisons = 0;
  for (const args of argsList) {
    if (options.signal?.aborted) return null;
    const expected = expectedDrawing(task, args);
    const runtime = new Executor(appendCall(program, task.id, [...args]));
    let failure: string | null = null;
    let lastYield = performance.now();
    try {
      while (!runtime.done) {
        runtime.tick();
        if (++ticks > 60_000)
          throw new LogoError(
            "Przekroczono łączny limit 60 000 kroków sprawdzania.",
          );
        if (performance.now() - lastYield >= 4) {
          await nextFrame();
          if (options.signal?.aborted) return null;
          lastYield = performance.now();
        }
      }
    } catch (cause) {
      if (cause instanceof LogoError)
        failure = `Wiersz ${cause.span.line}, kolumna ${cause.span.column}: ${cause.message}`;
      else failure = "Nie udało się wykonać programu.";
    }
    const actual = runtime.snapshot().segments;
    options.onSample?.(actual);
    if (!failure) {
      const comparison = new GeometryComparison(expected, actual);
      while (!comparison.done) {
        const before = comparison.comparisons;
        comparison.advance(1_000);
        comparisons += comparison.comparisons - before;
        if (comparisons > 8_000_000) {
          failure = "Przekroczono limit porównań rysunku.";
          break;
        }
        if (performance.now() - lastYield >= 4) {
          await nextFrame();
          if (options.signal?.aborted) return null;
          lastYield = performance.now();
        }
      }
      failure ??= comparison.failure;
    }
    const result = {
      args,
      passed: !failure,
      message: failure ?? "Rysunek jest poprawny.",
      expected,
      actual,
    };
    cases.push(result);
    options.onProgress?.({
      completed: cases.length,
      total: argsList.length,
      latest: result,
    });
    await nextFrame();
  }
  if (options.signal?.aborted) return null;
  return { cases, passed: cases.filter((result) => result.passed).length };
}

export function validateCaseArgs(
  task: Challenge,
  args: readonly number[],
): boolean {
  return (
    args.length === task.params.length &&
    args.every(
      (value, i) =>
        Number.isInteger(value) &&
        value >= (i === 0 && task.params[0] === "n" ? 1 : 10) &&
        value <= (i === 0 && task.params[0] === "n" ? 12 : 120),
    )
  );
}
export const CASE_LIMITS = {
  ticks: 60_000,
  comparisons: 8_000_000,
  segments: LIMITS.segments,
};
