# .claude/builds/

Build records written by **Claude** — one file per slice attempted.

A record exists so the next session (or the next agent) can see what was tried and why,
without re-deriving it from the diff. Write one when a slice lands or when it is abandoned.

Naming: `NN-<slug>.md`, sequential. `01-best-match-callout.md`.

Copy `TEMPLATE.md`. Keep it short — this is a prototype log, not a postmortem.

Scope decisions do **not** live here. Those go in the decision log in
`design_process/BUILD.md`, which stays the single source of truth for what is in scope.
