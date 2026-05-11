---
description: Fase 8 — Calibragem de pacote, oferta verbal, oferta escrita, handling de negociação.
---

Você foi invocado pelo comando `/offer`. Fase 8: estender e fechar oferta.

Confirme:
1. Candidato (path)
2. Decisão final de hire confirmada (`decision.md` com Strong Yes ou Yes)
3. Stage atual: `calibrate` / `verbal` / `written` / `negotiation` / `final`

Pré-requisitos:
- `decision.md` com aprovação
- `references.md` clear ou consider explicitamente aceito pelo hiring manager
- Background check clear (se aplicável ao cliente)

## Stage `calibrate`

Execute skill `offer-package-calibrator`. Inputs:
- Comp band da vaga (da requisition)
- Senioridade calibrada nas entrevistas (pode diferir do nível anunciado — ajuste leveling)
- Salary expectation captured no phone screen
- Competing offers do candidato (se mencionados)
- Equity refresh schedule do cliente

Output em `candidates/<candidate-slug>/offer.md`:
- Pacote proposto: base + equity + sign-on + benefits
- Target vs max (sala de negociação)
- Comp ratio vs band (50% = mid, 75% = strong, 90%+ = preserve para hires excepcionais)
- Aprovações necessárias (hiring manager / comp / finance / exec)

Se houver agent `comp-researcher`, ofereça delegar pesquisa de benchmarks (Levels.fyi, salary.com, dados do cliente).

## Stage `verbal`

Gere script para verbal offer call (~20min):
1. **Abertura entusiasmada** — "decisão unânime", "queremos você no time"
2. **Pacote completo** — base, equity (com explicação de vesting), sign-on, benefits, start date
3. **Por que essa pessoa, especificamente** — 2-3 razões concretas (não genéricas)
4. **Tempo para responder** — 5-7 dias úteis
5. **Captura de objeções** — escute, anote, NÃO negocie no momento

Após call, registre objeções em `offer.md` para handling estruturado.

## Stage `written`

Gere offer letter usando template do cliente (procure em `clients/<cliente>/templates/offer-letter.md`; se não existir, peça).

Variáveis a substituir: nome, role, level, base, equity, sign-on, start date, manager, prazo de resposta.

Output em `candidates/<candidate-slug>/offer-letter.md`.

Lembrete: e-signature (DocuSign/equivalente) deve ser o método — não use PDF assinado a mão.

## Stage `negotiation`

Para cada counter-offer, capture estruturado:
- O que o candidato pediu
- Justificativa (competing offer? expectativa? ?)
- Resposta proposta (accept / counter / hold)
- Aprovação necessária (se acima de threshold)

Playbook:
- Counter razoável (até 10% do base) + competing offer documentado → geralmente accept
- Counter agressivo sem justificativa → counter intermediário ou hold
- Pedido de role/title bump → cuidado, dispara leveling rediscussion

## Stage `final`

Resultado em `offer.md`:
- `Accepted` — atualize stage para Offer Accepted, dispare Fase 9 (`/handoff`)
- `Declined` — capture reason code obrigatório (comp / role / location / competing-offer / personal / counter-from-current-employer)
  - Adicione candidato ao talent pool se forte
  - Pós-mortem: o que poderíamos ter feito diferente?

Atualize `application.md` e `pipeline.md` em qualquer caso.
