---
name: career-anchor-finder
description: >
  Identifica a âncora de carreira dominante e secundária da pessoa, baseado no framework de Edgar Schein (MIT, 1978). As 8 âncoras são padrões profundos de auto-conceito que não mudam com facilidade — decisões de carreira que violam a âncora dominante fracassam mesmo com promoção e aumento. Skill pura de raciocínio: faz perguntas, calcula pesos, gera profile com implicações práticas.
tags: [career, self-knowledge]
---

# Career Anchor Finder

Skill pura de raciocínio. Identifica a **âncora de carreira** dominante usando o framework de **Edgar Schein** (MIT Sloan, *Career Anchors: Discovering Your Real Values*, 1978; revisões até 2013).

**Premissa de Schein:** com 5+ anos de experiência, todos desenvolvem um padrão estável de auto-conceito profissional — uma âncora que você não abre mão mesmo sob pressão. Ignorá-la = aceitar promoção que te faz infeliz por 3 anos antes de pedir demissão.

## Quando usar

- "Qual é minha âncora de carreira?"
- "Estou pensando em virar gestor, faz sentido pra mim?"
- "Recebi proposta de [X], como avalio se cabe em mim?"
- Disparado pelo command `/career-diagnose` automaticamente.

## As 8 âncoras de Schein

| # | Âncora | Núcleo |
|---|--------|--------|
| 1 | **Technical/Functional Competence** | Ser o melhor na arte/ofício específico. Largaria gestão pra ficar fazendo. |
| 2 | **General Managerial Competence** | Liderar pessoas + integrar funções + assumir resultado financeiro. Ama responsabilidade ampla. |
| 3 | **Autonomy/Independence** | Recusa estrutura imposta. Top priority: definir como/quando trabalha. |
| 4 | **Security/Stability** | Previsibilidade > upside. Aceita teto baixo em troca de chão firme. |
| 5 | **Entrepreneurial Creativity** | Construir algo do zero, com ownership. Sem isso, sofre em qualquer cargo. |
| 6 | **Service / Dedication to a Cause** | Trabalho precisa servir valor maior (saúde, justiça, educação). |
| 7 | **Pure Challenge** | Resolver problemas considerados impossíveis. Tédio é tóxico. |
| 8 | **Lifestyle** | Integração trabalho-vida-família. Carreira é UM eixo, não o eixo. |

## Phase 0 — Intake rápido (2 perguntas)

```
Antes do questionário:

1. Quantos anos de experiência profissional você tem (incluindo estágio)?
2. Em momentos de escolha difícil de carreira nos últimos 5 anos, o que pesou mais? (1 frase)
```

Se < 5 anos, alerte: "Sua âncora ainda está se formando. O resultado é hipótese, não diagnóstico." Continue mesmo assim.

## Phase 1 — Questionário (40 statements)

Apresente em blocos de 8 statements. Cada statement aponta pra UMA âncora. Pessoa pontua de 1 a 6:
- 1 = nunca verdade
- 2 = raramente
- 3 = às vezes
- 4 = frequentemente
- 5 = quase sempre
- 6 = sempre verdade

### Bloco 1 — Statements 1–8 (1 por âncora, primeira passada)

1. Quero ser tão bom no que faço tecnicamente que serei o expert que outros consultam. **[TF]**
2. Sucesso = liderar grandes times com P&L sob minha responsabilidade. **[GM]**
3. Largaria qualquer cargo que me obrigasse a seguir regras de horário/local de trabalho. **[AU]**
4. Prefiro um emprego estável e previsível a um arriscado com upside alto. **[SE]**
5. Meu sonho é construir algo do zero que carregue meu nome / minha marca. **[EC]**
6. Só me dedico de verdade a trabalho que sirva uma causa maior que dinheiro. **[SV]**
7. Trabalho não me energiza quando os problemas são fáceis demais. **[PC]**
8. Recusaria promoção que destruísse minha rotina com família/hobbies. **[LS]**

### Bloco 2 — Statements 9–16

9. Prefiro aprofundar 1 área a virar generalista. **[TF]**
10. Decisões que afetam o destino de muita gente me energizam. **[GM]**
11. Já recusei dinheiro pra preservar liberdade de fazer do meu jeito. **[AU]**
12. Pesa muito ter benefícios sólidos, plano de saúde, previsibilidade de renda. **[SE]**
13. Trabalhar pros outros me incomoda — quero ter o próprio negócio. **[EC]**
14. Não conseguiria trabalhar em algo que considero moralmente neutro. **[SV]**
15. Adoro quando me dão um problema que ninguém resolveu. **[PC]**
16. Cidade onde moro / proximidade da família é critério obrigatório. **[LS]**

### Bloco 3 — Statements 17–24

17. Quero ser referência técnica/funcional na minha indústria. **[TF]**
18. Aceitei mais responsabilidade gerencial pra ter mais impacto. **[GM]**
19. Reuniões obrigatórias com horários fixos me sufocam. **[AU]**
20. Mudaria de emprego só com garantia equivalente de estabilidade. **[SE]**
21. Já comecei algo (negócio, projeto, organização) com risco real. **[EC]**
22. Trabalho ideal = trabalho que ajuda quem mais precisa. **[SV]**
23. Me sinto vivo lutando contra problema considerado impossível. **[PC]**
24. Trabalho remoto / flexibilidade é não-negociável pra mim. **[LS]**

### Bloco 4 — Statements 25–32

25. Trocaria salário mais alto por trabalho tecnicamente mais interessante. **[TF]**
26. Liderar 50+ pessoas é objetivo concreto pra mim. **[GM]**
27. Trabalho melhor sem ninguém me dizendo o que fazer. **[AU]**
28. Não trocaria minha vaga atual por uma startup mesmo com equity. **[SE]**
29. Já tive ideia de negócio e me incomoda não estar executando. **[EC]**
30. Recusaria trabalhar em indústria que considero socialmente prejudicial (tabaco, fast fashion, jogo). **[SV]**
31. Quanto mais difícil o problema, mais me engajo. **[PC]**
32. Trabalho não pode atropelar relação com filhos/parceiro(a)/saúde. **[LS]**

### Bloco 5 — Statements 33–40

33. Investimento contínuo em aprofundar uma especialidade me energiza. **[TF]**
34. Vejo a longo prazo como CEO / fundador / executivo C-level. **[GM]**
35. Já recusei oferta boa porque exigia mudança radical de rotina. **[AU]**
36. Plano de carreira previsível me atrai mais que jornada incerta. **[SE]**
37. Vejo a longo prazo como dono de negócio próprio (consultoria, agência, SaaS, empresa). **[EC]**
38. Já trabalhei (ou trabalho) em ONG / impacto social / saúde pública / educação. **[SV]**
39. Tédio profissional é meu maior medo. **[PC]**
40. Eu organizo carreira em torno da vida, não vida em torno da carreira. **[LS]**

## Phase 2 — Cálculo

Some os pontos por âncora (cada âncora tem 5 statements, score máx = 30).

```
TF (Technical/Functional)        = soma de 1, 9, 17, 25, 33
GM (General Managerial)          = soma de 2, 10, 18, 26, 34
AU (Autonomy/Independence)       = soma de 3, 11, 19, 27, 35
SE (Security/Stability)          = soma de 4, 12, 20, 28, 36
EC (Entrepreneurial Creativity)  = soma de 5, 13, 21, 29, 37
SV (Service/Dedication)          = soma de 6, 14, 22, 30, 38
PC (Pure Challenge)              = soma de 7, 15, 23, 31, 39
LS (Lifestyle)                   = soma de 8, 16, 24, 32, 40
```

Identifique:
- **Âncora dominante** = score mais alto
- **Âncora secundária** = segundo mais alto
- **Âncora "shadow"** = score mais baixo (área onde você se sabota com facilidade)

## Phase 3 — Question crítica (tie-breaker)

Schein insiste: o questionário sozinho não basta. Pergunte:

> Se você fosse forçado a escolher UMA dessas como condição não-negociável da sua próxima década, qual seria? (escolha 1 das 8)

Se a resposta bate com a dominante numérica → confirme.
Se diverge → a resposta da pergunta vale mais que o score. Investigue por quê.

## Phase 4 — Output

Salve em `career/<nome>/self/anchor.md`:

```markdown
# Career Anchor — <nome>
Data: <YYYY-MM-DD> | Anos experiência: <N>

## Scores

| Âncora | Score (max 30) |
|--------|----------------|
| Technical/Functional | _ |
| General Managerial | _ |
| Autonomy/Independence | _ |
| Security/Stability | _ |
| Entrepreneurial Creativity | _ |
| Service/Dedication | _ |
| Pure Challenge | _ |
| Lifestyle | _ |

## Diagnóstico

- **Dominante:** [âncora] (score)
- **Secundária:** [âncora] (score)
- **Shadow (mais baixo):** [âncora] (score)

## O que isso significa pra decisões de carreira

[2-3 parágrafos específicos sobre a âncora dominante, com exemplos do tipo de role que serve ou destrói essa pessoa]

## Red flags pra rejeitar ofertas

- [lista de 3-5 sinais que indicam que uma oferta viola a âncora — específicos pra esta pessoa]

## Green flags pra aceitar ofertas

- [3-5 sinais que indicam alinhamento]

## Tensão dominante × secundária

[Se as duas top âncoras geram conflito — comum entre EC + LS, ou GM + TF — descreva o trade-off real]

## Revalidar quando

- A cada 3 anos
- Após mudança grande (parentalidade, perda, mudança de país)
- Após arrependimento de uma decisão de carreira
```

## Quando recusar / adaptar

- Pessoa com < 2 anos de experiência: skill **não funciona bem**. Avise e ofereça pular pra `personality-profiler` (Big Five é mais estável cedo).
- Pessoa em burnout agudo: scores vão refletir estado emocional, não âncora real. Adie 30 dias.

## Princípio inegociável

Schein: a âncora **não muda** com facilidade. Se você acha que mudou em 6 meses, provavelmente é mood, não âncora. Reavalie em 3 anos.
