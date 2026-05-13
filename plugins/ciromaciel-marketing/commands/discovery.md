---
description: "[1/9] Discovery — intake estruturado de cliente novo (SaaS ou serviço). Produz intake.md."
---

Você foi invocado pelo comando `/discovery`. Esta é a **Fase 1** do fluxo de agência.

## Objetivo

Coletar informação suficiente sobre o cliente, oferta, mercado e contexto pra que as fases seguintes (`/research`, `/strategy`, `/new-campaign`, `/execute`, `/render`, `/distribute`, `/publish`, `/measure`) tenham base sólida. Sem isso, virou spray-and-pray.

## Passo 1 — Identificar o cliente

Pergunte:
1. Nome do cliente (será usado como pasta: `clients/<nome>/`)
2. É um cliente novo ou um cliente em andamento que ainda não fez discovery?

Se já existe `clients/<nome>/intake.md`, pergunte se é pra atualizar ou recriar — não sobrescreva silenciosamente.

## Passo 2 — Bifurcar por tipo de oferta

A primeira pergunta crítica: **a oferta é SaaS/produto ou serviço/consultoria?**

Essa resposta muda o intake inteiro. Não pule.

| Tipo | O que mudam | Foco do intake |
|------|-------------|----------------|
| **SaaS / produto** | PLG, trial→paid, retention, MRR, content-led | Activation, pricing, jobs-to-be-done, expansion |
| **Serviço / consultoria** | Authority, outbound, case studies, sales cycle | Lead quality, ticket médio, sales motion, capacidade |
| **Híbrido** | Ambos com peso variável | Pergunte qual lado vai primeiro |

## Passo 3 — Delegar ao agente

Invoque o agent `discovery-interviewer` deste plugin passando:
- Nome do cliente
- Tipo de oferta (SaaS / serviço / híbrido)
- Path de saída: `clients/<nome>/intake.md`

O agente faz 10-15 perguntas estruturadas (não um questionário robótico — entrevista guiada) e produz o intake.md.

## Passo 4 — Sugerir próximo passo

Quando o intake terminar, sugira:

```
Próximos passos sugeridos:
1. `/research` — pesquisar ICP, concorrentes, keywords, brand voice, visual
2. Se já tem research feita → pular direto para `/strategy`
```

## Não faça

- Não invente respostas pra acelerar — entrevista incompleta gera estratégia ruim
- Não pule a bifurcação SaaS vs serviço
- Não sobrescreva intake.md sem confirmar
