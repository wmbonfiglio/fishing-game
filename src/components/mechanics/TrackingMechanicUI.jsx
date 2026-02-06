/**
 * UI da mecânica "Tracking" — barra com zona de captura que segue o peixe.
 */
export default function TrackingMechanicUI({ mechanic, currentFish, currentBoss, bossHp, reelProgress, keysRef }) {
  const { fishPosition, catchZonePos, catchZoneSize, tension } = mechanic;

  return (
    <>
      {/* Catch bar */}
      <div style={{
        width: "300px", height: "40px", background: "rgba(0,0,0,0.6)",
        borderRadius: "20px", position: "relative", overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.15)",
      }}>
        {/* Catch zone */}
        <div style={{
          position: "absolute", top: "2px", bottom: "2px",
          left: `${Math.max(0, catchZonePos - catchZoneSize / 2)}%`,
          width: `${catchZoneSize}%`,
          background: Math.abs(fishPosition - catchZonePos) < catchZoneSize / 2
            ? "rgba(76,175,80,0.4)" : "rgba(66,165,245,0.25)",
          borderRadius: "18px", transition: "background 0.15s, left 0.05s",
          border: Math.abs(fishPosition - catchZonePos) < catchZoneSize / 2
            ? "1px solid rgba(76,175,80,0.6)" : "1px solid rgba(66,165,245,0.3)",
        }} />

        {/* Fish indicator */}
        <div style={{
          position: "absolute", top: "50%", transform: "translate(-50%, -50%)",
          left: `${fishPosition}%`,
          fontSize: "24px", transition: "left 0.05s",
          filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
        }}>
          {currentFish.emoji}
        </div>
      </div>

      {/* Fish shadow underwater */}
      <div style={{
        fontSize: "32px", opacity: 0.4,
        filter: "blur(4px) brightness(0.5)",
        transform: `translateX(${(fishPosition - 50) * 2}px)`,
        transition: "transform 0.1s",
        pointerEvents: "none",
      }}>
        {currentFish.emoji}
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

      {/* Reel button for mobile */}
      <button
        onMouseDown={() => keysRef.current.space = true}
        onMouseUp={() => keysRef.current.space = false}
        onMouseLeave={() => keysRef.current.space = false}
        onTouchStart={(e) => { e.preventDefault(); keysRef.current.space = true; }}
        onTouchEnd={(e) => { e.preventDefault(); keysRef.current.space = false; }}
        style={{
          padding: "14px 48px", fontSize: "16px", fontWeight: 700, borderRadius: "12px",
          background: "rgba(66,165,245,0.25)", border: "2px solid #42a5f5",
          color: "#64b5f6", cursor: "pointer", marginTop: "4px",
        }}
      >
        SEGURAR PARA RECOLHER
      </button>
    </>
  );
}
