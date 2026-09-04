---
description: Stage 5-6 (45-60) — rehearse the demo flow and fix by priority
---

Run **Stage 5 — TEST + FIX** and **Stage 6 — DEMO PREP** of the 60-Minute Engineering Loop.

1. **Run the demo flow exactly as written** in the Demo Flow section of
   `design_process/BUILD.md` — same phrasing, same order, same clicks. Twice.
2. **Fix strictly in this priority order.** Do not fix a lower item while a higher one stands:

   ```text
   1. demo completely fails
   2. wrong result
   3. slow / unreliable
   4. confusing UX
   5. ugly UI
   6. minor polish
   ```

3. **Harden** only against demo failure: seed data, handle empty results, guard obvious
   crashes, provide fallbacks. The goal is removing failure sources, not hiding gaps.
4. **Check the Definition of Done** checklist in `design_process/BUILD.md` and tick what
   genuinely passes. Report anything still unticked rather than quietly leaving it.

Then state the demo in four beats: **Problem → Action → Intelligence → Result.**

A working ugly demo beats a polished broken one. Do not start new features here.
