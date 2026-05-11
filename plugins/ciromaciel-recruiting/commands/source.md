---
description: Fase 2 — Plano de sourcing. Gera Boolean queries, target companies, talent pool tap.
---

Você foi invocado pelo comando `/source`. Fase 2 do funil: captação ativa de candidatos.

Pré-requisitos:
- `clients/<cliente>/jobs/<job-slug>/scorecard.md` deve existir (Fase 1)
- `clients/<cliente>/jobs/<job-slug>/job-description.md` deve existir

Se faltar, peça para rodar `/intake` antes.

Execute a skill `boolean-search-builder` para gerar queries para:
- LinkedIn Recruiter (Boolean search)
- GitHub (para roles técnicos — busca por linguagem + stars + atividade recente)
- Comunidades específicas (Discord/Slack relevantes)
- Talent pool interno (busca em `clients/<cliente>/talent-pool/`)

Para cada canal, especifique:
- **Query exata** (copy-paste ready)
- **Filtros adicionais** (geografia, experiência, atividade)
- **Sinais a procurar** (não só keywords — sinais qualitativos no perfil)
- **Volume esperado** (estimativa rough de candidatos qualificados)

Empresas-fonte:
- 10-20 empresas que provavelmente têm o perfil-alvo
- Razão por empresa (cultura técnica, stack similar, recente layoff, etc.)

Se houver agent `sourcing-researcher` disponível, ofereça delegar a pesquisa profunda de empresas e perfis.

Output em `clients/<cliente>/jobs/<job-slug>/sourcing-plan.md`:
- Boolean queries por canal
- Target companies com razões
- Talent pool matches (se houver)
- Plano de outreach (template de primeira mensagem)
- Meta de volume (quantos contatos para hit do top-of-funnel)

Lembrete: sourcing sem scorecard claro = sniper sem alvo. Recuse rodar se scorecard faltar.
