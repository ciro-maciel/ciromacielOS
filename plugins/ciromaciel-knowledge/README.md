# ciromaciel-knowledge

Plugin reservado pra conexões MCP (Model Context Protocol) e ferramentas de pesquisa transversais.

## Status

🚧 Esqueleto. Ainda sem servidores MCP configurados.

## Onde plugar MCPs

Edite `.mcp.json` na raiz deste plugin. Exemplo de servidor:

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

- **Linear** — bugs, roadmap
- **Notion** — knowledge base interna
- **Google Drive / Calendar** — já existe MCP oficial Anthropic
- **riligar-knowledge** — KB próprio (já existe MCP, ver Claude.ai)
- **Postgres / D1** — query direto em DBs RiLiGar
