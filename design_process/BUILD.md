# Swappa — 60-Minute Build Sheet

> This is the single live artifact for the loop (see `PRD — 60-Minute Engineering Loop.md` §25).
> Every agent and human updates **this file** rather than opening new planning docs.
> If a decision is not written here, it has not been made.

---

## Demo Contract

> By the end of the hour, a student will be able to describe what they need in plain
> language and see the best nearby campus listings ranked by relevance, distance, and price.

**This sentence is the filter.** Any work that does not move this forward is CUT.

---

## Success Test

The demo visibly does this, end to end, without a crash:

```text
enter natural-language request
      ↓
search + rank seeded listings
      ↓
show distance per listing
      ↓
highlight best match with a reason
```

---

## MUST / SHOULD / CUT

| Feature | Priority | Status |
|---|---|---|
| Marketplace feed + listing cards | MUST | built (`src/components/Marketplace.tsx`) |
| Seeded campus inventory | MUST | built (`src/lib/listings.ts`) |
| Keyword / NL search box | MUST | built |
| Relevance scoring (`matchScore`) | MUST | built + tested (5/5 green) |
| Distance calc + display (`distanceMiles`) | MUST | built + tested |
| App renders + styles load | MUST | verified — `npm run build` passes |
| Best-match callout with a stated reason | MUST | built + tested (`rankListings`) |
| Campus map view | SHOULD | built (`/map`) |
| Create-listing form | SHOULD | built (`/sell`, session storage) |
| Grok / live AI call | SHOULD | not started — rules-based path must stay standalone |
| Auth, payments, messaging, ratings, persistence | CUT | — |

Only MUST features are guaranteed engineering time.

---

## Critical Technical Question

> Does the rules-based `matchScore` rank a plain-language request well enough that the
> top result is obviously correct on stage — with no AI call in the path?

Current evidence: `src/lib/listings.test.ts` contains 10 passing tests. The exact demo request
selects the TI-84 Plus CE and returns a reason containing the title match, distance, and price.
Distance, affordability, free/trade listings, empty queries, ties, and irrelevant searches are
also covered.

**Pivot rule:** if a demo phrase ranks wrong, fix it with seed data or scoring weights.
Do not reach for an AI call to rescue ranking during the hour.

---

## Architecture

```text
USER
 ↓
Next.js App Router UI        src/app/
 ↓
Marketplace client component src/components/Marketplace.tsx
 ↓
Pure domain module           src/lib/listings.ts
 ├── seeded inventory        INITIAL_LISTINGS
 ├── distance                distanceMiles()
 ├── relevance               matchScore()
 └── display                 formatPrice()
 ↓
Ranked results + best-match callout
```

Rule: scoring, distance, and formatting stay **pure and in `src/lib/`** so they are testable
without rendering. The AI layer, if it ever lands, sits behind the same function shape.

---

## Demo Flow

Rehearse exactly this, in this order:

```text
1. Open app
2. Type "need a calculator for my engineering class tomorrow"
3. Results rank, closest and cheapest surfacing
4. Distances read plausibly for campus
5. Best match is highlighted with a reason
6. Open the listing detail
```

---

## Scope-Cut Triggers

| Time left | Rule |
|---|---|
| 30 min | Complete path not working → drop all SHOULD, MUST only |
| 15 min | Still not working → mock the failing dependency |
| 10 min | Stop adding features. Fix, test, simplify only |
| 5 min | Freeze. Demo prep and catastrophic fixes only |

Cut order: animations → visual polish → secondary screens → settings → accounts →
persistence → secondary integrations.

Protect: **core input → ranking intelligence → core output.**

---

## Definition of Done

- [ ] Demo Contract works
- [ ] Primary flow runs end-to-end
- [ ] `matchScore` ranking demonstrated on the real demo phrasing
- [ ] No known catastrophic demo failure
- [ ] Understandable without explaining unfinished features
- [ ] Demo reproducible twice in a row

Production readiness is explicitly **not** required.

---

## Decision Log

Append one line per real decision. Newest last.

| # | Decision | Why |
|---|---|---|
| 1 | Plain CSS with semantic class names, no Tailwind | Matches existing `Marketplace.tsx`; swapping now costs demo time |
| 2 | Rules-based `matchScore`, no Grok in the demo path | PRD §8 — marketplace must work without AI; removes the biggest demo failure source |
| 3 | Repo split out of `SideProjects` into its own git repo on `Swapsta` | Parent folder is an unrelated repo (`Arx`); Swappa needs its own history |
| 4 | Best-match ranking combines relevance, proximity, and affordability and returns a reason | Makes the Demo Contract measurable and keeps ranking independent of AI availability |
| 5 | MVP screens use real routes; created listings use session storage and saved IDs use local storage | Makes navigation and the demo flow work without adding backend or authentication scope |
| 6 | Visual layer rebuilt as inventory-first utility: hero and trust strip deleted, neutral chrome, one ochre accent reserved for the best-match callout | The landing-page framing (stock-photo hero, three benefit columns, coral/mint palette, pill-everything) read as AI-generated; a marketplace should show inventory first, and confining color to the callout makes ranking the only thing on the page that shouts |
| 7 | Campus-specific strings derived from `USER_LOCATION` / `CAMPUS_LOCATIONS` instead of hardcoded; multi-campus model deferred | Product is universal, not Texas A&M-only. Components are now campus-agnostic, but `src/lib/listings.ts` seed data is still A&M — the `Campus` type, searchable school picker, and multi-campus seed data are the next slice |
