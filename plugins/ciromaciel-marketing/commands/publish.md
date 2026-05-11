---
description: Fase 7 — Publish. Revisão gate item-por-item antes de publicar de fato (LinkedIn, email, blog, ads).
---

Você foi invocado pelo comando `/publish`. Esta é a etapa de publicação real.

Fluxo até aqui: `/discovery` → `/research` → `/strategy` → `/new-campaign` → `/execute` → `/distribute` → **`/publish`**.

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

Se calendar não existir, pare e oriente o usuário a rodar `/distribute` primeiro.

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

### LinkedIn (orgânico — pessoal ou empresa)

Não há MCP server oficial estável da LinkedIn. Hoje o caminho confiável é:

1. Mostre o copy formatado pronto pra colar
2. Abra (ou peça pro usuário abrir) o LinkedIn no browser
3. Aguarde confirmação ("publiquei") do usuário
4. Marque published

Se houver MCP server de LinkedIn instalado (verifique listando MCPs disponíveis), use-o. Caso contrário, modo manual acima.

### LinkedIn Ads / Meta Ads / Google Ads

Nunca publique ads automaticamente. Sempre:
1. Mostre o payload de ad (headline, body, image direction, targeting, budget)
2. Diga ao usuário: "Cole este payload no [plataforma]. Não toco em ads gastando dinheiro sem você revisar na própria plataforma."
3. Aguarde "ok publicado"
4. Marque published com link da campanha (peça ao usuário)

### Email outbound (Smartlead / Instantly / Lemlist)

Se tem MCP server da ferramenta → use.
Caso contrário:
1. Confirme com usuário qual lista vai receber
2. Mostre o snippet final renderizado pra 1-2 contatos exemplo (com variáveis substituídas)
3. Confirme deliverability básica (DKIM/SPF configurados? domínio aquecido?)
4. Peça o "go" final
5. Como você não tem API, exporte CSV pronto pra importar e diga ao usuário "importe e dê start"
6. Aguarde "iniciei" do usuário
7. Marque published

### Email nurture (Mailchimp / Hubspot / Resend / ConvertKit)

Mesmo padrão: MCP se disponível, senão exporte JSON/CSV e mande pro usuário.

### Blog / CMS (próprio, WordPress, Webflow, Ghost)

Se houver MCP ou API integrada → use.
Caso contrário, exporte o markdown final + frontmatter (título, slug, meta description, OG image, tags) e instrua o usuário a publicar.

### X / Twitter

Mesmo padrão LinkedIn — quase sempre manual ou via Buffer/Typefully.

### Buffer / Hypefury (agregadores)

Se houver MCP do Buffer → use pra agendar (ainda assim peça aprovação por item).
Caso contrário, exporte CSV no formato Buffer e instrua importação.

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
