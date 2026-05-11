# ciromaciel-recruiting

Fluxo completo de agência de recrutamento (ATS) — Intake → Sourcing → Screening → Assessment → Interviews → References → Offer → Handoff → Analytics.

Modelado nas 11 fases canônicas de um ATS, com **scorecard antes de candidato** e **mitigação de viés embutida**. Multi-cliente — estado persiste em `clients/<cliente>/jobs/<vaga>/` no repo do projeto.

## Fluxo de fases

```
1. /intake          → requisição + scorecard + JD
2. /source          → boolean queries + target companies + outreach
3. /screen          → CV triagem + phone screen (escala 1-4)
4. /assess          → design ou review de avaliação técnica
5. /interview-kit   → kit por slot (perguntas, rubrica, contexto)
6. /debrief         → consolida painel + decisão estruturada
7. /reference-check → script + record de referências profissionais
8. /offer           → calibragem → verbal → written → negotiation
9. /handoff         → pré-onboarding + HRIS handoff (anti no-show)
10. (skill)         → reject-with-care + talent pool tagging
11. /report         → funnel analytics + interviewer calibration + source
```

## Estrutura de estado (no repo do projeto que usa o plugin)

```
clients/<cliente>/
├── profile.md                       # voice, comp band history, deal-breakers
├── jobs/
│   └── <job-slug>/
│       ├── requisition.md           # Fase 1
│       ├── scorecard.md             # Fase 1.4 — ANTES da JD
│       ├── job-description.md       # Fase 1.5
│       ├── jd-variants/             # linkedin / twitter / referral
│       ├── sourcing-plan.md         # Fase 2
│       ├── target-companies.md
│       ├── assessment-template.md   # Fase 5 — para candidato
│       ├── assessment-rubric.md     # Fase 5 — interno
│       ├── bias-audit.md
│       ├── pipeline.md              # snapshot all candidates
│       ├── reports/
│       │   ├── funnel-2026-05-11.md
│       │   └── index.md
│       └── candidates/
│           └── <candidate-slug>/
│               ├── profile.md
│               ├── application.md   # stage + history + comms log
│               ├── screen.md        # Fase 3+4
│               ├── assessment.md    # Fase 5
│               ├── interviews/
│               │   ├── 01-phone-screen.md
│               │   ├── 02-technical.md
│               │   └── 03-onsite-system-design.md
│               ├── references.md    # Fase 7
│               ├── decision.md      # Fase 6 debrief
│               ├── offer.md         # Fase 8
│               ├── handoff.md       # Fase 9
│               └── comp-research.md
└── talent-pool/
    └── <skill-or-segment>.md
```

## Commands

| Command | Fase | O que faz |
|---|---|---|
| `/intake` | 1 | Intake meeting estruturado → requisition + scorecard + JD |
| `/source` | 2 | Plano de sourcing — boolean queries, target companies, talent pool tap |
| `/screen` | 3+4 | CV triagem (modo `cv`) + phone screen script (modo `phone`) |
| `/assess` | 5 | Design ou review de avaliação técnica (take-home / live / system design) |
| `/interview-kit` | 6 | Gera kit por entrevistador — perguntas, rubrica, contexto, scorecard |
| `/debrief` | 6.b | Consolida scorecards do painel, identifica divergências, decisão |
| `/reference-check` | 7 | Script estruturado de reference call + registro |
| `/offer` | 8 | Calibragem → verbal → written → negotiation playbook |
| `/handoff` | 9 | Pré-onboarding + HRIS handoff (prevent no-show) |
| `/report` | 11 | Funnel analytics, interviewer calibration, source perf, diversity |

## Skills

| Skill | Quando dispara | O que produz |
|---|---|---|
| `scorecard-builder` | Toda nova vaga | Scorecard com 5-8 competências, escala 1-4 observable |
| `job-description-writer` | Após scorecard | JD neutra de gênero, 400-600 palavras, salary transparent |
| `boolean-search-builder` | Sourcing phase | Queries por plataforma (LinkedIn / GitHub / X-ray / community) |
| `interview-question-bank` | Interview kit | Anchor questions + follow-ups + rubric por competência + nível |
| `technical-assessment-designer` | Fase 5 | Take-home / live / system design + rubrica + anti-cheat |
| `offer-package-calibrator` | Fase 8 | Target + max + negotiation playbook tied to comp band |
| `candidate-communication` | Toda transição | Email template per stage (advance / reject / offer / nudge) |
| `funnel-analytics` | `/report` | Conversion rates + benchmarks + bottleneck diagnosis |
| `bias-mitigation-check` | Pré-publicação | Audit JD / scorecard / kits — coded language, requirement bloat |

## Agents

| Agent | Função |
|---|---|
| `candidate-screener` | Triagem de CV contra scorecard com evidência citada |
| `sourcing-researcher` | Pesquisa profunda de empresas-fonte + deep profile (apenas fontes públicas) |
| `interview-question-critic` | Revisa interview kits — qualidade, viés, comparabilidade |
| `comp-researcher` | Benchmarks de comp (Levels.fyi, S-1, Glassdoor) com triangulação |

## Princípios não-negociáveis

1. **Scorecard antes de candidato.** `/intake` exige isso. Sem scorecard, todo o resto é viés retroativo.
2. **Mesma régua para todos.** Anchor questions idênticos por vaga. Comparabilidade > criatividade.
3. **Independência avaliativa.** Scorecards submetidos antes do debrief. Anti-ancoragem.
4. **Reason code em toda rejeição.** Sem isso `/report` é cego.
5. **Bias mitigation embutido.** `bias-mitigation-check` é parte do `/intake`, não opcional.
6. **Salary transparency.** `job-description-writer` força ranges (ou recusa publicar em jurisdição que exige).
7. **Candidato é cliente.** Toda rejeição tem comm humano + específico. Silver medalists vão pro talent pool.
8. **Auditabilidade total.** Todo `application.md` mantém histórico de transições + timestamps.

## Quickstart

```bash
# 1. Abrir uma nova vaga
/intake
# → confirma cliente + slug, conduz intake meeting, produz requisition/scorecard/JD

# 2. Plano de sourcing
/source
# → boolean queries por plataforma, target companies, outreach hooks

# 3. Triagem de CV (por candidato)
/screen
# → modo cv ou phone, score contra scorecard

# 4. Avaliação técnica
/assess
# → design para a vaga (uma vez) ou review por candidato

# 5. Entrevistas
/interview-kit
# → gera kit por entrevistador, opcionalmente revisado por interview-question-critic

# 6. Debrief
/debrief
# → consolida painel, decisão estruturada

# 7. Referências
/reference-check
# → script + record

# 8. Oferta
/offer
# → calibrate → verbal → written → final

# 9. Handoff
/handoff
# → pré-onboarding checklist + HRIS

# 11. Relatório
/report
# → funnel analytics, modo funnel / source / calibration / quality
```

## Plugin compatível

Funciona bem em conjunto com:
- **`ciromaciel-knowledge`** — knowledge base do recruiter (templates, playbooks, comp data histórica)
- **`ciromaciel-marketing`** — para co-marketing recruiting (LinkedIn content sobre vagas, employer branding)

## Status

`v0.1.0` — fluxo completo das 11 fases, escopo de agência multi-cliente. Próximas iterações:
- Integração com ATS reais (Greenhouse / Lever / Gupy / Sólides) via export/import
- Templates específicos por indústria (tech / fintech / serviços)
- Loop de quality-of-hire com HRIS data
