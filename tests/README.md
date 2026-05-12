# tests/ — eval harness do ciromacielOS

Suíte de teste e melhoria contínua dos plugins. Roda cenários canônicos via `claude` CLI (sua assinatura, sem API key separada), compara saída contra baseline, e usa LLM-as-judge pra notar qualidade.

**Status:** M0 (skeleton). Runner ainda não existe — só estrutura + sandboxes.

## Arquitetura

```
tests/
├── scenarios/         ← cenários por plugin (YAML)
│   ├── marketing/
│   ├── recruiting/
│   ├── career/
│   └── development/
├── baselines/         ← snapshots "known-good" de outputs (commited)
├── judges/            ← rubricas LLM-as-judge por tipo de output (markdown)
├── reports/           ← saídas de cada run (gitignored)
├── runner.py          ← TODO M1: orquestra execução
└── requirements.txt   ← TODO M1: dependências Python
```

Sandboxes (clientes/projetos fake onde os cenários rodam) ficam **fora do monorepo** em `~/Documents/ciro-maciel/ciromaciel-test-sandboxes/` — ver README desse repo pra bootstrap.

## Como vai funcionar (M1+)

```
python tests/runner.py                      # roda toda a suíte
python tests/runner.py --plugin marketing   # só marketing
python tests/runner.py --scenario mkt-001   # 1 cenário
python tests/runner.py --update-baseline    # atualiza baselines após mudança aprovada
```

### Pipeline de cada cenário

1. Lê `scenarios/<plugin>/<id>.yaml`
2. Limpa estado no sandbox (`rm -rf clients/<x>/` se `setup.fresh_client: true`)
3. Pré-carrega arquivos (`setup.preload_files`) — ex: brand-voice.md pronto
4. `cd <sandbox>` e shell-out pra `claude --print "<comando + user_responses serializados>"`
5. Captura: arquivos criados/modificados + stdout
6. **Checks determinísticos:**
   - `expects.files_created` existe?
   - `expects.files_contain.patterns` casam (regex)?
   - `expects.must_not_contain` ausentes?
7. **LLM-as-judge:**
   - Lê rubrica em `judges/<rubric>.md`
   - Passa output + rubrica pra `claude --print` em modo judge
   - Recebe nota 1-10 + justificativa
8. Salva report em `reports/<timestamp>/<scenario-id>.json`
9. Diff contra `baselines/<scenario-id>.json`:
   - Nota cai > 2 pontos → REGRESSION
   - Nota sobe → IMPROVEMENT (pergunta se atualiza baseline)
   - Diff em arquivos criados → muda inventário, requer review

## Schema de cenário (preview)

```yaml
# scenarios/marketing/01-linkedin-writer-saas.yaml
id: mkt-001
plugin: ciromaciel-marketing
phase: 5-execute
description: linkedin-writer gera 3 posts pra FinFlow respeitando brand voice
sandbox: saas-fintech-fake

setup:
  fresh_client: false
  preload_files:
    - clients/finflow/intake.md
    - clients/finflow/research/brand-voice.md
    - clients/finflow/research/icp-series-a-founders.md
    - clients/finflow/campaigns/q2-launch.md

run:
  invoke: agent
  agent: linkedin-writer
  prompt: |
    Gere 3 posts de LinkedIn pra campanha q2-launch da FinFlow.
    Formato: text-only. Angle: cada um diferente (insight, case, contrarian).

expects:
  files_created:
    - clients/finflow/campaigns/q2-launch-assets/social/linkedin-01-*.md
    - clients/finflow/campaigns/q2-launch-assets/social/linkedin-02-*.md
    - clients/finflow/campaigns/q2-launch-assets/social/linkedin-03-*.md
  files_contain:
    - path: clients/finflow/campaigns/q2-launch-assets/social/linkedin-01-*.md
      patterns:
        - "Voice anchor:"
        - "Hook"
        - "CTA"
  must_not_contain:
    - path: clients/finflow/campaigns/q2-launch-assets/social/linkedin-*.md
      patterns:
        - "Hot take"
        - "I've been thinking"
        - "innovative solution"      # brand voice da FinFlow proíbe

judge:
  rubric: linkedin-post-quality
  pass_threshold: 7
```

## Rubricas (judges)

Cada tipo de output tem uma rubrica em `judges/<name>.md`. Ex:
- `linkedin-post-quality.md`
- `blog-seo-quality.md`
- `instagram-reel-quality.md`
- `video-script-quality.md`
- `intake-completeness.md`
- `scorecard-quality.md`
- `okr-quality.md`

A rubrica é prompt que vai pra outro Claude rodando em modo "judge", avaliando 4-6 dimensões + nota final 1-10.

## Roadmap

| Milestone | Entrega | Status |
|-----------|---------|--------|
| **M0** | Skeleton + 1 sandbox fake (`saas-fintech-fake`) pré-preenchido | ✅ Em andamento |
| **M1** | `runner.py` + 3 cenários smoke (1 marketing, 1 recruiting, 1 career) + 1 judge | ⏳ Próximo |
| **M2** | Cobertura marketing (10 cenários) + judges por canal | ⏳ |
| **M3** | Cobertura recruiting (6) + career (4) + dev (2) | ⏳ |
| **M4** | Baselines + regression detection + CHANGELOG loop | ⏳ |
| **M5** | (Opcional) CI hook em push, swap pra ANTHROPIC_API_KEY pra paralelismo | ⏳ |

## Princípios

- **Subscription, não API key.** Runner usa `claude --print` da sua assinatura. Zero billing novo.
- **Sandboxes fora do monorepo.** Pra não poluir git com estado de teste.
- **LLM-as-judge é honesto, não perfeito.** Notas variam ±1 entre runs. Use trend, não nota única.
- **Baseline é commited.** Quando algo melhora, você aprova nova baseline com commit.
- **Nada de `/publish` real nos testes.** Mockado ou pulado — não bate em APIs externas.
- **Falha de teste é input, não veredito.** Se cenário falha, ou o plugin tem bug, ou o cenário está errado. Decisão humana.

## Não faça

- Não rode `--update-baseline` sem revisar o diff
- Não adicione cenário sem judge ou sem expects — vira teste vazio
- Não use dados reais de cliente nos sandboxes — fica em git pessoal e pode vazar
- Não esqueça de bumpar versão do plugin quando baseline muda significativamente
