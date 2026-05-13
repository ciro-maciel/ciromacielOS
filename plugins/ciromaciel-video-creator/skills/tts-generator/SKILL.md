---
name: tts-generator
description: >
  Generate voice-over audio (MP3/WAV) from a script via TTS API (ElevenLabs default,
  OpenAI/Cartesia configurable). Takes an `audio-script.json` (produced by remotion-builder)
  and produces `audio.mp3` synced to beat timings. Pure orchestration skill — wraps API call
  + writes file. Pair with `/render-video` command for full pipeline.
tags: [video, audio, tts]
---

# TTS Generator

Gera áudio de voz a partir de um audio-script.json. NÃO escreve script — apenas converte texto → áudio.

**Built for:** pipeline de vídeo automatizado (Remotion). Audio é input do `npx remotion render` — sem ele, vídeo fica mudo ou usa só caption burned-in.

## When to use

- Depois que `remotion-builder` produziu `audio-script.json`
- Antes de `/render-video` rodar o Remotion render
- Quando precisa regenerar VO porque o roteiro mudou

## Input obrigatório

`clients/<nome>/campaigns/<campaign>-assets/video/<slug>/audio-script.json`

Schema:
```json
{
  "voice": "<provider-specific voice ID>",
  "language": "en-US | pt-BR | etc",
  "provider": "elevenlabs | openai | cartesia",
  "lines": [
    { "id": "L01", "fromSec": 0, "text": "..." },
    ...
  ],
  "settings": {
    "stability": 0.5,
    "similarityBoost": 0.75,
    "style": 0
  }
}
```

## Output

```
<slug>/
├── audio.mp3                 ← arquivo final, mixado, single track
├── audio-segments/           ← segmentos individuais (debug/regen)
│   ├── L01.mp3
│   ├── L02.mp3
│   └── ...
└── audio-meta.json           ← timing real de cada segment + duração total
```

`audio-meta.json` schema:
```json
{
  "totalDurationSec": 75.3,
  "segments": [
    { "id": "L01", "startSec": 0, "endSec": 4.2, "durationSec": 4.2, "file": "audio-segments/L01.mp3" },
    { "id": "L02", "startSec": 4.5, "endSec": 12.1, "durationSec": 7.6, "file": "audio-segments/L02.mp3" }
  ]
}
```

Pequeno gap (0.2-0.5s) entre segments evita corte abrupto. Se total ultrapassar `duration` do props.json, halt e alerta — precisa script mais curto OU duração maior.

## Provider config (env vars necessárias)

| Provider | Env vars | Custo aprox |
|----------|----------|-------------|
| ElevenLabs (default) | `ELEVENLABS_API_KEY` (obrigatória) + `ELEVENLABS_VOICE_ID` (opcional — fallback default) | $0.30 / 1k chars |
| OpenAI | `OPENAI_API_KEY` + `OPENAI_TTS_VOICE` (opcional) | $15 / 1M chars |
| Cartesia | `CARTESIA_API_KEY` + `CARTESIA_VOICE_ID` (opcional) | $0.06 / 1k chars (cheaper) |

Default = ElevenLabs (melhor qualidade pra voice work em 2026). Override por `provider` no audio-script.json.

### Convenção de resolução de voice

Pra cada line do audio-script.json, o voice usado é resolvido nessa ordem:
1. `line.voiceOverride` (se setado per-line — raro)
2. `audio_script.voice` (top-level config)
3. Env var do provider (`ELEVENLABS_VOICE_ID`, etc.)
4. Hardcoded default razoável do provider (ver tabela abaixo)

Isso permite ao usuário ter um voice padrão exportado no shell (`export ELEVENLABS_VOICE_ID=...`) e o `remotion-builder` pode omitir `voice` do audio-script.json quando o user já tem um default global.

### Segurança — API keys nunca em arquivo

- **NUNCA** escreva API key em `audio-script.json`, `props.json`, ou qualquer arquivo do repo
- API key vive APENAS em env var do shell do usuário (`~/.zshrc` ou `~/.bash_profile`, gitignored)
- Se key vaza (commited acidentalmente, postada em chat, etc.) → rotacione no dashboard do provider imediatamente
- Voice ID é seguro persistir — é só identificador, não dá acesso à API

## Voice IDs por provider (defaults razoáveis)

### ElevenLabs (2026)
| Voice ID | Idioma | Estilo |
|----------|--------|--------|
| `pNInz6obpgDQGcFmaJgB` | en-US | Professional male, neutral |
| `EXAVITQu4vr4xnSDxMaL` | en-US | Professional female, warm |
| `21m00Tcm4TlvDq8ikWAM` | en-US | Conversational male |
| (configurar PT-BR via voice clone ou multilingual model) | pt-BR | — |

Use sempre `eleven_multilingual_v2` model pra PT-BR ou EN com tom natural.

### OpenAI TTS
- `alloy` (neutral), `echo` (male), `fable` (UK), `onyx` (deep male), `nova` (female), `shimmer` (warm female)

### Cartesia
- Voice catalog: cartesia.ai/voices

## Pipeline de geração

```python
# pseudo-código — implementação real fica no /render-video command
for line in audio_script["lines"]:
    audio_bytes = call_tts_api(
        text=line["text"],
        voice=audio_script["voice"],
        language=audio_script["language"]
    )
    write(f"audio-segments/{line['id']}.mp3", audio_bytes)
    measured_duration = ffprobe(f"audio-segments/{line['id']}.mp3")
    record_meta(line["id"], line["fromSec"], measured_duration)

# Concatena com gaps de 0.3s
mix_segments_to_single_mp3("audio.mp3")
write_meta("audio-meta.json")
```

Implementação real: Node ou Python script invocado pelo `/render-video` command — esta skill define o contrato.

## Validações

1. **Total duration ≤ props.json duration** — se passa, halt
2. **Cada line.text ≤ 500 chars** (limite de qualidade TTS por chunk)
3. **Sample rate fixo (44.1kHz)** pra compatibilidade Remotion
4. **Format MP3 192kbps** ou WAV (Remotion aceita ambos; MP3 menor)

## Quando falhar

- API key não configurada → halt com mensagem clara qual env var setar
- Quota da API exausta → halt + sugere trocar provider
- Idioma não suportado pelo voice → halt + sugere voice multilingual
- Total duration excede → halt + sugere encurtar roteiro ou usar voice mais rápida (rate up no provider)

## Princípios

- **Determinístico quando possível.** Mesma config = mesmo áudio. ElevenLabs adiciona um pouco de variação por padrão — desabilitar via `temperature: 0` se quiser bit-exact.
- **Caching.** Se text + voice + provider iguais ao gerado antes, reusa segment sem re-chamar API. Cache em `audio-segments/.cache/<hash>.mp3`.
- **Multi-provider config.** Não amarra ao ElevenLabs — provider trocável por linha (caso queira voice X pra hook e voice Y pro CTA).
- **Caption-audio sync.** O `audio-meta.json` é input pro Remotion ajustar caption timing às durações REAIS do TTS (que variam vs estimativa do roteiro).

## Não faça

- Não inventa text — só processa o que está em audio-script.json
- Não escolhe voice sem confirmação — usa o configurado ou pergunta
- Não roda o render do Remotion — isso é do command `/render-video`
- Não deleta cache sem aviso — pode recomeçar pipeline custosa
