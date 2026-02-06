import { useState, useEffect, useCallback, useRef } from "react";
import {
  LOCATIONS, FISH_DATABASE, RODS, BAITS, LINES, ACHIEVEMENTS,
  RARITY_NAMES, xpForLevel, SAVE_KEY,
  VARIANTS, VARIANT_ORDER, FISH_BAIT_BONUS, INVENTORY_CAP,
  WEATHER_TYPES, WEATHER_CYCLE_MS,
  WAIT_EVENTS, WAIT_EVENT_CHANCE, WAIT_EVENT_TIMEOUT,
  MISSION_TEMPLATES, MISSION_REWARDS, BOSS_FISH,
} from "../data/gameData";
import {
  playSplash, playBite, playReel, stopReel, updateReelTension,
  playCatch, playEscape, playLevelUp,
} from "../utils/audio";

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const calculateUnlocks = (oldLevel, newLevel) => {
  const unlocks = [];
  for (let lv = oldLevel + 1; lv <= newLevel; lv++) {
    RODS.forEach(r => r.unlockLevel === lv && unlocks.push(r));
    BAITS.forEach(b => b.unlockLevel === lv && unlocks.push(b));
    LINES.forEach(l => l.unlockLevel === lv && unlocks.push(l));
    LOCATIONS.forEach(loc => loc.unlockLevel === lv && unlocks.push(loc));
  }
  return unlocks;
};

function seededRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function getDayNumber() {
  return Math.floor(Date.now() / 86400000);
}

export default function useGameState() {
  const [saved] = useState(() => loadSave());

  // Game state
  const [screen, setScreen] = useState("title");
  const [gamePhase, setGamePhase] = useState("idle");
  const [gold, setGold] = useState(saved?.gold ?? 50);
  const [xp, setXp] = useState(saved?.xp ?? 0);
  const [level, setLevel] = useState(saved?.level ?? 1);
  const [currentLocation, setCurrentLocation] = useState(saved?.currentLocation ?? 0);
  const [equippedRod, setEquippedRod] = useState(saved?.equippedRod ?? 0);
  const [equippedBait, setEquippedBait] = useState(saved?.equippedBait ?? 0);
  const [equippedLine, setEquippedLine] = useState(saved?.equippedLine ?? 0);
  const [ownedRods, setOwnedRods] = useState(saved?.ownedRods ?? [0]);
  const [ownedBaits, setOwnedBaits] = useState(saved?.ownedBaits ?? [0]);
  const [ownedLines, setOwnedLines] = useState(saved?.ownedLines ?? [0]);
  const [caughtFish, setCaughtFish] = useState(saved?.caughtFish ?? {});
  const [totalCaught, setTotalCaught] = useState(saved?.totalCaught ?? 0);
  const [totalGoldEarned, setTotalGoldEarned] = useState(saved?.totalGoldEarned ?? 0);
  const [biggestFish, setBiggestFish] = useState(saved?.biggestFish ?? 0);
  const [unlockedAchievements, setUnlockedAchievements] = useState(saved?.unlockedAchievements ?? []);
  const [tutorialComplete, setTutorialComplete] = useState(saved?.tutorialComplete ?? false);
  const [achievementPopup, setAchievementPopup] = useState(null);
  const [shopTab, setShopTab] = useState("rods");

  // Phase 2 states
  const [baitQuantities, setBaitQuantities] = useState(saved?.baitQuantities ?? {});
  const [fishInventory, setFishInventory] = useState(saved?.fishInventory ?? []);
  const [comboCount, setComboCount] = useState(0);
  const [fishBaitBonus, setFishBaitBonus] = useState(saved?.fishBaitBonus ?? 0);
  const [currentVariant, setCurrentVariant] = useState(null);
  const [maxCombo, setMaxCombo] = useState(saved?.maxCombo ?? 0);
  const [goldenCaught, setGoldenCaught] = useState(saved?.goldenCaught ?? 0);
  const [giantCaught, setGiantCaught] = useState(saved?.giantCaught ?? 0);
  const [fishUsedAsBait, setFishUsedAsBait] = useState(saved?.fishUsedAsBait ?? 0);

  // Phase 3 states
  const [currentWeather, setCurrentWeather] = useState(WEATHER_TYPES[0]);
  const [waitEvent, setWaitEvent] = useState(null);
  const [waitEventResult, setWaitEventResult] = useState(null);
  const [lastMissionDay, setLastMissionDay] = useState(saved?.lastMissionDay ?? 0);
  const [dailyMissions, setDailyMissions] = useState(saved?.dailyMissions ?? []);
  const [missionProgress, setMissionProgress] = useState(saved?.missionProgress ?? {});
  const [missionsCompleted, setMissionsCompleted] = useState(saved?.missionsCompleted ?? 0);
  const [missionStreak, setMissionStreak] = useState(saved?.missionStreak ?? 0);
  const [bossesDefeated, setBossesDefeated] = useState(saved?.bossesDefeated ?? []);
  const [locationCatches, setLocationCatches] = useState(saved?.locationCatches ?? {});
  const [currentBoss, setCurrentBoss] = useState(null);
  const [bossHp, setBossHp] = useState(0);
  const bossHpRef = useRef(0);
  const [migrationDay, setMigrationDay] = useState(saved?.migrationDay ?? 0);
  const [dailyMigrations, setDailyMigrations] = useState(saved?.dailyMigrations ?? []);
  const [weathersFished, setWeathersFished] = useState(() => new Set(saved?.weathersFished ?? []));
  const [nocturnalCaught, setNocturnalCaught] = useState(saved?.nocturnalCaught ?? 0);
  const [waitEventsCollected, setWaitEventsCollected] = useState(saved?.waitEventsCollected ?? 0);
  const [migratoryCaught, setMigratoryCaught] = useState(saved?.migratoryCaught ?? 0);
  const currentBossRef = useRef(null);

  // Audio & Level Up
  const [isMuted, setIsMuted] = useState(saved?.isMuted ?? false);
  const [levelUpData, setLevelUpData] = useState(null);
  const isMutedRef = useRef(isMuted);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // Tutorial state: 0 = off, 1-5 = active steps
  const [tutorialStep, setTutorialStep] = useState(saved?.tutorialComplete ? 0 : 1);

  // Casting state
  const [castPower, setCastPower] = useState(0);
  const [castDirection, setCastDirection] = useState(1);
  const castPowerRef = useRef(0);

  // Fishing state
  const [waitTimer, setWaitTimer] = useState(0);
  const [currentFish, setCurrentFish] = useState(null);
  const [fishWeight, setFishWeight] = useState(0);
  const [bobberExclamation, setBobberExclamation] = useState(false);

  // Reeling state
  const [fishPosition, setFishPosition] = useState(50);
  const fishPositionRef = useRef(50);
  const [catchZonePos, setCatchZonePos] = useState(40);
  const [tension, setTension] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);
  const [fishDir, setFishDir] = useState(1);
  const fishDirRef = useRef(1);
  const [catchResult, setCatchResult] = useState(null);

  // Message
  const [message, setMessage] = useState("");

  const keysRef = useRef({});
  const caughtAtRef = useRef(0);

  // Auto-save
  useEffect(() => {
    const data = {
      gold, xp, level, currentLocation,
      equippedRod, equippedBait, equippedLine,
      ownedRods, ownedBaits, ownedLines,
      caughtFish, totalCaught, totalGoldEarned,
      biggestFish, unlockedAchievements, tutorialComplete,
      isMuted,
      baitQuantities, fishInventory, fishBaitBonus,
      maxCombo, goldenCaught, giantCaught, fishUsedAsBait,
      // Phase 3
      lastMissionDay, dailyMissions, missionProgress, missionsCompleted, missionStreak,
      bossesDefeated, locationCatches,
      migrationDay, dailyMigrations,
      weathersFished: Array.from(weathersFished),
      nocturnalCaught, waitEventsCollected, migratoryCaught,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [
    gold, xp, level, currentLocation,
    equippedRod, equippedBait, equippedLine,
    ownedRods, ownedBaits, ownedLines,
    caughtFish, totalCaught, totalGoldEarned,
    biggestFish, unlockedAchievements, tutorialComplete,
    isMuted,
    baitQuantities, fishInventory, fishBaitBonus,
    maxCombo, goldenCaught, giantCaught, fishUsedAsBait,
    lastMissionDay, dailyMissions, missionProgress, missionsCompleted, missionStreak,
    bossesDefeated, locationCatches,
    migrationDay, dailyMigrations,
    weathersFished, nocturnalCaught, waitEventsCollected, migratoryCaught,
  ]);

  // Tutorial progression: advance step when gamePhase changes
  useEffect(() => {
    if (tutorialStep === 0) return;

    if (gamePhase === "idle" && tutorialStep >= 2) {
      setTutorialStep(1);
    } else if (gamePhase === "casting" && tutorialStep === 1) {
      setTutorialStep(2);
    } else if (gamePhase === "waiting" && tutorialStep === 2) {
      setTutorialStep(3);
    }
  }, [gamePhase, tutorialStep]);

  // Tutorial step 3→4 when bobber exclamation appears
  useEffect(() => {
    if (tutorialStep === 3 && bobberExclamation) {
      setTutorialStep(4);
    }
  }, [bobberExclamation, tutorialStep]);

  // Tutorial step 4→5 when reeling starts
  useEffect(() => {
    if (tutorialStep === 4 && gamePhase === "reeling") {
      setTutorialStep(5);
    }
  }, [gamePhase, tutorialStep]);

  // Tutorial complete when fish is caught during tutorial
  useEffect(() => {
    if (tutorialStep === 5 && gamePhase === "caught") {
      setTutorialStep(0);
      setTutorialComplete(true);
    }
  }, [gamePhase, tutorialStep]);

  // Audio: bite sound when bobber exclamation
  useEffect(() => {
    if (bobberExclamation && !isMutedRef.current) {
      playBite();
    }
  }, [bobberExclamation]);

  // Audio: tension warning sound when tension > 70
  useEffect(() => {
    if (gamePhase === "reeling" && tension > 70 && !isMutedRef.current) {
      playReel();
      updateReelTension(tension);
    } else {
      stopReel();
    }
    return () => stopReel();
  }, [tension, gamePhase]);

  // Weather cycle
  useEffect(() => {
    const rollWeather = () => {
      const idx = Math.floor(Math.random() * WEATHER_TYPES.length);
      setCurrentWeather(WEATHER_TYPES[idx]);
    };
    rollWeather();
    const interval = setInterval(rollWeather, WEATHER_CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  // Daily mission generation
  useEffect(() => {
    const today = getDayNumber();
    if (today !== lastMissionDay) {
      if (lastMissionDay === today - 1) {
        setMissionStreak(prev => prev + 1);
      } else if (lastMissionDay < today - 1 && lastMissionDay > 0) {
        setMissionStreak(0);
      }
      const rng = seededRng(today * 31337);
      const difficulties = ["easy", "medium", "hard"];
      const rarityLabels = ["raro", "épico", "lendário"];
      const missions = difficulties.map((diff, i) => {
        const templateIdx = Math.floor(rng() * MISSION_TEMPLATES.length);
        const template = MISSION_TEMPLATES[templateIdx];
        const target = template.scaling[i];
        return {
          id: `${today}_${i}`,
          templateId: template.id,
          difficulty: diff,
          target,
          textPt: template.textPt.replace("{n}", target).replace("{rarity}", rarityLabels[i]),
          completed: false,
        };
      });
      setDailyMissions(missions);
      setMissionProgress({});
      setLastMissionDay(today);
    }
  }, [lastMissionDay]);

  // Daily migration generation
  useEffect(() => {
    const today = getDayNumber();
    if (today !== migrationDay) {
      const rng = seededRng(today * 7919);
      const migrants = [];
      const count = 2 + Math.floor(rng() * 2);
      const candidates = FISH_DATABASE.filter(f => !f.nocturnal).slice();
      for (let i = 0; i < count && candidates.length > 0; i++) {
        const idx = Math.floor(rng() * candidates.length);
        const fish = candidates.splice(idx, 1)[0];
        const otherLocs = LOCATIONS.filter(l => l.id !== fish.location);
        const newLoc = otherLocs[Math.floor(rng() * otherLocs.length)];
        migrants.push({ fishId: fish.id, originalLocation: fish.location, migratedTo: newLoc.id });
      }
      setDailyMigrations(migrants);
      setMigrationDay(today);
    }
  }, [migrationDay]);

  // Roll variant
  const rollVariant = useCallback(() => {
    const roll = Math.random();
    let cumulative = 0;
    for (const key of VARIANT_ORDER) {
      cumulative += VARIANTS[key].chance;
      if (roll <= cumulative) return VARIANTS[key];
    }
    return VARIANTS.normal;
  }, []);

  // Stats for achievements
  const getStats = useCallback(() => {
    let rareCaught = 0, epicCaught = 0, legendaryCaught = 0, mythicCaught = 0, uniqueSpecies = 0;
    Object.entries(caughtFish).forEach(([id, data]) => {
      uniqueSpecies++;
      const fish = FISH_DATABASE.find(f => f.id === id);
      if (fish) {
        if (fish.rarity === "rare") rareCaught += data.count;
        if (fish.rarity === "epic") epicCaught += data.count;
        if (fish.rarity === "legendary") legendaryCaught += data.count;
        if (fish.rarity === "mythic") mythicCaught += data.count;
      }
    });
    return {
      totalCaught, totalGoldEarned, level, biggestFish,
      rareCaught, epicCaught, legendaryCaught, mythicCaught, uniqueSpecies,
      maxCombo, goldenCaught, giantCaught,
      trophyCount: fishInventory.filter(f => f.isTrophy).length,
      fishUsedAsBait,
      // Phase 3
      weathersFished: weathersFished instanceof Set ? weathersFished.size : (Array.isArray(weathersFished) ? weathersFished.length : 0),
      nocturnalCaught, missionsCompleted,
      bossesDefeated: bossesDefeated.length,
      waitEventsCollected, migratoryCaught,
    };
  }, [caughtFish, totalCaught, totalGoldEarned, level, biggestFish, maxCombo, goldenCaught, giantCaught, fishInventory, fishUsedAsBait, weathersFished, nocturnalCaught, missionsCompleted, bossesDefeated, waitEventsCollected, migratoryCaught]);

  // Check achievements
  const checkAchievements = useCallback(() => {
    const stats = getStats();
    ACHIEVEMENTS.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.check(stats)) {
        setUnlockedAchievements(prev => [...prev, ach.id]);
        setAchievementPopup(ach);
        setTimeout(() => setAchievementPopup(null), 3000);
      }
    });
  }, [getStats, unlockedAchievements]);

  useEffect(() => {
    checkAchievements();
  }, [totalCaught, level, gold, caughtFish, maxCombo, goldenCaught, giantCaught, fishInventory, fishUsedAsBait, weathersFished, nocturnalCaught, missionsCompleted, bossesDefeated, waitEventsCollected, migratoryCaught]);

  // Add XP and handle level up
  const addXp = useCallback((amount) => {
    setXp(prev => {
      let newXp = prev + amount;
      let newLevel = level;
      while (newXp >= xpForLevel(newLevel)) {
        newXp -= xpForLevel(newLevel);
        newLevel++;
      }
      if (newLevel > level) {
        setLevel(newLevel);
        setMessage(`NIVEL ${newLevel}! Novas possibilidades desbloqueadas!`);
        const unlocks = calculateUnlocks(level, newLevel);
        setLevelUpData({ level: newLevel, unlocks });
        if (!isMutedRef.current) playLevelUp();
      }
      return newXp;
    });
  }, [level]);

  // Select fish based on location, bait, rod, weather, migrations
  const selectFish = useCallback(() => {
    const loc = LOCATIONS[currentLocation];
    const bait = BAITS[equippedBait];
    const rod = RODS[equippedRod];
    const isNight = currentWeather.id === "night";

    // Track weather for achievement
    setWeathersFished(prev => {
      const next = new Set(prev);
      next.add(currentWeather.id);
      return next;
    });

    // Boss spawn check
    const locCatches = locationCatches[loc.id] || 0;
    const boss = BOSS_FISH.find(b => b.location === loc.id);
    if (boss && locCatches >= boss.spawnAfterCatches && !bossesDefeated.includes(boss.id) && Math.random() < boss.spawnChance) {
      return { ...boss, isBoss: true };
    }

    // Build fish pool: local fish + migratory fish
    let available = FISH_DATABASE.filter(f => {
      if (f.location !== loc.id) return false;
      if (f.nocturnal && !isNight) return false;
      return true;
    });

    // Add migratory fish to this location
    const migrantsHere = dailyMigrations.filter(m => m.migratedTo === loc.id);
    for (const m of migrantsHere) {
      const fish = FISH_DATABASE.find(f => f.id === m.fishId);
      if (fish && !(fish.nocturnal && !isNight)) {
        available.push({ ...fish, isMigratory: true });
      }
    }

    const rarityWeights = { common: 50, uncommon: 25, rare: 12, epic: 5, legendary: 2, mythic: 0.5 };

    const weightedFish = available.map(f => {
      let weight = rarityWeights[f.rarity] || 1;
      if (f.rarity !== "common") weight *= (1 + bait.rarityBonus + rod.luck + fishBaitBonus + currentWeather.rarityBonus);
      return { fish: f, weight };
    });

    const totalWeight = weightedFish.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const wf of weightedFish) {
      roll -= wf.weight;
      if (roll <= 0) return wf.fish;
    }
    return weightedFish[0].fish;
  }, [currentLocation, equippedBait, equippedRod, fishBaitBonus, currentWeather, dailyMigrations, locationCatches, bossesDefeated]);

  // Start casting
  const startCasting = () => {
    if (gamePhase !== "idle") return;

    const bait = BAITS[equippedBait];
    if (bait.consumable && (baitQuantities[bait.id] || 0) <= 0) {
      setEquippedBait(0);
      setMessage("Isca acabou! Voltando para minhoca.");
      return;
    }

    setGamePhase("casting");
    setCastPower(0);
    setCastDirection(1);
    setMessage("Segure ESPACO para lancar...");
  };

  // Release cast
  const releaseCast = () => {
    if (gamePhase !== "casting") return;
    setGamePhase("waiting");
    const bait = BAITS[equippedBait];
    const power = castPowerRef.current;
    const waitTime = Math.max(1, 5 - bait.attraction * 0.5 - power * 0.02 + Math.random() * 3);
    setWaitTimer(waitTime);
    setBobberExclamation(false);
    setMessage("Esperando o peixe morder...");
    if (!isMutedRef.current) playSplash();

    // Consume bait
    if (bait.consumable) {
      setBaitQuantities(prev => {
        const newQty = (prev[bait.id] || 0) - 1;
        const updated = { ...prev, [bait.id]: Math.max(0, newQty) };
        if (newQty <= 0) {
          setEquippedBait(0);
        }
        return updated;
      });
    }

    // Clear fish bait bonus after use
    if (fishBaitBonus > 0) {
      setFishBaitBonus(0);
    }
  };

  // Hook fish
  const hookFish = () => {
    const fish = selectFish();
    const variant = fish.isBoss ? VARIANTS.normal : rollVariant();
    const baseWeight = fish.minWeight + Math.random() * (fish.maxWeight - fish.minWeight);
    const weight = Math.round(baseWeight * variant.weightMultiplier * 100) / 100;
    setCurrentFish(fish);
    setFishWeight(weight);
    setCurrentVariant(variant);
    setGamePhase("reeling");
    setFishPosition(50);
    fishPositionRef.current = 50;
    setCatchZonePos(50);
    setTension(0);
    setReelProgress(0);
    const initialDir = Math.random() > 0.5 ? 1 : -1;
    setFishDir(initialDir);
    fishDirRef.current = initialDir;

    if (fish.isBoss) {
      setCurrentBoss(fish);
      currentBossRef.current = fish;
      setBossHp(fish.hp);
      bossHpRef.current = fish.hp;
      setMessage(`⚔️ BOSS: ${fish.emoji} ${fish.name}! Prepare-se para a luta!`);
    } else {
      setCurrentBoss(null);
      currentBossRef.current = null;
      const variantLabel = variant.id !== "normal" ? ` [${variant.namePt}]` : "";
      setMessage(`${fish.emoji} ${fish.name}${variantLabel} (${RARITY_NAMES[fish.rarity]}) mordeu! Mantenha no alvo!`);
    }
  };

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.space = true;

        if (screen === "game") {
          if (gamePhase === "idle") {
            startCasting();
          } else if (gamePhase === "waiting" && bobberExclamation) {
            hookFish();
          }
          // Removed: space no longer resets from "caught" phase (3 buttons now)
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        keysRef.current.space = false;

        if (gamePhase === "casting") {
          releaseCast();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gamePhase, screen, bobberExclamation]);

  // Casting animation
  useEffect(() => {
    if (gamePhase !== "casting") return;
    const interval = setInterval(() => {
      setCastPower(prev => {
        const next = prev + castDirection * 2;
        let val;
        if (next >= 100) { setCastDirection(-1); val = 100; }
        else if (next <= 0) { setCastDirection(1); val = 0; }
        else { val = next; }
        castPowerRef.current = val;
        return val;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [gamePhase, castDirection]);

  // Collect wait event
  const collectWaitEvent = useCallback(() => {
    if (!waitEvent) return;
    const evt = waitEvent.event;
    setWaitEvent(null);
    setWaitEventsCollected(prev => prev + 1);
    if (evt.reward === "gold") {
      setGold(prev => prev + evt.rewardAmount);
      setTotalGoldEarned(prev => prev + evt.rewardAmount);
    }
    if (evt.reward === "xp") addXp(evt.rewardAmount);
    if (evt.reward === "bait") {
      const baitItem = BAITS[equippedBait];
      if (baitItem.consumable) {
        setBaitQuantities(prev => ({ ...prev, [baitItem.id]: (prev[baitItem.id] || 0) + evt.rewardAmount }));
      }
    }
    setWaitEventResult({ event: evt, reward: evt.reward, amount: evt.rewardAmount });
    setTimeout(() => setWaitEventResult(null), 1500);
  }, [waitEvent, equippedBait, addXp]);

  // Wait timer + wait events
  useEffect(() => {
    if (gamePhase !== "waiting") {
      setWaitEvent(null);
      return;
    }
    const interval = setInterval(() => {
      // Wait event roll
      setWaitEvent(prev => {
        if (prev) {
          if (Date.now() > prev.expiresAt) return null;
          return prev;
        }
        if (Math.random() < WAIT_EVENT_CHANCE) {
          const roll = Math.random();
          let cum = 0;
          for (const evt of WAIT_EVENTS) {
            cum += evt.chance;
            if (roll <= cum) {
              return { event: evt, expiresAt: Date.now() + WAIT_EVENT_TIMEOUT };
            }
          }
        }
        return null;
      });

      setWaitTimer(prev => {
        if (prev <= 0) {
          setBobberExclamation(true);
          setMessage("PEIXE! Aperte ESPACO agora!");
          setTimeout(() => {
            setGamePhase(prev2 => {
              if (prev2 === "waiting") {
                setMessage("O peixe escapou... Tente de novo!");
                setBobberExclamation(false);
                return "idle";
              }
              return prev2;
            });
          }, 2000);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gamePhase]);

  // Reeling game loop
  useEffect(() => {
    if (gamePhase !== "reeling" || !currentFish) return;

    const rod = RODS[equippedRod];
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
          // Fast oscillation with increasing amplitude
          if (changeTimer <= 0) {
            fishDirRef.current = -fishDirRef.current;
            setFishDir(fishDirRef.current);
            changeTimer = 8 + Math.random() * 12;
          }
        } else if (pattern === "charge") {
          // Rush then pause
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
          // Boss: reduce HP instead of increasing reel progress
          if (inZone) {
            bossHpRef.current = Math.max(0, bossHpRef.current - 0.5 * rod.power * reelBonus);
            setBossHp(bossHpRef.current);
            const bossMaxHp = bossData ? bossData.hp : 100;
            setReelProgress(((bossMaxHp - bossHpRef.current) / bossMaxHp) * 100);
          } else {
            // Boss recovers a tiny bit
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

  // Mission progress tracking
  const updateMissionProgress = useCallback((type, value) => {
    setMissionProgress(prev => {
      const next = { ...prev };
      let anyCompleted = false;
      setDailyMissions(missions => {
        const updated = missions.map(m => {
          if (m.completed) return m;
          const template = MISSION_TEMPLATES.find(t => t.id === m.templateId);
          if (!template || template.type !== type) return m;
          const current = type === "combo" || type === "weight"
            ? Math.max(next[m.id] || 0, value)
            : (next[m.id] || 0) + value;
          next[m.id] = current;
          if (current >= m.target && !m.completed) {
            anyCompleted = true;
            const reward = MISSION_REWARDS[m.difficulty];
            setGold(g => g + reward.gold);
            setTotalGoldEarned(g => g + reward.gold);
            setMissionsCompleted(c => c + 1);
            return { ...m, completed: true };
          }
          return m;
        });
        return updated;
      });
      return next;
    });
  }, []);

  // Check win/lose conditions
  useEffect(() => {
    if (gamePhase !== "reeling") return;

    if (tension >= 100) {
      setGamePhase("escaped");
      setCatchResult(null);
      setComboCount(0);
      setCurrentBoss(null);
      currentBossRef.current = null;
      setMessage(`A linha arrebentou! ${currentFish?.name} escapou...`);
      if (!isMutedRef.current) playEscape();
      setTimeout(() => setGamePhase("idle"), 2500);
    }

    if (reelProgress >= 100) {
      setGamePhase("caught");
      caughtAtRef.current = Date.now();
      const fish = currentFish;
      const weight = fishWeight;
      const variant = currentVariant || VARIANTS.normal;
      const isBoss = !!fish.isBoss;
      const isMigratory = !!fish.isMigratory;

      // Location catch tracking
      const loc = LOCATIONS[currentLocation];
      setLocationCatches(prev => ({ ...prev, [loc.id]: (prev[loc.id] || 0) + 1 }));

      if (isBoss) {
        // Boss defeated!
        setBossesDefeated(prev => [...prev, fish.id]);
        // Reset location catches so boss can be re-fought later
        setLocationCatches(prev => ({ ...prev, [loc.id]: 0 }));
        // Grant boss drop
        const dropItems = fish.dropType === "rods" ? RODS : fish.dropType === "baits" ? BAITS : LINES;
        const dropIdx = dropItems.findIndex(item => item.id === fish.dropId);
        if (dropIdx >= 0) {
          if (fish.dropType === "rods") setOwnedRods(prev => prev.includes(dropIdx) ? prev : [...prev, dropIdx]);
          else if (fish.dropType === "baits") setOwnedBaits(prev => prev.includes(dropIdx) ? prev : [...prev, dropIdx]);
          else setOwnedLines(prev => prev.includes(dropIdx) ? prev : [...prev, dropIdx]);
        }
        const sellPrice = fish.basePrice;
        setCatchResult({ fish, weight, sellPrice, variant, comboCount: comboCount + 1, comboMultiplier: 1, isBoss: true, dropType: fish.dropType, dropId: fish.dropId });
        setTotalCaught(prev => prev + 1);
        addXp(fish.xp || 500);
        if (!isMutedRef.current) playCatch("mythic");
        setCurrentBoss(null);
        currentBossRef.current = null;
        return;
      }

      const priceRatio = 1 + (weight / variant.weightMultiplier - fish.minWeight) / (fish.maxWeight - fish.minWeight);
      const basePrice = Math.floor(fish.basePrice * priceRatio * variant.priceMultiplier);
      const newCombo = comboCount + 1;
      setComboCount(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      const comboMult = Math.min(1 + (newCombo - 1) * 0.5, 2.5);
      const sellPrice = Math.floor(basePrice * comboMult);

      // Migratory bonus XP
      const xpBonus = isMigratory ? Math.floor(fish.xp * 0.5) : 0;

      setCatchResult({ fish, weight, sellPrice, variant, comboCount: newCombo, comboMultiplier: comboMult, isMigratory });

      setTotalCaught(prev => prev + 1);
      if (weight > biggestFish) setBiggestFish(weight);
      addXp(fish.xp + xpBonus);
      if (!isMutedRef.current) playCatch(fish.rarity);

      if (variant.id === "golden") setGoldenCaught(prev => prev + 1);
      if (variant.id === "giant") setGiantCaught(prev => prev + 1);
      if (fish.nocturnal) setNocturnalCaught(prev => prev + 1);
      if (isMigratory) setMigratoryCaught(prev => prev + 1);

      setCaughtFish(prev => {
        const existing = prev[fish.id] || { count: 0, biggest: 0, smallest: Infinity };
        const variants = existing.variants || { normal: 0, golden: 0, giant: 0 };
        return {
          ...prev,
          [fish.id]: {
            count: existing.count + 1,
            biggest: Math.max(existing.biggest, weight),
            smallest: Math.min(existing.smallest, weight),
            variants: { ...variants, [variant.id]: (variants[variant.id] || 0) + 1 },
          }
        };
      });

      // Mission progress
      updateMissionProgress("catch", 1);
      updateMissionProgress("weight", weight);
      updateMissionProgress("combo", newCombo);
      // Rarity-based mission (rare+)
      if (["rare", "epic", "legendary", "mythic"].includes(fish.rarity)) {
        updateMissionProgress("catch_rarity", 1);
      }
    }
  }, [tension, reelProgress, gamePhase]);

  // Reset fishing
  const resetFishing = () => {
    setGamePhase("idle");
    setCatchResult(null);
    setCurrentFish(null);
    setCurrentVariant(null);
    setMessage("");
  };

  // Sell fish from catch card
  const sellFish = () => {
    if (!catchResult) return;
    setGold(prev => prev + catchResult.sellPrice);
    setTotalGoldEarned(prev => prev + catchResult.sellPrice);
    updateMissionProgress("gold", catchResult.sellPrice);
    resetFishing();
  };

  // Keep fish in inventory
  const keepFish = () => {
    if (!catchResult) return;
    if (fishInventory.length >= INVENTORY_CAP) {
      setGold(prev => prev + catchResult.sellPrice);
      setTotalGoldEarned(prev => prev + catchResult.sellPrice);
      setMessage("Inventário cheio! Peixe vendido automaticamente.");
      resetFishing();
      return;
    }
    setFishInventory(prev => [...prev, {
      id: Date.now(),
      fishId: catchResult.fish.id,
      name: catchResult.fish.name,
      emoji: catchResult.fish.emoji,
      rarity: catchResult.fish.rarity,
      weight: catchResult.weight,
      sellPrice: catchResult.sellPrice,
      variant: catchResult.variant,
      isTrophy: false,
      caughtAt: Date.now(),
    }]);
    resetFishing();
  };

  // Use fish as bait
  const useFishAsBait = () => {
    if (!catchResult) return;
    const bonus = FISH_BAIT_BONUS[catchResult.fish.rarity] || 0.05;
    setFishBaitBonus(bonus);
    setFishUsedAsBait(prev => prev + 1);
    resetFishing();
  };

  // Inventory actions
  const sellInventoryFish = (index) => {
    const fish = fishInventory[index];
    if (!fish || fish.isTrophy) return;
    setGold(prev => prev + fish.sellPrice);
    setTotalGoldEarned(prev => prev + fish.sellPrice);
    setFishInventory(prev => prev.filter((_, i) => i !== index));
  };

  const bulkSellInventory = () => {
    let totalSell = 0;
    setFishInventory(prev => {
      const kept = [];
      for (const fish of prev) {
        if (fish.isTrophy) {
          kept.push(fish);
        } else {
          totalSell += fish.sellPrice;
        }
      }
      return kept;
    });
    if (totalSell > 0) {
      setGold(prev => prev + totalSell);
      setTotalGoldEarned(prev => prev + totalSell);
    }
  };

  const toggleTrophy = (index) => {
    setFishInventory(prev => prev.map((fish, i) =>
      i === index ? { ...fish, isTrophy: !fish.isTrophy } : fish
    ));
  };

  const useInventoryFishAsBait = (index) => {
    const fish = fishInventory[index];
    if (!fish) return;
    const bonus = FISH_BAIT_BONUS[fish.rarity] || 0.05;
    setFishBaitBonus(bonus);
    setFishUsedAsBait(prev => prev + 1);
    setFishInventory(prev => prev.filter((_, i) => i !== index));
  };

  // Buy / equip item
  const buyItem = (type, index) => {
    const items = type === "rods" ? RODS : type === "baits" ? BAITS : LINES;
    const item = items[index];
    if (!item || gold < item.price) return;
    if (item.unlockLevel && level < item.unlockLevel) return;

    const owned = type === "rods" ? ownedRods : type === "baits" ? ownedBaits : ownedLines;

    // Consumable bait: allow rebuy
    if (type === "baits" && item.consumable) {
      if (owned.includes(index)) {
        // Already owned: check if just equipping (free) or rebuying
        if (gold < item.price) {
          // Just equip
          setEquippedBait(index);
          return;
        }
        // Rebuy stack
        setGold(prev => prev - item.price);
        setBaitQuantities(prev => ({
          ...prev,
          [item.id]: (prev[item.id] || 0) + item.stackSize,
        }));
        setEquippedBait(index);
        return;
      }
      // First purchase
      setGold(prev => prev - item.price);
      setOwnedBaits(prev => [...prev, index]);
      setBaitQuantities(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + item.stackSize,
      }));
      setEquippedBait(index);
      return;
    }

    if (owned.includes(index)) {
      if (type === "rods") setEquippedRod(index);
      else if (type === "baits") setEquippedBait(index);
      else setEquippedLine(index);
      return;
    }

    setGold(prev => prev - item.price);
    if (type === "rods") { setOwnedRods(prev => [...prev, index]); setEquippedRod(index); }
    else if (type === "baits") { setOwnedBaits(prev => [...prev, index]); setEquippedBait(index); }
    else { setOwnedLines(prev => [...prev, index]); setEquippedLine(index); }
  };

  // Equip consumable bait (without buying)
  const equipBait = (index) => {
    const item = BAITS[index];
    if (!item) return;
    if (!ownedBaits.includes(index)) return;
    if (item.consumable && (baitQuantities[item.id] || 0) <= 0) return;
    setEquippedBait(index);
  };

  // Derived values
  const rod = RODS[equippedRod];
  const bait = BAITS[equippedBait];
  const line = LINES[equippedLine];
  const loc = LOCATIONS[currentLocation];
  const catchZoneSize = 15 + rod.tension * 3;
  const xpNeeded = xpForLevel(level);
  const xpPercent = (xp / xpNeeded) * 100;

  return {
    // Screen
    screen, setScreen,
    // Game phase
    gamePhase, message,
    // Player
    gold, xp, level, xpPercent,
    // Location
    currentLocation, setCurrentLocation, loc,
    // Equipment
    rod, bait, line,
    ownedRods, ownedBaits, ownedLines,
    equippedRod, equippedBait, equippedLine,
    shopTab, setShopTab,
    // Casting
    castPower,
    // Fishing
    bobberExclamation,
    currentFish, fishWeight,
    fishPosition, catchZonePos, catchZoneSize,
    tension, reelProgress,
    catchResult,
    // Stats
    totalCaught, totalGoldEarned, biggestFish, caughtFish,
    unlockedAchievements, achievementPopup,
    // Phase 2
    baitQuantities, fishInventory, comboCount, currentVariant, fishBaitBonus,
    sellFish, keepFish, useFishAsBait,
    sellInventoryFish, bulkSellInventory, toggleTrophy, useInventoryFishAsBait,
    equipBait,
    // Phase 3
    currentWeather,
    waitEvent, waitEventResult, collectWaitEvent,
    dailyMissions, missionProgress, missionsCompleted, missionStreak,
    currentBoss, bossHp,
    bossesDefeated, locationCatches,
    dailyMigrations,
    // Actions
    startCasting, releaseCast, resetFishing, buyItem, hookFish,
    // Save
    hasSaveData: saved !== null,
    // Tutorial
    tutorialStep,
    // Refs
    keysRef,
    // Audio & Level Up
    isMuted, setIsMuted,
    levelUpData, setLevelUpData,
  };
}
