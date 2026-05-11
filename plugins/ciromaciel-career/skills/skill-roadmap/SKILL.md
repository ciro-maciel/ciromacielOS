---
name: skill-roadmap
description: >
  Mapeia o roadmap de skills da pessoa nos próximos 12 meses usando T/π/comb-shape (especialização vertical + amplitude lateral), 70-20-10 (Lombardo & Eichinger), prática deliberada (Ericsson) e skill stacking (Scott Adams). Produz plan/skill-roadmap.md.
tags: [career, planning, skill]
---

# Skill Roadmap

Skill pura de raciocínio. Define **quais habilidades** desenvolver, **em qual profundidade**, **em qual ordem** e **como** — baseado em 4 frameworks complementares.

## Frameworks aplicados

### 1. T → π → comb-shape (formato de competência)

| Estágio | Forma | Descrição |
|---------|-------|-----------|
| Generalista raso | _ | Sabe um pouco de tudo. Perde pra qualquer especialista. |
| **T** | T | 1 área profunda + amplitude lateral. Mínimo viável pra sênior. |
| **π** | π | 2 áreas profundas + amplitude. Início de pleno avançado / sênior. |
| **Comb** | ⊥⊥⊥ | 3-4 áreas profundas + amplitude. Staff / Principal / Senior leader. |

Comece especialista profundo em **1** área. Adicione segunda quando a primeira virar reflexo. Não tente paralelo.

### 2. Dreyfus Model (estágios de maestria)

| Nível | Característica | Como reconhecer |
|-------|---------------|-----------------|
| Novato | Segue regras | "Me diga o que fazer" |
| Iniciante avançado | Reconhece padrões básicos | Resolve casos simples sem ajuda |
| Competente | Planeja + escolhe abordagem | Decide entre 2-3 abordagens |
| Proficiente | Intuição em casos comuns | Vê o todo, não regras |
| Expert | Intuição em casos atípicos | Cria padrões novos |

Saber em qual estágio você está em cada skill evita Dunning-Kruger.

### 3. 70-20-10 (Lombardo & Eichinger, Center for Creative Leadership)

- **70%** do aprendizado real vem de **desafios no trabalho** (projetos que você ainda não sabe como entregar)
- **20%** vem de **relacionamentos** (mentor, sponsor, feedback, dupla com sênior)
- **10%** vem de **treinamento formal** (curso, livro, certificação)

Implicação: cursos sozinhos não viram skill. Tem que ter projeto + alguém criticando.

### 4. Prática deliberada (Anders Ericsson, *Peak*)

Não é repetição. É:
- **Zona de desconforto** (1 nível acima do confortável)
- **Feedback imediato** (loop curto)
- **Correção específica** (não "tente mais")
- **Foco total** (1 skill por sessão, não multitarefa)

1h de prática deliberada > 10h de execução automática.

### 5. Skill stacking (Scott Adams)

Ser **top 25%** em 3 habilidades complementares vale mais que **top 1%** em uma. Combinações raras são caras.

Exemplos:
- Engenheiro + escreve bem + entende negócio = staff/principal
- Designer + entende código + entende pesquisa de usuário = unicórnio
- Médico + sabe programar + sabe escrever = autor best-seller em saúde

## Quando usar

- "Quais skills priorizar próximos 12 meses?"
- "Como evoluo em [X]?"
- "Devo virar especialista ou generalista?"
- Disparado por `/career-plan` automaticamente.

## Pré-requisitos

Leia:
- `vision/bhag.md` — pra onde vai
- `market/gap-analysis.md` — quais skills faltam pro papel-alvo
- `self/anchor.md` — âncora informa formato (TF favorece profundidade; GM favorece amplitude)

## Phase 1 — Inventário atual

Pergunte:
- Liste 5–10 skills que você considera ter (técnicas + soft).
- Para cada, em qual estágio Dreyfus você está? (Novato → Expert)
- Em qual delas você é top 25%? Top 10%? Top 1%?
- Combinação rara que você já tem? (skill stack)

Honestidade: maioria sobreestima. Se você nunca recebeu feedback externo (cliente pagando, mentor explícito), provavelmente está 1 nível acima do real.

## Phase 2 — Skills-alvo dos próximos 12 meses

Limite: **2 skills foco** (profundidade) + **2 skills amplitude** (manutenção/expansão lateral). Não mais.

### Skills foco (profundidade)

Para cada, defina:
- Nome específico (não "programação" — "Rust async runtime internals")
- Por que essa (gap pro BHAG, pro papel-alvo)
- Estágio Dreyfus atual → alvo em 12 meses (ex: Competente → Proficiente)
- Métrica binária de "cheguei lá" (ex: "Contribuir feature aceita em projeto open-source X")
- 70%: 1 projeto real onde aplica
- 20%: 1 mentor ou crítico específico
- 10%: livro/curso de referência

### Skills amplitude (manutenção lateral)

Para cada, defina:
- Por que mantém / expande (utilidade lateral)
- Floor mínimo (ex: "manter inglês C1, não cair")
- Tempo/semana

## Phase 3 — Cadência semanal

Defina, em conjunto com `study-protocol`:
- Quantas horas/semana de prática deliberada por skill foco? (mín 5h/semana = ~250h/ano. 1h/dia)
- Que dia, que bloco? (em ligação com `execute/weekly-blocks.md`)
- Como mede progresso? (Toggl, journal, output)

## Phase 4 — Skill stack pretendido em 3 anos

Liste 3-4 skills que, combinadas, te tornam raro no mercado. Exemplo:

> Em 3 anos quero ter: distributed systems (proficient) + writing/communication (proficient) + business sense em SaaS B2B (competent) + design literacy (advanced beginner). Essa combinação rara me posiciona como Staff Engineer em scale-up.

## Phase 5 — Output

Salve em `plan/skill-roadmap.md`:

```markdown
# Skill Roadmap — <nome>
Atualizado: <YYYY-MM-DD> | Revisar: trimestral

## Inventário atual

| Skill | Dreyfus | Top % | Onde uso |
|-------|---------|-------|----------|
| _ | _ | _ | _ |
| _ | _ | _ | _ |

## Skill stack rara atual

[1 parágrafo sobre que combinação rara você JÁ tem]

## Próximos 12 meses

### Foco 1: [skill]
- Por quê: [gap / valor]
- Estágio: [atual] → [alvo]
- Métrica: [binária]
- 70% (projeto): _
- 20% (mentor/crítico): _
- 10% (livro/curso): _
- Cadência: _ h/semana

### Foco 2: [skill]
...

### Amplitude (manutenção):
- [skill] — floor: _ — tempo: _ h/semana
- [skill] — floor: _ — tempo: _ h/semana

## Skill stack alvo em 3 anos

[parágrafo descritivo + lista]

## Anti-skills (não vou desenvolver)

- [skill X] — por quê: [não serve ao BHAG, distrai foco]
- [skill Y]

## Revisão

- Quarterly: status de cada Foco no end-quarter
- Anualmente: redefinir foco se papel-alvo mudou
```

## Princípios duros

- **Profundidade > amplitude no início.** Vire MUITO bom em 1 coisa antes de dispersar.
- **Anti-skills explícitos.** Lista do que você NÃO vai aprender. Sem isso, vira buffet.
- **70% vem de projeto real.** Sem isso, é hobby — não skill profissional.
- **Mensure output, não input.** "Estudei 200h" não é progresso. "Shipped X" é.
- **Dunning-Kruger é real.** Peça crítica de quem é melhor que você, periodicamente.

## Ligação com outras skills

- `study-protocol` define COMO estudar a parte 10% formal
- `network-builder` ajuda a achar mentor / crítico (parte 20%)
- `okr-quarterly` traduz cada Foco em 1-2 KRs trimestrais
- `weekly-review` mede horas de prática deliberada
