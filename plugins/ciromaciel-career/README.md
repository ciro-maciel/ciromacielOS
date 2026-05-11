# ciromaciel-career

Planejamento de carreira denso e baseado em evidência — funciona para júnior, pleno, sênior, líder. Não é coaching genérico: é framework operacional com revisão semanal, métricas e decisões trimestrais.

**Premissa:** carreira é juros compostos de decisões pequenas em 5 vetores (skill, rede, marca, saúde, capital), com revisão honesta semanal e meta clara em 3 horizontes (10 anos / 3 anos / trimestre).

## Fluxo de 8 fases

```
1. /career-discovery   → intake estruturado (estado atual, satisfação, contexto)
2. /career-diagnose    → research de mercado, salário-benchmark, gap analysis
3. /career-vision      → BHAG 10 anos + estratégia 3 anos
4. /career-plan        → OKRs trimestrais em 5 vetores (skill/rede/marca/saúde/capital)
5. /career-execute     → cadência semanal: deep work, prática deliberada, journaling
6. /career-measure     → dashboard pessoal + métricas diárias/semanais/mensais
7. /career-review      → review semanal / mensal / trimestral / anual com decisões
8. /career-pivot       → repositioning: stay / level-up / lateral / leave
```

Estado persiste em `career/<nome>/` no diretório onde o plugin é usado (geralmente seu próprio repo de vida — Notion, Obsidian, ou um repo privado).

## Commands

| Command | Fase | O que faz |
|---------|------|-----------|
| `/career-discovery` | 1. Intake | Entrevista de 20 perguntas em 5 blocos. Produz `intake.md`. |
| `/career-diagnose` | 2. Diagnóstico | Self-knowledge (anchor + personalidade) + market reality (salário, demanda, gap). |
| `/career-vision` | 3. Visão | BHAG 10y + estratégia 3y. Pure reasoning. |
| `/career-plan` | 4. Plano | OKRs trimestrais nos 5 vetores + roadmaps específicos. |
| `/career-execute` | 5. Execução | Setup de cadência semanal — blocos de trabalho, prática deliberada, journaling. |
| `/career-measure` | 6. Medição | Dashboard pessoal com revisão diária/semanal/mensal. |
| `/career-review` | 7. Review | Revisão multi-cadência (semanal, mensal, trimestral, anual) com decisões DOBRAR/REFINE/MATAR/MANTER. |
| `/career-pivot` | 8. Pivot | Decisão estruturada: ficar, subir, lateral, sair. Não emocional. |

## Skills

| Skill | Quando dispara | Fonte teórica |
|-------|----------------|---------------|
| `career-anchor-finder` | "qual minha âncora de carreira?" | **Edgar Schein** — Career Anchors (MIT, 1978-2013) |
| `personality-profiler` | "como minha personalidade impacta carreira?" | **Costa & McCrae** — Big Five / NEO-PI-R; **Barrick & Mount 1991** |
| `bhag-designer` | "qual meu BHAG?" / "visão de 10 anos" | **Jim Collins** — Good to Great, Built to Last |
| `okr-quarterly` | "OKRs do trimestre" | **John Doerr** — Measure What Matters; **Locke & Latham** — Goal Setting Theory |
| `skill-roadmap` | "como evoluo skill X?" / "que skills priorizar?" | **Ericsson** — Peak (deliberate practice); **Lombardo & Eichinger** 70-20-10; **Scott Adams** — skill stacking |
| `study-protocol` | "como estudo de verdade?" | **Dunlosky 2013** — Psych Science PI; **Bjork** — desirable difficulties; **Munger** — lattice of mental models |
| `network-builder` | "como construo rede?" / "CRM pessoal" | **Granovetter 1973** — Strength of Weak Ties; **Dunbar** — 150; **Kram 1985** — mentor functions; **Hoffman** — Start-up of You |
| `personal-brand` | "marca pessoal" / "presença online" | **Tom Peters 1997** — The Brand Called You; **Cal Newport** — career capital |
| `health-protocol` | "saúde / energia base" | **Van Dongen 2003** — sleep deprivation; **Mandsager 2018 JAMA** — VO2máx; **Attia/San Millán** — Zone 2; **Morton 2018** — protein meta-analysis |
| `weekly-review` | "review semanal" / "fechar a semana" | **David Allen** — GTD; **US Army** — After Action Review; **Schön** — Reflective Practitioner |

## Agents

| Agent | Função |
|-------|--------|
| `career-interviewer` | Entrevista de discovery em 5 blocos (20 perguntas). Cava o "por quê", aceita "[a definir]". |
| `market-researcher` | Pesquisa salário-benchmark (Glassdoor, levels.fyi, Coletivo.work, Vagas), demanda de mercado (LinkedIn jobs), requisitos típicos do role-alvo. |
| `mentor-matcher` | Dado o BHAG e gaps, sugere perfis de mentor/sponsor a buscar (não nomes — perfis: cargo, indústria, estágio). |
| `feedback-collector` | Estrutura 360 informal: perguntas para 5-7 pessoas (chefe, pares, subordinados, clientes, mentor) com formato de Radical Candor. |
| `reflection-coach` | Diálogo socrático para journaling mensal/trimestral. Não dá respostas — força a pessoa a pensar. |

## Estrutura de estado

```
career/<nome>/
  ├── intake.md                          # /career-discovery
  ├── self/
  │   ├── anchor.md                      # career-anchor-finder
  │   ├── personality.md                 # personality-profiler
  │   └── values.md                      # /career-diagnose (workshop)
  ├── market/
  │   ├── role-research.md               # market-researcher
  │   ├── salary-benchmark.md            # market-researcher
  │   └── gap-analysis.md                # /career-diagnose
  ├── vision/
  │   ├── bhag.md                        # bhag-designer
  │   ├── strategy-3y.md                 # /career-vision
  │   └── anti-vision.md                 # o que VOCÊ NÃO QUER ser
  ├── plan/
  │   ├── okrs-<YYYY-QQ>.md              # okr-quarterly (1 por trimestre)
  │   ├── skill-roadmap.md               # skill-roadmap
  │   ├── study-cadence.md               # study-protocol
  │   ├── network-plan.md                # network-builder
  │   ├── brand-plan.md                  # personal-brand
  │   └── health-protocol.md             # health-protocol
  ├── execute/
  │   ├── weekly-blocks.md               # template de semana ideal
  │   └── deep-work-log.md               # log de horas de prática deliberada
  ├── dashboard/
  │   ├── metrics.md                     # KPIs pessoais
  │   └── journal-<YYYY-MM>.md           # journal diário (1 arquivo por mês)
  ├── reviews/
  │   ├── weekly-<YYYY-MM-DD>.md         # review semanal
  │   ├── monthly-<YYYY-MM>.md           # review mensal
  │   ├── quarterly-<YYYY-QQ>.md         # review trimestral (fecha OKRs)
  │   └── annual-<YYYY>.md               # carta anual a si mesmo
  ├── feedback/
  │   ├── 360-<YYYY-QQ>.md               # feedback-collector
  │   ├── mentors.md                     # CRM de mentores/sponsors
  │   └── network-crm.md                 # ~100-150 pessoas com cadência
  └── pivots/
      └── decision-<YYYY-MM>.md          # /career-pivot quando dispara
```

## Workflow recomendado — começando do zero

```
1.  /career-discovery              → intake.md
2.  /career-diagnose               → self/anchor.md + personality.md + market/* + gap-analysis.md
3.  /career-vision                 → vision/bhag.md + strategy-3y.md + anti-vision.md
4.  /career-plan                   → plan/okrs-<Q>.md + roadmaps em paralelo
5.  /career-execute                → execute/weekly-blocks.md (template de semana)
6.  /career-measure                → dashboard/metrics.md (define o que medir)
    ↓ (semana roda)
7.  /career-review weekly          → reviews/weekly-<data>.md          ← toda sexta ou domingo
    ↓ (mês roda)
8.  /career-review monthly         → reviews/monthly-<YYYY-MM>.md      ← último dia do mês
    ↓ (trimestre roda)
9.  /career-review quarterly       → reviews/quarterly-<Q>.md          ← fecha OKRs, abre próximos
    ↓ (gatilho: insatisfação, oferta, milestone)
10. /career-pivot                  → pivots/decision-<data>.md         ← quando dispara
    ↓ (ano roda)
11. /career-review annual          → reviews/annual-<YYYY>.md          ← carta a si mesmo
```

## Cadências fundamentais — calendário do ano

| Cadência | O que acontece | Tempo | Quando |
|----------|----------------|-------|--------|
| Diário | Top 3 do dia + journal 5 min | 10 min | Manhã/noite |
| Semanal | GTD weekly review + AAR + métricas | 60 min | Sexta tarde / domingo |
| Mensal | Skills/leitura/rede/saúde recap | 90 min | Último dia do mês |
| Trimestral | Fechar OKRs + abrir próximos + reassess âncora | 1 dia | Mar/Jun/Set/Dez |
| Anual | Carta a si mesmo + próximo BHAG check | 1 fim de semana | Dez/Jan |

Sem **weekly review**, o sistema vira lixo em 3 semanas (David Allen). É a peça mais importante e a mais negligenciada.

## Princípios do plugin

- **Pesquisa > opinião.** Toda skill cita a fonte. Anchor é Schein, OKR é Doerr, hábito é Clear, prática deliberada é Ericsson. Sem isso é coaching de Instagram.
- **Métricas pessoais ou não existe.** "Melhorar inglês" não é meta. "C1 no CAE até 30/jun" é. Drucker: what gets measured gets managed.
- **3 horizontes ou perde foco.** BHAG sem trimestre vira fantasia. Trimestre sem BHAG vira hamster wheel.
- **5 vetores, não só carreira-trabalho.** Skill, rede, marca, saúde, capital. Ignorar saúde aos 30 cobra aos 40.
- **Decisões, não opções.** Plano que oferece 5 caminhos é wishlist. Pick um.
- **Stay/level-up/lateral/leave é decisão estruturada.** Não emocional. `/career-pivot` força os critérios.
- **Paixão segue maestria.** Cal Newport. "Siga sua paixão" é conselho ruim. Construa career capital primeiro.
- **Revisão semanal inegociável.** Resto do sistema desmonta sem isso.

## Workflow — pessoa já com plano (skip fases já feitas)

Cada command verifica os arquivos que precisa. Você pode entrar direto em qualquer fase. Ex: se já tem BHAG e estratégia mas quer abrir OKRs novos, rode direto `/career-plan`.

## Quando NÃO usar este plugin

- Você quer coaching emocional / terapia → procure terapeuta, não LLM.
- Você quer alguém para te dizer o que fazer → o plugin força VOCÊ a decidir.
- Você não vai fazer weekly review → desista antes de começar.
