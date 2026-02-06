# Pesca RPG - Análise & Roadmap

## 1. Análise Crítica das Mecânicas

### Onboarding (Nota: 3/10 → 6/10) ✅ Parcialmente resolvido

~~O jogo não tem tutorial.~~ **Fase 0 implementou tutorial interativo de 5 etapas** que guia a primeira pescaria completa (lançar → força → esperar → fisgar → recolher). Desaparece após a primeira captura e é persistido no save.

- ~~O minigame de recolher nunca é explicado.~~ **Resolvido**: Step 5 do tutorial explica "Mantenha o peixe na zona verde! Cuidado com a tensão!"
- ~~Não há primeira pescaria guiada.~~ **Resolvido**: Tutorial acompanha cada fase com instruções contextuais + indicadores de progresso (dots 1-5).
- Os termos "Progresso" e "Tensão" ainda poderiam ter tooltips mais detalhados (melhoria futura).
- ~~A fase de "espera" não diz que tem 2 segundos para reagir.~~ **Resolvido**: Step 4 diz "AGORA! Pressione para fisgar!"

### Economia (Nota: 4/10 → 7/10) ✅ Substancialmente resolvido

**Renda média por localização:**

| Local | Renda média/pesca | Tempo médio/pesca | Ouro/minuto |
|-------|-------------------|-------------------|-------------|
| Lagoa | ~8-12 ouro | ~30s | ~20/min |
| Rio | ~50-70 ouro | ~35s | ~100/min |
| Oceano | ~150-250 ouro | ~40s | ~300/min |
| Abismo | ~500-1000 ouro | ~45s | ~800/min |

**Problemas estruturais:**

1. ~~**Iscas são permanentes**~~ **Resolvido (Fase 2)**: Iscas agora são consumíveis (exceto Minhoca). Cada lançamento consome 1 unidade. Compra em stacks (3-20 unidades). Money sink recorrente criado. Auto-switch para Minhoca quando acabam.
2. ~~**Sem escolha horizontal**~~ **Resolvido (Fase 2)**: 13 equipamentos horizontais adicionados - 5 varas (Chicote, Bambu da Sorte, Arpão, Coral, Elétrica), 4 iscas (Vagalume, Minhoca Dourada, Água-Viva, Isca Abissal), 4 linhas (Seda, Elástica, Fibra de Carbono, Fio de Mithril). Cada alternativa tem tradeoffs claros (ex: Vara Chicote = +força/-zona, Bambu da Sorte = -força/+sorte).
3. ~~**Auto-venda forçada**~~ **Resolvido (Fase 2)**: Catch card agora oferece 3 opções: Vender (ouro imediato), Guardar (inventário de 30 slots com sistema de troféu), ou Isca (bonus de raridade na próxima pesca). Tela de inventário completa com filtros, sort, bulk sell e proteção de troféus.
4. ~~**Preço de iscas irrelevante**~~ **Parcialmente resolvido**: Iscas consumíveis criam custo recorrente. Isca Abissal (200 ouro/5 unidades) e Isca Ancestral (500 ouro/3 unidades) são money sinks significativos no mid/late game.

### Curva de Progressão (Nota: 5/10 → 7/10) ✅ Parcialmente resolvido

XP por nível segue `100 * 1.4^(n-1)`:

| Marco | XP acumulado | Pescas necessárias | Tempo estimado |
|-------|-------------|-------------------|----------------|
| Nv.5 (Rio) | ~710 XP | ~47 na Lagoa | ~23 min |
| Nv.10 (Oceano) | ~8.886 XP | ~220 no Rio | ~1h50 |
| Nv.18 (Abismo) | ~96.770 XP | ~645 no Oceano | ~5h+ |
| Nv.20 (Divine rod) | ~199.234 XP | ~200 no Abismo | ~1h30 extra |

**Problemas:**

1. **Early game bom, mid-game monótono** - Lv1-5 flui bem (~23 min). Mas Lv10-18 é um grind de 5+ horas fazendo exatamente a mesma coisa repetidamente, sem novas mecânicas desbloqueadas.
2. ~~**Sem marcos intermediários**~~ **Parcialmente resolvido (Fase 2)**: Equipamentos horizontais adicionam desbloqueios em quase todos os tiers. Agora entre Lv10-18: Linha Trançada/Fibra de Carbono (Lv10), Vara Elétrica/Titânio (Lv12), Isca Mágica/Isca Abissal (Lv14), Aço/Fio de Mithril/Mythril (Lv15-16). Mais decisões de compra ao longo do mid-game.
3. ~~**Locais anteriores ficam inúteis**~~ **Resolvido (Fase 3)**: Peixes migratórios (2-3/dia) aparecem em locais diferentes do original. Boss fish por localização requer catches acumulados para spawnar. Missões diárias podem exigir atividade em qualquer local.

### Curva de Desafio (Nota: 6/10 → 8/10) ✅ Substancialmente resolvido

| Local | Difficulty | Speed | Zona de captura* | Sensação |
|-------|-----------|-------|-----------------|----------|
| Lagoa | 0.8-4 | 1-1.8 | 18% (Bambu) | Tranquilo |
| Rio | 2.2-5 | 1.2-3 | 18.6% (Fibra) | Moderado |
| Oceano | 3-6 | 0.8-3.2 | 19.5% (Carbono) | Desafiante |
| Abismo | 3-7 | 2-2.8 | 22.5% (Mythril) | Desafiante+ |

*Zona = `15 + rod.tension * 3`

**Problemas:**

1. ~~**Leviatã pode ser impossível**~~ **Resolvido**: Leviatã rebalanceado (difficulty 8→7, speed 3.5→2.8). Movimento médio agora `7 * 2.8 * 0.4 = 7.84 unidades/tick` (era 11.2). Dragão Marinho também ajustado (speed 3→2.5). Ambos continuam desafiantes mas catchable com Divine Rod (half-zone = 12 units).
2. **Dificuldade não escala com skill** - A única forma de facilitar é comprar equipamento melhor. Não há como um jogador habilidoso superar equipamento fraco. A vara move a zona a `1.5 * power` por tick - com Bambu isso é 1.5 unidades, enquanto peixes do Abismo movem 5-8 unidades. Matematicamente impossível.
3. **Tensão é pouco punitiva no early game** - Com peixes fáceis, a tensão nunca chega perto de 100%. O jogador não aprende a gerenciar tensão até enfrentar peixes difíceis, quando já é tarde.
4. **(Fase 3)** Boss fish adicionam picos de desafio significativos por localização. 4 padrões de movimento únicos (zigzag, charge, erratic, dive), +30% tensão, HP-based fight. Clima Tempestade adiciona +0.3 difficulty globalmente. Escala de desafio muito mais variada.

### Engajamento / Retenção (Nota: 3/10 → 8/10) ✅ Substancialmente resolvido

1. ~~**Zero persistência**~~ **Resolvido**: Auto-save com localStorage (~36 variáveis, inclui Phase 2+3 states). Botão "CONTINUAR" na tela título quando há save. Botão "NOVO JOGO" limpa save e reinicia.
2. ~~**Sem variedade entre sessões**~~ **Resolvido (Fase 3)**: Sistema de clima com 4 tipos (Limpo/Chuva/Tempestade/Noite) cicla a cada 3 minutos. Cada clima afeta raridade (+0-20%) e dificuldade. Peixes noturnos exclusivos da Noite. Peixes migratórios mudam de local diariamente (seed determinístico). Overlays visuais (chuva, tempestade, noite escura).
3. ~~**Sem metas de curto prazo**~~ **Resolvido (Fases 2+3)**: 12 conquistas no total. Missões diárias (3/dia: fácil/média/difícil) com recompensas de ouro e iscas. Streak de dias consecutivos. Boss fish com drops exclusivos. Combo counter dá feedback constante.
4. ~~**A fase de espera é tempo morto**~~ **Resolvido (Fase 3)**: Eventos clicáveis aparecem durante a espera (3% por tick): Lixo (nada), Baú (+25 ouro), Alga Mágica (+5 iscas), Bolha de XP (+15 XP). Timeout visual de 1.5s com barra encolhendo. Toast de resultado.
5. ~~**Sem feedback sensorial**~~ **Resolvido (Fase 1)**: 7 sons procedurais via Web Audio API, partículas de splash/catch, screen shake em tensão alta, silhueta do peixe na água, card especial para legendary/mythic, overlay de level up com desbloqueios, botão mute.
6. ~~**Sem decisão pós-captura**~~ **Resolvido (Fase 2)**: 3 opções ao capturar (Vender/Guardar/Isca), inventário com troféus, combo multiplier incentiva pescarias consecutivas.

### Mobile (Nota: 2/10 → 6/10) ✅ Parcialmente resolvido

- O botão "LANÇAR LINHA" funciona com touch (mouseDown/mouseUp).
- O botão "SEGURAR PARA RECOLHER" funciona com touch.
- ~~**MAS**: durante a fase `waiting`, não há botão para fisgar o peixe.~~ **Resolvido**: Botão "FISGAR!" (vermelho, pulsante a 0.5s) aparece durante `waiting` + `bobberExclamation`. Suporta `onClick` e `onTouchStart` com `preventDefault`.
- Ainda falta: layout responsivo, tamanho dos botões em telas pequenas, orientação landscape forçada.

### O que funciona bem

- A mecânica de casting (barra de força) é intuitiva e satisfatória.
- O minigame de reeling é genuinamente bom quando entendido - equilíbrio entre posicionar e gerenciar tensão.
- O sistema de raridade cria momentos de emoção.
- O visual é limpo e atmosférico (gradientes, animações de água).
- A estrutura de 4 locais com identidade visual própria é sólida.
- O sistema de conquistas fornece marcos de longo prazo.
- **(Fase 2)** O sistema de variantes (dourado/gigante) cria momentos "wow" inesperados.
- **(Fase 2)** O combo multiplier incentiva sessões mais longas e penaliza erros de forma justa.
- **(Fase 2)** A decisão Vender/Guardar/Isca após captura dá agência ao jogador em cada pesca.
- **(Fase 2)** Equipamentos horizontais com tradeoffs claros permitem builds diferenciados.
- **(Fase 3)** O sistema de clima muda a atmosfera visual e mecânica a cada 3 minutos, criando variedade natural.
- **(Fase 3)** Missões diárias com seed determinístico dão objetivos claros e reward loop diário.
- **(Fase 3)** Eventos na espera transformam tempo morto em micro-interações recompensadoras.
- **(Fase 3)** Boss fish com padrões de movimento únicos são genuinamente desafiantes e recompensam com drops exclusivos.
- **(Fase 3)** Peixes migratórios incentivam revisitar locais e criam variedade diária no pool de peixes.

---

## 2. Roadmap de Evolução

### Fase 0 - Fundação ✅ CONCLUÍDA
> *Implementada em 05/02/2026*

| Item | Status | Detalhes |
|------|--------|----------|
| **Save/Load com localStorage** | ✅ Feito | Auto-save de 16 variáveis, lazy init com `??` defaults, botão CONTINUAR/NOVO JOGO |
| **Tutorial interativo** | ✅ Feito | 5 etapas contextuais (idle→casting→waiting→hook→reeling), dots indicadores, `pointerEvents: "none"`, persiste no save |
| **Botão de fisgar no mobile** | ✅ Feito | Botão "FISGAR!" vermelho pulsante (0.5s), onClick + onTouchStart, aparece apenas com bobberExclamation |
| **Balanceamento do Leviatã** | ✅ Feito | Leviatã: difficulty 8→7, speed 3.5→2.8. Dragão Marinho: speed 3→2.5 |

### Fase 1 - Feedback & Polish ✅ CONCLUÍDA
> *Implementada em 05/02/2026*

| Item | Status | Detalhes |
|------|--------|----------|
| **Efeitos sonoros** | ✅ Feito | 7 sons procedurais via Web Audio API (`src/utils/audio.js`): splash, bite, reel warning (tensão >70%), catch (arpejo por rarity), escape, level up. Sem libs externas, sem arquivos de áudio. Botão mute no HUD, persiste no save |
| **Partículas/VFX** | ✅ Feito | Splash (8 gotas azuis ao lançar), catch glow (6-12 partículas na cor da rarity), screen shake quando tensão >80% |
| **Animação do peixe** | ✅ Feito | Silhueta do peixe na água durante reeling: `blur(4px) brightness(0.5)`, `opacity: 0.4`, acompanha posição do peixe |
| **Feedback de raridade** | ✅ Feito | Legendary/mythic: `legendaryPopIn` animation, `radial-gradient` background, `boxShadow: 0 0 40px`, badges (⭐ / ⭐✨⭐) |
| **Notificação de level up** | ✅ Feito | Overlay fullscreen z100, card com nível grande + lista de unlocks (helper `calculateUnlocks`), dismiss por click/touch |
| **QoL: Espaço para continuar** | ✅ Feito | Tecla Espaço aceita na tela "caught" para pescar novamente, com cooldown de 800ms para evitar skip acidental |

### Fase 2 - Profundidade Econômica ✅ CONCLUÍDA
> *Implementada em 06/02/2026*

| Item | Status | Detalhes |
|------|--------|----------|
| **Iscas consumíveis** | ✅ Feito | Cada lançamento consome 1 unidade (exceto Minhoca infinita). Compra em stacks. Auto-switch para Minhoca ao esgotar. `baitQuantities` map no save. Recompra ilimitada na loja |
| **Inventário de peixes** | ✅ Feito | Tela `InventoryScreen.jsx` completa: grid responsivo, 30 slots, sort (recente/peso/preço/raridade), filtro por rarity, bulk sell protege troféus, toggle troféu por peixe |
| **Peixes variantes** | ✅ Feito | `rollVariant()`: 94% normal, 5% dourado (2x preço, visual sepia/saturate), 1% gigante (3x peso, emoji maior). Badge na catch card e reeling HUD. Contagem de variantes na coleção |
| **Multiplicador de combo** | ✅ Feito | Incrementa a cada captura, reseta no escape. Multiplier: `min(1 + (combo-1)*0.5, 2.5)`. HUD badge "COMBO x1.5" com pulse. Achievement "Em Chamas!" (combo x5) |
| **Equipamento horizontal** | ✅ Feito | 13 alternativas: 5 varas (Chicote, Bambu Sorte, Arpão, Coral, Elétrica), 4 iscas (Vagalume, Minhoca Dourada, Água-Viva, Abissal), 4 linhas (Seda, Elástica, Fibra Carbono, Mithril) com `reelBonus`. Shop ordena por unlockLevel |
| **Catch card 3 botões** | ✅ Feito | Vender (💰 ouro imediato), Guardar (🎒 inventário, disabled se cheio), Isca (🎣 bonus raridade próxima pesca). Espaço removido do caught phase |
| **Fish-as-bait** | ✅ Feito | Usar peixe como isca dá `FISH_BAIT_BONUS[rarity]` (5%-75% raridade). Consome-se no próximo lançamento. Indicador verde no HUD |
| **5 novos achievements** | ✅ Feito | combo_5, golden_catch, giant_catch, trophy_5, fish_bait. Stats expandidos em `getStats()` |

### Fase 3 - Variedade & Metas ✅ CONCLUÍDA
> *Implementada em 06/02/2026*

| Item | Status | Detalhes |
|------|--------|----------|
| **Sistema de clima** | ✅ Feito | 4 tipos (Limpo/Chuva/Tempestade/Noite), ciclo de 3min, rarityBonus (0-20%), difficultyAdd (0-0.3). Overlays visuais: chuva (linhas animadas), tempestade (flash periódico), noite (overlay escuro). Badge no HUD |
| **Peixes noturnos** | ✅ Feito | 4 peixes marcados `nocturnal: true` (1/local): Pirarucu Jovem, Piranha Rei, Peixe-Lua, Leviatã. Só aparecem durante clima Noite. Achievement "Pescador Noturno" |
| **Eventos na espera** | ✅ Feito | 3% chance/tick durante wait. 4 tipos: Lixo (nada), Baú (+25 ouro), Alga Mágica (+5 iscas), Bolha de XP (+15 XP). Emoji clicável com bounce, barra de timeout 1.5s, toast de resultado. Achievement "Olho Vivo" (10 eventos) |
| **Missões diárias** | ✅ Feito | 3 missões/dia (fácil/média/difícil) via seeded RNG (`seededRng(day * 31337)`). 5 templates: catch, catch_rarity, gold, combo, weight. Recompensas: 30-200 ouro + stacks de isca. Streak de dias consecutivos. Tela `MissionsScreen.jsx` com progresso, badges, stats. Mini-widget no HUD. Achievement "Missionário" (10 missões) |
| **Boss fish** | ✅ Feito | 4 bosses (Rei Carpa/Lagoa, Serpente do Rio/Rio, Kraken Jovem/Oceano, Leviatã Ancestral/Abismo). Spawn após N catches + % chance. Fight HP-based com padrões únicos (zigzag/charge/erratic/dive), +30% tensão. Drops exclusivos: Vara Real, Escama de Serpente, Fio de Kraken, Espinha do Leviatã (`bossOnly: true`, não aparecem na loja). Achievements "Caça-Chefes" e "Lenda dos Mares" |
| **Peixes migratórios** | ✅ Feito | 2-3 peixes migram diariamente via seeded RNG (`seededRng(day * 7919)`). Aparecem em local diferente do original. +50% XP bônus ao capturar. Badge "Migratório" na catch card. Achievement "Globetrotter" (5 migratórios) |
| **7 novos achievements** | ✅ Feito | weather_all, nocturnal_catch, mission_10, boss_first, boss_all, wait_event, migratory_catch |

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
  │  ✅ Save/Load    ✅ Tutorial     ✅ Consumíveis
  │
  │  ✅ SFX          ✅ Clima        ✅ Boss Fish
  │  ✅ Mobile fix   ✅ Combos       ★ Aquário
  │
  │  ✅ Partículas   ✅ Missões      ★ Crafting
  │  ✅ Balancear    ✅ Variantes    ★ Prestígio
  │
  │  ✅ Horizontais  ✅ Inventário   ★ Leaderboard
  │  ✅ Wait Events  ✅ Migratórios  ★ Torneios
  └──────────────────────────────────────────► ESFORÇO
     Baixo           Médio           Alto
```

**Próximo passo**: Fases 0, 1, 2 e 3 concluídas. Atacar **Fase 4 (Meta-Game & Coleção)** - aquário pessoal, enciclopédia expandida, crafting, prestígio e recordes pessoais.
