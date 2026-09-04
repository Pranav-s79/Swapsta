# Agent roster

Who owns what, and how work moves between them.

## The split

| Agent | Platform | Owns | Stage | Defined in |
|---|---|---|---|---|
| **architect** | Claude | Structure, boundaries, decisions | 05–10 | `.claude/agents/architect.md` |
| **designer** | Claude | CSS, layout, what the audience sees | 25–45 | `.claude/agents/designer.md` |
| **implementer** | Codex | Writing the feature code | 25–45 | `.codex/agents/implementer.md` |
| **test-engineer** | Codex | vitest coverage of `src/lib/` | 25–45 | `.codex/agents/test-engineer.md` |
| **adversary** | Grok | Breaking the ranking before the audience does | pre-demo | `.grok/agents/adversary.md` |
| **validator** | Grok | Go / no-go on the demo | 45–60 | `.grok/agents/validator.md` |

Claude (main session) stays the orchestrator: it plans, splits work, and **verifies the real
diff and real test output** before believing any completion claim.

## How work moves

```text
          human sets the Demo Contract
                      ↓
                 architect          decides the shape
                      ↓
                  /handoff          writes a spec to .codex/builds/
                      ↓
              implementer           builds it        ─┐
              test-engineer         tests it          │ Codex
                      ↓                              ─┘
                    Claude          reads the real diff
                      ↓
                  designer          makes the result legible
                      ↓
                 adversary          20 queries built to break it   ─┐
                      ↓                                             │ Grok
                 validator          go / no-go                     ─┘
                      ↓
                     demo
```

## Why this split

- **Claude** holds repo context across a session, so it plans and reviews. It is the only
  agent that verifies.
- **Codex** is fastest against a precise written spec, so it implements. It never decides
  scope.
- **Grok** has no repo access, which makes it the right judge — it cannot be biased by
  knowing what the code *intended*. Both its jobs are language jobs.

## Loading them

| Platform | How |
|---|---|
| Claude | Auto-loaded from `.claude/agents/`. Invoke by name. |
| Codex | Paste the role profile above your task spec. Root `AGENTS.md` always applies. |
| Grok | Paste the profile into grok.com or the X app. Save output to `.grok/reports/`. |

## Rules that bind every agent

1. **The Demo Contract is the filter.** Not moving it forward means CUT.
2. **MUST before SHOULD**, always. Never start SHOULD work while a MUST is red.
3. **One file, one agent.** Never let two agents edit the same file at once.
4. **Claims are not evidence.** Real diff, real command output, or it did not happen.
5. **Scope changes are proposed, never taken.** That call is the human's.
6. **No AI in the ranking path.** `matchScore` must work with Grok unavailable — PRD §8.
