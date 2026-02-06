import { useState } from "react";
import { RARITY_COLORS, RARITY_NAMES, INVENTORY_CAP } from "../data/gameData";

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4, mythic: 5 };

export default function InventoryScreen({ game }) {
  const {
    gold, fishInventory, fishBaitBonus, setScreen,
    sellInventoryFish, bulkSellInventory, toggleTrophy, useInventoryFishAsBait,
  } = game;

  const [sortBy, setSortBy] = useState("recent");
  const [filterRarity, setFilterRarity] = useState("all");

  let filtered = filterRarity === "all"
    ? [...fishInventory]
    : fishInventory.filter(f => f.rarity === filterRarity);

  // Keep original indices for actions
  const indexed = filtered.map(fish => ({
    fish,
    originalIndex: fishInventory.indexOf(fish),
  }));

  if (sortBy === "weight") indexed.sort((a, b) => b.fish.weight - a.fish.weight);
  else if (sortBy === "price") indexed.sort((a, b) => b.fish.sellPrice - a.fish.sellPrice);
  else if (sortBy === "rarity") indexed.sort((a, b) => (RARITY_ORDER[b.fish.rarity] || 0) - (RARITY_ORDER[a.fish.rarity] || 0));
  // "recent" = default order (newest last in array, we reverse for newest first)
  else indexed.reverse();

  const nonTrophyValue = fishInventory.filter(f => !f.isTrophy).reduce((sum, f) => sum + f.sellPrice, 0);

  const sortOptions = [
    { id: "recent", label: "Recente" },
    { id: "weight", label: "Peso" },
    { id: "price", label: "Preço" },
    { id: "rarity", label: "Raridade" },
  ];

  const rarityFilters = [
    { id: "all", label: "Todos" },
    { id: "common", label: "Comum" },
    { id: "uncommon", label: "Incomum" },
    { id: "rare", label: "Raro" },
    { id: "epic", label: "Épico" },
    { id: "legendary", label: "Lendário" },
    { id: "mythic", label: "Mítico" },
  ];

  return (
    <div style={{
      width: "100%", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
      background: "#0D1117", color: "#e0e0e0", padding: "20px",
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "28px" }}>🎒 Inventário ({fishInventory.length}/{INVENTORY_CAP})</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "18px", color: "#FFD700" }}>💰 {gold}</span>
            <button onClick={() => setScreen("game")} style={{
              padding: "8px 20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#e0e0e0", borderRadius: "6px", cursor: "pointer", fontSize: "14px",
            }}>← Voltar</button>
          </div>
        </div>

        {/* Fish-bait bonus banner */}
        {fishBaitBonus > 0 && (
          <div style={{
            padding: "10px 16px", borderRadius: "8px", marginBottom: "16px",
            background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.4)",
            color: "#81C784", fontSize: "14px",
          }}>
            🎣 Isca natural ativa: +{Math.round(fishBaitBonus * 100)}% raridade na próxima pesca
          </div>
        )}

        {/* Sort buttons */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6B8FA8", alignSelf: "center", marginRight: "4px" }}>Ordenar:</span>
          {sortOptions.map(opt => (
            <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{
              padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "12px",
              background: sortBy === opt.id ? "rgba(66,165,245,0.3)" : "rgba(255,255,255,0.05)",
              border: sortBy === opt.id ? "1px solid #42a5f5" : "1px solid rgba(255,255,255,0.1)",
              color: sortBy === opt.id ? "#64b5f6" : "#8899AA",
            }}>{opt.label}</button>
          ))}
        </div>

        {/* Rarity filter */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", color: "#6B8FA8", alignSelf: "center", marginRight: "4px" }}>Filtro:</span>
          {rarityFilters.map(opt => (
            <button key={opt.id} onClick={() => setFilterRarity(opt.id)} style={{
              padding: "6px 12px", borderRadius: "20px", cursor: "pointer", fontSize: "12px",
              background: filterRarity === opt.id ? "rgba(66,165,245,0.3)" : "rgba(255,255,255,0.05)",
              border: filterRarity === opt.id ? "1px solid #42a5f5" : "1px solid rgba(255,255,255,0.1)",
              color: filterRarity === opt.id ? "#64b5f6" : (opt.id !== "all" ? RARITY_COLORS[opt.id] : "#8899AA"),
            }}>{opt.label}</button>
          ))}
        </div>

        {/* Bulk sell bar */}
        {fishInventory.length > 0 && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 16px", borderRadius: "8px", marginBottom: "16px",
            background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)",
          }}>
            <span style={{ fontSize: "14px", color: "#FFD700" }}>
              Valor total: {nonTrophyValue} moedas
            </span>
            <button
              onClick={bulkSellInventory}
              disabled={nonTrophyValue === 0}
              style={{
                padding: "8px 20px", borderRadius: "6px", cursor: nonTrophyValue > 0 ? "pointer" : "not-allowed",
                background: nonTrophyValue > 0 ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.03)",
                border: nonTrophyValue > 0 ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.1)",
                color: nonTrophyValue > 0 ? "#FFD700" : "#555", fontSize: "13px", fontWeight: 600,
              }}
            >
              Vender Tudo
            </button>
          </div>
        )}

        {/* Fish grid */}
        {indexed.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "#5A7A8A", fontSize: "16px",
          }}>
            {fishInventory.length === 0
              ? "Nenhum peixe no inventário. Pesque e guarde!"
              : "Nenhum peixe com esse filtro."
            }
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "10px",
          }}>
            {indexed.map(({ fish, originalIndex }) => {
              const variant = fish.variant;
              const isGolden = variant && variant.id === "golden";
              const isGiant = variant && variant.id === "giant";
              const isVariant = isGolden || isGiant;
              const rarityColor = RARITY_COLORS[fish.rarity];
              return (
                <div key={fish.id} style={{
                  padding: "12px", borderRadius: "10px",
                  background: fish.isTrophy ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${fish.isTrophy ? "#FFD70066" : rarityColor + "44"}`,
                  display: "flex", flexDirection: "column", gap: "6px",
                }}>
                  {/* Top row: emoji + badges */}
                  <div style={{ textAlign: "center", position: "relative" }}>
                    {fish.isTrophy && (
                      <span style={{ position: "absolute", top: "-4px", right: "-4px", fontSize: "16px" }}>🏆</span>
                    )}
                    {isVariant && (
                      <div style={{
                        fontSize: "10px", padding: "1px 6px", borderRadius: "8px",
                        display: "inline-block", marginBottom: "4px",
                        background: isGolden ? "rgba(255,215,0,0.2)" : "rgba(156,39,176,0.2)",
                        border: `1px solid ${isGolden ? "#FFD700" : "#9C27B0"}`,
                        color: isGolden ? "#FFD700" : "#CE93D8",
                      }}>
                        {variant.icon} {variant.namePt}
                      </div>
                    )}
                    <div style={{
                      fontSize: isGiant ? "36px" : "28px",
                      filter: isGolden ? "sepia(1) saturate(3) brightness(1.2)" : "none",
                    }}>
                      {fish.emoji}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ fontSize: "13px", fontWeight: 600, color: rarityColor, textAlign: "center" }}>
                    {fish.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#8899AA", textAlign: "center" }}>
                    ⚖️ {fish.weight}kg • 💰 {fish.sellPrice}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                    <button
                      onClick={() => toggleTrophy(originalIndex)}
                      style={{
                        flex: 1, padding: "5px", borderRadius: "4px", cursor: "pointer", fontSize: "12px",
                        background: fish.isTrophy ? "rgba(255,215,0,0.2)" : "rgba(255,255,255,0.05)",
                        border: fish.isTrophy ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.1)",
                        color: fish.isTrophy ? "#FFD700" : "#8899AA",
                      }}
                      title={fish.isTrophy ? "Remover troféu" : "Marcar como troféu"}
                    >
                      🏆
                    </button>
                    {!fish.isTrophy && (
                      <>
                        <button
                          onClick={() => sellInventoryFish(originalIndex)}
                          style={{
                            flex: 1, padding: "5px", borderRadius: "4px", cursor: "pointer", fontSize: "12px",
                            background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)",
                            color: "#FFD700",
                          }}
                        >
                          💰
                        </button>
                        <button
                          onClick={() => useInventoryFishAsBait(originalIndex)}
                          style={{
                            flex: 1, padding: "5px", borderRadius: "4px", cursor: "pointer", fontSize: "12px",
                            background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.3)",
                            color: "#81C784",
                          }}
                        >
                          🎣
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
