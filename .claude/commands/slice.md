---
description: Stage 4 (25-45) — build one vertical slice end to end
argument-hint: [the slice, e.g. "best-match callout"]
---

Run **Stage 4 — BUILD END-TO-END** of the 60-Minute Engineering Loop.

Slice: $ARGUMENTS

Build **vertically**, not in layers:

```text
input → processing → data → result → visible output
```

Rules:
- One complete path that runs beats three finished layers that do not connect.
- Check the slice against the Demo Contract in `design_process/BUILD.md` before starting.
  If it does not move that sentence forward, say so and stop.
- Pure logic goes in `src/lib/` with a test. Not inline in the component.
- Short loops: **build → run → observe → fix**. Do not write large sections without executing them.
- No new dependencies without asking.

When the slice runs, verify for real — `npm test` and `npm run build`, plus a request against
the dev server if it touches rendering. Paste the actual output.

Then update the status column in `design_process/BUILD.md`.
