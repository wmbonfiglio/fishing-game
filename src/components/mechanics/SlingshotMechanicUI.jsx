/**
 * UI da mecanica "Estilingue" — mira rotativa 2D + barra de forca.
 * O jogador trava a direcao e depois a forca para "atirar" no peixe.
 */
export default function SlingshotMechanicUI({ mechanic, currentFish, currentBoss, bossHp, reelProgress, keysRef }) {
  const {
    tension, aimAngle, powerLevel, shotPhase,
    fishTarget, shotPos, shotFeedback, slingshotCombo,
    shotTrail, perfectRadius, goodRadius,
  } = mechanic;

  const size = 240;
  const center = size / 2;
  const arenaRadius = center - 8;

  // Convert unit coords (-1..1) to pixel coords
  const toPixel = (ux, uy) => ({
    px: center + ux * arenaRadius,
    py: center + uy * arenaRadius,
  });

  const fishPx = toPixel(fishTarget.x, fishTarget.y);
  const shotPx = shotPos ? toPixel(shotPos.x, shotPos.y) : null;

  // Aim arrow endpoint
  const aimLen = shotPhase === "power" || shotPhase === "result" ? powerLevel * arenaRadius * 0.85 : arenaRadius * 0.7;
  const displayAngle = shotPhase === "power" || shotPhase === "result" ? mechanic.lockedAngle : aimAngle;
  const aimEndX = center + Math.cos(displayAngle) * aimLen;
  const aimEndY = center + Math.sin(displayAngle) * aimLen;

  // Perfect and good zone radii in pixels (around fish)
  const perfectPx = perfectRadius * arenaRadius;
  const goodPx = goodRadius * arenaRadius;

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

  const phaseLabel = shotPhase === "aiming" ? "Trave a DIRECAO!"
    : shotPhase === "power" ? "Trave a FORCA!"
    : "...";

  return (
    <>
      {/* Arena */}
      <div style={{
        width: `${size}px`, height: `${size}px`,
        position: "relative", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,20,40,0.9) 0%, rgba(0,10,25,0.95) 100%)",
        border: "2px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}>
        {/* Arena grid rings for depth */}
        {[0.33, 0.66, 1.0].map((r, i) => (
          <div key={i} style={{
            position: "absolute",
            left: center - arenaRadius * r,
            top: center - arenaRadius * r,
            width: arenaRadius * r * 2,
            height: arenaRadius * r * 2,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }} />
        ))}

        {/* Good zone around fish */}
        <div style={{
          position: "absolute",
          left: fishPx.px - goodPx,
          top: fishPx.py - goodPx,
          width: goodPx * 2,
          height: goodPx * 2,
          borderRadius: "50%",
          border: "2px dashed rgba(76,175,80,0.25)",
          background: "radial-gradient(circle, rgba(76,175,80,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          transition: "left 0.4s ease-out, top 0.4s ease-out",
        }} />

        {/* Perfect zone around fish */}
        <div style={{
          position: "absolute",
          left: fishPx.px - perfectPx,
          top: fishPx.py - perfectPx,
          width: perfectPx * 2,
          height: perfectPx * 2,
          borderRadius: "50%",
          border: "2px dashed rgba(255,215,0,0.3)",
          background: "radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          transition: "left 0.4s ease-out, top 0.4s ease-out",
        }} />

        {/* Fish */}
        <div style={{
          position: "absolute",
          left: fishPx.px,
          top: fishPx.py,
          transform: "translate(-50%, -50%)",
          fontSize: "28px",
          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.4))",
          transition: "left 0.4s ease-out, top 0.4s ease-out",
          zIndex: 3,
        }}>
          {currentFish.emoji}
        </div>

        {/* Center crosshair */}
        <div style={{
          position: "absolute",
          left: center - 6, top: center - 6,
          width: 12, height: 12,
          borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.2)",
          pointerEvents: "none",
        }} />

        {/* Aim arrow (SVG) */}
        <svg style={{
          position: "absolute", inset: 0,
          width: size, height: size,
          pointerEvents: "none", zIndex: 2,
        }}>
          {/* Arrow line */}
          <line
            x1={center} y1={center}
            x2={aimEndX} y2={aimEndY}
            stroke={shotPhase === "aiming" ? "rgba(66,165,245,0.7)"
              : shotPhase === "power" ? `rgba(255,${Math.round(165 + powerLevel * 90)},0,0.8)`
              : "rgba(255,255,255,0.3)"}
            strokeWidth={shotPhase === "power" ? 2 + powerLevel * 2 : 2}
            strokeDasharray={shotPhase === "aiming" ? "6,4" : "none"}
          />
          {/* Arrow tip */}
          {shotPhase !== "result" && (
            <circle
              cx={aimEndX} cy={aimEndY}
              r={shotPhase === "power" ? 4 + powerLevel * 3 : 4}
              fill={shotPhase === "aiming" ? "#42a5f5"
                : `rgb(255,${Math.round(165 + powerLevel * 90)},0)`}
              opacity={0.9}
            />
          )}

          {/* Shot trail */}
          {shotTrail && (
            <>
              <line
                x1={center + shotTrail.fromX * arenaRadius}
                y1={center + shotTrail.fromY * arenaRadius}
                x2={center + shotTrail.toX * arenaRadius}
                y2={center + shotTrail.toY * arenaRadius}
                stroke={shotFeedback ? feedbackColors[shotFeedback.type] : "#fff"}
                strokeWidth={2}
                opacity={0.5}
                strokeDasharray="4,3"
              />
            </>
          )}
        </svg>

        {/* Shot impact marker */}
        {shotPx && (
          <div style={{
            position: "absolute",
            left: shotPx.px,
            top: shotPx.py,
            transform: "translate(-50%, -50%)",
            width: "14px", height: "14px",
            borderRadius: "50%",
            background: shotFeedback ? feedbackColors[shotFeedback.type] : "#fff",
            boxShadow: `0 0 12px ${shotFeedback ? feedbackColors[shotFeedback.type] : "#fff"}`,
            opacity: 0.9,
            zIndex: 4,
            animation: "shotImpact 0.6s ease-out forwards",
          }} />
        )}

        {/* Hit feedback text */}
        {shotFeedback && (
          <div key={shotFeedback.id} style={{
            position: "absolute",
            left: "50%", top: "12%",
            transform: "translateX(-50%)",
            color: feedbackColors[shotFeedback.type],
            fontWeight: 900, fontSize: "18px",
            textShadow: `0 0 10px ${feedbackColors[shotFeedback.type]}`,
            letterSpacing: "2px",
            animation: "feedbackPop 0.5s ease-out forwards",
            pointerEvents: "none",
            zIndex: 5,
          }}>
            {feedbackLabels[shotFeedback.type]}
          </div>
        )}

        {/* Combo display */}
        {slingshotCombo >= 3 && (
          <div style={{
            position: "absolute",
            right: "8px", bottom: "8px",
            padding: "3px 10px", borderRadius: "12px",
            background: "rgba(255,140,0,0.25)", border: "1px solid rgba(255,140,0,0.6)",
            color: "#FFD700", fontWeight: 800, fontSize: "13px",
            animation: "pulse 1s ease-in-out infinite",
            zIndex: 5,
          }}>
            {slingshotCombo}x
          </div>
        )}
      </div>

      {/* Power bar (visible during power phase) */}
      <div style={{
        width: "300px", height: "16px",
        background: "rgba(0,0,0,0.5)",
        borderRadius: "8px", overflow: "hidden",
        border: `2px solid ${shotPhase === "power" ? "rgba(255,165,0,0.5)" : "rgba(255,255,255,0.1)"}`,
        transition: "border-color 0.2s",
        position: "relative",
      }}>
        {/* Optimal power zone indicator (60-80%) */}
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          left: "60%", width: "20%",
          background: "rgba(76,175,80,0.15)",
          borderLeft: "1px solid rgba(76,175,80,0.3)",
          borderRight: "1px solid rgba(76,175,80,0.3)",
          pointerEvents: "none",
        }} />
        <div style={{
          width: `${(shotPhase === "power" ? powerLevel : shotPhase === "result" ? mechanic.lockedPower : 0) * 100}%`,
          height: "100%",
          background: shotPhase === "power"
            ? `linear-gradient(90deg, #42a5f5, #FF9800, ${powerLevel > 0.9 ? "#F44336" : "#FFD700"})`
            : shotPhase === "result"
            ? (shotFeedback ? feedbackColors[shotFeedback.type] : "#42a5f5")
            : "#42a5f5",
          borderRadius: "6px",
          transition: shotPhase === "result" ? "width 0.1s" : "none",
        }} />
      </div>

      {/* Phase instruction */}
      <div style={{
        fontSize: "12px", color: "#8BB4D6", marginTop: "-2px",
        fontWeight: shotPhase === "power" ? 700 : 400,
      }}>
        {shotPhase === "aiming" && "Aperte ESPACO para travar a direcao!"}
        {shotPhase === "power" && "Aperte ESPACO para travar a forca!"}
        {shotPhase === "result" && (shotFeedback?.type === "perfect" ? "Tiro perfeito!" : shotFeedback?.type === "good" ? "Bom tiro!" : "Errou o alvo...")}
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
          background: shotPhase === "power" ? "rgba(255,165,0,0.25)"
            : shotFeedback?.type === "perfect" ? "rgba(255,215,0,0.25)"
            : shotFeedback?.type === "good" ? "rgba(76,175,80,0.25)"
            : "rgba(66,165,245,0.25)",
          border: `2px solid ${shotPhase === "power" ? "#FF9800"
            : shotFeedback?.type === "perfect" ? "#FFD700"
            : shotFeedback?.type === "good" ? "#4CAF50"
            : "#42a5f5"}`,
          color: shotPhase === "power" ? "#FF9800"
            : shotFeedback?.type === "perfect" ? "#FFD700"
            : shotFeedback?.type === "good" ? "#66BB6A"
            : "#64b5f6",
          cursor: "pointer", marginTop: "4px",
          transition: "all 0.15s",
        }}
      >
        {shotPhase === "aiming" ? "MIRAR!" : shotPhase === "power" ? "ATIRAR!" : "..."}
      </button>

      {/* CSS animations */}
      <style>{`
        @keyframes feedbackPop {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(0.8); }
          50% { opacity: 1; transform: translateX(-50%) translateY(-8px) scale(1.1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
        }
        @keyframes shotImpact {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.5); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `}</style>
    </>
  );
}
