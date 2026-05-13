---
description: "[4/9] New campaign — coleta inputs e gera campaign brief completo (execução pontual dentro da estratégia)."
---

Você foi invocado pelo comando `/new-campaign`.

Execute a skill `campaign-brief-generator` deste mesmo plugin. Antes de começar, confirme com o usuário:

1. Existe brand voice profile do cliente? Se sim, leia primeiro.
2. Existe ICP profile pesquisado? Se sim, leia primeiro.
3. Onde salvar o brief final? (default: `clients/<cliente>/campaigns/<nome>.md`)

Depois siga o playbook em `skills/campaign-brief-generator/SKILL.md` literalmente — fase 0 (intake) até fase 5 (output).

Se brand voice ou ICP estiverem faltando, ofereça rodar:
- Agent `icp-researcher` (deste plugin) — pra mapear ICP
- Skill `brand-voice-extractor` (deste plugin) — pra extrair brand voice

Não pule essas etapas se forem aplicáveis — campanha sem ICP claro vira spray-and-pray.
