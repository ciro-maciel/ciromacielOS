---
description: "[8/9] Publish — revisão gate item-por-item antes de publicar de fato (LinkedIn, email, blog, ads, vídeos)."
---

Você foi invocado pelo comando `/publish`. Esta é a etapa de publicação real.

Fluxo: `/discovery` → `/research` → `/strategy` → `/new-campaign` → `/execute` → `/render` → `/distribute` → **`/publish`** → `/measure`.

## Princípio inegociável: nada publica sem aprovação humana

Você nunca publica silenciosamente. Cada item passa por:

```
1. Mostrar conteúdo completo + canal + hora agendada
2. Pedir aprovação explícita ("publicar agora? aprovar e agendar? editar? pular?")
3. Só DEPOIS da aprovação, chamar a integração
4. Marcar status no calendar
```

Se o usuário não responde com "sim", "aprovado", "publicar" ou equivalente claro — você NÃO publica. Hedge = não.

## Pré-requisitos

- `clients/<nome>/campaigns/<campaign>-calendar.md` (output do `/distribute`)
- Assets em `clients/<nome>/campaigns/<campaign>-assets/`
- **Para canais sociais orgânicos:** `BUFFER_ACCESS_TOKEN` no env (configurar via `/setup` se faltar — Bloco C)

Se calendar não existir, pare e oriente o usuário a rodar `/distribute` primeiro.
Se for publicar em LinkedIn/X/IG/FB orgânico e `BUFFER_ACCESS_TOKEN` não estiver setado, avise e ofereça: (a) rodar `/setup` antes ou (b) fallback pra modo manual (copy → o usuário publica à mão). Default = (a), porque manual cansa rápido.

## Passo 1 — Triagem do que publicar

Leia o calendar. Liste os itens com status `pending` (ainda não publicados).

Pergunte ao usuário:
1. Publicar **todos os pendentes** desta sessão? Ou
2. Publicar **só os de hoje** (com base na data agendada)? Ou
3. Publicar **um item específico** (você lista os pendentes e ele escolhe)?

## Passo 2 — Loop de revisão (item por item)

Para cada item aprovado pra publicação nesta sessão:

### 2.1 Mostre o item completo

```
─────────────────────────────────────────────
Item N de M

📅 Agendado: <data> <hora> (<timezone>)
📣 Canal: <canal>
👤 Owner: <owner>
📄 Asset: <path do arquivo>

──── CONTEÚDO ────

<copie o conteúdo integral do arquivo de asset>

──── METADATA ────
- Subject line / headline: <se aplicável>
- CTA: <copy do CTA>
- Variáveis a substituir: <list — ex: {{firstName}}, {{companyName}}>
- Targeting (ads): <se aplicável>
- Lista de destinatários (email outbound): <segmento ou path do CSV>

─────────────────────────────────────────────
```

### 2.2 Pergunte ao usuário

```
Decisão pra este item:
  [a] Aprovar e publicar AGORA
  [s] Aprovar e AGENDAR pra <hora agendada>
  [e] Editar antes de publicar (você me passa o que mudar)
  [p] Pular este item (marcar como skipped)
  [q] Parar a sessão de publicação aqui
```

Espere a resposta clara. Se hedge ("acho que sim", "talvez", "depois eu vejo") → trate como **pular** e marque o item como `pending` ainda.

### 2.3 Se aprovado → publicar

Veja a tabela de handlers abaixo. Cada canal tem um caminho de publicação.

### 2.4 Atualizar o calendar

Após publicar (ou pular), edite `<campaign>-calendar.md`:
- `pending` → `published <timestamp>` se foi publicado
- `pending` → `scheduled <timestamp>` se foi agendado
- `pending` → `skipped <motivo curto>` se foi pulado
- `pending` → `edited` se o usuário editou (mantenha pending até nova aprovação)

## Passo 3 — Handlers por canal

A tabela define como publicar em cada canal. Verifique disponibilidade antes de tentar — não invente integração.

### Social orgânico via Buffer (LinkedIn pessoal/empresa, X/Twitter, Instagram, Facebook, Threads, Bluesky, TikTok, YouTube)

**Default path** pra todo orgânico. Buffer é o agregador configurado em `/setup` (Bloco C).

**API:** Buffer migrou de REST v1 para GraphQL. Endpoint único:
- `POST https://api.buffer.com/graphql`
- Header: `Authorization: Bearer $BUFFER_ACCESS_TOKEN`
- Header: `Content-Type: application/json`

O endpoint antigo (`api.bufferapp.com/1/...?access_token=`) retorna 401 "OIDC tokens are not accepted for direct API access" — não use.

#### Setup once por sessão — descobrir channels

Na primeira publicação orgânica da sessão, leia o `organization_id` de `~/.ciromacielos/config.yaml` → `buffer.organization_id` e liste os channels conectados via GraphQL:

```bash
curl -sS -X POST https://api.buffer.com/graphql \
  -H "Authorization: Bearer $BUFFER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ account { currentOrganization { id channels { id service name displayName isDisconnected } } } }"}' \
  | jq -r '.data.account.currentOrganization.channels[] | "- \(.service): \(.displayName) → id=\(.id) \(if .isDisconnected then \"[DISCONNECTED]\" else \"\" end)"'
```

Guarde o mapa `service → channelId` em memória durante a sessão (não persista). Se um canal previsto pelo calendar não aparece nos channels, ou aparece como `isDisconnected: true`, **halt e pergunte ao usuário** se quer pular ou reconectar o canal no Buffer antes.

#### Para CADA item orgânico aprovado

1. **Mapeie canal → channelId** usando o mapa acima
2. **Renderize o texto final** (substitua qualquer `{{var}}` que ficou no asset — se sobrar variável não-resolvida, halt)
3. **Determine `schedulingType`** — depende do serviço:
   - `automatic` (Buffer publica nativo via API da rede): LinkedIn, X/Twitter, Facebook Page, Threads, Bluesky, Mastodon, Instagram Business
   - `notification` (Buffer manda push pro celular do usuário, que publica manual): Instagram pessoal, TikTok não-eligível, YouTube Shorts/longform — qualquer caso onde a rede não permite auto-publish
   - Quando em dúvida, comece com `automatic` — se a API retornar `RestProxyError` indicando que a conexão não suporta, faça halt e instrua o usuário a reconectar como Business / habilitar autoposting.
4. **Determine `dueAt`** (ISO 8601 UTC):
   - Aprovação `[a]` (publicar agora) → use o timestamp atual em UTC (ex: `2026-05-15T14:32:00Z`). Buffer enfileira e publica no próximo worker tick (~30s).
   - Aprovação `[s]` (agendar) → use o ISO 8601 da hora do calendar, convertido pra UTC.
   - Buffer requer `dueAt` em UTC com sufixo `Z`. Não passe timestamp Unix.
5. **Monte a mutation**:

```bash
# Variáveis
TEXT_JSON=$(jq -Rs . <<< "$POST_TEXT")        # escapa quebras de linha e aspas
DUE_AT="2026-05-15T14:32:00Z"                  # ISO 8601 UTC
CHANNEL_ID="6a0438b5090476fb9914cd91"
SCHEDULING="automatic"                          # ou "notification"

MUTATION=$(cat <<EOF
mutation CreatePost(\$input: CreatePostInput!) {
  createPost(input: \$input) {
    __typename
    ... on PostActionSuccess { post { id status dueAt } }
    ... on InvalidInputError { message }
    ... on LimitReachedError { message }
    ... on UnauthorizedError { message }
    ... on NotFoundError { message }
    ... on RestProxyError { message code link }
    ... on UnexpectedError { message }
  }
}
EOF
)

curl -sS -X POST https://api.buffer.com/graphql \
  -H "Authorization: Bearer $BUFFER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(jq -n \
    --arg q "$MUTATION" \
    --arg ch "$CHANNEL_ID" \
    --arg t "$POST_TEXT" \
    --arg d "$DUE_AT" \
    --arg s "$SCHEDULING" \
    '{query:$q, variables:{input:{channelId:$ch, text:$t, dueAt:$d, schedulingType:$s, assets:[], tagIds:[]}}}')"
```

Notas críticas do schema:
- `assets: []` é **obrigatório** (NON_NULL list) — passe array vazio pra post text-only, não omita.
- `channelId` e `schedulingType` são NON_NULL — sempre presentes.
- `text` é opcional no schema, mas obrigatório na prática pra todo canal exceto post-só-mídia.
- `metadata: { linkedin: {...}, twitter: {...}, ... }` só é necessário pra coisas avançadas (LinkedIn poll, X thread, IG carrossel ordering). Pra post simples, omita.

Para posts com **mídia** (carrossel IG, imagem LinkedIn, vídeo orgânico), preencha `assets`:

```graphql
assets: [
  { image: { url: "https://...", alt: "..." } }
  # ou { video: { url: "https://...", thumbnailUrl: "..." } }
  # ou { document: { url: "https://...", title: "..." } }
  # ou { link: { url: "https://...", title: "...", description: "..." } }
]
```

Para vídeo (Reel/Short/post de LinkedIn) — Buffer aceita URL pública do MP4. Antes da mutation, faça upload do `out.mp4` pra um host público temporário (S3, R2) e use a URL retornada. Se upload não rolar, fallback manual.

6. **Parse a resposta**. Cheque `data.createPost.__typename`:
   - `PostActionSuccess` → ok. Captura `post.id` e `post.dueAt` pra registrar.
   - Qualquer outro variant → erro estruturado, ver tabela abaixo.
7. **Update calendar**:
   - `published <timestamp> via Buffer (post_id: <id>)` se `dueAt` foi "agora"
   - `scheduled <dueAt> via Buffer (post_id: <id>)` se foi futuro

#### Erros — variants do `PostActionPayload`

A API GraphQL retorna HTTP 200 mesmo em erro de domínio; o que importa é `__typename` da resposta. Top-level HTTP/network erros (401, 5xx) também podem ocorrer.

| `__typename` ou HTTP | Significado | Ação |
|---------------------|-------------|------|
| `UnauthorizedError` ou HTTP 401 | Token inválido/expirado | Halt sessão. Rode `/setup rotate buffer_access_token`. |
| `NotFoundError` | `channelId` desconhecido pra esse org | Halt esse item, marque skipped. Confirme o mapa channelId (re-roda discovery). |
| `LimitReachedError` | Free tier estourou (10 posts agendados/canal, etc.) | Halt, sugere fallback manual ou upgrade Buffer. |
| `InvalidInputError` | Payload malformado — `dueAt` no passado, texto vazio, asset URL inválida, texto excede limite da rede (X=280, LinkedIn=3000, Threads=500, Bluesky=300) | Halt item. Leia `message` — se for limite de chars, volta pro `/execute` regenerar. |
| `RestProxyError` | A rede social rejeitou (LinkedIn API down, Instagram nega connection, etc.). Tem `code` e às vezes `link` pra ajuda. | Halt item. Mostra `message` + `code` pro usuário decidir. Não retry automático — pode ser content policy. |
| `UnexpectedError` | Buffer interno | Espera 60s + retry 1 vez. Se falhar de novo, halt. |
| HTTP 429 | Rate limit do GraphQL gateway | Espera 60s + retry 1 vez. Se falhar de novo, halt. |
| HTTP 5xx | Buffer fora do ar | Espera 60s + retry 1 vez. Halt depois. |

**Nunca retry silencioso em loop.** 1 retry pra 429/5xx/UnexpectedError. Resto: halt + reporte.

#### Fallback manual (sem Buffer)

Se `BUFFER_ACCESS_TOKEN` não está setado e usuário pediu pra prosseguir sem `/setup`:
1. Mostre o copy formatado pronto pra colar
2. Diga ao usuário em qual canal/perfil postar
3. Aguarde confirmação ("publiquei") do usuário
4. Marque `published <timestamp> manually` no calendar

### LinkedIn Ads / Meta Ads / Google Ads

**Nunca** automatize ads, mesmo com Buffer (Buffer não faz ads pagos de qualquer forma). Sempre:
1. Mostre o payload de ad (headline, body, image direction, targeting, budget)
2. Diga ao usuário: "Cole este payload no [plataforma]. Não toco em ads gastando dinheiro sem você revisar na própria plataforma."
3. Aguarde "ok publicado"
4. Marque `published <timestamp> manually — campaign_url: <peça ao usuário>` no calendar

### Email outbound (Smartlead / Instantly / Lemlist)

Sem integração API configurada hoje. Fluxo:
1. Confirme com usuário qual lista vai receber
2. Mostre o snippet final renderizado pra 1-2 contatos exemplo (com variáveis substituídas)
3. Confirme deliverability básica (DKIM/SPF configurados? domínio aquecido?)
4. Peça o "go" final
5. Exporte CSV pronto pra importar (`<campaign>-smartlead.csv` se gerado por `/distribute`) e diga ao usuário "importe e dê start"
6. Aguarde "iniciei" do usuário
7. Marque `published <timestamp> manually` no calendar

### Email nurture (Mailchimp / Hubspot / Resend / ConvertKit)

Mesmo padrão de outbound: exporte JSON/CSV e mande pro usuário. Nenhum MCP/API configurado hoje — se algum entrar, vira item de `/setup`.

### Blog / CMS (próprio, WordPress, Webflow, Ghost)

Exporte o markdown final + frontmatter (título, slug, meta description, OG image, tags) e instrua o usuário a publicar. Sem integração automatizada hoje.

## Passo 4 — Resumo da sessão

Ao fim da sessão (todos itens passaram OU usuário pediu `q`), produza um resumo:

```markdown
## Sessão de publicação — <YYYY-MM-DD HH:MM>

- ✅ Publicados: N
  - LinkedIn (orgânico): X
  - Cold email: X
  - Blog: X
  - ...
- 📅 Agendados: N
- ⏭️ Pulados: N (motivos: <list>)
- ✏️ Editados/pendentes nova aprovação: N

### Próxima janela de publicação
Próximo item pendente: <data> <hora> — `<asset>`

Rode `/publish` de novo quando chegar a hora.
```

Atualize o calendar com todos os status finais.

## Regras de ouro

1. **Nunca publique sem aprovação explícita por item.** Aprovação global "publica tudo" não vale — cada item individual.
2. **Nunca publique ads ou cold email pagos por engano.** Pra esses, sempre handoff manual mesmo que tenha API.
3. **Se editar, força re-aprovação.** Edit não é approve. Item editado volta pra fila com status pending.
4. **Marque o que aconteceu no calendar.** Sem rastro, retrospectiva fica impossível.
5. **Janela horária importa.** Se item está agendado pra amanhã 9h e usuário rodou `/publish` hoje, pergunte: agenda pra 9h ou publica agora?

## Não faça

- Não publique "em batch" sem revisão item-a-item
- Não chame APIs de plataformas sem ter verificado que a integração existe (MCP listado, env vars setadas, etc.)
- Não suma com erro silencioso — se uma integração falhar, pause e reporte ao usuário
- Não modifique conteúdo durante a publicação — se precisa editar, volte pra `/execute` (regenerar) ou edição manual com nova aprovação
