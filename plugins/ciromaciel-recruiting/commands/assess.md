---
description: Fase 5 — Design e/ou review de avaliação técnica. Take-home, live coding ou case.
---

Você foi invocado pelo comando `/assess`. Fase 5: avaliação técnica/funcional padronizada.

Modos:
- `design` — projetar uma nova avaliação para a vaga
- `review` — revisar submission de um candidato contra a rubrica

Pergunte qual modo + paths necessários.

## Modo `design`

Pré-requisitos: `scorecard.md` e `job-description.md` da vaga.

Execute skill `technical-assessment-designer`. Decida com o usuário:
- **Formato:** take-home (assíncrono, 3-8h budget) / live coding (60-90min) / case study / system design
- **Trade-offs:** take-home = sinal mais alto mas pior candidate experience; live = melhor experience mas pega menos profundidade
- **Anti-cheating:** se take-home, planeje validação ao vivo do raciocínio na próxima etapa

Output em `clients/<cliente>/jobs/<job-slug>/assessment-template.md`:
- Enunciado limpo (instruções, escopo, tempo máximo, formato de entrega)
- Rubrica detalhada (competências avaliadas + escala + exemplos do que é "3" vs "4")
- Setup técnico (repo template, datasets, fixtures)
- Comunicação ao candidato (e-mail template)
- Instruções para o avaliador (blind review se possível — sem nome/empresa)

## Modo `review`

Pré-requisitos: `assessment-template.md` da vaga + submission do candidato (path).

Leia a rubrica. Avalie submission **só contra a rubrica** — não improvise critérios novos.

Output em `candidates/<candidate-slug>/assessment.md`:
- Score por competência da rubrica (1-4)
- Evidência textual para cada score (cite o código/output)
- Strengths / concerns
- Recomendação: `Strong Yes / Yes / No / Strong No`
- Confidence level (baixa se foi possível plagiar, alta se há sinais únicos)

## Sempre

- Atualize `application.md` com transição de stage.
- Se modo design, lembrete: blind review (sem nome/empresa do candidato visível ao avaliador humano) reduz viés em 20-40%.
