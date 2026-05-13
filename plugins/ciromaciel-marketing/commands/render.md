---
description: "[6/9] Render — produz binários finais dos assets (MP4 de vídeos via Remotion, áudio TTS). Roteiros viram arquivos publicáveis."
---

Você foi invocado pelo comando `/render`. Esta é a **Fase 6** — produção final dos assets que precisam de render.

Fluxo até aqui: `/discovery` → `/research` → `/strategy` → `/new-campaign` → `/execute` (gerou scripts/copy) → **`/render`** (binários finais) → `/distribute` → `/publish` → `/measure`.

## Por que existe esta fase

`/execute` produz **blueprints**: roteiros de vídeo (`script.md`), copy de email (`.md`), posts (`.md`). A maioria já é publicável como texto. Mas vídeos precisam virar **MP4** — e isso envolve TTS, Remotion render e validação. `/render` é o ponto de execução desse pipeline pra **todos os vídeos da campanha de uma vez**, não um-a-um.

Se a campanha não tem vídeo, este comando ainda passa em revisão: confere que todos os assets de texto estão completos e prontos pra `/distribute`.

## Pré-requisitos

- `clients/<nome>/campaigns/<campaign>.md` (brief)
- `clients/<nome>/campaigns/<campaign>-assets/` (saída do `/execute`)

Se a pasta de assets não existir, pare e oriente a rodar `/execute` primeiro.

## Passo 1 — Inventário do que precisa render

Liste o conteúdo de `<campaign>-assets/`:

| Tipo | Estado após `/execute` | Precisa render? | Como renderiza |
|------|------------------------|-----------------|----------------|
| `blog/<slug>.md` | publicável | não | — |
| `social/linkedin-*.md` | publicável | não | — |
| `social/instagram-*.md` (texto) | publicável | não | — |
| `social/instagram-*.md` (com referência a vídeo/imagem) | parcial | sim (imagem se aplicável) | HTML slides → PNG (opcional, fase futura) |
| `video/<slug>/script.md` | **só roteiro** | **sim** | `remotion-builder` + `/render-video` |
| `emails/*.md` | publicável | não | — |
| `landing/*.md` | publicável | não | — |
| `ads/*.md` | publicável | não | — |

Para cada subpasta `video/<slug>/`, verifique o estado:

```
video/<slug>/
├── script.md              ← /execute produziu
├── props.json             ← remotion-builder produz (PODE FALTAR)
├── audio-script.json      ← remotion-builder produz (PODE FALTAR)
├── assets/README.md       ← remotion-builder produz (PODE FALTAR)
└── out.mp4                ← /render-video produz (FINAL)
```

Classifique cada vídeo em um dos estados:

- **`script-only`** — só tem `script.md`. Falta passar pelo `remotion-builder` (agent do plugin `ciromaciel-video-creator`).
- **`build-ready`** — tem `props.json` + `audio-script.json` mas falta `out.mp4`. Pronto pra `/render-video`.
- **`rendered`** — `out.mp4` existe. Skip.

## Passo 2 — Confirmar plano com o usuário

Mostre uma tabela:

```
Vídeos da campanha:
- reel-01-<slug> → script-only (precisa build + render)
- youtube-01-<slug> → build-ready (só render)
- linkedin-video-<slug> → rendered ✓ (skip)

Vou:
1. Rodar remotion-builder em: reel-01-<slug>
2. Rodar /render-video em: reel-01-<slug>, youtube-01-<slug>

Cada render leva ~2-4min e custa ~$0.30 de TTS (ElevenLabs). Confirma?
```

Espere "sim/ok/confirma". Se o usuário quiser pular algum vídeo, respeite.

## Passo 3 — Build (script → props.json)

Para cada vídeo `script-only` confirmado:

Invoque o agent `remotion-builder` do plugin `ciromaciel-video-creator`, passando:
- Path do `script.md`
- Path do `visual-brand.md` (se existir em `clients/<nome>/research/`)
- Path de saída: a própria pasta `video/<slug>/`

O agent escolhe template, preenche props, gera `audio-script.json` e lista de assets. **Não tente fazer isso inline** — delegue.

Após cada build, valide que os 3 arquivos esperados (`props.json`, `audio-script.json`, `assets/README.md`) foram criados. Se algum falhou, halt e reporte qual vídeo.

## Passo 4 — Verificar assets `to-record` / `to-fetch`

Para cada vídeo agora `build-ready`, leia `assets/README.md`. Se houver assets marcados `to-record` (gravação manual do usuário) ainda pendentes, **halt e reporte a lista** — não dá pra renderizar sem eles.

Assets `to-fetch` (URLs públicas) o `/render-video` baixa sozinho, não bloqueia aqui.

## Passo 5 — Render em sequência (não paralelo)

Para cada vídeo `build-ready` confirmado, invoque o command `/render-video <slug>` do plugin `ciromaciel-video-creator`.

**Sequência, não paralelo:** Remotion pode conflitar cache de output se rodado em paralelo no mesmo template. Espere um terminar antes do próximo.

O `/render-video` cuida de: fetch de URLs, TTS via ElevenLabs (cacheado), Remotion render, validação ffprobe, update do calendar. Você só orquestra a fila.

Se algum render falhar, **continue com os outros** e reporte os erros no fim — não pare a fila inteira por um.

## Passo 6 — Inventário final

Liste o estado pós-render:

```markdown
## Render concluído — <campaign>

**Vídeos renderizados:**
- ✓ reel-01-<slug> → video/reel-01-<slug>/out.mp4 (32s, 4.2 MB)
- ✓ youtube-01-<slug> → video/youtube-01-<slug>/out.mp4 (180s, 18 MB)
- ✗ linkedin-video-<slug> → falhou em Passo 4: asset "talking-head.mp4" ainda to-record

**Outros assets (não precisam render — já publicáveis):**
- 1 blog post
- 3 LinkedIn posts
- 2 Instagram carrosséis (texto)
- 4 emails (cold + nurture)
- 1 landing page
- 2 ads (LinkedIn)

**Custos TTS estimados (esta rodada):** ~$0.60

**Pronto pra `/distribute`?** Sim — todos os assets críticos estão em formato publicável.
```

## Passo 7 — Próximo passo

Sugira `/distribute` pra montar o content calendar agora que os binários existem.

## Não faça

- Não tente rodar Remotion inline aqui — delegue pro `/render-video` do plugin video-creator
- Não renderize em paralelo no mesmo cliente (Remotion conflita cache)
- Não pule o `remotion-builder` — se o vídeo só tem `script.md`, build antes de render
- Não delete `out.mp4` antigo se já existir — `/render-video` já tem cache, deixa ele decidir
- Não bloqueie a fila inteira por um vídeo que falhou — reporte e siga
- Não chame `/render-video` sem confirmar com o usuário (TTS custa dinheiro real)
