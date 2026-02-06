import { useState, useRef, useEffect, useCallback } from "react";
import { RODS, LINES } from "../../data/gameData";

/**
 * Mecanica "Ritmo" — aneis concentricos se aproximam do alvo.
 * Aperte ESPACO no momento certo!
 *
 * - Perfeito (anel dentro da zona interna): +grande progresso, -tensao, +combo
 * - Bom (anel na zona externa): +algum progresso
 * - Errou (anel passou): +tensao, -progresso, combo resetado
 */
export default function useRhythmMechanic({ gamePhase, currentFish, keysRef, equippedRod, equippedLine, currentWeather, currentBossRef, bossHpRef, setBossHp }) {
  const [tension, setTension] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);

  // Ring state: each ring has { id, scale (1.0 → 0.0), speed }
  const [rings, setRings] = useState([]);
  const [hitFeedback, setHitFeedback] = useState(null); // { type: "perfect"|"good"|"miss", id }
  const [rhythmCombo, setRhythmCombo] = useState(0);
  const [fishSway, setFishSway] = useState(0); // visual sway of the fish

  const ringIdRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const spaceWasPressedRef = useRef(false);

  const rod = RODS[equippedRod];
  const line = LINES[equippedLine];

  // Zone sizes (as scale values 0-1, where 0 = center, 1 = outermost)
  const perfectZone = 0.08 + rod.tension * 0.03;  // inner: ~0.11-0.17
  const goodZone = perfectZone + 0.10 + rod.power * 0.03; // outer: ~0.24-0.33

  // Difficulty-derived values
  const getDifficulty = () => {
    if (!currentFish) return { ringSpeed: 0.01, spawnInterval: 1200, tensionPerMiss: 8 };
    const diff = currentFish.difficulty + (currentWeather.difficultyAdd || 0);
    const isBoss = !!currentBossRef.current;
    const bossMulti = isBoss ? 1.4 : 1;
    return {
      ringSpeed: (0.008 + diff * 0.003) * bossMulti,
      spawnInterval: Math.max(500, 1400 - diff * 150) / bossMulti,
      tensionPerMiss: (6 + diff * 2.5) * bossMulti / line.strength,
      progressPerPerfect: (3.5 + rod.power * 1.5) * (line.reelBonus ?? 1.0),
      progressPerGood: (1.5 + rod.power * 0.5) * (line.reelBonus ?? 1.0),
      progressDecay: 0.02 * diff,
      tensionDecay: 0.12 * line.strength,
    };
  };

  const initReeling = () => {
    setTension(0);
    setReelProgress(0);
    setRings([]);
    setHitFeedback(null);
    setRhythmCombo(0);
    setFishSway(0);
    ringIdRef.current = 0;
    lastSpawnRef.current = 0;
    spaceWasPressedRef.current = false;
  };

  const cleanup = () => {
    setTension(0);
    setReelProgress(0);
    setRings([]);
    setRhythmCombo(0);
  };

  // Main game loop
  useEffect(() => {
    if (gamePhase !== "reeling" || !currentFish) return;

    const params = getDifficulty();
    const isBoss = !!currentBossRef.current;
    const bossData = currentBossRef.current;
    let lastTime = performance.now();

    const loop = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      // Spawn new rings
      if (now - lastSpawnRef.current > params.spawnInterval) {
        lastSpawnRef.current = now;
        ringIdRef.current += 1;
        setRings(prev => [...prev, {
          id: ringIdRef.current,
          scale: 1.0,
          speed: params.ringSpeed * (0.85 + Math.random() * 0.3),
        }]);
      }

      // Update ring scales
      setRings(prev => {
        const updated = prev.map(r => ({
          ...r,
          scale: r.scale - r.speed * dt,
        }));

        // Check for missed rings (scale went below 0)
        const missed = updated.filter(r => r.scale <= -0.05);
        if (missed.length > 0) {
          setTension(t => Math.min(100, t + params.tensionPerMiss * missed.length));
          setReelProgress(p => Math.max(0, p - 1.5 * missed.length));
          setRhythmCombo(0);
          setHitFeedback({ type: "miss", id: Date.now() });
          setTimeout(() => setHitFeedback(prev => prev?.type === "miss" ? null : prev), 600);
        }

        return updated.filter(r => r.scale > -0.05);
      });

      // Handle SPACE press (edge detection — only on press, not hold)
      const spaceNow = !!keysRef.current.space;
      if (spaceNow && !spaceWasPressedRef.current) {
        spaceWasPressedRef.current = true;
        // Check hit against closest ring
        setRings(prev => {
          if (prev.length === 0) {
            // Pressed with no rings — small tension penalty
            setTension(t => Math.min(100, t + 3));
            return prev;
          }
          // Find ring closest to center (smallest scale)
          const sorted = [...prev].sort((a, b) => Math.abs(a.scale) - Math.abs(b.scale));
          const closest = sorted[0];
          const absScale = Math.abs(closest.scale);

          if (absScale <= perfectZone) {
            // PERFECT
            const comboBonus = 1 + rhythmCombo * 0.1;
            setReelProgress(p => Math.min(100, p + params.progressPerPerfect * comboBonus));
            setTension(t => Math.max(0, t - 2.5 * line.strength));
            setRhythmCombo(c => c + 1);
            setHitFeedback({ type: "perfect", id: Date.now() });
            setFishSway(1);
            if (isBoss && bossData) {
              bossHpRef.current = Math.max(0, bossHpRef.current - 2.0 * rod.power * (line.reelBonus ?? 1));
              setBossHp(bossHpRef.current);
              const bossMaxHp = bossData.hp;
              setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
            }
          } else if (absScale <= goodZone) {
            // GOOD
            setReelProgress(p => Math.min(100, p + params.progressPerGood));
            setTension(t => Math.max(0, t - 0.5));
            setRhythmCombo(c => c + 1);
            setHitFeedback({ type: "good", id: Date.now() });
            setFishSway(0.5);
            if (isBoss && bossData) {
              bossHpRef.current = Math.max(0, bossHpRef.current - 0.8 * rod.power * (line.reelBonus ?? 1));
              setBossHp(bossHpRef.current);
              const bossMaxHp = bossData.hp;
              setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
            }
          } else {
            // Too early — pressed but ring is still far
            setTension(t => Math.min(100, t + params.tensionPerMiss * 0.5));
            setRhythmCombo(0);
            setHitFeedback({ type: "miss", id: Date.now() });
          }

          setTimeout(() => setHitFeedback(prev => prev ? null : prev), 600);
          setTimeout(() => setFishSway(0), 200);

          // Remove the hit ring
          return prev.filter(r => r.id !== closest.id);
        });
      }
      if (!spaceNow) {
        spaceWasPressedRef.current = false;
      }

      // Passive tension decay & progress decay
      setTension(t => Math.max(0, t - params.tensionDecay * (dt / 33)));
      if (!isBoss) {
        setReelProgress(p => Math.max(0, p - params.progressDecay * (dt / 33)));
      }

      // Fish visual sway (cosmetic)
      setFishSway(s => s * 0.92);

      frameRef.current = requestAnimationFrame(loop);
    };

    const frameRef = { current: requestAnimationFrame(loop) };
    return () => cancelAnimationFrame(frameRef.current);
  }, [gamePhase, currentFish, equippedRod, equippedLine, currentWeather]);

  // Derived values for UI
  const catchZoneSize = goodZone * 100; // for compatibility (not really used same way)
  const fishPosition = 50 + fishSway * 15; // slight visual movement
  const catchZonePos = 50;

  return {
    fishPosition,
    catchZonePos,
    catchZoneSize,
    tension,
    reelProgress,
    initReeling,
    cleanup,
    // Extra state for the rhythm UI
    rings,
    hitFeedback,
    rhythmCombo,
    perfectZone,
    goodZone,
  };
}
