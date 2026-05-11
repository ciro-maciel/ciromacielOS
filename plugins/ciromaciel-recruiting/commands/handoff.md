---
description: Fase 9 — Pré-onboarding e handoff para HRIS. Previne no-shows entre offer e day 1.
---

Você foi invocado pelo comando `/handoff`. Fase 9: transição de candidato hired para employee.

Confirme:
1. Candidato (path)
2. Status: `offer-accepted` (não roda antes disso)
3. Start date acordada

Este é o estágio onde mais hires são perdidos. Entre offer accepted e day 1 existe risco real de:
- Counter-offer do empregador atual aceito tardiamente
- Cold feet do candidato
- Concorrente reaparecendo

## Output em `candidates/<candidate-slug>/handoff.md`

### Checklist pré-boarding (a executar PELO recruiter, não delegar ao IT)

**T-30 a T-14 dias antes do start**
- [ ] Documentos coletados: contrato assinado, identidade, dados bancários, NDA
- [ ] Welcome e-mail personalizado do hiring manager (não template — assinado e específico)
- [ ] Comunicação de equipamento (Mac/PC, monitores, etc.)
- [ ] Check-in semanal do recruiter (informal — "alguma dúvida? algo mudou?")

**T-14 a T-7 dias**
- [ ] Confirmação do start date escrita
- [ ] Provisionamento de IT iniciado (contas, e-mail, ferramentas)
- [ ] Onboarding plan da semana 1 enviado (reduz ansiedade)
- [ ] Calendar invites para week 1 enviados (sinaliza "te esperamos mesmo")

**T-7 a T-1 dia**
- [ ] Equipamento enviado / pronto para retirada
- [ ] Final check-in call do recruiter — "tudo bem? alguma dúvida?"
- [ ] Hiring manager faz um touch (LinkedIn message, e-mail) na véspera
- [ ] Buddy/onboarding partner designado e apresentado

**Day 1**
- [ ] First-day plan claro (não improvisar)
- [ ] Welcome lunch / coffee
- [ ] HR onboarding session
- [ ] First 1:1 com manager agendada

### Handoff técnico ao HRIS

A partir do `Hire` event (offer accepted), o ATS deixa de ser source of truth. Disparar:
- **HRIS** (Workday / BambooHR / Gupy / Sólides / etc.) — criar employee record
- **IT** — provisionar contas (SSO, e-mail, ferramentas), pedido de equipamento
- **Facilities** (se presencial) — mesa, acesso, badge
- **Payroll** — folha, benefícios, dependentes

Liste integrações relevantes do cliente em `clients/<cliente>/integrations.md` (criar se não existir):
- HRIS usado
- Sistema de provisionamento
- Quem é o contato de IT para handoff

### No-show risk assessment

Sinais de risco a monitorar:
- Candidato para de responder e-mails → 🚨 ligue imediatamente
- Start date push request → entenda razão (legítimo vs sinal de hesitação)
- "Tive uma nova oportunidade" → counter-offer playbook (raramente vale revisar oferta — usualmente é sinal de fit ruim)

### Atualizações finais

- `application.md` → stage `Hired` com data
- `pipeline.md` → mover de active para hired
- Vaga: se única hire, fechar; se múltiplas hires, continuar
- Disparar feedback survey ao candidato (candidate experience NPS)
- Disparar feedback do hiring manager (recruiter satisfaction)

Após day 1 confirmed: arquive em `clients/<cliente>/jobs/<job-slug>/closed/`.
