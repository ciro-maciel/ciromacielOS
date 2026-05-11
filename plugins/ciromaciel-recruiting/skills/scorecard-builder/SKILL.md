---
name: scorecard-builder
description: >
  Build a structured scorecard for a job opening BEFORE any candidate is screened.
  Defines competencies, scale (1-4), weights, and what evidence at each level looks like.
  Forces evaluation criteria to be set before exposure to candidates — primary bias mitigation.
  Pure reasoning skill, no scripts.
tags: [recruiting, ats]
---

# Scorecard Builder

Pure reasoning skill. Produces a job-specific scorecard that locks in evaluation criteria before any candidate is seen. This is the single most important artifact in the funnel — every downstream stage references it.

**Built for:** Agency recruiters serving multi-client engagements. Output should be specific to the role + level + company stage, not a generic competency framework.

## When to Use

- New job opening just opened in intake
- "What should we evaluate for [role]?"
- Recalibrating scorecard mid-funnel because hiring manager moved goalposts (rare but happens)

## Why scorecard before JD

If you write the JD first, you anchor on superficial keywords. The scorecard forces the harder question: *what does competence at this level actually look like?* The JD is just marketing for the scorecard.

## Phase 0: Inputs

Read or ask for:
1. **Role** (title + function)
2. **Level** (junior / mid / senior / staff / principal / lead / manager / director)
3. **Company stage** (early startup / scale-up / enterprise) — calibrates expectations
4. **Hiring manager's must-haves** (from intake meeting)
5. **Domain context** (B2B SaaS / fintech / e-commerce / etc.)
6. **Team size and structure** (informs IC vs leadership weight)

## Phase 1: Competency Selection

Pick **5-8 competencies max**. More than 8 = nobody scores well on all, decision becomes noisy. Less than 5 = you'll miss important signal.

### Default competency menu (pick relevant ones)

**Technical roles (engineering/data/ML)**
- Technical depth in primary stack
- System design / architecture thinking
- Code quality / engineering rigor
- Problem decomposition
- Production / operational mindset
- Cross-functional collaboration
- Communication (written + verbal)
- Domain knowledge (if specialized)
- Mentorship / influence (senior+)

**Product / design**
- Product judgment
- User empathy / research instinct
- Strategic thinking
- Execution / shipping velocity
- Stakeholder management
- Craft (design quality / writing quality)

**GTM (sales/marketing/CS)**
- Discovery skill
- Domain credibility
- Pipeline management
- Communication / storytelling
- Resilience / objection handling
- Data instinct
- Coachability

**Leadership (manager+)**
- People judgment / hiring
- Coaching / feedback
- Strategic thinking
- Stakeholder management
- Operational rigor
- Vision setting

### Selection criteria

- ONE primary competency owned per interview slot in the panel (panel design)
- Must-haves from intake become competencies, not nice-to-haves
- "Culture fit" is NOT a competency — too vague, high bias risk. Decompose into specific behaviors (e.g., "operates well in ambiguity", "raises disagreement constructively")

## Phase 2: Calibrate Levels

For each competency, write 4 levels with **observable behavior**, not adjectives.

Bad:
```
4 - Excellent at system design
3 - Good at system design
2 - Average
1 - Weak
```

Good:
```
4 - Strong Yes: Drove design of a system handling >1M req/day under real constraints
    (cost, team capacity, on-call burden). Made and defended trade-offs against
    pushback. Can articulate alternatives considered and why rejected.
3 - Yes: Designed components within a larger system with awareness of CAP trade-offs,
    failure modes, observability. Made reasonable choices but didn't drive strategy.
2 - No: Implemented designs handed down. Can describe own component but struggles
    with system-level questions (scale, failure, evolution).
1 - Strong No: Cannot reason about systems beyond local code. Treats infrastructure
    as black box.
```

The 4-level scale forces a decision (no middle "3.5"). Strong Yes vs Yes differentiates "hire even if no spot open" from "hire if we have an opening".

## Phase 3: Weight + Panel Mapping

For each competency:
- **Weight** (relative importance) — sum to 100
- **Must-have or nice-to-have**
- **Primary interview slot** (who is responsible for evaluating it) — should be exactly ONE
- **Backup slot** (secondary signal source — optional)

| Competency | Weight | Must? | Primary | Backup |
|---|---|---|---|---|
| System design | 25 | ✓ | Tech Deep-dive | System Design |
| Code quality | 20 | ✓ | Take-home review | Tech Deep-dive |
| Communication | 15 | ✓ | Behavioral | All slots |
| ... | | | | |

## Phase 4: Knockout Questions

Define 2-4 binary questions that auto-reject:
- Work authorization in [location]?
- Years of experience ≥ [N] in [primary skill]?
- Willing to be on-call / hybrid / etc.?

These run BEFORE human review. Be ruthless — anything not truly disqualifying should be a competency score, not a knockout.

## Phase 5: Output

Write to `clients/<cliente>/jobs/<job-slug>/scorecard.md`:

```markdown
# Scorecard — [Role title] | [Level] | [Client]

## Role context
- Hiring manager: [...]
- Team: [...]
- Reports to: [...]
- IC vs leadership: [...]

## Knockout questions
1. [binary q]
2. [binary q]

## Competencies

### 1. [Competency name] — Weight: X | Must-have: ✓/✗ | Primary slot: [interview type]

**4 - Strong Yes:** [observable behavior]
**3 - Yes:** [...]
**2 - No:** [...]
**1 - Strong No:** [...]

[repeat for each competency]

## Panel design
| Slot | Primary competency | Interviewer suggested |
|---|---|---|
| Phone screen | [...] | Recruiter |
| Technical | [...] | [name/role] |
| ... | | |

## Calibration notes
- [Anything specific to this hire — e.g., "we're optimizing for X, accepting trade-off on Y"]

## Author + Date
- Built by: [recruiter]
- Approved by: [hiring manager]
- Date: [...]
```

## Anti-patterns to refuse

- Scorecard written AFTER reviewing some CVs — refuse, restart fresh
- "Culture fit" as a top-level competency — push back, decompose
- More than 8 competencies — refuse, force trade-offs
- Weighted competencies that don't sum to 100 — fix
- Levels described with adjectives only — refuse, force observable behavior
- No must-have/nice-to-have distinction — refuse, this is the trade-off that matters

## Calibration checklist before signing off

- [ ] Hiring manager has reviewed and approved
- [ ] Each competency has ONE primary interview slot owning it
- [ ] Knockouts are truly disqualifying (no "preferred")
- [ ] Levels are observable, not adjectives
- [ ] Total weights = 100
- [ ] No more than 8 competencies
- [ ] Must-haves are <= 5 (else you're describing a unicorn)
