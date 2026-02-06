import { LOCATIONS, FISH_DATABASE, RARITY_COLORS, RARITY_NAMES, VARIANTS } from "../data/gameData";

export default function CollectionScreen({ game }) {
  const { caughtFish, setScreen } = game;

  return (
    <div style={{
      width: "100%", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
      background: "#0D1117", color: "#e0e0e0", padding: "20px",
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "28px" }}>📖 Coleção ({Object.keys(caughtFish).length}/{FISH_DATABASE.length})</h2>
          <button onClick={() => setScreen("game")} style={{
            padding: "8px 20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#e0e0e0", borderRadius: "6px", cursor: "pointer", fontSize: "14px",
          }}>← Voltar</button>
        </div>

        {LOCATIONS.map(loc => (
          <div key={loc.id} style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", color: "#8BB4D6", marginBottom: "10px" }}>
              {loc.icon} {loc.name}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px" }}>
              {FISH_DATABASE.filter(f => f.location === loc.id).map(fish => {
                const caught = caughtFish[fish.id];
                return (
                  <div key={fish.id} style={{
                    padding: "12px", borderRadius: "8px",
                    background: caught ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${caught ? RARITY_COLORS[fish.rarity] + "44" : "rgba(255,255,255,0.05)"}`,
                  }}>
                    {caught ? (
                      <>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: RARITY_COLORS[fish.rarity] }}>
                          {fish.emoji} {fish.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "#8899AA", marginTop: "4px" }}>
                          {RARITY_NAMES[fish.rarity]} • x{caught.count}
                        </div>
                        <div style={{ fontSize: "11px", color: "#6B7B8D", marginTop: "2px" }}>
                          {caught.smallest}kg ~ {caught.biggest}kg
                        </div>
                        {/* Variant display */}
                        {caught.variants && (caught.variants.golden > 0 || caught.variants.giant > 0) && (
                          <div style={{ fontSize: "11px", marginTop: "4px", display: "flex", gap: "8px" }}>
                            {caught.variants.golden > 0 && (
                              <span style={{ color: "#FFD700" }}>✦ x{caught.variants.golden}</span>
                            )}
                            {caught.variants.giant > 0 && (
                              <span style={{ color: "#CE93D8" }}>🔺 x{caught.variants.giant}</span>
                            )}
                          </div>
                        )}
                        <div style={{ fontSize: "11px", color: "#5A6A7A", marginTop: "2px", fontStyle: "italic" }}>
                          {fish.description}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: "14px", color: "#333" }}>
                        ❓ ???
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
