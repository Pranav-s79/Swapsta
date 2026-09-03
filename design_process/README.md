# design_process/

The operating process for this repo. Three documents, three different jobs.

| File | Job | Changes during a build? |
|---|---|---|
| `PRD — 60-Minute Engineering Loop.md` | **How** we build. The method: stages, timeboxes, scope-cut triggers, pivot rule. | No — this is the constitution |
| `../Swappa — Product Requirements Document.md` | **What** the full product is. The long-term vision and data model. | No — reference only |
| `BUILD.md` | **What we are building right now.** Demo Contract, MUST/SHOULD/CUT, critical question, decision log. | **Yes — every session** |

## How the three relate

```text
Swappa PRD          →  the ambition (everything we could build)
60-Minute Loop PRD  →  the method  (how we decide what to cut)
BUILD.md            →  the contract (what must work by the deadline)
```

`BUILD.md` is where the other two collide. The Swappa PRD lists dozens of features;
the Loop PRD says only one outcome gets protected. `BUILD.md` records which one.

## Rules

1. **`BUILD.md` is the single source of truth for scope.** No parallel planning docs,
   no scratch task lists. If it is not in `BUILD.md`, it is not in scope.
2. **The Demo Contract is the filter.** Before starting any work, check it against the
   contract. If it does not move that sentence forward, it is CUT.
3. **MUST before SHOULD, always.** SHOULD work only begins when every MUST is green.
4. **Vertical slices, not layers.** A thin path that runs beats a wide one that does not.
5. **Update `BUILD.md` as you go.** Status column and decision log, in the same change
   as the code. A stale build sheet is worse than none.
6. **Scope changes are the human's call.** Agents propose cuts and promotions; they do
   not silently take them.

Agent-specific instructions live in `../CLAUDE.md` and `../AGENTS.md`.
