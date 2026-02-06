import { useState, useRef, useEffect } from "react";
import { RODS, LINES } from "../../data/gameData";

export default function usePumpMechanic({ gamePhase, currentFish, keysRef, equippedRod, equippedLine, currentWeather, currentBossRef, bossHpRef, setBossHp }) {
  const [tension, setTension] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);
  const tensionRef = useRef(0);

  const [needle, setNeedle] = useState(50);
  const needleRef = useRef(50);
  const needleDirRef = useRef(1);

  const [zoneCenter, setZoneCenter] = useState(50);
  const zoneCenterRef = useRef(50);

  const [hitFeedback, setHitFeedback] = useState(null);
  const [pumpCombo, setPumpCombo] = useState(0);
  const pumpComboRef = useRef(0);

  const spaceWasPressedRef = useRef(false);
  const lastPumpAtRef = useRef(0);

  const rod = RODS[equippedRod];
  const line = LINES[equippedLine];

  const initReeling = () => {
    setTension(0);
    tensionRef.current = 0;
    setReelProgress(0);
    setNeedle(50);
    needleRef.current = 50;
    needleDirRef.current = Math.random() > 0.5 ? 1 : -1;
    setZoneCenter(50);
    zoneCenterRef.current = 50;
    setHitFeedback(null);
    setPumpCombo(0);
    pumpComboRef.current = 0;
    spaceWasPressedRef.current = false;
    lastPumpAtRef.current = 0;
  };

  const cleanup = () => {
    setTension(0);
    tensionRef.current = 0;
    setReelProgress(0);
    setHitFeedback(null);
    setPumpCombo(0);
    pumpComboRef.current = 0;
  };

  const getParams = () => {
    const diff = (currentFish?.difficulty || 1) + (currentWeather.difficultyAdd || 0);
    const isBoss = !!currentBossRef.current;
    const bossMulti = isBoss ? 1.35 : 1;

    const baseZone = 22 + rod.tension * 6 + line.strength * 2;
    const difficultyShrink = Math.max(0.65, 1.05 - diff * 0.06);

    return {
      diff,
      isBoss,
      bossMulti,
      needleSpeed: (0.045 + diff * 0.011) * bossMulti,
      zoneDriftSpeed: (0.008 + diff * 0.0025) * bossMulti,
      zoneJitter: 0.9 + diff * 0.25,
      baseZoneWidth: Math.max(10, Math.min(40, baseZone * difficultyShrink)),
      minPumpIntervalMs: Math.max(140, 220 - rod.power * 25) / (1 + (line.reelBonus ?? 1) * 0.15),
      progressPerfect: (9.5 + rod.power * 3.0) * (line.reelBonus ?? 1),
      progressGood: (5.0 + rod.power * 1.8) * (line.reelBonus ?? 1),
      progressDecay: 0.0015 * diff,
      tensionOnMiss: (7.5 + diff * 2.4) * bossMulti / line.strength,
      tensionOnOverpump: (5.0 + diff * 1.6) * bossMulti / line.strength,
      tensionDecay: 0.12 * line.strength,
      tensionPerfectRelief: 6.5 * line.strength,
      tensionGoodRelief: 2.5 * line.strength,
      bossDamagePerfect: 2.2 * rod.power * (line.reelBonus ?? 1),
      bossDamageGood: 1.2 * rod.power * (line.reelBonus ?? 1),
      bossHealOnMiss: 0.06 * diff,
    };
  };

  useEffect(() => {
    if (gamePhase !== "reeling" || !currentFish) return;

    const params = getParams();
    const bossData = currentBossRef.current;

    let lastTime = performance.now();
    const frameRef = { current: 0 };

    const attemptPump = (now) => {
      const currentTension = tensionRef.current;
      const currentCombo = pumpComboRef.current;

      const zoneWidth = Math.max(6, params.baseZoneWidth * (1 - currentTension / 150));
      const zoneHalf = zoneWidth / 2;
      const perfectHalf = Math.max(2.5, zoneHalf * 0.35);

      const delta = Math.abs(needleRef.current - zoneCenterRef.current);

      const elapsed = now - lastPumpAtRef.current;
      if (lastPumpAtRef.current > 0 && elapsed < params.minPumpIntervalMs) {
        setTension(t => {
          const nextRaw = Math.min(100, t + params.tensionOnOverpump);
          const next = nextRaw >= 99.5 ? 100 : nextRaw;
          tensionRef.current = next;
          return next;
        });
        setPumpCombo(0);
        pumpComboRef.current = 0;
        setHitFeedback({ type: "overpump", id: now });
        setTimeout(() => setHitFeedback(prev => (prev?.type === "overpump" ? null : prev)), 500);
        lastPumpAtRef.current = now;
        return;
      }

      lastPumpAtRef.current = now;

      if (delta <= perfectHalf) {
        const comboBonus = 1 + currentCombo * 0.08;

        if (params.isBoss && bossData) {
          bossHpRef.current = Math.max(0, bossHpRef.current - params.bossDamagePerfect * comboBonus);
          setBossHp(bossHpRef.current);
          const bossMaxHp = bossData.hp;
          setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
        } else {
          setReelProgress(p => {
            const next = Math.min(100, p + params.progressPerfect * comboBonus);
            return next >= 99.5 ? 100 : next;
          });
        }

        setTension(t => {
          const next = Math.max(0, t - params.tensionPerfectRelief);
          tensionRef.current = next;
          return next;
        });
        setPumpCombo(c => {
          const next = c + 1;
          pumpComboRef.current = next;
          return next;
        });
        setHitFeedback({ type: "perfect", id: now });
        setTimeout(() => setHitFeedback(prev => (prev?.type === "perfect" ? null : prev)), 550);
        return;
      }

      if (delta <= zoneHalf) {
        const comboBonus = 1 + currentCombo * 0.04;
        if (params.isBoss && bossData) {
          bossHpRef.current = Math.max(0, bossHpRef.current - params.bossDamageGood * comboBonus);
          setBossHp(bossHpRef.current);
          const bossMaxHp = bossData.hp;
          setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
        } else {
          setReelProgress(p => {
            const next = Math.min(100, p + params.progressGood * comboBonus);
            return next >= 99.5 ? 100 : next;
          });
        }

        setTension(t => {
          const next = Math.max(0, t - params.tensionGoodRelief);
          tensionRef.current = next;
          return next;
        });
        setPumpCombo(c => {
          const next = c + 1;
          pumpComboRef.current = next;
          return next;
        });
        setHitFeedback({ type: "good", id: now });
        setTimeout(() => setHitFeedback(prev => (prev?.type === "good" ? null : prev)), 550);
        return;
      }

      setTension(t => {
        const nextRaw = Math.min(100, t + params.tensionOnMiss);
        const next = nextRaw >= 99.5 ? 100 : nextRaw;
        tensionRef.current = next;
        return next;
      });
      setPumpCombo(0);
      pumpComboRef.current = 0;
      setHitFeedback({ type: "miss", id: now });
      setTimeout(() => setHitFeedback(prev => (prev?.type === "miss" ? null : prev)), 550);

      if (params.isBoss && bossData) {
        const bossMaxHp = bossData.hp;
        bossHpRef.current = Math.min(bossMaxHp, bossHpRef.current + params.bossHealOnMiss);
        setBossHp(bossHpRef.current);
        setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
      } else {
        setReelProgress(p => {
          const next = Math.max(0, p - 0.8);
          return next >= 99.5 ? 100 : next;
        });
      }
    };

    const loop = (now) => {
      const dt = now - lastTime;
      lastTime = now;

      setNeedle(prev => {
        let next = prev + needleDirRef.current * params.needleSpeed * dt;
        if (next <= 0) {
          next = 0;
          needleDirRef.current = 1;
        }
        if (next >= 100) {
          next = 100;
          needleDirRef.current = -1;
        }
        needleRef.current = next;
        return next;
      });

      setZoneCenter(prev => {
        const drift = Math.sin(now / (520 - params.diff * 25)) * 0.04;
        const jitter = (Math.random() - 0.5) * params.zoneJitter * (dt / 33);
        let next = prev + params.zoneDriftSpeed * dt * drift + jitter;
        if (next < 10) next = 10;
        if (next > 90) next = 90;
        zoneCenterRef.current = next;
        return next;
      });

      const spaceNow = !!keysRef.current.space;
      if (spaceNow && !spaceWasPressedRef.current) {
        spaceWasPressedRef.current = true;
        attemptPump(now);
      }
      if (!spaceNow) spaceWasPressedRef.current = false;

      setTension(t => {
        const nextRaw = Math.max(0, t - params.tensionDecay * (dt / 33));
        const next = nextRaw >= 99.5 ? 100 : nextRaw;
        tensionRef.current = next;
        return next;
      });

      if (!params.isBoss) {
        setReelProgress(p => {
          const nextRaw = Math.max(0, p - params.progressDecay * (dt / 33));
          return nextRaw >= 99.5 ? 100 : nextRaw;
        });
      }

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gamePhase, currentFish, equippedRod, equippedLine, currentWeather]);

  const paramsForUi = currentFish ? getParams() : null;
  const zoneWidth = paramsForUi ? Math.max(6, paramsForUi.baseZoneWidth * (1 - tension / 150)) : 20;

  return {
    fishPosition: needle,
    catchZonePos: zoneCenter,
    catchZoneSize: zoneWidth,
    tension,
    reelProgress,
    initReeling,
    cleanup,
    needle,
    zoneCenter,
    zoneWidth,
    hitFeedback,
    pumpCombo,
  };
}
