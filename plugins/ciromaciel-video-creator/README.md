# ciromaciel-video-creator

Pipeline completo de produção de vídeo via **Remotion (React)** + **TTS API**. Pega roteiro humano-legível, escolhe template, gera áudio de voz, renderiza MP4.

**Não é editor de vídeo manual.** É pipeline programático — vídeo é código (React + props), saída é determinística, e cada cliente reusa a mesma library de templates com brand kit próprio.

## Fluxo de 4 fases

```
1. video-script-writer (agent)   → roteiro humano-legível (.md com beats, captions, CTA)
   ↓ humano revisa/aprova
2. remotion-builder (agent)      → props.json + audio-script.json + assets/ list
   ↓ humano fornece assets to-record (VO próprio se quiser, screenshots)
3. /render-video (command)       → fetch assets + TTS via tts-generator + npx remotion render → MP4
   ↓
4. /publish (do plugin marketing) → revisa MP4, agenda/publica no canal
```

Estado persiste em `clients/<nome>/campaigns/<campaign>-assets/video/<slug>/` no projeto onde o plugin é usado.

## Componentes

### Agents
| Agent | Função |
|-------|--------|
| `video-script-writer` | Escreve roteiro segundo-a-segundo (beats, B-roll, caption, CTA, hooks). Output: markdown human-legível pra revisão. **Não renderiza.** |
| `remotion-builder` | Lê roteiro aprovado + visual-brand → escolhe template da library + produz `props.json` + `audio-script.json` + lista de assets needed. **Não escreve TSX**; escolhe e preenche. |

### Skills
| Skill | Função |
|-------|--------|
| `tts-generator` | Wrap de API TTS (ElevenLabs default, OpenAI/Cartesia configurável). Lê `audio-script.json` → produz `audio.mp3` com timing sincronizado aos beats. |

### Commands
| Command | Função |
|---------|--------|
| `/render-video <slug>` | Orquestra o pipeline: fetch assets → tts-generator → `npx remotion render` → valida MP4 → atualiza calendar. |

### Templates (Remotion compositions)
Diretório `templates/src/compositions/`. Cada template = um diretório com `<Name>.tsx` + `schema.ts` + `README.md`.

| Template | v | Use case |
|----------|---|----------|
| `SplitScreenComparison` | 0.1 | "Mosaic vs FinFlow", "Excel vs FinFlow" — comparação visual lado-a-lado com items animados |
| `ScreenRecordOverlay` | 0.2 (planejado) | Screen-record + caption + VO, sem talking-head |
| `TalkingHead` | 0.2 (planejado) | Webcam + lower-third + caption |
| `NumberReveal` | 0.2 (planejado) | Hook viral com número grande animado |
| `DataVizReveal` | 0.3 (planejado) | Gráficos animados pra retrospectivas/reports |
| `TitleCard` | 0.3 (planejado) | Capa estática pra abertura |
| `CTAFrame` | 0.3 (planejado) | Frame final padronizado |

Ver [`templates/src/compositions/README.md`](templates/src/compositions/README.md) pra detalhes.

## Estrutura de output por vídeo

```
clients/<nome>/campaigns/<campaign>-assets/video/<slug>/
├── script.md               # video-script-writer
├── props.json              # remotion-builder
├── audio-script.json       # remotion-builder
├── assets/
│   ├── README.md           # lista provided/to-fetch/to-record
│   ├── mosaic-ui.png       # exemplo
│   └── finflow-ui.png
├── audio.mp3               # tts-generator
├── audio-segments/         # tts-generator (debug)
├── audio-meta.json         # tts-generator (timing real)
└── out.mp4                 # /render-video — FINAL
```

## Quickstart

### 1. Pré-requisitos no projeto

```bash
# Node 18+
node --version

# Env var pra TTS (default ElevenLabs)
export ELEVENLABS_API_KEY=sk-...
```

### 2. Gerar roteiro

```
# No Claude Code dentro do projeto:
Use o agent video-script-writer pra escrever um roteiro de LinkedIn vídeo 75s sobre "Mosaic é over-engineered pra Series A".
```

Output: `<campaign>-assets/video/<slug>.md`. Você revisa, aprova, ajusta texto se quiser.

### 3. Build Remotion config

```
Use o agent remotion-builder pra produzir props.json e audio-script.json a partir do roteiro <slug>.md.
```

Output:
- `<slug>/props.json` (template escolhido + props preenchidos do visual-brand)
- `<slug>/audio-script.json` (linhas + timing pro TTS)
- `<slug>/assets/README.md` (lista de assets)

Reporta se algum asset precisa ser fornecido (`to-record`) ou baixado (`to-fetch`).

### 4. Fornecer assets pendentes

Se algum asset é `to-record` (ex: VO da voz do founder, screenshot que requer login), grave/exporte e ponha em `assets/`. Marque como `provided` no README.

### 5. Renderizar

```
/render-video <slug>
```

Command faz:
1. Fetch de assets `to-fetch`
2. Roda `tts-generator` → `audio.mp3`
3. Roda `npx remotion render` → `out.mp4`
4. Valida com `ffprobe`
5. Atualiza `<campaign>-calendar.md` com status `rendered`

### 6. Publicar

`out.mp4` está pronto. Use `/publish` do plugin `ciromaciel-marketing` pra agendar/publicar (ele lê do calendar).

## Custos típicos

| Item | Custo aprox |
|------|-------------|
| TTS (ElevenLabs) — vídeo 75s, ~180 palavras VO | $0.30-$0.40 |
| TTS (OpenAI) — mesmo | $0.02-$0.04 |
| TTS (Cartesia) — mesmo | $0.06-$0.08 |
| Render (local M1 Mac) | grátis, ~2-4 min CPU |
| Render (Cloud — Remotion Lambda, futuro) | $0.01-$0.03 / vídeo |
| Assets fetch | grátis |

Por vídeo: **< $0.50** com ElevenLabs, **< $0.10** com OpenAI/Cartesia.

## Princípios

- **Roteiro é humano-legível antes de virar código.** Sempre revisar `script.md` antes de `/render-video`. Vídeo é caro de regenerar; texto é barato.
- **Library de templates > TSX arbitrária.** `remotion-builder` escolhe da library. Adicionar template novo é mudança intencional, não improvisação por vídeo.
- **Brand-driven.** Cores e fontes vêm do `visual-brand.md` do cliente via `props.brand` — nunca hardcode no template.
- **Caption burned-in sempre.** 85% assistem sem som. Shared `BurnedCaption` component é mandatório quando há VO.
- **Determinístico.** Mesmo props.json + assets + audio = mesmo MP4 bit-exact (idempotência via Remotion).
- **Plugin compõe.** Marketing/Recruiting/Career produzem o roteiro; este plugin renderiza. Mesma library de templates pra todos.

## Plugins que combinam

- **[`ciromaciel-marketing`](../ciromaciel-marketing/)** — produz brief + roteiro via `video-script-writer`, chama `/render-video`, publica via `/publish`
- **[`ciromaciel-recruiting`](../ciromaciel-recruiting/)** — employer branding videos (vagas, day-in-the-life, candidate testimonials)
- **[`ciromaciel-career`](../ciromaciel-career/)** — personal brand videos (career narrative, conference talks)
- **[`ciromaciel-knowledge`](../ciromaciel-knowledge/)** — MCP Drive/Google pra puxar screenshots/assets automaticamente (futuro)

## Quando NÃO usar

- Vídeo precisa de edição complexa não-template (live action multi-cam, color grading manual, motion graphics elaborada) → exporta o roteiro e edita em DaVinci/Premiere manualmente
- Cliente não tem brand kit (`visual-brand.md`) — halt e oriente extrair primeiro
- Restrição da brand de "vídeo só com pessoa real" — Remotion serve mas com `TalkingHead` template (quando existir) e webcam real

## Status & roadmap

| Versão | Status | Entrega |
|--------|--------|---------|
| **v0.1** | ✅ Aqui | 1 template (`SplitScreenComparison`), 2 agents, 1 skill, 1 command, scaffold Remotion. Pipeline definida mas render real ainda não testado end-to-end |
| **v0.2** | ⏳ Próximo | 4 templates adicionais (ScreenRecordOverlay, TalkingHead, NumberReveal, TitleCard) + script Node real que orquestra TTS + render |
| **v0.3** | ⏳ | DataVizReveal + CTAFrame + cache inteligente de TTS + paralelização de renders |
| **v0.4** | ⏳ | Remotion Lambda (render cloud) opcional + TestimonialCard + multi-language templates |
