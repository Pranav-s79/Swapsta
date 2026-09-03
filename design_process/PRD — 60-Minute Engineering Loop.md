# PRD — 60-Minute Engineering Loop

## 1. Overview

The **60-Minute Engineering Loop** is a compressed engineering workflow for projects that must go from idea to working demonstration in approximately one hour.

It is designed for:

- hackathons
- rapid prototypes
- proof-of-concepts
- classroom projects
- technical demos
- early feasibility testing
- AI-assisted builds

The goal is not to produce a production-ready system.

The goal is to produce the **smallest convincing working version** of the idea while still making reasonable engineering decisions.

---

# 2. Core Goal

Within 60 minutes, the team should be able to answer:

> Can we demonstrate the core value of this idea working end-to-end?

The process should prioritize:

```text
WORKING DEMO
    >
CORE FUNCTIONALITY
    >
TECHNICAL VALIDATION
    >
POLISH
    >
COMPLETENESS
```

A smaller system that works is preferable to a larger system that is incomplete.

---

# 3. Core Principles

## 3.1 One Demo Outcome

Every project must define exactly one primary outcome.

Example:

Bad:

> Build a campus marketplace with AI, maps, messaging, profiles, payments, recommendations, moderation, and analytics.

Good:

> A student can list an item and immediately find the best nearby matching item on campus.

Everything that does not help demonstrate that outcome is secondary.

---

## 3.2 Scope Is Time-Bounded

Scope must adapt to the time available.

The project does not ask:

> How long will all these features take?

Instead:

> What is the best version we can build in the next 60 minutes?

Time is fixed.

Scope is flexible.

---

## 3.3 Build the Riskiest Path First

The project should test the feature most likely to prevent the demo from working.

Example:

If the product depends on AI matching:

```text
Do AI matching first.
```

Do not spend 25 minutes making the login page look good before confirming the AI integration works.

---

## 3.4 Mock Non-Critical Systems

Anything that does not prove the core concept may be mocked.

Examples:

```text
database → local JSON

authentication → fake user

payments → fake confirmation

real GPS → predefined coordinates

real inventory → seeded example data

complex backend → local API
```

Mocks are acceptable when the feature is not central to the technical demonstration.

---

## 3.5 End-to-End Before Depth

Prefer:

```text
simple frontend
    ↓
simple backend
    ↓
simple AI
    ↓
visible result
```

over:

```text
perfect frontend
    ↓
unfinished backend
```

The entire primary flow should work before any individual component is heavily polished.

---

# 4. 60-Minute Timeline

```text
00–05    DEFINE

05–10    DESIGN + CUT SCOPE

10–25    PROVE CORE TECH

25–45    BUILD END-TO-END

45–55    TEST + FIX

55–60    DEMO PREP
```

This timeline is a guideline rather than a strict rule.

---

# 5. Stage 1 — DEFINE

## Time

0–5 minutes

## Goal

Determine exactly what needs to work by the end of the hour.

The project should answer four questions.

### Problem

What problem are we solving?

### User

Who has the problem?

### Demo Outcome

What single action should the user be able to complete?

### Success Test

What must visibly happen for the demo to be considered successful?

---

## Example

### Problem

Students frequently need inexpensive school items but may not know that nearby students already have them.

### User

College students.

### Demo Outcome

A student creates an item listing and receives nearby relevant matches.

### Success Test

The demo successfully:

```text
creates listing
      ↓
searches available items
      ↓
ranks matching items
      ↓
shows locations
      ↓
recommends best option
```

---

# 6. Demo Contract

At the end of Stage 1, create a one-sentence Demo Contract.

Format:

> By the end of the hour, a user will be able to ______ and see ______.

Example:

> By the end of the hour, a student will be able to post an item they need and see the best nearby matching items ranked by relevance and distance.

This sentence becomes the main decision-making filter.

If a feature does not directly help this contract, it can be cut.

---

# 7. Stage 2 — DESIGN + CUT SCOPE

## Time

5–10 minutes

## Goal

Choose the simplest architecture capable of supporting the Demo Contract.

Create only a rough architecture.

Example:

```text
USER
 ↓
WEB UI
 ↓
LOCAL API
 ├── Item Database
 ├── Distance Calculation
 └── AI Matching
 ↓
RESULTS
 ↓
CAMPUS MAP
```

Do not create detailed diagrams unless necessary.

---

# 8. Feature Classification

Immediately classify features into three groups.

## MUST

Without this, the Demo Contract fails.

## SHOULD

Improves the demo but is not necessary.

## CUT

Do not build during the initial hour.

Example:

| Feature | Priority |
|---|---|
| Create listing | MUST |
| Browse nearby items | MUST |
| Distance ranking | MUST |
| AI recommendation | MUST |
| Campus map | SHOULD |
| Messaging | CUT |
| User ratings | CUT |
| Payments | CUT |
| Notifications | CUT |
| Moderation dashboard | CUT |

Only MUST features are guaranteed engineering time.

---

# 9. Simplification Pass

For every MUST feature, ask:

> What is the simplest possible implementation that still proves the idea?

Example:

Instead of:

```text
PostgreSQL
+
authentication
+
user profiles
+
cloud hosting
```

use:

```text
JSON
+
hard-coded demo user
+
local application
```

unless infrastructure itself is part of the project being demonstrated.

---

# 10. Stage 3 — PROVE CORE TECH

## Time

10–25 minutes

## Goal

Prove that the project's biggest technical assumption works.

This should be treated as a mini engineering spike.

---

## Identify the Critical Question

Examples:

```text
Can Grok correctly compare listings?

Can we calculate distance between campus locations?

Can the robot establish the connection?

Can OpenFOAM consume our generated geometry?

Can the model return predictions fast enough?
```

Only choose one or two critical questions.

---

# 11. Technical Spike

Run the smallest possible experiment.

Example:

Instead of building the entire marketplace:

```text
Listing A:
Calculus textbook

Listing B:
Calculus Early Transcendentals, 8th Edition

Listing C:
Physics textbook
```

Send the listings through the matching system.

Desired result:

```text
B → strong match
C → weak match
```

If this works, continue.

If it does not, simplify or change the approach immediately.

---

# 12. Pivot Rule

If the critical technical feature has not been proven after approximately 15 minutes:

```text
SIMPLIFY
      ↓
MOCK
      ↓
REPLACE
      ↓
CUT
```

Do not repeatedly attempt the same failing architecture.

Example:

If live campus routing is taking too long:

Instead of:

```text
Google Maps routing API
```

use:

```text
distance between coordinates
```

The demo still communicates proximity.

---

# 13. Stage 4 — BUILD END-TO-END

## Time

25–45 minutes

## Goal

Connect the minimum pieces required to make the complete user flow work.

Build vertically rather than horizontally.

---

# 14. Vertical Slice

Bad approach:

```text
Finish entire UI
Finish entire backend
Finish entire database
Integrate everything
```

Better approach:

```text
button
 ↓
API request
 ↓
data
 ↓
processing
 ↓
result
 ↓
UI
```

Complete one working path first.

---

# 15. Core Build Loop

Engineering follows:

```text
BUILD
 ↓
RUN
 ↓
OBSERVE
 ↓
FIX
 ↺
```

Keep loops short.

Avoid building large sections without executing them.

---

# 16. Example — Swappa

A minimal implementation could contain:

### Input

```text
I need a desk lamp.
```

### Inventory

```text
Desk lamp — Engineering Quad — $8

Floor lamp — Northside — $15

LED light strip — MSC — $5
```

### Processing

```text
AI relevance
        +
distance
        ↓
combined score
```

### Output

```text
BEST MATCH

Desk Lamp
$8
0.3 miles away

Why:
Strong semantic match
Closest relevant listing
Lower cost
```

The system does not need:

```text
real messaging
payments
full profiles
production auth
full marketplace infrastructure
```

to prove the concept.

---

# 17. AI Usage

AI should reduce development time rather than create additional complexity.

Recommended AI uses:

```text
semantic matching

classification

ranking

structured data extraction

description generation

code generation

test generation
```

Avoid using AI where deterministic logic is simpler.

Example:

Use normal code for:

```text
distance calculations
price sorting
filters
coordinates
```

Use AI for:

```text
"Is this item meaningfully similar?"
```

---

# 18. Stage 5 — TEST + FIX

## Time

45–55 minutes

## Goal

Make the demo reliable enough to run repeatedly.

Do not attempt comprehensive testing.

Focus on the primary demo flow.

---

# 19. Demo Test

Run the demo exactly as it will be presented.

Example:

```text
1. Open app

2. Create listing

3. Submit

4. AI analyzes listings

5. Nearby items appear

6. Map displays locations

7. Best recommendation is highlighted
```

Run this flow multiple times.

Fix anything that could visibly break it.

---

# 20. Priority of Fixes

Fix problems in this order:

```text
1. demo completely fails

2. wrong result

3. slow/unreliable behavior

4. confusing UX

5. ugly UI

6. minor polish
```

A working ugly demo beats a polished broken one.

---

# 21. Demo Hardening

Where appropriate:

```text
seed data beforehand

cache AI results

provide fallback values

validate inputs

handle empty results

prevent obvious crashes
```

The goal is not deception.

The goal is removing unnecessary sources of demo failure.

---

# 22. Stage 6 — DEMO PREP

## Time

55–60 minutes

## Goal

Prepare a clear demonstration of the engineering value.

The demo should normally take 1–3 minutes.

---

# 23. Demo Structure

Use:

```text
PROBLEM
  ↓
ACTION
  ↓
INTELLIGENCE
  ↓
RESULT
```

Example:

### Problem

> Students buy things that another student nearby might already be trying to sell.

### Action

> I need a desk lamp, so I create a request.

### Intelligence

> The system compares nearby listings based on semantic relevance, distance, and price.

### Result

> It recommends this lamp 0.3 miles away and shows exactly where it is on campus.

---

# 24. What Not to Demo

Avoid spending time showing:

```text
login screens

settings

navigation

empty dashboards

configuration

code

database schemas
```

unless one of those is the actual innovation.

Show the shortest path to the interesting feature.

---

# 25. Minimum Project Artifacts

A 60-minute project should not require traditional project documentation.

Maintain only:

```text
DEMO CONTRACT

MUST / SHOULD / CUT

ROUGH ARCHITECTURE

CRITICAL TECH QUESTION

DEMO FLOW
```

These can all fit in a single file.

Example:

```md
# 60-Minute Build

## Demo Contract

Student can request an item and receive the best nearby matches.

## MUST

- listing input
- seeded inventory
- AI matching
- distance ranking
- results

## SHOULD

- map
- nice cards

## CUT

- auth
- payments
- chat

## Critical Question

Can the AI reliably rank semantically similar items?

## Architecture

UI → API → inventory → scoring → result

## Demo

Create request → process → show match.
```

---

# 26. Time-Based Scope Control

The process should automatically trigger scope cuts based on remaining time.

## At 30 minutes remaining

If the complete path does not exist:

Cut SHOULD features.

```text
MUST only
```

---

## At 15 minutes remaining

If the complete path still does not work:

Mock external dependencies.

Example:

```text
real API
   ↓
mock response
```

---

## At 10 minutes remaining

Stop adding features.

Only:

```text
fix
test
simplify
```

---

## At 5 minutes remaining

Freeze implementation.

Only demo preparation and catastrophic fixes.

---

# 27. Scope Cut Order

When time runs short, remove features approximately in this order:

```text
animations
 ↓
visual polish
 ↓
secondary screens
 ↓
settings
 ↓
accounts
 ↓
persistence
 ↓
secondary integrations
 ↓
non-core automation
```

Protect:

```text
CORE INPUT
     ↓
CORE ENGINEERING / INTELLIGENCE
     ↓
CORE OUTPUT
```

---

# 28. Failure Handling

If the initial idea cannot be completed within the hour, the project should reduce itself to a technical proof.

Example:

Original:

> Full AI campus marketplace.

Reduced:

> Demonstrate that AI can identify useful item swaps and rank them based on campus proximity.

That is still a successful engineering outcome because the main hypothesis has been tested.

---

# 29. Definition of Done

The 60-Minute Engineering Loop is complete when:

```text
[ ] Demo Contract works

[ ] Primary flow runs end-to-end

[ ] Core technical assumption has been demonstrated

[ ] No known catastrophic demo failure exists

[ ] Result is understandable without explaining unfinished features

[ ] Demo can be reproduced
```

Production readiness is explicitly not required.

---

# 30. Things Explicitly Not Required

Unless they are central to the project, the following should not block completion:

```text
production authentication

perfect security architecture

large-scale database

deployment automation

comprehensive testing

responsive support for every device

complete accessibility work

perfect visual design

analytics

monitoring

full error handling

every planned feature
```

These become future engineering work after the concept is proven.

---

# 31. Post-Demo Expansion

If the project receives more development time, transition it into the larger Engineering Loop.

```text
60-MINUTE LOOP

Idea
 ↓
Prototype
 ↓
Technical proof
 ↓
Demo
 ↓

FULL ENGINEERING LOOP

Requirements
 ↓
Architecture
 ↓
Engineering
 ↓
Integration
 ↓
Verification
 ↓
Validation
 ↓
Release
```

The rapid prototype therefore acts as an early feasibility stage rather than being discarded.

---

# 32. Complete 60-Minute Loop

```text
                60 MINUTES

┌───────────────────────────────────┐
│ 00–05                            │
│ DEFINE                            │
│                                  │
│ Problem → Demo Contract           │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│ 05–10                            │
│ DESIGN + CUT                      │
│                                  │
│ Architecture                     │
│ MUST / SHOULD / CUT              │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│ 10–25                            │
│ PROVE CORE TECH                   │
│                                  │
│ riskiest assumption              │
│       ↓                          │
│ prototype                        │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│ 25–45                            │
│ BUILD                             │
│                                  │
│ Build → Run → Fix ↺              │
│                                  │
│ complete vertical slice          │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│ 45–55                            │
│ TEST                              │
│                                  │
│ full demo flow                   │
│ failure fixes                    │
└─────────────────┬─────────────────┘
                  ↓
┌───────────────────────────────────┐
│ 55–60                            │
│ DEMO                              │
│                                  │
│ Problem → Action → Result        │
└───────────────────────────────────┘
```

---

# 33. Success Metric

The primary metric is not:

```text
features completed
lines of code
commits
screens built
```

It is:

> Can someone watch the demo and clearly understand what the project does, why it is useful, and see the core idea actually working?

If yes, the 60-Minute Engineering Loop succeeded.