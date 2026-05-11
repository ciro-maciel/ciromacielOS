---
name: metrics-framework
description: >
  Two-mode skill — (A) define KPIs and tracking plan BEFORE a campaign launches, or
  (B) run a structured retrospective AFTER the campaign ends. Mode A produces
  metrics.md; mode B produces retro.md with decisions (double / kill / pivot per channel).
tags: [measurement]
---

# Metrics Framework

The skill that closes the loop. Defining metrics after the campaign is hoping for luck; running a retro without decisions is theater.

## Two modes — pick one explicitly

### Mode A — Pre-campaign (define KPIs)

Run BEFORE the campaign starts. Output: `clients/<name>/campaigns/<campaign>-metrics.md`.

### Mode B — Post-campaign (retrospective)

Run AFTER the campaign ends. Output: `clients/<name>/campaigns/<campaign>-retro.md`.

If the user is ambiguous, ask which mode. Don't guess.

## Companion skills

This skill defines the STRATEGY of measurement (north star, floor, decision gates). For platform-specific detail, use:

- **`platform-analytics`** — what to measure on TikTok / IG / Meta Ads / YouTube / Google Ads / LinkedIn Ads. Benchmarks per platform, vanity vs actionable.
- **`tracking-setup`** — UTM convention, Meta Pixel + CAPI, GA4 conversions, CRM source field. Setup checklist BEFORE running campaigns.

For recurring weekly/monthly cross-platform reports, use the `/report` command — different from this skill's mode B (single retro at campaign end).

---

## Mode A — Define KPIs

### Step 1 — Establish funnel stages

Every campaign has a funnel. Force the user to identify stages.

| Stage | What it measures | Examples |
|-------|------------------|----------|
| **TOFU (top)** | Awareness, reach | Impressions, visits, post views |
| **MOFU (middle)** | Consideration, engagement | Email opens, signups, demo requests |
| **BOFU (bottom)** | Conversion, revenue | Trial-to-paid, contracts signed, MRR |
| **Retention** (SaaS only) | Stickiness | Activation, weekly active, churn |

### Step 2 — North star metric

ONE metric for the campaign. If user lists 5, force the pick.

The north star must:
- Be measurable with tools they actually have
- Match the campaign goal in the brief
- Tie to revenue within 1-2 layers (vanity metrics fail this test)

### Step 3 — KPIs per stage

For each funnel stage, write KPIs **per platform** (not abstract). Use the `platform-analytics` skill to know what to track and what's a reasonable benchmark per platform.

```markdown
### TOFU

| Platform | Metric | Target | Floor (campaign fails below) | Source |
|----------|--------|--------|------------------------------|--------|
| LinkedIn (founder) | Impressions | 50,000 | 20,000 | LinkedIn Analytics |
| TikTok | Completion rate (avg) | >50% | 35% | TikTok Studio |
| Meta Ads | Hook rate (3s) | >25% | 15% | Ads Manager |
| YouTube | CTR | 5% | 3% | YouTube Studio |
| Cold email | Open rate | 35% | 20% | Smartlead |
```

**Always include a "floor"** — the number below which the campaign is considered to have failed on this dimension. Without a floor, retros become "well, we got SOMETHING."

**Don't use the same metric for every platform.** YouTube's CTR ≠ LinkedIn's CTR ≠ Meta's CTR. Each has its own scale. Use platform-analytics for the right metric per platform.

### Step 4 — Tracking plan

Before campaign starts, what must be instrumented? **Delegate to the `tracking-setup` skill for the full checklist** (6 layers — UTM, GA4, Pixel+CAPI, Google Ads conv, CRM, dashboard).

Minimum reference here:

```markdown
## Tracking plan (resumido — full check em tracking-setup)

- [ ] UTM template do cliente atualizado e seguido em todos os links
- [ ] GA4 com conversions marcadas e conversion value real (não "1")
- [ ] Meta Pixel + CAPI ativos (EMQ > 7)
- [ ] Google Ads importando conversions do GA4 + Enhanced Conversions
- [ ] CRM populando source/medium/campaign automaticamente
- [ ] Looker Studio (ou equivalente) com acesso pros stakeholders
- [ ] Weekly review agendado
```

Se algum item não vai dar pra fazer pra esta campanha, documente em `tracking-gaps.md` — não finja que está medido.

### Step 5 — Reporting cadence

```markdown
## Reporting

- **Daily (during launch week):** Quick scan, no formal report
- **Weekly:** Email to stakeholders with 5-row dashboard
- **Mid-campaign review (week 2 or week 4):** Decision point — continue / adjust / kill
- **Post-campaign retro:** 1 week after campaign ends
```

### Mode A output template

```markdown
# Metrics Plan — <campaign>
Created: <YYYY-MM-DD>

## North Star
**<metric>** — Target: <number>. Why: <rationale tied to goal>.

## Funnel KPIs

### TOFU
[table]

### MOFU
[table]

### BOFU
[table]

### Retention (SaaS)
[table — skip if service]

## Tracking plan
[checklist]

## Reporting cadence
[schedule]

## Decision gates
- **Week 2 review:** If TOFU below floor → adjust creative. If MOFU below floor → adjust targeting.
- **Mid-campaign:** If north star tracking <50% of target → kill OR pivot, don't continue blindly.
```

---

## Mode B — Retrospective

### Step 1 — Gather actuals

Ask user where the data lives. Read it or take it pasted.

For each KPI defined in Mode A's metrics.md:
- Actual number
- vs target (% achieved)
- vs floor (above? below?)

### Step 2 — The 3×3 framework

Force the user to identify three of each:

```markdown
## 3 Wins
1. [outcome] — why it worked: [...]
2. ...
3. ...

## 3 Fails
1. [outcome] — why it failed: [...]
2. ...
3. ...

## 3 Surprises (didn't expect)
1. [...]
2. ...
3. ...
```

Surprises are the most valuable category. They reveal assumptions you didn't know you had.

### Step 3 — Per-channel decision

For every channel used, force a decision:

| Channel | Result | Decision | Why |
|---------|--------|----------|-----|
| LinkedIn (founder) | 50k impressions, 200 leads | **DOUBLE** | Highest lead quality + lowest cost |
| Cold email | 15% open, 1% reply | **KILL** | Open rate below floor, deliverability suspect |
| LinkedIn ads | 5k clicks, 20 leads | **PIVOT** | Audience too broad — narrow to 2 titles |

"Continue same" is not an option. Every channel goes through double / kill / pivot.

### Step 4 — Aprendizados → próxima campanha

```markdown
## Inputs for next campaign

- **Keep doing:** [tactic that worked]
- **Stop doing:** [tactic that didn't]
- **Try next:** [new hypothesis from a surprise]
- **Strategy update needed?** [if YES, what changes in strategy.md]
```

### Mode B output template

```markdown
# Retrospective — <campaign>
Campaign window: <start> → <end>
Retro date: <YYYY-MM-DD>

## North Star result
**<metric>:** <actual> vs target <target> (<%>). Floor: <met / missed>.

## Funnel actuals
[same tables as Mode A, with actuals filled in]

## 3 Wins / 3 Fails / 3 Surprises
[as above]

## Per-channel decisions
[table — double / kill / pivot]

## Inputs for next campaign
[list]

## Strategy update needed?
[yes/no — if yes, what]
```

## Diferenciação SaaS vs Service

**SaaS:**
- Always include retention layer (activation, churn)
- Trial-to-paid is the canonical BOFU metric
- Watch for vanity: signups are MOFU not BOFU
- Cohort analysis: track cohorts from same source over time

**Service:**
- BOFU = proposals sent, contracts signed
- Sales cycle length matters as much as quantity (longer cycle = lower throughput)
- Lead quality > lead quantity — track MQL → SQL conversion
- Retention = repeat engagement, referrals from past clients

## Principles

- **Floor before celebration.** Define what "failed" looks like before the campaign starts.
- **One north star.** If you have 5, you have none.
- **Decisions, not summaries.** Retro without "what changes" = wasted hour.
- **Surprises > wins.** Wins confirm strategy; surprises update it.

## Don't

- Don't run a retro without comparing actuals to pre-defined targets — turns into vibes
- Don't allow "we'll keep going" as a channel decision — force double/kill/pivot
- Don't track 15 KPIs — track 5-7 that map to the funnel
- Don't skip mode A and try to define metrics retroactively in mode B — incentivizes lying to yourself
