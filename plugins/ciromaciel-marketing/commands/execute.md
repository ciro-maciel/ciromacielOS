---
description: "[5/8] Execute — gera assets de uma campanha (blog, LinkedIn, Instagram, vídeo, email, ads, landing) roteando para agent/skill especializado por canal."
---

Você foi invocado pelo comando `/execute`. Esta é a **Fase 5** — produção de assets.

Fluxo até aqui: `/discovery` → `/research` → `/strategy` → `/new-campaign` (brief) → **`/execute`** (gerar assets).

## Pré-requisitos

Leia, na ordem:
1. `clients/<nome>/campaigns/<campaign>.md` (o brief produzido por `/new-campaign`)
2. `clients/<nome>/research/brand-voice.md`
3. `clients/<nome>/research/icp-<segmento>.md`
4. `clients/<nome>/research/visual-brand.md` (se existir — necessário pra IG/vídeo)
5. `clients/<nome>/research/keywords.md` (se existir — necessário pra blog SEO)

Se o brief não existir, pare e oriente o usuário a rodar `/new-campaign` primeiro.
Se brand voice não existir, pare e oriente a rodar `brand-voice-extractor` primeiro.

## Passo 1 — Identificar assets e ROTEAR

Liste, a partir do brief, todos os assets a gerar. Cada asset tem um produtor especializado:

| Tipo de asset | Produzido por | Onde salva |
|---------------|---------------|------------|
| Post de blog / artigo | agent `blog-writer` | `<campaign>-assets/blog/` |
| Post de LinkedIn orgânico | agent `linkedin-writer` | `<campaign>-assets/social/linkedin-*` |
| Post de Instagram (feed/Reel/Story/carrossel) | agent `instagram-writer` | `<campaign>-assets/social/instagram-*` |
| Roteiro de vídeo (Reel/Shorts/TikTok/YT/LinkedIn vídeo) | agent `video-script-writer` **do plugin `ciromaciel-video-creator`** | `<campaign>-assets/video/<slug>/script.md` |
| Cold email sequence | skill `copy-generator` | `<campaign>-assets/emails/` |
| Landing page | skill `copy-generator` | `<campaign>-assets/landing/` |
| Ads (LinkedIn/Meta/Google) | skill `copy-generator` | `<campaign>-assets/ads/` |
| Email nurture | skill `copy-generator` | `<campaign>-assets/emails/` |
| X/Twitter post | skill `copy-generator` (seção social) | `<campaign>-assets/social/` |

**Regra de roteamento:** cada canal vai pro especialista. Não mande "post de LinkedIn" pra `copy-generator` se `linkedin-writer` existe.

**Vídeo é caso especial:** o `video-script-writer` (do plugin `ciromaciel-video-creator`) entrega ROTEIRO (blueprint). Pra produzir MP4 de verdade, o usuário continua o pipeline naquele plugin: `remotion-builder` → `/render-video`. Aqui no `/execute` você para no script.

Confirme com o usuário quais assets gerar nesta rodada (default: tudo do brief).

## Passo 2 — Geração (delegar pro agent/skill certo)

Para cada asset confirmado:

1. **Identifique o produtor** pela tabela acima
2. **Invoque-o** passando: brief, brand voice, ICP, e parâmetros específicos (duração de vídeo, intent de blog, formato de IG)
3. Se faltar pré-requisito específico (ex: keywords pra blog, visual-brand pra IG), **pare e peça** — não chute
4. **Cada agent salva o próprio arquivo** no path correto

**Paralelização:** assets independentes (LinkedIn + blog + email) podem ser gerados em paralelo invocando agents simultâneos. Vídeo de LinkedIn que depende do `linkedin-writer` aguarda o post.

## Passo 3 — Crítica (todos passam pelo copy-critic)

Para CADA asset gerado (não importa qual produtor), invoque o agent `copy-critic`. Ele devolve issues priorizadas, **sem reescrever**.

Se retornar "OK ship" → asset pronto.
Se retornar issues → volte ao produtor original com as correções pra regenerar (máx 2 iterações). Não tente reescrever você mesmo.

## Passo 4 — Verificar estrutura de saída

Após todos os assets:

```
campaigns/<campaign>-assets/
  ├── blog/
  │   └── <slug>.md
  ├── social/
  │   ├── linkedin-01-<slug>.md
  │   ├── linkedin-02-<slug>.md
  │   ├── instagram-01-reel-<slug>.md
  │   └── instagram-02-carrossel-<slug>.md
  ├── video/
  │   ├── reel-01-<slug>.md
  │   └── youtube-01-<slug>.md
  ├── emails/
  │   ├── 01-cold-open.md
  │   ├── 02-followup-value.md
  │   └── 03-breakup.md
  ├── landing/
  │   └── landing.md
  └── ads/
      ├── linkedin-ad-01.md
      └── linkedin-ad-02.md
```

Cada arquivo é Markdown puro — pronto pra `/distribute` indexar e `/publish` orquestrar.

## Próximo passo

Sugira `/distribute` para montar o content calendar e definir cronograma de publicação.

## Não faça

- Não gere copy sem brand voice — se brand-voice.md não existir, pare
- Não use `copy-generator` pra blog, LinkedIn, Instagram ou vídeo se o agent especializado existe
- Não tente reescrever o que o `copy-critic` apontou; o crítico aponta, o produtor original re-gera
- Não invente MP4 / vídeo renderizado — `video-script-writer` entrega roteiro, edição é fora do plugin
- Não pule o `copy-critic` em nenhum asset
