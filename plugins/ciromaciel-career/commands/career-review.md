---
description: Fase 7 — Review. Revisão semanal / mensal / trimestral / anual com decisões DOBRAR/REFINE/MATAR/MANTER. Produz reviews/*.
---

Você foi invocado pelo comando `/career-review`. Esta é a **Fase 7** — a peça mais importante do sistema.

## Princípio

Sem **weekly review**, todo o resto vira lixo em 3 semanas (David Allen, GTD). É a peça mais negligenciada — e a mais alta de leverage.

Decisão sempre em 4 ações: **DOBRAR** (funciona, escala), **REFINE** (funciona mas ajusta), **MATAR** (não funciona, corta), **MANTER** (continua sem mudar).

## Argumentos

Aceita 1 argumento: `weekly` | `monthly` | `quarterly` | `annual`. Default: `weekly`.

Se não passado, pergunte qual cadência.

## Pré-requisitos

Leia conforme cadência:

| Cadência | Lê |
|----------|----|
| weekly | últimos 7 dias de `dashboard/journal-*`, `dashboard/metrics.md`, `plan/okrs-<Q>.md`, weekly anterior |
| monthly | últimas 4 weeklies, `dashboard/metrics.md`, `plan/okrs-<Q>.md` |
| quarterly | últimas 3 monthlies, `plan/okrs-<Q>.md` (fecha), `vision/strategy-3y.md` |
| annual | últimas 4 quarterlies, `vision/bhag.md`, `vision/strategy-3y.md`, annual anterior |

## Execução por cadência

### Weekly review (60 min) — use skill `weekly-review`

Estrutura GTD + AAR (US Army):

1. **Clear** — inbox zero (email, Linear, Notion). 15 min.
2. **Get current** — atualiza `dashboard/metrics.md`. 10 min.
3. **AAR** — 4 perguntas (15 min):
   - O que era esperado nessa semana?
   - O que aconteceu de fato?
   - Por que a diferença?
   - O que repetir / mudar na próxima?
4. **Decide** — DOBRAR / REFINE / MATAR / MANTER em cada vetor. 10 min.
5. **Plan** — top 3 da próxima semana, agenda blocos. 10 min.

Output: `reviews/weekly-<YYYY-MM-DD>.md` (data da sexta ou domingo).

### Monthly review (90 min)

1. Releia as 4 weeklies do mês.
2. Métricas do mês vs target trimestral — está no ritmo?
3. Skills/leitura/rede/saúde recap — 1 parágrafo por vetor.
4. Aprendizado-chave do mês (1 frase).
5. Surpresas — o que aconteceu que você NÃO previu.
6. Próximo mês — 1 ajuste em cada vetor.

Output: `reviews/monthly-<YYYY-MM>.md`.

### Quarterly review (1 dia)

1. **Fecha OKRs** — score 0.0–1.0 em cada KR. 0.6–0.7 é ideal. Below 0.4 = mal definido OU mal executado, identifique qual.
2. **Reassess âncora** — sua âncora de Schein mudou? Frequência: muda a cada 2-3 anos, não trimestral.
3. **Reassess estratégia 3y** — os 3 marcos ainda fazem sentido? Marketing/tecnologia/vida mudaram?
4. **Abre próximos OKRs** — rode `/career-plan` pra abrir Q+1.
5. **Decisão big-picture** — fica, sobe, lateral, sai? Se sinal acumulado, rode `/career-pivot`.

Output: `reviews/quarterly-<YYYY-QQ>.md`.

### Annual review (1 fim de semana) — use agent `reflection-coach`

Carta a si mesmo. Estrutura:

1. **Resumo do ano** — 5 fatos, não interpretações.
2. **Maior aprendizado** — 1 lição que mudou modelo mental.
3. **Maior erro / arrependimento** — explícito. Sem isso é propaganda.
4. **Quem foi importante esse ano** — pessoas, com nome.
5. **Estado dos 5 vetores** — escala 1–5 vs ano anterior.
6. **BHAG check** — está mais perto ou mais longe? Por quê?
7. **Próximo ano** — 1 frase. Não 10. UMA.
8. **Para o eu daqui a 5 anos** — o que quero te dizer.

Output: `reviews/annual-<YYYY>.md`.

## Princípio do review

**Brutalmente honesto > performativo.** Review pra "ficar bem com você mesmo" é pior que não fazer. Se o KR fracassou, escreva isso. Se você ignorou saúde, escreva isso. O futuro-você precisa do dado real.

## Próximo passo

- Weekly → sugira agendar a próxima sexta/domingo.
- Monthly → sugira `/career-review weekly` na semana atual.
- Quarterly → sugira `/career-plan` pra abrir próximo trimestre.
- Annual → sugira reabrir `/career-vision` se BHAG está fora de rota.
