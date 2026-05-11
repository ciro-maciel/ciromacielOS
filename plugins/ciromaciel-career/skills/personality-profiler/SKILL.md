---
name: personality-profiler
description: >
  Perfila personalidade usando Big Five (OCEAN) — modelo mais validado empiricamente em psicologia. Versão lite com 10 statements por dimensão. Output inclui implicações pra carreira (Barrick & Mount 1991 meta-análise: Conscienciosidade é preditor mais consistente de performance em qualquer função). Skill pura de raciocínio.
tags: [career, self-knowledge]
---

# Personality Profiler

Skill pura de raciocínio. Aplica o **Big Five** (OCEAN: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) — modelo de personalidade com **maior validação empírica em psicologia** (Costa & McCrae, NEO-PI-R, 1985-2010).

**Por que Big Five e não MBTI:** MBTI tem validade científica baixa (test-retest reliability ~50%). Big Five tem replicação consistente em 50+ países (McCrae & Allik 2002) e correlaciona com performance no trabalho.

**Achado-chave:** meta-análise de Barrick & Mount (1991, *Personnel Psychology*) com 117 estudos: **Conscienciosidade** é o preditor mais consistente de desempenho profissional, em qualquer função. IQ ainda importa mais em jobs complexos, mas conscienciosidade compõe de forma única.

## Quando usar

- "Como minha personalidade impacta minha carreira?"
- "Devo virar gestor / vendedor / pesquisador?"
- "Estou pensando em mudar pra função muito diferente"
- Disparado pelo command `/career-diagnose`.

## As 5 dimensões

| Dim | Alto | Baixo | Implicações carreira |
|-----|------|-------|---------------------|
| **O — Openness** | Criativo, curioso, abstrato | Prático, convencional, concreto | Alto: pesquisa, design, estratégia. Baixo: operação, compliance. |
| **C — Conscientiousness** | Organizado, disciplinado, confiável | Espontâneo, flexível, relaxado | Alto: qualquer função. Baixo: requer estrutura externa. |
| **E — Extraversion** | Social, energizado por gente, assertivo | Reservado, energizado solo, contido | Alto: vendas, gestão, comunicação. Baixo: deep work, IC sênior. |
| **A — Agreeableness** | Cooperativo, empático, conciliador | Direto, competitivo, crítico | Alto: cuidado, suporte. Baixo: negociação, liderança difícil. |
| **N — Neuroticism** | Reativo emocional, ansioso, sensível | Calmo, estável, resiliente | Alto N: difícil em pressão constante. Baixo N: bom em crise/ER. |

**Importante:** alto/baixo não é bom/ruim. Cada extremo serve a contextos diferentes.

## Phase 1 — Questionário (50 statements)

Apresente em blocos de 10. Pessoa pontua 1–5:
- 1 = discordo totalmente
- 2 = discordo
- 3 = neutro
- 4 = concordo
- 5 = concordo totalmente

### Openness (10 statements)

1. Tenho imaginação vívida.
2. Gosto de discussões abstratas e filosóficas.
3. Procuro experiências novas com frequência.
4. Aprecio arte, música, literatura.
5. Tenho ideias originais.
6. Não me interessa muito por ideias abstratas. **[R]**
7. Evito leituras filosóficas. **[R]**
8. Não gosto de quebrar rotina. **[R]**
9. Sou rápido a entender coisas novas.
10. Prefiro lidar com o concreto, não o abstrato. **[R]**

### Conscientiousness (10 statements)

11. Cumpro o que prometo.
12. Termino o que começo.
13. Sou organizado(a) com tempo e tarefas.
14. Sigo um plano que defini.
15. Sou meticuloso(a) em detalhes.
16. Adio coisas com frequência. **[R]**
17. Esqueço de devolver as coisas no lugar. **[R]**
18. Faço bagunça e não arrumo. **[R]**
19. Tenho dificuldade de seguir cronograma. **[R]**
20. Trabalho duro mesmo quando ninguém vê.

### Extraversion (10 statements)

21. Me sinto energizado(a) em grupos.
22. Falo bastante em reuniões.
23. Inicio conversas com desconhecidos.
24. Sou centro das atenções quando quero.
25. Prefiro estar com gente a estar sozinho(a).
26. Fico desconfortável em festas grandes. **[R]**
27. Tenho dificuldade pra começar conversa. **[R]**
28. Preciso de tempo sozinho(a) pra recarregar. **[R]**
29. Falo pouco em grupos. **[R]**
30. Evito eventos sociais grandes. **[R]**

### Agreeableness (10 statements)

31. Me preocupo com bem-estar dos outros.
32. Sinto empatia fácil.
33. Tendo a confiar nas pessoas.
34. Cedo em conflito pra preservar relação.
35. Sou cooperativo(a) em time.
36. Sou direto(a), mesmo quando incomoda. **[R]**
37. Discuto em vez de ceder. **[R]**
38. Tenho dificuldade com colegas pouco eficientes. **[R]**
39. Sou competitivo(a) — quero vencer. **[R]**
40. Defendo opinião contrária mesmo sob pressão. **[R]**

### Neuroticism (10 statements)

41. Me preocupo facilmente.
42. Fico ansioso(a) sob pressão.
43. Estresse afeta meu sono.
44. Reajo emocionalmente forte a críticas.
45. Tenho variações de humor frequentes.
46. Mantenho calma em situações difíceis. **[R]**
47. Raramente fico irritado(a). **[R]**
48. Lido bem com crítica direta. **[R]**
49. Durmo bem mesmo com problema pendente. **[R]**
50. Estresse não me derruba. **[R]**

## Phase 2 — Cálculo

Para statements marcados **[R]** (reverse-scored): inverta — pessoa pontuou 5 → vale 1; pontuou 4 → vale 2; pontuou 3 → vale 3; pontuou 2 → vale 4; pontuou 1 → vale 5.

Some por dimensão (10 statements cada, score max = 50):

```
O = soma dos 10 statements de Openness
C = soma dos 10 statements de Conscientiousness (com reverse aplicado)
E = soma dos 10 statements de Extraversion (com reverse aplicado)
A = soma dos 10 statements de Agreeableness (com reverse aplicado)
N = soma dos 10 statements de Neuroticism (com reverse aplicado)
```

Classifique cada dimensão:
- 10–20: muito baixo
- 21–30: baixo-médio
- 31–40: médio-alto
- 41–50: muito alto

## Phase 3 — Output

Salve em `career/<nome>/self/personality.md`:

```markdown
# Personality Profile — <nome>
Data: <YYYY-MM-DD>

## Big Five Scores

| Dimensão | Score (max 50) | Nível |
|----------|----------------|-------|
| Openness | _ | _ |
| Conscientiousness | _ | _ |
| Extraversion | _ | _ |
| Agreeableness | _ | _ |
| Neuroticism | _ | _ |

## Interpretação por dimensão

### Openness — [nível]
[1 parágrafo: o que significa pra trabalho. Tipos de problema que você gosta vs evita.]

### Conscientiousness — [nível]
[1 parágrafo. ATENÇÃO: se baixa, alerte que é o preditor mais consistente de performance — vale investir em estrutura externa: GTD, calendário, accountability.]

### Extraversion — [nível]
[1 parágrafo. Implicações pra trabalho social vs solo. Não force introvertido a virar vendedor — força extrovertido a ter blocos de deep work.]

### Agreeableness — [nível]
[1 parágrafo. Alto A pode ter dificuldade em negociação salarial. Baixo A pode ter dificuldade em manter time. Nem bom nem ruim — contexto.]

### Neuroticism — [nível]
[1 parágrafo. Alto N: evite roles de pressão constante (oncall, sales high-quota, crisis response). Baixo N: pode ser bom em crise mas pode underestimar risco.]

## Combinações relevantes pra carreira

- Alto O + Alto C = builder/founder material (rare combo)
- Baixo C + qualquer outro = priorize SISTEMAS, não força de vontade
- Alto E + Baixo A = vendas / litígio / negociação
- Alto A + Baixo N = suporte ao cliente / cuidado / facilitação
- Alto N + Alto C = perfeccionista — risco de burnout, monitore saúde mental

## Riscos do seu perfil

[3-5 riscos específicos, baseados nos scores. Ex: "Alto N + Alto C: tendência a overwork e auto-cobrança. Monte limites externos (horário fixo de desligar, dia de folga inegociável)"]

## Forças do seu perfil

[3-5 forças específicas. Ex: "Alto C: você vai entregar mesmo em ambientes caóticos — use isso como vantagem competitiva em projetos onde outros falham por inconsistência"]

## Implicações pra próximos OKRs

[1 parágrafo: como o perfil informa os OKRs do trimestre. Ex: "Baixo C → priorize 1 KR de sistema/hábito, não 5 KRs ambiciosos"]

## Atualizar quando

- A cada 5 anos (personalidade é razoavelmente estável)
- Após terapia / coaching prolongado
- Após mudança radical de contexto (parentalidade, perda, mudança de país)
```

## Disclaimers honestos

- Versão lite. Para diagnóstico clínico/HR pesado, use NEO-PI-R oficial (240 itens) ou IPIP-NEO (300 itens).
- Big Five tem replicação forte mas há variação cultural — versão lite pode subestimar Conscienciosidade em cultura brasileira (vs americana).
- Personalidade **não é destino**. Identifica padrão, não limite.

## Ligação com outras skills

- Combine com `career-anchor-finder` → âncora diz O QUE você quer, personalidade diz COMO você opera.
- Alimenta `okr-quarterly` → OKRs realistas precisam considerar baixa Conscienciosidade (use sistemas) ou alto Neuroticism (limites de stress).
- Alimenta `personal-brand` → introvertido não precisa virar extrovertido online — escolhe plataforma assíncrona (newsletter, longform) vs síncrona (lives, podcasts ao vivo).
