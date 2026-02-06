export const RARITY_COLORS = {
  common: "#8B9DAF",
  uncommon: "#4CAF50",
  rare: "#2196F3",
  epic: "#9C27B0",
  legendary: "#FF9800",
  mythic: "#FF1744",
};

export const RARITY_NAMES = {
  common: "Comum",
  uncommon: "Incomum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
  mythic: "Mítico",
};

export const LOCATIONS = [
  {
    id: "pond",
    name: "Lagoa Tranquila",
    icon: "🏞️",
    unlockLevel: 1,
    description: "Águas calmas, peixes pequenos",
    bgGradient: "linear-gradient(180deg, #87CEEB 0%, #4A90A4 40%, #2D5F6E 60%, #1A3A44 100%)",
    waterColor: "#2D5F6E",
  },
  {
    id: "river",
    name: "Rio Selvagem",
    icon: "🏔️",
    unlockLevel: 5,
    description: "Corrente forte, peixes maiores",
    bgGradient: "linear-gradient(180deg, #6B8F71 0%, #3D6B5E 40%, #1E4D4A 60%, #0D2B2A 100%)",
    waterColor: "#1E4D4A",
  },
  {
    id: "ocean",
    name: "Mar Aberto",
    icon: "🌊",
    unlockLevel: 10,
    description: "Profundezas perigosas, tesouros escondidos",
    bgGradient: "linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #0a1628 100%)",
    waterColor: "#0f3460",
  },
  {
    id: "abyss",
    name: "Abismo Ancestral",
    icon: "🌀",
    unlockLevel: 18,
    description: "Criaturas antigas e míticas",
    bgGradient: "linear-gradient(180deg, #0D0015 0%, #1A0033 30%, #2D004D 60%, #0D0015 100%)",
    waterColor: "#1A0033",
  },
];

export const FISH_DATABASE = [
  // Pond fish
  { id: "sardinha", name: "Sardinha", emoji: "🐟", rarity: "common", location: "pond", minWeight: 0.1, maxWeight: 0.5, basePrice: 5, xp: 10, difficulty: 1, speed: 1, description: "Peixe pequeno e ágil" },
  { id: "tilapia", name: "Tilápia", emoji: "🐠", rarity: "common", location: "pond", minWeight: 0.3, maxWeight: 1.5, basePrice: 10, xp: 15, difficulty: 1.5, speed: 1.2, description: "Comum nas lagoas brasileiras" },
  { id: "lambari", name: "Lambari", emoji: "🐟", rarity: "common", location: "pond", minWeight: 0.05, maxWeight: 0.3, basePrice: 3, xp: 8, difficulty: 0.8, speed: 1.5, description: "Rápido porém fraco" },
  { id: "carpa", name: "Carpa Dourada", emoji: "🐠", rarity: "uncommon", location: "pond", minWeight: 1, maxWeight: 4, basePrice: 25, xp: 30, difficulty: 2, speed: 1.3, description: "Brilha sob o sol" },
  { id: "trairão", name: "Trairão", emoji: "🐡", rarity: "rare", location: "pond", minWeight: 2, maxWeight: 6, basePrice: 60, xp: 60, difficulty: 3, speed: 1.8, description: "Predador da lagoa" },
  { id: "pirarucu_jr", name: "Pirarucu Jovem", emoji: "🐋", rarity: "epic", location: "pond", minWeight: 5, maxWeight: 15, basePrice: 150, xp: 120, difficulty: 4, speed: 1.5, description: "Já impressiona jovem" },

  // River fish
  { id: "dourado", name: "Dourado", emoji: "🐠", rarity: "uncommon", location: "river", minWeight: 2, maxWeight: 8, basePrice: 40, xp: 35, difficulty: 2.5, speed: 2, description: "O rei dos rios" },
  { id: "tucunare", name: "Tucunaré", emoji: "🐟", rarity: "uncommon", location: "river", minWeight: 1.5, maxWeight: 6, basePrice: 35, xp: 30, difficulty: 2.2, speed: 2.2, description: "Agressivo e belo" },
  { id: "pintado", name: "Pintado", emoji: "🐡", rarity: "rare", location: "river", minWeight: 5, maxWeight: 25, basePrice: 80, xp: 70, difficulty: 3.5, speed: 1.5, description: "Gigante dos rios" },
  { id: "jaú", name: "Jaú", emoji: "🐋", rarity: "rare", location: "river", minWeight: 10, maxWeight: 50, basePrice: 120, xp: 100, difficulty: 4, speed: 1.2, description: "Monstro de rio" },
  { id: "pirarucu", name: "Pirarucu", emoji: "🐋", rarity: "epic", location: "river", minWeight: 20, maxWeight: 80, basePrice: 250, xp: 180, difficulty: 4.5, speed: 1.8, description: "O maior peixe de água doce" },
  { id: "piranha_rei", name: "Piranha Rei", emoji: "🦈", rarity: "legendary", location: "river", minWeight: 3, maxWeight: 8, basePrice: 500, xp: 300, difficulty: 5, speed: 3, description: "Líder da matilha" },

  // Ocean fish
  { id: "atum", name: "Atum", emoji: "🐟", rarity: "uncommon", location: "ocean", minWeight: 10, maxWeight: 50, basePrice: 60, xp: 45, difficulty: 3, speed: 2.5, description: "Veloz como torpedo" },
  { id: "marlim", name: "Marlim Azul", emoji: "🐠", rarity: "rare", location: "ocean", minWeight: 30, maxWeight: 150, basePrice: 200, xp: 120, difficulty: 4, speed: 2.8, description: "O troféu do mar" },
  { id: "tubarao", name: "Tubarão", emoji: "🦈", rarity: "epic", location: "ocean", minWeight: 50, maxWeight: 300, basePrice: 400, xp: 200, difficulty: 5, speed: 2, description: "Predador supremo" },
  { id: "peixe_lua", name: "Peixe-Lua", emoji: "🌙", rarity: "epic", location: "ocean", minWeight: 100, maxWeight: 500, basePrice: 350, xp: 180, difficulty: 3.5, speed: 0.8, description: "Enorme e misterioso" },
  { id: "espadarte", name: "Espadarte", emoji: "⚔️", rarity: "legendary", location: "ocean", minWeight: 40, maxWeight: 200, basePrice: 600, xp: 350, difficulty: 5.5, speed: 3.2, description: "Lâmina do oceano" },
  { id: "baleia_dourada", name: "Baleia Dourada", emoji: "🐋", rarity: "legendary", location: "ocean", minWeight: 500, maxWeight: 2000, basePrice: 1500, xp: 600, difficulty: 6, speed: 1.5, description: "Lenda dos marinheiros" },

  // Abyss fish
  { id: "peixe_lanterna", name: "Peixe Lanterna", emoji: "💡", rarity: "rare", location: "abyss", minWeight: 1, maxWeight: 5, basePrice: 100, xp: 80, difficulty: 3, speed: 2, description: "Brilha na escuridão" },
  { id: "lula_gigante", name: "Lula Gigante", emoji: "🦑", rarity: "epic", location: "abyss", minWeight: 50, maxWeight: 300, basePrice: 500, xp: 250, difficulty: 5, speed: 2.5, description: "Terror das profundezas" },
  { id: "dragao_marinho", name: "Dragão Marinho", emoji: "🐉", rarity: "legendary", location: "abyss", minWeight: 100, maxWeight: 800, basePrice: 2000, xp: 800, difficulty: 6, speed: 2.5, description: "Criatura ancestral" },
  { id: "leviata", name: "Leviatã", emoji: "👁️", rarity: "mythic", location: "abyss", minWeight: 1000, maxWeight: 5000, basePrice: 10000, xp: 3000, difficulty: 7, speed: 2.8, description: "O deus dos abismos" },
];

export const RODS = [
  { id: "bamboo", name: "Vara de Bambu", icon: "🎋", price: 0, power: 1, tension: 1, luck: 0, description: "Simples mas funcional" },
  { id: "fiberglass", name: "Vara de Fibra", icon: "🎣", price: 200, power: 1.3, tension: 1.2, luck: 0.05, unlockLevel: 3, description: "+30% força, +20% tensão" },
  { id: "carbon", name: "Vara de Carbono", icon: "⚡", price: 800, power: 1.6, tension: 1.5, luck: 0.1, unlockLevel: 7, description: "+60% força, +50% tensão" },
  { id: "titanium", name: "Vara de Titânio", icon: "🔱", price: 2500, power: 2, tension: 2, luck: 0.15, unlockLevel: 12, description: "+100% força e tensão" },
  { id: "mythril", name: "Vara de Mythril", icon: "✨", price: 8000, power: 2.5, tension: 2.5, luck: 0.25, unlockLevel: 16, description: "Forjada em lendas" },
  { id: "divine", name: "Tridente Divino", icon: "🔱", price: 25000, power: 3.5, tension: 3, luck: 0.35, unlockLevel: 20, description: "Poder dos deuses" },
];

export const BAITS = [
  { id: "worm", name: "Minhoca", icon: "🪱", price: 0, attraction: 1, rarityBonus: 0, description: "Bait básica" },
  { id: "cricket", name: "Grilo", icon: "🦗", price: 5, attraction: 1.3, rarityBonus: 0.05, description: "Atrai peixes maiores" },
  { id: "shrimp", name: "Camarão", icon: "🦐", price: 15, attraction: 1.5, rarityBonus: 0.1, unlockLevel: 4, description: "Irresistível" },
  { id: "lure_gold", name: "Isca Dourada", icon: "✨", price: 50, attraction: 2, rarityBonus: 0.2, unlockLevel: 8, description: "Brilha na água" },
  { id: "lure_magic", name: "Isca Mágica", icon: "🔮", price: 150, attraction: 2.5, rarityBonus: 0.35, unlockLevel: 14, description: "Encantada com magia" },
  { id: "lure_ancient", name: "Isca Ancestral", icon: "💎", price: 500, attraction: 3, rarityBonus: 0.5, unlockLevel: 19, description: "Relíquia antiga" },
];

export const LINES = [
  { id: "basic", name: "Linha Básica", icon: "〰️", price: 0, strength: 1, description: "Aguenta o básico" },
  { id: "nylon", name: "Linha de Nylon", icon: "➰", price: 100, strength: 1.3, unlockLevel: 2, description: "+30% resistência" },
  { id: "fluoro", name: "Fluorocarbono", icon: "💧", price: 400, strength: 1.6, unlockLevel: 6, description: "Invisível na água" },
  { id: "braided", name: "Linha Trançada", icon: "🧵", price: 1200, strength: 2, unlockLevel: 10, description: "Ultra resistente" },
  { id: "steel", name: "Linha de Aço", icon: "⛓️", price: 4000, strength: 2.5, unlockLevel: 15, description: "Indestrutível" },
];

export const ACHIEVEMENTS = [
  { id: "first_catch", name: "Primeiro Peixe!", icon: "🎉", description: "Pegue seu primeiro peixe", check: (s) => s.totalCaught >= 1 },
  { id: "catch_10", name: "Pescador Amador", icon: "🎣", description: "Pegue 10 peixes", check: (s) => s.totalCaught >= 10 },
  { id: "catch_50", name: "Pescador Experiente", icon: "🏅", description: "Pegue 50 peixes", check: (s) => s.totalCaught >= 50 },
  { id: "catch_200", name: "Mestre Pescador", icon: "👑", description: "Pegue 200 peixes", check: (s) => s.totalCaught >= 200 },
  { id: "first_rare", name: "Encontro Raro", icon: "💎", description: "Pegue um peixe raro", check: (s) => s.rareCaught >= 1 },
  { id: "first_epic", name: "Épico!", icon: "🌟", description: "Pegue um peixe épico", check: (s) => s.epicCaught >= 1 },
  { id: "first_legendary", name: "Lendário!", icon: "⭐", description: "Pegue um peixe lendário", check: (s) => s.legendaryCaught >= 1 },
  { id: "first_mythic", name: "Impossível!", icon: "🌀", description: "Pegue um peixe mítico", check: (s) => s.mythicCaught >= 1 },
  { id: "gold_1000", name: "Mil Moedas", icon: "💰", description: "Acumule 1000 moedas", check: (s) => s.totalGoldEarned >= 1000 },
  { id: "gold_10000", name: "Rico!", icon: "💎", description: "Acumule 10000 moedas", check: (s) => s.totalGoldEarned >= 10000 },
  { id: "level_10", name: "Nível 10", icon: "🔟", description: "Alcance nível 10", check: (s) => s.level >= 10 },
  { id: "level_20", name: "Nível 20", icon: "🏆", description: "Alcance nível 20", check: (s) => s.level >= 20 },
  { id: "collection_50", name: "Colecionador", icon: "📚", description: "Descubra 50% das espécies", check: (s) => s.uniqueSpecies >= Math.floor(FISH_DATABASE.length * 0.5) },
  { id: "collection_100", name: "Enciclopédia Viva", icon: "📖", description: "Descubra todas as espécies", check: (s) => s.uniqueSpecies >= FISH_DATABASE.length },
  { id: "big_fish", name: "Peixão!", icon: "🐋", description: "Pegue um peixe de 100kg+", check: (s) => s.biggestFish >= 100 },
];

export const xpForLevel = (level) => Math.floor(100 * Math.pow(1.4, level - 1));

export const SAVE_KEY = "pesca-rpg-save";

export const TUTORIAL_STEPS = {
  1: "Pressione o botão para lançar a linha!",
  2: "Segure e solte para definir a força!",
  3: "Aguarde o peixe morder...",
  4: "AGORA! Pressione para fisgar!",
  5: "Mantenha o peixe na zona verde! Cuidado com a tensão!",
};
