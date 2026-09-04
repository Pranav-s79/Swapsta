# .codex/

Configs, task specs, and build records for **Codex** on this project.

## What Codex actually reads

Be clear about this, because only one of these is automatic:

| Source | Loaded automatically? |
|---|---|
| `AGENTS.md` (repo root) | **Yes** — this is the real project-level instruction file |
| `~/.codex/AGENTS.md` | **Yes** — global persona, applies to every project |
| `~/.codex/config.toml` | **Yes** — global config, incl. per-project `trust_level` |
| `.codex/config.toml` (this folder) | **No** — reference only, see below |

So: **behavioural rules belong in the root `AGENTS.md`.** This folder is storage for the
things Codex is *handed* — task specs and build records — plus a config snippet you apply
once by hand.

## Contents

```text
config.toml           snippet to merge into ~/.codex/config.toml (not auto-loaded)
prompts/              the task spec format Claude uses to hand work over
builds/               one record per task Codex completes
```

## Workflow

```text
Claude runs /handoff
      ↓
spec written to .codex/builds/NN-<slug>.md
      ↓
paste into Codex
      ↓
Codex implements, runs tests, reports
      ↓
Claude reads the real diff + real test output
      ↓
record updated with the outcome
```

Claude plans and verifies. Codex implements. Neither edits the same file at the same time.
