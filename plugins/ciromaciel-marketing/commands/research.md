---
description: "[2/8] Research — orquestra ICP, concorrentes, keywords, brand voice e visual. Produz clients/<nome>/research/."
---

Você foi invocado pelo comando `/research`. Esta é a **Fase 2** do fluxo de agência.

## Pré-requisito

Leia `clients/<nome>/intake.md`. Se não existir, pare e oriente o usuário a rodar `/discovery` primeiro.

## Objetivo

Produzir 5 artefatos de research que vão alimentar `/strategy`:

| Artefato | Quem produz | Path |
|----------|-------------|------|
| ICP profile | agent `icp-researcher` | `clients/<nome>/research/icp-<segmento>.md` |
| Competitor analysis | skill `competitor-analysis` + agent `competitor-researcher` | `clients/<nome>/research/competitors.md` |
| Keyword research | agent `keyword-researcher` | `clients/<nome>/research/keywords.md` |
| Brand voice profile | skill `brand-voice-extractor` | `clients/<nome>/research/brand-voice.md` |
| Visual brand | skill `visual-brand-extractor` | `clients/<nome>/research/visual-brand.md` |

## Passo 1 — Triagem

Verifique o que já existe em `clients/<nome>/research/`. Não rerode o que já foi feito sem confirmar.

Pergunte ao usuário quais artefatos rodar agora. Default: tudo que ainda não existe.

## Passo 2 — Execução paralela

ICP, competitors, keywords, brand voice e visual são **independentes** — invoque-os em paralelo quando possível.

Para SaaS:
- ICP foca em jobs-to-be-done e activation triggers
- Keywords focam em informational + transactional para PLG
- Competitors focam em pricing model e onboarding

Para Serviço:
- ICP foca em buying committee e sales cycle length
- Keywords focam em high-intent commercial ("[serviço] em [região]", "agência de [X]")
- Competitors focam em positioning e prova social (cases)

## Passo 3 — Síntese

Quando todos os artefatos estiverem prontos, escreva um resumo de 1 página em `clients/<nome>/research/SUMMARY.md` com:

```markdown
# Research Summary — <cliente>

## ICP em 1 frase
[quem, dor, gatilho]

## 3 insights de concorrentes
1. ...
2. ...
3. ...

## Top 5 keywords (intent)
| Keyword | Volume | Difficulty | Intent |
|---------|--------|-----------|--------|

## Brand voice em 3 adjetivos
[tom dominante]

## Cores e tipografia
[paleta + fonts]

## Decisões abertas pra /strategy
- [decisão 1]
- [decisão 2]
```

## Próximo passo

Sugira `/strategy` quando o SUMMARY estiver pronto.
