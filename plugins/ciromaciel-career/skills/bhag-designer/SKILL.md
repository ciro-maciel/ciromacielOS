---
name: bhag-designer
description: >
  Desenha o BHAG (Big Hairy Audacious Goal) de 10 anos da pessoa, integrando 5 lentes (financeiro, papel, geografia, impacto, lifestyle). Framework de Jim Collins (Good to Great, Built to Last). Skill pura de raciocínio. Não é "sonho genérico" — é compromisso específico com métricas e condições não-negociáveis.
tags: [career, vision]
---

# BHAG Designer

Skill pura de raciocínio. Desenha o **BHAG** (Big Hairy Audacious Goal) — termo cunhado por **Jim Collins e Jerry Porras** em *Built to Last* (1994) e refinado em *Good to Great* (2001).

**Definição de Collins:** um BHAG é claro e convincente, serve como ponto focal unificador, tem horizonte de 10–30 anos, é específico mensurável, e tem ~50% de probabilidade de ser alcançado (não 90% — fácil demais; não 10% — fantasia).

**Por que 10 anos e não 3:** projeção realista de 3 anos tende a subestimar; 10 anos tende a superestimar. Hofstadter's law: planos sempre demoram mais do que parecem. Mas 10 anos dá espaço pro composto agir.

## Quando usar

- "Qual é meu BHAG?"
- "Não sei pra onde estou indo"
- "Visão de 10 anos"
- Disparado pelo command `/career-vision`.

## Pré-requisitos

Leia (no contexto da invocação):
- `career/<nome>/self/anchor.md` — âncora dominante (Schein)
- `career/<nome>/self/values.md` — top 5 valores
- `career/<nome>/vision/anti-vision.md` — o que NÃO quer
- `career/<nome>/intake.md` — contexto bruto

Se faltar âncora ou valores, pare e oriente.

## Phase 1 — As 5 lentes

Pergunte sobre cada lente em sequência. Não combine — uma de cada vez, força foco.

### Lente 1 — Financeiro

```
Em 10 anos:
- Patrimônio líquido alvo? (ex: R$ 2M, US$ 1M, "10 anos de runway")
- Renda passiva mensal alvo? (aluguel, dividendo, royalty, juros) — opcional
- Runway pessoal alvo? (quantos meses você consegue não trabalhar sem mudar padrão)
- Renda ativa alvo no último ano? (salário/pró-labore/lucro distribuído)
```

Cuidado: número sem por quê é decorativo. Pergunte: "Por quê esse número? Pra quê?"

### Lente 2 — Papel / Identidade

```
Em 10 anos, profissionalmente:
- Você é o quê? (1 frase — "CTO de SaaS em healthtech", "consultor independente cobrando R$ 1k/h", "professor titular", "founder de empresa de 50+ pessoas")
- Por que esse papel, não outro adjacente? (filtro de âncora — bate com Schein?)
- Para quem você é referência? (audiência: indústria, cidade, internacional)
```

Se a resposta do papel conflita com a âncora (ex: âncora Technical mas papel "CEO 200 pessoas") — sinalize: "Atenção, isso viola sua âncora. Você quer mesmo isso ou é status?"

### Lente 3 — Geografia / Vida

```
Em 10 anos:
- Onde você mora? (cidade, bairro, tipo de casa)
- Com quem? (parceiro(a), filhos, sozinho, em comunidade)
- Como passa fins de semana?
- Quantas viagens por ano?
- Trabalha de onde? (escritório, home, nômade, híbrido)
```

### Lente 4 — Impacto

```
Em 10 anos:
- Quem se beneficia diretamente do seu trabalho?
- Em que escala? (10 clientes, 10 mil usuários, 10 milhões)
- O que é "missão cumprida" — qual problema do mundo seu trabalho atacou?
- Pra quem você quer ser lembrado por isso?
```

Se a pessoa não tem resposta — ok. Marque [a definir]. Não invente missão.

### Lente 5 — Lifestyle / Semana ideal

```
Em 10 anos, semana típica:
- Quantas horas/semana você trabalha?
- Como começa segunda? Como termina sexta?
- Quanto tempo com família/casa?
- Quanto tempo de exercício/saúde?
- Quanto tempo de criação/estudo (não trabalho remunerado)?
- Quanto tempo "ócio" (sem agenda)?
```

Soma > 168h/semana? Recuse e mande refazer.

## Phase 2 — Integração

Combine as 5 lentes em UM parágrafo coeso (2-3 parágrafos no máximo). Não é lista — é narrativa.

Estrutura sugerida:

```
Em [ano = atual+10], eu sou [identidade/papel], baseado em [geografia],
trabalhando ~[horas/semana] em [tipo de trabalho/empresa]. Meu trabalho
serve [impacto — quem, escala]. Financeiramente, [número-chave: patrimônio
ou runway ou renda]. Minha semana inclui [3-4 elementos lifestyle-chave].
Estou cumprindo [propósito em 1 frase].

Saber que cheguei lá quando: [3-5 métricas binárias — bate ou não bate].
```

## Phase 3 — Estresse-teste

Force 4 perguntas duras antes de fechar:

1. **Probabilidade honesta** — qual sua probabilidade real de chegar? (Collins: ~50% é o sweet spot. < 30% = fantasia. > 80% = fácil demais)
2. **Trade-off** — se essa visão exige sacrifício de [tempo com filhos / dinheiro hoje / saúde / outra coisa], você topa o trade-off explícito?
3. **Custo de oportunidade** — o que você ABRE MÃO escolhendo essa visão? (sempre tem)
4. **Teste do espelho** — você compartilharia esse BHAG com 3 pessoas próximas? Se não, por que não? (geralmente sinal de que o BHAG não é seu — é o que acha que deveria querer)

Se a pessoa trava em algum, recue uma etapa.

## Phase 4 — Métricas de validação

Liste 3–5 **métricas binárias** (bate ou não bate, sem ambiguidade) que evidenciam que o BHAG foi atingido. Ex:

```
BHAG: ser referência em design de SaaS B2B em LATAM em 2036.

Métricas:
- [ ] Patrimônio líquido > R$ 3M
- [ ] 1+ keynote anual em evento internacional de design
- [ ] 10k+ seguidores qualificados (decisores de SaaS) em plataforma escolhida
- [ ] 3+ produtos que ajudei a desenhar passaram de R$ 10M ARR
- [ ] Tempo de trabalho < 35h/semana, no Brasil ou Portugal
```

## Phase 5 — Output

Salve em `career/<nome>/vision/bhag.md`:

```markdown
# BHAG — <nome>
Definido em: <YYYY-MM-DD> | Horizonte: <YYYY+10>

## Narrativa

[2-3 parágrafos integrados das 5 lentes]

## Métricas de validação (binárias)

- [ ] [métrica 1 — número + data]
- [ ] [métrica 2]
- [ ] [métrica 3]
- [ ] [métrica 4]
- [ ] [métrica 5]

## Condições não-negociáveis

- [3-5 coisas que NUNCA podem ser violadas — saúde, família, valor X]

## Trade-offs aceitos

- [3 coisas que estou disposto a abrir mão pra ir nessa direção]

## Probabilidade honesta

~[N]% de chegar em 10 anos. (50% é o alvo de Collins)

## Sanity checks passados

- [ ] Compatível com âncora dominante de Schein
- [ ] Compatível com top 5 valores
- [ ] Não viola anti-visão
- [ ] Compartilhável com pessoas próximas sem vergonha
- [ ] Trade-offs explícitos aceitos

## Revisão

- Quarterly: status das 5 métricas. NÃO mudar o BHAG trimestre a trimestre.
- Annual: vale a pena continuar nessa direção?
- A cada 3 anos: BHAG ainda é o BHAG ou virou outro?
```

## Princípio inegociável

BHAG não é wishlist. É **compromisso com 50% de chance de fracassar**. Se você bate facilmente, era fraco. Se você nem chega perto em 5 anos, ou o BHAG é fantasia ou a execução é o problema — investigue qual.

## Ligação com outras skills

- Alimenta `okr-quarterly` → cada OKR deve evidenciar movimento em direção ao BHAG ou explicitamente não (descanso, exploração).
- Filtro de `career-pivot` → toda decisão de pivot é avaliada contra "isso me leva mais perto ou mais longe do BHAG?"
- Revalidado em `career-review annual`.
