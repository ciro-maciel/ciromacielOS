---
name: offer-package-calibrator
description: >
  Calibrate an offer package (base + equity + sign-on + benefits) for a specific candidate
  using comp band, leveling decision from panel, salary expectation captured at phone screen,
  and competing offers. Outputs target offer + max + negotiation playbook.
tags: [recruiting, ats, offer]
---

# Offer Package Calibrator

Pure reasoning skill. Turns a comp band + candidate data into a specific offer recommendation with negotiation room defined.

**Built for:** Recruiter preparing for a verbal offer call. Output goes into `candidates/<slug>/offer.md`.

## When to Use

- Inside `/offer calibrate` stage
- Whenever a debrief recommends Strong Yes / Yes and offer prep begins
- Re-calibrating after a counter-offer

## Phase 0: Inputs

Read:
1. `clients/<cliente>/jobs/<job-slug>/requisition.md` — comp band, equity range
2. `clients/<cliente>/jobs/<job-slug>/scorecard.md` — what level is this role
3. `candidates/<candidate-slug>/decision.md` — calibrated level from panel
4. `candidates/<candidate-slug>/screen.md` — salary expectation captured at phone screen
5. `clients/<cliente>/comp-band-history.md` if exists (past offers + acceptance data)

Ask if missing:
- Competing offers (verbal claims vs documented)
- Equity refresh schedule of the client
- Visa / relocation context

## Phase 1: Leveling Decision

The panel may calibrate the candidate to a different level than originally posted:
- **Down-leveled:** "Strong Yes, but at L4 not L5" → reset comp band, communicate clearly
- **At level:** straightforward
- **Up-leveled:** rare but happens when candidate is exceptional — requires extra approval

Note the leveling decision explicitly. Down-leveling without clear communication is the #1 cause of last-minute offer rejection.

## Phase 2: Comp Ratio Strategy

Within the comp band for the level, position the offer:

| Comp ratio | When to use |
|---|---|
| 50% (mid of band) | Solid Yes hire, no competing offers, met expectations |
| 60-70% | Strong Yes hire, or competing offer exists, or critical role |
| 75-85% | Exceptional candidate, multiple competing offers, urgent fill |
| 90%+ | Reserve for truly exceptional + critical. Sets precedent. Requires senior approval. |
| Below 50% | Down-level case OR candidate's expectation came in low. Be cautious — under-pay = early attrition. |

**Anchoring rule:** Target offer should be 5-10% above candidate's stated expectation (when expectation falls within band). This creates pleasant surprise — but only if the candidate's number wasn't anchored low (e.g., currency mismatch, naïve expectation).

## Phase 3: Equity Sizing

Equity is the noisiest, most opaque part. Defaults:
- **Early-stage startup (pre-Series B):** equity is the meaningful upside. Size aggressively for senior roles. Use % of company as anchor for staff+, $ value at last preferred for mid.
- **Scale-up (Series B-D):** $ value targeting (last preferred or 409A + growth premium). Refresh schedule matters.
- **Late-stage / public:** RSU value targeting. Refresh annually.

For each level + stage, output:
- Base equity grant ($ or % or shares)
- Vesting (default 4yr, 1yr cliff; flag if different)
- Refresh expectations (annual / biennial / performance-based)

## Phase 4: Sign-On

Sign-on bonus exists to:
- Bridge gap between offer and candidate's current pending bonus / equity vest
- Buy aggressive start date (signing now vs after current bonus payout)
- Compensate for relocation costs not covered separately

Default: sign-on if candidate is losing concrete $ by leaving early.
- Equity vest cliff in next 6 months? → sign-on to cover
- Annual bonus paying in next quarter? → prorated sign-on
- Relocation needed? → either covered separately or rolled into sign-on

Sign-on usually has clawback (1-2 year repayment if voluntary exit). Mention to candidate explicitly.

## Phase 5: Benefits Highlight

Don't recite the full benefits list. Pick 3-5 highlights that matter for THIS candidate:
- Parents → parental leave, dependent coverage
- Remote → home office stipend, equipment, co-working budget
- Senior → 401k match, sabbatical, ESPP
- International → visa support, relocation, tax assistance

## Phase 6: Negotiation Room (Target + Max)

Define internally:
- **Target offer:** what you'll extend verbally
- **Max:** the ceiling you can approve without going back for re-approval
- **Hard ceiling:** absolute max with approval (rare)

The gap between Target and Max is your negotiation room. If max = target, you have no room — risky.

Typical structure:
- Base: target $X, max $X + 5-8%
- Equity: target N shares, max N + 10-20%
- Sign-on: target $Y, max $Y + 50% (sign-on is the cheapest variable to bump — it's one-time)

**Rule of thumb:** if candidate counters, prefer to move sign-on or equity before base. Base sets ongoing precedent within the team; sign-on is a one-time cost.

## Phase 7: Counter-Offer Playbook

Pre-define your responses to common counters:

| Counter | Response |
|---|---|
| "$X more base" (≤10%) with competing offer documented | Usually accept up to max |
| "$X more base" (>10%) with competing offer | Counter intermediate, request comp committee approval |
| "$X more base" no documented competing offer | Hold target, offer flexibility on sign-on / equity / start date |
| "More equity" | Quote refresh schedule, offer higher initial grant if approved |
| "Higher title / level" | Caution — opens leveling redux. Reject unless panel agrees |
| "Different start date" | Almost always accommodate |
| "Remote vs in-office" | Per pre-agreed policy, no negotiation |
| "Current employer is counter-offering" | Coach them: counter-offers usually solve nothing long-term, but don't refuse outright |

## Phase 8: Output

Append to `candidates/<candidate-slug>/offer.md`:

```markdown
## Offer calibration

### Leveling decision
- Posted level: [...]
- Calibrated level: [...] (panel decision: [date])

### Comp band reference
- Base band: $X – $Y for [level]
- Equity band: [N - M shares / % / $ value]

### Candidate inputs
- Salary expectation (phone screen): $[...]
- Competing offers documented: [yes / no, details if yes]
- Current comp: $[base + equity + bonus] from [employer]

### Target offer
- Base: $[X]
- Equity: [N shares / % / $value] — [vesting schedule]
- Sign-on: $[Y] — [reason if applicable]
- Benefits highlights for this candidate: [3-5 items]
- Start date: [...]
- Total target $ (year 1): $[base + sign-on + equity year-1 vest]
- Comp ratio: [N]% of band

### Max offer (approval ceiling)
- Base: $[X+]
- Equity: [N+]
- Sign-on: $[Y+]

### Approvals required
- [ ] Hiring manager
- [ ] Comp / finance
- [ ] Exec (if above threshold)

### Anti-anchoring note
[If candidate's expectation was anchored low — e.g., they came from a lower-cost geo,
 or they're early-career and don't know market — note that and bias offer higher than
 their ask.]

### Negotiation playbook for this candidate
- Likely counter: [...]
- Pre-approved response: [...]
- Walk-away point: [...]
```

## Anti-patterns to refuse

- Offer at target = max — refuse, force room
- Below-band offer to "save money" — refuse, this is short-term thinking, predicts attrition
- Sign-on with no clawback for senior+ — refuse, standard practice
- Verbal offer extension before approvals — refuse, sequence the work
- "Negotiate hard" instruction — push back, the candidate is your future employee, this is a relationship not a transaction
