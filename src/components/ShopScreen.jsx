import { RODS, BAITS, LINES } from "../data/gameData";

export default function ShopScreen({ game }) {
  const {
    gold, level, shopTab, setShopTab,
    ownedRods, ownedBaits, ownedLines,
    equippedRod, equippedBait, equippedLine,
    buyItem, equipBait, setScreen,
    baitQuantities,
  } = game;

  const tabs = [
    { id: "rods", name: "Varas", items: RODS, owned: ownedRods, equipped: equippedRod },
    { id: "baits", name: "Iscas", items: BAITS, owned: ownedBaits, equipped: equippedBait },
    { id: "lines", name: "Linhas", items: LINES, owned: ownedLines, equipped: equippedLine },
  ];
  const activeTab = tabs.find(t => t.id === shopTab);

  // Sort items by unlockLevel for display, filter out boss drops
  const sortedItems = activeTab.items
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => !item.bossOnly)
    .sort((a, b) => (a.item.unlockLevel ?? 0) - (b.item.unlockLevel ?? 0));

  return (
    <div style={{
      width: "100%", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
      background: "#0D1117", color: "#e0e0e0", padding: "20px",
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "28px" }}>🏪 Loja</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span style={{ fontSize: "18px", color: "#FFD700" }}>💰 {gold}</span>
            <button onClick={() => setScreen("game")} style={{
              padding: "8px 20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
              color: "#e0e0e0", borderRadius: "6px", cursor: "pointer", fontSize: "14px",
            }}>← Voltar</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setShopTab(tab.id)} style={{
              padding: "10px 24px", borderRadius: "6px", cursor: "pointer", fontSize: "15px", fontWeight: 600,
              background: shopTab === tab.id ? "rgba(66,165,245,0.3)" : "rgba(255,255,255,0.05)",
              border: shopTab === tab.id ? "1px solid #42a5f5" : "1px solid rgba(255,255,255,0.1)",
              color: shopTab === tab.id ? "#64b5f6" : "#8899AA",
            }}>{tab.name}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {sortedItems.map(({ item, idx }) => {
            const isOwned = activeTab.owned.includes(idx);
            const isEquipped = activeTab.equipped === idx;
            const locked = item.unlockLevel && level < item.unlockLevel;
            const isConsumable = shopTab === "baits" && item.consumable;
            const stock = isConsumable ? (baitQuantities[item.id] || 0) : 0;
            const canBuy = !locked && gold >= item.price && (isConsumable || !isOwned);

            return (
              <div key={item.id} style={{
                padding: "16px", borderRadius: "10px",
                background: isEquipped ? "rgba(66,165,245,0.15)" : "rgba(255,255,255,0.03)",
                border: isEquipped ? "1px solid #42a5f5" : "1px solid rgba(255,255,255,0.08)",
                opacity: locked ? 0.4 : 1,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "18px", fontWeight: 600 }}>
                    {item.icon} {item.name}
                    {isEquipped && <span style={{ fontSize: "12px", color: "#42a5f5", marginLeft: "8px" }}>EQUIPADO</span>}
                  </div>
                  <div style={{ fontSize: "13px", color: "#8899AA", marginTop: "4px" }}>{item.description}</div>
                  {locked && <div style={{ fontSize: "12px", color: "#FF6B6B", marginTop: "4px" }}>🔒 Nível {item.unlockLevel}</div>}
                  {isConsumable && isOwned && (
                    <div style={{ fontSize: "12px", color: "#81C784", marginTop: "4px" }}>
                      Estoque: {stock}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  {isConsumable ? (
                    <>
                      {/* Equip button for consumable if owned, has stock, and not equipped */}
                      {isOwned && !isEquipped && stock > 0 && (
                        <button onClick={() => equipBait(idx)} style={{
                          padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
                          background: "rgba(76,175,80,0.2)", border: "1px solid #4CAF50", color: "#4CAF50", fontSize: "13px",
                        }}>Equipar</button>
                      )}
                      {/* Buy/Rebuy button */}
                      <button onClick={() => canBuy && buyItem(shopTab, idx)} style={{
                        padding: "8px 16px", borderRadius: "6px",
                        cursor: canBuy ? "pointer" : "not-allowed",
                        background: canBuy ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.03)",
                        border: canBuy ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.1)",
                        color: canBuy ? "#FFD700" : "#555", fontSize: "13px",
                      }}>
                        💰 {item.price} (+{item.stackSize})
                      </button>
                    </>
                  ) : (
                    isOwned ? (
                      !isEquipped && (
                        <button onClick={() => buyItem(shopTab, idx)} style={{
                          padding: "8px 16px", borderRadius: "6px", cursor: "pointer",
                          background: "rgba(76,175,80,0.2)", border: "1px solid #4CAF50", color: "#4CAF50", fontSize: "13px",
                        }}>Equipar</button>
                      )
                    ) : (
                      <button onClick={() => canBuy && buyItem(shopTab, idx)} style={{
                        padding: "8px 16px", borderRadius: "6px",
                        cursor: canBuy ? "pointer" : "not-allowed",
                        background: canBuy ? "rgba(255,215,0,0.15)" : "rgba(255,255,255,0.03)",
                        border: canBuy ? "1px solid #FFD700" : "1px solid rgba(255,255,255,0.1)",
                        color: canBuy ? "#FFD700" : "#555", fontSize: "13px",
                      }}>💰 {item.price}</button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
