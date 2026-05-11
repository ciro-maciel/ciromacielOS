---
name: competitor-analysis
description: >
  Structured framework for analyzing 3-5 direct competitors (positioning, pricing,
  messaging, content, social proof). Pure reasoning skill — works alongside the
  `competitor-researcher` agent, which handles web fetching. Use this skill when
  you already have raw competitor content (sites, screenshots, copy) and need to
  turn it into a strategic comparison.
tags: [research, strategy]
---

# Competitor Analysis

Reasoning skill that takes raw competitor inputs and produces a structured strategic comparison. Pair with the `competitor-researcher` agent when you also need web fetching.

## When to use

- "Analyze these 4 competitors: A, B, C, D"
- "I pasted competitor sites — find the brechas"
- After `competitor-researcher` has done its sweep, use this skill to push deeper on positioning logic
- Before `gtm-strategist` — strategy without competitor map is positioning in a vacuum

## Inputs

| Input | Required | Source |
|-------|----------|--------|
| Competitor names + URLs | Yes | User or agent output |
| Client ICP | Yes | `clients/<name>/research/icp-*.md` |
| Client positioning (if exists) | Optional | `clients/<name>/strategy.md` |
| Raw page content | Optional | If already fetched, skip the fetching step |

## Framework — 4 layers of analysis

Most competitor decks compare features. That's the least useful layer. Go deeper.

### Layer 1 — Surface (the obvious)

- Categories they claim
- Headline pricing
- Logo customers
- Features they highlight

This is table stakes. Capture it, but don't stop here.

### Layer 2 — Positioning (the strategic)

- **Who they fire as a customer** — pricing floor reveals down-market exclusion; messaging reveals up-market exclusion
- **What category they refuse to compete in** — "we are X, not Y" tells you what they ceded
- **What objection they keep answering** — repeated rebuttal reveals their #1 lost-deal reason
- **Anchor concept** — the 1 metaphor or analogy they keep reaching for (e.g., "the Stripe of X", "spreadsheet replacement")

### Layer 3 — Narrative (the emotional)

- **Hero of their story** — is the customer the hero, or is the product the hero?
- **Enemy** — every brand needs an enemy. Theirs is: legacy tools? manual work? competing category?
- **Promise** — what transformation do they promise? (be specific: from X state to Y state)
- **Proof tone** — case studies as numbers or stories? big logos or peer logos?

### Layer 4 — Operational (where they're weak)

- Loading speed, design quality (does the marketing site feel premium?)
- Content cadence — abandoned blog? Fresh weekly?
- Support visible? Or hidden behind login?
- Last fundraise / last big release — momentum signal

## Cross-competitor synthesis

After analyzing each individually, force these synthesis questions:

1. **Convergence point** — what claim do ALL of them make? (That claim is now table stakes — don't make it your positioning.)
2. **Battlegrounds** — what 2-3 dimensions are they actively fighting on? (Speed? Price? Enterprise? DevEx?)
3. **Whitespace** — what does the ICP care about that NONE of them address well?
4. **Vulnerable competitor** — which one has the weakest narrative + strongest market share? That's the one to attack.

## Output format

```markdown
# Competitor Analysis — <client>
Date: <YYYY-MM-DD>

## Competitive set
- A (<url>) — leader / challenger / disruptor
- B (<url>) — ...
- C (<url>) — ...

## Per-competitor breakdown

### A — <Name>
[Layer 1 / 2 / 3 / 4 — fill all 4]

### B — ...
### C — ...

## Synthesis

### Convergence (table stakes — don't repeat)
- ...
- ...

### Active battlegrounds
| Dimension | Who's winning | Why |
|-----------|---------------|-----|

### Whitespace (no one's serving this)
1. ...
2. ...

### Vulnerable competitor
**[Name]** — strong market share but weak narrative because [...]. Attack vector: [...]

## Implications for <client>

3 positioning moves that follow from this analysis:
1. ...
2. ...
3. ...
```

## Principles

- **Cite literal copy.** When capturing positioning, quote exactly. "They emphasize speed" is weak; `"Ship 10x faster"` is strong.
- **Force the synthesis.** Per-competitor reports are dumps. The synthesis is where strategic value lives.
- **Whitespace ≠ feature gap.** A feature competitors don't have isn't whitespace — it might be a feature customers don't want. Whitespace is unmet *need*.
- **Don't fake neutrality.** Recommend a vulnerable target. Strategy requires choice.

## Don't

- Don't compare features in isolation — features without narrative are noise
- Don't list "differentiators" the client claims but can't prove
- Don't skip layer 4 — operational weakness is where small teams beat big competitors
