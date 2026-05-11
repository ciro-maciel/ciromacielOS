---
name: funnel-analytics
description: >
  Compute recruiting funnel metrics: conversion rates, time-in-stage, time-to-fill, source
  performance, interviewer calibration, pipeline diversity, quality of hire. Outputs analysis
  with benchmarks and identified bottlenecks. Reads pipeline.md and application.md files.
tags: [recruiting, ats, analytics]
---

# Funnel Analytics

Pure reasoning skill. Reads structured pipeline + application data and produces funnel analysis with actionable insights.

**Built for:** Recruiter or recruiting lead running weekly / monthly / quarterly reviews of how the funnel is performing.

## When to Use

- Inside `/report` command
- "How's the funnel looking?"
- "Where are we losing candidates?"
- Before quarterly planning to decide where to invest

## Phase 0: Inputs

Read recursively:
- `clients/<cliente>/jobs/*/pipeline.md` (snapshot of each vacancy)
- `clients/<cliente>/jobs/*/candidates/*/application.md` (per-candidate state + history)
- `clients/<cliente>/jobs/*/reports/index.md` (past reports for trend)

Confirm:
- Period: week / month / quarter / YTD / custom
- Scope: single client / all clients / specific vacancy
- Mode: funnel / interviewer-calibration / source / diversity / quality

## Phase 1: Funnel Mode (default)

### Stage-by-stage conversion

Pipeline canonical stages:
```
Sourced → Applied → Screening → Phone → Technical → Onsite → Offer → Accepted → Hired
```

For the period, compute:
- Volume entering each stage
- Volume passing to next stage
- Pass-through rate (= passed / entered)
- Median time in stage

### Output table

```markdown
| Stage transition | N entered | N advanced | Pass rate | Benchmark | Status |
|---|---|---|---|---|---|
| Applied → Phone screen | 150 | 30 | 20% | 10-20% | 🟢 |
| Phone → Technical | 30 | 12 | 40% | 30-50% | 🟢 |
| Technical → Onsite | 12 | 6 | 50% | 40-60% | 🟢 |
| Onsite → Offer | 6 | 2 | 33% | 30-50% | 🟢 |
| Offer → Accepted | 2 | 2 | 100% | 80-90% | 🟢 |
```

### Benchmarks (rough — adjust by domain)

| Stage transition | Healthy range |
|---|---|
| Sourced → Applied (outbound) | 5-15% |
| Applied → Phone screen | 10-25% |
| Phone → Technical | 30-50% |
| Technical → Onsite | 40-60% |
| Onsite → Offer | 25-50% |
| Offer → Accepted | 80-95% |

Outside these ranges → **bottleneck or opportunity**. Diagnose:
- **Lower than range** at applied → phone: bad sourcing quality OR over-strict screening
- **Lower than range** at phone → tech: scorecard not calibrated to JD
- **Lower than range** at onsite → offer: panel calibration drift OR debrief discipline weak
- **Lower than range** at offer → accept: comp mis-calibration OR slow process OR weak close

### Time metrics

For the period:
- Median time-to-fill (req approved → offer accepted)
- Median time-to-hire (applied → accepted)
- Median time-in-stage per stage

### Reason code analysis

Tabulate rejection reason codes for each stage:
```markdown
| Stage | Top 3 reason codes | Volume |
|---|---|---|
| Phone screen | skills-gap (12) | level-mismatch (8) | comp-mismatch (5) |
| Technical | failed-assessment (8) | code-quality-concern (4) | comm-concern (2) |
| Onsite | level-mismatch (4) | judgment-concern (3) | culture-decompose (2) |
```

If "comp-mismatch" is high at phone screen → comp band is wrong vs market. If high at offer → calibration is wrong, not market.

## Phase 2: Interviewer Calibration Mode

For each interviewer in the period:
- Number of interviews conducted
- Score distribution (avg + std deviation)
- Final-decision alignment (% of times their recommendation matched panel decision)
- Score variance vs other interviewers on the same candidates

Identify outliers:
- **Hawk** (consistently low scorer) — risk of false negatives, scaring off hires
- **Dove** (consistently high scorer) — risk of false positives, weak hires through
- **Inconsistent** (high std deviation) — needs calibration training

Recommend: shadow interviews for outliers, debrief facilitation, calibration training.

## Phase 3: Source Mode

For each sourcing channel:
- Candidates entering pipeline
- Candidates reaching phone screen
- Candidates reaching offer
- Hires
- Cost (if known — outbound is recruiter time, paid is direct $)

Output:
```markdown
| Source | Candidates | Hires | Hire rate | Cost/hire | Quality (post-hire) |
|---|---|---|---|---|---|
| Referrals | 12 | 3 | 25% | $0 | High |
| Outbound LinkedIn | 80 | 2 | 2.5% | recruiter hours | Mixed |
| Inbound (careers page) | 60 | 1 | 1.7% | $0 | High |
| Agency | 8 | 1 | 12% | $25k | High |
| ... | | | | | |
```

Decisions:
- **Double down** on top performers
- **Kill or fix** the bottom (if cost > value)
- **Investigate quality drift** if source has high hire rate but low post-hire performance

## Phase 4: Diversity Mode (only with explicit consent)

⚠️ Only run if client has documented:
- Candidate consent for demographic collection
- Demographics stored separately from decision-maker access
- Aggregated reporting only, never individual

For each demographic dimension collected:
- Pipeline composition at each stage
- Stage-by-stage drop-off rates

If drop-off rates differ significantly by demographic at a specific stage → that stage has bias signal. Investigate:
- JD language (entry-funnel bias)
- Screener bias (phone stage bias)
- Interviewer bias (panel stage bias — drill into specific interviewers)

**Do not report individual data, ever.** Only aggregated, only above minimum cohort size (10+).

## Phase 5: Quality of Hire Mode

Cross-reference hires with performance data (from HRIS, 6-12 months post-hire):
- Performance review rating
- Retention (still here at 12m? 24m?)
- Voluntary attrition (did they leave or were they let go?)
- Promotion velocity (above/below cohort norm?)

Compute:
- Correlation between scorecard score and post-hire performance
- Correlation between interviewer's recommendation and post-hire performance (which interviewers' calls predict?)
- Source → quality (which sources produce hires that stick + perform?)

This is the highest-value analysis but the hardest to run. Most agencies don't have HRIS access — but if you do, this is the loop that improves the entire process.

## Phase 6: Insights and Recommendations

Don't just report numbers. For each report:
- **Top 3 insights** — concrete patterns, not platitudes
- **Top 3 recommended actions** — specific, owner-assignable

Examples:
- ❌ "Funnel conversion is healthy." (no signal)
- ✅ "Phone → Tech pass rate dropped from 45% (last quarter) to 28% (this quarter), driven by 12 'level-mismatch' rejections on the SDR role. Hypothesis: JD was rewritten last quarter and over-sells seniority. Action: Recruiter to refresh JD + recalibrate phone screen rubric this week."

## Phase 7: Output

Write to `clients/<cliente>/reports/<mode>-<YYYY-MM-DD>.md`:

```markdown
# Funnel Report — [Cliente] | [Period]

## Executive summary
[3-5 bullets — health snapshot + top issue]

## Volume + conversion
[full funnel table]

## Time metrics
[table]

## Reason code analysis
[table]

## [Mode-specific deep-dive section]

## Top insights
1. [...]
2. [...]
3. [...]

## Recommended actions
| Action | Owner | Due |
|---|---|---|
| [...] | [...] | [date] |

## Notes on data quality
- [Period had N applications — small sample, treat % with grace if <30]
- [Missing reason codes on N records — fix process going forward]
```

Append to `clients/<cliente>/reports/index.md`:
- [Date] — [mode] report — [1-line takeaway] — link

## Anti-patterns to refuse

- Report without reason codes — refuse, ask user to backfill
- Diversity report without explicit consent flag — refuse
- Quality-of-hire without HRIS data — flag, can't be done
- Conversion rate analysis with <10 candidates in funnel — flag as noisy, don't lead decisions
- "Funnel is healthy" with no specifics — push back, force concrete insight
