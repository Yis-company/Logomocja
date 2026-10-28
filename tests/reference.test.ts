import { describe, expect, test } from 'bun:test';
import { runSource } from '../src/logo';
import { COMMAND_REFERENCE } from '../src/logo/reference';

describe('command reference examples', () => {
  for (const entry of COMMAND_REFERENCE) {
    test(`${entry.names[0]} example runs`, () => {
      const r = runSource(entry.example, entry.mode);
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }
});
