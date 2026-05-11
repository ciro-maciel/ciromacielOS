---
name: candidate-communication
description: >
  Generate candidate-facing email and message templates for every stage: invite, advance,
  schedule, reject, offer, follow-up. Tone is human, specific, and reflects the client brand.
  Never generic. Captures reason codes for analytics.
tags: [recruiting, ats, communication]
---

# Candidate Communication

Pure reasoning skill. Produces stage-specific candidate emails that reflect the client's voice and treat candidates as future employees, customers, or referral sources — not as throughput.

**Built for:** Recruiters who need fast, high-quality candidate comms without sending soulless templates.

## When to Use

- Inside any command that involves communicating with a candidate
- Direct ask: "Draft an email to [candidate] saying [X]"
- Stage transition where comms is needed

## Phase 0: Read Context

For every email:
1. Stage transition (from → to)
2. Candidate profile (`candidates/<slug>/profile.md`) — at minimum, what stood out about them
3. Client brand tone (`clients/<cliente>/profile.md` if exists)
4. Relevant artifacts (e.g., for offer comms, read `offer.md`)

## Phase 1: Universal Principles

- **Specific over generic.** Mention something specific to this candidate every time. "We were impressed by your work on X" is the minimum bar.
- **Short.** Long candidate emails get skimmed. 4-8 sentences usually max.
- **One ask per email.** Don't pile up actions.
- **Human signature.** From a named person, not "Recruiting Team" or "noreply@".
- **Realistic timelines.** If you say "we'll be back in 2 days", be back in 2 days. Otherwise leave it open and update when you have news.
- **Reason codes captured separately.** Public-facing rejection comms don't expose internal reason codes — but the internal record always has one.

## Phase 2: Template Library

### A. Application acknowledgment (auto-send, OK to be light-template)

Subject: We received your application — [Role] at [Client]

```
Hi [First name],

Thanks for applying to the [Role] role at [Client]. We've received your
application and will be in touch within [N business days] with next steps,
whether or not we move forward.

A bit about the process: [1-2 sentences: stages and rough timeline].

If anything changes on your side (you accept another role, your timeline
shifts), let us know — we'd rather know than lose track of you.

— [Recruiter name]
```

### B. Outbound sourcing (cold)

Subject: [Specific hook — NOT "Opportunity at X"]

```
Hi [First name],

I came across your [specific thing — repo, post, role, talk]. The [specific
detail — what you noticed about it] caught my eye.

I'm working with [Client], a [1-sentence description with traction signal —
"Series B fintech serving 500K SMBs", not "innovative startup"]. They're
hiring a [Role] who would [specific outcome — "own the rewrite of their
billing engine", not "join a growing team"].

A few specifics in case it's worth a conversation:
- [Compensation range OR concrete signal]
- [Stack OR scope]
- [Remote / location]

Worth a 15-min chat? If timing isn't right but you know someone better
suited, I'd appreciate the pointer.

— [Recruiter name]
```

### C. Advance to next stage

Subject: Next step — [Stage] at [Client]

```
Hi [First name],

Good news — we'd like to move you to the next step, which is [stage
description in 1 line]. Here's what to expect:

- Format: [interview type, length]
- Who: [interviewer name + role]
- Focus: [1 sentence on what this stage probes]
- Schedule: [either link, or "I'll send slots in the next email"]

[If take-home or prep needed: instructions or attached]

Let me know if any of this feels off, or if you have questions about how
to prepare.

— [Recruiter name]
```

### D. Schedule confirmation

```
Hi [First name],

Confirmed for [date/time] [timezone]. Calendar invite coming separately
with the [Zoom/Meet/Teams] link.

[Specific prep note if useful — "the engineer you're meeting works
primarily on [system X]; feel free to ask about that"]

— [Recruiter]
```

### E. Reject — after CV / phone screen

Public message (kept short, kind, useful):

```
Hi [First name],

Thanks for taking the time to apply / chat about the [Role] role at
[Client]. After review, we're not going to move forward with your
application at this time.

[ONE specific reason that's actionable AND not legally risky — "we
chose to prioritize candidates with deeper experience in [specific
domain]", not vague "wasn't a fit"]

I appreciate your time. If [Client] opens roles that look closer to
your background in the future, I'll reach out.

— [Recruiter name]
```

Internal record (separate, in `candidates/<slug>/application.md`):
- Reason code: [skills-gap / level-mismatch / no-show / failed-knockout / other]
- Notes: [internal-only specifics]
- Talent pool? [yes if strong candidate just not fit for THIS role]

### F. Reject — after onsite (the hard one)

This one matters most. Silver medalists become future hires or detractors.

```
Hi [First name],

Thanks for the time you invested with us — the [N] conversations, the
[take-home / case study], all of it. The team genuinely enjoyed meeting you.

After the debrief, we decided to move forward with another candidate.
The deciding factor was [specific, defensible reason — "we ended up
prioritizing depth in [specific area] which was where another candidate
had more recent hands-on experience"].

This is not a "no forever" — it's a "not for this specific role." You'd
be a strong candidate for [related future role / different team /
different level] and I'd genuinely like to stay in touch.

If you have any questions about the decision or the process, happy to
get on a call.

— [Recruiter name]
```

### G. Verbal offer follow-up

```
Hi [First name],

Following our call — putting the offer in writing:

[Pacote completo no formato pré-aprovado]

Formal offer letter coming via [DocuSign / etc.] today. You have until
[date — 5-7 business days out] to respond. Take the time you need —
if you want to talk through anything (the role, the team, the package),
my line is open.

Excited about the possibility.

— [Recruiter name]
```

### H. Offer follow-up if silent

Day 3 of silence: brief check-in. Day 5: more direct. Day 7: deadline reminder + offer to extend if needed (usually yes, within reason).

### I. Counter-offer from current employer (preventive)

If you sense a candidate is wavering pre-acceptance:

```
Hi [First name],

Wanted to circle back. Sometimes when people give notice, their current
employer comes back with a counter. If that happens, I'd want you to
know two things:

One: statistically, ~80% of people who accept counter-offers leave within
12 months anyway. The reason they were looking is rarely solved by money.

Two: whatever your current employer offers, we want you to make the
decision you'd make if money were equal. If you'd choose us, money isn't
the reason — it's the work, the team, the trajectory. If money tips you
back, the deeper reasons probably haven't been addressed.

If you want to talk it through, I'm here.

— [Recruiter name]
```

### J. Reference check request

```
Hi [First name],

For the reference check stage, could you share contacts for [N]
references? Ideally [1 ex-manager + 1 peer + 1 report if applicable].

For each: name, role, company at the time you worked together, and
whether email or phone is better.

I'll reach out directly. They won't be contacted without your knowledge,
and I'll let you know once they're done.

— [Recruiter]
```

### K. Welcome — post-offer, pre-start

Sent T-14 days before start date:

```
Hi [First name],

Two weeks until your start! A few things to make week 1 go smoothly:

[Concrete items: where to be / login first / what to bring / who picks you up]

Your manager [Name] will send a personal note this week too.

Anything we should know that's changed on your side? Anything you're
curious about that we can answer now rather than day 1?

Looking forward to having you.

— [Recruiter name]
```

## Phase 3: Tone Calibration

Read `clients/<cliente>/profile.md` for voice signals. Common axes:

- **Formal ↔ casual** (financial services formal, devtools casual)
- **Warm ↔ direct** (some brands are explicitly direct, no warmth ramp)
- **Long-form ↔ terse** (executive search vs PLG)

If no profile exists, default: warm + direct + concise.

## Phase 4: Anti-Patterns to Refuse

- "Dear Candidate" — refuse, use first name
- "We've decided to pursue other candidates whose qualifications more closely match" — refuse, gives no signal, generic
- "Best of luck in your future endeavors" — cliché, drop
- Emojis in formal comms unless brand calls for it
- Multi-paragraph rejection essays — refuse, hurts more than helps
- "We may keep your CV on file" — only say this if you actually will
- Auto-send rejections with the candidate's name spelled wrong — always verify name spelling, especially diacritics

## Phase 5: Compliance Notes

- GDPR / LGPD: rejection emails should reference how long their data is retained and how to request deletion. Often embedded in a link to a privacy policy.
- US adverse-action: if rejecting based on background check, follow adverse-action procedure (pre-adverse notice, copy of report, time to dispute, then final adverse).
- Pay transparency jurisdictions: if you didn't include range in JD, include in advance-to-onsite email.

## Output

When generating an email, ALWAYS produce two outputs:

1. **Email draft** ready to send (with placeholders clearly bracketed)
2. **Internal record update** for `candidates/<slug>/application.md`:
   ```
   ## Communication
   - [date]: Sent [stage] email — [1 line summary]
   - Reason code (if rejection): [code]
   ```
