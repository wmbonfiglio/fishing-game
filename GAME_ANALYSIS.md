# Pesca RPG - Análise & Roadmap

## 1. Análise Crítica das Mecânicas

### Onboarding (Nota: 3/10)

O jogo não tem tutorial. A única instrução é uma linha na tela título: *"ESPAÇO para lançar e fisgar - Segure ESPAÇO para recolher"*.

- O minigame de recolher (a mecânica central) nunca é explicado. O jogador não sabe o que é a "zona de captura", por que a barra de tensão existe, ou que a linha pode arrebentar.
- Não há primeira pescaria guiada. O jogador é jogado na Lagoa sem contexto.
- Os termos "Progresso" e "Tensão" aparecem durante o reeling sem explicação do que fazer para influenciá-los.
- A fase de "espera" (waiting) mostra "❗ PEIXE!" mas não diz que você tem apenas 2 segundos para reagir.

### Economia (Nota: 4/10)

**Renda média por localização:**

| Local | Renda média/pesca | Tempo médio/pesca | Ouro/minuto |
|-------|-------------------|-------------------|-------------|
| Lagoa | ~8-12 ouro | ~30s | ~20/min |
| Rio | ~50-70 ouro | ~35s | ~100/min |
| Oceano | ~150-250 ouro | ~40s | ~300/min |
| Abismo | ~500-1000 ouro | ~45s | ~800/min |

**Problemas estruturais:**

1. **Iscas são permanentes** - Uma vez comprada, é sua para sempre. A isca mais cara custa 500 ouro (trivial no mid-game). Não há money sink recorrente. O jogador acumula ouro infinitamente sem nada para gastar.
2. **Sem escolha horizontal** - Cada tier de equipamento é estritamente melhor que o anterior. Não existe "vara boa para peixes rápidos vs vara boa para peixes pesados". Sempre compre o próximo da lista.
3. **Auto-venda forçada** - Todo peixe é vendido automaticamente. Não há decisão de manter vs vender, não há inventário, não há peixes troféu.
4. **Preço de iscas irrelevante** - Grilo custa 5, Camarão 15. Isso é insignificante mesmo no early game (começa com 50). Comprar tudo cedo é trivial.

### Curva de Progressão (Nota: 5/10)

XP por nível segue `100 * 1.4^(n-1)`:

| Marco | XP acumulado | Pescas necessárias | Tempo estimado |
|-------|-------------|-------------------|----------------|
| Nv.5 (Rio) | ~710 XP | ~47 na Lagoa | ~23 min |
| Nv.10 (Oceano) | ~8.886 XP | ~220 no Rio | ~1h50 |
| Nv.18 (Abismo) | ~96.770 XP | ~645 no Oceano | ~5h+ |
| Nv.20 (Divine rod) | ~199.234 XP | ~200 no Abismo | ~1h30 extra |

**Problemas:**

1. **Early game bom, mid-game monótono** - Lv1-5 flui bem (~23 min). Mas Lv10-18 é um grind de 5+ horas fazendo exatamente a mesma coisa repetidamente, sem novas mecânicas desbloqueadas.
2. **Sem marcos intermediários** - Entre Lv10 (Oceano) e Lv18 (Abismo) são 8 níveis onde quase nada novo acontece. Apenas 3 equipamentos desbloqueiam nesse intervalo (Titânio Lv12, Isca Mágica Lv14, Mythril Lv16). São ~5 horas com pouca novidade.
3. **Locais anteriores ficam inúteis** - Quando desbloqueia o Rio, nunca mais há razão para voltar à Lagoa. Não há peixes exclusivos que justifiquem voltar.

### Curva de Desafio (Nota: 6/10)

| Local | Difficulty | Speed | Zona de captura* | Sensação |
|-------|-----------|-------|-----------------|----------|
| Lagoa | 0.8-4 | 1-1.8 | 18% (Bambu) | Tranquilo |
| Rio | 2.2-5 | 1.2-3 | 18.6% (Fibra) | Moderado |
| Oceano | 3-6 | 0.8-3.2 | 19.5% (Carbono) | Desafiante |
| Abismo | 3-8 | 2-3.5 | 22.5% (Mythril) | Brutal |

*Zona = `15 + rod.tension * 3`

**Problemas:**

1. **Leviatã pode ser impossível** - Com difficulty 8 e speed 3.5, o peixe se move `8 * 3.5 * 0.4 = 11.2 unidades/tick` + jitter. A zona de captura com a melhor vara é 24%. O peixe atravessa metade da zona em um único frame. É RNG puro, não skill.
2. **Dificuldade não escala com skill** - A única forma de facilitar é comprar equipamento melhor. Não há como um jogador habilidoso superar equipamento fraco. A vara move a zona a `1.5 * power` por tick - com Bambu isso é 1.5 unidades, enquanto peixes do Abismo movem 5-11 unidades. Matematicamente impossível.
3. **Tensão é pouco punitiva no early game** - Com peixes fáceis, a tensão nunca chega perto de 100%. O jogador não aprende a gerenciar tensão até enfrentar peixes difíceis, quando já é tarde.

### Engajamento / Retenção (Nota: 3/10)

1. **Zero persistência** - F5 perde tudo. O jogador que investiu horas perde tudo ao fechar o browser.
2. **Sem variedade entre sessões** - Toda pescaria é idêntica. Sem clima, sem hora do dia, sem eventos.
3. **Sem metas de curto prazo** - As conquistas são distantes (10, 50, 200 peixes). Não há objetivos diários ou semanais.
4. **A fase de espera é tempo morto** - O jogador fica olhando um emoji de anzol por 1-5 segundos sem interação.
5. **Sem feedback sensorial** - Sem som, sem vibração, sem partículas. Pescar um Leviatã mítico tem o mesmo feedback visual que uma Sardinha.

### Mobile (Nota: 2/10)

- O botão "LANÇAR LINHA" funciona com touch (mouseDown/mouseUp).
- O botão "SEGURAR PARA RECOLHER" funciona com touch.
- **MAS**: durante a fase `waiting`, não há botão para fisgar o peixe. Só funciona com teclado. Mobile está quebrado na etapa mais crítica.

### O que funciona bem

- A mecânica de casting (barra de força) é intuitiva e satisfatória.
- O minigame de reeling é genuinamente bom quando entendido - equilíbrio entre posicionar e gerenciar tensão.
- O sistema de raridade cria momentos de emoção.
- O visual é limpo e atmosférico (gradientes, animações de água).
- A estrutura de 4 locais com identidade visual própria é sólida.
- O sistema de conquistas fornece marcos de longo prazo.

---

## 2. Roadmap de Evolução

### Fase 0 - Fundação (urgente)
> *Sem isso o jogo não retém ninguém*

| Item | Prioridade | Impacto |
|------|-----------|---------|
| **Save/Load com localStorage** | Crítico | Sem isso, ninguém joga mais de 1 sessão |
| **Tutorial interativo** | Crítico | Primeira pescaria guiada, ensinar reeling |
| **Botão de fisgar no mobile** | Crítico | Mobile está literalmente quebrado |
| **Balanceamento do Leviatã** | Alto | Reduzir speed para 2.5 ou adicionar "janelas de calma" |

### Fase 1 - Feedback & Polish
> *Tornar cada pescaria satisfatória*

| Item | Descrição |
|------|-----------|
| **Efeitos sonoros** | Splash ao lançar, tensão crescente no reeling, fanfarra ao capturar raro+ |
| **Partículas/VFX** | Splash na água, brilho na captura, shake na tela quando tensão > 80% |
| **Animação do peixe** | Mostrar silhueta do peixe na água durante reeling |
| **Feedback de raridade** | Captura de legendário/mítico merece uma animação especial, não o mesmo card |
| **Notificação de level up** | Tela dedicada mostrando o que desbloqueou |

### Fase 2 - Profundidade Econômica
> *Criar decisões interessantes*

| Item | Descrição |
|------|-----------|
| **Iscas consumíveis** | Cada uso gasta 1 isca. Minhoca é infinita, as demais precisam ser recompradas. Cria money sink |
| **Inventário de peixes** | Não auto-vender. Jogador escolhe: vender, manter como troféu, ou usar como isca |
| **Peixes variantes** | 5% chance de "dourado" (2x preço), 1% "gigante" (3x peso) |
| **Multiplicador de combo** | Pescarias consecutivas sem escape: x1.5, x2, x2.5 no ouro |
| **Equipamento horizontal** | "Vara Elétrica" (mais velocidade, menos zona) vs "Vara Pesada" (mais zona, menos velocidade) |

### Fase 3 - Variedade & Metas
> *Cada sessão diferente da anterior*

| Item | Descrição |
|------|-----------|
| **Sistema de clima** | Chuva (+20% atração), Tempestade (peixes raros, mais difíceis), Noite (peixes noturnos exclusivos) |
| **Missões diárias** | "Pegue 3 Tucunarés", "Pesque sem arrebentar a linha 5 vezes". Recompensa: ouro bônus, item especial |
| **Eventos na espera** | Em vez de esperar parado: lixo/bota (sem valor), baú (ouro), alga (item craft). Torna a espera interativa |
| **Boss fish** | Peixes-chefe por localização. Mecânica especial (padrões de movimento únicos). Drop de equipamento exclusivo |
| **Razão para revisitar locais** | Missões exigem peixes de locais antigos. Peixes "migratórios" que aparecem em locais aleatórios |

### Fase 4 - Meta-Game & Coleção
> *Motivo para continuar após completar a coleção*

| Item | Descrição |
|------|-----------|
| **Aquário pessoal** | Tela com tanque animado. Colocar peixes capturados como decoração |
| **Enciclopédia expandida** | Cada peixe tem lore, habitat, dica de captura. Desbloqueado progressivamente |
| **Crafting** | Combinar materiais (escamas, barbatanas) em equipamentos únicos |
| **Sistema de prestígio** | Ao atingir Lv.20, opção de "reiniciar" com bônus permanente (+10% XP, +5% luck) |
| **Recordes pessoais** | Maior peixe por espécie, maior combo, pesca mais rápida |

### Fase 5 - Social & Endgame
> *Longo prazo, se o jogo crescer*

| Item | Descrição |
|------|-----------|
| **Leaderboard** | Ranking por maior peixe, mais ouro, coleção completa mais rápida |
| **Torneios semanais** | "Quem pesca o Marlim mais pesado essa semana?" |
| **Eventos sazonais** | Peixes de Natal, Halloween (peixes zumbi), Verão (local de praia exclusivo) |
| **Multiplayer assíncrono** | Comparar aquários, trocar peixes, enviar desafios |

### Matriz de Prioridade

```
IMPACTO
  ▲
  │  ★ Save/Load     ★ Tutorial     ★ Consumíveis
  │
  │  ★ SFX           ★ Clima        ★ Boss Fish
  │  ★ Mobile fix    ★ Combos       ★ Aquário
  │
  │  ★ Partículas    ★ Missões      ★ Crafting
  │  ★ Balancear     ★ Variantes    ★ Prestígio
  │
  │                                  ★ Leaderboard
  │                                  ★ Torneios
  └──────────────────────────────────────────► ESFORÇO
     Baixo           Médio           Alto
```

**Recomendação**: atacar Fase 0 primeiro (save, tutorial, mobile fix). Sem isso nenhuma feature adicional importa porque ninguém vai chegar a vê-las.
