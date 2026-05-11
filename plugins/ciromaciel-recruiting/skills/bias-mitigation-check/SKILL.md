---
name: bias-mitigation-check
description: >
  Audit recruiting artifacts (JD, scorecard, interview questions, rubrics) for bias risks:
  coded language, requirements that disproportionately filter out qualified candidates,
  rubrics with adjective-only anchors, panel composition issues. Outputs specific edits.
tags: [recruiting, ats, bias, dei]
---

# Bias Mitigation Check

Pure reasoning skill. Audits recruiting artifacts for bias risks and proposes concrete edits. Not a moralistic review — a quality review focused on outcomes (better hires, wider qualified pools, fewer false negatives).

**Built for:** Recruiters who want their process to actually be fair, not performative about it.

## When to Use

- After `/intake` produces scorecard + JD (always — pre-publication audit)
- After interview kits are generated for a candidate
- Spot-check during `/report` if diversity mode shows drop-off
- "Audit this JD" / "Review this scorecard for bias"

## What this skill does NOT do

- Doesn't enforce quotas or change WHO you hire
- Doesn't recommend "diversity hires" — there is no such thing, only good hires from wider pools
- Doesn't moralize. Audits artifacts for technical quality.

## Phase 0: Inputs

Read whichever artifacts user points to:
- `job-description.md`
- `scorecard.md`
- `interviews/<NN>-<type>.md`
- `assessment-template.md`

## Phase 1: JD Audit

**Coded language check**

Flag and rewrite:
- "Rockstar / ninja / wizard" (masculine-coded in research) → use action verbs
- "Aggressive / dominant / fearless" (masculine-coded) → "ambitious / decisive / takes calculated risks"
- "Nurturing / collaborative / supportive" alone (feminine-coded — fine, but balance) → mix with directive language
- "Young / energetic / digital native" (age-coded, often illegal in EU/CA/some US states) → drop or describe behavior ("comfortable iterating quickly")
- "Strong / robust / hardworking" stacked (masculine-coded) → vary verbs
- "Native English speaker" (national-origin-coded, often illegal) → "fluent English"
- "Manpower / man-hours / chairman" → "headcount / hours / chair"

**Requirement bloat check**

For each "Required":
- Is this truly disqualifying? (would you reject a Strong Yes who lacks this?)
- Is it measurable? ("5 years of experience" is weak signal — ability matters more than tenure)
- Does it have legal-equivalence wording? ("Bachelor's degree" → "or equivalent practical experience" unless legally required for the role)

Research backing: women apply at 100% match; men at 60%. Every unnecessary "required" cuts your qualified pool disproportionately. Trim to 4-6 hard musts.

**Salary transparency check**

Range present? If not + jurisdiction requires it (CA, NY, CO, WA, EU pay transparency) → REFUSE to publish.

**Imagery / inclusion signaling check**

If JD includes language like "we welcome people of all backgrounds" — only retain if the rest of the JD matches (else feels performative). If process has zero accommodations language → add at minimum: "Need accommodation in the interview process? Reply to this email."

## Phase 2: Scorecard Audit

**Competency check**

- Is "culture fit" a top-level competency? → REFUSE, decompose into specific observable behaviors
- Is anything an adjective rather than behavior? → flag, force rewrite
- Are competencies role-specific or generic? → flag if generic

**Level rubric check**

For each competency, are the 4 levels described with observable behavior or adjectives?

Bad: "4 - Excellent communication"
Good: "4 - Adapts framing in real-time to match listener's context"

If adjectival, force rewrite.

**Knockout check**

For each knockout question, can you defend it as truly disqualifying?
- "Work authorization in [country]" — usually defensible
- "5+ years experience" — usually NOT defensible as knockout (use as competency)
- "Bachelor's degree" — almost never defensible as knockout unless legally required

## Phase 3: Interview Kit Audit

**Question quality check**

- Are questions behavioral ("tell me about a time") or hypothetical ("what would you do")? Push toward behavioral.
- Are anchor questions the SAME across candidates for the same vacancy? Comparability requires identical anchors.
- Are rubric anchors observable or adjectival?

**Bias trap check per question**

- "Where did you go to school?" / "What part of [region] are you from?" — flag, irrelevant to most roles, signals demographic info
- "How would you handle a [stereotypically-coded scenario]?" — flag
- Questions about parental status, marital status, religion, citizenship beyond work auth — REFUSE

**Panel composition**

If panel is documented:
- All same-demographic panel for diverse candidate pipeline → flag, suggest mixed panel
- All-IC panel for manager+ role → flag, suggest at least 1 manager
- No bar raiser / cross-functional → flag if process claims to have one

## Phase 4: Assessment Audit

- Time budget realistic for working candidates? (Anything >4h take-home filters by privilege)
- Domain-relevant or generic? (Generic = lower signal + higher gameability)
- Rubric anchors observable?
- Anti-cheating includes live walkthrough?
- Reviewer instructions include "submit before seeing others' scores" (anti-anchoring)?

## Phase 5: Process Audit

- Number of stages: 4-6 is healthy. 7+ filters by privilege (only candidates with current-employer slack can afford).
- Total time commitment from candidate: stated upfront? Realistic?
- Same interview structure for every candidate? Comparability requires it.
- Debrief discipline: scorecards submitted BEFORE debrief discussion?

## Phase 6: Output

Generate `clients/<cliente>/jobs/<job-slug>/bias-audit.md`:

```markdown
# Bias mitigation audit — [Vacancy] | [Date]

## Summary
- Artifacts audited: [list]
- Issues found: [N total — H high, M medium, L low]
- Status: [READY / NEEDS-REVISION / BLOCKER]

## Findings

### HIGH (blocker — fix before publishing/using)

1. **[Issue title]** in `[file:line]`
   - Current: "[quote of problematic text]"
   - Why this matters: [1 sentence — outcome-focused, not moral]
   - Suggested rewrite: "[new text]"

### MEDIUM (fix soon)
[same format]

### LOW (consider for future)
[same format]

## Quick wins (do these in 10 min)
- [Specific action 1]
- [Specific action 2]
- ...

## Deeper changes (require discussion with hiring manager)
- [Action with rationale]
```

## Anti-patterns this skill refuses

- "Make it sound diverse without changing anything" — refuse, performative
- "Add a 'diversity statement' to the JD" without other changes — flag as performative
- "We want to hire more X demographic" — refuse to change the scorecard. Instead, audit pipeline drop-off and broaden sourcing.

## Calibration: this is a quality skill

Bias mitigation done right = wider qualified pool + fewer false negatives + better hires. If a "fix" makes the process worse (longer, less signal, less comparable), it's not a fix. Push back.
