---
name: study-protocol
description: >
  Define o protocolo de estudo da pessoa (leitura, Anki, cursos) baseado em ciência da aprendizagem — Dunlosky 2013 (Psych Science PI), Bjork desirable difficulties, Munger mental models. Foca em practice testing + distributed practice. Produz plan/study-cadence.md.
tags: [career, planning, learning]
---

# Study Protocol

Skill pura de raciocínio. Define cadência e técnicas de estudo da pessoa baseado em **ciência da aprendizagem**, não em "dicas de produtividade".

## Achado crítico (Dunlosky et al., 2013, *Psychological Science in the Public Interest*)

Meta-análise de 10 técnicas comuns:

### Eficácia alta (use)
1. **Practice testing** — fechar o livro e tentar reconstruir; flashcards (Anki); quizzes auto-aplicados.
2. **Distributed practice** — espaçar repetições no tempo (não maratona).

### Eficácia moderada
3. **Elaborative interrogation** — perguntar "por que isso é verdade?" enquanto estuda.
4. **Self-explanation** — explicar pra você mesmo como/por que cada passo.
5. **Interleaved practice** — misturar tópicos numa sessão (não 1h só de X).

### Eficácia baixa (PARE)
6. ~~Summarization~~ (resumir)
7. ~~Highlighting~~ (grifar)
8. ~~Keyword mnemonic~~
9. ~~Imagery for text~~
10. ~~Rereading~~

**Implicação dura:** as técnicas mais USADAS (releitura, grifar, resumir) são as MAIS FRACAS. Sensação de aprendizado ≠ aprendizado real (Bjork, *desirable difficulties*).

## Quando usar

- "Como estudo de verdade?"
- "Quanto tempo dedico a estudo?"
- "Como aprendo [X] mais rápido?"
- Disparado por `/career-plan` junto com `skill-roadmap`.

## Pré-requisitos

Leia:
- `plan/skill-roadmap.md` — quais skills foco
- `self/personality.md` — conscienciosidade baixa precisa de mais estrutura externa

## Phase 1 — Estado atual

Pergunte:
- Quantos livros/ano você leu nos últimos 2 anos?
- Quanto tempo/dia em prática deliberada?
- Usa Anki ou similar? Há quanto tempo?
- O que estudou nos últimos 6 meses que efetivamente virou skill aplicada?

Calibragem honesta: maioria estuda **muito menos** do que acha. "Leio sempre" geralmente = 3 livros/ano e 200 newsletters skimadas.

## Phase 2 — Volume realista

Cenário 1h/dia de leitura focada:

| Tempo/dia | Livros/ano (média 250 pp) | Cards Anki revisados/dia |
|-----------|--------------------------|-------------------------|
| 30 min | ~15 | ~30 |
| 1h | ~30 | ~60 |
| 2h | ~60 (apertado) | ~120 |

Naval, Munger, Buffett — todos atribuem retornos desproporcionais a leitura composta.

Charlie Munger: *"Não conheço pessoa sábia que não leia o tempo todo. Nenhuma. Zero."*

## Phase 3 — Cadência de estudo

Defina junto com `execute/weekly-blocks.md`:

### Daily
- **Anki review** (10-20 min) — manhã, antes de email. Practice testing.
- **Leitura ativa** (30-60 min) — fixo no horário. Anota Q importantes pra criar cards.
- **Prática deliberada** (30-60 min) — projeto real, não exercícios isolados.

### Weekly
- **Cards novos no Anki** (1 sessão de 30 min, 10-15 cards novos máximo)
- **Síntese da semana** (15 min no weekly review) — 1 parágrafo do que aprendeu

### Monthly
- **1 livro terminado** — meta mínima
- **Output de aprendizado** (1 post, 1 código aberto, 1 doc interno) — sem output, foi consumo passivo

## Phase 4 — Práticas obrigatórias

### 4.1 — Anki (spaced repetition)

- **1 deck por skill foco** (ou tópico denso) — não 1 deck pra tudo
- **Cards atômicos** — 1 fato/conceito/comparação por card
- **Cloze deletion** quando útil — "O efeito de ___ na meta-análise foi de ___"
- **Não memorize trivia** — só o que você vai usar (definições, fórmulas, fatos-chave)
- **Manutenção diária inegociável** — 5 dias sem revisar = backlog explode = desistir

### 4.2 — Leitura ativa

Para livros densos:
- **Q-marks na margem** — pergunta levantada por aquele trecho
- **Recall test** ao final do capítulo — feche livro, reconte oralmente. Falhas → reler ESSE trecho.
- **5 cards Anki por capítulo denso** — o suficiente pra reter o esqueleto
- **Output em 1 mês** — escreva síntese pública (post, gist, doc interno). Bjork: produção é teste melhor que reconhecimento.

### 4.3 — Cursos / vídeos

- **Velocidade 1.5x–2x** se for palestra. Reduza pra 1x em material técnico denso.
- **Sempre pause e tente prever a próxima coisa** (elaborative interrogation).
- **Não anote bloco a bloco** — anote 1x ao fim de cada módulo (síntese mental força recall).
- **Aplique em projeto em < 30 dias** ou desconsidere o curso.

### 4.4 — Mental models (Charlie Munger)

Cultive uma **lattice de modelos mentais** vindos de várias disciplinas:

| Disciplina | Modelo-chave |
|-----------|-------------|
| Economia | Custo de oportunidade, vantagem comparativa, externalidade |
| Psicologia | Vieses (ancoragem, disponibilidade, confirmação), social proof |
| Biologia/Evolução | Seleção, mimese, complexidade adaptativa |
| Física | Pareto, exponenciais, segunda lei (entropia) |
| Matemática | Probabilidade base rate, regressão à média |
| Estatística | Survivorship bias, p-hacking |
| Engenharia | Backups, redundância, margens de segurança |

Munger: você pensa melhor com **80 modelos** do que com 5.

## Phase 5 — Reading list

Sugira mapear:
- **5 livros próximos 6 meses** — direto ligado a skill foco
- **3 livros "amplitude"** — fora da área, pra modelos mentais
- **2 releituras** — texto importante que você leu 5+ anos atrás (relê com olhos novos)

Não monte lista de 50 livros. **Lista de 50 = lista de 0 lidos.**

## Phase 6 — Anti-padrões a derrubar

| Anti-padrão | Por que erra | Substituir por |
|-------------|--------------|---------------|
| Grifar tudo | Eficácia ~zero (Dunlosky) | Q-marks na margem + recall test |
| Reler 3x | Familiaridade ≠ retenção | Practice testing |
| Maratona de 1 livro | Sem espaçamento | 4 sessões de 30 min em 2 semanas |
| Curso sem projeto | 10% do 70-20-10 | Force projeto em < 30 dias |
| 50 livros simultâneos | Concentração morre | Max 3: 1 denso + 1 narrativo + 1 leve |
| Anki abandonado por 2 sem | Backlog explode | 10 min/dia OU mata o deck |
| YouTube em 2x sem pause | Sente que aprendeu | Pause + predição em 1.5x |

## Phase 7 — Output

Salve em `plan/study-cadence.md`:

```markdown
# Study Cadence — <nome>
Atualizado: <YYYY-MM-DD> | Revisar: mensal

## Volume alvo

- Leitura: _ min/dia → _ livros/ano
- Anki: _ min/dia (manutenção) + _ cards novos/semana
- Prática deliberada: _ h/semana em [skill foco]
- Cursos ativos: máx 1 por vez

## Decks Anki ativos

- [skill foco 1]: _ cards
- [skill foco 2]: _ cards
- (max 3 decks ativos)

## Reading list próximos 6 meses

### Foco (5):
1. _ (mês alvo: _)
2. _
3. _
4. _
5. _

### Amplitude (3):
1. _
2. _
3. _

### Releituras (2):
1. _
2. _

## Output obrigatório por mês

- 1 síntese pública (post / gist / doc interno) sobre o que aprendeu
- 1 projeto aplicado em skill foco

## Regras inegociáveis

- Anki diário ou mata o deck
- Recall test no fim de cada capítulo denso
- Sem releitura passiva
- Velocidade 1x em técnico, 1.5-2x em palestra

## Próxima revisão

<YYYY-MM-DD>
```

## Princípio

**Você não estuda muito — você se sente estudando.** A diferença é mensurável: practice testing, output, projetos aplicados. Sem isso, é entretenimento intelectual.

## Ligação com outras skills

- `skill-roadmap` define O QUE estudar
- `weekly-blocks.md` (do `/career-execute`) reserva o tempo
- `weekly-review` mede horas e output
- `personal-brand` consome o output (1 síntese pública = 1 post)
