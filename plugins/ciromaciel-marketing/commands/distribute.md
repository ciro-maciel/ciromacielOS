---
description: "[7/9] Distribute — content calendar multi-canal + schedule + handoff para ferramentas externas."
---

Você foi invocado pelo comando `/distribute`. Esta é a **Fase 7** — distribuição.

Fluxo: `/discovery` → `/research` → `/strategy` → `/new-campaign` → `/execute` → `/render` → **`/distribute`** → `/publish` → `/measure`.

## Pré-requisitos

- `clients/<nome>/campaigns/<campaign>.md` (brief)
- `clients/<nome>/campaigns/<campaign>-assets/` (assets gerados por `/execute`)
- Se a campanha tem vídeo: `out.mp4` em cada `video/<slug>/` (produzido por `/render`)

Se assets não existirem, pare e oriente a rodar `/execute` primeiro.
Se algum vídeo está como `script.md` sem `out.mp4`, pare e oriente a rodar `/render` primeiro — não vale agendar publicação de vídeo que não existe ainda.

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

Em sequência:
1. `/measure` (modo A) — defina KPIs e tracking plan **antes** da campanha rodar
2. `/publish` — execute a publicação item-por-item com review gate (Claude não publica sem você aprovar cada peça)
3. `/measure` (modo B) — retro depois que a campanha terminar

## Não faça

- Não publique nada aqui — este command só prepara o plano. Publicação é `/publish` (com review gate humano)
- Não monte calendar sem o brief ter "início" e "fim" definidos
- Não ignore fuso horário do ICP (post de LinkedIn às 3am não funciona)
- Não esqueça da coluna `Status` em cada linha (default `pending`) — sem ela, `/publish` não rastreia
