---
description: Stage 2 (05-10) — classify MUST/SHOULD/CUT and pick the architecture
---

Run **Stage 2 — DESIGN + CUT SCOPE** of the 60-Minute Engineering Loop.

Read `design_process/BUILD.md` and the current state of `src/`.

1. **Classify every candidate feature** as MUST / SHOULD / CUT.
   - MUST = the Demo Contract fails without it. Be ruthless; most things are not MUST.
   - SHOULD = improves the demo, not required.
   - CUT = not this hour.
2. **Simplification pass** — for each MUST ask: *what is the simplest implementation that
   still proves the idea?* Prefer seeded data, hard-coded users, local state.
3. **Rough architecture only.** Text boxes and arrows. No detailed diagrams.

Then update the MUST/SHOULD/CUT table and Architecture section of `design_process/BUILD.md`,
and add any real decision to its decision log with the reason.

If a feature is currently built but is not MUST, say so plainly — that is time already spent
that should not attract more.
