# Codex task spec — template

The format Claude uses to hand work to Codex. Fill every section. A vague spec produces a
vague diff.

---

## Objective

One sentence. What must be true when this is done, tied to the Demo Contract in
`design_process/BUILD.md`.

## Files you may touch

```text
src/lib/listings.ts
src/lib/listings.test.ts
```

Nothing else. Do not refactor, rename, or reformat outside this list.

## Context

The current shape of the code, with **real identifiers** — signatures, types, exported names.
Quote them. "The scoring function" is not enough; write `matchScore(listing, query): number`.

## Acceptance criteria

Checkable statements, not intentions.

- [ ] `<function>` returns `<value>` for `<input>`
- [ ] A test covers `<edge case>`
- [ ] Existing tests still pass unchanged

## Tests to run

```bash
npm test
npm run build
```

Paste the real output in your report. If it fails, say it failed and show it.

## Boundaries

- No new dependencies
- Do not modify `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`
- Do not edit `design_process/BUILD.md` or either PRD
- Do not commit or push
- Keep `src/lib/` pure — no React, no fetch, no module-level mutable state

## Report back

- Files changed, one line each
- Anything touched that was not in the list above
- The real test and build output
