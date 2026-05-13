---
description: "[3/9] Strategy — GTM blueprint de 6-12 meses (não campanha pontual). Produz clients/<nome>/strategy.md."
---

Você foi invocado pelo comando `/strategy`. Esta é a **Fase 3** do fluxo de agência.

## Diferença crítica: estratégia ≠ campanha

- **Estratégia (este command)** = blueprint de 6-12 meses. Positioning, pilares de conteúdo, sales motion, canal-ICP fit. Muda raramente.
- **Campanha (`/new-campaign`)** = execução pontual dentro da estratégia. Lança feature, abre segmento novo, etc. Muda toda hora.

Se o usuário pediu "campanha" e veio parar aqui, redirecione para `/new-campaign`.

## Pré-requisitos

Leia, nesta ordem:
1. `clients/<nome>/intake.md` (obrigatório)
2. `clients/<nome>/research/SUMMARY.md` (obrigatório)
3. Artefatos individuais de research conforme precisar

Se algum estiver faltando, pare e oriente o usuário.

## Execução

Execute a skill `gtm-strategist` deste plugin. Ela produz o blueprint completo.

A skill cobre:
- **Positioning** (categoria, ICP-anchor, alternativas)
- **Pilares de conteúdo** (3-5 temas que serão repetidos)
- **Sales motion** (PLG / sales-led / hybrid)
- **Canal-ICP fit** (quais canais primários × ICP)
- **Roadmap de campanhas** (5-8 campanhas no ano, com gatilhos)
- **Capacidade vs ambição** (o que NÃO faremos)

## Saída

`clients/<nome>/strategy.md` — documento vivo, revisado trimestralmente.

## Próximo passo

Sugira `/new-campaign` para executar a primeira campanha do roadmap definido na estratégia.
