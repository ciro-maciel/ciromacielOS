---
name: interview-question-bank
description: >
  Select structured interview questions matched to competency, role, and level.
  Behavioral (STAR-evoking), technical deep-dive, system design, cross-functional.
  Each question comes with follow-ups, rubric anchors, and traps to avoid.
tags: [recruiting, ats, interviews]
---

# Interview Question Bank

Pure reasoning skill. Given a competency to evaluate + role + level, returns a small set of high-signal questions with structured follow-ups and rubric calibration.

**Built for:** Recruiters preparing interview kits. Output goes into `interviews/<NN>-<type>.md` for an interviewer to use literally.

## When to Use

- Inside `/interview-kit` command for each interview slot
- "Give me good behavioral questions for a senior PM"
- "What should we ask about system design for a staff engineer?"

## Principles

1. **Behavioral over hypothetical** — "Tell me about a time when..." beats "What would you do if..." Hypotheticals reward articulate bullshitters; behavioral forces evidence.
2. **Few questions, deep follow-ups** — 1-2 anchor questions per 45min slot, with 5-8 follow-ups planned. Better than 6 surface-level questions.
3. **Same anchors across candidates** — comparability requires identical anchors. Follow-ups can vary based on candidate's answer.
4. **Probe for negative space** — "What didn't work?", "What would you do differently?" — reveals self-awareness and learning capacity.

## Competency → Question Mapping

### Communication

**Anchor:** "Walk me through a complex technical decision you had to explain to a non-technical stakeholder. What was the context, how did you frame it, and what was the outcome?"

Follow-ups:
- What were they confused about initially?
- How did you know they understood?
- Did the decision change based on the conversation?
- What would you do differently if you had to do it again?

Rubric anchors:
- 4: Adapts framing in real-time, captures decision quality and tradeoffs simply, names specific outcome
- 3: Explains clearly post-hoc, but framing was planned not adaptive
- 2: Lists facts of decision, struggles to translate jargon
- 1: Cannot separate technical detail from business impact

Traps to avoid:
- Reward conciseness, not articulateness — fast talkers ≠ clear thinkers
- Watch for "I" vs "we" — overuse of "we" hides individual contribution

### System Design (senior+ technical)

**Anchor (open-ended):** "Design [system relevant to the company's domain]. Walk me through your approach."

Examples by domain:
- B2B SaaS: multi-tenant rate limiter, audit log system, billing engine
- Consumer: feed ranking, notification system, real-time chat
- Fintech: idempotent payment processor, ledger
- ML: feature store, model serving with A/B framework

Follow-ups (probe pressure points):
- "What happens at 10x traffic? 100x?"
- "What's the single point of failure? How do you mitigate?"
- "What would you simplify if you had less time?" (forces trade-off awareness)
- "How would you observe this in production?"
- "How would you migrate from this to v2 if requirements changed?"

Rubric anchors:
- 4: Drives discussion, asks clarifying questions before designing, makes explicit trade-offs, considers failure + observability + evolution
- 3: Solid design, but reactive — answers when asked, doesn't surface trade-offs unprompted
- 2: Component-level thinking only; struggles to scale up; misses failure modes
- 1: Recites known patterns without judgment about fit

### Code Quality (technical IC roles)

**Anchor:** "Tell me about a piece of code you wrote that you're proud of. Why?"

Follow-ups:
- What made the requirements tricky?
- What did the first version look like? What changed?
- What did you test, and what did you choose not to test?
- If I read this code in 2 years, what should I know?

Pair with: code review of a real PR (15min) — give them a real PR diff, ask what they'd flag.

Rubric:
- 4: Names abstractions and trade-offs, discusses readability vs performance vs flexibility, knows what they chose NOT to do
- 3: Describes the code well but trade-offs are implicit
- 2: Describes feature, not code; pride is in shipping, not craft
- 1: Can't articulate what makes the code good vs functional

### Problem Decomposition

**Anchor:** "Tell me about the hardest technical problem you've solved in the last year."

Follow-ups (key probes):
- What did you understand first, and what was unclear?
- How did you decide what to try first?
- When did you know you were on the right track?
- What did you eliminate as not-the-problem?

Looking for:
- 4: Sequenced investigation, isolated variables, knew when to stop and seek help
- 3: Solved it, but path was linear and didn't pause to validate hypotheses
- 2: Brute-forced through, no explicit strategy
- 1: Got handed the answer or never solved it

### Ownership / Initiative (mid+)

**Anchor:** "Tell me about a time you took on something that wasn't in your job description."

Follow-ups:
- How did you decide it was worth your time?
- Who else was involved? Did you ask permission?
- What was the outcome?
- What did you NOT do that you could have?

Looking for:
- 4: Saw gap, validated importance, drove without being told, knew when to stop
- 3: Took initiative when asked; good execution
- 2: Reactive — did extra work when prompted
- 1: Stays strictly in lane

### Hiring / People Judgment (manager+)

**Anchor:** "Tell me about the best hire you've made and the worst."

Follow-ups (best):
- What did you see in them that others might have missed?
- What was their first 90 days like?

Follow-ups (worst):
- When did you know it wasn't working?
- What did you do?
- What would you screen for differently?

Looking for self-awareness + concrete actions + learning loops.

### Conflict / Disagreement

**Anchor:** "Tell me about a time you disagreed strongly with a peer or manager. What happened?"

Follow-ups:
- What was their argument? (test: can they steelman it?)
- How did you raise it?
- What was the outcome?
- Was the outcome correct in hindsight?

Rubric:
- 4: Steelmans opposing view, raises directly + respectfully, evidence-based, accepts being wrong
- 3: Raises constructively but argues from authority not evidence
- 2: Avoids conflict OR escalates without prior 1:1
- 1: Bulldozes / capitulates / goes around

### Product Judgment (PM / design / staff+ eng)

**Anchor:** "Tell me about a feature you killed, or a feature you decided NOT to build."

Why this one: building is the default; killing requires judgment. Inverse of "tell me about something you shipped".

Follow-ups:
- What was the case FOR it?
- What evidence did you weigh?
- Who pushed back, and how did you handle it?
- What did you learn from the decision in retrospect?

### Coachability / Growth (junior + mid)

**Anchor:** "Tell me about feedback you've received recently that surprised you."

Follow-ups:
- What did you do with it?
- Do you still agree with the feedback?
- What feedback have you given recently that was hard to deliver?

## Cross-Functional / Sales / GTM Adaptations

For sales / CS / marketing roles, replace technical anchors with role-specific ones:

**Sales — discovery skill**
- "Walk me through a deal you lost. When could you have qualified it out earlier?"
- "Tell me about a deal you won that initially looked bad. What changed?"

**CS — escalation handling**
- "Tell me about an angry customer call. How did you de-escalate?"

**Marketing — channel judgment**
- "Tell me about a channel you killed. What were the signals?"
- "Tell me about a campaign that flopped. What did you learn?"

## Anti-Questions (refuse to suggest)

- "What's your greatest weakness?" — gameable, low signal
- "Where do you see yourself in 5 years?" — irrelevant in fast-moving roles
- "Why should we hire you?" — sales-pitch theater, no signal
- Brainteasers ("how many golf balls fit in a 747") — researched to be useless predictors
- "Tell me about yourself" beyond first 2 minutes of rapport — not an interview question

## Output Format

For each requested competency, output:

```markdown
### [Competency name]

**Anchor question:**
> [question text]

**Why this question:** [1 sentence on what it surfaces]

**Planned follow-ups (5-8):**
1. [...]
2. [...]
...

**Rubric anchors:**
- 4 - Strong Yes: [observable]
- 3 - Yes: [...]
- 2 - No: [...]
- 1 - Strong No: [...]

**Traps for the interviewer:**
- [bias to watch]
- [signal to NOT over-weight]

**Time budget:** [N min for question + follow-ups]
```

## Quality bar

- Every question has explicit follow-ups planned (no winging it)
- Every rubric anchor is observable, not adjectival
- No question without a "why this surfaces X" justification
- Traps section flags common interviewer biases
