import { LIMITS } from "../logo/types";
import { challenges, starter, type Challenge } from "./tasks";

export const CHALLENGE_KEY = "logomocja.challenges.v1";
export type ChallengeRecord = {
  version: number;
  draft: string;
  completed: boolean;
};
export type ChallengeRecords = Record<string, ChallengeRecord>;

export function readChallenges(
  storage: Pick<Storage, "getItem">,
): ChallengeRecords {
  let parsed: unknown;
  try {
    parsed = JSON.parse(storage.getItem(CHALLENGE_KEY) ?? "null");
  } catch {
    return {};
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
  const source = parsed as Record<string, unknown>;
  if (
    source.version !== 1 ||
    !source.records ||
    typeof source.records !== "object" ||
    Array.isArray(source.records)
  )
    return {};
  const records = source.records as Record<string, unknown>;
  const result: ChallengeRecords = {};
  for (const task of challenges) {
    const record = records[task.id] as Partial<ChallengeRecord> | null;
    if (
      record?.version === task.version &&
      typeof record.draft === "string" &&
      record.draft.length <= LIMITS.source &&
      typeof record.completed === "boolean"
    )
      result[task.id] = {
        version: task.version,
        draft: record.draft,
        completed: record.completed,
      };
  }
  return result;
}

export function writeChallenges(
  storage: Pick<Storage, "setItem">,
  records: ChallengeRecords,
): boolean {
  try {
    storage.setItem(CHALLENGE_KEY, JSON.stringify({ version: 1, records }));
    return true;
  } catch {
    return false;
  }
}

export function recordFor(
  records: ChallengeRecords,
  task: Challenge,
): ChallengeRecord {
  return (
    records[task.id] ?? {
      version: task.version,
      draft: starter(task),
      completed: false,
    }
  );
}
