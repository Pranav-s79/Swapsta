# .grok/reports/

Validation runs, newest last. `NN-<slug>.md`.

Record what was tested and what came back, so the next session does not re-run the same 20
queries to learn the same thing.

```markdown
# NN — <run name>

**Agent:** validator | adversary
**Date:**
**Against:** commit <sha>

## Findings

| Severity | Observed | Fix |
|---|---|---|

## Outcome

What was fixed, what was accepted as-is, what was deferred.
```
