---
description: Fase 6 — Gera interview kit por entrevistador (perguntas, rubrica, contexto, scorecard pronto).
---

Você foi invocado pelo comando `/interview-kit`. Fase 6: prepara entrevistas estruturadas do painel.

Confirme:
1. Candidato (path)
2. Tipo da entrevista: `behavioral` / `technical-deep-dive` / `system-design` / `cross-functional` / `bar-raiser`
3. Quem é o entrevistador (nome / role) — informa o tom e foco
4. Duração (geralmente 45-60min)

Pré-requisitos:
- `scorecard.md` da vaga
- Estágios anteriores do candidato (`screen.md`, `assessment.md`) para contexto

## Output

Crie `candidates/<candidate-slug>/interviews/<NN>-<tipo>.md` (NN auto-incrementa):

```markdown
# Interview Kit — [Nome candidato] | [Tipo entrevista]

## Para o entrevistador

### Contexto do candidato (sem comp, sem demografia)
- Senioridade aparente: [...]
- Trajetória resumida: [...]
- O que já foi avaliado: [phone screen score, assessment score]
- Áreas a probe nesta entrevista: [competências do scorecard atribuídas a este slot]

### Competência primária
[Uma competência principal — não tente cobrir tudo. Outras entrevistas cobrem o resto.]

### Estrutura sugerida (60min)
- 0-3min: Rapport + explicar formato
- 3-50min: Perguntas + follow-ups
- 50-58min: Q&A do candidato
- 58-60min: Próximos passos

### Perguntas-âncora (mesmas para todos os candidatos desta vaga — comparabilidade)
1. [Pergunta primária com follow-ups previstos]
2. [Pergunta secundária]
3. [Backup se sobrar tempo]

Execute skill `interview-question-bank` para selecionar as perguntas certas por competência + senioridade.

### Rubrica (escala 1-4)
| Score | Sinal |
|---|---|
| 4 - Strong Yes | [exemplo concreto] |
| 3 - Yes | [exemplo concreto] |
| 2 - No | [exemplo concreto] |
| 1 - Strong No | [exemplo concreto] |

### Probes específicos para ESTE candidato
[Baseado em gaps/strengths do screen+assessment, sugerir áreas a aprofundar]

## Submissão (a preencher após entrevista)
- Score: [_]
- Recomendação: Strong Yes / Yes / No / Strong No
- Evidências (citar quotes do candidato):
- Concerns:
- Strengths:

⚠️ Submeta este scorecard ANTES de ver feedback de outros entrevistadores. Evita ancoragem.
```

Lembrete final ao usuário: se houver agent `interview-question-critic`, ofereça revisar o kit antes de mandar ao entrevistador.
