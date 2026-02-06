/**
 * UI da mecanica "Ritmo" — aneis concentricos se aproximam do alvo.
 * Visual inspirado em jogos de ritmo (Osu!, rhythm heaven).
 */
export default function RhythmMechanicUI({ mechanic, currentFish, currentBoss, bossHp, reelProgress, keysRef }) {
  const { tension, rings, hitFeedback, rhythmCombo, perfectZone, goodZone } = mechanic;

  const size = 220; // ring area size
  const center = size / 2;
  // Target circle radius (the "hit zone" in pixels)
  const targetRadius = 28;
  // Ring radii at scale=1 (spawn) and scale=0 (center)
  const maxRingRadius = center - 4;

  const feedbackColors = {
    perfect: "#FFD700",
    good: "#4CAF50",
    miss: "#F44336",
  };
  const feedbackLabels = {
    perfect: "PERFEITO!",
    good: "BOM!",
    miss: "ERROU!",
  };

  return (
    <>
      {/* Ring area */}
      <div style={{
        width: `${size}px`, height: `${size}px`,
        position: "relative", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,20,40,0.9) 0%, rgba(0,10,25,0.95) 100%)",
        border: "2px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}>
        {/* Outer good zone ring (static guide) */}
        <div style={{
          position: "absolute",
          left: center - goodZone * maxRingRadius,
          top: center - goodZone * maxRingRadius,
          width: goodZone * maxRingRadius * 2,
          height: goodZone * maxRingRadius * 2,
          borderRadius: "50%",
          border: "2px dashed rgba(76,175,80,0.2)",
          pointerEvents: "none",
        }} />

        {/* Inner perfect zone ring (static guide) */}
        <div style={{
          position: "absolute",
          left: center - perfectZone * maxRingRadius,
          top: center - perfectZone * maxRingRadius,
          width: perfectZone * maxRingRadius * 2,
          height: perfectZone * maxRingRadius * 2,
          borderRadius: "50%",
          border: "2px dashed rgba(255,215,0,0.2)",
          pointerEvents: "none",
        }} />

        {/* Target circle (center) */}
        <div style={{
          position: "absolute",
          left: center - targetRadius,
          top: center - targetRadius,
          width: targetRadius * 2,
          height: targetRadius * 2,
          borderRadius: "50%",
          background: hitFeedback
            ? `radial-gradient(circle, ${feedbackColors[hitFeedback.type]}33 0%, transparent 70%)`
            : "radial-gradient(circle, rgba(66,165,245,0.15) 0%, transparent 70%)",
          border: `3px solid ${hitFeedback ? feedbackColors[hitFeedback.type] : "rgba(66,165,245,0.5)"}`,
          transition: "border-color 0.15s, background 0.15s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            fontSize: "28px",
            filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
            transform: `scale(${hitFeedback?.type === "perfect" ? 1.3 : hitFeedback?.type === "good" ? 1.15 : 1})`,
            transition: "transform 0.15s",
          }}>
            {currentFish.emoji}
          </span>
        </div>

        {/* Animated rings */}
        {rings.map(ring => {
          const radius = Math.max(0, ring.scale) * maxRingRadius;
          if (radius < 2) return null;

          // Color based on proximity to zones
          let color = "rgba(66,165,245,0.6)"; // blue (far)
          if (ring.scale <= goodZone) color = "rgba(76,175,80,0.8)"; // green (good zone)
          if (ring.scale <= perfectZone) color = "rgba(255,215,0,0.9)"; // gold (perfect zone)

          const thickness = Math.max(2, 3 - ring.scale * 1.5);

          return (
            <div key={ring.id} style={{
              position: "absolute",
              left: center - radius,
              top: center - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              border: `${thickness}px solid ${color}`,
              pointerEvents: "none",
              boxShadow: ring.scale <= goodZone ? `0 0 ${12 - ring.scale * 20}px ${color}` : "none",
            }} />
          );
        })}

        {/* Hit feedback text */}
        {hitFeedback && (
          <div key={hitFeedback.id} style={{
            position: "absolute",
            left: "50%", top: "15%",
            transform: "translateX(-50%)",
            color: feedbackColors[hitFeedback.type],
            fontWeight: 900, fontSize: "18px",
            textShadow: `0 0 10px ${feedbackColors[hitFeedback.type]}`,
            letterSpacing: "2px",
            animation: "feedbackPop 0.5s ease-out forwards",
            pointerEvents: "none",
          }}>
            {feedbackLabels[hitFeedback.type]}
          </div>
        )}

        {/* Combo display */}
        {rhythmCombo >= 3 && (
          <div style={{
            position: "absolute",
            right: "8px", bottom: "8px",
            padding: "3px 10px", borderRadius: "12px",
            background: "rgba(255,140,0,0.25)", border: "1px solid rgba(255,140,0,0.6)",
            color: "#FFD700", fontWeight: 800, fontSize: "13px",
            animation: "pulse 1s ease-in-out infinite",
          }}>
            {rhythmCombo}x
          </div>
        )}
      </div>

      {/* Instruction */}
      <div style={{ fontSize: "11px", color: "#6B8FA8", marginTop: "-4px" }}>
        Aperte ESPACO quando o anel chegar ao centro!
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
          <span>Tensao</span>
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
        onTouchStart={(e) => { e.preventDefault(); keysRef.current.space = true; }}
        onTouchEnd={(e) => { e.preventDefault(); keysRef.current.space = false; }}
        style={{
          padding: "14px 48px", fontSize: "16px", fontWeight: 700, borderRadius: "12px",
          background: hitFeedback?.type === "perfect" ? "rgba(255,215,0,0.25)" :
            hitFeedback?.type === "good" ? "rgba(76,175,80,0.25)" :
            "rgba(66,165,245,0.25)",
          border: `2px solid ${hitFeedback?.type === "perfect" ? "#FFD700" :
            hitFeedback?.type === "good" ? "#4CAF50" : "#42a5f5"}`,
          color: hitFeedback?.type === "perfect" ? "#FFD700" :
            hitFeedback?.type === "good" ? "#66BB6A" : "#64b5f6",
          cursor: "pointer", marginTop: "4px",
          transition: "all 0.15s",
        }}
      >
        TOQUE NO RITMO!
      </button>

      {/* CSS animation for feedback popup */}
      <style>{`
        @keyframes feedbackPop {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(0.8); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-8px) scale(1.1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
        }
      `}</style>
    </>
  );
}
