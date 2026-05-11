---
description: Fases 3+4 — Triagem de CV + phone screen. Avalia candidato contra scorecard e produz recomendação estruturada.
---

Você foi invocado pelo comando `/screen`. Conduz Fases 3 (resume screen) e 4 (phone screen).

Confirme primeiro:
1. Qual candidato? (path ou slug — ex: `clients/acme/jobs/senior-be/candidates/jane-doe/`)
2. Modo: `cv` (só triagem de CV) ou `phone` (script de phone screen) ou `both`
3. Onde está o CV? (path para PDF/markdown ou texto colado)

Leia obrigatoriamente:
- `clients/<cliente>/jobs/<job-slug>/scorecard.md` (critério avaliação)
- `clients/<cliente>/jobs/<job-slug>/job-description.md` (contexto da vaga)
- CV do candidato (se modo `cv` ou `both`)

## Modo CV

Delegue ao agent `candidate-screener` se disponível — ele rastreia CV contra scorecard de forma estruturada e devolve score por competência + flags.

Output em `candidates/<candidate-slug>/screen.md`:
- Score por competência do scorecard (1-4 escala)
- Knockouts triggered (se algum) — auto-rejeita
- Gaps vs must-haves
- Highlights vs nice-to-haves
- Recomendação: `Strong Yes / Yes / No / Strong No`
- Reason codes (skills-gap, experience-mismatch, etc.) se No

## Modo Phone

Gere script de phone screen de ~25min cobrindo (nesta ordem):
1. **Opening** (2min) — apresentação da vaga em 30s, expectativa da call
2. **Validação de hard requirements** (5min) — autorização de trabalho, exp mínima, stack
3. **Trajetória** (8min) — last role, motivação para sair, padrão de mudanças
4. **Fit com vaga** (5min) — entendimento da função, expectativa de senioridade
5. **Compensation alignment** (3min) — calibragem salarial ANTES de gastar tempo do hiring manager
6. **Disponibilidade** (1min) — start date, processos em paralelo
7. **Q&A do candidato** (1min)

Adapte perguntas ao scorecard — não use template genérico.

Output em `candidates/<candidate-slug>/screen.md` (append se já existe):
- Notas estruturadas por seção
- Salary expectation captured
- Competing processes (concorrência)
- Scorecard preenchido
- Recomendação `Strong Yes / Yes / No / Strong No`
- Reason code obrigatório se No

## Sempre

Atualize `application.md` do candidato com transição de stage e timestamp.
Atualize `pipeline.md` da vaga com status atualizado.

Toda rejeição tem reason code categorizado. Sem isso o funil analytics da Fase 11 fica cego.
