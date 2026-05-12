# ciromaciel-knowledge

Plugin reservado pra conexões MCP (Model Context Protocol) e ferramentas de pesquisa transversais aos outros plugins.

**Filosofia:** os outros plugins (`marketing`, `recruiting`, `career`) consomem conhecimento — este expõe as fontes. Ex: `recruiting/comp-researcher` pode puxar comp data de uma KB que vive aqui; `marketing/icp-researcher` pode usar Notion via MCP daqui.

## Status

🚧 **Esqueleto.** Ainda sem servidores MCP configurados. Não tem agents/skills/commands próprios — só `.mcp.json` quando for ativado.

## Onde plugar MCPs

Crie `.mcp.json` na raiz deste plugin. Exemplo:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "@linear/mcp-server"],
      "env": { "LINEAR_API_KEY": "${LINEAR_API_KEY}" }
    },
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/mcp-server"],
      "env": { "NOTION_TOKEN": "${NOTION_TOKEN}" }
    }
  }
}
```

## Candidatos a adicionar

| MCP | Uso provável | Plugin que mais consome |
|-----|--------------|-------------------------|
| **Linear** | Bugs, roadmap, sprint planning | `development` |
| **Notion** | Knowledge base interna, playbooks | `marketing`, `recruiting` |
| **Google Drive** | Documentos do cliente, briefs históricos | `marketing` |
| **Google Calendar** | Cadência de reviews, weekly review trigger | `career` |
| **Gmail** | Comms log com candidatos/clientes | `recruiting`, `marketing` |
| **riligar-knowledge** | KB próprio (já existe MCP em claude.ai) | Todos |
| **Postgres / D1 / Cloudflare** | Query direto em DBs RiLiGar | `development` |
| **HubSpot / Salesforce** | CRM do cliente — pipeline + leads | `marketing` |
| **Greenhouse / Lever / Gupy** | ATS real do recruiter | `recruiting` |

## Princípios pra adicionar um MCP aqui

1. **Tem que ser transversal.** MCP usado por 1 plugin só deve viver dentro daquele plugin. Aqui é pros que vários plugins consomem.
2. **Credenciais via env var.** Nunca commit de token. Documente as env vars necessárias.
3. **Read-only por default.** Write/delete em sistemas externos requer override explícito por chamada — não como padrão.
4. **Documente o uso esperado.** Ex: "Notion MCP serve pra ler templates de campanha; NÃO pra criar páginas automaticamente."

## Quando NÃO usar

- Você precisa de um agent/skill específico de pesquisa → vive no plugin de domínio (ex: `marketing/icp-researcher`), não aqui.
- MCP só pra um plugin → ponha em `plugins/<aquele-plugin>/.mcp.json`.
