# LongformCardSequence

Versão longform (5-25 min) do `TypographicCardSequence`. Mantém o conceito de cards type-first com corte seco e adiciona estrutura de capítulos, pattern interrupts e B-roll placeholders para edição em pós.

## Layout (horizontal 16:9 default)

```
┌────────────────────────────────────────────────────┐
│                                  CAP. 1 · INTRO    │  ← chapter marker sutil
│                                                    │
│   Card type-first com hairline frame                │
│   ─                                                │
│   Texto grande, accent green único                 │
│                                                    │
│   ─ caption burned-in (overlay) ─                  │
└────────────────────────────────────────────────────┘
```

## Cobertura

- youtube-01 (DECLARADA × OBEDECIDA — 14:30 longform)
- Qualquer roteiro 5-25min que use cards tipográficos como spine + B-roll opcional via slot

## Recursos adicionais sobre TypographicCardSequence

| Recurso              | O que faz                                                    |
|----------------------|--------------------------------------------------------------|
| `blocks[]`           | Capítulos/seções com `blockStartSec` + `blockTitle`          |
| `chapters[]`         | Alias compatível com YouTube chapter markers                 |
| `card.patternInterrupt` | Card especial: bg dark + frase única + silenceTrailSec    |
| `card.silenceTrailSec`  | Trecho de silêncio depois do card (manualmente respeitado) |
| `brollSlots[]`       | Placeholder cinza com label (editor preenche em pós)         |
| `card.isBrollSlot`   | Marca card como slot de b-roll inline                        |
| `showChapterMarkers` | Toggle do marker top-right                                   |
| `items[]` + `leftLabel`/`rightLabel` | Fallback compat com props.json estilo SplitScreenComparison — sintetiza cards anchor automaticamente quando `cards` é vazio |

## Props (ver schema.ts pra Zod completo)

```typescript
{
  cards: Array<LongformCard>;  // type-first cards (mesma shape do TypographicCardSequence + extras)
  blocks: Array<{ blockTitle?, title?, blockStartSec, id?, color? }>;
  chapters: Array<{ title, startSec }>;
  brollSlots: Array<{ id?, fromSec, toSec, label, hint? }>;
  // Compat SplitScreenComparison-style:
  leftLabel?: string;
  rightLabel?: string;
  items?: Array<{ label, left, right, atSec }>;
  // Brand + audio + captions iguais ao TypographicCardSequence
  brand, captions, audio, transition, defaultBg, defaultFg, defaultAccent;
  captionsBurned: boolean;
  showChapterMarkers: boolean;
  durationSec: number;
}
```

### LongformCard fields adicionais (sobre TypographicCard)

```typescript
{
  patternInterrupt?: boolean;     // bg dark forçado + emphase landing
  silenceTrailSec?: number;       // (informativo — VO deve refletir)
  blockId?: string;               // associar card a block específico
  isBrollSlot?: boolean;          // renderiza placeholder ao invés de tipografia
  brollLabel?: string;            // label do b-roll esperado
  // + todos os campos de TypographicCard (layout, headline, sub, etc)
}
```

## Composition config recomendado

```typescript
{
  id: "LongformCardSequence",
  durationInFrames: 870 * 30,    // youtube-01 = 14:30
  fps: 30,
  width: 1920, height: 1080      // 16:9 default — YouTube longform
}
```

## Quando usar

- Vídeo 5-25min onde tipografia é spine + B-roll preenche em pós
- YouTube longform com chapters
- Roteiro estruturado em blocos/seções nomeadas
- Quando precisa de pattern interrupts (pausa, "qual ressoou?", etc)

Não usar quando:

- Vídeo < 90s (use `TypographicCardSequence`)
- Talking-head com lower-third (`TalkingHead` quando existir)
- Comparison side-by-side ortodoxa (use `SplitScreenComparison`)

## Compatibilidade com props.json existentes

O youtube-01 props.json foi escrito num formato híbrido SplitScreenComparison (com `leftLabel`/`rightLabel`/`items[]`). Esse template aceita esse shape: se `cards` estiver vazio mas `items` presente, sintetiza cards anchor automaticamente. Recomendação: builders novos devem usar `cards[]` direto.

## Animação

- **Entre cards:** corte seco (`transition.type: "hard-cut"`)
- **Dentro do card:** land mais suave que TypographicCardSequence — 12 frames (vs 10) com `scale 0.99→1.0`
- **Chapter marker:** estático top-right, opacity 0.55
- **B-roll placeholder:** estático cinza com dashed border + label

## Limitações conhecidas

- B-roll slot renderiza placeholder cinza — editor precisa overlay em pós (CapCut/Premiere)
- `silenceTrailSec` é informativo: o componente não silencia VO automaticamente (TTS deve gerar com pausa)
- Chapter marker pode poluir frames com texto grande — desativar via `showChapterMarkers: false`
- Sem captions chapter-aware (todas no mesmo overlay)
- Layout duplicado com TypographicCardSequence (não import — evita ciclo). Mudança visual precisa ir em ambos.

## Brand voice constraints (hard rules)

- Sem emoji
- Sem ponto de exclamação
- Sem gradients
- Sem pure black (`#34322D` dark base)
- Accent green único por bloco (ideal)
- Hairlines 1px sempre
- Border radius 8px
- Montserrat 500/600/800/950 + JetBrains Mono pra urls/data

## Exemplo de props.json mínimo

```json
{
  "template": "LongformCardSequence",
  "duration": 870,
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "props": {
    "cards": [
      {
        "id": "cold-open",
        "fromSec": 0, "toSec": 15,
        "bg": "#FFFFFF", "fg": "#34322D", "accent": "#51CF66",
        "layout": "split-binary",
        "split": { "left": "DECLARADA", "right": "OBEDECIDA", "separator": "≠" },
        "hairline": true
      },
      {
        "id": "pause",
        "fromSec": 330, "toSec": 338,
        "layout": "hero-number",
        "headlineLines": ["PAUSA"],
        "sub": "qual ressoou até aqui?",
        "patternInterrupt": true,
        "silenceTrailSec": 3
      }
    ],
    "blocks": [
      { "blockTitle": "INTRODUÇÃO", "blockStartSec": 0 },
      { "blockTitle": "8 ÂNCORAS",  "blockStartSec": 210 }
    ],
    "chapters": [
      { "title": "Intro", "startSec": 0 },
      { "title": "8 âncoras", "startSec": 210 }
    ],
    "brollSlots": [
      { "fromSec": 60,  "toSec": 90,  "label": "Foto Schein MIT (1978)", "hint": "preto e branco" }
    ],
    "brand": {
      "bgPrimary": "#FFFFFF",
      "bgDark": "#34322D",
      "textPrimary": "#34322D",
      "textMuted": "#9CA3AF",
      "accentGreen": "#51CF66",
      "borderHairline": "#E5E7EB",
      "fontHeading": "Montserrat",
      "fontMono": "JetBrains Mono",
      "radius": 8
    },
    "captions": [
      { "fromSec": 0, "toSec": 6, "text": "DECLARADA ≠ OBEDECIDA" }
    ],
    "audio": { "voPath": "audio.mp3", "musicPath": null, "duckMusicUnderVo": true },
    "showChapterMarkers": true,
    "durationSec": 870
  }
}
```
