# ciromaciel-setup

Wizard global de configuração do marketplace ciromacielOS. Coleta API keys de todos os plugins, cria diretórios, persiste config — uma vez, vale pra sempre.

**Filosofia:** config é global por usuário, não por projeto. Você configura ElevenLabs uma vez — funciona em qualquer repo que tenha o marketplace instalado. Pausa e retoma sem perder progresso.

## Quickstart

```
/setup
```

Wizard te conduz pelos itens necessários, um por um:
- O que é
- Por que você precisa (qual plugin/feature usa)
- Onde pegar (URL exata)
- Cola/skip/quit a qualquer momento

Salva após cada item — interromper não perde progresso. Re-run `/setup` retoma de onde parou.

## Onde a config vive

```
~/.ciromacielos/
├── .env                    # API keys (chmod 600, NUNCA comitar)
├── config.yaml             # IDs/paths/defaults não-secretos
├── setup-state.yaml        # progresso do wizard
└── README.md               # explica o conteúdo
```

**Por que `~/.ciromacielos/` e não dentro do repo?**
- Config é global — você instala o marketplace em 1 ou mais clones, mas config é uma só
- Não conflita com `.claude/settings.json` (per-project) nem `~/.claude/settings.json` (Claude Code global)
- Backup/restore fácil — copia 1 diretório
- Shell-accessible — sourceia direto no `~/.zshrc`

## Subcomandos

| Comando | O que faz |
|---------|-----------|
| `/setup` | Wizard normal — retoma de onde parou |
| `/setup show` | Lista todos os items + status, sem entrar no wizard |
| `/setup verify` | Valida cada key configurada via API call (sanity check) |
| `/setup rotate <id>` | Rotaciona uma chave específica (ex: `/setup rotate elevenlabs_api_key`) |
| `/setup reset` | Apaga `setup-state.yaml` — recomeça wizard. NÃO apaga `.env`. |
| `/setup uninstall` | Remove `~/.ciromacielos/` inteiro (pede confirmação dupla) |

## O que ele configura (manifest mínima — só o que está em uso hoje)

**Princípio:** manifest tem APENAS itens que algum agent/skill/command realmente consome. Não pré-configura "no caso" — quando um plugin wirar uma integração nova, esse plugin adiciona o item à manifest.

### Core (obrigatório se vai usar o marketplace)

- `default_locale` — `en-US` ou `pt-BR` (writers usam isso pra idioma de output)
- `shell_integration` — adiciona `source ~/.ciromacielos/.env` no `~/.zshrc`

> **Por que NÃO tem path do marketplace nem do sandboxes:** plugins instalados via `/plugin marketplace add` são gerenciados pelo Claude Code runtime — você nunca precisa do path do clone diretamente. `marketplace_path` só faria sentido pra um dev do próprio marketplace, e mesmo assim nenhum command depende dele (resolução é via plugin runtime). Sandboxes são conceito interno de teste dos plugins, não end-user config.

### Por plugin (atual)

| Plugin | Items | Quem consome |
|--------|-------|--------------|
| `ciromaciel-video-creator` | `elevenlabs_api_key`, `elevenlabs_voice_id` | `/render-video` + `tts-generator` skill |
| (demais plugins) | — | Nada com integração API real hoje |

**Por que tão curto:** marketing/recruiting/career/development/knowledge documentam providers (HubSpot, Linear, Cloudflare, etc.) nos respectivos README mas nenhum agent/skill/command FAZ chamadas API a esses providers ainda. Quando um command `/sync-hubspot` ou similar for criado, o plugin adiciona `hubspot_token` à manifest. Não antes — evita você configurar 20 chaves que ninguém usa.

## Auto-import

Antes de pedir, o wizard escaneia:
1. **Memory dir** (`~/.claude/projects/.../memory/*.md`) — credenciais já salvas em sessões anteriores
2. **Env vars do shell** atual
3. **`~/.zshrc` / `~/.bash_profile`** — exports existentes

Se encontra, oferece importar (vs entrar nova vs skip). Não força mudança.

## Como ele te conduz

Exemplo de prompt do wizard pra cada item:

```
🔑 ElevenLabs API Key
   Used by: ciromaciel-video-creator (TTS voz)
   Cost: $0.30/1k chars (~$0.40 por vídeo de 75s)

   Como obter:
   1. Abra: https://elevenlabs.io/app/settings/api-keys
   2. Faça login (ou crie conta — Free tier: 10k chars/mês)
   3. Click "Create new API key"
   4. Copie o valor (começa com 'sk_')

   Cole aqui ou digite [s]kip / [q]uit:
> _
```

Após colar, valida via API call e salva. Se chave parece formato errado, avisa antes de salvar.

## Segurança

- `~/.ciromacielos/` é `chmod 700` (só você lê/escreve)
- `~/.ciromacielos/.env` é `chmod 600`
- Wizard NUNCA ecoa chave inteira no terminal — mostra `sk_dc41...c8d8` (primeiros 4 + últimos 4)
- Wizard NUNCA escreve chave em arquivo do repo do marketplace
- Memory dir é OK pra cache de import, mas `.env` é a fonte da verdade

## Quando rodar

- **Primeira vez** que clona o marketplace
- **Quando muda de máquina** (não tem backup do `~/.ciromacielos/`)
- **Quando ativa um plugin novo** que precisa de chaves que você ainda não configurou
- **Quando rotaciona uma chave** (use `/setup rotate <id>`)

## Quando NÃO rodar

- Já fez setup e não mudou nada — `/setup verify` é suficiente pra sanity check
- Só quer ver o que está configurado — use `/setup show`

## Plugins que dependem deste

Todos os plugins do marketplace devem ler config de `~/.ciromacielos/` (via env var setada pelo `.env`). Não duplicar config em cada plugin.

Convenção: cada plugin lista no seu próprio README quais env vars consome — e referencia este wizard como forma de configurá-las.
