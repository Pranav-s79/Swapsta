# 01 — UI redesign: stop reading as AI-generated

**Stage:** SLICE
**Priority:** SHOULD (visual polish — see Notes)
**Outcome:** landed
**Date:** 2026-09-03

## Objective

Make the marketplace look like a tool students use rather than a generated landing page,
without touching the ranking, distance, or results path the Demo Contract depends on.

## What changed

| File | Change |
|---|---|
| `src/app/globals.css` | New token set: neutral chrome (`--ink --body --faint --paper --wash --line --line-strong`), one accent `#8a5a12` ochre + `--accent-soft`, `--danger`. Nine radius values collapsed to `--r` 4px / `--r-lg` 8px. Box-shadows removed except on floating elements (modals, toast, map preview/label). Card hover lift and image zoom deleted. Google Fonts import removed for a system stack. Hero and trust-strip rules deleted. |
| `src/components/Marketplace.tsx` | Stock-photo hero section and three-column trust strip deleted; compact `search-shell` added under the header so listings start immediately. Brand mark un-rotated, trailing coral `.` removed. Copy flattened. Campus strings derived from `USER_LOCATION` / `CAMPUS_LOCATIONS`. |
| `src/components/CampusMapPage.tsx` | "From the MSC" and the four hardcoded building labels now derived from location data. |
| `src/components/ListingDetail.tsx` | "mi from the MSC" derived from `USER_LOCATION.shortName`. |
| `src/app/layout.tsx` | Metadata title only. |
| `design_process/BUILD.md` | Decision log entries 6 and 7. |

`src/lib/` was not modified by this slice.

## Verification

```text
npm run build  -> ✓ Compiled successfully, 6 routes
npm test       -> 28 passed (3 files)
npm run lint   -> clean
grep -ric "coral|manrope|DM Sans|trust-strip|hero-overlay|999px" src/app/globals.css src/components/Marketplace.tsx  -> 0, 0
grep -rn "Aggie|Texas A|the MSC|ZACHRY|EVANS|COMMONS" src/components/  -> none
```

Committed as `f40b26a` on branch `ui-redesign`.

## Result

The page opens on inventory instead of a slogan. Colour is now scarce enough that the
best-match callout is the only coloured block on screen, which is exactly the thing the
Demo Contract needs a viewer to notice. Components no longer name a specific school.

## Notes

**Not visually confirmed in a browser.** The best-match callout only mounts when `query`
is non-empty and `sort === "best"` — client state, so SSR HTML does not contain it.
Verified by reading the JSX and confirming the compiled CSS ships. Type the demo phrase in
a real browser before presenting.

**Two sessions edited this repo simultaneously.** A parallel session added the routes,
storage, `rankListings`, and the API/server layer while this slice was running. It caused
three races, two real breakages (a missing `CircleDollarSign` import, and duplicate
`.best-match-callout` rules where the later one left the CTA as white-on-light and
invisible), and a stale `.git/index.lock`. A "tests regressed" reading mid-run turned out
to be a race against files being written, not a regression. **Do not run two agents against
`src/components/` and `src/lib/` at once.** Serialize them.

**Palette reversed mid-slice.** The accent was first Texas A&M maroon `#500000`, chosen
because grounding it in a real campus made it read as deliberate rather than generated.
The product then turned out to be multi-campus, which killed that rationale. Ochre replaced
it: campus-neutral, and a hue generated designs rarely reach for.

**Scope honesty:** visual polish is priority 5 of 6 in the loop's fix order and this ran
while the multi-campus model did not exist. It was explicitly requested, so it was built.
The `Campus` type, searchable school picker, and per-campus seed data remain unbuilt —
`src/lib/listings.ts` still holds Texas A&M locations only.
