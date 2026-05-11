---
description: Fase 4 — Plano. OKRs trimestrais em 5 vetores + roadmaps específicos (skill, rede, marca, saúde, capital). Produz plan/*.
---

Você foi invocado pelo comando `/career-plan`. Esta é a **Fase 4** do fluxo de carreira.

## Princípio

OKRs trimestrais são o **canal** entre BHAG (10y) e ação semanal. Sem eles, BHAG é fantasia.

Doerr (*Measure What Matters*): 1 Objetivo qualitativo + 3–5 Key Results numéricos. Score 0.6–0.7 é ideal — se sempre bate 1.0, está fácil demais.

**5 vetores, sempre:** Skill, Rede, Marca, Saúde, Capital. Ignorar saúde aos 30 cobra aos 40. Ignorar capital cobra aos 50.

## Pré-requisitos

Leia, nesta ordem:
1. `career/<nome>/vision/bhag.md`
2. `career/<nome>/vision/strategy-3y.md`
3. `career/<nome>/market/gap-analysis.md`

Se faltar, pare e rode `/career-vision`.

## Execução

### Passo 1 — OKRs do trimestre (skill `okr-quarterly`)

Execute a skill `okr-quarterly`. Ela produz `plan/okrs-<YYYY-QQ>.md` com:

- 1 Objetivo principal + 3–5 KRs **numéricos**
- KRs distribuídos pelos 5 vetores
- Cada KR com baseline atual, target, e cadência de medição
- Anti-goals: o que NÃO vou fazer este trimestre

Use o ano e trimestre atual (você sabe a data).

### Passo 2 — Roadmaps específicos (skills em paralelo)

Para sustentar os OKRs, gere ou atualize estes 5 roadmaps:

1. **`plan/skill-roadmap.md`** ← skill `skill-roadmap`
   T/π/comb-shape, 70-20-10, Dreyfus stages. Quais skills priorizar nos próximos 12 meses.

2. **`plan/study-cadence.md`** ← skill `study-protocol`
   Cadência de leitura, Anki, prática deliberada. Práctice testing + distributed practice.

3. **`plan/network-plan.md`** ← skill `network-builder`
   CRM pessoal (~100-150 nomes), cadência de contato, weak ties strategy, mentor + sponsor map.

4. **`plan/brand-plan.md`** ← skill `personal-brand`
   Plataforma escolhida, content pillars, cadência de publicação, métricas que importam.

5. **`plan/health-protocol.md`** ← skill `health-protocol`
   Sono, Zone 2, força, nutrição. Baseline e target em 12 meses.

(Capital tem skill própria? Não — capital fica nos OKRs diretamente, com referência a um plano financeiro externo se a pessoa tiver.)

## Saída

```
plan/okrs-<YYYY-QQ>.md      # OKRs do trimestre — fecha em quarterly review
plan/skill-roadmap.md       # vivo, revisa trimestral
plan/study-cadence.md       # vivo, revisa mensal
plan/network-plan.md        # vivo, revisa trimestral
plan/brand-plan.md          # vivo, revisa trimestral
plan/health-protocol.md     # vivo, revisa trimestral
```

## Sanity check antes de sair

- Cada KR tem **número** e **data**? Sem isso não é KR (regra de Doerr).
- Os OKRs cabem em um trimestre realista? Se você bater todos em 6 semanas, são fracos. Se você não bater nenhum, são fantasia.
- Os roadmaps **alimentam** os KRs ou são paralelos? Se paralelos, simplifique — corte um dos lados.

## Próximo passo

Sugira `/career-execute` pra montar a semana ideal (deep work blocks, prática deliberada, journaling).
