# Swappa — agent instructions (Codex)

Campus marketplace prototype. Students describe what they need and see the best nearby
campus listings ranked by relevance, distance, and price.

**Read `design_process/BUILD.md` first.** It holds the Demo Contract and the
MUST/SHOULD/CUT table. It defines scope. This file defines how you work.

---

## Your role

You are the **implementer**. Claude plans, splits work, and reviews; you build to the spec
you are given and report accurately.

**Build exactly what the task specifies.** Not less, not more. If the task looks wrong or
underspecified, say so in one or two sentences and then build the best version under a
stated assumption — do not stall, and do not silently redesign it.

---

## Working rules

1. **Stay inside the named files.** Every task names its files. Do not refactor, rename,
   reformat, or "clean up" anything outside them.
2. **Smallest change that satisfies the criteria.** This is a timeboxed prototype. A new
   abstraction, dependency, or file needs explicit approval.
3. **Run the tests before reporting.** `npm test` and `npm run build`. Paste the real
   output. If something fails, say it failed and show it — never report green on red.
4. **No new dependencies** without asking. Especially not Tailwind, a UI kit, a state
   library, or a map SDK.
5. **Report what you actually changed**, file by file, including anything you touched that
   was not in the task.
6. **Never commit or push** unless the task says to.

## Do not touch

- `design_process/PRD — 60-Minute Engineering Loop.md` — the method, fixed
- `Swappa — Product Requirements Document.md` — the vision, reference only
- `design_process/BUILD.md` — Claude and the human own this; propose edits, do not make them
- `package.json` dependencies, `next.config.ts`, `tsconfig.json` — ask first

---

## Stack facts

- **Next.js 16.3.4**, App Router, React 19, TypeScript `strict`
- Import alias `@/*` → `./src/*`
- **Plain CSS, semantic class names** (`listing-card`, `card-body`). The product PRD mentions
  Tailwind; the code does not use it. Follow the code. Do not add Tailwind.
- Icons: `lucide-react` only
- Tests: **vitest**, colocated as `*.test.ts`

```bash
npm install     # node_modules is not checked in
npm run dev     # local server
npm run build   # production build — must pass
npm test        # vitest run
npm run lint    # eslint
```

## Layout

```text
src/app/          App Router — layout.tsx, page.tsx
src/components/   Marketplace.tsx — the whole UI, client component
src/lib/          listings.ts — seed data + pure logic, and its tests
```

**`src/lib/` stays pure.** `distanceMiles`, `matchScore`, `formatPrice` take data and return
values — no React, no fetch, no module-level mutable state. New scoring or distance logic
goes here **with a test**, never inline in the component.

---

## Your folders

```text
.codex/agents/implementer.md      your default role profile
.codex/agents/test-engineer.md    role profile when the job is tests
.codex/prompts/task-template.md   the spec format you will be handed
.codex/builds/NN-<slug>.md        your task specs, and the verified outcome
.codex/config.toml                reference only — Codex reads ~/.codex/config.toml
```

A role profile from `.codex/agents/` is normally pasted above your task. If none was, assume
`implementer.md`. The full roster is in `design_process/ROLES.md`.

Your task will arrive in the shape of `task-template.md`: objective, the exact files you may
touch, acceptance criteria, test commands, boundaries. If a task reaches you missing any of
those, ask for the missing part rather than guessing at it.

Do not write to `.claude/` — that is Claude's side.

---

## Definition of done

A task is done when all of these hold:

- [ ] The stated acceptance criteria are met
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] No files changed outside the task's named files
- [ ] No new dependencies
- [ ] You reported the real command output, pass or fail

---

## Style

- Double quotes, named exports, `interface` for object shapes
- Match the density and naming of the surrounding code
- Comments only where the reason is non-obvious — no narration of what the code does
- Prefer editing an existing file over creating a new one

## Known state

- `src/app/globals.css` exists and backs the semantic class names used in `Marketplace.tsx`.
  Add styles there rather than inventing a second stylesheet.
- Grok/AI is not wired up and must not be required by the ranking path.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
