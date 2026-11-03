import { describe, expect, test } from 'bun:test';
import { REFERENCE } from '../src/content/reference';
import { runProgram } from '../src/lang/interpreter';
import { STARTERS } from '../src/app/starters';

describe('reference examples', () => {
  const blocks = REFERENCE.flatMap((s) => s.blocks.map((b) => ({ section: s.id, b })));
  for (const { section, b } of blocks) {
    if (b.t !== 'code' && b.t !== 'cmd') continue;
    const source = b.t === 'code' ? b.source : b.example;
    const mode = b.mode ?? '2d';
    const label = b.t === 'cmd' ? `polecenie ${b.name}` : `${section}: ${source.split('\n')[0]}`;
    test(`${label} draws without a parse error`, () => {
      const r = runProgram(source, mode);
      if (section === 'bledy') {
        // the errors chapter shows a run-time error that keeps the first line
        expect(r.error?.message).toContain('Dzielenie przez zero');
        expect(r.segments.length).toBeGreaterThan(0);
        return;
      }
      expect(r.error).toBeNull();
      expect(r.segments.length).toBeGreaterThan(0);
    });
  }
});

describe('starter drafts', () => {
  test('both run cleanly', () => {
    expect(runProgram(STARTERS['2d'], '2d').error).toBeNull();
    expect(runProgram(STARTERS['3d'], '3d').error).toBeNull();
  });
});
