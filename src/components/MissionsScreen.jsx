import { MISSION_REWARDS } from "../data/gameData";

const DIFFICULTY_COLORS = { easy: "#4CAF50", medium: "#FF9800", hard: "#F44336" };
const DIFFICULTY_NAMES = { easy: "Fácil", medium: "Médio", hard: "Difícil" };

export default function MissionsScreen({ game }) {
  const { dailyMissions, missionProgress, missionsCompleted, missionStreak, setScreen } = game;

  return (
    <div style={{
      width: "100%", minHeight: "100vh", fontFamily: "'Segoe UI', sans-serif",
      background: "#0D1117", color: "#e0e0e0", padding: "20px",
    }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "28px" }}>📋 Missões Diárias</h2>
            {missionStreak > 0 && (
              <span style={{
                padding: "4px 12px", borderRadius: "12px", fontSize: "13px", fontWeight: 700,
                background: "rgba(255,140,0,0.2)", border: "1px solid rgba(255,140,0,0.4)",
                color: "#FF9800",
              }}>
                🔥 {missionStreak} dias seguidos
              </span>
            )}
          </div>
          <button onClick={() => setScreen("game")} style={{
            padding: "8px 20px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
            color: "#e0e0e0", borderRadius: "6px", cursor: "pointer", fontSize: "14px",
          }}>← Voltar</button>
        </div>

        {/* Mission cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {dailyMissions.map((mission) => {
            const progress = missionProgress[mission.id] || 0;
            const isComplete = mission.completed || progress >= mission.target;
            const progressPercent = Math.min(100, (progress / mission.target) * 100);
            const diffColor = DIFFICULTY_COLORS[mission.difficulty];
            const reward = MISSION_REWARDS[mission.difficulty];

            return (
              <div key={mission.id} style={{
                padding: "18px", borderRadius: "12px",
                background: isComplete ? "rgba(76,175,80,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isComplete ? "rgba(76,175,80,0.3)" : "rgba(255,255,255,0.08)"}`,
                position: "relative", overflow: "hidden",
              }}>
                {/* Complete overlay */}
                {isComplete && (
                  <div style={{
                    position: "absolute", top: "8px", right: "12px",
                    fontSize: "24px", opacity: 0.8,
                  }}>
                    ✅
                  </div>
                )}

                {/* Difficulty badge */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: 700,
                    background: `${diffColor}22`, border: `1px solid ${diffColor}66`,
                    color: diffColor, textTransform: "uppercase",
                  }}>
                    {DIFFICULTY_NAMES[mission.difficulty]}
                  </span>
                </div>

                {/* Mission text */}
                <div style={{
                  fontSize: "16px", fontWeight: 600,
                  color: isComplete ? "#81C784" : "#e0e0e0",
                  textDecoration: isComplete ? "line-through" : "none",
                  opacity: isComplete ? 0.7 : 1,
                }}>
                  {mission.textPt}
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: "10px" }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "12px", color: "#6B8FA8", marginBottom: "4px",
                  }}>
                    <span>Progresso</span>
                    <span>{Math.min(progress, mission.target)}/{mission.target}</span>
                  </div>
                  <div style={{
                    width: "100%", height: "8px", background: "rgba(255,255,255,0.05)",
                    borderRadius: "4px", overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${progressPercent}%`, height: "100%",
                      background: isComplete
                        ? "linear-gradient(90deg, #4CAF50, #81C784)"
                        : `linear-gradient(90deg, ${diffColor}88, ${diffColor})`,
                      borderRadius: "4px", transition: "width 0.3s",
                    }} />
                  </div>
                </div>

                {/* Reward */}
                <div style={{
                  marginTop: "10px", fontSize: "13px", color: "#8899AA",
                  display: "flex", gap: "12px",
                }}>
                  <span>🏆 {reward.gold} moedas</span>
                  {reward.baitStacks > 0 && (
                    <span>🎣 {reward.baitStacks} stack{reward.baitStacks > 1 ? "s" : ""} de isca</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {dailyMissions.length === 0 && (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "#5A7A8A", fontSize: "16px",
          }}>
            Carregando missões...
          </div>
        )}

        {/* Stats */}
        <div style={{
          marginTop: "24px", padding: "16px", borderRadius: "10px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          display: "flex", justifyContent: "space-around", textAlign: "center",
        }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#64b5f6" }}>{missionsCompleted}</div>
            <div style={{ fontSize: "12px", color: "#6B8FA8" }}>Total Completas</div>
          </div>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#FF9800" }}>{missionStreak}</div>
            <div style={{ fontSize: "12px", color: "#6B8FA8" }}>Dias Seguidos</div>
          </div>
        </div>

        <div style={{
          marginTop: "16px", textAlign: "center",
          fontSize: "13px", color: "#5A7A8A", fontStyle: "italic",
        }}>
          Missões renovam diariamente!
        </div>
      </div>
    </div>
  );
}
