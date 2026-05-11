---
description: Fase 6 — Distribute. Content calendar multi-canal + schedule + handoff para ferramentas externas.
---

Você foi invocado pelo comando `/distribute`. Esta é a **Fase 6** — distribuição.

Fluxo até aqui: `/discovery` → `/research` → `/strategy` → `/new-campaign` → `/execute` → **`/distribute`**.

## Pré-requisitos

- `clients/<nome>/campaigns/<campaign>.md` (brief)
- `clients/<nome>/campaigns/<campaign>-assets/` (assets gerados por `/execute`)

Se assets não existirem, pare e oriente a rodar `/execute` primeiro.

## Objetivo

Pegar assets soltos e montar um **plano de publicação concreto**: o que vai onde, quando, por quem. Sem isso, o cliente fica com 30 emails na pasta e ninguém os manda.

## Execução

Execute a skill `content-calendar` deste plugin. Ela produz:

1. **Calendar visual** (tabela semana × canal)
2. **Schedule detalhado** (data + hora + canal + asset + owner)
3. **Sequenciamento** (qual ordem importa — ex: post no LinkedIn ANTES do email outbound pra criar familiaridade)
4. **Handoff por ferramenta** (formato pronto pra Buffer / Hubspot / Smartlead / Mailchimp)

## Diferenciação SaaS vs Serviço

**SaaS**:
- Email cadências automatizadas (welcome, activation, re-engagement)
- Social orgânico contínuo (não one-shot)
- Drip de feature releases

**Serviço**:
- Email outbound em ondas (segmentar lista por ICP segment)
- LinkedIn do fundador + SDR coordenados
- Webinars / lives como gatilho de pico

## Saída

`clients/<nome>/campaigns/<campaign>-calendar.md` — plano publicável.

Opcionalmente, exports prontos:
- `<campaign>-buffer.csv` (social)
- `<campaign>-smartlead.csv` (emails outbound)
- `<campaign>-mailchimp.json` (nurture)

Pergunte ao usuário quais ferramentas ele usa antes de exportar — não gere CSV pra ferramentas que ele não tem.

## Próximo passo

Sugira `/measure` para definir KPIs e template de retrospectiva ANTES da campanha rodar (não depois).

## Não faça

- Não publique nada (você não tem acesso a Buffer/Smartlead) — só prepare
- Não monte calendar sem o brief ter "início" e "fim" definidos
- Não ignore fuso horário do ICP (post de LinkedIn às 3am não funciona)
