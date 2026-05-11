---
description: Fase 6 — Medição. Dashboard pessoal com KPIs em 7 camadas + cadência de coleta. Produz dashboard/metrics.md.
---

Você foi invocado pelo comando `/career-measure`. Esta é a **Fase 6** do fluxo de carreira.

## Princípio

Drucker: *what gets measured gets managed*. Medir errado é pior que não medir — você otimiza o vanity.

**Dashboard pessoal em 7 camadas:**

| Camada | Métrica exemplo | Cadência |
|--------|-----------------|----------|
| Output | Entregas com impacto medido (não tarefas) | Semanal |
| Skill | Horas de prática deliberada em 1-2 skills foco | Diária |
| Rede | Conversas novas de qualidade / mês | Mensal |
| Reputação | Menções, convites, ofertas inbound | Trimestral |
| Capital | Patrimônio líquido, runway pessoal (meses) | Mensal |
| Saúde | Sono médio, VO2máx estimado, força (1RM) | Semanal |
| Energia | Auto-rating 1–5 no fim do dia | Diária |

## Pré-requisitos

Leia:
1. `career/<nome>/plan/okrs-<YYYY-QQ>.md`
2. `career/<nome>/plan/skill-roadmap.md`
3. `career/<nome>/plan/health-protocol.md`

## Execução

### Passo 1 — Mapear KRs → métricas

Para cada KR do trimestre, defina:
- **Métrica exata** (número, unidade)
- **Onde a métrica vive** (planilha, app, Notion, Garmin, Strava, ...)
- **Cadência de coleta** (diária / semanal / mensal)
- **Quem coleta** (você mesmo — não delegue isso)
- **Baseline atual** (mede AGORA, antes de começar)

### Passo 2 — Dashboard nas 7 camadas

Produza `dashboard/metrics.md` com tabela:

```markdown
| Camada | Métrica | Baseline | Target Q | Coleta | Onde |
|--------|---------|----------|----------|--------|------|
| Output | Features shipped com adoption > 30% | 0 | 3 | Semanal | Linear |
| Skill | Horas de prática deliberada em Rust | 0 | 60 | Diária | Toggl |
| Rede | Cafés novos com decisores ICP | 0 | 24 | Mensal | Notion CRM |
| ... | | | | | |
```

### Passo 3 — Journaling diário (`dashboard/journal-<YYYY-MM>.md`)

Template de 1 arquivo por mês, 1 entrada por dia:

```markdown
## YYYY-MM-DD

**Energia (1-5):** _
**Sono (h):** _
**Deep work (h):** _
**Top 3 do dia:**
1.
2.
3.

**Done:** _
**Não fiz e por quê:** _
**Aprendizado / observação:** _
```

5 min manhã (top 3) + 5 min noite (resto). 10 minutos totais/dia.

Pennebaker (UT Austin): journaling expressivo tem evidência para melhor regulação emocional, sono e função imune.

### Passo 4 — Wearables (opcional mas recomendado)

Se a pessoa tem ou pode ter:
- **Sleep tracker** (Oura, Whoop, Garmin, Apple Watch) — sono é o input mais subestimado
- **HRV** (mesmos devices) — proxy de recovery
- **VO2máx estimado** (Garmin/Apple/Whoop) — Mandsager 2018, JAMA: quartil superior reduz mortalidade mais que parar de fumar
- **Força log** (Strong app, Hevy) — 1RM trimestral em compostos

## Saída

```
dashboard/metrics.md              # tabela viva, revisa toda semana
dashboard/journal-<YYYY-MM>.md    # 1 arquivo/mês
```

## Princípio inegociável

**Coletar > analisar.** Dashboard que você não atualiza vira ficção. Comece com 5–7 métricas, não 20.

## Próximo passo

Sugira `/career-review weekly` na próxima sexta ou domingo.
