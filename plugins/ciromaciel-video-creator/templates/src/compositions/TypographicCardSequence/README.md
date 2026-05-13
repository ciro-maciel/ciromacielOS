# TypographicCardSequence

Sequência linear de N cards tipográficos com corte seco entre eles. Type-first: cada card é uma composição de texto pura, sem photos, gradients ou motion graphics complexa. Sweet spot pra Shorts/Reels de 15-90s onde a tipografia é o protagonista.

## Layout (vertical 9:16 default)

```
┌───────────────────────────────┐
│                               │
│   Card 1 (fromSec → toSec)    │  ← cada card ocupa frame inteiro
│   bg + fg + accent            │  ← corte seco pro próximo
│   layout: hero-number         │
│                               │
└───────────────────────────────┘
        ↓ HARD CUT
┌───────────────────────────────┐
│                               │
│   Card 2 (fromSec → toSec)    │
│   layout: anchor              │
│                               │
└───────────────────────────────┘
        ↓ HARD CUT
   ...captions burned-in (opcional)
```

## Cobertura

Roteiros do plano Campanha 1 careerthesis que pedem esse template:

- shorts-01 (8 âncoras em 60s) — 12 cards
- shorts-02 (escolher uma) — N cards
- shorts-03 (técnica vs gestão) — 7 cards (inclui split-binary)
- shorts-04 (dizer não) — 7 cards
- shorts-06 (valores/personalidade/vocação) — N cards (inclui triple-negation-stack)

## Props (ver schema.ts pra Zod completo)

```typescript
{
  cards: Array<Card>;          // N cards lineares
  brand: ExtendedBrandPalette; // cores + fontes (aceita aliases — ver schema)
  captions: Array<Caption>;    // burned-in opcionais
  audio: { voPath, musicPath, duckMusicUnderVo };
  defaultBg: string;           // fallback se card.bg undefined
  defaultFg: string;           // fallback se card.fg undefined
  defaultAccent: string;       // fallback accent
  captionsBurned: boolean;     // se true, renderiza captions overlay
  transition: { type, durationFrames }; // hard-cut default (0)
}
```

### Card schema (permissivo — todos campos opcionais salvo timing)

```typescript
{
  id?: string;
  // Timing: fromSec+toSec OU fromFrame+toFrame OU atSec+durationSec
  fromSec?, toSec?, fromFrame?, toFrame?, atSec?, durationSec?: number;

  bg?: string;          // ou "background"
  fg?: string;          // ou "textColor"
  accent?: string;      // ou "accentColor"
  layout?: string;      // ver lista abaixo

  // Eyebrow (opcional)
  eyebrow?: string;
  eyebrowStyle?: { weight?, sizePx?, tracking?, uppercase?, color? };

  // Conteúdo (escolher 1 modo conforme layout)
  headlineLines?: string[];                       // múltiplas linhas grandes
  headlineAccentToken?: string;                   // 1 palavra a destacar (primeira linha)
  headlineAccentTokens?: string[];                // 1 palavra por linha
  headline?: string | { text, weight?, sizePx?, tracking?, accentWord?, accentColor?, color?, font? };
  lines?: Array<{ text, weight?, sizePx?, tracking?, accentWord?, accentColor?, color? }>;
  list?: Array<...>;                              // alias de lines pra eyebrow-list
  title?: string;                                 // para anchor layout
  sub?: string | TextObj;                         // subtítulo
  body?: string | TextObj;
  number?: string;                                // pra layout=anchor ("01", "02", ...)
  split?: { left, right, separator, separatorColor, weight, sizePx, tracking };

  // CTA
  url?: string | { text, font?, weight?, sizePx?, color? };
  urlFont?, urlWeight?, urlSize?;

  hairline?: boolean;   // se true, desenha frame hairline 1px
  accentRevealStaggerSec?: number[]; // (reservado p/ v0.2 stagger)
}
```

### Layouts suportados

| Layout                    | Uso                                            | Campos esperados                            |
|---------------------------|------------------------------------------------|---------------------------------------------|
| `hero-number`             | Hook gigante, número/keyword                   | `headlineLines` ou `headline` + `accent`    |
| `eyebrow-title`           | Eyebrow + título grande                        | `eyebrow`, `headlineLines`                  |
| `headline-sub`            | Título + subtítulo                             | `headline`, `sub`                           |
| `body-text`               | Bloco corrido                                  | `headline`, `body`                          |
| `anchor`                  | Card de âncora numerada (número + título+sub) | `number`, `title`, `sub`                    |
| `split-binary`            | X × Y (comparação 1 linha)                     | `split`, `eyebrow?`                         |
| `synthesis`               | Síntese/fórmula                                | `headlineLines`, `headlineAccentTokens`     |
| `cta`                     | Call-to-action com url                         | `headlineLines`, `url`                      |
| `two-line-stack`          | 2 linhas grandes empilhadas (alias)            | `lines`                                     |
| `eyebrow-list`            | Eyebrow + lista vertical                       | `eyebrow`, `list` ou `lines`                |
| `triple-negation-stack`   | 3 linhas de negação                            | `lines` (3 items)                           |
| `centered-display`        | alias de hero-number                           | igual                                       |
| `center` (default)        | Genérico — usa hero layout                     | qualquer                                    |

Layouts não-listados caem em `HeroLayout`.

## Composition config recomendado

```typescript
{
  id: "TypographicCardSequence",
  durationInFrames: 58 * 30,     // ajuste por props.duration
  fps: 30,
  width: 1080, height: 1920      // 9:16 default
}
```

Pra 16:9, use `width: 1920, height: 1080`. Layout é responsivo via `useVideoConfig()`.

## Quando usar

- Roteiro estruturado em N "beats" curtos (5-15s cada)
- Cada beat é uma frase forte ou imagem tipográfica
- Sem screenshots, sem talking-head, sem b-roll
- Aspecto vertical (Shorts/Reels/TikTok) ou horizontal estático

Nao usar quando:

- Precisa screenshare/UI capture (usar `ScreenRecordOverlay` quando existir)
- Precisa face do founder (usar `TalkingHead` quando existir)
- Precisa motion graphics complexa (gráfico animado etc — usar `DataVizReveal`)

## Animação

- **Entre cards:** corte seco (transition.type = "hard-cut").
- **Dentro do card:** "land" subtle — scale 0.98→1.0 + opacity 0→1 em 10 frames.
- **Captions:** fade in/out 100ms via `BurnedCaption` shared component.
- **Music ducking:** automático se `audio.duckMusicUnderVo: true`.

## Brand palette estendido

Schema aceita aliases (ver `schema.ts`) — todos opcionais:

- Backgrounds: `bgPrimary`, `bgLight`, `bgDark`, `bgInverse`, `bgSoft`, `bgSecondary`, `bgElevated`
- Text: `textPrimary`, `textOnDark`, `textOnLight`, `textMuted`, `textSecondary`, `textTertiary`, `textEyebrow`
- Accent: `accentPrimary`, `accentGreen`, `accentNegative`, `accentLink`
- Border: `border`, `borderHairline`
- Fonts: `fontHeading`, `fontBody`, `fontData`, `fontMono`
- Tracking: `trackingHero`, `trackingDisplay`, `trackingEyebrow`, `trackingTight`
- `radius`: number (default 8)
- `principles`: array de strings (informativo apenas)

Componente lê via fallback chains. Builder pode escrever a palette com qualquer dos vocabulários — funciona.

## Constraints de brand voice (hard rules)

- Sem emoji
- Sem ponto de exclamação
- Sem gradients
- Sem pure black (use `#34322D` como dark base)
- Hairlines 1px sempre
- Border radius 8px
- Acento green único por card (idealmente)

## Limitações conhecidas

- N > 15 cards começam a deteriorar legibilidade (cortes muito rápidos) — divide em 2 vídeos
- `accentRevealStaggerSec` declarado no schema mas ainda não implementado (v0.2)
- Captions multi-line funcionam mas podem sobrepor footer da hairline frame
- Sem suporte a image/video dentro do card (esse template é só tipografia — use `LongformCardSequence` pra B-roll slots)

## Exemplo de props.json mínimo

```json
{
  "template": "TypographicCardSequence",
  "duration": 16,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "props": {
    "cards": [
      {
        "id": "C01-hook",
        "fromSec": 0, "toSec": 3,
        "bg": "#34322D", "fg": "#F8F8F8", "accent": "#51CF66",
        "layout": "hero-number",
        "headlineLines": ["8 COISAS", "QUE NINGUÉM", "LARGA"],
        "headlineAccentToken": "8",
        "hairline": true
      },
      {
        "id": "C02-cta",
        "fromSec": 13, "toSec": 16,
        "bg": "#F8F8F8", "fg": "#34322D", "accent": "#51CF66",
        "layout": "cta",
        "headlineLines": ["QUIZ", "NA BIO"],
        "url": "careerthesis.com/quiz-ancora"
      }
    ],
    "brand": {
      "bgPrimary": "#F8F8F8",
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
      { "fromSec": 0, "toSec": 3, "text": "Tem 8 coisas que ninguém larga." },
      { "fromSec": 13, "toSec": 16, "text": "Quiz na bio." }
    ],
    "audio": { "voPath": "audio.mp3", "musicPath": null, "duckMusicUnderVo": true }
  }
}
```
