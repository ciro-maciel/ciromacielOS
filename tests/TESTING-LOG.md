# Testing Log

Registro cronológico de test passes manuais (até M1 ter runner.py) e issues encontradas + corrigidas. Cada entrada = 1 sessão de teste com hipótese, achados, fix, verificação.

## Convenção

```
## YYYY-MM-DD — <título curto>

**Setup:** o que rodou (plugins, sandbox, escopo)
**Achados:** lista de bugs / friction descobertos
**Fixes aplicados:** o que mudou e onde
**Verificação:** pass 2 (re-teste) confirmou os fixes? Outputs reais?
**Known issues (deferred):** o que não corrigi e por quê (futuro)
```

---

## 2026-05-12 — Test pass 1+2 dos 4 writers novos (marketing)

**Setup:**
- Sandbox: `~/Documents/ciro-maciel/ciromaciel-test-sandboxes/saas-fintech-fake/` (FinFlow — SaaS PLG Series A, ICP US-primário)
- Plugin sob teste: `ciromaciel-marketing` v0.1
- Agents testados: `linkedin-writer`, `blog-writer`, `instagram-writer`, `video-script-writer`
- Modo: invocação via Agent tool (general-purpose subagent acting as each agent)
- Brief usado: `clients/finflow/campaigns/q2-launch.md` (anti-Mosaic / pricing transparency)
- Assets gerados: 2 LinkedIn posts, 1 blog post, 1 IG Reel, 1 LinkedIn vídeo script

### Achados (4 bugs sistêmicos)

**P0-1 — Nenhum writer listava `intake.md` como input obrigatório.** Apenas brief + brand-voice + ICP. Restrições críticas (founder não aparece em vídeo, veto a "AI-powered", "não comparar com NetSuite agressivamente", SOC 2 incompleto) vivem no intake — sem ler, agents perdem essas restrições. **Severidade alta** — `video-script-writer` escapou só porque inferiu, mas é luck. Posts/blog poderiam quebrar com violation futura.

**P0-2 — Sem diretiva de idioma.** No pass 1: blog saiu em inglês, LinkedIn + Instagram + vídeo saíram em português. ICP da FinFlow é US-primário (Brasil/LATAM explicitamente non-ICP). Brand-voice tem exemplos em PT/EN misturados — agents usaram o idioma do brand-voice em vez do alvo de geo do ICP. **Bug clássico**: brand-voice reflete fonte de extração, não alvo de output.

**P0-3 — Pre-flight metadata polui arquivo publicável.** 
- Blog tinha "Voice anchor: ..." ACIMA do frontmatter — quebra parser de CMS (WordPress, Webflow, Ghost esperam YAML em linha 1).
- LinkedIn tinha pre-flight inline + variações + notas misturadas com o post — publisher precisaria ler e stripar manualmente. `/publish` quebra.
- **Sem convenção uniforme** entre os 4 writers sobre onde production notes vivem.

**P0-4 (sandbox bug)** — Brief `q2-launch.md` linha 48 dizia "Founder talking-head + screenshare" — **contradiz** restrição do intake ("founder NÃO quer aparecer em vídeo"). Agent video-script-writer detectou e flagrou; outros writers poderiam ter cometido erro silencioso.

**P1 — blog-writer**: conflito não resolvido entre "H1 = title" + "title contém keyword" quando título vem pré-definido pelo brief. Agent não dizia o que vence.

### Fixes aplicados

| Fix | Onde | Mudança |
|-----|------|---------|
| Adicionar `intake.md` como input obrigatório | 4 agents (linkedin/blog/instagram/video) | Tabela de inputs + nota "sempre leia intake — restrições críticas vivem lá" |
| Diretiva de idioma baseada em ICP geo | 4 agents | Nova seção "Idioma do output (não negociável)" — ICP geo ganha sobre brand-voice |
| Production notes em HTML comment | `blog-writer` | `<!-- PRODUCTION NOTES ... -->` ANTES do frontmatter (CMS ignora) |
| Production notes separadas por `## PUBLISH THIS ↓` | `linkedin-writer`, `instagram-writer` | Divider explícito, publisher copia só o que está abaixo |
| Roteiro como production handoff (sem divider — tudo é production) | `video-script-writer` | Mantém formato atual, mas idioma + intake fixados |
| Convenção de numeração NN (listar dir antes) | linkedin/instagram/video | Bloco "antes de salvar, liste o dir e use próximo NN" |
| Regra de título pré-definido vs keyword | `blog-writer` | Nova seção: mantém título do brief no H1, garante keyword no lead + 1 H2 + meta description |
| Regra "intake ganha de brief" em contradição | `video-script-writer` | Já tinha; reforçado |
| Brief contradictório corrigido | `sandbox q2-launch.md` linha 48 | "Founder talking-head + screenshare" → "Screenshare + voice-over (founder NÃO aparece — restrição do intake)" |

### Verificação (pass 2)

Apaguei `q2-launch-assets/`, re-rodei os 4 agents em paralelo. Resultados:

| Agent | Idioma EN? | Lê intake? | Aplica restrições? | Production notes separadas? |
|-------|------------|------------|--------------------|-----------------------------|
| `blog-writer` | ✅ | ✅ | ✅ (no AI, no NetSuite jab, no "enterprise-ready") | ✅ HTML comment ANTES do frontmatter |
| `linkedin-writer` | ✅ | ✅ | ✅ | ✅ `## PUBLISH THIS ↓` divider |
| `instagram-writer` | ✅ | ✅ | ✅ + flagrou IG pilot decision | ✅ `## PUBLISH THIS ↓` divider |
| `video-script-writer` | ✅ | ✅ | ✅ (sem face, sem AI, sem NetSuite) | ✅ Inline (roteiro = produção handoff) |

Qualidade dos outputs: alta consistentemente. Blog 1535 palavras dentro do target. LinkedIn posts respeitam hook < 210 chars + sem link no corpo. Reel cobre kill-gate logic. Vídeo script tem tabela de beats segundo-a-segundo + handoff de edição. Nenhuma forbidden word em nenhum dos 5 outputs.

**Todos os P0 + P1 corrigidos e verificados.**

### Known issues (deferred — não corrigir agora)

1. **Precedência 3-way (brand-voice vs ICP vs forbidden words)** quando 3+ fontes conflitam. Hoje só a regra de idioma (ICP > brand-voice) é explícita. Agents resolveram outros conflitos com bom senso no pass 2 — não vale adicionar mais hierarquia rígida ainda. Revisitar se aparecer caso real onde julgo erro.

2. **NN race condition em execução paralela real.** Hoje a regra "liste o dir antes" funciona pra execução sequencial. Em paralelo real (via Agent tool com múltiplos agents salvando ao mesmo tempo), 2 podem reservar `linkedin-03` ao mesmo tempo. Mitigação atual: agents anunciam o bloco que vão usar. Fix verdadeiro requer lock/registry — over-engineering pra agora.

3. **Divider style pra "Variações" no LinkedIn** não 100% formalizado. Atualmente `## Variações (não publicar)` funciona mas não há regra dura. `/publish` precisa olhar pra esse pattern quando for implementado de verdade.

4. **`{{author}}` no frontmatter do blog** — brief não especifica quem assina (founder vs Head of Growth). Decisão editorial humana — não dá pra agent inferir sem regra explícita no brief.

5. **Internal links pra posts irmãos da mesma campanha** — agents marcam `[link interno: <tópico>]` mas se o post linkado ainda não foi gerado, vira broken link. `/distribute` (ou um post-process) deveria reconciliar links cross-campaign.

6. **Aspect ratio + música em vídeo** — agent dá faixa ("1:1 ou 16:9") mas decisão final depende de onde vai (feed vs embed). Hoje vira palpite do agent. Não-bloqueante — vale formalizar quando começar a usar de verdade.

### Outputs preservados pra referência

Após pass 2, outputs estão em:
- `clients/finflow/campaigns/q2-launch-assets/blog/mosaic-vs-finflow-honest-comparison.md`
- `clients/finflow/campaigns/q2-launch-assets/social/linkedin-01-mosaic-over-engineered.md`
- `clients/finflow/campaigns/q2-launch-assets/social/linkedin-02-excel-hidden-cost.md`
- `clients/finflow/campaigns/q2-launch-assets/social/instagram-01-reel-hidden-cost-excel.md`
- `clients/finflow/campaigns/q2-launch-assets/video/linkedin-01-mosaic-over-engineered.md`

Sandbox é gitignored — preservados localmente, não em repo público.

### Próximas ações

1. **`copy-critic` não foi rodado nesse pass** — vale rodar em sessão dedicada pra ver se o crítico pega issues sutis que os writers + meu olho perderam. ETA: 30 min.
2. **Persona service-consultoria-fake** — testar mesmos agents com ICP de serviço (não SaaS, não US-primário) pra ver se as regras universalizam.
3. **M1 do runner** — agora que sabemos quais checks importam (idioma, frontmatter format, divider presence, forbidden words), o runner.py do M1 pode automatizar isso.

---

## Padrões observados pra encodar no runner (M1)

Checks determinísticos óbvios pra automatizar:

| Check | Como verificar | Aplica a |
|-------|----------------|----------|
| HTML comment antes do frontmatter | Regex: file começa com `<!--` e `-->` aparece antes de `---\ntitle:` | blog |
| Frontmatter YAML válido | Parser YAML | blog |
| `## PUBLISH THIS ↓` divider presente | Grep | linkedin, instagram |
| Forbidden words ausentes no PUBLISH section | Grep com lista do brand-voice, só na parte abaixo do divider | todos |
| Idioma do PUBLISH section bate com ICP geo | Heurística: detectar idioma do trecho + comparar com `geografia:` do ICP | todos |
| Char count do LinkedIn hook < 210 | Contar caracteres das 3 primeiras linhas abaixo do divider | linkedin |
| Caption burned-in mencionado | Grep | instagram, video |
| Frame por frame timing em vídeo | Detecção de tabela com coluna `t (s)` | video |
| Slug kebab-case válido | Regex | todos com slug no path |

LLM-as-judge pra dimensões subjetivas:
- Hook quality
- Brand voice fidelity
- CTA specificity
- Editorial cohesion com brief
