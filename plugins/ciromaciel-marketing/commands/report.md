---
description: "[loop] Report — análise recorrente (semanal/mensal/quarterly) cross-platform com decisões acionáveis. Híbrido: MCP onde existe, paste manual onde não."
---

Você foi invocado pelo comando `/report`. Esta é a fase de **análise recorrente** — diferente do `/measure` modo B (retrospectiva única no fim da campanha).

## Quando rodar

- **Semanal** — durante campanhas ativas, pra ajustar antes que canal degrade
- **Mensal** — review de portfolio (todas campanhas do mês)
- **Quarterly** — review estratégico (revisita o `strategy.md`)

Pergunte logo no início: período? semanal | mensal | quarterly | ad-hoc.

## Pré-requisitos

- `clients/<nome>/campaigns/<campaign>-metrics.md` (KPIs definidos no `/measure` modo A)
- `clients/<nome>/tracking/tracking-checklist.md` (setup confirmado)
- Acesso a dados — via MCP ou paste manual

Se metrics.md ou tracking não existirem, pare e oriente o usuário a rodar `/measure` modo A + `tracking-setup` primeiro.

## Passo 1 — Coleta de dados (híbrido MCP + manual)

Para cada plataforma envolvida na campanha, descubra o caminho de coleta:

### Plataformas com MCP estável (use automaticamente)

| Plataforma | MCP típico | O que puxar |
|-----------|------------|-------------|
| **Google Analytics 4** | GA4 MCP | Sessions, conversions, source/medium, conversion value |
| **Google Ads** | Google Ads MCP | Spend, clicks, conversions, CPA, ROAS, Quality Score |
| **Meta Ads** | Meta Marketing API MCP | Spend, hook rate, CTR, CPA, ROAS, frequency |
| **HubSpot / CRM** | HubSpot MCP | MQL, SQL, deals won, lead source, sales cycle |

Verifique quais MCPs estão disponíveis nesta sessão (cheque tools disponíveis). Se MCP listado, puxe direto.

### Plataformas sem MCP estável (peça paste manual)

| Plataforma | Como pedir |
|-----------|-----------|
| **TikTok orgânico** | "Cole screenshot do TikTok Studio ou os números: completion rate, FYP%, saves, follower growth" |
| **Instagram orgânico** | "Cole do Insights: reach, saves, shares, profile visits → link clicks" |
| **YouTube** | "Cole do YouTube Studio: views, AVD, CTR, retention curve key drops, subs gained" |
| **LinkedIn orgânico** | "Cole do Analytics: impressions, engagement rate, profile views, follower growth" |
| **LinkedIn Ads** | "Cole do Campaign Manager: spend, CTR, CPL, lead form completion" |

Antes de pedir paste, diga ao usuário exatamente quais números você precisa — economize ida-e-volta.

## Passo 2 — Apresentar dados crus em formato estruturado

Para cada plataforma, monte uma seção:

```markdown
### <Plataforma>

**Período:** <range>
**Source:** <MCP automático | paste manual | screenshot>

| Métrica | Valor | vs target (do metrics.md) | vs período anterior |
|---------|-------|---------------------------|---------------------|
| ... | ... | ✅ acima / ❌ abaixo | ▲ +X% / ▼ -X% |
```

Use a skill `platform-analytics` pra interpretar — ela tem benchmarks e sabe o que é vanity vs acionável.

## Passo 3 — Cross-platform roll-up

Depois de cada plataforma, monte a tabela consolidada:

```markdown
## Roll-up cross-platform

| Stage | Total | Per channel |
|-------|-------|-------------|
| **TOFU** (impressions/reach) | <N> | LinkedIn: X · IG: Y · TikTok: Z · Ads: W |
| **MOFU** (clicks/visits/signups) | <N> | ... |
| **BOFU** (leads/demos/trials) | <N> | ... |
| **Won** (revenue/contracts) | <N> | ... |

## North star
**<metric>:** <valor> vs target <target> (<%>)

## Spend
Total: $<X>
Por canal: ...

## Blended CAC
<spend total / customers won>
```

## Passo 4 — Análise narrativa (3×3 simplificado)

```markdown
## O que funcionou esta <semana/mês>
1. <fato + métrica>
2. <fato + métrica>
3. <fato + métrica>

## O que NÃO funcionou
1. <fato + métrica + hipótese de por quê>
2. ...
3. ...

## Surpresas
1. <coisa que não esperava — alto ou baixo>
2. ...
```

## Passo 5 — Decisões propostas

A parte que separa report útil de teatro. Para cada canal:

```markdown
## Decisões por canal (para a próxima semana/mês)

| Canal | Status atual | Decisão proposta | Razão |
|-------|--------------|------------------|-------|
| LinkedIn (founder) | Acima do target | **DOBRAR** — aumentar para 5 posts/semana | Maior leverage por hora investida |
| Meta Ads (IG retargeting) | Frequency 3.2 (queimando) | **PIVOTAR** — pausar e criar 3 novos creatives | Fadiga visível |
| TikTok orgânico | 30% do target em saves | **MATAR** ou **PIVOTAR** | 4 semanas testando, sem sinal |
| Google Ads Search | Quality Score 5 médio | **REFINE** — rewrite ads + landing alignment | Não morto, mas QS limitando CPC |
```

Decisões válidas: **DOBRAR**, **REFINE/PIVOTAR**, **MATAR**, **MANTER** (use MANTER com parcimônia — só se ainda em fase de aprendizado <2 semanas).

## Passo 6 — Próximas ações

Lista nominativa com owner e prazo:

```markdown
## Próximas ações

- [ ] @<owner> · <ação> — until <data>
- [ ] @<owner> · <ação> — until <data>
- [ ] @<owner> · <ação> — until <data>
```

## Passo 7 — Salvar

`clients/<nome>/reports/<periodo>-<YYYY-MM-DD>.md`

Exemplo: `clients/acme/reports/weekly-2026-05-12.md`

## Cadência recomendada

| Período | Frequência | Foco |
|---------|-----------|------|
| **Semanal** | Toda 2ª-feira | Tactical — ajustes na campanha rodando |
| **Mensal** | 1ª semana do mês seguinte | Portfolio — todas campanhas do mês |
| **Quarterly** | Fim de Q | Strategic — revisita `strategy.md`, atualiza canais |

## Diferenciação SaaS vs Serviço

**SaaS:**
- Sempre inclua retention layer no roll-up (DAU/WAU, churn, expansion)
- Quebre conversão por estágio do produto (signup → activated → paid)
- Cohort analysis se há dados pra isso

**Serviço:**
- Foco em **lead quality** (MQL → SQL → Won)
- Sales cycle length por canal (canal lento pode ser canal ruim)
- LTV indireto via referrals — track explicitly

## Princípios

- **Decisão por canal, não "continue tudo".** Cada canal recebe DOBRAR/REFINE/MATAR/MANTER.
- **Compare contra TARGET do metrics.md, não vibes.** Sem target, virou newsletter.
- **MCP onde possível, paste onde não.** Não invente que MCP existe quando não existe.
- **Spend visível.** Sempre mostre o custo de cada canal — sem isso, decisão é cega.
- **3 ações concretas no final.** Sem isso, report vira leitura inútil.

## Don't

- Não rode `/report` sem `metrics.md` definido — vai virar dump de números sem contexto
- Não rode com plataforma cuja CAPI/UTM estão broken — números são ficção (use `tracking-setup` primeiro)
- Não use "engagement rate" agregado cross-platform — não significa a mesma coisa em cada
- Não termine sem decisões e próximas ações — report sem ação = teatro
- Não cite ROAS sem checar que conversion value está real no GA4 (não "1")
