---
name: weekly-review
description: >
  Conduz a revisão semanal (60 min) — peça mais importante do sistema. Estrutura GTD (David Allen) + AAR (US Army After Action Review) + Schön reflective practitioner. Produz reviews/weekly-<YYYY-MM-DD>.md com decisões DOBRAR/REFINE/MATAR/MANTER.
tags: [career, review]
---

# Weekly Review

Skill pura de raciocínio. Conduz a **weekly review** — a peça mais importante e mais negligenciada do sistema de carreira.

**David Allen** (*Getting Things Done*): sem weekly review, o sistema vira lixo em 3 semanas. Não importa o quão bom o planejamento foi — sem revisão semanal, OKRs morrem.

**US Army AAR** (After Action Review): 4 perguntas que destroem auto-engano.

**Donald Schön** (*The Reflective Practitioner*, 1983): profissionais excepcionais fazem reflection-in-action E reflection-on-action. Maioria só faz a segunda — e mal.

## Quando usar

- Toda sexta tarde ou domingo (escolha um e mantenha)
- Disparado por `/career-review weekly`
- 60 minutos, calendário bloqueado, sem celular

## Pré-requisitos

Leia:
- `dashboard/journal-<YYYY-MM>.md` — últimos 7 dias de journal
- `dashboard/metrics.md` — KPIs atuais
- `plan/okrs-<YYYY-QQ>.md` — OKRs do trimestre
- `reviews/weekly-<semana-anterior>.md` — review da semana anterior (continuidade)

## Estrutura — 5 partes em 60 min

### Parte 1 — Clear (15 min)

GTD: inbox zero antes de tudo. Cabeça suja não pensa claro.

Pergunte / passe checklist:
- [ ] Email zero (mover, responder, arquivar)
- [ ] Slack/Discord/Teams unread
- [ ] Linear / Jira / Notion inbox zero
- [ ] Mensagens em WhatsApp respondidas (pelo menos lidas)
- [ ] Papel da semana digitalizado / arquivado
- [ ] Downloads / desktop organizado
- [ ] Open loops anotados — qualquer pensamento incompleto vai pra captura

Sem clear, o resto fica difuso.

### Parte 2 — Get current (10 min)

Atualize números crus:

- [ ] `dashboard/metrics.md` atualizado (7 camadas — output, skill, rede, marca, capital, saúde, energia)
- [ ] Toggl / time tracker — quantas h de deep work essa semana? Quanto em prática deliberada por skill foco?
- [ ] Anki — dias em sequência? Backlog?
- [ ] CRM pessoal — quem contatou essa semana? Próximos contatos agendados?
- [ ] OKRs — % completion em cada KR

Output dessa parte: tabela atualizada de métricas + percentual dos KRs.

### Parte 3 — AAR (15 min)

US Army's After Action Review — 4 perguntas. Resposta honesta, escrita.

1. **O que era esperado nessa semana?**
   (Volte ao plano da semana passada. O que você prometeu pra você?)

2. **O que aconteceu de fato?**
   (Sem maquiagem. Se você não fez X, escreva "não fiz X".)

3. **Por que a diferença?**
   (Cave a causa raiz. "Procrastinei" não vale — por que procrastinou? Sono ruim? Bloqueio mental? Energia baixa? Distração específica? Reunião desnecessária?)

4. **O que repetir / mudar na próxima?**
   (Concreto: ação, não intenção. "Vou focar mais" não vale. "Vou bloquear 9h-11h sem celular" vale.)

### Parte 4 — Decidir DOBRAR/REFINE/MATAR/MANTER (10 min)

Para cada vetor (skill, rede, marca, saúde, capital), pergunte:

| Vetor | Status | Decisão |
|-------|--------|---------|
| Skill | Como foi essa semana? | DOBRAR / REFINE / MATAR / MANTER |
| Rede | Quantos cafés? Novos contatos? | _ |
| Marca | Posts publicados? Engajamento qualificado? | _ |
| Saúde | Sono / treinos / energia | _ |
| Capital | Investimentos / despesa / runway | _ |

**Definições:**
- **DOBRAR** — está funcionando, escale (mais horas, mais cadência, mais investimento)
- **REFINE** — está funcionando mas ajusta (cadência, formato, time of day)
- **MATAR** — não está funcionando, corta (skill que não engaja, plataforma errada, hábito que falha 3 sem seguidas)
- **MANTER** — está em estado estável, não mexe — continua

**Regra dura:** se um vetor está em MANTER por 4 semanas seguidas, force DOBRAR ou MATAR. Inércia é o inimigo.

### Parte 5 — Plan próxima semana (10 min)

Planeje a próxima semana **antes de fechar a atual**. Senão segunda começa em caos.

- **Top 3 da semana** — 3 entregas concretas (não tarefas). Se tivesse só esses 3 prontos, semana valeu.
- **Calendário bloqueado** — abra calendário, mova compromissos, reserve blocos de deep work (mín 2h/dia).
- **Coisas a recusar** — quem você precisa dizer "não" essa semana? Mande mensagem agora.
- **Pessoa a contatar** — 1 weak tie pra retomar contato. Mande mensagem agora ou agende.
- **1 risco** — o que pode dar errado? Plano B?

Output: lista visível durante a semana (Notion / Apple Notes / papel na mesa — não enterrada).

## Output do weekly review

Salve em `reviews/weekly-<YYYY-MM-DD>.md`:

```markdown
# Weekly Review — <YYYY-MM-DD>

## Métricas

| Camada | Métrica | Valor | vs Semana anterior | Status OKR |
|--------|---------|-------|-------------------|-----------|
| Output | Entregas com impacto | _ | _ | _ |
| Skill | Horas prática deliberada [skill] | _ | _ | _ |
| Rede | Cafés novos | _ | _ | _ |
| Marca | Posts + inbound | _ | _ | _ |
| Saúde | Sono médio / treinos | _ | _ | _ |
| Capital | Δ patrimônio / Δ runway | _ | _ | _ |
| Energia | Média 1-5 | _ | _ | — |

## AAR

**Esperado:**
- _
- _

**Aconteceu:**
- _
- _

**Por quê:**
- _

**Próxima:**
- _

## Decisões DOBRAR/REFINE/MATAR/MANTER

- Skill: _ — por quê: _
- Rede: _ — por quê: _
- Marca: _ — por quê: _
- Saúde: _ — por quê: _
- Capital: _ — por quê: _

## Reflection-on-action (Schön)

[1 parágrafo: o que você aprendeu sobre você mesmo essa semana — padrão de comportamento, gatilho de procrastinação, fonte de energia descoberta, decisão que parecia certa e foi errada]

## Próxima semana

### Top 3
1. _
2. _
3. _

### Recusar
- _

### Contatar
- _

### Risco
- _

## Open loops pra próxima
- _
- _

## Estado mental ao fechar a semana

[1 frase ou emoji ou nota — sirva-se]
```

## Princípios duros

- **60 min fechados, semanalmente. Senão, não funciona.** Coloque no calendário como reunião com você mesmo.
- **Brutalmente honesto.** Review pra "ficar bem" é pior que não fazer. O futuro-você precisa do dado real.
- **Decida.** Cada vetor tem 1 decisão (DOBRAR/REFINE/MATAR/MANTER), não 3 opções abertas.
- **Plan ANTES de fechar.** Segunda começa com pista, não no escuro.
- **Continuidade.** Releia review da semana anterior antes de começar — captura o que ficou pendente.

## Quando pular o weekly review

- Doente / luto / emergência genuína → pula 1, retoma na próxima
- Férias → mantém em formato curto (15 min) ou pula com data marcada de retorno
- > 2 semanas seguidas pulando → o sistema parou. Reagende /career-execute pra reconstruir cadência.

## Erros comuns

| Erro | Como evita |
|------|-----------|
| Marcar mas não fazer | Coloca em calendário recorrente fixo, sem flex |
| Fazer rápido (10 min) | Bloqueio de 60 min ou não vale |
| Não escrever (só "pensar") | Escrever força clareza — sem markdown, esquece |
| Só celebrar wins | AAR inclui o que não rolou. Sem isso, é propaganda |
| Plano de próxima semana vago | Top 3 concretos, calendário aberto |
| Não reler na próxima sem | Continuidade é o ponto |

## Ligação com outras skills

- `okr-quarterly` é o input principal — KRs são revisados aqui
- `dashboard/metrics.md` é o substrato — números vivem aqui
- Mensal: 4 weeklies → `monthly review` (`/career-review monthly`)
- Trimestral: fecha OKRs (`/career-review quarterly`)
