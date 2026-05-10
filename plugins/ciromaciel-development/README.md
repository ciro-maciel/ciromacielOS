# ciromaciel-development

Agentes e skills de desenvolvimento, focados em templates RiLiGar (Vue + Vite) e sites pessoais.

## Skills

| Skill | Quando dispara | O que produz |
|-------|----------------|--------------|
| `riligar-dev-website-seo` | "atualize SEO desse template para [dono]" | Atualiza index.html, useSeoMeta, sitemap, robots |

## Agents

| Agent | Função |
|-------|--------|
| `seo-auditor` | Audita SEO técnico do projeto, devolve checklist priorizado |

## Commands

- `/seo-update` — wrapper interativo para a skill `riligar-dev-website-seo`

## Workflow recomendado ao reaproveitar template

```
1. /seo-update
   ↓ (ou rode antes)
2. Agent seo-auditor — pra ver o estado atual
   ↓
3. Skill riligar-dev-website-seo — aplica os updates
   ↓
4. Agent seo-auditor de novo — confirma que está limpo
```
