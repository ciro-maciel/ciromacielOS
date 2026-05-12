# ciromacielOS

Marketplace pessoal de plugins do Claude Code. Agentes, skills, comandos e MCPs reutilizáveis em todos os projetos pessoais e RiLiGar — instale uma vez, use em qualquer repo.

**Filosofia:** cada plugin é um fluxo de agência operacional ponta-a-ponta (não um conjunto solto de prompts). Estado persiste em arquivos no repo do projeto, decisões ficam auditáveis, e cada fase tem command próprio pra você entrar onde precisar.

## Plugins disponíveis

| Plugin | Domínio | Fases | O que faz |
|--------|---------|-------|-----------|
| [`ciromaciel-marketing`](plugins/ciromaciel-marketing/) | Marketing / GTM | 8 (discovery → publish → report) | Agência completa: brand voice, ICP, GTM, campanhas, conteúdo canal-nativo (blog/LinkedIn/Instagram/vídeo), distribuição, tracking, retrospectiva |
| [`ciromaciel-recruiting`](plugins/ciromaciel-recruiting/) | Recrutamento (ATS) | 11 (intake → handoff → analytics) | Agência de recrutamento: scorecard antes de candidato, sourcing, screening, assessment, debrief estruturado, offer calibrado, mitigação de viés embutida |
| [`ciromaciel-career`](plugins/ciromaciel-career/) | Carreira pessoal | 8 (discovery → pivot) | Planejamento de carreira em 5 vetores (skill, rede, marca, saúde, capital) — BHAG 10y, OKRs trimestrais, weekly review. Baseado em pesquisa (Schein, Doerr, Ericsson, Granovetter, Collins, Newport) |
| [`ciromaciel-development`](plugins/ciromaciel-development/) | Dev / templates RiLiGar | Pontuais | SEO, auditorias, scripts pra templates Vue/Vite |
| [`ciromaciel-knowledge`](plugins/ciromaciel-knowledge/) | MCPs / pesquisa | — | Esqueleto pra conexões MCP (Linear, Notion, KB próprio, Drive, etc.) |

## Como usar

### 1. Adicione o marketplace (uma vez por máquina)

```bash
/plugin marketplace add github.com/ciromaciel/ciromacielOS
```

> Substitua pela URL real do repo Git depois de publicar.

### 2. Instale os plugins que quer no projeto atual

```bash
/plugin install ciromaciel-marketing@ciromacielos
/plugin install ciromaciel-recruiting@ciromacielos
/plugin install ciromaciel-career@ciromacielos
/plugin install ciromaciel-development@ciromacielos
/plugin install ciromaciel-knowledge@ciromacielos
```

Escolha só os que fazem sentido — projeto de marketing puro não precisa do `recruiting` nem do `career`.

### 3. Pronto

Agentes aparecem no `Agent` tool, skills auto-disparam por contexto, commands viram `/new-campaign`, `/intake`, `/career-plan`, `/seo-update`. MCPs conectam.

## Como funciona

```
ciromacielOS/                          ← este repo (marketplace)
├── .claude-plugin/
│   └── marketplace.json               ← lista os plugins abaixo
└── plugins/
    ├── ciromaciel-marketing/
    │   ├── .claude-plugin/plugin.json
    │   ├── agents/                    ← especialistas com contexto isolado
    │   ├── skills/                    ← playbooks que auto-disparam
    │   └── commands/                  ← /comandos disparados pelo usuário
    ├── ciromaciel-recruiting/
    ├── ciromaciel-career/
    ├── ciromaciel-development/
    └── ciromaciel-knowledge/
        └── .mcp.json                  ← servidores MCP
```

### Agent vs Skill vs Command — qual usar?

- **Skill** — receita/playbook. Auto-disparada quando o contexto bate com a descrição. Sem contexto isolado. Bom pra procedimentos.
- **Agent** — especialista com janela de contexto própria. Você invoca explicitamente via `Agent` tool. Bom pra tarefas isoladas, paralelismo, e domínios com física própria (ex: LinkedIn vs Instagram vs blog).
- **Command** — slash command (`/foo`) disparado por você. Bom pra workflows que você quer iniciar manualmente e que tocam vários agents/skills.

Regra prática:
- "Quando o user pedir X, faça Y" → **Skill**
- "Pesquise Y em paralelo enquanto eu faço outra coisa" / "este canal tem regras próprias" → **Agent**
- "Quero um atalho `/foo` pra começar esse fluxo" → **Command**

## Convenção de estado por plugin

Cada plugin que orquestra fluxo persiste estado em **arquivos no repo onde foi instalado**:

| Plugin | Diretório raiz | Granularidade |
|--------|----------------|---------------|
| `ciromaciel-marketing` | `clients/<cliente>/` | Por cliente → campanhas → assets |
| `ciromaciel-recruiting` | `clients/<cliente>/jobs/<vaga>/` | Por cliente → vaga → candidatos |
| `ciromaciel-career` | `career/<nome>/` | Por pessoa (geralmente você) |

Vantagem: tudo versionável em git, auditável, e Claude pode entrar em qualquer fase lendo o estado existente em vez de re-perguntar.

## Plugins que combinam

- **`marketing` + `recruiting`** → employer branding, conteúdo LinkedIn sobre vagas, careers page
- **`recruiting` + `career`** → ver o jogo dos dois lados (recrutador e candidato)
- **`marketing` + `development`** → landing pages dos clientes em templates RiLiGar
- **`knowledge`** → MCPs comuns a todos os plugins (knowledge base, calendar, drive)

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
