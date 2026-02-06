import { useState, useEffect, useCallback, useRef } from "react";
import {
  LOCATIONS, FISH_DATABASE, RODS, BAITS, LINES, ACHIEVEMENTS,
  RARITY_NAMES, xpForLevel, SAVE_KEY,
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
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }, [
    gold, xp, level, currentLocation,
    equippedRod, equippedBait, equippedLine,
    ownedRods, ownedBaits, ownedLines,
    caughtFish, totalCaught, totalGoldEarned,
    biggestFish, unlockedAchievements, tutorialComplete,
    isMuted,
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
    return { totalCaught, totalGoldEarned, level, biggestFish, rareCaught, epicCaught, legendaryCaught, mythicCaught, uniqueSpecies };
  }, [caughtFish, totalCaught, totalGoldEarned, level, biggestFish]);

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
  }, [totalCaught, level, gold, caughtFish]);

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

  // Select fish based on location, bait, rod
  const selectFish = useCallback(() => {
    const loc = LOCATIONS[currentLocation];
    const bait = BAITS[equippedBait];
    const rod = RODS[equippedRod];
    const available = FISH_DATABASE.filter(f => f.location === loc.id);

    const rarityWeights = { common: 50, uncommon: 25, rare: 12, epic: 5, legendary: 2, mythic: 0.5 };

    const weightedFish = available.map(f => {
      let weight = rarityWeights[f.rarity] || 1;
      if (f.rarity !== "common") weight *= (1 + bait.rarityBonus + rod.luck);
      return { fish: f, weight };
    });

    const totalWeight = weightedFish.reduce((sum, w) => sum + w.weight, 0);
    let roll = Math.random() * totalWeight;

    for (const wf of weightedFish) {
      roll -= wf.weight;
      if (roll <= 0) return wf.fish;
    }
    return weightedFish[0].fish;
  }, [currentLocation, equippedBait, equippedRod]);

  // Start casting
  const startCasting = () => {
    if (gamePhase !== "idle") return;
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
  };

  // Hook fish
  const hookFish = () => {
    const fish = selectFish();
    const weight = fish.minWeight + Math.random() * (fish.maxWeight - fish.minWeight);
    setCurrentFish(fish);
    setFishWeight(Math.round(weight * 100) / 100);
    setGamePhase("reeling");
    setFishPosition(50);
    fishPositionRef.current = 50;
    setCatchZonePos(50);
    setTension(0);
    setReelProgress(0);
    const initialDir = Math.random() > 0.5 ? 1 : -1;
    setFishDir(initialDir);
    fishDirRef.current = initialDir;
    setMessage(`${fish.emoji} ${fish.name} (${RARITY_NAMES[fish.rarity]}) mordeu! Mantenha no alvo!`);
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
          } else if (gamePhase === "caught" && Date.now() - caughtAtRef.current > 800) {
            resetFishing();
          }
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

  // Wait timer
  useEffect(() => {
    if (gamePhase !== "waiting") return;
    const interval = setInterval(() => {
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
    const difficulty = currentFish.difficulty;
    const speed = currentFish.speed;
    const catchZoneSizeLocal = 15 + rod.tension * 3;
    let changeTimer = 0;

    const interval = setInterval(() => {
      changeTimer -= 1;
      if (changeTimer <= 0) {
        const newDir = Math.random() > 0.5 ? 1 : -1;
        fishDirRef.current = newDir;
        setFishDir(newDir);
        changeTimer = Math.random() * 60 + 20;
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

        setTension(prev => {
          let newTension = prev;
          if (keysRef.current.space && !inZone) {
            newTension += 0.8 * difficulty / line.strength;
          } else if (inZone && keysRef.current.space) {
            newTension -= 0.3 * line.strength;
          } else {
            newTension -= 0.5;
          }
          return Math.max(0, Math.min(100, newTension));
        });

        setReelProgress(prev => {
          if (inZone) {
            return Math.min(100, prev + 0.3 * rod.power);
          }
          return Math.max(0, prev - 0.15 * difficulty);
        });

        return currentCatchZone;
      });
    }, 33);

    return () => clearInterval(interval);
  }, [gamePhase, currentFish, equippedRod, equippedLine]);

  // Check win/lose conditions
  useEffect(() => {
    if (gamePhase !== "reeling") return;

    if (tension >= 100) {
      setGamePhase("escaped");
      setCatchResult(null);
      setMessage(`A linha arrebentou! ${currentFish?.name} escapou...`);
      if (!isMutedRef.current) playEscape();
      setTimeout(() => setGamePhase("idle"), 2500);
    }

    if (reelProgress >= 100) {
      setGamePhase("caught");
      caughtAtRef.current = Date.now();
      const fish = currentFish;
      const weight = fishWeight;
      const priceMultiplier = 1 + (weight - fish.minWeight) / (fish.maxWeight - fish.minWeight);
      const sellPrice = Math.floor(fish.basePrice * priceMultiplier);

      setCatchResult({ fish, weight, sellPrice });
      setGold(prev => prev + sellPrice);
      setTotalGoldEarned(prev => prev + sellPrice);
      setTotalCaught(prev => prev + 1);
      if (weight > biggestFish) setBiggestFish(weight);
      addXp(fish.xp);
      if (!isMutedRef.current) playCatch(fish.rarity);

      setCaughtFish(prev => {
        const existing = prev[fish.id] || { count: 0, biggest: 0, smallest: Infinity };
        return {
          ...prev,
          [fish.id]: {
            count: existing.count + 1,
            biggest: Math.max(existing.biggest, weight),
            smallest: Math.min(existing.smallest, weight),
          }
        };
      });
    }
  }, [tension, reelProgress, gamePhase]);

  // Reset fishing
  const resetFishing = () => {
    setGamePhase("idle");
    setCatchResult(null);
    setCurrentFish(null);
    setMessage("");
  };

  // Buy / equip item
  const buyItem = (type, index) => {
    const items = type === "rods" ? RODS : type === "baits" ? BAITS : LINES;
    const item = items[index];
    if (!item || gold < item.price) return;
    if (item.unlockLevel && level < item.unlockLevel) return;

    const owned = type === "rods" ? ownedRods : type === "baits" ? ownedBaits : ownedLines;
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
