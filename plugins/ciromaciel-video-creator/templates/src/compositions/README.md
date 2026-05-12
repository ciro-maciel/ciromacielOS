# Compositions — library de templates Remotion

Cada subdiretório aqui é um template parametrizável que o `remotion-builder` agent pode escolher pra produzir um vídeo. Adicionar um novo template = adicionar um diretório + registrar em `../Root.tsx`.

## Templates disponíveis (v0.1)

| Template ID | Descrição | Sweet spot |
|-------------|-----------|------------|
| `SplitScreenComparison` | Comparação visual X vs Y com items animados | 45-90s, LinkedIn vídeo, comparison videos |

## Templates planejados (próximas versões)

| Template | Sprint | Use case |
|----------|--------|----------|
| `ScreenRecordOverlay` | v0.2 | Screen-record + caption + VO. Pra demo/tutorial sem talking-head. |
| `TalkingHead` | v0.2 | Webcam do founder + lower-third + caption. Apenas se intake permite face. |
| `NumberReveal` | v0.2 | Animação de números grandes ("$0 → $47k MRR"). Pra hook viral. |
| `DataVizReveal` | v0.3 | Gráficos animados (linha, bar, donut). Pra blog-video, retrospectiva. |
| `TitleCard` | v0.3 | Capa estática com texto grande. Pra abertura de série/playlist. |
| `CTAFrame` | v0.3 | Frame final padronizado de CTA. Append em qualquer template. |
| `TestimonialCard` | v0.4 | Quote de cliente com avatar + outcome. Pra social proof. |

## Convenções por template

Cada diretório de template deve ter exatamente:

```
<TemplateName>/
├── <TemplateName>.tsx   ← component React principal
├── schema.ts            ← Zod schema dos props (input validation + Remotion Studio editor)
└── README.md            ← contrato visual + props + quando usar + limitações
```

E precisa:

1. Registrar a Composition em `../../Root.tsx`
2. Importar `BrandPalette` de `../../shared/BrandPalette` — NUNCA hardcode cores
3. Importar `BurnedCaption` de `../../shared/BurnedCaption` se tiver caption — NUNCA reimplemente
4. Usar `staticFile()` pra qualquer asset path (imagens, audio) — Remotion exige isso
5. Aspect-ratio responsivo via `useVideoConfig().width/height` — funciona em 16:9, 1:1, 9:16

## Pra adicionar template novo

```bash
mkdir templates/src/compositions/MeuTemplate
# Crie: MeuTemplate.tsx, schema.ts, README.md
# Edite: templates/src/Root.tsx — adicione <Composition id="MeuTemplate" ... />
# Atualize: agents/remotion-builder.md — adicione na tabela "Library de templates"
```

## Princípios

- **Brand-driven, não opinião.** Cores e fontes vêm de `visual-brand.md` do cliente via `props.brand`. Template é estrutura, brand é estilo.
- **Mobile-first.** Toda caption testada em 1080×1920 mental. Font size > 56px pra caption.
- **Caption burned-in sempre.** 85% assistem sem som. BurnedCaption shared component é mandatório quando há VO.
- **Áudio opcional mas suportado.** `voPath` + `musicPath` no schema. Sem áudio renderiza válido (silent).
- **Determinístico.** Mesmo props.json = mesmo MP4 bit-exact. Useful pra CI.
- **Sem chrome.** Templates não incluem logo da marca por default — adicionar via `TitleCard` ou `CTAFrame` no início/fim quando precisa. Marca poluindo todo frame é amadorismo.
