---
description: Write a Codex task spec for the current work
argument-hint: [what Codex should build]
---

Write a task spec for **Codex** to implement. Do not implement it yourself.

Task: $ARGUMENTS

First read the relevant files so the spec is concrete, not generic. Then produce exactly
this, using the template in `.codex/prompts/task-template.md`:

1. **Objective** — one sentence, tied to the Demo Contract
2. **Files** — the exact paths Codex may touch, and nothing else
3. **Context** — the current shape of the code: real signatures, real types, real names
4. **Acceptance criteria** — checkable statements, not vibes
5. **Tests to run** — the literal commands
6. **Boundaries** — what must not change (deps, configs, other files, the PRDs)

Rules:
- Scope it to one vertical slice. If it needs two, write two specs.
- Never hand Codex a file that you are also editing.
- Quote real identifiers from the codebase. A spec that says "the scoring function" instead
  of `matchScore` will produce the wrong diff.

Save it to `.codex/builds/` as `NN-<slug>.md` (next number in sequence), then print it so it
can be pasted straight into Codex.

After Codex reports back, verify the real diff and the real test output yourself before
believing the completion claim.
