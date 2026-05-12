# ciromaciel-marketing

Fluxo completo de agência de marketing — Discovery → Research → Strategy → Campaign → Execute → Distribute → Measure.

Funciona pra **SaaS/produtos** (PLG, content-led, trial→paid) e **serviços/consultoria** (authority, outbound, case studies). Cada skill bifurca por tipo de oferta.

## Fluxo de 8 fases

```
1. /discovery       → intake estruturado (SaaS / serviço / híbrido)
2. /research        → ICP + concorrentes + keywords + brand voice + visual
3. /strategy        → GTM blueprint 6-12 meses (positioning, pilares, canal-ICP fit)
4. /new-campaign    → brief de campanha pontual dentro da estratégia
5. /execute         → gerar copy (email, social, landing, ads) + crítica
6. /distribute      → content calendar multi-canal com Status pending
7. /measure modo A  → KPIs + tracking plan ANTES de publicar
8. /publish         → publicação item-por-item com review gate humano
   ↓ (campanha roda)
9. /measure modo B  → retrospectiva + decisão por canal (double/kill/pivot)
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
| `/distribute` | 6. Distribution | Calendar + sequencing + Status tracking |
| `/measure` | 7. Measurement | KPIs antes (modo A) / retro depois (modo B) |
| `/publish` | 8. Publishing | Review gate item-por-item — Claude nunca publica sem você aprovar |
| `/report` | Recorrente | Report cross-platform semanal/mensal/quarterly com decisões DOBRAR/REFINE/MATAR/MANTER |

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
| `platform-analytics` | "o que medir em [TikTok/IG/Meta Ads/YT/Google Ads/LinkedIn]?" | Métricas-chave + benchmarks + vanity a ignorar por plataforma |
| `tracking-setup` | "instrumentar antes da campanha" | UTM convention, GA4 events, Pixel+CAPI, Google Ads conv, CRM source, dashboard |

## Agents

### Research / intake
| Agent | Função |
|-------|--------|
| `discovery-interviewer` | Entrevista guiada de 10-15 perguntas (intake) |
| `icp-researcher` | Pesquisa profunda de ICP (personas, dores, canais) |
| `competitor-researcher` | Mapeia 3-5 concorrentes via WebFetch paralelo |
| `keyword-researcher` | Keywords por intent (info/commercial/transactional) |

### Produção de conteúdo (canal-especialistas — entram em `/execute`)
| Agent | Para qual canal | O que produz |
|-------|-----------------|--------------|
| `blog-writer` | Blog / CMS | Post completo com frontmatter SEO, 800-2000 palavras, intent match |
| `linkedin-writer` | LinkedIn orgânico | Post text-only, carrossel (PDF) ou caption de vídeo — hook < 210 chars, CTA pro algoritmo |
| `instagram-writer` | Instagram (feed, Reel, Story, carrossel) | Caption + estrutura de slides/frames + roteiro hint pra delegar a vídeo |
| `video-script-writer` | Reel, Shorts, TikTok, YT, LinkedIn vídeo | Roteiro segundo-a-segundo + B-roll + caption burned-in + handoff de edição (NÃO renderiza) |

### Revisão (entra em `/execute` após produção)
| Agent | Função |
|-------|--------|
| `copy-critic` | Revisa qualquer copy contra brand voice (issues priorizadas, não rewrite) |

> **Princípio:** cada canal tem física diferente (hook window, formato, algoritmo). Mandar tudo pra um copywriter generalista achata o output. `copy-generator` (skill) cobre email/landing/ads/X — onde o formato é mais canonical. Conteúdo orgânico canal-nativo vai pro especialista.

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
  ├── tracking/
  │   ├── utm-template.md                # convention de UTM do cliente
  │   ├── tracking-checklist.md          # 6 layers (UTM, GA4, Pixel/CAPI, Google Ads, CRM, dashboard)
  │   └── tracking-gaps.md               # o que NÃO está medido e por quê
  ├── campaigns/
  │   ├── <campaign>.md                  # /new-campaign (brief)
  │   ├── <campaign>-metrics.md          # /measure modo A
  │   ├── <campaign>-assets/             # /execute (roteado por canal)
  │   │   ├── blog/                      # blog-writer
  │   │   ├── social/
  │   │   │   ├── linkedin-*.md          # linkedin-writer
  │   │   │   └── instagram-*.md         # instagram-writer
  │   │   ├── video/                     # video-script-writer (roteiros, não MP4)
  │   │   ├── emails/                    # copy-generator
  │   │   ├── landing/                   # copy-generator
  │   │   └── ads/                       # copy-generator
  │   ├── <campaign>-calendar.md         # /distribute (com coluna Status)
  │   └── <campaign>-retro.md            # /measure modo B
  └── reports/
      ├── weekly-<YYYY-MM-DD>.md         # /report semanal
      ├── monthly-<YYYY-MM>.md           # /report mensal
      └── quarterly-<YYYY-QQ>.md         # /report quarterly
```

## Workflow recomendado — cliente novo do zero

```
1.  /discovery                    → intake.md
2.  /research                     → research/* (paralelo)
3.  /strategy                     → strategy.md
4.  Setup tracking                → tracking/* via skill tracking-setup
                                    (UTM, GA4, Pixel+CAPI, Google Ads, CRM, dashboard)
5.  /new-campaign                 → campaigns/<nome>.md
6.  /measure (modo A)             → campaigns/<nome>-metrics.md   ← KPIs por plataforma via platform-analytics
7.  /execute                      → campaigns/<nome>-assets/
8.  /distribute                   → campaigns/<nome>-calendar.md  (todos Status=pending)
9.  /publish                      → review item-por-item + publicação real / handoff manual
                                    (atualiza Status no calendar)
    ↓ (campanha roda)
10. /report (semanal)             → reports/weekly-<data>.md       ← durante a campanha
    ↓ (DOBRAR/REFINE/MATAR/MANTER por canal a cada semana)
11. /measure (modo B)             → campaigns/<nome>-retro.md     ← no fim
12. Voltar pra /new-campaign      → próxima campanha do roadmap em strategy.md
```

## Onde a publicação acontece (boundary entre commands)

| Etapa | Quem decide | Onde fica | Quem executa |
|-------|-------------|-----------|--------------|
| Quais canais a empresa investe | `/strategy` | `strategy.md` (canal-ICP fit) | Humano + Claude (skill gtm-strategist) |
| Quais canais essa campanha usa | `/new-campaign` | brief da campanha | Humano + Claude |
| Conteúdo de cada post/email/ad/vídeo | `/execute` | `<campaign>-assets/` | Claude roteia pra agent especialista (`blog-writer` / `linkedin-writer` / `instagram-writer` / `video-script-writer`) ou skill `copy-generator` (email/landing/ads) + crítica de `copy-critic` |
| Quando cada post vai ao ar | `/distribute` | `<campaign>-calendar.md` | Claude (skill content-calendar) |
| **Publicar de fato** | `/publish` | Status no calendar é atualizado | **Humano aprova item-por-item**; Claude executa via MCP ou handoff manual |

**Princípio:** Claude nunca publica em nome do cliente sem aprovação explícita por item. Aprovação global "publica tudo" não vale — cada peça individual.

## Workflow — cliente em andamento (pular fases já feitas)

Cada command verifica os arquivos que precisa e pula só se já existem. Você pode entrar direto em qualquer fase desde que os pré-requisitos estejam preenchidos.

Ex: se você já tem `intake.md` e `research/SUMMARY.md` mas quer pular `/strategy` (já existe), rode direto `/new-campaign`.

## Como o measure funciona em camadas

Medir bem é **3 skills + 1 command** trabalhando junto:

| Camada | O que faz | Onde |
|--------|-----------|------|
| **1. Setup** | UTM, GA4, Pixel+CAPI, Google Ads conv, CRM source, dashboard | skill `tracking-setup` |
| **2. KPIs por plataforma** | O que medir em TikTok/IG/Meta Ads/YT/Google Ads/LinkedIn | skill `platform-analytics` |
| **3. Frame estratégico** | North star, floor, decision gates, modo A (pré) / modo B (pós) | skill `metrics-framework` |
| **4. Análise recorrente** | Report semanal/mensal/quarterly com decisões | `/report` |

**Coleta de dados é híbrida:**
- **MCP automatizado** onde existe — Google Analytics, Google Ads, Meta Ads, HubSpot (Claude puxa direto)
- **Paste manual** onde MCP não existe — TikTok orgânico, IG orgânico, YouTube, LinkedIn (cliente cola screenshots/números)

**Princípio inegociável:** sem `tracking-setup` feito (especialmente CAPI + conversion value real), qualquer report é ficção em 30%.

## Princípios do fluxo

- **Profundidade > breadth.** 3-5 concorrentes analisados a fundo, não 20 superficiais. 1 ICP claro, não "todas startups B2B".
- **Decisões, não opções.** Estratégia que oferece 5 alternativas é wishlist. Pick um caminho.
- **KPIs antes da campanha.** Definir métricas depois é torcer pra ter sorte.
- **Cada plataforma tem física diferente.** TikTok benchmark ≠ LinkedIn ≠ Meta Ads. KPIs uniformes mascaram performance.
- **CAPI / server-side tracking não é opcional em 2025.** iOS 14.5+ e Safari ITP cortam ~30% das conversões client-side.
- **Retros com decisão.** Double / kill / pivot por canal — "continuar igual" não é opção.
- **SaaS ≠ Serviço.** Cada skill bifurca. PLG/retention pra SaaS, authority/outbound pra serviço.
