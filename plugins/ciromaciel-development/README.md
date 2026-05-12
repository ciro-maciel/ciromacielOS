# ciromaciel-development

Agentes e skills de desenvolvimento, focados em templates [RiLiGar](https://github.com/riligar) (Vue + Vite) e sites pessoais. Diferente dos plugins de marketing/recruiting/career, **não tem fluxo de fases** — são utilitários pontuais que você dispara quando precisa.

## Skills

| Skill | Quando dispara | O que produz |
|-------|----------------|--------------|
| `riligar-dev-website-seo` | "atualize SEO desse template para [dono]" | Atualiza `index.html` (title, description, og tags, JSON-LD), `useSeoMeta` hook (BASE_URL, default title), todas as chamadas page-level `useSeoMeta`, `sitemap.xml` (URLs + blog slugs), `robots.txt` (sitemap URL) |

## Agents

| Agent | Função |
|-------|--------|
| `seo-auditor` | Audita SEO técnico do projeto (meta tags, structured data, sitemap, robots, OG, performance hints) e devolve checklist priorizado (ALTO / MÉDIO / BAIXO) |

## Commands

| Command | O que faz |
|---------|-----------|
| `/seo-update` | Wrapper interativo para a skill `riligar-dev-website-seo` — pergunta dono/domínio/role/conteúdo e aplica |

## Workflow recomendado ao reaproveitar template

```
1. seo-auditor (estado atual)
   ↓ identifica o que falta / está errado
2. /seo-update
   ↓ aplica via skill riligar-dev-website-seo
3. seo-auditor (confirma)
   ↓ checklist limpo
```

## Quando NÃO usar

- Projeto não é template RiLiGar (Vue/Vite com `useSeoMeta`) → a skill assume estrutura específica. Pra outros stacks, use o `seo-auditor` standalone e aplique manualmente.
- Você quer otimização de performance além de SEO → não tem agent pra Core Web Vitals ainda (próximo candidato).

## Próximos candidatos a adicionar

- `performance-auditor` — Lighthouse + Core Web Vitals + sugestões priorizadas
- `accessibility-auditor` — WCAG 2.1 AA check
- `bundle-analyzer` — descoberta de imports gigantes / code-splitting opportunities
- `dependency-auditor` — vulns + outdated + unused

Hooks: diretório `hooks/` existe mas está vazio. Reservado pra automações de pre-commit/pre-build no futuro (ex: rodar seo-auditor antes de deploy).
