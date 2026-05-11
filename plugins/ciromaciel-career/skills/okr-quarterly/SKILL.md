---
name: okr-quarterly
description: >
  Cria OKRs (Objectives and Key Results) trimestrais nos 5 vetores de carreira (skill, rede, marca, saúde, capital). Framework de John Doerr (Measure What Matters). Score 0.6-0.7 é ideal. KR sem número não é KR. Produz plan/okrs-<YYYY-QQ>.md.
tags: [career, planning]
---

# OKR Quarterly

Skill pura de raciocínio. Cria OKRs trimestrais usando o framework de **John Doerr** (*Measure What Matters*, 2018), originado em Andy Grove (Intel, anos 70) e adotado por Google em 1999.

**Locke & Latham (35 anos de Goal Setting Theory):** metas específicas e desafiadoras produzem ~16% mais desempenho que "faça seu melhor".

## Princípios não-negociáveis (Doerr)

1. **KR sem número não é KR.** "Melhorar inglês" = decoração. "Tirar C1 no CAE até 30/jun" = KR.
2. **Score alvo 0.6–0.7.** Se sempre bate 1.0, fácil demais. Se sempre bate 0.3, fantasia.
3. **3–5 KRs por Objetivo, máximo.** Mais que isso, foco morre.
4. **1–3 Objetivos por trimestre.** Mais que isso, ninguém entrega.
5. **Stretch é o padrão.** Committed (bater 1.0 é obrigatório) é exceção, só pra coisas críticas (saúde, capital crítico).

## Quando usar

- "OKRs do trimestre"
- "Como traduzo BHAG em ação esse trimestre?"
- Disparado pelo command `/career-plan` no início de cada trimestre.

## Pré-requisitos

Leia:
- `career/<nome>/vision/bhag.md` — BHAG 10 anos
- `career/<nome>/vision/strategy-3y.md` — 3 marcos pra 3 anos
- `career/<nome>/market/gap-analysis.md` — gaps prioritários
- OKR do trimestre anterior (se existir) — `plan/okrs-<YYYY-QQ-anterior>.md`
- `reviews/quarterly-<YYYY-QQ-anterior>.md` — fechamento do anterior

## Phase 1 — Calibração

Pergunte:
1. Quantos OKRs você executou em trimestres anteriores? (0, 1-2, 3+)
2. Score médio dos KRs do último trimestre?
3. Qual o trimestre atual? (use a data atual — Q1=Jan-Mar, Q2=Abr-Jun, Q3=Jul-Set, Q4=Out-Dez)

Calibragem:
- Iniciante (nunca rodou OKR): 1 Objetivo, 3 KRs. Não mais.
- Médio (rodou 2-3 trimestres): 2 Objetivos, 3-4 KRs cada.
- Avançado (rodou 6+ trimestres): 2-3 Objetivos, 4-5 KRs cada.

## Phase 2 — Objetivos (1–3)

Para cada Objetivo, exija:
- **Qualitativo** (não numérico) — Objetivo descreve direção
- **Inspirador** — você sente que importa
- **Limitado ao trimestre** — entrega/avança nessa janela
- **Conectado ao BHAG OU explicitamente fora dele** (descanso, exploração)

Bons exemplos de Objetivo:
- "Virar especialista intermediário em distributed systems"
- "Construir audiência inicial em LinkedIn de decisores B2B"
- "Recuperar saúde física a baseline de 5 anos atrás"
- "Aumentar runway pessoal de 6 pra 12 meses"

Maus exemplos (não vão):
- "Crescer" — vago
- "Aumentar X em 20%" — isso é KR, não Objetivo
- "Ser feliz" — não é Objetivo trimestral, é direção de vida

## Phase 3 — Key Results (3–5 por Objetivo)

Cada KR exige:
- **Número** (quantidade, percentual, dinheiro)
- **Data** (até quando)
- **Baseline atual** (de onde sai)
- **Onde mede** (planilha, app, sistema)
- **Tipo:** committed (precisa bater) ou stretch (0.7 é vitória)

Distribuir KRs **pelos 5 vetores de carreira**, não só skill:

| Vetor | Exemplo de KR |
|-------|---------------|
| **Skill** | "Completar curso X com nota > 80% até 30/jun" |
| **Rede** | "20 cafés/calls com decisores de fintech até 30/jun" |
| **Marca** | "12 posts no LinkedIn com avg > 500 views até 30/jun" |
| **Saúde** | "VO2máx Garmin > 45 até 30/jun (baseline: 38)" |
| **Capital** | "Investir R$ 18k no ETF X até 30/jun" |

Não obrigatório ter KR em todos os 5 — mas se ignorar saúde ou capital 4 trimestres seguidos, sinalize: "Você está negligenciando esse vetor."

## Phase 4 — Anti-goals (CRÍTICO)

Liste 3–5 coisas que você **NÃO vai fazer** este trimestre. Anti-goals previnem scope creep e dizem sim/não automático a novas oportunidades.

Exemplos:
- "Não aceito side projects de design esse trimestre — atrapalha o foco em Rust"
- "Não consumo conteúdo de marketing — não é foco esse trimestre"
- "Não viajo a trabalho — disruptive demais pra cadência"

## Phase 5 — Cadência de check-in

Defina:
- **Weekly check-in**: 5 min toda sexta no weekly review — status de cada KR (% completion, on track Y/N)
- **Mid-quarter review**: 1h no meio do trimestre — diagnóstico, ajustar se KR mal definido (não ajustar pra ficar fácil)
- **End-quarter review**: 1 dia inteiro — score, retrospectiva, abre próximo trimestre

## Phase 6 — Output

Salve em `plan/okrs-<YYYY-QQ>.md`:

```markdown
# OKRs — <YYYY-QQ>
Aberto: <YYYY-MM-DD> | Fecha: <YYYY-MM-DD>

## Objetivo 1: [frase qualitativa inspiradora]
**Por que esse Objetivo:** [1 frase ligando ao BHAG / estratégia 3y]
**Tipo:** [committed | stretch]

| KR | Baseline | Target | Vetor | Mede em | Tipo |
|----|----------|--------|-------|---------|------|
| 1.1 [verbo + métrica + número + data] | _ | _ | skill/rede/marca/saúde/capital | _ | C/S |
| 1.2 | _ | _ | _ | _ | _ |
| 1.3 | _ | _ | _ | _ | _ |

## Objetivo 2: [se aplicável]
...

## Anti-goals do trimestre

Não vou fazer:
- [item 1 — por quê]
- [item 2]
- [item 3]

## Cadência

- Weekly check-in: toda [dia da semana] no weekly review
- Mid-quarter review: <YYYY-MM-DD>
- End-quarter review: <YYYY-MM-DD>

## Score (preencher no end-quarter)

| KR | Score 0.0-1.0 | Comentário |
|----|---------------|------------|
| 1.1 | _ | _ |
| ... | _ | _ |

**Average score:** _ (target 0.6-0.7)

**Retro:** [preenche no end-quarter]
```

## Erros comuns e como evitar

| Erro | Sintoma | Correção |
|------|---------|----------|
| KR sem número | "melhorar X" | Force número |
| 8+ KRs | Trimestre dispersa | Corte pela metade |
| Tudo committed | Sem ambição | Mín 1 KR stretch |
| Tudo no vetor "skill" | Vida desbalanceada | 1 KR por vetor crítico |
| Score 1.0 sempre | KRs fáceis | Aumente target em 30% |
| Score 0.2 sempre | Fantasia ou execução ruim | Diagnostique qual |
| Sem check-in | OKR esquecido | Calendário fixo |

## Ligação com outras skills

- `weekly-review` referencia os OKRs no check-in semanal
- `career-pivot` reavalia se 2+ trimestres de score baixo persistente
- `health-protocol` informa os KRs do vetor saúde
- `personal-brand` informa os KRs do vetor marca
