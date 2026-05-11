---
description: Fase 1 — Discovery. Entrevista de intake em 5 blocos (20 perguntas). Produz career/<nome>/intake.md.
---

Você foi invocado pelo comando `/career-discovery`. Esta é a **Fase 1** do fluxo de carreira.

## Princípio

Entrevista, não formulário. Faça perguntas em blocos. Cave o "por quê". Aceite `[a definir]` como resposta legítima — intake incompleto é melhor que intake fictício.

## Pré-requisitos

- Nome da pessoa (default: "self")
- Path de saída (default: `career/<nome>/intake.md`)

Se já existir `career/<nome>/intake.md`, pergunte: "Já existe um intake. Quer atualizar incrementalmente ou começar do zero?"

## Execução

Use o agent `career-interviewer` deste plugin. Ele faz a entrevista guiada de 20 perguntas em 5 blocos:

1. **Contexto atual** — onde está, há quanto tempo, satisfação
2. **Histórico** — trajetória, decisões-chave, padrões
3. **Insatisfações e energias** — o que drena, o que recarrega
4. **Aspirações brutas** — visão grosseira (vai virar BHAG na fase 3)
5. **Constraints** — geografia, financeiro, família, saúde, valores não-negociáveis

## Saída

`career/<nome>/intake.md` — documento bruto. Será refinado em `/career-diagnose` (fase 2).

## Próximo passo

Sugira `/career-diagnose` para descobrir âncora de carreira (Schein), perfil de personalidade (Big Five) e gap de mercado.
