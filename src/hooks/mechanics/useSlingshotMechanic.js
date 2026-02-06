import { useState, useRef, useEffect } from "react";
import { RODS, LINES } from "../../data/gameData";

/**
 * Mecanica "Estilingue" — mira rotativa + barra de forca.
 *
 * Fase 1: Uma seta gira ao redor do centro. Aperte ESPACO para travar a DIRECAO.
 * Fase 2: Uma barra de forca oscila. Aperte ESPACO para travar a FORCA.
 * O "tiro" voa em direcao ao peixe. Quanto mais perto, mais progresso.
 * - Acerto perfeito (distancia < perfectRadius): +grande progresso, -tensao, +combo
 * - Acerto bom (distancia < goodRadius): +algum progresso, +combo
 * - Errou (distancia > goodRadius): +tensao, -progresso, combo resetado
 * O peixe se move para uma nova posicao apos cada tiro.
 */
export default function useSlingshotMechanic({
  gamePhase, currentFish, keysRef, equippedRod, equippedLine,
  currentWeather, currentBossRef, bossHpRef, setBossHp,
}) {
  const [tension, setTension] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);

  // Slingshot-specific state
  const [aimAngle, setAimAngle] = useState(0);           // current rotating angle (radians)
  const [powerLevel, setPowerLevel] = useState(0);        // current oscillating power (0-1)
  const [shotPhase, setShotPhase] = useState("aiming");   // "aiming" | "power" | "flying" | "result"
  const [lockedAngle, setLockedAngle] = useState(0);      // angle locked by player
  const [lockedPower, setLockedPower] = useState(0);      // power locked by player
  const [fishTarget, setFishTarget] = useState({ x: 0.6, y: -0.3 }); // fish position in unit circle area
  const [shotPos, setShotPos] = useState(null);            // { x, y } of where the shot landed
  const [shotFeedback, setShotFeedback] = useState(null);  // { type: "perfect"|"good"|"miss", id }
  const [slingshotCombo, setSlingshotCombo] = useState(0);
  const [shotTrail, setShotTrail] = useState(null);        // { fromX, fromY, toX, toY } for visual trail

  const slingshotComboRef = useRef(0);
  const spaceWasPressedRef = useRef(false);
  const frameRef = useRef(null);
  const shotTimerRef = useRef(null);

  const rod = RODS[equippedRod];
  const line = LINES[equippedLine];

  // Zone sizes — affected by rod stats
  const perfectRadius = 0.10 + rod.tension * 0.02;  // ~0.12-0.16
  const goodRadius = perfectRadius + 0.14 + rod.power * 0.03; // ~0.28-0.35

  const getDifficulty = () => {
    if (!currentFish) return { aimSpeed: 2.0, powerSpeed: 2.5, tensionPerMiss: 8, fishMoveRange: 0.5 };
    const diff = currentFish.difficulty + (currentWeather.difficultyAdd || 0);
    const isBoss = !!currentBossRef.current;
    const bossMulti = isBoss ? 1.4 : 1;
    return {
      aimSpeed: (0.9 + diff * 0.2) * bossMulti,
      powerSpeed: (1.0 + diff * 0.25) * bossMulti,
      tensionPerMiss: (6 + diff * 2.5) * bossMulti / line.strength,
      progressPerPerfect: (4.0 + rod.power * 1.5) * (line.reelBonus ?? 1.0),
      progressPerGood: (1.8 + rod.power * 0.5) * (line.reelBonus ?? 1.0),
      progressDecay: 0.008 * diff,
      tensionDecay: 0.08 * line.strength,
      fishMoveRange: Math.min(0.75, 0.4 + diff * 0.06) * bossMulti,
    };
  };

  // Move fish to a new random position within the arena
  const moveFish = (range) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 0.25 + Math.random() * Math.min(0.55, range || 0.5);
    setFishTarget({
      x: Math.max(-0.8, Math.min(0.8, Math.cos(angle) * dist)),
      y: Math.max(-0.8, Math.min(0.8, Math.sin(angle) * dist)),
    });
  };

  const initReeling = () => {
    setTension(0);
    setReelProgress(0);
    setShotPhase("aiming");
    setAimAngle(0);
    setPowerLevel(0);
    setLockedAngle(0);
    setLockedPower(0);
    setShotPos(null);
    setShotFeedback(null);
    setSlingshotCombo(0);
    slingshotComboRef.current = 0;
    setShotTrail(null);
    // Start with space "already pressed" so the hookFish SPACE press is ignored
    spaceWasPressedRef.current = true;
    // Place fish at initial random position
    const angle = Math.random() * Math.PI * 2;
    const dist = 0.35 + Math.random() * 0.3;
    setFishTarget({ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist });
  };

  const cleanup = () => {
    setTension(0);
    setReelProgress(0);
    setSlingshotCombo(0);
    slingshotComboRef.current = 0;
    if (shotTimerRef.current) clearTimeout(shotTimerRef.current);
  };

  // Main game loop
  useEffect(() => {
    if (gamePhase !== "reeling" || !currentFish) return;

    const params = getDifficulty();
    const isBoss = !!currentBossRef.current;
    const bossData = currentBossRef.current;
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = (now - lastTime) / 1000; // seconds
      lastTime = now;

      const spaceNow = !!keysRef.current.space;
      const spaceJustPressed = spaceNow && !spaceWasPressedRef.current;
      if (spaceNow) spaceWasPressedRef.current = true;
      if (!spaceNow) spaceWasPressedRef.current = false;

      setShotPhase(currentPhase => {
        if (currentPhase === "aiming") {
          // Rotate the aim arrow
          setAimAngle(prev => prev + params.aimSpeed * dt);

          if (spaceJustPressed) {
            // Lock direction
            setAimAngle(prev => {
              setLockedAngle(prev);
              return prev;
            });
            setPowerLevel(0);
            return "power";
          }
        } else if (currentPhase === "power") {
          // Oscillate power bar (ping-pong 0→1→0)
          setPowerLevel(prev => {
            const next = prev + params.powerSpeed * dt;
            // Ping-pong: use triangle wave
            const cycle = next % 2;
            return cycle <= 1 ? cycle : 2 - cycle;
          });

          if (spaceJustPressed) {
            // Lock power and fire!
            setPowerLevel(prev => {
              const actualPower = prev % 2;
              const finalPower = actualPower <= 1 ? actualPower : 2 - actualPower;
              setLockedPower(finalPower);

              // Calculate where the shot lands
              setLockedAngle(prevAngle => {
                const shotX = Math.cos(prevAngle) * finalPower * 0.85;
                const shotY = Math.sin(prevAngle) * finalPower * 0.85;
                setShotPos({ x: shotX, y: shotY });
                setShotTrail({ fromX: 0, fromY: 0, toX: shotX, toY: shotY });

                // Calculate distance to fish
                setFishTarget(prevFish => {
                  const dx = shotX - prevFish.x;
                  const dy = shotY - prevFish.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);

                  if (distance <= perfectRadius) {
                    // PERFECT HIT
                    const comboBonus = 1 + slingshotComboRef.current * 0.12;
                    setReelProgress(p => Math.min(100, p + params.progressPerPerfect * comboBonus));
                    setTension(t => Math.max(0, t - 3.0 * line.strength));
                    slingshotComboRef.current += 1;
                    setSlingshotCombo(slingshotComboRef.current);
                    setShotFeedback({ type: "perfect", id: Date.now() });
                    if (isBoss && bossData) {
                      bossHpRef.current = Math.max(0, bossHpRef.current - 2.5 * rod.power * (line.reelBonus ?? 1));
                      setBossHp(bossHpRef.current);
                      const bossMaxHp = bossData.hp;
                      setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
                    }
                  } else if (distance <= goodRadius) {
                    // GOOD HIT
                    setReelProgress(p => Math.min(100, p + params.progressPerGood));
                    setTension(t => Math.max(0, t - 0.8));
                    slingshotComboRef.current += 1;
                    setSlingshotCombo(slingshotComboRef.current);
                    setShotFeedback({ type: "good", id: Date.now() });
                    if (isBoss && bossData) {
                      bossHpRef.current = Math.max(0, bossHpRef.current - 1.0 * rod.power * (line.reelBonus ?? 1));
                      setBossHp(bossHpRef.current);
                      const bossMaxHp = bossData.hp;
                      setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
                    }
                  } else {
                    // MISS
                    setTension(t => Math.min(100, t + params.tensionPerMiss));
                    setReelProgress(p => Math.max(0, p - 1.5));
                    slingshotComboRef.current = 0;
                    setSlingshotCombo(0);
                    setShotFeedback({ type: "miss", id: Date.now() });
                  }

                  return prevFish;
                });

                return prevAngle;
              });

              return finalPower;
            });

            // After a brief delay, move fish and go back to aiming
            if (shotTimerRef.current) clearTimeout(shotTimerRef.current);
            shotTimerRef.current = setTimeout(() => {
              moveFish(params.fishMoveRange);
              setShotPos(null);
              setShotTrail(null);
              setShotFeedback(null);
              setShotPhase("aiming");
            }, 800);

            return "result";
          }
        }
        // "result" phase — just wait for the timeout above
        return currentPhase;
      });

      // Passive tension decay
      setTension(t => Math.max(0, t - params.tensionDecay * dt));

      // Passive progress decay (non-boss only)
      if (!isBoss) {
        setReelProgress(p => Math.max(0, p - params.progressDecay * dt * 30));
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frameRef.current);
      if (shotTimerRef.current) clearTimeout(shotTimerRef.current);
    };
  }, [gamePhase, currentFish, equippedRod, equippedLine, currentWeather]);

  // Derived values for compatibility with the mechanic interface
  const fishPosition = 50 + fishTarget.x * 40;
  const catchZonePos = 50;
  const catchZoneSize = goodRadius * 100;

  return {
    fishPosition,
    catchZonePos,
    catchZoneSize,
    tension,
    reelProgress,
    initReeling,
    cleanup,
    // Slingshot-specific state for UI
    aimAngle,
    powerLevel,
    shotPhase,
    lockedAngle,
    lockedPower,
    fishTarget,
    shotPos,
    shotFeedback,
    slingshotCombo,
    shotTrail,
    perfectRadius,
    goodRadius,
  };
}
