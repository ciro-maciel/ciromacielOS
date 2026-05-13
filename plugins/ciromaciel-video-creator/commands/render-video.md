---
description: Orquestra a pipeline completa de produção de vídeo — fetch assets pendentes → gera audio TTS → renderiza Remotion → MP4 final. Requer roteiro + props.json prontos.
---

Você foi invocado pelo comando `/render-video <slug>`. Esta é a fase de **produção final** do vídeo — assets viram MP4.

Pipeline completo do plugin `ciromaciel-video-creator`:
```
video-script-writer (roteiro humano-legível, revisado)
  ↓
remotion-builder (props.json + audio-script.json + lista de assets)
  ↓
/render-video (VOCÊ — orquestra)
  ├─ download de assets to-fetch
  ├─ tts-generator (audio.mp3)
  ├─ npx remotion render → out.mp4
  └─ update calendar
```

## Pré-requisitos (halt se faltar)

Para `clients/<nome>/campaigns/<campaign>-assets/video/<slug>/`:

1. `props.json` — produzido pelo `remotion-builder`
2. `audio-script.json` — produzido pelo `remotion-builder`
3. `assets/README.md` — lista de assets esperados (provided/to-fetch/to-record)
4. **Todos os assets `provided` e `to-record` devem estar em `assets/`** — se algum `to-record` está pendente, halt e diga ao usuário gravar primeiro
5. **Env vars de TTS configuradas:** `ELEVENLABS_API_KEY` (ou provider alternativo)

Se algum input falta, pare e oriente:
- Sem `props.json` → "Rode `remotion-builder` no roteiro primeiro"
- Sem assets `to-record` → "Grave os assets faltantes e ponha em `assets/`. Lista: <list>"
- Sem env var → "Configure `ELEVENLABS_API_KEY` no shell (ou troque provider no audio-script.json)"

## Passo 1 — Fetch de assets `to-fetch`

Leia `assets/README.md`. Para cada asset marcado `to-fetch` (com URL pública):

```bash
curl -sL <URL> -o assets/<filename>
```

Valida que arquivo baixou (size > 0, content-type correto). Se falhar, halt e reporta.

Marca como `provided` no README após download bem-sucedido.

## Passo 2 — Gerar áudio via TTS

Invoque a skill `tts-generator` deste plugin. Ela lê `audio-script.json`, chama a API TTS configurada, e produz:
- `audio.mp3` (single track mixada)
- `audio-segments/L01.mp3, L02.mp3, ...` (segments individuais pra debug)
- `audio-meta.json` (timing real de cada segment)

Se `audio.mp3` já existe E hash do audio-script.json não mudou desde última geração, **pule este passo** (cache hit). Se script mudou, regenere.

Após gerar, verifique:
- `totalDurationSec` do audio-meta.json ≤ `duration` do props.json (já validado pela skill, mas confira)
- Se passa por > 2s, halt e sugere encurtar roteiro

## Passo 3 — Reconciliar timing áudio↔slide (OBRIGATÓRIO)

> **Por que obrigatório:** `props.json` é estimado pelo `remotion-builder` em words/segundo. TTS real **sempre** drifta — algumas frases falam mais rápido, outras mais lento, e o drift acumula. Sem reconciliar, o card "PAUSA" cai 4s antes do narrador dizer "pausa", o card de CTA aparece quando a voz ainda está no item 3. Pular este passo é a causa #1 de vídeo dessincronizado.

Reconcilia **três classes de timing** no `props.json`:

### 3a. Captions (caption por segmento de áudio)

Para cada item em `captions[]`, match por `id` no `audio-meta.json.segments[].id` e sobrescreva:
- `fromSec ← segment.startSec`
- `toSec ← segment.endSec`

Captions sem `id` correspondente no audio-meta: deixa como está + warn.

### 3b. Cards / Blocks / Chapters / Brollslots (estrutura visual)

Cards têm IDs próprios (`C01-cold-open`) que **não batem** com IDs de segmento de áudio (`L01`). A âncora correta é o campo `card.audioSegmentId` (ou `card.audioSegmentIds: ["L05", "L06", "L07"]` se o card cobre vários).

Algoritmo por card:
1. Se `card.audioSegmentId` existe → `fromSec ← audioMeta.segments[id].startSec`
2. Se `card.audioSegmentIds` (array) existe → `fromSec ← segments[first].startSec`, `toSec ← segments[last].endSec`
3. Se NENHUM dos dois existe → fallback proporcional:
   - Calcule `scale = audioMeta.totalDurationSec / props.durationSec` (drift global)
   - Aplique: `card.fromSec *= scale`, `card.toSec *= scale`
   - Avise no report: "Card `<id>` reconciled by global scale (no audioSegmentId anchor). Considere adicionar `audioSegmentId` no remotion-builder pra precisão."

Aplique a mesma lógica a `blocks[].blockStartSec`, `chapters[].startSec`, `brollSlots[].fromSec/.toSec`.

### 3c. Fechar gaps entre cards

Depois do passo 3b, garanta que `cards[i].toSec === cards[i+1].fromSec` (sem gaps, sem overlaps que cortem o card anterior). Estratégia:
- Se gap < 0.3s → estende `cards[i].toSec` até `cards[i+1].fromSec`
- Se overlap → encurta `cards[i].toSec` pra bater com `cards[i+1].fromSec`
- Último card: `cards[N-1].toSec ← audioMeta.totalDurationSec`

### 3d. Persistir

Salve `props.json` atualizado. Mantenha backup em `props.json.bak`.

Atualize também `props.durationSec` (ou `props.duration`) pra `Math.ceil(audioMeta.totalDurationSec)` — assim o `calculateMetadata` do template gera o número certo de frames.

### Validação final do passo 3

Após reconciliar, verifique:
- ✅ Toda caption tem `fromSec < toSec`
- ✅ Cards são monotônicos: `cards[i].toSec === cards[i+1].fromSec`
- ✅ `cards[N-1].toSec ≈ audioMeta.totalDurationSec` (±0.1s)
- ✅ Nenhum `fromSec` ou `toSec` ficou negativo ou NaN

Se qualquer falhar, halt + reporte qual card/caption + sugira: "regenere props.json via `remotion-builder` certificando que cada card tem `audioSegmentId(s)`."

## Passo 4 — Render Remotion

Estrutura final do diretório do vídeo antes do render:

```
<slug>/
├── script.md
├── props.json              ← atualizado no passo 3
├── audio-script.json
├── audio.mp3               ← criado no passo 2
├── audio-segments/
├── audio-meta.json
└── assets/
    ├── README.md
    └── (todos provided)
```

Execute o render no diretório de templates do plugin:

```bash
cd <path-to-plugin>/templates

# Garante deps (silencia se já instaladas)
npm install --silent

# Renderiza usando a composition correspondente ao template do props.json
npx remotion render \
  src/Root.tsx \
  <CompositionId> \
  <slug>/out.mp4 \
  --props=<slug>/props.json \
  --concurrency=2
```

Onde:
- `<CompositionId>` = `props.template` do props.json (ex: `SplitScreenComparison`)
- `--props` passa o props.json inteiro pro Remotion
- `--concurrency=2` evita burnar máquina (ajustável)

**Render rodando em background.** Tempo esperado: 2-3x duração do vídeo no M1 Mac (ex: vídeo 75s → render 2-4min).

Monitore stdout. Se erro, reporte:
- Falta de TSX template → "Template X não existe em templates/src/compositions/. Crie ou troque template no props.json."
- Asset missing → "Asset Y referenciado mas não está em assets/. Veja Passo 1."
- Audio sync issue → "Audio total excede duração. Ver Passo 2."
- Font fallback (Headless Chromium loga "font Montserrat not found") → o `src/shared/fonts.ts` deve estar importado em `Root.tsx`. Se faltou, adicione `import "./shared/fonts";` no topo do Root.tsx.

## Passo 5 — Validar MP4 produzido

```bash
ffprobe -v error -show_format -show_streams <slug>/out.mp4
```

Confira:
- Duração ≈ `props.duration` (±0.5s)
- Resolução = `props.width x props.height`
- Audio stream presente E sincronizado
- File size > 1MB (vídeo válido)

Se algum check falha, reporte e mantenha `out.mp4` (não delete — pode ser debugado).

## Passo 6 — Atualizar calendar

Atualize `clients/<nome>/campaigns/<campaign>-calendar.md`:

| Asset | Status antes | Status depois |
|-------|--------------|---------------|
| `<slug> video` | `assets-pending` ou `script-ready` | `rendered <YYYY-MM-DD HH:MM> — <slug>/out.mp4 (X seconds, Y MB)` |

## Passo 7 — Resumo de render

Reporte ao usuário:

```markdown
## Render completo — <slug>

**MP4:** `<path completo>/out.mp4`
**Duração:** Xs (target era Ys)
**Tamanho:** X MB
**Resolução:** WxH
**Tempo de render:** Xmin Ys

**Custos TTS (estimativa):**
- ElevenLabs: ~$X.XX (Y chars × $0.30/1k)

**Próximo passo:**
- Preview o MP4 antes de publicar
- Use `/publish` (do plugin marketing) pra agendar/publicar no canal-alvo
- Se quiser regenerar com tweaks: edite props.json ou roteiro → `/render-video <slug>` de novo (cache de audio será reusado se script.md não mudou)
```

## Configuração — providers TTS suportados

Default = ElevenLabs. Override por `provider` no audio-script.json:

| Provider | Env var | Quando usar |
|----------|---------|-------------|
| `elevenlabs` (default) | `ELEVENLABS_API_KEY` | Voice work de alta qualidade — marketing, brand video |
| `openai` | `OPENAI_API_KEY` | Quando ElevenLabs não disponível, qualidade aceitável |
| `cartesia` | `CARTESIA_API_KEY` | Pipelines volume-heavy (custo 5x menor) |

## Regras de ouro

1. **Nunca delete o `out.mp4` automaticamente.** Mesmo se render falha parcial, mantém pra debug.
2. **Cache de audio.** Hash do audio-script.json determina cache hit. Mude voice/text → regenera.
3. **Render é determinístico.** Mesmo props.json + mesmos assets + mesmo audio = mesmo MP4 bit-exact (idempotência). Útil pra CI eventual.
4. **Nunca publique automaticamente.** `/render-video` só renderiza. Publicação fica com `/publish` do marketing.
5. **Compõe com o marketplace.** Marketing → script → render (este plugin) → /publish. Recruiting (employer brand video) → mesmo fluxo. Career (personal brand) → idem.

## Não faça

- Não pule a validação ffprobe — MP4 corrompido vai pro publish silenciosamente
- Não modifique TSX dos templates inline — se template está errado, fix no template e regenera
- Não chame APIs sem confirmar env var setada — falha com mensagem útil em vez de stack trace
- Não rode `npx remotion render` em paralelo no mesmo cliente — Remotion pode conflitar em cache de output
- Não substitua o `remotion-builder` — se props.json não existe, sai e aponta pra ele
