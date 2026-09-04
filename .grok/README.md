# .grok/

Role profiles for **Grok**, used for testing and validation.

## Reality check

There is no Grok CLI or API key on this machine. Nothing here is auto-loaded — these are
**paste-in prompts** for grok.com or the X app. That is a fit, not a limitation: both jobs
below need language intuition rather than repo access.

Do not confuse this with the Grok *product* integration in the Swappa PRD (§9, the
`/api/ai/*` layer). That is a feature of the app and is currently CUT. This folder is about
Grok helping *build* the app.

## Agents

| File | Job | When |
|---|---|---|
| `agents/validator.md` | Judge whether the demo reads clearly to a stranger | Stage 5–6 (45–60) |
| `agents/adversary.md` | Generate queries that break the ranking | Before any demo run |

## Workflow

```text
adversary  → 20 adversarial queries + expected results
      ↓
run them against the app (Codex or by hand)
      ↓
adversary  → judges actual vs expected, names the cheapest fix
      ↓
fix, re-run
      ↓
validator  → final go/no-go on the demo
```

Save output to `reports/` as `NN-<slug>.md` so a later session can see what was already
tested rather than re-deriving it.

## The one hard rule

Neither agent may recommend an AI call to fix ranking. `matchScore` must keep working with
Grok unavailable — PRD §8 and §14. Grok tests the ranking; it does not become the ranking.
