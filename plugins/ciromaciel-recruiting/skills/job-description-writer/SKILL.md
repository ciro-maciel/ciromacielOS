---
name: job-description-writer
description: >
  Write a structured, neutral-tone job description from an existing scorecard.
  Separates responsibilities from requirements, uses inclusive language, optimizes for
  qualified-applicant signal not application volume. Pure reasoning skill.
tags: [recruiting, ats]
---

# Job Description Writer

Pure reasoning skill. Converts a scorecard + role context into a job description that attracts the right candidates and repels the wrong ones.

**Built for:** Agency recruiters. Output should be ready to publish — not a template.

## When to Use

- Right after `scorecard-builder` (always — JD without scorecard = anchoring on keywords)
- Refreshing a stale JD when sourcing is underperforming
- Rewriting a JD that came from the client and is poorly structured

## Phase 0: Prerequisites

Read:
1. `clients/<cliente>/jobs/<job-slug>/scorecard.md` (REQUIRED — refuse without it)
2. `clients/<cliente>/profile.md` or equivalent (company tone, voice, mission) — if it exists
3. Comp band and location info from `requisition.md`

## Phase 1: Optimize for Signal, Not Volume

A JD's goal is **qualified-applicant rate**, not absolute volume. Optimize for:
- Right candidates apply (signal)
- Wrong candidates self-deselect (saves screening hours)
- Search-engine match for relevant queries (without keyword stuffing)

## Phase 2: Structure (canonical order)

```markdown
# [Job Title] — [Company/Client]

## About [Company]
[2-3 sentences. Mission, stage, traction signal. NOT corporate boilerplate.]

## The role
[3-5 sentences. What this person owns, why it exists, what success looks like
 at 6 months. Pull from scorecard's role context.]

## What you'll do
[5-7 bullets. Real responsibilities, not aspirational. Map to scorecard
 competencies but use action language: "Design and ship ___", "Lead ___"]

## What we're looking for
### Must have
[Map from scorecard must-have competencies. Stated as observable experience or
 ability, not "X years of...". 4-6 bullets max.]

### Nice to have
[2-4 bullets. Genuinely optional. If you have more than 4, you're describing a
 unicorn.]

## What you won't be doing
[2-3 bullets. Optional but powerful — repels wrong candidates explicitly.]

## Compensation and benefits
- Base salary range: $X – $Y
- Equity: [range or framework]
- [Other benefits]

## Process
[Brief — number of stages, total time commitment expected from candidate.]

## Logistics
- Location / remote / hybrid
- Start date target
- Visa sponsorship: yes / no / case-by-case
```

## Phase 3: Language Rules

**Inclusive language audit**

Replace these patterns:
| Avoid | Use |
|---|---|
| "rockstar / ninja / wizard" | descriptive verbs ("you'll architect", "you'll ship") |
| "aggressive" | "ambitious" or specific outcomes |
| "guys" / "manpower" | "team" / "headcount" / "people" |
| "young and dynamic" | drop entirely — age coded |
| "must have N years experience" | "demonstrated ability to..." (years are a poor proxy) |
| "Bachelor's degree required" (unless legally required) | "or equivalent practical experience" |
| Long lists of nice-to-haves with "preferred" | trim — women apply when 100% match, men at 60% (Hewlett-Packard data) |
| "fast-paced environment" | specific signal ("we ship weekly", "on-call rotation is 1-in-6") |

**Tone**
- Match the company's voice (read existing content if available)
- Concrete over abstract
- Specific numbers when possible (team size, traffic, revenue stage)
- No corporate bingo ("synergy", "leverage", "best-in-class")

**Length**
- Target 400-600 words total
- Anything over 800 words loses 30%+ of qualified applicants
- Cut "What you won't do" if running long

## Phase 4: Salary Transparency

**Default: include the range.**

Evidence: ranges increase qualified applicants by 30%+ and reduce mismatched expectations downstream. Many jurisdictions now require it (NYC, Colorado, California, EU pay transparency directive).

If client refuses, push back:
- Offer a range with band caveat
- Or "competitive, benchmarked to [percentile] of [market]"
- Refuse to write "competitive" alone — meaningless

## Phase 5: SEO + Discoverability

Without keyword stuffing:
- Title: standard taxonomy ("Senior Backend Engineer", not "Senior Code Wizard")
- Mention the primary tech stack 2-3x naturally
- Include city/region name once if location matters
- Schema.org `JobPosting` tags if publishing to careers page

## Phase 6: Output

Write to `clients/<cliente>/jobs/<job-slug>/job-description.md`.

Also generate a **shortlist of variants** for different channels:
- LinkedIn post (200 words, hooks-first)
- Twitter/X thread (5-7 tweets)
- Internal referral pitch (3-4 sentences, for employees to share)

Save variants in `clients/<cliente>/jobs/<job-slug>/jd-variants/`:
- `linkedin.md`
- `twitter.md`
- `referral-pitch.md`

## Anti-patterns to refuse

- Writing the JD without an existing scorecard — refuse
- "Must have X years experience" stacked — flag, suggest competency-based alternative
- More than 6 nice-to-haves — flag, force trim
- No salary range when client is in a transparency jurisdiction — refuse legally
- Generic "fast-paced, dynamic team" — refuse, force specifics
- Keyword-stuffed JD — refuse, rewrite

## Quality checklist before publish

- [ ] Scorecard exists and was the source
- [ ] Must-haves ≤ 6 bullets
- [ ] Nice-to-haves ≤ 4 bullets
- [ ] Salary range included (or jurisdictionally compliant)
- [ ] No coded language (gender, age, ableism)
- [ ] Specific signals (numbers, traction, stack) not vague claims
- [ ] Word count 400-600
- [ ] Mentions specific stack 2-3x naturally
- [ ] Process and timeline mentioned
