---
description: Fase 7 — Conduz reference checks estruturados. Perguntas padronizadas, validação de claims.
---

Você foi invocado pelo comando `/reference-check`. Fase 7: validação via referências profissionais.

Confirme:
1. Candidato (path)
2. Lista de referências fornecida pelo candidato (nome, role, relação, contato)
3. Modo: `prepare` (gerar script + perguntas) ou `record` (registrar resposta de uma reference call)

Princípios não negociáveis:
- **Recruiter conduz, NÃO o hiring manager** (hiring manager tem bias confirmatório)
- **Mínimo 2 referências**, idealmente 3, com pelo menos 1 ex-manager direto
- **Consentimento explícito do candidato** antes de qualquer call (LGPD)
- **Mesmas perguntas-âncora** para todas as referências do mesmo candidato

## Modo `prepare`

Gere script de 20-30min com perguntas-âncora cobrindo:
1. **Verificação básica** (2min) — datas, cargo, relação (manager direto / peer / report)
2. **Strengths reais** (5min) — "Em que o candidato é melhor?" + pedido de exemplo concreto
3. **Áreas de desenvolvimento** (5min) — "Em que área teria mais a crescer?" — se referência diz "nada", desconfie
4. **Trabalho em equipe** (5min) — exemplo de conflito e como resolveu
5. **Validação de claims** (5min) — checar fatos específicos que o candidato afirmou (projeto X, impacto Y)
6. **Re-hire question** (2min) — "Você contrataria essa pessoa de novo numa role similar?" (a pergunta mais sinalizadora)
7. **Open-ended** (2min) — "Algo mais que devo saber?"

Adapte ao scorecard — se um concern apareceu no debrief, faça pergunta direcionada.

Output em `candidates/<candidate-slug>/references-script.md`.

## Modo `record`

Para cada reference call, capture em `candidates/<candidate-slug>/references.md`:

```markdown
## Reference: [Nome] | [Role/Empresa] | [Relação com candidato]

- Data: [...]
- Duração: [...]
- Consentimento do candidato: [confirmado em data X]

### Notas por pergunta
1. Verificação: [...]
2. Strengths: [...]
3. Áreas de dev: [...]
...

### Sinais

- Re-hire? [sim / depende / não — IMPORTANTE]
- Tom geral: [entusiasmado / morno / cauteloso / negativo]
- Red flags: [...]
- Validação de claims: [bateu / não bateu]

### Score: Clear / Consider / Concern
```

## Decisão consolidada

Após todas as referências:
- **Clear:** todas positivas + re-hire sim → segue para Fase 8
- **Consider:** mistas → discussão com hiring manager antes de oferta
- **Concern:** uma negativa forte ou re-hire = não → pause, investigar, pode bloquear oferta

Atualize `application.md` e `pipeline.md`.

Background check (verificação criminal, educação, etc.) é separado — terceirize para vendor (Checkr, HireRight) e registre só o resultado `Clear/Consider/Fail` em `candidates/<candidate-slug>/background-check.md`. Adverse action workflow (LGPD) se Fail.
