---
description: Wizard global de configuração do marketplace ciromacielOS. Coleta API keys de todos os plugins, cria diretórios, persiste em ~/.ciromacielos/. Resumable.
---

Você foi invocado pelo `/setup` — wizard global de configuração do marketplace ciromacielOS.

## Princípio inegociável

Config é **global por usuário**, NÃO por projeto. Vive em `~/.ciromacielos/` e é compartilhada por todos os repos onde o marketplace está instalado. Setup feito uma vez, vale pra sempre. Pode ser interrompido a qualquer momento — ao re-rodar, pula tudo que já foi configurado.

## Layout do config

```
~/.ciromacielos/
├── .env                    # API keys (chmod 600, NUNCA comitar)
├── config.yaml             # IDs/paths/defaults não-secretos
├── setup-state.yaml        # progresso do wizard (o que foi feito)
└── README.md               # explica o que tem aqui
```

`.env` é sourced pelo shell do usuário (linha em `~/.zshrc` que o wizard pode adicionar).

## Passo 1 — Bootstrap do diretório

Antes de qualquer coisa, garanta que `~/.ciromacielos/` existe:

```bash
mkdir -p ~/.ciromacielos
chmod 700 ~/.ciromacielos                # só o user lê/escreve
touch ~/.ciromacielos/.env
chmod 600 ~/.ciromacielos/.env           # só o user lê/escreve
[ -f ~/.ciromacielos/config.yaml ] || cat > ~/.ciromacielos/config.yaml <<'YAML'
# ciromacielOS — non-secret config
# Edits welcome but prefer /setup
version: 0.1
marketplace_path: ~/Documents/ciro-maciel/ciromacielOS
sandboxes_path: ~/Documents/ciro-maciel/ciromaciel-test-sandboxes
default_locale: en-US
YAML
[ -f ~/.ciromacielos/setup-state.yaml ] || cat > ~/.ciromacielos/setup-state.yaml <<'YAML'
# Tracks what /setup has completed. Wizard reads/writes this.
version: 0.1
started_at: null
last_completed_at: null
items: {}
YAML
[ -f ~/.ciromacielos/README.md ] || cat > ~/.ciromacielos/README.md <<'MD'
# ciromacielOS — global config

This directory holds your **global config** for the ciromacielOS marketplace.

- `.env` — API keys. chmod 600. Source it from your shell rc file.
- `config.yaml` — non-secret config (paths, voice IDs, default models).
- `setup-state.yaml` — wizard progress. Don't edit by hand unless you know what you're doing.

To re-run setup at any time:  `/setup`

To inspect a specific key:  `grep KEY_NAME ~/.ciromacielos/.env`

This is gitignored by convention. **Never** include `.env` in any repo.
MD
```

## Passo 2 — Detectar estado existente

Leia `~/.ciromacielos/setup-state.yaml` e enumere quais `items.<id>.status` estão `done` ou `skipped`.

Também **escaneie fontes existentes** pra auto-import:
1. **Memory dir** (`~/.claude/projects/.../memory/`) — credenciais já salvas por sessões anteriores (ex: ElevenLabs)
2. **Env vars do shell atual** — `printenv | grep -E '(ELEVENLABS|OPENAI|ANTHROPIC|HUBSPOT|...)'`
3. **`~/.zshrc` / `~/.bash_profile`** — lookups por padrões `export X_API_KEY=`

Se encontrou credencial existente, mostre ao usuário:
```
Detected existing: ELEVENLABS_API_KEY (in memory file)
  [import] Use this value
  [skip]   Don't configure now
  [new]    Enter a different value (rotates)
```

## Passo 3 — Mostrar progresso ao usuário

```
🔧 ciromacielOS setup

Progress: 3/14 items configured.

Configured:
  ✓ ElevenLabs API key (imported from memory)
  ✓ ElevenLabs voice ID (imported)
  ✓ Sandboxes directory (~/Documents/ciro-maciel/ciromaciel-test-sandboxes)

Up next: Anthropic API key (optional — only needed for eval harness).
Continue? [yes / skip-to <id> / quit]
```

## Passo 4 — Manifest de itens (só o que está em uso real)

**Princípio inegociável:** a manifest tem APENAS itens que algum agent/skill/command do marketplace consome HOJE. Plugins futuros adicionam item à manifest quando wirarem integração de verdade — não antes. Isso evita o usuário configurar 20 chaves "no caso" pra coisas que ninguém vai usar.

Itere por estes itens em ordem. Por item, siga "Protocolo por item" abaixo.

### Bloco A — Core (obrigatório se for usar o marketplace)

| ID | Descrição | Onde vive | Quem consome |
|----|-----------|-----------|--------------|
| `marketplace_path` | Path do clone do ciromacielOS | `config.yaml` | todos os commands |
| `sandboxes_path` | Path do repo de sandboxes | `config.yaml` | testing manual + tests/ harness |
| `default_locale` | en-US / pt-BR | `config.yaml` | writers (linkedin/blog/instagram) — regra de idioma |
| `shell_integration` | Adicionar `source ~/.ciromacielos/.env` no ~/.zshrc | `~/.zshrc` | qualquer Bash que precisa de env var do .env |

### Bloco B — video-creator (Remotion + TTS) — único plugin com integração API real

| ID | Item | Quem consome | Obtain at |
|----|------|--------------|-----------|
| `elevenlabs_api_key` | TTS via API | `/render-video` command + `tts-generator` skill | https://elevenlabs.io/app/settings/api-keys |
| `elevenlabs_voice_id` | Voice ID padrão | mesmo | https://elevenlabs.io/app/voice-library |

### O que NÃO está na manifest (e por quê)

| Provider | Por que não pedimos |
|----------|---------------------|
| OpenAI / Cartesia (TTS alternativo) | Documentados como providers alternativos no `tts-generator`, mas não implementados. Add item quando ElevenLabs deixar de ser default ou alguém quiser fallback. |
| Anthropic API key | Decidimos usar subscription do Claude Code (option A) pro eval harness. Sem API key separada. |
| HubSpot, Customer.io, Smartlead, GA4, Meta, Google Ads | Marketing plugin DOCUMENTA esses providers em tracking-setup/publish, mas nenhum command/skill faz API call real hoje. Quando algum começar a fazer (ex: `/publish` puxar lista do HubSpot via API), o item vai pra manifest. |
| Greenhouse, Lever, Gupy (ATS) | Recruiting é 100% markdown-driven hoje — Claude conduz o recrutador, não chama API de ATS. Add item quando algum command realmente sincronizar com ATS. |
| Linear, Notion, Google Drive | Knowledge plugin é literalmente "🚧 Esqueleto" — sem MCP configurado. Quando o `.mcp.json` for criado, esse item entra. |
| Cloudflare, Vercel | Development plugin é SEO-puro, não faz deploy. Add se um command de deploy aparecer. |
| Glassdoor / LinkedIn login | Career plugin usa esses como referência manual (humano abre o site) — não é "configuração", é login pessoal. |

**Quando adicionar um item novo à manifest:** o plugin que precisa da integração edita esta seção (ou inclui um `setup-manifest.yaml` próprio na v0.2 se virar registry dinâmico). Princípio: manifest items são SEMPRE consumidos por código rodando — nunca speculative.

## Protocolo por item

Para CADA item do manifest, na ordem:

### 1. Check status

Leia `setup-state.yaml`:
- Se `items.<id>.status = done` → **pule completamente** (mencione "✓ <id>: already configured" e siga)
- Se `items.<id>.status = skipped` → pergunte se quer reconfigurar (default: pula de novo)
- Se ausente ou `status = pending` → configure

### 2. Auto-detect

Antes de pedir ao usuário, tente encontrar valor existente:
- Memory dir
- Env vars (`printenv | grep <ENV_VAR>`)
- `~/.zshrc` / `~/.bash_profile` (grep)
- Arquivos óbvios (ex: `~/.config/google-cloud/`)

Se encontrar:
```
✓ Detected ELEVENLABS_API_KEY: sk_dc41...c8d8 (last 4 chars hidden for security)
  Source: /Users/.../memory/elevenlabs-credentials.md
  
  [i] import to ~/.ciromacielos/.env
  [r] rotate (enter new value)
  [s] skip for now
```

### 3. Conduzir o usuário (se não auto-detectado)

Mostre:
- O QUE é (1 frase)
- POR QUE precisa (qual plugin/feature usa)
- ONDE pegar (URL exata)
- COMO pegar (passos numerados — testados, links diretos)
- Custos típicos se relevante (ex: ElevenLabs $0.30/1k chars)

Exemplo template:
```
🔑 ElevenLabs API Key
   Used by: ciromaciel-video-creator (TTS voz)
   Cost: $0.30/1k chars (~$0.40 por vídeo de 75s)

   Como obter:
   1. Abra: https://elevenlabs.io/app/settings/api-keys
   2. Faça login (ou crie conta — Free tier dá 10k chars/mês)
   3. Click "Create new API key"
   4. Copie o valor (começa com 'sk_')

   Cole aqui ou digite [s]kip / [q]uit:
> _
```

Espere input. Se valor parece chave válida (heurística — formato específico do provider), valide via API call:
```bash
# ElevenLabs example
curl -sS https://api.elevenlabs.io/v1/user -H "xi-api-key: $KEY" -o /dev/null -w "%{http_code}"
# 200 = valid
```

### 4. Salvar

Se key/secret → adicione em `~/.ciromacielos/.env`:
```bash
# Use grep+sed pra não duplicar
grep -q "^export ELEVENLABS_API_KEY=" ~/.ciromacielos/.env \
  && sed -i '' "s|^export ELEVENLABS_API_KEY=.*|export ELEVENLABS_API_KEY=\"$VALUE\"|" ~/.ciromacielos/.env \
  || echo "export ELEVENLABS_API_KEY=\"$VALUE\"" >> ~/.ciromacielos/.env
```

Se config não-secreta → use `yq` ou `jq` no `~/.ciromacielos/config.yaml`.

### 5. Update state

```yaml
items:
  elevenlabs_api_key:
    status: done
    completed_at: 2026-05-13T01:23:45Z
    source: imported_from_memory | entered_manually | env_var
    last_validated: 2026-05-13T01:23:45Z
```

Salve `setup-state.yaml` **depois de cada item** — assim interrupção não perde progresso.

### 6. Confirme + próximo

```
✓ ELEVENLABS_API_KEY saved.
  Next: ELEVENLABS_VOICE_ID. Continue? [y/n/quit]
```

## Shell integration (item core obrigatório)

Após configurar pelo menos uma key, ofereça pra adicionar ao `~/.zshrc`:

```bash
# Detect shell
SHELL_RC=$([ -n "$ZSH_VERSION" ] && echo ~/.zshrc || echo ~/.bash_profile)

# Add source line if not present
if ! grep -q "ciromacielos/.env" "$SHELL_RC" 2>/dev/null; then
  cat >> "$SHELL_RC" <<'EOF'

# ciromacielOS — global env (managed by /setup)
if [ -f ~/.ciromacielos/.env ]; then
  set -a
  source ~/.ciromacielos/.env
  set +a
fi
EOF
  echo "✓ Added source line to $SHELL_RC"
  echo "  Run 'source $SHELL_RC' or open new terminal to load."
fi
```

## Validação final

Ao fim de todos os itens (ou quando user pede `[d]one`):

```
🎉 Setup complete.

Configured: 8/14 items
Skipped: 6/14 items (optional, can run /setup again later)

Files:
  ~/.ciromacielos/.env (chmod 600, 8 keys)
  ~/.ciromacielos/config.yaml (non-secret config)
  ~/.ciromacielos/setup-state.yaml (progress)

To activate in current shell:
  source ~/.ciromacielos/.env

To verify:
  /setup verify    # validates all configured keys via API call
```

## Subcomandos

- `/setup` — wizard normal (resume from where left off)
- `/setup reset` — wipe `setup-state.yaml` e recomeça (NÃO apaga .env)
- `/setup verify` — só valida cada key configurada via API call
- `/setup show` — lista items + status sem entrar no wizard
- `/setup rotate <id>` — rotacionar uma chave específica
- `/setup uninstall` — remove ~/.ciromacielos/ inteiro (pede confirmação dupla)

## Não faça

- **NUNCA** escreva API key em arquivo do repo do marketplace (commited).
- **NUNCA** ecoe a chave inteira de volta no terminal — sempre mostre apenas primeiros 4 + últimos 4 chars (`sk_dc41...c8d8`).
- **NUNCA** salve chave em memory dir se já passou pelo wizard (use .env como fonte da verdade).
- Não interrompa o wizard sem salvar `setup-state.yaml`.
- Não pergunte por item que tem `status: done` (a menos que user invocou `/setup rotate <id>`).
- Não tente automatizar OAuth (Google, etc.) — abra browser e diga "complete o flow + cole o token".
- Não valide keys obrigatoriamente — se API call falha (rede, rate limit), salve mesmo assim e marque `last_validated: failed_at_save` pra revisitar.

## Resume protocol

Toda vez que `/setup` é invocado:

1. Verifica se `~/.ciromacielos/setup-state.yaml` existe
2. Se sim → conta done/pending/skipped, mostra resumo
3. Pergunta "Continue from where you left off? [y/n]"
4. Se y → pula direto pro próximo item com `status: pending` ou ausente
5. Se n → pergunta `/setup reset` ou `/setup show` ou `/setup verify`

User pode interromper a qualquer momento com Ctrl-C / `quit`. State é salvo após cada item completado — re-run continua exatamente de onde parou.

## Erros comuns + handling

| Erro | Handling |
|------|----------|
| API key inválida na validação | Não bloqueia — salva como `status: done, last_validated: failed`. Avisa user e segue. |
| `~/.ciromacielos/` não tem permissão pra escrever | Halt + reporta + sugere `chmod 700 ~/.ciromacielos` |
| `.env` sintaxe quebrada (user editou à mão) | Detecta + sugere `/setup reset` + reimport |
| User cola key com whitespace | Trim antes de salvar |
| User cola key com aspas | Strip aspas antes de salvar |
| Provider retorna 429 (rate limit) | Salva sem validar + agenda re-validate em 1h |
| User digita `quit` no meio | Salva state atual + diz "Pause feito. Re-run /setup pra continuar." |
