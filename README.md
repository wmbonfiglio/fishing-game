<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite" alt="Vite 7">
  <img src="https://img.shields.io/badge/Zero_Dependencies-black?style=flat-square" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/100%25_Client_Side-green?style=flat-square" alt="Client Side">
</p>

<h1 align="center">🎣 Pesca RPG</h1>

<p align="center">
  <strong>Um RPG de pesca completo no navegador.</strong><br>
  Lance sua linha, lute com peixes lendários, enfrente bosses e explore 4 locais únicos<br>— tudo em React puro, sem dependências externas.
</p>

<p align="center">
  <code>22 espécies</code> · <code>4 bosses</code> · <code>33 equipamentos</code> · <code>22 conquistas</code> · <code>missões diárias</code> · <code>sistema de clima</code>
</p>

---

## Como Jogar

```bash
git clone <repo-url>
cd fishing-game
npm install
npm run dev
```

Abra `http://localhost:5173` e comece a pescar.

---

## O Jogo

### A Pescaria

Cada pesca tem **4 fases**:

| Fase | O que fazer |
|------|-------------|
| **Lançar** | Segure e solte para dosar a força do arremesso |
| **Esperar** | Aguarde a fisgada — fique atento a eventos surpresa na água |
| **Fisgar** | Reaja rápido quando o peixe morder |
| **Recolher** | Mantenha o peixe na zona verde equilibrando progresso e tensão da linha |

Um tutorial interativo guia a primeira pescaria completa.

### Locais

| Local | Nível | Vibe |
|-------|-------|------|
| 🏞️ **Lagoa Tranquila** | 1 | Águas calmas, peixes pequenos — perfeito para aprender |
| 🏔️ **Rio Selvagem** | 5 | Corrente forte, peixes maiores e mais agressivos |
| 🌊 **Mar Aberto** | 10 | Profundezas perigosas, tubarões e espadartes |
| 🌀 **Abismo Ancestral** | 18 | Criaturas míticas de outro mundo |

### Raridades

<table>
  <tr>
    <td>⬜ Comum</td>
    <td>🟢 Incomum</td>
    <td>🔵 Raro</td>
    <td>🟣 Épico</td>
    <td>🟠 Lendário</td>
    <td>🔴 Mítico</td>
  </tr>
</table>

Além da raridade, qualquer peixe pode aparecer como variante **✦ Dourado** (5% — vale 2x) ou **🔺 Gigante** (1% — pesa 3x).

---

## Sistemas

### Equipamento

Mais de **30 equipamentos** com tradeoffs reais — não existe "melhor de tudo":

- **Varas** — equilibre força, zona de captura e sorte
- **Iscas** — consumíveis (exceto Minhoca) com diferentes perfis de atração vs. raridade
- **Linhas** — escolha entre resistência e velocidade de recolhimento

Equipamentos horizontais em cada tier permitem builds diferentes: uma Vara Chicote com Linha de Seda joga muito diferente de um Bambu da Sorte com Fluorocarbono.

### Boss Fish

4 bosses guardam cada local. Derrote-os para ganhar **drops exclusivos** que não aparecem na loja:

| Boss | Local | Padrão | Drop |
|------|-------|--------|------|
| 👑 Rei Carpa | Lagoa | Zigzag | Vara Real |
| 🐍 Serpente do Rio | Rio | Charge | Escama de Serpente |
| 🦑 Kraken Jovem | Oceano | Erratic | Fio de Kraken |
| 🐉 Leviatã Ancestral | Abismo | Dive | Espinha do Leviatã |

### Clima

O clima muda a cada **3 minutos** e afeta a gameplay:

| Clima | Efeito |
|-------|--------|
| ☀️ Limpo | Normal |
| 🌧️ Chuva | +10% chance de raros, peixes levemente mais difíceis |
| ⛈️ Tempestade | +20% raros, dificuldade aumentada |
| 🌙 Noite | Peixes noturnos exclusivos aparecem |

Cada clima tem overlay visual próprio: gotas de chuva animadas, flashes de tempestade e escuridão noturna.

### Missões Diárias

3 missões novas por dia (fácil / média / difícil) com seed determinístico — todos os jogadores recebem as mesmas missões no mesmo dia. Mantenha o streak de dias consecutivos para recompensas extras.

### Mais Sistemas

- **Combo** — pescarias consecutivas sem erros multiplicam recompensas (até 2.5x)
- **Inventário** — guarde até 30 peixes, marque troféus, venda em massa
- **Peixe como isca** — sacrifique um peixe capturado para bonus de raridade na próxima pesca
- **Peixes migratórios** — 2-3 espécies mudam de local diariamente (+50% XP)
- **Eventos na espera** — baús, bolhas de XP e algas mágicas aparecem enquanto você espera a fisgada
- **22 conquistas** — de "Primeiro Peixe!" até "Lenda dos Mares"

---

## Arquitetura

```
src/
├── App.jsx                    # Router (switch em game.screen)
├── main.jsx                   # Entry point
├── hooks/
│   └── useGameState.js        # Toda a lógica do jogo (estado, save, mecânicas)
├── components/
│   ├── TitleScreen.jsx        # Tela título com continuar/novo jogo
│   ├── GameScreen.jsx         # Minigame de pesca (4 fases)
│   ├── ShopScreen.jsx         # Loja de equipamentos e iscas
│   ├── CollectionScreen.jsx   # Enciclopédia de peixes
│   ├── InventoryScreen.jsx    # Inventário com sort/filtro/troféus
│   ├── AchievementsScreen.jsx # 22 conquistas
│   └── MissionsScreen.jsx     # Missões diárias + streak
├── data/
│   └── gameData.js            # Todos os dados (peixes, equipamentos, etc.)
└── utils/
    └── audio.js               # 7 sons procedurais via Web Audio API
```

**Decisões técnicas:**

- **Zero dependências** além de React — sem libs de estado, áudio, animação ou UI
- **Sons procedurais** via Web Audio API (sem arquivos de áudio)
- **Save automático** via localStorage com backward-compatibility
- **Seeded RNG** para missões e migrações determinísticas por dia
- **Single state hook** — `useGameState()` é o coração de toda a lógica

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | ESLint |

---

<p align="center">
  Feito com React + Vite · Sem backend · Sem dependências · Só pesca 🐟
</p>
