Coverage checklist (round 1 audited before adding round 2)

- [x] Case folding, Polish accents and command aliases: covered by both suites.
- [x] Decimal syntax, invalid number forms, comments and structural punctuation: covered by both.
- [x] Expression precedence, associativity, unary signs and compact/spaced operators: covered by both. Added every operator with tabs, newlines and asymmetric whitespace; legacy operands and signed call boundaries.
- [x] Exact comparisons and all six operators: covered by both. Added adjacent signed operands, floating inequality, exact binary fractions and signed zero.
- [x] Division, overflow, unassigned names and argument-start error positions: covered by both. Added assignment, condition RHS, second call argument, turns and errors after procedure-local clear.
- [x] Default geometry, zero and negative movement, style and pen persistence: covered by both.
- [x] Home resets orientation and preserves style; clear preserves all state except segments: covered by both. Added rolled 3D state and global-count/clear interaction.
- [x] Repeat bounds, expression counts, evaluation once and innermost lexical counters: covered by both. Added recursive conditional counters, early callee stop, empty inner loops and repeated calls.
- [x] Globals, parameters, local declarations, reassignment, shadowing, forward declarations and unassigned paths: covered by both. Added longer recursive unwinding, parameter/global isolation, skipped nested declarations and 25 successful calls before a local-lifetime failure.
- [x] Conditional selection, nesting and stop propagation: covered by both. Added validation after procedure stop and nested else-branch depth boundaries.
- [x] Procedure headers, legacy parameters, positional expression arguments, forward calls, recursion and duplicate/nested definitions: covered by both. Added multiline signed arguments and local collisions with later procedures.
- [x] Whole-program validation and retention after runtime faults: covered by both. New cases distinguish these in dead bodies, calls and clearing.
- [x] 3D signs, aliases, composition and prohibition in 2D: covered by both. Added long fractional rotation/inverse and conjugation sequences, alternate orders, large signed angles and three-axis probes.
- [x] Source length 50000/50001 and token count 10000/10001: covered by both.
- [x] Bracket depth 32/33 and active call/repeat frames 32/33: covered by both. Added nested else branches; the first bracket of the 33rd conditional already exceeds depth.
- [x] Executed-operation limit and body bookkeeping: covered away from the boundary by both. Added exactly 10000 operations ending in stop, empty-body overflow and clear failing to reset the budget. Overflow cases omit columns where bookkeeping attribution is unspecified.
- [x] Coordinate bounds: covered by both. Added negative Z, clear before overflow and a legal vector longer than 100000 whose individual coordinates remain in range.
- [x] Kept segment collection after clear: covered by both. An independent 10001-kept-segment test is unreachable: each drawing command produces at most one segment and consumes an operation, so the operation limit prevents exceeding the segment limit. No expectation assumes otherwise.

Review result: no sufficiently supported disputes in either original suite.
Round 2: 79 new sources; none occurs in either original suite.
