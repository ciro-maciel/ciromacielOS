# SplitScreenComparison

Template Remotion pra comparação visual lado-a-lado (X vs Y) com items animados embaixo. Foi desenhado pra "Mosaic vs FinFlow", "Excel vs FinFlow", "Old way vs new way", "Before vs After".

## Layout

```
┌──────────────────────────────┬──────────────────────────────┐
│  Left label (muted)          │  Right label (accent)        │
│                              │                              │
│  [ left screenshot ]         │  [ right screenshot ]        │
│                              │                              │
│  background: bgPrimary       │  background: gradient        │
│                              │                              │
├──────────────────────────────┴──────────────────────────────┤
│  Item 1      Left value      Right value (accent)           │
│  Item 2      Left value      Right value (accent)           │   ← items fadem em sequência (atSec)
│  ...                                                        │
│  background: bgElevated                                     │
├─────────────────────────────────────────────────────────────┤
│        [ caption burned-in — overlay com fade ]             │
└─────────────────────────────────────────────────────────────┘
```

## Props (ver schema.ts pra Zod completo)

```typescript
{
  leftLabel: string;            // ex: "Mosaic"
  rightLabel: string;           // ex: "FinFlow"
  leftScreenshot: string|null;  // path relativo a public/ — ex: "assets/mosaic-ui.png"
  rightScreenshot: string|null; // idem
  items: Array<{
    label: string;              // ex: "Setup"
    left: string;               // ex: "6 weeks"
    right: string;              // ex: "5 days"
    atSec: number;              // segundo em que o item aparece (com spring animation)
  }>;
  brand: BrandPalette;          // cores + fontes — populado pelo remotion-builder do visual-brand.md
  captions: Array<{
    fromSec: number;
    toSec: number;
    text: string;               // caption burned-in (max ~80 chars por linha pra legibilidade mobile)
  }>;
  audio: {
    voPath: string|null;        // path do MP3 do voice-over (gerado pelo tts-generator)
    musicPath: string|null;     // path da música de fundo (opcional)
    duckMusicUnderVo: boolean;  // se true, abaixa música quando VO toca (default true)
  };
}
```

## Composition config recomendado

```typescript
{
  id: "SplitScreenComparison",
  durationInFrames: 75 * 30,  // ajustar pelo duration do roteiro
  fps: 30,
  width: 1920, height: 1080   // 16:9 default — bom pra LinkedIn vídeo + YouTube
}
```

Pra vertical (9:16 — Reel/Short/TikTok), use `width: 1080, height: 1920`. Componente é responsivo via `useVideoConfig().width/height`.

## Quando usar

✅ Comparação X vs Y com items concretos enumeráveis
✅ Tem screenshots reais ou pode produzir mockups
✅ Duração 45-90s (sweet spot pra LinkedIn vídeo + Reel longo)

❌ Talking-head puro — use `TalkingHead` (quando existir)
❌ Sem screenshots e sem items — vira tela vazia
❌ Comparação > 6 items — fica ilegível, divida em 2 vídeos

## Defaults se props faltam

Defaults realistas pra preview no Remotion Studio (`npm start`). NUNCA renderize com defaults em produção — `remotion-builder` deve popular props do props.json.

## Animações

- **Header + screenshots:** estáticos. Mudança via beats novos (cortes via Sequence).
- **Items:** spring animation (damping 18, stiffness 90) — entram com fade + slight translateY.
- **Captions:** fade in/out 100ms via BurnedCaption shared component.
- **Música:** auto-duck quando VO toca (se `duckMusicUnderVo: true`).

## Limitações conhecidas

- Items > 5 começam a sobrepor — limite hard em 5
- Screenshot aspect rate variável — `objectFit: contain` evita crop mas pode deixar barras pretas
- Sem suporte a vídeo no lugar de screenshot (use captura estática)
- Caption single-line ideal — multi-line funciona mas estraga ritmo

## Exemplo de props.json completo

```json
{
  "template": "SplitScreenComparison",
  "version": "1.0.0",
  "duration": 75,
  "fps": 30,
  "width": 1920,
  "height": 1080,
  "props": {
    "leftLabel": "Mosaic",
    "rightLabel": "FinFlow",
    "leftScreenshot": "assets/mosaic-ui.png",
    "rightScreenshot": "assets/finflow-ui.png",
    "items": [
      { "label": "Setup",   "left": "6 weeks",       "right": "5 days",          "atSec": 30 },
      { "label": "Pricing", "left": "Contact sales", "right": "$499/mo public",  "atSec": 35 },
      { "label": "Trial",   "left": "Demo first",    "right": "Self-serve",      "atSec": 40 },
      { "label": "ICP fit", "left": "Series C+",     "right": "Series A",        "atSec": 45 }
    ],
    "brand": {
      "bgPrimary": "#0A0E1A",
      "bgElevated": "#141A2B",
      "textPrimary": "#F5F7FA",
      "textSecondary": "#8B95B0",
      "accentPrimary": "#3DDC97",
      "fontHeading": "Inter",
      "fontData": "JetBrains Mono"
    },
    "captions": [
      { "fromSec": 0,  "toSec": 3,  "text": "Mosaic is over-engineered for Series A." },
      { "fromSec": 3,  "toSec": 12, "text": "Built for senior CFO + FP&A analyst + 3-person workflow." },
      { "fromSec": 12, "toSec": 30, "text": "Series A has none of those." },
      { "fromSec": 30, "toSec": 60, "text": "Same problem, different scale." },
      { "fromSec": 60, "toSec": 75, "text": "Comment VS for the full comparison." }
    ],
    "audio": {
      "voPath": "audio.mp3",
      "musicPath": null,
      "duckMusicUnderVo": true
    }
  }
}
```
