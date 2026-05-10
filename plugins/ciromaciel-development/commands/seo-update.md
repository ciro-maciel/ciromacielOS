---
description: Atualiza todos os metadados SEO de um template RiLiGar para um novo dono
---

Você foi invocado pelo comando `/seo-update`.

Execute a skill `riligar-dev-website-seo` deste plugin. Pergunte primeiro:

1. Nome completo do dono
2. Domínio final (ou placeholder)
3. Role / tagline
4. Descrição SEO (1-2 frases)
5. URL do LinkedIn
6. Filename da foto (em `public/`)

Depois siga o playbook em `skills/riligar-dev-website-seo/SKILL.md` — fases 1 a 6.

Antes de aplicar mudanças, mostre o **diff resumido** dos arquivos que serão alterados e peça confirmação. Nunca edite `useSeoMeta` hook signature — só BASE_URL e strings default.
