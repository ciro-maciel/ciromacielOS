---
name: copy-generator
description: >
  Generate marketing copy (cold email sequences, LinkedIn/X posts, landing page sections,
  ad variations) using a client's brand voice profile and ICP. Produces multiple variations
  per asset (not one), with variables marked for client-specific substitution. Pure reasoning
  skill. Pair with `copy-critic` agent for review.
tags: [content]
---

# Copy Generator

Generates marketing copy across canonical formats. Designed to be invoked one asset-type at a time (emails, then social, then landing, etc.) — not all at once.

**Built for:** Founders without copywriting background, or marketers needing first drafts that match brand voice. Output should be specific to the client, never generic.

## When to use

- After `/new-campaign` has produced a brief
- After brand voice + ICP exist
- For: **cold email sequences, email nurture, landing page sections, ad variations (LinkedIn/Meta/Google), X/Twitter posts**

## When NOT to use (delegate instead)

| Asset | Use this agent instead |
|-------|------------------------|
| Blog post / article / longform | `blog-writer` |
| LinkedIn organic post / carousel | `linkedin-writer` |
| Instagram feed / Reel / Story / carousel | `instagram-writer` |
| Video script (Reel, Shorts, TikTok, YouTube, LinkedIn video) | `video-script-writer` |

This skill stays for canonical short-form direct-response copy. Channel-native organic content goes to the channel specialists — they know the physics of each platform.

## Mandatory inputs (halt if missing)

| Input | Path |
|-------|------|
| Campaign brief | `clients/<name>/campaigns/<campaign>.md` |
| Brand voice profile | `clients/<name>/research/brand-voice.md` |
| ICP profile | `clients/<name>/research/icp-*.md` |

If brand voice is missing, halt. Generating copy without brand voice = generic copy = wasted output.

## Asset types — playbook per type

### 1. Cold email sequence (3-5 emails)

For each email in the sequence, structure:

```markdown
## Email N — [purpose]

**Subject line variations (3):**
1. [...]
2. [...]
3. [...]

**Preheader (1-line):** [...]

**Body:**
[copy — max 80 words for outbound]

**CTA:** [single, specific — not "let me know if interested"]

**Variables to fill:**
- {{firstName}}
- {{companyName}}
- {{triggerEvent}}
```

**Sequence structure (SaaS or service):**
- Email 1 — cold open (relevance + 1-line value + soft CTA)
- Email 2 — proof-driven (1 customer outcome + new CTA angle)
- Email 3 — pattern interrupt (question, contrarian take, or specific resource)
- Email 4 — breakup ("closing the loop" — final ask)

### 2. LinkedIn / X posts

For each post:

```markdown
## Post N — [angle]

**Format:** [insight / case study / hot take / how-to / behind-the-scenes]

**Hook (first 2 lines — must stop the scroll):**
[...]

**Body:**
[...]

**CTA:**
[single — comment prompt OR link OR DM ask]

**Variations:** Generate 2 alternative hooks for the same body.
```

**Hook patterns that work:**
- Specific number ("$0 → $47k MRR in 90 days")
- Contrarian claim ("Most [thing] advice is wrong")
- Unexpected admission ("We almost killed [feature]. Here's why we didn't.")
- Direct question to the ICP ("Founders: how do you handle [pain]?")

**Avoid:**
- "I've been thinking about..."
- "Hot take:" (overused)
- Engagement bait disguised as opinion ("Agree or disagree?")

### 3. Landing page sections

Generate section by section:

```markdown
## Hero

**Headline (3 variations):**
1. [...]
2. [...]
3. [...]

**Subhead (1):**
[1 sentence — clarifies WHO it's for + WHAT outcome]

**Primary CTA:** [...]
**Secondary CTA (optional):** [...]
```

Then optionally:
- **Problem section** — 3 bullet pains in ICP's literal language
- **Solution section** — 3 outcomes with proof
- **Social proof block** — logos + 1 hero quote
- **Features section** — 3-4 features framed as outcomes (not specs)
- **Pricing positioning** (if relevant) — anchoring sentence
- **FAQ** — 4-6 questions ICP actually asks (from intake / ICP profile)
- **Final CTA block**

### 4. Ad variations (LinkedIn / Google / Meta)

Generate 4-6 variations. Each:

```markdown
## Ad N — [angle]

**Headline (max chars per platform):**
[...]

**Body:**
[...]

**Image direction:** [what should the image convey — not the image itself]

**CTA button:** [exact button copy]

**Targeting hint:** [if obvious — title / industry / interest]
```

**Variation diversity rule:** the 4-6 ads should differ in *angle*, not just wording. Specifically:
- One ad with social proof angle
- One with contrarian/problem angle
- One with direct benefit angle
- One with FOMO/urgency angle (only if there IS urgency — don't fake)

## SaaS vs Service nuances

### SaaS copy

- CTA bias: "Try free" > "Book demo" (unless enterprise)
- Proof bias: usage numbers, time saved, integrations
- Tone bias: confident + technical when ICP is technical
- Avoid: vague "boost productivity"; force specific outcome

### Service copy

- CTA bias: "Book a call" > "Try free" (services don't have free tier)
- Proof bias: case studies with names, before/after metrics
- Tone bias: authority + opinion (services compete on judgment, not features)
- Avoid: "We help companies..."; force specific deliverable + outcome

## Brand voice adherence — non-negotiable

Before writing, extract from `brand-voice.md`:
- 3 adjectives that describe tone
- Sentence length tendency (short/medium/long)
- Vocabulary level (technical/accessible/in-between)
- Forbidden words (every brand has them — list them)
- Required phrases (signature terms — if any)

Write a 1-line voice anchor at the top of your output:
> Voice anchor: <3 adjectives> | Sentences: <length> | Avoid: <forbidden> | Use: <required>

## Output

Save to `clients/<name>/campaigns/<campaign>-assets/<asset-type>/`:

```
campaigns/<campaign>-assets/
  ├── emails/
  │   ├── 01-cold-open.md
  │   ├── 02-proof.md
  │   └── 03-breakup.md
  ├── social/
  │   ├── linkedin-01.md
  │   └── linkedin-02.md
  ├── landing/
  │   └── landing.md
  └── ads/
      ├── linkedin-01.md
      └── linkedin-02.md
```

Each file is pure Markdown — copy/paste-ready for the destination tool.

## Principles

- **Variations, not single drafts.** Always 2-3+ options per critical element (subject lines, hooks, CTAs).
- **Specific > clever.** A number beats an adjective. A name beats a category.
- **Brand voice trumps your style.** If brand voice says "no exclamation points," obey even if it feels flat.
- **Pair with copy-critic.** Every asset goes through the critic before shipping. If critic flags issues, regenerate the specific lines — don't manually rewrite.

## Don't

- Don't write copy without reading brand-voice.md — generic = useless
- Don't use placeholder names ("Acme Corp") — use variables ({{companyName}})
- Don't write 4 ad variations that are wording variations of the same angle — diversify angles
- Don't ignore platform character limits (LinkedIn ad headline ≠ Google ad headline)
