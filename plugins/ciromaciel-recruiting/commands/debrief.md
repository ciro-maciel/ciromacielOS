---
description: Fase 6.b — Debrief estruturado pós-painel. Consolida scorecards, identifica divergências, produz decisão.
---

Você foi invocado pelo comando `/debrief`. Fase 6.b: consolidar painel e decidir.

Pré-requisito:
- Todos os `interviews/<NN>-<tipo>.md` do candidato preenchidos pelos entrevistadores
- Recuse rodar se algum entrevistador ainda não submeteu — debrief com dados incompletos vira voto de quem falou mais alto

## Execução

1. **Leia todos os interview scorecards** do candidato
2. **Tabule** por competência × entrevistador:
   ```
   Competência         | Behavioral | Tech     | SysDesign | Bar Raiser
   System thinking     | 3          | 4        | 4         | 3
   Communication       | 4          | -        | 3         | 4
   Code quality        | -          | 3        | -         | 2
   ```
3. **Identifique divergências** (score diff ≥ 2 entre entrevistadores) — essas precisam discussão explícita, não média
4. **Cheque coverage do scorecard** — toda competência crítica foi avaliada por ≥ 1 entrevistador?

## Debrief facilitation

Conduza a discussão (ou role-play se solo) na ordem:
1. **Cada entrevistador resume em 60s** sua recomendação + evidência principal — não passe pra discussão antes
2. **Discutir divergências** — pessoa com score mais baixo apresenta evidência primeiro (anti-groupthink)
3. **Bar raiser tem veto** se aplicável; veto requer fundamentação escrita
4. **Decisão final** — Strong Yes / Yes / No / Strong No

## Output em `candidates/<candidate-slug>/decision.md`

```markdown
# Debrief decision — [Nome]

## Tabela consolidada
[matrix competência × entrevistador]

## Divergências discutidas
- [Competência X]: scores Y vs Z — resolução: [...]

## Recomendação final: [Strong Yes / Yes / No / Strong No]

## Justificativa (3-5 bullets de evidência)
- ...

## Reason code (se No): [skills-gap | level-mismatch | culture | judgment-concern | competing-stronger | ...]

## Próximos passos
- [reference check / offer prep / rejection comm]

## Participantes
- [recruiter, hiring manager, entrevistadores]
```

Atualize:
- `application.md` (stage transition)
- `pipeline.md` (status atualizado)

Se decisão = No e candidato é forte: ofereça mover para talent pool (`clients/<cliente>/talent-pool/`) com tags + data de re-engajamento sugerida (3-6 meses).
