# ciromaciel-marketing

Agentes e skills de marketing/GTM. Use em qualquer projeto onde você está fazendo brand work, copy ou planejamento de campanha.

## Skills

| Skill | Quando dispara | O que produz |
|-------|----------------|--------------|
| `campaign-brief-generator` | "planeje uma campanha", "GTM para X" | Brief completo: canais, mensagens, conteúdo, métricas |
| `brand-voice-extractor` | "extraia brand voice de [empresa]" | Profile de tom, vocabulário, estrutura, persona |
| `visual-brand-extractor` | "extraia identidade visual de [site]" | Slide preset CSS + brand config JSON |

## Agents

| Agent | Função |
|-------|--------|
| `icp-researcher` | Pesquisa profunda de ICP (personas, dores, canais) |
| `copy-critic` | Revisa copy contra brand voice (devolve issues, não rewrite) |

## Commands

- `/new-campaign` — workflow completo de campanha (verifica ICP/brand voice antes)

## Workflow recomendado para novo cliente

```
1. /new-campaign
   ↓
2. Se sem brand voice → skill: brand-voice-extractor
3. Se sem ICP → agent: icp-researcher
4. Se sem visual → skill: visual-brand-extractor
   ↓
5. Skill campaign-brief-generator usa tudo acima
```
