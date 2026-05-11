---
name: technical-assessment-designer
description: >
  Design technical assessments (take-home, live coding, system design, case study) for a
  specific role + level. Outputs prompt, rubric, anti-cheating strategy, evaluator instructions.
  Calibrates for candidate-experience cost vs signal quality.
tags: [recruiting, ats, assessment]
---

# Technical Assessment Designer

Pure reasoning skill. Designs a specific assessment for a specific role, with rubric tied to the scorecard.

**Built for:** Recruiters designing the technical step of a panel, often together with the hiring manager.

## When to Use

- Inside `/assess design` for a new vacancy
- Refreshing an assessment that's been leaked or solved publicly
- Replacing a generic LeetCode loop with something role-relevant

## Phase 0: Inputs

Read:
1. `clients/<cliente>/jobs/<job-slug>/scorecard.md` — competencies to evaluate
2. `job-description.md` — actual stack and domain
3. Hiring manager preferences (time budget, format)

## Phase 1: Format Selection

| Format | Best for | Signal | Candidate cost | Anti-cheat difficulty |
|---|---|---|---|---|
| **Take-home** | Code quality, design thinking, autonomous work | High (deep work shown) | High (4-8h) | Hard — GPT now writes good answers |
| **Live coding (60-90min)** | Problem solving under pressure, communication while coding | Medium-high | Low | Easy (live observation) |
| **System design (45-60min)** | Architecture thinking, trade-off reasoning, senior+ judgment | High | Low | Easy |
| **Case study / business** | Analytical thinking, business judgment (PM, ops) | Medium | Medium | Medium |
| **Pair programming on real code** | Collaboration, codebase navigation, code review skill | Very high | Medium | Easy |
| **Async written exercise** | Writing, structured thinking (PM, designer, DevRel) | High for non-eng | Medium | Medium |

### Default recommendations by role

- **Backend engineer:** live coding + system design (skip take-home unless senior+)
- **Frontend engineer:** take-home with real component requirements + live walkthrough
- **Staff+ engineer:** system design + pair programming on real codebase
- **Data scientist:** case study with real-ish dataset + live discussion
- **PM:** product case + writing exercise + roadmap critique
- **Designer:** portfolio review + live critique + design exercise

### Hard rules

- **NEVER more than one take-home per process.** Take-homes are a tax on the candidate. One is fair; two is abusive.
- **NEVER ask a take-home longer than 4h estimated.** Anything more = wealthy-candidates-only filter.
- **NEVER use generic LeetCode for non-FAANG-scale companies.** Use real problems from your domain.
- **ALWAYS pair take-homes with a live walkthrough.** Otherwise you can't validate authorship.

## Phase 2: Prompt Design

### Take-home prompt structure

```markdown
# [Title] — [Role] Take-home

## Context
[1-2 sentences setting up the real-world scenario from the company's domain.
 Not "your task is to implement". Make it a real problem.]

## Your task
[Clear, bounded scope. What to build. What's IN scope vs OUT of scope.]

## What we'll evaluate
[List 4-6 things you actually care about, mapped to scorecard competencies.
 Be specific: "We care about how you structure the code, not whether you cover
 every edge case."]

## Constraints
- Time budget: [N hours — TARGET, not max]
- Language / stack: [if specific] OR [your choice — pick what you're fastest in]
- Libraries: [allowed / restricted]
- Don't worry about: [things candidates over-engineer — testing every edge,
                       optimizing premature, writing docs they wouldn't write at work]

## What to submit
- Code: [GitHub repo / zip / etc.]
- A README with: [trade-offs you made, what you'd do with more time, anything
                  you'd flag if reviewing this in production]
- Optional: 5-min Loom walkthrough (we love these)

## Deadline
[3-7 days after receipt — long enough to fit around a real job]

## Questions
[Recruiter contact for clarifications — encourage candidates to ask]
```

### Live coding prompt structure

```markdown
# [Title] — Live coding session

## Format (60min total)
- 5min: Intro + setup
- 5min: Problem walkthrough + clarifying questions
- 40min: Coding + discussion
- 10min: Wrap, your questions

## The problem
[Real problem from the domain. Smaller than take-home — they have 40min.]

## What we want to see
- How you clarify ambiguity (ask us questions — silence is a yellow flag)
- How you think about the problem before typing
- How you handle pressure when something doesn't work
- How you talk through trade-offs as you make them

## Environment
- Editor: [their choice / our shared editor]
- AI assistants: [your policy — banned / allowed-with-disclosure / encouraged]
- We'll ask follow-ups as you go — feel free to push back or ask for hints

## Not what we want
- Memorized solutions to canonical problems
- Perfect code — we want to see how you THINK, not what you remember
```

## Phase 3: Rubric (mapped to scorecard)

For each scorecard competency the assessment is meant to evaluate, define a 4-point rubric:

```markdown
### Code quality (target: Code quality competency from scorecard)

- 4 - Strong Yes: Idiomatic for stack, clear naming, separated concerns, readable
       end-to-end. Tests cover the *interesting* cases not just happy path. README
       explicitly names what they didn't do.
- 3 - Yes: Solid code, sensible structure, some tests. Doesn't surprise the reviewer.
- 2 - No: Works, but reviewer flagged 3+ things they'd want changed in a real PR
       (naming, structure, missing handling).
- 1 - Strong No: Reviewer would not merge this. Hard to follow, no separation,
       broken in obvious places.
```

For LIVE assessments, add:
- **Process indicators** (not just output): asked clarifying questions, narrated
  trade-offs, recovered gracefully when stuck, gave honest "I don't know" instead
  of bluffing.

## Phase 4: Anti-Cheating Strategy

**Reality:** in 2025+, AI coding assistants make take-homes vulnerable. Strategy:

1. **Don't try to detect AI use — assume it.** Design assuming the candidate had AI help.
2. **Mandatory live walkthrough** of any take-home submission. 15-20min where they:
   - Walk through the code
   - Explain choices live (their voice, no time to prep an answer with AI)
   - Modify the code in real-time when you ask "what would change if X?"
3. **Ask questions GPT can't answer well:** trade-offs specific to your domain, judgment calls, "what did you try and discard?"
4. **For live coding:** be explicit about AI policy. Banning entirely is hard to enforce; allowing-with-disclosure is honest and observable.

For roles where AI use is part of the job (anything AI-related, or any modern eng role really): allow it openly, and evaluate **how well they use AI**, not whether.

## Phase 5: Bias Mitigation

- **Blind review where possible:** evaluator sees submission without name, photo, school, prior companies
- **Same rubric, multiple reviewers when possible:** 2+ independent reviews reduce single-reviewer variance
- **Calibration round:** if rolling out a new assessment, have 2-3 internal engineers do it first and score themselves to validate rubric calibration
- **Time-cap mercy:** if take-home, evaluate what they did in stated time — don't reward people who spent 16h on a "4h" exercise

## Phase 6: Output

Two files in `clients/<cliente>/jobs/<job-slug>/`:

**`assessment-template.md`** — for the candidate
```markdown
# [Title]
[Full prompt from Phase 2]
```

**`assessment-rubric.md`** — for evaluators (NOT shared with candidate)
```markdown
# Rubric — [assessment title]

## Scorecard competencies evaluated
[List with weights]

## Per-competency rubric
[4-level rubric per competency from Phase 3]

## Process indicators (live only)
[List]

## Anti-cheating protocol
[Live walkthrough plan]

## Reviewer instructions
- Score competency-by-competency, don't average to global "good/bad"
- Submit scorecard BEFORE seeing other reviewers' scores (anti-anchoring)
- Cite specific evidence (line numbers, quotes) for each score
- Flag "I'm uncertain about X" rather than guessing

## Calibration history
- [Date]: Tested on internal engineers, scores ranged X-Y
- [Date]: Refreshed prompt because [reason]
```

## Anti-patterns to refuse

- Take-home longer than 4h estimated — refuse, force trim
- Two take-homes in one process — refuse
- Generic LeetCode for non-FAANG — refuse, build real-domain problem
- Take-home without live walkthrough — refuse, can't validate authorship
- Rubric not tied to scorecard — refuse, force the mapping
