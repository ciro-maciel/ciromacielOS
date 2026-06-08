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
| `default_locale` | en-US / pt-BR | `config.yaml` | writers (linkedin/blog/instagram) — regra de idioma |
| `shell_integration` | Adicionar `source ~/.ciromacielos/.env` no ~/.zshrc | `~/.zshrc` | qualquer Bash que precisa de env var do .env |

> **Por que NÃO tem `marketplace_path` nem `sandboxes_path`:** plugins instalados via `/plugin marketplace add` são gerenciados pelo Claude Code runtime — você nunca lida com o path direto. `marketplace_path` só existiria pra um DEV do marketplace (que tem o repo clonado), e mesmo assim nenhum command precisa dele globalmente (cada command resolve paths via plugin runtime). Sandboxes são conceito interno de teste dos plugins, não de end user.

### Bloco B — video-creator (Remotion + TTS + YouTube publish)

| ID | Item | Quem consome | Obtain at |
|----|------|--------------|-----------|
| `elevenlabs_api_key` | TTS via API | `/render-video` command + `tts-generator` skill | https://elevenlabs.io/app/settings/api-keys |
| `elevenlabs_voice_id` | Voice ID padrão | mesmo | https://elevenlabs.io/app/voice-library |
| `google_cloud_yt_credentials` | OAuth Client ID (Desktop app) pra YouTube Data API v3 | `yt-uploader` skill + `/publish` (rota YouTube) | https://console.cloud.google.com/apis/credentials |

### Bloco C — marketing-publish (agendamento social orgânico, exceto YouTube)

| ID | Item | Quem consome | Obtain at |
|----|------|--------------|-----------|
| `buffer_access_token` | Access token pessoal do Buffer (orgânico: LinkedIn, X, IG, FB, Threads, Bluesky, TikTok — **NÃO YouTube**) | `/publish` command (marketing) | https://publish.buffer.com/account/apps |

> **YouTube não está aqui:** YT vai via `google_cloud_yt_credentials` (Bloco B) + skill `yt-uploader` (plugin video-creator), NÃO via Buffer. Razão: Buffer rejeita catbox/hosts anônimos com `Content-Length: 0`, e o flow notification não auto-publica. YT Data API direto é o caminho automatizado real.

### O que NÃO está na manifest (e por quê)

| Provider | Por que não pedimos |
|----------|---------------------|
| OpenAI / Cartesia (TTS alternativo) | Documentados como providers alternativos no `tts-generator`, mas não implementados. Add item quando ElevenLabs deixar de ser default ou alguém quiser fallback. |
| Anthropic API key | Decidimos usar subscription do Claude Code (option A) pro eval harness. Sem API key separada. |
| HubSpot, Customer.io, Smartlead, GA4, Meta Ads, Google Ads | Marketing plugin DOCUMENTA esses providers em tracking-setup/publish, mas nenhum command/skill faz API call real hoje. Quando algum começar a fazer (ex: `/publish` puxar lista do HubSpot via API), o item vai pra manifest. |
| Typefury, Hypefury, Publer, SocialBee (outros agregadores) | Buffer é o agregador escolhido pra orgânico (Bloco C). Se trocar de provider, este item sai e o substituto entra — não cumulativo. |
| Greenhouse, Lever, Gupy (ATS) | Recruiting é 100% markdown-driven hoje — Claude conduz o recrutador, não chama API de ATS. Add item quando algum command realmente sincronizar com ATS. |
| Linear, Notion, Google Drive | Knowledge plugin é literalmente "🚧 Esqueleto" — sem MCP configurado. Quando o `.mcp.json` for criado, esse item entra. |
| Cloudflare, Vercel | Development plugin é SEO-puro, não faz deploy. Add se um command de deploy aparecer. |
| Glassdoor / LinkedIn login | Career plugin usa esses como referência manual (humano abre o site) — não é "configuração", é login pessoal. |

**Quando adicionar um item novo à manifest:** o plugin que precisa da integração edita esta seção (ou inclui um `setup-manifest.yaml` próprio na v0.2 se virar registry dinâmico). Princípio: manifest items são SEMPRE consumidos por código rodando — nunca speculative.

## Passo 5 — Playbook detalhado por item

Cada item da manifest tem seu próprio playbook abaixo. Quando o wizard chegar nele, **use o texto literal** da subseção `Conduzir o usuário` — não invente passos, não economize palavra. A diferença entre "Pega a key na ElevenLabs" e o playbook completo é a diferença entre o user achar e o user desistir.

---

### A.1 — `default_locale`

**O que é:** idioma default pros writers (linkedin/blog/instagram) quando ICP geo é ambíguo.
**Por que precisa:** regra dos writers é "ICP geo ganha sobre brand-voice". Se ICP é US-primário → en-US. Se ICP é misto, agents fazem halt e perguntam. Esse default é o fallback pra evitar halt em casos óbvios.
**Salva em:** `config.yaml` → `default_locale`
**Valores válidos:** `en-US`, `pt-BR` (extensível depois pra `es-ES`, etc.)

**Conduzir o usuário (texto literal):**
```
🌐 Default locale
   What: fallback language for content writers when ICP geo is ambiguous.
   Why: linkedin-writer/blog-writer/instagram-writer use ICP geo to pick
        language. If ICP doesn't specify, they use this default
        instead of stopping to ask.

   Options:
     [1] en-US   — English (most ICPs in your portfolio are US-focused)
     [2] pt-BR   — Portuguese (Brazil)

   Pick [1] or [2]:
> _
```

---

### A.2 — `shell_integration`

**O que é:** uma linha no `~/.zshrc` (ou `~/.bash_profile`) que faz source de `~/.ciromacielos/.env` em todo shell novo.
**Por que precisa:** sem isso, env vars ficam só na sessão atual. Bash spawned por Claude Code não as vê. Resultado: `/render-video` falha com "ELEVENLABS_API_KEY not set".
**Salva em:** append no rc do shell

**Detect:**
```bash
SHELL_RC=$([ -n "$ZSH_VERSION" ] && echo ~/.zshrc || echo ~/.bash_profile)
ALREADY=$(grep -q "ciromacielos/.env" "$SHELL_RC" 2>/dev/null && echo yes || echo no)
```

Se `ALREADY=yes` → marca done e segue.

**Conduzir o usuário (texto literal):**
```
🐚 Shell integration
   What: adds this block to your <SHELL_RC>:

       # ciromacielOS — global env (managed by /setup)
       if [ -f ~/.ciromacielos/.env ]; then
         set -a && source ~/.ciromacielos/.env && set +a
       fi

   Why: makes ELEVENLABS_API_KEY (and future keys) available in every
        new shell — including the Bash that Claude Code spawns for
        /render-video. Without this, you'd have to manually export
        every time.

   Append now? [y/n/show-current]
> _
```

Se `[show-current]` → mostra as últimas 5 linhas do `<SHELL_RC>` antes de pedir confirmação.

---

### B.1 — `elevenlabs_api_key`

**O que é:** API key da ElevenLabs, provider de TTS (text-to-speech) usado pelo `/render-video`.
**Por que precisa:** quando você roda `/render-video`, o `tts-generator` chama a API da ElevenLabs com cada linha do roteiro → recebe MP3 com a voz lendo aquela linha → Remotion mixa esses MP3s no vídeo final. Sem essa chave, vídeo sai mudo (ou pipeline halta).
**Cost reference (2026):**
  - Free tier: 10k chars/mês (~6-7 vídeos de 75s) — chave válida mas pode esgotar rápido
  - Starter ($5/mês): 30k chars + acesso a voices da library
  - Creator ($22/mês): 100k chars + voice cloning (clone tua própria voz)
  - Pro+ ($99/mês): 500k+ chars + formatos hi-fi (mp3_44100_192)
  - Por vídeo de 75s: ~1.5k chars ≈ $0.30-0.50 (depende do tier)

**Salva em:** `~/.ciromacielos/.env` como `export ELEVENLABS_API_KEY="sk_..."`
**Formato esperado:** começa com `sk_`, ~51 chars total, hex/alphanumeric depois do prefix
**Validação (após salvar):**
```bash
curl -sS -o /dev/null -w "%{http_code}" \
  -H "xi-api-key: $KEY" \
  https://api.elevenlabs.io/v1/user
# 200 = OK
# 401 = key inválida
# 429 = rate limited (tenta de novo em 60s)
```

**Conduzir o usuário (texto literal):**
```
🔑 ElevenLabs API Key
   What: API key for the TTS (text-to-speech) provider that turns
         your video script into voice audio.
   Used by: ciromaciel-video-creator → /render-video → tts-generator skill.
   Cost: Free tier = 10k chars/month (~6 short videos). Paid from $5/mo.
         Per video (75s): ~$0.30-0.50.

   How to get it:
   1. Open in browser: https://elevenlabs.io/app/settings/api-keys
      (If you don't have an account: https://elevenlabs.io/sign-up — 30 sec.)
   2. Top-right corner: click your profile avatar → "Profile + API key".
   3. Under "API Keys", click "Create new key".
      - Name it something like "ciromacielOS-marketplace".
      - Permission scope: keep default (full access) unless you want
        to lock it to TTS only — that's also fine.
      - Click "Create".
   4. COPY THE KEY NOW — once you close the modal, you can't see it again.
      It starts with 'sk_' and is about 51 chars long.
   5. Paste below.

   Paste your key (or [s]kip / [q]uit):
> _
```

Após user colar, **NUNCA ecoe a chave inteira**. Confirme com formato `sk_xxxx...xxxx` (primeiros 4 + últimos 4 só).

---

### B.2 — `elevenlabs_voice_id`

**O que é:** ID da voz padrão que `/render-video` vai usar quando o `audio-script.json` não especifica voice override por linha.
**Por que precisa:** ElevenLabs tem milhares de vozes. Sem default, todo audio-script.json teria que repetir o voice ID. Default global = configura 1 vez.
**Salva em:** `.env` como `export ELEVENLABS_VOICE_ID="..."` + `config.yaml` em `elevenlabs.voice_id`
**Formato esperado:** 20 chars alfanuméricos (ex: `YU8EsJtXFMyKMxYtheDk`, `pNInz6obpgDQGcFmaJgB`)
**Validação:**
```bash
curl -sS -o /dev/null -w "%{http_code}" \
  -H "xi-api-key: $KEY" \
  "https://api.elevenlabs.io/v1/voices/$VOICE_ID"
# 200 = voice exists e key tem acesso
# 404 = voice ID não existe ou não tem acesso (voice clones são per-account)
```

**Duas formas de obter:**

**Opção 1 — Usar voz pré-built da library (grátis, qualquer tier):**
```
🎙️  ElevenLabs Voice ID — Option A: pre-built voice
   1. Open: https://elevenlabs.io/app/voice-library
   2. Browse the catalog. Filters: language (English, Portuguese, etc.),
      gender, accent, style (conversational, narrative, etc.).
   3. Hover any voice → click ▶ to preview the sound.
   4. When you find one you like, click the voice card to open detail.
   5. Click "Add to My Voices" (so it shows up on your account).
   6. Now go to: https://elevenlabs.io/app/voice-lab → click the voice you added
      → click the "⋯" menu → "Copy Voice ID".
   7. The ID is 20 alphanumeric chars (no 'sk_' prefix).

   Examples of good defaults (English, professional):
   - pNInz6obpgDQGcFmaJgB   (Adam — confident male, neutral)
   - EXAVITQu4vr4xnSDxMaL   (Bella — warm female, conversational)
   - 21m00Tcm4TlvDq8ikWAM   (Rachel — calm female, narrative)
```

**Opção 2 — Clonar tua voz (Creator tier+, $22/mês):**
```
🎙️  ElevenLabs Voice ID — Option B: clone your own voice
   Requires Creator subscription tier or higher ($22/mo).

   1. Open: https://elevenlabs.io/app/voice-lab
   2. Click "Add a New Voice" → "Instant Voice Cloning".
   3. Upload 1-3 minutes of clean audio of yourself speaking
      (any topic; just clear, no background noise).
      You can also record directly in the browser.
   4. Name the voice (ex: "Ciro — primary").
   5. ElevenLabs trains and gives you a Voice ID.
   6. Click the voice → "⋯" → "Copy Voice ID".

   Pros: every video has YOUR voice (great for personal brand).
   Cons: requires paid tier + careful with deepfake ethics.
```

**Conduzir o usuário (texto literal — fluxo único cobrindo as duas opções):**
```
🎙️  ElevenLabs Voice ID
   What: the default voice used by /render-video when a video script
         doesn't override it.
   Why: avoids re-specifying voice in every audio-script.json.

   Two ways to get one:

   [A] Pre-built voice from ElevenLabs library (FREE, any tier).
       Browse https://elevenlabs.io/app/voice-library, pick one,
       copy its Voice ID. ~30 seconds.

   [B] Clone YOUR voice (requires Creator tier $22/mo).
       Upload 1-3 min of yourself talking at
       https://elevenlabs.io/app/voice-lab → "Instant Voice Cloning".
       ~5 minutes total.

   Quick recommendation: start with [A] (pNInz6obpgDQGcFmaJgB =
   Adam, solid English neutral default). You can switch to a clone
   later via /setup rotate elevenlabs_voice_id.

   Pick:
     [a] paste a pre-built voice ID below
     [b] paste a cloned voice ID below  
     [d] use default (pNInz6obpgDQGcFmaJgB — Adam)
     [s] skip
     [q] quit
> _
```

Após user colar, validate via API (ver Validação acima). Se 404, mostra: "Voice ID not found OR your API key doesn't have access. Try again or [d] for default."

---

### B.3 — `google_cloud_yt_credentials`

**O que é:** OAuth Client ID (type Desktop app) de um projeto Google Cloud com **YouTube Data API v3** ativada. Usado pelo skill `yt-uploader` (plugin video-creator) e pelo handler de YouTube do `/publish` (plugin marketing) pra subir vídeos diretamente no YouTube com metadata completo (title, description, tags, category, scheduled visibility, custom thumbnail).
**Por que precisa:** sem isso, publicar no YouTube cai pra: (a) upload manual via YouTube Studio (~5min por video, sem automação) OU (b) Buffer (que não funciona pra YT — exige host externo com Content-Length, e o flow notification é só lembrete). YouTube Data API v3 direto é o único caminho automatizado.
**Por que NÃO Buffer:** Buffer rejeita catbox.moe/anonymous hosts com `Video URL returned zero content-length`. Discoverable só com S3/R2/GitHub Releases (overhead) e mesmo assim `schedulingType=notification` é só push pro mobile app — não auto-publica. YT Data API direto = simpler + durable + sem dependência de host.
**Cost reference (2026):**
  - YouTube Data API v3: **FREE**, com quota de 10.000 units/dia
  - `videos.insert` (upload) = 1600 units → 6 uploads/dia free
  - `thumbnails.set` = 50 units → 200 thumbnails/dia free
  - Reset 00:00 PST = 04:00 BRT
  - Quota increase: gratuito, mas exige justificativa + ~3 dias review

**Salva em:** JSON em `~/.ciromacielos/google-cloud/yt-upload-credentials.json` (chmod 600). Token OAuth gerado no first-run vai pra `~/.ciromacielos/google-cloud/yt-upload-token.json` (chmod 600, refresh automático).
**Formato esperado:** JSON com chave top-level `"installed"` (NÃO `"web"`):
```json
{
  "installed": {
    "client_id": "...apps.googleusercontent.com",
    "project_id": "...",
    "client_secret": "GOCSPX-...",
    "redirect_uris": ["http://localhost"]
  }
}
```
**Validação (após salvar):** primeiro `yt-upload.py` run dispara OAuth flow (browser dance). Se token gerado e cacheado com sucesso → OK. Se "Access blocked: app has not completed verification" → user esqueceu de adicionar email como Test User (ver step 4 abaixo).

**Pré-requisito Python (uma vez):**
```bash
python3 -m venv ~/.ciromacielos/google-cloud/venv
~/.ciromacielos/google-cloud/venv/bin/pip install google-api-python-client google-auth-oauthlib google-auth-httplib2
```
PEP 668 bloqueia pip global no macOS recente — sempre use venv dedicado.

**Conduzir o usuário (texto literal):**
```
🎬 Google Cloud — YouTube Data API credentials
   What: OAuth Client ID pra publicar vídeos automaticamente no YouTube.
   Used by: ciromaciel-video-creator → yt-uploader skill;
            ciromaciel-marketing → /publish (rota YouTube).
   Cost: API é FREE. Quota: 10k units/dia = 6 uploads/dia.

   IMPORTANTE — Buffer não funciona pra YouTube. Esse é o único
   caminho automatizado real. Sem essa key, publicar no YT vira
   upload manual no YouTube Studio (5min por video, sem scheduling
   via API).

   Como obter (10-15 min, one-time):

   1. Cria projeto no Google Cloud Console
      https://console.cloud.google.com/projectcreate
      - Project name: "careerthesis-yt" (ou similar — único pra esse uso)
      - Click CREATE
      - Espera ~30s pra ele aparecer

   2. Ativa a YouTube Data API v3 nesse projeto
      https://console.cloud.google.com/apis/library/youtube.googleapis.com
      - Confirma que está no projeto correto (canto superior esquerdo)
      - Click ENABLE
      - Espera ~10s

   3. Configura OAuth consent screen (User type: External, modo Testing)
      https://console.cloud.google.com/apis/credentials/consent
      - User Type: External → CREATE
      - App information:
        - App name: "careerthesis-yt" (qualquer)
        - User support email: TEU EMAIL Google
        - Developer contact: TEU EMAIL Google
      - Scopes: pula (CONTINUE) — o script pede scopes dinamicamente
      - Test users: + ADD USERS → adiciona o email da conta Google dona
        do canal YouTube target (AGORA — sem isso, próximo passo bloqueia)
      - SAVE AND CONTINUE até finalizar
      - Status final: "Testing" (NÃO publicar — youtube.upload é
        restricted scope, exige Google verification formal, overhead)

   4. Cria OAuth Client ID type Desktop app
      https://console.cloud.google.com/apis/credentials
      - + CREATE CREDENTIALS → OAuth client ID
      - Application type: **Desktop app**
      - Name: "ciromacielOS-yt-uploader"
      - CREATE
      - Modal abre com Client ID + Client Secret + botão DOWNLOAD JSON
      - Click DOWNLOAD JSON — salva em ~/Downloads/

   5. Cola o conteúdo do JSON aqui (ou me passa o path):
      cat ~/Downloads/client_secret_*.json

   Cola o JSON inteiro (ou [s]kip / [q]uit):
> _
```

Após user colar:
1. Valida estrutura JSON (deve ter chave `installed.client_id`, `installed.client_secret`, `installed.project_id`)
2. Salva em `~/.ciromacielos/google-cloud/yt-upload-credentials.json` (chmod 600)
3. Apaga qualquer token antigo (`rm -f ~/.ciromacielos/google-cloud/yt-upload-token.json`) pra forçar re-OAuth
4. Cria venv Python se ainda não existe
5. Avisa que primeira invocation do `yt-uploader` vai disparar OAuth flow (browser dance) — mostra URL pro user abrir manualmente (não tenta `webbrowser.open()` automático pq Bash sem TTY trava silenciosamente)

**Gotchas (do real run em 2026-05-15):**

| Gotcha | Sintoma | Fix |
|--------|---------|-----|
| Project_id errado no JSON | OAuth funciona mas vídeos vão pro lugar errado / quota errada | Verificar `project_id` no JSON antes de salvar — bate com o projeto criado no step 1 |
| Email não em Test Users | "Access blocked: app careerthesis has not completed verification. Error 403: access_denied" no consent screen do browser | Volta no console, adiciona email em Test users, refresh OAuth URL |
| Silent webbrowser.open fail | Script trava sem mostrar URL no terminal | `yt-upload.py` usa `open_browser=False` + `authorization_prompt_message` — URL aparece no stdout pro user abrir manualmente |
| PEP 668 pip global bloqueado | `pip install google-api-python-client` falha com "externally managed environment" | Usa venv dedicado em `~/.ciromacielos/google-cloud/venv/`, sempre |

---

### C.1 — `buffer_access_token`

**O que é:** access token pessoal do Buffer, usado pelo `/publish` (plugin marketing) pra agendar/publicar posts orgânicos em LinkedIn, X/Twitter, Instagram, Facebook, Threads, Bluesky etc.
**Por que precisa:** sem isso, `/publish` cai pro modo manual (mostra copy, espera o usuário publicar à mão). Com o token, o command agenda direto via API — ainda passa pelo gate de aprovação humana item-por-item, mas o handoff vira 1 click em vez de 10.
**Por que Buffer (não outro):** orgânico não é alvo de automação heavy (LinkedIn nem tem API estável pra orgânico individual). Buffer agrega 6+ redes num token só, free tier permite 3 canais conectados, paid tier ($6-12/mês) libera mais. É o least-bad pra um operador solo.
**Cost reference (2026):**
  - Free: 3 canais conectados, 10 posts agendados por canal — suficiente pra teste
  - Essentials ($6/mês por canal): posts ilimitados + analytics básico
  - Team ($12/mês por canal): + colaboração, aprovações
  - Para 1 fundador com 3 canais (LinkedIn pessoal + LinkedIn empresa + X): Free funciona; ~$18/mês se passar do limite

**Salva em:** `~/.ciromacielos/.env` como `export BUFFER_ACCESS_TOKEN="..."`
**Formato esperado:** string opaca ~40 chars alfanuméricos (sem prefix tipo `sk_`)
**Validação:**
```bash
curl -sS -o /dev/null -w "%{http_code}" \
  "https://api.bufferapp.com/1/user.json?access_token=$TOKEN"
# 200 = OK (retorna user.id + plan)
# 403 = token inválido ou revogado
# 429 = rate limited
```

**Conduzir o usuário (texto literal):**
```
📅 Buffer Access Token
   What: personal token to schedule organic social posts (LinkedIn,
         X, Instagram, Facebook, Threads, Bluesky) via Buffer's API.
   Used by: ciromaciel-marketing → /publish → social handlers.
   Cost: Free tier covers 3 channels + 10 scheduled posts each.
         Paid from $6/mo/channel if you need more.

   Why Buffer specifically: LinkedIn doesn't expose a stable API for
   organic personal posts. Buffer is the least-bad aggregator for a
   solo operator — one token covers 6+ networks. /publish still asks
   approval per item; this token just makes the handoff a single
   API call instead of "copy → paste in browser → click publish".

   How to get it:
   1. Open: https://publish.buffer.com/account/apps
      (Login first if needed — same account where your channels are
      connected. If you don't have an account: https://buffer.com →
      sign up free, takes 1 min.)
   2. Make sure your social channels are connected:
      Account → Channels → "Connect a channel" for each network
      you'll publish to (LinkedIn personal + company, X, IG, etc.).
   3. Back on https://publish.buffer.com/account/apps:
      Click "Create Access Token" (or similar — UI label may say
      "Generate new token").
      - Some accounts see it under "Developer" tab. If you can't find
        it, the URL https://publish.buffer.com/developers/api also
        leads there.
   4. Name it "ciromacielOS-marketplace".
   5. Copy the token immediately (you may or may not be able to view
      it again — treat as one-shot).
   6. Paste below.

   Paste your token (or [s]kip / [q]uit):
> _
```

Após user colar, **NUNCA ecoe o token inteiro**. Confirme com formato `xxxx...xxxx` (primeiros 4 + últimos 4 só). Valide via curl acima. Se 403, peça pra confirmar URL e regerar.

Após validação OK, opcionalmente liste os canais conectados pra confirmar setup:
```bash
curl -sS "https://api.bufferapp.com/1/profiles.json?access_token=$TOKEN" \
  | jq -r '.[] | "- \(.service): \(.formatted_username) (\(.id))"'
```

Mostre ao usuário:
```
✓ Buffer token validated. Channels connected:
  - linkedin: Ciro Maciel (5a1b2c3d...)
  - twitter: @ciromaciel (5e6f7a8b...)
  - instagram: @ciromaciel.os (5c9d0e1f...)

These are the channels /publish can target. To add more, go to
Buffer → Channels → Connect, then re-run /setup verify.
```

Se nenhum canal conectado, avise: "Token works but you have 0 channels connected. /publish won't have anywhere to post — connect at least one at https://publish.buffer.com/channels."

---

## Princípio editorial — para todo item futuro

Quando adicionar um item novo à manifest, ele DEVE ter, sem exceção:

1. **O que é** — 1 frase clara, sem jargão
2. **Por que precisa** — qual command/skill consome E o que quebra sem isso
3. **Cost reference** — se for serviço pago, faixa de preços + estimativa de uso típico (ex: "$0.30 por vídeo de 75s")
4. **Salva em** — `.env` / `config.yaml` / shell rc — sempre explícito
5. **Formato esperado** — regex ou exemplo (`sk_xxx`, `xxx-xxx-xxxx`, etc.)
6. **Validação** — comando curl ou função que checa se a key funciona
7. **Como pegar — passo-a-passo numerado** — URL exata, qual botão, em que canto, qual texto procurar. NÃO escreva "vai nas configurações da plataforma" — escreva "abra https://X → top-right avatar → 'API Keys' → 'Create new'". Linkar diretamente quando possível.
8. **Conduzir o usuário (texto literal)** — bloco em código formatado pronto pra mostrar. Inclui o que o user vê + as opções `[y/n/s/q]`.

Itens com OAuth (Google, etc.) terão um Passo extra: "abra browser pra autenticar → cola o token resultante". OAuth automation é fora do escopo desse wizard.

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
