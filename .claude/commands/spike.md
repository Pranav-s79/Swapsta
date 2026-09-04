---
description: Stage 3 (10-25) — prove the riskiest technical assumption
---

Run **Stage 3 — PROVE CORE TECH** of the 60-Minute Engineering Loop.

Read the Critical Technical Question in `design_process/BUILD.md`.

1. Run the **smallest possible experiment** that answers it. A test in `src/lib/` beats a UI
   you have to click through.
2. Use real representative inputs — a strong match, a weak match, and a near-miss.
3. Report the actual output. Not "it should work" — the observed result.

**Pivot rule.** If it is not proven after ~15 minutes, move down this ladder rather than
retrying the same approach:

```text
SIMPLIFY → MOCK → REPLACE → CUT
```

Say which rung you are on and why. Then record the answer and any pivot in the
`design_process/BUILD.md` decision log.

Do not build UI in this stage. Prove the assumption first.
