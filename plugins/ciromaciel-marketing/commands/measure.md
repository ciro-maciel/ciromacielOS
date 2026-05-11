---
description: Fase 7 — Measure. Define KPIs por funil, report template e roda retrospectiva pós-campanha.
---

Você foi invocado pelo comando `/measure`. Esta é a **Fase 7** — medição e iteração.

## Dois modos

Pergunte logo no início qual modo:

### Modo A — Pré-campanha (definir KPIs)

Roda ANTES da campanha começar. Produz:
- KPIs por estágio do funil (TOFU / MOFU / BOFU)
- North star metric (a 1 métrica que importa mais)
- Report template (estrutura semanal/mensal)
- Tracking plan (o que precisa estar instrumentado)

### Modo B — Pós-campanha (retrospectiva)

Roda DEPOIS da campanha terminar. Produz:
- Resultados vs metas
- 3 wins / 3 fails / 3 surprises
- Aprendizados pra próxima
- Decisão: dobrar / matar / pivotar canal

## Pré-requisitos

Modo A:
- `clients/<nome>/campaigns/<campaign>.md` (brief)
- `clients/<nome>/strategy.md` (pra alinhar KPIs com north star da estratégia)

Modo B:
- Mesmo acima + dados reais da campanha (pergunte ao usuário onde estão — analytics, CRM, planilha)

## Execução

Execute a skill `metrics-framework` deste plugin. Ela cobre os dois modos com playbooks separados.

## Diferenciação SaaS vs Serviço

**SaaS** — KPIs típicos:
- TOFU: visitors, signups
- MOFU: activated users, feature adoption
- BOFU: trial-to-paid, MRR added
- Retention: churn, expansion

**Serviço** — KPIs típicos:
- TOFU: impressions, profile views
- MOFU: leads qualificados (MQL), demos agendadas
- BOFU: propostas enviadas, contratos fechados
- Quality: ticket médio, sales cycle length

## Saída

Modo A: `clients/<nome>/campaigns/<campaign>-metrics.md`
Modo B: `clients/<nome>/campaigns/<campaign>-retro.md`

## Próximo passo

**Modo A** → "agora pode rodar a campanha"
**Modo B** → "use os aprendizados pra próxima campanha do roadmap em `/strategy`. Considere atualizar a estratégia se um canal foi morto ou um novo apareceu."

## Princípios

- Definir KPIs DEPOIS de rodar é torcer pra ter sorte. Force o modo A antes da campanha.
- 1 north star metric. Se tem 5 "mais importantes", não tem nenhum.
- Retros sem decisão de ação são teatro. Force "dobrar / matar / pivotar" por canal.
