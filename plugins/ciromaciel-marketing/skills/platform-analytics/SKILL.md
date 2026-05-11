---
name: platform-analytics
description: >
  Per-platform analytics playbook — what to measure on TikTok, Instagram, Facebook,
  YouTube (longform + Shorts), Google Ads (Search + PMax), Meta Ads, and LinkedIn Ads.
  Includes the metrics that matter, the vanity ones to ignore, B2B/SaaS benchmarks,
  where data lives, and whether MCP servers are available for automated pulls.
  Pure reasoning skill — use alongside `tracking-setup` (instrumentation) and `/report` (recurring reports).
tags: [measurement]
---

# Platform Analytics

The skill that translates "we ran campaigns on TikTok and Meta Ads" into "here's what to look at, what to ignore, and what good looks like." Per-platform playbook.

## When to use

- During `/measure` mode A — to write KPIs per platform (not just abstract TOFU/MOFU)
- During `/report` — to interpret raw numbers
- "What should I track on [platform]?"
- "Is a [metric] of X good or bad?"
- Standalone reference when reviewing platform dashboards

## How to use

Pick the platforms relevant to the campaign and pull the playbook for each. Don't apply YouTube benchmarks to LinkedIn or Meta benchmarks to TikTok — every platform has its own physics.

---

## TikTok (orgânico)

**Where data lives:** TikTok Studio (formerly Creator Center) → Analytics tab. Mobile app has the richest view; web is limited.

**MCP available:** No stable MCP server today. Manual collection or 3rd-party tools (Pentos, Exolyt) for deep analysis.

**Metrics that matter:**

| Metric | Why it matters | Good (B2B/SaaS) |
|--------|---------------|-----------------|
| **Completion rate (avg watch time / video length)** | Single strongest signal — algorithm boosts videos people finish | >50% on a 30s video is solid; >70% is hit territory |
| **For You Page (FYP) %** | % of views coming from FYP (vs Following / Profile) | >70% means algorithm is pushing it |
| **Saves** | Higher intent than likes — viewer wants to find it again | Saves >2% of views is strong |
| **Shares** | Viral coefficient signal | Shares >1% of views is great |
| **Profile visits → follows ratio** | Conversion of curiosity into commitment | >10% is healthy |
| **Link clicks (bio)** | Only attribution channel TikTok gives for free | UTM required — see tracking-setup |

**Vanity to ignore:**
- Total views absolute (TikTok inflates 3s views as "view")
- Likes (cheapest engagement — doesn't predict performance)
- Comments (varies wildly by topic)

**Coleta recomendada:** export weekly screenshot do dashboard. Cole no `/report` ou armazene em `clients/<name>/analytics/tiktok-<period>.md`.

---

## Instagram (orgânico — Reels, Posts, Stories)

**Where data lives:** Instagram Insights (requires Pro/Creator account). Web access via Meta Business Suite is most reliable.

**MCP available:** Limited — Meta has no public MCP for organic IG. Use Meta Business Suite manually.

### Reels

| Metric | Why | Good |
|--------|-----|------|
| **Reach** | Unique accounts exposed | >50% non-followers = algorithm pushing |
| **Saves** | Single best Reel quality signal in 2025 | >3% of reach |
| **Shares** | Re-distribution by viewers | >1.5% of reach |
| **Watch time + replays** | Algorithm input | Higher = boost |
| **Profile visits → follows** | Audience growth from content | >5% of profile visits = strong |

### Posts (carousel / single image)

| Metric | Why | Good |
|--------|-----|------|
| **Saves** | Carousel king — measures information density | >2% reach |
| **Shares** | Viral coefficient | >1% reach |
| **Linha de scroll do carrossel** | Saw slide 1 vs slide 10 | Drop-off <50% from slide 1 to last |

### Stories

| Metric | Why | Good |
|--------|-----|------|
| **Completion rate** | Did they watch to end? | >70% completion = good story |
| **Sticker interactions (poll, quiz, link)** | Active engagement | >5% of viewers |
| **Exits** | Inverse of completion | <30% exits before end |
| **Link clicks** | The conversion event | >1% of viewers |

**Vanity to ignore:**
- Likes on Reels (algorithm doesn't care since 2023)
- Impressions vs reach (reach is the unique count)
- Follower count growth alone — without engagement, hollow

---

## Facebook (orgânico)

**Honest take:** Para B2B e SaaS quase morto em 2025 — só vale como **community/grupos** ou se o ICP é demograficamente Facebook-heavy (eldercare, local services, certain LatAm/India segments).

**Onde olhar (se aplicável):** Meta Business Suite → Page Insights.

**Métricas:**
- Engagement em grupo (posts, comentários por membro/dia)
- Reach orgânico — geralmente <5% dos seguidores (algoritmo morto pra Pages)

**Recomendação:** se a campanha tem Facebook orgânico, questione a hipótese antes de dedicar tempo. Geralmente o budget vai melhor em Meta Ads do que em orgânico FB.

---

## YouTube — Longform (vídeos 5min+)

**Where data lives:** YouTube Studio → Analytics. Granularidade altíssima.

**MCP available:** YouTube Data API existe; MCP wrappers ainda imaturos. Mode manual em geral.

| Metric | Why | Good (B2B/SaaS) |
|--------|-----|-----------------|
| **CTR (impressions → clicks)** | Thumbnail/title quality | 4-6% médio; >8% great |
| **AVD (Average View Duration)** | Quanto retêm | >50% do vídeo é ótimo |
| **Retention curve** | Onde caem? | Sem queda forte nos primeiros 30s |
| **Subscribers gained per video** | Audience building | Variável; relativo ao tamanho do canal |
| **Watch time total** | Algorithm primary input | Cresceu MoM? |
| **End screen CTR** | Próxima ação | >5% bom |

**Tip:** Retention curve é o mais valioso. Drops grandes em pontos específicos = editar daquele jeito da próxima.

**Vanity:**
- View count absoluto sem context de duration
- Likes (correlato pouco com performance)

---

## YouTube — Shorts (<60s)

**Métrica diferente do longform.** Não compare.

| Metric | Why | Good |
|--------|-----|------|
| **Swipe-away rate (early skip)** | <3s skip = título/hook fraco | <50% |
| **Average view duration** | Pra Shorts curtos isso vira % de completion | >60% |
| **Viewed → swiped to next** | Algorithm input | Higher = boost |
| **Shares** | Viral signal | >1% of views |
| **Subs from Shorts** | Conversão (geralmente baixa) | Aceite que Shorts gera awareness, não subs |

**Honest take:** Shorts é canal de awareness puro. Conversão pra negócio acontece quando viewer migra pro longform ou pro link na descrição.

---

## Google Ads — Search

**Where:** Google Ads + GA4 (configure conversões cross-tool).

**MCP available:** ✅ Google Ads MCP / Google Analytics MCP estão entre os mais maduros. Use em `/report`.

| Metric | Why | Good (B2B/SaaS) |
|--------|-----|-----------------|
| **CPC** | Custo por clique | Depende da vertical — track trend, não absoluto |
| **CTR** | Quality do ad + match | >5% Search; >3% display |
| **Conversion rate** | Click → ação valiosa | >2% Search B2B é healthy; >5% é forte |
| **CPA (cost per acquisition)** | Custo por conversão | Compare com LTV: CPA < LTV/3 |
| **Quality Score** | Multiplicador de tudo (CPC, posição) | 7+ é alvo; abaixo de 5 = re-trabalhar |
| **Impression share** | % do mercado que você toca | Track "lost IS (budget)" e "lost IS (rank)" |
| **Search terms report** | Que queries triggam seu ad | Revise SEMANAL — adicione negatives |

**Vanity:**
- Cliques absolutos (sem CPA = inútil)
- Impressions sem CTR

---

## Google Ads — Performance Max (PMax)

**Honest take:** Black box. Você não vê granularidade por placement (YouTube, Discover, Display, Gmail). Confia ou não.

**Métricas:**
- **ROAS** — o único KPI que realmente faz sentido em PMax
- **Conversion volume** — está escalando?
- **Asset group performance** — algumas dão Best, outras Low

**Requisito:** conversões bem configuradas no GA4 + valor de conversão real (não "1" pra tudo). Sem isso, PMax otimiza pra ruído.

---

## Meta Ads (Instagram + Facebook ads — Ads Manager)

**Where:** Meta Ads Manager + Meta Pixel + Conversions API (CAPI).

**MCP available:** ✅ Meta Marketing API MCP existe (varia em estabilidade). Confirme antes de usar.

| Metric | Why | Good (B2B/SaaS) |
|--------|-----|-----------------|
| **Hook rate (3s views / impressions)** | Stop-the-scroll | >25% é forte |
| **Hold rate (15s / 3s)** | Mantém após hook | >40% bom |
| **CTR (link clicks / impressions)** | Engaja após assistir | >1.5% B2B; >2% B2C |
| **CPM** | Custo por mil impressions | Track trend; benchmark por geo |
| **CPA** | Conversão custosa? | Compare LTV |
| **ROAS** (se e-com / SaaS com receita direta) | Receita / gasto | >2x para começar a escalar |
| **Frequency** | Quantas vezes mesmo user viu | Kill em 2.5+ — fadiga começa |
| **Conversion lift** (com CAPI + bom volume) | Causal vs correlacional | Disponível em accounts maiores |

**Critical setup:** **Conversions API (CAPI)** server-side. Sem isso, iOS 14.5+ e Safari cortam ~30% das conversões rastreadas — você roda otimização cega.

**Vanity:**
- Likes/reactions (na campanha de conversão, ignore)
- Reach sozinha
- "Engagement" sem definir qual

---

## LinkedIn Ads

**Where:** LinkedIn Campaign Manager.

**MCP available:** Pouco maduro. Use Campaign Manager direto.

| Metric | Why | Good (B2B) |
|--------|-----|------------|
| **CTR** | Mensagem ressoa com ICP | >0.5% Sponsored Content; >1% Message Ads |
| **CPL (cost per lead)** | Lead Gen Forms | $50-200 B2B SaaS típico — varia |
| **Lead form completion rate** | Form-to-submit | >10% bom |
| **Member ad CTR** | (orgânico boosted) | >0.4% |
| **Conversion rate (landing pages)** | Quando manda pra externa | >5% B2B é forte |

**Honest take:** LinkedIn é o canal mais caro em CPM, mas o mais barato em **CPL qualificado** pra B2B. Não compare CPC bruto com Meta — compare CPA com ticket médio.

**Tip:** Use Lead Gen Forms over external landing pages quando você quer volume — completion rate é 5-10x maior.

---

## Comparações honestas cross-platform

| Cenário | Canal recomendado | Por quê |
|---------|------------------|---------|
| B2B SaaS, ticket $5k+, ICP é decisor sênior | **LinkedIn Ads + LinkedIn orgânico (founder)** | Targeting por title/company é único; CPL caro mas qualificado |
| B2B SaaS PLG, sub-$500 ACV | **Google Search + content SEO + community** | Intent-based; PLG funciona sem ads pesados |
| Serviço local | **Google Search + Meta Ads (geo-targeted)** | Local search domina; Meta complementa awareness |
| DTC / e-commerce | **Meta Ads (IG + FB) + TikTok orgânico + Google Shopping** | Visual + scale |
| Creator / autoridade | **YouTube longform + LinkedIn + Newsletter** | Long-attention surfaces |
| Comunidade / dev tool | **Twitter/X + YouTube + Reddit + Discord** | Onde devs vivem |

## Princípios

- **Cada plataforma tem física diferente.** TikTok benchmark não serve LinkedIn.
- **Vanity x acionável.** Likes são vanity quase em todo lugar. Saves, completion rate, conversion são acionáveis.
- **Frequency > impressions.** Audiência repetida fadiga em todas as plataformas pagas — kill em 2.5+.
- **Sem CAPI/UTM bem feito, qualquer métrica vira ficção.** Setup primeiro (`tracking-setup`), métrica depois.
- **MCP onde existe é game-changer.** Meta Marketing API e Google Ads MCP automatizam pull semanal. Sem MCP, screenshot/copy-paste no `/report`.

## Output esperado

Quando essa skill é invocada por `/measure` ou `/report`, ela:
1. Confirma quais plataformas estão em jogo
2. Lista as métricas-chave por plataforma (não as 30 — só as 4-6 que importam)
3. Define benchmark/floor por métrica
4. Sinaliza setup necessário (CAPI, UTMs, GA4 conversões)
5. Aponta se MCP automatiza ou se é coleta manual

## Don't

- Não trate todas as plataformas igual — KPIs uniformes mascaram performance
- Não use "engagement rate" sem definir qual (likes? saves? CTR?) — palavra cinza
- Não confie em ROAS sem ter CAPI/server-side tracking — iOS/Safari mascaram
- Não escale ad com frequency 3+ — está queimando dinheiro
