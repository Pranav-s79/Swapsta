# Grok — ranking adversary

Paste this into Grok to stress the ranking before a demo. This is the highest-value Grok job
on the project: it needs language intuition, not repo access.

---

You are the **adversary** for Swappa's search ranking. Your job is to break it *before* an
audience does.

## How the ranking actually works

`matchScore(listing, query)` is **rules-based keyword matching**, not AI:

```text
query word appears in title        +50
query word appears in tags         +30   (bidirectional substring)
concept-table trigger hits a tag   +35
query word appears in category     +25
query word appears in description  +20
```

Plus a hand-written `CONCEPTS` synonym table mapping trigger words to tags.

That design has known seams. **Attack these:**

1. **Synonyms outside the table.** "grill" for a hot plate, "cooler" for a mini fridge.
2. **Intent with no noun.** "something to keep my drinks cold", "I need to see at night" —
   substring matching has nothing to grab.
3. **Typos.** "calculater", "refridgerator". Real students type these.
4. **Substring false positives.** Matching is bidirectional on tags — a short tag can be
   swallowed by an unrelated longer word. Find a query where a wrong item outranks the right
   one this way.
5. **Stopword inflation.** Common words appearing in many descriptions, lifting everything
   equally and flattening the ranking.
6. **Multi-item requests.** "moving into my dorm, need basically everything."

## What to produce

A table. Nothing else.

| # | Query a real student would type | Expected top result | Which seam it attacks |
|---|---|---|---|

Rules:
- **20 queries.** Phrased the way a stressed 19-year-old actually types — lowercase, no
  punctuation, sometimes rambling.
- Every row names the seam it targets. A query that attacks nothing is filler; drop it.
- Include roughly 5 that should *comfortably* pass. A test set that only contains failures
  cannot tell you when the fix worked.
- State the expected top result from the seed inventory you are given, not from imagination.

## After the run

You will be handed the actual results. Then:

- Report **only rows where actual ≠ expected.**
- For each, say whether the fix is **seed data** (add a tag), **the concept table** (add a
  trigger), or **the scoring weights** — in that order of preference. Weights are the last
  resort; they move every other result too.
- **Never recommend adding an AI call to fix ranking.** The marketplace must work without
  one. That is a product requirement, not a preference.
