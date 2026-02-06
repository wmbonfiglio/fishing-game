export default function TitleScreen({ game }) {
  const { setScreen, hasSaveData } = game;

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif",
      background: "linear-gradient(180deg, #0a1628 0%, #0f3460 40%, #1a5276 70%, #0a1628 100%)",
      color: "#e0e0e0", position: "relative", overflow: "hidden",
    }}>
      {/* Animated water background */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", opacity: 0.3 }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            position: "absolute", bottom: `${i * 8}%`, left: 0, right: 0, height: "3px",
            background: `rgba(100,200,255,${0.3 - i * 0.05})`,
            animation: `wave ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }} />
        ))}
      </div>

      <div style={{ fontSize: "80px", marginBottom: "10px", filter: "drop-shadow(0 0 20px rgba(100,200,255,0.5))" }}>🎣</div>
      <h1 style={{
        fontSize: "48px", fontWeight: 800, margin: 0,
        background: "linear-gradient(135deg, #64b5f6, #42a5f5, #1e88e5)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        textShadow: "none", letterSpacing: "-1px",
      }}>PESCA RPG</h1>
      <p style={{ fontSize: "16px", color: "#8BB4D6", marginTop: "8px", letterSpacing: "3px", textTransform: "uppercase" }}>
        A arte da pesca
      </p>

      <div style={{ marginTop: "50px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {hasSaveData && (
          <button onClick={() => setScreen("game")} style={{
            padding: "14px 60px", fontSize: "18px", fontWeight: 700, border: "2px solid #4CAF50",
            background: "rgba(76,175,80,0.15)", color: "#66BB6A", borderRadius: "8px",
            cursor: "pointer", letterSpacing: "2px", transition: "all 0.2s",
          }}
            onMouseOver={e => { e.target.style.background = "rgba(76,175,80,0.3)"; e.target.style.transform = "scale(1.05)"; }}
            onMouseOut={e => { e.target.style.background = "rgba(76,175,80,0.15)"; e.target.style.transform = "scale(1)"; }}
          >
            CONTINUAR
          </button>
        )}
        <button onClick={() => {
          if (hasSaveData) {
            localStorage.removeItem("pesca-rpg-save");
            window.location.reload();
          } else {
            setScreen("game");
          }
        }} style={{
          padding: "14px 60px", fontSize: "18px", fontWeight: 700, border: "2px solid #42a5f5",
          background: "rgba(66,165,245,0.15)", color: "#64b5f6", borderRadius: "8px",
          cursor: "pointer", letterSpacing: "2px", transition: "all 0.2s",
        }}
          onMouseOver={e => { e.target.style.background = "rgba(66,165,245,0.3)"; e.target.style.transform = "scale(1.05)"; }}
          onMouseOut={e => { e.target.style.background = "rgba(66,165,245,0.15)"; e.target.style.transform = "scale(1)"; }}
        >
          {hasSaveData ? "NOVO JOGO" : "PESCAR"}
        </button>
      </div>

      <div style={{ position: "absolute", bottom: "30px", color: "#5A8AA8", fontSize: "13px", textAlign: "center" }}>
        ESPAÇO para lançar e fisgar • Segure ESPAÇO para recolher
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateX(-10px) scaleY(1); }
          50% { transform: translateX(10px) scaleY(1.5); }
        }
      `}</style>
    </div>
  );
}
