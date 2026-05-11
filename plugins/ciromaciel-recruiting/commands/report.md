---
description: Fase 11 — Funnel analytics. Métricas, conversion rates, time-to-fill, diversity, quality of hire.
---

Você foi invocado pelo comando `/report`. Fase 11: medir o funil e identificar gargalos.

Confirme escopo:
1. Cliente (slug) — ou `all` para report cross-cliente
2. Período: `7d` / `30d` / `quarter` / `ytd` / custom date range
3. Modo:
   - `funnel` — análise de conversion por etapa (default)
   - `vacancy` — deep-dive numa vaga específica
   - `interviewer-calibration` — variância de scores entre entrevistadores
   - `source` — performance por canal de sourcing
   - `diversity` — pipeline demographics (se cliente coleta + consente)
   - `quality` — quality of hire baseado em performance review 6-12m (requer HRIS data)

Execute skill `funnel-analytics`.

## Inputs

Leia os `pipeline.md` e `application.md` no escopo. Agregue eventos:
- Application created
- Stage transitions com timestamps
- Decisions com reason codes
- Hires

## Output em `clients/<cliente>/reports/<modo>-<date>.md`

### Modo `funnel`

```markdown
# Funnel Report — [Cliente] | [Período]

## Volume top-level
- Applications: N
- Phone screens: N (pass-through X%)
- Technical: N (pass-through Y%)
- Onsite: N (pass-through Z%)
- Offers extended: N
- Offers accepted: N
- Hires: N

## Conversion rates por etapa
[table com benchmark]

| Etapa → Etapa | Rate | Benchmark | Status |
|---|---|---|---|
| App → Phone | X% | 10-20% | 🟢/🟡/🔴 |
| Phone → Tech | Y% | 30-50% | |
| Tech → Onsite | Z% | 40-60% | |
| Onsite → Offer | W% | 30-50% | |
| Offer → Accept | V% | 80-90% | |

## Time metrics
- Time-to-fill (médio): X dias
- Time-to-hire (app → accept): Y dias
- Time-in-stage por etapa

## Top reason codes de rejeição
[tabela] — sinaliza onde o funil está enviesado

## Insights e ações
- Gargalos identificados
- Recommendations
```

### Modo `interviewer-calibration`

Compute variância de scores por entrevistador vs média do painel. Identifique outliers (>1 std deviation consistente). Recommend recalibração via shadow interviews.

### Modo `source`

Volume + quality + cost por canal. Ranking de sources por hire / por candidato qualificado. Identifique canais a dobrar e a matar.

### Modo `diversity`

⚠️ Só rode se cliente coletou explicitamente com consentimento. Compute representation por etapa do funil. Drop-off enviesado em qualquer etapa = bias signal a investigar.

### Modo `quality`

Cross-reference hires com performance review data (do HRIS). Compute correlation de score de scorecard × performance pós-hire. Loop de feedback pro processo.

## Princípios

- Toda métrica tem benchmark contextual — número solto não diz nada
- Funnel sem reason codes = analytics cego — recuse rodar se faltar
- Volume baixo (<20 apps por vaga) torna conversion rates ruidosos — sinalize

Atualize `clients/<cliente>/reports/index.md` com link pro report gerado.
