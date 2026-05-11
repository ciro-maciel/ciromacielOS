---
name: tracking-setup
description: >
  Instrumentation checklist before any campaign runs — UTM convention, Meta Pixel + CAPI,
  Google Tag (GTM), GA4 events vs conversions, CRM source field mapping, and dashboard
  consolidation (Looker Studio). Without this setup, every metric downstream is partially
  fictional (iOS/Safari blocking, lost attribution). Pure reasoning skill.
tags: [measurement, setup]
---

# Tracking Setup

The unglamorous, non-negotiable foundation. Without proper tracking, every dashboard lies and every retrospective is vibes.

## When to use

- Before launching ANY new client campaign
- When CPA / ROAS numbers don't make sense
- "Why does Meta say 50 conversions but my CRM shows 18?"
- During `/measure` mode A as a prerequisite checklist

## The 6 layers of tracking (do in order)

```
1. UTM convention       → every link tagged consistently
2. GA4 setup            → events + conversions defined
3. Meta Pixel + CAPI    → client-side + server-side conversion
4. Google Ads conversion tracking
5. CRM source field     → leads tagged with origin
6. Dashboard layer      → roll-up (Looker Studio / Notion / Sheets)
```

Skip any of these = downstream chaos. Especially #3 (CAPI) and #5 (CRM source).

---

## Layer 1 — UTM convention

**Standard:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.

**Convention para o cliente (escreva e fixe — varia muito entre clientes ruins):**

```
utm_source     = platform (lowercase, no spaces)
                 valid: linkedin, instagram, tiktok, facebook, youtube,
                        google, twitter, email, newsletter, podcast, partner

utm_medium     = type of placement
                 valid: cpc, social-organic, social-paid, email, referral,
                        partner, display, video

utm_campaign   = campaign name slug (kebab-case, includes date or quarter)
                 example: q1-2026-saas-launch, 2026-spring-webinar

utm_content    = creative variant (which post, which email in sequence)
                 example: post-01, email-cold-open, hero-headline-v2

utm_term       = optional — used for paid search keyword OR audience segment
                 example: enterprise-decisionmaker, retargeting-30d
```

**Build a utm-template per client:**

Save in `clients/<name>/tracking/utm-template.md`:

```markdown
# UTM template — <client>

## Convention
- source: platform (linkedin | instagram | tiktok | facebook | youtube | google | twitter | email | newsletter | partner)
- medium: cpc | social-organic | social-paid | email | referral | partner | display | video
- campaign: <name>-<YYYY-QQ>
- content: <asset slug>
- term: <audience or keyword>

## Examples
LinkedIn organic post #3 of campaign "saas-launch":
  utm_source=linkedin&utm_medium=social-organic&utm_campaign=saas-launch-2026-q1&utm_content=post-03

Meta IG ad variant B for retargeting:
  utm_source=instagram&utm_medium=social-paid&utm_campaign=saas-launch-2026-q1&utm_content=ad-b&utm_term=retargeting-30d

Cold email #1 to ICP segment A:
  utm_source=email&utm_medium=email&utm_campaign=saas-launch-2026-q1&utm_content=cold-open&utm_term=segment-a
```

**Tool:** Build a UTM builder spreadsheet (Google Sheet com fórmula) ou use Bitly/Rebrandly pro shortened tagged URL.

---

## Layer 2 — GA4 setup

**Events vs Conversions distinction (não confunda):**

- **Event** = anything tracked (page_view, scroll, click)
- **Conversion** = event flagged as valuable (signup, demo_booked, purchase)

**Setup mínimo:**

| Event | When fires | Mark as conversion? |
|-------|-----------|---------------------|
| `page_view` | All pages | No |
| `scroll` (90%) | Long pages | No (engagement signal) |
| `outbound_click` | External link clicked | Sometimes |
| `lead_form_submit` | Form completion | **Yes** |
| `demo_booked` | Calendar booking confirmed | **Yes** |
| `trial_start` | Signup completed | **Yes (SaaS)** |
| `purchase` | Payment completed | **Yes** |
| `video_progress` (25/50/75/100%) | YouTube embed | No (signal) |

**Assign conversion value:**
- Trial start (SaaS) → estimated value (e.g., trial → 20% paid → $X)
- Lead form (B2B services) → average deal × close rate
- Purchase (DTC) → actual revenue

**Sem valor de conversão real, PMax e Meta CBO otimizam pra ruído.**

**Setup checklist:**
- [ ] GA4 property created with cliente domain
- [ ] Google Tag (gtag.js) instalado ou via GTM
- [ ] Enhanced measurement habilitado (scroll, outbound clicks)
- [ ] Cross-domain tracking se múltiplos domínios
- [ ] User-ID se app/SaaS com login
- [ ] Conversions marcadas (mínimo 1, idealmente 3-5)
- [ ] Google Signals (cuidado com privacy)
- [ ] DebugView usado pra verificar antes de ir pro prod

---

## Layer 3 — Meta Pixel + Conversions API (CAPI)

**Por que ambos:** Pixel é client-side (browser). iOS 14.5+ ATT e Safari ITP bloqueiam ~30% dos eventos. CAPI é server-side — não bloqueado.

**Setup:**

1. **Pixel ID** criado em Events Manager
2. **Pixel script** instalado em todas páginas (preferencialmente via GTM)
3. **Standard events** mapeados:
   - `PageView`, `ViewContent`, `Lead`, `CompleteRegistration`, `Purchase`
   - Custom events pra eventos específicos (e.g., `DemoBooked`, `TrialActivated`)
4. **Test Events** verificados em Events Manager
5. **CAPI** configurado via:
   - Native integration (Shopify, WooCommerce, etc.)
   - GTM Server-side container (recommended pra setup custom)
   - Conversions API Gateway (self-hosted)
   - Partner integrations (HubSpot, Zapier)
6. **Event match quality (EMQ)** > 7.0
   - User data passed: email (hashed), phone, fbp, fbc, IP, user_agent, browser ID
   - Quanto mais user data correto, melhor o matching
7. **Aggregated Event Measurement (AEM)** configurado: priorizar 8 eventos máx
8. **Deduplication** entre Pixel e CAPI usando `event_id`

**Checklist crítico:**
- [ ] CAPI ativo (sem isso = perde ~30% de conversões em iOS/Safari)
- [ ] EMQ > 7 em todos eventos
- [ ] Test Events sem warning
- [ ] AEM com 8 eventos priorizados por valor de negócio
- [ ] Deduplication confirmada (não conta evento 2x)

---

## Layer 4 — Google Ads conversion tracking

**Onde rastrear:** ou no Google Ads diretamente (gtag conversion) ou import from GA4.

**Recomendação:** **Import from GA4** — single source of truth.

**Setup:**
1. Link GA4 ↔ Google Ads
2. Import GA4 conversions into Google Ads (selecione as conversões marcadas)
3. **Enhanced Conversions** ligado — passa user-provided data (email hashed) pra melhorar match
4. **Conversion value** importado (mesmo que GA4)
5. **Attribution model** definido (default agora é data-driven — bom pra contas com volume)

**Para PMax especificamente:**
- Não rode PMax sem pelo menos 30 conversions/mês — ele otimiza no escuro
- Use **customer lists** como audience seed pro PMax
- Forneça creative assets variados (não 1 thumbnail só)

---

## Layer 5 — CRM source field mapping

**Sem isso, você não fecha o loop entre marketing e revenue.**

**Setup HubSpot / Pipedrive / Salesforce:**

| Field | Source | Example |
|-------|--------|---------|
| `Original Source Type` | UTM source | `linkedin` |
| `Original Source` | UTM medium | `social-organic` |
| `Original Campaign` | UTM campaign | `saas-launch-2026-q1` |
| `First Touch Source` | First UTM seen | (cookie-based) |
| `Last Touch Source` | Last UTM antes da conversão | (cookie-based) |
| `MQL Date` | When marketing-qualified | timestamp |
| `SQL Date` | When sales-qualified | timestamp |

**Como popular automaticamente:**
- HubSpot Forms — captura UTMs via hidden fields
- Custom JS — parse URL params e popula form fields antes do submit
- Server-side webhook — UTM → CRM via Zapier/Make

**Análise downstream:**
- Conversion rate por `Original Source` (MQL → SQL → Won)
- Revenue attribution por `First Touch` vs `Last Touch`
- Sales cycle length por canal (B2B mais lento por canal frio)

---

## Layer 6 — Dashboard layer (consolidação)

**Stack recomendado pra seed/Series A ou agência pequena:**

| Ferramenta | Pra quê | Cost |
|-----------|---------|------|
| **Looker Studio** | Dashboard cross-platform (GA4 + Google Ads + Sheets) | Grátis |
| **Google Sheets** | Coleta manual + cálculos derivados (CAC, LTV:CAC) | Grátis |
| **Funnel.io / Supermetrics** | Connect TikTok, Meta, LinkedIn ads → Sheets/Looker | $200-1k/mês |
| **Notion** | Report semanal/mensal narrativo | Grátis-$10/mês |

**Para clientes maiores:** Looker Studio Pro / Power BI / Tableau.

**Dashboard mínimo viable (Looker Studio):**

```
Página 1 — Overview
  - North star metric (último período + delta)
  - Funnel: TOFU → MOFU → BOFU (números absolutos + conversion rates)
  - Spend total + CPA blended

Página 2 — Per channel
  - Tabela: channel | spend | leads | CPA | conv rate
  - Trend line de cada channel ao longo do tempo

Página 3 — Per campaign
  - Tabela: campaign | start | end | spend | conv | ROI

Página 4 — CRM funnel (se disponível)
  - MQL → SQL → Demo → Won (por source)
```

---

## Pre-campaign tracking checklist

Antes de qualquer campanha rodar, este checklist deve estar 100% verde:

```markdown
## Tracking checklist — <campaign>

### UTMs
- [ ] utm-template.md atualizado no cliente
- [ ] Todos links da campanha taggeados
- [ ] Bitly/shortener com tracking habilitado (se usado)

### GA4
- [ ] Property está recebendo eventos (DebugView)
- [ ] Conversões marcadas (mínimo 1, ideal 3-5)
- [ ] Conversion value definido (não "1" pra tudo)
- [ ] Cross-domain se aplicável

### Meta Pixel + CAPI
- [ ] Pixel disparando (Pixel Helper extension)
- [ ] CAPI ativo (Test Events sem warning)
- [ ] EMQ > 7
- [ ] AEM priorizado (8 events max)
- [ ] Deduplication via event_id

### Google Ads
- [ ] Linkado com GA4
- [ ] Conversions importadas
- [ ] Enhanced Conversions ativo
- [ ] Conversion value passada

### CRM
- [ ] Hidden UTM fields nos forms
- [ ] Source/medium/campaign populando automaticamente
- [ ] MQL/SQL stages definidos

### Dashboard
- [ ] Looker Studio (ou equivalente) montado
- [ ] Stakeholders com acesso
- [ ] Reporting cadence definida (`/measure` modo A)
```

Se algum item não pode ser feito (cliente não tem CRM, ICP é orgânico-only sem ads), documente o gap explícito em `tracking-gaps.md` — não finja que está medido.

## Output

Save to `clients/<name>/tracking/`:
- `utm-template.md` — convention + examples
- `tracking-checklist.md` — checklist preenchido por campanha
- `tracking-gaps.md` — o que não está medido e por quê

## Princípios

- **CAPI não é opcional em 2025.** Meta sem CAPI = 30% das conversões fantasma.
- **Conversion value real, não "1".** PMax e CBO otimizam pra valor — sem valor, otimizam pra ruído.
- **Source no CRM é a peça que fecha o loop.** Sem isso, ROI fica em "achismo".
- **EMQ > 7 sempre.** Pixel sem user data hashed = matching ruim.
- **Setup uma vez, beneficia para sempre.** A 1 hora gasta agora salva 10 retrospectivas confusas.

## Don't

- Não rode campanha paga sem CAPI / Conversions API — 30% de cego
- Não importe TODAS as conversões GA4 pro Google Ads — escolha 1-3 valiosas (otimiza melhor)
- Não use Bitly sem trackable redirects — perde UTM
- Não esqueça de marcar `event_id` consistente entre Pixel e CAPI — vira double-counting
- Não use ROAS sem entender que ele depende de tracking — ROAS de 5x com tracking ruim pode ser 2x real
