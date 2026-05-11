---
description: Fase 5 — Execute. Gera assets de uma campanha (copy de email, social, landing, ads) + revisa.
---

Você foi invocado pelo comando `/execute`. Esta é a **Fase 5** — produção de assets.

Fluxo até aqui: `/discovery` → `/research` → `/strategy` → `/new-campaign` (brief) → **`/execute`** (gerar copy).

## Pré-requisitos

Leia, na ordem:
1. `clients/<nome>/campaigns/<campaign>.md` (o brief produzido por `/new-campaign`)
2. `clients/<nome>/research/brand-voice.md`
3. `clients/<nome>/research/icp-<segmento>.md`

Se o brief não existir, pare e oriente o usuário a rodar `/new-campaign` primeiro.

## Passo 1 — Identificar assets a produzir

Liste, a partir do brief, todos os assets a gerar. Exemplo típico:

- 3-5 emails (sequência outbound ou nurture)
- 5-10 posts sociais (LinkedIn / X)
- 1 landing page (hero + features + social proof + CTA)
- 2-4 ad variations (LinkedIn ads / Google ads)

Confirme com o usuário quais gerar nesta rodada (default: tudo do brief).

## Passo 2 — Geração

Execute a skill `copy-generator` deste plugin, uma vez por tipo de asset. A skill:
- Lê brand voice + ICP
- Gera múltiplas variações (não 1 só)
- Marca onde substituir variáveis específicas do cliente

## Passo 3 — Crítica

Para CADA asset gerado, invoque o agent `copy-critic` deste plugin. Ele devolve issues priorizadas, **sem reescrever**.

Se ele retornar "OK ship", o asset está pronto. Caso contrário, itere uma vez (no máximo 2) com as correções.

## Passo 4 — Salvar

Salve assets em `clients/<nome>/campaigns/<campaign>-assets/`:

```
campaigns/<campaign>-assets/
  ├── emails/
  │   ├── 01-cold-open.md
  │   ├── 02-followup-value.md
  │   └── 03-breakup.md
  ├── social/
  │   ├── linkedin-01.md
  │   └── linkedin-02.md
  ├── landing/
  │   └── landing.md
  └── ads/
      ├── linkedin-ad-01.md
      └── linkedin-ad-02.md
```

Cada arquivo é Markdown puro pronto pra copiar/colar no canal final.

## Próximo passo

Sugira `/distribute` para montar o content calendar e definir cronograma de publicação.

## Não faça

- Não gere copy sem brand voice — se brand-voice.md não existir, pare
- Não ignore o copy-critic — passe TODO asset por ele
- Não tente reescrever o que o critic apontou; o critic aponta, o gerador re-gera
