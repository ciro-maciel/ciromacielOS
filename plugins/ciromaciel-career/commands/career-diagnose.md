---
description: Fase 2 — Diagnóstico. Self-knowledge (anchor + Big Five) + market reality (salário, demanda, gap). Produz self/* e market/*.
---

Você foi invocado pelo comando `/career-diagnose`. Esta é a **Fase 2** do fluxo de carreira.

## Princípio

Antes de escolher para onde ir, saber **quem você é** e **como está o mercado**. Sem isso, a visão da fase 3 é fantasia.

## Pré-requisitos

Leia, nesta ordem:
1. `career/<nome>/intake.md` (obrigatório — rode `/career-discovery` se faltar)

## Execução — em paralelo

Dispare 3 trilhas de diagnóstico:

### Trilha A — Self-knowledge

Execute estas skills em sequência (cada uma precisa da pessoa responder perguntas):

1. **`career-anchor-finder`** → `self/anchor.md`
   Schein's 8 anchors. Identifica âncora dominante e secundária. Útil pra evitar promoções que violam a âncora.

2. **`personality-profiler`** → `self/personality.md`
   Big Five lite. Identifica padrões que ajudam ou atrapalham em diferentes papéis.

3. **Values workshop** → `self/values.md`
   Liste 30 valores → corte pra 10 → corte pra 5 → ranqueie. Top 5 são os filtros pra decisão de vida toda.

### Trilha B — Market reality

Execute o agent `market-researcher`. Ele produz:

1. **`market/role-research.md`** — papéis adjacentes ao atual + requisitos típicos + trajetória de progressão
2. **`market/salary-benchmark.md`** — faixas salariais por senioridade (levels.fyi, Glassdoor, Coletivo.work, Vagas BR)
3. **`market/gap-analysis.md`** — gap entre estado atual e papel-alvo (skills, anos de experiência, network)

### Trilha C — Síntese

Depois das duas trilhas, produza `market/gap-analysis.md` com:
- O que você tem (skills, network, marca, capital, saúde) — escala 1–5
- O que você precisa pra papel-alvo
- Gap em cada vetor
- Hipótese de tempo pra fechar cada gap

## Saída

```
self/anchor.md
self/personality.md
self/values.md
market/role-research.md
market/salary-benchmark.md
market/gap-analysis.md
```

## Próximo passo

Sugira `/career-vision` para definir BHAG de 10 anos e estratégia de 3 anos.
