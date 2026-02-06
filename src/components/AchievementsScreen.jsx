import { ACHIEVEMENTS } from "../data/gameData";

export default function AchievementsScreen({ game }) {
  const { unlockedAchievements, setScreen } = game;

  return (
    <div style={{
      width: "100%", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
      background: "#0D1117", color: "#e0e0e0", padding: "20px",
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, fontSize: "28px" }}>🏆 Conquistas ({unlockedAchievements.length}/{ACHIEVEMENTS.length})</h2>
          <button onClick={() => setScreen("game")} style={{
            padding: "8px 20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#e0e0e0", borderRadius: "6px", cursor: "pointer", fontSize: "14px",
          }}>← Voltar</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ACHIEVEMENTS.map(ach => {
            const unlocked = unlockedAchievements.includes(ach.id);
            return (
              <div key={ach.id} style={{
                padding: "14px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "14px",
                background: unlocked ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.02)",
                border: unlocked ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.05)",
                opacity: unlocked ? 1 : 0.5,
              }}>
                <span style={{ fontSize: "28px" }}>{unlocked ? ach.icon : "🔒"}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{ach.name}</div>
                  <div style={{ fontSize: "12px", color: "#8899AA" }}>{ach.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
