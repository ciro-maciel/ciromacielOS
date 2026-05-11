---
name: boolean-search-builder
description: >
  Build Boolean search queries for LinkedIn Recruiter, GitHub, X-ray (Google site:),
  and community channels to source candidates matching a scorecard.
  Outputs copy-paste ready queries with operator syntax per platform.
tags: [recruiting, ats, sourcing]
---

# Boolean Search Builder

Pure reasoning skill. Generates sourcing queries tailored per platform. Each platform has different operator syntax — this skill knows them.

**Built for:** Sourcer or recruiter who needs to find qualified candidates quickly without spray-and-pray.

## When to Use

- After scorecard exists and `/source` command is running
- "Help me find [role] on LinkedIn"
- "Build me a GitHub search for [stack] engineers"

## Phase 0: Inputs

Read:
1. `clients/<cliente>/jobs/<job-slug>/scorecard.md` (must-haves drive query terms)
2. `job-description.md` (for stack and seniority cues)

Confirm with user:
- Primary platform (LinkedIn, GitHub, X-ray, community)
- Geo target (specific city / country / remote-OK)
- Volume goal (rough number of qualified candidates needed)

## Phase 1: Query Strategy by Platform

### LinkedIn Recruiter / LinkedIn Sales Nav

Operators: `AND`, `OR`, `NOT`, parentheses, quotes for phrases.

```
("Senior Software Engineer" OR "Staff Engineer" OR "Senior Backend Engineer")
AND ("Go" OR "Golang" OR "Rust")
AND ("distributed systems" OR "high scale" OR "microservices")
NOT ("intern" OR "junior" OR "manager")
```

Tips:
- Title field: focus operators here, not "anywhere"
- Skills field: use for tech stack
- Years of experience: 3+ for mid, 5+ for senior, 8+ for staff
- Current company: target companies from sourcing plan
- Past company: for "ex-Google" / "ex-Stripe" patterns

### GitHub (for technical roles)

GitHub search via `https://github.com/search`:
```
language:Go location:"São Paulo" followers:>50
language:Rust stars:>100 in:bio "engineer"
```

Useful filters:
- `language:` (primary language)
- `location:` (best-effort, many profiles incomplete)
- `followers:>N` (signal of community presence)
- `repos:>N` (active developer)
- `stars:>N` on owned repos (built things people care about)

Signal beyond keywords:
- Recent activity (commits in last 6 months)
- Quality of README in pinned repos
- Open-source contributions to relevant projects (PRs to Kubernetes / Postgres / etc.)
- Personal site / blog linked

### X-ray Search (Google site: operators)

For when LinkedIn search limit is hit, or for non-LI profiles:
```
site:linkedin.com/in "Senior Engineer" "Brazil" ("Go" OR "Rust") -intern
site:github.com/* "engineer" "São Paulo"
site:stackoverflow.com/users "Go" reputation:>1000
```

### Communities

Map common channels per role:
| Role | Communities |
|---|---|
| Backend (Go/Rust) | Gopher Slack, Rust Discord, r/golang, r/rust |
| Frontend (React) | React Discord, dev.to, r/reactjs |
| Data / ML | Kaggle, Hugging Face Discord, MLOps Community |
| DevRel | DevRel Collective Slack |
| Designers | Designer Hangout, Dribbble, Layers |
| PMs | Lenny's community, Mind the Product, Reforge alumni |
| Sales | RevGenius, Pavilion, Sales Hacker |

For each community, suggest:
- Search strategy within the community (member search, recent posts, etc.)
- Approach style (DM cold = bad in most communities — engage in public first)

## Phase 2: Negative Filters (the underrated half)

Every Boolean search needs `NOT` clauses to cut noise:
- `NOT (intern OR junior OR student)` for senior roles
- `NOT (founder OR CEO)` if targeting ICs
- `NOT (recruiter OR sourcer)` always (otherwise inbox is half-recruiter)
- Specific competitor companies if poaching restrictions apply

## Phase 3: Iteration Plan

Sourcing queries are not one-shot. Plan:
- **Iteration 1:** Tight query (high precision, low volume) — start with must-haves only
- **Iteration 2:** Loosen one constraint (e.g., drop one nice-to-have) — see volume jump
- **Iteration 3:** Adjacent skills (e.g., Rust → C++ if Rust pool too small)

Track which iteration produced which candidates in `sourcing-plan.md`.

## Phase 4: Outreach Hook Hint

For each query bucket, suggest the first-message hook angle:
- "Saw your work on [specific repo/project]" — for GitHub-sourced
- "Your post on [topic] resonated" — for content creators
- "Noticed you're at [company], [specific context]" — for company-targeted
- Generic "we have an exciting opportunity" — refuse. Bad outreach is worse than no outreach.

## Phase 5: Output

Append to `clients/<cliente>/jobs/<job-slug>/sourcing-plan.md`:

```markdown
## Boolean queries

### LinkedIn — primary
[query]
**Estimated volume:** N profiles
**Filters to apply:** [years exp, geo, current company]

### LinkedIn — adjacent
[loosened query]

### GitHub
[query]

### X-ray fallback
[query]

### Communities
- [Community name]: [search strategy] | [first message angle]

## Iteration plan
1. Start with: [tightest query]
2. If <20 results in 24h, loosen: [...]
3. If still thin: [adjacent stack / role]

## Outreach hooks per source
- LinkedIn: [hook]
- GitHub: [hook]
- Community: [hook]
```

## Anti-patterns to refuse

- Query without scorecard reference — refuse, build scorecard first
- Spray-style query ("anyone who lists Python") — push back, force precision
- No negative filters — flag, queries without `NOT` = noise
- Same query for all platforms — refuse, each platform needs its operator
- Outreach hook = "we have a great opportunity" — refuse, force specificity
