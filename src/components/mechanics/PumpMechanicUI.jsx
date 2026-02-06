export default function PumpMechanicUI({ mechanic, currentFish, currentBoss, bossHp, reelProgress, keysRef }) {
  const { tension, needle, zoneCenter, zoneWidth, hitFeedback, pumpCombo } = mechanic;

  const barW = 320;
  const barH = 22;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const zoneLeftPx = (clamp(zoneCenter - zoneWidth / 2, 0, 100) / 100) * barW;
  const zoneWidthPx = (clamp(zoneWidth, 0, 100) / 100) * barW;
  const needlePx = (clamp(needle, 0, 100) / 100) * barW;

  const feedback = hitFeedback?.type;
  const feedbackColors = {
    perfect: "#FFD700",
    good: "#4CAF50",
    miss: "#F44336",
    overpump: "#FF9800",
  };
  const feedbackLabels = {
    perfect: "PERFEITO!",
    good: "BOM!",
    miss: "ERROU!",
    overpump: "ANSIOSO!",
  };

  return (
    <>
      {/* Pump bar */}
      <div style={{ width: `${barW}px` }}>
        <div style={{
          width: `${barW}px`, height: `${barH}px`,
          background: "rgba(0,0,0,0.55)",
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.15)",
        }}>
          {/* Zone */}
          <div style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${zoneLeftPx}px`,
            width: `${zoneWidthPx}px`,
            background: "rgba(76,175,80,0.25)",
            border: "1px solid rgba(76,175,80,0.6)",
            borderRadius: "10px",
            transition: "left 0.05s linear, width 0.05s linear",
          }} />

          {/* Needle */}
          <div style={{
            position: "absolute",
            top: "-6px",
            left: `${needlePx}px`,
            transform: "translateX(-50%)",
            width: "0px",
            height: "0px",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: `14px solid ${feedback ? feedbackColors[feedback] : "#42a5f5"}`,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.35))",
            transition: "border-bottom-color 0.15s",
          }} />

          {/* Fish */}
          <div style={{
            position: "absolute",
            left: `${needlePx}px`,
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "20px",
            pointerEvents: "none",
            transition: "left 0.05s linear",
          }}>
            {currentFish.emoji}
          </div>
        </div>

        {/* Feedback row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "8px",
          fontSize: "11px",
          color: "#6B8FA8",
          minHeight: "14px",
        }}>
          <span>
            {feedback ? (
              <span style={{ color: feedbackColors[feedback], fontWeight: 800, letterSpacing: "1px" }}>
                {feedbackLabels[feedback]}
              </span>
            ) : (
              "Toque no timing certo"
            )}
          </span>
          {pumpCombo >= 3 ? (
            <span style={{
              padding: "2px 10px",
              borderRadius: "12px",
              background: "rgba(255,140,0,0.25)",
              border: "1px solid rgba(255,140,0,0.6)",
              color: "#FFD700",
              fontWeight: 800,
            }}>
              {pumpCombo}x
            </span>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* Instruction */}
      <div style={{ fontSize: "11px", color: "#6B8FA8", marginTop: "-4px" }}>
        Aperte ESPACO no momento certo (evite apertar rápido demais).
      </div>

      {/* Progress / Boss HP bar */}
      <div style={{ width: "300px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B8FA8", marginBottom: "4px" }}>
          <span>{currentBoss ? `❤️ HP: ${Math.round(bossHp)}/${currentBoss.hp}` : "Progresso"}</span>
          <span>{Math.round(reelProgress)}%</span>
        </div>
        <div style={{
          width: "100%", height: "10px", background: "rgba(0,0,0,0.5)",
          borderRadius: "5px", overflow: "hidden",
        }}>
          {currentBoss ? (
            <div style={{
              width: `${(bossHp / currentBoss.hp) * 100}%`, height: "100%",
              background: bossHp / currentBoss.hp > 0.5 ? "linear-gradient(90deg, #F44336, #FF5722)" : "linear-gradient(90deg, #FF1744, #D50000)",
              borderRadius: "5px", transition: "width 0.1s",
            }} />
          ) : (
            <div style={{
              width: `${reelProgress}%`, height: "100%",
              background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
              borderRadius: "5px", transition: "width 0.1s",
            }} />
          )}
        </div>
      </div>

      {/* Tension bar */}
      <div style={{ width: "300px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B8FA8", marginBottom: "4px" }}>
          <span>Tensão</span>
          <span style={{ color: tension > 70 ? "#F44336" : tension > 40 ? "#FF9800" : "#6B8FA8" }}>
            {Math.round(tension)}%
          </span>
        </div>
        <div style={{
          width: "100%", height: "10px", background: "rgba(0,0,0,0.5)",
          borderRadius: "5px", overflow: "hidden",
        }}>
          <div style={{
            width: `${tension}%`, height: "100%",
            background: tension > 70 ? "linear-gradient(90deg, #FF9800, #F44336)" :
              tension > 40 ? "linear-gradient(90deg, #FFC107, #FF9800)" : "#42a5f5",
            borderRadius: "5px", transition: "width 0.1s",
          }} />
        </div>
      </div>

      {/* Tap button for mobile */}
      <button
        onMouseDown={() => keysRef.current.space = true}
        onMouseUp={() => keysRef.current.space = false}
        onMouseLeave={() => keysRef.current.space = false}
        onTouchStart={(e) => { e.preventDefault(); keysRef.current.space = true; }}
        onTouchEnd={(e) => { e.preventDefault(); keysRef.current.space = false; }}
        style={{
          padding: "14px 48px", fontSize: "16px", fontWeight: 700, borderRadius: "12px",
          background: "rgba(66,165,245,0.25)",
          border: "2px solid #42a5f5",
          color: "#64b5f6",
          cursor: "pointer", marginTop: "4px",
        }}
      >
        BOMBEAR!
      </button>
    </>
  );
}
