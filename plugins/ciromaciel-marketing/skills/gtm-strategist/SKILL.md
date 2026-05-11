---
name: gtm-strategist
description: >
  Produce a 6-12 month GTM blueprint (not a campaign). Covers positioning, content
  pillars, sales motion (PLG / sales-led / hybrid), channel-ICP fit, campaign roadmap,
  and capacity vs ambition. Pure reasoning skill. Use after research is complete and
  before any specific campaign planning.
tags: [strategy]
---

# GTM Strategist

Produces a long-horizon GTM blueprint. This is *strategy*, not a campaign — meaning it sets the frame for 5-8 campaigns over 6-12 months.

**Built for:** Founders or first marketing hires who have research done but no coherent story tying it together. Output should be opinionated, not a buffet of options.

## When to use

- "We have research done — now what's the strategy?"
- "I keep running disconnected campaigns — give me a 12-month frame"
- "How should I position this product against [competitors]?"

## Pre-requisites (must read first)

| File | What you need from it |
|------|----------------------|
| `clients/<name>/intake.md` | Goals, budget, capacity, oferta type |
| `clients/<name>/research/SUMMARY.md` | One-page synthesis of all research |
| `clients/<name>/research/icp-*.md` | Primary ICP profile |
| `clients/<name>/research/competitors.md` | Competitive map |
| `clients/<name>/research/keywords.md` | Search/content terrain |
| `clients/<name>/research/brand-voice.md` | Voice constraints |

If any are missing, halt and direct the user back to `/research`.

## The blueprint — 6 sections

### 1. Positioning statement

Build the canonical positioning statement using this template — but only one is allowed (resist hedging):

```
For [primary ICP],
who [primary pain or job-to-be-done],
<client> is the [category]
that [single differentiator backed by proof].
Unlike [most vulnerable competitor],
we [the move they can't copy].
```

**Constraints:**
- Single ICP. If client wants 3, force the primary one.
- Single differentiator. If 5 are listed, pick the one with strongest proof.
- "The move they can't copy" must be structural (architecture, business model, asset), not aspirational ("better support").

### 2. Content pillars (3-5 themes, no more)

Each pillar is a recurring theme the client will own. Cite back to research.

| Pillar | What it owns | Evidence backing it | Channels it lives on |
|--------|--------------|---------------------|---------------------|
| ... | ... | ... | ... |

Pillar quality test:
- Could a competitor write the same pillar? → too generic
- Does it have enough material for 12 months of content? → if not, drop it
- Does the brand voice profile sound natural here? → if not, drop it

### 3. Sales motion

Pick ONE primary motion. Hybrid is acceptable but one must dominate.

| Motion | When it fits | Key org requirements |
|--------|-------------|----------------------|
| **PLG (Product-led)** | Self-serve product, sub-$500 ACV, fast aha moment | Activation analytics, in-product upgrade paths |
| **Sales-led** | $5k+ ACV, multi-stakeholder buy, demo required | SDR or founder-as-AE, CRM, sales process |
| **Marketing-led inbound** | $500-5k ACV, single buyer, SEO-friendly category | Content engine, marketing ops |
| **Community-led** | Developer/creator tool, peer-recommendation is purchase driver | Community manager, public artifacts (open source, free tier) |

For services: motion is almost always **sales-led** or **referral-led** — pick one and design around it.

### 4. Channel-ICP fit

Build a 2D map:

```
                 Awareness        Consideration     Conversion
Channel 1:       <activity>       <activity>        <activity>
Channel 2:       ...
Channel 3:       ...
```

**Constraints:**
- Max 4 channels for seed/Series A or small services agency
- Each channel must list weekly time + monthly budget
- One channel must own awareness; one must own conversion. Same channel doing both is suspect.

### 5. Campaign roadmap (next 6-12 months)

5-8 campaigns. Each campaign:

```markdown
### Q<X> — Campaign <name>
- **Trigger:** [why this campaign now? launch / season / new ICP / competitive]
- **Goal:** [single metric + number]
- **ICP focus:** [which segment]
- **Lead channel:** [primary]
- **Supporting channels:** [list]
- **Status:** planned / dependent on [...]
```

This is the input for future `/new-campaign` runs.

### 6. Capacity vs ambition (what we WON'T do)

Without this section, strategy is wishlist. Force these:

```markdown
## What we won't do (and why)

- ❌ [Channel/initiative] — not enough [time / budget / proof]. Revisit when [condition].
- ❌ [Segment] — outside primary ICP this year. Revisit after [milestone].
- ❌ [Tactic] — tried before, didn't work. Revealed [learning].
```

## Output

`clients/<name>/strategy.md`:

```markdown
# GTM Strategy — <client>
Created: <YYYY-MM-DD> | Owner: <name> | Horizon: <X> months

## 1. Positioning
[statement]

## 2. Content pillars
[table]

## 3. Sales motion
**Primary:** <motion>
**Why:** <rationale tied to ICP + product/service>

## 4. Channel-ICP fit
[matrix]

## 5. Campaign roadmap
[5-8 campaigns]

## 6. What we won't do
[list]

## Quarterly review checkpoints
- Q1 review: <date> — check positioning still holds
- Q2 review: <date> — check sales motion working
- Q3 review: <date> — full reset if needed
```

## SaaS vs Service differences

**SaaS additions:**
- Activation metric defined (the in-product event that signals "stuck = will churn")
- Expansion lever identified (seat growth, feature upsell, usage tier)
- Pricing page strategy (anchor, plan compression, free tier philosophy)

**Service additions:**
- Authority asset plan (signature framework, case study cadence, podcast / book)
- Capacity ceiling acknowledged (you can't onboard >N clients/month — strategy must respect)
- Referral engine design (how do happy clients become source of leads?)

## Principles

- **One ICP, one motion, one positioning.** Hedging is the death of strategy.
- **Pillars must have 12 months of material.** Test by writing 10 post titles per pillar in your head.
- **What we won't do** is the section that proves the strategy is real.
- **Strategy is a document, not a deck.** Save it, version it, revisit quarterly.

## Don't

- Don't list every channel that *could* work — pick 3-4 that *will*
- Don't write positioning that competitors could also use — that's category description, not positioning
- Don't skip the "won't do" section because it feels uncomfortable
- Don't generate a 12-month campaign roadmap if budget/team can only run 4 — match ambition to capacity
