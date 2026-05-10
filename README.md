# ciromacielOS

Marketplace pessoal de plugins do Claude Code. Agentes, skills, comandos e MCPs reutilizáveis em todos os projetos pessoais e RiLiGar — instale uma vez, use em qualquer repo.

## Plugins disponíveis

| Plugin | O que faz |
|--------|-----------|
| [`ciromaciel-marketing`](plugins/ciromaciel-marketing/) | Marketing/GTM: brand voice, visual identity, campaign briefs, ICP research |
| [`ciromaciel-dev`](plugins/ciromaciel-dev/) | Dev: SEO, performance, auditorias para templates RiLiGar |
| [`ciromaciel-knowledge`](plugins/ciromaciel-knowledge/) | MCPs e ferramentas de pesquisa (Linear, Notion, KB próprio) |

## Como usar

### 1. Adicione o marketplace (uma vez por máquina)

```bash
/plugin marketplace add github.com/ciromaciel/ciromacielOS
```

> Substitua pela URL real do repo Git depois de publicar.

### 2. Instale os plugins que quer no projeto atual

```bash
/plugin install ciromaciel-marketing@ciromacielos
/plugin install ciromaciel-dev@ciromacielos
/plugin install ciromaciel-knowledge@ciromacielos
```

Você pode escolher só os que fazem sentido — projeto de marketing puro não precisa do `ciromaciel-dev`.

### 3. Pronto

Agentes aparecem no `Agent` tool, skills auto-disparam por contexto, comandos viram `/new-campaign`, `/seo-update`, MCPs conectam.

## Como funciona

```
ciromacielOS/                          ← este repo (marketplace)
├── .claude-plugin/
│   └── marketplace.json               ← lista os plugins abaixo
└── plugins/
    ├── ciromaciel-marketing/
    │   ├── .claude-plugin/plugin.json
    │   ├── agents/   ← especialistas com contexto isolado
    │   ├── skills/   ← playbooks que auto-disparam
    │   └── commands/ ← /comandos disparados pelo usuário
    ├── ciromaciel-dev/
    └── ciromaciel-knowledge/
        └── .mcp.json                  ← servidores MCP
```

### Agent vs Skill vs Command — qual usar?

- **Skill** — receita/playbook. Auto-disparada quando o contexto bate com a descrição. Sem contexto isolado. Bom pra procedimentos.
- **Agent** — especialista com janela de contexto própria. Você invoca explicitamente via `Agent` tool. Bom pra tarefas isoladas e paralelismo.
- **Command** — slash command (`/foo`) disparado por você. Bom pra workflows que você quer iniciar manualmente.

Regra prática:
- "Quando o user pedir X, faça Y" → **Skill**
- "Pesquise Y em paralelo enquanto eu faço outra coisa" → **Agent**
- "Quero um atalho `/foo` pra começar esse fluxo" → **Command**

## Adicionando um novo plugin

```bash
mkdir -p plugins/ciromaciel-NOVO/{.claude-plugin,agents,skills,commands}
# crie .claude-plugin/plugin.json (copie de outro plugin como template)
# adicione agents/skills/commands
# registre no .claude-plugin/marketplace.json da raiz
```

## Adicionando uma nova skill em plugin existente

```bash
mkdir -p plugins/<plugin>/skills/<nome-skill>
# crie SKILL.md com frontmatter (name, description) + instruções
```

## Adicionando um novo agente

```bash
# crie plugins/<plugin>/agents/<nome>.md
# frontmatter: name, description, tools
```

## Versionamento

Cada plugin tem sua própria `version` em `plugin.json`. Quando publicar mudanças significativas:
1. Bump da versão do plugin afetado
2. Bump da versão geral em `marketplace.json`
3. Tag Git: `v0.X.Y`

## Licença

Uso pessoal de Ciro Maciel. Não publicar sem revisar.
