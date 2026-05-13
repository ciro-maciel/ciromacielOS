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

### Social orgânico via Buffer (LinkedIn pessoal/empresa, X/Twitter, Instagram, Facebook, Threads, Bluesky)

**Default path** pra todo orgânico. Buffer é o agregador configurado em `/setup` (Bloco C).

#### Setup once por sessão — descobrir profiles

Na primeira publicação orgânica da sessão, liste os profiles conectados:

```bash
curl -sS "https://api.bufferapp.com/1/profiles.json?access_token=$BUFFER_ACCESS_TOKEN" \
  | jq -r '.[] | "- \(.service): \(.formatted_username) → id=\(.id)"'
```

Guarde o mapa `service → profile_id` em memória durante a sessão (não persista). Se um canal previsto pelo calendar não aparece nos profiles, **halt e pergunte ao usuário** se quer pular ou conectar o canal no Buffer antes.

#### Para CADA item orgânico aprovado

1. **Mapeie canal → profile_id** usando o mapa acima
2. **Renderize o texto final** (substitua qualquer `{{var}}` que ficou no asset — se sobrar variável não-resolvida, halt)
3. **Decida agora vs agendar**:
   - Aprovação `[a]` (publicar agora) → POST sem `scheduled_at`, com `now=true`
   - Aprovação `[s]` (agendar) → POST com `scheduled_at=<unix timestamp da hora do calendar>`
4. **Chame a API**:

```bash
# Publicar agora
curl -sS -X POST https://api.bufferapp.com/1/updates/create.json \
  -d "access_token=$BUFFER_ACCESS_TOKEN" \
  -d "profile_ids[]=$PROFILE_ID" \
  -d "text=$ENCODED_TEXT" \
  -d "now=true"

# OU agendar pra hora X
curl -sS -X POST https://api.bufferapp.com/1/updates/create.json \
  -d "access_token=$BUFFER_ACCESS_TOKEN" \
  -d "profile_ids[]=$PROFILE_ID" \
  -d "text=$ENCODED_TEXT" \
  -d "scheduled_at=$UNIX_TIMESTAMP"
```

Para posts com **mídia** (carrossel IG, imagem LinkedIn, vídeo orgânico):
- Adicione `-d "media[link]=https://..."` ou `-d "media[photo]=https://..."`
- Para vídeo (Reel/Short/post de LinkedIn) — Buffer aceita URL pública do MP4. Antes do POST, faça upload do `out.mp4` pra um host público temporário (S3, R2, ou Buffer's media endpoint se MCP disponível) e use a URL retornada. Se upload não rolar, fallback manual.

5. **Parse a resposta**. Status 200 + `success: true` → ok. Captura `update.id` e `update.created_at` pra registrar.
6. **Update calendar**:
   - `published <timestamp> via Buffer (update_id: <id>)` se foi `now=true`
   - `scheduled <timestamp> via Buffer (update_id: <id>)` se foi `scheduled_at`

#### Limites e falhas comuns

| Erro | Resposta | Ação |
|------|----------|------|
| 403 invalid token | `code: 1003` | Halt sessão. Rode `/setup rotate buffer_access_token`. |
| Profile não conectado | `code: 1006` | Halt esse item, marque skipped + motivo. Pede pro usuário conectar no Buffer. |
| Free tier limite (10 posts agendados/canal) | `code: 1042` | Halt, sugere fallback manual ou upgrade Buffer. |
| Rate limit | 429 | Espera 60s + retry 1 vez. Se falhar de novo, halt. |
| Texto excede limite do canal (X = 280, LinkedIn = 3000, etc.) | `code: 1027` | Halt item, mostra qual canal/limite, manda voltar pro `/execute` regenerar mais curto. |

**Nunca retry silencioso em loop.** 1 retry no 429, no resto: halt + reporte.

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
