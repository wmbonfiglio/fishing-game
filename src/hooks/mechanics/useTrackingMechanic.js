import { useState, useRef, useEffect } from "react";
import { RODS, LINES } from "../../data/gameData";

/**
 * Mecânica "Tracking" — a mecânica original.
 * O jogador segura ESPAÇO para mover a catch zone em direção ao peixe.
 * Manter o peixe dentro da zona aumenta o progresso; fora, a tensão sobe.
 */
export default function useTrackingMechanic({ gamePhase, currentFish, keysRef, equippedRod, equippedLine, currentWeather, currentBossRef, bossHpRef, setBossHp }) {
  const [fishPosition, setFishPosition] = useState(50);
  const fishPositionRef = useRef(50);
  const [catchZonePos, setCatchZonePos] = useState(40);
  const [tension, setTension] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);
  const [fishDir, setFishDir] = useState(1);
  const fishDirRef = useRef(1);

  const rod = RODS[equippedRod];
  const catchZoneSize = 15 + rod.tension * 3;

  const initReeling = (initialDir) => {
    setFishPosition(50);
    fishPositionRef.current = 50;
    setCatchZonePos(50);
    setTension(0);
    setReelProgress(0);
    setFishDir(initialDir);
    fishDirRef.current = initialDir;
  };

  const cleanup = () => {
    setTension(0);
    setReelProgress(0);
  };

  // Game loop
  useEffect(() => {
    if (gamePhase !== "reeling" || !currentFish) return;

    const line = LINES[equippedLine];
    const isBoss = !!currentBossRef.current;
    const bossData = currentBossRef.current;
    const difficulty = currentFish.difficulty + (currentWeather.difficultyAdd || 0);
    const speed = currentFish.speed * (isBoss ? 1.3 : 1);
    const catchZoneSizeLocal = 15 + rod.tension * 3;
    const reelBonus = line.reelBonus ?? 1.0;
    let changeTimer = 0;
    let patternTimer = 0;
    let patternPhase = 0;

    const interval = setInterval(() => {
      changeTimer -= 1;

      // Boss movement patterns
      if (isBoss && bossData) {
        patternTimer += 1;
        const pattern = bossData.pattern;

        if (pattern === "zigzag") {
          if (changeTimer <= 0) {
            fishDirRef.current = -fishDirRef.current;
            setFishDir(fishDirRef.current);
            changeTimer = 8 + Math.random() * 12;
          }
        } else if (pattern === "charge") {
          if (changeTimer <= 0) {
            patternPhase = (patternPhase + 1) % 3;
            if (patternPhase === 0) {
              fishDirRef.current = Math.random() > 0.5 ? 1 : -1;
              setFishDir(fishDirRef.current);
              changeTimer = 30 + Math.random() * 20;
            } else {
              changeTimer = 15;
            }
          }
        } else if (pattern === "erratic") {
          if (changeTimer <= 0) {
            fishDirRef.current = Math.random() > 0.5 ? 1 : -1;
            setFishDir(fishDirRef.current);
            changeTimer = 5 + Math.random() * 15;
          }
        } else if (pattern === "dive") {
          if (changeTimer <= 0) {
            patternPhase = (patternPhase + 1) % 2;
            fishDirRef.current = patternPhase === 0 ? 1 : -1;
            setFishDir(fishDirRef.current);
            changeTimer = patternPhase === 0 ? 40 : 25;
          }
        }
      } else {
        if (changeTimer <= 0) {
          const newDir = Math.random() > 0.5 ? 1 : -1;
          fishDirRef.current = newDir;
          setFishDir(newDir);
          changeTimer = Math.random() * 60 + 20;
        }
      }

      setFishPosition(prev => {
        const dir = fishDirRef.current;
        const movement = dir * speed * difficulty * 0.4 * (0.5 + Math.random());
        const jitter = (Math.random() - 0.5) * difficulty * 0.5;
        let next = prev + movement + jitter;
        if (next < 5) { next = 5; fishDirRef.current = 1; setFishDir(1); }
        if (next > 95) { next = 95; fishDirRef.current = -1; setFishDir(-1); }
        fishPositionRef.current = next;
        return next;
      });

      setCatchZonePos(prev => {
        const fp = fishPositionRef.current;
        if (keysRef.current.space) {
          const moveSpeed = 1.5 * rod.power;
          const diff = fp - prev;
          return prev + Math.sign(diff) * Math.min(Math.abs(diff), moveSpeed);
        }
        return prev + (Math.random() - 0.5) * 0.5;
      });

      setCatchZonePos(currentCatchZone => {
        const fp = fishPositionRef.current;
        const inZone = Math.abs(fp - currentCatchZone) < catchZoneSizeLocal / 2;
        const tensionMult = isBoss ? 1.3 : 1;

        setTension(prev => {
          let newTension = prev;
          if (keysRef.current.space && !inZone) {
            newTension += 0.8 * difficulty * tensionMult / line.strength;
          } else if (inZone && keysRef.current.space) {
            newTension -= 0.3 * line.strength;
          } else {
            newTension -= 0.5;
          }
          return Math.max(0, Math.min(100, newTension));
        });

        if (isBoss) {
          if (inZone) {
            bossHpRef.current = Math.max(0, bossHpRef.current - 0.5 * rod.power * reelBonus);
            setBossHp(bossHpRef.current);
            const bossMaxHp = bossData ? bossData.hp : 100;
            setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
          } else {
            const bossMaxHp = bossData ? bossData.hp : 100;
            bossHpRef.current = Math.min(bossMaxHp, bossHpRef.current + 0.05 * difficulty);
            setBossHp(bossHpRef.current);
            setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
          }
        } else {
          setReelProgress(prev => {
            if (inZone) {
              return Math.min(100, prev + 0.3 * rod.power * reelBonus);
            }
            return Math.max(0, prev - 0.15 * difficulty);
          });
        }

        return currentCatchZone;
      });
    }, 33);

    return () => clearInterval(interval);
  }, [gamePhase, currentFish, equippedRod, equippedLine, currentWeather]);

  return {
    fishPosition,
    catchZonePos,
    catchZoneSize,
    tension,
    reelProgress,
    initReeling,
    cleanup,
  };
}
