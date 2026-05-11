---
name: content-calendar
description: >
  Turn a folder of generated assets into a multi-channel publication calendar with
  sequencing logic, owners, and tool-ready handoff (Buffer / Smartlead / Mailchimp).
  Pure reasoning skill. Use after `/execute` has produced assets.
tags: [distribution]
---

# Content Calendar

Bridges asset generation (`/execute`) and actual publishing. Without this, assets sit in folders forever.

## When to use

- After `/execute` — invoked by `/distribute`
- "Schedule these emails / posts for the next 4 weeks"
- "Build me a content calendar that mixes [channels]"

## Inputs

| Input | Path |
|-------|------|
| Campaign brief | `clients/<name>/campaigns/<campaign>.md` |
| Generated assets | `clients/<name>/campaigns/<campaign>-assets/` |
| Tools the client uses | Ask user — don't assume |
| Timezone of primary ICP | Ask user — don't assume UTC |

## Framework

### Step 1 — Inventory

Walk through `<campaign>-assets/` and list every asset. Don't schedule something you didn't inventory.

### Step 2 — Sequencing logic

Order matters. Bad sequencing = familiar copy feels cold; good sequencing = same copy feels warm.

**Sequencing rules:**

| Rule | Why |
|------|-----|
| LinkedIn warmup BEFORE cold email | Recipient checks profile, sees recent post → email feels familiar |
| Pricing post AFTER 3 value posts | Don't lead with sell |
| Case study email AFTER intro email | Cold case study lands flat |
| Founder post BEFORE company announcement | Personal reach > brand reach |
| Webinar promo: 3 weeks out, 1 week out, 2 days out, day-of | One-shot promo dies |

### Step 3 — Cadence per channel

| Channel | Reasonable cadence (seed/SeriesA) | Avoid |
|---------|-----------------------------------|-------|
| Founder LinkedIn | 3-5 posts/week | Daily — burns out fast |
| Company LinkedIn | 2-3 posts/week | Reposting founder verbatim |
| Cold email | 1 sequence (3-4 emails) per ICP segment per quarter | Spamming same person twice |
| Nurture email (SaaS) | Behavioral triggers, not blasts | Weekly newsletter without value |
| Blog | 1-2 posts/week if SEO-led, 1-2/month if authority-led | Daily — quality dies |
| Ads | Run 2-4 weeks, then refresh creatives | Set-and-forget |

### Step 4 — Timing within day

- LinkedIn: Tuesday-Thursday, 8-10am or 12-1pm in ICP's timezone
- X: spread throughout day; engagement window is ~30 min
- Cold email: Tuesday-Thursday, 7-9am ICP timezone
- Newsletter: Tuesday-Thursday, 10am-2pm
- Webinar promo: Tuesday or Wednesday best

Avoid: Friday afternoon, Monday morning, holidays in ICP's region.

### Step 5 — Owner assignment

Every row gets an owner. "Marketing" is not an owner. A name is.

If client doesn't have multiple owners → assign founder to high-leverage assets (LinkedIn, founder emails) and marketing/freelancer to scheduled background (blog, ads).

## Output 1 — Master calendar

The calendar is the source of truth for `/publish` — every row needs a **Status** column so publish can track what's done.

```markdown
# Calendar — <campaign>
Campaign window: <start> → <end>
Timezone: <TZ>

## Week 1

| Date | Time | Channel | Asset | Owner | Status | Notes |
|------|------|---------|-------|-------|--------|-------|
| Mon Mar 3 | 8am | LinkedIn (founder) | post-01.md | Ciro | pending | Warmup before cold email Wed |
| Tue Mar 4 | 9am | Blog | blog-01.md | Marketing | pending | Goes live + LinkedIn share |
| Wed Mar 5 | 7am | Smartlead | emails/01-cold-open.md | SDR | pending | ICP segment A (300 contacts) |
| ... | ... | ... | ... | ... | ... | ... |

## Week 2 ...
```

**Status values** (managed by `/publish`):
- `pending` — not yet published (initial state)
- `published <timestamp>` — went live
- `scheduled <timestamp>` — queued in tool (Buffer, ESP) but not posted yet
- `skipped <reason>` — user chose to skip
- `edited` — user requested changes; back to pending after re-approval

## Output 2 — Sequencing rationale

```markdown
## Why this order

1. **LinkedIn before email** — recipients check profile, see recent activity, email lands warm
2. **Blog before ads** — ads link to blog; blog must be live first
3. **Case study email in week 2** — week 1 builds curiosity; week 2 builds trust
4. **Webinar promo escalates** — t-21, t-7, t-2, t-0 emails
```

## Output 3 — Tool handoff (only if user has the tool)

Ask the user which tools they use. Generate exports only for those:

### Buffer CSV (social)

```csv
date,time,channel,content,media
2026-03-03,08:00,LinkedIn,"<post body>",
2026-03-05,09:00,LinkedIn,"<post body>",
```

### Smartlead CSV (cold email)

```csv
email,firstName,companyName,sequence_step,body
{{email}},{{firstName}},{{companyName}},1,"<email 1 body>"
```

### Mailchimp / generic ESP (nurture)

JSON or instructions for manual setup.

## SaaS vs Service nuances

**SaaS calendar:**
- Heavy on automation (in-product, behavioral triggers)
- Drip cadences > one-shot blasts
- Calendar covers triggers + scheduled, not just scheduled
- Re-engagement campaigns based on usage decline

**Service calendar:**
- Wave-based email outbound (segment list, send wave, wait, send next wave)
- Founder LinkedIn is highest-leverage channel
- Calendar focuses on awareness peaks (webinar, event, launch) + steady drumbeat
- Coordinate founder + SDR posts (don't duplicate angles same week)

## Principles

- **Sequencing > volume.** 1 well-sequenced campaign beats 4 blasted simultaneously.
- **Owner per row.** No "TBD."
- **Timezone of ICP, not your own.** Posting at 3am ICP time = invisible.
- **Tool-ready output.** If client uses Buffer, give them Buffer CSV — not a generic table they'll re-type.

## Don't

- Don't generate calendar without asking which tools they use — wasted CSV exports
- Don't recommend daily posts unless they've shown they can sustain it
- Don't schedule a "promotion" without 2-3 warmup pieces first
- Don't ignore ICP timezone — Brazilian ICP doesn't read US morning posts
