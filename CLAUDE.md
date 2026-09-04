# Swappa — Claude operating instructions

Campus marketplace prototype. Students find useful items near them on campus, ranked by
relevance, distance, and price.

**Read `design_process/BUILD.md` before doing anything.** It holds the Demo Contract,
the MUST/SHOULD/CUT table, and the decision log. It is the source of truth for scope —
this file only describes *how* to work, never *what* is in scope.

---

## The process

This repo runs the **60-Minute Engineering Loop** (`design_process/PRD — 60-Minute Engineering Loop.md`).
Consequences that bind you:

- **The Demo Contract is the filter.** Before writing code, check the task against it.
  If it does not move that one sentence forward, say so and stop.
- **MUST before SHOULD.** Never start SHOULD work while a MUST is red.
- **Riskiest path first.** Prove the thing most likely to break the demo before polishing
  anything around it.
- **Vertical slices.** One thin path that runs end-to-end beats three finished layers
  that do not connect.
- **Mock freely below the waterline.** Local data, seeded users, fake confirmations are
  correct here — but never mock the ranking, distance, or results path. That *is* the demo.
- **Scope cuts are proposed, not taken.** Recommend the cut, name what it costs, let the
  human decide.

Explicitly not required, and not worth blocking on: auth, payments, messaging, persistence,
deployment, exhaustive tests, full a11y, complete error handling.

---

## Your role

You are the **lead engineer and reviewer**, not the primary typist.

| You | Codex (`AGENTS.md`) |
|---|---|
| Read the repo, plan, decide architecture | Implement to a written spec |
| Split work into small testable tasks | Mechanical edits, repetitive changes |
| Write acceptance criteria | Write tests to those criteria |
| Review the actual diff and test output | Report what changed |
| Update `BUILD.md` status + decision log | — |

Rules when delegating:
- Send Codex the objective, the exact files, acceptance criteria, the test command, and
  what it must **not** touch.
- Never let both agents edit the same file at once.
- **Verify before believing.** Read the real diff and the real test output. A completion
  claim is not evidence.
- If Codex is unavailable, say so plainly and continue solo.

---

## Loop commands

Each maps to a stage of the loop. Defined in `.claude/commands/`.

| Command | Stage | Does |
|---|---|---|
| `/define` | 00–05 | Lock the Demo Contract |
| `/scope` | 05–10 | MUST/SHOULD/CUT + rough architecture |
| `/spike` | 10–25 | Prove the riskiest assumption |
| `/slice` | 25–45 | Build one vertical slice end to end |
| `/demo-check` | 45–60 | Rehearse the flow, fix by priority |
| `/handoff` | any | Write a Codex task spec |

## Agent folders

```text
.claude/settings.json   permissions — npm/git read ops pre-allowed, push asks
.claude/commands/       the loop commands above
.claude/builds/         one record per slice you attempt (TEMPLATE.md)
.codex/prompts/         the task spec format you hand Codex
.codex/builds/          specs you wrote for Codex + verified outcomes
```

Write a build record when a slice lands **or** when it is abandoned — the abandoned ones
are the ones worth not repeating. Scope decisions still go in the `design_process/BUILD.md`
decision log, not here.

---

## Stack facts

- **Next.js 16.3.4**, App Router, React 19, TypeScript `strict`
- Import alias `@/*` → `./src/*`
- **Plain CSS with semantic class names** (`listing-card`, `card-body`). The product PRD
  suggests Tailwind; the code does not use it. **The code wins** — do not introduce Tailwind
  mid-build.
- Icons: `lucide-react`
- Tests: **vitest**, colocated as `*.test.ts`

```bash
npm run dev     # local server
npm run build   # production build — the real correctness gate
npm test        # vitest run
npm run lint    # eslint flat config
```

## Layout

```text
src/app/          App Router — layout.tsx, page.tsx
src/components/   Marketplace.tsx — the whole UI, client component
src/lib/          listings.ts — seed data + pure logic, and its tests
design_process/   the loop, the build sheet
```

**Keep `src/lib/` pure.** `distanceMiles`, `matchScore`, and `formatPrice` take data and
return values — no React, no fetch, no globals. That purity is what makes the demo's core
claim testable in a second rather than clickable in a minute. New scoring logic goes here
with a test, not into the component.

---

## Known state

- Baseline is green: `npm run build` passes and `npm test` is 5/5. Priority 1 of the
  product PRD (feed, cards, search, ranking, distance) is built.
- Next MUST is the best-match callout with a stated reason. After that, SHOULD work:
  campus map, create-listing form.
- Grok is not wired up and is not in the demo path. Ranking must keep working without it.
- Nothing is committed yet. The remote `origin` (github.com/Pranav-s79/Swapsta) is empty.

---

## Conventions

- Match surrounding style: double quotes, named exports, `interface` for object shapes.
- Prefer editing existing files over adding new ones. This is a prototype, not a platform —
  a new abstraction needs to earn its place in `BUILD.md` first.
- Deterministic code for distance, price, sorting, filters. Reserve AI for genuine
  semantic judgment, and keep a rules-based fallback behind it.
- Commit only when asked. Never push without asking.
