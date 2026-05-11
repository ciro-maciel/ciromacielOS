# ciromaciel-marketing

Fluxo completo de agência de marketing — Discovery → Research → Strategy → Campaign → Execute → Distribute → Measure.

Funciona pra **SaaS/produtos** (PLG, content-led, trial→paid) e **serviços/consultoria** (authority, outbound, case studies). Cada skill bifurca por tipo de oferta.

## Fluxo de 7 fases

```
1. /discovery       → intake estruturado (SaaS / serviço / híbrido)
2. /research        → ICP + concorrentes + keywords + brand voice + visual
3. /strategy        → GTM blueprint 6-12 meses (positioning, pilares, canal-ICP fit)
4. /new-campaign    → brief de campanha pontual dentro da estratégia
5. /execute         → gerar copy (email, social, landing, ads) + crítica
6. /distribute      → content calendar multi-canal + handoff pra ferramentas
7. /measure         → KPIs antes (modo A) + retrospectiva depois (modo B)
```

Estado persiste em `clients/<nome>/` no repo do projeto que usa o plugin.

## Commands

| Command | Fase | O que faz |
|---------|------|-----------|
| `/discovery` | 1. Intake | Entrevista guiada, produz intake.md |
| `/research` | 2. Research | Orquestra todos os agents/skills de research |
| `/strategy` | 3. Strategy | Blueprint de 6-12 meses, não campanha |
| `/new-campaign` | 4. Brief | Brief de campanha pontual |
| `/execute` | 5. Production | Gera copy + revisa com copy-critic |
| `/distribute` | 6. Distribution | Calendar + sequencing + handoff |
| `/measure` | 7. Measurement | KPIs antes / retro depois |

## Skills

| Skill | Quando dispara | O que produz |
|-------|----------------|--------------|
| `brand-voice-extractor` | "extraia brand voice de [empresa]" | Profile de tom, vocabulário, persona |
| `visual-brand-extractor` | "extraia identidade visual de [site]" | Slide preset CSS + brand config JSON |
| `competitor-analysis` | "analise concorrentes X, Y, Z" | Comparação estratégica em 4 camadas + síntese |
| `gtm-strategist` | "qual é a estratégia GTM?" | Blueprint 6-12m (positioning, pilares, motion) |
| `campaign-brief-generator` | "planeje uma campanha", "GTM para X" | Brief: canais, mensagens, conteúdo, métricas |
| `copy-generator` | "escreva copy de [email/post/landing/ad]" | Múltiplas variações por asset, com variáveis |
| `content-calendar` | "monte calendário de publicação" | Calendar + sequencing + CSVs pra Buffer/Smartlead |
| `metrics-framework` | "defina KPIs" / "rode retrospectiva" | Mode A (pré) / Mode B (pós) |

## Agents

| Agent | Função |
|-------|--------|
| `discovery-interviewer` | Entrevista guiada de 10-15 perguntas (intake) |
| `icp-researcher` | Pesquisa profunda de ICP (personas, dores, canais) |
| `competitor-researcher` | Mapeia 3-5 concorrentes via WebFetch paralelo |
| `keyword-researcher` | Keywords por intent (info/commercial/transactional) |
| `copy-critic` | Revisa copy contra brand voice (issues, não rewrite) |

## Estrutura de estado por cliente

```
clients/<cliente>/
  ├── intake.md                          # /discovery
  ├── research/
  │   ├── SUMMARY.md                     # síntese 1-página
  │   ├── icp-<segmento>.md              # icp-researcher
  │   ├── competitors.md                 # competitor-researcher
  │   ├── keywords.md                    # keyword-researcher
  │   ├── brand-voice.md                 # brand-voice-extractor
  │   └── visual-brand.md                # visual-brand-extractor
  ├── strategy.md                        # /strategy (blueprint 6-12m)
  └── campaigns/
      ├── <campaign>.md                  # /new-campaign (brief)
      ├── <campaign>-metrics.md          # /measure modo A
      ├── <campaign>-assets/             # /execute
      │   ├── emails/
      │   ├── social/
      │   ├── landing/
      │   └── ads/
      ├── <campaign>-calendar.md         # /distribute
      └── <campaign>-retro.md            # /measure modo B
```

## Workflow recomendado — cliente novo do zero

```
1. /discovery                    → intake.md
2. /research                     → research/* (paralelo)
3. /strategy                     → strategy.md
4. /new-campaign                 → campaigns/<nome>.md
5. /measure (modo A)             → campaigns/<nome>-metrics.md  ← define ANTES de rodar
6. /execute                      → campaigns/<nome>-assets/
7. /distribute                   → campaigns/<nome>-calendar.md
   ↓ (campanha roda)
8. /measure (modo B)             → campaigns/<nome>-retro.md
   ↓ (decisão por canal: double / kill / pivot)
9. Voltar pra /new-campaign      → próxima do roadmap em strategy.md
```

## Workflow — cliente em andamento (pular fases já feitas)

Cada command verifica os arquivos que precisa e pula só se já existem. Você pode entrar direto em qualquer fase desde que os pré-requisitos estejam preenchidos.

Ex: se você já tem `intake.md` e `research/SUMMARY.md` mas quer pular `/strategy` (já existe), rode direto `/new-campaign`.

## Princípios do fluxo

- **Profundidade > breadth.** 3-5 concorrentes analisados a fundo, não 20 superficiais. 1 ICP claro, não "todas startups B2B".
- **Decisões, não opções.** Estratégia que oferece 5 alternativas é wishlist. Pick um caminho.
- **KPIs antes da campanha.** Definir métricas depois é torcer pra ter sorte.
- **Retros com decisão.** Double / kill / pivot por canal — "continuar igual" não é opção.
- **SaaS ≠ Serviço.** Cada skill bifurca. PLG/retention pra SaaS, authority/outbound pra serviço.
