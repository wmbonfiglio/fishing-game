import { LOCATIONS, FISH_DATABASE, RARITY_COLORS, RARITY_NAMES } from "../data/gameData";

export default function GameScreen({ game }) {
  const {
    gamePhase, message, level, gold, xp, xpPercent,
    currentLocation, setCurrentLocation, loc,
    rod, bait,
    castPower, bobberExclamation,
    currentFish, fishWeight, fishPosition, catchZonePos, catchZoneSize,
    tension, reelProgress, catchResult,
    totalCaught, biggestFish, caughtFish,
    achievementPopup,
    setScreen, startCasting, releaseCast, resetFishing, keysRef,
  } = game;

  return (
    <div style={{
      width: "100%", height: "100vh", fontFamily: "'Segoe UI', sans-serif",
      background: loc.bgGradient, color: "#e0e0e0", position: "relative", overflow: "hidden",
      userSelect: "none",
    }}>
      {/* Water effect */}
      <div style={{ position: "absolute", top: "55%", left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: `${i * 12}%`, left: "-10%", right: "-10%", height: "2px",
            background: `rgba(150,220,255,${0.15 - i * 0.015})`,
            animation: `waterWave ${4 + i * 0.7}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }} />
        ))}
      </div>

      {/* HUD - Top Bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, padding: "12px 16px",
        background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)",
        display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "14px" }}>
            <span style={{ color: "#FFD700", fontWeight: 700 }}>Nv.{level}</span>
            <div style={{
              width: "80px", height: "4px", background: "rgba(255,255,255,0.1)",
              borderRadius: "2px", marginTop: "3px", overflow: "hidden",
            }}>
              <div style={{
                width: `${xpPercent}%`, height: "100%", borderRadius: "2px",
                background: "linear-gradient(90deg, #42a5f5, #64b5f6)",
                transition: "width 0.3s",
              }} />
            </div>
          </div>
          <span style={{ fontSize: "15px", color: "#FFD700" }}>💰 {gold}</span>
        </div>

        <div style={{ fontSize: "14px", color: "#8BB4D6" }}>
          {loc.icon} {loc.name}
        </div>

        <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#6B8FA8" }}>
          <span>{rod.icon} {rod.name}</span>
          <span>•</span>
          <span>{bait.icon} {bait.name}</span>
        </div>
      </div>

      {/* Navigation buttons */}
      <div style={{
        position: "absolute", bottom: "12px", left: "12px", display: "flex", gap: "6px", zIndex: 10,
      }}>
        {[
          { icon: "🏪", label: "Loja", screen: "shop" },
          { icon: "📖", label: "Coleção", screen: "collection" },
          { icon: "🏆", label: "Conquistas", screen: "achievements" },
        ].map(btn => (
          <button key={btn.screen} onClick={() => setScreen(btn.screen)} style={{
            padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "13px",
            background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
            color: "#8BB4D6", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", gap: "4px",
          }}>{btn.icon} {btn.label}</button>
        ))}
      </div>

      {/* Location selector */}
      <div style={{
        position: "absolute", bottom: "12px", right: "12px", display: "flex", gap: "4px", zIndex: 10,
      }}>
        {LOCATIONS.map((l, i) => {
          const unlocked = level >= l.unlockLevel;
          return (
            <button key={l.id}
              onClick={() => unlocked && gamePhase === "idle" && setCurrentLocation(i)}
              style={{
                padding: "8px 12px", borderRadius: "8px", fontSize: "13px",
                cursor: unlocked && gamePhase === "idle" ? "pointer" : "not-allowed",
                background: i === currentLocation ? "rgba(66,165,245,0.3)" : "rgba(0,0,0,0.4)",
                border: i === currentLocation ? "1px solid #42a5f5" : "1px solid rgba(255,255,255,0.1)",
                color: unlocked ? (i === currentLocation ? "#64b5f6" : "#8899AA") : "#444",
                backdropFilter: "blur(5px)",
              }}
              title={unlocked ? l.name : `Nível ${l.unlockLevel}`}
            >
              {unlocked ? l.icon : "🔒"} {l.name}
            </button>
          );
        })}
      </div>

      {/* Fishing Scene */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5,
      }}>
        {/* Bobber area */}
        {(gamePhase === "waiting" || gamePhase === "idle") && (
          <div style={{ textAlign: "center" }}>
            {gamePhase === "waiting" && (
              <div style={{
                fontSize: bobberExclamation ? "64px" : "48px",
                animation: bobberExclamation ? "shake 0.1s infinite" : "bob 2s ease-in-out infinite",
                transition: "font-size 0.2s",
              }}>
                {bobberExclamation ? "❗" : "🎣"}
              </div>
            )}

            {gamePhase === "idle" && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🧑‍🌾</div>
                <button
                  onClick={startCasting}
                  onMouseDown={() => { keysRef.current.space = true; startCasting(); }}
                  onMouseUp={() => { keysRef.current.space = false; releaseCast(); }}
                  onTouchStart={(e) => { e.preventDefault(); keysRef.current.space = true; startCasting(); }}
                  onTouchEnd={(e) => { e.preventDefault(); keysRef.current.space = false; releaseCast(); }}
                  style={{
                    padding: "16px 48px", fontSize: "18px", fontWeight: 700, borderRadius: "12px",
                    background: "rgba(66,165,245,0.2)", border: "2px solid #42a5f5",
                    color: "#64b5f6", cursor: "pointer", letterSpacing: "1px",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                >
                  🎣 LANÇAR LINHA
                </button>
              </div>
            )}
          </div>
        )}

        {/* Casting power bar */}
        {gamePhase === "casting" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "14px", marginBottom: "10px", color: "#8BB4D6" }}>FORÇA DO LANÇAMENTO</div>
            <div style={{
              width: "250px", height: "24px", background: "rgba(0,0,0,0.5)",
              borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.2)",
            }}>
              <div style={{
                width: `${castPower}%`, height: "100%",
                background: castPower > 80 ? "linear-gradient(90deg, #4CAF50, #FF9800, #F44336)" :
                  castPower > 50 ? "linear-gradient(90deg, #4CAF50, #FF9800)" : "#4CAF50",
                transition: "width 0.02s linear",
                borderRadius: "10px",
              }} />
            </div>
            <div style={{ fontSize: "28px", fontWeight: 700, marginTop: "8px", color: "#FFD700" }}>
              {Math.round(castPower)}%
            </div>
            <div style={{ fontSize: "12px", color: "#6B8FA8", marginTop: "4px" }}>Solte ESPAÇO para lançar</div>
          </div>
        )}

        {/* REELING MINIGAME */}
        {gamePhase === "reeling" && currentFish && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            {/* Fish info */}
            <div style={{
              textAlign: "center", padding: "8px 20px", borderRadius: "8px",
              background: "rgba(0,0,0,0.6)", border: `1px solid ${RARITY_COLORS[currentFish.rarity]}55`,
            }}>
              <span style={{ fontSize: "20px" }}>{currentFish.emoji}</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: RARITY_COLORS[currentFish.rarity], marginLeft: "8px" }}>
                {currentFish.name}
              </span>
              <span style={{ fontSize: "13px", color: "#8899AA", marginLeft: "8px" }}>{fishWeight}kg</span>
            </div>

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

            {/* Progress bar */}
            <div style={{ width: "300px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6B8FA8", marginBottom: "4px" }}>
                <span>Progresso</span>
                <span>{Math.round(reelProgress)}%</span>
              </div>
              <div style={{
                width: "100%", height: "10px", background: "rgba(0,0,0,0.5)",
                borderRadius: "5px", overflow: "hidden",
              }}>
                <div style={{
                  width: `${reelProgress}%`, height: "100%",
                  background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
                  borderRadius: "5px", transition: "width 0.1s",
                }} />
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
          </div>
        )}

        {/* Caught result */}
        {gamePhase === "caught" && catchResult && (
          <div style={{
            textAlign: "center", padding: "24px 40px", borderRadius: "16px",
            background: "rgba(0,0,0,0.7)", border: `2px solid ${RARITY_COLORS[catchResult.fish.rarity]}`,
            backdropFilter: "blur(10px)",
            animation: "popIn 0.3s ease-out",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>{catchResult.fish.emoji}</div>
            <div style={{
              fontSize: "24px", fontWeight: 800,
              color: RARITY_COLORS[catchResult.fish.rarity],
            }}>
              {catchResult.fish.name}
            </div>
            <div style={{
              fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px",
              color: RARITY_COLORS[catchResult.fish.rarity], marginTop: "4px",
            }}>
              {RARITY_NAMES[catchResult.fish.rarity]}
            </div>
            <div style={{ fontSize: "18px", color: "#e0e0e0", marginTop: "12px" }}>
              ⚖️ {catchResult.weight}kg
            </div>
            <div style={{ fontSize: "16px", color: "#FFD700", marginTop: "6px" }}>
              💰 +{catchResult.sellPrice} moedas
            </div>
            <div style={{ fontSize: "14px", color: "#64b5f6", marginTop: "4px" }}>
              ✨ +{catchResult.fish.xp} XP
            </div>
            <button onClick={resetFishing} style={{
              marginTop: "18px", padding: "10px 32px", fontSize: "15px", fontWeight: 600,
              borderRadius: "8px", cursor: "pointer",
              background: "rgba(66,165,245,0.2)", border: "1px solid #42a5f5", color: "#64b5f6",
            }}>
              Pescar Novamente
            </button>
          </div>
        )}

        {/* Escaped message */}
        {gamePhase === "escaped" && (
          <div style={{
            textAlign: "center", padding: "24px 40px", borderRadius: "16px",
            background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,100,100,0.3)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>💔</div>
            <div style={{ fontSize: "20px", color: "#FF6B6B" }}>O peixe escapou!</div>
            <div style={{ fontSize: "14px", color: "#8899AA", marginTop: "8px" }}>
              {currentFish?.emoji} {currentFish?.name} era forte demais...
            </div>
          </div>
        )}
      </div>

      {/* Message bar */}
      {message && (
        <div style={{
          position: "absolute", top: "60px", left: "50%", transform: "translateX(-50%)",
          padding: "10px 24px", borderRadius: "8px", fontSize: "14px",
          background: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)",
          color: "#e0e0e0", zIndex: 10, whiteSpace: "nowrap",
          backdropFilter: "blur(5px)",
        }}>
          {message}
        </div>
      )}

      {/* Stats corner */}
      <div style={{
        position: "absolute", top: "55px", right: "12px", fontSize: "12px",
        color: "#5A7A8A", zIndex: 10, textAlign: "right",
      }}>
        <div>🐟 Pescados: {totalCaught}</div>
        <div>📖 Espécies: {Object.keys(caughtFish).length}/{FISH_DATABASE.length}</div>
        <div>⚖️ Maior: {biggestFish}kg</div>
      </div>

      {/* Achievement popup */}
      {achievementPopup && (
        <div style={{
          position: "absolute", top: "100px", left: "50%", transform: "translateX(-50%)",
          padding: "16px 32px", borderRadius: "12px",
          background: "rgba(255,215,0,0.15)", border: "2px solid #FFD700",
          color: "#FFD700", fontSize: "16px", fontWeight: 700, zIndex: 20,
          backdropFilter: "blur(10px)",
          animation: "slideDown 0.3s ease-out",
        }}>
          {achievementPopup.icon} CONQUISTA: {achievementPopup.name}!
        </div>
      )}

      <style>{`
        @keyframes waterWave {
          0%, 100% { transform: translateX(-20px) scaleY(1); }
          50% { transform: translateX(20px) scaleY(2); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(-3px) rotate(-5deg); }
          50% { transform: translateX(3px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.03); }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes slideDown {
          0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
