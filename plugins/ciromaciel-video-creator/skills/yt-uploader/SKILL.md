---
name: yt-uploader
description: >
  Publish videos directly to YouTube via the YouTube Data API v3 (multipart resumable upload).
  Supports public/private/unlisted + scheduled publishing, custom tags, category, description,
  language, and custom thumbnails (image upload via thumbnails.set). Single-video CLI + batch
  orchestrator. Replaces Buffer for YouTube (Buffer's flow requires an externally-hosted MP4
  URL with Content-Length header, which most anonymous hosts don't serve — see SKIP section).
tags: [video, youtube, publishing]
---

# YouTube Uploader

Sobe vídeos pra YouTube direto via YouTube Data API v3 — sem dependência de host externo, sem agregadores intermediários. Single-video CLI + batch orchestrator.

**Built for:** publicar o output do `/render-video` (longform + Shorts) num canal próprio de YouTube com metadados completos (title, description, tags, category, scheduled visibility, thumbnail). Substitui o caminho via Buffer pra YouTube (ver "Por que não Buffer" abaixo).

## When to use

- Você tem `out.mp4` pronto em `clients/<nome>/campaigns/<campaign>-assets/video/<slug>/` e precisa subir pro YT
- Você quer publicar imediato (`privacy=public`) OU agendar (`privacy=private` + `publish_at` ISO UTC)
- Você quer subir uma thumbnail custom (longform tem SVG renderizado; Shorts pegam frame do video via ffmpeg)
- Você tem um batch de N videos a subir em sequência com state recovery (idempotente por `id`)

## When NOT to use

- Pra LinkedIn / X / Threads / IG / FB / Bluesky → continua usando Buffer GraphQL (Buffer abstrai bem essas APIs)
- Pra Shorts em apps de terceiros (TikTok, Reels IG): o asset é diferente — usa `ciromaciel-marketing`'s social handlers

## Pré-requisitos (uma vez)

Setup feito via `/setup` (Bloco B item `google_cloud_yt_credentials`):

1. **Projeto Google Cloud** com YouTube Data API v3 ativada
   - Console: https://console.cloud.google.com/apis/library/youtube.googleapis.com
2. **OAuth Client ID** (type: Desktop app) gerado no Google Cloud Console
   - Console: https://console.cloud.google.com/apis/credentials
   - JSON salvo em `~/.ciromacielos/google-cloud/yt-upload-credentials.json` (chmod 600)
3. **OAuth consent screen** em modo Testing, com seu email Google adicionado como Test User
   - Console: https://console.cloud.google.com/apis/credentials/consent
   - NÃO publicar o app (`youtube.upload` é restricted scope → exige Google verification formal — overhead)
4. **Python venv** em `~/.ciromacielos/google-cloud/venv/` com deps de [requirements.txt](requirements.txt)
   ```bash
   python3 -m venv ~/.ciromacielos/google-cloud/venv
   ~/.ciromacielos/google-cloud/venv/bin/pip install -r <skill-dir>/requirements.txt
   ```
5. **First-run OAuth flow** (browser dance) — token cacheado em `~/.ciromacielos/google-cloud/yt-upload-token.json` (chmod 600). Refresh automático daí pra frente.

## Scripts neste skill

| File | Purpose |
|------|---------|
| [yt-upload.py](yt-upload.py) | Single-video upload. Resumable multipart, OAuth flow on first run, prints JSON `{id, url, status, title}` on stdout. |
| [yt-thumbnail.py](yt-thumbnail.py) | Set custom thumbnail on existing video (via `youtube.thumbnails.set`). Cached OAuth token. |
| [yt-batch.py](yt-batch.py) | Orchestrate N uploads from `batch.json`. Idempotent — pula `id`s já em `results.json`. Aceita `thumbnail` field per item. |
| [batch.example.json](batch.example.json) | Exemplo de schema do batch (3 items: longform now + shorts now + shorts scheduled). |
| [requirements.txt](requirements.txt) | Python deps (`google-api-python-client`, `google-auth-oauthlib`, `google-auth-httplib2`). |

## Usage

### Single upload (manual)
```bash
~/.ciromacielos/google-cloud/venv/bin/python \
  <skill-dir>/yt-upload.py \
  --video /path/to/out.mp4 \
  --title "..." \
  --description "..." \
  --tags "tag1,tag2,..." \
  --category 27 \
  --privacy public
# saída: { "id": "y8fK3B_4QUs", "url": "https://www.youtube.com/watch?v=y8fK3B_4QUs", "status": {...}, "title": "..." }
```

### Set thumbnail no video existente
```bash
~/.ciromacielos/google-cloud/venv/bin/python \
  <skill-dir>/yt-thumbnail.py \
  --video-id y8fK3B_4QUs \
  --image /path/to/thumb.png
```

### Batch (recomendado pra campanha)
```bash
~/.ciromacielos/google-cloud/venv/bin/python \
  <skill-dir>/yt-batch.py \
  --batch /path/to/batch.json
# escreve /path/to/batch.results.json em paralelo (idempotente — re-rodar pula done)
```

## Argumentos do single-upload

| Arg | Default | Notas |
|-----|---------|-------|
| `--video` | (required) | Path absoluto pro `out.mp4` (resumable upload — sobe MB-by-MB) |
| `--title` | (required) | Max 100 chars |
| `--description` | (required) | Max 5000 chars. Suporta `\n` real (multi-linha). |
| `--tags` | "" | Comma-separated. Max 500 chars total. |
| `--category` | 27 | YT category ID. 27=Education, 22=People&Blogs, 26=Howto, 28=Sci&Tech, 24=Entertainment, 25=News&Politics |
| `--privacy` | `public` | `public` / `private` / `unlisted` |
| `--publish-at` | None | ISO 8601 UTC (ex `2026-06-18T21:00:00Z`). Só usado quando `--privacy private`. Vídeo fica privado até essa hora, depois auto-flip pra public. |
| `--made-for-kids` | False | Flag COPPA. Se true, comments desabilitados + outras restrições. |
| `--language` | `pt-BR` | `defaultLanguage` + `defaultAudioLanguage` |
| `--credentials` | `~/.ciromacielos/google-cloud/yt-upload-credentials.json` | OAuth client_secret JSON |
| `--token` | `~/.ciromacielos/google-cloud/yt-upload-token.json` | OAuth token cache (auto-criado no first run) |

## Schema do batch.json

```json
[
  {
    "id": "youtube-01",                 // required, unique key for dedup
    "video": "/abs/path/to/out.mp4",    // required
    "title": "...",                     // required
    "description": "...",               // required
    "tags": "tag1,tag2",                // optional
    "category": 27,                     // optional, default 27
    "privacy": "public",                // optional, default "public"
    "publish_at": "2026-06-18T21:00:00Z", // optional, ISO UTC, only with privacy=private
    "thumbnail": "/abs/path/thumb.png", // optional, sobe via thumbnails.set após upload
    "made_for_kids": false              // optional, default false
  }
]
```

Veja [batch.example.json](batch.example.json) pra um exemplo completo de campanha.

## Quota YouTube Data API

Free tier: **10.000 units/dia** (reset 00:00 PST = 04:00 BRT).

| Operação | Custo | Quantos por dia (free) |
|----------|-------|------------------------|
| `videos.insert` (upload) | 1600 units | 6 uploads/dia |
| `thumbnails.set` | 50 units | 200 thumbnails/dia |
| `videos.update` (edit metadata) | 50 units | 200/dia |
| `videos.list` (read) | 1 unit | 10k/dia |

Cadência típica careerthesis (1 longform + 6 Shorts/mês = ~7 uploads/mês) cabe trivialmente. Pra dias de batch grande (>6 uploads em 24h), monitorar via console:
https://console.cloud.google.com/apis/dashboard?project=careerthesis (substituir pelo project_id correto)

Se quota estourar, opções:
- Esperar reset 00:00 PST
- Solicitar aumento de quota (free, mas exige justificativa + ~3 dias review)
- Dividir uploads em 2+ dias

## Categorias YouTube (referência)

| ID | Nome |
|----|------|
| 1 | Film & Animation |
| 2 | Autos & Vehicles |
| 10 | Music |
| 15 | Pets & Animals |
| 17 | Sports |
| 19 | Travel & Events |
| 20 | Gaming |
| 22 | People & Blogs |
| 23 | Comedy |
| 24 | Entertainment |
| 25 | News & Politics |
| 26 | Howto & Style |
| 27 | Education (default pro careerthesis) |
| 28 | Science & Technology |
| 29 | Nonprofits & Activism |

## Thumbnails — preparação do PNG

YouTube aceita JPEG/PNG/BMP/GIF. Recomendado **PNG 1280×720** pra longform, **1080×1920** pra Shorts. Max 2MB.

Fluxo padrão pro careerthesis:
- **Longform:** existe `thumbnail-1280x720.svg` no asset folder. Render pra PNG:
  ```bash
  rsvg-convert -w 1280 -h 720 thumbnail-1280x720.svg -o thumbnail.png
  ```
- **Shorts:** sem SVG dedicada. Extrai primeiro frame visual:
  ```bash
  ffmpeg -ss 1.0 -i out.mp4 -frames:v 1 -q:v 2 thumbnail.png -y
  ```
  (t=1s captura o primeiro on-screen caption já estabilizado; ajusta o `-ss` se o hook visual aparecer em outro timestamp)

**Caveat pra Shorts:** o player de Shorts no app mobile **ignora** thumbnail custom — sempre renderiza o video direto. A thumbnail SÓ aparece em web search, channel page, e suggested. Pra Shorts brand-aligned, ainda vale subir.

## OAuth — fluxo do first-run

Primeiro `yt-upload.py` invocation com token ausente:
1. Script imprime URL OAuth no stdout/stderr (não tenta abrir browser automaticamente — `open_browser=False` evita silent fail em shells sem TTY)
2. Você abre URL no browser, autentica com a conta Google dona do canal YT
3. Se vir "Google hasn't verified this app" → Advanced → Go to `<project>` (unsafe). É seguro: é teu próprio projeto Google Cloud. Esse warning só some quando o app passa verification formal (não vale a pena pra solo dev).
4. Marca scopes `youtube.upload` + `youtube.readonly` → Continue
5. Redirect pra `http://localhost:<port>/` → "Autorização recebida. Pode fechar essa aba."
6. Token persistido em `~/.ciromacielos/google-cloud/yt-upload-token.json`. Refresh automático daqui pra frente (refresh token vive 6 meses sem uso; uso ativo renova indefinidamente).

Se aparecer "Access blocked: app careerthesis has not completed verification" → seu email não foi adicionado como Test User. Vai em https://console.cloud.google.com/apis/credentials/consent → "Test users" → ADD USERS → adiciona o email da conta Google dona do canal.

## Por que não Buffer pra YT

Descoberto em 2026-05-15 durante a campanha quiz-ancora-de-carreira:

- Buffer GraphQL `createPost` pra YT exige `assets[].video.url` público
- Buffer faz pre-check de `Content-Length` header antes de aceitar — rejeita com `UnexpectedError: Video URL returned zero content-length` se o host serve via chunked-transfer
- Hosts anônimos populares (catbox.moe, 0x0.st, etc.) servem chunked → não funcionam
- Únicas opções de host válidas: S3/R2 com Content-Length explícito, ou GitHub Releases — adiciona dependência sem benefício
- Mesmo se host servir Content-Length, `schedulingType=notification` (default pra YT no Buffer) é só lembrete pro Buffer mobile app — não auto-publica
- `schedulingType=automatic` precisaria OAuth scope que Buffer não inclui pra YT no flow padrão

Resultado: pra YT, Buffer adiciona overhead (host bridge) sem entregar valor (não auto-publica). Direct API é mais simples e durável.

LinkedIn / X / Threads / IG / FB / Bluesky continuam via Buffer GraphQL — Buffer abstrai bem essas APIs (especialmente LinkedIn, que tem API direta horrível pra approve).

## Validações

1. **Title ≤ 100 chars** — se passa, YT API rejeita
2. **Description ≤ 5000 chars**
3. **Tags concatenated ≤ 500 chars** (separadas por vírgula, mas YT conta a string total)
4. **categoryId is valid YT category** (ver tabela; algumas categorias são region-specific)
5. **publishAt no futuro** se privacy=private (YT rejeita past timestamps)
6. **File size ≤ 256GB OR 12h** (free account 15min max sem verification; até 12h após verification)
7. **MIME video/* aceito** (mp4, mov, avi, etc.; mp4 recomendado pra compatibilidade)

## Erros comuns

| Erro | Causa | Fix |
|------|-------|-----|
| `quotaExceeded` | Estourou 10k/dia | Esperar reset 00:00 PST OU solicitar quota increase |
| `youtubeSignupRequired` | Conta Google não tem canal YT criado | Criar canal em youtube.com/account |
| `videoChartNotFound` ou similar | API key sem scope | Re-autorize com `youtube.upload` no scope list |
| `Access blocked: app has not completed verification` | OAuth consent em testing, user não é Test User | Add email no Test Users do consent screen |
| `invalid_grant` | Token expirou e refresh falhou | Apaga token cacheado, re-OAuth |
| `forbidden` no thumbnails.set | Canal não habilitado pra custom thumbnails (precisa verification do canal — phone) | Verifica canal em youtube.com/verify |

## Princípios

- **OAuth one-time, scriptable forever.** Browser dance só na primeira execução; depois disso 100% automatizado.
- **Idempotente.** Re-rodar batch.py com mesmo batch.json pula items já feitos (lookup em results.json por `id`).
- **Stateless single-video.** `yt-upload.py` não persiste estado entre runs — orchestration é responsibility do `yt-batch.py` ou do `/publish` command.
- **Sem segredos no batch.json.** API key/token vivem em `~/.ciromacielos/google-cloud/` (chmod 600). batch.json fica safe pra commit no repo do client (não tem credenciais).
- **Resumable upload.** Chunks de 4MB. Falha de rede mid-upload? YT API client retoma do último chunk OK.

## Não faça

- Não criar `audio-script.json` ou regenerar video — este skill só publica MP4 já renderizado
- Não rodar render do Remotion — isso é do command `/render-video`
- Não publicar via Buffer pra YouTube — ver "Por que não Buffer" acima
- Não commitar `yt-upload-credentials.json` ou `yt-upload-token.json` em repo nenhum (estão em `~/.ciromacielos/` por isso — global, gitignored por convenção)
- Não setar `--privacy public` pra agendar — use `private` + `publish-at`. Public ignora publishAt e fica live na hora do upload.
