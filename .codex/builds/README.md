# .codex/builds/

Task specs handed to **Codex**, and what came back.

One file per task, named `NN-<slug>.md` in sequence. Claude writes the spec here via
`/handoff`, then appends the outcome after verifying the real diff.

A file here has two halves:

1. **The spec** — written before Codex runs, from `../prompts/task-template.md`
2. **The outcome** — appended after, with the verified result

```markdown
## Outcome

**Status:** landed | partial | rejected
**Verified by:** the real diff and test output, not Codex's claim

What actually changed, and anything Codex touched outside its boundaries.
```

Rejecting work is normal. Record it — a spec that produced the wrong diff is usually a spec
problem, and the next one improves from seeing it.
