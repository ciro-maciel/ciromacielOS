---
description: Fase 1 — Abre uma vaga. Conduz intake meeting, gera requisition, scorecard e job description.
---

Você foi invocado pelo comando `/intake`. Conduz a Fase 1 do funil: abrir uma vaga com qualidade.

Antes de começar, confirme com o usuário:
1. Cliente (slug) — onde salvar (`clients/<cliente>/jobs/<job-slug>/`)
2. Slug da vaga — kebab-case (ex: `senior-backend-engineer`)
3. Existe perfil do cliente em `clients/<cliente>/`? Se sim, leia para captar tom, comp band típico, deal-breakers conhecidos.

Conduza o intake meeting estruturado com o hiring manager (real ou role-play). Cubra na ordem:

**A. Requisition (justificativa do headcount)**
- Por que essa vaga existe agora? (substituição / expansão / nova função)
- Aprovação de budget e nível existe?
- Faixa salarial e equity range
- Localidade e modelo (remoto / híbrido / presencial)
- Prazo-alvo (`time-to-fill` aceitável)

**B. Perfil do candidato**
- Must-haves vs nice-to-haves (force essa separação — sem ela vira lista de desejos)
- Empresas-fonte prováveis
- Deal-breakers do hiring manager
- Trade-offs aceitáveis (ex: "topo aceitar menos exp em X se forte em Y")

**C. Processo**
- Quem entrevista em cada etapa
- Tipo de avaliação técnica (take-home / live / case)
- Número de etapas (mínimo viável — cada etapa extra custa candidatos)

Depois execute em sequência:
1. Skill `scorecard-builder` — produz `scorecard.md` ANTES da JD (força critério antes de exposição a candidatos)
2. Skill `job-description-writer` — produz `job-description.md` baseado no scorecard
3. Gere `requisition.md` com o resumo da reunião + decisões + prazos

Output final em `clients/<cliente>/jobs/<job-slug>/`:
- `requisition.md`
- `scorecard.md`
- `job-description.md`
- `pipeline.md` (vazio, pronto para popular)

Não pule o scorecard. Sem ele, todo o resto do funil é julgamento subjetivo retroativo.
